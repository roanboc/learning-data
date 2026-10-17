/* ===== Off the shelf: the film's own pictures (prefixed os_) =====
   A market town on the same table, in its own time: a square of packed earth with a stone cross, stalls and timber-framed
   houses in 1215; its market hall in 1497, with the king's bronze standards in a cupboard behind a grille; the corn stall in
   1871, lined with bushels that don't agree; a grocer's shop in the 1880s, where the inspector checks a weight against his
   copy of the standard. Then what the chapters share: cameras that move between keys, dissolves between shots, labels and
   speech bubbles drawn after the blur, the place-and-year sign, and the title and end cards. */

// ---- the market town's buildings: timber-framed houses, a church, a stone cross ----
// a beam on a wall: from (x0,y0) to (x1,y1) on the plane z (a front) or x (a side), as a thin quad
function os_beamZ(ctx,C,x0,y0,x1,y1,z,wd,col){const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1,nx=-dy/l*wd/2,ny=dx/l*wd/2;poly3(ctx,C,[v3(x0+nx,y0+ny,z),v3(x1+nx,y1+ny,z),v3(x1-nx,y1-ny,z),v3(x0-nx,y0-ny,z)],col,{n:NRM.F});}
function os_beamX(ctx,C,z0,y0,z1,y1,x,wd,col){const dz=z1-z0,dy=y1-y0,l=Math.hypot(dz,dy)||1,nz=-dy/l*wd/2,ny=dz/l*wd/2;poly3(ctx,C,[v3(x,y0+ny,z0+nz),v3(x,y1+ny,z1+nz),v3(x,y1-ny,z1-nz),v3(x,y0-ny,z0-nz)],col,{n:NRM.R});}
// a house: plaster between oak beams, the upper floor jutting out over the street, a steep roof
function os_timber(ctx,C,x,z,w,d,o){o=o||{};const h1=o.h1||2.1,h2=o.h2||1.9,jut=0.3,pl=o.plaster||[240,228,200],tb=[92,64,44],roof=o.roof||[204,166,100];
  drawBox(ctx,C,x,0,z,w,h1,d,pl,{grad:[0.04,0.08],edge:0.3});drawBox(ctx,C,x-0.05,h1,z-jut,w+0.1,h2,d+jut,pl,{grad:[0.04,0.08],edge:0.3});
  const fz=z-0.012,uz=z-jut-0.012,seeF=visible(C,NRM.F,v3(x+w/2,1,z)),seeR=visible(C,NRM.R,v3(x+w,1,z+d/2)),seeL=visible(C,NRM.L,v3(x,1,z+d/2));
  if(seeF){const n=Math.max(2,Math.round(w/0.9));for(let i=0;i<=n;i++){const xx=x+i*w/n;os_beamZ(ctx,C,xx,0,xx,h1,fz,0.12,tb);os_beamZ(ctx,C,xx,h1,xx,h1+h2,uz,0.12,tb);}
    os_beamZ(ctx,C,x,h1-0.06,x+w,h1-0.06,fz,0.14,tb);os_beamZ(ctx,C,x-0.05,h1+0.06,x+w+0.05,h1+0.06,uz,0.16,tb);os_beamZ(ctx,C,x-0.05,h1+h2-0.06,x+w+0.05,h1+h2-0.06,uz,0.14,tb);
    for(let i=0;i<n;i+=2){const a=x+i*w/n,b=x+(i+1)*w/n;os_beamZ(ctx,C,a,h1+0.12,b,h1+h2-0.12,uz,0.1,tb);}
    // a door and a shuttered window below, small windows above
    const dx=x+w*(o.door==null?0.3:o.door);poly3(ctx,C,[v3(dx,0,fz-0.002),v3(dx+0.8,0,fz-0.002),v3(dx+0.8,1.75,fz-0.002),v3(dx,1.75,fz-0.002)],[110,76,52],{n:NRM.F,grad:[0.1,0.2]});
    const wx=x+w*0.65;poly3(ctx,C,[v3(wx,0.95,fz-0.002),v3(wx+0.7,0.95,fz-0.002),v3(wx+0.7,1.6,fz-0.002),v3(wx,1.6,fz-0.002)],[60,52,58],{n:NRM.F});
    for(const k of [0.25,0.7]){const ux=x+w*k-0.3;poly3(ctx,C,[v3(ux,h1+0.7,uz-0.002),v3(ux+0.6,h1+0.7,uz-0.002),v3(ux+0.6,h1+1.35,uz-0.002),v3(ux,h1+1.35,uz-0.002)],[70,62,70],{n:NRM.F});}}
  if(seeR||seeL){const X=seeR?x+w+0.012:x-0.012,XU=seeR?x+w+0.062:x-0.062,n=Math.max(2,Math.round(d/1.0));for(let i=0;i<=n;i++){const zz=z+i*d/n;os_beamX(ctx,C,zz,0,zz,h1,X,0.12,tb);}
    for(let i=0;i<=n;i++){const zz=z-jut+i*(d+jut)/n;os_beamX(ctx,C,zz,h1,zz,h1+h2,XU,0.12,tb);}os_beamX(ctx,C,z-jut,h1+0.06,z+d,h1+0.06,XU,0.16,tb);}
  gable(ctx,C,x-0.05,h1+h2,z-jut,w+0.1,d+jut,o.rh||2.4,roof,{wall:pl,ov:0.3});}
// a stone market cross on three steps
function os_cross(ctx,C,x,z){const st=[214,206,190];for(let i=0;i<3;i++){const r=1.1-i*0.3;drawBox(ctx,C,x-r,i*0.22,z-r,r*2,0.22,r*2,st,{grad:[0.08,0.1],edge:0.5});}
  drawBox(ctx,C,x-0.12,0.66,z-0.12,0.24,2.4,0.24,st,{grad:[0.1,0.1],edge:0.5});drawBox(ctx,C,x-0.42,2.7,z-0.08,0.84,0.18,0.16,st,{edge:0.5});drawBox(ctx,C,x-0.08,2.5,z-0.08,0.16,0.7,0.16,st,{edge:0.5});}
// a stone church, its tower, far off
function os_church(ctx,C,x,z){const st=[206,200,186];drawBox(ctx,C,x+2.6,0,z+0.5,6,4.2,4,st,{grad:[0.05,0.1],edge:0.3});gable(ctx,C,x+2.6,4.2,z+0.5,6,4,2.4,[150,140,150],{wall:st});
  drawBox(ctx,C,x,0,z,2.8,8.6,2.8,st,{grad:[0.06,0.12],edge:0.3});for(let i=0;i<4;i++)drawBox(ctx,C,x+i*0.75,8.6,z,0.4,0.45,0.4,st,{edge:0.3});
  for(const yy of [5.6,7.2])poly3(ctx,C,[v3(x+1.15,yy,z-0.01),v3(x+1.65,yy,z-0.01),v3(x+1.65,yy+0.9,z-0.01),v3(x+1.15,yy+0.9,z-0.01)],[70,66,80],{n:NRM.F});}

// ---- stalls and what's sold on them: drawn flat at a point and scaled with distance, like the figures ----
// a stall: a trestle table and a striped awning on four posts
function os_stall(ctx,C,x,z,w,d,col){const wood=[160,112,72];for(const [px,pz] of [[x,z+d],[x+w,z+d],[x,z],[x+w,z]])drawBox(ctx,C,px-0.05,0,pz-0.05,0.1,pz===z?1.9:2.3,0.1,wood,{edge:0.3});
  drawBox(ctx,C,x+0.1,0.78,z+0.05,w-0.2,0.08,d-0.1,[196,150,100],{grad:[0.1,0.1],edge:0.4});for(const [lx,lz] of [[x+0.2,z+d-0.23],[x+w-0.28,z+d-0.23],[x+0.2,z+0.15],[x+w-0.28,z+0.15]])drawBox(ctx,C,lx,0,lz,0.08,0.78,0.08,wood,{edge:0.3});
  const n=6;for(let i=0;i<n;i++){const a=x-0.1+i*(w+0.2)/n,b=a+(w+0.2)/n,c=i%2?[250,244,228]:col;poly3(ctx,C,[v3(a,1.9,z-0.25),v3(b,1.9,z-0.25),v3(b,2.32,z+d+0.1),v3(a,2.32,z+d+0.1)],c,{n:vnorm(v3(0,1,-0.35)),grad:[0.08,0.06],edge:0.3});
    poly3(ctx,C,[v3(a,1.9,z-0.25),v3(b,1.9,z-0.25),v3(b,1.72,z-0.27),v3(a,1.72,z-0.27)],c,{n:NRM.F});}}
const os_fill=(ctx,c,x0,x1,k)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(c,[255,240,210],0.3*(k||1)),1));g.addColorStop(1,rgba(mix(c,[0,0,0],0.25*(k||1)),1));ctx.fillStyle=g;ctx.fill();};
function os_barrel(ctx,C,x,z,h,y){const B=pj(C,v3(x,y||0,z));if(B.z<NEAR)return;const k=B.s*h,w=k*0.66,c=[170,118,72];ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(50,40,30,0.25)";ctx.beginPath();ctx.ellipse(0,0,w*0.62,w*0.16,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-w*0.46,0);ctx.quadraticCurveTo(-w*0.6,-k*0.5,-w*0.46,-k);ctx.lineTo(w*0.46,-k);ctx.quadraticCurveTo(w*0.6,-k*0.5,w*0.46,0);ctx.closePath();os_fill(ctx,c,-w*0.55,w*0.55);
  ctx.strokeStyle="rgba(70,60,56,0.85)";ctx.lineWidth=Math.max(1.5,k*0.05);for(const v of [0.18,0.82]){ctx.beginPath();ctx.moveTo(-w*0.52,-k*v);ctx.quadraticCurveTo(0,-k*v+k*0.04,w*0.52,-k*v);ctx.stroke();}
  ctx.fillStyle=rgba(mix(c,[255,230,200],0.2),1);ctx.beginPath();ctx.ellipse(0,-k,w*0.46,w*0.12,0,0,TAU);ctx.fill();ctx.restore();}
function os_sack(ctx,C,x,z,h){const B=pj(C,v3(x,0,z));if(B.z<NEAR)return;const k=B.s*h,c=[214,196,150];ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(50,40,30,0.22)";ctx.beginPath();ctx.ellipse(0,0,k*0.42,k*0.1,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-k*0.36,0);ctx.bezierCurveTo(-k*0.5,-k*0.5,-k*0.24,-k*0.86,-k*0.1,-k*0.9);ctx.lineTo(k*0.1,-k*0.9);ctx.bezierCurveTo(k*0.24,-k*0.86,k*0.5,-k*0.5,k*0.36,0);ctx.closePath();os_fill(ctx,c,-k*0.4,k*0.4,0.8);
  ctx.strokeStyle="rgba(120,96,60,0.8)";ctx.lineWidth=Math.max(1.5,k*0.04);ctx.beginPath();ctx.moveTo(-k*0.13,-k*0.8);ctx.lineTo(k*0.13,-k*0.8);ctx.stroke();ctx.fillStyle="rgba(232,206,120,1)";ctx.beginPath();ctx.ellipse(0,-k*0.92,k*0.12,k*0.05,0,0,TAU);ctx.fill();ctx.restore();}
// a wooden measure of corn, heaped: w is how much wider than tall it is
function os_bushel(ctx,C,x,y,z,h,w){const B=pj(C,v3(x,y,z));if(B.z<NEAR)return null;const k=B.s*h,r=k*(w||1)*0.6,c=[180,128,80];ctx.save();ctx.translate(B.x,B.y);
  ctx.fillStyle="rgba(50,40,30,0.22)";ctx.beginPath();ctx.ellipse(r*0.1,0,r*1.08,r*0.2,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(-r*1.03,-k);ctx.lineTo(r*1.03,-k);ctx.lineTo(r,0);ctx.closePath();os_fill(ctx,c,-r,r);ctx.strokeStyle="rgba(70,60,56,0.8)";ctx.lineWidth=Math.max(1.5,k*0.05);for(const v of [0.18,0.62]){ctx.beginPath();ctx.moveTo(-r*1.01,-k*v);ctx.lineTo(r*1.01,-k*v);ctx.stroke();}
  ctx.fillStyle="rgba(232,200,110,1)";ctx.beginPath();ctx.ellipse(0,-k,r*1.03,Math.max(2,r*0.22),0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(0,-k-r*0.06,r*0.8,r*0.16,0,Math.PI,TAU);ctx.fill();
  ctx.fillStyle="rgba(200,160,80,0.7)";for(let i=0;i<24;i++){ctx.beginPath();ctx.arc((hash(i,4)-0.5)*r*1.6,-k+(hash(i,5)-0.5)*r*0.26,Math.max(1,k*0.03),0,TAU);ctx.fill();}ctx.restore();return B;}
// a handcart of apples: its bed, sides, a wheel on the side towards us, two handles and a leg
function os_cart(ctx,C,x,z){const wood=[170,124,80],dk=[150,104,66];
  for(const k of [0.25,0.65])drawBox(ctx,C,x-1.1,0.5,z+k,1.2,0.05,0.05,dk,{edge:0.3});drawBox(ctx,C,x+1.25,0,z+0.12,0.06,0.44,0.06,dk,{edge:0.3});drawBox(ctx,C,x+1.25,0,z+0.72,0.06,0.44,0.06,dk,{edge:0.3});
  drawBox(ctx,C,x,0.42,z,1.5,0.1,0.9,wood,{grad:[0.1,0.1],edge:0.4});drawBox(ctx,C,x,0.52,z,1.5,0.3,0.06,dk);drawBox(ctx,C,x,0.52,z+0.84,1.5,0.3,0.06,dk);drawBox(ctx,C,x+1.44,0.52,z,0.06,0.3,0.9,dk);
  for(let i=0;i<11;i++){const p=pj(C,v3(x+0.2+(i%5)*0.26,0.86,z+0.25+Math.floor(i/5)*0.24));if(p.z<NEAR)continue;ctx.fillStyle=i%3?"#c8463a":"#d9a640";ctx.beginPath();ctx.arc(p.x,p.y,0.12*p.s,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,240,220,0.4)";ctx.beginPath();ctx.arc(p.x-0.04*p.s,p.y-0.04*p.s,0.04*p.s,0,TAU);ctx.fill();}
  // the wheel, round in the plane of the cart's side, with its spokes
  const wc=v3(x+0.7,0.34,z-0.06),ring=[];for(let i=0;i<=24;i++){const a=i/24*TAU;ring.push(pj(C,v3(wc.x+Math.cos(a)*0.34,wc.y+Math.sin(a)*0.34,wc.z)));}if(ring.some(q=>q.z<NEAR))return;
  const c=pj(C,wc);ctx.save();ctx.strokeStyle="rgba(96,66,44,1)";ctx.lineCap="round";ctx.lineWidth=Math.max(2,0.05*c.s);ctx.beginPath();ring.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();
  ctx.lineWidth=Math.max(1.5,0.025*c.s);for(let i=0;i<6;i++){const q=ring[i*4];ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(q.x,q.y);ctx.stroke();}ctx.fillStyle="rgba(96,66,44,1)";ctx.beginPath();ctx.arc(c.x,c.y,Math.max(2,0.05*c.s),0,TAU);ctx.fill();ctx.restore();}
// a glazed jug: a round belly, a narrow neck, a lip, a handle from the neck to the shoulder
function os_jug(ctx,C,x,y,z,h,c){const B=pj(C,v3(x,y,z));if(B.z<NEAR)return;const k=B.s*h;c=c||[176,120,84];ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(50,40,30,0.2)";ctx.beginPath();ctx.ellipse(k*0.05,0,k*0.3,k*0.06,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(c,[0,0,0],0.2),1);ctx.lineWidth=Math.max(1.5,k*0.07);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(k*0.12,-k*0.86);ctx.bezierCurveTo(k*0.42,-k*0.86,k*0.44,-k*0.5,k*0.26,-k*0.46);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-k*0.2,0);ctx.bezierCurveTo(-k*0.34,-k*0.1,-k*0.36,-k*0.44,-k*0.24,-k*0.6);ctx.quadraticCurveTo(-k*0.12,-k*0.74,-k*0.13,-k*0.88);ctx.lineTo(-k*0.17,-k);ctx.lineTo(k*0.17,-k);ctx.lineTo(k*0.13,-k*0.88);
  ctx.quadraticCurveTo(k*0.12,-k*0.74,k*0.24,-k*0.6);ctx.bezierCurveTo(k*0.36,-k*0.44,k*0.34,-k*0.1,k*0.2,0);ctx.closePath();os_fill(ctx,c,-k*0.34,k*0.34);
  ctx.fillStyle=rgba(mix(c,[0,0,0],0.35),1);ctx.beginPath();ctx.ellipse(0,-k,k*0.17,k*0.045,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,250,230,0.35)";ctx.beginPath();ctx.ellipse(-k*0.14,-k*0.4,k*0.04,k*0.12,0.2,0,TAU);ctx.fill();ctx.restore();}
// the king's bronze gallon, held in both hands, in the figure's units
function os_heldGallon(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+30);const w=96,h=84;
  for(const s of [-1,1]){cx.strokeStyle="rgba(150,104,44,1)";cx.lineWidth=9;cx.beginPath();cx.arc(s*w*0.54,-h*0.6,15,s>0?-1.4:Math.PI-1.7,s>0?1.4:Math.PI+1.7,s<0);cx.stroke();}
  cx.beginPath();cx.moveTo(-w/2,0);cx.lineTo(-w/2-2,-h);cx.lineTo(w/2+2,-h);cx.lineTo(w/2,0);cx.closePath();const g=cx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,"#fbe2a0");g.addColorStop(0.35,"#d8a850");g.addColorStop(1,"#8c6424");cx.fillStyle=g;cx.fill();
  cx.strokeStyle="rgba(110,76,30,0.8)";cx.lineWidth=3;for(const v of [0.12,0.88]){cx.beginPath();cx.moveTo(-w/2,-h*v);cx.lineTo(w/2,-h*v);cx.stroke();}cx.fillStyle="#6a4a20";cx.beginPath();cx.ellipse(0,-h,w/2+2,10,0,0,TAU);cx.fill();cx.restore();
  fingers(cx,P_,[[mx-w/2-6,my+4],[mx+w/2+6,my+4]]);}
// a bronze standard: a drum with two handles (the bushel, the gallon), drawn like the measures, in metal
function os_bronze(ctx,C,x,y,z,h,w){const B=pj(C,v3(x,y,z));if(B.z<NEAR)return;const k=B.s*h,r=k*w*0.5;ctx.save();ctx.translate(B.x,B.y);
  for(const s of [-1,1]){ctx.strokeStyle="rgba(150,104,44,1)";ctx.lineWidth=Math.max(2,k*0.09);ctx.beginPath();ctx.arc(s*r*1.04,-k*0.62,k*0.17,s>0?-1.4:Math.PI-1.7,s>0?1.4:Math.PI+1.7,s<0);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(-r*1.02,-k);ctx.lineTo(r*1.02,-k);ctx.lineTo(r,0);ctx.closePath();const g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,"#fbe2a0");g.addColorStop(0.35,"#d8a850");g.addColorStop(1,"#8c6424");ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(110,76,30,0.8)";ctx.lineWidth=Math.max(1.2,k*0.04);for(const v of [0.12,0.88]){ctx.beginPath();ctx.moveTo(-r*1.01,-k*v);ctx.lineTo(r*1.01,-k*v);ctx.stroke();}
  ctx.fillStyle="#6a4a20";ctx.beginPath();ctx.ellipse(0,-k,r*1.02,Math.max(2,r*0.2),0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,240,200,0.5)";ctx.fillRect(-r*0.7,-k*0.8,r*0.12,k*0.6);ctx.restore();}

// ---- the market hall, 1497: open at the front like the offices of the university, with the king's standards in a cupboard ----
const OS_HALL={id:"os_hall",name:"market hall",x:6.6,z:13.4,ang:0,w:6.4,d:3.8,open:true,wall:[244,232,206],roof:[178,98,74],band:[120,84,56],
  room:{paper:[242,232,210],stripe:[236,224,200],dado:[150,110,76],side:[236,224,200],floor:[200,190,172],plain:true,flags:true,win:[-2.5,1.25,-1.6,2.3]}};
const OS_SHOP={id:"os_shop",name:"grocer's shop",x:-4.4,z:13.4,ang:0,w:6.4,d:3.8,open:true,wall:[236,228,214],roof:[150,96,80],band:[70,96,84],
  room:{paper:[236,226,196],stripe:[222,206,170],dado:[76,108,92],side:[232,220,190],floor:[196,150,104],sprig:[170,120,90]}};
for(const b of [OS_HALL,OS_SHOP])b.R={X0:-b.w/2,X1:b.w/2,Z0:0,Z1:b.d,FY:0.3,HY:2.95};
// the cupboard: oak, a dark inside behind an iron grille, the bushel and the gallon on its floor, a quart and the yard on its shelf
function os_cupboard(ctx,C,cx,FY,bz,a){const w=1.7,h=2.05,d=0.5,x0=cx-w/2,z0=bz-d,oak=[122,84,54];
  ibox(ctx,C,x0,FY,z0,w,h,d,oak,{edge:0.4});const ox0=x0+0.12,ox1=x0+w-0.12,oy0=FY+0.56,oy1=FY+h-0.14,fz=z0-0.004;
  wq3(ctx,C,ox0,oy0,ox1,oy1,fz,ilit([50,38,32],1));wq3(ctx,C,ox0,FY+1.22,ox1,FY+1.27,fz-0.003,ilit([140,100,66],1));
  os_bronze(ctx,C,cx-0.32,oy0+0.02,fz-0.01,0.5,1.45);os_bronze(ctx,C,cx+0.42,oy0+0.02,fz-0.01,0.34,1.1);os_bronze(ctx,C,cx-0.42,FY+1.28,fz-0.01,0.22,1.0);
  ibox(ctx,C,cx-0.2,FY+1.3,fz-0.06,0.62,0.035,0.035,[210,160,80],{edge:0.5});ibox(ctx,C,cx-0.2,FY+1.33,fz-0.06,0.02,0.05,0.035,[180,130,60]);ibox(ctx,C,cx+0.4,FY+1.33,fz-0.06,0.02,0.05,0.035,[180,130,60]);
  // the grille, and a drawer with a lock below
  for(let x=ox0+0.06;x<ox1;x+=0.115)wq3(ctx,C,x-0.012,oy0,x+0.012,oy1,fz-0.05,[64,66,76],{edge:0.25});for(const y of [oy0+0.3,oy1-0.25])wq3(ctx,C,ox0,y-0.014,ox1,y+0.014,fz-0.052,[64,66,76]);
  wq3(ctx,C,x0+0.1,FY+0.1,x0+w-0.1,FY+0.48,fz,ilit(mix(oak,[255,255,255],0.1),1),{edge:0.4});const p=pj(C,v3(cx,FY+0.29,fz-0.01));if(p.z>NEAR){ctx.fillStyle="#3a2c22";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.03*p.s),0,TAU);ctx.fill();}
  if(a>0)glowQuad(ctx,C,[v3(x0-0.05,FY-0.02,z0-0.06),v3(x0+w+0.05,FY-0.02,z0-0.06),v3(x0+w+0.05,FY+h+0.05,z0-0.06),v3(x0-0.05,FY+h+0.05,z0-0.06)],a);}
FURNISH.os_hall=function(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz,oak=[110,76,50],h=st.hall||{};
  // oak posts and a rail on the plaster
  for(const x of [-1.25,1.25,2.75])wq3(ctx,C,x-0.07,FY,x+0.07,R.HY,bz-0.012,ilit(oak,ILIT.F),{edge:0.3});wq3(ctx,C,Q.xl,2.36,Q.xr,2.48,bz-0.013,ilit(oak,ILIT.F),{edge:0.3});
  add(0,1,bz-0.3,ctx=>os_cupboard(ctx,C,0,FY,bz,h.glow||0));
  // a trestle table with the clerk's roll, and a bench
  add(2.0,0.6,1.9,ctx=>{ibox(ctx,C,1.3,FY,1.75,0.08,0.7,0.6,oak);ibox(ctx,C,2.62,FY,1.75,0.08,0.7,0.6,oak);ibox(ctx,C,1.2,FY+0.7,1.7,1.6,0.06,0.7,[170,124,82],{edge:0.5});
    ibox(ctx,C,1.5,FY+0.76,1.85,0.5,0.03,0.34,[246,236,206],{edge:0.4});});
  if(!lod)add(-2.4,0.4,2.9,ctx=>{ibox(ctx,C,-2.9,FY,2.75,1.0,0.42,0.36,oak,{edge:0.3});});};
// the grocer's shop, the 1880s: shelves of jars and tins, a counter with a scale, the Act pinned to a post, the inspector's case
function os_scale(ctx,C,x,y,z,tilt,o){const P=(dx,dy)=>pj(C,v3(x+dx,y+dy,z));const b0=P(0,0);if(b0.z<NEAR)return;const s=b0.s;
  ctx.save();ctx.lineCap="round";ctx.strokeStyle="#5c4a3a";ctx.lineWidth=Math.max(2,0.03*s);const top=P(0,0.5);ctx.beginPath();ctx.moveTo(b0.x,b0.y);ctx.lineTo(top.x,top.y);ctx.stroke();
  ctx.fillStyle="#6a5444";ctx.beginPath();ctx.ellipse(b0.x,b0.y,0.13*s,0.03*s,0,0,TAU);ctx.fill();
  const L=0.34,c=Math.cos(tilt),sn=Math.sin(tilt),ends=[P(-L*c,0.5+L*sn),P(L*c,0.5-L*sn)];ctx.strokeStyle="#c8a058";ctx.lineWidth=Math.max(2,0.022*s);ctx.beginPath();ctx.moveTo(ends[0].x,ends[0].y);ctx.lineTo(ends[1].x,ends[1].y);ctx.stroke();
  ctx.fillStyle="#d8b064";ctx.beginPath();ctx.arc(top.x,top.y,Math.max(2,0.025*s),0,TAU);ctx.fill();
  ends.forEach((e,i)=>{const py=e.y+0.27*s;ctx.strokeStyle="rgba(120,100,70,0.9)";ctx.lineWidth=Math.max(1,0.006*s);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-0.1*s,py);ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+0.1*s,py);ctx.stroke();
    // a weight in each pan: the grocer's iron one on the right, by the inspector; his brass copy on the left, once it's set down
    if(i===1)os_weight(ctx,e.x,py-0.005*s,0.07*s,[70,72,80],o.crown);else if(o.brass)os_weight(ctx,e.x,py-0.005*s,0.07*s,null,0);
    const g=ctx.createLinearGradient(e.x-0.12*s,0,e.x+0.12*s,0);g.addColorStop(0,"#f6dc9a");g.addColorStop(1,"#a87c34");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(e.x,py,0.13*s,0.028*s,0,0,Math.PI);ctx.fill();ctx.beginPath();ctx.ellipse(e.x,py,0.13*s,0.022*s,0,0,TAU);ctx.fill();});
  ctx.restore();}
// a weight standing at (x,y) on screen, h tall: iron, or brass when col is null; crown (0..1) is the inspector's stamp on it
function os_weight(ctx,x,y,h,col,crown){ctx.save();ctx.translate(x,y);const w=h*1.15;ctx.beginPath();ctx.moveTo(-w*0.5,0);ctx.lineTo(w*0.5,0);ctx.lineTo(w*0.38,-h*0.8);ctx.lineTo(-w*0.38,-h*0.8);ctx.closePath();
  const g=ctx.createLinearGradient(-w*0.5,0,w*0.5,0);if(col){g.addColorStop(0,rgba(mix(col,[255,255,255],0.3),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.3),1));}else{g.addColorStop(0,"#fbe6a8");g.addColorStop(0.5,"#d8a850");g.addColorStop(1,"#8c6424");}ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.ellipse(0,-h*0.86,w*0.16,h*0.12,0,0,TAU);ctx.fill();
  if(crown>0){ctx.globalAlpha*=clamp(crown*2,0,1);const k=h*0.26*(1+0.5*(1-spring(crown)));ctx.fillStyle="#f4c84a";ctx.beginPath();ctx.moveTo(-k,-h*0.3);ctx.lineTo(-k,-h*0.3-k*1.1);ctx.lineTo(-k*0.5,-h*0.3-k*0.6);ctx.lineTo(0,-h*0.3-k*1.3);ctx.lineTo(k*0.5,-h*0.3-k*0.6);ctx.lineTo(k,-h*0.3-k*1.1);ctx.lineTo(k,-h*0.3);ctx.closePath();ctx.fill();}
  ctx.restore();}
// the inspector's stamp: a hammer swung from above the shoulder down onto the weight in the pan beside him; os_hammer draws the
// hammer in the hand, its handle at angle th (0 points straight out from the body, larger turns it up), its face striking downwards
Object.assign(POSE,{os_hitUp:{L:[0.16,-0.08],R:[2.15,2.9],feet:30,shift:4,tilt:0,turn:0.15,gaze:[0.5,0.3],look:1},
  os_hitDown:{L:[0.16,-0.08],R:[1.08,1.9],feet:30,shift:4,tilt:0.04,turn:0.15,gaze:[0.6,0.5],look:1}});
function os_hammer(th,flip){return(cx,P_,hands)=>{const r=hands[1],s=flip?-1:1;cx.save();cx.translate(r[0],r[1]);cx.scale(s,1);cx.rotate(-th);
  cx.fillStyle="#8a6040";rr(cx,-6,-4.5,92,9,4);cx.fill();const g=cx.createLinearGradient(0,-24,0,24);g.addColorStop(0,"#c8ccd4");g.addColorStop(1,"#7a808c");cx.fillStyle=g;rr(cx,72,-14,24,40,4);cx.fill();
  cx.fillStyle="rgba(255,255,255,0.35)";cx.fillRect(75,-11,5,34);cx.restore();fingers(cx,P_,[r]);};}
function os_case(ctx,C,x,FY,z,glow){const wood=[110,70,44];ibox(ctx,C,x-0.22,FY,z-0.2,0.44,0.46,0.4,[150,110,74],{edge:0.3});
  const y=FY+0.46;ibox(ctx,C,x-0.3,y,z-0.22,0.6,0.1,0.42,wood,{edge:0.4});ibox(ctx,C,x-0.27,y+0.1,z-0.19,0.54,0.012,0.36,[120,40,46]);
  poly3(ctx,C,[v3(x-0.3,y+0.1,z+0.2),v3(x+0.3,y+0.1,z+0.2),v3(x+0.3,y+0.48,z+0.27),v3(x-0.3,y+0.48,z+0.27)],wood,{n:NRM.F,edge:0.4});poly3(ctx,C,[v3(x-0.27,y+0.12,z+0.19),v3(x+0.27,y+0.12,z+0.19),v3(x+0.27,y+0.45,z+0.255),v3(x-0.27,y+0.45,z+0.255)],[130,46,52],{n:NRM.F});
  // brass copies of the standard weights, largest first
  for(let i=0;i<6;i++){const p=pj(C,v3(x-0.21+i*0.085,y+0.11,z-0.02));if(p.z>NEAR)os_weight(ctx,p.x,p.y,(0.1-i*0.012)*p.s,null,0);}
  if(glow>0)glowQuad(ctx,C,[v3(x-0.34,FY-0.02,z-0.26),v3(x+0.34,FY-0.02,z-0.26),v3(x+0.34,y+0.55,z-0.26),v3(x-0.34,y+0.55,z-0.26)],glow);}
function os_act(ctx,C,x,FY,z,glow){ibox(ctx,C,x-0.08,0,z-0.08,0.16,2.95,0.16,[96,70,52],{edge:0.35});const y0=FY+0.92,y1=FY+1.56,zz=z-0.085;
  wq3(ctx,C,x-0.24,y0,x+0.24,y1,zz,[250,244,226],{edge:0.5});surfAt(ctx,C,v3(x-0.24,y1,zz-0.002),v3(1,0,0),v3(0,1,0),24,8,c=>{Tw(c,"WEIGHTS AND",0,0,{w:800,size:4.4,align:"center",color:rgba([60,52,48],1)});Tw(c,"MEASURES ACT",0,6,{w:800,size:4.4,align:"center",color:rgba([60,52,48],1)});});
  for(let i=0;i<7;i++)wq3(ctx,C,x-0.19,y1-0.2-i*0.05,x+0.19-(i===6?0.12:0),y1-0.188-i*0.05,zz-0.003,[150,140,130],{a:0.7});const p=pj(C,v3(x,y1-0.03,zz-0.01));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.02*p.s),0,TAU);ctx.fill();}
  if(glow>0)glowQuad(ctx,C,[v3(x-0.29,y0-0.05,zz-0.01),v3(x+0.29,y0-0.05,zz-0.01),v3(x+0.29,y1+0.05,zz-0.01),v3(x-0.29,y1+0.05,zz-0.01)],glow);}
FURNISH.os_shop=function(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz,s=st.shop||{};
  // shelves along the back wall, full of jars and tins
  for(let r=0;r<3;r++){const y=FY+1.05+r*0.55;ibox(ctx,C,Q.xl+0.05,y,bz-0.32,Q.xr-Q.xl-0.1,0.04,0.3,[150,104,66],{edge:0.3});
    if(!lod)for(let i=0;i<22;i++){const x=Q.xl+0.2+i*0.27;if(x>Q.xr-0.2)break;const tall=0.18+0.14*hash(i,r+7),c=[[196,72,60],[70,110,150],[220,180,90],[110,150,110],[236,226,200]][Math.floor(hash(i*3,r)*5)];
      ibox(ctx,C,x,y+0.04,bz-0.26,0.17,tall,0.16,c,{edge:0.3,grad:[0.16,0.12]});wq3(ctx,C,x+0.03,y+0.04+tall*0.35,x+0.14,y+0.04+tall*0.7,bz-0.262,[250,244,226]);}}
  add(-2.55,1,0.45,ctx=>os_act(ctx,C,-2.55,FY,0.45,s.act||0));
  // the counter, and on it the scale, a few parcels and the grocer's ledger
  add(-0.6,0.6,1.95,ctx=>{ibox(ctx,C,-2.3,FY,1.75,3.4,0.9,0.5,[160,112,74],{edge:0.4});for(let i=0;i<4;i++)wq3(ctx,C,-2.22+i*0.84,FY+0.1,-1.5+i*0.84,FY+0.8,1.745,ilit([176,128,86],1),{edge:0.35});
    ibox(ctx,C,-2.36,FY+0.9,1.7,3.52,0.05,0.6,[196,150,104],{edge:0.6});const top=FY+0.95;
    os_scale(ctx,C,-0.55,top,1.98,s.tilt||0,{brass:s.brass,crown:s.crown||0});
    ibox(ctx,C,-1.9,top,1.86,0.3,0.16,0.22,[214,190,150],{edge:0.4});ibox(ctx,C,-1.55,top,1.9,0.22,0.12,0.18,[226,206,170],{edge:0.4});ibox(ctx,C,0.35,top,1.86,0.4,0.03,0.28,[120,60,50],{edge:0.4});});
  add(1.75,0.5,1.05,ctx=>os_case(ctx,C,1.75,FY,1.05,s.caseGlow||0));
  if(!lod)add(2.6,0.5,2.9,ctx=>{for(let i=0;i<2;i++)os_barrel(ctx,C,2.45+i*0.4,2.95-i*0.1,0.7,FY);os_sack(ctx,C,2.1,3.1,0.6);});};

// ---- the market square: everything in one picture, dressed for its year ----
// st: t, era (1215, 1497, 1871 or 1880), figs [{id,x,z,y?,at?,...}] (at "hall" or "shop": in that building's own coordinates),
// jugs [h,h,h] (the wine stall's), charter (the seal's pop), bushels (0..1 their tags), hall, shop, ts (blur band), after(ctx)
const OS_HOUSES=[{x:-11.4,z:14.6,w:3.4,d:3.2,roof:[206,170,104]},{x:-7.6,z:15,w:3.2,d:3,roof:[178,98,74],plaster:[248,236,210],shop:1},{x:-4.0,z:14.8,w:3.4,d:3.2,roof:[206,170,104],plaster:[244,230,200],shop:1},
  {x:3.2,z:15,w:3.2,d:3,roof:[178,98,74],hall:1},{x:6.8,z:14.6,w:3.6,d:3.2,roof:[206,170,104],plaster:[246,232,204],hall:1},{x:10.8,z:14.8,w:3.2,d:3.2,roof:[178,98,74]},
  {x:-15.2,z:8.6,w:3.2,d:3.4,roof:[178,98,74],plaster:[246,234,206]},{x:13.6,z:8.2,w:3.2,d:3.4,roof:[206,170,104]}];
const OS_TREES=[[-12,22,6],[9,24,6.5],[14,18,5],[-16,16,6],[0.9,17.5,5.4],[12.6,11.4,4.4],[-10.2,11.0,4.2],[-17,4,5],[17,3,5.2]];
const OS_STALL={wine:[-5.6,5.4,2.6,1.3,[178,62,56]],corn:[3.0,5.4,2.6,1.3,[64,98,160]]};
function os_market(ctx,S,C,st){setScreen(ctx,S);LBQ=[];DL=[];MX=null;const era=st.era||1215,t=st.t||0;
  GV.hz0=14;GV.hz1=70;GV.hzA=0.85;HAZE=[226,236,246];
  tSky(ctx);tHorizon(ctx,C,[132,190,106]);tFlock(ctx,C,0,8,30,{a:0.14,skip:(x,z)=>x>-12.2&&x<13.2&&z>-16.2&&z<14.6});
  // the square: packed earth with stones in it, from the houses at the back to well behind the camera, and a lane out between the houses
  poly3(ctx,C,[v3(-12,0.005,-16),v3(13,0.005,-16),v3(13,0.005,14.4),v3(-12,0.005,14.4)],[222,198,156],{n:NRM.U,grad:[0.02,0.04]});
  poly3(ctx,C,[v3(-0.9,0.006,14.4),v3(2.9,0.006,14.4),v3(2.9,0.006,24),v3(-0.9,0.006,24)],[214,192,152],{n:NRM.U});
  ctx.save();ctx.fillStyle="rgba(150,120,90,0.25)";for(let i=0;i<1500;i++){const x=-11.6+hash(i,11)*24.2,z=-6+hash(i,12)*20,p=pj(C,v3(x,0.006,z));if(p.z<NEAR||p.x<-20||p.x>W+20||p.y<-20||p.y>H+20)continue;ctx.beginPath();ctx.ellipse(p.x,p.y,0.07*p.s,0.03*p.s,0,0,TAU);ctx.fill();}ctx.restore();
  // shadows first, on the ground under everything
  const houses=OS_HOUSES.filter(h=>!(era>=1497&&h.hall)&&!(era>=1880&&h.shop)),bld=[];if(era>=1497)bld.push(OS_HALL);if(era>=1880)bld.push(OS_SHOP);
  for(const h of houses){contactShadow(ctx,C,h.x,h.z,h.w,h.d,0.22);castShadow(ctx,C,h.x,h.z,h.w,h.d,5.4,0.13);}
  for(const b of bld){mxSet(b.x,b.z,b.ang);contactShadow(ctx,C,b.R.X0,0,b.w,b.d,0.22);castShadow(ctx,C,b.R.X0,0,b.w,b.d,4.3,0.13);mxOff();}
  for(const [k,s] of Object.entries(OS_STALL))contactShadow(ctx,C,s[0],s[1],s[2],s[3],0.18);contactShadow(ctx,C,-1.5,5.3,2.2,2.2,0.2);
  // the buildings, the cross, the stalls and the people, far to near
  const add=(p,fn)=>dlAdd(eyeD(C,p),fn);
  for(const h of houses)add(v3(h.x+h.w/2,2,h.z+h.d/2),ctx=>os_timber(ctx,C,h.x,h.z,h.w,h.d,h));
  add(v3(1.7,4,26),ctx=>os_church(ctx,C,-1.2,24));for(const [x,z,h] of OS_TREES)add(v3(x,h*0.4,z),ctx=>tTree(ctx,C,x,z,h,[104,170,100]));
  const inB={os_hall:[],os_shop:[]},out=[];for(const f of (st.figs||[])){if(f.at==="hall")inB.os_hall.push(f);else if(f.at==="shop")inB.os_shop.push(f);else out.push(f);}
  for(const b of bld)add(v3(b.x,1.5,b.z+b.d/2),ctx=>drawBuilding(ctx,C,b,st,inB[b.id]));
  add(v3(-0.4,1.2,6.4),ctx=>os_cross(ctx,C,-0.4,6.4));
  const w=OS_STALL.wine,cn=OS_STALL.corn,jugs=st.jugs||[0.32,0.24,0.4];
  add(v3(w[0]+w[2]/2,1,w[1]+w[3]/2),ctx=>{os_stall(ctx,C,...w);[[-5.1,5.9],[-4.5,5.85],[-3.7,5.95]].forEach(([x,z],i)=>os_jug(ctx,C,x,0.86,z,jugs[i],[[176,120,84],[160,108,80],[186,130,90]][i]));
    if(st.charter){const ch=st.charter,P_=pj(C,v3(-5.6,1.34,5.33));if(P_.z>NEAR)os_charter(ctx,P_.x,P_.y,P_.s,ch);}});
  for(const [x,z] of [[-5.3,7.4],[-4.6,7.5],[-3.9,7.35]])add(v3(x,0.5,z),ctx=>os_barrel(ctx,C,x,z,0.95));
  add(v3(cn[0]+cn[2]/2,1,cn[1]+cn[3]/2),ctx=>{os_stall(ctx,C,...cn);if(era===1871)os_bushels(ctx,C,st.bushels||0);});
  for(const [x,z,h] of [[3.4,7.3,0.9],[4.1,7.4,0.95],[4.8,7.3,0.85],[5.4,7.5,0.8]])add(v3(x,0.45,z),ctx=>os_sack(ctx,C,x,z,h));
  if(era===1215){add(v3(5.3,0.3,5.0),ctx=>os_sack(ctx,C,5.3,5.0,0.7));add(v3(3.55,0.3,4.3),ctx=>os_bushel(ctx,C,3.55,0,4.3,0.38,1.3));
    // close to us, out of focus: a handcart of apples, a barrel and a sack
    add(v3(-3.15,0.5,1.4),ctx=>os_cart(ctx,C,-3.9,1.0));
    add(v3(4.6,0.5,1.4),ctx=>os_barrel(ctx,C,4.6,1.4,1.0));add(v3(5.4,0.4,1.6),ctx=>os_sack(ctx,C,5.4,1.6,0.8));}
  for(const f of out)add(v3(f.x,0.8,f.z),ctx=>{const B=tFig(ctx,C,f.id,f.x,f.z,f);if(f.onDraw)f.onDraw(ctx,B);});
  if(st.extra)st.extra(C,add);
  dlDraw(ctx);if(st.over)st.over(ctx,C);
  const ts=st.ts||C.ts||[300,860,8];tiltShift(ctx,ts[0],ts[1],ts[2],ts[3]);vignetteSoft(ctx,[60,70,110],0.14);
  lbDraw(ctx,S);setScreen(ctx,S);if(st.after)st.after(ctx);GV.hzA=0.8;HAZE=[222,236,248];}
// the charter pinned to the stall's post, with its seal; flip (0..1) turns it over, as each new year reads it again
function os_charter(ctx,x,y,s,ch){const k=Math.abs(Math.cos(Math.PI*(ch.flip||0))),w=0.34*s,h=0.42*s;ctx.save();ctx.translate(x,y);ctx.scale(Math.max(0.04,k),1);
  ctx.fillStyle="rgba(60,40,20,0.2)";ctx.fillRect(-w/2+0.012*s,-h/2+0.016*s,w,h);const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,"#fbf3dc");g.addColorStop(1,"#e6d2a4");ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
  ctx.strokeStyle="rgba(90,70,50,0.45)";ctx.lineWidth=Math.max(1,0.008*s);for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(-w/2+0.04*s,-h/2+0.06*s+i*0.042*s);ctx.lineTo(w/2-0.04*s-(i===6?0.1*s:0),-h/2+0.06*s+i*0.042*s);ctx.stroke();}
  ctx.strokeStyle="rgba(160,40,40,0.9)";ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(-0.01*s,h/2+0.06*s);ctx.stroke();const r=0.035*s*(1+0.4*(1-spring(clamp(ch.seal==null?1:ch.seal,0,1))));ctx.fillStyle="#b8322c";ctx.beginPath();ctx.arc(-0.01*s,h/2+0.08*s,r,0,TAU);ctx.fill();
  ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(0,-h/2+0.015*s,Math.max(1.5,0.012*s),0,TAU);ctx.fill();ctx.restore();}
// 1871: the corn stall lined with measures, every one of them called a bushel; tags (0..1) puts a tag on each, one by one
const OS_BUSHELS=[[3.3,0.86,5.95,0.22,1.2],[3.7,0.86,5.92,0.3,1.0],[4.1,0.86,5.96,0.18,1.35],[4.5,0.86,5.92,0.34,0.95],[4.9,0.86,5.94,0.26,1.15],[5.3,0.86,5.98,0.2,1.3],
  [3.5,0,5.0,0.36,1.0],[4.35,0,4.9,0.28,1.25],[5.2,0,5.05,0.4,0.9]];
function os_bushels(ctx,C,tags){OS_BUSHELS.forEach(([x,y,z,h,w],i)=>{const B=os_bushel(ctx,C,x,y,z,h,w);if(!B||i>5)return;const u=clamp(tags*7-i,0,1);if(u<=0)return;
  // the tags take turns, high and low, so each has room
  const top=B.y-h*B.s-0.1*B.s,st_=i%2?104:24;lbAdd(c=>{c.save();c.translate(B.x,top);const k=0.6+0.4*spring(u);c.scale(k,k);c.globalAlpha*=clamp(u*2,0,1);
    c.strokeStyle="rgba(120,96,60,0.9)";c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(0,-st_);c.stroke();signBoard(c,0,-st_+2,"a bushel",{size:28,w:800,bg:[255,250,236],rim:[200,170,110]});c.restore();});});}

// ---- cameras: keys [t, eye, target, focal length, blur band?], eased like a sine between them ----
// A key's sixth item says how the move into it goes: "orbit" swings eye and target round the town's middle (so a move from one
// office to the next goes round the green, not across it), "line" goes straight (inside a room, or in the market).
function os_keys(list,o){o=o||{};const cx=o.cx||0,cz=o.cz||0;let pe=null,pg=null;
  return{cx,cz,keys:list.map(k=>{const e=cyl(k[1].x,k[1].y,k[1].z,cx,cz),g=cyl(k[2].x,k[2].y,k[2].z,cx,cz);
    if(pe)e[1]=pe[1]+(((e[1]-pe[1])%360+540)%360-180);if(pg)g[1]=pg[1]+(((g[1]-pg[1])%360+540)%360-180);pe=e;pg=g;
    return{t:k[0],e,g,E:k[1],G:k[2],f:k[3],ts:k[4],mode:k[5]||o.mode||"line"};})};}
function os_cam(K,t,o){o=o||{};const ks=K.keys;let a=ks[0],b=ks[0],u=0;
  if(t>=ks[ks.length-1].t)a=b=ks[ks.length-1];else for(let i=1;i<ks.length;i++)if(t<ks[i].t){a=ks[i-1];b=ks[i];u=t<=a.t?0:easeCam((t-a.t)/(b.t-a.t));break;}
  let e,g;if(b.mode==="orbit"){const L=(p,q)=>p.map((v,i)=>lerp(v,q[i],u));e=fromCyl(L(a.e,b.e),K.cx,K.cz);g=fromCyl(L(a.g,b.g),K.cx,K.cz);}
  else{e=vadd(a.E,vmul(vsub(b.E,a.E),u));g=vadd(a.G,vmul(vsub(b.G,a.G),u));}
  if(o.drift!==0){const d=o.drift||0.01;e=v3(e.x+Math.sin(t*0.37)*d,e.y+Math.sin(t*0.29+1)*d*0.7,e.z);}
  const C=cam3(e,g,lerp(a.f,b.f,u));if(a.ts&&b.ts)C.ts=a.ts.map((v,i)=>lerp(v,b.ts[i],u));else if(a.ts||b.ts)C.ts=a.ts||b.ts;return C;}
// a point in an office's own coordinates (x across its front, z from the front to the back), in the town's
const os_in=(id,x,y,z)=>bldP(id,x,y,z);

// ---- shots: a chapter can cut between pictures, with a short dissolve ----
// list: [[start, draw(ctx,S,t)], ...] in order; each draw paints the whole frame. From its start, a shot fades in over xf seconds.
function os_shots(ctx,S,t,list,xf){xf=xf==null?0.7:xf;let i=0;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;
  list[i][1](ctx,S,t);const u=i>0?(t-list[i][0])/xf:1;if(u>=1)return;
  const cv=ctx.canvas,off=pcanvas2("os_x",cv.width,cv.height),o=off.getContext("2d");o.save();o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.globalCompositeOperation="source-over";list[i-1][1](o,S,t);o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1-easeCam(u);ctx.drawImage(off,0,0);ctx.restore();}

// ---- words: labels and speech bubbles, drawn after the blur, kept inside the frame and clear of the captions ----
const OS_SAFE={x0:40,x1:W-40,y0:40,y1:868};
// a sign whose bottom centre is at (x,y), nudged inside the frame; k scales it from its foot (for a pop)
function os_board(c,x,y,text,o){o=o||{};const sz=o.size||30,lines=Array.isArray(text)?text:[text];c.save();c.font=font(o.w||800,sz);
  const pw=Math.max(...lines.map(l=>c.measureText(l).width))+sz*1.3+(o.dot?sz*0.55:0),ph=sz*0.75+sz*1.22*lines.length;
  const X=clamp(x,OS_SAFE.x0+pw/2,OS_SAFE.x1-pw/2),Y=clamp(y,OS_SAFE.y0+ph,OS_SAFE.y1);c.restore();
  const k=o.k==null?1:o.k;c.save();c.translate(X,Y);c.scale(k,k);signBoard(c,0,0,lines,{size:sz,w:o.w||800,dot:o.dot,bg:o.bg,ink:o.ink,rim:o.rim,a:o.a});c.restore();return{X,Y,w:pw,h:ph};}
// a label at a point of the world, lifted dy pixels above it; it pops in as a goes from 0 to 1
function os_tag(C,p,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P_=pj(C,p);if(P_.z<NEAR)return;
  lbAdd(c=>os_board(c,P_.x+(o.dx||0),P_.y-(o.dy==null?16:o.dy),text,Object.assign({},o,{a:clamp(a*1.6,0,1),k:o.pop===false?1:0.7+0.3*spring(clamp(a,0,1))})));}
// a label over a figure (B is what tFig returned)
function os_figTag(B,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||!B||!B.top)return;
  lbAdd(c=>os_board(c,B.x+(o.dx||0),B.top-(o.dy==null?14:o.dy),text,Object.assign({},o,{a:clamp(a*1.6,0,1),k:0.7+0.3*spring(clamp(a,0,1))})));}
// a speech bubble from a figure's head; o.left puts it on the figure's left
function os_say(B,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||!B||!B.top)return;
  lbAdd(c=>{const sz=o.size||32,w=speechW(c,lines,sz,o.w||700),h=lines.length*sz*1.3+sz*0.9,tx=B.x+(o.tdx||0),ty=B.top+(o.tdy==null?18:o.tdy);
    const x=clamp(o.left?tx-w+90:tx-90,OS_SAFE.x0,OS_SAFE.x1-w),y=clamp(ty-h-(o.gap||64),OS_SAFE.y0,OS_SAFE.y1-h);
    tSpeech(c,x,y,w,lines,tx,ty,{size:sz,a:clamp(a*1.6,0,1),k:0.85+0.15*spring(clamp(a,0,1)),w:o.w||700});});}
// the place and the year, top left; list [[t, text], ...]: the sign turns over to show the next
function os_marker(ctx,t,list,a){let i=0;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;const u=i>0?clamp((t-list[i][0])/0.4,0,1):1;
  let txt=list[i][1],sy=1;if(u<1){sy=Math.abs(Math.cos(Math.PI*u));if(u<0.5)txt=list[i-1][1];}
  ctx.save();ctx.translate(0,96);ctx.scale(1,Math.max(0.03,sy));ctx.translate(0,-96);marker(ctx,txt,a==null?1:a,u<1);ctx.restore();}
// how far a moment is into a fade: 0 before t0, 1 after t0+d
const os_in01=(t,t0,d)=>clamp((t-t0)/(d||0.5),0,1);
// in and out: up from t0, down from t1
const os_io=(t,t0,t1,d)=>Math.min(os_in01(t,t0,d||0.4),1-os_in01(t,t1,d||0.4));

// ---- the title and the end: a painted board over the town, blurred behind it ----
function os_card(ctx,a,big,small,foot){if(a<=0.01)return;blurAll(ctx,10*a,[[44,52,80],0.18*a]);ctx.save();ctx.globalAlpha*=clamp(a*1.4,0,1);const k=0.94+0.06*easeCam(a);
  ctx.translate(W/2,450);ctx.scale(k,k);ctx.translate(-W/2,-450);ctx.font=font(800,big[1]);const bw=Math.max(ctx.measureText(big[0]).width+160,tw(ctx,small,40,700)+160,980),bh=small?320:240,bx=W/2-bw/2,by=450-bh/2-30;
  ctx.save();ctx.shadowColor="rgba(30,36,60,0.35)";ctx.shadowBlur=40;ctx.shadowOffsetY=16;rr(ctx,bx,by+8,bw,bh,28);ctx.fillStyle=rgba([206,160,72],1);ctx.fill();ctx.restore();
  const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,"#fffaf0");g.addColorStop(1,"#f6ecd4");rr(ctx,bx,by,bw,bh,28);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(214,170,90,0.6)";ctx.lineWidth=3;rr(ctx,bx+16,by+16,bw-32,bh-32,18);ctx.stroke();
  T(ctx,big[0],W/2,by+(small?150:150),{w:800,size:big[1],align:"center",color:rgba(PAL.ink,1)});if(small)T(ctx,small,W/2,by+232,{w:700,size:40,align:"center",color:rgba([110,90,60],1)});
  if(foot)signBoard(ctx,W/2,by+bh+110,foot,{size:30,w:700,dot:PAL.band,bg:[255,252,244]});ctx.restore();}

// ---- things on Yusuf's desk, in the office's own coordinates (the desk top is at y; x across, z from the front) ----
// a sheet of paper lying flat, its top edge away from us; fn(c) writes on it in centimetres from its top left corner
function os_paper(ctx,C,x0,z0,x1,z1,y,fn,o){o=o||{};fq3(ctx,C,x0+0.01,z0-0.008,x1+0.01,z1-0.008,y+0.001,[120,100,80],{a:0.18});fq3(ctx,C,x0,z0,x1,z1,y+0.003,o.col||[255,252,244],{edge:0.4});
  if(fn)surfDraw(ctx,C,v3(x0,y+0.004,z1),v3(1,0,0),v3(0,0,1),fn);}
// an open ring binder lying on the desk: its cover, two pages and the rings; left(c), right(c) write on the pages
function os_binderOpen(ctx,C,cx,cz,y,o){o=o||{};const pw=o.pw||0.3,pd=o.pd||0.4,col=o.col||PAL.navy;
  fq3(ctx,C,cx-pw-0.04,cz-pd/2-0.03,cx+pw+0.04,cz+pd/2+0.03,y+0.002,mix(col,[0,0,0],0.15),{edge:0.4});
  os_paper(ctx,C,cx-pw,cz-pd/2,cx-0.01,cz+pd/2,y+0.008,o.left);os_paper(ctx,C,cx+0.01,cz-pd/2,cx+pw,cz+pd/2,y+0.008,o.right);
  for(let i=0;i<3;i++){const p=pj(C,v3(cx,y+0.02,cz-pd/2+0.08+i*pd*0.4));if(p.z<NEAR)continue;ctx.save();ctx.strokeStyle="rgba(170,176,190,1)";ctx.lineWidth=Math.max(1.5,0.008*p.s);ctx.beginPath();ctx.ellipse(p.x,p.y,0.012*p.s,0.02*p.s,0,0,TAU);ctx.stroke();ctx.restore();}}
// the three trays Yusuf sorts the binder into: runs, owned decision, retire
const OS_TRAYS=[{x:0.8,col:[96,176,120],name:"runs in the work"},{x:1.32,col:[226,178,64],name:"owned decisions"},{x:1.84,col:[160,164,176],name:"can go"}];
function os_tray(ctx,C,x,z,y,col,n){const w=0.44,d=0.32,h=0.06;ibox(ctx,C,x-w/2,y,z-d/2,w,0.012,d,mix(col,[0,0,0],0.1));for(const [a,b,c_,e] of [[x-w/2,z-d/2,w,0.012],[x-w/2,z+d/2-0.012,w,0.012]])ibox(ctx,C,a,y,b,c_,h,e,col,{edge:0.4});
  for(const xx of [x-w/2,x+w/2-0.012])ibox(ctx,C,xx,y,z-d/2,0.012,h,d,col,{edge:0.4});for(let i=0;i<(n||0);i++)fq3(ctx,C,x-w/2+0.03+i*0.004,z-d/2+0.03,x+w/2-0.03,z+d/2-0.03,y+0.014+i*0.006,[255,252,244],{edge:0.3});}
// a page flying from one place to another along an arc, turning a little as it goes (u: 0 to 1)
function os_flyPage(ctx,C,a,b,u,lift){if(u<=0||u>=1)return;const e=easeCam(u),p=v3(lerp(a.x,b.x,e),lerp(a.y,b.y,e)+Math.sin(Math.PI*e)*(lift||0.35),lerp(a.z,b.z,e)),w=0.13,d=0.17,r=Math.sin(Math.PI*e)*0.5;
  const cs=Math.cos(r),sn=Math.sin(r),q=[[-w,-d],[w,-d],[w,d],[-w,d]].map(([x,z])=>v3(p.x+x*cs-z*sn*0.3,p.y+x*sn*0.4,p.z+z*cs+x*sn*0.3));poly3(ctx,C,q,[255,252,244],{edge:0.5});}

// ---- the registrar's counter: the government's reporting manual, thick, and the university's own term on a card ----
function os_manual(ctx,C,x,z,y){ibox(ctx,C,x,y,z,0.44,0.16,0.34,[46,72,120],{edge:0.5});ibox(ctx,C,x+0.02,y+0.02,z-0.006,0.4,0.12,0.02,[246,242,230],{edge:0.3});
  wq3(ctx,C,x+0.08,y+0.05,x+0.36,y+0.11,z-0.008,[250,248,240]);}
function os_tent(ctx,C,x,z,y,fn){const h=0.2,w=0.3;poly3(ctx,C,[v3(x,y,z),v3(x+w,y,z),v3(x+w,y+h,z+0.07),v3(x,y+h,z+0.07)],[255,252,244],{n:vnorm(v3(0,0.33,-1)),edge:0.5});
  if(fn)surfDraw(ctx,C,v3(x,y+h,z+0.07),v3(1,0,0),vnorm(v3(0,h,0.07)),fn);}

// ---- the data team's cork board: the two reports, when each ran, and the day the term changed ----
function os_reportCard(ctx,C,x0,y0,x1,y1,z,col,lines,a){if(a<=0.01)return;const lift=(1-spring(a))*0.25;wq3(ctx,C,x0,y0,x1,y1,z-0.006-lift,ilit(col,1),{edge:0.4});
  surfDraw(ctx,C,v3(x0,y1,z-0.008-lift),v3(1,0,0),v3(0,1,0),c=>lines.forEach(([s,sz,w,cl],i)=>Tw(c,s,(x1-x0)*50,lines.slice(0,i+1).reduce((m,l)=>m+l[1]*1.3,0)+2,{w:w||700,size:sz,align:"center",color:rgba(cl||PAL.ink,1)})));
  const p=pj(C,v3((x0+x1)/2,y1-0.04,z-0.01-lift));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,0.02*p.s),0,TAU);ctx.fill();}}

// ---- the wheel: a signpost on each of the ten paths, its board one of DAMA's ten other knowledge areas ----
const OS_AREAS=[["data","architecture"],["data modelling","& design"],["data storage","& operations"],["data security"],["data integration","& interoperability"],["documents","& content"],["reference","& master data"],["data warehousing","& BI"],["metadata"],["data quality"]];
// the loop's pins: the steps where a governance decision enters the work, and what's pinned there
const OS_PINS=[[0,["a term"]],[1,["a classification"]],[3,["an owner","a contract"]],[4,["a rule"]],[7,["an approval"]],[9,["a version"]]];
function os_pin(ctx,C,p,a,big){if(a<=0.01)return;const P_=pj(C,p);if(P_.z<NEAR)return;const k=(0.6+0.4*spring(a))*(big||1),r=0.03*P_.s*k,lift=(1-spring(a))*40;ctx.save();ctx.globalAlpha*=clamp(a*2,0,1);
  ctx.fillStyle="rgba(60,40,20,0.3)";ctx.beginPath();ctx.ellipse(P_.x+r*0.4,P_.y+r*0.5,r,r*0.6,0,0,TAU);ctx.fill();const g=ctx.createRadialGradient(P_.x-r*0.3,P_.y-r*0.4-lift,1,P_.x,P_.y-lift,r);g.addColorStop(0,"#fff6c8");g.addColorStop(1,rgba(PAL.gold,1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(P_.x,P_.y-lift,r,0,TAU);ctx.fill();ctx.restore();}

// ---- a document held out in front at chest height, below the face; fn writes on its page (figure units, 200 x 250 round its middle) ----
function os_heldDoc(fn,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+112);
  cx.fillStyle="rgba(40,40,60,0.18)";rr(cx,-104,-122,216,262,8);cx.fill();cx.fillStyle=rgba(col||[250,248,240],1);rr(cx,-110,-130,220,262,8);cx.fill();
  cx.fillStyle="#fffdf6";rr(cx,-100,-122,200,246,5);cx.fill();if(fn)fn(cx);cx.restore();fingers(cx,P_,[[mx-104,my-6],[mx+104,my-8]]);};}

// ---- the data team's cork board, Jun's screen, the registrar's counter (chapter 4) ----
// a round green tick, pinned to a card's corner (u: 0 to 1, for a pop)
function os_tick(ctx,C,p,u){if(u<=0.01)return;const P_=pj(C,p);if(P_.z<NEAR)return;const r=0.045*P_.s*(0.6+0.4*spring(u));ctx.save();ctx.globalAlpha*=clamp(u*2,0,1);
  ctx.fillStyle=rgba([70,160,100],1);ctx.beginPath();ctx.arc(P_.x,P_.y,r,0,TAU);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=r*0.28;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(P_.x-r*0.45,P_.y+r*0.02);ctx.lineTo(P_.x-r*0.1,P_.y+r*0.36);ctx.lineTo(P_.x+r*0.48,P_.y-r*0.34);ctx.stroke();ctx.restore();}
// the glossary's entry for award, on Jun's screen (102 x 62 cm): n brings in Monday's new line, m the note that it changed
function os_term(c,n,m){c.fillStyle="#f6f9fc";c.fillRect(0,0,102,62);c.fillStyle=rgba([226,236,246],1);c.fillRect(0,0,102,10);
  Tw(c,"glossary",4,7,{w:700,size:4,color:rgba([96,104,128],1)});Tw(c,"award",4,21,{w:800,size:7.5,color:rgba(PAL.ink,1)});
  const tick=(x,y)=>{c.strokeStyle=rgba([70,160,100],1);c.lineWidth=0.9;c.lineCap="round";c.beginPath();c.moveTo(x,y-1.2);c.lineTo(x+1.2,y);c.lineTo(x+3.2,y-2.8);c.stroke();};
  Tw(c,"what counts:",4,29.5,{w:600,size:4,color:rgba([96,104,128],1)});["graduate certificates","masters and doctorates"].forEach((s,i)=>{tick(5,36.2+i*6.6);Tw(c,s,10.5,37+i*6.6,{w:600,size:4.2,color:rgba([60,70,100],1)});});
  if(n>0){c.save();c.globalAlpha*=clamp(n*2,0,1);c.fillStyle=rgba([255,226,150],0.9);rr(c,2.5,45.5-4*(1-spring(n)),97,14.5,1.6);c.fill();tick(5,51.2);
    Tw(c,"microcredentials,",10.5,52,{w:800,size:4.2,color:rgba([120,80,20],1)});Tw(c,"6 credit points or more",10.5,57.6,{w:700,size:4.2,color:rgba([120,80,20],1)});c.restore();}
  if(m>0){c.save();c.globalAlpha*=clamp(m*2,0,1);c.fillStyle=rgba(PAL.gold,1);rr(c,62,14.5,36,8.6,4.3);c.fill();Tw(c,"changed Monday",80,20.4,{w:800,size:3.6,align:"center",color:rgba([74,52,20],1)});c.restore();}}
// a book standing on the counter, its cover to us; fn writes on the cover in centimetres from its top left
function os_bookUp(ctx,C,x,z,y,w,h,col,fn){ibox(ctx,C,x+0.012,y,z+0.004,w,h,0.08,mix(col,[255,255,255],0.75),{edge:0.4});ibox(ctx,C,x,y,z,w,h,0.012,col,{edge:0.5});
  if(fn)surfDraw(ctx,C,v3(x,y+h,z-0.002),v3(1,0,0),v3(0,1,0),fn);}
// a dashed gold arc between two points of the world, drawn with the words (u: how much of it is drawn); o.label sits on its top
function os_arc(C,a,b,u,o){o=o||{};if(u<=0.01)return;lbAdd(c=>{const A=pj(C,a),B=pj(C,b);if(A.z<NEAR||B.z<NEAR)return;const mx=(A.x+B.x)/2,my=Math.min(A.y,B.y)-(o.lift||90);c.save();
  c.strokeStyle=rgba(PAL.gold,0.95);c.lineWidth=5;c.lineCap="round";c.setLineDash([14,12]);c.beginPath();const n=24;for(let i=0;i<=n*u;i++){const s=i/n,x=(1-s)*(1-s)*A.x+2*s*(1-s)*mx+s*s*B.x,y=(1-s)*(1-s)*A.y+2*s*(1-s)*my+s*s*B.y;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();
  const la=o.la==null?1:o.la;if(o.label&&la>0.01)os_board(c,mx,(A.y+B.y)/4+my/2+(o.size||56)*0.9,o.label,Object.assign({},o,{a:clamp(la*1.6,0,1),k:0.7+0.3*spring(clamp(la,0,1))}));});}

// ---- the wheel (chapter 6): a signpost on each path, its board drawn with the words; a ring traced round the green ----
const OS_POSTR=7.6;
const os_postP=(k,y)=>{const a=(18+36*k)*DEG;return v3(OS_POSTR*Math.sin(a),y||0,OS_POSTR*Math.cos(a));};
function os_signpost(ctx,C,k,u,lab){if(u<=0.01)return;const p=os_postP(k),h=1.7*spring(u);tPost(ctx,C,p.x,p.z,h);if(!lab)return;const P_=pj(C,v3(p.x,h+0.12,p.z));if(P_.z<NEAR)return;
  lbAdd(c=>{c.save();c.translate(P_.x,P_.y);const s=0.7+0.3*spring(u);c.scale(s,s);signBoard(c,0,0,OS_AREAS[k],{size:28,w:800,bg:[255,252,244],rim:[150,104,66],a:clamp(u*2,0,1)*lab});c.restore();});}
// a dashed gold ring round the green at radius r (u: how much of it is drawn), with the words
function os_ring(C,r,u,y){if(u<=0.01)return;lbAdd(c=>{c.save();c.strokeStyle=rgba(PAL.gold,0.95);c.lineWidth=5;c.setLineDash([16,12]);c.lineCap="round";c.beginPath();let on=false;
  for(let i=0;i<=96*u;i++){const a=i/96*TAU,P_=pj(C,v3(r*Math.sin(a),y||0.05,r*Math.cos(a)));if(P_.z<NEAR){on=false;continue;}on?c.lineTo(P_.x,P_.y):c.moveTo(P_.x,P_.y);on=true;}c.stroke();c.restore();});}

// ---- a sheet turned over where it lies, about its left edge (th: 0 to PI); fn writes on its face while it can be seen ----
function os_pageFlip(ctx,C,x0,z0,x1,z1,y,th,fn){const w=x1-x0,cs=Math.cos(th),sn=Math.sin(th),P=(u,z)=>v3(x0+u*cs,y+0.004+u*sn,z);
  fq3(ctx,C,x0-(th>1.2?w:0)+0.01,z0-0.008,x0+(th>1.2?0:w)+0.01,z1-0.008,y+0.001,[120,100,80],{a:0.18*(Math.abs(cs)*0.6+0.4)});
  poly3(ctx,C,[P(0,z0),P(w,z0),P(w,z1),P(0,z1)],th<Math.PI/2?[255,252,244]:[244,240,230],{edge:0.4});
  if(fn&&th<1.35)surfDraw(ctx,C,v3(x0,y+0.005,z1),v3(cs,sn,0),v3(0,0,1),fn);}
// a pen lying on the desk
function os_pen(ctx,C,x,z,y){ibox(ctx,C,x,y,z,0.15,0.012,0.012,[44,56,92],{edge:0.3});ibox(ctx,C,x+0.15,y,z,0.025,0.012,0.012,[200,170,90],{edge:0.3});}
// Jun's screen once the agreement runs: a test that passes
function os_testScreen(c,u){c.fillStyle="#f6f9fc";c.fillRect(0,0,102,62);if(u<=0)return;c.save();c.globalAlpha*=clamp(u*2,0,1);const k=0.7+0.3*spring(u);
  c.translate(51,26);c.scale(k,k);c.fillStyle=rgba([70,160,100],1);c.beginPath();c.arc(0,0,12,0,TAU);c.fill();c.strokeStyle="#fff";c.lineWidth=3;c.lineCap="round";c.lineJoin="round";
  c.beginPath();c.moveTo(-5.5,0.5);c.lineTo(-1.5,4.5);c.lineTo(6,-4.5);c.stroke();c.restore();
  Tw(c,"test passed",51,52,{w:800,size:9,align:"center",color:rgba([50,120,76],clamp(u*2,0,1))});}
// a pin, drawn with the words so it sits on top of the poster
const os_pinQ=(C,p,u)=>lbAdd(c=>os_pin(c,C,p,u,1.75));
// a gold ring round a step of the loop poster, once it's pinned (r: the ring's radius in metres)
const os_stepRing=(C,p,r,u)=>lbAdd(c=>{const P_=pj(C,p);if(P_.z<NEAR||u<=0)return;c.save();c.globalAlpha*=clamp(u*1.5,0,1);c.strokeStyle=rgba(PAL.gold,0.95);c.lineWidth=Math.max(3,0.02*P_.s);
  c.beginPath();c.arc(P_.x,P_.y,r*P_.s*(1.12-0.12*spring(u)),0,TAU);c.stroke();c.restore();});

// ---- 10 · the series: nine binders for the policy films, six cards for the films on the tools ----
const OS_NEEDS=["Who decides","One word, one home","Who may see it","Rules that run","Fixed where it starts","Change without surprises","A product with an owner","An agent that checks","Teachers of data"];
const OS_TOOLS=[["Governed in dbt",["dbt"]],["Governed in Unity Catalog",["databricks"]],["Meaning on the platform",["databricks"]],["Quality on the platform",["dbt","databricks"]],["Products in open formats",["databricks"]],["The marketplace",["databricks"]]];
// which of the shelf's binders (row, place) stands for each policy film; the first is the one Yusuf takes
const OS_SHELF9=[[2,7],[3,2],[1,5],[2,1],[3,6],[1,1],[3,4],[1,7],[2,5]];
// each binder on the shelf, as tShelf lays them out (rows 1 to 3, places 0 to 10): its left edge, width and height, across the office
const OS_SHELFB=[0,1,2,3].map(r=>{if(!r)return null;const SX=-2.22,rh=(2.22-0.1)/4,bs=[];let bx=SX+0.09;for(let j=0;j<20;j++){const bw=0.12+0.03*hash(r*31+j,3),bh=Math.min(rh-0.1,0.4+0.05*hash(r*17+j,5));
  if(bx+bw>SX+1.85-0.08)break;bs.push([bx,bw,bh]);bx+=bw+0.012;}return bs;});
// a gold label on a binder that has come forward by out metres, with the number of its film
function os_binderTag(ctx,C,r,j,out,num,a){const [x0,w,h]=OS_SHELFB[r][j],y0=0.3+0.05+r*(2.22-0.1)/4+0.045,z=3.18-0.009-out;
  wq3(ctx,C,x0+w*0.14,y0+h*0.5,x0+w*0.86,y0+h*0.86,z,mix([250,246,234],[244,190,70],a));
  if(a>0.3)surfDraw(ctx,C,v3(x0+w*0.14,y0+h*0.86,z-0.001),v3(1,0,0),v3(0,1,0),c=>Tw(c,String(num),w*36,h*24,{w:800,size:6,align:"center",color:rgba([110,70,20],clamp(a*2-0.6,0,1))}));}
// the list of the policy films, its rows showing as their binders come forward (u[k]: 0 to 1); hi lights the first
function os_needsList(c,x,y,u,hi,a){if(a<=0.01)return;const rw=486,rh=52,top=86,h=top+u.reduce((s_,v)=>s_+easeCam(v),0)*rh+18;c.save();c.globalAlpha*=a;
  c.fillStyle="rgba(40,44,70,0.22)";rr(c,x+6,y+10,rw,h,22);c.fill();c.fillStyle="#fffaf0";rr(c,x,y,rw,h,22);c.fill();c.strokeStyle=rgba([214,170,90],0.9);c.lineWidth=3;rr(c,x+10,y+10,rw-20,h-20,16);c.stroke();
  T(c,"What governance needs",x+rw/2,y+58,{w:800,size:32,align:"center",color:rgba([120,88,40],1)});
  // the list unrolls: rows still below the board's edge are cut off by it
  c.beginPath();c.rect(x,y,rw,h-12);c.clip();
  OS_NEEDS.forEach((s,k)=>{const v=u[k];if(v<=0.01)return;const ry=y+top+k*rh,dx=(1-easeCam(v))*30;c.save();c.globalAlpha*=clamp(v*2,0,1);
    if(k===0&&hi>0){c.fillStyle=rgba([255,226,150],hi);rr(c,x+18,ry+2,rw-36,rh-6,12);c.fill();}
    c.fillStyle=rgba(PAL.gold,1);c.beginPath();c.arc(x+52+dx,ry+rh/2,20,0,TAU);c.fill();Tw(c,String(k+2),x+52+dx,ry+rh/2+8.5,{w:800,size:k===8?21:24,align:"center",color:"#fff"});
    T(c,s,x+86+dx,ry+rh/2+11,{w:700,size:30,color:rgba(PAL.ink,1)});c.restore();});c.restore();}
// a binder held out in front, its title on the label (lines in the figure's units)
function os_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+16,-h/2+26,w-32,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,34);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+72+i*40-(lines.length-1)*8));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// a card on the data team's cork board for one of the films on the tools (in centimetres: 70 x 54, from its top left)
function os_toolCard(c,k,u){const [s,tools]=OS_TOOLS[k];c.save();c.globalAlpha*=clamp(u*2,0,1);
  c.fillStyle="rgba(60,40,20,0.28)";c.fillRect(1.2,1.6,70,54);c.fillStyle=k%2?"#f3f8ff":"#fffaf0";c.fillRect(0,0,70,54);
  c.fillStyle=rgba([90,130,200],1);c.fillRect(0,0,70,3);
  c.fillStyle=rgba([60,90,150],1);c.beginPath();c.arc(9,13,5.6,0,TAU);c.fill();Tw(c,String(k+11),9,15.2,{w:800,size:5.4,align:"center",color:"#fff"});
  let lx=19;tools.forEach(id=>{lx+=logo(c,id,lx,8.6,8.4)+3;});
  const words=s.split(" "),lines=[];let cur="";c.font=font(800,6.4);words.forEach(w=>{const tr=cur?cur+" "+w:w;if(c.measureText(tr).width>60&&cur){lines.push(cur);cur=w;}else cur=tr;});lines.push(cur);
  lines.forEach((l,i)=>Tw(c,l,35,34+i*8.6-(lines.length-1)*4,{w:800,size:6.4,align:"center",color:rgba(PAL.ink,1)}));c.restore();}
