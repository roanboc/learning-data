/* ===== From a branch to production: South Africa, 1993 to 1997 =====
   The opening story's places, painted once in the module's night light, and what moves in them. No one's likeness is drawn: the
   negotiators are their table, the voters small figures seen from behind as they queue up a road at dawn, the judges their bench, the
   signing a page, a pen and a seal. Places (AG_PLACES): bpTable, the negotiating table at night; bpRoad, a road up a hill at dawn,
   April 1994; bpChamber, the Constitutional Assembly's semicircle of 490 seats on the left and the Constitutional Court's bench of
   eleven chairs on the right, with room between them for the principles and the text; bpSigning, a desk under a lamp. What moves:
   the queue (bp_voters), the seats lit block by block (bp_seatsLit), the bench lit (bp_benchLit), the tablet of the 34 principles
   (bp_tablet), the new text with its ribbon and the Court's marks (bp_book), a stamp (bp_stamp), and the signing's pen and seal. */

/* ---------------------------------------------------------------- the negotiating table, 1993
   In perspective from its near end: a point at depth z (1 near, 5 far) and across X (-1 its left edge, 1 its right) is at
   x = 960 + X * 700 / z, y = 430 + 600 / z. Chairs stand outside both edges, papers and microphones before each. */
const BP_TV=[960,430,700,600];
const bp_tp=(X,z)=>[BP_TV[0]+X*BP_TV[2]/z,BP_TV[1]+BP_TV[3]/z];
AG_PLACES.bpTable=c=>{dp_paintHall(c,{seed:31,horizon:520,vx:960,lights:12,panes:5,haze:0.06,pools:[[960,900,900,0.05]]});
  const R=ag_rnd(57),Z0=1.0,Z1=5.2,P=bp_tp;
  // the chairs on the far side of each edge first (the far ones first), then the table over their seats
  const chairs=[];for(const side of [-1,1])for(let i=0;i<9;i++){const z=1.32+i*0.42;chairs.push([side,z]);}
  chairs.sort((a,b)=>b[1]-a[1]);
  const chair=(side,z)=>{const [x,y]=P(side*1.2,z),k=1/z,w=118*k,h=196*k,lean=side*10*k,sy=y-70*k;c.save();
    // an office chair turned towards the table: a padded back, a seat reaching in under the table's edge, a post and a foot
    c.fillStyle="rgb(9,16,20)";c.fillRect(x-4*k,sy,8*k,62*k);c.beginPath();c.ellipse(x,y-6*k,40*k,8*k,0,0,TAU);c.fill();
    c.fillStyle="rgb(18,30,34)";c.beginPath();c.moveTo(x-w*0.5,sy);c.lineTo(x+w*0.5,sy);c.lineTo(x+w*0.5-side*26*k,sy+16*k);c.lineTo(x-w*0.5-side*26*k,sy+16*k);c.closePath();c.fill();
    const g=c.createLinearGradient(x,sy-h,x,sy);g.addColorStop(0,"rgb(30,46,50)");g.addColorStop(1,"rgb(14,24,28)");c.fillStyle=g;
    c.beginPath();c.moveTo(x-w*0.42+lean,sy-h);c.quadraticCurveTo(x+lean,sy-h-18*k,x+w*0.42+lean,sy-h);c.quadraticCurveTo(x+w*0.5+lean*0.5,sy-h*0.5,x+w*0.44,sy-6*k);
    c.lineTo(x-w*0.44,sy-6*k);c.quadraticCurveTo(x-w*0.5+lean*0.5,sy-h*0.5,x-w*0.42+lean,sy-h);c.closePath();c.fill();
    c.strokeStyle="rgba(150,220,225,"+(0.10+0.28*k).toFixed(3)+")";c.lineWidth=Math.max(1,2.2*k);c.beginPath();c.moveTo(x-w*0.42+lean,sy-h);c.quadraticCurveTo(x+lean,sy-h-18*k,x+w*0.42+lean,sy-h);c.stroke();
    c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=Math.max(0.8,1.6*k);c.beginPath();c.moveTo(x+lean*0.6,sy-h*0.86);c.lineTo(x,sy-h*0.18);c.stroke();c.restore();};
  chairs.forEach(([s,z])=>chair(s,z));
  // the table top, dark wood with the room's cool light along it
  const q=[P(-1,Z0),P(1,Z0),P(1,Z1),P(-1,Z1)];c.save();c.beginPath();q.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();
  let g=c.createLinearGradient(0,q[2][1],0,q[0][1]);g.addColorStop(0,"rgb(22,32,36)");g.addColorStop(1,"rgb(44,52,54)");c.fillStyle=g;c.fill();c.clip();
  for(let i=0;i<5;i++){const z=1.4+i*0.85,[x,y]=P(0,z),r=260/z;const lg=c.createRadialGradient(x,y,0,x,y,r);lg.addColorStop(0,"rgba(170,230,232,0.10)");lg.addColorStop(1,"rgba(170,230,232,0)");
    c.save();c.translate(x,y);c.scale(1.6,0.45);c.translate(-x,-y);c.fillStyle=lg;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  c.restore();c.strokeStyle="rgba(170,235,235,0.32)";c.lineWidth=2;c.beginPath();c.moveTo(...q[0]);c.lineTo(...q[3]);c.moveTo(...q[1]);c.lineTo(...q[2]);c.stroke();
  // before each chair, papers (a little crooked, a few lines on them) and a microphone on a thin neck
  for(const [side,z] of chairs){const k=1/z,pts=[[-0.14,-0.07],[0.14,-0.07],[0.14,0.07],[-0.14,0.07]].map(([dx,dz])=>P(side*0.72+dx*(1+R()*0.2),z+dz*1.6));
    c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle="rgba(214,226,222,0.72)";c.fill();
    c.strokeStyle="rgba(40,54,58,0.55)";c.lineWidth=Math.max(0.8,1.6*k);for(let l=0;l<4;l++){const u=0.22+l*0.18,a=P(side*0.72-0.1,z-0.07*1.6+u*0.14*1.6),b=P(side*0.72+0.06-R()*0.06,z-0.07*1.6+u*0.14*1.6);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}c.restore();
    const [bx,by]=P(side*0.46,z+0.02),[hx,hy]=P(side*0.78,z-0.05);c.save();c.strokeStyle="rgb(16,24,28)";c.lineWidth=Math.max(1.2,4*k);c.lineCap="round";
    c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx,by-110*k,hx,hy-96*k);c.stroke();c.fillStyle="rgb(20,30,34)";c.beginPath();c.ellipse(bx,by,16*k,6*k,0,0,TAU);c.fill();
    c.fillStyle="rgb(30,42,46)";c.beginPath();c.ellipse(hx,hy-96*k,9*k,6*k,side*0.5,0,TAU);c.fill();c.fillStyle="rgba(255,206,150,0.75)";c.beginPath();c.arc(bx+side*5*k,by-3*k,Math.max(1,2.4*k),0,TAU);c.fill();c.restore();}};

/* ---------------------------------------------------------------- the road at dawn, April 1994
   A road winds up a gentle hill to a hall with a lit door, where the votes are cast; the queue stands along it, live (bp_voters). */
const BP_ROAD=[640,1110,770,830,1180,640,1424,560];   // the road's middle line, a cubic, from the foot of the frame to the hall
AG_PLACES.bpRoad=c=>{const w=W,h=H;let g=c.createLinearGradient(0,0,0,640);g.addColorStop(0,"rgb(6,17,23)");g.addColorStop(0.45,"rgb(12,34,42)");g.addColorStop(0.78,"rgb(40,60,64)");g.addColorStop(1,"rgb(116,96,80)");
  c.fillStyle=g;c.fillRect(0,0,w,660);
  // first light, low on the right, behind the hill
  const sg=c.createRadialGradient(1560,610,0,1560,610,620);sg.addColorStop(0,"rgba(255,196,140,0.34)");sg.addColorStop(0.5,"rgba(220,150,110,0.10)");sg.addColorStop(1,"rgba(220,150,110,0)");c.fillStyle=sg;c.fillRect(800,0,1120,700);
  const R=ag_rnd(9);for(let i=0;i<70;i++){const x=R()*w,y=R()*360,r=0.6+R()*1.6;c.fillStyle="rgba(200,236,236,"+((0.04+R()*0.16)*(1-y/420)).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // a far ridge in the haze, then the hill the road climbs
  c.fillStyle="rgb(34,50,54)";c.beginPath();c.moveTo(0,640);c.bezierCurveTo(420,600,820,586,1180,598);c.bezierCurveTo(1480,606,1720,590,1920,600);c.lineTo(1920,700);c.lineTo(0,700);c.closePath();c.fill();
  g=c.createLinearGradient(0,540,0,h);g.addColorStop(0,"rgb(22,40,40)");g.addColorStop(1,"rgb(7,18,20)");c.fillStyle=g;
  c.beginPath();c.moveTo(0,720);c.bezierCurveTo(500,690,1000,600,1380,556);c.bezierCurveTo(1520,544,1700,560,1920,610);c.lineTo(1920,h);c.lineTo(0,h);c.closePath();c.fill();
  c.strokeStyle="rgba(255,206,160,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(980,612);c.bezierCurveTo(1160,584,1300,560,1380,556);c.bezierCurveTo(1520,544,1700,560,1920,610);c.stroke();
  // the road: a pale band of dust, wide at our feet, narrow at the top
  c.save();const N=60,L=[],Rr=[];for(let i=0;i<=N;i++){const u=i/N,[x,y]=ag_bz(BP_ROAD,u),[x2,y2]=ag_bz(BP_ROAD,Math.min(1,u+0.01)),d=Math.hypot(x2-x,y2-y)||1,hw=lerp(330,14,Math.pow(u,0.7));
    L.push([x-(y2-y)/d*hw*0.0+(-hw),y]);Rr.push([x+hw,y]);}
  c.beginPath();L.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));for(let i=N;i>=0;i--)c.lineTo(Rr[i][0],Rr[i][1]);c.closePath();
  g=c.createLinearGradient(0,560,0,h);g.addColorStop(0,"rgb(92,88,80)");g.addColorStop(1,"rgb(48,50,48)");c.fillStyle=g;c.fill();c.restore();
  // a fence along the road's far side, and three trees on the hill
  c.strokeStyle="rgba(10,20,22,0.85)";for(let i=0;i<22;i++){const u=0.06+i*0.042,[x,y]=ag_bz(BP_ROAD,u),hw=lerp(330,14,Math.pow(u,0.7)),k=1-u*0.9;c.lineWidth=Math.max(1,4*k);c.beginPath();c.moveTo(x+hw*1.25,y);c.lineTo(x+hw*1.25,y-60*k);c.stroke();}
  for(const [tx,ty,s] of [[250,700,1.1],[700,672,0.8],[1730,566,0.55]]){c.fillStyle="rgb(8,18,20)";c.fillRect(tx-4*s,ty-70*s,8*s,72*s);
    for(const [dx,dy,r] of [[0,-96,58],[-46,-80,40],[44,-84,44],[-18,-118,36],[26,-120,34]]){c.beginPath();c.ellipse(tx+dx*s,ty+dy*s,r*s*1.2,r*s*0.6,0,0,TAU);c.fill();}}
  // the hall at the top: a low building with a lit door and windows
  c.fillStyle="rgb(26,34,36)";c.fillRect(1356,512,170,46);c.fillStyle="rgb(18,26,28)";c.beginPath();c.moveTo(1346,514);c.lineTo(1441,490);c.lineTo(1536,514);c.closePath();c.fill();
  const lg=c.createRadialGradient(1440,540,0,1440,540,150);lg.addColorStop(0,"rgba(255,214,160,0.32)");lg.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=lg;c.fillRect(1290,390,300,300);
  c.fillStyle="rgb(255,214,160)";c.fillRect(1430,528,18,30);c.fillRect(1376,526,14,10);c.fillRect(1490,526,14,10);};
// one voter, from behind: feet at (x, y), h tall; v their clothes and stance (seeded), light the dawn's rim on their right
function bp_voter(ctx,x,y,h,v,sway){const k=h/180,hw=v.wide*k;ctx.save();ctx.translate(x+sway*k,y);
  const coat=rgba(v.col,1),dark=rgba(mix(v.col,[0,0,0],0.45),1),skin=rgba(v.skin,1);
  // legs or a skirt, the coat or dress over them, arms down at the sides, the head, and what's on it
  ctx.fillStyle=dark;if(v.skirt){ctx.beginPath();ctx.moveTo(-hw*0.62,-74*k);ctx.lineTo(hw*0.62,-74*k);ctx.lineTo(hw*0.5,-18*k);ctx.lineTo(-hw*0.5,-18*k);ctx.closePath();ctx.fill();ctx.fillRect(-12*k,-18*k,7*k,18*k);ctx.fillRect(5*k,-18*k,7*k,18*k);}
  else{ctx.fillRect(-14*k,-70*k,12*k,70*k);ctx.fillRect(2*k,-70*k,12*k,70*k);}
  ctx.fillStyle=coat;ctx.beginPath();ctx.moveTo(-hw*0.5,-140*k);ctx.quadraticCurveTo(-hw*0.62,-144*k,-hw*0.66,-128*k);ctx.lineTo(-hw*0.6,(v.long?-36:-66)*k);ctx.lineTo(hw*0.6,(v.long?-36:-66)*k);ctx.lineTo(hw*0.66,-128*k);ctx.quadraticCurveTo(hw*0.62,-144*k,hw*0.5,-140*k);ctx.closePath();ctx.fill();
  ctx.fillStyle=skin;ctx.fillRect(-5*k,-148*k,10*k,8*k);ctx.fillStyle=rgba(v.hair,1);ctx.beginPath();ctx.ellipse(0,-158*k,13*k,16*k,0,0,TAU);ctx.fill();
  if(v.hat==="brim"){ctx.fillStyle=dark;ctx.beginPath();ctx.ellipse(0,-168*k,22*k,5*k,0,0,TAU);ctx.fill();ctx.fillRect(-12*k,-182*k,24*k,14*k);}
  else if(v.hat==="scarf"){ctx.fillStyle=rgba(v.scarf,1);ctx.beginPath();ctx.ellipse(0,-164*k,16*k,14*k,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(4*k,-176*k,14*k,8*k,0.3,0,TAU);ctx.fill();}
  else if(v.hat==="cap"){ctx.fillStyle=dark;ctx.beginPath();ctx.ellipse(0,-168*k,14*k,9*k,0,Math.PI,TAU);ctx.fill();}
  if(v.stick){ctx.strokeStyle=dark;ctx.lineWidth=Math.max(1,3*k);ctx.beginPath();ctx.moveTo(hw*0.62,-92*k);ctx.lineTo(hw*0.8,0);ctx.stroke();}
  // the first light on their right side and the top of their shoulders
  ctx.strokeStyle="rgba(255,206,160,"+(0.25+0.3*Math.min(1,k)).toFixed(3)+")";ctx.lineWidth=Math.max(0.8,2*k);ctx.beginPath();ctx.moveTo(hw*0.5,-140*k);ctx.quadraticCurveTo(hw*0.62,-144*k,hw*0.66,-128*k);ctx.lineTo(hw*0.6,(v.long?-36:-66)*k);ctx.stroke();
  ctx.restore();}
// the queue along the road, from our feet to the hall: about 70 people of every age, moving up slowly
const BP_QUEUE=(()=>{const R=ag_rnd(1994),Q=[],cols=[[92,70,58],[60,66,78],[110,90,70],[74,58,62],[84,86,80],[54,48,46],[120,104,88],[66,76,70]],
    skins=[[96,64,46],[120,82,58],[84,56,40],[140,100,76],[160,120,96]],hairs=[[22,18,18],[30,24,22],[40,32,28],[150,146,140],[60,48,40]],scarves=[[140,96,70],[96,110,120],[150,130,100]];
  let u=0.10;while(u<0.97){const r=R();Q.push({u,wide:lerp(46,64,R()),col:cols[(R()*cols.length)|0],skin:skins[(R()*skins.length)|0],hair:hairs[R()<0.86?((R()*3)|0):3+((R()*2)|0)],
      skirt:r<0.45,long:R()<0.4,hat:R()<0.18?"brim":R()<0.3?"scarf":R()<0.2?"cap":null,scarf:scarves[(R()*3)|0],stick:R()<0.07,tall:lerp(0.86,1.08,R()),ph:R()*TAU});
    u+=lerp(0.026,0.006,u)*lerp(0.8,1.25,R());}return Q;})();
function bp_voters(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  // the far ones first, so the near ones stand in front of them
  for(let i=BP_QUEUE.length-1;i>=0;i--){const v=BP_QUEUE[i],u=Math.min(0.985,v.u+0.0010*t),[x,y]=ag_bz(BP_ROAD,u),hw=lerp(330,14,Math.pow(u,0.7)),h=lerp(250,10,Math.pow(u,0.62))*v.tall;
    bp_voter(ctx,x-hw*0.42,y,h,v,Math.sin(t*0.9+v.ph)*1.2);}
  ctx.restore();}

/* ---------------------------------------------------------------- the chamber: the Assembly's seats and the Court's bench
   490 seats on eight curved tiers round a centre at (560, 742), seen from the front and above, each held by one of the parties
   elected in April 1994, seated in blocks (no party named: the film says only that the winners hold most of them); and on the
   right, the Court's eleven high-backed chairs behind a long bench on a dais. */
const BP_PARTY=[312,99,48,14,10,5,2];
const BP_SEATS=(()=>{const cx=560,cy=742,rows=[],S=[];let tot=0;for(let k=0;k<8;k++){const rx=176+k*47;rows.push(rx);tot+=rx;}
  let n=0;rows.forEach((rx,k)=>{const m=k<7?Math.round(490*rx/tot):490-n;n+=m;for(let i=0;i<m;i++){const th=Math.PI*(1.06+0.88*(i+0.5)/m);S.push({x:cx+Math.cos(th)*rx,y:cy+Math.sin(th)*rx*0.47,th,k});}});
  S.sort((a,b)=>a.th-b.th);let p=0,c=0;S.forEach(s=>{if(c>=BP_PARTY[p]){p++;c=0;}s.p=p;c++;});return S;})();
// each block's shade, lit: the largest a warm ice, the others quieter, none of the module's meaning colours
const BP_SHADE=[[236,232,214],[150,178,192],[196,176,140],[176,190,170],[200,200,204],[170,160,150],[190,186,176]];
const BP_BENCH={x0:1290,x1:1830,y:556,chairs:11};
AG_PLACES.bpChamber=c=>{dp_paintHall(c,{seed:44,horizon:600,vx:1000,lights:10,panes:5,haze:0.06,pools:[[560,780,560,0.10],[1560,720,480,0.08]]});
  // the tiers, dark steps with the room's light along their edges, and every seat, unlit
  for(let k=7;k>=0;k--){const rx=176+k*47+24,ry=rx*0.47;c.save();c.strokeStyle="rgba(14,30,34,0.95)";c.lineWidth=34;c.beginPath();c.ellipse(560,742,rx-24,(rx-24)*0.47,0,Math.PI*1.03,Math.PI*1.97);c.stroke();
    c.strokeStyle="rgba(150,220,225,0.10)";c.lineWidth=1.4;c.beginPath();c.ellipse(560,742,rx,ry,0,Math.PI*1.03,Math.PI*1.97);c.stroke();c.restore();}
  c.fillStyle="rgba(120,150,156,0.38)";for(const s of BP_SEATS){rr(c,s.x-5,s.y-4,10,8,3);c.fill();}
  // the speaker's table in the middle of the floor
  c.fillStyle="rgb(18,32,36)";rr(c,500,700,120,30,6);c.fill();c.strokeStyle="rgba(150,220,225,0.25)";c.lineWidth=1.4;rr(c,500,700,120,30,6);c.stroke();
  // the bench: eleven high-backed chairs behind a long desk on a dais
  const B=BP_BENCH,cw=(B.x1-B.x0)/B.chairs;c.fillStyle="rgb(14,26,30)";c.fillRect(B.x0-30,B.y+64,B.x1-B.x0+60,40);
  for(let i=0;i<B.chairs;i++){const x=B.x0+cw*(i+0.5),hw=cw*0.36,top=B.y-128;const g=c.createLinearGradient(x-hw,0,x+hw,0);g.addColorStop(0,"rgb(26,40,44)");g.addColorStop(0.5,"rgb(38,54,58)");g.addColorStop(1,"rgb(20,32,36)");c.fillStyle=g;
    c.beginPath();c.moveTo(x-hw,B.y);c.lineTo(x-hw,top+26);c.quadraticCurveTo(x-hw,top,x,top-4);c.quadraticCurveTo(x+hw,top,x+hw,top+26);c.lineTo(x+hw,B.y);c.closePath();c.fill();
    c.strokeStyle="rgba(150,220,225,0.26)";c.lineWidth=1.6;c.beginPath();c.moveTo(x-hw,top+26);c.quadraticCurveTo(x-hw,top,x,top-4);c.quadraticCurveTo(x+hw,top,x+hw,top+26);c.stroke();
    c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=1.2;for(const dy of [30,62,94]){c.beginPath();c.moveTo(x-hw+5,top+dy);c.lineTo(x+hw-5,top+dy);c.stroke();}}
  const dg=c.createLinearGradient(0,B.y,0,B.y+64);dg.addColorStop(0,"rgb(40,52,54)");dg.addColorStop(1,"rgb(20,30,32)");c.fillStyle=dg;c.fillRect(B.x0-16,B.y,B.x1-B.x0+32,64);
  c.fillStyle="rgba(170,235,235,0.30)";c.fillRect(B.x0-16,B.y,B.x1-B.x0+32,2);};
// the seats lit: o.blocks [a for each block], o.all (every seat in one light: the Assembly sitting together), o.boost [a for each block]
function bp_seatsLit(ctx,o){o=o||{};const bl=o.blocks||[],all=o.all||0,bo=o.boost||[];ctx.save();ctx.globalCompositeOperation="lighter";
  for(const s of BP_SEATS){const a=Math.max(bl[s.p]||0,all),b=bo[s.p]||0;if(a<=0.01)continue;const col=mix(BP_SHADE[s.p],[236,240,232],all*0.85);
    ctx.fillStyle=rgba(col,Math.min(1,0.75*a+0.25*b));rr(ctx,s.x-5,s.y-4,10,8,3);ctx.fill();}
  ctx.restore();
  // a soft glow over a block when it's spoken of
  bo.forEach((b,p)=>{if(!(b>0))return;const S=BP_SEATS.filter(s=>s.p===p);const mx=S.reduce((q,s)=>q+s.x,0)/S.length,my=S.reduce((q,s)=>q+s.y,0)/S.length;dp_halo(ctx,mx,my,p?160:300,[236,232,214],0.10*b);});}
// the bench lit, as the Court sits: a light over the chairs and the desk
function bp_benchLit(ctx,a){if(a<=0)return;const B=BP_BENCH;dp_halo(ctx,(B.x0+B.x1)/2,B.y-30,420,[200,240,240],0.16*a);
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(200,245,245,0.55)";ctx.fillRect(B.x0-16,B.y,B.x1-B.x0+32,2.4);ctx.restore();}

/* ---------------------------------------------------------------- the principles, the text, the marks and the stamps */
// the tablet of the 34 principles: frosted glass, 34 short lines in two columns; o.lit [a, b] brightens the first line of each
// column, o.title its title on it; returns where those two lines are, for their labels
const BP_LINES=(()=>{const R=ag_rnd(34);return Array.from({length:34},()=>0.45+R()*0.5);})();
function bp_tablet(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=560,h=420;if(a<=0)return null;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,behind:o.behind,glowR:40});
  dp_T(ctx,"34 Constitutional Principles",x+w/2,y+58,{w:700,size:32,align:"center"});
  const lit=o.lit||[0,0],spots=[];
  for(let i=0;i<34;i++){const col=i<17?0:1,row=i%17,lx=x+40+col*250,ly=y+96+row*17,lw=200*BP_LINES[i],L=(i===0?lit[0]:i===17?lit[1]:0);
    ctx.fillStyle=rgba(mix([160,196,200],[246,251,251],L),0.42+0.5*L);rr(ctx,lx,ly,lw,6,3);ctx.fill();if(i===0||i===17)spots.push([lx+lw,ly+3]);}
  ctx.restore();return spots;}
/* the new text, bound, upright (260 x 340, its top left at x, y): its cover, its title, its cyan ribbon; o.marks: nine values (-1 coral,
   0 none, 1 green, between them they turn) for the Court's marks down its edge; o.glow light on its cover; o.closed (1) or open (0) */
function bp_book(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=260,h=340;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  // the marks first, behind the cover's edge, each a small tab sticking out
  (o.marks||[]).forEach((m,i)=>{if(!m)return;const ty=y+36+i*32,col=m<0?mix(DP.F.coral,DP.F.green,0):mix(DP.F.coral,DP.F.green,clamp(m,0,1)),u=Math.min(1,Math.abs(m)*3);
    ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;rr(ctx,x+w-12,ty,12+30*ag_eo(u),20,5);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.restore();});
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=30;ctx.shadowOffsetY=10;rr(ctx,x,y,w,h,10);const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,"rgb(30,58,62)");g.addColorStop(1,"rgb(14,32,36)");ctx.fillStyle=g;ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fillRect(x+18,y,6,h);
  rr(ctx,x+34,y+18,w-52,h-36,6);ctx.strokeStyle="rgba(200,235,232,0.35)";ctx.lineWidth=1.6;ctx.stroke();
  if(o.glow>0){ctx.save();rr(ctx,x,y,w,h,10);ctx.clip();const lg=ctx.createLinearGradient(x,y,x+w,y+h);lg.addColorStop(0,"rgba(230,250,250,0)");lg.addColorStop(clamp(o.glow,0.01,0.99),"rgba(230,250,250,0.32)");lg.addColorStop(1,"rgba(230,250,250,0)");ctx.fillStyle=lg;ctx.fillRect(x,y,w,h);ctx.restore();}
  dp_T(ctx,"The new",x+w/2+8,y+120,{w:700,size:34,align:"center"});dp_T(ctx,"text",x+w/2+8,y+164,{w:700,size:34,align:"center"});
  // the ribbon, cyan, from the top of the pages to below the cover
  const rc=DP.F.cyan;ctx.save();ctx.shadowColor=rgba(rc,0.8);ctx.shadowBlur=12;ctx.fillStyle=rgba(rc,1);ctx.beginPath();ctx.moveTo(x+w-70,y+h-6);ctx.lineTo(x+w-52,y+h-6);ctx.lineTo(x+w-52,y+h+46);ctx.lineTo(x+w-61,y+h+36);ctx.lineTo(x+w-70,y+h+46);ctx.closePath();ctx.fill();ctx.restore();
  ctx.restore();}
// the text open at its last page, on the desk (its middle at x, y): two pages of lines, the signature's line; o.close (0 open, 1 shut)
function bp_openBook(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const cl=ag_sine(o.close||0),pw=300,ph=380;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=36;ctx.shadowOffsetY=12;ctx.fillStyle="rgb(16,34,38)";rr(ctx,x-pw-14,y-ph/2-10,pw*2+28,ph+20,12);ctx.fill();ctx.restore();
  const page=(px,lines,sig)=>{const g=ctx.createLinearGradient(px,0,px+pw,0);g.addColorStop(0,"rgb(212,218,208)");g.addColorStop(1,"rgb(232,234,224)");ctx.fillStyle=g;ctx.fillRect(px,y-ph/2,pw,ph);
    ctx.fillStyle="rgba(40,50,52,0.45)";const R=ag_rnd(px|0);for(let i=0;i<lines;i++)ctx.fillRect(px+30,y-ph/2+40+i*22,(pw-60)*(0.55+R()*0.45),5);
    if(sig){ctx.fillStyle="rgba(40,50,52,0.6)";ctx.fillRect(px+40,y+ph/2-70,pw-80,2);}};
  page(x-pw,14,false);
  // the right-hand page closes over the left, turning about the spine
  ctx.save();ctx.translate(x,0);ctx.scale(1-2*cl,1);ctx.translate(-x,0);if(cl<0.5)page(x,9,true);else{ctx.fillStyle="rgb(22,46,50)";ctx.fillRect(x,y-ph/2,pw,ph);}ctx.restore();
  ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x-3,y-ph/2,6,ph);ctx.restore();}
// a stamp: solid colour, dark words, a little turned; k springs it down from a little larger
function bp_stamp(ctx,x,y,text,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);
  if(o.k!=null){const s=lerp(1.35,1,clamp(o.k,0,1.2));ctx.scale(s,s);}dp_pill(ctx,0,0,text,col,{size:o.size||32,align:"center",glow:24});ctx.restore();}
// a fountain pen and the gold seal beside the signed page
function bp_pen(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(-0.5);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=12;ctx.shadowOffsetY=6;
  const g=ctx.createLinearGradient(0,-8,0,8);g.addColorStop(0,"rgb(60,70,72)");g.addColorStop(0.5,"rgb(18,24,26)");g.addColorStop(1,"rgb(8,12,14)");ctx.fillStyle=g;rr(ctx,-110,-8,190,16,8);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle="rgb(214,180,96)";ctx.fillRect(40,-8,6,16);ctx.beginPath();ctx.moveTo(80,-6);ctx.lineTo(112,0);ctx.lineTo(80,6);ctx.closePath();ctx.fill();ctx.restore();}
function bp_goldSeal(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor="rgba(255,204,92,0.55)";ctx.shadowBlur=22;
  const g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);g.addColorStop(0,"rgb(255,232,150)");g.addColorStop(0.6,"rgb(232,178,60)");g.addColorStop(1,"rgb(190,140,40)");ctx.fillStyle=g;
  ctx.beginPath();for(let i=0;i<=48;i++){const th=i/48*TAU,rr2=r*(i%2?0.94:1);i?ctx.lineTo(x+Math.cos(th)*rr2,y+Math.sin(th)*rr2):ctx.moveTo(x+rr2,y);}ctx.closePath();ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle="rgba(150,100,24,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r*0.7,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(x,y,r*0.5,0,TAU);ctx.stroke();ctx.restore();}
// the desk where the text is signed, seen from above at night: dark wood with its grain, a leather blotter, the lamp's light pooled on it
AG_PLACES.bpSigning=c=>{let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,"rgb(40,32,26)");g.addColorStop(1,"rgb(22,18,16)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(1996);c.lineWidth=1.4;for(let i=0;i<70;i++){const y=R()*H,a=0.03+R()*0.05;c.strokeStyle="rgba("+(R()<0.5?"0,0,0":"120,96,72")+","+a.toFixed(3)+")";c.beginPath();c.moveTo(0,y);
    c.bezierCurveTo(500,y+(R()-0.5)*30,1300,y+(R()-0.5)*30,W,y+(R()-0.5)*20);c.stroke();}
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=30;rr(c,520,230,880,620,16);c.fillStyle="rgb(20,40,42)";c.fill();c.restore();
  rr(c,536,246,848,588,10);c.strokeStyle="rgba(200,236,232,0.12)";c.lineWidth=2;c.stroke();
  const lg=c.createRadialGradient(560,300,0,700,420,980);lg.addColorStop(0,"rgba(255,220,170,0.30)");lg.addColorStop(0.5,"rgba(255,210,160,0.10)");lg.addColorStop(1,"rgba(255,210,160,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);
  const vg=c.createRadialGradient(960,540,500,960,540,1250);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=vg;c.fillRect(0,0,W,H);};
