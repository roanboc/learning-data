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
// the desk in Yusuf's office painted again on its own, with its tray and pens, and the newest DMBOK standing on it, where the series
// keeps it (gv_deskBook), to go over him as he sits at it: the office's front layer
function wd_paintOfficeDesk(ctx){const O=GV_OFF;gv_desk(ctx,O.desk[0],O.desk[1],O.desk[2],O.fy+6,{left:true});
  const dx=O.desk[0]+O.desk[2];wc_part(ctx,wc_rect(dx-210,O.desk[1]-30,120,30),[226,218,204],1);wc_flat(ctx,wc_rect(dx-200,O.desk[1]-38,100,10),WC_CARD,1,"papers");
  wc_part(ctx,[[dx-70,O.desk[1]],[dx-30,O.desk[1]],[dx-34,O.desk[1]-58],[dx-66,O.desk[1]-58]],[96,118,150],1);
  for(const [px,a,c] of [[-58,-0.2,[60,60,70]],[-48,0.1,[204,62,50]],[-40,0.25,[60,60,70]]]){ctx.save();ctx.translate(dx+px,O.desk[1]-56);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}
  gv_deskBook(ctx);}
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
// register of areas on the right. WD_OPEN says where; the words are drawn every frame.
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
// how much of policy 2's page the frame shows (0 to 1): its words, its gold band and its tags come and go together, so the frame
// never leaves one of them alone
const wd_p2In=ctx=>wd_inFrame(ctx,wd_pageL()+50,wd_pageL()+670);
// policy 2 on the left-hand page: its number and name, and its two lines: 2.1, the one the series' plan quotes, and 2.2, the one
// the voice reads, lit (0 to 1) as it's read
function wd_policy2(ctx,a,lit){const x=wd_pageL()+64,top=wd_pageTop();withA(ctx,a,()=>{withA(ctx,wd_p2In(ctx),()=>{
  wc_T(ctx,"Data policies",x,top+80,{w:600,size:28,col:WC_MUTED});
  wc_T(ctx,"Policy 2",x,top+176,{w:800,size:66,col:WC_DARK});wc_T(ctx,"Decision rights",x,top+232,{w:600,size:36,col:WC_MUTED});
  if(lit>0.01)gv_tint(ctx,x-14,top+406,620,124,GV.gold,0.55*lit);
  [["2.1",["Every critical data element","has an accountable owner."],top+322],["2.2",["Every area of data has","an owner and a steward."],top+452]].forEach(([n,ls,y])=>{
    wc_T(ctx,n,x,y,{w:700,size:30,col:WC_MUTED});ls.forEach((l,i)=>wc_T(ctx,l,x+70,y+i*52,{w:600,size:40,col:WC_INK}));});});
  gv_lines(ctx,x,top+600,WD_OPEN.pw-150,5,40);});}
// the register, on the right-hand page: the series' register (gv_register), eight areas, an owner and a steward for each. A cell still
// to be confirmed holds "TBC", written in by hand in red (o.tbc(k), 0 to 1: owners first, then stewards, WD_TBC's order); once its
// name is confirmed (o.name(k), 0 to 1) the TBC fades and the name is written in its place, with a gold tick beside it. o.lit(i)
// washes row i's area in gold; o.row(i) washes the whole row; o.foot writes who keeps it at the foot (o.footP, 0 to 1); o.edit {i, j,
// to, s, p} strikes cell (i, j) through (s, 0 to 1), and its words give way to to, written in by hand (p, 0 to 1); o.cell {i, j, a}
// washes that one cell gold. o.at: where the page is drawn (the right-hand page of the open binder unless given). A column the frame
// would cut fades whole (wd_fadeCut). Returns gv_register's rows and columns
const WD_REG=[["person","Registrar's office",null],["student","Registrar's office",null],["course",null,null],["organisation","Planning","Planning"],
  ["admissions","Admissions office","Admissions office"],["staff","HR",null],["research",null,"Research office"],["fees",null,"Finance"]];
const WD_TBC=(()=>{const o=[];WD_REG.forEach((r,i)=>{if(!r[1])o.push([i,1]);});WD_REG.forEach((r,i)=>{if(!r[2])o.push([i,2]);});return o;})();
// the names that take each TBC's place, in WD_TBC's order: the owners from the data team's list, the stewards from each office
const WD_FILL=["Registrar's office","Graduate research school","Finance","Mei Tanaka","Mei Tanaka","Mei Tanaka","HR"];
const WD_RCOL=[["area",0.21],["owner",0.47],["steward",0.32]],WD_RPAGE=()=>[wd_pageR(),wd_pageTop(),WD_OPEN.pw,WD_OPEN.h-52];
// fn draws with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to gone at it (as the floor's names
// do), so the frame never cuts a word and a page keeps the rest of its words. spans: a table's columns, [x0, x1] where ctx is now; a
// word that starts in one fades with the whole column, so a column goes together
function wd_fadeCut(ctx,fn,spans){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),S=(spans||[]).map(([a,b])=>[M.a*a+M.e,M.a*b+M.e]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const sp=S.find(([a,b])=>l>=a-2&&l<=b);if(sp){l=Math.min(l,sp[0]);rt=Math.max(rt,sp[1]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}
// fn draws with every word marked as decoration: words not there to be read, such as a sheet going under another
function wd_asDeco(fn){const T0=T;T=(c,s2,x,y,o)=>T0(c,s2,x,y,Object.assign({},o,{deco:1}));try{return fn();}finally{T=T0;}}
// words the camera holds too far off to read yet are decoration until it comes close: fn draws with every word marked so while the
// frame's scale times k (the drawing's own scale) puts 28-unit words under 28 px
function wd_farDeco(ctx,k,fn){const m=ctx.getTransform(),s=Math.hypot(m.a,m.b)*1920/ctx.canvas.width*k;return s>=0.97?fn():wd_asDeco(fn);}
function wd_reg(ctx,o){o=o||{};const [px,py,pw,ph]=o.at||WD_RPAGE(),k=pw/1000,tbc=o.tbc||(()=>0),nm=o.name||(()=>0),fill={};
  WD_TBC.forEach(([i,j],q)=>{fill[i+","+j]=q;});
  const ed=o.edit,rows=WD_REG.map((r,i)=>[r[0],...[1,2].map(j=>{if(ed&&ed.i===i&&ed.j===j)return "";const q=fill[i+","+j];if(q==null)return r[j];const u=nm(q);
    return u>0.34?{t:WD_FILL[q],hand:true,p:clamp((u-0.34)/0.66,0,1)}:"";})]);
  const cx=[48];WD_RCOL.forEach(([,f],i)=>cx.push(cx[i]+904*f));
  let R;wd_fadeCut(ctx,()=>wd_farDeco(ctx,k,()=>{R=gv_register(ctx,px,py,pw,{kicker:"Register of owners and stewards",title:"Who answers for each area",cols:WD_RCOL,rows,
    h:ph/k,foot:o.foot,footP:o.footP});
    // a TBC, in red by hand where a name is still to come, fading as its name is confirmed; a gold tick once the name is written
    WD_TBC.forEach(([i,j],q)=>{const p=tbc(q),u=nm(q),a=1-clamp(u*3,0,1);const x0=R.cols[j]+GV_REG.pad*k,ty=R.rows[i]+11*k;
      if(p>0&&a>0.01)withA(ctx,a,()=>wc_hand(ctx,"TBC",x0+4*k,ty,{p,size:32*k,col:GV.redInk}));
      if(u>0.5)wc_tick(ctx,R.cols[j]-14*k,ty-10*k,20*k,GV.goldInk,clamp((u-0.5)*2.5,0,1),4*k);});
    // a name changed: struck through in red, fading, and the new one written in its place
    if(ed){const x0=R.cols[ed.j]+GV_REG.pad*k,ty=R.rows[ed.i]+11*k,was=WD_REG[ed.i][ed.j],sz=30*k,st=easeCam(clamp(ed.s||0,0,1)),p=ed.p||0;
      withA(ctx,1-clamp(p*2.5,0,1),()=>{wc_T(ctx,was,x0,ty,{w:600,size:sz,col:WC_DARK});if(st>0){ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=3*k;ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(x0-4*k,ty-sz*0.32);ctx.lineTo(x0-4*k+(tw(ctx,was,sz,600)+8*k)*st,ty-sz*0.32);ctx.stroke();ctx.restore();}});
      if(p>0.3)wc_hand(ctx,ed.to,x0+4*k,ty,{size:32*k,w:600,col:GV_SIGN.ink,p:clamp((p-0.3)/0.7,0,1)});}}),cx.slice(0,-1).map((c,i)=>[px+c*k,px+cx[i+1]*k]));
  // the areas lit as they're counted, a row lit whole
  WD_REG.forEach((r,i)=>{const g=o.lit?o.lit(i):0,w=o.row?o.row(i):0;if(g>0.01)gv_tint(ctx,R.cols[0]-10*k,R.rows[i]-27*k,(904*WD_RCOL[0][1]-6)*k,54*k,GV.gold,0.5*g);
    if(w>0.01)gv_tint(ctx,R.cols[0]-10*k,R.rows[i]-27*k,920*k,54*k,GV.gold,0.45*w);});
  const cl=o.cell;if(cl&&cl.a>0.01){const c0=R.cols[cl.j],c1=cl.j+1<R.cols.length?R.cols[cl.j+1]:px+952*k;gv_tint(ctx,c0+4*k,R.rows[cl.i]-27*k,c1-c0-12*k,54*k,GV.gold,0.55*cl.a);}
  return R;}

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

/* ---------- 3 · Already written: the data team's list of who they ask, and the names confirmed ---------- */
// The data team's board, close: the cork as in their room, with what else is pinned there (a card of the week's work, a note, a
// printed chart), and room on the left for the list. Painted once; the list is drawn every frame
function wd_paintTeamBoard(ctx){gv_paintBoardClose(ctx,GV_ROOM.data);
  const pin=(x,y,c)=>gv_pin(ctx,x,y,c,1.3);
  ctx.save();ctx.translate(1450,250);ctx.rotate(0.03);wc_panel(ctx,-170,-130,340,250,{kind:"card",seed:301});gv_lines(ctx,-140,-70,280,5,38,0.9);ctx.restore();pin(1450,128,GV.red);
  ctx.save();ctx.translate(1500,600);ctx.rotate(-0.05);ctx.fillStyle=rgba([250,226,120],1);ctx.shadowColor="rgba(70,60,40,0.22)";ctx.shadowBlur=10;ctx.shadowOffsetY=5;
  ctx.fillRect(-120,-110,240,220);ctx.restore();ctx.save();ctx.translate(1500,600);ctx.rotate(-0.05);gv_lines(ctx,-90,-50,180,3,44,0.8);ctx.restore();pin(1500,500,[70,110,170]);
  ctx.save();ctx.translate(1340,780);ctx.rotate(0.02);gv_sheet(ctx,-110,-60,220,130);[0.5,0.8,0.35,0.65].forEach((v,j)=>{ctx.fillStyle=rgba([140,168,200],0.85);ctx.fillRect(-80+j*44,44-v*80,28,v*80);});ctx.restore();}
// the list, pinned at WD_WL: a printed sheet, the eight areas and who they ask about each, and a line added later by hand, for award.
// o.lit(i) washes row i's name gold as the voice counts them; o.award lights the line for award
const WD_WHO=[["person","Registrar's office"],["student","Registrar's office"],["course","Registrar's office"],["organisation","Planning"],
  ["admissions","Admissions office"],["staff","HR"],["research","Graduate research school"],["fees","Finance"]];
const WD_WL={x:300,y:78,w:920,h:790,rot:-0.01,row0:276,dy:54,c2:330},wd_whoY=i=>WD_WL.y+WD_WL.row0+i*WD_WL.dy;
function wd_whoList(ctx,o){o=o||{};const L=WD_WL,x=L.x,y=L.y;ctx.save();ctx.translate(x+L.w/2,y+L.h/2);ctx.rotate(L.rot);ctx.translate(-x-L.w/2,-y-L.h/2);
  gv_sheet(ctx,x,y,L.w,L.h);gv_pin(ctx,x+46,y+30,GV.red,1.3);gv_pin(ctx,x+L.w-46,y+30,[70,110,170],1.3);
  wc_T(ctx,"Who we ask",x+60,y+112,{w:800,size:58,col:WC_DARK});wc_T(ctx,"when a meaning isn't clear",x+60,y+162,{w:600,size:30,col:WC_MUTED});
  wc_T(ctx,"area",x+60,y+222,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"we ask",x+60+L.c2,y+222,{w:700,size:28,col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+60,y+238);ctx.lineTo(x+L.w-60,y+238);ctx.stroke();ctx.restore();
  WD_WHO.forEach(([ar,who],i)=>{const ry=wd_whoY(i),g=o.lit?o.lit(i):0;
    if(g>0.01)gv_tint(ctx,x+50+L.c2,ry-36,tw(ctx,who,32,600)+24,48,GV.gold,0.6*g);
    wc_T(ctx,ar,x+60,ry,{w:700,size:32,col:WC_DARK});wc_T(ctx,who,x+60+L.c2,ry,{w:600,size:32,col:WC_INK});});
  const hy=wd_whoY(7)+92,hs="award: Mei Tanaka, registrar's office",aw=o.award||0;
  if(aw>0.01)gv_tint(ctx,x+46,hy-40,tw(ctx,hs,38,600)+40,56,GV.gold,0.6*aw);
  wc_hand(ctx,hs,x+64,hy,{size:38,col:GV_SIGN.ink});ctx.restore();}
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
// Mei's desk from above: oak with its grain, the tray of certificate folders at the top, the office's stamp beside its pad of red ink,
// a pot of pens, a mug. Her two books and the papers that come to her are drawn every frame
function wd_paintMeiTop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.oak,{kind:"plaster",line:false,seed:57});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(8);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(GV.oak,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;
    ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i*1.3)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(130,-90,520,196),[150,156,168],1,{lw:1.3});[[248,240,220],[176,40,34],[248,240,220],[96,118,150]].forEach((c,i)=>wc_flat(ctx,wc_rect(150+i*10,-70+i*14,480,120),c,1,"folder"));
  wc_part(ctx,wc_rect(1330,46,220,124),[70,72,80],1);wc_flat(ctx,wc_rect(1346,62,188,92),[176,40,34],1,"ink");
  wc_part(ctx,wc_rect(1590,66,110,74),[60,52,48],1);wc_wash(ctx,wc_ell(1645,103,28,28,24),[150,104,70],{kind:"thing",lw:1.2});
  wc_wash(ctx,wc_ell(1820,196,48,48,28),[96,118,150],{kind:"thing",lw:1.3});
  for(const [px,py,c] of [[-16,-8,[60,60,70]],[10,-16,[204,62,50]],[4,12,[60,60,70]],[-14,16,[40,140,90]]])wc_wash(ctx,wc_ell(1820+px,196+py,7,7,12),c,{kind:"thing",line:false});
  wc_wash(ctx,wc_ell(1790,966,78,78,40),[226,214,190],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(1790,966,58,58,40),[120,82,56],{kind:"thing",line:false});}
// Mei's two books, open on her desk: each a spread 1000 by 560 in its own units, drawn at its place and scale in WD_BK, its cloth
// cover a little bigger than its pages. The paper is painted once a book; the words are drawn every frame, each fading as the frame
// comes to cut it (wd_fadeCut), and are decoration while the camera is too far to read them (wd_farDeco). A tab on each, with its
// area's name, reads from further off
const WD_BK={log:{x:60,y:300,s:0.85,col:[128,58,58],area:"person"},dec:{x:1010,y:300,s:0.85,col:[58,96,92],area:"course"}};
function wd_bookPaper(key,col){return wc_kept("wd_book"+key,1100,680,q=>{q.translate(50,50);
  q.save();q.filter="blur(14px)";q.fillStyle="rgba(60,40,24,0.34)";q.fillRect(-4,8,1028,582);q.restore();
  wc_wash(q,wc_rrPts(-14,-14,1028,588,12),col,{kind:"cover",lw:1.5,seed:key.length*7+3});
  for(const [px,s] of [[0,-1],[500,1]]){for(let k=3;k>=1;k--)wc_flat(q,wc_rect(px+s*k*2,k*2,500,560),wc_dim(GV.paper,0.05*k),1,"pages");
    wc_wash(q,wc_rect(px,0,500,560),GV.paper,{kind:"page",lw:1.2,seed:px+key.length});}
  const g=q.createLinearGradient(440,0,560,0);g.addColorStop(0,"rgba(70,60,50,0)");g.addColorStop(0.5,"rgba(70,60,50,0.3)");g.addColorStop(1,"rgba(70,60,50,0)");q.fillStyle=g;q.fillRect(440,0,120,560);});}
// a book (b: "log" or "dec") and what fn writes in it, in the book's units; its tab sticks up from its top edge
function wd_book(ctx,b,fn){const B=WD_BK[b];ctx.save();ctx.translate(B.x,B.y);ctx.scale(B.s,B.s);
  wc_panel(ctx,780,-62,180,90,{kind:"card",wash:B.col,washA:0.3,seed:b.length+60});wd_fadeCut(ctx,()=>wc_T(ctx,B.area,870,-14,{w:800,size:34,align:"center",col:WC_DARK}));
  ctx.drawImage(wd_bookPaper(b,B.col),-50,-50);wd_fadeCut(ctx,()=>wd_farDeco(ctx,20/28,()=>fn(ctx)));ctx.restore();}
const wd_rule=(q,x0,x1,y,a,lw)=>{q.save();q.strokeStyle=rgba(WC_MUTED,a);q.lineWidth=lw||1.6;q.beginPath();q.moveTo(x0,y);q.lineTo(x1,y);q.stroke();q.restore();};
const WD_HAND={size:22,w:600,col:GV_SIGN.ink};
// her log book: which records are the same learner, as she decides them, in her hand, three columns on the left-hand page and the
// reasons on the right. o.lit: [when, same learner, decided by, why], each column washed gold (0 to 1); o.rows(i) brings a row in
const WD_LOGB=[["6 Oct","same",["One email, two learners: Linh","confirmed the course was hers."]],["6 Oct","same",["Daniel Kim used his work email,","and gave his student ID."]],
  ["7 Oct","different",["Two Aishas: one's ID was typed","on the other's account."]],["7 Oct","different",["Look-alikes on the same course,","the same day: two people."]]];
const WD_LBC=[["when",36,94],["same learner?",140,166],["decided by",318,162],["why",532,436]];
function wd_logBook(ctx,o){o=o||{};wd_book(ctx,"log",q=>{const lit=o.lit||[],row=o.rows||(()=>1),hd=(s,x,y,al)=>wc_T(q,s,x,y,{w:600,size:20,col:WC_MUTED,align:al});
  hd("Log book · person area",36,48);hd("October 2026",968,48,"right");wc_T(q,"Same learner?",36,96,{w:800,size:30,col:WC_DARK});
  for(const [a,b] of [[36,480],[520,968]]){wd_rule(q,a,b,112,0.45,2);wd_rule(q,a,b,160,0.45,2);wd_rule(q,a,b,165,0.45,2);for(let i=1;i<=4;i++)wd_rule(q,a,b,168+96*i,0.22);}
  q.save();q.strokeStyle=rgba(WC_MUTED,0.18);q.lineWidth=1.6;for(const x of [128,306]){q.beginPath();q.moveTo(x,124);q.lineTo(x,552);q.stroke();}q.restore();
  WD_LBC.forEach(([h,x,w],j)=>{const l=lit[j]||0;if(l>0.01)gv_tint(q,x-10,126,w+14,430,GV.gold,0.6*l);hd(h,x,150);});
  WD_LOGB.forEach(([d,s,why],i)=>{const a=row(i),y=168+96*i+40;if(a<=0.01)return;withA(q,a,()=>{
    wc_hand(q,d,36,y,WD_HAND);wc_hand(q,s,140,y,WD_HAND);wc_hand(q,"Mei Tanaka",318,y,WD_HAND);why.forEach((l,k)=>wc_hand(q,l,532,y+32*k,WD_HAND));});});});}
// the course area's decision book: a decision a block, what, who, when and why, in Mei's hand. The last one on the left-hand page;
// the new one on the right, written as far as o.what and o.who (0 to 1) say, its date and its reason still to come, her pen across the
// page. o.why (0 to 1) washes the last one's why gold
const WD_DECB={what:["An award counts from the day","it's conferred."],who:"Mei Tanaka",when:"14 March 2026",why:["Ceremonies move; the day","it's conferred doesn't."]};
function wd_decBook(ctx,o){o=o||{};wd_book(ctx,"dec",q=>{const lab=(s,x,y)=>wc_T(q,s,x,y,{w:600,size:20,col:WC_MUTED}),D=WD_DECB,hand=(s,x,y,p)=>wc_hand(q,s,x,y,Object.assign({p},WD_HAND));
  lab("Decision book · course area",36,48);wc_T(q,"Course decisions",36,96,{w:800,size:30,col:WC_DARK});wd_rule(q,36,480,112,0.45,2);
  if(o.why>0.01)gv_tint(q,26,290,460,94,GV.gold,0.6*o.why);
  lab("what",36,160);D.what.forEach((l,k)=>hand(l,116,160+32*k,1));lab("who",36,234);hand(D.who,116,234,1);
  lab("when",36,276);hand(D.when,116,276,1);lab("why",36,318);D.why.forEach((l,k)=>hand(l,116,318+32*k,1));wd_rule(q,36,480,388,0.3);
  const w=o.what||0;lab("what",536,160);["How award maps to the","government's definition"].forEach((l,k)=>hand(l,616,160+32*k,clamp(w*2-k,0,1)));
  lab("who",536,234);hand("Mei Tanaka",616,234,o.who||0);lab("when",536,276);lab("why",536,318);
  wd_rule(q,616,950,284,0.4);wd_rule(q,616,950,326,0.4);wd_rule(q,616,950,358,0.4);
  // her pen, lying across the page, waiting
  q.save();q.translate(770,452);q.rotate(-0.32);wc_flat(q,wc_rrPts(-150,-9,280,18,9),[40,44,54],1,"pen");wc_flat(q,[[130,-9],[168,0],[130,9]],[200,190,170],1,"nib");
  wc_flat(q,wc_rect(-120,-11,60,22),[176,150,90],1,"band");q.restore();});}
// Sam's two screens on the platform team: the platform's tables, awards among them (lit, 0 to 1), and the platform's own pages, in grey
const WD_TABLES=["awards","credentials","learners","enrolments"];
function wd_platScreens(ctx,lit){const [a,b]=GV_PX.screens;gv_screen(ctx,a[0],a[1],a[2],a[3],"Tables",q=>{WD_TABLES.forEach((n,i)=>{const ry=a[1]+96+i*56;
    if(i===0&&lit>0.01)gv_tint(q,a[0]+14,ry-34,a[2]-28,48,[64,170,210],0.6*lit);wc_T(q,n,a[0]+28,ry,{w:600,size:30,col:WC_DARK});});},{titleSize:28,bar:[52,110,128]});
  gv_screen(ctx,b[0],b[1],b[2],b[3],"Platform",q=>{for(let i=0;i<5;i++){gv_lines(q,b[0]+28,b[1]+80+i*48,b[2]-120,1,0,0.9);}},{titleSize:28,bar:[52,110,128]});}

/* ---------- 5 · Who decides what: each area its own words, governance a few shared rules, the council the rest ---------- */
// Yusuf's board: a card for each area with its owner, from the register; over them, a gold band for the rules every area shares
const WD_DOM=[["person","Registrar's office"],["student","Registrar's office"],["course","Registrar's office"],["organisation","Planning"],
  ["admissions","Admissions office"],["staff","HR"],["research","Graduate research school"],["fees","Finance"]];
const WD_DC={w:320,h:176,x:i=>275+(i%4)*350,y:i=>316+Math.floor(i/4)*206};
// an area's card: its name, its owner (on two lines if it must), a gold dot once it decides its own words (dot 0 to 1), lit gold
function wd_domCard(ctx,i,dot,lit){const x=WD_DC.x(i),y=WD_DC.y(i),[nm,ow]=WD_DOM[i];wc_panel(ctx,x,y,WD_DC.w,WD_DC.h,{kind:"card",wash:lit>0.01?GV.gold:null,washA:0.4*lit,seed:90+i});
  gv_pin(ctx,x+WD_DC.w/2,y+12,GV.red,1.1);wc_T(ctx,nm,x+22,y+62,{w:800,size:38,col:WC_DARK});
  wd_wrap(ctx,ow,28,600,WD_DC.w-44,2).forEach((l,k)=>wc_T(ctx,l,x+22,y+106+k*34,{w:600,size:28,col:WC_INK}));
  if(dot>0.01){const k=0.8+0.2*spring(dot);ctx.save();ctx.translate(x+WD_DC.w-30,y+34);ctx.scale(k,k);withA(ctx,clamp(dot*2,0,1),()=>wc_wash(ctx,wc_ell(0,0,15,15,18),GV.gold,{kind:"thing",lw:1.2,seed:120+i}));ctx.restore();}}
// the band over them: what governance sets, shared by every area, and the two rules the voice names
function wd_band(ctx,a,r1,r2){if(a>0.01)withA(ctx,a,()=>{wc_panel(ctx,260,96,1400,72,{kind:"card",wash:GV.gold,washA:0.55,seed:131});
    wc_T(ctx,"shared by every area",960,146,{w:800,size:36,align:"center",col:WC_DARK});});
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

/* ---------- 6 · Required: a sign-off sheet that never leaves the owner blank, and the council's oldest action closed ---------- */
// the data team's board in their room: the list of who they ask at its top left, and the rest of what's pinned there, as the close-up
// has them, too small to read
function wd_boardSmall(ctx){const [bx,by]=GV_DT.board;gv_sheet(ctx,bx+18,by+14,206,184,{rot:-0.01});gv_pin(ctx,bx+32,by+24,GV.red,0.6);gv_pin(ctx,bx+210,by+24,[70,110,170],0.6);
  ctx.save();ctx.fillStyle=rgba(WC_DARK,0.5);ctx.fillRect(bx+38,by+44,110,9);ctx.restore();gv_lines(ctx,bx+38,by+76,166,8,14,0.8);
  ctx.save();ctx.translate(bx+330,by+72);ctx.rotate(0.03);wc_panel(ctx,-62,-46,124,96,{kind:"card",seed:302});gv_lines(ctx,-46,-20,92,4,15,0.8);ctx.restore();gv_pin(ctx,bx+330,by+32,GV.red,0.6);
  ctx.save();ctx.translate(bx+352,by+202);ctx.rotate(-0.05);ctx.fillStyle=rgba([250,226,120],1);ctx.shadowColor="rgba(70,60,40,0.2)";ctx.shadowBlur=6;ctx.shadowOffsetY=3;ctx.fillRect(-42,-40,84,80);ctx.restore();
  gv_pin(ctx,bx+352,by+168,[70,110,170],0.6);}
// a gold card on the data team's board, under the list, low enough on it for Noor to pin
const WD_TC=()=>{const [bx,by]=GV_DT.board;return {x:bx+60,y:by+246,w:350,h:104};};
function wd_teamCard(ctx,p){wd_drop(ctx,p,()=>{const C=WD_TC();wc_panel(ctx,C.x,C.y,C.w,C.h,{kind:"card",wash:GV.gold,washA:0.5,seed:141});
  gv_pin(ctx,C.x+C.w/2,C.y+14,GV.red,1.1);wc_T(ctx,"owner: required",C.x+C.w/2,C.y+68,{w:800,size:38,align:"center",col:WC_DARK});});}
// Jun's desk from above: pale laminate, the edge of his keyboard, a note stuck to the desk, a pencil, a mug. What comes back to him is
// drawn every frame
function wd_paintJunTop(ctx){const col=[234,228,218];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:61});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(12);for(let i=0;i<24;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.12),0.12);ctx.lineWidth=1+R()*2;
    ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y+(R()-0.5)*12);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(1240,-70,760,130),[226,228,234],1);for(let i=0;i<14;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1258+i*49,-50+j*44,41,36),[244,245,248],1,"key");
  ctx.save();ctx.translate(1700,330);ctx.rotate(0.08);ctx.fillStyle=rgba([170,208,240],1);ctx.shadowColor="rgba(70,60,40,0.2)";ctx.shadowBlur=8;ctx.shadowOffsetY=4;ctx.fillRect(-92,-92,184,184);ctx.restore();
  ctx.save();ctx.translate(1700,330);ctx.rotate(0.08);gv_lines(ctx,-68,-50,136,4,30,0.8);ctx.restore();
  wc_part(ctx,[[150,800],[400,736],[404,750],[154,814]],[244,196,80],1);wc_flat(ctx,[[400,736],[432,728],[404,750]],[60,54,58],1,"tip");
  wc_wash(ctx,wc_ell(1720,930,78,78,40),[236,240,244],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(1720,930,58,58,40),[150,104,70],{kind:"thing",line:false});}
// the series' sign-off sheet (gv_signoff), on his desk: blank, as every new thing other teams will read gets one, its owner's line lit
// gold (lit, 0 to 1); then his report's, sent back without an owner: o.p brings its rows in, o.miss lights the empty line red, o.ask
// writes the note, o.back stamps it; then o.fill writes Clara's name on the line, o.strike strikes the note through, o.sign writes
// her signature, and o.signed stamps it, the red stamp going as the green one lands, and the line's red with it. o.y lifts the
// sheet in from above
const WD_SO={x:460,y:52,w:1000},WD_SOH="Who answers for what it means";
const WD_SOROWS=[["What it is","Who completed, each term"],["Made by","Jun Park, data team"],["Read by","Planning and the faculties"],[WD_SOH,null]];
function wd_signBlank(ctx,p,lit,dy){const X=WD_SO,rows=WD_SOROWS.map(r=>[r[0],""]);
  const R=gv_signoff(ctx,X.x,X.y-(dy||0),X.w,{kicker:"Sign-off sheet",title:"For anything other teams will read",rows,signer:"",p});
  if(lit>0.01)gv_tint(ctx,X.x+30,R.rows[3]-36,940,74,GV.gold,0.6*lit);return R;}
function wd_signJun(ctx,o){const X=WD_SO,y=X.y-(o.y||0),k=X.w/1000,signed=o.signed||0,
    so={kicker:"Sign-off sheet",title:"Completions for Planning",rows:signed>0.5?WD_SOROWS.map((r,i)=>i===3?[r[0],""]:r):WD_SOROWS,
      ask:{3:"No owner: add who answers for what it means."},askP:o.ask||0,missA:(o.miss||0)*(1-(o.fill||0)),signer:"Clara Jensen",signP:o.sign||0,p:o.p==null?1:o.p};
  const R=gv_signoff(ctx,X.x,y,X.w,so),H=gv_signoffH(ctx,WD_SOROWS,so),sx=X.x+802*k,sy=y+(H-66)*k;
  if((o.fill||0)>0)wc_hand(ctx,"Clara Jensen, Planning",R.x+4*k,R.rows[3]+11*k,{size:32*k,w:600,col:GV_SIGN.ink,p:o.fill});
  // once the name is in, the note that asked for it is struck through, line by line, with the same pen
  const st=clamp(o.strike||0,0,1);if(st>0){const vx=(R.x-X.x)/k,ry=(R.rows[3]-y)/k-33,L=gv_askLines(ctx,so.ask[3],vx);ctx.save();
    ctx.strokeStyle=rgba(GV_SIGN.ink,0.85);ctx.lineWidth=3*k;ctx.lineCap="round";L.forEach((l,j)=>{const q=clamp(st*L.length-j,0,1),ly=y+(ry+102+42*j-10)*k,lx=R.x+2*k;
      if(q>0){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+(tw(ctx,l,30,700)+12)*k*q,ly);ctx.stroke();}});ctx.restore();}
  if((o.back||0)>0&&signed<1)gv_stamp(ctx,sx,sy,"SENT BACK",o.back,{size:38*k,col:GV.redInk,rot:-0.08,a:1-signed});
  gv_stamp(ctx,sx,sy,"SIGNED",signed,{size:38*k,col:GV.greenInk,rot:-0.05});return R;}
// Jun's sheet on its clipboard, held low in front of him, below his face: its rows in grey, the empty line in red
function wd_heldSheet(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-70);
  cx.fillStyle=rgba(GV_HOLD.walnut,1);rr(cx,-78,-98,156,196,10);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-68,-84,136,174,5);cx.fill();
  cx.fillStyle="rgba(170,176,190,1)";rr(cx,-24,-108,48,20,5);cx.fill();cx.fillStyle=rgba(WC_DARK,0.6);cx.fillRect(-56,-66,84,8);gv_lines(cx,-56,-38,112,3,20,0.9);
  cx.fillStyle=rgba(wc_lit(GV.red,0.6),0.9);cx.fillRect(-58,26,116,20);gv_lines(cx,-56,66,84,2,16,0.8);cx.restore();
  fingers(cx,P_,[[mx-76,my+20],[mx+76,my+16]]);}
// Planning's big screen: a chart of their own, bars by term, and no words
function wd_planChart(ctx){const [x,y,w,h]=GV_PL.screen,b=[0.52,0.58,0.55,0.63,0.68,0.66,0.74],bw=58,gap=(w-120-b.length*bw)/(b.length-1),base=y+h-46,top=h-120;
  gv_screen(ctx,x,y,w,h,null,q=>{q.save();q.lineWidth=2;for(let i=0;i<4;i++){q.strokeStyle=rgba(WC_MUTED,i?0.16:0.5);q.beginPath();q.moveTo(x+50,base-i*70);q.lineTo(x+w-50,base-i*70);q.stroke();}q.restore();
    b.forEach((v,i)=>wc_flat(q,wc_rect(x+60+i*(bw+gap),base-v*top,bw,v*top),[104,150,176],1,"bar"));},{bar:[70,112,92]});}
// the council's minutes on Yusuf's desk, one sheet a month, the newest on top: each carries the action "name the data owners",
// stamped carried forward, until the newest, which a green stamp closes (done, 0 to 1)
const WD_MINS=["June","July","August","September"];
function wd_minutes(ctx,t,a,done){WD_MINS.forEach((m,i)=>{const x=270+i*120,y=100+i*150,last=i===WD_MINS.length-1;withA(ctx,a,()=>{gv_sheet(ctx,x,y,980,640,{rot:(i%2?0.012:-0.01)});
    wc_T(ctx,"Data council · minutes · "+m+" 2026",x+48,y+62,{w:700,size:32,col:WC_MUTED});wc_T(ctx,"Action: name the data owners",x+48,y+120,{w:800,size:36,col:WC_DARK});
    if(!last)gv_stamp(ctx,x+800,y+96,"CARRIED FORWARD",1,{size:28,rot:-0.07,col:GV.redInk});
    else{gv_lines(ctx,x+48,y+190,880,6,40);gv_stamp(ctx,x+790,y+130,"DONE",done,{size:58,rot:-0.09,col:GV.greenInk});}});});}

/* ---------- 7 · Asked by name: a routing slip on every change request, filled in from the register ---------- */
// a change request on paper, 700 by 520 in its own units, drawn at (x,y) and scale s: who it's from, what it asks, its area, a few
// lines more; its routing slip clipped to its top right corner. o.award (0 to 1) washes "award" in its title gold
const WD_RQ={w:700,h:520,slip:[580,64]};
function wd_req(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(o.rot)ctx.rotate(o.rot);
  wd_farDeco(ctx,1,()=>{gv_sheet(ctx,0,0,WD_RQ.w,WD_RQ.h);
    wc_T(ctx,"Change request",40,66,{w:700,size:28,col:WC_MUTED});wc_T(ctx,o.from,40,112,{w:600,size:30,col:WC_INK});
    if(o.award>0.01){const w0=tw(ctx,"Map ",40,800);gv_tint(ctx,40+w0-8,224,tw(ctx,"award",40,800)+16,52,GV.gold,0.75*o.award);}
    o.title.forEach((l,i)=>wc_T(ctx,l,40,262+i*50,{w:800,size:40,col:WC_DARK}));
    wc_T(ctx,"area: "+o.area,40,384,{w:600,size:30,col:WC_INK});gv_lines(ctx,40,428,610,3,28,0.9);
    if(o.slip)wd_slip(ctx,o.slip,o);});ctx.restore();}
// its routing slip: amber paper, clipped on, who the request goes to in turn, as the register names them. o.names(i) brings a line in
// (0 to 1), o.lit(i) washes it gold; o.edit {i, to, p} changes line i's name as the register's changes (p, 0 to 1), a gold flash
// with it; o.amber (0 to 1) warms the slip as a lamp lights; o.slipP brings the slip in. Where line i sits on the request: wd_slipAt
const WD_AMBER=[250,214,138],WD_SLINK=[118,78,16];
const wd_slipAt=i=>[WD_RQ.slip[0]-170+58,WD_RQ.slip[1]-125+112+50*i-10];
function wd_slip(ctx,names,o){const sp=o.slipP==null?1:o.slipP;if(sp<=0)return;const e=easeCam(clamp(sp,0,1)),am=o.amber||0,[cx,cy]=WD_RQ.slip;
  ctx.save();ctx.translate(cx,cy-40*(1-e));ctx.rotate(0.04);ctx.translate(-170,-125);withA(ctx,clamp(sp*2,0,1),()=>{
    if(am>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,170,125,320,[255,206,110],0.65*am);ctx.restore();}
    gv_sheet(ctx,0,0,340,250,{col:WD_AMBER});if(am>0.01){ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle=rgba([255,236,170],0.35*am);ctx.fillRect(0,0,340,250);ctx.restore();}
    wc_T(ctx,"Routing slip",24,46,{w:800,size:28,col:WD_SLINK});ctx.save();ctx.strokeStyle=rgba(WD_SLINK,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(24,62);ctx.lineTo(316,62);ctx.stroke();ctx.restore();
    names.forEach((n,i)=>{const a=o.names?o.names(i):1;if(a<=0.01)return;const ly=112+50*i,l=o.lit?o.lit(i):0,ed=o.edit&&o.edit.i===i?o.edit:null,
        fit=s2=>clamp(30*256/Math.max(1,tw(ctx,s2,30,700)),26,30);
      withA(ctx,a,()=>{if(l>0.01)gv_tint(ctx,14,ly-34,312,46,GV.gold,0.75*l);
        if(ed&&ed.p>0.01){const u=clamp(ed.p,0,1),f=Math.sin(Math.PI*u);if(f>0.01)gv_tint(ctx,14,ly-34,312,46,GV.gold,0.8*f);}
        wc_T(ctx,String(i+1),24,ly,{w:700,size:28,col:WD_SLINK});
        if(!ed||ed.p<0.5)withA(ctx,ed?1-clamp(ed.p*2,0,1):1,()=>wc_T(ctx,n,58,ly,{w:700,size:fit(n),col:WC_DARK}));
        if(ed&&ed.p>0.5)withA(ctx,clamp(ed.p*2-1,0,1),()=>wc_T(ctx,ed.to,58,ly,{w:700,size:fit(ed.to),col:WC_DARK}));});});
    // the clip, its wire over the slip's top and behind the request's edge
    ctx.save();ctx.strokeStyle="rgba(130,136,148,0.95)";ctx.lineWidth=4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(40,-18);ctx.lineTo(40,64);ctx.arc(54,64,14,Math.PI,0,true);ctx.lineTo(68,-6);
    ctx.arc(58,-6,10,0,Math.PI,true);ctx.lineTo(48,50);ctx.stroke();ctx.restore();});ctx.restore();}
// a request held up in one hand by its edge, beside her face, facing out: "Change request" over its title and lines, the amber slip
// clipped to its top corner, warm as a lamp is lit (am, 0 to 1). WD_HR: the sheet's place and size in the figure's units, from the
// hand that holds it, and where its slip is
const WD_HR={x:-18,y:-150,w:156,h:200,slip:[148,-162]};
function wd_heldReq(am){return(cx,P_,hands)=>{const [hx,hy]=hands[1],R=WD_HR;cx.save();cx.translate(hx,hy);
  cx.save();cx.shadowColor="rgba(60,50,40,0.25)";cx.shadowBlur=10;cx.shadowOffsetY=6;cx.fillStyle="#fffdf6";cx.fillRect(R.x,R.y,R.w,R.h);cx.restore();
  wc_T(cx,"Change request",R.x+14,R.y+34,{w:700,size:16,col:WC_MUTED});
  cx.save();cx.fillStyle=rgba(WC_DARK,0.6);cx.fillRect(R.x+14,R.y+60,118,9);cx.fillRect(R.x+14,R.y+78,92,9);cx.restore();gv_lines(cx,R.x+14,R.y+116,R.w-30,4,18,0.9);
  cx.save();cx.translate(R.slip[0],R.slip[1]);cx.rotate(0.08);cx.shadowColor="rgba(60,50,40,0.22)";cx.shadowBlur=6;cx.shadowOffsetY=3;
  cx.fillStyle=rgba(mix(WD_AMBER,[255,240,186],0.65*am),1);cx.fillRect(-36,-28,72,56);cx.shadowColor="transparent";cx.fillStyle=rgba(WD_SLINK,0.7);
  cx.fillRect(-26,-16,40,5);for(let i=0;i<3;i++)cx.fillRect(-26,-2+i*10,48-i*6,3.5);cx.restore();
  cx.restore();fingers(cx,P_,[[hx+2,hy-4]]);};}

/* ---------- 8 · Where the work is: what, who, when and why, in the books where Mei keeps them ---------- */
// four cards beside Mei's screen, one for each thing a decision records, each as the voice names it (p(i), 0 to 1)
const WD_WWWW=["what","who","when","why"];
function wd_fourCards(ctx,p){WD_WWWW.forEach((s2,i)=>wd_drop(ctx,p(i),()=>{const cx=770+(i%2)*184,cy=420+Math.floor(i/2)*112;
  wc_panel(ctx,cx,cy,164,90,{kind:"card",wash:GV.gold,washA:0.45,seed:160+i});gv_pin(ctx,cx+82,cy+12,GV.red,1);
  wc_T(ctx,s2,cx+82,cy+64,{w:800,size:40,align:"center",col:WC_DARK});}));}

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

/* ---------- 10 · Which award? Every change asks its owner; Mei reads Jun's, and award turns out to be defined in five places ---------- */
// a head in one of award's three meanings' colours (the series' GV_MEAN and GV_MEANINK: violet, rose, olive): "award", the wash coming
// in as col goes from 0 to 1
function wd_head(ctx,x,y,w,m,col){if(col>0.01)gv_tint(ctx,x,y,w,58,GV_MEAN[m],0.9*col);wc_T(ctx,"award",x+16,y+43,{w:800,size:40,col:mix(WC_DARK,GV_MEANINK[m],col)});}
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
