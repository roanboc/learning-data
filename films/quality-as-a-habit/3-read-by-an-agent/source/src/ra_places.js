/* ===== Read by an agent: the opening's places =====
   The opening happens around 2000, in the offices where people wrote for the United Nations, the European Union and NATO. Two places
   of its own, painted once in the module's way (soft, matte, lit from a window on the right), in the tones of an office of the time:
     ra_office   a writer's desk: a pale plaster wall, a window with a venetian blind on the right, its light lying on the wall in
                 slats; a beige monitor of the time on a light beech desk, its keyboard and mouse, a stack of paper and a mug. No
                 maker's name or mark anywhere: the film names no software maker. The page on the screen is drawn live (ra_props.js),
                 in RA_SCREEN's frame.
     ra_desk     the same desk seen from above: beech veneer, the window's daylight from the right, where the opening's papers lie.
   The university's places are the module's: the bench, the bench from above, the hall. */

// the monitor's glass and the page inside it, in the office's coordinates; the page's words are drawn live by ra_screen
const RA_SCREEN={x:486,y:162,w:708,h:508,r:26,page:{x:556,y:236,w:596},bar:204};

// a soft vertical or horizontal gradient band, used for the office's few solid things
function ra_grad(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);for(const [u,col] of stops)g.addColorStop(u,col);return g;}

function ra_paintOffice(c){const nz=dq_noise(61),DY=772;
  // the wall: pale plaster, a little cooler and darker away from the window, lit from the right, and a soft glow round the window
  // where its light bounces off the desk; the sun comes in through the blind and falls on the desk, not on this wall
  dq_field(c,0,0,W,DY+8,2,(px,py,out)=>{const m=nz(px/700,py/700,3),f=nz(px/90,py/90,2),lit=0.86+0.12*sstep(0,W,px)-0.07*(1-sstep(0,520,py)),
      gl=Math.exp(-Math.pow((px-1650)/420,2)-Math.pow((py-420)/420,2));
    const k=lit*(0.95+0.05*m+0.035*(f-0.5))+0.06*gl;out[0]=Math.min(255,206*k+4*gl);out[1]=Math.min(255,198*k+2*gl);out[2]=Math.min(255,184*k);});
  // the skirting along the desk's back edge, and the window
  c.fillStyle="rgba(120,108,92,0.35)";c.fillRect(0,DY-14,W,14);
  const WX=1418,WY=58,WW=470,WH=622;
  c.fillStyle=ra_grad(c,WX,0,WX+WW,0,[[0,"#d9d6cf"],[1,"#ecebe6"]]);rr(c,WX-22,WY-22,WW+44,WH+44,6);c.fill();
  c.fillStyle="rgba(80,70,58,0.25)";c.fillRect(WX-22,WY+WH+22,WW+44,6);
  // daylight behind the blind, brightest at the top, and the slats: each a soft band, lit on its upper edge, its gap glowing
  c.save();c.beginPath();c.rect(WX,WY,WW,WH);c.clip();c.fillStyle=ra_grad(c,0,WY,0,WY+WH,[[0,"#fbfbf6"],[1,"#eef0ea"]]);c.fillRect(WX,WY,WW,WH);
  for(let y=WY+6;y<WY+WH;y+=26){c.fillStyle=ra_grad(c,0,y,0,y+19,[[0,"#f4f2ec"],[0.35,"#dcd8cf"],[1,"#bdb7ab"]]);c.fillRect(WX,y,WW,19);
    c.fillStyle="rgba(255,255,250,0.75)";c.fillRect(WX,y,WW,1.6);c.fillStyle="rgba(90,80,66,0.22)";c.fillRect(WX,y+18,WW,1.4);}
  // the blind's two cords, and its head rail
  c.fillStyle="rgba(150,140,124,0.8)";for(const x of [WX+150,WX+WW-150])c.fillRect(x-1.2,WY,2.4,WH);
  c.fillStyle=ra_grad(c,0,WY,0,WY+26,[[0,"#e8e5dd"],[1,"#c9c3b6"]]);c.fillRect(WX-6,WY-4,WW+12,28);c.restore();
  // the frame's inner edge, in shadow at the top and left
  c.strokeStyle="rgba(96,86,70,0.35)";c.lineWidth=3;c.strokeRect(WX-1.5,WY-1.5,WW+3,WH+3);
  // the desk: light beech veneer, its grain running across, the window's light along its back on the right
  dq_field(c,0,DY,W,H-DY,2,(px,py,out)=>{const v=(py-DY)/(H-DY),gr=nz(px/520,(py-DY)/9+40,3),fine=nz(px/60,(py-DY)/3+80,2),lit=0.84+0.14*sstep(200,W,px)-0.1*v;
    const k=lit*(0.93+0.09*gr+0.04*(fine-0.5));out[0]=Math.min(255,214*k);out[1]=Math.min(255,184*k);out[2]=Math.min(255,146*k);});
  c.fillStyle="rgba(255,250,240,0.35)";c.fillRect(0,DY,W,2);
  // the sun through the blind, lying on the desk in front of the window in soft slats that open out towards us
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<9;i++){const y0=DY+10+i*i*3.4+i*10,h=4+i*1.6,x0=1300-i*26,x1=1960+i*10;
    const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgba(255,236,200,0)");g.addColorStop(0.3,"rgba(255,236,200,"+(0.13-i*0.008)+")");g.addColorStop(1,"rgba(255,236,200,"+(0.08-i*0.005)+")");
    c.fillStyle=g;c.filter="blur("+(2+i*0.6)+"px)";c.fillRect(x0,y0,x1-x0,h);}c.restore();
  c.fillStyle=ra_grad(c,0,DY,0,DY+40,[[0,"rgba(60,46,30,0.28)"],[1,"rgba(60,46,30,0)"]]);c.fillRect(0,DY,W,40);
  // the monitor's shadow on the desk and the wall, falling to the left
  c.save();c.filter="blur(26px)";c.fillStyle="rgba(50,40,28,0.32)";c.beginPath();c.ellipse(760,DY+30,420,46,0,0,TAU);c.fill();
  c.fillStyle="rgba(60,50,38,0.2)";rr(c,360,128,820,640,40);c.fill();c.restore();
  // the monitor: a deep beige case, seen almost from the front, a little of its left side showing; its glass, and the page on it
  // (the words are drawn live)
  const MX=430,MY=104,MW=820,MH=650;
  // the case behind the front: its left side in shade, narrowing back towards the wall, and its top catching the light
  c.fillStyle=ra_grad(c,MX-70,0,MX+10,0,[[0,"#8f8573"],[0.7,"#b3a993"],[1,"#c4bba6"]]);c.beginPath();c.moveTo(MX+14,MY+12);c.lineTo(MX-60,MY+86);c.quadraticCurveTo(MX-66,MY+MH/2,MX-60,MY+MH-110);c.lineTo(MX+14,MY+MH-20);c.closePath();c.fill();
  c.fillStyle=ra_grad(c,0,MY-34,0,MY+10,[[0,"#d8d1c0"],[1,"#e9e3d4"]]);c.beginPath();c.moveTo(MX+30,MY+4);c.lineTo(MX-40,MY+80);c.lineTo(MX+60,MY-28);c.lineTo(MX+MW-70,MY-28);c.lineTo(MX+MW-20,MY+4);c.closePath();c.fill();
  c.strokeStyle="rgba(120,106,84,0.3)";c.lineWidth=1.5;c.beginPath();c.moveTo(MX-40,MY+80);c.lineTo(MX+60,MY-28);c.lineTo(MX+MW-70,MY-28);c.stroke();
  c.fillStyle=ra_grad(c,0,MY,0,MY+MH,[[0,"#e6dfcf"],[0.55,"#ddd5c3"],[1,"#cfc6b2"]]);rr(c,MX,MY,MW,MH,30);c.fill();
  c.fillStyle=ra_grad(c,MX,0,MX+MW,0,[[0,"rgba(120,104,80,0.16)"],[0.6,"rgba(255,255,255,0)"],[1,"rgba(255,252,240,0.22)"]]);rr(c,MX,MY,MW,MH,30);c.fill();
  c.strokeStyle="rgba(120,106,84,0.45)";c.lineWidth=2;rr(c,MX+1,MY+1,MW-2,MH-2,30);c.stroke();
  // the bezel's recess round the glass, then the glass: dark at its rim, the page's workspace inside
  const S=RA_SCREEN;c.fillStyle="#8f8676";rr(c,S.x-20,S.y-20,S.w+40,S.h+40,S.r+14);c.fill();
  c.fillStyle=ra_grad(c,0,S.y-20,0,S.y+S.h+20,[[0,"#7a7264"],[1,"#b4ab99"]]);rr(c,S.x-14,S.y-14,S.w+28,S.h+28,S.r+10);c.fill();
  c.fillStyle="#3a3d3b";rr(c,S.x-4,S.y-4,S.w+8,S.h+8,S.r+3);c.fill();
  c.save();rr(c,S.x,S.y,S.w,S.h,S.r);c.clip();
  // the word processor of the time: a grey workspace, a plain toolbar (blank buttons: no maker's marks), and a white page
  c.fillStyle="#c3c5c2";c.fillRect(S.x,S.y,S.w,S.h);
  c.fillStyle=ra_grad(c,0,S.y,0,S.bar,[[0,"#e3e3df"],[1,"#cfd0cc"]]);c.fillRect(S.x,S.y,S.w,S.bar-S.y);c.fillStyle="rgba(80,80,80,0.4)";c.fillRect(S.x,S.bar-1,S.w,1.5);
  for(let i=0;i<12;i++){const bx=S.x+40+i*46+(i>4?18:0)+(i>8?18:0);c.fillStyle="#d9dad6";rr(c,bx,S.y+10,34,30,4);c.fill();c.strokeStyle="rgba(90,90,90,0.35)";c.lineWidth=1.2;rr(c,bx,S.y+10,34,30,4);c.stroke();
    c.fillStyle="rgba(70,72,74,0.5)";c.fillRect(bx+9,S.y+18,16,3);c.fillRect(bx+9,S.y+25,12,3);}
  const P=S.page;c.fillStyle="rgba(40,40,40,0.25)";c.fillRect(P.x+6,P.y+6,P.w,S.y+S.h-P.y);c.fillStyle="#fbfbf8";c.fillRect(P.x,P.y,P.w,S.y+S.h-P.y+40);
  // the glass: a faint curve of the window's light across it, and its darker corners
  c.fillStyle=ra_grad(c,S.x+S.w,S.y,S.x+S.w*0.35,S.y+S.h*0.6,[[0,"rgba(255,255,255,0.13)"],[0.5,"rgba(255,255,255,0.03)"],[1,"rgba(255,255,255,0)"]]);c.fillRect(S.x,S.y,S.w,S.h);
  const v=c.createRadialGradient(S.x+S.w/2,S.y+S.h/2,S.h*0.42,S.x+S.w/2,S.y+S.h/2,S.w*0.66);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(20,22,20,0.22)");c.fillStyle=v;c.fillRect(S.x,S.y,S.w,S.h);c.restore();
  // the chin under the glass: a round power button and a small grey lamp; then the swivel stand on the desk
  c.fillStyle="#bdb4a1";c.beginPath();c.arc(MX+MW-80,MY+MH-40,11,0,TAU);c.fill();c.strokeStyle="rgba(110,96,76,0.6)";c.lineWidth=1.5;c.stroke();
  c.fillStyle="#9b958a";c.beginPath();c.arc(MX+MW-120,MY+MH-40,4,0,TAU);c.fill();
  c.fillStyle=ra_grad(c,0,MY+MH-6,0,DY+26,[[0,"#b9b09c"],[1,"#d7cfbd"]]);c.beginPath();c.moveTo(MX+250,MY+MH-8);c.lineTo(MX+MW-250,MY+MH-8);c.lineTo(MX+MW-190,DY+24);c.lineTo(MX+190,DY+24);c.closePath();c.fill();
  c.fillStyle="rgba(90,76,58,0.3)";c.fillRect(MX+190,DY+22,MW-380,4);
  // the keyboard: beige, its keys in rows, lit from the right; and the mouse beside it, its cable running back
  const KX=470,KY=884,KW=740,KH=176;c.save();c.filter="blur(10px)";c.fillStyle="rgba(50,40,28,0.35)";rr(c,KX-14,KY+14,KW,KH,18);c.fill();c.restore();
  c.fillStyle=ra_grad(c,0,KY,0,KY+KH,[[0,"#e2dbcb"],[1,"#cbc2ae"]]);rr(c,KX,KY,KW,KH,16);c.fill();c.strokeStyle="rgba(120,106,84,0.5)";c.lineWidth=1.6;rr(c,KX,KY,KW,KH,16);c.stroke();
  for(let r=0;r<4;r++)for(let i=0;i<15;i++){const kw=r===3&&i>3&&i<10?0:40;if(!kw)continue;const kx=KX+24+i*46+r*10,ky=KY+18+r*38;if(kx+40>KX+KW-20)continue;
    c.fillStyle="rgba(90,78,60,0.3)";rr(c,kx-1,ky+2,40,32,5);c.fill();c.fillStyle=ra_grad(c,0,ky,0,ky+30,[[0,"#f0eadc"],[1,"#d9d1bf"]]);rr(c,kx,ky,38,30,5);c.fill();}
  c.fillStyle="rgba(90,78,60,0.3)";rr(c,KX+218,KY+134,280,32,5);c.fill();c.fillStyle=ra_grad(c,0,KY+132,0,KY+162,[[0,"#f0eadc"],[1,"#d9d1bf"]]);rr(c,KX+220,KY+132,276,30,5);c.fill();
  c.strokeStyle="rgba(150,140,124,0.9)";c.lineWidth=3;c.beginPath();c.moveTo(1316,930);c.bezierCurveTo(1300,860,1260,820,1150,DY+30);c.stroke();
  c.save();c.filter="blur(8px)";c.fillStyle="rgba(50,40,28,0.35)";c.beginPath();c.ellipse(1316,986,46,60,0,0,TAU);c.fill();c.restore();
  c.fillStyle=ra_grad(c,1290,0,1360,0,[[0,"#d6cebc"],[1,"#ece6d8"]]);c.beginPath();c.ellipse(1326,974,42,58,0,0,TAU);c.fill();c.strokeStyle="rgba(120,106,84,0.5)";c.lineWidth=1.5;c.stroke();
  c.strokeStyle="rgba(120,106,84,0.4)";c.beginPath();c.moveTo(1326,918);c.lineTo(1326,958);c.stroke();
  // a stack of paper on the right, and a mug on the left: plain, no words
  c.save();c.filter="blur(10px)";c.fillStyle="rgba(50,40,28,0.3)";rr(c,1452,834,330,74,6);c.fill();c.restore();
  for(let i=0;i<7;i++){const yy=846-i*5;c.fillStyle=i===6?"#fbfaf5":"#efece3";c.beginPath();c.moveTo(1480+i*1.5,yy);c.lineTo(1770-i,yy-2);c.lineTo(1786-i,yy+44);c.lineTo(1466+i*1.5,yy+46);c.closePath();c.fill();
    c.strokeStyle="rgba(120,106,84,0.25)";c.lineWidth=1;c.stroke();}
  c.save();c.filter="blur(9px)";c.fillStyle="rgba(50,40,28,0.35)";c.beginPath();c.ellipse(212,930,74,20,0,0,TAU);c.fill();c.restore();
  c.fillStyle=ra_grad(c,170,0,290,0,[[0,"#cfc9bd"],[0.6,"#ece8df"],[1,"#f6f3ec"]]);c.beginPath();c.moveTo(166,826);c.lineTo(286,826);c.lineTo(282,920);c.quadraticCurveTo(226,940,170,920);c.closePath();c.fill();
  c.fillStyle="#d8d2c4";c.beginPath();c.ellipse(226,826,60,12,0,0,TAU);c.fill();c.fillStyle="#5d4a38";c.beginPath();c.ellipse(226,828,52,9,0,0,TAU);c.fill();
  c.strokeStyle="#e4dfd4";c.lineWidth=11;c.beginPath();c.arc(292,866,26,-1.2,1.2);c.stroke();}

function ra_paintDesk(c){const nz=dq_noise(67);
  // beech veneer from above: long fibres running across, a few broader bands, the window's daylight from the right
  dq_field(c,0,0,W,H,2,(px,py,out)=>{const band=nz(px/1400,py/90+7,3),gr=nz(px/700,py/7+30,3),fine=nz(px/90,py/2.6+90,2),
      lit=0.82+0.16*sstep(0,W,px)+0.05*(1-sstep(0,H,py));const k=lit*(0.9+0.08*band+0.07*gr+0.035*(fine-0.5));
    out[0]=Math.min(255,218*k);out[1]=Math.min(255,186*k);out[2]=Math.min(255,146*k);});
  // a few darker fibres where the grain's figure closes up, as on sliced veneer
  const r=ag_rnd(71);c.save();c.lineCap="round";for(let i=0;i<70;i++){const y=r()*H,x0=-100+r()*W,len=300+r()*900,a=0.05+r()*0.07,amp=4+r()*10;
    c.strokeStyle="rgba(120,84,48,"+a+")";c.lineWidth=0.8+r()*1.6;c.beginPath();c.moveTo(x0,y);c.bezierCurveTo(x0+len*0.33,y+amp,x0+len*0.66,y-amp,x0+len,y+amp*0.4);c.stroke();}c.restore();
  dq_pool(c,1500,300,1100,[255,250,236],0.1);
  const v=c.createRadialGradient(W*0.52,H*0.46,H*0.42,W/2,H/2,W*0.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(40,26,12,0.32)");c.fillStyle=v;c.fillRect(0,0,W,H);}

AG_PLACES.ra_office=c=>ra_paintOffice(c);
AG_PLACES.ra_desk=c=>ra_paintDesk(c);
