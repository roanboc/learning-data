/* ===== Data architecture: the series' components =====
   The third series on enterprise architecture, after The map before the data and Business architecture for data. Inés Duarte, the
   utility's data architect, works between the business and the systems: what the pyramid of data gets wrong, where each fact is born,
   how it travels, who owns which data, and one language kept for it. Drawn in The map before the data's look (its ea.js and people.js:
   paper drafts on a wall, the confirmed model in glass, the six layers in their colours), with the films' primitives (glass, T, tag,
   glow, withA, fin), From words to data's (sheet, pencilText, ring, tick_, arrowTo, wrapT) and In the weeds of data crafting's motion
   (spring, arrive, drift, motes). Everything here is shared by the series' films; each film keeps its own pictures (prefixed d<n>_).
   One true story runs through the series, Project Cybersyn (Chile, 1971 to 1973), told in the series' own drawing, not in the style
   of the time's art: a telex network, a few numbers a day from each factory, software that passed on only what was out of line, and
   each factory left to solve its own problems. Its people are real, so they are drawn as silhouettes, never as faces. */

/* ---------- colours ---------- */
// the series' colour is the information layer's, the layer DAMA's data architecture works in; the business layer above it and the
// application layer below it keep The map before the data's colours
const DAC=LAY6[3][1],BUSC=LAY6[2][1],INFC=LAY6[3][1],APPC=LAY6[4][1],TECC=LAY6[5][1];
// Project Cybersyn, in the early 1970s: telex paper and its ink, a factory's lamps, the Andes at dusk, and a number out of line
const CY_PAPER="#efe6cf",CY_INK=[52,48,46],CY_LAMP=[255,204,128],CY_ANDES=[128,150,190],CY_SIG=[255,172,84];

/* ---------- titles ---------- */
// the series' mark: three layers of the map, business, information and application, with the information layer lit between them
function daMark(ctx,x,y,s,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{[2,3,4].forEach((li,i)=>{const q=clamp(p*3-i,0,1);if(q<=0)return;
  const col=LAY6[li][1],mid=i===1,cy=y-s*0.62+i*s*0.62+(1-spring(q*1.4))*-s*0.5;
  withA(ctx,clamp(q*2,0,1)*(mid?1:0.72),()=>{ctx.save();ctx.shadowColor=rgba(col,mid?0.8:0.4);ctx.shadowBlur=mid?18:8;rhomb(ctx,x,cy,s*2.6,s*0.95);
    ctx.fillStyle=rgba(col,mid?0.3:0.1);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*(mid?0.11:0.07);ctx.stroke();ctx.restore();});});});}
// the size a title is set at so it fits the frame: at most 92 px, smaller for a long one
function daFit(ctx,s,size,w,maxW){const m=tw(ctx,s,size,w);return m>maxW?Math.floor(size*maxW/m):size;}
// the title card, over whatever the chapter is drawing: the series, the film's title, and where it sits in the series. Its words come in
// once the picture under it has nearly gone dark, so they never sit over the picture's own words
function daTitle(ctx,S,t,t0,title,sub,n){const col=DAC,oA=fin(t,t0,0.8),tA=fin(t,t0+0.7,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);daMark(ctx,960,392,30,1,(t-t0-0.5)/1.4);T(ctx,"DATA ARCHITECTURE",960,458,{w:800,size:30,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,560,{w:800,size:daFit(ctx,title,92,800,1640),align:"center"});if(sub)T(ctx,sub,960,632,{w:600,size:36,align:"center",color:rgba(SOFT,0.95)});
    if(n)withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,712,n,col,{align:"center",size:28}));});}
// the end card: the film's last line, the mark, its title and where it sits
function daEnd(ctx,S,t,t0,title,line,n){const col=DAC,oA=fin(t,t0,1.0),tA=fin(t,t0+0.9,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,410,{w:700,size:daFit(ctx,line,44,700,1700),align:"center"});daMark(ctx,960,540,20,0.95,1);
    T(ctx,title,960,622,{w:800,size:daFit(ctx,title,44,800,1500),align:"center",color:rgba(col,1)});
    T(ctx,"Data architecture"+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",color:rgba(SOFT,0.9)});});}
// a year and a place, in the corner, in the story's lamp colour
function daYear(ctx,x,y,s,a){eaYear(ctx,x,y,s,CY_LAMP,a);}

/* ---------- people ---------- */
// Inés Duarte, the utility's data architect, who leads the series: the technical side (cyan), like Tomás. Drawn like The map before
// the data's cast (When things go wrong's character sheet), looked at full size facing both ways before any film used her.
PEOPLE.ines={name:"Inés Duarte",role:"Data architect",side:"Technical",does:"produces",edge:TECH,seed:21,
  skin:[200,150,116],hair:{style:"bob",c:[46,32,28],streak:[112,82,66]},earrings:[236,206,150],
  top:{kind:"sweater",c:[150,84,62],inner:[236,230,220]},bottom:{c:[44,46,58]},shoe:[54,42,36],build:{sh:66,hip:60,h:0.95}};
// a face that changes from one expression to another over a moment, never in one frame: m (0..1) mixes a into b
function daExpr(a,b,m){if(!(m>0))return a;if(m>=1)return b;const A=EXPR[a],B=EXPR[b],o={},q=Math.round(m*20)/20;
  for(const k of new Set([...Object.keys(A),...Object.keys(B)])){const u=A[k]==null?0:A[k],v=B[k]==null?0:B[k];o[k]=u+(v-u)*q;}
  if(B.happy&&q<1)delete o.happy;const key="__da_"+a+"_"+b+"_"+q;EXPR[key]=o;return key;}
// someone in the room, facing the other way when dir is -1 (the picture is mirrored, so the face turns with it)
function daPerson(ctx,id,x,y,s,o){o=o||{};if((o.a==null?1:o.a)<=0.01)return;withA(ctx,o.a==null?1:o.a,()=>{if(o.dir===-1){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}else person(ctx,id,x,y,s,o);});}

/* ---------- Project Cybersyn: the story's pictures ---------- */
// someone in the story, as a silhouette lit from behind: the series draws Cybersyn's people as figures, never as faces.
// x, y: where they stand; s: height in px (about 330 in the middle distance); o.walk: the phase of a walk (radians), o.dir: -1 faces
// left; o.board (0..1): holds a board to draw on, at the chest; o.rim: the light behind them; o.wide widens the body; o.beard
function daSil(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const k=s/330,ph=o.walk,dir=o.dir||1,col=o.col||[22,21,26],rim=o.rim||CY_LAMP,bd=o.board||0,wd=o.wide||1;
  // the figure is drawn whole into a spare canvas, at the size it's shown, then laid on the frame once, lit from behind: so it fades as
  // one picture, and the light runs round its outline only
  const M=ctx.getTransform(),ds=Math.hypot(M.a,M.b)||1,kk=k*ds,pad=26,ox=pad+70*kk,oy=pad+345*kk,w=Math.ceil(140*kk+pad*2),h=Math.ceil(360*kk+pad*2),[c,cx]=pcanvas("da_sil",w,h);
  cx.translate(ox,oy);cx.scale(kk*dir,kk);cx.fillStyle=rgba(col,1);
  const bob=ph==null?0:Math.abs(Math.cos(ph))*3,hip=-150+bob,sw=ph==null?0:Math.sin(ph);
  const seg=(x0,y0,x1,y1,w0,w1)=>{const an=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(an),ny=Math.cos(an);cx.beginPath();cx.moveTo(x0+nx*w0/2,y0+ny*w0/2);cx.lineTo(x1+nx*w1/2,y1+ny*w1/2);
    cx.arc(x1,y1,w1/2,an+Math.PI/2,an-Math.PI/2,true);cx.lineTo(x0-nx*w0/2,y0-ny*w0/2);cx.arc(x0,y0,w0/2,an-Math.PI/2,an+Math.PI/2,true);cx.fill();};
  // a leg: the thigh swings from the hip, the knee bends as the leg comes forward, and the shoe points the way they face
  const leg=(sd,q)=>{const a1=q*0.36,bend=ph==null?0:Math.max(0,Math.sin(ph+(sd>0?0:Math.PI)+1.3))*0.5,hx=9*sd,kx=hx+Math.sin(a1)*74,ky=hip+Math.cos(a1)*74,
    a2=a1-bend,ax=kx+Math.sin(a2)*72,ay=Math.min(-8,ky+Math.cos(a2)*72);seg(hx,hip,kx,ky,25,19);seg(kx,ky,ax,ay,19,13);cx.beginPath();cx.ellipse(ax+9,ay+3,17,7,0,0,TAU);cx.fill();};
  leg(-1,-sw);leg(1,sw);
  // the body, in a jacket: sloping shoulders, a waist, and the jacket's hem over the hips
  cx.save();cx.scale(wd,1);cx.beginPath();cx.moveTo(-9,-281+bob);cx.quadraticCurveTo(-30,-276+bob,-38,-262+bob);cx.quadraticCurveTo(-35,-224+bob,-28*wd,-192+bob);cx.lineTo(-30,hip+12);
  cx.lineTo(30,hip+12);cx.lineTo(28*wd,-192+bob);cx.quadraticCurveTo(35,-224+bob,38,-262+bob);cx.quadraticCurveTo(30,-276+bob,9,-281+bob);cx.closePath();cx.fill();cx.restore();
  // the arms, down, swinging a little against the legs; with a board, the near forearm comes up to hold it at the chest
  const as=-sw*0.16,fx=-38+Math.sin(as)*60,wx=-35+Math.sin(as)*110;seg(-34,-258+bob,fx,-200+bob,16,14);seg(fx,-200+bob,wx,-142+bob,14,11);cx.beginPath();cx.ellipse(wx,-134+bob,7,10,0,0,TAU);cx.fill();
  const ex=lerp(38-Math.sin(as)*60,32,bd),ey=-200+bob,hx2=lerp(35-Math.sin(as)*110,12,bd),hy2=lerp(-142,-210,bd)+bob;seg(34,-258+bob,ex,ey,16,14);seg(ex,ey,hx2,hy2,14,11);
  cx.beginPath();cx.ellipse(hx2,hy2+(bd>0.5?0:8),7,10,0,0,TAU);cx.fill();
  // the neck, the head, and the hair at the back of it
  cx.fillRect(-7,-292+bob,14,16);cx.beginPath();cx.ellipse(1,-309+bob,19,23,0,0,TAU);cx.fill();cx.beginPath();cx.ellipse(-3,-318+bob,19,16,-0.3,Math.PI*0.9,Math.PI*2.05);cx.fill();
  if(o.beard){cx.beginPath();cx.ellipse(5,-293+bob,17,15,0.1,0,TAU);cx.fill();}
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(rim,0.55);ctx.shadowBlur=14;ctx.drawImage(c,x-ox/ds,y-oy/ds,w/ds,h/ds);ctx.restore();
    // the board, held against the chest, its paper catching the light
    if(bd>0.01)withA(ctx,clamp(bd*1.5,0,1),()=>{ctx.save();ctx.translate(x,y);ctx.scale(k*dir,k);ctx.translate(16,-214+bob);ctx.rotate(-0.12);ctx.fillStyle="rgba(70,58,44,1)";ctx.fillRect(-30,-38,60,74);
      ctx.fillStyle="rgba(232,222,198,0.92)";ctx.fillRect(-25,-31,50,62);ctx.strokeStyle="rgba(90,84,80,0.6)";ctx.lineWidth=1.6;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-19,-20+i*13);ctx.lineTo(19-(i%2)*10,-20+i*13);ctx.stroke();}
      ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.ellipse(-31,14,8,10,0.3,0,TAU);ctx.fill();ctx.restore();});});}
// a factory of the time: brick walls under a sawtooth roof, a tall chimney and its smoke, the windows lit. x, y: the middle of its
// base; s: scale (1 = 440 px wide); o.lit (0..1) its windows; o.t moves the smoke; o.name: a label under it
function daFactory(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit,t=o.t||0;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const w=440,h=150,x0=-w/2,teeth=4,tw2=w/teeth;
    // smoke from the chimney, drifting with the wind, soft
    for(let i=0;i<6;i++){const u=((t*0.12+i/6)%1),r=16+u*44,px=150+u*120+Math.sin(u*5+i)*10,py=-h-250-u*130;const g=ctx.createRadialGradient(px,py,0,px,py,r);
      g.addColorStop(0,"rgba(190,186,190,"+(0.16*(1-u))+")");g.addColorStop(1,"rgba(190,186,190,0)");ctx.fillStyle=g;ctx.fillRect(px-r,py-r,2*r,2*r);}
    // the chimney
    const cg=ctx.createLinearGradient(130,0,170,0);cg.addColorStop(0,"#5a3a30");cg.addColorStop(0.4,"#7a5040");cg.addColorStop(1,"#3a2620");ctx.fillStyle=cg;
    ctx.beginPath();ctx.moveTo(132,-h);ctx.lineTo(138,-h-250);ctx.lineTo(162,-h-250);ctx.lineTo(168,-h);ctx.closePath();ctx.fill();ctx.fillStyle="#2c1e1a";ctx.fillRect(134,-h-256,32,12);
    // the hall: brick walls, lit from the left
    const wg=ctx.createLinearGradient(x0,-h,w/2,0);wg.addColorStop(0,"#7a4c3c");wg.addColorStop(1,"#4a2e26");ctx.fillStyle=wg;ctx.fillRect(x0,-h,w,h);
    ctx.strokeStyle="rgba(30,18,14,0.35)";ctx.lineWidth=1;for(let r=1;r<10;r++){ctx.beginPath();ctx.moveTo(x0,-r*15);ctx.lineTo(w/2,-r*15);ctx.stroke();}
    // the sawtooth roof: each tooth's steep face is glass, facing away from the sun
    for(let i=0;i<teeth;i++){const tx=x0+i*tw2;ctx.beginPath();ctx.moveTo(tx,-h);ctx.lineTo(tx+tw2*0.78,-h-58);ctx.lineTo(tx+tw2,-h-58);ctx.lineTo(tx+tw2,-h);ctx.closePath();
      ctx.fillStyle="#3a2a28";ctx.fill();ctx.fillStyle=rgba(mix([60,70,90],CY_LAMP,lit*0.7),0.95);ctx.fillRect(tx+tw2*0.8,-h-54,tw2*0.18,52);}
    // the windows, lit from inside, and their glow on the ground
    for(let i=0;i<7;i++){const wx=x0+26+i*58;ctx.fillStyle=rgba(mix([40,44,56],CY_LAMP,lit),1);rr(ctx,wx,-h+34,34,64,4);ctx.fill();
      ctx.strokeStyle="rgba(30,20,16,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(wx+17,-h+34);ctx.lineTo(wx+17,-h+98);ctx.moveTo(wx,-h+66);ctx.lineTo(wx+34,-h+66);ctx.stroke();}
    if(lit>0.01)glow(ctx,0,-h+60,300,CY_LAMP,0.1*lit);
    // the gate
    ctx.fillStyle="#22160f";rr(ctx,-34,-62,68,62,6);ctx.fill();ctx.restore();
    if(o.name)T(ctx,o.name,x,y+44*Math.max(0.8,s),{w:700,size:o.size||30,align:"center",color:rgba(o.col||INK,0.95)});});}
// a telex machine of the time, a teleprinter: a cabinet on a stand, a keyboard sloping towards the operator, a roll of paper coming
// out of the top with what was typed. x, y: the middle of its feet; s: scale (1 = 300 px wide); o.paper (0..1): how much paper has come
// out; o.typing: the moment keys are struck (a key dips); o.lines: how many lines are typed on what's out
function daTelex(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const pp=clamp(o.paper==null?0.5:o.paper,0,1),t=o.t||0;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    // the stand
    ctx.strokeStyle="#2a2a2e";ctx.lineWidth=8;ctx.lineCap="round";[-110,110].forEach(lx=>{ctx.beginPath();ctx.moveTo(lx,-150);ctx.lineTo(lx*1.05,0);ctx.stroke();});ctx.beginPath();ctx.moveTo(-106,-60);ctx.lineTo(106,-60);ctx.lineWidth=5;ctx.stroke();
    // the paper, rising from the platen at the back, its lines typed in rows
    const ph=30+pp*230,px=-92,py=-312-ph;ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.fillStyle=CY_PAPER;ctx.beginPath();ctx.moveTo(px,-300);ctx.lineTo(px+4,py);ctx.lineTo(px+180,py-4);ctx.lineTo(px+184,-300);ctx.closePath();ctx.fill();ctx.restore();
    const nl=o.lines==null?Math.floor(ph/22):o.lines;ctx.fillStyle=rgba(CY_INK,0.7);for(let i=0;i<nl&&i*22+16<ph-6;i++){const ly=-312-14-i*22,len=60+hash(i,71)*96;ctx.fillRect(px+14,ly,len,5);}
    // the platen, a black roll, and the cabinet's top
    ctx.fillStyle="#1c1c20";rr(ctx,-118,-322,236,30,14);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(-110,-316,220,4);
    const bg=ctx.createLinearGradient(0,-300,0,-150);bg.addColorStop(0,"#c4bba6");bg.addColorStop(1,"#8c836f");ctx.fillStyle=bg;
    ctx.beginPath();ctx.moveTo(-150,-296);ctx.lineTo(150,-296);ctx.lineTo(158,-150);ctx.lineTo(-158,-150);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(40,36,30,0.5)";ctx.lineWidth=2;ctx.stroke();
    // the keyboard, sloping towards the operator: four rows of round keys; one dips as it's struck
    const kd=o.typing==null?-1:Math.floor((t*9)%44);ctx.fillStyle="#6c6556";ctx.beginPath();ctx.moveTo(-140,-226);ctx.lineTo(140,-226);ctx.lineTo(150,-160);ctx.lineTo(-150,-160);ctx.closePath();ctx.fill();
    for(let r=0;r<4;r++)for(let c=0;c<11;c++){const i=r*11+c,kx=-118+c*23.6+r*5,ky=-214+r*15,dip=i===kd?2:0;ctx.fillStyle="#2a2826";ctx.beginPath();ctx.ellipse(kx,ky+dip,8,5.5,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(230,224,210,0.35)";ctx.beginPath();ctx.ellipse(kx,ky-1.5+dip,5,2.5,0,0,TAU);ctx.fill();}
    ctx.restore();});}
// Chile, from Arica to Cape Horn, as the coast and the border run: [latitude, longitude], the coast going south, then the border
// coming north. Drawn tall and narrow, as the country is: more than 4,000 km long and, on average, under 200 km wide.
const DA_CHILE=[[-17.5,-70.4],[-18.48,-70.32],[-20.2,-70.15],[-22.1,-70.25],[-23.1,-70.6],[-23.65,-70.4],[-25.4,-70.5],[-27.07,-70.83],[-28.5,-71.25],[-29.95,-71.35],
  [-31.6,-71.55],[-33.05,-71.62],[-34.5,-72.05],[-35.3,-72.4],[-36.6,-72.95],[-36.8,-73.15],[-37.6,-73.65],[-38.6,-73.5],[-39.8,-73.4],[-40.6,-73.85],[-41.6,-73.8],
  [-42.0,-74.05],[-42.6,-74.2],[-43.3,-74.4],[-44.0,-74.3],[-45.0,-74.6],[-46.0,-75.1],[-46.6,-75.65],[-47.5,-75.3],[-48.5,-75.6],[-49.5,-75.5],[-50.5,-75.4],[-51.5,-75.2],
  [-52.5,-74.6],[-53.2,-73.8],[-54.0,-72.5],[-54.6,-71.0],[-55.1,-69.5],[-55.6,-68.0],[-55.98,-67.27],[-55.0,-66.6],[-54.9,-68.6],[-52.65,-68.6],[-52.4,-69.4],[-52.0,-71.9],
  [-51.0,-72.3],[-50.0,-73.3],[-49.0,-73.0],[-48.0,-72.3],[-47.0,-71.9],[-46.0,-71.8],[-45.0,-71.6],[-44.0,-71.8],[-43.0,-71.8],[-42.0,-71.7],[-41.0,-71.85],[-40.0,-71.6],
  [-39.0,-71.0],[-38.0,-71.1],[-37.0,-71.1],[-36.0,-70.4],[-35.0,-70.3],[-34.0,-70.0],[-33.0,-70.0],[-32.0,-70.2],[-31.0,-70.3],[-30.0,-69.9],[-29.0,-69.8],[-28.0,-69.0],
  [-27.0,-68.6],[-26.0,-68.4],[-25.0,-68.4],[-24.0,-67.3],[-23.0,-67.2],[-22.0,-67.9],[-21.0,-68.4],[-20.0,-68.6],[-19.0,-69.0],[-18.0,-69.2],[-17.5,-69.5]];
// industrial towns along the country, from north to south, where the dots of the telex network sit: the films name none of them
const DA_SITES=[[-18.48,-70.32],[-20.2,-70.15],[-22.3,-68.9],[-23.65,-70.4],[-27.37,-70.33],[-29.9,-71.25],[-32.8,-71.2],[-33.05,-71.62],[-33.6,-70.9],[-34.17,-70.74],
  [-35.43,-71.66],[-36.6,-72.1],[-36.62,-72.96],[-36.77,-73.1],[-38.74,-72.6],[-39.81,-73.24],[-41.47,-72.94],[-45.57,-72.07],[-53.16,-70.92]];
const DA_SANTIAGO=[-33.45,-70.67];
// where a place in Chile is drawn, for a map whose top-left is at x, y and whose height, Arica to Cape Horn, is h
function daChileXY(lat,lon,x,y,h){const ky=h/38.6,kx=ky*0.82;return[x+(lon+76)*kx,y+(-lat-17.4)*ky];}
// the map: the land, its coast lit, Santiago, and the telex lines from the towns to Santiago, drawn as o.lines goes from 0 to 1;
// o.pulse(i) (0..1) sends a message along line i to Santiago; o.dots (0..1) the towns; o.label: false for none, "left" to name
// Santiago over the sea, clear of anything drawn to the east of it
function daChile(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const P=DA_CHILE.map(([la,lo])=>daChileXY(la,lo,x,y,h));
  ctx.save();ctx.beginPath();P.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"#33302c");g.addColorStop(0.5,"#2a3036");g.addColorStop(1,"#26303c");
  ctx.fillStyle=g;ctx.shadowColor=rgba(CY_ANDES,0.5);ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=rgba(CY_ANDES,0.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();
  const[sx,sy]=daChileXY(DA_SANTIAGO[0],DA_SANTIAGO[1],x,y,h),L=o.lines||0,D=o.dots==null?L>0?1:0:o.dots;
  DA_SITES.forEach(([la,lo],i)=>{const[px,py]=daChileXY(la,lo,x,y,h),q=clamp(L*1.6-i/DA_SITES.length*0.6,0,1);
    if(q>0.01){ctx.save();ctx.strokeStyle=rgba(CY_LAMP,0.55);ctx.lineWidth=1.8;ctx.beginPath();const steps=20;for(let k=0;k<=steps*q;k++){const u=k/steps,bx=lerp(px,sx,u)+Math.sin(u*Math.PI)*(i%2?14:-14),by=lerp(py,sy,u);k?ctx.lineTo(bx,by):ctx.moveTo(bx,by);}ctx.stroke();ctx.restore();}
    const pu=o.pulse?o.pulse(i):0;if(pu>0&&pu<1){const bx=lerp(px,sx,pu)+Math.sin(pu*Math.PI)*(i%2?14:-14),by=lerp(py,sy,pu);glow(ctx,bx,by,16,CY_LAMP,0.5);ctx.fillStyle=rgba(CY_LAMP,1);ctx.beginPath();ctx.arc(bx,by,3.5,0,TAU);ctx.fill();}
    if(D>0.01)withA(ctx,clamp(D*2-i/DA_SITES.length,0,1),()=>{ctx.fillStyle=rgba(CY_LAMP,0.95);ctx.beginPath();ctx.arc(px,py,4.5,0,TAU);ctx.fill();});});
  withA(ctx,o.city==null?1:o.city,()=>{glow(ctx,sx,sy,26,[255,240,220],0.5);ctx.fillStyle="#fff6e8";ctx.beginPath();ctx.arc(sx,sy,7,0,TAU);ctx.fill();
    if(o.label!==false)T(ctx,"Santiago",o.label==="left"?sx-22:sx+22,sy+10,{w:700,size:o.size||30,align:o.label==="left"?"right":"left",color:rgba(INK,0.95)});});});}
// a factory drawn as a flow, as the engineers drew each one before choosing what to measure: its steps in pencil boxes, joined by
// arrows, on a sheet. steps: their names; o.p (0..1) draws them in turn; o.marks: [[step index, name, appear 0..1], ...] rings the few
// numbers chosen, each named under its step
function daFlow(ctx,x,y,w,h,steps,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.008:o.rot,fill:CY_PAPER});
  const n=steps.length,gap=44,bw=(w-80-(n-1)*gap)/n,by=y+h*0.3,bh=96,p=o.p==null?1:o.p;
  if(o.title)pencilText(ctx,o.title,x+40,y+64,{size:32,w:700,p:clamp(p*4,0,1)});
  steps.forEach((s,i)=>{const q=clamp(p*(n+1)-i-0.4,0,1);if(q<=0)return;const bx=x+40+i*(bw+gap);pencilBox(ctx,bx,by,bw,bh,s,q,{size:Math.max(28,daFit(ctx,s,32,700,bw-20))});
    if(i<n-1){const r=clamp(q*2-1,0,1);if(r>0){const ax=bx+bw+6,ay=by+bh/2;ctx.save();ctx.strokeStyle="rgba(52,48,46,0.8)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+(gap-14)*r,ay);ctx.stroke();
      if(r>0.95){ctx.beginPath();ctx.moveTo(ax+gap-14,ay);ctx.lineTo(ax+gap-24,ay-7);ctx.moveTo(ax+gap-14,ay);ctx.lineTo(ax+gap-24,ay+7);ctx.stroke();}ctx.restore();}}});
  (o.marks||[]).forEach(([i,name,m],k)=>{if(!(m>0.01))return;const bx=x+40+i*(bw+gap)+bw/2,cy=by+bh+70+(k%2)*0;
    withA(ctx,clamp(m*2,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(o.mcol||[196,72,52],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(bx,by+bh/2,bw/2+12,bh/2+14,0,-Math.PI/2,-Math.PI/2+TAU*clamp(m*1.3,0,1));ctx.stroke();ctx.restore();
      pencilText(ctx,name,bx,cy,{size:30,w:700,align:"center",p:clamp(m*1.6-0.4,0,1),color:"rgba(150,52,40,0.95)"});});});});}
// one of a factory's few numbers, day by day, as the software watched it: a band where it was expected to be, each day a dot; a day
// out of the band is passed on (the story's amber), the days inside it stay where they are (grey). vals: each day's value, 0..1 of
// the chart's height; o.band: [low, high]; o.p (0..1) the days shown; o.out: the days out of the band, lit; o.dim (0..1) greys the rest
function daIndicator(ctx,x,y,w,h,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const[b0,b1]=o.band||[0.35,0.7],n=vals.length,p=o.p==null?1:o.p,dim=o.dim||0;
  glass(ctx,x,y,w,h,16,o.col||CY_ANDES,{glow:10,ea:0.7,fill:"rgba(10,12,18,0.92)"});const ix=x+28,iw=w-56,iy=y+(o.title?70:24),ih=h-(o.title?96:48);
  if(o.title)T(ctx,o.title,x+28,y+48,{w:700,size:30,color:rgba(INK,0.95)});
  ctx.fillStyle=rgba(o.col||CY_ANDES,0.14);ctx.fillRect(ix,iy+ih*(1-b1),iw,ih*(b1-b0));ctx.strokeStyle=rgba(o.col||CY_ANDES,0.4);ctx.setLineDash([6,6]);ctx.lineWidth=1.6;
  [b0,b1].forEach(b=>{ctx.beginPath();ctx.moveTo(ix,iy+ih*(1-b));ctx.lineTo(ix+iw,iy+ih*(1-b));ctx.stroke();});ctx.setLineDash([]);
  const out=new Set(o.out||vals.map((v,i)=>v<b0||v>b1?i:-1).filter(i=>i>=0)),shown=Math.floor(p*n+0.0001);
  ctx.strokeStyle=rgba(SOFT,0.35*(1-dim)+0.1);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<Math.min(shown,n);i++){const px=ix+iw*(i+0.5)/n,py=iy+ih*(1-vals[i]);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  for(let i=0;i<Math.min(shown,n);i++){const px=ix+iw*(i+0.5)/n,py=iy+ih*(1-vals[i]),isOut=out.has(i);
    if(isOut){glow(ctx,px,py,22,CY_SIG,0.5);ctx.fillStyle=rgba(CY_SIG,1);ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();}
    else{ctx.fillStyle=rgba(mix(INK,[90,96,110],dim),0.85);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();}}});}

/* ---------- the information layer: what the business means, and how each system records it ---------- */
// a business object: what the business means, in its words, on the business layer (yellow), as ArchiMate draws one
function daBO(ctx,x,y,w,h,name,o){archEl(ctx,x,y,w,h,name,BUSC,"object",o);}
// a data object: how one system records a business object, on the information layer (peach), the layer the map draws between the
// business and the applications; its name as that system calls it, and the system under it in plain type
function daDO(ctx,x,y,w,h,name,sys,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||INFC,hi=o.hi||0;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,col,{glow:12+14*hi,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.14+0.12*hi);rr(ctx,x,y,w,h,8);ctx.fill();
    archGlyph(ctx,"object",x+w-24,y+22,13,col);const sz=o.size||30,s2=daFit(ctx,name,sz,700,w-60);
    T(ctx,name,x+22,y+(sys?h/2-4:h/2+s2*0.36),{w:700,size:s2,color:rgba(INK,0.96)});
    if(sys)T(ctx,sys,x+22,y+h/2+34,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.25),0.92)});});}
// an application, as the map draws one (blue, with ArchiMate's component glyph): the system that keeps a data object
function daApp(ctx,x,y,w,h,name,o){archEl(ctx,x,y,w,h,name,APPC,"component",o);}
// realisation, as ArchiMate draws it: a dotted line with a hollow triangle where it meets what's realised (x1, y1); from the data
// object up to the business object it realises. p (0..1) draws it from the start
function daReal(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0.01)return;const a=o.a==null?1:o.a,col=o.col||mix(BUSC,INFC,0.5),ex=lerp(x0,x1,clamp(p,0,1)),ey=lerp(y0,y1,clamp(p,0,1));
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=o.lw||2.6;ctx.setLineDash([3,7]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
    if(p>0.97){const an=Math.atan2(y1-y0,x1-x0),s=14;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*s*1.4,y1-Math.sin(an-0.45)*s*1.4);ctx.lineTo(x1-Math.cos(an+0.45)*s*1.4,y1-Math.sin(an+0.45)*s*1.4);ctx.closePath();
      ctx.fillStyle="rgba(7,12,24,1)";ctx.fill();ctx.lineWidth=2.2;ctx.stroke();}ctx.restore();});}
// a flow, as ArchiMate draws it: a dashed line with a solid arrowhead, for data that moves from one place to another; p draws it
function daFlowLine(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0.01)return;const a=o.a==null?1:o.a,col=o.col||INFC;arrowTo(ctx,x0,y0,x1,y1,col,a,{p:clamp(p,0,1),dash:[10,8],lw:o.lw||2.8,bend:o.bend||0});}
// who owns something: a role's name on a chip, gold for the business side and cyan for the technical one, with ArchiMate's role glyph;
// x, y: its left end, at the middle of its height. Returns its width
function daOwner(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||BIZ,sz=o.size||28,w=tw(ctx,name,sz,700)+70;if(a<=0.01)return w;
  withA(ctx,a,()=>{glass(ctx,x,y-26,w,52,26,col,{glow:10+12*(o.hi||0),ea:0.8,fill:"rgba(16,14,10,0.94)"});archGlyph(ctx,"role",x+30,y,11,col);T(ctx,name,x+52,y+sz*0.36,{w:700,size:sz,color:rgba(mix(col,INK,0.4),1)});});return w;}
// a line nobody owns: a small hollow ring with a question mark, set on a line; when someone takes it, o.owned (0..1) fills it with a tick
function daUnowned(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;const own=o.owned||0;withA(ctx,a,()=>{if(own<1){withA(ctx,1-own,()=>{ctx.fillStyle="rgba(10,10,14,0.95)";ctx.beginPath();ctx.arc(x,y,22,0,TAU);ctx.fill();
  ring(ctx,x,y,22,BAD,1,2.4,[5,5]);T(ctx,"?",x,y+11,{w:800,size:30,align:"center",color:rgba(BAD,1)});});}if(own>0)kt_gtick(ctx,x,y,22,own);});}
