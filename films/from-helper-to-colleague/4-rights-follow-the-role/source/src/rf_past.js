/* ===== Rights follow the role: the hospitals of the 1950s and 1960s =====
   Painted full-frame in the module's matte way, in a palette of their own: the pale green walls hospitals painted then, white enamel,
   brown and clear glass, a linoleum floor, daylight from tall windows on the right. Three places:
     rfWard   a long ward of the late 1950s, seen down its length: iron beds along the left wall, tall windows on the right, and near
              us, on the left wall, the ward's medicine cabinet (its stock);
     rfStock  that cabinet, close and square on: shelves of big bottles for every patient on the ward, and the counter under it, where a
              nurse pours each dose into a small paper cup;
     rfPharm  the hospital pharmacy at Little Rock, early in the 1960s: the pharmacy's shelves, its counter, and a cart of drawers, one
              for each patient's bed, drawn live, so a drawer can open and fill.
   The people are nobody in particular, dressed for their time: a ward nurse in a white uniform and a starched cap; a pharmacist in a
   white jacket; a nurse at Little Rock. No hospital's name, sign or crest is drawn, and nothing is a copy of a photograph.
   Everything here starts rf_ / RF_. */

const RFW={wall:[196,212,198],wallLt:[220,230,216],dado:[160,182,166],rail:[232,236,226],floor:[178,170,156],floorDk:[132,124,112],
  enamel:[236,236,230],enamelDk:[186,188,182],steel:[198,204,204],glass:[214,226,226],brown:[120,74,40],brownDk:[74,44,24],
  clear:[204,220,222],green:[92,128,104],label:[238,230,206],sheet:[242,242,238],blanket:[196,206,214],iron:[226,228,224],
  cream:[230,220,196],creamLt:[244,236,214],wood:[150,110,74],woodDk:[104,74,48],paper:[248,246,238],ink:[52,50,58],
  light:[255,248,226]};
const RF_TAG_50="United States · late 1950s",RF_TAG_60="Little Rock, Arkansas · early 1960s",RF_TAG_US="United States · 1960s to 1990";
// a tag in the corner, as the module's films put the place and the years
function rf_corner(ctx,s,a){if(a<=0)return;const w=ag_tw(ctx,s,{w:700,size:28,ls:2})+56;ag_box(ctx,64,64,w,58,29,{a});
  ag_T(ctx,s,92,103,{w:700,size:28,ls:2,col:AG.kick,a});}

/* ---------------------------------------------------------------- the ward, down its length (one-point perspective, metres) */
const RF_K={f:900,hz:430,vx:1060,eye:1.6};
const rf_P=(x,y,z)=>[RF_K.vx+RF_K.f*x/z,RF_K.hz-RF_K.f*(y-RF_K.eye)/z];
function rf_poly(c,pts,fill){c.fillStyle=fill;c.beginPath();pts.forEach((p,i)=>{const q=rf_P(p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();c.fill();}
function rf_gradP(c,p,q,stops){const a=rf_P(...p),b=rf_P(...q),g=c.createLinearGradient(a[0],a[1],b[0],b[1]);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;}
const RF_WD={l:-3.0,r:4.0,h:3.6,z0:1.0,z1:22,beds:[5.6,7.8,10.0,12.2,14.4,16.6,18.8],cab:[2.7,4.3]};
function rf_glow(c,x,y,rx,ry,a,col){const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,rgba(col||RFW.light,a));g.addColorStop(1,rgba(col||RFW.light,0));
  c.save();c.translate(x,y);c.scale(rx,ry);c.fillStyle=g;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore();}
// a bed against the left wall at depth z: an iron frame, a white sheet, a pale blanket over someone, a pillow by the wall
function rf_bed(c,z,o){const L=RF_WD.l,x1=L+2.05,w=0.95,h=0.62,z0=z-w/2,z1=z+w/2;
  ag_floorShadow(c,...rf_P(L+1.1,0,z+0.1),900*1.3/z,900*0.22/z,0.22);
  // legs and the frame's side towards us
  c.strokeStyle=rgba(ag_dk(RFW.iron,0.25),1);c.lineWidth=Math.max(1,900*0.035/z);c.lineCap="round";c.beginPath();
  for(const [x,zz] of [[x1,z0],[x1,z1],[L+0.1,z0]]){const a=rf_P(x,0,zz),b=rf_P(x,h,zz);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}c.stroke();
  // the mattress: its top and its side towards the aisle
  rf_poly(c,[[L,h,z0],[x1,h,z0],[x1,h,z1],[L,h,z1]],rgba(RFW.sheet,1));
  rf_poly(c,[[x1,h,z0],[x1,h-0.2,z0],[x1,h-0.2,z1],[x1,h,z1]],rgba(ag_dk(RFW.sheet,0.08),1));
  rf_poly(c,[[L,h,z0],[x1,h,z0],[x1,h-0.2,z0],[L,h-0.2,z0]],rgba(ag_dk(RFW.sheet,0.16),1));
  // the blanket over someone lying there, a soft hump, and the turned-down sheet
  const p=n=>rf_P(...n);c.fillStyle=rgba(RFW.blanket,1);c.beginPath();let q=p([L+0.62,h+0.02,z0+0.08]);c.moveTo(q[0],q[1]);
  for(let i=0;i<=10;i++){const u=i/10,x=lerp(L+0.62,x1,u),hy=h+0.06+0.2*Math.sin(Math.PI*Math.min(1,u*1.25));q=p([x,hy,z0+0.08]);c.lineTo(q[0],q[1]);}
  q=p([x1,h+0.02,z1-0.08]);c.lineTo(q[0],q[1]);q=p([L+0.62,h+0.02,z1-0.08]);c.lineTo(q[0],q[1]);c.closePath();c.fill();
  c.fillStyle=rgba(ag_dk(RFW.blanket,0.12),1);c.beginPath();q=p([x1,h+0.02,z0+0.06]);c.moveTo(q[0],q[1]);q=p([x1,h+0.06,z1-0.06]);c.lineTo(q[0],q[1]);
  q=p([x1,h-0.16,z1-0.06]);c.lineTo(q[0],q[1]);q=p([x1,h-0.16,z0+0.06]);c.lineTo(q[0],q[1]);c.closePath();c.fill();
  rf_poly(c,[[L+0.56,h+0.03,z0+0.06],[L+0.7,h+0.05,z0+0.06],[L+0.7,h+0.05,z1-0.06],[L+0.56,h+0.03,z1-0.06]],rgba(RFW.sheet,1));
  // the pillow, and the iron head rail against the wall
  rf_poly(c,[[L+0.08,h+0.04,z0+0.12],[L+0.5,h+0.1,z0+0.12],[L+0.5,h+0.1,z1-0.12],[L+0.08,h+0.04,z1-0.12]],rgba(ag_lt(RFW.sheet,0.4),1));
  c.strokeStyle=rgba(RFW.iron,1);c.lineWidth=Math.max(1,900*0.03/z);c.beginPath();
  for(const zz of [z0,z1]){const a=rf_P(L+0.04,0,zz),b=rf_P(L+0.04,1.12,zz);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
  {const a=rf_P(L+0.04,1.1,z0),b=rf_P(L+0.04,1.1,z1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
  for(const yy of [0.72,0.9]){const a=rf_P(L+0.04,yy,z0),b=rf_P(L+0.04,yy,z1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}c.stroke();
  // the foot rail
  c.beginPath();{const a=rf_P(x1,0.62,z0),b=rf_P(x1,0.92,z0),d=rf_P(x1,0.92,z1),e=rf_P(x1,0.62,z1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);}c.stroke();}
// where each bed's pillow is in the wide view
function rf_bedPoints(){return RF_WD.beds.map(z=>rf_P(RF_WD.l+1.4,0.86,z));}
function rf_paintWard(c){const R=RF_WD,{l:L,r:Rr,h:Hh,z0,z1}=R;
  // the back wall, the ceiling, the floor and the two side walls
  rf_poly(c,[[L,0,z1],[Rr,0,z1],[Rr,Hh,z1],[L,Hh,z1]],rgba(ag_lt(RFW.wall,0.12),1));
  rf_poly(c,[[L,Hh,z0],[Rr,Hh,z0],[Rr,Hh,z1],[L,Hh,z1]],rf_gradP(c,[0,Hh,z0+0.5],[0,Hh,z1],[[0,rgba(ag_dk(RFW.wallLt,0.08),1)],[1,rgba(RFW.wallLt,1)]]));
  rf_poly(c,[[L,0,z0],[Rr,0,z0],[Rr,0,z1],[L,0,z1]],rf_gradP(c,[0,0,z0+0.3],[0,0,z1],[[0,rgba(RFW.floorDk,1)],[0.5,rgba(RFW.floor,1)],[1,rgba(ag_lt(RFW.floor,0.2),1)]]));
  // linoleum tiles, in a light grid, fading far off
  c.save();c.strokeStyle="rgba(80,72,60,0.12)";c.lineWidth=1.2;c.beginPath();for(let x=L;x<=Rr;x+=0.5){const a=rf_P(x,0,z0),b=rf_P(x,0,z1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
  for(let z=z0+0.5;z<z1;z+=0.5){const a=rf_P(L,0,z),b=rf_P(Rr,0,z);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}c.stroke();c.restore();
  rf_poly(c,[[L,0,z0],[L,Hh,z0],[L,Hh,z1],[L,0,z1]],rf_gradP(c,[L,1.6,z0],[L,1.6,z1],[[0,rgba(ag_dk(RFW.wall,0.12),1)],[1,rgba(ag_lt(RFW.wall,0.18),1)]]));
  rf_poly(c,[[L,0,z0],[L,1.0,z0],[L,1.0,z1],[L,0,z1]],rf_gradP(c,[L,0.5,z0],[L,0.5,z1],[[0,rgba(ag_dk(RFW.dado,0.12),1)],[1,rgba(ag_lt(RFW.dado,0.1),1)]]));
  rf_poly(c,[[L,1.0,z0],[L,1.06,z0],[L,1.06,z1],[L,1.0,z1]],rgba(RFW.rail,1));
  rf_poly(c,[[Rr,0,z0],[Rr,Hh,z0],[Rr,Hh,z1],[Rr,0,z1]],rf_gradP(c,[Rr,1.6,z0],[Rr,1.6,z1],[[0,rgba(ag_lt(RFW.wall,0.06),1)],[1,rgba(ag_lt(RFW.wall,0.2),1)]]));
  rf_poly(c,[[Rr,0,z0],[Rr,1.0,z0],[Rr,1.0,z1],[Rr,0,z1]],rgba(RFW.dado,1));
  rf_poly(c,[[Rr,1.0,z0],[Rr,1.06,z0],[Rr,1.06,z1],[Rr,1.0,z1]],rgba(RFW.rail,1));
  // tall windows down the right-hand wall, bright, with their light on the floor
  for(let z=2.6;z<z1-1;z+=2.2){const a=z,b=z+1.2;
    rf_poly(c,[[Rr,1.15,a],[Rr,3.15,a],[Rr,3.15,b],[Rr,1.15,b]],rf_gradP(c,[Rr,1.15,a],[Rr,3.15,a],[[0,rgba([236,240,232],1)],[1,rgba([250,250,244],1)]]));
    c.strokeStyle=rgba(ag_lt(RFW.rail,0.3),0.9);c.lineWidth=Math.max(1,900*0.05/z);c.beginPath();
    for(const yy of [1.82,2.48]){const p=rf_P(Rr,yy,a),q=rf_P(Rr,yy,b);c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);}
    {const p=rf_P(Rr,1.15,(a+b)/2),q=rf_P(Rr,3.15,(a+b)/2);c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);}c.stroke();
    // the light they let in, across the floor towards the beds
    c.save();c.globalAlpha=0.16;rf_poly(c,[[Rr,0,a],[Rr,0,b],[Rr-2.6,0,b+0.5],[Rr-2.6,0,a+0.5]],rgba(RFW.light,1));c.restore();}
  // lights hanging from the ceiling, white globes
  for(let z=3.4;z<z1-1;z+=3.3){const p=rf_P(0.5,3.0,z),q=rf_P(0.5,Hh,z),r=900*0.16/z;c.strokeStyle="rgba(90,90,84,0.5)";c.lineWidth=Math.max(1,900*0.012/z);
    c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(p[0],p[1]-r);c.stroke();rf_glow(c,p[0],p[1],r*3.2,r*2.6,0.3);
    const g=c.createRadialGradient(p[0]-r*0.3,p[1]-r*0.3,r*0.1,p[0],p[1],r);g.addColorStop(0,"rgba(255,255,250,1)");g.addColorStop(1,"rgba(224,226,216,1)");c.fillStyle=g;c.beginPath();c.arc(p[0],p[1],r,0,TAU);c.fill();}
  // the beds, far ones first
  for(let i=R.beds.length-1;i>=0;i--)rf_bed(c,R.beds[i]);
  // the medicine cabinet on the left wall near us: its counter, its body, its shelves of bottles, its open glass doors
  const [za,zb]=R.cab,C0=L,C1=L+0.42,K0=L+0.6;
  rf_poly(c,[[C0,0,za],[K0,0,za],[K0,0.92,za],[C0,0.92,za]],rgba(ag_dk(RFW.enamel,0.14),1));
  rf_poly(c,[[K0,0,za],[K0,0.92,za],[K0,0.92,zb],[K0,0,zb]],rf_gradP(c,[K0,0.5,za],[K0,0.5,zb],[[0,rgba(ag_dk(RFW.enamel,0.06),1)],[1,rgba(RFW.enamel,1)]]));
  rf_poly(c,[[C0,0.92,za],[K0,0.92,za],[K0,0.92,zb],[C0,0.92,zb]],rgba(ag_lt(RFW.enamel,0.3),1));
  rf_poly(c,[[C0,1.16,za],[C1,1.16,za],[C1,2.36,za],[C0,2.36,za]],rgba(ag_dk(RFW.enamel,0.18),1));
  rf_poly(c,[[C1,1.16,za],[C1,2.36,za],[C1,2.36,zb],[C1,1.16,zb]],rgba(ag_dk(RFW.enamel,0.32),1));
  rf_poly(c,[[C0,1.18,za+0.05],[C1-0.02,1.18,za+0.05],[C1-0.02,2.32,zb-0.05],[C0,2.32,zb-0.05]],rgba(ag_dk(RFW.wall,0.35),1));
  for(const yy of [1.3,1.66,2.02]){rf_poly(c,[[C0,yy,za+0.05],[C1,yy,za+0.05],[C1,yy,zb-0.05],[C0,yy,zb-0.05]],rgba(ag_lt(RFW.enamel,0.2),1));
    for(let i=0;i<7;i++){const z=lerp(za+0.12,zb-0.12,i/6),b=rf_P(L+0.24,yy,z),hh=900*(0.18+0.07*((i*5+Math.round(yy*10))%3))/z,ww=hh*0.42;
      const col=[RFW.brown,RFW.clear,RFW.green][(i+Math.round(yy*3))%3];c.fillStyle=rgba(col,0.95);rr(c,b[0]-ww/2,b[1]-hh,ww,hh,ww*0.25);c.fill();
      c.fillStyle=rgba(RFW.label,0.9);c.fillRect(b[0]-ww/2,b[1]-hh*0.62,ww,hh*0.3);}}
  rf_poly(c,[[C1,1.16,za],[C1,2.36,za],[C1+0.5,2.36,za-0.2],[C1+0.5,1.16,za-0.2]],"rgba(220,232,232,0.28)");
  rf_poly(c,[[C1,1.16,zb],[C1,2.36,zb],[C1+0.5,2.36,zb+0.3],[C1+0.5,1.16,zb+0.3]],"rgba(220,232,232,0.22)");
  // the room's soft shade: darker near us and in the left corner, the daylight bright on the right
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,46,40,0.18)");g.addColorStop(0.45,"rgba(40,46,40,0)");g.addColorStop(1,"rgba(255,248,226,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(1060,460,200,1060,460,1300);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(30,34,30,0.22)");c.fillStyle=v;c.fillRect(0,0,W,H);
  ag_grain(c,0,0,W,H,1.2,31);}
AG_PLACES.rfWard=rf_paintWard;

/* ---------------------------------------------------------------- the cabinet and its counter, square on (screen px) */
const RF_CAB={x:250,y:110,w:920,h:470,shelves:[262,392,522],counter:700};
// a bottle standing on y, h tall: brown, clear or green glass, its shoulder, neck and cap, and a paper label
function rf_bottle(c,x,y,h,kind,o){o=o||{};const col=kind==="brown"?RFW.brown:kind==="green"?RFW.green:RFW.clear,w=h*(o.wide||0.46),nw=w*0.42,sh=h*0.72;
  c.save();if(o.a!=null)c.globalAlpha*=o.a;
  const body=cc=>{cc.moveTo(x-w/2,y);cc.lineTo(x-w/2,y-sh+w*0.18);cc.quadraticCurveTo(x-w/2,y-sh,x-nw/2,y-sh-h*0.06);cc.lineTo(x-nw/2,y-h*0.92);
    cc.lineTo(x+nw/2,y-h*0.92);cc.lineTo(x+nw/2,y-sh-h*0.06);cc.quadraticCurveTo(x+w/2,y-sh,x+w/2,y-sh+w*0.18);cc.lineTo(x+w/2,y);cc.closePath();};
  ag_soft(c,body,col,ag_lt(col,0.45),x+w*0.25,y-sh*0.7,h*0.55,kind==="clear"?null:rgba(ag_dk(col,0.6),0.45),Math.max(4,h*0.08));
  if(kind==="clear"){c.save();ag_shape(c,body);c.clip();c.fillStyle=rgba([196,150,96],0.35);c.fillRect(x-w/2,y-sh*0.62,w,sh*0.62);c.restore();
    c.strokeStyle=rgba([120,140,140],0.55);c.lineWidth=Math.max(1,h*0.012);ag_shape(c,body);c.stroke();}
  c.fillStyle=rgba(ag_dk(RFW.ink,0.1),0.9);rr(c,x-nw/2-h*0.02,y-h,nw+h*0.04,h*0.1,h*0.02);c.fill();
  c.fillStyle=rgba(RFW.label,0.95);c.fillRect(x-w/2+h*0.015,y-sh*0.62,w-h*0.03,sh*0.36);
  c.fillStyle=rgba(RFW.ink,0.35);for(const u of [0.36,0.5])c.fillRect(x-w*0.3,y-sh*(0.62-u*0.36*0+0.0)+sh*0.36*u-sh*0.06,w*0.6,Math.max(1,h*0.018));
  c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(x+w*0.18,y-sh*0.9,w*0.07,sh*0.8);c.restore();}
// the cabinet's bottles: each shelf's row, the same in every frame
const RF_ROWS=(()=>{const R=ag_rnd(57),rows=[];for(let s=0;s<3;s++){const row=[];let x=RF_CAB.x+42;while(x<RF_CAB.x+RF_CAB.w-50){const h=70+R()*44,k=["brown","clear","green","brown","clear"][Math.floor(R()*5)],wd=0.4+R()*0.18;
  row.push({x:x+h*wd/2,h,k,wd});x+=h*wd+10+R()*8;}rows.push(row);}return rows;})();
function rf_paintStock(c){const K=RF_CAB;
  // the wall: hospital green above a darker dado, lit from the right
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(ag_dk(RFW.wall,0.1),1));g.addColorStop(1,rgba(ag_lt(RFW.wall,0.16),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba(RFW.dado,1);c.fillRect(0,760,W,H-760);c.fillStyle=rgba(RFW.rail,1);c.fillRect(0,748,W,14);
  ag_grain(c,0,0,W,H,1.4,23);
  // the counter: a white enamel top and front, its kick in shade
  ag_floorShadow(c,K.x+K.w/2,K.counter+30,K.w*0.62,40,0.18);
  ag_soft(c,cc=>cc.rect(K.x-60,K.counter,K.w+120,H-K.counter),RFW.enamel,[255,255,255],K.x+K.w,K.counter+60,600,"rgba(60,60,50,0.28)",30);
  c.fillStyle=rgba(ag_lt(RFW.enamel,0.4),1);c.fillRect(K.x-70,K.counter-14,K.w+140,18);c.fillStyle="rgba(60,60,50,0.18)";c.fillRect(K.x-70,K.counter+4,K.w+140,4);
  // the cabinet: a white enamel body, its inside in shade, three glass shelves of bottles, its doors open
  ag_floorShadow(c,K.x+K.w/2-10,K.y+K.h+16,K.w*0.55,22,0.22);
  ag_soft(c,cc=>ag_rect(cc,K.x-24,K.y-24,K.w+48,K.h+48,8),RFW.enamel,[255,255,255],K.x+K.w,K.y,700,"rgba(60,60,50,0.22)",18);
  g=c.createLinearGradient(0,K.y,0,K.y+K.h);g.addColorStop(0,rgba(ag_dk(RFW.wall,0.32),1));g.addColorStop(1,rgba(ag_dk(RFW.wall,0.18),1));c.fillStyle=g;c.fillRect(K.x,K.y,K.w,K.h);
  ag_inner(c,cc=>cc.rect(K.x,K.y,K.w,K.h),"rgba(20,24,20,0.5)",26,-6,8);
  K.shelves.forEach((sy,i)=>{for(const b of RF_ROWS[i])rf_bottle(c,b.x,sy,b.h,b.k,{wide:b.wd});
    c.fillStyle="rgba(230,238,236,0.55)";c.fillRect(K.x,sy,K.w,8);c.fillStyle="rgba(40,46,44,0.18)";c.fillRect(K.x,sy+8,K.w,6);});
  for(const [x0,x1] of [[K.x-24,K.x-130],[K.x+K.w+24,K.x+K.w+120]]){c.fillStyle="rgba(214,228,228,0.3)";c.beginPath();c.moveTo(x0,K.y-20);c.lineTo(x1,K.y+6);c.lineTo(x1,K.y+K.h-6);c.lineTo(x0,K.y+K.h+20);c.closePath();c.fill();
    c.strokeStyle=rgba(RFW.enamel,1);c.lineWidth=7;c.stroke();}
  // on the counter: a tray of small paper cups, a spoon, a glass of water
  ag_soft(c,cc=>ag_rect(cc,K.x+90,K.counter-46,420,40,8),RFW.steel,[255,255,255],K.x+400,K.counter-46,300,"rgba(40,40,40,0.25)",8);
  for(let i=0;i<6;i++){const x=K.x+130+i*64,y=K.counter-44;c.fillStyle=rgba(RFW.paper,1);c.beginPath();c.moveTo(x-20,y-34);c.lineTo(x+20,y-34);c.lineTo(x+14,y);c.lineTo(x-14,y);c.closePath();c.fill();
    c.strokeStyle="rgba(120,110,90,0.4)";c.lineWidth=1.5;c.stroke();for(let k=-12;k<=12;k+=6){c.beginPath();c.moveTo(x+k,y-33);c.lineTo(x+k*0.7,y-1);c.stroke();}}
  rf_bottle(c,K.x+700,K.counter-8,90,"clear",{wide:0.7});
  // daylight from the right, and the room's shade on the left
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,36,30,0.2)");g.addColorStop(0.55,"rgba(30,36,30,0)");g.addColorStop(1,"rgba(255,248,226,0.14)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.rfStock=rf_paintStock;

/* ---------------------------------------------------------------- the pharmacy at Little Rock, square on */
const RF_PH={counter:690,cart:{x:1290,y:300,w:520,cols:3,rows:4}};
function rf_paintPharm(c){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(ag_dk(RFW.cream,0.1),1));g.addColorStop(1,rgba(ag_lt(RFW.cream,0.2),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_grain(c,0,0,W,H,1.4,29);
  // the pharmacy's tall wooden shelves, behind the counter, with their own stock in neat rows
  const S0=110,S1=1180;ag_soft(c,cc=>cc.rect(S0-20,90,S1-S0+40,RF_PH.counter-90),RFW.wood,ag_lt(RFW.wood,0.3),S1,120,700,"rgba(40,26,14,0.4)",22);
  const R=ag_rnd(91);for(let s=0;s<4;s++){const sy=210+s*128;c.fillStyle=rgba(ag_dk(RFW.wood,0.35),1);c.fillRect(S0,sy-112,S1-S0,112);
    let x=S0+30;while(x<S1-40){const h=60+R()*34,k=["brown","clear","brown","green"][Math.floor(R()*4)],wd=0.42+R()*0.12;rf_bottle(c,x+h*wd/2,sy,h,k,{wide:wd});x+=h*wd+12;}
    c.fillStyle=rgba(ag_lt(RFW.wood,0.2),1);c.fillRect(S0-10,sy,S1-S0+20,12);c.fillStyle="rgba(30,20,10,0.25)";c.fillRect(S0-10,sy+12,S1-S0+20,5);}
  // the counter: a pale top and a wooden front
  ag_soft(c,cc=>cc.rect(60,RF_PH.counter,1180,H-RF_PH.counter),RFW.wood,ag_lt(RFW.wood,0.25),1100,RF_PH.counter+40,700,"rgba(40,26,14,0.4)",30);
  c.fillStyle=rgba(RFW.creamLt,1);c.fillRect(48,RF_PH.counter-16,1204,22);c.fillStyle="rgba(40,26,14,0.22)";c.fillRect(48,RF_PH.counter+6,1204,6);
  for(let x=140;x<1200;x+=180){c.strokeStyle="rgba(40,26,14,0.2)";c.lineWidth=2;c.strokeRect(x,RF_PH.counter+50,140,300);}
  // the floor on the right, where the cart stands, and the daylight from the right
  c.fillStyle=rgba(RFW.floor,1);c.fillRect(1240,880,W-1240,H-880);c.fillStyle=rgba(RFW.rail,0.8);c.fillRect(1240,872,W-1240,8);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.2)");g.addColorStop(0.5,"rgba(40,30,20,0)");g.addColorStop(1,"rgba(255,248,226,0.16)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.rfPharm=rf_paintPharm;

/* ---------------------------------------------------------------- things drawn live */
// a single dose in its own labelled packet: a small paper envelope with a printed band, s its width
function rf_packet(c,x,y,s,o){o=o||{};const h=s*0.72;c.save();if(o.a!=null)c.globalAlpha*=o.a;c.translate(x,y);if(o.r)c.rotate(o.r);
  ag_soft(c,cc=>ag_rect(cc,-s/2,-h/2,s,h,s*0.08),RFW.paper,[255,255,255],s*0.2,-h*0.3,s,"rgba(80,70,50,0.3)",6);
  c.fillStyle=rgba(o.col||[88,120,160],0.85);c.fillRect(-s/2,-h*0.18,s,h*0.2);c.fillStyle=rgba(RFW.ink,0.45);c.fillRect(-s*0.36,h*0.14,s*0.5,Math.max(1.5,s*0.05));c.fillRect(-s*0.36,h*0.28,s*0.3,Math.max(1.5,s*0.05));
  c.restore();}
// the doctor's order: a slip of paper, its heading, handwriting, and a signature (the words are drawn at least 28 px as seen)
function rf_order(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||w*0.62;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);if(o.r)ctx.rotate(o.r);
  ag_box(ctx,-w/2,-h/2,w,h,8,{edge:o.edge,edgeA:o.edgeA==null?0.8:o.edgeA});if(o.copy){ctx.fillStyle="rgba(150,140,110,0.12)";ctx.fillRect(-w/2,-h/2,w,h);}
  if(!o.nowords)ag_T(ctx,o.title||"ORDER",-w/2+22,-h/2+46,{w:700,size:28,ls:2,col:o.copy?AG.amber:AG.kick});
  ctx.strokeStyle=rgba(RFW.ink,0.55);ctx.lineWidth=2.2;ctx.lineCap="round";const R=ag_rnd(o.seed||5);
  for(let i=0;i<(o.lines||3);i++){const ly=-h/2+(o.nowords?28:76)+i*28;ctx.beginPath();ctx.moveTo(-w/2+22,ly);let px=-w/2+22;
    while(px<w/2-30-(i===2?w*0.3:0)){const nx=px+10+R()*14;ctx.quadraticCurveTo((px+nx)/2,ly-6-R()*8,nx,ly);px=nx;}ctx.stroke();}
  ctx.restore();}
// the cart of drawers, one for each bed, on legs and wheels: o.open [index, 0 to 1] pulls that drawer out towards us, its tray
// showing above its front with o.fill packets in it (0 to 3, each dropping in), o.lit the drawer whose label is lit; its labels are
// drawn live, 28 px. Returns each drawer's box
function rf_cart(ctx,o){o=o||{};const C=RF_PH.cart,a=o.a==null?1:o.a;if(a<=0)return null;const dw=(C.w-40)/C.cols,dh=104,top=C.y+40,x0=C.x+20,base=top+C.rows*dh+30;
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,C.x+C.w/2,1002,C.w*0.6,26,0.3);
  // the legs, a low shelf between them, and the wheels
  for(const lx of [C.x+36,C.x+C.w-36]){ctx.fillStyle=rgba(ag_dk(RFW.steel,0.28),1);ctx.fillRect(lx-7,base-4,14,982-base);
    ctx.fillStyle="#3A3C40";ctx.beginPath();ctx.arc(lx,1000,24,0,TAU);ctx.fill();ctx.fillStyle="#9A9EA4";ctx.beginPath();ctx.arc(lx,1000,8,0,TAU);ctx.fill();}
  ctx.fillStyle=rgba(ag_dk(RFW.steel,0.12),1);ctx.fillRect(C.x+30,936,C.w-60,12);
  // the body: pale steel, and its top rail
  ag_soft(ctx,cc=>ag_rect(cc,C.x,C.y,C.w,base-C.y,12),RFW.steel,[255,255,255],C.x+C.w,C.y,600,"rgba(40,46,46,0.32)",16);
  ctx.fillStyle=rgba(ag_lt(RFW.steel,0.4),1);ctx.fillRect(C.x-10,C.y-12,C.w+20,16);
  // the drawer under an open one keeps its front, but its label goes as the open drawer's front comes down over it
  const under=o.open&&o.open[1]>0.001?o.open[0]+C.cols:-1,uA=under>=0?1-clamp(ag_sine(o.open[1])*3,0,1):1;
  const front=(dx,dy,w,h,k)=>{ag_soft(ctx,cc=>ag_rect(cc,dx,dy,w,h,6),ag_lt(RFW.steel,0.12),[255,255,255],dx+w,dy,200,"rgba(40,46,46,0.25)",8);
    ctx.fillStyle=rgba(ag_dk(RFW.steel,0.35),1);rr(ctx,dx+w/2-26,dy+h-26,52,10,5);ctx.fill();
    const lit=o.lit===k;ctx.fillStyle=lit?rgba(AG.blue,0.18):rgba(RFW.paper,1);rr(ctx,dx+14,dy+12,w-28,44,6);ctx.fill();
    const la=k===under?uA:1;if(la>0.01)ag_T(ctx,"Bed "+(k+1),dx+w/2,dy+45,{w:700,size:28,align:"center",col:lit?AG.blue:AG.ink,a:la});};
  const out=[];let k=0,op=null;
  for(let r=0;r<C.rows;r++)for(let q=0;q<C.cols;q++,k++){const dx=x0+q*dw,dy=top+r*dh,w=dw-12,h=dh-14;out.push({x:dx,y:dy,w,h,cx:dx+w/2,cy:dy+h/2});
    if(o.open&&o.open[0]===k&&o.open[1]>0.001){op={k,dx,dy,w,h};ctx.fillStyle="rgba(30,34,36,0.55)";rr(ctx,dx,dy,w,h,6);ctx.fill();}else front(dx,dy,w,h,k);}
  // the open drawer, last, over the one below it: its tray (dark inside, lit sides), the packets in it, then its front, nearer us
  if(op){const u=ag_sine(o.open[1]),L=u*88,sc=1+0.07*u,fw=op.w*sc,fh=op.h*sc,fx=op.dx+op.w/2-fw/2,fy=op.dy+L;
    ctx.save();ctx.beginPath();ctx.moveTo(op.dx+2,op.dy+2);ctx.lineTo(op.dx+op.w-2,op.dy+2);ctx.lineTo(fx+fw,fy+2);ctx.lineTo(fx,fy+2);ctx.closePath();
    ctx.fillStyle=rgba(ag_dk(RFW.steel,0.45),1);ctx.fill();ctx.clip();
    ctx.fillStyle=rgba(ag_lt(RFW.steel,0.1),0.9);ctx.beginPath();ctx.moveTo(op.dx+2,op.dy+2);ctx.lineTo(op.dx+14,op.dy+2);ctx.lineTo(fx+14,fy+2);ctx.lineTo(fx,fy+2);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(op.dx+op.w-14,op.dy+2);ctx.lineTo(op.dx+op.w-2,op.dy+2);ctx.lineTo(fx+fw,fy+2);ctx.lineTo(fx+fw-14,fy+2);ctx.closePath();ctx.fill();
    const n=o.fill||0;for(let i=0;i<3;i++){const fa=clamp(n-i,0,1);if(fa>0)rf_packet(ctx,op.dx+op.w/2+(i-1)*42,op.dy+L*0.62-(1-ag_eo(fa))*70,40,{a:clamp(fa*3,0,1),r:(i-1)*0.08});}
    ctx.restore();ctx.save();ag_about(ctx,fx+fw/2,fy+fh/2,1);front(fx,fy,fw,fh,op.k);ctx.restore();}
  ctx.restore();return out;}

// the cart drawn whole into its own picture, closed and unlit, so it comes in faded as one thing, never layer by layer
const RF_CART_BOX=[RF_PH.cart.x-40,RF_PH.cart.y-30,RF_PH.cart.x+RF_PH.cart.w+40,1040];let RF_CARTPIC=null;
function rf_cartIn(ctx,a){if(a<=0)return;const [x0,y0,x1,y1]=RF_CART_BOX,R=2;
  if(!RF_CARTPIC){RF_CARTPIC=mkCanvas(Math.ceil((x1-x0)*R),Math.ceil((y1-y0)*R));const c=RF_CARTPIC.getContext("2d");c.scale(R,R);c.translate(-x0,-y0);rf_cart(c,{});}
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(RF_CARTPIC,x0,y0,x1-x0,y1-y0);ctx.restore();}

/* ---------------------------------------------------------------- the people, dressed for their time */
// a nurse's starched white cap, on the crown, inside the head's picture
function rf_cap(c,P){const col=[248,248,244];
  ag_soft(c,cc=>{cc.moveTo(226,330);cc.bezierCurveTo(232,296,262,272,302,266);cc.bezierCurveTo(342,266,374,282,384,312);cc.bezierCurveTo(352,322,300,328,226,330);cc.closePath();},
    col,[255,255,255],340,276,120,"rgba(90,90,80,0.3)",10);
  ag_soft(c,cc=>{cc.moveTo(238,316);cc.bezierCurveTo(286,310,336,304,378,296);cc.lineTo(382,306);cc.bezierCurveTo(338,314,288,320,236,326);cc.closePath();},[44,44,50],[110,110,120],330,300,60,null);
  c.strokeStyle="rgba(150,150,140,0.5)";c.lineWidth=2;c.beginPath();c.moveTo(262,322);c.quadraticCurveTo(280,292,318,278);c.stroke();}
// a stethoscope round the neck, over the white coat
const RF_P={
  nurse:{name:"A ward nurse",key:"rf-nurse",skin:[226,188,156],hair:{style:"bun",c:[96,66,44]},top:{kind:"shirt",c:[244,243,238]},hat:{paint:rf_cap},breath:0.29},
  nurse2:{name:"A nurse at Little Rock",key:"rf-nurse2",skin:[206,160,126],hair:{style:"bun",c:[40,30,26]},top:{kind:"shirt",c:[240,242,240]},hat:{paint:rf_cap},breath:0.27},
  pharm:{name:"A pharmacist",key:"rf-pharm",skin:[218,174,138],hair:{style:"side",c:[62,48,40]},glasses:[44,44,50],top:{kind:"tunic",c:[242,242,238]},breath:0.25}};
// what the nurse holds: a brown bottle, upright in the near hand
function rf_holdBottle(c,hands){const [x,y]=hands.near;rf_bottle(c,x+26,y+6,150,"brown",{wide:0.5});}
// what the pharmacist holds: the doctor's order, a slip of paper held up a little
function rf_holdOrder(c,hands){const [x,y]=hands.near;c.save();c.translate(x+40,y-40);c.rotate(-0.08);
  ag_soft(c,cc=>ag_rect(cc,-90,-60,180,120,6),RFW.paper,[255,255,255],40,-50,200,"rgba(80,70,50,0.3)",8);
  c.strokeStyle=rgba(RFW.ink,0.5);c.lineWidth=3;c.lineCap="round";for(let i=0;i<3;i++){c.beginPath();c.moveTo(-70,-28+i*26);c.bezierCurveTo(-30,-36+i*26,10,-20+i*26,60-(i===2?50:0),-28+i*26);c.stroke();}
  c.restore();}
// what the nurse at Little Rock holds as she gives a dose: a small paper cup, a packet in it
function rf_holdCup(c,hands){const [x,y]=hands.near;c.save();c.translate(x+34,y-14);c.fillStyle=rgba(RFW.paper,1);c.beginPath();c.moveTo(-26,-40);c.lineTo(26,-40);c.lineTo(19,0);c.lineTo(-19,0);c.closePath();c.fill();
  c.strokeStyle="rgba(120,110,90,0.5)";c.lineWidth=2;c.stroke();for(let k=-14;k<=14;k+=7){c.beginPath();c.moveTo(k,-39);c.lineTo(k*0.72,-1);c.stroke();}rf_packet(c,0,-52,40,{r:0.18});c.restore();}
// what the nurse at Little Rock holds: the patient's drawer, its packets inside
function rf_holdDrawer(c,hands){const [x,y]=hands.near;c.save();c.translate(x+60,y-10);
  ag_soft(c,cc=>ag_rect(cc,-80,-30,160,60,6),ag_lt(RFW.steel,0.1),[255,255,255],60,-30,160,"rgba(40,46,46,0.3)",8);
  for(let i=0;i<3;i++)rf_packet(c,-48+i*48,-34,40,{r:(i-1)*0.07});c.restore();}
