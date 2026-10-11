/* ===== Today, and where it's going: the film's own pictures (prefixed d7_) =====
   An imagined street in the utility's own region in 2045, at sunrise: homes with panels on their roofs and batteries on their walls,
   power moving house to house along the street's line, a car charging, a transformer on a pole whose readings drift, and a crew's
   van that comes before it fails. On the wall and on the films' dark glass: the hundred and forty systems from Day one, as a list and
   as application components placed under capabilities; a spreadsheet on paper; the technology beneath (nodes); paper notes from the
   canvases becoming elements of one model; today and the target side by side; gaps, plateaus and the path between them; and a
   decision record. The imagined street is labelled as imagined, and set in the series' own fictional region (the proposal's rule for
   future openings). */

const STR=LAY6[1][1],BUS=LAY6[2][1],APL=LAY6[4][1],TEC=LAY6[5][1],MOT=LAY6[0][1];
// the path from today to a target: ArchiMate's implementation and migration elements (plateaus, gaps), in a soft pink
const MIG=[248,184,226],D7_RED=[232,96,84],D7_SUN=[255,196,120];
// the systems on Day one's list, and more of the same kind: placed under capabilities, they're texture, not something to read
const D7_SYS=["OMS · outages","CIS · customers","SCADA · network control","GIS · network map","AMI head-end · meters","MDM · meter data","Billing","ERP · finance","EAM · assets","DMS · distribution","CRM","Field mobility","Data warehouse","HR · payroll","Spreadsheet · ops roster","Market gateway","Document store","Spreadsheet · tariffs",
  "Fleet portal","Fleet portal 2","Storm tool","Hardship register","Complaints log","Life support register","Connections portal","Design tool","Protection settings","Weather feed","Asset photos","Vegetation app","Load forecast","Settlement","Contracts register","Procurement","Training records","Safety incidents","Website","Contact centre phones","Network model","Planning studies","Hydro scheduling","Wind SCADA","Regulatory reports"];

/* ---------- 2045: an imagined street at sunrise ---------- */
// the sky: night to dawn as sun goes from 0 to 1, with the sun coming up behind the hills; keep draws it in the current transform
function d7_sky(ctx,S,sun,keep){if(!keep)setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(mix([10,16,36],[40,70,120],sun),1));g.addColorStop(0.55,rgba(mix([22,26,52],[230,150,110],sun),1));g.addColorStop(1,rgba(mix([30,28,40],[255,200,140],sun),1));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<60;i++){ctx.fillStyle="rgba(255,255,255,"+(0.5*(1-sun)*hash(i,700))+")";ctx.fillRect(hash(i,701)*W,hash(i,702)*H*0.5,2,2);}
  const sy=lerp(820,560,ease(sun));glow(ctx,1460,sy,260,D7_SUN,0.35*sun);ctx.fillStyle=rgba([255,226,170],0.95*clamp(sun*2,0,1));ctx.beginPath();ctx.arc(1460,sy,54,0,TAU);ctx.fill();
  // far hills, with wind turbines on the ridge
  ctx.fillStyle=rgba(mix([18,22,40],[96,80,100],sun),1);ctx.beginPath();ctx.moveTo(0,640);for(let x=0;x<=W;x+=40)ctx.lineTo(x,600+Math.sin(x*0.004)*36+Math.sin(x*0.011)*14);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();}
function d7_turbine(ctx,x,y,s,t,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-90*s);ctx.stroke();for(let k=0;k<3;k++){const an=t*0.8+k*TAU/3;ctx.beginPath();ctx.moveTo(x,y-90*s);ctx.lineTo(x+Math.cos(an)*40*s,y-90*s+Math.sin(an)*40*s);ctx.stroke();}ctx.restore();}
// one home: walls lit by the sun, panels on the roof that catch it, a battery on the wall whose charge shows, and lit windows
const D7_HOMES=[220,500,780,1140,1420,1700],D7_GY=860,D7_LINEY=520,D7_POLE=960;
function d7_home(ctx,x,t,sun,o){o=o||{};const w=220,h=170,y=D7_GY;ctx.save();
  const wg=ctx.createLinearGradient(x-w/2,0,x+w/2,0);wg.addColorStop(0,rgba(mix([60,58,70],[214,170,130],sun),1));wg.addColorStop(1,rgba(mix([40,38,50],[150,112,90],sun),1));ctx.fillStyle=wg;ctx.fillRect(x-w/2,y-h,w,h);
  // the roof, and its panels
  ctx.fillStyle=rgba(mix([34,30,40],[110,70,60],sun),1);ctx.beginPath();ctx.moveTo(x-w/2-16,y-h);ctx.lineTo(x,y-h-92);ctx.lineTo(x+w/2+16,y-h);ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(x+6,y-h-70);ctx.lineTo(x+w/2-4,y-h-12);ctx.lineTo(x+18,y-h-12);ctx.lineTo(x-26,y-h-54);ctx.closePath();ctx.clip();ctx.fillStyle="#1d2a48";ctx.fillRect(x-40,y-h-100,200,100);
  ctx.strokeStyle="rgba(150,180,230,0.5)";ctx.lineWidth=1.5;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(x-40+k*28,y-h-100);ctx.lineTo(x-10+k*28,y-h);ctx.stroke();}
  const gl=sun*(0.5+0.5*Math.sin(t*0.7+x*0.01));ctx.fillStyle="rgba(255,236,190,"+(0.35*gl)+")";ctx.fillRect(x-40,y-h-100,200,100);ctx.restore();
  // windows and a door
  [[x-70,y-120],[x+26,y-120]].forEach(([wx,wy])=>{ctx.fillStyle=rgba(mix([255,214,140],[200,190,170],sun),0.9);ctx.fillRect(wx,wy,44,40);ctx.strokeStyle="rgba(40,30,30,0.6)";ctx.lineWidth=2;ctx.strokeRect(wx,wy,44,40);});
  ctx.fillStyle="rgba(50,38,34,0.9)";ctx.fillRect(x-16,y-70,32,70);
  // the battery on the wall, its charge in green bars
  const ch=o.charge==null?0.6:o.charge;ctx.fillStyle="#d9dee6";rr(ctx,x+w/2-46,y-96,32,58,5);ctx.fill();ctx.fillStyle="#2c3444";for(let k=0;k<4;k++){if(ch>k/4){ctx.fillStyle="rgba(130,220,150,0.95)";}else ctx.fillStyle="rgba(60,70,80,0.9)";ctx.fillRect(x+w/2-41,y-46-k*12,22,8);}
  if(o.lit)glow(ctx,x+w/2-30,y-66,36,[130,220,150],0.5*o.lit);ctx.restore();}
// a pole-mounted transformer: its colour drifts towards amber as its readings drift; s (0..1) swaps in a new one
function d7_transformer(ctx,t,drift,swap){const x=D7_POLE,y=D7_LINEY;ctx.save();ctx.fillStyle="#3a3230";ctx.fillRect(x-8,y-30,16,D7_GY-y+30);
  const col=mix([170,180,190],[255,170,90],drift*(1-swap));if(drift*(1-swap)>0.05)glow(ctx,x,y+60,70,[255,150,80],0.45*drift*(1-swap)*(0.7+0.3*Math.sin(t*4)));
  ctx.fillStyle=rgba(col,1);rr(ctx,x-30,y+30,60,70,8);ctx.fill();ctx.strokeStyle="rgba(30,30,36,0.7)";ctx.lineWidth=2;rr(ctx,x-30,y+30,60,70,8);ctx.stroke();for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x-22+k*22,y+30);ctx.lineTo(x-22+k*22,y+16);ctx.stroke();}ctx.restore();}
// the street's line, pole to pole, and power moving along it from house to house (o.trade); returns nothing
function d7_line(ctx,t,trade,sun){ctx.save();ctx.strokeStyle="rgba(30,28,34,0.85)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,D7_LINEY+20);for(let x=0;x<=W;x+=20)ctx.lineTo(x,D7_LINEY+20+Math.sin(Math.PI*((x%480)/480))*26);ctx.stroke();
  [0,480,960,1440,1920].forEach(x=>{if(x===D7_POLE)return;ctx.fillStyle="#3a3230";ctx.fillRect(x-7,D7_LINEY+10,14,D7_GY-D7_LINEY-10);});
  // service drops to each home
  D7_HOMES.forEach(hx=>{ctx.strokeStyle="rgba(30,28,34,0.6)";ctx.lineWidth=2;const ly=D7_LINEY+20+Math.sin(Math.PI*((hx%480)/480))*26;ctx.beginPath();ctx.moveTo(hx,ly);ctx.lineTo(hx+60,D7_GY-170);ctx.stroke();});
  if(trade>0)for(let k=0;k<18;k++){const a=D7_HOMES[k%6],b=D7_HOMES[(k*7+3)%6];if(a===b)continue;const v=(t*0.35+hash(k,710))%1,x=lerp(a,b,v),ly=D7_LINEY+20+Math.sin(Math.PI*((x%480)/480))*26;
    withA(ctx,trade*sstep(0,0.15,v)*(1-sstep(0.85,1,v)),()=>{glow(ctx,x,ly,22,[150,240,170],0.7);ctx.fillStyle="rgba(220,255,226,0.95)";ctx.beginPath();ctx.arc(x,ly,4.5,0,TAU);ctx.fill();});}
  ctx.restore();}
// a car on charge, its cable glowing
function d7_car(ctx,x,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="#7c8fa8";ctx.beginPath();ctx.moveTo(x-70,y-14);ctx.lineTo(x-50,y-40);ctx.lineTo(x+30,y-40);ctx.lineTo(x+64,y-14);ctx.lineTo(x+70,y);ctx.lineTo(x-74,y);ctx.closePath();ctx.fill();
  ctx.fillStyle="#2a3448";ctx.fillRect(x-44,y-36,30,18);ctx.fillRect(x-8,y-36,34,18);[[-44,0],[44,0]].forEach(([dx])=>{ctx.fillStyle="#141418";ctx.beginPath();ctx.arc(x+dx,y,12,0,TAU);ctx.fill();});
  ctx.strokeStyle="rgba(150,240,170,"+(0.6+0.3*Math.sin(t*3))+")";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+70,y-20);ctx.quadraticCurveTo(x+100,y+10,x+120,y-50);ctx.stroke();ctx.restore();});}
// a crew's van, with its light turning
function d7_van(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#e2ddd0";rr(ctx,-80,-70,160,62,10);ctx.fill();ctx.fillStyle="#e2a040";ctx.fillRect(-80,-36,160,8);
  ctx.fillStyle="#2a3038";ctx.fillRect(40,-62,32,22);[[-46,-6],[46,-6]].forEach(([wx,wy])=>{ctx.fillStyle="#141418";ctx.beginPath();ctx.arc(wx,wy,14,0,TAU);ctx.fill();});
  const bl=0.5+0.5*Math.sin(t*6);glow(ctx,0,-78,30,[255,190,90],0.4*bl);ctx.fillStyle=rgba([255,190,90],0.5+0.5*bl);ctx.fillRect(-10,-82,20,10);ctx.restore();});}
// a small chart of a transformer's readings: a line that wanders, then drifts up towards a dashed limit
function d7_trend(ctx,x,y,w,h,p,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[255,190,120],{glow:12,ea:0.75,fill:"rgba(10,12,22,0.94)"});
  T(ctx,"transformer readings",x+24,y+44,{w:800,size:28,color:rgba([255,214,170],1)});const gx=x+24,gy=y+70,gw=w-48,gh=h-96;
  ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle="rgba(232,110,96,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,gy+gh*0.15);ctx.lineTo(gx+gw,gy+gh*0.15);ctx.stroke();ctx.restore();
  ctx.save();ctx.strokeStyle="rgba(255,200,140,0.95)";ctx.lineWidth=3;ctx.beginPath();const n=60;for(let i=0;i<=n*p;i++){const u=i/n,base=0.75-0.5*sstep(0.5,1,u),yy=gy+gh*(base+0.06*Math.sin(u*31+1)+0.04*Math.sin(u*13));i?ctx.lineTo(gx+u*gw,yy):ctx.moveTo(gx+u*gw,yy);}ctx.stroke();ctx.restore();});}

/* ---------- the wall and the glass: systems, capabilities, technology ---------- */
// the list from Day one, printed: rows of system names scrolling (texture), and a heading
function d7_list(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.012:o.rot,plain:true});
  T(ctx,"140 systems",x+28,y+54,{w:800,size:34,color:"rgba(52,48,46,0.95)"});ctx.save();ctx.beginPath();ctx.rect(x+10,y+76,w-20,h-90);ctx.clip();
  const sc=t*(o.speed==null?24:o.speed),rh=32;for(let i=0;i<Math.ceil((h-90)/rh)+2;i++){const k=Math.floor(sc/rh)+i,yy=y+104+i*rh-(sc%rh);T(ctx,(k%140+1)+"  "+D7_SYS[k%D7_SYS.length],x+30,yy,{f:"mono",w:500,size:20,color:"rgba(70,66,64,0.85)",deco:1});}ctx.restore();});}
// a spreadsheet on paper: a grid, a few numbers, and who keeps it
function d7_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.014:o.rot,plain:true});
  ctx.save();ctx.strokeStyle="rgba(60,120,80,0.35)";ctx.lineWidth=1.2;for(let i=0;i<=6;i++){ctx.beginPath();ctx.moveTo(x+20,y+70+i*26);ctx.lineTo(x+w-20,y+70+i*26);ctx.stroke();}for(let j=0;j<=4;j++){ctx.beginPath();ctx.moveTo(x+20+j*(w-40)/4,y+70);ctx.lineTo(x+20+j*(w-40)/4,y+226);ctx.stroke();}
  for(let i=0;i<6;i++)for(let j=0;j<4;j++)T(ctx,""+Math.round(20+80*hash(i*4+j,720)),x+30+j*(w-40)/4,y+90+i*26,{f:"mono",w:500,size:16,color:"rgba(60,60,64,0.75)",deco:1});ctx.restore();
  T(ctx,o.title||"spreadsheet",x+24,y+48,{w:800,size:30,color:"rgba(52,48,46,0.95)"});if(o.line)T(ctx,o.line,x+24,y+h-24,{w:700,size:28,color:"rgba(52,48,46,0.9)"});});}
// a dashed slot where a capability should be, with a question mark: a system that serves nothing anyone can name
function d7_slot(ctx,x,y,w,h,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(STR,0.7);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(STR,0.95)});});}
// a "new" badge, on an element of the target
function d7_new(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-44,y-20,88,40,20,[150,240,170],{glow:10,ea:0.8,fill:"rgba(6,16,12,0.95)"});T(ctx,"new",x,y+10,{w:800,size:28,align:"center",color:"rgba(170,245,190,1)"});});}
// a line from one element to another: serving (an arrow), or a plain line, drawn up to p
function d7_link(ctx,x0,y0,x1,y1,col,p,o){o=o||{};if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col,o.a==null?0.6:o.a);ctx.lineWidth=o.lw||2.5;if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,p),lerp(y0,y1,p));ctx.stroke();ctx.restore();}

/* ---------- why, written down ---------- */
// a decision record on paper: a kicker, a title, and its fields, written in as p goes to 1; o.hi lights it
function d7_adr(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=150+rows.reduce((s,r)=>s+r[2],0);withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.008:o.rot,plain:true});
  if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
  T(ctx,"decision record",x+30,y+48,{f:"mono",w:500,size:28,color:"rgba(150,60,110,0.95)"});T(ctx,title,x+30,y+100,{w:800,size:36,color:"rgba(40,38,40,0.97)"});
  let yy=y+150;rows.forEach(([k,v,hh],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,k,x+30,yy+30,{w:800,size:28,color:"rgba(110,90,60,0.95)"});wrapT(ctx,v,x+220,yy+30,w-250,{size:28,w:700,color:"rgba(40,38,40,0.92)",lh:34});});yy+=hh;});});return h;}
