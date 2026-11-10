/* ===== Measures that matter: New York, 1952 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix mm_). Nothing here is a likeness of a real person or a copy of a photograph: the delivery room and the clothes are drawn
   plainly, from what is known of the time (glazed tiles to head height, a round lamp over the mother's table, a cloth screen on a
   steel frame, a white enamel cot on legs, a wall clock with a sweep second hand; a white coat, a doctor's white jacket, a nurse's
   starched cap), in this film's own style, with no hospital's name, sign or crest.
     mmDelivery   the delivery room in morning light: the tiles, the lamp over the mother's table, the cloth screen round it, the clock
                  on the wall (its hands are drawn live: mm_clock)
     mmHall       the hospital's corridor wall, painted to the rail, in the same light: the numbers of the time are pinned there
     mm_clock     the clock's hands at the chapter's time t, so the second hand sweeps on through every shot of the room
     mm_cot       the cot on its legs and the baby in it, swaddled: o.blue (0 to 1: a baby who isn't breathing well, its colour going
                  grey-blue), o.card (0 to 1: a small card with its score clipped to the cot's end, o.score its number, o.col its colour)
     mm_card      the score card: five signs, each 0, 1 or 2, sixty seconds after birth (o.u: the signs come in; o.cols: the points;
                  o.marks: one baby's points; o.total: their sum; o.light, o.a, o.k)
     MM_PEOPLE    Dr Virginia Apgar, a nurse, a junior doctor and an obstetrician: dressed for their time, never likenesses
   Colour keeps the module's meaning: the score, a design anyone in the room can use, in blue; a baby doing well, and what got better,
   in green; a baby in trouble, the deaths and the guesswork in amber; the numbers of the time in orange; the room wears none of the five. */

const MM_K={tile:[226,230,222],grout:[172,176,166],trim:[200,204,194],steel:[160,164,168],steelDk:[98,102,108],cloth:[238,238,230],
  enamel:[238,240,236],flannel:[246,242,234],skin:[236,190,170],skinBlue:[172,178,198],hair:[96,72,58],dado:[206,198,178],plaster:[230,224,208]};
const MM_FLOOR=936,MM_TILE={top:560,bot:914,size:44};

/* ---------------------------------------------------------------- the delivery room */
// the room's light over a part of the wall painted after lp_paintRoom (so it shares the plaster's shade, warmth and vignette)
function mm_relight(c,x,y,w,h){const L=LP_LIGHT.morning;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,L.shade));g.addColorStop(0.42,rgba(LP.shade,L.shade*0.33));g.addColorStop(1,rgba(LP.shade,L.shade*0.07));c.fillStyle=g;c.fillRect(x,y,w,h);
  g=c.createLinearGradient(0,0,0,MM_FLOOR);g.addColorStop(0,rgba(LP.shade,0.16));g.addColorStop(0.3,rgba(LP.shade,0));g.addColorStop(0.8,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.shade,0.14));c.fillStyle=g;c.fillRect(x,y,w,h);
  if(L.cool){c.fillStyle=rgba([150,164,196],L.cool);c.fillRect(x,y,w,h);}
  c.restore();
  lp_sun(c,L.sun,{a:L.a,col:L.col,clip:cc=>{cc.beginPath();cc.rect(x,y,w,h);cc.clip();}});
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(x,y,w,h);c.restore();}
// glazed tiles from MM_TILE.top to the skirting, each with its own glaze, and a rounded trim along their top
function mm_tiles(c){const T=MM_TILE,R=ag_rnd(1952);c.fillStyle=rgba(MM_K.tile,1);c.fillRect(0,T.top,W,T.bot-T.top);
  for(let y=T.top;y<T.bot;y+=T.size)for(let x=0;x<W;x+=T.size){const k=(R()-0.5)*6;c.fillStyle=rgba(mix(MM_K.tile,k>0?[255,255,255]:[150,150,140],Math.abs(k)/40),1);c.fillRect(x,y,T.size,T.size);
    const g=c.createLinearGradient(x,y,x+T.size,y+T.size);g.addColorStop(0,"rgba(255,255,255,0.26)");g.addColorStop(0.5,"rgba(255,255,255,0.04)");g.addColorStop(1,"rgba(120,120,110,0.08)");c.fillStyle=g;c.fillRect(x+1,y+1,T.size-2,T.size-2);}
  c.fillStyle=rgba(MM_K.grout,0.6);for(let y=T.top;y<=T.bot;y+=T.size)c.fillRect(0,y-1,W,2);for(let x=0;x<=W;x+=T.size)c.fillRect(x-1,T.top,2,T.bot-T.top);
  c.fillStyle=rgba(MM_K.trim,1);c.fillRect(0,T.top-14,W,14);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(0,T.top-14,W,3);c.fillStyle=rgba(LP.shade,0.16);c.fillRect(0,T.top,W,3);
  mm_relight(c,0,T.top-14,W,T.bot-T.top+14);}
// the round lamp over the mother's table, hung from the ceiling: a dome, its lit glass underneath, and the soft pool it throws
function mm_lamp(c,x){c.fillStyle=rgba(MM_K.steelDk,1);c.fillRect(x-5,0,10,92);c.fillRect(x-22,84,44,10);
  const g=c.createLinearGradient(x-140,0,x+140,0);g.addColorStop(0,rgba(ag_dk(MM_K.steel,0.25),1));g.addColorStop(0.7,rgba(ag_lt(MM_K.steel,0.3),1));g.addColorStop(1,rgba(MM_K.steel,1));
  c.fillStyle=g;c.beginPath();c.moveTo(x-140,150);c.bezierCurveTo(x-130,104,x-70,90,x,90);c.bezierCurveTo(x+70,90,x+130,104,x+140,150);c.closePath();c.fill();
  c.fillStyle="rgba(255,252,240,1)";c.beginPath();c.ellipse(x,150,140,16,0,0,TAU);c.fill();c.strokeStyle=rgba(MM_K.steelDk,0.8);c.lineWidth=3;c.stroke();
  const p=c.createRadialGradient(x,160,10,x,470,420);p.addColorStop(0,"rgba(255,248,228,0.4)");p.addColorStop(1,"rgba(255,248,228,0)");c.fillStyle=p;c.fillRect(x-420,150,840,700);}
// a cloth screen on a steel frame, three panels, round the mother's table: soft folds, the window's light on its right edges
function mm_clothScreen(c,x0,y0,pw,h,n){for(let i=0;i<(n||3);i++){const x=x0+i*(pw+8);
    let g=c.createLinearGradient(x,0,x+pw,0);for(let k=0;k<=6;k++)g.addColorStop(k/6,rgba(k%2?ag_dk(MM_K.cloth,0.08):MM_K.cloth,1));c.fillStyle=g;c.fillRect(x,y0,pw,h);
    g=c.createLinearGradient(x0,0,x0+(n||3)*pw,0);g.addColorStop(0,rgba(LP.shade,0.16));g.addColorStop(1,rgba(LP.sun,0.08));c.fillStyle=g;c.fillRect(x,y0,pw,h);
    c.fillStyle=rgba(MM_K.steel,1);c.fillRect(x-4,y0-10,6,h+20);c.fillRect(x+pw-2,y0-10,6,h+20);c.fillRect(x-4,y0-10,pw+6,6);
    c.fillStyle=rgba(MM_K.steelDk,1);c.fillRect(x-2,y0+h+10,3,MM_FLOOR-y0-h-14);c.fillRect(x+pw-1,y0+h+10,3,MM_FLOOR-y0-h-14);
    c.beginPath();c.arc(x,MM_FLOOR-4,6,0,TAU);c.arc(x+pw+1,MM_FLOOR-4,6,0,TAU);c.fill();}}
// the clock's face, painted with the room; its hands are drawn live (mm_clock)
const MM_CLOCK={x:1846,y:176,r:50};
function mm_clockFace(c){const K=MM_CLOCK;c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=14;c.shadowOffsetX=LP.sdx*0.6;c.shadowOffsetY=6;
  c.fillStyle=rgba([70,66,64],1);c.beginPath();c.arc(K.x,K.y,K.r,0,TAU);c.fill();c.restore();
  c.fillStyle="rgb(248,246,238)";c.beginPath();c.arc(K.x,K.y,K.r-7,0,TAU);c.fill();
  c.strokeStyle=rgba([60,56,54],1);c.lineCap="round";for(let i=0;i<60;i++){const a=i/60*TAU,l=i%5?4:11;c.lineWidth=i%5?1.6:3.4;
    c.beginPath();c.moveTo(K.x+Math.sin(a)*(K.r-12),K.y-Math.cos(a)*(K.r-12));c.lineTo(K.x+Math.sin(a)*(K.r-12-l),K.y-Math.cos(a)*(K.r-12-l));c.stroke();}}
// the hands: the hour and the minute hand barely move; the second hand sweeps once a minute
function mm_clock(ctx,t){const K=MM_CLOCK,hand=(a,l,w,col)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(K.x-Math.sin(a)*l*0.18,K.y+Math.cos(a)*l*0.18);ctx.lineTo(K.x+Math.sin(a)*l,K.y-Math.cos(a)*l);ctx.stroke();};
  const m=42+t/60;hand((7+m/60)/12*TAU,26,5,"rgb(52,48,46)");hand(m/60*TAU,40,3.6,"rgb(52,48,46)");hand((t%60)/60*TAU,44,1.8,"rgb(150,70,48)");
  ctx.fillStyle="rgb(52,48,46)";ctx.beginPath();ctx.arc(K.x,K.y,4,0,TAU);ctx.fill();}
AG_PLACES.mmDelivery=c=>{lp_paintRoom(c,{light:"morning",seed:52,base:[228,226,214]});mm_tiles(c);mm_clockFace(c);mm_lamp(c,236);
  // the screen's soft shadow on the tiles, down and to the left, then the screen itself
  c.save();c.filter="blur(14px)";c.fillStyle=rgba(LP.shade,0.18);c.fillRect(30,476,340,430);c.restore();mm_clothScreen(c,60,460,160,440,2);};
// the bare room, between two moments in it: the clock goes on, and the cot stays where it is
AG_BARE.mmDelivery=(ctx,t)=>{mm_clock(ctx,t);mm_cot(ctx,1500,700,t,{});};
AG_PLACES.mmHall=c=>{lp_paintRoom(c,{light:"morning",seed:19,base:MM_K.plaster});
  // the lower wall painted a darker cream up to a wooden rail, as corridors were
  c.fillStyle=rgba(MM_K.dado,1);c.fillRect(0,640,W,274);mm_relight(c,0,640,W,274);
  c.fillStyle=rgba(mix(LP.timber,LP.shade,0.25),1);c.fillRect(0,628,W,14);c.fillStyle="rgba(255,248,236,0.5)";c.fillRect(0,628,W,2);c.fillStyle=rgba(LP.shade,0.18);c.fillRect(0,642,W,4);};

/* ---------------------------------------------------------------- the cot and the baby */
// x: the middle of the cot, y: the top of its rim; t for the baby's breathing
function mm_cot(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const bw=340,bh=104,bl=bw*0.44;
  // its shadow on the floor, then the legs and the casters
  ctx.fillStyle=rgba(LP.shade,0.2);ctx.beginPath();ctx.ellipse(x+LP.sdx*3,MM_FLOOR+8,bw*0.56,12,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(MM_K.steel,1);for(const lx of [x-bl+16,x+bl-22]){ctx.fillRect(lx,y+bh-10,7,MM_FLOOR-y-bh+4);}ctx.fillRect(x-bl+16,y+bh+140,bl*2-32,6);
  ctx.fillStyle=rgba(MM_K.steelDk,1);for(const lx of [x-bl+19,x+bl-19]){ctx.beginPath();ctx.arc(lx,MM_FLOOR-3,8,0,TAU);ctx.fill();}
  // the baby, swaddled, its head at the near end: the bundle breathes a little
  const br=Math.sin(t*TAU/1.3)*1.6,blue=clamp(o.blue||0,0,1),hx=x-bw*0.3,hy=y-18-br*0.4;
  ag_soft(ctx,cc=>{cc.ellipse(x+24,y-8-br,bw*0.36,34+br*0.5,0,Math.PI,TAU);cc.lineTo(x+24+bw*0.36,y+6);cc.lineTo(x+24-bw*0.36,y+6);cc.closePath();},MM_K.flannel,[255,255,255],x+90,y-40,160,"rgba(120,100,80,0.3)",12);
  ctx.strokeStyle="rgba(170,150,130,0.45)";ctx.lineWidth=2.4;ctx.lineCap="round";for(const k of [-40,10,60]){ctx.beginPath();ctx.moveTo(x+k,y-30-br);ctx.quadraticCurveTo(x+k+20,y-14,x+k+8,y+2);ctx.stroke();}
  const sk=mix(MM_K.skin,MM_K.skinBlue,blue);
  ag_soft(ctx,cc=>{cc.arc(hx,hy,31,0,TAU);},sk,ag_lt(sk,0.35),hx+10,hy-14,30,rgba(ag_dk(sk,0.6),0.35),8);
  ctx.fillStyle=rgba(MM_K.hair,0.85);ctx.beginPath();ctx.ellipse(hx-12,hy-20,18,10,-0.5,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(sk,0.5),0.8);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(hx+12,hy-2,5,0.2,Math.PI-0.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hx+24,hy+10);ctx.quadraticCurveTo(hx+28,hy+13,hx+24,hy+15);ctx.stroke();
  // the cot's white enamel basket, over the bundle's lower edge, its rim catching the window's light
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=16;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=8;
  const g=ctx.createLinearGradient(x-bw/2,0,x+bw/2,0);g.addColorStop(0,rgba(ag_dk(MM_K.enamel,0.14),1));g.addColorStop(0.75,rgba(ag_lt(MM_K.enamel,0.3),1));g.addColorStop(1,rgba(MM_K.enamel,1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-bw/2,y);ctx.lineTo(x+bw/2,y);ctx.lineTo(x+bw/2-24,y+bh);ctx.lineTo(x-bw/2+24,y+bh);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(255,255,255,0.7)";ctx.fillRect(x-bw/2,y,bw,4);ctx.fillStyle=rgba(MM_K.steelDk,0.35);ctx.fillRect(x-bw/2+22,y+bh-6,bw-44,6);
  // a small card clipped to the cot's end, its score on it
  const ck=clamp(o.card||0,0,1);if(ck>0){ctx.save();ctx.globalAlpha*=ck;const cx=x+bw/2-120,cy=y+18;
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(cx,cy,96,70);ctx.restore();
    ctx.fillStyle=rgba(o.col||LP.ink,1);ctx.fillRect(cx,cy,96,8);lp_T(ctx,String(o.score==null?"":o.score),cx+48,cy+58,{w:800,size:40,align:"center",col:o.col||LP.ink});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the score card */
const MM_SIGNS=["Heartbeat","Breathing","How firmly it moves","How it reacts to a touch","Colour"];
function mm_card(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=66,h=LP_PAD+30+44+50+30+5*rh+116;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_T(ctx,"SIXTY SECONDS AFTER BIRTH",x+LP_PAD,y+LP_PAD+44,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,"Five signs, each 0, 1 or 2",x+LP_PAD,y+LP_PAD+112,{w:800,size:40});
  const cx=[x+w-300,x+w-196,x+w-92],ry0=y+LP_PAD+30+44+50+30,cols=clamp(o.cols||0,0,1),mk=o.marks,mcol=o.mcol||LP.green;
  if(cols>0){ctx.save();ctx.globalAlpha*=cols;for(let j=0;j<3;j++)lp_T(ctx,String(j),cx[j],ry0+4,{w:800,size:28,align:"center",col:LP.mut});ctx.restore();}
  MM_SIGNS.forEach((s,i)=>{const k=o.u==null?1:clamp(o.u*5-i,0,1);if(k<=0)return;const ry=ry0+18+i*rh;ctx.save();ctx.globalAlpha*=ag_sine(k);
    ctx.fillStyle=rgba(LP.mut,0.25);ctx.fillRect(x+LP_PAD,ry+rh-4,w-2*LP_PAD,2);
    lp_T(ctx,s,x+LP_PAD,ry+44,{w:600,size:28});
    if(cols>0)for(let j=0;j<3;j++){const on=mk&&mk[i]===j,mu=on?clamp((o.mk||1)*5-i,0,1):0;ctx.save();ctx.globalAlpha*=cols;
      ctx.strokeStyle=rgba(LP.mut,0.55);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx[j],ry+34,22,0,TAU);ctx.stroke();
      if(mu>0){ctx.fillStyle=rgba(mcol,mu);ctx.beginPath();ctx.arc(cx[j],ry+34,22*ag_spr(mu,0,0.5),0,TAU);ctx.fill();}ctx.restore();}
    ctx.restore();});
  const tk=clamp(o.total||0,0,1);if(tk>0&&mk){const sum=mk.reduce((s,v)=>s+v,0),ty=ry0+18+5*rh+58;ctx.save();ctx.globalAlpha*=tk;
    lp_T(ctx,"Total",x+LP_PAD,ty,{w:800,size:28});lp_T(ctx,String(sum),cx[2]+22,ty+6,{w:800,size:48,align:"right",col:mcol});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// what a doctor holds: the score jotted down on a small card, in the near hand
function mm_holdCard(c,hands){const [x,y]=hands.near;c.save();c.translate(x+44,y-46);c.rotate(-0.1);
  ag_soft(c,cc=>ag_rect(cc,-80,-56,160,112,6),[250,247,238],[255,255,255],40,-50,200,"rgba(80,70,50,0.3)",8);
  c.fillStyle=rgba(LP.blue,0.85);c.fillRect(-80,-56,160,8);c.strokeStyle=rgba(LP.ink,0.45);c.lineWidth=3;c.lineCap="round";
  for(let i=0;i<5;i++){c.beginPath();c.moveTo(-62,-30+i*18);c.lineTo(10,-30+i*18);c.stroke();c.beginPath();c.arc(44,-30+i*18,5,0,TAU);c.stroke();}c.restore();}

/* ---------------------------------------------------------------- the people of the story */
// a nurse's starched cap, folded at the back, a dark band near its front, on the crown inside the head's picture
function mm_cap(c,P){const col=[248,248,244];
  // one smooth starched crown on the top of the head, a little to the back; a fold's crease; the dark band along its lower edge
  ag_soft(c,cc=>{cc.moveTo(236,334);cc.bezierCurveTo(232,306,240,286,258,278);cc.bezierCurveTo(290,268,336,270,362,282);cc.bezierCurveTo(372,290,378,304,380,316);
    cc.bezierCurveTo(334,326,286,330,236,334);cc.closePath();},col,[255,255,255],330,282,120,"rgba(90,90,80,0.3)",10);
  c.save();c.strokeStyle=rgba(ag_dk(col,0.1),0.8);c.lineWidth=2;c.lineCap="round";c.beginPath();c.moveTo(266,282);c.bezierCurveTo(260,296,258,310,260,324);c.stroke();c.restore();
  ag_soft(c,cc=>{cc.moveTo(252,322);cc.bezierCurveTo(296,316,338,310,377,304);cc.lineTo(379,312);cc.bezierCurveTo(340,318,298,325,254,331);cc.closePath();},[42,42,48],[104,104,114],330,305,50,null);}
const MM_PEOPLE={
  apgar:{name:"Dr Virginia Apgar",key:"mm-apgar",skin:[234,200,178],hair:{style:"bob",c:[92,68,54]},top:{kind:"blazer",c:[240,238,232],inner:[220,222,226]},breath:0.27},
  nurse:{name:"A nurse",key:"mm-nurse",skin:[226,186,156],hair:{style:"bun",c:[70,50,38]},top:{kind:"shirt",c:[246,245,240]},hat:{paint:mm_cap},breath:0.29},
  junior:{name:"A junior doctor",key:"mm-junior",skin:[198,152,118],hair:{style:"cropped",c:[40,32,28]},top:{kind:"tunic",c:[242,242,238]},breath:0.31},
  obst:{name:"An obstetrician",key:"mm-obst",skin:[222,182,150],hair:{style:"side",c:[146,138,130]},glasses:[58,52,48],top:{kind:"tunic",c:[232,234,230]},breath:0.24}
};
