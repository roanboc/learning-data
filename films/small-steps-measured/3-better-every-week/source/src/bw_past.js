/* ===== Better every week: the 1940s =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix bw_). Nothing here is a likeness of a real person or a copy of a photograph or a poster of the time: the factory, the bench and
   the clothes are drawn plainly, from what is known of the place and the time (a hall under a saw-tooth roof of north lights; a
   supervisor in a suit and tie; a worker at the bench in a work blouse and apron, her hair pinned up). The radio shield job is the Job
   Methods course's own demonstration, as its report gives it (Exhibits 9 and 10, 1945): its boxes, its bench, the scale 50 feet off.
     bwHall        the factory under a pale sky, its ground and the roofs beyond: the hall is drawn live on it
     bw_hall       the hall cut open like the module's section of the teaching building: the saw-tooth roof, the lit hall, its benches
     bwFloor       inside the hall: limewash over a painted dado, a steel beam along the top, in the afternoon light
     bwClass       the room where supervisors train, ten at a table, in morning light
     bw_bench      the riveting bench seen from the front: piles of copper and brass sheets, the riveter, a tote box
     bw_plan       the radio shield job from above, on a sheet: the boxes, the bench, the stamp, the scale 50 feet off, and the worker's
                   path, the long way; o.better (0 to 1) turns it into the proposed method
     bw_card       the Job Methods pocket card: its four steps
     bw_breakdown  a breakdown sheet: its details as lines, and how many
     bw_ten        ten at a table, from above, on a small sheet
     BW_PEOPLE     the supervisor and the worker: dressed for their time, never likenesses
   Colour keeps the module's meaning: the method and the card in blue, the better way and what got better in green, the long way and its
   cost in amber; the place, the metals and the clothes wear none of the five. */

const BW_K={sky0:[204,212,216],sky1:[240,232,214],ground:[176,164,146],groundDk:[146,134,118],brick:[170,140,122],brickDk:[132,108,94],
  cut:[84,74,70],hall:[232,222,204],hallDk:[204,190,170],steel:[86,84,88],glass:[226,232,232],bench:[150,118,88],benchDk:[112,86,64],
  copper:[170,128,108],brass:[186,168,118],metal:[150,150,152],dado:[170,160,148],card:[246,242,230]};

/* ---------------------------------------------------------------- the factory, from outside, cut open */
const BW_H={x0:260,x1:1660,floor:800,top:530,teeth:7,peak:110};
AG_PLACES.bwHall=c=>{const R=ag_rnd(1940),gr=BW_H.floor;let g=c.createLinearGradient(0,0,0,gr);g.addColorStop(0,rgba(BW_K.sky0,1));g.addColorStop(1,rgba(BW_K.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,gr);g=c.createRadialGradient(1640,110,20,1640,110,900);g.addColorStop(0,"rgba(255,240,214,0.55)");g.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=g;c.fillRect(0,0,W,gr);
  // other halls far off, low and pale, and a water tower on its legs
  c.fillStyle=rgba(mix(BW_K.sky1,BW_K.brickDk,0.32),1);for(let x=-40;x<W;x+=150+R()*110){const h=50+R()*70,w=110+R()*90;c.fillRect(x,gr-h,w,h);
    for(let k=0;k<3;k++){c.beginPath();c.moveTo(x+k*w/3,gr-h);c.lineTo(x+(k+1)*w/3,gr-h-18);c.lineTo(x+(k+1)*w/3,gr-h);c.closePath();c.fill();}}
  c.fillStyle=rgba(mix(BW_K.sky1,BW_K.steel,0.4),1);c.fillRect(1760,gr-300,8,300);c.fillRect(1826,gr-300,8,300);rr(c,1740,gr-380,114,84,10);c.fill();c.beginPath();c.moveTo(1732,gr-378);c.lineTo(1797,gr-424);c.lineTo(1862,gr-378);c.closePath();c.fill();
  g=c.createLinearGradient(0,gr,0,H);g.addColorStop(0,rgba(BW_K.ground,1));g.addColorStop(1,rgba(BW_K.groundDk,1));c.fillStyle=g;c.fillRect(0,gr,W,H-gr);
  c.fillStyle=rgba(LP.shade,0.12);c.fillRect(0,gr,W,6);};
// one bench seen from the side, inside the hall: a top on two legs, a box or two on it
function bw_sideBench(c,x,y,w,R){c.fillStyle=rgba(BW_K.benchDk,1);c.fillRect(x+10,y,10,BW_H.floor-y);c.fillRect(x+w-20,y,10,BW_H.floor-y);c.fillStyle=rgba(BW_K.bench,1);c.fillRect(x,y-12,w,12);
  for(let k=0;k<3;k++){const bx=x+20+R()*(w-90),bw=30+R()*30,bh=16+R()*16;c.fillStyle=rgba(mix(BW_K.bench,BW_K.metal,0.5),1);c.fillRect(bx,y-12-bh,bw,bh);}}
function bw_hall(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const B=BW_H,top=B.top,gr=B.floor,tw=(B.x1-B.x0)/B.teeth;ctx.save();ctx.globalAlpha*=a;
  // the hall inside, lit, and the light falling from each north light
  let g=ctx.createLinearGradient(0,top,0,gr);g.addColorStop(0,rgba(BW_K.hall,1));g.addColorStop(1,rgba(BW_K.hallDk,1));ctx.fillStyle=g;ctx.fillRect(B.x0,top,B.x1-B.x0,gr-top);
  g=ctx.createLinearGradient(B.x0,0,B.x1,0);g.addColorStop(0,rgba(LP.shade,0.12));g.addColorStop(1,rgba(LP.sun,0.14));ctx.fillStyle=g;ctx.fillRect(B.x0,top,B.x1-B.x0,gr-top);
  for(let i=0;i<B.teeth;i++){const x=B.x0+i*tw+tw;g=ctx.createLinearGradient(x,top,x-tw*0.7,gr);g.addColorStop(0,"rgba(255,244,220,0.42)");g.addColorStop(1,"rgba(255,244,220,0)");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-6,top);ctx.lineTo(x-tw*0.42,top);ctx.lineTo(x-tw*1.0,gr);ctx.lineTo(x-tw*0.5,gr);ctx.closePath();ctx.fill();}
  // the benches, in rows, and the lamps over them
  const R=ag_rnd(42);for(let i=0;i<5;i++)bw_sideBench(ctx,B.x0+70+i*262,gr-86,200,R);
  ctx.strokeStyle=rgba(BW_K.steel,0.8);ctx.lineWidth=2;for(let i=0;i<5;i++){const x=B.x0+170+i*262;ctx.beginPath();ctx.moveTo(x,top+20);ctx.lineTo(x,top+92);ctx.stroke();
    ctx.fillStyle=rgba(BW_K.steel,1);ctx.beginPath();ctx.moveTo(x-26,top+108);ctx.lineTo(x-10,top+92);ctx.lineTo(x+10,top+92);ctx.lineTo(x+26,top+108);ctx.closePath();ctx.fill();}
  // the cut: the walls, and the saw-tooth roof: each tooth open to the hall below, its slope cut in dark, glass on its north face (left)
  ctx.fillStyle=rgba(BW_K.cut,1);ctx.fillRect(B.x0-20,top-10,20,gr-top+10);ctx.fillRect(B.x1,top-B.peak,20,gr-top+B.peak);
  for(let i=0;i<B.teeth;i++){const x=B.x0+i*tw;
    g=ctx.createLinearGradient(0,top-B.peak,0,top);g.addColorStop(0,rgba(ag_lt(BW_K.hall,0.25),1));g.addColorStop(1,rgba(BW_K.hall,1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(x+10,top-B.peak+12);ctx.lineTo(x+tw,top);ctx.lineTo(x+10,top);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(BW_K.glass,1);ctx.fillRect(x,top-B.peak,12,B.peak);ctx.fillStyle=rgba(BW_K.steel,1);for(let k=1;k<4;k++)ctx.fillRect(x,top-k*B.peak/4,12,2);
    ctx.strokeStyle=rgba(BW_K.cut,1);ctx.lineWidth=14;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(x+4,top-B.peak);ctx.lineTo(x+tw+4,top+2);ctx.stroke();
    ctx.strokeStyle=rgba(mix(BW_K.brick,[255,240,220],0.45),1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+6,top-B.peak-7);ctx.lineTo(x+tw+6,top-5);ctx.stroke();}
  ctx.strokeStyle=rgba(BW_K.steel,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(B.x0,top+2);ctx.lineTo(B.x1,top+2);ctx.stroke();
  ctx.fillStyle=rgba(LP.shade,0.14);ctx.fillRect(B.x0-20,gr,B.x1-B.x0+40,8);ctx.restore();}

/* ---------------------------------------------------------------- inside: the hall's wall, and the training room */
AG_PLACES.bwFloor=c=>{lp_paintRoom(c,{seed:11,base:[222,212,196]});
  // a painted dado along the lower wall, and a steel beam along the top with its rivets
  c.save();c.globalCompositeOperation="multiply";c.fillStyle=rgba(mix([255,255,255],BW_K.dado,0.6),1);c.fillRect(0,600,W,914-600);c.restore();
  c.fillStyle="rgba(255,248,236,0.4)";c.fillRect(0,598,W,2);c.fillStyle=rgba(LP.shade,0.2);c.fillRect(0,600,W,3);
  let g=c.createLinearGradient(0,30,0,92);g.addColorStop(0,rgba(ag_lt(BW_K.steel,0.2),1));g.addColorStop(1,rgba(BW_K.steel,1));c.fillStyle=g;c.fillRect(0,30,W,62);
  c.fillStyle=rgba(LP.shade,0.25);c.fillRect(0,92,W,8);c.fillStyle=rgba(ag_lt(BW_K.steel,0.35),1);for(let x=30;x<W;x+=60){c.beginPath();c.arc(x,44,3,0,TAU);c.fill();c.beginPath();c.arc(x,78,3,0,TAU);c.fill();}};
AG_PLACES.bwClass=c=>lp_paintRoom(c,{light:"morning",seed:4,base:[228,218,200]});

/* ---------------------------------------------------------------- the bench, from the front */
// a pile of sheets, seen from the front and a little above
function bw_pile(ctx,x,y,w,n,col){for(let i=0;i<n;i++){ctx.fillStyle=rgba(i%2?ag_dk(col,0.1):col,1);ctx.fillRect(x+(i%3)*2-2,y-i*4,w,4);}
  ctx.fillStyle=rgba(ag_lt(col,0.3),1);ctx.fillRect(x,y-n*4,w,3);}
// the riveter: a cast frame on the bench, its head over the anvil, a pedal rod down behind the bench
function bw_riveter(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const m=BW_K.steel;
  ctx.fillStyle=rgba(ag_dk(m,0.2),1);rr(ctx,-50,-16,100,16,4);ctx.fill();ctx.fillStyle=rgba(m,1);ctx.beginPath();ctx.moveTo(30,-16);ctx.lineTo(44,-16);ctx.lineTo(44,-150);ctx.lineTo(-20,-150);ctx.lineTo(-20,-128);ctx.lineTo(30,-128);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_lt(m,0.25),1);ctx.fillRect(-24,-128,14,40);ctx.fillRect(-26,-36,18,20);ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(40,-148,3,130);ctx.restore();}
// a timber tote box, open at the top
function bw_tote(ctx,x,y,w,h){ctx.fillStyle=rgba(BW_K.benchDk,1);ctx.fillRect(x,y-h,w,h);ctx.fillStyle=rgba(BW_K.bench,1);ctx.fillRect(x+4,y-h+4,w-8,6);for(let k=1;k<3;k++){ctx.fillStyle=rgba(ag_dk(BW_K.benchDk,0.2),1);ctx.fillRect(x,y-h+k*h/3,w,2);}}
// the bench: the top of its front edge at (x, y), w wide; returns the height to cut a person at behind it. o.parts (0 to 1): the sheets,
// the riveter and the box on it; o.a
function bw_bench(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return y-6;ctx.save();ctx.globalAlpha*=a;const p=o.parts==null?1:o.parts;
  if(p>0){ctx.save();ctx.globalAlpha*=p;bw_pile(ctx,x+60,y-50,120,6,BW_K.copper);bw_pile(ctx,x+230,y-50,120,6,BW_K.brass);bw_riveter(ctx,x+w-330,y-50,0.9);bw_tote(ctx,x+w-170,y-50,130,70);ctx.restore();}
  lp_table(ctx,x,y,w,{depth:56,th:30,floor:936});ctx.restore();return y-6;}

/* ---------------------------------------------------------------- the job from above */
// where things sit on the plan, in the frame (the sheet is drawn at BW_P.x, BW_P.y): the bench with the riveter and the stamp on it, the
// worker in front of it, the boxes of copper and brass sheets on the floor beside it (copper 6 feet off, brass 3 feet further, as the
// course's breakdown has them), the tote box, and the scale 50 feet away. Once it's better: brass in a fixture on the left, copper on the
// right (the breakdown's "left jig" and "right jig"), two riveters in one fixture between them
const BW_P={x:200,y:118,w:1520,h:700,bench:[600,396,560,64],worker:[810,524],brass:[262,486,150,84],copper:[440,486,150,84],
  rivet:[780,404,60,48],stamp:[1030,404,112,48],tote:[1196,486,150,76],scale:[1490,470,150,92],
  jigB:[618,404,112,48],jigC:[888,404,112,48],rivets:[[752,404,52,48],[816,404,52,48]]};
// a trip there and back, as a loop below the line from a to b: out along a shallow arc, back along a deeper one
function bw_trip(pts,a,b,d1,d2){for(let i=1;i<=16;i++){const u=i/16;pts.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u)+Math.sin(Math.PI*u)*d1]);}
  for(let i=1;i<=16;i++){const u=i/16;pts.push([lerp(b[0],a[0],u),lerp(b[1],a[1],u)+Math.sin(Math.PI*u)*d2]);}}
// the long way, as the course's breakdown lists it: to the copper sheets and back; to the box again, on to the brass and back; to the
// brass again and back (BW_WALK); then, every twelve parts, the full tote box carried to the scale, and back to the bench (BW_CARRY)
const BW_WALK=(()=>{const w=[810,560],cu=[515,590],br=[337,590],p=[w.slice()];bw_trip(p,w,cu,20,46);bw_trip(p,w,br,70,110);bw_trip(p,w,br,130,160);return p;})();
const BW_CARRY=(()=>{const w=[810,560],sc=[1565,590],p=[w.slice()];bw_trip(p,w,sc,40,120);return p;})();
// how much of the trip to the scale is the way there: the box reaches the scale at this part of it
const BW_CARRY_OUT=bw_pathLen(BW_CARRY.slice(0,17))/bw_pathLen(BW_CARRY);
function bw_pathLen(pts){let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;}
function bw_path(ctx,pts,u,col,a){if(u<=0||a<=0.004)return;const L=bw_pathLen(pts)*clamp(u,0,1);ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";ctx.setLineDash([14,10]);
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let d=0;for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
    if(d+s>=L){const f=(L-d)/s;ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));break;}ctx.lineTo(pts[i][0],pts[i][1]);d+=s;}ctx.stroke();ctx.restore();}
// a box on the plan, with its name on it
function bw_box(ctx,b,label,col,o){o=o||{};ctx.save();if(o.a!=null)ctx.globalAlpha*=o.a;if(ctx.globalAlpha<=0.004){ctx.restore();return;}ctx.fillStyle=rgba(col,1);rr(ctx,b[0],b[1],b[2],b[3],8);ctx.fill();ctx.strokeStyle=rgba(ag_dk(col,0.3),1);ctx.lineWidth=2;ctx.stroke();
  if(label)lp_T(ctx,label,b[0]+b[2]/2,b[1]+b[3]/2+10,{w:700,size:28,align:"center",col:o.ink||LP.ink,a:o.la==null?1:o.la});ctx.restore();}
// the worker from above: shoulders and head
function bw_top(ctx,x,y,a){ctx.save();ctx.globalAlpha*=a==null?1:a;ctx.fillStyle=rgba(mix(BW_K.dado,LP.ink,0.5),1);ctx.beginPath();ctx.ellipse(x,y,36,19,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([96,74,58],1);ctx.beginPath();ctx.arc(x,y-3,15,0,TAU);ctx.fill();ctx.restore();}
// a line struck through something no longer needed, drawn from (x0, y0) to (x1, y1) as u goes from 0 to 1
function bw_strike(ctx,x0,y0,x1,y1,u){if(u<=0)return;ctx.save();ctx.strokeStyle=rgba(LP.ink,0.85);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,ag_sine(u)),lerp(y0,y1,ag_sine(u)));ctx.stroke();ctx.restore();}
const bw_strikeBox=(ctx,b,u)=>bw_strike(ctx,b[0]-10,b[1]+b[3]+10,b[0]+b[2]+10,b[1]-10,u);
// o: walk (0 to 1: the trips to the boxes drawn), stamp (0 to 1: the stamp on the bench), carry (0 to 1: the trip to the scale drawn),
// better (0 to 1: the proposed method: the sheets at the bench in a fixture either side, both hands at work, two riveters in one
// fixture, the tote box gone), hands (0 to 1: both hands' reach drawn), gone (0 to 1: the stamp and the scale struck out), kick, title,
// col (the band), light, a, k
function bw_plan(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P=BW_P,bt=clamp(o.better||0,0,1),bs=ag_sine(bt);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,P.x+P.w/2,P.y+P.h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,P.x,P.y,P.w,P.h,{col:o.col||null,light:o.light,pin:true});
  if(o.kick)lp_label(ctx,P.x+48,P.y+84,o.kick,{col:o.col||LP.mut});
  if(o.title)lp_T(ctx,o.title,P.x+48,P.y+138,{w:800,size:40});
  // the floor of the job: a faint grid, as the course's charts had
  ctx.strokeStyle=rgba(LP.mut,0.12);ctx.lineWidth=1.5;for(let x=P.x+48;x<P.x+P.w-40;x+=60){ctx.beginPath();ctx.moveTo(x,P.y+190);ctx.lineTo(x,P.y+P.h-40);ctx.stroke();}
  for(let y=P.y+190;y<P.y+P.h-40;y+=60){ctx.beginPath();ctx.moveTo(P.x+48,y);ctx.lineTo(P.x+P.w-40,y);ctx.stroke();}
  // the bench, and on it the riveter (two in one fixture, once it's better) and the stamp
  const b=P.bench;ctx.fillStyle=rgba(LP.timber,1);rr(ctx,b[0],b[1],b[2],b[3],6);ctx.fill();ctx.strokeStyle=rgba(ag_dk(LP.timber,0.3),1);ctx.lineWidth=2;ctx.stroke();
  lp_T(ctx,"Bench",b[0]+24,b[1]+42,{w:700,size:28,a:1-bs});
  const rv=r=>{ctx.fillStyle=rgba(LP.graphite,1);rr(ctx,r[0],r[1],r[2],r[3],6);ctx.fill();ctx.fillStyle=rgba(ag_lt(LP.graphite,0.25),1);ctx.beginPath();ctx.arc(r[0]+r[2]/2,r[1]+r[3]/2,8,0,TAU);ctx.fill();};
  if(bs<1)withA(ctx,1-bs,()=>rv(P.rivet));
  if(bt>0)withA(ctx,bs,()=>{P.rivets.forEach(rv);ctx.strokeStyle=rgba(LP.graphite,0.7);ctx.lineWidth=3;rr(ctx,P.rivets[0][0]-6,P.rivets[0][1]-6,P.rivets[1][0]+P.rivets[1][2]-P.rivets[0][0]+12,60,8);ctx.stroke();});
  const g=clamp(o.gone||0,0,1),st=clamp(o.stamp||0,0,1);
  if(st>0)bw_box(ctx,P.stamp,"Stamp",mix(LP.graphite,LP.paper,0.62),{a:st*(1-0.5*g),la:1-0.4*g});
  // the boxes of sheets on the floor beside the bench; once it's better, the sheets sit at the bench, in a fixture either side
  const mv=(f,to)=>[lerp(f[0],to[0],bs),lerp(f[1],to[1],bs),lerp(f[2],to[2],bs),lerp(f[3],to[3],bs)];
  bw_box(ctx,mv(P.brass,P.jigB),"Brass",BW_K.brass);bw_box(ctx,mv(P.copper,P.jigC),"Copper",BW_K.copper);
  // the tote box, and the scale 50 feet away; once it's better, the tote box goes, and the stamp and the scale are struck out
  bw_box(ctx,P.tote,"Tote box",mix(LP.timber,LP.paper,0.3),{a:1-bs});
  bw_box(ctx,P.scale,"Scale",mix(BW_K.metal,LP.paper,0.35),{a:1-0.5*g,la:1-0.4*g});
  if(g>0){bw_strikeBox(ctx,P.scale,g);if(st>0)bw_strikeBox(ctx,P.stamp,g);}
  // the worker, and the long way she walks; once it's better, both hands work at the bench
  bw_top(ctx,P.worker[0],P.worker[1]);
  bw_path(ctx,BW_WALK,o.walk||0,LP.amber,1-bs);bw_path(ctx,BW_CARRY,o.carry||0,LP.amber,1-bs);
  const cl=clamp((o.carry||0)*1.5-0.5,0,1)*(1-bs);if(cl>0)lp_T(ctx,"50 feet to the scale",1187,746,{w:700,size:28,align:"center",col:LP.amber,a:cl});
  const hd=clamp(o.hands||0,0,1)*bs;if(hd>0){ctx.save();ctx.strokeStyle=rgba(LP.green,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([14,10]);
    const arc=(x0,y0,cx,cy,x1,y1)=>{ctx.beginPath();ctx.moveTo(x0,y0);const n=24;for(let i=1;i<=n*hd;i++){const u=i/n,v=1-u;ctx.lineTo(v*v*x0+2*v*u*cx+u*u*x1,v*v*y0+2*v*u*cy+u*u*y1);}ctx.stroke();};
    arc(784,530,700,526,674,460);arc(836,530,920,526,944,460);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the pocket card */
const BW_STEPS=[["Break down the job","List every detail"],["Question every detail","Why? What for? Where? When? Who? How?"],
  ["Develop the new method","Eliminate, combine, rearrange, simplify"],["Apply the new method","Use it until a better way is developed"]];
// the card, its top left at (x, y), 860 x 620; o.u: one number a step (0 to 1 each), o.hl (0 to 1: the last step's line picked out),
// o.only (a step's index: the others dim), o.pen (0 to 1: a pencil line under the third step's words: write the new way down), o.k,
// o.a, o.light
function bw_card(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=860,h=620;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=20;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(BW_K.card,1);rr(ctx,x,y,w,h,14);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(LP.blue,0.85);ctx.lineWidth=3;rr(ctx,x+16,y+16,w-32,h-32,8);ctx.stroke();
  const Lt=o.light&&LP_LIGHT[o.light];if(Lt&&Lt.sun&&Lt.a>0)lp_sun(ctx,Lt.sun,{a:Lt.a*0.6,col:Lt.col,clip:c=>{c.beginPath();c.rect(x,y,w,h);c.clip();}});
  lp_T(ctx,"JOB METHODS",x+w/2,y+84,{w:800,size:32,ls:6,align:"center",col:LP.blue});
  ctx.fillStyle=rgba(LP.blue,0.85);ctx.fillRect(x+w/2-150,y+104,300,3);
  BW_STEPS.forEach(([t1,t2],i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const yy=y+150+i*112,dim=o.only!=null&&o.only!==i?0.35:1;ctx.save();ctx.globalAlpha*=ag_sine(k)*dim;
    ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+82,yy+22,24,0,TAU);ctx.fill();lp_T(ctx,String(i+1),x+82,yy+32,{w:800,size:28,align:"center",col:[255,255,255]});
    lp_T(ctx,t1,x+128,yy+34,{w:800,size:34});
    if(i===3&&(o.hl||0)>0){ctx.fillStyle=rgba(LP.blue,0.12*o.hl);rr(ctx,x+116,yy+48,600,50,10);ctx.fill();}
    if(i===2&&(o.pen||0)>0){const pw=lp_tw(ctx,t2,{w:600,size:28})*clamp(o.pen,0,1);ctx.strokeStyle=rgba(LP.blue,0.8);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+128,yy+96);ctx.lineTo(x+128+pw,yy+96);ctx.stroke();}
    lp_T(ctx,t2,x+128,yy+82,{w:600,size:28,col:i===3?mix(LP.mut,LP.blue,clamp(o.hl||0,0,1)):LP.mut});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a breakdown sheet, and ten at a table */
// a sheet with its details as short lines in columns, the count in big figures: words {kick, num, label}, n (how many details), o: col, u
// (0 to 1: the lines come in), light, a, k
function bw_breakdown(ctx,x,y,w,words,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=560;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:o.col,light:o.light});lp_label(ctx,x+40,y+84,words.kick,{col:o.col});
  lp_T(ctx,words.num,x+40,y+196,{w:800,size:96,col:o.col});lp_T(ctx,words.label,x+40+lp_tw(ctx,words.num,{w:800,size:96})+18,y+196,{w:700,size:32});
  const cols=n>16?2:1,per=Math.ceil(n/cols),cw=(w-80-(cols-1)*30)/cols;
  for(let i=0;i<n;i++){const c=Math.floor(i/per),r=i%per,u=o.u==null?1:clamp(o.u*n-i,0,1);if(u<=0)continue;const lx=x+40+c*(cw+30),ly=y+250+r*18;
    ctx.fillStyle=rgba(LP.mut,0.45*u);ctx.fillRect(lx,ly,cw*(0.55+0.4*((i*37)%11)/11),6);}
  ctx.restore();}
// ten supervisors round a table, from above, on a small sheet: o.u (0 to 1: they sit down), light, a, k
function bw_ten(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=520,h=330;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:o.light});
  const cx=x+w/2,cy=y+150;ctx.fillStyle=rgba(LP.timber,1);rr(ctx,cx-150,cy-44,300,88,40);ctx.fill();ctx.strokeStyle=rgba(ag_dk(LP.timber,0.3),1);ctx.lineWidth=2;ctx.stroke();
  const seats=[];for(let i=0;i<4;i++){seats.push([cx-111+i*74,cy-74]);seats.push([cx-111+i*74,cy+74]);}seats.push([cx-186,cy]);seats.push([cx+186,cy]);
  seats.forEach(([sx,sy],i)=>{const u=o.u==null?1:clamp(o.u*10-i,0,1);if(u<=0)return;ctx.fillStyle=rgba(mix(LP.ink,LP.paper,0.35),ag_sine(u));ctx.beginPath();ctx.arc(sx,sy,17,0,TAU);ctx.fill();});
  lp_T(ctx,"Ten at a table",cx,y+h-46,{w:700,size:28,align:"center"});ctx.restore();}

/* ---------------------------------------------------------------- the people of the story */
const BW_PEOPLE={
  boss:{name:"A supervisor",key:"bw-boss",skin:[224,186,156],hair:{style:"side",c:[72,56,44]},glasses:[56,48,44],top:{kind:"suit",c:[104,98,90],inner:[238,234,224],tie:[86,66,60]},breath:0.25},
  worker:{name:"A worker",key:"bw-worker",skin:[206,162,128],hair:{style:"bun",c:[58,42,34]},top:{kind:"apron",c:[198,188,170],apron:[124,108,92]},breath:0.3}
};
