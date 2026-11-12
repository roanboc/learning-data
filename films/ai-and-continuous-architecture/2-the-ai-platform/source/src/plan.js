/* ===== The AI platform: this film's pictures =====
   Babylon is drawn with the series' components (../../../shared/src/aca.js); the present with The map before the data's (ea.js:
   the six layers, glass elements, sticky notes) and the agent from Keeping it true (kt_agent, through aca_agent). Here: what only this
   film draws, prefixed a2_. Made to read on a phone: every word is at least 28 px in the frame, or marked deco:1 as texture. */

// the layers' colours, by name, as ea.js holds them
const A2_MOT=LAY6[0][1],A2_STR=LAY6[1][1],A2_BUS=LAY6[2][1],A2_INF=LAY6[3][1],A2_APP=LAY6[4][1],A2_TEC=LAY6[5][1];
const A2_RED=[236,104,92],A2_OK=[132,226,160],A2_HH=[255,214,170],A2_DIM=[118,126,146];

// Ravi Menon, the platform lead, as Platform and solution architecture draws him (its kit, films/platform-and-solution-architecture/
// shared/src/psa.js): one entry in The map before the data's cast, drawn by its person(): short cropped dark hair, a short dark beard,
// a sage-green sweater and dark grey trousers
PEOPLE.ravi={name:"Ravi Menon",role:"Platform lead",side:"Technical",does:"produces",edge:TECH,seed:21,skin:[156,104,74],hair:{style:"cropped",c:[24,20,20]},beard:[34,28,26],top:{kind:"sweater",c:[66,104,96]},bottom:{c:[44,46,56]},shoe:[46,36,32],build:{sh:74,hip:60,h:1.0}};

// the person seen from the left: a mirror of When things go wrong's person(), for someone on the right of the frame facing in
function a2_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}

/* ---------- one buffer, for a whole picture that fades as one ---------- */
// A picture that leaves while another comes in, in one chapter, is drawn into one reused canvas and laid over at its opacity, so its
// parts never show through each other as it fades (a sky through a wall, a ground through a person).
let A2_BUF=null;
function a2_fade(ctx,a,fn){if(a<=0.002)return;if(a>=0.998){ctx.save();fn(ctx);ctx.restore();return;}const cv=ctx.canvas;
  if(!A2_BUF||A2_BUF.width!==cv.width||A2_BUF.height!==cv.height)A2_BUF=mkCanvas(cv.width,cv.height);const o=A2_BUF.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());fn(o);o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(A2_BUF,0,0);ctx.restore();}
// a person, standing, faded in and out as one picture: at the left of the frame, or (o.right) at the right, mirrored to face in
function a2_who(ctx,id,x,a,t,o){o=o||{};if(a<=0.01)return;a2_fade(ctx,a,cx=>{const q={t,pose:"stand",expr:o.expr||"calm"};if(o.right)a2_personR(cx,id,x,1060,0.78,q);else person(cx,id,x,1060,0.78,q);});}

/* ---------- 1. Babylon: its walls, from across the river ---------- */
// The city seen from across the river, in world space wider than the frame: the sky and the city's roofs (horizon A2_HZ), the
// temple-tower far off above them, the inner wall, Imgur-Enlil (about 15 m high), and in front of it the outer, Nemetti-Enlil (about
// 8 m), then the bank where the embankment rises, and the water, from A2_WY to below the frame.
const A2_HZ=560,A2_IN=[700,150],A2_OUT=[766,84],A2_WY=832,A2_EMB=788,A2_X0=-900,A2_X1=2900;
// the light as Babylon's components take it: o.dawn, o.day; o.storm (0..1) greys it as the rain comes
function a2_light(o){const[dw,dy]=bab_light(o),st=clamp(o.storm||0,0,1);return[dw*(1-0.4*st),dy*(1-0.45*st),st];}
// how far a wall's top has slumped at x, as a share of its height. In the breach at o.at (o.bw wide): a floor of rubble, and broken
// sides that climb back to the top, ragged where courses broke off and cut by the rain's rills; a little everywhere else
function a2_breach(x,o){const d=Math.abs(x-(o.at==null?1e9:o.at))/(o.bw||70);return d<0.55?1:d>1.35?0:0.5+0.5*Math.cos(Math.PI*(d-0.55)/0.8);}
function a2_slump(x,o){const m=o.melt||0;if(m<=0)return 0;const sd=o.seed||651;let b=a2_breach(x,o);
  if(b>0.02&&b<0.98)b=clamp(b+(hash(Math.floor(x/7),sd)-0.5)*0.24,0,1);
  const r=hash(Math.floor(x/4),sd+9),rill=r>0.86?(r-0.86)/0.14:0;
  return m*(b*0.72+0.035*(0.5+0.5*Math.sin(x*0.027+1.3))+0.03*hash(Math.floor(x/26),sd)+0.05*rill*(0.4+b));}
// the top of a wall at x: its towers every o.sp px, o.tw wide and o.th higher, less what has slumped, broken off course by course
function a2_top(x,x0,by,h,o){const sp=o.sp||200,u=((x-x0)%sp+sp)%sp,tH=Math.abs(u-sp/2)<(o.tw||74)/2?(o.th||28):0,dr=a2_slump(x,o)*(h+tH);
  return by-h-tH+(dr>6?Math.round(dr/5)*5:dr);}
// a stretch of city wall in mud brick, seen from outside at dawn: its face in shade, the sky's light along its top and down the
// eastern (right) side of each tower, from x0 to x1, its foot at by, h px high, with towers every sp px, tw wide and th higher, and
// stepped battlements along its top. o.melt (0..1): what heavy rain does to it (a breach at o.at, its floor a heap of ruins, mud
// streaks down its face, a little slump everywhere, and the mud spread at its foot); o.wet (0..1): its face darkened by the rain;
// o.haze (0..1): how far off it is; o.hi (0..1): the whole wall lit, when the narration names it
function a2_wall(ctx,x0,x1,by,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[dw,dy]=a2_light(o),sp=o.sp||200,tw_=o.tw||74,th=o.th||28,hz=o.haze||0,wet=clamp(o.wet||0,0,1),m=o.melt||0,sd=o.seed||651,hi=o.hi||0;
  const sky=mix(mix([20,16,28],[150,96,84],dw),[200,180,160],dy);
  let face=mix(mix([10,8,10],[56,38,32],dw),[118,96,76],dy);face=mix(face,[20,14,14],0.4*wet);face=mix(face,sky,0.32*hz);
  const top_=mix(face,mix(BAB_SUN,sky,0.4),0.22+0.12*dw),foot=mix(face,[4,3,4],0.35),rim=mix(BAB_SUN,[255,236,210],0.2),top=x=>a2_top(x,x0,by,h,o);
  withA(ctx,a,()=>{ctx.save();
    // its body, with the towers standing proud, and the breach where the rain has carried it away
    ctx.beginPath();ctx.moveTo(x0,by+2);for(let x=x0;x<=x1;x+=3){const u=((x-x0)%sp+sp)%sp;if(Math.abs(Math.abs(u-sp/2)-tw_/2)<1.6)ctx.lineTo(x,top(x-2));ctx.lineTo(x,top(x));}ctx.lineTo(x1,by+2);ctx.closePath();
    const g=ctx.createLinearGradient(0,by-h-th,0,by);g.addColorStop(0,rgba(top_,1));g.addColorStop(0.35,rgba(face,1));g.addColorStop(1,rgba(foot,1));ctx.fillStyle=g;ctx.fill();ctx.save();ctx.clip();
    if(hi>0.01){ctx.fillStyle=rgba(ACA,0.14*hi);ctx.fillRect(x0,by-h-th-2,x1-x0,h+th+4);}
    // the towers, nearer the eye: shadow on their western side, the dawn's light down their eastern edge
    for(let tx=x0+sp/2;tx<x1+sp;tx+=sp){ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(tx-tw_/2-8,by-h-th-2,8,h+th+4);ctx.fillStyle="rgba(0,0,0,0.08)";ctx.fillRect(tx-tw_/2,by-h-th-2,tw_*0.45,h+th+4);
      const rg=ctx.createLinearGradient(tx+tw_/2-10,0,tx+tw_/2,0);rg.addColorStop(0,rgba(rim,0));rg.addColorStop(1,rgba(rim,(0.1+0.22*dw+0.08*dy)*(1-0.6*wet)));ctx.fillStyle=rg;ctx.fillRect(tx+tw_/2-10,by-h-th-2,10,h+th+4);}
    // the courses of brick, and weathering: darker patches where the mud has worn
    ctx.strokeStyle="rgba(0,0,0,"+(0.1+0.06*wet)+")";ctx.lineWidth=1;ctx.beginPath();for(let y=by-5;y>by-h-th;y-=6){ctx.moveTo(x0,y);ctx.lineTo(x1,y);}ctx.stroke();
    ctx.fillStyle="rgba(0,0,0,0.07)";for(let i=0;i<(x1-x0)/26;i++){const px=x0+hash(i,664)*(x1-x0),py=by-h*(0.15+0.7*hash(i,665));ctx.fillRect(px,py,10+hash(i,666)*40,4+hash(i,667)*14);}
    // the rain's streaks of mud, down from where the top slumped
    if(m>0.01){ctx.strokeStyle=rgba(mix(face,[0,0,0],0.3),0.6*clamp(m*2,0,1));ctx.lineWidth=2;ctx.beginPath();for(let x=x0+4;x<x1;x+=6){const s=a2_slump(x,o);if(s<0.03)continue;const y0=top(x),L=(h*0.25+h*0.9*s)*clamp(m*1.6,0,1);ctx.moveTo(x+hash(x,661)*3,y0);ctx.lineTo(x+hash(x,662)*4-2,Math.min(by,y0+L*(0.5+0.5*hash(x,663))));}ctx.stroke();}
    // a wet sheen as the rain falls
    if(wet>0.01){const sg=ctx.createLinearGradient(0,by-h,0,by);sg.addColorStop(0,"rgba(170,186,206,"+(0.08*wet)+")");sg.addColorStop(1,"rgba(170,186,206,0)");ctx.fillStyle=sg;ctx.fillRect(x0,by-h-th,x1-x0,h+th);}
    ctx.restore();
    // the light along its top, where it still stands
    ctx.strokeStyle=rgba(rim,(0.18+0.3*dw+0.1*dy)*(1-0.7*wet));ctx.lineWidth=1.6;ctx.beginPath();for(let x=x0;x<=x1;x+=3){const y=top(x)+0.8;x===x0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
    // the stepped battlements, dark against the sky, lit along their tops
    for(let x=x0+4;x<x1-6;x+=17){const s=a2_slump(x+4,o);if(s>0.04)continue;const y=top(x+4),q=1-s*24;if(q<=0.05)continue;withA(ctx,q,()=>{ctx.fillStyle=rgba(top_,1);ctx.fillRect(x,y-8,9,8.5);ctx.fillRect(x+2.5,y-12,4,4.5);
      ctx.fillStyle=rgba(rim,(0.2+0.35*dw)*(1-0.7*wet));ctx.fillRect(x,y-8,9,1.2);ctx.fillRect(x+2.5,y-12,4,1.2);});}
    // the heap of ruins in the breach: lumps of fallen mud brick along its floor and broken sides, their tops catching the light
    if(m>0.05){const lc=mix(top_,mix(BAB_SUN,[200,170,140],0.5),0.15+0.15*dw),ld=mix(face,[0,0,0],0.3),q=Math.min(1,m*1.5);
      for(let x=x0;x<x1;x+=4){const b=a2_breach(x,o);if(b<0.5||hash(Math.floor(x/4),sd+22)<0.35)continue;const n=hash(Math.floor(x/4),sd+21),r=(1.8+n*3.4)*q,xx=x+(hash(Math.floor(x/4),sd+23)-0.5)*4,y=top(x)+r*0.5+hash(Math.floor(x/4),sd+24)*3,x_=xx;
        ctx.fillStyle=rgba(ld,1);ctx.beginPath();ctx.ellipse(x_+1,y+1,r*1.25,r*0.8,0,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(lc,0.8*(1-0.5*wet));ctx.beginPath();ctx.ellipse(x_,y-r*0.1,r*1.1,r*0.55,0,Math.PI,TAU);ctx.fill();}}
    // the mud the rain carried down, spread in a lumpy fan at its foot
    if(m>0.01){const at=o.at==null?1e9:o.at,bw=(o.bw||70)*1.7,hh=x=>{const d=(x-at)/bw;return m*h*0.36*Math.exp(-d*d)*(0.88+0.24*hash(Math.floor(x/8),sd+31));};
      ctx.beginPath();ctx.moveTo(at-bw*2,by+1);for(let x=at-bw*2;x<=at+bw*2;x+=4)ctx.lineTo(x,by-hh(x));ctx.lineTo(at+bw*2,by+1);
      for(let x=at+bw*2;x>=at-bw*2;x-=4){const d=(x-at)/bw;ctx.lineTo(x,by+m*h*0.12*Math.exp(-d*d));}ctx.closePath();
      const hg=ctx.createLinearGradient(0,by-h*0.36,0,by+h*0.12);hg.addColorStop(0,rgba(mix(top_,face,0.2),1));hg.addColorStop(1,rgba(foot,1));ctx.fillStyle=hg;ctx.fill();
      for(let i=0;i<34;i++){const d=(hash(i,668)-0.5)*3.0,x=at+d*bw,yy=by-hh(x)*(0.15+0.8*hash(i,669)),r=2.4+hash(i,670)*4;
        ctx.fillStyle="rgba(0,0,0,0.28)";ctx.beginPath();ctx.ellipse(x+1,yy+1,r*1.3,r*0.7,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(top_,BAB_SUN,0.1),0.7*(1-0.5*wet));ctx.beginPath();ctx.ellipse(x,yy,r*1.1,r*0.45,0,Math.PI,TAU);ctx.fill();}}
    // lit along its whole top, when the narration names it
    if(hi>0.01){ctx.strokeStyle=rgba(ACA,0.85*hi);ctx.lineWidth=2.6;ctx.shadowColor=rgba(ACA,0.9);ctx.shadowBlur=16;ctx.beginPath();for(let x=x0;x<=x1;x+=3){const y=top(x)-0.5;x===x0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
    ctx.restore();});}
// the city inside the walls, seen only through the breach: its ground, and the flat roofs of its houses, close-packed
function a2_inside(ctx,t,o){const[dw,dy]=a2_light(o),col=mix(mix([14,11,13],[62,42,40],dw),[140,118,100],dy),lit=mix(col,BAB_SUN,0.2*dw);
  ctx.fillStyle=rgba(mix(col,[0,0,0],0.4),1);ctx.fillRect(A2_AT-170,A2_HZ-2,340,A2_IN[0]-A2_HZ+6);
  for(let r=0;r<5;r++){const y=A2_HZ+14+r*24,hh=12+r*5;for(let i=0;i<9;i++){const x=A2_AT-170+i*40+hash(i+r*9,731)*20-(r%2)*20,w=30+hash(i+r*9,732)*24;
    ctx.fillStyle=rgba(mix(col,[0,0,0],0.08*r),1);ctx.fillRect(x,y-hh,w,hh+30);ctx.fillStyle=rgba(lit,0.8);ctx.fillRect(x,y-hh,w,1.6);ctx.fillStyle="rgba(0,0,0,0.35)";ctx.fillRect(x+w-4,y-hh,4,hh+30);}}}
// the bank between the outer wall and the water: beaten earth, darker towards the wall
function a2_ground(ctx,o){const[dw,dy]=a2_light(o),col=mix(mix([14,11,11],[84,60,46],dw),[120,98,76],dy);
  // the ground between the two walls, in their shade
  ctx.fillStyle=rgba(mix(col,[0,0,0],0.55),1);ctx.fillRect(A2_X0,A2_IN[0]-2,A2_X1-A2_X0,A2_OUT[0]-A2_IN[0]+4);
  const g=ctx.createLinearGradient(0,A2_OUT[0]-4,0,A2_WY);g.addColorStop(0,rgba(mix(col,[0,0,0],0.3),1));g.addColorStop(1,rgba(col,1));ctx.fillStyle=g;ctx.fillRect(A2_X0,A2_OUT[0]-4,A2_X1-A2_X0,A2_WY-A2_OUT[0]+6);}
// the brickfield on the bank, where mud bricks dry in rows in the low sun (o.field, 0..1): drawn in perspective, nearer rows larger,
// each brick square and flat, its top catching the light and a long shadow cast away from the sun; and the pit of wet mud the moulder
// works from
function a2_field(ctx,o){const f=clamp(o.field||0,0,1);if(f<=0.01)return;const[dw,dy]=a2_light(o);
  const mud=mix(mix([62,48,40],[176,146,112],dw),[204,180,142],dy),lit=mix(mud,BAB_SUN,0.3*dw),side=mix(mud,[0,0,0],0.42);
  withA(ctx,f,()=>{ctx.fillStyle=rgba(mix(mud,[0,0,0],0.55),1);ctx.beginPath();ctx.ellipse(356,806,22,4,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(mix(lit,[255,255,255],0.1),0.3);ctx.beginPath();ctx.ellipse(360,805,12,1.4,0,0,TAU);ctx.fill();
    for(let r=0;r<6;r++){const y=A2_OUT[0]+9+r*10,bw=6.5+r*1.3,bd=1.5+r*0.45,bt=1.1+r*0.3,gp=bw*0.45,xs=[];
      for(let i=0,x=150+r*5;x<940;i++,x+=bw+gp){if(hash(i+r*97,691)<0.08||(x>318&&x<432&&r>1&&r<5))continue;xs.push(x);}
      ctx.fillStyle="rgba(0,0,0,0.3)";xs.forEach(x=>{const yb=y+bd+bt;ctx.beginPath();ctx.moveTo(x+bw,yb);ctx.lineTo(x,yb);ctx.lineTo(x-bw*1.4,yb-bd*0.25);ctx.lineTo(x-bw*0.4,y+bd*0.6);ctx.closePath();ctx.fill();});
      xs.forEach(x=>{ctx.fillStyle=rgba(lit,1);ctx.fillRect(x,y,bw,bd);ctx.fillStyle=rgba(side,1);ctx.fillRect(x,y+bd,bw,bt);ctx.fillStyle="rgba(255,236,200,0.25)";ctx.fillRect(x,y,bw,0.8);});}});}
// palms on the bank, and reeds along the water (o.reeds, 0..1: they go where the embankment rises)
function a2_palms(ctx,t,o){const[dw,dy]=a2_light(o),sil=mix(mix([6,5,6],[26,18,16],dw),[70,58,46],dy);
  [[-420,64],[90,70],[960,58],[1560,74],[2160,62]].forEach(([x,h],i)=>bab_palm(ctx,x,A2_EMB-2,h,t,{col:sil,lean:(hash(i,695)-0.5)*0.3,rim:0.2*dw}));}
function a2_reeds(ctx,t,o,a){if(a<=0.01)return;const[dw,dy]=a2_light(o),sil=mix(mix([6,5,6],[26,18,16],dw),[70,58,46],dy);
  withA(ctx,a,()=>{ctx.strokeStyle=rgba(mix(sil,[96,74,58],0.25*dw),1);ctx.lineCap="round";ctx.lineWidth=0.9;ctx.beginPath();
    for(let i=0;i<220;i++){const bx=A2_X0+hash(i,692)*(A2_X1-A2_X0),hh=6+hash(i,693)*16,lw=Math.sin(t*0.7+i)*0.08;ctx.moveTo(bx,A2_WY+1);ctx.quadraticCurveTo(bx+1,A2_WY-hh*0.6,bx+(hash(i,694)-0.5)*hh*0.5+lw*hh,A2_WY-hh);}ctx.stroke();});}
// the embankment of baked brick at the water's edge, outside the outer wall: from x0 to x1, its top at y0 and its foot at by, built
// course by course from the foot as p goes from 0 to 1; its bricks red from the kiln, in the shade of the dawn, laid in black bitumen,
// built in stretches a little different in tone, its coping catching the light and the water darkening its foot
function a2_embank(ctx,x0,x1,y0,by,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||p<=0.002)return;const[dw,dy]=a2_light(o),wet=clamp(o.wet||0,0,1);
  let face=mix(mix([24,13,12],[98,52,38],dw),[156,98,72],dy);face=mix(face,[30,14,12],0.35*wet);const lit=mix(face,BAB_SUN,0.26*dw+0.08*dy),top=by-(by-y0)*clamp(p,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.rect(x0,top,x1-x0,by-top+2);ctx.clip();
    const g=ctx.createLinearGradient(0,y0,0,by);g.addColorStop(0,rgba(lit,1));g.addColorStop(0.4,rgba(face,1));g.addColorStop(1,rgba(mix(face,[6,4,4],0.55),1));ctx.fillStyle=g;ctx.fillRect(x0,y0,x1-x0,by-y0+2);
    for(let x=Math.floor(x0/140)*140;x<x1;x+=140){const v=hash(Math.floor(x/140)+40,676);ctx.fillStyle=v<0.5?"rgba(255,214,176,"+(0.07*v)+")":"rgba(0,0,0,"+(0.14*(v-0.5))+")";ctx.fillRect(x,y0,140,by-y0+2);}
    // brick by brick, each a little different, and the bitumen in every joint
    const ch=o.ch||4.5,bl=o.bl||15;let r=0;for(let y=by-ch;y>y0-ch;y-=ch,r++){for(let x=x0+(r%2)*bl/2-bl;x<x1;x+=bl){const v=hash(Math.floor(x/bl)*7+r,672);ctx.fillStyle=v<0.5?"rgba(255,220,180,"+(0.07*v)+")":"rgba(0,0,0,"+(0.12*(v-0.5))+")";ctx.fillRect(x,y,bl,ch);}}
    ctx.strokeStyle=rgba(BAB_BIT,0.55);ctx.lineWidth=0.9;ctx.beginPath();r=0;for(let y=by-ch;y>y0-ch;y-=ch,r++){ctx.moveTo(x0,y);ctx.lineTo(x1,y);for(let x=x0+(r%2)*bl/2;x<x1;x+=bl){ctx.moveTo(x,y);ctx.lineTo(x,y+ch);}}ctx.stroke();
    // the water's mark along its foot
    const wg=ctx.createLinearGradient(0,by-16,0,by);wg.addColorStop(0,"rgba(0,0,0,0)");wg.addColorStop(1,"rgba(6,8,12,0.55)");ctx.fillStyle=wg;ctx.fillRect(x0,by-16,x1-x0,18);
    // its coping, a course that catches the light, over a line of shadow
    ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.45),(0.45+0.4*dw)*(1-0.6*wet));ctx.fillRect(x0,top,x1-x0,2.4);ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x0,top+2.4,x1-x0,1.4);ctx.restore();
    // the course being laid, as it rises
    if(p<0.999){ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.3),0.9);for(let x=x0;x<x1;x+=bl){if(hash(Math.floor(x/bl),671)<0.5)ctx.fillRect(x+1,top-ch,bl-2,ch-0.6);}}
    // lit (o.hi), as the story names it: a warm wash over its face and a brighter coping
    const hi=clamp(o.hi||0,0,1);if(hi>0.01){ctx.fillStyle=rgba(BAB_SUN,0.16*hi);ctx.fillRect(x0,top,x1-x0,by-top);ctx.fillStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.6*hi);ctx.fillRect(x0,top-1,x1-x0,3);}});}
// the walls, upside down in the water: draw() paints them into one reused canvas, laid back below the water's edge (y) in thin strips,
// each shifted a little by the ripples (amp), fainter and darker further from the bank
let A2_RBUF=null;
function a2_mirror(ctx,y,t,amp,al,draw){const cv=ctx.canvas,m=ctx.getTransform();
  if(!A2_RBUF||A2_RBUF.width!==cv.width||A2_RBUF.height!==cv.height)A2_RBUF=mkCanvas(cv.width,cv.height);const o=A2_RBUF.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.setTransform(m);draw(o);o.setTransform(1,0,0,1,0,0);
  const k=m.d,wy=Math.round(m.d*y+m.f),hs=Math.max(2,Math.round(2.5*k)),N=Math.min(Math.ceil((cv.height-wy)/hs),Math.floor(wy/hs));
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  for(let i=0;i<N;i++){const u=clamp(i*hs/k/240,0,1);if(u>=1)break;const dx=(Math.sin(t*1.3+i*0.83)+0.5*Math.sin(t*0.7+i*0.31))*amp*k*(0.35+1.3*u);
    ctx.globalAlpha=al*Math.pow(1-u,1.3);ctx.drawImage(A2_RBUF,0,wy-(i+1)*hs,cv.width,hs,dx,wy+i*hs,cv.width,hs);}
  ctx.restore();}
// the water in front, from its far edge at y0 to below the frame: the sky in it, the walls' reflection (o.refl draws them), slow
// ripples, the rain's rings when o.rain, its level risen by o.rise px, and, in a storm or as it rises, the water lapping along its edge
function a2_water(ctx,y0,t,o){o=o||{};const[dw,dy,st]=a2_light(o),y=y0-(o.rise||0),rn=clamp(o.rain||0,0,1);
  const sky=mix(mix([12,12,26],[96,66,74],dw),[150,146,146],dy),deep=mix(mix([4,6,12],[18,20,32],dw),[52,66,82],dy);
  const g=ctx.createLinearGradient(0,y,0,y+300);g.addColorStop(0,rgba(mix(sky,BAB_SUN,0.18*dw),1));g.addColorStop(0.35,rgba(mix(sky,deep,0.65),1));g.addColorStop(1,rgba(deep,1));ctx.fillStyle=g;ctx.fillRect(A2_X0,y,A2_X1-A2_X0,1400);
  ctx.save();ctx.beginPath();ctx.rect(A2_X0,y,A2_X1-A2_X0,1400);ctx.clip();
  if(o.refl)a2_mirror(ctx,y,t,1.6+4*st+2*rn,0.6*(1-0.3*st),o.refl);
  // the sun's path on the water, and slow ripples
  ctx.fillStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),(0.05+0.12*dw)*(1-0.7*st));
  for(let i=0;i<46;i++){const u=i/46,yy=y+4+u*u*300,ww=60+hash(i,681)*220*(1+u),xx=1500+(hash(i,682)-0.5)*(300+u*900)+Math.sin(t*0.4+i*1.9)*14;ctx.fillRect(xx-ww/2,yy,ww,1.2+u*2.6);}
  ctx.fillStyle=rgba(sky,0.16);for(let i=0;i<60;i++){const u=hash(i,683),yy=y+6+u*u*320,xx=A2_X0+hash(i,684)*(A2_X1-A2_X0)+Math.sin(t*0.3+i)*10;ctx.fillRect(xx,yy,30+hash(i,685)*90,1+u*2);}
  // rain on the water: rings that open and fade
  if(rn>0.01){ctx.strokeStyle="rgba(200,214,230,"+(0.35*rn)+")";ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<70;i++){const ph=(t*1.3+hash(i,686))%1,u=hash(i,687),xx=A2_X0+300+hash(i,688)*2600,yy=y+8+u*u*300,r=(4+u*12)*ph;ctx.moveTo(xx+r,yy);ctx.ellipse(xx,yy,r,r*0.28,0,0,TAU);}ctx.stroke();}
  // the far edge, a line of light where the water meets the bank, and the water lapping pale along it in the storm
  ctx.fillStyle=rgba(mix(sky,BAB_SUN,0.4),0.45);ctx.fillRect(A2_X0,y,A2_X1-A2_X0,1.4);
  const lap=clamp(Math.max(st,(o.rise||0)/20),0,1);if(lap>0.01){ctx.strokeStyle="rgba(214,222,232,"+(0.32*lap)+")";ctx.lineWidth=1.4;ctx.beginPath();
    for(let x=A2_X0;x<=A2_X1;x+=6){const yy=y+2.2+Math.sin(x*0.05+t*2.2)*1.1+Math.sin(x*0.013-t*1.4);x===A2_X0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
  ctx.restore();}
// a storm over the city: low clouds that roll in from the left as a goes from 0 to 1, in world space above the horizon
function a2_clouds(ctx,t,a,o){o=o||{};if(a<=0.01)return;const[dw,dy]=bab_light(o),col=mix(mix([14,14,22],[60,54,66],dw),[110,110,120],dy);
  withA(ctx,a,()=>{for(let i=0;i<26;i++){const x=A2_X0+hash(i,701)*(A2_X1-A2_X0)+t*6*(0.5+hash(i,702)),y=60+hash(i,703)*420,r=120+hash(i,704)*240;
    const g=ctx.createRadialGradient(x,y,r*0.1,x,y,r);g.addColorStop(0,rgba(mix(col,[0,0,0],0.2),0.85));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r*1.6,r*0.7,0,0,TAU);ctx.fill();}});}
// the rain itself, in screen space over everything: streaks that fall a little slanted, and the dim of a storm's light
function a2_rain(ctx,S,t,a){if(a<=0.01)return;setScreen(ctx,S);ctx.fillStyle="rgba(10,14,24,"+(0.14*a)+")";ctx.fillRect(0,0,W,H);
  ctx.save();ctx.strokeStyle="rgba(196,210,228,"+(0.3*a)+")";ctx.lineWidth=1.3;ctx.beginPath();for(let i=0;i<300;i++){const sp=900+hash(i,711)*500,y=((hash(i,712)*(H+80)+t*sp)%(H+80))-40,x=((hash(i,713)*(W+200)-t*sp*0.12)%(W+200)+W+200)%(W+200)-100,L=18+hash(i,714)*22;
    ctx.moveTo(x,y);ctx.lineTo(x-L*0.14,y+L);}ctx.stroke();ctx.restore();}
// the whole view: sky, clouds, city, tower, the inner wall (Imgur-Enlil, its breach at A2_AT), the outer (Nemetti-Enlil, a smaller
// breach at A2_AT2), the bank, the embankment and the water, with the walls in it. o: dawn, day, storm (0..1), rain (0..1), melt
// (0..1, the rain's damage), wet, field (the brickfield), emb (0..1, the embankment built), rise (the water risen, px), towerHi (the
// tower lit), innerHi (the inner wall lit), embHi (the embankment lit); o.behind(ctx) draws what stands in the inner wall's breach, behind the outer wall
const A2_AT=1320,A2_AT2=1000;
const A2_INW={sp:210,tw:78,th:30,haze:0.35,seed:651,at:A2_AT,bw:62},A2_OUTW={sp:150,tw:56,th:20,seed:652,at:A2_AT2,bw:44};
function a2_view(ctx,t,o){o=o||{};const L={dawn:o.dawn,day:o.day,storm:o.storm||0},sd=L.dawn*(1-0.5*L.storm),sy=L.day*(1-0.6*L.storm),emb=o.emb||0;
  bab_sky(ctx,t,{dawn:sd,day:sy,hz:A2_HZ,sunX:1640});a2_clouds(ctx,t,L.storm,L);
  bab_city(ctx,t,{dawn:sd,day:sy,hz:A2_HZ,gap:[900,1300]});
  bab_tower(ctx,1100,A2_HZ+70,2.6,{dawn:sd,day:sy,hi:o.towerHi||0});a2_inside(ctx,t,L);
  const wo={dawn:L.dawn,day:L.day,storm:L.storm,wet:o.wet||0};
  a2_wall(ctx,A2_X0,A2_X1,A2_IN[0],A2_IN[1],Object.assign({},wo,A2_INW,{melt:o.melt||0,hi:o.innerHi||0}));
  if(o.behind)o.behind(ctx);
  const near=(c,all)=>{a2_ground(c,L);a2_wall(c,A2_X0,A2_X1,A2_OUT[0],A2_OUT[1],Object.assign({},wo,A2_OUTW,{melt:(o.melt||0)*0.7}));
    if(all)a2_field(c,Object.assign({},L,{field:o.field||0}));a2_palms(c,t,L);if(all)a2_reeds(c,t,L,1-emb);
    a2_embank(c,A2_X0,A2_X1,A2_EMB,A2_WY+4,emb,{dawn:L.dawn,day:L.day,storm:L.storm,wet:o.wet||0,hi:o.embHi||0});};
  near(ctx,true);
  a2_water(ctx,A2_WY,t,{dawn:L.dawn,day:L.day,storm:L.storm,rain:o.rain||0,rise:o.rise||0,refl:c=>near(c,false)});}

/* ---------- the kiln's work, and the tower's skin, on cards of clay ---------- */
// a card of clay with a picture and a line under it: k is 0 mud brick dried in the sun, 1 brick fired in a kiln, 2 laid in bitumen
const A2_BRICKS=["mud brick, dried in the sun","fired hard in a kiln","laid in bitumen"];
function a2_brickCard(ctx,k,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);const cx=x+w/2,cy=y+(h-70)/2+6;
  ctx.save();ctx.beginPath();ctx.rect(x+8,y+8,w-16,h-84);ctx.clip();
  if(k===0){bab_brick(ctx,cx,cy,112,{mud:true});ctx.fillStyle=rgba(BAB_SUN,0.5);ctx.beginPath();ctx.arc(cx+96,cy-50,16,0,TAU);ctx.fill();}
  else if(k===1){bab_kiln(ctx,cx-56,cy+60,0.6,t,{col:[64,42,30],fire:1});bab_brick(ctx,cx+76,cy+20,84,{});}
  else{// a course of baked bricks, black in every joint
    const bw=64,bh=20;for(let r=0;r<4;r++)for(let i=-2;i<3;i++){const bx=cx+i*(bw+6)+(r%2)*(bw/2+3),by=cy+36-r*(bh+6);ctx.fillStyle=rgba(BAB_BIT,0.95);ctx.fillRect(bx-bw/2-3,by-bh/2-3,bw+6,bh+6);}
    for(let r=0;r<4;r++)for(let i=-2;i<3;i++){const bx=cx+i*(bw+6)+(r%2)*(bw/2+3),by=cy+36-r*(bh+6);const g=ctx.createLinearGradient(bx-bw/2,by-bh/2,bx+bw/2,by+bh/2);g.addColorStop(0,rgba(mix(BAB_BRICK,[255,230,190],0.15),1));g.addColorStop(1,rgba(mix(BAB_BRICK,[0,0,0],0.25),1));ctx.fillStyle=g;ctx.fillRect(bx-bw/2,by-bh/2,bw,bh);}}
  ctx.restore();T(ctx,A2_BRICKS[k],cx,y+h-30,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});});}
// Etemenanki in section, on clay: its stages in outline, and its lowest cut through to show a core of mud brick inside a skin of baked
// brick nearly 16 metres thick; (cx, by): the middle of its foot; s: pixels to a metre. o.cut (0..1) opens the section; o.skin (0..1)
// lights the skin
function a2_section(ctx,cx,by,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cut=clamp(o.cut||0,0,1),sk=clamp(o.skin||0,0,1);
  withA(ctx,a,()=>{ctx.save();for(let i=6;i>=0;i--){const[x,y,w,h]=bab_stageBox(i,cx,by,s);ctx.fillStyle=rgba(mix(BAB_BRICK,BAB_CLAY,0.35),0.9);ctx.fillRect(x,y,w,h);ctx.strokeStyle=rgba(ACA_INK,0.5);ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}
    if(cut>0.01){const[x,y,w,h]=bab_stageBox(0,cx,by,s),k=15.75*s;withA(ctx,cut,()=>{
      // the core, mud brick, and the skin round it, baked brick, both as courses
      ctx.fillStyle=rgba(BAB_MUD,1);ctx.fillRect(x+k,y,w-2*k,h);ctx.fillStyle=rgba(mix(BAB_BRICK,[255,170,120],0.2*sk),1);ctx.fillRect(x,y,k,h);ctx.fillRect(x+w-k,y,k,h);
      ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=1;ctx.beginPath();for(let yy=y+h-6;yy>y;yy-=6){ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);}ctx.stroke();
      ctx.strokeStyle=rgba(BAB_BIT,0.7);ctx.beginPath();for(let yy=y+h-6;yy>y;yy-=6){ctx.moveTo(x,yy);ctx.lineTo(x+k,yy);ctx.moveTo(x+w-k,yy);ctx.lineTo(x+w,yy);}ctx.stroke();
      if(sk>0.01){ctx.strokeStyle=rgba(ACA,sk);ctx.lineWidth=3;ctx.shadowColor=rgba(ACA,0.8);ctx.shadowBlur=14;ctx.strokeRect(x,y,k,h);ctx.strokeRect(x+w-k,y,k,h);ctx.shadowBlur=0;}
      ctx.strokeStyle=rgba(ACA_INK,0.8);ctx.lineWidth=2.4;ctx.strokeRect(x,y,w,h);});}
    ctx.restore();});}

/* ---------- 1, at its end. Archaeologists at the river wall ---------- */
// The embankment as archaeologists found it, in a hazy morning: a trench cut down through the layers of earth, the spoil heaped along
// its far edge, and at its far wall the face of baked brick, worn and chipped, black bitumen in every joint and earth still caked on it,
// with a measuring rod leaning against it. o.p (0..1): the face uncovered, from the top down, as they dig
function a2_dig(ctx,t,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1),earth=[124,98,74],dk=[64,48,38],haze=[196,190,178];
  let g=ctx.createLinearGradient(0,-200,0,300);g.addColorStop(0,"rgb(150,154,162)");g.addColorStop(1,rgba(haze,1));ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,500);
  ctx.fillStyle=rgba(mix(earth,haze,0.45),1);for(let i=0;i<7;i++){const x=-100+i*360+hash(i,741)*140,w=300+hash(i,742)*220,h=30+hash(i,743)*46;ctx.beginPath();ctx.moveTo(x-w/2,292);ctx.quadraticCurveTo(x-w*0.1,292-h*1.6,x+w/2,292);ctx.closePath();ctx.fill();}
  ctx.fillStyle=rgba(mix(earth,haze,0.3),1);ctx.fillRect(-200,288,W+400,H+200);
  // the trench: its sides in shade, cut through the layers of earth, and its floor in the light
  const fx=420,fw=1080,fy=300,fb=846,Y=H+240;
  ctx.fillStyle=rgba(mix(earth,dk,0.45),1);ctx.beginPath();ctx.moveTo(-200,292);ctx.lineTo(fx,fy);ctx.lineTo(fx,fb);ctx.lineTo(-200,Y);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(W+200,292);ctx.lineTo(fx+fw,fy);ctx.lineTo(fx+fw,fb);ctx.lineTo(W+200,Y);ctx.closePath();ctx.fill();
  for(let i=1;i<10;i++){const u=i/10,yl=292+(Y-292)*u,yf=fy+(fb-fy)*u;ctx.strokeStyle=rgba(i%2?mix(earth,haze,0.2):mix(dk,[0,0,0],0.15),0.55);ctx.lineWidth=3+u*7;
    ctx.beginPath();ctx.moveTo(-200,yl);ctx.lineTo(fx,yf);ctx.moveTo(W+200,yl);ctx.lineTo(fx+fw,yf);ctx.stroke();}
  g=ctx.createLinearGradient(0,fb,0,H);g.addColorStop(0,rgba(mix(dk,earth,0.5),1));g.addColorStop(1,rgba(mix(earth,haze,0.15),1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(fx,fb);ctx.lineTo(fx+fw,fb);ctx.lineTo(W+200,Y);ctx.lineTo(-200,Y);ctx.closePath();ctx.fill();
  // the face of baked brick, course by course, each brick worn at its edges and some chipped, bitumen in every joint
  ctx.save();ctx.beginPath();ctx.rect(fx,fy,fw,fb-fy);ctx.clip();ctx.fillStyle=rgba(BAB_BIT,1);ctx.fillRect(fx,fy,fw,fb-fy);
  const bw=104,bh=25,jt=7;for(let r=0;fb-(r+1)*(bh+jt)>fy-bh-jt;r++)for(let i=-1;i*(bw+jt)<fw+bw;i++){
    const x=fx+i*(bw+jt)+(r%2)*((bw+jt)/2)+(hash(i*13+r,724)-0.5)*3,y=fb-(r+1)*(bh+jt)+jt/2+(hash(i*7+r,725)-0.5)*2,v=hash(i*31+r,721);
    const c=mix(mix(BAB_BRICK,[196,150,104],0.2+0.4*v),[90,60,44],0.3*hash(i+r*17,726));
    ctx.fillStyle=rgba(c,1);rr(ctx,x,y,bw,bh,5);ctx.fill();ctx.fillStyle="rgba(255,236,210,0.13)";ctx.fillRect(x+4,y+1.5,bw-8,2.5);ctx.fillStyle="rgba(0,0,0,0.17)";ctx.fillRect(x+4,y+bh-3.5,bw-8,2.5);
    if(hash(i*5+r*3,727)<0.22){const cx_=hash(i+r,728)<0.5?x:x+bw,cy_=hash(i*3+r,729)<0.5?y:y+bh,s=8+hash(i+r*11,730)*12;ctx.fillStyle=rgba(BAB_BIT,1);ctx.beginPath();ctx.moveTo(cx_,cy_);ctx.lineTo(cx_+(cx_===x?s:-s),cy_);ctx.lineTo(cx_,cy_+(cy_===y?s*0.6:-s*0.6));ctx.closePath();ctx.fill();}
    ctx.fillStyle="rgba(0,0,0,0.12)";for(let k=0;k<5;k++)ctx.fillRect(x+6+hash(k+i*7,722+r)*(bw-14),y+4+hash(k+r*5,723+i)*(bh-9),2.5,2);}
  // earth still caked on it, and the layer of earth over its top course
  for(let i=0;i<10;i++){const x=fx+hash(i,733)*fw,y=fy+hash(i,734)*(fb-fy),r=60+hash(i,735)*140,eg=ctx.createRadialGradient(x,y,0,x,y,r);eg.addColorStop(0,rgba(mix(earth,haze,0.2),0.32));eg.addColorStop(1,rgba(earth,0));ctx.fillStyle=eg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  ctx.fillStyle=rgba(mix(earth,dk,0.3),1);ctx.beginPath();ctx.moveTo(fx,fy);for(let x=fx;x<=fx+fw;x+=12)ctx.lineTo(x,fy+16+Math.sin(x*0.02)*6+hash(Math.floor(x/12),736)*8);ctx.lineTo(fx+fw,fy);ctx.closePath();ctx.fill();
  // the earth not yet dug away, from the top down
  if(p<0.999){const ey=fy+(fb-fy)*p;ctx.fillStyle=rgba(mix(earth,dk,0.35),1);ctx.beginPath();ctx.moveTo(fx,fb+4);for(let x=fx;x<=fx+fw;x+=12)ctx.lineTo(x,ey+Math.sin(x*0.03)*8+hash(Math.floor(x/12),737)*10);ctx.lineTo(fx+fw,fb+4);ctx.closePath();ctx.fill();}
  ctx.restore();
  // broken pieces on the trench's floor, at the foot of the face
  for(let i=0;i<14;i++){const x=fx+30+hash(i,738)*(fw-60),y=fb+10+hash(i,739)*50,s=10+hash(i,740)*16,c=mix(BAB_BRICK,[150,110,80],0.4+0.3*hash(i,744));ctx.fillStyle="rgba(0,0,0,0.25)";ctx.beginPath();ctx.ellipse(x+3,y+s*0.3,s*0.8,s*0.22,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(c,1);ctx.save();ctx.translate(x,y);ctx.rotate((hash(i,745)-0.5)*0.8);rr(ctx,-s*0.6,-s*0.3,s*1.2,s*0.5,2);ctx.fill();ctx.restore();}
  // the measuring rod, leaning on the face
  if(p>0.6)withA(ctx,clamp((p-0.6)*3,0,1),()=>{ctx.save();ctx.translate(1400,fb+30);ctx.rotate(-0.07);ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(-4,-470,16,470);ctx.fillStyle="rgba(236,226,206,0.96)";ctx.fillRect(-8,-470,16,470);ctx.fillStyle="rgba(170,40,36,0.9)";for(let k=0;k<10;k+=2)ctx.fillRect(-8,-470+k*47,16,47);ctx.restore();});}

/* ---------- the present: agents, and what they stand on ---------- */
// The six agents on Tomás's map, each in its role, with its owner and what it's for: [name, its role, its owner, what it's for]
const A2_AG=[["website chat","billing chat","head of retail","billing questions"],["outage agent","fault triage","Grace","fault triage"],["crew planner","crew rostering","Grace","crew rosters"],
  ["meter agent","meter follow-up","Grace","meter work orders"],["field assistant","crew questions","Grace","crew questions"],["map agent","map drafting","Tomás","map drafts"]];
// what every agent stands on: the platform's capabilities, each with its colour; and what is each agent's own
const A2_CAP=[["a model",[176,160,255]],["tools",[132,214,236]],["memory",[255,196,140]],["search",[160,224,140]]];
const A2_OWN=["its purpose","its instructions","the logic of its tasks"];
// a capability as a small block: o.label prints its name (at least 28 px), else it's texture; o.ghost, the agent's own copy of it,
// made separately: drawn rough, a little off its line
function a2_capBlock(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[nm,col]=A2_CAP[k];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,Math.min(14,h/2),col,{glow:6+12*(o.hi||0),ea:0.8,fill:"rgba(8,12,24,0.95)"});ctx.fillStyle=rgba(col,0.14+0.12*(o.hi||0));rr(ctx,x,y,w,h,Math.min(14,h/2));ctx.fill();
    if(o.label)T(ctx,nm,x+w/2,y+h/2+(o.size||30)*0.36,{w:800,size:o.size||30,align:"center",color:rgba(mix(col,INK,0.35),1),deco:o.deco});});}
// an agent's own stack of the four, built its own way: each block a little different in width and place
function a2_stack(ctx,x,y,a,seed,o){o=o||{};if(a<=0.01)return;for(let k=0;k<4;k++){const q=clamp(a*1.6-k*0.2,0,1);if(q<=0.01)continue;const w=58+hash(seed*7+k,731)*30,dx=(hash(seed*5+k,732)-0.5)*16,dy=(1-spring(q*1.2))*18;
  a2_capBlock(ctx,x-w/2+dx,y+k*34+dy,w,24,k,{a:q,hi:(o.hiK||[])[k]||0});}}
// the platform: one slab the agents all stand on, with its four capabilities in it, labelled; (x,y): its top-left, w wide
function a2_platform(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||118,hi=o.hi||0;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,A2_TEC,{glow:10+22*hi,ea:0.9,fill:"rgba(6,14,12,0.95)"});ctx.fillStyle=rgba(A2_TEC,0.06+0.1*hi);rr(ctx,x,y,w,h,22);ctx.fill();
    if(o.name)T(ctx,o.name,x+28,y+44,{w:800,size:30,color:rgba(A2_TEC,1),deco:o.deco});const bw=(w-56-3*24)/4,by=y+(o.name?62:24);
    for(let k=0;k<4;k++){const q=o.p==null?1:clamp(o.p*4-k,0,1);if(q>0.01)a2_capBlock(ctx,x+28+k*(bw+24),by,bw,o.bh||40,k,{a:q,label:true,size:o.size||30,hi:(o.hiK||[])[k]||0,deco:o.deco});}});}

/* ---------- windows, cards, notes and tags ---------- */
// a window on a screen: a bar with its title, and its body, in the colour of what it belongs to
function a2_win(ctx,x,y,w,h,title,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+14*(o.hi||0),ea:0.7,fill:"rgba(10,14,24,0.97)"});
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.fillStyle=rgba(mix(col,[10,14,24],0.8),1);ctx.fillRect(x,y,w,60);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(x,y+59,w,1.5);ctx.restore();
  [[232,96,84],[245,206,140],[132,226,160]].forEach((c,i)=>{ctx.fillStyle=rgba(c,0.8);ctx.beginPath();ctx.arc(x+28+i*22,y+30,6,0,TAU);ctx.fill();});
  T(ctx,title,x+100,y+40,{w:700,size:o.size||28,color:rgba(mix(col,INK,0.45),1)});});}
// a card with a coloured kicker and lines below it, for what the narration names; returns its height
function a2_card(ctx,x,y,w,kicker,lines,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-56,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));
  const h=Math.max(o.minH||0,(kicker?76:28)+L.length*sz*1.25+18);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.96)"});if(o.ghost){ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();}
    if(kicker)T(ctx,kicker,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});L.forEach((l,i)=>T(ctx,l,x+28,y+(kicker?76:28)+sz*0.92+i*sz*1.25,{w:700,size:sz,color:rgba(o.ink||INK,0.96)}));});return h;}
// an owner, as the business side marks one: a gold tick and a name
function a2_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||30;kt_gtick(ctx,x,y,sz*0.5,1);T(ctx,name,x+sz*0.9,y+sz*0.36,{w:800,size:sz,color:rgba(BIZ,1)});});}
// a household: a small house, its door and a window lit, in its colour
function a2_house(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(-34,-6);ctx.lineTo(0,-36);ctx.lineTo(34,-6);ctx.moveTo(-26,-12);ctx.lineTo(-26,28);ctx.lineTo(26,28);ctx.lineTo(26,-12);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-7,6,14,22);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(10,-4,10,10);ctx.restore();});}
// a sheet of paper with a title and lines: rows are [text, colour, size]; returns its height
function a2_paper(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a,ts=o.tsize||34,ink=[52,44,40];let h=ts+64;const R=rows.map(([s,col,sz])=>{sz=sz||30;const ls=wrapT(ctx,s,0,0,w-64,{size:sz,w:700,measure:true});h+=ls.length*sz*1.22+18;return[ls,col||ink,sz];});h+=20;
  if(a<=0.01)return h;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.01:o.rot,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.01:o.rot);ctx.translate(-w/2,-h/2);
    T(ctx,title,32,ts+26,{w:800,size:ts,color:rgba(ink,0.96)});ctx.fillStyle="rgba(52,44,40,0.25)";ctx.fillRect(32,ts+42,w-64,2);let yy=ts+66;
    R.forEach(([ls,col,sz],k)=>{const q=o.p?clamp(o.p*R.length-k,0,1):1;withA(ctx,q,()=>{ls.forEach((l,i)=>T(ctx,l,32,yy+sz*0.92+i*sz*1.22,{w:700,size:sz,color:rgba(col,0.96)}));});yy+=ls.length*sz*1.22+18;});ctx.restore();});return h;}
// a model, as these films draw one: a glass hexagon with a softly turning core, and its name under it; o.dim (0..1): one the utility
// has no terms with, greyed; o.gone (0..1): one its provider retired, struck through
function a2_model(ctx,x,y,r,name,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dm=clamp(o.dim||0,0,1),gn=clamp(o.gone||0,0,1),col=mix(mix(A2_CAP[0][1],A2_DIM,dm),A2_DIM,gn*0.8),hi=o.hi||0;
  withA(ctx,a*(1-0.45*dm),()=>{ctx.save();if(hi>0.01)glow(ctx,x,y,r*2.6,col,0.4*hi);ctx.beginPath();for(let i=0;i<6;i++){const an=i*TAU/6+Math.PI/6;ctx[i?"lineTo":"moveTo"](x+r*Math.cos(an),y+r*Math.sin(an));}ctx.closePath();
    ctx.fillStyle="rgba(10,10,26,0.95)";ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=12+10*hi;ctx.stroke();ctx.shadowBlur=0;
    const sp=t*0.6*(1-gn);for(let k=0;k<3;k++){const an=sp+k*TAU/3;ctx.fillStyle=rgba(col,0.7);ctx.beginPath();ctx.arc(x+Math.cos(an)*r*0.38,y+Math.sin(an)*r*0.38,r*0.13,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(x,y,r*0.18,0,TAU);ctx.fill();ctx.restore();
    if(name)T(ctx,name,x,y+r+40,{w:800,size:o.size||28,align:"center",color:rgba(mix(col,INK,0.3),1)});});
  if(gn>0.01)kt_rcross(ctx,x+r*0.8,y-r*0.8,22,gn*a);}
// the gateway: a door of glass in a low wall of glass, across the frame from x0 to x1 at height y, its door at dx; calls pass through
// it. o.p (0..1) builds it; o.hi lights it
function a2_gate(ctx,x0,x1,y,dx,t,o){o=o||{};const a=o.a==null?1:o.a,p=clamp(o.p==null?1:o.p,0,1),hi=o.hi||0;if(a<=0.01||p<=0.01)return;const col=TECH,dw=150,dh=150;
  withA(ctx,a,()=>{const ea=easeCam(p),wa=(dx-dw/2-x0)*ea,wb=(x1-dx-dw/2)*ea;ctx.save();
    // the wall either side of the door, growing out from it
    if(wa>2)glass(ctx,dx-dw/2-wa,y-26,wa,52,Math.min(14,wa/2),col,{glow:6+10*hi,ea:0.6,fill:"rgba(6,14,24,0.9)"});if(wb>2)glass(ctx,dx+dw/2,y-26,wb,52,Math.min(14,wb/2),col,{glow:6+10*hi,ea:0.6,fill:"rgba(6,14,24,0.9)"});
    // the door, an arch, open
    ctx.beginPath();ctx.moveTo(dx-dw/2,y+26);ctx.lineTo(dx-dw/2,y-dh/2+dw/2);ctx.arc(dx,y-dh/2+dw/2,dw/2,Math.PI,0);ctx.lineTo(dx+dw/2,y+26);ctx.closePath();
    ctx.fillStyle=rgba(mix([6,14,24],col,0.18+0.2*hi),0.96);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=16+16*hi;ctx.stroke();ctx.restore();});}
// a call: a small light travelling from (x0,y0) through the gate at (gx,gy) to (x1,y1), as u goes from 0 to 1; once through the gate it
// carries the agent's colour as its identity
function a2_call(ctx,x0,y0,gx,gy,x1,y1,u,col,a){if(a<=0.01||u<=0||u>=1)return;const e=u<0.5?u*2:(u-0.5)*2,x=u<0.5?lerp(x0,gx,ease(e)):lerp(gx,x1,ease(e)),y=u<0.5?lerp(y0,gy,ease(e)):lerp(gy,y1,ease(e));
  withA(ctx,a*Math.sin(Math.PI*u),()=>{glow(ctx,x,y,26,col,0.7);ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),1);ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();});}
// a service of the platform, as ArchiMate draws one: a pill with its name, in the technology layer's green; o.deco marks its words as
// texture (the map seen from afar)
function a2_svc(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||A2_TEC,hi=o.hi||0,sz=o.size||28;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,h/2,col,{glow:8+16*hi,ea:0.85,fill:"rgba(6,14,12,0.95)"});ctx.fillStyle=rgba(col,0.12+0.14*hi);rr(ctx,x,y,w,h,h/2);ctx.fill();
    T(ctx,name,x+w/2,y+h/2+sz*0.36,{w:700,size:sz,align:"center",color:rgba(mix(col,INK,0.35),1),deco:o.deco});});}
