/* ===== How it travels: this film's pictures =====
   Chile in October 1972, in lamp-light: the telex lines along the country, each factory's numbers sent once a day, one way, to
   Santiago; the truck owners' strike, the trucks standing still, the shops and factories running out; the two questions the
   government needed answered as things happened; the emergency operations centre, its telexes read and answered; the same lines
   carrying messages both ways, and the trucks still running sent where they were needed. Then the utility's wall between the
   network and retail: the paths across it, drawn on the map or not; the link that shows every reading; the script that wrote to a
   queue nothing read; the Mendozas' meter at 14 Quarry Lane and its replaced estimate; the agreed list of what may cross; the three
   shapes a flow can take; the reading published once; its contract; and the flow drawn on the data practice on the map.
   Everything is drawn to read on a phone: text at least 28 px in the frame, unless it's marked as texture. */

/* ---------- from the series' other films: their helpers, copied, so the series' kit doesn't change ---------- */
// the story's room: Chile at night, in lamp-light, a dark blue-grey with a warm haze near the ground, and dust in the air (film 2's)
function d4_night(ctx,S,t){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10151f");g.addColorStop(0.62,"#181d29");g.addColorStop(1,"#26201b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  glow(ctx,960,1180,900,CY_LAMP,0.06);motes(ctx,t,{col:CY_LAMP,a:0.6,n:40});}
// a card in the story: a name and a line under it, on dark glass in lamp-light (film 2's)
function d4_card(ctx,x,y,w,title,sub,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=sub?124:76;if(!w)w=Math.max(tw(ctx,title,o.size||36,800),sub?tw(ctx,sub,28,600):0)+60;glass(ctx,x,y,w,h,18,o.col||CY_LAMP,{glow:14+12*(o.hi||0),ea:0.75,fill:"rgba(20,16,12,0.92)"});
  T(ctx,title,x+28,y+50,{w:800,size:o.size||36,color:rgba(o.col||CY_LAMP,1)});if(sub)T(ctx,sub,x+28,y+96,{w:600,size:28,color:rgba(INK,0.92)});});}
// how wide d4_card draws a card with no width given
function d4_cardW(ctx,title,sub,size){return Math.max(tw(ctx,title,size||36,800),sub?tw(ctx,sub,28,600):0)+60;}
// one line torn from the telex's paper, typed in capitals (film 2's); o.col tints its edge, for a message on its way back
function d4_strip(ctx,x,y,w,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||96;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle=CY_PAPER;ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowColor="transparent";
  ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<w;i+=14){ctx.fillRect(-w/2+i,-h/2,7,2+hash(i,7)*3);ctx.fillRect(-w/2+i+5,h/2-3,7,2+hash(i,9)*3);}
  T(ctx,s,-w/2+30,(o.size||34)*0.36,{f:"mono",w:500,size:o.size||34,color:rgba(CY_INK,0.95)});
  if(o.sig>0.01){ctx.strokeStyle=rgba(o.scol||CY_SIG,o.sig);ctx.lineWidth=4;ctx.strokeRect(-w/2+3,-h/2+3,w-6,h-6);}
  ctx.restore();});}
// born here: a small gold star (film 3's); o.pop (0..) a spring as it lands; o.hi lights it
function d4_star(ctx,x,y,r,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.4,TRUST,0.32+0.3*(o.hi||0));ctx.save();ctx.translate(x,y);const k=o.pop==null?1:o.pop;ctx.scale(k,k);ctx.beginPath();
  for(let i=0;i<10;i++){const q=-Math.PI/2+i*Math.PI/5,d=i%2?r*0.45:r;i?ctx.lineTo(Math.cos(q)*d,Math.sin(q)*d):ctx.moveTo(Math.cos(q)*d,Math.sin(q)*d);}ctx.closePath();
  ctx.fillStyle=rgba(mix(TRUST,[255,240,200],0.35*(o.hi||0)),1);ctx.fill();ctx.strokeStyle="rgba(70,52,12,0.7)";ctx.lineWidth=1.6;ctx.stroke();ctx.restore();});}
// a record in one system, on a card of glass (film 3's d3_rec): the system's name, the record's name and its fields; o.star (0..1)
// born here; o.copy (0..1) a copy, fainter. Returns its height
function d4_recH(n){return 118+n*44;}
function d4_rec(ctx,x,y,sys,name,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||520,F=o.f||[],n=o.rows==null?F.length:o.rows,h=d4_recH(n),cp=o.copy||0,col=o.col||APPC;if(a<=0.01)return h;
  withA(ctx,a*(1-0.22*cp),()=>{glass(ctx,x,y,w,h,16,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(7,12,24,0.94)"});
    T(ctx,sys,x+26,y+44,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});T(ctx,name,x+26,y+92,{w:800,size:32,color:rgba(INK,0.97)});
    F.forEach((row,i)=>{const vs=typeof row==="string"?[[row,1]]:Array.isArray(row[0])?row:[row];vs.forEach(([s,fa,fc])=>{if(fa==null)fa=1;if(fa<=0.01)return;
      withA(ctx,fa,()=>T(ctx,s,x+26,y+140+i*44,{f:"mono",w:500,size:28,color:rgba(fc||INK,0.92)}));});});
    if(o.star>0.01)d4_star(ctx,x+w-44,y+42,19,o.star,{hi:o.starHi||0,pop:o.pop});
    if(cp>0.01)withA(ctx,cp,()=>{const cw=tw(ctx,"copy",28,700)+26;tag(ctx,x+w-22-cw,y+42,"copy",SOFT,{size:28});});});
  return h;}
// a verdict on a chip: a gold tick and its words, or a red cross (film 3's)
function d4_verdict(ctx,x,y,s,ok,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+86,col=ok?TRUST:BAD;glass(ctx,x,y-30,w,60,30,col,{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(16,12,10,0.94)"});
  if(ok)kt_gtick(ctx,x+30,y,14,1);else kt_rcross(ctx,x+30,y,14,1);T(ctx,s,x+56,y+10,{w:700,size:28,color:rgba(mix(col,INK,0.35),1)});});}
function d4_verdictW(ctx,s){return tw(ctx,s,28,700)+86;}
// the Mendozas' home, as film 3 drew it: new render, a tiled roof, two windows up and one down by the door, the meter in its box
// beside the door; o.lit (0..1) the windows lit; o.meter (0..1) lights the meter's little window
function d4_house(ctx,cx,by,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(cx,by);ctx.scale(s,s);
  ctx.fillStyle="rgba(70,82,58,0.6)";rr(ctx,-176,-6,352,12,6);ctx.fill();
  const g=ctx.createLinearGradient(-130,-150,130,0);g.addColorStop(0,"#d6c9b0");g.addColorStop(1,"#9e8e74");ctx.fillStyle=g;ctx.fillRect(-128,-148,256,148);
  ctx.fillStyle="#3a3236";ctx.beginPath();ctx.moveTo(-150,-144);ctx.lineTo(0,-212);ctx.lineTo(150,-144);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=2;for(let i=1;i<4;i++){const yy=-144-i*17,hw=150*(1-i*17/68);ctx.beginPath();ctx.moveTo(-hw,yy);ctx.lineTo(hw,yy);ctx.stroke();}
  const win=(x,y)=>{ctx.fillStyle=rgba(mix([34,38,48],CY_LAMP,lit),1);ctx.fillRect(x,y,46,40);ctx.strokeStyle="rgba(70,58,46,0.95)";ctx.lineWidth=3;ctx.strokeRect(x,y,46,40);ctx.beginPath();ctx.moveTo(x+23,y);ctx.lineTo(x+23,y+40);ctx.stroke();};
  win(-100,-126);win(54,-126);win(-100,-62);
  ctx.fillStyle="#4a3428";ctx.fillRect(18,-68,44,68);ctx.fillStyle="rgba(230,200,140,0.85)";ctx.beginPath();ctx.arc(52,-34,3,0,TAU);ctx.fill();
  ctx.fillStyle="#2c3036";rr(ctx,80,-66,28,34,3);ctx.fill();ctx.fillStyle=rgba(mix([60,70,80],TECH,o.meter||0),1);ctx.fillRect(85,-59,18,9);
  ctx.restore();if(lit>0.01)glow(ctx,cx,by-80*s,170*s,CY_LAMP,0.12*lit*a);});}
// a calendar's page: the month, large, under a red strip; months: [[name, alpha], ...] on the same page, for a month that turns (film 3's)
function d4_cal(ctx,x,y,months,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=240,h=170;sheet(ctx,x,y,w,h,{rot:-0.015,fill:CY_PAPER});ctx.fillStyle="rgba(150,52,40,0.9)";ctx.fillRect(x,y,w,48);
  for(let k=0;k<5;k++){ctx.fillStyle="#2a2624";ctx.beginPath();ctx.arc(x+40+k*40,y+9,5,0,TAU);ctx.fill();}
  T(ctx,"month",x+w/2,y+36,{f:"mono",w:500,size:28,align:"center",color:"rgba(250,240,225,0.95)"});
  months.forEach(([nm,q])=>{if(q>0.01)withA(ctx,q,()=>T(ctx,nm,x+w/2,y+124,{w:800,size:daFit(ctx,nm,46,800,w-36),align:"center",color:"rgba(46,42,40,0.95)"}));});});}
// the months a page shows as the story goes, each turning to the next at its moment: ts[i] is when month i comes (film 3's)
function d4_months(t,names,ts){return names.map((nm,i)=>{const on=i===0?1:fin(t,ts[i]-0.15,0.3),off=i<names.length-1?fin(t,ts[i+1]-0.45,0.3):0;return[nm,on*(1-off)];});}
// a clock face, for an hour going by; p (0..1) sweeps its hand round once (film 2's)
function d4_clock(ctx,x,y,r,p,a,o){o=o||{};if(a<=0.01)return;const col=o.col||CY_LAMP;withA(ctx,a,()=>{ctx.fillStyle="rgba(14,16,22,0.94)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,0.9,3);
  for(let i=0;i<12;i++){const q=i/12*TAU;ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+Math.sin(q)*r*0.78,y-Math.cos(q)*r*0.78);ctx.lineTo(x+Math.sin(q)*r*0.9,y-Math.cos(q)*r*0.9);ctx.stroke();}
  if(p>0.001){ctx.fillStyle=rgba(col,0.22);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r*0.74,-Math.PI/2,-Math.PI/2+TAU*clamp(p,0,1));ctx.closePath();ctx.fill();}
  const q=TAU*clamp(p,0,1);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(q)*r*0.7,y-Math.cos(q)*r*0.7);ctx.stroke();ctx.lineCap="butt";});}
// a list on paper, its title and rows written in as p goes from 0 to 1 (The map before the data's d6_list); returns its height
function d4_list(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a,h=92+rows.length*52;if(a<=0.01)return h;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot,plain:true});
  T(ctx,title,x+28,y+52,{w:800,size:30,color:"rgba(52,48,46,0.95)"});rows.forEach((r,i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0)return;
    withA(ctx,q,()=>{const hi=o.hi?o.hi(i):0;T(ctx,r,x+52,y+104+i*52,{w:700,size:28,color:hi>0.01?"rgba("+mix([52,48,46],[150,52,40],hi).map(Math.round).join(",")+",0.95)":"rgba(52,48,46,0.9)"});
      ctx.fillStyle="rgba(52,48,46,0.7)";ctx.beginPath();ctx.arc(x+34,y+94+i*52,4,0,TAU);ctx.fill();});});});return h;}

/* ---------- 1. The same lines ---------- */
// Chile's table of pictures in lamp-light, left to right, each 1920 px wide: the country and its lines (A, at 0); the strike (B); the
// goods running out (G); the operations centre (C); and the country again (D), its lines carrying messages both ways
const D4_CB=1920,D4_CG=3840,D4_CC=5760,D4_CD=7680;
// the map's place: its top-left corner and its height, Arica to Cape Horn
const D4_MX=420,D4_MY=60,D4_MH=960;
const D4_MINT=[150,220,190];
// where a point on telex line i sits, from its town (u = 0) to Santiago (u = 1), bent as the series' map bends its lines
function d4_lineXY(i,u){const[la,lo]=DA_SITES[i],[px,py]=daChileXY(la,lo,D4_MX,D4_MY,D4_MH),[sx,sy]=daChileXY(DA_SANTIAGO[0],DA_SANTIAGO[1],D4_MX,D4_MY,D4_MH);
  return[lerp(px,sx,u)+Math.sin(u*Math.PI)*(i%2?14:-14),lerp(py,sy,u)];}
// messages along the lines: o.out (0..1) sends them to Santiago, in lamp-light; o.back (0..1) sends answers from Santiago, in mint;
// o.n: how many on each line at once; o.rate: how fast they go. Each line has its own phase, so they never move as one
function d4_pulses(ctx,t,o){o=o||{};const n=o.n||1,rate=o.rate||0.3,out=o.out||0,back=o.back||0;
  for(let i=0;i<DA_SITES.length;i++)for(let k=0;k<n;k++){
    if(out>0.01){const u=((t*rate+hash(i,5)+k/n)%1);if(u>0.04&&u<0.96){const[bx,by]=d4_lineXY(i,u),q=out*Math.sin(Math.PI*u);glow(ctx,bx,by,16,CY_LAMP,0.5*q);ctx.fillStyle=rgba(CY_LAMP,q);ctx.beginPath();ctx.arc(bx,by,3.5,0,TAU);ctx.fill();}}
    if(back>0.01){const u=1-((t*rate*0.9+hash(i,8)+k/n+0.5/n)%1);if(u>0.04&&u<0.96){const[bx,by]=d4_lineXY(i,u),q=back*Math.sin(Math.PI*u);glow(ctx,bx,by,16,D4_MINT,0.5*q);ctx.fillStyle=rgba(D4_MINT,q);ctx.beginPath();ctx.arc(bx,by,3.5,0,TAU);ctx.fill();}}}}
// a truck of the time, side on, at night: a long bonnet in front of the cab, a slatted cargo bed, double wheels at the back. x, y:
// the middle of its wheels' line; s: scale (1 = 300 px long); o.dir: -1 faces left; o.lit (0..1) its headlamp; o.roll: how far its
// wheels have turned (radians), for a truck that moves
function d4_truck(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dir=o.dir||1,lit=o.lit||0,roll=o.roll||0;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);
    ctx.fillStyle="rgba(0,0,0,0.38)";ctx.beginPath();ctx.ellipse(0,22,165,9,0,0,TAU);ctx.fill();
    // the cargo bed, its slats and a tarp tied over the load
    const bg=ctx.createLinearGradient(0,-120,0,-10);bg.addColorStop(0,"#4a443c");bg.addColorStop(1,"#2a2622");ctx.fillStyle=bg;rr(ctx,-150,-118,186,104,6);ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.4)";ctx.lineWidth=2.2;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(-150+i*37,-112);ctx.lineTo(-150+i*37,-18);ctx.stroke();}
    ctx.fillStyle="#5c5246";ctx.beginPath();ctx.moveTo(-148,-118);ctx.quadraticCurveTo(-58,-146,34,-118);ctx.closePath();ctx.fill();
    // the chassis, the cab and its window, the bonnet and the bumper
    ctx.fillStyle="#1c1b19";ctx.fillRect(-152,-16,304,12);
    const cg=ctx.createLinearGradient(40,-110,150,-10);cg.addColorStop(0,"#6a4a36");cg.addColorStop(1,"#3a281e");ctx.fillStyle=cg;
    ctx.beginPath();ctx.moveTo(42,-4);ctx.lineTo(42,-104);ctx.quadraticCurveTo(44,-112,54,-112);ctx.lineTo(96,-112);ctx.lineTo(104,-66);ctx.lineTo(146,-62);ctx.quadraticCurveTo(154,-60,154,-50);ctx.lineTo(154,-4);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(mix([30,34,44],CY_LAMP,0.25),1);ctx.beginPath();ctx.moveTo(56,-102);ctx.lineTo(92,-102);ctx.lineTo(98,-70);ctx.lineTo(56,-70);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(104,-62);ctx.lineTo(104,-8);ctx.stroke();
    ctx.fillStyle="#2a2a2c";ctx.fillRect(148,-20,12,14);
    // the lamp's light along its top, and the headlamp
    ctx.strokeStyle=rgba(CY_LAMP,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-146,-120);ctx.quadraticCurveTo(-58,-148,30,-120);ctx.moveTo(56,-113);ctx.lineTo(95,-113);ctx.stroke();
    ctx.fillStyle=rgba(mix([80,74,60],[255,236,190],lit),1);ctx.beginPath();ctx.arc(150,-46,6,0,TAU);ctx.fill();
    // the wheels: double at the back, one at the front, their hubs turning as it rolls
    [[-116,0],[-80,0],[112,0]].forEach(([wx])=>{ctx.fillStyle="#121214";ctx.beginPath();ctx.arc(wx,0,21,0,TAU);ctx.fill();ctx.fillStyle="#5e5e62";ctx.beginPath();ctx.arc(wx,0,8,0,TAU);ctx.fill();
      ctx.strokeStyle="#2a2a2e";ctx.lineWidth=2.4;for(let k=0;k<3;k++){const q=roll+k*TAU/3;ctx.beginPath();ctx.moveTo(wx,0);ctx.lineTo(wx+Math.cos(q)*8,Math.sin(q)*8);ctx.stroke();}});
    ctx.restore();if(lit>0.01)glow(ctx,x+150*s*dir+30*s*dir,y-46*s,70*s,[255,236,190],0.3*lit*a);});}
// a small truck on the map, a lamp-lit glyph, x, y its middle, dir its way along the country
function d4_mini(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,22,o.col||D4_MINT,0.45);ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.fillStyle=rgba(o.col||D4_MINT,1);
  rr(ctx,-11,-6,13,10,2);ctx.fill();rr(ctx,3,-4,8,8,2);ctx.fill();ctx.fillStyle="#141418";ctx.beginPath();ctx.arc(-6,5,2.6,0,TAU);ctx.arc(7,5,2.6,0,TAU);ctx.fill();ctx.restore();});}
// a shop of the time, its front at night: an awning, a window with three shelves of goods and a door. x, y: the middle of its base;
// s: scale (1 = 380 px wide); o.stock (0..1): how much is left on its shelves, taken from the end of each shelf first
function d4_shop(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const st=o.stock==null?1:o.stock;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    const wg=ctx.createLinearGradient(-190,-300,190,0);wg.addColorStop(0,"#6a5a48");wg.addColorStop(1,"#3e3428");ctx.fillStyle=wg;ctx.fillRect(-190,-290,380,290);
    // the awning, striped in two faded colours
    for(let i=0;i<8;i++){ctx.fillStyle=i%2?"#8a3e30":"#c9b48c";ctx.beginPath();ctx.moveTo(-200+i*50,-290);ctx.lineTo(-150+i*50,-290);ctx.lineTo(-150+i*50,-246);ctx.lineTo(-200+i*50,-246);ctx.closePath();ctx.fill();}
    ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(-200,-250,400,6);
    // the window, lit from inside, its three shelves and what's left on them
    ctx.fillStyle=rgba(mix([30,32,40],CY_LAMP,0.55),1);ctx.fillRect(-170,-224,230,200);
    for(let r=0;r<3;r++){const sy=-160+r*62;ctx.fillStyle="#3a2c22";ctx.fillRect(-170,sy,230,7);
      for(let k=0;k<6;k++){const i=r*6+k,keep=i/18<st*0.999;if(!keep)continue;const gx=-160+k*37,c=[[196,160,96],[150,96,70],[210,196,150],[120,130,96]][(i*7)%4];
        ctx.fillStyle=rgba(c,1);if(k%3===0){rr(ctx,gx,sy-40,28,40,6);ctx.fill();}else if(k%3===1){ctx.fillRect(gx+2,sy-34,24,34);ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(gx+2,sy-24,24,6);}else{ctx.beginPath();ctx.ellipse(gx+14,sy-14,15,14,0,0,TAU);ctx.fill();}}}
    ctx.strokeStyle="rgba(40,30,22,0.95)";ctx.lineWidth=6;ctx.strokeRect(-170,-224,230,200);
    // the door
    ctx.fillStyle="#2a1e16";ctx.fillRect(84,-210,82,210);ctx.fillStyle=rgba(mix([30,32,40],CY_LAMP,0.35),1);ctx.fillRect(96,-196,58,80);ctx.fillStyle="rgba(230,200,140,0.8)";ctx.beginPath();ctx.arc(152,-100,4,0,TAU);ctx.fill();
    ctx.restore();glow(ctx,x-55*s,y-120*s,180*s,CY_LAMP,0.08*a);});}

/* ---------- the utility's wall ---------- */
// the places in the room: W, the systems and the paths across the wall, at the origin; Q, Quarry Lane, to its left; X, what
// crosses, under W; S, the three shapes, to X's right; P, the data practice on the map, under X. The wall runs down through W,
// X and P, so the camera follows it from one to the next
const D4_QX=-1920,D4_XY=1110,D4_SX=1920,D4_PY=2220;
const D4_NET=[132,176,255],D4_RET=[255,150,186],D4_RED=[232,96,84],D4_VIOLET=[196,160,255];
// the two sides, as The map before the data drew them: the network's tinted blue, retail's rose, down the whole column the wall runs
// through (W, X and P); d4_labels names each side over its column, at a place whose top is Y
function d4_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D4_NET,0.0));lg.addColorStop(1,rgba(D4_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,-200,960,3600);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D4_RET,0.08));rg.addColorStop(1,rgba(D4_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,-200,960,3600);});}
function d4_labels(ctx,Y,a){if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"network",450,Y+108,{w:800,size:40,align:"center",color:rgba(D4_NET,1)});T(ctx,"retail",1470,Y+108,{w:800,size:40,align:"center",color:rgba(D4_RET,1)});});}
// where the wall runs, top to bottom: from W's top to the bottom of the map at P
const D4_WT=150,D4_WB=D4_PY+600;
// the wall between them: a frosted band down the middle, from y0 to y1 as p goes to 1; o.red (0..1) flashes it red at o.redY;
// o.hi lights it
function d4_wall(ctx,y0,y1,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,ye=y0+(y1-y0)*ease(clamp(p,0,1)),red=o.red||0;withA(ctx,a,()=>{
  const col=[226,232,246];ctx.save();ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=16+16*(o.hi||0);ctx.fillStyle=rgba(col,0.11+0.06*(o.hi||0));ctx.fillRect(948,y0,24,ye-y0);ctx.shadowBlur=0;
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,ye);});ctx.stroke();ctx.restore();
  if(red>0.01){const ry=o.redY==null?(y0+y1)/2:o.redY;glow(ctx,960,ry,90,D4_RED,0.75*red);ctx.save();ctx.fillStyle=rgba(D4_RED,0.5*red);ctx.fillRect(948,ry-60,24,120);ctx.restore();}});}
// a system, on a card of glass in the application layer's blue: its name; o.sub: a line under it; o.hi lights it
const D4_LX=270,D4_RX=1290,D4_CW=360,D4_CH=100,D4_ROWY=[170,350,530];
const D4_LS=["meter data","network map","outage system"],D4_RS=["billing","customer service","retail analytics"];
function d4_sys(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||D4_CW,h=o.h||D4_CH,col=o.col||APPC;if(a<=0.01)return;withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,16,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(7,12,24,0.94)"});archGlyph(ctx,"component",x+w-30,y+26,12,col);
  T(ctx,name,x+26,y+h/2+11,{w:800,size:32,color:rgba(INK,0.97)});if(o.star>0.01)d4_star(ctx,x+w-30,y+h-26,15,o.star,{hi:o.starHi||0});});}
// where a path meets a card: on the inner edge of the card's side (L or R), its row, and one of four slots down that edge
function d4_anc(side,row,slot,Y){const y=(Y||0)+D4_ROWY[row]+18+slot*21.3;return side==="L"?[D4_LX+D4_CW+6,y]:[D4_RX-6,y];}
// the eleven paths across the wall that Inés lists: [from side, row, slot, to side, row, slot, drawn on the map, what it is]. The four
// on the map: the readings file, the new connection points, the planned outages, the life support list (retail to the network).
// The seven nobody drew: the database link, the nightly script, a copied table, a weekly spreadsheet, an emailed fault list, a
// shared folder (retail to the network), a report someone runs
const D4_P=[["L",0,0,"R",0,0,1,"readings file"],["L",1,0,"R",0,2,1,"new connection points"],["L",2,0,"R",1,3,1,"planned outages"],["R",1,1,"L",1,2,1,"life support list"],
  ["L",0,1,"R",1,0,0,"database link"],["L",0,2,"R",0,1,0,"nightly script"],["L",0,3,"R",2,0,0,"copied table"],["L",1,1,"R",2,1,0,"weekly spreadsheet"],
  ["L",2,1,"R",0,3,0,"emailed fault list"],["R",1,2,"L",2,2,0,"shared folder"],["L",2,3,"R",2,2,0,"report someone runs"]];
// the order Inés finds them in, and the five that become flows (the four on the map, and the script's path, which becomes the
// published flow of replaced readings)
const D4_FIND=[0,4,1,6,2,7,3,8,5,9,10],D4_FLOWS=[0,1,2,3,5];
function d4_pathEnds(k,Y){const P=D4_P[k];return[d4_anc(P[0],P[1],P[2],Y),d4_anc(P[3],P[4],P[5],Y)];}
// a path: o.p draws it from where it starts; o.map (0..1) turns it from a grey dashed line, which nobody drew, into a solid line on the
// map; o.red (0..1) turns it red; o.hi lights it; o.cut (0..1) breaks it near its end, with a red cross; o.end: [x, y], another end
function d4_path(ctx,k,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p;if(a<=0.01||p<=0.01)return;let[[x0,y0],[x1,y1]]=d4_pathEnds(k,o.Y);if(o.end)[x1,y1]=o.end;
  const m=o.map==null?D4_P[k][6]:o.map,red=o.red||0,hi=o.hi||0,cut=o.cut||0;
  const draw=(col,al,dash,lw)=>{if(al<=0.01)return;if(cut>0.01){const u=1-0.22*cut;arrowTo(ctx,x0,y0,lerp(x0,x1,u),lerp(y0,y1,u),col,al,{p:Math.min(p,1),dash,lw,nohead:true});}else arrowTo(ctx,x0,y0,x1,y1,col,al,{p,dash,lw,head:12});};
  withA(ctx,a,()=>{if(hi>0.01){const mx=(x0+x1)/2,my=(y0+y1)/2;glow(ctx,mx,my,120,red>0.5?D4_RED:m>0.5?INFC:SOFT,0.18*hi);}
    draw(mix(mix(SOFT,[150,150,160],0.3),D4_RED,red),(1-m)*(0.72+0.28*hi),[8,8],2.2+1.2*hi);draw(mix(INFC,D4_RED,red),m*(0.95),null,3+1.2*hi);
    if(cut>0.01){const u=1-0.11*cut;kt_rcross(ctx,lerp(x0,x1,u),lerp(y0,y1,u),14,cut);}});}
// where along a path a point sits, from its start (u = 0) to its end
function d4_pathAt(k,u,Y){const[[x0,y0],[x1,y1]]=d4_pathEnds(k,Y);return[lerp(x0,x1,u),lerp(y0,y1,u)];}
// a small card that travels along a path or a line: a message, an envelope glyph and its words (o.col its colour)
function d4_msgW(ctx,s){return tw(ctx,s,28,500,"mono")+74;}
function d4_msg(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;const col=o.col||INFC,w=d4_msgW(ctx,s),h=52;withA(ctx,a,()=>{glass(ctx,x-w/2,y-h/2,w,h,14,col,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});
  ctx.save();ctx.translate(x-w/2+26,y);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,-12,-8,24,16,2);ctx.stroke();ctx.beginPath();ctx.moveTo(-12,-8);ctx.lineTo(0,1);ctx.lineTo(12,-8);ctx.stroke();ctx.restore();
  T(ctx,s,x-w/2+48,y+10,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});});}
// what the database link shows: every connection point's readings, a dot for every ten thousand, those served by other retailers in
// violet; o.v (0..1) lights the violet ones
const D4_GRID_OTHER=(()=>{const idx=[...Array(54).keys()].sort((i,j)=>hash(i,41)-hash(j,41));return new Set(idx.slice(0,23));})();
function d4_grid(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=640,h=232,p=o.p==null?1:o.p,v=o.v||0;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,INFC,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});
  T(ctx,"every connection point's readings",x+26,y+46,{w:800,size:30,color:rgba(INK,0.96)});
  for(let i=0;i<54;i++){const q=clamp(p*54-i,0,1);if(q<=0.01)continue;const cx=x+44+(i%18)*32.6,cy=y+86+Math.floor(i/18)*30,oth=D4_GRID_OTHER.has(i);
    ctx.fillStyle=rgba(oth?mix(INK,D4_VIOLET,v):INK,0.85*q);ctx.beginPath();ctx.arc(cx,cy,7,0,TAU);ctx.fill();}
  withA(ctx,fin(p,0.6,0.4),()=>T(ctx,"all 540,000",x+26,y+206,{w:800,size:30,color:rgba(INK,0.96)}));
  withA(ctx,v,()=>T(ctx,"230,000 with other retailers",x+226,y+206,{w:700,size:30,color:rgba(D4_VIOLET,1)}));});}
// the queue the nightly script still writes to: a box that fills, slip by slip, with nobody reading it; o.fill (0..1)
function d4_queue(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=300,h=60,f=o.fill||0;withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,SOFT,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(14,14,18,0.94)"});
  const n=Math.floor(f*14);for(let i=0;i<n;i++){ctx.fillStyle=rgba(CY_PAPER,0.55);ctx.fillRect(x+w-18-i*9,y+12,5,h-24);}
  T(ctx,"old queue",x+20,y+40,{f:"mono",w:500,size:28,color:rgba(mix(SOFT,INK,0.3),1)});});}
// a radio mast: a lattice tower with its aerial at the top; o.broken (0..1) shows it being mended, a red band round it
function d4_mast(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const br=o.broken||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.strokeStyle="#8c96a8";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-60,0);ctx.lineTo(-10,-400);ctx.moveTo(60,0);ctx.lineTo(10,-400);ctx.stroke();
  ctx.lineWidth=2;for(let i=0;i<8;i++){const y0=-i*50,y1=-(i+1)*50,w0=60-i*6.25,w1=60-(i+1)*6.25;ctx.beginPath();ctx.moveTo(-w0,y0);ctx.lineTo(w1,y1);ctx.moveTo(w0,y0);ctx.lineTo(-w1,y1);ctx.moveTo(-w1,y1);ctx.lineTo(w1,y1);ctx.stroke();}
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-400);ctx.lineTo(0,-460);ctx.stroke();ctx.fillStyle="#b8c2d2";ctx.beginPath();ctx.arc(0,-462,7,0,TAU);ctx.fill();
  ctx.fillStyle="#cfd6e2";rr(ctx,-24,-372,18,40,4);ctx.fill();rr(ctx,6,-372,18,40,4);ctx.fill();
  if(br>0.01){ctx.strokeStyle=rgba(D4_RED,br);ctx.lineWidth=6;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(-40,-180);ctx.lineTo(40,-180);ctx.moveTo(-36,-150);ctx.lineTo(36,-150);ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();});}
// the radio's waves from the meter to the mast, arcs that travel up; o.on (0..1) sends them, o.off (0..1) shows them stopped
function d4_waves(ctx,x0,y0,x1,y1,t,o){o=o||{};const on=o.on||0;if(on<=0.01)return;const col=o.col||TECH;for(let k=0;k<4;k++){const u=((t*0.6+k/4)%1),x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);
  withA(ctx,on*Math.sin(Math.PI*u),()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,18,an-0.7,an+0.7);ctx.stroke();ctx.restore();});}}
// the meter's readings at Quarry Lane, on a card of glass in meter data: nine days, 20 to 28 November. o.miss (0..1) shows the days
// with no readings as empty dashed slots; o.est (0..1) fills them with the estimate, dashed and level; o.rep (0..1) replaces it, day by
// day from the left, with what the meter had stored; o.star (0..1) born here; o.hi lights it
const D4_DAYS=[0.62,0.48,0.71,0.55,0.4,0.66,0.52,0.74,0.58],D4_EST=0.5;
function d4_chart(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=640,h=400,miss=o.miss||0,est=o.est||0,rep=o.rep||0;withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,16,APPC,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"meter data",x+26,y+44,{f:"mono",w:500,size:28,color:rgba(mix(APPC,INK,0.3),1)});
  T(ctx,"readings · CP-0061420",x+26,y+92,{w:800,size:32,color:rgba(INK,0.97)});if(o.star>0.01)d4_star(ctx,x+w-44,y+42,19,o.star,{hi:o.starHi||0,pop:o.pop});
  const bx=x+46,by=y+330,bh=190,bw=44,gap=20;
  ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx-10,by);ctx.lineTo(bx+9*(bw+gap)-gap+10,by);ctx.stroke();
  D4_DAYS.forEach((v,i)=>{const X=bx+i*(bw+gap),r=clamp(rep*9-i,0,1);
    if(miss>0.01&&est<0.99&&r<0.99)withA(ctx,miss*(1-est)*(1-r),()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.7);ctx.setLineDash([6,6]);ctx.lineWidth=2;ctx.strokeRect(X,by-bh,bw,bh);ctx.restore();});
    if(est>0.01&&r<0.99)withA(ctx,est*(1-r),()=>{ctx.save();ctx.fillStyle=rgba(CY_SIG,0.18);ctx.fillRect(X,by-bh*D4_EST,bw,bh*D4_EST);ctx.strokeStyle=rgba(CY_SIG,0.9);ctx.setLineDash([6,5]);ctx.lineWidth=2.4;ctx.strokeRect(X,by-bh*D4_EST,bw,bh*D4_EST);ctx.restore();});
    if(r>0.01)withA(ctx,r,()=>{ctx.fillStyle=rgba(TECH,0.85);ctx.fillRect(X,by-bh*v,bw,bh*v);});});
  T(ctx,"20 Nov",bx,by+40,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,"28 Nov",bx+9*(bw+gap)-gap,by+40,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,0.95)});});}
// a retailer, on rose glass: its name, the two teams in it that read the reading, each with when it acts on it; o.lock (0..1) shows that
// it sees only its own customers'; o.when (0..1) the times, o.whenA (0..1) customer service's; o.rhi(k) lights reader k (0 billing,
// 1 customer service); o.extra: [text, alpha], a chip in customer service's row, where its time was, for the complaints team
const D4_RTX=1230,D4_RW=620,D4_RH=200,D4_RETY=[140,365,590],D4_RETN=["the group's retailer","retailer B","retailer C"],D4_CPS=["CP-0061420","CP-0047730","CP-0052219"];
function d4_ret(ctx,x,y,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=D4_RW,h=D4_RH,col=D4_RET;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(20,10,16,0.94)"});
  T(ctx,D4_RETN[i],x+24,y+46,{w:800,size:30,color:rgba(INK,0.97)});
  const lk=o.lock||0;if(lk>0.01)withA(ctx,lk,()=>{const s="only its own",tw_=tw(ctx,s,28,700)+64,lx=x+w-20-tw_;glass(ctx,lx,y+18,tw_,48,24,col,{glow:8,ea:0.8,fill:"rgba(26,12,20,0.95)"});
    ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(lx+26,y+38,6,Math.PI,TAU);ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.fillRect(lx+17,y+38,18,14);ctx.restore();
    T(ctx,s,lx+46,y+52,{w:700,size:28,color:rgba(mix(col,INK,0.4),1)});});
  [["billing","at the next bill"],["customer service","during a call"]].forEach(([nm,wh],k)=>{const ry=y+104+k*58,rh=o.rhi?o.rhi(k):0;tag(ctx,x+24,ry,nm,mix(APPC,TRUST,rh),{size:28});
    const wa=(o.when||0)*(k===1&&o.whenA!=null?o.whenA:1);if(wa>0.01)withA(ctx,wa,()=>T(ctx,wh,x+24+tw(ctx,nm,28,700)+46,ry+10,{w:600,size:28,color:rgba(SOFT,0.95)}));
    if(rh>0.01)glow(ctx,x+24+(tw(ctx,nm,28,700)+26)/2,ry,60,TRUST,0.25*rh);});
  if(o.extra&&o.extra[1]>0.01)withA(ctx,o.extra[1],()=>tag(ctx,x+24+tw(ctx,"customer service",28,700)+34,y+162,o.extra[0],TRUST,{size:28}));});}
// where a message reaches a retailer: the middle of its left edge
function d4_retIn(i,Y){return[D4_RTX-14,(Y||0)+D4_RETY[i]+D4_RH/2];}

/* ---------- 4. Three shapes ---------- */
// a system on the shapes board: a small card of glass; o.star (0..1) the home; o.lock (0..1) a reader not allowed, greyed with a lock;
// o.hi lights it; o.red (0..1) a system that broke
function d4_node(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||86,h=o.h||56,lk=o.lock||0,col=mix(mix(APPC,SOFT,lk),D4_RED,o.red||0);withA(ctx,a,()=>{
  glass(ctx,x-w/2,y-h/2,w,h,12,col,{glow:8+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});archGlyph(ctx,"component",x,y,13,col);
  if(o.star>0.01)d4_star(ctx,x+w/2-4,y-h/2+2,14,o.star,{hi:o.starHi||0});
  if(lk>0.01)withA(ctx,lk,()=>{ctx.save();ctx.translate(x+w/2+16,y);ctx.strokeStyle=rgba(SOFT,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,-6,7,Math.PI,TAU);ctx.stroke();ctx.fillStyle=rgba(SOFT,1);ctx.fillRect(-10,-6,20,16);ctx.restore();});});}
// a dot that travels along a line, for a message, from (x0, y0) to (x1, y1) as u goes from 0 to 1
function d4_dot(ctx,x0,y0,x1,y1,u,col,a){if(u<=0||u>=1||a<=0.01)return;const x=lerp(x0,x1,ease(u)),y=lerp(y0,y1,ease(u));withA(ctx,a,()=>{glow(ctx,x,y,22,col,0.6);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();});}
// the board's three panels, side by side, each 560 wide, and the places of their systems (in the panel's own frame)
const D4_SPX=[50,680,1310],D4_SPW=560,D4_SPY=140,D4_SPH=620;
const D4_P2P_A=[110,335],D4_P2P_R=[[440,170],[440,280],[440,390],[440,500]];
const D4_HUB=[280,340],D4_HUBN=[[110,190],[450,190],[90,405],[470,405],[280,500]];
const D4_PS_H=[110,185],D4_PS_CH=[[170,320],[500,320]],D4_PS_R=[[200,460],[330,460],[460,460]],D4_PS_NO=[460,185];

/* ---------- 6. Under a contract ---------- */
// the contract, as a card: its kicker and its terms, each a name and what it says, written in as each is said; o.p(i) (0..1) term i
const D4_TERMS=[["agreed by","network operations · billing"],["sign-off","nobody else's: it keeps to the agreed list"],["what crosses","the five parts, and what each means"],
  ["how soon","within an hour of the replacement"],["late or wrong","told that day, corrected at home, never in the copy"],["changes","add a part; remove or rename only in a new version; readers told first"]];
function d4_contractH(ctx,w){let h=96;D4_TERMS.forEach(([,v])=>{h+=wrapT(ctx,v,0,0,w-300,{size:30,w:700,measure:true}).length*38+22;});return h;}
function d4_contract(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const h=d4_contractH(ctx,w);glass(ctx,x,y,w,h,18,INFC,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  T(ctx,"contract · replaced readings",x+28,y+48,{f:"mono",w:500,size:28,color:rgba(INFC,1)});let yy=y+104;
  D4_TERMS.forEach(([k,v],i)=>{const q=o.p?o.p(i):1,ls=wrapT(ctx,v,0,0,w-300,{size:30,w:700,measure:true}),hi=o.hiT?o.hiT(i):0;
    if(q>0.01)withA(ctx,q,()=>{T(ctx,k,x+28,yy,{f:"mono",w:500,size:28,color:rgba(mix(INFC,INK,0.2+0.5*hi),1)});wrapT(ctx,v,x+270,yy,w-300,{size:30,w:700,lh:38,color:rgba(mix(INK,TRUST,0.6*hi),0.97)});});
    yy+=ls.length*38+22;});});}

/* ---------- 7. On the map ---------- */
// the data practice on the map, at P: the business layer, with the meter reading and its owner on the network's side and the bill and
// its owner on retail's; the information layer, with the meter reading in meter data (its home) and its copy in billing, and the
// flow between them drawn across the wall, naming its shape and its contract. The room's wall runs down through both layers
function d4_map(ctx,t,o){o=o||{};const Y=D4_PY,a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  withA(ctx,o.band==null?1:o.band,()=>{tag(ctx,960,Y+60,"the data practice on the map",DAC,{align:"center",size:30});
    ctx.save();ctx.fillStyle=rgba(BUSC,0.07);ctx.strokeStyle=rgba(BUSC,0.55);ctx.lineWidth=2;rr(ctx,40,Y+100,1840,210,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,64,Y+100,"business",BUSC,{size:28});
    ctx.save();ctx.fillStyle=rgba(INFC,0.07);ctx.strokeStyle=rgba(INFC,0.55);ctx.lineWidth=2;rr(ctx,40,Y+340,1840,250,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,64,Y+340,"information",INFC,{size:28});});
  // the business object, the meter reading, over the wall: both its data objects realise it
  const bo=o.bo==null?1:o.bo,ow=o.own==null?1:o.own;
  daBO(ctx,780,Y+142,360,128,"meter reading",{a:bo,size:32});
  // the data objects: the meter reading at home in meter data, and its copy in billing; an owner at each end of the flow
  const dy=Y+392,dh=118,dA=o.dos==null?1:o.dos;
  daDO(ctx,180,dy,440,dh,"meter reading","meter data",{a:dA,size:30,hi:o.doHi||0});daDO(ctx,1300,dy,440,dh,"meter reading","billing",{a:dA*0.82,size:30,hi:o.doHi||0});
  withA(ctx,dA*(o.mark==null?1:o.mark),()=>{d4_star(ctx,180+440-26,dy-4,17,1,{hi:o.starHi||0});const cw=tw(ctx,"copy",28,700)+26;tag(ctx,1300+440-cw-4,dy-4,"copy",SOFT,{size:28});});
  daOwner(ctx,180,dy+dh+40,"Grace · network operations",{a:ow,hi:o.ownHi||0});daOwner(ctx,1300,dy+dh+40,"head of retail",{a:ow,hi:o.ownHi||0});
  daReal(ctx,520,dy,820,Y+270,o.real==null?1:o.real,{a:dA});daReal(ctx,1400,dy,1100,Y+270,o.real==null?1:o.real,{a:dA});
  // the flow across the wall, its shape over it and its contract under it, and a light that runs along it
  const fp=o.flow==null?1:o.flow,fy=dy+dh/2;daFlowLine(ctx,628,fy,1292,fy,fp,{col:INFC,lw:3.4});
  const run=o.run||0;if(run>0&&run<1){const x=lerp(628,1292,ease(run));glow(ctx,x,fy,36,INFC,0.8*Math.sin(Math.PI*run));}
  withA(ctx,o.shape==null?1:o.shape,()=>tag(ctx,960,fy-50,"publish and subscribe",INFC,{align:"center",size:28}));
  withA(ctx,o.contract==null?1:o.contract,()=>tag(ctx,960,fy+50,"contract: replaced readings",INFC,{align:"center",size:28}));});}
// the ledger under the map: the eleven paths become five flows, each with its contract, and six closed, the link among them;
// o.p (0..1) sorts them; o.label (0..1) names the link
function d4_ledger(ctx,o){o=o||{};const Y=D4_PY,a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p||0;withA(ctx,a,()=>{
  withA(ctx,o.head==null?1:o.head,()=>T(ctx,"11 paths across the wall",960,Y+664,{w:800,size:32,align:"center",color:rgba(INK,0.96)}));
  // five flows, on the left: short solid lines, each with a small contract card over it
  for(let i=0;i<5;i++){const q=clamp(p*6-i*0.6,0,1);if(q<=0.01)continue;const x=200+i*140,y=Y+740;withA(ctx,q,()=>{arrowTo(ctx,x,y,x+110,y,INFC,0.95,{lw:3.4,head:12});
    ctx.fillStyle="rgba(8,12,22,0.96)";rr(ctx,x+38,y-46,30,36,4);ctx.fill();ctx.strokeStyle=rgba(INFC,0.95);ctx.lineWidth=2;rr(ctx,x+38,y-46,30,36,4);ctx.stroke();
    ctx.fillStyle=rgba(INFC,0.8);for(let r=0;r<3;r++)ctx.fillRect(x+44,y-38+r*9,18,2.4);});}
  withA(ctx,clamp(p*2-0.4,0,1),()=>T(ctx,"5 flows, each with its contract",535,Y+812,{w:700,size:30,align:"center",color:rgba(mix(INFC,INK,0.45),1)}));
  // six closed, on the right: short dashed lines, crossed out
  for(let i=0;i<6;i++){const q=clamp(p*6-i*0.6-0.5,0,1);if(q<=0.01)continue;const x=1065+i*120,y=Y+740;withA(ctx,q,()=>{arrowTo(ctx,x,y,x+90,y,SOFT,0.75,{lw:2.6,dash:[8,7],nohead:true});kt_rcross(ctx,x+45,y,13,1);});}
  withA(ctx,clamp(p*2-0.7,0,1),()=>T(ctx,"6 closed, the link among them",1400,Y+812,{w:700,size:30,align:"center",color:rgba(mix(D4_RED,INK,0.4),1)}));});}

/* ---------- 8. In time to act ---------- */
// the Mendozas' December bill, on paper: what it charges for, from the readings, and a tick
function d4_bill(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=500,h=250;sheet(ctx,x,y,w,h,{rot:0.012,fill:"#f2ead6"});
  T(ctx,"December bill",x+30,y+54,{w:800,size:32,color:"rgba(46,42,40,0.95)"});ctx.fillStyle="rgba(46,42,40,0.25)";ctx.fillRect(x+30,y+72,w-60,2);
  T(ctx,"14 Quarry Lane",x+30,y+120,{w:600,size:28,color:"rgba(90,84,80,0.95)"});
  T(ctx,"20 to 28 Nov: as read",x+30,y+172,{w:700,size:28,color:"rgba(46,42,40,0.95)"});
  if(o.tick>0.01)kt_gtick(ctx,x+w-56,y+164,20,o.tick);
  withA(ctx,o.est==null?0:o.est,()=>{T(ctx,"no estimate",x+30,y+222,{w:600,size:28,color:"rgba(90,84,80,0.95)"});});});}
