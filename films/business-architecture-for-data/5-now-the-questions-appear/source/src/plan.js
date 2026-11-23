/* ===== Now the questions appear: the film's own pictures (prefixed d8_, from when it was film 8 of The map before the data) =====
   Iran, in the 1960s: the slope at the mountains' foot cut away, as the series draws a qanat (shared/src/ba.js), before its qanat is
   dug: the ground, its strata and its groundwater; a damp patch and greener plants where an expert looks for water; the trial well,
   sunk by two muqannis, its earth brought up in leather buckets by a windlass, and the hollow scooped at its foot, where the water
   gathers and the buckets are dipped for a few days; how fast the hollow fills, day by day; the tunnel, dug only then, from the foot of
   the slope up to the well, its shafts sunk as it goes; and when an answer comes, as a line through the work: the trial well, the
   choice whether to dig, the tunnel. On the wall and on the films' dark glass: the reporting team's backlog as index cards; requests
   traced up to a decision, a capability and a goal; goals traced down to decisions, questions and measures; a measure's definition,
   its home on the map and its owner; households falling behind; and data products on each side of the wall between the network and
   retail. The desert is drawn in the series' own style, not in the style of Persian art (PLAYBOOK §2), and its people are silhouettes
   (Wulff, "The Qanats of Iran", Scientific American, April 1968, is the source for the trial well; see ../../script.md). */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; and red, for what reaches nothing
const D8_NET=[132,176,255],D8_RET=[255,150,186],D8_RED=[232,96,84];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d8_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a note should keep on one line
const d8_nb=s=>s.replace(/ /g," ");
// a tag that ends at x (its right edge) instead of starting there
const d8_tagR=(ctx,x,y,s,col)=>tag(ctx,x-(tw(ctx,s,28,700)+26),y,s,col,{size:28});

/* ---------- the slope, before the qanat, and as it's dug ---------- */
// the trial well's foot, just into the damp ground (the groundwater's top is at ba_yw(BA_XM), 640), and how wide the well is: about
// three feet, at the scale of the series' people (B1_S, 0.14, in What the business owns)
const D8_WB=652,D8_WW=12;
// The slope cut away (the series' section: the same ground, strata, stones and groundwater as ba_section, drawn the same way), before
// the qanat and as it's dug. o.shaft (0..1): the trial well at the head (BA_XM), dug from the surface down to the damp ground; o.cav
// (0..1): the hollow scooped at its foot; o.lvl (0..1): the water gathered in it; o.ghost (0..1): the tunnel not yet dug, as a
// dashed outline from the well to the outlet, and o.trickle (0..1), the thin water it might bring; o.dug (0..1): the tunnel, dug from
// the outlet up the slope to the well, each shaft sunk as it reaches it; o.deep (0..1): the well taken down to the tunnel's head once
// the tunnel reaches it; o.flow (0..1): the water then run down the tunnel; o.wet (0..1): the groundwater's light; o.damp (0..1): a
// damp patch on the slope over the well; o.green (0..1): greener plants there; o.hiW (0..1): the trial well lit; t moves the water
function d8_ground(ctx,t,o){o=o||{};const X0=-1400,X1=3300,dug=clamp(o.dug||0,0,1),xf=lerp(BA_XO,BA_XM,dug),sh=clamp(o.shaft||0,0,1),deep=clamp(o.deep||0,0,1);
  // the ground in cut: a warm, dark earth, with strata
  ctx.save();ctx.beginPath();ctx.moveTo(X0,ba_ys(X0));for(let x=X0;x<=X1;x+=40)ctx.lineTo(x,ba_ys(x));ctx.lineTo(X1,1900);ctx.lineTo(X0,1900);ctx.closePath();
  const eg=ctx.createLinearGradient(0,300,0,1300);eg.addColorStop(0,"rgba(152,100,62,1)");eg.addColorStop(0.35,"rgba(104,66,46,1)");eg.addColorStop(1,"rgba(28,30,56,1)");ctx.fillStyle=eg;ctx.fill();ctx.clip();
  // a sandy band along the surface, then layers of earth and gravel that follow the ground's slope, with stones in them
  ctx.beginPath();ctx.moveTo(X0,ba_ys(X0)-4);for(let x=X0;x<=X1;x+=40)ctx.lineTo(x,ba_ys(x)-4);for(let x=X1;x>=X0;x-=40)ctx.lineTo(x,ba_ys(x)+30);ctx.closePath();ctx.fillStyle="rgba(196,150,100,0.42)";ctx.fill();
  for(let i=0;i<18;i++){const d=58+i*40+hash(i,716)*14,k=hash(i,717);ctx.strokeStyle="rgba(255,226,180,"+(0.025+0.04*k)+")";ctx.lineWidth=2+k*5;ctx.beginPath();
    for(let x=X0;x<=X1;x+=40){const y=lerp(ba_ys(x)+d,560+d*0.9,0.35)+Math.sin(x*0.004+i*1.7)*8;x===X0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  for(let i=0;i<170;i++){const x=hash(i,711)*3200-600,y=ba_ys(x)+26+hash(i,712)*760,r=2+hash(i,713)*6;ctx.fillStyle="rgba("+(hash(i,714)>0.5?"58,38,26,":"176,134,98,")+(0.22+0.3*hash(i,715))+")";ctx.beginPath();ctx.ellipse(x,y,r*1.4,r,hash(i,719)*3,0,TAU);ctx.fill();}
  // the groundwater: earth soaked with it, from the mountain down to where its top passes under the tunnel
  // (here to the section's far end, not to 1500 as ba_section, whose camera never shows the plain this far down)
  const wl=o.wet==null?1:o.wet;ctx.beginPath();ctx.moveTo(X0,ba_yw(X0));for(let x=X0;x<=X1;x+=30)ctx.lineTo(x,ba_yw(x));ctx.lineTo(X1,1900);ctx.lineTo(X0,1900);ctx.closePath();
  const wg=ctx.createLinearGradient(0,600,0,1100);wg.addColorStop(0,rgba(BA_WATER,0.30*wl+0.06));wg.addColorStop(1,rgba([20,96,180],0.5*wl+0.1));ctx.fillStyle=wg;ctx.fill();
  ctx.fillStyle=rgba([170,220,255],0.22*wl);for(let i=0;i<120;i++){const x=hash(i,721)*1900-400,y=ba_yw(x)+14+hash(i,722)*360;ctx.beginPath();ctx.arc(x,y,1.6+hash(i,723)*1.6,0,TAU);ctx.fill();}
  ctx.strokeStyle=rgba(BA_WATER,0.55*wl+0.15);ctx.lineWidth=2.5;ctx.setLineDash([12,10]);ctx.beginPath();for(let x=X0;x<=X1;x+=30)x===X0?ctx.moveTo(x,ba_yw(x)):ctx.lineTo(x,ba_yw(x));ctx.stroke();ctx.setLineDash([]);
  // a damp patch just under the surface over the well: the earth a little darker there
  if((o.damp||0)>0.01){const g=ctx.createRadialGradient(BA_XM+4,ba_ys(BA_XM+4)+6,2,BA_XM+4,ba_ys(BA_XM+4)+6,46);g.addColorStop(0,rgba([58,40,34],0.62*o.damp));g.addColorStop(1,rgba([58,40,34],0));
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(BA_XM+4,ba_ys(BA_XM+4)+8,48,16,Math.atan(0.44),0,TAU);ctx.fill();}
  // the tunnel not yet dug: its outline, dashed, from the well down to the outlet, and the trickle it might bring
  // (its head well and its shafts dashed too, so it reads as a qanat: a chain of shafts down to a tunnel)
  const gh=o.ghost||0;if(gh>0.01){ctx.save();ctx.fillStyle=rgba([16,14,28],0.22*gh);ctx.beginPath();ctx.moveTo(BA_XM,ba_yt(BA_XM)-BA_TH);ctx.lineTo(BA_XO,ba_yt(BA_XO)-BA_TH);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+2);
    ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+8);ctx.lineTo(BA_XO,ba_yt(BA_XO)+3);ctx.lineTo(BA_XM,ba_yt(BA_XM)+3);ctx.closePath();ctx.fill();
    ctx.setLineDash([12,10]);ctx.strokeStyle=rgba([255,226,180],0.78*gh);ctx.lineWidth=3.5;ctx.beginPath();
    ctx.moveTo(BA_XM,ba_yt(BA_XM)-BA_TH);ctx.lineTo(BA_XO,ba_yt(BA_XO)-BA_TH);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+2);ctx.moveTo(BA_XM,ba_yt(BA_XM)+3);ctx.lineTo(BA_XO,ba_yt(BA_XO)+3);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+8);ctx.stroke();
    ctx.lineWidth=2.5;ctx.strokeStyle=rgba([255,226,180],0.5*gh);ctx.beginPath();BA_SH.forEach(x=>{ctx.moveTo(x,ba_ys(x)+4);ctx.lineTo(x,ba_yt(x)-BA_TH);});ctx.stroke();
    const tr=o.trickle||0;if(tr>0.01){ctx.setLineDash([3,11]);ctx.lineDashOffset=-t*14;ctx.strokeStyle=rgba(BA_WATER,0.85*tr*gh);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(BA_XM+40,ba_yt(BA_XM+40)-1);ctx.lineTo(BA_XO+28,ba_yt(BA_XO)-1);ctx.stroke();}
    ctx.restore();}
  // the shafts the tunnel has reached, as it's dug up the slope from the outlet (the trial well, at the head, is drawn below)
  BA_SH.forEach((x,i)=>{if(i===0||dug<=0.001||x<xf-8)return;const ys=ba_ys(x),yt=ba_yt(x);ctx.fillStyle="rgba(14,12,24,0.96)";ctx.fillRect(x-4,ys,8,yt-ys);});
  // the tunnel: a dark channel, BA_TH high, sloping gently to the outlet, dug from the outlet up to xf
  if(dug>0.001){ctx.fillStyle="rgba(16,14,28,0.97)";ctx.beginPath();ctx.moveTo(xf,ba_yt(xf)-BA_TH);ctx.lineTo(BA_XO,ba_yt(BA_XO)-BA_TH);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+2);ctx.lineTo(BA_XO+30,ba_ys(BA_XO+30)+8);ctx.lineTo(BA_XO,ba_yt(BA_XO)+3);ctx.lineTo(xf,ba_yt(xf)+3);ctx.closePath();ctx.fill();}
  // the trial well: from the surface down as it's dug, then down to the tunnel's head once the tunnel reaches it
  const ysW=ba_ys(BA_XM),yb=lerp(lerp(ysW,D8_WB,sh),ba_yt(BA_XM),deep);
  if(sh>0.001){ctx.fillStyle="rgba(14,12,24,0.96)";ctx.fillRect(BA_XM-D8_WW/2,ysW,D8_WW,yb-ysW);
    if((o.hiW||0)>0.01){ctx.fillStyle=rgba(BAC,0.35*o.hiW);ctx.fillRect(BA_XM-D8_WW/2-2,ysW,D8_WW+4,yb-ysW);}}
  // the hollow scooped at its foot, and the water gathering in it, with drops seeping in from the damp ground
  const cv=clamp(o.cav||0,0,1)*(1-deep);if(cv>0.01){const cy=D8_WB+4,rx=26*cv,ry=14*cv;ctx.fillStyle="rgba(14,12,24,0.96)";ctx.beginPath();ctx.ellipse(BA_XM,cy,rx,ry,0,0,TAU);ctx.fill();
    const lv=clamp(o.lvl||0,0,1);if(lv>0.01){ctx.save();ctx.beginPath();ctx.ellipse(BA_XM,cy,rx,ry,0,0,TAU);ctx.clip();const top=cy+ry-2*ry*lv;ctx.fillStyle=rgba(BA_WATER,0.92);ctx.fillRect(BA_XM-rx,top,2*rx,cy+ry-top);
      ctx.fillStyle="rgba(230,248,255,0.75)";ctx.fillRect(BA_XM-rx,top,2*rx,1.6);ctx.restore();glow(ctx,BA_XM,cy,30,BA_WATER,0.25*lv);}
    for(let k=0;k<5;k++){const ph=(t*0.6+hash(k,751))%1,x=BA_XM+(k-2)*9;ctx.fillStyle=rgba([200,236,255],0.7*(1-ph)*cv);ctx.beginPath();ctx.arc(x,cy-ry+ph*ry*1.2,1.6,0,TAU);ctx.fill();}}
  // the water in the tunnel, once the well is reached: seeping in along the wet reach, then running on its floor towards the outlet
  const fl=clamp(o.flow||0,0,1);if(dug>=0.999&&fl>0.005){const x1=lerp(BA_XM,BA_XO+30,fl);
    ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=5;ctx.shadowColor=rgba(BA_WATER,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(BA_XM,ba_yt(BA_XM));ctx.lineTo(x1,ba_yt(x1));ctx.stroke();ctx.shadowBlur=0;
    for(let k=0;k<26;k++){const u=(t*0.05+k/26)%1,x=lerp(BA_XM,BA_XO,u);if(x>x1)continue;ctx.fillStyle="rgba(230,248,255,0.65)";ctx.beginPath();ctx.ellipse(x,ba_yt(x)-1,6,1.6,0.03,0,TAU);ctx.fill();}
    for(let k=0;k<8;k++){const x=BA_XM+20+k*42,ph=(t*0.7+hash(k,731))%1;if(ba_yw(x)>ba_yt(x)-BA_TH||x>x1)continue;ctx.fillStyle=rgba([200,236,255],0.7*(1-ph));ctx.beginPath();ctx.arc(x,ba_yt(x)-BA_TH+ph*(BA_TH-2),1.8,0,TAU);ctx.fill();}}
  ctx.restore();
  // the surface: a crisp line of light along the ground; greener plants over the well; and each shaft's ring of dug earth, seen side on
  // as two low humps, the trial well's growing as it's dug, the others' as the tunnel reaches them
  ctx.save();ctx.strokeStyle="rgba(255,226,180,0.55)";ctx.lineWidth=2.5;ctx.beginPath();for(let x=X0;x<=X1;x+=40)x===X0?ctx.moveTo(x,ba_ys(x)):ctx.lineTo(x,ba_ys(x));ctx.stroke();
  const gr=o.green||0;if(gr>0.01){ctx.lineCap="round";[[208,9],[222,12],[236,8],[270,11],[284,13],[298,9],[312,7]].forEach(([x,h],k)=>{const ys=ba_ys(x);ctx.strokeStyle=rgba(mix([118,150,70],BA_GREEN,0.6),0.95*clamp(gr*3-k*0.3,0,1));ctx.lineWidth=2;
      for(let j=-2;j<=2;j++){ctx.beginPath();ctx.moveTo(x+j*1.5,ys+1);ctx.quadraticCurveTo(x+j*2.5,ys-h*0.6,x+j*4+Math.sin(t*0.9+k+j)*0.8,ys-h*(1-Math.abs(j)*0.14));ctx.stroke();}});}
  BA_SH.forEach((x,i)=>{const k=i===0?Math.max(sh,dug>=0.999?1:0):(dug>0.001&&x>=xf-8?1:0);if(k<=0.01)return;const ys=ba_ys(x),r=(i===0?34:26)*Math.sqrt(k),h=(i===0?16:12)*k;
    [-1,1].forEach(sd=>{const cx=x+sd*(r*0.55+3);ctx.fillStyle="rgba(176,132,92,1)";ctx.beginPath();ctx.moveTo(cx-r*0.5,ys+1);ctx.quadraticCurveTo(cx,ys-h*2,cx+r*0.5,ys+1);ctx.closePath();ctx.fill();
      ctx.strokeStyle="rgba(255,226,180,0.4)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx-r*0.5,ys+1);ctx.quadraticCurveTo(cx,ys-h*2,cx+r*0.5,ys+1);ctx.stroke();});});
  ctx.restore();}
// the windlass over the trial well (the series' ba_windlass), its leather bucket full of earth, or of water as it comes up from the
// hollow (o.water, 0..1); p (0..1) is the bucket's way up, from the well's foot to the top
function d8_windlass(ctx,x,ys,s,p,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ba_windlass(ctx,x,ys,s,p,t,o);
  const wv=o.water||0;if(wv>0.01){const by=lerp(o.depth||260,-60,clamp(p,0,1)),yt=ys+s*(by-22);withA(ctx,a*wv,()=>{ctx.fillStyle=rgba(BA_WATER,1);ctx.beginPath();ctx.ellipse(x,yt+s*1.5,s*16,s*4.5,0,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(230,248,255,0.8)";ctx.beginPath();ctx.ellipse(x-s*4,yt+s*0.5,s*6,s*1.4,0,0,TAU);ctx.fill();});}}
// an oil lamp set down in the well, lighting the digger beside it (as in What the business owns)
function d8_lamp(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(150,104,60,1)";ctx.beginPath();ctx.ellipse(x,y-3*s,9*s,4*s,0,0,TAU);ctx.fill();
  const fl=0.85+0.15*Math.sin(t*9);ctx.fillStyle="rgba(255,214,140,1)";ctx.beginPath();ctx.ellipse(x+6*s,y-9*s,2.6*s,6*s*fl,0.3,0,TAU);ctx.fill();
  glow(ctx,x+6*s,y-9*s,64*s,[255,200,120],0.42);glow(ctx,x+6*s,y-9*s,18*s,[255,230,170],0.6);});}

/* ---------- up close: how fast the water gathers, and when the answer comes ---------- */
// How fast the hollow fills, day by day, in the films' dark glass: a bar for each day, drawn as o.days[i] (0..1) says, the line a
// trickle would reach, and its name; 600 by 330, at x, y
const D8_DAYS=[0.66,0.72,0.69],D8_TRICKLE=0.16;
function d8_tally(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=600,h=330,days=o.days||[0,0,0],bx=x+150,bw=410;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,BA_WATER,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(8,14,24,0.95)"});
    T(ctx,"how fast the hollow fills",x+30,y+58,{w:700,size:30,color:rgba(INK,0.96)});
    days.forEach((p,i)=>{const yy=y+122+i*58;T(ctx,"day "+(i+1),x+30,yy+10,{w:600,size:28,color:rgba(SOFT,1)});
      ctx.fillStyle="rgba(255,255,255,0.07)";rr(ctx,bx,yy-15,bw,30,10);ctx.fill();const q=ease(clamp(p,0,1));
      if(q>0.005){ctx.fillStyle=rgba(BA_WATER,0.9);rr(ctx,bx,yy-15,Math.max(20,bw*D8_DAYS[i]*q),30,10);ctx.fill();}});
    // where a trickle would reach
    const xt=bx+bw*D8_TRICKLE;ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle=rgba([255,226,180],0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(xt,y+92);ctx.lineTo(xt,y+272);ctx.stroke();ctx.restore();
    T(ctx,"a trickle",xt,y+306,{w:600,size:28,align:"center",color:rgba([255,226,180],1)});});}
// a trial well, as a small sign: the ring of dug earth, the shaft, the windlass over it and a bucket on its rope; s is its height
function d8_wellIcon(ctx,x,y,s,a){a=a==null?1:a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);const k=s/80;ctx.scale(k,k);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.fillStyle="rgba(196,150,104,1)";[-1,1].forEach(sd=>{ctx.beginPath();ctx.moveTo(sd*9,4);ctx.quadraticCurveTo(sd*21,-14,sd*34,4);ctx.closePath();ctx.fill();});
  ctx.strokeStyle="rgba(255,226,180,0.95)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,4);ctx.lineTo(-8,40);ctx.moveTo(8,4);ctx.lineTo(8,40);ctx.stroke();
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-24,2);ctx.lineTo(-19,-40);ctx.moveTo(24,2);ctx.lineTo(19,-40);ctx.stroke();
  ctx.fillStyle="rgba(214,164,110,1)";rr(ctx,-22,-48,44,12,5);ctx.fill();
  ctx.strokeStyle=rgba(BA_WATER,1);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-38);ctx.lineTo(0,22);ctx.stroke();
  ctx.fillStyle=rgba(BA_WATER,1);ctx.beginPath();ctx.moveTo(-6,22);ctx.lineTo(6,22);ctx.lineTo(5,32);ctx.lineTo(-5,32);ctx.closePath();ctx.fill();ctx.restore();});}
// When the answer comes, in the work: the trial well, then the choice whether to dig, then the tunnel. u (0..1) moves the answer from
// after the tunnel, where it's too late, to before the choice, where it can still be acted on; o.hi lights the choice
function d8_when(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=250;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,[220,230,255],{glow:12,ea:0.6,fill:"rgba(8,12,24,0.95)"});
  const ly=y+150,xa=x+140,xb=x+w*0.5,xc=x+w-120,e=ease(clamp(u,0,1));ctx.save();ctx.strokeStyle="rgba(220,230,255,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xa,ly);ctx.lineTo(xc,ly);ctx.stroke();ctx.restore();
  ctx.save();ctx.fillStyle="rgba(8,12,24,1)";ctx.beginPath();ctx.arc(xa,ly,26,0,TAU);ctx.fill();ctx.restore();d8_wellIcon(ctx,xa,ly+4,44);
  // the tunnel: a short stretch of it, dark, edged in the light of the earth it's cut through
  ctx.save();ctx.fillStyle="rgba(16,14,28,1)";ctx.strokeStyle="rgba(255,226,180,0.9)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(xc-34,ly-14);ctx.lineTo(xc+34,ly-8);ctx.lineTo(xc+34,ly+8);ctx.lineTo(xc-34,ly+2);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba(BA_WATER,0.9);ctx.fillRect(xc-30,ly-1,60,3);ctx.restore();
  if(o.hi>0.01)glow(ctx,xb,ly,64,BUS,0.55*o.hi);ctx.save();ctx.translate(xb,ly);ctx.fillStyle="rgba(8,12,24,1)";ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(22,0);ctx.lineTo(0,22);ctx.lineTo(-22,0);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(BUS,1);ctx.lineWidth=3;ctx.stroke();ctx.restore();
  T(ctx,"the trial well",xa,ly+62,{w:700,size:28,align:"center",color:rgba(SOFT,1)});T(ctx,"choose whether to dig",xb,ly+62,{w:700,size:28,align:"center",color:rgba(BUS,1)});T(ctx,"the tunnel",xc,ly+62,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
  const ax=lerp(xc,lerp(xa,xb,0.5),e),col=mix(D8_RED,TRUST,e);tag(ctx,ax,ly-58,"the answer",col,{align:"center",size:28});ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ly-36);ctx.lineTo(ax,ly-12);ctx.stroke();ctx.restore();
  withA(ctx,1-sstep(0.3,0.5,u),()=>T(ctx,"too late",x+w-30,y+52,{w:800,size:30,align:"right",color:rgba(D8_RED,1)}));withA(ctx,sstep(0.6,0.85,u),()=>T(ctx,"in time",x+30,y+52,{w:800,size:30,color:rgba(TRUST,1)}));});}

/* ---------- the wall and the glass: requests, decisions, questions, measures ---------- */
// the film's own glyphs, beside the series' (archGlyph): a decision is a diamond, as flowcharts and BPMN draw one; a question, a
// speech bubble with a question mark; a measure, a dial, with its needle at v (ArchiMate has no element for one, so this is the
// series' own); a data product, a hexagon
function d8_glyph(ctx,kind,x,y,s,col,v){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="decision"){ctx.beginPath();ctx.moveTo(x,y-s*0.8);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x,y+s*0.8);ctx.lineTo(x-s*0.8,y);ctx.closePath();ctx.stroke();}
  else if(kind==="question"){rr(ctx,x-s*0.8,y-s*0.7,s*1.6,s*1.1,s*0.35);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.3,y+s*0.4);ctx.lineTo(x-s*0.45,y+s*0.8);ctx.lineTo(x+s*0.05,y+s*0.4);ctx.stroke();
    T(ctx,"?",x,y+s*0.18,{w:800,size:s,align:"center",color:rgba(col,1),deco:1});}
  else if(kind==="measure"){const cy=y+s*0.38;ctx.beginPath();ctx.arc(x,cy,s*0.85,Math.PI,0);ctx.stroke();for(let k=0;k<=4;k++){const an=Math.PI+k*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*s*0.85,cy+Math.sin(an)*s*0.85);ctx.lineTo(x+Math.cos(an)*s*0.62,cy+Math.sin(an)*s*0.62);ctx.stroke();}
    const an=Math.PI*(1.15+0.7*clamp(v==null?0.55:v,0,1));ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x+Math.cos(an)*s*0.7,cy+Math.sin(an)*s*0.7);ctx.stroke();ctx.beginPath();ctx.arc(x,cy,s*0.14,0,TAU);ctx.fill();}
  else if(kind==="product"){ctx.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*TAU/6;ctx.lineTo(x+Math.cos(an)*s*0.85,y+Math.sin(an)*s*0.85);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.25,0,TAU);ctx.fill();}
  else archGlyph(ctx,kind,x,y,s,col);ctx.restore();}
// an element of the model with the film's glyphs as well as the series': archEl, then the glyph where archEl puts its own
function d8_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const own=["decision","question","measure","product"].includes(kind);
  archEl(ctx,x,y,w,h,name,col,own?"none":kind,o);if(own){const gs=o.gs||13;withA(ctx,a,()=>d8_glyph(ctx,kind,x+w-gs-11,y+gs+9,gs,col,o.v));}}
// a dashed place where an element should be, empty: with a question mark, or a few words
function d8_slot(ctx,x,y,w,h,col,a,label){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,8);ctx.stroke();ctx.restore();
  if(label)T(ctx,label,x+w/2,y+h/2+10,{w:700,size:28,align:"center",color:rgba(col,0.95)});else T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(col,0.95)});});}
// a rubber stamp on paper, small: deco when it's too small to read
function d8_stamp(ctx,x,y,s,col,size,rot,a,deco){if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,size,800)+size*0.9,h=size*1.5;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=Math.max(1.2,size*0.1);
  rr(ctx,-w/2,-h/2,w,h,size*0.2);ctx.stroke();T(ctx,s,0,size*0.36,{w:800,size,align:"center",color:rgba(col,0.9),deco});ctx.restore();});}
// A request from the backlog, on an index card: its number, what it asks for, and (o.urgent) a red stamp. o.deco: the card is drawn
// small, as texture; o.dead (0..1) greys it; o.hi lights it in gold; o.p writes its words
function d8_card(ctx,cx,cy,w,h,num,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||28,deco=o.deco?1:0,dead=o.dead||0,hd=Math.max(sz*1.2,30);withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot==null?(hash(num,870)-0.5)*0.05:o.rot);
  if(o.hi>0.01){ctx.save();ctx.shadowColor=rgba(TRUST,0.9*o.hi);ctx.shadowBlur=24*o.hi;ctx.strokeStyle=rgba(TRUST,0.95*o.hi);ctx.lineWidth=4;ctx.strokeRect(-w/2-6,-h/2-6,w+12,h+12);ctx.restore();}
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(mix([244,239,226],[132,128,124],dead*0.6),1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.strokeStyle="rgba(200,70,70,"+(0.6*(1-dead*0.5))+")";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-w/2,-h/2+hd);ctx.lineTo(w/2,-h/2+hd);ctx.stroke();
  ctx.strokeStyle="rgba(90,130,190,0.16)";ctx.lineWidth=1;for(let yy=-h/2+hd+sz*1.15;yy<h/2-4;yy+=sz*1.15){ctx.beginPath();ctx.moveTo(-w/2+6,yy);ctx.lineTo(w/2-6,yy);ctx.stroke();}
  T(ctx,"#"+(num<10?"0":"")+num,-w/2+12,-h/2+hd-sz*0.32,{f:"mono",w:500,size:sz*0.95,color:"rgba(160,60,56,0.92)",deco});
  // as many lines as the card holds; the last ends in an ellipsis when the text runs on
  const b0=-h/2+hd+sz*1.02,lh=sz*1.15,fit=Math.max(1,Math.floor((h/2-sz*0.22-b0)/lh)+1);let ls=wrapT(ctx,text,0,0,w-26,{size:sz,w:700,measure:true});
  if(ls.length>fit){ls=ls.slice(0,fit);let l=ls[fit-1];while(l.length>1&&tw(ctx,l+"…",sz,700)>w-26)l=l.slice(0,-1);ls[fit-1]=l.replace(/[\s,]+$/,"")+"…";}
  const p=o.p==null?1:o.p;let left=text.length*p;ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;
    T(ctx,s_,-w/2+13,b0+i*lh,{w:700,size:sz,color:rgba(mix([44,42,46],[92,90,92],dead),0.95),deco});});
  if(o.urgent)d8_stamp(ctx,w/2-sz*2.1,-h/2+hd*0.5,"urgent",[206,52,46],sz*0.8,-0.14,o.urgent,deco);
  if(dead>0.01&&o.x)withA(ctx,dead,()=>{ctx.strokeStyle=rgba(D8_RED,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w/2+8,-h/2+8);ctx.lineTo(w/2-8,h/2-8);ctx.stroke();});
  ctx.restore();});}
// a line traced through points, drawn up to p, with a bright head while it's drawing (o.lw, o.a)
function d8_trace(ctx,pts,p,col,o){o=o||{};if(p<=0)return;const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=L[L.length-1]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length;i++){if(L[i]<=d){ctx.lineTo(pts[i][0],pts[i][1]);hx=pts[i][0];hy=pts[i][1];}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1);hx=lerp(pts[i-1][0],pts[i][0],f);hy=lerp(pts[i-1][1],pts[i][1],f);ctx.lineTo(hx,hy);break;}}ctx.stroke();ctx.restore();
  if(p<1&&!o.nohead){glow(ctx,hx,hy,22,col,0.8);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(hx,hy,4.5,0,TAU);ctx.fill();}}
// an owner, named on a gold tag with ArchiMate's actor glyph: the person who says what a number means
function d8_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const s="owner · "+name,ts=28,w=tw(ctx,s,ts,700)+70,h=48,X=o.align==="center"?x-w/2:x;glass(ctx,X,y-h/2,w,h,h/2,TRUST,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(20,16,6,0.92)"});
  archGlyph(ctx,"actor",X+26,y-2,13,TRUST);T(ctx,s,X+48,y+ts*0.36,{w:700,size:ts,color:rgba(TRUST,1)});});}
// a small question, as a chip: what a data product answers
function d8_q(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+64,h=46;glass(ctx,x-w/2,y-h/2,w,h,h/2,INF,{glow:8,ea:0.8,fill:"rgba(16,10,8,0.92)"});d8_glyph(ctx,"question",x-w/2+24,y-2,10,INF);
  T(ctx,s,x-w/2+44,y+10,{w:700,size:28,color:rgba(mix(INF,INK,0.35),1)});});}

/* ---------- counting: households, reports, a definition, working days ---------- */
// households, as a map draws them: a grid of small houses; o.behind[i] (0..1) marks one falling behind (amber); o.help: the ones the
// hardship register counts, ringed when o.ring > 0
function d8_homes(ctx,x,y,cols,rows,cell,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c,hx=x+c*cell+cell/2,hy=y+r*cell+cell/2,s=cell*0.32,b=o.behind?o.behind[i]||0:0,col=mix([150,170,200],[255,190,90],b);
    if(b>0.01)glow(ctx,hx,hy,cell*0.6,[255,180,80],0.35*b);ctx.fillStyle=rgba(col,0.35+0.4*b);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx-s,hy+s);ctx.lineTo(hx-s,hy-s*0.2);ctx.lineTo(hx,hy-s);ctx.lineTo(hx+s,hy-s*0.2);ctx.lineTo(hx+s,hy+s);ctx.closePath();ctx.fill();ctx.stroke();}
  // o.help: the homes the register counts, each ringed on its own
  if(o.ring>0.01&&o.help)withA(ctx,o.ring,()=>{ctx.save();ctx.strokeStyle=rgba(APL,0.95);ctx.lineWidth=3;ctx.shadowColor=rgba(APL,0.7);ctx.shadowBlur=12;
    o.help.forEach(i=>{const hx=x+(i%cols)*cell+cell/2,hy=y+Math.floor(i/cols)*cell+cell/2;rr(ctx,hx-cell*0.45,hy-cell*0.45,cell*0.9,cell*0.9,cell*0.22);ctx.stroke();});ctx.restore();});});}
// a report, as a dashboard tile: its name, a big number and what it counts; o.tick: a gold tick on it
function d8_report(ctx,x,y,w,h,name,num,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:14+12*(o.hi||0),ea:0.8,fill:"rgba(8,12,24,0.95)"});
  T(ctx,name,x+w/2,y+48,{f:"mono",w:500,size:28,align:"center",color:rgba(col,1)});T(ctx,num,x+w/2,y+h*0.62,{w:800,size:88,align:"center",color:rgba(INK,0.97)});T(ctx,o.unit||"working days",x+w/2,y+h-26,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
  if(o.tick>0.01)kt_gtick(ctx,x+w-2,y+2,18,o.tick);});}
// A measure's definition, on paper: a kicker, the measure's name, then its fields, written in as o.p goes to 1 (rows: [field, value,
// height]); o.hi outlines it in gold. Returns its height
function d8_def(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;const h=128+rows.reduce((s,r)=>s+r[2],0);if(a<=0.01)return h;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.006:o.rot,plain:true});
  if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
  T(ctx,"measure · definition",x+28,y+44,{f:"mono",w:500,size:28,color:"rgba(176,92,50,0.95)"});d8_glyph(ctx,"measure",x+w-40,y+34,14,[176,92,50],0.4);T(ctx,title,x+28,y+92,{w:800,size:34,color:"rgba(40,38,40,0.97)"});
  let yy=y+128;rows.forEach(([k,v,hh],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,k,x+28,yy+30,{w:800,size:28,color:"rgba(120,90,56,0.95)"});wrapT(ctx,v,x+150,yy+30,w-178,{size:28,w:700,color:"rgba(40,38,40,0.92)",lh:34});});yy+=hh;});});return h;}
// a clock face: where a count starts or stops
function d8_clock(ctx,x,y,r,col,a,t){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(8,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.5);ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-r*0.65);ctx.moveTo(x,y);ctx.lineTo(x+r*0.45,y+r*0.15);ctx.stroke();ctx.restore();});}
// a bracket over a span of the timeline (above the line when up > 0, its ends turned towards it), with its label on the bracket, in the middle
function d8_span(ctx,xa,xb,y,up,col,p,label,a){if(a<=0.01||p<=0)return;withA(ctx,a,()=>{const xe=lerp(xa,xb,ease(clamp(p,0,1))),d=up>0?-1:1;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(xa,y-d*16);ctx.lineTo(xa,y);ctx.lineTo(xe,y);if(p>=0.98)ctx.lineTo(xb,y-d*16);ctx.stroke();ctx.restore();if(label)withA(ctx,clamp((p-0.9)/0.1,0,1),()=>tag(ctx,(xa+xb)/2,y,label,col,{align:"center",size:30}));});}

/* ---------- building: reports, data products, the wall ---------- */
// a small dashboard, as one person's report: a few bars and a line, and a dot in its keeper's colour
function d8_dash(ctx,x,y,w,h,seed,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||APL;glass(ctx,x,y,w,h,12,col,{glow:8,ea:0.6,fill:"rgba(8,12,24,0.94)"});ctx.fillStyle=rgba(col,0.55);
  for(let i=0;i<5;i++){const bh=(0.25+0.65*hash(seed*7+i,880))*(h*0.42);ctx.fillRect(x+16+i*(w*0.11),y+h-16-bh,w*0.07,bh);}ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<=8;i++){const xx=x+w*0.62+i*(w*0.3/8),yy=y+h*0.3+Math.sin(i*1.3+seed)*h*0.12;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  if(o.keeper){ctx.fillStyle=rgba(o.keeper,1);ctx.beginPath();ctx.arc(x+w-16,y+16,8,0,TAU);ctx.fill();}});}
// the network's side tinted blue and retail's rose, with their names (as in Who does it)
function d8_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D8_NET,0.0));lg.addColorStop(1,rgba(D8_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D8_RET,0.08));rg.addColorStop(1,rgba(D8_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,120,{w:800,size:40,align:"center",color:rgba(D8_NET,1)});T(ctx,"retail",1440,120,{w:800,size:40,align:"center",color:rgba(D8_RET,1)});});});}
// the wall between them, drawn down from the top as p goes to 1; o.hi lights it
function d8_wall(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,y0=160,y1=y0+(880-y0)*ease(p);withA(ctx,a,()=>{const col=[226,232,246];ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*(o.hi||0);
  ctx.fillStyle=rgba(col,0.12+0.1*(o.hi||0));ctx.fillRect(948,y0,24,y1-y0);ctx.shadowBlur=0;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,y1);});ctx.stroke();ctx.restore();});}
