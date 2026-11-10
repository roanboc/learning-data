/* ===== Proof it held: the vial, its monitor, and the opening's places =====
   The opening story, in the module's night light: a small bottle of polio vaccine, a vial, with a dropper cap and a paper label; on
   the label, the vaccine vial monitor, a square printed inside a circle (WHO, "What is VVM and how does it work?"): the circle is a
   fixed reference colour, the square starts lighter and darkens with heat, gradually and irreversibly; lighter than the circle, the
   vaccine can be used; as dark as the circle or darker, the vial is thrown away. Drawn here as the WHO's own pictures draw it, with no
   maker's name, no country and no flag. A health worker of the time, in a plain uniform, holds a vial (a hand only on what the story
   is about); no child is drawn: the harm is said, and shown with the vials, the bin and the label.
   Every name here starts with ph_ or PH_. Sizes are in the 1920 x 1080 frame. */

const PH_C={
  glass:[176,226,232],          // the vial's glass, ice in the night light
  liquid:[214,196,170],         // the vaccine, a pale straw colour
  cap:[196,206,212],            // the dropper cap, pale plastic
  paper:[222,226,218],          // the label
  print:[96,110,118],           // the label's printed lines (decoration)
  circle:[70,58,104],           // the monitor's circle: the reference colour, which never changes
  fresh:[240,242,236],          // the square, as made: much lighter than the circle
  burnt:[36,28,58],             // the square after too much heat: darker than the circle
  warm:[255,190,120]            // the sun's heat on a vial
};
// the square's colour: 0 as made, 0.75 as dark as the circle, 1 darker; heat only ever moves it up
function ph_squareCol(d){d=clamp(d,0,1);return d<=0.75?mix(PH_C.fresh,PH_C.circle,ag_sine(d/0.75)):mix(PH_C.circle,PH_C.burnt,(d-0.75)/0.25);}
// the monitor itself: the circle (radius r) and the square inside it, its darkness d
function ph_vvm(ctx,cx,cy,r,d,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(PH_C.circle,1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(PH_C.circle,[255,255,255],0.18),0.9);ctx.lineWidth=Math.max(1,r*0.035);ctx.stroke();
  const q=r*0.62;ctx.fillStyle=rgba(ph_squareCol(d),1);ctx.fillRect(cx-q,cy-q,2*q,2*q);
  ctx.strokeStyle=rgba(mix(ph_squareCol(d),[0,0,0],0.25),0.7);ctx.lineWidth=Math.max(1,r*0.02);ctx.strokeRect(cx-q,cy-q,2*q,2*q);ctx.restore();}

/* ph_vial(ctx, x, y, s, o): a vial standing on (x, y), the middle of its foot, 250 s tall: o.dark the square's darkness, o.warm (0 to
   1) the sun's heat on it, o.a, o.drop (0 to 1) a drop leaving the dropper's tip, o.tilt (radians) as a hand holds it, o.label (false:
   no label, as on a rack far off), o.fill (0 to 1) how full it is */
function ph_vial(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);if(o.tilt)ctx.rotate(o.tilt);ctx.scale(s,s);
  const W2=52,BT=-150,NK=-178,NT=-192;
  if(o.warm>0){const g=ctx.createRadialGradient(0,-90,10,0,-90,190);g.addColorStop(0,rgba(PH_C.warm,0.42*o.warm));g.addColorStop(1,rgba(PH_C.warm,0));ctx.fillStyle=g;ctx.fillRect(-200,-290,400,400);}
  // its shadow on what it stands on
  const sg=ctx.createRadialGradient(0,2,2,0,2,70);sg.addColorStop(0,"rgba(0,8,10,0.55)");sg.addColorStop(1,"rgba(0,8,10,0)");ctx.save();ctx.scale(1,0.22);ctx.fillStyle=sg;ctx.fillRect(-80,-60,160,120);ctx.restore();
  // the body: glass, with the vaccine in it
  const body=c=>{c.beginPath();c.moveTo(-W2,BT+18);c.quadraticCurveTo(-W2,BT,-W2+16,BT-6);c.bezierCurveTo(-22,BT-12,-24,NK+6,-24,NK);c.lineTo(24,NK);c.bezierCurveTo(24,NK+6,22,BT-12,W2-16,BT-6);
    c.quadraticCurveTo(W2,BT,W2,BT+18);c.lineTo(W2,-14);c.quadraticCurveTo(W2,0,W2-14,0);c.lineTo(-W2+14,0);c.quadraticCurveTo(-W2,0,-W2,-14);c.closePath();};
  ctx.save();body(ctx);ctx.fillStyle=rgba(mix(PH_C.glass,[8,26,30],0.72),0.85);ctx.fill();ctx.clip();
  const lv=lerp(-4,BT+4,o.fill==null?0.82:o.fill);ctx.fillStyle=rgba(PH_C.liquid,0.55);ctx.fillRect(-W2,lv,2*W2,-lv);
  ctx.fillStyle=rgba(mix(PH_C.liquid,[255,255,255],0.4),0.6);ctx.fillRect(-W2,lv,2*W2,2.5);
  // light through the glass: a bright strip on the left, a fainter one on the right
  let g=ctx.createLinearGradient(-W2,0,W2,0);g.addColorStop(0,"rgba(220,250,250,0.0)");g.addColorStop(0.12,"rgba(220,250,250,0.42)");g.addColorStop(0.24,"rgba(220,250,250,0.06)");
  g.addColorStop(0.8,"rgba(220,250,250,0.02)");g.addColorStop(0.9,"rgba(220,250,250,0.22)");g.addColorStop(1,"rgba(220,250,250,0)");ctx.fillStyle=g;ctx.fillRect(-W2,NK,2*W2,-NK);ctx.restore();
  ctx.save();body(ctx);ctx.strokeStyle=rgba(mix(PH_C.glass,[255,255,255],0.3),0.95);ctx.lineWidth=2.2;ctx.stroke();ctx.restore();
  // the label, round the body, and the monitor on it
  if(o.label!==false){const ly=BT+28,lh=96;ctx.save();ctx.beginPath();ctx.rect(-W2-1,ly,2*W2+2,lh);ctx.clip();
    g=ctx.createLinearGradient(-W2,0,W2,0);g.addColorStop(0,rgba(mix(PH_C.paper,[30,40,44],0.45),1));g.addColorStop(0.22,rgba(PH_C.paper,1));g.addColorStop(0.7,rgba(mix(PH_C.paper,[30,40,44],0.12),1));g.addColorStop(1,rgba(mix(PH_C.paper,[20,30,34],0.55),1));
    ctx.fillStyle=g;ctx.fillRect(-W2,ly,2*W2,lh);ctx.fillStyle=rgba(PH_C.print,0.75);for(const [yy,ww] of [[ly+20,46],[ly+34,34],[ly+70,52],[ly+82,40]])ctx.fillRect(-W2+12,yy,ww*0.9,4);
    ctx.restore();ph_vvm(ctx,22,ly+48,19,o.dark||0);}
  // the neck and the dropper cap
  ctx.save();ctx.beginPath();ctx.moveTo(-26,NK);ctx.lineTo(-26,NT+2);ctx.quadraticCurveTo(-26,NT-4,-20,NT-4);ctx.lineTo(20,NT-4);ctx.quadraticCurveTo(26,NT-4,26,NT+2);ctx.lineTo(26,NK);ctx.closePath();
  g=ctx.createLinearGradient(-26,0,26,0);g.addColorStop(0,rgba(mix(PH_C.cap,[20,30,34],0.5),1));g.addColorStop(0.3,rgba(PH_C.cap,1));g.addColorStop(1,rgba(mix(PH_C.cap,[20,30,34],0.55),1));ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.moveTo(-17,NT-4);ctx.bezierCurveTo(-15,NT-28,-6,NT-44,-3,NT-56);ctx.lineTo(3,NT-56);ctx.bezierCurveTo(6,NT-44,15,NT-28,17,NT-4);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix(PH_C.cap,[255,255,255],0.4),0.8);ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
  // a drop at the tip, falling
  if(o.drop>0){const u=clamp(o.drop,0,1),dy=NT-56+8+ag_in(u,0.35,0.65)*150*ag_in(u,0.35,0.65),da=1-ag_in(u,0.8,0.2),r=6*Math.min(1,u*2.4);
    ctx.save();ctx.globalAlpha*=da;ctx.fillStyle=rgba(mix(PH_C.liquid,[255,255,255],0.25),0.95);ctx.beginPath();ctx.arc(0,dy,r,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(-r*0.35,dy-r*0.35,r*0.3,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}

// a bin for what is thrown away: a dark tub with a coral rim
function ph_bin(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f("coral");ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.beginPath();ctx.moveTo(-120,-170);ctx.lineTo(120,-170);ctx.lineTo(100,0);ctx.lineTo(-100,0);ctx.closePath();const g=ctx.createLinearGradient(-120,0,120,0);
  g.addColorStop(0,"rgb(14,30,34)");g.addColorStop(0.4,"rgb(30,52,56)");g.addColorStop(1,"rgb(10,24,28)");ctx.fillStyle=g;ctx.fill();
  ctx.save();ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=14;ctx.strokeStyle=rgba(c,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-124,-170);ctx.lineTo(124,-170);ctx.stroke();ctx.restore();
  ctx.strokeStyle="rgba(150,210,214,0.25)";ctx.lineWidth=1.5;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*40,-150);ctx.lineTo(i*34,-16);ctx.stroke();}ctx.restore();}

// a vaccine carrier: an insulated box with a lid and a handle, matte blue-grey in the night, cold inside (a thin cyan rim: kept cold)
function ph_carrier(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const g=ctx.createLinearGradient(-150,0,150,0);g.addColorStop(0,"rgb(66,84,92)");g.addColorStop(0.3,"rgb(96,116,124)");g.addColorStop(1,"rgb(46,62,70)");
  rr(ctx,-150,-170,300,170,18);ctx.fillStyle=g;ctx.fill();rr(ctx,-160,-206,320,46,14);ctx.fillStyle="rgb(84,104,112)";ctx.fill();
  ctx.strokeStyle="rgba(10,24,28,0.7)";ctx.lineWidth=2;rr(ctx,-160,-206,320,46,14);ctx.stroke();
  ctx.strokeStyle="rgb(58,74,80)";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-70,-206);ctx.bezierCurveTo(-70,-262,70,-262,70,-206);ctx.stroke();
  ctx.fillStyle="rgba(255,210,160,0.10)";rr(ctx,-150,-170,300,8,4);ctx.fill();
  ctx.save();ctx.shadowColor=rgba(dp_f("cyan"),0.5);ctx.shadowBlur=6;ctx.strokeStyle=rgba(dp_f("cyan"),0.55);ctx.lineWidth=2;rr(ctx,-150,-170,300,170,18);ctx.stroke();ctx.restore();
  ctx.restore();}

// the sun, far off: warm light from the top right, for a vial left too long in it
function ph_sun(ctx,x,y,r,a){if(!(a>0))return;ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(PH_C.warm,0.55*a));g.addColorStop(0.25,rgba(PH_C.warm,0.22*a));g.addColorStop(1,rgba(PH_C.warm,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

// a question mark in ice, for what can't be told by looking
function ph_ask(ctx,x,y,size,a){if(!(a>0))return;dp_T(ctx,"?",x,y,{w:800,size:size||72,align:"center",a,glow:"cyan",col:"ink"});}

/* ---------------------------------------------------------------- the health worker
   A health worker of the 1970s to the 1990s, in a plain short tunic over a shirt, hair in a bun; no badge, no flag, no country. Lit by
   the clinic's lamp. Holds a vial before the chest (pose "hold"), looking at its label. */
const PH_WORKER={key:"phWorker",name:"A health worker",role:"",skin:[166,116,86],hair:{style:"bun",c:[30,24,24]},top:{kind:"tunic",c:[112,150,166],inner:[232,234,230]},breath:0.27};
DP_PEOPLE.push([PH_WORKER,"lamp"],"mei","yusuf","anil");
// the vial in the worker's near hand, in figure space: upright, its label towards us, under the hand (holdBack), which closes round it
let PH_LABELAT=null;
function ph_heldVial(c,h,dark,o){o=o||{};const [wx,wy]=h.near,vx=wx+14,vy=wy+96;ph_vial(c,vx,vy,0.62,{dark,tilt:-0.06,fill:0.8,warm:o.warm||0});
  PH_LABELAT=c.getTransform().transformPoint(new DOMPoint(vx+22*0.62,vy-74*0.62));}
// where the held vial's monitor was last drawn, in the frame's coordinates as ctx draws now
function ph_labelAt(ctx){if(!PH_LABELAT)return[600,640];const p=ctx.getTransform().inverse().transformPoint(PH_LABELAT);return[p.x,p.y];}
// the bench's front, from the clinic's own picture, laid over a person who stands behind it: it hides what reaches below its edge
function ph_benchFront(ctx){const p=ag_place("phClinic"),k=p.height/H;ctx.drawImage(p,0,830*k,p.width,(H-830)*k,0,830,W,H-830);}

/* ---------------------------------------------------------------- the opening's places, painted once
   phClinic: a clinic at night, lit by a lamp at the left: a dark wall, a shelf with the vaccine carrier, a window of night, the bench
   in front. phLabel: the same night, close on a vial's label: a bench of dark glass and the lamp's warm haze, nothing else. */
AG_PLACES.phClinic=c=>{const w=W,h=H;let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(10,24,28)");g.addColorStop(0.72,"rgb(16,36,40)");g.addColorStop(1,"rgb(8,20,24)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the lamp's warm pool on the wall, at the left
  g=c.createRadialGradient(420,300,20,420,300,760);g.addColorStop(0,"rgba(255,200,140,0.20)");g.addColorStop(0.5,"rgba(255,190,130,0.06)");g.addColorStop(1,"rgba(255,190,130,0)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the window: night, a frosted pane with a cool edge
  c.save();rr(c,1420,110,400,380,10);c.fillStyle="rgb(12,30,40)";c.fill();c.clip();g=c.createLinearGradient(1420,110,1820,490);g.addColorStop(0,"rgba(90,150,170,0.20)");g.addColorStop(1,"rgba(40,80,100,0.05)");c.fillStyle=g;c.fillRect(1420,110,400,380);
  for(let i=0;i<30;i++){const R=ag_rnd(11+i);c.fillStyle="rgba(200,240,250,"+(0.05+R()*0.2).toFixed(2)+")";c.beginPath();c.arc(1420+R()*400,110+R()*270,0.8+R()*1.6,0,TAU);c.fill();}c.restore();
  c.strokeStyle="rgba(150,215,225,0.40)";c.lineWidth=3;rr(c,1420,110,400,380,10);c.stroke();c.beginPath();c.moveTo(1620,110);c.lineTo(1620,490);c.moveTo(1420,300);c.lineTo(1820,300);c.stroke();
  // the shelf, and the carrier on it
  c.fillStyle="rgb(40,58,58)";c.fillRect(1400,660,520,18);c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(1400,678,520,10);
  ph_carrier(c,1640,660,0.8,{});
  // the bench in front, dark wood, lit from the lamp
  g=c.createLinearGradient(0,830,0,h);g.addColorStop(0,"rgb(58,46,36)");g.addColorStop(0.08,"rgb(42,34,28)");g.addColorStop(1,"rgb(20,18,16)");c.fillStyle=g;c.fillRect(0,830,w,h-830);
  c.fillStyle="rgba(255,210,160,0.16)";c.fillRect(0,830,w,3);};
AG_PLACES.phLabel=c=>{const w=W,h=H;let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(8,20,24)");g.addColorStop(0.7,"rgb(14,32,36)");g.addColorStop(1,"rgb(6,16,20)");c.fillStyle=g;c.fillRect(0,0,w,h);
  g=c.createRadialGradient(640,420,30,640,420,900);g.addColorStop(0,"rgba(255,200,140,0.13)");g.addColorStop(1,"rgba(255,190,130,0)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // a bench of dark glass, its far edge catching the light
  g=c.createLinearGradient(0,760,0,h);g.addColorStop(0,"rgb(24,46,50)");g.addColorStop(1,"rgb(8,20,24)");c.fillStyle=g;c.fillRect(0,760,w,h-760);
  c.fillStyle=rgba(DP.ice,0.3);c.fillRect(0,760,w,2);
  // a few soft lights far off in the dark, placed, none at an edge
  for(const [x,y,r,al] of [[1180,200,110,0.05],[1560,320,80,0.04],[1760,170,60,0.035],[300,170,70,0.03],[860,110,50,0.03]]){g=c.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,"rgba(104,216,230,"+al+")");g.addColorStop(1,"rgba(104,216,230,0)");c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}};
