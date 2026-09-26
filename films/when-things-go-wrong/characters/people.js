/* When things go wrong: the people. Characters drawn in code, in the first film's design language:
   rounded forms, soft light from the upper left, a luminous outline, and a few expressive lines for faces.
   The outline's colour carries meaning, like every colour in the films: cyan for the technical side, gold for the business side.
   Needs the film's helpers (rgba, mix, clamp, lerp, TAU), from site/assets/film/film.js.

   person(ctx,id,x,y,s,o)      draws a character facing us, feet at (x,y); s=1 is 560 px tall.
                               o.pose: "stand" | "phone" | "explain"; o.expr: "calm" | "concerned" | "relieved"; o.t: seconds, for breathing and blinking.
   personBack(ctx,id,x,y,s,o)  draws a character from behind, from the waist up, for over-the-shoulder shots. */

const TECH=[120,200,255],BIZ=[255,209,102];
const PEOPLE={
  mei:{name:"Mei Tanaka",role:"Registrar's office",side:"Business",does:"produces",edge:BIZ,seed:1,
    skin:[232,194,164],hair:{style:"bun",c:[26,24,30]},earrings:[255,214,140],
    top:{kind:"cardigan",c:[98,134,114],inner:[236,236,230]},bottom:{kind:"skirt",c:[44,56,92]},legs:[52,48,60],shoe:[34,32,40],build:{sh:66,hip:58,h:0.95}},
  ben:{name:"Ben Carter",role:"Student system team",side:"Technical",does:"produces",edge:TECH,seed:2,
    skin:[238,196,166],hair:{style:"side",c:[128,78,44]},beard:[118,70,40],
    top:{kind:"shirt",c:[140,172,208],rolled:true},bottom:{c:[98,92,76]},shoe:[70,50,38],build:{sh:80,hip:60,h:1.03}},
  ana:{name:"Ana Ruiz",role:"Head of School",side:"Business",does:"uses",edge:BIZ,seed:3,
    skin:[212,158,124],hair:{style:"bob",c:[62,44,36],streak:[178,176,182]},
    top:{kind:"blazer",c:[164,84,64],inner:[238,230,216]},bottom:{c:[50,52,62]},shoe:[46,32,30],build:{sh:70,hip:60,h:0.97}},
  sam:{name:"Sam Okafor",role:"Data engineer",side:"Technical",does:"uses",edge:TECH,seed:4,
    skin:[112,72,50],hair:{style:"coily",c:[30,24,22]},glasses:[28,30,38],lanyard:TECH,
    top:{kind:"overshirt",c:[60,92,110],inner:[212,220,232]},bottom:{c:[42,50,66]},shoe:[28,30,36],build:{sh:74,hip:58,h:1}},
  leila:{name:"Leila Haddad",role:"Admissions office",side:"Business",does:"produces",edge:BIZ,seed:5,
    skin:[198,150,112],hijab:[96,62,102],
    top:{kind:"blazer",c:[178,134,52],inner:[236,228,214]},bottom:{c:[36,38,46]},shoe:[32,28,30],build:{sh:68,hip:60,h:0.96}},
  rosa:{name:"Rosa Díaz",role:"Admissions system team",side:"Technical",does:"produces",edge:TECH,seed:6,
    skin:[182,130,92],hair:{style:"curly",c:[46,30,24]},
    top:{kind:"sweater",c:[204,110,92]},bottom:{c:[54,72,98]},shoe:[226,228,232],build:{sh:66,hip:60,h:0.95}},
  david:{name:"Prof. David Mensah",role:"Deputy Vice-Chancellor",side:"Business",does:"uses",edge:BIZ,seed:7,
    skin:[78,50,36],hair:{style:"cropped",c:[190,190,192]},beard:[196,196,198],
    top:{kind:"suit",c:[40,52,78],inner:[234,238,244]},bottom:{c:[38,46,66]},shoe:[26,22,22],build:{sh:80,hip:64,h:1.02}}
};
// arm angles are [upper arm, forearm], in radians from pointing straight down; positive points away from the body
const POSE={
  stand:  {L:[0.13,-0.1],R:[0.09,0.06],feet:25,shift:3,tilt:0.025,turn:0.05,gaze:[0,0],look:0},
  phone:  {L:[0.11,-0.02],R:[0.07,Math.PI+0.64],hold:"phone",feet:25,shift:-3,tilt:0.05,turn:0.08,gaze:[0.15,1],look:1},
  explain:{L:[0.1,-0.06],R:[0.98,2.3],hand:"open",feet:36,shift:6,tilt:-0.06,turn:0.28,gaze:[0.25,0],look:0}
};
// brows: inner and outer height (negative is up), arch; eyes: how open; mouth: smile (-1 to 1), open, width
const EXPR={
  calm:     {bi:0,bo:0,arch:-2.5,eye:1,smile:0.3,open:0,mw:17},
  concerned:{bi:-4.5,bo:2,arch:-1,knit:2,eye:0.92,smile:-0.4,open:0,mw:14},
  relieved: {bi:-2,bo:-3.5,arch:-4,eye:0.62,happy:1,smile:1,open:0.8,mw:24}
};

const lighten=(c,k)=>mix(c,[255,255,255],k),darken=(c,k)=>mix(c,[0,0,0],k);
function litFill(ctx,c,x0,y0,x1,y1,k){k=k||1;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(lighten(c,0.16*k),1));g.addColorStop(0.55,rgba(c,1));g.addColorStop(1,rgba(darken(c,0.3*k),1));ctx.fillStyle=g;ctx.fill();}
function seam(ctx,c,a,w){ctx.strokeStyle=rgba(darken(c,0.55),a==null?0.45:a);ctx.lineWidth=w||1.6;ctx.stroke();}
function ell(ctx,x,y,rx,ry,r){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r||0,0,TAU);}
function limb(ctx,pts,w0,w1,c,box){ // a tapered, rounded limb through points, lit from the upper left
  const g=ctx.createLinearGradient(box[0],box[1],box[2],box[3]);g.addColorStop(0,rgba(lighten(c,0.14),1));g.addColorStop(1,rgba(darken(c,0.28),1));
  ctx.lineCap="round";ctx.lineJoin="round";
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));
    ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);
    ctx.strokeStyle=rgba(darken(c,0.55),0.5);ctx.lineWidth=w+2.4;ctx.stroke();}
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));
    ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.strokeStyle=g;ctx.lineWidth=w;ctx.stroke();}}

/* ---- body ---- */
function legs(ctx,P,po){const f=po.feet,sh=po.shift,b=P.bottom,skirt=b.kind==="skirt";
  for(const s of [-1,1]){const hip=[s*22+sh*0.6,-282],knee=[s*f*0.8+sh*0.3,-146],ank=[s*f,-26];
    ell(ctx,s*(f+7),-11,21,11,s*0.12);litFill(ctx,P.shoe,-40,-24,40,0);seam(ctx,P.shoe,0.5);
    if(skirt)limb(ctx,[[knee[0]*0.9,-170],knee,ank],23,19,P.legs,[-60,-200,60,0]);
    else limb(ctx,[hip,knee,ank],47,37,b.c,[-80,-300,80,0]);}
  const hw=P.build.hip;
  if(skirt){ctx.beginPath();ctx.moveTo(-hw+4,-312);ctx.lineTo(hw-4+sh,-312);ctx.quadraticCurveTo(hw+10+sh,-240,hw+16+sh*0.5,-150);ctx.quadraticCurveTo(0,-140,-hw-16+sh*0.5,-150);ctx.quadraticCurveTo(-hw-10,-240,-hw+4,-312);ctx.closePath();
    litFill(ctx,b.c,-hw,-312,hw,-150);seam(ctx,b.c,0.5);}
  else{ctx.beginPath();ctx.moveTo(-hw+2,-312);ctx.lineTo(hw-2+sh,-312);ctx.quadraticCurveTo(hw+2+sh,-272,hw-8+sh*0.6,-252);ctx.lineTo(sh*0.4,-228);ctx.lineTo(-hw+8+sh*0.6,-252);ctx.quadraticCurveTo(-hw-2,-272,-hw+2,-312);ctx.closePath();
    litFill(ctx,b.c,-hw,-312,hw,-228);}}
function torsoPath(ctx,P,br,sh){const sw=P.build.sh,hw=P.build.hip,y0=-448+br;ctx.beginPath();ctx.moveTo(-15,y0);
  ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
  ctx.bezierCurveTo(-sw-2,y0+84,-hw-2,-352,-hw+2,-322);ctx.quadraticCurveTo(-hw-4+sh*0.4,-290,-hw-1+sh*0.6,-256);
  ctx.quadraticCurveTo(sh*0.6,-248,hw+1+sh*0.6,-256);ctx.quadraticCurveTo(hw+4+sh*0.4,-290,hw-2,-322);
  ctx.bezierCurveTo(hw+2,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,15,y0);ctx.closePath();}
function torso(ctx,P,br,sh){const T=P.top,c=T.c,sw=P.build.sh,y0=-448+br;
  torsoPath(ctx,P,br,sh);litFill(ctx,c,-sw,y0,sw,-250);seam(ctx,c,0.5);
  ctx.save();torsoPath(ctx,P,br,sh);ctx.clip();
  const inner=(pts)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();litFill(ctx,T.inner,-20,y0,20,-260,0.6);};
  if(T.kind==="blazer"||T.kind==="suit"){inner([[-17,y0-2],[17,y0-2],[1+sh*0.3,-352]]);
    ctx.strokeStyle=rgba(darken(c,0.5),0.7);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-17,y0);ctx.lineTo(-30,y0+34);ctx.lineTo(-12,y0+42);ctx.lineTo(sh*0.3,-352);ctx.lineTo(sh*0.4,-256);ctx.stroke();
    ctx.beginPath();ctx.moveTo(17,y0);ctx.lineTo(30,y0+34);ctx.lineTo(12,y0+42);ctx.lineTo(1+sh*0.3,-352);ctx.stroke();
    ell(ctx,4+sh*0.35,-318,3.2,3.2);ctx.fillStyle=rgba(darken(c,0.45),0.9);ctx.fill();
    if(T.kind==="suit"){ctx.beginPath();ctx.moveTo(-sw+18,-338);ctx.lineTo(-sw+44,-338);ctx.strokeStyle=rgba(darken(c,0.5),0.6);ctx.stroke();}}
  else if(T.kind==="cardigan"){inner([[-16,y0-2],[16,y0-2],[9+sh*0.4,-250],[-9+sh*0.4,-250]]);
    ctx.fillStyle=rgba(lighten(c,0.35),0.9);for(let i=0;i<4;i++){ell(ctx,-12+sh*0.4,-392+i*34,2.6,2.6);ctx.fill();}
    ctx.strokeStyle=rgba(darken(c,0.4),0.6);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-sw+10,-262);ctx.lineTo(sw+sh,-262);ctx.stroke();}
  else if(T.kind==="overshirt"){inner([[-19,y0-2],[19,y0-2],[13+sh*0.4,-250],[-13+sh*0.4,-250]]);
    ctx.fillStyle=rgba(darken(c,0.25),1);ctx.beginPath();ctx.moveTo(-19,y0);ctx.lineTo(-34,y0+26);ctx.lineTo(-15,y0+22);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(19,y0);ctx.lineTo(34,y0+26);ctx.lineTo(15,y0+22);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(darken(c,0.3),0.8);for(const s of [-1,1]){ctx.beginPath();rr(ctx,s*40-12,-392,24,20,3);ctx.fill();}}
  else if(T.kind==="shirt"){ctx.strokeStyle=rgba(darken(c,0.35),0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sh*0.2,y0+8);ctx.lineTo(sh*0.4,-256);ctx.stroke();
    ctx.fillStyle=rgba(darken(c,0.4),0.85);for(let i=0;i<5;i++){ell(ctx,3+sh*0.3,-420+i*34,2,2);ctx.fill();}
    ctx.fillStyle=rgba(lighten(c,0.12),1);for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*4,y0+2);ctx.lineTo(s*22,y0-4);ctx.lineTo(s*20,y0+18);ctx.closePath();ctx.fill();seam(ctx,c,0.4,1.2);}}
  else if(T.kind==="sweater"){ctx.strokeStyle=rgba(darken(c,0.3),0.8);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-18,y0);ctx.quadraticCurveTo(0,y0+18,18,y0);ctx.stroke();
    ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-sw,-260);ctx.lineTo(sw+sh,-260);ctx.stroke();
    ctx.strokeStyle=rgba(darken(c,0.2),0.18);ctx.lineWidth=1;for(let x=-54;x<=54;x+=12){ctx.beginPath();ctx.moveTo(x,-400);ctx.lineTo(x+sh*0.3,-266);ctx.stroke();}}
  if(P.lanyard){ctx.strokeStyle=rgba(P.lanyard,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-12,y0+2);ctx.lineTo(-4+sh*0.3,-346);ctx.lineTo(4+sh*0.3,-346);ctx.lineTo(12,y0+2);ctx.stroke();
    ctx.fillStyle="rgba(236,243,255,0.92)";ctx.beginPath();rr(ctx,-13+sh*0.3,-346,26,34,4);ctx.fill();ctx.fillStyle=rgba(P.lanyard,0.9);ctx.fillRect(-9+sh*0.3,-340,18,6);}
  ctx.restore();}
function arm(ctx,P,s,a,br,po){const sw=P.build.sh,T=P.top,sx=s*(sw-12),sy=-416+br,L1=108,L2=100;
  const e=[sx+s*Math.sin(a[0])*L1,sy+Math.cos(a[0])*L1],w=[e[0]+s*Math.sin(a[1])*L2,e[1]+Math.cos(a[1])*L2];
  const d=[s*Math.sin(a[1]),Math.cos(a[1])],box=[-sw-60,-450,sw+60,-200];
  if(T.rolled){limb(ctx,[[sx,sy],e,[e[0]+d[0]*28,e[1]+d[1]*28]],31,28,T.c,box);limb(ctx,[[e[0]+d[0]*26,e[1]+d[1]*26],w],23,21,P.skin,box);
    ctx.lineCap="butt";ctx.strokeStyle=rgba(darken(T.c,0.5),0.5);ctx.lineWidth=33;ctx.beginPath();ctx.moveTo(e[0]+d[0]*19,e[1]+d[1]*19);ctx.lineTo(e[0]+d[0]*35,e[1]+d[1]*35);ctx.stroke();
    ctx.strokeStyle=rgba(lighten(T.c,0.12),1);ctx.lineWidth=31;ctx.beginPath();ctx.moveTo(e[0]+d[0]*20,e[1]+d[1]*20);ctx.lineTo(e[0]+d[0]*34,e[1]+d[1]*34);ctx.stroke();}
  else{limb(ctx,[[sx,sy],e,w],31,26,T.c,box);
    ctx.lineCap="butt";ctx.strokeStyle=rgba(darken(T.c,0.3),0.9);ctx.lineWidth=27;ctx.beginPath();ctx.moveTo(w[0]-d[0]*10,w[1]-d[1]*10);ctx.lineTo(w[0]-d[0]*4,w[1]-d[1]*4);ctx.stroke();}
  const h=[w[0]+d[0]*13,w[1]+d[1]*13],ang=Math.atan2(d[1],d[0])-Math.PI/2;
  if(po.hold==="phone"&&s===1){phoneInHand(ctx,P,h,ang);return;}
  ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(ang);
  if(po.hand==="open"&&s===1){ // an open palm, facing us
    for(let i=0;i<4;i++){ctx.save();ctx.rotate((i-1.5)*0.16);ell(ctx,0,15,4.6,11);litFill(ctx,P.skin,-8,0,8,26);ctx.restore();}
    ell(ctx,0,2,13,14);litFill(ctx,P.skin,-14,-14,14,14);ell(ctx,-s*13,-2,5,10,s*0.7);litFill(ctx,P.skin,-18,-12,-6,8);}
  else{ell(ctx,0,2,12,15);litFill(ctx,P.skin,-12,-13,12,17);seam(ctx,P.skin,0.3,1.2);ell(ctx,-s*9,-4,4.5,8,s*0.35);litFill(ctx,P.skin,-14,-12,-4,4);}
  ctx.restore();}
function phoneInHand(ctx,P,h,ang){ctx.save();ctx.translate(h[0]-4,h[1]-8);ctx.rotate(-0.22);
  ell(ctx,0,16,13,15);litFill(ctx,P.skin,-13,0,13,32);
  ctx.save();ctx.shadowColor=rgba(TECH,0.9);ctx.shadowBlur=16;ctx.beginPath();rr(ctx,-19,-40,38,66,6);ctx.fillStyle="#0c1426";ctx.fill();ctx.restore();
  ctx.beginPath();rr(ctx,-16,-36,32,58,4);const g=ctx.createLinearGradient(0,-36,0,22);g.addColorStop(0,"rgba(150,210,255,0.95)");g.addColorStop(1,"rgba(60,110,190,0.95)");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="rgba(255,120,100,0.95)";ctx.beginPath();rr(ctx,-12,-30,24,8,2);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";for(let i=0;i<3;i++){ctx.fillRect(-12,-16+i*8,24-i*6,3);}
  ell(ctx,-15,6,5,9,0.5);litFill(ctx,P.skin,-20,-4,-10,14);ell(ctx,15,2,5,12,-0.2);litFill(ctx,P.skin,10,-10,20,14);
  ctx.restore();}

/* ---- head ---- */
function headPath(ctx){ctx.beginPath();ctx.moveTo(0,-56);ctx.bezierCurveTo(27,-56,42,-40,42,-12);ctx.bezierCurveTo(42,12,37,28,25,40);ctx.bezierCurveTo(16,48,8,51,0,51);
  ctx.bezierCurveTo(-8,51,-16,48,-25,40);ctx.bezierCurveTo(-37,28,-42,12,-42,-12);ctx.bezierCurveTo(-42,-40,-27,-56,0,-56);ctx.closePath();}
function bumpy(ctx,cx,cy,rx,ry,a0,a1,n,amp,phase){ // an outline with soft bumps, for coily and curly hair
  for(let i=0;i<=n;i++){const a=lerp(a0,a1,i/n),r=1+amp*Math.sin(i*2.1+phase)*0.5+amp*0.5*Math.abs(Math.sin(i*1.3+phase*2));
    const x=cx+Math.cos(a)*rx*r,y=cy+Math.sin(a)*ry*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}}
function hairBack(ctx,P){const H=P.hair;if(!H)return;const c=H.c;
  if(H.style==="bob"){ctx.beginPath();ctx.moveTo(-47,-20);ctx.bezierCurveTo(-54,-72,54,-72,47,-20);ctx.bezierCurveTo(52,10,52,34,44,44);ctx.quadraticCurveTo(30,50,22,40);ctx.lineTo(-22,40);ctx.quadraticCurveTo(-30,50,-44,44);ctx.bezierCurveTo(-52,34,-52,10,-47,-20);ctx.closePath();litFill(ctx,c,-50,-70,50,50);}
  if(H.style==="bun"){ell(ctx,0,-66,19,16);litFill(ctx,c,-19,-82,19,-50);seam(ctx,c,0.4);}
  if(H.style==="curly"){ctx.beginPath();bumpy(ctx,0,-8,62,70,Math.PI*0.72,Math.PI*2.28,34,0.13,P.seed);ctx.quadraticCurveTo(0,86,-44,54);ctx.closePath();litFill(ctx,c,-60,-80,60,70);
    ctx.fillStyle=rgba(lighten(c,0.18),0.5);for(let i=0;i<40;i++){const a=hash(i,P.seed)*TAU,r=30+hash(i,9)*30;ell(ctx,Math.cos(a)*r,-8+Math.sin(a)*r*1.1,3,2,a);ctx.fill();}}}
function hairFront(ctx,P){const H=P.hair;if(!H)return;const c=H.c;
  if(H.style==="coily"){ctx.beginPath();bumpy(ctx,0,-22,46,38,Math.PI*1.02,Math.PI*1.98,26,0.07,P.seed);ctx.bezierCurveTo(42,-14,36,-30,24,-32);ctx.quadraticCurveTo(0,-38,-24,-32);ctx.bezierCurveTo(-36,-30,-42,-14,-45,-24);ctx.closePath();litFill(ctx,c,-46,-64,46,-20);
    ctx.save();ctx.clip();ctx.fillStyle=rgba(lighten(c,0.22),0.55);for(let i=0;i<60;i++){ell(ctx,(hash(i,3)-0.5)*90,-62+hash(i,5)*34,1.8,1.5);ctx.fill();}ctx.restore();}
  if(H.style==="bob"){ctx.beginPath();ctx.moveTo(-44,-14);ctx.bezierCurveTo(-48,-58,-10,-66,8,-58);ctx.bezierCurveTo(34,-54,48,-34,44,-6);ctx.quadraticCurveTo(30,-36,4,-34);ctx.quadraticCurveTo(-22,-30,-32,-20);ctx.quadraticCurveTo(-38,4,-40,24);ctx.closePath();litFill(ctx,c,-46,-64,46,20);
    ctx.save();ctx.clip();ctx.strokeStyle=rgba(H.streak,0.45);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-4,-60);ctx.quadraticCurveTo(12,-44,30,-34);ctx.stroke();ctx.restore();}
  if(H.style==="bun"){ctx.beginPath();ctx.moveTo(-44,-8);ctx.bezierCurveTo(-48,-80,48,-80,44,-8);ctx.quadraticCurveTo(34,-30,2,-38);ctx.lineTo(-2,-38);ctx.quadraticCurveTo(-34,-30,-43,-8);ctx.closePath();litFill(ctx,c,-46,-62,46,-8);
    ctx.strokeStyle=rgba(lighten(c,0.25),0.5);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(0,-38);ctx.stroke();}
  if(H.style==="side"){ctx.beginPath();ctx.moveTo(-44,-6);ctx.bezierCurveTo(-50,-84,34,-90,47,-30);ctx.lineTo(44,-8);ctx.quadraticCurveTo(38,-30,26,-38);ctx.quadraticCurveTo(-10,-30,-30,-38);ctx.quadraticCurveTo(-40,-26,-43,-6);ctx.closePath();litFill(ctx,c,-46,-66,46,-6);
    ctx.save();ctx.clip();ctx.strokeStyle=rgba(lighten(c,0.3),0.5);ctx.lineWidth=1.4;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-26+i*10,-56+i);ctx.quadraticCurveTo(-6+i*10,-60,16+i*8,-44);ctx.stroke();}ctx.restore();}
  if(H.style==="curly"){ctx.beginPath();bumpy(ctx,0,-24,48,36,Math.PI*1.0,Math.PI*2.0,24,0.16,P.seed+1);ctx.quadraticCurveTo(30,-26,6,-34);ctx.quadraticCurveTo(-24,-30,-48,-24);ctx.closePath();litFill(ctx,c,-50,-66,50,-20);}
  if(H.style==="cropped"){ctx.beginPath();ctx.moveTo(-43,-16);ctx.bezierCurveTo(-46,-79,46,-79,43,-16);ctx.quadraticCurveTo(38,-36,24,-40);ctx.quadraticCurveTo(0,-46,-24,-40);ctx.quadraticCurveTo(-38,-36,-42,-16);ctx.closePath();
    ctx.fillStyle=rgba(c,0.9);ctx.fill();ctx.save();ctx.clip();ctx.fillStyle=rgba(darken(c,0.3),0.45);for(let i=0;i<70;i++){const x=(hash(i,4)-0.5)*84,y=-58+hash(i,6)*24;ell(ctx,x,y,1.2,1.2);ctx.fill();}ctx.restore();}}
function hijab(ctx,P){const c=P.hijab;ctx.beginPath();ctx.moveTo(0,-70);ctx.bezierCurveTo(40,-70,58,-40,56,-4);ctx.bezierCurveTo(56,34,70,70,86,98);ctx.quadraticCurveTo(40,126,0,128);ctx.quadraticCurveTo(-40,126,-86,98);
  ctx.bezierCurveTo(-70,70,-56,34,-56,-4);ctx.bezierCurveTo(-58,-40,-40,-70,0,-70);ctx.closePath();
  ctx.moveTo(0,-46);ctx.bezierCurveTo(-24,-46,-36,-28,-36,-4);ctx.bezierCurveTo(-36,24,-24,46,0,50);ctx.bezierCurveTo(24,46,36,24,36,-4);ctx.bezierCurveTo(36,-28,24,-46,0,-46);ctx.closePath();
  const g=ctx.createLinearGradient(-60,-70,60,120);g.addColorStop(0,rgba(lighten(c,0.2),1));g.addColorStop(1,rgba(darken(c,0.3),1));ctx.fillStyle=g;ctx.fill("evenodd");
  ctx.strokeStyle=rgba(darken(c,0.5),0.5);ctx.lineWidth=1.6;ctx.stroke();
  ctx.strokeStyle=rgba(lighten(c,0.25),0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-40,40);ctx.quadraticCurveTo(-10,90,40,96);ctx.stroke();ctx.beginPath();ctx.moveTo(-30,60);ctx.quadraticCurveTo(0,100,30,110);ctx.stroke();}
function beard(ctx,P){const c=P.beard;ctx.beginPath();ctx.moveTo(-42,0);ctx.bezierCurveTo(-42,22,-34,40,-24,46);ctx.bezierCurveTo(-14,55,14,55,24,46);ctx.bezierCurveTo(34,40,42,22,42,0);
  ctx.lineTo(36,4);ctx.quadraticCurveTo(28,14,14,16);ctx.quadraticCurveTo(0,13,-14,16);ctx.quadraticCurveTo(-28,14,-36,4);ctx.closePath();ctx.fillStyle=rgba(c,0.94);ctx.fill();
  ctx.fillStyle=rgba(lighten(c,0.2),0.35);for(let i=0;i<50;i++){const a=hash(i,2)*Math.PI,r=30+hash(i,8)*14;ell(ctx,Math.cos(a)*r*0.9,14+Math.sin(a)*r*0.8,1.2,1.2);ctx.fill();}}
function face(ctx,P,E,po,t){const fx=po.turn*7,ly=po.look*3,dark=[30,26,34];
  // blinking: a quick close every few seconds, at a different moment for each person
  const bt=(t+P.seed*1.37)%4.3,blink=bt<0.14?Math.abs(bt-0.07)/0.07:1,open=E.eye*blink*(po.look?0.78:1);
  const skinDark=P.skin[0]+P.skin[1]<250;
  if(!skinDark){ctx.fillStyle="rgba(230,120,110,0.14)";for(const s of [-1,1]){ell(ctx,s*23+fx,12,10,7);ctx.fill();}}
  for(const s of [-1,1]){const ex=s*15+fx,ey=-5+ly;
    if(open<0.22||E.happy&&open<0.7){ctx.strokeStyle=rgba(dark,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();
      if(E.happy){ctx.moveTo(ex-6,ey+1);ctx.quadraticCurveTo(ex,ey-6,ex+6,ey+1);}else{ctx.moveTo(ex-6,ey);ctx.quadraticCurveTo(ex,ey+2,ex+6,ey);}ctx.stroke();}
    else{ell(ctx,ex+po.gaze[0]*1.5,ey+po.gaze[1]*1.5,4.9,6.4*open);ctx.fillStyle=rgba(dark,1);ctx.fill();
      ell(ctx,ex+po.gaze[0]*1.5-1.6,ey+po.gaze[1]*1.5-2.2*open,1.5,1.5);ctx.fillStyle="rgba(255,255,255,0.9)";ctx.fill();
      ctx.strokeStyle=rgba(darken(P.skin,0.45),0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(ex-7,ey-6.5*open-0.5);ctx.quadraticCurveTo(ex,ey-8.8*open-1,ex+7,ey-6.5*open-0.5);ctx.stroke();}
    // brows
    const ix=s*(8-(E.knit||0))+fx,ox=s*25+fx,by=-19+ly*0.6;ctx.strokeStyle=rgba(P.hair?darken(P.hair.c,0.1):P.hijab?[40,30,30]:dark,0.92);ctx.lineWidth=3.6;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(ix,by+E.bi);ctx.quadraticCurveTo((ix+ox)/2,by+E.arch+Math.min(E.bi,E.bo)*0.5,ox,by+E.bo+1);ctx.stroke();}
  // nose
  ctx.strokeStyle=rgba(darken(P.skin,0.4),0.55);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(fx*1.3+1,3+ly);ctx.quadraticCurveTo(fx*1.3+5,12+ly,fx*1.3-2,15+ly);ctx.stroke();
  if(P.beard)beard(ctx,P);
  // mouth
  const mw=E.mw/2,my=27+ly*0.5,mx=fx*1.1;
  if(E.open>0){ctx.beginPath();ctx.moveTo(mx-mw,my);ctx.quadraticCurveTo(mx,my+E.smile*3,mx+mw,my);ctx.quadraticCurveTo(mx,my+E.smile*6+E.open*14,mx-mw,my);ctx.closePath();ctx.fillStyle="rgba(92,34,40,0.95)";ctx.fill();
    ctx.save();ctx.clip();ctx.fillStyle="rgba(250,248,244,0.95)";ctx.fillRect(mx-mw,my-2,mw*2,4.5);ctx.restore();}
  else{ctx.strokeStyle=rgba(darken(P.skin,0.55),0.85);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(mx-mw,my-E.smile*1.5);ctx.quadraticCurveTo(mx,my+E.smile*6,mx+mw,my-E.smile*1.5);ctx.stroke();}
  if(P.glasses){ctx.strokeStyle=rgba(P.glasses,0.95);ctx.lineWidth=2.4;for(const s of [-1,1]){ell(ctx,s*15+fx,-4+ly,11.5,10.5);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-4+fx,-6+ly);ctx.quadraticCurveTo(fx,-9+ly,4+fx,-6+ly);ctx.stroke();ctx.beginPath();ctx.moveTo(-26+fx,-7+ly);ctx.lineTo(-40,-9);ctx.moveTo(26+fx,-7+ly);ctx.lineTo(40,-9);ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=1.6;for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*15+fx,-4+ly,8,-2.6,-1.8);ctx.stroke();}}}
function head(ctx,P,E,po,t){
  if(P.hijab){}else hairBack(ctx,P);
  if(!P.hijab&&P.hair.style!=="bob"&&P.hair.style!=="curly")for(const s of [-1,1]){ell(ctx,s*42,0,7,11);litFill(ctx,P.skin,-50,-12,50,12);seam(ctx,P.skin,0.25,1.2);}
  headPath(ctx);litFill(ctx,P.skin,-42,-56,42,51);seam(ctx,P.skin,0.3,1.4);
  face(ctx,P,E,po,t);
  if(P.earrings){ctx.fillStyle=rgba(P.earrings,1);for(const s of [-1,1]){ell(ctx,s*43,13,2.8,2.8);ctx.fill();}}
  if(P.hijab)hijab(ctx,P);else hairFront(ctx,P);
  if(po.hold==="phone"){const g=ctx.createRadialGradient(0,50,4,0,40,90);g.addColorStop(0,"rgba(120,200,255,0.22)");g.addColorStop(1,"rgba(120,200,255,0)");ctx.fillStyle=g;headPath(ctx);ctx.fill();}}

/* ---- a whole person, with a luminous outline ---- */
const PCV={};
function pcanvas(k,w,h){const c=PCV[k]||(PCV[k]=document.createElement("canvas"));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,w,h);return[c,x];}
function outlined(ctx,draw,x,y,s,edge,box,glowA){ // draws into a spare canvas, then adds a thin glowing outline around the silhouette
  const [x0,y0,x1,y1]=box,pad=12,w=Math.ceil((x1-x0)*s+pad*2),h=Math.ceil((y1-y0)*s+pad*2);
  const [c,cx]=pcanvas("p",w,h);cx.translate(pad-x0*s,pad-y0*s);cx.scale(s,s);draw(cx);
  const [tc,tx]=pcanvas("t",w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(edge,1);tx.fillRect(0,0,w,h);tx.globalCompositeOperation="source-over";
  const ox=x+x0*s-pad,oy=y+y0*s-pad,r=Math.max(1,1.25*s);
  ctx.save();ctx.shadowColor=rgba(edge,glowA==null?0.4:glowA);ctx.shadowBlur=12*Math.max(0.7,s);ctx.globalAlpha=0.65;ctx.drawImage(tc,ox,oy);ctx.restore();
  ctx.save();ctx.globalAlpha=0.85;for(let i=0;i<8;i++){const a=i/8*TAU;ctx.drawImage(tc,ox+Math.cos(a)*r,oy+Math.sin(a)*r);}ctx.restore();
  ctx.drawImage(c,ox,oy);}
function person(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],po=POSE[o.pose||"stand"],E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h;
  const br=Math.sin(t*1.7+P.seed)*1.4;
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,"rgba(0,0,0,0.45)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();
  const front=a=>a[1]>Math.PI*0.8;
  outlined(ctx,cx=>{
    if(!front(po.L))arm(cx,P,-1,po.L,br,po);if(!front(po.R))arm(cx,P,1,po.R,br,po);
    legs(cx,P,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);
    torso(cx,P,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt);cx.translate(0,-50+po.look*2);head(cx,P,E,po,t);cx.restore();
    if(front(po.L))arm(cx,P,-1,po.L,br,po);if(front(po.R))arm(cx,P,1,po.R,br,po);
  },x,y,k,P.edge,[-250,-650,250,10],o.glow);}
function personBack(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],k=s*P.build.h,sw=P.build.sh,t=o.t||0,br=Math.sin(t*1.7+P.seed)*1.4;
  outlined(ctx,cx=>{
    limb(cx,[[-sw+6,-410],[-sw-6,-300]],32,30,darken(P.top.c,0.2),[-sw,-420,0,-300]);limb(cx,[[sw-6,-410],[sw+4,-300]],32,30,darken(P.top.c,0.2),[0,-420,sw,-300]);
    torsoPath(cx,P,br,0);litFill(cx,darken(P.top.c,0.15),-sw,-450,sw,-250);seam(cx,P.top.c,0.5);
    cx.strokeStyle=rgba(darken(P.top.c,0.45),0.6);cx.lineWidth=2;cx.beginPath();cx.moveTo(-24,-446+br);cx.quadraticCurveTo(0,-432+br,24,-446+br);cx.stroke();
    limb(cx,[[0,-472+br],[0,-446+br]],28,28,darken(P.skin,0.2),[-20,-470,20,-440]);
    cx.save();cx.translate(0,-502+br);
    for(const s of [-1,1]){ell(cx,s*41,2,7,11);litFill(cx,darken(P.skin,0.1),-50,-12,50,12);}
    headPath(cx);litFill(cx,darken(P.skin,0.1),-42,-56,42,51);
    cx.beginPath();bumpy(cx,0,-8,46,54,Math.PI*0.86,Math.PI*2.14,40,0.06,P.seed);cx.quadraticCurveTo(20,42,0,44);cx.quadraticCurveTo(-20,42,-40,30);cx.closePath();litFill(cx,P.hair.c,-46,-64,46,44);
    cx.fillStyle=rgba(lighten(P.hair.c,0.22),0.5);for(let i=0;i<70;i++){const a=hash(i,3)*TAU,r=hash(i,5)*40;cx.beginPath();cx.ellipse(Math.cos(a)*r,-10+Math.sin(a)*r,1.8,1.5,0,0,TAU);cx.fill();}
    if(P.glasses){cx.strokeStyle=rgba(P.glasses,0.9);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(-40,-8);cx.lineTo(-46,-2);cx.moveTo(40,-8);cx.lineTo(46,-2);cx.stroke();}
    cx.restore();
  },x,y,k,o.edge||P.edge,[-140,-580,140,-240],o.glow);}
