/* ===== Scripts became software: the bridge, the wind and the tunnel =====
   The opening story's pictures, in the module's look. The Tacoma Narrows at night is painted once ("sbNarrows": the sky, the far
   hills, the two shores and the water); the bridge is drawn live over it in light, so its deck can rise and fall, twist, and fall into
   the water. Then the wind, the wind tunnel at the University of Washington with a model of the deck on its springs, and the two decks
   side by side. Frederick Farquharson is drawn as a man of his time, not as a likeness. Every top-level name starts with sb_ or SB_.
   The drawing keeps the bridge's real shape (towers, two cables, a main span about two and a half times each side span), its height
   drawn about two and a half times taller than it is, so the deck reads at this size. */

const sb_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const sb_k=(t,a)=>clamp((t-a)/1.2,0,1);   // a spring's clock: from 0 at a to 1 1.2 s later

/* ---------------------------------------------------------------- the Narrows, painted once */
const SB_G={water:792,a0:150,a1:1770,t0:520,t1:1400,deck:606,crown:8,anchY:636,top:372,low:590,dw:60,elev:0.2};
const SB_LAMP=[255,214,150],SB_LINE=[214,226,246],SB_WIND=[200,222,250];
function sb_hill(c,pts,fill,rim){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const m=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];c.quadraticCurveTo(pts[i][0],pts[i][1],m[0],m[1]);}
  const L=pts[pts.length-1];c.lineTo(L[0],L[1]);c.lineTo(L[0],H);c.lineTo(pts[0][0],H);c.closePath();c.fillStyle=fill;c.fill();
  if(rim){c.save();c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const m=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];c.quadraticCurveTo(pts[i][0],pts[i][1],m[0],m[1]);}
    c.strokeStyle=rim;c.lineWidth=2;c.stroke();c.restore();}}
// the trees along a shore: soft dark crowns that taper, each a few overlapping rounds
function sb_trees(c,x0,x1,yAt,rnd,col){for(let x=x0;x<x1;x+=9+rnd()*8){const y=yAt(x),h=14+rnd()*22,w=7+rnd()*6;c.fillStyle=col;c.beginPath();c.moveTo(x-w,y+2);
  c.quadraticCurveTo(x-w*0.7,y-h*0.6,x,y-h);c.quadraticCurveTo(x+w*0.7,y-h*0.6,x+w,y+2);c.closePath();c.fill();}}
AG_PLACES.sbNarrows=c=>{
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#060b1b");g.addColorStop(0.45,"#0a1328");g.addColorStop(0.7,"#0f1a36");g.addColorStop(0.733,"#0b1430");
  g.addColorStop(0.74,"#070e22");g.addColorStop(1,"#02050c");c.fillStyle=g;c.fillRect(0,0,W,H);
  // a low glow over the far shore, where a town's lights would be
  let q=c.createRadialGradient(1180,760,0,1180,760,900);q.addColorStop(0,"rgba(120,160,230,0.10)");q.addColorStop(1,"rgba(120,160,230,0)");c.fillStyle=q;c.fillRect(0,0,W,H);
  const rnd=ag_rnd(1940);
  for(let i=0;i<170;i++){const x=rnd()*W,y=rnd()*600,r=rnd()*1.2+0.3,a=(0.12+rnd()*0.4)*(1-y/760);c.fillStyle="rgba(220,232,255,"+a.toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // the far hills across the water, in two layers
  sb_hill(c,[[0,700],[240,684],[520,700],[760,690],[1010,706],[1260,688],[1500,700],[1720,690],[1920,702]],"#0c1631","rgba(120,170,240,0.10)");
  sb_hill(c,[[0,736],[300,724],[640,740],[980,730],[1300,742],[1640,728],[1920,738]],"#0a1229","rgba(120,170,240,0.08)");
  // the water: darker below, with faint lines of light
  const wg=c.createLinearGradient(0,SB_G.water-60,0,H);wg.addColorStop(0,"#0a1430");wg.addColorStop(0.2,"#08112a");wg.addColorStop(1,"#02060f");c.fillStyle=wg;c.fillRect(0,SB_G.water-8,W,H);
  for(let i=0;i<120;i++){const y=SB_G.water+6+Math.pow(rnd(),1.6)*280,x=rnd()*W,w=20+rnd()*90,a=0.03+rnd()*0.06;c.fillStyle="rgba(150,190,250,"+a.toFixed(3)+")";c.fillRect(x,y,w,1.2);}
  // the two banks, steep and wooded, where the cables are anchored: each ends at the water
  const bankL=x=>x<150?lerp(588,632,ag_sine(x/150)):lerp(632,SB_G.water,Math.pow(clamp((x-150)/210,0,1),1.35)),bankR=x=>bankL(W-x);
  for(const [f,x0,x1] of [[bankL,0,362],[bankR,1558,1920]]){const pts=[];for(let x=x0;x<=x1;x+=6)pts.push([x,f(x)]);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));
    c.lineTo(x1,SB_G.water+2);c.lineTo(x0,SB_G.water+2);c.closePath();const sg=c.createLinearGradient(0,560,0,SB_G.water);sg.addColorStop(0,"#0c1834");sg.addColorStop(1,"#050b1a");c.fillStyle=sg;c.fill();}
  sb_trees(c,0,150,x=>bankL(x)+3,rnd,"#08122a");sb_trees(c,150,330,x=>bankL(x)+3,rnd,"#071026");sb_trees(c,1770,1920,x=>bankR(x)+3,rnd,"#08122a");sb_trees(c,1590,1770,x=>bankR(x)+3,rnd,"#071026");
  // the banks in the water, faintly
  for(const [x0,x1] of [[0,362],[1558,1920]]){const rg=c.createLinearGradient(0,SB_G.water,0,SB_G.water+120);rg.addColorStop(0,"rgba(5,11,26,0.7)");rg.addColorStop(1,"rgba(5,11,26,0)");c.fillStyle=rg;c.fillRect(x0,SB_G.water+2,x1-x0,120);}
  // a mist over the water
  q=c.createLinearGradient(0,SB_G.water-40,0,SB_G.water+40);q.addColorStop(0,"rgba(140,170,220,0)");q.addColorStop(0.5,"rgba(140,170,220,0.05)");q.addColorStop(1,"rgba(140,170,220,0)");c.fillStyle=q;c.fillRect(0,SB_G.water-40,W,80);};

/* ---------------------------------------------------------------- the bridge, live
   sb_bridge(ctx, o) draws the bridge across the Narrows: o.era 1940 (a shallow deck of two plate girders) or 1950 (a deep, open truss);
   o.t; o.gallop and o.twist (0 to 1: how far the deck rises and falls, and how far it twists, 28 degrees each way at 1); o.tear (the
   time the middle tears away, or null) and o.fallT (seconds since it did); o.lamps (0 to 1); o.cars (0 to 1, traffic crossing); o.cableLit (0 to 1, the cables glow as they're named);
   o.build (0 to 1: the bridge drawing itself, towers, then cables, then the deck); o.a. Returns the gap's ends once the middle has gone. */
const SB_FALL=[[0.17,0.4,0,0.10],[0.4,0.6,0.22,-0.06],[0.6,0.83,0.42,0.13]];   // the pieces of the main span that fall: from u, to u, delay, turn
function sb_mainU(x){return(x-SB_G.t0)/(SB_G.t1-SB_G.t0);}
// the deck's centre line at x, at rest
function sb_deckY(x){const G=SB_G;if(x<G.t0)return lerp(G.anchY,G.deck,clamp((x-G.a0)/(G.t0-G.a0),0,1));if(x>G.t1)return lerp(G.deck,G.anchY,clamp((x-G.t1)/(G.a1-G.t1),0,1));
  return G.deck-G.crown*Math.sin(Math.PI*sb_mainU(x));}
// the near cable at rest
function sb_cableY(x,o){const G=SB_G,top=G.top-(o&&o.era===1950?18:0),low=G.low+(o&&o.lift?-o.lift:0);
  if(x<G.t0){const v=clamp((G.t0-x)/(G.t0-G.a0),0,1);return lerp(top,G.anchY-6,v)+26*Math.sin(Math.PI*v);}
  if(x>G.t1){const v=clamp((x-G.t1)/(G.a1-G.t1),0,1);return lerp(top,G.anchY-6,v)+26*Math.sin(Math.PI*v);}
  const u=sb_mainU(x);return top+(low-top)*(1-Math.pow(2*u-1,2));}
// how the deck moves at x and t: dy (up is negative) and th (the twist, radians)
function sb_motion(x,t,o){const G=SB_G;let dy=0,th=0;if(x>=G.t0&&x<=G.t1){const u=sb_mainU(x);
    dy=(o.gallop||0)*14*Math.sin(3*Math.PI*u)*Math.sin(TAU*0.42*t);th=(o.twist||0)*0.49*Math.sin(TAU*u)*Math.sin(TAU*0.2*t);}
  else{const v=x<G.t0?(x-G.a0)/(G.t0-G.a0):(G.a1-x)/(G.a1-G.t1);dy=(o.gallop||0)*5*Math.sin(Math.PI*clamp(v,0,1))*Math.sin(TAU*0.42*t+Math.PI);}
  return{dy,th};}
function sb_bridge(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const G=SB_G,t=o.t||0,era=o.era||1940,b=o.build==null?1:o.build;
  const hw0=G.dw/2*Math.sin(G.elev),gd=era===1950?26:8,top=G.top-(era===1950?18:0);ctx.save();ctx.globalAlpha*=a;
  // the collapse: how long since the middle tore away, and how far the cables have sprung up
  const ft=o.tear==null?-1:o.fallT,gone=ft>=0;const lift=gone?42*(1-Math.exp(-ft*1.6))*(1+0.35*Math.exp(-ft*0.9)*Math.sin(ft*5.2)):0;
  // pieces: the deck from u0 to u1 as polylines of [x, yc, th], moved and turned as they fall
  const towersA=ag_sine(b/0.35),cableU=clamp((b-0.3)/0.4,0,1),deckU=clamp((b-0.55)/0.45,0,1);
  // towers and their piers
  for(const tx of [G.t0,G.t1]){if(towersA<=0)break;const base=G.water+10,h=(base-top)*towersA,y0=base-h;ctx.save();
    const tg=ctx.createLinearGradient(tx-16,0,tx+16,0);tg.addColorStop(0,"rgba(40,56,90,0.95)");tg.addColorStop(0.55,"rgba(70,92,132,0.95)");tg.addColorStop(1,"rgba(26,36,62,0.95)");
    ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(tx-15,base);ctx.lineTo(tx-10,y0);ctx.lineTo(tx+10,y0);ctx.lineTo(tx+15,base);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(SB_LINE,0.55);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(tx+10,y0);ctx.lineTo(tx+15,base);ctx.stroke();
    if(era===1950){ctx.strokeStyle=rgba(SB_LINE,0.25);ctx.lineWidth=1.2;for(let yy=y0+30;yy<base-60;yy+=70){ctx.beginPath();ctx.moveTo(tx-12,yy);ctx.lineTo(tx+12,yy+34);ctx.moveTo(tx+12,yy);ctx.lineTo(tx-12,yy+34);ctx.stroke();}}
    // the pier at the water
    ctx.fillStyle="rgba(30,42,70,0.95)";rr(ctx,tx-30,G.water-14,60,30,6);ctx.fill();ctx.restore();
    if(towersA>=1)glow(ctx,tx,top,26,SB_LAMP,0.5);}   // the light on each tower's top
  const N=150,xs=[];for(let i=0;i<=N;i++)xs.push(lerp(G.a0,G.a1,i/N));
  // where each point of the deck is: [x, y of the centre line, twist], or null where it has fallen away
  const pieceOf=x=>{const u=sb_mainU(x);if(!gone||u<=SB_FALL[0][0]||u>=SB_FALL[2][1])return -1;for(let k=0;k<3;k++)if(u<=SB_FALL[k][1])return k;return -1;};
  const at_=x=>{const m=sb_motion(x,t,o);let y=sb_deckY(x)+m.dy,th=m.th;
    // the stubs left at the towers droop once the middle has gone
    if(gone){const u=sb_mainU(x);if(u>0&&u<SB_FALL[0][0]){const d=u/SB_FALL[0][0];y+=30*d*d*ag_eo(ft/1.4);th*=Math.exp(-ft);}
      if(u<1&&u>SB_FALL[2][1]){const d=(1-u)/(1-SB_FALL[2][1]);y+=30*d*d*ag_eo(ft/1.4);th*=Math.exp(-ft);}}
    return[x,y,th];};
  const near=p=>p[1]+G.dw/2*Math.sin(G.elev+p[2]),far=p=>p[1]-G.dw/2*Math.sin(G.elev+p[2]);
  // the cables: the far one, then the near one, each moved with its edge of the deck, sprung up once the middle has gone
  if(cableU>0)for(const side of [-1,1]){ctx.save();ctx.lineCap="round";const cl=o.cableLit||0;ctx.strokeStyle=rgba(SB_LINE,side<0?0.5+0.3*cl:0.95);ctx.lineWidth=(side<0?2:2.8)+1.6*cl;
    if(side>0){ctx.shadowColor=rgba(SB_LINE,0.6+0.4*cl);ctx.shadowBlur=8+18*cl;}ctx.beginPath();let first=true;
    for(const x of xs){const v=x<G.t0?(G.t0-x)/(G.t0-G.a0):x>G.t1?(x-G.t1)/(G.a1-G.t1):0;if(x<G.t0&&v>cableU)continue;if(x>G.t1&&v>cableU)continue;
      const u=sb_mainU(x);if(u>=0&&u<=1&&!(Math.abs(u-0.5)<=cableU/2+0.0001)&&cableU<1)continue;
      const p=at_(x),rest=[x,sb_deckY(x),0],dEdge=side>0?near(p)-near(rest):far(p)-far(rest);
      const inMain=u>=0&&u<=1;let y=sb_cableY(x,{era,lift:inMain?lift*(1-Math.pow(2*u-1,2)):0})+(side<0?-2*hw0:0)+(gone&&inMain?dEdge*Math.exp(-ft*5):dEdge);
      if(first){ctx.moveTo(x,y);first=false;}else ctx.lineTo(x,y);}
    ctx.stroke();ctx.restore();}
  // the deck, as pieces: what stands, then each piece that falls
  const pieces=[];let cur=[];for(const x of xs){if(pieceOf(x)>=0){if(cur.length){pieces.push({k:-1,pts:cur});cur=[];}continue;}cur.push(at_(x));}if(cur.length)pieces.push({k:-1,pts:cur});
  if(gone)SB_FALL.forEach(([u0,u1,dl,turn],k)=>{const pts=[];for(const x of xs){const u=sb_mainU(x);if(u>=u0-0.004&&u<=u1+0.004){const m=sb_motion(x,o.tear,o);pts.push([x,sb_deckY(x)+m.dy,m.th]);}}
    // each piece keeps the shape it had the moment it tore, then falls, turning a little
    const tt=Math.max(0,ft-dl),cx_=pts.length?(pts[0][0]+pts[pts.length-1][0])/2:0,cy=G.deck,dy=0.5*260*tt*tt,an=turn*tt*tt*1.4,c_=Math.cos(an),s_=Math.sin(an);
    pieces.push({k,pts:pts.map(p=>{const dx=p[0]-cx_,ey=p[1]-cy;return[cx_+dx*c_-ey*s_,cy+dx*s_+ey*c_+dy,p[2]];})});});
  // the suspenders: from each cable down to its edge of the deck, every so often, not where the deck has gone
  if(cableU>=1&&deckU>0){ctx.save();ctx.lineWidth=1.1;for(let i=4;i<N-3;i+=3){const x=xs[i];const u=sb_mainU(x),sa=gone&&u>=0&&u<=1?Math.exp(-ft*12):1;if(sa<0.03)continue;if(x>G.t0-12&&x<G.t0+12||x>G.t1-12&&x<G.t1+12)continue;
      if(Math.abs((x-960)/(G.a1-G.a0)*2)>deckU)continue;const p=at_(x),rest=[x,sb_deckY(x),0];
      for(const side of [-1,1]){const dEdge=side>0?near(p)-near(rest):far(p)-far(rest),cy=sb_cableY(x,{era,lift:(u>=0&&u<=1)?lift*(1-Math.pow(2*u-1,2)):0})+(side<0?-2*hw0:0)+dEdge,dy=side>0?near(p):far(p);
        if(dy-cy<4)continue;ctx.strokeStyle=rgba(SB_LINE,(side>0?0.42:0.22)*sa);ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x,dy);ctx.stroke();}}ctx.restore();}
  // the deck itself, drawn from the middle out as the bridge builds
  if(deckU>0)for(const pc of pieces){let pts=pc.pts.filter(p=>Math.abs((p[0]-960)/(G.a1-G.a0)*2)<=deckU+0.002);if(pts.length<2)continue;ctx.save();
    if(pc.k>=0){ctx.beginPath();ctx.rect(0,0,W,G.water+2);ctx.clip();}
    sb_deckBand(ctx,pts,{era,gd,lamps:o.lamps==null?1:o.lamps,t});ctx.restore();}
  if(o.cars>0&&!gone)sb_cars(ctx,xs.map(at_),t,o.cars);
  ctx.restore();return gone?{x0:lerp(G.t0,G.t1,SB_FALL[0][0]),x1:lerp(G.t0,G.t1,SB_FALL[2][1]),y:G.deck}:null;}
// a run of deck: the top of the road (or its underside, when it has twisted past the eye), the girder or the truss along its near
// side, and lamps on posts along the near edge
function sb_deckBand(ctx,pts,o){const G=SB_G,hw=p=>G.dw/2*Math.sin(G.elev+p[2]),gd=o.gd;
  // the road's surface
  ctx.beginPath();pts.forEach((p,i)=>{const y=p[1]-hw(p);i?ctx.lineTo(p[0],y):ctx.moveTo(p[0],y);});for(let i=pts.length-1;i>=0;i--){const p=pts[i];ctx.lineTo(p[0],p[1]+hw(p));}ctx.closePath();
  ctx.fillStyle="rgba(92,112,150,0.95)";ctx.fill();
  // where the deck shows its underside, darker
  // where it turns its top towards us it catches the light; where it shows its underside, it's darker
  const hw0=G.dw/2*Math.sin(G.elev),hwM=G.dw/2;ctx.save();ctx.clip();for(let i=0;i<pts.length-1;i++){const p=pts[i],q=pts[i+1],h_=(hw(p)+hw(q))/2;
    if(h_<0){ctx.fillStyle="rgba(22,30,52,0.92)";ctx.fillRect(p[0],Math.min(p[1],q[1])-40,q[0]-p[0]+1,80);}
    else if(h_>hw0*1.3){ctx.fillStyle="rgba(190,210,245,"+(0.45*clamp((h_-hw0)/(hwM-hw0),0,1)).toFixed(3)+")";ctx.fillRect(p[0],Math.min(p[1],q[1])-40,q[0]-p[0]+1,80);}}ctx.restore();
  // the near side: a plate girder, or the deep open truss
  const nearE=pts.map(p=>[p[0],p[1]+Math.max(hw(p),-hw(p)*0.2)]),bot=nearE.map((p,i)=>[p[0],p[1]+gd*Math.cos(pts[i][2])]);
  ctx.beginPath();nearE.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));for(let i=bot.length-1;i>=0;i--)ctx.lineTo(bot[i][0],bot[i][1]);ctx.closePath();
  if(o.era===1950){ctx.fillStyle="rgba(30,42,70,0.45)";ctx.fill();ctx.strokeStyle=rgba(SB_LINE,0.55);ctx.lineWidth=1.2;ctx.beginPath();
    for(let i=0;i<nearE.length-1;i++){const a_=nearE[i],b_=bot[i+1];const c_=bot[i],d_=nearE[i+1];if(i%2){ctx.moveTo(a_[0],a_[1]);ctx.lineTo(b_[0],b_[1]);}else{ctx.moveTo(c_[0],c_[1]);ctx.lineTo(d_[0],d_[1]);}}ctx.stroke();
    ctx.lineWidth=1.8;ctx.strokeStyle=rgba(SB_LINE,0.75);ctx.beginPath();bot.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
  else{ctx.fillStyle="rgba(46,60,94,0.98)";ctx.fill();}
  // the far edge of the road, faintly lit, and its near edge, so the band's width reads as it twists
  ctx.strokeStyle=rgba(SB_LINE,0.45);ctx.lineWidth=1.2;ctx.beginPath();pts.forEach((p,i)=>{const y=p[1]-hw(p);i?ctx.lineTo(p[0],y):ctx.moveTo(p[0],y);});ctx.stroke();
  ctx.strokeStyle=rgba(SB_LINE,0.9);ctx.lineWidth=1.8;ctx.beginPath();nearE.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
  // lamps on posts along the near edge, which lean as the deck twists
  if(o.lamps>0){for(let i=2;i<pts.length;i+=7){const p=pts[i],e=nearE[i],len=17,lx=e[0]+Math.sin(p[2])*len,ly=e[1]-Math.cos(p[2])*len;
    ctx.strokeStyle=rgba(SB_LINE,0.6*o.lamps);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(lx,ly);ctx.stroke();glow(ctx,lx,ly,11,SB_LAMP,0.75*o.lamps);
    ctx.fillStyle=rgba(SB_LAMP,o.lamps);ctx.beginPath();ctx.arc(lx,ly,1.8,0,TAU);ctx.fill();}}}
// traffic: pairs of headlights crossing both ways
function sb_cars(ctx,pts,t,a){const rnd=ag_rnd(1950),n=pts.length;for(let i=0;i<9;i++){const sp=0.045+rnd()*0.02,dir=i%2?1:-1,ph=rnd();let u=((t*sp+ph)%1);if(dir<0)u=1-u;
  const f=u*(n-1),k=Math.floor(f),p=pts[Math.min(n-2,k)],q=pts[Math.min(n-1,k+1)],x=lerp(p[0],q[0],f-k),y=lerp(p[1],q[1],f-k)+(dir>0?2:-3);
  const fade=Math.min(1,u*12,(1-u)*12)*a;glow(ctx,x+dir*6,y,12,[255,236,200],0.6*fade);ctx.fillStyle=rgba([255,244,220],fade);ctx.beginPath();ctx.arc(x+dir*5,y,1.7,0,TAU);ctx.fill();}}

/* ---------------------------------------------------------------- the wind
   sb_wind(ctx, t, o): streaks of air going by, faint, with a little wave: o.box [x, y, w, h], o.n, o.speed (px a second), o.len, o.a,
   o.tilt (radians: in the open, the wind is drawn going a little down), o.seed. */
function sb_wind(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const B=o.box||[0,0,W,H],n=o.n||26,sp=o.speed||420,L0=o.len||180,tilt=o.tilt||0,rnd=ag_rnd(o.seed||7);
  ctx.save();ctx.globalAlpha*=a;if(o.clip){ctx.beginPath();ctx.rect(B[0],B[1],B[2],B[3]);ctx.clip();}ctx.lineCap="round";
  for(let i=0;i<n;i++){const y0=B[1]+rnd()*B[3],ph=rnd(),len=L0*(0.6+rnd()*0.8),v=sp*(0.75+rnd()*0.5),span=B[2]+len*2+200,x=B[0]-len-100+((t*v+ph*span)%span),wob=4+rnd()*6,fr=rnd()*6.28;
    const g=ctx.createLinearGradient(x,0,x+len,0);g.addColorStop(0,rgba(SB_WIND,0));g.addColorStop(0.7,rgba(SB_WIND,0.32));g.addColorStop(1,rgba(SB_WIND,0));
    ctx.strokeStyle=g;ctx.lineWidth=1.4+rnd()*1.2;ctx.beginPath();for(let k=0;k<=12;k++){const xx=x+len*k/12,yy=y0+(xx-B[0])*tilt+Math.sin(xx*0.012+fr+t*1.3)*wob;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}
  ctx.restore();}
// the splash where a piece meets the water, tt seconds after it does
function sb_splash(ctx,x,y,tt,w){if(tt<0||tt>6)return;const f=Math.exp(-tt*0.9);glow(ctx,x,y-10,w*0.6+tt*80,[220,235,255],0.5*f);
  ctx.save();for(let r=0;r<3;r++){const k=tt-r*0.35;if(k<0)continue;const rx=w*0.45+k*190,al=0.5*Math.exp(-k*0.8);ctx.strokeStyle=rgba([200,225,255],al);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y+6,rx,rx*0.08,0,0,TAU);ctx.stroke();}
  const rnd=ag_rnd(Math.round(x));for(let i=0;i<26;i++){const vx=(rnd()-0.5)*260,vy=-(120+rnd()*260),px=x+(rnd()-0.5)*w*0.8+vx*tt,py=y+vy*tt+0.5*600*tt*tt;if(py>y+4)continue;
    ctx.fillStyle=rgba([220,236,255],0.8*f);ctx.beginPath();ctx.arc(px,py,1.6+rnd()*1.8,0,TAU);ctx.fill();}ctx.restore();}

/* ---------------------------------------------------------------- the wind tunnel, and the decks' cross-sections
   sb_section(ctx, x, y, s, era, o): the deck seen end on, the wind going across it, centred on (x, y), s px across: 1940, two plate
   girders 2.4 m deep with the road between (solid: the wind can't pass); 1950, two trusses 10 m deep with open grates in the road
   (the wind passes through). o.th turns it (radians), o.a, o.col (its line). */
function sb_section(ctx,x,y,s,era,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||SB_LINE;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.th||0);
  const k=s/360;ctx.scale(k,k);ctx.lineJoin="round";
  if(era===1940){// 11.9 m wide, 2.4 m deep: two girders and the road slab near their tops
    ctx.fillStyle="rgba(70,90,130,0.98)";ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;
    for(const gx of [-180,166]){rr(ctx,gx,-36,14,72,2);ctx.fill();ctx.stroke();}
    rr(ctx,-168,-26,336,12,2);ctx.fill();ctx.stroke();
    // the lamp posts on the girders, as the story's film shows them
    ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-173,-36);ctx.lineTo(-173,-70);ctx.stroke();}
  else{// 10 m deep trusses at either side, braced across, and the road on top with open grates between its lanes
    ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.fillStyle="rgba(40,56,90,0.55)";
    for(const gx of [-180,164]){ctx.beginPath();ctx.rect(gx,-90,16,180);ctx.fill();ctx.stroke();}
    ctx.lineWidth=2;ctx.strokeStyle=rgba(col,0.7);ctx.beginPath();ctx.moveTo(-164,80);ctx.lineTo(164,80);ctx.moveTo(-164,80);ctx.lineTo(0,-78);ctx.lineTo(164,80);ctx.moveTo(-164,-78);ctx.lineTo(0,80);ctx.lineTo(164,-78);ctx.stroke();
    ctx.lineWidth=3;ctx.strokeStyle=rgba(col,0.95);ctx.fillStyle="rgba(70,90,130,0.98)";
    for(const [x0,x1] of [[-164,-50],[-26,26],[50,164]]){rr(ctx,x0,-90,x1-x0,12,2);ctx.fill();ctx.stroke();}}
  ctx.restore();}
// the tunnel: a long glass box, the fan at its left end, a model on its springs in the middle, and the wind going by
function sb_tunnel(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const t=o.t||0,cx=x+w*0.6,cy=y+h/2;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,h,{r:22,fill:"rgba(9,15,32,0.9)"});
  // the fan, in its housing at the left, turning
  const fx=x+90,fr=Math.min(66,h*0.32),spin=(o.spin==null?1:o.spin)*t*7;ctx.save();ctx.strokeStyle=rgba(SB_LINE,0.75);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(fx,cy,fr+8,0,TAU);ctx.stroke();
  ctx.fillStyle="rgba(150,175,215,0.35)";for(let i=0;i<5;i++){const an=spin+i*TAU/5;ctx.save();ctx.translate(fx,cy);ctx.rotate(an);ctx.beginPath();ctx.ellipse(fr*0.5,0,fr*0.48,fr*0.17,0.25,0,TAU);ctx.fill();ctx.restore();}
  ctx.fillStyle=rgba(SB_LINE,0.9);ctx.beginPath();ctx.arc(fx,cy,7,0,TAU);ctx.fill();ctx.restore();
  // the screens that straighten the air after the fan
  ctx.strokeStyle=rgba(SB_LINE,0.22);ctx.lineWidth=1.4;for(let i=0;i<3;i++){const sx=x+190+i*14;ctx.beginPath();ctx.moveTo(sx,y+24);ctx.lineTo(sx,y+h-24);ctx.stroke();}
  // the wind, steady, from the fan to the far end
  sb_wind(ctx,t,{box:[x+210,y+20,w-230,h-40],n:o.n||22,speed:o.speed||520,len:150,a:(o.wind==null?1:o.wind)*0.9,clip:true,seed:o.seed||11});
  // the springs the model hangs on, above and below it
  ctx.strokeStyle=rgba(SB_LINE,0.5);ctx.lineWidth=2;for(const dir of [-1,1]){const y0=dir<0?y+18:y+h-18,y1=cy+dir*(o.era===1950?110:56);ctx.beginPath();ctx.moveTo(cx,y0);
    for(let i=1;i<=8;i++){const yy=lerp(y0,y1,i/9);ctx.lineTo(cx+(i%2?12:-12),yy);}ctx.lineTo(cx,y1);ctx.stroke();}
  // the model, turning in the wind as much as it does
  sb_section(ctx,cx,cy,o.size||300,o.era||1940,{th:o.th||0,a:o.modelA==null?1:o.modelA});
  if(o.era2)sb_section(ctx,cx,cy,o.size||300,o.era2,{th:o.th2||0,a:o.model2A||0});
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the story */
// Frederick Farquharson, an engineering professor at the University of Washington in the 1940s: a dark suit, a tie, round glasses
const SB_FARQ={name:"Frederick Farquharson",role:"University of Washington",skin:[234,200,176],hair:{style:"side",c:[150,138,124]},glasses:[64,56,50],
  top:{kind:"suit",c:[78,74,70],inner:[236,232,222],tie:[104,64,58]},breath:0.25};

/* ---------------------------------------------------------------- a practice from next door
   sb_nextDoor(ctx, o): two rows, each a practice taken up from next door: wings tested in wind tunnels since the Wright brothers (1901),
   then bridges (1941); software built with tests, review and the same release, then data work. o.r1, o.r2 (0 to 1: each row comes in),
   o.arrow1, o.arrow2 (0 to 1: the arrow from one to the next), o.lit2 (the second row's right card lit), o.y (the top), o.a */
function sb_wing(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(-0.08);const k=s/200;ctx.scale(k,k);ctx.beginPath();ctx.moveTo(-100,4);
  ctx.bezierCurveTo(-96,-18,-40,-26,10,-20);ctx.bezierCurveTo(56,-14,90,-4,100,2);ctx.bezierCurveTo(60,4,0,10,-60,12);ctx.bezierCurveTo(-86,13,-100,10,-100,4);ctx.closePath();
  ctx.fillStyle="rgba(70,90,130,0.98)";ctx.fill();ctx.strokeStyle=rgba(o.col||SB_LINE,0.95);ctx.lineWidth=3;ctx.stroke();ctx.restore();}
function sb_miniTunnel(ctx,x,y,w,h,t,draw,o){o=o||{};md_card(ctx,x,y,w,h,{r:16,fill:"rgba(9,15,32,0.92)",edge:o.edge,glow:o.edge?0.5:0});
  sb_wind(ctx,t,{box:[x+10,y+10,w-20,h-20],n:9,speed:300,len:110,a:0.8,clip:true,seed:o.seed||3});draw(x+w/2,y+h/2);}
function sb_nextDoor(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const y0=o.y||190,rows=[
    {a:o.r1||0,ar:o.arrow1||0,L:{kick:"Since 1901",title:"Wings",sub:"the Wright brothers' wind tunnel"},R:{kick:"From 1941",title:"Bridges",sub:"the same tunnels, a new use"},kind:"tunnel"},
    {a:o.r2||0,ar:o.arrow2||0,L:{kick:"For decades",title:"Software",sub:"tested, reviewed, released the same way"},R:{kick:"Now",title:"Data work",sub:"the same practice, a new use"},kind:"soft"}];
  ctx.save();ctx.globalAlpha*=a;
  rows.forEach((r,i)=>{if(r.a<=0.004)return;const y=y0+i*300,L=150,R=1060,cw=710,ch=230;ctx.save();ctx.globalAlpha*=r.a;
    for(const [bx,wd,side] of [[L,r.L,0],[R,r.R,1]]){if(side===1&&r.ar<=0.3)continue;ctx.save();if(side===1)ctx.globalAlpha*=clamp((r.ar-0.3)/0.5,0,1);
      const lit=side===1&&i===1?(o.lit2||0):0;md_card(ctx,bx,y,cw,ch,{edge:lit>0?MD.pass:null,glow:lit});
      // a small picture at the card's left: a tunnel with a wing or a deck in it, or code becoming a table
      if(r.kind==="tunnel")sb_miniTunnel(ctx,bx+26,y+26,220,ch-52,t+side*3,(mx,my)=>side?sb_section(ctx,mx,my,150,1940,{th:0.12*Math.sin(t*1.3)}):sb_wing(ctx,mx,my,160),{seed:5+side});
      else{const mx=bx+136,my=y+ch/2;md_icon(ctx,side?"table":"api",mx,my,100,side?MD.flow:SB_LINE);}
      md_T(ctx,String(wd.kick).toUpperCase(),bx+276,y+64,{w:800,size:28,ls:4,col:MD.soft});md_T(ctx,wd.title,bx+276,y+118,{w:800,size:44});
      md_wrap(ctx,wd.sub,cw-300,{w:500,size:28}).forEach((l,j)=>md_T(ctx,l,bx+276,y+162+j*36,{w:500,size:28,col:MD.soft}));ctx.restore();}
    // the arrow from next door
    if(r.ar>0){const x0=L+cw+16,x1=R-16,ym=y+ch/2,u=ag_sine(r.ar);ctx.strokeStyle=rgba(MD.ink,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,ym);ctx.lineTo(lerp(x0,x1,u),ym);ctx.stroke();
      if(u>0.9){ctx.fillStyle=rgba(MD.ink,0.85);ctx.beginPath();ctx.moveTo(x1+2,ym);ctx.lineTo(x1-16,ym-10);ctx.lineTo(x1-16,ym+10);ctx.closePath();ctx.fill();}}
    ctx.restore();});
  ctx.restore();}
