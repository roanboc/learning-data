/* ===== What an agent may read: this film's pictures =====
   Uruk is drawn with the series' components (../../../shared/src/aca.js: clay, the tower's stages, its people as silhouettes); the
   present with The map before the data's (ea.js: the layers as slabs of glass, sticky notes) and the agent from Keeping it true
   (kt_agent, through aca_agent). Here: what only this film draws, prefixed a3_. Made to read on a phone: every word is at least
   28 px in the frame, or marked deco:1 as texture. */

// the layers' colours, by name, as ea.js holds them
const A3_MOT=LAY6[0][1],A3_STR=LAY6[1][1],A3_BUS=LAY6[2][1],A3_INF=LAY6[3][1],A3_APP=LAY6[4][1],A3_TEC=LAY6[5][1];
const A3_RED=[236,104,92],A3_OK=[132,226,160],A3_HH=[255,214,170],A3_DIM=[118,126,146],A3_LAMP=[255,188,108];
// the four levels a product can have, each with its colour: who may read it widens from restricted to public
const A3_LV={public:[132,226,160],internal:[140,214,255],confidential:[255,196,120],restricted:[236,104,92]};

// Inés Duarte, the utility's new data architect, as Data architecture draws her (its kit, films/data-architecture/shared/src/da.js):
// one entry in The map before the data's cast, drawn by its person(): a bob with a lighter streak, earrings, a terracotta sweater
PEOPLE.ines={name:"Inés Duarte",role:"Data architect",side:"Technical",does:"produces",edge:TECH,seed:21,
  skin:[200,150,116],hair:{style:"bob",c:[46,32,28],streak:[112,82,66]},earrings:[236,206,150],
  top:{kind:"sweater",c:[150,84,62],inner:[236,230,220]},bottom:{c:[44,46,58]},shoe:[54,42,36],build:{sh:66,hip:60,h:0.95}};

// a face that changes from one expression to another over a moment, never in one frame: m (0..1) mixes a into b (as Data
// architecture's daExpr does)
function a3_expr(a,b,m){if(!(m>0))return a;if(m>=1)return b;const A=EXPR[a],B=EXPR[b],o={},q=Math.round(m*20)/20;
  for(const k of new Set([...Object.keys(A),...Object.keys(B)])){const u=A[k]==null?0:A[k],v=B[k]==null?0:B[k];o[k]=u+(v-u)*q;}
  if(B.happy&&q<1)delete o.happy;const key="__a3_"+a+"_"+b+"_"+q;EXPR[key]=o;return key;}
// the person seen from the left: a mirror of When things go wrong's person(), for someone on the right of the frame facing in
function a3_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}

/* ---------- one buffer, for a whole picture that fades as one ---------- */
// A picture that leaves while another comes in, in one chapter, is drawn into one reused canvas and laid over at its opacity, so its
// parts never show through each other as it fades (a wall through the scribe, a card through a person).
let A3_BUF=null;
function a3_fade(ctx,a,fn){if(a<=0.002)return;if(a>=0.998){ctx.save();fn(ctx);ctx.restore();return;}const cv=ctx.canvas;
  if(!A3_BUF||A3_BUF.width!==cv.width||A3_BUF.height!==cv.height)A3_BUF=mkCanvas(cv.width,cv.height);const o=A3_BUF.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());fn(o);o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(A3_BUF,0,0);ctx.restore();}
// a person, standing, faded in and out as one picture: at the left of the frame, or (o.right) at the right, mirrored to face in
function a3_who(ctx,id,x,a,t,o){o=o||{};if(a<=0.01)return;a3_fade(ctx,a,cx=>{const q={t,pose:"stand",expr:o.expr||"calm"};if(o.right)a3_personR(cx,id,x,1060,0.78,q);else person(cx,id,x,1060,0.78,q);});}

/* ---------- 1. Uruk: a scholar's room, at night ---------- */
// The room is drawn in the frame's own space (1920 by 1080), and the camera (focus) moves over it. It's of mud brick, lit by one oil
// lamp on a low stand: a doorway on the left onto the courtyard and the stars, niches in the back wall with tablets in them, two
// jars of tablets, and a reed mat on the floor, where the scribe sits. The tablet doesn't say when in the day it was written: the
// lamp is the film's. o.lamp (0..1): how bright the lamp burns; o.dim (0..1): the room in shadow, under cards
const A3_LX=1086,A3_LY=664,A3_FL=812,A3_SX=650,A3_OX=930,A3_OY=706;
function a3_room(ctx,t,o){o=o||{};const lp=o.lamp==null?1:o.lamp,fl=0.9+0.07*Math.sin(t*7.3)*Math.sin(t*3.1+1)+0.03*Math.sin(t*13.7);
  const wall=[44,30,22],lit=mix(wall,A3_LAMP,0.42);
  // the back wall, its courses of mud brick, and the light of the lamp on it
  const g=ctx.createRadialGradient(A3_LX,A3_LY-60,40,A3_LX,A3_LY-60,1100);g.addColorStop(0,rgba(mix(wall,lit,0.85*lp*fl),1));g.addColorStop(0.45,rgba(mix(wall,lit,0.35*lp),1));g.addColorStop(1,rgba(mix(wall,[10,8,8],0.55),1));
  ctx.fillStyle=g;ctx.fillRect(-500,-400,2920,A3_FL+400);
  ctx.save();ctx.strokeStyle="rgba(0,0,0,0.13)";ctx.lineWidth=1.4;ctx.beginPath();for(let y=A3_FL-30,r=0;y>-380;y-=30,r++){ctx.moveTo(-500,y);ctx.lineTo(2420,y);for(let x=-500+(r%2)*36;x<2420;x+=72){ctx.moveTo(x,y);ctx.lineTo(x,y-30);}}ctx.stroke();ctx.restore();
  // the doorway onto the courtyard: the night, a few stars, the far wall and a palm against the sky
  const dx0=150,dx1=392,dy0=262;ctx.save();ctx.beginPath();ctx.moveTo(dx0,A3_FL);ctx.lineTo(dx0,dy0+60);ctx.quadraticCurveTo(dx0,dy0,(dx0+dx1)/2,dy0);ctx.quadraticCurveTo(dx1,dy0,dx1,dy0+60);ctx.lineTo(dx1,A3_FL);ctx.closePath();
  const sg=ctx.createLinearGradient(0,dy0,0,A3_FL);sg.addColorStop(0,"#0a1028");sg.addColorStop(0.7,"#16203e");sg.addColorStop(1,"#1a1c2c");ctx.fillStyle=sg;ctx.fill();ctx.clip();
  for(let i=0;i<26;i++){const x=dx0+hash(i,701)*(dx1-dx0),y=dy0+hash(i,702)*300,a=(0.3+0.7*hash(i,703))*(0.75+0.25*Math.sin(t*0.6+i));ctx.fillStyle="rgba(236,236,255,"+(0.7*a)+")";ctx.beginPath();ctx.arc(x,y,0.8+1.4*hash(i,704),0,TAU);ctx.fill();}
  ctx.fillStyle="#0c0c14";ctx.fillRect(dx0-10,640,dx1-dx0+20,A3_FL-640);for(let x=dx0;x<dx1;x+=26)ctx.fillRect(x,632,14,8);bab_palm(ctx,dx0+150,642,150,t,{col:[12,12,20],lean:0.08});ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(mix(wall,A3_LAMP,0.5),0.35*lp);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(dx1+1,A3_FL);ctx.lineTo(dx1+1,dy0+60);ctx.quadraticCurveTo(dx1+1,dy0-1,(dx0+dx1)/2,dy0-1);ctx.stroke();ctx.restore();
  // niches in the back wall, with tablets laid in them, and two jars of tablets on the floor
  [[1330,330,230,150],[1610,330,230,150]].forEach(([x,y,w,h],k)=>{ctx.fillStyle="rgba(10,6,4,0.55)";ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x,y,w,10);
    for(let i=0;i<5;i++){const tx=x+18+i*42,th=46+hash(i+k*5,705)*30;ctx.fillStyle=rgba(mix(BAB_CLAY,[60,40,26],0.55-0.25*lp),1);rr(ctx,tx,y+h-th,32,th,5);ctx.fill();ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(tx+26,y+h-th,6,th);}});
  [[1470,0],[1588,1]].forEach(([x,k])=>{const h=150-k*24,w=94-k*10,y=A3_FL+6;ctx.save();ctx.beginPath();ctx.moveTo(x-w*0.22,y-h);ctx.quadraticCurveTo(x-w*0.62,y-h*0.62,x-w*0.3,y);ctx.lineTo(x+w*0.3,y);ctx.quadraticCurveTo(x+w*0.62,y-h*0.62,x+w*0.22,y-h);ctx.closePath();
    const jg=ctx.createLinearGradient(x-w/2,0,x+w/2,0);jg.addColorStop(0,rgba(mix(BAB_CLAY,[30,20,14],0.75),1));jg.addColorStop(1,rgba(mix(BAB_CLAY,[30,20,14],0.5-0.2*lp),1));ctx.fillStyle=jg;ctx.fill();
    ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fillRect(x-w*0.24,y-h-8,w*0.48,10);ctx.fillStyle=rgba(mix(BAB_CLAY,[40,26,18],0.5),1);for(let i=0;i<3;i++){rr(ctx,x-w*0.18+i*w*0.12,y-h-30+hash(i+k*3,706)*10,w*0.1,28,3);ctx.fill();}ctx.restore();});
  // the floor of beaten earth, and the reed mat
  const fg=ctx.createLinearGradient(0,A3_FL,0,1180);fg.addColorStop(0,rgba(mix([40,28,20],A3_LAMP,0.2*lp),1));fg.addColorStop(1,"#0b0807");ctx.fillStyle=fg;ctx.fillRect(-500,A3_FL,2920,700);
  ctx.save();ctx.beginPath();ctx.moveTo(440,A3_FL+8);ctx.lineTo(980,A3_FL+8);ctx.lineTo(1030,A3_FL+70);ctx.lineTo(400,A3_FL+70);ctx.closePath();ctx.fillStyle=rgba(mix([92,70,42],A3_LAMP,0.25*lp),1);ctx.fill();ctx.clip();
  ctx.strokeStyle="rgba(40,26,14,0.35)";ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<32;i++){const u=i/32;ctx.moveTo(lerp(440,400,0)+u*560,A3_FL+8);ctx.lineTo(400+u*640,A3_FL+70);}for(let y=A3_FL+16;y<A3_FL+70;y+=10){ctx.moveTo(380,y);ctx.lineTo(1040,y);}ctx.stroke();ctx.restore();
  // the low stand by the scribe, where the original lies and the lamp burns
  ctx.fillStyle=rgba(mix([58,40,28],A3_LAMP,0.3*lp),1);ctx.fillRect(842,A3_OY+18,280,A3_FL-A3_OY-12);ctx.fillStyle=rgba(mix([80,58,40],A3_LAMP,0.45*lp),1);ctx.fillRect(834,A3_OY+10,296,14);
  ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(842,A3_OY+24,280,8);
  // the lamp: a clay lamp with a spout, its flame and its light
  if(lp>0.01){glow(ctx,A3_LX+28,A3_LY-18,520,A3_LAMP,0.30*lp*fl);glow(ctx,A3_LX+28,A3_LY-18,120,[255,220,160],0.5*lp*fl);}
  ctx.save();ctx.fillStyle=rgba(mix([96,66,44],A3_LAMP,0.35*lp),1);ctx.beginPath();ctx.ellipse(A3_LX,A3_LY+24,44,18,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(A3_LX+20,A3_LY+16);ctx.quadraticCurveTo(A3_LX+44,A3_LY+8,A3_LX+52,A3_LY+4);ctx.lineTo(A3_LX+50,A3_LY+16);ctx.quadraticCurveTo(A3_LX+40,A3_LY+28,A3_LX+20,A3_LY+30);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.25)";ctx.beginPath();ctx.ellipse(A3_LX,A3_LY+18,18,6,0,0,TAU);ctx.fill();
  if(lp>0.01){const fx=A3_LX+50,fy=A3_LY+2,fh=(30+5*Math.sin(t*5.1))*lp,sw=2.6*Math.sin(t*4.3);ctx.beginPath();ctx.moveTo(fx-7,fy);ctx.quadraticCurveTo(fx-8,fy-fh*0.5,fx+sw,fy-fh);ctx.quadraticCurveTo(fx+8,fy-fh*0.5,fx+7,fy);ctx.closePath();
    const ff=ctx.createLinearGradient(0,fy-fh,0,fy);ff.addColorStop(0,"rgba(255,236,190,0)");ff.addColorStop(0.4,"rgba(255,214,140,"+(0.9*lp)+")");ff.addColorStop(1,"rgba(255,150,70,"+lp+")");ctx.fillStyle=ff;ctx.fill();}
  ctx.restore();
  if((o.dim||0)>0.01){ctx.fillStyle="rgba(8,6,6,"+(0.62*o.dim)+")";ctx.fillRect(-500,-400,2920,1700);}}
// the scribe: a man of Uruk, seated cross-legged on the mat, facing the lamp (right), drawn as the series draws its people, a
// silhouette lit along its edge from the lamp. In his left hand his copy, held up to the light; in his right, the reed he writes with.
// (x,y): where he sits; h: his height if he stood (bab_folk's units, 100 to a person); o.write (0..1): how hard he's writing, the reed
// moving a little; o.look (0..1): his head bent to the original on the stand. Returns where his copy is, in the frame.
function a3_scribe(ctx,x,y,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const k=h/100,col=[22,15,13],rim=o.rim==null?0.7:o.rim,lk=clamp(o.look||0,0,1),wr=clamp(o.write||0,0,1);
  const hx=6+3.4*lk,hy=-61+2.6*lk,pen=wr*(0.7*Math.sin(t*5.2)+0.4*Math.sin(t*8.9));
  // each part of him is filled on its own, so where two overlap they join, and the rim behind shows only at his edge
  const parts=[
    // the robe over his crossed legs, and his body above it, bent a little over the tablet
    ()=>{ctx.moveTo(-24,0);ctx.quadraticCurveTo(-27,-12,-15,-17);ctx.lineTo(16,-15);ctx.quadraticCurveTo(32,-12,36,-4);ctx.quadraticCurveTo(36,0,31,0);ctx.closePath();},
    ()=>{ctx.moveTo(-17,-12);ctx.quadraticCurveTo(-20,-32,-9,-47);ctx.quadraticCurveTo(-1,-53,7,-49);ctx.quadraticCurveTo(15,-38,13,-12);ctx.closePath();},
    ()=>{ctx.moveTo(-1+lk,-55+lk);ctx.lineTo(5+lk*1.6,-55+lk*1.6);ctx.lineTo(6,-47);ctx.lineTo(-1,-47);ctx.closePath();},
    // his head, beard and hair to the neck, turned as one
    ()=>{ctx.moveTo(hx+6.2,hy);ctx.ellipse(hx,hy,6.2,7,0.25*lk,0,TAU);},
    ()=>{ctx.moveTo(hx+5,hy+3.6);ctx.lineTo(hx+7.6,hy+5.8);ctx.lineTo(hx+4.6,hy+11);ctx.lineTo(hx-1.2,hy+8.4);ctx.closePath();},
    ()=>{ctx.moveTo(hx-4.6,hy-5);ctx.quadraticCurveTo(hx-8,hy+2,hx-7,hy+9);ctx.lineTo(hx-2,hy+8);ctx.closePath();},
    ()=>{ctx.moveTo(hx+5.8,hy-1.4);ctx.lineTo(hx+8,hy+1.6);ctx.lineTo(hx+5.8,hy+2.6);ctx.closePath();},
    // his arms, each in two parts and a hand: the left holds the copy up to the light, the right the reed on it
    ()=>bab_limb(ctx,[[1,-46],[7,-32]],7.4,6.1),()=>bab_limb(ctx,[[7,-32],[18,-33]],6.1,4.8),()=>{ctx.moveTo(21,-33);ctx.ellipse(18,-33,3,3.6,0,0,TAU);},
    ()=>bab_limb(ctx,[[5,-47],[15,-34]],7.4,6.1),()=>bab_limb(ctx,[[15,-34],[22+pen*0.3,-38+pen*0.6]],6.1,4.8),()=>{ctx.moveTo(25+pen*0.3,-38+pen*0.6);ctx.ellipse(22+pen*0.3,-38+pen*0.6,3,3.6,0,0,TAU);}];
  withA(ctx,a,()=>{const draw=(fill,ox,oy)=>{ctx.save();ctx.translate(x+ox,y+oy);ctx.scale(k,k);ctx.fillStyle=fill;parts.forEach(f=>{ctx.beginPath();f();ctx.fill();});ctx.restore();};
    if(rim>0.01)draw(rgba(mix(col,A3_LAMP,0.85*rim),1),Math.max(1.4,h*0.012),-Math.max(0.4,h*0.004));draw(rgba(col,1),0,0);
    // the copy in his hand, clay lit by the lamp, and the reed on it
    ctx.save();ctx.translate(x+24*k,y-38.6*k);ctx.rotate(-0.42);ctx.fillStyle=rgba(mix(BAB_CLAY,A3_LAMP,0.2),1);rr(ctx,-8*k,-5.6*k,16*k,11.2*k,1.6*k);ctx.fill();
    ctx.strokeStyle="rgba(90,56,30,0.45)";ctx.lineWidth=Math.max(1,k*0.5);ctx.beginPath();for(let i=1;i<5;i++){const yy=-5.6*k+i*2.24*k;ctx.moveTo(-6.6*k,yy);ctx.lineTo(6.6*k-hash(i,707)*4*k,yy);}ctx.stroke();ctx.restore();
    ctx.save();ctx.strokeStyle=rgba(mix(col,BAB_ROPE,0.55),1);ctx.lineWidth=Math.max(1.6,k*0.9);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+(22+pen*0.3)*k,y+(-38+pen*0.6)*k);ctx.lineTo(x+(25+pen*0.3)*k,y+(-46+pen*0.6)*k);ctx.stroke();ctx.restore();});
  return[x+24*k,y-38.6*k];}
// the original, lying on the stand by the lamp: a tablet of clay seen from above and in front. o.hi (0..1) lights it
function a3_lying(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=w*0.3,hi=o.hi||0;
  withA(ctx,a,()=>{ctx.save();if(hi>0.01)glow(ctx,x,y,w*1.2,A3_LAMP,0.3*hi);ctx.beginPath();ctx.moveTo(x-w/2+12,y-h/2);ctx.lineTo(x+w/2+12,y-h/2);ctx.lineTo(x+w/2,y+h/2);ctx.lineTo(x-w/2,y+h/2);ctx.closePath();
    const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(mix(BAB_CLAY,[80,50,30],0.4),1));g.addColorStop(1,rgba(mix(BAB_CLAY,A3_LAMP,0.25),1));ctx.fillStyle=g;ctx.fill();
    ctx.fillStyle="rgba(60,36,20,0.6)";ctx.fillRect(x-w/2,y+h/2,w,6);ctx.strokeStyle="rgba(90,56,30,0.4)";ctx.lineWidth=1.4;ctx.beginPath();for(let i=1;i<6;i++){const u=i/6,yy=y-h/2+u*h;ctx.moveTo(x-w/2+12*(1-u)+8,yy);ctx.lineTo(x+w/2+12*(1-u)-8-hash(i,708)*20,yy);}ctx.stroke();ctx.restore();});}

/* ---------- clay: tablets, face on ---------- */
// a tablet seen face on, for what the narration names: plain rules for its lines of writing (no script is imitated), and English
// over them where the film says what it says. (x,y): its top-left; o.rules (0..1) how many lines are written; o.foot (0..1) the
// lines at its end, where the scribe writes where it came from; o.lit (0..1) the lamp's warmth on it
function a3_tablet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);if((o.lit||0)>0.01)withA(ctx,o.lit,()=>{ctx.save();const g=ctx.createRadialGradient(x+w*0.7,y+h*0.3,10,x+w*0.7,y+h*0.3,w);g.addColorStop(0,rgba(A3_LAMP,0.22));g.addColorStop(1,rgba(A3_LAMP,0));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();});
    const n=o.n||9,ru=o.rules==null?1:o.rules,top=y+(o.top||40),bot=y+h-(o.bottom||40),lh=(bot-top)/n;
    ctx.save();ctx.strokeStyle="rgba(96,60,32,0.42)";ctx.lineWidth=2.2;ctx.lineCap="round";
    for(let i=0;i<n;i++){const q=clamp(ru*n-i,0,1);if(q<=0)break;const yy=top+(i+0.5)*lh,len=(w-80)*(0.55+0.4*hash(i,709));ctx.beginPath();ctx.moveTo(x+40,yy);ctx.lineTo(x+40+len*q,yy);ctx.stroke();}
    ctx.restore();});}
// what the scribe writes at the end of his copy, under a rule: where it came from, that it was copied and checked, and who may read
// it, in English (o.p from 0 to 1 writes the first two lines, from 1 to 1.5 the third); o.hi (0..1) lights them
const A3_FOOT=["from a tablet of Borsippa","copied and checked","who may read it"];
function a3_foot(ctx,x,y,w,h,t,o){o=o||{};const p=o.p||0;if(p<=0.01)return;const hi=clamp(o.hi||0,0,1);
  ctx.save();ctx.fillStyle="rgba(96,60,32,0.45)";ctx.fillRect(x+40,y+h-150,(w-80)*clamp(p*3,0,1),2.4);ctx.restore();
  A3_FOOT.forEach((s,k)=>{const q=k<2?clamp(p*2-k,0,1):clamp((p-1)*2,0,1);if(q<=0.01)return;const yy=y+h-110+k*38;
    withA(ctx,q,()=>{if(hi>0.01)glow(ctx,x+w/2,yy-10,w*0.45,A3_LAMP,0.22*hi);T(ctx,typeOn(s,clamp(q*1.3,0,1)),x+w/2,yy,{w:800,size:28,align:"center",color:rgba(mix(ACA_INK,[150,64,24],0.5*hi),0.96)});});});}
// what the scribe wrote at its end, on clay: one line for each sentence, centred, so none breaks in the middle; returns its height
function a3_quote(ctx,x,y,w,lines,src,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||34,lh=sz*1.3,h=80+lines.length*lh+(src?44:0);if(a<=0.01)return h;
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);lines.forEach((l,i)=>T(ctx,(i===0?"“":"")+l+(i===lines.length-1?"”":""),x+w/2,y+60+i*lh,{w:700,size:sz,align:"center",color:rgba(ACA_INK,0.96)}));
    if(src)T(ctx,src,x+w/2,y+h-32,{f:"mono",w:500,size:28,align:"center",color:rgba(mix(ACA_INK,BAB_BRICK,0.5),1)});});return h;}
// the tower's seven stages, drawn in ink on clay as the tablet gives them: (cx, by) the middle of its foot; s pixels to a metre; o.k
// scales its width (a copy that slipped draws it narrower); o.col its ink; o.p (0..1) draws it from the bottom
function a3_stages(ctx,cx,by,s,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p;if(a<=0.01||p<=0.01)return;const col=o.col||ACA_INK,kw=o.k||1;
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.92);ctx.lineWidth=o.lw||2.6;ctx.lineJoin="round";let y=by;
    BAB_T.forEach(([w,h],i)=>{const q=clamp(p*7-i,0,1);if(q<=0)return;const ww=w*s*kw,hh=h*s;withA(ctx,q,()=>{ctx.strokeRect(cx-ww/2,y-hh,ww,hh);if(i===0&&o.fill){ctx.fillStyle=rgba(o.fill,0.18);ctx.fillRect(cx-ww/2,y-hh,ww,hh);}});y-=hh;});
    ctx.restore();});}
// a card of clay with a tower on it and its base in words, for the copies in a row: [x, y] its top-left, w and h; label: which copy
// it is; num: the base it gives, in cubits; o.was: the number it gave before it slipped, crossfading into num as o.slip goes to 1
// (in red, the tower narrowing with it); o.p (0..1): the copy being made; o.ring (0..1): a red ring round the wrong number
function a3_copy(ctx,x,y,w,h,label,num,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sl=clamp(o.slip==null?(o.bad?1:0):o.slip,0,1),p=o.p==null?1:o.p,was=o.was||num,e=easeCam(sl),bad=o.was?e:(o.bad?1:0);
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);T(ctx,label,x+w/2,y+52,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});
    a3_stages(ctx,x+w/2,y+h-92,1.9,{k:lerp(was,num,e)/180,col:mix(ACA_INK,[200,40,30],0.8*bad),p,lw:2.4});
    const tA=clamp(p*1.4-0.4,0,1);withA(ctx,tA,()=>{const one=(n,al,cl)=>withA(ctx,al,()=>T(ctx,"base: "+n+" cubits",x+w/2,y+h-36,{w:800,size:30,align:"center",color:rgba(mix(ACA_INK,[200,40,30],cl),1)}));
      if(o.was&&e<0.999)one(was,1-e,0);one(num,o.was?e:1,bad);});
    if((o.ring||0)>0.01)withA(ctx,o.ring,()=>{ctx.save();ctx.strokeStyle=rgba(A3_RED,0.9);ctx.lineWidth=3.4;ctx.beginPath();ctx.ellipse(x+w/2,y+h-46,w*0.42,30,0,0,TAU);ctx.stroke();ctx.restore();});});}
// a small map of Babylonia on clay: the two rivers, the Gulf, and three cities. o.ur, o.bo, o.ba (0..1) light Uruk, Borsippa and
// Babylon, each named on the side away from the rivers; o.line (0..1) draws the way from Borsippa to Uruk. Projected simply: x
// from longitude, y from latitude
const A3_MAPC={Babylon:[32.54,44.42],Borsippa:[32.39,44.34],Uruk:[31.32,45.64]};
const A3_EUPH=[[33.9,42.4],[33.6,42.8],[33.4,43.3],[33.35,43.78],[32.9,44.2],[32.54,44.42],[32.0,44.42],[31.6,44.9],[31.32,45.5],[31.1,46.1],[31.0,46.8],[31.0,47.4],[30.5,47.9],[30.1,48.4]];
const A3_TIGR=[[34.6,43.7],[34.2,43.9],[33.6,44.3],[33.3,44.4],[32.9,44.9],[32.5,45.8],[32.1,46.4],[31.8,47.1],[31.4,47.3],[31.0,47.4]];
function a3_babMap(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P=([la,lo])=>[x+60+(lo-42.4)*(w-120)/6.2,y+60+(34.6-la)*(h-120)/4.7];
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);ctx.save();
    // the Gulf, in the south-east corner
    const g0=P([30.4,47.6]);ctx.fillStyle="rgba(84,110,140,0.32)";ctx.beginPath();ctx.moveTo(g0[0],y+h-26);ctx.quadraticCurveTo(g0[0]+40,g0[1]-10,x+w-26,g0[1]-40);ctx.lineTo(x+w-26,y+h-26);ctx.closePath();ctx.fill();
    [[A3_EUPH,"Euphrates"],[A3_TIGR,"Tigris"]].forEach(([R,nm])=>{ctx.strokeStyle="rgba(70,96,128,0.75)";ctx.lineWidth=3.4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();R.forEach((q,i)=>{const[px,py]=P(q);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();});
    const[x0,y0]=P(A3_MAPC.Borsippa),[x1,y1]=P(A3_MAPC.Uruk),ln=clamp(o.line||0,0,1);
    if(ln>0.01){ctx.strokeStyle=rgba(mix(ACA_INK,BAB_BRICK,0.6),0.95);ctx.lineWidth=3;ctx.setLineDash([9,8]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2+30,(y0+y1)/2-50,lerp(x0,x1,ln),lerp(y0,y1,ln)-Math.sin(Math.PI*ln)*28);ctx.stroke();ctx.setLineDash([]);}
    [["Babylon",o.ba||0,-26,-6,"right"],["Borsippa",o.bo||0,-22,30,"right"],["Uruk",o.ur||0,-22,38,"right"]].forEach(([nm,v,dx,dy,al])=>{const[px,py]=P(A3_MAPC[nm]),lit=clamp(v,0,1);
      if(lit>0.01)glow(ctx,px,py,40,BAB_SUN,0.4*lit);ctx.fillStyle=rgba(mix(ACA_INK,BAB_BRICK,lit),1);ctx.beginPath();ctx.arc(px,py,7+3*lit,0,TAU);ctx.fill();
      T(ctx,nm,px+dx,py+dy,{w:800,size:30,align:al,color:rgba(mix(ACA_INK,[120,50,20],lit*0.6),0.55+0.45*lit)});});
    ctx.restore();});}
// the tower's base seen from above, as the tablet gives it and as archaeologists measured it in the ground: (cx, cy) its middle;
// s pixels to a metre. o.dug (0..1) draws the square they measured, o.tab (0..1) the tablet's; o.labD and o.labT (0..1) their measures
function a3_base(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{const D=91.5*s,Tb=90*s,dg=clamp(o.dug||0,0,1),tb=clamp(o.tab||0,0,1);ctx.save();
    // the ground, and the square trench of the foundation
    const gg=ctx.createRadialGradient(cx,cy,40,cx,cy,D);gg.addColorStop(0,"rgba(120,94,70,0.32)");gg.addColorStop(1,"rgba(120,94,70,0)");ctx.fillStyle=gg;ctx.fillRect(cx-D,cy-D,D*2,D*2);
    if(dg>0.01)withA(ctx,dg,()=>{ctx.strokeStyle="rgba(196,170,136,0.95)";ctx.lineWidth=5;ctx.setLineDash([14,10]);ctx.strokeRect(cx-D/2,cy-D/2,D,D);ctx.setLineDash([]);
      ctx.fillStyle="rgba(196,170,136,0.08)";ctx.fillRect(cx-D/2,cy-D/2,D,D);});
    if(tb>0.01)withA(ctx,tb,()=>{ctx.strokeStyle=rgba(ACA,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(ACA,0.7);ctx.shadowBlur=12;ctx.strokeRect(cx-Tb/2,cy-Tb/2,Tb,Tb);ctx.shadowBlur=0;});
    // their measures, each beside its own side
    const lT=clamp(o.labT||0,0,1),lD=clamp(o.labD||0,0,1);ctx.lineWidth=2.4;
    if(lD>0.01)withA(ctx,lD,()=>{ctx.strokeStyle="rgba(196,170,136,0.95)";const yb=cy+D/2+34;ctx.beginPath();ctx.moveTo(cx-D/2,yb-10);ctx.lineTo(cx-D/2,yb+10);ctx.moveTo(cx-D/2,yb);ctx.lineTo(cx+D/2,yb);ctx.moveTo(cx+D/2,yb-10);ctx.lineTo(cx+D/2,yb+10);ctx.stroke();
      T(ctx,"measured in the ground: 91.5 m",cx,yb+44,{w:800,size:30,align:"center",color:"rgba(222,200,170,1)"});});
    if(lT>0.01)withA(ctx,lT,()=>{ctx.strokeStyle=rgba(ACA,0.95);const xr=cx+D/2+34;ctx.beginPath();ctx.moveTo(xr-10,cy-Tb/2);ctx.lineTo(xr+10,cy-Tb/2);ctx.moveTo(xr,cy-Tb/2);ctx.lineTo(xr,cy+Tb/2);ctx.moveTo(xr-10,cy+Tb/2);ctx.lineTo(xr+10,cy+Tb/2);ctx.stroke();
      T(ctx,"the tablet: 180 cubits,",xr+30,cy-8,{w:800,size:30,color:rgba(ACA,1)});T(ctx,"about 90 m",xr+30,cy+32,{w:800,size:30,color:rgba(ACA,1)});});
    ctx.restore();});}

/* ---------- the present: the chat, what it reads, and households ---------- */
// a household: a small house, its door and a window lit, in its colour
function a3_house(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(-34,-6);ctx.lineTo(0,-36);ctx.lineTo(34,-6);ctx.moveTo(-26,-12);ctx.lineTo(-26,28);ctx.lineTo(26,28);ctx.lineTo(26,-12);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-7,6,14,22);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(10,-4,10,10);ctx.restore();});}
// a speech bubble, the chat's (o.chat: teal, its tail down to the left) or a household's (warm, its tail down to the right); o.up:
// its tail up from its middle, to what answers
function a3_bubble(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||30,col=o.col||(o.chat?KT_AI:A3_HH),w=(o.w||tw(ctx,text,sz,700))+56,h=sz+34,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.save();ctx.fillStyle=rgba(col,0.85);const tx=o.up?X+w/2:o.chat?X+38:X+w-38;
    ctx.beginPath();if(o.up){ctx.moveTo(tx-9,y-h/2+2);ctx.lineTo(tx,y-h/2-16);ctx.lineTo(tx+9,y-h/2+2);}else{ctx.moveTo(tx-9,y+h/2-2);ctx.lineTo(tx+(o.chat?-16:16),y+h/2+16);ctx.lineTo(tx+9,y+h/2-2);}ctx.closePath();ctx.fill();ctx.restore();
    T(ctx,text,X+28,y+sz*0.36,{w:700,size:sz,color:rgba(mix(col,INK,0.5),1)});});return w;}
// a file, exported: a page with its corner folded, and o.n copies stacked behind it (an export of an export); o.stale (0..1) its
// date shown old, in amber
function a3_file(ctx,x,y,s,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=o.n||0,col=o.col||[214,206,190];
  withA(ctx,a,()=>{for(let i=n;i>=0;i--){const ox=-i*14*s,oy=-i*12*s,al=i?0.55:1;ctx.save();ctx.translate(x+ox,y+oy);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(-42,-54);ctx.lineTo(24,-54);ctx.lineTo(42,-36);ctx.lineTo(42,54);ctx.lineTo(-42,54);ctx.closePath();
      ctx.fillStyle="rgba(10,14,24,0.95)";ctx.fill();ctx.strokeStyle=rgba(col,0.9*al);ctx.lineWidth=2.4;ctx.stroke();ctx.beginPath();ctx.moveTo(24,-54);ctx.lineTo(24,-36);ctx.lineTo(42,-36);ctx.stroke();
      if(!i){ctx.fillStyle=rgba(col,0.5);for(let k=0;k<5;k++)ctx.fillRect(-28,-26+k*14,k===4?30:52-hash(k,711)*14,4);}ctx.restore();}
    if(name)T(ctx,name,x,y+54*s+40,{w:800,size:o.size||28,align:"center",color:rgba(mix(col,INK,0.3),1)});
    const st=clamp(o.stale||0,0,1);if(st>0.01)withA(ctx,st,()=>tag(ctx,x,y-54*s-30-n*12*s,o.date||"a year old",ACA_WARN,{align:"center",size:28}));});}
// the contact centre's notes: a stack of notes with lines of writing on them, one line in red where someone's medical needs are
// written down; o.hi (0..1) lights that line
function a3_notes(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{[[-0.06,-16,-10],[0.04,10,-4],[-0.01,0,0]].forEach(([r,ox,oy],k)=>{ctx.save();ctx.translate(x+ox,y+oy);ctx.rotate(r);glass(ctx,-120,-80,240,160,12,[214,206,190],{glow:4,ea:0.6,fill:"rgba(12,15,24,0.96)"});
      if(k===2){ctx.fillStyle="rgba(214,206,190,0.5)";for(let i=0;i<4;i++)ctx.fillRect(-96,-52+i*22,180-hash(i,712)*60,4);const hi=o.hi||0;if(hi>0.01)glow(ctx,0,50,110,A3_RED,0.35*hi);ctx.fillStyle=rgba(A3_RED,0.9);ctx.fillRect(-96,42,150,5);}ctx.restore();});
    if(o.name)T(ctx,o.name,x,y+130,{w:800,size:28,align:"center",color:rgba(mix([214,206,190],INK,0.3),1)});});}
// a level, as a pill in its colour: public, internal, confidential or restricted; o.hi (0..1) lights it
function a3_level(ctx,x,y,lv,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=A3_LV[lv],sz=o.size||28,w=tw(ctx,lv,sz,800)+44,h=sz+18;
  withA(ctx,a,()=>{glass(ctx,x-w/2,y-h/2,w,h,h/2,col,{glow:8+16*(o.hi||0),ea:0.9,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.16+0.18*(o.hi||0));rr(ctx,x-w/2,y-h/2,w,h,h/2);ctx.fill();
    T(ctx,lv,x,y+sz*0.36,{w:800,size:sz,align:"center",color:rgba(mix(col,INK,0.3),1),deco:o.deco});});}
// the ArchiMate glyph of a product: a box with a tab along its top-left
function a3_prodGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.strokeRect(x-s*0.8,y-s*0.5,s*1.6,s*1.1);ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.15);ctx.lineTo(x-s*0.05,y-s*0.15);ctx.lineTo(x-s*0.05,y-s*0.5);ctx.stroke();ctx.restore();}
// a data product on the map, as the data practice draws one: a product in the business layer's gold, its name, and, as they come,
// its contract (o.ct, 0..1: the contract's glyph on its corner), its owner (o.own) and o.ghost (outside the chat's reach: dashed)
function a3_product(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||A3_BUS,hi=o.hi||0,sz=o.size||30,dm=clamp(o.dim||0,0,1);
  withA(ctx,a*(1-0.55*dm),()=>{glass(ctx,x,y,w,h,8,col,{glow:8+18*hi,ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.1+0.14*hi);rr(ctx,x,y,w,h,8);ctx.fill();
    a3_prodGlyph(ctx,x+w-28,y+24,13,col);const ct=clamp(o.ct||0,0,1);if(ct>0.01)withA(ctx,ct,()=>archGlyph(ctx,"contract",x+28,y+24,12,col));
    const ls=wrapT(ctx,name,0,0,w-16,{size:sz,w:800,measure:true}),lh=sz*1.12;ls.forEach((l,i)=>T(ctx,l,x+w/2,(o.own?y+68:y+h/2+sz*0.36)-(ls.length-1)*lh/2+i*lh,{w:800,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco}));
    if(o.own)withA(ctx,o.ownA==null?1:o.ownA,()=>T(ctx,o.own,x+w/2,y+h-18,{w:700,size:o.osize||28,align:"center",color:rgba(BIZ,0.95),deco:o.deco}));});}
// a contract, opened: what it holds, how fresh it is, and who owns it, on a card of the business layer's gold
function a3_contract(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=78+rows.length*82;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,A3_BUS,{glow:14,ea:0.85,fill:"rgba(7,11,22,0.97)"});archGlyph(ctx,"contract",x+38,y+40,14,A3_BUS);T(ctx,o.title||"its contract",x+68,y+50,{f:"mono",w:500,size:28,color:rgba(A3_BUS,1)});
    rows.forEach(([k,v],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0.01)return;withA(ctx,q,()=>{T(ctx,k,x+32,y+108+i*82,{w:700,size:28,color:rgba(SOFT,1)});T(ctx,v,x+32,y+144+i*82,{w:800,size:30,color:rgba(INK,0.96)});});});});return h;}
// the chat's place: a room of glass in the agent's teal, its walls drawn round as o.p goes from 0 to 1, and its name on its top edge
function a3_place(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,p=clamp(o.p==null?1:o.p,0,1);if(a<=0.01||p<=0.01)return;const col=KT_AI,hi=o.hi||0;
  withA(ctx,a,()=>{ctx.save();const L=2*(w+h),d=L*easeCam(p);ctx.fillStyle=rgba(col,(0.05+0.05*hi)*p);rr(ctx,x,y,w,h,26);ctx.fill();
    ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=14+16*hi;ctx.setLineDash([d,L]);rr(ctx,x,y,w,h,26);ctx.stroke();ctx.shadowBlur=0;
    ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.6;ctx.setLineDash([]);if(p>0.98)rr(ctx,x+9,y+9,w-18,h-18,19),ctx.stroke();ctx.restore();
    if(o.name)withA(ctx,clamp(p*2-1,0,1),()=>{const nw=tw(ctx,o.name,30,800)+40;ctx.fillStyle="rgba(7,12,24,0.96)";ctx.fillRect(x+30,y-22,nw,44);T(ctx,o.name,x+50,y+11,{w:800,size:30,color:rgba(col,1),deco:o.deco});});});}
// the chat's own identity: a badge like a staff card, with the agent's orb on it, clipped to the agent; o.name says what it is
function a3_badge(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const hi=o.hi||0;
  withA(ctx,a,()=>{glass(ctx,x-44,y-58,88,116,10,KT_AI,{glow:10+16*hi,ea:0.9,fill:"rgba(7,14,20,0.96)"});ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(x-14,y-66,28,10);
    kt_agent(ctx,x,y-16,15,t,{});ctx.fillStyle=rgba(KT_AI,0.55);ctx.fillRect(x-28,y+16,56,5);ctx.fillRect(x-28,y+30,40,5);
    if(o.name)T(ctx,o.name,x,y+100,{w:800,size:28,align:"center",color:rgba(mix(KT_AI,INK,0.35),1)});});}
// a mask over a column: dark hatching across it; o.crack (0..1) one wrong rule, a crack that lets what's under it through
function a3_mask(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ck=clamp(o.crack||0,0,1);
  withA(ctx,a,()=>{ctx.save();rr(ctx,x,y,w,h,8);ctx.fillStyle="rgba(24,26,38,0.96)";ctx.fill();ctx.clip();ctx.strokeStyle="rgba(160,170,196,0.35)";ctx.lineWidth=6;ctx.beginPath();for(let i=-h;i<w;i+=22){ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);}ctx.stroke();ctx.restore();
    ctx.save();ctx.strokeStyle="rgba(160,170,196,0.85)";ctx.lineWidth=2.4;rr(ctx,x,y,w,h,8);ctx.stroke();ctx.restore();
    if(ck>0.01){ctx.save();ctx.strokeStyle=rgba(A3_RED,0.95*ck);ctx.lineWidth=3;ctx.shadowColor=rgba(A3_RED,0.8);ctx.shadowBlur=10;ctx.beginPath();const cx=x+w*0.5;ctx.moveTo(cx-6,y);ctx.lineTo(cx+8,y+h*0.3);ctx.lineTo(cx-4,y+h*0.55);ctx.lineTo(cx+10,y+h*ck);ctx.stroke();ctx.restore();}});}
// a household's own sign-in: a small key, in the warm colour of the households
function a3_key(ctx,x,y,s,a,col){if(a<=0.01)return;col=col||A3_HH;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(-14,0,11,0,TAU);ctx.moveTo(-3,0);ctx.lineTo(24,0);ctx.moveTo(14,0);ctx.lineTo(14,9);ctx.moveTo(21,0);ctx.lineTo(21,7);ctx.stroke();ctx.restore();});}
// the small tool: a hatch in the chat's wall, its function's braces on it; o.hi (0..1) lights it as it answers
function a3_tool(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const hi=o.hi||0,col=A3_APP;
  withA(ctx,a,()=>{glass(ctx,x-50,y-50,100,100,18,col,{glow:10+20*hi,ea:0.9,fill:"rgba(7,12,24,0.97)"});ctx.fillStyle=rgba(col,0.1+0.2*hi);rr(ctx,x-50,y-50,100,100,18);ctx.fill();
    T(ctx,"{ }",x,y+14,{w:800,size:40,align:"center",color:rgba(mix(col,INK,0.3),1)});if(o.name)T(ctx,o.name,x,y+92,{w:800,size:28,align:"center",color:rgba(mix(col,INK,0.35),1)});});}
// a phone, for a person who calls a household back
function a3_phone(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-0.5);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(-20,-16);ctx.quadraticCurveTo(-26,-6,-20,6);ctx.lineTo(-12,4);ctx.lineTo(-10,-8);ctx.lineTo(-14,-18);ctx.closePath();ctx.moveTo(20,-16);ctx.quadraticCurveTo(26,-6,20,6);ctx.lineTo(12,4);ctx.lineTo(10,-8);ctx.lineTo(14,-18);ctx.closePath();
  ctx.moveTo(-16,-16);ctx.quadraticCurveTo(0,-28,16,-16);ctx.stroke();ctx.restore();});}

/* ---------- windows, cards, tickets and owners ---------- */
// a window on a screen: a bar with its title, and its body, in the colour of what it belongs to
function a3_win(ctx,x,y,w,h,title,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+14*(o.hi||0),ea:0.7,fill:"rgba(10,14,24,0.97)"});
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.fillStyle=rgba(mix(col,[10,14,24],0.8),1);ctx.fillRect(x,y,w,60);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(x,y+59,w,1.5);ctx.restore();
  [[232,96,84],[245,206,140],[132,226,160]].forEach((c,i)=>{ctx.fillStyle=rgba(c,0.8);ctx.beginPath();ctx.arc(x+28+i*22,y+30,6,0,TAU);ctx.fill();});
  T(ctx,title,x+100,y+40,{w:700,size:o.size||28,color:rgba(mix(col,INK,0.45),1)});});}
// a card with a coloured kicker and lines below it, for what the narration names; returns its height
function a3_card(ctx,x,y,w,kicker,lines,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-56,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));
  const h=Math.max(o.minH||0,(kicker?76:28)+L.length*sz*1.25+18);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.96)"});
    if(kicker)T(ctx,kicker,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});L.forEach((l,i)=>T(ctx,l,x+28,y+(kicker?76:28)+sz*0.92+i*sz*1.25,{w:700,size:sz,color:rgba(o.ink||INK,0.96)}));});return h;}
// an owner, as the business side marks one: a gold tick and a name
function a3_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||30;kt_gtick(ctx,x,y,sz*0.5,1);T(ctx,name,x+sz*0.9,y+sz*0.36,{w:800,size:sz,color:rgba(o.col||BIZ,1)});});}
// a ticket, where the business asks and agrees: its title, who asked, a row for each agreement (o.ok[k], 0..1, ticks it), and its
// state, open or, as o.done goes to 1, closed
function a3_ticket(ctx,x,y,w,title,asker,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=196+rows.length*62,dn=clamp(o.done||0,0,1);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,BIZ,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(12,11,8,0.97)"});T(ctx,"ticket",x+28,y+46,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
    const st=dn>0.5?"closed":"open",sw=tw(ctx,st,28,800)+36;withA(ctx,1,()=>{glass(ctx,x+w-sw-24,y+22,sw,40,20,dn>0.5?A3_OK:BIZ,{glow:6,ea:0.9,fill:"rgba(7,12,24,0.94)"});T(ctx,st,x+w-sw/2-24,y+52,{w:800,size:28,align:"center",color:rgba(dn>0.5?A3_OK:BIZ,1)});});
    T(ctx,title,x+28,y+102,{w:800,size:30,color:rgba(INK,0.97)});T(ctx,asker,x+28,y+146,{w:700,size:28,color:rgba(SOFT,1)});
    rows.forEach(([who,what],i)=>{const q=clamp((o.ok||[])[i]||0,0,1),yy=y+206+i*62;withA(ctx,o.rowA?(o.rowA[i]==null?1:o.rowA[i]):1,()=>{
      if(q>0.01)kt_gtick(ctx,x+46,yy,15,q);else{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x+46,yy,15,0,TAU);ctx.stroke();ctx.restore();}
      T(ctx,who,x+76,yy+10,{w:800,size:28,color:rgba(BIZ,1)});T(ctx,what,x+76+tw(ctx,who,28,800)+16,yy+10,{w:700,size:28,color:rgba(INK,0.9)});});});});return h;}
// small icons for the drawn screen's list: a stack (a catalog), a grid (a table), a magnifier (a search index), braces (a function),
// a folder (a schema), a lock, and a person's chip (an identity)
function a3_icon(ctx,kind,x,y,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="cat"){for(let i=0;i<3;i++){rr(ctx,x-14,y-14+i*9,28,10,4);ctx.stroke();}}
  else if(kind==="data"){rr(ctx,x-13,y-11,26,22,3);ctx.stroke();ctx.beginPath();ctx.moveTo(x-13,y-3);ctx.lineTo(x+13,y-3);ctx.moveTo(x-13,y+4);ctx.lineTo(x+13,y+4);ctx.moveTo(x-3,y-11);ctx.lineTo(x-3,y+11);ctx.stroke();}
  else if(kind==="index"){ctx.beginPath();ctx.arc(x-3,y-3,9,0,TAU);ctx.moveTo(x+4,y+4);ctx.lineTo(x+12,y+12);ctx.stroke();}
  else if(kind==="fn"){[-1,1].forEach(d=>{ctx.beginPath();ctx.moveTo(x+d*5,y-12);ctx.quadraticCurveTo(x+d*12,y-12,x+d*12,y-5);ctx.quadraticCurveTo(x+d*12,y,x+d*16,y);ctx.quadraticCurveTo(x+d*12,y,x+d*12,y+5);ctx.quadraticCurveTo(x+d*12,y+12,x+d*5,y+12);ctx.stroke();});}
  else if(kind==="schema"){ctx.beginPath();ctx.moveTo(x-14,y-9);ctx.lineTo(x-5,y-9);ctx.lineTo(x-1,y-5);ctx.lineTo(x+14,y-5);ctx.lineTo(x+14,y+11);ctx.lineTo(x-14,y+11);ctx.closePath();ctx.stroke();}
  else if(kind==="lock"){rr(ctx,x-11,y-3,22,17,4);ctx.fillStyle=rgba(col,0.25);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y-4,7,Math.PI,0);ctx.stroke();}
  else if(kind==="id"){rr(ctx,x-13,y-12,26,24,4);ctx.stroke();ctx.beginPath();ctx.arc(x,y-3,4.5,0,TAU);ctx.moveTo(x-7,y+8);ctx.quadraticCurveTo(x,y+1,x+7,y+8);ctx.stroke();}
  ctx.restore();});}
