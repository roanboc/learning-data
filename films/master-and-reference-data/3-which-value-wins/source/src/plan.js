/* ===== Which value wins: the places and the pictures =====
   The places are painted once and kept (post.js): Plymouth Sound in December 1831, the Beagle's chronometer cabin, the campus today,
   the data team's office, the paper with a little sky and land for the chapters that explain, a second one for the other places,
   and Falmouth in October 1836. The pictures are the film's own things: the Beagle, at anchor and under sail; the clocks, their
   boxes and the rate book; how a ship finds its longitude; Linh's five records, and her record, the person, with each field's values
   in their sources' colours; the model's SQL; HR's file, sent again; her two names; the YAML Jun writes, and the SQL and the tests dbt
   writes from it; her contact points; the dry run; a bank and a shop. Every name starts with m3_ (this film) or M3_. */

/* ---------- the people ---------- */
// Jun Park, In the weeds of data crafting's analytics engineer (films/analytics-engineering/shared/src/people.js), whom this series'
// build doesn't load: the same figure, here
if(!PEOPLE.jun)PEOPLE.jun={name:"Jun Park",role:"Analytics engineer",side:"Technical",does:"produces",edge:TECH,seed:10,
  skin:[226,186,150],hair:{style:"side",c:[24,22,26]},glasses:[40,44,54],
  top:{kind:"sweater",c:[62,120,112]},bottom:{c:[48,52,62]},shoe:[232,232,236],build:{sh:72,hip:58,h:0.99}};

/* ---------- colours ---------- */
// the sources, each in its role's colour: the student system the student's teal, HR the tutor's violet, the research office the
// researcher's coral, the alumni office the alumna's green; Linh, as the source of her own details, the white of the paper
const M3_SRC={sis:{name:"student system",role:"student"},hr:{name:"HR",role:"tutor"},ro:{name:"research office",role:"researcher"},
  ao:{name:"alumni office",role:"alumna"},self:{name:"Linh",role:null}};
const m3_col=src=>src==="self"?WC_PAPER:WC_ROLE[M3_SRC[src].role],m3_ink=src=>src==="self"?WC_INK:WC_ROLEINK[M3_SRC[src].role];
// the business side's gold, for what the steward decides (her pin, her ticks); the warning amber; the approval stamp's brown ink
const M3_GOLD=[214,160,40],M3_GOLDINK=[136,96,8],M3_AMBER=[244,178,60],M3_STAMP=[110,74,24];

/* ---------- the wash's texture ---------- */
// The shared wash (shared/src/wash.js) shifts its texture by a seed that grows with where the wash starts. A wash that starts left of
// the frame gets a seed below zero, which shifts the texture right and down and leaves a bare strip along the frame's left edge. In
// this film, such a seed moves up by a whole number of the texture's repeats (2100 is a multiple of both), so nothing else changes.
const m3_washShared=wc_wash;
wc_wash=function(ctx,pts,col,o){o=o||{};const s0=o.seed||7,s=s0+Math.round(wc_bbox(pts).x0);
  if(s<0)o=Object.assign({},o,{seed:s0+2100*Math.ceil(-s/2100)});return m3_washShared(ctx,pts,col,o);};

/* ---------- the places ---------- */
// the sky, paler: winter, or the haze of a working day
function m3_pale(ctx,hz,col,a){ctx.save();const g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,a*0.5));ctx.fillStyle=g;ctx.fillRect(0,0,W,hz);ctx.restore();}
// the water's ripples: darker strokes where the wind ruffles it, and light lifted out under the sun (sx)
function m3_waves(ctx,hz,sx,seed,warm){const R=wc_rng(seed);ctx.save();
  for(let i=0;i<140;i++){const y=hz+6+Math.pow(R(),1.5)*(H-hz),k=(y-hz)/(H-hz),len=24+R()*(60+220*k),x=R()*(W+200)-100,th=1.1+3.2*k;
    ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(warm?[110,128,132]:[96,124,128],0.26+0.2*R());ctx.beginPath();ctx.ellipse(x,y,len/2,th,0,0,TAU);ctx.fill();}
  ctx.globalCompositeOperation="source-over";
  for(let i=0;i<90;i++){const y=hz+4+Math.pow(R(),1.4)*(H-hz)*0.75,k=(y-hz)/(H-hz),x=sx+(R()-0.5)*(180+700*k),len=10+R()*(30+130*k),th=0.8+2.2*k;
    ctx.fillStyle=rgba(warm?[255,236,196]:[252,248,236],0.32+0.4*R());ctx.beginPath();ctx.ellipse(x,y,len/2,th,0,0,TAU);ctx.fill();}
  ctx.restore();}
// Plymouth Sound in December 1831: a pale winter sky, the far shore with the town low on it, Mount Edgcumbe's wooded headland on the
// left, falling to the water, and the grey-green water the Beagle rides at anchor on
const M3_HZ=604,M3_WL=716;
const M3_HEAD=x=>612-232*Math.exp(-Math.pow((x-170)/430,2))-34*Math.exp(-Math.pow((x-610)/150,2))+4*Math.sin(x/37)+3*Math.sin(x/13)+(x>760?Math.pow((x-760)/120,2)*30:0);
function m3_sound(ctx){wc_sky(ctx,M3_HZ,11,{sun:[1480,236],clouds:5,cx:620,cw:1240,cy:70,ch:190});m3_pale(ctx,M3_HZ,[234,232,230],0.42);
  const FS=x=>M3_HZ-14-22*Math.exp(-Math.pow((x-1380)/360,2))+4*Math.sin(x/70);
  wc_land(ctx,FS,[170,182,178],0.16,{line:false});
  const R=wc_rng(23);for(let x=990;x<1770;x+=24+R()*24){const w=14+R()*20,h=10+R()*16,y=FS(x)+5;wc_flat(ctx,wc_rect(x,y-h,w,h),[216,208,196],0.24,"build");
    wc_flat(ctx,[[x-2,y-h],[x+w+2,y-h],[x+w/2,y-h-7-R()*6]],[164,152,152],0.24,"build");}
  const cy=FS(1330);wc_flat(ctx,wc_rect(1324,cy-62,15,58),[204,196,186],0.26,"build");wc_flat(ctx,[[1321,cy-62],[1342,cy-62],[1331,cy-82]],[160,150,150],0.26,"build");
  // the headland's woods in winter, dabbed on as a painter sponges a far wood: bare oaks and beeches brown and mauve, evergreens dark
  // among them, the crowns breaking the skyline
  wc_land(ctx,M3_HEAD,[146,142,124],0.42,{line:false});m3_dabs(ctx,M3_HEAD,-40,830,1700,[[[156,128,114],5],[[136,124,132],3],[[124,134,108],2],[[84,108,92],3]],29);
  wc_wash(ctx,[[-60,M3_HZ],[W+60,M3_HZ],[W+60,H+60],[-60,H+60]],[132,160,160],{depth:0.72,kind:"water",line:false});
  m3_waves(ctx,M3_HZ,1480,29);}
// a wood seen from afar: small soft dabs of paint, each a crown, spread evenly over the slope under top(x) between x0 and x1, a few
// standing above the line so its edge is broken by crowns; pal is [colour, weight] pairs; darker where the dabs overlap
function m3_dabs(ctx,top,x0,x1,n,pal,seed){const R=wc_rng(seed),tw=pal.reduce((s,p)=>s+p[1],0);let y0=H;for(let x=x0;x<x1;x+=10)y0=Math.min(y0,top(x));
  ctx.save();ctx.globalCompositeOperation="multiply";
  for(let i=0,k=0;i<n&&k<n*8;k++){const x=x0+R()*(x1-x0),y=y0-8+R()*(M3_HZ-y0+6),t=top(x);if(y<t-7||y>M3_HZ-3)continue;i++;
    const r=6+R()*9,a=0.14+0.16*R();let w=R()*tw,c=pal[0][0];for(const [cc,ww] of pal){if((w-=ww)<=0){c=cc;break;}}
    const g=ctx.createRadialGradient(x,y-r*0.2,r*0.2,x,y,r);g.addColorStop(0,rgba(c,a));g.addColorStop(0.7,rgba(c,a*0.8));g.addColorStop(1,rgba(c,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*0.9,0,0,TAU);ctx.fill();}
  ctx.restore();}
// Falmouth in October 1836: a warmer sky, the headland green and gold, the town at the water, the sea in the late sun
const M3_FHZ=600;
const M3_FHEAD=x=>M3_FHZ+8-150*Math.exp(-Math.pow((x-1700)/360,2))-40*Math.exp(-Math.pow((x-1260)/200,2))+3*Math.sin(x/41)+(x<1020?Math.pow((1020-x)/110,2)*30:0);
function m3_falmouth(ctx){wc_sky(ctx,M3_FHZ,31,{sun:[420,250],clouds:4,cx:300,cw:1300,cy:80,ch:180});
  ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,0,0,M3_FHZ);g.addColorStop(0,rgba([255,250,240],1));g.addColorStop(1,rgba([252,214,172],1));ctx.fillStyle=g;ctx.fillRect(0,0,W,M3_FHZ);ctx.restore();
  wc_land(ctx,x=>M3_FHZ-10-14*Math.exp(-Math.pow((x-500)/420,2))+3*Math.sin(x/60),[176,184,168],0.16,{line:false});
  wc_land(ctx,M3_FHEAD,[150,176,112],0.44);wc_fieldStrips(ctx,M3_FHEAD,6,40,3,[[150,176,112],[214,196,124]],0.44,5);
  wc_treeRow(ctx,x=>M3_FHEAD(x)+4,1180,1900,70,40,0.46,41,[132,160,100]);
  const R=wc_rng(37);for(let x=1060;x<1300;x+=26+R()*18){const w=16+R()*18,h=12+R()*14,y=M3_FHEAD(x)+16;wc_flat(ctx,wc_rect(x,y-h,w,h),[232,220,198],0.4,"build");
    wc_flat(ctx,[[x-2,y-h],[x+w+2,y-h],[x+w/2,y-h-8]],[150,120,112],0.4,"build");}
  wc_wash(ctx,[[-60,M3_FHZ],[W+60,M3_FHZ],[W+60,H+60],[-60,H+60]],[128,166,170],{depth:0.72,kind:"water",line:false});
  m3_waves(ctx,M3_FHZ,420,43,true);}
// the chronometer cabin: honey-coloured planks, the stern windows full of sea light, two long shelves for the twenty-two boxed clocks,
// and the table the rate book lies on
const M3_SH=[392,624],M3_TABLE=780,M3_DUST=[232,208,162];
function m3_cabin(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const dark=[132,90,54];
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[226,190,138],{kind:"plaster",line:false,seed:3});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(7);for(let x=-30;x<W+40;x+=92){ctx.strokeStyle=rgba([166,118,70],0.42);ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(x+R()*4,90);ctx.lineTo(x+R()*4,H);ctx.stroke();ctx.strokeStyle=rgba([182,136,88],0.2);ctx.lineWidth=1.2;
    for(let k=0;k<4;k++){const gx=x+14+R()*64;ctx.beginPath();ctx.moveTo(gx,90);ctx.bezierCurveTo(gx+R()*10-5,400,gx+R()*10-5,700,gx+R()*8-4,H);ctx.stroke();}}ctx.restore();
  // the stern windows, six panes of sky and sea, and their light on the planks
  const wx=700,wy=124,ww=520,wh=128;ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();const g=ctx.createLinearGradient(0,wy,0,wy+wh);
  g.addColorStop(0,rgba([206,222,232],1));g.addColorStop(0.6,rgba([238,238,234],1));g.addColorStop(0.62,rgba([150,174,176],1));g.addColorStop(1,rgba([128,156,160],1));ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);ctx.restore();
  ctx.save();const lg=ctx.createRadialGradient(960,wy+wh,20,960,wy+wh+80,620);lg.addColorStop(0,rgba([255,250,236],0.55));lg.addColorStop(1,rgba([255,250,236],0));ctx.fillStyle=lg;ctx.fillRect(260,wy,1400,760);ctx.restore();
  for(const r of [wc_rect(wx-14,wy-14,ww+28,14),wc_rect(wx-14,wy+wh,ww+28,14),wc_rect(wx-14,wy-14,14,wh+28),wc_rect(wx+ww,wy-14,14,wh+28),
    wc_rect(wx+ww/3-5,wy,10,wh),wc_rect(wx+2*ww/3-5,wy,10,wh),wc_rect(wx,wy+wh/2-4,ww,8)])wc_wash(ctx,r,dark,{kind:"trim",lw:1.3});
  // the deck beams overhead
  wc_wash(ctx,wc_rect(-40,-40,W+80,100),[150,104,62],{kind:"trim",lw:1.6});for(let x=40;x<W;x+=320)wc_wash(ctx,wc_rect(x,52,46,52),[128,86,50],{kind:"trim",lw:1.2});
  // the shelves, on brackets
  M3_SH.forEach((y,i)=>{wc_wash(ctx,wc_rect(110,y,1700,20),dark,{kind:"trim",lw:1.6,seed:11+i});for(const x of [170,960,1750])wc_wash(ctx,[[x-14,y+20],[x+14,y+20],[x,y+52]],dark,{kind:"trim",lw:1.2});
    // the sawdust the clocks are bedded in, along the shelf
    const sd=[];for(let x=118;x<=1802;x+=8)sd.push([x,y-6+2.2*Math.sin(x/23+i)+1.4*Math.sin(x/7)]);sd.push([1802,y+3],[118,y+3]);wc_wash(ctx,sd,M3_DUST,{kind:"trim",line:false,seed:21+i});
    const R2=wc_rng(31+i);ctx.fillStyle=rgba([160,120,78],0.55);for(let k=0;k<260;k++)ctx.fillRect(120+R2()*1680,y-4+R2()*6,1.6+R2()*1.6,1.4);});
  // the table
  wc_wash(ctx,wc_rect(-40,M3_TABLE,W+80,24),[118,78,46],{kind:"trim",lw:1.6});wc_wash(ctx,wc_rect(-40,M3_TABLE+24,W+80,H),[146,100,60],{kind:"ground",line:false});}
// today: the university, from across its lawn (One person, many roles shows it from the street): the old building and its glass wing,
// the trees, a path, the morning sun
const M3_LAWN=x=>676+6*Math.sin(x/280+1);
function m3_campus(ctx){const P=WCP;wc_sky(ctx,700,8,{sun:[360,160],clouds:4});
  wc_skyline(ctx,620,P.city,0.1,9);wc_treeRow(ctx,()=>644,-40,1980,62,72,0.24,33,P.leaf2);wc_land(ctx,M3_LAWN,P.lawn,0.42);
  wc_contact(ctx,820,1460,680,0.46,0.22);wc_quad(ctx,830,680,0.46,0.62);wc_glassWing(ctx,1442,680,150,170,0.48);
  wc_roundTree(ctx,180,716,262,0.5);wc_roundTree(ctx,560,700,226,0.5,P.leaf2);wc_roundTree(ctx,1700,712,240,0.52);
  wc_wash(ctx,[[-60,790],[W+60,780],[W+60,H+60],[-60,H+60]],P.lawn,{depth:0.66,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth(M3_PATH,8),26,260),P.paving,{depth:0.62,kind:"path",line:false});
  m3_tufts(ctx,x=>790,0,1920,40,0.9,12,(x,y)=>{const i=M3_PATH.findIndex(q=>q[1]>=y);if(i<1)return false;const a=M3_PATH[i-1],b=M3_PATH[i],cx=lerp(a[0],b[0],(y-a[1])/(b[1]-a[1]));
    return Math.abs(x-cx)<lerp(13,130,(y-682)/408)+24;});wc_lamp(ctx,1360,860,300,0.72);}
// the path across the lawn, and the grass tufts, as the shared ones (shared/src/wash.js) but none on the path (skip)
const M3_PATH=[[1140,682],[1110,740],[1020,820],[880,920],[700,1090]];
function m3_tufts(ctx,f,x0,x1,n,depth,seed,skip){const R=wc_rng(seed||8);for(let i=0;i<n;i++){const x=lerp(x0,x1,R()),y=f(x)+20+R()*(H-f(x)-20),s=0.7+R()*0.8*((y-700)/380),
  r=[R(),R(),R(),R()];if(skip&&skip(x,y))continue;ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(WCP.near,0.22),depth),0.85);ctx.lineWidth=2.2*s;ctx.lineCap="round";ctx.beginPath();
  [-0.5,-0.15,0.2,0.55].forEach((a,k)=>{ctx.moveTo(x,y);ctx.quadraticCurveTo(x+a*10*s,y-12*s,x+a*22*s,y-(18+r[k]*10)*s);});ctx.stroke();ctx.restore();}}
// the data team's office (One person, many roles shows it too): a warm wall, a tall window onto the campus, a floor
function m3_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(1712,112,436,560);ctx.clip();wc_sky(ctx,560,6,{clouds:2,cx:1720,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(1820,330,70,270),WCP.stone,0.4);wc_part(ctx,[[1812,330],[1898,330],[1855,250]],WCP.slate,0.4);
  wc_roundTree(ctx,1760,640,220,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(1700,100,460,16),wc_rect(1700,100,16,584),wc_rect(1922,100,16,584),wc_rect(1700,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(1680,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the other places
function m3_plain(ctx){wc_sky(ctx,836,13,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240+1),WCP.near,0.75,{line:false});}
function m3_plainB(ctx){wc_sky(ctx,846,17,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+2),WCP.near,0.75,{line:false});}
const WC_PLACES={sound:m3_sound,cabin:m3_cabin,campus:m3_campus,office:m3_office,plain:m3_plain,plainB:m3_plainB,falmouth:m3_falmouth};
function m3_place(ctx,key,a){if(a!=null&&a<=0.01)return;if(a==null||a>=0.99)ctx.drawImage(wc_place(key),0,0,W,H);else withA(ctx,a,()=>ctx.drawImage(wc_place(key),0,0,W,H));}

/* ---------- small things used everywhere ---------- */
// a veil of paper over the whole frame, so what's drawn after it stands out
function m3_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// a person facing the other way when o.flip, so a hand held out to the left stays in the frame
function m3_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}
// a pencil arrow from one point to another, drawn on as p goes 0 to 1 (o.start: a head at both ends)
function m3_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const e=ease(clamp(p,0,1)),ex=lerp(x0,x1,e),ey=lerp(y0,y1,e),an=Math.atan2(y1-y0,x1-x0);ctx.save();
  ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.fillStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  const head=(x,y,a)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-16*Math.cos(a-0.45),y-16*Math.sin(a-0.45));ctx.lineTo(x-16*Math.cos(a+0.45),y-16*Math.sin(a+0.45));ctx.closePath();ctx.fill();};
  if(p>=0.98){head(x1,y1,an);if(o.start)head(x0,y0,an+Math.PI);}ctx.restore();}
// a measuring context, for laying things out before they're drawn
let M3_MC=null;const m3_mc=()=>M3_MC||(M3_MC=mkCanvas(8,8).getContext("2d"));
// a source's dot: its colour, or for Linh, the paper in a pencil ring
function m3_dot(ctx,x,y,src,a){withA(ctx,a==null?1:a,()=>{ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.fillStyle=rgba(m3_col(src),1);ctx.fill();
  if(src==="self"){ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=2.2;ctx.stroke();}});}
// a pencil note, written on as p goes 0 to 1
function m3_note(ctx,s,x,y,p,o){o=o||{};if(p<=0)return;wc_hand(ctx,s,x,y,{p,size:o.size||32,w:o.w||700,col:o.col||WC_INK,align:o.align});}
// a gold pin, the steward's: its head and its needle, pressed in as p goes 0 to 1
function m3_pin(ctx,x,y,p){if(p<=0)return;const k=lerp(1.5,1,ease(clamp(p/0.6,0,1))),a=clamp(p*3,0,1);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{
  ctx.strokeStyle=rgba([90,84,92],0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-18);ctx.stroke();
  ctx.beginPath();ctx.arc(13,-24,12,0,TAU);ctx.fillStyle=rgba(M3_GOLD,1);ctx.fill();ctx.strokeStyle=rgba(wc_dim(M3_GOLD,0.4),0.9);ctx.lineWidth=1.6;ctx.stroke();
  ctx.beginPath();ctx.arc(9,-28,3.6,0,TAU);ctx.fillStyle=rgba([255,246,214],0.9);ctx.fill();});ctx.restore();}
// a stamp pressed on at ts: it lands a little large and settles, in brown ink inside a double rule, two lines in it
function m3_stamp(ctx,t,cx,cy,ts,l1,l2){const p=clamp((t-ts)/0.2,0,1);if(p<=0)return;const z=lerp(1.3,1,1-Math.pow(1-p,3)),w=Math.round(Math.max(tw(ctx,l1,34,800),tw(ctx,l2,28,600))+64);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.05);ctx.scale(z,z);withA(ctx,p,()=>{ctx.drawImage(m3_stampRule(w),-w/2-6,-60,w+12,120);
    wc_T(ctx,l1,0,-6,{w:800,size:34,align:"center",col:M3_STAMP,a:0.92});wc_T(ctx,l2,0,34,{w:600,size:28,align:"center",col:M3_STAMP,a:0.92});});ctx.restore();}
function m3_stampRule(w){return wc_kept("stamp"+w,(w+12)*2,240,q=>{q.scale(2,2);q.translate(6,6);wc_ink(q,wc_rrPts(0,0,w,108,10),true,3.6,M3_STAMP,0.9,41,0.6);
  wc_ink(q,wc_rrPts(8,8,w-16,92,6),true,1.8,M3_STAMP,0.85,43,0.6);q.globalCompositeOperation="destination-out";q.globalAlpha=0.45;q.drawImage(WC.blotch,-40,-30,w+80,200);});}

/* ---------- 1. the Beagle and her clocks ---------- */
// HMS Beagle, bow to the left: a black hull with a pale band along its gunports, a raised deck at the stern, three masts; at anchor
// her sails are furled on the yards, and coming home they're set. Painted once at twice the size, its origin on the waterline amidships
const M3_SHIP={L:440,T:430,W:780,H:480};
const m3_hullTop=x=>-38-9*(x/245)*(x/245)-0.012*x;
function m3_shipPaint(set){const K=2,S=M3_SHIP;return wc_kept("beagle"+(set?"S":"F"),S.W*K,S.H*K,q=>{q.scale(K,K);q.translate(S.L,S.T);
  const spar=[112,84,58],sail=[244,234,210],rig=(pts,lw,a)=>{q.save();q.strokeStyle=rgba(WC_PENCIL,a==null?0.55:a);q.lineWidth=lw||1.2;q.lineCap="round";q.beginPath();
    q.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)q.lineTo(pts[i][0],pts[i][1]);q.stroke();q.restore();};
  const M=[{x:-140,top:-372,y:[[-150,196],[-246,150],[-318,104]]},{x:12,top:-404,y:[[-160,206],[-262,160],[-342,112]]},{x:156,top:-306}];
  // the standing rigging: the stays forward from each masthead, the shrouds down to the hull's sides, the backstays aft
  rig([[-140,-372],[-430,-100]]);rig([[-140,-300],[-372,-86]]);rig([[12,-404],[-140,-250]]);rig([[12,-262],[-140,-70]]);rig([[156,-306],[12,-190]]);
  rig([[12,-404],[214,m3_hullTop(214)-10]],1);rig([[-140,-372],[60,m3_hullTop(60)]],1);rig([[156,-306],[232,m3_hullTop(232)-10]],1);
  for(const m of M){const top=m.y?m.y[0][0]-14:-150;for(let k=-2;k<=2;k++)rig([[m.x,top],[m.x+k*15,m3_hullTop(m.x+k*15)-(m.x>100?10:0)]],1,0.45);}
  if(!set)rig([[-232,-24],[-300,4]],2.2,0.7); // the anchor cable
  rig([[-330,-78],[-238,-10]],1.6,0.6); // the bobstay
  // the bowsprit and jib-boom
  wc_wash(q,[[-238,-44],[-372,-90],[-374,-82],[-238,-34]],spar,{kind:"trunk",lw:1});wc_wash(q,[[-360,-86],[-432,-104],[-432,-100],[-360,-81]],spar,{kind:"trunk",lw:0.8});
  // the masts, each with its top, and the mizzen's gaff and boom
  for(const m of M){const b=m3_hullTop(m.x)-(m.x>100?10:0);wc_wash(q,[[m.x-4,b],[m.x-1.8,m.top],[m.x+1.8,m.top],[m.x+4,b]],spar,{kind:"trunk",lw:1,seed:m.x+400});
    if(m.y)wc_wash(q,wc_rect(m.x-18,m.y[0][0]-17,36,6),spar,{kind:"trim",lw:0.8});}
  wc_wash(q,[[158,-232],[268,-272],[268,-267],[158,-226]],spar,{kind:"trunk",lw:0.8});wc_wash(q,[[158,-70],[302,-76],[302,-71],[158,-65]],spar,{kind:"trunk",lw:0.8});
  if(set){// the sails, set: square sails on the fore and main masts, two jibs, and the spanker on the mizzen; a little shadow on each
    const sq=(x0,x1,y0,x2,x3,y1,seed)=>{const pts=[[x0,y0],[x1,y0]],n=8;for(let i=1;i<=n;i++){const u=i/n;pts.push([lerp(x1,x3,u)+Math.sin(u*Math.PI)*5,lerp(y0,y1,u)]);}
      for(let i=n;i>=0;i--){const u=i/n;pts.push([lerp(x2,x3,u),y1-Math.sin(u*Math.PI)*8]);}for(let i=n-1;i>0;i--){const u=i/n;pts.push([lerp(x0,x2,u)-Math.sin(u*Math.PI)*5,lerp(y0,y1,u)]);}
      wc_wash(q,pts,sail,{kind:"paper",lw:1.1,seed});};
    for(const m of M.slice(0,2)){const Y=m.y;sq(m.x-Y[0][1]*0.47,m.x+Y[0][1]*0.47,Y[0][0]+3,m.x-Y[0][1]*0.5,m.x+Y[0][1]*0.5,Y[0][0]+84,m.x+1);
      sq(m.x-Y[1][1]*0.47,m.x+Y[1][1]*0.47,Y[1][0]+3,m.x-Y[0][1]*0.46,m.x+Y[0][1]*0.46,Y[0][0]-4,m.x+3);sq(m.x-Y[2][1]*0.47,m.x+Y[2][1]*0.47,Y[2][0]+3,m.x-Y[1][1]*0.45,m.x+Y[1][1]*0.45,Y[1][0]-4,m.x+5);}
    wc_wash(q,[[-146,-296],[-366,-92],[-196,-100]],sail,{kind:"paper",lw:1.1,seed:31});wc_wash(q,[[-146,-342],[-424,-108],[-262,-118]],sail,{kind:"paper",lw:1.1,seed:33});
    wc_wash(q,[[162,-226],[264,-264],[298,-80],[162,-74]],sail,{kind:"paper",lw:1.1,seed:35});}
  // the yards, and on them the sails, furled, with their ties
  for(const m of M.slice(0,2))for(const [y,l] of m.y){wc_wash(q,[[m.x-l/2,y-1.8],[m.x+l/2,y-1.8],[m.x+l/2-3,y+2],[m.x-l/2+3,y+2]],spar,{kind:"trunk",lw:0.8});
    if(!set){wc_wash(q,wc_rrPts(m.x-l*0.45,y-10,l*0.9,10,5),sail,{kind:"paper",lw:0.9,seed:y});q.fillStyle=rgba(WC_PENCIL,0.5);for(let x=m.x-l*0.4;x<m.x+l*0.4;x+=17)q.fillRect(x,y-10,2,10);}}
  if(!set)wc_wash(q,wc_rrPts(166,-84,128,11,5),sail,{kind:"paper",lw:0.9,seed:41});
  // a long pennant from the mainmast head
  wc_wash(q,[[12,-404],[-40,-410],[-96,-402],[-128,-400],[-94,-398],[-40,-398],[12,-398]],[190,82,66],{kind:"ribbon",flat:true});
  // the hull: black, with a pale band along its gunports, and the raised deck at the stern
  const top=[];for(let x=-250;x<=236;x+=6)top.push([x,m3_hullTop(x)]);
  wc_wash(q,top.concat([[226,-20],[214,0],[-226,0],[-244,-18]]),[58,52,54],{kind:"build",lw:1.6,seed:5});
  const pp=[];for(let x=118;x<=236;x+=6)pp.push([x,m3_hullTop(x)-11]);wc_wash(q,pp.concat([[236,m3_hullTop(236)+1],[118,m3_hullTop(118)+1]]),[58,52,54],{kind:"build",lw:1.2,seed:7});
  const bt=[],bb=[];for(let x=-236;x<=226;x+=6){bt.push([x,m3_hullTop(x)+7]);bb.unshift([x,m3_hullTop(x)+17]);}
  wc_wash(q,bt.concat(bb),[222,200,150],{kind:"trim",line:false,flat:true});for(let i=0;i<6;i++){const x=-168+i*62;wc_flat(q,wc_rect(x-5,m3_hullTop(x)+8,10,8),[40,36,38],1,"trim");}
  q.strokeStyle=rgba([238,226,196],0.35);q.lineWidth=1.4;q.beginPath();for(let x=-238;x<=224;x+=6){const y=m3_hullTop(x)+26;x===-238?q.moveTo(x,y):q.lineTo(x,y);}q.stroke();});}
// the Beagle on the water at (x, y), rocking a little; her reflection, and the water lapping along her waterline
function m3_ship(ctx,x,y,s,t,o){o=o||{};const S=M3_SHIP,c=m3_shipPaint(!!o.set),rock=Math.sin(t*0.8+0.5)*0.006,bob=Math.sin(t*0.62)*2.2;
  // her reflection: her picture upside down and squashed, in strips that the ripples push sideways, fading with depth
  ctx.save();ctx.globalCompositeOperation="multiply";const K=2,band=4,sq=0.62;for(let h=0;h<S.T-60;h+=band){const k=h/(S.T-60),a=0.5*(1-k)*(1-k);if(a<0.012)break;
    ctx.globalAlpha=a;ctx.drawImage(c,0,(S.T-h-band)*K,S.W*K,band*K,x-S.L*s+Math.sin(h*0.19+t*1.5)*(1.2+6*k)*s,y+bob*0.6+h*sq*s,S.W*s,band*sq*s+0.6);}ctx.restore();
  ctx.save();ctx.translate(x,y+bob);ctx.rotate(rock);ctx.scale(s,s);ctx.drawImage(c,-S.L,-S.T,S.W,S.H);ctx.restore();
  ctx.save();for(let i=0;i<9;i++){const u=(i/9+t*0.035)%1,xx=x+(u-0.5)*470*s,ww=(18+14*Math.sin(i*2.3))*s;ctx.fillStyle=rgba([250,248,236],0.5);ctx.beginPath();ctx.ellipse(xx,y+3*s+bob*0.6,ww,2.2*s,0,0,TAU);ctx.fill();}ctx.restore();}

// a clock in its box: the wood, the brass bowl, the white dial and a brass plate, painted once at twice the size; (x, y) is the middle
// of its foot, on the shelf
const M3_BW=118,M3_BHT=124;
function m3_boxPaint(){return wc_kept("clockbox",(M3_BW+16)*2,(M3_BHT+16)*2,q=>{q.scale(2,2);q.translate(8,8);
  wc_wash(q,wc_rrPts(0,10,M3_BW,M3_BHT-10,6),[166,110,64],{kind:"build",lw:1.4,seed:3});wc_wash(q,wc_rrPts(-3,0,M3_BW+6,14,4),[140,92,52],{kind:"trim",lw:1.2,seed:5});
  wc_wash(q,wc_ell(M3_BW/2,56,42,42,40),[206,168,88],{kind:"build",lw:1.2,seed:7});wc_wash(q,wc_ell(M3_BW/2,56,34,34,40),[252,250,244],{kind:"clock",lw:1,seed:9});
  q.strokeStyle=rgba(WC_INK,0.75);q.lineCap="round";for(let i=0;i<12;i++){const a=i*TAU/12,r0=i%3?27:24;q.lineWidth=i%3?1.3:2.4;q.beginPath();
    q.moveTo(M3_BW/2+Math.cos(a)*r0,56+Math.sin(a)*r0);q.lineTo(M3_BW/2+Math.cos(a)*31,56+Math.sin(a)*31);q.stroke();}
  wc_wash(q,wc_rrPts(M3_BW/2-18,102,36,14,3),[214,180,104],{kind:"trim",lw:1,seed:11});
  const sd=[];for(let x=-6;x<=M3_BW+6;x+=4)sd.push([x,M3_BHT-7-2.4*Math.sin((x+6)/(M3_BW+12)*Math.PI)+1.2*Math.sin(x/5)]);sd.push([M3_BW+6,M3_BHT+2],[-6,M3_BHT+2]);
  wc_wash(q,sd,M3_DUST,{kind:"trim",line:false,flat:true,seed:13});const R=wc_rng(17);q.fillStyle=rgba([160,120,78],0.6);for(let k=0;k<40;k++)q.fillRect(-4+R()*(M3_BW+8),M3_BHT-6+R()*7,1.4+R()*1.2,1.2);});}
// a dial's hands at a time of day, in seconds: hours, minutes, and a thin second hand
function m3_hands(ctx,cx,cy,r,sec,o){o=o||{};const h=(sec/3600)%12,m=(sec/60)%60,s=sec%60;ctx.save();ctx.lineCap="round";
  const hand=(a,len,lw,col,tail)=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx-Math.sin(a)*len*(tail||0),cy+Math.cos(a)*len*(tail||0));ctx.lineTo(cx+Math.sin(a)*len,cy-Math.cos(a)*len);ctx.stroke();};
  hand(h/12*TAU,r*0.52,Math.max(2,r*0.085),WC_INK);hand(m/60*TAU,r*0.8,Math.max(1.6,r*0.055),WC_INK);if(o.sec!==false)hand(s/60*TAU,r*0.86,Math.max(1,r*0.024),[176,72,48],0.22);
  ctx.fillStyle=rgba(WC_INK,1);ctx.beginPath();ctx.arc(cx,cy,Math.max(2,r*0.06),0,TAU);ctx.fill();ctx.restore();}
// the twenty-two clocks, eleven on each shelf; each keeps its own time and its own rate, a little fast or slow, and its second hand
// steps twice a second, as a chronometer's does
const M3_CLK=(()=>{const R=wc_rng(53),o=[];for(let i=0;i<22;i++)o.push({x:220+(i%11)*148,y:M3_SH[i<11?0:1],t0:15*3600+20*60+(R()-0.5)*160,rate:1+(R()-0.5)*0.09});return o;})();
const m3_clockSec=(c,t)=>c.t0+Math.floor(t*c.rate*2)/2;
function m3_box(ctx,i,t){const c=M3_CLK[i];ctx.drawImage(m3_boxPaint(),c.x-M3_BW/2-8,c.y-M3_BHT-8,M3_BW+16,M3_BHT+16);m3_hands(ctx,c.x,c.y-M3_BHT+56,31,m3_clockSec(c,t));}
// the two clocks thought best: the standards
const M3_STD=[9,13];
// a big dial: the brass bezel and the face with its minutes, painted once
function m3_dialPaint(r){return wc_kept("dial"+r,(r+16)*4,(r+16)*4,q=>{q.scale(2,2);q.translate(r+16,r+16);wc_wash(q,wc_ell(0,0,r+10,r+10,60),[206,168,88],{kind:"build",lw:1.4,seed:r});
  wc_wash(q,wc_ell(0,0,r,r,60),[252,250,244],{kind:"clock",lw:1.2,seed:r+3});q.strokeStyle=rgba(WC_INK,0.8);q.lineCap="round";
  for(let i=0;i<60;i++){const a=i*TAU/60,r0=i%5?r*0.9:r*0.8;q.lineWidth=i%5?1:2.6;q.beginPath();q.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);q.lineTo(Math.cos(a)*r*0.96,Math.sin(a)*r*0.96);q.stroke();}});}
function m3_dial(ctx,cx,cy,r,sec,o){ctx.drawImage(m3_dialPaint(r),cx-r-16,cy-r-16,(r+16)*2,(r+16)*2);m3_hands(ctx,cx,cy,r,sec,o);}
const m3_clockStr=sec=>{const h=Math.floor(sec/3600)%12||12,m=Math.floor(sec/60)%60;return h+":"+(m<10?"0":"")+m+" pm";};
// the sun, as a child would draw it: a disc and its rays
function m3_sun(ctx,x,y,r){ctx.save();ctx.strokeStyle=rgba([214,140,20],0.9);ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<8;i++){const a=i*TAU/8;ctx.beginPath();
  ctx.moveTo(x+Math.cos(a)*r*1.35,y+Math.sin(a)*r*1.35);ctx.lineTo(x+Math.cos(a)*r*1.8,y+Math.sin(a)*r*1.8);ctx.stroke();}ctx.beginPath();ctx.arc(x,y,r,0,TAU);
  ctx.fillStyle=rgba([255,196,70],1);ctx.fill();ctx.strokeStyle=rgba([196,120,20],0.8);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
// how a ship finds its longitude: noon where it is, the time at home on a clock it carries, and the difference, at 15 degrees an hour.
// o.home: the home clock's time; o.drift (0 to 1) puts the answer in doubt; o.two brings a second clock, at o.home2
const M3_LON={x:370,y:150,w:1180,h:340};
function m3_lon(ctx,t,o){const L=M3_LON,x=L.x,y=L.y;wc_panel(ctx,x,y,L.w,L.h,{kind:"card",seed:4});
  const sx=x+190,hy=y+196;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2.2;ctx.setLineDash([2,9]);ctx.lineCap="round";ctx.beginPath();ctx.ellipse(sx,hy,130,108,0,Math.PI,TAU);ctx.stroke();
  ctx.setLineDash([]);ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(sx-150,hy);ctx.lineTo(sx+150,hy);ctx.stroke();ctx.restore();
  m3_sun(ctx,sx,hy-108,22);wc_T(ctx,"noon here",sx,y+252,{w:800,size:30,align:"center",col:WC_DARK});wc_T(ctx,"12:00",sx,y+296,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});
  const k=o.two||0,hx=x+lerp(915,790,ease(clamp(k,0,1))),cy=y+136;m3_dial(ctx,hx,cy,84,o.home);wc_T(ctx,"home time",hx,y+266,{w:800,size:30,align:"center",col:WC_DARK});
  wc_T(ctx,m3_clockStr(o.home),hx,y+308,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});
  // the difference: 3 hours 20 minutes is 50 degrees west; once the clock has drifted, the answer is in doubt
  const dq=o.drift||0,mx=x+500;withA(ctx,1-0.55*dq,()=>{wc_T(ctx,"3 h 20 min",mx,y+128,{w:600,size:30,align:"center",col:WC_INK});wc_T(ctx,"50° west",mx,y+184,{w:800,size:40,align:"center",col:WC_DARK});});
  m3_arrow(ctx,x+340,y+224,x+676,y+224,clamp((o.arrow==null?1:o.arrow),0,1),{start:true,a:0.7,lw:2.6});
  if(dq>0.01)m3_note(ctx,"?",mx+104,y+190,dq,{size:52,col:WC_NO});
  // a second clock, which disagrees
  if(k>0.01)withA(ctx,k,()=>{const h2=x+1040;m3_dial(ctx,h2,cy,84,o.home2);wc_T(ctx,"home time",h2,y+266,{w:800,size:30,align:"center",col:WC_DARK});
    wc_T(ctx,m3_clockStr(o.home2),h2,y+308,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});});}
// the rate book: a leather cover, two parchment pages, the gutter, a rule every rs from r0, and a gold ribbon; painted once
function m3_bookPaper(w,h,r0,rs){return wc_kept("book"+w+"x"+h,w+64,h+120,ctx=>{ctx.translate(32,24);const P=WCP;
  wc_wash(ctx,wc_rect(-12,-10,w+24,h+22),P.leather,{kind:"cover",lw:2.5});wc_wash(ctx,wc_rect(0,0,w/2,h),P.parchment,{kind:"page",lw:2});wc_wash(ctx,wc_rect(w/2,0,w/2,h),P.parchment,{kind:"page",lw:2,seed:9});
  const g=ctx.createLinearGradient(w/2-30,0,w/2+30,0),gc=wc_dim(P.parchment,0.35);g.addColorStop(0,rgba(gc,0));g.addColorStop(0.5,rgba(gc,0.5));g.addColorStop(1,rgba(gc,0));ctx.fillStyle=g;ctx.fillRect(w/2-30,0,60,h);
  ctx.strokeStyle=rgba(P.parchInk,0.12);ctx.lineWidth=1.2;for(let y=r0;y<h-20;y+=rs){ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(w/2-30,y);ctx.moveTo(w/2+30,y);ctx.lineTo(w-30,y);ctx.stroke();}
  wc_wash(ctx,[[w/2-6,h-6],[w/2+10,h-6],[w/2+10,h+26],[w/2+2,h+18],[w/2-6,h+26]],M3_GOLD,{kind:"ribbon",flat:true});});}
// the book shut: its leather cover, a label, and the ribbon hanging out of it
function m3_bookShutPaper(w,h){return wc_kept("bookShut"+w+"x"+h,w+40,h+110,ctx=>{ctx.translate(20,20);const P=WCP;
  wc_wash(ctx,wc_rect(0,0,w,h),P.leather,{kind:"cover",lw:2.5,seed:13});wc_wash(ctx,wc_rect(-6,-4,16,h+8),wc_dim(P.leather,0.18),{kind:"cover",lw:1.6,seed:15});
  wc_wash(ctx,wc_rect(w*0.24,h*0.3,w*0.56,h*0.26),P.parchment,{kind:"page",lw:1.6,seed:17});
  wc_wash(ctx,[[w*0.6,h-4],[w*0.6+16,h-4],[w*0.6+16,h+26],[w*0.6+8,h+18],[w*0.6,h+26]],M3_GOLD,{kind:"ribbon",flat:true});});}
// the rate book, open at (cx, cy), its rows written as o's moments come; it closes as o.shut goes 0 to 1
const M3_BK={w:620,h:236};
const M3_RATES=[["A · loses 1.6 s"],["B · gains 0.8 s"],["K · gains 0.4 s"]];
function m3_rateBook(ctx,t,cx,cy,o){const {w,h}=M3_BK,sh=ease(clamp(o.shut||0,0,1)),L=cx-w/2+36,R=cx+30,top=cy-h/2,ink=WCP.parchInk;
  if(sh<0.99){ctx.save();ctx.translate(cx,cy);ctx.scale(1-0.5*sh,1);ctx.translate(-cx,-cy);withA(ctx,1-sh,()=>{ctx.drawImage(m3_bookPaper(w,h,92,46),cx-w/2-32,cy-h/2-24);
    m3_note(ctx,"daily rates",L,top+62,clamp((t-o.head)/0.8,0,1),{size:34,col:ink});m3_note(ctx,"Dec 1831",L,top+112,clamp((t-o.head-0.6)/0.6,0,1),{size:30,col:ink,w:600});
    M3_RATES.forEach(([s],i)=>m3_note(ctx,s,R,top+68+i*46,clamp((t-o.rows-i*0.45)/0.6,0,1),{size:32,col:ink,w:600}));
    m3_note(ctx,"…",R,top+68+3*46,clamp((t-o.rows-1.5)/0.3,0,1),{size:32,col:ink});});ctx.restore();}
  if(sh>0.01)withA(ctx,sh,()=>{const sw=w*0.5;ctx.drawImage(m3_bookShutPaper(sw,h),cx-sw/2-20,cy-h/2-20);m3_note(ctx,"rates",cx-sw*0.02,cy-h/2+h*0.3+h*0.18,1,{size:30,col:ink,align:"center"});});}

/* ---------- 2 and 3. Linh's records, and her record, the person ---------- */
// her five records, as each system holds them, each in its source's colour: the student system's two (the old number and the new),
// the alumni office's, HR's and the research office's
const M3_R5=[["sis","S-17142","bachelor's · 2019–22"],["sis","S-20436","master's · from Jul 2025"],["ao","S-17142","graduated 2022"],["hr","E-4417","casual tutor"],["ro","R-3082","a project · 2026"]];
const M3_RX=372,M3_RW=560,M3_RH=112,m3_ry=i=>146+i*132;
function m3_rec5(ctx,i){const [src,id,note]=M3_R5[i];wc_roleCard(ctx,M3_RX,m3_ry(i),M3_RW,M3_RH,M3_SRC[src].role,M3_SRC[src].name,id,null,{note,seed:i+3});}
// her values: each field's candidates, and the source each comes from
const M3_V={legal:["NGUYỄN Thị Linh","sis"],alum:["Nguyen Thi Linh","ao"],hrn:["Linh Nguyen","hr"],ron:["L. Nguyen","ro"],pref:["Linh","self"],
  dob:["14 Mar 2001","sis"],dobHR:["14 May 2001","hr"],mob:["••• 038","sis"],mobHR:["••• 172","hr"],
  eStudy:["linh.nguyen@student.uni.example","sis"],eWork:["linh.nguyen@uni.example","hr"],eOld:["linh.nguyen2001@mail.example","ao"],eNew:["linh.nguyen@mail.example","sis"]};
const M3_MONO={mob:1,mobHR:1,eStudy:1,eWork:1,eOld:1,eNew:1};
// the record from which each value comes (one of the five)
const M3_FROM={legal:1,alum:2,hrn:3,ron:4,dob:1,dobHR:3,mob:1,mobHR:3,eStudy:1,eWork:3,eOld:2,eNew:1};
// a value's tag: a paper tag with its source's dot and the value, 28 px; o.win washes it in its source's colour (the value chosen),
// o.dim greys it (a value not chosen); (x, y) is its left edge and its middle; returns its width
const M3_VH=52;
const m3_vf=k=>M3_MONO[k]?{w:500,f:"mono"}:{w:600,f:null};
function m3_vw(k){const f=m3_vf(k);return Math.round(tw(m3_mc(),M3_V[k][0],28,f.w,f.f)+64);}
function m3_val(ctx,x,y,k,o){o=o||{};const [s,src]=M3_V[k],f=m3_vf(k),w=m3_vw(k),dim=o.dim||0,win=o.win||0,seed=s.length+(o.seed||0);
  wc_panel(ctx,x,y-M3_VH/2,w,M3_VH,{kind:"tag",seed});
  if(win>0.01&&src!=="self")withA(ctx,win,()=>wc_panel(ctx,x,y-M3_VH/2,w,M3_VH,{kind:"tag",wash:m3_col(src),washA:0.45,seed}));
  m3_dot(ctx,x+26,y,src,1-0.5*dim);wc_T(ctx,s,x+46,y+10,{w:f.f?f.w:(win>0.5?800:f.w),size:28,f:f.f,col:dim>0.01?mix(WC_DARK,[146,142,152],dim):WC_DARK});return w;}
// values laid out left to right from x0, wrapping at x1, a line every 62 px from y0 (the first line's middle)
function m3_flow(keys,x0,x1,y0){const out={};let x=x0,y=y0;keys.forEach(k=>{const w=m3_vw(k);if(x>x0&&x+w>x1){x=x0;y+=62;}out[k]=[x,y];x+=w+14;});return out;}
// the person's record: a sheet, its header, and its rows' names; rows: [[label, y], ...]
function m3_sheet(ctx,x,y,w,h,rows,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"sheet",seed:o.seed||5});
  wc_T(ctx,"the person",x+30,y+58,{w:800,size:36,col:WC_DARK});if(o.sub)wc_T(ctx,o.sub,x+30+tw(ctx,"the person",36,800)+20,y+58,{w:600,size:28,col:WC_MUTED,a:o.subA==null?1:o.subA});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+30,y+84);ctx.lineTo(x+w-30,y+84);ctx.stroke();ctx.restore();
  rows.forEach(([lab,ly,a])=>{if(a!=null&&a<=0.01)return;wc_T(ctx,lab,x+30,ly,{w:600,size:28,col:WC_MUTED,a:a==null?1:a});});}
// the record as chapters 2 and 3 show it: a row for each field, its name on the left and its values to the right
const M3_FIELDS=[["name",["legal","alum","hrn","ron"]],["birth date",["dob","dobHR"]],["mobile",["mob","mobHR"]],["email",["eStudy","eWork","eOld","eNew"]]];
function m3_recLayout(x,y,w){const out={rows:[],at:{}};let yy=y+136;M3_FIELDS.forEach(([lab,keys])=>{const f=m3_flow(keys,x+230,x+w-26,yy);let last=yy;
    keys.forEach(k=>{out.at[k]=f[k];last=Math.max(last,f[k][1]);});out.rows.push([lab,yy+10]);yy=last+62+16;});out.h=yy-y+6;return out;}
// a value flying from a record into its place on the sheet: it lifts, arcs over and lands as p goes 0 to 1
function m3_fly(ctx,k,p,from,to,o){if(p<=0)return;const e=ease(clamp(p,0,1)),x=lerp(from[0],to[0],e),y=lerp(from[1],to[1],e)-Math.sin(e*Math.PI)*90;
  withA(ctx,clamp(p*4,0,1),()=>m3_val(ctx,x,y,k,o));}

/* ---------- 3. one order, hidden in the SQL; the newest wins ---------- */
// the model's SQL, as int_learner_timeline.sql has it (lines 166, 173 and 174): one order for every field; the comment wraps as an
// editor shows it, and the third source is left out
const M3_CODE={x:80,y:150,w:1210,h:420};
const M3_SQL=[["166","-- one value per attribute: the student system first,",1],["","   then the learning platform, then short courses",1],["","",0],
  ["173","coalesce(student_full_name, platform_full_name, …) as full_name,",0],["174","coalesce(student_email, platform_email, …) as email,",0]];
const m3_cw=()=>tw(m3_mc(),"0",28,500,"mono");
function m3_code(ctx,o){o=o||{};const C=M3_CODE,x=C.x,y=C.y,cx=x+100;wc_panel(ctx,x,y,C.w,C.h,{kind:"card",seed:7});
  wc_T(ctx,"int_learner_timeline.sql",x+34,y+56,{w:600,size:28,f:"mono",col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+30,y+82);ctx.lineTo(x+C.w-30,y+82);ctx.stroke();ctx.restore();
  M3_SQL.forEach(([n,s,cm],i)=>{const yy=y+150+i*54;if(n)wc_T(ctx,n,x+34,yy,{w:500,size:28,f:"mono",col:WC_MUTED,a:0.8});
    if(s)wc_T(ctx,s,cx,yy,{w:500,size:28,f:"mono",col:cm?WC_MUTED:WC_DARK});});
  // the sources, numbered as they're named: 1, 2, 3, above the first coalesce
  const cw=m3_cw(),cols=[9+8.5,28+9,48.5];(o.nums||[]).forEach((p,i)=>{if(p<=0.01)return;const nx=cx+cols[i]*cw,ny=y+150+2*54-8;withA(ctx,ease(clamp(p,0,1)),()=>{
    ctx.save();ctx.beginPath();ctx.arc(nx,ny,21,0,TAU);ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.6;ctx.stroke();ctx.restore();
    wc_T(ctx,String(i+1),nx,ny+10,{w:800,size:28,align:"center",col:WC_DARK});});});}
// HR's file, a sheet of paper stamped with the day it was sent; small, as it's sent
function m3_file(ctx,x,y,s,label,a){if(a<=0.01)return;const c=wc_kept("hrfile",300,200,q=>{q.translate(10,10);wc_wash(q,[[0,6],[262,0],[268,160],[4,168]],[250,246,236],{kind:"paper",lw:1.6,seed:21});
    q.strokeStyle=rgba(WC_PENCIL,0.3);q.lineWidth=1.6;for(let i=0;i<4;i++){q.beginPath();q.moveTo(24,30+i*24);q.lineTo(230-i*20,28+i*24);q.stroke();}wc_wash(q,wc_rect(24,6,10,156),WC_ROLE.tutor,{kind:"ribbon",flat:true,seed:5});});
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);withA(ctx,a,()=>{ctx.drawImage(c,-140,-90);wc_T(ctx,label,8,58,{w:600,size:28,f:"mono",align:"center",col:WC_ROLEINK.tutor});});ctx.restore();}
// a transcript: what it would print, under "the newest wins"
function m3_transcript(ctx,x,y,w,name,born){wc_panel(ctx,x,y,w,236,{kind:"card",seed:15});wc_T(ctx,"Transcript",x+32,y+56,{w:800,size:32,col:WC_DARK});
  wc_T(ctx,name,x+32,y+118,{w:800,size:34,col:WC_DARK});if(born)wc_T(ctx,born,x+32,y+164,{w:600,size:28,col:WC_INK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.25);ctx.lineWidth=1.6;for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(x+32,y+196+i*18);ctx.lineTo(x+w-60-i*80,y+196+i*18);ctx.stroke();}ctx.restore();}

/* ---------- 4. two names, both hers ---------- */
// her legal name, large, family name first, with its accents; and under each part, in pencil, what it is
const M3_NAME={x:300,y:140,w:1040,h:214};
function m3_nameParts(ctx){const x0=M3_NAME.x+M3_NAME.w/2-tw(ctx,"NGUYỄN Thị Linh",76,800)/2,sp=tw(ctx," ",76,800);let x=x0;
  return ["NGUYỄN","Thị","Linh"].map(s=>{const w=tw(ctx,s,76,800),r=[x,w];x+=w+sp;return r;});}
// a passport, open: a cover's edge, a photo and lines of print, no country's emblem
function m3_passport(ctx,x,y){ctx.drawImage(wc_kept("passport",460,280,q=>{q.translate(14,14);wc_wash(q,wc_rrPts(0,0,420,240,10),[62,84,110],{kind:"cover",lw:2,seed:3});
    wc_wash(q,wc_rect(12,10,196,220),[246,240,226],{kind:"page",lw:1.4,seed:5});wc_wash(q,wc_rect(212,10,196,220),[246,240,226],{kind:"page",lw:1.4,seed:7});
    wc_wash(q,wc_rect(34,40,96,124),[214,218,226],{kind:"build",lw:1.2,seed:9});wc_wash(q,wc_ell(82,86,22,26,24),[226,196,166],{kind:"head",lw:1,seed:11});
    wc_wash(q,[[46,164],[50,130],[82,116],[114,130],[118,164]],[96,116,150],{kind:"coat",lw:1,seed:13});
    q.strokeStyle=rgba(WC_PENCIL,0.45);q.lineWidth=2;for(let i=0;i<5;i++){q.beginPath();q.moveTo(232,46+i*34);q.lineTo(386-(i%2)*40,46+i*34);q.stroke();}
    for(let i=0;i<2;i++){q.beginPath();q.moveTo(34,190+i*18);q.lineTo(188,190+i*18);q.stroke();}}),x-14,y-14);}
// one of the other ways of writing her name: the name, and where it comes from
function m3_variant(ctx,x,y,w,name,src,note){wc_panel(ctx,x,y,w,128,{kind:"card",seed:name.length});wc_T(ctx,name,x+30,y+56,{w:800,size:40,col:WC_DARK});
  m3_dot(ctx,x+40,y+94,src);wc_T(ctx,note,x+62,y+104,{w:600,size:28,col:m3_ink(src)});}
// what each name is for: a transcript, a class list, an ID card, each small
function m3_use(ctx,x,y,w,title,line,o){o=o||{};wc_panel(ctx,x,y,w,120,{kind:"card",seed:title.length+3});wc_T(ctx,title,x+28,y+48,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,line,x+28,y+94,{w:700,size:30,col:WC_INK});if(o.photo)wc_white(ctx,"linh",x+w-48,y+108,0.1,[],{shadow:false});}

/* ---------- 5. a rule for each field ---------- */
// the YAML Jun writes: one field's rule at a time, each folding to a line once it's written. Source names are in their source's ink
const M3_Y={x:350,y:110,w:720,h:610};
const M3_YF=[["legal_name",[["    config:"],["      meta:"],["        trust: [",["student_system","sis"],"]"],["        checked_against: passport"]]],
  ["preferred_name",[["    config:"],["      meta:"],["        trust: [",["self_service","self"],"]"]]],
  ["birth_date",[["    config:"],["      meta:"],["        trust: [",["student_system","sis"],"]"],["        others: review"]]],
  ["mobile",[["    config:"],["      meta:"],["        rule: newest_confirmed"]]]];
// a line of YAML, typed in up to n characters; its parts are plain strings, or [text, source] in the source's ink
function m3_yline(ctx,x,y,parts,n){let cx=x,left=n;for(const p of parts){if(left<=0)break;const s=typeof p==="string"?p:p[0],sub=s.slice(0,left);
  wc_T(ctx,sub,cx,y,{w:500,size:28,f:"mono",col:typeof p==="string"?WC_DARK:m3_ink(p[1])});cx+=tw(ctx,s,28,500,"mono");left-=s.length;}}
// o.type[i]: field i typed in, 0 to 1; o.fold[i]: folded to its one line, 0 to 1
function m3_yaml(ctx,o){const Y=M3_Y,x=Y.x,y=Y.y,lh=44;wc_panel(ctx,x,y,Y.w,Y.h,{kind:"card",seed:9});
  wc_T(ctx,"_core_person__models.yml",x+30,y+54,{w:600,size:28,f:"mono",col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+30,y+80);ctx.lineTo(x+Y.w-30,y+80);ctx.stroke();ctx.restore();
  let yy=y+130;wc_T(ctx,"columns:",x+30,yy,{w:500,size:28,f:"mono",col:WC_DARK});yy+=lh;
  M3_YF.forEach(([name,lines],i)=>{const ty=o.type[i]||0;if(ty<=0)return;const fo=ease(clamp(o.fold[i]||0,0,1)),head="  - name: "+name,all=[head].concat(lines.map(l=>l.map(p=>typeof p==="string"?p:p[0]).join(""))),
      tot=all.reduce((a,s)=>a+s.length,0);let n=Math.round(tot*clamp(ty,0,1));
    m3_yline(ctx,x+30,yy,[head],n);if(fo>0.5)withA(ctx,(fo-0.5)*2,()=>wc_T(ctx,"…",x+30+tw(ctx,head+" ",28,500,"mono"),yy,{w:500,size:28,f:"mono",col:WC_MUTED}));n-=head.length;yy+=lh;
    lines.forEach(parts=>{const s=parts.map(p=>typeof p==="string"?p:p[0]).join("");if(fo<0.99)withA(ctx,1-fo,()=>m3_yline(ctx,x+30,yy,parts,n));n-=s.length;yy+=lh*(1-fo);});});}
// the default order, for every other field: three chips, an arrow between each; returns nothing. a: each chip's arrival, 0 to 1
const M3_CHAIN=["trusted source","newest confirmed","most complete"];
function m3_chain(ctx,cx,y,a){const ws=M3_CHAIN.map(s=>Math.round(tw(ctx,s,28,700)+44)),tot=ws.reduce((p,q)=>p+q,0)+2*70;let x=cx-tot/2;
  M3_CHAIN.forEach((s,i)=>{const xx=x,ai=a[i]||0;if(ai>0.01)arrive(ctx,xx+ws[i]/2,y,ai*2,0,()=>{wc_panel(ctx,xx,y-27,ws[i],54,{kind:"tag",wash:M3_GOLD,washA:0.35,seed:i+21});
      wc_T(ctx,s,xx+22,y+10,{w:700,size:28,col:WC_DARK});},{dy:8,d:1});
    x+=ws[i];if(i<2&&(a[i+1]||0)>0.01)m3_arrow(ctx,x+12,y,x+58,y,clamp((a[i+1]||0)*3,0,1),{lw:2.6,a:0.8});x+=70;});}
// what dbt writes from the YAML: the SQL, and the tests that read the same rules
function m3_sqlCard(ctx,x,y,w,p){wc_panel(ctx,x,y,w,232,{kind:"card",seed:23});wc_T(ctx,"SQL, written by dbt",x+30,y+52,{w:800,size:30,col:WC_DARK});
  const L=["min_by(legal_name, trust_rank)","  filter (where legal_name is not null)","  as legal_name,"];let n=Math.round(L.join("").length*clamp(p,0,1));
  L.forEach((s,i)=>{if(n<=0)return;wc_T(ctx,s.slice(0,n),x+30,y+110+i*44,{w:500,size:28,f:"mono",col:WC_DARK});n-=s.length;});}
function m3_testCard(ctx,x,y,w,a){wc_panel(ctx,x,y,w,196,{kind:"card",seed:25});wc_T(ctx,"tests",x+30,y+52,{w:800,size:30,col:WC_DARK});
  ["every value has a source","legal name only from a trusted source"].forEach((s,i)=>{const p=a[i]||0;if(p<=0)return;const yy=y+108+i*52;
    wc_tick(ctx,x+46,yy-10,30,WC_ROLEINK.alumna,clamp(p/0.4,0,1),4);withA(ctx,clamp((p-0.2)/0.5,0,1),()=>wc_T(ctx,s,x+78,yy,{w:600,size:28,col:WC_INK}));});}

/* ---------- 6. four emails, each for something ---------- */
// a contact point: the address, what it's for, where it comes from and when she last confirmed it
const M3_CP=[["eStudy","study","sis","confirmed Jul 2025"],["eWork","work","hr","since Feb 2023"],["eOld","personal","ao","confirmed 2019"],["eNew","personal","sis","confirmed Jul 2025"]];
function m3_contact(ctx,x,y,w,i,o){o=o||{};const [k,purpose,src,when]=M3_CP[i],[addr]=M3_V[k];wc_panel(ctx,x,y,w,118,{kind:"card",seed:i+31});
  wc_T(ctx,addr,x+30,y+50,{w:500,size:30,f:"mono",col:WC_DARK});
  const pw=Math.round(tw(ctx,purpose,28,800)+40);withA(ctx,o.pa==null?1:o.pa,()=>{wc_panel(ctx,x+w-28-pw,y+20,pw,46,{kind:"tag",wash:M3_GOLD,washA:0.3*(o.pl==null?1:o.pl),seed:i+7});
    wc_T(ctx,purpose,x+w-28-pw/2,y+52,{w:800,size:28,align:"center",col:WC_DARK});});
  withA(ctx,o.sa==null?1:o.sa,()=>{m3_dot(ctx,x+40,y+86,src);const sn=M3_SRC[src].name;wc_T(ctx,sn,x+62,y+96,{w:600,size:28,col:m3_ink(src)});
    wc_T(ctx," · "+when,x+62+tw(ctx,sn,28,600),y+96,{w:600,size:28,col:WC_MUTED});});}

/* ---------- 8. a rule change, seen before it runs ---------- */
// the rule card: a draft, dashed, until it's approved; then solid, with the day it starts, and the old version folded behind it
function m3_rule(ctx,x,y,o){const w=560,h=172,dr=1-(o.solid||0);if(o.v1>0.01)withA(ctx,o.v1,()=>{wc_panel(ctx,x+18,y-16,w,h,{kind:"card",seed:41});wc_T(ctx,"v1",x+w-6,y+18,{w:600,size:28,align:"right",col:WC_MUTED});});
  withA(ctx,dr,()=>wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_PENCIL,seed:43}));withA(ctx,1-dr,()=>wc_panel(ctx,x,y,w,h,{kind:"card",seed:43}));
  wc_T(ctx,"personal email",x+30,y+56,{w:800,size:32,col:WC_DARK});wc_T(ctx,typeOn("newest confirmed",o.type==null?1:o.type),x+30,y+104,{w:600,size:30,col:WC_INK});
  withA(ctx,dr,()=>wc_badge(ctx,x+30,y+142,"v2 · draft"));withA(ctx,1-dr,()=>wc_badge(ctx,x+30,y+142,"v2 · from 2 Nov 2026",{role:[150,206,150]}));}
// the dry run: every value the rule would change, three of them shown, Linh's first
const M3_DRY=[["Linh Nguyen","linh.nguyen2001@mail.example","linh.nguyen@mail.example"],["Sara Lind","sara.lind@mail.example","s.lind@mail.example"],["Kofi Asante","kofi.a@mail.example","kofi.asante@mail.example"]];
const M3_DX={x:640,y:330,w:1220,h:470};
function m3_dry(ctx,t,o){const D=M3_DX,x=D.x,y=D.y;wc_panel(ctx,x,y,D.w,D.h,{kind:"sheet",seed:45});wc_T(ctx,"dry run",x+34,y+62,{w:800,size:36,col:WC_DARK});
  withA(ctx,o.count||0,()=>{const s="1,284 values would change",sw=tw(ctx,s,30,700);wc_panel(ctx,x+D.w-60-sw-40,y+28,sw+40,52,{kind:"tag",wash:M3_AMBER,washA:0.35,seed:47});
    wc_T(ctx,s,x+D.w-60-sw-20,y+64,{w:700,size:30,col:WC_DARK});});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+34,y+100);ctx.lineTo(x+D.w-34,y+100);ctx.stroke();ctx.restore();
  const cw=m3_cw();M3_DRY.forEach(([n,a,b],i)=>{const p=o.rows[i]||0;if(p<=0.01)return;const yy=y+170+i*84,ax=x+260,bx=ax+a.length*cw+90;withA(ctx,clamp(p*2,0,1),()=>{
      if(i===0)wc_panel(ctx,x+20,yy-40,D.w-40,62,{kind:"tag",wash:WC_ROLE.alumna,washA:0.18,seed:49});
      wc_T(ctx,n,x+40,yy,{w:i===0?800:600,size:28,col:WC_DARK});wc_T(ctx,a,ax,yy,{w:500,size:28,f:"mono",col:WC_MUTED});
      m3_arrow(ctx,ax+a.length*cw+18,yy-9,bx-20,yy-9,clamp(p*1.5-0.3,0,1),{lw:2.6,a:0.8});wc_T(ctx,typeOn(b,clamp(p*1.6-0.6,0,1)),bx,yy,{w:500,size:28,f:"mono",col:WC_DARK});});
    const tk=o.ticks&&o.ticks[i]||0;if(tk>0)wc_tick(ctx,x+D.w-70,yy-12,40,M3_GOLDINK,tk,5);});
  withA(ctx,o.more||0,()=>wc_T(ctx,"and 1,281 more",x+40,y+170+3*84,{w:600,size:28,col:WC_MUTED}));}

/* ---------- 9. elsewhere ---------- */
const M3_PAN=[[60,"bank","a bank"],[990,"retail","a shop"]],M3_PY=96,M3_PW=870,M3_PH=600;
function m3_panel(ctx,i){const [x,ind,title]=M3_PAN[i];wc_panel(ctx,x,M3_PY,M3_PW,M3_PH,{kind:"card",seed:60+i});
  wc_panel(ctx,x+12,M3_PY+12,M3_PW-24,62,{kind:"card",wash:WC_IND[ind],washA:0.62,seed:62+i});wc_T(ctx,title,x+36,M3_PY+55,{w:800,size:32,col:WC_DARK});}
// a phone, its screen greeting her by the name she chose
function m3_phone(ctx,x,y,a){withA(ctx,a,()=>{ctx.drawImage(wc_kept("phone",250,440,q=>{q.translate(14,14);wc_wash(q,wc_rrPts(0,0,220,400,28),[60,62,74],{kind:"build",lw:1.8,seed:5});
    wc_wash(q,wc_rrPts(12,40,196,320,10),[236,242,250],{kind:"page",lw:1,seed:7});wc_wash(q,wc_rect(24,60,172,44),[52,112,204],{kind:"chipwash",line:false,a:0.6,seed:9});}),x-14,y-14);
  wc_T(ctx,"Hi, Linh",x+110,y+190,{w:800,size:36,align:"center",col:WC_DARK});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=2;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+40,y+250+i*30);ctx.lineTo(x+180-i*30,y+250+i*30);ctx.stroke();}ctx.restore();});}
