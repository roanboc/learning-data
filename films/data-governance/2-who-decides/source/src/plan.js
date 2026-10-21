/* ===== Who decides: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). The past: a car maker's engine plant in 1960s Japan, a long hall under
   steel trusses and high windows, the andon board of numbered lamps above the line, a cord along the line within reach and a call
   button on a post at each station; the engines on their pallets, gaining a part at each station; the workers in work caps and pale
   work jackets, the supervisor with a stripe on his cap (the film's own sign). The people and the line are a composite, and the
   company isn't named. Today, only the university's own places (the series' rooms.js). Every name starts with wd_ or WD_. */

/* ---------- Japan, the 1960s: the engine line ---------- */
// The line: eight stations from x0, each sw wide; the floor behind the line at fy; the conveyor's top at top, where the people standing
// behind it are cut off (gv_behind); the engines' pallets at base; the cord at cord; the andon board; where the supervisor waits, at
// the line's end; and the scale of the people on the line
const WD_LN={x0:114,sw:212,n:8,fy:712,top:800,base:812,cord:552,board:[96,226,1732,92],lampY:272,sup:1866,s:0.62};
const wd_stX=i=>WD_LN.x0+WD_LN.sw*(i+0.5);
const WD_WALL=[228,224,210],WD_STEEL=[98,110,118],WD_MACH=[160,182,168],WD_IRON=[112,116,124],WD_FLOOR=[200,194,180],WD_CONV=[146,166,156],
  WD_CAP=[224,224,210],WD_JACKET=[214,212,194],WD_STRIPE=[44,64,110],WD_COVER=[62,80,112],WD_ROPE=[218,200,150],
  WD_LAMP={off:[150,150,144],amber:[252,198,84],red:[240,98,76]},WD_GLOW={amber:[255,206,96],red:[255,110,86]};

// the hall: the wall and its high windows between steel columns, the roof's trusses, machines and racks against the wall, parts bins
// behind each station, the board's hangers and frame (its lamps are lit every frame), and the posts that carry the cord, each with a
// call button for the station on its left
function wd_paintLine(ctx){const L=WD_LN;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,L.fy+40),WD_WALL,{kind:"plaster",line:false,seed:61});
  wc_wash(ctx,wc_rect(-40,L.fy,W+80,H-L.fy+40),WD_FLOOR,{kind:"ground",line:false,seed:63});
  // the high windows, small steel panes with the sky pale through them
  const cols=[0,1,2,3,4,5,6].map(i=>-20+i*328);
  for(let i=0;i<6;i++){const x=cols[i]+44,w=240,y=56,h=132;wc_flat(ctx,wc_rect(x,y,w,h),[208,226,238],1,"glass");
    ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w*0.5,y+h*0.4,180,[255,250,232],0.55);ctx.restore();
    ctx.save();ctx.strokeStyle=rgba(WD_STEEL,0.8);ctx.lineWidth=3;for(let k=1;k<6;k++){ctx.beginPath();ctx.moveTo(x+k*w/6,y);ctx.lineTo(x+k*w/6,y+h);ctx.stroke();}
      for(let k=1;k<3;k++){ctx.beginPath();ctx.moveTo(x,y+k*h/3);ctx.lineTo(x+w,y+k*h/3);ctx.stroke();}ctx.restore();
    wc_ink(ctx,wc_rect(x,y,w,h),true,2.2,WD_STEEL,0.8,70+i,0.8);wc_flat(ctx,wc_rect(x-6,y+h,w+12,10),wc_dim(WD_WALL,0.18),1,"sill");}
  // the light the windows let in, falling on the wall below them
  ctx.save();ctx.globalCompositeOperation="screen";for(let i=0;i<6;i++){const x=cols[i]+164;wc_glowAt(ctx,x,330,260,[255,246,220],0.22);}ctx.restore();
  // the trusses: two chords and their diagonals along the top, on columns between the windows
  ctx.save();ctx.strokeStyle=rgba(WD_STEEL,0.9);ctx.lineCap="round";ctx.lineWidth=7;for(const y of [6,40]){ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y);ctx.stroke();}
  ctx.lineWidth=4;for(let x=-20;x<W+20;x+=48){ctx.beginPath();ctx.moveTo(x,40);ctx.lineTo(x+24,6);ctx.lineTo(x+48,40);ctx.stroke();}ctx.restore();
  cols.forEach((x,i)=>{wc_part(ctx,wc_rect(x-15,30,30,L.fy-26),WD_STEEL,1,{lw:1.3,seed:80+i});wc_flat(ctx,wc_rect(x-5,40,10,L.fy-40),wc_dim(WD_STEEL,0.3),1,"web");
    wc_flat(ctx,wc_rect(x-24,L.fy-8,48,10),wc_dim(WD_STEEL,0.2),1,"foot");});
  // machines and racks against the wall, pale green-grey
  [[150,300,446],[478,610,470],[806,280,430],[1134,300,456],[1462,320,440],[1790,180,470]].forEach(([x,w,y],i)=>{const h=L.fy-y;
    wc_part(ctx,wc_rrPts(x-w/2,y,w,h,8),i%2?wc_lit(WD_MACH,0.08):WD_MACH,1,{lw:1.3,seed:90+i});
    const px=x-w/2+24,py=y+28;wc_flat(ctx,wc_rect(px,py,96,70),[74,88,86],1,"panel");wc_flat(ctx,wc_ell(px+34,py+35,22,22,20),[236,232,214],1,"gauge");
    ctx.save();ctx.strokeStyle=rgba([60,50,50],0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(px+34,py+35);ctx.lineTo(px+34+15*Math.cos(-0.7-i),py+35+15*Math.sin(-0.7-i));ctx.stroke();ctx.restore();
    for(const ky of [py+22,py+50])wc_flat(ctx,wc_ell(px+76,ky,7,7,12),[200,70,56],1,"knob");
    wc_flat(ctx,wc_rect(x-w/2,L.fy-40,w,40),wc_dim(WD_MACH,0.18),1,"base");});
  // the board: hung from the trusses on two rods, a dark frame round the lamps
  const [bx,by,bw,bh]=L.board;ctx.save();ctx.strokeStyle=rgba(WD_STEEL,0.9);ctx.lineWidth=4;for(const rx of [bx+150,bx+bw-150]){ctx.beginPath();ctx.moveTo(rx,40);ctx.lineTo(rx,by);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(bx,by,bw,bh),[64,68,76],1,{lw:1.4,seed:140});wc_flat(ctx,wc_rect(bx+8,by+bh-12,bw-16,6),[96,100,108],1,"rail");
  // the posts that carry the cord, from the conveyor's back edge to an eyelet at the cord's height; a call button on each
  for(let k=0;k<=L.n;k++){const x=L.x0+k*L.sw;wc_part(ctx,wc_rect(x-5,L.cord+4,10,L.top-L.cord-4),WD_STEEL,1,{lw:1.1,seed:150+k});
    ctx.save();ctx.strokeStyle=rgba(wc_dim(WD_STEEL,0.2),1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,L.cord,8,0,TAU);ctx.stroke();ctx.restore();
    if(k>0){wc_part(ctx,wc_rrPts(x-16,L.cord+150,32,42,5),[90,104,112],1,{lw:1.2,seed:160+k});}}}
// a call button's cap, drawn every frame so it can be pressed (p, 0 to 1) and light (lit, 0 to 1)
function wd_button(ctx,k,p,lit){const x=WD_LN.x0+k*WD_LN.sw,y=WD_LN.cord+171;if(lit>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,46,WD_GLOW.amber,0.5*lit);ctx.restore();}
  ctx.save();ctx.fillStyle=rgba(mix([238,232,214],WD_LAMP.amber,lit||0),1);ctx.beginPath();ctx.arc(x,y,9-2.5*(p||0),0,TAU);ctx.fill();ctx.strokeStyle=rgba([60,60,64],0.8);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}

// the conveyor, over the people behind it: its top, where the pallets ride, its front to the floor, and a white line painted at the
// end of each station; the floor in front, with its walkway line. The place's front layer.
function wd_paintLineFront(ctx){const L=WD_LN;wc_contact(ctx,-60,W+60,946,0.9,0.3);
  wc_part(ctx,wc_rect(-40,L.top+26,W+80,124),wc_dim(WD_CONV,0.16),1,{seed:170});
  wc_part(ctx,wc_rect(-40,L.top,W+80,28),wc_lit(WD_CONV,0.14),1,{seed:172});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(WD_CONV,0.4),0.35);ctx.lineWidth=2;for(let x=-30;x<W+30;x+=26){ctx.beginPath();ctx.moveTo(x,L.top+4);ctx.lineTo(x,L.top+24);ctx.stroke();}ctx.restore();
  wc_flat(ctx,wc_rect(-40,L.top+26,W+80,8),wc_dim(WD_CONV,0.4),1,"edge");wc_flat(ctx,wc_rect(-40,L.top+132,W+80,18),wc_dim(WD_CONV,0.32),1,"kick");
  wc_wash(ctx,wc_rect(-40,L.top+150,W+80,H-L.top-110),wc_dim(WD_FLOOR,0.04),{kind:"ground",line:false,seed:174});
  for(let k=0;k<=L.n;k++){const x=L.x0+k*L.sw;wc_flat(ctx,wc_rect(x-5,L.top+34,10,98),[250,248,240],1,"mark");wc_flat(ctx,[[x-6,L.top+150],[x+6,L.top+150],[x+12,H+20],[x-12,H+20]],[246,244,234],1,"mark");}
  wc_flat(ctx,[[-40,1004],[W+40,1004],[W+40,1016],[-40,1016]],[244,240,226],1,"walk");}

// the andon board's lamps, one for each station: off, amber (help is called) or red (the line has stopped), with its station's number;
// lamps[i] is [state, how lit, 0 to 1]
function wd_lamps(ctx,lamps){const L=WD_LN;for(let i=0;i<L.n;i++){const x=wd_stX(i),y=L.lampY,[st,a]=lamps[i]||["off",0],on=st!=="off"?a:0,col=mix(WD_LAMP.off,WD_LAMP[st]||WD_LAMP.off,on);
  if(on>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,150,WD_GLOW[st],0.6*on);ctx.restore();}
  ctx.save();ctx.fillStyle=rgba(col,1);rr(ctx,x-64,y-29,128,58,10);ctx.fill();ctx.strokeStyle=rgba([40,42,48],0.9);ctx.lineWidth=3;ctx.stroke();
  if(on>0.01){ctx.globalAlpha=0.45*on;ctx.fillStyle="#ffffff";rr(ctx,x-52,y-23,104,14,6);ctx.fill();ctx.globalAlpha=1;}ctx.restore();
  const k=wd_inFrame(ctx,x-24,x+24)*(1-WD_PILL.a*wd_underPill(ctx,x,y));if(k>0.01)wc_T(ctx,String(i+1),x,y+12,{w:800,size:34,align:"center",col:mix([226,224,214],[60,36,14],on),a:k});}}
// how much of something from x0 to x1 the frame shows: 1 inside, fading to 0 as it reaches the frame's edge, so the frame never cuts a
// word or a number in half (the floor's office names do the same)
function wd_inFrame(ctx,x0,x1){const m=ctx.getTransform(),vl=-m.e/m.a,vr=(ctx.canvas.width-m.e)/m.a;return clamp(Math.min(x0-vl,vr-x1)/30,0,1);}
// the corner tag with the place and decade: how far (0 to 1) a point lies under it, and how much it shows (the opening sets WD_PILL.a)
const WD_PILL={a:0};
function wd_underPill(ctx,x,y){const m=ctx.getTransform(),sx=(m.a*x+m.c*y+m.e)*1920/ctx.canvas.width,sy=(m.b*x+m.d*y+m.f)*1080/ctx.canvas.height;
  return clamp((430-sx)/40,0,1)*clamp((170-sy)/40,0,1);}
// a word that fades as it nears the frame's edge
function wd_T(ctx,s,x,y,o){const w=tw(ctx,s,o.size||28,o.w||700,o.f),x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x,a=wd_inFrame(ctx,x0,x0+w);
  if(a>0.01)wc_T(ctx,s,x,y,Object.assign({},o,{a:(o.a==null?1:o.a)*a}));}

// the cord: from post to post through the eyelets, sagging a little; pulled (pulls[i], a hand's point) it runs down to the hand
function wd_cord(ctx,pulls){const L=WD_LN,pts=[[-40,L.cord+2]];for(let k=0;k<=L.n;k++){const x=L.x0+k*L.sw;
    if(k>0){const p=pulls&&pulls[k-1],xa=x-L.sw;if(p)pts.push([lerp(xa,p[0],0.5),lerp(L.cord,p[1],0.5)],p,[lerp(p[0],x,0.5),lerp(p[1],L.cord,0.5)]);else pts.push([xa+L.sw/2,L.cord+7]);}
    pts.push([x,L.cord]);}pts.push([W+40,L.cord+2]);const sm=wc_smooth(pts,4);
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();sm.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=rgba(wc_dim(WD_ROPE,0.5),0.9);ctx.lineWidth=6.5;ctx.stroke();
  ctx.strokeStyle=rgba(WD_ROPE,1);ctx.lineWidth=4;ctx.stroke();ctx.restore();}

/* the engines: each gains a part at each station it passes (stage 1, a bare block on its pallet, to 9): the cylinder head, the rocker
   cover, the manifold, the bracket, the dynamo on the bracket, the carburettor, the oil filter, the air cleaner. Each stage is painted
   once, at twice the size, so the camera can come close. The bracket and the carburettor can also be drawn on their own, crooked. */
const WD_ES=0.86;
function wd_bracketShape(q){wc_part(q,[[-6,0],[6,0],[6,-44],[0,-50],[-6,-44]],[196,200,208],1,{lw:1.2,seed:21});wc_part(q,wc_rect(-16,-4,32,8),[184,188,196],1,{lw:1.1,seed:22});
  wc_flat(q,wc_ell(0,-36,3.4,3.4,10),[70,74,82],1,"hole");}
function wd_carbShape(q){wc_part(q,wc_rect(-16,-24,32,24),[180,176,160],1,{lw:1.2,seed:31});wc_part(q,wc_rect(-10,-34,20,10),[160,156,140],1,{lw:1.1,seed:32});}
function wd_paintEngine(q,k){
  wc_part(q,wc_rect(-82,-14,164,14),[138,120,96],1,{lw:1.2,seed:3});
  wc_part(q,[[-54,-34],[54,-34],[48,-14],[-48,-14]],[88,92,100],1,{lw:1.2,seed:5});
  wc_part(q,wc_rrPts(-68,-100,136,66,5),WD_IRON,1,{lw:1.3,seed:7});
  q.save();q.strokeStyle=rgba(wc_dim(WD_IRON,0.35),0.5);q.lineWidth=1.4;for(const x of [-34,0,34]){q.beginPath();q.moveTo(x,-96);q.lineTo(x,-38);q.stroke();}q.restore();
  for(const x of [-51,-17,17,51])wc_flat(q,wc_ell(x,-60,6,6,12),wc_lit(WD_IRON,0.3),1,"plug");
  if(k>=2)wc_part(q,wc_rect(-64,-118,128,18),[154,158,164],1,{lw:1.2,seed:9});
  if(k>=3){wc_part(q,wc_rrPts(-56,-134,112,16,6),WD_COVER,1,{lw:1.2,seed:11});wc_flat(q,wc_rect(-30,-140,18,8),[50,52,58],1,"cap");}
  if(k>=4){wc_part(q,wc_rect(-58,-112,116,10),[124,88,72],1,{lw:1.1,seed:13});for(const x of [-42,-14,14,42])wc_part(q,wc_rect(x-5,-104,10,10),[118,84,68],1,{lw:1,seed:14+x});}
  if(k>=5){q.save();q.translate(50,-100);wd_bracketShape(q);q.restore();}
  if(k>=6){wc_part(q,wc_rrPts(28,-176,48,26,11),[74,78,86],1,{lw:1.2,seed:17});wc_flat(q,wc_ell(76,-163,6,13,12),[150,154,160],1,"pulley");}
  if(k>=7){q.save();q.translate(-18,-134);wd_carbShape(q);q.restore();}
  if(k>=8)wc_part(q,wc_rrPts(-44,-74,20,30,6),[226,220,200],1,{lw:1.1,seed:19});
  if(k>=9)wc_part(q,wc_rrPts(-50,-182,64,18,8),[66,70,78],1,{lw:1.2,seed:23});}
function wd_engineC(k){return wc_kept("wd_eng"+k,440,400,q=>{q.scale(2,2);q.translate(110,190);wd_paintEngine(q,k);});}
function wd_partC(key){return wc_kept("wd_part"+key,160,160,q=>{q.scale(2,2);q.translate(40,70);key==="bracket"?wd_bracketShape(q):wd_carbShape(q);});}
// an engine, its pallet's bottom centre at (x,y), with its first k parts; drawn at WD_ES of its painted size, so the faces of the people
// behind the line stay clear of it
function wd_engine(ctx,x,y,k){const e=WD_ES;ctx.drawImage(wd_engineC(clamp(k,1,9)),x-110*e,y-190*e,220*e,200*e);}
// a part on its own, about to be fitted: its foot at (x,y), tilted by a, lifted by dy
function wd_part(ctx,key,x,y,a,dy){const e=WD_ES;ctx.save();ctx.translate(x,y-(dy||0));ctx.rotate(a||0);ctx.drawImage(wd_partC(key),-40*e,-70*e,80*e,80*e);ctx.restore();}
// how many parts an engine at x has: one for each station whose worker it has passed
function wd_stage(x){let k=1;for(let i=0;i<WD_LN.n;i++)if(x>=wd_stX(i)+18)k++;return k;}
// how far the line has moved by t, at v px a second, standing still through each stop [t0, t1] (it slows and starts over half a second)
function wd_run(t,v,stops){let d=t;(stops||[]).forEach(([a,b])=>{const r=0.5,seg=(x0,x1)=>Math.max(0,Math.min(t,x1)-x0);
    // ramps down over r before a, flat to b, ramps up over r after b: the time lost is a ramp's half on each side, plus the stop
    if(t>a-r)d-=Math.min(seg(a-r,a),r)*Math.min(seg(a-r,a),r)/(2*r);if(t>a)d-=Math.min(t,b)-a;if(t>b){const u=Math.min(t-b,r);d-=u-u*u/(2*r);}});
  return d*v;}

/* the people on the line: invented, in work caps and pale work jackets; the supervisor has a stripe on his cap */
const WD_SKIN=[[236,204,172],[226,190,156],[218,180,146],[238,208,180],[212,172,138],[232,198,166],[222,186,152],[230,196,162],[220,182,148]];
for(let i=0;i<8;i++)PEOPLE["wd_w"+(i+1)]={name:"",role:"worker on the line",side:"",edge:GV_PAST,seed:61+i,skin:WD_SKIN[i],hair:{style:i%3===1?"side":"cropped",c:[34+(i%3)*8,30,32]},
  hat:"wd_cap",hatC:WD_CAP,top:{kind:"overshirt",c:WD_JACKET,inner:[242,240,230]},bottom:{c:[178,174,158]},shoe:[62,54,48],build:{sh:68+(i*5)%10,hip:60,h:0.95+((i*7)%6)*0.012}};
PEOPLE.wd_sup={name:"",role:"supervisor",side:"",edge:GV_PAST,seed:70,skin:WD_SKIN[8],hair:{style:"side",c:[40,34,34]},hat:"wd_cap",hatC:WD_CAP,capStripe:WD_STRIPE,
  top:{kind:"overshirt",c:WD_JACKET,inner:[242,240,230]},bottom:{c:[178,174,158]},shoe:[62,54,48],build:{sh:74,hip:62,h:1.0}};
// a work cap: a soft crown over the hair, a short stiff peak, a stripe round the crown for the supervisor. The series' head draws the
// rest; this wraps it for this film's cap only.
const _wdHead=head;
head=function(ctx,P,E,po,t){_wdHead(ctx,P,E,po,t);if(P.hat==="wd_cap")wd_cap(ctx,P);};
function wd_cap(ctx,P){const c=P.hatC||WD_CAP;
  ctx.beginPath();ctx.moveTo(-46,-30);ctx.bezierCurveTo(-52,-104,52,-104,46,-30);ctx.quadraticCurveTo(0,-40,-46,-30);ctx.closePath();litFill(ctx,c,-52,-100,52,-30);seam(ctx,c,0.45);
  ctx.strokeStyle=rgba(darken(c,0.3),0.4);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-94);ctx.quadraticCurveTo(2,-64,0,-38);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.15),1);ell(ctx,0,-95,5,3);ctx.fill();
  if(P.capStripe){ctx.strokeStyle=rgba(P.capStripe,0.95);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-47,-50);ctx.quadraticCurveTo(0,-62,47,-50);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-42,-32);ctx.quadraticCurveTo(0,-44,42,-32);ctx.quadraticCurveTo(48,-24,38,-22);ctx.quadraticCurveTo(0,-30,-38,-22);ctx.quadraticCurveTo(-48,-24,-42,-32);ctx.closePath();
  litFill(ctx,darken(c,0.12),-48,-44,48,-22);seam(ctx,c,0.55);}

/* poses: an arm's angles to put its hand on a point (in the figure's own units, from its feet), the elbow low; and a pose with
   the hands on points of the picture, for someone at x with their feet at y, at scale s (flip: facing the other way) */
function wd_ik(P_,s,T){const sx=s*(P_.build.sh-12),sy=-416,dx=s*(T[0]-sx),dy=T[1]-sy,L1=108,L2=113,D=clamp(Math.hypot(dx,dy),8,L1+L2-1),
    th=Math.atan2(dx,dy),al=Math.acos(clamp((L1*L1+D*D-L2*L2)/(2*L1*D),-1,1)),pick=a=>[a,Math.atan2(dx-Math.sin(a)*L1,dy-Math.cos(a)*L1)],
    A=pick(th+al),B=pick(th-al);return Math.cos(A[0])>=Math.cos(B[0])?A:B;}
function wd_hands(id,x,y,s,o){o=o||{};const P_=PEOPLE[id],k=s*P_.build.h,f=p=>p&&[(o.flip?x-p[0]:p[0]-x)/k,(p[1]-y)/k],po=Object.assign({},POSE[o.base||"stand"],o.extra||{});
  if(o.L)po.L=wd_ik(P_,-1,f(o.L));if(o.R)po.R=wd_ik(P_,1,f(o.R));return po;}
// someone on the line, behind the conveyor, in a pose of their own (po), or between a named pose and it
function wd_on(ctx,id,x,po,o){o=o||{};POSE.wd_now=po;gv_behind(ctx,id,x,WD_LN.top,WD_LN.s,Object.assign({standing:true,pose:o.pose||"wd_now",pose2:o.pose?"wd_now":null,mix:o.mix},o));}
// where someone on the line stands: their feet
const wd_feet=()=>WD_LN.top+GV_STAND*WD_LN.s;

/* ---------- today: Yusuf's office, and the binder Who decides ---------- */
// binder 2's colour, as on his shelf in Off the shelf
const WD_B2=[120,140,104];
// the desk in Yusuf's office painted again on its own, with its tray and pens, to go over him as he sits at it: the office's front layer
function wd_paintOfficeDesk(ctx){const O=GV_OFF;gv_desk(ctx,O.desk[0],O.desk[1],O.desk[2],O.fy+6,{left:true});
  const dx=O.desk[0]+O.desk[2];wc_part(ctx,wc_rect(dx-210,O.desk[1]-30,120,30),[226,218,204],1);wc_flat(ctx,wc_rect(dx-200,O.desk[1]-38,100,10),WC_CARD,1,"papers");
  wc_part(ctx,[[dx-70,O.desk[1]],[dx-30,O.desk[1]],[dx-34,O.desk[1]-58],[dx-66,O.desk[1]-58]],[96,118,150],1);
  for(const [px,a,c] of [[-58,-0.2,[60,60,70]],[-48,0.1,[204,62,50]],[-40,0.25,[60,60,70]]]){ctx.save();ctx.translate(dx+px,O.desk[1]-56);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}}
// a binder held up in both hands, its title on the label of its cover
function wd_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+16,-h/2+26,w-32,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,32);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+74+i*38-(lines.length-1)*6));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}

// his desk from above, painted for this film so that nothing lies where the binder goes: the oak, the keyboard's edge at the top,
// a mug at the bottom left, a pencil above the binder
function wd_paintDeskTop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.oak,{kind:"plaster",line:false,seed:51});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(3);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(GV.oak,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(1500,-60,460,120),[226,228,234],1);for(let i=0;i<9;i++)wc_flat(ctx,wc_rect(1516+i*48,8,40,36),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(66,1012,82,82,40),[236,240,244],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(66,1012,62,62,40),[150,104,70],{kind:"thing",line:false});
  wc_part(ctx,[[220,70],[500,46],[502,60],[222,84]],[244,196,80],1);wc_flat(ctx,[[500,46],[532,44],[502,60]],[60,54,58],1,"tip");}
// The binder open on his desk, seen from above: the cover, the pages either side of the rings. Policy 2 on the left-hand page, the
// register of domains on the right. WD_OPEN says where; the words are drawn every frame.
const WD_OPEN={x:70,y:110,w:1780,h:830,mid:960,pw:820,rings:[280,525,770]};
const wd_pageL=()=>WD_OPEN.mid-46-WD_OPEN.pw,wd_pageR=()=>WD_OPEN.mid+46,wd_pageTop=()=>WD_OPEN.y+26;
function wd_open2(ctx){const B=WD_OPEN,top=wd_pageTop(),ph=B.h-52,L=wd_pageL(),R=wd_pageR();ctx.drawImage(wc_kept("wd_open2",W,H,q=>{const col=WD_B2;
    q.save();q.filter="blur(16px)";q.fillStyle="rgba(70,50,30,0.32)";q.fillRect(B.x+16,B.y+24,B.w,B.h);q.restore();
    wc_wash(q,wc_rrPts(B.x,B.y,B.w,B.h,18),col,{kind:"cover",lw:1.6,seed:2});wc_flat(q,wc_rect(B.mid-40,B.y+8,80,B.h-16),wc_dim(col,0.22),1,"spine");
    for(const px of [L,R]){const s=px<B.mid?-1:1;for(let k=3;k>=1;k--)wc_flat(q,wc_rect(px+s*k*3,top+k*3,B.pw,ph),wc_dim(GV.paper,0.05*k),1,"pages");
      wc_wash(q,wc_rect(px,top,B.pw,ph),GV.paper,{kind:"page",lw:1.3,seed:(px|0)+2});
      for(const ry of B.rings)wc_wash(q,wc_ell(B.mid+s*80,ry,11,11,16),wc_dim(col,0.1),{kind:"thing",line:false,flat:true});}
    wc_wash(q,wc_rrPts(B.mid-26,B.rings[0]-60,52,B.rings[2]-B.rings[0]+120,14),GV.metal,{kind:"thing",lw:1.4,seed:13});
    for(const ry of B.rings){q.save();q.strokeStyle=rgba(wc_dim(GV.metal,0.28),1);q.lineWidth=10;q.beginPath();q.ellipse(B.mid,ry,80,17,0,0,TAU);q.stroke();
      q.strokeStyle="rgba(255,255,255,0.65)";q.lineWidth=3;q.beginPath();q.ellipse(B.mid,ry-3,76,13,0,Math.PI*1.15,Math.PI*1.85);q.stroke();q.restore();}}),0,0);}
// the closed cover, over the right-hand half, rising to stand on the spine as u goes from 0 to 0.5
function wd_cover2(ctx,u){if(u>=0.5)return;const B=WD_OPEN,x=B.mid-40,w=B.x+B.w-x,c=wc_kept("wd_cover2",W,H,q=>{const col=WD_B2;
    q.save();q.filter="blur(16px)";q.fillStyle="rgba(70,50,30,0.3)";q.fillRect(x+16,B.y+24,w,B.h);q.restore();wc_wash(q,wc_rrPts(x,B.y,w,B.h,18),col,{kind:"cover",lw:1.6,seed:4});
    wc_flat(q,wc_rect(x,B.y+8,46,B.h-16),wc_dim(col,0.22),1,"spine");
    const lx=x+150,lw=w-300,ly=B.y+250;wc_panel(q,lx,ly,lw,230,{kind:"card",seed:5});});
  const k=Math.cos(Math.PI*clamp(u,0,0.5));ctx.save();ctx.translate(x,0);ctx.scale(Math.max(0.02,k),1);ctx.translate(-x,0);ctx.drawImage(c,0,0);
  withA(ctx,clamp(k*1.6-0.3,0,1),()=>{const cx=x+w/2;wc_T(ctx,"Who decides",cx,B.y+350,{w:800,size:64,align:"center",col:mix(WD_B2,[0,0,0],0.5)});
    wc_T(ctx,"policy 2",cx,B.y+420,{w:600,size:34,align:"center",col:WC_MUTED});});ctx.restore();}
// the binder on the desk, its cover turning open as u goes from 0 to 1: closed, only the right-hand half shows, under the cover; the
// cover rises to stand on the spine, then lies down on the left, the left-hand page with it. left and right draw what is on each page
function wd_binder2(ctx,u,left,right){const sx=WD_OPEN.mid-40;u=clamp(u,0,1);
  ctx.save();ctx.beginPath();ctx.rect(sx,0,W,H);ctx.clip();wd_open2(ctx);if(right&&u>0.3)withA(ctx,clamp((u-0.3)/0.2,0,1),()=>right(ctx));ctx.restore();
  if(u>0.5){ctx.save();ctx.translate(sx,0);ctx.scale(Math.max(0.02,-Math.cos(Math.PI*u)),1);ctx.translate(-sx,0);ctx.beginPath();ctx.rect(0,0,sx,H);ctx.clip();
    wd_open2(ctx);const k=-Math.cos(Math.PI*u);if(left&&k>0.86)withA(ctx,clamp((k-0.86)/0.12,0,1),()=>left(ctx));ctx.restore();}
  wd_cover2(ctx,u);}
// policy 2 on the left-hand page: its number and name, and its two lines: 2.1, the one the series' plan quotes, and 2.2, the one
// the voice reads, lit (0 to 1) as it's read
function wd_policy2(ctx,a,lit){const x=wd_pageL()+64,top=wd_pageTop();withA(ctx,a,()=>{wd_T(ctx,"Data policies",x,top+80,{w:600,size:28,col:WC_MUTED});
  wd_T(ctx,"Policy 2",x,top+176,{w:800,size:66,col:WC_DARK});wd_T(ctx,"Decision rights",x,top+232,{w:600,size:36,col:WC_MUTED});
  if(lit>0.01)gv_tint(ctx,x-14,top+406,620,124,GV.gold,0.55*lit);
  [["2.1",["Every critical data element","has an accountable owner."],top+322],["2.2",["Every data domain has","an owner and a steward."],top+452]].forEach(([n,ls,y])=>{
    wd_T(ctx,n,x,y,{w:700,size:30,col:WC_MUTED});ls.forEach((l,i)=>wd_T(ctx,l,x+70,y+i*52,{w:600,size:40,col:WC_INK}));});
  gv_lines(ctx,x,top+600,WD_OPEN.pw-150,5,40);});}
// the register, on the right-hand page: eight domains, an owner and a steward for each; tbc(k) says how far "TBC" is written in each
// of the cells still to be confirmed (owners first, then stewards); tick(i) puts a gold tick by row i's owner, o.strike(i) strikes its
// owner's "TBC" in gold, and o.note (0 to 1) writes Yusuf's note over the owners
const WD_REG=[["person","Registrar's office",null],["student","Registrar's office",null],["course",null,null],["organisation","Planning","Planning"],
  ["admissions","Admissions office","Admissions office"],["staff","HR",null],["research",null,"Research office"],["fees",null,"Finance"]];
const WD_TBC=(()=>{const o=[];WD_REG.forEach((r,i)=>{if(!r[1])o.push([i,1]);});WD_REG.forEach((r,i)=>{if(!r[2])o.push([i,2]);});return o;})();
const WD_RG={x:()=>wd_pageR()+46,y0:()=>wd_pageTop()+214,dy:62,cols:[0,240,504]};
function wd_register(ctx,a,tbc,tick,o){o=o||{};const x=WD_RG.x(),top=wd_pageTop(),y0=WD_RG.y0(),C=WD_RG.cols;withA(ctx,a,()=>{
  wd_T(ctx,"Register",x,top+84,{w:800,size:44,col:WC_DARK});
  ["domain","owner","steward"].forEach((h,j)=>wd_T(ctx,h,x+C[j],top+142,{w:700,size:28,col:WC_MUTED}));
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;for(let i=0;i<=WD_REG.length;i++){ctx.beginPath();ctx.moveTo(x-10,y0-40+i*WD_RG.dy);ctx.lineTo(x+WD_OPEN.pw-80,y0-40+i*WD_RG.dy);ctx.stroke();}ctx.restore();
  WD_REG.forEach((r,i)=>{const y=y0+i*WD_RG.dy;wd_T(ctx,r[0],x+C[0],y,{w:700,size:28,col:WC_DARK});
    for(const j of [1,2])if(r[j])wd_T(ctx,r[j],x+C[j],y,{w:500,size:28,col:WC_INK});});
  WD_TBC.forEach(([i,j],k)=>{const p=tbc?tbc(k):0;if(p<=0)return;wc_hand(ctx,"TBC",x+C[j]+6,y0+i*WD_RG.dy+2,{p,size:36,col:GV.redInk});
    const sp=j===1&&o.strike?o.strike(i):0;if(sp>0){ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.9);ctx.lineWidth=4;ctx.lineCap="round";const sx=x+C[j],sy=y0+i*WD_RG.dy-11;
      ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+90*sp,sy-5*sp);ctx.stroke();ctx.restore();}});
  if(tick)WD_REG.forEach((r,i)=>{const p=tick(i);if(p>0)wc_tick(ctx,x+C[1]-30,y0+i*WD_RG.dy-10,20,GV.goldInk,p,4);});
  if(o.note>0)["owners: in the map,","where the work is"].forEach((l,i)=>wc_hand(ctx,l,x+C[1],top+56+i*40,{p:clamp(o.note*2-i,0,1),size:30,col:GV.goldInk}));});}

// Yusuf's screen, close: his inbox, the thread about award, and what it says when it opens: questions, and no decision
const WD_MAIL=[["Clara","Does theirs count microcredentials?"],["Jun","Who signs this off?"],["Finance","Ask the registrar?"],["Mei","Can the council decide?"]];
function wd_inbox(ctx,o){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Inbox",q=>{const open=o.open||0;
  // the list: other mail in grey, the thread in bold, with its count of replies
  withA(q,1-open,()=>{const grey=o.grey||0,gone=o.gone||0;for(let i=0;i<6;i++){const ry=y+120+i*92-(i>1?92*easeCam(gone):0);if(i===1)continue;
      gv_lines(q,x+60,ry,w-420,1,0,0.9);gv_lines(q,x+60,ry+30,w-620,1,0,0.6);}
    const ry=y+212;withA(q,1-gone,()=>{gv_tint(q,x+20,ry-60,w-40,96,GV.gold,0.3*(o.hl||0)*(1-grey));
      wc_T(q,"Re: award in the government return",x+60,ry,{w:800,size:36,col:mix(WC_DARK,[150,150,150],grey)});
      wc_tag(q,x+w-60,ry-12,"23 replies",{align:"right",size:30,col:mix(WC_INK,[150,150,150],grey)});});});
  // the thread, open: who wrote, and their question, each a little smaller than the one before
  if(open>0.01)withA(q,open,()=>{wc_T(q,"Re: award in the government return",x+40,y+100,{w:800,size:32,col:WC_MUTED});
    WD_MAIL.forEach(([who,s],i)=>{const a=o.msg?o.msg(i):1;if(a<=0.01)return;const sz=36-2*i,by=y+150+i*126;
      withA(q,a,()=>{q.save();q.translate(0,10*(1-a));wc_panel(q,x+40,by,Math.min(w-80,tw(q,s,sz,600)+70),106-i*2,{kind:"card",seed:20+i});
        wc_T(q,who,x+70,by+38,{w:700,size:28,col:WC_MUTED});wc_T(q,s,x+70,by+80-i,{w:600,size:sz,col:WC_DARK});q.restore();});});});},{titleSize:28});
  if(o.none>0.01){const k=0.9+0.1*spring(o.none);ctx.save();ctx.translate(x+w-200,y+h-60);ctx.scale(k,k);withA(ctx,o.none,()=>wc_tag(ctx,0,0,"no decision",{align:"center",size:34,wash:GV.grey,washA:0.6}));ctx.restore();}}

/* ---------- 3 · Already written: the owners in the data team's files ---------- */
// two of the example project's files, line for line, as a screen shows them (the line numbers are the file's own; the lines between
// are left out): the map of the university's domains, each with its owner, and the course domain's model of the award, with its owner
const WD_MAP=[[18,"domains:"],[20,"  - name: person"],[21,"    owner: Registrar's office"],[29,"  - name: student"],[30,"    owner: Registrar's office"],
  [40,"  - name: course"],[41,"    owner: Registrar's office, with the faculties"],[54,"  - name: organisation"],[55,"    owner: Planning"],
  [63,"  - name: admissions"],[64,"    owner: Admissions office"],[71,"  - name: staff"],[72,"    owner: HR"],[78,"  - name: research"],
  [79,"    owner: Graduate research school"],[85,"  - name: fees"],[86,"    owner: Finance"]];
const WD_MODEL=[[1,"models:"],[2,""],[3,"  - name: core_award"],[4,"    description: >"],[5,"      An award the university offers, as it stood from"],[0,"      valid_from until valid_to."],
  [6,"      {{ doc(\"award\") }}"],[7,"    latest_version: 1"],[8,"    config:"],[9,"      meta:"],[10,"        grain: One row per award per version"],
  [11,"        owner: Mei Tanaka, registrar's office"],[12,"        domain: course"],[13,"        glossary_term: award"]];
// a line of a file in type: a key in blue ink, the rest dark, the dash of a list muted
const WD_KEY=[40,92,150];
function wd_yaml(ctx,s,x,y){const m=s.match(/^(\s*(?:- )?)([A-Za-z_]+:)?(.*)$/),cw=tw(ctx,"m",28,500,"mono");let cx=x+m[1].length*cw;
  if(m[1].includes("-"))wc_T(ctx,"-",x+m[1].indexOf("-")*cw,y,{f:"mono",w:500,size:28,col:WC_MUTED});
  if(m[2]){wc_T(ctx,m[2],cx,y,{f:"mono",w:500,size:28,col:WD_KEY});cx+=m[2].length*cw;}
  if(m[3])wc_T(ctx,m[3],cx,y,{f:"mono",w:500,size:28,col:WC_DARK});}
// a file open on the screen: its path in the bar, the line numbers in a gutter, then its lines; show (0 to 1) brings the lines in from
// the top as it opens, lit(i) washes line i in gold
const WD_LH=36,wd_lineY=i=>GV_SC[1]+54+44+i*WD_LH;
function wd_file(ctx,path,lines,o){o=o||{};const [x,y,w,h]=GV_SC,bar=54,show=o.show==null?1:o.show;
  gv_screen(ctx,x,y,w,h,null,q=>{wc_T(q,path,x+22,y+bar*0.7,{f:"mono",w:500,size:28,col:[255,255,255]});q.save();q.beginPath();q.rect(x,y+bar,w,h-bar);q.clip();
    lines.forEach(([n,s],i)=>{const ly=wd_lineY(i),a=clamp(show*lines.length*1.25-i,0,1);if(a<=0.01)return;const l=o.lit?o.lit(i):0;
      withA(q,a,()=>{if(l>0.01)gv_tint(q,x+92,ly-28,w-116,WD_LH+2,GV.gold,0.75*l);if(n)wc_T(q,String(n),x+72,ly,{f:"mono",w:500,size:24,align:"right",col:WC_MUTED,deco:true});
        if(s)wd_yaml(q,s,x+100,ly);});});q.restore();},{barH:bar});}
// a gold tick on an office's glass on the floor, under its name, as its owner is confirmed (p 0 to 1)
function wd_glassTick(ctx,i,p){if(p<=0)return;const F=GV_FL,x=F.x(i)+F.w-48,y=F.top+124,k=0.9+0.1*spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(p*2.5,0,1),()=>{wc_wash(ctx,wc_ell(0,0,26,26,24),GV.gold,{kind:"thing",lw:1.4,seed:50+i});wc_tick(ctx,0,2,30,GV.goldInk,clamp(p*1.6-0.3,0,1),5);});ctx.restore();}

/* ---------- 4 · Three roles: owner, steward, custodian ---------- */
// text broken into lines that fit w, at most n of them, the last cut short with an ellipsis if it must be
function wd_wrap(ctx,s,size,wt,w,n){const words=s.split(" "),out=[];let cur="";for(const wd of words){const t=cur?cur+" "+wd:wd;
    if(tw(ctx,t,size,wt)<=w||!cur)cur=t;else{out.push(cur);cur=wd;}}if(cur)out.push(cur);
  if(out.length>n){const last=out.slice(n-1).join(" ");let c=last;while(c.length&&tw(ctx,c+"…",size,wt)>w)c=c.slice(0,-1);out.length=n-1;out.push(c.replace(/[ ,.;]+$/,"")+"…");}return out;}
// a role's card: its name, what it does, and who holds it, written in by hand (o.name, o.np 0 to 1); gold for the business side's
// roles, cyan for the platform's
function wd_roleCard(ctx,x,y,w,h,head,desc,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA==null?0.32:o.washA,seed:o.seed||(x|0)});
  wc_T(ctx,head,x+24,y+52,{w:800,size:40,col:WC_DARK});if(desc)wc_T(ctx,desc,x+24,y+98,{w:600,size:28,col:WC_INK});
  if(o.name&&o.np>0)wc_hand(ctx,o.name,x+24,y+h-26,{p:o.np,size:32,col:o.nameCol||GV.goldInk});
  if(o.pin)gv_pin(ctx,x+w/2,y+12,o.pinCol||GV.red);}
// a card that drops in from above at t0 and settles (p 0 to 1); fn draws it at its place
function wd_drop(ctx,p,fn){if(p<=0)return;const e=easeCam(clamp(p,0,1)),k=0.94+0.06*spring(p);ctx.save();ctx.translate(0,-50*(1-e));withA(ctx,clamp(p*2.2,0,1),fn);ctx.restore();}
// Mei's screen at her desk: the glossary's term award, its definition in grey, and its owner, lit as it's named
function wd_glossMini(ctx,lit){const [x,y,w,h]=GV_RX.screen;gv_screen(ctx,x,y,w,h,"Glossary",q=>{wc_T(q,"award",x+30,y+112,{w:800,size:52,col:WC_DARK});
  gv_lines(q,x+30,y+148,w-80,3,30,0.9);if(lit>0.01)gv_tint(q,x+18,y+250,w-36,52,GV.gold,0.7*lit);
  wc_T(q,"owner: Mei Tanaka",x+30,y+288,{w:700,size:30,col:WC_DARK});},{titleSize:28});}
// the log of identity decisions, as the screen shows the file: one row a decision, the long cells wrapped. lit[col] washes a column in
// gold (0 to 1)
const WD_LOG=[["D-001","same","Mei Tanaka, registrar's office","2026-10-06","Two learners share this email. Linh Nguyen confirmed she took Health Literacy; Minh Nguyen took no short courses."],
  ["D-002","same","Mei Tanaka, registrar's office","2026-10-06","Daniel Kim enrolled with his work email and gave his student ID on the enrolment form."],
  ["D-003","different","Mei Tanaka, registrar's office","2026-10-07","Aisha Rahman's account carries Aisha Karimi's student ID, typed by mistake. Two people; the learning team will correct the field."],
  ["D-004","different","Mei Tanaka, registrar's office","2026-10-07","Flagged as look-alikes: the same course on the same day (certificates C-88 and C-91). Two people."]];
const WD_LOGC=[["decision_id",0,180],["decision",196,140],["decided_by",350,240],["decided_on",606,170],["reason",790,400]],WD_LOGH=104;
const wd_logCol=j=>GV_SC[0]+40+WD_LOGC[j][1],wd_logRow=i=>GV_SC[1]+54+96+i*WD_LOGH;
function wd_log(ctx,o){o=o||{};const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,null,q=>{wc_T(q,"seeds/reference/student/learner_identity_decisions.csv",x+22,y+38,{f:"mono",w:500,size:28,col:[255,255,255]});
  WD_LOGC.forEach(([hd,cx,cw],j)=>{const l=(o.lit||[])[j]||0;if(l>0.01)gv_tint(q,wd_logCol(j)-12,y+70,cw+14,40+WD_LOG.length*WD_LOGH,GV.gold,0.7*l);
    wc_T(q,hd,wd_logCol(j),y+54+52,{f:"mono",w:500,size:26,col:WC_MUTED});});
  q.save();q.strokeStyle=rgba(WC_PENCIL,0.3);q.lineWidth=1.5;for(let i=0;i<=WD_LOG.length;i++){const ry=wd_logRow(i)-36;q.beginPath();q.moveTo(x+24,ry);q.lineTo(x+w-24,ry);q.stroke();}q.restore();
  WD_LOG.forEach((r,i)=>{const a=o.rows?o.rows(i):1;if(a<=0.01)return;withA(q,a,()=>r.forEach((v,j)=>{const [,cx,cw]=WD_LOGC[j],mono=j===0||j===3;
    (j>=2?wd_wrap(q,v,26,600,cw,j===4?3:2):[v]).forEach((l,k)=>wc_T(q,l,wd_logCol(j),wd_logRow(i)+k*31,mono?{f:"mono",w:500,size:26,col:WC_DARK}:{w:j===1?700:600,size:26,col:WC_DARK}));}));});},{barH:54});}
// Sam's two screens on the platform team: the platform's tables, core_award among them (lit, 0 to 1), and the platform's own pages,
// in grey
const WD_TABLES=["core_award","core_credential","core_credit_towards_award","core_learner"];
function wd_platScreens(ctx,lit){const [a,b]=GV_PX.screens;gv_screen(ctx,a[0],a[1],a[2],a[3],"Tables",q=>{WD_TABLES.forEach((n,i)=>{const ry=a[1]+96+i*56;
    if(i===0&&lit>0.01)gv_tint(q,a[0]+14,ry-34,a[2]-28,48,[64,170,210],0.6*lit);wc_T(q,n,a[0]+28,ry,{f:"mono",w:500,size:28,col:WC_DARK});});},{titleSize:28,bar:[52,110,128]});
  gv_screen(ctx,b[0],b[1],b[2],b[3],"Platform",q=>{for(let i=0;i<5;i++){gv_lines(q,b[0]+28,b[1]+80+i*48,b[2]-120,1,0,0.9);}},{titleSize:28,bar:[52,110,128]});}

/* ---------- 5 · Who decides what: each domain its own words, governance a few shared rules, the council the rest ---------- */
// Yusuf's board: a card for each domain with its owner, from the map; over them, a gold band for the rules every domain shares
const WD_DOM=[["person","Registrar's office"],["student","Registrar's office"],["course","Registrar's office, with the faculties"],["organisation","Planning"],
  ["admissions","Admissions office"],["staff","HR"],["research","Graduate research school"],["fees","Finance"]];
const WD_DC={w:320,h:176,x:i=>275+(i%4)*350,y:i=>316+Math.floor(i/4)*206};
// a domain's card: its name, its owner (on two lines if it must), a gold dot once it decides its own words (dot 0 to 1), lit gold
function wd_domCard(ctx,i,dot,lit){const x=WD_DC.x(i),y=WD_DC.y(i),[nm,ow]=WD_DOM[i];wc_panel(ctx,x,y,WD_DC.w,WD_DC.h,{kind:"card",wash:lit>0.01?GV.gold:null,washA:0.4*lit,seed:90+i});
  gv_pin(ctx,x+WD_DC.w/2,y+12,GV.red,1.1);wc_T(ctx,nm,x+22,y+62,{w:800,size:38,col:WC_DARK});
  wd_wrap(ctx,ow,28,600,WD_DC.w-44,2).forEach((l,k)=>wc_T(ctx,l,x+22,y+106+k*34,{w:600,size:28,col:WC_INK}));
  if(dot>0.01){const k=0.8+0.2*spring(dot);ctx.save();ctx.translate(x+WD_DC.w-30,y+34);ctx.scale(k,k);withA(ctx,clamp(dot*2,0,1),()=>wc_wash(ctx,wc_ell(0,0,15,15,18),GV.gold,{kind:"thing",lw:1.2,seed:120+i}));ctx.restore();}}
// the band over them: what governance sets, shared by every domain, and the two rules the voice names
function wd_band(ctx,a,r1,r2){if(a>0.01)withA(ctx,a,()=>{wc_panel(ctx,260,96,1400,72,{kind:"card",wash:GV.gold,washA:0.55,seed:131});
    wc_T(ctx,"shared by every domain",960,146,{w:800,size:36,align:"center",col:WC_DARK});});
  [[r1,"one glossary",555,300],[r2,"one way to classify data",885,480]].forEach(([p,txt,x,w])=>wd_drop(ctx,p,()=>{wc_panel(ctx,x,186,w,78,{kind:"card",wash:GV.gold,washA:0.22,seed:x});
    wc_T(ctx,txt,x+w/2,236,{w:700,size:34,align:"center",col:WC_DARK});}));}
// the stewards' whiteboard, close: its notes on the right, as in the meeting room, and room on the left for what Yusuf writes
const WD_MB=[150,60,1620,800];
function wd_paintMeetBoard(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.meet,{kind:"plaster",line:false,seed:83});
  gv_lightGlow(ctx,900,-60,900);const [bx,by,bw,bh]=WD_MB,k=bw/660;
  wc_part(ctx,wc_rect(bx-14,by-14,bw+28,bh+28),GV.metal,1,{lw:1.4});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  const R=wc_rng(14);[[300,40],[420,40],[540,40]].forEach(([gx,gy],g)=>{for(let i=0;i<5-(g%2);i++){const nx=bx+(gx+(i%2)*56+(R()-0.5)*8)*k,ny=by+(gy+30+Math.floor(i/2)*64+(R()-0.5)*6)*k;
    gv_note(ctx,nx,ny,50*k,GV_NOTE[(g+i)%4],(R()-0.5)*0.12,30+g*7+i);}});
  ctx.save();ctx.strokeStyle=rgba([60,110,170],0.6);ctx.lineWidth=3.4*k*0.6;ctx.lineCap="round";for(const [lx,ly,lw] of [[290,22,84],[410,22,70],[530,22,90]]){ctx.beginPath();ctx.moveTo(bx+lx*k,by+ly*k);ctx.lineTo(bx+(lx+lw)*k,by+ly*k+2);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(bx+bw*0.3,by+bh+14,bw*0.4,16),GV.metal,1);}
// marker on a whiteboard: handwriting in blue ink, written in as p goes 0 to 1; o.deco when it's too small to read on purpose (the
// close-up reads it)
const WD_MARK=[36,74,150];
function wd_marker(ctx,s,x,y,p,o){o=o||{};if(p<=0)return;const n=Math.ceil(s.length*clamp(p,0,1));ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.18,1,0,0);
  wc_T(ctx,s.slice(0,n),0,0,{w:600,size:o.size||44,col:o.col||WD_MARK,deco:o.deco});ctx.restore();}
// what Yusuf writes on it: the council decides conflicts and exceptions, by the next meeting; if it can't agree, the deputy
// vice-chancellor. ps: how far each line is written; drawn in the board's own frame (bx, by, k: where the board is, and its size)
const WD_RULE=[["the council decides:",400],["conflicts · exceptions",466],["by the next meeting",532],["if it can't agree:",150],["the deputy vice-chancellor",214]];
function wd_councilRule(ctx,ps,bx,by,k,deco){WD_RULE.forEach(([s,y],i)=>wd_marker(ctx,s,bx+(i===1||i===2?70:40)*k,by+y*k,ps[i]||0,{size:44*k,deco,col:i===3||i===4?GV.goldInk:WD_MARK}));
  const a=ps[3]||0;if(a>0.01){ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.8);ctx.lineWidth=4*k;ctx.lineCap="round";const ax=bx+300*k,y0=by+342*k,y1=by+(342-88*clamp(a*2,0,1))*k;
    ctx.beginPath();ctx.moveTo(ax,y0);ctx.lineTo(ax,y1);ctx.stroke();if(a>0.5){ctx.beginPath();ctx.moveTo(ax-12*k,y1+14*k);ctx.lineTo(ax,y1);ctx.lineTo(ax+12*k,y1+14*k);ctx.stroke();}ctx.restore();}}

/* ---------- 6 · Required: a check on every change, and the council's oldest action closed ---------- */
// a gold card on the data team's board, low enough on it for Noor to pin
const WD_TC=()=>{const [bx,by]=GV_DT.board;return {x:bx+60,y:by+246,w:350,h:104};};
function wd_teamCard(ctx,p){wd_drop(ctx,p,()=>{const C=WD_TC();wc_panel(ctx,C.x,C.y,C.w,C.h,{kind:"card",wash:GV.gold,washA:0.5,seed:141});
  gv_pin(ctx,C.x+C.w/2,C.y+14,GV.red,1.1);wc_T(ctx,"owner: required",C.x+C.w/2,C.y+68,{w:800,size:38,align:"center",col:WC_DARK});});}
// a check's mark: a spinner while it runs, a green tick when it passes, a red cross when it fails
function wd_mark(ctx,x,y,st,t){if(st===0){ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.stroke();ctx.restore();return;}
  if(st===1){ctx.save();ctx.strokeStyle=rgba([196,150,40],0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,11,t*6,t*6+4.2);ctx.stroke();ctx.restore();return;}
  if(st===2){wc_tick(ctx,x,y,26,GV.greenInk,1,5);return;}
  ctx.save();ctx.strokeStyle=rgba(GV.redInk,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-10,y-10);ctx.lineTo(x+10,y+10);ctx.moveTo(x+10,y-10);ctx.lineTo(x-10,y+10);ctx.stroke();ctx.restore();}
// the button that puts a change in: grey, until it's reviewed; lit (0 to 1) washes it in gold
function wd_merge(ctx,bx,by,lit){const bw=170;gv_tint(ctx,bx-12,by-10,bw+24,72,GV.gold,0.6*(lit||0));ctx.save();ctx.fillStyle="rgba(222,225,230,1)";rr(ctx,bx,by,bw,52,10);ctx.fill();ctx.restore();
  wc_T(ctx,"Merge",bx+bw/2,by+36,{w:700,size:28,align:"center",col:[138,142,150]});}
// Jun's change, on his screen: its title, its files, and the button that puts it in, grey until it's reviewed (o.before lights it).
// Then its checks: o.checks brings in the governance check, o.dom and o.core tick its first two rows, o.fail stops it on the marts,
// o.msg brings in its message, o.what and o.where light what to add and where; o.fix types the two lines Jun adds in its place, and
// o.rerun runs the check again, until it passes
const WD_CHG={title:"Add a completions mart for Planning",files:["models/marts/planning/_planning__models.yml","models/marts/planning/mart_planning__completions.sql"],
  msg:["owner: models/marts/planning/_planning__models.yml:","mart_planning__completions has no meta.owner or meta.domain","(how to: docs/how-to/add-an-owner.md)"],
  add:["+        owner: Planning","+        domain: planning"]};
function wd_change(ctx,t,o){const [x,y,w,h]=GV_SC,g=k=>clamp(o[k]||0,0,1),re=g("rerun"),fail=g("fail");
  gv_screen(ctx,x,y,w,h,"Changes for review",q=>{wc_T(q,WD_CHG.title,x+40,y+120,{w:800,size:40,col:WC_DARK});wc_T(q,"Jun Park · 2 files",x+40,y+166,{w:600,size:28,col:WC_MUTED});
    wd_merge(q,x+w-210,y+82,g("before"));
    WD_CHG.files.forEach((f,i)=>wc_T(q,f,x+40,y+222+i*40,{f:"mono",w:500,size:28,col:WC_INK}));
    if(g("checks")<=0.01)return;withA(q,g("checks"),()=>{wc_T(q,"checks",x+40,y+330,{w:700,size:28,col:WC_MUTED});
      // the check, and its three rows: each comes in once the one before it passes; the rerun runs them all again
      const all=re>=1?2:re>0?1:fail>0?-1:1,rows=[["domains",g("checks"),g("dom")],["core models",g("dom"),g("core")],["marts",g("core"),0]];
      wd_mark(q,x+58,y+370,all,t);wc_T(q,"governance",x+86,y+381,{w:800,size:32,col:WC_DARK});
      if(all===-1)wc_tag(q,x+w-50,y+370,"1 problem",{align:"right",size:28,wash:GV.red,washA:0.35,col:GV.redInk});
      if(all===2)wc_tag(q,x+w-50,y+370,"passed",{align:"right",size:28,wash:GV.green,washA:0.35,col:GV.greenInk});
      rows.forEach(([s2,on,ok],i)=>{if(on<=0.01)return;const st=re>=1?2:re>0?1:ok>=1?2:i===2&&fail>0?-1:1;
        withA(q,on,()=>{wd_mark(q,x+98,y+424+i*44,st,t);wc_T(q,s2,x+126,y+434+i*44,{w:600,size:30,col:WC_INK});});});});
    // the message, what to add and where; then the two lines Jun adds, in its place
    const box=(a,fn)=>{if(a>0.01)withA(q,a,()=>{wc_panel(q,x+30,y+556,w-60,124,{kind:"card",seed:151});fn();});};
    box(g("msg")*(1-g("fix")),()=>{const lw=i=>tw(q,WD_CHG.msg[i],26,500,"mono");
      gv_tint(q,x+48,y+598-26,lw(0)+16,34,GV.gold,0.6*g("where"));gv_tint(q,x+48,y+632-26,lw(1)+16,34,GV.gold,0.6*g("what"));
      WD_CHG.msg.forEach((l,i)=>wc_T(q,l,x+56,y+598+i*34,{f:"mono",w:500,size:26,col:i===1?GV.redInk:WC_INK}));});
    box(g("fix"),()=>{wc_T(q,WD_CHG.files[0],x+56,y+598,{f:"mono",w:500,size:26,col:WC_MUTED});
      WD_CHG.add.forEach((l,i)=>{const n=Math.ceil(l.length*clamp(g("fix")*2.2-0.4-i*0.5,0,1));if(n>0)wc_T(q,l.slice(0,n),x+56,y+634+i*34,{f:"mono",w:500,size:26,col:GV.greenInk});});});},
    {titleSize:28});}
// the council's minutes on Yusuf's desk, one sheet a month, the newest on top: each carries the action "name the data owners",
// stamped carried forward, until the newest, which a green stamp closes (done, 0 to 1)
const WD_MINS=["June","July","August","September"];
function wd_minutes(ctx,t,a,done){WD_MINS.forEach((m,i)=>{const x=270+i*120,y=100+i*150,last=i===WD_MINS.length-1;withA(ctx,a,()=>{gv_sheet(ctx,x,y,980,640,{rot:(i%2?0.012:-0.01)});
    wc_T(ctx,"Data council · minutes · "+m+" 2026",x+48,y+62,{w:700,size:32,col:WC_MUTED});wc_T(ctx,"Action: name the data owners",x+48,y+120,{w:800,size:36,col:WC_DARK});
    if(!last)gv_stamp(ctx,x+800,y+96,"CARRIED FORWARD",1,{size:28,rot:-0.07,col:GV.redInk});
    else{gv_lines(ctx,x+48,y+190,880,6,40);gv_stamp(ctx,x+790,y+130,"DONE",done,{size:58,rot:-0.09,col:GV.greenInk});}});});}

/* ---------- 7 · Asked by name: the list of who reviews what, written from the owners; a change that asks its owner ---------- */
// a pane inside a screen: a bar with a path in type, then what fn draws under it
function wd_pane(ctx,x,y,w,h,title,fn){ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);
  ctx.fillStyle="rgba(88,110,150,1)";ctx.fillRect(x,y,w,42);ctx.restore();wc_T(ctx,title,x+18,y+30,{f:"mono",w:500,size:26,col:[255,255,255]});if(fn)fn(ctx);}
// the course domain's model (lines 18 and 22: the award, and its owner), and the list of who reviews what, its first two lines and
// the course domain's, as the example project has them; long lines wrap, as an editor wraps them, the number on the first part only
const WD_CM=[[18,"  - name: award"],[22,"    owner: Mei Tanaka, registrar's office"]];
const WD_CO=[[1,["# Generated by scripts/generate/codeowners.py from the owners","  in the project's metadata and"]],
  [2,["# models/_shared/_shared__owners.yml. Don't edit it: change","  the metadata, then run the script."]],
  [16,["# Meaning and contracts: core domains"]],
  [17,["/models/core/course/_course__conceptual.yml","  mei.tanaka@uni.example noor@uni.example data.governance@uni.example"]],
  [18,["/models/core/course/_course__decisions.yml","  mei.tanaka@uni.example noor@uni.example data.governance@uni.example"]]];
const WD_PM=[350,90,1220,150],WD_PC=[350,258,1220,470],WD_CLH=34;
// a row of the list in type: a comment muted, a path in blue ink, the addresses dark, Mei's in gold ink when mei is lit
function wd_coRow(ctx,s,x,y,mei){const col=s.startsWith("#")||(s.startsWith("  ")&&!s.includes("@"))?WC_MUTED:s.startsWith("/")?WD_KEY:WC_DARK;
  if(!s.includes("mei.tanaka@")||mei<=0.01){wc_T(ctx,s,x,y,{f:"mono",w:500,size:26,col});return;}
  const i=s.indexOf("mei.tanaka@"),cw=tw(ctx,"m",26,500,"mono"),j=i+"mei.tanaka@uni.example".length,o={f:"mono",w:500,size:26,col};
  if(i>0)wc_T(ctx,s.slice(0,i),x,y,o);wc_T(ctx,s.slice(i,j),x+i*cw,y,Object.assign({},o,{col:mix(col,GV.goldInk,mei)}));if(s.length>j)wc_T(ctx,s.slice(j),x+j*cw,y,o);}
// the list of who reviews what in a pane: its lines as given ([number, [parts]]), the parts of a long line wrapped, a gap where lines
// are left out. o.fill(n) writes line n (0 to 1: its path, then its addresses), o.lit(n) washes it in gold, o.mei(n) turns Mei's
// address gold; o.under and o.after draw under and over the text, given where each part sits
function wd_coPane(q,R,lines,o){o=o||{};const cw=tw(q,"m",26,500,"mono"),X=R[0]+92,rows=[];let y=R[1]+42+40;
  lines.forEach(([n,parts],i)=>{if(i&&n>lines[i-1][0]+1)y+=14;parts.forEach((p2,k)=>{rows.push({n,k,s:p2,y});y+=WD_CLH;});});
  wd_pane(q,...R,"CODEOWNERS",()=>{if(o.under)o.under(rows,X,cw);
    rows.forEach(r=>{const fill=o.fill?o.fill(r.n):1;if(fill<=0.01)return;const l=o.lit?o.lit(r.n):0;
      if(l>0.01)gv_tint(q,X-8,r.y-27,r.s.length*cw+16,36,GV.gold,0.7*l);
      if(!r.k)wc_T(q,String(r.n),R[0]+66,r.y,{f:"mono",w:500,size:24,align:"right",col:WC_MUTED,deco:true});
      const u=clamp(fill*2-r.k,0,1),nn=Math.ceil(r.s.length*u);if(nn>0)wd_coRow(q,r.s.slice(0,nn),X,r.y,o.mei?o.mei(r.n):0);});
    if(o.after)o.after(rows,X,cw);});return rows;}
// a gold thread, drawn from (x0,y0) to (x1,y1) as p goes 0 to 1, bowing out to the left by bend
function wd_thread(ctx,x0,y0,x1,y1,p,bend){if(p<=0)return;const n=48,m=Math.ceil(n*clamp(p,0,1)),cx=Math.min(x0,x1)-bend,cy=(y0+y1)/2;ctx.save();
  ctx.strokeStyle=rgba(GV.goldInk,0.75);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  for(let i=0;i<=m;i++){const u=i/n,a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u,px=a*x0+b*cx+c*x1,py=a*y0+b*cy+c*y1;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  if(p>=1){ctx.fillStyle=rgba(GV.goldInk,0.9);ctx.beginPath();ctx.arc(x1,y1,6,0,TAU);ctx.fill();}ctx.restore();}
// Jun's screen: the course domain's model above, the list of who reviews what below. o.lit lights the award's owner; o.fill(k) writes
// line 17 or 18 of the list (k 0 or 1), o.thread(k) runs a thread from the owner to it; o.hand lights "Don't edit it", o.ok brings in
// the check that the list is up to date
function wd_owners(ctx,t,o){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,null,q=>{const cm=tw(q,"m",28,500,"mono"),f=n=>n>=17?(o.fill?o.fill(n-17):1):1;
    wd_pane(q,...WD_PM,"models/core/course/_course__conceptual.yml",()=>{WD_CM.forEach(([n,s2],i)=>{const ly=WD_PM[1]+42+44+i*40;
      if(i===1&&o.lit>0.01)gv_tint(q,WD_PM[0]+86,ly-29,WD_PM[2]-110,40,GV.gold,0.75*o.lit);
      wc_T(q,String(n),WD_PM[0]+66,ly,{f:"mono",w:500,size:24,align:"right",col:WC_MUTED,deco:true});wd_yaml(q,s2,WD_PM[0]+92,ly);});});
    wd_coPane(q,WD_PC,WD_CO,{fill:f,mei:n=>n>=17?clamp(f(n)*2-1,0,1):0,lit:n=>n===2?(o.hand||0):0,
      // the threads, under the text: from Mei's name in the model to her address in each line of the list
      under:(rows,X,cw)=>{const sx=WD_PM[0]+92+15*cm,sy=WD_PM[1]+42+44+40+10;
        [17,18].forEach((n,k)=>{const r=rows.find(r2=>r2.n===n&&r2.k===1);if(o.thread)wd_thread(q,sx,sy,X+2*cw+4,r.y-30,o.thread(k),180+40*k);});},
      // the check that the list matches the owners, at the foot of the pane
      after:()=>{if(o.ok>0.01)withA(q,clamp(o.ok*2,0,1),()=>{const tx=WD_PC[0]+WD_PC[2]-30,ty=WD_PC[1]+WD_PC[3]-46,
        tw2=wc_tag(q,tx,ty,"up to date",{align:"right",size:28,wash:GV.green,washA:0.45,col:GV.greenInk});wc_tick(q,tx-tw2-30,ty,30,GV.greenInk,o.ok,5);});}});},
    {bar:GV.screen});}
// someone's face in a small circle, as a list of reviewers shows it: the figure drawn small, its head in the circle
function wd_face(ctx,id,cx,cy,r){ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle=rgba([232,226,214],1);ctx.fill();ctx.clip();
  const s=r/62;person(ctx,id,cx,cy+(560-60)*s*PEOPLE[id].build.h*0.98,s,{pose:"stand",shadow:false});ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.restore();}
// Jun's next change, on his screen: one file, the course domain's model. Its reviewers, asked by the list of who reviews what, fill in
// by themselves (rev(i), 0 to 1), each with "review requested"; say(i) lights a name as the voice says it
const WD_REV=[["mei","Mei Tanaka"],["noor","Noor"],["yusuf","Yusuf Demir"]];
function wd_change2(ctx,t,o){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Changes for review",q=>{
    wc_T(q,"Map award to the government's definition",x+40,y+120,{w:800,size:40,col:WC_DARK});wc_T(q,"Jun Park · 1 file",x+40,y+166,{w:600,size:28,col:WC_MUTED});
    wd_merge(q,x+w-210,y+82,0);wc_T(q,"models/core/course/_course__conceptual.yml",x+40,y+222,{f:"mono",w:500,size:28,col:WC_INK});
    wc_T(q,"Reviewers",x+40,y+316,{w:700,size:30,col:WC_MUTED});wc_T(q,"asked by the list of who reviews what",x+210,y+316,{w:500,size:28,col:WC_MUTED});
    WD_REV.forEach(([id,n],i)=>{const a=o.rev?o.rev(i):1;if(a<=0.01)return;const ry=y+392+i*86,k=0.9+0.1*spring(a);
      withA(q,clamp(a*2,0,1),()=>{q.save();q.translate(x+80,ry);q.scale(k,k);q.translate(-x-80,-ry);wd_face(q,id,x+80,ry,32);
        const l=o.say?o.say(i):0;if(l>0.01)gv_tint(q,x+120,ry-26,tw(q,n,34,700)+24,48,GV.gold,0.7*l);
        wc_T(q,n,x+132,ry+12,{w:700,size:34,col:WC_DARK});wc_tag(q,x+460,ry,"review requested",{size:28,wash:GV.gold,washA:0.45,col:GV.goldInk});q.restore();});});},
    {titleSize:28});}
// Mei's screen: Jun's change asks her to review it; lit (0 to 1) brings it in, amber (0 to 1) lights it as a lamp lights on the line
function wd_request(ctx,lit,amber){const [x,y,w,h]=GV_RX.screen;gv_screen(ctx,x,y,w,h,"Review requested",q=>{if(lit<=0.01)return;withA(q,lit,()=>{
    wc_T(q,"Jun asks you to review",x+30,y+98,{w:600,size:28,col:WC_MUTED});
    ["Map award to the","government's definition"].forEach((l,i)=>wc_T(q,l,x+30,y+154+i*48,{w:800,size:38,col:WC_DARK}));
    wc_tag(q,x+30,y+278,"owner of: award",{size:28,wash:GV.gold,washA:0.45,col:GV.goldInk});});},{titleSize:28});
  // lit as a lamp lights on the line: the screen's bar turns amber, and a warm light falls round it
  if(amber>0.01){ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,x+w/2,y+h/2,w*0.95,[255,214,150],0.55*amber);ctx.restore();
    withA(ctx,amber,()=>{ctx.fillStyle=rgba(WD_LAMP.amber,1);ctx.fillRect(x,y,w,40);wc_T(ctx,"Review requested",x+18,y+29,{w:700,size:28,col:WC_DARK});});}}

/* ---------- 8 · Where the work is: what, who, when and why, in a log beside the model ---------- */
// four cards beside Mei's screen, one for each thing a decision records, each as the voice names it (p(i), 0 to 1)
const WD_WWWW=["what","who","when","why"];
function wd_fourCards(ctx,p){WD_WWWW.forEach((s2,i)=>wd_drop(ctx,p(i),()=>{const cx=770+(i%2)*184,cy=420+Math.floor(i/2)*112;
  wc_panel(ctx,cx,cy,164,90,{kind:"card",wash:GV.gold,washA:0.45,seed:160+i});gv_pin(ctx,cx+82,cy+12,GV.red,1);
  wc_T(ctx,s2,cx+82,cy+64,{w:800,size:40,align:"center",col:WC_DARK});}));}
// the course domain's log, in the pane below its model: its first decision, then a new one, written as far as o.write (0 to 1) says:
// Mei decides it, it's proposed, its date and its reason still to come (a cursor waits after "why:"). o.model lights the award's owner
// above, o.folder the folder the two files share, o.mei the line that says who decides
const WD_CL=[[10,"  - id: DEC-CRS-01"],[12,"    title: The award needs no intermediate step"],[16,"    status: agreed"]];
const WD_CN=[[19,"  - id: DEC-CRS-02"],[20,"    step: consumer_output"],[21,"    title: How award maps to the government's definition"],
  [22,"    decided_by: Mei Tanaka, registrar's office"],[23,"    decided_on:"],[24,"    why:"],[25,"    status: proposed"]];
function wd_courseLog(ctx,t,o){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,null,q=>{const cm=tw(q,"m",28,500,"mono"),cb=tw(q,"m",26,500,"mono"),
    folder=(R)=>{if(o.folder>0.01)gv_tint(q,R[0]+12,R[1]+6,"models/core/course/".length*cb+12,32,GV.gold,0.9*o.folder);};
    wd_pane(q,...WD_PM,"models/core/course/_course__conceptual.yml",()=>{folder(WD_PM);WD_CM.forEach(([n,s2],i)=>{const ly=WD_PM[1]+42+44+i*40;
      if(i===1&&o.model>0.01)gv_tint(q,WD_PM[0]+86,ly-29,WD_PM[2]-110,40,GV.gold,0.75*o.model);
      wc_T(q,String(n),WD_PM[0]+66,ly,{f:"mono",w:500,size:24,align:"right",col:WC_MUTED,deco:true});wd_yaml(q,s2,WD_PM[0]+92,ly);});});
    wd_pane(q,...WD_PC,"models/core/course/_course__decisions.yml",()=>{folder(WD_PC);const X=WD_PC[0]+92,y0=WD_PC[1]+42+42,lh=36;
      const row=(n,s2,ly,u)=>{wc_T(q,String(n),WD_PC[0]+66,ly,{f:"mono",w:500,size:24,align:"right",col:WC_MUTED,deco:true});
        const nn=Math.ceil(s2.length*u);if(nn>0)wd_yaml(q,s2.slice(0,nn),X,ly);};
      WD_CL.forEach(([n,s2],i)=>row(n,s2,y0+i*lh,1));
      // the new decision, typed line by line; the line that says who decides lit in gold
      const wr=o.write||0,n0=WD_CN.length;WD_CN.forEach(([n,s2],i)=>{const ly=y0+14+(WD_CL.length+i)*lh,u=clamp(wr*n0-i,0,1);if(u<=0)return;
        if(i===3&&o.mei>0.01)gv_tint(q,X-8,ly-28,s2.length*cm+16,38,GV.gold,0.7*o.mei);row(n,s2,ly,u);});
      // the cursor, after "why:", waiting for her reason
      if(wr>=1&&Math.floor(t*1.6)%2===0){const ly=y0+14+(WD_CL.length+5)*lh;q.save();q.fillStyle=rgba(WC_DARK,0.85);q.fillRect(X+(WD_CN[5][1].length+1)*cm,ly-24,3,30);q.restore();}});},
    {bar:GV.screen});}
// the list of who reviews what again, for the two logs Mei keeps: each line lit (lit(k), 0 to 1), her address in gold
const WD_CO2=[[16,["# Meaning and contracts: core domains"]],[18,["/models/core/course/_course__decisions.yml","  mei.tanaka@uni.example noor@uni.example data.governance@uni.example"]],
  [46,["# Data the business owns: each seed's owner"]],[51,["/seeds/reference/student/learner_identity_decisions.csv","  mei.tanaka@uni.example"]]];
function wd_logOwners(ctx,t,o){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,null,q=>{const k=n=>n===18?0:n===51?1:-1;
    wd_coPane(q,[350,200,1220,400],WD_CO2,{lit:n=>k(n)<0?0:o.lit(k(n)),mei:n=>k(n)<0?0:o.mei(k(n))});},{bar:GV.screen});}

/* ---------- 9 · Time to answer: time agreed with her manager, a small scope, someone to ask ---------- */
// the university registrar, Mei's manager: drawn here, as no other film has needed her yet
PEOPLE.wd_reg={name:"",role:"University registrar",side:"Business",does:"uses",edge:BIZ,seed:73,
  skin:[214,170,136],hair:{style:"curly",c:[186,182,180]},glasses:[70,58,54],earrings:[255,214,140],
  top:{kind:"blazer",c:[120,48,62],inner:[238,232,222]},bottom:{c:[46,48,60]},shoe:[40,32,32],build:{sh:68,hip:60,h:0.98}};
// Mei's screen before her role: her own work, lines of it
function wd_meiWork(ctx){const [x,y,w,h]=GV_RX.screen;gv_screen(ctx,x,y,w,h,"Student records",q=>gv_lines(q,x+30,y+92,w-80,6,38,0.9),{titleSize:28});}
// the calendar on Mei's wall, close: October 2026, Monday first, a week to a row (the 1st is a Thursday). The paper, its band and its
// grid are painted once; its words are drawn every frame. Two days are ringed in red, where the calendar in the shared picture has them
const WD_CAL={x:250,y:96,w:1420,band:104,head:52,dh:124,first:3,days:31};
const wd_calXY=(r,c)=>[WD_CAL.x+c*WD_CAL.w/7,WD_CAL.y+WD_CAL.band+WD_CAL.head+r*WD_CAL.dh];
function wd_paintCal(ctx){const C=WD_CAL,dw=C.w/7,top=C.y+C.band+C.head;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.reg,{kind:"plaster",line:false,seed:44});gv_lightGlow(ctx,900,-60,820);
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(60,70,90,0.22)";ctx.fillRect(C.x+10,C.y+16,C.w,top+5*C.dh+20-C.y);ctx.restore();
  wc_flat(ctx,wc_rect(C.x,C.y,C.w,top+5*C.dh+20-C.y),GV.paper,1,"page");wc_flat(ctx,wc_rect(C.x,C.y,C.w,C.band),[96,118,150],1,"band");
  wc_flat(ctx,wc_rect(C.x+5*dw,top,2*dw,5*C.dh),[238,236,230],0.9,"weekend");
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=1.6;for(let r=0;r<=5;r++){ctx.beginPath();ctx.moveTo(C.x,top+r*C.dh);ctx.lineTo(C.x+C.w,top+r*C.dh);ctx.stroke();}
  for(let c=1;c<7;c++){ctx.beginPath();ctx.moveTo(C.x+c*dw,top);ctx.lineTo(C.x+c*dw,top+5*C.dh);ctx.stroke();}ctx.restore();
  gv_pin(ctx,C.x+C.w/2,C.y-4,GV.red,1.6);}
function wd_calWords(ctx){const C=WD_CAL,dw=C.w/7;wc_T(ctx,"October 2026",C.x+40,C.y+70,{w:900,size:48,col:[255,255,255]});
  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach((d,c)=>wc_T(ctx,d,C.x+c*dw+18,C.y+C.band+38,{w:300,size:28,col:WC_MUTED}));
  for(let d=1;d<=C.days;d++){const i=C.first+d-1,[x,y]=wd_calXY(Math.floor(i/7),i%7);wc_T(ctx,String(d),x+16,y+38,{w:200,size:30,col:i%7>4?WC_MUTED:WC_DARK});}
  for(const d of [7,23]){const i=C.first+d-1,[x,y]=wd_calXY(Math.floor(i/7),i%7);ctx.save();ctx.strokeStyle=rgba([204,62,50],0.8);ctx.lineWidth=3.5;
    ctx.beginPath();ctx.ellipse(x+33,y+27,30,24,0.1,0,TAU);ctx.stroke();ctx.restore();}}
// her two hours, on Tuesday mornings: a gold label in each week's Tuesday, painted in from the left (p(k), 0 to 1, for week k)
function wd_calBlocks(ctx,p){const C=WD_CAL,dw=C.w/7;[6,13,20,27].forEach((d,k)=>{const u=p(k);if(u<=0)return;const i=C.first+d-1,[x,y]=wd_calXY(Math.floor(i/7),i%7),
    bx=x+10,by=y+52,bw=dw-20,bh=60;ctx.save();ctx.beginPath();ctx.rect(bx-8,by-8,(bw+16)*easeCam(clamp(u*1.4,0,1)),bh+16);ctx.clip();
    wc_panel(ctx,bx,by,bw,bh,{kind:"card",wash:GV.gold,washA:0.6,seed:180+k});ctx.restore();
    withA(ctx,clamp(u*2-0.8,0,1),()=>wc_T(ctx,"owner · 2 h",bx+bw/2,by+41,{w:400,size:28,align:"center",col:GV.goldInk}));});}
// Yusuf's desk again, from above: the cards he writes for Mei's role, each a gold card placed on the desk (p, 0 to 1); o.line(i)
// brings in each line as it's said, o.dy and o.rot lift a card away. WD_DK: where each card's centre is
const WD_DK={w:380,h:200,time:[900,230],own:[1210,560],ask:[1520,230]};
function wd_dkCard(ctx,at,head,lines,p,o){o=o||{};wd_drop(ctx,p,()=>{const [cx,cy]=at,w=WD_DK.w,h=WD_DK.h;ctx.save();ctx.translate(cx,cy+(o.dy||0));ctx.rotate(o.rot||0);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:GV.gold,washA:0.5,seed:o.seed||190});wc_T(ctx,head,-w/2+30,-h/2+50,{w:600,size:28,col:WC_MUTED});
  lines.forEach((l,i)=>{const a=o.line?o.line(i):1,ly=lines.length===1?-h/2+128:-h/2+108+i*54;if(a>0.01)withA(ctx,a,()=>wc_T(ctx,l,-w/2+30,ly,{w:600,size:44,col:WC_DARK}));});
  ctx.restore();});}
// round what she owns, in grey on slips of paper, words her office also uses that aren't hers (p(i), 0 to 1), set a little apart
const WD_NOT=[["enrolment",850,470],["census date",1570,470],["unit",880,700],["credit point",1560,700]];
function wd_notHers(ctx,p){WD_NOT.forEach(([s2,x,y],i)=>{const u=p(i);if(u<=0)return;const dx=(x<1210?-1:1)*22*easeCam(u),w=tw(ctx,s2,30,700)+40;
  withA(ctx,clamp(u*1.6,0,1),()=>{wc_panel(ctx,x+dx-w/2,y-36,w,56,{kind:"card",seed:200+i});wc_T(ctx,s2,x+dx,y+2,{w:700,size:30,align:"center",col:WC_MUTED});});});}
// a spreadsheet, printed: a name in a cell, and nothing else. lit (0 to 1) washes its row in gold; grey (0 to 1) greys the name
const WD_SS={x:110,y:150,w:540,h:560,rot:-0.012,rh:64,cols:[56,200,244],n:7};
function wd_sheetName(ctx,p,lit,grey){wd_drop(ctx,p,()=>{const S_=WD_SS,[c0,c1,c2]=S_.cols,gx=S_.x+20,gy=S_.y+30,gw=c0+c1+c2,rh=S_.rh;
  ctx.save();ctx.translate(S_.x+S_.w/2,S_.y+S_.h/2);ctx.rotate(S_.rot);ctx.translate(-S_.x-S_.w/2,-S_.y-S_.h/2);gv_sheet(ctx,S_.x,S_.y,S_.w,S_.h);
  ctx.fillStyle=rgba([232,234,238],1);ctx.fillRect(gx,gy,gw,40);ctx.fillRect(gx,gy,c0,40+S_.n*rh);
  if(lit>0.01)gv_tint(ctx,gx+c0,gy+40+rh,c1+c2,rh,GV.gold,0.6*lit);
  ctx.strokeStyle=rgba(WC_PENCIL,0.28);ctx.lineWidth=1.4;for(let r=0;r<=S_.n;r++){ctx.beginPath();ctx.moveTo(gx,gy+40+r*rh);ctx.lineTo(gx+gw,gy+40+r*rh);ctx.stroke();}
  for(const cx of [gx,gx+c0,gx+c0+c1,gx+gw]){ctx.beginPath();ctx.moveTo(cx,gy);ctx.lineTo(cx,gy+40+S_.n*rh);ctx.stroke();}
  ["A","B"].forEach((l,j)=>wc_T(ctx,l,gx+c0+(j?c1+c2/2:c1/2),gy+30,{w:500,size:28,align:"center",col:WC_MUTED,deco:true}));
  for(let r=0;r<S_.n;r++)wc_T(ctx,String(r+1),gx+c0/2,gy+40+r*rh+42,{w:500,size:28,align:"center",col:WC_MUTED,deco:true});
  wc_T(ctx,"element",gx+c0+14,gy+40+42,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"owner",gx+c0+c1+14,gy+40+42,{w:600,size:30,col:WC_MUTED});
  wc_T(ctx,"award",gx+c0+14,gy+40+rh+44,{w:600,size:34,col:mix(WC_DARK,WC_MUTED,grey)});
  wc_T(ctx,"Mei Tanaka",gx+c0+c1+14,gy+40+rh+44,{w:600,size:34,col:mix(WC_DARK,[180,178,172],grey)});ctx.restore();});}

/* ---------- 10 · Which award? Her screen asks her, and award turns out to be defined in five places ---------- */
// the three meanings of award, as the series keeps them: violet, the glossary on the platform's (microcredentials of 6 credit points or
// more count); rose, the words before Monday's (graduate certificates, masters and doctorates); olive, degrees only. A wash for each
// head, and an ink for its word
const WD_MEAN={violet:[110,92,190],rose:[214,96,140],olive:[150,156,56]},WD_MEANINK={violet:[78,58,160],rose:[168,50,98],olive:[94,100,22]};
// Mei's screen: Jun's change, opened: its title, and the line it changes, award's, lit in gold; what it adds is left unread
function wd_opened(ctx){const [x,y,w,h]=GV_RX.screen;gv_screen(ctx,x,y,w,h,"Jun Park · 1 file",q=>{
    ["Map award to the","government's definition"].forEach((l,i)=>wc_T(q,l,x+30,y+96+i*46,{w:800,size:36,col:WC_DARK}));
    q.fillStyle=rgba([238,240,244],1);q.fillRect(x+24,y+180,w-48,h-200);const cm=tw(q,"m",28,500,"mono");
    gv_tint(q,x+38+10*cm,y+194,5*cm+16,40,GV.gold,0.75);wd_yaml(q,"  - name: award",x+44,y+224);
    q.save();q.fillStyle=rgba(GV.green,0.14);q.fillRect(x+24,y+246,w-48,82);q.restore();gv_lines(q,x+70,y+268,w-170,2,32,0.9);},{titleSize:28});}
// a head in one of the meanings' colours: "award", the wash coming in as col goes from 0 to 1
function wd_head(ctx,x,y,w,m,col){if(col>0.01)gv_tint(ctx,x,y,w,58,WD_MEAN[m],0.9*col);wc_T(ctx,"award",x+16,y+43,{w:800,size:40,col:mix(WC_DARK,WD_MEANINK[m],col)});}
// the five places award is defined, round Mei, each headed "award", each coming in (p, 0 to 1) and its meaning's colour washing in
// (col, 0 to 1). From right to left, as One word, one home goes through them: her screen, the glossary on the platform (violet);
// Planning's spreadsheet, printed (rose); the registrar's policy, stapled, at its appendix (rose); a faculty's dashboard on a tablet
// (olive); the 2019 tool's printout, yellowed (rose). WD_FIVE: each one's box [x, y, w, h], its tilt and its meaning
const WD_FIVE=[[GV_RX.screen,0,"violet"],[[880,98,300,228],0.03,"rose"],[[650,34,232,280],-0.04,"rose"],[[186,84,292,200],0.035,"olive"],[[22,336,272,300],-0.06,"rose"]];
const WD_YELLOW=[238,224,176];
function wd_five(ctx,k,p,col){if(p<=0.001)return;const [[x,y,w,h],rot,m]=WD_FIVE[k];
  if(k===0){withA(ctx,p,()=>gv_screen(ctx,x,y,w,h,"Business glossary",q=>{wd_head(q,x+18,y+62,w-36,m,col);gv_lines(q,x+30,y+160,w-90,4,36,0.9);},{titleSize:28}));return;}
  const e=easeCam(clamp(p,0,1)),s=0.9+0.1*spring(clamp(p,0,1));ctx.save();ctx.translate(x+w/2,y+h/2+36*(1-e));ctx.rotate(rot);ctx.scale(s,s);ctx.translate(-w/2,-h/2);
  withA(ctx,clamp(p*2,0,1),()=>{
    // a spreadsheet, printed: grey bands for its letters and its numbers, and a grid
    if(k===1){gv_sheet(ctx,0,0,w,h);const g0=78,rh=26,cs=[12,36,124,214,w-12];ctx.save();ctx.fillStyle=rgba([226,229,234],1);ctx.fillRect(12,g0,w-24,18);ctx.fillRect(12,g0,24,h-g0-12);
      ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.2;for(let y=g0;y<=h-12;y+=rh){ctx.beginPath();ctx.moveTo(12,y);ctx.lineTo(w-12,y);ctx.stroke();}
      for(const cx of cs){ctx.beginPath();ctx.moveTo(cx,g0);ctx.lineTo(cx,h-12);ctx.stroke();}ctx.restore();wd_head(ctx,12,12,w-24,m,col);
      for(let r=0;r<3;r++)for(let j=1;j<4;j++)gv_lines(ctx,cs[j]+8,g0+18+r*rh+10,cs[j+1]-cs[j]-22,1,0,0.9);}
    // the registrar's policy, stapled, open at its appendix: a page behind, a title line, its definitions
    if(k===2){ctx.save();ctx.translate(16,10);ctx.rotate(0.05);gv_sheet(ctx,0,0,w,h);ctx.restore();gv_sheet(ctx,0,0,w,h);
      ctx.save();ctx.strokeStyle=rgba([120,124,134],0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(14,34);ctx.lineTo(40,10);ctx.stroke();ctx.restore();
      ctx.save();ctx.fillStyle=rgba(WC_INK,0.5);ctx.fillRect(56,22,w-100,7);ctx.restore();wd_head(ctx,14,46,w-28,m,col);gv_lines(ctx,28,134,w-60,4,30,0.9);
      ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(w/2-10,h-24,20,5);ctx.restore();}
    if(k===3){ctx.save();ctx.fillStyle=rgba(GV.bezel,1);rr(ctx,0,0,w,h,22);ctx.fill();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(16,16,w-32,h-32);ctx.restore();
      wd_head(ctx,16,18,w-32,m,col);[0.55,0.8,0.4,0.68].forEach((v,j)=>{ctx.save();ctx.fillStyle=rgba([140,168,200],0.9);ctx.fillRect(36+j*58,h-28-v*96,38,v*96);ctx.restore();});}
    if(k===4){ctx.save();ctx.shadowColor="rgba(70,60,40,0.25)";ctx.shadowBlur=12;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(WD_YELLOW,1);ctx.fillRect(0,0,w,h);ctx.restore();
      ctx.save();const g=ctx.createRadialGradient(w/2,h/2,h*0.2,w/2,h/2,h*0.8);g.addColorStop(0,"rgba(214,190,120,0)");g.addColorStop(1,"rgba(196,166,96,0.4)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();
      wd_head(ctx,12,16,w-24,m,col);gv_lines(ctx,24,104,w-50,5,32,0.75);}});
  ctx.restore();}
// Mei's screen changing what it shows (a, 0 to 1): the old fades to a blank screen, then the new comes in
function wd_swap(ctx,a,from,to){const [x,y,w,h]=GV_RX.screen,blank=()=>gv_screen(ctx,x,y,w,h,null,()=>{});
  if(a<=0)return from();if(a>=1)return to();if(a<0.5){from();withA(ctx,a*2,blank);}else{blank();withA(ctx,a*2-1,to);}}
