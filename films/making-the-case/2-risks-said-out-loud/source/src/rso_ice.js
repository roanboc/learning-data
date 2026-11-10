/* ===== Risks, said out loud: Antarctica, 1911 and 1912 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language (prefix rso_). Nobody is drawn
   close, and nobody is a likeness of Amundsen or his team. What's drawn is what his own account describes (The South Pole, 1912): the
   flat ice of the Barrier with nothing to steer by, a depot built of snow with a flag on it, the line of twenty black flags on bamboo
   poles across the route at 80° S, each with its number, the route on a map, and the hut, Framheim, with five pairs of skis upright in
   the snow by it. No dogs: the film leaves them, and what became of them, out.
     rsoIce       the Barrier's flat ice under a pale sky, the sun low on the right; drawn live on it: rso_depot, rso_flagRow, rso_fog
     rso_depot    a depot: a cairn of snow blocks, its stores in wooden cases at its foot, a bamboo pole and a small black flag on top
     rso_flagRow  the line of black flags across the route, seen from near one end, going off to the depot, the near ones numbered
     rso_fog      fog over the ice: o.a its thickness; the far ice goes first
     rsoMap       a map of the whole route on paper: the Barrier's edge at the Bay of Whales, the latitudes, the mountains, the Pole
     rso_route    the route, drawn on rsoMap, with its three depots at 80°, 81° and 82° S
     rsoNear      the ice round the depot at 80° S, from above, on paper: a kilometre to 70 px
     rso_near     on rsoNear: marks along the route, or the twenty flags across it; a party's track in fog, and the little it can see
     rsoHut       Framheim on the Barrier, on a summer morning with the sun low, smoke from its stovepipe drawn live
     rso_skis     five pairs of skis and their poles, upright in the snow by the hut, coming in one pair at a time
   Colour keeps the module's meaning: the plan (the route and its depots) in blue, the danger of a missed depot in amber, a depot found
   in green; the flags are black, as they were. */

const RSO_K={sky0:[170,190,212],sky1:[236,232,226],snow:[244,244,240],snowSh:[192,204,220],snowDk:[160,174,194],far:[214,220,228],
  pole:[188,160,112],cloth:[34,32,36],paper:[245,240,229],paperDk:[226,218,202],ink:[64,60,62],lat:[150,160,176],sea:[196,212,226],
  timber:[96,72,56],timberLt:[138,104,78],glow:[255,214,150]};
const RSO_HZ=520;

/* ---------------------------------------------------------------- the ice */
function rso_sky(c,hz){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(RSO_K.sky0,1));g.addColorStop(0.75,rgba(mix(RSO_K.sky0,RSO_K.sky1,0.8),1));g.addColorStop(1,rgba(RSO_K.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the low sun's haze on the right, just above the horizon
  g=c.createRadialGradient(1700,hz-40,10,1700,hz-40,820);g.addColorStop(0,"rgba(255,236,206,0.75)");g.addColorStop(0.4,"rgba(255,232,200,0.25)");g.addColorStop(1,"rgba(255,232,200,0)");
  c.fillStyle=g;c.fillRect(0,0,W,hz+60);}
// the flat ice to the horizon: snow, a little bluer and greyer far off, with low wind ridges (sastrugi), lit from the right
function rso_ground(c,hz,seed){const R=ag_rnd(seed||1911);let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(RSO_K.far,1));g.addColorStop(0.25,rgba(mix(RSO_K.far,RSO_K.snow,0.6),1));g.addColorStop(1,rgba(RSO_K.snow,1));
  c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(RSO_K.snowSh,0.3));g.addColorStop(0.6,rgba(RSO_K.snowSh,0.05));g.addColorStop(1,"rgba(255,240,220,0.12)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // the ridges, more of them and smaller far off; each a pale crest with its cool shadow under it
  c.lineCap="round";for(let i=0;i<340;i++){const u=Math.pow(R(),1.6),y=hz+6+(H-hz)*u*u,x=R()*W*1.2-W*0.1,l=(20+R()*90)*(0.15+u*1.4),th=0.6+u*4.5;
    c.strokeStyle=rgba(RSO_K.snowSh,0.35+0.25*u);c.lineWidth=th;c.beginPath();c.moveTo(x,y+th*0.6);c.quadraticCurveTo(x+l*0.5,y+th*0.6-l*0.03,x+l,y+th*0.6+l*0.01);c.stroke();
    c.strokeStyle="rgba(255,255,252,"+(0.5+0.3*u)+")";c.lineWidth=th*0.7;c.beginPath();c.moveTo(x+l*0.1,y);c.quadraticCurveTo(x+l*0.55,y-l*0.03,x+l*0.95,y);c.stroke();}
  c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(0,hz,W,2);}
AG_PLACES.rsoIce=c=>{rso_sky(c,RSO_HZ);rso_ground(c,RSO_HZ,1911);};

// a depot on the ice: a cairn of snow blocks, narrower at the top, the stores in wooden cases at its foot, half drifted over, and a tall
// bamboo pole with a small black flag; (x, y) the middle of its foot, s its size (1: a cairn 170 px tall)
function rso_depot(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const t=o.t||0,h=170*s,w=150*s,tw=w*0.56;ctx.save();ctx.globalAlpha*=a;
  // its long shadow, cast to the left by the low sun on the right
  ctx.fillStyle=rgba(RSO_K.snowDk,0.4);ctx.beginPath();ctx.moveTo(x+w*0.45,y);ctx.lineTo(x-tw*0.4-h*2.3,y-h*0.04);ctx.lineTo(x-tw*0.3-h*2.1,y+h*0.07);ctx.lineTo(x-w*0.3,y+h*0.07);ctx.closePath();ctx.fill();
  // the cairn: rows of snow blocks, each row a little narrower, lit from the right
  const rows=5,bh=h/rows;for(let r=0;r<rows;r++){const k0=r/rows,k1=(r+1)/rows,y0=y-k0*h,y1=y-k1*h,w0=lerp(w,tw,k0),w1=lerp(w,tw,k1);
    let g=ctx.createLinearGradient(x-w0/2,0,x+w0/2,0);g.addColorStop(0,rgba(mix(RSO_K.snowSh,RSO_K.snowDk,0.25),1));g.addColorStop(0.5,rgba(mix(RSO_K.snowSh,RSO_K.snow,0.65),1));g.addColorStop(1,"rgba(255,252,246,1)");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-w0/2,y0);ctx.lineTo(x-w1/2,y1+0.5);ctx.lineTo(x+w1/2,y1+0.5);ctx.lineTo(x+w0/2,y0);ctx.closePath();ctx.fill();
    // the joints between the blocks, offset row by row
    ctx.strokeStyle=rgba(RSO_K.snowDk,0.5);ctx.lineWidth=Math.max(1,1.6*s);ctx.beginPath();ctx.moveTo(x-w1/2,y1+0.5);ctx.lineTo(x+w1/2,y1+0.5);
    const n=3,off=(r%2)*0.5;for(let j=1;j<=n;j++){const f=(j-off)/n;if(f<=0.04||f>=0.96)continue;const xb=lerp(x-w0/2,x+w0/2,f),xt=lerp(x-w1/2,x+w1/2,f);ctx.moveTo(xb,y0);ctx.lineTo(xt,y1+0.5);}ctx.stroke();}
  // its top, a little snow heaped on it
  ctx.fillStyle="rgba(255,253,248,1)";ctx.beginPath();ctx.ellipse(x+tw*0.04,y-h,tw*0.52,7*s,0,Math.PI,TAU);ctx.fill();
  // the stores at its foot, on the sunlit side: wooden cases, half drifted over
  const box=(bx,by,bw,bh2)=>{let g=ctx.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,rgba(mix(RSO_K.timber,[30,24,24],0.3),1));g.addColorStop(1,rgba(RSO_K.timberLt,1));ctx.fillStyle=g;ctx.fillRect(bx,by-bh2,bw,bh2);
    ctx.strokeStyle=rgba(mix(RSO_K.timber,[0,0,0],0.45),0.75);ctx.lineWidth=Math.max(1,1.8*s);ctx.strokeRect(bx,by-bh2,bw,bh2);ctx.beginPath();ctx.moveTo(bx,by-bh2*0.5);ctx.lineTo(bx+bw,by-bh2*0.5);ctx.stroke();
    ctx.fillStyle="rgba(255,253,248,0.96)";ctx.beginPath();ctx.ellipse(bx+bw/2,by-bh2,bw*0.56,4*s+1,0,Math.PI,TAU);ctx.fill();};
  box(x+w*0.34,y,62*s,40*s);box(x+w*0.34+66*s,y,54*s,30*s);box(x+w*0.34+14*s,y-40*s,48*s,30*s);
  ctx.fillStyle=rgba(RSO_K.snow,1);ctx.beginPath();ctx.moveTo(x+w*0.2,y+2);ctx.quadraticCurveTo(x+w*0.4,y-14*s,x+w*0.34+130*s,y-6*s);ctx.lineTo(x+w*0.34+150*s,y+2);ctx.closePath();ctx.fill();
  // the pole and its flag, stirring a little in the wind
  const top=y-h-150*s;ctx.strokeStyle=rgba(RSO_K.pole,1);ctx.lineWidth=Math.max(1.5,4.5*s);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y-h+2);ctx.lineTo(x,top);ctx.stroke();
  rso_cloth(ctx,x,top,50*s,32*s,t);ctx.restore();}
// a black cloth on a pole at (x, y), w by h, its free edge rippling
function rso_cloth(ctx,x,y,w,h,t){const wv=k=>Math.sin(t*2.6+k*3.1)*h*0.08*k;ctx.fillStyle=rgba(RSO_K.cloth,1);ctx.beginPath();ctx.moveTo(x,y);
  ctx.bezierCurveTo(x+w*0.35,y+wv(0.35),x+w*0.7,y+wv(0.7),x+w,y+wv(1));ctx.lineTo(x+w,y+h+wv(1));ctx.bezierCurveTo(x+w*0.7,y+h+wv(0.7),x+w*0.35,y+h+wv(0.35),x,y+h);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.08)";ctx.fillRect(x,y,w*0.3,h);}
// one flag on the line, its foot at (x, y), size s (1: a pole 300 px tall), with its number on a board by the foot when it's big enough
// to read (o.num; a smaller one shows a plain board, a mark too small to read, on purpose)
function rso_flag(ctx,x,y,s,o){o=o||{};const t=o.t||0,ph=300*s;
  ctx.strokeStyle=rgba(RSO_K.snowDk,0.4);ctx.lineWidth=Math.max(1,3*s);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-ph*1.5,y-ph*0.04);ctx.stroke();
  ctx.strokeStyle=rgba(RSO_K.pole,1);ctx.lineWidth=Math.max(1.2,5*s);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-ph);ctx.stroke();
  rso_cloth(ctx,x,y-ph,70*s,46*s,t+x*0.01);
  const bw=Math.max(8,64*s),bh=Math.max(6,46*s),fs=Math.round(34*s*(o.big||1));ctx.fillStyle="rgba(250,248,242,1)";ctx.strokeStyle=rgba(RSO_K.ink,0.6);ctx.lineWidth=Math.max(1,2*s);
  rr(ctx,x-bw/2,y-ph*0.42-bh,bw,bh,3*s);ctx.fill();ctx.stroke();
  if(o.num!=null&&fs>=28)lp_T(ctx,String(o.num),x,y-ph*0.42-bh*0.5+fs*0.36,{w:800,size:fs,align:"center",col:o.col||LP.ink});}
// the line of flags across the route, seen from near its east end: flags from first (the nearest) going off to the left and up, to
// the depot; o.u (0 to 1) brings them in from the depot outwards; o.hi, a flag to pick out (its number in amber's place: green, found)
function rso_flagRow(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  const n=o.n||10,dep=o.depot||[300,RSO_HZ+40],near=o.near||[1500,800],first=o.first||20;
  rso_depot(ctx,dep[0],dep[1],0.32,{t});
  for(let i=n;i>=1;i--){const u=i/n,k=Math.pow(u,1.8),x=lerp(dep[0],near[0],k),y=lerp(dep[1],near[1],k),s=lerp(0.12,1,k);
    const show=o.u==null?1:clamp((o.u*(n+2)-(i-1)),0,1);if(show<=0)continue;ctx.save();ctx.globalAlpha*=ag_sine(show);
    const num=first-(n-i);rso_flag(ctx,x,y,s,{t,num,col:o.hi===num?LP.green:LP.ink});ctx.restore();}
  ctx.restore();}
// fog over the ice: a white that thickens towards the horizon, with slow soft bands drifting through it
function rso_fog(ctx,a,t){if(a<=0.004)return;ctx.save();let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(236,238,242,"+(0.7*a)+")");g.addColorStop(RSO_HZ/H,"rgba(240,242,244,"+(0.95*a)+")");
  g.addColorStop(0.75,"rgba(238,240,243,"+(0.7*a)+")");g.addColorStop(1,"rgba(236,238,241,"+(0.5*a)+")");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<5;i++){const x=((t*22+i*520)%(W+900))-450,y=RSO_HZ-60+i*90,rw=520+i*60,rh=70+i*14;g=ctx.createRadialGradient(x,y,4,x,y,rw);
    g.addColorStop(0,"rgba(246,247,249,"+(0.45*a)+")");g.addColorStop(1,"rgba(246,247,249,0)");ctx.fillStyle=g;ctx.save();ctx.translate(x,y);ctx.scale(1,rh/rw);ctx.translate(-x,-y);
    ctx.beginPath();ctx.arc(x,y,rw,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the route, on a map */
function rso_paper(c){let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(mix(RSO_K.paper,[255,255,255],0.3),1));g.addColorStop(1,rgba(RSO_K.paper,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.45,H*0.3,W*0.55,H*0.45,W*0.75);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(RSO_K.paperDk,0.55));c.fillStyle=g;c.fillRect(0,0,W,H);}
const RSO_MAP={x:960,y:lat=>130+(lat-78.5)*60,x0:380,x1:1540};
AG_PLACES.rsoMap=c=>{rso_paper(c);const M=RSO_MAP,R=ag_rnd(1912);
  // the sea beyond the Barrier's edge, and the edge itself, a little ragged
  c.fillStyle=rgba(RSO_K.sea,0.55);c.beginPath();c.moveTo(M.x0-60,0);c.lineTo(M.x1+60,0);c.lineTo(M.x1+60,M.y(78.5)-14);
  for(let x=M.x1+60;x>=M.x0-60;x-=24)c.lineTo(x,M.y(78.5)-8+Math.sin(x*0.03)*5+(x>900&&x<1020?18*Math.sin((x-900)/120*Math.PI):0));c.closePath();c.fill();
  // the latitudes, faint
  c.strokeStyle=rgba(RSO_K.lat,0.5);c.lineWidth=1.5;for(let l=79;l<=89;l++){c.beginPath();c.moveTo(M.x0,M.y(l));c.lineTo(M.x1,M.y(l));c.stroke();}
  // the mountains the route climbs through, near 85° S: a band of ridges, as an old map draws them, each a jagged crest with its
  // shaded side below it, fading out; the far ones (further south) a little paler
  for(let r=0;r<5;r++){const y0=M.y(84.55)+r*20,xa=M.x0+30+R()*90,xb=M.x1-30-R()*90,pts=[];let x=xa,up=true;
    while(x<xb){pts.push([x,y0-(up?8+R()*(r<2?22:16):1+R()*5)]);x+=16+R()*22;up=!up;}pts.push([xb,y0]);
    const g=c.createLinearGradient(0,y0-30,0,y0+16);g.addColorStop(0,rgba(mix(RSO_K.lat,RSO_K.paper,0.15+r*0.08),0.55));g.addColorStop(1,rgba(RSO_K.lat,0));
    c.fillStyle=g;c.beginPath();c.moveTo(xa,y0+16);for(const p of pts)c.lineTo(p[0],p[1]);c.lineTo(xb,y0+16);c.closePath();c.fill();
    c.strokeStyle=rgba(mix(RSO_K.lat,RSO_K.ink,0.25),0.5-r*0.06);c.lineWidth=2;c.lineJoin="round";c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    // a few short strokes down from the peaks, the shaded slopes
    c.strokeStyle=rgba(RSO_K.lat,0.32);c.lineWidth=1.5;for(let i=0;i<pts.length-1;i+=2){const p=pts[i];c.beginPath();c.moveTo(p[0]+3,p[1]+4);c.lineTo(p[0]+9,p[1]+14);c.stroke();}}};
// on rsoMap: o.u the route drawn (0 to 1), o.dep the three depots (0 to 1), o.lat the latitudes' names, o.a
function rso_route(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M=RSO_MAP,u=clamp(o.u==null?1:o.u,0,1);ctx.save();ctx.globalAlpha*=a;
  // Framheim at the Bay of Whales, and the Pole
  ctx.fillStyle=rgba(LP.ink,1);rr(ctx,M.x-12,M.y(78.5)+2,24,18,3);ctx.fill();ctx.beginPath();ctx.moveTo(M.x-16,M.y(78.5)+4);ctx.lineTo(M.x,M.y(78.5)-10);ctx.lineTo(M.x+16,M.y(78.5)+4);ctx.closePath();ctx.fill();
  const py=M.y(90);ctx.strokeStyle=rgba(LP.ink,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(M.x,py,10,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(M.x-18,py);ctx.lineTo(M.x+18,py);ctx.moveTo(M.x,py-18);ctx.lineTo(M.x,py+18);ctx.stroke();
  if(o.names!==false){lp_T(ctx,"Framheim",M.x+34,M.y(78.5)+22,{w:700,size:28,col:LP.ink});lp_T(ctx,"The South Pole",M.x+34,py+10,{w:700,size:28,col:LP.ink});}
  // the route, drawn out from the hut
  if(u>0){const y0=M.y(78.5)+22,y1=lerp(y0,py-12,u);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([16,10]);ctx.beginPath();ctx.moveTo(M.x,y0);ctx.lineTo(M.x,y1);ctx.stroke();ctx.setLineDash([]);}
  // the three depots, as squares on the route
  const dp=o.dep||0;[80,81,82].forEach((l,i)=>{const k=clamp(dp*3-i,0,1);if(k<=0)return;const y=M.y(l),s=lerp(4,13,ag_spr(k,0,0.6));ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(M.x-s,y-s,2*s,2*s);
    ctx.strokeStyle="rgba(255,255,255,0.9)";ctx.lineWidth=2;ctx.strokeRect(M.x-s,y-s,2*s,2*s);});
  if(o.lat)for(const l of [80,81,82])lp_T(ctx,l+"° S",M.x0+10,M.y(l)+10,{w:700,size:28,col:LP.mut,a:o.lat});
  ctx.restore();}

/* ---------------------------------------------------------------- the ice round the depot at 80° S, from above */
const RSO_NEAR={x:960,y:470,km:70,sp:63};
AG_PLACES.rsoNear=c=>{rso_paper(c);const R=ag_rnd(80);
  // the ice from above: faint wind ridges, all running one way
  c.strokeStyle=rgba(RSO_K.lat,0.18);c.lineWidth=2;c.lineCap="round";for(let i=0;i<140;i++){const x=R()*W,y=R()*H,l=30+R()*70;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l*0.5,y-4,x+l,y+2);c.stroke();}};
// flag k of the twenty, numbered 1 to 20 from west to east: where it stands
const rso_flagX=k=>RSO_NEAR.x+(k<=10?-(11-k):k-10)*RSO_NEAR.sp;
// a party's track in fog: where it is at u (0 to 1), from the north, drifting east of the route
function rso_trackAt(u,turn){const N=RSO_NEAR,yA=-40,yC=N.y;if(!turn){const y=lerp(yA,N.y+340,u),x=N.x+40+220*ag_sine(clamp((y-yA)/(N.y+40-yA),0,1));return[x,y];}
  // with the flags: down to the line, then along it, west, to the depot
  const xC=N.x+40+220*ag_sine(clamp((yC-yA)/(N.y+40-yA),0,1)),k=0.62;if(u<k){const v=u/k,y=lerp(yA,yC,v);return[N.x+40+220*ag_sine(clamp((y-yA)/(N.y+40-yA),0,1)),y];}
  const v=ag_sine((u-k)/(1-k));return[lerp(xC,N.x+26,v),yC-8*Math.sin(v*Math.PI)];}
// o.along (0 to 1): marks set along the route; o.across (0 to 1): the twenty flags drawn out from the depot; o.nums: their numbers;
// o.track (0 to 1): the party's way so far, o.turn: it finds the line and turns along it; o.fog: the fog over all but what it can see;
// o.hi: the flag it reads; o.found (0 to 1); o.miss (0 to 1)
function rso_near(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const N=RSO_NEAR,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  // the route, north to south through the depot
  ctx.strokeStyle=rgba(LP.blue,0.85);ctx.lineWidth=5;ctx.setLineDash([16,10]);ctx.beginPath();ctx.moveTo(N.x,-20);ctx.lineTo(N.x,H+20);ctx.stroke();ctx.setLineDash([]);
  // the depot: a blue square on the route
  ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(N.x-18,N.y-18,36,36);ctx.strokeStyle="rgba(255,255,255,0.95)";ctx.lineWidth=3;ctx.strokeRect(N.x-18,N.y-18,36,36);
  if(o.found>0){ctx.strokeStyle=rgba(LP.green,o.found);ctx.lineWidth=5;ctx.beginPath();ctx.arc(N.x,N.y,34+8*ag_spr(o.found,0,0.5),0,TAU);ctx.stroke();}
  // the old way: small marks along the route, two kilometres apart
  if(o.along>0)for(let k=-6;k<=6;k++){if(!k)continue;const v=clamp(o.along*7-Math.abs(k)+1,0,1);if(v<=0)continue;const y=N.y+k*N.km*2;ctx.fillStyle=rgba(RSO_K.cloth,v);
    ctx.fillRect(N.x-3,y-26,4,26);ctx.beginPath();ctx.moveTo(N.x+1,y-26);ctx.lineTo(N.x+22,y-20);ctx.lineTo(N.x+1,y-14);ctx.closePath();ctx.fill();}
  // the new way: twenty flags across the route, nine kilometres out on each side, drawn out from the depot
  if(o.across>0){const reach=o.across*10;ctx.strokeStyle=rgba(RSO_K.ink,0.35);ctx.lineWidth=2;ctx.setLineDash([4,8]);ctx.beginPath();ctx.moveTo(N.x-reach*N.sp,N.y);ctx.lineTo(N.x+reach*N.sp,N.y);ctx.stroke();ctx.setLineDash([]);
    for(let k=1;k<=20;k++){const d=k<=10?11-k:k-10,v=clamp(reach-d+1,0,1);if(v<=0)continue;const x=rso_flagX(k),hi=o.hi===k;ctx.save();ctx.globalAlpha*=ag_sine(v);
      ctx.fillStyle=rgba(RSO_K.cloth,1);ctx.fillRect(x-2,N.y-34,4,34);ctx.beginPath();ctx.moveTo(x+2,N.y-34);ctx.lineTo(x+24,N.y-27);ctx.lineTo(x+2,N.y-20);ctx.closePath();ctx.fill();
      if(o.nums>0)lp_T(ctx,String(k),x,N.y+44,{w:800,size:28,align:"center",col:hi?LP.green:LP.ink,a:o.nums});ctx.restore();}}
  // the party's track so far, dashed in amber while it's lost, and the little circle of ice it can see in the fog
  if(o.track>0){const tu=clamp(o.track,0,1),steps=60,col=o.turn&&o.found>0?LP.green:LP.amber;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([10,10]);ctx.beginPath();
    for(let i=0;i<=steps;i++){const p=rso_trackAt(tu*i/steps,o.turn);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();ctx.setLineDash([]);
    const p=rso_trackAt(tu,o.turn);if(o.fog>0){const r=58,g=ctx.createRadialGradient(p[0],p[1],r*0.75,p[0],p[1],r*2.2);g.addColorStop(0,"rgba(246,247,249,0)");g.addColorStop(1,"rgba(246,247,249,"+(0.7*o.fog)+")");
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.strokeStyle=rgba(RSO_K.ink,0.25*o.fog);ctx.lineWidth=2;ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(p[0],p[1],r,0,TAU);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(p[0],p[1],11,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.95)";ctx.lineWidth=3;ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- Framheim, the hut, on 25 January 1912 */
const RSO_HUT={x:560,w:560,ground:720,wall:150,roof:120};
AG_PLACES.rsoHut=c=>{rso_sky(c,RSO_HUT.ground-120);rso_ground(c,RSO_HUT.ground-120,1912);const U=RSO_HUT,x0=U.x,x1=U.x+U.w,gy=U.ground,top=gy-U.wall;
  // the hut: a low timber house, half sunk in the snow, its roof white; lit from the right
  let g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(RSO_K.timber,[30,24,24],0.35),1));g.addColorStop(1,rgba(RSO_K.timberLt,1));c.fillStyle=g;c.fillRect(x0,top,U.w,U.wall);
  c.strokeStyle=rgba(mix(RSO_K.timber,[0,0,0],0.4),0.6);c.lineWidth=2;for(let y=top+18;y<gy;y+=18){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();}
  // a small window, lit within
  c.fillStyle=rgba(mix(RSO_K.glow,[255,255,255],0.2),1);c.fillRect(x0+380,top+40,62,46);c.strokeStyle=rgba(mix(RSO_K.timber,[0,0,0],0.5),1);c.lineWidth=5;c.strokeRect(x0+380,top+40,62,46);
  c.beginPath();c.moveTo(x0+411,top+40);c.lineTo(x0+411,top+86);c.stroke();
  // the door, dark timber
  c.fillStyle=rgba(mix(RSO_K.timber,[0,0,0],0.45),1);c.fillRect(x0+150,top+26,84,U.wall-26);
  // the roof, deep in snow, and the stovepipe
  c.fillStyle=rgba(mix(RSO_K.timber,[0,0,0],0.5),1);c.fillRect(x0+430,top-U.roof-40,22,70);
  g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(RSO_K.snowSh,1));g.addColorStop(1,"rgba(255,253,248,1)");c.fillStyle=g;
  c.beginPath();c.moveTo(x0-40,top+6);c.lineTo(x0+U.w/2,top-U.roof);c.lineTo(x1+40,top+6);c.quadraticCurveTo(x1+10,top+16,x1-20,top+10);c.lineTo(x0+20,top+10);c.quadraticCurveTo(x0-10,top+16,x0-40,top+6);c.closePath();c.fill();
  // drifts banked against the walls
  c.fillStyle=rgba(mix(RSO_K.snow,RSO_K.snowSh,0.3),1);c.beginPath();c.moveTo(x0-160,gy+8);c.quadraticCurveTo(x0-30,gy-10,x0+10,gy-70);c.lineTo(x0+10,gy+8);c.closePath();c.fill();
  c.fillStyle=rgba(RSO_K.snow,1);c.beginPath();c.moveTo(x1-10,gy-60);c.quadraticCurveTo(x1+40,gy-10,x1+220,gy+8);c.lineTo(x1-10,gy+8);c.closePath();c.fill();
  c.fillStyle=rgba(RSO_K.snowSh,0.55);c.beginPath();c.moveTo(x0,gy);c.lineTo(x0-260,gy+14);c.lineTo(x0-180,gy+30);c.lineTo(x0+40,gy+18);c.closePath();c.fill();};
// smoke from the stovepipe: a few soft puffs rising and drifting left
function rso_smoke(ctx,t,a){a=a==null?1:a;if(a<=0.004)return;const U=RSO_HUT,x=U.x+441,y=U.ground-U.wall-U.roof-40;ctx.save();
  for(let i=0;i<6;i++){const k=((t*0.18+i/6)%1),px=x-k*140-Math.sin(k*5+i)*10,py=y-k*220,r=14+k*46,g=ctx.createRadialGradient(px,py,1,px,py,r);
    g.addColorStop(0,"rgba(236,236,240,"+(0.5*(1-k)*a)+")");g.addColorStop(1,"rgba(236,236,240,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();}ctx.restore();}
// five pairs of skis upright in the snow by the hut, each with its poles, the ith coming in as u passes i/5
function rso_skis(ctx,x,y,u,a){a=a==null?1:a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<5;i++){const v=clamp(u*5-i,0,1);if(v<=0)continue;const px=x+i*64,lean=(i%2?-1:1)*0.03;ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.translate(px,y);ctx.rotate(lean);
    // the shadow of the pair on the snow, to the left
    ctx.fillStyle=rgba(RSO_K.snowDk,0.35);ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-250,-10);ctx.lineTo(-250,4);ctx.lineTo(6,10);ctx.closePath();ctx.fill();
    for(const dx of [-9,9]){let g=ctx.createLinearGradient(dx-6,0,dx+6,0);g.addColorStop(0,rgba(mix(RSO_K.pole,[60,40,30],0.35),1));g.addColorStop(1,rgba(mix(RSO_K.pole,[255,240,220],0.15),1));ctx.fillStyle=g;
      ctx.beginPath();ctx.moveTo(dx-6,0);ctx.lineTo(dx-6,-230);ctx.quadraticCurveTo(dx-6,-262,dx+4,-270);ctx.quadraticCurveTo(dx+7,-258,dx+6,-230);ctx.lineTo(dx+6,0);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(mix(RSO_K.timber,[0,0,0],0.4),1);ctx.fillRect(dx-7,-104,14,10);}
    // a pair of ski poles leaning by them, their baskets near the snow
    ctx.strokeStyle=rgba(mix(RSO_K.pole,[60,40,30],0.5),1);ctx.lineWidth=3.5;ctx.lineCap="round";for(const [x0,x1] of [[24,15],[30,25]]){ctx.beginPath();ctx.moveTo(x0,2);ctx.lineTo(x1,-196);ctx.stroke();
      ctx.beginPath();ctx.ellipse(lerp(x0,x1,0.1),-18,8,2.6,0,0,TAU);ctx.stroke();}
    // the snow they stand in
    ctx.fillStyle=rgba(RSO_K.snow,1);ctx.beginPath();ctx.ellipse(0,2,30,8,0,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}
