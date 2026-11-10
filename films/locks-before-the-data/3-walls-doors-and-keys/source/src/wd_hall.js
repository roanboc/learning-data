/* ===== Walls, doors and keys: the hall =====
   The university's scenes, in the module's hall of frosted panes. The platform is a tall block of clear glass in the middle of the
   hall (WD_BK); what this film gives it is drawn live, over the hall, in the hall's own coordinates, so the camera can glide over it:
     the room or rooms at the top (WD_RM), with the five areas' panes at the back (Registrar, Learning, Planning, HR, Finance),
     the catalog's band under them, a ring round the way down to the files (WD_CT),
     a narrow side door beside it, the back door straight to the files (WD_SD),
     storage at the foot (WD_SG), where the files are, and at first the copies,
     the front door on the left wall (WD_DOOR), facing the open internet, a dark plain beyond the hall's glass on the left, and later a
     door on the right wall (WD_DOOR2), where the corridor from the university's network comes in.
   Round it: the cloud provider's case at the top left, where the key is kept at first; the university's own vault at the top right;
   the corridor on the right; the copies' place apart, far off, at the bottom right. Sam stands at the bottom left.
   Places: wdHall (the hall, with the plain), wdBoard (the corner of the hall where Sam writes who secures what), wdMap (the
   university's map on a pane of its own). Every name starts with wd_ or WD_. */

const WD_BK={x:470,y:110,w:930,h:750};      // the block: 470 to 1400 across, 110 to 860 down
const WD_RM={x:490,y:132,w:890,h:348};      // the room (or rooms), 490 to 1380, 132 to 480
const WD_CT={x:950,y:534,rx:96,ry:22};      // the ring round the way down, in the catalog's band (492 to 576); the way down is 904 to 996
const WD_SD={x:1112,w:40,y:480,h:118};      // the side door: the back door to the files, past the catalog
const WD_SG={x:490,y:598,w:890,h:244};      // storage, 490 to 1380, 598 to 842
const WD_DOOR={x:470,y:330,h:120},WD_DOOR2={x:1400,y:330,h:120};
const WD_PROV={x:30,y:36,w:420,h:210},WD_VAULT={x:1470,y:40,w:420,h:252};   // the cloud provider's case; the university's vault
const WD_COR={y:342,h:96};                  // the corridor from the university's network, 1400 to the frame's right edge
const WD_APART={x:1548,y:520,w:300,h:230};  // the copies' place apart, far off
const WD_PLAIN={x:24,y:296,w:420,h:584};    // the open internet, beyond the hall's glass

/* ---------------------------------------------------------------- the places */
// the open internet: a dark plain seen through the hall's glass on the left, under a night sky, scattered with faint lights that
// could be anyone, anywhere; a frame of glass round it
function wd_paintPlain(c){const P=WD_PLAIN,R=ag_rnd(2026),hz=P.y+150;c.save();rr(c,P.x,P.y,P.w,P.h,18);c.clip();
  let g=c.createLinearGradient(0,P.y,0,hz);g.addColorStop(0,"rgb(3,9,12)");g.addColorStop(1,"rgb(10,24,30)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,hz-P.y);
  g=c.createLinearGradient(0,hz,0,P.y+P.h);g.addColorStop(0,"rgb(9,20,24)");g.addColorStop(1,"rgb(3,8,10)");c.fillStyle=g;c.fillRect(P.x,hz,P.w,P.y+P.h-hz);
  c.save();c.globalCompositeOperation="lighter";wd_glow(c,P.x+P.w*0.55,hz,260,[80,140,150],0.10);c.restore();
  for(let i=0;i<40;i++){const x=P.x+R()*P.w,y=P.y+R()*(hz-P.y-10),r=0.5+R()*1.1;c.fillStyle=rgba([200,235,235],0.08+R()*0.2);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // the lights on the plain: many, small and faint near the horizon, fewer and larger towards us; a few warm, most cool
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<260;i++){const d=Math.pow(R(),1.7),y=hz+4+d*(P.y+P.h-hz-12),x=P.x+R()*P.w,r=0.6+d*2.6,
      col=R()<0.2?[255,214,160]:[170,225,232],a=(0.10+R()*0.32)*(0.55+0.45*(1-d));
    c.fillStyle=rgba(col,a);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();if(d>0.35&&R()<0.5)wd_glow(c,x,y,r*7,col,a*0.18);}c.restore();
  c.strokeStyle="rgba(150,210,215,0.10)";c.lineWidth=1.2;c.beginPath();c.moveTo(P.x,hz);c.lineTo(P.x+P.w,hz);c.stroke();c.restore();
  // the hall's glass in front of it: a sheen and an edge of light
  c.save();rr(c,P.x,P.y,P.w,P.h,18);c.clip();const sg=c.createLinearGradient(P.x,P.y,P.x+P.w,P.y+P.h);sg.addColorStop(0,"rgba(200,245,245,0.06)");sg.addColorStop(0.4,"rgba(200,245,245,0)");
  sg.addColorStop(0.55,"rgba(200,245,245,0.04)");sg.addColorStop(1,"rgba(200,245,245,0)");c.fillStyle=sg;c.fillRect(P.x,P.y,P.w,P.h);c.restore();
  c.save();c.shadowColor="rgba(104,216,230,0.6)";c.shadowBlur=10;c.strokeStyle="rgba(190,245,245,0.42)";c.lineWidth=1.6;rr(c,P.x+0.8,P.y+0.8,P.w-1.6,P.h-1.6,18);c.stroke();c.restore();}
AG_PLACES.wdHall=c=>dp_paintHall(c,{seed:23,horizon:700,vx:930,panes:6,lights:14,haze:0.08,pools:[[930,930,700,0.10],[250,1000,330,0.09],[1700,990,380,0.07]],after:wd_paintPlain});
// the corner of the hall where Sam writes who secures what: the same hall, nearer a wall of glass, a board standing in it (drawn live)
AG_PLACES.wdBoard=c=>dp_paintHall(c,{seed:61,horizon:720,vx:760,panes:7,lights:16,haze:0.09,pools:[[820,960,640,0.10],[1560,990,420,0.10]]});
// the university's map, on a pane of its own (its areas and their owners drawn live)
AG_PLACES.wdMap=c=>dp_paintHall(c,{seed:5,horizon:760,vx:960,panes:5,lights:12,haze:0.07,pools:[[960,980,760,0.08]]});

/* ---------------------------------------------------------------- glass */
// a box of clear glass: a faint tint, a soft sheen across it, edges of light, brightest along the top; o.col its rim's colour (cyan),
// o.frost (0 to 1) frosts it, so the hall behind it blurs; o.edge the rim's strength; o.r its corners
function wd_glass(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const col=dp_f(o.col||"cyan"),r=o.r==null?10:o.r,fr=clamp(o.frost||0,0,1),ed=o.edge==null?1:o.edge;
  c.save();c.globalAlpha*=a;c.save();rr(c,x,y,w,h,r);c.clip();
  if(fr>0){c.save();c.globalAlpha*=fr;dp_behind(c,o.behind);c.fillStyle="rgba(6,20,26,0.30)";c.fillRect(x,y,w,h);c.restore();}
  const g=c.createLinearGradient(x,y,x+w*0.5,y+h);g.addColorStop(0,rgba(mix(col,[200,245,245],0.6),0.08+0.08*fr));g.addColorStop(1,rgba(mix(col,[200,245,245],0.6),0.025+0.05*fr));c.fillStyle=g;c.fillRect(x,y,w,h);
  if(o.sheen!==false){const s=c.createLinearGradient(x,y,x+w,y+h);s.addColorStop(0,"rgba(220,250,250,0)");s.addColorStop(0.3,"rgba(220,250,250,0.045)");s.addColorStop(0.36,"rgba(220,250,250,0)");
    s.addColorStop(0.62,"rgba(220,250,250,0)");s.addColorStop(0.7,"rgba(220,250,250,0.03)");s.addColorStop(0.74,"rgba(220,250,250,0)");c.fillStyle=s;c.fillRect(x,y,w,h);}
  c.restore();
  c.save();c.shadowColor=rgba(col,0.75*ed);c.shadowBlur=o.blur||12;c.strokeStyle=rgba(mix(col,[255,255,255],0.4),0.75*ed);c.lineWidth=o.lw||2;rr(c,x+1,y+1,w-2,h-2,r);c.stroke();c.restore();
  c.fillStyle=rgba(DP.ice,0.5*ed);c.fillRect(x+r,y+0.5,w-2*r,1.6);
  c.restore();}
// a pane of frosted glass standing in a room: the hall behind it blurred, its rim in its colour, lit (0 to 1) brighter; col2 and mix
// turn its rim towards another colour (coral, where something reached it)
function wd_pane(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit||0,col=mix(dp_f(o.col||"cyan"),dp_f(o.col2||"coral"),clamp(o.mix||0,0,1));
  c.save();c.globalAlpha*=a;c.save();if(lit>0){c.shadowColor=rgba(col,0.55*lit);c.shadowBlur=26;}rr(c,x,y,w,h,8);c.fillStyle="rgba(6,20,26,0.55)";c.fill();c.restore();
  c.save();rr(c,x,y,w,h,8);c.clip();dp_behind(c,o.behind);c.fillStyle="rgba(6,20,26,0.26)";c.fillRect(x,y,w,h);
  const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(col,[160,220,225],0.55),0.16+0.12*lit));g.addColorStop(1,rgba(mix(col,[160,220,225],0.55),0.05+0.06*lit));c.fillStyle=g;c.fillRect(x,y,w,h);
  const hg=c.createLinearGradient(0,y,0,y+40);hg.addColorStop(0,"rgba(225,250,250,0.14)");hg.addColorStop(1,"rgba(225,250,250,0)");c.fillStyle=hg;c.fillRect(x,y,w,40);c.restore();
  rr(c,x+1,y+1,w-2,h-2,8);c.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.5+0.45*lit);c.lineWidth=1.8+1.2*lit;c.stroke();
  if(o.label&&o.la!==0)wd_T(c,o.label,x+w/2,y+44,{w:700,size:28,align:"center",a:o.la==null?1:o.la});
  c.restore();}
// a fine even frost laid over a pane, the data encrypted (a, 0 to 1): a grain of small marks, and a violet film; full (0 to 1) frosts it
// over completely, so nothing behind it shows
function wd_cipher(c,x,y,w,h,a,full){if(!(a>0)&&!(full>0))return;c.save();rr(c,x,y,w,h,8);c.clip();
  if(a>0){const R=ag_rnd(Math.round(x*3+y)),n=Math.round(w*h/260);c.fillStyle=rgba(DP.F.violet,0.20*a);c.fillRect(x,y,w,h);c.fillStyle=rgba([220,214,255],0.32*a);
    for(let i=0;i<n;i++)c.fillRect(x+R()*w,y+R()*h,1.6+R()*2.6,1.4);}
  if(full>0){c.fillStyle=rgba([40,34,74],0.92*full);c.fillRect(x,y,w,h);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(DP.F.violet,0.30*full));g.addColorStop(1,rgba(DP.F.violet,0.10*full));c.fillStyle=g;c.fillRect(x,y,w,h);}
  c.restore();}

/* ---------------------------------------------------------------- the platform's block
   wd_block(c, t, o) draws the block and what is inside it; o says how each part is now (each from 0 to 1 unless said):
     a          the whole block
     split      one room (0) to three side by side (1): development, test and production
     walls      the walls of frosted glass rising along the areas' edges, five rooms where there was one
     labels     the areas' names on their panes; rooms the rooms' names over the block ("one workspace", or the three)
     lit(e, i)  how lit area i's pane is in room e (0 development, 1 test, 2 production; with one room, e is 2), and coral(e, i), how
                coral its rim has turned; veil(e, i) violet frost over its values (made-up or masked data)
     cipher, full, dim   the fine frost of encryption over every pane, frosted over completely (the key taken back), all dimmed
     ring       the catalog's ring lit cyan, as it checks; catalog its name
     shaft      the way down lit as a private path
     store      storage's name; files its frost cleared to show the files; sections storage split into three, with the rooms
     side       the side door open (1) or shut (0); sideShut its shut door coral; amber an amber glow at it (an admin account switched on)
     door       the front door open and lit (1) or closed (0); doorShut it coral, closed; door2 the right-hand door
     copies     the stack of copies beside the files; crack them cracked; admin the admin's badge by them
     work       people's half-finished work in the room (and "trying new things"); job the nightly job (and "the real records")
     prodCoral  production's panes coral, locked by an attacker */
const WD_ENV=["Development","Test","Production"];
// room e's box, as the one room becomes three (split 0 to 1); with one room (split 0) only production's (e 2) is the whole room
function wd_roomBox(e,split){const R=WD_RM,u=ag_sine(split),w3=(R.w-24)/3,x3=R.x+e*(w3+12);if(e===2)return{x:lerp(R.x,x3,u),y:R.y,w:lerp(R.w,w3,u),h:R.h};return{x:x3,y:R.y,w:w3,h:R.h};}
// area i's pane in room e: across the whole room with one room, smaller in each of three
function wd_paneBox(e,i,split){const one={x:512+i*172,y:152,w:158,h:148},b=wd_roomBox(2,1),pw=(b.w-18-4*10)/5,three={x:wd_roomBox(e,1).x+9+i*(pw+10),y:186,w:pw,h:114};
  if(e!==2)return three;const u=ag_sine(clamp((split-0.25)/0.75,0,1));return{x:lerp(one.x,three.x,u),y:lerp(one.y,three.y,u),w:lerp(one.w,three.w,u),h:lerp(one.h,three.h,u)};}
const WD_AREAS=["Registrar","Learning","Planning","HR","Finance"];
function wd_block(c,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const B=WD_BK,R=WD_RM,S=WD_SG,sp=clamp(o.split||0,0,1),f=k=>clamp(o[k]||0,0,1);c.save();c.globalAlpha*=a;
  // its gloss in the floor, and the shell
  const rg=c.createLinearGradient(0,B.y+B.h,0,B.y+B.h+120);rg.addColorStop(0,"rgba(120,215,225,0.10)");rg.addColorStop(1,"rgba(120,215,225,0)");c.fillStyle=rg;c.fillRect(B.x,B.y+B.h,B.w,120);
  wd_glass(c,B.x,B.y,B.w,B.h,{r:14,edge:1});
  // the floors: under the room, and over storage
  for(const yy of [R.y+R.h,S.y]){const g=c.createLinearGradient(B.x,0,B.x+B.w,0);g.addColorStop(0,"rgba(190,245,245,0.10)");g.addColorStop(0.5,"rgba(190,245,245,0.42)");g.addColorStop(1,"rgba(190,245,245,0.10)");
    c.fillStyle=g;c.fillRect(B.x+12,yy-1,B.w-24,2.4);c.fillStyle="rgba(120,215,225,0.05)";c.fillRect(B.x+12,yy+1.4,B.w-24,12);}
  // the rooms: one, or three side by side, each with its own frosted walls
  const nE=sp>0.001?3:1;for(let e=3-nE;e<3;e++){const b=wd_roomBox(e,sp),ra=e===2?1:ag_in(sp,0.35,0.5);if(ra<=0)continue;
    c.save();c.globalAlpha*=ra;if(sp>0.001){const fa=ag_in(sp,0.2,0.6);c.save();rr(c,b.x,b.y,b.w,b.h,8);c.clip();c.globalAlpha*=fa;c.fillStyle="rgba(150,215,220,0.04)";c.fillRect(b.x,b.y,b.w,b.h);c.restore();
      c.save();c.globalAlpha*=fa;c.strokeStyle="rgba(190,245,245,0.5)";c.lineWidth=2;c.shadowColor="rgba(104,216,230,0.7)";c.shadowBlur=8;rr(c,b.x+1,b.y+1,b.w-2,b.h-2,8);c.stroke();c.restore();}
    // the walls along the areas' edges: thin frosted panes between the areas, rising from the floor
    const wl=f("walls");if(wl>0)for(let i=1;i<5;i++){const p0=wd_paneBox(e,i-1,sp),p1=wd_paneBox(e,i,sp),x=(p0.x+p0.w+p1.x)/2,hh=(b.h-10)*ag_sine(wl),y1=b.y+b.h-2;
      c.save();c.globalAlpha*=ag_in(wl,0,0.3);const ww=sp>0.5?8:12;c.fillStyle="rgba(150,220,225,0.16)";c.fillRect(x-ww/2,y1-hh,ww,hh);
      const g=c.createLinearGradient(0,y1-hh,0,y1);g.addColorStop(0,"rgba(200,250,250,0.85)");g.addColorStop(1,"rgba(190,245,245,0.30)");c.fillStyle=g;c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;
      c.fillRect(x-ww/2-1,y1-hh,2,hh);c.fillRect(x+ww/2-1,y1-hh,2,hh);c.fillRect(x-ww/2-1,y1-hh-1,ww+2,2.4);c.restore();}
    // the areas' panes
    for(let i=0;i<5;i++){const p=wd_paneBox(e,i,sp),lit=o.lit?o.lit(e,i):0,cm=o.coral?o.coral(e,i):0,vl=o.veil?o.veil(e,i):0;
      wd_pane(c,p.x,p.y,p.w,p.h,{lit,mix:Math.max(cm,f("prodCoral")*(e===2?1:0)),label:WD_AREAS[i],la:e===2?(typeof o.labels==="function"?o.labels(i):f("labels"))*(1-ag_in(sp,0,0.25)):0});
      if(vl>0)dp_frost(c,p.x+6,p.y+p.h*0.5,p.w-12,p.h*0.42,null,{a:vl,r:6});
      wd_cipher(c,p.x,p.y,p.w,p.h,f("cipher"),f("full"));
      if(f("dim")>0){c.save();rr(c,p.x,p.y,p.w,p.h,8);c.fillStyle=rgba([2,8,10],0.62*f("dim"));c.fill();c.restore();}}
    c.restore();}
  // the catalog's band: the way down from each room to the files, through a ring that checks each request
  wd_ways(c,t,sp,f("ring"),f("shaft"));
  // the side door, beside the ring: a narrow way straight down to the files, open, or shut
  wd_sideDoor(c,t,f("side"),f("sideShut"),f("amber"));
  // storage, at the foot: frosted, its files under the frost; in three, with the rooms
  wd_storage(c,t,f("files"),f("sections")*ag_in(sp,0.3,0.6));
  // the copies, beside the files, and the admin's badge by them
  wd_copies(c,t,f("copies"),f("crack"),f("admin"));
  // the doors in its walls
  wd_door(c,WD_DOOR.x,WD_DOOR.y,WD_DOOR.h,f("door"),f("doorShut"),1);
  if(f("door2")>0)wd_door(c,WD_DOOR2.x,WD_DOOR2.y,WD_DOOR2.h,f("door2"),0,-1);
  // what is in the room: people's half-finished work, and the nightly job with the real records
  wd_work(c,t,f("work"),sp,o.finished||0,o.test==null?1:f("test"));wd_job(c,t,f("job"),sp,f("real"));
  // the rooms' names, over the block
  if(f("rooms")>0){const ra=f("rooms");if(sp<0.5){const tw=dp_tw(c,"one workspace",{w:700,size:28})+44;dp_tag(c,R.x,40,"one workspace","cyan",{a:ra*(1-ag_in(sp,0,0.3))*wd_boxA(c,R.x,40,R.x+tw,100),size:28});}
    if(sp>0.3)for(let e=0;e<3;e++){const b=wd_roomBox(e,1);wd_T(c,WD_ENV[e],b.x+b.w/2,92,{w:700,size:30,align:"center",col:e===2?"ink":"mut",a:ra*ag_in(sp,0.55,0.4)});}}
  c.restore();}
// the ways down: a tube of glass from each room through the catalog's band to the files, with a ring round it
function wd_ways(c,t,sp,ring,shaft){const n=sp>0.001?3:1;for(let e=3-n;e<3;e++){const b=wd_roomBox(e,sp),a=e===2?1:ag_in(sp,0.35,0.5);if(a<=0)continue;
  const cx=e===2?lerp(WD_CT.x,b.x+b.w/2,ag_sine(sp)):b.x+b.w/2,rx=lerp(WD_CT.rx,62,ag_sine(sp)),tw=lerp(92,58,ag_sine(sp)),y0=WD_RM.y+WD_RM.h,y1=WD_SG.y;c.save();c.globalAlpha*=a;
  // the tube
  const g=c.createLinearGradient(cx-tw/2,0,cx+tw/2,0);g.addColorStop(0,"rgba(190,245,245,0.16)");g.addColorStop(0.5,"rgba(190,245,245,0.04)");g.addColorStop(1,"rgba(190,245,245,0.12)");c.fillStyle=g;c.fillRect(cx-tw/2,y0,tw,y1-y0);
  c.fillStyle="rgba(190,245,245,0.45)";c.fillRect(cx-tw/2,y0,1.6,y1-y0);c.fillRect(cx+tw/2-1.6,y0,1.6,y1-y0);
  if(shaft>0){c.save();c.globalCompositeOperation="lighter";const sg=c.createLinearGradient(0,y0,0,y1);sg.addColorStop(0,rgba(DP.F.cyan,0.20*shaft));sg.addColorStop(0.5,rgba(DP.F.cyan,0.36*shaft));sg.addColorStop(1,rgba(DP.F.cyan,0.20*shaft));
    c.fillStyle=sg;c.fillRect(cx-tw/2+3,y0,tw-6,y1-y0);c.restore();}
  // the ring: its far half behind the tube, its near half in front; grey at rest, cyan when it checks
  const col=mix(DP.F.grey,DP.F.cyan,ring),cy=WD_CT.y;c.save();c.lineCap="round";c.shadowColor=rgba(col,0.4+0.5*ring);c.shadowBlur=8+12*ring;
  c.strokeStyle=rgba(mix(col,[255,255,255],0.2),0.55+0.4*ring);c.lineWidth=5;c.beginPath();c.ellipse(cx,cy,rx,WD_CT.ry,0,Math.PI,TAU);c.stroke();
  c.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.75+0.25*ring);c.lineWidth=6;c.beginPath();c.ellipse(cx,cy,rx,WD_CT.ry,0,0,Math.PI);c.stroke();c.restore();c.restore();}}
// the side door: a narrow way from the room straight down to the files, beside the catalog's band; open (a dark slot), sliding shut
// (shut 1, coral), and an amber glow at it once (an admin account switched on)
function wd_sideDoor(c,t,open,shut,amber){const D=WD_SD;c.save();
  const g=c.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"rgba(4,12,16,0.92)");g.addColorStop(1,"rgba(20,40,44,0.92)");c.fillStyle=g;c.fillRect(D.x,D.y,D.w,D.h);
  c.save();c.globalCompositeOperation="lighter";const lg=c.createLinearGradient(0,D.y,0,D.y+D.h);lg.addColorStop(0,"rgba(150,220,225,0)");lg.addColorStop(1,rgba([150,220,225],0.16*clamp(open,0,1)));c.fillStyle=lg;c.fillRect(D.x,D.y,D.w,D.h);c.restore();
  c.save();c.shadowColor="rgba(104,216,230,0.6)";c.shadowBlur=6;c.fillStyle="rgba(190,245,245,0.6)";c.fillRect(D.x-3,D.y,3,D.h);c.fillRect(D.x+D.w,D.y,3,D.h);c.restore();
  const u=1-clamp(open,0,1);if(u>0){const hh=D.h*ag_sine(u),col=mix([120,150,156],DP.F.coral,shut);c.save();c.shadowColor=rgba(col,0.6*shut);c.shadowBlur=14;
    c.fillStyle=rgba(mix([30,44,48],mix(col,[20,10,8],0.35),shut),1);c.fillRect(D.x,D.y,D.w,hh);c.restore();c.fillStyle=rgba(mix(col,[255,255,255],0.3),0.9);c.fillRect(D.x,D.y+hh-2,D.w,2);
    c.strokeStyle=rgba(col,0.6+0.3*shut);c.lineWidth=1.6;c.strokeRect(D.x+0.8,D.y+0.8,D.w-1.6,hh-1.6);}
  if(amber>0)dp_halo(c,D.x+D.w/2,D.y+D.h/2,120,"amber",0.5*amber);
  c.restore();}
// storage: a vault of frosted glass along the block's foot; files (0 to 1) clears its frost, so its files show, rows and rows of them,
// plain, with no ring on any; sections (0 to 1) walls it into three, under the three rooms
function wd_storage(c,t,files,sections){const S=WD_SG;wd_glass(c,S.x,S.y,S.w,S.h,{r:10,frost:1-0.85*files,col:"grey",edge:0.7,sheen:true});
  if(files>0){c.save();rr(c,S.x,S.y,S.w,S.h,10);c.clip();c.globalAlpha*=files;const R=ag_rnd(55);for(let r=0;r<5;r++)for(let k=0;k<11;k++){const x=S.x+40+k*62+(r%2)*14,y=S.y+66+r*34;
      if(x>S.x+S.w-160)continue;c.fillStyle="rgba(170,200,204,0.30)";rr(c,x,y,44,24,4);c.fill();c.fillStyle="rgba(220,240,240,0.45)";c.fillRect(x+7,y+8,22+R()*10,2.4);c.fillRect(x+7,y+14,14+R()*12,2.4);}
    c.restore();}
  if(sections>0){c.save();c.globalAlpha*=sections;for(const e of [1,2]){const b=wd_roomBox(e,1),x=b.x-6;c.fillStyle="rgba(190,245,245,0.5)";c.fillRect(x-1.5,S.y+6,3,S.h-12);c.fillStyle="rgba(150,220,225,0.06)";c.fillRect(x-7,S.y+6,14,S.h-12);}c.restore();}}
// the copies: a stack of thin slabs of glass at storage's right end, and an admin's badge by them; crack (0 to 1) cracks them
function wd_copies(c,t,a,crack,admin){if(a<=0&&admin<=0)return;const x=1236,y0=820;c.save();
  if(a>0){c.save();c.globalAlpha*=a;for(let i=0;i<6;i++){const y=y0-i*24,w=124;c.save();c.shadowColor="rgba(104,216,230,0.5)";c.shadowBlur=8;rr(c,x,y-16,w,16,4);
      const g=c.createLinearGradient(0,y-16,0,y);g.addColorStop(0,"rgba(190,240,240,0.42)");g.addColorStop(1,"rgba(120,180,186,0.22)");c.fillStyle=g;c.fill();c.restore();
      c.fillStyle="rgba(230,250,250,0.6)";c.fillRect(x+6,y-16,w-12,1.4);
      if(crack>0){const R=ag_rnd(90+i);c.save();c.strokeStyle=rgba(DP.F.coral,0.95*crack);c.lineWidth=2;c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=8;c.beginPath();let px=x+20+R()*80,py=y-16;c.moveTo(px,py);
        for(let k=0;k<4;k++){px+=(R()-0.5)*22;py+=4;c.lineTo(px,py);}c.stroke();c.restore();}}
    dp_T(c,"copies",x+62,y0-6*24-14,{w:700,size:28,align:"center"});c.restore();}
  if(admin>0){c.save();c.globalAlpha*=admin;wd_mini(c,1194,760,"person","cyan",1);c.restore();}
  c.restore();}
// a door in the block's wall: an opening, lit warm-white when open (1), its leaf sliding shut (0), coral when closed for good (shut)
function wd_door(c,x,y,h,open,shut,side){const w=16,u=clamp(open,0,1);c.save();
  c.fillStyle=rgba(mix([6,14,18],[200,240,240],0.22*u),1);c.fillRect(x-w/2,y,w,h);
  if(u>0){c.save();c.globalCompositeOperation="lighter";const g=c.createLinearGradient(x,0,x-side*120,0);g.addColorStop(0,rgba([190,245,245],0.22*u));g.addColorStop(1,"rgba(190,245,245,0)");
    c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x-side*120,y-30);c.lineTo(x-side*120,y+h+30);c.lineTo(x,y+h);c.closePath();c.fill();c.restore();}
  const lh=h*(1-ag_sine(u));if(lh>0.5){const col=mix([120,150,156],DP.F.coral,shut);c.save();c.shadowColor=rgba(col,0.4+0.5*shut);c.shadowBlur=10+8*shut;c.fillStyle=rgba(mix([40,56,60],mix(col,[30,12,10],0.3),shut),1);
    c.fillRect(x-w/2,y,w,lh);c.restore();c.fillStyle=rgba(mix(col,[255,255,255],0.3),0.8);c.fillRect(x-w/2,y+lh-2,w,2);}
  c.fillStyle="rgba(190,245,245,0.6)";c.fillRect(x-w/2-2,y-2,w+4,2);c.fillRect(x-w/2-2,y+h,w+4,2);c.restore();}
// a small badge of glass with a picture and no words: a person, or a gear (a job), in its colour; s its size
function wd_mini(c,x,y,kind,col,s){s=s||1;const cc=dp_f(col||"cyan");c.save();c.translate(x,y);c.scale(s,s);
  c.save();c.shadowColor=rgba(cc,0.55);c.shadowBlur=14;rr(c,-26,-34,52,68,10);c.fillStyle="rgba(6,24,30,0.85)";c.fill();c.restore();
  c.save();rr(c,-26,-34,52,68,10);c.clip();c.fillStyle=rgba(cc,1);c.fillRect(-26,-34,52,13);c.restore();
  rr(c,-25.2,-33.2,50.4,66.4,9.4);c.strokeStyle=rgba(mix(cc,[255,255,255],0.35),0.95);c.lineWidth=1.8;c.stroke();
  c.save();c.fillStyle=rgba(cc,0.45);c.strokeStyle=rgba(mix(cc,[255,255,255],0.4),1);c.lineWidth=1.6;
  if(kind==="gear"){dp_gear(c,0,8,15);c.fill("evenodd");c.stroke();}
  else{c.beginPath();c.arc(0,0,8,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(-15,26);c.bezierCurveTo(-14,14,-8,10,0,10);c.bezierCurveTo(8,10,14,14,15,26);c.closePath();c.fill();c.stroke();}
  c.restore();c.restore();}
// people's half-finished work in the room: a few loose cards, dashed, part-drawn; finished (0 to 1) makes them whole (in test)
function wd_work(c,t,a,sp,finished,test){if(a<=0)return;test=test==null?1:test;c.save();c.globalAlpha*=a;
  const u=ag_sine(clamp((sp-0.25)/0.75,0,1)),bx=lerp(526,wd_roomBox(0,1).x+18,u),by=lerp(330,330,u),k=lerp(1,0.78,u);
  const one=(x0,y0,f)=>{for(const [dx,dy,w,h,r] of [[0,18,150,96,-0.05],[118,0,140,104,0.04],[60,62,130,80,0.02]]){c.save();c.translate(x0+dx*k+w*k/2,y0+dy*k+h*k/2);c.rotate(r);c.scale(k,k);
      rr(c,-w/2,-h/2,w,h,8);c.fillStyle="rgba(10,28,34,0.88)";c.fill();c.save();if(f<1)c.setLineDash([7,6]);c.strokeStyle=rgba(mix(DP.F.grey,DP.F.green,f),0.85);c.lineWidth=1.8;rr(c,-w/2+1,-h/2+1,w-2,h-2,8);c.stroke();c.restore();
      c.fillStyle="rgba(200,225,228,0.45)";const R=ag_rnd(Math.round(w+h));for(let l=0;l<4;l++){const lw=(w-34)*(l<2||f>=1?0.5+R()*0.5:0.2+R()*0.25);c.fillRect(-w/2+16,-h/2+20+l*17,lw,3);}
      c.restore();}};
  one(bx,by,0);if(sp>0.5&&test>0){const b=wd_roomBox(1,1);c.save();c.globalAlpha*=ag_in(sp,0.6,0.4)*test;one(b.x+18,by,clamp(finished,0,1));c.restore();}
  const la=1-ag_in(sp,0,0.25);if(la>0)dp_slip(c,526,404,"trying new things","grey",{a:la,size:28});
  c.restore();}
// the nightly job in the room: its badge, small (a gear, cyan), and its name; the real records beside it (violet: personal data)
function wd_job(c,t,a,sp,real){if(a<=0)return;c.save();c.globalAlpha*=a;const u=ag_sine(clamp((sp-0.25)/0.75,0,1)),b=wd_roomBox(2,1),x=lerp(1080,b.x+14,u),y=lerp(332,322,u);
  dp_slip(c,x,y,"registrar-loader","cyan",{size:28});
  if(real>0)dp_slip(c,x,y+80,"the real records","violet",{size:28,a:real});
  c.restore();}

/* ---------------------------------------------------------------- words near the frame's edge
   The hall is bigger than most shots: when the camera comes in on the block, the names round it (the open internet, the cases, the
   corridor, the rooms' names over it) would be cut by the frame's edge. wd_boxA gives how far a box (x0, y0 to x1, y1, in the hall's
   coordinates) is inside the frame, wherever the camera puts it: 1 from 48 px in, 0 at the edge; wd_T draws words like dp_T, faded by
   it. The camera glides, so they fade smoothly, and words cut by the frame are never seen. */
function wd_boxA(c,x0,y0,x1,y1){const m=c.getTransform(),cw=c.canvas.width,ch=c.canvas.height,k=cw/W,
  l=m.a*x0+m.c*y0+m.e,r=m.a*x1+m.c*y0+m.e,t=m.b*x0+m.d*y0+m.f,b=m.b*x0+m.d*y1+m.f;return clamp((Math.min(l,cw-r,t,ch-b)-4*k)/(44*k),0,1);}
function wd_edgeA(c,s,x,y,o){const tw=dp_tw(c,s,o),sz=o.size||28,x0=o.align==="center"?x-tw/2:x;return wd_boxA(c,x0,y-sz*0.75,x0+tw,y+sz*0.2);}
function wd_T(c,s,x,y,o){const e=wd_edgeA(c,s,x,y,o);if(e>0)dp_T(c,s,x,y,Object.assign({},o,{a:(o.a==null?1:o.a)*e}));}

/* ---------------------------------------------------------------- round the block */
// the key: a sealed card with a gold chip, never a character of the key itself; (x, y) its top left, 300 wide, 96 tall
function wd_key(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_halo(c,x+150,y+48,190,"violet",0.08);
  dp_sealed(c,x,y,300,"",{behind:o.behind});wd_T(c,"the key",x+100,y+58,{w:700,size:30});dp_chip(c,x+212,y+20);
  if(o.dim>0){c.save();rr(c,x,y,300,96,18);c.fillStyle=rgba([2,8,10],0.6*o.dim);c.fill();c.restore();}c.restore();}
// a case of glass where a key is kept: its words at the top (title 36 px, or a line of 28), the key under them
function wd_case(c,B,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  dp_panel(c,B.x,B.y,B.w,B.h,{col:o.col||"grey",r:20,glowR:30});
  if(o.title){wd_T(c,o.title,B.x+30,B.y+56,{w:700,size:36});if(o.sub)wd_T(c,o.sub,B.x+30,B.y+96,{w:600,size:28,col:"mut"});}
  else if(o.sub)wd_T(c,o.sub,B.x+30,B.y+50,{w:700,size:28});
  c.restore();}
// where the key's card sits in each case
const WD_KEY0=[WD_PROV.x+60,WD_PROV.y+90],WD_KEY1=[WD_VAULT.x+60,WD_VAULT.y+128];
// the corridor of glass from the university's network: from the frame's right edge to the block's right-hand door, lit, its name over
// it; badges (cyan) walk along it towards the door (flow, 0 to 1, how many)
function wd_corridor(c,t,a,flow,o){if(a<=0)return;o=o||{};const y=WD_COR.y,h=WD_COR.h,x0=WD_DOOR2.x+8,x1=W,u=ag_sine(a);c.save();
  const xa=lerp(x1,x0,u);c.save();rr(c,xa,y,x1-xa+20,h,14);c.clip();const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(120,215,225,0.16)");g.addColorStop(0.5,"rgba(120,215,225,0.05)");g.addColorStop(1,"rgba(120,215,225,0.12)");
  c.fillStyle=g;c.fillRect(xa,y,x1-xa,h);c.strokeStyle="rgba(190,245,245,0.12)";c.lineWidth=1.2;for(let x=x1-((t*40)%120);x>xa;x-=120){c.beginPath();c.moveTo(x,y);c.lineTo(x-20,y+h);c.stroke();}c.restore();
  c.save();c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;c.fillStyle="rgba(200,250,250,0.85)";c.fillRect(xa,y,x1-xa,2);c.fillRect(xa,y+h-2,x1-xa,2);c.restore();
  if(o.label!==false)wd_T(c,"the university's network",1452,y-16,{w:700,size:28,a:ag_in(a,0.6,0.4)*(o.la==null?1:o.la)});
  if(flow>0)for(let k=0;k<4;k++){const p=((t*0.16+k*0.25)%1),x=lerp(x1+30,x0+40,p),fa=Math.min(1,p*6,(1-p)*6)*flow;if(fa<=0.01||x<xa+20)continue;
    c.save();c.globalAlpha*=fa;wd_mini(c,x,y+h/2+2,k===2?"gear":"person","cyan",0.82);c.restore();}
  c.restore();}
// the copies' place apart: a smaller block of glass far off, with its own door and its own admins' badge; its name over it
function wd_apart(c,t,a,o){if(a<=0)return;o=o||{};const A=WD_APART;c.save();c.globalAlpha*=a;
  const rg=c.createLinearGradient(0,A.y+A.h,0,A.y+A.h+70);rg.addColorStop(0,"rgba(120,215,225,0.08)");rg.addColorStop(1,"rgba(120,215,225,0)");c.fillStyle=rg;c.fillRect(A.x,A.y+A.h,A.w,70);
  wd_glass(c,A.x,A.y,A.w,A.h,{r:12,frost:0.35});
  // its own door, on its left wall, and its own admins' badge beside it
  c.fillStyle="rgba(4,12,16,0.9)";c.fillRect(A.x-6,A.y+A.h-96,12,86);c.fillStyle="rgba(190,245,245,0.6)";c.fillRect(A.x-8,A.y+A.h-98,16,2);
  wd_mini(c,A.x+44,A.y+A.h-50,"person","cyan",0.8);
  if(o.label!==false){dp_T(c,"a place apart",A.x+A.w/2,A.y-48,{w:700,size:30,align:"center",a:o.la==null?1:o.la});dp_T(c,"its own admins",A.x+A.w/2,A.y-12,{w:600,size:28,align:"center",col:"mut",a:o.la==null?1:o.la});}
  c.restore();}
// a thin slab: one night's copy of production's data (x, y its top left), lit; locked (0 to 1) rims it coral with a small lock
function wd_slab(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||150,h=18;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(104,216,230,0.6)";c.shadowBlur=10;rr(c,x,y,w,h,5);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(200,245,245,0.55)");g.addColorStop(1,"rgba(120,185,190,0.30)");c.fillStyle=g;c.fill();c.restore();
  c.fillStyle="rgba(240,252,252,0.7)";c.fillRect(x+6,y,w-12,1.4);
  const lk=o.locked||0;if(lk>0){c.save();c.globalAlpha*=lk;rr(c,x-2,y-2,w+4,h+4,6);c.strokeStyle=rgba(DP.F.coral,0.95);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=8;c.stroke();c.restore();}
  c.restore();}
// the intruder, never shown: a coral dotted line walking along a path pts [[x, y], ...], drawn to u (0 to 1), its head a small light
function wd_walk(c,pts,u,o){o=o||{};if(u<=0)return;const a=o.a==null?1:o.a;if(a<=0)return;const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  let left=clamp(u,0,1)*tot;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(DP.F.coral,0.95);c.lineWidth=5;c.lineCap="round";c.setLineDash([0.1,15]);c.shadowColor=rgba(DP.F.coral,0.9);c.shadowBlur=10;
  c.beginPath();c.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];for(let i=0;i<L.length&&left>0;i++){const f=Math.min(1,left/L[i]);hx=lerp(pts[i][0],pts[i+1][0],f);hy=lerp(pts[i][1],pts[i+1][1],f);c.lineTo(hx,hy);left-=L[i];}
  c.stroke();c.setLineDash([]);if(u<1||o.head){dp_halo(c,hx,hy,46,"coral",0.5);c.fillStyle=rgba(mix(DP.F.coral,[255,255,255],0.4),1);c.beginPath();c.arc(hx,hy,7,0,TAU);c.fill();}
  c.restore();return[hx,hy];}
// a request that passes the catalog's ring: a light coming down the way to the files, a tick by the ring, and, where a rule applies, the
// rows it brings back, with a violet frost over the values the rule hides; p from 0 to 1.6; k the ring's size (1, or smaller in three)
function wd_request(c,cx,p,o){o=o||{};if(p<=0||p>=1.7)return;const k=o.k||1,y0=WD_RM.y+WD_RM.h-6,y1=WD_SG.y+34,d=clamp(p/0.7,0,1),y=lerp(y0,y1,ag_sine(d)),fa=1-ag_in(p,1.25,0.4);c.save();c.globalAlpha*=fa;
  if(d<1){dp_halo(c,cx,y,40,"cyan",0.6);c.fillStyle=rgba(mix(DP.F.cyan,[255,255,255],0.5),1);c.beginPath();c.arc(cx,y,7,0,TAU);c.fill();}
  dp_tick(c,cx+WD_CT.rx*k+30,WD_CT.y,"green",clamp((p-0.3)/0.4,0,1));
  if(o.rule){const ra=ag_in(p,0.7,0.3);if(ra>0){const x=cx-70,yy=y1+6;c.save();c.globalAlpha*=ra;dp_panel(c,x,yy,140,70,{col:"cyan",r:10,glowR:16});
    c.fillStyle="rgba(220,240,240,0.55)";for(let r=0;r<3;r++)c.fillRect(x+14,yy+16+r*16,46,4);
    dp_frost(c,x+72,yy+10,56,50,cc=>{cc.fillStyle="#fff";for(let r=0;r<3;r++)cc.fillRect(x+80,yy+16+r*16,40,5);},{r:6});c.restore();}}
  c.restore();}

/* ---------------------------------------------------------------- the hall, as a chapter finds it
   wd_hallWorld(c, t, s) draws everything round the block and the block itself, from a state s (each 0 to 1 unless said):
     inet       "the open internet" over the plain
     prov       the cloud provider's case; vault the university's own, and vaultCoral its rim turned coral (taken back)
     keyU       where the key is: 0 in the provider's case, 1 in the university's vault (it glides across the hall); keyA, keyDim
     corridor   the corridor from the university's network, flow the badges walking it
     apart      the copies' place apart, far off
     thread     the way out drawn from the room to "anywhere"; threadCut it cut at the wall, coral, and gone outside
     catalog, store   the names of the catalog and of storage
     block      wd_block's own options */
const WD_THREAD=[[640,226],[470,226],[340,290],[244,420]];
function wd_hallWorld(c,t,s){const f=k=>clamp(s[k]||0,0,1);
  if(f("inet")>0)wd_T(c,"the open internet",44,282,{w:700,size:28,col:"mut",a:f("inet")});
  if(f("prov")>0)wd_case(c,WD_PROV,{col:"grey",sub:"kept by the cloud provider",a:f("prov")});
  if(f("vault")>0){const vc=f("vaultCoral");wd_case(c,WD_VAULT,{col:vc>0.5?"coral":"cyan",title:"the university's key",sub:"kept by the security team",a:f("vault")});
    if(vc>0){c.save();c.globalAlpha*=vc;dp_halo(c,WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h/2,300,"coral",0.18);c.restore();}}
  wd_corridor(c,t,f("corridor"),f("flow"),{la:s.corLabel==null?1:s.corLabel});
  wd_apart(c,t,f("apart"),{la:s.apartLabel==null?1:s.apartLabel});
  wd_thread(c,t,f("thread"),f("threadCut"),s.anyLabel==null?1:s.anyLabel);
  wd_block(c,t,s.block||{});
  if(f("catalog")>0)dp_T(c,"the catalog",640,544,{w:700,size:28,col:"mut",a:f("catalog")});
  if(f("store")>0)dp_T(c,"storage",520,644,{w:700,size:28,a:f("store")});
  if(f("keyA")>0){const u=ag_sine(f("keyU")),x=lerp(WD_KEY0[0],WD_KEY1[0],u),y=lerp(WD_KEY0[1],WD_KEY1[1],u)-Math.sin(Math.PI*u)*90;wd_key(c,x,y,{a:f("keyA"),dim:f("keyDim")});}}
// the way out: a thread of light from the room through the block's left wall into the dark plain, "anywhere" at its end; cut (0 to 1)
// turns the part outside coral and takes it away, leaving a short end inside the wall
function wd_thread(c,t,a,cut,la){if(a<=0)return;const P=WD_THREAD;c.save();const L=[];let tot=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(d);tot+=d;}
  const path=(u0,u1)=>{let d0=u0*tot,d1=u1*tot,acc=0;c.beginPath();let started=false;for(let i=0;i<L.length;i++){const s0=acc,s1=acc+L[i];acc=s1;if(s1<d0||s0>d1)continue;
    const fa=clamp((d0-s0)/L[i],0,1),fb=clamp((d1-s0)/L[i],0,1),ax=lerp(P[i][0],P[i+1][0],fa),ay=lerp(P[i][1],P[i+1][1],fa),bx=lerp(P[i][0],P[i+1][0],fb),by=lerp(P[i][1],P[i+1][1],fb);
    if(!started){c.moveTo(ax,ay);started=true;}c.lineTo(bx,by);}};
  const uw=L[0]/tot,u=ag_sine(a);c.lineCap="round";c.lineJoin="round";
  // inside the wall: stays
  c.save();c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;c.strokeStyle="rgba(190,245,245,0.9)";c.lineWidth=3;path(0,Math.min(u,uw));c.stroke();c.restore();
  // outside: the same light, turning coral and fading as it's cut
  const oa=1-ag_in(cut,0.35,0.65);if(u>uw&&oa>0){c.save();c.globalAlpha*=oa;const col=mix([190,245,245],DP.F.coral,ag_in(cut,0,0.35));c.shadowColor=rgba(col,0.8);c.shadowBlur=10;c.strokeStyle=rgba(col,0.9);c.lineWidth=3;path(uw,u);c.stroke();
    if(u>=0.999){c.fillStyle=rgba(mix(col,[255,255,255],0.3),1);c.beginPath();c.arc(P[3][0],P[3][1],6,0,TAU);c.fill();wd_T(c,"anywhere",P[3][0]-24,P[3][1]+52,{w:700,size:28,align:"center",a:la*ag_in(a,0.85,0.15)});}c.restore();}
  if(cut>0){c.save();c.globalAlpha*=ag_in(cut,0,0.3);const x=P[1][0],y=P[1][1];c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=3.4;c.lineCap="round";c.shadowColor=rgba(DP.F.coral,0.9);c.shadowBlur=10;
    c.beginPath();c.moveTo(x-12,y-14);c.lineTo(x-12,y+14);c.stroke();c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the board, and the university's map */
// the board: a pane of clear glass standing in the hall, where Sam writes who secures what
const WD_BOARD={x:200,y:96,w:1140,h:700};
// a row of the board: a card of glass with a band of solid colour naming who, and what it secures under it; p brings it in
function wd_row(c,y,who,what,col,p){if(p<=0)return;const x=WD_BOARD.x+50,w=WD_BOARD.w-100,h=128;c.save();c.globalAlpha*=ag_in(p,0,0.4);c.translate(0,(1-ag_eo(clamp(p/0.6,0,1)))*14);
  dp_panel(c,x,y,w,h,{col,r:18,glowR:28});dp_band(c,x,y,w,54,18,col,who);dp_T(c,what,x+28,y+100,{w:600,size:30});c.restore();}
// the marker Sam holds, in figure space at the near hand (hands.near)
function wd_marker(c,h){const [x,y]=h.near;c.save();c.translate(x+16,y-30);c.rotate(-0.5);c.fillStyle="rgb(30,36,40)";rr(c,-9,-58,18,96,7);c.fill();
  c.fillStyle="rgb(72,222,244)";rr(c,-9,-74,18,22,6);c.fill();c.fillStyle="rgba(220,250,250,0.35)";c.fillRect(-6,-54,3,86);c.restore();}
// the university's map, on a pane: its five areas, each with its name, its owner's badge and a tick once the owner is named
const WD_MAPAREAS=[["Registrar",300,212,460,280],["Learning",780,212,420,280],["Planning",1220,212,400,280],["HR",300,512,600,290],["Finance",920,512,700,290]];
function wd_uniMap(c,t,a,owners,o){if(a<=0)return;o=o||{};c.save();c.globalAlpha*=a;dp_panel(c,260,96,1400,736,{col:"cyan",r:24});dp_T(c,"the university's map",300,160,{w:700,size:36});
  WD_MAPAREAS.forEach(([name,x,y,w,h],i)=>{const la=o.areas?o.areas(i):1;if(la<=0)return;c.save();c.globalAlpha*=la;
    rr(c,x,y,w,h,16);c.fillStyle="rgba(120,215,225,0.08)";c.fill();c.strokeStyle="rgba(190,245,245,0.55)";c.lineWidth=2;c.stroke();
    dp_T(c,name,x+26,y+50,{w:700,size:32});
    const ow=owners?owners(i):0;if(ow>0){c.save();c.globalAlpha*=ag_in(ow,0,0.4);wd_mini(c,x+w-64,y+h-62,"person","cyan",1);c.restore();dp_tick(c,x+w-118,y+h-50,"green",clamp(ow,0,1));}
    c.restore();});
  c.restore();}
