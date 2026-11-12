/* ===== Business architecture for data: the series' components =====
   The second series on enterprise architecture, after The map before the data, in its look (films/enterprise-architecture/shared/src/ea.js:
   paper drafts on a wall, the confirmed model in glass, the six layers in their colours) and its world: the publicly owned energy
   utility, Tomás and the owners. Each film opens on its part of one true story, the qanats of Iran, drawn here in the series' own style,
   never in the style of Persian art: the desert from above, with its chain of shafts; the qanat cut away, with its tunnel, shafts and
   water; the village's fields; and the people of the story as plain silhouettes with no faces, lit at the edge (the shareholders, the
   water master and the diggers). Then the data practice on the map, the piece that closes every film: the data team's part of the
   business layer, drawn element by element as ArchiMate draws them, building up film by film, to the series' last.
   Everything here is shared by the series' films (each bundles it, from film.json's src); a film keeps its own pictures in its own
   source. Names start with ba (BA for constants). */

/* ---------- colours ---------- */
// the series' colour (water), the layers it works in, the two sides of the utility's wall (the network in blue, retail in rose),
// red for what fails, green for a check that passes; the desert's sand, earth and the water underground
const BAC=[120,206,226];
const BA_STR=LAY6[1][1],BA_BUS=LAY6[2][1],BA_INF=LAY6[3][1],BA_APP=LAY6[4][1];
const BA_NET=[132,176,255],BA_RET=[255,150,186],BA_RED=[232,96,84],BA_OK=[132,226,160];
const BA_SAND=[222,178,120],BA_EARTH=[120,82,56],BA_WATER=[110,196,240],BA_GREEN=[120,176,92],BA_DRY=[176,132,84];
// the series' five films, in order
const BA_FILMS=["What the business owns","What the business needs to know","Who creates it, who owns it","Processes, as deep as data needs","Rules and expectations the business owns"];
// no-break spaces: words a label should keep on one line
const ba_nb=s=>s.replace(/ /g," ");
// someone standing at the right of the frame, drawn facing the other way
function baPersonR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// a tag on something in a scene the camera moves through: placed where (wx, wy) is now on screen, and drawn at the screen's own
// size, so it reads the same however far the camera has zoomed (o.dy moves it up or down on screen)
function baTagAt(ctx,S,wx,wy,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=ctx.getTransform().transformPoint(new DOMPoint(wx,wy));
  ctx.save();ctx.setTransform(S,0,0,S,0,0);withA(ctx,a,()=>tag(ctx,p.x/S,p.y/S+(o.dy||0),s,col,{align:o.align||"center",size:o.size||30}));ctx.restore();}

/* ---------- titles ---------- */
// the series' mark: three layers of the map, seen from above, the business layer between the other two lit and filled
function baMark(ctx,x,y,s,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{[[1,0.35],[2,1],[3,0.35]].forEach(([li,lit],i)=>{const q=clamp(p*3-i,0,1);if(q<=0)return;const col=LAY6[li][1],cy=y-s*1.1+i*s*0.62+(1-spring(q*1.4))*-s*0.5;
  withA(ctx,clamp(q*2,0,1),()=>{ctx.save();ctx.shadowColor=rgba(col,0.6*lit);ctx.shadowBlur=14*lit;rhomb(ctx,x,cy,s*2.6,s*0.95);ctx.fillStyle=rgba(col,0.06+0.26*lit);ctx.fill();ctx.strokeStyle=rgba(col,0.45+0.55*lit);ctx.lineWidth=s*0.09;ctx.stroke();ctx.restore();});});});}
// the title card, over whatever the chapter is drawing: the series, the film's title, and where it sits in the series. Its words come
// in once the picture under them has gone dark, so no words show through each other (the same for the end card)
function baTitle(ctx,S,t,t0,title,sub,n){const col=BAC,oA=fin(t,t0,0.8),tA=fin(t,t0+0.8,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);baMark(ctx,960,392,30,1,(t-t0-0.5)/1.4);T(ctx,"BUSINESS ARCHITECTURE FOR DATA",960,458,{w:800,size:30,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,560,{w:800,size:88,align:"center"});if(sub)T(ctx,sub,960,632,{w:600,size:36,align:"center",color:rgba(SOFT,0.95)});
    withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,712,n||"enterprise architecture, for data",col,{align:"center",size:28}));});}
function baEnd(ctx,S,t,t0,title,line,n){const col=BAC,oA=fin(t,t0,1.0),tA=fin(t,t0+1.0,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wrapT(ctx,line,960,388,1300,{w:700,size:44,align:"center",lh:58});baMark(ctx,960,540,20,0.95,1);T(ctx,title,960,622,{w:800,size:44,align:"center",color:rgba(col,1)});
    T(ctx,"Business architecture for data"+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- the desert, from above ---------- */
// The desert seen from high above, in the camera's world (wider than the frame): sand with long ripples, the mountains at the top left,
// the qanat's chain of shafts running down from their foot to the village, each shaft ringed by the earth dug out of it, and at its end
// the water coming to light, an open channel, the village's flat roofs and domes, its trees, and its fields in a grid, each green
// when watered and dry when not. o.flow (0..1) carries the water along the channel; o.wet[i] (0..1) waters field i; o.lit (0..1)
// lights the chain of shafts; o.warm (0..1) is the low sun of morning or evening.
const BA_CHAIN=(()=>{const P=[];for(let i=0;i<=19;i++){const u=i/19;P.push([lerp(430,1236,u)+Math.sin(u*Math.PI)*-38,lerp(318,640,u)+Math.sin(u*Math.PI*1.2)*22]);}return P;})();
const BA_OUT=[1262,652];
// the fields: a grid of plots beside the village, each [x, y, w, h]; the channel runs along the top and down between them
const BA_FIELDS=(()=>{const F=[];for(let r=0;r<3;r++)for(let c=0;c<4;c++)F.push([1330+c*124,700+r*92,112,80]);return F;})();
const BA_HOUSES=[[1386,520,62,46],[1458,508,54,52],[1528,530,70,40],[1610,512,58,48],[1676,536,64,42],[1420,584,58,40],[1500,592,66,38],[1580,586,52,44],[1650,598,60,36],[1736,560,52,46]];
const BA_DOMES=[[1478,560,20],[1630,566,18],[1712,500,16]];
function ba_aerial(ctx,t,o){o=o||{};const X0=-1400,X1=3300,Y0=-900,Y1=2000,wm=o.warm||0;
  // sand: warm, with long low ripples and a few darker patches of gravel
  const g=ctx.createLinearGradient(0,-200,0,1300);g.addColorStop(0,rgba(mix([168,124,82],[196,140,92],wm),1));g.addColorStop(0.5,rgba(mix([196,152,102],[214,156,104],wm),1));g.addColorStop(1,rgba(mix([150,110,74],[170,112,76],wm),1));
  ctx.fillStyle=g;ctx.fillRect(X0,Y0,X1-X0,Y1-Y0);
  ctx.save();ctx.strokeStyle="rgba(255,236,200,0.05)";ctx.lineWidth=10;for(let i=0;i<34;i++){const y=-260+i*52;ctx.beginPath();for(let x=-400;x<=2400;x+=80){const yy=y+Math.sin(x*0.004+i*0.7)*18+x*0.08;x===-400?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}ctx.restore();
  for(let i=0;i<22;i++){const x=hash(i,601)*2200-140,y=hash(i,602)*1200-60,r=60+hash(i,603)*160,gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,"rgba(70,46,30,"+(0.06+0.06*hash(i,604))+")");gg.addColorStop(1,"rgba(70,46,30,0)");ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  // the mountains, top left, seen from high above: a dark mass, its ridges lit on the side towards the sun and in shadow on the
  // other, each spine with spurs running down to the plain
  const mg=ctx.createRadialGradient(-260,-280,80,-260,-280,1000);mg.addColorStop(0,rgba(mix([92,64,52],[116,76,58],wm),0.95));mg.addColorStop(0.55,rgba(mix([128,92,68],[148,98,70],wm),0.62));mg.addColorStop(1,"rgba(150,110,76,0)");
  ctx.fillStyle=mg;ctx.fillRect(-1400,-900,2400,2000);
  const ridge=(P,w0)=>{for(let i=1;i<P.length;i++){const[x0,y0]=P[i-1],[x1,y1]=P[i],w=w0*(1-0.55*i/P.length);
      ctx.strokeStyle="rgba(52,34,28,0.42)";ctx.lineWidth=w*1.7;ctx.beginPath();ctx.moveTo(x0+w*0.55,y0+w*0.65);ctx.lineTo(x1+w*0.55,y1+w*0.65);ctx.stroke();
      ctx.strokeStyle=rgba(mix([218,174,128],[238,184,130],wm),0.5);ctx.lineWidth=w*0.6;ctx.beginPath();ctx.moveTo(x0-w*0.3,y0-w*0.3);ctx.lineTo(x1-w*0.3,y1-w*0.3);ctx.stroke();}};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  [[[-760,-520],[-520,-360],[-300,-220],[-80,-90],[140,10],[300,96]],[[-300,-660],[-120,-430],[40,-270],[200,-150],[380,-60]],[[-940,-120],[-660,-40],[-430,46],[-220,156]]].forEach((sp,j)=>{
    for(let i=1;i<sp.length;i++){const[x0,y0]=sp[i-1],[x1,y1]=sp[i],dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,nx=-uy,ny=ux;
      for(let k=0;k<3;k++){const u=(k+0.5)/3,bx=lerp(x0,x1,u),by=lerp(y0,y1,u);[-1,1].forEach(sd=>{const L=(80+80*hash(i*7+k+j*31,sd+5))*(1-0.1*i);
        ridge([[bx,by],[bx+nx*sd*L*0.55+ux*L*0.3,by+ny*sd*L*0.55+uy*L*0.3],[bx+nx*sd*L+ux*L*0.55,by+ny*sd*L+uy*L*0.55]],11);});}}
    ridge(sp,24);});
  ctx.restore();
  // the chain of shafts: each one a ring of dug earth with a dark mouth, its shadow to the lower right; lit as the narration names it
  const lit=o.lit||0;BA_CHAIN.forEach(([x,y],i)=>{const r=i===0?17:13-4*i/19;ctx.fillStyle="rgba(60,40,26,0.28)";ctx.beginPath();ctx.ellipse(x+4,y+5,r*1.15,r,0,0,TAU);ctx.fill();
    const rg=ctx.createRadialGradient(x-r*0.3,y-r*0.3,1,x,y,r*1.1);rg.addColorStop(0,"rgba(236,204,160,1)");rg.addColorStop(1,"rgba(184,140,98,1)");ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(34,22,16,0.92)";ctx.beginPath();ctx.arc(x,y,r*0.34,0,TAU);ctx.fill();
    if(lit>0.01){const v=lit*clamp(((o.litP==null?1:o.litP)*20-i),0,1);if(v>0.01)glow(ctx,x,y,r*2.6,BAC,0.34*v);}});
  // the water comes to light, and runs in an open channel past the village to the fields
  const fl=o.flow==null?1:o.flow,CH=[BA_OUT,[1300,676],[1330,690],[1820,690]];
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(96,64,40,0.6)";ctx.lineWidth=14;ctx.beginPath();CH.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
  if(fl>0.01){const L=[0];for(let i=1;i<CH.length;i++)L.push(L[i-1]+Math.hypot(CH[i][0]-CH[i-1][0],CH[i][1]-CH[i-1][1]));let left=L[L.length-1]*fl;
    ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=8;ctx.shadowColor=rgba(BA_WATER,0.6);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(CH[0][0],CH[0][1]);
    for(let i=1;i<CH.length&&left>0;i++){const d=L[i]-L[i-1],f=Math.min(1,left/d);ctx.lineTo(lerp(CH[i-1][0],CH[i][0],f),lerp(CH[i-1][1],CH[i][1],f));left-=d;}ctx.stroke();ctx.shadowBlur=0;
    // light on the water, moving along it
    for(let k=0;k<10;k++){const u=((t*0.06+k/10)%1)*fl,x=lerp(1330,1820,u),y=690;ctx.fillStyle="rgba(230,248,255,0.5)";ctx.beginPath();ctx.ellipse(x,y,7,2,0,0,TAU);ctx.fill();}}
  ctx.restore();
  // the fields, each fed by a small gate from the channel above it, or from the field before it in its column
  BA_FIELDS.forEach(([x,y,w,h],i)=>{const wt=clamp(o.wet?o.wet[i]||0:(o.green==null?0.7:o.green),0,1),c=mix(BA_DRY,BA_GREEN,wt);
    ctx.fillStyle="rgba(60,40,26,0.3)";ctx.fillRect(x+4,y+5,w,h);ctx.fillStyle=rgba(c,1);ctx.fillRect(x,y,w,h);
    ctx.strokeStyle=rgba(mix(c,[40,30,20],0.4),0.7);ctx.lineWidth=2;for(let k=1;k<5;k++){ctx.beginPath();ctx.moveTo(x+6,y+k*h/5);ctx.lineTo(x+w-6,y+k*h/5);ctx.stroke();}
    const fw=o.fill?o.fill[i]||0:0;if(fw>0.01){ctx.fillStyle=rgba(BA_WATER,0.5*fw);ctx.fillRect(x,y,w,h*clamp(fw*1.4,0,1));glow(ctx,x+w/2,y+h/2,70,BA_WATER,0.25*fw);}
    ctx.strokeStyle="rgba(70,48,30,0.6)";ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);});
  // trees along the channel and the village's edge: round canopies, dark at the bottom, lit at the top, with their shadows
  [[1296,640,26],[1340,628,22],[1372,650,20],[1800,650,24],[1840,610,20],[1360,470,24],[1760,470,22],[1300,560,22],[1822,540,20],[1700,640,18]].forEach(([x,y,r],i)=>{ctx.fillStyle="rgba(40,30,20,0.32)";ctx.beginPath();ctx.ellipse(x+r*0.4,y+r*0.5,r,r*0.86,0,0,TAU);ctx.fill();
    const tg=ctx.createRadialGradient(x-r*0.35,y-r*0.4,2,x,y,r);tg.addColorStop(0,"rgba(150,190,104,1)");tg.addColorStop(1,"rgba(56,96,52,1)");ctx.fillStyle=tg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();});
  // the village: flat roofs of earth brick, each with its shadow; a few domes
  BA_HOUSES.forEach(([x,y,w,h],i)=>{ctx.fillStyle="rgba(50,34,22,0.34)";ctx.fillRect(x+6,y+7,w,h);const hg=ctx.createLinearGradient(x,y,x+w,y+h);hg.addColorStop(0,"rgba(232,196,150,1)");hg.addColorStop(1,"rgba(196,154,110,1)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,h);
    ctx.strokeStyle="rgba(120,86,58,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+3,y+3,w-6,h-6);});
  BA_DOMES.forEach(([x,y,r])=>{ctx.fillStyle="rgba(50,34,22,0.34)";ctx.beginPath();ctx.arc(x+5,y+6,r,0,TAU);ctx.fill();const dg=ctx.createRadialGradient(x-r*0.4,y-r*0.4,1,x,y,r);dg.addColorStop(0,"rgba(246,220,180,1)");dg.addColorStop(1,"rgba(186,144,104,1)");ctx.fillStyle=dg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();});}

/* ---------- the qanat, cut away ---------- */
// The ground cut open from the mountain's foot to the village: the surface falls faster than the tunnel does, so the tunnel, sloping
// gently, meets the surface at the outlet. Under the mountain, the groundwater; the tunnel's upper reach runs through it, and water
// seeps in. A shaft rises from the tunnel to the surface every so often, each with its ring of dug earth; the deepest, the first, is the
// mother well. ba_ys(x) is the surface, ba_yt(x) the tunnel's floor, ba_yw(x) the top of the groundwater; BA_SH the shafts.
const BA_SURF=[[-900,-260],[-500,-60],[-250,110],[0,290],[150,404],[260,452],[600,560],[1000,680],[1300,768],[1440,800],[1700,814],[2600,834]];
function ba_lin(P,x){if(x<=P[0][0])return P[0][1];for(let i=1;i<P.length;i++)if(x<=P[i][0]){const u=(x-P[i-1][0])/(P[i][0]-P[i-1][0]);return lerp(P[i-1][1],P[i][1],u);}return P[P.length-1][1];}
const ba_ys=x=>ba_lin(BA_SURF,x),ba_yt=x=>770+(x-250)*0.0255,ba_yw=x=>x<250?640-(250-x)*0.25:640+(x-250)*0.35;
const BA_TH=34,BA_XM=250,BA_XO=1440,BA_SH=(()=>{const S=[];for(let x=BA_XM;x<BA_XO-60;x+=100)S.push(x);return S;})();
// the sky and the far ridges over the section; o.warm (0..1) warms it, o.dusk (0..1) darkens it towards evening
function ba_secSky(ctx,o){o=o||{};const wm=o.warm||0,dk=o.dusk||0,X0=-1400,X1=3300,g=ctx.createLinearGradient(0,-600,0,840);
  g.addColorStop(0,rgba(mix([48,80,136],[26,32,70],dk),1));g.addColorStop(0.45,rgba(mix(mix([120,150,192],[92,80,118],dk),[150,148,186],wm*0.3),1));
  g.addColorStop(0.8,rgba(mix(mix([226,214,200],[200,132,108],dk),[250,206,162],wm),1));g.addColorStop(1,rgba(mix(mix([246,228,200],[216,150,110],dk),[255,216,170],wm),1));
  ctx.fillStyle=g;ctx.fillRect(X0,-900,X1-X0,1900);
  // the low sun's light over the plain, to the right
  glow(ctx,2400,620,760,mix([255,216,166],[255,160,110],dk),0.32);
  // two ranges far off, pale with distance; they reach down behind the ground, so no sky shows under them
  [[0.5,[190,172,172],-70,0],[0.72,[164,134,124],50,1]].forEach(([k,c,dy,i])=>{ctx.fillStyle=rgba(mix(mix(c,[226,170,140],wm*0.35),[90,70,90],dk*0.5),k);ctx.beginPath();ctx.moveTo(X0,1400);
    for(let x=X0;x<=X1;x+=40)ctx.lineTo(x,440+dy+Math.sin(x*0.0019+i*2.1)*44+Math.sin(x*0.0061+i*0.7)*15+Math.max(0,(300-x)*0.22));ctx.lineTo(X1,1400);ctx.closePath();ctx.fill();});}
// the cut-away ground, the groundwater, the tunnel and its shafts. o.flow (0..1): how far the water has run down the tunnel; or
// o.water, the stretches of tunnel that hold water, as [[x0, x1], ...] (a cave-in stops it, and what's below drains away);
// o.block: x of a cave-in (null for none), o.blockA (0..1) how far it has fallen; o.wet (0..1): the groundwater's light;
// o.hiSh (0..1): the shafts lit; o.hiT: the tunnel lit; t moves the water
function ba_section(ctx,t,o){o=o||{};const X0=-1400,X1=3300;
  // the ground in cut: a warm, dark earth, with strata
  ctx.save();ctx.beginPath();ctx.moveTo(X0,ba_ys(X0));for(let x=X0;x<=X1;x+=40)ctx.lineTo(x,ba_ys(x));ctx.lineTo(X1,1900);ctx.lineTo(X0,1900);ctx.closePath();
  const eg=ctx.createLinearGradient(0,300,0,1300);eg.addColorStop(0,"rgba(132,92,62,1)");eg.addColorStop(0.35,"rgba(96,64,44,1)");eg.addColorStop(1,"rgba(48,32,24,1)");ctx.fillStyle=eg;ctx.fill();ctx.clip();
  // a sandy band along the surface, then layers of earth and gravel that follow the ground's slope, with stones in them
  ctx.beginPath();ctx.moveTo(X0,ba_ys(X0)-4);for(let x=X0;x<=X1;x+=40)ctx.lineTo(x,ba_ys(x)-4);for(let x=X1;x>=X0;x-=40)ctx.lineTo(x,ba_ys(x)+30);ctx.closePath();ctx.fillStyle="rgba(196,150,100,0.42)";ctx.fill();
  for(let i=0;i<18;i++){const d=58+i*40+hash(i,716)*14,k=hash(i,717);ctx.strokeStyle="rgba(255,226,180,"+(0.025+0.04*k)+")";ctx.lineWidth=2+k*5;ctx.beginPath();
    for(let x=X0;x<=X1;x+=40){const y=lerp(ba_ys(x)+d,560+d*0.9,0.35)+Math.sin(x*0.004+i*1.7)*8;x===X0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  for(let i=0;i<170;i++){const x=hash(i,711)*3200-600,y=ba_ys(x)+26+hash(i,712)*760,r=2+hash(i,713)*6;ctx.fillStyle="rgba("+(hash(i,714)>0.5?"58,38,26,":"176,134,98,")+(0.22+0.3*hash(i,715))+")";ctx.beginPath();ctx.ellipse(x,y,r*1.4,r,hash(i,719)*3,0,TAU);ctx.fill();}
  // the groundwater: earth soaked with it, from the mountain down to where its top passes under the tunnel
  const wl=o.wet==null?1:o.wet;ctx.beginPath();ctx.moveTo(X0,ba_yw(X0));for(let x=X0;x<=1500;x+=30)ctx.lineTo(x,ba_yw(x));ctx.lineTo(1500,1900);ctx.lineTo(X0,1900);ctx.closePath();
  const wg=ctx.createLinearGradient(0,600,0,1100);wg.addColorStop(0,rgba(BA_WATER,0.30*wl+0.06));wg.addColorStop(1,rgba([40,90,140],0.45*wl+0.1));ctx.fillStyle=wg;ctx.fill();
  ctx.fillStyle=rgba([170,220,255],0.22*wl);for(let i=0;i<120;i++){const x=hash(i,721)*1900-400,y=ba_yw(x)+14+hash(i,722)*360;ctx.beginPath();ctx.arc(x,y,1.6+hash(i,723)*1.6,0,TAU);ctx.fill();}
  ctx.strokeStyle=rgba(BA_WATER,0.55*wl+0.15);ctx.lineWidth=2.5;ctx.setLineDash([12,10]);ctx.beginPath();for(let x=X0;x<=1500;x+=30)x===X0?ctx.moveTo(x,ba_yw(x)):ctx.lineTo(x,ba_yw(x));ctx.stroke();ctx.setLineDash([]);
  // the shafts: from the tunnel up to the surface; the mother well a little wider
  BA_SH.forEach((x,i)=>{const w=i===0?12:8,ys=ba_ys(x),yt=ba_yt(x);ctx.fillStyle="rgba(22,14,10,0.96)";ctx.fillRect(x-w/2,ys,w,yt-ys);
    if(o.hiSh>0.01){ctx.fillStyle=rgba(BAC,0.35*o.hiSh);ctx.fillRect(x-w/2-2,ys,w+4,yt-ys);}});
  // the tunnel: a dark channel, BA_TH high (a stooping digger's height at the village's scale), sloping gently to the outlet
  ctx.fillStyle="rgba(30,20,15,0.97)";ctx.beginPath();ctx.moveTo(BA_XM-8,ba_yt(BA_XM)-BA_TH);ctx.lineTo(BA_XO,ba_yt(BA_XO)-BA_TH);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+2);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+8);ctx.lineTo(BA_XO,ba_yt(BA_XO)+3);ctx.lineTo(BA_XM-8,ba_yt(BA_XM)+3);ctx.closePath();ctx.fill();
  if(o.hiT>0.01){ctx.strokeStyle=rgba(BAC,0.7*o.hiT);ctx.lineWidth=2.5;ctx.stroke();}
  // the water in it: seeping in along the wet reach, then running on its floor towards the outlet, in each stretch that holds it
  const fl=o.flow==null?1:o.flow,xb=o.block==null?BA_XO+40:o.block,WS=o.water||[[BA_XM,lerp(BA_XM,BA_XO+30,fl)]];
  WS.forEach(([x0,x1])=>{x0=Math.max(BA_XM,x0);x1=Math.min(BA_XO+30,x1);if(x1-x0<2)return;
    ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=5;ctx.shadowColor=rgba(BA_WATER,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x0,ba_yt(x0));ctx.lineTo(x1,ba_yt(x1));ctx.stroke();ctx.shadowBlur=0;
    for(let k=0;k<26;k++){const u=(t*0.05+k/26)%1,x=lerp(BA_XM,BA_XO,u);if(x<x0||x>x1)continue;ctx.fillStyle="rgba(230,248,255,0.65)";ctx.beginPath();ctx.ellipse(x,ba_yt(x)-1,6,1.6,0.03,0,TAU);ctx.fill();}});
  // drops seeping in from the groundwater, in the wet reach
  if(WS.length&&WS[0][1]>BA_XM+20)for(let k=0;k<8;k++){const x=BA_XM+20+k*42,ph=(t*0.7+hash(k,731))%1;if(ba_yw(x)>ba_yt(x)-BA_TH)continue;ctx.fillStyle=rgba([200,236,255],0.7*(1-ph));ctx.beginPath();ctx.arc(x,ba_yt(x)-BA_TH+ph*(BA_TH-2),1.8,0,TAU);ctx.fill();}
  // a cave-in: earth fallen into the tunnel, and the water pooled behind it
  if(o.block!=null&&(o.blockA||0)>0.01){const b=o.blockA,yt=ba_yt(xb);ctx.fillStyle=rgba([120,84,58],1);ctx.beginPath();ctx.moveTo(xb-34,yt+3);ctx.quadraticCurveTo(xb-10,yt-(BA_TH+6)*b,xb+4,yt-(BA_TH+2)*b);ctx.quadraticCurveTo(xb+20,yt-(BA_TH-6)*b,xb+36,yt+3);ctx.closePath();ctx.fill();
    for(let k=0;k<7;k++){const x=xb-26+k*9,y=yt-4-hash(k,741)*(BA_TH-6)*b;ctx.fillStyle="rgba(90,60,40,1)";ctx.beginPath();ctx.arc(x,y,3+hash(k,742)*3,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba(BA_WATER,0.5*b);ctx.fillRect(xb-150,yt-8*b,116,8*b+3);}
  ctx.restore();
  // the surface: a crisp line of light along the ground, and each shaft's ring of dug earth, seen side on as two low humps
  ctx.save();ctx.strokeStyle="rgba(255,226,180,0.55)";ctx.lineWidth=2.5;ctx.beginPath();for(let x=X0;x<=X1;x+=40)x===X0?ctx.moveTo(x,ba_ys(x)):ctx.lineTo(x,ba_ys(x));ctx.stroke();
  BA_SH.forEach((x,i)=>{const ys=ba_ys(x),r=i===0?34:26,h=i===0?16:12;[-1,1].forEach(sd=>{const cx=x+sd*(r*0.55+3);ctx.fillStyle="rgba(176,132,92,1)";ctx.beginPath();ctx.moveTo(cx-r*0.5,ys+1);ctx.quadraticCurveTo(cx,ys-h*2,cx+r*0.5,ys+1);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(255,226,180,0.4)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx-r*0.5,ys+1);ctx.quadraticCurveTo(cx,ys-h*2,cx+r*0.5,ys+1);ctx.stroke();});});
  ctx.restore();}
// the water at the outlet, out in the open: a channel along the surface from the outlet towards the village's fields, to x1, holding
// water from a to b (0..1 along it: from 0 to fl as it fills; from a to 1 as it drains)
function ba_channel(ctx,t,x1,fl,o){o=o||{};const x0=BA_XO+28,a=o.from||0,b=fl;
  ctx.save();ctx.strokeStyle="rgba(96,64,40,0.8)";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();for(let x=x0;x<=x1;x+=20)x===x0?ctx.moveTo(x,ba_ys(x)+4):ctx.lineTo(x,ba_ys(x)+4);ctx.stroke();
  if(b-a>0.005){const xa=lerp(x0,x1,clamp(a,0,1)),xe=lerp(x0,x1,clamp(b,0,1));ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=6;ctx.shadowColor=rgba(BA_WATER,0.7);ctx.shadowBlur=12;
    ctx.beginPath();for(let x=xa;x<=xe;x+=20)x===xa?ctx.moveTo(x,ba_ys(x)+3):ctx.lineTo(x,ba_ys(x)+3);ctx.lineTo(xe,ba_ys(xe)+3);ctx.stroke();ctx.shadowBlur=0;
    for(let k=0;k<12;k++){const u=(t*0.08+k/12)%1,x=lerp(x0,x1,u);if(x<xa||x>xe)continue;ctx.fillStyle="rgba(235,250,255,0.6)";ctx.beginPath();ctx.ellipse(x,ba_ys(x)+2,6,1.5,0,0,TAU);ctx.fill();}}ctx.restore();}
// a small wooden gate in the channel, where the water turns into a field: o (0..1) is how far it's lifted
function ba_gate(ctx,x,o,a){if(a<=0.01)return;const ys=ba_ys(x);withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(70,48,32,1)";ctx.fillRect(x-14,ys-26,4,30);ctx.fillRect(x+10,ys-26,4,30);
  const lift=clamp(o,0,1)*16;ctx.fillStyle="rgba(132,94,60,1)";ctx.fillRect(x-10,ys-14-lift,20,18);ctx.strokeStyle="rgba(255,220,170,0.4)";ctx.lineWidth=1.5;ctx.strokeRect(x-10,ys-14-lift,20,18);ctx.restore();});}
// The village beside the fields, side on. Behind the fields, its houses of earth brick (flat roofs, a few domes), a little paler with
// the distance, and its trees: date palms and broad fruit trees. In front, the fields: a low bank at each end and rows of crop, green
// and tall when watered (o.wet[i], 0..1), dry and short when not, with the water spread over the field in its turn (o.fill[i]).
const BA_VFIELDS=[[1560,150],[1730,150],[1900,150],[2070,150]];
const BA_VHOUSES=[[1462,96,70],[1556,120,58,1],[1688,86,92],[1782,124,66],[1916,100,78,1],[2026,128,60],[2166,92,88],[2268,132,68,1],[2410,110,80]];
// a date palm: a tall trunk, leaning a little and ringed, and a crown of fronds that droop from it
function ba_palm(ctx,x,ys,s,t){ctx.save();ctx.translate(x,ys);ctx.scale(s,s);
  ctx.fillStyle="rgba(98,72,50,1)";ctx.beginPath();ctx.moveTo(-7,0);ctx.quadraticCurveTo(-4,-90,6,-180);ctx.lineTo(12,-180);ctx.quadraticCurveTo(4,-90,7,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(58,40,28,0.7)";ctx.lineWidth=1.6;for(let k=1;k<18;k++){const u=k/18,yy=-180*u,xx=9*u*u;ctx.beginPath();ctx.moveTo(xx-6,yy);ctx.lineTo(xx+6,yy+2);ctx.stroke();}
  const sw=Math.sin((t||0)*0.8)*0.03;for(let k=0;k<10;k++){const an=-Math.PI*0.98+k*Math.PI*0.98/9+sw,L=66+16*hash(k,881),mx=9+Math.cos(an)*L*0.5,my=-182+Math.sin(an)*L*0.55,ex=9+Math.cos(an)*L,ey=-180+Math.sin(an)*L*0.55+L*0.36;
    ctx.fillStyle=rgba(mix([56,96,50],[112,150,80],hash(k,882)),1);ctx.beginPath();ctx.moveTo(9,-183);ctx.quadraticCurveTo(mx,my-15,ex,ey);ctx.quadraticCurveTo(mx,my-1,9,-177);ctx.closePath();ctx.fill();}
  ctx.restore();}
// a broad fruit tree: a short trunk, forked, and a canopy of rounded masses, lit at the top
function ba_tree(ctx,x,ys,s){ctx.save();ctx.translate(x,ys);ctx.scale(s,s);ctx.fillStyle="rgba(86,60,42,1)";ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(-5,-40,-16,-72);ctx.lineTo(-7,-74);ctx.quadraticCurveTo(0,-52,3,-76);ctx.lineTo(12,-72);ctx.quadraticCurveTo(5,-40,8,0);ctx.closePath();ctx.fill();
  [[-34,-92,34],[34,-90,32],[0,-114,40],[-14,-80,28],[18,-78,28]].forEach(([cx,cy,r])=>{const g=ctx.createRadialGradient(cx-r*0.4,cy-r*0.5,2,cx,cy,r);g.addColorStop(0,"rgba(156,190,104,1)");g.addColorStop(1,"rgba(50,82,46,1)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();});
  ctx.restore();}
function ba_village(ctx,t,o){o=o||{};
  // the houses, behind the fields
  BA_VHOUSES.forEach(([x,w,h,dome],i)=>{const yb=ba_ys(x+w/2)-14,hg=ctx.createLinearGradient(x,yb-h,x+w,yb);hg.addColorStop(0,"rgba(230,198,158,1)");hg.addColorStop(1,"rgba(184,146,106,1)");
    if(dome){const dg=ctx.createRadialGradient(x+w*0.4,yb-h-w*0.2,2,x+w/2,yb-h,w*0.34);dg.addColorStop(0,"rgba(236,210,172,1)");dg.addColorStop(1,"rgba(176,138,100,1)");ctx.fillStyle=dg;ctx.beginPath();ctx.ellipse(x+w/2,yb-h+2,w*0.32,w*0.3,0,Math.PI,0);ctx.fill();}
    ctx.fillStyle=hg;ctx.fillRect(x,yb-h,w,h+16);ctx.fillStyle="rgba(150,112,80,0.7)";ctx.fillRect(x-2,yb-h-4,w+4,5);
    ctx.fillStyle="rgba(62,42,30,0.85)";ctx.fillRect(x+w*0.18+((i*37)%3)*w*0.12,yb-h*0.48,w*0.16,h*0.48+14);if(h>64)ctx.fillRect(x+w*0.62,yb-h*0.78,w*0.12,h*0.16);});
  // the trees: broad fruit trees, and date palms in front of the houses
  [[1610,0.62],[1990,0.7],[2330,0.6]].forEach(([x,s])=>ba_tree(ctx,x,ba_ys(x)-8,s));
  [[1512,0.62],[1868,0.7],[2236,0.66],[2392,0.58]].forEach(([x,s])=>ba_palm(ctx,x,ba_ys(x)-6,s,t+x));
  // the fields
  BA_VFIELDS.forEach(([x,w],i)=>{const wt=clamp(o.wet?o.wet[i]||0:0.8,0,1),fw=o.fill?o.fill[i]||0:0,ys=ba_ys(x+w/2),c=mix([200,164,98],[98,152,70],wt),c2=mix([176,136,82],[72,122,56],wt);
    ctx.fillStyle=rgba(mix([152,114,78],[92,64,46],Math.max(wt*0.6,fw)),1);ctx.fillRect(x,ys-3,w,7);
    [x-2,x+w+2].forEach(bx=>{ctx.fillStyle="rgba(152,112,76,1)";ctx.beginPath();ctx.ellipse(bx,ys,8,6,0,Math.PI,0);ctx.fill();});
    for(let k=0;k<26;k++){const xx=x+5+k*(w-10)/25,hh=(10+22*wt)*(0.82+0.36*hash(k+i*26,751)),sw=Math.sin(t*1.3+k*0.7)*1.5*wt;ctx.strokeStyle=rgba(k%2?c:c2,1);ctx.lineWidth=2.4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(xx,ys-2);ctx.quadraticCurveTo(xx+sw*0.4,ys-hh*0.6,xx+sw,ys-hh);ctx.stroke();ctx.fillStyle=rgba(mix(c,[228,202,124],0.35),1);ctx.beginPath();ctx.ellipse(xx+sw,ys-hh-3,2.2,4.5,sw*0.05,0,TAU);ctx.fill();}
    if(fw>0.01){ctx.fillStyle=rgba(BA_WATER,0.9*fw);ctx.fillRect(x,ys-3,w,6);for(let k=0;k<5;k++){const u=(t*0.2+k/5)%1;ctx.fillStyle="rgba(235,250,255,"+(0.6*fw)+")";ctx.beginPath();ctx.ellipse(x+8+u*(w-16),ys,6,1.2,0,0,TAU);ctx.fill();}glow(ctx,x+w/2,ys-8,96,BA_WATER,0.42*fw);}});}

/* ---------- the people of the story ---------- */
// The story's people as plain silhouettes, never given a face: one path (head, body, both arms, the feet), every part wound the same
// way and filled once, so a figure fades as one picture, with a warm rim of light down its lit side. Standing, seen from the front with
// the head turned a little towards f (1 right, -1 left); o.kind "stoop": seen side on, bent over the work in the tunnel.
// o.dress: "robe" (long, to the ankles), "tunic" (to the knee, over trousers) or "chador" (a cloak from the head to the feet);
// o.head: "cap" or "turban". Arms hang down; the near hand is only ever on the thing the story is about: o.hold "lamp" or "pick"
// (stooping) draws it in the hand, and o.reach [x, y], a point in the scene (a gate's board, a windlass's handle), puts the hand there.
// s: scale (1 is about 300 px tall).
function ba_poly(p,P){let a=0;for(let i=0;i<P.length;i++){const[x0,y0]=P[i],[x1,y1]=P[(i+1)%P.length];a+=x0*y1-x1*y0;}if(a<0)P=P.slice().reverse();p.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)p.lineTo(P[i][0],P[i][1]);p.closePath();}
function ba_disc(p,x,y,rx,ry){p.moveTo(x+rx,y);p.ellipse(x,y,rx,ry,0,0,TAU);}
// a limb through a, b and c (shoulder, elbow, hand; or hip, knee, ankle), tapering from w0 to w1, rounded at its joints
function ba_limb(p,a,b,c,w0,w1){const P=[a,b,c],L=[],R=[];P.forEach(([x,y],i)=>{const[xa,ya]=P[Math.max(0,i-1)],[xb,yb]=P[Math.min(2,i+1)],d=Math.hypot(xb-xa,yb-ya)||1,w=lerp(w0,w1,i/2);L.push([x-(yb-ya)/d*w,y+(xb-xa)/d*w]);R.push([x+(yb-ya)/d*w,y-(xb-xa)/d*w]);});
  ba_poly(p,L.concat(R.reverse()));ba_disc(p,a[0],a[1],w0,w0);const wm=(w0+w1)/2;ba_disc(p,b[0],b[1],wm,wm);}
function ba_fig(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const f=o.f||1,dr=o.dress||"robe",col=o.col||[40,32,34],rim=o.rim||[255,200,150],p=new Path2D();
  const hand=o.reach?[(o.reach[0]-x)/(s*f),(o.reach[1]-y)/s]:null;let lamp=null,pick=null;
  if(o.kind==="stoop"){
    // bent over the work: legs bent, the back arched forward, the head low, both hands forward on the pick or the lamp
    ba_limb(p,[-14,-106],[-2,-58],[-20,-10],13,8);ba_limb(p,[4,-108],[30,-64],[22,-10],13,8);ba_disc(p,-14,-5,13,6);ba_disc(p,28,-5,13,6);
    ba_limb(p,[-6,-112],[14,-162],[46,-190],25,20);ba_limb(p,[44,-190],[54,-194],[62,-196],9,8);ba_disc(p,74,-198,18,21);
    if(o.head==="cap")ba_disc(p,77,-210,19,11);
    const H=o.hold==="lamp"?[98,-112]:[94,-128];ba_limb(p,[40,-190],[60,-150],[H[0]-8,H[1]+2],8,6);ba_limb(p,[50,-186],[72,-152],H,8,6);ba_disc(p,H[0],H[1],7,8);
    if(o.hold==="lamp")lamp=[H[0]+4,H[1]+20];if(o.hold==="pick")pick=H;}
  else{
    // standing: head and neck, the body in its dress, both arms down, the near one on what it holds
    if(dr!=="chador"){ba_disc(p,4,-270,19,23);ba_poly(p,[[-8,-254],[8,-254],[8,-234],[-8,-234]]);
      if(o.head==="cap")ba_disc(p,4,-284,21,12);if(o.head==="turban"){ba_disc(p,4,-286,26,14);ba_disc(p,4,-277,23,9);}}
    const R=dr==="chador"?[[0,-298],[14,-294],[25,-278],[28,-254],[44,-222],[48,-190],[46,-150],[48,-100],[52,-42],[56,-4]]
      :dr==="tunic"?[[9,-240],[24,-236],[38,-228],[42,-214],[39,-190],[35,-165],[31,-135],[34,-112],[38,-92],[28,-90],[24,-50],[21,-8],[5,-8],[3,-72],[0,-80]]
      :[[9,-240],[24,-236],[38,-228],[42,-214],[39,-190],[35,-165],[31,-135],[33,-110],[37,-70],[41,-35],[45,-6]];
    ba_poly(p,R.concat(R.slice().reverse().map(([u,v])=>[-u,v])));
    if(dr==="tunic"){ba_disc(p,-10,-4,13,5);ba_disc(p,18,-4,13,5);}else if(dr==="robe"){ba_disc(p,-12,-3,12,5);ba_disc(p,18,-3,12,5);}
    const S=[38,-222],H=hand||(o.hold==="lamp"?[58,-148]:[52,-114]),E=[(S[0]+H[0])/2+8,(S[1]+H[1])/2+5];
    if(dr!=="chador"||hand){ba_limb(p,S,E,H,9,6.5);ba_disc(p,H[0],H[1]+3,7,8);}
    if(dr!=="chador"){ba_limb(p,[-38,-222],[-47,-166],[-52,-114],9,6.5);ba_disc(p,-52,-111,7,8);}
    if(o.hold==="lamp")lamp=[H[0]+4,H[1]+30];}
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*f,s);ctx.fillStyle=rgba(col,1);ctx.fill(p);
    // the rim of light down the lit side, inside the figure only
    ctx.save();ctx.clip(p);const rg=ctx.createLinearGradient(-70,0,o.kind==="stoop"?110:70,0);rg.addColorStop(0,rgba(rim,0));rg.addColorStop(0.7,rgba(rim,0));rg.addColorStop(1,rgba(rim,o.rimA==null?0.55:o.rimA));ctx.fillStyle=rg;ctx.fillRect(-140,-320,300,330);ctx.restore();
    // what the hand holds
    if(lamp){const[lx,ly]=lamp;ctx.strokeStyle="rgba(40,30,24,1)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lx-4,ly-24);ctx.lineTo(lx,ly-6);ctx.stroke();ctx.fillStyle="rgba(150,104,60,1)";ctx.beginPath();ctx.ellipse(lx,ly,14,7,0,0,TAU);ctx.fill();
      const fl=0.85+0.15*Math.sin((o.t||0)*9);ctx.fillStyle="rgba(255,214,140,1)";ctx.beginPath();ctx.ellipse(lx+12,ly-8,4,9*fl,0.3,0,TAU);ctx.fill();}
    if(pick){const[hx,hy]=pick,ex=hx+46,ey=hy+40;ctx.lineCap="round";ctx.strokeStyle="rgba(84,62,42,1)";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(hx-14,hy-10);ctx.lineTo(ex,ey);ctx.stroke();
      ctx.strokeStyle="rgba(120,120,126,1)";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(ex-20,ey-26);ctx.quadraticCurveTo(ex+6,ey-4,ex+14,ey+30);ctx.stroke();}
    ctx.restore();
    if(lamp){const gx=x+(lamp[0]+12)*s*f,gy=y+(lamp[1]-8)*s;glow(ctx,gx,gy,160*s,[255,200,120],0.55);glow(ctx,gx,gy,44*s,[255,230,170],0.75);}});}
// the windlass over a shaft: two posts, a drum with its handle (on the left with o.f -1), the rope down the shaft and a bucket of earth
// rising; p (0..1) is the bucket's way up, from depth to the top; t turns the handle, and ba_crank says where the handle is
function ba_crank(x,ys,s,t,f){const an=(t||0)*2.4;return[x+(f||1)*s*(62+Math.cos(an)*20),ys+s*(-119+Math.sin(an)*20)];}
function ba_windlass(ctx,x,ys,s,p,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,ys);ctx.scale(s*(o.f||1),s);
  ctx.strokeStyle="rgba(70,48,32,1)";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-64,-8);ctx.lineTo(-52,-118);ctx.moveTo(64,-8);ctx.lineTo(52,-118);ctx.stroke();
  ctx.fillStyle="rgba(120,84,52,1)";rr(ctx,-56,-132,112,26,10);ctx.fill();ctx.strokeStyle="rgba(255,220,170,0.35)";ctx.lineWidth=2;rr(ctx,-56,-132,112,26,10);ctx.stroke();
  const an=(t||0)*2.4,hx=62+Math.cos(an)*20,hy=-119+Math.sin(an)*20;ctx.strokeStyle="rgba(90,62,40,1)";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(56,-119);ctx.lineTo(hx,hy);ctx.stroke();
  const depth=o.depth||260,by=lerp(depth,-60,clamp(p,0,1));ctx.strokeStyle="rgba(196,170,130,0.9)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-106);ctx.lineTo(0,by-22);ctx.stroke();
  ctx.fillStyle="rgba(96,66,44,1)";ctx.beginPath();ctx.moveTo(-18,by-22);ctx.lineTo(18,by-22);ctx.lineTo(13,by+6);ctx.lineTo(-13,by+6);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(150,112,78,1)";ctx.beginPath();ctx.ellipse(0,by-22,18,5,0,0,TAU);ctx.fill();
  ctx.restore();});}

/* ---------- shares of time ---------- */
// one rotation of the water, as a bar of days, divided into its owners' shares; o.n shares, o.days, o.hi the share lit (index),
// o.p draws it, o.lab its label; returns where share i starts and ends, so a scene can point at it
function ba_shares(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,n=o.n||15,h=o.h||56,p=o.p==null?1:o.p,R=[];for(let i=0;i<n;i++)R.push([x+w*i/n,x+w*(i+1)/n]);if(a<=0.01)return R;
  withA(ctx,a,()=>{glass(ctx,x-16,y-16,w+32,h+32,18,BAC,{glow:12,ea:0.7,fill:"rgba(8,14,24,0.9)"});
    R.forEach(([x0,x1],i)=>{const q=clamp(p*n-i,0,1);if(q<=0)return;const hi=o.hi===i?1:0,c=hi?BA_WATER:mix(BA_SAND,[255,255,255],0.12*(i%2));
      ctx.fillStyle=rgba(c,(0.28+0.5*hi)*q);ctx.fillRect(x0+2,y,(x1-x0-4)*q,h);if(hi){ctx.strokeStyle=rgba(BA_WATER,1);ctx.lineWidth=3;ctx.strokeRect(x0+1,y-2,x1-x0-2,h+4);glow(ctx,(x0+x1)/2,y+h/2,80,BA_WATER,0.35);}});
    if(o.lab)T(ctx,o.lab,x,y-36,{w:700,size:30,color:rgba(INK,0.95)});});return R;}

/* ---------- the data practice on the map ---------- */
// ArchiMate's glyphs for what ea.js's archGlyph doesn't draw: a service (a rounded bar), an interface (a ring on a stalk), a product
// (a box with a tab at its top left), and a group (a dashed box with its tab)
function baGlyph(ctx,kind,x,y,s,col){if(kind==="service"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);rr(ctx,x-s*0.85,y-s*0.42,s*1.7,s*0.84,s*0.42);ctx.stroke();ctx.restore();}
  else if(kind==="interface"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.beginPath();ctx.arc(x+s*0.3,y,s*0.38,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.85,y);ctx.lineTo(x-s*0.08,y);ctx.stroke();ctx.restore();}
  else if(kind==="product"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.strokeRect(x-s*0.8,y-s*0.55,s*1.6,s*1.1);ctx.strokeRect(x-s*0.8,y-s*0.55,s*0.7,s*0.32);ctx.restore();}
  else if(kind==="group"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.setLineDash([s*0.25,s*0.18]);ctx.strokeRect(x-s*0.8,y-s*0.4,s*1.6,s*0.95);ctx.setLineDash([]);ctx.strokeRect(x-s*0.8,y-s*0.62,s*0.7,s*0.22);ctx.restore();}
  else archGlyph(ctx,kind,x,y,s,col);}
// an element of the model, as archEl draws one, with the glyphs above; o.dash: a dashed red outline (no owner); o.owner: a gold tag
// below it with the owner's name; o.src: a tag above it
function baEl(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const r=kind==="service"?h/2:kind==="process"||kind==="capability"?16:6;
  glass(ctx,x,y,w,h,r,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.14+0.12*(o.hi||0));rr(ctx,x,y,w,h,r);ctx.fill();
  if(o.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BA_RED,0.95);ctx.lineWidth=3;rr(ctx,x-5,y-5,w+10,h+10,r+4);ctx.stroke();ctx.restore();}
  const gs=o.gs||13;baGlyph(ctx,kind,x+w-gs-14-(kind==="service"?h*0.2:0),y+gs+10,gs,col);const sz=o.size||28,ls=wrapT(ctx,name,0,0,w-70,{size:sz,w:700,measure:true});
  wrapT(ctx,name,x+w/2-10,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,w-70,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15,deco:o.deco});
  if(o.owner)withA(ctx,o.ownerA==null?1:o.ownerA,()=>tag(ctx,x+w/2,y+h+30,o.owner,TRUST,{align:"center",size:28}));});}
// The data practice's part of the business layer, drawn the same way in every film of the series: who does the work and how it's
// reached on the left, its processes and products in the middle, the business objects and their domains on the right, with the roles
// that own them above. Each film adds its own (o.film, 1 to 5); a film shows the ones before it as they were, and brings in its own.
// Each element: [id, kind, name, film, x, y, w, h, colour]
const BA_PRACTICE=[
  ["team","actor","data team",1,120,214,400,96,BA_BUS],
  ["tickets","interface","tickets",1,120,350,400,84,BA_BUS],
  ["requests","service","answer data requests",1,120,474,400,96,BA_BUS],
  ["products","service","provide data products",5,120,610,400,96,BA_BUS],
  ["p_request","process","answer a data request",4,600,214,400,96,BA_BUS],
  ["p_build","process","build a data product",4,600,342,400,96,BA_BUS],
  ["p_source","process","take on a source",4,600,470,400,96,BA_BUS],
  ["product","product","Meter readings",5,600,610,400,96,BA_BUS],
  ["contract","contract","its contract",5,600,742,400,84,BA_BUS],
  ["owner","role","data owner",3,1080,170,330,84,BA_BUS],
  ["steward","role","data steward",3,1470,170,330,84,BA_BUS],
  ["net","group","network",2,1080,300,330,470,BA_NET],
  ["ret","group","retail",2,1470,300,330,330,BA_RET],
  ["shared","group","shared",2,1470,650,330,120,BAC],
  ["cp","object","connection point",1,1100,352,290,84,BA_INF],
  ["reading","object","meter reading",2,1100,466,290,84,BA_INF],
  ["solar","object","solar and battery",2,1100,580,290,84,BA_INF],
  ["account","object","account",1,1490,352,290,84,BA_INF],
  ["bill","object","bill",2,1490,466,290,84,BA_INF],
  ["location","object","location",2,1490,690,290,70,BA_INF]];
// o.film: the film showing it; o.at[id]: when a new element arrives (default: at once); o.hi[id] (0..1): one lit;
// o.owners: the owners' tags under the business objects (o.ownersA, 0..1); o.a: the whole panel; o.deco: names as texture (seen from afar);
// o.ghost (0..1): the later films' elements, as empty dashed outlines still to fill (o.ghostAt[film]: when each film's arrive);
// o.pre (0..1): this film's new elements, as the same outlines, until each arrives
function ba_ghostBox(ctx,kind,x,y,w,h,col){ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,kind==="service"?h/2:kind==="process"?16:kind==="group"?14:6);ctx.stroke();ctx.restore();}
function baPractice(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=o.film||1,at=o.at||{},hi=o.hi||{},OWN={cp:"Grace",account:"head of retail",reading:"Grace",solar:"Grace",bill:"head of retail"};
  withA(ctx,a,()=>{const gh=o.ghost||0,pre=o.pre||0;if(gh>0.01)BA_PRACTICE.forEach(([id,kind,name,f,x,y,w,h,col])=>{if(f<=F)return;const ga=gh*(o.ghostAt&&o.ghostAt[f]!=null?fin(t,o.ghostAt[f],0.6):1);if(ga<=0.01)return;
      withA(ctx,ga,()=>ba_ghostBox(ctx,kind,x,y,w,h,col));});
    // this film's own elements, as outlines where each will be drawn, before each arrives
    if(pre>0.01)BA_PRACTICE.forEach(([id,kind,name,f,x,y,w,h,col])=>{if(f!==F||at[id]==null)return;const pa=pre*(1-fin(t,at[id],0.6));if(pa>0.01)withA(ctx,pa,()=>ba_ghostBox(ctx,kind,x,y,w,h,col));});
    BA_PRACTICE.forEach(([id,kind,name,f,x,y,w,h,col])=>{if(f>F)return;const t0=at[id],v=t0==null?1:fin(t,t0,0.6);if(v<=0.01)return;
      if(kind==="group"){withA(ctx,v,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=rgba(col,0.05);rr(ctx,x,y,w,h,14);ctx.fill();ctx.restore();
        T(ctx,name,x+18,y+38,{w:800,size:28,color:rgba(col,1),deco:o.deco});});return;}
      const k=t0==null?1:spring((t-t0)/0.75),dy=(1-k)*-14;
      ctx.save();ctx.translate(0,dy);baEl(ctx,x,y,w,h,name,col,kind,{a:v,hi:hi[id]||0,deco:o.deco,owner:o.owners&&OWN[id]?OWN[id]:null,ownerA:o.ownersA==null?1:o.ownersA});ctx.restore();});});}
// a line between two of the panel's elements, by id: from the right edge of the first to the left edge of the second, or straight
// down; p draws it
function baPracticeLine(ctx,ida,idb,p,col,o){o=o||{};if(p<=0.01)return;const A=BA_PRACTICE.find(e=>e[0]===ida),B=BA_PRACTICE.find(e=>e[0]===idb);if(!A||!B)return;
  const down=Math.abs(A[4]-B[4])<40,x0=down?A[4]+A[6]/2:A[4]+A[6],y0=down?A[5]+A[7]:A[5]+A[7]/2,x1=down?B[4]+B[6]/2:B[4],y1=down?B[5]:B[5]+B[7]/2;
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col||SOFT,0.8);ctx.lineWidth=2.5;if(o.dash)ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,clamp(p,0,1)),lerp(y0,y1,clamp(p,0,1)));ctx.stroke();ctx.restore();}

// ArchiMate's access line, from a behaviour (a service, a process) to the business object it reads or writes: dashed, from the right
// edge of the first to the left edge of the second, as a curve that o.lift raises over what lies between; p draws it along the curve
function baPracticeAccess(ctx,ida,idb,p,o){o=o||{};if(p<=0.01)return;const A=BA_PRACTICE.find(e=>e[0]===ida),B=BA_PRACTICE.find(e=>e[0]===idb);if(!A||!B)return;
  const P=[[A[4]+A[6],A[5]+A[7]/2],null,null,[B[4],B[5]+B[7]/2]],lift=o.lift||0;P[1]=[P[0][0]+300,P[0][1]];P[2]=[P[3][0]-300,P[3][1]-lift];
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(o.col||BA_INF,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);
  const n=48,m=Math.round(n*clamp(p,0,1));for(let i=1;i<=m;i++){const u=i/n,v=1-u,x=v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],y=v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1];ctx.lineTo(x,y);}
  ctx.stroke();ctx.restore();}

/* ---------- the utility's paper and cards ---------- */
// a ticket, as the data team receives it: a kicker with its number, who asked, what for, and its state
function baTicket(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const col=o.col||BA_BUS,ls=wrapT(ctx,o.ask||"",0,0,w-56,{size:36,w:700,measure:true}),h=150+ls.length*44+(o.from?50:0);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});T(ctx,o.kicker||"ticket",x+28,y+48,{f:"mono",w:500,size:28,color:rgba(col,1)});
    ls.forEach((l,i)=>T(ctx,l,x+28,y+104+i*44,{w:700,size:36}));if(o.from)T(ctx,o.from,x+28,y+110+ls.length*44+8,{w:600,size:28,color:rgba(SOFT,1)});
    if(o.state)withA(ctx,o.stateA==null?1:o.stateA,()=>tag(ctx,x+28,y+h-36,o.state,o.stateCol||AMBER,{size:28}));});return h;}
// a count from one source: the number, what it counts, and where it came from
function baCount(ctx,x,y,w,h,num,what,src,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});
  T(ctx,src,x+26,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,num,x+26,y+124,{w:800,size:64});T(ctx,what,x+26,y+172,{w:700,size:30,color:rgba(INK,0.9)});
  if(o.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BA_RED,0.95);ctx.lineWidth=3;rr(ctx,x-6,y-6,w+12,h+12,22);ctx.stroke();ctx.restore();}
  if(o.mark>0.01){if(o.ok)kt_gtick(ctx,x+w-34,y+34,18,o.mark);else kt_rcross(ctx,x+w-34,y+34,18,o.mark);}});}
