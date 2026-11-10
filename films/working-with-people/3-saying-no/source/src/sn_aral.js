/* ===== Saying no, and what instead: the opening, the Aral Sea, 1960 to 2014 =====
   The film's own pictures for its opening story (prefix sn_), drawn in the module's matte language and lit from the right like the
   team's rooms. A map of the sea and its two rivers, made from a depth of water at every point (traced from no image), so the sea
   shrinks as its level falls, splits where its strait is shallow, and its northern part fills again behind the dam; and the old
   harbour of a fishing town, with a boat left on the dry seabed. Nothing is borrowed from the region's cultures for decoration: the
   places are plain land, water, a quay, a boat and a dam, and the fisher wears plain work clothes of the 1990s.
     snMap                   the land round the sea: the desert, the plateau to the west, the dry seabed where the 1960 sea was, and
                             the 1960 shore, faint
     sn_sea(ctx, o)          the water: o.dropN and o.dropS, the metres its level has fallen since 1960 north and south of the strait;
                             o.dam (0 to 1) the dam drawn across the strait, and the line between the two levels with it
     sn_rivers(ctx, o)       the two rivers: o.flow (0 to 1, how much of their water still reaches the sea), o.fields (0 to 1: the
                             farms along them come in), o.syr (0 to 1: the Syr Darya's water lit as it runs to the north)
     sn_drop(yr)             the metres the level has fallen by a year from 1960: about 20 by 2004, and 27 in the south by 2014
     snHarbour               the old harbour at Aralsk: its quay and cranes, the town behind, the dry seabed, a fishing boat on it
     sn_dust(ctx, t, o)      salt and dust blowing across the seabed (o.a)
     SN_FISHER               a fisher of Aralsk, in the 1990s
   Colour keeps the module's meaning: amber the problem (the sea lost, the jobs, the dust), green what got better, blue the plan (the
   dam and the part to save); the water, the land and the fisher wear none of them. The water is a grey-green slate, never a plan's
   blue. Sizes are in the 1920 x 1080 frame. */

const SN_K={sand0:[224,206,170],sand1:[206,186,150],plateau:[196,176,140],scarp:[150,128,98],salt:[224,214,192],shore:[150,132,104],
  shallow:[140,166,162],deep:[100,132,138],damp:[184,170,140],river:[112,140,138],field:[[172,166,124],[158,154,114],[184,176,136],[166,160,126]],
  canal:[120,140,132],dam:[164,146,116],damTop:[204,190,160]};

/* ---------------------------------------------------------------- the sea's depth, metres below its 1960 level */
// the map's sea, from a few soft basins, laid out as the real sea was: the small northern sea, with a bay to the north-west and the
// long bay running up to Aralsk; below it, Kokaral island, with a deep strait to its west (where the dam stands) and a shallow one to
// its east; and the large southern sea, taller than wide, its western shore straight under the plateau's cliff with a deep trough
// along it, its broad east shallow and breaking into small islands, two islands in it, and the delta of the southern river. Where the
// depth is more than the metres fallen, there is water
const SN_MAP={aralsk:[1206,108],dam:[[868,342],[984,342]],damY:342,syrMouth:[1216,224],amuMouth:[1050,868]};
// a soft basin: 1 at its middle, 0 at its rim, and below 0 beyond it, falling away with the distance, so the land rises from the shore
function sn_bump(u,v,p){const r=u*u+v*v;return r>=1?-(Math.sqrt(r)-1):Math.pow(1-r,p||1);}
const sn_bump0=(u,v,p)=>Math.max(0,sn_bump(u,v,p));
function sn_rot(x,y,cx,cy,an,rx,ry){const c=Math.cos(an),s=Math.sin(an),dx=x-cx,dy=y-cy;return[(dx*c+dy*s)/rx,(-dx*s+dy*c)/ry];}
function sn_nz(x,y){return 0.5*Math.sin(x/97+1.3)*Math.cos(y/83-0.7)+0.3*Math.sin((x+y)/41+2.1)+0.2*Math.cos((x-y)/29+0.4);}
// value noise in octaves (-1 to 1), for shores that wander and the small islands of a shallow coast
function sn_hash(i,j){let h=(i*374761393+j*668265263)>>>0;h=((h^(h>>>13))*1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296;}
function sn_vn(x,y){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);
  return lerp(lerp(sn_hash(i,j),sn_hash(i+1,j),ux),lerp(sn_hash(i,j+1),sn_hash(i+1,j+1),ux),uy)*2-1;}
function sn_fbm(x,y){return 0.5*sn_vn(x/70,y/70)+0.3*sn_vn(x/29+17,y/29+5)+0.2*sn_vn(x/12+3,y/12+11);}
// the plateau's cliff, where the land drops to the western shore: its x on each row
const sn_cliff=y=>560+52*Math.sin(clamp(y/1080,0,1)*Math.PI*0.95+0.05)+5*Math.sin(y/61+0.8)+3*Math.sin(y/23+2.1);
function sn_depth(x,y){const n=sn_nz(x,y);
  // the small northern sea, its bay to the north-west, and the bay up to Aralsk: deep where it opens from the sea, shallow at its
  // head, so a sea a few metres higher reaches a long way up it
  const [nu,nv]=sn_rot(x,y,1000,232,-0.16,205+16*n,86+9*n),north=24*sn_bump(nu,nv,0.75)-3;
  const [wu,wv]=sn_rot(x,y,846,206,-0.38,64+6*n,34+5*n),nw=12*sn_bump(wu,wv,0.8)-2;
  const [bu,bv]=sn_rot(x,y,1140,157,-0.61,86+6*n,28+4*n),al=lerp(17,5,clamp((bu+1)/2,0,1))*(bu>0.92?1-(bu-0.92)/0.16:1)*(bu<-1?1+(bu+1):1);
  const bay=Math.abs(bv)<1?al*Math.pow(1-bv*bv,0.6)-1.4:-1.4-6*(Math.abs(bv)-1);
  // the straits round Kokaral island: the deep one to its west, running south from the northern sea, where the dam stands, the last
  // to run dry, about 1990; and a broad shallow one to its east, dry by the 1970s
  const strait=14.6*sn_bump((x-926)/55,(y-330)/75,0.9)-1.4;
  const shelf=8*sn_bump((x-1030)/170,(y-332)/46,0.8)-1.4,koka=17*sn_bump0((x-1058)/(80+6*n),(y-336)/(24+3*n),1);
  // the large southern sea: a broad basin, shallow and flat, whose east breaks into small islands as it dries, and a shoal along its
  // east coast, the first to run dry; a deep trough along
  // the west; the cliff that keeps the western shore straight; a low ridge and two islands, Vozrozhdeniya in the middle and
  // Barsakelmes in the north; and the delta of the Amu Darya, pushing the southern shore in
  const broad=25*sn_bump((x-922)/(272+18*n),(y-632)/(288+14*n),0.7)-3,shoal=7*sn_bump((x-1120)/(160+12*n),(y-612)/(250+12*n),0.8)-2;
  const trough=64*sn_bump((x-702)/(104+8*n),(y-612)/(274+10*n),0.9)-3;
  const cliff=2.4*(x-sn_cliff(y)-14)-1;
  const [iu,iv]=sn_rot(x,y,850,640,0.3,30+4*n,56+6*n),voz=30*sn_bump0(iu,iv,1);
  const [ku,kv]=sn_rot(x,y,1010,452,-0.3,44+4*n,22+3*n),bar=26*sn_bump0(ku,kv,1);
  const ridge=9*sn_bump0((x-805)/38,(y-620)/322,1),delta=12*sn_bump0((x-1062)/92,(y-906)/58,1);
  const south=Math.min(Math.max(broad,trough,shoal),cliff)-voz-bar-ridge-delta;
  const base=Math.max(north,nw,bay,strait,shelf-koka,south);
  // the shores wander, more on the shallow east than under the western cliff, and a shallow coast breaks into small islands; far
  // from the sea, the land stays land
  const f=sn_fbm(x,y),east=clamp((x-780)/320,0,1);
  return base+f*(1.2+4.2*east)*sstep(-6,-1,base);}
// the depth on a grid of 2 px cells, made once, over the box the 1960 sea fills
const SN_G={cell:2,x0:510,y0:40,w:430,h:440,d:null};
function sn_grid(){if(SN_G.d)return SN_G.d;const g=new Float32Array(SN_G.w*SN_G.h);
  for(let j=0;j<SN_G.h;j++)for(let i=0;i<SN_G.w;i++)g[j*SN_G.w+i]=sn_depth(SN_G.x0+(i+0.5)*SN_G.cell,SN_G.y0+(j+0.5)*SN_G.cell);return SN_G.d=g;}
// the metres fallen by a year: about 20 by 2004 (the World Bank's "almost 20 meters"), about 27 by 2014, when the southern sea's east
// was gone; the two parts came apart when the strait ran dry, about 1990
const sn_drop=yr=>yr<=1960?0:yr<=2004?20*(yr-1960)/44:20+7*Math.min(1,(yr-2004)/10);
// the light on the water, from the window's side: a little darker at the west, a little warmer at the east, column by column
const SN_LIT=(()=>{const L=new Float32Array(SN_G.w);for(let i=0;i<SN_G.w;i++)L[i]=lerp(0.9,1.06,clamp((SN_G.x0+i*SN_G.cell-560)/760,0,1));return L;})();

/* ---------------------------------------------------------------- the land round the sea, painted once */
function sn_paintMap(c){let g=c.createLinearGradient(0,0,W*0.4,H);g.addColorStop(0,rgba(SN_K.sand0,1));g.addColorStop(1,rgba(SN_K.sand1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the plateau to the west, and its edge, a low cliff along the sea's western shore
  c.fillStyle=rgba(SN_K.plateau,1);c.beginPath();c.moveTo(0,0);for(let y=0;y<=H;y+=12)c.lineTo(sn_cliff(y)-6,y);c.lineTo(0,H);c.closePath();c.fill();
  c.strokeStyle=rgba(SN_K.scarp,0.55);c.lineWidth=5;c.beginPath();for(let y=0;y<=H;y+=12)y?c.lineTo(sn_cliff(y)-6,y):c.moveTo(sn_cliff(0)-6,0);c.stroke();
  // the desert's grain: dunes as soft, short strokes, lit from the right
  const R=ag_rnd(11);for(let k=0;k<900;k++){const x=R()*W,y=R()*H,l=10+R()*26;c.strokeStyle=R()<0.5?"rgba(255,246,226,0.16)":"rgba(120,96,70,0.10)";c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l/2,y-4,x+l,y);c.stroke();}
  // the dry seabed, pale with salt, wherever the 1960 sea was; and the 1960 shore, a fine darker line
  const G=sn_grid(),k=SN_G.cell,img=c.createImageData(SN_G.w,SN_G.h),d=img.data;
  for(let j=0;j<SN_G.h;j++)for(let i=0;i<SN_G.w;i++){const z=G[j*SN_G.w+i],o=(j*SN_G.w+i)*4,a=sstep(-0.4,0.4,z),e=Math.max(0,1-Math.abs(z)/0.5);
    const sp=((i*73856093^j*19349663)>>>0)%97/97;const col=mix(SN_K.salt,[210,198,172],0.22*sp+0.4*clamp(1-z/18,0,1));
    d[o]=lerp(col[0],SN_K.shore[0],e*0.8);d[o+1]=lerp(col[1],SN_K.shore[1],e*0.8);d[o+2]=lerp(col[2],SN_K.shore[2],e*0.8);d[o+3]=255*Math.max(a,e*0.7);}
  const [bc,bx]=ag_buf("snSalt",SN_G.w,SN_G.h);bx.putImageData(img,0,0);c.save();c.imageSmoothingEnabled=true;c.drawImage(bc,SN_G.x0,SN_G.y0,SN_G.w*k,SN_G.h*k);c.restore();
  // the town of Aralsk, at the head of its bay: a few low blocks
  const [ax,ay]=SN_MAP.aralsk;c.fillStyle=rgba([150,134,112],1);for(const [dx,dy,w,h] of [[0,0,14,10],[16,-6,12,12],[-14,4,12,9],[6,12,16,9],[-4,-12,10,8]])c.fillRect(ax+dx,ay+dy,w,h);
  // the frame's own vignette, warm at the centre
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.snMap=c=>sn_paintMap(c);

/* ---------------------------------------------------------------- the water, drawn live from its level */
function sn_sea(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const G=sn_grid(),k=SN_G.cell,dN=o.dropN||0,dS=o.dropS==null?dN:o.dropS;
  const [bc,bx]=ag_buf("snSea",SN_G.w,SN_G.h),img=SN_G.img||(SN_G.img=bx.createImageData(SN_G.w,SN_G.h)),d=img.data,jy=Math.round((SN_MAP.damY-SN_G.y0)/k);
  for(let j=0;j<SN_G.h;j++){const dr=j<jy?dN:dS;for(let i=0;i<SN_G.w;i++){const z=G[j*SN_G.w+i]-dr,o4=(j*SN_G.w+i)*4;if(z<-1.4){d[o4+3]=0;continue;}
    const w=sstep(-0.3,0.3,z),u=Math.pow(clamp(z/70,0,1),0.8),dm=(1-w)*sstep(-1.4,-0.2,z),li=SN_LIT[i];
    d[o4]=lerp(SN_K.shallow[0],SN_K.deep[0],u)*w*li+SN_K.damp[0]*(1-w);d[o4+1]=lerp(SN_K.shallow[1],SN_K.deep[1],u)*w*li+SN_K.damp[1]*(1-w);
    d[o4+2]=lerp(SN_K.shallow[2],SN_K.deep[2],u)*w*li+SN_K.damp[2]*(1-w);d[o4+3]=255*Math.max(w,dm*0.5);}}
  bx.putImageData(img,0,0);ctx.save();ctx.globalAlpha*=a;ctx.imageSmoothingEnabled=true;ctx.drawImage(bc,SN_G.x0,SN_G.y0,SN_G.w*k,SN_G.h*k);ctx.restore();
  // the dam: an embankment of earth and stone across the strait, its crest pale, a sluice in it
  const dm=clamp(o.dam||0,0,1);if(dm>0.004){const [p0,p1]=SN_MAP.dam,x1=lerp(p0[0],p1[0],ag_sine(dm));ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
    ctx.strokeStyle="rgba(60,48,40,0.35)";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(p0[0]-3,p0[1]+4);ctx.lineTo(x1-3,p1[1]+4);ctx.stroke();
    ctx.strokeStyle=rgba(SN_K.dam,1);ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(x1,p1[1]);ctx.stroke();
    ctx.strokeStyle=rgba(SN_K.damTop,1);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(p0[0],p0[1]-2);ctx.lineTo(x1,p1[1]-2);ctx.stroke();
    if(dm>0.75){ctx.globalAlpha*=sstep(0.75,1,dm);ctx.fillStyle=rgba([96,90,86],1);ctx.fillRect(946,336,12,12);ctx.fillStyle=rgba(SN_K.damTop,1);ctx.fillRect(948,338,8,2);ctx.fillRect(948,343,8,2);}
    ctx.restore();}}

/* ---------------------------------------------------------------- the two rivers, and the farms along them */
const SN_SYR=[[1950,452],[1820,440],[1700,416],[1590,372],[1480,352],[1390,318],[1300,262],[1216,224]];
const SN_AMU=[[1640,1110],[1520,1030],[1400,986],[1290,950],[1170,918],[1090,890],[1050,868]];
function sn_path(ctx,P,u){u=clamp(u==null?1:u,0,1);const n=P.length-1,m=u*n;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);
  for(let i=1;i<=Math.ceil(m);i++){const f=Math.min(1,m-(i-1)),a=P[i-1],b=P[i];const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    if(f>=1)ctx.quadraticCurveTo(a[0],a[1],i===n?b[0]:mx,i===n?b[1]:my);else ctx.lineTo(lerp(a[0],b[0],f),lerp(a[1],b[1],f));}}
// the farms: a quilt of plots in strips along each river's last stretch, side by side as irrigated land is, each a little different
const SN_FIELDS=(()=>{const R=ag_rnd(29),out=[];
  for(const [P,i0,i1,rows] of [[SN_SYR,0,5,3],[SN_AMU,0,4,2]])for(let i=i0;i<i1;i++){const a=P[i],b=P[i+1],an=Math.atan2(b[1]-a[1],b[0]-a[0]),L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/44));
    for(let k=0;k<n;k++)for(let r=-rows;r<=rows;r++){if(r===0||R()<0.12)continue;const f=(k+0.5)/n,off=(r>0?r-0.5:r+0.5)*34+(r>0?10:-10);
      out.push({x:lerp(a[0],b[0],f)-Math.sin(an)*off,y:lerp(a[1],b[1],f)+Math.cos(an)*off,w:L/n-4,h:30,an,col:SN_K.field[(R()*4)|0],d:clamp(Math.abs(r)/(rows+1)*0.6+R()*0.4,0,1)});}}
  return out;})();
function sn_rivers(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const fl=clamp(o.flow==null?1:o.flow,0,1),fd=clamp(o.fields||0,0,1);ctx.save();ctx.globalAlpha*=a;
  if(fd>0.004){for(const p of SN_FIELDS){const u=clamp(fd*1.6-p.d*0.6,0,1);if(u<=0)continue;ctx.save();ctx.globalAlpha*=ag_sine(u);ctx.translate(p.x,p.y);ctx.rotate(p.an);
      ctx.fillStyle=rgba(p.col,1);ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.strokeStyle="rgba(110,96,70,0.3)";ctx.lineWidth=1.5;ctx.strokeRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}}
  ctx.lineCap="round";ctx.lineJoin="round";
  for(const [P,syr] of [[SN_SYR,true],[SN_AMU,false]]){const w=lerp(2.5,7,fl)*(syr?1+0.5*(o.syr||0):1);
    ctx.strokeStyle=rgba(mix(SN_K.sand1,SN_K.river,0.6),0.6);ctx.lineWidth=w+6;sn_path(ctx,P);ctx.stroke();
    ctx.strokeStyle=rgba(SN_K.river,1);ctx.lineWidth=w;sn_path(ctx,P);ctx.stroke();}
  // the Syr Darya's water, running north into the sea once the works upstream let more of it arrive: soft dashes moving along it
  const sy=clamp(o.syr||0,0,1);if(sy>0.004){ctx.save();ctx.globalAlpha*=sy;ctx.setLineDash([18,26]);ctx.lineDashOffset=-(o.t||0)*60;ctx.strokeStyle="rgba(236,244,240,0.85)";ctx.lineWidth=3;sn_path(ctx,SN_SYR);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the old harbour at Aralsk, painted once */
const SN_H={hz:600};
function sn_paintHarbour(c){const hz=SN_H.hz;let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(198,194,186)");g.addColorStop(1,"rgb(226,216,198)");c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the town far behind, on the left: low blocks and a water tower, pale in the haze
  c.fillStyle="rgba(150,140,128,0.55)";const R=ag_rnd(17);let x=0;while(x<760){const w=40+R()*80,h=18+R()*34;c.fillRect(x,hz-30-h,w,h+30);x+=w+6+R()*20;}
  c.fillRect(300,hz-110,10,60);c.fillRect(280,hz-130,50,26);
  // the seabed, flat to the horizon, pale with salt and cracked
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(222,212,190)");g.addColorStop(1,"rgb(200,184,154)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.strokeStyle="rgba(120,100,76,0.22)";c.lineWidth=2;for(let k=0;k<260;k++){const y=hz+12+Math.pow(R(),1.6)*(H-hz),x0=R()*W,s=0.3+(y-hz)/(H-hz)*1.4;
    c.beginPath();c.moveTo(x0,y);c.lineTo(x0+(20+R()*50)*s,y+(R()-0.5)*8*s);c.lineTo(x0+(30+R()*60)*s,y+(R()-0.2)*14*s);c.stroke();}
  // the quay at the left: a concrete wall where boats once tied up, its face in shade, and two cranes on it
  c.fillStyle="rgb(176,168,156)";c.beginPath();c.moveTo(0,hz-24);c.lineTo(560,hz-14);c.lineTo(600,hz+28);c.lineTo(0,hz+52);c.closePath();c.fill();
  c.fillStyle="rgb(138,130,122)";c.beginPath();c.moveTo(0,hz+52);c.lineTo(600,hz+28);c.lineTo(600,hz+96);c.lineTo(0,hz+150);c.closePath();c.fill();
  c.fillStyle="rgba(60,50,44,0.25)";for(let k=0;k<9;k++)c.fillRect(30+k*64,hz+60-k*2.4,6,70-k*4);
  for(const [cx,h] of [[150,250],[400,210]]){c.strokeStyle="rgba(96,84,78,0.85)";c.lineWidth=7;c.beginPath();c.moveTo(cx-30,hz-20);c.lineTo(cx,hz-20-h);c.lineTo(cx+30,hz-20);c.stroke();
    c.lineWidth=4;for(let k=1;k<6;k++){const y=hz-20-h*k/6,dx=30*(1-k/6);c.beginPath();c.moveTo(cx-dx,y);c.lineTo(cx+dx,y-h/12);c.stroke();}
    c.lineWidth=6;c.beginPath();c.moveTo(cx,hz-20-h);c.lineTo(cx+150,hz-h+10);c.stroke();c.lineWidth=2;c.beginPath();c.moveTo(cx+150,hz-h+10);c.lineTo(cx+150,hz-h+90);c.stroke();}
  // the boat: a small fishing trawler of the 1960s, its hull resting on the seabed and leaning a little, rust on its paint
  c.save();c.translate(1330,690);c.rotate(-0.05);
  c.fillStyle="rgba(70,56,46,0.28)";c.beginPath();c.ellipse(-60,74,430,34,0,0,TAU);c.fill();
  c.fillStyle="rgb(112,70,58)";c.beginPath();c.moveTo(-420,-60);c.bezierCurveTo(-380,-64,-200,-56,0,-50);c.lineTo(330,-58);c.bezierCurveTo(380,-80,420,-120,436,-140);
  c.bezierCurveTo(424,-60,396,10,340,50);c.bezierCurveTo(200,70,-200,72,-360,52);c.bezierCurveTo(-410,30,-430,-20,-420,-60);c.closePath();c.fill();
  g=c.createLinearGradient(0,-140,0,72);g.addColorStop(0,"rgba(255,236,210,0.16)");g.addColorStop(1,"rgba(40,30,26,0.35)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(150,96,70,0.6)";c.lineWidth=2;for(let k=0;k<14;k++){const x0=-380+k*54;c.beginPath();c.moveTo(x0,-50);c.lineTo(x0+6+(k%3)*4,10+(k%4)*10);c.stroke();}
  c.fillStyle="rgb(204,198,186)";c.fillRect(-420,-78,760,18);
  c.fillStyle="rgb(196,190,178)";c.beginPath();c.moveTo(-80,-78);c.lineTo(-80,-190);c.lineTo(150,-190);c.lineTo(190,-150);c.lineTo(190,-78);c.closePath();c.fill();
  c.fillStyle="rgb(214,208,196)";c.fillRect(-40,-240,160,52);c.fillStyle="rgba(60,54,52,0.8)";for(let k=0;k<4;k++)c.fillRect(-26+k*38,-228,24,22);
  c.fillStyle="rgba(60,54,52,0.7)";for(let k=0;k<3;k++){c.beginPath();c.arc(-40+k*60,-140,11,0,TAU);c.fill();}
  c.strokeStyle="rgba(128,84,64,0.7)";c.lineWidth=3;for(let k=0;k<7;k++){c.beginPath();c.moveTo(-70+k*36,-188);c.lineTo(-66+k*36,-120-(k%3)*12);c.stroke();}
  c.fillStyle="rgb(84,76,72)";c.fillRect(250,-380,10,302);c.fillRect(-300,-300,8,222);c.strokeStyle="rgba(84,76,72,0.8)";c.lineWidth=2;
  c.beginPath();c.moveTo(255,-370);c.lineTo(-296,-292);c.moveTo(255,-370);c.lineTo(420,-130);c.moveTo(-296,-292);c.lineTo(-414,-66);c.stroke();
  c.restore();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.14));g.addColorStop(1,"rgba(255,244,226,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.snHarbour=c=>sn_paintHarbour(c);

// salt and dust blowing across the seabed from the right: two soft clouds of grain drifting at their own speeds, low on the ground
function sn_dustTex(){return ag_kept("snDust",1024,400,(c,w,h)=>{const R=ag_rnd(41);for(let k=0;k<70;k++){const x=R()*w,y=h*0.25+R()*h*0.65,r=40+R()*120;
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(232,220,196,0.22)");g.addColorStop(1,"rgba(232,220,196,0)");c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);
  if(x<r){c.fillStyle=g;c.save();c.translate(w,0);c.fillRect(x-r,y-r,2*r,2*r);c.restore();}if(x>w-r){c.save();c.translate(-w,0);c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}}});}
function sn_dust(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const tex=sn_dustTex();ctx.save();ctx.globalAlpha*=a;
  for(const [sp,y,sc,al] of [[70,470,1.5,0.75],[130,560,1.9,0.6]]){const w=1024*sc,off=((t*sp)%w+w)%w;ctx.save();ctx.globalAlpha*=al;for(let k=-1;k<3;k++)ctx.drawImage(tex,W-off-k*w,y,w,400*sc*0.55);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- a fisher of Aralsk, in the 1990s */
const SN_FISHER={name:"A fisher",key:"sn-fisher",skin:[198,152,118],hair:{style:"cropped",c:[36,30,28],streak:[110,100,92]},beard:[52,44,40],
  top:{kind:"overshirt",c:[86,82,78],inner:[206,200,188]},breath:0.27};
