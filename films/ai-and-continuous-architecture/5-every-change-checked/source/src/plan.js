/* ===== Every change, checked: this film's pictures =====
   Babylon is drawn with the series' components (../../../shared/src/aca.js: the sky, the city, its people as silhouettes, brick and
   clay) and with The AI platform's view of the river wall from across the water; the present with The map before the data's (ea.js:
   the layers as slabs of glass, ArchiMate's glyphs) and the agent from Keeping it true (kt_agent, through aca_agent). Here: what only
   this film draws, prefixed a5_. Made to read on a phone: every word is at least 28 px in the frame, or marked deco:1 as texture. */

// the sides of the utility, as the series colours them: the network in blue, retail in rose, households warm; and the layers' colours
const A5_NET=[132,176,255],A5_RET=[255,150,186],A5_HH=[255,214,170],A5_RED=[236,104,92],A5_OK=[132,226,160],A5_DIM=[118,126,146];
const A5_MOT=LAY6[0][1],A5_STR=LAY6[1][1],A5_BUS=LAY6[2][1],A5_INF=LAY6[3][1],A5_APP=LAY6[4][1],A5_TEC=LAY6[5][1];

// a face that changes from one expression to another over a moment, never in one frame: m (0..1) mixes a into b (as Data
// architecture's daExpr does)
function a5_expr(a,b,m){if(!(m>0))return a;if(m>=1)return b;const A=EXPR[a],B=EXPR[b],o={},q=Math.round(m*20)/20;
  for(const k of new Set([...Object.keys(A),...Object.keys(B)])){const u=A[k]==null?0:A[k],v=B[k]==null?0:B[k];o[k]=u+(v-u)*q;}
  if(B.happy&&q<1)delete o.happy;const key="__a5_"+a+"_"+b+"_"+q;EXPR[key]=o;return key;}
// the person seen from the left: a mirror of When things go wrong's person(), for someone on the right of the frame facing in
function a5_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}

/* ---------- a whole picture that fades as one ---------- */
// A picture that leaves while another comes in, in one chapter, is drawn into a reused canvas and laid over at its opacity, so its
// parts never show through each other as it fades (a wall through the water, a person through what's behind them). One canvas for
// each level of nesting, reused frame to frame; the opacity it's laid over at includes any already set. Returns what fn returns.
const A5_BUFS=[];let A5_DEPTH=0;
function a5_fade(ctx,a,fn){const ga=ctx.globalAlpha*a;if(ga<=0.002)return null;if(ga>=0.998){ctx.save();const r=fn(ctx);ctx.restore();return r;}const cv=ctx.canvas,d=A5_DEPTH;
  let b=A5_BUFS[d];if(!b||b.width!==cv.width||b.height!==cv.height)b=A5_BUFS[d]=mkCanvas(cv.width,cv.height);const o=b.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());A5_DEPTH++;let r=null;try{r=fn(o);}finally{A5_DEPTH--;}o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.drawImage(b,0,0);ctx.restore();return r;}
// one of Babylon's people (bab_folk), faded in and out as one picture, so the lit edge never shows through the body
function a5_folk(ctx,x,y,h,kind,t,o){o=o||{};const a=o.a==null?1:o.a;return a5_fade(ctx,a,c2=>bab_folk(c2,x,y,h,kind,t,{...o,a:1}));}
// a person, standing, faded in and out as one picture: at the left of the frame, or (o.right) at the right, mirrored to face in
function a5_who(ctx,id,x,a,t,o){o=o||{};if(a<=0.01)return;a5_fade(ctx,a,cx=>{const q={t,pose:"stand",expr:o.expr||"calm"};if(o.right)a5_personR(cx,id,x,1060,0.78,q);else person(cx,id,x,1060,0.78,q);});}
// a person's name, over their head: at the left of the frame or (right) at the right
function a5_name(ctx,s,a,right){if(a>0.01)withA(ctx,a,()=>tag(ctx,right?1880-tw(ctx,s,28,700)-26:40,606,s,BIZ,{size:28}));}

/* ---------- 1. Babylon: the river wall, from across the water ---------- */
// As The AI platform draws it (its a2_view, here without the storm): the city's two walls of mud brick, the bank, and the embankment
// of baked brick at the water's edge, with the walls in the river. The world is wider than the frame, so the camera can move over it.
const A5_HZ=560,A5_IN=[700,150],A5_OUT=[766,84],A5_WY=832,A5_EMB=788,A5_X0=-900,A5_X1=2900;
const A5_INW={sp:210,tw:78,th:30,haze:0.35},A5_OUTW={sp:150,tw:56,th:20};
// the top of a city wall at x: its towers every o.sp px, o.tw wide and o.th higher
function a5_top(x,x0,by,h,o){const sp=o.sp||200,u=((x-x0)%sp+sp)%sp;return by-h-(Math.abs(u-sp/2)<(o.tw||74)/2?(o.th||28):0);}
// a stretch of city wall in mud brick, seen from outside in the morning: its face in shade, the sky's light along its top and down
// the eastern (right) side of each tower, its courses, and stepped battlements along its top; o.haze (0..1): how far off it is
function a5_wall(ctx,x0,x1,by,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[dw,dy]=bab_light(o),sp=o.sp||200,tw_=o.tw||74,th=o.th||28,hz=o.haze||0;
  const sky=mix(mix([20,16,28],[150,96,84],dw),[200,180,160],dy);let face=mix(mix([10,8,10],[56,38,32],dw),[118,96,76],dy);face=mix(face,sky,0.32*hz);
  const top_=mix(face,mix(BAB_SUN,sky,0.4),0.22+0.12*dw),foot=mix(face,[4,3,4],0.35),rim=mix(BAB_SUN,[255,236,210],0.2),top=x=>a5_top(x,x0,by,h,o);
  withA(ctx,a,()=>{ctx.save();
    ctx.beginPath();ctx.moveTo(x0,by+2);for(let x=x0;x<=x1;x+=3){const u=((x-x0)%sp+sp)%sp;if(Math.abs(Math.abs(u-sp/2)-tw_/2)<1.6)ctx.lineTo(x,top(x-2));ctx.lineTo(x,top(x));}ctx.lineTo(x1,by+2);ctx.closePath();
    const g=ctx.createLinearGradient(0,by-h-th,0,by);g.addColorStop(0,rgba(top_,1));g.addColorStop(0.35,rgba(face,1));g.addColorStop(1,rgba(foot,1));ctx.fillStyle=g;ctx.fill();ctx.save();ctx.clip();
    for(let tx=x0+sp/2;tx<x1+sp;tx+=sp){ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(tx-tw_/2-8,by-h-th-2,8,h+th+4);ctx.fillStyle="rgba(0,0,0,0.08)";ctx.fillRect(tx-tw_/2,by-h-th-2,tw_*0.45,h+th+4);
      const rg=ctx.createLinearGradient(tx+tw_/2-10,0,tx+tw_/2,0);rg.addColorStop(0,rgba(rim,0));rg.addColorStop(1,rgba(rim,0.1+0.22*dw+0.08*dy));ctx.fillStyle=rg;ctx.fillRect(tx+tw_/2-10,by-h-th-2,10,h+th+4);}
    ctx.strokeStyle="rgba(0,0,0,0.1)";ctx.lineWidth=1;ctx.beginPath();for(let y=by-5;y>by-h-th;y-=6){ctx.moveTo(x0,y);ctx.lineTo(x1,y);}ctx.stroke();
    ctx.fillStyle="rgba(0,0,0,0.07)";for(let i=0;i<(x1-x0)/26;i++){const px=x0+hash(i,664)*(x1-x0),py=by-h*(0.15+0.7*hash(i,665));ctx.fillRect(px,py,10+hash(i,666)*40,4+hash(i,667)*14);}
    ctx.restore();
    ctx.strokeStyle=rgba(rim,0.18+0.3*dw+0.1*dy);ctx.lineWidth=1.6;ctx.beginPath();for(let x=x0;x<=x1;x+=3){const y=top(x)+0.8;x===x0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
    for(let x=x0+4;x<x1-6;x+=17){const y=top(x+4);ctx.fillStyle=rgba(top_,1);ctx.fillRect(x,y-8,9,8.5);ctx.fillRect(x+2.5,y-12,4,4.5);
      ctx.fillStyle=rgba(rim,0.2+0.35*dw);ctx.fillRect(x,y-8,9,1.2);ctx.fillRect(x+2.5,y-12,4,1.2);}
    ctx.restore();});}
// the bank between the outer wall and the water: beaten earth, darker towards the wall
function a5_ground(ctx,o){const[dw,dy]=bab_light(o),col=mix(mix([14,11,11],[84,60,46],dw),[120,98,76],dy);
  ctx.fillStyle=rgba(mix(col,[0,0,0],0.55),1);ctx.fillRect(A5_X0,A5_IN[0]-2,A5_X1-A5_X0,A5_OUT[0]-A5_IN[0]+4);
  const g=ctx.createLinearGradient(0,A5_OUT[0]-4,0,A5_WY);g.addColorStop(0,rgba(mix(col,[0,0,0],0.3),1));g.addColorStop(1,rgba(col,1));ctx.fillStyle=g;ctx.fillRect(A5_X0,A5_OUT[0]-4,A5_X1-A5_X0,A5_WY-A5_OUT[0]+6);}
// palms on the bank, and reeds along the water where the embankment hasn't reached (a, 0..1)
function a5_palms(ctx,t,o){const[dw,dy]=bab_light(o),sil=mix(mix([6,5,6],[26,18,16],dw),[70,58,46],dy);
  [[-420,64],[90,70],[960,58],[1560,74],[2160,62]].forEach(([x,h],i)=>bab_palm(ctx,x,A5_EMB-2,h,t,{col:sil,lean:(hash(i,695)-0.5)*0.3,rim:0.2*dw}));}
function a5_reeds(ctx,t,o,a){if(a<=0.01)return;const[dw,dy]=bab_light(o),sil=mix(mix([6,5,6],[26,18,16],dw),[70,58,46],dy);
  withA(ctx,a,()=>{ctx.strokeStyle=rgba(mix(sil,[96,74,58],0.25*dw),1);ctx.lineCap="round";ctx.lineWidth=0.9;ctx.beginPath();
    for(let i=0;i<220;i++){const bx=A5_X0+hash(i,692)*(A5_X1-A5_X0),hh=6+hash(i,693)*16,lw=Math.sin(t*0.7+i)*0.08;ctx.moveTo(bx,A5_WY+1);ctx.quadraticCurveTo(bx+1,A5_WY-hh*0.6,bx+(hash(i,694)-0.5)*hh*0.5+lw*hh,A5_WY-hh);}ctx.stroke();});}
// The embankment of baked brick at the water's edge: from x0 to x1, its top at y0 and its foot at by, built course by course from the
// foot as p goes from 0 to 1; red from the kiln, laid in black bitumen, in stretches a little different in tone, its coping catching the
// light. o.kings: stretches laid again by later kings on the same line, [x0, x1, q (0..1), tone (-1..1)], each with a warm light along
// its coping as it comes; o.glint (0..1): the stamped bricks catching the sun, here and there along it; o.hi (0..1): the whole wall lit
function a5_embank(ctx,x0,x1,y0,by,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||p<=0.002)return;const[dw,dy]=bab_light(o);
  const face=mix(mix([24,13,12],[98,52,38],dw),[156,98,72],dy),lit=mix(face,BAB_SUN,0.26*dw+0.08*dy),top=by-(by-y0)*clamp(p,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.rect(x0,top,x1-x0,by-top+2);ctx.clip();
    const g=ctx.createLinearGradient(0,y0,0,by);g.addColorStop(0,rgba(lit,1));g.addColorStop(0.4,rgba(face,1));g.addColorStop(1,rgba(mix(face,[6,4,4],0.55),1));ctx.fillStyle=g;ctx.fillRect(x0,y0,x1-x0,by-y0+2);
    for(let x=Math.floor(x0/140)*140;x<x1;x+=140){const v=hash(Math.floor(x/140)+40,676);ctx.fillStyle=v<0.5?"rgba(255,214,176,"+(0.07*v)+")":"rgba(0,0,0,"+(0.14*(v-0.5))+")";ctx.fillRect(x,y0,140,by-y0+2);}
    // the stretches later kings laid again, on the same line: paler or darker brick
    (o.kings||[]).forEach(([k0,k1,q,tone])=>{if(q<=0.01)return;ctx.fillStyle=tone>0?"rgba(255,222,186,"+(0.2*q*tone)+")":"rgba(20,8,6,"+(-0.3*q*tone)+")";ctx.fillRect(k0,y0,k1-k0,by-y0+2);});
    const ch=4.5,bl=15;let r=0;for(let y=by-ch;y>y0-ch;y-=ch,r++){for(let x=x0+(r%2)*bl/2-bl;x<x1;x+=bl){const v=hash(Math.floor(x/bl)*7+r,672);ctx.fillStyle=v<0.5?"rgba(255,220,180,"+(0.07*v)+")":"rgba(0,0,0,"+(0.12*(v-0.5))+")";ctx.fillRect(x,y,bl,ch);}}
    ctx.strokeStyle=rgba(BAB_BIT,0.55);ctx.lineWidth=0.9;ctx.beginPath();r=0;for(let y=by-ch;y>y0-ch;y-=ch,r++){ctx.moveTo(x0,y);ctx.lineTo(x1,y);for(let x=x0+(r%2)*bl/2;x<x1;x+=bl){ctx.moveTo(x,y);ctx.lineTo(x,y+ch);}}ctx.stroke();
    // the stamped bricks, catching the sun
    const gl=clamp(o.glint||0,0,1);if(gl>0.01){const tt=o.t||0;for(let i=0;i<90;i++){const gx=x0+hash(i,681)*(x1-x0),gy=y0+4+hash(i,682)*(by-y0-14),tw_=0.5+0.5*Math.sin(tt*1.3+i*2.1);
      ctx.fillStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.55*gl*tw_);ctx.fillRect(gx,gy,bl-3,ch-1.4);}}
    const wg=ctx.createLinearGradient(0,by-16,0,by);wg.addColorStop(0,"rgba(0,0,0,0)");wg.addColorStop(1,"rgba(6,8,12,0.55)");ctx.fillStyle=wg;ctx.fillRect(x0,by-16,x1-x0,18);
    ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.45),0.45+0.4*dw);ctx.fillRect(x0,top,x1-x0,2.4);ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x0,top+2.4,x1-x0,1.4);ctx.restore();
    // the course being laid, as it rises
    if(p<0.999){ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.3),0.9);for(let x=x0;x<x1;x+=bl){if(hash(Math.floor(x/bl),671)<0.5)ctx.fillRect(x+1,top-ch,bl-2,ch-0.6);}}
    // a later king's stretch, as it's laid: a warm light along its coping
    (o.kings||[]).forEach(([k0,k1,q])=>{const pl=Math.sin(Math.PI*clamp(q,0,1));if(pl<=0.01)return;ctx.save();ctx.strokeStyle=rgba(ACA,0.9*pl);ctx.lineWidth=3;ctx.shadowColor=rgba(ACA,0.9);ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(k0,top+1);ctx.lineTo(k1,top+1);ctx.stroke();ctx.restore();});
    const hi=clamp(o.hi||0,0,1);if(hi>0.01){ctx.fillStyle=rgba(BAB_SUN,0.16*hi);ctx.fillRect(x0,top,x1-x0,by-top);ctx.fillStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.6*hi);ctx.fillRect(x0,top-1,x1-x0,3);}});}
// the walls, upside down in the water: draw() paints them into one reused canvas, laid back below the water's edge (y) in thin strips,
// each shifted a little by the ripples (amp), fainter further from the bank
let A5_RBUF=null;
function a5_mirror(ctx,y,t,amp,al,draw){const cv=ctx.canvas,m=ctx.getTransform();
  if(!A5_RBUF||A5_RBUF.width!==cv.width||A5_RBUF.height!==cv.height)A5_RBUF=mkCanvas(cv.width,cv.height);const o=A5_RBUF.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.setTransform(m);draw(o);o.setTransform(1,0,0,1,0,0);
  const k=m.d,wy=Math.round(m.d*y+m.f),hs=Math.max(2,Math.round(2.5*k)),N=Math.min(Math.ceil((cv.height-wy)/hs),Math.floor(wy/hs));
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  for(let i=0;i<N;i++){const u=clamp(i*hs/k/240,0,1);if(u>=1)break;const dx=(Math.sin(t*1.3+i*0.83)+0.5*Math.sin(t*0.7+i*0.31))*amp*k*(0.35+1.3*u);
    ctx.globalAlpha=al*Math.pow(1-u,1.3);ctx.drawImage(A5_RBUF,0,wy-(i+1)*hs,cv.width,hs,dx,wy+i*hs,cv.width,hs);}
  ctx.restore();}
// the river in front, from its far edge at y0 to below the frame: the sky in it, the walls' reflection (o.refl draws them), the sun's
// path and slow ripples
function a5_water(ctx,y0,t,o){o=o||{};const[dw,dy]=bab_light(o),y=y0;
  const sky=mix(mix([12,12,26],[96,66,74],dw),[150,146,146],dy),deep=mix(mix([4,6,12],[18,20,32],dw),[52,66,82],dy);
  const g=ctx.createLinearGradient(0,y,0,y+300);g.addColorStop(0,rgba(mix(sky,BAB_SUN,0.18*dw),1));g.addColorStop(0.35,rgba(mix(sky,deep,0.65),1));g.addColorStop(1,rgba(deep,1));ctx.fillStyle=g;ctx.fillRect(A5_X0,y,A5_X1-A5_X0,1400);
  ctx.save();ctx.beginPath();ctx.rect(A5_X0,y,A5_X1-A5_X0,1400);ctx.clip();
  if(o.refl)a5_mirror(ctx,y,t,1.6,0.6,o.refl);
  ctx.fillStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.05+0.12*dw);
  for(let i=0;i<46;i++){const u=i/46,yy=y+4+u*u*300,ww=60+hash(i,681)*220*(1+u),xx=1500+(hash(i,682)-0.5)*(300+u*900)+Math.sin(t*0.4+i*1.9)*14;ctx.fillRect(xx-ww/2,yy,ww,1.2+u*2.6);}
  ctx.fillStyle=rgba(sky,0.16);for(let i=0;i<60;i++){const u=hash(i,683),yy=y+6+u*u*320,xx=A5_X0+hash(i,684)*(A5_X1-A5_X0)+Math.sin(t*0.3+i)*10;ctx.fillRect(xx,yy,30+hash(i,685)*90,1+u*2);}
  ctx.fillStyle=rgba(mix(sky,BAB_SUN,0.4),0.45);ctx.fillRect(A5_X0,y,A5_X1-A5_X0,1.4);ctx.restore();}
// the whole view: sky, city, tower, the inner wall, then the bank, the outer wall, palms, reeds, the embankment (o.emb, 0..1, built so
// far; o.kings, o.glint, o.embHi as a5_embank takes them) and the water with the walls in it. o.near(ctx) draws on the bank, in front
// of the embankment (the workmen along its top): it isn't reflected.
function a5_view(ctx,t,o){o=o||{};const L={dawn:o.dawn,day:o.day},emb=o.emb==null?1:o.emb;
  bab_sky(ctx,t,{dawn:L.dawn,day:L.day,hz:A5_HZ,sunX:1640});bab_city(ctx,t,{dawn:L.dawn,day:L.day,hz:A5_HZ,gap:[900,1300]});
  bab_tower(ctx,1100,A5_HZ+70,2.6,{dawn:L.dawn,day:L.day});
  a5_wall(ctx,A5_X0,A5_X1,A5_IN[0],A5_IN[1],Object.assign({},L,A5_INW));
  const near=(c,all)=>{a5_ground(c,L);a5_wall(c,A5_X0,A5_X1,A5_OUT[0],A5_OUT[1],Object.assign({},L,A5_OUTW));a5_palms(c,t,L);if(all)a5_reeds(c,t,L,1-emb);
    a5_embank(c,A5_X0,A5_X1,A5_EMB,A5_WY+4,emb,{dawn:L.dawn,day:L.day,hi:o.embHi||0,kings:o.kings,glint:all?o.glint:0,t});};
  near(ctx,true);if(o.near)o.near(ctx);
  a5_water(ctx,A5_WY,t,{dawn:L.dawn,day:L.day,refl:c=>near(c,false)});}
// where the embankment's top is, as it's built (p, 0..1): for the workmen who walk along it
const a5_embTop=p=>A5_WY+4-(A5_WY+4-A5_EMB)*clamp(p,0,1);

/* ---------- 1. The river wall close up, one brick, its stamp ---------- */
// The river wall close up, in the morning sun: its face of baked brick, course on course, each brick's edge four times as long as it
// is high, black bitumen in every joint. o.st (0..1): three stretches in tones of their own, the seams between them lit; o.one (0..1):
// one brick lit among the rest; o.dim (0..1) darkens it under what's drawn over it
const A5_FB=168,A5_FH=40,A5_FJ=9,A5_SEAMS=[600,1300];
function a5_face(ctx,t,o){o=o||{};const st=clamp(o.st||0,0,1),one=clamp(o.one||0,0,1),TONE=[[0,0,0],[255,214,170],[60,30,22]];
  ctx.fillStyle=rgba(BAB_BIT,1);ctx.fillRect(-200,-200,W+400,H+400);
  const sx=(i,r)=>i*(A5_FB+A5_FJ)+(r%2)*((A5_FB+A5_FJ)/2),bw=A5_FB+A5_FJ,bh=A5_FH+A5_FJ;
  for(let r=-2;r<H/bh+2;r++)for(let i=-2;i*bw<W+A5_FB*2;i++){const x=sx(i,r)+(hash(i*13+r,724)-0.5)*3,y=r*bh+(hash(i*7+r,725)-0.5)*2,v=hash(i*31+r+300,721);
    // which stretch it belongs to: the seams step with the courses, a brick at a time, as walls are joined
    const cx=x+A5_FB/2,jog=(r%3)*bw*0.5,k=cx<A5_SEAMS[0]+jog-bw*0.6?0:cx<A5_SEAMS[1]+jog-bw*0.6?1:2;
    let c=mix(mix(BAB_BRICK,[196,150,104],0.2+0.4*v),[90,60,44],0.3*hash(i+r*17,726));if(k>0&&st>0.01)c=mix(c,TONE[k],(k===1?0.16:0.26)*st);
    ctx.fillStyle=rgba(c,1);rr(ctx,x,y,A5_FB,A5_FH,6);ctx.fill();
    ctx.fillStyle="rgba(255,236,210,0.14)";ctx.fillRect(x+5,y+2,A5_FB-10,3);ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(x+5,y+A5_FH-4.5,A5_FB-10,3);
    if(hash(i*5+r*3,727)<0.18){const cx_=hash(i+r,728)<0.5?x:x+A5_FB,cy_=hash(i*3+r,729)<0.5?y:y+A5_FH,s=10+hash(i+r*11,730)*14;ctx.fillStyle=rgba(BAB_BIT,1);ctx.beginPath();ctx.moveTo(cx_,cy_);ctx.lineTo(cx_+(cx_===x?s:-s),cy_);ctx.lineTo(cx_,cy_+(cy_===y?s*0.6:-s*0.6));ctx.closePath();ctx.fill();}
    ctx.fillStyle="rgba(0,0,0,0.12)";for(let q=0;q<6;q++)ctx.fillRect(x+6+hash(q+i*7,722+r)*(A5_FB-14),y+5+hash(q+r*5,723+i)*(A5_FH-10),3,2.4);}
  // the morning sun, from the right, and a darker foot
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(10,6,10,0.42)");g.addColorStop(0.6,"rgba(10,6,10,0.06)");g.addColorStop(1,"rgba(255,206,150,0.08)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // the seams between the stretches, lit
  if(st>0.01){ctx.save();ctx.strokeStyle=rgba(ACA,0.75*st);ctx.lineWidth=3;ctx.shadowColor=rgba(ACA,0.8);ctx.shadowBlur=12;A5_SEAMS.forEach(s0=>{ctx.beginPath();for(let r=-1;r<H/bh+1;r++){const xx=s0+(r%3)*bw*0.5-bw*0.6+(r%2?bw/2:0)-A5_FJ/2;
      const xs=Math.round((xx-(r%2)*bw/2)/bw)*bw+(r%2)*bw/2-A5_FJ/2;if(r===-1)ctx.moveTo(xs,r*bh-A5_FJ/2);else ctx.lineTo(xs,r*bh-A5_FJ/2);ctx.lineTo(xs,(r+1)*bh-A5_FJ/2);}ctx.stroke();});ctx.restore();}
  // one brick, lit among the rest
  if(one>0.01){const r=10,i=5,x=sx(i,r),y=r*bh;glow(ctx,x+A5_FB/2,y+A5_FH/2,240,BAB_SUN,0.32*one);ctx.save();ctx.strokeStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.95*one);ctx.lineWidth=3.6;ctx.shadowColor=rgba(BAB_SUN,0.9);ctx.shadowBlur=16;rr(ctx,x-3,y-3,A5_FB+6,A5_FH+6,8);ctx.stroke();ctx.restore();}
  const dm=clamp(o.dim||0,0,1);if(dm>0.01){ctx.fillStyle="rgba(8,5,4,"+(0.72*dm)+")";ctx.fillRect(-200,-200,W+400,H+400);}}
// the brick lit in a5_face: its middle, for what points at it
const A5_ONE=[5*(A5_FB+A5_FJ)+A5_FB/2,10*(A5_FH+A5_FJ)+A5_FH/2];
// One baked brick, seen from above and in front, as a square slab: its top face, the edge towards us (about a quarter of its width
// high, as a brick about 33 cm square and 8 cm thick) and its right edge. (x,y): the top face's front left corner; S: its width.
// o.stamp (0..1): the king's stamp in its front edge, its lines plain rules (no script is imitated; the film says in English what it
// said); o.press (0..1): the moment it's pressed, a shadow that lifts; o.hand (0..1): lines written by hand instead; o.hiName, o.hiWork
// (0..1): the first line lit, then the rest. Returns where its edge and the two parts of what it says are, for what points at them.
function a5_brick3(ctx,x,y,S,o){o=o||{};const a=o.a==null?1:o.a,Tk=S*0.24,dx=S*0.4,dy=S*0.28,sw=S*0.76,sh=Tk*0.76,sx=x+(S-sw)/2,sy=y+(Tk-sh)/2;
  const R={edge:[x+S/2,y+Tk],name:[sx+sw*0.36,sy+sh*0.16],work:[sx+sw*0.5,sy+sh*0.62]};if(a<=0.01)return R;
  withA(ctx,a,()=>{const base=BAB_BRICK;ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=S*0.1;ctx.shadowOffsetY=S*0.05;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y-dy);ctx.lineTo(x+S+dx,y-dy);ctx.lineTo(x+S+dx,y-dy+Tk);ctx.lineTo(x+S,y+Tk);ctx.lineTo(x,y+Tk);ctx.closePath();ctx.fillStyle=rgba(base,1);ctx.fill();ctx.restore();
    // the top face, in the sun
    let g=ctx.createLinearGradient(x,y-dy,x+S+dx,y);g.addColorStop(0,rgba(mix(base,[255,226,186],0.34),1));g.addColorStop(1,rgba(mix(base,[255,214,170],0.14),1));
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y-dy);ctx.lineTo(x+S+dx,y-dy);ctx.lineTo(x+S,y);ctx.closePath();ctx.fillStyle=g;ctx.fill();
    // the right edge, in shade
    ctx.beginPath();ctx.moveTo(x+S,y);ctx.lineTo(x+S+dx,y-dy);ctx.lineTo(x+S+dx,y-dy+Tk);ctx.lineTo(x+S,y+Tk);ctx.closePath();ctx.fillStyle=rgba(mix(base,[0,0,0],0.45),1);ctx.fill();
    // the front edge, facing us
    g=ctx.createLinearGradient(0,y,0,y+Tk);g.addColorStop(0,rgba(mix(base,[255,220,180],0.22),1));g.addColorStop(1,rgba(mix(base,[0,0,0],0.2),1));ctx.fillStyle=g;ctx.fillRect(x,y,S,Tk);
    // the clay's pits and specks of straw, on every face
    ctx.fillStyle="rgba(0,0,0,0.14)";for(let i=0;i<70;i++){const u=hash(i,741),v=hash(i,742);ctx.fillRect(x+u*S+v*dx,y-v*dy+2,2+hash(i,743)*3,1.6);}
    for(let i=0;i<40;i++){const u=hash(i,744),v=hash(i,745);ctx.fillRect(x+4+u*(S-8),y+3+v*(Tk-6),2+hash(i,746)*2.4,1.6);}
    ctx.strokeStyle="rgba(255,236,206,0.4)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+0.5);ctx.lineTo(x+S,y+0.5);ctx.lineTo(x+S+dx,y-dy+0.5);ctx.stroke();
    // the stamp: a sunken frame in the front edge, its lines raised rules; the first, the king's name, a little apart
    const sp=clamp(o.stamp||0,0,1),pr=clamp(o.press||0,0,1);
    if(sp>0.01)withA(ctx,sp,()=>{ctx.fillStyle="rgba(40,16,8,"+(0.3+0.25*pr)+")";rr(ctx,sx,sy,sw,sh,6);ctx.fill();ctx.strokeStyle="rgba(26,10,4,0.6)";ctx.lineWidth=2.6;rr(ctx,sx,sy,sw,sh,6);ctx.stroke();
      ctx.strokeStyle="rgba(255,228,196,0.3)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sx+4,sy+sh-1.5);ctx.lineTo(sx+sw-4,sy+sh-1.5);ctx.lineTo(sx+sw-1.5,sy+4);ctx.stroke();
      for(let i=0;i<5;i++){const yy=sy+sh*(i===0?0.17:0.3+i*0.15),L=sw*(i===0?0.58:0.84-0.07*(i%2)),hl=i===0?clamp(o.hiName||0,0,1):clamp(o.hiWork||0,0,1);
        if(hl>0.01){ctx.save();ctx.strokeStyle=rgba(ACA,0.95*hl);ctx.lineWidth=Math.max(5,Tk*0.08);ctx.shadowColor=rgba(ACA,0.95);ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(sx+sw*0.07,yy);ctx.lineTo(sx+sw*0.07+L,yy);ctx.stroke();ctx.restore();}
        ctx.strokeStyle="rgba(22,8,4,0.7)";ctx.lineWidth=Math.max(2.4,Tk*0.045);ctx.beginPath();ctx.moveTo(sx+sw*0.07,yy);ctx.lineTo(sx+sw*0.07+L,yy);ctx.stroke();
        ctx.strokeStyle="rgba(255,226,190,0.22)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(sx+sw*0.07,yy+Tk*0.03);ctx.lineTo(sx+sw*0.07+L,yy+Tk*0.03);ctx.stroke();}});
    // written by hand: lines drawn into the clay with a stylus, a little uneven
    const hd=clamp(o.hand||0,0,1);if(hd>0.01){ctx.save();ctx.strokeStyle="rgba(26,10,4,0.62)";ctx.lineWidth=Math.max(2.2,Tk*0.04);ctx.lineCap="round";
      for(let i=0;i<4;i++){const yy=y+Tk*(0.24+i*0.18),L=S*(0.82-0.1*(i%2))*clamp(hd*4-i,0,1);if(L<=1)continue;ctx.beginPath();for(let u=0;u<=L;u+=8){const xx=x+S*0.09+u,w_=Math.sin(u*0.09+i*1.7)*1.6+Math.sin(u*0.023+i)*1.2;u?ctx.lineTo(xx,yy+w_):ctx.moveTo(xx,yy+w_);}ctx.stroke();}ctx.restore();}
    // the stamp's shadow as it's pressed, and lifted
    if(pr>0.01){ctx.fillStyle="rgba(0,0,0,"+(0.4*pr)+")";rr(ctx,sx-6,sy-6,sw+12,sh+12,10);ctx.fill();}});
  return R;}

/* ---------- 1, at its end. Archaeologists at the river wall ---------- */
// The river wall as archaeologists found it, in a hazy morning (as The AI platform draws it, its a2_dig): a trench cut down through
// the layers of earth, and at its far wall the face of baked brick, worn and chipped, black bitumen in every joint, earth still caked
// on it, a measuring rod leaning against it. o.p (0..1): the face uncovered, from the top down; o.st (0..1): its stretches, each in
// its own tone, the seams between them lit (the work of more than one king); o.found (0..1): bricks with a king's name, lit
function a5_dig(ctx,t,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1),st=clamp(o.st||0,0,1),fd=clamp(o.found||0,0,1),earth=[124,98,74],dk=[64,48,38],haze=[196,190,178];
  let g=ctx.createLinearGradient(0,-200,0,300);g.addColorStop(0,"rgb(150,154,162)");g.addColorStop(1,rgba(haze,1));ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,500);
  ctx.fillStyle=rgba(mix(earth,haze,0.45),1);for(let i=0;i<7;i++){const x=-100+i*360+hash(i,741)*140,w=300+hash(i,742)*220,h=30+hash(i,743)*46;ctx.beginPath();ctx.moveTo(x-w/2,292);ctx.quadraticCurveTo(x-w*0.1,292-h*1.6,x+w/2,292);ctx.closePath();ctx.fill();}
  ctx.fillStyle=rgba(mix(earth,haze,0.3),1);ctx.fillRect(-200,288,W+400,H+200);
  const fx=420,fw=1080,fy=300,fb=846,Y=H+240;
  ctx.fillStyle=rgba(mix(earth,dk,0.45),1);ctx.beginPath();ctx.moveTo(-200,292);ctx.lineTo(fx,fy);ctx.lineTo(fx,fb);ctx.lineTo(-200,Y);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(W+200,292);ctx.lineTo(fx+fw,fy);ctx.lineTo(fx+fw,fb);ctx.lineTo(W+200,Y);ctx.closePath();ctx.fill();
  for(let i=1;i<10;i++){const u=i/10,yl=292+(Y-292)*u,yf=fy+(fb-fy)*u;ctx.strokeStyle=rgba(i%2?mix(earth,haze,0.2):mix(dk,[0,0,0],0.15),0.55);ctx.lineWidth=3+u*7;
    ctx.beginPath();ctx.moveTo(-200,yl);ctx.lineTo(fx,yf);ctx.moveTo(W+200,yl);ctx.lineTo(fx+fw,yf);ctx.stroke();}
  g=ctx.createLinearGradient(0,fb,0,H);g.addColorStop(0,rgba(mix(dk,earth,0.5),1));g.addColorStop(1,rgba(mix(earth,haze,0.15),1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(fx,fb);ctx.lineTo(fx+fw,fb);ctx.lineTo(W+200,Y);ctx.lineTo(-200,Y);ctx.closePath();ctx.fill();
  // the face of baked brick, course by course, in three stretches; some of its bricks carry a king's name
  ctx.save();ctx.beginPath();ctx.rect(fx,fy,fw,fb-fy);ctx.clip();ctx.fillStyle=rgba(BAB_BIT,1);ctx.fillRect(fx,fy,fw,fb-fy);
  const bw=104,bh=25,jt=7,SM=[fx+fw*0.34,fx+fw*0.7],TN=[[0,0,0],[226,190,150],[70,40,28]],lit=[];
  for(let r=0;fb-(r+1)*(bh+jt)>fy-bh-jt;r++)for(let i=-1;i*(bw+jt)<fw+bw;i++){
    const x=fx+i*(bw+jt)+(r%2)*((bw+jt)/2)+(hash(i*13+r,724)-0.5)*3,y=fb-(r+1)*(bh+jt)+jt/2+(hash(i*7+r,725)-0.5)*2,v=hash(i*31+r,721),k=x+bw/2<SM[0]+(r%2)*20?0:x+bw/2<SM[1]-(r%2)*20?1:2;
    let c=mix(mix(BAB_BRICK,[196,150,104],0.2+0.4*v),[90,60,44],0.3*hash(i+r*17,726));if(k>0&&st>0.01)c=mix(c,TN[k],(k===1?0.2:0.3)*st);
    ctx.fillStyle=rgba(c,1);rr(ctx,x,y,bw,bh,5);ctx.fill();ctx.fillStyle="rgba(255,236,210,0.13)";ctx.fillRect(x+4,y+1.5,bw-8,2.5);ctx.fillStyle="rgba(0,0,0,0.17)";ctx.fillRect(x+4,y+bh-3.5,bw-8,2.5);
    if(hash(i*5+r*3,727)<0.22){const cx_=hash(i+r,728)<0.5?x:x+bw,cy_=hash(i*3+r,729)<0.5?y:y+bh,s=8+hash(i+r*11,730)*12;ctx.fillStyle=rgba(BAB_BIT,1);ctx.beginPath();ctx.moveTo(cx_,cy_);ctx.lineTo(cx_+(cx_===x?s:-s),cy_);ctx.lineTo(cx_,cy_+(cy_===y?s*0.6:-s*0.6));ctx.closePath();ctx.fill();}
    ctx.fillStyle="rgba(0,0,0,0.12)";for(let q=0;q<5;q++)ctx.fillRect(x+6+hash(q+i*7,722+r)*(bw-14),y+4+hash(q+r*5,723+i)*(bh-9),2.5,2);
    if(hash(i*17+r*29,747)<0.07&&y>fy+40)lit.push([x,y,k]);}
  for(let i=0;i<10;i++){const x=fx+hash(i,733)*fw,y=fy+hash(i,734)*(fb-fy),r=60+hash(i,735)*140,eg=ctx.createRadialGradient(x,y,0,x,y,r);eg.addColorStop(0,rgba(mix(earth,haze,0.2),0.32));eg.addColorStop(1,rgba(earth,0));ctx.fillStyle=eg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  // the bricks with a king's name, lit, a stretch at a time
  if(fd>0.01)lit.forEach(([x,y,k],j)=>{const q=clamp(fd*3.4-k-hash(j,748)*0.4,0,1);if(q<=0.01)return;ctx.save();ctx.strokeStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.95*q);ctx.lineWidth=3;ctx.shadowColor=rgba(BAB_SUN,0.95);ctx.shadowBlur=14;rr(ctx,x-2,y-2,bw+4,bh+4,6);ctx.stroke();ctx.restore();});
  if(st>0.01){ctx.save();ctx.strokeStyle=rgba(ACA,0.7*st);ctx.lineWidth=3;ctx.shadowColor=rgba(ACA,0.8);ctx.shadowBlur=10;SM.forEach(s0=>{ctx.beginPath();ctx.moveTo(s0,fy);for(let yy=fy;yy<fb;yy+=bh+jt){const k=Math.round((yy-fy)/(bh+jt));ctx.lineTo(s0+(k%2?20:-20)*(s0===SM[0]?1:-1),yy);}ctx.stroke();});ctx.restore();}
  ctx.fillStyle=rgba(mix(earth,dk,0.3),1);ctx.beginPath();ctx.moveTo(fx,fy);for(let x=fx;x<=fx+fw;x+=12)ctx.lineTo(x,fy+16+Math.sin(x*0.02)*6+hash(Math.floor(x/12),736)*8);ctx.lineTo(fx+fw,fy);ctx.closePath();ctx.fill();
  if(p<0.999){const ey=fy+(fb-fy)*p;ctx.fillStyle=rgba(mix(earth,dk,0.35),1);ctx.beginPath();ctx.moveTo(fx,fb+4);for(let x=fx;x<=fx+fw;x+=12)ctx.lineTo(x,ey+Math.sin(x*0.03)*8+hash(Math.floor(x/12),737)*10);ctx.lineTo(fx+fw,fb+4);ctx.closePath();ctx.fill();}
  ctx.restore();
  for(let i=0;i<14;i++){const x=fx+30+hash(i,738)*(fw-60),y=fb+10+hash(i,739)*50,s=10+hash(i,740)*16,c=mix(BAB_BRICK,[150,110,80],0.4+0.3*hash(i,744));ctx.fillStyle="rgba(0,0,0,0.25)";ctx.beginPath();ctx.ellipse(x+3,y+s*0.3,s*0.8,s*0.22,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(c,1);ctx.save();ctx.translate(x,y);ctx.rotate((hash(i,745)-0.5)*0.8);rr(ctx,-s*0.6,-s*0.3,s*1.2,s*0.5,2);ctx.fill();ctx.restore();}
  if(p>0.6)withA(ctx,clamp((p-0.6)*3,0,1),()=>{ctx.save();ctx.translate(1400,fb+30);ctx.rotate(-0.07);ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(-4,-470,16,470);ctx.fillStyle="rgba(236,226,206,0.96)";ctx.fillRect(-8,-470,16,470);ctx.fillStyle="rgba(170,40,36,0.9)";for(let k=0;k<10;k+=2)ctx.fillRect(-8,-470+k*47,16,47);ctx.restore();});}
// The archaeologists' plan of one stretch of the river wall, on paper, after the plan in the kings' inscriptions' edition (its figure
// 12): a grid, north, a scale, the wall in three building phases side by side along the river, and the find spots of Nabopolassar's
// bricks, dot by dot, as o.n goes from 0 to 16; o.p (0..1) draws the plan. Drawn simply: the edition's plan, not a copy of it.
const A5_FIND=[[0.12,0.3],[0.18,0.62],[0.24,0.42],[0.3,0.72],[0.36,0.28],[0.41,0.55],[0.47,0.36],[0.52,0.68],[0.57,0.46],[0.62,0.26],[0.67,0.6],[0.72,0.4],[0.77,0.7],[0.82,0.33],[0.87,0.56],[0.92,0.44]];
function a5_plan(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,p=clamp(o.p==null?1:o.p,0,1),n=clamp(o.n||0,0,16);if(a<=0.01)return;const ink=[52,46,42],blue=[92,120,170];
  withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:-0.006,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(-0.006);ctx.translate(-w/2,-h/2);
    // the grid, as surveyors draw it
    ctx.strokeStyle=rgba(blue,0.18);ctx.lineWidth=1;ctx.beginPath();for(let gx=60;gx<w-40;gx+=60){ctx.moveTo(gx,40);ctx.lineTo(gx,h-40);}for(let gy=40;gy<h-40;gy+=60){ctx.moveTo(40,gy);ctx.lineTo(w-40,gy);}ctx.stroke();
    // the wall in its phases, along the river: three bands, each laid against the one before, hatched each its own way
    const bx=90,bwid=w-180,by0=h*0.24,bh=h*0.17,dr=clamp(p*1.6,0,1);
    for(let k=0;k<3;k++){const q=clamp(dr*3-k,0,1);if(q<=0.01)continue;const yy=by0+k*(bh+6);withA(ctx,q,()=>{ctx.fillStyle=rgba(mix([226,210,180],[176,150,120],k*0.35),0.9);ctx.fillRect(bx,yy,bwid*q,bh);
      ctx.save();ctx.beginPath();ctx.rect(bx,yy,bwid*q,bh);ctx.clip();ctx.strokeStyle=rgba(ink,0.32);ctx.lineWidth=1.4;ctx.beginPath();const sp=[14,10,18][k],an=[1,-1,0][k];
        for(let xx=bx-bh;xx<bx+bwid+bh;xx+=sp){if(an===0){ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+bh);}else{ctx.moveTo(xx,yy+bh);ctx.lineTo(xx+an*bh,yy);}}ctx.stroke();ctx.restore();
        ctx.strokeStyle=rgba(ink,0.8);ctx.lineWidth=2.2;ctx.strokeRect(bx,yy,bwid*q,bh);});}
    // the river, beyond the last phase
    const ry=by0+3*(bh+6)+14;if(dr>0.6)withA(ctx,clamp((dr-0.6)*2.5,0,1),()=>{ctx.strokeStyle=rgba(blue,0.55);ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();for(let xx=bx;xx<=bx+bwid;xx+=10){const yy=ry+k*16+Math.sin(xx*0.03+k)*3;xx===bx?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();}});
    // north, and a scale of ten metres
    const nA=clamp(p*2-0.8,0,1);if(nA>0.01)withA(ctx,nA,()=>{ctx.save();ctx.translate(w-90,96);ctx.strokeStyle=rgba(ink,0.85);ctx.fillStyle=rgba(ink,0.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(10,8);ctx.lineTo(0,0);ctx.lineTo(-10,8);ctx.closePath();ctx.fill();ctx.restore();
      ctx.fillStyle=rgba(ink,0.85);ctx.fillRect(bx,h-70,240,6);ctx.fillStyle="rgba(250,246,236,1)";ctx.fillRect(bx+60,h-69,60,4);ctx.fillRect(bx+180,h-69,60,4);});
    // the find spots: Nabopolassar's bricks, found in place
    const bandH=3*(bh+6)-6;for(let i=0;i<16;i++){const q=clamp(n-i,0,1);if(q<=0.01)continue;const[u,v]=A5_FIND[i],px=bx+u*bwid,py=by0+v*bandH,s=spring(q*1.4);
      if(q<1)glow(ctx,px,py,40,[200,70,50],0.5*(1-q));ctx.fillStyle=rgba([170,46,36],0.95);ctx.beginPath();ctx.arc(px,py,9*s,0,TAU);ctx.fill();ctx.strokeStyle="rgba(250,246,236,0.9)";ctx.lineWidth=2;ctx.stroke();}
    ctx.restore();});}

/* ---------- the present: elements, stamps and the map ---------- */
// a paper clip, for where something came from
function a5_clip(ctx,x,y,col){ctx.save();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+4,y+10);ctx.lineTo(x+4,y-6);ctx.arc(x-1,y-6,5,0,Math.PI,true);ctx.lineTo(x-6,y+10);ctx.arc(x-2,y+10,4,Math.PI,0,true);ctx.lineTo(x+2,y-2);ctx.stroke();ctx.restore();}
// the series' glyphs, and a data product (a hexagon, as When strategy moves draws a product) and a decision (a diamond)
function a5_glyph(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";
  if(kind==="product"){ctx.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*TAU/6;ctx.lineTo(x+Math.cos(an)*s*0.85,y+Math.sin(an)*s*0.85);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.25,0,TAU);ctx.fill();}
  else if(kind==="decision"){ctx.beginPath();ctx.moveTo(x,y-s*0.8);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x,y+s*0.8);ctx.lineTo(x-s*0.8,y);ctx.closePath();ctx.stroke();}
  else if(kind==="table"){rr(ctx,x-s*0.9,y-s*0.75,s*1.8,s*1.5,3);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.9,y-s*0.25);ctx.lineTo(x+s*0.9,y-s*0.25);ctx.moveTo(x-s*0.9,y+s*0.25);ctx.lineTo(x+s*0.9,y+s*0.25);ctx.moveTo(x-s*0.25,y-s*0.75);ctx.lineTo(x-s*0.25,y+s*0.75);ctx.stroke();}
  else archGlyph(ctx,kind,x,y,s,col);ctx.restore();}
// An element of the map, as ArchiMate draws it: glass in its layer's colour, its kind's glyph on the right, its name. o: a, hi, size;
// lit (0..1): the agent's light on it, teal; gold (0..1): part of a known answer; miss (0..1): missed, dim, in a dashed amber ring;
// ghost (0..1): new, dashed, not on the map yet; own: its owner's name, on a gold tag over its top left corner (ownA, 0..1); noOwn
// (0..1): that place empty, in red; dim (0..1); deco: its words drawn small on purpose
function a5_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.62*clamp(o.dim||0,0,1));if(a<=0.01)return;const sz=o.size||28,gh=clamp(o.ghost||0,0,1),t=o.t||0,hi=o.hi||0,lit=clamp(o.lit||0,0,1),gd=clamp(o.gold||0,0,1),ms=clamp(o.miss||0,0,1);
  withA(ctx,a,()=>{const r=kind==="process"||kind==="capability"?Math.min(h/2.6,18):8;
    if(lit>0.01)glow(ctx,x+w/2,y+h/2,w*0.55,KT_AI,0.26*lit);
    if(gh<0.999)withA(ctx,(1-gh)*(1-0.5*ms),()=>{glass(ctx,x,y,w,h,r,col,{glow:8+16*hi,ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.12+0.14*hi);rr(ctx,x,y,w,h,r);ctx.fill();});
    if(gh>0.001)withA(ctx,gh,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.86)";rr(ctx,x,y,w,h,r);ctx.fill();ctx.setLineDash([9,8]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,r);ctx.stroke();ctx.restore();});
    if(lit>0.01)withA(ctx,lit,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.95);ctx.lineWidth=3.2;ctx.shadowColor=rgba(KT_AI,0.8);ctx.shadowBlur=14;rr(ctx,x-5,y-5,w+10,h+10,r+4);ctx.stroke();ctx.restore();});
    if(gd>0.01)withA(ctx,gd,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.95);ctx.lineWidth=2.6;ctx.shadowColor=rgba(BIZ,0.7);ctx.shadowBlur=10;rr(ctx,x-3,y-3,w+6,h+6,r+2);ctx.stroke();ctx.restore();});
    if(ms>0.01)withA(ctx,ms,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=12;rr(ctx,x-8,y-8,w+16,h+16,r+6);ctx.stroke();ctx.restore();});
    const gs=o.gs||Math.min(14,h*0.2),gx=x+w-gs-12,gy=y+h/2;if(kind)withA(ctx,1-0.4*gh,()=>a5_glyph(ctx,kind,gx,gy,gs,mix(col,INK,0.15)));
    if(name){const tw_=w-gs*2-36,ls=wrapT(ctx,name,0,0,tw_,{size:sz,w:700,measure:true}),lh=sz*1.12,cx=x+(w-gs*2-12)/2+4;
      ls.forEach((l,i)=>T(ctx,l,cx,y+h/2+sz*0.36-(ls.length-1)*lh/2+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96*(1-0.25*gh)),deco:o.deco}));}
    const ow=clamp(o.ownA==null?(o.own?1:0):o.ownA,0,1),no=clamp(o.noOwn||0,0,1);
    if(o.own&&ow>0.01)withA(ctx,ow,()=>{const s=o.own,w2=tw(ctx,s,28,800)+64,tx=x+10,ty=y-20;glass(ctx,tx,ty-22,w2,44,22,BIZ,{glow:8,ea:0.9,fill:"rgba(14,12,6,0.97)"});kt_gtick(ctx,tx+22,ty,11,1);T(ctx,s,tx+42,ty+10,{w:800,size:28,color:rgba(BIZ,1),deco:o.deco});});
    if(no>0.01)withA(ctx,no*(1-ow),()=>{const s="no owner",w2=tw(ctx,s,28,800)+40,tx=x+10,ty=y-20;ctx.save();ctx.fillStyle="rgba(26,8,8,0.97)";rr(ctx,tx,ty-22,w2,44,22);ctx.fill();ctx.setLineDash([6,5]);ctx.strokeStyle=rgba(A5_RED,0.95);ctx.lineWidth=2.4;rr(ctx,tx,ty-22,w2,44,22);ctx.stroke();ctx.restore();T(ctx,s,tx+20,ty+10,{w:800,size:28,color:rgba(A5_RED,1)});});});}
// An element close up, as the map keeps it: its kind and ID, its name, and along its foot, as a brick carries its stamp, who owns it
// (a gold tick) and where it came from (a clip). o: a, hi; own, src (0..1) bring each in. Its height is 300.
function a5_stamp(ctx,x,y,w,kind,id,name,owner,src,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=300,ow=clamp(o.own==null?1:o.own,0,1),sr=clamp(o.src==null?1:o.src,0,1);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+14*(o.hi||0),ea:0.9,fill:"rgba(7,12,24,0.97)"});ctx.fillStyle=rgba(col,0.12);rr(ctx,x,y,w,h,18);ctx.fill();
    a5_glyph(ctx,kind,x+46,y+52,16,col);T(ctx,id,x+80,y+62,{f:"mono",w:500,size:28,color:rgba(col,1)});
    T(ctx,name,x+36,y+130,{w:800,size:44,color:rgba(INK,0.98)});
    ctx.save();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+24,y+168);ctx.lineTo(x+w-24,y+168);ctx.stroke();ctx.restore();
    if(ow>0.01)withA(ctx,ow,()=>{if((o.hiOwn||0)>0.01)glow(ctx,x+52,y+208,70,BIZ,0.4*o.hiOwn);kt_gtick(ctx,x+52,y+208,14,1);T(ctx,owner,x+80,y+218,{w:800,size:30,color:rgba(BIZ,1)});});
    if(sr>0.01)withA(ctx,sr,()=>{if((o.hiSrc||0)>0.01)glow(ctx,x+52,y+258,70,INK,0.25*o.hiSrc);a5_clip(ctx,x+52,y+258,SOFT);T(ctx,src,x+80,y+268,{w:700,size:28,color:rgba(mix(SOFT,INK,0.3),1)});});});}
// The map, seen whole: its six layers in glass, and on each a few elements too small to read, each stamped with a gold tick (its
// owner) and a clip (its source). M: where it is ({x, y, w, sh, gap}). o: a, p (it arrives), deco (layer names as texture), stamp
// (0..1) the ticks and clips; chk (0..1): a check passes over it, element by element, each ticking green as it's reached; walk (0..1):
// a light down its layers, through what a change touches; chg (0..1): the change, dashed, over its top; dim (0..1)
const A5_TM={x:560,y:170,w:1060,sh:72,gap:16};
const A5_TEX=[[0,1,3],[0,1,2,3],[0,1,2,3,4],[0,1,2,3],[0,1,2,3,4],[0,2,3]],A5_WP=[1,2,3,1,2,2];
function a5_texMap(ctx,t,M,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.6*clamp(o.dim||0,0,1)),p=o.p==null?1:o.p;if(a<=0.01)return;const R=[];
  withA(ctx,a,()=>{const B=layerStack(ctx,M.x,M.y,M.w,{p,sh:M.sh,gap:M.gap,size:30,deco:o.deco});if(p<=0.4)return;const ea=clamp(p*2-0.8,0,1);
    const N=A5_TEX.reduce((s,r)=>s+r.length,0),ck=clamp(o.chk||0,0,1),wk=clamp(o.walk||0,0,1),sp=clamp(o.stamp==null?1:o.stamp,0,1);let n=0;
    A5_TEX.forEach((ks,i)=>{const col=LAY6[i][1],yy=B[i][1]+12,hh=M.sh-24;ks.forEach(k=>{const xx=M.x+250+k*152,bwid=136,j=n++;
      R.push([xx,yy,bwid,hh,i,k]);withA(ctx,ea,()=>{ctx.save();ctx.fillStyle=rgba(col,0.09);ctx.strokeStyle=rgba(col,0.42);ctx.lineWidth=1.6;rr(ctx,xx,yy,bwid,hh,7);ctx.fill();ctx.stroke();
        ctx.fillStyle=rgba(col,0.26);ctx.fillRect(xx+30,yy+hh*0.36,56+hash(i*7+k,31)*36,4.5);ctx.fillRect(xx+30,yy+hh*0.62,34+hash(i*7+k,32)*30,4.5);ctx.restore();
        // the element's stamp: its owner's tick, and its source's clip
        if(sp>0.01)withA(ctx,clamp((sp*(N+2.5)-j)*0.4,0,1),()=>{kt_gtick(ctx,xx+15,yy+hh/2,8,1);ctx.save();ctx.translate(xx+bwid-14,yy+hh/2);ctx.scale(0.62,0.62);a5_clip(ctx,0,0,SOFT);ctx.restore();});
        // a check passing over it
        const q=clamp(ck*(N+3)-j,0,1);if(q>0.01){const fl=Math.sin(Math.PI*clamp(q*1.4,0,1));if(fl>0.01){ctx.save();ctx.strokeStyle=rgba(A5_OK,0.9*fl);ctx.lineWidth=2.6;ctx.shadowColor=rgba(A5_OK,0.8);ctx.shadowBlur=12;rr(ctx,xx-3,yy-3,bwid+6,hh+6,9);ctx.stroke();ctx.restore();}
          tick_(ctx,xx+bwid-30,yy+hh/2,18,A5_OK,clamp(q*2-0.6,0,1)*0.95);}
        // the walk: the elements the change touches, lit, layer by layer
        if(k===A5_WP[i]){const wq=clamp(wk*6.4-i,0,1);if(wq>0.01){ctx.save();ctx.strokeStyle=rgba(KT_AI,0.95*wq);ctx.lineWidth=3;ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=14;rr(ctx,xx-4,yy-4,bwid+8,hh+8,9);ctx.stroke();ctx.restore();glow(ctx,xx+bwid/2,yy+hh/2,90,KT_AI,0.2*wq);}}});});});
    // the walk's path, from the change down through what it touches
    if(wk>0.01){ctx.save();ctx.strokeStyle=rgba(KT_AI,0.8);ctx.lineWidth=3;ctx.shadowColor=rgba(KT_AI,0.8);ctx.shadowBlur=10;ctx.setLineDash([8,8]);ctx.lineDashOffset=-t*20;ctx.beginPath();let first=true;
      const top=[M.x+250+A5_WP[0]*152+68,M.y-26];ctx.moveTo(top[0],top[1]);for(let i=0;i<6;i++){const u=clamp(wk*6.4-i,0,1);if(u<=0)break;const xx=M.x+250+A5_WP[i]*152+68,yy=B[i][1]+M.sh/2,px=i?M.x+250+A5_WP[i-1]*152+68:top[0],py=i?B[i-1][1]+M.sh/2:top[1];ctx.lineTo(lerp(px,xx,u),lerp(py,yy,u));first=false;}
      ctx.stroke();ctx.restore();}
    // the change, over the map's top
    const cg=clamp(o.chg||0,0,1);if(cg>0.01)withA(ctx,cg,()=>{const cx=M.x+250+A5_WP[0]*152+68,cy=M.y-58,s="a change",w2=tw(ctx,s,30,800)+60;ctx.save();ctx.fillStyle="rgba(6,14,20,0.95)";rr(ctx,cx-w2/2,cy-26,w2,52,14);ctx.fill();ctx.setLineDash([8,7]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(KT_AI,0.95);ctx.lineWidth=2.4;rr(ctx,cx-w2/2,cy-26,w2,52,14);ctx.stroke();ctx.restore();
      T(ctx,s,cx,cy+11,{w:800,size:30,align:"center",color:rgba(KT_AI,1),deco:o.deco});});});return R;}

/* ---------- the checks: what's tested on every change ---------- */
// One check on the map, as a row: its mark and what it checks. The mark changes over a moment, never in a frame: run (0..1) a ring
// turning, pass (0..1) a green tick, fail (0..1) a red cross, hold (0..1) amber, waiting. o: a, hi, add (0..1: a gold edge, as a
// check just added), size, col (the words' colour)
function a5_checkRow(ctx,x,y,w,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||28,run=clamp(o.run||0,0,1),ps=clamp(o.pass||0,0,1),fl=clamp(o.fail||0,0,1),hd=clamp(o.hold||0,0,1),hi=o.hi||0,ad=clamp(o.add||0,0,1),t=o.t||0;
  withA(ctx,a,()=>{const h=sz+30;if(hi>0.01||ad>0.01){ctx.save();ctx.fillStyle=rgba(fl>0.5?A5_RED:ad>0.01?BIZ:TECH,0.08*Math.max(hi,ad));rr(ctx,x,y-h/2,w,h,h/2);ctx.fill();ctx.restore();}
    if(ad>0.01)withA(ctx,ad,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.9);ctx.lineWidth=2.4;ctx.shadowColor=rgba(BIZ,0.7);ctx.shadowBlur=10;rr(ctx,x,y-h/2,w,h,h/2);ctx.stroke();ctx.restore();});
    const mx=x+34;ctx.save();ctx.strokeStyle=rgba(SOFT,0.45*(1-Math.max(ps,fl,hd)));ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(mx,y,15,0,TAU);ctx.stroke();ctx.restore();
    if(run>0.01){ctx.save();ctx.strokeStyle=rgba(TECH,0.95*run*(1-Math.max(ps,fl,hd)));ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(mx,y,15,t*5,t*5+Math.PI*1.2);ctx.stroke();ctx.restore();}
    if(ps>0.01)withA(ctx,ps*(1-fl),()=>{glow(ctx,mx,y,36,A5_OK,0.3);ctx.save();ctx.fillStyle="rgba(8,26,16,0.96)";ctx.beginPath();ctx.arc(mx,y,15,0,TAU);ctx.fill();ctx.restore();ring(ctx,mx,y,15,A5_OK,1,2.4);tick_(ctx,mx,y,15,A5_OK,1);});
    if(fl>0.01)kt_rcross(ctx,mx,y,15,fl);
    if(hd>0.01)withA(ctx,hd*(1-fl)*(1-ps),()=>{ctx.save();ctx.fillStyle="rgba(30,20,6,0.96)";ctx.beginPath();ctx.arc(mx,y,15,0,TAU);ctx.fill();ctx.restore();ring(ctx,mx,y,15,ACA_WARN,1,2.4);ctx.save();ctx.strokeStyle=rgba(ACA_WARN,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx,y-8);ctx.lineTo(mx,y);ctx.lineTo(mx+6,y+4);ctx.stroke();ctx.restore();});
    T(ctx,label,x+68,y+sz*0.36,{w:700,size:sz,color:o.col?rgba(o.col,1):rgba(INK,0.95)});});}
// the checks, on a panel of glass: its kicker, and its rows (each {label, a, run, pass, fail, hold, hi, add}); o: a, hi, gap (between
// rows), kicker; returns the panel's height
function a5_checks(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,gap=o.gap||66,h=96+rows.length*gap;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,TECH,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,12,22,0.97)"});T(ctx,o.kicker||"checked on every change",x+34,y+54,{f:"mono",w:500,size:28,color:rgba(TECH,1)});
    rows.forEach((r,i)=>a5_checkRow(ctx,x+20,y+112+i*gap,w-40,r.label,{...r,t:o.t||0}));});return h;}
// the history of one check: a row of runs, each a small green mark, as many as it's had, with never a red one among them
function a5_runs(ctx,x,y,n,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<n;i++){const q=clamp(p*n-i,0,1);if(q<=0.01)continue;const xx=x+i*34;ctx.save();ctx.globalAlpha*=q;ctx.fillStyle="rgba(8,26,16,0.9)";ctx.beginPath();ctx.arc(xx,y,12,0,TAU);ctx.fill();ctx.restore();ring(ctx,xx,y,12,A5_OK,q,2);tick_(ctx,xx,y,12,A5_OK,q);}});}

/* ---------- the wall between the network and retail ---------- */
// a wall of brick standing upright between two sides, as The map before the data draws the rules between the network and retail:
// courses of it, a little uneven, in clay's colours; (x,y,w,h); o.a, o.hi (0..1) its edge lit
function a5_wallV(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(58,42,32,0.94)";rr(ctx,x,y,w,h,8);ctx.fill();ctx.save();rr(ctx,x,y,w,h,8);ctx.clip();
  ctx.strokeStyle="rgba(20,12,8,0.55)";ctx.lineWidth=2;ctx.beginPath();for(let r=0,yy=y;yy<y+h;yy+=25,r++){ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);for(let xx=x+(r%2)*30;xx<x+w;xx+=60){ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+25);}}ctx.stroke();
  ctx.fillStyle="rgba(255,226,180,0.05)";for(let i=0;i<30;i++)ctx.fillRect(x+hash(i,801)*w,y+hash(i,802)*h,20+hash(i,803)*30,4);ctx.restore();
  const hi=clamp(o.hi||0,0,1);if(hi>0.01){ctx.strokeStyle=rgba(BIZ,0.85*hi);ctx.lineWidth=3;ctx.shadowColor=rgba(BIZ,0.8);ctx.shadowBlur=14;rr(ctx,x,y,w,h,8);ctx.stroke();}ctx.restore();});}
// the case that must fail, on a panel: the network's list of homes with solar panels on the left, retail on the right, the wall between;
// the list sets off towards retail (o.go, 0..1), is stopped at the wall (o.stop, 0..1: a red cross), and the check that stopped it is
// marked as working (o.ok, 0..1). (x,y): its top left; w; t
function a5_case(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=440,go=clamp(o.go||0,0,1),stp=clamp(o.stop||0,0,1),ok=clamp(o.ok||0,0,1),wx=x+w/2-50;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,TECH,{glow:14,ea:0.85,fill:"rgba(6,12,22,0.97)"});T(ctx,"a case that must fail",x+34,y+54,{f:"mono",w:500,size:28,color:rgba(TECH,1)});
    ctx.save();ctx.fillStyle=rgba(A5_NET,0.06);rr(ctx,x+24,y+84,wx-x-40,h-108,16);ctx.fill();ctx.fillStyle=rgba(A5_RET,0.06);rr(ctx,wx+116,y+84,x+w-wx-140,h-108,16);ctx.fill();ctx.restore();
    T(ctx,"the network",x+56,y+128,{w:800,size:30,color:rgba(A5_NET,1)});T(ctx,"retail",x+w-56,y+128,{w:800,size:30,align:"right",color:rgba(A5_RET,1)});
    a5_wallV(ctx,wx,y+84,100,h-108,{hi:stp});
    // the list: a card with a few homes with panels on their roofs
    const lx=lerp(x+70,wx-410,easeCam(go)),ly=y+200,bump=stp>0.01?Math.sin(Math.PI*clamp(stp*2,0,1))*-14:0;
    withA(ctx,1,()=>{glass(ctx,lx+bump,ly,380,150,14,A5_NET,{glow:10,ea:0.9,fill:"rgba(7,12,24,0.97)"});a5_glyph(ctx,"object",lx+bump+352,ly+26,10,A5_NET);
      T(ctx,"homes with",lx+bump+28,ly+56,{w:800,size:30,color:rgba(INK,0.96)});T(ctx,"solar panels",lx+bump+28,ly+94,{w:800,size:30,color:rgba(INK,0.96)});
      for(let k=0;k<4;k++){const hx=lx+bump+44+k*44,hy=ly+128;ctx.save();ctx.strokeStyle=rgba(A5_HH,0.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx-14,hy);ctx.lineTo(hx,hy-12);ctx.lineTo(hx+14,hy);ctx.moveTo(hx-10,hy-3);ctx.lineTo(hx-10,hy+10);ctx.lineTo(hx+10,hy+10);ctx.lineTo(hx+10,hy-3);ctx.stroke();ctx.fillStyle=rgba([120,190,255],0.9);ctx.beginPath();ctx.moveTo(hx+1,hy-11);ctx.lineTo(hx+12,hy-2);ctx.lineTo(hx+8,hy);ctx.lineTo(hx-3,hy-9);ctx.closePath();ctx.fill();ctx.restore();}});
    // where it's headed, a dashed line through the wall to retail
    if(go>0.01)withA(ctx,go*(1-0.5*stp),()=>{ctx.save();ctx.strokeStyle=rgba(A5_RED,0.7);ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.lineDashOffset=-t*18;ctx.beginPath();ctx.moveTo(lx+bump+384,ly+75);ctx.lineTo(x+w-120,ly+75);ctx.stroke();ctx.restore();
      ctx.save();ctx.fillStyle=rgba(A5_RED,0.8);ctx.beginPath();ctx.moveTo(x+w-104,ly+75);ctx.lineTo(x+w-126,ly+63);ctx.lineTo(x+w-126,ly+87);ctx.closePath();ctx.fill();ctx.restore();});
    if(stp>0.01){kt_rcross(ctx,wx+50,ly+75,26,stp);withA(ctx,stp,()=>T(ctx,"stopped at the wall",wx+136,ly+132,{w:800,size:28,color:rgba(A5_RED,1)}));}
    if(ok>0.01)withA(ctx,ok,()=>{const s="it fails, as it must: the check works",w2=tw(ctx,s,28,800)+80,cx=x+w/2;glass(ctx,cx-w2/2,y+h+28,w2,52,26,A5_OK,{glow:10,ea:0.9,fill:"rgba(7,20,14,0.97)"});tick_(ctx,cx-w2/2+32,y+h+54,18,A5_OK,1);T(ctx,s,cx-w2/2+58,y+h+64,{w:800,size:28,color:rgba(A5_OK,1)});});});}
// a change waiting at a gate: a card, dashed, held by a bar (o.wait, 0..1, amber); it goes through once fixed (o.fix, 0..1) or once its
// owner says why (o.why, 0..1); the bar lifts as either comes
function a5_gate(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const wt=clamp(o.wait||0,0,1),fx=clamp(o.fix||0,0,1),wy=clamp(o.why||0,0,1),up=Math.max(fx,wy);
  withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(SOFT,0.5);ctx.fillRect(x-8,y-120,16,240);ctx.fillRect(x+352,y-120,16,240);ctx.restore();
    // the bar, lowered while the change waits, lifted as it's let through
    ctx.save();ctx.translate(x+8,y-40);ctx.rotate(-1.2*easeCam(up));ctx.fillStyle=rgba(mix(ACA_WARN,A5_OK,up),0.95);ctx.shadowColor=rgba(mix(ACA_WARN,A5_OK,up),0.7);ctx.shadowBlur=12;rr(ctx,0,-8,350,16,8);ctx.fill();ctx.restore();
    // the change, waiting before the gate
    const cx=x-330+easeCam(up)*520,cy=y+10,s="a change",w2=260;ctx.save();ctx.fillStyle="rgba(6,14,20,0.96)";rr(ctx,cx-w2/2,cy-46,w2,92,16);ctx.fill();ctx.setLineDash([9,8]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(KT_AI,0.95);ctx.lineWidth=2.6;rr(ctx,cx-w2/2,cy-46,w2,92,16);ctx.stroke();ctx.restore();
    T(ctx,s,cx,cy+11,{w:800,size:30,align:"center",color:rgba(KT_AI,1)});
    if(wt*(1-up)>0.01)withA(ctx,wt*(1-up),()=>{kt_rcross(ctx,cx+w2/2-6,cy-46,16,1);a5_clock(ctx,x+180,y+86,24,ACA_WARN,t,1);T(ctx,"it waits",x+220,y+96,{w:800,size:30,color:rgba(ACA_WARN,1)});});});}
// a clock face, for waiting, or for how long something took
function a5_clock(ctx,x,y,r,col,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  const h=t*0.3,m=t*3.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(h)*r*0.5,y-Math.cos(h)*r*0.5);ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(m)*r*0.78,y-Math.cos(m)*r*0.78);ctx.stroke();ctx.restore();});}
// a loop: an arrow round a circle, for a test that runs again; t turns it slowly
function a5_loop(ctx,x,y,r,t,col,a){if(a<=0.01)return;withA(ctx,a,()=>{const s=t*1.2;ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,r,s,s+Math.PI*1.6);ctx.stroke();
  const e=s+Math.PI*1.6,ex=x+Math.cos(e)*r,ey=y+Math.sin(e)*r,tx=-Math.sin(e),ty=Math.cos(e);ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.moveTo(ex+tx*14,ey+ty*14);ctx.lineTo(ex-ty*10-tx*2,ey+tx*10-ty*2);ctx.lineTo(ex+ty*10-tx*2,ey-tx*10-ty*2);ctx.closePath();ctx.fill();ctx.restore();});}

/* ---------- the street: planned work, letters and texts ---------- */
// a home in outline, its windows lit or dark (o.dark, 0..1), and its letter at the door (o.letter, 0..1)
function a5_home(ctx,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dk=clamp(o.dark||0,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(mix(col,[90,96,110],0.5*dk),1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6*(1-dk));ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(-34,-6);ctx.lineTo(0,-36);ctx.lineTo(34,-6);ctx.moveTo(-26,-12);ctx.lineTo(-26,28);ctx.lineTo(26,28);ctx.lineTo(26,-12);ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-7,6,14,22);const wl=mix([255,226,160],[40,44,56],dk);ctx.fillStyle=rgba(wl,0.95);ctx.fillRect(10,-4,10,10);ctx.fillRect(-20,-4,10,10);
    if(dk<0.99)glow(ctx,0,2,40,[255,214,150],0.18*(1-dk));ctx.restore();});}
// an envelope, for a letter
function a5_env(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="rgba(240,234,220,0.96)";ctx.fillRect(-18,-12,36,24);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.strokeRect(-18,-12,36,24);
  ctx.beginPath();ctx.moveTo(-18,-12);ctx.lineTo(0,3);ctx.lineTo(18,-12);ctx.stroke();ctx.restore();});}
// the network's crew: an actor's figure in a hard hat, as When strategy moves draws one
function a5_crew(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{archGlyph(ctx,"actor",x,y,s,col);ctx.save();ctx.fillStyle=rgba(col,0.9);
  ctx.beginPath();ctx.arc(x,y-s*0.62,s*0.36,Math.PI,0);ctx.lineTo(x+s*0.48,y-s*0.6);ctx.lineTo(x-s*0.48,y-s*0.6);ctx.closePath();ctx.fill();ctx.restore();});}
// A street of seven homes on the line that feeds them, its pole at the left where the network's crew works. st: homes (0..1),
// dark[i] (0..1) each one switched off, work (0..1) the crew there, sparks (0..1) mending the line, letters[i] (0..1) a letter at each
// door, warn[i] (0..1) a home switched off with no warning (red), hiK: one home lit
const A5_SX=[560,760,960,1160,1360,1560,1760],A5_SY=520,A5_SL=640,A5_SS=1.7;
function a5_street(ctx,t,st){const hm=st.homes==null?1:st.homes;if(hm<=0.01)return;
  withA(ctx,hm,()=>{ctx.save();ctx.strokeStyle=rgba(A5_NET,0.6);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(380,A5_SL);ctx.lineTo(1840,A5_SL);ctx.stroke();
    // the pole, and its line out to the street
    ctx.fillStyle=rgba(SOFT,0.7);ctx.fillRect(372,A5_SL-210,10,250);ctx.fillRect(340,A5_SL-200,74,8);ctx.restore();});
  A5_SX.forEach((x,i)=>{const q=clamp(hm*2.2-i*0.18,0,1);if(q<=0.01)return;const dk=(st.dark||[])[i]||0,wn=(st.warn||[])[i]||0;
    if(wn>0.01)glow(ctx,x,A5_SY,90,A5_RED,0.3*wn);a5_home(ctx,x,A5_SY,A5_SS,mix(A5_HH,A5_RED,wn),{a:q,dark:dk});
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(A5_NET,0.45*(1-0.6*dk));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,A5_SY+28*A5_SS+2);ctx.lineTo(x,A5_SL);ctx.stroke();ctx.restore();});
    const lt=(st.letters||[])[i]||0;if(lt>0.01)a5_env(ctx,x+46,A5_SY+40,1.2,A5_NET,lt);});
  const wk=clamp(st.work||0,0,1);if(wk>0.01){withA(ctx,wk,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.75);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(318,A5_SL);ctx.lineTo(352,A5_SL-196);ctx.moveTo(342,A5_SL);ctx.lineTo(370,A5_SL-192);
    for(let r=1;r<8;r++){const u=r/8;ctx.moveTo(lerp(318,352,u),A5_SL-196*u);ctx.lineTo(lerp(342,370,u),A5_SL-192*u);}ctx.stroke();ctx.restore();});a5_crew(ctx,262,A5_SL-40,46,A5_NET,wk);const sp=clamp(st.sparks||0,0,1);if(sp>0.01)for(let j=0;j<5;j++){const u=(t*1.6+j/5)%1;glow(ctx,377+Math.cos(j*2.4)*u*30,A5_SL-198-u*20+u*u*40,8,[255,226,160],0.8*sp*(1-u));}}}
// a letter on paper: who it's from, and its lines, each written as o.p[k] goes to 1; a line in o.bad turns red (0..1)
function a5_letter(ctx,x,y,w,from,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||330,ink=[52,46,42];
  withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.008:o.rot,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.008:o.rot);ctx.translate(-w/2,-h/2);
    ctx.fillStyle=rgba(A5_NET,0.9);ctx.beginPath();ctx.arc(54,56,18,0,TAU);ctx.fill();ctx.strokeStyle="rgba(30,50,90,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(54,56,12,0,TAU);ctx.stroke();
    T(ctx,from,88,66,{w:800,size:30,color:rgba(ink,0.95)});ctx.fillStyle="rgba(60,52,46,0.3)";ctx.fillRect(32,96,w-64,2);
    lines.forEach((s,k)=>{const q=o.p?clamp(o.p[k]||0,0,1):1;if(q<=0.01)return;const bd=clamp((o.bad||[])[k]||0,0,1),yy=160+k*58;
      if(bd>0.01){ctx.save();ctx.fillStyle=rgba(A5_RED,0.16*bd);ctx.fillRect(28,yy-38,w-56,52);ctx.restore();}
      T(ctx,typeOn(s,clamp(q*1.2,0,1)),36,yy,{w:k===lines.length-1&&o.boldLast?800:700,size:36,color:rgba(mix(ink,[200,50,40],bd),0.94)});});ctx.restore();});}
// a day on a calendar page: its name, under a band in the colour of who keeps it; o.bad (0..1) a red cross, o.ok (0..1) a green tick
function a5_day(ctx,x,y,w,day,kicker,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=190;
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.fillStyle="rgba(240,236,226,0.97)";rr(ctx,x,y,w,h,14);ctx.fill();ctx.restore();ctx.fillStyle=rgba(mix(col,[30,30,40],0.15),1);ctx.beginPath();ctx.moveTo(x+14,y);ctx.lineTo(x+w-14,y);ctx.quadraticCurveTo(x+w,y,x+w,y+14);ctx.lineTo(x+w,y+56);ctx.lineTo(x,y+56);ctx.lineTo(x,y+14);ctx.quadraticCurveTo(x,y,x+14,y);ctx.closePath();ctx.fill();
    T(ctx,kicker,x+w/2,y+39,{w:800,size:28,align:"center",color:"rgba(16,20,32,0.95)"});T(ctx,day,x+w/2,y+136,{w:800,size:44,align:"center",color:"rgba(40,40,52,0.95)"});
    if((o.bad||0)>0.01)kt_rcross(ctx,x+w-10,y+h-10,22,o.bad);if((o.ok||0)>0.01)withA(ctx,o.ok,()=>{glow(ctx,x+w-10,y+h-10,50,A5_OK,0.35);ctx.save();ctx.fillStyle="rgba(8,26,16,0.96)";ctx.beginPath();ctx.arc(x+w-10,y+h-10,22,0,TAU);ctx.fill();ctx.restore();ring(ctx,x+w-10,y+h-10,22,A5_OK,1,2.6);tick_(ctx,x+w-10,y+h-10,22,A5_OK,1);});});}
// a phone, upright, with a text on its screen: from whom, and its lines (each 28 px or more, so the phone is drawn large); o.p (0..1)
// types the text in
function a5_phone(ctx,x,y,from,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||520,h=o.h||300,p=clamp(o.p==null?1:o.p,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle="rgba(14,16,24,0.98)";rr(ctx,x,y,w,h,34);ctx.fill();ctx.restore();ctx.strokeStyle=rgba(A5_HH,0.5);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,34);ctx.stroke();
    ctx.fillStyle="rgba(26,30,42,1)";rr(ctx,x+16,y+16,w-32,h-32,22);ctx.fill();T(ctx,from,x+44,y+66,{w:800,size:28,color:rgba(SOFT,1)});
    const bh=lines.length*40+34;ctx.fillStyle=rgba(mix(A5_RET,[30,30,40],0.55),1);rr(ctx,x+40,y+92,w-80,bh,20);ctx.fill();
    let left=p*lines.reduce((s,l)=>s+l.length,0);lines.forEach((l,k)=>{const n=Math.max(0,Math.min(l.length,Math.round(left)));left-=l.length;if(n>0)T(ctx,l.slice(0,n),x+64,y+136+k*40,{w:700,size:30,color:rgba(INK,0.97)});});});}

/* ---------- tables, readers, tickets and cards ---------- */
// a table, as the data platform holds it: glass in the technical side's cyan, a grid glyph, its name; o: a, hi, h, old (0..1: no
// longer used, greyed), miss (0..1: a reader nobody had drawn, dashed amber), rows (0..1: rows moving in), col (its edge's colour)
function a5_table(ctx,x,y,w,name,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.55*clamp(o.dim||0,0,1));if(a<=0.01)return;const h=o.h||96,old=clamp(o.old||0,0,1),ms=clamp(o.miss||0,0,1),col=mix(o.col||TECH,A5_DIM,0.7*old),t=o.t||0;
  withA(ctx,a,()=>{if(ms<0.999)withA(ctx,1-ms,()=>glass(ctx,x,y,w,h,12,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(6,12,22,0.97)"}));
    if(ms>0.001)withA(ctx,ms,()=>{ctx.save();ctx.fillStyle="rgba(14,10,6,0.95)";rr(ctx,x,y,w,h,12);ctx.fill();ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=2.8;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=10;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();});
    a5_glyph(ctx,"table",x+40,y+h/2,14,mix(col,ACA_WARN,ms));const ls=wrapT(ctx,name,0,0,w-96,{size:28,w:700,measure:true});
    ls.forEach((l,i)=>T(ctx,l,x+76,y+h/2+10-(ls.length-1)*16+i*32,{w:700,size:28,color:rgba(mix(INK,A5_DIM,0.6*old),0.96)}));
    const rw=clamp(o.rows||0,0,1);if(rw>0.01)for(let k=0;k<3;k++){const u=(rw*1.6-k*0.3);if(u<=0||u>=1)continue;glow(ctx,x+w-30,y+h/2+(k-1)*16,14,col,0.8*Math.sin(Math.PI*u));}});}
// something that reads or writes a table: a job or a system, a gear in a ring and its name; o.night (0..1): it runs each night, a moon
// on it; o.miss (0..1): one nobody had drawn, dashed amber; o.col
function a5_job(ctx,x,y,w,name,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.55*clamp(o.dim||0,0,1));if(a<=0.01)return;const h=o.h||84,ms=clamp(o.miss||0,0,1),col=o.col||A5_APP,t=o.t||0;
  withA(ctx,a,()=>{if(ms<0.999)withA(ctx,1-ms,()=>glass(ctx,x,y,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.97)"}));
    if(ms>0.001)withA(ctx,ms,()=>{ctx.save();ctx.fillStyle="rgba(14,10,6,0.95)";rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=2.8;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=10;rr(ctx,x,y,w,h,h/2);ctx.stroke();ctx.restore();});
    // a gear
    const gx=x+h/2,gy=y+h/2,gc=mix(col,ACA_WARN,ms);ctx.save();ctx.strokeStyle=rgba(gc,1);ctx.lineWidth=2.6;ctx.beginPath();for(let k=0;k<16;k++){const an=k/16*TAU+t*0.6*(o.spin||0),rr_=k%2?13:18;ctx.lineTo(gx+Math.cos(an)*rr_,gy+Math.sin(an)*rr_);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(gx,gy,5,0,TAU);ctx.stroke();ctx.restore();
    const ls=wrapT(ctx,name,0,0,w-h-34,{size:28,w:700,measure:true});ls.forEach((l,i)=>T(ctx,l,x+h+4,y+h/2+10-(ls.length-1)*16+i*32,{w:700,size:28,color:rgba(INK,0.96)}));
    const nt=clamp(o.night||0,0,1);if(nt>0.01)withA(ctx,nt,()=>{const mx=x+w-6,my=y+4;ctx.save();ctx.fillStyle="rgba(8,10,22,0.97)";ctx.beginPath();ctx.arc(mx,my,20,0,TAU);ctx.fill();ctx.strokeStyle=rgba([220,226,255],0.7);ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle="rgba(236,236,250,0.95)";ctx.beginPath();ctx.arc(mx,my,11,-0.5*Math.PI,0.5*Math.PI,false);ctx.arc(mx+5,my,9.4,0.5*Math.PI,-0.5*Math.PI,true);ctx.closePath();ctx.fill();ctx.restore();});});}
// a line of light from one thing to another, for what flows between them: dashed, with a few motes running along it
function a5_flow(ctx,x0,y0,x1,y1,t,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,o.sa||0.55);ctx.lineWidth=o.lw||2.4;ctx.setLineDash(o.solid?[]:[6,9]);ctx.lineDashOffset=-t*14;
  const mx=(x0+x1)/2+(o.bend||0),my=(y0+y1)/2-(o.lift||0);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,x1,y1);ctx.stroke();ctx.restore();
  if(o.head){const an=Math.atan2(y1-my,x1-mx);ctx.save();ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*16,y1-Math.sin(an-0.45)*16);ctx.lineTo(x1-Math.cos(an+0.45)*16,y1-Math.sin(an+0.45)*16);ctx.closePath();ctx.fill();ctx.restore();}
  if(o.n!==0)for(let j=0;j<(o.n||3);j++){const u=((t*(o.v||0.4)+j/(o.n||3)+(o.ph||0))%1),v=1-u,px=v*v*x0+2*v*u*mx+u*u*x1,py=v*v*y0+2*v*u*my+u*u*y1;glow(ctx,px,py,o.r||14,col,0.6*Math.sin(Math.PI*u));}});}
// a card of glass with a kicker in mono and lines under it, for what the narration names; returns its height
function a5_card(ctx,x,y,w,kicker,lines,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-56,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));
  const h=Math.max(o.minH||0,(kicker?76:28)+L.length*sz*1.25+18);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.97)"});
    if(kicker)T(ctx,kicker,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});L.forEach((l,i)=>T(ctx,l,x+28,y+(kicker?76:28)+sz*0.92+i*sz*1.25,{w:700,size:sz,color:rgba(o.ink||INK,0.96)}));});return h;}
// a ticket, where the business asks: its title, who asked, and its state, open
function a5_ticket(ctx,x,y,w,title,asker,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ls=wrapT(ctx,title,0,0,w-56,{size:30,w:800,measure:true}),h=150+ls.length*38;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,BIZ,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(12,11,8,0.97)"});T(ctx,"ticket",x+28,y+46,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
    const st="open",sw=tw(ctx,st,28,800)+36;glass(ctx,x+w-sw-24,y+22,sw,40,20,BIZ,{glow:6,ea:0.9,fill:"rgba(7,12,24,0.94)"});T(ctx,st,x+w-sw/2-24,y+52,{w:800,size:28,align:"center",color:rgba(BIZ,1)});
    ls.forEach((l,i)=>T(ctx,l,x+28,y+100+i*38,{w:800,size:30,color:rgba(INK,0.97)}));T(ctx,asker,x+28,y+h-28,{w:700,size:28,color:rgba(SOFT,1)});});return h;}
// an owner, as the business side marks one: a gold tick and a name; o.ring (0..1): not yet agreed, an empty ring instead of the tick
function a5_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||30,rg=clamp(o.ring||0,0,1);
  if(rg<0.999)kt_gtick(ctx,x,y,sz*0.5,1-rg);if(rg>0.001){ctx.save();ctx.globalAlpha*=rg;ctx.strokeStyle=rgba(BIZ,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,sz*0.5,0,TAU);ctx.stroke();ctx.restore();}
  if((o.hi||0)>0.01)glow(ctx,x,y,sz*2,BIZ,0.4*o.hi);T(ctx,name,x+sz*0.9,y+sz*0.36,{w:800,size:sz,color:rgba(o.col||BIZ,1)});});}
// the agent's own identity: a badge like a staff card, with the agent's orb on it, and what it may do written under it
function a5_badge(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const hi=o.hi||0;
  withA(ctx,a,()=>{glass(ctx,x-44,y-58,88,116,10,KT_AI,{glow:10+16*hi,ea:0.9,fill:"rgba(7,14,20,0.97)"});ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(x-14,y-66,28,10);
    kt_agent(ctx,x,y-16,15,t,{});ctx.fillStyle=rgba(KT_AI,0.55);ctx.fillRect(x-28,y+16,56,5);ctx.fillRect(x-28,y+30,40,5);});}
// a mask over what's personal or sensitive: dark hatching across it
function a5_mask(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{ctx.save();rr(ctx,x,y,w,h,8);ctx.fillStyle="rgba(24,26,38,0.97)";ctx.fill();ctx.clip();ctx.strokeStyle="rgba(160,170,196,0.35)";ctx.lineWidth=6;ctx.beginPath();for(let i=-h;i<w;i+=22){ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);}ctx.stroke();ctx.restore();
    ctx.save();ctx.strokeStyle="rgba(160,170,196,0.85)";ctx.lineWidth=2.4;rr(ctx,x,y,w,h,8);ctx.stroke();ctx.restore();});}
// a decision, as the business records one: its ID, what was decided, and who decided it, with a gold tick; o.p (0..1) writes it
function a5_dec(ctx,x,y,w,id,lines,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-64,{size:30,w:700,measure:true}).forEach(l=>L.push(l)));const h=150+L.length*40,p=clamp(o.p==null?1:o.p,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgb(14,12,6)";rr(ctx,x,y,w,h,20);ctx.fill();ctx.restore();glass(ctx,x,y,w,h,20,BIZ,{glow:14+14*(o.hi||0),ea:0.9,fill:"rgba(14,12,6,0.97)"});a5_glyph(ctx,"decision",x+44,y+44,15,BIZ);T(ctx,"decision · "+id,x+76,y+54,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
    let left=p*L.reduce((s,l)=>s+l.length,0);L.forEach((l,i)=>{const n=Math.max(0,Math.min(l.length,Math.round(left)));left-=l.length;if(n>0)T(ctx,l.slice(0,n),x+32,y+110+i*40,{w:700,size:30,color:rgba(INK,0.97)});});
    const wA=clamp(o.who==null?1:o.who,0,1);if(wA>0.01)a5_owner(ctx,x+50,y+h-34,who,wA,{size:28});});return h;}
// a speech bubble: a household's (warm, its tail down to the right) or (o.left) its tail down to the left
function a5_bubble(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||30,col=o.col||A5_HH,w=tw(ctx,text,sz,700)+56,h=sz+34,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.save();ctx.fillStyle=rgba(col,0.85);const tx=o.left?X+38:X+w-38;
    ctx.beginPath();ctx.moveTo(tx-9,y+h/2-2);ctx.lineTo(tx+(o.left?-16:16),y+h/2+16);ctx.lineTo(tx+9,y+h/2-2);ctx.closePath();ctx.fill();ctx.restore();
    T(ctx,text,X+28,y+sz*0.36,{w:700,size:sz,color:rgba(mix(col,INK,0.5),1)});});return w;}
// a row of blocks for time: n of them, each w wide, filled as far as p (0..n); o.label under it
function a5_blocks(ctx,x,y,n,w,p,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const g=o.gap||8,h=o.h||40;
  withA(ctx,a,()=>{for(let i=0;i<n;i++){const q=clamp(p-i,0,1),bx=x+i*(w+g);ctx.save();ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2;rr(ctx,bx,y,w,h,6);ctx.stroke();if(q>0.01){ctx.fillStyle=rgba(col,0.75);rr(ctx,bx,y,w*q,h,6);ctx.fill();}ctx.restore();}
    if(o.label)T(ctx,o.label,o.lx==null?x:o.lx,y+h+44,{w:800,size:o.size||30,align:o.align||"left",color:rgba(col,1)});});}
// a household's phone ringing: a handset in warm light, with rings round it (o.ring, 0..1)
function a5_handset(ctx,x,y,s,col,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const rg=clamp(o.ring||0,0,1);if(rg>0.01)for(let k=0;k<3;k++){const u=(t*0.9+k/3)%1;ring(ctx,x,y,s*(1.2+u*1.6),col,rg*(1-u)*0.8,2);}
  ctx.save();ctx.translate(x,y);ctx.scale(s/30,s/30);ctx.rotate(-0.5);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(-20,-16);ctx.quadraticCurveTo(-26,-6,-20,6);ctx.lineTo(-12,4);ctx.lineTo(-10,-8);ctx.lineTo(-14,-18);ctx.closePath();ctx.moveTo(20,-16);ctx.quadraticCurveTo(26,-6,20,6);ctx.lineTo(12,4);ctx.lineTo(10,-8);ctx.lineTo(14,-18);ctx.closePath();
  ctx.moveTo(-16,-16);ctx.quadraticCurveTo(0,-28,16,-16);ctx.stroke();ctx.restore();});}
