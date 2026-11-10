/* ===== Who did what: the university's places and the pieces its scenes share =====
   The university is the module's hall (hall.js), painted once for this film with its own pools of light: wdHall, and the same hall in
   the morning and late at night (wdHallMorning, wdHallNight), which are one room (AG_ROOMS), so the camera glides on between them and
   only what changes fades. Jun's home at night is a room of its own (wdHome). What is drawn on them:
     wd_platform   the platform: a tall block of clear glass with one lit door, its record a thin strip of glowing rows beneath it
     wd_store      the security team's store across the hall: a block of frosted glass, "To search" and a locked copy in it
     wd_rec        a row of the record: a time, a tool's mark, what was done, by whom (a cyan name)
     wd_bell       an alert: an amber bell drawn in light, which swings and rings when it's struck
     wd_steps      the five steps for a stolen session or a leaked secret
     wd_tool       a tool's mark, unaltered, with its full name beside it
     wd_name       a person's name and role on a small panel
     wd_clock      the time, on a slip
     wd_addon      a browser add-on, as its puzzle-piece mark, and its name
     wd_safe       a safe, its door opening, and what is in it
     wd_versions   a table's history: a row of versions, one a day, fading past the seventh
     wd_tbl        a table, as a small block of rows with its name
   Every word is at least 28 px and stands out at least 4.5 to 1 from what is behind it: words go on glass (dp_panel) or on solid colour. */

/* ---------------------------------------------------------------- the places */
const WD_HALL={seed:9,horizon:690,vx:1000,lights:16,panes:8,pools:[[330,1000,560,0.13],[1000,820,760,0.06],[1560,860,560,0.08]],haze:0.08};
AG_PLACES.wdHall=c=>dp_paintHall(c,WD_HALL);
// the morning: the same hall, a pale warm light coming in high on the right
AG_PLACES.wdHallMorning=c=>dp_paintHall(c,Object.assign({},WD_HALL,{after:cc=>{cc.save();cc.globalCompositeOperation="lighter";
  const g=cc.createRadialGradient(1700,80,0,1700,80,1500);g.addColorStop(0,"rgba(255,226,186,0.11)");g.addColorStop(0.5,"rgba(255,226,186,0.04)");g.addColorStop(1,"rgba(255,226,186,0)");cc.fillStyle=g;cc.fillRect(0,0,W,H);cc.restore();}}));
// late at night: the same hall, darker, its far lights lower
AG_PLACES.wdHallNight=c=>dp_paintHall(c,Object.assign({},WD_HALL,{after:cc=>{cc.fillStyle="rgba(2,8,11,0.34)";cc.fillRect(0,0,W,H);}}));
AG_ROOMS.wdHallMorning="wdHall";AG_ROOMS.wdHallNight="wdHall";
// Jun's home at night: a wall, a window of the city's lights, a table, and a lamp's warm pool on it (the lamp, the laptop and Jun are
// drawn live)
AG_PLACES.wdHome=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(16,26,30)");g.addColorStop(1,"rgb(24,30,32)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the window, the city at night
  c.save();c.beginPath();c.rect(1180,130,560,430);c.clip();const sg=c.createLinearGradient(0,130,0,560);sg.addColorStop(0,"rgb(8,20,28)");sg.addColorStop(1,"rgb(26,40,50)");c.fillStyle=sg;c.fillRect(1180,130,560,430);
  const R=ag_rnd(29);for(let i=0;i<9;i++){const bx=1180+i*66+R()*20,bh=90+R()*190,bw=40+R()*36;c.fillStyle="rgb(12,22,28)";c.fillRect(bx,560-bh,bw,bh);
    for(let k=0;k<18;k++){if(R()<0.55)continue;const wx=bx+4+(k%3)*12,wy=560-bh+8+Math.floor(k/3)*16;if(wy>552)continue;c.fillStyle=rgba(R()<0.8?[255,206,150]:[200,230,240],0.35+R()*0.4);c.fillRect(wx,wy,6,8);}}
  c.restore();c.fillStyle="rgb(30,38,40)";for(const [x,y,w,h] of [[1170,120,580,12],[1170,560,580,14],[1170,120,12,452],[1738,120,12,452],[1456,130,8,430]])c.fillRect(x,y,w,h);
  // the table, its top lit by the lamp
  g=c.createLinearGradient(0,700,0,750);g.addColorStop(0,"rgb(92,70,52)");g.addColorStop(1,"rgb(64,48,36)");c.fillStyle=g;c.beginPath();c.moveTo(560,700);c.lineTo(1720,700);c.lineTo(1840,760);c.lineTo(440,760);c.closePath();c.fill();
  c.fillStyle="rgb(36,26,20)";c.fillRect(440,760,1400,320);
  c.save();c.globalCompositeOperation="lighter";const lg=c.createRadialGradient(980,600,0,980,600,760);lg.addColorStop(0,"rgba(255,206,150,0.22)");lg.addColorStop(0.5,"rgba(255,206,150,0.07)");lg.addColorStop(1,"rgba(255,206,150,0)");
  c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore();wd_vignette(c,980,600,380,1200,0.55);};

/* ---------------------------------------------------------------- words on glass */
// a tool's mark (its logo, unaltered), h high, with its full name beside it, the words' baseline at y; returns the width
function wd_tool(ctx,x,y,key,name,o){o=o||{};const h=o.h||36,a=o.a==null?1:o.a,im=typeof LOGO!=="undefined"&&LOGO[key];let w=0;if(a<=0)return 0;ctx.save();ctx.globalAlpha*=a;
  if(im&&im.width){w=h*im.width/im.height;ctx.drawImage(im,x,y-h+8,w,h);w+=16;}
  dp_T(ctx,name,x+w,y,{w:700,size:o.size||30,col:o.col});ctx.restore();return w+dp_tw(ctx,name,{w:700,size:o.size||30});}
// a person's name and what they do, on a small panel centred at cx
function wd_name(ctx,cx,y,name,role,a){if(a<=0)return;const w=Math.max(dp_tw(ctx,name,{w:700,size:30}),dp_tw(ctx,role,{w:600,size:28}))+60;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,cx-w/2,y,w,100,{col:"cyan",r:18,glowR:26});dp_T(ctx,name,cx,y+43,{w:700,size:30,align:"center"});dp_T(ctx,role,cx,y+80,{w:600,size:28,align:"center",col:"mut"});ctx.restore();}
// the corner tag of the opening: where and when; in the view's top left whatever the camera does (cam from the shot)
function wd_corner(ctx,cam,text,a){if(a<=0)return;const z=cam?cam.z:1,vx=cam?cam.x-960/z:0,vy=cam?cam.y-540/z:0,T_=text.toUpperCase(),w=dp_tw(ctx,T_,{w:700,size:28,ls:4})+56;
  ctx.save();ctx.translate(vx,vy);ctx.scale(1/z,1/z);ctx.globalAlpha*=a;dp_panel(ctx,72,60,w,62,{col:"cyan",r:31,glowR:24});dp_T(ctx,T_,100,101,{w:700,size:28,ls:4,col:"cyan"});ctx.restore();}
// the time, on a slip with a small clock face
function wd_clock(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=dp_tw(ctx,text,{w:700,size:34})+110,col=o.col||"cyan";ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,74,{col,r:20,glowR:26});const cx=x+44,cy=y+37,c=dp_f(col);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(cx,cy,17,0,TAU);ctx.stroke();
  const hh=o.h==null?9.67:o.h;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(hh/12*TAU)*9,cy-Math.cos(hh/12*TAU)*9);ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin((hh%1)*TAU)*13,cy-Math.cos((hh%1)*TAU)*13);ctx.stroke();
  dp_T(ctx,text,x+80,y+50,{w:700,size:34});ctx.restore();return w;}

/* ---------------------------------------------------------------- the platform
   (x, y) its foot's middle; a tall block of clear glass, w wide and h tall, seen a little from the side: its front, its right side and its
   top, light along its edges; one door in its front, lit (o.door 0 to 1: how much light; o.shut: the door's outer pane closes, coral);
   beneath it the record, a thin strip of rows of light on the floor that runs on (o.rec 0 to 1, t its time). o.a its opacity. */
function wd_platform(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const x0=x-w/2,y0=y-h,dx=w*0.16,dy=-w*0.08,ice=DP.ice,c=DP.F.cyan;
  // its gloss on the floor
  const fg=ctx.createLinearGradient(0,y,0,y+h*0.32);fg.addColorStop(0,rgba(c,0.10));fg.addColorStop(1,rgba(c,0));ctx.fillStyle=fg;ctx.fillRect(x0,y,w+dx,h*0.32);
  // the side and the top, a little brighter than the front
  ctx.save();ctx.beginPath();ctx.moveTo(x0+w,y0);ctx.lineTo(x0+w+dx,y0+dy);ctx.lineTo(x0+w+dx,y+dy);ctx.lineTo(x0+w,y);ctx.closePath();ctx.clip();dp_behind(ctx,o.behind);
  ctx.fillStyle="rgba(150,220,225,0.10)";ctx.fillRect(x0+w,y0+dy,dx,h-dy);ctx.restore();
  ctx.fillStyle="rgba(190,245,245,0.14)";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+dx,y0+dy);ctx.lineTo(x0+w+dx,y0+dy);ctx.lineTo(x0+w,y0);ctx.closePath();ctx.fill();
  // the front: clear glass, a sheen across it
  const sg=ctx.createLinearGradient(x0,y0,x0+w,y);sg.addColorStop(0,"rgba(200,245,245,0.12)");sg.addColorStop(0.35,"rgba(200,245,245,0.03)");sg.addColorStop(0.55,"rgba(200,245,245,0.09)");sg.addColorStop(1,"rgba(200,245,245,0.02)");
  ctx.fillStyle=sg;ctx.fillRect(x0,y0,w,h);
  // its floors inside, faint
  ctx.fillStyle="rgba(190,245,245,0.06)";for(let i=1;i<6;i++)ctx.fillRect(x0+4,y0+h*i/6,w-8,1.4);
  // the edges, in light
  ctx.save();ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=14;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.45),0.95);ctx.lineWidth=2.2;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0,y0);ctx.lineTo(x0+w,y0);ctx.lineTo(x0+w,y);ctx.moveTo(x0,y0);ctx.lineTo(x0+dx,y0+dy);ctx.lineTo(x0+w+dx,y0+dy);ctx.lineTo(x0+w,y0);
  ctx.moveTo(x0+w+dx,y0+dy);ctx.lineTo(x0+w+dx,y+dy);ctx.lineTo(x0+w,y);ctx.stroke();ctx.restore();
  // the door: a tall narrow light in the front
  const dw=w*0.2,dh=h*0.26,dxx=x-dw/2,dyy=y-dh,dl=o.door==null?1:o.door;
  ctx.save();const dg=ctx.createLinearGradient(0,dyy,0,y);dg.addColorStop(0,rgba(mix(c,[255,255,255],0.6),0.55*dl));dg.addColorStop(1,rgba(c,0.25*dl));ctx.fillStyle=dg;ctx.fillRect(dxx,dyy,dw,dh);
  ctx.shadowColor=rgba(c,1);ctx.shadowBlur=18;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.5),0.9);ctx.lineWidth=2;ctx.strokeRect(dxx,dyy,dw,dh);ctx.restore();
  dp_halo(ctx,x,y-dh*0.4,dh,"cyan",0.10*dl);
  if(o.shut>0){const s=ag_sine(o.shut),cc=DP.F.coral;ctx.save();ctx.fillStyle=rgba(cc,0.22*s);ctx.fillRect(dxx,dyy+dh*(1-s),dw,dh*s);ctx.shadowColor=rgba(cc,0.9);ctx.shadowBlur=12;ctx.strokeStyle=rgba(mix(cc,[255,255,255],0.3),s);ctx.lineWidth=3;ctx.strokeRect(dxx,dyy,dw,dh);ctx.restore();}
  // the record beneath it: a band of glass at its foot, rows of light running along it
  const rec=o.rec==null?1:o.rec;if(rec>0){const ry=y+22,rw=w+dx,t=o.t||0;ctx.save();ctx.globalAlpha*=rec;
    dp_panel(ctx,x0-10,ry-6,rw+20,60,{col:"cyan",r:14,glowR:24,behind:o.behind});
    ctx.beginPath();ctx.rect(x0,ry,rw,48);ctx.clip();
    for(let k=0;k<3;k++){const yy=ry+9+k*14;for(let i=-1;i<14;i++){const u=(((i*97+k*41)%60+60)%60)/60,xx=x0+((i*rw/12+t*30*(1+k*0.3))%(rw+60)+rw+60)%(rw+60)-30,ln=26+u*40;
      ctx.fillStyle=rgba(mix(c,[255,255,255],0.5),0.9-k*0.18);rr(ctx,xx,yy,ln,6,3);ctx.fill();}}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the store
   The security team's store, apart from the platform: a block of frosted glass (x, y, w, h), its name on a cyan band (o.title), and in
   it what the scene puts there (o.draw(ctx, box)). o.lock (0 to 1) shows its locked copy at the foot: a lock and "Locked copy · 1 year";
   o.rim (0 to 1) lights its side that faces the platform in coral, with "No change · no delete". */
function wd_store(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:26,glowR:50,behind:o.behind});dp_band(ctx,x,y,w,62,26,"cyan",o.title==null?"Security team's store":o.title);
  const box={x:x+30,y:y+92,w:w-60,h:h-122};if(o.draw)o.draw(ctx,box);
  if(o.lock>0){const la=ag_in(o.lock,0,0.6),ly=y+h-118;ctx.save();ctx.globalAlpha*=la;dp_panel(ctx,x+30,ly,w-60,88,{col:"violet2",r:18,glowR:20,behind:o.behind});
    dp_lock(ctx,x+80,ly+48,46,"cyan",0);dp_T(ctx,"Locked copy · 1 year",x+124,ly+56,{w:700,size:30});ctx.restore();}
  if(o.rim>0){const r=ag_sine(o.rim),cc=DP.F.coral;ctx.save();ctx.shadowColor=rgba(cc,1);ctx.shadowBlur=18;ctx.fillStyle=rgba(mix(cc,[255,255,255],0.25),1);ctx.fillRect(x-3,y+30,5,(h-60)*r);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the record's rows
   wd_rec(ctx, x, y, w, {time, tool, what, who, col, a, k, mono}): one row on a strip of glass, 64 tall: the time (mono), a tool's mark,
   what was done, and by whom on a cyan pill (an identity); col tints the strip (amber for power switched on). */
function wd_rec(ctx,x,y,w,r,o){o=o||{};const a=(o.a==null?1:o.a)*(r.a==null?1:r.a);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y+32,lerp(0.94,1,o.k));
  dp_panel(ctx,x,y,w,64,{col:r.col||"cyan",r:14,glowR:18,glowA:0.6,behind:o.behind});let xx=x+22;
  if(r.time){dp_T(ctx,r.time,xx,y+42,{w:500,size:28,f:"mono",col:"mut"});xx+=dp_tw(ctx,r.time,{w:500,size:28,f:"mono"})+22;}
  const im=r.tool&&typeof LOGO!=="undefined"&&LOGO[r.tool];if(im&&im.width){const h=30,lw=h*im.width/im.height;ctx.drawImage(im,xx,y+17,lw,h);xx+=lw+16;}
  if(r.what){dp_T(ctx,r.what,xx,y+42,{w:r.mono?500:600,size:28,f:r.mono?"mono":undefined,col:r.whatCol});xx+=dp_tw(ctx,r.what,{w:r.mono?500:600,size:28,f:r.mono?"mono":undefined})+20;}
  if(r.who)dp_pill(ctx,r.whoX!=null?x+r.whoX:xx,y+44,r.who,r.whoCol||"cyan",{size:28,glow:8});
  if(r.tick)dp_tick(ctx,x+w-40,y+32,r.tick,r.p);if(r.cross)dp_cross(ctx,x+w-40,y+32,r.cross,r.p);
  ctx.restore();}

/* ---------------------------------------------------------------- the bells
   wd_bell(ctx, x, y, r, t, o): an alert, an amber bell drawn in light, its top at (x, y), r its size (about 60); o.ring the time it's
   struck (it swings and settles, its glow rising), o.col its colour (amber), o.label under it and o.who under that (who answers it). */
function wd_bell(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f(o.col||"amber");ctx.save();ctx.globalAlpha*=a;
  const since=o.ring!=null?t-o.ring:-1,sw=since>=0?0.32*Math.exp(-2.2*since)*Math.sin(since*11):0,lit=since>=0?Math.exp(-1.1*since):0;
  dp_halo(ctx,x,y+r*0.8,r*2.6,o.col||"amber",0.10+0.22*lit);
  ctx.save();ctx.translate(x,y);ctx.rotate(sw);
  const body=cc=>{cc.beginPath();cc.moveTo(-r*0.16,r*0.12);cc.bezierCurveTo(-r*0.58,r*0.14,-r*0.6,r*0.62,-r*0.66,r*1.0);cc.bezierCurveTo(-r*0.7,r*1.12,-r*0.86,r*1.16,-r*0.86,r*1.26);
    cc.lineTo(r*0.86,r*1.26);cc.bezierCurveTo(r*0.86,r*1.16,r*0.7,r*1.12,r*0.66,r*1.0);cc.bezierCurveTo(r*0.6,r*0.62,r*0.58,r*0.14,r*0.16,r*0.12);cc.closePath();};
  body(ctx);const g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,rgba(mix(c,[40,20,0],0.5),0.55+0.3*lit));g.addColorStop(0.4,rgba(c,0.6+0.35*lit));g.addColorStop(1,rgba(mix(c,[40,20,0],0.55),0.5+0.3*lit));ctx.fillStyle=g;ctx.fill();
  ctx.shadowColor=rgba(c,1);ctx.shadowBlur=12+16*lit;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.45),1);ctx.lineWidth=2.4;body(ctx);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(0,r*0.06,r*0.12,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(-sw*r*0.9,r*1.36,r*0.13,0,TAU);ctx.fill();
  ctx.restore();
  // rings of sound when it's struck: two soft arcs either side
  if(since>=0&&since<1.6){for(const k of [0,0.35]){const u=clamp((since-k)/1.0,0,1);if(u<=0||u>=1)continue;ctx.strokeStyle=rgba(c,0.8*(1-u));ctx.lineWidth=2.4;
      for(const s of [-1,1]){ctx.beginPath();ctx.arc(x,y+r*0.7,r*(1.1+u*0.9),s<0?Math.PI*0.82:-Math.PI*0.18,s<0?Math.PI*1.18:Math.PI*0.18);ctx.stroke();}}}
  if(o.label)dp_T(ctx,o.label,x,y+r*1.36+58,{w:700,size:30,align:"center"});if(o.who)dp_T(ctx,o.who,x,y+r*1.36+98,{w:600,size:28,align:"center",col:"mut"});
  ctx.restore();}

/* ---------------------------------------------------------------- the five steps
   For a stolen session or a leaked secret, in this order: end it, see what it did, close the way in, put back what changed, learn.
   wd_steps(ctx, x, y, w, st, o): a column of slips (each 70 tall, 84 apart), st[i] each step's state: 0 waiting, 0 to 1 lighting, 1 lit
   (being done), 2 done (a tick), or {done: u, text} to change its words (u ticks it). */
const WD_STEPS=["End it","See what it did","Close the way in","Put back what changed","Learn"];
function wd_steps(ctx,x,y,w,st,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  WD_STEPS.forEach((s0,i)=>{const v=st[i]||0,obj=typeof v==="object"?v:null,lit=obj?1:Math.min(1,v),done=obj?obj.done:(v>1?Math.min(1,v-1):0),text=obj&&obj.text||s0,yy=y+i*84;
    ctx.save();ctx.globalAlpha*=0.55+0.45*lit;dp_panel(ctx,x,yy,w,70,{col:done>0?"green":lit>0?"cyan":"grey",r:16,glowR:lit>0?28:10,glowA:0.4+0.6*lit,behind:o.behind});ctx.restore();
    // its number: on a disc of solid colour once it's lit (dark), in a grey ring until then (light)
    const nc=done>0.5?"green":"cyan";ctx.save();ctx.fillStyle=rgba(dp_f(nc),lit);ctx.beginPath();ctx.arc(x+40,yy+35,19,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(dp_f("grey"),0.8*(1-lit));ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+40,yy+35,18,0,TAU);ctx.stroke();ctx.restore();
    if(lit<1)dp_T(ctx,String(i+1),x+40,yy+45,{w:800,size:28,align:"center",col:"mut",a:1-lit});if(lit>0)dp_T(ctx,String(i+1),x+40,yy+45,{w:800,size:28,align:"center",col:DP.on,a:lit});dp_T(ctx,text,x+76,yy+45,{w:700,size:30,col:lit>0?"ink":"mut"});
    if(done>0)dp_tick(ctx,x+w-40,yy+35,"green",done);});
  ctx.restore();}

/* ---------------------------------------------------------------- an add-on, a safe, a table and its history */
// a browser add-on's mark: a puzzle piece drawn in light, s its size (about 1), col its colour; its name under it (o.name)
function wd_addon(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f(o.col||"grey");ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const p=cc=>{cc.beginPath();cc.moveTo(-50,-50);cc.lineTo(-12,-50);cc.bezierCurveTo(-16,-64,-12,-80,0,-80);cc.bezierCurveTo(12,-80,16,-64,12,-50);cc.lineTo(50,-50);cc.lineTo(50,-12);
    cc.bezierCurveTo(64,-16,80,-12,80,0);cc.bezierCurveTo(80,12,64,16,50,12);cc.lineTo(50,50);cc.lineTo(-50,50);cc.closePath();};
  p(ctx);ctx.fillStyle=rgba(mix(c,[6,20,26],0.7),0.95);ctx.fill();ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=3;p(ctx);ctx.stroke();ctx.restore();
  if(o.name)dp_T(ctx,o.name,x,y+s*50+48,{w:700,size:30,align:"center"});}
// a safe: a heavy box (x, y its top left, s its size: 1 is 260 x 280), its door opening (open 0 to 1) to show what's in it (o.inside(ctx))
function wd_safe(ctx,x,y,s,open,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=30;ctx.shadowOffsetY=14;const g=ctx.createLinearGradient(0,0,260,280);g.addColorStop(0,"rgb(70,86,92)");g.addColorStop(1,"rgb(30,40,44)");
  ctx.fillStyle=g;rr(ctx,0,0,260,280,14);ctx.fill();ctx.restore();ctx.strokeStyle="rgba(190,245,245,0.35)";ctx.lineWidth=2;rr(ctx,1,1,258,278,14);ctx.stroke();
  ctx.fillStyle="rgb(10,22,26)";rr(ctx,20,20,220,240,8);ctx.fill();
  if(open>0&&o.inside){ctx.save();rr(ctx,20,20,220,240,8);ctx.clip();o.inside(ctx);ctx.restore();}
  // the door, swinging open on its left hinge (drawn narrowing as it turns towards us)
  const u=ag_sine(open),dw=220*Math.cos(u*Math.PI*0.48);if(dw>2){const dg=ctx.createLinearGradient(20,0,20+dw,0);dg.addColorStop(0,"rgb(84,100,106)");dg.addColorStop(1,"rgb(46,58,62)");
    ctx.fillStyle=dg;rr(ctx,20-u*14,20,dw,240,8);ctx.fill();ctx.strokeStyle="rgba(190,245,245,0.3)";ctx.lineWidth=1.6;rr(ctx,20-u*14,20,dw,240,8);ctx.stroke();
    if(u<0.6){const cx=20-u*14+dw*0.62,cy=140;ctx.strokeStyle="rgba(214,236,236,0.6)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,30*(dw/220),0,TAU);ctx.stroke();
      for(let k=0;k<3;k++){const an=k*TAU/3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(an)*42*(dw/220),cy+Math.sin(an)*42);ctx.stroke();}}}
  ctx.restore();}
// a table: a small block of rows of light with its name over it (mono, as the platform writes it); o.empty (0 to 1) empties its rows
function wd_tbl(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const h=o.h||190,col=o.col||"cyan";
  dp_panel(ctx,x,y,w,h,{col,r:16,glowR:24,behind:o.behind});dp_T(ctx,name,x+24,y+46,{w:500,size:30,f:"mono"});
  const rows=o.rows||4,e=o.empty||0;for(let i=0;i<rows;i++){const ra=1-clamp(e*rows-(rows-1-i),0,1);if(ra<=0)continue;ctx.fillStyle=rgba(DP.T.mut,0.5*ra);
    for(let k=0;k<3;k++)ctx.fillRect(x+24+k*(w-48)/3,y+80+i*26,(w-48)/3-16,8);}
  ctx.restore();}
// a table's history: n versions, one a day, as small squares along a line from (x, y), gap apart; those past day `keep` fade (o.keep),
// o.mark the version marked (index), o.markCol its colour
function wd_versions(ctx,x,y,n,gap,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const keep=o.keep==null?n:o.keep,c=DP.F.cyan,p=o.p==null?1:o.p;
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(x,y-1,gap*(n-1)*p,2);
  for(let i=0;i<n;i++){const u=clamp(p*n-i,0,1);if(u<=0)continue;const fade=i<keep?1:Math.max(0.12,1-(i-keep+1)*0.3),xx=x+i*gap;ctx.save();ctx.globalAlpha*=u*fade;
    const mc=o.mark===i?dp_f(o.markCol||"green"):c;ctx.shadowColor=rgba(mc,0.8);ctx.shadowBlur=10;ctx.fillStyle=rgba(mix(mc,[6,20,26],o.mark===i?0:0.35),1);rr(ctx,xx-14,y-14,28,28,6);ctx.fill();ctx.restore();}
  ctx.restore();}
