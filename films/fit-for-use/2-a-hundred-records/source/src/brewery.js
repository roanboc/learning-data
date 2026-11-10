/* ===== A hundred records: the opening, a brewery's laboratory in Dublin from 1899, and its barley plots =====
   Two places painted once, in the module's light (a window on the right), and lit as the bench is, so the cut from 1899 to 2026
   joins them: hrLab, the brewery's laboratory, a whitewashed brick wall, a cabinet of glassware and a tall sash window, over an oak
   bench at the module's bench lines (DQ_BENCH: people stand behind it, cut at its back edge); and hrField, the trial plots, rows of
   young barley in small squares seen from a little above. Nothing in them uses a colour that means something: the barley is a
   muted sage, never the green of a check that passed, and nothing is brass. Nothing Irish is borrowed: no emblem, no green and
   gold, no harp; the brewery isn't named.
   William Gosset (HR_GOSSET) is drawn as a young chemist of 1899, from the period, not from a photograph: a dark three-piece suit,
   a high white collar and a dark tie, a short moustache. The props are paper and glass: two sample jars of barley ears, the card of
   the day's arithmetic, the pile of 3,000 cards and the four he drew, the journal page of 1908, the card with his name, and the plan of
   the eleven pairs of plots.
   Every name starts with hr_ or HR_. */

const HR={wash:[228,222,208],brick:[214,204,186],oakTop:[150,104,64],oakFace:[96,64,38],glassBrown:[120,78,44],glassClear:[206,214,212],
  sage:[132,146,108],sageDark:[104,118,84],earth:[150,118,86],sky:[226,232,234],ink:[40,34,28]};
const HR_FIELD={hz:250};   // the field's horizon

/* ---------------------------------------------------------------- the laboratory, 1899 */
function hr_paintLab(c){const B=DQ_BENCH,nz=dq_noise(71),b=HR.wash,win=[1500,64,1846,724];
  // whitewashed brick: courses 34 px deep, each brick a little different under the lime, the wash thicker in places, and the window's
  // daylight lying on the wall to its left
  const r=ag_rnd(73),rows=[];for(let y0=B.back;y0>-40;y0-=34){const off=(rows.length%2)*58,ks=[];for(let x=-off;x<W+120;x+=116)ks.push([x,r()-0.5]);rows.push({y0:y0-34,y1:y0,ks});}
  const brickAt=(px,py)=>{for(const rw of rows)if(py>=rw.y0&&py<rw.y1){let k=0;while(k+1<rw.ks.length&&rw.ks[k+1][0]<=px)k++;const bx=rw.ks[k][0],dx=Math.min(px-bx,bx+116-px),dy=Math.min(py-rw.y0,rw.y1-py);
    return[rw.ks[k][1],Math.min(dx,dy)];}return[0,10];};
  const sunAt=(px,py)=>{const top=150+(1480-px)*0.16,bot=760+(1480-px)*0.12;if(px>1480||px<760||py<top||py>bot)return 0;
    return sstep(760,1000,px)*sstep(top,top+60,py)*(1-sstep(bot-60,bot,py))*(1-0.75*(1-sstep(0,26,Math.abs(px-1250)-10)));};
  dq_field(c,0,0,W,B.back,2,(px,py,out)=>{const [tn,ed]=brickAt(px,py),m=nz(px/520,py/520,3),f=nz(px/60,py/60,3),wash=nz(px/180,py/90,2),
      joint=ed<2.2?1-ed/2.2:0,lit=0.9+0.1*sstep(0,1480,px)-0.08*(1-sstep(0,420,py)),s=sunAt(px,py),
      k=lit*(0.95+0.05*m+0.05*(f-0.5)+tn*0.035*(1-wash*0.6)-joint*0.05*(1-wash))+0.09*s;
    out[0]=Math.min(255,b[0]*k+8*s);out[1]=Math.min(255,b[1]*k+5*s);out[2]=Math.min(255,b[2]*k);});
  // the window: a deep reveal in the brick, a painted sash frame, panes of old glass bright with the day
  const [wx0,wy0,wx1,wy1]=win;let g=c.createLinearGradient(wx0-36,0,wx0,0);g.addColorStop(0,"rgba(120,100,78,0.35)");g.addColorStop(1,"rgba(120,100,78,0)");c.fillStyle=g;c.fillRect(wx0-36,wy0-30,36,wy1-wy0+60);
  c.fillStyle="rgb(200,192,176)";c.fillRect(wx0,wy0-26,wx1-wx0+60,wy1-wy0+52);
  g=c.createLinearGradient(0,wy0,0,wy1);g.addColorStop(0,"#e9eef0");g.addColorStop(0.55,"#f3f1e8");g.addColorStop(1,"#efe6d2");c.fillStyle=g;c.fillRect(wx0+18,wy0,wx1-wx0-18,wy1-wy0);
  // beyond the glass: the brick of the building across the yard, pale in the haze, lower panes only
  c.fillStyle="rgba(168,150,132,0.22)";c.fillRect(wx0+18,wy1-250,wx1-wx0-18,250);c.fillStyle="rgba(150,134,116,0.16)";for(let y=wy1-240;y<wy1;y+=22)c.fillRect(wx0+18,y,wx1-wx0-18,2);
  // the sashes: twelve panes, the frame painted off-white, a soft shadow inside the reveal
  c.strokeStyle="rgb(236,232,222)";c.lineWidth=14;c.strokeRect(wx0+25,wy0+7,wx1-wx0-32,wy1-wy0-14);c.lineWidth=16;c.beginPath();c.moveTo(wx0+18,(wy0+wy1)/2);c.lineTo(wx1,(wy0+wy1)/2);c.stroke();
  c.lineWidth=7;for(const fx of [1/3,2/3]){const x=lerp(wx0+18,wx1,fx);c.beginPath();c.moveTo(x,wy0);c.lineTo(x,wy1);c.stroke();}
  for(const fy of [1/6,2/6,4/6,5/6]){const y=lerp(wy0,wy1,fy);c.beginPath();c.moveTo(wx0+18,y);c.lineTo(wx1,y);c.stroke();}
  c.strokeStyle="rgba(110,96,80,0.35)";c.lineWidth=2;c.strokeRect(wx0+18,wy0,wx1-wx0-18,wy1-wy0);
  g=c.createLinearGradient(0,wy1,0,wy1+30);g.addColorStop(0,"#d8cfbe");g.addColorStop(1,"#a89a84");c.fillStyle=g;c.fillRect(wx0-20,wy1,wx1-wx0+80,30);
  dq_pool(c,(wx0+wx1)/2,(wy0+wy1)/2,520,[255,246,226],0.12,0.9);
  // the glassware cabinet on the left: dark oak shelves, brown and clear bottles, flasks and a row of test tubes
  const cx0=40,cx1=360,ct=168;g=c.createLinearGradient(cx0,0,cx1,0);g.addColorStop(0,"#3a2818");g.addColorStop(1,"#5a3e26");c.fillStyle=g;c.fillRect(cx0,ct,cx1-cx0,B.back-ct);
  c.fillStyle="rgba(24,14,8,0.55)";c.fillRect(cx0+18,ct+20,cx1-cx0-36,B.back-ct-40);
  const rb=ag_rnd(79);for(const sy of [360,540,720]){c.fillStyle="#6a4a2e";c.fillRect(cx0+10,sy,cx1-cx0-20,12);c.fillStyle="rgba(255,226,190,0.18)";c.fillRect(cx0+10,sy,cx1-cx0-20,2);
    let x=cx0+34;while(x<cx1-50){const kind=rb(),w=26+rb()*24,h=56+rb()*66,col=kind<0.45?HR.glassBrown:HR.glassClear,a=kind<0.45?0.92:0.55;
      c.fillStyle=rgba(col,a);if(kind<0.75){rr(c,x,sy-h,w,h,6);c.fill();c.fillRect(x+w*0.32,sy-h-22,w*0.36,24);}
      else{c.beginPath();c.moveTo(x+w*0.35,sy-h);c.lineTo(x+w*0.65,sy-h);c.lineTo(x+w*0.65,sy-h*0.55);c.lineTo(x+w+8,sy);c.lineTo(x-8,sy);c.lineTo(x+w*0.35,sy-h*0.55);c.closePath();c.fill();}
      c.fillStyle="rgba(255,250,240,0.35)";c.fillRect(x+w*0.7,sy-h*0.85,3,h*0.6);x+=w+18;}}
  c.fillStyle="rgba(255,226,190,0.12)";c.fillRect(cx1-4,ct,4,B.back-ct);
  // the shadow the bench casts on the wall, then the oak bench: its top seen at a low angle, its front face, the floor's dark
  g=c.createLinearGradient(0,B.back-80,0,B.back);g.addColorStop(0,"rgba(70,50,30,0)");g.addColorStop(1,"rgba(70,50,30,0.32)");c.fillStyle=g;c.fillRect(0,B.back-80,W,80);
  const oz=dq_noise(83);dq_field(c,0,B.back,W,B.front-B.back,2,(px,py,out)=>{const gr=oz(px/220,(py-B.back)/7,3),ry=oz(px/40,(py-B.back)/3,2),k=0.82+0.28*gr+0.08*ry+0.12*sstep(0,W,px);
    out[0]=Math.min(255,HR.oakTop[0]*k);out[1]=Math.min(255,HR.oakTop[1]*k);out[2]=Math.min(255,HR.oakTop[2]*k);});
  g=c.createLinearGradient(0,B.back,0,B.front);g.addColorStop(0,"rgba(255,236,206,0.16)");g.addColorStop(1,"rgba(0,0,0,0.12)");c.fillStyle=g;c.fillRect(0,B.back,W,B.front-B.back);
  c.fillStyle="rgba(30,18,10,0.7)";c.fillRect(0,B.back-1,W,2.5);
  dq_field(c,0,B.front,W,B.face-B.front,2,(px,py,out)=>{const gr=oz(px/300+9,(py-B.front)/10,3),k=0.8+0.25*gr;out[0]=HR.oakFace[0]*k;out[1]=HR.oakFace[1]*k;out[2]=HR.oakFace[2]*k;});
  c.fillStyle="rgba(255,232,200,0.35)";c.fillRect(0,B.front-1,W,2);
  g=c.createLinearGradient(0,B.face,0,H);g.addColorStop(0,"#0e0a07");g.addColorStop(1,"#1c150f");c.fillStyle=g;c.fillRect(0,B.face,W,H-B.face);}

/* ---------------------------------------------------------------- the trial plots
   A field seen from a little above: rows of plots, each a square of young barley in drills, paths of earth between them, a hedge and
   a few trees along the far edge, a pale sky. HR_PLOT(i, j) is where plot (column i of 8, row j of 4, the nearest row 0) lies in the
   frame, as a quadrilateral [[x, y] x 4], for tags and marks drawn live. */
const HR_PLOTS={cols:8,rows:4};
function hr_plotXY(u,v){// u 0..1 across the plots, v 0..1 from the near edge to the far one: a simple perspective
  const e=v<=1?1-Math.pow(1-v,1.7):1+(v-1)*0.2,y=lerp(1010,346,e),sc=lerp(1,0.36,e);return[990+(u-0.5)*2240*sc,y];}
function HR_PLOT(i,j){const g=0.055,u0=(i+g)/HR_PLOTS.cols,u1=(i+1-g)/HR_PLOTS.cols,v0=(j+g*1.5)/HR_PLOTS.rows,v1=(j+1-g*1.5)/HR_PLOTS.rows;
  return[hr_plotXY(u0,v0),hr_plotXY(u1,v0),hr_plotXY(u1,v1),hr_plotXY(u0,v1)];}
// a point inside plot (i, j): a, b from 0 to 1 across it and from its near edge to its far one
function hr_inPlot(i,j,a,b){const q=HR_PLOT(i,j),n=[lerp(q[0][0],q[1][0],a),lerp(q[0][1],q[1][1],a)],f=[lerp(q[3][0],q[2][0],a),lerp(q[3][1],q[2][1],a)];return[lerp(n[0],f[0],b),lerp(n[1],f[1],b)];}
function hr_quad(c,q){c.beginPath();q.forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
function hr_paintField(c){const hz=HR_FIELD.hz,nz=dq_noise(91);
  // the sky, pale and hazy, brighter towards the light on the right
  let g=c.createLinearGradient(0,0,0,hz+40);g.addColorStop(0,"#dde5ea");g.addColorStop(1,"#f2efe4");c.fillStyle=g;c.fillRect(0,0,W,hz+40);
  dq_pool(c,1720,110,760,[255,250,236],0.2,0.6);
  // the far country: fields in strips of hay, stubble and pasture, paler with distance, hedges between them
  dq_field(c,0,hz,W,H-hz,2,(px,py,out)=>{const d=clamp((py-hz)/(H-hz),0,1),strip=Math.floor((py-hz)/(6+d*60)+nz(px/700,py/200,2)*2),
      tone=[[168,168,132],[182,170,130],[150,160,120],[176,164,128]][((strip%4)+4)%4],m=nz(px/60,py/18,2),haze=1-d,k=0.9+0.12*m;
    out[0]=lerp(tone[0]*k,206,haze*0.45);out[1]=lerp(tone[1]*k,206,haze*0.45);out[2]=lerp(tone[2]*k,196,haze*0.45);});
  const r=ag_rnd(93);c.fillStyle="rgba(96,104,82,0.8)";c.beginPath();c.moveTo(0,hz+12);for(let x=0;x<=W;x+=16)c.lineTo(x,hz+6-r()*8);c.lineTo(W,hz+22);c.lineTo(0,hz+22);c.closePath();c.fill();
  for(const [tx,ts] of [[170,0.9],[400,0.7],[1160,1.05],[1500,0.8],[1770,0.95]]){const blobs=[];for(let k=0;k<9;k++)blobs.push([tx+(r()-0.5)*64*ts,hz-26*ts-r()*54*ts,(20+r()*16)*ts]);
    c.fillStyle="rgba(66,58,46,0.9)";c.fillRect(tx-3,hz-24*ts,6,30*ts);
    for(const [bx,by,br] of blobs){const gg=c.createRadialGradient(bx+br*0.3,by-br*0.3,0,bx,by,br);gg.addColorStop(0,"rgba(118,126,98,0.95)");gg.addColorStop(1,"rgba(82,90,70,0.95)");c.fillStyle=gg;c.beginPath();c.arc(bx,by,br,0,TAU);c.fill();}}
  // the trial ground: bare earth, its clods, then each plot's drills of young barley, a muted sage, running away from us
  const ground=[[0,0],[0,0],hr_plotXY(1.03,1.03),hr_plotXY(-0.03,1.03)];ground[0]=[-200,H];ground[1]=[W+200,H];
  c.save();hr_quad(c,ground);c.clip();dq_field(c,0,300,W,H-300,2,(px,py,out)=>{const m=nz(px/40,py/26,3),k=0.84+0.24*m;out[0]=HR.earth[0]*k;out[1]=HR.earth[1]*k;out[2]=HR.earth[2]*k;});
  dq_specks(c,0,300,W,H-300,{seed:95,density:0.006,a:0.5,kinds:[[0.6,[108,82,58],1.2,3],[0.4,[186,156,120],1,2.4]]});c.restore();
  for(let j=HR_PLOTS.rows-1;j>=0;j--)for(let i=0;i<HR_PLOTS.cols;i++){const q=HR_PLOT(i,j),tone=0.92+0.12*((i*7+j*3)%5)/4;
    c.save();hr_quad(c,q);c.clip();const top=Math.min(q[2][1],q[3][1]),bot=Math.max(q[0][1],q[1][1]);
    g=c.createLinearGradient(q[0][0],0,q[1][0],0);g.addColorStop(0,rgba(HR.sageDark.map(v=>v*tone),1));g.addColorStop(1,rgba(HR.sage.map(v=>Math.min(255,v*tone*1.08)),1));c.fillStyle=g;c.fillRect(0,top-2,W,bot-top+4);
    // the drills, running from the near edge to the far one, each a darker furrow and a lit row of leaves beside it
    const n=11;for(let k=0;k<=n;k++){const a=(k+0.5)/(n+1),p0=hr_inPlot(i,j,a,0),p1=hr_inPlot(i,j,a,1),w=lerp(1.2,3.2,(p0[1]-346)/660);
      c.strokeStyle="rgba(64,76,48,0.42)";c.lineWidth=w;c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();
      c.strokeStyle="rgba(196,206,160,0.22)";c.lineWidth=w*0.7;c.beginPath();c.moveTo(p0[0]+w,p0[1]);c.lineTo(p1[0]+w*0.5,p1[1]);c.stroke();}
    c.restore();
    // the plot's near edge, a little raised, catching the light
    c.strokeStyle="rgba(214,196,160,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(q[0][0],q[0][1]);c.lineTo(q[1][0],q[1][1]);c.stroke();}
  // the light: a warm haze from the right, and the near edge falling into shadow
  g=c.createLinearGradient(W,0,0,0);g.addColorStop(0,"rgba(255,244,220,0.14)");g.addColorStop(1,"rgba(255,244,220,0)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  g=c.createLinearGradient(0,900,0,H);g.addColorStop(0,"rgba(20,16,10,0)");g.addColorStop(1,"rgba(20,16,10,0.5)");c.fillStyle=g;c.fillRect(0,900,W,H-900);}
AG_PLACES.hrLab=hr_paintLab;
AG_PLACES.hrField=hr_paintField;

/* ---------------------------------------------------------------- William Gosset, 1899 */
// a short, neat moustache, as young men wore it then: painted with the head, so it turns and nods with it
function hr_moustache(col){return (c,P)=>{
  ag_soft(c,cc=>{cc.moveTo(350,477);cc.bezierCurveTo(358,468,376,465,390,466);cc.bezierCurveTo(395,467,398,472,395,477);cc.bezierCurveTo(382,478,366,480,351,483);cc.closePath();},
    col,ag_lt(col,0.25),384,469,18,"rgba(0,0,0,0.22)",3);};}
// the waistcoat, buttoned high under the jacket's lapels: the shirt and tie show only in its small V
function hr_waistcoat(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();const wc=mix(P.top.c,[86,78,70],0.45);
  ag_soft(c,cc=>{cc.moveTo(262,676);cc.bezierCurveTo(276,720,298,800,326,880);cc.bezierCurveTo(334,800,344,730,352,676);cc.lineTo(330,700);cc.lineTo(324,770);cc.lineTo(300,690);cc.closePath();},
    wc,ag_lt(wc,0.2),336,760,130,rgba(ag_dk(wc,0.6),0.35),8);
  for(const y of [790,826,862]){const x=325+(y-790)*0.02;ag_soft(c,cc=>cc.arc(x,y,4,0,TAU),[34,32,34],[130,126,132],x+1,y-1,5,null);}
  c.restore();}
// a high starched collar round the neck, over the person in figure space, and the knot of the tie at its front
function hr_collar(c,P){ag_soft(c,cc=>{cc.moveTo(231,514);cc.bezierCurveTo(254,532,302,546,344,547);cc.lineTo(361,603);cc.bezierCurveTo(330,615,272,612,233,570);cc.closePath();},
    [246,244,238],[255,255,255],330,548,90,"rgba(70,70,80,0.3)",8);
  c.strokeStyle="rgba(90,90,100,0.4)";c.lineWidth=2.2;c.beginPath();c.moveTo(331,548);c.lineTo(328,604);c.stroke();
  ag_soft(c,cc=>{cc.moveTo(314,598);cc.lineTo(336,597);cc.lineTo(330,620);cc.lineTo(314,620);cc.closePath();},P.top.tie,ag_lt(P.top.tie,0.3),330,602,20,null);}
// the suit's body paints the shirt's opening again over anything top.paint puts there, so the waistcoat and the collar are worn over the
// person (who.over), as the gown's hood is in the module's cast
const HR_GOSSET={key:"hrGosset",name:"William Gosset",role:"Chemist, a large brewery",skin:[234,198,172],hair:{style:"side",c:[96,70,50]},
  top:{kind:"suit",c:[52,48,50],inner:[244,242,236],tie:[34,32,38]},hat:{paint:hr_moustache([104,78,58])},over:(c,P)=>{hr_waistcoat(c,P);hr_collar(c,P);},breath:0.27};

/* ---------------------------------------------------------------- the props of 1899, drawn live
   hr_jar(ctx, x, y, s, o)        a tall glass sample jar on the bench, its foot at (x, y), holding barley ears (o.tone: paler or warmer)
   hr_ear(ctx, x, y, ang, len, col) one ear of barley: its stalk from (x, y), the spike with its grains and long awns
   hr_curves(ctx, x, y, w, h, o)  a card of the arithmetic: o.many (a dot plot of many measurements), o.manyCurve and o.curveA (the day's curve over it, drawn on, and how strong),
                                  o.few (four dots), o.q (a question mark), o.student (Student's curve for four, wider and lower), o.label
   hr_numCard(ctx, x, y, v, o)    one of Gosset's cards, a measurement typed on it, standing (o.k springs it, o.a)
   hr_stack(ctx, x, y, o)         the pile of 3,000 cards on the bench, its top lit; o.cut (0 to 1) cuts it and sets it together again
   hr_journal(ctx, x, y, o)       the first page of the paper of 1908, as Biometrika printed it; o.lit lights the byline
   hr_nameCard(ctx, x, y, o)      "W. S. Gosset" on a card that turns face down (o.turn 0 to 1)
   hr_pairs(ctx, x, y, o)         eleven pairs of plots, as a plan on a card: kiln-dried seed above, not below (o.n pairs drawn) */
const HR_STRAW=[204,186,140],HR_STRAW_DK=[146,126,88];
function hr_ear(ctx,x,y,ang,len,col){col=col||HR_STRAW;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.lineCap="round";
  ctx.strokeStyle=rgba(ag_dk(col,0.18),1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(4,-len*0.5,0,-len);ctx.stroke();
  // the spike: grains in two rows, each with its awn, long and fine, rising past the tip
  const sl=len*0.42;for(let i=0;i<9;i++){const u=i/8,gy=-len-u*sl,side=i%2?1:-1,gx=side*4.6*(1-u*0.4);
    ctx.fillStyle=rgba(mix(col,[255,250,232],0.12+0.1*(i%2)),1);ctx.beginPath();ctx.ellipse(gx,gy,5.4*(1-u*0.3),9*(1-u*0.25),side*0.32,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(ag_dk(col,0.25),0.55);ctx.lineWidth=1;ctx.stroke();
    ctx.strokeStyle=rgba(ag_dk(col,0.1),0.75);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(gx,gy-6);ctx.quadraticCurveTo(gx+side*5,gy-sl*0.8,gx+side*12,gy-sl*1.5);ctx.stroke();}
  ctx.restore();}
function hr_jar(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;s=s||1;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const col=o.tone==="warm"?mix(HR_STRAW,[196,150,96],0.35):mix(HR_STRAW,[236,230,206],0.25);
  // the ears first, behind the glass's front: a loose bunch fanning out of the jar's mouth
  const r=ag_rnd(o.seed||5);for(let i=0;i<7;i++){const ang=(i-3)*0.1+(r()-0.5)*0.06;hr_ear(ctx,(i-3)*7,-40,ang,150+r()*40,col);}
  // the jar: clear glass with a faint tint, its rim and base catching the light from the right, the stalks seen through it
  ctx.strokeStyle=rgba(ag_dk(col,0.2),0.6);ctx.lineWidth=2.4;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo((i-3)*6,-6);ctx.lineTo((i-3)*7,-130);ctx.stroke();}
  const g=ctx.createLinearGradient(-44,0,44,0);g.addColorStop(0,"rgba(190,204,204,0.30)");g.addColorStop(0.7,"rgba(236,244,242,0.18)");g.addColorStop(0.86,"rgba(255,255,255,0.55)");g.addColorStop(1,"rgba(170,186,186,0.35)");
  ctx.fillStyle=g;rr(ctx,-44,-134,88,134,10);ctx.fill();ctx.strokeStyle="rgba(120,136,136,0.55)";ctx.lineWidth=2;rr(ctx,-44,-134,88,134,10);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.5)";ctx.fillRect(26,-124,5,110);ctx.strokeStyle="rgba(150,164,164,0.7)";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-134,44,7,0,0,TAU);ctx.stroke();
  ctx.fillStyle="rgba(40,30,20,0.25)";ctx.beginPath();ctx.ellipse(-6,2,52,7,0,0,TAU);ctx.fill();ctx.restore();}
// the normal curve (the day's arithmetic, for large numbers) and Student's for samples of four (three degrees of freedom), both of
// unit area, so his is lower in the middle and wider in the tails
const hr_norm=z=>0.3989*Math.exp(-z*z/2),hr_t3=z=>0.3676*Math.pow(1+z*z/3,-2);
function hr_curves(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{});if(o.label)dq_label(ctx,x+DQ_PAD,y+52,o.label);
  const bx=x+60,bw=w-120,by=y+h-86,ph=h-210,X=z=>bx+(z+3.6)/7.2*bw,Y=v=>by-v/0.4*ph;
  ctx.fillStyle="rgba(120,104,84,0.5)";ctx.fillRect(bx,by,bw,2.4);
  // many measurements: a dot plot that stacks into a bell
  if(o.many>0){const r=ag_rnd(17),pts=[];for(let i=0;i<120;i++){let z=0;for(let k=0;k<6;k++)z+=r();pts.push(Math.round((z-3)*1.41*2.2));}
    // each column's height follows the curve: as many dots as the bell is tall there, so the curve lies over them
    const cols={},d=Math.min(11,ph*hr_norm(0)/0.4/(Math.max(...pts.map(c_=>pts.filter(q=>q===c_).length))));
    pts.forEach((c_,i)=>{cols[c_]=(cols[c_]||0)+1;const n=cols[c_],px=X(c_/2.2),py=by-8-(n-1)*d,ap=clamp(o.many*1.6-i/120*0.6,0,1);if(ap<=0)return;
      ctx.fillStyle=rgba(DQ.steel,0.85*ap);ctx.beginPath();ctx.arc(px,py,Math.min(4.6,d*0.42),0,TAU);ctx.fill();});
    }
  // the day's curve over them; o.curveA keeps it faint beside Student's, so his shows wider and lower
  const u=o.manyCurve==null?(o.many||0):o.manyCurve;if(u>0){ctx.strokeStyle=rgba(DQ.ink,0.85*(o.curveA==null?1:o.curveA));ctx.lineWidth=3.4;ctx.beginPath();for(let k=0;k<=80*u;k++){const z=-3.6+7.2*k/80;k?ctx.lineTo(X(z),Y(hr_norm(z))):ctx.moveTo(X(z),Y(hr_norm(z)));}ctx.stroke();}
  // a few: four measurements
  if(o.few>0){const zs=[-0.9,0.4,1.3,-0.2];zs.forEach((z,i)=>{const ap=clamp(o.few*4-i,0,1);if(ap<=0)return;ctx.fillStyle=rgba(DQ.steel,ap);ctx.beginPath();ctx.arc(X(z),by-12,9,0,TAU);ctx.fill();});}
  if(o.student>0){const u=o.student;ctx.strokeStyle=rgba(DQ.steel,1);ctx.lineWidth=4.4;ctx.setLineDash([]);ctx.beginPath();for(let k=0;k<=80*u;k++){const z=-3.6+7.2*k/80;k?ctx.lineTo(X(z),Y(hr_t3(z))):ctx.moveTo(X(z),Y(hr_t3(z)));}ctx.stroke();}
  if(o.q>0)dq_T(ctx,"?",X(0.2),by-ph*0.55,{w:800,size:120,align:"center",col:DQ.soft,a:o.q});
  if(o.notes)o.notes.forEach(n=>{if(n.a>0)dq_T(ctx,n.t,n.x,n.y,{w:n.w||700,size:28,col:n.col||DQ.ink,a:n.a,align:n.align||"left"});});
  ctx.restore();}
function hr_numCard(ctx,x,y,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||150,h=o.h||96;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,ag_spr(o.k,0,0.5)));if(o.rot)hr_rotAbout(ctx,x+w/2,y+h/2,o.rot);
  dq_card(ctx,x,y,w,h,{ruled:o.ruled?24:0,ruleTop:44,on:o.on,edge:o.edge});if(v!=null)dq_T(ctx,String(v),x+w/2,y+h/2+11,{w:500,size:32,f:"mono",align:"center"});ctx.restore();}
function hr_rotAbout(ctx,x,y,r){ctx.translate(x,y);ctx.rotate(r);ctx.translate(-x,-y);}
function hr_stack(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  // the pile seen from the front, a little above: card edges in fine lines, the top card's face; cut, its top half slides off and back
  const w=230,hh=118,cut=o.cut||0,dx=Math.sin(Math.PI*clamp(cut,0,1))*170,sh=(p,top,off)=>{ctx.save();ctx.translate(off,0);
    ctx.fillStyle="rgba(40,26,14,0.28)";ctx.beginPath();ctx.ellipse(x+w/2-10,y+4,w*0.62,12,0,0,TAU);ctx.fill();
    const g=ctx.createLinearGradient(0,y-p,0,y);g.addColorStop(0,"#efe6d2");g.addColorStop(1,"#d6cab2");ctx.fillStyle=g;ctx.fillRect(x,y-p,w,p);
    ctx.fillStyle="rgba(120,100,76,0.25)";for(let k=y-p+3;k<y;k+=3.2)ctx.fillRect(x,k,w,0.9);
    if(top){ctx.fillStyle="#f7f1e4";ctx.beginPath();ctx.moveTo(x,y-p);ctx.lineTo(x+w,y-p);ctx.lineTo(x+w-26,y-p-30);ctx.lineTo(x+26,y-p-30);ctx.closePath();ctx.fill();
      ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.2;ctx.stroke();}ctx.restore();};
  if(cut>0&&cut<1){sh(hh/2,true,0);ctx.save();ctx.translate(0,-hh/2);sh(hh/2,true,dx);ctx.restore();}else sh(hh,true,0);
  ctx.restore();}
function hr_journal(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=560,h=700;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{r:3,fill:"rgb(244,238,222)"});const cx=x+w/2,F="serif";
  dq_T(ctx,"BIOMETRIKA.",cx,y+70,{w:700,size:36,align:"center",ls:6});ctx.fillStyle="rgba(40,34,28,0.6)";ctx.fillRect(x+60,y+92,w-120,2);
  dq_T(ctx,"VOL. VI · MARCH 1908",cx,y+132,{w:600,size:28,align:"center",col:DQ.soft});
  dq_T(ctx,"THE PROBABLE ERROR",cx,y+214,{w:800,size:36,align:"center"});dq_T(ctx,"OF A MEAN.",cx,y+260,{w:800,size:36,align:"center"});
  if(o.lit>0){ctx.fillStyle=rgba([196,172,128],0.3*o.lit);rr(ctx,cx-120,y+290,240,52,8);ctx.fill();}
  dq_T(ctx,"By STUDENT.",cx,y+326,{w:700,size:32,align:"center"});
  // the text of the page and, under it, the top of one of his tables: drawn small, as decoration
  ctx.fillStyle="rgba(92,82,72,0.38)";for(let k=0;k<6;k++)ctx.fillRect(x+60,y+384+k*24,w-120-(k===5?180:0),7);
  ctx.strokeStyle="rgba(92,82,72,0.5)";ctx.lineWidth=1.4;ctx.strokeRect(x+90,y+544,w-180,120);ctx.beginPath();ctx.moveTo(x+90,y+572);ctx.lineTo(x+w-90,y+572);ctx.moveTo(x+170,y+544);ctx.lineTo(x+170,y+664);ctx.stroke();
  for(let k=0;k<4;k++){ctx.fillStyle="rgba(92,82,72,0.38)";ctx.fillRect(x+104,y+590+k*20,44,6);for(let c_=0;c_<5;c_++)ctx.fillRect(x+190+c_*58,y+590+k*20,40,6);}
  ctx.restore();return{x,y,w,h};}
function hr_nameCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=300,h=110,turn=clamp(o.turn||0,0,1),sx=Math.cos(Math.PI*turn);ctx.save();ctx.globalAlpha*=a;
  ctx.translate(x+w/2,y+h/2);ctx.scale(Math.max(0.02,Math.abs(sx)),1);ctx.translate(-x-w/2,-y-h/2);
  if(sx>0){dq_card(ctx,x,y,w,h,{});dq_T(ctx,"W. S. Gosset",x+w/2,y+h/2+12,{w:700,size:36,align:"center"});}
  // face down: a card's back, a fine hatch inside a border, so the name can't be read
  else{dq_card(ctx,x,y,w,h,{fill:"rgb(232,224,206)"});ctx.strokeStyle="rgba(110,90,66,0.32)";ctx.lineWidth=1.6;rr(ctx,x+12,y+12,w-24,h-24,6);ctx.stroke();
    ctx.save();rr(ctx,x+12,y+12,w-24,h-24,6);ctx.clip();ctx.strokeStyle="rgba(110,90,66,0.16)";ctx.lineWidth=1.2;ctx.beginPath();
    for(let d=-h;d<w;d+=14){ctx.moveTo(x+d,y+h);ctx.lineTo(x+d+h,y);ctx.moveTo(x+d,y);ctx.lineTo(x+d+h,y+h);}ctx.stroke();ctx.restore();}
  ctx.restore();}
function hr_pairs(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=760,h=330;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{});dq_label(ctx,x+DQ_PAD,y+52,"Eleven pairs of trials");
  dq_T(ctx,"Kiln-dried",x+DQ_PAD,y+148,{w:600,size:28,col:DQ.soft});dq_T(ctx,"Not dried",x+DQ_PAD,y+238,{w:600,size:28,col:DQ.soft});
  const n=o.n==null?11:o.n;for(let i=0;i<11;i++){const ap=clamp(n-i,0,1);if(ap<=0)continue;const px=x+210+i*48;
    for(const [row,col] of [[0,HR.sageDark],[1,HR.sage]]){ctx.fillStyle=rgba(col,ap);rr(ctx,px,y+104+row*90,38,60,4);ctx.fill();ctx.strokeStyle=rgba(ag_dk(col,0.3),0.6*ap);ctx.lineWidth=1.4;ctx.stroke();}}
  ctx.restore();return{x,y,w,h};}
