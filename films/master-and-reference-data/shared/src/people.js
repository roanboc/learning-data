/* ===== The same one, everywhere: the series' people, in pencil and wash =====
   The films' people (When things go wrong's character sheet), drawn the watercolour way: a fine pencil line, paint that runs a little
   past it, pigment in the paper's tooth, and behind them a loose wash of their side's colour: cyan for the technical side (Noor), gold
   for the business side (Mei, Minh). Linh, the person the data is about, has no side: a neutral edge, so she can wear her roles'
   colours. Minh, her brother, shares the family email and studies here too. These replace how the character sheet shades and outlines
   people, for this series only. */

PEOPLE.linh={name:"Linh Nguyen",role:"Student",side:"Person",does:"uses",edge:[236,232,226],seed:21,
  skin:[230,192,156],hair:{style:"bob",c:[30,24,26],streak:[86,72,74]},earrings:[226,230,240],
  top:{kind:"overshirt",c:[88,124,168],inner:[246,242,234]},bottom:{c:[52,56,70]},shoe:[240,240,244],build:{sh:64,hip:58,h:0.93}};
PEOPLE.minh={name:"Minh Nguyen",role:"Student",side:"Business",does:"uses",edge:BIZ,seed:22,
  skin:[218,176,138],hair:{style:"cropped",c:[24,22,24]},glasses:[44,42,50],
  top:{kind:"sweater",c:[178,100,74]},bottom:{c:[62,82,114]},shoe:[46,46,52],build:{sh:70,hip:58,h:0.97}};
// reading a letter in the right hand; standing at ease, hands loose
POSE.letter={L:[0.12,-0.04],R:[0.06,Math.PI+0.95],hold:"envelope",feet:24,shift:-2,tilt:0.06,turn:0.06,gaze:[-0.2,1],look:1};
POSE.ease={L:[0.16,-0.18],R:[0.14,-0.16],feet:26,shift:2,tilt:-0.015,turn:-0.04,gaze:[0,0],look:0};

// softer shading than the glass films: watercolour has little modelling
const WC_SHADE=0.75,WC_SEAM=0.8;
function litFill(ctx,c,x0,y0,x1,y1,k){k=(k||1)*WC_SHADE;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(lighten(c,0.16*k),1));g.addColorStop(0.55,rgba(c,1));
  g.addColorStop(1,rgba(darken(c,0.3*k),1));ctx.fillStyle=g;ctx.fill();}
function seam(ctx,c,a,w){ctx.strokeStyle=rgba(darken(c,0.55),(a==null?0.45:a)*WC_SEAM);ctx.lineWidth=w||1.6;ctx.stroke();}
function limb(ctx,pts,w0,w1,c,box){const g=ctx.createLinearGradient(box[0],box[1],box[2],box[3]);g.addColorStop(0,rgba(lighten(c,0.14*WC_SHADE),1));g.addColorStop(1,rgba(darken(c,0.28*WC_SHADE),1));
  ctx.lineCap="round";ctx.lineJoin="round";
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);
    ctx.strokeStyle=rgba(darken(c,0.55),0.5*WC_SEAM);ctx.lineWidth=w+2.4;ctx.stroke();}
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.strokeStyle=g;ctx.lineWidth=w;ctx.stroke();}}

// a person, as the character sheet draws one, with a soft shadow on the paper rather than a dark one; WC_RAW draws the figure alone (no
// shadow, no edge), for the white figure (wash.js) to be cut from
let WC_RAW=false;
function person(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h;
  const br=Math.sin(t*1.7+P.seed)*1.4;
  if(!WC_RAW){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,rgba([90,80,96],0.2));g.addColorStop(1,rgba([90,80,96],0));ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();}
  const front=a=>a[1]>Math.PI*0.8;
  outlined(ctx,cx=>{
    if(!front(po.L))arm(cx,P,-1,po.L,br,po);if(!front(po.R))arm(cx,P,1,po.R,br,po);
    legs(cx,P,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);
    torso(cx,P,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt);cx.translate(0,-50+po.look*2);head(cx,P,E,po,t);cx.restore();
    if(front(po.L))arm(cx,P,-1,po.L,br,po);if(front(po.R))arm(cx,P,1,po.R,br,po);
  },x,y,k,P.edge,[-250,-650,250,10],o.glow);}

// the pencil and wash: the figure, drawn into a spare canvas, then a loose wash of its side's colour behind it, the paint bleeding a little
// past the line, pigment in the paper's tooth, and a fine pencil line round it. Blurs are made by shrinking and growing, which is cheap.
const wc_aura=e=>e[0]>200&&e[1]>200&&e[2]>200?WC_SIDE.none:e===TECH?WC_SIDE.tech:e===BIZ?WC_SIDE.biz:e;
function outlined(ctx,draw,x,y,s,edge,box,glowA){const [x0,y0,x1,y1]=box,pad=40,w=Math.ceil((x1-x0)*s+pad*2),h=Math.ceil((y1-y0)*s+pad*2);
  const [c,cx]=pcanvas("p",w,h);cx.translate(pad-x0*s,pad-y0*s);cx.scale(s,s);draw(cx);const ox=x+x0*s-pad,oy=y+y0*s-pad;
  if(WC_RAW){ctx.drawImage(c,ox,oy);return;}
  wc_prep();const q=8,sw=Math.max(2,Math.ceil(w/q)),sh=Math.max(2,Math.ceil(h/q)),col=wc_aura(edge);
  // the silhouette in the side's colour, shrunk: grown again, it is a soft blur
  const [sc,sx]=wc_buf("figS"+sw+"x"+sh,sw,sh);sx.drawImage(c,0,0,sw,sh);sx.globalCompositeOperation="source-in";sx.fillStyle=rgba(col,1);sx.fillRect(0,0,sw,sh);
  ctx.save();ctx.globalAlpha*=0.3;ctx.globalCompositeOperation="multiply";ctx.imageSmoothingEnabled=true;ctx.drawImage(sc,ox-10*s-q,oy+6*s-q,w+2*q,h+2*q);ctx.restore();
  // the paint, with the paper's grain and an uneven dry
  const [fc,fx]=wc_wpaint(c,w,h);
  const [bc,bx]=wc_buf("figB"+w+"x"+h,Math.ceil(w/4),Math.ceil(h/4));bx.drawImage(fc,0,0,bc.width,bc.height);
  ctx.save();ctx.globalAlpha*=0.4;ctx.drawImage(bc,ox+2*s,oy+1*s,w,h);ctx.restore();
  // the pencil line: the silhouette in pencil, a little off in four directions, under the paint
  const [tc,tx]=wc_buf("figT"+w+"x"+h,w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha*=0.8;for(const [dx,dy] of [[1.5*s,0.4*s],[-1.2*s,1.1*s],[0.3*s,-1.4*s],[-0.6*s,-0.9*s]])ctx.drawImage(tc,ox+dx,oy+dy);ctx.restore();
  ctx.drawImage(fc,ox,oy);}
function wc_wpaint(c,w,h){const [fc,fx]=wc_buf("figP"+w+"x"+h,w,h);fx.drawImage(c,0,0);fx.globalCompositeOperation="multiply";fx.globalAlpha=0.5;fx.drawImage(WC.gran,0,0);
  fx.globalAlpha=0.4;fx.drawImage(wc_tint(WC.blotch,[206,196,186]),0,0,W,H);fx.globalAlpha=1;fx.globalCompositeOperation="destination-in";fx.drawImage(c,0,0);
  fx.globalCompositeOperation="source-over";return[fc,fx];}

// an envelope in the hand, for the person who opens someone else's post: the letter half out, the fingers over its edge
function envelopeInHand(ctx,P,h,ang){ctx.save();ctx.translate(h[0]-2,h[1]+4);ctx.rotate(-0.08);const line=[110,100,96];
  ctx.save();ctx.rotate(0.16);ctx.beginPath();rr(ctx,-30,-44,76,60,3);ctx.fillStyle="#ffffff";ctx.fill();ctx.strokeStyle=rgba(line,0.6);ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=rgba(line,0.5);for(let i=0;i<2;i++)ctx.fillRect(-20,-34+i*10,44-i*12,3.4);ctx.fillStyle=rgba(WC_ROLE.customer,0.95);ctx.beginPath();ctx.arc(30,-30,6,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();rr(ctx,-52,-8,104,66,5);ctx.fillStyle=rgba([250,247,240],1);ctx.fill();ctx.strokeStyle=rgba(line,0.7);ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-50,-4);ctx.lineTo(0,26);ctx.lineTo(50,-4);ctx.strokeStyle=rgba(line,0.45);ctx.stroke();
  ell(ctx,-30,-4,13,14);litFill(ctx,P.skin,-43,-18,-17,10);ell(ctx,-12,-10,6,10,0.3);litFill(ctx,P.skin,-18,-20,-6,0);
  ctx.restore();}
// the character sheet's hands hold a phone; this lets one hold an envelope too, drawn where the phone would be
const wc_arm0=arm;
arm=function(ctx,P,s,a,br,po){if(po.hold!=="envelope")return wc_arm0(ctx,P,s,a,br,po);const keep=phoneInHand;phoneInHand=envelopeInHand;
  try{return wc_arm0(ctx,P,s,a,br,Object.assign({},po,{hold:"phone"}));}finally{phoneInHand=keep;}};
