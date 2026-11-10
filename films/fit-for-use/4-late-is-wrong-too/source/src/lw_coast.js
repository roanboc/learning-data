/* ===== Late is wrong too: the coast, 1970 and 2007 =====
   The opening's places, painted once in the module's look: matte, softly lit, no outlines, the light from the right. One coast seen
   the same way at four moments, so a dissolve between them changes only the light, the water and what was built:
     lw_dusk70  East Pakistan, the evening of 12 November 1970: low islands where the rivers meet the sea, a homestead on its raised
                earth with two thatched houses, palms, paddies, a boat drawn up on the mud; the cloud coming in from the sea
     lw_night70 that night: the sea driven over the island, only the roofs and the palms above it
     lw_day     the same coast by day, from the 1970s on: a bamboo pole by the homestead for the volunteers' flags, and a cyclone
                shelter on its pillars beyond the trees
     lw_dusk07  15 November 2007: the same village at dusk, Sidr's cloud coming in, the shelter's windows lit
   People are small and far, with no faces: villagers, and volunteers in plain cottons. No emblem is drawn, and nothing is borrowed
   from Bengali art. Drawn live over them: the flags (lw_flags), people walking (lw_walker), the volunteer with a megaphone
   (lw_volunteer), rain (lw_rain) and the moving water (lw_water). */

// the four moments' light: the sky from top to horizon, the cloud, the sea, the land, the thatch, the walls, the palms, the paddies' water
const LW_LIGHT={
  dusk70:{sky:[[66,70,90],[132,112,116],[214,160,124]],cloud:[[58,60,72],0.95],sea:[110,108,116],glint:[226,176,132],land:[86,78,58],bank:[110,96,70],
          thatch:[150,118,74],wall:[112,84,62],palm:[52,52,44],frond:[50,64,48],water:[150,128,116],sun:0.25},
  night70:{sky:[[14,18,28],[26,32,44],[44,52,66]],cloud:[[20,24,32],0.9],sea:[30,38,50],glint:[96,110,128],land:[26,30,30],bank:[32,36,36],
          thatch:[52,48,40],wall:[40,36,34],palm:[18,22,22],frond:[20,26,24],water:[34,42,54],sun:0},
  day:   {sky:[[136,170,196],[184,204,214],[232,230,216]],cloud:[[244,242,236],0.55],sea:[150,166,170],glint:[250,248,236],land:[138,124,88],bank:[166,146,104],
          thatch:[196,160,98],wall:[150,112,80],palm:[84,74,58],frond:[86,112,70],water:[196,206,204],sun:1},
  dusk07:{sky:[[58,62,80],[120,106,112],[204,148,112]],cloud:[[54,56,68],1],sea:[104,102,110],glint:[220,164,120],land:[82,74,56],bank:[106,92,66],
          thatch:[146,114,72],wall:[108,82,60],palm:[50,50,42],frond:[48,62,46],water:[146,124,112],sun:0.2}
};
const LW_HORIZON=520;
// where things stand on the coast, the same at every moment
const LW_SPOT={pole:[640,698],shelter:[1386,1716],homestead:[760,1270],boat:[330,660],door:[1004,676]};

function lw_mix(a,b,u){return[lerp(a[0],b[0],u),lerp(a[1],b[1],u),lerp(a[2],b[2],u)];}
// the sky and its cloud, one soft field: the colour falls from the top to the horizon, the cloud bank comes in from the right (from the sea)
function lw_sky(c,L,o){const nz=dq_noise(o.seed||61),s=L.sky,cl=L.cloud,heavy=o.heavy||0;
  dq_field(c,0,0,W,LW_HORIZON+40,4,(px,py,out)=>{const v=py/LW_HORIZON,col=v<0.55?lw_mix(s[0],s[1],v/0.55):lw_mix(s[1],s[2],(v-0.55)/0.45),
      n=nz(px/520,py/210,4),m=nz(px/150+9,py/90,3),side=sstep(200,1700,px)*0.6+0.4,
      d=clamp((n*0.85+m*0.25-0.62+heavy*0.32*side+0.18*(1-v))*2.6,0,1)*cl[1]*(1-0.65*sstep(0.75,1.02,v)),
      lit=1+0.1*sstep(0.35,1,v)*(1-d),k=1-0.18*d*(1-sstep(0,1,m));
    for(let i=0;i<3;i++)out[i]=Math.min(255,lerp(col[i],cl[0][i]*k,d)*lit);});}
// the sea and the far islands at the horizon, with a few level glints
function lw_sea(c,L,o){if(o.only){c.save();c.globalCompositeOperation="destination-over";}const g=c.createLinearGradient(0,LW_HORIZON,0,640);g.addColorStop(0,rgba(lw_mix(L.sea,L.glint,0.25),1));g.addColorStop(1,rgba(L.sea,1));
  c.fillStyle=g;c.fillRect(0,LW_HORIZON,W,130);const r=ag_rnd(o.seed||71);
  c.fillStyle=rgba(L.glint,0.32);for(let i=0;i<60;i++){const y=LW_HORIZON+6+r()*96,w=30+r()*160;c.fillRect(r()*W,y,w*(0.4+(y-LW_HORIZON)/120),1.6);}
  // the far islands: long low strips, a line of trees on each
  for(const [x0,x1,y,hh] of [[1180,1920,546,16],[0,420,552,12],[560,880,548,8]]){c.fillStyle=rgba(ag_dk(L.land,0.25),0.85);c.beginPath();c.moveTo(x0,y+6);
    for(let x=x0;x<=x1;x+=14)c.lineTo(x,y-hh*(0.4+0.6*Math.abs(Math.sin(x*0.031)*Math.sin(x*0.007+1))));c.lineTo(x1,y+6);c.closePath();c.fill();}if(o.only)c.restore();}
// a palm: a tapering trunk with a lean, lit on its right, and a crown of drooping fronds, each a long leaf whose leaflets hang below its
// rib; h tall, lean (px the top sits right of the foot), o.bend (the wind, px: everything leans and the fronds stream that way)
function lw_palm(c,x,y,h,lean,L,o){o=o||{};const bend=o.bend||0,top=[x+lean+bend*0.5,y-h],tr=L.palm,fr=L.frond,r=ag_rnd(o.seed||Math.round(x*3+h));
  ag_taper(c,[x,y],[x+lean*0.15,y-h*0.4],[x+lean*0.7+bend*0.25,y-h*0.78],top,h*0.055,h*0.03,rgba(tr,1));
  c.save();c.globalAlpha=0.35+0.4*L.sun;ag_taper(c,[x+h*0.012,y],[x+lean*0.15+h*0.01,y-h*0.4],[x+lean*0.7+bend*0.25+h*0.008,y-h*0.78],[top[0]+h*0.006,top[1]],h*0.016,h*0.008,rgba(ag_lt(tr,0.35),1));c.restore();
  const n=o.fronds||11;for(let i=0;i<n;i++){const side=i%2?1:-1,k=i/(n-1),a0=lerp(-0.25,1.0,Math.abs(k-0.5)*2)*side,len=h*(0.3+r()*0.1),
      droop=0.45+0.5*Math.abs(k-0.5)*2,dir=[Math.sin(a0+bend*0.004)*1,-Math.cos(a0)],
      end=[top[0]+dir[0]*len+bend*0.8,top[1]+dir[1]*len*0.3+len*droop],ctl=[top[0]+dir[0]*len*0.6+bend*0.4,top[1]-len*(0.25-droop*0.12)],
      dk=(dir[0]+(bend>0?0.4:0))<0,col=lw_mix(fr,ag_lt(fr,0.35),dk?0.05:0.2+0.35*L.sun),
      P=u=>[lerp(lerp(top[0],ctl[0],u),lerp(ctl[0],end[0],u),u),lerp(lerp(top[1],ctl[1],u),lerp(ctl[1],end[1],u),u)],m=24,up=[],lo=[];
    for(let j=0;j<=m;j++){const u=j/m,p=P(u),q=P(Math.min(1,u+0.02)),tx=q[0]-p[0],ty=q[1]-p[1],tl=Math.hypot(tx,ty)||1,nx=ty/tl,ny=-tx/tl,
        w=h*0.07*Math.pow(Math.sin(Math.PI*Math.min(1,u*1.05)),0.7)*(1-0.35*u),notch=1-0.45*Math.abs(Math.sin(u*Math.PI*11+i));
      // the leaflets hang: the leaf is narrow above its rib and deep below it, its lower edge notched where the leaflets part
      up.push([p[0]-nx*w*0.18*(nx<0?1:-1)*0+p[0]*0,p[1]-w*0.2]);lo.push([p[0]+bend*0.04*u*w,p[1]+w*notch]);}
    c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(top[0],top[1]);for(const q of up)c.lineTo(q[0],q[1]);for(let j=lo.length-1;j>=0;j--)c.lineTo(lo[j][0],lo[j][1]);c.closePath();c.fill();
    c.strokeStyle=rgba(ag_dk(fr,0.25),0.6);c.lineWidth=Math.max(1.2,h*0.006);c.beginPath();c.moveTo(top[0],top[1]);c.quadraticCurveTo(ctl[0],ctl[1],end[0],end[1]);c.stroke();}
  c.fillStyle=rgba(ag_dk(tr,0.1),1);c.beginPath();c.arc(top[0],top[1]+h*0.01,h*0.028,0,TAU);c.fill();
  // a few coconuts under the crown, by day
  if(L.sun>0.5){c.fillStyle=rgba(lw_mix([120,104,60],tr,0.3),1);for(let k=0;k<3;k++){c.beginPath();c.arc(top[0]-h*0.02+k*h*0.02,top[1]+h*0.035,h*0.014,0,TAU);c.fill();}}}
// a house of the homestead: mud walls, a dark door, and a two-sloped thatched roof with deep eaves
function lw_house(c,x,y,w,hh,L,o){o=o||{};const roof=hh*0.72,th=L.thatch,wl=L.wall,sun=L.sun;
  ag_soft(c,cc=>cc.rect(x,y-hh,w,hh),wl,ag_lt(wl,0.3),x+w*0.85,y-hh*0.6,w*0.6,rgba(ag_dk(wl,0.6),0.4*(0.3+sun)),10,0.4*sun+0.1);
  c.fillStyle=rgba(ag_dk(wl,0.6),1);if(!o.noDoor)c.fillRect(x+w*0.4,y-hh*0.7,w*0.15,hh*0.7);
  c.fillStyle=rgba(ag_dk(wl,0.25),0.45);c.fillRect(x,y-6,w,6);
  const ov=w*0.12,ex=x-ov,ew=w+ov*2,ry=y-hh+6;
  ag_soft(c,cc=>{cc.moveTo(ex,ry);cc.lineTo(x+w*0.2,ry-roof);cc.lineTo(x+w*0.8,ry-roof);cc.lineTo(ex+ew,ry);cc.quadraticCurveTo(x+w/2,ry+roof*0.1,ex,ry);cc.closePath();},
    th,ag_lt(th,0.32),x+w*0.8,ry-roof*0.6,w*0.7,rgba(ag_dk(th,0.6),0.45),12,0.35*sun+0.15);
  // the thatch's grain, and the ridge
  const r=ag_rnd(Math.round(x*7+y));c.strokeStyle=rgba(ag_dk(th,0.3),0.3);c.lineWidth=1.2;
  for(let i=0;i<w*0.45;i++){const u=r(),px=lerp(ex,ex+ew,u),rel=(px-x)/w,tp=rel<0.2?ry-roof*clamp((px-ex)/(x+w*0.2-ex),0,1):rel>0.8?ry-roof*clamp((ex+ew-px)/(ex+ew-x-w*0.8),0,1):ry-roof;
    c.beginPath();c.moveTo(px,tp+3+r()*6);c.lineTo(px+(px-(x+w/2))*0.03,ry-2-r()*5);c.stroke();}
  c.fillStyle=rgba(ag_dk(th,0.4),0.85);c.fillRect(x+w*0.2,ry-roof-3,w*0.6,6);}
// a haystack: a tall rounded stack of straw round a pole, by the houses
function lw_hay(c,x,y,h,L){const th=L.thatch;ag_soft(c,cc=>{cc.moveTo(x-h*0.32,y);cc.bezierCurveTo(x-h*0.36,y-h*0.5,x-h*0.18,y-h*0.92,x,y-h);cc.bezierCurveTo(x+h*0.18,y-h*0.92,x+h*0.36,y-h*0.5,x+h*0.32,y);cc.closePath();},
  ag_dk(th,0.08),ag_lt(th,0.3),x+h*0.2,y-h*0.6,h*0.6,rgba(ag_dk(th,0.6),0.4),10,0.3*L.sun+0.1);
  c.strokeStyle=rgba(ag_dk(L.palm,0.1),1);c.lineWidth=3;c.beginPath();c.moveTo(x,y-h);c.lineTo(x+2,y-h*1.16);c.stroke();}
// bushes and low trees: soft dark clumps along the island
function lw_bushes(c,list,L,seed){const r=ag_rnd(seed||5);for(const [x,y,w,h] of list){const col=lw_mix(L.frond,L.land,0.35);
  for(let k=0;k<5;k++){const bx=x+(r()-0.5)*w*0.7,by=y-h*0.3-r()*h*0.4,rx=w*(0.22+r()*0.15),ry=h*(0.35+r()*0.2);
    c.fillStyle=rgba(lw_mix(col,ag_lt(col,0.25),r()*0.5*L.sun+(bx>x?0.15:0)),1);c.beginPath();c.ellipse(bx,by,rx,ry,0,0,TAU);c.fill();}}}
// the cyclone shelter: two storeys of whitewashed concrete on pillars, open below so the water can pass, a stair up its side and
// windows; lit (0 to 1) at dusk, when people are inside
function lw_shelter(c,L,o){o=o||{};const [x0,x1]=LW_SPOT.shelter,y=636,top=430,mid=548,conc=lw_mix([216,210,198],L.sky[2],0.3*(1-L.sun)),dk=ag_dk(conc,0.42);
  ag_floorShadow(c,(x0+x1)/2-30,y+2,(x1-x0)*0.6,10,0.4);
  for(const px of [x0+14,x0+96,x0+178,x0+260,x1-28]){ag_soft(c,cc=>cc.rect(px,mid,16,y-mid),ag_dk(conc,0.18),ag_lt(conc,0.15),px+12,mid+30,40,null);}
  c.fillStyle=rgba(ag_dk(conc,0.55),0.5);c.fillRect(x0,mid+10,x1-x0,14);
  ag_soft(c,cc=>cc.rect(x0,top,x1-x0,mid-top),conc,ag_lt(conc,0.3),x1-60,top+40,260,rgba(ag_dk(conc,0.6),0.45),16,0.5*L.sun+0.1);
  c.fillStyle=rgba(dk,0.85);c.fillRect(x0-8,top-12,x1-x0+16,14);c.fillRect(x0-4,mid-6,x1-x0+8,10);
  for(let i=0;i<6;i++){const wx=x0+22+i*50,lit=o.lit||0;c.fillStyle=rgba(lw_mix(dk,[252,212,146],lit*0.9),1);c.fillRect(wx,top+30,28,42);}
  // the stair up its near side, from the path
  c.strokeStyle=rgba(ag_dk(conc,0.25),1);c.lineWidth=7;c.beginPath();c.moveTo(x0-96,y);c.lineTo(x0-6,mid+2);c.stroke();
  c.lineWidth=3;for(let k=1;k<8;k++){const u=k/8;c.beginPath();c.moveTo(lerp(x0-96,x0-6,u)-6,lerp(y,mid+2,u));c.lineTo(lerp(x0-96,x0-6,u)+10,lerp(y,mid+2,u));c.stroke();}}
// the paddies, seen down a gentle slope: fields of water and young rice between low earth banks, the banks running away towards the
// horizon; flooded (1) at night, when the sea lies over them
const LW_VP=[960,470];
function lw_fields(c,L,o){const yTop=700,r=ag_rnd(o.seed||83),rows=[702,714,730,752,782,824,882,962,1080];
  const X=(xb,y)=>LW_VP[0]+(xb-LW_VP[0])*(y-LW_VP[1])/(H-LW_VP[1]),rice=lw_mix(lw_mix(L.frond,L.land,0.3),ag_lt(L.frond,0.22),0.5*L.sun),
    sky=lw_mix(L.water,L.sky[2],0.3);
  c.fillStyle=rgba(L.bank,1);c.fillRect(0,yTop-2,W,H-yTop+2);
  for(let i=0;i+1<rows.length;i++){const y0=rows[i],y1=rows[i+1],u=(y0-yTop)/(H-yTop),bw=1.4+u*8;
    // each row of fields has its own banks across it, so the fields are staggered like real ones, not laid out like tiles
    const xs=[-2600];for(let x=-2600;x<4600;){x+=600+r()*900;xs.push(x);}
    for(let j=0;j+1<xs.length;j++){const a0=X(xs[j],y0),a1=X(xs[j+1],y0),b0=X(xs[j],y1),b1=X(xs[j+1],y1);if(Math.max(a1,b1)<-40||Math.min(a0,b0)>W+40)continue;
      const wet=r()<0.3,col=wet?lw_mix(sky,rice,0.35):lw_mix(rice,lw_mix(rice,L.land,0.4),r()*0.6);
      c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(a0+bw,y0+bw*0.5);c.lineTo(a1-bw,y0+bw*0.5);c.lineTo(b1-bw,y1-bw*0.3);c.lineTo(b0+bw,y1-bw*0.3);c.closePath();c.fill();
      if(wet){c.fillStyle=rgba(L.glint,0.16*(0.4+L.sun));c.fillRect(lerp(a0,a1,0.15+r()*0.3),lerp(y0,y1,0.35+r()*0.3),(a1-a0)*(0.25+r()*0.3),1+u*2.4);}
      else if(!o.flood){c.strokeStyle=rgba(ag_lt(col,0.12),0.6);c.lineWidth=0.7+u*1.6;const nr=Math.max(2,Math.round((y1-y0)/(5+u*13)));c.beginPath();
        for(let q=1;q<nr;q++){const yy=lerp(y0,y1,q/nr),xa=lerp(a0,b0,q/nr),xb=lerp(a1,b1,q/nr),st=5+u*13;for(let xx=xa+st;xx<xb-2;xx+=st+r()*st*0.6){c.moveTo(xx,yy);c.lineTo(xx+(r()-0.5)*2,yy-2-u*8);}}
        c.stroke();}}
    c.fillStyle=rgba(ag_lt(L.bank,0.18),0.35*(0.3+L.sun));c.fillRect(0,y1-bw*0.3,W,Math.max(1,bw*0.22));}
  if(o.flood){c.fillStyle=rgba(L.sea,0.9*o.flood);c.fillRect(0,yTop-4,W,H-yTop+4);}}
// the island's near ground, its bushes, the creek running in from the sea, the raised earth of the homestead, the path to the shelter
function lw_island(c,L,o){const [h0,h1]=LW_SPOT.homestead,nz=dq_noise(97);
  dq_field(c,0,584,W,140,6,(px,py,out)=>{const n=nz(px/160,py/40,3),k=0.9+0.16*n+0.06*sstep(584,700,py)*0;for(let i=0;i<3;i++)out[i]=L.land[i]*k;});
  c.fillStyle=rgba(L.land,1);c.beginPath();c.moveTo(0,598);c.bezierCurveTo(500,590,1100,586,1920,594);c.lineTo(1920,584);c.lineTo(0,584);c.closePath();c.globalCompositeOperation="destination-out";c.fill();c.globalCompositeOperation="source-over";
  lw_sea(c,L,{only:true});
  c.fillStyle=rgba(lw_mix(L.sea,L.water,0.4),1);c.beginPath();c.moveTo(0,604);c.bezierCurveTo(160,606,280,626,310,656);c.bezierCurveTo(260,690,120,698,0,698);c.closePath();c.fill();
  c.fillStyle=rgba(L.glint,0.25);for(let i=0;i<8;i++)c.fillRect(20+i*26,628+i*7,58,1.5);
  lw_bushes(c,[[420,604,120,40],[600,600,90,34],[1330,604,110,34],[1780,606,160,40],[1900,608,90,30]],L,7);
  // the raised earth of the homestead: a flat top, sloping sides, lit on the right
  ag_soft(c,cc=>{cc.moveTo(h0-90,712);cc.bezierCurveTo(h0-30,670,h0,660,h0+40,658);cc.lineTo(h1-30,656);cc.bezierCurveTo(h1+10,660,h1+60,680,h1+120,712);cc.closePath();},
    L.bank,ag_lt(L.bank,0.3),h1,640,420,rgba(ag_dk(L.bank,0.6),0.3),14,0.3*L.sun+0.1);
  if(o.path){c.fillStyle=rgba(ag_lt(L.bank,0.14),1);c.beginPath();c.moveTo(h1+60,690);c.bezierCurveTo(h1+180,668,1250,650,LW_SPOT.shelter[0]-100,640);c.lineTo(LW_SPOT.shelter[0]-84,648);c.bezierCurveTo(1260,660,h1+200,690,h1+110,706);c.closePath();c.fill();}
  // the boat drawn up on the mud by the creek, its mast unstepped beside it
  const [b0,b1]=LW_SPOT.boat;ag_soft(c,cc=>{cc.moveTo(b0,650);cc.bezierCurveTo(b0+60,676,b1-60,676,b1,646);cc.bezierCurveTo(b1-30,664,b0+30,664,b0,650);cc.closePath();},
    ag_dk(L.wall,0.3),ag_lt(L.wall,0.2),b1-40,652,120,null);
  c.strokeStyle=rgba(ag_dk(L.wall,0.45),0.9);c.lineWidth=4;c.beginPath();c.moveTo(b0+40,668);c.lineTo(b1-20,640);c.stroke();}

function lw_paintCoast(c,moment){const L=LW_LIGHT[moment],night=moment==="night70",built=moment==="day"||moment==="dusk07";
  lw_sky(c,L,{heavy:moment==="dusk70"?0.55:moment==="dusk07"?0.75:night?0.9:0,seed:moment==="day"?67:61});lw_sea(c,L,{});
  lw_island(c,L,{path:built});
  for(const [x,h,lean] of [[1290,250,10],[1760,300,-14],[1860,230,6],[90,220,8],[230,270,-6],[520,200,6]])lw_palm(c,x,604,h,lean,L,{bend:night?40:0,fronds:9});
  if(built)lw_shelter(c,L,{lit:moment==="dusk07"?1:0});
  lw_house(c,850,672,170,96,L,{});lw_house(c,1080,674,150,88,L,{});lw_hay(c,1212,676,74,L);
  for(const [x,h,lean] of [[778,330,-18],[1250,360,22],[975,300,8]])lw_palm(c,x,666,h,lean,L,{bend:night?55:0,fronds:12});
  lw_bushes(c,[[700,700,110,46],[1330,704,150,50]],L,11);
  lw_fields(c,L,{flood:night?1:0});
  if(night){// the sea over the island: the water up to the houses' eaves, the land gone under it; only roofs and palms above it
    const g=c.createLinearGradient(0,600,0,H);g.addColorStop(0,rgba(lw_mix(L.sea,L.glint,0.2),0.97));g.addColorStop(1,rgba(ag_dk(L.sea,0.3),1));c.fillStyle=g;
    const r=ag_rnd(97);c.beginPath();c.moveTo(0,H);c.lineTo(0,612);for(let x=0;x<=W+30;x+=30)c.lineTo(x,606+Math.sin(x*0.021)*4+Math.sin(x*0.063+1)*3+r()*3);c.lineTo(W,H);c.closePath();c.fill();
    for(let i=0;i<70;i++){const y=616+r()*460,v=(y-616)/460,w=80+r()*260*(0.4+v);c.fillStyle=rgba(L.glint,0.08+0.08*r());c.beginPath();c.ellipse(r()*W,y,w/2,0.8+v*2.6,0,0,TAU);c.fill();}}
  // the evening's last light, low on the right; the dark gathered at the edges
  if(L.sun<1){const g=c.createRadialGradient(1700,520,40,1700,520,1100);g.addColorStop(0,rgba(L.glint,night?0.05:0.18));g.addColorStop(1,rgba(L.glint,0));c.fillStyle=g;c.fillRect(0,0,W,H);}
  const v=c.createRadialGradient(960,540,500,960,540,1250);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(10,10,16,"+(night?0.55:0.22)+")");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.lw_dusk70=c=>lw_paintCoast(c,"dusk70");
AG_PLACES.lw_night70=c=>lw_paintCoast(c,"night70");
AG_PLACES.lw_day=c=>lw_paintCoast(c,"day");
AG_PLACES.lw_dusk07=c=>lw_paintCoast(c,"dusk07");
// the coast at its four moments is one place, seen at different times: the camera glides on between them
AG_ROOMS.lw_night70="lw_dusk70";AG_ROOMS.lw_day="lw_dusk70";AG_ROOMS.lw_dusk07="lw_dusk70";

/* ---------------------------------------------------------------- drawn live on the coast */
// the volunteers' flags on the bamboo pole by the homestead: n flags up (0 to 3; a part flag is still rising), waving in the wind (w)
function lw_flags(ctx,n,t,o){o=o||{};const [px,py]=LW_SPOT.pole,top=py-380,w=o.wind==null?1:o.wind,a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ag_taper(ctx,[px,py],[px+1,py-130],[px+3,py-260],[px+4,top],9,5,rgba(o.dark?[60,52,40]:[176,150,104],1));
  ctx.fillStyle=rgba([230,214,176],0.5);for(let k=1;k<6;k++)ctx.fillRect(px-4,py-k*66,8,3);
  for(let i=0;i<3;i++){const up=clamp(n-i,0,1);if(up<=0)continue;const fy=lerp(py-40,top+14+i*64,ag_sine(up)),fw=66,fh=36,col=DQ.stop,ph=t*3.1+i*0.9;
    ctx.fillStyle=rgba(o.dark?ag_dk(col,0.25):col,1);ctx.beginPath();ctx.moveTo(px+4,fy);
    for(let k=0;k<=10;k++){const u=k/10;ctx.lineTo(px+4+u*fw,fy+Math.sin(ph+u*3)*6*w*u);}
    for(let k=10;k>=0;k--){const u=k/10;ctx.lineTo(px+4+u*fw,fy+fh*(1-0.12*u)+Math.sin(ph+u*3+0.4)*6*w*u);}ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_dk(col,0.35),0.35);ctx.fillRect(px+4,fy,10,fh);}
  ctx.restore();}
// a person far off, seen whole and small, with no face: h tall from the feet to the crown, walking (o.step: strides, 0 to 1 each) or
// standing. o.kind: "man" (a shirt over a lungi, the long cloth wrapped from the waist), "woman" (a sari, its end drawn over the head),
// "child"; o.top and o.cloth their colours (plain, muted cottons); o.load a bundle carried on the head; o.flip faces left. Lit from the
// right like everything on the coast; o.light (0 to 1) how much
function lw_walker(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);if(o.flip)ctx.scale(-1,1);
  const k=o.kind||"man",kid=k==="child",s=h,ph=(o.step||0)*TAU,sw=o.walk?Math.sin(ph):0,sk=o.skin||[118,80,58],top=o.top||[214,206,186],cl=o.cloth||[120,104,96],
    lt=o.light==null?0.5:o.light,hr=s*(kid?0.085:0.064),hy=-s+hr*1.05,sh=-s*(kid?0.8:0.835),wa=-s*0.52,F=(col,fn,hi)=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();fn();ctx.fill();
      if(hi&&lt>0){ctx.save();ctx.clip();ctx.fillStyle=rgba(ag_lt(col,0.35),0.55*lt);ctx.fillRect(s*0.02,-s*1.2,s*0.2,s*1.2);ctx.restore();}};
  // legs and feet under the hem, a step apart while walking
  ctx.strokeStyle=rgba(ag_dk(sk,0.15),1);ctx.lineCap="round";ctx.lineWidth=s*0.036;
  ctx.beginPath();ctx.moveTo(-s*0.02,-s*0.14);ctx.lineTo(-s*0.03+sw*s*0.07,0);ctx.moveTo(s*0.02,-s*0.14);ctx.lineTo(s*0.03-sw*s*0.07,0);ctx.stroke();
  // the far arm, behind the body
  const arm=(side,ang,col)=>{const ax=side*s*0.095,ay=sh+s*0.02,ex=ax+Math.sin(ang)*s*0.17,ey=ay+Math.cos(ang)*s*0.17,hx=ex+Math.sin(ang*1.3)*s*0.15,hy2=ey+Math.cos(ang*1.3)*s*0.15;
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.046;ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(ex,ey,hx,hy2);ctx.stroke();
    ctx.strokeStyle=rgba(ag_dk(sk,0.1),1);ctx.lineWidth=s*0.034;ctx.beginPath();ctx.moveTo(lerp(ex,hx,0.55),lerp(ey,hy2,0.55));ctx.lineTo(hx,hy2);ctx.stroke();};
  arm(-1,-0.08-sw*0.25,ag_dk(k==="woman"?cl:top,0.2));
  if(k==="woman"){// the sari: from the shoulders to the feet, falling a little wider, its end over the head and down the back
    F(cl,()=>{ctx.moveTo(-s*0.1,sh);ctx.quadraticCurveTo(-s*0.13,-s*0.45,-s*0.13+sw*s*0.015,-s*0.03);ctx.lineTo(s*0.13+sw*s*0.015,-s*0.03);ctx.quadraticCurveTo(s*0.12,-s*0.45,s*0.1,sh);ctx.closePath();},true);
    ctx.fillStyle=rgba(ag_dk(cl,0.25),0.6);ctx.fillRect(-s*0.13,-s*0.07,s*0.26,s*0.035);}
  else{// a shirt to the hips, over a lungi (a man) or shorts (a child)
    F(top,()=>{ctx.moveTo(-s*0.1,sh);ctx.quadraticCurveTo(-s*0.115,-s*0.62,-s*0.105,wa+s*0.04);ctx.lineTo(s*0.105,wa+s*0.04);ctx.quadraticCurveTo(s*0.115,-s*0.62,s*0.1,sh);ctx.closePath();},true);
    if(kid)F(cl,()=>{ctx.rect(-s*0.1,wa+s*0.02,s*0.2,s*0.16);},false);
    else{F(cl,()=>{ctx.moveTo(-s*0.098,wa+s*0.02);ctx.lineTo(-s*0.11+sw*s*0.015,-s*0.1);ctx.lineTo(s*0.11+sw*s*0.015,-s*0.1);ctx.lineTo(s*0.098,wa+s*0.02);ctx.closePath();},true);
      ctx.strokeStyle=rgba(ag_dk(cl,0.3),0.45);ctx.lineWidth=s*0.008;for(const u of [0.25,0.5,0.75]){ctx.beginPath();ctx.moveTo(-s*0.1,lerp(wa,-s*0.1,u));ctx.lineTo(s*0.1,lerp(wa,-s*0.1,u));ctx.stroke();}}}
  // the neck and head; hair, or the sari's end over it
  ctx.fillStyle=rgba(ag_dk(sk,0.05),1);ctx.fillRect(-s*0.022,sh-s*0.05,s*0.044,s*0.06);
  F(sk,()=>{ctx.arc(0,hy,hr,0,TAU);},true);
  if(k==="woman")F(cl,()=>{ctx.arc(0,hy,hr*1.18,Math.PI*0.92,Math.PI*2.08);ctx.lineTo(-s*0.03+hr,sh+s*0.06);ctx.lineTo(-hr*1.25,sh+s*0.1);ctx.closePath();},true);
  else F([28,24,22],()=>{ctx.arc(0,hy,hr*1.02,Math.PI*1.02,Math.PI*1.98);ctx.quadraticCurveTo(-hr*0.2,hy-hr*0.2,-hr*1.02,hy);ctx.closePath();},false);
  if(o.load)F(o.load,()=>{ctx.ellipse(0,hy-hr*1.6,hr*1.5,hr*0.75,0,0,TAU);},true);
  // the near arm, in front: swinging while walking, or o.raise (0 to 1) lifting a megaphone to the mouth
  if(o.raise){const u=o.raise,ax=s*0.095,ay=sh+s*0.02,ex=ax+s*lerp(0.04,0.13,u),ey=ay+s*lerp(0.17,0.08,u),hx=ex+s*lerp(0.02,-0.03,u),hy2=ey-s*lerp(-0.12,0.13,u);
    ctx.strokeStyle=rgba(ag_dk(k==="woman"?cl:top,0.05),1);ctx.lineWidth=s*0.046;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ex,ey);ctx.stroke();
    ctx.strokeStyle=rgba(sk,1);ctx.lineWidth=s*0.036;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(hx,hy2);ctx.stroke();
    // the megaphone: a pale cone from the mouth, its bell forward; its call, soft arcs, while it sounds
    const mx=hr*0.8,my=hy+hr*0.35,L=s*0.2*u,bw=s*0.075*u;ctx.fillStyle=rgba([232,228,218],1);ctx.beginPath();ctx.moveTo(mx,my-bw*0.25);ctx.lineTo(mx+L,my-bw);ctx.lineTo(mx+L,my+bw);ctx.lineTo(mx,my+bw*0.25);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba([160,154,146],1);ctx.beginPath();ctx.ellipse(mx+L,my,s*0.012,bw,0,0,TAU);ctx.fill();
    if(o.call){ctx.strokeStyle=rgba([255,246,226],0.6*o.call);ctx.lineWidth=s*0.012;for(let q=1;q<=3;q++){ctx.beginPath();ctx.arc(mx+L,my,q*s*0.06,-0.55,0.55);ctx.stroke();}}}
  else arm(1,0.08+sw*0.25,k==="woman"?cl:top);
  ctx.restore();}
// a volunteer: a man of the village in a plain shirt and lungi, a cotton cloth over his shoulder, calling through a megaphone
function lw_volunteer(ctx,x,y,h,o){o=o||{};lw_walker(ctx,x,y,h,Object.assign({kind:"man",top:[222,214,194],cloth:[96,98,92],skin:[110,74,52],raise:1},o));
  const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);if(o.flip)ctx.scale(-1,1);const s=h;
  // the cloth over his far shoulder: woven in checks of two plain colours
  ctx.fillStyle=rgba([170,150,120],1);ctx.beginPath();ctx.moveTo(-s*0.1,-s*0.83);ctx.lineTo(-s*0.02,-s*0.84);ctx.lineTo(-s*0.06,-s*0.6);ctx.lineTo(-s*0.11,-s*0.62);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([120,96,80],0.6);for(const u of [0.3,0.6])ctx.fillRect(-s*0.1,lerp(-s*0.83,-s*0.6,u),s*0.07,s*0.012);
  ctx.restore();}
// rain, soft and slanting, in the frame's own coordinates; a at most about 0.4
function lw_rain(ctx,t,a){if(a<=0.004)return;const r=ag_rnd(131);ctx.save();ctx.strokeStyle="rgba(200,210,224,"+a+")";ctx.lineWidth=1.3;ctx.beginPath();
  for(let i=0;i<150;i++){const x0=r()*2400-200,sp=900+r()*500,y=((r()*1200+t*sp)%1300)-120,x=x0-(y+120)*0.35;ctx.moveTo(x,y);ctx.lineTo(x-14,y+40);}ctx.stroke();ctx.restore();}
// the surge's moving water: long low crests running in from the sea, over the night's painted water
function lw_water(ctx,t,a){if(a<=0.004)return;const r=ag_rnd(151);ctx.save();ctx.lineCap="round";
  for(let i=0;i<34;i++){const y=630+i*14+i*i*0.55,sp=40+r()*30,x=((r()*2200+t*sp*(1+i*0.05))%2400)-240,w=120+r()*260+i*12;
    ctx.strokeStyle="rgba(150,166,186,"+(a*(0.16+0.1*r()))+")";ctx.lineWidth=1.4+i*0.08;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+w/2,y-3-i*0.1,x+w,y);ctx.stroke();}
  ctx.restore();}
