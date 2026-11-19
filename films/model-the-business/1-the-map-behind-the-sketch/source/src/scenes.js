/* ===== The map behind the sketch: scenes =====
   Ten chapters, as in ../../script.md. China from 1368: registers lost in the war, land hidden under other households' names, and the
   court's answer, two registers, each with one job, crossed like warp and weft. Then the university: the sketch the intro drew, placed
   on the university's map part by part (what it's for, who answers for it, where it's written, what it means), the two maps crossed,
   and where every piece of data work starts. The past is the land at dusk; the present, the films' dark glass. Each chapter of the
   present lets its things leave before it ends, so the next comes in over the bare room, under the map's four parts. */

/* ---------- helpers ---------- */
// a walker on the road, from x0 to x1 over d seconds from t0, in whole strides, so the legs rest together at both ends
function lt_walk(ctx,t,t0,d,x0,x1,s,o){o=o||{};const u=ease(clamp((t-t0)/d,0,1)),x=lerp(x0,x1,u),n=Math.max(1,Math.round(Math.abs(x1-x0)/(s*150)));
  return rg_fig(ctx,x,rg_roadY(x)+(o.dy||0),s,Object.assign({f:x1<x0?-1:1},o,{walk:u*n*TAU}));}
// a person faded as one picture: drawn whole on a spare canvas, then laid on the frame
let LT_SCR=null;
function lt_faded(ctx,a,fn){if(a<=0.01)return;if(a>=0.995){fn(ctx);return;}const cv=ctx.canvas;if(!LT_SCR||LT_SCR.width!==cv.width||LT_SCR.height!==cv.height)LT_SCR=mkCanvas(cv.width,cv.height);const x=LT_SCR.getContext("2d");
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.setTransform(ctx.getTransform());fn(x);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(LT_SCR,0,0);ctx.restore();}
// a pill on a point of the world, drawn in the frame at its own size
function lt_pillAt(ctx,S,cam,wx,wy,s,col,a,o){if(a<=0.01)return;const p=toScreen(cam,wx,wy);ctx.save();setScreen(ctx,S);rg_pill(ctx,p.x,p.y,s,col,a,o);ctx.restore();}
// a chapter of the present lets its things leave before it ends
const lt_out=(t,sc)=>1-fin(t,sc.dur-1.0,0.75);
// keyframes [time, values...], eased from one to the next
function lt_keys(K,t){if(t<=K[0][0])return K[0].slice(1);for(let i=1;i<K.length;i++){if(t<=K[i][0]){const a=K[i-1],b=K[i],f=easeCam((t-a[0])/((b[0]-a[0])||1));return a.slice(1).map((v,j)=>lerp(v,b[j+1],f));}}return K[K.length-1].slice(1);}
// the rice field at a point of the land
const lt_pad=(x,y)=>rg_paddies().find(q=>q.x<=x&&q.x+q.w>=x&&q.y<=y&&q.y+q.h>=y)||rg_paddies()[0];
const lt_padPath=rg_padPath;
// the map's four parts, from how lit each was to how lit each is in this chapter
const lt_lit=(t,from,to)=>i=>lerp(from[i],to[i],fin(t,0.3,1.0));
// a tick or a question over something
function lt_tick(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.fill();ring(ctx,x,y,20,GOOD,1,2.4);tick_(ctx,x,y+1,26,GOOD,1);});}

// a pen, its point down and to the left of (x, y)
function lt_pen(ctx,x,y){ctx.save();ctx.translate(x,y);ctx.rotate(0.7);ctx.fillStyle=rgba(MTB,1);ctx.fillRect(-7,-46,14,46);ctx.fillStyle=rgba(mix(MTB,[60,40,20],0.45),1);ctx.fillRect(-7,-46,14,8);
  ctx.fillStyle=rgba(RG_PAPER,1);ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(7,0);ctx.lineTo(0,16);ctx.closePath();ctx.fill();ctx.fillStyle="rgb(40,30,24)";ctx.beginPath();ctx.moveTo(-2.6,11);ctx.lineTo(2.6,11);ctx.lineTo(0,16);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------- 1. Lost registers ---------- */
scene("lost",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cW=c("when"),cO=c("owe"),cL=c("lost"),cH=c("hide"),cB=c("harm"),cN=c("need");
  const cam=camAt([[0,1500,560,0.74],[cW+0.6,1500,560,0.74],[cW+5.6,600,600,1.0],[cO-0.1,600,600,1.0],[cO+1.9,1100,640,1.02],[cL-0.3,1100,640,1.02],[cL+1.4,1000,640,1.06],[cH-0.3,1000,640,1.06],[cH+2.0,2700,610,1.0],[cB-0.3,2700,610,1.0],[cB+1.8,1880,650,1.04]],t);
  rg_land(ctx,S,cam,t,{smoke:1-fin(t,cO,2.5)});setCam(ctx,S,cam);
  // out of the gate, the city's people on the road
  [0,1].forEach(k=>lt_walk(ctx,t,cW+0.6+k*1.8,8,150,560+k*130,0.26,{dress:"robe",head:"cap"}));
  // what every household owes: grain from its fields, by each house; and, once the registers are lost, no measure to it
  const mS=fin(t,w("lost","measure"),0.9);
  RG_HOUSES.forEach(([hx,hy,s],i)=>{const a=fin(t,w("owe","grain")+i*0.1,0.4);if(a<=0)return;rg_sack(ctx,hx+(i%2?-84:84)*s,hy+6,0.62*s*(0.75+0.25*a)*lerp(1,0.55+0.9*hash(i,9),mS),a);});
  // and work: carrying grain to the city, building its walls, mending its road
  lt_walk(ctx,t,w("owe","carrying")-0.6,10,1360,700,0.3,{hold:"pole",full:1,head:"wrap"});
  lt_walk(ctx,t,w("owe","building")-0.6,4.5,640,450,0.3,{hold:"brick",head:"wrap"});
  lt_walk(ctx,t,w("owe","mending")-1.2,2.4,1060,880,0.3,{hold:"hoe",head:"wrap"});
  // Zhejiang: a landowner at his estate, and the households whose names his fields are written under
  rg_fig(ctx,2930,rg_roadY(2930),0.32,{dress:"robe",head:"cap",f:-1});
  const H3=[RG_HOUSES[6],RG_HOUSES[7],RG_HOUSES[8]],P3=[lt_pad(2860,760),lt_pad(3080,800),lt_pad(3300,760)];
  const hA=fin(t,w("hide","under"),0.4)*(1-fin(t,cN+0.2,0.8));
  if(hA>0)P3.forEach((q,i)=>{const k=clamp((t-w("hide","under")-i*0.5)/1.2,0,1);if(k<=0)return;const[hx,hy]=H3[i];
    withA(ctx,hA,()=>{ctx.save();lt_padPath(ctx,q);ctx.fillStyle=rgba(RG_YEL,0.18);ctx.fill();ctx.strokeStyle=rgba(RG_YEL,0.95);ctx.lineWidth=4;ctx.stroke();ctx.restore();
      arrowTo(ctx,q.x+q.w/2,q.y,hx,hy-130,RG_YEL,1,{p:k,bend:-0.18,dash:[12,10],lw:3.4});
      // a slip with that household's name: paper, no words
      withA(ctx,fin(k,0.8,0.2),()=>{ctx.fillStyle=rgba(RG_PAPER,1);ctx.fillRect(hx-16,hy-176,32,46);ctx.strokeStyle=rgba(RG_INK,0.55);ctx.lineWidth=2;for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(hx-6+j*7,hy-168);ctx.lineTo(hx-6+j*7,hy-142);ctx.stroke();}});});});
  // the burden falls on the families who couldn't hide their land
  H3.forEach(([hx,hy],k)=>{lt_walk(ctx,t,w("harm","burden")-0.4+k*0.5,11,hx-34,hx-560,0.3,{hold:"pole",full:1,load:1,head:"wrap"});
    [0,1,2].forEach(j=>rg_sack(ctx,hx+58+j*24,hy+8-(j===2?26:0),0.5,fin(t,w("harm","burden")+k*0.3+j*0.15,0.4)));});
  // what the court needed to know: whose each field was, and who lived in each house
  const qF=lt_pad(2440,800),nA=fin(t,w("need","whose"),0.5),nB=fin(t,w("need","lived"),0.5);
  withA(ctx,nA,()=>{ctx.save();lt_padPath(ctx,qF);ctx.fillStyle=rgba(RG_EARTH,0.25);ctx.fill();ctx.strokeStyle=rgba(RG_EARTH,1);ctx.lineWidth=4;ctx.stroke();ctx.restore();});
  if(nB>0)glow(ctx,1720,610,120,RG_YEL,0.3*nB);
  // the words of the story, in the frame
  const pO=1-fin(t,cL-0.2,0.5);
  lt_pillAt(ctx,S,cam,1700,470,"grain",RG_YEL,fin(t,w("owe","grain"),0.5)*pO);
  lt_pillAt(ctx,S,cam,760,500,"and work",RG_EARTH,fin(t,w("owe","work"),0.5)*pO);
  lt_pillAt(ctx,S,cam,1600,470,"no fixed measure",RG_YEL,mS*(1-fin(t,cH-0.2,0.5)));
  lt_pillAt(ctx,S,cam,2540,390,"written under other households' names",RG_YEL,hA*(1-fin(t,cB-0.2,0.5)));
  lt_pillAt(ctx,S,cam,2250,470,"the burden",RG_EARTH,fin(t,w("harm","burden"),0.5)*(1-fin(t,cN-0.3,0.5)));
  lt_pillAt(ctx,S,cam,qF.x+qF.w/2,qF.y-40,"whose field?",RG_EARTH,nA);
  lt_pillAt(ctx,S,cam,1720,470,"who lives here?",RG_YEL,nB);
  setScreen(ctx,S);
  // the old registers, lost in the war: one register's pages blow away
  const bA=fin(t,cL-0.1,0.6)*(1-fin(t,cH+0.3,0.8));
  if(bA>0)withA(ctx,bA,()=>{const rise=(1-ease(fin(t,cL-0.1,1.0)))*220;
    rg_book(ctx,960,700+rise,200,250,{open:1,col:RG_YEL,left:(c2,x,y,w2,h)=>rg_entries(c2,x,y,w2,h,6,2),right:(c2,x,y,w2,h)=>rg_entries(c2,x,y,w2,h,6,5)});
    [[760,575],[1160,575],[760,825],[1160,825]].forEach(([sx,sy],i)=>{const g=ctx.createRadialGradient(sx,sy,0,sx,sy,110);g.addColorStop(0,"rgba(30,14,6,"+(i%3?0.55:0.75)+")");g.addColorStop(1,"rgba(30,14,6,0)");ctx.fillStyle=g;ctx.fillRect(sx-110,sy-110,220,220);});
    for(let k=0;k<10;k++){const t0=cL+0.2+k*0.32,u=clamp((t-t0)/2.6,0,1);if(u<=0||u>=1)continue;const px=lerp(1040,520-hash(k,2)*380,ease(u)),py=lerp(690+rise,260+hash(k,3)*170,ease(u))+Math.sin(u*7+k)*24;
      ctx.save();ctx.translate(px,py);ctx.rotate(u*(2+hash(k,4)*4)*(k%2?1:-1));ctx.globalAlpha*=1-u*u;ctx.fillStyle=rgba(RG_PAPER,1);ctx.fillRect(-55,-75,110,150);rg_entries(ctx,-55,-75,110,150,4,k+3,0.8);ctx.restore();}});
  rg_pill(ctx,960,330,"the registers, lost in the war",RG_YEL,fin(t,w("lost","lost"),0.5)*(1-fin(t,cH-0.2,0.5)));
  // where and when
  yearTag(ctx,96,100,"China, 1368 · Nanjing",CLAY,fin(t,cW+0.2,0.6)*(1-fin(t,cH-0.4,0.5)));
  yearTag(ctx,96,100,"Zhejiang, the rich province",CLAY,fin(t,cH+0.5,0.6)*(1-fin(t,cB+0.6,0.6)));
  mtb_title(ctx,S,t,0.15,cW-0.25,"The map behind the sketch","Where a data model's boxes belong");
});

/* ---------- 2. Two registers ---------- */
scene("two",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cD=c("decide"),cY=c("yellow"),cF=c("fish"),cS=c("scales"),cJ=c("jobs"),cWp=c("warp"),cC=c("count"),cSo=c("sold");
  const pd=lt_pad(1600,875),PP=rg_padPts(pd),TL=PP[0],TR=PP[6],BR=PP[7],BL=PP[13],px=(TL[0]+TR[0]+BR[0]+BL[0])/4,py=(TL[1]+BL[1])/2,qF=lt_pad(2440,800);
  const HA=RG_HOUSES[1],HB=RG_HOUSES[4],fq=lt_pad(1655,790),FP=rg_padPts(fq),fx=(FP[0][0]+FP[6][0])/2,fy=(FP[0][1]+FP[13][1])/2;
  const cam=camAt([[0,1880,650,1.04],[cF+0.2,1880,650,1.04],[cF+2.0,px,py-60,2.1],[cS-1.3,px,py-60,2.1],[cS+0.3,1880,650,1.04],[cSo-0.8,1880,650,1.04],[cSo+1.0,1655,676,1.62]],t);
  const dim=0.6*fin(t,cD-0.2,1.2)*(1-fin(t,cF,1.4))+0.66*fin(t,cS-0.6,1.0)*(1-fin(t,cSo-0.9,1.2))+0.1*fin(t,cSo-0.9,1.2);
  rg_land(ctx,S,cam,t,{dim});setCam(ctx,S,cam);
  // carried on from the chapter before: the field and the house the two questions are about
  const q0=1-fin(t,cD,0.8);withA(ctx,q0,()=>{ctx.save();lt_padPath(ctx,qF);ctx.fillStyle=rgba(RG_EARTH,0.25);ctx.fill();ctx.strokeStyle=rgba(RG_EARTH,1);ctx.lineWidth=4;ctx.stroke();ctx.restore();});
  if(q0>0)glow(ctx,1720,610,120,RG_YEL,0.3*q0);
  // the students of the Imperial Academy measure a field: its shape, its size, and its owner's name
  const fA=fin(t,cF+1.0,0.8)*(1-fin(t,cS-1.7,0.5));
  if(fA>0){const tM=w("fish","measured"),ax=TL[0]-10,bx=TR[0]+10;
    const hA=rg_fig(ctx,ax,rg_dike(pd.r,ax)+3,0.3,{a:fA,dress:"robe",head:"cap",hold:"rope"}),hB=rg_fig(ctx,bx,rg_dike(pd.r,bx)+3,0.3,{a:fA,dress:"robe",head:"cap",hold:"rope",f:-1});
    rg_fig(ctx,bx+120,rg_dike(pd.r,bx+120)+5,0.3,{a:fA,dress:"robe",head:"cap",hold:"book",f:-1});
    const rk=fin(t,tM-0.6,0.8);if(rk>0)withA(ctx,fA*rk,()=>{ctx.strokeStyle=rgba(RG_PAPER,0.95);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(hA[0],hA[1]);ctx.quadraticCurveTo((hA[0]+hB[0])/2,(hA[1]+hB[1])/2+10,hB[0],hB[1]);ctx.stroke();});
    // the field's outline, traced along its dikes as they measure
    const k=clamp((t-tM)/2.4,0,1);if(k>0)withA(ctx,fA,()=>{const P=PP.concat([PP[0]]);let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);let left=L*k;
      ctx.save();ctx.strokeStyle=rgba(RG_YEL,1);ctx.lineWidth=3.4;ctx.lineJoin="round";ctx.shadowColor=rgba(RG_YEL,0.9);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length&&left>0;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]),f=Math.min(1,left/d);ctx.lineTo(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f));left-=d;}ctx.stroke();ctx.restore();});
    const sA=fin(t,w("fish","size"),0.5);if(sA>0)withA(ctx,fA*sA,()=>{const yy=Math.max(BL[1],BR[1])+16;ctx.strokeStyle=rgba(RG_PAPER,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(BL[0],yy);ctx.lineTo(BR[0],yy);ctx.moveTo(BL[0],yy-7);ctx.lineTo(BL[0],yy+7);ctx.moveTo(BR[0],yy-7);ctx.lineTo(BR[0],yy+7);ctx.stroke();});
    lt_pillAt(ctx,S,cam,TL[0]+20,TL[1]-128,"its shape",RG_YEL,fA*fin(t,w("fish","shape"),0.5));
    lt_pillAt(ctx,S,cam,(BL[0]+BR[0])/2,Math.max(BL[1],BR[1])+46,"its size",RG_PAPER,fA*sA);
    lt_pillAt(ctx,S,cam,TR[0]-10,TR[1]-128,"its owner: Chen",RG_EARTH,fA*fin(t,w("fish","owner"),0.5));}
  // and when a field was sold, its tax went with it: in the village, a field passes from one household to another, and the grain it owes goes too
  const sA=fin(t,cSo+0.5,0.7);
  if(sA>0){withA(ctx,sA,()=>{rg_padPath(ctx,fq);ctx.fillStyle=rgba(RG_EARTH,0.24);ctx.fill();ctx.strokeStyle=rgba(RG_EARTH,1);ctx.lineWidth=3.4;ctx.stroke();});
    const mv=fin(t,w("sold","sold"),1.2),tx=ease(fin(t,w("sold","tax"),1.5));
    arrowTo(ctx,fx,fy-4,HA[0]+18,HA[1]-118*HA[2],RG_EARTH,sA*(1-mv),{bend:0.2,dash:[10,8],lw:3});
    arrowTo(ctx,fx,fy-4,HB[0]-18,HB[1]-118*HB[2],RG_EARTH,sA,{bend:-0.2,dash:[10,8],lw:3,p:mv});
    rg_fig(ctx,HA[0]+52,rg_roadY(HA[0]+52)-18,0.3,{a:sA,head:"wrap",f:1});rg_fig(ctx,HB[0]-52,rg_roadY(HB[0]-52)-18,0.3,{a:sA,head:"wrap",f:-1});
    rg_sack(ctx,lerp(HA[0]-74,HB[0]+74,tx),lerp(HA[1]+4,HB[1]+4,tx)-Math.sin(Math.PI*tx)*90,0.62,sA);}
  setScreen(ctx,S);
  if(sA>0){const pA=toScreen(cam,HA[0],HA[1]-150*HA[2]);lt_tick(ctx,pA.x,pA.y,sA*fin(t,w("sold","no family"),0.5));}
  // the two questions, carried on from the land to the two registers
  const qk=ease(fin(t,cD+0.5,1.4)),qa=1-fin(t,cY-0.4,0.6);
  [[1720,470,"who lives here?",RG_YEL,640],[qF.x+qF.w/2,qF.y-40,"whose field?",RG_EARTH,1280]].forEach(([wx,wy,s,col,bx])=>{const p=toScreen(cam,wx,wy);rg_pill(ctx,lerp(p.x,bx,qk),lerp(p.y,345,qk),s,col,qa);});
  // the two registers: the households' (the Yellow Registers) and the land's (the fish-scale registers)
  const KY=[[0,640,820,250,330,0,0],[cD+0.3,640,820,250,330,0,0],[cD+1.4,640,600,250,330,0,1],[cY+0.2,640,600,250,330,0,1],[cY+1.6,760,580,400,480,1,1],[cF-0.6,760,580,400,480,1,1],[cF+0.6,640,600,250,330,0,0],[cJ-0.3,640,600,250,330,0,0],[cJ+0.7,640,600,250,330,0,1],[cWp+0.2,640,600,250,330,0,1],[cWp+1.4,300,560,220,290,0,1],[cC-0.2,300,560,220,290,0,1],[cC+0.8,300,560,220,290,0,0]];
  const KL=[[0,1280,820,250,330,0,0],[cD+0.5,1280,820,250,330,0,0],[cD+1.6,1280,600,250,330,0,1],[cY+0.2,1280,600,250,330,0,1],[cY+1.4,1640,600,250,330,0,0.3],[cF-0.6,1640,600,250,330,0,0.3],[cF+0.4,1640,600,250,330,0,0],[cS+0.1,960,560,420,540,0,0],[cS+0.6,960,560,420,540,0,1],[cS+1.3,960,560,420,540,1,1],[cJ-0.3,960,560,420,540,1,1],[cJ+0.9,1280,600,250,330,0,1],[cWp+0.2,1280,600,250,330,0,1],[cWp+1.4,1620,560,220,290,0,1],[cC-0.2,1620,560,220,290,0,1],[cC+0.8,1620,560,220,290,0,0]];
  const[yx,yy,yw,yh,yo,ya]=lt_keys(KY,t),[lx,ly,lw,lh,lo,la]=lt_keys(KL,t),head=t>w("yellow","ten of them")?Math.floor((t-w("yellow","ten of them"))/0.7)%10:-1;
  rg_book(ctx,yx,yy,yw,yh,{col:RG_YEL,a:ya,open:yo});
  if(yo>0.9&&ya>0.01)rg_unit(ctx,yx,yy-130,1.25,{a:ya*fin(yo,0.9,0.1),p:clamp((t-cY-1.5)/3.2,0,1),head});
  rg_book(ctx,lx,ly,lw,lh,{col:RG_EARTH,a:la,open:lo});
  if(lo>0.95&&la>0.01){const sx=lx-lw+24,sy=ly-lh/2+24;rg_scales(ctx,sx,sy,2*lw-48,lh-48,{a:la,p:clamp((t-cS-1.2)/3.4,0,1),n:8,seed:3});}
  rg_pill(ctx,560,250,"110 households",RG_YEL,fin(t,w("yellow","hundred"),0.5)*(1-fin(t,cF-0.7,0.5)));
  rg_pill(ctx,1000,250,"10 heads, a year each",RG_YEL,fin(t,w("yellow","ten of them"),0.5)*(1-fin(t,cF-0.7,0.5)));
  rg_pill(ctx,960,240,"like the scales of a fish",RG_EARTH,fin(t,w("scales","scales"),0.5)*(1-fin(t,cJ-0.5,0.5)));
  // one job each
  const jO=1-fin(t,cWp-0.2,0.6);
  rg_pill(ctx,960,300,"one job each",MTB,fin(t,w("jobs","one job"),0.5)*jO);
  rg_pill(ctx,640,830,"what each family owes",RG_YEL,fin(t,w("jobs","household"),0.5)*jO);
  rg_pill(ctx,1280,830,"who holds each field",RG_EARTH,fin(t,w("jobs","land"),0.5)*jO);
  // warp and weft: threads that run two ways, and together make a cloth
  const WK=lt_keys([[cWp,660,250,600,500],[cC-0.1,660,250,600,500],[cC+1.2,170,330,380,320]],t),wvA=fin(t,cWp+0.4,0.6)*(1-fin(t,cSo-0.9,0.8));
  if(wvA>0){const cl=fin(t,w("warp","cloth"),0.8);if(cl>0)glow(ctx,WK[0]+WK[2]/2,WK[1]+WK[3]/2,WK[2]*0.75,MTB,0.18*cl*wvA);
    rg_weave(ctx,WK[0],WK[1],WK[2],WK[3],{a:wvA,nw:16,nf:13,pw:clamp((t-w("warp","warp"))/2.2,0,1),pf:clamp((t-w("warp","weft"))/2.6,0,1),wc:RG_EARTH,fc:RG_YEL});}
  const wO=1-fin(t,cC-0.3,0.5);
  rg_pill(ctx,960,205,"the warp: the land",RG_EARTH,fin(t,w("warp","warp"),0.5)*wO);
  rg_pill(ctx,960,820,"the weft: the households",RG_YEL,fin(t,w("warp","weft"),0.5)*wO);
  yearTag(ctx,96,100,"the Ming History",CLAY,fin(t,w("warp","Ming History"),0.6)*wO);
  // a count of the empire's households, for the first time since the war
  const cA=fin(t,cC+0.6,0.7)*(1-fin(t,cSo-0.9,0.7));
  if(cA>0)withA(ctx,cA,()=>{glass(ctx,640,360,1120,330,24,RG_YEL,{glow:18,ea:0.6,fill:"rgba(26,16,10,0.92)"});
    const n=10652870*ease(clamp((t-w("count","count")-0.2)/2.4,0,1));T(ctx,fmtNum(n),1200,540,{w:800,size:120,align:"center",color:rgba(RG_YEL,1)});T(ctx,"households, counted again",1200,616,{w:600,size:34,align:"center",color:rgba(RG_PAPER,0.95)});});
  yearTag(ctx,96,100,"1381",CLAY,fin(t,cY+0.2,0.6)*(1-fin(t,cF-0.4,0.5)));
  yearTag(ctx,96,100,"1387",CLAY,fin(t,cF+0.2,0.6)*(1-fin(t,cS-0.4,0.5)));
  yearTag(ctx,96,100,"1393",CLAY,fin(t,cC+0.2,0.6)*(1-fin(t,cSo-0.9,0.5)));
  rg_pill(ctx,960,220,"sold",RG_EARTH,fin(t,w("sold","sold"),0.4));
  rg_pill(ctx,960,300,"its tax went with it",RG_YEL,fin(t,w("sold","tax"),0.5));
});

/* ---------- 3. The sketch we drew ---------- */
const LT_PLACE=[[-210,-128],[210,-128],[-210,122],[210,122]];
scene("sketch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cP=c("promise"),cD=c("drew"),cNo=c("noor"),cPl=c("place"),cM=c("map"),out=lt_out(t,sc);
  const cam=camAt([[0,960,540,1],[cPl+0.2,960,540,1],[cPl+1.8,972,470,1.32],[cM+0.1,972,470,1.32],[cM+1.9,960,540,1]],t);
  bgW(ctx,S,cam);setScreen(ctx,S);
  // the same need: the court's two registers, and a university today
  const a1=fin(t,0.3,0.8)*(1-fin(t,cP-0.4,0.7));
  if(a1>0)withA(ctx,a1,()=>{glass(ctx,170,240,640,440,22,RG_YEL,{glow:14,ea:0.5,fill:"rgba(30,20,12,0.92)"});rg_book(ctx,380,440,170,230,{col:RG_YEL});rg_book(ctx,600,440,170,230,{col:RG_EARTH});
    rg_pill(ctx,490,620,"the court, 1393",RG_YEL,1);
    glass(ctx,1110,240,640,440,22,CYAN,{glow:14,ea:0.5});ctx.save();rr(ctx,1122,252,616,416,16);ctx.clip();ctx.drawImage(master2(1),1122,252,624,416);ctx.restore();
    tag(ctx,1430,620,"a university, today",CYAN,{align:"center",size:28});
    const k=fin(t,w("same","same need"),0.9);if(k>0){ctx.save();ctx.strokeStyle=rgba(MTB,0.9*k);ctx.lineWidth=4;ctx.shadowColor=rgba(MTB,0.8);ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(810,470);ctx.lineTo(lerp(810,1110,ease(k)),470);ctx.stroke();ctx.restore();rg_pill(ctx,960,400,"the same need",MTB,fin(k,0.6,0.4));}
    withA(ctx,fin(t,w("same","every data model"),0.6),()=>tag(ctx,960,780,"and every data model",SK,{align:"center",size:28}));});
  // the intro's promise
  const a2=fin(t,cP-0.1,0.7)*(1-fin(t,cD-0.4,0.6));
  if(a2>0)withA(ctx,a2,()=>{glass(ctx,300,330,1320,330,24,CYAN,{glow:18,ea:0.6});T(ctx,"THE INNER LIFE OF DATA · HOW IT ENDED",960,402,{w:800,size:28,align:"center",color:rgba(CYAN,0.95)});
    T(ctx,"What it means, and who decides,",960,506,{w:700,size:52,align:"center"});T(ctx,"is the rest of the story.",960,576,{w:700,size:52,align:"center"});});
  // the sketch we drew, on its board
  const a3=fin(t,cD-0.2,0.8)*out*(1-fin(t,w("map","enterprise")-0.5,0.6)),dimO=fin(t,cPl+0.4,0.8)*(1-fin(t,cM+0.2,0.8));
  if(a3>0){setCam(ctx,S,cam);withA(ctx,a3*(1-0.5*fin(t,cM+0.6,1.0)),()=>{board(ctx,1,"");
    // the board's name leaves before the camera goes in, so it isn't cut by the frame, and comes back once the camera is out
    withA(ctx,1-fin(t,cPl-0.3,0.4)*(1-fin(t,cM+1.6,0.5)),()=>tag(ctx,150,170,"Conceptual model · the sketch we drew",SK,{size:18}));
    const ap={};["Student","Class","Enrolment","Term","Course"].forEach(k=>{ap[k]=fin(t,w("drew",k.toLowerCase()),0.5)*(k==="Enrolment"?1:1-0.65*dimO);});
    mp_sketch(ctx,{ap,rel:clamp((t-w("drew","course")-0.3)/1.2,0,1),relA:1-0.65*dimO,hi:{Enrolment:dimO}});
    withA(ctx,fin(t,w("noor","shared"),0.6)*(1-dimO),()=>tag(ctx,1500,840,"to be shared by the university",SK,{align:"center",size:28}));});
    // Noor, the data architect, slides in at the board's left
    const nx=lerp(-220,210,ease(fin(t,cNo-0.3,1.2)));if(nx>-200)lt_faded(ctx,a3*(1-0.5*fin(t,cM+0.6,1.0)),x2=>{person(x2,"noor",nx,906,0.6,{t,expr:"calm"});});
    withA(ctx,a3*fin(t,w("noor","Nuur")+0.6,0.5)*(1-dimO),()=>tag(ctx,210,540,"Noor · data architect",TECH,{align:"center",size:28}));}
  // each box needs a place: four questions around the enrolment, which fly up to become the map's four parts
  setScreen(ctx,S);const L=mp_indexLayout(ctx),fly=i=>ease(clamp((t-cM-0.25-i*0.14)/1.4,0,1)),idxA=out;
  [["for",0],["answers",1],["written",2],["means",3]].forEach(([wd,i])=>{const a=fin(t,w("place",wd),0.5);if(a<=0)return;const p=toScreen(cam,972+LT_PLACE[i][0],413+LT_PLACE[i][1]),k=fly(i),x=lerp(p.x,L[i].cx,k),y=lerp(p.y,L[i].y,k);
    if(k<0.05){const b=toScreen(cam,972,413);withA(ctx,a*(1-k*20),()=>{ctx.save();ctx.strokeStyle=rgba(MP_PARTS[i][1],0.7);ctx.lineWidth=2.4;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(lerp(b.x,p.x,0.36),lerp(b.y,p.y,0.36));ctx.lineTo(lerp(b.x,p.x,0.8),lerp(b.y,p.y,0.8));ctx.stroke();ctx.restore();});}
    mp_chip(ctx,x,y,i,lerp(1,0.5,k),a*idxA);});
  // the map before the data: the enterprise architecture films' map, for an energy company
  const eA=fin(t,w("map","enterprise")+0.1,0.6)*out;
  if(eA>0)mp_card(ctx,660,390,600,{a:eA,col:LAYER.gold,kicker:"Enterprise architecture films",title:"The map before the data",lines:["the same map, for an energy company"]});
  vign(ctx,S);
});

/* ---------- 4. What it does ---------- */
// learning and teaching, opened: its capabilities a level down, in a row inside it (x, width); planning, inside strategy and planning
const LT_L2=[["Awards and courses",160,300],["Credit and its recognition",482,300],["Learner records and credentials",804,300],["Graduation",1126,300],["Short courses",1448,300]];
scene("does",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cH=c("herm"),cWt=c("what"),cOp=c("open"),cCe=c("census"),out=lt_out(t,sc);
  bgW(ctx,S,CAM0);setScreen(ctx,S);mp_index(ctx,lt_lit(t,[0.5,0.5,0.5,0.5],[1,0,0,0]),1);
  // HERM: the sector's reference, under the university's capabilities
  const hA=fin(t,w("herm","Herm"),0.7)*(1-fin(t,cWt-0.2,0.8))*out;
  if(hA>0)withA(ctx,hA,()=>{ctx.fillStyle="rgba(58,48,36,0.55)";rr(ctx,120,160,1680,600,18);ctx.fill();ctx.strokeStyle=rgba(REF,0.5);ctx.lineWidth=1.6;ctx.setLineDash([10,8]);rr(ctx,120,160,1680,600,18);ctx.stroke();ctx.setLineDash([]);
    T(ctx,"HERM · the Higher Education Reference Models",160,620,{w:700,size:30,color:rgba(REF,1)});T(ctx,"shared by universities: nobody starts from a blank page",160,668,{w:600,size:28,color:rgba(REF,0.85)});});
  // the eight capabilities: what the university does. Learning and teaching opens wide; strategy and planning waits below it
  const op=ease(fin(t,cOp,1.4)),opS=ease(fin(t,cOp+0.4,1.4)),wA=fin(t,cWt+0.2,0.6)*(1-fin(t,cOp-0.3,0.6)),plan=fin(t,w("census","planning"),0.6);
  MP_CAPS.forEach((n,i)=>{let[x,y]=MP_CAPXY(i),wd=370,h=150,a=fin(t,c("caps")+0.5+i*0.32,0.5)*out;const lift=hA*8;
    if(i===0){x=lerp(x,130,op);y=lerp(y,180,op);wd=lerp(370,1660,op);h=lerp(150,372,op);}
    else if(i===3){x=lerp(x,130,opS);y=lerp(y,580,opS);wd=lerp(370,900,opS);h=lerp(150,290,opS);}
    else a*=1-fin(t,cOp,0.8);
    const dim=i===0?0:(i===3?Math.max(wA,0.6*(fin(t,cOp,0.6)-plan)):wA);
    mp_tile(ctx,x,y-lift,wd,h,n,CAPC,{a,dim,hi:i===0?Math.max(wA,0.4*fin(t,cOp,0.6)):(i===3?plan:0)});});
  // what, not how: the need to award a degree outlasts every system and team
  if(wA>0)withA(ctx,wA,()=>{mp_card(ctx,160,620,520,{col:CAPC,kicker:"what",title:"Award a degree",hi:fin(t,w("what","degree"),0.6)});
    glass(ctx,740,620,1020,170,18,SOFT,{glow:8,ea:0.4,fill:"rgba(8,13,26,0.94)"});T(ctx,"how: its systems and teams",770,670,{w:700,size:28,color:rgba(SOFT,1)});
    const H=[["ledgers and paper forms","the exams office"],["a student system","the registrar's office"],["a new student system","the registrar's office"]],k=clamp((t-w("what","Systems"))/1.5,0,H.length-1);
    H.forEach((h,i)=>{const al=clamp(1-Math.abs(k-i)*2.2,0,1),dy=(i-k)*24;if(al<=0.01)return;withA(ctx,al,()=>{T(ctx,h[0],770,728+dy,{w:800,size:34});T(ctx,h[1],770,770+dy,{w:600,size:28,color:rgba(SOFT,1)});});});});
  // inside learning and teaching, its capabilities a level down: the sketch's boxes start to belong somewhere
  const l2=i=>fin(t,cOp+0.6+i*0.22,0.5)*out;
  LT_L2.forEach(([n,x,wd],i)=>mp_tile(ctx,x,262,wd,150,n,CAPC,{a:l2(i),size:30,hi:i===3?fin(t,w("open","graduation"),0.6)*(1-fin(t,cCe,0.8)):0}));
  mp_tile(ctx,160,652,430,150,"Planning and census reporting",CAPC,{a:plan*out,size:30,hi:fin(t,w("census","planning")+0.4,0.6)});
  // the boxes: in a row as they come, then each to where it belongs, under its capability
  const names=["Student","Class","Enrolment","Term","Course"],sz=28,gap=26,ws=names.map(n=>mp_boxW(ctx,n,sz)),tot=ws.reduce((a,b)=>a+b,0)+gap*4;let bx=1400-tot/2+ws[0]/2;
  const start={};names.forEach((n,i)=>{start[n]=[bx,840];bx+=ws[i]/2+gap+(ws[i+1]||0)/2;});
  const dest={Course:[310,456],Class:[310,516],Student:[954,456],Enrolment:[954,516],Term:[640+mp_boxW(ctx,"Term",sz)/2,727]};
  const go={Course:w("open","awards"),Class:w("open","awards")+0.25,Student:w("open","learner"),Enrolment:w("open","learner")+0.25,Term:w("census","planning")};
  names.forEach(n=>{const a=fin(t,w("open","boxes")+names.indexOf(n)*0.12,0.5)*out;if(a<=0)return;const k=ease(fin(t,go[n],1.1)),p=start[n],q=dest[n],arc=Math.sin(Math.PI*k)*60;
    mp_box(ctx,lerp(p[0],q[0],k),lerp(p[1],q[1],k)-arc,n,{a,hi:n==="Term"?fin(t,cCe,0.6)*(1-fin(t,go.Term+1.0,0.6)):0,hiCol:QC});});
  vign(ctx,S);
});

/* ---------- 5. What it needs to know ---------- */
scene("knows",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cOw=c("owner"),cMe=c("mei"),cDr=c("drop"),cDe=c("decides"),out=lt_out(t,sc);
  bgW(ctx,S,CAM0);setScreen(ctx,S);mp_index(ctx,lt_lit(t,[1,0,0,0],[0,1,0,0]),1);
  // Mei Tanaka, of the registrar's office, slides in at the left
  const mx=lerp(-220,220,ease(fin(t,cMe-0.4,1.2)));if(mx>-200)lt_faded(ctx,out,x2=>person(x2,"mei",mx,904,0.6,{t,expr:"calm"}));
  withA(ctx,fin(t,w("mei","Mei")+0.5,0.5)*out,()=>tag(ctx,220,540,"Mei · registrar's office",BIZ,{align:"center",size:28}));
  // the data domains, and each one's owner
  const on=["Person","Student","Course","Staff","Finance"],few=w("domains","few"),hiT={Student:w("mei","Student"),Course:w("mei","Student")+0.2,Staff:w("mei","Staff"),Organisation:w("mei","Organisation")};
  const toP=ease(fin(t,cDr,1.3)),PAN={Student:[420,220,600,300],Course:[1080,220,680,300]};
  MP_DOMS.forEach(([n,own],i)=>{let[x,y]=MP_DOMXY(i),wd=420,h=156;const t0=on.includes(n)?w("domains",n.toLowerCase()):few+(i-5)*0.25;let a=fin(t,t0,0.5)*out;
    const P=PAN[n];if(P){x=lerp(x,P[0],toP);y=lerp(y,P[1],toP);wd=lerp(wd,P[2],toP);h=lerp(h,P[3],toP);}else a*=1-fin(t,cDr,0.8);
    const lit=hiT[n]!=null?fin(t,hiT[n],0.6):0,dim=fin(t,cMe+0.4,0.8)*(1-lit)*(P?1-toP:1);
    mp_tile(ctx,x,y,wd,h,n,DOMC,{a,size:32,sub:own,subA:fin(t,cOw+0.2+i*0.08,0.5),subCol:n==="Course"?mix(SOFT,DOMC,fin(t,w("mei","faculties"),0.6)):lit>0?mix(SOFT,DOMC,lit):SOFT,hi:lit*(1-toP),dim});});
  // the sketch's boxes fall into their domains
  const fall=[["Student",w("drop","student"),"Student"],["Enrolment",w("drop","enrolment"),"Student"],["Course",w("drop","the course"),"Course"],["Class",w("drop","class"),"Course"],["Term",w("drop","term"),"Course"]];
  const slot={};fall.forEach(([n,,d])=>{(slot[d]=slot[d]||[]).push(n);});
  fall.forEach(([n,t0,d])=>{const k=fin(t,t0,0.9);if(k<=0)return;const P=PAN[d],list=slot[d];let x=P[0]+28;for(const m of list){if(m===n)break;x+=mp_boxW(ctx,m,28)+16;}const bw=mp_boxW(ctx,n,28),tx=x+bw/2,ty=P[1]+P[3]-48,b=Math.abs(Math.sin(k*Math.PI*1.5))*(1-k)*40;
    mp_box(ctx,tx,lerp(ty-360,ty,ease(k))-b,n,{a:fin(t,t0,0.3)*out});});
  // an owner decides; an owner doesn't build
  const dA=out;withA(ctx,dA,()=>{mp_box(ctx,520,700,"builds",{a:fin(t,w("decides","build"),0.5),col:SOFT,strike:fin(t,w("decides","build")+0.4,0.5)});
    mp_card(ctx,660,610,520,{a:fin(t,w("decides","mean"),0.5),col:DOMC,kicker:"decides",title:"what the words mean"});
    mp_card(ctx,1220,610,540,{a:fin(t,w("decides","good"),0.5),col:DOMC,kicker:"decides",title:"what good data looks like"});});
  vign(ctx,S);
});

/* ---------- 6. Where it's written ---------- */
scene("kept",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cSo=c("sor"),cSi=c("sis"),cCo=c("copies"),cFx=c("fix"),out=lt_out(t,sc);
  bgW(ctx,S,CAM0);setScreen(ctx,S);mp_index(ctx,lt_lit(t,[0,1,0,0],[0,0,1,0]),1);
  const sys=(x,y,wd,h,name,badge,a,hi)=>withA(ctx,a*out,()=>{if(hi)glow(ctx,x+wd/2,y+h/2,wd*0.6,SYSC,0.22*hi);glass(ctx,x,y,wd,h,18,SYSC,{glow:10+12*(hi||0),ea:0.6,fill:"rgba(8,13,26,0.94)"});T(ctx,name,x+28,y+52,{w:800,size:wd<400?30:32,color:rgba(mix(SYSC,[255,255,255],0.4),1)});
    tag(ctx,x+28,y+96,badge,SYSC,{size:28});});
  // the systems of record: where each thing is first written
  sys(160,190,640,380,"Student system","the record",fin(t,cSo+0.4,0.6),fin(t,cSi,0.6)*(1-fin(t,cCo,0.8)));
  sys(160,600,310,170,"HR system","the record",fin(t,w("sis","HR"),0.6),fin(t,w("sis","HR"),0.6)*(1-fin(t,cCo,0.8)));
  sys(490,600,310,170,"Finance system","the record",fin(t,w("sis","Finance"),0.6),fin(t,w("sis","Finance"),0.6)*(1-fin(t,cCo,0.8)));
  // students, enrolments and courses, written in the student system
  const rows=[["Student",w("sis","Students")],["Enrolment",w("sis","enrolments")],["Course",w("sis","courses")]];
  rows.forEach(([n,t0],i)=>mp_box(ctx,190+mp_boxW(ctx,n,28)/2,370+i*66,n,{a:fin(t,t0,0.5)*out}));
  // the data platform holds copies, to read and to count
  const pA=fin(t,cCo-0.2,0.7)*out;
  if(pA>0)withA(ctx,pA,()=>{glass(ctx,1080,190,680,580,18,COPYC,{glow:12,ea:0.55,fill:"rgba(8,13,26,0.94)"});T(ctx,"Data platform",1108,242,{w:800,size:32,color:rgba(mix(COPYC,[255,255,255],0.4),1)});tag(ctx,1108,286,"copies",COPYC,{size:28});
    rows.forEach(([n],i)=>{const k=fin(t,w("copies","copies")+0.3+i*0.25,0.5);arrowTo(ctx,800,370+i*66,1100,370+i*66,COPYC,0.6*k,{p:k,dash:[10,8],lw:2.4});mp_box(ctx,1110+mp_boxW(ctx,n,28)/2,370+i*66,n,{a:k,col:COPYC,dash:true});});});
  rg_pill(ctx,1180,600,"to read",COPYC,fin(t,w("copies","read"),0.5)*out,{size:28});
  rg_pill(ctx,1400,600,"to count",COPYC,fin(t,w("copies","count"),0.5)*out,{size:28});
  rg_pill(ctx,1420,700,"a copy never decides",QC,fin(t,w("copies","never"),0.5)*out,{size:28});
  // when the two disagree, the record wins; a mistake is fixed where it was written
  const vY=436,dA=fin(t,w("fix","disagree"),0.5)*out,tW=w("fix","wins"),win=fin(t,tW,0.5),fx=fin(t,w("fix","fixed"),0.6);
  if(dA>0){const rx=190+mp_boxW(ctx,"Enrolment",28)+24,cx=1110+mp_boxW(ctx,"Enrolment",28)+24,rw=tw(ctx,"enrolled",phSz(ctx,28),700)+26;
    withA(ctx,dA,()=>{tag(ctx,rx,vY,"enrolled",GOOD,{size:28});
      // the copy says otherwise until the record wins: the record's word goes along the line the copy was made by
      const sw=fin(t,tW+0.9,0.5),pu=clamp((t-tW-0.1)/0.8,0,1);
      withA(ctx,1-sw,()=>tag(ctx,cx,vY,"withdrawn",BAD,{size:28}));withA(ctx,sw,()=>tag(ctx,cx,vY,"enrolled",COPYC,{size:28}));
      if(pu>0&&pu<1){const qx=lerp(800,1100,ease(pu));glow(ctx,qx,vY,46,GOOD,0.55);ctx.fillStyle=rgba(GOOD,1);ctx.beginPath();ctx.arc(qx,vY,7,0,TAU);ctx.fill();}
      lt_tick(ctx,rx+rw+30,vY,win);
      // a mistake is fixed where it was written: the pen goes to the record, not to the copy
      if(fx>0){const k=ease(fin(t,w("fix","fixed")-0.3,1.0)),qx=lerp(cx+rw*0.5,rx+rw*0.5,k)+10,qy=vY-36-Math.sin(Math.PI*k)*50;
        withA(ctx,fx,()=>{glow(ctx,rx+rw/2,vY,110,SYSC,0.3*fin(t,w("fix","fixed")+0.6,0.4));lt_pen(ctx,qx,qy);});
        rg_pill(ctx,480,840,"fixed where it was written",SYSC,fx,{size:28});}});}
  vign(ctx,S);
});

/* ---------- 7. What the words mean ---------- */
const LT_TERMS=["Award","Commencing student","Credential","Learner","Unit offering"];
scene("means",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cG=c("gloss"),cF=c("first"),cL=c("look"),cC=c("cls"),cT=c("term"),cGv=c("gov"),out=lt_out(t,sc);
  bgW(ctx,S,CAM0);setScreen(ctx,S);mp_index(ctx,lt_lit(t,[0,0,1,0],[0,0,0,1]),1);
  // the business glossary: each term once, with its definition and its owner
  const gA=fin(t,cG+0.3,0.6)*out;
  if(gA>0)withA(ctx,gA,()=>{glass(ctx,160,180,440,560,18,GLOC,{glow:12,ea:0.55,fill:"rgba(8,13,26,0.94)"});T(ctx,"Business glossary",188,234,{w:800,size:32,color:rgba(mix(GLOC,[255,255,255],0.4),1)});
    LT_TERMS.forEach((n,i)=>{const on=i===0?fin(t,cG+1.0,0.5)*(1-fin(t,cL,0.6)):(i===4?fin(t,w("cls","unit offerings"),0.6):0);if(on>0){ctx.fillStyle=rgba(GLOC,0.16*on);rr(ctx,176,276+i*80,408,62,10);ctx.fill();}
      T(ctx,n,196,318+i*80,{w:700,size:30,color:rgba(mix(INK,GLOC,on),1)});});});
  const aw=fin(t,cG+1.0,0.6)*(1-fin(t,cL-0.2,0.6))*out,def="A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points.";
  if(aw>0)mp_card(ctx,660,180,1100,{a:aw,col:GLOC,kicker:"Glossary term",title:"Award",lines:[def,"Owner: Mei Tanaka, registrar's office"],lineCols:[INK,DOMC],lineA:[fin(t,w("gloss","definition"),0.6),fin(t,w("gloss","owner"),0.6)]});
  // the model copies it, word for word
  const mA=fin(t,cF+0.2,0.6)*(1-fin(t,cL-0.2,0.6))*out;
  if(mA>0){const ty=clamp((t-w("first","copies"))/2.2,0,1);mp_card(ctx,660,540,1100,{a:mA,col:SK,kicker:"In the model",title:"award",lines:[ty>0?typeOn(def,ty):" "],lineCols:[INK]});
    rg_pill(ctx,1560,500,"copied, word for word",GOOD,fin(t,w("first","word for word"),0.5)*mA,{size:28});}
  // the sketch's words, looked up: two of them aren't the university's
  const names=["Student","Class","Enrolment","Term","Course"],X={};let x=700;names.forEach(n=>{const bw=mp_boxW(ctx,n,28);X[n]=x+bw/2;x+=bw+30;});
  const lk=fin(t,cL,0.6)*out,bad={Class:w("cls","not classes"),Term:w("term","not terms")};
  names.forEach((n,i)=>{const a=lk;if(a<=0)return;const isQ=n==="Class"||n==="Term",chk=fin(t,w("look","sketch's words")+0.6+i*0.3,0.4),q=fin(t,w("look","two of them"),0.5);
    mp_box(ctx,X[n],270,n,{a,col:isQ?mix(SK,QC,q):SK,strike:isQ?fin(t,bad[n],0.6):0});
    if(!isQ)lt_tick(ctx,X[n],214,a*chk);else if(q>0)mp_pin(ctx,X[n],214,QC,a*q,q);});
  // the registrar's office's words: unit offerings, and teaching periods
  mp_card(ctx,700,360,520,{a:fin(t,w("cls","unit offerings"),0.6)*out,col:GLOC,kicker:"Glossary term",title:"Unit offering",lines:["A unit taught in a semester, on campus, online or both.","Owner: registrar's office"],lineCols:[INK,DOMC]});
  mp_card(ctx,1240,360,520,{a:fin(t,w("term","teaching periods"),0.6)*out,col:GLOC,kicker:"The registrar's word",title:"Teaching period",lines:["Its census date: Planning counts by it, for government"],lineCols:[INK],lineA:[fin(t,w("term","census"),0.6)]});
  // owners decide the words, stewards keep them written, the data team builds from them
  const roles=[["Owners decide the words",DOMC,w("gov","Owners")],["stewards keep them written",GLOC,w("gov","stewards")],["the data team builds from them",SK,w("gov","data team")]];
  let gx=170;roles.forEach(([s,col,t0],i)=>{const sz=28,bw=tw(ctx,s,sz,700)+40,a=fin(t,t0,0.5)*out;rg_pill(ctx,gx+bw/2,820,s,col,a,{size:28});if(i<2)arrowTo(ctx,gx+bw+8,820,gx+bw+46,820,SOFT,a*fin(t,roles[i+1][2],0.4),{p:1,lw:2.4,head:12});gx+=bw+54;});
  vign(ctx,S);
});

/* ---------- 8. Warp and weft ---------- */
const LT_ROWS=["Learning and teaching","Strategy and planning","People","Finance"],LT_COLS=["Student","Course","Staff","Finance"];
const LT_M=[["c","c","r",""],["r","r","r","r"],["","r","c","r"],["r","","r","c"]];
const LT_CX=i=>780+i*270,LT_RY=j=>330+j*126;
scene("cross",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cX=c("cross"),cCe=c("cells"),cO=c("one"),cH=c("hang"),cTw=c("two"),out=lt_out(t,sc);
  bgW(ctx,S,CAM0);setScreen(ctx,S);mp_index(ctx,i=>lerp([0,0,0,1][i],[1,1,0,0][i],fin(t,0.3,1.0))*(1-0.5*fin(t,cH,0.8))+0.5*fin(t,cH,0.8),1);
  // the two maps crossed: what the university does, across; what it needs to know, down
  const mA=fin(t,cX,0.6)*(1-fin(t,cH-0.2,0.8))*out;
  if(mA>0)withA(ctx,mA,()=>{const pr=clamp((t-w("cross","does"))/2.0,0,1),pc=clamp((t-w("cross","needs to know"))/2.0,0,1);
    LT_ROWS.forEach((n,j)=>withA(ctx,fin(pr,j*0.18,0.3),()=>T(ctx,n,690,LT_RY(j)+10,{w:700,size:30,align:"right",color:rgba(mix(CAPC,[255,255,255],0.35),1)})));
    LT_COLS.forEach((n,i)=>withA(ctx,fin(pc,i*0.18,0.3),()=>T(ctx,n,LT_CX(i),236,{w:700,size:30,align:"center",color:rgba(mix(DOMC,[255,255,255],0.35),1)})));
    // the threads, over and under in turn, like the court's warp and weft
    const tw_=18,warp=(i,y0,y1)=>{ctx.fillStyle=rgba(DOMC,0.9);ctx.fillRect(LT_CX(i)-tw_/2,y0,tw_,y1-y0);},weft=(j,x0,x1)=>{ctx.fillStyle=rgba(CAPC,0.9);ctx.fillRect(x0,LT_RY(j)-tw_/2,x1-x0,tw_);};
    LT_COLS.forEach((n,i)=>{const q=clamp(pc*1.6-i*0.2,0,1);if(q>0)warp(i,262,262+(LT_RY(3)+60-262)*ease(q));});
    LT_ROWS.forEach((n,j)=>{const q=clamp(pr*1.6-j*0.2,0,1);if(q<=0)return;const xe=715+(LT_CX(3)+110-715)*ease(q);weft(j,715,xe);LT_COLS.forEach((m,i)=>{if((i+j)%2===0&&LT_CX(i)<xe&&clamp(pc*1.6-i*0.2,0,1)>0)warp(i,LT_RY(j)-tw_/2-3,LT_RY(j)+tw_/2+3);});});
    // each crossing: who creates the thing, and who only reads it
    const first={"0,0":w("cells","enrolments"),"1,0":w("cells","Planning")},legend=w("cells","creates");
    LT_M.forEach((row,j)=>row.forEach((v,i)=>{if(!v)return;const t0=first[j+","+i]||(cO+0.2+(j*4+i)*0.12),a=fin(t,t0,0.4);if(a<=0)return;const cr=v==="c",s=cr?"creates":"reads",col=cr?MTB:SOFT,sz=28,bw=tw(ctx,s,sz,700)+32,bh=sz+20,x=LT_CX(i),y=LT_RY(j);
      withA(ctx,a,()=>{const hi=cr?fin(t,cO+0.6,0.6):0;if(hi>0)glow(ctx,x,y,100,MTB,0.25*hi);glass(ctx,x-bw/2,y-bh/2,bw,bh,bh/2,col,{glow:cr?14:4,ea:cr?0.95:0.5,fill:cr?"rgba(40,30,12,0.96)":"rgba(8,13,26,0.96)"});T(ctx,s,x,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(cr?MTB:mix(SOFT,INK,0.3),1)});});}));
    withA(ctx,fin(t,w("cells","learning and teaching"),0.5)*(1-fin(t,cO,0.6)),()=>{ctx.strokeStyle=rgba(CAPC,0.8);ctx.lineWidth=3;rr(ctx,330,LT_RY(0)-46,1460,92,46);ctx.stroke();});
    withA(ctx,fin(t,legend,0.5),()=>{rg_pill(ctx,800,840,"one creator for each thing",MTB,fin(t,cO,0.5),{size:28});rg_pill(ctx,1330,840,"as many readers as need it",SOFT,fin(t,w("one","readers"),0.5),{size:28});});});
  // the sketch now hangs on the map: an owner, a home and a meaning for each box; all but two
  const hA=fin(t,cH+0.2,0.8)*out;
  if(hA>0){const pins={};["Student","Enrolment","Course","Class","Term"].forEach((k,i)=>{const t0=cH+0.8+i*0.45;pins[k]=[0,1,2,3].map(j=>fin(t,t0+j*0.12,0.4));});
    const qC=fin(t,w("two","class"),0.5),qT=fin(t,w("two","term"),0.5),pulse=0.75+0.25*Math.sin(t*3.2);
    pins.Class[3]*=1-qC;pins.Term[1]*=1-qT;
    withA(ctx,hA,()=>{board(ctx,1,"Conceptual model · the sketch, on the map");const E=mp_sketch(ctx,{pins,q:{Class:{3:qC*pulse},Term:{1:qT*pulse}},termSub:true});mp_legend(ctx,846,fin(t,cH+0.8,0.6));
      const pC=mp_pinAt(ctx,E.Class,3),pT=mp_pinAt(ctx,E.Term,1),link=(x0,y0,q,a)=>{if(a<=0.01)return;ctx.save();ctx.strokeStyle=rgba(QC,0.75*a);ctx.lineWidth=2.4;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(q[0]+24,q[1]);ctx.stroke();ctx.restore();};
      link(1548,300,pC,qC);link(1552,770,pT,qT);rg_pill(ctx,1640,300,"whose word?",QC,qC,{size:28});rg_pill(ctx,1640,770,"whose date?",QC,qT,{size:28});});}
  vign(ctx,S);
});

/* ---------- 9. Where the work starts ---------- */
const LT_STEPS=[["Ticket","names the question",DOMC],["Map","its things, owners and records",CAPC],["Glossary","the words",GLOC],["Contract","the shape",SYSC],["Model","built from what exists",SK]];
scene("start",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cQ=c("q"),cFl=c("flow"),cB=c("build"),out=lt_out(t,sc);
  bgW(ctx,S,CAM0);setScreen(ctx,S);
  // a new question
  const qA=fin(t,cQ+0.2,0.6)*out;if(qA>0)withA(ctx,qA,()=>{const h=bubble(ctx,440,170,1040,"How many commencing students are in each course this year?",BIZ,{size:34});tag(ctx,470,170,"Ana · Head of School",BIZ,{size:28});});
  // from the question to the model, step by step: the map says where the work starts
  const lit=[w("flow","ticket"),w("flow","map"),w("flow","glossary"),w("build","contract"),w("build","model")];
  LT_STEPS.forEach(([n,s,col],i)=>{const x=150+i*330,y=420,a=fin(t,cQ+1.2+i*0.2,0.5)*out,on=fin(t,lit[i],0.5);mp_step(ctx,x,y,300,230,n,s,col,on,a);
    if(i<4)arrowTo(ctx,x+300+4,y+115,x+330-4,y+115,SOFT,a*fin(t,lit[i+1],0.4),{p:1,lw:2.6,head:12});});
  rg_pill(ctx,960,760,"from what already exists",SK,fin(t,w("build","exists"),0.5)*out,{size:28});
  vign(ctx,S);
});

/* ---------- 10. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cBk=c("back"),cU=c("uni"),cN=c("next"),cTg=c("tag");
  // the two registers, each with one job and one keeper; they leave before the room of the present comes over the land
  const pA=1-fin(t,cU-0.7,0.7),rA=fin(t,cU-0.3,0.8);
  if(rA<1){rg_land(ctx,S,{x:1880,y:650,z:1.04},t,{dim:0.62});setScreen(ctx,S);if(pA>0)withA(ctx,pA*fin(t,0.2,0.8),()=>{rg_book(ctx,640,560,240,320,{col:RG_YEL});rg_book(ctx,1280,560,240,320,{col:RG_EARTH});
    const kA=fin(t,w("back","because"),0.8);rg_fig(ctx,430,780,0.86,{a:kA,dress:"robe",head:"cap",f:1});rg_fig(ctx,1490,780,0.86,{a:kA,dress:"robe",head:"cap",f:-1});
    rg_pill(ctx,640,800,"set a tax",RG_YEL,fin(t,w("back","tax"),0.5));rg_pill(ctx,1280,800,"settle a field",RG_EARTH,fin(t,w("back","settle"),0.5));
    rg_pill(ctx,960,300,"one job, and one keeper",MTB,fin(t,w("back","one job"),0.5));});}
  if(rA>0){withA(ctx,rA,()=>bgW(ctx,S,CAM0));setScreen(ctx,S);}
  // the university's map does the same: a number that's wrong, and whose record to check
  const uA=fin(t,cU+0.3,0.7)*(1-fin(t,cN-0.7,0.6));
  if(uA>0)withA(ctx,uA,()=>{numCard(ctx,200,330,620,"Enrolled on census date · DS101","131","from a dashboard",CYAN);
    const wr=fin(t,w("uni","wrong"),0.5);if(wr>0)withA(ctx,wr,()=>tag(ctx,420,440,"wrong?",BAD,{size:28}));
    const tr=fin(t,w("uni","whose record"),1.0);arrowTo(ctx,820,430,1120,330,SYSC,tr,{p:tr,bend:-0.1,lw:3});arrowTo(ctx,820,430,1120,560,DOMC,tr,{p:tr,bend:0.1,lw:3});
    mp_card(ctx,1130,250,600,{a:fin(t,w("uni","whose record")+0.4,0.6),col:SYSC,kicker:"the record",title:"Student system"});mp_card(ctx,1130,480,600,{a:fin(t,w("uni","whose record")+0.7,0.6),col:DOMC,kicker:"its owner",title:"Registrar's office"});});
  // the map says where each box lives, not that the boxes are right
  const nA=fin(t,cN-0.1,0.8)*(1-fin(t,cTg-0.7,0.8));
  if(nA>0)withA(ctx,nA,()=>{const pins={};["Student","Enrolment","Course","Class","Term"].forEach(k=>{pins[k]=[1,1,1,1];});pins.Class[3]=0;pins.Term[1]=0;const pulse=0.75+0.25*Math.sin(t*3.2);
    board(ctx,1,"Conceptual model · the sketch, on the map");mp_sketch(ctx,{pins,q:{Class:{3:pulse},Term:{1:pulse}},termSub:true});
    mp_card(ctx,730,590,480,{a:fin(t,w("next","next film"),0.6),col:SK,kicker:"Next",title:"A Sharper Sketch"});});
  mtb_end(ctx,S,t,cTg-0.5,"The map behind the sketch","Map it before you model it.");
});
