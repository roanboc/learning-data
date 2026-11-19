/* ===== A first draft, not a blank page: this film's pictures =====
   Babylon is drawn with the series' components (../../../shared/src/aca.js: the sky, the tower and its foundation, its people as
   silhouettes, clay); the present with The map before the data's (ea.js: glass, paper, the wall, ArchiMate's glyphs) and the agent
   from Keeping it true (kt_agent, through aca_agent). Here: what only this film draws, prefixed a4_. Made to read on a phone: every
   word is at least 28 px in the frame, or marked deco:1 as texture. */

// the sides of the utility, as the series colours them: the network in blue, retail in rose, households warm; and the layers'
// colours by name, as ea.js holds them
const A4_NET=[132,176,255],A4_RET=[255,150,186],A4_HH=[255,214,170],A4_RED=[236,104,92],A4_OK=[132,226,160],A4_SUN=[255,214,120];
const A4_STR=LAY6[1][1],A4_BUS=LAY6[2][1],A4_INF=LAY6[3][1],A4_APP=LAY6[4][1];
// the paper a side drafts on, and the glass it turns to when its owner confirms it
const A4_PAPER={net:NOTEC[2],ret:NOTEC[1],rule:NOTEC[0]},A4_EDGE={net:A4_NET,ret:A4_RET,rule:BIZ};

// a face that changes from one expression to another over a moment, never in one frame: m (0..1) mixes a into b (as Data
// architecture's daExpr does)
function a4_expr(a,b,m){if(!(m>0))return a;if(m>=1)return b;const A=EXPR[a],B=EXPR[b],o={},q=Math.round(m*20)/20;
  for(const k of new Set([...Object.keys(A),...Object.keys(B)])){const u=A[k]==null?0:A[k],v=B[k]==null?0:B[k];o[k]=u+(v-u)*q;}
  if(B.happy&&q<1)delete o.happy;const key="__a4_"+a+"_"+b+"_"+q;EXPR[key]=o;return key;}
// the person seen from the left: a mirror of When things go wrong's person(), for someone on the right of the frame facing in
function a4_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}

/* ---------- a whole picture that fades as one ---------- */
// A picture that leaves while another comes in, in one chapter, is drawn into a reused canvas and laid over at its opacity, so its
// parts never show through each other as it fades (a tower through the king, a wall through a person). One canvas for each level of
// nesting (a person fading inside a scene that fades), reused frame to frame; the opacity it's laid over at includes any already set.
// Returns what fn returns (where a figure's hand is, for a rope).
const A4_BUFS=[];let A4_DEPTH=0;
function a4_fade(ctx,a,fn){const ga=ctx.globalAlpha*a;if(ga<=0.002)return null;if(ga>=0.998){ctx.save();const r=fn(ctx);ctx.restore();return r;}const cv=ctx.canvas,d=A4_DEPTH;
  let b=A4_BUFS[d];if(!b||b.width!==cv.width||b.height!==cv.height)b=A4_BUFS[d]=mkCanvas(cv.width,cv.height);const o=b.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());A4_DEPTH++;let r=null;try{r=fn(o);}finally{A4_DEPTH--;}o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.drawImage(b,0,0);ctx.restore();return r;}
// one of Babylon's people (bab_folk), faded in and out as one picture, so the lit edge never shows through the body
function a4_folk(ctx,x,y,h,kind,t,o){o=o||{};const a=o.a==null?1:o.a;return a4_fade(ctx,a,c2=>bab_folk(c2,x,y,h,kind,t,{...o,a:1}));}
// a person, standing, faded in and out as one picture: at the left of the frame, or (o.right) at the right, mirrored to face in
function a4_who(ctx,id,x,a,t,o){o=o||{};if(a<=0.01)return;a4_fade(ctx,a,cx=>{const q={t,pose:"stand",expr:o.expr||"calm"};if(o.right)a4_personR(cx,id,x,1060,0.78,q);else person(cx,id,x,1060,0.78,q);});}

/* ---------- 1. Babylon: the old foundation, and the form ---------- */
// the tower's form, outlined: its stages as the series draws them, dashed, in a colour of its own (bab_tower's ghost is always the
// series' colour). (cx, by): the middle of its foot; s pixels to a metre
function a4_outline(ctx,cx,by,s,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash(o.dash||[10,9]);ctx.lineDashOffset=o.off||0;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=o.lw||2.6;
  ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=14;ctx.beginPath();const L=[],R=[];for(let i=0;i<7;i++){const[x,y,w,h]=bab_stageBox(i,cx,by,s);L.push([x,y+h],[x,y]);R.unshift([x+w,y],[x+w,y+h]);}
  ctx.moveTo(L[0][0],L[0][1]);L.concat(R).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();ctx.restore();});}
// the foundation's edge, lit: a warm line along the top of what was left, as the narration names it, or gold as it's confirmed
function a4_footLine(ctx,cx,by,s,col,a){if(a<=0.01)return;const w=BAB_T[0][0]*s,h=3*s;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3.2;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=18;
  ctx.beginPath();ctx.moveTo(cx-w/2,by);ctx.lineTo(cx-w/2,by-h);ctx.lineTo(cx+w/2,by-h);ctx.lineTo(cx+w/2,by);ctx.stroke();ctx.restore();});}
// a stepped tower in ink, as a builder would sketch the form: three tiers of brick, a stair up its face and a temple on top, drawn
// from the bottom as o.p goes from 0 to 1. (cx, by): the middle of its foot; s: its width
function a4_formInk(ctx,cx,by,s,o){o=o||{};const p=o.p==null?1:o.p,col=o.col||ACA_INK;if(p<=0.01)return;ctx.save();ctx.strokeStyle=rgba(col,0.92);ctx.lineWidth=o.lw||2.8;ctx.lineJoin="round";
  const T_=[[1,0.2],[0.74,0.17],[0.5,0.15]];let y=by;T_.forEach(([w,h],i)=>{const q=clamp(p*4-i,0,1);if(q<=0)return;withA(ctx,q,()=>{ctx.strokeRect(cx-w*s/2,y-h*s,w*s,h*s);
      ctx.save();ctx.strokeStyle=rgba(col,0.25);ctx.lineWidth=1.2;ctx.beginPath();for(let yy=y-h*s*0.33;yy>y-h*s;yy-=h*s*0.33){ctx.moveTo(cx-w*s/2,yy);ctx.lineTo(cx+w*s/2,yy);}ctx.stroke();ctx.restore();});y-=h*s;});
  const q=clamp(p*4-3,0,1);if(q>0)withA(ctx,q,()=>{const tw_=0.22*s,th=0.13*s;ctx.strokeRect(cx-tw_/2,y-th,tw_,th);ctx.beginPath();ctx.moveTo(cx-tw_/2-6,y-th);ctx.lineTo(cx,y-th-0.07*s);ctx.lineTo(cx+tw_/2+6,y-th);ctx.stroke();
    ctx.fillStyle=rgba(col,0.85);ctx.fillRect(cx-0.025*s,y-th*0.62,0.05*s,th*0.62);});
  const sq=clamp(p*4-1,0,1);if(sq>0)withA(ctx,sq,()=>{ctx.save();ctx.lineWidth=1.8;ctx.beginPath();const sw=0.09*s,top=by-(0.2+0.17)*s;ctx.moveTo(cx-sw/2,by);ctx.lineTo(cx-sw/2,top);ctx.moveTo(cx+sw/2,by);ctx.lineTo(cx+sw/2,top);
    for(let yy=by-8;yy>top;yy-=9){ctx.moveTo(cx-sw/2,yy);ctx.lineTo(cx+sw/2,yy);}ctx.stroke();ctx.restore();});
  ctx.restore();}
// the form, on clay: a stepped tower of brick with a temple on top, and its two parts named in ink
function a4_formCard(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);T(ctx,"the form",x+w/2,y+56,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});
    const cx=x+w/2,by=y+h-90;a4_formInk(ctx,cx,by,w*0.62,{p:o.p});
    const lA=clamp(o.lab||0,0,1);if(lA>0.01)withA(ctx,lA,()=>{const c=rgba(mix(ACA_INK,BAB_BRICK,0.35),1);
      T(ctx,"a stepped tower of brick",cx,y+h-36,{w:800,size:28,align:"center",color:c});
      const tA=clamp(o.temple||0,0,1);if(tA>0.01)withA(ctx,tA,()=>{T(ctx,"a temple on top",cx,y+108,{w:800,size:28,align:"center",color:c});
        ctx.save();ctx.strokeStyle=rgba(mix(ACA_INK,BAB_BRICK,0.35),0.8);ctx.lineWidth=2;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(cx,y+120);ctx.lineTo(cx,y+h-90-w*0.62*0.66);ctx.stroke();ctx.restore();});});});}
// the land between the rivers, on clay: the Euphrates and the Tigris, the Gulf, Babylon in the north and Ur in the south, where a
// stepped tower stands that is far older than Babylon's (o.ur, 0..1, lights it and draws it); o.ba (0..1) lights Babylon. Projected
// simply: x from longitude, y from latitude
const A4_MAPC={Babylon:[32.54,44.42],Ur:[30.96,46.10]};
const A4_EUPH=[[33.9,42.4],[33.6,42.8],[33.4,43.3],[33.35,43.78],[32.9,44.2],[32.54,44.42],[32.0,44.42],[31.6,44.9],[31.32,45.5],[31.1,46.1],[31.0,46.8],[31.0,47.4],[30.5,47.9],[30.1,48.4]];
const A4_TIGR=[[34.6,43.7],[34.2,43.9],[33.6,44.3],[33.3,44.4],[32.9,44.9],[32.5,45.8],[32.1,46.4],[31.8,47.1],[31.4,47.3],[31.0,47.4]];
function a4_map(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P=([la,lo])=>[x+60+(lo-42.4)*(w-120)/6.2,y+60+(34.6-la)*(h-120)/4.7];
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);ctx.save();
    const g0=P([30.4,47.6]);ctx.fillStyle="rgba(84,110,140,0.32)";ctx.beginPath();ctx.moveTo(g0[0],y+h-26);ctx.quadraticCurveTo(g0[0]+40,g0[1]-10,x+w-26,g0[1]-40);ctx.lineTo(x+w-26,y+h-26);ctx.closePath();ctx.fill();
    [A4_EUPH,A4_TIGR].forEach(R=>{ctx.strokeStyle="rgba(70,96,128,0.75)";ctx.lineWidth=3.4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();R.forEach((q,i)=>{const[px,py]=P(q);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();});
    const[bx,by]=P(A4_MAPC.Babylon),[ux,uy]=P(A4_MAPC.Ur),ba=clamp(o.ba||0,0,1),ur=clamp(o.ur||0,0,1);
    if(ba>0.01)glow(ctx,bx,by,40,BAB_SUN,0.4*ba);ctx.fillStyle=rgba(mix(ACA_INK,BAB_BRICK,ba),1);ctx.beginPath();ctx.arc(bx,by,7+3*ba,0,TAU);ctx.fill();
    T(ctx,"Babylon",bx-24,by-6,{w:800,size:30,align:"right",color:rgba(mix(ACA_INK,[120,50,20],ba*0.6),0.6+0.4*ba)});
    if(ur>0.01){glow(ctx,ux,uy,46,BAB_SUN,0.45*ur);withA(ctx,ur,()=>{a4_formInk(ctx,ux,uy-14,64,{p:clamp(ur*1.4,0,1),col:mix(ACA_INK,BAB_BRICK,0.5),lw:2.2});});}
    ctx.fillStyle=rgba(mix(ACA_INK,BAB_BRICK,ur),1);ctx.beginPath();ctx.arc(ux,uy,7+3*ur,0,TAU);ctx.fill();
    T(ctx,"Ur",ux-24,uy+40,{w:800,size:30,align:"right",color:rgba(mix(ACA_INK,[120,50,20],ur*0.6),0.6+0.4*ur)});
    ctx.restore();});}

/* ---------- 2. The present: what the utility already has ---------- */
// a card of glass with a kicker in mono and lines under it, for what the narration names; returns its height
function a4_card(ctx,x,y,w,kicker,lines,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-56,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));
  const h=Math.max(o.minH||0,(kicker?76:28)+L.length*sz*1.25+18);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.96)"});
    if(kicker)T(ctx,kicker,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(col,1),deco:o.deco});L.forEach((l,i)=>T(ctx,l,x+28,y+(kicker?76:28)+sz*0.92+i*sz*1.25,{w:700,size:sz,color:rgba(o.ink||INK,0.96),deco:o.deco}));});return h;}
// a reference model: what the industry already knows, as glass, with its glyph of layers
function a4_ref(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;const h=a4_card(ctx,x,y,w,"reference model",[name],EAC,{a,hi:o.hi,size:o.size||30,deco:o.deco});
  if(a>0.01)withA(ctx,a,()=>{for(let i=0;i<3;i++){ctx.save();ctx.strokeStyle=rgba(EAC,0.9);ctx.lineWidth=2;const yy=y+26+i*9,xx=x+w-64;ctx.beginPath();ctx.moveTo(xx+8,yy);ctx.lineTo(xx+40,yy);ctx.lineTo(xx+32,yy+7);ctx.lineTo(xx,yy+7);ctx.closePath();ctx.stroke();ctx.restore();}});return h;}
// a document the utility already has: a page with its corner folded, its lines, and its name under it
function a4_doc(ctx,x,y,s,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[226,218,200],hi=o.hi||0;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(hi>0.01)glow(ctx,0,0,80,col,0.3*hi);ctx.beginPath();ctx.moveTo(-42,-54);ctx.lineTo(24,-54);ctx.lineTo(42,-36);ctx.lineTo(42,54);ctx.lineTo(-42,54);ctx.closePath();
    ctx.fillStyle="rgba(236,230,214,0.96)";ctx.fill();ctx.strokeStyle=rgba(mix(col,[0,0,0],0.3),0.9);ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="rgba(200,192,174,1)";ctx.beginPath();ctx.moveTo(24,-54);ctx.lineTo(24,-36);ctx.lineTo(42,-36);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(90,84,76,0.55)";for(let k=0;k<6;k++)ctx.fillRect(-28,-30+k*13,k===5?30:56-hash(k+name.length,711)*16,3.4);ctx.restore();
    if(name)T(ctx,name,x,y+54*s+40,{w:800,size:o.size||28,align:"center",color:rgba(mix(col,INK,0.5),1),deco:o.deco});});}
// a line of light from one thing to another, for what flows between them: dashed, with a few motes running along it
function a4_flow(ctx,x0,y0,x1,y1,t,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.55);ctx.lineWidth=o.lw||2.2;ctx.setLineDash([6,9]);ctx.lineDashOffset=-t*14;
  const mx=(x0+x1)/2+(o.bend||0),my=(y0+y1)/2-(o.lift||0);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,x1,y1);ctx.stroke();ctx.restore();
  for(let j=0;j<(o.n||3);j++){const u=((t*(o.v||0.4)+j/(o.n||3)+(o.ph||0))%1),v=1-u,px=v*v*x0+2*v*u*mx+u*u*x1,py=v*v*y0+2*v*u*my+u*u*y1;glow(ctx,px,py,o.r||14,col,0.6*Math.sin(Math.PI*u));}});}
// a letter on paper: who it's from, and its lines, each written as o.p[k] goes to 1
function a4_letter(ctx,x,y,w,from,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||330,ink=[52,46,42];
  withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.008:o.rot,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.008:o.rot);ctx.translate(-w/2,-h/2);
    ctx.fillStyle=rgba(BIZ,0.9);ctx.beginPath();ctx.arc(54,56,18,0,TAU);ctx.fill();ctx.strokeStyle="rgba(120,90,30,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(54,56,12,0,TAU);ctx.stroke();
    T(ctx,from,88,66,{w:800,size:30,color:rgba(ink,0.95)});ctx.fillStyle="rgba(60,52,46,0.3)";ctx.fillRect(32,96,w-64,2);
    lines.forEach((s,k)=>{const q=o.p?clamp(o.p[k]||0,0,1):1;if(q<=0.01)return;T(ctx,typeOn(s,clamp(q*1.2,0,1)),36,160+k*58,{w:k===lines.length-1&&o.boldLast?800:700,size:36,color:rgba(ink,0.92)});});ctx.restore();});}

// a speech bubble: a household's (warm, its tail down to the right) or (o.left) its tail down to the left
function a4_bubble(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||30,col=o.col||A4_HH,w=tw(ctx,text,sz,700)+56,h=sz+34,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.save();ctx.fillStyle=rgba(col,0.85);const tx=o.left?X+38:X+w-38;
    ctx.beginPath();ctx.moveTo(tx-9,y+h/2-2);ctx.lineTo(tx+(o.left?-16:16),y+h/2+16);ctx.lineTo(tx+9,y+h/2-2);ctx.closePath();ctx.fill();ctx.restore();
    T(ctx,text,X+28,y+sz*0.36,{w:700,size:sz,color:rgba(mix(col,INK,0.5),1)});});return w;}

/* ---------- the street: roofs with solar panels, a battery, and the voltage ---------- */
// a home with solar panels on its roof, outlined in light: o.sun (0..1) the panels lit by the sun, o.down (0..1) turned down, o.lit
// (0..1) its windows lit in the evening; col: its outline
function a4_home(ctx,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sun=clamp(o.sun||0,0,1),dn=clamp(o.down||0,0,1),lit=clamp(o.lit||0,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    // the panels, on the roof's right slope, a grid of cells, lit and then dimmed
    const pv=mix([40,60,96],[120,190,255],sun*(1-0.8*dn));ctx.save();ctx.beginPath();ctx.moveTo(4,-31);ctx.lineTo(26,-12);ctx.lineTo(16,-8);ctx.lineTo(-6,-27);ctx.closePath();ctx.fillStyle=rgba(pv,0.95);ctx.fill();
    ctx.strokeStyle="rgba(10,16,30,0.7)";ctx.lineWidth=0.9;ctx.beginPath();for(let k=1;k<3;k++){const u=k/3;ctx.moveTo(lerp(4,-6,u),lerp(-31,-27,u));ctx.lineTo(lerp(26,16,u),lerp(-12,-8,u));}for(let k=1;k<4;k++){const u=k/4;ctx.moveTo(lerp(4,26,u),lerp(-31,-12,u));ctx.lineTo(lerp(-6,16,u),lerp(-27,-8,u));}ctx.stroke();
    if(sun*(1-dn)>0.02){ctx.shadowColor=rgba([150,210,255],0.9);ctx.shadowBlur=14;ctx.strokeStyle=rgba([170,220,255],0.6*sun*(1-dn));ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(4,-31);ctx.lineTo(26,-12);ctx.lineTo(16,-8);ctx.lineTo(-6,-27);ctx.closePath();ctx.stroke();}ctx.restore();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(-34,-6);ctx.lineTo(0,-36);ctx.lineTo(34,-6);ctx.moveTo(-26,-12);ctx.lineTo(-26,28);ctx.lineTo(26,28);ctx.lineTo(26,-12);ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-7,6,14,22);ctx.fillStyle=rgba(mix(col,[255,236,190],lit),0.35+0.6*lit);ctx.fillRect(10,-4,10,10);ctx.fillRect(-20,-4,10,10);
    if(lit>0.01)glow(ctx,0,4,46,[255,214,150],0.22*lit);ctx.restore();});}
// the street's battery: a cabinet on the pavement, its charge in bars, a bolt on its face; o.charge (0..1), o.hi (0..1)
function a4_battery(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ch=clamp(o.charge||0,0,1),hi=o.hi||0,col=A4_NET;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(hi>0.01)glow(ctx,0,-70,140,A4_OK,0.25*hi);
    glass(ctx,-58,-150,116,150,12,col,{glow:10+14*hi,ea:0.9,fill:"rgba(8,14,26,0.97)"});ctx.fillStyle=rgba(col,0.85);ctx.fillRect(-40,-158,80,8);
    for(let i=0;i<5;i++){const q=clamp(ch*5-i,0,1),yy=-24-i*22;ctx.fillStyle=rgba(A4_OK,0.16);rr(ctx,-38,yy-14,76,16,4);ctx.fill();if(q>0.01){ctx.fillStyle=rgba(A4_OK,0.9);rr(ctx,-38,yy-14,76*q,16,4);ctx.fill();}}
    ctx.restore();});}
// the sun, high at noon, and the moon for the evening
function a4_sun(ctx,x,y,r,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*4,A4_SUN,0.35);ctx.fillStyle=rgba(mix(A4_SUN,[255,255,255],0.3),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.save();ctx.strokeStyle=rgba(A4_SUN,0.7);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();for(let k=0;k<12;k++){const an=k/12*TAU+t*0.05;ctx.moveTo(x+Math.cos(an)*r*1.35,y+Math.sin(an)*r*1.35);ctx.lineTo(x+Math.cos(an)*r*1.75,y+Math.sin(an)*r*1.75);}ctx.stroke();ctx.restore();});}
function a4_moon(ctx,x,y,r,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*3,[220,226,255],0.18);ctx.fillStyle="rgba(236,236,250,0.95)";ctx.beginPath();ctx.arc(x,y,r,-0.5*Math.PI,0.5*Math.PI,false);ctx.arc(x+r*0.42,y,r*0.86,0.5*Math.PI,-0.5*Math.PI,true);ctx.closePath();ctx.fill();});}
// the voltage on the street: a dial from green through amber to red, its needle at v (0..1)
function a4_gauge(ctx,x,y,r,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const A0=Math.PI*1.12,A1=Math.PI*1.88,an=lerp(A0,A1,clamp(v,0,1));
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";[[0,0.55,A4_OK],[0.55,0.78,ACA_WARN],[0.78,1,A4_RED]].forEach(([u0,u1,c])=>{ctx.strokeStyle=rgba(c,0.85);ctx.lineWidth=14;ctx.beginPath();ctx.arc(x,y,r,lerp(A0,A1,u0)+0.02,lerp(A0,A1,u1)-0.02);ctx.stroke();});
    const nc=v>0.78?A4_RED:v>0.55?ACA_WARN:INK;ctx.strokeStyle=rgba(nc,1);ctx.lineWidth=5;ctx.shadowColor=rgba(nc,0.8);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an)*(r-22),y+Math.sin(an)*(r-22));ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle=rgba(nc,1);ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();ctx.restore();
    T(ctx,o.name||"voltage",x,y+46,{w:800,size:28,align:"center",color:rgba(SOFT,1)});});}
// the street at noon and in the evening: seven homes with panels, the line that takes their power, the battery when it comes, and
// the voltage. st: homes (0..1) draws them; sun, flow (power from the roofs into the street), jam (the line can't take it: amber),
// down[i] (each one's panels turned down), bat (the battery), store (noon power into it), eve (the evening), give (from it to the
// homes), gauge, v (the voltage)
const A4_HX=[300,520,740,960,1180,1400,1620],A4_HY=430,A4_LY=540,A4_HS=1.9,A4_BY2=700;
function a4_street(ctx,t,st){const hm=st.homes==null?1:st.homes;if(hm<=0.01)return;const eve=clamp(st.eve||0,0,1),jam=clamp(st.jam||0,0,1);
  // the sky: noon light over the street, dusk as the evening comes
  if(eve>0.01){ctx.fillStyle="rgba(10,10,34,"+(0.5*eve)+")";ctx.fillRect(-200,-200,2320,1480);}
  a4_sun(ctx,960,150,44,t,hm*(st.sun==null?1:st.sun)*(1-eve));a4_moon(ctx,1240,160,30,hm*eve);
  // the line along the street
  withA(ctx,hm,()=>{ctx.save();ctx.strokeStyle=rgba(mix(SOFT,ACA_WARN,jam),0.55+0.35*jam);ctx.lineWidth=4;if(jam>0.01){ctx.shadowColor=rgba(ACA_WARN,0.8);ctx.shadowBlur=14*jam;}ctx.beginPath();ctx.moveTo(180,A4_LY);ctx.lineTo(1740,A4_LY);ctx.stroke();ctx.restore();});
  A4_HX.forEach((x,i)=>{const q=clamp(hm*2.2-i*0.18,0,1);if(q<=0.01)return;const dn=(st.down||[])[i]||0;
    a4_home(ctx,x,A4_HY,A4_HS,A4_HH,{a:q,sun:st.sun==null?1:st.sun,down:dn,lit:eve});
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,A4_HY+28*A4_HS+2);ctx.lineTo(x,A4_LY);ctx.stroke();ctx.restore();});
    const fl=clamp(st.flow||0,0,1)*(1-dn);if(fl>0.01)for(let j=0;j<2;j++){const u=((t*0.5+j/2+i*0.13)%1);glow(ctx,x+14,lerp(A4_HY-30*A4_HS,A4_LY,u),14,A4_SUN,0.7*fl*Math.sin(Math.PI*u));}
    const gv=clamp(st.give||0,0,1);if(gv>0.01){const u=((t*0.45+i*0.17)%1),bx=960,px=lerp(bx,x,u);glow(ctx,px,A4_LY,12,A4_OK,0.7*gv*Math.sin(Math.PI*u));}});
  // power along the line, more than it can take
  if(jam>0.01)for(let j=0;j<8;j++){const u=((t*0.3+j/8)%1);glow(ctx,lerp(200,1720,u),A4_LY,14,ACA_WARN,0.6*jam*Math.sin(Math.PI*u));}
  const b=clamp(st.bat||0,0,1);if(b>0.01){a4_battery(ctx,960,A4_BY2,0.8,{a:b,charge:st.charge||0,hi:st.batHi||0});
    withA(ctx,b,()=>{ctx.save();ctx.strokeStyle=rgba(A4_NET,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(960,A4_LY);ctx.lineTo(960,A4_BY2-126);ctx.stroke();ctx.restore();});
    // noon power, from the roofs along the line into the battery
    const sto=clamp(st.store||0,0,1);if(sto>0.01)[0,1,2,4,5,6].forEach((k,j)=>{const u=((t*0.35+j/6)%1),x=lerp(A4_HX[k],960,easeCam(u));glow(ctx,x,A4_LY,12,A4_SUN,0.75*sto*Math.sin(Math.PI*u));});}
  if((st.gauge||0)>0.01)a4_gauge(ctx,1690,236,104,st.v||0.3,{a:st.gauge});}

/* ---------- what a design holds, the workshops, and twelve weeks ---------- */
// a card for one part of a design: its kind's glyph, large, its kind in mono, and what it answers
function a4_part(ctx,x,y,w,h,kind,label,line,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.96)"});ctx.fillStyle=rgba(col,0.08+0.12*(o.hi||0));rr(ctx,x,y,w,h,18);ctx.fill();
    archGlyph(ctx,kind,x+w/2,y+70,26,col);T(ctx,label,x+w/2,y+142,{f:"mono",w:500,size:28,align:"center",color:rgba(col,1)});
    (Array.isArray(line)?line:[line]).forEach((l,i)=>T(ctx,l,x+w/2,y+206+i*40,{w:700,size:30,align:"center",color:rgba(INK,0.96)}));});}
// a car with a plug, for the night tariff: an outline in light, its cable to a charger
function a4_car(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.lineCap="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(-46,10);ctx.lineTo(-46,-4);ctx.quadraticCurveTo(-40,-12,-26,-14);ctx.lineTo(-14,-28);ctx.lineTo(18,-28);ctx.lineTo(32,-14);ctx.quadraticCurveTo(46,-12,48,0);ctx.lineTo(48,10);ctx.closePath();ctx.stroke();
  ctx.beginPath();ctx.arc(-26,12,8,0,TAU);ctx.moveTo(34,12);ctx.arc(26,12,8,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(48,2);ctx.quadraticCurveTo(66,4,68,24);ctx.lineTo(68,32);ctx.stroke();
  ctx.strokeRect(62,32,12,22);ctx.restore();});}
// a clock face, for waiting
function a4_clock(ctx,x,y,r,col,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  const h=t*0.3,m=t*3.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(h)*r*0.5,y-Math.cos(h)*r*0.5);ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(m)*r*0.78,y-Math.cos(m)*r*0.78);ctx.stroke();ctx.restore();});}
// a row of blocks for time: n of them, each w wide, filled as far as p (0..n); o.col, o.label under it
function a4_blocks(ctx,x,y,n,w,p,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const g=o.gap||8,h=o.h||40;
  withA(ctx,a,()=>{for(let i=0;i<n;i++){const q=clamp(p-i,0,1),bx=x+i*(w+g);ctx.save();ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2;rr(ctx,bx,y,w,h,6);ctx.stroke();if(q>0.01){ctx.fillStyle=rgba(col,0.75);rr(ctx,bx,y,w*q,h,6);ctx.fill();}ctx.restore();}
    if(o.label)T(ctx,o.label,o.lx==null?x:o.lx,y+h+44,{w:800,size:o.size||30,align:o.align||"left",color:rgba(col,1)});});}
// a page: blank (o.blank), with a question mark on it, or a draft with notes on it (o.notes, 0..1) and marks made on them as
// people react (o.marks, 0..1)
function a4_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot||0,plain:true});
    if(o.blank){ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle="rgba(110,104,96,0.5)";ctx.lineWidth=2;ctx.strokeRect(x+26,y+26,w-52,h-52);ctx.restore();T(ctx,"?",x+w/2,y+h/2+40,{w:800,size:120,align:"center",color:"rgba(110,104,96,0.6)"});return;}
    const nt=clamp(o.notes==null?1:o.notes,0,1),mk=clamp(o.marks||0,0,1),C=[A4_PAPER.net,A4_PAPER.ret,A4_PAPER.rule];
    for(let r=0;r<3;r++)for(let k=0;k<3;k++){const i=r*3+k,q=clamp(nt*9-i,0,1);if(q<=0.01)continue;const nx=x+30+k*(w-60)/3,ny=y+36+r*(h-72)/3,nw=(w-60)/3-14,nh=(h-72)/3-14;
      withA(ctx,q,()=>{ctx.fillStyle=rgba(C[(i+r)%3],1);ctx.fillRect(nx,ny,nw,nh);ctx.fillStyle="rgba(40,40,48,0.4)";ctx.fillRect(nx+10,ny+nh*0.35,nw-26,4);ctx.fillRect(nx+10,ny+nh*0.55,nw-40,4);});
      const m=clamp(mk*9-((i*4)%9),0,1);if(m>0.01)withA(ctx,m,()=>{ctx.save();ctx.lineWidth=3.6;ctx.lineCap="round";const mx=nx+nw-16,my=ny+16;
        if(i%4===1){ctx.strokeStyle="rgba(200,60,50,0.9)";ctx.beginPath();ctx.moveTo(nx+6,ny+nh*0.45);ctx.lineTo(nx+nw-6,ny+nh*0.45);ctx.stroke();}
        else if(i%4===3){ctx.strokeStyle="rgba(200,60,50,0.9)";ctx.beginPath();ctx.moveTo(nx+8,ny+nh-8);ctx.quadraticCurveTo(nx+nw*0.5,ny+nh*0.62,nx+nw-8,ny+nh-12);ctx.stroke();}
        else{ctx.strokeStyle="rgba(40,140,80,0.9)";ctx.beginPath();ctx.moveTo(mx-8,my);ctx.lineTo(mx-2,my+7);ctx.lineTo(mx+9,my-8);ctx.stroke();}ctx.restore();});}});}

/* ---------- the agent's sources, and the wall where it drafts ---------- */
// The wall, in the frame's own space: the value stream along the top, then two lanes, the network's and retail's, with the rules
// between them on a wall of brick, the wall that keeps the two businesses apart; the names on the left. A note is 372 wide and 140
// tall; four columns. Nothing reaches the captions' band.
const A4_COL=[488,886,1284,1682],A4_NW=372,A4_NH=140,A4_VY=70,A4_VH=110,A4_RA=194,A4_RB=346,A4_WY=494,A4_WH=132,A4_RR=636,A4_LX=282,A4_LW=1604;
// what's on the wall: id, its kind (ArchiMate's glyph), its side, where it is [column, row] (row: "a", "b" the network's two,
// "r" retail's; the value stream's stages and the rules have their own places), what it says, where it came from, and who confirms it
const A4_NOTES=[
  {id:"v1",kind:"stream",side:"ret",vs:0,text:"sign up",src:"government's request"},
  {id:"v2",kind:"stream",side:"net",vs:1,text:"store noon power",src:"IEC's list"},
  {id:"v3",kind:"stream",side:"net",vs:2,text:"give it back at dusk",src:"network procedures"},
  {id:"v4",kind:"stream",side:"ret",vs:3,text:"credit the bill",src:"retail's product rules"},
  {id:"c1",kind:"capability",side:"net",col:0,row:"a",text:"run the battery",src:"IEC's list"},
  {id:"p1",kind:"process",side:"net",col:1,row:"a",text:"charge at noon, give back at dusk",src:"network procedures"},
  {id:"p2",kind:"process",side:"net",col:2,row:"a",text:"who decides when it charges?",src:"the agent's guess",guess:1,fix:"the control room decides"},
  {id:"nn",kind:"process",side:"net",col:3,row:"a",text:"offer it to every retailer alike",src:"DEC-031",added:1},
  {id:"in",kind:"object",side:"net",col:0,row:"b",text:"homes with solar panels",src:"on the map",onMap:1},
  {id:"i1",kind:"object",side:"net",col:1,row:"b",text:"battery",src:"CIM"},
  {id:"i2",kind:"object",side:"net",col:2,row:"b",text:"each home's retailer",src:"market role model"},
  {id:"p3",kind:"process",side:"net",col:3,row:"b",text:"switch off and lock it before crews work",src:"added by Grace",added:1},
  {id:"p4",kind:"process",side:"ret",col:0,row:"r",text:"invite homes with solar panels",src:"government's request",fix:"each retailer invites its own customers"},
  {id:"c2",kind:"capability",side:"ret",col:1,row:"r",text:"credit stored power",src:"retail's product rules"},
  {id:"p5",kind:"process",side:"ret",col:2,row:"r",text:"credit each bill",src:"retail's product rules"},
  {id:"i3",kind:"object",side:"ret",col:3,row:"r",text:"a battery account for each home",src:"CIM",strike:1},
  {id:"r1",kind:"principle",side:"rule",rule:0,text:"the network treats every retailer the same",src:"the regulator's code"},
  {id:"r2",kind:"principle",side:"rule",rule:1,text:"customer information stays where it was collected",src:"the regulator's code"}];
const A4_N={};A4_NOTES.forEach(n=>A4_N[n.id]=n);
// who confirms each side, and the date each one's notes carry
const A4_OWN={net:["Grace","19 May"],ret:["head of retail","26 May"],rule:["Ama","2 June"]},A4_LATE="9 June";
// where a note is: [x, y, w, h], top-left
function a4_box(n){if(n.vs!=null){const x=290+n.vs*393;return[x,A4_VY,410,A4_VH];}if(n.rule!=null)return[n.rule?1326:760,A4_WY+8,540,A4_WH-16];
  return[A4_COL[n.col]-A4_NW/2,n.row==="a"?A4_RA:n.row==="b"?A4_RB:A4_RR,A4_NW,A4_NH];}
// the bottom line of a note: where it came from, while it's a draft; once confirmed, a gold tick, who confirmed it and the date
function a4_foot(ctx,x,y,w,n,o,ink){const sA=clamp(o.srcA==null?0:o.srcA,0,1),gl=clamp(o.glass||0,0,1),sz=28;
  if(sA>0.01&&gl<0.99)withA(ctx,sA*(1-gl),()=>{const col=n.guess&&!(o.fixed>0.5)?ACA_WARN:ink,s=o.srcText||n.src;ctx.save();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+18,y-26);ctx.lineTo(x+w-18,y-26);ctx.stroke();ctx.restore();
    // a paper clip, then the source
    const sw=tw(ctx,s,sz,700),cx0=x+w/2-sw/2-8;ctx.save();ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx0-4,y-4);ctx.lineTo(cx0-4,y-18);ctx.arc(cx0-9,y-18,5,0,Math.PI,true);ctx.lineTo(cx0-14,y-2);ctx.arc(cx0-10,y-2,4,0,Math.PI);ctx.stroke();ctx.restore();
    T(ctx,s,x+w/2+8,y,{w:700,size:sz,align:"center",color:rgba(col,col===ink?0.85:1),deco:o.deco});});
  if(gl>0.01&&o.conf)withA(ctx,gl,()=>{const s=o.conf,sw=tw(ctx,s,sz,800)+34,x0=x+w/2-sw/2;ctx.save();ctx.strokeStyle=rgba(BIZ,0.3);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+18,y-26);ctx.lineTo(x+w-18,y-26);ctx.stroke();ctx.restore();
    kt_gtick(ctx,x0+11,y-9,11,1);T(ctx,s,x0+32,y,{w:800,size:sz,color:rgba(BIZ,1),deco:o.deco});});}
// one note on the wall: paper while it's a draft, glass once its owner confirms it (o.glass), with its kind's glyph, what it says,
// its status (half: a draft; whole: confirmed) and its bottom line. o.guess (0..1): an amber edge, a guess; o.add (0..1): a gold edge,
// added in review; o.fixP (0..1): its words rewritten, as its owner corrected them; o.strike (0..1): struck out; o.hi, o.dim
function a4_note(ctx,n,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.6*clamp(o.dim||0,0,1));if(a<=0.01)return;const[x,y,w,h]=a4_box(n),side=n.side,paper=A4_PAPER[side],edge=A4_EDGE[side],hi=o.hi||0;
  // paper turning to glass: the note turns over, like a card, paper on one face and glass on the other, so its words never fade
  // into a background half way between the two
  const g0=clamp(n.onMap?1:(o.glass||0),0,1),gl=g0>0.001&&g0<0.999?(g0<0.5?0:1):g0,flip=gl!==g0?Math.max(0.03,Math.abs(Math.cos(Math.PI*g0))):1;o={...o,glass:gl,deco:o.deco||flip<0.999};
  const rot=(hash(n.id.charCodeAt(0)+n.id.charCodeAt(1)*7,9)-0.5)*0.03*(1-g0),fx=clamp(o.fixP||0,0,1),txt=fx>0.5&&n.fix?n.fix:n.text,tA=n.fix?Math.abs(fx-0.5)*2:1;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.scale(flip,1);ctx.translate(-w/2,-h/2);
    const shape=()=>{if(n.kind==="stream"){const k=24;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w-k,0);ctx.lineTo(w,h/2);ctx.lineTo(w-k,h);ctx.lineTo(0,h);ctx.lineTo(k,h/2);ctx.closePath();}else{ctx.beginPath();ctx.rect(0,0,w,h);}};
    if(hi>0.01)glow(ctx,w/2,h/2,w*0.62,o.hiCol||edge,0.3*hi);
    // paper
    if(gl<0.999)withA(ctx,1-gl,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;shape();ctx.fillStyle=rgba(paper,1);ctx.fill();ctx.restore();
      const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(0,0,0,0.06)");g.addColorStop(0.2,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(255,255,255,0.10)");shape();ctx.fillStyle=g;ctx.fill();
      if(n.kind!=="stream"){ctx.fillStyle="rgba(0,0,0,0.10)";ctx.beginPath();ctx.moveTo(w,h-16);ctx.lineTo(w-16,h);ctx.lineTo(w,h);ctx.closePath();ctx.fill();}});
    // glass
    if(gl>0.001)withA(ctx,gl,()=>{if(n.kind==="stream"){ctx.save();shape();ctx.fillStyle="rgba(7,12,24,0.94)";ctx.fill();ctx.shadowColor=rgba(edge,0.7);ctx.shadowBlur=16;ctx.strokeStyle=rgba(edge,0.95);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();shape();ctx.fillStyle=rgba(edge,0.12);ctx.fill();}
      else{glass(ctx,0,0,w,h,12,edge,{glow:14+12*hi,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(edge,0.12);rr(ctx,0,0,w,h,12);ctx.fill();}});
    // a guess: an amber edge, dashed; added in review: a gold edge
    const gs=clamp(o.guess||0,0,1);if(gs>0.01)withA(ctx,gs,()=>{ctx.save();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=10;shape();ctx.stroke();ctx.restore();});
    const ad=clamp(o.add||0,0,1);if(ad>0.01)withA(ctx,ad,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(BIZ,0.8);ctx.shadowBlur=12;shape();ctx.stroke();ctx.restore();});
    // what it says, in ink on paper or light on glass, and its kind's glyph
    const ink=mix(INKD,INK,gl),inkA=0.92;if(n.kind!=="stream")archGlyph(ctx,n.kind,26,26,11,mix(mix(INKD,[90,90,100],0.2),edge,gl));
    const ts=n.rule!=null?28:30;withA(ctx,tA,()=>{if(n.rule!=null){wrapT(ctx,txt,0,0,w-86,{size:ts,w:700,measure:true}).forEach((l,i)=>T(ctx,l,58,33+i*30,{w:700,size:ts,color:rgba(ink,inkA),deco:o.deco}));}
      else{const ls=wrapT(ctx,txt,0,0,w-(n.kind==="stream"?72:80),{size:ts,w:700,measure:true}),lh=ts*1.14,cy=n.kind==="stream"?46:ls.length>1?58:72;
        ls.forEach((l,i)=>T(ctx,l,w/2+(n.kind==="stream"?4:0),cy+i*lh-(n.kind==="stream"?(ls.length-1)*lh/2:0),{w:700,size:ts,align:"center",color:rgba(ink,inkA),deco:o.deco}));}});
    // a correction: a pen's stroke under it while it's rewritten
    if(n.fix&&fx>0.01&&fx<0.999){ctx.save();ctx.strokeStyle=rgba(A4_RED,0.85*Math.sin(Math.PI*fx));ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(22,h*0.42);ctx.lineTo(22+(w-44)*clamp(fx*2,0,1),h*0.42+3);ctx.stroke();ctx.restore();}
    // its status, and its bottom line
    if(n.rule==null&&n.kind!=="stream")statusDot(ctx,w-22,22,9,n.onMap?1:lerp(0.5,1,gl),mix(INKD,edge,gl),1);
    const fo=n.onMap?{...o,glass:1,conf:o.conf||n.src}:o;if(n.rule!=null)a4_foot(ctx,58,h-14,tw(ctx,o.srcText||n.src,28,700)+60,n,fo,ink);else a4_foot(ctx,0,h-14,w,n,fo,ink);
    // struck out: a red line across, and it fades
    const sk=clamp(o.strike||0,0,1);if(sk>0.01){ctx.save();ctx.strokeStyle=rgba(A4_RED,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.shadowColor=rgba(A4_RED,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(14,h*0.62);ctx.lineTo(14+(w-28)*sk,h*0.38);ctx.stroke();ctx.restore();}
    ctx.restore();});}
// the wall itself: its lanes, the brick between them, and the names on the left. st: a (0..1); lanes (0..1) draws them; lab (0..1)
// the names; own[k] (0..1) each side's owner under its name (network, rules, retail); ownHi[k] lights them; dash (0..1): the lanes
// still empty, dashed; dim (0..1) dims it all; deco: its words are texture, drawn small
function a4_wallBack(ctx,st){const a=st.a==null?1:st.a,ln=clamp(st.lanes==null?1:st.lanes,0,1);if(a<=0.01||ln<=0.01)return;const dim=clamp(st.dim||0,0,1);
  withA(ctx,a*ln*(1-0.55*dim),()=>{ctx.save();
    // the lanes: dashed while they're empty, solid once the draft is on them (st.dash, 0..1, crossfades the two)
    const ds=clamp(st.dash||0,0,1);[[A4_NET,A4_RA-6,A4_RB+A4_NH-A4_RA+12],[A4_RET,A4_RR-6,A4_NH+12]].forEach(([c,y,h])=>{ctx.fillStyle=rgba(c,0.05*(1-0.6*ds));rr(ctx,A4_LX,y,A4_LW,h,14);ctx.fill();ctx.lineWidth=1.6;
      if(ds<0.99){ctx.strokeStyle=rgba(c,0.28*(1-ds));rr(ctx,A4_LX,y,A4_LW,h,14);ctx.stroke();}if(ds>0.01){ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(c,0.4*ds);rr(ctx,A4_LX,y,A4_LW,h,14);ctx.stroke();ctx.setLineDash([]);}});
    // the brick: courses of it, a little uneven, in clay's colours, darker than Babylon's
    const y0=A4_WY,h=A4_WH;ctx.fillStyle="rgba(58,42,32,0.92)";rr(ctx,A4_LX,y0,A4_LW,h,8);ctx.fill();ctx.save();rr(ctx,A4_LX,y0,A4_LW,h,8);ctx.clip();ctx.strokeStyle="rgba(20,12,8,0.55)";ctx.lineWidth=2;ctx.beginPath();
    for(let r=0,yy=y0;yy<y0+h;yy+=25,r++){ctx.moveTo(A4_LX,yy);ctx.lineTo(A4_LX+A4_LW,yy);for(let xx=A4_LX+(r%2)*40;xx<A4_LX+A4_LW;xx+=80){ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+25);}}ctx.stroke();
    ctx.fillStyle="rgba(255,226,180,0.05)";for(let i=0;i<40;i++)ctx.fillRect(A4_LX+hash(i,801)*A4_LW,y0+hash(i,802)*h,40+hash(i,803)*40,4);ctx.restore();ctx.restore();
    // the names on the left, and each side's owner
    const lb=clamp(st.lab==null?1:st.lab,0,1);if(lb>0.01)withA(ctx,lb,()=>{T(ctx,"value stream",48,A4_VY+64,{f:"mono",w:500,size:28,color:rgba(A4_STR,1),deco:st.deco});
      T(ctx,"the network",48,A4_RA+150,{w:800,size:30,color:rgba(A4_NET,1),deco:st.deco});T(ctx,"the rules",48,A4_WY+46,{w:800,size:30,color:rgba(BIZ,1),deco:st.deco});T(ctx,"retail",48,A4_RR+58,{w:800,size:30,color:rgba(A4_RET,1),deco:st.deco});
      [["Grace",A4_RA+198],["Ama",A4_WY+88],["head of retail",A4_RR+106]].forEach(([s,y],k)=>{const q=clamp((st.own||[])[k]||0,0,1);if(q<=0.01)return;const hl=(st.ownHi||[])[k]||0;withA(ctx,q,()=>{if(hl>0.01)glow(ctx,120,y-10,110,BIZ,0.3*hl);kt_gtick(ctx,60,y-9,12,1);T(ctx,s,82,y,{w:800,size:28,color:rgba(BIZ,1),deco:st.deco});});});});});}
// everything on the wall: the back, then each note in its state. st.n[id] holds each note's options for a4_note (its a, glass, srcA,
// and so on); a note with no entry isn't drawn
function a4_wall(ctx,t,st){a4_wallBack(ctx,st);const N=st.n||{},dim=clamp(st.dim||0,0,1);
  A4_NOTES.forEach(n=>{const o=N[n.id];if(!o)return;const q=o.a==null?1:o.a;if(q<=0.01)return;const[x,y,w,h]=a4_box(n);
    const d={...o,dim:Math.max(dim,o.dim||0),deco:st.deco||o.deco};if(o.t0!=null)arrive(ctx,x+w/2,y+h/2,t,o.t0,()=>a4_note(ctx,n,{...d,a:1}),{dy:-14,a:q});else a4_note(ctx,n,d);});}
// a note's middle, for a line to or from it
function a4_mid(id,dx,dy){const[x,y,w,h]=a4_box(A4_N[id]);return[x+w/2+(dx||0),y+h/2+(dy||0)];}

/* ---------- how many, and what became of them ---------- */
// the draft, counted: a row of small notes for each kind, in the papers of the sides that own them, and how many there are; o.p
// (0..1) draws them row by row
const A4_COUNT=[["value stream stages",4,A4_STR],["capabilities",9,A4_STR],["processes",27,A4_BUS],["information",12,A4_INF],["rules",6,BIZ]];
function a4_count(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=452,p=o.p==null?1:o.p,P=[A4_PAPER.net,A4_PAPER.ret];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,KT_AI,{glow:14,ea:0.85,fill:"rgba(6,12,20,0.97)"});T(ctx,"58 elements",x+40,y+70,{w:800,size:44,color:rgba(INK,0.97)});
    statusDot(ctx,x+w-210,y+56,13,0.5,INK,1);T(ctx,"each a draft",x+w-186,y+66,{w:800,size:30,color:rgba(SOFT,1)});
    A4_COUNT.forEach(([nm,n,col],r)=>{const q=clamp(p*5-r,0,1);if(q<=0.01)return;const yy=y+128+r*64;withA(ctx,q,()=>{T(ctx,String(n),x+70,yy+30,{w:800,size:34,align:"right",color:rgba(col,1)});T(ctx,nm,x+90,yy+30,{w:700,size:30,color:rgba(INK,0.92)});
      for(let i=0;i<n;i++){const k=clamp(q*n*1.2-i,0,1);if(k<=0.01)continue;const bx=x+430+(i%27)*24,by=yy+4;ctx.fillStyle=rgba(r===4?A4_PAPER.rule:P[(i+r)%2],k);ctx.fillRect(bx,by,19,19);}});});});}
// five weeks on: what the owners made of the 58, in four rows: as drafted (glass), corrected (glass, a pen's mark), struck out (red,
// crossed) and added (a gold edge); o.p (0..1) draws them
const A4_FATE=[["as drafted",41,0],["corrected",9,1],["struck out",8,2],["added",4,3]];
function a4_tally(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=420,p=o.p==null?1:o.p;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,BIZ,{glow:14,ea:0.85,fill:"rgba(12,11,8,0.97)"});T(ctx,"five weeks",x+40,y+70,{w:800,size:44,color:rgba(INK,0.97)});T(ctx,"the design, confirmed",x+w-40,y+66,{w:800,size:30,align:"right",color:rgba(BIZ,1)});
    A4_FATE.forEach(([nm,n,k],r)=>{const q=clamp((o.rows||[])[r]==null?p*4-r:(o.rows||[])[r],0,1);if(q<=0.01)return;const yy=y+130+r*70,col=k===2?A4_RED:k===3?BIZ:A4_OK;
      withA(ctx,q,()=>{T(ctx,String(n),x+80,yy+30,{w:800,size:34,align:"right",color:rgba(col,1)});T(ctx,nm,x+100,yy+30,{w:700,size:30,color:rgba(INK,0.92)});
        for(let i=0;i<n;i++){const e=clamp(q*n*1.3-i,0,1);if(e<=0.01)continue;const bx=x+330+(i%21)*26,by=yy+(i>=21?20:-2)-(n>21?10:0);ctx.save();ctx.globalAlpha*=e;
          if(k===2){ctx.strokeStyle=rgba(A4_RED,0.9);ctx.lineWidth=2;ctx.strokeRect(bx,by,19,19);ctx.beginPath();ctx.moveTo(bx+3,by+16);ctx.lineTo(bx+16,by+3);ctx.stroke();}
          else{ctx.fillStyle=rgba(k===3?BIZ:A4_NET,0.35);ctx.fillRect(bx,by,19,19);ctx.strokeStyle=rgba(k===3?BIZ:A4_NET,0.95);ctx.lineWidth=k===3?2.6:1.6;ctx.strokeRect(bx,by,19,19);
            if(k===1){ctx.strokeStyle=rgba(A4_RED,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+3,by+12);ctx.lineTo(bx+16,by+12);ctx.stroke();}}ctx.restore();}});});});}

/* ---------- Grace's finding: every source switched off and locked ---------- */
// A line in the street, a crew working on it, the substation that feeds it, switched off and locked, and the battery on the street,
// which feeds it too. o.sub (0..1): the substation switched off and locked; o.bat (0..1): the battery there; o.feed (0..1): its power
// still on the line, towards the crew; o.lock (0..1): the battery switched off and locked too
function a4_lockIcon(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  rr(ctx,-14,-4,28,24,5);ctx.fillStyle=rgba(col,0.25);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,-6,10,Math.PI,0);ctx.lineTo(10,-4);ctx.moveTo(-10,-6);ctx.lineTo(-10,-4);ctx.stroke();ctx.restore();});}
function a4_crew(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{archGlyph(ctx,"actor",x,y,s,col);ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,0.9);ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(x,y-s*0.62,s*0.36,Math.PI,0);ctx.lineTo(x+s*0.48,y-s*0.6);ctx.lineTo(x-s*0.48,y-s*0.6);ctx.closePath();ctx.fill();ctx.restore();});}
function a4_isolate(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=430,ly=y+250,sub=clamp(o.sub||0,0,1),bt=clamp(o.bat||0,0,1),fd=clamp(o.feed||0,0,1),lk=clamp(o.lock||0,0,1);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,A4_NET,{glow:14,ea:0.85,fill:"rgba(6,10,22,0.97)"});T(ctx,"before a crew works on a line",x+40,y+64,{w:800,size:32,color:rgba(INK,0.96)});
    // the line
    ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+170,ly);ctx.lineTo(x+w-170,ly);ctx.stroke();ctx.restore();
    // the substation, its switch open, and locked
    const sx=x+120;ctx.save();ctx.strokeStyle=rgba(A4_NET,0.95);ctx.lineWidth=3;ctx.strokeRect(sx-50,ly-60,100,120);ctx.beginPath();ctx.moveTo(sx-30,ly+20);ctx.lineTo(sx-10,ly-24);ctx.lineTo(sx+10,ly+20);ctx.moveTo(sx-20,ly-2);ctx.lineTo(sx,ly-2);ctx.stroke();ctx.restore();
    T(ctx,"substation",sx,ly+104,{w:800,size:28,align:"center",color:rgba(A4_NET,1)});
    if(sub>0.01){withA(ctx,sub,()=>{ctx.save();ctx.strokeStyle=rgba(A4_OK,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx+50,ly);ctx.lineTo(sx+74,ly-22);ctx.stroke();ctx.restore();});a4_lockIcon(ctx,sx+76,ly-62,1.0,A4_OK,sub);
      withA(ctx,sub,()=>T(ctx,"switched off, locked",sx+40,ly-112,{w:800,size:28,color:rgba(A4_OK,1)}));}
    // the crew, in the middle of the line
    a4_crew(ctx,x+w/2,ly-40,30,BIZ,1);T(ctx,"a crew",x+w/2,ly+70,{w:800,size:28,align:"center",color:rgba(BIZ,1)});
    // the battery on the street, and its power, still on the line
    if(bt>0.01){const bx=x+w-120;a4_battery(ctx,bx,ly+76,0.62,{a:bt,charge:0.8,hi:fd});withA(ctx,bt,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx,ly-16);ctx.lineTo(bx,ly);ctx.lineTo(x+w-170,ly);ctx.stroke();ctx.restore();
        T(ctx,"the battery",bx,ly+124,{w:800,size:28,align:"center",color:rgba(A4_NET,1)});});
      if(fd>0.01)for(let j=0;j<4;j++){const u=((t*0.5+j/4)%1),px=lerp(bx-40,x+w/2+40,u);glow(ctx,px,ly,16,A4_RED,0.8*fd*(1-lk)*Math.sin(Math.PI*u));}
      if(fd>0.01)withA(ctx,fd*(1-lk),()=>{kt_rcross(ctx,x+w/2+120,ly-110,22,1);T(ctx,"still feeding the line",x+w-60,ly-104,{w:800,size:28,align:"right",color:rgba(A4_RED,1)});});
      if(lk>0.01){a4_lockIcon(ctx,bx-62,ly-62,1.0,A4_OK,lk);withA(ctx,lk,()=>T(ctx,"switched off, locked",x+w-60,ly-104,{w:800,size:28,align:"right",color:rgba(A4_OK,1)}));}}});}

/* ---------- the model, small, for the story's end ---------- */
// the confirmed design as glass, drawn small: the value stream, two lanes and the brick between them; its words are texture
function a4_mini(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.translate(-A4_LX,-A4_VY);
  const N={};A4_NOTES.forEach(n=>{if(n.id==="i3")return;N[n.id]={glass:1,fixP:n.fix?1:0,conf:" ",srcA:0};});a4_wall(ctx,t,{n:N,lab:0,deco:1});
  if((o.cross||0)>0.01){const[x0,y0]=a4_mid("in"),[x1,y1]=a4_mid("p4");withA(ctx,o.cross,()=>{ctx.save();ctx.strokeStyle=rgba(A4_OK,0.9);ctx.lineWidth=6;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(x0,y0+70);ctx.lineTo(x0,A4_WY-6);ctx.stroke();ctx.restore();});}
  ctx.restore();});}
