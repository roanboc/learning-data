/* ===== The draft and the decision: chess, 1997 to 2005, in ink line =====
   Four rooms, each with a table and a chessboard on it: the match in New York in May 1997, where an operator makes the computer's moves
   on the board and Kasparov sits across from him; a chess club, where players at their tables wonder what their skill is worth; the
   match in León in 1998, each player with a computer beside the board; and, for the online tournament of 2005, a room at night where two
   amateur players sit at one desk with three screens, a room where a team of grandmasters works with its computers, and the cold room
   of a supercomputer that plays alone. A drawing, not a likeness: nobody is drawn to look like the real players, and no logo, banner or
   program's screen is copied. The screens show only a small board. Every name this file declares starts with ddc_ or DDC_. */
const DDC_E=400,DDC_F=900;                                       // the eye line, and the floor where the players sit
const ddc_h=fl=>PK.hAt(fl,DDC_E);
const DDC_PAL={hall:[70,78,98],hall2:[54,60,80],stage:[150,112,82],club:[216,204,178],club2:[196,182,156],leon:[226,214,196],arch:[204,186,160],
  night:[60,66,96],night2:[84,88,118],home:[204,196,176],rack:[64,70,84],rack2:[44,48,60],cold:[150,170,188],cold2:[120,140,160],
  sq1:[236,222,190],sq2:[150,108,76],wood:[160,116,78],wood2:[128,90,60],lamp:[246,214,140]};
const ddc_c=k=>PK.S.tone(DDC_PAL[k]);

/* ---------------------------------------------------------------- the people: nobody's likeness, dressed as players dress */
const DDC_FOLK={
  kasp:{key:"kasp",name:"Garry Kasparov",role:"",skin:[226,186,156],hair:{style:"short",c:[36,30,30]},top:{kind:"jacket",c:[52,56,70],inner:[236,232,226]},bottom:{kind:"trousers",c:[52,56,70]},shoe:[36,34,36]},
  oper:{key:"oper",name:"",skin:[214,170,136],hair:{style:"crop",c:[40,34,34]},glasses:[50,46,46],top:{kind:"jacket",c:[88,92,104],inner:[226,232,236]},bottom:{kind:"trousers",c:[70,72,82]},shoe:[40,38,40]},
  topa:{key:"topa",name:"Veselin Topalov",role:"",skin:[230,194,164],hair:{style:"short",c:[64,50,40]},top:{kind:"jacket",c:[112,108,104],inner:[232,228,220]},bottom:{kind:"trousers",c:[92,90,88]},shoe:[46,40,40]},
  am1:{key:"am1",name:"",skin:[236,200,170],hair:{style:"short",c:[120,84,52]},glasses:[60,50,50],top:{kind:"sweater",c:[86,120,96]},bottom:{kind:"trousers",c:[70,80,100]},shoe:[70,60,52]},
  am2:{key:"am2",name:"",skin:[200,152,118],hair:{style:"crop",c:[34,28,26]},top:{kind:"sweater",c:[150,104,80]},bottom:{kind:"trousers",c:[60,64,76]},shoe:[60,52,48]},
  gm1:{key:"gm1",name:"",skin:[224,184,150],hair:{style:"short",c:[150,146,140]},glasses:[60,52,50],top:{kind:"jacket",c:[60,74,92],inner:[234,230,224]},bottom:{kind:"trousers",c:[60,74,92]},shoe:[40,36,36]},
  gm2:{key:"gm2",name:"",skin:[238,206,180],hair:{style:"bob",c:[92,60,40]},top:{kind:"jacket",c:[120,70,74],inner:[236,228,214]},bottom:{kind:"trousers",c:[70,64,70]},shoe:[44,38,40]}};
const ddc_row=w=>typeof w==="string"?(DDC_FOLK[w]||PK.CAST[w]):w;
const ddc_person=(ctx,who,x,fl,pose,o)=>PK.person(ctx,ddc_row(who),x,fl,ddc_h(fl),pose,o);
const ddc_walk=(ctx,who,t,w,o)=>PK.walk(ctx,ddc_row(who),t,Object.assign({h:ddc_h(w.floor)},w),o);

/* ---------------------------------------------------------------- the rooms, painted once */
function ddc_floor(ctx,col,y0,lines){const S=PK.S;S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,y0,1],[1940,y0,1],[1940,1100,1],[-20,1100,1]],col,{exact:true,grad:[0,y0,0,1080,0.1]});
  S.line(ctx,c=>{for(let y=y0+50;y<1080;y+=lines){c.moveTo(-20,y);c.lineTo(1940,y);}},PK.u.dk(col,0.12),0.5);}
// New York, 1997: a stage under low light, a curtain behind, the audience's dark beyond the edge of the stage
AG_PLACES.ddcHall=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(ddc_c("hall2"));ctx.fillRect(0,0,1920,1080);S.begin(ctx,{lw:2.4,far:0.3,sh:3});
  S.fill(ctx,c=>c.rect(120,60,1680,720),ddc_c("hall"),{grad:[0,60,0,780,0.12]});
  S.line(ctx,c=>{for(let x=180;x<1800;x+=90){c.moveTo(x,70);c.quadraticCurveTo(x+12,420,x,770);}},U.dk(ddc_c("hall"),0.2),0.5);
  S.fill(ctx,c=>c.rect(80,40,1760,40),U.dk(ddc_c("hall"),0.25),{});ddc_floor(ctx,ddc_c("stage"),780,70);};
// a chess club: wood-panelled walls, two tall windows
AG_PLACES.ddcClub=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(ddc_c("club"));ctx.fillRect(0,0,1920,800);S.begin(ctx,{lw:2.4,far:0.2,sh:3});
  S.fill(ctx,c=>c.rect(-20,520,1960,280),ddc_c("club2"),{});S.line(ctx,c=>{for(let x=60;x<1920;x+=240){c.moveTo(x,530);c.lineTo(x,790);}},U.dk(ddc_c("club2"),0.15),0.5);
  for(const wx of [360,1240])PK.window(ctx,wx,120,320,340,null,{});ddc_floor(ctx,ddc_c("wood"),800,60);};
// León, 1998: a warm hall with two arches
AG_PLACES.ddcLeon=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(ddc_c("leon"));ctx.fillRect(0,0,1920,800);S.begin(ctx,{lw:2.6,far:0.2,sh:3});
  for(const ax of [300,1180])S.fill(ctx,c=>{c.moveTo(ax,780);c.lineTo(ax,300);c.arc(ax+220,300,220,Math.PI,0);c.lineTo(ax+440,780);c.closePath();},ddc_c("arch"),{});
  S.fill(ctx,c=>c.rect(-20,760,1960,40),U.dk(ddc_c("arch"),0.12),{});ddc_floor(ctx,ddc_c("stage"),800,70);};
// a room at night: a dark window, a lamp's warm light on the wall
AG_PLACES.ddcHome=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(ddc_c("home"));ctx.fillRect(0,0,1920,800);S.begin(ctx,{lw:2.4,far:0.2,sh:3});
  const g=ctx.createRadialGradient(1500,300,40,1500,300,700);g.addColorStop(0,U.css(ddc_c("lamp"),0.5));g.addColorStop(1,U.css(ddc_c("lamp"),0));ctx.fillStyle=g;ctx.fillRect(0,0,1920,800);
  S.fill(ctx,c=>c.rect(300,140,520,380),ddc_c("night"),{grad:[0,140,0,520,0.2]});
  ctx.fillStyle=U.css([240,236,210],0.8);for(const [sx,sy] of [[380,200],[520,260],[700,190],[610,330],[760,420],[430,400]]){ctx.beginPath();ctx.arc(sx,sy,3,0,7);ctx.fill();}
  S.line(ctx,c=>{c.rect(300,140,520,380);c.moveTo(560,140);c.lineTo(560,520);},ddc_c("wood2"),1.4);
  S.fill(ctx,c=>c.rect(1440,140,120,20),ddc_c("wood2"),{});S.fill(ctx,c=>{c.moveTo(1450,160);c.lineTo(1550,160);c.lineTo(1580,240);c.lineTo(1420,240);c.closePath();},ddc_c("lamp"),{});
  ddc_floor(ctx,ddc_c("wood"),800,60);};
// the supercomputer's cold room: racks of machines in rows, their small lights
AG_PLACES.ddcRack=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(ddc_c("cold2"));ctx.fillRect(0,0,1920,1080);S.begin(ctx,{lw:2.4,far:0.2,sh:3});
  S.fill(ctx,c=>c.rect(-20,80,1960,700),ddc_c("cold"),{grad:[0,80,0,780,0.1]});ddc_floor(ctx,U.dk(ddc_c("cold2"),0.1),780,50);
  for(let i=0;i<7;i++){const x=180+i*240;S.fill(ctx,c=>c.rect(x,240,180,560),ddc_c(i%2?"rack":"rack2"),{grad:[x,0,x+180,0,0.1]});
    S.line(ctx,c=>{for(let y=280;y<780;y+=60){c.moveTo(x+14,y);c.lineTo(x+166,y);}},U.dk(ddc_c("rack"),0.3),0.5);}};
// the lights on the racks, blinking slowly (drawn in the scene, as they move)
function ddc_lights(ctx,t){const U=PK.u;for(let i=0;i<7;i++)for(let r=0;r<8;r++){const on=0.5+0.5*Math.sin(t*1.3+i*1.7+r*2.3);ctx.fillStyle=U.css(r%3?[120,220,160]:[240,190,90],0.35+0.6*on);
  ctx.beginPath();ctx.arc(180+i*240+150,300+r*60,5,0,7);ctx.fill();}}

/* ---------------------------------------------------------------- a chessboard on a table, seen from the side, its pieces standing
   x: its middle; y: the table's top; k: its size (1 for the 1920 frame at the players' floor); o.moved (0 to 1): one piece slides */
function ddc_board(ctx,x,y,k,o){o=o||{};const S=PK.S,U=PK.u,w=200*k,d=34*k,th=10*k;S.begin(ctx,{lw:2.2*k,sh:3});
  S.fill(ctx,c=>c.rect(x-w/2,y-th,w,th),ddc_c("wood2"),{});
  for(let r=0;r<4;r++)for(let f=0;f<8;f++){const y0=y-th-d*(r+1)/4,y1=y-th-d*r/4,sk=(r)*6*k,sk1=(r+1)*6*k,c0=(r+f)%2?ddc_c("sq2"):ddc_c("sq1");
    const xa=x-w/2+sk+(w-2*sk)*f/8,xb=x-w/2+sk+(w-2*sk)*(f+1)/8,xc=x-w/2+sk1+(w-2*sk1)*(f+1)/8,xd=x-w/2+sk1+(w-2*sk1)*f/8;
    S.fill(ctx,c=>{c.moveTo(xa,y1);c.lineTo(xb,y1);c.lineTo(xc,y0);c.lineTo(xd,y0);c.closePath();},c0,{line:false,flat:true});}
  S.line(ctx,c=>{c.moveTo(x-w/2,y-th);c.lineTo(x-w/2+24*k,y-th-d);c.lineTo(x+w/2-24*k,y-th-d);c.lineTo(x+w/2,y-th);},PK.C.ink,0.8);
  // the pieces: a few of each side, far rows first
  const P=[[1,3,0,1.2],[6,3,1,1],[2,2,0,1],[5,2,1,1.6],[3,1,0,1.4],[4,1,1,1],[1,0,1,1],[6,0,0,1.1]];
  for(const [f,r,dark,tall] of P){let px=x-w/2+(w-r*12*k)*(f+0.5)/8+r*6*k;if(o.moved!=null&&f===3&&r===1)px+=U.sine(U.clamp(o.moved,0,1))*w/8;
    const py=y-th-d*(r+0.5)/4,ph=22*k*tall,pw=7*k;
    S.fill(ctx,c=>{c.moveTo(px-pw,py);c.quadraticCurveTo(px-pw*0.4,py-ph*0.5,px-pw*0.35,py-ph*0.8);c.arc(px,py-ph*0.85,pw*0.55,Math.PI,0);c.lineTo(px+pw*0.35,py-ph*0.8);c.quadraticCurveTo(px+pw*0.4,py-ph*0.5,px+pw,py);c.closePath();},
      dark?[52,44,48]:[246,240,226],{w:0.6});}}
// what a screen shows: a small board, its squares only
const ddc_screen=(cc,x,y,w,h)=>{const U=PK.u,n=6,s=Math.min(w,h)*0.8/n,x0=x+(w-n*s)/2,y0=y+(h-n*s)/2;for(let i=0;i<n;i++)for(let j=0;j<n;j++){cc.fillStyle=U.css((i+j)%2?[120,140,120]:[220,226,210]);cc.fillRect(x0+i*s,y0+j*s,s,s);}};

/* ---------------------------------------------------------------- two at one table, across a board from each other
   L and R: who sits at the left (facing right) and at the right; xm the board's middle; gap from it to each player; o.left, o.right:
   what PK.atDesk takes for each (screen, show, faces); o.moved: a piece slides. Returns {l, r}: their joints */
function ddc_match(x,tt,L,R,xm,o){o=o||{};const fl=o.fl||DDC_F,h=ddc_h(fl),gap=o.gap||0.62*h,w=gap-0.1*h,r={};
  r.l=ddc_desk(x,L,xm-gap,fl,h,Object.assign({t:tt,w,screen:null,work:0},o.left||{}));
  r.r=ddc_desk(x,R,xm+gap,fl,h,Object.assign({t:tt+2,w,flip:true,screen:null,work:0,on2:(cc,D)=>ddc_board(cc,xm,D.top,h/560,{moved:o.moved})},o.right||{}));
  return r;}
/* someone at a desk with a screen on it: PK.atDesk, with the screen drawn on the desk (o.on), so the kit's checks follow the person as
   someone in the room (an o.screen passed on to the person would mark them as someone seen on a screen). o.screen: "monitor" or
   "laptop"; o.sx, o.sw, o.sh, o.show as PK.atDesk takes them; o.on2 draws more on the desk */
function ddc_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on2||o.on;delete o.on2;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,ddc_row(who),px,fl,h,o);}
