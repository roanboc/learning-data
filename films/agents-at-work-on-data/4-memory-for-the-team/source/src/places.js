/* ===== Memory: from one chat to the team: the places of the opening, and its people =====
   Painted full-frame in the module's matte style (no outlines, muted colours, the light from the right, soft contact shadows),
   dressed for their time; each place is painted once (AG_PLACES.tm*), and what moves in it is drawn live by the helpers beside it.
   Every top-level name here starts with tm_ or TM_. No airline's name, colours or logo, and no real person's face: the jets are
   generic jets of the time in plain pale grey, and the people are composites, dressed as photographs of the time show crews,
   controllers, mechanics and office workers. Cloud, rain and the radar's light are never the module's meaning colours.
     tm_tag(ctx, text, a, o)          the place and date on a small card at the top left (o.x, o.y; o.dashed)
     tmSky                            low cloud over the hills west of Washington, in December; the ridge in the way at TM_RIDGE
       tm_jet(ctx, x, y, s, o)        a jet of the time, side on, facing right, (x, y) its middle: o.tilt (radians), o.a, o.strobe
       tm_clouds(ctx, t, a, o)        soft cloud drifting past: o.y and o.h the band, o.n, o.seed, o.speed, o.k (size)
       tm_rain(ctx, t, a, o)          rain and wet snow over the frame: o.snow (0 to 1)
     tmRadar                          an approach control room, 1974, in the dark: the console, its round scope, the strip board
       tm_scope(ctx, t, o)            the scope's picture: rings, the sweep, and the jet's blip with its trail (o.u along its way)
       tm_lit(ctx, draw, o)           draws someone into the room's dark, lit by the scope from the right
     tmProfile                        the approach side on, on chart paper: the ground, the ridge and the runway (TM_PRO); the paths,
                                      the cloud over the ridge and the words are drawn live (tm_proPath, tm_proCloud)
     tmCrew                           three crew rooms side by side, each an airline's own, each with a cork notice board (TM_ROOMS)
       tm_notice(ctx, i, o)           a notice on room i's board: o.kind "notice" (an airline's, 1974) or "alert" (the reporting
                                      system's), o.p (0 to 1, pinned on), o.a
     tmNasa                           the reporting system's office, California, 1976: files, a window, a steel desk
       tm_desk76(ctx)                 the desk's front again, over what stands behind it
       tm_form(ctx, x, y, o)          a report form, 220 by 290, (x, y) its top left: o.strip (0 to 1: its ID strip is cut off and
                                      taken away), o.a
   The people of 1974 and 1976 are in TM_P: a controller with a headset, two pilots, a controller of 1976, a mechanic, an analyst. */

const TM={sky:[[150,158,166],[178,184,189],[196,199,201]],hills:[[168,174,177],[148,154,155],[122,126,122],[98,100,93]],mist:[198,201,203],
  jet:[228,229,230],jetDk:[168,172,178],win:[64,70,80],trim:[146,140,132],phos:[184,214,220],
  paper:[244,240,231],ink:[52,56,62],cork:[180,146,108],lino:[146,136,122]};

/* the place and date, on a small card at the top left, in screen space; o.dashed: a dashed edge */
function tm_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const w=ag_tw(ctx,s,{w:500,size:28,f:"mono"})+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  if(o.dashed){ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.2;rr(ctx,x+5,y+5,w-10,h-10,9);ctx.stroke();ctx.setLineDash([]);}
  else{ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();}
  ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- the hills in cloud, December 1974
   Four ranges of low, rounded hills, paler with distance, bare winter woods on the near ones and mist in the valleys, under a low
   grey deck of cloud. The third range carries the ridge the jet met: its crest at TM_RIDGE.x, TM_RIDGE.h above the range. */
const TM_RIDGE={x:1240,w:230,h:96};
const TM_RANGES=[[596,24,1],[642,38,2],[722,52,3,true],[872,44,4]];   // each range's base, height of its wander, seed, and whether the ridge is in it
function tm_ridgeY(x,i){const r=TM_RANGES[i];let y=r[0]-r[1]*(AG_NZ.fbm(x*0.0017+r[2]*3.7,r[2]*1.3,4)-0.5)*2.2;
  if(r[3]){const d=(x-TM_RIDGE.x)/TM_RIDGE.w;y-=TM_RIDGE.h*Math.exp(-d*d);}return y;}
function tm_range(c,i){c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=6)c.lineTo(x,tm_ridgeY(x,i));c.lineTo(W,H);c.closePath();}
AG_PLACES.tmSky=c=>{
  let g=c.createLinearGradient(0,0,0,720);g.addColorStop(0,rgba(TM.sky[0],1));g.addColorStop(0.55,rgba(TM.sky[1],1));g.addColorStop(1,rgba(TM.sky[2],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the cloud's underside: soft, darker folds across the top of the frame
  const R=ag_rnd(41);for(let i=0;i<26;i++){const x=R()*W*1.1-80,y=30+R()*320,rx=220+R()*380,ry=46+R()*80,k=R();
    const gg=c.createRadialGradient(x,y,4,x,y,rx);gg.addColorStop(0,rgba(mix(TM.sky[0],[118,124,132],0.3+k*0.4),0.32));gg.addColorStop(1,rgba(TM.sky[0],0));
    c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillStyle=gg;c.fillRect(x-rx,y-rx,2*rx,2*rx);c.restore();}
  TM_RANGES.forEach((r,i)=>{const col=TM.hills[i];tm_range(c,i);
    const gr=c.createLinearGradient(0,r[0]-r[1]*2-TM_RIDGE.h,0,r[0]+240);gr.addColorStop(0,rgba(ag_lt(col,0.04),1));gr.addColorStop(1,rgba(ag_dk(col,0.1),1));c.fillStyle=gr;c.fill();
    if(i>=2){c.save();c.clip();const RW=ag_rnd(90+i);c.lineCap="round";   // bare woods: short dark strokes along the slope, densest near the crest
      for(let k=0;k<2600;k++){const x=RW()*W,top=tm_ridgeY(x,i),y=top+3+Math.pow(RW(),1.6)*260,len=(4+RW()*10)*(i===3?1.4:1);
        c.strokeStyle=rgba(ag_dk(col,0.3+RW()*0.25),0.1+RW()*0.15);c.lineWidth=1+RW()*1.3;c.beginPath();c.moveTo(x,y);c.lineTo(x+(RW()-0.5)*2,y-len);c.stroke();}c.restore();}
    // mist: the lower part of each range fades towards the haze
    const mg=c.createLinearGradient(0,r[0]-r[1]*0.4,0,r[0]+150);mg.addColorStop(0,rgba(TM.mist,0));mg.addColorStop(1,rgba(TM.mist,i<3?0.55:0.22));
    c.save();tm_range(c,i);c.clip();c.fillStyle=mg;c.fillRect(0,r[0]-r[1]*2-TM_RIDGE.h,W,H);c.restore();});
  g=c.createRadialGradient(1700,200,40,1700,200,1200);g.addColorStop(0,"rgba(255,255,252,0.12)");g.addColorStop(1,"rgba(255,255,252,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_grain(c,0,0,W,H,1.2,23);};

/* a jet of the time, side on, facing right: a long pale-grey body, a swept fin with its tailplane on top, engines at the tail, the
   windows in a row; no name, colours or logo. (x, y) is its middle, about 330 s long */
function tm_jet(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.tilt||0);ctx.scale(s,s);
  const B=TM.jet,D=TM.jetDk;
  // the far wing, in shade behind the body
  ctx.fillStyle=rgba(ag_dk(D,0.18),1);ctx.beginPath();ctx.moveTo(10,2);ctx.lineTo(46,0);ctx.lineTo(-20,-11);ctx.lineTo(-38,-10);ctx.closePath();ctx.fill();
  // the fin, swept back, and the tailplane across its top
  ag_soft(ctx,c=>{c.moveTo(-104,-12);c.lineTo(-146,-70);c.lineTo(-124,-72);c.lineTo(-78,-14);c.closePath();},B,[255,255,255],-110,-62,50,rgba(ag_dk(D,0.5),0.35),6);
  ag_soft(ctx,c=>{c.moveTo(-164,-75);c.lineTo(-116,-77);c.quadraticCurveTo(-108,-74,-116,-70);c.lineTo(-162,-69);c.closePath();},ag_dk(B,0.05),[255,255,255],-130,-77,30,null);
  // the middle engine's intake at the fin's root
  ag_soft(ctx,c=>c.ellipse(-84,-17,15,6,0,0,TAU),ag_dk(B,0.08),[255,255,255],-80,-21,12,null);
  // the body: a long rounded tube, the nose to the right, lit from above
  const body=c=>{c.moveTo(-164,-6);c.bezierCurveTo(-150,-13,-128,-15,-108,-15);c.lineTo(112,-15);c.bezierCurveTo(142,-15,158,-6,162,2);c.bezierCurveTo(160,9,148,14,128,14);
    c.lineTo(-96,14);c.bezierCurveTo(-126,12,-152,4,-164,-6);c.closePath();};
  ctx.save();ag_shape(ctx,body);let g=ctx.createLinearGradient(0,-15,0,14);g.addColorStop(0,rgba(ag_lt(B,0.3),1));g.addColorStop(0.45,rgba(B,1));g.addColorStop(1,rgba(D,1));ctx.fillStyle=g;ctx.fill();ctx.restore();
  // a plain trim line, the windows and the cockpit's
  ctx.fillStyle=rgba(TM.trim,0.5);ctx.fillRect(-120,1,250,2.4);
  ctx.fillStyle=rgba(TM.win,0.85);for(let k=0;k<23;k++){ctx.beginPath();ctx.arc(-92+k*9,-5,2,0,TAU);ctx.fill();}
  ctx.beginPath();ctx.moveTo(128,-11);ctx.lineTo(146,-9);ctx.lineTo(151,-4);ctx.lineTo(130,-4);ctx.closePath();ctx.fill();
  // the near engine on the side of the tail
  ag_soft(ctx,c=>{c.moveTo(-126,-23);c.lineTo(-74,-23);c.quadraticCurveTo(-65,-16,-74,-8);c.lineTo(-126,-8);c.quadraticCurveTo(-133,-15,-126,-23);c.closePath();},
    ag_lt(B,0.05),[255,255,255],-96,-23,40,rgba(ag_dk(D,0.5),0.4),6);
  ctx.fillStyle=rgba(ag_dk(D,0.55),1);ctx.beginPath();ctx.ellipse(-73,-15,3,6,0,0,TAU);ctx.fill();
  // the near wing, swept back, towards us
  ag_soft(ctx,c=>{c.moveTo(4,8);c.lineTo(42,10);c.lineTo(-26,37);c.lineTo(-52,36);c.closePath();},ag_dk(B,0.03),[255,255,255],10,10,40,rgba(ag_dk(D,0.5),0.35),6);
  if(o.strobe>0)glow(ctx,-150,-74,18,[255,255,255],o.strobe);
  ctx.restore();}

/* soft cloud: puffs painted once, drifting past at their own speeds */
function tm_puff(){return ag_kept("tm:puff",320,180,(c,w,h)=>{const R=ag_rnd(7);for(let i=0;i<14;i++){const x=50+R()*220,y=66+R()*56,r=38+R()*56,g=c.createRadialGradient(x,y,2,x,y,r);
  g.addColorStop(0,"rgba(238,239,240,0.55)");g.addColorStop(0.6,"rgba(226,228,230,0.3)");g.addColorStop(1,"rgba(220,222,225,0)");c.fillStyle=g;c.fillRect(0,0,w,h);}});}
function tm_clouds(ctx,t,a,o){o=o||{};if(a<=0)return;const n=o.n||14,seed=o.seed||1,sp=o.speed==null?40:o.speed,img=tm_puff(),span=W+900,k=o.k||1,ga=ctx.globalAlpha;
  ctx.save();for(let i=0;i<n;i++){const v=0.6+0.4*hash(i,seed+2),x=((hash(i,seed)*span-t*sp*v)%span+span)%span-450,y=(o.y||520)+(hash(i,seed+1)-0.5)*(o.h||200),
    s=(1.6+hash(i,seed+3)*1.8)*k;ctx.globalAlpha=ga*a*(0.5+0.5*hash(i,seed+4));ctx.drawImage(img,x-160*s,y-90*s,320*s,180*s);}ctx.restore();}
/* rain and wet snow, slanting a little, pale against the hills */
function tm_rain(ctx,t,a,o){o=o||{};if(a<=0)return;const ga=ctx.globalAlpha,n=o.n||150;ctx.save();ctx.lineCap="round";ctx.strokeStyle="rgb(232,236,240)";
  for(let i=0;i<n;i++){const sp=1250+hash(i,3)*500,len=22+hash(i,5)*22,y=((hash(i,2)*(H+120)+t*sp)%(H+120))-60,x=hash(i,1)*(W+400)-(y+60)*0.22-100;
    ctx.globalAlpha=ga*a*(0.12+0.16*hash(i,4));ctx.lineWidth=1.2+hash(i,6)*1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len*0.22,y+len);ctx.stroke();}
  const sn=o.snow==null?0.5:o.snow;if(sn>0){ctx.fillStyle="rgb(244,246,248)";for(let i=0;i<60;i++){const sp=90+hash(i,13)*70,y=((hash(i,12)*(H+40)+t*sp)%(H+40))-20,
    x=hash(i,11)*W+Math.sin(t*0.9+i)*18-y*0.08;ctx.globalAlpha=ga*a*sn*(0.35+0.35*hash(i,14));ctx.beginPath();ctx.arc(x,y,1.6+hash(i,15)*1.8,0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the approach control room, 1974
   A dark room: a tall graphite console on the right with a round radar scope set in it, a long desk across the frame, and a rack of
   paper flight strips on the desk at the left. The controller sits at the console, lit by the scope (tm_lit). */
const TM_SCOPE={x:1330,y:420,r:245};
AG_PLACES.tmRadar=c=>{const S0=TM_SCOPE;
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2E343C");g.addColorStop(1,"#1F2329");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(S0.x,S0.y,60,S0.x-240,S0.y,1150);g.addColorStop(0,"rgba(150,186,196,0.17)");g.addColorStop(1,"rgba(150,186,196,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let x=150;x<W;x+=360){c.fillStyle="rgba(0,0,0,0.2)";c.fillRect(x,0,2,760);c.fillStyle="rgba(255,255,255,0.035)";c.fillRect(x+2,0,1,760);}
  // a second console far to the left, its own scope a faint glow
  ag_soft(c,cc=>ag_rect(cc,-60,250,330,520,22),[44,47,52],[70,76,84],200,280,300,"rgba(0,0,0,0.5)",20);
  g=c.createRadialGradient(110,430,6,110,430,130);g.addColorStop(0,"rgba(170,204,212,0.22)");g.addColorStop(1,"rgba(170,204,212,0)");c.fillStyle=g;c.fillRect(-40,300,300,260);
  c.fillStyle="#141A1D";c.beginPath();c.arc(110,430,92,0,TAU);c.fill();
  // the console: a tall graphite cabinet, its face lit a little from the scope
  ag_soft(c,cc=>ag_rect(cc,1010,80,880,700,28),[56,59,65],[98,104,114],1520,130,640,"rgba(0,0,0,0.5)",30);
  ag_soft(c,cc=>{cc.arc(S0.x,S0.y,S0.r+46,0,TAU);},[40,42,47],[88,94,102],S0.x+90,S0.y-150,260,"rgba(0,0,0,0.6)",20);
  c.fillStyle="#0C1114";c.beginPath();c.arc(S0.x,S0.y,S0.r+6,0,TAU);c.fill();
  // knobs and switches under the scope; a small panel of lamps at the right
  for(let k=0;k<7;k++){const kx=1130+k*92,ky=726;ag_soft(c,cc=>cc.arc(kx,ky,17,0,TAU),[30,32,36],[120,124,130],kx+5,ky-6,16,null);
    c.fillStyle="rgba(200,200,190,0.5)";c.fillRect(kx-1,ky-15,2,9);}
  ag_soft(c,cc=>ag_rect(cc,1700,190,120,240,12),[46,48,54],[90,96,104],1780,200,140,"rgba(0,0,0,0.4)",10);
  for(let k=0;k<4;k++){c.fillStyle="rgba(150,156,164,0.35)";c.fillRect(1722,222+k*52,76,6);}
  // the desk across the frame: a pale laminate top and its front
  ag_soft(c,cc=>ag_rect(cc,-20,758,W+40,44,6),[108,110,114],[168,172,178],1300,762,800,null);
  g=c.createLinearGradient(0,800,0,H);g.addColorStop(0,"#2C2F35");g.addColorStop(1,"#1B1D22");c.fillStyle=g;c.fillRect(0,800,W,H-800);
  c.fillStyle="rgba(255,255,255,0.12)";c.fillRect(0,758,W,1.5);
  // the strip board: a slanted rack of paper flight strips, their marks too small to read
  ag_soft(c,cc=>{cc.moveTo(140,560);cc.lineTo(500,560);cc.lineTo(520,760);cc.lineTo(120,760);cc.closePath();},[58,60,64],[96,100,108],420,570,260,"rgba(0,0,0,0.45)",12);
  for(let k=0;k<6;k++){const y=578+k*30,x0=150-k*3,x1=505+k*2.2;c.fillStyle="rgb("+(196+k%2*8)+","+(190+k%2*6)+","+(168+k%2*4)+")";c.fillRect(x0,y,x1-x0,22);
    c.fillStyle="rgba(60,58,54,0.55)";for(let m=0;m<5;m++)c.fillRect(x0+14+m*68+(k*17)%23,y+7,26+(m*13+k*7)%22,4);c.fillStyle="rgba(0,0,0,0.2)";c.fillRect(x0,y+22,x1-x0,2);}
  ag_grain(c,0,0,W,H,1.0,29);};
/* the scope's picture, live: dark glass, range rings, a few lines of the map, clutter where the hills are, the sweep turning every
   four seconds with its afterglow, and the jet's blip with its trail, brightest just after the sweep passes it; o.u its way in */
const tm_rgb=c=>"rgb("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+")";
function tm_scope(ctx,t,o){o=o||{};const {x,y,r}=TM_SCOPE,a=o.a==null?1:o.a;if(a<=0)return;const ga=ctx.globalAlpha;ctx.save();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.globalAlpha=ga*a;
  let g=ctx.createRadialGradient(x-r*0.2,y-r*0.25,10,x,y,r);g.addColorStop(0,"#1D2D31");g.addColorStop(1,"#0D1518");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
  ctx.strokeStyle=rgba(TM.phos,0.15);ctx.lineWidth=1.6;for(let k=1;k<=4;k++){ctx.beginPath();ctx.arc(x,y,r*k/4.4,0,TAU);ctx.stroke();}
  ctx.lineWidth=1.4;for(const an of [-2.6,-1.9,-0.5,0.9,2.3]){ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.1,y+Math.sin(an)*r*0.1);ctx.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r);ctx.stroke();}
  const ang=(t/4)*TAU-Math.PI/2,sweep=ctx.createConicGradient(ang-0.9,x,y);sweep.addColorStop(0,rgba(TM.phos,0));sweep.addColorStop(0.9/TAU,rgba(TM.phos,0.22));
  sweep.addColorStop(0.9/TAU+0.002,rgba(TM.phos,0));sweep.addColorStop(1,rgba(TM.phos,0));ctx.fillStyle=sweep;ctx.fillRect(x-r,y-r,2*r,2*r);
  ctx.strokeStyle=rgba(TM.phos,0.55);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ang)*r,y+Math.sin(ang)*r);ctx.stroke();
  const lit=(px,py)=>{const b=Math.atan2(py-y,px-x),d=((ang-b)%TAU+TAU)%TAU;return 0.25+0.75*Math.exp(-d*1.1);};
  const R=ag_rnd(17);ctx.fillStyle=tm_rgb(TM.phos);for(let k=0;k<70;k++){const an=-2.9+R()*1.5,rk=r*(0.35+R()*0.55),px=x+Math.cos(an)*rk,py=y+Math.sin(an)*rk,sz=1.4+R()*1.6;
    ctx.globalAlpha=ga*a*0.35*lit(px,py);ctx.beginPath();ctx.arc(px,py,sz,0,TAU);ctx.fill();}
  // the jet: in from the north-west, towards the middle (the airport)
  const u=clamp(o.u||0,0,1),p=k=>[lerp(x-r*0.76,x-r*0.08,k),lerp(y-r*0.46,y-r*0.04,k)];
  for(let k=5;k>=0;k--){const q=p(Math.max(0,u-k*0.035)),b=lit(q[0],q[1]);ctx.globalAlpha=ga*a*(k?0.5-k*0.08:1)*b;ctx.beginPath();ctx.arc(q[0],q[1],k?3.4:6,0,TAU);ctx.fill();}
  ctx.restore();
  // the glass: a soft reflection of the room
  ctx.globalAlpha=ga*a;g=ctx.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,"rgba(255,255,255,0.08)");g.addColorStop(0.45,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.restore();}
/* someone in the dark room: drawn whole into a layer, darkened and cooled to the room, then lit by the scope from the right */
function tm_lit(ctx,draw,o){o=o||{};const cv=ctx.canvas,[bc,bx]=ag_buf("tmLit",cv.width,cv.height),m=ctx.getTransform();bx.setTransform(m);draw(bx);
  bx.setTransform(1,0,0,1,0,0);bx.globalCompositeOperation="source-atop";bx.fillStyle="rgba(24,30,38,0.5)";bx.fillRect(0,0,cv.width,cv.height);
  const lx=m.a*TM_SCOPE.x+m.e,ly=m.d*TM_SCOPE.y+m.f,R=m.a*1000,g=bx.createRadialGradient(lx,ly,0,lx,ly,R);
  g.addColorStop(0,rgba(TM.phos,0.36*(o.light==null?1:o.light)));g.addColorStop(1,rgba(TM.phos,0));bx.fillStyle=g;bx.fillRect(0,0,cv.width,cv.height);
  bx.globalCompositeOperation="source-over";ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(bc,0,0);ctx.restore();}

/* ---------------------------------------------------------------- the approach, side on, on chart paper
   Not to scale. Distance runs left to right, to the runway at Dulles; height runs up. The ground, the ridge and the runway are
   painted; the jet's path, the chart's stepped heights, the cloud and every word are drawn live. TM_PRO.y1800 is 1,800 feet. */
const TM_PRO={ridge:{x:860,w:122,top:612},y1800:660,start:[70,150],down:[250,560],chart:[[250,150],[410,500],[1060,500],[1150,660],[1380,660],[1600,0]]};
function tm_ground(x){const R=TM_PRO.ridge,d=(x-R.x)/R.w,e=Math.exp(-d*d);
  return 798-(798-R.top)*e-(1-e)*(16*(AG_NZ.fbm(x*0.004,3.3,3)-0.5)*2*(x<1450?1:0.25)+(x<560?22*Math.exp(-Math.pow((x-300)/150,2)):0));}
// where the path at 1,800 feet meets the ridge's near side
TM_PRO.impact=(()=>{let x=TM_PRO.ridge.x;while(x>TM_PRO.down[1]&&tm_ground(x)<TM_PRO.y1800)x-=0.5;return[x,TM_PRO.y1800];})();
TM_PRO.runway=[1560,1760,tm_ground(1660)];TM_PRO.chart[5][1]=TM_PRO.runway[2]-6;
AG_PLACES.tmProfile=c=>{const R=TM_PRO.ridge;
  let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,"#EAE5D9");g.addColorStop(1,"#F5F2EA");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.strokeStyle="rgba(110,98,80,0.1)";c.lineWidth=1;for(let x=40;x<W;x+=60){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=30;y<H;y+=60){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=4)c.lineTo(x,tm_ground(x));c.lineTo(W,H);c.closePath();
  g=c.createLinearGradient(0,R.top,0,H);g.addColorStop(0,"#CBBFA6");g.addColorStop(1,"#B8AB90");c.fillStyle=g;c.fill();
  // the woods on the ridge, side on: small soft crowns along the slope
  c.save();c.clip();const RW=ag_rnd(5);for(let k=0;k<260;k++){const x=R.x-R.w*2+RW()*R.w*4,y=tm_ground(x)+2+RW()*8,r=5+RW()*6;c.fillStyle=rgba([150,136,112],0.35+RW()*0.25);
    c.beginPath();c.ellipse(x,y,r,r*0.8,0,0,TAU);c.fill();}c.restore();
  c.strokeStyle="rgba(90,78,60,0.55)";c.lineWidth=2.5;c.beginPath();for(let x=0;x<=W;x+=4){const y=tm_ground(x);x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  // the runway at the right
  const rw=TM_PRO.runway;c.fillStyle="#57534D";c.fillRect(rw[0],rw[2]-5,rw[1]-rw[0],9);c.fillStyle="rgba(255,255,255,0.7)";for(let x=rw[0]+16;x<rw[1]-20;x+=34)c.fillRect(x,rw[2]-1,16,2);
  ag_grain(c,0,0,W,H,1.0,31);};
/* a path on the chart, drawn on from its start: pts [[x, y], ...], u 0 to 1 how much shows; o.dash, o.col, o.w, o.a; returns its tip */
function tm_proPath(ctx,pts,u,o){o=o||{};const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  const show=L[L.length-1]*clamp(u,0,1);let tip=pts[0],ang=0;if(u<=0)return{x:tip[0],y:tip[1],a:0};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(o.col||TM.ink,o.a==null?1:o.a);ctx.lineWidth=o.w||4;if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){const a0=pts[i-1],b=pts[i];ang=Math.atan2(b[1]-a0[1],b[0]-a0[0]);if(L[i]<=show){ctx.lineTo(b[0],b[1]);tip=b;continue;}
    const k=(show-L[i-1])/((L[i]-L[i-1])||1);tip=[lerp(a0[0],b[0],k),lerp(a0[1],b[1],k)];ctx.lineTo(tip[0],tip[1]);break;}
  ctx.stroke();ctx.restore();return{x:tip[0],y:tip[1],a:ang};}
/* the cloud over the ridge on the chart: a soft white band that hides it, thinning to a = 0 */
function tm_proCloud(ctx,t,a){if(a<=0)return;const ga=ctx.globalAlpha;ctx.save();const img=tm_puff();
  for(let i=0;i<16;i++){const x=440+i*62+Math.sin(t*0.3+i)*14,y=600+(hash(i,8)-0.5)*90,s=1.5+hash(i,9)*0.9;ctx.globalAlpha=ga*a*(0.75+0.25*hash(i,10));ctx.drawImage(img,x-160*s,y-90*s,320*s,180*s);}
  ctx.restore();}

/* ---------------------------------------------------------------- three crew rooms, side by side
   Three rooms, each an airline's own, cut through like a drawing of a building: each its own wall colour, a ceiling light, a cork
   notice board at the people's eye level, and a lino floor; the walls between them solid. TM_ROOMS[i].x is the room's left. */
const TM_ROOMS=[{x:20,w:600,wall:[210,203,188]},{x:660,w:600,wall:[196,202,192]},{x:1300,w:600,wall:[208,200,200]}];
const TM_BOARD={dx:300,y:452,w:260,h:212};
AG_PLACES.tmCrew=c=>{
  c.fillStyle="#5E5852";c.fillRect(0,0,W,H);
  TM_ROOMS.forEach((r,i)=>{const x=r.x,w=r.w;
    let g=c.createLinearGradient(0,40,0,840);g.addColorStop(0,rgba(ag_dk(r.wall,0.06),1));g.addColorStop(0.4,rgba(r.wall,1));g.addColorStop(1,rgba(ag_dk(r.wall,0.08),1));c.fillStyle=g;c.fillRect(x,40,w,800);
    // the ceiling light: a long fluorescent fitting, and its light down the wall
    g=c.createRadialGradient(x+w/2,60,10,x+w/2,200,560);g.addColorStop(0,"rgba(255,253,244,0.26)");g.addColorStop(1,"rgba(255,253,244,0)");c.fillStyle=g;c.fillRect(x,40,w,800);
    ag_soft(c,cc=>ag_rect(cc,x+150,44,w-300,18,6),[236,236,228],[255,255,250],x+w/2,48,200,null);
    // the lino floor and the skirting
    g=c.createLinearGradient(0,840,0,H);g.addColorStop(0,rgba(TM.lino,1));g.addColorStop(1,rgba(ag_dk(TM.lino,0.15),1));c.fillStyle=g;c.fillRect(x,840,w,H-840);
    c.fillStyle="rgba(0,0,0,0.12)";for(let y=880;y<H;y+=60)c.fillRect(x,y,w,1.2);
    c.fillStyle=rgba(ag_dk(r.wall,0.3),1);c.fillRect(x,826,w,14);
    // the notice board: cork in a wooden frame, a few old papers at its left
    const b=TM_BOARD,bx=x+b.dx;ag_soft(c,cc=>ag_rect(cc,bx-12,b.y-12,b.w+24,b.h+24,6),[132,100,70],[190,160,124],bx+b.w,b.y,200,"rgba(0,0,0,0.35)",8);
    ag_soft(c,cc=>ag_rect(cc,bx,b.y,b.w,b.h,3),TM.cork,ag_lt(TM.cork,0.25),bx+b.w*0.8,b.y+20,220,"rgba(60,40,20,0.35)",10);
    const RP=ag_rnd(60+i);for(let k=0;k<2;k++){const px=bx+16+k*44,py=b.y+18+RP()*30,pw=70,ph=92;c.save();c.translate(px+pw/2,py+ph/2);c.rotate((RP()-0.5)*0.12);
      c.fillStyle="rgb(232,226,206)";c.fillRect(-pw/2,-ph/2,pw,ph);c.fillStyle="rgba(80,74,66,0.35)";for(let m=0;m<5;m++)c.fillRect(-pw/2+10,-ph/2+16+m*14,pw-20-(m%2)*14,4);c.restore();}
    // each room's own things: a clock, a high window, a filing cabinet
    if(i===0){ag_soft(c,cc=>cc.arc(x+96,210,40,0,TAU),[236,234,228],[255,255,255],x+104,200,40,"rgba(0,0,0,0.25)",6);c.strokeStyle="rgba(40,40,44,0.8)";c.lineWidth=3;c.lineCap="round";
      c.beginPath();c.moveTo(x+96,210);c.lineTo(x+96,184);c.moveTo(x+96,210);c.lineTo(x+114,216);c.stroke();}
    if(i===1){g=c.createLinearGradient(0,150,0,300);g.addColorStop(0,"#B9C1C6");g.addColorStop(1,"#D3D7D8");c.fillStyle=g;c.fillRect(x+60,150,170,150);
      c.strokeStyle="rgba(90,86,80,0.8)";c.lineWidth=6;c.strokeRect(x+60,150,170,150);c.beginPath();c.moveTo(x+145,150);c.lineTo(x+145,300);c.stroke();}
    if(i===2){ag_soft(c,cc=>ag_rect(cc,x+w-120,560,104,266,6),[150,152,144],[200,202,194],x+w-40,570,160,"rgba(0,0,0,0.3)",10);
      for(let k=0;k<3;k++){c.fillStyle="rgba(0,0,0,0.18)";c.fillRect(x+w-112,644+k*88,88,2);c.fillStyle="rgba(230,230,224,0.8)";c.fillRect(x+w-80,600+k*88,24,7);}}});
  // the walls between the rooms, cut through, and the floor above
  for(const x of [0,620,1260,1900]){const w=x===0||x===1900?20:40;ag_soft(c,cc=>ag_rect(cc,x,0,w,H,0),[96,90,84],[130,124,116],x+w,200,300,null);}
  ag_soft(c,cc=>ag_rect(cc,0,0,W,40,0),[96,90,84],[130,124,116],1600,0,600,null);
  ag_grain(c,0,0,W,H,1.0,37);};
/* a notice pinned on room i's board, at its middle right: an airline's notice to its pilots (1974), or the reporting system's alert */
function tm_notice(ctx,i,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1),a=(o.a==null?1:o.a)*clamp(p*3,0,1);if(a<=0)return null;const r=TM_ROOMS[i],b=TM_BOARD,w=118,h=150,x=r.x+b.dx+b.w-w-26,y=b.y+28;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y);ctx.rotate(lerp(-0.12,-0.025,ag_eo(p)));const k=lerp(1.25,1,ag_eo(p));ctx.scale(k,k);ctx.translate(-w/2,0);
  ctx.save();ctx.shadowColor="rgba(40,30,20,0.3)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle="#F7F4EA";ctx.fillRect(0,0,w,h);ctx.restore();
  const al=o.kind==="alert";ctx.fillStyle=al?"rgba(70,76,86,0.9)":"rgba(80,74,66,0.75)";ctx.fillRect(0,0,w,al?26:14);
  if(al){ctx.strokeStyle="rgba(70,76,86,0.9)";ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(22,58);ctx.lineTo(34,38);ctx.lineTo(46,58);ctx.closePath();ctx.stroke();}
  ctx.fillStyle="rgba(70,66,60,0.45)";for(let m=0;m<6;m++)ctx.fillRect(al&&m<1?56:12,al?46+m*16:30+m*16,(m===0?w-64:w-24)-(m%3)*16,5);
  ag_soft(ctx,c=>c.arc(w/2,8,6,0,TAU),[70,74,82],[200,206,214],w/2+2,6,6,null);
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the reporting system's office, California, 1976
   Pale warm walls, a big window on the right with venetian blinds half up and low brown hills under a pale sky, two tall filing
   cabinets at the left, a shelf of binders, and a steel desk with a wood-grain top across the bottom of the frame. */
AG_PLACES.tmNasa=c=>{
  let g=c.createLinearGradient(0,0,0,780);g.addColorStop(0,"#DCD3C1");g.addColorStop(1,"#CFC4AF");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the window
  const wx=1360,wy=110,ww=480,wh=520;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#C9D6DE");g.addColorStop(1,"#E6E7E1");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle="#BFA987";c.beginPath();c.moveTo(wx,wy+wh-120);for(let x=0;x<=ww;x+=8)c.lineTo(wx+x,wy+wh-140-40*Math.sin(x/ww*2.4+0.6)-12*Math.sin(x/37));c.lineTo(wx+ww,wy+wh);c.lineTo(wx,wy+wh);c.closePath();c.fill();
  c.fillStyle="#8E9479";c.fillRect(wx,wy+wh-60,ww,60);for(let x=wx+10;x<wx+ww;x+=26){c.beginPath();c.ellipse(x,wy+wh-62,16,20,0,0,TAU);c.fill();}
  for(let k=0;k<16;k++){const y=wy+8+k*13;c.fillStyle="rgba(236,232,220,0.96)";c.fillRect(wx,y,ww,9);c.fillStyle="rgba(120,110,96,0.25)";c.fillRect(wx,y+9,ww,1.5);}
  c.strokeStyle="#B9AE9A";c.lineWidth=18;c.strokeRect(wx-9,wy-9,ww+18,wh+18);c.strokeStyle="#D9D2C4";c.lineWidth=8;c.beginPath();c.moveTo(wx+ww/2,wy);c.lineTo(wx+ww/2,wy+wh);c.stroke();
  // the window's light across the wall and the room
  g=c.createRadialGradient(wx+ww/2,wy+wh*0.6,40,wx,wy+wh*0.7,1300);g.addColorStop(0,"rgba(255,248,232,0.3)");g.addColorStop(1,"rgba(255,248,232,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.18)");g.addColorStop(0.4,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // two tall filing cabinets at the left
  for(const fx of [70,300]){ag_soft(c,cc=>ag_rect(cc,fx,250,220,560,8),[146,148,134],[196,198,184],fx+180,280,300,"rgba(0,0,0,0.3)",14);
    for(let k=0;k<4;k++){const y=270+k*134;c.fillStyle="rgba(0,0,0,0.16)";c.fillRect(fx+12,y+126,196,2);ag_soft(c,cc=>ag_rect(cc,fx+80,y+40,60,14,4),[214,214,206],[250,250,244],fx+120,y+40,30,null);
      c.fillStyle="rgba(250,248,240,0.75)";c.fillRect(fx+92,y+64,36,20);}}
  // a shelf of binders on the wall
  const R=ag_rnd(9),cols=[[150,96,76],[96,110,104],[176,150,104],[110,104,120],[160,140,120]];let bx=640;
  while(bx<1220){const bw=34+R()*16,bh=150+R()*30,cl=cols[Math.floor(R()*cols.length)];ag_soft(c,cc=>ag_rect(cc,bx,330-bh,bw,bh,4),cl,ag_lt(cl,0.3),bx+bw*0.7,330-bh,bh,"rgba(0,0,0,0.3)",6);
    c.fillStyle="rgba(240,236,224,0.8)";c.fillRect(bx+8,330-bh+24,bw-16,30);ag_soft(c,cc=>cc.arc(bx+bw/2,330-26,6,0,TAU),[60,58,56],[150,146,140],bx+bw/2,320,6,null);bx+=bw+4;}
  ag_soft(c,cc=>ag_rect(cc,620,330,620,18,4),[150,126,96],[200,178,146],1100,330,400,"rgba(0,0,0,0.3)",6);ag_floorShadow(c,930,352,320,10,0.2);
  tm_desk76(c);ag_grain(c,0,0,W,H,1.0,43);};
// the desk: its wood-grain top and steel front, across the frame from y 766
function tm_desk76(c){let g=c.createLinearGradient(0,766,0,802);g.addColorStop(0,"#B89A72");g.addColorStop(1,"#9C7E58");c.fillStyle=g;c.fillRect(0,766,W,36);
  c.fillStyle="rgba(255,240,214,0.35)";c.fillRect(0,766,W,2);g=c.createLinearGradient(0,802,0,H);g.addColorStop(0,"#8C8E86");g.addColorStop(1,"#6E706A");c.fillStyle=g;c.fillRect(0,802,W,H-802);
  c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(0,802,W,5);c.fillStyle="rgba(255,255,255,0.12)";for(const x of [620,1300])c.fillRect(x,812,2,H-812);}
/* a report form, 220 by 290, (x, y) its top left: a strip at the top for who sent it (their name and how to reach them), cut off
   along a dashed line and taken away, up and to the right (o.strip 0 to 1); under it what happened, in lines too small to read; o.a, o.rot */
function tm_form(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=220,h=290,sp=clamp(o.strip||0,0,1);ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(40,30,20,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle="#F6F3E9";ctx.fillRect(0,54,w,h-54);ctx.restore();
  ctx.fillStyle="rgba(70,66,60,0.42)";for(let m=0;m<11;m++)ctx.fillRect(16,76+m*18,w-32-(m%4)*22,5);
  ctx.fillStyle="rgba(70,66,60,0.6)";ctx.fillRect(16,64,90,6);
  // the ID strip: still on the form, then lifted off, up and away to the right
  if(sp<1){const e=ag_sine(sp),sx=lerp(0,280,e),sy=lerp(0,-170,e);ctx.save();ctx.globalAlpha*=1-clamp((sp-0.7)/0.3,0,1);ctx.translate(sx,sy);ctx.rotate(0.22*e);
    ctx.save();ctx.shadowColor="rgba(40,30,20,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle="#EFE6CF";ctx.fillRect(0,0,w,52);ctx.restore();
    ctx.fillStyle="rgba(70,66,60,0.6)";ctx.fillRect(16,16,96,6);ctx.fillRect(16,32,136,6);ctx.fillRect(w-62,16,46,6);ctx.restore();}
  ctx.strokeStyle="rgba(70,66,60,0.6)";ctx.lineWidth=2;ctx.setLineDash([7,6]);ctx.beginPath();ctx.moveTo(0,53);ctx.lineTo(w,53);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();}

/* ---------------------------------------------------------------- the people of 1974 and 1976
   Composites, dressed as photographs of the time show them: no real person's face. A headset is worn on the head, its earpiece on
   the near ear and its small microphone by the mouth, at the head's own turn; a pilot's epaulettes and cap carry no badge. */
function tm_headset(c,P){c.save();c.lineCap="round";
  c.strokeStyle="rgb(38,40,44)";c.lineWidth=8;c.beginPath();c.moveTo(338,296);c.bezierCurveTo(300,282,262,300,250,350);c.lineTo(250,404);c.stroke();
  c.strokeStyle="rgba(150,156,166,0.6)";c.lineWidth=2.5;c.beginPath();c.moveTo(332,292);c.bezierCurveTo(298,280,262,298,252,346);c.stroke();
  c.strokeStyle="rgb(44,46,50)";c.lineWidth=5;c.beginPath();c.moveTo(262,452);c.bezierCurveTo(286,486,316,496,338,494);c.stroke();
  ag_soft(c,cc=>cc.ellipse(342,494,9,7,0,0,TAU),[54,56,60],[120,124,130],344,490,8,null);
  ag_soft(c,cc=>cc.ellipse(252,430,22,30,0.08,0,TAU),[46,48,52],[120,126,134],258,416,26,"rgba(0,0,0,0.4)",6);c.restore();}
function tm_tie(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  ag_soft(c,cc=>{cc.moveTo(302,616);cc.lineTo(324,614);cc.lineTo(330,642);cc.lineTo(338,820);cc.lineTo(320,850);cc.lineTo(304,820);cc.lineTo(306,644);cc.closePath();},
    col,ag_lt(col,0.3),326,680,90,rgba(ag_dk(col,0.7),0.4),8);c.restore();};}
function tm_epaulettes(c,P){for(const [x,y,w,r] of [[150,604,74,-0.42],[396,622,56,0.36]]){c.save();c.translate(x,y);c.rotate(r);ag_soft(c,cc=>ag_rect(cc,-w/2,-11,w,22,5),[38,42,54],[90,96,110],0,-8,30,null);
  c.fillStyle="rgba(214,182,110,0.95)";for(let k=0;k<3;k++)c.fillRect(-w/2+10+k*(w-20)/3,-7,5,14);c.restore();}}
// a pilot's peaked cap, worn on the head, its peak over the brow; no badge
function tm_pilotCap(col){return(c,P)=>{const d=ag_dk(col,0.35);
  ag_soft(c,cc=>{cc.moveTo(204,352);cc.bezierCurveTo(198,314,212,278,250,266);cc.bezierCurveTo(300,252,364,258,394,284);cc.bezierCurveTo(406,300,406,330,398,352);cc.closePath();},
    col,ag_lt(col,0.3),352,282,120,rgba(ag_dk(col,0.7),0.4),12);
  ag_soft(c,cc=>{cc.moveTo(206,344);cc.lineTo(398,344);cc.lineTo(396,370);cc.lineTo(210,372);cc.closePath();},d,ag_lt(col,0.12),340,352,80,null);
  ag_soft(c,cc=>{cc.moveTo(350,364);cc.bezierCurveTo(382,360,418,364,440,378);cc.bezierCurveTo(424,388,382,388,350,378);cc.closePath();},[30,32,36],[96,100,108],404,370,40,null);};}
// a mechanic's soft cap
function tm_workCap(col){return(c,P)=>{ag_soft(c,cc=>{cc.moveTo(206,356);cc.bezierCurveTo(200,316,222,284,266,276);cc.bezierCurveTo(318,268,372,280,390,318);cc.bezierCurveTo(396,334,396,348,392,356);cc.closePath();},
    col,ag_lt(col,0.28),346,292,120,rgba(ag_dk(col,0.7),0.4),12);
  ag_soft(c,cc=>{cc.moveTo(360,350);cc.bezierCurveTo(392,346,424,352,438,366);cc.bezierCurveTo(420,376,388,374,360,364);cc.closePath();},ag_dk(col,0.2),ag_lt(col,0.2),400,356,40,null);};}
const TM_P={
  ctrl:{key:"tm_ctrl",name:"a controller, 1974",skin:[222,184,152],hair:{style:"side",c:[62,46,36]},glasses:[44,44,48],top:{kind:"shirt",c:[232,230,222],paint:tm_tie([92,72,62])},hat:{paint:tm_headset},breath:0.27},
  pilot:{key:"tm_pilot",name:"a pilot, 1974",skin:[214,174,140],hair:{style:"cropped",c:[132,128,124]},top:{kind:"shirt",c:[238,238,234],paint:(c,P)=>{tm_tie([40,44,56])(c,P);tm_epaulettes(c,P);}},hat:{paint:tm_pilotCap([44,48,62])},breath:0.26},
  pilot2:{key:"tm_pilot2",name:"a pilot of another airline, 1974",skin:[120,82,60],hair:{style:"cropped",c:[30,26,24]},top:{kind:"shirt",c:[236,236,232],paint:(c,P)=>{tm_tie([70,56,52])(c,P);tm_epaulettes(c,P);}},breath:0.28},
  ctrl76:{key:"tm_ctrl76",name:"a controller, 1976",skin:[236,200,170],hair:{style:"bob",c:[98,66,46]},earrings:[220,206,180],top:{kind:"shirt",c:[224,214,198]},hat:{paint:tm_headset},breath:0.3},
  mech:{key:"tm_mech",name:"a mechanic, 1976",skin:[176,124,92],hair:{style:"cropped",c:[26,22,22]},top:{kind:"overshirt",c:[148,136,108],inner:[210,204,190]},hat:{paint:tm_workCap([96,92,84])},breath:0.25},
  analyst:{key:"tm_analyst",name:"an analyst, 1976",skin:[206,168,138],hair:{style:"side",c:[96,78,60]},glasses:[60,56,52],top:{kind:"shirt",c:[230,230,222],paint:tm_tie([96,70,64])},breath:0.27}
};
