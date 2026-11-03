/* ===== Many agents, and what emerges: the places of the opening and the close =====
   Painted full-frame in the module's matte style (no outlines, muted colours, daylight from the right, soft contact shadows),
   dressed for their time. Each is a place painted once (AG_PLACES.ma*); what moves in it is drawn live by the helpers below it.
   Every name here starts with ma_ or MA_. Air is never one of the module's meaning colours: warm air is a pale terracotta
   (MA_WARM), cool air a pale mist grey (MA_COOL), and the termites' scent a faint pale gold (MA_GOLD).
     ma_tag(ctx, text, a, o)        the place and year, on a small card at the top left (o.dashed for "Imagined")
     ma_air(ctx, pts, col, t, o)    a soft ribbon of air flowing along pts: o.u how much of it shows, o.w its width, o.speed
     ma_sketch(ctx, strokes, t, t0) pencil strokes drawing themselves; ma_pencil(ctx, strokes, u) a pencil drawing, lifting between
                                    strokes, and ma_pencilBody(ctx, x, y, lift) the pencil itself
   The places: maHarare (the street, 1992), maDesk (the drawing board), maMound (a mound on the savanna), maMoundCut (the same mound
   cut down the middle: its chimney, the channels under its skin, the nest below), maSection and maSectionNight (Eastgate cut
   through, by day and by night), maEastgate (Eastgate in 1996) and maPlant (its plant room, where a chart records the offices'
   warmth). The drawing board's other things (the crate, the price tag, the sun, the dial, the title block) and Eastgate's "let"
   signs are drawn live by the helpers beside their places. */

const MA_WARM=[214,140,104],MA_COOL=[170,188,200],MA_GOLD=[226,190,104];
const MA_COOLD=[128,152,176];   // the same mist, a little deeper, where it crosses the pale savanna
const MA_SKIN=[[94,62,44],[124,84,60],[168,120,88],[206,160,124]];

/* ---------------------------------------------------------------- small helpers */
const ma_shade=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
// a Catmull-Rom spline through the points, n steps between each
function ma_smooth(pts,n){const out=[],P=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<P.length-2;i++)for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(P[i-1][0],P[i][0],P[i+1][0],P[i+2][0]),f(P[i-1][1],P[i][1],P[i+1][1],P[i+2][1])]);}out.push(pts[pts.length-1]);return out;}
function ma_poly(c,P){c.beginPath();ma_path(c,P);}
function ma_path(c,P){c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);c.closePath();}
// an irregular soft blob: an ellipse whose edge wanders (amp), for crowns of trees, clouds, cells
function ma_blobPts(cx,cy,rx,ry,seed,amp,n){n=n||56;const pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.6+seed*3.1,Math.sin(a)*1.6+seed*1.7,3)-0.5)*2;
  pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return pts;}
function ma_blob(c,cx,cy,rx,ry,seed,amp,fill){ma_poly(c,ma_blobPts(cx,cy,rx,ry,seed,amp));c.fillStyle=fill;c.fill();}
// a sky: top to low, with a soft glow of the sun at sun [x, y, r, a]
function ma_sky(c,top,low,hz,sun,mid){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(top,1));if(mid)g.addColorStop(mid[1],rgba(mid[0],1));g.addColorStop(1,rgba(low,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  if(sun){const r=c.createRadialGradient(sun[0],sun[1],8,sun[0],sun[1],sun[2]);r.addColorStop(0,"rgba(255,244,222,"+(sun[3]||0.5)+")");r.addColorStop(1,"rgba(255,244,222,0)");c.fillStyle=r;c.fillRect(0,0,W,hz+2);}}
// a faint grain of the place's own, so large flat areas don't look printed (painted once, it never moves)
function ma_grain(c,x,y,w,h,amp,seed){ag_grain(c,x,y,w,h,amp||1.4,seed||5);}
// the soft shadow of a shape without the shape, for places painted once: the shape is drawn far outside the frame and only its
// blurred shadow falls in it
function ma_shadowOf(c,fn,col,blur,dx,dy){c.save();c.shadowColor=col;c.shadowBlur=blur;c.shadowOffsetX=dx+6000;c.shadowOffsetY=dy;c.translate(-6000,0);
  c.beginPath();fn(c);c.fillStyle="#000";c.fill();c.restore();}

/* the place and year, on a small card at the top left, in screen space; o.dashed: a dashed edge (for "Imagined") */
function ma_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  if(o.dashed){ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.2;rr(ctx,x+5,y+5,w-10,h-10,9);ctx.stroke();ctx.setLineDash([]);}
  else{ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();}
  ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- air: a soft ribbon that flows along a path
   pts: the path's points; col: MA_WARM or MA_COOL; t: time, for the flow; o.u: how much shows, from the start; o.w: width;
   o.speed: px a second; o.head: false for no chevron; o.a. The body is one path, so it never doubles where it bends. */
function ma_air(ctx,pts,col,t,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,w=o.w||12,sp=o.speed||60;if(a<=0.01||u<=0.01)return;
  const S=ma_smooth(pts,12),L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));const tot=L[L.length-1]||1,show=tot*clamp(u,0,1);
  const vis=[S[0]];for(let i=1;i<S.length;i++){if(L[i]<=show){vis.push(S[i]);continue;}const k=(show-L[i-1])/((L[i]-L[i-1])||1);vis.push([lerp(S[i-1][0],S[i][0],k),lerp(S[i-1][1],S[i][1],k)]);break;}
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(vis[0][0],vis[0][1]);for(let i=1;i<vis.length;i++)ctx.lineTo(vis[i][0],vis[i][1]);
  ctx.strokeStyle=rgba(col,0.13*a);ctx.lineWidth=w*2.3;ctx.stroke();ctx.strokeStyle=rgba(col,0.2*a);ctx.lineWidth=w*1.15;ctx.stroke();
  // the flow: short dashes moving along it, fading in from where the air starts
  const dash=o.dash||46,gap=o.gap||62,off=((t*sp)%(dash+gap)+dash+gap)%(dash+gap);ctx.lineWidth=w*0.42;
  for(let d=-dash-gap+off;d<show;d+=dash+gap){const d0=Math.max(0,d),d1=Math.min(show,d+dash);if(d1-d0<2)continue;ctx.beginPath();let st=false;
    for(let i=0;i<S.length;i++){if(L[i]<d0)continue;if(L[i]>d1)break;if(!st){ctx.moveTo(S[i][0],S[i][1]);st=true;}else ctx.lineTo(S[i][0],S[i][1]);}
    const f=(d0+d1)/2/tot,env=sstep(0,0.12,f)*(1-0.5*sstep(0.9,1,f));ctx.strokeStyle=rgba(col,0.85*a*env);ctx.stroke();}
  if(u>0.85&&o.head!==false){const i=Math.max(1,vis.length-1),p=vis[i],q=vis[Math.max(0,i-3)],an=Math.atan2(p[1]-q[1],p[0]-q[0]),k=w*1.1;
    ctx.strokeStyle=rgba(col,0.92*a*sstep(0.85,1,u));ctx.lineWidth=w*0.46;ctx.beginPath();ctx.moveTo(p[0]-Math.cos(an-0.62)*k,p[1]-Math.sin(an-0.62)*k);ctx.lineTo(p[0],p[1]);
    ctx.lineTo(p[0]-Math.cos(an+0.62)*k,p[1]-Math.sin(an+0.62)*k);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the street's things
   ma_tree(c, x, y, s, seed, o): a shade tree standing at (x, y): a tapering trunk that forks, and a crown of soft clusters, lighter
   up and to the right where the sun falls, darker underneath; o.leaf its green */
function ma_tree(c,x,y,s,seed,o){o=o||{};const R=ag_rnd(seed),leaf=o.leaf||[116,132,100],trunk=o.trunk||[102,90,78];c.save();c.translate(x,y);c.scale(s,s);
  ag_floorShadow(c,-90,8,190,22,0.26);
  c.fillStyle=rgba(trunk,1);c.beginPath();c.moveTo(-13,0);c.bezierCurveTo(-11,-60,-9,-110,-34,-178);c.lineTo(-24,-184);c.bezierCurveTo(-6,-146,-2,-132,4,-142);
  c.bezierCurveTo(14,-170,30,-190,50,-206);c.lineTo(56,-198);c.bezierCurveTo(30,-170,17,-118,15,0);c.closePath();c.fill();
  c.fillStyle="rgba(255,240,220,0.16)";c.beginPath();c.moveTo(6,0);c.bezierCurveTo(8,-60,9,-100,12,-130);c.lineTo(15,-120);c.lineTo(15,0);c.closePath();c.fill();
  // the crown: a dark mass, then lit clusters over it, the lightest up and to the right
  const cy=-250,base=[[0,cy,170,92,0.2]];for(let i=0;i<9;i++){const a=R()*TAU,r=R();base.push([Math.cos(a)*120*r+10,cy+Math.sin(a)*56*r-10,70+R()*50,46+R()*28,0.25]);}
  base.forEach((b,i)=>ma_blob(c,b[0],b[1],b[2],b[3],seed+i*0.37,b[4],rgba(ma_shade(leaf,0.72),1)));
  const lit=base.slice(1).sort((p,q)=>(p[0]-p[1])-(q[0]-q[1]));
  lit.forEach((b,i)=>{const k=clamp(0.5+(b[0]/220)-(b[1]-cy)/160,0,1);ma_blob(c,b[0]+10,b[1]-12,b[2]*0.78,b[3]*0.72,seed+i*1.3,0.3,rgba(mix(leaf,ma_shade(leaf,1.22),k),1));});
  for(let i=0;i<12;i++){const a=R()*TAU,r=R(),bx=Math.cos(a)*100*r+50,by=cy-34+Math.sin(a)*44*r;ma_blob(c,bx,by,24+R()*14,16+R()*9,seed+i*2.1,0.3,rgba(ma_shade(leaf,1.3),0.5));}
  c.restore();}
/* a building seen from the street: its front w x h from (x, y), lit from the right; o.side a sliver of its right side; o.floors and
   o.cols of windows, or bands of windows in rows; o.fins vertical sunshades; o.ledge a ledge at each floor; o.base its colour */
function ma_bldg(c,x,y,w,h,o){o=o||{};const base=o.base||[206,200,190],dark=ma_shade(base,0.8);
  if(o.side){c.fillStyle=rgba(ma_shade(base,1.1),1);c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w+o.side,y+o.side*0.18);c.lineTo(x+w+o.side,y+h);c.lineTo(x+w,y+h);c.closePath();c.fill();}
  c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);
  const fl=o.floors||0,pitch=fl?(h-(o.top||20)-(o.ground||0))/fl:0;
  for(let f=0;f<fl;f++){const yy=y+(o.top||20)+f*pitch;
    if(o.cols){const cw=(w-2*(o.inset||12))/o.cols;for(let k=0;k<o.cols;k++){const wx=x+(o.inset||12)+k*cw+cw*0.16,ww=cw*0.68,wh=pitch*0.52;
        c.fillStyle=rgba(o.win||[92,100,110],0.7);c.fillRect(wx,yy+pitch*0.18,ww,wh);c.fillStyle="rgba(40,34,28,0.12)";c.fillRect(wx,yy+pitch*0.18,ww,3);
        c.fillStyle="rgba(255,252,244,0.16)";c.fillRect(wx+ww-3,yy+pitch*0.18,3,wh);}}
    else{c.fillStyle=rgba(o.win||[92,100,110],0.6);c.fillRect(x+(o.inset||12),yy+pitch*0.22,w-2*(o.inset||12),pitch*0.42);
      c.fillStyle="rgba(255,252,244,0.14)";c.fillRect(x+(o.inset||12),yy+pitch*0.22,w-2*(o.inset||12),2);}
    if(o.ledge){c.fillStyle=rgba(ma_shade(base,1.08),1);c.fillRect(x-4,yy+pitch-6,w+8,6);c.fillStyle="rgba(40,34,28,0.16)";c.fillRect(x-4,yy+pitch,w+8,3);}}
  if(o.fins){for(let k=0;k<=o.fins;k++){const fx=x+k*(w-6)/o.fins;c.fillStyle=rgba(ma_shade(base,1.06),1);c.fillRect(fx,y+(o.top||20)-6,6,h-(o.top||20)-(o.ground||0)+6);
    c.fillStyle="rgba(40,34,28,0.1)";c.fillRect(fx-4,y+(o.top||20),4,h-(o.top||20)-(o.ground||0));}}
  if(o.ground){c.fillStyle=rgba(ma_shade(base,0.92),1);c.fillRect(x,y+h-o.ground,w,o.ground);c.fillStyle=rgba([70,74,82],0.5);c.fillRect(x+10,y+h-o.ground+14,w-20,o.ground-20);}
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle=rgba(dark,0.6);c.fillRect(x-2,y,w+4,5);}
/* a person far off, walking or standing: no face; s 1 is about 120 px tall; o.top and o.bot the clothes, o.skin, o.ph the step's
   phase, o.walk 0 to stand */
function ma_walker(ctx,x,y,s,o){o=o||{};const t=o.t||0,ph=o.ph||0,walk=o.walk==null?1:o.walk,sw=Math.sin(t*5.2+ph)*7*walk,top=o.top||[86,98,120],bot=o.bot||[62,62,66],skin=o.skin||MA_SKIN[1];
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ag_floorShadow(ctx,-14,2,26,5,0.24);
  ctx.strokeStyle=rgba(bot,1);ctx.lineCap="round";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-3,-50);ctx.lineTo(-3+sw,-2);ctx.moveTo(4,-50);ctx.lineTo(4-sw,-2);ctx.stroke();
  if(o.skirt){ctx.fillStyle=rgba(bot,1);ctx.beginPath();ctx.moveTo(-12,-60);ctx.lineTo(12,-60);ctx.lineTo(16,-28);ctx.lineTo(-16,-28);ctx.closePath();ctx.fill();}
  ctx.strokeStyle=rgba(ma_shade(top,0.9),1);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-11,-94);ctx.lineTo(-13-sw*0.5,-60);ctx.moveTo(11,-94);ctx.lineTo(13+sw*0.5,-60);ctx.stroke();
  ctx.fillStyle=rgba(top,1);ctx.beginPath();ctx.moveTo(-13,-100);ctx.quadraticCurveTo(-16,-76,-12,-52);ctx.lineTo(12,-52);ctx.quadraticCurveTo(16,-76,13,-100);ctx.quadraticCurveTo(0,-106,-13,-100);ctx.fill();
  ctx.fillStyle="rgba(255,250,240,0.18)";ctx.fillRect(6,-98,7,46);
  ctx.fillStyle=rgba(skin,1);ctx.fillRect(-3,-110,6,8);ctx.beginPath();ctx.ellipse(0,-118,9,10.5,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(o.hair||[40,32,28],1);ctx.beginPath();ctx.ellipse(-1,-123,9.5,6,0,Math.PI,TAU);ctx.fill();
  if(o.bag){ctx.fillStyle=rgba([70,56,46],1);ctx.fillRect(12,-66,12,16);}
  ctx.restore();}
/* a car of the time, from the side, facing right (o.flip: left): a rounded saloon, or o.kind "van", a minibus */
function ma_car(c,x,y,s,col,o){o=o||{};c.save();c.translate(x,y);c.scale(o.flip?-s:s,s);ag_floorShadow(c,-6,4,160,13,0.32);const van=o.kind==="van";
  const body=van?(k)=>{k.moveTo(-130,-16);k.lineTo(-131,-100);k.quadraticCurveTo(-130,-114,-114,-114);k.lineTo(92,-114);k.quadraticCurveTo(120,-112,130,-72);k.lineTo(136,-30);k.quadraticCurveTo(136,-16,124,-16);k.closePath();}
    :(k)=>{k.moveTo(-138,-18);k.quadraticCurveTo(-144,-46,-128,-52);k.lineTo(-96,-56);k.quadraticCurveTo(-74,-90,-52,-92);k.lineTo(42,-92);k.quadraticCurveTo(62,-90,86,-58);
      k.lineTo(130,-52);k.quadraticCurveTo(146,-48,142,-18);k.closePath();};
  ag_soft(c,body,col,mix(col,[255,250,240],0.3),60,-80,180,"rgba(30,26,22,0.25)",14,0.5);
  c.fillStyle="rgba(255,250,240,0.2)";c.fillRect(-128,-55,262,4);
  c.fillStyle=rgba([70,80,92],0.88);if(van){c.fillRect(-116,-102,60,36);c.fillRect(-48,-102,60,36);c.fillRect(20,-102,56,36);c.beginPath();c.moveTo(84,-102);c.lineTo(102,-102);c.lineTo(118,-70);c.lineTo(84,-66);c.closePath();c.fill();}
  else{c.beginPath();c.moveTo(-86,-58);c.lineTo(-56,-86);c.lineTo(-6,-86);c.lineTo(-6,-58);c.closePath();c.fill();c.beginPath();c.moveTo(2,-58);c.lineTo(2,-86);c.lineTo(40,-86);c.lineTo(70,-58);c.closePath();c.fill();}
  c.fillStyle="rgba(255,255,255,0.18)";c.fillRect(van?-110:-60,van?-100:-84,18,4);
  c.fillStyle="rgba(30,26,22,0.3)";c.fillRect(-138,-24,280,5);c.fillStyle=rgba([196,196,194],1);c.fillRect(132,-34,10,10);
  for(const wx of [-88,90]){c.fillStyle=rgba(ma_shade(col,0.55),1);c.beginPath();c.arc(wx,-14,28,Math.PI,TAU);c.fill();c.fillStyle="#2B2C30";c.beginPath();c.arc(wx,-12,22,0,TAU);c.fill();
    c.fillStyle="#9A9A98";c.beginPath();c.arc(wx,-12,9,0,TAU);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- Harare, 1992: a wide street in the city centre, a fenced plot
   between office blocks, late afternoon */
const MA_HZ=700;
AG_PLACES.maHarare=c=>{const HZ=MA_HZ;
  ma_sky(c,[164,186,204],[238,226,208],HZ,[1840,330,860,0.55],[[204,212,216],0.55]);
  for(const cl of [[420,170,260,34,1],[1120,120,340,40,2],[1540,232,220,26,3]]){ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.4,"rgba(250,244,234,0.5)");ma_blob(c,cl[0]+30,cl[1]-8,cl[2]*0.6,cl[3]*0.6,cl[4]+9,0.4,"rgba(255,250,242,0.5)");}
  c.fillStyle=rgba([214,208,198],1);c.fillRect(0,HZ-4,W,750-HZ+4);
  // the city behind: towers in the haze
  const far=[[30,360,170,[196,198,200]],[210,300,140,[204,204,204]],[1250,280,150,[198,200,202]],[1420,340,180,[206,204,202]],[1640,250,150,[200,200,202]],[1800,380,160,[196,196,198]]];
  for(const b of far)ma_bldg(c,b[0],b[1],b[2],HZ-b[1],{base:b[3],floors:Math.round((HZ-b[1])/30),cols:0,win:[150,158,166],inset:10,top:14,side:10});
  let g=c.createLinearGradient(0,180,0,HZ);g.addColorStop(0,"rgba(236,228,214,0)");g.addColorStop(0.5,"rgba(236,228,214,0.42)");g.addColorStop(1,"rgba(236,228,214,0.18)");c.fillStyle=g;c.fillRect(0,180,W,HZ-180);
  // the nearer blocks: sixties and seventies offices, with sunshades and ledges
  ma_bldg(c,40,380,420,360,{base:[214,206,192],floors:8,cols:7,ground:56,win:[96,104,114],ledge:1,side:24});
  ma_bldg(c,1460,330,400,410,{base:[204,198,190],floors:9,cols:0,ground:56,fins:10,win:[88,96,108],side:20});
  ma_bldg(c,1860,420,140,320,{base:[196,190,182],floors:7,cols:2,ground:56,win:[96,104,114]});
  // the plot between them: bare earth behind a hoarding, a few weeds, and the backs of the next street
  ma_bldg(c,470,520,300,220,{base:[200,196,188],floors:4,cols:5,win:[110,116,124]});ma_bldg(c,1180,560,280,180,{base:[208,202,192],floors:3,cols:4,win:[110,116,124]});
  g=c.createLinearGradient(0,560,0,740);g.addColorStop(0,"rgba(236,228,214,0.25)");g.addColorStop(1,"rgba(236,228,214,0)");c.fillStyle=g;c.fillRect(470,520,990,220);
  c.fillStyle=rgba([196,168,136],1);c.fillRect(470,664,990,80);ma_grain(c,470,664,990,80,2.2,9);
  const R=ag_rnd(41);for(let i=0;i<34;i++){const x=490+R()*950,y=672+R()*60;c.fillStyle=rgba(mix([132,140,104],[160,164,120],R()),0.8);c.beginPath();c.ellipse(x,y,8+R()*14,4+R()*5,0,0,TAU);c.fill();}
  // the hoarding: plain boards, a little uneven, lit from the right, and the shadow at its foot
  for(let i=0;i<25;i++){const x=470+i*39.6,hh=88+((i*37)%9);c.fillStyle=rgba(mix([170,162,150],[188,180,168],(i%3)/2),1);c.fillRect(x,742-hh,38.6,hh);
    c.fillStyle="rgba(255,250,240,0.13)";c.fillRect(x+31,742-hh,7.6,hh);c.fillStyle="rgba(40,34,28,0.12)";c.fillRect(x,742-hh,2,hh);}
  // the pavement, the kerb and the street
  c.fillStyle=rgba([206,200,190],1);c.fillRect(0,740,W,66);ma_grain(c,0,740,W,66,1.6,3);
  for(let x=0;x<W;x+=128){c.fillStyle="rgba(40,34,28,0.08)";c.fillRect(x,740,2,66);}
  g=c.createLinearGradient(0,740,0,760);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(1,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,740,W,20);
  c.fillStyle=rgba([176,172,166],1);c.fillRect(0,804,W,8);c.fillStyle="rgba(40,34,28,0.22)";c.fillRect(0,812,W,4);
  g=c.createLinearGradient(0,816,0,H);g.addColorStop(0,rgba([150,148,146],1));g.addColorStop(1,rgba([118,116,116],1));c.fillStyle=g;c.fillRect(0,816,W,H-816);ma_grain(c,0,816,W,H-816,2.4,7);
  c.strokeStyle="rgba(60,58,58,0.08)";c.lineWidth=26;for(const y of [872,1010]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}   // where the tyres run
  c.fillStyle="rgba(244,240,230,0.55)";for(let x=40;x<W;x+=240)c.fillRect(x,944,130,9);
  // shade trees on the pavement
  ma_tree(c,330,770,1.08,11,{leaf:[112,130,96]});ma_tree(c,1000,768,0.9,23,{leaf:[120,136,102]});ma_tree(c,1690,776,1.18,37,{leaf:[108,126,94]});
  // parked: a saloon and a white minibus, the city's commuter taxis of the time
  ma_car(c,640,870,0.9,[180,72,56]);ma_car(c,1340,876,0.95,[232,230,222],{kind:"van"});
  // light from the right over everything, and the street's near edge a little darker
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,244,226,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,960,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,0.12)");c.fillStyle=g;c.fillRect(0,960,W,H-960);};
// the people on the pavement and a car passing, live: early-1990s office clothes, small and far off; car: when it starts, or null
const MA_PEOPLE=[[540,790,0.92,{top:[70,86,112],bot:[48,50,56],skin:MA_SKIN[0],ph:0}],[600,792,0.9,{top:[226,222,210],bot:[70,72,80],skin:MA_SKIN[1],ph:1.4,skirt:1,hair:[30,24,22]}],
  [1196,794,0.94,{top:[150,74,64],bot:[70,58,52],skin:MA_SKIN[0],ph:2.2,skirt:1}],[1250,790,0.9,{top:[214,208,196],bot:[60,64,72],skin:MA_SKIN[1],ph:0.7,bag:1}],
  [840,786,0.86,{top:[96,110,90],bot:[54,54,58],skin:MA_SKIN[0],ph:3.1}],[1560,796,0.96,{top:[60,66,84],bot:[44,46,52],skin:MA_SKIN[1],ph:1.9}]];
function ma_harareLife(ctx,t,car){MA_PEOPLE.forEach((p,i)=>{const dir=i%2?-1:1;ma_walker(ctx,p[0]+dir*t*15,p[1],p[2],Object.assign({t,flip:dir<0},p[3]));});
  if(car!=null&&t>car){const x=2200-(t-car)*230;if(x>-300)ma_car(ctx,x,1000,1.02,[92,104,118],{flip:true});}}

/* ---------------------------------------------------------------- the drawing board: a drafting table seen from above */
const MA_SHEET={x:250,y:110,w:1300,h:760};
AG_PLACES.maDesk=c=>{let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba([150,130,104],1));g.addColorStop(1,rgba([176,154,124],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the table's wood: long boards, the grain along them
  const R=ag_rnd(17);for(let y=0;y<H;y+=180){c.fillStyle=rgba(mix([160,138,110],[178,156,126],R()),0.6);c.fillRect(0,y,W,178);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(0,y+178,W,2);}
  c.strokeStyle="rgba(90,66,44,0.08)";c.lineWidth=2;for(let i=0;i<70;i++){const y=R()*H,x=R()*W,l=200+R()*500;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+l*0.3,y+(R()-0.5)*8,x+l*0.7,y+(R()-0.5)*8,x+l,y+(R()-0.5)*6);c.stroke();}
  ma_grain(c,0,0,W,H,2.6,13);
  // the drawing board, pale, with a dark edge, and the sheet taped to it
  const B={x:180,y:60,w:1460,h:880};ma_shadowOf(c,k=>k.rect(B.x,B.y,B.w,B.h),"rgba(40,30,20,0.4)",44,AG.sdx*2.4,22);c.fillStyle=rgba([228,222,210],1);c.fillRect(B.x,B.y,B.w,B.h);
  c.fillStyle=rgba([206,198,184],1);c.fillRect(B.x,B.y+B.h-14,B.w,14);c.fillStyle="rgba(255,250,240,0.3)";c.fillRect(B.x+B.w-6,B.y,6,B.h);
  const S=MA_SHEET;ma_shadowOf(c,k=>k.rect(S.x,S.y,S.w,S.h),"rgba(40,30,20,0.18)",10,-2,3);c.fillStyle=rgba([246,243,236],1);c.fillRect(S.x,S.y,S.w,S.h);
  c.strokeStyle="rgba(120,140,160,0.11)";c.lineWidth=1;for(let x=S.x+40;x<S.x+S.w;x+=40){c.beginPath();c.moveTo(x,S.y);c.lineTo(x,S.y+S.h);c.stroke();}
  for(let y=S.y+40;y<S.y+S.h;y+=40){c.beginPath();c.moveTo(S.x,y);c.lineTo(S.x+S.w,y);c.stroke();}
  for(const [x,y,r] of [[S.x-18,S.y-12,-0.12],[S.x+S.w-48,S.y-14,0.1],[S.x-16,S.y+S.h-24,0.08],[S.x+S.w-50,S.y+S.h-22,-0.1]]){c.save();c.translate(x+32,y+18);c.rotate(r);c.fillStyle="rgba(232,224,196,0.85)";c.fillRect(-32,-18,64,36);c.restore();}
  // the parallel rule across the board, near the bottom, and a set square
  ma_shadowOf(c,k=>k.rect(B.x,880,B.w,34),"rgba(40,30,20,0.3)",12,-4,6);c.fillStyle=rgba([226,230,232],0.96);c.fillRect(B.x,880,B.w,34);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(B.x,880,B.w,3);
  c.fillStyle="rgba(60,70,80,0.3)";for(let x=B.x+10;x<B.x+B.w;x+=20)c.fillRect(x,880,1.5,x%100<20?14:8);
  const sq=k=>{k.moveTo(1662,190);k.lineTo(1880,190);k.lineTo(1662,540);k.closePath();k.moveTo(1700,250);k.lineTo(1700,420);k.lineTo(1806,250);k.closePath();};
  ma_shadowOf(c,sq,"rgba(40,30,20,0.25)",10,-6,6);c.save();c.beginPath();sq(c);c.fillStyle="rgba(206,218,212,0.7)";c.fill("evenodd");c.restore();
  // an eraser and a scale rule on the table
  ma_shadowOf(c,k=>k.rect(1700,700,120,46),"rgba(40,30,20,0.3)",10,-5,5);c.fillStyle=rgba([234,228,216],1);c.fillRect(1700,700,120,46);c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(1700,700,120,4);
  ma_shadowOf(c,k=>k.rect(1690,820,200,30),"rgba(40,30,20,0.3)",10,-5,5);c.fillStyle=rgba([200,190,170],1);c.fillRect(1690,820,200,30);
  c.fillStyle="rgba(60,50,40,0.35)";for(let x=1696;x<1886;x+=10)c.fillRect(x,820,1.2,x%50<10?12:7);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.16)");g.addColorStop(1,"rgba(255,246,230,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the sketch on the sheet: two blocks of offices over shops, an atrium between them, the street. Each straight stroke overshoots its
   ends a little and wavers a hair, as an architect draws; strokes are [points, alpha] */
const MA_SK={y0:300,gr:720,fl:8,blocks:[[440,360],[1000,360]]};
function ma_stroke(P,seed,over){const R=ag_rnd(seed),o=over==null?10:over,n0=P.length,a=P[0],b=P[1],y=P[n0-1],z=P[n0-2],ea=Math.hypot(b[0]-a[0],b[1]-a[1])||1,ez=Math.hypot(y[0]-z[0],y[1]-z[1])||1;
  const Q=[[a[0]-(b[0]-a[0])/ea*o,a[1]-(b[1]-a[1])/ea*o]].concat(P.slice(1,n0-1),[[y[0]+(y[0]-z[0])/ez*o,y[1]+(y[1]-z[1])/ez*o]]);if(n0===2)Q.splice(1,0);
  const out=[];for(let i=1;i<Q.length;i++){const p=Q[i-1],q=Q[i],d=Math.hypot(q[0]-p[0],q[1]-p[1])||1,n=Math.max(1,Math.round(d/34)),nx=-(q[1]-p[1])/d,ny=(q[0]-p[0])/d;
    for(let k=i===1?0:1;k<=n;k++){const u=k/n,wb=k===0||k===n?0:(R()-0.5)*1.5;out.push([lerp(p[0],q[0],u)+nx*wb,lerp(p[1],q[1],u)+ny*wb]);}}
  return [out,0.62+R()*0.24];}
function ma_sketchStrokes(){const L=[],K=MA_SK,fh=(K.gr-80-K.y0)/K.fl;let s=1;const add=(P,o)=>L.push(ma_stroke(P,s++,o));
  for(const [bx,bw] of K.blocks){add([[bx,K.gr],[bx,K.y0]]);add([[bx,K.y0],[bx+bw,K.y0]]);add([[bx+bw,K.y0],[bx+bw,K.gr]]);}
  for(const [bx,bw] of K.blocks)for(let f=1;f<=K.fl;f++)add([[bx,K.y0+f*fh],[bx+bw,K.y0+f*fh]],6);
  for(const [bx,bw] of K.blocks)for(let k=1;k<6;k++)add([[bx+k*bw/6,K.y0+4],[bx+k*bw/6,K.y0+K.fl*fh-4]],3);
  add([[800,K.y0+40],[1000,K.y0+40]]);add([[800,K.y0+40],[900,K.y0-6]],4);add([[900,K.y0-6],[1000,K.y0+40]],4);
  add([[340,K.gr],[1460,K.gr]],14);
  for(let k=0;k<7;k++){const x=460+k*150;add([[x,K.gr-66],[x+110,K.gr-66],[x+110,K.gr],[x,K.gr],[x,K.gr-66]],0);}
  return L;}
const MA_SKL=ma_sketchStrokes();
// the strokes drawing themselves from t0, one after another but overlapping, over about dur seconds
function ma_sketch(ctx,strokes,t,t0,dur,o){o=o||{};const n=strokes.length,a=o.a==null?1:o.a;if(a<=0||t<t0)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=o.lw||2.6;
  if(o.dash)ctx.setLineDash(o.dash);
  strokes.forEach((s,i)=>{const st=t0+i/n*dur*0.8,u=ag_sine(clamp((t-st)/(dur*0.2+0.25),0,1));if(u<=0)return;const P=s[0];let L=0;const D=[0];for(let k=1;k<P.length;k++){L+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);D.push(L);}
    const show=L*u;ctx.strokeStyle=rgba(o.col||[58,60,66],s[1]*a);ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);
    for(let k=1;k<P.length;k++){if(D[k]<=show)ctx.lineTo(P[k][0],P[k][1]);else{const f=(show-D[k-1])/((D[k]-D[k-1])||1);ctx.lineTo(lerp(P[k-1][0],P[k][0],f),lerp(P[k-1][1],P[k][1],f));break;}}ctx.stroke();});
  ctx.restore();}
// a pencil drawing strokes in order: u 0..1 runs along their length and the lifted moves between them (faster); draws what is done,
// and returns {x, y, lift} for the pencil's point
function ma_pencil(ctx,strokes,u,o){o=o||{};const legs=[];let tot=0,prev=null;
  for(const s of strokes){const P=s[0];if(prev){const d=Math.hypot(P[0][0]-prev[0],P[0][1]-prev[1])*0.4;legs.push({move:[prev,P[0]],len:d});tot+=d;}
    let L=0;for(let k=1;k<P.length;k++)L+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);legs.push({s,len:L});tot+=L;prev=P[P.length-1];}
  let left=tot*clamp(u,0,1),tip={x:strokes[0][0][0][0],y:strokes[0][0][0][1],lift:1};ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=o.lw||2.6;if(o.dash)ctx.setLineDash(o.dash);
  for(const g of legs){if(left<=0)break;const k=Math.min(1,left/(g.len||1));
    if(g.move){const p=g.move[0],q=g.move[1];tip={x:lerp(p[0],q[0],ag_sine(k)),y:lerp(p[1],q[1],ag_sine(k)),lift:Math.sin(Math.PI*k)};}
    else{const P=g.s[0],show=g.len*k;let L=0;ctx.strokeStyle=rgba(o.col||[58,60,66],g.s[1]*(o.a==null?1:o.a));ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);tip={x:P[0][0],y:P[0][1],lift:0};
      for(let j=1;j<P.length;j++){const d=Math.hypot(P[j][0]-P[j-1][0],P[j][1]-P[j-1][1]);if(L+d<=show){ctx.lineTo(P[j][0],P[j][1]);tip={x:P[j][0],y:P[j][1],lift:0};L+=d;}
        else{const f=(show-L)/(d||1);tip={x:lerp(P[j-1][0],P[j][0],f),y:lerp(P[j-1][1],P[j][1],f),lift:0};ctx.lineTo(tip.x,tip.y);break;}}ctx.stroke();}
    left-=g.len;}
  ctx.restore();return tip;}
/* the pencil: graphite point at (x, y), leaning back down and to the right; lift 0..1 raises it off the paper, so its shadow parts
   from it. A draughtsman's pencil, charcoal grey, with no brand */
function ma_pencilBody(ctx,x,y,lift,a){a=a==null?1:a;if(a<=0)return;const L=290,ang=0.62,hx=Math.cos(ang),hy=Math.sin(ang),lf=lift||0;ctx.save();ctx.globalAlpha*=a;
  // the shadow on the paper: it meets the point when the pencil touches, and falls away to the left of its far end
  const sx=-26-lf*14,sy=10+lf*8;ctx.fillStyle="rgba(40,30,20,0.1)";for(const k of [1,0.6]){ctx.beginPath();ctx.moveTo(x+lf*-10,y+lf*8);
    ctx.lineTo(x+hx*L+sx-hy*9*k,y+hy*L+sy+hx*9*k);ctx.lineTo(x+hx*L+sx+hy*9*k,y+hy*L+sy-hx*9*k);ctx.closePath();ctx.fill();}
  ctx.translate(x,y-lf*16);ctx.rotate(ang);
  ctx.fillStyle="#34353A";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-2.4);ctx.lineTo(10,2.4);ctx.closePath();ctx.fill();
  ctx.fillStyle="#E4CFA8";ctx.beginPath();ctx.moveTo(9,-2.6);ctx.lineTo(40,-8);ctx.quadraticCurveTo(42,-4,40,-2);ctx.quadraticCurveTo(43,2,40,4);ctx.quadraticCurveTo(42,6,40,8);ctx.lineTo(9,2.6);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(120,90,60,0.25)";ctx.beginPath();ctx.moveTo(9,1);ctx.lineTo(40,3);ctx.lineTo(40,8);ctx.lineTo(9,2.6);ctx.closePath();ctx.fill();
  ctx.fillStyle="#4A4C53";ctx.beginPath();ctx.moveTo(40,-8);ctx.lineTo(L,-8);ctx.lineTo(L,8);ctx.lineTo(40,8);ctx.quadraticCurveTo(42,6,40,4);ctx.quadraticCurveTo(43,2,40,-2);ctx.quadraticCurveTo(42,-4,40,-8);ctx.fill();
  ctx.fillStyle="#62656D";ctx.fillRect(41,-8,L-41,5);ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(41,-6.5,L-41,1.6);ctx.fillStyle="#3A3B40";ctx.fillRect(41,3,L-41,5);
  ctx.fillStyle="#2E2F33";ctx.fillRect(L-2,-8,2,16);ctx.restore();}
// the air-conditioning plant the usual way, pencilled onto the left block's roof: a box with two fans, and ducts down into the building
function ma_plantStrokes(){const x=470,y=MA_SK.y0-130;let s=60;const P=(pts,o)=>ma_stroke(pts,s++,o==null?6:o);
  return [P([[x,y+130],[x,y]]),P([[x,y],[x+300,y]]),P([[x+300,y],[x+300,y+130]]),P([[x+40,y+30],[x+130,y+30],[x+130,y+100],[x+40,y+100],[x+40,y+30]],0),
    P([[x+170,y+30],[x+260,y+30],[x+260,y+100],[x+170,y+100],[x+170,y+30]],0),P([[x+300,y+60],[x+330,y+60],[x+330,y+130]],0),P([[x+300,y+90],[x+316,y+90],[x+316,y+130]],0),
    P([[x+323,y+130],[x+323,MA_SK.gr-80]],4)];}
const MA_PLANT=ma_plantStrokes();
// the plant's two fans, turning (a, from 0, as the plant's lines are drawn)
function ma_plantFans(ctx,t,a,col){if(a<=0)return;const x=470,y=MA_SK.y0-130;for(const cx of [x+85,x+215])ma_fan(ctx,cx,y+65,26,t*3,col||"rgba(58,60,66,0.75)",a,true);}
/* a fan seen face on: three broad curved blades round a hub, inside a ring (never four bent arms) */
function ma_fan(ctx,x,y,r,ang,col,a,ring){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=Math.max(1.6,r*0.09);
  if(ring){ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}ctx.rotate(ang);
  for(let k=0;k<3;k++){ctx.rotate(TAU/3);ctx.beginPath();ctx.moveTo(r*0.16,-r*0.05);ctx.bezierCurveTo(r*0.4,-r*0.42,r*0.82,-r*0.44,r*0.84,-r*0.08);ctx.bezierCurveTo(r*0.7,r*0.02,r*0.42,r*0.06,r*0.16,r*0.08);ctx.closePath();ctx.globalAlpha*=0.55;ctx.fill();ctx.globalAlpha/=0.55;ctx.stroke();}
  ctx.beginPath();ctx.arc(0,0,r*0.17,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the drawing board's other things, live
   The usual way, pencilled onto the sketch: a crate delivered to the site (stamped "imported"), a paper price tag on the plant,
   a sun crossing the sheet while a dial on the plant runs from morning to night; then the bills, the rents, and the architect's
   title block in the sheet's corner, as on any architect's drawing. */
const MA_CRATE=(()=>{const x=268,y=598,w=150,h=118;let s=120;const P=(pts,o)=>ma_stroke(pts,s++,o==null?5:o);
  return [P([[x,y+h],[x,y]]),P([[x,y],[x+w,y]]),P([[x+w,y],[x+w,y+h]]),P([[x,y+h],[x+w,y+h]]),P([[x,y+h/3],[x+w,y+h/3]],2),P([[x,y+h*2/3],[x+w,y+h*2/3]],2),
    P([[x+8,y+h-8],[x+w-8,y+8]],2)];})();
// a paper tag on a string from (sx, sy), its words on it; k springs it in, swing a little sway
function ma_paperTag(ctx,sx,sy,x,y,text,a,o){o=o||{};if(a<=0)return;const f={w:700,size:28},tw=ag_tw(ctx,text,f),w=tw+(o.arrow?62:44),h=46,rot=o.rot||0;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle="rgba(70,62,52,0.7)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+x)/2,Math.max(sy,y)+10,x+8,y+h/2);ctx.stroke();
  ctx.translate(x,y+h/2);ctx.rotate(rot);ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;
  ctx.fillStyle="#EFE6CF";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14,-h/2);ctx.lineTo(w,-h/2);ctx.lineTo(w,h/2);ctx.lineTo(14,h/2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(120,104,80,0.5)";ctx.beginPath();ctx.arc(12,0,4,0,TAU);ctx.fill();ag_T(ctx,text,26,10,{w:700,size:28,col:[70,62,52]});
  if(o.arrow){const ax=26+tw+18,k=o.arrow;ctx.fillStyle="rgba(70,62,52,0.85)";ctx.beginPath();ctx.moveTo(ax,-12-4*k);ctx.lineTo(ax+9,0-4*k);ctx.lineTo(ax-9,0-4*k);ctx.closePath();ctx.fill();ctx.fillRect(ax-2.5,-2-4*k,5,12);}
  ctx.restore();}
// a pencilled sun on its arc across the sheet's sky, u 0..1 from morning to night; and the plant's dial, its hand on the same day
function ma_sunArc(ctx,u,a){if(a<=0)return;const x=lerp(1000,1500,u),y=250-Math.sin(Math.PI*u)*110;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(58,60,66,0.75)";ctx.lineWidth=2.6;ctx.lineCap="round";
  ctx.setLineDash([3,9]);ctx.beginPath();for(let k=0;k<=40;k++){const v=k/40;ctx.lineTo(lerp(1000,1500,v),250-Math.sin(Math.PI*v)*110);}ctx.globalAlpha*=0.5;ctx.stroke();ctx.globalAlpha/=0.5;ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.stroke();for(let k=0;k<8;k++){const r=k/8*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(r)*28,y+Math.sin(r)*28);ctx.lineTo(x+Math.cos(r)*38,y+Math.sin(r)*38);ctx.stroke();}ctx.restore();}
function ma_plantDial(ctx,u,a){if(a<=0)return;const x=880,y=232;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(58,60,66,0.8)";ctx.lineWidth=2.6;ctx.lineCap="round";
  ctx.beginPath();ctx.arc(x,y,34,0,TAU);ctx.stroke();for(let k=0;k<12;k++){const r=k/12*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(r)*26,y+Math.sin(r)*26);ctx.lineTo(x+Math.cos(r)*31,y+Math.sin(r)*31);ctx.stroke();}
  const r=-Math.PI/2+u*TAU*0.92;ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(r)*24,y+Math.sin(r)*24);ctx.stroke();ctx.beginPath();ctx.moveTo(800,232);ctx.lineTo(846,232);ctx.stroke();ctx.restore();}
// the title block in the sheet's corner: a ruled box with the architect's name, pencilled
const MA_TB=(()=>{const x=1180,y=760,w=350,h=96;let s=140;const P=(pts,o)=>ma_stroke(pts,s++,o==null?4:o);
  return [P([[x,y],[x+w,y]]),P([[x,y],[x,y+h]]),P([[x,y+h],[x+w,y+h]]),P([[x+w,y],[x+w,y+h]])];})();
function ma_titleBlock(ctx,t,t0,a){if(a<=0||t<t0)return;ma_sketch(ctx,MA_TB,t,t0,0.8,{a});const k=ag_in(t,t0+0.5,0.6)*a;
  ag_T(ctx,"Mick Pearce",1204,806,{w:800,size:36,col:[52,54,60],a:k});ag_T(ctx,"architect",1204,842,{w:500,size:28,col:[84,86,92],a:k});}
// a "let" sign in a shop window of Eastgate (block 0 or 1, window k 0..4), k springs it in
function ma_letSign(ctx,b,k,u){if(u<=0)return;const bx=MA_EGX.blocks[b][0],bw=MA_EGX.blocks[b][1],x=bx+20+k*(bw-40)/5+10+48,y=MA_EGX.HZ-58,s=lerp(0.6,1,ag_spr(u,0,0.4)),a=clamp(u*4,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(60,60,64,0.6)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-20,-34);ctx.lineTo(-14,-22);ctx.moveTo(20,-34);ctx.lineTo(14,-22);ctx.stroke();
  ctx.fillStyle="#F6F2E8";rr(ctx,-40,-22,80,44,6);ctx.fill();ctx.strokeStyle="rgba(150,96,78,0.9)";ctx.lineWidth=3;rr(ctx,-36,-18,72,36,4);ctx.stroke();
  ag_T(ctx,"LET",0,10,{w:800,size:28,ls:2,align:"center",col:[150,80,60]});ctx.restore();}

/* ---------------------------------------------------------------- termite mounds, southern Africa: the savanna */
const MA_EARTH=[186,140,104];
function ma_savanna(c,HZ,o){o=o||{};ma_sky(c,o.top||[164,176,198],o.low||[242,220,190],HZ,o.sun||[1700,HZ-60,760,0.5],o.mid||[[216,204,204],0.6]);
  for(const cl of (o.clouds||[[300,140,280,24,3],[1180,90,360,30,5]])){ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.45,"rgba(252,240,228,0.42)");}
  c.fillStyle=rgba(o.hills||[172,164,158],1);c.beginPath();c.moveTo(0,HZ);for(let x=0;x<=W;x+=24)c.lineTo(x,HZ-16-28*AG_NZ.fbm(x*0.0025,3.3,3));c.lineTo(W,HZ+2);c.lineTo(0,HZ+2);c.fill();
  const bot=o.bottom||H,g=c.createLinearGradient(0,HZ,0,bot);g.addColorStop(0,rgba(o.grass||[210,190,148],1));g.addColorStop(1,rgba(o.grass2||[180,158,116],1));c.fillStyle=g;c.fillRect(0,HZ,W,bot-HZ);ma_grain(c,0,HZ,W,bot-HZ,2.4,21);
  const R=ag_rnd(31);for(let i=0;i<190;i++){const y=HZ+8+Math.pow(R(),1.4)*(bot-HZ-10),x=R()*W,k=0.3+(y-HZ)/(H-HZ)*1.6;
    c.strokeStyle=rgba(mix([150,132,94],[186,168,122],R()),0.62);c.lineWidth=1.6*k;c.beginPath();for(let j=0;j<5;j++){c.moveTo(x+j*3*k,y);c.quadraticCurveTo(x+j*3*k+4*k,y-10*k,x+j*3*k+(j-2)*4*k,y-18*k-R()*8*k);}c.stroke();}
  for(const a of (o.acacias||[[240,HZ+12,0.62],[1580,HZ+8,0.48],[1800,HZ+14,0.4]]))ma_acacia(c,a[0],a[1],a[2]);}
function ma_acacia(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);ag_floorShadow(c,-40,4,180,14,0.2);
  c.strokeStyle=rgba([94,82,72],1);c.lineCap="round";c.lineWidth=14;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(8,-80,-12,-150);c.moveTo(3,-66);c.quadraticCurveTo(44,-110,74,-160);c.stroke();
  c.lineWidth=6;c.beginPath();c.moveTo(-12,-150);c.lineTo(-64,-178);c.moveTo(74,-160);c.lineTo(124,-180);c.moveTo(-12,-150);c.lineTo(10,-196);c.stroke();
  ma_blob(c,30,-196,180,30,7,0.25,rgba([104,116,90],1));ma_blob(c,46,-206,140,22,8,0.3,rgba([124,136,106],1));ma_blob(c,70,-214,90,14,9,0.3,rgba([146,156,122],1));c.restore();}
/* the mound: a tall spire leaning a little, a turret on its right shoulder, buttresses at its foot; its base on the ground at MA_MD.base */
const MA_MD={cx:900,base:820,h:640,w:300};
function ma_moundPts(){const M=MA_MD,cx=M.cx,base=M.base,h=M.h,w=M.w;return ma_smooth([[cx-w,base],[cx-w*0.84,base-h*0.07],[cx-w*0.62,base-h*0.15],[cx-w*0.5,base-h*0.3],
  [cx-w*0.37,base-h*0.45],[cx-w*0.29,base-h*0.6],[cx-w*0.2,base-h*0.76],[cx-w*0.12,base-h*0.9],[cx-w*0.04,base-h],[cx+w*0.05,base-h*0.99],[cx+w*0.1,base-h*0.9],
  [cx+w*0.15,base-h*0.76],[cx+w*0.2,base-h*0.64],[cx+w*0.3,base-h*0.6],[cx+w*0.36,base-h*0.66],[cx+w*0.42,base-h*0.62],[cx+w*0.46,base-h*0.46],[cx+w*0.58,base-h*0.3],
  [cx+w*0.72,base-h*0.16],[cx+w*0.88,base-h*0.07],[cx+w,base]],8);}
const MA_MP=ma_moundPts();
// where the mound's outline crosses height y, on the left (side -1) or the right (side 1)
function ma_moundX(y,side){const P=MA_MP,top=P.reduce((m,p,i)=>p[1]<P[m][1]?i:m,0),S=side<0?P.slice(0,top+1):P.slice(top).reverse();
  for(let i=1;i<S.length;i++){const a=S[i-1],b=S[i];if((a[1]-y)*(b[1]-y)<=0){const k=(y-a[1])/((b[1]-a[1])||1);return lerp(a[0],b[0],k);}}return MA_MD.cx;}
function ma_earthTex(){return ag_kept("ma:earth",600,700,(c,tw,th)=>{const img=c.createImageData(tw,th),d=img.data;
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const m=AG_NZ.fbm(x*0.012,y*0.004,4)-0.5,f=AG_NZ.n2(x*0.3,y*0.3)-0.5,gr=AG_NZ.fbm(x*0.06,y*0.006,2)-0.5,L=m*18+f*6+gr*10,i=(y*tw+x)*4;
    d[i]=d[i+1]=d[i+2]=128+L;d[i+3]=255;}c.putImageData(img,0,0);});}
function ma_overlayTex(c,x,y,w,h,a){c.save();c.globalCompositeOperation="overlay";c.globalAlpha=a;c.drawImage(ma_earthTex(),x,y,w,h);c.restore();}
AG_PLACES.maMound=c=>{const M=MA_MD,HZ=560;ma_savanna(c,HZ);
  // the mound, whole: earth lit from the right, rain-worn streaks, the openings at its foot, its shadow falling left
  ma_shadowOf(c,k=>{k.ellipse(M.cx-150,M.base+6,M.w*1.5,26,0,0,TAU);},"rgba(60,40,26,0.45)",30,0,0);
  c.save();ma_poly(c,MA_MP);c.clip();c.fillStyle=rgba(MA_EARTH,1);c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);ma_overlayTex(c,M.cx-M.w,M.base-M.h-10,2*M.w,M.h+20,0.6);
  let g=c.createLinearGradient(M.cx-M.w,0,M.cx+M.w,0);g.addColorStop(0,"rgba(60,40,28,0.42)");g.addColorStop(0.5,"rgba(60,40,28,0.06)");g.addColorStop(0.8,"rgba(255,236,210,0.2)");g.addColorStop(1,"rgba(255,236,210,0.06)");
  c.fillStyle=g;c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);g=c.createLinearGradient(0,M.base-M.h,0,M.base);g.addColorStop(0,"rgba(255,236,210,0.1)");g.addColorStop(1,"rgba(60,40,28,0.22)");c.fillStyle=g;c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);
  const R=ag_rnd(4);c.lineCap="round";for(let i=0;i<30;i++){const y=M.base-M.h*(0.05+R()*0.85),side=R()<0.5?-1:1,x0=ma_moundX(y,side),x=lerp(x0,M.cx,0.1+R()*0.6);
    c.strokeStyle=side>0?"rgba(255,236,210,0.12)":"rgba(70,48,34,0.18)";c.lineWidth=2+R()*3;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(R()-0.5)*14,y+50,x+(R()-0.5)*10,y+90+R()*80);c.stroke();}
  c.restore();
  for(const [x,y,s] of [[M.cx-M.w*0.66,M.base-14,1],[M.cx+M.w*0.62,M.base-12,0.9],[M.cx-M.w*0.2,M.base-8,0.7]]){c.fillStyle="rgba(60,40,30,0.75)";c.beginPath();c.ellipse(x,y,16*s,12*s,0,Math.PI,TAU);c.lineTo(x+16*s,y+4);c.lineTo(x-16*s,y+4);c.fill();}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,24,0.1)");g.addColorStop(1,"rgba(255,240,220,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the mound cut down the middle, as a diorama: the ground cut away in front too, showing the soil. Inside: a central chimney, open at
   the top; channels just under the skin on each side; a few passages between; openings at the foot; and below the ground the nest,
   its fungus gardens. Channels are cut into the face: the light from the right falls on their left wall. */
const MA_GY=820;
function ma_cutChannel(c,pts,w0,w1){const S=ma_smooth(pts,10),n=S.length,L=[],R=[];for(let i=0;i<n;i++){const p=S[i],q=S[Math.min(n-1,i+1)],o=S[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,i/(n-1))/2;
    L.push([p[0]-dy/d*w,p[1]+dx/d*w]);R.push([p[0]+dy/d*w,p[1]-dx/d*w]);}
  const shape=k=>{k.moveTo(L[0][0],L[0][1]);for(const p of L)k.lineTo(p[0],p[1]);for(let i=n-1;i>=0;i--)k.lineTo(R[i][0],R[i][1]);k.closePath();};
  c.beginPath();shape(c);c.fillStyle=rgba([88,60,46],1);c.fill();
  c.save();c.beginPath();shape(c);c.clip();c.strokeStyle="rgba(214,170,128,0.55)";c.lineWidth=Math.max(3,w0*0.22);c.beginPath();
  const side=S[n-1][1]<S[0][1]?L:R;c.moveTo(side[0][0],side[0][1]);for(const p of side)c.lineTo(p[0],p[1]);c.stroke();c.restore();}
const MA_CH={chim:[[MA_MD.cx-4,MA_GY-40],[MA_MD.cx-10,MA_GY-220],[MA_MD.cx-2,MA_MD.base-MA_MD.h*0.62],[MA_MD.cx+2,MA_MD.base-MA_MD.h*0.86],[MA_MD.cx+4,MA_MD.base-MA_MD.h+6]]};
function ma_conduit(side){const out=[];for(let y=MA_GY-16;y>=MA_MD.base-MA_MD.h*0.66;y-=36)out.push([ma_moundX(y,side)-side*40,y]);return out;}
AG_PLACES.maMoundCut=c=>{const M=MA_MD,HZ=560,gy=MA_GY;ma_savanna(c,HZ,{bottom:gy});
  // the soil, cut: topsoil, then paler subsoil with stones, roots from the grass
  let g=c.createLinearGradient(0,gy,0,H);g.addColorStop(0,rgba([132,98,72],1));g.addColorStop(0.16,rgba([138,104,78],1));g.addColorStop(0.22,rgba([160,124,94],1));g.addColorStop(1,rgba([146,110,84],1));c.fillStyle=g;c.fillRect(0,gy,W,H-gy);
  ma_overlayTex(c,0,gy,W,H-gy,0.4);const R=ag_rnd(12);
  for(let i=0;i<46;i++){const x=R()*W,y=gy+70+R()*(H-gy-70),r=4+R()*12;c.fillStyle=rgba(mix([120,104,92],[176,160,140],R()),0.85);c.beginPath();c.ellipse(x,y,r*1.3,r,R()*3,0,TAU);c.fill();
    c.fillStyle="rgba(255,240,220,0.25)";c.beginPath();c.ellipse(x+r*0.3,y-r*0.3,r*0.5,r*0.35,0,0,TAU);c.fill();}
  c.strokeStyle="rgba(84,62,46,0.45)";c.lineCap="round";for(let i=0;i<26;i++){const x=R()*W;if(Math.abs(x-M.cx)<M.w+30)continue;c.lineWidth=1.5+R()*2;c.beginPath();c.moveTo(x,gy+2);
    c.bezierCurveTo(x+(R()-0.5)*40,gy+40,x+(R()-0.5)*60,gy+80,x+(R()-0.5)*70,gy+110+R()*70);c.stroke();}
  c.fillStyle=rgba([196,176,132],1);c.fillRect(0,gy-5,W,8);c.fillStyle="rgba(255,244,220,0.45)";c.fillRect(0,gy-5,W,2);
  // a sliver of the mound's outside, lit, beyond the cut on the right; then the cut face, flat, the same earth a little paler, with
  // faint layers where the termites built it up
  ma_shadowOf(c,k=>{k.ellipse(M.cx-120,M.base+4,M.w*1.3,20,0,0,TAU);},"rgba(60,40,26,0.4)",26,0,0);
  c.save();c.translate(M.cx+10,M.base);c.scale(1.035,1.012);c.translate(-M.cx,-M.base);ma_poly(c,MA_MP);c.fillStyle=rgba([206,160,118],1);c.fill();
  const og=c.createLinearGradient(M.cx,0,M.cx+M.w,0);og.addColorStop(0,"rgba(120,80,56,0.3)");og.addColorStop(1,"rgba(255,236,210,0.2)");c.fillStyle=og;c.fill();c.restore();
  c.save();ma_poly(c,MA_MP);c.clip();c.fillStyle=rgba([194,150,112],1);c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);ma_overlayTex(c,M.cx-M.w,M.base-M.h,2*M.w,M.h,0.5);
  c.strokeStyle="rgba(120,84,60,0.12)";c.lineWidth=2;for(let i=1;i<16;i++){const y=M.base-i*M.h/16;c.beginPath();c.moveTo(ma_moundX(y,-1)+4,y+6);c.quadraticCurveTo(M.cx,y-14,ma_moundX(y,1)-4,y+6);c.stroke();}
  g=c.createLinearGradient(0,M.base-M.h,0,M.base);g.addColorStop(0,"rgba(255,240,220,0.1)");g.addColorStop(1,"rgba(80,54,38,0.12)");c.fillStyle=g;c.fillRect(M.cx-M.w-20,M.base-M.h-20,2*M.w+40,M.h+40);
  // the channels: under the skin on both sides, the chimney, passages between them, openings at the foot
  for(const s of [-1,1]){ma_cutChannel(c,ma_conduit(s),16,12);const top=ma_conduit(s).pop();
    ma_cutChannel(c,[top,[lerp(top[0],M.cx,0.5),top[1]-60],[M.cx+s*8,M.base-M.h*0.8]],13,11);
    for(const f of [0.26,0.46]){const y=M.base-M.h*f;ma_cutChannel(c,[[M.cx+s*14,y],[lerp(M.cx,ma_moundX(y,s),0.5),y-24],[ma_moundX(y-30,s)-s*40,y-34]],10,10);}
    ma_cutChannel(c,[[ma_moundX(gy-22,s)+s*2,gy-22],[ma_moundX(gy-22,s)-s*44,gy-20]],13,13);}
  ma_cutChannel(c,MA_CH.chim,50,20);
  // the vent at the top: the chimney opening to the sky
  c.restore();
  // below the ground: the nest, a hollow of chambers whose fungus gardens look like pale sponges, ridged and uneven
  c.save();const nest=k=>{for(const p of ma_blobPts(M.cx,gy+40,200,96,8,0.14,64))k.lineTo(p[0],p[1]);k.closePath();};c.beginPath();nest(c);c.fillStyle=rgba([84,58,46],1);c.fill();c.clip();
  const NR=ag_rnd(19);for(let r=0;r<3;r++)for(let k=0;k<5;k++){const x=M.cx-160+k*76+(r%2)*34+(NR()-0.5)*16,y=gy-16+r*50+(NR()-0.5)*8,rx=26+NR()*12,ry=18+NR()*6;
    const comb=q=>{const P=ma_blobPts(x,y,rx,ry,r*7+k,0.3,40);q.moveTo(P[0][0],P[0][1]);for(const p of P)q.lineTo(p[0],p[1]);q.closePath();};
    ag_soft(c,comb,[206,190,162],[232,222,200],x+8,y-8,30,"rgba(70,50,36,0.35)",8,0.7);c.save();c.beginPath();comb(c);c.clip();c.strokeStyle="rgba(140,116,90,0.55)";c.lineWidth=1.8;
    for(let j=-3;j<=3;j++){c.beginPath();c.moveTo(x+j*9-6,y-ry);c.bezierCurveTo(x+j*9+6,y-ry*0.3,x+j*9-6,y+ry*0.3,x+j*9+4,y+ry);c.stroke();}c.restore();}
  c.restore();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,24,0.1)");g.addColorStop(1,"rgba(255,240,220,0.05)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the idea, then: fresh air drawn in at the foot on both sides, down into the nest; warm air up the chimney and out of the top */
function ma_moundIdea(ctx,t,cool,warm){const M=MA_MD,gy=MA_GY;
  for(const s of [-1,1]){const xf=ma_moundX(gy-22,s);ma_air(ctx,[[M.cx+s*(M.w+300),gy-46],[xf+s*120,gy-30],[xf-s*30,gy-21],[M.cx+s*170,gy+2],[M.cx+s*60,gy+18]],MA_COOLD,t+(s>0?0.7:0),{u:cool,w:17,speed:54});}
  ma_air(ctx,[[M.cx-4,gy+10],[M.cx-8,gy-150],[M.cx-6,gy-330],[M.cx+2,M.base-M.h*0.86],[M.cx+6,M.base-M.h-30],[M.cx+40,M.base-M.h-130]],MA_WARM,t,{u:warm,w:16,speed:70});}
/* what sensors found, years later: the air moves like a lung. By day (night 0) the walls warm in the sun, air rises in the channels
   under the skin and sinks down the chimney; by night (night 1) it turns round. n 0..1 how far the night has come */
function ma_moundLung(ctx,t,n,a){const M=MA_MD,gy=MA_GY,day=n<0.5,k=day?1-n*2:(n-0.5)*2;if(a<=0)return;
  for(const s of [-1,1]){const C=ma_conduit(s),top=C[C.length-1],loopTop=[[top[0],top[1]],[lerp(top[0],M.cx,0.5),top[1]-60],[M.cx+s*8,M.base-M.h*0.8]];
    const up=C.concat(loopTop.slice(1)),down=[[M.cx+s*4,M.base-M.h*0.78],[M.cx+s*6,M.base-M.h*0.5],[M.cx+s*4,gy-60],[M.cx+s*40,gy-20],[C[0][0]-s*0,C[0][1]+6]];
    if(day){ma_air(ctx,up,MA_WARM,t,{u:1,w:13,speed:46,a:a*k});ma_air(ctx,down,MA_COOL,t,{u:1,w:13,speed:46,a:a*k});}
    else{ma_air(ctx,up.slice().reverse(),MA_COOL,t,{u:1,w:13,speed:46,a:a*k});ma_air(ctx,down.slice().reverse(),MA_WARM,t,{u:1,w:13,speed:46,a:a*k});}}}
// a sensor pushed into the mound: a slim probe with a cable running out to the ground
function ma_sensor(ctx,x,y,ang,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(60,62,68,0.9)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);
  ctx.bezierCurveTo(x+Math.cos(ang)*120,y+Math.sin(ang)*120,x+Math.cos(ang)*200,MA_GY-40,x+Math.cos(ang)*260,MA_GY-6);ctx.stroke();
  ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle="#C9CCD0";rr(ctx,-6,-7,46,14,6);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(0,-5,36,3);ctx.fillStyle="#7C8088";ctx.beginPath();ctx.arc(-4,0,6,0,TAU);ctx.fill();ctx.restore();}
// night over the savanna: a deep blue veil over the sky and the land, the cut a little less (it is lit for us to see)
function ma_moundNight(ctx,n){if(n<=0)return;ctx.save();ctx.fillStyle="rgba(26,30,58,"+(0.5*n).toFixed(3)+")";ctx.fillRect(0,0,W,MA_GY);ctx.fillStyle="rgba(26,30,58,"+(0.22*n).toFixed(3)+")";ctx.fillRect(0,MA_GY,W,H-MA_GY);
  ctx.globalAlpha=n;const R=ag_rnd(77);for(let i=0;i<60;i++){ctx.fillStyle="rgba(255,250,236,"+(0.5*R()).toFixed(3)+")";ctx.fillRect(R()*W,R()*420,2,2);}ctx.restore();}

/* ---------------------------------------------------------------- Eastgate cut through: two blocks of offices over shops, an atrium
   between them under a glass roof, hollow floors with concrete teeth, fans low down, ducts up the outer walls, and brick chimneys
   along the roofs; by day (people at their desks) and by night (empty, the fans running) */
const MA_EG={gr:868,y0:300,fl:8,fh:60,blocks:[[230,580],[1110,580]],atr:[810,1110]};
function ma_section(c,night){const E=MA_EG,n=night?1:0,M=(a,b)=>mix(a,b,n);
  ma_sky(c,M([186,200,210],[38,46,72]),M([240,232,216],[84,90,116]),E.gr,n?null:[1760,150,700,0.5]);
  if(n){const R=ag_rnd(5);for(let i=0;i<110;i++){c.fillStyle="rgba(255,250,236,"+(0.6*R()).toFixed(3)+")";c.fillRect(R()*W,R()*560,2,2);}
    const m=c.createRadialGradient(1660,150,6,1660,150,90);m.addColorStop(0,"rgba(250,246,232,0.95)");m.addColorStop(0.25,"rgba(250,246,232,0.3)");m.addColorStop(1,"rgba(250,246,232,0)");c.fillStyle=m;c.fillRect(1560,50,200,200);}
  // the ground cut through: the street's paving, then soil
  let g=c.createLinearGradient(0,E.gr,0,H);g.addColorStop(0,rgba(M([168,160,150],[60,62,74]),1));g.addColorStop(0.1,rgba(M([168,160,150],[60,62,74]),1));g.addColorStop(0.12,rgba(M([150,124,100],[56,52,60]),1));g.addColorStop(1,rgba(M([136,110,88],[48,46,54]),1));
  c.fillStyle=g;c.fillRect(0,E.gr,W,H-E.gr);ma_overlayTex(c,0,E.gr+24,W,H-E.gr-24,0.3);c.fillStyle=rgba(M([200,194,184],[80,82,94]),1);c.fillRect(0,E.gr,W,4);
  const top=E.y0,bot=E.y0+E.fl*E.fh;
  for(const [bx,bw] of E.blocks){ag_floorShadow(c,bx+bw/2-50,E.gr+4,bw*0.62,14,0.3);
    c.fillStyle=rgba(M([222,214,200],[108,108,118]),1);c.fillRect(bx,bot,bw,E.gr-bot);   // the shops, taller
    for(let k=0;k<5;k++){c.fillStyle=rgba(M([120,132,140],[70,74,90]),0.6);c.fillRect(bx+20+k*(bw-40)/5,bot+26,(bw-40)/5-16,E.gr-bot-36);}
    for(let f=0;f<E.fl;f++){const y=top+f*E.fh;c.fillStyle=rgba(M([234,228,216],[124,124,134]),1);c.fillRect(bx,y,bw,E.fh-16);
      c.fillStyle=rgba(M([200,192,180],[100,100,110]),1);for(let k=50;k<bw-60;k+=92)c.fillRect(bx+k,y+E.fh-36,48,5);   // desks
      const fy=y+E.fh-16;c.fillStyle=rgba(M([168,162,152],[74,76,86]),1);c.fillRect(bx,fy,bw,16);
      c.fillStyle=rgba(M([146,140,132],[62,64,74]),1);for(let k=6;k<bw;k+=16)c.fillRect(bx+k,fy+4,7,8);}   // the hollow floor and its teeth
    for(let f=0;f<=E.fl;f++){c.fillStyle=rgba(M([198,190,178],[92,92,102]),1);c.fillRect(bx-20,top+f*E.fh-4,20,8);c.fillRect(bx+bw,top+f*E.fh-4,20,8);}
    // the ducts: one up the outer wall from the fans, and shafts up to the chimneys
    const out=bx<800?bx+14:bx+bw-30;c.fillStyle=rgba(M([210,202,190],[100,102,112]),1);c.fillRect(out,top,16,bot-top+40);c.fillStyle=rgba(M([186,178,166],[86,88,98]),1);c.fillRect(out+12,top,4,bot-top+40);
    for(let k=0;k<8;k+=2){const cx=bx+40+k*(bw-80)/7;c.fillStyle=rgba(M([214,206,194],[106,106,116]),0.75);c.fillRect(cx-9,top,18,bot-top-16);}
    // the chimneys along the roof, brick, with caps
    for(let k=0;k<8;k++){const cx=bx+40+k*(bw-80)/7;c.fillStyle=rgba(M([176,126,100],[96,78,74]),1);c.fillRect(cx-15,top-100,30,102);
      c.fillStyle=rgba(M([148,106,86],[80,64,62]),1);c.fillRect(cx-20,top-108,40,10);c.fillStyle="rgba(255,240,220,0.14)";c.fillRect(cx+8,top-100,7,102);}
    g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,248,236,0.06)");c.fillStyle=g;c.fillRect(bx,top,bw,E.gr-top);
    // the fans: round housings low on the outer side
    const fx=bx<800?bx+64:bx+bw-64,fy=bot+44;c.fillStyle=rgba(M([150,150,150],[80,82,92]),1);c.beginPath();c.arc(fx,fy,27,0,TAU);c.fill();c.fillStyle=rgba(M([120,120,122],[66,68,78]),1);c.beginPath();c.arc(fx,fy,8,0,TAU);c.fill();
    // by day, people at their desks: small, seated, no faces
    if(!n){const R=ag_rnd(bx|0);for(let f=0;f<E.fl;f++)for(let k=50;k<bw-60;k+=92){if(R()<0.42)continue;const px=bx+k+24+(R()-0.5)*10,py=top+f*E.fh+E.fh-38;
      c.fillStyle=rgba(mix([90,100,120],[150,96,84],R()),1);rr(c,px-7,py-14,14,16,4);c.fill();c.fillStyle=rgba(MA_SKIN[(R()*2)|0],1);c.beginPath();c.arc(px,py-20,5.5,0,TAU);c.fill();}}}
  // the atrium: open to the sky under a glass roof, its floor the shops' street
  const [a0,a1]=E.atr;c.fillStyle=rgba(M([210,220,224],[90,100,122]),0.8);c.beginPath();c.moveTo(a0,top-30);c.lineTo((a0+a1)/2,top-62);c.lineTo(a1,top-30);c.lineTo(a1,top-20);c.lineTo((a0+a1)/2,top-52);c.lineTo(a0,top-20);c.closePath();c.fill();
  c.strokeStyle=rgba(M([150,160,168],[70,78,96]),1);c.lineWidth=3;for(let k=0;k<=6;k++){const x=a0+k*(a1-a0)/6;c.beginPath();c.moveTo(x,top-26-Math.min(x-a0,a1-x)/((a1-a0)/2)*30);c.lineTo(x,E.gr);c.globalAlpha=0.25;c.stroke();c.globalAlpha=1;}
  for(let f=2;f<E.fl;f+=3){const y=top+f*E.fh+E.fh-12;c.fillStyle=rgba(M([200,196,188],[96,98,110]),0.9);c.fillRect(a0,y,a1-a0,8);}   // bridges across the atrium
  if(n){c.fillStyle="rgba(20,24,40,0.16)";c.fillRect(0,0,W,H);}}
AG_PLACES.maSection=c=>ma_section(c,false);
AG_PLACES.maSectionNight=c=>ma_section(c,true);
/* the parts lighting one by one (lit: [fans, floors, chimneys], each 0..1), the fans turning, and the air: o.cool by night (fans pull
   cool air in, up the ducts and through the hollow floors, whose concrete stores the cool); o.warm by day (warm air rises from the
   offices up the shafts and out of the chimneys) */
function ma_sectionLive(ctx,t,o){o=o||{};const E=MA_EG,top=E.y0,bot=E.y0+E.fl*E.fh,lit=o.lit||[0,0,0],n=o.night||0;
  for(const [bx,bw] of E.blocks){const L0=lit[0],fx=bx<800?bx+64:bx+bw-64,fy=bot+44;
    if(L0>0){ctx.save();ctx.globalAlpha=L0;ctx.fillStyle=rgba(n>0.5?[196,208,220]:[236,224,206],0.6);ctx.beginPath();ctx.arc(fx,fy,30,0,TAU);ctx.fill();
      ctx.restore();ma_fan(ctx,fx,fy,23,t*(o.spin==null?4:o.spin),rgba(n>0.5?[70,84,104]:[96,96,100],1),L0,false);}
    for(let f=0;f<E.fl;f++){const L=clamp(lit[1]*E.fl-f,0,1);if(L<=0)continue;const y=top+f*E.fh+E.fh-16;ctx.fillStyle=rgba(n>0.5||o.cool?[206,220,232]:[240,224,204],0.5*L*(o.glow==null?1:o.glow));ctx.fillRect(bx,y,bw,16);}
    for(let k=0;k<8;k++){const L=clamp(lit[2]*8-k,0,1);if(L<=0)continue;const cx=bx+40+k*(bw-80)/7;ctx.fillStyle=rgba([236,196,170],0.5*L);ctx.fillRect(cx-15,top-100,30,102);}}
  if(o.cool>0){for(const [bx,bw] of E.blocks){const left=bx<800,dir=left?1:-1,duct=left?bx+22:bx+bw-22,fx=left?bx+64:bx+bw-64,fy=bot+44;
      for(let f=1;f<E.fl;f+=2){const y=top+f*E.fh+E.fh-8,far=left?bx+bw-30:bx+30;
        ma_air(ctx,[[duct-dir*190,E.gr-12],[duct-dir*70,E.gr-16],[fx,fy+6],[duct,bot-10],[duct,y+20],[duct+dir*30,y],[lerp(duct,far,0.5),y],[far,y]],MA_COOL,t+f*0.37,{u:o.cool,w:10,speed:58});}}}
  if(o.warm>0){for(const [bx,bw] of E.blocks)for(let k=0;k<8;k+=2){const cx=bx+40+k*(bw-80)/7;
      ma_air(ctx,[[cx,bot-24],[cx+2,(bot+top)/2],[cx,top-40],[cx+4,top-150],[cx+26,top-240]],MA_WARM,t+k*0.2,{u:o.warm,w:12,speed:72});}}}

/* ---------------------------------------------------------------- Eastgate in 1996, from the street: two long blocks of rough
   granite-grey concrete, small windows set deep behind sunshades, rows of brick chimneys on the roof, a glass-roofed atrium between,
   and shops at street level */
const MA_EGX={HZ:800,top:300,blocks:[[120,690],[1110,690]]};
AG_PLACES.maEastgate=c=>{const X=MA_EGX,HZ=X.HZ;ma_sky(c,[166,190,210],[236,232,222],HZ,[1820,160,760,0.55]);
  for(const cl of [[360,140,240,30,4],[1300,96,300,36,6]])ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.4,"rgba(252,248,240,0.55)");
  ma_bldg(c,-20,440,140,HZ-440,{base:[200,200,198],floors:9,cols:2,win:[140,150,160]});ma_bldg(c,1800,400,140,HZ-400,{base:[204,200,196],floors:10,cols:2,win:[140,150,160]});
  // the atrium between the blocks: a high glass roof on a steel frame, its far end open to the street behind
  c.fillStyle="rgba(206,218,226,0.75)";c.beginPath();c.moveTo(810,X.top+50);c.lineTo(960,X.top-16);c.lineTo(1110,X.top+50);c.lineTo(1110,HZ);c.lineTo(810,HZ);c.closePath();c.fill();
  c.strokeStyle="rgba(110,120,130,0.5)";c.lineWidth=4;for(let k=0;k<=8;k++){const x=810+k*37.5;c.beginPath();c.moveTo(x,X.top+50-Math.min(x-810,1110-x)/150*66);c.lineTo(x,HZ);c.stroke();}
  for(let y=X.top+100;y<HZ;y+=76){c.beginPath();c.moveTo(810,y);c.lineTo(1110,y);c.stroke();}
  for(const [bx,bw] of X.blocks){const by=X.top;c.fillStyle=rgba([188,182,172],1);c.fillRect(bx,by,bw,HZ-by);ma_grain(c,bx,by,bw,HZ-by,3.8,bx|0);
    // the face: piers between bays, each floor's windows small and deep, a sunshade over each
    const bays=8,bwid=(bw-40)/bays;for(let f=0;f<8;f++){const y=by+26+f*44;for(let k=0;k<bays;k++){const x=bx+20+k*bwid;
        c.fillStyle=rgba([70,76,86],0.85);c.fillRect(x+14,y+10,bwid-28,22);c.fillStyle="rgba(40,34,28,0.35)";c.fillRect(x+14,y+10,bwid-28,6);
        c.fillStyle="rgba(255,248,236,0.16)";c.fillRect(x+bwid-18,y+12,4,20);c.fillStyle=rgba([210,204,194],1);c.fillRect(x+8,y+4,bwid-16,7);c.fillStyle="rgba(40,34,28,0.2)";c.fillRect(x+8,y+11,bwid-16,3);}}
    for(let k=0;k<=bays;k++){const x=bx+14+k*bwid;c.fillStyle=rgba([198,192,182],1);c.fillRect(x,by+18,12,HZ-by-150);c.fillStyle="rgba(255,250,240,0.16)";c.fillRect(x+8,by+18,4,HZ-by-150);c.fillStyle="rgba(40,34,28,0.12)";c.fillRect(x-4,by+18,4,HZ-by-150);}
    // the chimneys on the roof: brick stacks with caps, in two rows, the far row smaller
    for(let row=1;row>=0;row--)for(let k=0;k<9;k++){const cx=bx+40+k*(bw-80)/8+(row?22:0),h=row?66:96,cy=by-h+(row?-8:0);c.fillStyle=rgba(row?[160,118,96]:[176,128,102],1);c.fillRect(cx-16,cy,32,h);
      c.fillStyle=rgba(row?[136,100,82]:[146,104,84],1);c.fillRect(cx-21,cy-8,42,10);c.fillStyle="rgba(255,240,220,0.16)";c.fillRect(cx+8,cy,8,h);c.fillStyle="rgba(40,30,24,0.12)";c.fillRect(cx-16,cy,5,h);}
    const g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,"rgba(40,34,28,0.16)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(bx,by,bw,HZ-by);
    // the shops at street level: awnings and windows
    for(let k=0;k<5;k++){const x=bx+20+k*(bw-40)/5,w=(bw-40)/5-14;c.fillStyle=rgba([238,232,220],1);c.fillRect(x,HZ-120,w,112);
      c.fillStyle=rgba([96,108,118],0.72);c.fillRect(x+10,HZ-96,w-20,80);c.fillStyle="rgba(255,252,244,0.2)";c.fillRect(x+w-18,HZ-94,4,76);
      c.fillStyle=rgba(k%2?[150,96,78]:[118,110,96],1);c.beginPath();c.moveTo(x-6,HZ-130);c.lineTo(x+w+6,HZ-130);c.lineTo(x+w+16,HZ-102);c.lineTo(x-16,HZ-102);c.closePath();c.fill();
      c.fillStyle="rgba(40,34,28,0.16)";c.fillRect(x-14,HZ-102,w+28,6);}}
  c.fillStyle=rgba([204,198,188],1);c.fillRect(0,HZ,W,64);ma_grain(c,0,HZ,W,64,1.6,8);for(let x=0;x<W;x+=128){c.fillStyle="rgba(40,34,28,0.07)";c.fillRect(x,HZ,2,64);}
  c.fillStyle="rgba(40,34,28,0.2)";c.fillRect(0,HZ+64,W,4);
  let g=c.createLinearGradient(0,HZ+68,0,H);g.addColorStop(0,rgba([150,148,146],1));g.addColorStop(1,rgba([124,122,120],1));c.fillStyle=g;c.fillRect(0,HZ+68,W,H-HZ-68);ma_grain(c,0,HZ+68,W,H-HZ-68,2.2,9);
  c.fillStyle="rgba(244,240,230,0.5)";for(let x=60;x<W;x+=240)c.fillRect(x,1000,130,8);
  ma_tree(c,70,HZ+44,0.82,51,{leaf:[112,130,96]});ma_tree(c,1880,HZ+50,0.88,57,{leaf:[106,126,92]});
  ma_car(c,520,HZ+150,0.86,[206,204,198]);ma_car(c,1460,HZ+154,0.88,[120,70,62],{flip:true});
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(1,"rgba(255,244,226,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// people at the shops, live
function ma_eastgateLife(ctx,t){const HZ=MA_EGX.HZ,P=[[300,HZ+46,0.84,{top:[170,80,70],skirt:1,skin:MA_SKIN[0]}],[420,HZ+50,0.86,{top:[230,226,214],skin:MA_SKIN[1]}],[880,HZ+44,0.8,{top:[90,104,130],skin:MA_SKIN[0]}],
  [1000,HZ+48,0.84,{top:[214,180,96],skirt:1,skin:MA_SKIN[1]}],[1300,HZ+50,0.86,{top:[96,112,96],skin:MA_SKIN[0],bag:1}],[1520,HZ+46,0.82,{top:[236,232,224],skin:MA_SKIN[1]}],[1660,HZ+48,0.86,{top:[120,72,84],skirt:1,skin:MA_SKIN[0]}]];
  P.forEach((p,i)=>{const dir=i%2?-1:1;ma_walker(ctx,p[0]+dir*t*13,p[1],p[2],Object.assign({t,ph:i*1.1,flip:dir<0},p[3]));});}

/* ---------------------------------------------------------------- the plant room, later: a painted concrete wall, the big ducts
   under the ceiling, and the control cabinet: a chart recorder whose pen draws the offices' warmth, and the fans' dials below it */
const MA_PL={x:900,y:120,w:860,h:900,chart:{x:980,y:200,w:700,h:330},dials:[[1040,680],[1240,680],[1440,680],[1640,680]]};
AG_PLACES.maPlant=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([200,196,188],1));g.addColorStop(1,rgba([184,178,170],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,2.4,31);
  c.fillStyle=rgba([170,164,156],1);c.fillRect(0,640,W,H-640);c.fillStyle="rgba(255,250,240,0.25)";c.fillRect(0,640,W,3);
  // the ducts under the ceiling, round, with bands
  for(const [y,r] of [[54,46],[150,30]]){c.fillStyle=rgba([196,198,198],1);c.fillRect(0,y-r,W,r*2);g=c.createLinearGradient(0,y-r,0,y+r);g.addColorStop(0,"rgba(255,255,255,0.25)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(40,34,28,0.25)");
    c.fillStyle=g;c.fillRect(0,y-r,W,r*2);for(let x=60;x<W;x+=240){c.fillStyle="rgba(40,34,28,0.18)";c.fillRect(x,y-r,8,r*2);}}
  // the cabinet
  const P=MA_PL;ma_shadowOf(c,k=>k.rect(P.x,P.y,P.w,P.h),"rgba(40,34,28,0.4)",40,AG.sdx*2.6,16);c.fillStyle=rgba([176,182,184],1);c.fillRect(P.x,P.y,P.w,P.h);
  g=c.createLinearGradient(P.x,0,P.x+P.w,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,250,240,0.14)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle="rgba(255,255,255,0.3)";c.fillRect(P.x,P.y,P.w,3);c.fillStyle="rgba(40,34,28,0.2)";c.fillRect(P.x,P.y+P.h-3,P.w,3);
  // the chart recorder's window: paper with a grid; the comfort line is drawn live
  const C=P.chart;c.fillStyle=rgba([70,74,80],1);rr(c,C.x-16,C.y-16,C.w+32,C.h+32,10);c.fill();c.fillStyle=rgba([244,240,230],1);c.fillRect(C.x,C.y,C.w,C.h);
  c.strokeStyle="rgba(120,130,140,0.25)";c.lineWidth=1.2;for(let x=C.x+35;x<C.x+C.w;x+=35){c.beginPath();c.moveTo(x,C.y);c.lineTo(x,C.y+C.h);c.stroke();}for(let y=C.y+33;y<C.y+C.h;y+=33){c.beginPath();c.moveTo(C.x,y);c.lineTo(C.x+C.w,y);c.stroke();}
  g=c.createLinearGradient(0,C.y,0,C.y+C.h);g.addColorStop(0,"rgba(255,255,255,0.25)");g.addColorStop(0.3,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(C.x,C.y,C.w,C.h);
  // the dials: knobs on round plates, with ticks
  for(const [x,y] of P.dials){c.fillStyle=rgba([226,226,220],1);c.beginPath();c.arc(x,y,70,0,TAU);c.fill();c.strokeStyle="rgba(60,64,70,0.5)";c.lineWidth=2;
    for(let i=0;i<=10;i++){const a=Math.PI*0.75+i/10*Math.PI*1.5;c.beginPath();c.moveTo(x+Math.cos(a)*56,y+Math.sin(a)*56);c.lineTo(x+Math.cos(a)*64,y+Math.sin(a)*64);c.stroke();}
    c.fillStyle="rgba(40,34,28,0.22)";c.beginPath();c.arc(x-3,y+6,32,0,TAU);c.fill();c.fillStyle=rgba([66,68,74],1);c.beginPath();c.arc(x,y,30,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.16)";c.beginPath();c.arc(x+8,y-10,12,0,TAU);c.fill();}
  for(let k=0;k<6;k++){const x=980+k*120;c.fillStyle=rgba([62,64,70],1);rr(c,x,860,44,64,6);c.fill();c.fillStyle="rgba(255,255,255,0.2)";c.fillRect(x+4,862,36,5);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(1,"rgba(255,246,230,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* the chart, live: the comfort line (dashed), and the pen's trace of the offices' warmth up to u (0..1): it climbs over the line as
   the offices run warm, and settles back under it after fix (the u at which the controls were tuned), or never if fix is null */
function ma_chart(ctx,u,fix,a){const C=MA_PL.chart,lim=C.y+C.h*0.42;a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.setLineDash([12,10]);ctx.strokeStyle="rgba(70,80,90,0.7)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(C.x,lim);ctx.lineTo(C.x+C.w,lim);ctx.stroke();ctx.setLineDash([]);
  const v=x=>{const day=Math.sin(x*TAU*3-1.2)*0.13,warm=fix==null?sstep(0.25,0.7,x)*0.3:sstep(0.25,0.5,x)*0.3*(1-sstep(fix,fix+0.2,x));return C.y+C.h*(0.62-day-warm);};
  const n=Math.max(1,Math.floor(140*clamp(u,0,1)));ctx.strokeStyle="#33363C";ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();for(let i=0;i<=n;i++){const x=i/140;ctx.lineTo(C.x+C.w*x,v(x));}ctx.stroke();
  const px=C.x+C.w*n/140,py=v(n/140);ctx.fillStyle="#33363C";ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();ctx.restore();return [px,py];}
// a dial's pointer (k: which dial, v 0..1 its setting)
function ma_dial(ctx,k,v){const [x,y]=MA_PL.dials[k],a=Math.PI*0.75+clamp(v,0,1)*Math.PI*1.5;ctx.save();ctx.strokeStyle="#E8E4DA";ctx.lineWidth=6;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*24,y+Math.sin(a)*24);ctx.stroke();ctx.restore();}
// the engineer who looks after the building, a person of the story (not a real one): a short-sleeved work shirt
const MA_ENGINEER={name:"",role:"",skin:[98,64,46],hair:{style:"cropped",c:[26,22,22]},top:{kind:"shirt",c:[196,206,214]},breath:0.26};
