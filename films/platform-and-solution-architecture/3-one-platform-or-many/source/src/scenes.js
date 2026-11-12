/* ===== One platform, or many: scenes =====
   Ten chapters, as in ../script.md. Japan, 1462: the Yodo River between Kyoto and the sea, every stretch with owners who may set a
   barrier across it and take a toll; 380 barriers on the Yodo alone, it's said, and sixty in eighteen kilometres on the road to Ise;
   a load stopped and paid at every one. Merchants and travellers wait at a barrier on a road; lords clear their own lands, Oda
   Nobunaga among them; from about 1585 Hideyoshi forbids the tolls; under the Tokugawa the five roads run under one set of rules
   through every domain, and in 1635 no lord may keep a barrier of his own; travellers pay for a horse, a porter, a night at an inn.
   Then the utility: two data platforms, bought by two parts of the business years ago, and a third product proposed to join them;
   the three sets of rules side by side; the simplest architecture that does the job; a data mesh as many owners on one platform;
   when a second platform can't be helped, and the shogunate's own checkpoints; generation's platform moving onto the data
   platform; every rule kept once; the data practice on the map; and the road between Kuwana and Hinaga, open.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring; on the map the camera glides, and the map draws its rivers, roads and
   barriers at the frame's own size, so they stay crisp as it moves; between rooms the whole picture dissolves. Sound: every effect
   in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- shared by the chapters ---------- */
// the utility's domains, as An application or a platform? drew them, and generation, whose own platform is the second
const P3_DOM=[["network",APPC,"Grace"],["retail",APPC,"head of retail"],["finance",APPC,"head of finance"],["enterprise",[176,196,255],"Ama"]];
const P3_GEN=["generation",APPC,"head of generation"];
// what every platform brings with it: four sets of rules, each drawn as a band with a glyph
const P3_RULES=["who may see what","masks on private data","lineage","a log of who did what"];
const P3_WAT=[120,152,198],P3_PROD=[198,188,236];
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p3_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p3_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaHorse and psaWalker)
function p3_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}
// a camera that glides between keys [t, x, y, zoom] as focus() does; returns where it is, so words and the map's own lines can be
// laid on the frame at their own size; p3_camAt applies it, p3_scr turns a point of the room into the frame
function p3_cam(t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const dd=keys[i][4]||d,u=easeCam(clamp((t-keys[i][0])/dd,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}return[x,y,z];}
function p3_camAt(ctx,c){ctx.translate(960,540);ctx.scale(c[2],c[2]);ctx.translate(-c[0],-c[1]);}
const p3_scr=(c,x,y)=>[960+(x-c[0])*c[2],540+(y-c[1])*c[2]];
// a light that travels along a path, with a fading trail: a load, a traveller
function p3_runner(ctx,pts,u,col,o){o=o||{};if(u<=0)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// a small pill: a name, or a product; o.dash draws an outline only
function p3_chipW(ctx,name,sz){return 30+tw(ctx,name,sz||28,700);}
function p3_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p3_chipW(ctx,name,sz),h=46,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    else glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,14,18,0.94)"});
    if(name)T(ctx,name,X+w/2,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(o.dash?col:INK,0.96)});});return w;}

/* ---------- what every platform brings with it ---------- */
// the rules' glyphs: a person with a key (who may see what), a value masked (four dots), lineage (three nodes joined), a log
function p3_glyph(ctx,k,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(2,s*0.12);ctx.lineCap="round";ctx.lineJoin="round";
  if(k===0){ctx.beginPath();ctx.arc(x-s*0.3,y-s*0.3,s*0.24,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x-s*0.78,y+s*0.6);ctx.quadraticCurveTo(x-s*0.3,y-s*0.16,x+s*0.18,y+s*0.6);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.arc(x+s*0.5,y-s*0.08,s*0.17,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x+s*0.5,y+s*0.09);ctx.lineTo(x+s*0.5,y+s*0.6);ctx.moveTo(x+s*0.5,y+s*0.4);ctx.lineTo(x+s*0.68,y+s*0.4);ctx.stroke();}
  else if(k===1){for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(x-s*0.63+i*s*0.42,y,s*0.14,0,TAU);ctx.fill();}}
  else if(k===2){const P=[[x-s*0.62,y+s*0.32],[x,y-s*0.32],[x+s*0.62,y+s*0.32]];ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);ctx.lineTo(P[1][0],P[1][1]);ctx.lineTo(P[2][0],P[2][1]);ctx.stroke();P.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],s*0.16,0,TAU);ctx.fill();});}
  else{rr(ctx,x-s*0.46,y-s*0.62,s*0.92,s*1.24,s*0.12);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-s*0.24,y-s*0.28+i*s*0.28);ctx.lineTo(x+s*0.24,y-s*0.28+i*s*0.28);ctx.stroke();}}
  ctx.restore();}
// one set of a platform's rules: a band, its glyph and its name; o.hi lights it
function p3_band(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||TECC,hi=o.hi||0;
  glass(ctx,x,y,w,h,14,col,{glow:8+16*hi,ea:0.75,fill:"rgba(6,14,10,0.95)"});ctx.fillStyle=rgba(col,0.06+0.12*hi);rr(ctx,x,y,w,h,14);ctx.fill();
  p3_glyph(ctx,k,x+40,y+h/2,22,mix(col,INK,0.25));if(o.label!==false)T(ctx,P3_RULES[k],x+78,y+h/2+10,{w:700,size:o.size||28,color:rgba(INK,0.94)});});}
// the four, small, with no words: on a platform in a wide shot. o.p brings them in one by one, o.hi lights them, o.col
function p3_mini(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||TECC,w=o.w||150,h=26;
  for(let k=0;k<4;k++){const q=o.p==null?1:clamp(o.p*4-k,0,1);if(q<=0.01)continue;withA(ctx,q,()=>{const yy=y+k*(h+7);glass(ctx,x,yy,w,h,8,col,{glow:6+14*(o.hi||0),ea:0.7,fill:"rgba(6,14,10,0.95)"});
    ctx.fillStyle=rgba(col,0.08+0.14*(o.hi||0));rr(ctx,x,yy,w,h,8);ctx.fill();p3_glyph(ctx,k,x+20,yy+h/2,10,mix(col,INK,0.2));ctx.fillStyle=rgba(col,0.35);rr(ctx,x+38,yy+h/2-3,w-54,6,3);ctx.fill();});}});}
// a red barrier across a link between two things: a short bar with a post at each end
function p3_rbar(ctx,x,y,len,an,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an||0);ctx.lineCap="round";ctx.shadowColor=rgba(PS_RED,0.8);ctx.shadowBlur=12;ctx.strokeStyle=rgba(PS_RED,1);ctx.lineWidth=7;
  ctx.beginPath();ctx.moveTo(-len/2,0);ctx.lineTo(len/2,0);ctx.stroke();ctx.shadowBlur=0;[-len/2,len/2].forEach(px=>{ctx.fillStyle="rgba(24,16,16,1)";ctx.beginPath();ctx.arc(px,0,7,0,TAU);ctx.fill();ctx.strokeStyle=rgba(PS_RED,1);ctx.lineWidth=2.4;ctx.stroke();});ctx.restore();});}
// a product proposed, not yet bought: a dashed box with its name
function p3_third(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||TECC;ctx.save();ctx.fillStyle="rgba(6,12,12,0.92)";rr(ctx,x,y,w,h,18);ctx.fill();
  ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.setLineDash([12,9]);rr(ctx,x,y,w,h,18);ctx.stroke();ctx.setLineDash([]);ctx.restore();if(o.hi)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.14*o.hi);
  if(name)wrapT(ctx,name,x+w/2,y+(o.top||h/2+10),w-40,{size:o.size||30,w:800,align:"center",color:rgba(INK,0.95),lh:36});});}
// a dashed line that carries a query, drawn up to p
function p3_dline(ctx,x0,y0,x1,y1,col,a,p){if(a<=0.01||p<=0)return;const u=clamp(p,0,1);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,u),lerp(y0,y1,u));ctx.stroke();ctx.setLineDash([]);ctx.restore();});}

/* ---------- the map: the Yodo, the road to Ise, their barriers, and the domains ---------- */
// the Yodo, from Fushimi, below Kyoto, to its mouth on the bay, [longitude, latitude]: a sketch of its course in the 1400s, its mouth
// where the map's coast meets it; and the road to the shrines at Ise, from Kuwana to Hinaga (the eighteen kilometres) and on south
const P3_YODO=[[135.775,34.935],[135.745,34.919],[135.715,34.903],[135.69,34.888],[135.664,34.852],[135.645,34.817],[135.61,34.783],[135.575,34.748],[135.54,34.722],[135.505,34.70],[135.46,34.694],[135.412,34.692]];
const P3_ISE=[[136.693,35.066],[136.664,35.017],[136.623,34.966],[136.598,34.937]],P3_TOISE=[[136.598,34.937],[136.567,34.85],[136.522,34.745],[136.52,34.63],[136.6,34.545],[136.705,34.49]];
const P3_KYOTO=[135.772,35.009];
// the owners of the Yodo's stretches, upstream to the sea, and where each ends (a share of the way)
const P3_OWN=[["the court",0.19],["the shogunate",0.39],["a temple",0.6],["a shrine",0.8],["a lord",1]],P3_OWNC=[[226,196,150],[200,180,230],[170,206,190],[236,176,160],[190,200,150]];
// [longitude, latitude] points to the frame, through the camera c, smoothed; and their lengths, to find a share of the way along them
function p3_spline(P,n){if(P.length<3)return P.slice();const out=[];for(let i=0;i<P.length-1;i++){const a=P[Math.max(0,i-1)],b=P[i],c=P[i+1],d=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const s=k/n,s2=s*s,s3=s2*s,f=j=>0.5*(2*b[j]+(-a[j]+c[j])*s+(2*a[j]-5*b[j]+4*c[j]-d[j])*s2+(-a[j]+3*b[j]-3*c[j]+d[j])*s3);out.push([f(0),f(1)]);}}out.push(P[P.length-1]);return out;}
const p3_on=(P,c,n)=>p3_spline(P.map(([lo,la])=>{const[x,y]=psaJP(lo,la);return p3_scr(c,x,y);}),n||8);
function p3_len(S){const L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));return L;}
function p3_at(S,L,u){const T_=L[L.length-1],d=clamp(u,0,1)*T_;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/((L[i]-L[i-1])||1),a=S[i-1],b=S[i];return[lerp(a[0],b[0],f),lerp(a[1],b[1],f),Math.atan2(b[1]-a[1],b[0]-a[0])];}
// the river, w wide in the frame: a dark bank, the water catching the sky, and its current drifting toward the sea
function p3_river(ctx,S,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||S.length<2)return;withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  const tr=()=>{ctx.beginPath();S.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));};
  tr();ctx.strokeStyle="rgba(12,18,32,0.95)";ctx.lineWidth=w+5;ctx.stroke();
  tr();ctx.shadowColor=rgba(P3_WAT,0.5);ctx.shadowBlur=14;ctx.strokeStyle=rgba(mix(P3_WAT,[26,38,62],0.4),1);ctx.lineWidth=w;ctx.stroke();ctx.shadowBlur=0;
  if(w>7){tr();ctx.strokeStyle=rgba(mix(P3_WAT,[255,255,255],0.5),0.32);ctx.lineWidth=Math.max(1.2,w*0.12);ctx.setLineDash([w*0.9,w*2.6]);ctx.lineDashOffset=-t*w*0.8;ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();});}
// barriers across a path in the frame: n short bars, each across it; o.p shows the first p of them from the path's start, o.k(i, x, y)
// fades each (drawn in five steps of alpha, so hundreds cost a few strokes), len their length
function p3_bars(ctx,S,Ln,n,len,o){o=o||{};const m=Math.floor(n*clamp(o.p==null?1:o.p,0,1)+1e-6);if(m<=0)return;const B=[[],[],[],[],[]];
  for(let i=0;i<m;i++){const u=(i+0.5+(hash(i,o.seed||3)-0.5)*0.5)/n,[x,y,an]=p3_at(S,Ln,u),k=o.k?o.k(i,x,y):1;if(k<=0.01)continue;const nx=-Math.sin(an),ny=Math.cos(an);
    B[Math.min(4,Math.floor(k*4.999))].push([x-nx*len/2,y-ny*len/2,x+nx*len/2,y+ny*len/2]);}
  const A=ctx.globalAlpha*(o.a==null?1:o.a);ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(PS_RED,1);ctx.lineWidth=o.lw||2.6;ctx.shadowColor=rgba(PS_RED,0.7);ctx.shadowBlur=o.glow==null?8:o.glow;
  B.forEach((g,j)=>{if(!g.length)return;ctx.globalAlpha=A*(j+1)/5;ctx.beginPath();g.forEach(([a,b,c,d])=>{ctx.moveTo(a,b);ctx.lineTo(c,d);});ctx.stroke();});ctx.restore();}
// a river boat seen from above: a long hull, its bow downstream, bales of rice along it and a lantern at the stern; o.coins stacks
// what it has paid so far above it
function p3_boat(ctx,x,y,an,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.scale(s,s);
  ctx.beginPath();ctx.moveTo(30,0);ctx.quadraticCurveTo(18,-8.5,-22,-7.5);ctx.lineTo(-27,-5);ctx.lineTo(-27,5);ctx.lineTo(-22,7.5);ctx.quadraticCurveTo(18,8.5,30,0);ctx.closePath();
  ctx.fillStyle="rgba(28,22,20,1)";ctx.fill();ctx.strokeStyle=rgba(PSC,0.8);ctx.lineWidth=1.8/s;ctx.stroke();
  ctx.fillStyle=rgba(mix([132,104,74],PSC,0.3),1);[-12,-2.5,7].forEach(bx=>{ctx.beginPath();ctx.ellipse(bx,0,4.4,5,0,0,TAU);ctx.fill();});
  glow(ctx,-22,0,14,PSC,0.6);ctx.fillStyle="rgb(255,230,176)";ctx.beginPath();ctx.arc(-22,0,2.4,0,TAU);ctx.fill();ctx.restore();
  const n=o.coins||0;for(let i=0;i<n;i++){const cy=y-24*s-i*6*s;ctx.fillStyle=rgba(mix(PSC,[120,80,30],0.35),1);ctx.beginPath();ctx.ellipse(x,cy+2*s,9*s,3.6*s,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(PSC,1);ctx.beginPath();ctx.ellipse(x,cy,9*s,3.6*s,0,0,TAU);ctx.fill();}});}
// one barrier across the river, w wide at (x,y), its flow along an: a post on each bank and a bar between them, which opens (o.open,
// 0..1) by turning about its far post, downstream; and a toll house on the near bank, its lantern lit (o.lit). o.s scales the house
// and the posts, for a close look; the house sits o.side (1 or -1) of the flow
function p3_barrier(ctx,x,y,an,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const s=o.s||1,sd=o.side||1,h=w/2+12*s,op=o.open||0,nx=-Math.sin(an)*sd,ny=Math.cos(an)*sd,hx=x+nx*(h+44*s),hy=y+ny*(h+44*s),lit=o.lit==null?1:o.lit;
  // the toll house, upright on the near bank
  ctx.save();ctx.translate(hx,hy);ctx.scale(s,s);if(lit>0.01)glow(ctx,0,-6,46,PSC,0.4*lit);ctx.fillStyle="rgba(22,18,18,1)";ctx.fillRect(-17,-12,34,24);ctx.beginPath();ctx.moveTo(-24,-10);ctx.lineTo(0,-28);ctx.lineTo(24,-10);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.5*lit),0.9);ctx.lineWidth=1.8;ctx.stroke();ctx.fillStyle=rgba(mix([60,44,34],[255,206,140],lit),1);ctx.fillRect(-6,-2,12,14);ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.rotate(an);
  ctx.save();ctx.translate(0,-h);ctx.rotate(-op*1.4);ctx.strokeStyle=rgba(PS_RED,1);ctx.lineWidth=5*Math.sqrt(s);ctx.lineCap="round";ctx.shadowColor=rgba(PS_RED,0.85);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,2*h);ctx.stroke();ctx.restore();
  [[0,-h],[0,h]].forEach(([px,py])=>{ctx.fillStyle="rgba(26,18,16,1)";ctx.beginPath();ctx.arc(px,py,6.5*Math.sqrt(s),0,TAU);ctx.fill();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=2.2;ctx.stroke();});ctx.restore();});}
// where the toll house of that barrier stands, for the coin a boat pays to fly to
function p3_house(x,y,an,w,s,sd){const h=w/2+12*s,d=h+44*s;sd=sd||1;return[x-Math.sin(an)*sd*d,y+Math.cos(an)*sd*d];}
// the domains of the 1600s: a patchwork of cells over the land, each a little different, clipped to the coast (as An application or
// a platform? drew them); o.hi(i, j) lights a cell
function p3_domains(ctx,v,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.clip(psaLandPath(v));
  const g=0.42,cell=(i,j)=>{const lon=134.2+i*g+(hash(i*31+j,5)-0.5)*g*0.5,lat=33.4+j*g+(hash(i*17+j,6)-0.5)*g*0.5;return[lon,lat];};
  for(let i=0;i<18;i++)for(let j=0;j<12;j++){const P=[cell(i,j),cell(i+1,j),cell(i+1,j+1),cell(i,j+1)].map(p=>psaJP(p[0],p[1],v)),k=hash(i*7+j*13,9),h_=o.hi?o.hi(i,j):0;
    ctx.beginPath();P.forEach(([x,y],n)=>n?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=rgba(mix(mix([90,100,140],[170,130,90],k),[230,214,170],h_*0.5),0.08+0.08*hash(i,j+40)+0.16*h_);ctx.fill();
    ctx.strokeStyle="rgba(200,190,170,"+(0.22+0.3*h_)+")";ctx.lineWidth=1.2/Math.sqrt(Math.abs(ctx.getTransform().a));ctx.setLineDash([5,6]);ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();});}
// the land for the close looks at the Yodo and the road to Ise: the series' coast with its corners rounded off (twice, as Chaikin
// does), so the camera finds a shore and not the piers of today's ports; drawn as psaLand draws it, with the same light and texture
const P3_LP={};
function p3_landPath(){if(P3_LP.p)return P3_LP.p;const p=new Path2D();PSA_COAST.forEach(r=>{let P=r.map(q=>psaJP(q[0],q[1]));
  for(let k=0;k<2;k++){const Q=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];Q.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25],[a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75]);}P=Q;}
  P.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();});return P3_LP.p=p;}
function p3_land(ctx,o){o=o||{};const lit=o.lit||0,fill=mix([30,36,54],[60,52,44],lit),edge=mix([150,172,210],[236,206,160],lit),P=p3_landPath(),z=Math.sqrt(Math.abs(ctx.getTransform().a));
  ctx.save();ctx.fillStyle=rgba(fill,1);ctx.fill(P);ctx.shadowColor=rgba(edge,0.55);ctx.shadowBlur=16;ctx.strokeStyle=rgba(edge,0.7);ctx.lineWidth=2.2/z;ctx.lineJoin="round";ctx.stroke(P);ctx.restore();
  ctx.save();ctx.clip(P);for(let i=0;i<60;i++){const lon=131+hash(i,61)*10.5,lat=32+hash(i,62)*8.5,[x,y]=psaJP(lon,lat),r=30+hash(i,63)*90,g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,rgba(mix([62,72,70],[100,88,70],lit),0.16+0.1*hash(i,64)));g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}ctx.restore();}
// the river's width in the frame at zoom z: a thread on the whole country, a band once the camera is close, and wider still in the
// barrier's close-up, so a boat fits on it
const p3_rw=z=>z<=5.2?clamp(2+5.4*(z-1),3,28):24.7+(z-5.2)*2.6;

/* ---------- the road, seen from its side ---------- */
function p3_road(ctx,S,t){psaDusk(ctx,S,{d:1,y0:760});[[80,0.95,1],[700,1.05,2],[1680,1.1,4],[1880,0.9,5]].forEach(([x,s,k])=>psaPine(ctx,x,762,s,k,{rim:PSC}));}
// a barrier on a road, seen from the front as the station is: two posts, a beam across their tops and a bar between them that stops
// everyone; a toll house beside it with its lantern. o.bar (0..1) lifts the bar away, o.down (0..1) takes the posts down, o.lit
function p3_gate(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  // the toll house
  ctx.save();ctx.translate(300,0);if(lit>0.01)glow(ctx,0,-90,170,PSC,0.22*lit);ctx.fillStyle="rgba(20,16,18,1)";ctx.fillRect(-110,-118,220,118);
  ctx.beginPath();ctx.moveTo(-140,-110);ctx.quadraticCurveTo(-70,-118,-56,-158);ctx.lineTo(56,-158);ctx.quadraticCurveTo(70,-118,140,-110);ctx.lineTo(140,-100);ctx.lineTo(-140,-100);ctx.closePath();ctx.fillStyle="rgba(12,10,14,1)";ctx.fill();
  ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.4*lit),0.8);ctx.lineWidth=2.4;ctx.stroke();const g=ctx.createLinearGradient(0,-88,0,-8);g.addColorStop(0,rgba(mix([40,30,28],[255,190,120],lit*0.85),0.95));g.addColorStop(1,rgba(mix([24,18,18],[140,90,60],lit*0.85),0.95));ctx.fillStyle=g;ctx.fillRect(-80,-88,110,80);
  ctx.fillStyle="rgba(16,12,12,1)";ctx.fillRect(84,-96,6,96);if(lit>0.01)glow(ctx,87,-110,40,PSC,0.6*lit);ctx.fillStyle=rgba(mix([80,60,40],[255,214,150],lit),1);rr(ctx,74,-128,26,36,8);ctx.fill();ctx.restore();
  // the posts and the one beam across their tops (a plain gate, not a shrine's), which fall outward as they're taken down: the beam
  // goes first, lifted off, then the posts
  const dn=clamp(o.down||0,0,1),fa=1-clamp((dn-0.55)/0.45,0,1),bm=clamp(dn*4,0,1);if(fa>0.01)withA(ctx,fa,()=>{[-1,1].forEach(sd=>{ctx.save();ctx.translate(sd*120,0);ctx.rotate(sd*ease(dn)*1.25);ctx.fillStyle="rgba(26,20,18,1)";ctx.fillRect(-11,-262,22,262);
      ctx.strokeStyle=rgba(PSC,0.35);ctx.lineWidth=1.6;ctx.strokeRect(-11,-262,22,262);ctx.restore();});
    if(bm<0.99)withA(ctx,1-bm,()=>{ctx.save();ctx.translate(0,-ease(bm)*40);ctx.fillStyle="rgba(18,14,14,1)";rr(ctx,-146,-284,292,24,4);ctx.fill();ctx.strokeStyle=rgba(PSC,0.4);ctx.lineWidth=1.6;rr(ctx,-146,-284,292,24,4);ctx.stroke();ctx.restore();});});
  // the bar, across the way between the posts: red, the barrier's own colour; lifted up and away
  const br=clamp(o.bar||0,0,1);if(br<0.99)withA(ctx,1-br,()=>{ctx.save();ctx.translate(0,-104-ease(br)*70);ctx.shadowColor=rgba(PS_RED,0.7);ctx.shadowBlur=16;ctx.fillStyle="rgba(46,20,18,1)";rr(ctx,-118,-9,236,18,6);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=rgba(PS_RED,1);ctx.lineWidth=3;rr(ctx,-118,-9,236,18,6);ctx.stroke();ctx.restore();});
  ctx.restore();});}
// an inn: two floors, lit paper screens upstairs behind a rail, the open front below with a cloth over its door, and two lanterns
function p3_inn(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  if(lit>0.01)glow(ctx,0,-160,300,PSC,0.2*lit);
  ctx.fillStyle="rgba(20,16,18,1)";ctx.fillRect(-230,-140,460,140);ctx.fillRect(-200,-276,400,128);
  const roof=(y,w,dh)=>{ctx.beginPath();ctx.moveTo(-w,y);ctx.quadraticCurveTo(-w*0.55,y-6,-w*0.44,y-dh);ctx.lineTo(w*0.44,y-dh);ctx.quadraticCurveTo(w*0.55,y-6,w,y);ctx.lineTo(w,y+10);ctx.lineTo(-w,y+10);ctx.closePath();ctx.fillStyle="rgba(12,10,14,1)";ctx.fill();
    ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.4*lit),0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-w,y);ctx.quadraticCurveTo(-w*0.55,y-6,-w*0.44,y-dh);ctx.lineTo(w*0.44,y-dh);ctx.quadraticCurveTo(w*0.55,y-6,w,y);ctx.stroke();};
  for(let i=0;i<4;i++){const bx=-184+i*92,g=ctx.createLinearGradient(0,-262,0,-180);g.addColorStop(0,rgba(mix([40,30,28],[255,200,140],lit*0.85),0.95));g.addColorStop(1,rgba(mix([24,18,18],[150,96,64],lit*0.85),0.95));ctx.fillStyle=g;ctx.fillRect(bx,-262,80,82);
    ctx.strokeStyle="rgba(14,10,12,0.85)";ctx.lineWidth=2.4;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(bx+k*20,-262);ctx.lineTo(bx+k*20,-180);ctx.stroke();}ctx.beginPath();ctx.moveTo(bx,-221);ctx.lineTo(bx+80,-221);ctx.stroke();}
  ctx.fillStyle="rgba(14,10,12,1)";ctx.fillRect(-212,-180,424,8);for(let i=0;i<15;i++)ctx.fillRect(-208+i*29.5,-172,5,24);
  roof(-150,272,40);roof(-286,244,52);
  [[-206,-118,180,118,0.8],[-6,-118,196,118,0.95]].forEach(([bx,by,bw,bh,k])=>{const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,rgba(mix([40,30,28],[255,190,120],lit*k),0.95));g.addColorStop(1,rgba(mix([24,18,18],[140,90,60],lit*k),0.95));ctx.fillStyle=g;ctx.fillRect(bx,by,bw,bh);});
  ctx.fillStyle="rgba(34,24,26,1)";for(let i=0;i<3;i++)ctx.fillRect(-2+i*64,-118,60,44);
  [[-222,-128],[222,-128]].forEach(([lx,ly])=>{ctx.fillStyle="rgba(16,12,12,1)";ctx.fillRect(lx-2,ly-26,4,26);if(lit>0.01)glow(ctx,lx,ly+16,40,PSC,0.55*lit);ctx.fillStyle=rgba(mix([80,60,40],[255,214,150],lit),1);rr(ctx,lx-12,ly,24,34,8);ctx.fill();});
  ctx.restore();});}

/* ---------- 1. A toll at every barrier ---------- */
// where the map's camera looks, in the map's own units: the whole country; Kyoto, the Yodo and the bay; the river from Fushimi to the
// sea, filling the frame; between the river and the road to Ise; and the road from Kuwana to Hinaga. The barrier's close-up is found
// on the river itself.
const P3_J=[960,540,1.0],P3_KY=[350,800,4.6],P3_YD=[381,790,8.0],P3_MID=[520,760,4.0],P3_IS=[663,721,12];
scene("tolls",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tO=c("owners"),tBa=c("barrier"),tC=c("count"),tH=c("harm"),tN=c("need"),tL=c("lords"),tD=c("down"),tR=c("rules"),tK=c("kept"),tBe=c("better"),tRa=c("ravi"),tW=c("wrong"),tOn=c("one");
  // which room: the map (the river, its barriers, and later the whole country), the road at dusk (a barrier; then a station), then the
  // utility; under the title, the last room leaves whole, so no word of it shows under the title's
  const outA=1-fin(t,B+0.9,0.7),r1=fin(t,tN-0.7,0.9)*(1-fin(t,tD-0.8,0.9)),r2=fin(t,tBe-0.7,0.9)*(1-fin(t,tRa-0.7,0.9)),uA0=fin(t,tRa-0.7,0.9);
  const rdA=Math.max(r1,r2)*outA,uA=uA0*outA,mA=Math.max(0,1-r1-r2-uA0)*outA,second=t>tN;if(outA<1)p3_base(ctx,S);
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:second?0.25:0.15});
    // the camera: the country, the Yodo by Kyoto, one barrier close, the count, the road to Ise, the Yodo again; later the country
    const u0=0.47,YB=(()=>{const P=p3_on(P3_YODO,P3_J,8),L=p3_len(P),[x,y]=p3_at(P,L,u0);return[x,y];})(),tRd=w("count","On the road");
    const CK=second?[[0,960,540,1.04],[tR-0.4,960,520,1.0,2.4]]:[[0,...P3_J],[0.9,...P3_KY,2.8],[tO-0.5,...P3_YD,2.0],[tBa-0.5,YB[0],YB[1],22,2.2],
      [tC-0.4,...P3_YD,2.0],[tRd-0.6,...P3_MID,1.4],[tRd+0.4,...P3_IS,1.8],[tH-0.6,...P3_MID,1.4],[tH+0.3,...P3_YD,1.8]];
    const cam=p3_cam(t,CK,2.0),z=cam[2];ctx.save();p3_camAt(ctx,cam);
    if(!second)p3_land(ctx,{lit:0.12});else psaMap(ctx,PSA_VIEW,t,{lit:0.12,roads:second?clamp((t-tR+0.2)/2.6,0,1):0,tkd:second?clamp((t-tR+0.2)/2.0,0,1):0,st:second?fin(t,tR+1.0,1.6):0,ends:second?fin(t,tR,0.8):0,names:false,
      lit_:i=>0.3+(second?0.5*fin(t,w("kept","shared")-0.2,0.8):0)});
    if(second)p3_domains(ctx,PSA_VIEW,fin(t,tR+0.4,1.4),{hi:(i,j)=>{const ph=(t-w("kept","own lord")+0.4)*1.4-(i+j)*0.12;return ph>0&&ph<1?Math.sin(ph*Math.PI)*0.7:0;}});
    ctx.restore();
    /* the map's own lines and words, at the frame's size */
    const Y=p3_on(P3_YODO,cam,8),YL=p3_len(Y),rw=p3_rw(z),[kx,ky]=p3_scr(cam,...psaJP(P3_KYOTO[0],P3_KYOTO[1]));
    if(!second){
      p3_river(ctx,Y,rw,t,{a:fin(t,0.8,1.4)});const kyA=1-fin(t,w("count","On the road")-0.7,0.4);psaStop(ctx,kx,ky,{a:fin(t,1.2,0.8)*kyA,lit:1,r:8});psaName(ctx,"Kyoto",kx+20,ky-16,{a:fin(t,w("year","Kyoto")-0.3,0.6)*kyA,size:32});
      const[sx,sy]=p3_scr(cam,...psaJP(135.3,34.62));psaName(ctx,"the sea",sx,sy,{a:fin(t,w("year","the sea")-0.3,0.6)*(1-fin(t,tO-0.6,0.4)),size:30,align:"center",color:rgba(SOFT,1)});
      const[yx,yy]=p3_at(Y,YL,0.5);psaName(ctx,"the Yodo",yx+34,yy+16,{a:fin(t,w("year","Yodo")-0.3,0.6)*(1-fin(t,tO-0.6,0.4)),size:32,color:rgba(mix(P3_WAT,INK,0.5),1)});
      // boats on the river, as lights: both ways, until the owners are named
      const bA=fin(t,w("year","Boats")-0.3,0.8)*(1-fin(t,tO-0.3,0.6));if(bA>0.01)withA(ctx,bA,()=>{for(let i=0;i<4;i++){const u=(t*0.035+i*0.25)%1;p3_runner(ctx,i%2?Y.slice().reverse():Y,u,PSC,{r:4,trail:0.05});}});
      // every stretch has its owners: each bank's stretch in its own tint, and its owner named beside it
      const oA=fin(t,w("owners","owners")-0.4,0.8)*(1-fin(t,tC-0.6,0.6));if(oA>0.01)withA(ctx,oA,()=>{let u_=0;P3_OWN.forEach(([nm,u1],i)=>{const q=fin(t,w("owners",["the court","the shogunate","temples","shrines","lords"][i])-0.3,0.5);
        if(q>0.01)withA(ctx,q,()=>{const seg=[];for(let k=0;k<=12;k++){const[x,y,an]=p3_at(Y,YL,lerp(u_+0.008,u1-0.008,k/12)),off=rw/2+7;seg.push([x-Math.sin(an)*off,y+Math.cos(an)*off]);}
          ctx.save();ctx.strokeStyle=rgba(P3_OWNC[i],0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();seg.forEach(([x,y],k)=>k?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
          const[mx,my,an]=p3_at(Y,YL,(u_+u1)/2),off=rw/2+30,lx=mx+Math.sin(an)*off,ly=my-Math.cos(an)*off;psaName(ctx,nm,lx,ly,{a:1-clamp((ly-800)/50,0,1),size:30,align:"right",color:rgba(mix(P3_OWNC[i],INK,0.35),1)});});u_=u1;});});
      // one barrier, close: a boat comes down, stops, pays, and the bar opens for it; the house and the boat drawn to the river's width
      const bq=fin(t,w("barrier","barrier")-0.3,0.6)*(1-fin(t,tC-0.3,0.8));if(bq>0.01)withA(ctx,bq,()=>{const[x,y,an]=p3_at(Y,YL,u0),s=rw/28,tb=w("barrier","barrier"),tArr=w("barrier","everyone")+0.5,tPay=w("barrier","pays")-0.1,tOp=tPay+0.7;
        const op=clamp((t-tOp)/0.6,0,1)*(1-clamp((t-tOp-2.8)/0.6,0,1));p3_barrier(ctx,x,y,an,rw,{open:op,s});
        const uS=u0-0.03,uB=t<tArr?lerp(u0-0.22,uS,easeCam(clamp((t-tb+0.8)/(tArr-tb+0.8),0,1))):t<tOp+0.4?uS:uS+(u0+0.22-uS)*ease(clamp((t-tOp-0.4)/3.0,0,1)),[bx,by,ba]=p3_at(Y,YL,uB);p3_boat(ctx,bx,by,ba,0.85*s,{});
        const cp=clamp((t-tPay)/0.6,0,1);if(cp>0&&cp<1){const[hx,hy]=p3_house(x,y,an,rw,s),px=lerp(bx,hx,cp),py=lerp(by,hy,cp)-Math.sin(cp*Math.PI)*60;glow(ctx,px,py,20,PSC,0.7);ctx.fillStyle=rgba(PSC,1);ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();}
        withA(ctx,fin(t,tPay-0.2,0.5),()=>tag(ctx,960,190,"everyone who passes pays a toll",PS_RED,{align:"center",size:30}));});
      // the count: 380 on the Yodo, as fine as hatching, then sixty in eighteen kilometres on the road to Ise; they stay while a load
      // comes down the river
      const yA=fin(t,tC-0.2,0.5)*(1-fin(t,tN-0.5,0.5)),tY=w("count","Yodo alone")-0.2;if(yA>0.01)p3_bars(ctx,Y,YL,380,rw+12,{a:yA,p:clamp((t-tY)/2.4,0,1),lw:1.3,glow:3});
      const iA=fin(t,tRd-0.4,0.8)*(1-fin(t,tN-0.5,0.5));if(iA>0.01)withA(ctx,iA,()=>{const I=p3_on(P3_ISE,cam,8),IL=p3_len(I),TI=p3_on(P3_TOISE,cam,8);
        psaPath(ctx,I,1,{col:PSC,lw:4,glow:10,a:0.9});psaPath(ctx,TI,1,{col:PSC,lw:3,glow:6,a:0.5,dash:[8,8]});
        p3_bars(ctx,I,IL,60,26,{p:clamp((t-w("count","sixty")+0.3)/1.6,0,1),lw:2.4,seed:7});
        const[kx2,ky2]=I[0],[hx2,hy2]=I[I.length-1];psaStop(ctx,kx2,ky2,{lit:1,r:7});psaStop(ctx,hx2,hy2,{lit:1,r:7});psaName(ctx,"Kuwana",kx2+22,ky2+10,{size:32});psaName(ctx,"Hinaga",hx2+24,hy2+12,{size:32});
        // on toward Ise: named where its dashed road leaves the picture, above the captions
        const k_=TI.findIndex(p=>p[1]>820),[ex,ey]=TI[k_>0?k_:TI.length-1];psaName(ctx,"to Ise",ex+26,Math.min(ey,820)+8,{a:(1-clamp((z-6)/2,0,1))*clamp((1790-ex)/90,0,1),size:30,color:rgba(SOFT,1)});
        // the eighteen kilometres, bracketed beside the road
        const eA=fin(t,w("count","eighteen")-0.3,0.6);if(eA>0.01)withA(ctx,eA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(kx2-34,ky2);ctx.lineTo(kx2-50,ky2);ctx.lineTo(hx2-50,hy2);ctx.lineTo(hx2-34,hy2);ctx.stroke();ctx.restore();
          tag(ctx,Math.min(kx2,hx2)-64,(ky2+hy2)/2,"18 km",SOFT,{align:"right",size:30});});});
      withA(ctx,fin(t,w("count","three hundred")-0.2,0.5)*(1-fin(t,tRd-0.4,0.4)),()=>tag(ctx,960,190,"380 barriers on the Yodo alone, it's said",PS_RED,{align:"center",size:30}));
      withA(ctx,fin(t,w("count","sixty")-0.2,0.5)*(1-fin(t,tH-0.6,0.4)),()=>tag(ctx,960,190,"on the road to Ise: 60 in 18 km",PS_RED,{align:"center",size:30}));
      // a load stops and pays at every one: it comes down the river by fits and starts, and what it has paid piles up above it, a coin
      // as it stops at each
      const hA=fin(t,tH+0.2,0.6)*(1-fin(t,tN-0.5,0.5));if(hA>0.01)withA(ctx,hA,()=>{const tt=t-tH-0.9,step=Math.max(0,Math.floor(tt/0.46)),f=clamp((tt-step*0.46)/0.2,0,1),uu=clamp((step+ease(f))*0.03,0,0.98);
        const[bx,by,ba]=p3_at(Y,YL,uu);p3_boat(ctx,bx,by,ba,1.5,{coins:Math.min(12,step+(f>=1?1:0))});
        withA(ctx,fin(t,w("harm","stopped")-0.2,0.5),()=>tag(ctx,960,190,"stopped, and paid, at every one",PS_RED,{align:"center",size:30}));
        withA(ctx,fin(t,w("harm","late")-0.2,0.5),()=>tag(ctx,960,252,"late, and dearer",AMBER,{align:"center",size:30}));});
      eaYear(ctx,80,80,"Japan · 1462",CLAY,fin(t,0.5,0.8)*(1-fin(t,tN-0.9,0.5)));}
    else{
      // the whole country, from about 1585: barriers on its roads and rivers come down, west to east; then the five roads, under one
      // set of rules, through every domain
      const dA=1-fin(t,tR+1.2,0.8),sw=(t-w("down","forbade")+0.2)/3.2;if(dA>0.01)withA(ctx,dA,()=>{const k=(i,x,y)=>1-clamp(sw*2.2-(x-200)/900,0,1);
        p3_bars(ctx,Y,YL,24,9,{lw:2.2,glow:5,k});const I=p3_on(P3_ISE.concat(P3_TOISE.slice(1)),cam,6);p3_bars(ctx,I,p3_len(I),10,9,{lw:2.2,glow:5,k,seed:9});
        PSA_ROADS.concat([["Tōkaidō",PSA_TKD.map(s_=>[s_[1],s_[2]])]]).forEach(([nm,pts],r)=>{const P=p3_on(pts,cam,4),PL=p3_len(P);p3_bars(ctx,P,PL,Math.round(PL[PL.length-1]/26),9,{lw:2.2,glow:5,k,seed:11+r});});});
      withA(ctx,fin(t,w("down","Toyotomi")-0.3,0.6)*(1-fin(t,tR-0.5,0.5)),()=>tag(ctx,960,190,"Toyotomi Hideyoshi forbids the tolls",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,w("rules","one set")-0.3,0.6)*(1-fin(t,w("rules","sixteen")-0.5,0.4)),()=>tag(ctx,960,190,"the five roads: one set of rules, through every domain",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,w("rules","forbidden")-0.3,0.6)*(1-fin(t,tK-0.5,0.4)),()=>tag(ctx,960,190,"no lord may keep a barrier of his own",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,w("kept","own lord")-0.3,0.6),()=>tag(ctx,960,190,"each domain: its own lord, laws and taxes",[230,214,170],{align:"center",size:30}));
      withA(ctx,fin(t,w("kept","shared")-0.3,0.6),()=>tag(ctx,960,252,"the road: what they shared",PSC,{align:"center",size:30}));
      eaYear(ctx,80,80,t<w("rules","sixteen")-0.4?"about 1585":"1635",CLAY,fin(t,tD-0.2,0.8)*(1-fin(t,w("rules","sixteen")-0.9,0.4))+fin(t,w("rules","sixteen")-0.3,0.5)*(1-fin(t,tBe-0.9,0.5)));}}],
  /* the road at dusk: travellers wait at a barrier; lords clear it; later, a station and an inn, and travellers who pay for what they use */
  [rdA,ctx=>{const lt=t>tBe-1;p3_road(ctx,S,t);ctx.save();drift(ctx,lt?t-tBe+0.7:t-tN+0.7,{dur:16},{z:0.022,y:640});
    if(!lt){const tCl=w("lords","clearing")-0.2,bar=clamp((t-tCl)/0.9,0,1),dn=clamp((t-tCl-0.5)/1.2,0,1);
      p3_gate(ctx,1240,762,1.0,{bar,down:dn,lit:1-0.7*dn});psaWalker(ctx,1590,772,0.92,t,{kind:"spear",dir:-1,still:true,ph:0.2});
      // the queue: a porter, a horse with its driver, a merchant and a pilgrim, waiting; once the barrier is down, they walk on
      const tGo=tCl+1.3,Q=[["porter",1040,0.96,0.2],["horse",870,0.62,0.4],["walker",720,0.94,0.6],["walker",560,0.94,0.1],["pilgrim",420,0.92,0.8]];
      Q.forEach(([k,x,s,ph],i)=>{const v=k==="horse"?psaPace("horse",s,0.6):psaPace("walker",s,0.55),[d,amp]=p3_go(t,tGo+i*0.25,tGo+40,v);
        if(k==="horse")psaHorse(ctx,x+d,792,s,t,{dir:1,ph,rate:0.6,amp,still:amp<=0,pack:true});else psaWalker(ctx,x+d,790,s,t,{kind:k,dir:1,ph,rate:0.55,amp,still:amp<=0});});
      withA(ctx,fin(t,tN-0.2,0.6)*(1-fin(t,w("need","needed")-0.5,0.4)),()=>tag(ctx,960,250,"waiting, and paying, at every barrier",AMBER,{align:"center",size:30}));
      withA(ctx,fin(t,w("need","needed")-0.1,0.6)*(1-fin(t,tL-0.4,0.4)),()=>tag(ctx,960,250,"what they needed: a road, not a toll for every owner",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,w("lords","Oda")-0.3,0.6),()=>tag(ctx,960,250,"lords clear their own lands: Oda Nobunaga among them",PSC,{align:"center",size:30}));}
    else{p3_inn(ctx,470,762,0.86,{lit:1});psaStation(ctx,1360,762,1.0,{lit:1});
      // a traveller takes a horse from the station; a porter carries a load; pilgrims walk to the inn
      const vH=psaPace("horse",0.62,0.6),[dH,aH]=p3_go(t,w("better","a horse")-0.4,tRa,vH);psaWalker(ctx,1180-dH,790,0.94,t,{kind:"walker",dir:-1,ph:0.3,rate:0.55*vH/psaPace("walker",0.94,0.55),amp:aH,still:aH<=0});psaHorse(ctx,1290-dH,792,0.62,t,{dir:-1,ph:0.1,rate:0.6,amp:aH,still:aH<=0,pack:true});
      const vP=psaPace("walker",0.96,0.55),[dP,aP]=p3_go(t,w("better","a porter")-0.4,tRa,vP);psaWalker(ctx,1560-dP,788,0.96,t,{kind:"porter",dir:-1,ph:0.6,amp:aP,still:aP<=0});
      const vG=psaPace("walker",0.92,0.5),[dG,aG]=p3_go(t,tBe-0.7,w("better","night")+0.6,vG);[[0,0.1],[-96,0.6]].forEach(([o_,ph])=>psaWalker(ctx,-60+o_+dG,790,0.92,t,{kind:"pilgrim",dir:1,ph,rate:0.5,amp:aG,still:aG<=0}));
      // each name goes with the one it names, as they walk; the porter's above the station's roof
      withA(ctx,fin(t,w("better","a horse")-0.2,0.5),()=>tag(ctx,1250-dH,440,"a horse",PSC,{align:"center",size:30}));withA(ctx,fin(t,w("better","a porter")-0.2,0.5),()=>tag(ctx,1560-dP,496,"a porter",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,w("better","night")-0.2,0.5),()=>tag(ctx,470,440,"a night at an inn",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,w("better","two million")-0.3,0.6),()=>tag(ctx,960,250,"more than two million pilgrims went to Ise",PSC,{align:"center",size:30}));}
    ctx.restore();
    if(lt)eaYear(ctx,80,80,"1771",CLAY,fin(t,w("better","seventeen")-0.3,0.6));else eaYear(ctx,80,80,"the 1500s",CLAY,fin(t,tL-0.2,0.6));}],
  /* the utility: two platforms and a third product proposed to join them, each with its own rules; then one platform */
  [uA,ctx=>{const u=t-tRa+0.7;p3_room(ctx,S,t);ctx.save();drift(ctx,u,{dur:24},{z:0.02,y:540,x:1150});
    person(ctx,"ravi",230,1030,0.8,{t});withA(ctx,fin(t,w("ravi","Ravi")-0.2,0.6),()=>tag(ctx,270,520,"Ravi Menon · platform lead",TECH,{align:"center",size:30}));
    const tOne=w("one","one platform"),one=clamp((t-tOne+0.2)/1.6,0,1),e1=easeCam(one),pA=fin(t,w("ravi","two data platforms")-0.3,0.8),thA=fin(t,w("ravi","third product")-0.3,0.6)*(1-fin(t,tOne,0.6));
    // the data platform grows to take every domain; generation's and the third product leave
    const LW=lerp(600,1320,e1),gA=pA*(1-clamp(one*1.6,0,1));
    psaPlatform(ctx,470,600,LW,80,{a:pA,label:"the data platform",hi:pulseAt(t,B+0.2,2.4)*0.8});
    psaPlatform(ctx,1230,600,560,80,{a:gA,label:"generation's platform"});
    p3_third(ctx,930,250,380,104,"a third product",{a:thA});
    p3_dline(ctx,1000,354,820,600,TECC,thA,1);p3_dline(ctx,1240,354,1440,600,TECC,thA,1);
    // its barriers: where the third product would join each platform, a bar across each link
    const rb=fin(t,w("ravi","join")-0.1,0.5)*(1-fin(t,tOne,0.6));p3_rbar(ctx,910,477,64,Math.atan2(246,-180)+Math.PI/2,rb);p3_rbar(ctx,1340,477,64,Math.atan2(246,200)+Math.PI/2,rb);
    // each brings its own rules: three sets, kept three times; the data platform's set is the one that stays
    const wA=fin(t,w("wrong","permissions")-0.3,0.6),hiW=pulseAt(t,w("wrong","three times"),1.6);
    p3_mini(ctx,500,430,{a:wA,p:clamp((t-w("wrong","permissions")+0.3)/1.2,0,1),hi:hiW+pulseAt(t,w("one","kept once"),1.6)});p3_mini(ctx,1330,236,{a:wA*thA,p:clamp((t-w("wrong","policies")+0.3)/1.2,0,1),hi:hiW});
    p3_mini(ctx,1610,430,{a:wA*gA,p:clamp((t-w("wrong","logs")+0.3)/1.2,0,1),hi:hiW});
    withA(ctx,fin(t,w("wrong","three times")-0.3,0.5)*(1-fin(t,tOne-0.3,0.4)),()=>tag(ctx,1130,170,"every rule kept three times",PS_RED,{align:"center",size:30}));
    // one platform: every domain's block on it, and one set of rules
    if(one>0.01)P3_DOM.concat([P3_GEN]).forEach(([nm,col],i)=>psaBlock(ctx,690+i*218,482,196,110,nm,{col,t,size:28,drop:clamp((t-w("one","every domain")+0.2-i*0.12)/0.9,0,1),cog:false,hi:pulseAt(t,w("one","owns")+i*0.1,1.2)*0.8}));
    withA(ctx,fin(t,w("one","owns")-0.3,0.5)*(1-fin(t,w("one","kept once")-0.5,0.4)),()=>tag(ctx,1130,170,"every domain owns its data on it",APPC,{align:"center",size:30}));
    withA(ctx,fin(t,w("one","kept once")-0.1,0.5),()=>tag(ctx,1130,170,"one platform · every rule kept once",PSC,{align:"center",size:30}));
    ctx.restore();}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"One platform, or many","and the rules every platform brings","Film 3 of 8 · platform and solution architecture");});

/* ---------- 2. Two platforms, and a third ---------- */
// where the two platforms sit, from Two platforms to Generation moves: the data platform, with every other domain, and generation's
const P3_LX=140,P3_LW=960,P3_RX=1210,P3_RW=570,P3_PY=620,P3_BX=i=>P3_LX+60+i*226,P3_GX=P3_RX+170;
// the blocks' height, tall enough that a domain's name clears its owner's pill, and where their tops are (the back edge, P3_PY-158)
const P3_BH=134,P3_BY=P3_PY-8-P3_BH;
// the two platforms and their domains' blocks. Every block keeps room for its owner, but only Ama's and generation's are named here
// (o.own, per block, and o.gown): the film follows those two. Generation's block is as wide as its owner's pill needs, centred where
// it always is (P3_GX+118). o.drop and o.gb bring the blocks in, o.lw widens the data platform
function p3_two(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const pa=o.p==null?1:o.p,own=o.own||[0,0,0,1];
  psaPlatform(ctx,P3_LX,P3_PY,o.lw||P3_LW,80,{a:pa,label:"the data platform",hi:o.lhi||0});psaPlatform(ctx,P3_RX,P3_PY,P3_RW,80,{a:pa*(o.gen==null?1:o.gen),label:"generation's platform",hi:o.ghi||0});
  P3_DOM.forEach(([nm,col,ow],i)=>psaBlock(ctx,P3_BX(i),P3_BY,196,P3_BH,nm,{col,t,size:28,owner:ow,ownerA:own[i],drop:o.drop==null?null:clamp(o.drop*4-i*0.5,0,1),cog:false,hi:(o.bhi||[])[i]||0}));
  const gq=o.gb==null?1:o.gb,gw=Math.max(236,tw(ctx,P3_GEN[2],28,700)+64+20);if(gq>0.01)psaBlock(ctx,P3_GX+118-gw/2,P3_BY,gw,P3_BH,P3_GEN[0],{col:P3_GEN[1],t,size:28,owner:P3_GEN[2],ownerA:o.gown==null?1:o.gown,drop:o.gb==null?null:clamp(gq,0,1),cog:false,hi:o.gbhi||0});});}
scene("two",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tWh=c("which"),tNe=c("need"),tTh=c("third"),tTi=c("ticket");ctx.save();drift(ctx,t,sc,{z:0.012,y:560});
  const pA=fin(t,w("bought","bought")-0.3,0.8),dp=clamp((t-w("which","every other")+0.4)/1.8,0,1),tTp=w("third","third product");
  p3_two(ctx,t,{p:pA,drop:dp,gb:clamp((t-w("which","generation's")+0.2)/0.9,0,1),own:[0,0,0,fin(t,w("need","enterprise")-0.2,0.6)],gown:fin(t,w("which","generation's")+0.6,0.8),bhi:[0,0,0,pulseAt(t,w("need","enterprise"),1.6)],gbhi:pulseAt(t,w("which","hydro"),1.6)});
  withA(ctx,pA*(1-fin(t,w("which","generation's")-0.3,0.4)),()=>{tag(ctx,P3_LX+480,P3_PY+180,"bought years ago",SOFT,{align:"center",size:28});tag(ctx,P3_RX+285,P3_PY+180,"bought years ago, from another vendor",SOFT,{align:"center",size:28});});
  withA(ctx,fin(t,w("which","hydro")-0.2,0.5),()=>p3_chip(ctx,P3_GX+118,P3_PY+180,"readings: hydro and wind farms",{align:"center",col:APPC}));
  // the measure the enterprise domain needs, from both: customers' use by the hour, and what the farms make; its links leave as the
  // third product comes in with its own
  const mA=fin(t,w("need","one measure")-0.3,0.6)*(1-fin(t,tTi-0.5,0.4)),mL=1-fin(t,tTp-0.5,0.5);if(mA>0.01)withA(ctx,mA,()=>{arrive(ctx,520,230,t,w("need","one measure")-0.2,()=>psaCard(ctx,140,150,760,"a measure · the enterprise domain",["Green-tariff use, hour by hour,","met by the utility's own farms"],[176,196,255],{size:30}),{dy:-10});
    p3_dline(ctx,400,298,P3_BX(0)+200,P3_BY-16,[176,196,255],fin(t,w("need","share")-0.2,0.4)*mL,clamp((t-w("need","share"))/0.8,0,1));
    p3_dline(ctx,820,298,P3_GX+118,P3_BY-16,[176,196,255],fin(t,w("need","own farms")-0.2,0.4)*mL,clamp((t-w("need","own farms"))/0.8,0,1));});
  // the analysts' third product, to join the two: it queries both where they are
  const thA=fin(t,tTp-0.3,0.6)*(1-fin(t,tTi-0.4,0.5));if(thA>0.01)withA(ctx,thA,()=>{p3_third(ctx,960,300,460,110,"a third product, to join them",{size:30,top:66});
    psaArrow(ctx,1080,410,P3_BX(2)+110,P3_BY-24,TECC,fin(t,w("third","query both"),0.4),clamp((t-w("third","query both"))/0.7,0,1),{dash:[8,8],lw:2.4});psaArrow(ctx,1300,410,P3_GX+100,P3_BY-24,TECC,fin(t,w("third","query both"),0.4),clamp((t-w("third","query both")-0.2)/0.7,0,1),{dash:[8,8],lw:2.4});
    withA(ctx,fin(t,w("third","nothing")-0.2,0.5),()=>tag(ctx,1190,250,"nothing would have to move",TECC,{align:"center",size:30}));});
  // Ama's ticket, where the measure was, and the question for Ravi
  const tkA=fin(t,tTi-0.1,0.6);if(tkA>0.01)withA(ctx,tkA,()=>{arrive(ctx,520,240,t,tTi-0.1,()=>psaCard(ctx,140,150,760,"ticket · raised by Ama, enterprise domain",["Green-tariff use, hour by hour,","met by our own farms"],BIZ,{size:30,foot:"open",footCol:SOFT}),{dy:-10});
    withA(ctx,fin(t,w("ticket","Ravi")-0.2,0.5),()=>tag(ctx,1340,250,"to Ravi: how should it be built?",TECH,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Three sets of rules ---------- */
// three columns side by side: the data platform, the third product between, generation's platform; each with its four sets of rules
const P3_CX=[90,700,1310],P3_CW=520,P3_CY0=262,P3_CH=92,P3_CG=16,P3_CYk=k=>P3_CY0+k*(P3_CH+P3_CG);
const P3_COLS=["the data platform","the third product","generation's platform"];
function p3_cols(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const show=o.show||[1,1,1],bands=o.bands||[[1,1,1,1],[1,1,1,1],[1,1,1,1]],hi=o.hi||[0,0,0,0];
  P3_CX.forEach((x,ci)=>{const q=show[ci];if(q<=0.01)return;withA(ctx,q,()=>{const mid=ci===1;
    T(ctx,P3_COLS[ci],x+P3_CW/2,214,{w:800,size:32,align:"center",color:rgba(mix(TECC,INK,mid?0.2:0.45),1)});
    ctx.save();ctx.strokeStyle=rgba(TECC,mid?0.8:0.4);ctx.lineWidth=mid?2.4:1.8;if(mid)ctx.setLineDash([12,9]);rr(ctx,x-14,236,P3_CW+28,P3_CYk(4)+4-236,20);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    for(let k=0;k<4;k++){const b=bands[ci][k];if(b>0.01)p3_band(ctx,x,P3_CYk(k),P3_CW,P3_CH,k,{a:b,hi:hi[k]*(o.hiCol?o.hiCol[ci]:1)});}});});});}
scene("layers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tE=c("each"),tT=c("third"),tM=c("mask"),tG=c("grant"),tTo=c("toll");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  const sh=[fin(t,w("side","draws")-0.2,0.6),fin(t,tT-0.3,0.6),fin(t,w("side","draws")+0.2,0.6)];
  const kw=["who's who","masks","lineage","log"],bE=kw.map(k_=>fin(t,w("each",k_)-0.3,0.5)),bT=[0,1,2,3].map(k=>fin(t,w("third","set")-0.4+k*0.18,0.5));
  const hiM=fin(t,tM-0.2,0.5)*(1-fin(t,tG-0.4,0.5)),hiG=fin(t,tG-0.2,0.5)*(1-fin(t,w("grant","lineage")-0.4,0.4)),hiL=fin(t,w("grant","lineage")-0.2,0.5)*(1-fin(t,tTo-0.3,0.5));
  p3_cols(ctx,t,{show:sh,bands:[bE,bT,bE],hi:[hiG,hiM,hiL,0],hiCol:[1,1,1]});
  // masks: customers' meter readings, masked on the data platform, masked again in the third product, its own way; checked in both
  const bx=ci=>P3_CX[ci]+P3_CW-60,by=k=>P3_CYk(k)+P3_CH/2;
  if(hiM>0.01)withA(ctx,hiM,()=>{[[0,w("mask","masked on")],[1,w("mask","masked again")]].forEach(([ci,t0])=>{const q=fin(t,t0-0.2,0.5);if(q>0.01)withA(ctx,q,()=>{glass(ctx,bx(ci)-34,by(1)-24,80,48,24,APPC,{glow:10,ea:0.7,fill:"rgba(8,12,22,0.95)"});p3_glyph(ctx,1,bx(ci)+6,by(1),16,APPC);});
      const k=fin(t,w("mask","checked")-0.1+ci*0.3,0.4);if(k>0.01)tick_(ctx,bx(ci)+34,by(1)-36,16,PS_OK,k);});
    withA(ctx,fin(t,w("mask","meter readings")-0.3,0.5),()=>tag(ctx,960,150,"customers' meter readings: masked twice, two ways",AMBER,{align:"center",size:30}));});
  // an analyst's rights, granted in three places, three ways
  if(hiG>0.01)withA(ctx,hiG,()=>{[0,1,2].forEach(ci=>{const k=fin(t,w("grant","granted")-0.1+ci*0.35,0.4);if(k>0.01){p3_glyph(ctx,0,bx(ci)+4,by(0),17,APPC);tick_(ctx,bx(ci)+38,by(0)-30,16,PS_OK,k);}});
    withA(ctx,fin(t,w("grant","rights")-0.3,0.5),()=>tag(ctx,960,150,"an analyst's rights: three places, three ways",AMBER,{align:"center",size:30}));});
  // the measure's lineage, from generation's readings to the measure, stopping at every border
  if(hiL>0.01)withA(ctx,hiL,()=>{const y=by(2)+30,L=fin(t,w("grant","lineage"),1.6);ctx.save();ctx.strokeStyle=rgba(APPC,0.95);ctx.lineWidth=3;ctx.lineCap="round";
    [[P3_CX[2]+P3_CW-30,P3_CX[2]+10],[P3_CX[1]+P3_CW-10,P3_CX[1]+10],[P3_CX[0]+P3_CW-10,P3_CX[0]+30]].forEach(([x0,x1],i)=>{const q=clamp(L*3-i,0,1);if(q<=0)return;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,q),y);ctx.stroke();});ctx.restore();
    [P3_CX[1]+P3_CW+45,P3_CX[0]+P3_CW+45].forEach((x,i)=>{const k=fin(t,w("grant","every border")-0.2+i*0.3,0.4);if(k>0.01)kt_rcross(ctx,x,y,14,k);});
    withA(ctx,fin(t,w("grant","lineage"),0.5),()=>tag(ctx,960,150,"the measure's lineage stops at every border",AMBER,{align:"center",size:30}));});
  // every platform a barrier with its own toll
  const rA=fin(t,w("toll","barrier")-0.3,0.5);if(rA>0.01){[P3_CX[1]-38,P3_CX[2]-38].forEach((x,i)=>p3_rbar(ctx,x+4,(P3_CYk(0)+P3_CYk(4))/2-8,P3_CYk(4)-P3_CYk(0)-30,Math.PI/2,fin(t,w("toll","barrier")-0.3+i*0.2,0.5)));
    withA(ctx,rA,()=>tag(ctx,960,150,"every platform: a barrier with its own toll",PS_RED,{align:"center",size:30}));
    withA(ctx,fin(t,w("toll","rules kept")-0.3,0.5),()=>tag(ctx,960,820,"paid in rules kept again, and kept in step",PS_RED,{align:"center",size:30}));}
  ctx.restore();vign(ctx,S);});

/* ---------- 4. As simple as it can be ---------- */
// complexity nobody manages: many small parts, each joined to others, and one that fails
const P3_TANG=[[200,420],[380,380],[560,450],[720,400],[260,560],[450,600],[640,560],[300,720],[520,740],[700,700]];
const P3_TL=[[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,6],[4,5],[5,6],[4,7],[5,8],[6,9],[7,8],[8,9],[0,5],[2,5],[3,9],[1,6],[4,8]];
function p3_tangle(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const p=o.p==null?1:o.p,f=o.fail||0;ctx.save();ctx.strokeStyle=rgba([170,180,200],0.45);ctx.lineWidth=1.8;
  P3_TL.forEach(([i,j],n)=>{const q=clamp(p*P3_TL.length*1.2-n,0,1);if(q<=0)return;const[x0,y0]=P3_TANG[i],[x1,y1]=P3_TANG[j];ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,q),lerp(y0,y1,q));ctx.stroke();});ctx.restore();
  P3_TANG.forEach(([x,y],i)=>{const q=clamp(p*10-i*0.7,0,1);if(q<=0.01)return;const bad=i===5?f:0;withA(ctx,q,()=>{glass(ctx,x-46,y-26,92,52,12,mix([170,180,200],PS_RED,bad),{glow:6+20*bad,ea:0.7,fill:"rgba(10,12,18,0.95)"});
    ctx.fillStyle=rgba(mix([170,180,200],PS_RED,bad),0.5);rr(ctx,x-28,y-4,56,8,4);ctx.fill();});});});}
scene("simple",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tM=c("most"),tF=c("few"),tE=c("easier");ctx.save();drift(ctx,t,sc,{z:0.012,y:540});
  // Ravi's rule, on a card
  arrive(ctx,960,170,t,w("rule","one rule")-0.3,()=>ruleCard(ctx,500,100,920,"The simplest architecture that does the job.",{kicker:"Ravi's rule",col:PSC,size:34,hi:pulseAt(t,w("rule","simplest"),1.6)}),{dy:-12});
  // complexity nobody manages, and a service that fails; then, for only a few, a platform and a team in each country
  const tgA=fin(t,w("rule","Complexity")-0.3,0.6)*(1-fin(t,tF-0.5,0.6));p3_tangle(ctx,t,{a:tgA,p:clamp((t-w("rule","Complexity")+0.3)/1.6,0,1),fail:fin(t,w("rule","fail")-0.2,0.4)});
  withA(ctx,tgA*fin(t,w("rule","fail")-0.2,0.5),()=>tag(ctx,460,820,"complexity nobody manages: services fail",PS_RED,{align:"center",size:30}));
  // most organisations: few components, on one platform
  const mA=fin(t,tM-0.3,0.6);if(mA>0.01)withA(ctx,mA,()=>{psaPlatform(ctx,1050,640,760,80,{label:"one platform",hi:pulseAt(t,w("most","one platform"),1.6)*0.6,caps:["store","process","serve"],cp:clamp((t-w("most","few components")+0.2)/0.9,0,1)});
    P3_DOM.slice(0,3).forEach(([nm,col],i)=>psaBlock(ctx,1150+i*220,470,180,100,nm,{col,t,size:28,cog:false,drop:clamp((t-tM+0.1-i*0.15)/0.9,0,1)}));
    withA(ctx,fin(t,w("most","most organisations")-0.2,0.5),()=>tag(ctx,1430,820,"for most: few components, one platform",PSC,{align:"center",size:30}));});
  // only a few: a group across many countries, a platform and a team in each, the platforms joined
  const fA=fin(t,tF-0.1,0.6);if(fA>0.01)withA(ctx,fA,()=>{const X=[240,480,720];
    ctx.save();ctx.strokeStyle=rgba(TECC,0.55);ctx.lineWidth=2.2;ctx.setLineDash([6,7]);ctx.beginPath();ctx.moveTo(X[0]+70,560);ctx.lineTo(X[1]-90,560);ctx.moveTo(X[1]+70,560);ctx.lineTo(X[2]-90,560);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    X.forEach((x,i)=>{const q=fin(t,tF+i*0.25,0.5);if(q<=0.01)return;withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=1.8;ctx.setLineDash([6,8]);rr(ctx,x-112,420,224,300,48);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      psaPlatform(ctx,x-90,530,180,44,{fh:26});for(let k=0;k<3;k++){const px=x-36+k*36,py=680;ctx.fillStyle=rgba(TECH,0.85);ctx.beginPath();ctx.arc(px,py-30,10,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(px-15,py);ctx.quadraticCurveTo(px,py-30,px+15,py);ctx.closePath();ctx.fill();}});});
    withA(ctx,fin(t,w("few","only a few")-0.2,0.5),()=>tag(ctx,480,820,"only a few: a group across many countries",SOFT,{align:"center",size:30}));});
  // moving to one is easier than it was
  const eA=fin(t,tE-0.3,0.6);if(eA>0.01)withA(ctx,eA,()=>{p3_chip(ctx,1060,330,"open formats",{a:fin(t,w("easier","open formats")-0.2,0.5),col:TECC});p3_chip(ctx,1290,330,"tools that convert most of the code",{a:fin(t,w("easier","tools")-0.2,0.5),col:TECC});
    withA(ctx,fin(t,w("easier","months")-0.3,0.5),()=>tag(ctx,1430,410,"moving to one: months, not years",PS_OK,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Many owners, one platform ---------- */
// one self-serve platform, wide enough that every domain's block is as wide as its owner's pill needs; the blocks tall enough that a
// domain's name clears that pill, whose middle is at P3_MO
const P3_MX=110,P3_MW=1700,P3_MY=640,P3_MH=136,P3_MO=P3_MY-42;
const P3_ALL=P3_DOM.concat([P3_GEN]);
// where each domain's block stands: [x, its width, its owner's pill's width], spread evenly along the platform's back edge
function p3_mlay(ctx){const pw=P3_ALL.map(([,,own])=>tw(ctx,own,28,700)+64),W_=pw.map(p=>Math.max(236,p+20)),sum=W_.reduce((s_,v)=>s_+v,0),x0=P3_MX+40,x1=P3_MX+P3_MW-36,g=(x1-x0-sum)/(W_.length-1);
  let x=x0;return W_.map((v,i)=>{const r=[x,v,pw[i]];x+=v+g;return r;});}
scene("mesh",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tM=c("mesh"),tO=c("one"),tS=c("simplest"),tB=c("badly");ctx.save();drift(ctx,t,sc,{z:0.012,y:560});
  const bad=fin(t,w("badly","old teams")-0.2,0.8),hiP=pulseAt(t,w("mesh","self-serve"),1.6)+pulseAt(t,w("one","one platform"),1.8)*0.8,L=p3_mlay(ctx);
  psaPlatform(ctx,P3_MX,P3_MY,P3_MW,80,{label:"one platform, self-serve",hi:hiP*0.7});
  // done badly, the owners go: where each was, an empty place and a cross
  P3_ALL.forEach(([nm,col,own],i)=>{const[x,bw]=L[i],cx=x+bw/2;psaBlock(ctx,x,P3_MY-8-P3_MH,bw,P3_MH,nm,{col,t,size:30,owner:own,ownerA:fin(t,w("owners","one team")-0.1+i*0.15,0.5)*(1-bad),cog:false,drop:clamp((t-0.4-i*0.15)/0.9,0,1),
    hi:pulseAt(t,w("mesh","as products"),1.4)*0.8,ownerHi:pulseAt(t,w("mesh","owns its data"),1.4)+pulseAt(t,w("one","spread out"),1.4)});
    const q=fin(t,w("badly","nobody")-0.3+i*0.12,0.5);if(q>0.01)withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.setLineDash([6,6]);rr(ctx,cx-75,P3_MO-20,150,40,20);ctx.stroke();ctx.setLineDash([]);ctx.restore();kt_rcross(ctx,cx,P3_MO,12,1);});});
  // under rules the domains agree together: a line from each owner to the next, between their pills, never across their names
  const rA=fin(t,w("mesh","rules the domains")-0.3,0.6)*(1-bad);if(rA>0.01)withA(ctx,rA,()=>{ctx.save();ctx.strokeStyle=rgba([240,200,110],0.8);ctx.lineWidth=2.4;ctx.setLineDash([6,7]);ctx.beginPath();
    for(let i=0;i<L.length-1;i++){const[xa,wa,pa]=L[i],[xb,wb,pb]=L[i+1];ctx.moveTo(xa+wa/2+pa/2+6,P3_MO);ctx.lineTo(xb+wb/2-pb/2-6,P3_MO);}ctx.stroke();ctx.setLineDash([]);ctx.restore();
    p3_chip(ctx,960,P3_MY+176,"rules the domains agree together",{align:"center",col:[240,200,110]});});
  withA(ctx,fin(t,w("owners","one team")-0.3,0.5)*(1-fin(t,tM-0.5,0.4)),()=>tag(ctx,960,250,"one platform, not one team owning everything",PSC,{align:"center",size:30}));
  withA(ctx,fin(t,Math.max(tM-0.1,w("mesh","data mesh")-0.3),0.5)*(1-fin(t,tO-0.5,0.4)),()=>{tag(ctx,960,250,"a data mesh, as Zhamak Dehghani set it out",APPC,{align:"center",size:30});
    ["each domain owns its data","as products","on a self-serve platform"].forEach((s_,i)=>withA(ctx,fin(t,w("mesh",["owns its data","as products","self-serve"][i])-0.2,0.4),()=>T(ctx,s_,480+i*480,340,{w:700,size:30,align:"center",color:rgba(i===2?mix(TECC,INK,0.3):mix(APPC,INK,0.3),1)})));});
  withA(ctx,fin(t,tO-0.1,0.5)*(1-fin(t,tS-0.5,0.4)),()=>tag(ctx,960,250,"ownership spread out; the platform shared",PSC,{align:"center",size:30}));
  withA(ctx,fin(t,tS-0.1,0.5)*(1-fin(t,tB-0.5,0.4)),()=>tag(ctx,960,250,"often the simplest architecture: one platform, many owners",PS_OK,{align:"center",size:30}));
  withA(ctx,fin(t,tB-0.1,0.5),()=>tag(ctx,960,250,"done badly: the old teams, with new names",PS_RED,{align:"center",size:30}));
  withA(ctx,fin(t,w("badly","nobody")-0.2,0.5),()=>tag(ctx,960,P3_MY+176,"nobody in the business owns anything",PS_RED,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. When two can't be helped ---------- */
const P3_CASES=[["a company just bought","until it moves"],["a separate legal entity","its data kept apart"],["data that must stay","in its own country"]];
scene("unavoid",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tCa=c("cases"),tFo=c("formats"),tFi=c("find"),tSt=c("stays"),tCh=c("checks"),tRe=c("reason"),uA=1-fin(t,tCh-0.7,0.9),mA=fin(t,tCh-0.7,0.9);
  psaRooms(ctx,[[uA,ctx=>{p3_room(ctx,S,t);ctx.save();drift(ctx,t,{dur:tCh+1},{z:0.012,y:560});
    psaPlatform(ctx,150,560,760,80,{label:"the data platform",a:fin(t,0.2,0.6)});psaPlatform(ctx,1060,560,710,80,{label:"a second platform",a:fin(t,0.6,0.6),hi:pulseAt(t,w("stays","second set"),1.6)*0.6});
    withA(ctx,fin(t,w("sometimes","a while")-0.2,0.5)*(1-fin(t,tCa-0.3,0.4)),()=>tag(ctx,960,250,"for a while, or for good",SOFT,{align:"center",size:30}));
    // the cases: an acquisition, a separate legal entity, data that must stay in its country
    P3_CASES.forEach((L,i)=>{const t0=w("cases",["company","legal entity","Data that"][i])-0.3,q=fin(t,t0,0.5)*(1-fin(t,tFo-0.4,0.5));if(q>0.01)arrive(ctx,380+i*580,260,t,t0,()=>psaCard(ctx,130+i*580,170,500,"when two can't be helped",L,[230,214,170],{size:30,a:q}),{dy:-10});});
    // open table formats: both read the same files; a catalogue that federates the other's
    const fA=fin(t,tFo-0.3,0.6);if(fA>0.01)withA(ctx,fA,()=>{glass(ctx,150,770,1620,74,16,TECC,{glow:8,ea:0.6,fill:"rgba(6,12,12,0.95)"});T(ctx,"the same files, in an open table format",190,818,{w:700,size:28,color:rgba(mix(TECC,INK,0.35),1)});
      for(let i=0;i<7;i++){const x=1050+i*100;ctx.save();ctx.strokeStyle=rgba(TECC,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,786);ctx.lineTo(x+40,786);ctx.lineTo(x+52,798);ctx.lineTo(x+52,830);ctx.lineTo(x,830);ctx.closePath();ctx.stroke();ctx.restore();}
      psaArrow(ctx,530,708,530,766,TECC,fin(t,w("formats","same files")-0.2,0.4),clamp((t-w("formats","same files"))/0.6,0,1),{lw:2.4});psaArrow(ctx,1415,708,1415,766,TECC,fin(t,w("formats","same files")-0.2,0.4),clamp((t-w("formats","same files")-0.2)/0.6,0,1),{lw:2.4});});
    const gA=fin(t,tFi-0.3,0.6);if(gA>0.01)withA(ctx,gA,()=>{arrive(ctx,960,300,t,tFi-0.2,()=>psaCard(ctx,560,200,800,"one catalogue",["the data platform's tables","and the second's, federated"],TECC,{size:30}),{dy:-10});
      p3_dline(ctx,760,402,530,556,TECC,1,clamp((t-tFi)/0.8,0,1));p3_dline(ctx,1160,402,1415,556,TECC,1,clamp((t-tFi-0.2)/0.8,0,1));
      withA(ctx,fin(t,w("find","one place")-0.2,0.5)*(1-fin(t,tSt-0.3,0.4)),()=>tag(ctx,960,130,"everything found in one place",TECC,{align:"center",size:30}));});
    // but the second set of rules stays
    const sA=fin(t,tSt-0.3,0.6);if(sA>0.01){p3_mini(ctx,200,400,{a:sA,p:clamp((t-tSt+0.3)/1.0,0,1),w:180});p3_mini(ctx,1110,400,{a:sA,p:clamp((t-w("stays","policies")+0.3)/1.0,0,1),w:180,hi:pulseAt(t,w("stays","second set"),1.6)});
      withA(ctx,fin(t,w("stays","second set")-0.3,0.5),()=>tag(ctx,960,130,"the second set of rules stays",PS_RED,{align:"center",size:30}));}
    ctx.restore();}],
  /* the shogunate's own barriers: checkpoints on the five roads, there to keep order */
  [mA,ctx=>{psaSea(ctx,S,{dusk:0.2});const cam=p3_cam(t,[[0,1000,560,1.0],[tCh,1020,545,1.06,6]],2);ctx.save();p3_camAt(ctx,cam);psaMap(ctx,PSA_VIEW,t,{lit:0.3,roads:1,st:1,ends:1,names:false,lit_:()=>0.3});p3_domains(ctx,PSA_VIEW,0.8);ctx.restore();
    // three of them, as the sources name them: Hakone and Arai on the Tōkaidō, Usui on the Nakasendō
    [["Hakone",139.026,35.191,1],["Arai",137.562,34.692,-1],["Usui",138.735,36.343,1]].forEach(([nm,lo,la,sd],i)=>{const[x,y]=p3_scr(cam,...psaJP(lo,la)),q=fin(t,w("checks","checkpoints")-0.2+i*0.25,0.5);if(q<=0.01)return;
      withA(ctx,q,()=>{glow(ctx,x,y,40,AMBER,0.45);ctx.fillStyle=rgba(AMBER,1);rr(ctx,x-8,y-8,16,16,3);ctx.fill();ctx.strokeStyle="rgba(10,8,8,0.9)";ctx.lineWidth=2;rr(ctx,x-8,y-8,16,16,3);ctx.stroke();psaName(ctx,nm,x+sd*22,y+(sd>0?-14:30),{size:30,align:sd>0?"left":"right"});});});
    // the two take turns at the top, clear of the checkpoints' names
    withA(ctx,fin(t,w("checks","about fifty")-0.3,0.6)*(1-fin(t,tRe-0.4,0.4)),()=>tag(ctx,960,170,"about 50 checkpoints, to keep order and check who passed",AMBER,{align:"center",size:30}));
    withA(ctx,fin(t,tRe-0.1,0.5),()=>tag(ctx,960,170,"a second platform: only for a reason you can name",PSC,{align:"center",size:30}));
    eaYear(ctx,80,80,"the 1600s",CLAY,fin(t,tCh-0.2,0.6));}]]);
  vign(ctx,S);});

/* ---------- 7. Generation moves ---------- */
// the utility's own cloud storage, under both platforms, and generation's tables in it, as files
function p3_store(ctx,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,140,790,1640,68,16,TECC,{glow:8,ea:0.6,fill:"rgba(6,12,12,0.95)"});T(ctx,"the utility's cloud storage",180,834,{w:700,size:28,color:rgba(mix(TECC,INK,0.35),1)});
  for(let i=0;i<6;i++){const x=1240+i*84,hi=o.hi||0;ctx.save();ctx.strokeStyle=rgba(mix(TECC,PSC,hi),0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,803);ctx.lineTo(x+36,803);ctx.lineTo(x+48,815);ctx.lineTo(x+48,845);ctx.lineTo(x,845);ctx.closePath();ctx.stroke();ctx.restore();}});}
scene("move",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tK=c("keeps"),tF=c("files"),tB=c("bridge"),tC=c("code"),tO=c("off");ctx.save();drift(ctx,t,sc,{z:0.01,y:560});
  // after four months the old platform is switched off, and the data platform carries generation's products: they stay where they are
  const off=clamp((t-w("off","switched off")+0.2)/1.6,0,1),ext=easeCam(clamp((t-w("off","switched off")+0.6)/1.8,0,1));
  p3_two(ctx,t,{lw:lerp(P3_LW,P3_RX+P3_RW-P3_LX,ext),gen:1-off,ghi:pulseAt(t,w("none","no such reason"),1.6)*0.8,gbhi:pulseAt(t,w("keeps","keeps"),1.6)});
  withA(ctx,fin(t,w("none","no such reason")-0.2,0.5)*(1-fin(t,tK-0.3,0.4)),()=>tag(ctx,P3_RX+285,400,"a reason to keep it? none",AMBER,{align:"center",size:30}));
  withA(ctx,fin(t,w("keeps","same people")-0.2,0.5)*(1-fin(t,tF-0.3,0.4)),()=>tag(ctx,960,250,"the same people, the same logic, the same owner",APPC,{align:"center",size:30}));
  // its tables are files, in an open format, in the utility's own storage: their data needn't be copied
  p3_store(ctx,fin(t,tF-0.3,0.6),{hi:pulseAt(t,w("files","open format"),1.4)});
  withA(ctx,fin(t,w("files","copied")-0.3,0.5)*(1-fin(t,tB-0.3,0.4)),()=>tag(ctx,960,250,"open format, in its own storage: nothing to copy",TECC,{align:"center",size:30}));
  // until the move is done, the catalogue federates generation's, so Ama's measure can start at once
  // on each platform's front face, where its services are written: its catalogue, the data platform's federating generation's
  const bA=fin(t,tB-0.2,0.6)*(1-off),fy=P3_PY+80+32;if(bA>0.01)withA(ctx,bA,()=>{p3_chip(ctx,P3_LX+P3_LW-60,fy,"catalogue",{align:"right",col:TECC,hi:pulseAt(t,w("bridge","federates"),1.4)});p3_chip(ctx,P3_RX+20,fy,"its catalogue",{col:TECC});
    p3_dline(ctx,P3_LX+P3_LW-60,fy,P3_RX+20,fy,TECC,1,clamp((t-w("bridge","federates")+0.1)/0.8,0,1));});
  const mA=fin(t,w("bridge","Ama's measure")-0.2,0.6);if(mA>0.01)withA(ctx,mA,()=>{arrive(ctx,520,230,t,w("bridge","Ama's measure")-0.1,()=>psaCard(ctx,140,150,760,"Ama's measure · started",["Green-tariff use, hour by hour,","met by our own farms"],[176,196,255],{size:30}),{dy:-10});});
  // a tool converts most of the jobs' code; the data team reviews each pull request; every number compared for a month
  // the pull request's card leaves before the reports' card takes its place, so their words never show at once
  const cA=fin(t,tC-0.3,0.6)*(1-fin(t,tO-0.7,0.4));if(cA>0.01)withA(ctx,cA,()=>{
    arrive(ctx,1400,250,t,tC-0.2,()=>psaCard(ctx,1020,150,760,"pull request · converted by a tool",["generation's jobs, on the data platform"],TECH,{size:28,foot:"reviewed by the data team",footA:fin(t,w("code","reviews")-0.2,0.5),footTick:fin(t,w("code","reviews"),0.5),footCol:TECH}),{dy:-10});
    withA(ctx,fin(t,w("code","compares")-0.2,0.5),()=>tag(ctx,1400,370,"every number, old and new, compared for a month",PS_OK,{align:"center",size:28}));});
  // generation checks its reports in test; the old platform is switched off
  const oA=fin(t,tO-0.3,0.6);if(oA>0.01)withA(ctx,oA,()=>{arrive(ctx,1400,250,t,tO-0.3,()=>psaCard(ctx,1020,150,760,"generation's reports",["in test, against the old platform's"],APPC,{size:28,foot:"checked by generation",footA:fin(t,w("off","in test")-0.1,0.5),footTick:fin(t,w("off","in test")+0.2,0.4),footCol:PS_OK}),{dy:-10});
    withA(ctx,fin(t,w("off","four months")-0.2,0.5),()=>tag(ctx,P3_RX+285,400,"after four months: switched off",SOFT,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Every rule, once ---------- */
// the green share, hour by hour, over one day: the measure, once built (the numbers are invented)
const P3_HR=[0.42,0.4,0.38,0.37,0.36,0.38,0.44,0.52,0.6,0.68,0.74,0.79,0.82,0.83,0.8,0.74,0.66,0.58,0.5,0.47,0.46,0.45,0.44,0.43];
// one set of rules, written on a platform's front face as its services are: the four glyphs and their name; o.k lights one of them
function p3_face(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let k=0;k<4;k++){const gx=x+24+k*50,hi=(o.hi||0)+(o.k===k?o.khi||0:0);if(hi>0.01)glow(ctx,gx,y,34,TECC,0.35*Math.min(1,hi));p3_glyph(ctx,k,gx,y,14,mix(TECC,INK,0.3+0.4*Math.min(1,hi)));}
  T(ctx,o.label||"one set of rules",x+226,y+10,{w:700,size:28,color:rgba(mix(TECC,INK,0.4+0.3*Math.min(1,o.hi||0)),1)});});}
scene("once",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tM=c("measure"),tC=c("cost");ctx.save();drift(ctx,t,sc,{z:0.01,y:560});
  // one platform: every domain on it, generation's products where they were, and one set of rules on its face
  const ko=w("once","kept once"),tRi=w("once","rights");
  p3_two(ctx,t,{lw:P3_RX+P3_RW-P3_LX,gen:0,lhi:pulseAt(t,ko,1.6)*0.5});
  p3_face(ctx,P3_LX+40,P3_PY+80+32,{a:fin(t,ko-0.4,0.6),hi:pulseAt(t,ko,1.6),k:0,khi:fin(t,tRi-0.2,0.5)*(1-fin(t,tM-0.5,0.4))});
  // the mask holds everywhere, on every domain's data; an analyst's rights granted in one place
  const mk=fin(t,w("once","mask")-0.2,0.5)*(1-fin(t,tM-0.5,0.4));if(mk>0.01)withA(ctx,mk,()=>{[0,1,2,3,4].forEach(i=>{const x=i<4?P3_BX(i)+150:P3_GX+190,q=fin(t,w("once","mask")+i*0.1,0.4);if(q<=0.01)return;withA(ctx,q,()=>{glass(ctx,x-30,P3_BY-40,70,40,20,APPC,{glow:8,ea:0.7,fill:"rgba(8,12,22,0.95)"});p3_glyph(ctx,1,x+5,P3_BY-20,13,APPC);});});
    tag(ctx,960,250,"the mask on meter readings holds everywhere",PS_OK,{align:"center",size:30});});
  const gr=fin(t,tRi-0.2,0.5)*(1-fin(t,tM-0.5,0.4));if(gr>0.01)withA(ctx,gr,()=>{tick_(ctx,P3_LX+64,P3_PY+80+6,16,PS_OK,fin(t,tRi,0.4));tag(ctx,960,320,"an analyst's rights: granted in one place",PS_OK,{align:"center",size:30});});
  // Ama's measure, built once, its lineage from each farm's readings to the number; it gives way to the cost
  const mA=fin(t,tM-0.1,0.6)*(1-fin(t,tC-0.5,0.4));if(mA>0.01)withA(ctx,mA,()=>{const X=560,Y=150,Wc=800,Hc=300;glass(ctx,X,Y,Wc,Hc,18,[176,196,255],{glow:12,ea:0.85,fill:"rgba(6,9,20,0.96)"});
    T(ctx,"green share, hour by hour",X+28,Y+50,{w:800,size:32});T(ctx,"one day · own farms' share of green-tariff use",X+28,Y+90,{w:600,size:28,color:rgba(SOFT,1)});
    const n=clamp((t-tM)/1.6,0,1)*24;for(let i=0;i<24;i++){const q=clamp(n-i,0,1);if(q<=0)continue;const bh=P3_HR[i]*150*q;ctx.fillStyle=rgba([176,196,255],0.75);rr(ctx,X+34+i*31,Y+Hc-24-bh,22,bh,4);ctx.fill();}
    const lg=fin(t,w("measure","lineage")-0.2,0.6),tl=w("measure","lineage");if(lg>0.01){p3_dline(ctx,P3_GX+118,P3_BY-16,X+Wc-60,Y+Hc,[176,196,255],lg,clamp((t-tl)/0.9,0,1));p3_dline(ctx,P3_BX(0)+98,P3_BY-16,X+60,Y+Hc,[176,196,255],lg,clamp((t-tl-0.2)/0.9,0,1));
      withA(ctx,lg,()=>tag(ctx,X+Wc/2,96,"its lineage: from each farm's readings to the number",APPC,{align:"center",size:28}));}});
  // one platform to pay for, not two, and no third; the two who kept generation's platform running now build its products
  const cA=fin(t,tC-0.1,0.6);if(cA>0.01)withA(ctx,cA,()=>{tag(ctx,900,210,"one platform to pay for, not two",PS_OK,{align:"center",size:30});withA(ctx,fin(t,w("cost","no third")-0.2,0.5),()=>{p3_third(ctx,1240,172,280,76,"a third product",{size:28});kt_rcross(ctx,1516,182,16,1);});
    const pp=fin(t,w("cost","two people")-0.2,0.6);if(pp>0.01)withA(ctx,pp,()=>{for(let k=0;k<2;k++){const px=P3_GX+90+k*56,py=P3_BY-34;ctx.fillStyle=rgba(TECH,0.9);ctx.beginPath();ctx.arc(px,py-34,12,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(px-18,py);ctx.quadraticCurveTo(px,py-34,px+18,py);ctx.closePath();ctx.fill();}
      tag(ctx,P3_GX+118,P3_BY-124,"now building its data products",TECH,{align:"center",size:28});});});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. The data practice on the map ---------- */
// a work package, as ArchiMate draws it: a rounded box with a circular arrow
function p3_work(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(14,8,16,0.95)"});ctx.fillStyle=rgba(col,0.14);rr(ctx,x,y,w,h,22);ctx.fill();
  const gx=x+w-30,gy=y+26;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(gx,gy,10,-Math.PI*0.2,Math.PI*1.45);ctx.stroke();const ax=gx+10*Math.cos(-Math.PI*0.2),ay=gy+10*Math.sin(-Math.PI*0.2);ctx.beginPath();ctx.moveTo(ax+5,ay-1);ctx.lineTo(ax-4,ay-5);ctx.lineTo(ax-1,ay+5);ctx.closePath();ctx.fill();ctx.restore();
  wrapT(ctx,name,x+w/2-10,y+h/2+10,w-70,{size:o.size||28,w:700,align:"center",color:rgba(INK,0.96),lh:32});});}
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p3_room(ctx,S,t);
  const tN=c("node"),tA=c("app"),tP=c("principle"),tWk=c("work");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const MOT=LAY6[0][1],MIG=[248,184,226];
  psaBand(ctx,30,130,"motivation",MOT,fin(t,0.2,0.8));psaBand(ctx,180,170,"application layer",APPC,fin(t,0.3,0.8));psaBand(ctx,370,310,"technology layer",TECC,fin(t,0.5,0.8));psaBand(ctx,700,160,"implementation and migration",MIG,fin(t,0.7,0.8));
  // the application layer: each domain's data products, generation's among them, clear of the layer's name
  const AX=i=>370+i*296;P3_ALL.forEach(([nm,col],i)=>psaEl(ctx,AX(i),236,270,88,nm+" data products",col,"component",{a:fin(t,0.8+i*0.12,0.6),size:28,hi:i===4?pulseAt(t,w("app","stayed"),1.6):0}));
  // the technology layer: the data platform, a node with its services in it; generation's, a second node with its own
  const sw=clamp((t-w("app","served them")+0.3)/1.2,0,1),gone=fin(t,w("work","switched off")-0.2,1.0);
  const node=(x,w_,name,o)=>{psaEl(ctx,x,420,w_,200,"",TECC,"node",o);withA(ctx,o.a==null?1:o.a,()=>T(ctx,name,x+26,464,{w:800,size:30,color:rgba(INK,0.95)}));};
  node(370,920,"the data platform",{a:fin(t,tN-0.4,0.6)});
  ["govern","secure"].forEach((s_,i)=>psaEl(ctx,400+i*230,530,200,64,s_,TECC,"service",{a:fin(t,tN-0.3+i*0.1,0.5),size:28}));
  const gA=fin(t,w("node","second node")-0.3,0.6)*(1-gone);if(gA>0.01)withA(ctx,gA,()=>{node(1340,490,"generation's platform",{hi:pulseAt(t,w("node","plain sight"),1.6)});
    ["govern","secure"].forEach((s_,i)=>psaEl(ctx,1370+i*226,530,206,64,s_,TECC,"service",{a:fin(t,w("node","its own services")-0.2+i*0.15,0.5),size:28,hi:pulseAt(t,w("node","second set"),1.6)}));
    const hi=fin(t,w("node","second set")-0.2,0.5);if(hi>0.01)withA(ctx,hi,()=>{ctx.save();ctx.strokeStyle=rgba(AMBER,0.95);ctx.lineWidth=2.6;ctx.setLineDash([9,7]);rr(ctx,1326,406,518,228,18);ctx.stroke();ctx.setLineDash([]);ctx.restore();});});
  withA(ctx,fin(t,w("node","second set")-0.2,0.5)*(1-fin(t,tA-0.3,0.4)),()=>tag(ctx,1585,664,"a second set of rules, in plain sight",AMBER,{align:"center",size:28}));
  // what served each domain's products: the data platform serves the first four; generation's, first its own node, then the data platform
  const sv=fin(t,tA-0.3,0.5);for(let i=0;i<4;i++){const x=AX(i)+135;psaRel(ctx,Math.min(x,1270),418,x,326,"serve",TECC,sv*0.9,clamp((t-tA+0.3-i*0.1)/0.6,0,1));}
  psaRel(ctx,1700,418,AX(4)+150,326,"serve",TECC,sv*(1-sw)*0.9,1);psaRel(ctx,1270,418,AX(4)+60,326,"serve",TECC,sw*0.9,sw);
  withA(ctx,fin(t,w("app","served them")-0.2,0.5)*(1-fin(t,tP-0.3,0.4)),()=>tag(ctx,960,150,"only what served them changed",TECC,{align:"center",size:28}));
  // Ravi's rule, as a principle; and the move, a work package, ending the day the old platform was switched off
  archEl(ctx,430,48,1060,92,"one platform; a second only for a reason anyone can name",MOT,"principle",{size:28,a:fin(t,w("principle","principle")-0.3,0.6),hi:pulseAt(t,w("principle","principle"),1.4)});
  p3_work(ctx,520,744,640,96,"move generation onto the data platform",MIG,{a:fin(t,w("work","work package")-0.3,0.6),hi:pulseAt(t,w("work","work package"),1.4)});
  withA(ctx,fin(t,w("work","ending")-0.3,0.5),()=>{psaRel(ctx,1162,792,1236,792,"flow",MIG,1,clamp((t-w("work","ending"))/0.6,0,1));glass(ctx,1240,756,600,72,36,MIG,{glow:10,ea:0.7,fill:"rgba(14,8,16,0.95)"});T(ctx,"ends: the old platform switched off",1540,802,{w:700,size:28,align:"center",color:rgba(INK,0.95)});});
  if(gone>0.01)withA(ctx,gone,()=>{ctx.save();ctx.strokeStyle=rgba(TECC,0.45);ctx.lineWidth=2;ctx.setLineDash([8,8]);rr(ctx,1340,420,490,200,6);ctx.stroke();ctx.setLineDash([]);ctx.restore();});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. One road, many domains ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("data"),tN=c("next"),outA=1-fin(t,B+0.6,0.8),mA=(1-fin(t,tD-0.6,0.9))*outA,pA=fin(t,tD-0.6,0.9)*outA;if(outA<1)p3_base(ctx,S);
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.1});const cam=p3_cam(t,[[0,663,724,10.4],[0.2,663,721,12,9]],2);ctx.save();p3_camAt(ctx,cam);p3_land(ctx,{lit:0.2});ctx.restore();
    // the Tōkaidō past Kuwana, drawn at the frame's size, its stations lit; where sixty barriers had stood, their ghosts, going out;
    // travellers on the road, as lights, both ways
    const TK=p3_on(PSA_TKD.map(s_=>[s_[1],s_[2]]),cam,6),I=p3_on(P3_ISE,cam,8),IL=p3_len(I),LOC=p3_on(P3_ISE.concat([[136.553,34.893]]),cam,8);
    psaPath(ctx,TK,1,{col:PSC,lw:4.4,glow:12,a:0.9});PSA_TKD.forEach((s_,i)=>{const[x,y]=p3_scr(cam,...psaJP(s_[1],s_[2]));if(x>-40&&x<1960&&y>-40&&y<1120)psaStop(ctx,x,y,{lit:0.5+0.4*Math.max(0,Math.sin(t*1.3-i*0.4)),r:7});});
    p3_bars(ctx,I,IL,60,26,{a:0.7*(1-fin(t,w("road","sixty barriers")+0.4,1.6)),lw:2.4,glow:4,seed:7});
    for(let i=0;i<5;i++){const u=(t*0.05+i/5)%1;p3_runner(ctx,i%2?LOC.slice().reverse():LOC,u,PSC,{r:5,trail:0.04});}
    const[kx,ky]=I[0],[hx,hy]=I[I.length-1];psaName(ctx,"Kuwana",kx+22,ky+10,{size:32});psaName(ctx,"Hinaga",hx+24,hy+12,{size:32});
    withA(ctx,fin(t,w("road","sixty barriers")-0.3,0.6),()=>tag(ctx,960,190,"where sixty barriers had stood",PSC,{align:"center",size:30}));
    eaYear(ctx,80,80,"the Tōkaidō",CLAY,fin(t,0.4,0.6));}],
  [pA,ctx=>{p3_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:12},{z:0.012,y:560});
    p3_two(ctx,t,{lw:P3_RX+P3_RW-P3_LX,gen:0,lhi:pulseAt(t,w("data","one platform"),1.6)*0.6});p3_face(ctx,P3_LX+40,P3_PY+80+32,{});
    ctx.restore();
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,960,250,"Next: Where it meets the applications",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"One platform, or many","One road for every domain, and every rule kept once.","film 3 of 8");});

/* where the chapters meet: the platforms stay put from Generation moves to Every rule, once, its camera gliding on (From words to
   data's joins.js); Three sets of rules opens once Two platforms, and a third has left */
const CHAPTER_JOINS={glide:["once"],leave:["layers","mesh"],bare:(ctx,S,t)=>{p3_room(ctx,S,t);vign(ctx,S);}};
