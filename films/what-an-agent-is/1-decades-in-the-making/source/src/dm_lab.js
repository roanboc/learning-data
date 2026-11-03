/* ===== Decades in the making: the lab =====
   Jun Park's team in the white lab, the agent, and the oak timeline along the marble wall, with what stands under each year.
     dmLab       the lab, its marble quieter along the top where the rail runs and where the exhibits' words go
     DM_YEARS    the years on the rail, and which hang lower so their tabs don't touch
     dm_team     Jun at the desk, the agent beside it, and two of the team: the opening's last shot and the film's last
     dm_tasks    a short list of tasks the agent works through, each ticked in turn */
AG_PLACES.dmLab=c=>ag_paintLab(c,{quiet:[[960,240,1200,130,0.75],[1500,420,520,260,0.5],[420,420,460,220,0.4]]});
const DM_YEARS=[{y:1958},{y:1969},{y:1986},{y:2012},{y:2017},{y:2020,drop:72},{y:2022},{y:2024,drop:72}];
// the rail in the lab: focus (a year at x 960), ppy, which years show (a list of years, or all), each tab's light (lit(y) -> 0..1), draw;
// pin(y) -> 0..1 turns a tab into a stud on the rail, drop(y) moves it, grow is how much a lit tab swells (0.16)
function dm_labRail(ctx,o){const show=o.show||DM_YEARS.map(v=>v.y);return dm_rail(ctx,{y:196,ppy:o.ppy||40,focus:o.focus,draw:o.draw,a:o.a,
    years:DM_YEARS.filter(v=>show.includes(v.y)).map(v=>({y:v.y,drop:o.flat?0:o.drop&&o.drop(v.y)!=null?o.drop(v.y):v.drop,lit:o.lit?o.lit(v.y):0,a:o.tabA?o.tabA(v.y):1,
      pin:o.pin?o.pin(v.y):0,grow:o.grow}))});}

// the team's places in the lab
const DM_TEAM={desk:[540,900,700],jun:[760,560,0.8],screen:[980,640,220,140],agent:[1420,500,100],yusuf:[250,600,0.96],mei:[1720,600,0.96]};
// Jun at the desk, the screen, the agent beside them; o: t, agent (0..1 how far it has come), think, screenDraw
function dm_team(ctx,o){const T=DM_TEAM,[dx,dy,dw]=T.desk,[jx,jy,js]=T.jun,[sx,sy,sw,sh]=T.screen,[ax,ay,ar]=T.agent;
  ag_desk(ctx,dx,dy,dw,{});ag_screen(ctx,sx,sy,sw,sh,{stand:dy-70-sy-sh+6,draw:(cx,x0,y0,w0,h0)=>{dm_sheetOnScreen(cx,x0,y0,w0,h0);if(o.screen)o.screen(cx,x0,y0,w0,h0);}});
  ag_person(ctx,"jun",jx,jy,js,{t:o.t,pose:"desk",cut:dy-70,gaze:o.junGaze||[4,1],nod:o.junNod||0,smile:o.junSmile==null?0.35:o.junSmile});
  if(o.yusuf>0){ctx.save();ctx.globalAlpha*=o.yusuf;const [x,y,s]=T.yusuf;ag_person(ctx,"yusuf",x-(1-ag_eo(o.yusuf))*60,y,s,{t:o.t+3,pose:o.yPose,smile:o.ySmile==null?0.1:o.ySmile,gaze:[4,0]});ctx.restore();}
  if(o.mei>0){ctx.save();ctx.globalAlpha*=o.mei;const [x,y,s]=T.mei;ag_person(ctx,"mei",x+(1-ag_eo(o.mei))*60,y,s,{t:o.t+5,flip:true,pose:o.mPose,smile:o.mSmile==null?0.45:o.mSmile,gaze:[4,0]});ctx.restore();}
  ag_roomLight(ctx,1);
  if(o.agent>0){const k=ag_spr(o.agent,0,0.6),a=clamp(o.agent*2,0,1);ag_modelLight(ctx,ax,ay,ar*k,a*0.8);ag_model(ctx,ax,ay-(1-k)*30,ar*Math.max(0.01,k),{t:o.t,core:0.6+0.4*(o.think||0),think:o.think||0,label:"AI agent",a});}}
// the tasks the agent works through: a card of three, each ticked when done (done: 0..3, fractional while it works)
const DM_TASKS=["Find this term's file","Count the students","Check the totals"];
function dm_tasks(ctx,x,y,done,a){if(a<=0)return;const w=470,h=60+DM_TASKS.length*58;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,20,{});
  ag_T(ctx,"TASKS",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  DM_TASKS.forEach((s,i)=>{const yy=y+104+i*58,u=clamp(done-i,0,1),on=u>=1;
    ctx.strokeStyle=rgba(on?AG.green:AG.mut,on?0.9:0.5);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+44,yy-10,15,0,TAU);ctx.stroke();
    if(on)ag_tick(ctx,x+44,yy-10,18,rgba(AG.green,1),3.5);else if(u>0){ctx.strokeStyle=rgba(AG.violet,0.9);ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(x+44,yy-10,15,-Math.PI/2,-Math.PI/2+TAU*u);ctx.stroke();}
    ag_T(ctx,s,x+76,yy,{w:600,size:30,col:on?AG.ink:AG.mut});});ctx.restore();}
// what Jun's screen shows: a table of rows, quiet blue lines
function dm_sheetOnScreen(c,x,y,w,h){c.fillStyle="#F4F5F3";c.fillRect(x,y,w,h);c.fillStyle=rgba(AG.blue,0.16);c.fillRect(x,y,w,18);
  c.strokeStyle=rgba(AG.blue,0.22);c.lineWidth=1;for(let k=1;k<7;k++){c.beginPath();c.moveTo(x,y+18+k*17);c.lineTo(x+w,y+18+k*17);c.stroke();}
  for(const f of [0.32,0.62]){c.beginPath();c.moveTo(x+w*f,y);c.lineTo(x+w*f,y+h);c.stroke();}}

/* ---------------------------------------------------------------- 1958: the perceptron
   The 1958 demonstration ran as a program on a computer; the film draws it as one cabinet so its parts can be seen: an eye of 20 x 20
   cells (as on the machine built in 1960), the card shown to it, marked on the left or the right, two lamps for its guess, and six
   dials: the numbers each wrong guess nudges. dm_perceptron(ctx, x, y, o): o.on (0..1 switched on), o.card (0 left, 1 right),
   o.show (0..1 the card in place), o.guess (0, 1 or null), o.right (true, false or null), o.dial(i) -> angle, o.nudge (0..1, the
   dials' amber rims while a wrong guess moves them), o.tries, o.a. The cabinet is 760 by 520, on legs 120 tall. */
const DM_EYE=20;
function dm_perceptron(ctx,x,y,o){const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=760,h=520,on=o.on==null?1:o.on;
  ag_floorShadow(ctx,x+w/2-20,y+h+122,w*0.55,34,0.22);
  for(const lx of [x+50,x+w-80])ag_soft(ctx,cc=>ag_rect(cc,lx,y+h-6,30,128,4),[90,98,106],[150,160,168],lx+30,y+h,80,"rgba(0,0,0,0.3)",4);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,18),[150,162,170],[214,222,226],x+w,y,700,"rgba(30,40,50,0.4)",18);
  // its name, on a brass plate
  const pw=ag_tw(ctx,"PERCEPTRON",{w:800,size:30,ls:5})+60;
  ag_soft(ctx,cc=>ag_rect(cc,x+w/2-pw/2,y+22,pw,52,8),[170,134,66],[236,212,146],x+w/2+pw/2,y+22,pw,"rgba(80,60,20,0.4)",4);
  ag_T(ctx,"PERCEPTRON",x+w/2,y+60,{w:800,size:30,ls:5,align:"center",col:[72,54,26]});
  // the card on its holder, at the left: a white card with a dark mark on its left or its right half
  const cx=x+44,cy=y+122,cw=200,ch=150,sh=o.show||0;
  ag_inner(ctx,cc=>ag_rect(cc,cx-10,cy-10,cw+20,ch+20,10),"rgba(20,30,40,0.5)",12,-3,3);
  if(sh>0){ctx.save();ctx.globalAlpha*=clamp(sh*1.6,0,1);ctx.translate(0,(1-ag_eo(sh))*-30);ctx.fillStyle="#FBFAF6";ctx.fillRect(cx,cy,cw,ch);
    ctx.fillStyle=rgba(DM.ink,0.85);ctx.beginPath();ctx.arc(cx+(o.card?cw*0.74:cw*0.26),cy+ch/2,34,0,TAU);ctx.fill();ctx.restore();}
  ag_T(ctx,"Shown",cx+cw/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  // the eye: 20 x 20 cells, lit where the card's mark falls
  const ex=x+290,ey=y+100,es=196,cs=es/DM_EYE;ctx.fillStyle="#2B2E33";rr(ctx,ex-8,ey-8,es+16,es+16,8);ctx.fill();
  const mx=(o.card?0.74:0.26)*DM_EYE;
  for(let i=0;i<DM_EYE;i++)for(let j=0;j<DM_EYE;j++){const lit=sh>0.6&&Math.hypot(i+0.5-mx,j+0.5-DM_EYE/2)<3.7?clamp((sh-0.6)/0.3,0,1):0;
    ctx.fillStyle=rgba(mix(mix([58,62,70],[78,86,96],on),[255,236,190],lit),1);ctx.fillRect(ex+i*cs+1,ey+j*cs+1,cs-2,cs-2);}
  ag_T(ctx,"Its eye",ex+es/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  // its guess: two lamps
  for(const [k,lab] of [[0,"Left"],[1,"Right"]]){const lx=x+576,ly=y+162+k*92,lit=o.guess===k?1:0;
    ctx.fillStyle=rgba(mix(mix([80,86,94],[104,112,120],on),AG.violet,lit),1);ctx.beginPath();ctx.arc(lx,ly,22,0,TAU);ctx.fill();
    if(lit){ctx.save();ctx.shadowColor=rgba(AG.violet,0.8);ctx.shadowBlur=24;ctx.fill();ctx.restore();}
    ag_T(ctx,lab,lx+38,ly+11,{w:700,size:30,col:lit?AG.ink:AG.mut});}
  if(o.right!=null&&o.guess!=null){const vx=x+w-46,vy=y+162+o.guess*92;if(o.right)ag_tick(ctx,vx,vy,30,rgba(AG.green,1),5);else{ctx.save();ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(vx-13,vy-13);ctx.lineTo(vx+13,vy+13);ctx.moveTo(vx+13,vy-13);ctx.lineTo(vx-13,vy+13);ctx.stroke();ctx.restore();}}
  // the dials: its numbers, with an amber rim while a wrong guess nudges them
  const nu=o.nudge||0;
  for(let i=0;i<6;i++){const dx=x+90+i*116,dy=y+428,ang=o.dial?o.dial(i):0;
    if(nu>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.85*nu);ctx.lineWidth=5;ctx.beginPath();ctx.arc(dx,dy,42,0,TAU);ctx.stroke();ctx.restore();}
    ag_soft(ctx,cc=>cc.arc(dx,dy,36,0,TAU),[226,230,232],[255,255,255],dx+14,dy-14,40,"rgba(30,40,50,0.35)",6);
    ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+Math.sin(ang)*26,dy-Math.cos(ang)*26);ctx.stroke();}
  ag_T(ctx,"Its numbers",x+w/2,y+500,{w:600,size:28,align:"center",col:AG.mut});
  if(o.tries!=null)ag_pill(ctx,x+w-96,y-44,"Try "+o.tries,{size:30});
  ctx.restore();}
// a newspaper clipping of 8 July 1958, without its paper's name: its headline, and the line about what the Navy expected (hi: 0..1 marks it)
function dm_clipping(ctx,x,y,a,hi){if(a<=0)return;const w=680,h=360;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(-0.022);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=28;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=14;ctx.fillStyle="#F3EEE2";ctx.fillRect(0,0,w,h);ctx.restore();
  ag_T(ctx,"JULY 8, 1958",34,54,{w:700,size:28,ls:3,col:AG.mut});ctx.fillStyle=rgba(AG.ink,0.6);ctx.fillRect(34,72,w-68,2);
  ag_T(ctx,"New Navy device",34,128,{w:800,size:42});ag_T(ctx,"learns by doing",34,176,{w:800,size:42});
  const lines=["“…expects will be able to walk, talk,","see, write, reproduce itself and be","conscious of its existence.”"];
  lines.forEach((l,i)=>ag_T(ctx,l,34,238+i*40,{w:500,size:30,col:mix(AG.ink,AG.amber,i===0||i===2?hi:0)}));ctx.restore();}
// a pattern one straight line can't split: two dark dots on one diagonal, two rings on the other, on a card s wide (x, y its middle);
// a line tries (ang, off), the side it cuts off tinted; fail: 0..1 turns the line amber
function dm_xor(ctx,x,y,s,ang,off,a,fail){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x-s/2,y-s/2,s,s,22,{});
  const nx=-Math.sin(ang),ny=Math.cos(ang),px=x+nx*off,py=y+ny*off,dx=Math.cos(ang),dy=Math.sin(ang),L=s*2;
  ctx.save();ctx.beginPath();ag_rect(ctx,x-s/2,y-s/2,s,s,22);ctx.clip();ctx.fillStyle=rgba(AG.blue,0.1);ctx.beginPath();ctx.moveTo(px-dx*L,py-dy*L);ctx.lineTo(px+dx*L,py+dy*L);
  ctx.lineTo(px+dx*L+nx*L,py+dy*L+ny*L);ctx.lineTo(px-dx*L+nx*L,py-dy*L+ny*L);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix(AG.blue,AG.amber,fail),0.95);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(px-dx*L,py-dy*L);ctx.lineTo(px+dx*L,py+dy*L);ctx.stroke();ctx.restore();
  for(const [i,j,dark] of [[0,0,1],[1,1,1],[0,1,0],[1,0,0]]){const qx=x+(i-0.5)*s*0.5,qy=y+(j-0.5)*s*0.5;ctx.beginPath();ctx.arc(qx,qy,s*0.075,0,TAU);
    if(dark){ctx.fillStyle=rgba(DM.ink,0.85);ctx.fill();}else{ctx.fillStyle="#FBFAF6";ctx.fill();ctx.strokeStyle=rgba(DM.ink,0.85);ctx.lineWidth=6;ctx.stroke();}}
  ctx.restore();}
// a closed book on the wall's ledge, its title on the cover
function dm_bookCover(ctx,x,y,title,yr,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_soft(ctx,cc=>ag_rect(cc,x,y,240,330,8),[52,74,96],[110,136,160],x+240,y,300,"rgba(10,20,30,0.45)",14);
  ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(x+16,y,8,330);ag_T(ctx,title,x+130,y+120,{w:800,size:32,align:"center",col:[244,244,240]});ag_T(ctx,yr,x+130,y+290,{w:600,size:28,align:"center",col:[214,222,230]});ctx.restore();}
// coins sliding away to the right (money moving elsewhere): u 0..1
function dm_coinsAway(ctx,x,y,u){if(u<=0||u>=1)return;for(let i=0;i<5;i++){const k=clamp(u*1.4-i*0.1,0,1),cx=x+ag_sine(k)*900+i*30,cy=y-Math.sin(Math.PI*k)*60+i*6;
    ctx.save();ctx.globalAlpha*=1-k;ag_soft(ctx,cc=>cc.ellipse(cx,cy,22,14,0,0,TAU),[196,160,70],[250,226,150],cx+6,cy-4,20,"rgba(80,60,10,0.4)",3);ctx.restore();}}

/* ---------------------------------------------------------------- 1986: a network of layers that learns from its mistakes
   dm_net(ctx, x, y, w, h, sizes, o): layers of nodes from left to right; o.fwd (0..1) a pulse running forward, o.back (0..1) the error
   running back, o.wt(i, j, k) a connection's weight (0..1), o.lit(layer, node) a node's light, o.col the nodes' colour, o.a */
function dm_netPos(x,y,w,h,sizes){return sizes.map((n,l)=>Array.from({length:n},(_,i)=>[x+w*l/(sizes.length-1),y+h/2+(i-(n-1)/2)*Math.min(h/(n-1||1),110)]));}
function dm_net(ctx,x,y,w,h,sizes,o){o=o||{};const a=o.a==null?1:o.a,P=dm_netPos(x,y,w,h,sizes);if(a<=0)return P;const L=sizes.length,r=o.r||22;ctx.save();ctx.globalAlpha*=a;
  for(let l=0;l<L-1;l++)for(let i=0;i<P[l].length;i++)for(let j=0;j<P[l+1].length;j++){const wt=o.wt?o.wt(l,i,j):0.5,A=P[l][i],B=P[l+1][j];
    ctx.strokeStyle=rgba(AG.label,0.16+0.3*wt);ctx.lineWidth=1+3.5*wt;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}
  // the pulses: forward in violet, back in amber, a layer at a time
  for(const [p,col,dir] of [[o.fwd,AG.violet,1],[o.back,AG.amber,-1]]){if(!(p>0&&p<1))continue;const s=p*(L-1),l=Math.floor(s),u=s-l,l0=dir>0?l:L-1-l,l1=dir>0?l0+1:l0-1;if(l1<0||l1>=L)continue;
    ctx.save();ctx.lineCap="round";for(let i=0;i<P[l0].length;i++)for(let j=0;j<P[l1].length;j++){const A=P[l0][i],B=P[l1][j],q=[lerp(A[0],B[0],u),lerp(A[1],B[1],u)],u0=Math.max(0,u-0.4),q0=[lerp(A[0],B[0],u0),lerp(A[1],B[1],u0)];
      const g=ctx.createLinearGradient(q0[0],q0[1],q[0],q[1]);g.addColorStop(0,rgba(col,0));g.addColorStop(1,rgba(col,0.75));ctx.strokeStyle=g;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
      ctx.fillStyle=rgba(col,0.95);ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(q[0],q[1],5.5,0,TAU);ctx.fill();ctx.shadowBlur=0;}ctx.restore();}
  for(let l=0;l<L;l++)for(let i=0;i<P[l].length;i++){const [nx,ny]=P[l][i],lt=o.lit?o.lit(l,i):0.3;
    ag_soft(ctx,cc=>cc.arc(nx,ny,r,0,TAU),mix([226,224,236],o.col||AG.violet,0.25+0.55*lt),[255,255,255],nx+r*0.4,ny-r*0.5,r*1.4,"rgba(40,30,80,0.3)",6,0.6);
    if(lt>0.5){ctx.save();ctx.globalAlpha*=(lt-0.5)*2;ctx.shadowColor=rgba(o.col||AG.violet,0.8);ctx.shadowBlur=20;ctx.strokeStyle=rgba(o.col||AG.violet,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(nx,ny,r+3,0,TAU);ctx.stroke();ctx.restore();}}
  ctx.restore();return P;}
// a small badge of a pattern a hidden node found: 3 x 3 cells (bits, a number whose bits say which are dark)
function dm_patternBadge(ctx,x,y,bits,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x-34,y-34,68,68,12,{});for(let k=0;k<9;k++){const on=(bits>>k)&1;ctx.fillStyle=on?rgba(DM.ink,0.8):rgba([210,206,200],1);ctx.fillRect(x-24+(k%3)*17,y-24+Math.floor(k/3)*17,15,15);}ctx.restore();}
// a pattern a node in between found by itself: 4 x 4 cells, rows of "1" and "0"
function dm_pattern(ctx,x,y,rows,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const k=ag_eo(clamp(a*1.4,0,1));ctx.translate(x,y);ctx.scale(0.7+0.3*k,0.7+0.3*k);
  ag_box(ctx,-46,-46,92,92,14,{});rows.forEach((r,j)=>[...r].forEach((v,i)=>{ctx.fillStyle=v==="1"?rgba(DM.ink,0.82):rgba([214,210,204],1);rr(ctx,-36+i*18.5,-36+j*18.5,16,16,3);ctx.fill();}));ctx.restore();}
const DM_PATTERNS=[["1000","1000","1000","1000"],["0000","1111","0000","0000"],["1000","0100","0010","0001"],["1111","1000","1000","1000"]];
// a large soft panel that holds a diagram on the wall
function dm_panel(ctx,x,y,w,h,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,28,{});ctx.restore();}
// a computer of the 1980s: a beige box and screen, a slow bar of work done (p)
function dm_oldComputer(ctx,x,y,p,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+150,y+290,200,24,0.25);
  ag_soft(ctx,cc=>ag_rect(cc,x,y+200,300,80,8),[214,204,180],[240,234,218],x+300,y+200,300,"rgba(60,50,30,0.35)",10);
  ag_soft(ctx,cc=>ag_rect(cc,x+30,y,240,200,14),[214,204,180],[240,234,218],x+270,y,300,"rgba(60,50,30,0.35)",10);
  ctx.fillStyle="#2C3A30";rr(ctx,x+52,y+22,196,150,8);ctx.fill();ctx.fillStyle="rgba(140,230,150,0.85)";ctx.fillRect(x+70,y+130,160*p,16);ctx.strokeStyle="rgba(140,230,150,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+70,y+130,160,16);
  ctx.fillStyle="rgba(140,230,150,0.7)";for(let i=0;i<3;i++)ctx.fillRect(x+70,y+44+i*22,90+((i*53)%60),8);ctx.restore();}

/* ---------------------------------------------------------------- 2012: photos, chips, and a contest
   dm_chip(ctx, x, y, s, wave, a): a graphics chip, its 512 small cores (16 x 32) lighting in waves; dm_hundred(ctx, x, y, miss, a, u): a
   hundred squares, the misses amber; dm_photos(ctx, x, y, n, a): labelled photos, in a stack that fans out */
function dm_chip(ctx,x,y,s,wave,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=300*s,h=170*s;ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,14*s),[44,70,86],[90,130,150],x+w,y,w,"rgba(0,0,0,0.4)",10);
  ctx.strokeStyle="rgba(200,190,150,0.8)";ctx.lineWidth=3*s;for(let k=0;k<10;k++){const px=x+22*s+k*(w-44*s)/9;ctx.beginPath();ctx.moveTo(px,y+h);ctx.lineTo(px,y+h+14*s);ctx.stroke();ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(px,y-14*s);ctx.stroke();}
  const cw=(w-40*s)/32,chh=(h-40*s)/16;for(let i=0;i<32;i++)for(let j=0;j<16;j++){const lit=wave==null?0:clamp(1-Math.abs(((i+j*0.6)/40-wave*1.4+0.2))*4,0,1);
    ctx.fillStyle=lit>0?rgba(mix([60,96,116],[170,220,240],lit),1):"rgba(60,96,116,1)";ctx.fillRect(x+20*s+i*cw,y+20*s+j*chh,cw-1.5*s,chh-1.5*s);}ctx.restore();}
function dm_hundred(ctx,x,y,miss,a,u){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const s=34,r=ag_rnd(miss*7+3),bad=new Set();while(bad.size<miss)bad.add(Math.floor(r()*100));
  let k=0;for(let j=0;j<10;j++)for(let i=0;i<10;i++,k++){const on=bad.has(k)&&(u==null||k/100<=u);ctx.fillStyle=on?rgba(AG.amber,0.9):rgba([216,214,208],1);rr(ctx,x+i*s,y+j*s,s-5,s-5,5);ctx.fill();}ctx.restore();}
function dm_photos(ctx,x,y,n,a,o){if(a<=0)return;o=o||{};ctx.save();ctx.globalAlpha*=a;const r=ag_rnd(77);
  for(let k=0;k<n;k++){const px=x+(k%6)*86+(Math.floor(k/6)%2)*14,py=y+Math.floor(k/6)*74,c1=[[96,140,170],[150,170,110],[190,140,90],[170,120,150],[110,150,140]][k%5];
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle="#FFFFFF";ctx.fillRect(px,py,76,62);ctx.restore();
    ctx.fillStyle=rgba(c1,1);ctx.fillRect(px+5,py+5,66,40);ctx.fillStyle=rgba(ag_dk(c1,0.3),1);ctx.beginPath();ctx.arc(px+24+r()*28,py+30,8+r()*6,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(AG.orange,0.85);ctx.fillRect(px+5,py+50,30+r()*30,6);}ctx.restore();}

/* ---------------------------------------------------------------- 2017: words read one at a time, then all at once
   dm_sentence(ctx, x, y, words, o): word cards in a row from (x, y); o.on(i) each card's light; o.arcs [[i, j, weight]] drawn above them;
   returns each card's middle */
function dm_sentence(ctx,x,y,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const gap=14,size=o.size||32,ws=words.map(wd=>ag_tw(ctx,wd,{w:700,size})+36),hk=o.arcH||0.32;
  if(o.center){const tot=ws.reduce((p,v)=>p+v,0)+gap*(words.length-1);x-=tot/2;}
  let xx=x;const mids=[];ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<words.length;i++){mids.push([xx+ws[i]/2,y]);xx+=ws[i]+gap;}
  for(const [i,j,wt,col] of (o.arcs||[])){if(wt<=0)continue;const A=mids[i],B=mids[j],h=36+Math.abs(B[0]-A[0])*hk;ctx.strokeStyle=rgba(col||AG.violet,0.25+0.7*wt);ctx.lineWidth=1.5+7*wt;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(A[0],y-34);ctx.bezierCurveTo(A[0],y-34-h,B[0],y-34-h,B[0],y-34);ctx.stroke();}
  for(let i=0;i<words.length;i++){const on=o.on?o.on(i):1,[mx]=mids[i],w=ws[i];ag_box(ctx,mx-w/2,y-30,w,60,14,{edge:on>0.5?AG.violet:null,edgeA:on});
    ag_T(ctx,words[i],mx,y+11,{w:700,size,align:"center",col:mix(AG.mut,AG.ink,on)});}
  ctx.restore();return mids;}
// a paper's first page: its title, the year, lines of text
function dm_paperSheet(ctx,x,y,title,yr,a,o){if(a<=0)return;o=o||{};const w=o.w||380,h=o.h||500,ts=o.size||32;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(46,38,28,0.28)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="#FBFAF7";ctx.fillRect(x,y,w,h);ctx.restore();
  const lh=ts*1.25,tl=ag_wrap(ctx,title,w-60,{w:800,size:ts});tl.forEach((l,i)=>ag_T(ctx,l,x+w/2,y+70+i*lh,{w:800,size:ts,align:"center"}));ag_T(ctx,yr,x+w/2,y+86+tl.length*lh,{w:600,size:32,align:"center",col:AG.mut});
  ctx.fillStyle="rgba(60,60,64,0.25)";const n=Math.floor((h-150-tl.length*lh)/24);for(let i=0;i<n;i++)ctx.fillRect(x+40,y+150+tl.length*lh+i*24,(i%4===3?0.6:1)*(w-80),8);ctx.restore();}

/* ---------------------------------------------------------------- 2018 to 2024: text in, answers ranked, steps, tools */
// pages and books flying into the model from the left, along gentle curves, smaller as they arrive (u: time in seconds; a)
function dm_textIn(ctx,tx,ty,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(let i=0;i<18;i++){const r=ag_rnd(i*29+7),sp=0.16+r()*0.06,ph=(u*sp+r())%1,sx=-90+r()*240,sy=330+r()*500;
    const e=ag_sine(ph),x=lerp(sx,tx,e),y=lerp(sy,ty,e)-Math.sin(Math.PI*ph)*(r()-0.3)*160,k=1.1-ph*0.85;
    ctx.save();ctx.globalAlpha*=Math.min(1,Math.sin(Math.PI*ph)*1.6);ctx.translate(x,y);ctx.scale(k,k);ctx.rotate((r()-0.5)*0.6+ph*0.4);
    if(i%4===0){const col=[[150,96,70],[70,96,130],[96,120,84]][i%3];ag_soft(ctx,cc=>ag_rect(cc,-44,-60,88,120,6),col,ag_lt(col,0.3),44,-60,110,"rgba(30,20,10,0.35)",6);
      ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(-36,-60,7,120);}
    else{ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle="#FFFFFF";ctx.fillRect(-42,-56,84,112);ctx.restore();
      ctx.fillStyle=rgba(AG.orange,0.55);for(let k2=0;k2<7;k2++)ctx.fillRect(-32,-42+k2*13,k2%3===2?38:62,5);}
    ctx.restore();}ctx.restore();}
// an answer card with a rank badge
function dm_answer(ctx,x,y,w,lines,rank,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=40+lines.length*38;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,16,{edge:o.edge,edgeA:o.edgeA});
  lines.forEach((l,i)=>ag_T(ctx,l,x+(rank?86:26),y+46+i*38,{w:o.bold?700:500,size:28,col:o.col||AG.ink}));
  if(rank){ctx.fillStyle=rgba(rank===1?AG.green:AG.mut,0.95);ctx.beginPath();ctx.arc(x+44,y+h/2,24,0,TAU);ctx.fill();ag_T(ctx,String(rank),x+44,y+h/2+11,{w:800,size:30,align:"center",col:[255,255,255]});}
  ctx.restore();return h;}
// the small pictures on the cards of the pieces that came together in 2012, and again at the end
const DM_ICONS={
  net:c=>{const P=dm_netPos(-54,-40,108,80,[3,4,2]);c.strokeStyle=rgba(AG.label,0.4);c.lineWidth=2;for(let l=0;l<2;l++)for(const A of P[l])for(const B of P[l+1]){c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke();}
    for(const L of P)for(const [x,y] of L){c.fillStyle=rgba(mix([226,224,236],AG.violet,0.6),1);c.beginPath();c.arc(x,y,9,0,TAU);c.fill();}},
  photos:c=>{for(const [dx,dy,col] of [[-30,-20,[96,140,170]],[0,-6,[150,170,110]],[30,8,[190,140,90]]]){c.save();c.shadowColor="rgba(46,38,28,0.25)";c.shadowBlur=6;c.fillStyle="#fff";c.fillRect(dx-34,dy-26,68,56);c.restore();
    c.fillStyle=rgba(col,1);c.fillRect(dx-29,dy-21,58,34);c.fillStyle=rgba(AG.orange,0.85);c.fillRect(dx-29,dy+18,28,5);}},
  chip:c=>dm_chip(c,-60,-34,0.4,0.5,1),
  pages:c=>{for(let k=2;k>=0;k--){c.fillStyle="#fff";c.save();c.shadowColor="rgba(46,38,28,0.25)";c.shadowBlur=6;c.fillRect(-40+k*12,-44+k*8,64,84);c.restore();c.fillStyle=rgba(AG.orange,0.55);for(let i=0;i<5;i++)c.fillRect(-32+k*12,-34+k*8+i*13,i%2?30:46,5);}},
  coins:c=>{for(const [x,y] of [[-30,20],[0,24],[30,20],[-16,4],[16,6],[0,-12]])ag_soft(c,cc=>cc.ellipse(x,y,22,13,0,0,TAU),[196,160,70],[250,226,150],x+6,y-4,20,"rgba(80,60,10,0.4)",3);}};
// the rail's focus over a chapter: keys [[t, year, ppy]]
function dm_railAt(ctx,t,keys,o){const yr=ag_keys(t,keys.map(k=>[k[0],k[1]])),ppy=ag_keys(t,keys.map(k=>[k[0],k[2]||40]));o=o||{};
  return dm_labRail(ctx,Object.assign({focus:yr,ppy,lit:y=>clamp(1-Math.abs(y-yr)/1.5,0,1)},o));}
