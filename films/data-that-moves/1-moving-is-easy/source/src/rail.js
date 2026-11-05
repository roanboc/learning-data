/* ===== Moving is easy, agreeing is the work: the railway at Albury =====
   The opening's world, drawn as a railway diagram in the module's night (the place "night"): the Murray River, the border between
   Victoria (left) and New South Wales (right); the line from Melbourne on Victoria's gauge, 1,600 mm, across the 1883 bridge to the
   long platform at Albury; the line from Sydney on New South Wales' gauge, 1,435 mm, to the other side of it; the trains that met
   there, and everything lifted from one to the other; and, in 1962, the line built to one agreed gauge, in the gold of what people
   agree on, that every train runs straight through. Not to scale: Albury sits nearer Melbourne, as it does. Every name starts with
   mv_ or MV_. Sizes are in the place's coordinates (1920 x 1080), drawn under the camera; the gauge card is drawn in the frame. */

const MV_RAIL={
  river:640,                         // the Murray, near x 640, winding
  nsw:520, vic:660,                  // the two lines' heights: New South Wales' from Sydney, Victoria's from Melbourne
  melb:120, syd:1800,                // the ends of the lines
  plat:[706,1080,544,636],           // Albury's platform: x0, x1, y0, y1, between the two lines (455 m long, the longest in Australia)
  bridge:[580,700],                  // the 1883 bridge over the river, on Victoria's line
  gN:20, gV:22                       // each line's rails, this far apart in the wide picture (1,435 mm and 1,600 mm)
};
const MV_STEEL=[176,190,214],MV_SLEEPER=[112,102,96],MV_WATER=[70,124,200];

// the river: a band of dark water with a faint light along it, winding down the frame; o.a
function mv_river(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const x0=MV_RAIL.river,pts=[];for(let y=-40;y<=1120;y+=20)pts.push([x0+Math.sin(y*0.0062+0.8)*26+Math.sin(y*0.017)*7,y]);
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  for(const [w,al] of [[86,0.07],[52,0.16],[30,0.5]]){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=rgba(w>40?MV_WATER:[22,44,84],al);ctx.lineWidth=w;ctx.stroke();}
  // a slow glint drifting down the water
  ctx.setLineDash([26,58]);ctx.lineDashOffset=-t*18;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0]-3,p[1]):ctx.moveTo(p[0]-3,p[1]));ctx.strokeStyle=rgba([150,196,255],0.22);ctx.lineWidth=2;ctx.stroke();ctx.restore();}

// a line of track from x0 to x1 at height y: two rails g apart over sleepers; o.col (the rails' colour), o.u (drawn from o.from: "left"
// or "right", 0 to 1), o.a, o.glow (0 to 1)
function mv_track(ctx,x0,x1,y,g,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:clamp(o.u,0,1);if(a<=0.004||u<=0)return;const col=o.col||MV_STEEL;
  let L=x0,R=x1;if(u<1){if(o.from==="right")L=x1-(x1-x0)*u;else R=x0+(x1-x0)*u;}
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="butt";ctx.strokeStyle=rgba(o.sleeper||MV_SLEEPER,0.85);ctx.lineWidth=4.5;
  for(let x=Math.ceil(x0/16)*16;x<=x1;x+=16){if(x<L||x>R)continue;ctx.beginPath();ctx.moveTo(x,y-g/2-7);ctx.lineTo(x,y+g/2+7);ctx.stroke();}
  if(o.glow)for(const yy of[y-g/2,y+g/2])glow(ctx,(L+R)/2,yy,(R-L)*0.4,col,0.12*o.glow);
  ctx.strokeStyle=rgba(col,0.18);ctx.lineWidth=9;for(const yy of[y-g/2,y+g/2]){ctx.beginPath();ctx.moveTo(L,yy);ctx.lineTo(R,yy);ctx.stroke();}
  ctx.strokeStyle=rgba(col,0.97);ctx.lineWidth=3.4;for(const yy of[y-g/2,y+g/2]){ctx.beginPath();ctx.moveTo(L,yy);ctx.lineTo(R,yy);ctx.stroke();}
  ctx.restore();}

// the 1883 bridge: an iron truss over the river, x0 to x1, on the line at y; o.lit (0 to 1), o.a
function mv_bridge(ctx,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const lit=o.lit||0,col=mix([150,164,190],MD.ink,lit*0.6),h=46,n=6,top=y-h,bot=y+16;
  ctx.save();ctx.globalAlpha*=a;if(lit>0)glow(ctx,(x0+x1)/2,y-h/2,(x1-x0)*0.9,MD.flow,0.18*lit);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.lineJoin="round";
  // the top chord, a low arch; the deck; and the diagonals between them
  const topAt=x=>top+Math.pow((x-(x0+x1)/2)/((x1-x0)/2),2)*h*0.45;ctx.beginPath();for(let i=0;i<=24;i++){const x=lerp(x0,x1,i/24);i?ctx.lineTo(x,topAt(x)):ctx.moveTo(x,topAt(x));}ctx.stroke();
  ctx.beginPath();ctx.moveTo(x0-6,bot);ctx.lineTo(x1+6,bot);ctx.stroke();
  ctx.lineWidth=1.6;for(let i=0;i<=n;i++){const x=lerp(x0,x1,i/n);ctx.beginPath();ctx.moveTo(x,topAt(x));ctx.lineTo(x,bot);ctx.stroke();if(i<n){const xn=lerp(x0,x1,(i+1)/n);ctx.beginPath();ctx.moveTo(x,i<n/2?bot:topAt(x));ctx.lineTo(xn,i<n/2?topAt(xn):bot);ctx.stroke();}}
  ctx.restore();}

// Albury's platform, between the two lines; o.a
function mv_platform(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const [x0,x1,y0,y1]=MV_RAIL.plat;ctx.save();ctx.globalAlpha*=a;
  const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,"rgba(70,80,104,0.96)");g.addColorStop(1,"rgba(46,54,76,0.96)");rr(ctx,x0,y0,x1-x0,y1-y0,6);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=rgba([190,204,230],0.55);ctx.lineWidth=1.6;ctx.stroke();
  // the platform's edges, painted pale, and the station's long roof, its ridge along the middle
  ctx.strokeStyle=rgba([226,214,180],0.55);ctx.lineWidth=2.4;for(const yy of[y0+6,y1-6]){ctx.beginPath();ctx.moveTo(x0+8,yy);ctx.lineTo(x1-8,yy);ctx.stroke();}
  const rx0=x0+70,rx1=x0+250;rr(ctx,rx0,y0+16,rx1-rx0,y1-y0-32,4);ctx.fillStyle="rgba(96,84,78,0.98)";ctx.fill();ctx.strokeStyle=rgba([214,190,160],0.7);ctx.lineWidth=1.4;ctx.stroke();
  ctx.beginPath();ctx.moveTo(rx0+4,(y0+y1)/2);ctx.lineTo(rx1-4,(y0+y1)/2);ctx.stroke();
  // lamps along it, warm in the night
  for(let i=0;i<5;i++){const lx=lerp(x0+300,x1-30,i/4),ly=(y0+y1)/2;glow(ctx,lx,ly,26,[255,206,140],0.5);ctx.fillStyle=rgba([255,226,180],0.95);ctx.beginPath();ctx.arc(lx,ly,3,0,TAU);ctx.fill();}
  ctx.restore();}

// where a line ends: a city or a buffer stop. A city: a bar across the line(s) from y0 to y1 and its name above; o.a, o.align
function mv_city(ctx,x,y0,y1,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;glow(ctx,x,(y0+y1)/2,46,MD.ink,0.18);
  rr(ctx,x-5,y0-16,10,y1-y0+32,5);ctx.fillStyle=rgba(MD.ink,0.9);ctx.fill();md_T(ctx,name,x+(o.dx||0),y0-36,{w:700,size:30,align:o.align||"center"});ctx.restore();}
function mv_buffer(ctx,x,y,g,dir,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba([210,190,150],0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-g/2-8);ctx.lineTo(x,y+g/2+8);ctx.stroke();
  ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-g/2-8);ctx.lineTo(x-dir*10,y-g/2-2);ctx.moveTo(x,y+g/2+8);ctx.lineTo(x-dir*10,y+g/2+2);ctx.stroke();ctx.restore();}

// a train of n cars standing on a line at y, its first car's front at x, running towards dir (-1 left, 1 right): o.kind "passenger"
// (lit windows) or "freight" (wagons with their loads); o.col (the cars' colour), o.glow (a train of the agreed line glows gold), o.a
function mv_train(ctx,x,y,n,dir,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=o.kind==="freight"?54:66,gap=7,h=o.kind==="freight"?24:28,col=o.col||[78,90,116];
  ctx.save();ctx.globalAlpha*=a;if(o.glow)glow(ctx,x-dir*(n*(L+gap))/2,y,n*(L+gap)*0.6,MD.agreed,0.22*o.glow);
  for(let i=0;i<n;i++){const cx=x-dir*(i*(L+gap)+L/2),bx=cx-L/2,by=y-h/2;
    rr(ctx,bx,by,L,h,i===0?8:4);ctx.fillStyle=rgba(col,0.98);ctx.fill();ctx.strokeStyle=rgba(o.glow?mix(MD.agreed,[255,255,255],0.3):[150,166,196],o.glow?0.9:0.55);ctx.lineWidth=1.4;ctx.stroke();
    if(o.kind==="freight"){ctx.fillStyle=rgba(i%2?[232,224,206]:[196,150,100],0.85);rr(ctx,bx+6,by+4,L-12,h-8,3);ctx.fill();}
    else{ctx.fillStyle=rgba([255,214,150],0.8);for(let w=0;w<5;w++)ctx.fillRect(bx+8+w*11,by+7,7,h-14);}}
  ctx.restore();}

// what changing trains meant: crates and bales of wool lifted from Victoria's wagons over the platform to New South Wales' and back,
// and passengers crossing it, now and then, as long as o.a lasts
function mv_transfers(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const [x0,x1]=MV_RAIL.plat,yN=MV_RAIL.nsw,yV=MV_RAIL.vic;ctx.save();ctx.globalAlpha*=a;
  // goods: each lifted in an arc, one after another along the platform
  spawn(t,0.55,2.2,0,(u,i)=>{const x=lerp(x0+300,x1-30,hash(i,3)),up=hash(i,5)>0.35,ya=up?yV:yN,yb=up?yN:yV,e=ease(u),y=lerp(ya,yb,e)-Math.sin(Math.PI*e)*44,f=sstep(0,0.1,u)*(1-sstep(0.9,1,u));
    const wool=hash(i,7)>0.5;ctx.save();ctx.globalAlpha*=f;if(wool){ctx.fillStyle=rgba([236,228,210],0.97);rr(ctx,x-10,y-8,20,16,7);ctx.fill();}else{ctx.fillStyle=rgba([200,154,104],0.97);ctx.fillRect(x-9,y-9,18,18);ctx.strokeStyle=rgba([110,80,52],0.9);ctx.lineWidth=1.6;ctx.strokeRect(x-9,y-9,18,18);}ctx.restore();});
  // people: small lights crossing the platform, from one train to the other
  spawn(t,0.42,2.8,0.2,(u,i)=>{const x=lerp(x0+300,x1-40,hash(i,11))+Math.sin(u*3+i)*6,up=hash(i,13)>0.5,y=lerp(up?yV-12:yN+12,up?yN+12:yV-12,ease(u)),f=sstep(0,0.12,u)*(1-sstep(0.88,1,u));
    glow(ctx,x,y,14,[255,226,190],0.7*f);ctx.fillStyle=rgba([255,236,210],f);ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();});
  ctx.restore();}

/* the whole diagram, under the camera: o.labels (0 to 1, the colonies and the river), o.uN and o.uV (0 to 1: New South Wales' line drawn
   from Sydney, Victoria's from Melbourne), o.plat (0 to 1, Albury and its platform), o.bridge (0 to 1, the bridge lit), o.trains (0 to
   1: the two trains standing at the platform), o.transfers (0 to 1), o.gold (0 to 1: the 1962 line drawn from Albury to Melbourne),
   o.through (seconds since the freight train left Sydney, or null), o.passenger (seconds since the passenger train left), o.a */
function mv_railMap(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const R=MV_RAIL,lab=o.labels==null?1:o.labels,uN=o.uN==null?1:o.uN,uV=o.uV==null?1:o.uV,pl=o.plat==null?1:o.plat,[px0,px1]=R.plat,g=o.gold||0;
  ctx.save();ctx.globalAlpha*=a;mv_river(ctx,t,{});
  // the colonies, and the river between them
  withA(ctx,lab,()=>{md_label(ctx,370,350,"Victoria",{align:"center",size:30});md_label(ctx,1250,350,"New South Wales",{align:"center",size:30});md_T(ctx,"Murray River",R.river+40,210,{w:600,size:28,col:[140,194,255]});});
  // Victoria's line from Melbourne over the bridge to the platform; New South Wales' line from Sydney to its other side
  mv_track(ctx,R.melb,px1,R.vic,R.gV,{u:uV,from:"left"});mv_track(ctx,px0,R.syd,R.nsw,R.gN,{u:uN,from:"right"});
  mv_bridge(ctx,R.bridge[0],R.bridge[1],R.vic,{lit:o.bridge||0,a:ag_in(uV,0.35,0.3)});
  mv_platform(ctx,{a:pl});mv_buffer(ctx,px1+4,R.vic,R.gV,1,pl*ag_in(uV,0.9,0.1));mv_buffer(ctx,px0-4,R.nsw,R.gN,-1,pl*ag_in(uN,0.9,0.1)*(1-ag_in(g,0,0.15)));
  // 1962: the agreed gauge, laid from the platform's end across the river to Melbourne, beside Victoria's line
  if(g>0){mv_track(ctx,R.melb,px0,R.nsw,R.gN,{u:g,from:"right",col:MD.agreed,glow:1,sleeper:[150,126,80]});mv_bridge(ctx,R.bridge[0],R.bridge[1],R.nsw,{a:ag_in(g,0.05,0.2),lit:0.5});}
  const cities=o.cities==null?1:o.cities;withA(ctx,ag_in(uV,0.85,0.15)*cities,()=>mv_city(ctx,R.melb,R.nsw,R.vic,"Melbourne",{dx:-4,align:"left"}));withA(ctx,ag_in(uN,0.85,0.15)*cities,()=>mv_city(ctx,R.syd,R.nsw,R.nsw,"Sydney",{align:"right",dx:6}));
  withA(ctx,pl*(o.albury==null?1:o.albury),()=>md_T(ctx,"Albury",px0+190,R.nsw-38,{w:800,size:32,align:"center"}));
  // the trains that met at Albury, and everything carried from one to the other
  const tr=o.trains||0;if(tr>0){mv_train(ctx,px1-20,R.vic,6,1,{kind:"passenger",a:tr});mv_train(ctx,px0+30,R.nsw,6,-1,{kind:"freight",a:tr,col:[86,78,74]});}
  mv_transfers(ctx,t,{a:o.transfers||0});
  // 1962: a train runs straight through, Sydney to Melbourne, along one gauge
  const run=(s,kind)=>{if(s==null||s<0||s>6.2)return;const x=lerp(R.syd+120,R.melb-260,clamp(s/6.2,0,1)),f=sstep(0,0.3,s)*(1-sstep(5.9,6.2,s));mv_train(ctx,x,R.nsw,kind==="freight"?9:6,-1,{kind,glow:1,a:f,col:kind==="freight"?[96,84,66]:[92,88,74]});};
  run(o.through,"freight");run(o.passenger,"passenger");
  ctx.restore();}

/* ---------------------------------------------------------------- the gauge, as a card in the frame
   The two lines' rails, seen end-on, each under its wheels and axle, the left rails lined up so the difference shows on the right:
   New South Wales' 1,435 mm, and Victoria's 1,600 mm, 165 mm wider, about a hand's length (a hand from wrist to fingertip). o.k (0 to 1, springs in), o.nsw and
   o.vic (0 to 1, each row comes in), o.diff (0 to 1, the difference in red), o.a. 760 x 600. */
function mv_gaugeCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=760,h=600,k=0.27;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{});
  md_T(ctx,"THE GAUGE",x+32,y+52,{w:800,size:28,ls:4,col:MD.soft});md_T(ctx,"the distance between the two rails",x+32,y+94,{w:500,size:28,col:MD.soft});
  const row=(yy,name,mm,f,red)=>{if(f<=0.004)return;ctx.save();ctx.globalAlpha*=ag_in(f,0,0.6);const lx=x+80,G=mm*k,rx=lx+G;
    md_T(ctx,name,x+32,yy-82,{w:700,size:30});
    // the axle and two wheels, over two rails seen end-on
    ctx.fillStyle=rgba([120,132,156],0.9);rr(ctx,lx-6,yy-34,G+12,10,4);ctx.fill();
    for(const cx of[lx,rx]){const inn=cx===lx?1:-1;ctx.fillStyle=rgba([150,162,188],0.97);rr(ctx,cx-15,yy-62,30,62,7);ctx.fill();
      ctx.fillStyle=rgba([112,124,150],0.97);rr(ctx,cx+inn*15-(inn>0?0:8),yy-50,8,58,3);ctx.fill();ctx.fillStyle=rgba([200,210,228],0.9);ctx.fillRect(cx-15,yy-34,30,4);
      ctx.fillStyle=rgba(MV_STEEL,1);rr(ctx,cx-14,yy,28,11,3);ctx.fill();ctx.fillRect(cx-4,yy+11,8,14);rr(ctx,cx-20,yy+25,40,6,2);ctx.fill();}
    // the measure, between the rails' inside edges
    const my=yy+56;ctx.strokeStyle=rgba(MD.ink,0.75);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(lx+14,my);ctx.lineTo(rx-14,my);ctx.stroke();
    for(const [ex,d] of[[lx+14,1],[rx-14,-1]]){ctx.beginPath();ctx.moveTo(ex,my-9);ctx.lineTo(ex,my+9);ctx.stroke();ctx.beginPath();ctx.moveTo(ex,my);ctx.lineTo(ex+d*10,my-5);ctx.moveTo(ex,my);ctx.lineTo(ex+d*10,my+5);ctx.stroke();}
    md_T(ctx,mm.toLocaleString("en-US")+" mm",(lx+rx)/2,my+40,{w:700,size:30,align:"center"});
    if(red>0){const nx=lx+1435*k;ctx.save();ctx.globalAlpha*=red;glow(ctx,(nx+rx)/2,yy-20,70,MD.fail,0.35);ctx.fillStyle=rgba(MD.fail,0.22);ctx.fillRect(nx,yy-62,rx-nx+16,96);
      ctx.strokeStyle=rgba(MD.fail,1);ctx.lineWidth=2.4;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(nx,yy-70);ctx.lineTo(nx,yy+38);ctx.stroke();ctx.setLineDash([]);
      md_T(ctx,"+165 mm",rx+30,yy-22,{w:800,size:30,col:MD.fail});md_T(ctx,"a hand's length",rx+30,yy+16,{w:600,size:28,col:MD.fail});ctx.restore();}
    ctx.restore();};
  row(y+250,"New South Wales",1435,o.nsw==null?1:o.nsw,0);row(y+478,"Victoria",1600,o.vic==null?1:o.vic,o.diff||0);ctx.restore();}

// a year, counting: from y0 to y1 over u (0 to 1), as a tag at the top left of the frame
function mv_year(ctx,text,a,o){o=o||{};if(a<=0.004)return;md_tag(ctx,o.x||96,o.y||100,text,{col:o.col||MD.soft,a,icon:o.icon||"clock"});}
