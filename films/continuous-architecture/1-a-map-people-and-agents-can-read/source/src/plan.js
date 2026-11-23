/* ===== A map people and agents can read: the film's own pictures (prefixed d11_) =====
   Babylon at night, 652 BCE, in the look of the series' shared components (../../../../ai-and-continuous-architecture/shared/src/aca.js):
   its sky, with this film's own full moon (dark and copper-red in an eclipse) and planets that don't twinkle; the city's roofs; the
   roof a scholar watches from, and the scholar himself, a silhouette lit along its edge by the moon, holding a tablet and a stylus as
   the Assyrian reliefs show scribes writing; a planet's path over many nights, with its loop; the diary as one tablet of clay, its
   words in English (no script is imitated), in the order the diaries keep; and the six hundred years it was kept, under four lines of
   kings, along one line of years that widens to reach today. Then, on the films' dark glass and on the wall: the map kept in an
   enterprise architecture tool (its window, its layers and a graph, fed by the systems that already keep many of its elements), each
   element once, with its ID, owner, evidence and status, and once as a text file, the simplest approach; its versions, a change
   proposed as a draft, the checks on the map, the views generated from it one way (with dbt's YAML and Databricks' catalogue), the
   map's agent and its rights, the retail code changing, and a newcomer's first day.
   The diaries' real watchers are never given a face: they are silhouettes, as all of Babylon's people are in this series. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1],TEC=LAY6[5][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what fails; green, for a check that passes
const D11_NET=[132,176,255],D11_RET=[255,150,186],D11_RED=[232,96,84],D11_OK=[132,226,160];
// a data rule, as this series draws one (ruleCard)
const D11_RULE=[170,205,255];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d11_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a label should keep on one line
const d11_nb=s=>s.replace(/ /g," ");

/* ---------- the newcomer ---------- */
// Zofia, a data engineer who joins next spring (cyan, the technical side, like Tomás), with a lanyard for her first day's badge
PEOPLE.zofia={name:"Zofia Nowak",role:"Data engineer",side:"Technical",does:"uses",edge:TECH,seed:21,
  skin:[230,192,160],hair:{style:"bob",c:[122,72,44],streak:[168,112,74]},lanyard:TECH,
  top:{kind:"sweater",c:[176,120,74]},bottom:{c:[48,56,74]},shoe:[44,38,40],build:{sh:66,hip:58,h:0.95}};

/* ---------- fading as one picture ---------- */
// a group (a person with their lit edge, or a picture), drawn whole into a spare canvas and faded as one, so nothing shows through
// itself: Continuous 2's a4_fade, in this film's own source
const D11_BUFS=[];let D11_DEPTH=0;
function d11_fade(ctx,a,fn){const ga=ctx.globalAlpha*a;if(ga<=0.002)return null;if(ga>=0.998){ctx.save();const r=fn(ctx);ctx.restore();return r;}const cv=ctx.canvas,d=D11_DEPTH;
  let b=D11_BUFS[d];if(!b||b.width!==cv.width||b.height!==cv.height)b=D11_BUFS[d]=mkCanvas(cv.width,cv.height);const o=b.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());D11_DEPTH++;let r=null;try{r=fn(o);}finally{D11_DEPTH--;}o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.drawImage(b,0,0);ctx.restore();return r;}

/* ---------- Babylon at night, 652 BCE: the watch ---------- */
// The city's roofs under the night sky, drawn in the series' look (aca.js: Babylon's sky, its skyline, its people as silhouettes),
// lit by the moon from above and to the right instead of the dawn. World space is wider than the frame, so the camera can move.
const D11_MOONLIT=[150,172,226],D11_NIGHT=[10,12,28],D11_ROOF=830,D11_WALL=772;
// the moon, full, at (x, y), r across: soft seas on its face; o.ecl (0..1) the Earth's shadow crossing it from the left, until the
// whole moon is dark and copper-red, as it is in an eclipse; o.a its opacity
function d11_moon(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const e=clamp(o.ecl||0,0,1);
  withA(ctx,a,()=>{glow(ctx,x,y,r*5,[200,214,250],0.16*(1-0.85*e));
    ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();
    const g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);g.addColorStop(0,"rgba(250,246,232,1)");g.addColorStop(1,"rgba(214,210,200,1)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
    [[-0.28,-0.18,0.32],[0.2,-0.3,0.2],[0.12,0.12,0.26],[-0.18,0.32,0.18],[0.38,0.2,0.14]].forEach(([u,v,s])=>{ctx.fillStyle="rgba(150,148,150,0.28)";ctx.beginPath();ctx.ellipse(x+u*r,y+v*r,s*r,s*r*0.8,0.4,0,TAU);ctx.fill();});
    if(e>0.001){const R=r*2.4,cx=x-r-R+e*(r+R);// the shadow's edge moves across, from the left
      ctx.fillStyle="rgba(150,56,38,0.86)";ctx.beginPath();ctx.arc(cx,y,R,0,TAU);ctx.fill();
      ctx.fillStyle="rgba(40,16,14,"+(0.35*e)+")";ctx.beginPath();ctx.arc(cx,y,R*0.92,0,TAU);ctx.fill();
      const pg=ctx.createRadialGradient(cx,y,R,cx,y,R*1.25);pg.addColorStop(0,"rgba(30,20,30,0.45)");pg.addColorStop(1,"rgba(30,20,30,0)");ctx.fillStyle=pg;ctx.fillRect(x-r,y-r,2*r,2*r);}
    ctx.restore();if(e>0.6)glow(ctx,x,y,r*2.2,[200,90,60],0.22*(e-0.6)/0.4);});}
// a planet among the stars: a steady point that doesn't twinkle, with its own colour
function d11_planet(ctx,x,y,r,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*6,col,0.4);ctx.fillStyle=rgba(mix(col,[255,255,255],0.55),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();});}
// the night sky over the city: Babylon's sky before dawn, its stars, without the kit's crescent (this film draws its own moon)
function d11_night(ctx,t,o){o=o||{};bab_sky(ctx,t,{dawn:0,day:0,moon:false});ctx.fillStyle="rgb(14,15,32)";ctx.fillRect(-1600,BAB_HZ,5100,1500);
  // a few slow clouds, where the narration says they hid the sky; o.cloud (0..1)
  const cl=clamp(o.cloud||0,0,1);if(cl>0.01)for(let i=0;i<7;i++){const cx=-400+((t*14+i*420)%2600),cy=180+hash(i,721)*260,w=420+hash(i,722)*360;
    withA(ctx,cl*(0.5+0.4*hash(i,723)),()=>{const g=ctx.createRadialGradient(cx,cy,10,cx,cy,w*0.5);g.addColorStop(0,"rgba(58,62,92,0.95)");g.addColorStop(1,"rgba(58,62,92,0)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy,w*0.5,w*0.16,0,0,TAU);ctx.fill();});}}
// the city below the roof: the skyline on the horizon (aca.js), then nearer roofs, flat, of mud brick, with their parapets and
// stairs, a few palms, their tops touched by the moon; nothing lit, everyone asleep
const D11_HOUSES=(()=>{const R=[];let x=-1500;let i=0;while(x<3400){const w=120+hash(i,731)*200,h=50+hash(i,732)*70,y=BAB_HZ+20+hash(i,733)*46;R.push([x,y,w,h]);x+=w*(0.7+0.4*hash(i,734));i++;}return R;})();
function d11_city(ctx,t,o){o=o||{};bab_city(ctx,t,{dawn:0,day:0,gap:[-99999,-99998]});
  const col=[14,15,32],top=rgba(mix(col,D11_MOONLIT,0.32),1);
  D11_HOUSES.forEach(([x,y,w,h],i)=>{ctx.fillStyle=rgba(mix(col,[22,22,46],hash(i,735)),1);ctx.fillRect(x,y,w,h+200);ctx.fillStyle=top;ctx.fillRect(x,y,w,2);
    if(hash(i,736)>0.6){ctx.fillStyle=rgba(col,1);ctx.fillRect(x+w*0.15,y-12,w*0.22,12);ctx.fillStyle=top;ctx.fillRect(x+w*0.15,y-12,w*0.22,1.6);}
    if(hash(i,737)>0.82)bab_palm(ctx,x+w*0.6,y+4,90+hash(i,738)*50,t,{col:[12,13,30],lean:(hash(i,739)-0.5)*0.3,rim:0});});}
// the roof the scholar watches from: its packed-earth floor, and the low parapet of mud brick along its edge, its top lit by the moon
function d11_roof(ctx,t,o){o=o||{};const X0=-1600,X1=3500;
  const g=ctx.createLinearGradient(0,D11_ROOF,0,D11_ROOF+400);g.addColorStop(0,"rgba(30,30,52,1)");g.addColorStop(1,"rgba(12,12,24,1)");ctx.fillStyle=g;ctx.fillRect(X0,D11_ROOF,X1-X0,900);
  ctx.fillStyle="rgba(20,20,40,1)";ctx.fillRect(X0,D11_WALL,X1-X0,D11_ROOF-D11_WALL+2);
  ctx.strokeStyle="rgba(60,62,96,0.5)";ctx.lineWidth=1.2;ctx.beginPath();for(let y=D11_WALL+14;y<D11_ROOF;y+=14){ctx.moveTo(X0,y);ctx.lineTo(X1,y);}
  for(let k=0;k<4;k++){const y=D11_WALL+k*14;for(let x=X0+(k%2)*30;x<X1;x+=60){ctx.moveTo(x,y);ctx.lineTo(x,y+14);}}ctx.stroke();
  ctx.fillStyle=rgba(mix([20,20,40],D11_MOONLIT,0.5),1);ctx.fillRect(X0,D11_WALL-3,X1-X0,4);
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.fillRect(X0,D11_ROOF,X1-X0,10);}
// a small tablet of clay, at (x, y), w wide, as it rests on the parapet or in a hand: lit faintly by the moon; o.glow (0..1)
function d11_tab(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=w*0.68;withA(ctx,a,()=>{if(o.glow>0.01)glow(ctx,x,y,w*1.8,BAB_CLAY,0.35*o.glow);
  ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);rr(ctx,-w/2,-h/2,w,h,w*0.14);ctx.fillStyle=rgba(mix([60,48,40],BAB_CLAY,0.35+0.4*(o.glow||0)),1);ctx.fill();
  ctx.strokeStyle=rgba(mix([30,24,20],BAB_CLAY,0.3),0.9);ctx.lineWidth=Math.max(0.8,w*0.04);for(let i=1;i<4;i++){const yy=-h/2+i*h/4;ctx.beginPath();ctx.moveTo(-w*0.36,yy);ctx.lineTo(w*(0.36-0.12*(i%2)),yy);ctx.stroke();}ctx.restore();});}
// a scholar of Babylon on the roof, in profile, as a silhouette lit along the edge by the moon (aca.js draws the city's people this
// way, against the dawn): a tunic to the knee, a belt, a beard and hair to the neck. Feet at (x, y), h tall, facing o.dir. He holds
// a tablet in his far hand and a stylus in his near one, as the Assyrian reliefs show scribes writing: o.up (0..1) lifts his face to
// the sky, and lowers the tablet to his waist; at 0 he looks down at it and writes (o.write, 0..1, moves the stylus). o.step: a walk's
// phase, so he walks while it changes; o.tab (0..1): the tablet in his hand. The whole figure is one silhouette, filled once.
// Returns where the tablet is, in the frame.
function d11_scribe(ctx,x,y,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const k=h/100,dir=o.dir||1,up=clamp(o.up==null?1:o.up,0,1),wr=clamp(o.write||0,0,1),col=o.col||D11_NIGHT,rim=o.rim==null?0.6:o.rim;
  const walk=o.step!=null,sw=walk?Math.sin(o.step):0,tab=o.tab==null?1:o.tab,scr=wr*Math.sin(t*9)*1.2;
  // the hands: by the waist as he looks up; at the chest as he writes
  const hT=[lerp(17,14,up),lerp(-66,-55,up)],hS=[lerp(21+scr,12,up),lerp(-70,-53,up)];
  const path=()=>{ctx.beginPath();
    bab_leg(ctx,0,-50,0.42*sw,sw>0?0.32*sw:0.06);bab_leg(ctx,0,-50,-0.42*sw,sw<0?-0.32*sw:0.06);
    ctx.moveTo(-6,-81);ctx.quadraticCurveTo(-8.5,-66,-6.5,-56);ctx.quadraticCurveTo(-9,-40,-11.5,-25);ctx.lineTo(12.5,-25);ctx.quadraticCurveTo(9,-40,6.5,-56);ctx.quadraticCurveTo(8.5,-68,6,-81);ctx.quadraticCurveTo(0,-84,-6,-81);ctx.closePath();
    ctx.moveTo(-2.6,-87);ctx.lineTo(3.6,-87);ctx.lineTo(3.4,-79);ctx.lineTo(-2.8,-79);ctx.closePath();
    bab_arm(ctx,0,-79,lerp(6,4,up),lerp(-60,-62,up),hT[0],hT[1]);bab_arm(ctx,0,-79,lerp(9,3,up),lerp(-62,-63,up),hS[0],hS[1]);
    // the head turns as one, about the neck: up to the sky, or down to the tablet
    ctx.save();ctx.translate(1.5,-86);ctx.rotate(lerp(0.26,-0.42,up));ctx.translate(-1.5,86);
    ctx.moveTo(7.7,-92.5);ctx.ellipse(1.5,-92.5,6.2,7,0,0,TAU);ctx.moveTo(7.2,-94.4);ctx.lineTo(9,-91.4);ctx.lineTo(7.2,-90.2);ctx.closePath();
    ctx.moveTo(-4.4,-97.5);ctx.quadraticCurveTo(-7.4,-90,-6.4,-83);ctx.lineTo(-1,-84);ctx.closePath();ctx.moveTo(1.4,-88.6);ctx.lineTo(7.6,-88.2);ctx.quadraticCurveTo(8.2,-82,6.4,-79);ctx.lineTo(1,-79.4);ctx.closePath();
    ctx.restore();};
  const draw=(fill,ox,oy)=>{ctx.save();ctx.translate(x+ox,y+oy);ctx.scale(k*dir,k);path();ctx.fillStyle=fill;ctx.fill("nonzero");ctx.restore();};
  let at=null;
  withA(ctx,a,()=>{draw(rgba(mix(col,D11_MOONLIT,0.8),rim),Math.max(1.2,h*0.011)*dir,-Math.max(1,h*0.008));draw(rgba(col,1),0,0);
    // the tablet in his far hand, its face to the sky, and the stylus in the near one
    if(tab>0.01){const tx=x+(hT[0]+3)*k*dir,ty=y+(hT[1]-2)*k;at=[tx,ty];withA(ctx,tab,()=>d11_tab(ctx,tx,ty,13*k,{rot:dir*lerp(-0.5,-0.15,up),glow:o.glow||0}));
      ctx.save();ctx.strokeStyle=rgba(mix(col,D11_MOONLIT,0.4),1);ctx.lineWidth=Math.max(1,1.1*k);ctx.lineCap="round";ctx.beginPath();const sx=x+hS[0]*k*dir,sy=y+hS[1]*k;ctx.moveTo(sx,sy);ctx.lineTo(sx+dir*5*k,sy-lerp(5,1,up)*k);ctx.stroke();ctx.restore();}});
  return at;}
// a planet's path across the stars over many nights, with the loop it makes when it seems to go back for a while; u (0..1) along it
function d11_pathAt(u){const w=Math.exp(-Math.pow((u-0.52)/0.12,2));return[300+1320*u+66*Math.sin(2*Math.PI*3*u+1.0)*w,190-70*Math.sin(Math.PI*u)+30*Math.cos(2*Math.PI*3*u+1.0)*w];}

/* ---------- the diary, on clay ---------- */
// The diary as one tablet of clay, drawn large: its words in English (no script is imitated), in the order the diaries keep. Each
// night has a row in the same order (the moon, the planets among the stars, the weather); at the month's end, the river's level, the
// prices of six goods and what happened in the city. A night of clouds says so. o.rows[i] (0..1) writes night i; o.cols (0..1) lights
// the headings in turn; o.month (0..1) writes the month's end; o.cloud (0..1) the cloudy night; o.hi (0..1) a column, lit.
const D11_NIGHTS=[["1","Venus, in the west","clear",0.1],["2","Jupiter, near a star","clear",0.18],["3","Mars, moving back","windy",0.27],["4","Saturn, near a star","clear",0.36]];
const D11_GOODS=["barley","dates","mustard","cress","sesame","wool"];
// the moon as the diary notes it: a crescent that widens night by night (ph 0..0.5: new to half)
function d11_crescent(ctx,x,y,r,ph,col){ctx.save();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,Math.PI/2,false);const k=Math.cos(ph*2*Math.PI);ctx.ellipse(x,y,Math.abs(k)*r,r,0,Math.PI/2,-Math.PI/2,k>0);ctx.closePath();ctx.fill();ctx.restore();}
// a small cloud, as the diary's night of clouds draws it
function d11_cloudIcon(ctx,x,y,s,col){ctx.save();ctx.fillStyle=rgba(col,1);[[-0.5,0.1,0.42],[0,-0.15,0.55],[0.55,0.08,0.4]].forEach(([u,v,r])=>{ctx.beginPath();ctx.arc(x+u*s,y+v*s,r*s,0,TAU);ctx.fill();});ctx.fillRect(x-0.9*s,y+0.1*s,1.8*s,0.4*s);ctx.restore();}
function d11_diary(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=ACA_INK,inkA=rgba(ink,0.96),soft=rgba(mix(ink,BAB_BRICK,0.5),1),rows=o.rows||[];
  const TA=o.textA==null?1:clamp(o.textA,0,1),Tt=(s,X_,Y_,op)=>T(ctx,s,X_,Y_,o.deco?Object.assign({deco:1},op):op);
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);
    // as the words fade, lines of writing stay, as texture
    if(TA<0.999){ctx.save();ctx.strokeStyle=rgba(ink,0.5*(1-TA));ctx.lineWidth=6;for(let i=0;i<9;i++){const yy=y+120+i*66;ctx.beginPath();ctx.moveTo(x+60,yy);ctx.lineTo(x+w-60-hash(i,744)*260,yy);ctx.stroke();}ctx.restore();}
    if(TA>0.002)withA(ctx,TA,()=>{
    Tt("a diary of the sky",x+50,y+68,{w:800,size:34,color:inkA});Tt("Babylon · 652 BCE",x+w-50,y+68,{f:"mono",w:500,size:28,align:"right",color:soft});
    const C=[x+60,x+200,x+330,x+w-260],H_=["night","moon","planets","weather"],hy=y+138;
    H_.forEach((s,i)=>{const lit=o.cols?clamp(o.cols*4-i,0,1):1,hi=o.hi===i?1:0;withA(ctx,0.45+0.55*lit,()=>{if(hi)glow(ctx,C[i]+60,hy-10,90,BAB_SUN,0.3);Tt(s,C[i],hy,{f:"mono",w:500,size:28,color:soft});});});
    ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+40,hy+18,w-80,2);
    D11_NIGHTS.forEach(([n,pl,we,ph],i)=>{const p=clamp(rows[i]||0,0,1);if(p<=0.01)return;const ry=hy+66+i*58;withA(ctx,p,()=>{
      Tt(n,C[0]+10,ry,{w:800,size:30,color:inkA});d11_crescent(ctx,C[1]+20,ry-10,15,ph,mix(ink,BAB_CLAY,0.15));
      Tt(typeOn(pl,clamp(p*1.6-0.3,0,1)),C[2],ry,{w:700,size:30,color:inkA});Tt(we,C[3],ry,{w:700,size:30,color:inkA});});});
    // the night the clouds hid the sky
    const cl=clamp(o.cloud||0,0,1);if(cl>0.01){const ry=hy+66+4*58;withA(ctx,cl,()=>{if(o.cloudHi>0.01){ctx.fillStyle=rgba(BAB_SUN,0.22*o.cloudHi);rr(ctx,x+40,ry-38,w-80,52,10);ctx.fill();}
      Tt("5",C[0]+10,ry,{w:800,size:30,color:inkA});d11_cloudIcon(ctx,C[1]+20,ry-12,18,mix(ink,BAB_CLAY,0.2));Tt(typeOn("I did not watch",clamp(cl*1.5-0.2,0,1)),C[2],ry,{w:800,size:30,color:inkA});Tt("clouds",C[3],ry,{w:700,size:30,color:inkA});});}
    // the month's end
    const m=clamp(o.month||0,0,1);if(m>0.01){const my=hy+66+5*58+24;withA(ctx,m,()=>{ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+40,my-34,w-80,2);
      Tt("at the month's end",x+60,my+4,{f:"mono",w:500,size:28,color:soft});});
      const it=(i,fn)=>{const q=clamp(m*3-i,0,1);if(q>0.01)withA(ctx,q,fn);};
      it(0,()=>{const ix=x+70,iy=my+58;ctx.save();ctx.strokeStyle=rgba(ink,0.85);ctx.lineWidth=3;ctx.beginPath();for(let k=0;k<3;k++){ctx.moveTo(ix,iy+k*10);for(let u=0;u<=40;u+=4)ctx.lineTo(ix+u,iy+k*10+Math.sin(u*0.3)*3);}ctx.stroke();ctx.restore();Tt("the river's level",ix+58,iy+20,{w:700,size:30,color:inkA});});
      it(1,()=>{const gx=x+410,gy=my+56;Tt("prices:",gx,gy+16,{w:800,size:30,color:inkA});D11_GOODS.forEach((g,j)=>{const q=clamp(m*3-1-j*0.1,0,1);withA(ctx,q,()=>Tt(g,gx+120+(j%3)*150,gy+16+Math.floor(j/3)*44,{w:700,size:28,color:inkA}));});});
      it(2,()=>{const cx=x+w-280,cy=my+58;ctx.save();ctx.fillStyle=rgba(ink,0.8);ctx.fillRect(cx,cy-4,14,22);ctx.fillRect(cx+18,cy-12,16,30);ctx.fillRect(cx+38,cy,12,18);ctx.restore();Tt("in the city",cx+64,cy+16,{w:700,size:30,color:inkA});});}});});}

/* ---------- six hundred years, and what they gave ---------- */
// a year as a place on the line: the diaries' years (652 to 61 BCE) along the line first; o.u (0..1) widens it to reach today
function d11_yx(yr,u){const A=lerp(-652,-760,u),B=lerp(-61,2026,u);return 200+(yr-A)/(B-A)*1520;}
// the kings the diaries were kept under, as bands along the line: [name, from, to] (years BCE as negative numbers)
const D11_KINGS=[["Babylonian",-652,-539,[214,150,92]],["Persian",-539,-331,[150,170,214]],["Greek",-331,-141,[200,176,120]],["Parthian",-141,-61,[176,140,180]]];

/* ---------- the map, as the wall knows it ---------- */
// The map as a small picture: six rows in the layers' colours, each with a few elements and the lines between them. It's texture
// (no words), so it can be drawn small. o.stale (0..1) greys it and lets it fade; o.fill (0..1) fills it in, row by row from the
// top; o.missing and o.wrong pick one element of a copy (by number) that's gone, or wrong; o.hi[i] lights a row.
const D11_MAP=(()=>{const R=[];LAY6.forEach(([,],i)=>{const n=[3,4,5,4,5,3][i],row=[];for(let k=0;k<n;k++)row.push({u:(k+0.5)/n+(hash(i*7+k,501)-0.5)*0.06,w:0.13+0.05*hash(i*7+k,502)});R.push(row);});
  const L=[];for(let i=0;i<5;i++)R[i].forEach((e,k)=>{const j=Math.floor(hash(i*11+k,503)*R[i+1].length);L.push([i,k,i+1,j]);});return{R,L};})();
function d11_mini(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const st=o.stale||0,fl=o.fill==null?1:o.fill,rh=h/6,grey=[150,150,156],cnt=D11_MAP.R.reduce((s,r)=>s+r.length,0);
  withA(ctx,a*(1-0.35*st),()=>{ctx.save();ctx.lineWidth=1.4;
    D11_MAP.L.forEach(([i,k,i2,k2])=>{const q=clamp(fl*6.5-i2,0,1);if(q<=0)return;const e=D11_MAP.R[i][k],f=D11_MAP.R[i2][k2];ctx.strokeStyle=rgba(mix([170,190,230],grey,st),0.28*q);ctx.beginPath();ctx.moveTo(x+e.u*w,y+rh*(i+0.72));ctx.lineTo(x+f.u*w,y+rh*(i2+0.28));ctx.stroke();});
    let n=0;D11_MAP.R.forEach((row,i)=>{const col=mix(LAY6[i][1],grey,st),hi=o.hi?o.hi[i]||0:0,q=clamp(fl*6.5-i,0,1);
      if(hi>0.01){ctx.fillStyle=rgba(col,0.10*hi);rr(ctx,x-6,y+rh*i+2,w+12,rh-4,6);ctx.fill();}
      row.forEach((e,k)=>{const idx=n++;if(q<=0)return;const bw=e.w*w,bh=rh*0.5,bx=x+e.u*w-bw/2,by=y+rh*i+rh*0.25;
        if(o.missing===idx){ctx.save();ctx.setLineDash([5,5]);ctx.strokeStyle=rgba(col,0.6*q);rr(ctx,bx,by,bw,bh,4);ctx.stroke();ctx.restore();return;}
        const bad=o.wrong===idx;ctx.fillStyle=rgba(bad?D11_RED:col,(0.16+0.14*(1-st))*q);rr(ctx,bx,by,bw,bh,4);ctx.fill();ctx.strokeStyle=rgba(bad?D11_RED:col,(0.85-0.35*st)*q);ctx.lineWidth=bad?2.6:1.6;rr(ctx,bx,by,bw,bh,4);ctx.stroke();});});
    ctx.restore();});return cnt;}
// the map in its glass frame, with its name; o.dust (0..1) lays a grey film over it: nobody has touched it
function d11_mapCard(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const st=o.stale||0,col=mix(EAC,[150,150,156],st);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+12*(o.glow||0),ea:0.85-0.4*st,fill:"rgba(7,12,24,0.95)"});
    if(o.title!==false)T(ctx,o.title||"the map",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});
    d11_mini(ctx,x+30,y+(o.title===false?24:70),w-60,h-(o.title===false?48:96),{stale:st,fill:o.fill,missing:o.missing,wrong:o.wrong,hi:o.hi});
    if(st>0.01){ctx.save();ctx.fillStyle=rgba([120,116,110],0.16*st);rr(ctx,x,y,w,h,18);ctx.fill();for(let i=0;i<60;i++){ctx.fillStyle=rgba([200,196,186],0.12*st*hash(i,511));ctx.beginPath();ctx.arc(x+hash(i,512)*w,y+hash(i,513)*h,0.8+1.6*hash(i,514),0,TAU);ctx.fill();}ctx.restore();}});}
// a slide, as decks copy the map: white, a heading bar, the map printed small (o.missing / o.wrong: how this copy has drifted)
function d11_slide(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=16;ctx.shadowOffsetY=5;ctx.fillStyle="rgba(240,242,246,0.98)";ctx.fillRect(0,0,w,h);ctx.restore();ctx.fillStyle="rgba(60,170,150,0.9)";ctx.fillRect(0,0,w,Math.max(6,h*0.05));
  if(o.head)T(ctx,o.head,18,h*0.05+30,{w:800,size:o.headSize||28,color:"rgba(40,44,56,1)",deco:o.headDeco});
  ctx.fillStyle="rgba(16,22,36,0.94)";const py=o.head?h*0.05+46:h*0.1;rr(ctx,14,py,w-28,h-py-14,6);ctx.fill();d11_mini(ctx,30,py+10,w-60,h-py-36,{missing:o.missing,wrong:o.wrong,stale:o.stale});
  if(o.stamp)withA(ctx,o.stampA==null?1:o.stampA,()=>kt_rstamp(ctx,w-110,h-60,o.stamp,o.stampCol||[110,110,120],1,1,{size:28,rot:-0.1}));ctx.restore();});}

/* ---------- the map's elements ---------- */
// each kind of element: where the map files it, its colour (the layers', and the data series' blue for a rule), and how it's drawn as a glyph
const D11_KIND={capability:["strategy",STR,"capability"],step:["business",BUS,"process"],domain:["domains",D11_NET,"domain"],object:["information",INF,"object"],
  rule:["motivation",D11_RULE,"requirement"],measure:["information",INF,"measure"],decision:["decisions",[236,170,206],"decision"],actor:["business",BUS,"actor"],obligation:["motivation",MOT,"requirement"],node:["technology",TEC,"node"],app:["application",APL,"component"]};
// glyphs this film adds: a requirement (a slanted box, as ArchiMate draws one), a domain (a region with its edge), a measure (a
// gauge) and a decision (a fork); the rest are the series'
function d11_glyph(ctx,kind,x,y,s,col){if(["capability","process","actor","object","goal","principle","node","component"].includes(kind)){archGlyph(ctx,kind,x,y,s,col);return;}
  ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="requirement"){ctx.beginPath();ctx.moveTo(x-s*0.55,y-s*0.5);ctx.lineTo(x+s*0.85,y-s*0.5);ctx.lineTo(x+s*0.55,y+s*0.5);ctx.lineTo(x-s*0.85,y+s*0.5);ctx.closePath();ctx.stroke();}
  else if(kind==="domain"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.3);ctx.quadraticCurveTo(x-s*0.6,y-s*0.85,x,y-s*0.6);ctx.quadraticCurveTo(x+s*0.85,y-s*0.7,x+s*0.75,y);ctx.quadraticCurveTo(x+s*0.7,y+s*0.75,x,y+s*0.6);ctx.quadraticCurveTo(x-s*0.9,y+s*0.6,x-s*0.8,y-s*0.3);ctx.stroke();}
  else if(kind==="measure"){ctx.beginPath();ctx.arc(x,y+s*0.3,s*0.75,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+s*0.3);ctx.lineTo(x+s*0.45,y-s*0.2);ctx.stroke();}
  else if(kind==="decision"){ctx.beginPath();ctx.moveTo(x-s*0.8,y);ctx.lineTo(x-s*0.1,y);ctx.lineTo(x+s*0.7,y-s*0.55);ctx.moveTo(x-s*0.1,y);ctx.lineTo(x+s*0.7,y+s*0.55);ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.7,y-s*0.55,s*0.16,0,TAU);ctx.fill();}
  ctx.restore();}
// a stable id, as a small chip in mono: o.col its colour, o.hi lights it
function d11_id(ctx,x,y,id,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||28,col=o.col||EAC,w=tw(ctx,id,sz,500,"mono")+28,h=sz+18,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,8,col,{glow:8+14*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});ctx.fillStyle=rgba(col,0.12+0.14*(o.hi||0));rr(ctx,X,y-h/2,w,h,8);ctx.fill();T(ctx,id,X+14,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(mix(col,INK,0.25),1)});});return w;}
// An element's file, small: its kind, its id and its name. kind is a key of D11_KIND.
function d11_fileMini(ctx,x,y,w,kind,id,name,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||170;if(a<=0.01)return h;const[,col,gk]=D11_KIND[kind];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(6,10,20,0.95)"});ctx.fillStyle=rgba(col,0.06+0.08*(o.hi||0));rr(ctx,x,y,w,h,14);ctx.fill();
    T(ctx,o.label||kind.replace("object","business object"),x+24,y+44,{f:"mono",w:500,size:28,color:rgba(col,1)});d11_glyph(ctx,gk,x+w-34,y+34,15,col);
    T(ctx,id,x+24,y+96,{f:"mono",w:500,size:30,color:rgba(INK,0.96)});T(ctx,name,x+24,y+142,{w:700,size:tw(ctx,name,30,700)>w-48?28:30,color:rgba(mix(col,INK,0.55),1)});});return h;}
// An element, open: its page in the tool, a form (a breadcrumb made from its path, then a label and a value on each line), or, with
// o.files, its text file (the path itself, then "key: value" lines in mono, as YAML writes them). lines: [key, value, opts] (a null
// key: text that carries on, under the value in the tool, indented by opts.ind in the file); opts.tick: an owner's gold tick after
// the value; opts.from: an old value the new one replaces as opts.u goes 0..1; opts.col: the key's colour. o.rows[i] shows each
// line (0..1), o.hi[i] lights it. Returns its height.
function d11_file(ctx,x,y,w,path,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||48,sz=o.size||28,col=o.col||EAC,h=o.h||(84+lines.length*lh);if(a<=0.01)return h;
  const F=o.files,vf=F?{f:"mono",w:500}:{w:600},vw=s_=>F?tw(ctx,s_,sz,500,"mono"):tw(ctx,s_,sz,600),LW=F?0:Math.max(0,...lines.filter(l=>l[0]!=null).map(l=>tw(ctx,l[0],sz,600)))+34;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+14*(o.glow||0),ea:0.75,fill:"rgba(6,10,20,0.96)"});
    if(F){ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(x+20,y+22);ctx.lineTo(x+32,y+22);ctx.lineTo(x+38,y+28);ctx.lineTo(x+38,y+42);ctx.lineTo(x+20,y+42);ctx.closePath();ctx.fill();
      T(ctx,path,x+52,y+42,{f:"mono",w:500,size:sz,color:rgba(col,1)});}
    else{glow(ctx,x+30,y+33,14,col,0.35);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+30,y+33,7,0,TAU);ctx.fill();T(ctx,d11_crumb(path),x+52,y+42,{f:"mono",w:500,size:sz,color:rgba(col,1)});
      if(o.chip)withA(ctx,o.chip[2]==null?1:o.chip[2],()=>tag(ctx,x+w-24-tw(ctx,o.chip[0],28,700)-26,y+34,o.chip[0],o.chip[1],{size:28}));}ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+62,w-28,1.2);
    lines.forEach((ln,i)=>{const q=o.rows?(o.rows[i]==null?1:o.rows[i]):1;if(q<=0.01)return;const[k,v,op]=ln,O=op||{},yy=y+66+i*lh+lh*0.66,hi=o.hi?o.hi[i]||0:0;
      withA(ctx,clamp(q*1.6,0,1),()=>{if(hi>0.01){ctx.fillStyle=rgba(O.hiCol||col,0.16*hi);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.92,6);ctx.fill();ctx.fillStyle=rgba(O.hiCol||col,0.9*hi);rr(ctx,x+12,yy-lh*0.7,5,lh*0.92,2);ctx.fill();}
        let vx;if(F){const kx=x+26+(O.ind||0)*34;if(k!=null)T(ctx,k+":",kx,yy,{f:"mono",w:500,size:sz,color:rgba(O.col||mix(col,INK,0.2),0.95)});vx=k==null?kx:kx+tw(ctx,k+": ",sz,500,"mono");}
        else{if(k!=null){if(i>0){ctx.fillStyle="rgba(170,200,245,0.07)";ctx.fillRect(x+20,y+66+i*lh,w-40,1.2);}T(ctx,k,x+26,yy,{w:600,size:sz,color:rgba(O.col||mix(SOFT,col,0.3),0.95)});}vx=x+26+LW;}
        if(O.from!=null&&(O.u||0)<1){const u=ease(clamp(O.u||0,0,1));withA(ctx,1-u,()=>T(ctx,O.from,vx,yy-u*14,{...vf,size:sz,color:rgba(INK,0.9)}));withA(ctx,u,()=>T(ctx,v,vx,yy+(1-u)*14,{...vf,size:sz,color:rgba(INK,0.96)}));}
        else T(ctx,typeOn(v,clamp(q*1.4-0.2,0,1)),vx,yy,{...vf,size:sz,color:rgba(O.vcol||INK,0.96)});
        if(O.tick&&O.tick>0.01)kt_gtick(ctx,vx+vw(v)+30,yy-sz*0.34,15,O.tick);});});});return h;}

/* ---------- the tool: one map, many sources ---------- */
// The map kept in an enterprise architecture tool, drawn as no product in particular: a window with the map's name and the people who
// use it, the layers down its side, and a graph of the map. What it brings in from other systems is drawn in sand, the colour of
// records kept elsewhere; what's written in the map itself keeps the layers' colours.
const D11_SAND=[226,200,150];
const d11_crumb=p=>p.replace(/\.yml$/,"").replace("/"," › ");
// the map's mark: three nodes and their links
function d11_gglyph(ctx,x,y,s,col){const P=[[x-s*0.42,y+s*0.28],[x,y-s*0.36],[x+s*0.42,y+s*0.22]];ctx.save();ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=Math.max(1.4,s*0.07);
  ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);ctx.lineTo(P[1][0],P[1][1]);ctx.lineTo(P[2][0],P[2][1]);ctx.moveTo(P[0][0],P[0][1]);ctx.lineTo(P[2][0],P[2][1]);ctx.stroke();
  ctx.fillStyle=rgba(col,1);P.forEach(([px,py])=>{ctx.beginPath();ctx.arc(px,py,s*0.14,0,TAU);ctx.fill();});ctx.restore();}
// a database: a cylinder
function d11_db(ctx,x,y,s,col){const rx=s*0.42,ry=s*0.13,h=s*0.62;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.07);
  ctx.beginPath();ctx.ellipse(x,y-h/2,rx,ry,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-rx,y-h/2);ctx.lineTo(x-rx,y+h/2);ctx.ellipse(x,y+h/2,rx,ry,0,Math.PI,0,true);ctx.lineTo(x+rx,y-h/2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI);ctx.stroke();ctx.restore();}
// an open book, for the glossary
function d11_book(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.07);ctx.lineJoin="round";
  [-1,1].forEach(d=>{ctx.beginPath();ctx.moveTo(x,y-s*0.3);ctx.quadraticCurveTo(x+d*s*0.22,y-s*0.42,x+d*s*0.5,y-s*0.34);ctx.lineTo(x+d*s*0.5,y+s*0.34);ctx.quadraticCurveTo(x+d*s*0.22,y+s*0.26,x,y+s*0.38);ctx.stroke();});
  ctx.beginPath();ctx.moveTo(x,y-s*0.3);ctx.lineTo(x,y+s*0.38);ctx.stroke();ctx.restore();}
// where the map's elements are already kept: [name, what it holds]. Which elements each one holds is in D11_GN
const D11_SRC=[["documents","strategy · plans"],["project management","goals · initiatives"],["IT service management","applications · servers"]];
// a source's icon, with no words, s across and centred on (cx, cy): a document, a project plan's bars, a rack of servers
function d11_srcIcon(ctx,k,cx,cy,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.05);ctx.lineJoin="round";ctx.lineCap="round";
  if(k===0){const w=s*0.7,x=cx-w/2,y=cy-s/2,f=s*0.22;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+s);ctx.lineTo(x,y+s);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f,y+f);ctx.lineTo(x+w,y+f);ctx.stroke();for(let i=0;i<4;i++){const yy=y+s*(0.4+i*0.15);ctx.beginPath();ctx.moveTo(x+s*0.12,yy);ctx.lineTo(x+w-s*(i===3?0.3:0.12),yy);ctx.stroke();}}
  else if(k===1){const x=cx-s/2,y=cy-s/2;[[0,0.42],[0.2,0.5],[0.42,0.4],[0.6,0.32]].forEach(([u,l],i)=>{ctx.fillStyle=rgba(col,0.9);rr(ctx,x+u*s,y+s*(0.1+i*0.22),l*s,s*0.13,s*0.05);ctx.fill();});
    ctx.strokeStyle=rgba(col,0.6);ctx.beginPath();ctx.moveTo(x+s*0.56,y);ctx.lineTo(x+s*0.56,y+s);ctx.stroke();}
  else{const w=s*0.8,x=cx-w/2;for(let i=0;i<3;i++){const yy=cy-s/2+i*s*0.36;rr(ctx,x,yy,w,s*0.28,s*0.05);ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.12,yy+s*0.14,s*0.045,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(x+s*0.3,yy+s*0.14);ctx.lineTo(x+w-s*0.1,yy+s*0.14);ctx.stroke();}}
  ctx.restore();}
// a source as a card: its icon, its name and what it holds; o.hi lights it
function d11_srcCard(ctx,k,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=D11_SAND,hi=o.hi||0,s=Math.min(h-40,60);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10+14*hi,ea:0.75+0.2*hi,fill:"rgba(22,16,8,0.95)"});if(hi>0.01){ctx.fillStyle=rgba(col,0.1*hi);rr(ctx,x,y,w,h,14);ctx.fill();}
    d11_srcIcon(ctx,k,x+24+s/2,y+h/2,s,col);const[nm,sub]=D11_SRC[k];T(ctx,nm,x+s+48,y+h/2-6,{w:800,size:30,color:rgba(mix(col,INK,0.4),1)});T(ctx,sub,x+s+48,y+h/2+34,{f:"mono",w:500,size:28,color:rgba(col,0.95)});});}
// the map as a graph, a band for each row of D11_TREE: [row, u across (0..1), where it comes from: a source of D11_SRC, or -1 for
// written in the map]. Goals and plans come from documents and the project tool, applications and servers from IT service
// management; capabilities, rules, steps, business objects (the glossary's terms) and decisions are written in the map
const D11_GN=[[0,0.12,0],[0,0.38,1],[0,0.62,1],[0,0.88,-1],[1,0.1,0],[1,0.3,1],[1,0.5,-1],[1,0.7,-1],[1,0.9,-1],
  [2,0.1,-1],[2,0.3,-1],[2,0.5,-1],[2,0.7,-1],[2,0.9,-1],[3,0.1,-1],[3,0.3,-1],[3,0.5,-1],[3,0.7,-1],[3,0.9,-1],
  [4,0.1,2],[4,0.3,2],[4,0.5,2],[4,0.7,2],[4,0.9,-1],[5,0.15,2],[5,0.38,2],[5,0.62,2],[5,0.85,2],[6,0.2,-1],[6,0.5,-1],[6,0.8,-1]].map(([r,u,s_],i)=>[r,u+(hash(i,621)-0.5)*0.05,s_]);
// its links: each node to the nearest in the next layer down (and sometimes a second), then a few that reach further: capabilities
// to the applications that serve them, a rule to its business object, and decisions to what they decided
const D11_GE=(()=>{const E=[],by=r=>D11_GN.map((n,i)=>[n,i]).filter(([n])=>n[0]===r);
  for(let r=0;r<5;r++)by(r).forEach(([n,i])=>{const nx=by(r+1).sort((A,B)=>Math.abs(A[0][1]-n[1])-Math.abs(B[0][1]-n[1]));E.push([i,nx[0][1]]);if(hash(i,631)>0.55)E.push([i,nx[1][1]]);});
  E.push([6,20],[7,21],[8,22],[3,16],[28,21],[29,7],[30,23]);return E;})();
// the graph, with row 0's middle at y=gy and u=0..1 across gx..gx+gw. Each node's and link's look comes from callbacks (index → 0..1):
// o.na shows a node, o.nl lights it, o.nh empties it (a dashed ring: kept elsewhere), o.ns rings it in sand (brought in from its
// source); o.ea shows a link, o.el lights it. o.pos(i) can move a node (as it arrives)
function d11_graph(ctx,gx,gy,gw,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const rh=o.rh||56,P=i=>o.pos?o.pos(i):[gx+D11_GN[i][1]*gw,gy+D11_GN[i][0]*rh],f=(fn,i,d)=>fn?fn(i):d;
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";
    D11_GE.forEach(([i,j],e)=>{const q=Math.min(f(o.ea,e,1),f(o.na,i,1),f(o.na,j,1));if(q<=0.01)return;const[x0,y0]=P(i),[x1,y1]=P(j),lt=f(o.el,e,0),far=Math.abs(D11_GN[i][0]-D11_GN[j][0])>1,mx=(x0+x1)/2+(far?(y1-y0)*0.22:0),my=(y0+y1)/2;
      ctx.strokeStyle=rgba(mix([150,180,230],EAC,lt),(0.24+0.5*lt)*q);ctx.lineWidth=1.6+1.4*lt;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,x1,y1);ctx.stroke();});
    D11_GN.forEach(([r,u,src],i)=>{const q=f(o.na,i,1);if(q<=0.01)return;const[x,y]=P(i),col=D11_TREE[r][1],lt=f(o.nl,i,0),hol=f(o.nh,i,0),sr=src>=0?f(o.ns,i,0):0,rad=9+3*lt;
      withA(ctx,q,()=>{if(lt>0.01)glow(ctx,x,y,22+10*lt,col,0.35*lt);ctx.fillStyle=rgba(col,0.95*(1-hol));ctx.beginPath();ctx.arc(x,y,rad,0,TAU);ctx.fill();
        if(hol>0.01){ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle=rgba(col,0.85*hol);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,rad,0,TAU);ctx.stroke();ctx.restore();}
        if(sr>0.01){ctx.strokeStyle=rgba(D11_SAND,0.9*sr);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,rad+5,0,TAU);ctx.stroke();}});});
    ctx.restore();});}
// the tool's window: the map's mark and name, o.sub saying what it is, and the people who use it (o.people 0..1 shows them in turn)
function d11_window(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,EAC,{glow:14+12*(o.glow||0),ea:0.8,fill:"rgba(6,10,20,0.93)"});ctx.fillStyle="rgba(170,230,210,0.05)";rr(ctx,x+1,y+1,w-2,56,20);ctx.fill();ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+57,w-28,1.2);
    d11_gglyph(ctx,x+38,y+29,26,EAC);T(ctx,"the map",x+64,y+40,{f:"mono",w:500,size:30,color:rgba(EAC,1)});
    if(o.sub)withA(ctx,o.subA==null?1:o.subA,()=>T(ctx,o.sub,x+64+tw(ctx,"the map",30,500,"mono")+28,y+40,{w:700,size:28,color:rgba(SOFT,1)}));
    const PP=[TRUST,EAC,TECH,D11_RET];PP.forEach((col,i)=>{const q=o.people==null?0:clamp(o.people*PP.length-i,0,1);if(q<=0.01)return;const px=x+w-40-i*46;withA(ctx,q,()=>{glow(ctx,px,y+29,18,col,0.3);archGlyph(ctx,"actor",px,y+29,13,col);});});});}
// a glossary term, as the map holds it: a business object, defined once by the business (o.by shows who; o.tick, their confirmation)
function d11_term(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=186;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,INF,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(16,10,8,0.95)"});d11_book(ctx,x+38,y+36,30,INF);
    T(ctx,"glossary term",x+70,y+46,{f:"mono",w:500,size:28,color:rgba(INF,1)});T(ctx,"information › OBJ-003",x+w-26,y+46,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,0.95)});ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+66,w-28,1.2);
    T(ctx,"reading",x+28,y+114,{w:800,size:32,color:rgba(mix(INF,INK,0.3),1)});T(ctx,"a meter's record of energy used",x+52+tw(ctx,"reading",32,800),y+114,{w:600,size:28,color:rgba(INK,0.95)});
    const by=o.by==null?1:o.by;if(by>0.01)withA(ctx,by,()=>{T(ctx,"defined by",x+28,y+162,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,"Grace Achieng · network",x+40+tw(ctx,"defined by",28,500,"mono"),y+162,{w:800,size:30,color:rgba(TRUST,1)});
      kt_gtick(ctx,x+w-44,y+152,15,o.tick==null?1:o.tick);});});return h;}

/* ---------- the map's side panel, and its versions ---------- */
const D11_TREE=[["motivation",MOT,24],["strategy",STR,31],["business",BUS,46],["information",INF,38],["application",APL,27],["technology",TEC,19],["decisions",[236,170,206],12]];
// the map in the tool, as its side panel shows it: one row per layer and one for decisions, each with a dot in its colour and how many
// elements it holds; with o.files, the same map as a repository of text files, a folder per row. o.p opens it from the top.
// o.scan (0..1) sweeps a check down the rows; o.warn[i] (0..1) marks a row amber; o.plus[i] adds to a row's count
function d11_tree(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||56,h=110+D11_TREE.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,EAC,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(6,10,20,0.95)"});
    if(o.files)T(ctx,o.title||"repository · text files",x+26,y+48,{f:"mono",w:500,size:28,color:rgba(EAC,1)});else{d11_gglyph(ctx,x+40,y+38,26,EAC);T(ctx,o.title||"the map",x+68,y+48,{f:"mono",w:500,size:28,color:rgba(EAC,1)});}
    const sc=o.scan,sy=sc>0&&sc<1?y+92+sc*D11_TREE.length*rh:null;
    if(sy!=null){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(170,205,255,0)");g.addColorStop(0.5,"rgba(170,205,255,0.75)");g.addColorStop(1,"rgba(170,205,255,0)");ctx.fillStyle=g;ctx.fillRect(x+12,sy-1.5,w-24,3);}
    D11_TREE.forEach(([nm,col,n],i)=>{const q=o.p==null?1:clamp(o.p*D11_TREE.length-i,0,1);if(q<=0)return;const yy=y+92+i*rh+rh*0.5,wa=o.warn?o.warn[i]||0:0,hi=Math.max(o.hi?o.hi[i]||0:0,sy!=null?clamp(1-Math.abs(sy-yy)/rh,0,1)*0.8:0);
      withA(ctx,q,()=>{if(hi>0.01){ctx.fillStyle=rgba(col,0.14*hi);rr(ctx,x+12,yy-rh*0.45,w-24,rh*0.9,8);ctx.fill();}
        if(wa>0.01){withA(ctx,wa,()=>{ctx.fillStyle=rgba(AMBER,0.13);rr(ctx,x+12,yy-rh*0.45,w-24,rh*0.9,8);ctx.fill();glass(ctx,x+w-124,yy-18,36,36,18,AMBER,{glow:10,ea:0.85,fill:"rgba(30,20,6,0.95)"});T(ctx,"!",x+w-106,yy+11,{w:800,size:28,align:"center",color:rgba(AMBER,1)});});}
        if(o.files){ctx.fillStyle=rgba(col,0.85);ctx.beginPath();ctx.moveTo(x+30,yy-12);ctx.lineTo(x+42,yy-12);ctx.lineTo(x+47,yy-7);ctx.lineTo(x+62,yy-7);ctx.lineTo(x+62,yy+12);ctx.lineTo(x+30,yy+12);ctx.closePath();ctx.fill();}
        else{glow(ctx,x+46,yy,14,col,0.3);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+46,yy,8,0,TAU);ctx.fill();}
        T(ctx,nm+(o.files?"/":""),x+78,yy+10,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});if(o.counts!==false){const pl=o.plus?o.plus[i]||0:0;T(ctx,(n+Math.round(pl))+"",x+w-28,yy+10,{f:"mono",w:500,size:28,align:"right",color:rgba(mix(SOFT,KT_AI,clamp(pl,0,1)),0.85+0.15*clamp(pl,0,1))});}});});});return h;}
// the versions, as a line of dots, oldest on the left, each number above its dot; the first and the newest show their dates.
// o.n shows them one by one; o.la fades the numbers and dates; o.warn[i] (0..1) turns a dot into the check's amber mark
function d11_vline(ctx,x,y,w,vers,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=o.n==null?vers.length:o.n,dx=w/Math.max(1,vers.length-1),la=o.la==null?1:o.la;
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(EAC,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx*Math.max(0,Math.min(vers.length-1,n-1)),y);ctx.stroke();ctx.restore();
    vers.forEach(([v,d],i)=>{const q=clamp(n-i,0,1);if(q<=0)return;const xx=x+i*dx,top=clamp(1-Math.abs(n-1-i),0,1),wa=o.warn?o.warn[i]||0:0,col=mix(EAC,TRUST,top);withA(ctx,q,()=>{
      withA(ctx,1-wa,()=>{glow(ctx,xx,y,14+12*top,col,0.3+0.2*top);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(xx,y,7+2*top,0,TAU);ctx.fill();});
      if(wa>0.01)withA(ctx,wa,()=>{glass(ctx,xx-18,y-18,36,36,18,AMBER,{glow:10,ea:0.85,fill:"rgba(30,20,6,0.95)"});T(ctx,"!",xx,y+11,{w:800,size:28,align:"center",color:rgba(AMBER,1)});});
      if(la>0.01)withA(ctx,la,()=>{T(ctx,v,xx,y-34,{f:"mono",w:500,size:28,align:"center",color:rgba(mix(mix(EAC,INK,0.3),TRUST,top),1)});
        const da=i===0?1:top;if(da>0.01)withA(ctx,da,()=>T(ctx,d,xx,y+52,{w:700,size:28,align:"center",color:rgba(SOFT,0.9)}));});});});});}
// the map's history, newest first: [version, date, what changed, who confirmed it]. o.rows[i] shows each row; o.nov hides the
// version numbers (while they fly to the line of versions)
function d11_history(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=64,h=96+rows.length*lh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,EAC,{glow:12,ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,o.title||"the map · history",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(EAC,1)});
    rows.forEach(([v,d,s,who],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const yy=y+96+i*lh+lh*0.5;withA(ctx,q,()=>{
      if(i>0){ctx.fillStyle="rgba(170,200,245,0.10)";ctx.fillRect(x+20,yy-lh*0.5,w-40,1.2);}
      if(!o.nov)T(ctx,v,x+26,yy+10,{f:"mono",w:500,size:28,color:rgba(i===0?TRUST:mix(EAC,INK,0.3),1)});
      T(ctx,d,x+124,yy+10,{w:700,size:28,color:rgba(SOFT,0.95)});T(ctx,s,x+250,yy+10,{f:"mono",w:500,size:28,color:rgba(INK,0.95)});
      kt_gtick(ctx,x+w-170,yy,15,1);T(ctx,who,x+w-144,yy+10,{w:800,size:30,color:rgba(TRUST,1)});});});});return h;}

/* ---------- a change, proposed line by line ---------- */
// A change request in the tool (with o.files, a pull request): what it changes, line by line (- removed, + added), the element it's on
// (a breadcrumb made from its path), and who must approve it.
// o.diff: [sign, text]; o.rows (0..1) shows each diff line; o.rev: [[name, side, tick 0..1]], each ticked with o.okWord (approved);
// o.state: a word for where it stands; o.fold (0..1) folds it to its title once approved
function d11_pr(ctx,x,y,w,title,file,o){o=o||{};const a=o.a==null?1:o.a,D=o.diff||[],R=o.rev||[],lh=50,fo=ease(clamp(o.fold||0,0,1)),h=lerp(196+D.length*lh+(R.length?36+R.length*58:0),124,fo);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,EAC,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(6,10,20,0.96)"});
    T(ctx,o.kicker||(o.files?"pull request":"change request"),x+26,y+46,{f:"mono",w:500,size:28,color:rgba(EAC,1)});if(o.state)tag(ctx,x+w-24-tw(ctx,o.state,28,700)-26,y+38,o.state,o.stateCol||EAC,{size:28});
    T(ctx,title,x+26,y+100,{w:800,size:38});ctx.save();ctx.beginPath();ctx.rect(x,y,w,h-8);ctx.clip();withA(ctx,1-fo,()=>{T(ctx,o.files?file:d11_crumb(file),x+26,y+152,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    D.forEach(([sg,s],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const yy=y+176+i*lh,col=sg==="-"?D11_RED:sg==="+"?D11_OK:[150,165,190];withA(ctx,clamp(q*2,0,1),()=>{
      ctx.fillStyle=rgba(col,sg===" "?0.0:0.13);ctx.fillRect(x+14,yy,w-28,lh-4);T(ctx,sg,x+30,yy+35,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,typeOn(s,clamp(q*1.5-0.3,0,1)),x+62,yy+35,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.55),1)});
      if(sg==="-"&&q>0.6){const sw=tw(ctx,s,28,500,"mono");ctx.strokeStyle=rgba(D11_RED,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+62,yy+26);ctx.lineTo(x+62+sw*clamp((q-0.6)/0.4,0,1),yy+26);ctx.stroke();}});});
    if(R.length){const ry=y+196+D.length*lh+10;T(ctx,o.files?"review":"approval",x+26,ry+20,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
      R.forEach(([nm,side,tk,ra],i)=>{const q=ra==null?1:ra;if(q<=0.01)return;const yy=ry+64+i*58;withA(ctx,q,()=>{archGlyph(ctx,"actor",x+40,yy-10,13,TRUST);T(ctx,nm,x+66,yy,{w:800,size:30,color:rgba(TRUST,1)});
        T(ctx,side,x+66+tw(ctx,nm,30,800)+16,yy,{w:700,size:28,color:rgba(SOFT,0.95)});if(tk>0.01){kt_gtick(ctx,x+w-50,yy-10,17,tk);withA(ctx,tk,()=>T(ctx,o.okWord||"approved",x+w-80,yy,{w:700,size:28,align:"right",color:rgba(TRUST,1)}));}});});}});ctx.restore();});return h;}
// the checks that run on the map, on every change: each row is running (0), passed (1) or flagged (2), with a note
function d11_checks(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=62,h=92+rows.length*lh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[170,205,255],{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,o.title||"checks on the map · every change",x+26,y+46,{f:"mono",w:500,size:28,color:rgba([170,205,255],1)});
    rows.forEach(([s,st,note,ra],i)=>{const q=ra==null?1:ra;if(q<=0.01)return;const yy=y+92+i*lh+lh*0.55;withA(ctx,q,()=>{
      if(st===0){ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=3;ctx.lineCap="round";const an=(o.t||0)*5;ctx.beginPath();ctx.arc(x+44,yy-10,12,an,an+Math.PI*1.4);ctx.stroke();ctx.restore();}
      else if(st===1){glow(ctx,x+44,yy-10,22,D11_OK,0.3);tick_(ctx,x+44,yy-8,26,D11_OK,1);}
      else{glass(ctx,x+26,yy-28,36,36,18,AMBER,{glow:10,ea:0.85,fill:"rgba(30,20,6,0.95)"});T(ctx,"!",x+44,yy-1,{w:800,size:28,align:"center",color:rgba(AMBER,1)});}
      T(ctx,s,x+80,yy,{w:700,size:30,color:rgba(INK,0.95)});if(note)T(ctx,note,x+w-26,yy,{w:700,size:28,align:"right",color:rgba(st===2?AMBER:SOFT,1)});});});});return h;}

/* ---------- one map, many views ---------- */
// the six views generated from the map, then dbt and Databricks, which carry it too
const D11_VIEWS=["ArchiMate views","glossary","conceptual model","ontology · OWL","tests · tracking","heat map","dbt","Databricks"],D11_VCOL=[170,205,255];
// a view's icon, a small picture of what it holds, with no words, in the box (x, y, w, h)
function d11_vicon(ctx,k,x,y,w,h,col){ctx.save();ctx.lineWidth=1.6;
  if(k===0){LAY6.forEach(([,c],i)=>{const yy=y+i*h/6,n=2+i%2,bw=(w-8)/n;for(let j=0;j<n;j++){ctx.fillStyle=rgba(c,0.6);rr(ctx,x+4+j*bw,yy+1.5,bw-5,h/6-3.5,2.5);ctx.fill();}});}
  else if(k===1){for(let i=0;i<3;i++){const yy=y+6+i*h/3;ctx.fillStyle=rgba(INF,0.9);rr(ctx,x+2,yy,w*0.34,7,3.5);ctx.fill();ctx.fillStyle=rgba(SOFT,0.5);rr(ctx,x+2,yy+12,w*0.92,5,2.5);ctx.fill();}}
  else if(k===2){const B=[[0.2,0.22],[0.8,0.22],[0.5,0.8]];ctx.strokeStyle=rgba(col,0.7);[[0,1],[0,2],[1,2]].forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(x+B[i][0]*w,y+B[i][1]*h);ctx.lineTo(x+B[j][0]*w,y+B[j][1]*h);ctx.stroke();});
    B.forEach(([u,v])=>{ctx.fillStyle="rgba(10,16,30,1)";rr(ctx,x+u*w-17,y+v*h-10,34,20,4);ctx.fill();ctx.strokeStyle=rgba(INF,0.95);rr(ctx,x+u*w-17,y+v*h-10,34,20,4);ctx.stroke();});}
  else if(k===3){const N=[[0.14,0.5],[0.5,0.16],[0.5,0.84],[0.88,0.5]];ctx.strokeStyle=rgba(col,0.7);[[0,1],[0,2],[1,3],[2,3],[1,2]].forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(x+N[i][0]*w,y+N[i][1]*h);ctx.lineTo(x+N[j][0]*w,y+N[j][1]*h);ctx.stroke();});
    N.forEach(([u,v],i)=>{ctx.fillStyle=rgba(i===0?INF:col,0.95);ctx.beginPath();ctx.arc(x+u*w,y+v*h,6.5,0,TAU);ctx.fill();});}
  else if(k===4){for(let i=0;i<3;i++){const yy=y+10+i*h/3;if(i<2)tick_(ctx,x+9,yy+2,15,D11_OK,1);else{ctx.fillStyle=rgba(AMBER,1);ctx.beginPath();ctx.arc(x+9,yy-1,6,0,TAU);ctx.fill();}ctx.fillStyle=rgba(i<2?SOFT:AMBER,0.55);rr(ctx,x+24,yy-4,w*0.7,6,3);ctx.fill();}}
  else if(k===5){const cw=w/3,ch=h/3;for(let i=0;i<3;i++)for(let j=0;j<3;j++){const c_=(i===2&&j===0)?D11_RED:(i+j)%3===1?AMBER:D11_OK;ctx.fillStyle=rgba(c_,0.38);rr(ctx,x+i*cw+2,y+j*ch+2,cw-4,ch-4,3);ctx.fill();ctx.strokeStyle=rgba(c_,0.9);rr(ctx,x+i*cw+2,y+j*ch+2,cw-4,ch-4,3);ctx.stroke();}}
  ctx.restore();}
// one view as a card (x, y, w, h): its icon, its name and, when o.rd shows it, who reads it (o.reader). dbt and Databricks
// (k 6, 7) show their logos. o.hi lights it; o.fl flashes it as the map's change arrives
function d11_vcard(ctx,k,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=k===6?[255,150,120]:k===7?[255,120,90]:D11_VCOL,hi=Math.max(o.hi||0,o.fl||0);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10+16*hi,ea:0.7+0.25*hi,fill:"rgba(6,10,20,0.95)"});if(hi>0.01){ctx.fillStyle=rgba(o.fl>0.01?D11_OK:col,0.12*hi);rr(ctx,x,y,w,h,14);ctx.fill();}
    const fill=o.fill==null?1:o.fill;if(fill<=0.01)return;withA(ctx,fill,()=>{const ih=Math.min(h-32,64),iw=ih*1.35,ix=x+18,iy=y+(h-ih)/2;let nx=ix+iw+20;
      if(k<6)d11_vicon(ctx,k,ix,iy,iw,ih,col);else{const lh_=Math.min(36,h-30),lw_=logo(ctx,k===6?"dbt":"databricks",ix,y+(h-lh_)/2,lh_);nx=ix+lw_+16;}
      T(ctx,D11_VIEWS[k],nx,y+h/2+11,{w:800,size:h<90?28:30,color:rgba(mix(col,INK,0.45),1)});
      if(o.rd>0.01&&o.reader)withA(ctx,o.rd,()=>tag(ctx,x+w-26-tw(ctx,o.reader,28,700)-26,y+h/2,o.reader,[200,215,240],{size:28}));});});}
// the glossary, large, as the map generates it: each term, the element it comes from, and its definition; o.fix (0..1)
// types the change that arrives from the map into the first definition
const D11_GLOSS=[["reading","OBJ-003","a meter's record of energy used"],["bill","OBJ-007","what a customer owes for a period"],["eligibility","OBJ-011","who can get the social tariff"]];
function d11_gloss(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=100,h=104+D11_GLOSS.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,D11_VCOL,{glow:12+14*(o.glow||0),ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,"glossary",x+28,y+52,{w:800,size:34,color:rgba(mix(D11_VCOL,INK,0.45),1)});
    T(ctx,"generated from the map",x+w-28,y+50,{f:"mono",w:500,size:28,align:"right",color:rgba(EAC,1)});ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+16,y+78,w-32,1.2);
    D11_GLOSS.forEach(([tm,id,df],i)=>{const yy=y+104+i*rh+40,fx=i===0?o.fix||0:0,hi=i===0?o.hi||0:0;
      if(hi>0.01||fx>0.01){ctx.fillStyle=rgba(fx>0.01?D11_OK:D11_VCOL,0.12*Math.max(hi,fx>0.01?1-fin(fx,0.7,0.3):0));rr(ctx,x+14,yy-34,w-28,rh-8,8);ctx.fill();}
      T(ctx,tm,x+28,yy,{w:800,size:30,color:rgba(INF,1)});T(ctx,id,x+w-28,yy,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,0.9)});
      T(ctx,df,x+28,yy+42,{w:600,size:28,color:rgba(INK,0.92)});if(fx>0.01)T(ctx,typeOn(" or exported",fx),x+28+tw(ctx,df,28,600),yy+42,{w:700,size:28,color:rgba(D11_OK,1)});});});return h;}
// a thread from the map to a view, one way: a line with a head, and a light that runs along it as p goes 0..1
function d11_thread(ctx,x0,y0,x1,y1,p,col,o){o=o||{};if(p<=0.01)return;const q=ease(clamp(p,0,1)),mx=(x0+x1)/2,c1=[mx,y0],c2=[mx,y1],at_=u=>{const v=1-u;return[v*v*v*x0+3*v*v*u*c1[0]+3*v*u*u*c2[0]+u*u*u*x1,v*v*v*y0+3*v*v*u*c1[1]+3*v*u*u*c2[1]+u*u*u*y1];};
  ctx.save();ctx.strokeStyle=rgba(col,o.a==null?0.55:o.a);ctx.lineWidth=o.lw||2.2;ctx.beginPath();for(let k=0;k<=40;k++){const[x,y]=at_(q*k/40);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  if(q>0.98){const[xa,ya]=at_(0.97);const an=Math.atan2(y1-ya,x1-xa);ctx.fillStyle=rgba(col,o.a==null?0.8:o.a);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-13*Math.cos(an-0.4),y1-13*Math.sin(an-0.4));ctx.lineTo(x1-13*Math.cos(an+0.4),y1-13*Math.sin(an+0.4));ctx.closePath();ctx.fill();}
  ctx.restore();if(o.pulse!=null&&o.pulse>0&&o.pulse<1){const[x,y]=at_(o.pulse);glow(ctx,x,y,22,col,0.8);ctx.fillStyle="rgba(255,255,255,0.95)";ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();}}
// dbt's YAML for one model, as the map generates it: o.lit[i] lights a line
const D11_DBT=["models:","  - name: readings","    description: one row per meter reading","    config:","      meta:","        owner: Grace Achieng","        domain: network","        rules: [RUL-020, RUL-021]"];
function d11_dbt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lh=46,h=92+D11_DBT.length*lh;if(a<=0.01)return h;const col=[255,150,120];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(8,8,14,0.96)"});const lw_=logo(ctx,"dbt",x+24,y+18,34);T(ctx,"models/network/readings.yml",x+36+lw_,y+46,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    ctx.fillStyle="rgba(255,190,170,0.16)";ctx.fillRect(x+14,y+66,w-28,1.2);
    D11_DBT.forEach((l,i)=>{const yy=y+70+i*lh+lh*0.68,on=o.lit?o.lit[i]||0:0,q=o.p==null?1:clamp(o.p*D11_DBT.length-i,0,1);if(q<=0)return;
      if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(TRUST,0.16);rr(ctx,x+12,yy-lh*0.72,w-24,lh*0.94,6);ctx.fill();});
      const m=l.match(/^(\s*-?\s*)([a-z_]+:)(.*)$/);if(m){const x0=x+26+tw(ctx,m[1],28,500,"mono");T(ctx,m[1],x+26,yy,{f:"mono",w:500,size:28,color:rgba(SOFT,0.8)});T(ctx,m[2],x0,yy,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.25),1)});T(ctx,m[3],x0+tw(ctx,m[2],28,500,"mono"),yy,{f:"mono",w:500,size:28,color:rgba(mix(INK,TRUST,on*0.5),0.96)});}
      else T(ctx,l,x+26,yy,{f:"mono",w:500,size:28,color:rgba(INK,0.9)});});});return h;}
// Databricks' catalogue page for the table: its name, owner, tags and description, and its lineage; o.lit[k] lights a part
function d11_dbx(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||520;if(a<=0.01)return h;const col=[255,120,90],L=o.lit||{};
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(10,10,16,0.96)"});const lw_=logo(ctx,"databricks",x+24,y+20,30);T(ctx,"Catalog",x+38+lw_,y+46,{w:700,size:28,color:rgba(SOFT,0.95)});
    ctx.fillStyle="rgba(255,190,170,0.16)";ctx.fillRect(x+14,y+66,w-28,1.2);T(ctx,"network.metering.readings",x+26,y+116,{f:"mono",w:500,size:30,color:rgba(INK,0.97)});
    const row=(k,ty,lab,fn)=>{const on=L[k]||0;if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(TRUST,0.14);rr(ctx,x+12,ty-36,w-24,52,6);ctx.fill();});T(ctx,lab,x+26,ty,{w:700,size:28,color:rgba(SOFT,0.95)});fn(x+190,ty);};
    row("owner",y+180,"Owner",(xx,yy)=>{archGlyph(ctx,"actor",xx+10,yy-10,12,TRUST);T(ctx,"Grace Achieng",xx+32,yy,{w:700,size:28,color:rgba(INK,0.95)});});
    row("tags",y+244,"Tags",(xx,yy)=>{let cx=xx;["domain: network","RUL-020","RUL-021"].forEach(s_=>{const tw_=tw(ctx,s_,28,500,"mono")+24;ctx.fillStyle=rgba([120,170,255],0.16);rr(ctx,cx,yy-30,tw_,42,21);ctx.fill();ctx.strokeStyle=rgba([150,190,255],0.7);ctx.lineWidth=1.4;rr(ctx,cx,yy-30,tw_,42,21);ctx.stroke();T(ctx,s_,cx+12,yy,{f:"mono",w:500,size:28,color:rgba([200,220,255],1)});cx+=tw_+12;});});
    row("desc",y+308,"About",(xx,yy)=>T(ctx,"one row per meter reading",xx,yy,{w:700,size:28,color:rgba(INK,0.92)}));
    // its lineage: where the rows come from and where they go
    const ly=y+h-62,on=L.lineage||0;if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(TRUST,0.14);rr(ctx,x+12,ly-94,w-24,128,6);ctx.fill();});T(ctx,"Lineage",x+26,ly-46,{w:700,size:28,color:rgba(SOFT,0.95)});
    let nx=x+26;const N=["ami.events","readings","billing.bills"].map(n=>{const bw=tw(ctx,n,28,500,"mono")+24,r=[n,nx,bw];nx+=bw+64;return r;});
    N.forEach(([n,bx,bw],i)=>{if(i<2){const x2=N[i+1][1];ctx.strokeStyle=rgba(mix([150,190,255],TRUST,on),0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+bw+6,ly);ctx.lineTo(x2-8,ly);ctx.stroke();ctx.fillStyle=rgba(mix([150,190,255],TRUST,on),0.8);ctx.beginPath();ctx.moveTo(x2-5,ly);ctx.lineTo(x2-16,ly-7);ctx.lineTo(x2-16,ly+7);ctx.closePath();ctx.fill();}
      ctx.fillStyle=i===1?rgba(mix([60,90,150],TRUST,on*0.4),0.5):"rgba(30,40,60,0.9)";rr(ctx,bx,ly-24,bw,48,8);ctx.fill();ctx.strokeStyle=rgba(i===1?mix([150,190,255],TRUST,on):[120,140,180],0.9);ctx.lineWidth=1.6;rr(ctx,bx,ly-24,bw,48,8);ctx.stroke();T(ctx,n,bx+12,ly+10,{f:"mono",w:500,size:28,color:rgba(INK,0.92)});});});return h;}
// a pencil, for an edit: tip at (x, y)
function d11_pencil(ctx,x,y,s,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?-0.7:rot);ctx.scale(s,s);ctx.fillStyle="rgba(255,214,120,1)";ctx.fillRect(14,-7,70,14);ctx.fillStyle="rgba(240,170,170,1)";ctx.fillRect(84,-7,12,14);ctx.fillStyle="rgba(200,200,210,1)";ctx.fillRect(80,-7,5,14);
  ctx.fillStyle="rgba(236,214,180,1)";ctx.beginPath();ctx.moveTo(14,-7);ctx.lineTo(0,0);ctx.lineTo(14,7);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(40,40,48,1)";ctx.beginPath();ctx.moveTo(5,-2.5);ctx.lineTo(0,0);ctx.lineTo(5,2.5);ctx.closePath();ctx.fill();ctx.restore();});}

/* ---------- the map, written out ---------- */
// the map's elements as lines of text, one per element, in the layers' order: what the slide's boxes become
const D11_LINES=[["GOL-002","keep bills affordable"],["PRN-003","customer information stays put"],["DRV-001","the energy transition"],
  ["CAP-001","operate the network"],["CAP-004","connect customers"],["CAP-007","manage outages"],["CAP-009","generate power"],
  ["STP-004","read"],["STP-005","bill"],["STP-006","paid"],["ROL-001","call-taker"],["ROL-002","duty controller"],
  ["OBJ-003","reading"],["OBJ-007","bill"],["OBJ-011","eligibility"],["MSR-002","working days to connect new solar"],
  ["APP-001","meter data"],["APP-004","billing"],["APP-006","outage system"],["APP-009","customer records"],["APP-012","network model"],
  ["TEC-002","meter network"],["TEC-005","data platform"],["TEC-008","control system"]];
// the rule's file, as Tomás writes it: RUL-021, the network's half of day one's rule (from Rules with a home)
const D11_RUL021=[["id","RUL-021"],["name","estimate replaced by actual"],["kind","requirement"],["definition",""],[null,"An estimate is replaced when the actual reading arrives,",{ind:1}],[null,"and the replacement is sent to the retailer.",{ind:1}],
  ["owner","Grace Achieng"],["relationships",""],[null,"realization: STP-004 · read",{ind:1}],[null,"association: OBJ-003 · reading",{ind:1}],["evidence","metering rules 7.4 · 14 Mar 2027"],["status","confirmed"]];
// a decision, as the map keeps it: film 7's, written down with why
const D11_DEC007=[["id","DEC-007"],["name","one outage system"],["decided","keep the newest outage system"],["why","three systems, three versions"],[null,"of every outage",{ind:2}],["decided by","Grace · October 2026"],["status","accepted"]];

/* ---------- an agent reads the map ---------- */
// what someone gives the agent: a kicker that says what it is, and its words
function d11_ask(ctx,x,y,w,kick,text,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||124;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(6,12,20,0.96)"});T(ctx,kick,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    T(ctx,text,x+28,y+96,{w:800,size:o.size||34,color:rgba(INK,0.97)});if(o.note&&o.noteA>0.01)withA(ctx,o.noteA,()=>tag(ctx,x+w-26-tw(ctx,o.note,28,700)-26,y+h/2,o.note,[200,215,240],{size:28}));});return h;}
// what the agent finds, step by step: rows of [glyph, label, name, colour], shown by o.rows[i] and joined down the left
function d11_trace(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=76,h=40+rows.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:10,ea:0.6,fill:"rgba(6,12,20,0.94)"});
    rows.forEach(([g,lab,nm,col],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const yy=y+58+i*rh;withA(ctx,q,()=>{
      if(i>0){ctx.strokeStyle=rgba(KT_AI,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+50,yy-rh+24);ctx.lineTo(x+50,yy-24);ctx.stroke();}
      glow(ctx,x+50,yy-1,24,col,0.25);d11_glyph(ctx,g,x+50,yy-2,15,col);T(ctx,lab,x+86,yy+9,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
      T(ctx,nm,x+86+tw(ctx,lab,28,500,"mono")+20,yy+10,{w:800,size:30,color:rgba(mix(col,INK,0.35),1)});});});});return h;}
// one element a change touches: its glyph, its ID and name, and its owner on the right
function d11_hit(ctx,x,y,w,kind,id,name,owner,o){o=o||{};const a=o.a==null?1:o.a,h=70;if(a<=0.01)return h;const[,col,gk]=D11_KIND[kind];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.95)"});d11_glyph(ctx,gk,x+38,y+h/2,14,col);T(ctx,id,x+72,y+h/2+10,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    T(ctx,name,x+72+tw(ctx,id,28,500,"mono")+18,y+h/2+10,{w:800,size:30,color:rgba(mix(col,INK,0.5),1)});const ow=tw(ctx,owner,28,700);archGlyph(ctx,"actor",x+w-ow-50,y+h/2-1,12,TRUST);
    T(ctx,owner,x+w-24,y+h/2+10,{w:700,size:28,align:"right",color:rgba(TRUST,1)});});return h;}
// the owners who must agree to a change, each with a ring that a tick fills when they do
function d11_agree(ctx,x,y,w,names,o){o=o||{};const a=o.a==null?1:o.a,h=110;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TRUST,{glow:10+12*(o.glow||0),ea:0.7,fill:"rgba(20,16,6,0.94)"});T(ctx,o.kicker||"must agree",x+28,y+64,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});
    let cx=x+28+tw(ctx,o.kicker||"must agree",28,500,"mono")+44;names.forEach((nm,i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;withA(ctx,q,()=>{ring(ctx,cx+14,y+h/2,14,TRUST,0.9,2.2);
      T(ctx,nm,cx+40,y+h/2+10,{w:800,size:30,color:rgba(TRUST,1)});});cx+=40+tw(ctx,nm,30,800)+48;});});return h;}
// the catalogue, open at one column: the table, then the column with its type and its values; o.hi lights the column
function d11_col(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=180;if(a<=0.01)return h;const col=[255,120,90];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(10,10,16,0.96)"});const lw_=logo(ctx,"databricks",x+26,y+20,30);
    T(ctx,"a column in the catalogue",x+40+lw_,y+46,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});T(ctx,"network.metering.readings",x+28,y+100,{f:"mono",w:500,size:30,color:rgba(SOFT,0.95)});
    const hi=o.hi||0;if(hi>0.01){ctx.fillStyle=rgba(KT_AI,0.14*hi);rr(ctx,x+14,y+118,w-28,50,8);ctx.fill();}
    T(ctx,"read_type",x+28,y+154,{f:"mono",w:500,size:30,color:rgba(mix(KT_AI,INK,0.3),1)});T(ctx,"string",x+260,y+154,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
    T(ctx,"actual · estimated",x+420,y+154,{f:"mono",w:500,size:28,color:rgba(INK,0.9)});});return h;}
// the agent's answer, which cites what it found: o.ul (0..1) underlines each citation as a link; o.chk ticks the source once checked
function d11_answer(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=164;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:12+14*(o.glow||0),ea:0.85,fill:"rgba(6,12,20,0.97)"});kt_agent(ctx,x+40,y+40,15,o.t||0,{});T(ctx,"the agent's answer",x+72,y+50,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    const L=[[["read_type keeps ",0],["RUL-020",1],[", owned by Grace Achieng.",0]],[["Its reason: ",0],["the metering rules, 7.2",2],[".",0]]];
    L.forEach((ln,i)=>{let cx=x+28;const yy=y+100+i*44;ln.forEach(([s_,k])=>{const sw=tw(ctx,s_,30,700),u=k?(o.ul||0):0;T(ctx,s_,cx,yy,{w:700,size:30,color:rgba(k&&u>0.01?mix(INK,KT_AI,u):INK,0.96)});
      if(u>0.01){ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(cx,yy+7,sw*u,2.2);}if(k===2){o.linkAt&&o.linkAt(cx+sw/2,yy-10);if(o.chk>0.01){glow(ctx,cx+sw+30,yy-10,20,D11_OK,0.3*o.chk);withA(ctx,o.chk,()=>tick_(ctx,cx+sw+30,yy-8,24,D11_OK,1));}}cx+=sw;});});});return h;}
// a mouse pointer, tip at (x, y); press (0..1) dips it and rings the spot
function d11_cursor(ctx,x,y,s,a,press){if(a<=0.01)return;const pr=press||0;withA(ctx,a,()=>{if(pr>0.01&&pr<1){ctx.save();ctx.strokeStyle=rgba(KT_AI,1-pr);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,8+pr*26,0,TAU);ctx.stroke();ctx.restore();}
  ctx.save();ctx.translate(x,y);ctx.scale(s*(1-0.12*Math.sin(Math.PI*clamp(pr*2,0,1))),s*(1-0.12*Math.sin(Math.PI*clamp(pr*2,0,1))));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,26);ctx.lineTo(6.5,20);ctx.lineTo(11,30);ctx.lineTo(15,28);ctx.lineTo(10.5,18.5);ctx.lineTo(19,18.5);ctx.closePath();
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=6;ctx.fillStyle="rgba(250,250,252,1)";ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="rgba(20,24,32,1)";ctx.lineWidth=1.4;ctx.stroke();ctx.restore();});}
// the source itself: a page of the metering rules, open at the clause
function d11_source(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:7,curl:0.4});const ink=[44,38,32];
  T(ctx,"Metering rules",x+30,y+52,{w:800,size:30,color:rgba(ink,1)});T(ctx,"14 March 2027",x+w-30,y+52,{w:700,size:28,align:"right",color:rgba(ink,0.75)});
  ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+28,y+74,w-56,1.4);const hl=o.hl||0;if(hl>0.01){ctx.fillStyle=`rgba(255,214,90,${0.45*hl})`;ctx.fillRect(x+84,y+96,(w-120)*hl,82);}
  T(ctx,"7.2",x+30,y+124,{w:800,size:28,color:rgba(ink,1)});T(ctx,"Every reading is marked",x+90,y+124,{w:700,size:28,color:rgba(ink,1)});T(ctx,"actual or estimated.",x+90,y+166,{w:700,size:28,color:rgba(ink,1)});});}

/* ---------- an agent on the map ---------- */
// the outage agent, from Who does it: its ID, its owner and its rights, for comparison
function d11_outage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,APL,{glow:10,ea:0.7,fill:"rgba(10,10,14,0.95)"});T(ctx,"like the outage agent's",x+28,y+44,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    d11_glyph(ctx,"component",x+42,y+86,13,APL);T(ctx,"APP-015",x+68,y+96,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,"outage agent",x+68+tw(ctx,"APP-015",28,500,"mono")+16,y+96,{w:800,size:30,color:rgba(mix(APL,INK,0.5),1)});
    archGlyph(ctx,"actor",x+w-tw(ctx,"owner: Grace Achieng",28,700)-50,y+86,12,TRUST);T(ctx,"owner: Grace Achieng",x+w-28,y+96,{w:700,size:28,align:"right",color:rgba(TRUST,1)});
    T(ctx,"may: group reports, propose  ·  may not: send a crew",x+28,y+136,{w:700,size:28,color:rgba(SOFT,0.95)});});return h;}
// two sources that disagree: the metering rules (paper) and the meter data system's setting (a screen)
function d11_disagree(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=[44,38,32];withA(ctx,a,()=>{
  const pa=o.pa==null?1:o.pa,pb=o.pb==null?1:o.pb,ne=o.ne||0;
  if(pa>0.01)withA(ctx,pa,()=>{kt_paper(ctx,x,y,360,150,t,{seed:4,curl:0.3});T(ctx,"Metering rules · 7.4",x+24,y+48,{w:800,size:28,color:rgba(ink,0.85)});T(ctx,"2 working days",x+24,y+108,{w:800,size:36,color:rgba(ink,1)});});
  if(pb>0.01)withA(ctx,pb,()=>{glass(ctx,x+424,y,360,150,14,APL,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,"meter data system",x+448,y+48,{f:"mono",w:500,size:28,color:rgba(APL,1)});T(ctx,"3 days",x+448,y+108,{f:"mono",w:500,size:36,color:rgba(INK,0.95)});});
  if(ne>0.01)withA(ctx,ne,()=>{glow(ctx,x+392,y+75,26,AMBER,0.35);T(ctx,"≠",x+392,y+92,{w:800,size:44,align:"center",color:rgba(AMBER,1)});});});}
// the agent's question, to the owner, when sources disagree
function d11_question(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:12+12*(o.glow||0),ea:0.85,fill:"rgba(6,12,20,0.97)"});kt_agent(ctx,x+38,y+40,14,t,{});T(ctx,"asks the owner",x+64,y+50,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    archGlyph(ctx,"actor",x+38,y+92,12,TRUST);T(ctx,"Grace Achieng",x+62,y+102,{w:800,size:30,color:rgba(TRUST,1)});T(ctx,"which is right?",x+28,y+138,{w:700,size:28,color:rgba(INK,0.92)});});return h;}
// the rule from Keeping it true: agents draft, people confirm, every version is kept; o.sw (0..1) swaps "data models" for "the map"
function d11_rule3(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;const R=o.rows||[1,1,1],sw=ease(clamp(o.sw||0,0,1));
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TRUST,{glow:12+14*(o.glow||0),ea:0.75,fill:"rgba(16,14,8,0.95)"});
    const t1="the rule that keeps ",t3=" true",w1=tw(ctx,t1,30,700);T(ctx,t1,x+28,y+50,{w:700,size:30,color:rgba(INK,0.92)});
    const wa=tw(ctx,"data models",30,800),wb=tw(ctx,"the map",30,800),wm=lerp(wa,wb,sw);withA(ctx,1-sw,()=>T(ctx,"data models",x+28+w1,y+50-sw*16,{w:800,size:30,color:rgba(SOFT,1)}));withA(ctx,sw,()=>T(ctx,"the map",x+28+w1,y+50+(1-sw)*16,{w:800,size:30,color:rgba(EAC,1)}));
    if(sw>0.02&&sw<0.98){ctx.strokeStyle=rgba(SOFT,0.6*(1-sw));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28+w1,y+40);ctx.lineTo(x+28+w1+wa,y+40);ctx.stroke();}
    T(ctx,t3,x+28+w1+wm,y+50,{w:700,size:30,color:rgba(INK,0.92)});
    const S3=[["agents draft",0],["people confirm",1],["every version kept",2]];let cx=x+28;S3.forEach(([s_,k],i)=>{const q=R[i]||0;const sw_=tw(ctx,s_,30,800);if(q>0.01)withA(ctx,q,()=>{
      if(k===0)kt_agent(ctx,cx+16,y+106,13,t,{});else if(k===1)kt_gtick(ctx,cx+16,y+106,15,1);else{for(let j=0;j<3;j++){ctx.fillStyle=rgba(j===2?TRUST:EAC,1);ctx.beginPath();ctx.arc(cx+4+j*14,y+106,5,0,TAU);ctx.fill();}}
      T(ctx,s_,cx+46,y+116,{w:800,size:30,color:rgba(k===1?TRUST:k===0?KT_AI:mix(EAC,INK,0.3),1)});if(i<2&&(R[i+1]||0)>0.01)withA(ctx,R[i+1],()=>arrowTo(ctx,cx+46+sw_+18,y+106,cx+46+sw_+62,y+106,SOFT,0.8));});cx+=46+sw_+84;});});return h;}

/* ---------- people confirm ---------- */
// the regulator's retail code, amended: clause 4.2 says why, as in Rules with a home, and a new sentence is written in after it (o.nw 0..1),
// underlined as an amendment is
function d11_code(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=[44,38,32],red=[176,52,44];withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:9,curl:0.35});
  T(ctx,"Retail code",x+32,y+52,{w:800,size:34,color:rgba(ink,1)});T(ctx,"the energy regulator · amended, January 2028",x+w-32,y+50,{w:700,size:28,align:"right",color:rgba(ink,0.72)});
  ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+30,y+74,w-60,1.4);const hl=o.hl||0;if(hl>0.01){ctx.fillStyle=`rgba(255,214,90,${0.4*hl})`;ctx.fillRect(x+86,y+140,w-120,94);}
  T(ctx,"4.2",x+32,y+124,{w:800,size:28,color:rgba(ink,1)});T(ctx,"A bill must reflect actual readings.",x+92,y+124,{w:700,size:28,color:rgba(ink,1)});
  const L1="When an actual reading replaces an estimate,",L2="the bill must be corrected within ten working days.",n=Math.round(clamp(o.nw||0,0,1)*(L1.length+L2.length));
  [[L1.slice(0,n),y+172],[L2.slice(0,Math.max(0,n-L1.length)),y+216]].forEach(([s_,yy])=>{if(!s_)return;T(ctx,s_,x+92,yy,{w:800,size:28,color:rgba(red,1)});ctx.fillStyle=rgba(red,0.75);ctx.fillRect(x+92,yy+7,tw(ctx,s_,28,800),2);});});}
// what a change touches: the tracking table and the views built from the rule, as chips after a kicker (k: 2 meter to cash, 3 the
// ontology, 4 the tracking table)
function d11_touches(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"it touches",x,y+10,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});let cx=x+tw(ctx,"it touches",28,500,"mono")+24;
  items.forEach(([k,s_],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const sw=tw(ctx,s_,28,700)+(k?64:30);withA(ctx,q,()=>{const col=k===4?D11_RET:D11_VCOL;glass(ctx,cx,y-24,sw,48,24,col,{glow:8,ea:0.75,fill:"rgba(6,10,20,0.95)"});
    if(k===4)d11_tgrid(ctx,cx+14,y-11,28,22,D11_RET);else if(k===2)d11_vicon(ctx,0,cx+12,y-12,30,24,D11_VCOL);else if(k===3)d11_vicon(ctx,3,cx+12,y-12,30,24,D11_VCOL);T(ctx,s_,cx+(k?50:15),y+10,{w:700,size:28,color:rgba(mix(col,INK,0.5),1)});});cx+=sw+16;});});}
// a table's glyph, with no words: a header row and two rows, in the box (x, y, w, h)
function d11_tgrid(ctx,x,y,w,h,col){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.6;rr(ctx,x,y,w,h,3);ctx.stroke();ctx.fillStyle=rgba(col,0.45);ctx.fillRect(x+1,y+1,w-2,h/3-1);
  ctx.beginPath();ctx.moveTo(x,y+h*2/3);ctx.lineTo(x+w,y+h*2/3);ctx.moveTo(x+w*0.42,y+h/3);ctx.lineTo(x+w*0.42,y+h);ctx.stroke();ctx.restore();}
// retail's rule is about what the business does, so it isn't a data test: it builds a tracking table, as Rules with a home shows,
// which the billing team reads each morning. Each bill based on a replaced estimate, and the working days it has waited to be
// corrected; the window is the rule's, so it changes with it (o.sw 0..1: from the next bill to ten working days), and then a bill
// past it shows as late (o.late 0..1). o.rows shows each row
const D11_TRACK=[["B-20417","2"],["B-20388","7"],["B-20211","11"]];
function d11_track(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lh=56,h=196+D11_TRACK.length*lh;if(a<=0.01)return h;const col=D11_RET,sw=ease(clamp(o.sw||0,0,1)),lt=clamp(o.late||0,0,1);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(14,8,12,0.96)"});d11_tgrid(ctx,x+26,y+26,40,30,col);
    T(ctx,"bills to correct",x+84,y+52,{f:"mono",w:500,size:30,color:rgba(col,1)});T(ctx,"the billing team · each morning",x+w-28,y+50,{w:700,size:28,align:"right",color:rgba(SOFT,0.95)});
    ctx.fillStyle=rgba(col,0.2);ctx.fillRect(x+14,y+76,w-28,1.2);
    // the window, from the rule: "on the next bill" struck out, and "within 10 working days" written in
    const k0="RUL-022 · corrected ",kw=tw(ctx,k0,28,500,"mono");T(ctx,k0,x+28,y+124,{f:"mono",w:500,size:28,color:rgba(D11_RULE,1)});
    const o1="on the next bill",ow=tw(ctx,o1,28,700);withA(ctx,1-sw,()=>{T(ctx,o1,x+28+kw,y+124-sw*14,{w:700,size:28,color:rgba(INK,0.9)});});
    if(sw>0.02&&sw<0.98){ctx.strokeStyle=rgba(D11_RED,0.8*(1-sw));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28+kw,y+115);ctx.lineTo(x+28+kw+ow*clamp(sw*2,0,1),y+115);ctx.stroke();}
    withA(ctx,sw,()=>T(ctx,"within 10 working days",x+28+kw,y+124+(1-sw)*14,{w:800,size:28,color:rgba(TRUST,1)}));
    // the columns, and a row for each bill
    const cX=[x+28,x+330,x+w-200];[["bill",0],["working days waiting",1],["status",2]].forEach(([s_,i])=>T(ctx,s_,cX[i],y+176,{w:700,size:28,color:rgba(SOFT,0.85)}));
    D11_TRACK.forEach(([b,d],i)=>{const q=o.rows?o.rows[i]==null?1:o.rows[i]:1;if(q<=0.01)return;const yy=y+196+i*lh,late=+d>10,L=late?lt:0;withA(ctx,q,()=>{
      if(L>0.01){ctx.fillStyle=rgba(D11_RED,0.14*L);ctx.fillRect(x+14,yy+4,w-28,lh-8);}
      T(ctx,b,cX[0],yy+lh*0.68,{f:"mono",w:500,size:28,color:rgba(INK,0.92)});T(ctx,d,cX[1],yy+lh*0.68,{f:"mono",w:500,size:28,color:rgba(mix(INK,D11_RED,L),0.92)});
      withA(ctx,1-sw,()=>T(ctx,"next bill",cX[2],yy+lh*0.68,{w:700,size:28,color:rgba(SOFT,0.9)}));
      withA(ctx,sw,()=>{if(late){withA(ctx,1-L,()=>T(ctx,"on time",cX[2],yy+lh*0.68,{w:700,size:28,color:rgba(D11_OK,1)}));withA(ctx,L,()=>{glow(ctx,cX[2]+30,yy+lh*0.5,26,D11_RED,0.35);T(ctx,"late",cX[2],yy+lh*0.68,{w:800,size:28,color:rgba(D11_RED,1)});});}
        else T(ctx,"on time",cX[2],yy+lh*0.68,{w:700,size:28,color:rgba(D11_OK,1)});});});});});return h;}

/* ---------- day one, again ---------- */
// Zofia's badge, on its lanyard, as Tomás's was on his first day
function d11_badge(ctx,x,y,s,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||-0.06);ctx.strokeStyle=rgba(TECH,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-40*s,-150*s);ctx.lineTo(0,-70*s);ctx.lineTo(40*s,-150*s);ctx.stroke();
  glass(ctx,-90*s,-70*s,180*s,240*s,14*s,CYAN,{glow:14,ea:0.8,fill:"rgba(236,240,246,0.97)"});ctx.fillStyle="rgba(176,120,74,0.9)";rr(ctx,-50*s,-36*s,100*s,100*s,50*s);ctx.fill();
  T(ctx,"ZOFIA NOWAK",0,96*s,{w:800,size:17*s,align:"center",color:"rgba(30,34,44,1)",deco:1});T(ctx,"Data engineer",0,122*s,{w:600,size:14*s,align:"center",color:"rgba(70,76,90,1)",deco:1});
  ctx.fillStyle="rgba(60,170,150,0.9)";ctx.fillRect(-90*s,142*s,180*s,14*s);ctx.restore();});}
// a page of acronyms, the organisation's language
function d11_acr(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=[44,38,32];withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:15,curl:0.4});
  T(ctx,"Acronyms",x+28,y+46,{w:800,size:30,color:rgba(ink,1)});ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+26,y+64,w-52,1.4);
  ["AMI","CIS","OMS","MDM","RAB","DUoS","SCADA","GIS"].forEach((s_,i)=>T(ctx,s_,x+30+(i>>2)*(w/2-10),y+106+(i&3)*40,{f:"mono",w:500,size:28,color:rgba(ink,0.95)}));});}
// the list of systems, scrolling, with how many there are
const D11_SYS=["OMS · outages","CIS · customers","SCADA · network control","GIS · network map","AMI head-end · meters","MDM · meter data","Billing","ERP · finance","EAM · assets","Field mobility","Data platform","HR · payroll"];
function d11_sys(ctx,x,y,w,h,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,14,[170,205,255],{glow:12,ea:0.7,fill:"rgba(6,10,20,0.95)"});T(ctx,"systems",x+20,y+42,{f:"mono",w:500,size:28,color:"rgba(170,205,255,1)"});
  T(ctx,(o.count==null?138:o.count)+"",x+w-20,y+46,{w:800,size:38,align:"right",color:rgba(INK,1)});ctx.save();ctx.beginPath();ctx.rect(x+10,y+62,w-20,h-72);ctx.clip();const sc=(o.scroll||0)*30,rh=30;
  for(let i=0;i<Math.ceil((h-58)/rh)+2;i++){const k=Math.floor(sc/rh)+i,yy=y+72+i*rh-(sc%rh);T(ctx,D11_SYS[k%D11_SYS.length],x+22,yy+14,{f:"mono",w:500,size:16,color:rgba(SOFT,0.95),deco:1});}ctx.restore();});}
// Zofia asks the agent; back come an owner and two rules, each with its reason and a link to check it
function d11_chat(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,KT_AI,{glow:12,ea:0.7,fill:"rgba(6,12,20,0.95)"});
  kt_agent(ctx,x+40,y+42,15,t,{busy:o.busy||0});T(ctx,"map agent",x+70,y+52,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});ctx.fillStyle="rgba(130,230,215,0.16)";ctx.fillRect(x+16,y+76,w-32,1.2);
  const q=o.q||0;if(q>0.01)withA(ctx,clamp(q*3,0,1),()=>{const bx=x+w-640-24,by=y+96;glass(ctx,bx,by,640,112,16,TECH,{glow:10,ea:0.7,fill:"rgba(10,18,30,0.96)"});
    T(ctx,"Zofia",bx+24,by+36,{w:800,size:28,color:rgba(TECH,1)});const L=["Who owns the readings data,","and which rules does it keep?"],n=Math.round(clamp(q,0,1)*(L[0].length+L[1].length));
    T(ctx,L[0].slice(0,Math.min(n,L[0].length)),bx+24,by+72,{w:700,size:28,color:rgba(INK,0.96)});if(n>L[0].length)T(ctx,L[1].slice(0,n-L[0].length),bx+24,by+104,{w:700,size:28,color:rgba(INK,0.96)});});
  if(o.dots>0.01&&o.dots<1)withA(ctx,1,()=>{for(let i=0;i<3;i++){ctx.fillStyle=rgba(KT_AI,0.4+0.6*Math.max(0,Math.sin(t*6-i*0.9)));ctx.beginPath();ctx.arc(x+50+i*22,y+262,6,0,TAU);ctx.fill();}});
  const R=o.rows||[0,0,0],ay=y+244;
  if(R[0]>0.01)withA(ctx,R[0],()=>{archGlyph(ctx,"actor",x+46,ay+4,14,TRUST);T(ctx,"Grace Achieng",x+76,ay+14,{w:800,size:30,color:rgba(TRUST,1)});T(ctx,"owner · network operations",x+76+tw(ctx,"Grace Achieng",30,800)+18,ay+14,{w:700,size:28,color:rgba(SOFT,1)});});
  [["RUL-020","every reading is marked actual or estimated","the metering rules, 7.2"],["RUL-021","estimate replaced by actual","the metering rules, 7.4"]].forEach(([id,nm,src],i)=>{const q_=R[i+1]||0;if(q_<=0.01)return;const yy=ay+82+i*104;withA(ctx,q_,()=>{
    d11_glyph(ctx,"requirement",x+46,yy-8,13,D11_RULE);T(ctx,id,x+76,yy,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,nm,x+76+tw(ctx,id,28,500,"mono")+16,yy,{w:800,size:30,color:rgba(mix(D11_RULE,INK,0.4),1)});
    T(ctx,"reason:",x+76,yy+44,{w:700,size:28,color:rgba(SOFT,1)});const lx=x+76+tw(ctx,"reason: ",28,700),sw=tw(ctx,src,28,700),u=o.ul||0;T(ctx,src,lx,yy+44,{w:700,size:28,color:rgba(mix(INK,KT_AI,u),1)});
    if(u>0.01){ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(lx,yy+51,sw*u,2.2);withA(ctx,u,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,1);ctx.lineWidth=2.4;ctx.lineCap="round";const ex=lx+sw+22,ey=yy+32;ctx.beginPath();ctx.moveTo(ex-8,ey+8);ctx.lineTo(ex+6,ey-6);ctx.moveTo(ex-3,ey-6);ctx.lineTo(ex+6,ey-6);ctx.lineTo(ex+6,ey+3);ctx.stroke();ctx.restore();});}});});});}
