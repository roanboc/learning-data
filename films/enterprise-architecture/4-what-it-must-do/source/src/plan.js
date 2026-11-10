/* ===== What it must be able to do: the film's own pictures (prefixed d4_) =====
   The 1400s: the Andes at dusk, a road winding across the slopes, small relay posts along it, chasqui runners who carry a message
   from one post to the next, and a khipu, the knotted cords a message could be kept in. Today: a printed org chart, capability cards
   (amber paper while they're drafts, glass in the strategy layer's amber once confirmed, with a heat band once they're coloured),
   and a sketch of a street whose rooftops send power back to its transformer. The runners and the cords are drawn in the series'
   own style, with soft curves, weight and a gait, not in the style of Andean art (PLAYBOOK §2). */

const STR=LAY6[1][1],CAPP=[255,224,170],CAPD=[150,98,36],MOT=LAY6[0][1];
// how well a capability works today: green, amber, red; and grey for one nobody has evidence about yet
const HEAT={g:[110,200,120],a:[245,176,64],r:[232,92,80],n:[150,150,160]};

/* ---------- the 1400s: the Andes ---------- */
// three ridges, far to near, each a sum of slow waves; the far one keeps a little snow
const D4_RIDGES=[[520,170,1,[96,74,70]],[660,120,2,[62,44,38]],[800,80,3,[40,28,24]]];
const d4_ridgeY=(x,base,amp,seed)=>base-amp*(0.55*Math.sin(x*0.0042+seed*1.7)+0.3*Math.sin(x*0.011+seed*3.1)+0.15*Math.sin(x*0.027+seed*5.3));
function d4_andes(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  // the first stars, and the last of the light low in the sky
  const sk=ctx.createLinearGradient(0,0,0,760);sk.addColorStop(0,"rgba(24,26,52,0.55)");sk.addColorStop(1,"rgba(150,86,60,0.22)");ctx.fillStyle=sk;ctx.fillRect(-400,-300,W+800,1200);
  for(let i=0;i<90;i++){const x=hash(i,41)*(W+400)-200,y=hash(i,42)*420-120,tw_=0.5+0.5*Math.sin(t*(0.6+hash(i,43))+i);ctx.fillStyle="rgba(255,244,220,"+(0.12+0.35*hash(i,44)*tw_)+")";ctx.beginPath();ctx.arc(x,y,0.8+1.3*hash(i,45),0,TAU);ctx.fill();}
  D4_RIDGES.forEach(([base,amp,seed,col],k)=>{ctx.beginPath();ctx.moveTo(-400,H+400);for(let x=-400;x<=W+400;x+=16)ctx.lineTo(x,d4_ridgeY(x,base,amp,seed));ctx.lineTo(W+400,H+400);ctx.closePath();
    const g=ctx.createLinearGradient(0,base-amp,0,base+360);g.addColorStop(0,rgba(mix(col,[255,214,170],k===0?0.42:0.16),1));g.addColorStop(1,rgba(mix(col,[8,6,8],0.4),1));ctx.fillStyle=g;ctx.fill();
    // the last light along each crest
    ctx.save();ctx.strokeStyle=rgba([255,206,150],0.22-0.05*k);ctx.lineWidth=2.4;ctx.beginPath();for(let x=-400;x<=W+400;x+=16){const y=d4_ridgeY(x,base,amp,seed);x===-400?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.restore();});});}
// the road: a winding line across the near slopes, and the posts along it, at these fractions of its length
const D4_ROAD=(()=>{const K=[[-120,930],[160,880],[380,790],[600,830],[820,730],[1040,770],[1260,670],[1480,710],[1700,610],[1920,640],[2140,560]],pts=[];
  for(let i=0;i<K.length-1;i++){const[a,b]=[K[i],K[i+1]],m=[(a[0]+b[0])/2,(a[1]+b[1])/2+(i%2?-26:26)];for(let j=0;j<12;j++){const u=j/12,v=1-u;pts.push(P(v*v*a[0]+2*v*u*m[0]+u*u*b[0],v*v*a[1]+2*v*u*m[1]+u*u*b[1]));}}
  pts.push(P(K[K.length-1][0],K[K.length-1][1]));return mk(pts);})();
const D4_PU=[0.12,0.3,0.48,0.66,0.84];
// the road drawn up to p, as a pale, worn track; o.gap [u0,u1] leaves a stretch out (for one that's being rebuilt)
function d4_road(ctx,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||p<=0)return;withA(ctx,a,()=>{const n=220,gp=o.gap;
  [[16,"rgba(20,14,10,0.6)"],[9,"rgba(196,170,132,0.75)"],[3,"rgba(236,214,176,0.55)"]].forEach(([lw,c])=>{ctx.save();ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.lineCap="round";ctx.beginPath();let on=false;
    for(let i=0;i<=n;i++){const u=i/n*p;if(gp&&u>gp[0]&&u<gp[1]){on=false;continue;}const q=at(D4_ROAD,u);if(!on){ctx.moveTo(q.x,q.y);on=true;}else ctx.lineTo(q.x,q.y);}ctx.stroke();ctx.restore();});});}
// a stretch of road being rebuilt: stones set down one by one along it as p goes from 0 to 1, then the track over them
function d4_rebuild(ctx,u0,u1,p,a){if(a<=0.01)return;withA(ctx,a,()=>{const n=14;for(let i=0;i<n;i++){const q=clamp(p*n*1.2-i,0,1);if(q<=0)continue;const pt=at(D4_ROAD,lerp(u0,u1,(i+0.5)/n));
    ctx.save();ctx.translate(pt.x,pt.y-(1-ease(q))*30);ctx.rotate(pt.a);ctx.fillStyle=rgba(mix([170,150,124],[110,96,80],hash(i,4)),q);rr(ctx,-11,-7,22,14,4);ctx.fill();ctx.restore();}
  if(p>0.8){ctx.save();ctx.globalAlpha*=(p-0.8)/0.2;ctx.strokeStyle="rgba(236,214,176,0.6)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<=30;i++){const q=at(D4_ROAD,lerp(u0,u1,i/30));i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();ctx.restore();}});}
// a relay post: a small stone house with a thatched roof, beside the road at u (just behind where its runner waits)
function d4_post(ctx,u,s,a){if(a<=0.01)return;const q=at(D4_ROAD,u),x=q.x-78,y=q.y-10;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(0,4,62,10,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(-44,0,44,0);g.addColorStop(0,"#8f7a64");g.addColorStop(1,"#5d4c3e");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-44,0);ctx.lineTo(-42,-50);ctx.lineTo(42,-50);ctx.lineTo(44,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(40,30,24,0.55)";ctx.lineWidth=1.6;[[-40,-14,-6],[-10,-14,24],[16,-14,40],[-40,-30,-18],[-20,-30,14],[10,-30,40],[-40,-44,0],[2,-44,40]].forEach(([x0,yy,x1])=>{ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x1,yy);ctx.stroke();});
  ctx.fillStyle="#241a14";rr(ctx,-11,-32,22,32,4);ctx.fill();
  // the thatch: a soft-edged mound, with strands
  ctx.fillStyle="#b48a4c";ctx.beginPath();ctx.moveTo(-56,-46);ctx.quadraticCurveTo(-30,-92,0,-98);ctx.quadraticCurveTo(30,-92,56,-46);ctx.quadraticCurveTo(0,-38,-56,-46);ctx.fill();
  ctx.strokeStyle="rgba(120,84,40,0.8)";ctx.lineWidth=1.4;for(let i=-5;i<=5;i++){ctx.beginPath();ctx.moveTo(i*9,-94+Math.abs(i)*3.4);ctx.lineTo(i*11.2,-44);ctx.stroke();}
  ctx.fillStyle="rgba(255,226,170,0.25)";ctx.beginPath();ctx.moveTo(-50,-48);ctx.quadraticCurveTo(-28,-88,0,-94);ctx.quadraticCurveTo(-20,-80,-30,-48);ctx.fill();
  ctx.restore();});}
// a runner, feet at (x,y), facing dir (1 right, -1 left), s his scale; ph the phase of his stride (0 standing), col his tunic.
// Tapered limbs from strokes of falling width, a tunic whose hem swings, a light side and a shadow side, and a breath when he stands.
function d4_runner(ctx,x,y,s,ph,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const run=o.run==null?1:o.run,dir=o.dir||1,t=o.t||0,skin=[150,98,66],hair=[30,22,18];
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);
    const bob=run*-4*Math.abs(Math.sin(ph)),br=(1-run)*Math.sin(t*1.8+(o.seed||0))*1.2,lean=0.18*run,hip=[0,-62+bob],sh=[Math.sin(lean)*40,-102+bob+br];
    ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(0,2,26,5,0,0,TAU);ctx.fill();
    const V=(an,l)=>[Math.sin(an)*l,Math.cos(an)*l];
    const leg=(p,dk)=>{const th=run*0.75*Math.sin(p)+(1-run)*(dk?0.08:-0.08),kn=run*(0.25+0.95*Math.max(0,Math.sin(p+1.4)))+(1-run)*0.04,
        k=[hip[0]+V(th,30)[0],hip[1]+V(th,30)[1]],f=[k[0]+V(th-kn,31)[0],k[1]+V(th-kn,31)[1]],c=rgba(dk?mix(skin,[0,0,0],0.3):skin,1);
      ctx.strokeStyle=c;ctx.lineCap="round";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(hip[0],hip[1]);ctx.lineTo(k[0],k[1]);ctx.stroke();ctx.lineWidth=7.5;ctx.beginPath();ctx.moveTo(k[0],k[1]);ctx.lineTo(f[0],f[1]);ctx.stroke();
      // a sandal
      ctx.strokeStyle=rgba(dk?[70,50,34]:[104,76,50],1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f[0]-4,f[1]+1);ctx.lineTo(f[0]+9,f[1]+1);ctx.stroke();};
    const arm=(p,dk)=>{const ua=-run*0.85*Math.sin(p)+(1-run)*(dk?0.12:-0.05),el=run*1.25+(1-run)*0.2,e=[sh[0]+V(ua,24)[0],sh[1]+V(ua,24)[1]],h=[e[0]+V(ua+el,22)[0],e[1]+V(ua+el,22)[1]];
      ctx.strokeStyle=rgba(dk?mix(skin,[0,0,0],0.3):skin,1);ctx.lineCap="round";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(sh[0],sh[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();ctx.lineWidth=5.5;ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(h[0],h[1]);ctx.stroke();return h;};
    leg(ph+Math.PI,true);arm(ph,true);leg(ph,false);
    // the tunic: shoulders to just above the knee, its hem swinging with the stride
    const sw=run*5*Math.sin(ph*2),g=ctx.createLinearGradient(-20,0,20,0);g.addColorStop(0,rgba(mix(col,[255,236,200],0.18),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.32),1));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sh[0]-15,sh[1]+2);ctx.quadraticCurveTo(sh[0],sh[1]-5,sh[0]+15,sh[1]+2);ctx.quadraticCurveTo(hip[0]+20,hip[1]-14,hip[0]+19+sw,hip[1]+12);
    ctx.quadraticCurveTo(hip[0],hip[1]+18,hip[0]-19+sw*0.6,hip[1]+12);ctx.quadraticCurveTo(hip[0]-20,hip[1]-14,sh[0]-15,sh[1]+2);ctx.fill();
    // one plain band at the hem
    ctx.strokeStyle=rgba(mix(col,[60,30,20],0.45),0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hip[0]-18+sw*0.6,hip[1]+6);ctx.quadraticCurveTo(hip[0],hip[1]+12,hip[0]+18+sw,hip[1]+6);ctx.stroke();
    // the head: a little forward when he runs, hair to the nape
    const hx=sh[0]+3+4*run,hy=sh[1]-17;ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hx,hy,10.5,12,0.1,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(hair,1);ctx.beginPath();ctx.ellipse(hx-2.5,hy-4,11,9.5,0.2,Math.PI*0.9,Math.PI*2.05);ctx.fill();ctx.beginPath();ctx.ellipse(hx-8,hy+1,4,9,0.15,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(255,230,200,0.18)";ctx.beginPath();ctx.ellipse(hx+5,hy+2,4,6,0,0,TAU);ctx.fill();
    const hand=arm(ph+Math.PI,false);
    // the message he carries: a small bundle of cords, glowing faintly so it can be followed
    if(o.msg){glow(ctx,hand[0],hand[1],26,[255,214,150],0.5*o.msg);ctx.fillStyle=rgba([238,220,180],o.msg);ctx.beginPath();ctx.arc(hand[0],hand[1],4.5,0,TAU);ctx.fill();}
    ctx.restore();});}
// a khipu: a main cord with pendant cords hanging from it, each with knots at different heights, swaying a little
const D4_KCOL=[[236,226,204],[150,104,64],[92,64,44],[184,96,64],[236,226,204],[120,88,60],[200,170,120],[150,104,64],[92,64,44],[236,226,204],[184,96,64],[120,88,60]];
function d4_khipu(ctx,x,y,w,t,p,a){if(a<=0.01)return;withA(ctx,a,()=>{const n=D4_KCOL.length,sag=26;
  ctx.save();ctx.lineCap="round";
  D4_KCOL.forEach((c,i)=>{const q=clamp(p*n*0.9-i*0.7,0,1);if(q<=0)return;const fx=x+w*(i+0.5)/n,fy=y+sag*Math.sin(Math.PI*(i+0.5)/n),L=(150+60*hash(i,8))*ease(q),sw=Math.sin(t*1.1+i*0.7)*6;
    ctx.strokeStyle=rgba(c,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(fx,fy);ctx.quadraticCurveTo(fx+sw*0.5,fy+L*0.5,fx+sw,fy+L);ctx.stroke();
    ctx.strokeStyle="rgba(0,0,0,0.25)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(fx+1.5,fy);ctx.quadraticCurveTo(fx+sw*0.5+1.5,fy+L*0.5,fx+sw+1.5,fy+L);ctx.stroke();
    // knots: a long knot, or a few single ones, at their place values
    const nk=1+Math.floor(hash(i,9)*3);for(let k=0;k<nk;k++){const f=clamp(0.25+0.22*k+0.1*hash(i,10+k),0,0.95);if(f*L<8)continue;const kx=fx+sw*f*f,ky=fy+L*f;
      ctx.fillStyle=rgba(mix(c,[0,0,0],0.25),1);ctx.beginPath();ctx.ellipse(kx,ky,6.5,hash(i,20+k)>0.5?10:6.5,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(c,[255,255,255],0.2),0.6);ctx.beginPath();ctx.ellipse(kx-2,ky-2,2.4,3,0,0,TAU);ctx.fill();}});
  // the main cord over the top
  ctx.strokeStyle="#d8c6a0";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x-30,y-8);ctx.quadraticCurveTo(x+w/2,y+sag*2,x+w+30,y-8);ctx.stroke();
  ctx.strokeStyle="rgba(90,70,50,0.5)";ctx.lineWidth=2;ctx.setLineDash([7,6]);ctx.beginPath();ctx.moveTo(x-30,y-8);ctx.quadraticCurveTo(x+w/2,y+sag*2,x+w+30,y-8);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();});}

/* ---------- today: the org chart ---------- */
const D4_ORG=["Network Operations","Customer Service","Finance","Technology","Regulatory Affairs"];
// a box of a printed org chart: dark ink on paper, its name wrapped to fit; o.hi lights it; o.dash draws it as an outline only
function d4_obox(ctx,cx,cy,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||28;ctx.save();
  if(!o.dash){ctx.fillStyle=o.fill||"rgba(246,240,228,1)";rr(ctx,cx-w/2,cy-h/2,w,h,6);ctx.fill();}
  if(o.hi){ctx.shadowColor="rgba(255,190,90,0.9)";ctx.shadowBlur=18*o.hi;}
  ctx.strokeStyle=o.edge||"rgba(48,52,72,0.85)";ctx.lineWidth=o.lw||2.4;if(o.dash)ctx.setLineDash(o.dash);rr(ctx,cx-w/2,cy-h/2,w,h,6);ctx.stroke();ctx.restore();
  if(name){const ls=wrapT(ctx,name,0,0,w-26,{size:sz,w:700,measure:true}),lh=sz*1.14;ls.forEach((l,i)=>T(ctx,l,cx,cy-((ls.length-1)*lh)/2+sz*0.36+i*lh,{w:700,size:sz,align:"center",color:o.ink||"rgba(36,40,56,0.95)"}));}});}
// where the org chart's boxes sit, for d4_org(x,y,w,h): the chief executive's, then the five below
function d4_orgAt(x,y,w,h){const cx=x+w/2,bw=Math.min(300,(w-80)/5-24),gap=(w-80-bw*5)/4;return{ceo:[cx,y+70],kids:D4_ORG.map((_,i)=>[x+40+bw/2+i*(bw+gap),y+h-92]),bw};}
// the org chart, printed on a sheet: o.p draws it (the chief executive first, then the lines, then the five boxes); o.lit[i] each box's light
function d4_org(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,A=d4_orgAt(x,y,w,h);withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{plain:true,rot:o.rot==null?-0.004:o.rot});
  T(ctx,"Organisation chart",x+28,y+48,{w:800,size:28,color:"rgba(60,58,62,0.9)"});
  d4_obox(ctx,A.ceo[0],A.ceo[1],300,66,"Chief executive",{a:clamp(p*4,0,1)});
  const lq=clamp(p*4-1,0,1);if(lq>0){ctx.save();ctx.strokeStyle="rgba(48,52,72,0.7)";ctx.lineWidth=2.4;const yb=(A.ceo[1]+33+A.kids[0][1]-46)/2;ctx.beginPath();ctx.moveTo(A.ceo[0],A.ceo[1]+33);ctx.lineTo(A.ceo[0],lerp(A.ceo[1]+33,yb,clamp(lq*2,0,1)));
    if(lq>0.5){const f=(lq-0.5)*2;ctx.moveTo(lerp(A.ceo[0],A.kids[0][0],f),yb);ctx.lineTo(lerp(A.ceo[0],A.kids[4][0],f),yb);if(f>=1)A.kids.forEach(([kx,ky])=>{ctx.moveTo(kx,yb);ctx.lineTo(kx,ky-46);});}ctx.stroke();ctx.restore();}
  A.kids.forEach(([kx,ky],i)=>{const q=clamp(p*4-2-i*0.3,0,1);if(q>0)d4_obox(ctx,kx,ky,A.bw,92,D4_ORG[i],{a:q,hi:o.lit?o.lit[i]||0:0});});});}

/* ---------- today: capabilities ---------- */
// a capability: amber paper while it's a draft, glass in the strategy layer's amber as o.glass goes to 1. With a header (o.kind!==false),
// it names its kind beside ArchiMate's glyph for a capability; without, the glyph sits at the left, for small cards. o.line: a second line;
// o.st: its status dot; o.src: a source clipped on; o.heat ("g", "a", "r", "n") and o.heatA: how well it works today, as a band down
// its left edge and a tint; o.owner: who answers for it, on a gold tag under it (o.ownerA its arrival; o.noOwner draws it dashed and red)
function d4_cap(ctx,cx,cy,w,h,title,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const gl=clamp(o.glass||0,0,1),sz=o.size||32,lsz=o.lsize||28,head=o.kind!==false,ha=clamp(o.heatA||0,0,1),hc=HEAT[o.heat||"n"];
  withA(ctx,a,()=>{sticky(ctx,cx,cy,w,h,"",{col:CAPP,edge:STR,glass:gl,rot:o.rot==null?0:o.rot,st:o.st,src:o.src,srcA:o.srcA});
    const x0=cx-w/2,y0_=cy-h/2;
    if(ha>0)withA(ctx,ha,()=>{ctx.save();ctx.fillStyle=rgba(hc,0.16);rr(ctx,x0,y0_,w,h,gl>0.5?12:2);ctx.fill();ctx.fillStyle=rgba(hc,1);ctx.fillRect(x0,y0_+(gl>0.5?10:0),14,h-(gl>0.5?20:0));
      ctx.shadowColor=rgba(hc,0.8);ctx.shadowBlur=18;ctx.strokeStyle=rgba(hc,0.95);ctx.lineWidth=3.5;rr(ctx,x0-4,y0_-4,w+8,h+8,14);ctx.stroke();ctx.restore();});
    if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(o.hiCol||STR,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(o.hiCol||STR,0.8);ctx.shadowBlur=16;rr(ctx,x0-7,y0_-7,w+14,h+14,15);ctx.stroke();ctx.restore();});
    if(o.noOwner)withA(ctx,o.noOwner,()=>{ctx.save();ctx.strokeStyle="rgba(232,110,96,0.95)";ctx.lineWidth=3;ctx.setLineDash([12,9]);rr(ctx,x0-7,y0_-7,w+14,h+14,15);ctx.stroke();ctx.restore();});
    const ink=gl>0.5?INK:INKD,gc=gl>0.5?STR:CAPD,pad=ha>0?14:0;let top=y0_;
    if(head){archGlyph(ctx,"capability",x0+46+pad,y0_+36,22,gc);T(ctx,o.kindText||"capability",x0+90+pad,y0_+47,{f:"mono",w:600,size:28,color:rgba(gc,1),deco:o.deco});
      ctx.fillStyle=rgba(gc,0.35);ctx.fillRect(x0+16+pad,y0_+70,w-32-pad,1.5);top=y0_+72;}
    else archGlyph(ctx,"capability",x0+34+pad,cy,15,gc);
    const tx=head?x0+26+pad:x0+62+pad,tw_=head?w-52-pad:w-(o.st!=null?96:76)-pad,ls=wrapT(ctx,title,0,0,tw_,{size:sz,w:800,measure:true}),lh=sz*1.15,tot=ls.length*lh+(o.line?lsz*1.35:0),mid=(top+cy+h/2)/2,y1=mid-tot/2+sz*0.8;
    ls.forEach((l,i)=>T(ctx,l,tx,y1+i*lh,{w:800,size:sz,color:rgba(ink,0.94),deco:o.deco}));
    if(o.line)T(ctx,o.line,tx,y1+ls.length*lh+lsz*0.3,{w:600,size:lsz,color:rgba(ink,0.78),deco:o.deco});
    if(o.owner&&(o.ownerA==null||o.ownerA>0))withA(ctx,o.ownerA==null?1:o.ownerA,()=>tag(ctx,cx,cy+h/2+34,o.owner,o.ownerCol||TRUST,{align:"center",size:28}));});}

/* ---------- today: a street ---------- */
// a street sketched in marker on a sheet: houses with solar panels on their roofs, a pole with its transformer, and power that now flows
// back up the line from the rooftops (f: 0..1 brings the arrows in); a question on the transformer as q goes to 1
function d4_street(ctx,x,y,w,h,t,f,q){sheet(ctx,x,y,w,h,{rot:0.006});const g=(fx,fy)=>[x+fx*w,y+fy*h];
  // the line along the street, and the pole with its transformer
  const[px,py]=g(0.14,0.62);marker(ctx,[[px,py-150],[px,py+20]],1,{lw:5});marker(ctx,[g(0.14,0.3),g(0.96,0.3)],1,{lw:2.6});
  ctx.save();ctx.fillStyle="rgba(60,64,78,0.92)";rr(ctx,px-30,py-130,60,74,8);ctx.fill();ctx.strokeStyle="rgba(30,30,40,0.9)";ctx.lineWidth=2;rr(ctx,px-30,py-130,60,74,8);ctx.stroke();ctx.restore();
  // four houses, each with panels on its roof
  [0.34,0.52,0.7,0.88].forEach((fx,i)=>{const[hx,hy]=g(fx,0.66),hw=w*0.13,hh=h*0.16;
    marker(ctx,[[hx-hw/2,hy],[hx-hw/2,hy-hh],[hx,hy-hh-hh*0.7],[hx+hw/2,hy-hh],[hx+hw/2,hy],[hx-hw/2,hy]],1,{lw:3,seed:i+2});
    marker(ctx,[[hx,hy-hh-hh*0.7],[hx,g(0,0.3)[1]]],1,{lw:1.8,seed:i+9});
    ctx.save();ctx.translate(hx-hw*0.24,hy-hh-hh*0.36);ctx.rotate(-0.95);ctx.fillStyle="rgba(46,80,140,0.9)";ctx.fillRect(-hw*0.2,-7,hw*0.4,14);ctx.strokeStyle="rgba(200,220,255,0.7)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(0,7);ctx.stroke();ctx.restore();
    // power going back up the line, towards the transformer
    const fa=clamp(f*1.6-i*0.2,0,1);if(fa>0){const u=((t*0.5+i*0.27)%1),sx=lerp(hx-12,px+40,u),sy=g(0,0.3)[1]-14;withA(ctx,fa*Math.sin(Math.PI*u),()=>{ctx.fillStyle="rgba(232,92,80,0.95)";ctx.beginPath();ctx.moveTo(sx-10,sy);ctx.lineTo(sx+4,sy-8);ctx.lineTo(sx+4,sy+8);ctx.closePath();ctx.fill();});}});
  if(q>0)withA(ctx,q,()=>{glow(ctx,px,py-94,60,[232,92,80],0.35);T(ctx,"?",px,py-78,{w:800,size:48,align:"center",color:"rgba(232,92,80,1)"});});}
