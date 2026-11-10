/* ===== A place on the map: Southern California, 1970, and the way of working that came after it =====
   The opening's places, painted full-frame in the module's matte style (no outlines, muted colours, daylight from the right, soft
   contact shadows), dressed for their time. Each is a place painted once (AG_PLACES.cj*); what moves in it is drawn live by the
   helpers beside it. Every name here starts with cj_ or CJ_. The fires keep their own deep red-orange (CJ_FIRE), far off on the
   ridges, and nothing else in the film wears it; nobody is shown hurt. The engines wear their agencies' own colours, none of them the
   module's meaning colours, and each a plain mark of its own on the door: no real agency's emblem.
     cj_scr(ctx, S, fn)              draw in screen space, whatever the camera is doing
     cj_tag(ctx, text, a)            the place and year, on a small card at the top left
     cj_engine(ctx, x, y, s, o)      a fire engine of about 1970, from the side, its rear wheels' foot at (x, y): o.col, o.mark (0 to 6),
                                     o.flip (facing left), o.a; s 1 is about 380 px long
     cj_mark(ctx, x, y, r, k, o)     agency k's plain mark (0 to 6): a shape, no letters
     cj_radio(c, x, y, s, o)         a hand-held radio of the time, its foot at (x, y); o.talk lights its small lamp
     cj_tcard(ctx, x, y, w, words, o) a crew's card, as the status board holds it: a pale card with a band across its top
     cj_board(ctx, o)                the status board: one structure, its leaders and the crews' cards (see below)
     cj_checkin(ctx, o)              the check-in: an awning, a folding table, its sign, a box of blank cards
     cj_fire(ctx, x, y, r, t, o)     a fire's mark on a map: a soft red-orange patch with a darker edge, growing with o.g
   The places: cjHills (the hills, the fires on the far ridges and the road below), cjCamp (a dusty lot at the hills' foot, where help
   arrives), cjMap (a paper map of the hills on a table). */

const CJ_FIRE=[202,82,50],CJ_GLOW=[236,138,92],CJ_SMOKE=[150,140,132],CJ_DRY=[196,172,128],CJ_SCRUB=[120,114,86];
// the agencies' engines and their marks: red, maroon, cream, white and charcoal; the marks in their own quiet tones
const CJ_ENG=[[160,58,50],[118,54,54],[224,214,190],[236,234,228],[76,78,82],[150,64,56],[208,200,182]];
const CJ_MARKC=[[86,92,100],[124,104,80],[96,84,110],[110,96,86],[70,96,104],[132,110,72],[96,104,84]];

/* ---------------------------------------------------------------- small helpers */
const cj_shade=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
function cj_smooth(pts,n){const out=[],Q=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<Q.length-2;i++)for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(Q[i-1][0],Q[i][0],Q[i+1][0],Q[i+2][0]),f(Q[i-1][1],Q[i][1],Q[i+1][1],Q[i+2][1])]);}out.push(pts[pts.length-1]);return out;}
function cj_path(c,Q){c.moveTo(Q[0][0],Q[0][1]);for(let i=1;i<Q.length;i++)c.lineTo(Q[i][0],Q[i][1]);c.closePath();}
function cj_blobPts(cx,cy,rx,ry,seed,amp,n){n=n||40;const out=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.6+seed*3.1,Math.sin(a)*1.6+seed*1.7,3)-0.5)*2;
  out.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return out;}
function cj_blob(c,cx,cy,rx,ry,seed,amp,fill){c.beginPath();cj_path(c,cj_blobPts(cx,cy,rx,ry,seed,amp));c.fillStyle=fill;c.fill();}
// a ridge line through the points, filled down to bottom
function cj_ridge(c,pts,bottom,fill){const S=cj_smooth(pts,10);c.beginPath();c.moveTo(S[0][0],bottom);for(const p of S)c.lineTo(p[0],p[1]);c.lineTo(S[S.length-1][0],bottom);c.closePath();c.fillStyle=fill;c.fill();return S;}
// light from the right over a whole place, and its near edge a little darker
function cj_light(c,k){k=k==null?1:k;let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,"+0.12*k+")");g.addColorStop(0.55,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,246,228,"+0.08*k+")");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(0,900,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,"+0.12*k+")");c.fillStyle=g;c.fillRect(0,900,W,H-900);}
function cj_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place and year, on a small card at the top left, in screen space
function cj_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
// a shrub of the chaparral: a low, dense, rounded clump, lit from the right
function cj_shrub(c,x,y,r,seed,col){col=col||CJ_SCRUB;cj_blob(c,x,y-r*0.5,r,r*0.62,seed,0.3,rgba(cj_shade(col,0.82),1));
  cj_blob(c,x+r*0.18,y-r*0.62,r*0.66,r*0.42,seed+3,0.32,rgba(mix(col,[214,206,170],0.22),0.9));}

/* ---------------------------------------------------------------- the hills, autumn 1970
   A smoky sky, three plumes leaning away from the wind, the far ridges with the fires along their tops, the golden hills nearer, a
   few houses on a slope at the right, and the road winding up from the bottom left, with its poles. The engines on the road, the
   smoke's slow drift and the fires' glow are drawn live (cj_hillsLife). */
const CJ_HZ=560;
const CJ_ROAD=[[-80,1010],[220,930],[480,880],[700,846],[930,824],[1160,800],[1420,770],[1700,742],[2000,716]];
const CJ_RIDGE=[[0,470],[150,452],[330,470],[520,438],[700,462],[880,448],[1060,470],[1240,442],[1420,458],[1600,432],[1780,454],[1920,446]];
const CJ_FIRES=[[260,454,190],[1490,446,170],[880,452,90]];   // where the fires burn along the far ridge: x, y, half-width
AG_PLACES.cjHills=c=>{
  // the sky: high grey-blue going to a warm, smoky haze over the hills
  let g=c.createLinearGradient(0,0,0,CJ_HZ);g.addColorStop(0,"rgb(170,170,170)");g.addColorStop(0.45,"rgb(196,186,174)");g.addColorStop(1,"rgb(226,206,184)");c.fillStyle=g;c.fillRect(0,0,W,CJ_HZ+40);
  g=c.createRadialGradient(1640,250,10,1640,250,520);g.addColorStop(0,"rgba(252,236,206,0.55)");g.addColorStop(1,"rgba(252,236,206,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_soft(c,k=>k.arc(1640,250,34,0,TAU),[248,226,196],[255,246,226],1650,240,30,null);
  // the plumes: soft towers of smoke rising from behind the ridge and leaning left, darker at their foot
  for(const [x0,h,lean,s] of [[300,430,-260,1.2],[1500,400,-300,1.1],[900,260,-160,0.7]]){for(let i=0;i<14;i++){const u=i/13,x=x0+lean*Math.pow(u,1.4),y=CJ_RIDGE[0][1]-20-u*h,r=(60+u*140)*s;
    cj_blob(c,x,y,r,r*0.62,x0*0.01+i*0.7,0.34,rgba(mix(cj_shade(CJ_SMOKE,0.82),[214,204,194],u),0.34-u*0.12));}}
  // a band of haze over everything far off
  g=c.createLinearGradient(0,300,0,CJ_HZ);g.addColorStop(0,"rgba(214,200,186,0)");g.addColorStop(1,"rgba(214,200,186,0.5)");c.fillStyle=g;c.fillRect(0,300,W,CJ_HZ-300);
  // the far ridge, blue-grey in the smoke, the fires' glow along its top
  for(const f of CJ_FIRES){g=c.createRadialGradient(f[0],f[1],8,f[0],f[1],f[2]*1.5);g.addColorStop(0,rgba(CJ_GLOW,0.5));g.addColorStop(1,rgba(CJ_GLOW,0));c.fillStyle=g;c.fillRect(f[0]-f[2]*1.6,f[1]-f[2]*1.6,f[2]*3.2,f[2]*3.2);}
  cj_ridge(c,CJ_RIDGE,H,"rgb(150,146,144)");
  // the next ridge, warmer, and the golden hills nearer still, with their shrubs
  const R2=cj_ridge(c,[[0,560],[200,530],[420,556],[640,520],[860,548],[1080,516],[1300,540],[1520,512],[1740,536],[1920,520]],H,"rgb(170,154,132)");
  g=c.createLinearGradient(0,430,0,720);g.addColorStop(0,"rgba(226,206,184,0)");g.addColorStop(0.45,"rgba(226,206,184,0.3)");g.addColorStop(1,"rgba(226,206,184,0)");c.fillStyle=g;c.fillRect(0,430,W,290);
  const R3=cj_ridge(c,[[0,700],[260,640],[520,672],[760,620],[1000,656],[1240,606],[1500,640],[1740,602],[1920,626]],H,rgba(CJ_DRY,1));
  const R=ag_rnd(17);
  for(let i=0;i<120;i++){const x=R()*W,base=R3[Math.min(R3.length-1,Math.floor(x/W*(R3.length-1)))][1],y=base+20+R()*R()*360;cj_shrub(c,x,y,10+R()*16*(0.5+(y-base)/300),i,mix(CJ_SCRUB,[150,140,104],R()*0.5));}
  // the houses on the slope at the right: low ranch houses, pale walls, low roofs, a few trees by them
  for(const [x,y,w] of [[1270,676,120],[1430,662,140],[1600,690,110],[1730,668,130],[1380,724,120]]){
    c.fillStyle="rgba(46,40,32,0.18)";c.fillRect(x-6,y+38,w+18,8);
    ag_soft(c,k=>k.rect(x,y,w,40),[228,220,204],[244,238,226],x+w,y,w,null);
    c.fillStyle="rgb(124,112,100)";c.beginPath();c.moveTo(x-10,y+2);c.lineTo(x+w*0.5,y-18);c.lineTo(x+w+10,y+2);c.closePath();c.fill();
    c.fillStyle="rgba(120,130,136,0.7)";c.fillRect(x+w*0.18,y+12,w*0.16,14);c.fillRect(x+w*0.6,y+12,w*0.2,14);
    cj_blob(c,x-18,y+14,26,30,x*0.03,0.3,"rgb(110,112,84)");}
  // the road, winding up from the bottom left, its shoulder and a pale centre line; poles beside it
  const S=cj_smooth(CJ_ROAD,10);c.lineCap="round";c.lineJoin="round";
  const road=(w,col)=>{c.strokeStyle=col;c.beginPath();S.forEach((p,i)=>{const k=1-(1010-p[1])/420;c.lineWidth=w*(0.45+0.55*clamp(k,0,1));i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);});c.stroke();};
  for(let i=1;i<S.length;i++){const p=S[i-1],q=S[i],k=0.45+0.55*clamp(1-(1010-p[1])/420,0,1);c.lineWidth=96*k;c.strokeStyle="rgb(176,160,128)";c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();}
  for(let i=1;i<S.length;i++){const p=S[i-1],q=S[i],k=0.45+0.55*clamp(1-(1010-p[1])/420,0,1);c.lineWidth=78*k;c.strokeStyle="rgb(118,114,110)";c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();}
  c.setLineDash([26,30]);c.strokeStyle="rgba(232,226,210,0.7)";c.lineWidth=3;c.beginPath();S.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.setLineDash([]);
  for(let i=0;i<8;i++){const p=S[Math.min(S.length-1,6+i*9)],k=0.45+0.55*clamp(1-(1010-p[1])/420,0,1),h=150*k,x=p[0]+10,y=p[1]-44*k;
    c.fillStyle="rgb(92,78,64)";c.fillRect(x-3*k,y-h,6*k,h);c.fillRect(x-22*k,y-h+10*k,44*k,5*k);}
  c.strokeStyle="rgba(60,52,44,0.45)";c.lineWidth=1.4;c.beginPath();for(let i=0;i<8;i++){const p=S[Math.min(S.length-1,6+i*9)],k=0.45+0.55*clamp(1-(1010-p[1])/420,0,1);
    const x=p[0]+10-20*k,y=p[1]-44*k-140*k;i?c.lineTo(x,y+6):c.moveTo(x,y);}c.stroke();
  // dry grass at the front, darker at the frame's foot
  g=c.createLinearGradient(0,880,0,H);g.addColorStop(0,"rgba(150,124,84,0)");g.addColorStop(1,"rgba(150,124,84,0.4)");c.fillStyle=g;c.fillRect(0,880,W,H-880);
  cj_light(c,0.8);};
// where along the road an engine is at u (0 the bottom left, 1 off at the right), and how large it is drawn there
const CJ_ROADS=cj_smooth(CJ_ROAD,10);
function cj_roadAt(u){const S=CJ_ROADS,f=clamp(u,0,1)*(S.length-1),i=Math.min(S.length-2,Math.floor(f)),k=f-i,p=[lerp(S[i][0],S[i+1][0],k),lerp(S[i][1],S[i+1][1],k)];
  return{x:p[0],y:p[1],s:0.2+0.36*clamp(1-(1010-p[1])/420,0,1)};}
// the smoke's slow drift over the far ridge, the fires' glow breathing slowly, and the engines on the road ([u, col, mark] each)
function cj_hillsLife(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(const f of CJ_FIRES){const k=0.7+0.3*Math.sin(t*0.6+f[0]*0.01),g=ctx.createRadialGradient(f[0],f[1],4,f[0],f[1],f[2]);g.addColorStop(0,rgba(CJ_FIRE,0.42*k));g.addColorStop(1,rgba(CJ_FIRE,0));
    ctx.fillStyle=g;ctx.fillRect(f[0]-f[2],f[1]-f[2],f[2]*2,f[2]*2);
    ctx.fillStyle=rgba(CJ_FIRE,0.75);ctx.beginPath();const L=cj_smooth(CJ_RIDGE,10);let first=true;for(const p of L){if(Math.abs(p[0]-f[0])>f[2]*0.8)continue;const y=p[1]-3-2*Math.sin(p[0]*0.07+t*0.8);if(first){ctx.moveTo(p[0],y);first=false;}else ctx.lineTo(p[0],y);}
    for(let i=L.length-1;i>=0;i--){const p=L[i];if(Math.abs(p[0]-f[0])>f[2]*0.8)continue;ctx.lineTo(p[0],p[1]+4);}ctx.closePath();ctx.fill();}
  for(let i=0;i<5;i++){const x=((i*430+t*-14)%2400+2400)%2400-240,y=330+(i%3)*60;cj_blob(ctx,x,y,260,60,i*1.7,0.3,rgba(CJ_SMOKE,0.12));}
  for(const e of (o.engines||[])){const p=cj_roadAt(e[0]);if(e[0]<0||e[0]>1)continue;cj_engine(ctx,p.x,p.y+4,p.s,{col:e[1],mark:e[2],flip:false,a:e[3]==null?1:e[3]});}
  ctx.restore();}

/* ---------------------------------------------------------------- an engine of about 1970, from the side
   A cab with its windscreen at the front (the right), the body behind it with its lockers, a ladder along the top, the hose bed at
   the back, two wheels; the agency's colour, a pale band, and its plain mark on the cab's door. */
function cj_engine(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||CJ_ENG[0],dk=cj_shade(col,0.74),lt=mix(col,[255,255,255],0.3);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);
  ag_floorShadow(ctx,170-AG.sdx*2,4,230,16,0.3);
  // the body, then the cab
  ag_soft(ctx,k=>ag_rect(k,-20,-150,262,120,10),col,lt,220,-140,200,null);
  ag_soft(ctx,k=>{k.moveTo(236,-30);k.lineTo(236,-176);k.quadraticCurveTo(238,-190,256,-190);k.lineTo(330,-190);k.quadraticCurveTo(352,-188,358,-160);k.lineTo(370,-92);k.lineTo(372,-30);k.closePath();},col,lt,340,-170,160,null);
  // the windscreen and a side window
  ctx.fillStyle="rgba(150,170,180,0.9)";ctx.beginPath();ctx.moveTo(300,-180);ctx.lineTo(336,-180);ctx.quadraticCurveTo(350,-178,354,-158);ctx.lineTo(360,-126);ctx.lineTo(300,-126);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(150,170,180,0.85)";ctx.fillRect(250,-178,40,52);ctx.fillStyle="rgba(255,255,255,0.35)";ctx.fillRect(306,-176,12,46);
  // a pale band along it, the lockers' doors, the bumper and a lamp
  ctx.fillStyle=rgba(mix(col,[240,236,228],0.7),0.95);ctx.fillRect(-20,-74,392,10);
  ctx.strokeStyle=rgba(dk,0.6);ctx.lineWidth=2;for(const lx of [0,64,128]){ctx.strokeRect(lx+6,-140,54,58);}
  ctx.fillStyle="rgb(170,170,166)";ctx.fillRect(360,-44,22,14);ctx.fillStyle="rgb(196,196,190)";ctx.fillRect(-26,-40,24,10);
  ctx.fillStyle="rgba(250,244,226,0.9)";ctx.beginPath();ctx.arc(364,-104,7,0,TAU);ctx.fill();
  // the ladder along the top, and the hose bed's folds at the back
  ctx.fillStyle="rgb(170,166,156)";ctx.fillRect(-10,-162,240,5);ctx.fillRect(-10,-174,240,5);for(let i=0;i<12;i++)ctx.fillRect(-6+i*20,-174,4,17);
  ctx.fillStyle="rgb(196,188,170)";for(let i=0;i<3;i++)ctx.fillRect(-18,-148+i*12,40,8);
  // the mark on the door
  cj_mark(ctx,270,-96,20,o.mark||0,{flat:true});
  // the wheels
  for(const wx of [40,300]){ctx.fillStyle="rgb(40,40,42)";ctx.beginPath();ctx.arc(wx,-26,30,0,TAU);ctx.fill();ctx.fillStyle="rgb(168,166,160)";ctx.beginPath();ctx.arc(wx,-26,13,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(dk,1);ctx.beginPath();ctx.arc(wx,-26,36,Math.PI,TAU);ctx.lineTo(wx+36,-30);ctx.lineTo(wx-36,-30);ctx.closePath();ctx.globalAlpha*=1;ctx.fill();
    ctx.fillStyle="rgb(40,40,42)";ctx.beginPath();ctx.arc(wx,-26,30,0,Math.PI);ctx.fill();ctx.fillStyle="rgb(168,166,160)";ctx.beginPath();ctx.arc(wx,-26,13,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- an agency's plain mark: a shape in its own tone, no letters */
function cj_mark(ctx,x,y,r,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;k=((k%7)+7)%7;const col=o.col||CJ_MARKC[k];ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  const shape=c=>{c.beginPath();
    if(k===0){c.moveTo(-r*0.8,-r*0.8);c.lineTo(r*0.8,-r*0.8);c.lineTo(r*0.8,0);c.quadraticCurveTo(r*0.7,r*0.7,0,r);c.quadraticCurveTo(-r*0.7,r*0.7,-r*0.8,0);c.closePath();}
    else if(k===1)c.arc(0,0,r*0.9,0,TAU);
    else if(k===2){c.moveTo(0,-r);c.lineTo(r,0);c.lineTo(0,r);c.lineTo(-r,0);c.closePath();}
    else if(k===3){for(let i=0;i<6;i++){const q=i/6*TAU-Math.PI/2;c.lineTo(Math.cos(q)*r*0.95,Math.sin(q)*r*0.95);}c.closePath();}
    else if(k===4)ag_rect(c,-r*0.8,-r*0.8,r*1.6,r*1.6,r*0.3);
    else if(k===5){c.moveTo(0,-r);c.lineTo(r*0.95,r*0.75);c.lineTo(-r*0.95,r*0.75);c.closePath();}
    else{c.ellipse(0,0,r,r*0.66,0,0,TAU);}};
  if(!o.flat){ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=r*0.5;ctx.shadowOffsetX=AG.sdx*r/40;ctx.shadowOffsetY=r*0.18;shape(ctx);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.restore();}
  shape(ctx);ctx.fillStyle=rgba(col,1);ctx.fill();
  // a pale inner line, and the light from the right
  ctx.save();shape(ctx);ctx.clip();const g=ctx.createRadialGradient(r*0.5,-r*0.5,0,r*0.5,-r*0.5,r*1.6);g.addColorStop(0,"rgba(255,255,255,0.35)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(-r*1.2,-r*1.2,r*2.4,r*2.4);ctx.restore();
  ctx.strokeStyle="rgba(250,248,240,0.75)";ctx.lineWidth=Math.max(1.2,r*0.08);ctx.save();ctx.translate(0,0);ctx.scale(0.72,0.72);shape(ctx);ctx.restore();ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the time
   Three crew leaders from three kinds of agency, dressed as crews dressed about 1970: a city captain in his black turnout coat and
   leather helmet, a county crew boss in a tan shirt and white hard hat, a forest crew boss in a khaki shirt and pale hard hat; and,
   once the check-in exists, the clerk who writes each crew's card. */
// a traditional fire helmet: a high crown, a brim that sweeps down long at the back, a plain shield at the front (no number)
function cj_helmet(col){return(c,P)=>{const lt=ag_lt(col,0.28),dk=ag_dk(col,0.4);
  ag_soft(c,cc=>{cc.moveTo(164,392);cc.bezierCurveTo(170,366,194,352,214,350);cc.bezierCurveTo(260,346,330,346,388,352);cc.bezierCurveTo(408,356,420,362,424,370);
    cc.bezierCurveTo(400,376,330,374,290,374);cc.bezierCurveTo(240,374,194,380,164,392);cc.closePath();},dk,lt,380,356,90,null);
  ag_soft(c,cc=>{cc.moveTo(214,356);cc.bezierCurveTo(206,300,240,262,300,258);cc.bezierCurveTo(356,256,392,292,394,354);cc.bezierCurveTo(340,346,262,348,214,356);cc.closePath();},
    col,lt,352,282,120,rgba(ag_dk(col,0.7),0.4),12);
  c.strokeStyle=rgba(lt,0.5);c.lineWidth=3;for(const dx of [-30,0,30]){c.beginPath();c.moveTo(300+dx*1.2,264);c.quadraticCurveTo(306+dx,300,304+dx*0.9,350);c.stroke();}
  ag_soft(c,cc=>{cc.moveTo(352,300);cc.lineTo(386,296);cc.lineTo(392,334);cc.quadraticCurveTo(376,346,358,338);cc.closePath();},[204,200,190],[244,242,236],384,304,40,null);};}
// a hard hat: a smooth dome with a short brim all round
function cj_hardhat(col){return(c,P)=>{const lt=ag_lt(col,0.35),dk=ag_dk(col,0.25);
  ag_soft(c,cc=>{cc.moveTo(194,362);cc.bezierCurveTo(220,354,300,350,420,360);cc.bezierCurveTo(424,368,416,374,400,374);cc.bezierCurveTo(330,370,250,372,196,374);cc.bezierCurveTo(186,372,186,366,194,362);cc.closePath();},dk,lt,380,360,90,null);
  ag_soft(c,cc=>{cc.moveTo(214,360);cc.bezierCurveTo(208,302,244,266,302,264);cc.bezierCurveTo(360,262,396,300,396,360);cc.bezierCurveTo(330,354,266,354,214,360);cc.closePath();},col,lt,354,286,120,rgba(ag_dk(col,0.6),0.35),12);
  c.strokeStyle=rgba(dk,0.5);c.lineWidth=4;c.beginPath();c.moveTo(304,266);c.quadraticCurveTo(312,300,310,356);c.stroke();};}
// pale bands across a turnout coat, and its clasps
function cj_bands(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);ag_shape(c,AG_F.torso);c.clip();c.fillStyle=rgba(col,0.9);c.fillRect(80,900,360,22);c.fillRect(80,960,360,10);
  c.fillStyle="rgba(30,30,32,0.7)";for(const y of [700,790,880])c.fillRect(318,y,30,10);c.restore();};}
const CJ_CAPT={key:"cj-capt",name:"A city fire captain, 1970",skin:[226,190,158],hair:{style:"cropped",c:[74,60,48]},top:{kind:"overshirt",c:[46,48,52],inner:[60,62,66],paint:cj_bands([196,196,188])},hat:{paint:cj_helmet([44,44,48])},breath:0.27};
const CJ_COUNTY={key:"cj-county",name:"A county crew boss, 1970",skin:[198,150,112],hair:{style:"side",c:[56,42,32]},beard:[64,48,36],top:{kind:"shirt",c:[150,128,98]},hat:{paint:cj_hardhat([232,228,218])},breath:0.25};
const CJ_FOREST={key:"cj-forest",name:"A forest crew boss, 1970",skin:[140,96,70],hair:{style:"cropped",c:[30,26,24]},top:{kind:"shirt",c:[176,162,126]},hat:{paint:cj_hardhat([206,202,190])},breath:0.29};
const CJ_CLERK={key:"cj-clerk",name:"The check-in clerk",skin:[236,204,176],hair:{style:"bob",c:[112,80,56]},glasses:[70,58,50],earrings:[210,200,186],top:{kind:"cardigan",c:[128,118,112],inner:[232,228,220]},breath:0.31};
const CJ_LEADERS=[CJ_CAPT,CJ_COUNTY,CJ_FOREST];

// a hand-held radio of the time: a tall brick with a whip aerial, a grille and a small lamp; its foot at (x, y), in figure space
function cj_radio(c,x,y,s,o){o=o||{};s=s||1;c.save();c.translate(x,y);c.scale(s,s);
  ag_soft(c,k=>ag_rect(k,-22,-120,44,120,8),[46,48,52],[110,114,120],14,-110,60,null);
  c.strokeStyle="rgb(40,40,44)";c.lineWidth=4;c.lineCap="round";c.beginPath();c.moveTo(12,-118);c.lineTo(16,-206);c.stroke();
  c.fillStyle="rgba(170,172,176,0.6)";for(let i=0;i<5;i++)c.fillRect(-12,-96+i*10,24,4);
  c.fillStyle=o.talk?"rgba(236,138,92,0.95)":"rgba(120,70,60,0.8)";c.beginPath();c.arc(-8,-110,4,0,TAU);c.fill();c.restore();}
// a leader holding the radio up in the near hand: the hold that ag_person draws (hands.near is the wrist, in figure space)
const cj_holdRadio=(o)=>(c,h)=>cj_radio(c,h.near[0]+14,h.near[1]+40,1.15,o);
// what a radio carries: a few soft rings going out from its aerial (k 0 to 1, how busy), in the frame's coordinates
function cj_waves(ctx,x,y,t,k,col){if(k<=0.01)return;ctx.save();ctx.lineCap="round";for(let i=0;i<3;i++){const u=((t*0.7+i/3)%1),r=20+u*90;ctx.strokeStyle=rgba(col||[96,92,88],0.8*k*(1-u));ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(x,y,r,-0.9,0.2);ctx.stroke();ctx.beginPath();ctx.arc(x,y,r,Math.PI-0.2,Math.PI+0.9);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the lot where help arrives
   A dusty lot at the hills' foot: the hills and their smoke behind, a long row of parked engines, a few trees. The check-in and the
   status board, which only exist once there is one way of working, are drawn live (cj_checkin, cj_board). */
const CJ_CHZ=520;
AG_PLACES.cjCamp=c=>{let g=c.createLinearGradient(0,0,0,CJ_CHZ);g.addColorStop(0,"rgb(184,180,174)");g.addColorStop(1,"rgb(226,210,190)");c.fillStyle=g;c.fillRect(0,0,W,CJ_CHZ+40);
  for(const [x0,h,lean,s] of [[420,330,-220,1.0],[1380,300,-240,0.9]]){for(let i=0;i<12;i++){const u=i/11,x=x0+lean*Math.pow(u,1.4),y=CJ_CHZ-40-u*h,r=(60+u*120)*s;
    cj_blob(c,x,y,r,r*0.6,x0*0.01+i*0.9,0.34,rgba(mix(cj_shade(CJ_SMOKE,0.84),[214,204,194],u),0.3-u*0.1));}}
  cj_ridge(c,[[0,470],[240,440],[480,466],[760,430],[1040,458],[1300,428],[1560,452],[1800,430],[1920,440]],H,"rgb(160,152,144)");
  cj_ridge(c,[[0,540],[300,506],[600,532],[900,500],[1200,528],[1500,498],[1920,520]],H,"rgb(180,162,134)");
  g=c.createLinearGradient(0,520,0,H);g.addColorStop(0,"rgb(206,190,160)");g.addColorStop(1,"rgb(186,168,138)");c.fillStyle=g;c.fillRect(0,590,W,H-590);
  cj_ridge(c,[[0,600],[480,590],[960,598],[1440,588],[1920,596]],H,"rgb(204,188,158)");
  // a few oaks along the lot's back, and the dust's texture
  for(const [x,y,s] of [[150,600,1.0],[760,594,0.8],[1820,598,1.1]]){c.fillStyle="rgb(96,86,72)";c.fillRect(x-6*s,y-70*s,12*s,72*s);
    cj_blob(c,x,y-110*s,110*s,60*s,x*0.01,0.3,"rgb(104,108,84)");cj_blob(c,x+20*s,y-124*s,70*s,36*s,x*0.02,0.3,"rgb(132,134,104)");}
  const R=ag_rnd(29);for(let i=0;i<220;i++){const x=R()*W,y=610+R()*470;c.fillStyle=R()<0.5?"rgba(255,246,226,0.12)":"rgba(90,74,56,0.1)";c.fillRect(x,y,8+R()*30,2);}
  // the row of engines parked along the lot's back, small and far
  [[340,0],[560,2],[1040,4],[1260,1],[1480,3],[1700,6]].forEach(([x,k],i)=>cj_engine(c,x,616,0.42,{col:CJ_ENG[k],mark:k}));
  cj_light(c,0.7);};

/* ---------------------------------------------------------------- the check-in
   An awning of pale canvas on poles, a folding table under it with a box of blank cards and a clipboard, and a board on the awning's
   front: CHECK-IN. All drawn live, in the lot's coordinates, its table's front edge at y (o.y, 760) and its left at o.x (180). */
const CJ_CK={x:150,y:770,w:620};
function cj_checkin(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const {x,y,w}=CJ_CK;ctx.save();ctx.globalAlpha*=a;
  // the awning's poles and its canvas roof
  ctx.fillStyle="rgb(110,100,88)";for(const px of [x+10,x+w-14])ctx.fillRect(px,y-420,8,420);
  ag_soft(ctx,k=>{k.moveTo(x-30,y-420);k.lineTo(x+w+30,y-420);k.lineTo(x+w+50,y-350);k.lineTo(x-50,y-350);k.closePath();},[214,206,184],[238,232,214],x+w,y-420,500,null);
  ctx.fillStyle="rgba(170,160,138,0.9)";for(let i=0;i<10;i++){const sx=x-50+i*(w+100)/10;ctx.beginPath();ctx.moveTo(sx,y-350);ctx.quadraticCurveTo(sx+(w+100)/20,y-334,sx+(w+100)/10,y-350);ctx.fill();}
  // the sign
  ag_box(ctx,x+w/2-150,y-404,300,62,8,{});ag_T(ctx,"CHECK-IN",x+w/2,y-360,{w:800,size:34,ls:5,align:"center",col:AG.ink});
  // the table: its top, its legs, a box of blank cards and a clipboard on it
  ag_floorShadow(ctx,x+w/2-20,y+60,w*0.6,22,0.25);
  ctx.fillStyle="rgb(120,108,92)";for(const lx of [x+40,x+w-50]){ctx.save();ctx.translate(lx,y);ctx.rotate(0.08);ctx.fillRect(-4,0,8,110);ctx.restore();ctx.save();ctx.translate(lx,y);ctx.rotate(-0.08);ctx.fillRect(-4,0,8,110);ctx.restore();}
  ag_soft(ctx,k=>k.rect(x,y-14,w,18),[196,186,164],[226,218,200],x+w,y-14,300,null);ctx.fillStyle="rgb(150,140,120)";ctx.fillRect(x,y+4,w,6);
  ag_soft(ctx,k=>k.rect(x+70,y-74,130,60),[158,132,104],[198,176,144],x+190,y-74,120,null);
  ctx.fillStyle="rgba(248,244,232,0.95)";for(let i=0;i<5;i++)ctx.fillRect(x+80+i*24,y-88+((i*7)%3)*2,16,40);
  ag_soft(ctx,k=>k.rect(x+w-230,y-40,150,24),[140,122,96],[180,160,130],x+w-90,y-40,80,null);
  ctx.fillStyle="rgba(250,248,240,0.95)";ctx.fillRect(x+w-222,y-46,134,10);
  ctx.restore();}

/* ---------------------------------------------------------------- a crew's card, and the status board
   cj_tcard: a pale card with a band across its top, the crew's words on it (at least 28 px); o.edge a colour for a card that's lit.
   cj_board: the board on its legs at the lot's right, its frame of oak and its slots in rows. The structure on it is CJ_ORG: the
   commander at the top, three leaders under, and each leader's crews in a column under them; o.show(key) (0 to 1) how far each card
   has come in, o.lines (0 to 1) the lines up to whom each answers, o.lit (a leader's index) lit, o.count (0 to 1) "about 7 at most" under its column,
   o.band(key) a crew card's band (its agency's colour), o.extra [{x, y, w, words, band, a}] cards beyond the slots (a crew that arrives later). */
function cj_tcard(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||64;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.22)";ctx.shadowBlur=10;ctx.shadowOffsetX=AG.sdx*0.4;ctx.shadowOffsetY=4;ctx.fillStyle="rgb(246,242,232)";ctx.beginPath();ag_rect(ctx,x,y,w,h,5);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(o.band||[196,176,168],1);ctx.beginPath();ag_rect(ctx,x,y,w,12,5);ctx.fill();ctx.fillRect(x,y+6,w,6);
  if(o.edge){ctx.strokeStyle=rgba(o.edge,0.9*(o.edgeA==null?1:o.edgeA));ctx.lineWidth=3;ctx.beginPath();ag_rect(ctx,x,y,w,h,5);ctx.stroke();}
  ag_T(ctx,words,x+w/2,y+h/2+22,{w:700,size:o.size||28,align:"center",col:AG.ink});ctx.restore();}
const CJ_BD={x:930,y:250,w:900,h:560};
const CJ_ORG={top:["Incident commander"],leaders:["Division A","Division B","Staging"],crews:[["Engine 12","Crew 7","Engine 31","Dozer 2"],["Engine 4","Crew 2","Engine 18","Crew 9"],["Engine 6","Engine 40","Crew 11"]]};
const CJ_CW=200,CJ_CH=58;
// where each card sits on the board: {key, x, y, w, words, up (the card it answers to)}
const CJ_SLOTS=(()=>{const B=CJ_BD,out=[],cx=B.x+B.w/2;out.push({key:"top",x:cx-150,y:B.y+40,w:300,words:CJ_ORG.top[0]});
  CJ_ORG.leaders.forEach((l,i)=>{const lx=B.x+60+i*(B.w-120)/3+((B.w-120)/3-CJ_CW-20)/2;out.push({key:"L"+i,x:lx,y:B.y+150,w:CJ_CW+20,words:l,up:"top"});
    CJ_ORG.crews[i].forEach((c,j)=>out.push({key:"C"+i+"_"+j,x:lx+10,y:B.y+228+j*(CJ_CH+6),w:CJ_CW,words:c,up:"L"+i,col:i}));});return out;})();
const cj_slot=k=>CJ_SLOTS.find(s=>s.key===k);
function cj_board(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const B=CJ_BD,show=o.show||(()=>1);ctx.save();ctx.globalAlpha*=a;
  // its legs and its oak frame, a pale board inside with faint slot lines
  ag_floorShadow(ctx,B.x+B.w/2-30,B.y+B.h+250,B.w*0.4,18,0.22);ctx.fillStyle="rgb(132,112,86)";for(const lx of [B.x+70,B.x+B.w-80])ctx.fillRect(lx,B.y+B.h,14,250);
  ag_soft(ctx,k=>ag_rect(k,B.x-18,B.y-18,B.w+36,B.h+36,10),AG_OAK.dark,AG_OAK.base,B.x+B.w,B.y,B.w*0.8,null);
  ag_soft(ctx,k=>k.rect(B.x,B.y,B.w,B.h),[232,226,212],[244,240,230],B.x+B.w,B.y,B.w,null);
  ctx.strokeStyle="rgba(120,104,84,0.22)";ctx.lineWidth=2;for(let y=B.y+30;y<B.y+B.h;y+=33){ctx.beginPath();ctx.moveTo(B.x+12,y);ctx.lineTo(B.x+B.w-12,y);ctx.stroke();}
  // the lines up to whom each answers, under the cards
  const L=o.lines||0;if(L>0){ctx.save();ctx.strokeStyle=rgba(AG.blue,0.7*L);ctx.lineWidth=3;ctx.lineCap="round";
    for(const s of CJ_SLOTS){if(!s.up)continue;const u=cj_slot(s.up),sa=Math.min(show(s.key),show(s.up));if(sa<=0.01)continue;ctx.globalAlpha=L*sa;
      const x0=s.x+(s.key[0]==="C"?-8:s.w/2),y0=s.y+(s.key[0]==="C"?CJ_CH/2:0),x1=u.x+u.w/2,y1=u.y+(s.key[0]==="C"?64:64);ctx.beginPath();
      if(s.key[0]==="C"){ctx.moveTo(s.x,y0);ctx.lineTo(s.x-12,y0);ctx.lineTo(s.x-12,u.y+64);}else{ctx.moveTo(x0,y0);ctx.lineTo(x0,y0-22);ctx.lineTo(x1,y0-22);ctx.lineTo(x1,y1);}ctx.stroke();}
    ctx.restore();}
  for(const s of CJ_SLOTS){const k=show(s.key);if(k<=0.01)continue;const lead=s.key[0]!=="C";
    cj_tcard(ctx,s.x,s.y,s.w,s.words,{a:clamp(k,0,1),h:lead?64:CJ_CH,band:(!lead&&o.band&&o.band(s.key))||(lead?[150,168,180]:[200,182,172]),edge:o.lit!=null&&s.key==="L"+o.lit?AG.blue:null,edgeA:o.litA});}
  for(const e of (o.extra||[]))cj_tcard(ctx,e.x,e.y,e.w,e.words,{a:e.a==null?1:e.a,h:CJ_CH,band:e.band});
  if(o.count>0.01){const l=cj_slot("L"+(o.lit||1));ag_pill(ctx,l.x+l.w/2,B.y+B.h-40,"about 7 at most",{a:o.count,col:AG.blue,size:30});}
  ctx.restore();}

/* ---------------------------------------------------------------- the map: a paper map of the hills on a table
   The sea at the left and the bottom, the coast, the hills' contours, a few roads. Its marks are drawn live: the fires (cj_fire),
   an agency's own sheet (cj_sheet), engines waiting (cj_token), the agencies' marks (cj_mark). */
const CJ_COAST=[[0,600],[160,640],[340,700],[520,760],[700,800],[880,860],[1060,930],[1220,1000],[1300,1080]];
AG_PLACES.cjMap=c=>{
  // the table: dark oak under the paper, at the frame's edges
  let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,"rgb(118,96,74)");g.addColorStop(1,"rgb(96,78,60)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(5);for(let i=0;i<70;i++){c.fillStyle="rgba(60,44,30,0.12)";c.fillRect(0,R()*H,W,1+R()*2);}
  // the paper, a little skewed, with its shadow
  c.save();c.translate(960,540);c.rotate(-0.012);c.translate(-960,-540);
  c.save();c.shadowColor="rgba(30,22,14,0.45)";c.shadowBlur=40;c.shadowOffsetX=-10;c.shadowOffsetY=16;c.fillStyle="rgb(236,228,206)";c.fillRect(60,40,1800,1000);c.restore();
  c.save();c.beginPath();c.rect(60,40,1800,1000);c.clip();
  // the land, the sea in a pale grey-blue, the coast
  c.fillStyle="rgb(232,222,198)";c.fillRect(60,40,1800,1000);
  const S=cj_smooth(CJ_COAST,8);c.beginPath();c.moveTo(0,H);for(const p of S)c.lineTo(p[0],p[1]);c.lineTo(0,H);c.closePath();c.fillStyle="rgb(200,210,212)";c.fill();
  c.strokeStyle="rgba(90,104,110,0.6)";c.lineWidth=3;c.beginPath();S.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  for(let k=1;k<5;k++){c.strokeStyle="rgba(110,124,130,"+(0.22-k*0.04)+")";c.lineWidth=1.5;c.beginPath();S.forEach((p,i)=>i?c.lineTo(p[0]-k*16,p[1]+k*12):c.moveTo(p[0]-k*16,p[1]+k*12));c.stroke();}
  // the hills' contours: rings round the ranges
  for(const [cx,cy,rx,ry,n,sd] of [[620,300,420,150,6,1],[1300,260,460,170,7,2],[1500,640,300,170,5,3],[860,560,220,90,4,4]])for(let i=0;i<n;i++){const k=1-i/n;
    c.strokeStyle="rgba(150,120,86,"+(0.22+i*0.04)+")";c.lineWidth=1.6;c.beginPath();cj_path(c,cj_blobPts(cx,cy,rx*k,ry*k,sd+i*0.3,0.18,60));c.stroke();}
  // a few roads, and towns as small grey patches
  c.strokeStyle="rgba(150,96,80,0.55)";c.lineWidth=4;for(const r of [[[120,560],[420,520],[760,500],[1100,520],[1500,470],[1860,440]],[[820,880],[900,700],[980,520],[1040,300],[1080,60]],[[1200,980],[1340,760],[1600,600],[1860,560]]]){
    c.beginPath();cj_smooth(r,8).forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}
  for(const [x,y,r] of [[400,600,40],[780,640,60],[1000,760,50],[1230,880,46],[1560,540,36]]){cj_blob(c,x,y,r,r*0.7,x*0.01,0.3,"rgba(150,146,140,0.35)");}
  // the grid, and the paper's soft creases
  c.strokeStyle="rgba(120,110,90,0.18)";c.lineWidth=1.2;for(let x=60;x<1860;x+=150){c.beginPath();c.moveTo(x,40);c.lineTo(x,1040);c.stroke();}for(let y=40;y<1040;y+=150){c.beginPath();c.moveTo(60,y);c.lineTo(1860,y);c.stroke();}
  for(const x of [660,1260]){g=c.createLinearGradient(x-20,0,x+20,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(90,70,50,0.1)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(x-20,40,40,1000);}
  c.restore();
  ag_T(c,"PACIFIC OCEAN",330,930,{w:700,size:30,ls:8,col:[96,110,118],deco:1});
  c.restore();
  cj_light(c,0.6);};
// a fire's mark on the map: a red-orange patch with a darker edge and hatching; o.g how far it has grown (0 to 1), o.a
function cj_fire(ctx,x,y,r,t,o){o=o||{};const a=(o.a==null?1:o.a),g=o.g==null?1:o.g;if(a<=0.01||g<=0.01)return;ctx.save();ctx.globalAlpha*=a;const rr_=r*(0.3+0.7*g);
  const P_=cj_blobPts(x,y,rr_,rr_*0.7,x*0.013+y*0.007,0.32,36);
  ctx.beginPath();cj_path(ctx,P_);ctx.fillStyle=rgba(CJ_FIRE,0.32);ctx.fill();ctx.save();ctx.beginPath();cj_path(ctx,P_);ctx.clip();
  ctx.strokeStyle=rgba(CJ_FIRE,0.45);ctx.lineWidth=2.5;for(let k=-rr_*2;k<rr_*2;k+=12){ctx.beginPath();ctx.moveTo(x+k,y-rr_);ctx.lineTo(x+k+rr_,y+rr_);ctx.stroke();}ctx.restore();
  ctx.strokeStyle=rgba(cj_shade(CJ_FIRE,0.8),0.85);ctx.lineWidth=3;ctx.beginPath();cj_path(ctx,P_);ctx.stroke();ctx.restore();}
// an agency's own sheet of the map, laid on the table: a smaller paper, a mark in its corner, the fires it knows about (rel. to its
// middle), and the time it was drawn (o.when), skewed by o.rot
function cj_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);if(o.k!=null)ctx.scale(lerp(0.85,1,o.k),lerp(0.85,1,o.k));
  ctx.save();ctx.shadowColor="rgba(30,22,14,0.35)";ctx.shadowBlur=24;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=10;ctx.fillStyle="rgb(240,234,214)";ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.strokeStyle="rgba(150,120,86,0.3)";ctx.lineWidth=1.4;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(-w*0.1,-h*0.12,w*0.34*(1-i*0.2),h*0.2*(1-i*0.2),0,0,TAU);ctx.stroke();}
  ctx.strokeStyle="rgba(90,104,110,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w/2,h*0.1);ctx.quadraticCurveTo(-w*0.1,h*0.2,w*0.2,h/2);ctx.stroke();
  for(const f of (o.fires||[]))cj_fire(ctx,f[0]*w,f[1]*h,f[2]*w,0,{g:1});
  cj_mark(ctx,-w/2+44,-h/2+44,24,o.mark||0,{});
  if(o.when)ag_T(ctx,o.when,w/2-24,h/2-24,{w:600,size:28,align:"right",col:AG.mut});
  ctx.restore();}
// engines waiting, as small blocks with their agency's colour, in a row from (x, y)
function cj_token(ctx,x,y,col,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(30,22,14,0.4)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ag_rect(ctx,x-32,y-17,64,34,5);ctx.fill();ctx.restore();ctx.fillStyle="rgba(255,255,255,0.3)";ctx.fillRect(x-27,y-14,54,7);
  ctx.fillStyle="rgba(30,26,22,0.55)";for(const wx of [-18,18]){ctx.beginPath();ctx.arc(x+wx,y+17,6,0,TAU);ctx.fill();}ctx.restore();}
