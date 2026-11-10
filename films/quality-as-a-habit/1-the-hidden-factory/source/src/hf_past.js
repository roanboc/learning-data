/* ===== The hidden factory: Washington, 1899; the zones of 1943; the ZIP Code of 1963 =====
   The opening's places, painted once, full-frame and matte in the module's light (daylight from the right, soft shadows falling a
   little to the left, no outlines, no film grain), dressed for their time and drawn anew: no flags, eagles, lettering or maker on
   any building or machine, and nobody a likeness. None of the module's six meaning colours is used here: stone, plaster, oak, paper,
   ink and iron mean nothing, and the counts that are measures come on the module's own steel cards. Every name here starts with hf_
   or HF_.
     hf_scr(ctx, S, fn)                draw in screen space, whatever the camera is doing
     hf_tag(ctx, text, a, o)           the place and year, on a small paper card at the top left (in screen space)
     hf_hand(ctx, s, x, y, o)          words written by hand: slanted, o.p (0 to 1) writes them on letter by letter; o.size, o.col
                                       (ink by default; HF.pencil for pencil), o.w, o.align, o.a
     hf_env(ctx, x, y, w, lines, o)    an envelope, its middle at (x, y), w wide: lines [[words, {col, p, size}], ...] in the sender's
                                       hand; o.stamp, o.mark (a postmark), o.rot, o.a, o.k (springs in), o.on ("wall" or "desk"),
                                       o.note (a pencilled line across it, o.noteP), o.code ([digits, p], the sender's code, in pen)
     hf_walker(ctx, x, y, s, o)        a person far off in the dress of 1899, walking (no face): o.kind "woman" or "man", o.t, o.ph,
                                       o.walk (0 to stand), o.flip, o.col
     hf_wagon(ctx, x, y, s, t, o)      a horse and a closed box wagon of the 1890s at a walk, facing left; (x, y) where the near back
                                       wheel meets the street
     hf_basket, hf_sack                a wicker basket of letters, a canvas sack tied at the neck
   The places: hfStreet (a broad street in morning light before a long classical front of pale stone), hfRoom (a long room of the
   1890s: pigeonhole cases along the back wall, tall windows on the right, long oak tables; its clerks are drawn live, hf_clerks),
   hfDesk (a reading table's top, close, in the light from the window: where envelopes lie), hfCase (1943: a pigeonhole case
   with a number on each hole) and hfMachine (1963: a plain letter-sorting machine and the case beside it, drawn without a maker). */

const HF={ink:[48,38,32],pencil:[76,74,78],paper:[242,234,214],paperSh:[214,202,178],oak:[150,108,70],oakD:[98,66,40],oakL:[188,148,104],
  iron:[52,50,50],plaster:[226,216,196],stone:[222,210,188],stoneSh:[172,158,138],road:[156,142,122],sky0:[192,204,212],sky1:[236,228,212]};
// people of 1899, far off and close: skin tones, and the clothes of the time in colours that mean nothing here
const HF_SKIN=[[232,198,170],[214,170,134],[176,126,96],[238,206,182],[124,86,64]];
const HF_CLOTH=[[44,42,50],[70,58,56],[86,70,60],[58,56,64],[102,84,74],[36,36,40]];
const hf_sh=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];

/* ---------------------------------------------------------------- small helpers */
function hf_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
function hf_tag(ctx,s,a,o){o=o||{};if(a<=0.01)return;const f={w:500,size:28,f:"mono"},w=dq_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  dq_card(ctx,x,y,w,h,{r:10});dq_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:DQ.ink});ctx.restore();}
// the latest of [[t, words, dissolve], ...] passed, dissolving from the one before; null words hide it
function hf_tags(ctx,S,t,list,a){a=a==null?1:a;if(a<=0.01)return;let i=0;for(let k=1;k<list.length;k++)if(t>=list[k][0])i=k;
  const d=list[i][2]==null?0.6:list[i][2],u=i>0?(d>0?ag_in(t,list[i][0],d):1):ag_in(t,list[0][0],0.6);hf_scr(ctx,S,()=>{
  if(u<1&&i>0&&list[i-1][1])hf_tag(ctx,list[i-1][1],a*(1-u));if(list[i][1])hf_tag(ctx,list[i][1],a*u);});}
function hf_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:clamp(o.p,0,1);if(p<=0||(o.a!=null&&o.a<=0.01))return;const sub=s.slice(0,Math.ceil(s.length*p));
  ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.22,1,0,0);
  dq_T(ctx,sub,0,0,{w:o.w||500,size:o.size||32,col:o.col||HF.ink,align:o.align||"left",a:o.a==null?1:o.a,deco:o.deco});ctx.restore();}

/* ---------------------------------------------------------------- an envelope */
function hf_env(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=Math.round(w*0.56),x0=-w/2,y0=-h/2;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  if(o.k!=null){const k=lerp(0.7,1,ag_spr(o.k,0,0.5));ctx.scale(k,k);}if(o.rot)ctx.rotate(o.rot);
  ctx.save();const desk=o.on==="desk";ctx.shadowColor=desk?"rgba(40,26,14,0.42)":"rgba(46,38,28,0.24)";ctx.shadowBlur=desk?16:20;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=desk?7:9;
  ctx.fillStyle=rgba(o.paper||HF.paper,1);ctx.fillRect(x0,y0,w,h);ctx.restore();
  // the paper: a little warmer at the left, a soft light from the right, the flap's fold seen faintly through
  let g=ctx.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,"rgba(120,90,50,0.08)");g.addColorStop(1,"rgba(255,250,236,0.12)");ctx.fillStyle=g;ctx.fillRect(x0,y0,w,h);
  ctx.strokeStyle="rgba(120,96,64,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0+6,y0+6);ctx.lineTo(0,y0+h*0.48);ctx.lineTo(x0+w-6,y0+6);ctx.stroke();
  ctx.strokeStyle="rgba(120,96,64,0.18)";ctx.lineWidth=1;ctx.strokeRect(x0+0.5,y0+0.5,w-1,h-1);
  // the stamp: a small engraved rectangle in a muted plum, perforated, and a cancelling mark over it
  if(o.stamp!==false){const sw=w*0.11,sh=sw*1.2,sx=x0+w-sw-w*0.05,sy=y0+h*0.08;ctx.fillStyle="rgba(250,246,236,1)";ctx.fillRect(sx-3,sy-3,sw+6,sh+6);
    ctx.fillStyle=rgba(o.stampCol||[110,84,96],0.9);ctx.fillRect(sx,sy,sw,sh);ctx.fillStyle="rgba(250,246,236,0.5)";ctx.beginPath();ctx.ellipse(sx+sw/2,sy+sh*0.46,sw*0.28,sh*0.3,0,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(60,52,60,0.5)";ctx.lineWidth=1.6;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(sx-sw*0.9,sy+sh*(0.3+k*0.2));ctx.bezierCurveTo(sx-sw*0.4,sy+sh*(0.2+k*0.2),sx+sw*0.2,sy+sh*(0.4+k*0.2),sx+sw*0.8,sy+sh*(0.3+k*0.2));ctx.stroke();}
    if(o.mark!==false){ctx.beginPath();ctx.arc(sx-sw*1.25,sy+sh*0.5,sw*0.52,0,TAU);ctx.stroke();}}
  // the address, in the sender's hand
  const L=x0+w*0.3;let yy=o.top!=null?y0+o.top:y0+h*0.5;for(const [s,lo] of lines){const q=lo||{};hf_hand(ctx,s,L+(q.dx||0),yy,{size:q.size||o.size||32,p:q.p,col:q.col,a:q.a,deco:o.deco});yy+=(q.size||o.size||32)*1.35;}
  // the code, after the last line of the address, in the sender's hand (o.codeX moves it; by default it starts a little after the line)
  if(o.code){const sz=o.size||32,ln=lines[lines.length-1],lsz=(ln&&ln[1]&&ln[1].size)||sz,cx=o.codeX!=null?o.codeX:(ln?dq_tw(ctx,ln[0],{w:500,size:lsz}):0)+sz*0.8;
    hf_hand(ctx,o.code[0],L+cx,yy-sz*1.35+(o.codeDy||0),{size:sz,p:o.code[1],col:o.codeCol||HF.ink,w:600,deco:o.deco});}
  // a pencilled line across it, in the clerk's hand
  if(o.note){hf_hand(ctx,o.note,x0+w*0.08,y0+h*0.24,{size:o.noteSize||28,p:o.noteP,col:HF.pencil,a:o.noteA,deco:o.deco});}
  ctx.restore();}

/* ---------------------------------------------------------------- people far off, and the wagon */
function hf_walker(ctx,x,y,s,o){o=o||{};const t=o.t||0,ph=o.ph||0,walk=o.walk==null?1:o.walk,sw=Math.sin(t*4.6+ph)*6*walk,bob=Math.abs(Math.cos(t*4.6+ph))*1.6*walk,
    col=o.col||HF_CLOTH[0],skin=o.skin||HF_SKIN[0],woman=o.kind==="woman",a=o.a==null?1:o.a;if(a<=0.01)return;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ag_floorShadow(ctx,-10,1,30,5,0.22);ctx.translate(0,-bob);
  const lit=hf_sh(col,1.25);
  if(woman){// a long skirt to the ground, swaying a little with the step; a fitted jacket; a hat with a brim
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(-9,-62);ctx.bezierCurveTo(-14,-40,-18-sw*0.3,-14,-19-sw*0.4,0);ctx.lineTo(19-sw*0.4,0);ctx.bezierCurveTo(18-sw*0.3,-14,14,-40,9,-62);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(lit,0.5);ctx.beginPath();ctx.moveTo(4,-60);ctx.bezierCurveTo(9,-40,12,-16,14,0);ctx.lineTo(19-sw*0.4,0);ctx.bezierCurveTo(18,-14,14,-40,9,-62);ctx.closePath();ctx.fill();
    const jk=o.jacket||hf_sh(col,0.85);ctx.fillStyle=rgba(jk,1);ctx.beginPath();ctx.moveTo(-11,-96);ctx.quadraticCurveTo(-14,-80,-9,-60);ctx.lineTo(9,-60);ctx.quadraticCurveTo(14,-80,11,-96);ctx.quadraticCurveTo(0,-101,-11,-96);ctx.fill();
    ctx.strokeStyle=rgba(hf_sh(jk,0.85),1);ctx.lineCap="round";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-10,-93);ctx.lineTo(-11-sw*0.4,-66);ctx.moveTo(10,-93);ctx.lineTo(11+sw*0.4,-66);ctx.stroke();
    ctx.fillStyle=rgba(skin,1);ctx.fillRect(-2.5,-106,5,8);ctx.beginPath();ctx.ellipse(0,-113,7.5,9,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(o.hair||[54,40,32],1);ctx.beginPath();ctx.ellipse(-2,-117,8,6,0,Math.PI,TAU);ctx.fill();
    const ht=o.hat||[70,58,52];ctx.fillStyle=rgba(ht,1);ctx.beginPath();ctx.ellipse(0,-121,15,3.2,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(1,-125,8,5,0,Math.PI,TAU);ctx.fill();}
  else{// trousers and a coat to the knee, a bowler hat
    ctx.strokeStyle=rgba(hf_sh(col,0.8),1);ctx.lineCap="round";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-3,-46);ctx.lineTo(-3+sw,-2);ctx.moveTo(4,-46);ctx.lineTo(4-sw,-2);ctx.stroke();
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(-12,-98);ctx.quadraticCurveTo(-15,-70,-13,-40);ctx.lineTo(13,-40);ctx.quadraticCurveTo(15,-70,12,-98);ctx.quadraticCurveTo(0,-103,-12,-98);ctx.fill();
    ctx.fillStyle=rgba(lit,0.45);ctx.fillRect(5,-96,7,54);
    ctx.strokeStyle=rgba(hf_sh(col,0.86),1);ctx.lineWidth=6.5;ctx.beginPath();ctx.moveTo(-11,-95);ctx.lineTo(-12-sw*0.5,-60);ctx.moveTo(11,-95);ctx.lineTo(12+sw*0.5,-60);ctx.stroke();
    ctx.fillStyle=rgba(skin,1);ctx.fillRect(-2.5,-107,5,8);ctx.beginPath();ctx.ellipse(0,-114,7.5,9,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba([34,32,34],1);ctx.beginPath();ctx.ellipse(0,-120,12,2.6,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(0,-123,7.5,6,0,Math.PI,TAU);ctx.fill();}
  ctx.restore();}
// a horse at a walk and a closed box wagon behind it, facing left; (x, y) where the wagon's back wheel meets the street. The horse's
// four legs swing in the walk's order; the wheels turn with the distance covered
function hf_wagon(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const ph=t*3.0,coat=[110,74,50],coatD=[70,46,32],mane=[44,32,26],body=[56,50,48],bodyL=[96,86,78],wheel=[70,58,48];
  ag_floorShadow(ctx,-250,4,380,16,0.34);
  // a leg from its top (hx, hy) to the ground, bending at the knee or hock as it swings; far legs darker
  const leg=(hx,hy,sw,hind,col)=>{const u=Math.sin(sw),lift=Math.max(0,Math.cos(sw))*0.0+Math.max(0,-Math.sin(sw+0.6))*14,kx=hx+u*10+(hind?8:0),ky=hy+(-hy)*0.46,fx=hx+u*26,fy=-lift;
    ag_taper(ctx,[hx,hy],[hx+(kx-hx)*0.3,hy+20],[kx,ky-16],[kx,ky],22,13,rgba(col,1));ag_taper(ctx,[kx,ky],[kx,ky+18],[fx,fy-24],[fx,fy-8],12,9,rgba(col,1));
    ctx.fillStyle=rgba([34,28,26],1);ctx.beginPath();ctx.moveTo(fx-7,fy-10);ctx.lineTo(fx+7,fy-10);ctx.lineTo(fx+8,fy);ctx.lineTo(fx-9,fy);ctx.closePath();ctx.fill();};
  const HX=-560;   // the horse's withers are at (HX, -152)
  ctx.save();ctx.translate(HX,0);
  leg(-14,-114,ph+Math.PI,false,coatD);leg(118,-118,ph+Math.PI*0.5,true,coatD);
  // the body in one outline: the crest of the neck, the back, the croup, the quarters, the belly, the chest, the throat and the head
  ctx.save();ctx.translate(0,-18);
  const horse=c=>{c.moveTo(-66,-224);c.bezierCurveTo(-46,-224,-16,-190,0,-154);c.bezierCurveTo(40,-142,100,-146,136,-152);c.bezierCurveTo(154,-150,164,-134,160,-112);
    c.bezierCurveTo(156,-96,146,-86,136,-84);c.bezierCurveTo(100,-78,30,-78,-4,-84);c.bezierCurveTo(-22,-86,-34,-96,-36,-112);
    c.bezierCurveTo(-42,-134,-58,-152,-76,-164);c.bezierCurveTo(-90,-162,-106,-156,-116,-154);c.bezierCurveTo(-126,-154,-128,-164,-124,-172);
    c.bezierCurveTo(-114,-188,-98,-208,-84,-218);c.bezierCurveTo(-76,-223,-70,-225,-66,-224);c.closePath();};
  ag_soft(ctx,horse,coat,hf_sh(coat,1.32),40,-150,150,"rgba(30,18,10,0.42)",14,0.4);
  // the mane along the crest, the ears, an eye, the nostril; the harness: collar, a strap along the body, the bridle
  ctx.fillStyle=rgba(mane,1);ctx.beginPath();ctx.moveTo(-68,-228);ctx.bezierCurveTo(-46,-230,-16,-190,-2,-158);ctx.lineTo(-10,-156);ctx.bezierCurveTo(-24,-188,-48,-216,-70,-220);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-72,-222);ctx.lineTo(-68,-242);ctx.lineTo(-61,-222);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(20,14,12,0.85)";ctx.beginPath();ctx.ellipse(-92,-198,3.2,2.4,0.3,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(-118,-164,2.6,2,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([38,30,28],1);ctx.lineCap="round";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-30,-160);ctx.bezierCurveTo(-44,-140,-46,-118,-40,-100);ctx.stroke();
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-36,-128);ctx.lineTo(150,-126);ctx.moveTo(30,-150);ctx.lineTo(28,-84);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-70,-218);ctx.lineTo(-112,-166);ctx.moveTo(-86,-204);ctx.lineTo(-118,-190);ctx.moveTo(-114,-166);ctx.lineTo(-80,-162);ctx.stroke();
  // the tail
  ctx.fillStyle=rgba(mane,1);ctx.beginPath();ctx.moveTo(156,-140);ctx.bezierCurveTo(176,-120,180,-80,172,-44);ctx.lineTo(160,-46);ctx.bezierCurveTo(164,-80,160,-110,148,-130);ctx.closePath();ctx.fill();
  ctx.restore();
  // the near legs over the body
  leg(-2,-114,ph,false,hf_sh(coat,0.86));leg(130,-118,ph+Math.PI*1.5,true,hf_sh(coat,0.86));
  // the reins, from the bit back to the driver's hands
  ctx.strokeStyle=rgba([40,32,30],1);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-110,-186);ctx.bezierCurveTo(40,-220,200,-230,330,-236);ctx.stroke();
  ctx.restore();
  // the shafts, from the wagon's front to the horse's collar
  ctx.strokeStyle=rgba([74,60,48],1);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-250,-96);ctx.lineTo(HX-36,-128);ctx.stroke();
  // the wagon: a closed box on its springs, a driver's seat at the front, its wheels
  const spokes=(cx,cy,r,rot,col)=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.arc(cx,cy,r-8,0,TAU,true);ctx.fill();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4.5;for(let k=0;k<12;k++){const an=rot+k*TAU/12;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(an)*(r-6),cy+Math.sin(an)*(r-6));ctx.stroke();}
    ctx.fillStyle=rgba(hf_sh(col,0.8),1);ctx.beginPath();ctx.arc(cx,cy,9,0,TAU);ctx.fill();};
  spokes(-30,-62,62,-t*1.8,hf_sh(wheel,0.62));spokes(-250,-48,48,-t*2.3,hf_sh(wheel,0.62));
  const box=c=>{c.moveTo(-290,-250);c.lineTo(40,-254);c.lineTo(44,-96);c.lineTo(-290,-92);c.closePath();};
  ag_soft(ctx,box,body,bodyL,20,-230,220,"rgba(10,8,8,0.5)",16,0.32);
  ctx.strokeStyle="rgba(210,198,176,0.2)";ctx.lineWidth=2;ctx.strokeRect(-272,-234,296,122);ctx.beginPath();ctx.moveTo(-124,-234);ctx.lineTo(-124,-112);ctx.stroke();
  ctx.fillStyle=rgba(hf_sh(body,0.72),1);ctx.fillRect(-298,-262,348,12);ctx.fillRect(-294,-100,342,10);
  ctx.strokeStyle=rgba([40,36,34],1);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-270,-90);ctx.quadraticCurveTo(-250,-74,-230,-90);ctx.moveTo(-50,-90);ctx.quadraticCurveTo(-30,-74,-10,-90);ctx.stroke();
  // the driver on the box seat, in a dark coat and a hat, the reins in his hands
  ctx.fillStyle=rgba([58,50,44],1);ctx.fillRect(-330,-196,62,10);ctx.fillRect(-334,-196,8,44);
  ctx.fillStyle=rgba([40,38,42],1);ctx.beginPath();ctx.moveTo(-326,-196);ctx.quadraticCurveTo(-334,-236,-320,-262);ctx.lineTo(-292,-262);ctx.quadraticCurveTo(-284,-232,-288,-196);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([206,166,132],1);ctx.beginPath();ctx.ellipse(-306,-276,10,12,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([30,28,30],1);ctx.beginPath();ctx.ellipse(-306,-286,16,3.4,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(-306,-290,9.5,7,0,Math.PI,TAU);ctx.fill();
  spokes(-30,-62,62,-t*1.8,wheel);spokes(-250,-48,48,-t*2.3,wheel);
  ctx.restore();}
// a wicker basket full of letters, (x, y) the middle of its base
function hf_basket(ctx,x,y,s,seed,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const R=ag_rnd(seed||3);ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_floorShadow(ctx,-16,4,150,20,0.32);
  // the letters, heaped above the rim
  for(let i=0;i<26;i++){const ex=-104+R()*208,ey=-118-R()*36+Math.abs(ex)*0.18,ew=54+R()*22,eh=ew*0.56;ctx.save();ctx.translate(ex,ey);ctx.rotate((R()-0.5)*0.9);
    ctx.fillStyle=rgba(mix(HF.paper,[208,192,160],R()*0.6),1);ctx.fillRect(-ew/2,-eh/2,ew,eh);ctx.strokeStyle="rgba(110,90,60,0.25)";ctx.lineWidth=1.2;ctx.strokeRect(-ew/2,-eh/2,ew,eh);
    ctx.strokeStyle="rgba(60,48,40,0.35)";ctx.beginPath();ctx.moveTo(-ew*0.1,0);ctx.lineTo(ew*0.32,0);ctx.moveTo(-ew*0.1,eh*0.2);ctx.lineTo(ew*0.24,eh*0.2);ctx.stroke();ctx.restore();}
  const wick=[176,140,96],bk=c=>{c.moveTo(-120,-120);c.lineTo(120,-120);c.lineTo(104,0);c.lineTo(-104,0);c.closePath();};
  ag_soft(ctx,bk,wick,hf_sh(wick,1.2),90,-80,160,"rgba(60,40,20,0.45)",14,0.5);
  ctx.save();ag_shape(ctx,bk);ctx.clip();ctx.strokeStyle="rgba(96,70,42,0.45)";ctx.lineWidth=2;for(let yy=-112;yy<0;yy+=10){ctx.beginPath();for(let xx=-124;xx<124;xx+=12){ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+6,yy+(xx/12%2?4:-4),xx+12,yy);}ctx.stroke();}
  for(let xx=-110;xx<=110;xx+=22){ctx.beginPath();ctx.moveTo(xx,-120);ctx.lineTo(xx*0.86,0);ctx.stroke();}ctx.restore();
  ctx.fillStyle=rgba(hf_sh(wick,0.8),1);ctx.fillRect(-124,-126,248,12);ctx.restore();}
// a canvas sack, tied at the neck, (x, y) the middle of its base
function hf_sack(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-14,4,110,16,0.32);
  const cv=[196,182,152],sk=c=>{c.moveTo(-26,-196);c.bezierCurveTo(-60,-170,-104,-120,-100,-50);c.bezierCurveTo(-98,-10,-60,2,0,2);c.bezierCurveTo(60,2,98,-10,100,-50);c.bezierCurveTo(104,-120,60,-170,26,-196);c.closePath();};
  ag_soft(ctx,sk,cv,hf_sh(cv,1.12),60,-110,140,"rgba(70,56,36,0.45)",18,0.5);
  ctx.strokeStyle="rgba(110,92,64,0.35)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-30,-170);ctx.quadraticCurveTo(-40,-110,-20,-40);ctx.moveTo(30,-168);ctx.quadraticCurveTo(46,-100,30,-30);ctx.stroke();
  ctx.fillStyle=rgba(hf_sh(cv,0.95),1);ctx.beginPath();ctx.moveTo(-24,-196);ctx.lineTo(-36,-226);ctx.lineTo(36,-226);ctx.lineTo(24,-196);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba([96,76,52],1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-26,-198);ctx.lineTo(26,-198);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the street, Washington, 1899
   A broad street in morning light before a long classical front of pale stone, drawn anew: a rusticated ground floor with arched
   windows, two storeys of tall windows between pilasters, a cornice and a balustrade; the sun from the right. The window the camera
   glides into is HF_WIN. */
const HF_WIN=[1110,436];
function hf_paintStreet(c){
  // the sky, pale and hazy
  let g=c.createLinearGradient(0,0,0,760);g.addColorStop(0,rgba(HF.sky0,1));g.addColorStop(1,rgba(HF.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,760);
  let r=c.createRadialGradient(1900,80,10,1900,80,900);r.addColorStop(0,"rgba(255,246,226,0.55)");r.addColorStop(1,"rgba(255,246,226,0)");c.fillStyle=r;c.fillRect(0,0,W,760);
  // far buildings at the left, low and hazy
  c.fillStyle=rgba(mix(HF.sky1,[176,166,150],0.55),1);c.fillRect(0,380,200,360);c.fillRect(40,330,120,60);
  c.fillStyle=rgba(mix(HF.sky1,[176,166,150],0.35),1);for(let k=0;k<4;k++)c.fillRect(20+k*44,420,22,52),c.fillRect(20+k*44,520,22,52);
  // the long front: its stone, then bays of pilasters and windows
  const X0=180,TOP=176,BASE=724,GF=556,bay=168,st=HF.stone,sh=HF.stoneSh;
  c.fillStyle=rgba(st,1);c.fillRect(X0,TOP,W-X0,BASE-TOP);
  g=c.createLinearGradient(X0,0,W,0);g.addColorStop(0,"rgba(60,48,36,0.14)");g.addColorStop(1,"rgba(255,248,232,0.12)");c.fillStyle=g;c.fillRect(X0,TOP,W-X0,BASE-TOP);
  // the ground floor's rusticated courses
  c.strokeStyle=rgba(hf_sh(st,0.82),0.8);c.lineWidth=2;for(let y=GF+28;y<BASE;y+=28){c.beginPath();c.moveTo(X0,y);c.lineTo(W,y);c.stroke();}
  c.fillStyle=rgba(hf_sh(st,0.9),1);c.fillRect(X0,GF-14,W-X0,16);c.fillStyle=rgba(hf_sh(st,1.06),1);c.fillRect(X0,GF-18,W-X0,5);
  // the upper storeys' courses, faint
  c.strokeStyle=rgba(hf_sh(st,0.9),0.35);c.lineWidth=1.4;for(let y=TOP+64;y<GF-20;y+=46){c.beginPath();c.moveTo(X0,y);c.lineTo(W,y);c.stroke();}
  for(let x=X0+bay/2;x<W+bay;x+=bay){
    // pilasters between the bays: lit on the right, a soft shadow to their left
    const px=x-bay/2;if(px>X0+4){c.fillStyle=rgba(hf_sh(st,0.86),0.6);c.fillRect(px-26,TOP+40,8,GF-TOP-58);c.fillStyle=rgba(hf_sh(st,1.04),1);c.fillRect(px-18,TOP+40,36,GF-TOP-58);
      c.fillStyle="rgba(255,248,234,0.35)";c.fillRect(px+12,TOP+40,6,GF-TOP-58);c.fillStyle=rgba(hf_sh(st,0.94),1);c.fillRect(px-22,TOP+30,44,12);c.fillRect(px-22,GF-24,44,8);}
    // the tall windows of the first floor, with a cap, and the smaller windows above
    const win=(wx,wy,ww,wh,arch)=>{c.fillStyle=rgba(hf_sh(st,0.8),1);c.beginPath();if(arch){c.moveTo(wx-ww/2-6,wy+wh);c.lineTo(wx-ww/2-6,wy+ww/2);c.arc(wx,wy+ww/2,ww/2+6,Math.PI,0);c.lineTo(wx+ww/2+6,wy+wh);}else c.rect(wx-ww/2-6,wy-6,ww+12,wh+12);c.fill();
      const gl=c.createLinearGradient(0,wy,0,wy+wh);gl.addColorStop(0,"rgb(92,96,100)");gl.addColorStop(1,"rgb(60,62,66)");c.fillStyle=gl;c.beginPath();
      if(arch){c.moveTo(wx-ww/2,wy+wh);c.lineTo(wx-ww/2,wy+ww/2);c.arc(wx,wy+ww/2,ww/2,Math.PI,0);c.lineTo(wx+ww/2,wy+wh);}else c.rect(wx-ww/2,wy,ww,wh);c.fill();
      // the sky's reflection in the upper panes, the glazing bars, and the jamb's shadow on the right
      c.fillStyle="rgba(214,222,226,0.28)";c.fillRect(wx-ww/2,wy+(arch?ww/2:0),ww,wh*0.32);
      c.strokeStyle=rgba(hf_sh(st,0.98),1);c.lineWidth=3.5;c.beginPath();c.moveTo(wx,wy+(arch?2:0));c.lineTo(wx,wy+wh);c.moveTo(wx-ww/2,wy+wh*0.5);c.lineTo(wx+ww/2,wy+wh*0.5);c.stroke();
      c.fillStyle="rgba(30,24,20,0.3)";c.fillRect(wx+ww/2-9,wy+(arch?ww/2:0),9,wh-(arch?ww/2:0));
      c.fillStyle=rgba(hf_sh(st,1.08),1);c.fillRect(wx-ww/2-10,wy+wh+6,ww+20,8);};
    win(x,TOP+226,66,150,false);c.fillStyle=rgba(hf_sh(st,0.95),1);c.beginPath();c.moveTo(x-50,TOP+214);c.lineTo(x,TOP+186);c.lineTo(x+50,TOP+214);c.closePath();c.fill();
    c.fillStyle="rgba(255,248,234,0.4)";c.beginPath();c.moveTo(x,TOP+186);c.lineTo(x+50,TOP+214);c.lineTo(x+40,TOP+214);c.lineTo(x,TOP+192);c.closePath();c.fill();
    win(x,TOP+86,58,86,false);win(x,GF+30,74,138,true);}
  // the cornice and the balustrade, with the shadow they cast on the wall below
  c.fillStyle=rgba(hf_sh(st,0.96),1);c.fillRect(X0-10,TOP-10,W-X0+10,26);c.fillStyle=rgba(hf_sh(st,1.08),1);c.fillRect(X0-14,TOP-14,W-X0+14,6);
  g=c.createLinearGradient(0,TOP+16,0,TOP+44);g.addColorStop(0,"rgba(50,40,30,0.32)");g.addColorStop(1,"rgba(50,40,30,0)");c.fillStyle=g;c.fillRect(X0,TOP+16,W-X0,28);
  c.fillStyle=rgba(hf_sh(st,0.98),1);c.fillRect(X0,TOP-62,W-X0,10);c.fillRect(X0,TOP-18,W-X0,8);
  for(let x=X0+10;x<W;x+=22){c.fillStyle=rgba(hf_sh(st,0.98),1);c.beginPath();c.ellipse(x,TOP-32,6,12,0,0,TAU);c.fill();c.fillStyle="rgba(50,40,30,0.14)";c.fillRect(x-7,TOP-40,3,16);}
  // the building's left end, in shadow, and its corner
  c.fillStyle=rgba(hf_sh(st,0.72),1);c.fillRect(X0-34,TOP-62,34,BASE-TOP+62);
  // the pavement, the kerb and the street, worn by wheels
  c.fillStyle=rgba([200,188,168],1);c.fillRect(0,BASE,W,54);c.strokeStyle="rgba(120,104,84,0.3)";c.lineWidth=1.5;for(let x=0;x<W;x+=96){c.beginPath();c.moveTo(x,BASE);c.lineTo(x-12,BASE+54);c.stroke();}
  c.fillStyle=rgba([170,156,136],1);c.fillRect(0,BASE+54,W,10);
  g=c.createLinearGradient(0,BASE+64,0,H);g.addColorStop(0,rgba(hf_sh(HF.road,1.05),1));g.addColorStop(1,rgba(hf_sh(HF.road,0.82),1));c.fillStyle=g;c.fillRect(0,BASE+64,W,H-BASE-64);
  const R=ag_rnd(17);c.strokeStyle="rgba(90,76,60,0.16)";c.lineWidth=3;for(let k=0;k<7;k++){const y=BASE+120+k*44+R()*20;c.beginPath();c.moveTo(0,y);for(let x=0;x<=W;x+=160)c.lineTo(x,y+Math.sin(x*0.004+k)*6);c.stroke();}
  for(let i=0;i<400;i++){c.fillStyle="rgba("+(R()<0.5?"80,66,50":"220,206,186")+","+(0.06+R()*0.08)+")";c.fillRect(R()*W,BASE+70+R()*(H-BASE-70),2+R()*3,2);}
  // the building's shadow on the pavement, and the morning haze
  c.fillStyle="rgba(60,48,36,0.12)";c.fillRect(0,BASE,W,14);
  r=c.createLinearGradient(0,0,0,H);r.addColorStop(0,"rgba(255,246,228,0.05)");r.addColorStop(1,"rgba(255,246,228,0)");c.fillStyle=r;c.fillRect(0,0,W,H);
  // two iron lamp posts
  for(const lx of [430,1500]){c.fillStyle=rgba(HF.iron,1);c.fillRect(lx-5,BASE-210,10,214);c.fillRect(lx-12,BASE-14,24,16);
    c.beginPath();c.moveTo(lx-20,BASE-226);c.lineTo(lx+20,BASE-226);c.lineTo(lx+14,BASE-268);c.lineTo(lx-14,BASE-268);c.closePath();c.fill();
    c.fillStyle="rgba(232,226,210,0.8)";c.fillRect(lx-12,BASE-262,24,32);c.fillStyle=rgba(HF.iron,1);c.fillRect(lx-2,BASE-262,4,32);c.beginPath();c.moveTo(lx-18,BASE-268);c.lineTo(lx,BASE-284);c.lineTo(lx+18,BASE-268);c.closePath();c.fill();
    c.fillStyle="rgba(255,250,236,0.35)";c.fillRect(lx+2,BASE-200,3,190);}}
AG_PLACES.hfStreet=c=>hf_paintStreet(c);
// what moves in the street: the wagon from the right, people on the pavement
function hf_streetLife(ctx,t,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  const walkers=[[300,{kind:"woman",col:HF_CLOTH[1],jacket:[78,62,58],hat:[64,52,50]},1,0.9,0.0],[620,{kind:"man",col:HF_CLOTH[5]},-1,0.92,1.3],[1060,{kind:"woman",col:HF_CLOTH[3],jacket:[52,52,60],hat:[92,76,66],skin:HF_SKIN[1]},-1,0.9,2.1],
    [1360,{kind:"man",col:HF_CLOTH[2],skin:HF_SKIN[4]},1,0.94,0.7],[1720,{kind:"woman",col:HF_CLOTH[0],jacket:[60,52,56],hat:[70,60,56],skin:HF_SKIN[2]},-1,0.9,1.7]];
  for(const [x0,o,dir,s,ph] of walkers)hf_walker(ctx,x0+dir*t*14,760,s,Object.assign({t,ph,flip:dir<0},o));
  hf_wagon(ctx,2500-t*82,940,0.8,t);ctx.restore();}

/* ---------------------------------------------------------------- the reading room, 1899
   A long room: oak pigeonhole cases along the back wall, the wall above in cream plaster, tall windows in the right wall with the
   morning coming through them in long soft beams across the floor, and two long oak tables. The clerks are drawn live, behind the
   tables and cut at their back edges (HF_ROOM.far and .near); the tables themselves are painted here. */
const HF_ROOM={floor:640,far:{top:566,face:596,y:528,s:0.44},near:{top:770,face:808,y:700,s:0.62},win:[1560,1920],desk:{x:1530,top:742,y:640,s:0.7}};
function hf_pigeon(c,x,y,w,h,cols,rows,seed,o){o=o||{};const R=ag_rnd(seed||7),cw=(w-24)/cols,ch=(h-34)/rows;
  ag_soft(c,cc=>cc.rect(x,y,w,h),HF.oak,HF.oakL,x+w*0.8,y+h*0.3,w*0.8,"rgba(40,24,10,0.4)",12,0.35);
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const hx=x+12+i*cw,hy=y+22+j*ch;c.fillStyle=rgba([48,32,22],1);c.fillRect(hx+3,hy+3,cw-6,ch-6);
    // a letter or a bundle sticking out of some holes, pale, lit from the right
    if(R()<(o.fill==null?0.62:o.fill)){const n=1+Math.floor(R()*3);for(let k=0;k<n;k++){const lw=(cw-12)*(0.6+R()*0.35),lh=ch*(0.25+R()*0.2);c.fillStyle=rgba(mix(HF.paper,[200,184,152],R()*0.6),0.95);
      c.fillRect(hx+6+R()*(cw-12-lw),hy+ch-6-lh-k*3,lw,lh);}}
    c.fillStyle="rgba(20,12,6,0.35)";c.fillRect(hx+3,hy+3,cw-6,5);}
  c.fillStyle=rgba(HF.oakD,1);c.fillRect(x-6,y-14,w+12,16);c.fillStyle=rgba(HF.oakL,0.6);c.fillRect(x-6,y-14,w+12,3);c.fillStyle=rgba(HF.oakD,1);c.fillRect(x-4,y+h,w+8,12);}
function hf_table(c,x0,x1,top,face,legY,o){o=o||{};const oak=HF.oak;
  // the legs, then the top, its front edge, and the light lying along it from the right
  c.fillStyle=rgba(hf_sh(oak,0.55),1);for(const lx of [x0+30,x1-46,(x0+x1)/2-8])c.fillRect(lx,face,16,legY-face);
  ag_floorShadow(c,(x0+x1)/2-30,legY+2,(x1-x0)*0.55,18,0.3);
  const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(hf_sh(oak,0.86),1));g.addColorStop(1,rgba(hf_sh(oak,1.18),1));c.fillStyle=g;c.fillRect(x0,top,x1-x0,face-top);
  c.fillStyle=rgba(hf_sh(oak,0.62),1);c.fillRect(x0,face,x1-x0,o.edge||22);c.fillStyle="rgba(255,236,200,0.18)";c.fillRect(x0,top,x1-x0,3);
  c.strokeStyle="rgba(80,50,26,0.18)";c.lineWidth=1.4;for(let y=top+8;y<face-2;y+=7){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y+1);c.stroke();}}
function hf_paintRoom(c){const F=HF_ROOM.floor,VP=[780,380];
  // the back wall: plaster above, a dado of oak below, the cornice at the top
  let g=c.createLinearGradient(0,0,0,F);g.addColorStop(0,rgba(hf_sh(HF.plaster,0.9),1));g.addColorStop(1,rgba(HF.plaster,1));c.fillStyle=g;c.fillRect(0,0,W,F);
  c.fillStyle=rgba(hf_sh(HF.plaster,0.84),1);c.fillRect(0,0,W,46);c.fillStyle=rgba(hf_sh(HF.plaster,1.04),1);c.fillRect(0,46,W,8);c.fillStyle="rgba(60,44,30,0.12)";c.fillRect(0,54,W,10);
  // the pigeonhole cases along the back wall
  hf_pigeon(c,40,250,440,380,9,8,11);hf_pigeon(c,520,250,440,380,9,8,12);hf_pigeon(c,1000,250,440,380,9,8,13);
  c.fillStyle=rgba(HF.oakD,1);c.fillRect(0,F-12,W,12);
  // the floor: boards running back to the vanishing point
  g=c.createLinearGradient(0,F,0,H);g.addColorStop(0,rgba([150,112,78],1));g.addColorStop(1,rgba([120,86,56],1));c.fillStyle=g;c.fillRect(0,F,W,H-F);
  c.strokeStyle="rgba(70,44,24,0.28)";c.lineWidth=2;for(let k=-30;k<=60;k++){const xb=VP[0]+k*90;c.beginPath();c.moveTo(VP[0]+(xb-VP[0])*((F-VP[1])/(H-VP[1])),F);c.lineTo(xb,H);c.stroke();}
  // the right wall, receding, with two tall windows; the light from them across the floor and the back wall
  const RW=x=>[VP[1]+(-VP[1]+60)*((x-VP[0])/(1480-VP[0])),VP[1]+(F-VP[1])*((x-VP[0])/(1480-VP[0]))];
  c.fillStyle=rgba(hf_sh(HF.plaster,0.95),1);c.beginPath();c.moveTo(1480,0);c.lineTo(W,0);c.lineTo(W,RW(W)[1]);c.lineTo(1480,F);c.closePath();c.fill();
  c.fillStyle=rgba(hf_sh(HF.plaster,0.82),1);c.fillRect(1476,0,8,F);
  const win=(xa,xb)=>{const ta=RW(xa)[0]+70,ba=RW(xa)[1]-80,tb=RW(xb)[0]+70,bb=RW(xb)[1]-80;c.fillStyle="rgba(250,246,234,1)";c.beginPath();c.moveTo(xa,ta);c.lineTo(xb,tb);c.lineTo(xb,bb);c.lineTo(xa,ba);c.closePath();c.fill();
    c.strokeStyle=rgba(hf_sh(HF.plaster,0.7),1);c.lineWidth=6;c.stroke();c.lineWidth=3;c.strokeStyle=rgba([196,186,168],1);
    for(const u of [0.33,0.66]){c.beginPath();c.moveTo(lerp(xa,xb,u),lerp(ta,tb,u));c.lineTo(lerp(xa,xb,u),lerp(ba,bb,u));c.stroke();}
    for(const v of [0.25,0.5,0.75]){c.beginPath();c.moveTo(xa,lerp(ta,ba,v));c.lineTo(xb,lerp(tb,bb,v));c.stroke();}};
  win(1530,1640);win(1720,1880);
  c.save();c.globalCompositeOperation="lighter";
  for(const [xa,xb] of [[1530,1640],[1720,1880]]){const gb=c.createLinearGradient(xa,0,xa-900,0);gb.addColorStop(0,"rgba(255,236,196,0.16)");gb.addColorStop(1,"rgba(255,236,196,0)");c.fillStyle=gb;
    c.beginPath();c.moveTo(xa,RW(xa)[1]-80);c.lineTo(xb,RW(xb)[1]-80);c.lineTo(xb-640,H);c.lineTo(xa-980,H);c.closePath();c.fill();}
  c.restore();
  // the far table and the near table (the people behind them are drawn live, cut at their back edges); the desk by the window
  const N=HF_ROOM.near,Fa=HF_ROOM.far,D=HF_ROOM.desk;hf_table(c,90,1420,Fa.top,Fa.face,690,{edge:16});hf_table(c,40,1340,N.top,N.face,940);hf_table(c,1420,1820,D.top,D.top+36,930);
  // letters lying on the tables, a few at each place
  const R=ag_rnd(31),lay=(x,y0,y1,s)=>{for(let k=0;k<5;k++){const lw=(48+R()*14)*s,lh=lw*0.5,lx=x+(R()-0.5)*150*s,ly=lerp(y0,y1,R());c.save();c.translate(lx,ly);c.transform(1,0,-0.6,0.42,0,0);c.rotate((R()-0.5)*0.6);
    c.fillStyle="rgba(40,24,10,0.25)";c.fillRect(-lw/2-3,-lh/2+4,lw,lh);c.fillStyle=rgba(mix(HF.paper,[214,198,166],R()*0.5),1);c.fillRect(-lw/2,-lh/2,lw,lh);c.restore();}};
  for(const [who,x,row] of HF_CLERKS){const T_=HF_ROOM[row];lay(x+30,T_.top+6,T_.face-6,row==="far"?0.8:1.1);}lay(1600,D.top+6,D.top+30,1.2);
  // the room's warmth from the window, and a little darker at the left and the bottom
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,26,14,0.18)");g.addColorStop(0.6,"rgba(40,26,14,0)");g.addColorStop(1,"rgba(255,240,210,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,880,0,H);g.addColorStop(0,"rgba(30,20,12,0)");g.addColorStop(1,"rgba(30,20,12,0.22)");c.fillStyle=g;c.fillRect(0,880,W,H-880);}
AG_PLACES.hfRoom=c=>hf_paintRoom(c);

/* ---------------------------------------------------------------- the clerks of 1899
   Women in high-necked blouses (a shirtwaist, its stand collar painted with the head, inside its picture) and their hair pinned up;
   men in suits with a waistcoat. Seen at a distance, heads bent over the letters; arms down, a hand only on a letter (hold). */
// a high stand collar, worn over the whole person (dq_person draws o.over over them,
// cut where the body is): for Collins, who is seen close enough to read them
function hf_collarOver(col,lace){return(c,P)=>{const cc=k=>{k.moveTo(232,520);k.bezierCurveTo(262,536,318,540,354,524);k.lineTo(362,604);k.bezierCurveTo(318,622,256,606,228,566);k.closePath();};
  ag_soft(c,cc,col,ag_lt(col,0.3),340,540,70,rgba(ag_dk(col,0.6),0.35),6);if(lace){c.strokeStyle=rgba(lace,0.9);c.lineWidth=3.4;c.beginPath();c.moveTo(234,522);c.bezierCurveTo(264,538,318,542,354,526);c.stroke();}
  c.strokeStyle=rgba(ag_dk(col,0.35),0.45);c.lineWidth=2;c.beginPath();c.moveTo(306,542);c.lineTo(310,612);c.stroke();
};}
function hf_waistcoat(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();ag_soft(c,k=>{k.moveTo(262,640);k.lineTo(304,760);k.lineTo(344,640);k.lineTo(372,1100);k.lineTo(236,1100);k.closePath();},col,ag_lt(col,0.25),330,760,140,rgba(ag_dk(col,0.6),0.3),8);
  for(const y of [800,860,920,980]){c.fillStyle=rgba(ag_lt(col,0.4),1);c.beginPath();c.arc(306,y,4,0,TAU);c.fill();}c.restore();};}
const HF_P={
  c1:{key:"hf_c1",name:"a clerk",skin:HF_SKIN[0],hair:{style:"bun",c:[86,62,44]},top:{kind:"tunic",c:[236,230,218]},breath:0.3},
  c2:{key:"hf_c2",name:"a clerk",skin:HF_SKIN[1],hair:{style:"bun",c:[40,30,26]},top:{kind:"tunic",c:[64,58,66]},breath:0.27},
  c3:{key:"hf_c3",name:"a clerk",skin:HF_SKIN[3],hair:{style:"bun",c:[150,112,72]},top:{kind:"tunic",c:[226,220,206]},breath:0.32},
  c4:{key:"hf_c4",name:"a clerk",skin:HF_SKIN[4],hair:{style:"bun",c:[30,24,22]},top:{kind:"tunic",c:[96,76,74]},breath:0.29},
  c5:{key:"hf_c5",name:"a clerk",skin:HF_SKIN[2],hair:{style:"bun",c:[44,34,28]},top:{kind:"tunic",c:[232,226,214]},breath:0.31},
  m1:{key:"hf_m1",name:"a clerk",skin:HF_SKIN[0],hair:{style:"side",c:[96,74,56]},beard:[104,82,62],top:{kind:"suit",c:[54,52,58],inner:[236,232,222],tie:[40,38,44],paint:hf_waistcoat([70,64,62])},breath:0.25},
  m2:{key:"hf_m2",name:"a clerk",skin:HF_SKIN[1],hair:{style:"cropped",c:[52,40,34]},top:{kind:"suit",c:[78,68,60],inner:[234,230,220],tie:[44,40,40],paint:hf_waistcoat([60,54,52])},breath:0.27},
  // Patti Lyle Collins, as the film draws her: a woman of the 1890s at her desk, no claim to be a likeness
  collins:{key:"hf_collins",name:"Patti Lyle Collins",skin:[236,204,180],hair:{style:"bun",c:[96,76,62]},top:{kind:"tunic",c:[58,54,62]},over:hf_collarOver([58,54,62],[238,234,226]),breath:0.26}
};
// the clerks at the two tables: [who, x, row, flip, nod, phase]; a held letter for some
const HF_CLERKS=[["c2",250,"far",false,0.3,0.1],["m1",570,"far",true,0.26,0.7],["c3",880,"far",false,0.32,1.3],["c5",1200,"far",true,0.28,2.0],
  ["c1",410,"near",false,0.32,0.4],["c4",760,"near",true,0.3,1.1],["m2",1110,"near",false,0.28,1.7]];
function hf_letterHeld(ctx,h){const [x,y]=h.near;ctx.save();ctx.translate(x+14,y-30);ctx.rotate(-0.25);ctx.fillStyle=rgba(HF.paper,1);ctx.fillRect(-48,-28,96,56);ctx.strokeStyle="rgba(110,90,60,0.4)";ctx.lineWidth=2;ctx.strokeRect(-48,-28,96,56);
  ctx.strokeStyle="rgba(60,48,40,0.5)";ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(30,0);ctx.moveTo(-10,12);ctx.lineTo(22,12);ctx.stroke();ctx.restore();}
// draw fn(ctx) as one picture at opacity a: whole first, into a buffer, then laid over (people who fade never show through themselves)
function hf_group(ctx,a,key,fn){if(a<=0.004)return;if(a>=0.999){fn(ctx);return;}const [bc,bx]=ag_buf(key,ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());fn(bx);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
function hf_clerks(ctx,t,a){hf_group(ctx,a,"hfClerks",x=>{for(const row of ["far","near"])for(const [who,cx,r,flip,nod,ph] of HF_CLERKS){if(r!==row)continue;const R=HF_ROOM[row];
    ag_person(x,HF_P[who],cx,R.y,R.s,{t:t+ph*3,flip,nod:nod+0.03*Math.sin(t*0.6+ph*2),gaze:[flip?-3:3,9],smile:0,cut:R.top+2});}});}

/* ---------------------------------------------------------------- the reading table, close, and the table of 1963
   hfDesk: an oak table's top seen from above, filling the frame, the window's light lying across it from the right; an inkwell and a
   pen at the top right. hfDesk63: a pale ash table of the 1960s, a fountain pen. Envelopes lie on either (hf_env, on: "desk"). */
function hf_paintDesk(c,o){o=o||{};const base=o.base||[146,104,66],R=ag_rnd(o.seed||5);
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(hf_sh(base,0.78),1));g.addColorStop(1,rgba(hf_sh(base,1.08),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the grain: long soft streaks, with a figure here and there
  for(let i=0;i<70;i++){const y=R()*H,th=2+R()*7;c.strokeStyle=rgba(hf_sh(base,R()<0.5?0.78:1.14),0.16+R()*0.14);c.lineWidth=th;c.beginPath();c.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=120)c.lineTo(x,y+Math.sin(x*0.003+i)*8+Math.sin(x*0.011+i*2)*3);c.stroke();}
  for(let i=0;i<6;i++){const cx=R()*W,cy=R()*H;c.strokeStyle=rgba(hf_sh(base,0.8),0.18);c.lineWidth=2;for(let k=1;k<5;k++){c.beginPath();c.ellipse(cx,cy,k*30,k*7,0,0,TAU);c.stroke();}}
  // the boards' joints
  c.strokeStyle=rgba(hf_sh(base,0.55),0.5);c.lineWidth=3;for(const y of (o.joints||[300,720])){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the window's light from the right, warm, and a dim edge at the left
  const r=c.createRadialGradient(1700,380,40,1700,380,1300);r.addColorStop(0,"rgba(255,236,196,"+(o.sun==null?0.3:o.sun)+")");r.addColorStop(1,"rgba(255,236,196,0)");c.fillStyle=r;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,18,8,0.3)");g.addColorStop(0.5,"rgba(30,18,8,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  if(o.ink){// an inkwell of dark glass and a dip pen, at the top right
    ag_floorShadow(c,1690,170,70,22,0.4);ag_soft(c,k=>k.arc(1700,150,46,0,TAU),[44,40,44],[110,104,110],1712,132,40,"rgba(0,0,0,0.5)",10,0.5);
    ag_soft(c,k=>k.arc(1700,150,18,0,TAU),[20,18,22],[60,56,60],1704,146,16,null);
    c.save();c.translate(1560,120);c.rotate(-0.5);ag_floorShadow(c,-6,10,120,6,0.3);c.fillStyle=rgba([60,48,40],1);c.fillRect(-110,-5,170,10);c.fillStyle=rgba([150,140,126],1);c.fillRect(60,-4,34,8);
    c.beginPath();c.moveTo(94,-4);c.lineTo(120,0);c.lineTo(94,4);c.closePath();c.fill();c.restore();}
  if(o.pen){// a fountain pen lying at the top right
    c.save();c.translate(1600,140);c.rotate(-0.35);ag_floorShadow(c,-6,12,150,8,0.32);ag_soft(c,k=>ag_rect(k,-140,-11,230,22,10),[40,40,46],[120,120,130],0,-6,140,null);
    c.fillStyle=rgba([196,192,182],1);c.fillRect(30,-11,10,22);c.beginPath();c.moveTo(90,-8);c.lineTo(130,0);c.lineTo(90,8);c.closePath();c.fill();c.restore();}}
AG_PLACES.hfDesk=c=>hf_paintDesk(c,{ink:true});
AG_PLACES.hfDesk63=c=>hf_paintDesk(c,{base:[206,186,156],seed:9,pen:true,sun:0.22,joints:[]});

/* ---------------------------------------------------------------- 1943: the sorting case with numbered holes
   A wooden case of pigeonholes across the frame, a small paper label with a number under each hole (HF_CASE: where each hole is),
   the light from the right; a young clerk stands at its left, drawn live. */
const HF_CASE={x:520,y:150,cols:8,rows:4,cw:150,ch:150};
function hf_caseHole(n){const C=HF_CASE,i=(n-1)%C.cols,j=Math.floor((n-1)/C.cols);return[C.x+40+i*C.cw+C.cw/2,C.y+40+j*C.ch+C.ch/2];}
function hf_paintCase(c){// the wall behind, plain plaster, and the floor
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([212,204,188],1));g.addColorStop(1,rgba([196,186,168],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba([126,96,70],1);c.fillRect(0,860,W,220);c.fillStyle="rgba(40,26,14,0.3)";c.fillRect(0,860,W,8);
  const C=HF_CASE,w=C.cols*C.cw+80,h=C.rows*C.ch+80;ag_floorShadow(c,C.x+w/2-30,C.y+h+150,w*0.6,26,0.3);
  ag_soft(c,k=>k.rect(C.x,C.y,w,h),HF.oak,HF.oakL,C.x+w*0.85,C.y+h*0.2,w*0.9,"rgba(40,24,10,0.45)",14,0.35);
  c.fillStyle=rgba(HF.oakD,1);c.fillRect(C.x-10,C.y-18,w+20,20);c.fillRect(C.x-6,C.y+h,w+12,16);
  // the legs to the floor
  c.fillStyle=rgba(hf_sh(HF.oak,0.6),1);c.fillRect(C.x+20,C.y+h+16,24,860-C.y-h-16);c.fillRect(C.x+w-44,C.y+h+16,24,860-C.y-h-16);
  for(let n=1;n<=C.cols*C.rows;n++){const [hx,hy]=hf_caseHole(n),x0=hx-C.cw/2+6,y0=hy-C.ch/2+6;c.fillStyle=rgba([46,30,20],1);c.fillRect(x0,y0,C.cw-12,C.ch-48);
    c.fillStyle="rgba(20,12,6,0.4)";c.fillRect(x0,y0,C.cw-12,8);c.fillStyle="rgba(20,12,6,0.25)";c.fillRect(x0+C.cw-24,y0,12,C.ch-48);
    // a few letters already sorted, standing in the hole
    const R=ag_rnd(n*7+3);R();const k=n===16?0:1+Math.floor(R()*2.4);for(let q=0;q<k;q++){const lw=C.cw-40-R()*20;c.fillStyle=rgba(mix(HF.paper,[214,198,166],R()*0.5),1);c.fillRect(x0+10+R()*8,y0+C.ch-48-34-q*6,lw,30);}}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,26,14,0.2)");g.addColorStop(0.55,"rgba(40,26,14,0)");g.addColorStop(1,"rgba(255,240,210,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.hfCase=c=>hf_paintCase(c);
// the holes' number labels, drawn live so they read (dq_T, 30 px), with hole n lit (o.lit, 0 to 1)
function hf_caseLabels(ctx,o){o=o||{};const C=HF_CASE;for(let n=1;n<=C.cols*C.rows;n++){const [hx,hy]=hf_caseHole(n),ly=hy+C.ch/2-24;
  dq_card(ctx,hx-34,ly-22,68,40,{r:4,a:1});if(o.lit&&n===o.n){ctx.save();ctx.globalAlpha*=o.lit;ctx.strokeStyle=rgba(HF.ink,0.9);ctx.lineWidth=3;rr(ctx,hx-38,ly-26,76,48,6);ctx.stroke();ctx.restore();}
  dq_T(ctx,String(n),hx,ly+9,{w:700,size:30,align:"center",col:DQ.ink});}}

/* ---------------------------------------------------------------- 1963: a letter-sorting machine and a case by the first digit
   At the left, a small case of ten holes, one for each first digit; at the right, a plain sorting machine of the time, drawn without a
   maker: a long cabinet in cream enamel and graphite, a stack of letters fed in at its left, a belt along its top, and ten bins along
   its front. HF_MACH: where its belt runs and its bins are. */
const HF_MACH={x:780,y:300,w:1060,belt:420,bins:640,feed:[860,404]};
function hf_paintMachine(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([214,208,196],1));g.addColorStop(1,rgba([198,190,176],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba([150,138,122],1);c.fillRect(0,840,W,240);c.fillStyle="rgba(40,30,20,0.24)";c.fillRect(0,840,W,8);
  const M=HF_MACH,cream=[226,220,204],graph=[70,72,76];ag_floorShadow(c,M.x+M.w/2,846,M.w*0.6,24,0.36);
  // the cabinet, its top deck and the belt housing
  ag_soft(c,k=>k.rect(M.x,M.y+80,M.w,460),cream,[250,246,236],M.x+M.w*0.85,M.y+160,M.w,"rgba(60,50,40,0.35)",18,0.5);
  c.fillStyle=rgba(graph,1);c.fillRect(M.x-10,M.y+64,M.w+20,26);c.fillRect(M.x,M.y+530,M.w,14);c.fillRect(M.x+20,M.y+544,40,842-M.y-544);c.fillRect(M.x+M.w-60,M.y+544,40,842-M.y-544);
  ag_soft(c,k=>k.rect(M.x+20,M.y+90,M.w-40,70),[204,198,184],[236,232,222],M.x+M.w*0.8,M.y+110,400,"rgba(40,36,30,0.3)",8,0.4);
  c.fillStyle=rgba([54,54,58],1);c.fillRect(M.x+40,M.y+112,M.w-80,22);c.fillStyle="rgba(255,255,255,0.12)";c.fillRect(M.x+40,M.y+112,M.w-80,4);
  // the ten bins along the front
  for(let k=0;k<10;k++){const bx=M.x+40+k*(M.w-80)/10,bw=(M.w-80)/10-14;ag_soft(c,q=>q.rect(bx,M.bins-100,bw,150),[188,182,168],[226,220,206],bx+bw*0.8,M.bins-80,120,"rgba(40,36,30,0.4)",8,0.4);
    c.fillStyle=rgba([46,44,46],1);c.fillRect(bx+8,M.bins-92,bw-16,24);}
  // the feed: a stack of letters on the left end, and the control panel's dark window
  // the feed: a tray on the deck at the left end, letters standing on edge in it, waiting
  ag_soft(c,k=>k.rect(M.x+30,M.y+4,170,64),[196,190,176],[232,228,218],M.x+170,M.y+14,120,"rgba(40,36,30,0.35)",8,0.4);
  for(let k=0;k<16;k++){c.fillStyle=rgba(mix(HF.paper,[208,192,164],(k%3)/3),1);c.fillRect(M.x+44+k*9,M.y-46+(k%2)*3,7,66);c.fillStyle="rgba(90,70,50,0.25)";c.fillRect(M.x+50+k*9,M.y-46+(k%2)*3,1.5,66);}
  // the control panel's dark window and its lamps, on the cabinet's front at the right, above the bins
  ag_soft(c,k=>k.rect(M.x+M.w-230,M.y+176,170,70),[58,60,64],[96,98,104],M.x+M.w-100,M.y+186,90,null);
  for(let k=0;k<4;k++){c.fillStyle=rgba([230,226,214],0.85);c.beginPath();c.arc(M.x+M.w-200+k*36,M.y+211,7,0,TAU);c.fill();}
  // the small case at the left, ten holes, one per first digit
  ag_soft(c,k=>k.rect(110,330,520,300),HF.oak,HF.oakL,560,360,500,"rgba(40,24,10,0.45)",12,0.35);c.fillStyle=rgba(HF.oakD,1);c.fillRect(100,316,540,16);
  for(let k=0;k<10;k++){const i=k%5,j=Math.floor(k/5),x0=130+i*98,y0=350+j*140;c.fillStyle=rgba([46,30,20],1);c.fillRect(x0,y0,84,90);c.fillStyle="rgba(20,12,6,0.4)";c.fillRect(x0,y0,84,7);}
  c.fillStyle=rgba(hf_sh(HF.oak,0.6),1);c.fillRect(130,630,20,212);c.fillRect(590,630,20,212);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,26,14,0.16)");g.addColorStop(0.6,"rgba(40,26,14,0)");g.addColorStop(1,"rgba(255,240,210,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.hfMachine=c=>hf_paintMachine(c);
// the first-digit case's labels and the machine's bins' digits, live (30 px); and letters travelling along the belt into bin d
function hf_machineLife(ctx,t,o){o=o||{};for(let k=0;k<10;k++){const i=k%5,j=Math.floor(k/5),x0=130+i*98,y0=350+j*140;dq_card(ctx,x0+18,y0+96,48,36,{r:4});dq_T(ctx,String(k),x0+42,y0+124,{w:700,size:30,align:"center"});
    if(k===0&&o.first>0){ctx.save();ctx.globalAlpha*=o.first;ctx.strokeStyle=rgba(HF.ink,0.9);ctx.lineWidth=3;rr(ctx,x0+14,y0+92,56,44,6);ctx.stroke();ctx.fillStyle=rgba(HF.paper,1);ctx.fillRect(x0+8,y0+56,68,26);ctx.strokeStyle="rgba(110,90,60,0.4)";ctx.lineWidth=1.2;ctx.strokeRect(x0+8,y0+56,68,26);ctx.restore();}}
  const M=HF_MACH;for(let k=0;k<10;k++){const bx=M.x+40+k*(M.w-80)/10,bw=(M.w-80)/10-14;dq_card(ctx,bx+bw/2-24,M.bins+66,48,38,{r:4});dq_T(ctx,String(k),bx+bw/2,M.bins+95,{w:700,size:30,align:"center"});}
  if(o.run>0){const R=ag_rnd(3);for(let q=0;q<9;q++){const d=Math.floor(R()*10),u=((t*0.32+q/9)%1),bx=M.x+40+d*(M.w-80)/10+((M.w-80)/10-14)/2,x=u<0.7?lerp(M.feed[0]+40,bx,u/0.7):bx,y=u<0.7?M.y+112:lerp(M.y+112,M.bins-70,(u-0.7)/0.3);
    ctx.save();ctx.globalAlpha*=o.run*clamp(Math.min(u*10,(1-u)*10),0,1);ctx.fillStyle=rgba(HF.paper,1);ctx.fillRect(x-26,y-8,52,16);ctx.strokeStyle="rgba(110,90,60,0.4)";ctx.lineWidth=1.2;ctx.strokeRect(x-26,y-8,52,16);ctx.restore();}}}
