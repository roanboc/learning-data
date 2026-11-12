/* ===== Where it meets the applications: scenes =====
   Nine chapters, as in ../script.md. Japan, the 1600s: in Shinano, a province of high mountains whose rivers can't carry boats, goods
   cross the passes on horseback. On the main roads they go by the stations' relay: a station's horses carry a load only to the next
   station, where it moves to another horse and the shipper pays again; officials take the horses first. Farmers carry loads on their
   own horses straight through, the chūma; the stations lose loads and fees and take them to court from 1673. In 1764 the shogunate
   rules: for each road, which goods the farmers' horses carry and which go by the relay; every village and its horses written down.
   Then the utility: the integration platform joins the applications, and the integration team finds 34 flows in and out of the data
   platform that aren't on its map; two kinds of traffic, small messages and bulk loads; one rule for each kind of flow; one map both
   teams keep; a fault-risk score served back to the outage app through the gateway; the two platforms, better together; the data
   practice on the map; and the road, both kinds of horse on it, under one ruling.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring; on the map the camera glides, and the map draws its roads, routes and ridges at
   the frame's own size, so they stay crisp as it moves; the utility's chapters glide on from one to the next in one room, where what
   stays stays put and only what changes fades; between rooms the whole picture dissolves. Sound: every effect in tools/score.py fires
   at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- shared by the chapters ---------- */
// Yasmin Saleh joins the utility as its integration lead (technical, so cyan). Drawn like the rest of the cast, in this film's own source:
// black hair in a bun, silver earrings and a wine-red shirt: Inés has the bob, Farah long hair and Ama, who also wears a bun, glasses.
PEOPLE.yasmin={name:"Yasmin Saleh",role:"Integration lead",side:"Technical",does:"produces",edge:TECH,seed:24,
  skin:[176,126,96],hair:{style:"bun",c:[28,22,24]},earrings:[210,214,222],
  top:{kind:"shirt",c:[124,54,66]},bottom:{c:[40,42,52]},shoe:[40,32,32],build:{sh:66,hip:60,h:0.95}};
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p4_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p4_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaHorse and psaWalker)
function p4_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}
// a camera that glides between keys [t, x, y, zoom] as focus() does; returns where it is, so words and the map's own lines can be
// laid on the frame at their own size; p4_camAt applies it, p4_scr turns a point of the room into the frame
function p4_cam(t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const dd=keys[i][4]||d,u=easeCam(clamp((t-keys[i][0])/dd,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}return[x,y,z];}
function p4_camAt(ctx,c){ctx.translate(960,540);ctx.scale(c[2],c[2]);ctx.translate(-c[0],-c[1]);}
const p4_scr=(c,x,y)=>[960+(x-c[0])*c[2],540+(y-c[1])*c[2]];
// a light that travels along a path, with a fading trail: a load, a message
function p4_runner(ctx,pts,u,col,o){o=o||{};if(u<=0||u>=1.0001&&!o.hold)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0||uu>1)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// a small pill: a name, a service, a product; o.dash draws an outline only
function p4_chipW(ctx,name,sz){return 30+tw(ctx,name,sz||28,700);}
function p4_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p4_chipW(ctx,name,sz),h=46,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    else glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,14,18,0.94)"});
    if(name)T(ctx,name,X+w/2,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(o.dash?col:INK,0.96)});});return w;}
// [longitude, latitude] points to the frame, through the camera c, smoothed; and their lengths, to find a share of the way along them
function p4_spline(P,n){if(P.length<3)return P.slice();const out=[];for(let i=0;i<P.length-1;i++){const a=P[Math.max(0,i-1)],b=P[i],c=P[i+1],d=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const s=k/n,s2=s*s,s3=s2*s,f=j=>0.5*(2*b[j]+(-a[j]+c[j])*s+(2*a[j]-5*b[j]+4*c[j]-d[j])*s2+(-a[j]+3*b[j]-3*c[j]+d[j])*s3);out.push([f(0),f(1)]);}}out.push(P[P.length-1]);return out;}
const p4_on=(P,c,n)=>p4_spline(P.map(([lo,la])=>{const[x,y]=psaJP(lo,la);return p4_scr(c,x,y);}),n||8);
function p4_len(S){const L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));return L;}
function p4_at(S,L,u){const T_=L[L.length-1],d=clamp(u,0,1)*T_;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/((L[i]-L[i-1])||1),a=S[i-1],b=S[i];return[lerp(a[0],b[0],f),lerp(a[1],b[1],f),Math.atan2(b[1]-a[1],b[0]-a[0])];}
// a dashed line, drawn up to p
function p4_dline(ctx,x0,y0,x1,y1,col,a,p,o){o=o||{};if(a<=0.01||p<=0)return;const u=clamp(p,0,1);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=o.lw||2.4;ctx.setLineDash(o.dash||[8,8]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,u),lerp(y0,y1,u));ctx.stroke();ctx.setLineDash([]);ctx.restore();});}
// a line through the points P, drawn up to p of its length, with a head at its end once it's whole; o.lw, o.glow, o.head
function p4_route(ctx,P,col,a,p,o){o=o||{};if(a<=0.01||p<=0)return;const L=p4_len(P),d=clamp(p,0,1)*L[L.length-1];withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.lineJoin="round";
  if(o.glow){ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=o.glow;}ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let end=P[0],an=0;
  for(let i=1;i<P.length;i++){if(L[i]<=d){ctx.lineTo(P[i][0],P[i][1]);end=P[i];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=lerp(P[i-1][0],P[i][0],f),y=lerp(P[i-1][1],P[i][1],f);ctx.lineTo(x,y);end=[x,y];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);break;}}
  ctx.stroke();ctx.shadowBlur=0;if(o.head!==false&&p>=0.98){const hs=o.head||9,[x,y]=end;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.5)*hs,y-Math.sin(an-0.5)*hs);ctx.lineTo(x-Math.cos(an+0.5)*hs,y-Math.sin(an+0.5)*hs);ctx.closePath();ctx.fill();}ctx.restore();});}

/* ---------- the map: Shinano, its mountains, its roads, and where the farmers' horses went ---------- */
// the land for the close looks at Shinano: the series' coast with its corners rounded off (twice, as Chaikin does), so the camera
// finds a shore and not the piers of today's ports; drawn as psaLand draws it, with the same light and texture
const P4_LP={};
function p4_landPath(){if(P4_LP.p)return P4_LP.p;const p=new Path2D();PSA_COAST.forEach(r=>{let P=r.map(q=>psaJP(q[0],q[1]));
  for(let k=0;k<2;k++){const Q=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];Q.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25],[a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75]);}P=Q;}
  P.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();});return P4_LP.p=p;}
function p4_land(ctx,o){o=o||{};const lit=o.lit||0,fill=mix([30,36,54],[60,52,44],lit),edge=mix([150,172,210],[236,206,160],lit),P=p4_landPath(),z=Math.sqrt(Math.abs(ctx.getTransform().a));
  ctx.save();ctx.fillStyle=rgba(fill,1);ctx.fill(P);ctx.shadowColor=rgba(edge,0.55);ctx.shadowBlur=16;ctx.strokeStyle=rgba(edge,0.7);ctx.lineWidth=2.2/z;ctx.lineJoin="round";ctx.stroke(P);ctx.restore();
  ctx.save();ctx.clip(P);for(let i=0;i<60;i++){const lon=131+hash(i,61)*10.5,lat=32+hash(i,62)*8.5,[x,y]=psaJP(lon,lat),r=30+hash(i,63)*90,g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,rgba(mix([62,72,70],[100,88,70],lit),0.16+0.1*hash(i,64)));g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}ctx.restore();}
// Shinano: the province's border, as a sketch ([longitude, latitude], from its northern tip, clockwise); its ranges, along each crest
// (the Hida range on the western border, Ontake, the Kiso range, the Akaishi range on the south-east border, Yatsugatake, the ranges
// round Asama, the mountains on the border with Kōzuke and those of the north), each with how high it stands; and its high peaks
const P4_SHINANO=[[138.53,37.03],[138.66,36.95],[138.74,36.82],[138.68,36.70],[138.62,36.60],[138.58,36.48],[138.66,36.40],[138.74,36.30],[138.72,36.18],[138.66,36.06],[138.70,35.95],[138.55,35.92],[138.43,35.86],[138.30,35.80],[138.23,35.72],[138.24,35.66],[138.18,35.55],[138.15,35.44],[138.05,35.33],[137.95,35.22],[137.80,35.20],[137.70,35.24],[137.58,35.32],[137.52,35.42],[137.55,35.52],[137.45,35.62],[137.40,35.75],[137.46,35.88],[137.52,36.00],[137.55,36.11],[137.62,36.25],[137.65,36.36],[137.70,36.48],[137.74,36.62],[137.76,36.76],[137.80,36.85],[137.88,36.92],[138.00,36.96],[138.12,36.93],[138.25,36.96],[138.38,37.00]];
const P4_MTN=[[1.0,[[137.70,36.94],[137.758,36.759],[137.747,36.625],[137.711,36.401],[137.648,36.342],[137.648,36.289],[137.587,36.227],[137.554,36.106],[137.53,36.00]]],
  [0.8,[[137.51,35.96],[137.480,35.893],[137.46,35.83]]],[0.85,[[137.86,35.96],[137.804,35.789],[137.82,35.70],[137.76,35.58],[137.60,35.44]]],
  [1.0,[[138.25,35.83],[138.228,35.758],[138.236,35.674],[138.183,35.574],[138.158,35.461],[138.10,35.36],[138.05,35.28]]],[0.75,[[138.30,36.10],[138.35,36.03],[138.370,35.971],[138.36,35.92]]],
  [0.7,[[138.36,36.47],[138.45,36.43],[138.523,36.406],[138.60,36.37]]],[0.65,[[138.48,36.80],[138.52,36.64],[138.55,36.52]]],[0.6,[[138.05,36.75],[138.10,36.82],[138.19,36.89]]]];
const P4_PEAK=[[137.648,36.342],[137.758,36.759],[137.554,36.106],[137.480,35.893],[137.804,35.789],[138.236,35.674],[138.158,35.461],[138.370,35.971],[138.523,36.406]];
// the ranges as a mapmaker draws them, at the frame's own size so they stay fine as the camera moves: short strokes down each slope
// from the crest, light on the slope that faces the north-west, dark on the other, longest where the range stands highest and
// tapering at its ends; the crest itself a thin light line, and the high peaks catching the last light. a: alpha; o.p: how much of
// each range is drawn so far, from its first point
function p4_ridges(ctx,cam,a,o){o=o||{};if(a<=0.01)return;const z=cam[2],p=o.p==null?1:o.p,step=6.5;withA(ctx,a,()=>{ctx.save();
  P4_MTN.forEach(([hr,R],r)=>{const P=p4_on(R,cam,6),L=p4_len(P),T_=L[L.length-1],n=Math.floor(T_*p/step);if(n<1)return;const lit=new Path2D(),dark=new Path2D();
    for(let i=0;i<n;i++){const u=(i+0.5)*step/T_,[x,y,an]=p4_at(P,L,u),nx=-Math.sin(an),ny=Math.cos(an),f=(nx*-0.7+ny*-0.7)>0?1:-1,
      H=hr*z*21*(0.45+0.55*Math.pow(Math.sin(Math.PI*clamp(u,0,1)),0.6))*(0.75+0.5*hash(i+r*53,81)),wq=1.3,
      add=(P_,s,len)=>{const ex=x+nx*s*len+(hash(i+r*7,82)-0.5)*3,ey=y+ny*s*len+len*0.18;P_.moveTo(x-Math.cos(an)*wq,y-Math.sin(an)*wq);P_.lineTo(ex,ey);P_.lineTo(x+Math.cos(an)*wq,y+Math.sin(an)*wq);P_.closePath();};
      add(lit,f,H);add(dark,-f,H*0.9);}
    ctx.fillStyle="rgba(8,10,18,0.62)";ctx.fill(dark);ctx.fillStyle="rgba(176,184,208,0.5)";ctx.fill(lit);
    ctx.strokeStyle="rgba(214,220,238,0.55)";ctx.lineWidth=1.4;ctx.lineJoin="round";ctx.beginPath();const m=Math.max(2,Math.ceil(P.length*p));P.slice(0,m).forEach(([x,y],k)=>k?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();});
  if(p>=0.98)P4_PEAK.forEach(q=>{const[x,y]=p4_scr(cam,...psaJP(...q));glow(ctx,x,y,12,[236,226,214],0.35);ctx.fillStyle="rgba(244,238,228,0.9)";ctx.beginPath();ctx.arc(x,y,2.2,0,TAU);ctx.fill();});
  ctx.restore();});}
// Shinano's rivers, from source to mouth: the Tenryū from Lake Suwa south through the Ina valley to the Pacific; the Kiso, south-west to
// Ise Bay; the Chikuma, north-east to the Japan Sea (where it's called the Shinano); the Sai, from Matsumoto to the Chikuma; and the Hime,
// north to Itoigawa. Steep and fast, with rapids, so no boats carried Shinano's goods: drawn in blue, with the rapids as small white
// strokes across them (o.rapids), and Lake Suwa
const P4_RIV=[[[138.06,36.05],[137.99,35.98],[137.96,35.88],[137.95,35.80],[137.92,35.70],[137.88,35.62],[137.83,35.52],[137.84,35.40],[137.82,35.28],[137.80,35.12],[137.79,34.95],[137.79,34.68]],
  [[137.80,36.03],[137.75,35.95],[137.69,35.84],[137.69,35.77],[137.64,35.66],[137.60,35.58],[137.52,35.49],[137.40,35.46],[137.20,35.40],[136.95,35.33],[136.75,35.10]],
  [[138.73,35.93],[138.62,36.08],[138.48,36.22],[138.38,36.32],[138.25,36.40],[138.17,36.52],[138.22,36.62],[138.30,36.73],[138.38,36.85],[138.55,37.00],[138.75,37.20]],
  [[137.95,36.25],[137.92,36.38],[138.00,36.48],[138.10,36.55],[138.208,36.598]],[[137.86,36.70],[137.85,36.80],[137.84,36.92],[137.862,37.039]]];
const P4_WATER=[110,160,224];
function p4_rivers(ctx,cam,a,o){o=o||{};if(a<=0.01)return;const p=o.p==null?1:o.p,rp=o.rapids||0,z=cam[2];withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  P4_RIV.forEach((R,r)=>{const P=p4_on(R,cam,6);psaPath(ctx,P,p,{col:P4_WATER,lw:2.4,glow:6,a:0.85});
    if(rp>0.01){const L=p4_len(P),T_=L[L.length-1],gap=74;withA(ctx,rp,()=>{ctx.strokeStyle="rgba(236,244,255,0.9)";ctx.lineWidth=1.7;ctx.lineJoin="round";for(let d=gap*(0.5+hash(r,83));d<T_*p-14;d+=gap){const[x,y]=p4_at(P,L,d/T_);
      if(x<-20||x>1940||y<-20||y>1100||!p4_inShinano(x,y,cam))continue;ctx.beginPath();for(let k=0;k<=6;k++){const[qx,qy,an]=p4_at(P,L,(d-12+k*4)/T_),o_=(k%2?1:-1)*(k&&k<6?3.2:0);ctx.lineTo(qx-Math.sin(an)*o_,qy+Math.cos(an)*o_);}ctx.stroke();}});}});
  const[sx,sy]=p4_scr(cam,...psaJP(138.085,36.05));ctx.fillStyle=rgba(P4_WATER,0.9);ctx.beginPath();ctx.ellipse(sx,sy,Math.max(3,7*z),Math.max(2.5,5.8*z),-0.3,0,TAU);ctx.fill();
  ctx.restore();});}
// the province's border at the frame's size, a soft amber dash, and the province a shade warmer inside it; and whether a point of the
// frame is inside it
function p4_shinanoPath(cam){const p=new Path2D();P4_SHINANO.forEach(q=>{const[x,y]=p4_scr(cam,...psaJP(...q));p.lineTo(x,y);});p.closePath();return p;}
function p4_inShinano(x,y,cam){return(P4_LP.ctx||(P4_LP.ctx=document.createElement("canvas").getContext("2d"))).isPointInPath(p4_shinanoPath(cam),x,y);}
function p4_shinano(ctx,cam,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const P=p4_shinanoPath(cam);ctx.save();ctx.fillStyle=rgba(PSC,0.05+0.05*(o.hi||0));ctx.fill(P);
  ctx.strokeStyle=rgba(PSC,0.5);ctx.lineWidth=2;ctx.lineJoin="round";ctx.setLineDash([10,8]);ctx.stroke(P);ctx.setLineDash([]);ctx.restore();});}
// places, [longitude, latitude]
const P4_PL={matsumoto:[137.972,36.238],iida:[137.821,35.515],shiojiri:[137.953,36.115],suwa:[138.08,36.07],itoigawa:[137.862,37.039],okazaki:[137.164,34.954],yoshida:[137.39,34.77]};
// the road from Matsumoto through Shiojiri, the Ina valley and Iida, where the farmers' horses were busiest; and where they went on
// from it: north to Itoigawa on the Japan Sea; south to Okazaki and to Yoshida, on the Pacific side; east along the Kōshū road to
// Kajikazawa and the Nakasendō to Kuragano, river ports where loads went on by boat; and west along the Nakasendō to Imawatari
const P4_INA=[[137.972,36.238],[137.953,36.115],[137.99,35.985],[137.954,35.828],[137.934,35.729],[137.821,35.515]];
const P4_OUT=[[[137.972,36.238],[137.90,36.45],[137.85,36.70],[137.862,37.039]],[[137.821,35.515],[137.62,35.25],[137.32,35.13],[137.164,34.954]],
  [[137.821,35.515],[137.66,35.20],[137.50,34.90],[137.39,34.77]],[[138.08,36.07],[138.30,35.86],[138.46,35.54]],
  [[138.08,36.07],[138.30,36.25],[138.63,36.35],[139.00,36.32],[139.05,36.31]],[[137.95,36.11],[137.69,35.84],[137.57,35.53],[137.50,35.49],[137.04,35.43]]];
// passes over the mountains, the trails a horse took: the Nomugi pass, west from Matsumoto into Hida; the Gonbei pass, between the Ina
// valley and the Kiso valley; the Ōhira pass, between Iida and the Kiso valley; and the Wada pass, east on the Nakasendō
const P4_PASS=[[[137.90,36.20],[137.72,36.14],[137.57,36.08]],[[137.96,35.90],[137.86,35.925],[137.76,35.96]],[[137.83,35.53],[137.72,35.55],[137.60,35.58]],[[138.10,36.10],[138.20,36.18],[138.30,36.26]]];

/* ---------- the road, seen from its side ---------- */
function p4_road(ctx,S,t){psaDusk(ctx,S,{d:1,y0:760});[[80,0.95,1],[1780,1.1,4],[1880,0.9,5]].forEach(([x,s,k])=>psaPine(ctx,x,762,s,k,{rim:PSC}));}
// a load as a pack saddle carries it, apart from its horse: two straw-wrapped bundles and a third across the top, tied with rope,
// drawn where psaHorse draws its pack for a horse whose hooves are at (x,y0) at scale s; o.ground sets it down on the road instead
function p4_pack(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0+(o.ground?102*s+(o.lift||0):0));ctx.scale(s,s);const col=[16,14,16];
  ctx.fillStyle=rgba(mix(col,[70,52,38],0.28),1);rr(ctx,-52,-192,104,42,14);ctx.fill();rr(ctx,-44,-160,44,58,12);ctx.fill();rr(ctx,8,-160,44,58,12);ctx.fill();
  ctx.strokeStyle=rgba(mix(col,[150,118,84],0.45),0.85);ctx.lineWidth=2.2;[-30,0,30].forEach(xx=>{ctx.beginPath();ctx.moveTo(xx,-192);ctx.lineTo(xx+2,-150);ctx.stroke();});
  ctx.beginPath();ctx.moveTo(-44,-128);ctx.lineTo(52,-128);ctx.stroke();ctx.strokeStyle=rgba(PSC,0.45);ctx.lineWidth=2;rr(ctx,-52,-192,104,42,14);ctx.stroke();ctx.restore();});}
// a copper coin, flying from (x0,y0) to (x1,y1) as p goes from 0 to 1, in an arc
function p4_coin(ctx,x0,y0,x1,y1,p){if(p<=0||p>=1)return;const x=lerp(x0,x1,p),y=lerp(y0,y1,p)-Math.sin(p*Math.PI)*70;glow(ctx,x,y,22,PSC,0.7);ctx.fillStyle=rgba(mix(PSC,[120,80,30],0.35),1);ctx.beginPath();ctx.ellipse(x,y+2,10,4,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(PSC,1);ctx.beginPath();ctx.ellipse(x,y,10,4,0,0,TAU);ctx.fill();}
// the farmers' horses: a driver leading three, each with its pack, walking at pace v from x (the driver's feet) by dx; o.dir
function p4_string(ctx,x,y0,s,t,o){o=o||{};const dir=o.dir||1,amp=o.amp==null?1:o.amp;psaWalker(ctx,x,y0,s*1.5,t,{kind:"walker",dir,ph:0.3,rate:o.rate||0.85,amp,still:amp<=0,a:o.a});
  for(let i=0;i<3;i++)psaHorse(ctx,x-dir*(150+i*235)*s/0.62,y0+2,s,t,{dir,ph:0.15+i*0.31,rate:o.hrate||0.95,amp,still:amp<=0,pack:true,a:o.a});}

/* ---------- the utility: its applications, the integration platform above them, and the data platform below ---------- */
const P4_APPS=["billing","customer system","outages","metering","work orders"];
const P4_AX=i=>430+i*290,P4_AW=250,P4_AY=276,P4_AH=90,P4_AC=i=>P4_AX(i)+P4_AW/2;
const P4_BUS={x:430,y:90,w:1410,h:64,fh:54},P4_DP={x:430,y:520,w:1410,h:64,fh:54};
const P4_BB=P4_BUS.y+P4_BUS.h+P4_BUS.fh,P4_GX=990,P4_EX=1280;   // the bus's lower edge; where the gateway's and the events' flows cross, in the gaps
// the 34 flows found, by the application at their other end: N stays native, E becomes the integration platform's events, G goes out
// through its gateway. The customer system's fourth is the nightly read that broke
const P4_KIND=[["N","N","E","N","N","E","N"],["N","E","N","E","N","E","N","N"],["N","G","N","N","G","N"],["N","N","N","N","N","N","N","N"],["N","E","N","G","N"]];
const P4_BROKE=10;
const P4_F=(()=>{const F=[],k0=P4_DP.h*0.5+24,span=P4_DP.w-P4_DP.h*0.5-48;let k=0;P4_KIND.forEach((L,a)=>L.forEach((kind,j)=>{F.push({a,j,kind,k,xs:P4_AX(a)+44+(j+0.5)*(162/L.length),xt:P4_DP.x+k0+(k+0.5)*(span/34)});k++;}));
  let e=0,g=0;F.forEach(f=>{if(f.kind==="E")f.b=e++;else if(f.kind==="G")f.b=g++;});return F;})();
const P4_EV=b=>P4_EX-12.5+b*5,P4_GW=b=>P4_GX-6+b*6;
// the diagram. o: a; dp (the data platform's alpha), bus, apps (per app 0..1), ahi (per app light), un (the flows found, dashed),
// nat, ev, gw (how far each kind is on its route), brk (the broken read, lit amber), cross, svc (the bus's services, named), shi
// (gateway, events: lit), dphi, busA, stubs, flowHi(f) (a flow's light), score (Grace's score, drawn up to it), block (network's)
function p4_util(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const B=P4_BUS,D=P4_DP,un=o.un||0,nat=o.nat||0,ev=o.ev||0,gw=o.gw||0,dim=o.dim==null?1:o.dim;
  withA(ctx,dim,()=>{
  // the data platform, and network's data product on it
  const dA=o.dp==null?1:o.dp;if(dA>0.01)withA(ctx,dA,()=>{psaPlatform(ctx,D.x,D.y,D.w,D.h,{fh:D.fh,label:"the data platform",lsize:30,hi:o.dphi||0});
    if(o.caps)T(ctx,o.caps,D.x+D.w-D.h*0.5-30,D.y+D.h+D.fh/2+10,{w:700,size:28,align:"right",color:rgba(mix(TECC,INK,0.3),fin(t,o.capsT||0,0.5))});});
  // the flows found: grey and dashed while nobody can see them, then each on its route, in technology green
  P4_F.forEach((f,i)=>{const done=f.kind==="N"?nat:f.kind==="E"?ev:gw,hi=o.flowHi?o.flowHi(f):0,brk=i===P4_BROKE?(o.brk||0):0;const ua=un*(1-done)*dA;
    if(ua>0.01){ctx.save();ctx.strokeStyle=rgba(mix(mix(SOFT,INK,hi),AMBER,brk),0.5+0.4*Math.max(hi,brk));ctx.lineWidth=2+1.6*brk;ctx.setLineDash([7,7]);ctx.globalAlpha*=ua;ctx.beginPath();ctx.moveTo(f.xs,P4_AY+P4_AH);ctx.lineTo(f.xt,D.y);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    if(f.kind==="N"&&nat>0.01)p4_route(ctx,[[f.xs,P4_AY+P4_AH],[f.xt,D.y]],mix(TECC,INK,0.25*hi),dA*(0.75+0.25*hi),clamp(nat*1.6-i*0.018,0,1),{lw:2+hi,head:8});});
  if(o.cross>0.01){const f=P4_F[P4_BROKE];kt_rcross(ctx,(f.xs+f.xt)/2,(P4_AY+P4_AH+D.y)/2,14,o.cross);}
  // the events, each its own line down the gap between outages and metering; the gateway's, up the gap between the customer system and
  // outages, then down to the applications they serve
  if(ev>0.01)P4_F.filter(f=>f.kind==="E").forEach(f=>{const x=P4_EV(f.b);p4_route(ctx,[[x,P4_BB],[x,D.y]],mix(TECC,INK,0.2),dA*0.95,clamp(ev*1.4-f.b*0.08,0,1),{lw:2,head:8});});
  if(gw>0.01)P4_F.filter(f=>f.kind==="G").forEach(f=>{const x=P4_GW(f.b);p4_route(ctx,[[x,D.y],[x,P4_BB]],mix(TECC,INK,0.2),dA*0.95,clamp(gw*1.4-f.b*0.1,0,1),{lw:2,head:8});});
  // Grace's score, from network's data product, up the gateway's gap and down to the outage app
  if(o.score>0.01){const x=P4_GW(3),P=[[930,D.y-6],[x,D.y-6],[x,P4_BB+10],[P4_AC(2),P4_BB+10],[P4_AC(2),P4_AY]];p4_route(ctx,P,mix(TECC,[255,255,255],0.35),1,o.score,{lw:3.2,glow:12,head:11});}
  if(o.block>0.01)psaBlock(ctx,690,D.y-6-64,230,64,"network",{col:APPC,t,size:28,cog:true,drop:o.blockDrop==null?null:o.blockDrop,a:o.block,hi:o.blockHi||0});
  // the applications, the integration platform above them, and the short way up from each to it
  const bA=o.bus==null?1:o.bus;if(bA>0.01)withA(ctx,bA,()=>{
    for(let i=0;i<5;i++){const x=P4_AC(i),up=ev>0.01&&P4_KIND[i].includes("E"),dn=gw>0.01&&P4_KIND[i].includes("G")||(o.score>0.9&&i===2);ctx.save();ctx.strokeStyle=rgba(TECC,0.55);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,P4_BB);ctx.lineTo(x,P4_AY);ctx.stroke();ctx.restore();
      if(up)withA(ctx,ev,()=>psaArrow(ctx,x,P4_AY-2,x,P4_BB+2,mix(TECC,INK,0.2),1,1,{lw:2.6,head:11}));if(dn)withA(ctx,Math.max(gw,o.score>0.9?1:0),()=>psaArrow(ctx,x,P4_BB+2,x,P4_AY-2,mix(TECC,INK,0.2),1,1,{lw:2.6,head:11}));}
    psaPlatform(ctx,B.x,B.y,B.w,B.h,{fh:B.fh,label:"the integration platform",lsize:30,hi:o.bhi||0});
    // what travels through it (o.under) goes before the names of its two services, each with a dark edge of the face's own colour, so a
    // message passes behind the word it goes through
    if(o.under)o.under(ctx);
    const sv=o.svc==null?1:o.svc;if(sv>0.01)withA(ctx,sv,()=>{const sh=o.shi||[0,0],yL=B.y+B.h+B.fh/2;[["gateway",P4_GX,sh[0]],["events",P4_EX,sh[1]]].forEach(([nm,x,h])=>{
      ctx.save();ctx.font=font(700,28);ctx.textAlign="center";ctx.lineJoin="round";ctx.lineWidth=10;ctx.strokeStyle=rgba(mix(TECC,[0,0,0],0.78),1);ctx.strokeText(nm,x,yL+10);ctx.restore();
      if(h>0.01)glow(ctx,x,yL,90,TECC,0.3*h);T(ctx,nm,x,yL+10,{w:700,size:28,align:"center",color:rgba(mix(TECC,INK,0.3+0.5*h),1)});});});});
  for(let i=0;i<5;i++){const q=o.apps?o.apps[i]:1;if(q>0.01)psaEl(ctx,P4_AX(i),P4_AY,P4_AW,P4_AH,P4_APPS[i],APPC,"component",{a:q,size:28,hi:o.ahi?o.ahi[i]:0});}});});}
// a message between two applications, through the integration platform: up from one, along its front face, and down into the other;
// u from 0 to 1. Drawn in p4_util's o.under, so it comes out of an application's box and passes behind a service's name
const P4_MY=P4_BB-24;
function p4_msg(ctx,i,j,u,col,o){if(u<=0||u>=1)return;const y=P4_MY,P=[[P4_AC(i),P4_AY],[P4_AC(i),y],[P4_AC(j),y],[P4_AC(j),P4_AY]];p4_runner(ctx,P,u,col||[236,243,255],{r:6,trail:0.12,...(o||{})});}
// a message along a path of points at a steady speed (px a second), from t0; nothing before t0 or once it has arrived
function p4_send(ctx,P,t,t0,col,v){const L=p4_len(P),u=(t-t0)*(v||700)/L[L.length-1];if(u>0&&u<1)p4_runner(ctx,P,u,col||[236,243,255],{r:6,trail:0.12});}
// the people at the side of the diagram: one, at the left; or two, side by side. [x, scale]
const P4_ONE=[210,0.8],P4_TWO=[[130,0.72],[318,0.72]];

/* ---------- 1. A horse the whole way ---------- */
// where the map's camera looks, in the map's own units: the whole country; Shinano, close; Shinano with both coasts
const P4_J=[960,540,1.0],P4_SH=(()=>{const[x,y]=psaJP(138.02,36.12);return[x,y,1.7];})(),P4_INAV=(()=>{const[x,y]=psaJP(137.96,35.92);return[x,y,1.75];})(),P4_WIDE=(()=>{const[x,y]=psaJP(137.9,35.62);return[x,y,1.0];})();
scene("chuma",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tRe=c("relay"),tHa=c("harm"),tVi=c("villages"),tCh=c("chuma"),tHi=c("hit"),tNe=c("need"),tRu=c("ruling"),tWr=c("written"),tBe=c("better"),tUn=c("unseen"),tSo=c("sort");
  // which room: the map, close on Shinano; the road at dusk, with its station; the map again, wider, as the farmers' horses spread; and
  // the utility. Under the title, the last room leaves whole, so no word of it shows under the title's
  const outA=1-fin(t,B+0.9,0.7),rA0=fin(t,tRe-0.8,0.9)*(1-fin(t,tBe-0.8,0.9)),uA0=fin(t,tUn-0.8,0.9);
  const rdA=rA0*outA,uA=uA0*outA,mA=Math.max(0,1-rA0-uA0)*outA,second=t>tRe;if(outA<1)p4_base(ctx,S);
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.12});
    const tS2=w("better","spread"),CK=second?[[0,...P4_INAV],[tS2-0.3,...P4_WIDE,2.8]]:[[0,...P4_J],[0.8,...P4_SH,3.2],[tRe-3,P4_SH[0]+6,P4_SH[1]+4,P4_SH[2]*1.04,4]];
    const cam=p4_cam(t,CK,2.4);ctx.save();p4_camAt(ctx,cam);p4_land(ctx,{lit:0.12});ctx.restore();
    // Shinano: its border, the Nakasendō and the Kōshū road through it (faint), its rivers and its ranges, all drawn at the frame's size
    const tSh=w("year","Shinano"),tRv=w("year","rivers"),tPa=w("year","passes");
    p4_shinano(ctx,cam,second?0.6:fin(t,tSh-0.3,0.8),{hi:second?0:pulseAt(t,tSh,1.6)});
    PSA_ROADS.slice(0,2).forEach(([nm,pts])=>psaPath(ctx,p4_on(pts,cam,4),1,{col:mix(PSC,[255,226,180],0.2),lw:2,glow:0,a:second?0.3:fin(t,tSh,1.0)*0.3}));
    p4_rivers(ctx,cam,second?0.55:fin(t,tRv-0.4,0.6),{p:second?1:clamp((t-tRv+0.4)/1.4,0,1),rapids:second?0:fin(t,tRv+0.6,0.6)});
    p4_ridges(ctx,cam,second?0.9:fin(t,1.4,1.2),{p:second?1:clamp((t-1.4)/2.6,0,1)});
    if(!second){
      const[nx,ny]=p4_scr(cam,...psaJP(138.15,36.3));psaName(ctx,"Shinano",nx,ny,{a:fin(t,tSh-0.3,0.6),size:34,align:"center"});
      // the passes, and a horse's load as a light crossing each
      const pA=fin(t,tPa-0.4,0.7);if(pA>0.01)withA(ctx,pA,()=>{P4_PASS.forEach((R,i)=>{const P=p4_on(R,cam,6);psaPath(ctx,P,clamp((t-tPa+0.4)/1.0,0,1),{col:PSC,lw:2.6,glow:6,a:0.85});p4_runner(ctx,P,((t-tPa+i*0.7)*0.22)%1,PSC,{r:5,trail:0.1});});});
      withA(ctx,fin(t,tRv-0.2,0.5),()=>tag(ctx,1610,420,"rivers that can't carry boats",P4_WATER,{align:"center",size:30}));
      withA(ctx,fin(t,tPa-0.2,0.5),()=>tag(ctx,1610,482,"goods over the passes, on horseback",PSC,{align:"center",size:30}));
      eaYear(ctx,80,80,"Japan · the 1600s",CLAY,fin(t,0.5,0.8)*(1-fin(t,tRe-1.2,0.5)));}
    else{
      // the road from Matsumoto to Iida, its loads going both ways; then the farmers' horses spread across Shinano, to both coasts
      const I=p4_on(P4_INA,cam,8),tN=w("better","nine thousand"),tS=w("better","spread");psaPath(ctx,I,1,{col:PSC,lw:4.6,glow:12,a:0.95});
      for(let i=0;i<4;i++){const u=(t*0.06+i/4)%1;p4_runner(ctx,i%2?I.slice().reverse():I,u,PSC,{r:5,trail:0.06});}
      const[mx,my]=p4_scr(cam,...psaJP(...P4_PL.matsumoto)),[ix,iy]=p4_scr(cam,...psaJP(...P4_PL.iida));psaStop(ctx,mx,my,{lit:1,r:8});psaStop(ctx,ix,iy,{lit:1,r:8});
      psaName(ctx,"Matsumoto",mx+22,my-12,{size:30});psaName(ctx,"Iida",ix+22,iy+12,{size:30});
      withA(ctx,fin(t,tN-0.3,0.6),()=>tag(ctx,1610,420,"Iida to Matsumoto, 1764: 9,600 loads",PSC,{align:"center",size:30}));
      P4_OUT.forEach((R,r)=>{const P=p4_on(R,cam,6),q=clamp((t-tS+0.2-r*0.25)/1.6,0,1);if(q<=0)return;psaPath(ctx,P,q,{col:PSC,lw:3,glow:8,a:0.85});if(q>=1)p4_runner(ctx,P,((t-tS)*0.12+r*0.37)%1,PSC,{r:4,trail:0.08});});
      const cA=fin(t,w("better","both coasts")-0.3,0.6);if(cA>0.01){const[jx,jy]=p4_scr(cam,...psaJP(137.35,36.9)),[px_,py_]=p4_scr(cam,...psaJP(138.6,34.75));
        psaName(ctx,"the Japan Sea",jx,jy,{a:cA,size:30,align:"center",color:rgba(SOFT,1)});psaName(ctx,"the Pacific",px_,py_,{a:cA,size:30,align:"center",color:rgba(SOFT,1)});}
      eaYear(ctx,80,80,"after 1764",CLAY,fin(t,tBe-0.4,0.6));}}],
  /* the road at dusk: the stations' relay; officials first; the farmers' horses, straight through; the stations' suits; the ruling */
  [rdA,ctx=>{p4_road(ctx,S,t);ctx.save();drift(ctx,t-tRe+0.8,{dur:60},{z:0.02,y:640});
    const lit=1-0.6*fin(t,w("hit","lost")-0.2,1.0)*(1-fin(t,tRu,1.2)),G=790,hS=0.66,vH=psaPace("horse",hS,1.0);psaStation(ctx,960,760,0.95,{lit});
    // the relay: a station's horse brings a load to the station and no further; it moves to the next station's horse; the shipper pays
    const tArr=w("relay","next station")+0.2,tMove=w("relay","moves")-0.1,tPay=w("relay","pays again"),tOff=tHa-0.4,tBack=tHa+0.4;
    const rlA=1-fin(t,tCh-1.2,0.6);if(rlA>0.01)withA(ctx,rlA,()=>{
      const[dA,aA]=p4_go(t,tRe-0.6,tArr,(640-250)/Math.max(0.6,tArr-tRe+0.1)),xA0=250+dA,[dB,aB]=p4_go(t,tBack,tBack+30,vH);
      const xA=t<tBack?xA0:640-dB,dirA=t<tBack?1:-1,mv=clamp((t-tMove)/1.2,0,1),[dO,aO]=p4_go(t,tOff,tOff+40,vH*1.25),xB=1150+dO;
      psaHorse(ctx,xA,G,hS,t,{dir:dirA,ph:0.2,rate:1.0,amp:t<tBack?aA:aB,still:(t<tBack?aA:aB)<=0,pack:mv<=0});psaWalker(ctx,xA+dirA*175*hS/0.66,G,0.92,t,{kind:"walker",dir:dirA,ph:0.6,rate:0.85,amp:t<tBack?aA:aB,still:(t<tBack?aA:aB)<=0});
      psaHorse(ctx,xB,G,hS,t,{dir:1,ph:0.55,rate:1.25,amp:aO,still:aO<=0,pack:mv>=1});psaWalker(ctx,xB+175*hS/0.66,G,0.92,t,{kind:"walker",dir:1,ph:0.1,rate:1.05,amp:aO,still:aO<=0});
      if(mv>0&&mv<1){const e=easeCam(mv);p4_pack(ctx,lerp(640,1150,e),G-Math.sin(e*Math.PI)*70,hS);}
      // the shipper, a merchant by the road, pays the fare and the station's fee
      psaWalker(ctx,470,G-4,0.92,t,{kind:"walker",dir:1,ph:0.4,still:true});[0,0.45].forEach((d,k)=>p4_coin(ctx,500,G-170,860+k*60,G-150,clamp((t-tPay-d)/0.7,0,1)));
      withA(ctx,fin(t,w("relay","only to")-0.3,0.5)*(1-fin(t,tMove-0.4,0.4)),()=>tag(ctx,960,190,"a station's horses go only to the next station",PSC,{align:"center",size:30}));
      withA(ctx,fin(t,tMove-0.2,0.5)*(1-fin(t,tHa-0.4,0.4)),()=>tag(ctx,960,190,"moved to another horse, and paid again",PS_RED,{align:"center",size:30}));
      withA(ctx,fin(t,tPay-0.1,0.5)*(1-fin(t,tHa-0.4,0.4)),()=>tag(ctx,960,252,"a fare, and the station's fee",PSC,{align:"center",size:28}));
      // every change costs; officials take the horses first, and a merchant's load waits on the ground
      withA(ctx,fin(t,tHa-0.2,0.5)*(1-fin(t,w("harm","officials")-0.4,0.4)),()=>tag(ctx,960,190,"every change: time, money, and goods damaged",AMBER,{align:"center",size:30}));
      const tOf=w("harm","officials")-0.3,[dP,aP]=p4_go(t,tOf,tOf+40,psaPace("horse",hS,1.0)),pq=fin(t,tOf,0.6)*(1-fin(t,tCh-1.3,0.6));if(pq>0.01){const px_=2150-dP;
        psaWalker(ctx,px_-170,G,0.95,t,{kind:"spear",dir:-1,ph:0.2,rate:1.0,amp:aP,still:aP<=0,a:pq});psaHorse(ctx,px_,G,hS,t,{dir:-1,ph:0.5,rate:1.0,amp:aP,still:aP<=0,rider:true,a:pq});psaWalker(ctx,px_+200,G,0.95,t,{kind:"spear",dir:-1,ph:0.7,rate:1.0,amp:aP,still:aP<=0,a:pq});}
      p4_pack(ctx,620,G,hS,{ground:true,a:fin(t,w("harm","loads wait")-0.6,0.5)});
      withA(ctx,fin(t,w("harm","officials")-0.2,0.5)*(1-fin(t,tVi-0.4,0.4)),()=>tag(ctx,960,190,"officials first: loads wait",AMBER,{align:"center",size:30}));
      withA(ctx,fin(t,tVi-0.2,0.5)*(1-fin(t,tCh-0.6,0.4)),()=>{tag(ctx,960,190,"the mountain villages: everything costs more to carry",AMBER,{align:"center",size:30});tag(ctx,960,252,"and takes longer",AMBER,{align:"center",size:30});});});
    // the farmers' horses, straight through: no change of horse, no station fee; past the station without stopping
    const tSt=tCh-0.6,vS=psaPace("horse",0.62,1.2),[dS,aS]=p4_go(t,tSt,tSt+60,vS),stA=fin(t,tSt,0.6)*(1-fin(t,tRu-0.9,0.6));if(stA>0.01)p4_string(ctx,-120+dS,G,0.62,t,{rate:1.05,hrate:1.2,amp:aS,a:stA});
    withA(ctx,fin(t,w("chuma","straight through")-0.2,0.5)*(1-fin(t,tHi-0.4,0.4)),()=>tag(ctx,960,190,"the farmers' horses: straight through",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,w("chuma","no change")-0.2,0.5)*(1-fin(t,tHi-0.4,0.4)),()=>tag(ctx,960,252,"no change of horse, no station fee",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,w("chuma","cheaper")-0.2,0.5)*(1-fin(t,tHi-0.4,0.4)),()=>tag(ctx,960,314,"cheaper, and less damaged",PS_OK,{align:"center",size:30}));
    withA(ctx,fin(t,w("chuma","chūma")-0.2,0.5)*(1-fin(t,tHi-0.4,0.4)),()=>p4_chip(ctx,960,388,"the chūma · a driver, 3 or 4 horses, about 375 kg",{align:"center",col:PSC}));
    // the stations lose loads and fees, and still keep horses for the shogunate; to court, again and again
    const hA=fin(t,tHi-0.2,0.5)*(1-fin(t,w("hit","From")-0.5,0.4));withA(ctx,hA,()=>{tag(ctx,960,190,"the stations: fewer loads, fewer fees",AMBER,{align:"center",size:30});tag(ctx,960,252,"and still the shogunate's horses to keep",AMBER,{align:"center",size:30});});
    const ctA=fin(t,w("hit","From")-0.3,0.5)*(1-fin(t,tNe-0.4,0.5));if(ctA>0.01)withA(ctx,ctA,()=>{["1673","1693","1739","1760"].forEach((y_,i)=>{const q=fin(t,w("hit","From")-0.2+i*0.45,0.5);if(q>0.01)arrive(ctx,560+i*270,200,t,w("hit","From")-0.2+i*0.45,()=>psaPaper(ctx,460+i*270,110,200,170,["to court",y_],{kicker:true,size:44,align:"center",top:52,rot:(hash(i,91)-0.5)*0.06}),{dy:-10});});
      withA(ctx,fin(t,w("hit","again and again")-0.2,0.5),()=>tag(ctx,960,330,"to court, again and again",PS_RED,{align:"center",size:30}));});
    withA(ctx,fin(t,tNe-0.2,0.5)*(1-fin(t,tRu-0.5,0.4)),()=>{tag(ctx,960,190,"the mountains needed the cheaper way",PSC,{align:"center",size:30});tag(ctx,960,252,"and the road needed its stations",PSC,{align:"center",size:30});});
    // 1764: the ruling, on paper; under it, on the road, both kinds of horse
    const tR=tRu-0.2,rq=fin(t,tR,0.6);if(rq>0.01){const L=["1764 · the shogunate's ruling","For each road:","these goods by the farmers' horses,","the rest by the stations' relay.","679 villages, each written down,","more than 18,000 horses."],
        n1=L.slice(0,4).join(" ").length/L.join(" ").length,p=t<tWr?n1*clamp((t-tR-0.3)/Math.max(1,w("ruling","relay")-tR),0,1):lerp(n1,1,clamp((t-tWr)/Math.max(1,w("written","eighteen thousand")+1.2-tWr),0,1));
      arrive(ctx,960,290,t,tR,()=>psaPaper(ctx,550,70,820,440,L,{kicker:true,size:30,p,foot:"and they help keep the relay going",footA:fin(t,w("written","help keep")-0.2,0.5),footSize:30,seal:fin(t,w("written","relay going")-0.1,0.4),a:rq}),{dy:-14});
      const[dF,aF]=p4_go(t,tRu+0.4,tRu+60,vS),[dR,aR]=p4_go(t,tRu+0.9,tRu+60,vH);p4_string(ctx,-260+dF,G,0.62,t,{rate:1.05,hrate:1.2,amp:aF,a:rq});
      psaHorse(ctx,2080-dR,G,hS,t,{dir:-1,ph:0.4,rate:1.0,amp:aR,still:aR<=0,pack:true,a:rq});psaWalker(ctx,2080-dR-175,G,0.92,t,{kind:"walker",dir:-1,ph:0.8,rate:0.85,amp:aR,still:aR<=0,a:rq});}
    ctx.restore();
    eaYear(ctx,80,80,t<tRu-0.4?"the 1600s":"1764",CLAY,fin(t,tRe-0.2,0.6)*(1-fin(t,tRu-0.9,0.4))+fin(t,tRu-0.3,0.5));}],
  /* the utility: the integration platform, the data platform, and 34 flows nobody can see; then each on its route, on one map */
  [uA,ctx=>{const u=t-tUn+0.8;p4_room(ctx,S,t);ctx.save();drift(ctx,u,{dur:20},{z:0.016,y:500,x:1100});
    person(ctx,"ravi",P4_ONE[0],1030,P4_ONE[1],{t});psaWho(ctx,P4_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,fin(t,w("sort","Ravi")-0.2,0.6));
    const tS=w("sort","sort"),k=clamp((t-tS)/2.6,0,1);
    p4_util(ctx,t,{un:fin(t,w("unseen","thirty-four")-0.3,1.4),nat:clamp((t-tS)/2.2,0,1),ev:clamp((t-tS-0.8)/1.8,0,1),gw:clamp((t-tS-1.2)/1.8,0,1),apps:[0,1,2,3,4].map(i=>fin(t,tUn-0.6+i*0.12,0.6)),dp:fin(t,tUn-0.3,0.7),bus:fin(t,tUn-0.7,0.7)});
    withA(ctx,fin(t,w("unseen","thirty-four")-0.2,0.5)*(1-fin(t,tS-0.4,0.4)),()=>tag(ctx,1135,760,"34 flows: none of them on the integration team's map",SOFT,{align:"center",size:30}));
    withA(ctx,fin(t,w("sort","route")-0.2,0.5),()=>tag(ctx,1135,760,"each on the route that suits it",TECC,{align:"center",size:30}));
    withA(ctx,fin(t,w("sort","one map")-0.2,0.5),()=>tag(ctx,1135,822,"every one on one map, kept by both teams",PS_OK,{align:"center",size:30}));
    ctx.restore();}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"Where it meets the applications","the data platform, and the integration platform","Film 4 of 8 · platform and solution architecture");});

/* ---------- 2. Flows nobody can see ---------- */
scene("unseen",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tHo=c("how"),tLo=c("logged"),tYa=c("yasmin"),tBr=c("broke"),tAs=c("ask");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Yasmin, the integration lead, at the side of the diagram
  const yA=fin(t,tYa-0.3,0.7);if(yA>0.01){psaWhole(ctx,yA,[0,380,440,1080],ctx=>person(ctx,"yasmin",P4_ONE[0],1030,P4_ONE[1],{t}));psaWho(ctx,P4_ONE[0]-10,510,"Yasmin Saleh","integration lead",TECH,fin(t,w("yasmin","Yasmin")-0.1,0.6)*(1-fin(t,sc.dur-1.1,0.6)));}
  // the applications, named one by one; the integration platform joins them
  const tF=w("yasmin","thirty-four"),tUp=w("broke","upgraded"),tRb=w("broke","read broke"),g0=w("how","asks another"),e0=w("how","news"),M=P4_MY;
  // through the gateway, outages asks the customer system for something, and the answer comes back by the same way; through the events,
  // news of a change in the customer system goes up to the events, and from there out to billing, outages and work orders
  const under=ctx=>{p4_send(ctx,[[P4_AC(2),P4_AY],[P4_AC(2),M],[P4_AC(1),M],[P4_AC(1),P4_AY]],t,g0);p4_send(ctx,[[P4_AC(1),P4_AY],[P4_AC(1),M],[P4_AC(2),M],[P4_AC(2),P4_AY]],t,g0+1.1);
    p4_send(ctx,[[P4_AC(1),P4_AY],[P4_AC(1),M],[P4_EX,M]],t,e0);const e1=e0+(P4_EX-P4_AC(1)+P4_AY-M)/700+0.15;[0,2,4].forEach(j=>p4_send(ctx,[[P4_EX,M],[P4_AC(j),M],[P4_AC(j),P4_AY]],t,e1));};
  p4_util(ctx,t,{under,apps:P4_APPS.map((n_,i)=>fin(t,w("apps",["billing","customer system","outages","metering","work orders"][i])-0.3,0.5)),bus:fin(t,0.2,0.8),dp:fin(t,tF-0.6,0.7),un:fin(t,tF-0.2,1.4),
    svc:fin(t,tHo-0.2,0.6),shi:[pulseAt(t,w("how","gateway")-0.1,1.8),pulseAt(t,w("how","events")-0.1,1.8)],bhi:pulseAt(t,w("apps","joins"),1.6)*0.6,
    ahi:[0,pulseAt(t,tUp-0.2,2.0)+fin(t,w("broke","nightly")-0.2,0.5)*(1-fin(t,tUp-0.3,0.3))*0.6,0,0,0],brk:fin(t,w("broke","nightly")-0.2,0.5)*(1-fin(t,tAs-0.3,0.5)),cross:fin(t,tRb-0.1,0.4)*(1-fin(t,tAs-0.3,0.5))});
  // every message checked and logged: a tick on each way up
  for(let i=0;i<5;i++){const q=fin(t,w("logged","checked")-0.1+i*0.12,0.3)*(1-fin(t,tYa-0.3,0.5));if(q>0.01)tick_(ctx,P4_AC(i)+22,P4_BB+30,16,PS_OK,q);}
  withA(ctx,fin(t,w("how","gateway")-0.2,0.5)*(1-fin(t,w("how","events")-0.4,0.4)),()=>tag(ctx,1135,760,"the gateway: one application asks another",TECC,{align:"center",size:30}));
  withA(ctx,fin(t,w("how","events")-0.2,0.5)*(1-fin(t,tLo-0.4,0.4)),()=>tag(ctx,1135,760,"events: news of a change, to every application that wants it",TECC,{align:"center",size:30}));
  withA(ctx,fin(t,tLo-0.2,0.5)*(1-fin(t,tYa-0.4,0.4)),()=>tag(ctx,1135,760,"every message checked and logged: every flow seen",PS_OK,{align:"center",size:30}));
  // the flows nobody on her team can see; the nightly read that broke; retail's reports, wrong for two days
  withA(ctx,fin(t,tF-0.2,0.5)*(1-fin(t,tBr-0.4,0.4)),()=>tag(ctx,1135,760,"34 flows in and out of the data platform: not on her map",SOFT,{align:"center",size:30}));
  withA(ctx,fin(t,w("broke","nightly")-0.2,0.5)*(1-fin(t,tUp-0.4,0.4)),()=>tag(ctx,1135,760,"a nightly read of the customer system",AMBER,{align:"center",size:30}));
  withA(ctx,fin(t,tUp-0.2,0.5)*(1-fin(t,tAs-0.4,0.4)),()=>p4_chip(ctx,P4_AC(1),P4_AY-34,"upgraded",{align:"center",col:APPC}));
  const rA=fin(t,w("broke","retail's reports")-0.3,0.6)*(1-fin(t,tAs-0.4,0.4));if(rA>0.01)arrive(ctx,1540,770,t,w("broke","retail's reports")-0.2,()=>psaCard(ctx,1240,690,600,"retail's reports",["wrong for two days"],AMBER,{size:30,a:rA}),{dy:-10});
  withA(ctx,fin(t,w("broke","nobody")-0.2,0.5)*(1-fin(t,tAs-0.4,0.4)),()=>tag(ctx,800,760,"nobody upgrading it knew it was there",AMBER,{align:"center",size:30}));
  // Yasmin's rule, proposed
  const kA=fin(t,tAs-0.1,0.6);if(kA>0.01)arrive(ctx,1135,770,t,tAs-0.1,()=>psaCard(ctx,775,680,720,"a rule, proposed by Yasmin",["every flow through the integration platform"],TECH,{size:30,a:kA}),{dy:-10});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Two kinds of traffic ---------- */
// a night's meter readings, in bulk: a broad band of fine lines from metering down to the data platform, its light running down it
function p4_bulk(ctx,t,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const x0=P4_AX(3)+40,x1=P4_AX(3)+210,X0=1330,X1=1600,y0=P4_AY+P4_AH,y1=P4_DP.y,p=o.p==null?1:o.p;ctx.save();
  const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(TECC,0.32));g.addColorStop(1,rgba(TECC,0.12));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y0);ctx.lineTo(lerp(x1,X1,p),lerp(y0,y1,p));ctx.lineTo(lerp(x0,X0,p),lerp(y0,y1,p));ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix(TECC,INK,0.3),0.6);ctx.lineWidth=1.4;ctx.setLineDash([10,14]);ctx.lineDashOffset=-t*60;for(let i=0;i<14;i++){const f=i/13;ctx.beginPath();ctx.moveTo(lerp(x0,x1,f),y0);ctx.lineTo(lerp(lerp(x0,x1,f),lerp(X0,X1,f),p),lerp(y0,y1,p));ctx.stroke();}ctx.setLineDash([]);ctx.restore();});}
// the night's readings sent as messages instead: one every DT s out of metering, each received where it enters the integration platform
// one at a time (SV s each), so a queue builds behind it and back into metering; then along to the events, where each stops again, and
// down to the data platform; those queued further back than metering's box stay inside it. tt: s since the first. Returns where each message is, and how busy each of the two stations is
const P4_Q={DT:0.24,SV:0.5,N:44,UP:0.3,SL:15,V:700,EW:0.25};
function p4_queue(tt){const{DT,SV,N,UP,SL,V,EW}=P4_Q,x3=P4_AC(3),M=P4_MY,len1=P4_AY-M,d1=(x3-P4_EX)/V,d2=(P4_DP.y-M)/V,pts=[],D=[];let free=0,busy=0,evb=0;
  for(let k=0;k<N;k++){const L=k*DT;if(tt<L)break;const S_=Math.max(L+UP,free),Dk=S_+SV;free=Dk;D.push(Dk);
    if(tt<S_){let q=0;for(let j=0;j<k;j++)q+=1-clamp((tt-D[j])/0.15,0,1);const y=P4_AY-Math.min((tt-L)/UP*len1,len1-q*SL);if(y<P4_AY+P4_AH-14)pts.push([x3,y]);continue;}
    if(tt<Dk){pts.push([x3,M]);busy=Math.max(busy,Math.sin(Math.PI*(tt-S_)/SV));continue;}
    const e=tt-Dk;if(e<d1)pts.push([x3-e*V,M]);else if(e<d1+EW){pts.push([P4_EX,M]);evb=Math.max(evb,Math.sin(Math.PI*(e-d1)/EW));}else if(e<d1+EW+d2)pts.push([P4_EX,M+(e-d1-EW)*V]);}
  return{pts,busy,evb};}
scene("kinds",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tMo=c("more"),tSm=c("small"),tBu=c("bulk"),tTh=c("through"),tRo=c("road");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Yasmin, where the chapter before left her, steps aside as Ravi comes in
  const sl=easeCam(clamp((t-1.2)/1.0,0,1)),rv=fin(t,1.4,0.7);psaWhole(ctx,rv,[0,380,300,1080],ctx=>person(ctx,"ravi",P4_TWO[0][0],1030,P4_TWO[0][1],{t}));
  person(ctx,"yasmin",lerp(P4_ONE[0],P4_TWO[1][0],sl),1030,lerp(P4_ONE[1],P4_TWO[1][1],sl),{t});
  // small messages, one at a time: a customer moved (the customer system to billing), a fault reported (outages to work orders), a job
  // done (work orders to outages); and, sent through instead of loaded, the night's readings, queuing to get into the integration platform
  const thA=fin(t,tTh-0.2,0.5)*(1-fin(t,tRo-0.5,0.5)),Q=thA>0.01?p4_queue(t-tTh):null;
  const under=ctx=>{[["customer moved",1,0],["fault",2,4],["job",4,2]].forEach(([wd,i,j])=>p4_msg(ctx,i,j,(t-w("small",wd)+0.1)/1.4));
    if(Q)withA(ctx,thA,()=>{const x3=P4_AC(3);ctx.save();ctx.strokeStyle=rgba(AMBER,0.55+0.4*Q.busy);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x3,P4_MY,13+2*Q.busy,0,TAU);ctx.stroke();ctx.restore();
      Q.pts.forEach(([x,y])=>{glow(ctx,x,y,16,AMBER,0.45);ctx.fillStyle=rgba(mix(AMBER,[255,255,255],0.4),1);ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();});});};
  p4_util(ctx,t,{under,shi:[0,Q?Q.evb*thA:0],un:1-0.6*fin(t,tSm-0.4,0.6)*(1-fin(t,tRo-0.4,0.6)),ahi:[pulseAt(t,w("small","customer moved")-0.1,1.4),pulseAt(t,w("small","customer moved")+0.9,1.2),pulseAt(t,w("small","fault")+0.9,1.2),fin(t,tBu-0.2,0.5)*(1-fin(t,tRo-0.4,0.5))*0.7,pulseAt(t,w("small","job")+0.9,1.2)]});
  withA(ctx,fin(t,tSm-0.2,0.5)*(1-fin(t,tBu-0.4,0.4)),()=>tag(ctx,1135,700,"between applications: small messages, one at a time",APPC,{align:"center",size:30}));
  // the three messages build a row, each with its runner, and stay until the bulk loads come in: never one over another
  {const SM=["a customer moved","a fault was reported","a job was done"],gp=22,ws=SM.map(s_=>p4_chipW(ctx,s_)),tot=ws.reduce((a,b)=>a+b,0)+gp*(SM.length-1);let x=1135-tot/2;
  SM.forEach((s_,i)=>{const t0=w("small",["customer moved","fault","job"][i])-0.2,xx=x;withA(ctx,fin(t,t0,0.4)*(1-fin(t,tBu-0.4,0.4)),()=>p4_chip(ctx,xx,780,s_,{col:APPC}));x+=ws[i]+gp;});}
  // bulk: a night's meter readings, loaded by the platform's own connectors; sent through as messages instead, each would stop at the
  // integration platform as a load changes horses at every station
  const bA=fin(t,tBu-0.2,0.6)*(1-fin(t,tTh-0.2,0.6))+fin(t,tRo-0.3,0.6);p4_bulk(ctx,t,bA,{p:clamp((t-tBu)/1.0,0,1)});
  withA(ctx,fin(t,tBu-0.2,0.5)*(1-fin(t,tTh-0.4,0.4)),()=>tag(ctx,1135,700,"into the data platform: bulk loads",TECC,{align:"center",size:30}));
  withA(ctx,fin(t,w("bulk","forty million")-0.2,0.5)*(1-fin(t,tTh-0.4,0.4)),()=>p4_chip(ctx,1135,780,"each night: 40 million meter readings",{align:"center",col:TECC}));
  withA(ctx,fin(t,w("bulk","Lakeflow")-0.3,0.5)*(1-fin(t,tTh-0.4,0.4)),()=>p4_chip(ctx,1610,612,"Lakeflow Connect",{align:"center",col:TECC,hi:pulseAt(t,w("bulk","Lakeflow"),1.4)}));
  if(thA>0.01)withA(ctx,thA,()=>{tag(ctx,1135,700,"each reading a message: a load changing horses at every station",AMBER,{align:"center",size:30});
    withA(ctx,fin(t,w("through","slower")-0.2,0.5),()=>p4_chip(ctx,1135,780,"slower, and costlier",{align:"center",col:AMBER}));});
  withA(ctx,fin(t,tRo-0.2,0.5),()=>{tag(ctx,1135,700,"both are flows, and both need governing",PS_OK,{align:"center",size:30});withA(ctx,fin(t,w("road","same road")-0.3,0.5),()=>p4_chip(ctx,1135,780,"just not the same road",{align:"center",col:PSC}));});
  withA(ctx,fin(t,w("half","nobody can see")-0.2,0.5)*(1-fin(t,tMo-0.4,0.4)),()=>tag(ctx,1135,700,"a flow nobody can see is a flow nobody can govern",PS_OK,{align:"center",size:30}));
  withA(ctx,fin(t,tMo-0.2,0.5)*(1-fin(t,tSm-0.4,0.4)),()=>tag(ctx,1135,700,"data comes and goes in more ways than messages",TECC,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 4. The simplest route for each ---------- */
scene("route",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tBu=c("bulk"),tEv=c("events"),tSe=c("serve"),tSi=c("simplest"),tFi=c("films");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  person(ctx,"ravi",P4_TWO[0][0],1030,P4_TWO[0][1],{t});person(ctx,"yasmin",P4_TWO[1][0],1030,P4_TWO[1][1],{t});
  const nat=clamp((t-w("bulk","natively")+0.2)/2.2,0,1),ev=clamp((t-w("events","subscribes")+0.2)/1.6,0,1),gw=clamp((t-w("serve","gateway")+0.1)/1.6,0,1);
  p4_util(ctx,t,{un:1,nat,ev,gw,svc:1,shi:[pulseAt(t,w("serve","gateway"),1.8),pulseAt(t,w("events","event on"),1.8)],ahi:[0,fin(t,tEv-0.2,0.5)*(1-fin(t,tSe-0.4,0.5)),fin(t,tSe-0.2,0.5)*(1-fin(t,tSi-0.4,0.5)),pulseAt(t,w("bulk","natively"),1.6),0],
    flowHi:f=>f.kind==="N"?pulseAt(t,w("bulk","own connectors"),1.6)*0.6:0,brk:fin(t,w("events","second way")-0.6,0.4)*(1-ev)});
  withA(ctx,fin(t,w("sort","one rule")-0.2,0.5)*(1-fin(t,tBu-0.4,0.4)),()=>tag(ctx,1135,700,"three kinds of flow, a rule for each",PSC,{align:"center",size:30}));
  const rows=[["bulk loads and history: native, the platform's own connectors",tBu,tEv],["a change in an application: the integration platform's events",tEv,tSe],["data served back to an application: through its gateway",tSe,tSi]];
  rows.forEach(([s_,a0,a1])=>withA(ctx,fin(t,a0-0.2,0.5)*(1-fin(t,a1-0.4,0.4)),()=>tag(ctx,1135,700,s_,TECC,{align:"center",size:30})));
  withA(ctx,fin(t,w("events","subscribes")-0.2,0.5)*(1-fin(t,tSe-0.4,0.4)),()=>p4_chip(ctx,1135,780,"the data platform subscribes: no second way in",{align:"center",col:TECC}));
  withA(ctx,fin(t,w("serve","already asks")-0.3,0.5)*(1-fin(t,tSi-0.4,0.4)),()=>p4_chip(ctx,1135,780,"the way every application already asks",{align:"center",col:TECC}));
  withA(ctx,fin(t,tSi-0.2,0.5)*(1-fin(t,tFi-0.4,0.4)),()=>tag(ctx,1135,700,"each flow: the simplest, cheapest, easiest to govern",PS_OK,{align:"center",size:30}));
  // where the rest is shown: two films, named on their chips
  withA(ctx,fin(t,tFi-0.2,0.5),()=>{p4_chip(ctx,820,740,"Data that moves",{align:"center",col:PSC});T(ctx,"how each kind is built",820,812,{w:600,size:28,align:"center",color:rgba(SOFT,1)});});
  withA(ctx,fin(t,w("films","A path")-0.2,0.5),()=>{p4_chip(ctx,1450,740,"A path for every provider",{align:"center",col:PSC});T(ctx,"choosing one for each source",1450,812,{w:600,size:28,align:"center",color:rgba(SOFT,1)});});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. One map, both teams ---------- */
// the flow map: every flow, where it starts and ends, its route, who owns it and its contract; four of the 34 shown, the rest counted
const P4_MAPC=[24,300,560,770,990],P4_MAPH=["from","to","route","owner","contract"];
const P4_MAPR=[["metering","data platform","native","network","meter readings, nightly"],["billing","data platform","native","finance","bills and payments"],["customer system","data platform","events","retail","customer moved"],["data platform","outages","gateway","network","restoration times"]];
function p4_map(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w_=1410,h_=394;glass(ctx,x,y,w_,h_,18,TECC,{glow:12+10*(o.hi||0),ea:0.85,fill:"rgba(6,12,12,0.96)"});
  T(ctx,"the flow map · kept by both teams",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(TECC,1)});
  P4_MAPH.forEach((h,i)=>T(ctx,h,x+P4_MAPC[i],y+100,{w:800,size:28,color:rgba(mix(TECC,INK,0.4),1)}));ctx.save();ctx.strokeStyle=rgba(TECC,0.4);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+20,y+118);ctx.lineTo(x+w_-20,y+118);ctx.stroke();ctx.restore();
  P4_MAPR.forEach((r,j)=>{const q=o.rows?clamp(o.rows*4-j,0,1):1;if(q<=0.01)return;withA(ctx,q,()=>r.forEach((s_,i)=>T(ctx,s_,x+P4_MAPC[i],y+164+j*52,{w:i===2?800:600,size:28,color:rgba(i===2?mix(TECC,INK,0.3):INK,0.94)})));});
  withA(ctx,o.foot==null?1:o.foot,()=>T(ctx,"and 30 more · 34 flows in all",x+24,y+h_-24,{w:700,size:28,color:rgba(o.footHi?mix(SOFT,PS_OK,o.footHi):SOFT,1)}));});}
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tKe=c("keep"),tRu=c("ruling"),tSe=c("sees");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  person(ctx,"ravi",P4_TWO[0][0],1030,P4_TWO[0][1],{t});person(ctx,"yasmin",P4_TWO[1][0],1030,P4_TWO[1][1],{t});
  // the diagram stays, dimmed under the map, and comes back at the end, so the next chapter glides on from it
  const mA=fin(t,w("map","one map")-0.3,0.6)*(1-fin(t,sc.dur-1.4,0.8)),dim=1-0.75*mA;
  p4_util(ctx,t,{un:1,nat:1,ev:1,gw:1,svc:1,dim});
  p4_map(ctx,430,190,{a:mA,rows:clamp((t-w("map","where it starts")+0.2)/2.2,0,1),hi:pulseAt(t,w("map","one map"),1.6),footHi:fin(t,tSe-0.2,0.6)});
  // both teams keep it; a new flow joins it in the pull request that builds it
  withA(ctx,fin(t,tKe-0.2,0.5)*(1-fin(t,tRu-0.4,0.4))*mA,()=>tag(ctx,800,660,"kept by the integration team and the data team",PSC,{align:"center",size:28}));
  const pA=fin(t,w("keep","pull request")-0.3,0.6)*(1-fin(t,tRu-0.4,0.4));if(pA>0.01)arrive(ctx,1440,780,t,w("keep","pull request")-0.2,()=>psaCard(ctx,1080,700,760,"pull request · a new flow",["built, and added to the map"],TECH,{size:28,a:pA,foot:"reviewed by the team whose platform carries it",footA:fin(t,w("keep","reviewed")-0.2,0.5),footTick:fin(t,w("keep","reviewed"),0.5),footCol:TECH}),{dy:-10});
  // as the ruling of 1764 wrote down every village and its horses
  const rA=fin(t,tRu-0.2,0.6)*(1-fin(t,tSe-0.4,0.5));if(rA>0.01){arrive(ctx,1620,770,t,tRu-0.1,()=>psaPaper(ctx,1420,680,400,190,["1764 · the ruling","679 villages,","each written down"],{kicker:true,size:30,a:rA,rot:-0.02}),{dy:-10});
    withA(ctx,fin(t,w("ruling","the map writes")-0.3,0.5),()=>tag(ctx,880,760,"every village and its horses · every flow and its route",PSC,{align:"center",size:28}));}
  withA(ctx,fin(t,tSe-0.2,0.5)*(1-fin(t,sc.dur-1.6,0.6)),()=>{tag(ctx,1135,690,"all 34 flows, seen",PS_OK,{align:"center",size:30});withA(ctx,fin(t,w("sees","Ravi")-0.2,0.5),()=>tag(ctx,1135,752,"and the routes that suit data, kept",TECC,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. A score for the outage app ---------- */
// a feeder: from a substation, one line along a street, with a few houses on short branches; o.risk lights it, from low to high
function p4_feeder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||mix(TECC,INK,0.2);ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.lineCap="round";
  glass(ctx,x-30,y-26,52,52,8,TECC,{glow:8,ea:0.7,fill:"rgba(8,14,12,0.95)"});ctx.beginPath();ctx.moveTo(x+22,y);ctx.lineTo(x+560,y);ctx.stroke();
  // the substation the feeder starts from, a bolt on it
  ctx.fillStyle=rgba(mix(PSC,INK,0.25),1);ctx.beginPath();[[3,-16],[-7,2],[0,2],[-4,16],[8,-3],[1,-3],[6,-16]].forEach(([u,v],k)=>k?ctx.lineTo(x-4+u,y+v):ctx.moveTo(x-4+u,y+v));ctx.closePath();ctx.fill();
  // the houses on its streets, their roofs up, on drops above and below the line, each with a lit window
  for(let i=0;i<5;i++){const bx=x+110+i*100,up=i%2===0,yb=up?y-30:y+70,hw=17,hh=24,rh=16;ctx.beginPath();ctx.moveTo(bx,y);ctx.lineTo(bx,up?yb:yb-hh-rh);ctx.stroke();
    ctx.save();ctx.fillStyle=rgba(mix([60,52,48],PSC,0.22),1);ctx.strokeStyle=rgba(mix(PSC,INK,0.35),0.85);ctx.lineWidth=2;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(bx-hw,yb);ctx.lineTo(bx-hw,yb-hh);ctx.lineTo(bx-hw-5,yb-hh);ctx.lineTo(bx,yb-hh-rh);ctx.lineTo(bx+hw+5,yb-hh);ctx.lineTo(bx+hw,yb-hh);ctx.lineTo(bx+hw,yb);ctx.closePath();ctx.fill();ctx.stroke();
    glow(ctx,bx,yb-hh/2,14,PSC,0.45);ctx.fillStyle=rgba(mix(PSC,[255,255,255],0.35),1);ctx.fillRect(bx-5,yb-hh/2-5,10,10);ctx.restore();}ctx.restore();});}
scene("score",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tMa=c("make"),tRo=c("route"),tRe=c("review"),tTe=c("test");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Ravi and Yasmin, where the chapter before left them, leave; Grace comes in
  const out=fin(t,1.0,0.6),gA=fin(t,1.3,0.7);if(out<1){psaWhole(ctx,1-out,[0,380,460,1080],ctx=>{person(ctx,"ravi",P4_TWO[0][0],1030,P4_TWO[0][1],{t});person(ctx,"yasmin",P4_TWO[1][0],1030,P4_TWO[1][1],{t});});}
  if(gA>0.01){psaWhole(ctx,gA,[0,380,440,1080],ctx=>person(ctx,"grace",P4_ONE[0],1030,P4_ONE[1],{t}));psaWho(ctx,P4_ONE[0]-10,510,"Grace Achieng","network operations",BIZ,fin(t,w("ask","Grace")-0.1,0.6)*(1-fin(t,sc.dur-1.1,0.6)));}
  const sc_=clamp((t-w("route","gateway")+0.6)/2.2,0,1),bk=fin(t,tMa-0.3,0.6);
  p4_util(ctx,t,{un:1,nat:1,ev:1,gw:1,svc:1,shi:[pulseAt(t,w("route","gateway"),1.8)+fin(t,tRe+w("review","adds")-tRe-0.2,0.5)*(1-fin(t,tTe-0.4,0.5))*0.6,0],ahi:[0,0,fin(t,w("ask","outage app")-0.3,0.5)*(1-fin(t,tMa-0.4,0.5))+pulseAt(t,w("route","already calls")-0.2,1.6)+fin(t,tTe-0.2,0.5),0,0],
    score:sc_,block:bk,blockDrop:clamp((t-tMa+0.3)/0.9,0,1),blockHi:pulseAt(t,w("make","makes the score"),1.6)});
  // Grace's ticket; what a feeder is
  const kA=fin(t,w("ask","ticket")-0.3,0.6)*(1-fin(t,tRe-0.4,0.4))+fin(t,tTe+0.2,0.6);if(kA>0.01)arrive(ctx,760,770,t,w("ask","ticket")-0.2,()=>psaCard(ctx,430,680,660,"ticket · raised by Grace, network",["each feeder's risk of a fault,","shown in the outage app"],BIZ,{size:28,a:Math.min(1,kA),foot:t>tTe?"closed":null,footA:fin(t,w("test","ticket closes")-0.1,0.5),footTick:fin(t,w("test","ticket closes")+0.1,0.4),footCol:PS_OK}),{dy:-10});
  const fA=fin(t,c("feeder")-0.3,0.6)*(1-fin(t,tMa-0.4,0.4));if(fA>0.01){p4_feeder(ctx,1210,800,{a:fA});withA(ctx,fA,()=>T(ctx,"a feeder: one line, a few streets",1500,712,{w:700,size:28,align:"center",color:rgba(mix(TECC,INK,0.4),1)}));}
  // network's data product makes the score, every hour, from the weather, each feeder's load and its past faults
  withA(ctx,fin(t,w("make","every hour")-0.2,0.5)*(1-fin(t,tRo-0.4,0.4)),()=>{tag(ctx,1465,700,"every hour, from",APPC,{align:"center",size:28});p4_chip(ctx,1465,770,"the weather · load · past faults",{align:"center",col:APPC});});
  // served back to an application: through the gateway, as an API the outage app already knows
  withA(ctx,fin(t,tRo-0.2,0.5)*(1-fin(t,tRe-0.4,0.4)),()=>{tag(ctx,1465,700,"served back: through the gateway",TECC,{align:"center",size:28});withA(ctx,fin(t,w("route","an API")-0.2,0.5),()=>p4_chip(ctx,1465,770,"an API it already calls",{align:"center",col:TECC}));});
  // the data team reviews the pull request; the integration team adds the route at its gateway; the flow goes on the map
  const pA=fin(t,tRe-0.2,0.6)*(1-fin(t,tTe-0.4,0.4));if(pA>0.01){arrive(ctx,760,770,t,tRe-0.1,()=>psaCard(ctx,430,690,660,"pull request · the feeder-risk score",["network's data product"],TECH,{size:28,a:pA,foot:"reviewed by the data team",footA:fin(t,w("review","reviews")-0.2,0.5),footTick:fin(t,w("review","reviews"),0.5),footCol:TECH}),{dy:-10});
    [["route added at the gateway",w("review","adds")],["on the map",w("review","on the map")]].forEach(([s_,t0],i)=>{const q=fin(t,t0-0.2,0.5);if(q>0.01)withA(ctx,q,()=>{p4_chip(ctx,1290,730+i*70,s_,{col:TECC});tick_(ctx,1262,730+i*70,16,PS_OK,fin(t,t0+0.1,0.4));});});}
  // Grace checks the scores in the outage app, in test
  const tA=fin(t,tTe-0.2,0.6);if(tA>0.01)arrive(ctx,1500,770,t,tTe-0.1,()=>{const h=psaCard(ctx,1180,680,660,"the outage app · in test",["feeder 12 · high","feeder 7 · low"],APPC,{size:28,a:tA,foot:"checked by Grace",footA:fin(t,w("test","checks")-0.1,0.5),footTick:fin(t,w("test","checks")+0.2,0.4),footCol:PS_OK});
    withA(ctx,tA,()=>{[[PS_RED,0],[PS_OK,1]].forEach(([col,i])=>{ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(1800,764+i*35,9,0,TAU);ctx.fill();});});},{dy:-10});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Better together ---------- */
scene("together",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tCu=c("customer"),tHe=c("help"),tBe=c("better");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Grace, where the chapter before left her, leaves; Ravi and Yasmin come back
  const out=fin(t,1.0,0.6),bA=fin(t,1.3,0.7);if(out<1)psaWhole(ctx,1-out,[0,380,440,1080],ctx=>person(ctx,"grace",P4_ONE[0],1030,P4_ONE[1],{t}));
  if(bA>0.01)psaWhole(ctx,bA,[0,380,460,1080],ctx=>{person(ctx,"ravi",P4_TWO[0][0],1030,P4_TWO[0][1],{t});person(ctx,"yasmin",P4_TWO[1][0],1030,P4_TWO[1][1],{t});});
  const cu=fin(t,tCu-0.2,0.5)*(1-fin(t,tHe-0.4,0.5)),tN=w("count","native"),tE=w("count","events"),tG=w("count","gateway");
  p4_util(ctx,t,{un:1,nat:1,ev:1,gw:1,svc:1,score:1,block:1,shi:[pulseAt(t,tG,1.6)+fin(t,w("help","serves")-0.2,0.5)*(1-fin(t,tBe-0.4,0.5))*0.7,pulseAt(t,tE,1.6)+fin(t,w("help","takes")-0.2,0.5)*(1-fin(t,tBe-0.4,0.5))*0.7],
    ahi:[0,cu+pulseAt(t,tCu,1.4),0,0,0],flowHi:f=>(f.kind==="N"?pulseAt(t,tN,1.6):0)+(f.a===1?cu:0),dphi:pulseAt(t,tN,1.6)*0.5});
  // the count: 25 native, now on the map; nine on the integration platform, six as its events and three through its gateway
  const kA=fin(t,tN-0.3,0.5)*(1-fin(t,tCu-0.4,0.4));if(kA>0.01)withA(ctx,kA,()=>{p4_chip(ctx,720,700,"25 native, on the map",{align:"center",col:TECC,hi:pulseAt(t,tN,1.4)});
    withA(ctx,fin(t,tE-0.3,0.5),()=>p4_chip(ctx,1240,700,"6 become events",{align:"center",col:TECC,hi:pulseAt(t,tE,1.4)}));withA(ctx,fin(t,tG-0.3,0.5),()=>p4_chip(ctx,1640,700,"3 through the gateway",{align:"center",col:TECC,hi:pulseAt(t,tG,1.4)}));
    withA(ctx,fin(t,tG+0.6,0.5),()=>T(ctx,"of the 34 flows they found",1135,790,{w:600,size:28,align:"center",color:rgba(SOFT,1)}));});
  // the customer system: nothing reads it unseen; when it's next upgraded, the map shows which flows it touches
  withA(ctx,cu,()=>{tag(ctx,1135,700,"nothing reads the customer system unseen",PS_OK,{align:"center",size:30});withA(ctx,fin(t,w("customer","upgraded")-0.2,0.5),()=>p4_chip(ctx,1135,780,"next upgrade: the map shows the 8 flows it touches",{align:"center",col:TECC}));});
  // the two platforms help each other
  withA(ctx,fin(t,tHe-0.2,0.5)*(1-fin(t,tBe-0.4,0.4)),()=>{p4_chip(ctx,1135,700,"the data platform takes the integration platform's events",{align:"center",col:TECC});withA(ctx,fin(t,w("help","serves")-0.2,0.5),()=>p4_chip(ctx,1135,770,"the integration platform serves the data platform's products",{align:"center",col:TECC}));});
  withA(ctx,fin(t,tBe-0.2,0.5),()=>tag(ctx,1135,740,"better together, for operations and governance",PS_OK,{align:"center",size:32}));
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p4_room(ctx,S,t);
  const tN=c("node"),tF=c("flows"),tP=c("principle");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const MOT=LAY6[0][1];
  psaBand(ctx,30,130,"motivation",MOT,fin(t,0.2,0.8));psaBand(ctx,180,310,"application layer",APPC,fin(t,0.3,0.8));psaBand(ctx,510,300,"technology layer",TECC,fin(t,0.5,0.8));
  // the application layer: three applications, and two domains' data products
  const AP=[["customer system",360,226],["metering",820,226],["outages",1280,226]],DP_=[["retail data products",360,370],["network data products",1040,370]];
  AP.forEach(([nm,x,y],i)=>psaEl(ctx,x,y,330,84,nm,APPC,"component",{a:fin(t,0.8+i*0.12,0.6),size:28}));DP_.forEach(([nm,x,y],i)=>psaEl(ctx,x,y,420,84,nm,APPC,"component",{a:fin(t,1.2+i*0.12,0.6),size:28}));
  // the technology layer: the integration platform, a node beside the data platform, with services of its own
  const node=(x,w_,name,o)=>{psaEl(ctx,x,560,w_,230,"",TECC,"node",o);withA(ctx,o.a==null?1:o.a,()=>T(ctx,name,x+26,604,{w:800,size:30,color:rgba(INK,0.95)}));};
  node(1000,820,"the data platform",{a:fin(t,0.9,0.6)});psaEl(ctx,1030,680,230,64,"connectors",TECC,"service",{a:fin(t,1.0,0.5),size:28});
  node(140,800,"the integration platform",{a:fin(t,tN-0.4,0.6),hi:pulseAt(t,w("node","beside"),1.6)});
  ["gateway","events"].forEach((s_,i)=>psaEl(ctx,170+i*250,680,220,64,s_,TECC,"service",{a:fin(t,w("node",i?"events":"a gateway")-0.3,0.5),size:28,hi:pulseAt(t,w("node",i?"events":"a gateway"),1.4)}));
  // the flows, each labelled with its route
  const FL=[[575,310,575,370,"events",w("flows","drawn")],[985,310,1180,370,"native",w("flows","labelled")],[1340,370,1400,310,"gateway",w("flows","route")]];
  FL.forEach(([x0,y0,x1,y1,lab,t0])=>{const q=clamp((t-t0+0.3)/0.6,0,1);psaRel(ctx,x0,y0,x1,y1,"flow",APPC,fin(t,t0-0.3,0.4),q);withA(ctx,fin(t,t0+0.1,0.4),()=>p4_chip(ctx,(x0+x1)/2+(lab==="native"?-20:lab==="gateway"?80:-110),(y0+y1)/2,lab,{align:"center",col:TECC,size:28}));});
  withA(ctx,fin(t,tF-0.2,0.5)*(1-fin(t,tP-0.4,0.4)),()=>tag(ctx,960,850,"34 flows, each labelled with the route it takes",APPC,{align:"center",size:28}));
  // the rule, as a principle
  archEl(ctx,330,50,1260,90,"each flow on its simplest, cheapest, best-governed route; every flow on the map",MOT,"principle",{size:28,a:fin(t,w("principle","principle")-0.3,0.6),hi:pulseAt(t,w("principle","principle"),1.4)});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. Two kinds of horse, one ruling ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tQ=c("quarrels"),tD=c("data"),tN=c("next"),outA=1-fin(t,B+0.6,0.8),rA=(1-fin(t,tD-0.6,0.9))*outA,pA=fin(t,tD-0.6,0.9)*outA;if(outA<1)p4_base(ctx,S);
  psaRooms(ctx,[[rA,ctx=>{p4_road(ctx,S,t);ctx.save();drift(ctx,t,{dur:tD+1},{z:0.02,y:640});psaStation(ctx,960,760,0.95,{lit:1});const G=790,hS=0.66;
    // the farmers' horses, going one way; a station's horse with its load, the other; both on the same road
    const[dF,aF]=p4_go(t,0.3,40,psaPace("horse",0.62,1.2)),[dR,aR]=p4_go(t,0.6,40,psaPace("horse",hS,1.0));p4_string(ctx,-200+dF,G,0.62,t,{rate:1.05,hrate:1.2,amp:aF});
    psaHorse(ctx,2060-dR,G,hS,t,{dir:-1,ph:0.4,rate:1.0,amp:aR,pack:true});psaWalker(ctx,2060-dR-175,G,0.92,t,{kind:"walker",dir:-1,ph:0.8,rate:0.85,amp:aR});
    withA(ctx,fin(t,w("road","same roads")-0.3,0.6),()=>tag(ctx,960,190,"the same roads, under one ruling",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,tQ-0.2,0.5),()=>tag(ctx,960,252,"the quarrels went on; now a ruling settled them",SOFT,{align:"center",size:30}));
    ctx.restore();eaYear(ctx,80,80,"Shinano",CLAY,fin(t,0.4,0.6));}],
  [pA,ctx=>{p4_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:12},{z:0.012,y:500,x:1100});
    person(ctx,"ravi",P4_TWO[0][0],1030,P4_TWO[0][1],{t});person(ctx,"yasmin",P4_TWO[1][0],1030,P4_TWO[1][1],{t});
    p4_util(ctx,t,{un:1,nat:1,ev:1,gw:1,svc:1,score:1,block:1,dphi:pulseAt(t,w("data","two platforms"),1.6)*0.5,bhi:pulseAt(t,w("data","two platforms")+0.2,1.6)*0.5});
    withA(ctx,fin(t,w("data","one map")-0.3,0.6),()=>tag(ctx,1135,720,"every flow on one map",PS_OK,{align:"center",size:30}));
    ctx.restore();
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,1135,800,"Next: Security all the way through",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"Where it meets the applications","Each flow on the route that suits it, and every flow on one map.","film 4 of 8");});

/* where the chapters meet: the utility's chapters glide on from one to the next in one room (From words to data's joins.js); what
   stays stays put, and whoever comes or goes does so after the join */
const CHAPTER_JOINS={glide:["kinds","route","map","score","together"]};
