/* ===== Growing people: the opening, Japan's schools, from 1872, and today =====
   The film's own pictures for its opening story (prefix gp_), drawn in the module's matte language and lit from a window on the right,
   like the team's rooms, so the light carries across into the university. Nothing is a likeness of a real school, teacher or pupil, and
   nothing is drawn in another culture's style: a schoolroom of the 1880s and one of today, seen from the back of the class, as a
   visitor stands in it.
     gpClass, gpClassToday     the front wall of a classroom: the blackboard, the clock over it, in the 1880s a hanging wall map and
                               chalk counting marks, today a notice board and a fraction strip in chalk; the sun from the window on it
     gp_class(ctx, t, o)       the class in that room, back to front: the teacher at the board, behind the teacher's desk; two rows of
                               pupils at their desks, seen from behind; and the visitors standing at the sides, each with a notebook,
                               watching the pupils (o.era "meiji" or "today"; o.teacher, o.kids, o.obs: each one's opacity, faded whole;
                               o.look: the visitors' eyes on the pupils, 0 to 1; o.lx, o.rx: the visitors still walking in; o.light);
                               GP_HEADS, where the pupils' heads are
     gp_child(ctx, x, y, s, k, o)   a pupil at a desk, seen from behind (the base of the neck at (x, y); s 1: a head 150 px tall): a
                               child's proportions, a round head, a slender neck; hair, collar and clothes of their time (k), lit from the
                               right; drawn once into a kept picture, then breathing a little
     gpStaff, gp_staff(ctx, t, o)  after school: the teachers round a table in the staffroom, in the reflection session
     gpWall                    the film's plain wall, for the sheets that carry the opening's numbers
   People of the 1880s are dressed for their time: men in a kimono with its crossed collar, or in a dark Western suit, as teachers then
   wore; a woman teacher in a kimono, her hair up. A kimono is worn left side over right; the kit mirrors a person who faces left, which
   would cross it the other way, so a kimono is only ever drawn facing right (gp_who stops the film if one faces left).
   Colour keeps the module's meaning: amber the problem (the teacher alone, the child who falls behind), green what got better, blue the
   plan (the cycle of lesson study); the rooms, the clothes and the people wear none of them. */

const GP_K={board:[40,44,42],boardNow:[52,62,58],chalk:[236,232,220],frame:[150,112,78],frameDk:[104,76,54],desk:[168,128,92],deskDk:[118,86,60],
  slate:[58,62,64],map:[226,214,190],mapInk:[150,126,96],mapLand:[200,184,152],clock:[120,88,62],cork:[188,160,124]};

/* ---------------------------------------------------------------- the classroom's front wall */
function gp_paintClass(c,era){const now=era==="today";lp_paintRoom(c,{light:"day",seed:now?14:13,base:now?[226,214,196]:[222,206,184],hz:760});
  const S=LP_LIGHT.day.sun,bx=560,by=150,bw=800,bh=300;
  // a timber dado along the lower wall, behind the desks
  if(!now){let g=c.createLinearGradient(0,600,0,738);g.addColorStop(0,rgba(mix(GP_K.frame,LP.shade,0.18),1));g.addColorStop(1,rgba(mix(GP_K.frame,LP.shade,0.34),1));c.fillStyle=g;c.fillRect(0,600,W,138);
    c.fillStyle=rgba(mix(GP_K.frame,[255,248,236],0.22),1);c.fillRect(0,596,W,8);c.fillStyle=rgba(LP.shade,0.22);c.fillRect(0,604,W,3);
    for(let x=60;x<W;x+=150){c.fillStyle=rgba(LP.shade,0.12);c.fillRect(x,607,3,131);}}
  // the blackboard: its timber frame, its chalk ledge, its surface worn by chalk
  c.save();c.shadowColor="rgba(52,36,30,0.35)";c.shadowBlur=22;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=12;c.fillStyle=rgba(GP_K.frameDk,1);c.fillRect(bx-18,by-18,bw+36,bh+36);c.restore();
  let g=c.createLinearGradient(bx-18,0,bx+bw+18,0);g.addColorStop(0,rgba(GP_K.frameDk,1));g.addColorStop(1,rgba(GP_K.frame,1));c.fillStyle=g;c.fillRect(bx-18,by-18,bw+36,bh+36);
  const bc=now?GP_K.boardNow:GP_K.board;g=c.createLinearGradient(bx,by,bx+bw,by+bh);g.addColorStop(0,rgba(mix(bc,[0,0,0],0.1),1));g.addColorStop(1,rgba(mix(bc,[255,255,255],0.04),1));c.fillStyle=g;c.fillRect(bx,by,bw,bh);
  const R=ag_rnd(now?71:17);c.save();c.beginPath();c.rect(bx,by,bw,bh);c.clip();
  for(let i=0;i<26;i++){const x=bx+R()*bw,y=by+R()*bh,w=60+R()*220;c.fillStyle=rgba(GP_K.chalk,0.025+R()*0.03);c.beginPath();c.ellipse(x,y,w,8+R()*18,(R()-0.5)*0.3,0,TAU);c.fill();}
  c.strokeStyle=rgba(GP_K.chalk,0.78);c.lineWidth=4;c.lineCap="round";c.lineJoin="round";
  if(!now){// counting marks in chalk: rows of small circles in groups, and a long stroke under them
    for(let r=0;r<3;r++)for(let gq=0;gq<3;gq++){const n=[3,4,5][r];for(let k=0;k<n;k++){const x=bx+90+gq*230+k*36,y=by+70+r*62;c.beginPath();c.arc(x+(R()-0.5)*2,y+(R()-0.5)*2,12,0,TAU);c.stroke();}}
    c.beginPath();c.moveTo(bx+80,by+250);c.quadraticCurveTo(bx+380,by+244,bx+700,by+252);c.stroke();}
  else{// a fraction strip in chalk: a whole, then halves, then quarters, one quarter shaded
    const x0=bx+90,w0=620;for(let r=0;r<3;r++){const y=by+56+r*70,n=[1,2,4][r];c.strokeRect(x0,y,w0,44);for(let k=1;k<n;k++){c.beginPath();c.moveTo(x0+w0*k/n,y);c.lineTo(x0+w0*k/n,y+44);c.stroke();}}
    c.save();c.globalAlpha=0.22;c.fillStyle=rgba(GP_K.chalk,1);c.fillRect(x0+2,by+56+140+2,w0/4-4,40);c.restore();
    c.beginPath();c.moveTo(bx+80,by+262);c.quadraticCurveTo(bx+380,by+256,bx+700,by+264);c.stroke();}
  c.restore();
  // the sun from the window falls across the board too, a little dimmer on the dark paint
  lp_sun(c,S,{a:0.5,col:LP_LIGHT.day.col,clip:x=>{x.beginPath();x.rect(bx-18,by-18,bw+36,bh+36);x.clip();}});
  // the chalk ledge, a stick of chalk and its dust
  c.fillStyle=rgba(GP_K.frame,1);c.fillRect(bx-24,by+bh+18,bw+48,14);c.fillStyle=rgba(mix(GP_K.frame,[255,248,236],0.3),1);c.fillRect(bx-24,by+bh+18,bw+48,3);
  c.fillStyle=rgba(LP.shade,0.25);c.fillRect(bx-24,by+bh+32,bw+48,6);c.fillStyle=rgba(GP_K.chalk,1);c.fillRect(bx+600,by+bh+12,46,8);c.fillRect(bx+680,by+bh+13,26,7);
  // the clock over the board
  const cx=960,cy=78;c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=12;c.shadowOffsetX=-6;c.shadowOffsetY=6;
  if(!now){c.fillStyle=rgba(GP_K.clock,1);c.beginPath();for(let k=0;k<8;k++){const a=Math.PI/8+k*Math.PI/4;c.lineTo(cx+Math.cos(a)*46,cy+Math.sin(a)*46);}c.closePath();c.fill();}
  else{c.fillStyle=rgba([196,192,186],1);c.beginPath();c.arc(cx,cy,44,0,TAU);c.fill();}c.restore();
  c.fillStyle=rgba([244,238,226],1);c.beginPath();c.arc(cx,cy,34,0,TAU);c.fill();c.strokeStyle=rgba(LP.graphite,0.8);c.lineWidth=2;
  for(let k=0;k<12;k++){const a=k*Math.PI/6;c.beginPath();c.moveTo(cx+Math.cos(a)*28,cy+Math.sin(a)*28);c.lineTo(cx+Math.cos(a)*32,cy+Math.sin(a)*32);c.stroke();}
  c.lineWidth=3;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+12,cy-14);c.moveTo(cx,cy);c.lineTo(cx-2,cy-24);c.stroke();
  if(!now){// a hanging wall map: paper on two rods, its land and its lines faded to the colour of old paper
    const mx=1480,my=150,mw=270,mh=300;c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=16;c.shadowOffsetX=-8;c.shadowOffsetY=10;c.fillStyle=rgba(GP_K.map,1);c.fillRect(mx,my,mw,mh);c.restore();
    c.save();c.beginPath();c.rect(mx,my,mw,mh);c.clip();c.strokeStyle=rgba(GP_K.mapInk,0.3);c.lineWidth=1.5;for(let k=1;k<6;k++){c.beginPath();c.moveTo(mx,my+k*50);c.lineTo(mx+mw,my+k*50);c.stroke();c.beginPath();c.moveTo(mx+k*45,my);c.lineTo(mx+k*45,my+mh);c.stroke();}
      c.fillStyle=rgba(GP_K.mapLand,1);c.strokeStyle=rgba(GP_K.mapInk,0.7);c.lineWidth=2;c.beginPath();c.moveTo(mx+70,my+260);c.bezierCurveTo(mx+60,my+200,mx+120,my+190,mx+140,my+140);
      c.bezierCurveTo(mx+160,my+90,mx+200,my+70,mx+230,my+40);c.bezierCurveTo(mx+250,my+60,mx+220,my+110,mx+200,my+150);c.bezierCurveTo(mx+180,my+200,mx+140,my+230,mx+110,my+280);c.closePath();c.fill();c.stroke();
      c.beginPath();c.ellipse(mx+60,my+90,26,18,0.4,0,TAU);c.fill();c.stroke();c.restore();
    for(const y of [my-8,my+mh-4]){c.fillStyle=rgba(GP_K.frameDk,1);c.fillRect(mx-12,y,mw+24,12);}
    c.strokeStyle=rgba(GP_K.frameDk,0.9);c.lineWidth=2;c.beginPath();c.moveTo(mx+20,my-8);c.lineTo(mx+mw/2,my-40);c.lineTo(mx+mw-20,my-8);c.stroke();c.fillStyle=rgba(LP.graphite,1);c.beginPath();c.arc(mx+mw/2,my-40,5,0,TAU);c.fill();
    lp_sun(c,S,{a:0.85,col:LP_LIGHT.day.col,clip:x=>{x.beginPath();x.rect(mx,my,mw,mh);x.clip();}});}
  else{// a notice board, with the children's sheets pinned to it
    const nx=1470,ny=160,nw=300,nh=280;c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=14;c.shadowOffsetX=-8;c.shadowOffsetY=8;c.fillStyle=rgba(GP_K.cork,1);c.fillRect(nx,ny,nw,nh);c.restore();
    c.strokeStyle=rgba(GP_K.frame,1);c.lineWidth=10;c.strokeRect(nx,ny,nw,nh);const Q=ag_rnd(5);
    for(let i=0;i<6;i++){const px=nx+24+(i%3)*92,py=ny+26+Math.floor(i/3)*126,tl=(Q()-0.5)*0.12;c.save();c.translate(px+38,py+52);c.rotate(tl);c.fillStyle=rgba([248,244,234],1);c.fillRect(-38,-52,76,104);
      c.strokeStyle=rgba([150,140,130],0.5);c.lineWidth=2;for(let l=0;l<4;l++){c.beginPath();c.moveTo(-26,-30+l*18);c.lineTo(26-Q()*16,-30+l*18);c.stroke();}c.restore();
      c.fillStyle=rgba(LP.graphite,1);c.beginPath();c.arc(px+38,py+6,4,0,TAU);c.fill();}
    lp_sun(c,S,{a:0.85,col:LP_LIGHT.day.col,clip:x=>{x.beginPath();x.rect(nx,ny,nw,nh);x.clip();}});}}
AG_PLACES.gpClass=c=>gp_paintClass(c,"meiji");
AG_PLACES.gpClassToday=c=>gp_paintClass(c,"today");

/* ---------------------------------------------------------------- a pupil, seen from behind
   k: {hair: "crop" (short, the crown's whorl showing), "knot" (gathered up in a knot, tied with a cord), "short", "pony", "bob";
   hc: the hair's colour; skin; top: "kimono" (its collar standing a little off the neck, the back seam), "tee", "shirt", "sweater";
   c: its colour; band: the collar's; cord: the knot's tie}. In the child's own units: the base of the neck at (0, 0), y down. */
function gp_childPaint(c,k){const sk=k.skin,hc=k.hc,cl=k.c,band=k.band||ag_dk(cl,0.35);
  const torso=cc=>{cc.moveTo(-24,-6);cc.bezierCurveTo(-60,0,-100,8,-114,34);cc.bezierCurveTo(-126,62,-128,140,-126,290);cc.lineTo(126,290);cc.bezierCurveTo(128,140,126,62,114,34);cc.bezierCurveTo(100,8,60,0,24,-6);cc.closePath();};
  const sleeves=cc=>{cc.moveTo(-108,30);cc.bezierCurveTo(-130,46,-146,90,-148,150);cc.lineTo(-150,290);cc.lineTo(-112,290);cc.lineTo(-116,60);cc.closePath();
    cc.moveTo(108,30);cc.bezierCurveTo(130,46,146,90,148,150);cc.lineTo(150,290);cc.lineTo(112,290);cc.lineTo(116,60);cc.closePath();};
  const neck=cc=>{cc.moveTo(-21,-44);cc.lineTo(21,-44);cc.bezierCurveTo(22,-26,24,-12,27,0);cc.lineTo(-27,0);cc.bezierCurveTo(-24,-12,-22,-26,-21,-44);cc.closePath();};
  const head=cc=>{cc.moveTo(0,-152);cc.bezierCurveTo(35,-152,59,-126,59,-94);cc.bezierCurveTo(59,-66,49,-48,31,-36);cc.bezierCurveTo(20,-30,-20,-30,-31,-36);cc.bezierCurveTo(-49,-48,-59,-66,-59,-94);cc.bezierCurveTo(-59,-126,-35,-152,0,-152);cc.closePath();};
  const ear=(sx)=>cc=>{cc.ellipse(sx*58,-80,9,16,sx*0.18,0,TAU);};
  // the clothes: the back, the sleeves, lit from the right
  if(k.top==="kimono")ag_soft(c,sleeves,ag_dk(cl,0.08),ag_lt(cl,0.25),110,60,120,rgba(ag_dk(cl,0.7),0.35),14);
  ag_soft(c,torso,cl,ag_lt(cl,0.28),80,30,170,rgba(ag_dk(cl,0.7),0.38),22);
  c.save();ag_shape(c,torso);c.clip();let g=c.createLinearGradient(-130,0,130,0);g.addColorStop(0,rgba(LP.shade,0.22));g.addColorStop(0.55,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.1));c.fillStyle=g;c.fillRect(-130,-10,260,300);
  if(k.top==="kimono"){c.strokeStyle=rgba(ag_dk(cl,0.45),0.55);c.lineWidth=2.5;c.beginPath();c.moveTo(1,8);c.lineTo(2,290);c.stroke();
    // folds where the sleeves join, and where the sash would begin
    ag_folds(c,torso,[[[-104,44],[-96,120],[-100,200]],[[100,44],[94,120],[98,200]]],rgba(ag_dk(cl,0.5),0.35),rgba(ag_lt(cl,0.35),0.25));}
  else if(k.top==="sweater"){c.strokeStyle=rgba(ag_dk(cl,0.25),0.25);c.lineWidth=1.5;for(let y=30;y<290;y+=9){c.beginPath();c.moveTo(-126,y);c.lineTo(126,y+2);c.stroke();}}
  else if(k.top==="shirt"){c.strokeStyle=rgba(ag_dk(cl,0.3),0.45);c.lineWidth=2.5;c.beginPath();c.moveTo(-96,70);c.quadraticCurveTo(0,82,96,70);c.stroke();
    ag_folds(c,torso,[[[-60,120],[-40,190],[-50,280]],[[50,110],[60,200],[44,280]]],rgba(ag_dk(cl,0.3),0.3),null);}
  c.restore();
  // the neck, and the ears either side of the head
  ag_soft(c,neck,ag_dk(sk,0.06),ag_lt(sk,0.2),16,-30,40,rgba(ag_dk(sk,0.6),0.35),10);
  for(const sx of [-1,1])ag_soft(c,ear(sx),ag_dk(sk,sx<0?0.12:0.02),ag_lt(sk,0.25),sx*60,-86,16,rgba(ag_dk(sk,0.6),0.3),5);
  // the collar, round the back of the neck
  if(k.top==="kimono"){const col=cc=>{cc.moveTo(-36,-12);cc.bezierCurveTo(-24,4,24,4,36,-12);cc.lineTo(38,2);cc.bezierCurveTo(24,18,-24,18,-38,2);cc.closePath();};
    const under=cc=>{cc.moveTo(-31,-16);cc.bezierCurveTo(-20,-4,20,-4,31,-16);cc.lineTo(36,-11);cc.bezierCurveTo(24,5,-24,5,-36,-11);cc.closePath();};
    ag_soft(c,under,[230,224,210],[255,252,244],20,-8,30,null);ag_soft(c,col,band,ag_lt(band,0.3),22,4,40,rgba(ag_dk(band,0.7),0.4),6);}
  else if(k.top==="shirt"){const col=cc=>{cc.moveTo(-30,-22);cc.bezierCurveTo(-18,-12,18,-12,30,-22);cc.lineTo(40,4);cc.bezierCurveTo(24,14,-24,14,-40,4);cc.closePath();};
    ag_soft(c,col,ag_dk(cl,0.04),ag_lt(cl,0.4),20,-8,40,rgba(ag_dk(cl,0.5),0.35),6);}
  else{const col=cc=>{cc.moveTo(-29,-8);cc.bezierCurveTo(-18,4,18,4,29,-8);cc.lineTo(33,2);cc.bezierCurveTo(20,14,-20,14,-33,2);cc.closePath();};
    ag_soft(c,col,ag_dk(cl,0.14),ag_lt(cl,0.2),20,0,30,null);}
  // the head, then the hair over it
  ag_soft(c,head,sk,ag_lt(sk,0.2),30,-100,60,rgba(ag_dk(sk,0.6),0.3),12);
  const hairBand=(y0,y1)=>cc=>{cc.moveTo(0,-157);cc.bezierCurveTo(38,-157,63,-129,63,-95);cc.bezierCurveTo(63,-78,60,-66,55,-58);cc.bezierCurveTo(50,-52,46,-56,44,-62);
    cc.bezierCurveTo(30,y1,-30,y1,-44,-62);cc.bezierCurveTo(-46,-56,-50,-52,-55,-58);cc.bezierCurveTo(-60,-66,-63,-78,-63,-95);cc.bezierCurveTo(-63,-129,-38,-157,0,-157);cc.closePath();};
  let hair;
  if(k.hair==="crop"||k.hair==="short")hair=cc=>{cc.moveTo(0,-156);cc.bezierCurveTo(37,-156,62,-128,62,-96);cc.bezierCurveTo(62,-82,60,-72,57,-66);cc.bezierCurveTo(52,-74,48,-74,44,-66);
      cc.bezierCurveTo(36,-50,22,-42,0,-41);cc.bezierCurveTo(-22,-42,-36,-50,-44,-66);cc.bezierCurveTo(-48,-74,-52,-74,-57,-66);cc.bezierCurveTo(-60,-72,-62,-82,-62,-96);cc.bezierCurveTo(-62,-128,-37,-156,0,-156);cc.closePath();};
  else if(k.hair==="bob")hair=cc=>{cc.moveTo(0,-158);cc.bezierCurveTo(40,-158,66,-128,66,-92);cc.bezierCurveTo(67,-66,68,-46,70,-30);cc.bezierCurveTo(46,-24,-46,-24,-70,-30);
      cc.bezierCurveTo(-68,-46,-67,-66,-66,-92);cc.bezierCurveTo(-66,-128,-40,-158,0,-158);cc.closePath();};
  else hair=hairBand(0,-36);
  ag_soft(c,hair,hc,ag_lt(hc,0.3),34,-124,78,rgba(ag_dk(hc,0.7),0.4),10,0.8);
  // the window's light on the hair: a soft sheen on the right of the crown
  c.save();ag_shape(c,hair);c.clip();let sh=c.createRadialGradient(34,-116,4,34,-116,46);sh.addColorStop(0,rgba(mix(ag_lt(hc,0.5),LP.sun,0.3),0.4));sh.addColorStop(1,rgba(ag_lt(hc,0.5),0));c.fillStyle=sh;c.fillRect(-20,-170,110,110);c.restore();
  // strands from the crown's whorl, fine and tapering, a little lighter where the light falls
  c.save();ag_shape(c,hair);c.clip();const R=ag_rnd(k.seed||7),wx=8,wy=-126;
  for(let i=0;i<70;i++){const a=R()*TAU,len=40+R()*90,cu=(R()-0.5)*0.6,ex=wx+Math.cos(a)*len,ey=wy+Math.sin(a)*len*1.1,lit=Math.cos(a)>0.2;
    c.strokeStyle=rgba(lit?ag_lt(hc,0.3):ag_dk(hc,0.3),lit?0.32:0.28);c.lineWidth=1.4;c.beginPath();c.moveTo(wx+Math.cos(a)*6,wy+Math.sin(a)*6);
    c.quadraticCurveTo(wx+Math.cos(a+cu)*len*0.6,wy+Math.sin(a+cu)*len*0.66,ex,ey);c.stroke();}
  g=c.createLinearGradient(-64,0,64,0);g.addColorStop(0,rgba(LP.shade,0.25));g.addColorStop(0.6,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.08));c.fillStyle=g;c.fillRect(-70,-160,140,140);c.restore();
  if(k.hair==="knot"){const kn=cc=>{cc.ellipse(4,-136,27,23,0.1,0,TAU);};ag_soft(c,kn,hc,ag_lt(hc,0.26),16,-146,30,rgba(ag_dk(hc,0.7),0.45),6);
    c.strokeStyle=rgba(ag_lt(hc,0.25),0.35);c.lineWidth=1.4;for(let i=0;i<6;i++){c.beginPath();c.arc(4,-136,8+i*3.2,-2.4+i*0.15,0.2+i*0.12);c.stroke();}
    const cd=k.cord||[150,72,78];c.fillStyle=rgba(cd,1);c.beginPath();c.ellipse(4,-114,20,5,0.06,0,TAU);c.fill();c.fillStyle=rgba(ag_lt(cd,0.3),1);c.fillRect(18,-116,3,10);c.fillRect(-12,-117,3,10);}
  if(k.hair==="pony"){const tie=k.cord||[90,70,84];const tail=cc=>{cc.moveTo(-14,-106);cc.bezierCurveTo(-20,-70,-16,-20,-6,20);cc.bezierCurveTo(2,30,10,28,14,18);cc.bezierCurveTo(20,-20,22,-70,14,-106);cc.closePath();};
    ag_soft(c,tail,hc,ag_lt(hc,0.22),12,-60,50,rgba(ag_dk(hc,0.7),0.4),8);c.strokeStyle=rgba(ag_lt(hc,0.25),0.35);c.lineWidth=1.3;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-8+i*4,-100);c.quadraticCurveTo(-10+i*5,-40,-2+i*3,16);c.stroke();}
    c.fillStyle=rgba(tie,1);c.beginPath();c.ellipse(0,-106,16,7,0,0,TAU);c.fill();}}
// a pupil's picture, painted once at its size (and the film's 1.5 resolution) and kept
function gp_kid(k,s){const r=1.5*s,key="gpKid:"+k.key+":"+s;return ag_kept(key,Math.ceil(320*r),Math.ceil(470*r),(c)=>{c.scale(r,r);c.translate(160,166);gp_childPaint(c,k);});}
function gp_child(ctx,x,y,s,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const pic=gp_kid(k,s),bob=Math.sin((o.t||0)*TAU*(k.breath||0.3)+(k.seed||0))*0.8*s;
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-160*s,y-166*s+bob,320*s,470*s);ctx.restore();}

/* ---------------------------------------------------------------- the pupils: of the 1880s, and of today */
const GP_KIDS={
  meiji:[
    {key:"m1",hair:"crop",hc:[56,46,40],skin:[226,186,150],top:"kimono",c:[112,92,74],band:[62,52,46],seed:3,breath:0.31},
    {key:"m2",hair:"knot",hc:[38,32,30],skin:[232,194,160],top:"kimono",c:[128,96,100],band:[80,60,64],cord:[150,72,78],seed:5,breath:0.28},
    {key:"m3",hair:"crop",hc:[46,38,34],skin:[214,172,136],top:"kimono",c:[96,94,90],band:[56,54,52],seed:8,breath:0.33},
    {key:"m4",hair:"crop",hc:[40,34,30],skin:[222,180,144],top:"kimono",c:[134,112,84],band:[78,64,50],seed:11,breath:0.3},
    {key:"m5",hair:"knot",hc:[42,34,30],skin:[228,188,154],top:"kimono",c:[104,84,88],band:[60,48,52],cord:[140,96,70],seed:13,breath:0.32},
    {key:"m6",hair:"crop",hc:[44,36,32],skin:[218,176,140],top:"kimono",c:[120,104,92],band:[70,60,54],seed:17,breath:0.29},
    {key:"m7",hair:"knot",hc:[40,32,28],skin:[230,190,156],top:"kimono",c:[92,82,80],band:[150,120,110],cord:[128,70,80],seed:19,breath:0.34},
    {key:"m8",hair:"crop",hc:[42,34,32],skin:[220,178,142],top:"kimono",c:[110,86,70],band:[64,52,44],seed:23,breath:0.27},
    {key:"m9",hair:"crop",hc:[38,32,30],skin:[226,184,148],top:"kimono",c:[128,118,104],band:[74,66,58],seed:29,breath:0.31},
    {key:"m10",hair:"knot",hc:[44,36,32],skin:[224,182,146],top:"kimono",c:[118,90,82],band:[70,54,50],cord:[150,110,80],seed:31,breath:0.3}],
  today:[
    {key:"t1",hair:"short",hc:[46,38,34],skin:[228,190,156],top:"tee",c:[150,140,128],seed:3,breath:0.31},
    {key:"t2",hair:"pony",hc:[42,34,30],skin:[232,196,164],top:"sweater",c:[176,150,140],cord:[96,74,90],seed:5,breath:0.28},
    {key:"t3",hair:"short",hc:[40,34,30],skin:[216,174,138],top:"shirt",c:[236,234,228],seed:8,breath:0.33},
    {key:"t4",hair:"bob",hc:[44,36,32],skin:[226,186,152],top:"tee",c:[110,108,112],seed:11,breath:0.3},
    {key:"t5",hair:"short",hc:[52,42,36],skin:[220,178,144],top:"sweater",c:[132,118,104],seed:13,breath:0.32},
    {key:"t6",hair:"pony",hc:[40,32,28],skin:[230,192,160],top:"tee",c:[196,182,166],cord:[120,84,96],seed:17,breath:0.29},
    {key:"t7",hair:"short",hc:[42,36,32],skin:[212,170,134],top:"shirt",c:[228,226,220],seed:19,breath:0.34},
    {key:"t8",hair:"bob",hc:[48,38,34],skin:[228,188,154],top:"sweater",c:[98,92,96],seed:23,breath:0.27},
    {key:"t9",hair:"short",hc:[42,34,32],skin:[224,184,150],top:"tee",c:[168,152,136],seed:29,breath:0.31},
    {key:"t10",hair:"pony",hc:[46,38,32],skin:[226,186,150],top:"shirt",c:[232,230,224],cord:[80,80,90],seed:31,breath:0.3}]};

/* ---------------------------------------------------------------- a kimono, in the kit's figure space
   The kit's own "robe" reads as a round neck and a strap at the films' sizes, so the kimono is the film's: who.top {kind: "kimono",
   paint: gp_kimono, c, band (the collar), inner (the white under-collar), obi or hakama}. Facing right, the near side of the body is the
   wearer's right: the near panel's collar runs from the near side of the neck down under the far one, and the far (left) panel's
   collar comes from the far side of the neck and runs on across the chest to under the near arm, left over right. */
// a band of cloth w wide along a smooth line through pts (Catmull-Rom): its two edges, L on the left of the way it runs (y down), and R
function gp_edges(pts,w){const S=[],n=pts.length;for(let i=0;i<n-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(n-1,i+2)];
    for(let k=0;k<8;k++){const t=k/8,t2=t*t,t3=t2*t;S.push([0,1].map(j=>0.5*(2*p1[j]+(p2[j]-p0[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(3*p1[j]-p0[j]-3*p2[j]+p3[j])*t3)));}}
  S.push(pts[n-1]);const L=[],R=[];for(let i=0;i<S.length;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(S.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
    L.push([S[i][0]+dy/l*w/2,S[i][1]-dx/l*w/2]);R.push([S[i][0]-dy/l*w/2,S[i][1]+dx/l*w/2]);}
  return{L,R};}
const gp_poly=(P)=>c=>{c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);c.closePath();};
const gp_line=(c,P)=>{c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);c.stroke();};
// a soft shadow that one piece of cloth casts on what lies under it, then the piece itself
function gp_cloth(c,fn,base,hi,lx,ly,rad,a){c.save();c.shadowColor=rgba(LP.shade,a==null?0.35:a);c.shadowBlur=10;c.shadowOffsetX=-4;c.shadowOffsetY=6;ag_shape(c,fn);c.fillStyle=rgba(base,1);c.fill();c.restore();
  ag_soft(c,fn,base,hi,lx,ly,rad,rgba(ag_dk(base,0.7),0.4),8);}
// the kimono's parts, in figure space: the skin and the white under-collar inside the V; the near panel's collar, from the near side of
// the neck to where the far panel covers it; and the far panel, its collar along its edge from the far side of the neck across the chest
const GP_KIMONO=(()=>{const near=gp_edges([[198,570],[220,603],[335,767]],46),far=gp_edges([[400,579],[388,617],[370,680],[355,730],[334,778],[290,818],[220,866],[140,918],[60,968]],46);
  return{skin:gp_poly([[233,557],[363,578],[328,694]]),under:gp_poly([[216,556],[378,572],[333,724]]),
    near:gp_poly(near.L.concat(near.R.slice().reverse())),nearFold:near.L,
    panel:gp_poly(far.R.concat([[far.R[far.R.length-1][0],1130],[480,1130],[480,540],[far.R[0][0],540]])),
    far:gp_poly(far.L.concat(far.R.slice().reverse())),farFold:far.R,farSeam:far.L};})();
function gp_kimono(c,P){const T=P.top,K=GP_KIMONO,cl=T.c,band=T.band||ag_dk(cl,0.1),ju=T.inner||[232,226,212],sk=P.skin;
  c.save();ag_shape(c,AG_F.torso);c.clip();
  // the white under-collar, then the skin inside its V
  ag_soft(c,K.under,ju,ag_lt(ju,0.5),352,620,90,rgba(ag_dk(ju,0.5),0.3),8);
  ag_soft(c,K.skin,mix(sk,ag_dk(sk,0.4),0.1),ag_lt(sk,0.18),350,600,70,rgba(mix(sk,[90,40,30],0.6),0.35),12);
  // the near panel's collar, folded, its fold to the V
  ag_soft(c,K.near,band,ag_lt(band,0.28),300,690,110,rgba(ag_dk(band,0.7),0.35),8);
  // the far panel over it: the same cloth as the body, so only its edge shows, a dark line where it lies on the near one, and its collar
  // band along that edge, a shade darker, its fold catching the light and the seam on its other side
  ag_soft(c,K.panel,cl,ag_lt(cl,0.26),400,700,200,null);
  ag_soft(c,K.far,band,ag_lt(band,0.3),380,650,150,null);
  c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(ag_dk(cl,0.75),0.55);c.lineWidth=3;gp_line(c,K.farFold);
  c.strokeStyle=rgba(ag_dk(band,0.75),0.4);c.lineWidth=2.6;gp_line(c,K.nearFold);
  c.strokeStyle=rgba(ag_lt(band,0.45),0.5);c.lineWidth=2;c.save();c.translate(3,2);gp_line(c,K.farFold);c.restore();c.save();c.translate(-2,2);gp_line(c,K.nearFold);c.restore();
  c.strokeStyle=rgba(ag_dk(band,0.5),0.28);c.lineWidth=1.6;gp_line(c,K.farSeam);
  // soft folds in the kimono below the collar, falling towards the near side
  ag_folds(c,AG_F.torso,[[[408,760],[392,850],[400,940]],[[380,820],[350,880],[330,960]]],rgba(ag_dk(cl,0.6),0.22),"rgba(255,255,255,0.08)");
  // a woman's obi, the wide sash under the chest, or the top of a man's hakama, its pleats, and the ties round the waist
  if(T.obi){const ob=T.obi,y0=884,y1=1046,sash=cc=>{cc.moveTo(60,y0+10);cc.quadraticCurveTo(250,y0-6,440,y0+4);cc.lineTo(440,y1);cc.quadraticCurveTo(250,y1+8,60,y1);cc.closePath();};
    gp_cloth(c,sash,ob,ag_lt(ob,0.3),380,y0+50,170,0.4);c.strokeStyle=rgba(ag_dk(ob,0.3),0.4);c.lineWidth=2;
    for(const y of [y0+28,y1-26]){c.beginPath();c.moveTo(60,y+6);c.quadraticCurveTo(250,y-8,440,y+2);c.stroke();}}
  if(T.hakama){const hk=T.hakama,y0=972,top=cc=>{cc.moveTo(60,y0+10);cc.quadraticCurveTo(250,y0-4,440,y0+2);cc.lineTo(440,1110);cc.lineTo(60,1110);cc.closePath();};
    gp_cloth(c,top,hk,ag_lt(hk,0.25),380,y0+60,170,0.4);c.save();ag_shape(c,top);c.clip();
    for(let x=96;x<440;x+=13){c.strokeStyle=rgba(x%26<13?ag_lt(hk,0.2):ag_dk(hk,0.25),0.35);c.lineWidth=2;c.beginPath();c.moveTo(x,y0);c.lineTo(x+4,1110);c.stroke();}
    for(const x of [214,300,372]){c.strokeStyle=rgba(ag_dk(hk,0.45),0.5);c.lineWidth=3;c.beginPath();c.moveTo(x,y0+20);c.lineTo(x+8,1110);c.stroke();}c.restore();
    const tie=cc=>{cc.moveTo(60,y0+2);cc.quadraticCurveTo(250,y0-14,440,y0-6);cc.lineTo(440,y0+10);cc.quadraticCurveTo(250,y0+2,60,y0+18);cc.closePath();};
    ag_soft(c,tie,ag_dk(hk,0.1),ag_lt(hk,0.3),380,y0,80,null);}
  c.restore();}
// a kimono's sleeve hangs wide from a raised forearm: drawn behind the arm (the kit's holdBack), from the elbow to the cuff and down
function gp_sleeve(P){return (c,h)=>{const E=h.nearElbow,Wr=h.near,cl=P.top.c,dx=Wr[0]-E[0],dy=Wr[1]-E[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,
    a=[E[0]-uy*30-ux*40,E[1]+ux*30-uy*40],b=[Wr[0]-ux*24+uy*8,Wr[1]-uy*24-ux*8],fn=cc=>{cc.moveTo(a[0],a[1]);cc.lineTo(b[0],b[1]);
      cc.bezierCurveTo(b[0]+10,b[1]+90,b[0]+14,b[1]+200,b[0]+6,1120);cc.lineTo(a[0]-30,1120);cc.bezierCurveTo(a[0]-34,1060,a[0]-20,1000,a[0],a[1]);cc.closePath();};
  ag_soft(c,fn,ag_dk(cl,0.06),ag_lt(cl,0.26),b[0]-40,b[1]+120,200,rgba(ag_dk(cl,0.8),0.42),20);
  ag_folds(c,fn,[[[b[0]-10,b[1]+40],[b[0]-4,b[1]+160],[b[0]-8,b[1]+300]],[[a[0]+40,a[1]+20],[a[0]+60,a[1]+90],[a[0]+50,a[1]+200]]],rgba(ag_dk(cl,0.7),0.25),"rgba(255,255,255,0.1)");};}

/* ---------------------------------------------------------------- the teachers, of the 1880s and of today */
// a thread-bound notebook in the near hand, as the visitors hold it, in figure space
const gp_book=(col)=>(c,h)=>{const [x,y]=h.near;c.save();c.translate(x+18,y-30);c.rotate(-0.22);c.fillStyle=rgba(ag_dk(col,0.2),1);c.fillRect(-4,-4,100,132);
  c.fillStyle=rgba(col,1);c.fillRect(0,0,96,126);c.fillStyle="rgba(255,255,255,0.18)";c.fillRect(0,0,96,8);c.strokeStyle=rgba(ag_dk(col,0.45),0.8);c.lineWidth=2;
  for(let k=0;k<5;k++){c.beginPath();c.arc(8,14+k*25,3,0,TAU);c.stroke();}c.restore();};
const GP_PEOPLE={
  // the 1880s
  sensei:{name:"A teacher",key:"gp-sensei",skin:[222,182,146],hair:{style:"cropped",c:[30,26,24]},top:{kind:"suit",c:[70,66,64],inner:[234,230,220],tie:[48,44,46]},breath:0.27},
  oka:{name:"A visiting teacher",key:"gp-oka",skin:[226,186,152],hair:{style:"cropped",c:[34,30,28]},top:{kind:"kimono",paint:gp_kimono,c:[92,84,76],band:[84,77,70],inner:[230,224,210],hakama:[98,92,90]},breath:0.25},
  hana:{name:"A visiting teacher",key:"gp-hana",skin:[232,194,162],hair:{style:"bun",c:[26,22,22]},top:{kind:"kimono",paint:gp_kimono,c:[118,96,98],band:[108,88,91],inner:[232,226,214],obi:[136,116,94]},breath:0.31},
  mori:{name:"A visiting teacher",key:"gp-mori",skin:[220,178,142],hair:{style:"side",c:[28,24,24]},glasses:[70,60,50],top:{kind:"suit",c:[64,62,62],inner:[236,232,222],tie:[52,48,50]},breath:0.26},
  ito:{name:"A teacher",key:"gp-ito",skin:[214,172,136],hair:{style:"cropped",c:[60,56,54]},top:{kind:"suit",c:[84,76,70],inner:[234,230,220],tie:[70,56,52]},breath:0.24},
  // today
  ms:{name:"A teacher",key:"gp-ms",skin:[228,190,158],hair:{style:"bob",c:[34,28,26]},top:{kind:"cardigan",c:[150,136,122],inner:[236,232,224]},breath:0.3},
  obs1:{name:"A visiting teacher",key:"gp-obs1",skin:[222,182,148],hair:{style:"side",c:[30,26,26]},top:{kind:"suit",c:[76,74,74],inner:[234,234,230],tie:[96,70,74]},breath:0.26},
  obs2:{name:"A visiting teacher",key:"gp-obs2",skin:[230,192,160],hair:{style:"long",c:[36,28,26]},top:{kind:"blazer",c:[128,116,104],inner:[238,234,226]},breath:0.31},
  obs3:{name:"A visiting teacher",key:"gp-obs3",skin:[214,174,140],hair:{style:"cropped",c:[150,146,142]},glasses:[60,56,54],top:{kind:"sweater",c:[104,100,104]},breath:0.24},
  obs4:{name:"A visiting teacher",key:"gp-obs4",skin:[226,186,154],hair:{style:"bun",c:[40,32,30]},earrings:[214,200,170],top:{kind:"cardigan",c:[166,150,136],inner:[236,232,224]},breath:0.29}
};
// a person of the opening, drawn as the kit draws people, never a kimono facing left (it would cross the wrong way)
// (a kimono-wearer holding something has the sleeve hanging wide from that forearm)
function gp_who(ctx,who,x,y,s,o){o=o||{};const kim=who.top&&who.top.kind==="kimono";
  if(kim&&o.flip)throw new Error("gp_who: "+who.key+" wears a kimono, which crosses left over right: draw it facing right");
  if(kim&&o.pose==="hold"){const back=o.holdBack,sl=gp_sleeve(who);o=Object.assign({},o,{holdBack:(c,h)=>{if(back)back(c,h);sl(c,h);}});}
  return lp_person(ctx,who,x,y,s,o);}

/* ---------------------------------------------------------------- the class, back to front */
// the pupils' places: the row nearer the board (row 2) and the row nearest us (row 1), each [x, base of the neck y, size]
const GP_ROWS={far:{y:722,s:0.8,xs:[540,716,892,1068,1244,1420]},near:{y:902,s:1.12,xs:[486,744,1002,1260,1508]}};
// a row of long desks, seen from behind the pupils who sit at them: the top's far edge, the top, and the back panel facing us
function gp_desks(ctx,y,x0,x1,o){o=o||{};const th=o.th||14,ph=o.ph||120;ctx.save();
  let g=ctx.createLinearGradient(0,y-th,0,y);g.addColorStop(0,rgba(mix(GP_K.desk,[255,248,236],0.25),1));g.addColorStop(1,rgba(GP_K.desk,1));ctx.fillStyle=g;ctx.fillRect(x0,y-th,x1-x0,th);
  g=ctx.createLinearGradient(0,y,0,y+ph);g.addColorStop(0,rgba(GP_K.deskDk,1));g.addColorStop(1,rgba(mix(GP_K.deskDk,LP.shade,0.35),1));ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,ph);
  g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(LP.shade,0.18));g.addColorStop(0.6,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.1));ctx.fillStyle=g;ctx.fillRect(x0,y-th,x1-x0,th+ph);
  ctx.strokeStyle="rgba(255,248,236,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y-th);ctx.lineTo(x1,y-th);ctx.stroke();
  ctx.fillStyle=rgba(LP.shade,0.2);for(let x=x0+170;x<x1-40;x+=350)ctx.fillRect(x,y+6,4,ph-6);
  // a slate on the desk, where one shows between two pupils
  if(o.slates)for(const sx of o.slates){ctx.fillStyle=rgba(GP_K.frame,1);ctx.fillRect(sx-34,y-th-6,68,10);ctx.fillStyle=rgba(GP_K.slate,1);ctx.fillRect(sx-28,y-th-4,56,6);}
  ctx.restore();}
function gp_class(ctx,t,o){o=o||{};const era=o.era||"meiji",now=era==="today",lt={light:o.light||"day",wall:0},P=GP_PEOPLE,kids=GP_KIDS[era],look=o.look==null?1:o.look;
  const ta=o.teacher==null?1:o.teacher,ka=o.kids==null?1:o.kids,oa=o.obs==null?1:o.obs;
  // the teacher at the board, behind the teacher's desk
  const cut=lp_table(ctx,700,592,520,{a:0,floor:null});
  gp_who(ctx,now?P.ms:P.sensei,900,436,0.5,{t,cut,light:{light:o.light||"day",wall:0.12},a:ta,gaze:[2,1]});
  lp_table(ctx,700,592,520,{depth:40,floor:null});
  // the row nearer the board, its pupils, then the row nearest us
  gp_desks(ctx,650,380,1560,{ph:110,slates:now?[]:[628,980,1332]});
  GP_ROWS.far.xs.forEach((x,i)=>gp_child(ctx,x,GP_ROWS.far.y,GP_ROWS.far.s,kids[i],{t,a:ka}));
  gp_desks(ctx,808,300,1640,{ph:140,slates:now?[]:[614,1130]});
  GP_ROWS.near.xs.forEach((x,i)=>gp_child(ctx,x,GP_ROWS.near.y,GP_ROWS.near.s,kids[6+(i%4)]||kids[i],{t,a:ka}));
  // the visitors at the sides, at the near row, each with a notebook, their eyes on the pupils (o.lx, o.rx: those on the left and on the
  // right still on their way in, so far off their places)
  const g=[lerp(0,4,look),lerp(0,3,look)],gl=[lerp(0,-4,look),lerp(0,3,look)],L=o.lx||0,R=o.rx||0;
  if(now){gp_who(ctx,P.obs4,350+L,712,0.76,{t,light:lt,a:oa,gaze:g});gp_who(ctx,P.obs2,150+L,684,0.82,{t,light:lt,a:oa,pose:"hold",hold:gp_book([214,206,190]),gaze:g});
    gp_who(ctx,P.obs3,1575+R,712,0.76,{t,flip:true,light:lt,a:oa,gaze:gl});gp_who(ctx,P.obs1,1770+R,684,0.82,{t,flip:true,light:lt,a:oa,pose:"hold",hold:gp_book([206,200,188]),gaze:gl});}
  else{gp_who(ctx,P.hana,360+L,712,0.76,{t,light:lt,a:oa,pose:"hold",hold:gp_book([200,186,160]),gaze:g});gp_who(ctx,P.oka,160+L,684,0.82,{t,light:lt,a:oa,pose:"hold",hold:gp_book([196,180,150]),gaze:g});
    gp_who(ctx,P.mori,1765+R,684,0.82,{t,flip:true,light:lt,a:oa,pose:"hold",hold:gp_book([190,176,150]),gaze:gl});}}
// the pupils' heads, for marks over them: [x, the top of the head] of each, the row nearer the board first
const GP_HEADS=GP_ROWS.far.xs.map(x=>[x,GP_ROWS.far.y-160*GP_ROWS.far.s]).concat(GP_ROWS.near.xs.map(x=>[x,GP_ROWS.near.y-160*GP_ROWS.near.s]));

/* ---------------------------------------------------------------- after school: the staffroom, and the reflection session */
function gp_paintStaff(c){lp_paintRoom(c,{light:"late",seed:15,base:[220,204,182]});
  // a timber dado, a bookcase of bound books on the left, the clock
  let g=c.createLinearGradient(0,640,0,914);g.addColorStop(0,rgba(mix(GP_K.frame,LP.shade,0.2),1));g.addColorStop(1,rgba(mix(GP_K.frame,LP.shade,0.36),1));c.fillStyle=g;c.fillRect(0,640,W,274);
  c.fillStyle=rgba(mix(GP_K.frame,[255,248,236],0.2),1);c.fillRect(0,636,W,8);
  const bx=120,by=170,bw=340,bh=470;c.save();c.shadowColor="rgba(52,36,30,0.35)";c.shadowBlur=20;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=12;c.fillStyle=rgba(GP_K.frameDk,1);c.fillRect(bx,by,bw,bh);c.restore();
  const R=ag_rnd(9);for(let sh=0;sh<4;sh++){const y=by+20+sh*112;c.fillStyle=rgba(mix(GP_K.frameDk,LP.shade,0.4),1);c.fillRect(bx+14,y,bw-28,96);let x=bx+20;
    while(x<bx+bw-34){const w=14+R()*16,h=60+R()*30,col=[[120,96,80],[96,84,76],[140,120,96],[86,76,70],[150,132,110]][Math.floor(R()*5)];c.fillStyle=rgba(col,1);c.fillRect(x,y+96-h,w,h);
      c.fillStyle="rgba(255,250,240,0.18)";c.fillRect(x+2,y+96-h+8,w-4,3);x+=w+2;}
    c.fillStyle=rgba(GP_K.frame,1);c.fillRect(bx+10,y+96,bw-20,10);}
  lp_sun(c,LP_LIGHT.late.sun,{a:0.6,col:LP_LIGHT.late.col,clip:x=>{x.beginPath();x.rect(bx,by,bw,bh);x.clip();}});
  const cx=1500,cy=150;c.fillStyle=rgba(GP_K.clock,1);c.beginPath();for(let k=0;k<8;k++){const a=Math.PI/8+k*Math.PI/4;c.lineTo(cx+Math.cos(a)*46,cy+Math.sin(a)*46);}c.closePath();c.fill();
  c.fillStyle=rgba([244,238,226],1);c.beginPath();c.arc(cx,cy,34,0,TAU);c.fill();c.strokeStyle=rgba(LP.graphite,0.8);c.lineWidth=3;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+16,cy+10);c.moveTo(cx,cy);c.lineTo(cx+2,cy-24);c.stroke();}
AG_PLACES.gpStaff=c=>gp_paintStaff(c);
// a notebook lying open on a table, seen from across it: two pages and their lines, flattened by the angle
function gp_open(ctx,x,y,s,o){o=o||{};const w=150*s,d=44*s,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  ctx.fillStyle=rgba(LP.shade,0.18);ctx.beginPath();ctx.ellipse(-8,d*0.6,w*1.04,d*0.45,0,0,TAU);ctx.fill();
  for(const sd of [-1,1]){ctx.fillStyle=rgba(sd<0?[234,226,208]:[246,240,226],1);ctx.beginPath();ctx.moveTo(0,-d*0.42);ctx.lineTo(sd*w*0.92,-d*0.5);ctx.lineTo(sd*w,d*0.5);ctx.lineTo(0,d*0.56);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba([120,110,100],0.45);ctx.lineWidth=1.4;for(let k=1;k<5;k++){const u=k/5;ctx.beginPath();ctx.moveTo(sd*8,lerp(-d*0.42,d*0.56,u));ctx.lineTo(sd*lerp(w*0.92,w,u)*0.86,lerp(-d*0.5,d*0.5,u));ctx.stroke();}}
  ctx.strokeStyle=rgba([150,130,110],0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-d*0.42);ctx.lineTo(0,d*0.56);ctx.stroke();ctx.restore();}
// the teachers round the table, seated, facing each other: the two visitors in a kimono on the left, facing right; the teacher who
// taught and the third visitor, in suits, on the right, facing left; the visitors' notebooks open on the table between them
function gp_staff(ctx,t,o){o=o||{};const P=GP_PEOPLE,lt={light:"late",wall:0.1},a=o.a==null?1:o.a,ty=900,cut=lp_table(ctx,200,ty,1520,{a:0});
  gp_who(ctx,P.oka,470,640,1.0,{t,cut,light:lt,a,gaze:[3,2]});gp_who(ctx,P.hana,770,652,0.96,{t,cut,light:lt,a,gaze:[3,2]});
  gp_who(ctx,P.sensei,1150,652,0.96,{t,flip:true,cut,light:lt,a,gaze:[3,2]});gp_who(ctx,P.mori,1450,640,1.0,{t,flip:true,cut,light:lt,a,gaze:[3,2]});
  ctx.save();ctx.globalAlpha*=a;lp_table(ctx,200,ty,1520,{depth:90,floor:1064});ctx.restore();
  gp_open(ctx,700,862,0.9,{a});gp_open(ctx,1230,866,0.9,{a});}

/* ---------------------------------------------------------------- the film's plain wall */
AG_PLACES.gpWall=c=>lp_paintRoom(c,{light:"day",seed:11});
