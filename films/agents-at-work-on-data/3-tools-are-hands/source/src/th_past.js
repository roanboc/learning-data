/* ===== Tools are hands, and every hand is a permission: Oxford's old library =====
   The long room, drawn in the module's matte way and in its own palette: honey limestone, dark oiled oak, a ceiling of beams (the
   1400s) or of plain painted panels (from 1602), diamond-paned windows down the right-hand wall, and the light falling from them onto
   the boards. It is one room in three dimensions, seen through three cameras: the wide view down its length from the near end, a
   closer one over the lecterns on the right, and a long one down the aisle, behind people. Its furniture is the 1400s' lecterns,
   with books lying on them on short chains, or, from 1602, Bodley's oak cases standing out from the walls, each with shelves of
   books set fore-edge out, a chain from each book to a rod, and a sloping desk and a bench. Nothing here is a copy of a painting, a
   print or a photograph, and no coat of arms is drawn. Metres throughout: x across the room (the aisle at 0), y up, z down it. */

const TH_RM={hw:4.6,ht:5.8,z0:3.2,bay:2.3,n:9,end:24.6,aisle:1.15};
// the cameras: where they stand (cx, cz), their eye's height, their lens (f, px) and the horizon's place in the frame
const TH_WIDE={f:760,eye:1.75,hz:470,cx:0,cz:0.9};
const TH_MED={f:1800,eye:1.8,hz:360,cx:1.1,cz:0.6};
const TH_DEEP={f:1900,eye:1.6,hz:430,cx:0,cz:-3.0};
const th_P=(K,x,y,z)=>{const d=Math.max(0.02,z-K.cz);return[960+K.f*(x-K.cx)/d,K.hz-K.f*(y-K.eye)/d];};
const th_k=(K,z)=>K.f/Math.max(0.02,z-K.cz);                      // px a metre at depth z
const th_zi=i=>TH_RM.z0+TH_RM.bay*i;                              // the front of the case (lectern or bookcase) of bay i
function th_path(c,K,pts){pts.forEach((p,i)=>{const q=th_P(K,p[0],p[1],p[2]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();}
function th_poly(c,K,pts,col,a){c.fillStyle=typeof col==="string"||col instanceof CanvasGradient?col:rgba(col,a==null?1:a);c.beginPath();th_path(c,K,pts);c.fill();}
function th_line(c,K,p,q){const a=th_P(K,p[0],p[1],p[2]),b=th_P(K,q[0],q[1],q[2]);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
// draws fn in metres (y up) on the upright plane at depth z, which the camera sees square on
function th_face(c,K,z,fn){const k=th_k(K,z),d=z-K.cz;c.save();c.translate(960-K.f*K.cx/d,K.hz+K.f*K.eye/d);c.scale(k,-k);fn(c,k);c.restore();}
// a linear gradient between two points of the room
function th_grad(c,K,p,q,stops){const a=th_P(K,p[0],p[1],p[2]),b=th_P(K,q[0],q[1],q[2]),g=c.createLinearGradient(a[0],a[1],b[0],b[1]);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;}
const th_lit=(col,u)=>mix(col,[255,244,220],u);
const th_dim=(col,u)=>mix(col,[34,24,16],u);

/* ---------------------------------------------------------------- the room's shell
   o.era "15" (a ceiling of plain beams and boards) or "02" (painted panels); o.shafts, how strongly the light shows in the air */
const TH_SUN=[-0.8,-0.6,-0.12];                                    // the light's way: from the right-hand windows, down and across
function th_winOutline(zb){const pts=[];for(let k=0;k<=12;k++){const u=k/12;pts.push([zb-0.6+1.2*u,4.0+0.5*Math.pow(1-Math.pow(Math.abs(2*u-1),1.25),0.55)]);}
  return [[zb+0.6,1.3],[zb-0.6,1.3]].concat(pts);}                  // (z, y) on the wall: the sill, then the four-centred head
function th_window(c,K,zb,o){const R=TH_RM,X=R.hw,G=X+0.24,out=th_winOutline(zb);
  // the reveal: the far jamb's face and the sill, both towards us, in the light that comes in round them
  th_poly(c,K,[[X,1.3,zb+0.6],[G,1.3,zb+0.6],[G,4.05,zb+0.6],[X,4.05,zb+0.6]],th_lit(TH.stone,0.08));
  th_poly(c,K,[[X,1.3,zb-0.6],[G,1.3,zb-0.6],[G,1.3,zb+0.6],[X,1.3,zb+0.6]],th_lit(TH.stone,0.3));
  // the glass, pale and bright, its top brighter, with its diamond leading
  const gl=out.map(p=>[G,p[1],p[0]]);const g=th_grad(c,K,[G,1.3,zb],[G,4.4,zb],[[0,rgba(TH.glass,1)],[1,rgba(TH.glassLt,1)]]);th_poly(c,K,gl,g);
  c.save();c.beginPath();th_path(c,K,gl);c.clip();c.strokeStyle=rgba(TH.lead,0.42);c.lineWidth=Math.max(0.6,th_k(K,zb)*0.008);c.beginPath();
  for(let s=-3.4;s<3.6;s+=0.13){th_line(c,K,[G,1.3,zb-0.6+s],[G,4.6,zb-0.6+s+3.3]);th_line(c,K,[G,1.3,zb+0.6-s],[G,4.6,zb+0.6-s-3.3]);}c.stroke();c.restore();
  // the stone mullion and transom, in front of the glass
  const M=X+0.12,mw=0.045;th_poly(c,K,[[M,1.3,zb-mw],[M,1.3,zb+mw],[M,4.45,zb+mw],[M,4.45,zb-mw]],th_lit(TH.stone,0.1));
  th_poly(c,K,[[M,2.86,zb-0.6],[M,2.86,zb+0.6],[M,2.94,zb+0.6],[M,2.94,zb-0.6]],th_lit(TH.stone,0.1));
  // the soft bloom of the daylight round it
  const m=th_P(K,G,2.9,zb),r=th_k(K,zb)*1.5;th_light(c,m[0],m[1],r,r*1.25,o&&o.bloom!=null?o.bloom:0.42,[255,250,236]);}
// where a window's light falls on the floor: its outline carried along the sun's way to y = 0
function th_patch(zb){return th_winOutline(zb).map(([z,y])=>{const t=y/-TH_SUN[1];return[TH_RM.hw+0.24+TH_SUN[0]*t,0,z+TH_SUN[2]*t];});}
function th_shell(c,K,o){o=o||{};const R=TH_RM,zN=K.cz+0.15,zE=R.end,hw=R.hw,ht=R.ht,era=o.era||"02";
  // the floor: oak boards down the room, paler far off, darker near us
  const FL=[[-hw,0,zN],[hw,0,zN],[hw,0,zE],[-hw,0,zE]];
  th_poly(c,K,FL,th_grad(c,K,[0,0,zE],[0,0,zN+0.4],[[0,rgba(th_lit(TH.floor,0.22),1)],[1,rgba(th_dim(TH.floor,0.1),1)]]));
  c.save();c.beginPath();th_path(c,K,FL);c.clip();c.lineWidth=1.2;c.strokeStyle="rgba(60,40,24,0.15)";c.beginPath();
  for(let x=-hw+0.23;x<hw;x+=0.23)th_line(c,K,[x,0,zN],[x,0,zE]);c.stroke();
  const Rn=ag_rnd(41);c.beginPath();for(let k=0;k<220;k++){const x=-hw+0.23*Math.floor(Rn()*40),z=zN+0.3+Rn()*(zE-zN-0.3);th_line(c,K,[x,0,z],[x+0.23,0,z]);}c.stroke();c.restore();
  // the walls: honey limestone in courses; the left in the windows' light, the right darker round its windows
  for(const sd of [-1,1]){const X=sd*hw,WL=[[X,0,zN],[X,ht,zN],[X,ht,zE],[X,0,zE]];
    th_poly(c,K,WL,th_grad(c,K,[X,2.5,zN+1],[X,2.5,zE],sd<0?[[0,rgba(th_dim(TH.stone,0.04),1)],[1,rgba(th_lit(TH.stone,0.22),1)]]
      :[[0,rgba(th_dim(TH.stoneDk,0.2),1)],[1,rgba(th_lit(TH.stoneDk,0.25),1)]]));
    c.save();c.beginPath();th_path(c,K,WL);c.clip();c.strokeStyle=sd<0?"rgba(120,92,58,0.12)":"rgba(90,66,42,0.14)";c.lineWidth=1.1;c.beginPath();
    for(let y=0.36;y<ht;y+=0.36)th_line(c,K,[X,y,zN],[X,y,zE]);
    for(let r=0,y=0;y<ht;r++,y+=0.36)for(let z=zN+(r%2)*0.3;z<zE;z+=0.6)th_line(c,K,[X,y,z],[X,y+0.36,z]);c.stroke();c.restore();
    // the deep frieze of oak under the ceiling
    th_poly(c,K,[[X,ht-0.42,zN],[X,ht,zN],[X,ht,zE],[X,ht-0.42,zE]],sd<0?th_dim(TH.oak,0.12):th_dim(TH.oak,0.32));}
  for(let b=0;b<R.n;b++)th_window(c,K,th_zi(b)+1.45,o);
  // the far wall, square on: limestone, and its great window of three lights
  th_face(c,K,zE,(x,k)=>{x.fillStyle=rgba(th_lit(TH.stone,0.12),1);x.fillRect(-hw,0,2*hw,ht);x.strokeStyle="rgba(120,92,58,0.12)";x.lineWidth=1.1/k;x.beginPath();
    for(let y=0.36,r=1;y<ht;y+=0.36,r++){x.moveTo(-hw,y);x.lineTo(hw,y);for(let z=-hw+(r%2)*0.3;z<hw;z+=0.6){x.moveTo(z,y);x.lineTo(z,y+0.36);}}x.stroke();
    x.fillStyle=rgba(th_dim(TH.oak,0.3),1);x.fillRect(-hw,ht-0.42,2*hw,0.42);
    const win=cc=>{cc.moveTo(-1.3,1.5);cc.lineTo(1.3,1.5);cc.lineTo(1.3,4.3);for(let k2=12;k2>=0;k2--){const u=k2/12;cc.lineTo(-1.3+2.6*u,4.3+0.6*Math.pow(1-Math.pow(Math.abs(2*u-1),1.25),0.55));}cc.closePath();};
    x.fillStyle=rgba(th_lit(TH.stone,0.3),1);x.beginPath();x.rect(-1.42,1.42,2.84,0.08);x.fill();
    const g=x.createLinearGradient(0,1.5,0,4.9);g.addColorStop(0,rgba(TH.glass,1));g.addColorStop(1,rgba(TH.glassLt,1));x.fillStyle=g;x.beginPath();win(x);x.fill();
    x.save();x.beginPath();win(x);x.clip();x.strokeStyle=rgba(TH.lead,0.4);x.lineWidth=1/k;x.beginPath();for(let s2=-6;s2<6;s2+=0.13){x.moveTo(-1.3+s2,1.5);x.lineTo(-1.3+s2+3.4,4.9);x.moveTo(1.3-s2,1.5);x.lineTo(1.3-s2-3.4,4.9);}x.stroke();x.restore();
    x.fillStyle=rgba(th_lit(TH.stone,0.18),1);for(const mx of [-0.45,0.45])x.fillRect(mx-0.05,1.5,0.1,3.2);x.fillRect(-1.3,3.0,2.6,0.09);});
  {const m=th_P(K,0,3.2,zE),r=th_k(K,zE)*2.8;th_light(c,m[0],m[1],r,r,0.5,[255,250,238]);}
  // the ceiling: in the 1400s plain beams over boards; from 1602, beams and ribs framing painted panels with a pale flower in each
  const CL=[[-hw,ht,zN],[hw,ht,zN],[hw,ht,zE],[-hw,ht,zE]];
  if(era==="15"){th_poly(c,K,CL,th_grad(c,K,[0,ht,zN+2],[0,ht,zE],[[0,rgba(th_dim(TH.oak,0.12),1)],[1,rgba(th_lit(TH.oak,0.28),1)]]));
    c.save();c.beginPath();th_path(c,K,CL);c.clip();c.strokeStyle="rgba(40,26,16,0.2)";c.lineWidth=1.1;c.beginPath();for(let x=-hw+0.3;x<hw;x+=0.3)th_line(c,K,[x,ht,zN],[x,ht,zE]);c.stroke();c.restore();
    for(let k2=R.n;k2>=0;k2--){const z=th_zi(k2)-0.55;if(z<zN+0.2)continue;th_poly(c,K,[[-hw,ht-0.26,z],[hw,ht-0.26,z],[hw,ht-0.26,z+0.22],[-hw,ht-0.26,z+0.22]],th_dim(TH.beam,0.15));
      th_poly(c,K,[[-hw,ht-0.26,z],[hw,ht-0.26,z],[hw,ht,z],[-hw,ht,z]],th_lit(TH.beam,0.18));}}
  else{th_poly(c,K,CL,rgba(TH.beam,1));const nx=6,dzp=R.bay/2;
    for(let z=zE-dzp;z>zN-dzp;z-=dzp){for(let j=0;j<nx;j++){const x0=-hw+j*2*hw/nx+0.05,x1=x0+2*hw/nx-0.1,z0=Math.max(zN,z+0.05),z1=z+dzp-0.05;if(z1<=z0)continue;
        const col=mix((j+Math.round(z/dzp))%2?TH.ceilA:TH.ceilB,TH.beam,0.3),dk=0.08+clamp((z-zN)/(zE-zN),0,1)*-0.06;th_poly(c,K,[[x0,ht,z0],[x1,ht,z0],[x1,ht,z1],[x0,ht,z1]],th_dim(col,dk));
        // the panel's flower, four soft petals, where it's big enough to see
        const pw=th_k(K,z)*(x1-x0);if(pw<22)continue;const cx=(x0+x1)/2,cz=(z0+z1)/2,rr2=Math.min(x1-x0,z1-z0)*0.15;
        for(const [ox,oz] of [[1,0],[-1,0],[0,1],[0,-1]]){const pts=[];for(let q=0;q<10;q++){const an=q/10*TAU;pts.push([cx+ox*rr2*0.8+Math.cos(an)*rr2*0.62,ht,cz+oz*rr2*0.8+Math.sin(an)*rr2*0.62]);}
          th_poly(c,K,pts,mix(col,[236,222,186],0.32),0.8);}
        const pts=[];for(let q=0;q<10;q++){const an=q/10*TAU;pts.push([cx+Math.cos(an)*rr2*0.42,ht,cz+Math.sin(an)*rr2*0.42]);}th_poly(c,K,pts,mix(col,[168,120,56],0.6),0.85);}}}
  th_soft(c,K,o);}
/* the room's soft light, painted at an eighth of the frame's size and laid over it, so its edges are soft for nothing: the sun's
   patches on the floor, its glow on the left wall, and the shade where the walls meet the floor and the ceiling */
function th_soft(c,K,o){const R=TH_RM,q=0.125,[bc,bx]=ag_buf("thsoft",Math.ceil(W*q),Math.ceil(H*q));bx.setTransform(q,0,0,q,0,0);const zN=K.cz+0.2;
  for(let b=0;b<R.n;b++){const zb=th_zi(b)+1.45,pts=th_winOutline(zb).filter(p=>p[1]<=4.01).map(([z,y])=>{const t=y/-TH_SUN[1];return[R.hw+0.24+TH_SUN[0]*t,0,z+TH_SUN[2]*t];});
    th_poly(bx,K,pts,[255,236,190],0.34);
    const m=th_P(K,-R.hw,1.9,zb+0.5),r=th_k(K,zb)*1.3;th_light(bx,m[0],m[1],r,r*1.15,0.22,[255,238,200]);}
  for(const sd of [-1,1]){const X=sd*R.hw;for(let z=Math.max(zN,R.z0-2);z<R.end;z+=1){const z1=Math.min(R.end,z+1);
      bx.fillStyle=th_grad(bx,K,[X,0,z+0.5],[X,0.9,z+0.5],[[0,"rgba(40,26,14,0.3)"],[1,"rgba(40,26,14,0)"]]);bx.beginPath();th_path(bx,K,[[X,0,z],[X,0.9,z],[X,0.9,z1],[X,0,z1]]);bx.fill();
      bx.fillStyle=th_grad(bx,K,[X,R.ht,z+0.5],[X,R.ht-1.0,z+0.5],[[0,"rgba(40,26,14,0.26)"],[1,"rgba(40,26,14,0)"]]);bx.beginPath();th_path(bx,K,[[X,R.ht,z],[X,R.ht-1.0,z],[X,R.ht-1.0,z1],[X,R.ht,z1]]);bx.fill();}}
  c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(bc,0,0,W,H);c.restore();}
// the air, over the furniture: a soft haze far down the room, and the light's shafts from the windows
function th_air(c,K,o){o=o||{};const v=th_P(K,0,1.6,TH_RM.end),g=c.createRadialGradient(v[0],v[1],0,v[0],v[1],th_k(K,TH_RM.end)*9);g.addColorStop(0,"rgba(250,242,224,0.36)");
  g.addColorStop(1,"rgba(250,242,224,0)");c.fillStyle=g;c.fillRect(0,0,W,H);if(o.shafts)th_shafts(c,K,o.shafts);
  const v2=c.createRadialGradient(960,560,420,960,560,1250);v2.addColorStop(0,"rgba(30,20,12,0)");v2.addColorStop(1,"rgba(30,20,12,0.26)");c.fillStyle=v2;c.fillRect(0,0,W,H);
  ag_grain(c,0,0,W,H,0.05,23);}
// the light's shafts in the air, from each window to where its light falls
function th_shafts(c,K,a){const q=0.125,[bc,bx]=ag_buf("thshaft",Math.ceil(W*q),Math.ceil(H*q));bx.setTransform(q,0,0,q,0,0);
  for(let b=0;b<TH_RM.n;b++){const zb=th_zi(b)+1.45,top=th_winOutline(zb).map(([z,y])=>[TH_RM.hw+0.24,y,z]),bot=th_patch(zb);
    const pts=top.concat(bot).map(p=>th_P(K,p[0],p[1],p[2])),hull=th_hull(pts);bx.fillStyle="rgba(255,240,206,"+(0.16*a)+")";bx.beginPath();hull.forEach((p,i)=>i?bx.lineTo(p[0],p[1]):bx.moveTo(p[0],p[1]));bx.closePath();bx.fill();}
  c.save();c.globalCompositeOperation="screen";c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(bc,0,0,W,H);c.restore();}
// the convex hull of points in the frame (Andrew's monotone chain)
function th_hull(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}
  for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}
  up.pop();lo.pop();return lo.concat(up);}

/* ---------------------------------------------------------------- a chain in the room
   from a to b (points of the room), len metres long, so it sags; drawn link by link where the links are big enough to see, else
   as a fine dotted line; o.a */
function th_chain3(c,K,a,b,len,o){o=o||{};const al=o.a==null?1:o.a;if(al<=0)return;const d=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),sag=Math.sqrt(Math.max(0,len*len-d*d))*0.5;
  const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push(th_P(K,lerp(a[0],b[0],u)+(o.sw||0)*u*u,lerp(a[1],b[1],u)-sag*4*u*(1-u),lerp(a[2],b[2],u)));}
  const L=th_k(K,(a[2]+b[2])/2)*0.03;c.save();c.globalAlpha*=al;c.lineCap="round";
  if(L<4){c.strokeStyle=rgba(TH.iron,0.85);c.lineWidth=Math.max(0.8,L*0.42);c.setLineDash([Math.max(1,L*0.7),Math.max(0.8,L*0.35)]);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.setLineDash([]);c.restore();return;}
  // links along the curve, one round, the next seen edge on, each turned with it and with a glint along its top
  const acc=[0];for(let i=1;i<pts.length;i++)acc.push(acc[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const tot=acc[acc.length-1],n=Math.max(3,Math.round(tot/L));
  const at=s=>{for(let i=1;i<pts.length;i++)if(s<=acc[i]){const u=(s-acc[i-1])/Math.max(1e-6,acc[i]-acc[i-1]);return[lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u)];}return pts[pts.length-1];};
  const lw=Math.max(1,L*0.16);
  for(let i=0;i<n;i++){const A=at(tot*i/n),B=at(tot*(i+1)/n),l=Math.hypot(B[0]-A[0],B[1]-A[1]);c.save();c.translate((A[0]+B[0])/2,(A[1]+B[1])/2);c.rotate(Math.atan2(B[1]-A[1],B[0]-A[0]));
    c.strokeStyle=rgba(i%2?th_dim(TH.iron,0.25):TH.iron,0.95);c.lineWidth=lw;c.beginPath();if(i%2){c.moveTo(-l*0.56,0);c.lineTo(l*0.56,0);}else c.ellipse(0,0,l*0.6,Math.max(1.2,L*0.2),0,0,TAU);c.stroke();
    c.strokeStyle="rgba(236,230,220,0.38)";c.lineWidth=lw*0.45;c.beginPath();c.moveTo(-l*0.3,-lw*0.55);c.lineTo(l*0.2,-lw*0.55);c.stroke();c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the 1400s: lecterns
   Each stands out from the wall to the aisle: a desk sloping up from its front edge to a ridge and down again behind, on a solid
   base, with a bench before it. i its bay, sd the side (-1 left, 1 right). The books lie on its near slope, four to a desk. */
const TH_LECT={y0:0.95,y1:1.28,dz:0.35,xa:1.3,xw:4.25};
function th_lect(c,K,i,sd,o){o=o||{};const z=th_zi(i),L=TH_LECT,xa=sd*L.xa,xw=sd*L.xw,xm=(xa+xw)/2,ox=o.col||TH.oak,lit=sd<0?0.18:0;
  // its soft shadow on the boards, then what shows under the desk: the spine board deep in shade, a stretcher, the posts
  th_poly(c,K,[[xa+sd*0.04,0,z-0.06],[xw,0,z-0.06],[xw,0,z+0.78],[xa+sd*0.04,0,z+0.78]],[40,26,16],0.2);
  th_poly(c,K,[[xa,0.06,z+L.dz],[xw,0.06,z+L.dz],[xw,0.86,z+L.dz],[xa,0.86,z+L.dz]],th_dim(ox,0.58));
  th_poly(c,K,[[xa,0.12,z+0.3],[xw,0.12,z+0.3],[xw,0.2,z+0.3],[xa,0.2,z+0.3]],th_dim(ox,0.3));
  for(const px of [xm,xw-sd*0.06])th_poly(c,K,[[px-0.035,0,z+0.05],[px+0.035,0,z+0.05],[px+0.035,0.84,z+0.03],[px-0.035,0.84,z+0.03]],th_dim(ox,0.22));
  // its end at the aisle: two posts and a rail under the desk's sloping profile
  const E=th_lit(th_dim(ox,0.06),lit);
  th_poly(c,K,[[xa,0.78,z],[xa,L.y0,z],[xa,L.y1,z+L.dz],[xa,L.y0,z+2*L.dz],[xa,0.78,z+2*L.dz]],E);
  for(const pz of [z+0.02,z+2*L.dz-0.1])th_poly(c,K,[[xa,0,pz],[xa,0.8,pz],[xa,0.8,pz+0.08],[xa,0,pz+0.08]],E);
  th_poly(c,K,[[xa,0.12,z+0.1],[xa,0.2,z+0.1],[xa,0.2,z+2*L.dz-0.1],[xa,0.12,z+2*L.dz-0.1]],th_dim(E,0.1));
  // the near slope, lit as it faces up, a little brighter towards the light
  th_poly(c,K,[[xa,L.y0,z],[xw,L.y0,z],[xw,L.y1,z+L.dz],[xa,L.y1,z+L.dz]],th_grad(c,K,[xa,1.1,z],[xw,1.1,z],[[0,rgba(th_lit(ox,0.22+lit*0.3),1)],[1,rgba(th_lit(ox,0.08),1)]]));
  // its front edge, a lip that keeps a book from sliding, and the rod under it that the chains hang from
  th_poly(c,K,[[xa,0.82,z],[xw,0.82,z],[xw,L.y0+0.02,z],[xa,L.y0+0.02,z]],th_dim(ox,0.05));
  c.strokeStyle=rgba(TH.iron,0.9);c.lineWidth=Math.max(1,th_k(K,z)*0.012);c.beginPath();th_line(c,K,[xa,0.86,z-0.015],[xw,0.86,z-0.015]);c.stroke();
  if(o.bench!==false){const zb=z-0.52;th_poly(c,K,[[xa+sd*0.06,0,zb-0.04],[xw-sd*0.1,0,zb-0.04],[xw-sd*0.1,0,zb+0.34],[xa+sd*0.06,0,zb+0.34]],[40,26,16],0.16);
    for(const lx of [xa+sd*0.14,xm,xw-sd*0.2])th_poly(c,K,[[lx-0.03,0,zb+0.03],[lx+0.03,0,zb+0.03],[lx+0.03,0.4,zb+0.03],[lx-0.03,0.4,zb+0.03]],th_dim(ox,0.3));
    th_poly(c,K,[[xa+sd*0.06,0.45,zb],[xw-sd*0.1,0.45,zb],[xw-sd*0.1,0.45,zb+0.3],[xa+sd*0.06,0.45,zb+0.3]],th_lit(ox,0.14));
    th_poly(c,K,[[xa+sd*0.06,0.4,zb],[xw-sd*0.1,0.4,zb],[xw-sd*0.1,0.45,zb],[xa+sd*0.06,0.45,zb]],th_dim(ox,0.2));}}
// where the lectern's books lie: the k-th book's middle across the room, and a point on the slope (s 0 at the front edge, 1 at the ridge)
const th_bookX=(i,sd,k)=>sd*(1.62+0.72*k+(hash(i*7+k,sd+3)-0.5)*0.08);
function th_slope(z,x,s,up){const L=TH_LECT,n=[0,0.727,-0.686];return[x,L.y0+(L.y1-L.y0)*s+n[1]*(up||0),z+L.dz*s+n[2]*(up||0)];}
const TH_COVERS=[[112,52,40],[78,56,38],[60,72,58],[96,70,44],[118,84,52],[70,46,40]];
/* a book lying on the slope, closed, with its short chain to the rod: lift (0 to 1) carries it up and away and fades it; the chain is
   left hanging from the rod, swinging from the moment it's freed (o.t, o.free the time it was) */
function th_lectBook(c,K,i,sd,k,o){o=o||{};const z=th_zi(i),xb=th_bookX(i,sd,k),hw=0.17,s0=0.14,s1=0.86,th=0.06,col=TH_COVERS[(i*3+k+(sd>0?2:0))%TH_COVERS.length];
  const lift=clamp(o.lift||0,0,1),a=1-ag_sine(clamp((lift-0.3)/0.7,0,1)),rod=[xb+sd*0.04,0.86,z-0.015],len=0.3;
  const dy=ag_eo(lift)*(o.dy==null?0.55:o.dy),dx=-sd*ag_eo(lift)*(o.dx==null?0.2:o.dx);const S=(x,s,u)=>{const p=th_slope(z,x,s,u);return[p[0]+dx,p[1]+dy,p[2]-ag_eo(lift)*0.1];};
  if(a>0.01){c.save();c.globalAlpha*=a;
    // the lower edge (its pages, pale) and the edge towards the aisle, then the cover with its tooled border and corner bosses
    const xe=xb+sd*-hw;  // the edge nearer the aisle
    th_poly(c,K,[S(xb-hw,s0,0),S(xb+hw,s0,0),S(xb+hw,s0,th),S(xb-hw,s0,th)],mix(TH.parch,TH.parchDk,0.4));
    th_poly(c,K,[S(xe,s0,0),S(xe,s1,0),S(xe,s1,th),S(xe,s0,th)],mix(TH.parch,TH.parchDk,0.6));
    th_poly(c,K,[S(xb-hw,s0,th),S(xb+hw,s0,th),S(xb+hw,s1,th),S(xb-hw,s1,th)],th_lit(col,0.12));
    if(th_k(K,z)>120){c.strokeStyle=rgba(th_dim(col,0.35),0.7);c.lineWidth=Math.max(1,th_k(K,z)*0.006);c.beginPath();th_path(c,K,[S(xb-hw+0.03,s0+0.07,th),S(xb+hw-0.03,s0+0.07,th),S(xb+hw-0.03,s1-0.07,th),S(xb-hw+0.03,s1-0.07,th)]);c.stroke();
      c.fillStyle=rgba([196,170,112],0.9);for(const [bx,bs] of [[-1,0],[1,0],[-1,1],[1,1],[0,0.5]]){const p=th_P(K,...S(xb+bx*(hw-0.035),lerp(s0+0.05,s1-0.05,bs),th+0.004)),r=Math.max(1.2,th_k(K,z)*0.011);c.beginPath();c.arc(p[0],p[1],r,0,TAU);c.fill();}}
    c.restore();}
  // the chain: from the rod to the book's lower edge while the book is there, and hanging free once it's gone
  const free=lift>0.25;if(!free)th_chain3(c,K,rod,S(xb+sd*0.02,s0,th*0.5),len);
  else{const u=(o.t||0)-(o.free||0),sw=Math.sin(u*3.2)*0.07*Math.exp(-u*0.45);th_chain3(c,K,rod,[rod[0]+sw,rod[1]-len*0.96,rod[2]+0.01],len);}}
// a lectern's screen outline, for taking it out of the picture whole
function th_lectHull(K,i,sd){const z=th_zi(i),L=TH_LECT,p=[];for(const x of [sd*L.xa,sd*L.xw])for(const y of [0,L.y1+0.02])for(const zz of [z-0.55,z+2*L.dz])p.push(th_P(K,x,y,zz));return th_hull(p);}

/* ---------------------------------------------------------------- from 1602: Bodley's oak cases
   Each stands out from the wall to the aisle: shelves of books set fore-edge out, a chain from each book to an iron rod at its shelf's
   front, a sloping desk under them and a bench before it, and on the end towards the aisle a framed list of what it holds. */
const TH_CASE={dz:0.55,top:2.78,desk:0.94,shelves:[1.06,1.46,1.86,2.26],sh:0.38};
/* a case's front in metres (y up), seen square on at k px a metre: the cupboard, the shelves of books with their chains and rods, the
   cornice, the end board's edge; xa the aisle end, xv as far as it shows. o.chains false leaves the chains to the caller (a close view
   draws them link by link); returns each chain's ends, from the book to the rod */
function th_caseFront(x,k,i,sd,xa,xv,o){o=o||{};const C=TH_CASE,ox=TH.oak,X0=Math.min(xa,xv),X1=Math.max(xa,xv),out=[];
  x.fillStyle=rgba(th_dim(ox,0.18),1);x.fillRect(X0,0,X1-X0,C.desk);
  x.strokeStyle=rgba(th_dim(ox,0.45),0.5);x.lineWidth=1.4/k;for(let px=Math.abs(xa)+0.08;px<Math.abs(xv)-0.05;px+=0.58){x.strokeRect(sd*px,0.12,sd*0.5,C.desk-0.24);}
  x.fillStyle=rgba(th_dim(ox,0.55),1);x.fillRect(X0,C.desk,X1-X0,C.top-C.desk);
  C.shelves.forEach((yb,r)=>{const books=th_shelfBooks(1000+i*31+r*7+(sd>0?500:0),Math.abs(xv)-Math.abs(xa)+0.1,C.sh);
    for(const [bx,w,h,pg,bd,rn] of books){const x0=xa+sd*bx,x1=xa+sd*(bx+w),L=Math.min(x0,x1),Rr=Math.max(x0,x1);
      if(o.skip&&o.skip(r,bx))continue;
      x.fillStyle=rgba(th_dim(bd,0.1),1);x.fillRect(L,yb,Rr-L,h);
      const g=x.createLinearGradient(0,yb,0,yb+h);g.addColorStop(0,rgba(th_lit(pg,0.06),1));g.addColorStop(1,rgba(th_dim(pg,0.2),1));x.fillStyle=g;x.fillRect(L+0.006,yb+0.004,Rr-L-0.012,h-0.008);
      if(k>60){x.strokeStyle=rgba(th_dim(pg,0.3),0.35);x.lineWidth=1/k;x.beginPath();for(let q=1;q<4;q++){const xx=L+(Rr-L)*q/4;x.moveTo(xx,yb+0.01);x.lineTo(xx,yb+h-0.01);}x.stroke();}
      if(k>300){x.fillStyle=rgba([150,124,76],0.9);x.fillRect(sd>0?L+0.002:Rr-0.008,yb+h*0.5,0.006,0.03);}
      const ax=xa+sd*(bx+(sd>0?0.004:w-0.004)),ay=yb+h*0.55;out.push({r,bx,w,h,yb,a:[ax,ay],b:[ax+sd*0.025,yb+0.012]});}
    // the shelf's board under them, and the rod at its front
    x.fillStyle=rgba(th_lit(ox,0.12),1);x.fillRect(X0,yb-0.028,X1-X0,0.028);
    x.strokeStyle=rgba(TH.iron,0.95);x.lineWidth=Math.max(1.2,k*0.012)/k;x.beginPath();x.moveTo(X0,yb+0.012);x.lineTo(X1,yb+0.012);x.stroke();});
  // each book's chain, from its front board down to the rod
  if(o.chains!==false){x.strokeStyle=rgba(th_dim(TH.iron,0.3),0.92);x.lineWidth=Math.max(1.1,k*0.008)/k;if(k>150)x.setLineDash([0.02,0.007]);x.beginPath();
    for(const q of out){x.moveTo(q.a[0],q.a[1]);x.quadraticCurveTo(q.a[0]+sd*0.004,q.yb+0.03,q.b[0],q.b[1]);}x.stroke();x.setLineDash([]);}
  x.fillStyle=rgba(th_dim(ox,0.3),1);x.fillRect(X0,C.top-0.14,X1-X0,0.14);x.fillStyle=rgba(th_lit(ox,0.1),1);x.fillRect(X0,C.top-0.15,X1-X0,0.02);
  x.fillStyle=rgba(th_lit(ox,0.18),1);x.fillRect(sd<0?xa-0.05:xa,0,0.05,C.top);
  return out;}
// the books of one shelf, fore-edge out, from the aisle end outwards: [x0, width, height, colour of the pages, colour of the boards]
function th_shelfBooks(seed,len,rowH){const R=ag_rnd(seed),out=[];let x=0.03;while(x<len){const w=0.035+R()*0.05,h=Math.min(rowH-0.02,0.24+R()*0.11+(R()<0.1?0.05:0));
    const r0=R(),pg=r0<0.12?mix([150,118,84],[120,92,64],R()):mix([214,194,152],[172,142,100],R()),bd=TH_COVERS[Math.floor(R()*TH_COVERS.length)];out.push([x,w,h,pg,bd,R()]);x+=w+(R()<0.08?0.02:0.003);}return out;}
function th_case(c,K,i,sd,o){o=o||{};const z=th_zi(i),C=TH_CASE,xa=sd*TH_RM.aisle,xw=sd*TH_RM.hw,ox=TH.oak;
  // how far along this case's front the picture can see it: past the nearer case's end, and inside the frame
  const dd=z-K.cz,X3=sx=>K.cx+(sx-960)*dd/K.f,cut=x=>sd<0?Math.max(xw,x):Math.min(xw,x);let lim=cut(X3(sd<0?0:W)+sd*0.1);
  if(i>0)lim=sd<0?Math.max(lim,X3(th_P(K,xa,1,th_zi(i-1)+C.dz)[0])-0.25):Math.min(lim,X3(th_P(K,xa,1,th_zi(i-1)+C.dz)[0])+0.25);
  const xv=sd<0?Math.min(lim,xa-0.05):Math.max(lim,xa+0.05);
  // the end towards the aisle, oak panelled, its list of books framed at eye height
  const lit=sd<0?0.2:0;
  th_poly(c,K,[[xa,0,z],[xa,C.top,z],[xa,C.top,z+C.dz],[xa,0,z+C.dz]],th_lit(th_dim(ox,0.05),lit));
  th_poly(c,K,[[xa,C.top-0.14,z],[xa,C.top,z],[xa,C.top,z+C.dz],[xa,C.top-0.14,z+C.dz]],th_dim(ox,0.3));
  if(th_k(K,z)*C.dz>10){th_poly(c,K,[[xa,1.3,z+0.09],[xa,2.08,z+0.09],[xa,2.08,z+C.dz-0.09],[xa,1.3,z+C.dz-0.09]],th_dim(ox,0.3));
    th_poly(c,K,[[xa,1.35,z+0.13],[xa,2.03,z+0.13],[xa,2.03,z+C.dz-0.13],[xa,1.35,z+C.dz-0.13]],th_dim(TH.parch,0.16-lit*0.3));
    if(th_k(K,z)*C.dz>40){c.strokeStyle=rgba(TH.ink,0.35);c.lineWidth=Math.max(0.8,th_k(K,z)*0.005);c.beginPath();for(let y=1.92;y>1.42;y-=0.06)th_line(c,K,[xa,y,z+0.16],[xa,y,z+C.dz-0.16-(y*37%1)*0.08]);c.stroke();}}
  // the front: the cupboard under the desk, the shelves and their books and chains, the cornice
  th_face(c,K,z,(x,k)=>th_caseFront(x,k,i,sd,xa,xv));
  // the sloping desk, and the bench before it
  const zd=z-0.42;th_poly(c,K,[[xa,C.desk,z],[xv,C.desk,z],[xv,0.86,zd],[xa,0.86,zd]],th_lit(ox,0.2));
  th_poly(c,K,[[xa,0.82,zd],[xv,0.82,zd],[xv,0.86,zd],[xa,0.86,zd]],th_dim(ox,0.1));
  th_poly(c,K,[[xa,0.82,zd],[xa,0.86,zd],[xa,C.desk,z],[xa,0.82,z]],th_dim(ox,0.2));
  if(o.bench!==false){const zb=z-0.98;th_poly(c,K,[[xa+sd*0.05,0.45,zb],[xv,0.45,zb],[xv,0.45,zb+0.3],[xa+sd*0.05,0.45,zb+0.3]],th_lit(ox,0.12));
    th_poly(c,K,[[xa+sd*0.05,0.4,zb],[xv,0.4,zb],[xv,0.45,zb],[xa+sd*0.05,0.45,zb]],th_dim(ox,0.22));
    for(const lx of [xa+sd*0.12,xa+sd*1.2,xa+sd*2.3,xa+sd*3.3])if(Math.abs(lx)<Math.abs(xv))th_poly(c,K,[[lx-0.03,0,zb+0.03],[lx+0.03,0,zb+0.03],[lx+0.03,0.4,zb+0.03],[lx-0.03,0.4,zb+0.03]],th_dim(ox,0.32));}}

/* ---------------------------------------------------------------- the places
   The wide view in the 1400s (its lecterns without their books, which come and go), bare, and from 1602; the closer view over the
   right-hand lecterns (all but the nearest, which the scenes draw); and the long view down the aisle, bare and from 1602 */
function th_hall(c,K,era,what,skip){th_shell(c,K,{era:era==="bare"?"15":era});if(era==="bare")th_marks(c,K);
  for(let i=TH_RM.n-1;i>=0;i--)for(const sd of [-1,1]){if(skip&&skip(i,sd))continue;if(what==="lect")th_lect(c,K,i,sd);else if(what==="case")th_case(c,K,i,sd);}
  th_air(c,K,{shafts:era==="bare"?1:0.28});}
// where the lecterns stood: paler boards, a little less worn
function th_marks(c,K){for(let i=0;i<TH_RM.n;i++)for(const sd of [-1,1]){const z=th_zi(i),L=TH_LECT;th_poly(c,K,[[sd*L.xa,0,z-0.02],[sd*L.xw,0,z-0.02],[sd*L.xw,0,z+0.72],[sd*L.xa,0,z+0.72]],[214,190,150],0.32);}}
AG_PLACES.thHall15=c=>th_hall(c,TH_WIDE,"15","lect");
AG_PLACES.thHallBare=c=>th_hall(c,TH_WIDE,"bare",null);
AG_PLACES.thHall02=c=>th_hall(c,TH_WIDE,"02","case");
AG_PLACES.thMed15=c=>th_hall(c,TH_MED,"15","lect",(i,sd)=>i===0&&sd>0);
AG_PLACES.thDeepBare=c=>th_hall(c,TH_DEEP,"bare",null);
AG_PLACES.thDeep02=c=>th_hall(c,TH_DEEP,"02","case");

// the books on every lectern (but those skip leaves out), each lectern's clipped so the nearer one on its side hides them as it should;
// st(i, sd, k) gives each book's options (lift, t, free)
function th_allBooks(c,K,st,skip){for(let i=TH_RM.n-1;i>=0;i--)for(const sd of [-1,1]){if(skip&&skip(i,sd))continue;c.save();
  if(i>0){const h=th_lectHull(K,i-1,sd);c.beginPath();c.rect(0,0,W,H);h.forEach((p,j)=>j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip("evenodd");}
  for(let k=0;k<4;k++)th_lectBook(c,K,i,sd,k,st?st(i,sd,k):{});c.restore();}}
