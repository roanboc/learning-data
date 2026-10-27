/* ===== Off the shelf: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). The past, in 2008: an operating room, a hospital's shelf of guidelines,
   a map of the world with the study's eight cities, and the checklist on its clipboard, close. Today, only the university's own places
   (the series' rooms.js): the campus, Yusuf's office, the floor of offices, Planning, the registrar's office, the data team's room, and
   his desk from above. The pictures are the film's own things: the team in scrubs, caps and masks, the patient, the drip, the trolley
   and the count board; the shelf of binders, the score, the chart, the minutes, the two reports, the glossary's term, the government's
   manual, binder 12 and the highlighters, the newest DMBOK on Yusuf's desk, the gold cards of what's worth keeping, and the cards for
   the films to come, on Noor's map among them. Every name starts with os_ or OS_. */

/* ---------- 2008: an operating room, a hospital's shelf of guidelines, eight cities on a map, and the checklist ---------- */
// The operating room: pale green walls, a grey-green floor; at the head of the table the anaesthetic machine and its screen, a glass
// cabinet, the drip stand, a lit X-ray screen, the clock, the count board and the door; the light over the table. The table, the
// patient under the drape and the instrument trolley are drawn after the people who stand behind them (os_orFront).
const OS_OR={fy:862,wall:[204,222,214],floor:[180,192,188],table:[430,1300,646],pole:452,bag:[452,292],port:[476,566],wrist:[652,602],
  cab:[536,176,262,232],xray:[1010,214,190,150],clock:[1346,112],count:[1250,192,350,214],door:[1648,252,186],trolley:[1340,1590,652],
  light:[1004,150]};
const OS_DRAPE=[112,166,172],OS_STEEL=[184,192,198],OS_SCRUB=[96,150,186],OS_GOWN=[156,190,212],OS_CAPLITE=[214,226,236];

/* the team, in 2008: scrubs, caps and masks; the surgeon and the scrub nurse in sterile gowns and gloves. Invented people, drawn as the
   series draws people of the past, with a warm umber wash behind them. */
Object.assign(PEOPLE,{
  os_anaes:{name:"",role:"anaesthetist",side:"",edge:GV_PAST,seed:41,skin:[122,82,62],hair:{style:"cropped",c:[30,26,26]},hat:"os_cap",hatC:[60,78,118],capDots:[222,186,96],
    mask:[198,220,232],top:{kind:"scrubs",c:[70,100,142],rolled:true},bottom:{c:[70,100,142]},shoe:[226,230,234],build:{sh:74,hip:62,h:1.0}},
  os_surgeon:{name:"",role:"surgeon",side:"",edge:GV_PAST,seed:42,skin:[180,128,96],hair:{style:"cropped",c:[28,22,22]},glasses:[60,56,64],hat:"os_cap",hatC:[178,78,98],
    capDots:[250,220,160],mask:[198,220,232],gloves:[230,208,172],top:{kind:"os_gown",c:OS_GOWN},bottom:{c:[112,150,182]},shoe:[232,234,238],build:{sh:66,hip:60,h:0.96}},
  os_scrub:{name:"",role:"scrub nurse",side:"",edge:GV_PAST,seed:43,skin:[238,204,174],hair:{style:"cropped",c:[42,34,32]},hat:"os_cap",hatC:[132,176,206],
    mask:[198,220,232],gloves:[230,208,172],top:{kind:"os_gown",c:OS_GOWN},bottom:{c:[112,150,182]},shoe:[232,234,238],build:{sh:64,hip:60,h:0.93}},
  os_nurse:{name:"",role:"nurse",side:"",edge:GV_PAST,seed:44,skin:[204,152,114],hair:{style:"cropped",c:[36,28,26]},hat:"os_cap",hatC:[66,138,140],capDots:[244,204,100],
    mask:[198,220,232],top:{kind:"scrubs",c:[80,148,152],rolled:true},bottom:{c:[80,148,152]},shoe:[230,232,236],build:{sh:72,hip:62,h:0.99}},
  os_patient:{name:"",role:"patient",side:"",edge:GV_PAST,seed:45,skin:[228,192,162],hair:{style:"cropped",c:[176,170,166]},hat:"os_cap",hatC:OS_CAPLITE,
    top:{kind:"shirt",c:[220,226,232]},bottom:{c:[200,200,200]},shoe:[200,200,200],build:{sh:66,hip:60,h:1}}
});
// their clothes: the series' engine stays as it is; these wrap its torso, head and arms for this film's own kinds only
const os_torsoBase=torso,os_headBase=head,os_armBase=arm;
function os_gownPath(ctx,sw,hw,y0,sh,hem,fl){ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-4,y0+28,-sw-4,y0+52);
  ctx.bezierCurveTo(-sw-4,y0+90,-hw-6,-352,-hw-2,-322);ctx.quadraticCurveTo(-hw-fl*0.5+sh*0.4,-230,-hw-fl+sh*0.5,hem);ctx.quadraticCurveTo(sh*0.5,hem+10,hw+fl+sh*0.5,hem);
  ctx.quadraticCurveTo(hw+fl*0.5+sh*0.4,-230,hw+2,-322);ctx.bezierCurveTo(hw+6,-352,sw+4,y0+90,sw+4,y0+52);ctx.quadraticCurveTo(sw+4,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();}
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind!=="scrubs"&&T_.kind!=="os_gown")return os_torsoBase(ctx,P,br,sh);
  const c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br;
  if(T_.kind==="scrubs"){os_torsoBase(ctx,P,br,sh);ctx.save();torsoPath(ctx,P,br,sh);ctx.clip();
    // the V of the neck, the skin in it, and its band
    ctx.beginPath();ctx.moveTo(-23,y0-4);ctx.lineTo(23,y0-4);ctx.lineTo(sh*0.3,y0+50);ctx.closePath();litFill(ctx,P.skin,-23,y0,23,y0+50,0.6);
    ctx.strokeStyle=rgba(darken(c,0.3),0.95);ctx.lineWidth=6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-24,y0-2);ctx.lineTo(sh*0.3,y0+52);ctx.lineTo(24,y0-2);ctx.stroke();
    // a breast pocket with a pen in it
    ctx.beginPath();rr(ctx,-sw+24,-402,44,42,5);ctx.fillStyle=rgba(darken(c,0.1),1);ctx.fill();seam(ctx,c,0.5,1.2);
    ctx.fillStyle="rgba(250,250,252,0.95)";ctx.fillRect(-sw+36,-414,5,24);ctx.fillStyle=rgba([40,90,170],1);ctx.fillRect(-sw+36,-416,5,6);ctx.restore();
    // the top hangs loose over the trousers
    ctx.beginPath();ctx.moveTo(-hw-2,-264);ctx.quadraticCurveTo(sh*0.5,-250,hw+2+sh*0.6,-264);ctx.lineTo(hw+5+sh*0.6,-236);ctx.quadraticCurveTo(sh*0.5,-224,-hw-5,-236);ctx.closePath();
    litFill(ctx,c,-hw,-264,hw,-224);seam(ctx,c,0.4);return;}
  // a sterile gown to below the knee, with long sleeves (the arms), a round neck and its tie, and a tie at the waist
  const hem=-118,fl=24;os_gownPath(ctx,sw,hw,y0,sh,hem,fl);litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);
  ctx.save();os_gownPath(ctx,sw,hw,y0,sh,hem,fl);ctx.clip();ctx.strokeStyle=rgba(darken(c,0.32),0.3);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(const k of [-0.6,-0.18,0.26,0.66]){ctx.beginPath();ctx.moveTo(k*hw*0.8+sh*0.3,-312);ctx.quadraticCurveTo(k*hw*1.05+sh*0.4,-220,k*(hw+fl)*0.95+sh*0.5,hem+4);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.25),0.28);ctx.lineWidth=5;for(const k of [-0.38,0.44]){ctx.beginPath();ctx.moveTo(k*hw*0.8+sh*0.3,-306);ctx.quadraticCurveTo(k*hw+sh*0.4,-220,k*(hw+fl)*0.9+sh*0.5,hem+4);ctx.stroke();}
  ctx.fillStyle=rgba(lighten(c,0.18),1);ctx.beginPath();ctx.moveTo(-19,y0-2);ctx.quadraticCurveTo(0,y0+16,19,y0-2);ctx.lineTo(16,y0-6);ctx.quadraticCurveTo(0,y0+8,-16,y0-6);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(darken(c,0.3),0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-19,y0-1);ctx.quadraticCurveTo(0,y0+17,19,y0-1);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.12),1);ctx.fillRect(-hw-6,-304,hw*2+12+sh*0.4,9);ctx.restore();
  ctx.strokeStyle=rgba(darken(c,0.18),0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-hw+14,-300);ctx.quadraticCurveTo(-hw+4,-282,-hw+10,-262);ctx.moveTo(-hw+16,-300);ctx.quadraticCurveTo(-hw+26,-284,-hw+24,-266);ctx.stroke();};
// a cap over the hair, plain or patterned, gathered at the forehead; a pleated mask over the nose and mouth
function os_capOn(ctx,P){const c=P.hatC;ctx.beginPath();ctx.moveTo(-50,-4);ctx.bezierCurveTo(-62,-64,-36,-100,0,-100);ctx.bezierCurveTo(36,-100,62,-64,50,-4);
  ctx.quadraticCurveTo(43,-22,24,-31);ctx.quadraticCurveTo(0,-37,-24,-31);ctx.quadraticCurveTo(-43,-22,-50,-4);ctx.closePath();litFill(ctx,c,-60,-100,60,-4);seam(ctx,c,0.4);
  if(P.capDots){ctx.save();ctx.clip();ctx.fillStyle=rgba(P.capDots,0.85);for(let i=0;i<50;i++){ell(ctx,(hash(i,P.seed)-0.5)*116,-100+hash(i,P.seed+3)*92,2.8,2.8);ctx.fill();}ctx.restore();}
  ctx.strokeStyle=rgba(darken(c,0.28),0.7);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-48,-8);ctx.quadraticCurveTo(-41,-24,-23,-32);ctx.quadraticCurveTo(0,-38,23,-32);ctx.quadraticCurveTo(41,-24,48,-8);ctx.stroke();
  ctx.strokeStyle=rgba(darken(c,0.2),0.35);ctx.lineWidth=1.6;for(const k of [-0.5,0,0.5]){ctx.beginPath();ctx.moveTo(k*44,-34);ctx.quadraticCurveTo(k*52,-62,k*30,-92);ctx.stroke();}}
function os_maskOn(ctx,P,po){const c=P.mask,fx=po.turn*7;ctx.beginPath();ctx.moveTo(-41,6);ctx.quadraticCurveTo(-20,1,fx,4);ctx.quadraticCurveTo(20,1,41,6);
  ctx.bezierCurveTo(42,24,35,41,22,50);ctx.quadraticCurveTo(fx,59,-22,50);ctx.bezierCurveTo(-35,41,-42,24,-41,6);ctx.closePath();litFill(ctx,c,-41,2,41,58);seam(ctx,c,0.35);
  ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.22),0.5);ctx.lineWidth=1.6;for(const y of [17,27,37]){ctx.beginPath();ctx.moveTo(-44,y);ctx.quadraticCurveTo(fx,y+4,44,y);ctx.stroke();}ctx.restore();
  ctx.strokeStyle=rgba(lighten(c,0.25),0.95);ctx.lineWidth=2.4;ctx.lineCap="round";for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*41,8);ctx.quadraticCurveTo(s*49,1,s*45,-8);ctx.moveTo(s*36,42);ctx.quadraticCurveTo(s*49,31,s*46,10);ctx.stroke();}}
head=function(ctx,P,E,po,t){os_headBase(ctx,P,E,po,t);if(P.hat==="os_cap")os_capOn(ctx,P);if(P.mask)os_maskOn(ctx,P,po);};
// gloved hands: the hands take the gloves' colour, the sleeves go to the wrist
arm=function(ctx,P,s,a,br,po){if(!P.gloves)return os_armBase(ctx,P,s,a,br,po);const sk=P.skin;P.skin=P.gloves;os_armBase(ctx,P,s,a,br,po);P.skin=sk;};
// how they stand: hands up and clear, as a sterile team keeps them; reading the checklist; a hand held up to wait; giving the antibiotic
// through the drip; carrying a tray; a tick on the clipboard
Object.assign(POSE,{
  os_sterile:{L:[0.24,-2.66],R:[0.24,-2.66],feet:24,shift:0,tilt:0.02,turn:0.02,gaze:[0.1,0.7],look:1},
  os_sterileUp:{L:[0.24,-2.66],R:[0.24,-2.66],feet:24,shift:2,tilt:-0.02,turn:0.1,gaze:[0.6,0.1],look:0},
  os_read:{L:[0.25,-1.45],R:[0.25,-1.45],feet:26,shift:2,tilt:0.04,turn:0.05,gaze:[0.1,1],look:1},
  os_stop:{L:[0.25,-1.45],R:[0.5,2.9],hand:"open",feet:30,shift:4,tilt:-0.03,turn:0.25,gaze:[0.8,0],look:0},
  os_inject:{L:[0.16,-0.1],R:[0.3,2.62],feet:30,shift:6,tilt:-0.04,turn:0.3,gaze:[0.8,0.6],look:1},
  os_tray:{L:[0.3,-1.75],R:[0.3,-1.75],feet:24,shift:0,tilt:0,turn:0.1,gaze:[0.4,0.2],look:0},
  os_tick:{L:[0.25,-1.45],R:[0.15,-1.9],feet:26,shift:2,tilt:0.05,turn:0.05,gaze:[0.1,1],look:1}
});
// turned to the screen of the anaesthetic machine
POSE.os_screen={L:[0.1,0.1],R:[0.12,0.1],feet:24,shift:0,tilt:0.02,turn:0.4,gaze:[0.9,-0.3],look:0};
// a step either way with the tray, walking
POSE.os_trayA=Object.assign({},POSE.os_tray,{feet:14,shift:-5,tilt:0.03});POSE.os_trayB=Object.assign({},POSE.os_trayA,{shift:5,tilt:-0.03});
// things in their hands, drawn in the figure's units: the clipboard with the checklist on it (both hands, or the left), the syringe, a tray
function os_clipC(){return wc_kept("osClip",170,226,q=>{q.translate(10,16);wc_wash(q,wc_rrPts(0,0,150,200,10),[176,128,84],{kind:"thing",lw:1.4,seed:5});
  wc_flat(q,wc_rect(14,22,122,166),[252,250,244],1,"page");wc_wash(q,wc_rrPts(45,-10,60,26,6),OS_STEEL,{kind:"thing",lw:1.2,seed:6});
  q.fillStyle=rgba(WC_MUTED,0.55);q.fillRect(24,34,100,7);for(let c=0;c<3;c++)for(let i=0;i<5;i++){q.fillStyle=rgba(WC_MUTED,0.3);q.fillRect(22+c*40,56+i*24,30,4);
    q.strokeStyle=rgba(WC_MUTED,0.45);q.lineWidth=1.2;q.strokeRect(22+c*40,62+i*24,8,8);}});}
// the clipboard, at about three quarters of its kept size, in front of the body, its foot in the left hand: the right holds it too
// (os_heldClip), is raised (os_heldClipL), or holds a pen (os_heldClipPen)
function os_clipAt(cx,y){cx.save();cx.translate(0,y);cx.rotate(-0.04);cx.scale(0.72,0.72);cx.drawImage(os_clipC(),-85,-113);cx.restore();}
function os_heldClip(cx,P_,hands){const [l,r]=hands;os_clipAt(cx,l[1]-40);fingers(cx,P_,[[l[0],l[1]-4],[r[0],r[1]-4]]);}
function os_heldClipL(cx,P_,hands){const l=hands[0];os_clipAt(cx,l[1]-40);fingers(cx,P_,[[l[0],l[1]-4]]);}
function os_heldClipPen(cx,P_,hands){const [l,r]=hands;os_clipAt(cx,l[1]-40);fingers(cx,P_,[[l[0],l[1]-4]]);
  cx.save();cx.translate(r[0],r[1]);cx.rotate(0.45);wc_flat(cx,wc_rect(-4,-44,8,52),[40,90,170],1,"pen");cx.fillStyle=rgba([236,238,240],1);cx.fillRect(-4,4,8,6);cx.restore();fingers(cx,P_,[r]);}
function os_heldSyringe(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);cx.rotate(-0.5);cx.scale(1.3,1.3);
  wc_flat(cx,wc_rect(-6,-66,12,56),[236,242,246],1,"barrel");cx.fillStyle="rgba(250,236,170,0.75)";cx.fillRect(-4,-40,8,28);cx.strokeStyle=rgba(WC_MUTED,0.6);cx.lineWidth=1;
  for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(-6,-60+i*10);cx.lineTo(-1,-60+i*10);cx.stroke();}wc_flat(cx,wc_rect(-2,-12,4,24),OS_STEEL,1,"needle");
  wc_flat(cx,wc_rect(-10,-72,20,6),[200,206,212],1,"flange");wc_flat(cx,wc_rect(-2,-96,4,26),[200,206,212],1,"plunger");cx.restore();fingers(cx,P_,[[r[0]+2,r[1]-6]]);}
const os_hand=P_=>({skin:P_.gloves||P_.skin});
// a scalpel, held up and ready
function os_heldScalpel(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]-8);cx.rotate(-0.3);cx.scale(1.6,1.6);wc_flat(cx,wc_rect(-4,-10,8,50),OS_STEEL,1,"handle");
  cx.fillStyle=rgba([228,234,240],1);cx.strokeStyle=rgba(WC_PENCIL,0.7);cx.lineWidth=1.4;cx.beginPath();cx.moveTo(-4,-10);cx.quadraticCurveTo(-8,-34,0,-46);cx.lineTo(4,-10);cx.closePath();
  cx.fill();cx.stroke();cx.restore();fingers(cx,os_hand(P_),[r]);}
function os_heldTray(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-10);
  wc_wash(cx,[[-90,-10],[90,-10],[80,10],[-80,10]],OS_STEEL,{kind:"thing",lw:1.2,seed:8});for(const [x,c] of [[-50,[250,250,250]],[-10,[236,240,246]],[34,[214,226,236]]])wc_flat(cx,wc_rect(x,-26,30,18),c,1,"pack");cx.restore();
  fingers(cx,os_hand(P_),[[l[0],l[1]-4],[r[0],r[1]-4]]);}

function os_paintTheatre(ctx){const O=OS_OR,F=O.fy;gv_wallFloor(ctx,O.wall,F,{floor:O.floor,seed:23,vx:1000});
  // washable panels low on the wall, under a rail
  wc_flat(ctx,wc_rect(-40,F-150,W+80,150),wc_dim(O.wall,0.05),1,"panel");wc_part(ctx,wc_rect(-40,F-160,W+80,12),wc_dim(O.wall,0.16),1,{lw:1});
  for(let x=120;x<W;x+=240){ctx.save();ctx.strokeStyle=rgba(wc_dim(O.wall,0.2),0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,F-148);ctx.lineTo(x,F);ctx.stroke();ctx.restore();}
  // a glass cabinet of supplies
  const [cx,cy,cw,ch]=O.cab;wc_part(ctx,wc_rect(cx-10,cy-10,cw+20,ch+20),[228,234,234],1,{lw:1.2});
  for(let i=0;i<2;i++){const x0=cx+i*cw/2+8,w0=cw/2-16;wc_flat(ctx,wc_rect(x0,cy+6,w0,ch-12),[216,232,238],1,"window");
    const R=wc_rng(31+i);for(const sy of [cy+76,cy+150,cy+ch-8]){wc_part(ctx,wc_rect(x0,sy,w0,6),[196,206,210],1,{lw:0.8});let bx=x0+8;
      while(bx<x0+w0-26){const bw=18+R()*20,bh=26+R()*30,col=[[250,250,250],[196,220,236],[236,214,170],[226,236,226]][Math.floor(R()*4)];wc_part(ctx,wc_rect(bx,sy-bh,bw,bh),col,1,{lw:0.9});bx+=bw+6;}}
    wc_flat(ctx,wc_rect(x0+w0-14,cy+ch/2-18,6,36),OS_STEEL,1,"handle");}
  // the X-ray screen, lit, a film of a chest on it
  const [xx,xy,xw,xh]=O.xray;wc_part(ctx,wc_rect(xx-12,xy-12,xw+24,xh+24),[226,230,232],1,{lw:1.2});ctx.save();ctx.beginPath();ctx.rect(xx,xy,xw,xh);ctx.clip();
  ctx.fillStyle=rgba([226,240,248],1);ctx.fillRect(xx,xy,xw,xh);wc_flat(ctx,wc_rect(xx+20,xy+12,xw-40,xh-24),[64,74,88],1,"film");
  ctx.globalCompositeOperation="screen";for(const s of [-1,1]){wc_glowAt(ctx,xx+xw/2+s*36,xy+xh/2+4,48,[170,190,206],0.7);}
  ctx.strokeStyle=rgba([200,214,226],0.5);ctx.lineWidth=3;for(let i=0;i<5;i++)for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(xx+xw/2+s*8,xy+40+i*17);ctx.quadraticCurveTo(xx+xw/2+s*50,xy+30+i*17,xx+xw/2+s*68,xy+52+i*17);ctx.stroke();}
  ctx.restore();
  // the clock: it matters when the antibiotic was given
  const [kx,ky]=O.clock;wc_wash(ctx,wc_ell(kx,ky,48,48,40),[244,244,240],{kind:"clock",lw:1.6,seed:12});ctx.save();ctx.strokeStyle=rgba(WC_INK,0.8);ctx.lineCap="round";
  for(let i=0;i<12;i++){const a=i/12*TAU;ctx.lineWidth=i%3?2:3.4;ctx.beginPath();ctx.moveTo(kx+Math.cos(a)*36,ky+Math.sin(a)*36);ctx.lineTo(kx+Math.cos(a)*42,ky+Math.sin(a)*42);ctx.stroke();}
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(kx+Math.cos(-2.2)*22,ky+Math.sin(-2.2)*22);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(kx+Math.cos(-0.6)*34,ky+Math.sin(-0.6)*34);ctx.stroke();ctx.restore();
  // the count board, where the sponges, needles and instruments are counted (its marks are drawn with the people: os_counts)
  const [bx,by,bw,bh]=O.count;wc_part(ctx,wc_rect(bx-10,by-10,bw+20,bh+20),OS_STEEL,1,{lw:1.2});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  ctx.save();ctx.strokeStyle=rgba([60,110,170],0.55);ctx.lineWidth=2.4;for(const k of [1,2]){ctx.beginPath();ctx.moveTo(bx+k*bw/3,by+16);ctx.lineTo(bx+k*bw/3,by+bh-14);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(bx+12,by+56);ctx.lineTo(bx+bw-12,by+56);ctx.stroke();ctx.restore();wc_part(ctx,wc_rect(bx+bw-70,by+bh+10,52,10),[60,110,170],1,{lw:0.8});
  // the door, its window and its push plate
  const [dx,dy,dw]=O.door;wc_wash(ctx,wc_rect(dx-14,dy-14,dw+28,F-dy+14),[226,232,232],{kind:"trim",lw:1.4});wc_wash(ctx,wc_rect(dx,dy,dw,F-dy),[176,198,204],{kind:"door",lw:1.6,seed:4});
  wc_flat(ctx,wc_rect(dx+dw/2-44,dy+60,88,120),[214,232,240],1,"window");wc_flat(ctx,wc_rect(dx+dw-46,dy+300,26,120),OS_STEEL,1,"plate");
  wc_flat(ctx,wc_rect(dx+18,F-110,dw-36,90),wc_dim([176,198,204],0.08),1,"kick");
  // the anaesthetic machine: its screen on an arm, the gauges, the breathing bag, drawers
  wc_contact(ctx,30,330,F+2,0.9,0.3);wc_part(ctx,wc_rect(44,420,250,F-420-16),[214,220,226],1,{lw:1.3});for(let i=0;i<3;i++)wc_part(ctx,wc_rect(64,640+i*62,210,52),[226,230,236],1,{lw:1});
  for(let i=0;i<3;i++)wc_wash(ctx,wc_ell(84+i*80,F-8,14,14,12),[70,74,84],{kind:"thing",lw:1});wc_part(ctx,wc_rect(36,404,266,22),[196,204,212],1);
  for(let i=0;i<4;i++){wc_flat(ctx,wc_rect(70+i*30,446,16,96),[236,244,248],1,"tube");wc_wash(ctx,wc_ell(78+i*30,520-i*16,7,7,10),[60,140,200],{kind:"thing",lw:0.8,flat:true});}
  for(let i=0;i<2;i++){wc_wash(ctx,wc_ell(222+i*46,476,20,20,18),[244,244,240],{kind:"clock",lw:1.2,seed:14+i});}
  wc_wash(ctx,wc_smooth([[300,560],[332,578],[340,640],[318,690],[296,650],[292,590]],6),[70,72,82],{kind:"thing",lw:1.2,seed:16});
  wc_part(ctx,wc_rect(150,330,16,80),OS_STEEL,1);wc_part(ctx,wc_rect(36,206,258,150),[60,64,78],1,{kind:"thing"});wc_flat(ctx,wc_rect(50,220,230,122),[22,34,40],1,"screen");
  ctx.save();ctx.lineWidth=3;ctx.lineJoin="round";for(const [y,c,amp] of [[252,[110,220,140],22],[292,[240,210,90],10],[324,[110,190,240],8]]){ctx.strokeStyle=rgba(c,0.9);ctx.beginPath();
    for(let x=0;x<=170;x+=4){const u=x%56,v=y+(u>20&&u<26?-amp:u>=26&&u<30?amp*0.4:0)+Math.sin(x/9)*1.5;if(x)ctx.lineTo(62+x,v);else ctx.moveTo(62+x,v);}ctx.stroke();}ctx.restore();
  // the drip stand: a bag of fluid at the top, its line down to the patient's hand
  wc_contact(ctx,O.pole-60,O.pole+60,F+2,0.9,0.28);for(const a of [-0.9,-0.3,0.3,0.9]){ctx.save();ctx.translate(O.pole,F-18);ctx.rotate(a);wc_flat(ctx,wc_rect(-4,0,6,62),OS_STEEL,1,"leg");ctx.restore();}
  wc_part(ctx,wc_rect(O.pole-5,236,10,F-254),OS_STEEL,1,{lw:1});wc_part(ctx,wc_rect(O.pole-42,232,84,8),OS_STEEL,1,{lw:0.8});
  const [gx,gy]=O.bag;wc_wash(ctx,wc_rrPts(gx-30,gy-46,60,92,14),[238,246,250],{kind:"thing",lw:1.2,seed:18});wc_flat(ctx,wc_rect(gx-24,gy-6,48,46),[214,234,244],1,"fluid");
  wc_flat(ctx,wc_rect(gx-14,gy-34,28,16),[250,250,250],1,"label");
  // the light over the table, on its arm from the ceiling; its glow
  const [lx,ly]=O.light;wc_part(ctx,wc_rect(lx+70,-20,16,96),OS_STEEL,1,{lw:1});wc_part(ctx,[[lx+70,62],[lx+86,72],[lx+16,ly-34],[lx,ly-44]],OS_STEEL,1,{lw:1});
  wc_wash(ctx,wc_ell(lx,ly,158,56,48),[232,236,240],{kind:"thing",lw:1.6,seed:20});wc_wash(ctx,wc_ell(lx,ly+10,128,38,40),[250,244,214],{kind:"thing",lw:1,seed:21,flat:true});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx,ly+14,240,[255,246,214],0.55);ctx.restore();wc_part(ctx,wc_rect(lx-10,ly+30,20,30),OS_STEEL,1,{lw:1});}

// the count board's marks: so many in each column, written as tallies
function os_counts(ctx,n,a){if(a<=0.01)return;const [bx,by,bw]=OS_OR.count;withA(ctx,a,()=>{["sponges","needles","instruments"].forEach((s,i)=>{const x=bx+i*bw/3+bw/6;
  wc_T(ctx,s,x,by+42,{w:600,size:20,align:"center",col:[60,110,170],deco:true});const k=n[i];ctx.save();ctx.strokeStyle=rgba([60,110,170],0.85);ctx.lineWidth=3;ctx.lineCap="round";
  for(let j=0;j<k;j++){const g=Math.floor(j/5),r=j%5,x0=x-36+g*0+(r<4?r*12:0),y0=by+76+g*44;ctx.beginPath();if(r<4){ctx.moveTo(x0,y0);ctx.lineTo(x0,y0+30);}else{ctx.moveTo(x-40,y0+26);ctx.lineTo(x+6,y0+4);}ctx.stroke();}ctx.restore();});});}

// what's in front of the people behind the table: the table and its column, the patient under the drape, the patient's arm on it with
// the band at the wrist and the drip's line to the hand, the pillow; the instrument trolley, its cloth, the instruments, the sponges
function os_orFront(ctx){ctx.drawImage(wc_kept("orFront",W,H,q=>{const O=OS_OR,[t0,t1,ty]=O.table,F=O.fy;
  wc_contact(q,840,1160,F+2,0.9,0.32);wc_part(q,wc_rect(930,ty+150,90,F-ty-160),[150,158,166],1,{lw:1.2});wc_part(q,[[836,F-14],[1114,F-14],[1100,F+4],[850,F+4]],[136,144,152],1,{lw:1.1});
  // the drape over the patient: high at the chest and the feet, falling over the table's edge in folds
  const top=[[t0+70,ty-30],[t0+150,ty-58],[t0+250,ty-76],[t0+380,ty-68],[t0+500,ty-50],[t0+630,ty-42],[t0+740,ty-56],[t0+800,ty-64],[t1-110,ty-52],[t1-50,ty-74],[t1-12,ty-66],[t1+14,ty-38]];
  const drape=[[t0+40,ty]].concat(top,[[t1+30,ty],[t1+42,ty+150],[t1-60,ty+164],[t0+600,ty+170],[t0+120,ty+164],[t0+20,ty+150]]);
  wc_wash(q,wc_smooth(drape,6),OS_DRAPE,{kind:"build",lw:1.6,seed:30});q.save();wc_tr(q,wc_smooth(drape,6));q.clip();q.strokeStyle=rgba(wc_dim(OS_DRAPE,0.3),0.35);q.lineWidth=3;q.lineCap="round";
  for(let x=t0+80;x<t1;x+=96){q.beginPath();q.moveTo(x,ty+6);q.quadraticCurveTo(x+18,ty+80,x+6,ty+160);q.stroke();}q.strokeStyle=rgba(wc_lit(OS_DRAPE,0.35),0.4);q.lineWidth=7;
  q.beginPath();q.moveTo(t0+100,ty-12);for(const [x,y] of top.slice(1))q.lineTo(x,y+12);q.stroke();q.restore();
  // the pillow, under the head (drawn after this, os_patientHead)
  wc_wash(q,wc_ell(O.wrist[0]-196,ty-24,76,26,30),[246,248,250],{kind:"thing",lw:1.3,seed:32});
  // the arm, lying on the drape, the band at the wrist, the hand; the drip's line comes down to the back of the hand
  const P=PEOPLE.os_patient,[wx,wy]=O.wrist;q.save();q.lineCap="round";q.strokeStyle=rgba(wc_dim(P.skin,0.35),0.5);q.lineWidth=30;q.beginPath();q.moveTo(t0+96,ty-34);q.quadraticCurveTo(wx-120,wy-8,wx,wy);q.stroke();
  q.strokeStyle=rgba(P.skin,1);q.lineWidth=26;q.stroke();wc_wash(q,wc_ell(wx+30,wy+2,24,15,20),P.skin,{kind:"thing",lw:1.1,seed:33});
  wc_wash(q,wc_rrPts(wx-16,wy-16,16,32,5),[250,250,252],{kind:"thing",lw:1.2,seed:34});q.fillStyle=rgba([96,140,190],0.9);q.fillRect(wx-13,wy-6,10,12);
  q.strokeStyle=rgba([210,226,236],0.95);q.lineWidth=3;q.beginPath();q.moveTo(O.bag[0],O.bag[1]+46);q.bezierCurveTo(O.bag[0]+6,O.port[1]-90,O.port[0]-4,O.port[1]-30,O.port[0],O.port[1]);
  q.quadraticCurveTo(O.port[0]+90,O.port[1]+64,wx+32,wy-6);q.stroke();q.fillStyle=rgba([226,232,236],1);q.fillRect(O.port[0]-5,O.port[1]-8,10,16);q.restore();
  // the trolley: four legs on wheels, a shelf, the cloth over its top; the instruments on a tray, the sponges in a stack, a bowl
  const [r0,r1,ry]=O.trolley;wc_contact(q,r0-10,r1+10,F+2,0.9,0.3);for(const x of [r0+16,r1-28])wc_part(q,wc_rect(x,ry+20,12,F-ry-34),OS_STEEL,1,{lw:1});
  for(const x of [r0+22,r1-22])wc_wash(q,wc_ell(x,F-8,12,12,12),[70,74,84],{kind:"thing",lw:1});wc_part(q,wc_rect(r0+8,F-150,r1-r0-16,12),OS_STEEL,1,{lw:1});
  wc_wash(q,[[r0-12,ry-6],[r1+12,ry-6],[r1+20,ry+64],[r0-20,ry+64]],OS_DRAPE,{kind:"build",lw:1.4,seed:36});
  wc_part(q,wc_rect(r0+30,ry-26,130,20),OS_STEEL,1,{lw:1});for(let i=0;i<5;i++){q.save();q.translate(r0+44+i*24,ry-26);q.rotate(-0.12+i*0.05);wc_flat(q,wc_rect(-3,-34,6,36),[150,160,170],1,"instrument");
    q.strokeStyle=rgba([140,150,160],1);q.lineWidth=2;q.beginPath();q.arc(-4,-40,6,0,TAU);q.arc(6,-40,6,0,TAU);q.stroke();q.restore();}
  for(let i=0;i<6;i++){wc_flat(q,wc_rect(r1-118+i*1.5,ry-14-i*7,74,8),[250,250,250],1,"sponge");q.fillStyle=rgba([70,120,200],0.8);q.fillRect(r1-108+i*1.5,ry-12-i*7,30,2.4);}
  wc_wash(q,[[r1-28,ry-30],[r1+8,ry-30],[r1+2,ry-8],[r1-22,ry-8]],OS_STEEL,{kind:"thing",lw:1.1,seed:38});
  // the light's glow on the drape
  q.save();q.globalCompositeOperation="screen";wc_glowAt(q,O.light[0],ty-30,420,[255,248,226],0.28);q.restore();}),0,0);}
// the patient's head on the pillow, turned towards us; awake (o.awake) or asleep
function os_patientHead(ctx,t,awake){const P=PEOPLE.os_patient,x=OS_OR.wrist[0]-200,y=OS_OR.table[2]-56,E=awake?EXPR.calm:{bi:0,bo:0,arch:-2,eye:0.05,smile:0.1,open:0,mw:15};
  outlined(ctx,cx=>{cx.rotate(-1.32);head(cx,P,E,Object.assign({},POSE.stand,{turn:0,look:0,gaze:[0.4,-0.3]}),awake?t:0.3);},x,y,0.8,P.edge,[-110,-120,110,110]);}

/* the theatre office down the corridor: a steel shelf of binders and manuals, and on it the guidelines the steps were written in */
const OS_GD={fy:880,shelf:{x:520,w:900,h:700,rows:[300,480,660]},key:[2,1]};
function os_paintGuides(ctx){const G=OS_GD,S=G.shelf,wall=[212,226,220];gv_wallFloor(ctx,wall,G.fy,{seed:27,vx:960,floor:[184,196,192]});gv_lightGlow(ctx,980,0,560);
  // a window onto the hospital's other wing, across the way: its pale wall and rows of windows
  const wx=90,wy=180,ww=300,wh=420,f=16;ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();wc_sky(ctx,wy+wh,9,{clouds:2,cx:wx+10,cw:ww-120,cy:wy+24,ch:wh*0.18});
  wc_part(ctx,wc_rect(wx-20,wy+150,ww+40,wh),[232,226,214],0.4);for(let r=0;r<4;r++)for(let c=0;c<4;c++)wc_flat(ctx,wc_rect(wx+14+c*74,wy+176+r*62,44,36),[150,176,196],0.4,"pane");
  ctx.restore();for(const r of [wc_rect(wx-f,wy-f,ww+2*f,f),wc_rect(wx-f,wy-f,f,wh+2*f),wc_rect(wx+ww,wy-f,f,wh+2*f),wc_rect(wx+ww/2-6,wy,12,wh),wc_rect(wx,wy+wh*0.42-6,ww,12)])
    wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});wc_wash(ctx,wc_rect(wx-30,wy+wh,ww+60,24),wc_dim(wall,0.1),{kind:"trim",lw:1.5});
  // the steel shelf: manuals on the top row, binders on the middle one, manuals again, and boxes of files at the bottom
  gv_bookcase(ctx,S.x,G.fy,S.w,S.h,S.rows.concat([G.fy-40]),{col:[178,188,194]});
  const R=wc_rng(19),cols=[[96,118,150],[80,120,128],[120,140,104],[132,136,150],[70,100,142],[110,140,160],[150,160,170]];
  S.rows.forEach((ry,j)=>{let bx=S.x+34,k=0;while(bx<S.x+S.w-70){const w=j===1?54:30+R()*26,h=j===1?150:120+R()*40;
    if(!(j===G.key[1]&&k===G.key[0]))j===1?gv_binder(ctx,bx,ry-h,w,h,cols[(k+j*3)%cols.length]):wc_part(ctx,wc_rect(bx,ry-h,w,h),cols[Math.floor(R()*cols.length)],1,{lw:1.2});
    bx+=w+(j===1?10:4);k++;}});
  for(let i=0;i<6;i++){const bx=S.x+40+i*140;wc_part(ctx,wc_rect(bx,G.fy-188,124,146),[214,200,172],1,{lw:1.2});wc_flat(ctx,wc_rect(bx+30,G.fy-160,64,34),WC_CARD,1,"label");}
  // a notice board, papers pinned to it
  gv_cork(ctx,1520,250,250,190);[[1546,272,70,92,-0.04],[1632,266,80,64,0.03],[1638,350,96,70,-0.02],[1540,384,70,40,0.05]].forEach(([x,y,w,h,r],i)=>{ctx.save();
    ctx.translate(x+w/2,y+h/2);ctx.rotate(r);wc_flat(ctx,wc_rect(-w/2,-h/2,w,h),i===1?[250,236,170]:WC_CARD,1,"paper");ctx.fillStyle=rgba(WC_MUTED,0.35);
    for(let k=0;k<Math.floor(h/16)-1;k++)ctx.fillRect(-w/2+10,-h/2+16+k*14,w-20-(k%2)*14,3);ctx.restore();gv_pin(ctx,x+w/2,y+8,GV.red,0.8);});
  gv_plant(ctx,1660,G.fy,0.9);}
// the binder of guidelines, pulled a little from the row (out, 0 to 1)
const OS_GDB={w:64,h:170,col:[176,62,56]};
function os_guideBinder(ctx,out){const G=OS_GD,S=G.shelf,x=S.x+34+G.key[0]*64,y=S.rows[1]-OS_GDB.h;ctx.save();ctx.translate(0,-10*out);
  gv_binder(ctx,x,y+8*out,OS_GDB.w,OS_GDB.h,OS_GDB.col);ctx.restore();}

/* eight cities on a map of the world: an atlas page, the sea washed blue, the land in sand and green; the pins are drawn every frame */
const OS_LON=lon=>(lon+170)*W/360,OS_LAT=lat=>540-lat*W/360;
const OS_CITY=[["Seattle",-122.33,47.61,1],["Toronto",-79.38,43.65,1],["London",-0.13,51.51,-1],["Amman",35.93,31.95,-1],["New Delhi",77.21,28.61,1],
  ["Ifakara",36.68,-8.13,1],["Manila",120.98,14.6,1],["Auckland",174.76,-36.85,-1]];
const OS_LAND=[
  // North America, with the Gulf of California, the Gulf of Mexico and Hudson Bay
  [[-168,65.5],[-166,68.8],[-162,70.2],[-156.5,71.3],[-151,70.6],[-145,70.1],[-141,69.7],[-135,69.4],[-128,70.2],[-120,69.3],[-114,68.4],[-106,68.6],[-98,67.8],[-94,69],
   [-88,68.5],[-82,66.6],[-86,64],[-93,62],[-94.5,59],[-92,57],[-85,55.2],[-82,52.5],[-79,54.6],[-77,60],[-78,62.3],[-73,62],[-69,59],[-64.5,60.3],[-61,57],[-57,54],
   [-56,51.5],[-60,50.2],[-66,49.2],[-64.5,48],[-61,45.7],[-66,44.5],[-70,43.5],[-70,41.7],[-74,40.5],[-76,38.5],[-75.5,35.3],[-81,31.5],[-80.1,26.8],[-80.4,25.2],
   [-82.7,27.8],[-84.3,30],[-89,30.2],[-90,29.2],[-94,29.6],[-97.4,27.8],[-97.7,24],[-97.2,21.5],[-96.1,19.1],[-94.5,18.2],[-91,18.7],[-90.4,21],[-87,21.5],
   [-87.5,18.5],[-88.3,16],[-84,15.9],[-83.3,15],[-83.5,12],[-83.8,10.9],[-82.6,9.6],[-79.5,9.6],[-77.4,8.7],[-78.3,7.8],[-80,7.4],[-82.9,8.2],[-85.7,9.9],
   [-85.7,11.2],[-87.7,13.2],[-91.4,13.9],[-94,16],[-96.5,15.7],[-100,16.9],[-105.6,20.4],[-105.5,22.5],[-109,26.3],[-112.2,29.3],[-114.7,31.7],[-113,29.5],
   [-111,26.5],[-109.9,22.9],[-112.2,24.8],[-114.2,28],[-116.7,31.9],[-118.5,34],[-120.6,34.6],[-122.5,37.8],[-124.2,40.4],[-124,46.2],[-124.6,48.4],[-123,49.2],
   [-127.5,50.8],[-130.5,54.5],[-134,58],[-139.5,59.8],[-146,60.9],[-151.5,59.2],[-154,57.5],[-158,57],[-162.5,55],[-163,54.8],[-158,58.6],[-162,59.9],
   [-165.5,62.5],[-164.5,63.2],[-161,64.5],[-166,65.5]],
  // Greenland, Baffin Island and the islands of the Canadian Arctic; Iceland
  [[-73,78.5],[-66,80.5],[-60,82],[-45,83],[-30,83.5],[-20,82],[-17,80],[-18,77],[-20,74],[-22,71],[-24,69.5],[-32,68],[-38,65.6],[-41,63],[-43.5,60],[-46,60.8],
   [-49.5,62],[-51,64],[-53,66.5],[-54,69.5],[-56,72.5],[-60,76],[-68,77.5]],
  [[-65,62],[-61.8,66.6],[-67,69.3],[-73,71.5],[-80,73.7],[-89,72.5],[-85,70],[-81,69],[-78,67],[-74,65.5],[-72,64]],
  [[-80,83],[-62,82.5],[-75,78],[-90,79]],[[-118,73],[-102,73],[-101,69],[-117,69]],[[-125,74],[-116,74],[-120,71.5]],
  [[-22.7,64],[-24,65.5],[-22,66.4],[-16,66.5],[-13.6,65.1],[-15,64.3],[-18.7,63.4]],
  // Cuba and Hispaniola
  [[-85,21.8],[-81,23.1],[-77,22],[-74.2,20.2],[-77.7,19.9],[-80,21.8]],[[-74.4,19.8],[-68.4,19],[-68.9,18.2],[-71.8,17.6],[-74.4,18.5]],
  // South America
  [[-77.4,8.7],[-75.5,10.5],[-71.5,12.4],[-67,10.6],[-62,10.7],[-60,8.3],[-57.2,6],[-52,4.5],[-50,1.8],[-48.5,-1.3],[-44,-2.5],[-41,-2.9],[-38.5,-3.7],[-35.2,-5.8],
   [-34.9,-8],[-37,-11],[-38.5,-13],[-39.1,-17.6],[-40.9,-22],[-43.2,-22.9],[-48.5,-26.2],[-48.7,-28.5],[-50.8,-31],[-53.4,-33.8],[-55,-34.9],[-58.4,-34.6],
   [-57.4,-36.3],[-57.6,-38.2],[-62.3,-38.8],[-62.2,-40.7],[-65,-41],[-64,-42.4],[-65.3,-44.6],[-67.5,-46.4],[-65.8,-47.8],[-68.2,-50.1],[-69,-51.6],[-68.6,-52.6],
   [-66.5,-55],[-70.5,-55.2],[-74.5,-52.5],[-75.5,-48],[-74,-44],[-73.5,-41.5],[-73.6,-37],[-71.7,-33],[-71.4,-30],[-70.3,-23.6],[-70.3,-18.5],[-76.2,-14],
   [-77.2,-12],[-79.6,-7.2],[-81.3,-4.7],[-80.3,-2.3],[-80,0],[-78.9,1.6],[-77.3,3.8],[-77.6,6.6]],
  // Europe and Asia, with the Baltic, the Persian Gulf and the Bay of Bengal
  [[-9.5,38.7],[-9.3,43.1],[-8,43.7],[-1.8,43.4],[-1.2,46.2],[-4.6,48.4],[-1.6,49.7],[0.2,49.6],[1.6,50.9],[4,51.5],[5.9,53.4],[8.6,53.9],[8.6,55.5],[8.2,56.8],
   [10.6,57.7],[10.3,56.2],[10.9,54.4],[14,54],[18.5,54.7],[21,55.6],[21,56.8],[23.5,57.4],[24.2,58.5],[23.5,59.3],[28,59.6],[30,59.9],[25,60.2],[22,60.4],
   [21.5,61.5],[22.5,63.5],[25.5,65.6],[22,65.8],[21.3,64.5],[17.5,62.5],[18.9,59.3],[16.5,57],[14.3,55.5],[12.9,55.6],[11.8,57.7],[11.2,59],[10.5,59.9],[8,58.1],
   [5.6,58.9],[5,60.5],[5.2,62.5],[8.5,63.5],[11,64.8],[13.5,67],[15.5,68.5],[18,69.7],[22,70.5],[26,71],[28.5,70.9],[31,70.3],[33,69.4],[40,67.8],[44,68.5],
   [53,68.5],[60,69.8],[68,68.4],[70,73],[77,72.4],[80,73.5],[87,74.5],[100,76.5],[112,73.6],[127,73.5],[140,72.5],[150,71.5],[160,70],[170,69.8],[180,68.9],
   [190.3,66],[180,65],[178,64.5],[177,62.5],[170,60],[163.5,59.9],[163,58],[162,56],[160,53],[156.7,51],[156,53],[155.5,57],[152,59],[143,59.4],[140.7,58],
   [137,54.5],[141,53],[140.5,48.5],[135,43.5],[132,42.8],[129.4,42.4],[129.5,36],[127,34.5],[126.2,37.5],[124.7,39.7],[121.6,40.9],[121.6,39],[117.8,39],
   [118.5,38],[120.7,36.5],[122.6,37.4],[120,35],[121.9,31.7],[122,29.8],[119.6,25.4],[116.5,23],[113.5,22.2],[110.5,20.3],[108,21.6],[106.6,20.5],[105.9,19],
   [108.8,15.3],[109.2,11.6],[106.8,10.4],[104.8,8.6],[105,10.3],[102.5,12.2],[100.9,13.4],[99.9,12.5],[99.2,10],[100.3,7],[102.2,6.2],[103.4,4.5],[104.3,1.4],
   [101.4,2.8],[100.3,5],[98.3,8.1],[98.5,12],[97.6,16.5],[94.5,16],[94.2,19.5],[92.3,20.7],[91.8,22.4],[90.5,22],[88.5,21.7],[86.9,20.8],[85,19.3],[82.3,16.6],
   [80.3,13.1],[79.8,10.3],[77.5,8.1],[76.3,9.9],[74.8,12.9],[73,17.5],[72.8,19],[72.6,21.4],[70,22.6],[69,22.4],[68.4,23.6],[66.8,25],[61.6,25.2],[57.3,25.9],
   [56.3,27.2],[54,26.6],[51.4,27.9],[50,30.1],[48,30],[48.9,27.6],[50.2,26.2],[51.6,25.9],[54,24.2],[56.3,24.9],[56.6,24.5],[59.8,22.4],[58.5,20.5],[57,18.9],
   [55.2,17.3],[52,16],[48.7,14],[45,12.8],[43.5,12.7],[42.8,15.5],[40,19.8],[38.8,21.7],[36.6,25.9],[35,28],[34.95,29.5],[34.3,31.3],[35,32.8],[35.6,34.5],
   [36.2,35.8],[36,36.6],[32.5,36.1],[30.5,36.6],[28.2,36.7],[26.5,38.4],[26.2,39.5],[23.5,40.2],[22.9,37.5],[22.5,36.4],[21.1,37.7],[19.9,39.9],[19.4,41.8],
   [18,42.7],[15.3,44.1],[13.6,45.6],[12.3,45.3],[12.4,44.2],[13.7,43.4],[16,41.5],[18.5,40.2],[17.2,39],[16.5,38.4],[15.6,38],[16.1,39.3],[15.6,40.1],[14.2,40.8],
   [12.5,41.7],[10.5,43],[8.9,44.4],[7.5,43.8],[5,43.3],[3.1,42.9],[3.2,41.9],[0.9,41],[-0.3,39.5],[0.2,38.8],[-0.7,37.6],[-2.1,36.7],[-5.4,36.1],[-6.3,36.5],
   [-7.4,37.2],[-8.9,37],[-8.8,38.5]],
  // Great Britain and Ireland
  [[-5.7,50.1],[-3.5,50.3],[1.3,51.1],[1.7,52.6],[0.2,53.4],[-0.1,54.1],[-1.2,54.6],[-1.6,55.6],[-2.1,57.1],[-1.8,57.6],[-3,58.6],[-5,58.6],[-5.7,57.8],[-5.8,56.5],
   [-5.2,55.4],[-4.9,54.8],[-3.4,54.9],[-3,54.1],[-3.1,53.4],[-4.6,53.3],[-4.2,52.4],[-5.3,51.7],[-4,51.6],[-3.2,51.4],[-2.7,51.5],[-4.2,51.2],[-4.7,50.6]],
  [[-6,52.2],[-6.1,53.4],[-6.2,54.6],[-7.3,55.4],[-8.5,55],[-10,54.2],[-10.2,53.4],[-9.4,52.6],[-10.4,51.9],[-9.8,51.5],[-8.4,51.7]],
  // Africa (with Sinai) and Madagascar
  [[34.95,29.5],[34.25,27.75],[32.55,29.95],[33.9,27],[35.5,23.9],[37.2,21],[37.2,19.6],[38.8,17.6],[39.5,15.5],[41.7,13.7],[43.2,11.6],[44.5,10.4],[51.2,11.8],
   [51,10.4],[49,6.3],[46,2],[45.3,2],[42,-0.8],[40.2,-2.8],[39.7,-4.1],[39.3,-6.8],[40.4,-10.5],[40.6,-15],[37.6,-17.4],[35,-20],[35.5,-23.8],[32.9,-26],
   [32.4,-28.8],[30.9,-29.9],[28,-32.9],[25.6,-34],[22,-34.2],[20,-34.8],[18.4,-34.2],[18.1,-32.5],[16.5,-28.6],[15.2,-27],[14.5,-22.9],[12,-18],[13.4,-12.6],
   [13.2,-8.8],[12.2,-6],[11.8,-4.8],[9.3,-1],[9.4,0.4],[9.7,4],[8.5,4.6],[6,4.3],[3.4,6.4],[1.2,6.1],[-0.2,5.6],[-3,5.1],[-7.5,4.4],[-10.8,6.3],[-13.2,8.5],
   [-15,10.9],[-16.7,12.4],[-17.5,14.7],[-16.5,16.5],[-16,18.1],[-17,21],[-15,24],[-12.9,27.9],[-9.8,29.7],[-9.2,32.3],[-6.8,34],[-5.9,35.8],[-2,35.1],[1.5,36.6],
   [3,36.8],[8.6,36.9],[10.2,37.2],[11.1,36.9],[10.6,35.8],[10.2,34.3],[11.1,33.2],[13.2,32.9],[15.4,31.3],[18.5,30.4],[20,30.9],[20.1,32.1],[22.6,32.8],[25.1,31.6],
   [29.9,31.2],[32.3,31.3],[34.2,31.3]],
  [[49.3,-12],[50.4,-15.5],[49.6,-17.5],[48.3,-21.5],[47.1,-25],[45.1,-25.5],[43.7,-23.5],[44,-20],[44.4,-16.2],[46.3,-15.7],[48.2,-13.4]],
  // Japan, Taiwan, Hainan, Sri Lanka, Sakhalin; the Philippines; Indonesia and New Guinea
  [[130.9,34],[132.5,35.4],[135.7,35.8],[136.8,37.3],[139.5,38.2],[140,40.6],[141.4,41.4],[141.6,40.3],[142,39.3],[141,37.9],[140.9,36.9],[140.6,35.5],[139.8,35],
   [138.8,34.6],[137,34.6],[135.8,33.5],[135.1,33.9],[134.6,34.7],[132.4,34.3]],
  [[129.9,33.4],[130.9,33.9],[131.9,33.2],[131.4,31.4],[130.3,31.2],[130.2,32.7]],[[132.5,33.2],[134.1,33.3],[134.7,33.8],[133.5,34.4],[132.7,33.9]],
  [[140,41.4],[141.2,41.8],[143.3,42],[145.6,43.3],[144.5,44],[141.9,45.4],[141.6,43.5],[140.4,43.3],[139.9,42.5]],[[142,46],[143.5,49],[143,54],[142,53],[141.8,49]],
  [[120.1,23],[121.9,25],[121.6,22.9],[120.8,21.9]],[[108.6,19.2],[110.5,20.1],[111,19.6],[109.6,18.2]],[[79.8,6.2],[80,9.7],[81.9,7.5],[80.5,5.9]],
  [[120.6,18.5],[122.3,18.4],[122,16],[121.6,15.7],[122.4,14.1],[124,13],[123.7,12.6],[122.5,13.4],[121.6,13.9],[120.6,13.9],[120.6,14.4],[120.2,14.8],[120,15.5],[119.8,16.4],[120.4,16.6]],
  [[122,7],[123.3,7.5],[125.4,9.8],[126.6,7.2],[125.4,5.6],[124.1,6.4]],[[124.3,12.5],[125.7,11.2],[125,10.1],[124.3,11.3]],[[122,11.8],[123.2,10.5],[122.9,9.1],[122.2,10.5]],
  [[117.2,8.4],[119.6,11.3],[119.2,10.6],[117.6,8.1]],
  [[95.3,5.6],[97.5,5.2],[100.4,2.3],[104.1,-1.1],[106,-3],[105.8,-5.8],[104.5,-5.8],[102.3,-4],[100.4,-1],[98.7,1.7]],
  [[105.2,-6.8],[106.8,-6.1],[110.4,-6.9],[112.7,-7.2],[114.4,-7.8],[114.6,-8.7],[111,-8.2],[108.3,-7.8],[105.4,-6.9]],
  [[109.6,1.9],[111.2,2.6],[113,3.2],[115.5,5.2],[116.8,6.9],[119.2,5.2],[118,4.4],[118.5,1],[117.5,0.1],[116.6,-2.1],[116.2,-4],[114.6,-3.9],[111.8,-3.4],[110.2,-2.9],[109.1,-0.4]],
  [[118.8,-2.8],[119.4,-5.5],[120.4,-5.4],[120.9,-3],[122.4,-4.8],[121.3,-1.9],[123.3,-1],[121.3,-0.9],[120.2,0.5],[124.9,1.6],[124.7,0.6],[120.2,0],[119.6,-0.6]],
  [[131,-1.4],[134.2,-0.9],[135.1,-3.4],[137.9,-1.5],[141,-2.6],[145.8,-4.9],[147.6,-6.4],[147.9,-8],[150.2,-10.5],[147.1,-9.5],[146,-8.1],[144.2,-7.7],[143,-9.2],
   [141,-9.1],[138.9,-8.1],[137.7,-5.3],[134,-4],[132.9,-4.1],[131.3,-3.4]],
  // Australia, Tasmania, New Zealand
  [[113.4,-22],[114.1,-26],[115,-29.5],[115.7,-31.8],[115.1,-33.6],[116,-35],[118,-35],[121.9,-33.9],[124,-33],[126,-32.3],[131.2,-31.5],[134.2,-32.8],[135.4,-34.6],
   [137.5,-33],[138.6,-34.9],[139.7,-37.2],[140.8,-38],[143.5,-38.8],[144.9,-37.8],[146.4,-39.1],[148,-37.8],[150,-37.5],[150.6,-35.5],[151.2,-33.9],[152.7,-31.7],
   [153.6,-28.6],[153.1,-27.4],[152.9,-25.3],[150.8,-22.7],[149.4,-21],[146.8,-19.3],[145.5,-16.9],[145.3,-15],[143.5,-14],[142.5,-10.7],[141.6,-12.7],[141.6,-16.8],
   [140.5,-17.6],[139,-17],[136.8,-15.8],[135.9,-14.3],[136.8,-12.3],[136.2,-12],[132.5,-11.6],[130.8,-12.4],[129.4,-14.8],[127.8,-14.2],[125.4,-15.2],[122.2,-17.9],
   [121,-19.5],[118.8,-20.3],[116.7,-20.6],[114.6,-21.8]],
  [[144.7,-40.7],[148.3,-40.9],[148.2,-42.2],[147,-43.6],[145.3,-42.2]],
  [[172.7,-34.5],[174.3,-35.2],[174.8,-36.8],[175.9,-37.1],[178.5,-37.7],[177.9,-39.1],[176.8,-40],[175.2,-41.6],[174.8,-41.3],[175,-39.9],[174,-39.3],[174.6,-38.2],[174.2,-36.5],[173,-35.2]],
  [[172.7,-40.5],[174.3,-41.4],[173.4,-42.8],[172.8,-43.8],[171.2,-44.4],[170.6,-45.9],[169,-46.6],[166.5,-46],[166.8,-45.1],[168.3,-44],[170.5,-42.8],[171.5,-41.7],[172.1,-40.8]],
  // Svalbard and Novaya Zemlya
  [[15,79],[25,80],[22,77.5],[16,77]],[[52,71],[55,73],[60,76],[68,77],[60,74],[56,71]]];
// the seas inside the land: the Black Sea, the Caspian and the Great Lakes
const OS_SEAS=[[[28,41.6],[28.6,43.4],[30,45.8],[31.5,46.6],[33.5,46],[33.4,44.6],[36.6,45.3],[38.2,47.1],[39.8,47],[38,44.5],[41.5,42.6],[41.6,41.5],[36.5,41.3],[33,42],[29.2,41.2]],
  [[47.5,45.5],[46.8,44.5],[47.5,43],[48.5,41],[49.5,38.5],[51,37],[53.9,37.2],[53.2,40],[52.9,42],[51.5,45.2],[53,46.8],[49.5,46.6]],
  [[-92,46.7],[-89,48.3],[-85,48.5],[-84.6,46.5],[-88,47]],[[-87.8,42],[-86.5,42],[-85.5,45.8],[-87.5,45.8]],[[-84.5,45.8],[-81,46],[-80,44.5],[-82.5,43]],
  [[-83.4,41.7],[-79,42.9],[-79.6,42.4],[-82.7,41.4]],[[-79.8,43.3],[-76.2,43.5],[-76.5,44.2],[-79.4,43.7]]];
const os_ll=pts=>pts.map(([lo,la])=>[OS_LON(lo),OS_LAT(la)]);
function os_paintMap(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const sea=[190,214,228],land=[222,206,160];
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),sea,{kind:"sea",line:false,seed:41});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(sea,0.3),0.3);ctx.lineWidth=1.6;for(let lo=-150;lo<=180;lo+=30){ctx.beginPath();ctx.moveTo(OS_LON(lo),0);ctx.lineTo(OS_LON(lo),H);ctx.stroke();}
  for(let la=-60;la<=80;la+=30){ctx.beginPath();ctx.moveTo(0,OS_LAT(la));ctx.lineTo(W,OS_LAT(la));ctx.stroke();}ctx.restore();
  OS_LAND.forEach((p,i)=>wc_wash(ctx,os_ll(p),i%3?land:wc_lit([196,206,150],0.1),{kind:"build",lw:1.3,seed:50+i}));
  OS_SEAS.forEach((p,i)=>wc_wash(ctx,wc_smooth(os_ll(p),4),sea,{kind:"thing",lw:1,seed:90+i,flat:true}));}
// a city's pin and its name (a, 0 to 1, as it drops in; bare, the pin alone)
function os_cityPin(ctx,i,a,bare){if(a<=0.01)return;const [s,lo,la,side]=OS_CITY[i],x=OS_LON(lo),y=OS_LAT(la),k=spring(clamp(a,0,1));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);gv_pin(ctx,0,-6,GV.red,1.3);ctx.restore();
  if(!bare)withA(ctx,clamp(a*2-0.6,0,1),()=>wc_tag(ctx,x+side*22,y-30,s,{align:side<0?"right":"left",size:28}));}

/* the checklist, close: the page on its clipboard, on the steel of a side table; what's written on it is drawn every frame (os_page) */
const OS_PG2={x:250,y:110,w:1420,h:780,col:[60,440,820],row:[360,480,600]};
function os_paintClip(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[196,204,210],{kind:"steel",line:false,seed:61});
  ctx.save();ctx.globalCompositeOperation="screen";for(const [x,y,r] of [[300,180,520],[1600,820,600]])wc_glowAt(ctx,x,y,r,[255,255,255],0.35);ctx.restore();
  wc_wash(ctx,[[-40,780],[260,860],[420,1120],[-40,1120]],OS_DRAPE,{kind:"build",lw:1.4,seed:62});
  const P=OS_PG2;ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,40,60,0.35)";ctx.fillRect(P.x-30,P.y+10,P.w+80,P.h+60);ctx.restore();
  wc_wash(ctx,wc_rrPts(P.x-40,P.y-40,P.w+80,P.h+90,22),[176,128,84],{kind:"thing",lw:1.6,seed:63});wc_flat(ctx,wc_rect(P.x,P.y,P.w,P.h),[252,250,244],1,"page");
  wc_wash(ctx,wc_rrPts(W/2-170,P.y-70,340,96,16),OS_STEEL,{kind:"thing",lw:1.4,seed:64});wc_flat(ctx,wc_rect(W/2-120,P.y-30,240,16),wc_dim(OS_STEEL,0.12),1,"spring");
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=2;for(const k of [1,2]){const x=P.x+P.col[k]-30;ctx.beginPath();ctx.moveTo(x,P.y+170);ctx.lineTo(x,P.y+P.h-40);ctx.stroke();}ctx.restore();}
// the page: its title, the three pauses and their items, a box for each; ticks (a list of how far each box is ticked, 0 to 1), a halo
const OS_STEPS=[["Sign in","before anaesthesia",["Patient confirmed","Site marked","Allergies known"]],["Time out","before the first cut",["Team introduced","Patient and site","Antibiotic given"]],
  ["Sign out","before leaving the room",["Sponges counted","Specimens labelled","Concerns for recovery"]]];
function os_boxAt(c,r){const P=OS_PG2;return[P.x+P.col[c]+18,P.y+P.row[r]-10];}
function os_page(ctx,ticks,o){o=o||{};const P=OS_PG2;wc_T(ctx,"Surgical Safety Checklist",W/2,P.y+84,{w:800,size:52,align:"center",col:WC_DARK});
  OS_STEPS.forEach(([h,sub,items],c)=>{const x=P.x+P.col[c];gv_tint(ctx,x-30,P.y+140,400,P.h-180,GV.gold,o.lit===c?0.42*(o.litA==null?1:o.litA):0);
    wc_T(ctx,h,x,P.y+200,{w:800,size:44,col:WC_DARK});wc_T(ctx,sub,x,P.y+246,{w:500,size:28,col:WC_MUTED});
    items.forEach((s,r)=>{const [bx,by]=os_boxAt(c,r),k=c*3+r;if(o.halo===k)gv_tint(ctx,bx-34,by-36,404,72,GV.gold,0.7*(o.haloA==null?1:o.haloA));
      ctx.save();ctx.strokeStyle=rgba(WC_INK,0.8);ctx.lineWidth=3;ctx.strokeRect(bx-18,by-18,36,36);ctx.restore();wc_T(ctx,s,bx+36,by+12,{w:600,size:32,col:WC_INK});
      const p=ticks[k]||0;if(p>0)wc_tick(ctx,bx+4,by-4,44,[36,120,80],p,5);});});}

/* ---------- today: Yusuf's first day, and what he inherits ---------- */
// a cardboard box of his things, the first day, a plant and a mug in it; kept, about 280 x 250, the box's middle at (140,170)
function os_boxC(){return wc_kept("box",280,250,q=>{
  for(const [a,l,c] of [[-0.5,92,[96,150,84]],[-0.15,104,[120,168,96]],[0.25,96,[104,156,88]],[-0.85,70,[132,176,104]],[0.6,74,[96,150,84]]]){q.save();q.translate(92,112);q.rotate(a);
    wc_wash(q,[[0,0],[-15,-l*0.45],[0,-l],[15,-l*0.45]],c,{kind:"thing",lw:1.1,seed:Math.round(l)});q.restore();}
  wc_wash(q,wc_rect(168,70,52,52),[226,232,238],{kind:"thing",lw:1.3,seed:5});wc_wash(q,wc_ell(222,94,11,15,14),[226,232,238],{kind:"thing",lw:1.3,seed:6});
  wc_wash(q,[[24,104],[256,104],[250,240],[30,240]],[204,168,118],{kind:"cover",lw:1.5,seed:7});
  wc_flat(q,[[30,104],[250,104],[248,124],[32,124]],[176,140,94],1,"flap");wc_flat(q,wc_rect(124,124,32,114),[226,206,160],1,"tape");
  wc_wash(q,wc_rrPts(110,150,60,16,8),[120,92,60],{kind:"thing",line:false,flat:true});});}
// held in both hands, in the figure's units, the hands at its sides
function os_heldBox(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.drawImage(os_boxC(),mx-140,my-130);fingers(cx,P_,[[mx-112,my+40],[mx+112,my+40]]);}

// the shelf's 34 binders, standing on its two middle shelves, numbered 1 to 34 along each row from the left; missing() leaves one
// out (binder 12 is in Yusuf's hands), out(i) slides one forward (0 to 1), glow(i) lights one: its label gold, a warm light round it
const OS_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]};
const os_bindCol=i=>OS_BIND.cols[Math.floor(hash(i,17)*OS_BIND.cols.length)];
function os_bindPos(i){const B=OS_BIND,row=i<17?0:1;return[B.x+(i%17)*B.gap,GV_OFF.shelf.rows[1+row]];}
function os_binders(ctx,o){o=o||{};const B=OS_BIND;for(let i=0;i<34;i++){if(o.missing&&o.missing(i))continue;const [x,y]=os_bindPos(i),u=o.out?o.out(i):0,g=o.glow?o.glow(i):0,bw=B.w+u*6;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,bw,B.h,os_bindCol(i));
  if(g>0.01){ctx.fillStyle=rgba(GV.gold,0.95*g);ctx.fillRect(x-u*3+bw*0.18,y-B.h*0.9,bw*0.64,B.h*0.26);
    ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+B.w/2,y-B.h*0.55,70,[255,206,110],0.5*g);}
  ctx.restore();}}

// the framed score on the office wall: the maturity assessment's result, 2.1 of 5, as a bar of five
function os_score(ctx,a){const [x,y,w,h]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}}

// the chart of who's responsible for what, pinned to the board: four things, and for each, the one responsible, the one
// accountable, who's consulted and who's informed; half the names are "TBC", written in by hand (tbc(k), 0 to 1, for the k-th)
const OS_RACI={things:["census report","award term","government submission","data access"],cols:["responsible","accountable","consulted","informed"],
  names:[["Clara",0,"Jun",0],["Mei",0,0,"Jun"],[0,0,"Clara","Mei"],["Sam",0,0,"Jun"]]};
// the cells with no name, in the order they're filled in
const OS_TBC=[];OS_RACI.names.forEach((r,i)=>r.forEach((n,j)=>{if(!n)OS_TBC.push([i,j]);}));
const OS_CH={x:300,y:96,w:1320,h:700,c0:420,cw:205,head:212,row:116};
function os_cellAt(i,j){const C=OS_CH;return[C.x+40+C.c0+j*C.cw+C.cw/2,C.y+C.head+56+i*C.row];}
function os_chart(ctx,tbc,o){o=o||{};const C=OS_CH;gv_sheet(ctx,C.x,C.y,C.w,C.h);[[C.x+40,C.y+22],[C.x+C.w-40,C.y+22]].forEach(([px,py])=>gv_pin(ctx,px,py,GV.red,1.4));
  wc_T(ctx,"Who's responsible for what",C.x+40,C.y+96,{w:800,size:44,col:WC_DARK});
  const gx=C.x+40,gw=C.c0+4*C.cw;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2;
  for(let i=0;i<=4;i++){const y=C.y+C.head+i*C.row;ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+gw,y);ctx.stroke();}
  for(let j=0;j<4;j++){const x=gx+C.c0+j*C.cw;ctx.beginPath();ctx.moveTo(x,C.y+C.head-60);ctx.lineTo(x,C.y+C.head+4*C.row);ctx.stroke();}ctx.restore();
  if(o.light!=null)gv_tint(ctx,gx,C.y+C.head+o.light*C.row,gw,C.row,GV.gold,o.lightA||0);
  OS_RACI.cols.forEach((s,j)=>wc_T(ctx,s,gx+C.c0+j*C.cw+C.cw/2,C.y+C.head-20,{w:700,size:28,align:"center",col:WC_MUTED}));
  OS_RACI.things.forEach((s,i)=>wc_T(ctx,s,gx+8,C.y+C.head+i*C.row+68,{w:700,size:30,col:WC_DARK}));
  OS_RACI.names.forEach((r,i)=>r.forEach((n,j)=>{if(n){const [cx,cy]=os_cellAt(i,j);wc_T(ctx,n,cx,cy+12,{w:600,size:32,align:"center",col:WC_INK});}}));
  OS_TBC.forEach(([i,j],k)=>{const p=tbc(k);if(p<=0||(o.hide&&o.hide[0]===i&&o.hide[1]===j))return;const [cx,cy]=os_cellAt(i,j);wc_hand(ctx,"TBC",cx-42,cy+14,{size:40,col:GV.redInk,p});});}
// the same chart, small on the office's board: lines for the words, a red mark for each TBC once they're there
function os_chartSmall(ctx,tbc){const [bx,by]=GV_OFF.board,x=bx+40,y=by+50,w=330,h=190;gv_sheet(ctx,x,y,w,h);gv_pin(ctx,x+16,y+10,GV.red,0.8);gv_pin(ctx,x+w-16,y+10,GV.red,0.8);
  gv_lines(ctx,x+18,y+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(x+14,y+56+i*30);ctx.lineTo(x+w-14,y+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,x+20,y+68+i*30,70,1,0,0.8);OS_RACI.names[i].forEach((n,j)=>{const cx=x+128+j*48;if(n)gv_lines(ctx,cx,y+68+i*30,32,1,0,0.8);else if(tbc>0){ctx.fillStyle=rgba(GV.redInk,0.8*tbc);ctx.fillRect(cx,y+64+i*30,30,9);}});}}

// the council's minutes on the desk: this month's on top, the months before under it; the action that is carried forward each time
const OS_MIN={x:620,y:248,w:680,h:840};
function os_minutes(ctx,stamp){const M=OS_MIN;
  [["July",-0.07,-46,-150],["August",-0.035,-22,-76]].forEach(([m,r,dx,dy],k)=>{gv_sheet(ctx,M.x+dx,M.y+dy,M.w,M.h,{rot:r});ctx.save();ctx.translate(M.x+dx+M.w/2,M.y+dy+M.h/2);ctx.rotate(r);
    wc_T(ctx,"Minutes · "+m,-M.w/2+44,-M.h/2+52,{w:700,size:30,col:WC_INK});ctx.restore();});
  gv_sheet(ctx,M.x,M.y,M.w,M.h,{rot:0.01});
  wc_T(ctx,"Data council",M.x+44,M.y+70,{w:800,size:40,col:WC_DARK});wc_T(ctx,"Minutes · September",M.x+44,M.y+118,{w:600,size:30,col:WC_MUTED});
  gv_lines(ctx,M.x+44,M.y+170,M.w-110,4,30);
  wc_panel(ctx,M.x+30,M.y+302,M.w-60,104,{kind:"card",wash:GV.gold,washA:0.25,seed:5});wc_T(ctx,"Action: name the data owners",M.x+56,M.y+366,{w:800,size:34,col:WC_DARK});
  gv_stamp(ctx,M.x+M.w/2,M.y+500,"CARRIED FORWARD",stamp,{size:40,rot:-0.07});gv_lines(ctx,M.x+44,M.y+590,M.w-110,3,30,0.8);}

/* ---------- today: the two reports ---------- */
const OS_NUM=[40,96,150];
// a number that springs in, n from 0 to 1
function os_numIn(ctx,s,x,y,size,n,col){if(n<=0)return;const k=0.7+0.3*spring(n);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(n*2,0,1),()=>wc_T(ctx,s,0,0,{w:800,size,align:"center",col:col||OS_NUM}));ctx.restore();}
// Planning's census report on its wall screen: this year's awards, by month, and the total, n
function os_census(ctx,n){const [x,y,w,h]=GV_PL.screen;gv_screen(ctx,x,y,w,h,"Census report",q=>{wc_T(q,"awards conferred this year",x+34,y+100,{w:600,size:30,col:WC_MUTED});
  for(let i=0;i<6;i++){const bh=50+150*hash(i,41);q.fillStyle=rgba(i===5?GV.gold:[150,186,222],1);q.fillRect(x+44+i*50,y+h-34-bh,36,bh);}
  os_numIn(q,"4,812",x+w*0.74,y+h*0.7,104,n);},{titleSize:30,barH:46});}
// the registrar's draft submission, held in both hands at her chest (in the figure's units), the total n
const os_draft=n=>(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+46);cx.rotate(-0.04);
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-94,-118,200,250);cx.fillStyle="#fffdf6";cx.fillRect(-100,-125,200,250);cx.fillStyle=rgba([84,120,170],1);cx.fillRect(-100,-125,200,92);
  wc_T(cx,"Draft",0,-88,{w:800,size:34,align:"center",col:[255,255,255]});wc_T(cx,"submission",0,-48,{w:800,size:31,align:"center",col:[255,255,255]});
  os_numIn(cx,"4,867",0,40,70,n);wc_T(cx,"awards",0,100,{w:700,size:34,align:"center",col:WC_MUTED});cx.restore();
  fingers(cx,P_,[[mx-98,my+62],[mx+98,my+56]]);};

/* ---------- today: who decides? ---------- */
// the two reports' cards on the data team's board, close: what each is, when it ran, its number; a green tick once it's found right.
// Monday's card, gold, goes between them.
const OS_RC={census:[290,330,470,300],draft:[1160,330,470,300],monday:[830,372,260,226]};
function os_reportCard(ctx,[x,y,w,h],name,ran,num,tick){wc_panel(ctx,x,y,w,h,{kind:"card",seed:x|0});gv_pin(ctx,x+w/2,y+14,GV.red,1.3);
  wc_T(ctx,name,x+w/2,y+80,{w:800,size:38,align:"center",col:WC_DARK});wc_T(ctx,ran,x+w/2,y+130,{w:600,size:30,align:"center",col:WC_MUTED});
  wc_T(ctx,num,x+w/2,y+238,{w:800,size:76,align:"center",col:OS_NUM});wc_tick(ctx,x+w-60,y+176,74,GV.green,tick,9);}
function os_mondayCard(ctx){const [x,y,w,h]=OS_RC.monday;wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.35,seed:9});gv_pin(ctx,x+w/2,y+14,GV.red,1.3);
  wc_T(ctx,"Monday",x+w/2,y+84,{w:800,size:40,align:"center",col:WC_DARK});wc_T(ctx,"award",x+w/2,y+140,{w:700,size:34,align:"center",col:GV.goldInk});
  wc_T(ctx,"changed",x+w/2,y+188,{w:600,size:32,align:"center",col:WC_INK});}
// the glossary's term on Jun's screen, close: what counts as an award; the row added on Monday lights (row), with a gold chip (chip)
function os_glossary(ctx,row,chip){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Glossary",q=>{
  wc_T(q,"award",x+56,y+146,{w:800,size:64,col:WC_DARK});wc_T(q,"what counts:",x+56,y+222,{w:600,size:34,col:WC_MUTED});
  ["graduate certificates","masters and doctorates"].forEach((s,i)=>wc_T(q,"·  "+s,x+76,y+300+i*66,{w:600,size:38,col:WC_INK}));
  if(row>0){gv_tint(q,x+40,y+392,w-80,72,GV.gold,0.75*row);withA(q,row,()=>wc_T(q,"·  microcredentials, 6 credit points or more",x+76,y+442,{w:700,size:38,col:WC_DARK}));}
  if(chip>0){q.save();q.translate(x+w-250,y+130);const k=0.85+0.15*spring(chip);q.scale(k,k);withA(q,clamp(chip*2,0,1),()=>wc_badge(q,-110,0,"changed Monday",{size:32}));q.restore();}},
  {titleSize:32,barH:54});}
// on the registrar's desk: the government's reporting manual, standing, and the university's own term on a tent card
const OS_RD={manual:[770,416,180,248],tent:[1100,548,240,116]};
function os_manual(ctx){const [x,y,w,h]=OS_RD.manual;ctx.drawImage(wc_kept("manual",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,w,h),[70,92,140],{kind:"cover",lw:1.6,seed:3});
    wc_flat(q,wc_rect(0,h*0.55,w,18),[214,186,110],1,"band");wc_wash(q,wc_ell(w/2,h*0.78,22,22,24),[214,186,110],{kind:"thing",lw:1.2,seed:4});}),x-20,y-20);
  wc_T(ctx,"Reporting",x+w/2,y+58,{w:800,size:28,align:"center",col:[255,255,255]});wc_T(ctx,"manual",x+w/2,y+92,{w:800,size:28,align:"center",col:[255,255,255]});
  wc_T(ctx,"awards",x+w/2,y+124,{w:600,size:26,align:"center",col:[226,232,244]});}
function os_tent(ctx){const [x,y,w,h]=OS_RD.tent;ctx.drawImage(wc_kept("tent",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,[[10,0],[w-10,0],[w,h],[0,h]],WC_CARD,{kind:"paper",lw:1.4,seed:5});}),x-20,y-20);
  wc_T(ctx,"award",x+w/2,y+52,{w:800,size:34,align:"center",col:WC_DARK});wc_T(ctx,"our term",x+w/2,y+92,{w:600,size:28,align:"center",col:WC_MUTED});}
// a gold arc drawn from one thing to another (p, 0 to 1), with a head at its end
function os_arc(ctx,x0,y0,x1,y1,lift,p){if(p<=0)return;const cx=(x0+x1)/2,cy=Math.min(y0,y1)-lift,n=40,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>[(1-u)*(1-u)*x0+2*(1-u)*u*cx+u*u*x1,(1-u)*(1-u)*y0+2*(1-u)*u*cy+u*u*y1];
  ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.85);ctx.lineWidth=6;ctx.lineCap="round";ctx.setLineDash([14,12]);ctx.beginPath();for(let i=0;i<=m;i++){const [a,b]=pt(i/n);i?ctx.lineTo(a,b):ctx.moveTo(a,b);}ctx.stroke();ctx.restore();
  return pt(0.5);}

/* ---------- today: what governance is for ---------- */
// binder 12, open on the desk, from above: the cover open flat round the pages, the rings down the middle, the back of the page before
// on the left, policy 12 on the right
const OS_OPEN={x:230,y:110,w:1460,h:830,mid:960,pw:660,rings:[280,525,770]};
function os_open12(ctx,o){const B=OS_OPEN,top=B.y+26,ph=B.h-52,L=B.mid-46-B.pw,R=B.mid+46;ctx.drawImage(wc_kept("open12",W,H,q=>{const col=os_bindCol(11);
    q.save();q.filter="blur(16px)";q.fillStyle="rgba(70,50,30,0.32)";q.fillRect(B.x+16,B.y+24,B.w,B.h);q.restore();
    wc_wash(q,wc_rrPts(B.x,B.y,B.w,B.h,18),col,{kind:"cover",lw:1.6,seed:12});wc_flat(q,wc_rect(B.mid-40,B.y+8,80,B.h-16),wc_dim(col,0.22),1,"spine");
    // each side: the pages under the top one, their edges showing; the top page, and the holes the rings go through
    for(const px of [L,R]){const s=px<B.mid?-1:1;for(let k=3;k>=1;k--)wc_flat(q,wc_rect(px+s*k*3,top+k*3,B.pw,ph),wc_dim(GV.paper,0.05*k),1,"pages");
      wc_wash(q,wc_rect(px,top,B.pw,ph),GV.paper,{kind:"page",lw:1.3,seed:px|0});
      for(const ry of B.rings)wc_wash(q,wc_ell(B.mid+s*80,ry,11,11,16),wc_dim(col,0.1),{kind:"thing",line:false,flat:true});}
    // the back of the page before, its lines showing through faintly
    gv_lines(q,L+70,top+110,B.pw-170,13,50,0.3);
    // the rings' mechanism down the middle, and the three rings through the pages
    wc_wash(q,wc_rrPts(B.mid-26,B.rings[0]-60,52,B.rings[2]-B.rings[0]+120,14),GV.metal,{kind:"thing",lw:1.4,seed:13});
    for(const ry of B.rings){q.save();q.strokeStyle=rgba(wc_dim(GV.metal,0.28),1);q.lineWidth=10;q.beginPath();q.ellipse(B.mid,ry,80,17,0,0,TAU);q.stroke();
      q.strokeStyle="rgba(255,255,255,0.65)";q.lineWidth=3;q.beginPath();q.ellipse(B.mid,ry-3,76,13,0,Math.PI*1.15,Math.PI*1.85);q.stroke();q.restore();}}),0,0);
  // policy 12, on the right-hand page; o.text fades it while the cover still lies over it
  const x=R+64;withA(ctx,o&&o.text!=null?o.text:1,()=>{wc_T(ctx,"Data policies",x,top+80,{w:600,size:28,col:WC_MUTED,deco:1});wc_T(ctx,"Policy 12",x,top+184,{w:800,size:66,col:WC_DARK});
  wc_T(ctx,"Data definitions",x,top+244,{w:600,size:36,col:WC_MUTED});
  ["Business terms are","defined consistently","across the organisation."].forEach((s,i)=>wc_T(ctx,s,x,top+350+i*58,{w:600,size:42,col:WC_INK}));
  gv_lines(ctx,x,top+560,B.pw-150,4,40);});}
// a sticky note, pale red, pressed on at an angle as land goes from 0 to 1; then its words written in red pencil as write does
const OS_STICK=[250,214,208];
function os_sticky(ctx,cx,cy,w,h,rot,lines,size,land,write){if(land<=0)return;const k=lerp(1.2,1,easeCam(clamp(land,0,1)));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);withA(ctx,clamp(land*2.5,0,1),()=>{
    ctx.drawImage(wc_kept("sticky|"+w+"x"+h,w+60,h+60,q=>{q.translate(30,30);q.save();q.filter="blur(8px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(8,14,w,h);q.restore();
      wc_wash(q,wc_rect(0,0,w,h),OS_STICK,{kind:"page",lw:1.2,seed:w});wc_flat(q,wc_rect(0,0,w,h*0.15),wc_dim(OS_STICK,0.07),1,"glue");}),-w/2-30,-h/2-30);
    // the words in the middle of the space under the glue strip, written one letter after another, line by line
    const n=lines.join("").length,y0=-h/2+h*0.15+(h*0.85-lines.length*size*1.2)/2+size*0.92;let before=0;
    lines.forEach((s,i)=>{const p=clamp((write*n-before)/s.length,0,1);before+=s.length;wc_hand(ctx,s,-w/2+40,y0+i*size*1.2,{size,w:700,col:GV.redInk,p});});});
  ctx.restore();}
// a decision, on a small gold card: a pin, typed lines, and a line added under them by hand in pencil, written left to right (amend, 0
// to 1); and a green tick once someone has checked it's kept (tick, 0 to 1)
function os_decision(ctx,x,y,k,tick,amend){ctx.save();ctx.translate(x,y);ctx.scale(k,k);wc_panel(ctx,-76,-56,152,112,{kind:"card",wash:GV.gold,washA:0.5,seed:7});
  gv_lines(ctx,-50,-14,100,3,22,0.9);gv_pin(ctx,0,-42,GV.red,0.9);
  if(amend>0){const n=Math.max(1,Math.round(30*clamp(amend,0,1)));ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    for(let i=0;i<=n;i++){const u=i/30,px=-50+84*u,py=44+2.4*Math.sin(u*29)+1.2*Math.sin(u*71);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
  ctx.restore();if(tick>0)wc_tick(ctx,x+58,y+30,62,GV.green,tick,9);}

/* ---------- today: listen first ---------- */
// a fresh page for a thirty-fifth policy, on the desk from above: its heading and nothing else; th (0 to π) turns it over, unwritten,
// lifting it a little as it goes
const OS_P35={x:960,y:500,w:620,h:800};
function os_page35(ctx,th){const P=OS_P35,c=Math.cos(th),lift=Math.sin(clamp(th,0,Math.PI)),k=1+0.05*lift;
  ctx.save();ctx.translate(P.x+30*lift,P.y-20*lift);ctx.scale(Math.max(0.03,Math.abs(c))*k,k);
  gv_sheet(ctx,-P.w/2,-P.h/2,P.w,P.h,c<0?{col:wc_dim(GV.paper,0.035)}:{});
  if(c>0){const x=-P.w/2+60,y=-P.h/2;wc_T(ctx,"Data policies",x,y+92,{w:600,size:28,col:WC_MUTED,deco:1});wc_T(ctx,"Policy 35",x,y+190,{w:800,size:66,col:WC_DARK});}
  ctx.restore();}
// what Yusuf heard, on index cards in his hand, pinned over the chart in the board's close-up: his question on top, then who said
// what slows them down (u, 0 to 1, pins each one)
const OS_ANS=[["Jun",["rules arrive","after the build"]],["Mei",["never sees where","the words go"]],["Sam",["no one says","which column"]],
  ["Planning",["which number","to trust?"]]];
const OS_ANSC={w:330,h:262,x:[440,790,1140,1490],y:570,rot:[-0.03,0.02,-0.012,0.028]};
function os_asked(ctx,y){ctx.save();ctx.translate(960,y||254);ctx.rotate(-0.012);wc_panel(ctx,-330,-66,660,132,{kind:"card",seed:61});gv_pin(ctx,0,-52,GV.red,1.2);
  wc_hand(ctx,"What slows you down?",0,22,{size:50,w:700,align:"center",col:WC_INK});ctx.restore();}
function os_ansCard(ctx,k,u,y){if(u<=0)return;const A=OS_ANSC,[name,lines]=OS_ANS[k],s=lerp(1.12,1,easeCam(clamp(u,0,1)));
  ctx.save();ctx.translate(A.x[k],(y||A.y)-14*(1-easeCam(clamp(u,0,1))));ctx.rotate(A.rot[k]);ctx.scale(s,s);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-A.w/2,-A.h/2,A.w,A.h,{kind:"card",seed:70+k});gv_pin(ctx,0,-A.h/2+18,GV.red,1.1);
    wc_hand(ctx,name,-A.w/2+30,-A.h/2+92,{size:42,w:800,col:WC_DARK});lines.forEach((l,i)=>wc_hand(ctx,l,-A.w/2+30,-A.h/2+156+i*48,{size:34,w:600,col:WC_INK}));});
  ctx.restore();}
// the same cards, small, on the office's board below the chart: paper and a line or two each
function os_ansSmall(ctx){const [bx,by]=GV_OFF.board;for(let k=0;k<4;k++){const x=bx+28+k*92,y=by+290;ctx.save();ctx.translate(x+40,y+42);ctx.rotate(OS_ANSC.rot[k]);
  wc_panel(ctx,-40,-42,80,84,{kind:"card",seed:80+k});gv_lines(ctx,-26,-6,52,3,14,0.9);gv_pin(ctx,0,-34,GV.red,0.6);ctx.restore();}
  ctx.save();ctx.translate(bx+205,by+266);ctx.rotate(-0.012);wc_panel(ctx,-90,-18,180,36,{kind:"card",seed:79});gv_lines(ctx,-70,-2,140,1,0,0.9);ctx.restore();}
// the data team's board, in the room: the two reports' cards and Monday's between them, small, as they were left
function os_dataBoard(ctx){const [bx,by]=GV_DT.board;[[bx+8,by+42,160,124,0],[bx+178,by+66,80,92,1],[bx+268,by+42,160,124,0]].forEach(([x,y,w,h,mon],k)=>{
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:mon?GV.gold:null,washA:0.35,seed:90+k});gv_pin(ctx,x+w/2,y+10,GV.red,0.7);
  if(mon)gv_lines(ctx,x+16,y+36,w-32,3,16,0.9);else{gv_lines(ctx,x+18,y+34,w-60,2,14,0.9);ctx.fillStyle=rgba(OS_NUM,0.75);ctx.fillRect(x+34,y+82,w-68,14);wc_tick(ctx,x+w-26,y+64,30,GV.green,1,4);}});}
// Jun's screen, close: the rules on award, in words. The first is the rule Mei and Jun agreed on Monday: it's checked (run, 0 to 1), it
// holds (pass), and the agreement behind it lights gold (gold); the second can't be checked, as there's no agreed rule yet (row2).
// Each badge ends a set way in from the screen's right edge.
function os_rules(ctx,run,pass,gold,row2){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Rules on award",q=>{const r1=y+262,r2=y+486,cx=x+96,
    bx=s=>x+w-56-Math.round(tw(q,s,30,700)+28);
  if(gold>0)gv_tint(q,x+28,r1-86,w-56,160,GV.gold,0.7*gold);
  // the first rule: a ring while it's checked, a green tick once it holds
  if(pass>0)wc_tick(q,cx,r1-20,58,GV.green,pass,9);
  else{q.save();q.lineWidth=6;q.lineCap="round";q.strokeStyle=rgba(WC_MUTED,0.35);q.beginPath();q.arc(cx,r1-20,24,0,TAU);q.stroke();
    if(run>0){const a=run*TAU*1.6;q.strokeStyle=rgba(GV.cyanInk,0.9);q.beginPath();q.arc(cx,r1-20,24,a-1.8,a);q.stroke();}q.restore();}
  wc_T(q,"award counts microcredentials",x+160,r1-30,{w:700,size:38,col:WC_DARK});wc_T(q,"of 6 credit points or more",x+160,r1+22,{w:600,size:38,col:WC_INK});
  if(pass>0)withA(q,clamp(pass*2,0,1),()=>wc_badge(q,bx("checked every night"),r1-22,"checked every night",{size:30,role:GV.green}));
  // the second: no rule yet, only the question, dashed
  if(row2>0)withA(q,row2,()=>{q.save();q.lineWidth=5;q.setLineDash([9,9]);q.strokeStyle=rgba(WC_MUTED,0.7);q.beginPath();q.arc(cx,r2-20,24,0,TAU);q.stroke();q.restore();
    wc_T(q,"award mapped to the",x+160,r2-30,{w:700,size:38,col:WC_MUTED});wc_T(q,"government's definition",x+160,r2+22,{w:600,size:38,col:WC_MUTED});
    wc_badge(q,bx("no agreed rule yet"),r2-22,"no agreed rule yet",{size:30,role:GV.red});});},{titleSize:32,barH:54});}

/* ---------- today: where does it run? ---------- */
// binder 12 opening on the desk, from above (u, 0 to 1): its cover lies over the right-hand page, then swings over the rings to the left
function os_cover12(ctx,deco){const B=OS_OPEN;ctx.drawImage(wc_kept("cover12",W,H,q=>{const col=os_bindCol(11),x=B.mid-40,w=B.x+B.w-x;
    wc_wash(q,wc_rrPts(x,B.y,w,B.h,18),col,{kind:"cover",lw:1.6,seed:24});wc_flat(q,wc_rect(x,B.y+8,54,B.h-16),wc_dim(col,0.2),1,"spine");
    wc_wash(q,wc_rect(x+w/2-130,B.y+250,300,190),WC_CARD,{kind:"page",lw:1.3,seed:25});}),0,0);
  const cx=B.mid-40+(B.x+B.w-B.mid+40)/2+20;wc_T(ctx,"12",cx,B.y+352,{w:800,size:84,align:"center",col:WC_DARK,deco:deco?1:0});
  wc_T(ctx,"Data definitions",cx,B.y+414,{w:600,size:30,align:"center",col:WC_MUTED,deco:deco?1:0});}
function os_opening12(ctx,u){const B=OS_OPEN;if(u>=1)return os_open12(ctx);
  const c=Math.cos(Math.PI*clamp(u,0,1));ctx.save();ctx.beginPath();ctx.rect(B.mid-46,0,W,H);ctx.clip();os_open12(ctx,{text:c>0?clamp((0.82-c)/0.67,0,1):1});ctx.restore();
  ctx.save();ctx.translate(B.mid,0);ctx.scale(Math.max(0.02,Math.abs(c)),1);ctx.translate(-B.mid,0);
  if(c>0)os_cover12(ctx,c<0.9);else{ctx.beginPath();ctx.rect(0,0,B.mid-46,H);ctx.clip();os_open12(ctx,{text:0});}ctx.restore();}
// a highlighter lying on the desk, from above: a pale body, the cap and the felt tip in its colour; kept per colour
function os_marker(ctx,x,y,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(wc_kept("marker|"+col,300,100,q=>{
    q.save();q.filter="blur(5px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(30,46,236,30);q.restore();
    wc_wash(q,wc_rrPts(26,30,196,42,14),mix(col,[255,255,255],0.6),{kind:"thing",lw:1.3,seed:col[0]});
    wc_wash(q,wc_rrPts(204,27,70,48,12),col,{kind:"thing",lw:1.3,seed:col[1]});wc_wash(q,[[28,40],[8,46],[8,56],[28,62]],wc_dim(col,0.1),{kind:"thing",lw:1.1,seed:col[2]});}),-150,-50);
  ctx.restore();}
// policy 12's page, close, as he goes through it line by line: the paper filling the frame, the holes for the rings down the left
function os_paintPolicy(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.paper,{kind:"paper",line:false,seed:93});
  for(const y of [170,540,910])wc_wash(ctx,wc_ell(96,y,24,24,24),wc_dim(GV.oak,0.08),{kind:"thing",lw:1.3,seed:y});
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(255,250,236,0)");g.addColorStop(1,"rgba(150,130,100,0.1)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
// what policy 12 says, line by line; where each line runs (0: in the work, green; 1: a decision someone owns, gold; 2: it can go, grey),
// and what Yusuf writes beside it
const OS_LINES=[["12.1","Each term has a named owner."],["12.2","Each term used in a report is in the glossary."],["12.3","Reports count by the glossary's definitions."],
  ["12.4","Terms about people are marked as personal data."],["12.5","Each term's owner decides its definition,","and how it maps to the government's."],
  ["12.6","Each decision is written down with the term."],["12.7","Staff take care to use terms correctly."]];
const OS_WHERE=[0,0,0,0,1,1,2],OS_NOTES=["a field no one can leave empty","checked every night","checked every night","a label","award: Mei decides",
  "in the glossary",null];
const OS_HIC=[GV.green,GV.gold,GV.grey],OS_HINK=[GV.greenInk,GV.goldInk,GV.greyInk],OS_KEY=["runs in the work","a decision someone owns","can go"];
const OS_PG={x:300,tx:384,y0:290,dy:78,lh:44,size:34,note:1290};
// a highlighter's stroke behind a line of text, as long as the text, drawn from the left as p goes from 0 to 1; kept per colour.
// h: how tall it is (a line of the page, or a swatch in his key)
function os_hiStroke(ctx,x,y,w,col,p,seed,h=64){if(p<=0)return;const c=wc_kept("hiStroke|"+col+"|"+seed,1200,70,q=>wc_wash(q,wc_resample(wc_rect(8,10,1180,48),12),col,{kind:"swatch",line:false,a:0.5,seed}));
  const top=y-12-h/2;ctx.save();ctx.beginPath();ctx.rect(x-12,top-6,(w+24)*clamp(p,0,1),h+12);ctx.clip();ctx.globalCompositeOperation="multiply";ctx.drawImage(c,x-12,top,w+24,h);ctx.restore();}
// the page: its heading, the lines, a stroke behind each as it's sorted (hi(k), 0 to 1), Yusuf's note beside it (note(k)), his key at the
// top (key(j)), and the line that can go struck through (strike)
function os_policy(ctx,hi,note,key,strike){const P=OS_PG;wc_T(ctx,"Policy 12 · Data definitions",P.x,128,{w:800,size:50,col:WC_DARK});
  wc_T(ctx,"Business terms are defined consistently across the organisation.",P.x,188,{w:600,size:30,col:WC_MUTED});
  let y=P.y0;OS_LINES.forEach((L,k)=>{const rows=L.slice(1),c=OS_WHERE[k],u=hi(k),n=rows.length;
    rows.forEach((s,i)=>os_hiStroke(ctx,P.tx,y+i*P.lh,tw(ctx,s,P.size,600),OS_HIC[c],clamp(u*n-i,0,1),40+k*3+i));
    wc_T(ctx,L[0],P.x,y,{w:700,size:P.size,col:WC_MUTED});rows.forEach((s,i)=>wc_T(ctx,s,P.tx,y+i*P.lh,{w:600,size:P.size,col:c===2&&strike>0.5?WC_MUTED:WC_INK}));
    if(c===2&&strike>0){const w=tw(ctx,rows[0],P.size,600)*easeCam(clamp(strike,0,1));ctx.save();ctx.strokeStyle=rgba(GV.greyInk,0.9);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(P.tx-8,y-11);ctx.quadraticCurveTo(P.tx+w/2,y-15,P.tx-8+w+16,y-10);ctx.stroke();ctx.restore();}
    if(OS_NOTES[k])wc_hand(ctx,OS_NOTES[k],P.note,y+(n-1)*P.lh/2,{size:36,w:700,col:OS_HINK[c],p:note(k)});y+=P.dy+(n-1)*P.lh;});
  // the key: a stroke of each colour, and what it means, in his hand
  OS_KEY.forEach((s,j)=>{const u=key(j);if(u<=0)return;const ky=84+j*44;os_hiStroke(ctx,P.note,ky,44,OS_HIC[j],clamp(u*2,0,1),70+j,34);
    wc_hand(ctx,s,P.note+70,ky,{size:30,w:700,col:OS_HINK[j],p:clamp(u*2-0.6,0,1)});});}

/* ---------- today: what's worth keeping ---------- */
// a warm light coming up on something (a, 0 to 1), as on the shelf when he listened
function os_warm(ctx,cx,cy,r,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="soft-light";wc_glowAt(ctx,cx,cy+50,r*1.1,[255,190,90],0.9*a);
  ctx.globalCompositeOperation="screen";wc_glowAt(ctx,cx,cy,r,[255,222,160],0.42*a);ctx.restore();}
// a stack of gold index cards, held in both hands (in the figure's units, like the series' heldPins)
function os_heldGold(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+6);
  for(let i=3;i>=0;i--){cx.save();cx.translate(i*4-6,-i*6);cx.rotate(-0.05+i*0.03);cx.fillStyle="rgba(70,50,30,0.18)";rr(cx,-58,-36,124,80,6);cx.fill();
    cx.fillStyle=rgba(mix(GV.gold,[255,255,255],0.45),1);rr(cx,-62,-42,124,80,6);cx.fill();cx.strokeStyle=rgba(wc_dim(GV.gold,0.45),0.75);cx.lineWidth=2;cx.stroke();cx.restore();}
  cx.fillStyle=rgba(wc_dim(GV.gold,0.5),0.55);for(let i=0;i<3;i++)cx.fillRect(-44,-24+i*15,i===2?46:80,4);cx.restore();
  fingers(cx,P_,[[mx-62,my+14],[mx+62,my+10]]);}
// what's worth keeping, under each answer on Yusuf's board, so that what slows each one down stops: its name on a gold card, and a sign
// in pencil. The board makes room for them: his question goes higher (ask), the answers under it (ans), the gold cards under those (y).
const OS_KEEP=[["Rules, each","with an owner"],["One glossary"],["Classes of","personal data"],["Who owns","what"]];
const OS_KB={ask:150,ans:394,y:684,w:330,h:206,rot:[0.02,-0.014,0.018,-0.022]};
// the signs: a list ticked off, and its owner; a book; a label in the plum of personal data; a chart with someone in each row
function os_keepSign(ctx,k,x,y){ctx.save();ctx.translate(x,y);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.lineCap="round";
  const ink=rgba(WC_PENCIL,0.85),fill=rgba(wc_lit(GV.gold,0.55),1),paper=rgba(WC_CARD,1);
  const box=(bx,by,bw,bh,f)=>{rr(ctx,bx,by,bw,bh,3);ctx.fillStyle=f||paper;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();};
  const head=(hx,hy,r)=>{ctx.beginPath();ctx.arc(hx,hy,r,0,TAU);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();
    ctx.beginPath();ctx.arc(hx,hy+r*2.5,r*1.5,Math.PI*1.15,Math.PI*1.85);ctx.stroke();};
  const line=(x0,x1,ly)=>{ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.strokeStyle=ink;ctx.stroke();};
  if(k===0){for(let i=0;i<3;i++){box(0,i*17,12,12);line(20,i===2?58:72,i*17+6);}
    ctx.beginPath();for(let i=0;i<3;i++){ctx.moveTo(2,i*17+6);ctx.lineTo(5,i*17+10);ctx.lineTo(11,i*17+1);}ctx.strokeStyle=rgba(GV.greenInk,0.95);ctx.stroke();head(98,12,9);}
  else if(k===1){box(6,2,50,48,fill);ctx.fillStyle=rgba(wc_dim(GV.gold,0.35),1);ctx.fillRect(7,3,8,46);box(24,12,24,12);line(24,48,34);line(24,42,41);}
  else if(k===2){ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(16,-2);ctx.lineTo(70,-2);ctx.lineTo(70,36);ctx.lineTo(16,36);ctx.closePath();ctx.fillStyle=rgba(GV_CLASS.direct,1);ctx.fill();
    ctx.strokeStyle=rgba(GV_CLASSINK.direct,1);ctx.stroke();ctx.beginPath();ctx.arc(16,17,4.5,0,TAU);ctx.fillStyle=paper;ctx.fill();
    ctx.beginPath();ctx.moveTo(12,17);ctx.quadraticCurveTo(-4,30,6,48);ctx.strokeStyle=ink;ctx.stroke();}
  else{box(0,0,104,50);line(0,17,17);line(0,34,34);line(56,0,0);ctx.beginPath();ctx.moveTo(56,0);ctx.lineTo(56,50);ctx.stroke();
    for(let i=0;i<3;i++){line(8,44,i*17+9);ctx.beginPath();ctx.arc(80,i*17+8.5,4.5,0,TAU);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();}}
  ctx.restore();}
function os_keepCard(ctx,k,u){if(u<=0)return;const K=OS_KB,lines=OS_KEEP[k],e=easeCam(clamp(u,0,1)),s=lerp(1.12,1,e),w=K.w,h=K.h;
  ctx.save();ctx.translate(OS_ANSC.x[k],K.y-14*(1-e));ctx.rotate(K.rot[k]);ctx.scale(s,s);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:GV.gold,washA:0.5,seed:150+k});gv_pin(ctx,0,-h/2+18,GV.red,1.1);os_keepSign(ctx,k,-w/2+32,-h/2+46);
    lines.forEach((l,i)=>wc_T(ctx,l,-w/2+32,-h/2+(lines.length>1?142:164)+i*44,{w:800,size:34,col:WC_DARK}));});ctx.restore();}
// a pencil arrow from answer k down to where its gold card goes, drawn as p goes from 0 to 1
function os_keepArrow(ctx,k,p){if(p<=0)return;const K=OS_KB,x=OS_ANSC.x[k],y0=K.ans+OS_ANSC.h/2+10,y1=K.y-K.h/2-6,y=lerp(y0,y1,easeCam(clamp(p,0,1)));
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y);
  if(p>0.8){const d=13*clamp((p-0.8)/0.2,0,1);ctx.moveTo(x-d,y-d);ctx.lineTo(x,y);ctx.lineTo(x+d,y-d);}ctx.stroke();ctx.restore();}
// the gold cards, small, on the office's board, over the foot of each small answer (the first n)
function os_keepSmall(ctx,n){const [bx,by]=GV_OFF.board;for(let k=0;k<(n==null?4:n);k++){ctx.save();ctx.translate(bx+68+k*92,by+364);ctx.rotate(OS_KB.rot[k]);
  wc_panel(ctx,-36,-19,72,38,{kind:"card",wash:GV.gold,washA:0.5,seed:160+k});gv_lines(ctx,-24,-5,48,2,12,0.9);ctx.restore();}}

/* ---------- today: the films to come ---------- */
// which of the shelf's binders stand for the nine films on what governance needs; he takes the first
const OS_NINE=[1,5,8,14,18,21,25,28,31];
// a binder held in both hands, its label saying what it's about (in the figure's units, like the series' heldBinder)
function os_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+16,-h/2+26,w-32,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,32);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+74+i*38-(lines.length-1)*6));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// the films on the tools, on the data team's board: a card each, with its number, the tools' logos and its title
const OS_TOOLS=[["Governed in dbt",["dbt"]],["Governed in Unity Catalog",["databricks"]],["Meaning on the platform",["databricks"]],
  ["Quality on the platform",["dbt","databricks"]],["Products in open formats",["databricks"]],["The marketplace",["databricks"]]];
const OS_TC={w:410,h:236,x:[505,960,1415],y:[440,712],rot:[-0.018,0.012,-0.008,0.016,-0.012,0.008]};
function os_toolsHead(ctx,u){if(u<=0)return;ctx.save();ctx.translate(960,192);ctx.rotate(0.01);withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,-250,-60,500,120,{kind:"card",seed:63});
  gv_pin(ctx,0,-46,GV.red,1.2);wc_hand(ctx,"With the tools",0,20,{size:52,w:700,align:"center",col:WC_INK,p:clamp(u*1.6-0.3,0,1)});});ctx.restore();}
// a title in up to two lines no wider than mw, the break at the last space that fits
function os_wrap(ctx,s,size,mw){if(tw(ctx,s,size,800)<=mw)return[s];const ws=s.split(" ");for(let i=ws.length-1;i>0;i--){const a=ws.slice(0,i).join(" ");
  if(tw(ctx,a,size,800)<=mw)return[a,ws.slice(i).join(" ")];}return[s];}
function os_toolCard(ctx,k,u){if(u<=0)return;const T=OS_TC,[s,tools]=OS_TOOLS[k],e=easeCam(clamp(u,0,1)),sc=lerp(1.12,1,e),w=T.w,h=T.h;
  ctx.save();ctx.translate(T.x[k%3],T.y[Math.floor(k/3)]-14*(1-e));ctx.rotate(T.rot[k]);ctx.scale(sc,sc);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:110+k});gv_pin(ctx,0,-h/2+18,GV.red,1.1);
    wc_wash(ctx,wc_ell(-w/2+56,-h/2+72,28,28,24),wc_lit(GV.cyanInk,0.25),{kind:"thing",lw:1.2,seed:120+k});
    wc_T(ctx,String(k+14),-w/2+56,-h/2+83,{w:800,size:28,align:"center",col:[255,255,255]});
    let lx=-w/2+104;tools.forEach(id=>{lx+=logo(ctx,id,lx,-h/2+48,48)+18;});
    os_wrap(ctx,s,36,w-64).forEach((l,i,a)=>wc_T(ctx,l,-w/2+32,-h/2+(a.length>1?160:178)+i*46,{w:800,size:36,col:WC_DARK}));});ctx.restore();}
// the films that draw governance as one model, on Noor's architecture map, close: a card each, pinned in the free part of the layer it
// adds to (strategy, business, application), with its number in gold and its title
const OS_MAPF=[[1,"A capability, not a project"],[2,"Who does what, end to end"],[4,"Where each piece lives"]],OS_MROT=[0.008,-0.01,0.012];
function os_mapCard(ctx,k,u){if(u<=0)return;const [i,s]=OS_MAPF[k],[x,y,w,h]=GV_MC,[fx,fy,fw,fh]=gv_mapFree(x,y,w,h,i),e=easeCam(clamp(u,0,1)),sc=lerp(1.12,1,e),
    cw=fw-44,ch=Math.min(fh-18,98);
  ctx.save();ctx.translate(fx+fw/2,fy+fh/2-10*(1-e));ctx.rotate(OS_MROT[k]);ctx.scale(sc,sc);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-cw/2,-ch/2,cw,ch,{kind:"card",seed:170+k});gv_pin(ctx,0,-ch/2+14,GV.red,1);
    wc_wash(ctx,wc_ell(-cw/2+48,4,27,27,24),wc_lit(GV.goldInk,0.1),{kind:"thing",lw:1.2,seed:180+k});
    wc_T(ctx,String(k+11),-cw/2+48,15,{w:800,size:28,align:"center",col:[255,255,255]});wc_T(ctx,s,-cw/2+94,16,{w:800,size:34,col:WC_DARK});});ctx.restore();}

const WC_PLACES={theatre:os_paintTheatre,guides:os_paintGuides,worldmap:os_paintMap,clip:os_paintClip,campus:gv_paintCampus,office:gv_paintOffice,
  boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),desk:gv_paintDesk,floor:gv_paintFloor,planning:gv_paintPlanning,registrar:gv_paintRegistrar,data:gv_paintData,
  boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),screen:c=>gv_paintScreenDesk(c,GV_ROOM.data),platform:gv_paintPlatform,policy:os_paintPolicy,
  noor:gv_paintNoor,mapClose:gv_paintMapClose};
