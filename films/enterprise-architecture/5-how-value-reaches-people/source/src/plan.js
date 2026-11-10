/* ===== How value reaches people: the film's own pictures (prefixed d5_) =====
   Mumbai: a hazy morning over the city, a home with its kitchen lit, two stations on the suburban railway, a train, an office tower,
   dabbawalas in white (on a bicycle, sorting on a platform, carrying a crate of tins on the head), the tins themselves, and a lid with
   its painted marks. Hill Street: a night street in a storm, its tree, its poles and line, a branch that falls, a wire down, windows
   that go dark and come back. On the wall: the value stream's stages as chevrons (amber paper while drafts, glass once confirmed),
   swimlanes for three teams, a process map in four groups, process steps, a SIPOC, a BPMN diagram for who goes first, fault cards,
   crew vans, and data objects. People and lunches are drawn in the series' own style, not in the style of Indian art (PLAYBOOK §2). */

const STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],CAPP=[255,224,170],CAPD=[150,98,36],INFP=[255,212,188],INFD=[150,76,48];
const CLOTH=[238,234,224],D5_SKIN=[[140,94,64],[120,80,56],[156,104,72],[132,88,60]];

/* ---------- Mumbai ---------- */
// the sky, in screen space: a hazy morning, warmer towards the afternoon as pm goes to 1
function d5_sky(ctx,S,pm){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,rgba(mix([84,106,140],[86,74,104],pm),1));g.addColorStop(0.42,rgba(mix([178,170,166],[206,150,116],pm),1));g.addColorStop(0.58,rgba(mix([232,208,170],[242,176,112],pm),1));g.addColorStop(1,"#241c18");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);glow(ctx,lerp(1480,620,pm),lerp(300,400,pm),520,[255,236,196],0.22);}
// the city behind: towers in the haze, far then near, a few windows lit
function d5_skyline(ctx,pm){[[0.32,580,0],[0.62,624,1]].forEach(([fade,base,k])=>{for(let i=0;i<46;i++){const x=-1020+i*72+hash(i,60+k)*30,w=44+hash(i,61+k)*58,h=(k?60:110)+hash(i,62+k)*(k?120:190);
    ctx.fillStyle=rgba(mix(mix([150,140,148],[104,92,98],k),[210,160,124],pm*0.3),fade);ctx.fillRect(x,base-h,w,h);
    if(k)for(let r=0;r<Math.floor(h/22)-1;r++)for(let c=0;c<Math.floor(w/16)-1;c++)if(hash(i*31+r*7+c,63)>0.74){ctx.fillStyle="rgba(255,226,170,0.16)";ctx.fillRect(x+6+c*16,base-h+10+r*22,7,9);}}});}
// the ground: the railway on its bank, then the road in front
function d5_ground(ctx){const g=ctx.createLinearGradient(0,620,0,1080);g.addColorStop(0,"#3a302a");g.addColorStop(1,"#18130f");ctx.fillStyle=g;ctx.fillRect(-1100,620,W+1500,700);
  ctx.fillStyle="#2c2622";ctx.fillRect(-1100,700,W+1500,22);ctx.strokeStyle="rgba(150,140,130,0.45)";ctx.lineWidth=2;for(let x=-1100;x<W+400;x+=18){ctx.beginPath();ctx.moveTo(x,701);ctx.lineTo(x+8,718);ctx.stroke();}
  ctx.strokeStyle="rgba(206,200,192,0.75)";ctx.lineWidth=3;[698,705].forEach(y=>{ctx.beginPath();ctx.moveTo(-1100,y);ctx.lineTo(W+400,y);ctx.stroke();});
  ctx.fillStyle="#463c35";ctx.fillRect(-1100,762,W+1500,52);ctx.strokeStyle="rgba(230,214,180,0.3)";ctx.setLineDash([30,26]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-1100,788);ctx.lineTo(W+400,788);ctx.stroke();ctx.setLineDash([]);}
// a home: a low block of flats, its kitchen window lit (k: how bright), a door on the right
function d5_home(ctx,x,y,t,k){ctx.save();const w=290,h=240,g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"#b98a64");g.addColorStop(1,"#8a6448");ctx.fillStyle=g;ctx.fillRect(x,y-h,w,h);
  ctx.fillStyle="#6e4e3a";ctx.fillRect(x-8,y-h-12,w+16,14);
  // balconies with plants, and windows
  for(let f=0;f<2;f++){ctx.fillStyle="rgba(40,28,22,0.55)";ctx.fillRect(x+20,y-h+30+f*90,w-40,6);for(let i=0;i<3;i++){const wx=x+34+i*86;ctx.fillStyle=f===1&&i===0?rgba([255,214,150],0.4+0.5*k):"rgba(50,40,40,0.75)";ctx.fillRect(wx,y-h+44+f*90,54,40);}
    ctx.fillStyle="#4f7a46";for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(x+40+i*52,y-h+28+f*90,10,7+2*Math.sin(t*1.3+i+f),0,0,TAU);ctx.fill();}}
  if(k>0)glow(ctx,x+61,y-h+154,70,[255,210,140],0.35*k);
  ctx.fillStyle="#3a2a22";ctx.fillRect(x+w-54,y-74,36,74);ctx.restore();}
// a station: a platform in front of the track, and a canopy on posts (draw the platform after the train)
function d5_canopy(ctx,x0,x1){ctx.save();for(let x=x0+16;x<x1;x+=92){ctx.fillStyle="#3c4448";ctx.fillRect(x,548,8,136);}
  ctx.fillStyle="#56656a";ctx.beginPath();ctx.moveTo(x0-34,556);ctx.lineTo(x1+34,556);ctx.lineTo(x1+12,532);ctx.lineTo(x0-12,532);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(255,236,190,0.14)";ctx.fillRect(x0-34,556,x1-x0+68,6);ctx.restore();}
function d5_platform(ctx,x0,x1){ctx.save();ctx.fillStyle="#6e645a";ctx.fillRect(x0,680,x1-x0,10);ctx.fillStyle="#4a423b";ctx.fillRect(x0,690,x1-x0,40);
  ctx.strokeStyle="rgba(240,220,170,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,681);ctx.lineTo(x1,681);ctx.stroke();ctx.restore();}
// a suburban train of two carriages, centred at cx on the track, doors open; o.crate shows a crate of tins in the first door
function d5_train(ctx,cx,o){o=o||{};ctx.save();const cw=200,gap=8,x0=cx-cw-gap/2,y=598;
  for(let c=0;c<2;c++){const x=x0+c*(cw+gap),g=ctx.createLinearGradient(0,y,0,y+100);g.addColorStop(0,"#9aa4ac");g.addColorStop(1,"#6c757c");ctx.fillStyle=g;rr(ctx,x,y,cw,100,12);ctx.fill();
    ctx.fillStyle="rgba(176,96,64,0.9)";ctx.fillRect(x,y+64,cw,8);ctx.fillStyle="rgba(30,34,40,0.9)";for(let i=0;i<4;i++)if(i!==1)ctx.fillRect(x+14+i*46,y+18,34,30);
    ctx.fillStyle="#1c1f24";ctx.fillRect(x+60,y+14,34,84);ctx.fillStyle="#262a30";ctx.fillRect(x+150,y+14,30,84);
    ctx.fillStyle="#2a2e33";[[x+30,y+100],[x+cw-30,y+100]].forEach(([wx,wy])=>{ctx.beginPath();ctx.arc(wx,wy,7,0,TAU);ctx.fill();});}
  if(o.crate)d5_crate(ctx,x0+77,y+70,30,2,0.6);
  ctx.restore();}
// a tin (dabba): three stacked tiers and a handle, standing at (x,y); o.hi rings it, o.mark paints a colour on its lid
function d5_tin(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(o.hi)glow(ctx,0,-26,44,[255,222,160],0.55*o.hi);
  for(let k=0;k<3;k++){const yy=-14-k*14,g=ctx.createLinearGradient(-11,0,11,0);g.addColorStop(0,"#d8dde0");g.addColorStop(0.5,"#a8b0b6");g.addColorStop(1,"#6e767c");ctx.fillStyle=g;rr(ctx,-11,yy,22,13,3);ctx.fill();
    ctx.strokeStyle="rgba(60,64,70,0.6)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-11,yy+13);ctx.lineTo(11,yy+13);ctx.stroke();}
  ctx.fillStyle="#c8ced2";ctx.beginPath();ctx.ellipse(0,-42,11,3,0,0,TAU);ctx.fill();if(o.mark){ctx.fillStyle=rgba(o.mark,1);ctx.fillRect(-4,-44,8,3);}
  ctx.strokeStyle="#8a9298";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-36);ctx.lineTo(-9,-50);ctx.quadraticCurveTo(0,-58,9,-50);ctx.lineTo(9,-36);ctx.stroke();ctx.restore();});}
// a long wooden crate with n tins on it, its middle at (x,y)
function d5_crate(ctx,x,y,w,n,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#8a5e3a";ctx.fillRect(-w,-8,2*w,9);ctx.fillStyle="#6a4428";ctx.fillRect(-w,-2,2*w,3);
  for(let i=0;i<n;i++)d5_tin(ctx,-w+12+i*((2*w-24)/Math.max(1,n-1)),-8,0.9,{mark:[[200,60,50],[60,110,190],[230,170,60]][i%3]});ctx.restore();}
// a dabbawala, feet at (x,y): white kurta and pyjama, a white cap. mode: stand, walk, carry (a crate of tins on his head), sort (holding
// a tin out); ph the stride; dir which way he faces
function d5_man(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const mode=o.mode||"stand",ph=o.ph||0,dir=o.dir||1,t=o.t||0,skin=D5_SKIN[(o.seed||0)%4],walk=mode==="walk"||mode==="carry"?(o.go==null?1:o.go):0;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);
    const bob=-2.5*walk*Math.abs(Math.sin(ph)),br=Math.sin(t*1.7+(o.seed||0))*1.0*(1-walk),hip=[0,-58+bob],sh=[1.5*walk,-98+bob+br];
    ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,2,22,4.5,0,0,TAU);ctx.fill();
    const V=(an,l)=>[Math.sin(an)*l,Math.cos(an)*l];
    const leg=(p,dk)=>{const th=walk*0.42*Math.sin(p),kn=walk*0.55*Math.max(0,Math.sin(p+1.3)),k=[hip[0]+V(th,28)[0],hip[1]+V(th,28)[1]],f=[k[0]+V(th-kn,30)[0],k[1]+V(th-kn,30)[1]],c=rgba(dk?mix(CLOTH,[90,86,80],0.35):mix(CLOTH,[120,114,104],0.12),1);
      ctx.strokeStyle=c;ctx.lineCap="round";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(hip[0],hip[1]);ctx.lineTo(k[0],k[1]);ctx.lineTo(f[0],f[1]);ctx.stroke();
      ctx.strokeStyle=rgba(dk?[60,44,32]:[90,66,46],1);ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(f[0]-4,f[1]+1);ctx.lineTo(f[0]+9,f[1]+1);ctx.stroke();};
    const arm=(p,dk,front)=>{let e,h;
      if(mode==="carry"){e=[sh[0]+(front?17:-14),sh[1]-20];h=[sh[0]+(front?20:-18),sh[1]-46];}
      else if(mode==="sort"&&front){e=[sh[0]+12,sh[1]+22];h=[sh[0]+32,sh[1]+30];}
      else{const ua=-walk*0.6*Math.sin(p)+(1-walk)*(dk?0.1:-0.06),el=0.25+walk*0.5;e=[sh[0]+V(ua,22)[0],sh[1]+V(ua,22)[1]];h=[e[0]+V(ua+el,21)[0],e[1]+V(ua+el,21)[1]];}
      ctx.strokeStyle=rgba(dk?mix(CLOTH,[90,86,80],0.35):CLOTH,1);ctx.lineCap="round";ctx.lineWidth=7.5;ctx.beginPath();ctx.moveTo(sh[0],sh[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();
      ctx.strokeStyle=rgba(dk?mix(skin,[0,0,0],0.3):skin,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(h[0],h[1]);ctx.stroke();return h;};
    leg(ph+Math.PI,true);arm(ph,true,false);leg(ph,false);
    // the kurta: shoulders to the knee, its hem swinging a little
    const sw=walk*3*Math.sin(ph*2),g=ctx.createLinearGradient(-18,0,18,0);g.addColorStop(0,"#fbf8f0");g.addColorStop(1,"#b8b2a6");ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(sh[0]-14,sh[1]+2);ctx.quadraticCurveTo(sh[0],sh[1]-5,sh[0]+14,sh[1]+2);ctx.lineTo(hip[0]+17+sw,hip[1]+24);ctx.quadraticCurveTo(hip[0],hip[1]+29,hip[0]-17+sw*0.6,hip[1]+24);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(150,144,132,0.5)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(sh[0]+1,sh[1]+2);ctx.lineTo(sh[0]+1,sh[1]+24);ctx.stroke();
    // the head, and the white cap
    const hx=sh[0]+2,hy=sh[1]-17;ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hx,hy,10,11.5,0.05,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(28,22,20,1)";ctx.beginPath();ctx.ellipse(hx-6,hy+1,4,7,0.1,0,TAU);ctx.fill();
    ctx.fillStyle="#f6f3ec";ctx.beginPath();ctx.moveTo(hx-12,hy-6);ctx.lineTo(hx+11,hy-6);ctx.lineTo(hx+8,hy-15);ctx.quadraticCurveTo(hx,hy-18,hx-9,hy-15);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(150,144,132,0.6)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(hx-12,hy-6);ctx.lineTo(hx+11,hy-6);ctx.stroke();
    const hand=arm(ph+Math.PI,false,true);
    if(mode==="carry")d5_crate(ctx,sh[0]+2,sh[1]-46,44,o.n||4,1);
    if(mode==="sort"&&o.tin)d5_tin(ctx,hand[0],hand[1]+14,0.8,{hi:o.tin});
    ctx.restore();});}
// a dabbawala on a bicycle, the bottom of its wheels at (x,y), tins hanging from the handlebar; crank: the pedals' angle
function d5_cyclist(ctx,x,y,s,crank,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const skin=D5_SKIN[(o.seed||0)%4],t=o.t||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,2,60,5,0,0,TAU);ctx.fill();
  const R=24,bw=[-36,-R],fw=[38,-R],bb=[0,-R-2],seat=[-12,-70],head=[28,-70],bar=[32,-82];
  [bw,fw].forEach(([wx,wy])=>{ctx.strokeStyle="#2a2a30";ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(wx,wy,R,0,TAU);ctx.stroke();ctx.strokeStyle="rgba(150,150,160,0.5)";ctx.lineWidth=1;for(let k=0;k<6;k++){const an=crank*1.6+k*Math.PI/3;ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(wx+Math.cos(an)*R,wy+Math.sin(an)*R);ctx.stroke();}});
  ctx.strokeStyle="#3a3e46";ctx.lineWidth=4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(bw[0],bw[1]);ctx.lineTo(bb[0],bb[1]);ctx.lineTo(seat[0],seat[1]);ctx.closePath();ctx.moveTo(bb[0],bb[1]);ctx.lineTo(head[0],head[1]);ctx.lineTo(seat[0]+4,seat[1]+6);ctx.moveTo(head[0],head[1]);ctx.lineTo(fw[0],fw[1]);ctx.moveTo(head[0],head[1]);ctx.lineTo(bar[0],bar[1]);ctx.stroke();
  ctx.fillStyle="#2a2a30";rr(ctx,seat[0]-10,seat[1]-5,20,6,3);ctx.fill();ctx.strokeStyle="#2a2a30";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bar[0]-6,bar[1]);ctx.lineTo(bar[0]+8,bar[1]-2);ctx.stroke();
  // the tins on the handlebar, and on the carrier behind
  for(let i=0;i<(o.n==null?3:o.n);i++)d5_tin(ctx,bar[0]+2+i*8,bar[1]+44,0.85,{hi:i===0?o.hi||0:0,mark:[[200,60,50],[60,110,190],[230,170,60]][i%3]});
  d5_crate(ctx,bw[0]+4,seat[1]+18,22,2,0.8);
  // the rider: legs to the pedals, a white kurta, a cap
  const P=k=>[bb[0]+Math.cos(crank+k*Math.PI)*10,bb[1]+Math.sin(crank+k*Math.PI)*10],hip=[seat[0]+2,seat[1]-6],L1=31,L2=33;
  const legTo=(f,dk)=>{const dx=f[0]-hip[0],dy=f[1]-hip[1],d=Math.min(L1+L2-0.5,Math.hypot(dx,dy)),an=Math.atan2(dy,dx),al=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),k=[hip[0]+Math.cos(an-al)*L1,hip[1]+Math.sin(an-al)*L1];
    ctx.strokeStyle=rgba(dk?mix(CLOTH,[90,86,80],0.35):mix(CLOTH,[120,114,104],0.12),1);ctx.lineCap="round";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(hip[0],hip[1]);ctx.lineTo(k[0],k[1]);ctx.lineTo(f[0],f[1]);ctx.stroke();};
  legTo(P(1),true);
  const sh=[hip[0]+20,hip[1]-38];ctx.fillStyle="#f2eee5";ctx.beginPath();ctx.moveTo(sh[0]-12,sh[1]);ctx.lineTo(sh[0]+12,sh[1]+4);ctx.lineTo(hip[0]+16,hip[1]+12);ctx.lineTo(hip[0]-14,hip[1]+10);ctx.closePath();ctx.fill();
  legTo(P(0),false);
  ctx.strokeStyle=rgba(CLOTH,1);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(sh[0],sh[1]);ctx.lineTo(bar[0]-6,bar[1]+2);ctx.stroke();
  const hx=sh[0]+6,hy=sh[1]-16;ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hx,hy,10,11.5,0.1,0,TAU);ctx.fill();
  ctx.fillStyle="#f6f3ec";ctx.beginPath();ctx.moveTo(hx-12,hy-6);ctx.lineTo(hx+11,hy-6);ctx.lineTo(hx+8,hy-15);ctx.quadraticCurveTo(hx,hy-18,hx-9,hy-15);ctx.closePath();ctx.fill();
  ctx.restore();});}
// an office tower: a grid of windows; lit (0..1) lights one of them, where the lunch arrives
function d5_tower(ctx,x,y,w,h,lit){ctx.save();const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"#4c5a68");g.addColorStop(1,"#2e3843");ctx.fillStyle=g;ctx.fillRect(x,y-h,w,h);
  for(let r=0;r<Math.floor(h/34)-1;r++)for(let c=0;c<4;c++){const on=r===5&&c===2?lit:0;ctx.fillStyle=on>0?rgba(mix([60,80,100],[255,214,150],on),1):hash(r*5+c,70)>0.6?"rgba(255,226,170,0.25)":"rgba(20,30,40,0.6)";ctx.fillRect(x+16+c*(w-32)/4,y-h+18+r*34,(w-32)/4-10,22);}
  if(lit>0)glow(ctx,x+16+2*(w-32)/4+20,y-h+18+5*34+11,60,[255,214,150],0.4*lit);
  ctx.fillStyle="#1e252c";ctx.fillRect(x+w/2-24,y-70,48,70);ctx.restore();}
// a lid, from above, with its painted marks (illustrative: the real code varies); p brings each mark in, lab (0..1) its labels
function d5_lid(ctx,cx,cy,r,p,lab){ctx.save();const g=ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,r*0.1,cx,cy,r);g.addColorStop(0,"#e6eaec");g.addColorStop(1,"#8a9298");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(60,64,70,0.6)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r*0.92,0,TAU);ctx.stroke();
  const q=i=>clamp(p*4-i,0,1);
  withA(ctx,q(0),()=>{ctx.strokeStyle="rgba(196,52,44,0.95)";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-r*0.62,cy-r*0.42);ctx.lineTo(cx-r*0.38,cy-r*0.18);ctx.moveTo(cx-r*0.38,cy-r*0.42);ctx.lineTo(cx-r*0.62,cy-r*0.18);ctx.stroke();});
  withA(ctx,q(1),()=>T(ctx,"9",cx+4,cy+r*0.2,{w:800,size:r*0.8,align:"center",color:"rgba(40,60,140,0.95)"}));
  withA(ctx,q(2),()=>T(ctx,"12",cx+r*0.5,cy+r*0.62,{w:800,size:r*0.34,align:"center",color:"rgba(30,30,36,0.95)"}));
  withA(ctx,q(3),()=>T(ctx,"3",cx-r*0.46,cy+r*0.62,{w:800,size:r*0.34,align:"center",color:"rgba(30,30,36,0.95)"}));
  if(lab>0)withA(ctx,lab,()=>{const L=(s_,x0,y0,x1,y1,al)=>{ctx.strokeStyle="rgba(238,224,196,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();T(ctx,s_,x1+(al==="right"?-8:8),y1+10,{w:700,size:30,align:al,color:rgba(PARCH,1)});};
    L("station",cx+r*0.2,cy-r*0.1,cx+r*1.25,cy-r*0.55,"left");L("building",cx+r*0.6,cy+r*0.55,cx+r*1.25,cy+r*0.75,"left");L("floor",cx-r*0.55,cy+r*0.55,cx-r*1.2,cy+r*0.75,"right");});
  ctx.restore();}
// a hand-off: a ring on the route, glowing as a tin passes (g: 0..1)
function d5_ring(ctx,x,y,g,col){col=col||[255,214,150];ctx.save();ctx.strokeStyle=rgba(col,0.35+0.6*g);ctx.lineWidth=2.5+2*g;ctx.beginPath();ctx.arc(x,y,18+6*g,0,TAU);ctx.stroke();ctx.restore();if(g>0.05)glow(ctx,x,y,60,col,0.35*g);}

/* ---------- Mumbai, from above ---------- */
// A sketch of the city's shape, not a survey: the long peninsula between the Arabian Sea and the harbour, the mainland across the
// creek, and the two main suburban lines, Western and Central, from the south up through the suburbs. No national borders are drawn.
const D5_LAND=[[800,40],[778,120],[760,200],[742,280],[730,350],[738,420],[722,490],[730,560],[752,630],[780,700],[808,770],[832,840],[850,900],[866,960],[878,1010],[892,1032],[906,1012],
  [912,960],[924,900],[946,840],[972,790],[992,730],[1004,670],[1030,610],[1066,560],[1092,500],[1084,430],[1100,360],[1128,290],[1124,210],[1112,130],[1104,40]];
const D5_MAIN=[[1190,-80],[1230,120],[1212,260],[1182,380],[1150,470],[1170,560],[1222,660],[1262,800],[1300,1160],[2400,1160],[2400,-80]];
const D5_WEST=[[862,980],[850,920],[830,850],[806,780],[782,710],[766,640],[758,570],[764,500],[760,430],[768,360],[778,290],[790,220],[802,150],[812,40]];
const D5_CENT=[[900,990],[912,930],[934,860],[960,800],[972,740],[968,680],[958,620],[972,560],[1000,500],[1030,440],[1052,380],[1070,310],[1080,230],[1088,140],[1094,40]];
const D5_STNS=[[790,220],[766,640],[850,920],[1080,230],[968,680],[912,930]],D5_HOMEM=[738,236],D5_OFFM=[884,950];
const D5_LW=mk(D5_WEST.map(([x,y])=>P(x,y))),D5_LC=mk(D5_CENT.map(([x,y])=>P(x,y)));
// o.lines draws the railway in; o.home and o.office light the kitchen and the office; o.route draws the lunch's way between them;
// o.flow (south, in the morning) and o.back (north, in the afternoon) set lunches moving along both lines; o.sort pulses the
// sorting at the stations; o.pm warms the light towards the afternoon; o.labA fades the place names while the camera is close
function d5_mumbai(ctx,t,o){o=o||{};const pm=o.pm||0;ctx.save();
  const g=ctx.createLinearGradient(0,-200,0,1300);g.addColorStop(0,rgba(mix([18,38,58],[30,40,62],pm),1));g.addColorStop(1,rgba(mix([30,58,78],[46,64,84],pm),1));ctx.fillStyle=g;ctx.fillRect(-1200,-800,4400,2800);
  ctx.strokeStyle="rgba(170,210,230,0.07)";ctx.lineWidth=2;for(let i=0;i<26;i++){const y=-100+i*48,ph=t*0.4+i;ctx.beginPath();for(let x=-1200;x<=3200;x+=40){const yy=y+Math.sin(x*0.012+ph)*4;x===-1200?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
  const poly=(pts,fill,edge)=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(edge){ctx.strokeStyle=edge;ctx.lineWidth=3;ctx.stroke();}};
  poly(D5_MAIN,rgba(mix([84,78,72],[110,90,76],pm),1),"rgba(200,186,160,0.35)");
  const lg=ctx.createLinearGradient(700,0,1120,0);lg.addColorStop(0,rgba(mix([138,122,104],[170,134,104],pm),1));lg.addColorStop(1,rgba(mix([108,96,86],[136,108,88],pm),1));poly(D5_LAND,lg,"rgba(230,210,176,0.6)");
  // the city's texture: blocks, a little lighter where it's dense
  ctx.save();ctx.beginPath();D5_LAND.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
  for(let i=0;i<520;i++){const x=700+hash(i,120)*420,y=40+hash(i,121)*1000;ctx.fillStyle="rgba(240,226,200,"+(0.05+0.08*hash(i,122))+")";ctx.fillRect(x,y,6+8*hash(i,123),4+6*hash(i,124));}ctx.restore();
  // the railway: Western and Central lines, drawn from the south up as o.lines goes to 1
  const la=o.lines==null?1:o.lines,draw=(L,p)=>{if(p<=0)return;ctx.beginPath();for(let k=0;k<=80;k++){const q=at(L,k/80*p);k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();};
  ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(30,24,20,0.6)";ctx.lineWidth=9;draw(D5_LW,la);draw(D5_LC,la);ctx.strokeStyle="rgba(244,218,170,0.95)";ctx.lineWidth=4.5;draw(D5_LW,la);draw(D5_LC,la);
  D5_STNS.forEach(([x,y],i)=>{const q=clamp(la*1.4-0.2-i*0.05,0,1);if(q<=0)return;withA(ctx,q,()=>{ctx.fillStyle="#f6efe2";ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();ctx.strokeStyle="rgba(30,24,20,0.8)";ctx.lineWidth=2.5;ctx.stroke();});
    const sp=o.sort||0;if(sp>0){const ph=pulseAt((t*0.8+i*0.37)%2.2,0,1.2);d5_ring(ctx,x,y,sp*(0.5+0.5*ph),[255,214,150]);
      withA(ctx,sp,()=>{const dx=i<3?-46:46;ctx.fillStyle="#c9cfd3";ctx.beginPath();ctx.arc(x+dx,y-30,16,0,TAU);ctx.fill();ctx.strokeStyle="rgba(196,52,44,0.95)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+dx-9,y-38);ctx.lineTo(x+dx-3,y-32);ctx.moveTo(x+dx-3,y-38);ctx.lineTo(x+dx-9,y-32);ctx.stroke();ctx.fillStyle="rgba(40,60,140,0.95)";ctx.fillRect(x+dx+1,y-36,4,12);});}});
  // the lunch's way, from a kitchen in the suburbs, by bicycle to the station, by train down the line, on foot to an office
  const rp=o.route||0;if(rp>0){const R=mk([D5_HOMEM,[790,222]].concat(D5_WEST.slice().reverse().slice(1,13)).concat([[862,980],D5_OFFM]).map(([x,y])=>P(x,y)));ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle="rgba(255,214,150,0.95)";ctx.lineWidth=4;
    ctx.beginPath();for(let k=0;k<=120;k++){const q=at(R,k/120*rp);k?ctx.lineTo(q.x+10,q.y):ctx.moveTo(q.x+10,q.y);}ctx.stroke();ctx.restore();const q=at(R,rp);glow(ctx,q.x+10,q.y,36,[255,214,150],0.6);}
  // lunches on the move: south in the morning, north again in the afternoon
  const fl=o.flow||0,bk=o.back||0;[[D5_LW,0],[D5_LC,1]].forEach(([L,j])=>{for(let k=0;k<30;k++){const v=(hash(k,130+j)+t*(0.045+0.02*hash(k,132+j)))%1;
    [[fl,1-v],[bk,v]].forEach(([a,u])=>{if(a<=0.01)return;const q=at(L,u),side=(hash(k,134+j)-0.5)*14;withA(ctx,a*sstep(0,0.06,v)*(1-sstep(0.94,1,v)),()=>{glow(ctx,q.x+side,q.y,22,[255,214,150],0.55);ctx.fillStyle="rgba(250,246,236,0.95)";ctx.beginPath();ctx.arc(q.x+side,q.y,5,0,TAU);ctx.fill();});});}});
  // the kitchen and the office
  const lb=o.labA==null?1:o.labA;
  [[D5_HOMEM,o.home||0,"a kitchen in the suburbs",-1],[D5_OFFM,o.office||0,"an office in the south",1]].forEach(([[x,y],a,lab,side])=>{if(a<=0.01)return;withA(ctx,a,()=>{const pu=1+0.15*Math.sin(t*3);glow(ctx,x,y,60*pu,[255,214,150],0.5);ctx.fillStyle="#fff4dc";ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.fill();
    withA(ctx,lb,()=>T(ctx,lab,x+side*30,y+11,{w:800,size:30,align:side<0?"right":"left",color:rgba([255,226,180],1)}));});});
  withA(ctx,(o.labels==null?1:o.labels)*lb,()=>{T(ctx,"Mumbai",885,488,{w:800,size:44,align:"center",color:"rgba(255,246,228,0.96)"});T(ctx,"Arabian Sea",430,700,{w:700,size:32,align:"center",color:"rgba(170,210,230,0.8)"});});
  if(pm>0){ctx.fillStyle="rgba(255,176,110,"+(0.05*pm)+")";ctx.fillRect(-1200,-800,4400,2800);}
  ctx.restore();}

/* ---------- Hill Street, at night ---------- */
// the houses, the poles and the line: house i is dark as off(i) goes to 1. o.brk is the time since the limb broke (negative: not yet):
// it swings down onto the line, rests there as the line sags, then the line snaps and the limb hangs from the tree. o.fixed mends the
// line; o.cleared takes the limb away and leaves a sawn stub; o.van brings the crew's van
const D5_HOUSES=[160,440,720,1000,1280,1560,1840],D5_POLE=[300,860,1420],D5_PY=420;
const d5_lineY=x=>D5_PY+56*Math.sin(Math.PI*clamp((x-D5_POLE[0])/(D5_POLE[1]-D5_POLE[0]),0,1));
// the limb: its hinge on the trunk, its length, its angle before it breaks, and when hanging; where it lands is worked out once
const D5_LIMB=(()=>{const H=[206,392],L=360,a0=-0.62;let lo=-0.6,hi=0.7;for(let k=0;k<40;k++){const m=(lo+hi)/2,x=H[0]+L*Math.cos(m),y=H[1]+L*Math.sin(m);if(y<d5_lineY(x))lo=m;else hi=m;}
  const aL=(lo+hi)/2;return{H,L,a0,aL,xc:H[0]+L*Math.cos(aL),aHang:1.16};})();
// a cluster of leaves: a bumpy, overlapping mass, lit from the upper left
function d5_lobe(ctx,cx,cy,r,seed,t,wind,lit){const n=13,ph=t*1.8+seed;ctx.beginPath();for(let i=0;i<=n*3;i++){const an=i/(n*3)*TAU,b=1+0.09*Math.sin(an*n+seed*3)+0.03*Math.sin(an*5+ph)*wind,rr_=r*b;
    const x=cx+Math.cos(an)*rr_+Math.sin(ph+i)*0.6*wind,y=cy+Math.sin(an)*rr_*0.86;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();
  const g=ctx.createRadialGradient(cx-r*0.35,cy-r*0.4,r*0.1,cx,cy,r*1.1);g.addColorStop(0,rgba(mix([50,74,60],[96,128,104],lit),1));g.addColorStop(1,rgba([24,40,34],1));ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(140,180,150,"+(0.18*lit)+")";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r*0.9,Math.PI*1.05,Math.PI*1.55);ctx.stroke();}
// a tapering wooden limb from (x0,y0) to (x1,y1), w0 thick at its base, w1 at its tip, with a little bend
function d5_wood(ctx,x0,y0,x1,y1,w0,w1,bend){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,mx=(x0+x1)/2+nx*bend,my=(y0+y1)/2+ny*bend;
  ctx.beginPath();ctx.moveTo(x0+nx*w0/2,y0+ny*w0/2);ctx.quadraticCurveTo(mx+nx*(w0+w1)/4,my+ny*(w0+w1)/4,x1+nx*w1/2,y1+ny*w1/2);ctx.lineTo(x1-nx*w1/2,y1-ny*w1/2);
  ctx.quadraticCurveTo(mx-nx*(w0+w1)/4,my-ny*(w0+w1)/4,x0-nx*w0/2,y0-ny*w0/2);ctx.closePath();const g=ctx.createLinearGradient(x0+nx*w0,y0+ny*w0,x0-nx*w0,y0-ny*w0);g.addColorStop(0,"#7a5c44");g.addColorStop(0.5,"#4a3628");g.addColorStop(1,"#2a1e18");ctx.fillStyle=g;ctx.fill();}
function d5_street(ctx,t,o){o=o||{};const off=o.off||(()=>0),fx=o.fixed||0,wind=o.wind==null?1:o.wind,s_=o.brk==null?-1:o.brk,cl=o.cleared||0;
  // night sky, clouds moving, and rain
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0a0e1c");g.addColorStop(1,"#1c1e2a");ctx.fillStyle=g;ctx.fillRect(-300,-300,W+600,H+600);
  for(let i=0;i<9;i++){const x=((hash(i,80)*W*1.4+t*(14+10*hash(i,81)))%(W+700))-350,y=60+hash(i,82)*220;ctx.fillStyle="rgba(70,76,96,0.22)";ctx.beginPath();ctx.ellipse(x,y,220+120*hash(i,83),46+20*hash(i,84),0,0,TAU);ctx.fill();}
  ctx.save();ctx.strokeStyle="rgba(170,190,220,"+(0.16*(o.rain==null?1:o.rain))+")";ctx.lineWidth=1.4;for(let i=0;i<150;i++){const x=(hash(i,85)*(W+300)+t*-90)%(W+300),y=(hash(i,86)*H+t*900*(0.8+0.4*hash(i,87)))%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y+26);ctx.stroke();}ctx.restore();
  ctx.fillStyle="#141218";ctx.fillRect(-300,860,W+600,400);ctx.fillStyle="#1f1c22";ctx.fillRect(-300,860,W+600,14);
  // the houses, each with its windows: lit, or dark
  D5_HOUSES.forEach((x,i)=>{const d=clamp(off(i),0,1),w=220,h=170,y=860;ctx.fillStyle=i%2?"#2a2630":"#302a2c";ctx.fillRect(x-w/2,y-h,w,h);
    ctx.fillStyle=i%2?"#1e1a22":"#241e20";ctx.beginPath();ctx.moveTo(x-w/2-14,y-h);ctx.lineTo(x,y-h-80);ctx.lineTo(x+w/2+14,y-h);ctx.closePath();ctx.fill();
    [[x-70,y-120],[x+20,y-120],[x-70,y-62],[x+20,y-62]].forEach(([wx,wy],k)=>{const on=(1-d)*(hash(i*4+k,88)>0.25?1:0.25);ctx.fillStyle=on>0.02?rgba(mix([30,30,40],[255,210,140],on),1):"rgba(20,20,28,1)";ctx.fillRect(wx,wy,50,38);
      if(on>0.3)glow(ctx,wx+25,wy+19,50,[255,200,130],0.18*on);});
    ctx.fillStyle="#15121a";ctx.fillRect(x+66,y-60,26,60);});
  // the limb's state: falling (accelerating), resting on the line as it sags, then hanging once the line snaps
  const Lb=D5_LIMB,sway=0.025*Math.sin(t*1.9)*wind;let a=Lb.a0+sway,load=0,wd=0;
  if(s_>=0&&s_<0.85){const u=s_/0.85;a=Lb.a0+(Lb.aL-Lb.a0)*u*u;}
  else if(s_>=0.85&&s_<1.3){load=clamp((s_-0.85)/0.15,0,1);a=Lb.aL+0.09*load+0.04*Math.sin((s_-0.85)*22)*Math.exp(-(s_-0.85)*7);}
  else if(s_>=1.3){wd=clamp((s_-1.3)/0.6,0,1);const u=clamp((s_-1.3)/0.75,0,1);a=lerp(Lb.aL+0.09,Lb.aHang,1-Math.pow(1-u,3))+0.05*Math.sin((s_-2.05)*9)*Math.exp(-Math.max(0,s_-2.05)*3)*(u>=1?1:0);}
  if(fx>0){load=0;wd=0;}
  // the poles and the line: whole, sagging under the limb, or snapped and down
  const P=D5_POLE,py=D5_PY,xc=Lb.xc;P.forEach(x=>{ctx.fillStyle="#3a3036";ctx.fillRect(x-6,py-10,12,450);ctx.fillRect(x-46,py-4,92,8);});
  const span=(x0,x1)=>{ctx.beginPath();for(let k=0;k<=24;k++){const f=k/24,x=lerp(x0,x1,f),y=py+56*Math.sin(Math.PI*f);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();};
  ctx.save();ctx.strokeStyle="rgba(160,160,176,0.85)";ctx.lineWidth=2.4;span(-300,P[0]);span(P[1],P[2]);span(P[2],W+300);
  if(wd<0.01){if(load<0.01)span(P[0],P[1]);else{const yc=d5_lineY(xc)+34*load;ctx.beginPath();ctx.moveTo(P[0],py);ctx.quadraticCurveTo((P[0]+xc)/2,py+60+20*load,xc,yc);ctx.quadraticCurveTo((xc+P[1])/2,py+60+20*load,P[1],py);ctx.stroke();}}
  else{const dn=ease(wd);ctx.beginPath();ctx.moveTo(P[0],py);ctx.quadraticCurveTo(lerp(P[0],xc,0.6),lerp(py,860,0.4*dn),xc-30,lerp(d5_lineY(xc)+34,856,dn));ctx.stroke();
    ctx.beginPath();ctx.moveTo(P[1],py);ctx.quadraticCurveTo(lerp(P[1],xc,0.6),lerp(py,860,0.4*dn),xc+30,lerp(d5_lineY(xc)+34,856,dn));ctx.stroke();
    if(dn>0.9){const fl=0.5+0.5*Math.sin(t*23)*Math.sin(t*7.7);glow(ctx,xc,850,50,[255,190,110],0.4*fl);}}
  ctx.restore();
  // service lines to the houses
  ctx.save();ctx.strokeStyle="rgba(120,120,136,0.6)";ctx.lineWidth=1.4;D5_HOUSES.forEach(x=>{const p=x<P[1]?P[0]:x>P[2]?P[2]:P[1];ctx.beginPath();ctx.moveTo(p,py+6);ctx.quadraticCurveTo((p+x)/2,py+70,x,690);ctx.stroke();});ctx.restore();
  // the tree: a tapering trunk and limbs, and overlapping masses of leaves that move in the wind
  const tx=190,by=860,sw=Math.sin(t*1.7)*5*wind;
  [[-150,-570,112,0],[30,-630,120,1],[-40,-530,104,2]].forEach(([dx,dy,r,k])=>d5_lobe(ctx,tx+dx+sw*0.6,by+dy,r,k+1,t,wind,0.35));
  d5_wood(ctx,tx,by,tx+6,by-470,46,22,8);d5_wood(ctx,tx+2,by-400,tx-150+sw*0.5,by-560,20,7,-14);d5_wood(ctx,tx+6,by-450,tx+24+sw*0.6,by-640,18,6,10);
  ctx.fillStyle="rgba(255,236,200,0.08)";ctx.fillRect(tx-20,by-460,6,440);
  [[-190,-530,90,3],[-90,-610,102,4],[70,-570,98,5],[-20,-680,84,6],[120,-650,76,7]].forEach(([dx,dy,r,k])=>d5_lobe(ctx,tx+dx+sw,by+dy,r,k,t,wind,0.85));
  // the limb, in its own frame about its hinge on the trunk, with its leaves; once broken, a splintered stub stays (or a sawn one)
  const Hx=Lb.H[0],Hy=Lb.H[1],L=Lb.L,broke=s_>=0;
  if(broke||cl>0){ctx.save();ctx.translate(Hx,Hy);ctx.rotate(Lb.a0);ctx.fillStyle="#6e5240";ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(16,-9);ctx.lineTo(cl>0?18:24,-2);ctx.lineTo(cl>0?18:14,3);ctx.lineTo(cl>0?18:22,8);ctx.lineTo(0,11);ctx.closePath();ctx.fill();
    ctx.fillStyle=cl>0?"#d8c09a":"#c8a678";if(cl>0)ctx.fillRect(15,-9,4,17);else{ctx.beginPath();ctx.moveTo(14,-8);ctx.lineTo(24,-2);ctx.lineTo(14,3);ctx.lineTo(22,8);ctx.lineTo(12,6);ctx.closePath();ctx.fill();}ctx.restore();
    if(broke&&s_<0.35)glow(ctx,Hx+10,Hy,50,[255,226,180],0.5*(1-s_/0.35));}
  if(cl<1)withA(ctx,1-cl,()=>{ctx.save();ctx.translate(Hx,Hy);ctx.rotate(a);
    d5_wood(ctx,0,0,L,0,22,5,-10);d5_wood(ctx,L*0.42,-3,L*0.66,-60,9,3,6);d5_wood(ctx,L*0.68,2,L*0.88,48,7,3,-5);
    [[L*0.62,-58,62,11],[L*0.86,-26,72,12],[L*0.98,14,56,13],[L*0.78,42,50,14]].forEach(([x,y,r,k])=>d5_lobe(ctx,x,y,r,k,t,broke?1.6:wind,0.75));ctx.restore();});
  // leaves torn off as it falls, drifting down
  if(broke&&cl<1)for(let i=0;i<18;i++){const t0=0.05+hash(i,140)*0.9,tau=s_-t0;if(tau<0)continue;const f=0.4+0.55*hash(i,141),a0=Lb.a0+(Lb.aL-Lb.a0)*Math.min(1,(t0/0.85)**2),
      sx=Hx+Math.cos(a0)*L*f,sy=Hy+Math.sin(a0)*L*f-20,x=sx+tau*(30+40*hash(i,142))+Math.sin(tau*3+i)*18,y=Math.min(852,sy+60*tau+140*tau*tau),fade=1-clamp((tau-2.6)/1.2,0,1);if(fade<=0)continue;
    withA(ctx,fade,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(tau*4+i);ctx.fillStyle=rgba(mix([60,92,70],[110,140,100],hash(i,143)),1);ctx.beginPath();ctx.ellipse(0,0,8,4,0,0,TAU);ctx.fill();ctx.restore();});}
  // the moment the line snaps: a flash where the limb lies on it (o.flash, 0..1)
  if(o.flash>0)glow(ctx,xc,d5_lineY(xc)+30,120,[255,214,150],0.75*o.flash);
  // the crew's van, once it comes (o.van 0..1), with its light turning
  if(o.van>0)withA(ctx,o.van,()=>{const vx=(P[0]+P[1])/2+260,vy=856;ctx.fillStyle="#d8d2c4";rr(ctx,vx-80,vy-70,160,64,10);ctx.fill();ctx.fillStyle="#2a3038";ctx.fillRect(vx+40,vy-62,30,24);ctx.fillStyle="#e2a040";ctx.fillRect(vx-80,vy-34,160,8);
    [[vx-50,vy],[vx+50,vy]].forEach(([wx,wy])=>{ctx.fillStyle="#141418";ctx.beginPath();ctx.arc(wx,wy-4,13,0,TAU);ctx.fill();});const bl=0.5+0.5*Math.sin(t*6);glow(ctx,vx,vy-78,46,[255,180,80],0.5*bl);ctx.fillStyle=rgba([255,190,90],0.6+0.4*bl);ctx.fillRect(vx-10,vy-80,20,10);});}
// a phone, in screen space: a glass slab with lines of text (each [text, size, colour]); o.ring pulses rings around it
function d5_phone(ctx,x,y,w,h,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{if(o.ring>0)for(let k=0;k<2;k++){const u=(o.t*0.9+k*0.5)%1;ring(ctx,x+w/2,y+h*0.32,60+u*120,[150,222,196],(1-u)*o.ring*0.7,2.5);}
  glass(ctx,x,y,w,h,36,[170,205,255],{glow:18,ea:0.7,fill:"rgba(10,16,30,0.96)"});ctx.fillStyle="rgba(200,220,255,0.6)";rr(ctx,x+w/2-34,y+14,68,8,4);ctx.fill();
  let yy=y+90;lines.forEach(([s_,sz,col])=>{const ls=wrapT(ctx,s_,0,0,w-56,{size:sz,w:700,measure:true});ls.forEach(l=>{T(ctx,l,x+w/2,yy,{w:700,size:sz,align:"center",color:col||rgba(INK,0.95)});yy+=sz*1.3;});yy+=sz*0.4;});});}

// the household, sketched in marker on a sheet: a house in the dark, a phone glowing in one window, and its name
function d5_household(ctx,cx,cy,t,a){if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,cx-190,cy-135,380,270,{rot:-0.01,plain:true});
  marker(ctx,[[cx-80,cy-10],[cx-80,cy+80],[cx+80,cy+80],[cx+80,cy-10]],1,{lw:3.2,seed:3});marker(ctx,[[cx-104,cy-6],[cx,cy-88],[cx+104,cy-6]],1,{lw:3.2,seed:4});
  ctx.fillStyle="rgba(40,40,48,0.85)";[[cx-56,cy+8],[cx+16,cy+8]].forEach(([x,y])=>ctx.fillRect(x,y,40,32));ctx.fillRect(cx-14,cy+44,28,36);
  const fl=0.7+0.3*Math.sin(t*2.2);glow(ctx,cx+36,cy+24,40,[150,200,255],0.5*fl);ctx.fillStyle=rgba([170,210,255],fl);ctx.fillRect(cx+31,cy+15,10,18);
  T(ctx,"the household",cx,cy+116,{w:800,size:30,align:"center",color:rgba(INKD,0.9)});});}
/* ---------- the wall: value streams, teams and processes ---------- */
// a stage of a value stream: a chevron, amber paper while a draft, glass in the strategy layer's amber as o.glass goes to 1;
// (x,y) its top-left; o.first: no notch at its back
function d5_chev(ctx,x,y,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const gl=clamp(o.glass||0,0,1),n=h*0.32,sz=o.size||32;
  const path=()=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-n,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w-n,y+h);ctx.lineTo(x,y+h);if(!o.first)ctx.lineTo(x+n,y+h/2);ctx.closePath();};
  withA(ctx,a,()=>{ctx.save();if(gl<1)withA(ctx,1-gl,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=5;path();ctx.fillStyle=rgba(CAPP,1);ctx.fill();ctx.restore();
      ctx.strokeStyle=rgba(CAPD,0.55);ctx.lineWidth=2;path();ctx.stroke();});
    if(gl>0)withA(ctx,gl,()=>{ctx.save();ctx.shadowColor=rgba(STR,0.6);ctx.shadowBlur=16;path();ctx.fillStyle="rgba(7,12,24,0.94)";ctx.fill();ctx.restore();path();ctx.fillStyle=rgba(STR,0.16);ctx.fill();ctx.strokeStyle=rgba(STR,0.9);ctx.lineWidth=2;path();ctx.stroke();});
    if(o.hi){ctx.save();ctx.shadowColor=rgba(o.hiCol||STR,0.9);ctx.shadowBlur=20*o.hi;ctx.strokeStyle=rgba(o.hiCol||STR,0.9*o.hi);ctx.lineWidth=4;path();ctx.stroke();ctx.restore();}
    const ink=gl>0.5?INK:INKD,gc=gl>0.5?STR:CAPD;if(o.glyph!==false)archGlyph(ctx,"stream",x+(o.first?24:n+16),y+22,12,gc);
    const tx=x+(o.first?w/2-n/4:w/2+n/4),ls=wrapT(ctx,label,0,0,w-n*2-16,{size:sz,w:800,measure:true}),lh=sz*1.12;ls.forEach((l,i)=>T(ctx,l,tx,y+h/2-((ls.length-1)*lh)/2+sz*0.36+i*lh,{w:800,size:sz,align:"center",color:rgba(ink,0.95),deco:o.deco}));
    ctx.restore();});}
// a row of stages from (x,y), each w wide, overlapping by their points: each arrives at o.t0[i] (or is there already), and o.glass[i],
// o.hi[i] say how confirmed and how lit it is. Returns each stage's centre.
function d5_stream(ctx,t,x,y,w,h,labels,o){o=o||{};const C=[];labels.forEach((l,i)=>{const xx=x+i*(w-h*0.2);C.push([xx+w/2,y+h/2]);
  arrive(ctx,xx+w/2,y+h/2,t,o.t0?o.t0[i]:-9,()=>d5_chev(ctx,xx,y,w,h,l,{first:i===0,glass:o.glass?o.glass[i]:0,size:o.size,hi:o.hi?o.hi[i]:0,deco:o.deco,glyph:o.glyph}),{dy:-14});});return C;}
// three swimlanes: one per team, with its name
function d5_lanes(ctx,x,y,w,lh,names,a){withA(ctx,a,()=>{names.forEach((n,i)=>{const yy=y+i*lh;ctx.fillStyle=i%2?"rgba(255,234,130,0.035)":"rgba(255,234,130,0.07)";ctx.fillRect(x,yy,w,lh);
  ctx.strokeStyle="rgba(255,234,130,0.28)";ctx.lineWidth=1.5;ctx.strokeRect(x,yy,w,lh);T(ctx,n,x+20,yy+42,{f:"mono",w:600,size:28,color:rgba(BUS,0.95)});});});}
// a process step on paper (a yellow note with ArchiMate's process glyph), glass in the business layer's yellow as o.glass goes to 1
function d5_step(ctx,cx,cy,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const gl=clamp(o.glass||0,0,1),sz=o.size||28;withA(ctx,a,()=>{
  sticky(ctx,cx,cy,w,h,"",{col:NOTEC[0],edge:BUS,glass:gl,rot:o.rot||0});
  if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(o.hiCol||BUS,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(o.hiCol||BUS,0.8);ctx.shadowBlur=16;rr(ctx,cx-w/2-7,cy-h/2-7,w+14,h+14,14);ctx.stroke();ctx.restore();});
  const ink=gl>0.5?INK:INKD;archGlyph(ctx,"process",cx-w/2+24,cy-h/2+22,12,gl>0.5?BUS:[120,96,20]);
  const ls=wrapT(ctx,label,0,0,w-28,{size:sz,w:800,measure:true}),lh=sz*1.12;ls.forEach((l,i)=>T(ctx,l,cx,cy+8-((ls.length-1)*lh)/2+sz*0.36+i*lh,{w:800,size:sz,align:"center",color:rgba(ink,0.95),deco:o.deco}));});}
// the process map: four bands, each with its processes (ArchiMate process elements, in the business layer's yellow), between the
// customer's need on the left and the customer served on the right. o.hi[name] lights a process, o.band[k] a group; o.deco marks its
// text as texture, for a map drawn small
const D5_PMAP=[["strategic",["set direction","plan the network","manage risk"]],["operational",["connect a home","restore supply","meter to cash"]],
  ["support",["people","finance","technology","fleet and stores"]],["evaluation",["measure reliability","audit","improve"]]];
function d5_pmap(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const hi=o.hi||{},bh=[0.2,0.32,0.2,0.2].map(f=>f*(h-36)),pos={};let yy=y;
  withA(ctx,a,()=>{D5_PMAP.forEach(([g,ps],k)=>{const q=o.p?clamp(o.p*4-k,0,1):1;if(q<=0){yy+=bh[k]+12;return;}const y0=yy;
    const bhi=o.band?o.band[k]||0:0;withA(ctx,q,()=>{ctx.fillStyle=rgba(BUS,0.05+0.07*bhi);rr(ctx,x,y0,w,bh[k],12);ctx.fill();ctx.save();if(bhi>0){ctx.shadowColor=rgba(BUS,0.8);ctx.shadowBlur=18*bhi;}ctx.strokeStyle=rgba(BUS,0.3+0.6*bhi);ctx.lineWidth=1.5+1.5*bhi;rr(ctx,x,y0,w,bh[k],12);ctx.stroke();ctx.restore();
      T(ctx,g,x+20,y0+40,{f:"mono",w:600,size:28,color:rgba(BUS,0.95),deco:o.deco});
      const n=ps.length,bx0=x+230,bw=(w-250-(n-1)*24)/n,bhh=Math.min(bh[k]-30,k===1?110:76),by=y0+(bh[k]-bhh)/2+(k===1?6:4);
      if(k===1){ctx.save();ctx.strokeStyle="rgba(255,234,130,0.45)";ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(x+200,by+bhh/2);ctx.lineTo(x+w-14,by+bhh/2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="rgba(255,234,130,0.6)";ctx.beginPath();ctx.moveTo(x+w-6,by+bhh/2);ctx.lineTo(x+w-24,by+bhh/2-10);ctx.lineTo(x+w-24,by+bhh/2+10);ctx.closePath();ctx.fill();ctx.restore();}
      ps.forEach((p,i)=>{const bx=bx0+i*(bw+24);pos[p]=[bx,by,bw,bhh];archEl(ctx,bx,by,bw,bhh,p,BUS,"process",{size:o.size||28,gs:12,hi:hi[p]||0,deco:o.deco});});});
    yy+=bh[k]+12;});});
  return pos;}
// a column of a SIPOC: its letter and name, over its items
function d5_sipocHead(ctx,cx,y,letter,name,a){withA(ctx,a,()=>{T(ctx,letter,cx,y,{w:800,size:64,align:"center",color:rgba(BUS,1)});T(ctx,name,cx,y+44,{f:"mono",w:600,size:28,align:"center",color:rgba(SOFT,1)});});}

/* ---------- who goes first ---------- */
// a fault, on a glass card: its place, an icon (wire, life, homes) and two lines
function d5_fault(ctx,cx,cy,w,h,name,l1,l2,icon,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||[255,170,120],x=cx-w/2,y=cy-h/2;
  glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(10,10,20,0.95)"});
  const ix=x+70,iy=cy;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
  if(icon==="wire"){ctx.beginPath();ctx.moveTo(ix-36,iy-30);ctx.lineTo(ix-10,iy-30);ctx.quadraticCurveTo(ix+4,iy-6,ix-6,iy+30);ctx.stroke();ctx.beginPath();ctx.moveTo(ix+36,iy-30);ctx.lineTo(ix+14,iy-30);ctx.quadraticCurveTo(ix+2,iy-4,ix+10,iy+30);ctx.stroke();
    const fl=0.5+0.5*Math.sin((o.t||0)*20);glow(ctx,ix+2,iy+30,30,[255,190,110],0.5*fl);}
  else if(icon==="life"){ctx.beginPath();ctx.moveTo(ix,iy+28);ctx.bezierCurveTo(ix-46,iy-4,ix-26,iy-40,ix,iy-18);ctx.bezierCurveTo(ix+26,iy-40,ix+46,iy-4,ix,iy+28);ctx.stroke();
    ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ix-30,iy);ctx.lineTo(ix-12,iy);ctx.lineTo(ix-5,iy-14);ctx.lineTo(ix+4,iy+12);ctx.lineTo(ix+10,iy);ctx.lineTo(ix+30,iy);ctx.stroke();}
  else{[-26,0,26].forEach(dx=>{ctx.beginPath();ctx.moveTo(ix+dx-11,iy+22);ctx.lineTo(ix+dx-11,iy+2);ctx.lineTo(ix+dx,iy-10);ctx.lineTo(ix+dx+11,iy+2);ctx.lineTo(ix+dx+11,iy+22);ctx.closePath();ctx.stroke();});}
  ctx.restore();
  T(ctx,name,x+130,y+52,{w:800,size:32});if(l1)T(ctx,l1,x+130,y+96,{w:700,size:28,color:rgba(col,1)});if(l2)T(ctx,l2,x+130,y+136,{w:700,size:28,color:rgba(SOFT,1)});});}
// a crew's van, small, with its name under it
function d5_van(ctx,x,y,s,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#d8d2c4";rr(ctx,-60,-52,120,46,8);ctx.fill();
  ctx.fillStyle="#2a3038";ctx.fillRect(28,-46,24,18);ctx.fillStyle="#e2a040";ctx.fillRect(-60,-26,120,6);[[-34,-4],[34,-4]].forEach(([wx,wy])=>{ctx.fillStyle="#141418";ctx.beginPath();ctx.arc(wx,wy,10,0,TAU);ctx.fill();});
  const bl=0.5+0.5*Math.sin((o.t||0)*6);ctx.fillStyle=rgba([255,190,90],0.5+0.5*bl);ctx.fillRect(-8,-60,16,8);ctx.restore();
  if(label)T(ctx,label,x,y+38,{w:700,size:28,align:"center",color:rgba(PARCH,1)});});}
// the BPMN diagram for "decide who goes first", drawn with BPMN's shapes: a start event (a thin circle), gateways (diamonds with
// an X), tasks (rounded boxes), an end event (a thick circle), and sequence flows. oy shifts it up or down; o.p (0..1) draws it in.
// Returns where each part is, for tokens to follow.
function d5_bpmnAt(oy){const y=520+oy;return{start:[130,y],g1:[380,y],g2:[820,y],t3:[1280,y],end:[1620,y],t1:[380,y+190],t2:[820,y+190]};}
function d5_bpmn(ctx,oy,o){o=o||{};const a=o.a==null?1:o.a,A=d5_bpmnAt(oy);if(a<=0.01)return A;const p=o.p==null?1:o.p,q=i=>clamp(p*7-i,0,1),col=[200,214,240],hi=o.hi||{};
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
    const flow=(x0,y0,x1,y1,k,lab,lx,ly)=>{const u=q(k);if(u<=0)return;arrowTo(ctx,x0,y0,lerp(x0,x1,u),lerp(y0,y1,u),col,0.85,{p:1,lw:3,head:u>=1?13:0.01,nohead:u<1});if(lab&&u>=1)T(ctx,lab,lx,ly,{w:700,size:28,align:"center",color:rgba(SOFT,1)});};
    const gate=(x,y,lab,k)=>{const u=q(k);if(u<=0)return;withA(ctx,u,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle="rgba(10,14,26,0.95)";ctx.fillRect(-30,-30,60,60);ctx.strokeStyle=rgba(hi[lab]?[255,214,150]:col,1);ctx.lineWidth=3;ctx.strokeRect(-30,-30,60,60);ctx.restore();
      ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-12,y-12);ctx.lineTo(x+12,y+12);ctx.moveTo(x+12,y-12);ctx.lineTo(x-12,y+12);ctx.stroke();if(hi[lab])glow(ctx,x,y,70,[255,214,150],0.35*hi[lab]);
      T(ctx,lab,x,y-62,{w:800,size:30,align:"center",color:rgba(INK,0.95)});});};
    const task=(cx,cy,w,lab,k)=>{const u=q(k);if(u<=0)return;withA(ctx,u,()=>{glass(ctx,cx-w/2,cy-44,w,88,16,col,{glow:8+16*(hi[lab]||0),ea:0.8,fill:"rgba(10,14,26,0.95)"});wrapT(ctx,lab,cx,cy-(tw(ctx,lab,28,700)>w-30?4:-10),w-30,{size:28,w:700,align:"center",lh:32});});};
    const ev=(x,y,end,k)=>{const u=q(k);if(u<=0)return;withA(ctx,u,()=>{ctx.fillStyle="rgba(10,14,26,0.95)";ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.fill();ctx.strokeStyle=rgba(end?[232,110,96]:[120,210,130],1);ctx.lineWidth=end?7:3;ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.stroke();});};
    ev(...A.start,false,0);flow(A.start[0]+28,A.start[1],A.g1[0]-44,A.g1[1],1);gate(...A.g1,"wire down?",1);
    flow(A.g1[0],A.g1[1]+44,A.t1[0],A.t1[1]-46,2,"yes",A.g1[0]+40,A.g1[1]+104);task(A.t1[0],A.t1[1],300,"send a crew first",2);
    flow(A.g1[0]+44,A.g1[1],A.g2[0]-44,A.g2[1],3,"no",(A.g1[0]+A.g2[0])/2,A.g1[1]-14);gate(...A.g2,"life support?",3);
    flow(A.g2[0],A.g2[1]+44,A.t2[0],A.t2[1]-46,4,"yes",A.g2[0]+40,A.g2[1]+104);task(A.t2[0],A.t2[1],300,"send the next crew",4);
    flow(A.g2[0]+44,A.g2[1],A.t3[0]-170,A.t3[1],5,"no",(A.g2[0]+A.t3[0]-170)/2,A.g2[1]-14);task(A.t3[0],A.t3[1],330,"rank by homes cut off",5);
    flow(A.t3[0]+167,A.t3[1],A.end[0]-30,A.end[1],6);ev(...A.end,true,6);
    ctx.restore();});return A;}
// a token moving along points (a fault on its way through the rule), u from 0 to 1 along them
function d5_token(ctx,pts,u,col,lab,a){if(a<=0.01||u<=0)return;const P_=mk(pts.map(([x,y])=>P(x,y))),q=at(P_,clamp(u,0,1));withA(ctx,a,()=>{glow(ctx,q.x,q.y,40,col,0.6);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(q.x,q.y,13,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(10,10,20,0.9)";ctx.lineWidth=2;ctx.stroke();if(lab)T(ctx,lab,q.x,q.y-24,{w:800,size:28,align:"center",color:rgba(col,1)});});}
// a data object, as BPMN draws one: a page with its corner folded, in the information layer's salmon
function d5_data(ctx,x,y,w,h,title,line,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const f=28;ctx.save();ctx.shadowColor=rgba(INF,0.5);ctx.shadowBlur=14;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle="rgba(14,10,12,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(INF,0.95);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f,y+f);ctx.lineTo(x+w,y+f);ctx.stroke();
  wrapT(ctx,title,x+20,y+48,w-56,{size:30,w:800,color:rgba(INK,0.96),lh:34});if(line)T(ctx,line,x+20,y+h-22,{w:600,size:28,color:rgba(INF,1)});
  if(o.q>0)withA(ctx,o.q,()=>{glow(ctx,x+w+34,y+h/2,50,[232,92,80],0.4);T(ctx,"?",x+w+34,y+h/2+17,{w:800,size:48,align:"center",color:"rgba(232,92,80,1)"});});});}
