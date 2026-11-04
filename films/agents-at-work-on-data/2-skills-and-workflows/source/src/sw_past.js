/* ===== Skills and workflows: Baghdad, about 820 =====
   The opening, drawn in the module's matte way and softly lit from the right, with the place and the time on a tag:
     swRiver   the Tigris at Baghdad in the morning: the far bank's flat roofs and palms, the green dome of the Round City beyond them,
               a brick quay on the near bank; a round boat and a sailing boat are drawn live, on the water
     swCourt   a house's courtyard: lime-plastered walls, a pointed arch, a carved wooden screen, a brick floor
     swStudy   a scholar's room in the House of Wisdom: plaster, a tall pointed window on the right, niches of books, a woven mat
     swBook    close on a low desk: the book open on it, its pages ruled and still blank, a reed pen and an ink pot
   SW_FOLK, the people (specs for the module's ag_person): the scholar, a widow, her son and daughter, two reckoners. No portrait of
   al-Khwarizmi survives: he is drawn as a scholar of his time, in a turban and a robe. Pieces drawn live: sw_table (a low table),
   sw_sheet (a sheet of working), sw_codex (a closed book), sw_square (the drawn square that proves the steps), sw_eq (an equation in
   words, on tiles), sw_forms (the six forms), sw_quffa and sw_sail (boats). Words are on the module's cards, in English; the book's
   pages carry only the drawn square, as its own pages do. Every name starts with sw_ or SW_. */

const SW_PAL={brick:[204,182,148],plaster:[232,222,204],trunk:[124,94,66],palm:[110,126,88],palmDark:[74,90,66],water:[168,182,178],deep:[120,140,140],
  bank:[184,158,122],wood:[118,84,56],woodHi:[178,138,98],ink:[58,44,34],paper:[243,236,219],dome:[118,146,124],tag:[70,50,34]};

/* ---------------------------------------------------------------- the opening's tag, in the frame's own coordinates */
// dk (0 to 1): how dark the place under it is; the tag turns from dark ink to the colour of the pages
function sw_place(ctx,S,text,a,dk){if(a<=0.01)return;setScreen(ctx,S);ag_T(ctx,String(text).toUpperCase(),96,100,{w:700,size:28,ls:4,col:mix(SW_PAL.tag,[238,228,208],clamp(dk||0,0,1)),a});}

/* ---------------------------------------------------------------- painting helpers */
function sw_sky(c,hz,sun){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(196,208,214)");g.addColorStop(0.55,"rgb(224,224,214)");g.addColorStop(1,"rgb(242,232,212)");
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);if(sun){g=c.createRadialGradient(sun[0],sun[1],10,sun[0],sun[1],1000);g.addColorStop(0,"rgba(255,246,222,0.8)");g.addColorStop(0.3,"rgba(255,240,210,0.28)");
    g.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=g;c.fillRect(0,0,W,hz+2);}
  c.save();c.filter="blur(16px)";c.fillStyle="rgba(255,250,240,0.4)";for(const [x,y,w,h] of [[300,120,560,24],[900,70,380,18],[1420,190,460,20],[640,230,300,14]]){c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,TAU);c.fill();}c.restore();}
// a shape along a cubic curve p, w0 wide at its start and w1 at its end, as part of a path
function sw_tube(c,p,w0,w1,n){n=n||16;const L=[],R=[];for(let i=0;i<=n;i++){const u=i/n,q=ag_bz(p,u),q2=ag_bz(p,Math.min(1,u+0.01)),q1=ag_bz(p,Math.max(0,u-0.01)),dx=q2[0]-q1[0],dy=q2[1]-q1[1],d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,u)/2;
    L.push([q[0]-dy/d*w,q[1]+dx/d*w]);R.push([q[0]+dy/d*w,q[1]-dx/d*w]);}
  c.moveTo(L[0][0],L[0][1]);for(const q of L.slice(1))c.lineTo(q[0],q[1]);for(const q of R.reverse())c.lineTo(q[0],q[1]);c.closePath();}
// a date palm: a slender trunk with ring scars, a crown of arching fronds; s its height
function sw_palm(c,x,y,s,lean,seed){const R=ag_rnd(seed||5),tx=x+lean*s*0.3,ty=y-s,p=[x,y,x+lean*s*0.05,y-s*0.4,tx-lean*s*0.05,ty+s*0.3,tx,ty];
  ag_soft(c,cc=>sw_tube(cc,p,s*0.07,s*0.045),SW_PAL.trunk,[214,188,150],tx+s*0.05,ty+s*0.4,s*0.6,"rgba(50,34,20,0.38)",Math.max(3,s*0.03));
  c.save();c.lineCap="round";c.strokeStyle="rgba(70,50,30,0.25)";c.lineWidth=Math.max(1,s*0.006);for(let i=1;i<12;i++){const q=ag_bz(p,i/12),w=s*0.028;c.beginPath();c.moveTo(q[0]-w,q[1]+2);c.lineTo(q[0]+w,q[1]-2);c.stroke();}
  const n=14;for(let i=0;i<n;i++){const an=-Math.PI/2+(i/(n-1)-0.5)*3.5+(R()-0.5)*0.2,L=s*(0.4+R()*0.16),droop=0.55+R()*0.3,
      ex=tx+Math.cos(an)*L,ey=ty+Math.sin(an)*L*0.55+L*droop*0.45,mx=tx+Math.cos(an)*L*0.55,my=ty+Math.sin(an)*L*0.55-L*0.08,lit=Math.cos(an)>0.1;
    c.strokeStyle=rgba(lit?SW_PAL.palm:SW_PAL.palmDark,0.96);c.lineWidth=Math.max(1.5,s*0.012);c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();
    c.lineWidth=Math.max(1,s*0.0065);for(let k=2;k<11;k++){const u=k/11,px=(1-u)*(1-u)*tx+2*(1-u)*u*mx+u*u*ex,py=(1-u)*(1-u)*ty+2*(1-u)*u*my+u*u*ey,ll=s*0.07*(1-u*0.5);
      for(const sd of [-1,1]){c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(an+sd*1.9)*ll*0.5,py+Math.sin(an+sd*1.9)*ll*0.5+ll*0.6);c.stroke();}}}
  c.fillStyle=rgba(SW_PAL.palmDark,1);c.beginPath();c.ellipse(tx,ty+s*0.02,s*0.05,s*0.035,0,0,TAU);c.fill();c.restore();}
// a flat-roofed house of mud brick, plastered, lit from the right; v shifts its lightness; far: fewer details
function sw_house(c,x,y,w,h,v,far){const b=mix(SW_PAL.brick,v>0?[255,248,232]:[96,72,50],Math.abs(v||0));c.fillStyle=rgba(b,1);c.fillRect(x,y,w,h);
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(70,46,26,0.16)");g.addColorStop(0.6,"rgba(70,46,26,0.02)");g.addColorStop(1,"rgba(255,246,226,0.14)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle=rgba(mix(b,[255,248,232],0.22),1);c.fillRect(x-2,y-6,w+4,8);c.fillStyle="rgba(70,46,26,0.18)";c.fillRect(x-2,y+2,w+4,3);
  const R=ag_rnd((x*7+y)|0),n=far?(w>110?2:1):Math.max(1,Math.round(w/90));
  for(let i=0;i<n;i++){const wx=x+w*(i+0.5)/n-(far?5:9)+(R()-0.5)*w*0.12,wy=y+h*(0.25+R()*0.2),ww=far?10:18,wh=far?16:28;
    c.fillStyle="rgba(52,36,26,0.72)";c.fillRect(wx,wy,ww,wh);c.fillStyle="rgba(255,240,210,0.25)";c.fillRect(wx+ww,wy,2,wh);}
  if(!far){c.fillStyle="rgba(60,40,24,0.18)";for(let bx=x+20;bx<x+w-10;bx+=40){c.beginPath();c.ellipse(bx,y+20,5,4.5,0,0,TAU);c.fill();}}}
// the Round City's green dome on its drum, far off: a soft matte shape, its light from the right
function sw_dome(c,x,base,s){const dw=150*s,dh=46*s,top=base-dh;
  ag_soft(c,cc=>cc.rect(x-dw*0.5,top,dw,dh),mix(SW_PAL.brick,[255,248,232],0.1),[255,246,226],x+dw*0.3,top+10,dw*0.6,"rgba(70,46,26,0.25)",10);
  c.fillStyle="rgba(70,46,26,0.2)";for(let k=0;k<7;k++){const ax=x-dw*0.42+k*dw*0.14;c.beginPath();c.moveTo(ax,base-6*s);c.lineTo(ax,top+18*s);c.arc(ax+6*s,top+18*s,6*s,Math.PI,0);c.lineTo(ax+12*s,base-6*s);c.closePath();c.fill();}
  const r=dw*0.46,sh=cc=>{cc.moveTo(x-r,top);cc.bezierCurveTo(x-r,top-r*0.95,x-r*0.2,top-r*1.18,x,top-r*1.32);cc.bezierCurveTo(x+r*0.2,top-r*1.18,x+r,top-r*0.95,x+r,top);cc.closePath();};
  ag_soft(c,sh,SW_PAL.dome,[214,232,214],x+r*0.45,top-r*0.8,r*1.4,"rgba(30,50,40,0.4)",14);
  c.strokeStyle="rgba(60,50,40,0.6)";c.lineWidth=3*s;c.beginPath();c.moveTo(x,top-r*1.32);c.lineTo(x,top-r*1.62);c.stroke();c.fillStyle="rgba(120,100,70,0.9)";c.beginPath();c.arc(x,top-r*1.5,5*s,0,TAU);c.fill();}
// soft plaster: a fill with broad patches, lighter towards the right
function sw_plaster(c,x,y,w,h,base,seed){c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);const R=ag_rnd(seed||3);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.filter="blur(22px)";
  for(let i=0;i<26;i++){const px=x+R()*w,py=y+R()*h,pw=60+R()*160,ph=30+R()*90;c.fillStyle=R()<0.5?"rgba(120,90,60,0.025)":"rgba(255,250,238,0.05)";c.beginPath();c.ellipse(px,py,pw,ph,R()*3,0,TAU);c.fill();}
  c.restore();let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(60,42,26,0.16)");g.addColorStop(0.5,"rgba(60,42,26,0.03)");g.addColorStop(1,"rgba(255,248,230,0.12)");c.fillStyle=g;c.fillRect(x,y,w,h);}
// a pointed arch, as part of a path: its opening from x0 to x1, the springing at ys, the point at yt
function sw_arch(c,x0,x1,ys,yt,yb){const m=(x0+x1)/2,w=x1-x0;c.moveTo(x0,yb);c.lineTo(x0,ys);c.bezierCurveTo(x0,ys-(ys-yt)*0.55,m-w*0.12,yt+(ys-yt)*0.12,m,yt);
  c.bezierCurveTo(m+w*0.12,yt+(ys-yt)*0.12,x1,ys-(ys-yt)*0.55,x1,ys);c.lineTo(x1,yb);c.closePath();}
// a floor of square baked bricks, receding from the wall's foot at y0
function sw_brickFloor(c,y0,col){let g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,rgba(col,1));g.addColorStop(1,rgba(mix(col,[90,60,40],0.18),1));c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.strokeStyle="rgba(110,80,54,0.2)";c.lineWidth=1.5;for(let y=y0;y<H;){const gp=((y-y0)+50)*0.17;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();y+=gp;}
  for(let i=-30;i<40;i++){const xb=960+i*120;c.beginPath();c.moveTo(960+(xb-960)*0.4,y0);c.lineTo(xb+(xb-960)*0.45,H);c.stroke();}
  g=c.createLinearGradient(0,y0,0,y0+80);g.addColorStop(0,"rgba(70,46,26,0.25)");g.addColorStop(1,"rgba(70,46,26,0)");c.fillStyle=g;c.fillRect(0,y0,W,80);}
// the room's soft shade on the left and warmth on the right, over a whole place
function sw_light(c,k){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(50,34,20,"+(0.16*k)+")");g.addColorStop(0.45,"rgba(50,34,20,0)");g.addColorStop(1,"rgba(255,236,200,"+(0.08*k)+")");c.fillStyle=g;c.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- the places */
// the Tigris in the morning: sky, the far bank (and its reflection), the water, the near bank and its quay
AG_PLACES.swRiver=c=>{const bank=500;sw_sky(c,bank,[1680,150]);
  // the far bank drawn on its own layer, so the water can mirror it
  const L=mkCanvas(W,bank+20),lc=L.getContext("2d");sw_dome(lc,1300,410,1.05);
  // a far row of houses, paler with distance, then the nearer row
  const R=ag_rnd(820);let x=-30;while(x<W+40){const w=80+R()*120,h=36+R()*50;sw_house(lc,x,bank-60-h,w,h+60,0.22+R()*0.08,true);x+=w-4;}
  for(const [px,s,ln] of [[120,150,0.1],[520,170,-0.15],[880,140,0.2],[1640,180,-0.1],[1820,150,0.15]])sw_palm(lc,px,bank-20,s,ln,px);
  x=-40;while(x<W+40){const w=110+R()*170,h=52+R()*84;sw_house(lc,x,bank-h,w,h,(R()-0.4)*0.12,true);x+=w-6;}
  for(const [px,s,ln] of [[300,210,0.12],[1090,230,-0.1],[1480,190,0.18]])sw_palm(lc,px,bank+4,s,ln,px+3);
  lc.fillStyle=rgba(SW_PAL.bank,1);lc.fillRect(0,bank-2,W,22);lc.fillStyle="rgba(255,246,226,0.3)";lc.fillRect(0,bank-2,W,2);
  // haze over the far bank: it sits back in the morning air
  let g=lc.createLinearGradient(0,bank-260,0,bank);g.addColorStop(0,"rgba(236,232,220,0.0)");g.addColorStop(1,"rgba(236,230,214,0.22)");lc.fillStyle=g;lc.fillRect(0,0,W,bank+20);
  c.drawImage(L,0,0);
  // the water: deeper and cooler towards us; the far bank mirrored, broken into soft bands
  g=c.createLinearGradient(0,bank+18,0,860);g.addColorStop(0,rgba(mix(SW_PAL.water,[240,232,214],0.3),1));g.addColorStop(1,rgba(SW_PAL.deep,1));c.fillStyle=g;c.fillRect(0,bank+18,W,860-bank-18);
  const Fl=mkCanvas(W/2,110),fc=Fl.getContext("2d");fc.filter="blur(1.5px)";fc.translate(0,110);fc.scale(0.5,-0.5);fc.drawImage(L,0,bank+16-220,W,220,0,0,W,220);
  c.save();c.globalAlpha=0.34;for(let y=0;y<220;y+=6){const dx=Math.sin(y*0.37)*6;c.drawImage(Fl,0,y/2,W/2,3,dx,bank+18+y,W,6);}c.restore();
  c.save();c.globalAlpha=0.5;for(let i=0;i<70;i++){const yy=bank+30+Math.pow(R(),1.4)*300,xx=R()*W,ww=40+R()*180;c.fillStyle=R()<0.6?"rgba(255,250,236,0.35)":"rgba(70,90,92,0.18)";c.fillRect(xx,yy,ww,1.6+(yy-bank)*0.006);}c.restore();
  // the sun's path on the water, off to the right
  c.save();c.translate(1660,640);c.scale(1,0.5);g=c.createRadialGradient(0,0,0,0,0,420);g.addColorStop(0,"rgba(255,248,226,0.3)");g.addColorStop(1,"rgba(255,248,226,0)");c.fillStyle=g;c.fillRect(-500,-500,1000,1000);c.restore();
  // the near bank: earth, reeds at the left; a quay of baked brick on the right, its steps going down into the water
  const nb=cc=>{cc.moveTo(0,820);cc.bezierCurveTo(400,800,800,836,1180,842);cc.lineTo(1180,H);cc.lineTo(0,H);cc.closePath();};
  ag_soft(c,nb,SW_PAL.bank,[232,210,170],700,840,700,"rgba(70,46,26,0.35)",20);
  c.save();c.lineCap="round";for(let t=0;t<16;t++){const cx0=40+R()*900,cy0=830+R()*30;for(let i=0;i<12;i++){const rx=cx0+(R()-0.5)*40,hh=50+R()*80,ln=(R()-0.4)*30;
      c.strokeStyle=rgba(mix(SW_PAL.palmDark,[206,196,150],R()*0.6),0.85);c.lineWidth=2+R()*2;c.beginPath();c.moveTo(rx,cy0);c.quadraticCurveTo(rx+ln*0.2,cy0-hh*0.6,rx+ln,cy0-hh);c.stroke();}}c.restore();
  const qx=1180,qy=772;ag_soft(c,cc=>cc.rect(qx,qy,W-qx,H-qy),[178,140,104],[226,196,160],1700,qy,700,"rgba(70,46,26,0.3)",10);
  for(let k=0;k<4;k++){const sy=qy+k*44,sx=qx+40+k*70;c.fillStyle=rgba(mix([214,184,146],[255,246,226],0.12),1);c.fillRect(sx,sy,W-sx,12);c.fillStyle="rgba(255,248,232,0.55)";c.fillRect(sx,sy,W-sx,1.6);
    c.fillStyle=rgba([170,132,98],1);c.fillRect(sx,sy+12,W-sx,32);c.fillStyle="rgba(70,46,26,0.18)";c.fillRect(sx,sy+12,W-sx,4);
    c.strokeStyle="rgba(110,76,50,0.2)";c.lineWidth=1.2;for(let bx=sx+20+(k%2)*24;bx<W;bx+=48){c.beginPath();c.moveTo(bx,sy+14);c.lineTo(bx,sy+44);c.stroke();}
    c.fillStyle="rgba(70,46,26,0.28)";c.fillRect(sx-6,sy,6,44);}
  c.fillStyle="rgba(255,244,222,0.4)";c.fillRect(qx,qy,W-qx,2);c.fillStyle="rgba(70,46,26,0.3)";c.fillRect(qx,qy,6,H-qy);
  sw_palm(c,250,880,330,0.12,11);sw_palm(c,60,900,400,0.2,17);
  sw_light(c,0.8);};

// a house's courtyard: plaster walls; on the left a deep pointed arch, its stucco band; on the right a carved wooden screen; a brick floor
const SW_COURT={base:720};
AG_PLACES.swCourt=c=>{const base=SW_COURT.base;sw_plaster(c,0,0,W,base,SW_PAL.plaster,21);
  // the arch: its band of carved stucco, the deep shade inside, a glimpse of a room
  const ax0=300,ax1=700;c.fillStyle="rgba(120,92,62,0.14)";c.beginPath();sw_arch(c,ax0-34,ax1+34,330,96,base);c.fill();
  ag_soft(c,cc=>sw_arch(cc,ax0-26,ax1+26,330,104,base),mix(SW_PAL.plaster,[255,250,238],0.2),[255,252,244],ax1,200,400,"rgba(70,46,26,0.25)",12);
  ag_soft(c,cc=>sw_arch(cc,ax0,ax1,330,140,base),[96,72,52],[150,118,86],ax1-60,360,320,"rgba(20,12,6,0.5)",30);
  let g=c.createLinearGradient(ax0,0,ax1,0);g.addColorStop(0,"rgba(20,12,6,0.28)");g.addColorStop(1,"rgba(255,230,190,0.06)");c.fillStyle=g;c.beginPath();sw_arch(c,ax0,ax1,330,140,base);c.fill();
  // the stucco band: two fine lines round the arch, and a row of small lobes between them
  c.save();c.strokeStyle="rgba(120,92,62,0.3)";c.lineWidth=2;c.beginPath();sw_arch(c,ax0-8,ax1+8,330,128,base-2);c.stroke();c.beginPath();sw_arch(c,ax0-20,ax1+20,330,110,base-2);c.stroke();
  c.fillStyle="rgba(120,92,62,0.16)";for(let k=1;k<40;k++){const u=k/40,p=u<0.5?ag_bz([ax0-14,base-12,ax0-14,330-(330-119)*0.55,(ax0+ax1)/2-(ax1-ax0+28)*0.12,119+(330-119)*0.12,(ax0+ax1)/2,119],u*2):
      ag_bz([(ax0+ax1)/2,119,(ax0+ax1)/2+(ax1-ax0+28)*0.12,119+(330-119)*0.12,ax1+14,330-(330-119)*0.55,ax1+14,base-12],u*2-1);c.beginPath();c.arc(p[0],p[1],3.2,0,TAU);c.fill();}c.restore();
  // the wooden screen: a frame, and a lattice of small openings with light behind
  const sx=1330,sy=170,sw=380,sh=420;ag_soft(c,cc=>cc.rect(sx-24,sy-24,sw+48,sh+48),SW_PAL.wood,SW_PAL.woodHi,sx+sw,sy,500,"rgba(30,18,10,0.45)",14);
  c.fillStyle="rgb(250,240,214)";c.fillRect(sx,sy,sw,sh);c.fillStyle=rgba(mix(SW_PAL.wood,[255,240,214],0.08),1);
  for(let yy=sy;yy<sy+sh;yy+=38)for(let xx=sx;xx<sx+sw;xx+=38){c.save();c.translate(xx+19,yy+19);c.beginPath();c.rect(-19,-19,38,38);c.moveTo(0,-13);c.lineTo(13,0);c.lineTo(0,13);c.lineTo(-13,0);c.closePath();c.fill("evenodd");c.restore();}
  c.save();c.globalCompositeOperation="multiply";g=c.createLinearGradient(sx,0,sx+sw,0);g.addColorStop(0,"rgba(180,150,120,1)");g.addColorStop(1,"rgba(255,255,255,1)");c.fillStyle=g;c.fillRect(sx,sy,sw,sh);c.restore();
  c.fillStyle=rgba(mix(SW_PAL.wood,[255,240,214],0.15),1);c.fillRect(sx-40,sy+sh+24,sw+80,18);c.fillStyle="rgba(255,240,214,0.4)";c.fillRect(sx-40,sy+sh+24,sw+80,2);
  // the screen's light on the floor: a soft patch of small diamonds
  sw_brickFloor(c,base,[198,168,130]);
  c.save();c.beginPath();c.rect(0,base,W,H-base);c.clip();c.translate(1440,900);c.scale(1,0.3);g=c.createRadialGradient(0,0,0,0,0,520);g.addColorStop(0,"rgba(255,244,214,0.3)");g.addColorStop(1,"rgba(255,244,214,0)");c.fillStyle=g;c.fillRect(-600,-600,1200,1200);c.restore();
  // the wall's foot: a low plinth
  c.fillStyle=rgba(mix(SW_PAL.plaster,[150,120,90],0.2),1);c.fillRect(0,base-26,W,26);c.fillStyle="rgba(255,250,236,0.4)";c.fillRect(0,base-26,W,2);
  sw_light(c,1);};

// a scholar's room in the House of Wisdom: plaster; niches of books on the left; a tall pointed window on the right, its light on the
// floor; a woven mat
const SW_STUDY={base:700};
AG_PLACES.swStudy=c=>{const base=SW_STUDY.base;sw_plaster(c,0,0,W,base,mix(SW_PAL.plaster,[214,196,166],0.25),33);
  // the window: deep reveal, a pale morning sky, a slim grille; the light it throws across the room
  const wx0=1450,wx1=1720;ag_soft(c,cc=>sw_arch(cc,wx0-30,wx1+30,330,90,640),mix(SW_PAL.plaster,[150,120,90],0.25),[255,246,226],wx0,300,400,"rgba(60,40,24,0.35)",16);
  let g=c.createLinearGradient(0,120,0,620);g.addColorStop(0,"rgb(214,226,232)");g.addColorStop(1,"rgb(246,238,220)");c.fillStyle=g;c.beginPath();sw_arch(c,wx0,wx1,330,120,620);c.fill();
  c.save();c.beginPath();sw_arch(c,wx0,wx1,330,120,620);c.clip();sw_palm(c,1560,640,330,0.1,41);c.fillStyle="rgba(250,244,230,0.35)";c.fillRect(wx0,100,wx1-wx0,540);
  c.strokeStyle="rgba(90,66,44,0.7)";c.lineWidth=5;for(const xx of [wx0+90,wx0+180]){c.beginPath();c.moveTo(xx,100);c.lineTo(xx,620);c.stroke();}for(const yy of [300,460]){c.beginPath();c.moveTo(wx0,yy);c.lineTo(wx1,yy);c.stroke();}c.restore();
  c.fillStyle=rgba(mix(SW_PAL.plaster,[150,120,90],0.3),1);c.fillRect(wx0-44,620,wx1-wx0+88,26);c.fillStyle="rgba(255,248,232,0.45)";c.fillRect(wx0-44,620,wx1-wx0+88,2);
  // niches with books: arched recesses, codices lying flat in piles, a few standing
  for(const [nx,nw] of [[140,280],[480,240]]){const ny0=170,ny1=560;ag_soft(c,cc=>sw_arch(cc,nx,nx+nw,ny0+90,ny0,ny1),mix(SW_PAL.plaster,[120,92,62],0.32),[200,176,140],nx+nw-40,ny0+120,260,"rgba(40,26,14,0.45)",22);
    for(const sy of [ny0+170,ny1-20]){c.fillStyle="rgba(90,64,40,0.35)";c.fillRect(nx,sy,nw,8);c.fillStyle=rgba(SW_PAL.woodHi,1);c.fillRect(nx,sy-4,nw,6);
      const R=ag_rnd(nx+sy);let bx=nx+14;while(bx<nx+nw-70){const piles=2+((R()*4)|0),bw=Math.min(50+R()*34,nx+nw-14-bx);for(let k=0;k<piles;k++){const bh=14+R()*8,by=sy-4-(k+1)*bh;
          const col=[[120,72,52],[92,70,52],[140,104,70],[78,64,58]][(R()*4)|0];ag_soft(c,cc=>ag_rect(cc,bx+(R()-0.5)*6,by,bw,bh-1,3),col,mix(col,[255,236,200],0.4),bx+bw,by,bw,null);
          c.fillStyle="rgba(240,226,196,0.8)";c.fillRect(bx+bw-8+(R()-0.5)*2,by+3,6,bh-7);}bx+=bw+8+R()*8;}}}
  // the floor: a woven reed mat over beaten earth
  g=c.createLinearGradient(0,base,0,H);g.addColorStop(0,"rgb(196,170,132)");g.addColorStop(1,"rgb(168,140,104)");c.fillStyle=g;c.fillRect(0,base,W,H-base);
  c.fillStyle=rgba(mix(SW_PAL.plaster,[150,120,90],0.25),1);c.fillRect(0,base-22,W,22);c.fillStyle="rgba(255,250,236,0.4)";c.fillRect(0,base-22,W,2);
  const mat=cc=>{cc.moveTo(260,base+40);cc.lineTo(1600,base+40);cc.lineTo(1840,H);cc.lineTo(20,H);cc.closePath();};ag_soft(c,mat,[206,180,128],[240,222,178],1300,base+80,900,"rgba(80,56,30,0.3)",16);
  c.save();ag_shape(c,mat);c.clip();c.strokeStyle="rgba(120,92,52,0.22)";c.lineWidth=2;for(let y=base+50;y<H;y+=(y-base)*0.06+8){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  c.strokeStyle="rgba(150,84,60,0.28)";c.lineWidth=10;for(const y of [base+70,H-60]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}c.restore();
  // the window's light, a slanting patch on the floor
  c.save();c.globalCompositeOperation="screen";g=c.createLinearGradient(1500,base,1100,H);g.addColorStop(0,"rgba(255,236,196,0.22)");g.addColorStop(1,"rgba(255,236,196,0)");c.fillStyle=g;
  c.beginPath();c.moveTo(1460,base+30);c.lineTo(1720,base+30);c.lineTo(1500,H);c.lineTo(1020,H);c.closePath();c.fill();c.restore();
  sw_light(c,1);};

// close on the low desk: dark walnut, the book open on it (its pages ruled faintly, still blank), a reed pen and an ink pot on the right
const SW_BOOK={x0:300,x1:1620,y0:110,y1:860,gut:960};
AG_PLACES.swBook=c=>{const B=SW_BOOK;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(96,68,46)");g.addColorStop(1,"rgb(72,50,34)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(77);c.save();c.globalAlpha=0.12;c.strokeStyle="rgb(40,26,16)";c.lineWidth=2;for(let i=0;i<60;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+(R()-0.5)*30,1300,y+(R()-0.5)*30,W,y+(R()-0.5)*20);c.stroke();}c.restore();
  g=c.createRadialGradient(1500,200,50,1300,400,1500);g.addColorStop(0,"rgba(255,230,190,0.18)");g.addColorStop(1,"rgba(255,230,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the book: the cover's edge under the pages, then two pages curving down into the gutter
  ag_floorShadow(c,960-10,B.y1+10,760,40,0.5);
  ag_soft(c,cc=>ag_rect(cc,B.x0-22,B.y0-14,B.x1-B.x0+44,B.y1-B.y0+34,10),[110,62,44],[160,104,76],1500,B.y0,700,"rgba(30,16,8,0.4)",12);
  for(const side of [-1,1]){const xa=side<0?B.x0:B.gut,xb=side<0?B.gut:B.x1,pg=cc=>{cc.moveTo(xa,B.y0+(side<0?6:0));cc.bezierCurveTo(xa+(xb-xa)*0.4,B.y0-12,xb-(xb-xa)*0.2,B.y0-14,xb,B.y0+(side<0?0:6));
      cc.lineTo(xb,B.y1-(side<0?0:6));cc.bezierCurveTo(xb-(xb-xa)*0.2,B.y1+6,xa+(xb-xa)*0.4,B.y1+8,xa,B.y1-(side<0?6:0));cc.closePath();};
    ag_soft(c,pg,SW_PAL.paper,[255,252,240],side<0?B.x0+300:B.x1-200,B.y0+200,700,"rgba(110,84,50,0.22)",24);
    c.save();ag_shape(c,pg);c.clip();g=c.createLinearGradient(B.gut-110,0,B.gut+110,0);g.addColorStop(0,"rgba(120,90,60,0)");g.addColorStop(0.5,"rgba(120,90,60,0.28)");g.addColorStop(1,"rgba(120,90,60,0)");c.fillStyle=g;c.fillRect(B.gut-110,0,220,H);
      c.strokeStyle="rgba(150,120,90,0.25)";c.lineWidth=1.4;c.strokeRect(xa+(side<0?70:60),B.y0+60,(xb-xa)-130,B.y1-B.y0-120);c.restore();}
  // the reed pen and the ink pot, on the right
  c.save();c.translate(1760,620);c.rotate(-0.9);ag_soft(c,cc=>ag_rect(cc,-170,-7,340,14,6),[196,166,116],[240,220,170],60,-6,200,"rgba(60,40,20,0.4)",6);c.fillStyle="rgb(50,40,32)";c.beginPath();c.moveTo(170,-6);c.lineTo(196,0);c.lineTo(170,6);c.closePath();c.fill();c.restore();
  ag_floorShadow(c,1770,860,70,16,0.5);ag_soft(c,cc=>{cc.moveTo(1716,860);cc.bezierCurveTo(1700,790,1730,770,1770,770);cc.bezierCurveTo(1810,770,1840,790,1824,860);cc.closePath();},[86,74,64],[170,150,130],1800,790,90,"rgba(0,0,0,0.4)",10);
  c.fillStyle="rgb(30,24,20)";c.beginPath();c.ellipse(1770,772,26,7,0,0,TAU);c.fill();
  sw_light(c,0.8);};

/* ---------------------------------------------------------------- what they wear: a turban, a small cap, a shawl over the head
   Painted in figure space (people.js): a hat's paint draws over the head, inside the head's picture ([160, 250] to [440, 560]); a
   top's paint draws over the body, before its near arm and its neck. A shawl is both: the head's part frames the face and leaves the
   throat open; the body's part falls over the far shoulder and behind the near arm, meeting the head's part at figure y 560. */
function sw_turban(col){return(c,P)=>{const sh=cc=>{cc.moveTo(400,358);cc.bezierCurveTo(416,328,414,288,380,264);cc.bezierCurveTo(344,242,262,242,220,264);
      cc.bezierCurveTo(186,284,176,342,190,404);cc.bezierCurveTo(222,394,256,382,290,370);cc.bezierCurveTo(330,356,370,352,400,358);cc.closePath();};
  // the turban's soft shadow on the brow, under its edge
  c.save();ag_shape(c,AG_F.head);c.clip();c.strokeStyle=rgba(ag_dk(P.skin,0.55),0.28);c.lineWidth=14;c.filter="blur(5px)";c.beginPath();c.moveTo(196,410);c.bezierCurveTo(240,396,330,366,400,368);c.stroke();c.restore();
  ag_soft(c,sh,col,ag_lt(col,0.5),352,276,170,rgba(ag_dk(col,0.6),0.5),16);
  // the cloth's turns: each a band rising from the back to the front, its lower edge in shade and its upper edge in light
  c.save();ag_shape(c,sh);c.clip();c.lineCap="round";
  for(const [x0,y0,cx,cy,x1,y1] of [[188,392,250,330,404,330],[192,352,262,294,394,290],[214,300,280,262,370,260],[232,396,300,350,404,350]]){
    c.strokeStyle=rgba(ag_dk(col,0.42),0.55);c.lineWidth=5;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(cx,cy,x1,y1);c.stroke();
    c.strokeStyle=rgba(ag_lt(col,0.6),0.6);c.lineWidth=3;c.beginPath();c.moveTo(x0+2,y0-6);c.quadraticCurveTo(cx+2,cy-6,x1+2,y1-6);c.stroke();}
  c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.7);c.lineWidth=2.4;c.beginPath();c.moveTo(190,404);c.bezierCurveTo(222,394,256,382,290,370);c.bezierCurveTo(330,356,370,352,400,358);c.stroke();};}
function sw_cap(col){return(c,P)=>{const f=cc=>{cc.moveTo(210,372);cc.bezierCurveTo(204,316,248,284,300,282);cc.bezierCurveTo(352,282,392,310,394,360);cc.bezierCurveTo(364,350,330,346,296,348);cc.bezierCurveTo(258,350,230,360,210,372);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.35),330,300,120,rgba(ag_dk(col,0.7),0.45),12);c.strokeStyle=rgba(ag_lt(col,0.25),0.5);c.lineWidth=6;c.beginPath();c.moveTo(212,366);c.bezierCurveTo(250,350,330,342,392,354);c.stroke();};}
// the shawl's outline over the head (outer, then the opening for the face and the throat), in figure space
function sw_shawlHead(cc){cc.moveTo(398,330);cc.bezierCurveTo(398,282,352,256,300,258);cc.bezierCurveTo(230,260,184,296,174,364);cc.bezierCurveTo(166,430,164,500,166,560);cc.lineTo(432,560);
  cc.bezierCurveTo(426,500,416,440,412,392);cc.bezierCurveTo(408,364,404,344,398,330);cc.closePath();
  // the opening: the forehead under the shawl's edge, the far cheek and the chin, the throat, the jaw back to the ear, which it covers
  cc.moveTo(276,356);cc.bezierCurveTo(310,342,356,338,386,348);cc.bezierCurveTo(389,368,390,384,390,396);cc.bezierCurveTo(390,404,387,410,386,415);cc.bezierCurveTo(386,424,390,432,391,440);
  cc.bezierCurveTo(394,446,397,451,397,455);cc.bezierCurveTo(397,460,393,463,388,464);cc.bezierCurveTo(386,470,386,478,385,486);cc.bezierCurveTo(384,498,381,508,377,516);
  cc.bezierCurveTo(373,524,368,530,364,536);cc.lineTo(366,560);cc.lineTo(240,560);cc.bezierCurveTo(246,530,256,508,262,488);cc.bezierCurveTo(260,450,262,410,268,384);cc.bezierCurveTo(270,370,272,362,276,356);cc.closePath();}
function sw_shawlBody(cc){cc.moveTo(166,556);cc.lineTo(240,556);cc.bezierCurveTo(238,580,234,600,226,612);cc.bezierCurveTo(196,622,160,630,126,646);cc.bezierCurveTo(140,612,156,580,166,556);cc.closePath();
  cc.moveTo(364,556);cc.lineTo(434,556);cc.bezierCurveTo(462,600,486,660,488,740);cc.bezierCurveTo(490,800,484,850,476,890);cc.bezierCurveTo(450,904,410,900,384,884);
  cc.bezierCurveTo(388,820,386,760,380,700);cc.bezierCurveTo(376,640,372,600,364,556);cc.closePath();}
function sw_shawl(col,hair){const hi=ag_lt(col,0.42),dk=rgba(ag_dk(col,0.6),0.45);return{
  head:(c,P)=>{// the hair at the brow, under the shawl's edge
    c.save();ag_shape(c,AG_F.head);c.clip();c.fillStyle=rgba(hair,1);c.beginPath();c.moveTo(268,392);c.bezierCurveTo(270,376,272,362,276,356);c.bezierCurveTo(310,342,356,338,386,348);
      c.lineTo(388,358);c.bezierCurveTo(356,352,316,354,290,366);c.bezierCurveTo(280,372,274,382,272,396);c.closePath();c.fill();c.restore();
    c.save();c.beginPath();sw_shawlHead(c);c.fillStyle=rgba(col,1);c.fill("evenodd");c.restore();
    c.save();c.beginPath();sw_shawlHead(c);c.clip("evenodd");let g=c.createRadialGradient(360,300,10,330,330,220);g.addColorStop(0,rgba(hi,0.8));g.addColorStop(1,rgba(hi,0));c.fillStyle=g;c.fillRect(160,250,280,310);
      g=c.createLinearGradient(170,0,300,0);g.addColorStop(0,dk);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(160,250,140,310);
      c.strokeStyle=rgba(ag_dk(col,0.5),0.35);c.lineWidth=3;c.lineCap="round";for(const f of [[[210,330],[200,430],[214,540]],[[236,300],[226,420],[232,540]],[[404,380],[412,460],[410,550]],[[300,268],[250,290],[218,330]]]){c.beginPath();c.moveTo(f[0][0],f[0][1]);c.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);c.stroke();}
      c.restore();
    // the edge that frames the face: a fold of the cloth, lit on its top
    c.strokeStyle=rgba(ag_dk(col,0.3),0.8);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(268,384);c.bezierCurveTo(270,370,272,362,276,356);c.bezierCurveTo(310,342,356,338,386,348);c.stroke();
    c.strokeStyle=rgba(hi,0.7);c.lineWidth=2;c.beginPath();c.moveTo(278,350);c.bezierCurveTo(312,336,356,332,386,342);c.stroke();},
  body:(c,P)=>{ag_soft(c,sw_shawlBody,col,hi,440,620,240,dk,16);ag_folds(c,sw_shawlBody,[[[410,610],[440,760],[436,930]],[[394,660],[404,800],[410,940]],[[430,600],[460,700],[456,820]]],rgba(ag_dk(col,0.5),0.3),rgba(hi,0.25));
    c.save();c.beginPath();sw_shawlBody(c);c.clip();c.strokeStyle=rgba(ag_dk(col,0.35),0.6);c.lineWidth=6;c.beginPath();c.moveTo(384,884);c.bezierCurveTo(410,900,450,904,476,890);c.stroke();c.restore();}};}
// a few soft lines of age on a face, in figure space (k 0 to 1): under the near eye, and from the nose to the mouth
function sw_age(c,P,k){c.save();ag_shape(c,AG_F.head);c.clip();c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.3*k);c.lineWidth=2.2;c.lineCap="round";
  c.beginPath();c.moveTo(322,432);c.quadraticCurveTo(334,438,346,433);c.stroke();c.beginPath();c.moveTo(364,466);c.quadraticCurveTo(352,474,346,490);c.stroke();
  c.beginPath();c.moveTo(300,382);c.quadraticCurveTo(330,376,356,380);c.stroke();c.restore();}

/* ---------------------------------------------------------------- the people: specs for ag_person (people.js) */
const SW_SHAWL={widow:sw_shawl([92,84,72],[128,122,118]),daughter:sw_shawl([166,132,126],[30,24,22])};
const SW_FOLK={
  scholar:{key:"sw-scholar",name:"Muhammad ibn Musa al-Khwarizmi",skin:[196,150,112],hair:{style:"cropped",c:[34,28,24]},beard:[40,32,28],
    top:{kind:"overshirt",c:[106,86,70],inner:[228,218,198]},hat:{paint:sw_turban([238,232,218])},breath:0.25},
  widow:{key:"sw-widow",name:"A widow",skin:[204,160,124],hair:{style:"shaved",c:[86,80,78]},top:{kind:"tunic",c:[118,100,94],paint:SW_SHAWL.widow.body},hat:{paint:(c,P)=>{SW_SHAWL.widow.head(c,P);sw_age(c,P,1);}},breath:0.3},
  son:{key:"sw-son",name:"Her son",skin:[194,148,112],hair:{style:"side",c:[30,26,24]},top:{kind:"tunic",c:[146,128,100]},breath:0.31},
  daughter:{key:"sw-daughter",name:"Her daughter",skin:[202,156,120],hair:{style:"shaved",c:[30,24,22]},top:{kind:"tunic",c:[176,154,120],paint:SW_SHAWL.daughter.body},hat:{paint:SW_SHAWL.daughter.head},breath:0.33},
  reckoner:{key:"sw-reckoner",name:"A reckoner",skin:[184,136,100],hair:{style:"cropped",c:[150,146,140]},beard:[168,162,154],top:{kind:"overshirt",c:[122,108,90],inner:[222,212,192]},
    hat:{paint:(c,P)=>{sw_turban([212,198,172])(c,P);sw_age(c,P,0.8);}},breath:0.24},
  reckoner2:{key:"sw-reckoner2",name:"Another reckoner",skin:[212,170,134],hair:{style:"side",c:[42,34,28]},beard:[46,36,30],top:{kind:"overshirt",c:[142,122,100],inner:[232,224,206]},
    hat:{paint:sw_cap([64,58,54])},breath:0.28}
};

/* ---------------------------------------------------------------- things on the tables and pages, drawn live */
// a low wooden table, its front edge's top at (x, y), w wide, its top receding d up the frame; o.a
function sw_table(ctx,x,y,w,d,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+w/2-14,y+70,w*0.56,30,0.3);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(mix(SW_PAL.woodHi,[255,240,214],0.1),1));g.addColorStop(1,rgba(SW_PAL.woodHi,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+d*0.3,y-d);ctx.lineTo(x+w-d*0.3,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,240,214,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  g=ctx.createLinearGradient(0,y,0,y+26);g.addColorStop(0,rgba(SW_PAL.wood,1));g.addColorStop(1,rgba(ag_dk(SW_PAL.wood,0.3),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,26);
  ctx.fillStyle=rgba(ag_dk(SW_PAL.wood,0.25),1);for(const lx of [x+18,x+w-48])ctx.fillRect(lx,y+26,30,60);ctx.restore();}
// a sheet of working on a table: rows of short ink strokes (decoration, not words), its own layout for each seed; o.blank
function sw_sheet(ctx,x,y,w,h,rot,seed,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  ctx.shadowColor="rgba(40,26,14,0.3)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(SW_PAL.paper,1);ctx.fillRect(0,0,w,h);ctx.shadowColor="transparent";
  if(!o.blank){const R=ag_rnd(seed);ctx.strokeStyle=rgba(SW_PAL.ink,0.7);ctx.lineWidth=2;ctx.lineCap="round";const rows=Math.floor((h-24)/18),lay=seed%3;
    for(let r=0;r<rows;r++){let xx=12+(lay===1&&r%3===0?w*0.3:0),yy=18+r*18;const end=w-12-(lay===2?R()*w*0.4:R()*w*0.15);while(xx<end){const L=6+R()*22;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+L,yy+(R()-0.5)*2);ctx.stroke();xx+=L+5+R()*6;}}
}
  ctx.restore();}
// a closed book: a leather cover with a tooled border, its pages' edge showing; (x, y) its top left, w by h; col the leather
function sw_codex(ctx,x,y,w,h,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+w/2-6,y+h+4,w*0.6,10,0.35);
  ag_soft(ctx,c=>ag_rect(c,x,y,w,h,6),col,mix(col,[255,236,200],0.35),x+w,y,w,null);ctx.fillStyle="rgba(240,226,196,0.9)";ctx.fillRect(x+4,y+h-8,w-8,5);
  ctx.strokeStyle=rgba(ag_dk(col,0.35),0.6);ctx.lineWidth=2;ctx.strokeRect(x+8,y+6,w-16,h-18);ctx.restore();}

/* the drawn square that proves the steps for "a square and ten roots make thirty-nine": a square of unknown side, two strips five wide
   on two of its sides (half the ten roots each), and the corner of five by five that completes it. (x, y) the top left, u the length of
   the unknown side (the side of five is u*5/3, as the root is 3); o.p (0 to 1) draws the square, o.strips, o.corner, o.side (the whole
   side, 8), o.root (the answer, 3), each 0 to 1; o.a. In ink on the page; the labels are the module's words, at least 28 px */
function sw_square(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=u*5/3,ink=rgba(SW_PAL.ink,0.92);ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const drawRect=(rx,ry,rw,rh,p,fill)=>{if(p<=0)return;if(fill){ctx.fillStyle=fill;ctx.globalAlpha*=clamp(p*2,0,1);ctx.fillRect(rx,ry,rw,rh);ctx.globalAlpha/=Math.max(0.001,clamp(p*2,0,1));}
    ctx.strokeStyle=ink;ctx.lineWidth=4;const per=2*(rw+rh),L=per*p;ctx.beginPath();ctx.moveTo(rx,ry);const pts=[[rx+rw,ry],[rx+rw,ry+rh],[rx,ry+rh],[rx,ry]];let left=L,px=rx,py=ry;
    for(const q of pts){const d=Math.hypot(q[0]-px,q[1]-py);if(left>=d){ctx.lineTo(q[0],q[1]);left-=d;px=q[0];py=q[1];}else{ctx.lineTo(px+(q[0]-px)*left/d,py+(q[1]-py)*left/d);break;}}ctx.stroke();};
  const p=o.p||0,st=o.strips||0,co=o.corner||0;
  drawRect(x,y,u,u,p,"rgba(38,102,132,0.08)");
  drawRect(x+u,y,f,u,st,"rgba(38,102,132,0.05)");drawRect(x,y+u,u,f,st,"rgba(38,102,132,0.05)");
  drawRect(x+u,y+u,f,f,co,"rgba(156,100,18,0.12)");
  const lab=(s,lx,ly,al,col)=>{if(al>0.01)ag_T(ctx,s,lx,ly,{w:700,size:30,align:"center",col:col||SW_PAL.ink,a:al});};
  lab("a square",x+u/2,y+u/2+10,ag_in(p,0.7,0.3));lab("5",x+u+f/2,y-16,st);lab("5",x-24,y+u+f/2+10,st);
  lab("25",x+u+f/2,y+u+f/2+10,co,AG.amber);
  const sd=o.side||0;if(sd>0){ctx.strokeStyle=rgba(AG.green,sd);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y+u+f+30);ctx.lineTo(x+u+f,y+u+f+30);ctx.stroke();
    for(const ex of [x,x+u+f]){ctx.beginPath();ctx.moveTo(ex,y+u+f+20);ctx.lineTo(ex,y+u+f+40);ctx.stroke();}lab("8",x+(u+f)/2,y+u+f+74,sd,AG.green);}
  // the answer: the square's own side, 3, marked in green along its left
  const rt=o.root||0;if(rt>0){ctx.strokeStyle=rgba(AG.green,rt);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-30,y);ctx.lineTo(x-30,y+u*ag_eo(rt));ctx.stroke();
    for(const ey of [y,y+u]){ctx.beginPath();ctx.moveTo(x-40,ey);ctx.lineTo(x-20,ey);ctx.stroke();}lab("3",x-64,y+u/2+10,rt,AG.green);}
  ctx.restore();}

// an equation in words, on tiles: parts [[text, side, state, edge, ink, join]] (side 0 left, 1 right; state 1 shown, 0 gone; join, such
// as "+", is drawn before the tile when a tile before it on its side shows), "=" between; centred on (cx, y); o.col the tiles' edge;
// o.noEq leaves the "=" out, to show one side alone
function sw_eq(ctx,cx,y,parts,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const gap=18,pad=26,size=30,jw=46,ws=parts.map(p=>ag_tw(ctx,p[0],{w:700,size})+pad*2),eqW=ag_tw(ctx,"=",{w:700,size:40})+40;
  const L=parts.map((p,i)=>i).filter(i=>parts[i][1]===0),Rr=parts.map((p,i)=>i).filter(i=>parts[i][1]===1);
  // how much each tile's join shows: as much as the tile, and no more than the tiles before it on its side
  const jk=ix=>{let seen=0;return ix.map(i=>{const k=clamp(parts[i][2],0,1),j=parts[i][5]?Math.min(k,seen):0;seen=Math.max(seen,k);return j;});};
  const JL=jk(L),JR=jk(Rr),wid=(ix,J)=>ix.reduce((s,i,n)=>s+(ws[i]+gap)*clamp(parts[i][2],0,1)+jw*J[n],0)-gap;
  const eq=o.noEq?0:eqW;let x=cx-(Math.max(0,wid(L,JL))+eq+Math.max(0,wid(Rr,JR)))/2;ctx.save();ctx.globalAlpha*=a;
  const tile=(i,j)=>{const p=parts[i],k=clamp(p[2],0,1);if(j>0.01){ag_T(ctx,p[5],x+jw*j/2-gap*0.25,y+12,{w:700,size:34,align:"center",a:j*j,col:AG.ink});x+=jw*j;}
    if(k<=0.01)return;const w=ws[i]*k;ag_box(ctx,x,y-34,w,68,16,{edge:p[3]||o.col||null,a:k});
    ag_T(ctx,p[0],x+w/2,y+11,{w:700,size,align:"center",a:k*k,col:p[4]||AG.ink});x+=w+gap*k;};
  L.forEach((i,n)=>tile(i,JL[n]));if(!o.noEq){ag_T(ctx,"=",x+eqW/2-(L.length?gap/2:0),y+14,{w:700,size:40,align:"center"});x+=eqW;}Rr.forEach((i,n)=>tile(i,JR[n]));ctx.restore();}

// the six forms the two moves bring every problem to, in words, as cards in two columns from (x, y); o.lit (index, or -1), o.litA (or
// o.lits {index: 0 to 1} to light more than one), o.a,
// o.k (spring), o.each (each card's own a); returns each card's box
const SW_FORMS=["Squares equal roots","Squares equal numbers","Roots equal numbers","Squares and roots equal numbers","Squares and numbers equal roots","Roots and numbers equal squares"];
function sw_forms(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const cw=520,ch=104,gx=28,gy=24,out=[];
  for(let i=0;i<6;i++){const col=i%2,row=(i/2)|0,bx=x+col*(cw+gx),by=y+row*(ch+gy),lit=o.lits?clamp(o.lits[i]||0,0,1):o.lit===i?(o.litA==null?1:o.litA):0,ai=a*(o.each?o.each[i]:1);out.push({x:bx,y:by,w:cw,h:ch});if(ai<=0.01)continue;
    ctx.save();if(o.k!=null)ag_about(ctx,bx+cw/2,by+ch/2,lerp(0.6,1,clamp(o.k,0,1.2)));
    ag_box(ctx,bx,by,cw,ch,18,{a:ai,edge:lit>0.05?AG.blue:null,edgeA:0.9*lit,glow:lit>0.05?AG.blue:null,glowA:lit});
    ag_T(ctx,String(i+1),bx+30,by+64,{w:500,size:30,f:"mono",col:lit>0.5?AG.blue:AG.mut,a:ai});
    const lines=ag_wrap(ctx,SW_FORMS[i],cw-110,{w:700,size:30});lines.forEach((l,k)=>ag_T(ctx,l,bx+76,by+(lines.length>1?46:64)+k*38,{w:700,size:30,col:lit>0.5?AG.blue:AG.ink,a:ai}));
    ctx.restore();}
  return out;}

/* ---------------------------------------------------------------- boats on the Tigris, drawn live */
// a round boat of woven reed, sealed with pitch, a boatman standing with a long pole; (x, y) where it sits on the water, s its scale
function sw_quffa(ctx,x,y,s,t){const bob=Math.sin(t*1.3)*2*s;ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);
  ctx.fillStyle="rgba(60,70,70,0.25)";ctx.beginPath();ctx.ellipse(-6,10,96,16,0,0,TAU);ctx.fill();
  ag_soft(ctx,c=>{c.moveTo(-84,-6);c.bezierCurveTo(-84,30,84,30,84,-6);c.closePath();},[64,52,44],[140,120,100],40,0,90,"rgba(0,0,0,0.4)",6);
  ctx.fillStyle="rgb(92,78,64)";ctx.beginPath();ctx.ellipse(0,-6,84,16,0,0,TAU);ctx.fill();ctx.fillStyle="rgb(46,38,32)";ctx.beginPath();ctx.ellipse(0,-4,74,12,0,0,TAU);ctx.fill();
  // the boatman, a small figure in a light tunic and head cloth, the pole slanting into the water
  ag_soft(ctx,c=>{c.moveTo(-10,-8);c.lineTo(-14,-74);c.bezierCurveTo(-14,-92,20,-92,20,-74);c.lineTo(16,-8);c.closePath();},[214,200,176],[245,236,220],16,-70,50,"rgba(60,40,20,0.3)",4);
  ag_soft(ctx,c=>c.arc(3,-102,13,0,TAU),[176,128,94],[220,180,140],8,-106,14,null);ctx.fillStyle="rgb(232,226,212)";ctx.beginPath();ctx.ellipse(1,-111,15,8,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgb(96,74,52)";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(26,-150);ctx.lineTo(-24,44);ctx.stroke();
  ctx.strokeStyle="rgb(206,192,168)";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(14,-80);ctx.quadraticCurveTo(20,-62,10,-50);ctx.stroke();
  ag_soft(ctx,c=>c.arc(9,-50,4.5,0,TAU),[176,128,94],[220,180,140],8,-52,6,null);ctx.restore();}
// a sailing boat far off, its triangular sail lit from the right
function sw_sail(ctx,x,y,s,t){const bob=Math.sin(t*0.9+1)*1.5*s;ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);ctx.fillStyle="rgba(60,70,70,0.2)";ctx.beginPath();ctx.ellipse(0,8,110,10,0,0,TAU);ctx.fill();
  ag_soft(ctx,c=>{c.moveTo(-110,-10);c.lineTo(100,-10);c.bezierCurveTo(90,10,60,14,40,14);c.lineTo(-80,14);c.bezierCurveTo(-96,10,-104,0,-110,-10);c.closePath();},[110,80,56],[170,130,96],60,-6,120,"rgba(0,0,0,0.35)",6);
  ctx.strokeStyle="rgb(90,66,46)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,-190);ctx.stroke();
  ag_soft(ctx,c=>{c.moveTo(-6,-196);c.bezierCurveTo(60,-150,96,-80,90,-24);c.lineTo(-70,-24);c.bezierCurveTo(-30,-80,-14,-140,-6,-196);c.closePath();},[236,226,204],[255,250,238],70,-90,140,"rgba(90,70,40,0.25)",10);
  ctx.restore();}
