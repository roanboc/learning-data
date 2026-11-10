/* ===== Tags that travel: the opening, from forest to shelf =====
   The Forest Stewardship Council's chain of custody, from 1993, painted in the module's light (Night glass): a tropical forest's edge
   at night under the hall's petrol sky, a slope cut bare beside it; then a frieze of the chain along one road, a forest's log pile, a
   sawmill, a workshop and a shop, which the camera glides along. No country, flag or people of a real place is drawn, and no FSC logo
   or label: the label is the film's own plain tag. The film's own pictures, prefixed tt_; the kit (films/locks-before-the-data/shared/)
   is used as it is. Places, each painted once: ttForest (the forest's edge) and ttChain (the frieze). */

/* ---------------------------------------------------------------- colours of the night, and a sky
   Leaves and trunks are the hall's dark petrol, nearer things darker, farther ones lighter in the haze (index 0 near, 2 far); what the
   moon lights takes the ice of the panes' edges; bare earth a cool brown under the moon */
const TT_LEAF=[[12,37,40],[19,50,53],[27,63,64]],TT_TRUNK=[[13,27,30],[21,40,43],[31,52,54]],TT_WOOD=[150,124,98],TT_EARTH=[66,60,52],TT_ICE=DP.ice;
function tt_sky(c,hz,moon){const P=DP.hall;let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(P.bg0,1));g.addColorStop(0.75,rgba(P.bg1,1));g.addColorStop(1,rgba(mix(P.bg1,[60,120,126],0.35),1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+40);
  if(moon){const [mx,my]=moon,mg=c.createRadialGradient(mx,my,0,mx,my,420);mg.addColorStop(0,"rgba(200,240,238,0.20)");mg.addColorStop(0.3,"rgba(150,215,220,0.08)");mg.addColorStop(1,"rgba(120,200,210,0)");
    c.fillStyle=mg;c.fillRect(mx-420,my-420,840,840);c.save();c.shadowColor="rgba(220,246,244,0.9)";c.shadowBlur=30;c.fillStyle="rgb(222,242,238)";c.beginPath();c.arc(mx,my,30,0,TAU);c.fill();c.restore();
    c.fillStyle="rgba(150,190,190,0.35)";for(const [dx,dy,r] of [[-9,-6,6],[8,7,4],[4,-12,3]]){c.beginPath();c.arc(mx+dx,my+dy,r,0,TAU);c.fill();}}
  const R=ag_rnd(911);for(let i=0;i<70;i++){const x=R()*W,y=R()*hz*0.7,r=0.6+R()*1.6;c.fillStyle="rgba(200,240,240,"+(0.06+R()*0.22).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
// mist lying low: soft bands of the hall's haze
function tt_mist(c,y,h,a,x0,x1){x0=x0==null?-20:x0;x1=x1==null?W+20:x1;const g=c.createLinearGradient(0,y-h,0,y+h);g.addColorStop(0,"rgba(110,180,186,0)");g.addColorStop(0.5,"rgba(110,180,186,"+a+")");g.addColorStop(1,"rgba(110,180,186,0)");
  c.fillStyle=g;c.fillRect(x0,y-h,x1-x0,2*h);}

/* ---------------------------------------------------------------- a tree of the rainforest
   A tall straight trunk, flared into buttresses at its foot, branching high into a broad crown of many soft clusters of leaves; the moon
   (up and to the right) lights the crown's tops and the trunk's right edge. x, y its foot, h its height, k its depth (0 near, 2 far) */
function tt_tree(c,x,y,h,k,R){const leaf=TT_LEAF[k],trunk=TT_TRUNK[k],w=h*0.026,top=y-h*0.72,rim=[150,214,214],ra=[0.34,0.24,0.14][k];
  // the trunk, a little bent, its buttresses
  c.fillStyle=rgba(trunk,1);c.beginPath();c.moveTo(x-w*3.2,y);c.bezierCurveTo(x-w*1.4,y-h*0.03,x-w*1.1,y-h*0.08,x-w,y-h*0.14);c.lineTo(x-w*0.7+h*0.01,top);
  c.lineTo(x+w*0.7+h*0.01,top);c.lineTo(x+w,y-h*0.14);c.bezierCurveTo(x+w*1.1,y-h*0.08,x+w*1.4,y-h*0.03,x+w*3.4,y);c.closePath();c.fill();
  c.fillStyle=rgba(mix(trunk,rim,0.35),0.5);c.fillRect(x+w*0.55,top,w*0.3,y-top-h*0.1);
  // branches up into the crown
  c.strokeStyle=rgba(trunk,1);c.lineCap="round";for(const [dx,dy,lw] of [[-0.16,-0.12,0.5],[0.18,-0.1,0.5],[-0.06,-0.2,0.4],[0.08,-0.19,0.4]]){c.lineWidth=w*lw*2;
    c.beginPath();c.moveTo(x+h*0.01,top+h*0.02);c.quadraticCurveTo(x+h*dx*0.5,top+h*dy*0.3,x+h*dx,top+h*dy);c.stroke();}
  // the crown: soft clusters, darker underneath, their tops lit
  const n=11+Math.floor(R()*5),cw=h*0.24,ch=h*0.09,cy=top-h*0.12;const bl=[];
  for(let i=0;i<n;i++){const u=(i/(n-1))*2-1,bx=x+u*cw*(0.9+R()*0.2),by=cy+Math.abs(u)*ch*0.9-(R()*0.6+0.4)*ch*(1-u*u)+R()*ch*0.4,r=h*(0.045+R()*0.035);bl.push([bx,by,r]);}
  c.fillStyle=rgba(leaf,1);for(const [bx,by,r] of bl){c.beginPath();c.ellipse(bx,by,r*1.35,r,0,0,TAU);c.fill();}
  c.fillStyle=rgba(mix(leaf,[0,0,0],0.28),1);for(const [bx,by,r] of bl){c.beginPath();c.ellipse(bx,by+r*0.45,r*1.2,r*0.55,0,0,TAU);c.fill();}
  for(const [bx,by,r] of bl){const g=c.createRadialGradient(bx+r*0.5,by-r*0.6,0,bx+r*0.5,by-r*0.6,r*1.3);g.addColorStop(0,rgba(rim,ra));g.addColorStop(1,rgba(rim,0));c.fillStyle=g;
    c.beginPath();c.ellipse(bx,by,r*1.35,r,0,0,TAU);c.fill();}}
// a low tree or shrub of the forest's lower layers: a short trunk and a round head of leaves
function tt_shrub(c,x,y,r,k,R){const leaf=TT_LEAF[k],rim=[150,214,214];c.fillStyle=rgba(TT_TRUNK[k],1);c.fillRect(x-r*0.06,y-r*0.9,r*0.12,r*0.9);
  for(let i=0;i<5;i++){const bx=x+(R()-0.5)*r*1.3,by=y-r*1.1-R()*r*0.6,rr_=r*(0.4+R()*0.3);c.fillStyle=rgba(leaf,1);c.beginPath();c.ellipse(bx,by,rr_*1.3,rr_,0,0,TAU);c.fill();
    const g=c.createRadialGradient(bx+rr_*0.4,by-rr_*0.5,0,bx+rr_*0.4,by-rr_*0.5,rr_*1.2);g.addColorStop(0,rgba(rim,0.16));g.addColorStop(1,rgba(rim,0));c.fillStyle=g;c.beginPath();c.ellipse(bx,by,rr_*1.3,rr_,0,0,TAU);c.fill();}}
// a stump: its dark side, and its cut face lit pale by the moon, with rings
function tt_stump(c,x,y,r){c.fillStyle=rgba(TT_TRUNK[1],1);c.beginPath();c.moveTo(x-r*1.25,y+r*0.25);c.lineTo(x-r,y-r*0.9);c.lineTo(x+r,y-r*0.9);c.lineTo(x+r*1.3,y+r*0.25);c.closePath();c.fill();
  c.fillStyle=rgba(mix(TT_WOOD,[40,60,62],0.25),1);c.beginPath();c.ellipse(x,y-r*0.9,r,r*0.32,0,0,TAU);c.fill();
  c.strokeStyle=rgba(mix(TT_WOOD,[30,40,40],0.55),0.8);c.lineWidth=1;for(const k of [0.65,0.35]){c.beginPath();c.ellipse(x,y-r*0.9,r*k,r*0.32*k,0,0,TAU);c.stroke();}
  c.fillStyle=rgba(DP.ice,0.18);c.fillRect(x+r*0.55,y-r*0.85,r*0.25,r*0.95);}
// a felled trunk lying on the slope, from a (its cut end) to b (its broken top), its top edge lit
function tt_log(c,a,b,r){const an=Math.atan2(b[1]-a[1],b[0]-a[0]),L=Math.hypot(b[0]-a[0],b[1]-a[1]);c.save();c.translate(a[0],a[1]);c.rotate(an);
  c.fillStyle=rgba(TT_TRUNK[1],1);c.beginPath();c.moveTo(0,-r);c.lineTo(L,-r*0.55);c.lineTo(L+r*0.3,0);c.lineTo(L,r*0.55);c.lineTo(0,r);c.closePath();c.fill();
  c.fillStyle=rgba(mix(TT_TRUNK[1],[150,214,214],0.4),0.55);c.beginPath();c.moveTo(0,-r);c.lineTo(L,-r*0.55);c.lineTo(L,-r*0.35);c.lineTo(0,-r*0.6);c.closePath();c.fill();
  c.restore();c.fillStyle=rgba(mix(TT_WOOD,[40,60,62],0.2),1);c.beginPath();c.ellipse(a[0],a[1],r*0.36,r,an,0,TAU);c.fill();
  c.strokeStyle=rgba(mix(TT_WOOD,[30,40,40],0.5),0.8);c.lineWidth=1;c.beginPath();c.ellipse(a[0],a[1],r*0.2,r*0.56,an,0,TAU);c.stroke();}

/* ---------------------------------------------------------------- the forest's edge: ttForest
   At the right, the forest cared for: three layers of tall trees with mist between them, lower trees and shrubs under them. At the
   left, the slope cut bare, rising to the frame's edge: stumps and a felled trunk on pale earth. The moon high at the right */
const TT_FOREST={hz:780,edge:820,slope:[[-20,560],[180,580],[420,640],[640,720],[860,790]]};
function tt_slopeY(x){const S=TT_FOREST.slope;for(let i=1;i<S.length;i++)if(x<=S[i][0]){const [x0,y0]=S[i-1],[x1,y1]=S[i],u=(x-x0)/(x1-x0);return lerp(y0,y1,ag_sine(u));}return S[S.length-1][1];}
function tt_paintForest(c){const F=TT_FOREST,hz=F.hz,R=ag_rnd(1993);tt_sky(c,hz,[1500,190]);
  // a far ridge, and mist along it
  c.fillStyle="rgb(16,42,46)";c.beginPath();c.moveTo(-10,hz);for(let x=-10;x<=W+10;x+=20)c.lineTo(x,612+Math.sin(x*0.004)*22+Math.sin(x*0.013+1)*9);c.lineTo(W+10,hz);c.closePath();c.fill();
  tt_mist(c,640,60,0.10);
  // the forest, far to near: each layer a little darker, mist between
  for(let x=760;x<W+120;x+=86+R()*40)tt_tree(c,x,hz+6,330+R()*110,2,R);
  tt_mist(c,700,70,0.10,640);
  for(let x=820;x<W+150;x+=150+R()*70)tt_tree(c,x,hz+30,470+R()*130,1,R);
  tt_mist(c,750,60,0.08,700);
  // the ground: dark under the trees, the slope's pale earth to the left
  let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(14,36,39)");g.addColorStop(1,"rgb(7,20,23)");c.fillStyle=g;c.fillRect(0,hz-6,W,H-hz+6);
  c.save();c.beginPath();c.moveTo(-20,H);for(const [x,y] of F.slope)c.lineTo(x,y);c.bezierCurveTo(900,800,930,900,1010,H);c.closePath();
  g=c.createLinearGradient(0,560,0,H);g.addColorStop(0,rgba(mix(TT_EARTH,[150,200,200],0.22),1));g.addColorStop(0.45,rgba(TT_EARTH,1));g.addColorStop(1,"rgb(20,24,24)");c.fillStyle=g;c.fill();c.clip();
  // where the forest's shade falls on the bare earth, towards its edge
  g=c.createLinearGradient(700,0,1000,0);g.addColorStop(0,"rgba(10,26,29,0)");g.addColorStop(1,"rgba(10,26,29,0.85)");c.fillStyle=g;c.fillRect(700,560,320,H-560);
  // the earth's furrows, where trunks were dragged out, and the slope's moonlit crest
  c.strokeStyle="rgba(20,30,30,0.5)";c.lineWidth=2;for(let i=0;i<16;i++){const x0=R()*900,y0=tt_slopeY(x0)+20+R()*240;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(x0+90,y0+18,x0+200+R()*120,y0+30+R()*30);c.stroke();}
  c.restore();
  c.save();c.strokeStyle="rgba(190,236,232,0.45)";c.lineWidth=2;c.shadowColor="rgba(190,236,232,0.7)";c.shadowBlur=6;c.beginPath();F.slope.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.restore();
  // what was left: branches where the trunks were dragged off, stumps, felled trunks, a broken one standing
  c.save();c.strokeStyle=rgba(mix(TT_TRUNK[1],[0,0,0],0.2),0.9);c.lineCap="round";for(let i=0;i<26;i++){const x0=R()*820,y0=tt_slopeY(x0)+30+R()*300,an=(R()-0.5)*1.2,L=30+R()*70;
    c.lineWidth=2+R()*3;c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+Math.cos(an)*L,y0+Math.sin(an)*L*0.4);c.moveTo(x0+Math.cos(an)*L*0.5,y0+Math.sin(an)*L*0.2);c.lineTo(x0+Math.cos(an)*L*0.5+14,y0+Math.sin(an)*L*0.2-12);c.stroke();}c.restore();
  for(const [x,r] of [[90,20],[210,26],[330,18],[470,28],[600,20],[700,22],[300,16],[540,16],[150,14]]){const y=tt_slopeY(x)+(x===300||x===540||x===150?130:46)+r;tt_stump(c,x,y,r);}
  tt_log(c,[150,742],[560,690],15);tt_log(c,[420,860],[760,900],12);
  c.fillStyle=rgba(TT_TRUNK[1],1);c.beginPath();c.moveTo(752,tt_slopeY(752)+40);c.lineTo(758,520);c.lineTo(770,500);c.lineTo(776,540);c.lineTo(784,tt_slopeY(784)+40);c.closePath();c.fill();
  // the forest's edge, nearest: tall trees, lower ones and shrubs under them, the darkest layer
  for(let x=880;x<W+120;x+=110+R()*60)tt_shrub(c,x,hz+40+R()*30,60+R()*40,0,R);
  for(const [x,y,r] of [[880,880,46],[930,960,58],[985,1060,64]])tt_shrub(c,x,y,r,0,R);
  for(const [x,h] of [[930,560],[1130,640],[1400,600],[1660,680],[1880,620]])tt_tree(c,x,hz+90,h,0,R);
  tt_mist(c,830,70,0.07,780);
  // the floor's gloss and a last line of haze
  g=c.createLinearGradient(0,hz+40,0,H);g.addColorStop(0,"rgba(80,160,170,0.06)");g.addColorStop(1,"rgba(80,160,170,0)");c.fillStyle=g;c.fillRect(0,hz+40,W,H-hz-40);}
AG_PLACES.ttForest=c=>tt_paintForest(c);

/* ---------------------------------------------------------------- the planks: two the same, from two forests
   Two sawn planks seen from above, side by side, the same grain, the same light; nothing on them says where they grew */
function tt_plank(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.shadowOffsetY=8;const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(TT_WOOD,[255,240,220],0.12),1));
  g.addColorStop(1,rgba(mix(TT_WOOD,[40,50,50],0.35),1));ctx.fillStyle=g;rr(ctx,x,y,w,h,4);ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,4);ctx.clip();ctx.strokeStyle=rgba(mix(TT_WOOD,[50,40,30],0.5),0.55);ctx.lineWidth=1.6;
  for(let i=0;i<7;i++){const yy=y+h*(0.12+i*0.13);ctx.beginPath();ctx.moveTo(x-10,yy);for(let k=0;k<=24;k++){const xx=x+k*w/24;ctx.lineTo(xx,yy+Math.sin(k*0.7+i*1.3)*h*0.05+(i===3?Math.sin(k*0.35)*h*0.12:0));}ctx.stroke();}
  ctx.beginPath();ctx.ellipse(x+w*0.62,y+h*0.48,w*0.03,h*0.16,0,0,TAU);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba(DP.ice,0.55);ctx.fillRect(x+4,y,w-8,1.6);ctx.restore();}

/* ---------------------------------------------------------------- the chain: ttChain
   One road at night, and four stations along it, each lit by its own lamp: the forest's log pile, the sawmill (a roof on posts, its
   round saw, planks stacked), the workshop (a bench, a chair being made, the bin where planks are mixed) and the shop (a window of
   clear glass, a chair in it). TT_ST: each station's middle, where its tick is drawn; TT_ROAD the road's line */
const TT_ST=[[330,600],[760,420],[1200,470],[1660,420]],TT_ROAD=860,TT_BIN=[1385,800],TT_CHAIR=[1660,800];
// a chair, seen a little from the front and the side: its seat, four legs, the back's two uprights, a top rail and three spindles; x, y
// where it stands, s its size (about 240 px tall at 1); o.frame draws it unfinished, as on the bench (no rail, no spindles)
function tt_chair(c,x,y,s,o){o=o||{};const wood=mix(TT_WOOD,[40,60,62],0.3),dark=mix(wood,[8,20,24],0.45),lit=mix(wood,[220,245,240],0.35),P=(u,v)=>[x+u*s,y+v*s];
  const FL=P(-46,-92),FR=P(38,-96),BR=P(58,-122),BL=P(-24,-118),TL=P(-18,-236),TR=P(64,-242);
  const line=(a,b,w,col)=>{c.strokeStyle=rgba(col,1);c.lineWidth=w*s;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};c.save();c.lineCap="round";c.lineJoin="round";
  // the back legs, behind the seat, and the back's uprights above it
  line(BL,P(-22,-24),7,dark);line(BR,P(58,-30),7,dark);line(BL,TL,7,wood);line(BR,TR,7,wood);
  if(!o.frame){for(const u of [0.27,0.5,0.73]){const b0=[lerp(BL[0],BR[0],u),lerp(BL[1],BR[1],u)],t0=[lerp(TL[0],TR[0],u),lerp(TL[1],TR[1],u)+10*s];line(b0,t0,4.5,wood);}
    c.fillStyle=rgba(wood,1);c.beginPath();c.moveTo(TL[0]-4*s,TL[1]+4*s);c.quadraticCurveTo((TL[0]+TR[0])/2,TL[1]-16*s,TR[0]+5*s,TR[1]+2*s);c.lineTo(TR[0]+4*s,TR[1]+22*s);
    c.quadraticCurveTo((TL[0]+TR[0])/2,TL[1]+6*s,TL[0]-4*s,TL[1]+26*s);c.closePath();c.fill();
    c.strokeStyle=rgba(lit,0.8);c.lineWidth=1.6;c.beginPath();c.moveTo(TL[0]-4*s,TL[1]+4*s);c.quadraticCurveTo((TL[0]+TR[0])/2,TL[1]-16*s,TR[0]+5*s,TR[1]+2*s);c.stroke();}
  // the seat, its front edge lit by the moon, and the front legs with a rail between them
  c.fillStyle=rgba(wood,1);c.beginPath();c.moveTo(...FL);c.lineTo(...FR);c.lineTo(...BR);c.lineTo(...BL);c.closePath();c.fill();
  c.fillStyle=rgba(dark,1);c.beginPath();c.moveTo(...FL);c.lineTo(...FR);c.lineTo(FR[0],FR[1]+10*s);c.lineTo(FL[0],FL[1]+10*s);c.closePath();c.fill();
  line(FL,P(-44,0),8,wood);line(FR,P(36,-4),8,wood);line(P(-45,-40),P(37,-42),5,dark);
  c.strokeStyle=rgba(lit,0.85);c.lineWidth=1.6;c.beginPath();c.moveTo(...FL);c.lineTo(...FR);c.lineTo(...BR);c.stroke();c.restore();}
// a lamp hanging from a roof at top: its cord, a small shade, the warm bulb, and its pool of light on the road
function tt_lamp(c,x,y,top){const g=c.createRadialGradient(x,TT_ROAD-60,0,x,TT_ROAD-60,300);g.addColorStop(0,"rgba(255,214,160,0.12)");g.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=g;c.fillRect(x-300,TT_ROAD-360,600,600);
  const cone=c.createLinearGradient(0,y,0,TT_ROAD);cone.addColorStop(0,"rgba(255,220,170,0.10)");cone.addColorStop(1,"rgba(255,220,170,0)");c.fillStyle=cone;c.beginPath();c.moveTo(x-14,y);c.lineTo(x+14,y);c.lineTo(x+170,TT_ROAD);c.lineTo(x-170,TT_ROAD);c.closePath();c.fill();
  c.strokeStyle="rgba(190,236,232,0.45)";c.lineWidth=1.4;c.beginPath();c.moveTo(x,top);c.lineTo(x,y-10);c.stroke();
  c.fillStyle="rgb(30,60,64)";c.beginPath();c.moveTo(x-6,y-12);c.lineTo(x+6,y-12);c.lineTo(x+16,y);c.lineTo(x-16,y);c.closePath();c.fill();
  c.save();c.shadowColor="rgba(255,214,160,0.9)";c.shadowBlur=18;c.fillStyle="rgb(255,226,186)";c.beginPath();c.arc(x,y+3,5,0,TAU);c.fill();c.restore();}
// the forest's log pile: logs lying end on, their bark bodies running back into the dark, their cut ends towards us, lit by the moon
function tt_logPile(c,cx,by){const r=23,ends=[];for(const [row,n] of [[0,4],[1,3],[2,2],[3,1]])for(let i=0;i<n;i++)ends.push([cx+(i-(n-1)/2)*2*r+row*2,by-r-row*r*1.72]);
  for(const [x,y] of ends){c.fillStyle=rgba(TT_TRUNK[1],1);c.beginPath();c.moveTo(x,y-r);c.lineTo(x-84,y-r-14);c.lineTo(x-84,y+r-14);c.lineTo(x,y+r);c.closePath();c.fill();
    c.fillStyle=rgba(mix(TT_TRUNK[1],[150,214,214],0.3),0.45);c.beginPath();c.moveTo(x,y-r);c.lineTo(x-84,y-r-14);c.lineTo(x-84,y-r-10);c.lineTo(x,y-r+4);c.closePath();c.fill();}
  for(const [x,y] of ends){c.fillStyle=rgba(mix(TT_TRUNK[1],[0,0,0],0.2),1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    c.fillStyle=rgba(mix(TT_WOOD,[40,60,62],0.18),1);c.beginPath();c.arc(x,y,r-4,0,TAU);c.fill();
    c.strokeStyle=rgba(mix(TT_WOOD,[30,40,40],0.5),0.75);c.lineWidth=1;for(const k of [0.62,0.3]){c.beginPath();c.arc(x+1,y+1,(r-4)*k,0,TAU);c.stroke();}
    c.fillStyle="rgba(220,246,244,0.18)";c.beginPath();c.arc(x+5,y-6,(r-4)*0.6,Math.PI*1.1,Math.PI*1.9);c.lineTo(x,y);c.closePath();c.fill();}}
function tt_paintChain(c){const hz=700,R=ag_rnd(2004);tt_sky(c,hz,[1700,150]);
  c.fillStyle="rgb(16,42,46)";c.beginPath();c.moveTo(-10,hz);for(let x=-10;x<=W+10;x+=20)c.lineTo(x,600+Math.sin(x*0.003+2)*18);c.lineTo(W+10,hz);c.closePath();c.fill();tt_mist(c,640,50,0.08);
  let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(15,40,44)");g.addColorStop(1,"rgb(7,20,23)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // the road, its two edges running from the forest to the shop
  c.fillStyle="rgba(120,170,170,0.08)";c.fillRect(0,TT_ROAD-24,W,48);c.fillStyle="rgba(190,236,232,0.28)";c.fillRect(0,TT_ROAD-24,W,1.6);c.fillRect(0,TT_ROAD+24,W,1.6);
  // 1 · the forest: trees behind its log pile, in the moon's light only
  g=c.createRadialGradient(300,TT_ROAD-60,0,300,TT_ROAD-60,320);g.addColorStop(0,"rgba(190,236,232,0.08)");g.addColorStop(1,"rgba(190,236,232,0)");c.fillStyle=g;c.fillRect(-20,TT_ROAD-380,640,640);
  for(const [x,h] of [[60,470],[210,540],[400,500],[530,430]])tt_tree(c,x,hz+60,h,1,R);
  for(let x=20;x<580;x+=70)tt_shrub(c,x,hz+70,44,0,R);
  tt_logPile(c,330,836);
  // 2 · the sawmill: a roof on four posts, a lamp under it, a round saw on its bench, planks stacked
  tt_lamp(c,760,520,476);
  c.fillStyle="rgb(18,44,48)";for(const x of [612,700,820,908])c.fillRect(x-5,520,10,312);
  c.strokeStyle="rgba(190,236,232,0.5)";c.lineWidth=3;c.lineJoin="round";c.beginPath();c.moveTo(590,526);c.lineTo(760,470);c.lineTo(930,526);c.stroke();
  c.fillStyle="rgb(24,54,58)";c.fillRect(620,740,140,14);for(const x of [630,740])c.fillRect(x,754,10,78);
  c.save();c.translate(690,712);c.strokeStyle="rgba(190,236,232,0.6)";c.lineWidth=2;c.beginPath();
  for(let i=0;i<=48;i++){const an=i/48*TAU,r=i%2?26:32;i?c.lineTo(Math.cos(an)*r,Math.sin(an)*r):c.moveTo(Math.cos(an)*r,Math.sin(an)*r);}c.closePath();c.stroke();c.beginPath();c.arc(0,0,5,0,TAU);c.stroke();c.restore();
  for(let i=0;i<5;i++){const y=832-i*16;c.fillStyle=rgba(mix(TT_WOOD,[40,60,62],0.3+0.06*i),1);c.fillRect(780,y-14,140,14);c.fillStyle=rgba(TT_ICE,0.25);c.fillRect(780,y-14,140,1.2);}
  // 3 · the workshop: a lean-to on two posts, a lamp under it, tools on its back wall, a bench with a chair being made, the bin of mixed planks
  c.fillStyle="rgb(17,42,46)";c.fillRect(1040,584,300,160);c.fillStyle="rgb(18,44,48)";for(const x of [1040,1334])c.fillRect(x-5,560,10,272);
  c.strokeStyle="rgba(190,236,232,0.5)";c.lineWidth=3;c.beginPath();c.moveTo(1018,568);c.lineTo(1362,544);c.stroke();
  tt_lamp(c,1200,600,556);
  c.save();c.strokeStyle="rgba(190,236,232,0.45)";c.fillStyle="rgba(190,236,232,0.10)";c.lineWidth=2;c.lineJoin="round";
  c.beginPath();c.moveTo(1066,640);c.lineTo(1146,630);c.lineTo(1146,650);c.lineTo(1066,664);c.closePath();c.fill();c.stroke();c.strokeRect(1046,636,20,30);   // a hand saw
  c.beginPath();c.moveTo(1290,620);c.lineTo(1290,690);c.stroke();c.strokeRect(1274,608,32,16);c.restore();                                                // a mallet
  c.fillStyle="rgb(24,54,58)";c.fillRect(1060,742,260,16);for(const x of [1070,1300])c.fillRect(x,758,10,74);
  tt_chair(c,1196,742,0.62,{frame:true});
  const [bx,by]=TT_BIN;for(let i=0;i<7;i++){const x=bx-46+i*15,h=40+((i*37)%30);c.fillStyle=rgba(i%2?mix(TT_WOOD,[40,60,62],0.25):mix(TT_WOOD,[30,40,44],0.6),1);c.fillRect(x,by-50-h,11,h);}
  c.fillStyle="rgb(20,48,52)";c.fillRect(bx-56,by-50,112,82);c.fillStyle="rgb(26,58,62)";c.fillRect(bx-60,by-52,120,10);c.strokeStyle="rgba(190,236,232,0.35)";c.lineWidth=1.6;c.strokeRect(bx-56,by-50,112,82);
  // 4 · the shop: a window of clear glass, a lamp inside it, a chair in it
  tt_lamp(c,1660,540,472);
  dp_wall(c,1460,470,400,362,{col:TT_ICE});tt_chair(c,TT_CHAIR[0]-6,TT_CHAIR[1]+30,1.0);
  c.fillStyle="rgba(190,236,232,0.3)";c.fillRect(1450,832,420,3);
  g=c.createLinearGradient(0,TT_ROAD,0,H);g.addColorStop(0,"rgba(80,160,170,0.05)");g.addColorStop(1,"rgba(80,160,170,0)");c.fillStyle=g;c.fillRect(0,TT_ROAD,W,H-TT_ROAD);}
AG_PLACES.ttChain=c=>tt_paintChain(c);

/* ---------------------------------------------------------------- what moves along the chain
   The claim, a slip passed from station to station (u 0 to 3 along the road, from the log pile to the shop), a tick lit at each station
   it has reached; the label on the shop's chair, the film's own plain tag */
function tt_stationX(u){const k=clamp(Math.floor(u),0,2),f=ag_sine(clamp(u-k,0,1));return lerp(TT_ST[k][0],TT_ST[k+1][0],f);}
function tt_ticks(ctx,reach,o){o=o||{};TT_ST.forEach(([x,y],k)=>{const p=clamp((reach-k)*2.5,0,1);if(p>0)dp_tick(ctx,x,y,"green",p);
  const gl=o.glow?o.glow(k):0;if(gl>0)dp_halo(ctx,x,y,90,"green",0.4*gl);});}
