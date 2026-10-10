/* ===== Who does it, and where meaning changes: the film's own pictures (prefixed d6_) =====
   Japan: a sketch map of its four main islands at night, the line across the middle where its two frequencies meet, the grids that
   grew from Tokyo and Osaka, two early generators, their waves at fifty and sixty cycles, the converter stations on the line, the
   power stations of 2011, power piling up in the west and a thin stream crossing, and the turns of power cuts around Tokyo. On the
   wall: process steps with names pencilled on, roles and actors in the business layer's yellow, the utility's teams and a partner
   outside them, a contract, the AI agent and its rights, a house on Hill Street with its connection point and a moving van, the two
   domains (the network in blue, retail in rose), the wall between them and the gate where what crosses is translated.
   Japan is drawn in the series' own style, not in the style of Japanese art, and no borders but the frequency line are drawn
   (PLAYBOOK §2). */

const BUS=LAY6[2][1],STR=LAY6[1][1],MOT=LAY6[0][1],INF=LAY6[3][1];
// the two sides of every edge in the film: the east of Japan and the network in blue, the west and retail in rose
const D6_NET=[132,176,255],D6_RET=[255,150,186],D6_E50=D6_NET,D6_W60=[255,176,128],D6_RED=[232,96,84];

/* ---------- Japan, from above ---------- */
// A sketch of the four main islands, not a survey: longitude and latitude, projected simply. The frequency line runs from Itoigawa,
// on the Sea of Japan, to the mouth of the Fuji River, on the Pacific: 50 Hz to the east (and in Hokkaido), 60 Hz to the west.
const d6_pr=([lo,la])=>[960+(lo-137.6)*52,520-(la-38.4)*64.5];
const D6_ISL=[
 [[140.9,41.52],[141.45,41.43],[141.42,41.1],[141.5,40.55],[141.75,40.2],[142.07,39.55],[141.9,39.25],[141.7,38.95],[141.55,38.6],[141.5,38.3],[141.05,38.33],[140.95,38.05],[141.0,37.6],[140.98,37.1],[140.7,36.6],[140.6,36.2],[140.87,35.73],[140.4,35.2],[139.85,34.92],[139.85,35.3],[140.1,35.6],[139.75,35.65],[139.65,35.3],[139.65,35.15],[139.15,35.25],[139.1,34.9],[138.85,34.6],[138.75,34.95],[138.85,35.1],[138.5,35.0],[138.22,34.62],[137.7,34.68],[137.05,34.58],[137.3,34.75],[136.9,35.05],[136.65,34.6],[136.9,34.3],[136.2,33.85],[135.77,33.45],[135.1,33.88],[135.15,34.25],[135.4,34.65],[135.0,34.65],[134.7,34.75],[133.9,34.55],[133.2,34.35],[132.45,34.32],[132.15,34.1],[131.4,33.95],[130.9,33.95],[130.9,34.3],[131.4,34.42],[132.1,34.9],[132.7,35.4],[133.3,35.57],[134.2,35.55],[135.25,35.75],[135.75,35.5],[136.05,35.68],[136.1,36.1],[136.6,36.6],[136.75,37.2],[137.35,37.53],[136.95,36.95],[137.25,36.78],[137.85,37.05],[138.25,37.2],[139.05,37.95],[139.55,38.4],[139.85,38.9],[140.05,39.6],[139.7,39.95],[140.0,40.2],[139.88,40.6],[140.35,41.25],[140.7,40.88],[141.2,40.95],[141.15,41.2]],
 [[140.05,41.42],[140.7,41.75],[141.15,41.8],[140.95,42.3],[141.6,42.62],[142.5,42.2],[143.25,41.93],[143.6,42.6],[144.4,42.95],[145.15,43.0],[145.6,43.35],[145.2,43.6],[145.3,44.35],[144.3,44.0],[143.3,44.35],[142.4,44.95],[141.95,45.52],[141.65,45.4],[141.75,44.7],[141.65,43.95],[141.35,43.35],[140.95,43.2],[140.45,43.38],[140.3,42.75],[139.85,42.5],[140.1,41.85]],
 [[134.6,34.2],[134.75,33.85],[134.18,33.25],[133.6,33.5],[133.25,33.35],[132.98,32.73],[132.5,33.2],[132.0,33.38],[132.7,33.85],[133.0,34.08],[133.5,33.98],[134.05,34.35]],
 [[130.95,33.95],[130.4,33.62],[129.95,33.5],[129.6,33.3],[129.75,32.85],[129.85,32.72],[130.2,32.8],[130.35,32.55],[130.15,32.15],[130.2,31.4],[130.65,31.0],[131.05,31.4],[131.45,31.9],[131.7,32.6],[131.9,32.95],[131.6,33.25],[131.75,33.6],[131.25,33.6]]].map(I=>I.map(d6_pr));
const D6_LINE=[[137.78,37.35],[137.86,37.04],[137.95,36.6],[137.98,36.1],[138.2,35.6],[138.45,35.3],[138.62,35.12],[138.72,34.85]].map(d6_pr);
const D6_TOKYO=d6_pr([139.69,35.69]),D6_OSAKA=d6_pr([135.5,34.69]);
// the grids, grown from each city: east from Tokyo (and Hokkaido's), west from Osaka (and Shikoku's and Kyushu's)
const D6_GRID_E=[[[139.69,35.69],[139.9,36.4],[140.4,37.4],[140.9,38.3],[141.1,39.7],[140.75,40.8]],[[139.69,35.69],[139.1,35.5],[138.75,35.25]],[[139.69,35.69],[139.0,36.4],[138.9,37.4],[139.05,37.9]],
  [[139.0,36.4],[138.5,36.5],[138.1,36.75]],[[140.75,41.8],[141.35,43.06],[142.4,43.3],[143.2,42.9]]].map(L=>mk(L.map(q=>{const[x,y]=d6_pr(q);return P(x,y);})));
const D6_GRID_W=[[[135.5,34.69],[136.2,34.9],[136.9,35.17],[137.6,35.2],[137.95,35.3]],[[135.5,34.69],[134.7,34.8],[133.9,34.65],[132.45,34.4],[131.0,34.0]],[[135.5,34.69],[135.75,35.0],[136.2,35.6],[136.65,36.55],[137.2,36.7],[137.75,36.9]],
  [[134.6,34.1],[133.55,33.6],[132.75,33.8]],[[130.9,33.85],[130.4,33.55],[130.7,32.8],[130.55,31.6]]].map(L=>mk(L.map(q=>{const[x,y]=d6_pr(q);return P(x,y);})));
// the converter stations on the line in 2011 (their places approximate), and one built since
const D6_CONV=[[137.98,36.1],[138.3,35.47],[138.56,35.2]].map(d6_pr),D6_CONV2=[[137.92,36.72]].map(d6_pr);
// power stations: the west's, and the east's, most of whose coastal stations went offline in March 2011
const D6_PW=[[135.2,34.5],[136.0,35.65],[136.85,34.95],[133.7,34.5],[132.4,34.25],[130.7,33.85],[134.6,33.95],[131.65,33.2],[137.2,34.75]].map(d6_pr);
const D6_PE=[[140.62,36.4,1],[141.03,37.42,1],[141.02,37.3,1],[141.0,37.15,1],[140.97,37.8,1],[141.0,38.2,1],[141.5,38.42,1],[140.82,35.92,1],[139.8,35.42,0],[139.9,35.55,0],[140.05,35.45,1],[141.35,40.5,0],[141.1,42.6,0]].map(([lo,la,k])=>[...d6_pr([lo,la]),k]);
// the turns of power cuts: blocks of the region around Tokyo, not its centre, going dark one group after another
const D6_ROLL=Array.from({length:30},(_,i)=>{const an=hash(i,611)*TAU,r=16+36*Math.sqrt(hash(i,610));return[D6_TOKYO[0]-14+Math.cos(an)*r*1.3,D6_TOKYO[1]-12+Math.sin(an)*r*0.8,i%5];});
// the east of the line, as a region to clip to
function d6_sideClip(ctx,east){const X=east?2600:-1600;ctx.beginPath();ctx.moveTo(D6_LINE[0][0],-400);D6_LINE.forEach(([x,y])=>ctx.lineTo(x,y));ctx.lineTo(D6_LINE[D6_LINE.length-1][0],1500);ctx.lineTo(X,1500);ctx.lineTo(X,-400);ctx.closePath();}
function d6_drawPath(ctx,L,p){if(p<=0)return;ctx.beginPath();for(let k=0;k<=60;k++){const q=at(L,k/60*p);k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();}
// a converter station: a small box that takes a wave in and gives another out
function d6_conv(ctx,x,y,s,g,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,s*2.2,[220,230,255],0.25+0.45*g);ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(10,14,26,0.95)";rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.fill();
  ctx.strokeStyle="rgba(230,236,255,0.95)";ctx.lineWidth=Math.max(1.5,s*0.12);rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.stroke();ctx.lineWidth=Math.max(1.2,s*0.1);
  [[-1,D6_W60,3],[1,D6_E50,2]].forEach(([sd,col,n])=>{ctx.strokeStyle=rgba(col,1);ctx.beginPath();for(let i=0;i<=16;i++){const u=i/16,xx=sd*s*(0.12+u*0.72);const yy=Math.sin(u*TAU*n/2*1.5)*s*0.28;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});
  ctx.restore();});}
// the map. o.land: the islands; o.lines: the frequency line drawn in; o.east, o.west: each side tinted; o.ge, o.gw: the grids grown;
// o.tokyo, o.osaka: the cities lit; o.plants: the power stations; o.out: the east's coastal ones going dark; o.flow: power moving
// east and piling up at the line; o.conv: the converters; o.cross: the thin stream through them; o.more: one built since;
// o.roll: the turns of power cuts around Tokyo; o.lab: the cities' names
function d6_japan(ctx,t,o){o=o||{};ctx.save();
  const g=ctx.createLinearGradient(0,-300,0,1400);g.addColorStop(0,"#0a1626");g.addColorStop(1,"#0f2234");ctx.fillStyle=g;ctx.fillRect(-1600,-1000,5200,3200);
  ctx.strokeStyle="rgba(160,200,230,0.06)";ctx.lineWidth=2;for(let i=0;i<34;i++){const y=-300+i*52,ph=t*0.35+i;ctx.beginPath();for(let x=-1600;x<=3600;x+=48){const yy=y+Math.sin(x*0.011+ph)*4;x===-1600?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
  const la=o.land==null?1:o.land,shape=I=>{ctx.beginPath();I.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
  if(la>0)withA(ctx,la,()=>{D6_ISL.forEach(I=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=18;shape(I);const lg=ctx.createLinearGradient(500,0,1500,1000);lg.addColorStop(0,"#5a5248");lg.addColorStop(1,"#3e3a36");ctx.fillStyle=lg;ctx.fill();ctx.restore();
      ctx.strokeStyle="rgba(232,214,184,0.55)";ctx.lineWidth=2.5;shape(I);ctx.stroke();});
    // each side's tint, clipped to the land
    const tint=(col,a,east)=>{if(a<=0.01)return;ctx.save();ctx.beginPath();D6_ISL.forEach(I=>{I.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();});ctx.clip();
      d6_sideClip(ctx,east);ctx.clip();ctx.fillStyle=rgba(col,0.22*a);ctx.fillRect(-200,-400,2600,1900);ctx.restore();};
    tint(D6_W60,o.west||0,false);tint(D6_E50,o.east||0,true);});
  // the grids
  ctx.lineCap="round";ctx.lineJoin="round";
  [[D6_GRID_E,o.ge||0,D6_E50],[D6_GRID_W,o.gw||0,D6_W60]].forEach(([G,p,col])=>{if(p<=0)return;G.forEach((L,i)=>{const q=clamp(p*1.6-i*0.15,0,1);ctx.strokeStyle=rgba(col,0.25);ctx.lineWidth=8;d6_drawPath(ctx,L,q);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;d6_drawPath(ctx,L,q);});});
  // the power stations
  const pl=o.plants||0,out=o.out||0;if(pl>0){D6_PW.forEach(([x,y],i)=>withA(ctx,pl,()=>{glow(ctx,x,y,16,D6_W60,0.7);ctx.fillStyle="#fff1dc";ctx.beginPath();ctx.arc(x,y,4.5,0,TAU);ctx.fill();}));
    D6_PE.forEach(([x,y,k],i)=>{const off=k?clamp(out*1.8-hash(i,620)*0.8,0,1):0;withA(ctx,pl,()=>{if(off<1)glow(ctx,x,y,16,D6_E50,0.7*(1-off));ctx.fillStyle=rgba(mix([235,242,255],[70,74,84],off),1);ctx.beginPath();ctx.arc(x,y,4.5,0,TAU);ctx.fill();});});}
  // the line where the frequencies meet
  const lp=o.lines||0;if(lp>0){const L=mk(D6_LINE.map(([x,y])=>P(x,y)));ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle="rgba(250,246,236,0.95)";ctx.lineWidth=3.5;ctx.shadowColor="rgba(255,255,255,0.6)";ctx.shadowBlur=8+10*(o.lineHi||0);d6_drawPath(ctx,L,lp);ctx.restore();}
  // power moving east from the west's stations, piling up at the line; a thin stream crossing at the converters
  const fl=o.flow||0;if(fl>0)for(let k=0;k<70;k++){const L=D6_GRID_W[k%3===2?2:0],v=(hash(k,630)+t*0.12)%1,u=1-Math.pow(1-v,2.6);const q=at(L,u),j=(hash(k,631)-0.5)*10;
    withA(ctx,fl*sstep(0,0.08,v),()=>{glow(ctx,q.x+j,q.y+j,12,D6_W60,0.6);ctx.fillStyle="rgba(255,240,220,0.95)";ctx.beginPath();ctx.arc(q.x+j,q.y+j,3.2,0,TAU);ctx.fill();});}
  const cr=o.cross||0;if(cr>0)D6_CONV.forEach(([x,y],i)=>{for(let k=0;k<3;k++){const v=(t*0.3+k/3+i*0.21)%1,xx=lerp(x+14,D6_TOKYO[0]-6,v),yy=lerp(y,D6_TOKYO[1],v)-Math.sin(Math.PI*v)*14;withA(ctx,cr*sstep(0,0.1,v)*(1-sstep(0.85,1,v)),()=>{glow(ctx,xx,yy,14,D6_E50,0.7);ctx.fillStyle="rgba(230,240,255,0.98)";ctx.beginPath();ctx.arc(xx,yy,3.6,0,TAU);ctx.fill();});}});
  const hz=o.hz||0;if(hz>0)withA(ctx,hz,()=>{const[ex,ey]=d6_pr([139.4,37.3]),[wx,wy]=d6_pr([136.3,36.05]);T(ctx,"50 Hz",ex,ey,{w:800,size:34,align:"center",color:rgba(mix(D6_E50,[255,255,255],0.3),1)});T(ctx,"60 Hz",wx,wy,{w:800,size:34,align:"center",color:rgba(mix(D6_W60,[255,255,255],0.3),1)});});
  const cv=o.conv||0;D6_CONV.forEach(([x,y],i)=>d6_conv(ctx,x,y,13,pulseAt((t+i*0.4)%2.4,0,1.2)*cv,clamp(cv*2-i*0.3,0,1)));
  D6_CONV2.forEach(([x,y])=>d6_conv(ctx,x,y,13,0.8,o.more||0));
  // the turns of power cuts around Tokyo
  const rl=o.roll||0;if(rl>0)D6_ROLL.forEach(([x,y,grp])=>{const turn=Math.floor(t*0.9)%5,dk=grp===turn?1:0;withA(ctx,rl,()=>{ctx.fillStyle=dk?"rgba(20,22,30,0.95)":"rgba(255,232,170,0.85)";ctx.beginPath();ctx.arc(x,y,3.4,0,TAU);ctx.fill();if(!dk)glow(ctx,x,y,9,[255,226,160],0.35);});});
  // the cities
  [[D6_TOKYO,o.tokyo||0,D6_E50,"Tokyo",1],[D6_OSAKA,o.osaka||0,D6_W60,"Osaka",-1]].forEach(([[x,y],a,col,nm,sd])=>{if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,46,col,0.55);ctx.fillStyle="#fff6e8";ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.stroke();
    withA(ctx,o.lab==null?1:o.lab,()=>T(ctx,nm,x+sd*18,y+(sd>0?40:46),{w:800,size:o.labSize||34,align:sd>0?"left":"right",color:rgba(mix(col,[255,255,255],0.5),1)}));});});
  ctx.restore();}
// a wave: cyc cycles across w, moving with time; o.col, o.amp, o.lw
function d6_wave(ctx,x,y,w,cyc,t,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(o.col||D6_E50,1);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.shadowColor=rgba(o.col||D6_E50,0.7);ctx.shadowBlur=10;ctx.beginPath();
  for(let i=0;i<=160*p;i++){const u=i/160,xx=x+u*w,yy=y-Math.sin(u*TAU*cyc-t*(o.speed||5))*(o.amp||34);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();ctx.restore();}
// an early generator, as the 1890s built them: a heavy base, field magnets, an armature turning, a belt wheel (drawn with weight)
function d6_gen(ctx,x,y,s,t,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(0,64,120,12,0,0,TAU);ctx.fill();
  const iron=(x0,y0,w,h,r)=>{const g=ctx.createLinearGradient(x0,y0,x0,y0+h);g.addColorStop(0,"#5d6168");g.addColorStop(0.5,"#3a3d43");g.addColorStop(1,"#24262b");ctx.fillStyle=g;rr(ctx,x0,y0,w,h,r);ctx.fill();ctx.strokeStyle="rgba(200,200,210,0.35)";ctx.lineWidth=1.5;rr(ctx,x0,y0,w,h,r);ctx.stroke();};
  iron(-110,40,220,24,4);
  // the field magnets, wound in copper
  [-1,1].forEach(sd=>{iron(sd*58-18,-58,36,100,8);const cg=ctx.createLinearGradient(sd*58-24,0,sd*58+24,0);cg.addColorStop(0,"#7a4a26");cg.addColorStop(0.5,"#c98a52");cg.addColorStop(1,"#6a3e20");ctx.fillStyle=cg;rr(ctx,sd*58-24,-40,48,62,8);ctx.fill();
    ctx.strokeStyle="rgba(60,30,12,0.55)";ctx.lineWidth=1.2;for(let k=0;k<8;k++){ctx.beginPath();ctx.moveTo(sd*58-24,-36+k*7.5);ctx.lineTo(sd*58+24,-34+k*7.5);ctx.stroke();}});
  // the armature, turning
  const ag=ctx.createRadialGradient(-8,-14,4,0,-8,34);ag.addColorStop(0,"#9aa0a8");ag.addColorStop(1,"#3a3e46");ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,-8,32,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(30,30,36,0.8)";ctx.lineWidth=2;for(let k=0;k<8;k++){const an=k/8*TAU+t*6;ctx.beginPath();ctx.moveTo(Math.cos(an)*10,-8+Math.sin(an)*10);ctx.lineTo(Math.cos(an)*30,-8+Math.sin(an)*30);ctx.stroke();}
  // the belt wheel, and its spokes
  ctx.strokeStyle="#5b5f66";ctx.lineWidth=7;ctx.beginPath();ctx.arc(150,-8,36,0,TAU);ctx.stroke();ctx.lineWidth=3;for(let k=0;k<5;k++){const an=k/5*TAU+t*3;ctx.beginPath();ctx.moveTo(150,-8);ctx.lineTo(150+Math.cos(an)*33,-8+Math.sin(an)*33);ctx.stroke();}
  ctx.strokeStyle="#2c2e33";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(30,-8);ctx.lineTo(150,-8);ctx.stroke();ctx.strokeStyle="rgba(150,110,70,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(150,-44);ctx.lineTo(150+80,-30);ctx.moveTo(150,28);ctx.lineTo(150+80,14);ctx.stroke();
  glow(ctx,0,-8,60,col,0.18+0.1*Math.sin(t*4));ctx.restore();});}
// a panel for each early generator: where it came from, the machine, and its wave, with how fast it cycles
function d6_genPanel(ctx,x,y,col,title,cyc,lab,t,pw,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,600,360,22,col,{glow:14,ea:0.7,fill:"rgba(8,12,24,0.94)"});T(ctx,title,x+300,y+54,{w:800,size:34,align:"center",color:rgba(col,1)});
  d6_gen(ctx,x+210,y+170,1.05,t,col,1);d6_wave(ctx,x+40,y+282,520,cyc,t,{col,amp:20,p:pw,lw:3.5});withA(ctx,clamp(pw*2,0,1),()=>T(ctx,lab,x+300,y+340,{w:800,size:30,align:"center",color:rgba(col,0.95)}));});}
// a converter, close up: sixty cycles in from the west, fifty out to the east
function d6_convPanel(ctx,x,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,760,250,22,[220,230,255],{glow:14,ea:0.7,fill:"rgba(8,12,24,0.94)"});
  T(ctx,"west · 60 Hz",x+150,y+52,{w:800,size:30,align:"center",color:rgba(D6_W60,1)});T(ctx,"east · 50 Hz",x+610,y+52,{w:800,size:30,align:"center",color:rgba(D6_E50,1)});
  d6_wave(ctx,x+40,y+130,230,3.6,t,{col:D6_W60,amp:26,lw:3.5});d6_wave(ctx,x+490,y+130,230,3.0,t,{col:D6_E50,amp:26,lw:3.5});d6_conv(ctx,x+380,y+130,44,0.5+0.5*Math.sin(t*3),1);
  T(ctx,"a converter station: one translated into the other",x+380,y+222,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});}

/* ---------- the wall: steps, roles and actors ---------- */
// a process step on paper (a yellow note with ArchiMate's process glyph), as in How value reaches people
function d6_step(ctx,cx,cy,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||28;withA(ctx,a,()=>{
  sticky(ctx,cx,cy,w,h,"",{col:NOTEC[0],rot:o.rot||0});archGlyph(ctx,"process",cx-w/2+24,cy-h/2+22,12,[120,96,20]);
  const ls=wrapT(ctx,label,0,0,w-28,{size:sz,w:800,measure:true}),lh=sz*1.12;ls.forEach((l,i)=>T(ctx,l,cx,cy+8-((ls.length-1)*lh)/2+sz*0.36+i*lh,{w:800,size:sz,align:"center",color:rgba(INKD,0.95)}));});}
// a name, pencilled on a slip of paper under a step; st (0..1) strikes it through in red pencil
function d6_slip(ctx,cx,cy,name,p,st,o){o=o||{};if(p<=0)return;const w=tw(ctx,name,30,700)+40;withA(ctx,clamp(p*3,0,1)*(o.a==null?1:o.a),()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot||0.02);
  ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle="#f1ead8";ctx.fillRect(-w/2,-26,w,52);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  T(ctx,typeOn(name,p),0,11,{w:700,size:30,align:"center",color:"rgba(52,48,46,0.92)"});
  if(st>0){ctx.strokeStyle="rgba(214,64,52,0.92)";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-w/2+8,4);ctx.lineTo(-w/2+8+(w-16)*ease(st),-2);ctx.stroke();}ctx.restore();});}
// ArchiMate's assignment: a line with a dot where it starts (the actor) and an arrowhead where it ends (the role), drawn up to p
function d6_assign(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const x=lerp(x0,x1,p),y=lerp(y0,y1,p);ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.fillStyle=rgba(col,1);ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(x0,y0,6,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();
  if(p>0.95){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-14*Math.cos(an-0.4),y1-14*Math.sin(an-0.4));ctx.lineTo(x1-14*Math.cos(an+0.4),y1-14*Math.sin(an+0.4));ctx.closePath();ctx.fill();}ctx.restore();});}
// a dashed grouping, as ArchiMate draws one: a frame with a tab carrying its name (a domain, or the utility itself)
function d6_group(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const tw_=tw(ctx,name,o.size||30,800)+44,th=50,hi=o.hi||0;ctx.save();
  ctx.fillStyle=rgba(col,0.05+0.05*hi);rr(ctx,x,y,w,h,14);ctx.fill();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col,0.6+0.35*hi);ctx.lineWidth=2.5+1.5*hi;if(hi>0){ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=16*hi;}rr(ctx,x,y,w,h,14);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
  ctx.fillStyle="rgba(8,12,24,0.95)";rr(ctx,x+18,y-th/2,tw_,th,10);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,x+18,y-th/2,tw_,th,10);ctx.stroke();
  T(ctx,name,x+40,y+(o.size||30)*0.36,{w:800,size:o.size||30,color:rgba(col,1)});ctx.restore();});}
// a contract on paper: a title, its terms, and a signature
function d6_contract(ctx,x,y,w,h,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.012:o.rot,plain:true});
  if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=16;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
  archGlyph(ctx,"contract",x+w-34,y+34,13,[120,96,20]);T(ctx,"contract",x+28,y+50,{w:800,size:32,color:"rgba(52,48,46,0.95)"});
  lines.forEach((l,i)=>{const q=o.p?clamp(o.p*lines.length-i,0,1):1;withA(ctx,q,()=>wrapT(ctx,l,x+28,y+104+i*76,w-56,{size:28,w:700,color:"rgba(52,48,46,0.92)",lh:32}));});
  ctx.save();ctx.strokeStyle="rgba(40,60,140,0.8)";ctx.lineWidth=2.5;ctx.beginPath();const sx=x+w-200,sy=y+h-34;ctx.moveTo(sx,sy);for(let i=1;i<=20;i++)ctx.lineTo(sx+i*8,sy-Math.sin(i*1.3)*9-(i%5)*1.2);ctx.stroke();ctx.restore();});}

/* ---------- the agent ---------- */
// an outage report as it arrives: a call, a text or a meter's alarm, with its street
function d6_report(ctx,x,y,kind,street,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[200,214,240];withA(ctx,a,()=>{const w=tw(ctx,street,28,700)+92;glass(ctx,x-w/2,y-28,w,56,28,col,{glow:8,ea:0.7,fill:"rgba(8,12,24,0.94)"});
  ctx.save();ctx.translate(x-w/2+34,y);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineJoin="round";
  if(kind==="call"){rr(ctx,-8,-14,16,28,4);ctx.stroke();ctx.fillRect(-3,9,6,2);}else if(kind==="text"){rr(ctx,-13,-11,26,18,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-6,7);ctx.lineTo(-10,14);ctx.lineTo(0,7);ctx.stroke();}
  else{rr(ctx,-12,-13,24,26,4);ctx.stroke();ctx.beginPath();ctx.arc(0,-1,6,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(4,-6);ctx.stroke();}ctx.restore();
  T(ctx,street,x-w/2+62,y+10,{w:700,size:28,color:rgba(INK,0.95)});});}
// the agent's rights, written down like anyone's: what it may do, what it may not, and what it hands to a person
function d6_rights(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const R=[["may","group reports, propose",[120,210,130]],["may not","send a crew",D6_RED],["escalates","wire down, life support",TRUST]],h=96+R.length*70;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,KT_AI,{glow:14+10*(o.hi||0),ea:0.85,fill:"rgba(6,12,20,0.95)"});T(ctx,o.kicker||"the agent's rights",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    R.forEach(([k,v,col],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0)return;withA(ctx,clamp(q*2,0,1),()=>{const yy=y+104+i*70;if(i===0)tick_(ctx,x+42,yy-10,30,col,1);else if(i===1)cross_(ctx,x+42,yy-10,28,col,1);else{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+42,yy+2);ctx.lineTo(x+42,yy-22);ctx.moveTo(x+32,yy-12);ctx.lineTo(x+42,yy-22);ctx.lineTo(x+52,yy-12);ctx.stroke();ctx.restore();}
      T(ctx,k,x+76,yy,{w:800,size:30,color:rgba(col,1)});T(ctx,v,x+76+tw(ctx,k,30,800)+18,yy,{w:700,size:30,color:rgba(INK,0.95)});});});});return h;}

/* ---------- Hill Street, and the people who move ---------- */
// number fourteen, drawn in marker on paper: a house, its meter on the wall (the connection point), and what's in its window
function d6_house(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,cx-210,cy-170,420,330,{rot:-0.008,plain:true});
  marker(ctx,[[cx-100,cy-20],[cx-100,cy+100],[cx+100,cy+100],[cx+100,cy-20]],1,{lw:3.4,seed:3});marker(ctx,[[cx-126,cy-14],[cx,cy-110],[cx+126,cy-14]],1,{lw:3.4,seed:4});
  ctx.fillStyle="rgba(40,40,48,0.85)";ctx.fillRect(cx-70,cy+6,44,36);ctx.fillRect(cx+26,cy+6,44,36);ctx.fillRect(cx-16,cy+52,32,48);
  // the meter on the outside wall: where power is delivered
  const m=o.meter||0;ctx.save();ctx.translate(cx+82,cy+60);if(m>0)glow(ctx,0,0,44,D6_NET,0.6*m);ctx.fillStyle=rgba(mix([210,214,220],D6_NET,m*0.6),1);rr(ctx,-11,-15,22,30,4);ctx.fill();ctx.strokeStyle="rgba(40,40,48,0.9)";ctx.lineWidth=2;rr(ctx,-11,-15,22,30,4);ctx.stroke();ctx.restore();
  if(o.life>0)withA(ctx,o.life,()=>{glow(ctx,cx+48,cy+24,40,[255,130,170],0.5);ctx.strokeStyle="rgba(255,140,176,1)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx+28,cy+26);ctx.lineTo(cx+38,cy+26);ctx.lineTo(cx+43,cy+14);ctx.lineTo(cx+50,cy+36);ctx.lineTo(cx+55,cy+24);ctx.lineTo(cx+68,cy+24);ctx.stroke();});
  T(ctx,o.name||"14 Hill Street",cx,cy+142,{w:800,size:30,align:"center",color:rgba(INKD,0.92)});});}
// a removal van, with boxes in its open back
function d6_movevan(ctx,x,y,s,dir,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);ctx.fillStyle="#e6e0d2";rr(ctx,-90,-80,130,74,8);ctx.fill();ctx.fillStyle="#cfc7b6";rr(ctx,40,-56,48,50,8);ctx.fill();
  ctx.fillStyle="#2a3038";ctx.fillRect(56,-50,26,18);ctx.fillStyle="#b88a58";ctx.fillRect(-82,-58,30,26);ctx.fillRect(-48,-62,26,30);ctx.fillStyle="#9a7046";ctx.fillRect(-82,-46,30,2);
  [[-60,-4],[62,-4]].forEach(([wx,wy])=>{ctx.fillStyle="#141418";ctx.beginPath();ctx.arc(wx,wy,13,0,TAU);ctx.fill();ctx.fillStyle="#6a6e76";ctx.beginPath();ctx.arc(wx,wy,5,0,TAU);ctx.fill();});ctx.restore();});}
// a big number, with what it counts
function d6_count(ctx,cx,cy,who,num,what,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,cx-330,cy-130,660,260,22,col,{glow:14+12*(o.hi||0),ea:0.8,fill:"rgba(8,12,24,0.95)"});
  T(ctx,who,cx,cy-74,{f:"mono",w:600,size:30,align:"center",color:rgba(col,1)});T(ctx,num,cx,cy+18,{w:800,size:84,align:"center",color:rgba(INK,0.97)});wrapT(ctx,what,cx,cy+78,600,{size:28,w:700,align:"center",color:rgba(mix(col,INK,0.4),1),lh:32});});}

/* ---------- the two domains, and the wall between them ---------- */
// the stage for the edge: the network's side tinted blue, retail's rose, and the wall down the middle; o.gate opens a gate in it,
// o.red flashes it, o.hi lights it
function d6_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D6_NET,0.0));lg.addColorStop(1,rgba(D6_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D6_RET,0.08));rg.addColorStop(1,rgba(D6_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,120,{w:800,size:40,align:"center",color:rgba(D6_NET,1)});T(ctx,"retail",1440,120,{w:800,size:40,align:"center",color:rgba(D6_RET,1)});});});}
function d6_wall(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,y0=170,y1=y0+(900-y0)*ease(p),red=o.red||0,gate=o.gate||0,gy=o.gy||560;withA(ctx,a,()=>{
  const col=mix([226,232,246],D6_RED,red);ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*(red+(o.hi||0));ctx.fillStyle=rgba(col,0.12+0.1*red);
  const gh=gate*150;ctx.fillRect(948,y0,24,Math.max(0,Math.min(y1,gy-gh/2)-y0));if(y1>gy+gh/2)ctx.fillRect(948,gy+gh/2,24,y1-gy-gh/2);ctx.shadowBlur=0;
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,Math.min(y1,gy-gh/2));if(y1>gy+gh/2){ctx.moveTo(x,gy+gh/2);ctx.lineTo(x,y1);}});ctx.stroke();ctx.restore();
  if(gate>0.05)withA(ctx,gate,()=>d6_conv(ctx,960,gy,34,0.5+0.5*Math.sin(t*3),1));});}
// a list on paper, with a title and its rows (p writes them in)
function d6_list(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=92+rows.length*52;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot,plain:true});
  T(ctx,title,x+28,y+52,{w:800,size:30,color:"rgba(52,48,46,0.95)"});rows.forEach((r,i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1),miss=o.miss&&o.miss[i];if(q<=0)return;
    withA(ctx,q,()=>{T(ctx,r,x+52,y+104+i*52,{w:700,size:28,color:miss?"rgba(200,64,52,0.95)":"rgba(52,48,46,0.9)"});ctx.fillStyle=miss?"rgba(200,64,52,0.9)":"rgba(52,48,46,0.7)";ctx.beginPath();ctx.arc(x+34,y+94+i*52,4,0,TAU);ctx.fill();});});});return h;}
// a battery, for what a retailer might sell
function d6_battery(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;rr(ctx,-34,-20,62,40,6);ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.fillRect(30,-8,8,16);
  for(let i=0;i<3;i++)ctx.fillRect(-26+i*18,-12,12,24);ctx.restore();});}
// an envelope: a message crossing the edge
function d6_msg(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,40*s,col,0.5);ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#f1ead8";rr(ctx,-28,-19,56,38,4);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;rr(ctx,-28,-19,56,38,4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-28,-19);ctx.lineTo(0,4);ctx.lineTo(28,-19);ctx.stroke();ctx.restore();});}
// a storm cloud, with rain and, at flash, lightning
function d6_cloud(ctx,x,y,s,t,flash,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(150,180,220,0.5)";ctx.lineWidth=2;for(let i=0;i<9;i++){const xx=-70+i*18,ph=(t*1.6+i*0.37)%1;ctx.beginPath();ctx.moveTo(xx-ph*8,20+ph*60);ctx.lineTo(xx-ph*8-6,36+ph*60);ctx.stroke();}
  ctx.fillStyle="#4a5262";[[-50,0,40],[-10,-20,50],[40,-4,42],[10,10,44]].forEach(([cx,cy,r])=>{ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();});ctx.fillStyle="rgba(255,255,255,0.08)";ctx.beginPath();ctx.arc(-14,-30,40,0,TAU);ctx.fill();
  if(flash>0){glow(ctx,0,40,120,[220,230,255],0.6*flash);ctx.strokeStyle=rgba([240,244,255],flash);ctx.lineWidth=5;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(4,30);ctx.lineTo(-14,72);ctx.lineTo(6,72);ctx.lineTo(-10,118);ctx.stroke();}ctx.restore();});}
