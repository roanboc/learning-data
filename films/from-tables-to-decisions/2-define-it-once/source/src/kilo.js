/* ===== Defined in the open: the kilogram, 1889 to 2019 =====
   The opening story, drawn in the warm light of its vault, so the past reads apart from the navy map of the university.
     dnVault      the place: a vault of dressed stone, an arched niche, a lamp on the left wall, and a stone plinth in the middle
   Pieces drawn live over it, in the place's coordinates: dn_cyl (a polished cylinder of platinum and iridium: the kilogram, or one
   of its copies), dn_jar (a glass bell jar), dn_kilo (the kilogram on its stand under two nested bell jars), dn_arc (the forty
   copies on an arc, each over its country's dot; later, the constant in every one of those places), dn_balance (a copy weighed
   against the kilogram), dn_fan (how the copies drifted from 1889 to 1989), dn_planck and dn_planckCard (the Planck constant, as
   the SI writes it), dn_kibble (a Kibble balance: a coil over a magnet) and dn_us (the United States' standard of mass). dn_card
   is a card whose lines come in one by one, the card growing to hold each; the university's pictures use it too. Words are on
   cards and tags, in English. Every name starts with dn_ or DN_. */

/* ---------------------------------------------------------------- the past's colours: stone, lamplight, polished metal, brass */
const DN={stone:[64,49,37],lamp:[255,200,138],warm:[255,214,168],metal:[198,194,188],metalDk:[82,76,70],metalHi:[255,250,240],
  brass:[204,160,94],brassDk:[118,86,46],copper:[214,132,80],iron:[54,52,56]};

/* ---------------------------------------------------------------- the vault, painted once */
AG_PLACES.dnVault=c=>{const R=ag_rnd(1889);
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1a120d");g.addColorStop(0.7,"#251a13");g.addColorStop(1,"#0f0a07");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the back wall: courses of dressed stone, each block a little different
  for(let row=0,y=-24;y<790;row++,y+=92){let x=-(row%2?130:20);while(x<W){const w=190+R()*130,v=R();c.fillStyle=rgba(mix([50,38,29],[80,62,46],v),1);rr(c,x+3,y+3,w-6,86,6);c.fill();
    c.fillStyle="rgba(255,226,190,0.035)";c.fillRect(x+6,y+5,w-12,3);x+=w;}}
  // the arched niche, deeper and darker, where the plinth stands, and the lighter stone round it
  const nx0=700,nx1=1220,ny=310,nb=792,niche=()=>{c.beginPath();c.moveTo(nx0,nb);c.lineTo(nx0,ny);c.arc(960,ny,260,Math.PI,TAU);c.lineTo(nx1,nb);c.closePath();};
  c.save();c.lineWidth=30;c.strokeStyle="rgba(128,98,70,0.6)";niche();c.stroke();c.restore();
  niche();g=c.createLinearGradient(0,50,0,nb);g.addColorStop(0,"#0e0906");g.addColorStop(1,"#1b130d");c.fillStyle=g;c.fill();
  // the floor: flagstones falling into the dark
  g=c.createLinearGradient(0,790,0,H);g.addColorStop(0,"#3b2b1f");g.addColorStop(1,"#0f0a07");c.fillStyle=g;c.fillRect(0,790,W,H-790);
  c.strokeStyle="rgba(8,5,3,0.55)";c.lineWidth=2;for(const y of [826,874,944,1036]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let i=-14;i<=14;i++){c.beginPath();c.moveTo(960+i*74,790);c.lineTo(960+i*270,H);c.stroke();}
  // the plinth: a block of stone under a slab, its top at y 760, lit from the left
  g=c.createLinearGradient(820,0,1100,0);g.addColorStop(0,"#6e5440");g.addColorStop(0.5,"#4e3b2c");g.addColorStop(1,"#2c2018");c.fillStyle=g;c.fillRect(830,782,260,H-782);
  g=c.createLinearGradient(790,0,1130,0);g.addColorStop(0,"#9a7a5c");g.addColorStop(0.55,"#715843");g.addColorStop(1,"#3e2e22");c.fillStyle=g;rr(c,792,756,336,30,6);c.fill();
  c.fillStyle="rgba(255,230,196,0.16)";c.fillRect(798,757,324,3);c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(830,786,260,10);
  // the lamp on the left wall: a bracket and a glass shade
  c.strokeStyle="#2a1e14";c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(250,300);c.lineTo(250,262);c.quadraticCurveTo(252,228,300,226);c.stroke();
  g=c.createRadialGradient(312,246,2,312,246,30);g.addColorStop(0,"rgba(255,246,224,1)");g.addColorStop(0.5,"rgba(255,206,140,0.95)");g.addColorStop(1,"rgba(190,120,60,0.9)");
  c.fillStyle=g;c.beginPath();c.moveTo(292,230);c.lineTo(332,230);c.quadraticCurveTo(344,266,312,274);c.quadraticCurveTo(280,266,292,230);c.fill();
  // its light: a pool on the wall, another on the plinth and the niche, a little on the floor; the far corners stay dark
  c.save();c.globalCompositeOperation="lighter";
  for(const [x,y,r,a] of [[312,250,760,0.2],[312,250,150,0.4],[960,700,460,0.16],[960,820,620,0.06]]){g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(DN.lamp,a));g.addColorStop(1,rgba(DN.lamp,0));c.fillStyle=g;c.fillRect(0,0,W,H);}
  c.restore();
  g=c.createRadialGradient(W*0.45,H*0.5,H*0.3,W/2,H/2,W*0.72);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.62)");c.fillStyle=g;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the kilogram and its copies */
// a polished cylinder, as tall as it is wide, standing on (x, y), w wide; o.gold (0 to 1) lit gold, as the one that is the kilogram; o.a
function dn_cyl(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w,rx=w/2,ry=w*0.11,gd=clamp(o.gold||0,0,1);ctx.save();ctx.globalAlpha*=a;
  if(gd>0)glow(ctx,x,y-h/2,w*1.7,MD.agreed,0.5*gd);
  let g=ctx.createLinearGradient(x-rx,0,x+rx,0);
  [[0,DN.metalDk],[0.12,DN.metal],[0.28,DN.metalHi],[0.42,DN.metal],[0.7,[132,126,118]],[0.88,DN.metalDk],[1,[58,54,50]]].forEach(([s,cl])=>g.addColorStop(s,rgba(mix(cl,MD.agreed,0.35*gd),1)));
  ctx.beginPath();ctx.moveTo(x-rx,y-h);ctx.lineTo(x-rx,y);ctx.ellipse(x,y,rx,ry,0,Math.PI,0,true);ctx.lineTo(x+rx,y-h);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  g=ctx.createLinearGradient(x-rx,y-h-ry,x+rx,y-h+ry);g.addColorStop(0,rgba(mix(DN.metalHi,MD.agreed,0.3*gd),1));g.addColorStop(1,rgba(mix([150,144,136],MD.agreed,0.3*gd),1));
  ctx.beginPath();ctx.ellipse(x,y-h,rx,ry,0,0,TAU);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(mix([255,240,220],MD.agreed,gd),0.3+0.5*gd);ctx.lineWidth=Math.max(1,w*0.03);ctx.stroke();
  ctx.restore();}
// a glass bell jar standing on (x, y), w wide and h tall; o.a
function dn_jar(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=w/2,top=y-h+r;ctx.save();ctx.globalAlpha*=a;
  ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x-r,top);ctx.arc(x,top,r,Math.PI,TAU);ctx.lineTo(x+r,y);
  const g=ctx.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,"rgba(255,232,200,0.11)");g.addColorStop(0.25,"rgba(255,240,220,0.035)");g.addColorStop(0.75,"rgba(255,240,220,0.02)");g.addColorStop(1,"rgba(255,232,200,0.07)");
  ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(255,236,210,0.42)";ctx.lineWidth=2;ctx.stroke();
  // the lamp's light on the glass: a long streak down its left side, a short one on the dome
  ctx.lineCap="round";ctx.strokeStyle="rgba(255,246,230,0.5)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-r+9,y-12);ctx.lineTo(x-r+9,top+4);ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,top,r-10,Math.PI*1.12,Math.PI*1.38);ctx.stroke();
  ctx.strokeStyle="rgba(255,236,210,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r,r*0.12,0,0,TAU);ctx.stroke();
  ctx.fillStyle="rgba(255,240,222,0.22)";ctx.strokeStyle="rgba(255,236,210,0.55)";ctx.beginPath();ctx.arc(x,y-h-6,8,0,TAU);ctx.fill();ctx.stroke();
  ctx.restore();}
// the kilogram: the cylinder on its stand under two nested bell jars; (x, y) is where the stand sits, s its size.
// o.gold (0 to 1) the cylinder lit as the kilogram; o.scratch (0 to 1) a hairline scratch on the outer jar catches the light; o.a
function dn_kilo(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const g=ctx.createLinearGradient(-104,0,104,0);g.addColorStop(0,"#a68866");g.addColorStop(0.5,"#7a6048");g.addColorStop(1,"#3c2c20");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-104,-8);ctx.lineTo(-104,0);ctx.ellipse(0,0,104,13,0,Math.PI,0,true);ctx.lineTo(104,-8);ctx.closePath();ctx.fill();
  ctx.fillStyle="#b89a76";ctx.beginPath();ctx.ellipse(0,-8,104,13,0,0,TAU);ctx.fill();
  dn_cyl(ctx,0,-12,64,{gold:o.gold});dn_jar(ctx,0,-10,132,168);dn_jar(ctx,0,-6,188,232);
  const sc=clamp(o.scratch||0,0,1);if(sc>0){ctx.save();ctx.globalAlpha*=sc;glow(ctx,62,-150,46,[255,236,200],0.6);ctx.strokeStyle="rgba(255,250,236,0.95)";ctx.lineWidth=2;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(52,-176);ctx.quadraticCurveTo(64,-152,74,-128);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the forty copies, on an arc round the kilogram */
const DN_ARC={cx:960,cy:860,r:640,a0:-150,a1:-30,n:40,from:[960,690]};
function dn_arcAt(i){const t=lerp(DN_ARC.a0,DN_ARC.a1,i/(DN_ARC.n-1))*Math.PI/180;return[DN_ARC.cx+DN_ARC.r*Math.cos(t),DN_ARC.cy+DN_ARC.r*Math.sin(t)];}
// o.n (0 to 1) they spring out from the kilogram one after another, each to its country's dot; o.weights (0 to 1) a small weight
// beside each, checked against it; o.dim (0 to 1); o.lines (0 to 1) a line from each to the one cylinder; o.gold (0 to 1) each
// becomes the constant, a gold disc; o.a
function dn_arc(ctx,o){o=o||{};const a=o.a==null?1:o.a,n=o.n==null?1:o.n;if(a<=0.004||n<=0)return;ctx.save();ctx.globalAlpha*=a;const N=DN_ARC.n,F=DN_ARC.from;
  const ln=clamp(o.lines||0,0,1);if(ln>0){ctx.save();ctx.lineCap="round";for(let i=0;i<N;i++){const p=dn_arcAt(i),u=ag_sine(clamp(ln*1.5-i/N*0.5,0,1));if(u<=0)continue;
    ctx.strokeStyle=rgba(DN.warm,0.32);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(p[0],p[1]+6);ctx.lineTo(lerp(p[0],F[0],u),lerp(p[1]+6,F[1],u));ctx.stroke();}ctx.restore();}
  for(let i=0;i<N;i++){const s0=i/(N-1)*0.6,u=clamp((n-s0)/0.4,0,1);if(u<=0)continue;const e=ag_eo(u),p=dn_arcAt(i),x=lerp(F[0],p[0],e),y=lerp(F[1],p[1],e),
      gd=clamp((o.gold||0)*1.5-i/N*0.5,0,1),dm=1-0.62*clamp(o.dim||0,0,1);
    // the country's dot, just outside the arc
    const dx=(p[0]-DN_ARC.cx)/DN_ARC.r,dy=(p[1]-DN_ARC.cy)/DN_ARC.r;ctx.save();ctx.globalAlpha*=ag_in(u,0.5,0.5)*dm;ctx.fillStyle=rgba(mix([150,116,86],[214,170,120],hash(i,7)),0.85);
    ctx.beginPath();ctx.arc(p[0]+dx*30,p[1]+dy*30-12,5,0,TAU);ctx.fill();ctx.restore();
    if(gd<1){ctx.save();ctx.globalAlpha*=dm*(1-gd);dn_cyl(ctx,x,y+11,22);
      const wk=clamp((o.weights||0)*1.6-hash(i,3)*0.6,0,1);if(wk>0){ctx.globalAlpha*=wk;ctx.fillStyle=rgba(DN.brass,1);rr(ctx,x+15,y+1,10,10,2);ctx.fill();ctx.beginPath();ctx.arc(x+20,y-1,3,0,TAU);ctx.fill();}
      ctx.restore();}
    if(gd>0){ctx.save();ctx.globalAlpha*=gd;glow(ctx,p[0],p[1],30,MD.agreed,0.7);ctx.fillStyle=rgba(MD.agreed,1);ctx.beginPath();ctx.arc(p[0],p[1],9,0,TAU);ctx.fill();
      ctx.strokeStyle=rgba(MD.agreed,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.arc(p[0],p[1],15,0,TAU);ctx.stroke();ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- a copy weighed against the kilogram */
// (x, y) the foot, s the size; o.tilt (radians: the right pan lower); o.a, o.k (springs from its foot)
function dn_balance(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  if(o.k!=null)ag_about(ctx,0,-150,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  const br=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(DN.brass,[255,240,210],0.3),1));g.addColorStop(0.5,rgba(DN.brass,1));g.addColorStop(1,rgba(DN.brassDk,1));return g;};
  ctx.fillStyle=br(-90,90);ctx.beginPath();ctx.moveTo(-86,0);ctx.lineTo(86,0);ctx.lineTo(60,-22);ctx.lineTo(-60,-22);ctx.closePath();ctx.fill();
  ctx.fillStyle=br(-9,9);ctx.fillRect(-9,-300,18,280);
  const tl=o.tilt||0,ex=Math.cos(tl)*176,ey=Math.sin(tl)*176;ctx.save();ctx.translate(0,-304);ctx.rotate(tl);ctx.fillStyle=br(-180,180);rr(ctx,-182,-7,364,14,6);ctx.fill();
  ctx.fillStyle=rgba(DN.brassDk,1);ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(8,0);ctx.lineTo(0,70);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(mix(DN.brass,[255,240,210],0.4),1);ctx.beginPath();ctx.arc(0,-304,11,0,TAU);ctx.fill();
  for(const [px,py,gold] of [[-ex,-304-ey,0],[ex,-304+ey,1]]){ctx.strokeStyle=rgba(DN.brass,0.8);ctx.lineWidth=2;
    for(const dx of [-50,0,50]){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+dx,py+128);ctx.stroke();}
    ctx.fillStyle=br(px-56,px+56);ctx.beginPath();ctx.ellipse(px,py+130,58,11,0,0,TAU);ctx.fill();
    dn_cyl(ctx,px,py+126,36,{gold});}
  ctx.restore();}

/* ---------------------------------------------------------------- how the copies drifted */
// a card, w by h at (x, y): the kilogram's line flat in gold (by definition it can't move), and the copies' lines spreading from
// 1889 to 1989; o.u (0 to 1) drawn so far, o.label (0 to 1) the words under it, o.a, o.k
function dn_fan(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:DN.warm,glow:0.4,edgeA:0.55});const x0=x+70,x1=x+w-60,yb=y+h-150,u=clamp(o.u==null?1:o.u,0,1);
  md_T(ctx,"1889",x0,yb+52,{w:700,size:28,col:DN.warm,align:"center"});md_T(ctx,"1989",x1,yb+52,{w:700,size:28,col:DN.warm,align:"center"});
  ctx.strokeStyle=rgba(MD.agreed,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yb);ctx.lineTo(x0+(x1-x0)*u,yb);ctx.stroke();
  const R=ag_rnd(1989);ctx.lineCap="round";ctx.lineJoin="round";for(let i=0;i<11;i++){const d=lerp(-26,118,(i+R()*0.7)/10.7),m=d*(0.35+R()*0.3),pts=[[x0,yb],[lerp(x0,x1,0.57),yb-m],[x1,yb-d]];
    ctx.strokeStyle=rgba(mix(DN.warm,DN.metal,R()),0.75);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,yb);
    const L=u;if(L<=0.57){const k=L/0.57;ctx.lineTo(lerp(pts[0][0],pts[1][0],k),lerp(pts[0][1],pts[1][1],k));}else{ctx.lineTo(pts[1][0],pts[1][1]);const k=(L-0.57)/0.43;ctx.lineTo(lerp(pts[1][0],pts[2][0],k),lerp(pts[1][1],pts[2][1],k));}ctx.stroke();}
  const la=clamp(o.label||0,0,1);if(la>0)md_T(ctx,"up to about 50 millionths of a gram",x+w/2,y+h-34,{w:700,size:28,align:"center",a:la});
  ctx.restore();}

/* ---------------------------------------------------------------- the constant */
// h = 6.626 070 15 × 10⁻³⁴ J s, drawn from its parts, so the power of ten is raised and still 30 px: the fonts have no superscript
// minus. Left-aligned at (x, y); o.size (44), o.col, o.a; returns its width (o.measure: only measure)
function dn_planck(ctx,x,y,o){o=o||{};const size=o.size||44,col=o.col||MD.ink,a=o.a==null?1:o.a,f={w:700,size},e={w:700,size:Math.max(30,Math.round(size*0.66))},
    p1="h = 6.626 070 15 × 10",p2="−34",p3=" J s",w1=md_tw(ctx,p1,f),w2=md_tw(ctx,p2,e)+6,w3=md_tw(ctx,p3,f);
  if(o.measure)return w1+w2+w3;md_T(ctx,p1,x,y,Object.assign({col,a},f));md_T(ctx,p2,x+w1+2,y-size*0.42,Object.assign({col,a},e));md_T(ctx,p3,x+w1+w2,y,Object.assign({col,a},f));return w1+w2+w3;}
// the constant's card, in gold: centred on cx, its top at y; o.sub (0 to 1) "fixed exactly · from 20 May 2019" comes in; o.size;
// o.k (springs), o.a; returns its box
function dn_planckCard(ctx,cx,y,o){o=o||{};const size=o.size||44,fw=dn_planck(ctx,0,0,{size,measure:true}),w=fw+2*MD_PAD,sub=ag_sine(clamp(o.sub||0,0,1)),
    h=MD_PAD+40+size+14+sub*40+MD_PAD-8,x=cx-w/2,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:MD.agreed});
  md_T(ctx,"THE PLANCK CONSTANT",x+MD_PAD,y+MD_PAD+24,{w:800,size:28,ls:4,col:MD.agreed});dn_planck(ctx,x+MD_PAD,y+MD_PAD+40+size+2,{size});
  if(sub>0.01)md_T(ctx,"fixed exactly · from 20 May 2019",x+MD_PAD,y+MD_PAD+40+size+14+34,{w:600,size:28,col:MD.soft,a:sub});ctx.restore();return bb;}

/* ---------------------------------------------------------------- a Kibble balance */
// a wheel balance over a coil in a magnet's gap: the mass on its pan on one side, the coil under it, a counterweight on the
// other. (x, y) the foot, s the size; o.field (0 to 1) the gap glows, the force the coil feels; o.a, o.k
function dn_kibble(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  if(o.k!=null)ag_about(ctx,0,-260,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  const metal=(x0,x1,c)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(c,[255,244,224],0.35),1));g.addColorStop(0.5,rgba(c,1));g.addColorStop(1,rgba(mix(c,[0,0,0],0.45),1));return g;};
  ctx.fillStyle=metal(-200,200,[120,108,96]);rr(ctx,-200,-26,400,26,6);ctx.fill();
  ctx.fillStyle=metal(-170,-150,[132,120,106]);ctx.fillRect(-172,-560,20,536);ctx.fillStyle=metal(150,170,[132,120,106]);ctx.fillRect(152,-560,20,536);
  ctx.fillStyle=metal(-180,180,[132,120,106]);rr(ctx,-184,-580,368,24,6);ctx.fill();
  // the wheel, on its pivot under the top beam
  ctx.strokeStyle=rgba(DN.brass,1);ctx.lineWidth=10;ctx.beginPath();ctx.arc(0,-480,66,0,TAU);ctx.stroke();ctx.lineWidth=3;for(let i=0;i<6;i++){const an=i*TAU/6;ctx.beginPath();ctx.moveTo(0,-480);ctx.lineTo(Math.cos(an)*62,-480+Math.sin(an)*62);ctx.stroke();}
  ctx.fillStyle=rgba(DN.brassDk,1);ctx.fillRect(-6,-556,12,76);ctx.fillStyle=rgba(DN.brass,1);ctx.beginPath();ctx.arc(0,-480,12,0,TAU);ctx.fill();
  // the band over the wheel: on the left the mass and the coil, on the right the counterweight
  ctx.strokeStyle="rgba(230,220,200,0.8)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-66,-480);ctx.lineTo(-66,-200);ctx.stroke();ctx.beginPath();ctx.moveTo(66,-480);ctx.lineTo(66,-330);ctx.stroke();
  ctx.fillStyle=metal(40,92,[110,104,98]);rr(ctx,40,-330,52,70,6);ctx.fill();
  ctx.fillStyle=metal(-112,-20,DN.brass);ctx.beginPath();ctx.ellipse(-66,-300,48,9,0,0,TAU);ctx.fill();dn_cyl(ctx,-66,-304,34);
  // the magnet: a squat iron pot with a ring-shaped gap, and the coil hanging in it
  const fl=clamp(o.field||0,0,1);ctx.fillStyle=metal(-150,20,DN.iron);rr(ctx,-150,-150,168,124,10);ctx.fill();
  ctx.fillStyle="#0c0a0a";rr(ctx,-128,-150,124,10,4);ctx.fill();if(fl>0)glow(ctx,-66,-150,90,MD.flow,0.45*fl);
  ctx.fillStyle=metal(-116,-16,DN.copper);rr(ctx,-116,-206,100,58,8);ctx.fill();ctx.strokeStyle="rgba(90,40,16,0.6)";ctx.lineWidth=2;
  for(let k=0;k<7;k++){ctx.beginPath();ctx.moveTo(-114,-200+k*8);ctx.lineTo(-18,-200+k*8);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the United States' standard of mass */
// a card at (x, y): "United States", "standard of mass", then copy no. 20, struck through (o.strike 0 to 1), and a Kibble balance
// in its place (o.kb 0 to 1); o.a, o.k; returns its box
function dn_us(ctx,x,y,o){o=o||{};const w=560,kb=ag_sine(clamp(o.kb||0,0,1)),h=MD_PAD+40+46+20+44+kb*50+MD_PAD-6,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:DN.warm,glow:0.4,edgeA:0.6});
  md_T(ctx,"UNITED STATES",x+MD_PAD,y+MD_PAD+24,{w:800,size:28,ls:4,col:DN.warm});md_T(ctx,"standard of mass",x+MD_PAD,y+MD_PAD+40+36,{w:700,size:36});
  const ry=y+MD_PAD+40+46+20+30,st=clamp(o.strike||0,0,1);md_T(ctx,"copy no. 20",x+MD_PAD,ry,{w:600,size:32,col:st>0.5?MD.soft:MD.ink});
  if(st>0){const tw=md_tw(ctx,"copy no. 20",{w:600,size:32});ctx.strokeStyle=rgba(DN.warm,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+MD_PAD-6,ry-11);ctx.lineTo(x+MD_PAD-6+(tw+12)*ag_sine(st),ry-11);ctx.stroke();}
  if(kb>0.01){md_icon(ctx,"tick",x+MD_PAD+16,ry+40,30,MD.pass,{a:kb});md_T(ctx,"a Kibble balance",x+MD_PAD+46,ry+50,{w:700,size:32,a:kb});}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a card whose lines come in one by one */
// lines [{s, size (28), w (600), col, f, k (0 to 1: how far it has come in), lh (its line's height), x (indent), strike (0 to 1),
// draw (ctx, x, baseline, alpha): something of its own instead of words}]; the card grows to hold each line as it comes in.
// o.edge, o.kick, o.kickCol, o.a, o.k (springs from its centre), o.minH; returns the box
function dn_card(ctx,x,y,w,lines,o){o=o||{};let h=MD_PAD+(o.kick?40:0);const rows=[];
  // a new line opens its gap first, then its words come in, so no line is ever drawn over another
  for(const l of lines){const k0=clamp(l.k==null?1:l.k,0,1),g=ag_sine(clamp(k0/0.6,0,1)),k=ag_sine(clamp((k0-0.4)/0.6,0,1)),lh=l.lh||Math.round((l.size||28)*1.42);rows.push([l,h,k,lh]);h+=lh*g;}
  h=Math.max(o.minH||0,h+MD_PAD-6);const a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge,glow:o.glow,dash:o.dash});
  if(o.kick)md_T(ctx,String(o.kick).toUpperCase(),x+MD_PAD,y+MD_PAD+24,{w:800,size:28,ls:4,col:o.kickCol||o.edge||MD.soft});
  for(const [l,top,k,lh] of rows){if(k<=0.02)continue;const by=y+top+lh*0.78,lx=x+MD_PAD+(l.x||0);
    if(l.draw){l.draw(ctx,lx,by,k);continue;}
    md_T(ctx,l.s,lx,by,{w:l.w||600,size:l.size||28,f:l.f,col:l.col||MD.ink,a:k*(l.a==null?1:l.a)});
    if(l.strike>0){const tw=md_tw(ctx,l.s,{w:l.w||600,size:l.size||28,f:l.f});ctx.strokeStyle=rgba(l.strikeCol||MD.fail,0.95);ctx.lineWidth=3;ctx.beginPath();
      ctx.moveTo(lx-6,by-(l.size||28)*0.33);ctx.lineTo(lx-6+(tw+12)*ag_sine(l.strike),by-(l.size||28)*0.33);ctx.stroke();}}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the opening's tag, in the frame's own coordinates */
function dn_placeTag(ctx,S,text,a){if(a<=0.01)return;setScreen(ctx,S);md_label(ctx,96,100,text,{col:DN.warm,a});}
