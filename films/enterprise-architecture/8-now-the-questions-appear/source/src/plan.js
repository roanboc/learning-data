/* ===== Now the questions appear: the film's own pictures (prefixed d8_) =====
   Kerala, January 1997: a sketch map of India's south and of the northern Kerala coast, with the fifteen beach markets of Jensen's
   survey placed by their distances along the coast; sardine boats coming in at dawn; the beach at Badagara, where crews pour their
   catch back into the sea while buyers a few kilometres away leave with nothing; the phone towers that reached the coast district
   by district; a skipper's phone at sea; and prices that move together once the phones arrive. On the wall and on the films' dark
   glass: the reporting team's backlog as index cards; requests traced up to a decision, a capability and a goal; goals traced down
   to decisions, questions and measures; a measure's definition, its home on the map and its owner; households falling behind; and
   data products on each side of the wall between the network and retail.
   Kerala is drawn in the series' own style, not in the style of Kerala's art, and no borders are drawn (PLAYBOOK §2). On the map,
   people are icons, as on any map; up close, the story is told by the boat, the catch, the birds and a hand holding a phone. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what reaches nothing; and the phones' signal
const D8_NET=[132,176,255],D8_RET=[255,150,186],D8_RED=[232,96,84],D8_SIG=[150,222,255],D8_SAND=[236,214,170];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d8_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a note should keep on one line
const d8_nb=s=>s.replace(/ /g," ");

/* ---------- Kerala, from above ---------- */
// Longitude and latitude, projected simply (a sketch, not a survey): 600 px to a degree of latitude, about 5.4 px to a kilometre.
const D8_SY=600,D8_SX=D8_SY*Math.cos(12*Math.PI/180);
const d8_pr=([lo,la])=>[1060+(lo-75.35)*D8_SX,540-(la-11.94)*D8_SY];
// north Kerala's coast, north to south, from Ullal to Chaliyam: finer than the rest, because the camera comes close
const D8_NK=[[74.85,12.80],[74.88,12.72],[74.90,12.67],[74.93,12.60],[74.96,12.54],[74.99,12.49],[75.02,12.43],[75.04,12.38],[75.07,12.32],[75.10,12.26],[75.13,12.19],[75.16,12.12],[75.19,12.07],
  [75.185,12.045],[75.20,12.02],[75.235,11.99],[75.28,11.95],[75.32,11.92],[75.355,11.87],[75.38,11.83],[75.43,11.79],[75.48,11.75],[75.52,11.71],[75.545,11.665],[75.57,11.60],[75.60,11.55],[75.63,11.50],
  [75.67,11.46],[75.69,11.44],[75.72,11.38],[75.75,11.32],[75.77,11.25],[75.79,11.20],[75.80,11.16]];
// the rest of India's south, coarser: the west coast from Mumbai down to Ullal, then from Chaliyam to Kanyakumari, and up the east coast
const D8_WN=[[72.80,19.90],[72.78,19.20],[72.82,18.95],[72.87,18.64],[72.95,18.30],[73.03,18.02],[73.15,17.62],[73.30,17.00],[73.33,16.56],[73.47,16.06],[73.63,15.86],[73.81,15.50],[73.90,15.25],
  [74.03,15.01],[74.12,14.81],[74.31,14.55],[74.44,14.28],[74.55,13.97],[74.67,13.62],[74.70,13.35],[74.78,13.09],[74.81,12.87]];
const D8_WS=[[75.86,11.00],[75.92,10.77],[76.02,10.53],[76.15,10.22],[76.24,9.96],[76.32,9.49],[76.42,9.15],[76.58,8.88],[76.70,8.73],[76.92,8.48],[77.00,8.38],[77.25,8.17],[77.55,8.08]];
const D8_EC=[[77.80,8.20],[78.12,8.50],[78.15,8.80],[78.40,9.08],[78.95,9.27],[79.32,9.20],[79.20,9.32],[79.02,9.74],[79.30,10.05],[79.86,10.30],[79.85,10.77],[79.85,10.92],[79.77,11.75],[79.83,11.93],
  [80.19,12.62],[80.29,13.08],[80.32,13.42],[80.15,14.00],[80.12,14.25],[80.05,14.90],[80.25,15.50],[80.60,15.80],[80.95,15.75],[81.14,16.18],[81.70,16.30],[82.30,16.60],[82.25,16.95],[82.60,17.30],
  [83.30,17.69],[83.90,18.10],[84.10,18.25],[84.91,19.26],[85.60,19.70],[86.40,20.30],[86.60,21.40],[86.60,23.00],[72.60,23.00],[72.60,21.40]];
const D8_INDIA=D8_WN.concat(D8_NK,D8_WS,D8_EC).map(d8_pr);
const D8_LANKA=[[79.95,9.80],[80.25,9.83],[80.60,9.45],[80.90,9.00],[81.23,8.57],[81.45,8.10],[81.70,7.72],[81.88,7.00],[81.80,6.60],[81.40,6.25],[81.12,6.12],[80.59,5.92],[80.22,6.03],[80.00,6.60],
  [79.85,6.93],[79.84,7.20],[79.80,8.03],[79.90,8.50],[79.92,8.98],[80.05,9.40]].map(d8_pr);
// Kerala, to light it: its coast, and inland along the hills (a highlight, not a border; drawn smooth, with d8_smooth)
const D8_KERALA=D8_NK.slice(1).concat(D8_WS.slice(0,11),[[77.08,8.32],[77.20,8.60],[77.25,9.00],[77.25,9.50],[77.15,9.90],[77.25,10.25],[76.85,10.55],[76.75,10.85],[76.45,11.25],[76.45,11.65],[76.10,11.95],
  [75.80,12.05],[75.55,12.30],[75.30,12.55],[75.05,12.76]]).map(d8_pr);

// Along the coast: the survey gives each market's distance from Hosabethe, the northernmost, and Chaliyam's is 180 km. The drawn coast
// is a little longer, so a survey kilometre is D8_SK px along it, and the same scale serves for distances out to sea and phone range.
const D8_CL=(()=>{const P_=D8_NK.map(d8_pr),L=[0];for(let i=1;i<P_.length;i++)L.push(L[i-1]+Math.hypot(P_[i][0]-P_[i-1][0],P_[i][1]-P_[i-1][1]));return{P:P_,L};})();
const D8_SK=(D8_CL.L[D8_CL.L.length-1]-D8_CL.L[1])/180;
// a point on the coast, km from Hosabethe, with the direction out to sea (n) and along the coast, southwards (d)
function d8_coastAt(km){const{P:P_,L}=D8_CL,s=L[1]+km*D8_SK;let i=1;while(i<L.length-1&&L[i]<s)i++;const a=P_[i-1],b=P_[i],u=clamp((s-L[i-1])/((L[i]-L[i-1])||1),0,1),dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1;
  return{x:lerp(a[0],b[0],u),y:lerp(a[1],b[1],u),nx:-dy/n,ny:dx/n,dx:dx/n,dy:dy/n};}
// the fifteen markets of the survey, north to south, with their district (0 Kozhikode, 1 Kannur, 2 Kasaragod): phones reached the
// districts in 1997, 1998 and 2000
const D8_MK=[["Hosabethe",0,2],["Aarikkadi",12,2],["Kasaba",26,2],["Kanhangad",41,2],["Thaikadappuram",56,2],["Puthiangadi",80,1],["Neerkkadavu",95,1],["Ayikkara",101,1],["Thalassery",115,1],
  ["New Mahe",124,1],["Chombala",132,0],["Badagara",139,0],["Quilandi",154,0],["Puthiyangadi",164,0],["Chaliyam",180,0]].map(([n,km,r])=>Object.assign({n,km,r},d8_coastAt(km)));
const D8_CH=10,D8_BA=11,D8_QU=12,D8_YEARS=["1997","1998","2000"],D8_DIST=["Kozhikode","Kannur","Kasaragod"];
// a phone tower's range, about 25 km, and the towers: two a district, a few kilometres inland (where each district's stood isn't
// recorded in the study; these stand where they'd reach its markets, km along the coast and km inland)
const D8_RANGE=25*D8_SK;
const D8_TW=[[150,0,4],[170,0,5],[90,1,5],[116,1,5],[13,2,5],[44,2,5]].map(([km,r,inl])=>{const c=d8_coastAt(km);return{x:c.x-c.nx*inl*D8_SK,y:c.y-c.ny*inl*D8_SK,r};});
// rivers, from the hills to the sea (drawn, not surveyed): where each meets the coast, how far inland it rises, and its bend
const D8_RIV=[[27,52,1],[57,40,2],[66,46,3],[73,30,4],[92,58,5],[110,44,6],[121,40,7],[147,62,8],[168,46,9],[179,70,10]].map(([km,len,sd])=>{const c=d8_coastAt(km),pts=[];
  for(let i=0;i<=24;i++){const u=i/24,off=Math.sin(u*7+sd)*6*D8_SK*u+Math.sin(u*17+sd*3)*1.5*D8_SK*u;pts.push([c.x-c.nx*len*D8_SK*u+c.dx*off,c.y-c.ny*len*D8_SK*u+c.dy*off]);}return pts;});
// the Western Ghats, inland: their ridge, about 55 km in, and lines of relief either side of it (drawn, not surveyed); north and south of
// the survey's coast they run on along its line
const d8_ridgeLine=(o,j)=>{const P_=[];for(let km=-70;km<=270;km+=4){const c=d8_coastAt(clamp(km,0,180)),ex=(km<0?km:km>180?km-180:0)*D8_SK,
  inl=(56+8*Math.sin(km*0.041+0.7)+4*Math.sin(km*0.13+2)+o*(1+0.15*Math.sin(km*0.09+j*1.3)))*D8_SK;P_.push([c.x-c.nx*inl+c.dx*ex,c.y-c.ny*inl+c.dy*ex]);}return P_;};
const D8_RIDGE=d8_ridgeLine(0,0),D8_CONT=[-21,-12,-4,5,14].map((o,j)=>d8_ridgeLine(o,j+1));

// the camera over the map: keys are [time, x, y, zoom, seconds]. Zoom glides at an even pace (in log space), and the centre follows
// the zoom, so a long move in keeps what it's moving towards in view
function d8_camAt(t,keys){let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const k=keys[i],u=easeCam(clamp((t-k[0])/(k[4]||1.6),0,1));if(u<=0)break;
    const z1=Math.exp(lerp(Math.log(z),Math.log(k[3]),u)),w=Math.abs(k[3]-z)<1e-3?u:(1/z-1/z1)/(1/z-1/k[3]);x=lerp(x,k[1],w);y=lerp(y,k[2],w);z=z1;}return{x,y,z};}
const d8_camApply=(ctx,c)=>{ctx.translate(960,540);ctx.scale(c.z,c.z);ctx.translate(-c.x,-c.y);};
const d8_toS=(c,x,y)=>[960+(x-c.x)*c.z,540+(y-c.y)*c.z];
// a closed outline through the midpoints of L's sides, curving at its corners
function d8_smooth(ctx,L){const n=L.length,m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],p=m(L[n-1],L[0]);ctx.beginPath();ctx.moveTo(p[0],p[1]);
  for(let i=0;i<n;i++){const q=m(L[i],L[(i+1)%n]);ctx.quadraticCurveTo(L[i][0],L[i][1],q[0],q[1]);}ctx.closePath();}

// The map, in the camera's transform (c, from d8_camAt; lines keep their width on screen). o.sun (0..1): night to dawn; o.ker: Kerala
// lit; o.mk: the markets; o.hot: one market lit (its index); o.tw[d]: each district's phone range (0..1); o.labs: India's names;
// o.sea: the coast's names
function d8_map(ctx,t,c,o){o=o||{};const z=c.z,k=1/z,sun=o.sun||0,sy=Math.pow(z,-0.5);ctx.save();
  // the sea: lines of swell, moving, in the part of the sea in view
  const x0=c.x-960*k-40*k,x1=c.x+960*k+40*k,y0=c.y-540*k-40*k,y1=c.y+540*k+40*k,gap=34*k;
  ctx.strokeStyle="rgba("+(160+60*sun|0)+","+(200+30*sun|0)+",240,"+(0.05+0.04*sun)+")";ctx.lineWidth=1.6*k;
  for(let yy=Math.floor(y0/gap)*gap;yy<=y1;yy+=gap){ctx.beginPath();for(let xx=x0;xx<=x1;xx+=40*k){const w_=yy+Math.sin(xx*0.012*z+yy*0.05+t*0.5)*4*k;xx===x0?ctx.moveTo(xx,w_):ctx.lineTo(xx,w_);}ctx.stroke();}
  // the land: India's south and Sri Lanka, warmed from the east as the sun comes up behind the hills
  const shape=(L)=>{ctx.beginPath();L.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
  [D8_INDIA,D8_LANKA].forEach(L=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=20;shape(L);const lg=ctx.createLinearGradient(c.x-700*k,0,c.x+900*k,0);
    lg.addColorStop(0,rgba(mix([38,46,42],[64,78,62],sun),1));lg.addColorStop(1,rgba(mix([46,48,44],[112,96,72],sun),1));ctx.fillStyle=lg;ctx.fill();ctx.restore();});
  // Kerala, lit
  const kr=o.ker||0;if(kr>0.01){ctx.save();d8_smooth(ctx,D8_KERALA);ctx.fillStyle=rgba(EAC,0.3*kr);ctx.shadowColor=rgba(EAC,0.9);ctx.shadowBlur=30*kr;ctx.fill();ctx.restore();}
  // the coastal plain, green with coconut palms, and the hills: a soft band of forest along the ridge, with lines of relief that catch
  // the light as the sun comes up behind them
  if(z>0.3){const ha=clamp((z-0.3)/0.4,0,1),line=L=>{ctx.beginPath();L.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));};ctx.save();shape(D8_INDIA);ctx.clip();ctx.lineCap="round";ctx.lineJoin="round";
    for(let i=0;i<5;i++){ctx.strokeStyle=rgba(mix([34,62,44],[62,104,60],sun),0.05*ha);ctx.lineWidth=(34-i*6)*D8_SK;shape(D8_INDIA);ctx.stroke();}
    for(let i=0;i<8;i++){ctx.strokeStyle=rgba(mix([12,22,16],[22,36,24],sun),0.055*ha);ctx.lineWidth=(72-i*8)*D8_SK;line(D8_RIDGE);ctx.stroke();}
    D8_CONT.forEach((L,j)=>{ctx.strokeStyle=rgba(mix([110,124,104],[226,200,152],sun),(0.08+0.06*sun)*ha*(j===2?1.3:1));ctx.lineWidth=(j===2?1.8:1.3)*k;line(L);ctx.stroke();});ctx.restore();}
  // rivers
  if(z>0.45){const ra=clamp((z-0.45)/0.4,0,1);ctx.save();ctx.strokeStyle=rgba(mix([90,130,160],[150,200,230],sun),0.45*ra);ctx.lineWidth=1.6*k;ctx.lineCap="round";ctx.lineJoin="round";
    D8_RIV.forEach(pts=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();});ctx.restore();}
  // the coast: a line of beach
  [D8_INDIA,D8_LANKA].forEach(L=>{shape(L);ctx.strokeStyle=rgba(D8_SAND,0.16+0.1*sun);ctx.lineWidth=7*k;ctx.lineJoin="round";ctx.stroke();ctx.strokeStyle=rgba(mix([200,190,170],D8_SAND,sun),0.75);ctx.lineWidth=2*k;ctx.stroke();});
  // phone range, district by district: rings out to sea from each tower, and a pulse that travels out along them
  (o.tw||[]).forEach((p,d)=>{if(p<=0.01)return;D8_TW.filter(w=>w.r===d).forEach((w,j)=>{const R=D8_RANGE*ease(clamp(p*1.3-j*0.2,0,1));if(R<=1)return;
    ctx.save();const g=ctx.createRadialGradient(w.x,w.y,R*0.2,w.x,w.y,R);g.addColorStop(0,rgba(D8_SIG,0.0));g.addColorStop(0.85,rgba(D8_SIG,0.08*p));g.addColorStop(1,rgba(D8_SIG,0.16*p));ctx.fillStyle=g;ctx.beginPath();ctx.arc(w.x,w.y,R,0,TAU);ctx.fill();
    ctx.setLineDash([10*k,8*k]);ctx.strokeStyle=rgba(D8_SIG,0.55*p);ctx.lineWidth=2*k;ctx.beginPath();ctx.arc(w.x,w.y,R,0,TAU);ctx.stroke();ctx.restore();
    const pu=((t*0.35+j*0.5)%1);withA(ctx,p*(1-pu)*0.6,()=>{ctx.strokeStyle=rgba(D8_SIG,1);ctx.lineWidth=1.6*k;ctx.beginPath();ctx.arc(w.x,w.y,R*pu,0,TAU);ctx.stroke();});
    d8_tower(ctx,w.x,w.y,22*sy,clamp(p*2,0,1),t);});});
  // the markets
  const mk=o.mk||0;if(mk>0.01)D8_MK.forEach((m,i)=>{const a=clamp(mk*2.2-i*0.08,0,1);if(a<=0)return;const hot=o.hot===i?1:0,r=5*sy;withA(ctx,a,()=>{if(o.lit&&o.lit[i])glow(ctx,m.x,m.y,26*sy,o.litCol||TRUST,0.6*o.lit[i]);
    glow(ctx,m.x,m.y,14*sy,[255,230,190],0.35+0.3*sun);ctx.fillStyle=rgba([255,240,214],0.95);ctx.beginPath();ctx.arc(m.x,m.y,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(30,34,40,0.9)";ctx.lineWidth=1.8*k;ctx.stroke();
    if(hot)ring(ctx,m.x,m.y,r*2.2,TRUST,0.9,2*k);});});
  // names: India's, from afar; the sea's and Kerala's, near
  const la=(o.labs||0)*(1-clamp((z-0.3)/0.25,0,1));if(la>0.01)withA(ctx,la,()=>{[["India",[77.9,14.2],38],["Arabian Sea",[70.6,13.4],32],["Bay of Bengal",[85.2,13.0],32],["Sri Lanka",[80.8,7.9],28]].forEach(([s_,q,sz])=>{const[x,y]=d8_pr(q);
    T(ctx,s_,x,y,{w:700,size:sz*k,align:"center",color:rgba(s_==="India"?[236,224,200]:[170,206,236],0.9)});});});
  const ln=(o.sea||0)*clamp((z-0.55)/0.3,0,1);if(ln>0.01)withA(ctx,ln,()=>{const[ax,ay]=d8_pr([74.42,11.70]),[kx,ky]=d8_pr([75.86,12.20]);T(ctx,"Arabian Sea",ax,ay,{w:700,size:32*k,align:"center",color:rgba([176,210,236],0.85)});
    T(ctx,"Kerala",kx,ky,{w:800,size:34*k,align:"center",color:rgba([236,224,200],0.9)});});
  ctx.restore();}
// a phone tower: a lattice mast with its aerials, on the map (s: its height)
function d8_tower(ctx,x,y,s,a,t){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);glow(ctx,0,-s*0.9,s*0.9,D8_SIG,0.45);ctx.strokeStyle=rgba([228,240,255],0.95);ctx.lineWidth=s*0.07;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(-s*0.3,0);ctx.lineTo(0,-s);ctx.lineTo(s*0.3,0);ctx.moveTo(-s*0.2,-s*0.33);ctx.lineTo(s*0.2,-s*0.33);ctx.moveTo(-s*0.1,-s*0.66);ctx.lineTo(s*0.1,-s*0.66);ctx.moveTo(-s*0.3,0);ctx.lineTo(s*0.2,-s*0.33);ctx.lineTo(-s*0.1,-s*0.66);ctx.stroke();
  ctx.fillStyle=rgba(D8_SIG,1);ctx.fillRect(-s*0.16,-s*0.98,s*0.08,s*0.2);ctx.fillRect(s*0.08,-s*0.98,s*0.08,s*0.2);ctx.restore();});}
// a fishing boat from above: a long hull with a pointed bow, its crew's thwarts, a lamp while it's dark, and a wake while it moves.
// an: its heading; s: its length
function d8_boat(ctx,x,y,an,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);
  const lamp=o.lamp||0;if(lamp>0.01)glow(ctx,0,0,s*1.15,[255,210,140],0.45*lamp);ctx.rotate(an);
  const wk=o.wake||0;if(wk>0.01){ctx.save();ctx.lineCap="round";const L=s*(0.5+1.0*wk);ctx.strokeStyle="rgba(225,242,255,"+(0.26*wk)+")";ctx.lineWidth=Math.max(0.8,s*0.06);
    ctx.beginPath();ctx.moveTo(-s*0.4,-s*0.09);ctx.quadraticCurveTo(-s*0.4-L*0.5,-s*0.12,-s*0.4-L,-s*0.1-L*0.32);ctx.moveTo(-s*0.4,s*0.09);ctx.quadraticCurveTo(-s*0.4-L*0.5,s*0.12,-s*0.4-L,s*0.1+L*0.32);ctx.stroke();
    ctx.strokeStyle="rgba(235,248,255,"+(0.16*wk)+")";ctx.lineWidth=Math.max(1,s*0.12);ctx.beginPath();ctx.moveTo(-s*0.46,0);ctx.lineTo(-s*0.46-L*0.7,0);ctx.stroke();ctx.restore();}
  const hull=()=>{ctx.beginPath();ctx.moveTo(s*0.55,0);ctx.bezierCurveTo(s*0.35,-s*0.15,-s*0.2,-s*0.15,-s*0.46,-s*0.11);ctx.quadraticCurveTo(-s*0.5,0,-s*0.46,s*0.11);ctx.bezierCurveTo(-s*0.2,s*0.15,s*0.35,s*0.15,s*0.55,0);ctx.closePath();};
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=s*0.3;hull();const g=ctx.createLinearGradient(0,-s*0.15,0,s*0.15);g.addColorStop(0,"#d9c5a2");g.addColorStop(1,"#8a6a4a");ctx.fillStyle=g;ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(50,34,22,0.9)";ctx.lineWidth=Math.max(0.8,s*0.04);hull();ctx.stroke();
  ctx.save();ctx.scale(0.78,0.62);hull();ctx.fillStyle="rgba(60,40,26,0.85)";ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(214,190,150,0.9)";ctx.lineWidth=Math.max(0.7,s*0.035);ctx.beginPath();[-0.22,0.02,0.24].forEach(u=>{ctx.moveTo(s*u,-s*0.085);ctx.lineTo(s*u,s*0.085);});ctx.stroke();
  ctx.fillStyle="rgba(40,44,50,0.95)";ctx.fillRect(-s*0.52,-s*0.04,s*0.08,s*0.08);
  ctx.restore();});}
// a buyer waiting at a market, drawn as a map draws people: a head and shoulders (s: its height)
function d8_buyer(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y-s*0.72,s*0.22,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x-s*0.36,y);ctx.quadraticCurveTo(x-s*0.36,y-s*0.44,x,y-s*0.46);ctx.quadraticCurveTo(x+s*0.36,y-s*0.44,x+s*0.36,y);ctx.closePath();ctx.fill();});}
// silver in the shallows: a catch poured back into the sea, seen from above
function d8_spill(ctx,x,y,r,t,a){if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<26;i++){const an=hash(i,820)*TAU,d=r*Math.sqrt(hash(i,821)),xx=x+Math.cos(an)*d,yy=y+Math.sin(an)*d*0.6,tw_=0.5+0.5*Math.sin(t*5+i*1.7);
  ctx.fillStyle="rgba(220,232,240,"+(0.5+0.4*tw_)+")";ctx.beginPath();ctx.ellipse(xx,yy,r*0.07,r*0.025,an,0,TAU);ctx.fill();}glow(ctx,x,y,r*1.2,[200,220,235],0.25);});}

/* ---------- up close: the beach, the phone, the prices ---------- */
// a sardine, side on: a slim body tapering to a forked tail, silver, darker along the back (an: its angle; s: its length)
function d8_fish(ctx,x,y,an,s,gl){ctx.save();ctx.translate(x,y);ctx.rotate(an);const g=ctx.createLinearGradient(0,-s*0.14,0,s*0.12);g.addColorStop(0,"#4b6a86");g.addColorStop(0.45,"#c9d6df");g.addColorStop(1,"#eef3f6");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(s*0.5,0);ctx.bezierCurveTo(s*0.38,-s*0.15,-s*0.18,-s*0.14,-s*0.36,-s*0.03);ctx.lineTo(-s*0.5,-s*0.13);ctx.lineTo(-s*0.44,0);ctx.lineTo(-s*0.5,s*0.13);ctx.lineTo(-s*0.36,s*0.03);ctx.bezierCurveTo(-s*0.18,s*0.12,s*0.38,s*0.13,s*0.5,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(20,26,34,0.85)";ctx.beginPath();ctx.arc(s*0.38,-s*0.02,s*0.025,0,TAU);ctx.fill();if(gl>0.01){ctx.fillStyle="rgba(255,255,255,"+(0.7*gl)+")";ctx.beginPath();ctx.ellipse(s*0.08,-s*0.04,s*0.16,s*0.018,0,0,TAU);ctx.fill();}ctx.restore();}
// a crow: standing and pecking (fly 0), or flying with its wings beating (fly 1); facing right unless dir is -1
function d8_crow(ctx,x,y,s,t,fly,dir){ctx.save();ctx.translate(x,y);ctx.scale(dir||1,1);ctx.fillStyle="#16171c";
  if(fly){const fl=Math.sin(t*9);ctx.beginPath();ctx.ellipse(0,0,s*0.34,s*0.12,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(s*0.34,-s*0.04,s*0.1,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(s*0.42,-s*0.06);ctx.lineTo(s*0.56,-s*0.02);ctx.lineTo(s*0.42,0);ctx.fill();
    ctx.beginPath();ctx.moveTo(-s*0.3,0);ctx.lineTo(-s*0.56,-s*0.08);ctx.lineTo(-s*0.56,s*0.08);ctx.closePath();ctx.fill();
    [-1,1].forEach(k=>{ctx.beginPath();ctx.moveTo(-s*0.08,0);ctx.quadraticCurveTo(-s*0.1,-s*0.5*fl*k,-s*0.34,-s*0.62*fl*k-s*0.05);ctx.quadraticCurveTo(s*0.06,-s*0.3*fl*k,s*0.12,0);ctx.closePath();ctx.fill();});}
  else{const pk=Math.max(0,Math.sin(t*2.6))*0.5;ctx.beginPath();ctx.ellipse(0,-s*0.32,s*0.3,s*0.18,-0.25,0,TAU);ctx.fill();ctx.save();ctx.translate(s*0.24,-s*0.44);ctx.rotate(pk);ctx.beginPath();ctx.arc(0,0,s*0.11,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(s*0.08,-s*0.03);ctx.lineTo(s*0.25,s*0.02);ctx.lineTo(s*0.08,s*0.04);ctx.fill();ctx.restore();ctx.beginPath();ctx.moveTo(-s*0.26,-s*0.28);ctx.lineTo(-s*0.56,-s*0.18);ctx.lineTo(-s*0.5,-s*0.3);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#16171c";ctx.lineWidth=s*0.04;ctx.beginPath();ctx.moveTo(-s*0.02,-s*0.16);ctx.lineTo(-s*0.04,0);ctx.moveTo(s*0.08,-s*0.16);ctx.lineTo(s*0.1,0);ctx.stroke();ctx.fillStyle="rgba(120,140,170,0.25)";ctx.beginPath();ctx.ellipse(-s*0.02,-s*0.36,s*0.14,s*0.05,-0.25,0,TAU);ctx.fill();}
  ctx.restore();}
// a coconut palm, leaning: a tapering, ringed trunk and fronds that move a little in the wind (x, y: its foot; s: its height)
function d8_palm(ctx,x,y,s,t,lean,col){ctx.save();ctx.translate(x,y);const sw=Math.sin(t*0.8)*0.02,tx=s*lean,ty=-s;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-s*0.035,0);ctx.quadraticCurveTo(tx*0.3-s*0.03,-s*0.55,tx-s*0.015,ty);ctx.lineTo(tx+s*0.015,ty);
  ctx.quadraticCurveTo(tx*0.3+s*0.03,-s*0.55,s*0.035,0);ctx.closePath();ctx.fill();
  for(let k=0;k<9;k++){const an=-Math.PI*0.95+k*Math.PI*0.21+sw*(1+k%3)+(k%2?0.05:-0.05),L=s*(0.32+0.1*hash(k,830)),droop=0.55+0.25*hash(k,831);ctx.save();ctx.translate(tx,ty);ctx.rotate(an);
    ctx.strokeStyle=col;ctx.lineWidth=s*0.012;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(L*0.5,-L*0.12,L,L*droop*0.5);ctx.stroke();
    for(let j=1;j<12;j++){const u=j/12,px=L*u,py=-L*0.12*4*u*(1-u)*0.5+L*droop*0.5*u*u,lf=L*0.2*(1-u*0.6);ctx.lineWidth=s*0.008;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+lf*0.4,py+lf);ctx.moveTo(px,py);ctx.lineTo(px+lf*0.5,py-lf*0.3);ctx.stroke();}ctx.restore();}
  ctx.fillStyle=col;[[-0.02,0.01],[0.025,0.03],[0.0,0.045]].forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(tx+dx*s,ty+dy*s,s*0.022,0,TAU);ctx.fill();});ctx.restore();}
// a woven basket on its side, its mouth towards the sea (s: its size)
function d8_basket(ctx,x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);const g=ctx.createLinearGradient(0,-s*0.5,0,s*0.5);g.addColorStop(0,"#c7a067");g.addColorStop(1,"#6e5131");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-s*0.55,-s*0.38);ctx.quadraticCurveTo(-s*0.75,0,-s*0.55,s*0.38);ctx.lineTo(s*0.4,s*0.46);ctx.quadraticCurveTo(s*0.62,0,s*0.4,-s*0.46);ctx.closePath();ctx.fill();
  ctx.save();ctx.clip();ctx.strokeStyle="rgba(70,48,24,0.5)";ctx.lineWidth=s*0.03;for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(-s+i*s*0.14,-s);ctx.lineTo(i*s*0.14+s*0.2,s);ctx.stroke();ctx.beginPath();ctx.moveTo(-s,i*s*0.12);ctx.lineTo(s,i*s*0.12+s*0.08);ctx.stroke();}ctx.restore();
  ctx.fillStyle="#3a2a1a";ctx.beginPath();ctx.ellipse(s*0.46,0,s*0.13,s*0.44,0,0,TAU);ctx.fill();ctx.strokeStyle="#d8b47a";ctx.lineWidth=s*0.05;ctx.beginPath();ctx.ellipse(s*0.46,0,s*0.13,s*0.44,0,0,TAU);ctx.stroke();ctx.restore();}
// The beach at Badagara, at a quarter to eight, close up: the sea rolling in, the swash sliding up the sand and back, a plank-built boat
// pulled up on the beach with its outboard motor, baskets tipped at the water's edge and the catch carried off by the sea, crows
// waiting, and a palm. The sun is coming up behind the beach, over the hills, so shadows fall towards the sea. pour (0..1): the catch
// going into the water; o.lab: the place and time
function d8_beach(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const pour=clamp(o.pour==null?1:o.pour,0,1);withA(ctx,a,()=>{
  glass(ctx,x-8,y-8,w+16,h+16,22,[255,206,170],{glow:18,ea:0.75,fill:"rgba(8,12,24,0.95)"});ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.translate(x,y);
  const hz=h*0.33,sh=h*0.58,sw=Math.sin(t*0.85),sy=sh+12+sw*12;
  let g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,"#5a6d9a");g.addColorStop(0.62,"#c49fb2");g.addColorStop(1,"#f1c6a6");ctx.fillStyle=g;ctx.fillRect(0,0,w,hz+2);
  for(let i=0;i<4;i++){const cx=w*(0.12+0.26*i)+Math.sin(t*0.05+i)*10,cy=hz*(0.3+0.16*hash(i,840));ctx.fillStyle="rgba(255,226,206,0.32)";ctx.beginPath();ctx.ellipse(cx,cy,w*0.1,h*0.016,0,0,TAU);ctx.fill();}
  g=ctx.createLinearGradient(0,hz,0,sh+24);g.addColorStop(0,"#5b7593");g.addColorStop(0.45,"#3f7488");g.addColorStop(1,"#5a9a99");ctx.fillStyle=g;ctx.fillRect(0,hz,w,sh-hz+40);
  ctx.fillStyle="rgba(255,214,190,0.14)";ctx.fillRect(0,hz,w,6);
  // swell, moving in
  for(let i=0;i<10;i++){const u=((i/10)+t*0.04)%1,yy=hz+(sh-hz)*Math.pow(u,1.7);ctx.strokeStyle="rgba(232,242,246,"+(0.06+0.2*u)+")";ctx.lineWidth=0.8+2.4*u;ctx.beginPath();
    for(let xx=0;xx<=w;xx+=14){const y2=yy+Math.sin(xx*0.018+i*1.7+t*0.6)*(0.6+3*u);xx?ctx.lineTo(xx,y2):ctx.moveTo(xx,y2);}ctx.stroke();}
  // the sand: wet below the swash, dry above it, with the morning's long shadows
  g=ctx.createLinearGradient(0,sh,0,h);g.addColorStop(0,"#7a6656");g.addColorStop(0.3,"#a88d70");g.addColorStop(1,"#d3b58c");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,h);
  for(let xx=0;xx<=w;xx+=16)ctx.lineTo(xx,sh+Math.sin(xx*0.012+1.3)*5);ctx.lineTo(w,h);ctx.closePath();ctx.fill();
  for(let i=0;i<120;i++){const xx=hash(i,841)*w,yy=sh+16+hash(i,842)*(h-sh-16);ctx.fillStyle="rgba(90,70,50,"+(0.1+0.14*hash(i,843))+")";ctx.fillRect(xx,yy,1.6,1.2);}
  // the swash: a thin sheet of sea that slides up the sand and back, with foam on its edge
  ctx.fillStyle="rgba(120,180,184,0.5)";ctx.beginPath();ctx.moveTo(0,sh-6);for(let xx=0;xx<=w;xx+=12)ctx.lineTo(xx,sy+Math.sin(xx*0.03+t*0.7)*4+Math.sin(xx*0.011)*6);ctx.lineTo(w,sh-6);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(250,252,250,0.75)";ctx.lineWidth=2.4;ctx.beginPath();for(let xx=0;xx<=w;xx+=12){const yy=sy+Math.sin(xx*0.03+t*0.7)*4+Math.sin(xx*0.011)*6;xx?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  const br=sh-14+Math.sin(t*0.85+1.4)*6;ctx.strokeStyle="rgba(250,252,250,0.55)";ctx.lineWidth=5;ctx.beginPath();for(let xx=0;xx<=w;xx+=12){const yy=br+Math.sin(xx*0.025+t*1.1)*3;xx?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  // a palm at the edge of the beach
  d8_palm(ctx,w*0.06,h+10,h*0.95,t,0.22,"rgba(22,26,30,0.92)");
  // the boat, pulled up on the sand: plank-built, a faded blue band along its sheer, its outboard motor tilted up, nets in it
  const bx=w*0.7,by=h*0.86,bl=w*0.5;ctx.save();ctx.translate(bx,by);ctx.rotate(-0.06);
  ctx.fillStyle="rgba(60,40,24,0.22)";ctx.beginPath();ctx.ellipse(-bl*0.02,-bl*0.06,bl*0.52,bl*0.07,-0.05,0,TAU);ctx.fill();
  [-0.28,0.24].forEach(u=>{ctx.fillStyle="#5b4330";rr(ctx,bl*u-8,4,16,12,4);ctx.fill();});
  const hullP=()=>{ctx.beginPath();ctx.moveTo(-bl*0.52,-bl*0.13);ctx.quadraticCurveTo(-bl*0.46,bl*0.02,-bl*0.3,bl*0.03);ctx.lineTo(bl*0.32,bl*0.03);ctx.quadraticCurveTo(bl*0.5,bl*0.02,bl*0.55,-bl*0.16);ctx.quadraticCurveTo(bl*0.1,-bl*0.08,-bl*0.52,-bl*0.13);ctx.closePath();};
  hullP();g=ctx.createLinearGradient(0,-bl*0.14,0,bl*0.04);g.addColorStop(0,"#6a4a30");g.addColorStop(0.55,"#4b3220");g.addColorStop(1,"#2e1f15");ctx.fillStyle=g;ctx.fill();
  ctx.save();hullP();ctx.clip();ctx.fillStyle="#46708d";ctx.beginPath();ctx.moveTo(-bl*0.52,-bl*0.13);ctx.quadraticCurveTo(bl*0.1,-bl*0.08,bl*0.55,-bl*0.16);ctx.lineTo(bl*0.55,-bl*0.11);ctx.quadraticCurveTo(bl*0.1,-bl*0.035,-bl*0.52,-bl*0.085);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(20,12,8,0.45)";ctx.lineWidth=1.2;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(-bl*0.5,-bl*0.085+k*bl*0.03);ctx.quadraticCurveTo(0,-bl*0.03+k*bl*0.03,bl*0.53,-bl*0.11+k*bl*0.03);ctx.stroke();}
  ctx.fillStyle="rgba(255,226,180,0.16)";ctx.fillRect(-bl*0.6,-bl*0.2,bl*1.2,bl*0.05);ctx.restore();
  ctx.strokeStyle="#2a1c12";ctx.lineWidth=2;hullP();ctx.stroke();
  ctx.fillStyle="rgba(40,64,52,0.95)";ctx.beginPath();ctx.moveTo(-bl*0.22,-bl*0.1);ctx.quadraticCurveTo(-bl*0.05,-bl*0.2,bl*0.12,-bl*0.1);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(140,180,150,0.35)";ctx.lineWidth=1;
  for(let k=0;k<8;k++){ctx.beginPath();ctx.moveTo(-bl*0.2+k*bl*0.04,-bl*0.1);ctx.lineTo(-bl*0.16+k*bl*0.04,-bl*0.16);ctx.stroke();}
  ctx.save();ctx.translate(-bl*0.54,-bl*0.14);ctx.rotate(-0.5);ctx.fillStyle="#2b2e34";rr(ctx,-10,-26,26,30,5);ctx.fill();ctx.fillStyle="#c8cdd4";ctx.fillRect(-6,-22,12,4);ctx.fillStyle="#3a3e46";ctx.fillRect(-2,4,6,bl*0.16);ctx.restore();
  ctx.restore();
  // the catch: baskets tipped at the water's edge, and sardines spilling into the swash; the sea takes them out
  const kx=w*0.3,ky=sh+30;d8_basket(ctx,kx,ky+8,40,-0.35);d8_basket(ctx,kx+70,ky+16,34,-0.15);
  for(let i=0;i<46;i++){const ph=hash(i,850),u=clamp(pour*1.4-ph*0.4,0,1);if(u<=0)continue;const dr=(t*0.05+ph)%1,out=u*(0.3+0.7*dr),fx=kx-30+hash(i,851)*190-out*40,fy=lerp(ky+6,sh-6,out)+Math.sin(t*0.85+fx*0.03)*6*(1-out);
    withA(ctx,(1-sstep(0.75,1,out))*clamp(u*3,0,1),()=>d8_fish(ctx,fx,fy,(hash(i,852)-0.5)*1.4+Math.sin(t*2+i)*0.1,15+5*hash(i,853),0.5+0.5*Math.sin(t*3+i)));}
  for(let i=0;i<10;i++)d8_fish(ctx,kx+18+hash(i,854)*40,ky+16+hash(i,855)*14,(hash(i,856)-0.5)*0.8,16,0.3);
  // crows, waiting for it
  d8_crow(ctx,kx+150,ky+40,26,t,0,-1);d8_crow(ctx,kx-70,ky+44,24,t+1.3,0,1);d8_crow(ctx,w*0.52+Math.sin(t*0.5)*60,hz+30+Math.sin(t*0.9)*8,24,t,1,1);
  // the morning light, from behind
  g=ctx.createLinearGradient(0,h,0,0);g.addColorStop(0,"rgba(255,200,140,0.12)");g.addColorStop(1,"rgba(255,200,140,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.restore();
  if(o.lab)tag(ctx,x+18,y+h-34,o.lab,[255,214,170],{size:28});});}
// a skipper's phone at sea, close up: a hand holding a mobile phone of the time, its small green screen showing two lines (o.l1, o.l2),
// and its signal bars (o.bars, 0..4); the sea behind, from the boat
function d8_phone(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-8,y-8,w+16,h+16,22,D8_SIG,{glow:18,ea:0.75,fill:"rgba(8,12,24,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.translate(x,y);const roll=Math.sin(t*0.9)*0.025,hz=h*0.36+Math.sin(t*0.9)*8;
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(roll);ctx.translate(-w/2,-h/2);
  let g=ctx.createLinearGradient(0,-40,0,hz);g.addColorStop(0,"#4e628f");g.addColorStop(1,"#e6b59e");ctx.fillStyle=g;ctx.fillRect(-60,-60,w+120,hz+60);
  g=ctx.createLinearGradient(0,hz,0,h);g.addColorStop(0,"#56708e");g.addColorStop(1,"#22404f");ctx.fillStyle=g;ctx.fillRect(-60,hz,w+120,h-hz+60);
  for(let i=0;i<12;i++){const u=((i/12)+t*0.05)%1,yy=hz+(h-hz)*Math.pow(u,1.5);ctx.strokeStyle="rgba(220,236,246,"+(0.05+0.14*u)+")";ctx.lineWidth=1+2*u;ctx.beginPath();for(let xx=-60;xx<=w+60;xx+=16){const y2=yy+Math.sin(xx*0.02+i*2+t*0.7)*(1+4*u);xx===-60?ctx.moveTo(xx,y2):ctx.lineTo(xx,y2);}ctx.stroke();}
  for(let i=0;i<3;i++){const bx=w*(0.12+0.3*i)+Math.sin(t*0.2+i)*12,by=hz+6+i*3;ctx.fillStyle="rgba(30,36,46,0.7)";ctx.beginPath();ctx.ellipse(bx,by,14,3,0,0,TAU);ctx.fill();}
  ctx.restore();
  // the boat's gunwale, in the foreground
  ctx.fillStyle="#3e2a1b";ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,h*0.86);ctx.quadraticCurveTo(w*0.5,h*0.8+Math.sin(t*0.9)*4,w,h*0.88);ctx.lineTo(w,h);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(230,190,140,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,h*0.86);ctx.quadraticCurveTo(w*0.5,h*0.8+Math.sin(t*0.9)*4,w,h*0.88);ctx.stroke();
  // the hand and the phone
  const pw=228,ph=440,px=w*0.5,py=h*0.5+Math.sin(t*1.1)*3;ctx.save();ctx.translate(px,py);ctx.rotate(-0.07+Math.sin(t*0.7)*0.01);
  const skin=[146,98,68],skL=[186,132,96],skD=[104,66,44];
  g=ctx.createLinearGradient(-pw*0.7,0,pw*0.7,0);g.addColorStop(0,rgba(skL,1));g.addColorStop(1,rgba(skD,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-pw*0.55,ph*0.75);ctx.bezierCurveTo(-pw*0.62,ph*0.35,-pw*0.6,ph*0.12,-pw*0.42,ph*0.06);ctx.lineTo(pw*0.48,ph*0.1);ctx.bezierCurveTo(pw*0.64,ph*0.2,pw*0.62,ph*0.45,pw*0.5,ph*0.75);ctx.closePath();ctx.fill();
  ctx.fillRect(-pw*0.5,ph*0.6,pw*0.95,ph*0.4);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetX=6;ctx.shadowOffsetY=8;g=ctx.createLinearGradient(-pw/2,0,pw/2,0);g.addColorStop(0,"#4a4f58");g.addColorStop(0.5,"#30343b");g.addColorStop(1,"#1d2026");ctx.fillStyle=g;
  rr(ctx,-pw/2,-ph/2,pw,ph,40);ctx.fill();ctx.restore();ctx.fillStyle="#30343b";rr(ctx,pw*0.18,-ph/2-62,30,74,12);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(pw*0.18+6,-ph/2-56,5,60);
  ctx.strokeStyle="rgba(255,255,255,0.14)";ctx.lineWidth=2;rr(ctx,-pw/2+3,-ph/2+3,pw-6,ph-6,38);ctx.stroke();
  ctx.fillStyle="rgba(10,10,12,0.8)";for(let k=0;k<5;k++)rr(ctx,-24+k*11,-ph/2+26,6,3,1.5),ctx.fill();
  // the screen: green, lit, with black text
  const sx=-pw*0.41,sy=-ph*0.4,sw_=pw*0.82,shh=ph*0.29;ctx.fillStyle="#141619";rr(ctx,sx-6,sy-6,sw_+12,shh+12,10);ctx.fill();g=ctx.createLinearGradient(0,sy,0,sy+shh);g.addColorStop(0,"#b9d07c");g.addColorStop(1,"#97b462");ctx.fillStyle=g;rr(ctx,sx,sy,sw_,shh,6);ctx.fill();
  glow(ctx,0,sy+shh/2,sw_*0.6,[190,230,120],0.25);const bars=o.bars||0;for(let k=0;k<4;k++){ctx.fillStyle=k<bars?"rgba(22,30,14,0.95)":"rgba(22,30,14,0.18)";ctx.fillRect(sx+10,sy+shh-18-k*12,6+k*3,7);}
  ctx.fillStyle="rgba(22,30,14,0.95)";ctx.fillRect(sx+sw_-30,sy+10,20,10);ctx.fillRect(sx+sw_-10,sy+13,3,4);
  if(o.l1)T(ctx,o.l1,sx+sw_/2+8,sy+shh*0.42,{f:"mono",w:500,size:28,align:"center",color:"rgba(18,26,12,0.95)"});if(o.l2)T(ctx,o.l2,sx+sw_/2+8,sy+shh*0.42+36,{f:"mono",w:500,size:28,align:"center",color:"rgba(18,26,12,0.95)"});
  // keys
  ctx.fillStyle="#9aa0a8";rr(ctx,-pw*0.36,-ph*0.06,pw*0.24,20,8);ctx.fill();rr(ctx,pw*0.12,-ph*0.06,pw*0.24,20,8);ctx.fill();ctx.fillStyle="#c9ced6";rr(ctx,-24,-ph*0.075,48,30,12);ctx.fill();
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){const kx=-pw*0.3+c*pw*0.3,ky=ph*0.06+r*ph*0.085;ctx.fillStyle="#b7bcc4";rr(ctx,kx-24,ky-12,48,26,10);ctx.fill();T(ctx,["1","2","3","4","5","6","7","8","9","*","0","#"][r*3+c],kx,ky+6,{w:700,size:15,align:"center",color:"rgba(40,44,52,0.85)",deco:1});}
  // the thumb, in front, along the left side; three fingertips round the right
  g=ctx.createLinearGradient(-pw*0.7,0,-pw*0.2,0);g.addColorStop(0,rgba(skL,1));g.addColorStop(1,rgba(skin,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-pw*0.62,ph*0.42);ctx.bezierCurveTo(-pw*0.66,ph*0.22,-pw*0.6,ph*0.1,-pw*0.44,ph*0.02);
  ctx.bezierCurveTo(-pw*0.36,-ph*0.01,-pw*0.3,ph*0.04,-pw*0.34,ph*0.1);ctx.bezierCurveTo(-pw*0.4,ph*0.18,-pw*0.42,ph*0.3,-pw*0.36,ph*0.44);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(skD,0.6);ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle=rgba(mix(skL,[255,255,255],0.25),0.6);ctx.beginPath();ctx.ellipse(-pw*0.39,ph*0.05,9,5,-0.8,0,TAU);ctx.fill();
  [[0.12,0],[0.24,1],[0.36,2]].forEach(([fy,k])=>{const yy=ph*fy;g=ctx.createLinearGradient(pw*0.4,0,pw*0.62,0);g.addColorStop(0,rgba(skin,1));g.addColorStop(1,rgba(skD,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(pw*0.62,yy-26);
    ctx.bezierCurveTo(pw*0.5,yy-28,pw*0.42,yy-20,pw*0.42,yy-8);ctx.bezierCurveTo(pw*0.42,yy+6,pw*0.5,yy+14,pw*0.62,yy+12);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(skD,0.7);ctx.lineWidth=1.4;ctx.stroke();
    ctx.fillStyle=rgba(mix(skL,[255,240,230],0.35),0.55);ctx.beginPath();ctx.ellipse(pw*0.47,yy-8,5,8,0.2,0,TAU);ctx.fill();});
  ctx.restore();ctx.restore();
  if(o.lab)tag(ctx,x+18,y+h-34,o.lab,D8_SIG,{size:28});});}
// Prices at three markets over the months the phones arrived, drawn after Jensen's figure, not plotted from his data: before, they
// swing from day to day and a market with too many boats drops to nothing; after, they move together. p (0..1): drawn up to
function d8_prices(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,[255,214,170],{glow:14,ea:0.75,fill:"rgba(8,12,24,0.95)"});
  T(ctx,"sardine prices at three markets",x+26,y+46,{w:800,size:28,color:rgba([255,226,190],1)});const gx=x+40,gy=y+74,gw=w-70,gh=h-120,ph_=0.42,N=64;
  ctx.strokeStyle="rgba(220,230,255,0.25)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx,gy+gh);ctx.lineTo(gx+gw,gy+gh);ctx.stroke();
  T(ctx,"Rs a kg",gx+8,gy+14,{w:600,size:20,color:"rgba(200,210,230,0.7)",deco:1});T(ctx,"0",gx-10,gy+gh+6,{w:600,size:20,align:"right",color:"rgba(200,210,230,0.7)",deco:1});
  const mx=gx+gw*ph_;ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(D8_SIG,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx,gy-6);ctx.lineTo(mx,gy+gh);ctx.stroke();ctx.restore();
  T(ctx,"phones",mx+10,gy+gh-12,{w:700,size:28,color:rgba(D8_SIG,1)});
  [[255,214,150],[255,150,130],[160,210,255]].forEach((col,m)=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.8;ctx.lineJoin="round";ctx.beginPath();
    for(let i=0;i<=N*p;i++){const u=i/N,f=u<ph_?1:Math.exp(-(u-ph_)/0.035),vb=0.58+0.3*Math.sin(i*1.9+m*2.3)*Math.sin(i*0.37+m)+0.2*(hash(i*3+m,861)-0.5),
        va=0.62+0.025*Math.sin(i*0.33+m*2.1)+0.018*Math.sin(i*0.91+m*4.7)+0.012*(hash(i*3+m,862)-0.5),v=u<ph_&&hash(i*3+m,860)>0.88?0:clamp(lerp(va,vb,f),0.04,1);
      const xx=gx+u*gw,yy=gy+gh-v*gh*0.92;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();ctx.restore();});});}
// When the answer arrives, in one morning: at sea, then the choice of where to land, then at the market. u (0..1) moves the answer
// (a price) from after the choice, where it's too late, to before it, where it can still be acted on
function d8_when(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=250;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,[220,230,255],{glow:12,ea:0.6,fill:"rgba(8,12,24,0.95)"});
  const ly=y+150,xa=x+90,xb=x+w*0.5,xc=x+w-110,e=ease(clamp(u,0,1));ctx.save();ctx.strokeStyle="rgba(220,230,255,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xa,ly);ctx.lineTo(xc,ly);ctx.stroke();ctx.restore();
  d8_boat(ctx,xa,ly,0,46,{});ctx.save();ctx.fillStyle=rgba([255,240,214],1);ctx.beginPath();ctx.arc(xc,ly,9,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(xb,ly);ctx.fillStyle="rgba(8,12,24,1)";ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(22,0);ctx.lineTo(0,22);ctx.lineTo(-22,0);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(BUS,1);ctx.lineWidth=3;ctx.stroke();ctx.restore();
  T(ctx,"at sea",xa,ly+62,{w:700,size:28,align:"center",color:rgba(SOFT,1)});T(ctx,"choose where to land",xb,ly+62,{w:700,size:28,align:"center",color:rgba(BUS,1)});T(ctx,"at the market",xc,ly+62,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
  const ax=lerp(xc,lerp(xa,xb,0.55),e),col=mix(D8_RED,TRUST,e);tag(ctx,ax,ly-58,"the price",col,{align:"center",size:28});ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ly-36);ctx.lineTo(ax,ly-12);ctx.stroke();ctx.restore();
  withA(ctx,1-sstep(0.3,0.5,u),()=>T(ctx,"too late",x+w-30,y+52,{w:800,size:30,align:"right",color:rgba(D8_RED,1)}));withA(ctx,sstep(0.6,0.85,u),()=>T(ctx,"in time",x+30,y+52,{w:800,size:30,color:rgba(TRUST,1)}));});}

/* ---------- the wall and the glass: requests, decisions, questions, measures ---------- */
// the film's own glyphs, beside the series' (archGlyph): a decision is a diamond, as flowcharts and BPMN draw one; a question, a
// speech bubble with a question mark; a measure, a dial, with its needle at v (ArchiMate has no element for one, so this is the
// series' own); a data product, a hexagon
function d8_glyph(ctx,kind,x,y,s,col,v){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="decision"){ctx.beginPath();ctx.moveTo(x,y-s*0.8);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x,y+s*0.8);ctx.lineTo(x-s*0.8,y);ctx.closePath();ctx.stroke();}
  else if(kind==="question"){rr(ctx,x-s*0.8,y-s*0.7,s*1.6,s*1.1,s*0.35);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.3,y+s*0.4);ctx.lineTo(x-s*0.45,y+s*0.8);ctx.lineTo(x+s*0.05,y+s*0.4);ctx.stroke();
    T(ctx,"?",x,y+s*0.18,{w:800,size:s,align:"center",color:rgba(col,1),deco:1});}
  else if(kind==="measure"){const cy=y+s*0.38;ctx.beginPath();ctx.arc(x,cy,s*0.85,Math.PI,0);ctx.stroke();for(let k=0;k<=4;k++){const an=Math.PI+k*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*s*0.85,cy+Math.sin(an)*s*0.85);ctx.lineTo(x+Math.cos(an)*s*0.62,cy+Math.sin(an)*s*0.62);ctx.stroke();}
    const an=Math.PI*(1.15+0.7*clamp(v==null?0.55:v,0,1));ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x+Math.cos(an)*s*0.7,cy+Math.sin(an)*s*0.7);ctx.stroke();ctx.beginPath();ctx.arc(x,cy,s*0.14,0,TAU);ctx.fill();}
  else if(kind==="product"){ctx.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*TAU/6;ctx.lineTo(x+Math.cos(an)*s*0.85,y+Math.sin(an)*s*0.85);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.25,0,TAU);ctx.fill();}
  else archGlyph(ctx,kind,x,y,s,col);ctx.restore();}
// an element of the model with the film's glyphs as well as the series': archEl, then the glyph where archEl puts its own
function d8_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const own=["decision","question","measure","product"].includes(kind);
  archEl(ctx,x,y,w,h,name,col,own?"none":kind,o);if(own){const gs=o.gs||13;withA(ctx,a,()=>d8_glyph(ctx,kind,x+w-gs-11,y+gs+9,gs,col,o.v));}}
// a dashed place where an element should be, empty: with a question mark, or a few words
function d8_slot(ctx,x,y,w,h,col,a,label){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,8);ctx.stroke();ctx.restore();
  if(label)T(ctx,label,x+w/2,y+h/2+10,{w:700,size:28,align:"center",color:rgba(col,0.95)});else T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(col,0.95)});});}
// a rubber stamp on paper, small: deco when it's too small to read
function d8_stamp(ctx,x,y,s,col,size,rot,a,deco){if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,size,800)+size*0.9,h=size*1.5;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=Math.max(1.2,size*0.1);
  rr(ctx,-w/2,-h/2,w,h,size*0.2);ctx.stroke();T(ctx,s,0,size*0.36,{w:800,size,align:"center",color:rgba(col,0.9),deco});ctx.restore();});}
// A request from the backlog, on an index card: its number, what it asks for, and (o.urgent) a red stamp. o.deco: the card is drawn
// small, as texture; o.dead (0..1) greys it; o.hi lights it in gold; o.p writes its words
function d8_card(ctx,cx,cy,w,h,num,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||28,deco=o.deco?1:0,dead=o.dead||0,hd=Math.max(sz*1.2,30);withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot==null?(hash(num,870)-0.5)*0.05:o.rot);
  if(o.hi>0.01){ctx.save();ctx.shadowColor=rgba(TRUST,0.9*o.hi);ctx.shadowBlur=24*o.hi;ctx.strokeStyle=rgba(TRUST,0.95*o.hi);ctx.lineWidth=4;ctx.strokeRect(-w/2-6,-h/2-6,w+12,h+12);ctx.restore();}
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(mix([244,239,226],[132,128,124],dead*0.6),1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.strokeStyle="rgba(200,70,70,"+(0.6*(1-dead*0.5))+")";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-w/2,-h/2+hd);ctx.lineTo(w/2,-h/2+hd);ctx.stroke();
  ctx.strokeStyle="rgba(90,130,190,0.16)";ctx.lineWidth=1;for(let yy=-h/2+hd+sz*1.15;yy<h/2-4;yy+=sz*1.15){ctx.beginPath();ctx.moveTo(-w/2+6,yy);ctx.lineTo(w/2-6,yy);ctx.stroke();}
  T(ctx,"#"+(num<10?"0":"")+num,-w/2+12,-h/2+hd-sz*0.32,{f:"mono",w:500,size:sz*0.95,color:"rgba(160,60,56,0.92)",deco});
  // as many lines as the card holds; the last ends in an ellipsis when the text runs on
  const b0=-h/2+hd+sz*1.02,lh=sz*1.15,fit=Math.max(1,Math.floor((h/2-sz*0.22-b0)/lh)+1);let ls=wrapT(ctx,text,0,0,w-26,{size:sz,w:700,measure:true});
  if(ls.length>fit){ls=ls.slice(0,fit);let l=ls[fit-1];while(l.length>1&&tw(ctx,l+"…",sz,700)>w-26)l=l.slice(0,-1);ls[fit-1]=l.replace(/[\s,]+$/,"")+"…";}
  const p=o.p==null?1:o.p;let left=text.length*p;ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;
    T(ctx,s_,-w/2+13,b0+i*lh,{w:700,size:sz,color:rgba(mix([44,42,46],[92,90,92],dead),0.95),deco});});
  if(o.urgent)d8_stamp(ctx,w/2-sz*2.1,-h/2+hd*0.5,"urgent",[206,52,46],sz*0.8,-0.14,o.urgent,deco);
  if(dead>0.01&&o.x)withA(ctx,dead,()=>{ctx.strokeStyle=rgba(D8_RED,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w/2+8,-h/2+8);ctx.lineTo(w/2-8,h/2-8);ctx.stroke();});
  ctx.restore();});}
// a line traced through points, drawn up to p, with a bright head while it's drawing (o.lw, o.a)
function d8_trace(ctx,pts,p,col,o){o=o||{};if(p<=0)return;const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=L[L.length-1]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length;i++){if(L[i]<=d){ctx.lineTo(pts[i][0],pts[i][1]);hx=pts[i][0];hy=pts[i][1];}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1);hx=lerp(pts[i-1][0],pts[i][0],f);hy=lerp(pts[i-1][1],pts[i][1],f);ctx.lineTo(hx,hy);break;}}ctx.stroke();ctx.restore();
  if(p<1&&!o.nohead){glow(ctx,hx,hy,22,col,0.8);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(hx,hy,4.5,0,TAU);ctx.fill();}}
// an owner, named on a gold tag with ArchiMate's actor glyph: the person who says what a number means
function d8_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const s="owner · "+name,ts=28,w=tw(ctx,s,ts,700)+70,h=48,X=o.align==="center"?x-w/2:x;glass(ctx,X,y-h/2,w,h,h/2,TRUST,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(20,16,6,0.92)"});
  archGlyph(ctx,"actor",X+26,y-2,13,TRUST);T(ctx,s,X+48,y+ts*0.36,{w:700,size:ts,color:rgba(TRUST,1)});});}
// a small question, as a chip: what a data product answers
function d8_q(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+64,h=46;glass(ctx,x-w/2,y-h/2,w,h,h/2,INF,{glow:8,ea:0.8,fill:"rgba(16,10,8,0.92)"});d8_glyph(ctx,"question",x-w/2+24,y-2,10,INF);
  T(ctx,s,x-w/2+44,y+10,{w:700,size:28,color:rgba(mix(INF,INK,0.35),1)});});}

/* ---------- counting: households, reports, a definition, working days ---------- */
// households, as a map draws them: a grid of small houses; o.behind[i] (0..1) marks one falling behind (amber); o.help: the ones the
// hardship register counts, ringed when o.ring > 0
function d8_homes(ctx,x,y,cols,rows,cell,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c,hx=x+c*cell+cell/2,hy=y+r*cell+cell/2,s=cell*0.32,b=o.behind?o.behind[i]||0:0,col=mix([150,170,200],[255,190,90],b);
    if(b>0.01)glow(ctx,hx,hy,cell*0.6,[255,180,80],0.35*b);ctx.fillStyle=rgba(col,0.35+0.4*b);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx-s,hy+s);ctx.lineTo(hx-s,hy-s*0.2);ctx.lineTo(hx,hy-s);ctx.lineTo(hx+s,hy-s*0.2);ctx.lineTo(hx+s,hy+s);ctx.closePath();ctx.fill();ctx.stroke();}
  // o.help: the homes the register counts, each ringed on its own
  if(o.ring>0.01&&o.help)withA(ctx,o.ring,()=>{ctx.save();ctx.strokeStyle=rgba(APL,0.95);ctx.lineWidth=3;ctx.shadowColor=rgba(APL,0.7);ctx.shadowBlur=12;
    o.help.forEach(i=>{const hx=x+(i%cols)*cell+cell/2,hy=y+Math.floor(i/cols)*cell+cell/2;rr(ctx,hx-cell*0.45,hy-cell*0.45,cell*0.9,cell*0.9,cell*0.22);ctx.stroke();});ctx.restore();});});}
// a report, as a dashboard tile: its name, a big number and what it counts; o.tick: a gold tick on it
function d8_report(ctx,x,y,w,h,name,num,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:14+12*(o.hi||0),ea:0.8,fill:"rgba(8,12,24,0.95)"});
  T(ctx,name,x+w/2,y+48,{f:"mono",w:500,size:28,align:"center",color:rgba(col,1)});T(ctx,num,x+w/2,y+h*0.62,{w:800,size:88,align:"center",color:rgba(INK,0.97)});T(ctx,o.unit||"working days",x+w/2,y+h-26,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
  if(o.tick>0.01)kt_gtick(ctx,x+w-2,y+2,18,o.tick);});}
// A measure's definition, on paper: a kicker, the measure's name, then its fields, written in as o.p goes to 1 (rows: [field, value,
// height]); o.hi outlines it in gold. Returns its height
function d8_def(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;const h=128+rows.reduce((s,r)=>s+r[2],0);if(a<=0.01)return h;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.006:o.rot,plain:true});
  if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
  T(ctx,"measure · definition",x+28,y+44,{f:"mono",w:500,size:28,color:"rgba(176,92,50,0.95)"});d8_glyph(ctx,"measure",x+w-40,y+34,14,[176,92,50],0.4);T(ctx,title,x+28,y+92,{w:800,size:34,color:"rgba(40,38,40,0.97)"});
  let yy=y+128;rows.forEach(([k,v,hh],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,k,x+28,yy+30,{w:800,size:28,color:"rgba(120,90,56,0.95)"});wrapT(ctx,v,x+150,yy+30,w-178,{size:28,w:700,color:"rgba(40,38,40,0.92)",lh:34});});yy+=hh;});});return h;}
// a clock face: where a count starts or stops
function d8_clock(ctx,x,y,r,col,a,t){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(8,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.5);ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-r*0.65);ctx.moveTo(x,y);ctx.lineTo(x+r*0.45,y+r*0.15);ctx.stroke();ctx.restore();});}
// a bracket over a span of the timeline (above the line when up > 0, its ends turned towards it), with its label on the bracket, in the middle
function d8_span(ctx,xa,xb,y,up,col,p,label,a){if(a<=0.01||p<=0)return;withA(ctx,a,()=>{const xe=lerp(xa,xb,ease(clamp(p,0,1))),d=up>0?-1:1;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(xa,y-d*16);ctx.lineTo(xa,y);ctx.lineTo(xe,y);if(p>=0.98)ctx.lineTo(xb,y-d*16);ctx.stroke();ctx.restore();if(label)withA(ctx,clamp((p-0.9)/0.1,0,1),()=>tag(ctx,(xa+xb)/2,y,label,col,{align:"center",size:30}));});}

/* ---------- building: reports, data products, the wall ---------- */
// a small dashboard, as one person's report: a few bars and a line, and a dot in its keeper's colour
function d8_dash(ctx,x,y,w,h,seed,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||APL;glass(ctx,x,y,w,h,12,col,{glow:8,ea:0.6,fill:"rgba(8,12,24,0.94)"});ctx.fillStyle=rgba(col,0.55);
  for(let i=0;i<5;i++){const bh=(0.25+0.65*hash(seed*7+i,880))*(h*0.42);ctx.fillRect(x+16+i*(w*0.11),y+h-16-bh,w*0.07,bh);}ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<=8;i++){const xx=x+w*0.62+i*(w*0.3/8),yy=y+h*0.3+Math.sin(i*1.3+seed)*h*0.12;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  if(o.keeper){ctx.fillStyle=rgba(o.keeper,1);ctx.beginPath();ctx.arc(x+w-16,y+16,8,0,TAU);ctx.fill();}});}
// the network's side tinted blue and retail's rose, with their names (as in Who does it)
function d8_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D8_NET,0.0));lg.addColorStop(1,rgba(D8_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D8_RET,0.08));rg.addColorStop(1,rgba(D8_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,120,{w:800,size:40,align:"center",color:rgba(D8_NET,1)});T(ctx,"retail",1440,120,{w:800,size:40,align:"center",color:rgba(D8_RET,1)});});});}
// the wall between them, drawn down from the top as p goes to 1; o.hi lights it
function d8_wall(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,y0=160,y1=y0+(880-y0)*ease(p);withA(ctx,a,()=>{const col=[226,232,246];ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*(o.hi||0);
  ctx.fillStyle=rgba(col,0.12+0.1*(o.hi||0));ctx.fillRect(948,y0,24,y1-y0);ctx.shadowBlur=0;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,y1);});ctx.stroke();ctx.restore();});}
