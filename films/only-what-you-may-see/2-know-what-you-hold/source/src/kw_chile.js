/* ===== Know what you hold: Chile, 2012 and 2016 =====
   The opening story and the film's end, painted in the module's night light: a supermarket aisle at evening, its shelves cool and its
   packets muted, no brand and no word on any of them, the petrol sky through a high window at the aisle's end; a parent with one
   cereal box; the box's back, its numbers in small print, as Chile's packs print them, and its front, where from 2016 a black octagon
   says what it's high in. The octagon is drawn as Chile's packs carry it (the Ministry of Health's warning, credited in NOTICE.md):
   black, a white rim, "ALTO EN" and the nutrient, and "MINISTERIO DE SALUD" in small letters (decoration on purpose), with an
   English tag beside it. No real product is drawn, and no child: the harm is a row of school backpacks. */

/* ---------------------------------------------------------------- the aisle, painted once
   One-point perspective: the vanishing point at the aisle's end; the shelves on both walls carry rows of packets, muted, darker with
   depth; long lights in the ceiling; a glossy floor; a high window at the end, the petrol sky in it. */
const KW_V=[960,452],KW_F=880;
function kw_proj(X,Y,z){return[KW_V[0]+X/z*KW_F,KW_V[1]+Y/z*KW_F];}
const KW_PACK=[[118,132,124],[132,112,96],[104,116,138],[138,128,104],[116,98,112],[96,124,120],[142,120,92],[110,120,104]];
function kw_paintAisle(c,o){o=o||{};const R=ag_rnd(o.seed||31),RO=ag_rnd(77),fog=z=>clamp((z-1.6)/11,0,1);
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(7,19,23)");g.addColorStop(0.5,"rgb(12,32,37)");g.addColorStop(1,"rgb(8,22,26)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the end wall and its high window, the petrol sky in it
  const zE=13,[ex0,ey0]=kw_proj(-2.1,-2.3,zE),[ex1,ey1]=kw_proj(2.1,1.62,zE);c.fillStyle="rgb(14,36,41)";c.fillRect(ex0,ey0,ex1-ex0,ey1-ey0);
  const [wx0,wy0]=kw_proj(-1.6,-2.0,zE),[wx1,wy1]=kw_proj(1.6,-0.85,zE);g=c.createLinearGradient(0,wy0,0,wy1);g.addColorStop(0,"rgb(20,58,66)");g.addColorStop(1,"rgb(34,84,90)");
  c.fillStyle=g;c.fillRect(wx0,wy0,wx1-wx0,wy1-wy0);for(let i=0;i<14;i++){c.fillStyle="rgba(200,240,240,"+(0.25+R()*0.4).toFixed(2)+")";c.beginPath();c.arc(wx0+R()*(wx1-wx0),wy0+R()*(wy1-wy0)*0.7,0.6+R()*1.1,0,TAU);c.fill();}
  c.strokeStyle="rgba(6,16,20,0.9)";c.lineWidth=3;c.strokeRect(wx0,wy0,wx1-wx0,wy1-wy0);c.beginPath();c.moveTo((wx0+wx1)/2,wy0);c.lineTo((wx0+wx1)/2,wy1);c.stroke();
  // the ceiling and the floor
  const ceil=-2.3,floor=1.62;for(const [Y,top] of [[ceil,true],[floor,false]]){c.beginPath();const a=kw_proj(-2.1,Y,1.2),b=kw_proj(2.1,Y,1.2),d=kw_proj(2.1,Y,zE),e=kw_proj(-2.1,Y,zE);
    c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();g=c.createLinearGradient(0,top?0:H,0,KW_V[1]);
    g.addColorStop(0,top?"rgb(9,24,28)":"rgb(10,28,32)");g.addColorStop(1,top?"rgb(15,40,45)":"rgb(18,46,50)");c.fillStyle=g;c.fill();}
  // long lights in the ceiling, and their gloss on the floor
  for(let z=1.6;z<zE;z+=1.15){const a=kw_proj(-0.32,ceil,z),b=kw_proj(0.32,ceil,z+0.55),A=fog(z);c.save();c.shadowColor="rgba(190,245,245,0.9)";c.shadowBlur=26*(1-A*0.6);
    c.fillStyle="rgba(214,248,246,"+(0.82-0.5*A).toFixed(3)+")";c.fillRect(a[0],b[1],b[0]-a[0],Math.max(1.5,a[1]-b[1]));c.restore();
    const f=kw_proj(0,floor,z+0.25),rg=c.createRadialGradient(f[0],f[1],0,f[0],f[1],160/z*1.6);rg.addColorStop(0,"rgba(170,230,230,"+(0.16-0.1*A).toFixed(3)+")");rg.addColorStop(1,"rgba(170,230,230,0)");
    c.save();c.translate(f[0],f[1]);c.scale(1.6,0.45);c.translate(-f[0],-f[1]);c.fillStyle=rg;c.fillRect(f[0]-300,f[1]-300,600,600);c.restore();}
  // the shelves on both walls: their uprights, five shelves each, and the packets on them, far ones first
  const lv=[-1.25,-0.62,0.0,0.62,1.24],top=-1.85;
  for(const side of [-1,1]){const X=2.1*side;
    // the wall behind the packets
    let a=kw_proj(X,top,1.2),b=kw_proj(X,floor,1.2),d=kw_proj(X,floor,zE),e=kw_proj(X,top,zE);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();
    g=c.createLinearGradient(a[0],0,e[0],0);g.addColorStop(0,"rgb(10,27,31)");g.addColorStop(1,"rgb(16,42,47)");c.fillStyle=g;c.fill();
    for(let z=zE-0.3;z>1.25;z-=0.0){const nz=z;let zz=nz;
      // one bay of packets per shelf, from far to near
      const step=0.34+R()*0.12;for(let k=0;k<lv.length;k++){const yb=k<lv.length-1?lv[k+1]-0.06:floor-0.18,yt=lv[k]+0.05+R()*0.18,dz=step*(0.75+R()*0.2);
        const col=KW_PACK[(R()*KW_PACK.length)|0],A=fog(zz),cc=mix(mix(col,[40,70,76],0.35),[16,42,47],A*0.85);const sh=R();
        const p0=kw_proj(X-side*0.02,yt,zz),p1=kw_proj(X-side*0.02,yt,zz-dz),p2=kw_proj(X-side*0.02,yb,zz-dz),p3=kw_proj(X-side*0.02,yb,zz);
        c.beginPath();if(sh<0.16){const m=kw_proj(X-side*0.02,yt-0.035,zz-dz/2);c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(m[0],m[1],p1[0],p1[1]);}else{c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);}
        c.lineTo(p2[0],p2[1]);c.lineTo(p3[0],p3[1]);c.closePath();const pg=c.createLinearGradient(p0[0],p0[1],p3[0],p3[1]);pg.addColorStop(0,rgba(mix(cc,[255,255,255],0.10),1));pg.addColorStop(1,rgba(mix(cc,[0,0,0],0.22),1));
        c.fillStyle=pg;c.fill();c.strokeStyle="rgba(4,12,16,0.55)";c.lineWidth=1;c.stroke();
        // a pale band on some packets, as a label would be, with no word on it
        if(R()<0.5&&zz>2.7){const q0=kw_proj(X-side*0.021,lerp(yt,yb,0.32),zz-dz*0.12),q1=kw_proj(X-side*0.021,lerp(yt,yb,0.5),zz-dz*0.88);
          c.fillStyle=rgba(mix(cc,[230,236,230],0.35),0.55);c.fillRect(Math.min(q0[0],q1[0]),q0[1],Math.abs(q1[0]-q0[0]),q1[1]-q0[1]);}
        // from 2016, an octagon on some packets' fronts (its own dice, so the packets stay as they were in 2012)
        if(o.oct&&zz>1.7&&zz<9&&RO()<o.oct&&!kw_inRect(kw_proj(X-side*0.022,lerp(yt,yb,0.3),zz-dz*0.3),o.clear)){const zc=zz-dz*0.3,Yc=lerp(yt,yb,0.3),r=Math.min(dz,yb-yt)*0.2;c.beginPath();
          for(let j=0;j<8;j++){const an=Math.PI/8+j*Math.PI/4,q=kw_proj(X-side*0.022,Yc+Math.sin(an)*r,zc+Math.cos(an)*r);j?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}
          c.closePath();c.fillStyle=rgba(mix([12,12,14],[16,42,47],A*0.6),0.95);c.fill();c.strokeStyle=rgba(mix([238,238,232],[40,70,76],A*0.7),0.9);c.lineWidth=Math.max(1,3.2/zz);c.stroke();}}
      zz-=step;z=zz;if(z<1.25)break;}
    // the shelves' edges, catching the ceiling's light
    for(const Y of lv.concat([floor-0.18])){const s0=kw_proj(X-side*0.04,Y,1.2),s1=kw_proj(X-side*0.04,Y,zE);c.strokeStyle="rgba(150,214,216,0.30)";c.lineWidth=2.4;c.beginPath();c.moveTo(s0[0],s0[1]);c.lineTo(s1[0],s1[1]);c.stroke();}}
  // haze down the aisle, and a pool of light where the parent stands
  const hz=c.createRadialGradient(KW_V[0],KW_V[1],0,KW_V[0],KW_V[1],520);hz.addColorStop(0,"rgba(90,170,178,0.16)");hz.addColorStop(1,"rgba(90,170,178,0)");c.fillStyle=hz;c.fillRect(0,0,W,H);
  for(const [x,y,r,a] of (o.pools||[])){const pg=c.createRadialGradient(x,y,0,x,y,r);pg.addColorStop(0,"rgba(130,220,224,"+a+")");pg.addColorStop(1,"rgba(130,220,224,0)");c.save();c.translate(x,y);c.scale(1,0.42);c.translate(-x,-y);c.fillStyle=pg;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}}
AG_PLACES.kwAisle=c=>kw_paintAisle(c,{pools:[[700,1000,520,0.10]]});
// the same aisle in 2016: some packets carry an octagon, more carry none
// (none where the chapter's kicker stands, top left, so its words stay clear)
AG_PLACES.kwAisle16=c=>kw_paintAisle(c,{pools:[[700,1000,520,0.10]],oct:0.3,clear:[0,0,560,250]});
// whether a point is inside a box [x0, y0, x1, y1] (no box: never)
function kw_inRect(p,r){return !!r&&p[0]>=r[0]&&p[0]<=r[2]&&p[1]>=r[1]&&p[1]<=r[3];}
// a shelf close up, out of focus behind the box: packets in rows, muted, soft, and dark enough that the tags and cards over it read
AG_PLACES.kwShelf=c=>{const R=ag_rnd(47),[bc,bx]=[mkCanvas(W,H),null];const b=bc.getContext("2d");
  let g=b.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(9,24,28)");g.addColorStop(1,"rgb(14,36,41)");b.fillStyle=g;b.fillRect(0,0,W,H);
  for(let row=0;row<4;row++){const y0=-60+row*300;let x=-40;while(x<W+40){const w=150+R()*170,h=200+R()*70,col=mix(KW_PACK[(R()*KW_PACK.length)|0],[40,70,76],0.4);
      const pg=b.createLinearGradient(0,y0+260-h,0,y0+260);pg.addColorStop(0,rgba(mix(col,[255,255,255],0.12),1));pg.addColorStop(1,rgba(mix(col,[0,0,0],0.25),1));b.fillStyle=pg;
      rr(b,x,y0+260-h,w,h,6);b.fill();if(R()<0.5){b.fillStyle=rgba(mix(col,[230,236,230],0.35),0.5);b.fillRect(x+w*0.12,y0+260-h*0.62,w*0.76,h*0.16);}x+=w+14;}
    b.fillStyle="rgba(150,214,216,0.28)";b.fillRect(0,y0+262,W,5);b.fillStyle="rgba(5,14,18,0.8)";b.fillRect(0,y0+267,W,30);}
  dp_blurDraw(c,bc,0,0,W,H,0,0,W,H,14);c.fillStyle="rgba(6,18,22,0.6)";c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(960,560,200,960,560,1100);v.addColorStop(0,"rgba(120,210,214,0.10)");v.addColorStop(1,"rgba(0,0,0,0.35)");c.fillStyle=v;c.fillRect(0,0,W,H);
  // the shelf falls into the dark at both sides, so the box stands in the light and the cards and tags beside it read
  const sg=c.createLinearGradient(0,0,W,0);[[0,0.55],[0.34,0.55],[0.41,0],[0.59,0],[0.66,0.55],[1,0.55]].forEach(([u,a])=>sg.addColorStop(u,"rgba(5,14,18,"+a+")"));c.fillStyle=sg;c.fillRect(0,0,W,H);
  // the floor of the frame darker, so the captions' band stays quiet
  const fg=c.createLinearGradient(0,760,0,H);fg.addColorStop(0,"rgba(5,14,18,0)");fg.addColorStop(1,"rgba(5,14,18,0.55)");c.fillStyle=fg;c.fillRect(0,760,W,H-760);};
// the end of the aisle: the aisle blurred and darkened behind the story's cards
AG_PLACES.kwEnd=c=>{const [bc]=[mkCanvas(W,H)],b=bc.getContext("2d");kw_paintAisle(b,{seed:53});dp_blurDraw(c,bc,0,0,W,H,0,0,W,H,18);
  c.fillStyle="rgba(8,24,28,0.56)";c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(960,470,240,960,470,1150);v.addColorStop(0,"rgba(150,220,225,0.06)");v.addColorStop(1,"rgba(0,0,0,0.32)");c.fillStyle=v;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the octagon
   kw_octagon(ctx, x, y, r, nutrient, o): black, a white rim inside its edge, "ALTO EN" over the nutrient in white capitals, and
   "MINISTERIO DE SALUD" small under them, all decoration (English tags say what they mean); o.a, o.k (a spring) */
const KW_WHITE=[244,244,240],KW_PRINT=[40,36,30];
function kw_octPath(ctx,x,y,r){ctx.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;const X=x+Math.cos(a)*r,Y=y+Math.sin(a)*r;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.closePath();}
function kw_octagon(ctx,x,y,r,word,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);if(o.k!=null)ag_about(ctx,x,y,lerp(0.4,1,o.k));
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=r*0.18;ctx.shadowOffsetY=r*0.05;kw_octPath(ctx,x,y,r);ctx.fillStyle="#f4f4f0";ctx.fill();ctx.restore();
  kw_octPath(ctx,x,y,r*0.93);ctx.fillStyle="#0b0b0d";ctx.fill();kw_octPath(ctx,x,y,r*0.86);ctx.strokeStyle="#f4f4f0";ctx.lineWidth=Math.max(1,r*0.022);ctx.stroke();
  // its words are the real warning's, in Spanish: decoration on purpose, the English tags beside it say what they mean
  const d={deco:1},big=word.length>7?r*0.25:r*0.32;
  dp_T(ctx,"ALTO EN",x,y-r*0.16,Object.assign({w:800,size:r*0.24,align:"center",col:KW_WHITE},d));
  dp_T(ctx,word,x,y+r*0.24,Object.assign({w:800,size:big,align:"center",col:KW_WHITE},d));
  dp_T(ctx,"MINISTERIO DE SALUD",x,y+r*0.56,{w:700,size:r*0.105,align:"center",col:KW_WHITE,deco:1});
  ctx.restore();}

/* ---------------------------------------------------------------- the box
   kw_box(ctx, x, y, s, o): a cereal box standing on its foot at x, y; 380 by 540 at s 1. o.turn from 0 (its back to us) to 1 (its
   front), turning about its upright middle; o.oct (0 to 1, each of its two octagons springs on: [k1, k2]); o.small (its print and
   octagons decoration: it's seen from across the aisle); o.sugar (0 to 1, lifts its sugars line). The back's print is Spanish, as on
   a Chilean pack, and small: decoration on purpose. The front has a bowl drawn on it and no word. */
const KW_BOX={w:380,h:540,d:118};
const KW_BACK=[["Energía","390 kcal"],["Proteínas","7 g"],["Grasas totales","3 g"],["Grasas saturadas","1 g"],["Hidratos de carbono","82 g"],["Azúcares totales","33 g"],["Sodio","190 mg"]];
function kw_boxFace(ctx,front,o){const w=KW_BOX.w,h=KW_BOX.h,base=front?[214,170,104]:[226,214,186];
  let g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,rgba(mix(base,[255,255,255],0.12),1));g.addColorStop(1,rgba(mix(base,[60,40,20],0.22),1));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  if(front){// a bowl with grains over it, and a band of colour: no word, no brand
    ctx.fillStyle="rgb(150,66,48)";ctx.fillRect(0,0,w,92);ctx.fillStyle="rgba(255,236,200,0.5)";ctx.fillRect(0,92,w,4);
    ctx.fillStyle="rgb(238,232,218)";ctx.beginPath();ctx.ellipse(190,372,128,30,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(62,372);ctx.bezierCurveTo(70,470,310,470,318,372);ctx.closePath();ctx.fillStyle="rgb(96,128,160)";ctx.fill();
    ctx.fillStyle="rgb(232,196,120)";for(const [px,py,r] of [[140,350,15],[178,340,17],[214,352,14],[248,342,16],[160,326,13],[200,322,14],[232,326,12]]){ctx.beginPath();ctx.ellipse(px,py,r,r*0.72,0.4,0,TAU);ctx.fill();}
    ctx.fillStyle="rgba(255,255,255,0.18)";ctx.beginPath();ctx.ellipse(120,410,24,12,-0.5,0,TAU);ctx.fill();}
  else{// the back: the nutrition table, small, in Spanish (decoration on purpose)
    ctx.fillStyle="rgb(250,248,240)";ctx.fillRect(46,64,288,330);ctx.strokeStyle="rgb(40,36,30)";ctx.lineWidth=2;ctx.strokeRect(46,64,288,330);
    dp_T(ctx,"INFORMACIÓN NUTRICIONAL",58,92,{w:800,size:17,col:KW_PRINT,deco:1});dp_T(ctx,"100 g",322,118,{w:700,size:15,col:KW_PRINT,align:"right",deco:1});
    ctx.fillStyle="rgb(40,36,30)";ctx.fillRect(56,126,268,3);
    KW_BACK.forEach((r,i)=>{const yy=156+i*33;if(i)ctx.fillRect(56,yy-23,268,1);const lift=i===5?(o.sugar||0):0;
      dp_T(ctx,r[0],60,yy,{w:600,size:16,col:KW_PRINT,a:1-lift*0.85,deco:1});dp_T(ctx,r[1],320,yy,{w:700,size:16,col:KW_PRINT,a:1-lift*0.85,align:"right",deco:1});});
    ctx.fillStyle="rgba(40,36,30,0.55)";for(let i=0;i<5;i++)ctx.fillRect(56,420+i*18,i===4?150:268,6);}
  // its edges, and the night's light on it
  const lg=ctx.createLinearGradient(0,0,w,0);lg.addColorStop(0,"rgba(130,210,220,0.10)");lg.addColorStop(1,"rgba(0,20,30,0.18)");ctx.fillStyle=lg;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(40,30,20,0.45)";ctx.lineWidth=2;ctx.strokeRect(1,1,w-2,h-2);}
function kw_box(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;const th=Math.PI*clamp(o.turn==null?1:o.turn,0,1),cw=Math.cos(th),sw=Math.sin(th);
  const w=KW_BOX.w,h=KW_BOX.h,d=KW_BOX.d,fw=Math.abs(cw)*w,sd=sw*d;   // the face we see, and the side turning into view
  ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.translate(x,y);ctx.scale(s,s);
  // its shadow on the shelf
  ctx.save();const sg=ctx.createRadialGradient(0,0,0,0,0,260);sg.addColorStop(0,"rgba(0,0,0,0.45)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.translate(0,4);ctx.scale(1,0.12);ctx.fillStyle=sg;ctx.fillRect(-300,-300,600,600);ctx.restore();
  const front=cw<0,half=(fw+sd)/2,x0=-half;
  // the side panel, darker
  if(sd>1){ctx.save();ctx.translate(front?x0+fw:x0,-h);ctx.fillStyle="rgb(150,110,70)";ctx.fillRect(0,0,sd,h);ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fillRect(0,0,sd,h);ctx.restore();}
  if(fw>1){ctx.save();ctx.translate(front?x0:x0+sd,-h);ctx.scale(fw/w,1);kw_boxFace(ctx,front,o);
    if(front&&o.oct){const k=o.oct;for(let i=0;i<2;i++)if(k[i]>0)kw_octagon(ctx,292,96+i*150,66,i?"CALORÍAS":"AZÚCARES",{k:k[i],deco:o.small});}
    ctx.restore();}
  ctx.restore();}
// where the box's two octagons are, in the frame, for a box at x, y, s seen from the front
function kw_octAt(x,y,s,i){return[x+(292-190)*s,y+(-540+96+i*150)*s];}

/* ---------------------------------------------------------------- the parent, 2012, and what they hold */
const KW_PARENT={key:"kw-parent",name:"A parent",skin:[214,168,132],hair:{style:"bob",c:[34,26,24]},top:{kind:"overshirt",c:[92,100,106],inner:[126,70,66]},breath:0.3};
DP_PEOPLE.push(KW_PARENT);

/* ---------------------------------------------------------------- the backpacks: one child in four
   Twenty small school backpacks on hooks, in a row, muted; five of them lit. */
const KW_BAGS=[[62,84,124],[120,62,70],[60,110,104],[150,126,64],[96,98,110],[74,70,110],[120,90,62],[64,96,80],[110,70,96],[90,118,126]];
const KW_BAGON=[2,7,11,15,18];
function kw_backpacks(ctx,x,y,o){o=o||{};const n=20,gap=80,lit=o.lit||0,a=o.a==null?1:o.a;if(a<=0.001)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  ctx.save();ctx.shadowColor="rgba(190,245,245,0.6)";ctx.shadowBlur=8;ctx.fillStyle="rgba(170,226,230,0.6)";ctx.fillRect(x-18,y-4,n*gap+4,4);ctx.restore();
  for(let i=0;i<n;i++){const bx=x+i*gap,k=KW_BAGON.indexOf(i),L=k>=0?ag_in(lit,k*0.12,0.4):0,col=mix(KW_BAGS[i%KW_BAGS.length],[40,70,76],0.32),c2=mix(col,[255,236,206],0.16*L);
    ctx.save();ctx.translate(bx,y);
    if(L>0)dp_halo(ctx,30,62,110,[255,226,180],0.42*L);
    // the hook, the handle and the shoulder straps behind, then the bag, its flap and its pocket
    ctx.strokeStyle="rgba(210,236,236,0.8)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(30,-2);ctx.lineTo(30,6);ctx.arc(30,10,4,-Math.PI/2,Math.PI*0.9);ctx.stroke();
    ctx.strokeStyle=rgba(mix(c2,[0,0,0],0.35),1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(21,26);ctx.quadraticCurveTo(30,8,39,26);ctx.stroke();
    ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(10,32);ctx.quadraticCurveTo(-2,64,8,96);ctx.moveTo(50,32);ctx.quadraticCurveTo(62,64,52,96);ctx.stroke();
    rr(ctx,2,22,56,80,18);const g=ctx.createLinearGradient(0,22,0,102);g.addColorStop(0,rgba(mix(c2,[255,255,255],0.16),1));g.addColorStop(1,rgba(mix(c2,[0,0,0],0.3),1));ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();ctx.moveTo(4,44);ctx.quadraticCurveTo(30,54,56,44);ctx.strokeStyle=rgba(mix(c2,[0,0,0],0.3),0.9);ctx.lineWidth=2;ctx.stroke();
    rr(ctx,12,62,36,30,9);ctx.fillStyle=rgba(mix(c2,[0,0,0],0.16),1);ctx.fill();ctx.strokeStyle=rgba(mix(c2,[255,255,255],0.35),0.7);ctx.lineWidth=1.4;ctx.stroke();
    if(L>0){rr(ctx,2,22,56,80,18);ctx.strokeStyle="rgba(255,228,186,"+(0.9*L).toFixed(3)+")";ctx.lineWidth=2.5;ctx.stroke();}
    // the others dim as the five are lit
    const dim=0.2+0.32*clamp(lit*1.5,0,1)*(1-L);ctx.fillStyle="rgba(6,18,22,"+dim.toFixed(3)+")";rr(ctx,2,22,56,80,18);ctx.fill();
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the cards of the story */
// a small chart: drinks bought each month, against what was expected, over the first 18 months (the shape of the studies' finding)
function kw_chart(ctx,x,y,w,h,p,o){o=o||{};const n=18,ex=i=>0.55+0.02*Math.sin(i*0.9),got=i=>ex(i)-(i<1?0:0.19*(1-Math.exp(-i/3.2)))-0.012*Math.sin(i*1.7);
  const X=i=>x+i/(n-1)*w,Y=v=>y+h-v*h;ctx.save();ctx.strokeStyle=rgba(DP.ice,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
  ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(DP.T.grey,0.95);ctx.lineWidth=2.6;ctx.beginPath();for(let i=0;i<n;i++){i?ctx.lineTo(X(i),Y(ex(i))):ctx.moveTo(X(i),Y(ex(i)));}ctx.stroke();ctx.setLineDash([]);
  const m=clamp(p,0,1)*(n-1);ctx.strokeStyle=rgba(DP.T.ink,1);ctx.lineWidth=3.4;ctx.shadowColor="rgba(220,250,250,0.6)";ctx.shadowBlur=8;ctx.beginPath();
  for(let i=0;i<=Math.floor(m);i++){i?ctx.lineTo(X(i),Y(got(i))):ctx.moveTo(X(i),Y(got(i)));}const fr=m-Math.floor(m),j=Math.floor(m);if(j<n-1&&fr>0)ctx.lineTo(lerp(X(j),X(j+1),fr),lerp(Y(got(j)),Y(got(j+1)),fr));ctx.stroke();
  ctx.restore();return{exY:Y(ex(n-1)),gotY:Y(got(n-1)),x1:x+w};}
// the recipe card's lines: a few bars, the sugar line with its word; sugar (1 to 0.4) its length
function kw_recipe(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=420,h=300;ctx.save();ctx.globalAlpha*=clamp(a,0,1);if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:30,behind:o.behind});dp_T(ctx,"RECIPE",x+30,y+56,{w:800,size:28,ls:4,col:"grey"});dp_T(ctx,"the maker's",x+30,y+100,{w:600,size:30});
  ctx.fillStyle=rgba(DP.ice,0.35);[0.9,0.55,0.75].forEach((v,i)=>{rr(ctx,x+30,y+132+i*28,(w-60)*v,10,5);ctx.fill();});
  const sv=o.sugar==null?1:o.sugar;dp_T(ctx,"sugar",x+30,y+262,{w:600,size:28,col:"mut"});ctx.fillStyle=rgba(DP.T.ink,0.85);rr(ctx,x+124,y+246,(w-160)*sv,12,6);ctx.fill();
  ctx.restore();return{x,y,w,h,pin:[x,y+150]};}
