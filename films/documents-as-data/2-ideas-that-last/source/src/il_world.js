/* ===== Ideas that last, features you test: the film's own world, Jaipur, the 1960s =====
   The film draws with the module's look (films/data-that-moves/shared/README.md); these are its own pictures, each name starting
   with il_ or IL_. The opening is lit by a late afternoon sun through a high arched window, on the module's navy: the limb workshop
   of Jaipur's hospital (ilWork), painted once with its sandstone walls, its window and the light falling from it, a shelf of moulds and
   a long workbench; on the bench, drawn live, two feet seen from the side: the one made to a design from abroad, stiff, in a shoe
   (il_footShoe), and the one the workshop made, of rubber over a wooden core on an aluminium leg, shaped like a bare foot, its front
   bending as a foot does (il_footBare).
     the place       the Sawai Man Singh Hospital, Jaipur, where Sethi led the orthopaedics department of the medical college; the room is
                     imagined from that: a workshop at the hospital, its walls of the city's sandstone, a high window with a stone screen
     the people      the surgeon Pramod Karan Sethi, in the white coat over shirt and tie of a 1960s hospital doctor, and the craftsman
                     Ram Chandra Sharma, older, in a plain cotton kurta (IL_P); neither waves a hand: the feet on the bench are the story
   Every word is at least 28 px as seen, or marked as decoration; none but the captions below y 890. */

const IL={wall:[150,92,78],wallHi:[214,150,112],wallDk:[62,36,40],sun:[255,196,130],wood:[118,78,50],woodHi:[168,118,78],woodDk:[56,36,26],
  rubber:[186,138,104],rubberHi:[226,184,146],rubberDk:[118,80,58],metal:[176,184,196],metalDk:[96,104,118],shoe:[34,30,34],shoeHi:[92,84,92],sole:[20,18,20]};
const il_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const il_k=(tt,t0)=>clamp(tt-t0,0,1);
// screen space inside a shot: what's drawn here stays put while the camera moves
function il_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);try{fn();}finally{ctx.restore();}}

/* ---------------------------------------------------------------- the workshop */
// the room, painted once: sandstone walls warm where the sun falls, a high arched window at the right with its stone screen, the light
// falling from it across the room, a shelf of moulds and tools on the back wall, and the long workbench across the front
function il_paintWork(c){let g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,"#1a1020");g.addColorStop(0.5,"#3a2228");g.addColorStop(1,"#120a0c");c.fillStyle=g;c.fillRect(0,0,1920,1080);
  // the wall's stone courses, faint
  c.strokeStyle="rgba(214,150,112,0.07)";c.lineWidth=2;for(let y=60;y<760;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(1920,y);c.stroke();
    const r=ag_rnd(y);for(let x=(y/64%2)*90;x<1920;x+=180+r()*20){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+64);c.stroke();}}
  // the sun's warmth on the wall, round the window and where its light lands
  for(const [x,y,rad,al] of [[1600,300,620,0.30],[760,560,700,0.18]]){const q=c.createRadialGradient(x,y,10,x,y,rad);q.addColorStop(0,rgba(IL.wallHi,al));q.addColorStop(1,rgba(IL.wallHi,0));c.fillStyle=q;c.fillRect(0,0,1920,1080);}
  // the arched window, its deep reveal, and a stone screen of small eight-sided openings, the sky warm behind it
  const wx=1480,wy=150,ww=240,wh=340,arch=(o)=>{c.beginPath();c.moveTo(wx-o,wy+wh+o);c.lineTo(wx-o,wy+ww/2);c.arc(wx+ww/2,wy+ww/2,ww/2+o,Math.PI,0);c.lineTo(wx+ww+o,wy+wh+o);c.closePath();};
  arch(26);c.fillStyle=rgba(IL.wallDk,0.9);c.fill();arch(0);g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#ffd9a0");g.addColorStop(1,"#f0a070");c.fillStyle=g;c.fill();
  c.save();arch(0);c.clip();c.fillStyle=rgba(IL.wall,1);c.fillRect(wx-10,wy-10,ww+20,wh+20);c.globalCompositeOperation="destination-out";
  for(let y=wy+14;y<wy+wh;y+=30)for(let x=wx+12+((y-wy)/30%2)*15;x<wx+ww;x+=30){c.beginPath();for(let k=0;k<8;k++){const an=k/8*TAU+Math.PI/8;c.lineTo(x+Math.cos(an)*10,y+Math.sin(an)*10);}c.closePath();c.fill();}
  c.restore();c.save();arch(0);c.clip();c.globalCompositeOperation="destination-over";g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#ffe2b0");g.addColorStop(1,"#f6a676");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);c.restore();
  // the window's light: a soft shaft falling to the right, onto the bench
  c.save();c.globalCompositeOperation="lighter";const sh=c.createLinearGradient(1500,300,720,800);sh.addColorStop(0,"rgba(255,190,130,0.16)");sh.addColorStop(1,"rgba(255,190,130,0)");
  c.fillStyle=sh;c.beginPath();c.moveTo(wx,wy+40);c.lineTo(wx+ww,wy+80);c.lineTo(1180,760);c.lineTo(420,760);c.closePath();c.fill();c.restore();
  // a shelf on the back wall: feet drying on it, a few moulds, a coil of rubber strip
  c.fillStyle=rgba(IL.woodDk,1);c.fillRect(160,300,700,16);c.fillStyle=rgba(IL.wood,0.8);c.fillRect(160,296,700,6);
  for(let i=0;i<5;i++){const x=210+i*92;il_footShape(c,x,296,46,{fill:mix(IL.rubberDk,IL.wallDk,0.35),hi:mix(IL.rubber,IL.wallDk,0.4),flip:i%2===1});}
  c.fillStyle=rgba(mix(IL.woodDk,IL.wallDk,0.3),1);rr(c,690,236,70,60,6);c.fill();rr(c,770,250,60,46,6);c.fill();
  c.strokeStyle=rgba(mix(IL.rubberDk,IL.wallDk,0.4),1);c.lineWidth=7;for(let k=0;k<3;k++){c.beginPath();c.ellipse(700+k*4,370,40-k*6,12-k*2,0,0,TAU);c.stroke();}
  // tools hanging on the wall: a saw and a rasp, in silhouette
  c.fillStyle=rgba(mix(IL.metalDk,IL.wallDk,0.5),1);c.beginPath();c.moveTo(1060,180);c.lineTo(1200,200);c.lineTo(1200,236);c.lineTo(1060,214);c.closePath();c.fill();
  c.fillStyle=rgba(mix(IL.woodDk,IL.wallDk,0.2),1);rr(c,1020,176,48,44,10);c.fill();rr(c,1300,250,14,120,6);c.fill();
  // the workbench: a thick top lit along its front edge, its face going down into the dark
  g=c.createLinearGradient(0,742,0,790);g.addColorStop(0,rgba(IL.woodHi,1));g.addColorStop(1,rgba(IL.wood,1));c.fillStyle=g;c.fillRect(0,742,1920,48);
  c.fillStyle=rgba(IL.woodDk,1);c.fillRect(0,790,1920,290);c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;for(let x=0;x<1920;x+=240){c.beginPath();c.moveTo(x,800);c.lineTo(x,1080);c.stroke();}
  const sb=c.createRadialGradient(900,760,10,900,760,700);sb.addColorStop(0,"rgba(255,190,130,0.20)");sb.addColorStop(1,"rgba(255,190,130,0)");c.fillStyle=sb;c.fillRect(0,700,1920,120);
  const v=c.createRadialGradient(960,520,380,960,540,1250);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.6)");c.fillStyle=v;c.fillRect(0,0,1920,1080);}
AG_PLACES.ilWork=c=>il_paintWork(c);

/* ---------------------------------------------------------------- the feet */
// a bare foot seen from its side, its heel at (x, y) on the ground, length L: an ankle rising behind, the heel's round, the sole flat,
// the arch lifted, the ball, and the toes; o.flex (0 to 1) bends the front up at the ball, as a foot does when its owner squats.
// Facing right; o.flip faces it left. Filled with o.fill, lit along its top with o.hi
function il_footShape(c,x,y,L,o){o=o||{};const f=o.flex||0,s=o.flip?-1:1,u=L/100;c.save();c.translate(x,y);c.scale(s*u,u);
  const ball=[72,0],an=-f*0.5,rot=(p)=>{const dx=p[0]-ball[0],dy=p[1]-ball[1];return [ball[0]+dx*Math.cos(an)-dy*Math.sin(an),ball[1]+dx*Math.sin(an)+dy*Math.cos(an)];};
  const toe=[rot([100,-2]),rot([102,-10]),rot([96,-18]),rot([80,-22])];
  c.beginPath();c.moveTo(14,-60);c.bezierCurveTo(12,-40,4,-30,2,-18);c.bezierCurveTo(-2,-8,2,0,14,0);c.lineTo(30,0);c.bezierCurveTo(40,-6,54,-6,64,0);c.lineTo(ball[0],ball[1]);
  c.lineTo(toe[0][0],toe[0][1]);c.quadraticCurveTo(toe[1][0],toe[1][1],toe[2][0],toe[2][1]);c.lineTo(toe[3][0],toe[3][1]);c.bezierCurveTo(60,-26,40,-36,34,-60);c.closePath();
  c.fillStyle=rgba(o.fill||IL.rubber,1);c.fill();
  if(o.hi){c.strokeStyle=rgba(o.hi,0.85);c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(34,-58);c.bezierCurveTo(40,-36,60,-26,toe[3][0],toe[3][1]);c.stroke();}
  if(o.toes){c.strokeStyle=rgba(o.toes,0.6);c.lineWidth=1.6;for(let k=0;k<3;k++){const p=rot([84+k*6,-20+k*2]),q=rot([88+k*6,-6]);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();}}
  c.restore();}
// the workshop's foot, standing on the bench at (x, y), size L: an aluminium leg rising from a wooden block hidden in a foot of rubber,
// cured like a tyre's, shaped and coloured like a bare foot; o.flex bends its front; o.a fades it; o.k springs it in (0 to 1)
function il_footBare(c,x,y,L,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  if(o.k!=null){const z=lerp(0.85,1,ag_spr(o.k,0,0.5));c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
  c.fillStyle="rgba(0,0,0,0.35)";c.beginPath();c.ellipse(x+L*0.5,y+4,L*0.6,L*0.06,0,0,TAU);c.fill();
  // the leg: an aluminium tube with a bolt where it meets the foot, and a socket at its top
  const lx=x+L*0.24;let g=c.createLinearGradient(lx-L*0.07,0,lx+L*0.07,0);g.addColorStop(0,rgba(IL.metalDk,1));g.addColorStop(0.4,rgba(IL.metal,1));g.addColorStop(1,rgba(IL.metalDk,1));
  c.fillStyle=g;c.fillRect(lx-L*0.06,y-L*1.5,L*0.12,L*0.95);rr(c,lx-L*0.12,y-L*1.75,L*0.24,L*0.32,L*0.05);c.fill();
  c.fillStyle=rgba(IL.metalDk,1);c.beginPath();c.arc(lx,y-L*0.62,L*0.03,0,TAU);c.fill();
  il_footShape(c,x,y,L,{flex:o.flex||0,fill:IL.rubber,hi:IL.rubberHi,toes:IL.rubberDk});
  if(o.glow)glow(c,x+L*0.5,y-L*0.3,L*0.9,o.glowCol||MD.pass,0.22*o.glow);
  c.restore();}
// the foot made to a design from abroad, at (x, y), size L: a stiff foot in a laced black shoe on a heavy wooden leg; it can't bend
function il_footShoe(c,x,y,L,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  c.fillStyle="rgba(0,0,0,0.35)";c.beginPath();c.ellipse(x+L*0.5,y+4,L*0.62,L*0.06,0,0,TAU);c.fill();
  // the wooden leg, thick, its grain faint
  const lx=x+L*0.26;let g=c.createLinearGradient(lx-L*0.12,0,lx+L*0.12,0);g.addColorStop(0,rgba(IL.woodDk,1));g.addColorStop(0.45,rgba(IL.woodHi,1));g.addColorStop(1,rgba(IL.woodDk,1));
  c.fillStyle=g;c.beginPath();c.moveTo(lx-L*0.11,y-L*1.75);c.lineTo(lx+L*0.11,y-L*1.75);c.lineTo(lx+L*0.09,y-L*0.5);c.lineTo(lx-L*0.09,y-L*0.5);c.closePath();c.fill();
  c.strokeStyle="rgba(40,24,16,0.35)";c.lineWidth=1.5;for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(lx+k*L*0.04,y-L*1.7);c.lineTo(lx+k*L*0.035,y-L*0.55);c.stroke();}
  // the shoe: a heel, a sole, an upper with its laces
  c.fillStyle=rgba(IL.sole,1);c.fillRect(x-L*0.02,y-L*0.07,L*1.08,L*0.07);
  g=c.createLinearGradient(0,y-L*0.6,0,y);g.addColorStop(0,rgba(IL.shoeHi,1));g.addColorStop(1,rgba(IL.shoe,1));c.fillStyle=g;
  c.beginPath();c.moveTo(x,y-L*0.07);c.lineTo(x,y-L*0.5);c.bezierCurveTo(x+L*0.1,y-L*0.58,x+L*0.36,y-L*0.58,x+L*0.42,y-L*0.42);c.bezierCurveTo(x+L*0.6,y-L*0.36,x+L*0.92,y-L*0.3,x+L*1.04,y-L*0.16);
  c.quadraticCurveTo(x+L*1.08,y-L*0.07,x+L*1.0,y-L*0.07);c.closePath();c.fill();
  c.strokeStyle="rgba(220,214,220,0.5)";c.lineWidth=2;for(let k=0;k<4;k++){const px=x+L*(0.44+k*0.07),py=y-L*(0.4-k*0.03);c.beginPath();c.moveTo(px-L*0.03,py-L*0.03);c.lineTo(px+L*0.03,py+L*0.01);c.stroke();}
  c.restore();}
// a cross over a thing that can't be done, drawn as u goes from 0 to 1, in the colour of a harm
function il_cross(c,x,y,r,u,a){if(u<=0||a<=0.004)return;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(MD.fail,0.95);c.lineWidth=6;c.lineCap="round";
  const p=ag_eo(Math.min(1,u*2)),q=ag_eo(clamp(u*2-1,0,1));c.beginPath();c.moveTo(x-r,y-r);c.lineTo(x-r+2*r*p,y-r+2*r*p);if(q>0){c.moveTo(x+r,y-r);c.lineTo(x+r-2*r*q,y-r+2*r*q);}c.stroke();c.restore();}

/* ---------------------------------------------------------------- the people of the workshop */
const IL_P={
  surgeon:{name:"Pramod Karan Sethi",role:"Head of orthopaedics",skin:[176,124,92],hair:{style:"side",c:[34,30,30]},glasses:[40,34,30],top:{kind:"blazer",c:[232,232,226],inner:[214,222,234],tie:[96,70,60]},breath:0.27},
  craftsman:{name:"Ram Chandra Sharma",role:"Craftsman",skin:[168,116,84],hair:{style:"cropped",c:[150,146,140]},top:{kind:"tunic",c:[226,220,204],inner:[236,232,220]},breath:0.29}};
// a person of the workshop, arms down: the feet on the bench are what the story is about
function il_period(ctx,who,x,y,s,o){return md_person(ctx,IL_P[who],x,y,s,o||{});}
