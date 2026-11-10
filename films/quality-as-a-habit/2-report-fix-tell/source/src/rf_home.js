/* ===== Report, fix, tell: Andrés at home, and the portal on his laptop =====
   rfHome is his room on a Monday evening in October: a plastered wall warm with lamplight, a window on the right with the sky going dark,
   a shelf of books on the left, and a wooden table along the bottom. He sits behind it (cut at its back edge, RF_HOME.table), his laptop
   open in front of him, seen from the side, its screen lighting his face. rfScreen is that screen, close: the laptop's dark bezel round a
   light page; the page is the university's graduation portal (named by what it does, never by a maker), drawn live by rf_portal. The
   colours of the module mean what they always mean: the two rings on the letters are amber (a person looks before it goes on), the
   outline round the button brass (the requirement: where he sees the data, he can say it's wrong). Every name here starts with rf_ or RF_. */

const RF_HOME={table:800};
function rf_paintHome(c){const T=RF_HOME.table;
  // the wall: warm plaster, lit by the lamp on the right, darker into the left corner
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgb(150,132,116)");g.addColorStop(0.55,"rgb(196,176,154)");g.addColorStop(1,"rgb(214,190,162)");c.fillStyle=g;c.fillRect(0,0,W,T);
  g=c.createLinearGradient(0,0,0,T);g.addColorStop(0,"rgba(40,30,30,0.18)");g.addColorStop(0.5,"rgba(40,30,30,0)");c.fillStyle=g;c.fillRect(0,0,W,T);
  rf_mottle(c,0,0,W,T,201,4,0.04);
  // the window: the evening outside, dusk going to night, the far roofs dark against it, a soft curtain drawn back on its right
  const wx=1150,wy=110,ww=520,wh=520;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(52,50,82)");g.addColorStop(0.6,"rgb(104,86,112)");g.addColorStop(1,"rgb(176,128,118)");
  c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgb(44,40,58)";c.beginPath();c.moveTo(wx,wy+wh);const R=ag_rnd(205);let x=wx;while(x<wx+ww){const bw=40+R()*90,bh=60+R()*120;c.lineTo(x,wy+wh-bh);c.lineTo(x+bw,wy+wh-bh);x+=bw;}c.lineTo(wx+ww,wy+wh);c.closePath();c.fill();
  for(let i=0;i<9;i++){c.fillStyle="rgba(255,214,150,"+(0.35+R()*0.3)+")";c.fillRect(wx+20+R()*(ww-40),wy+wh-30-R()*90,8,10);}
  c.fillStyle="rgb(236,226,210)";for(const [fx,fy,fw,fh] of [[wx-16,wy-16,ww+32,16],[wx-16,wy+wh,ww+32,22],[wx-16,wy,16,wh],[wx+ww,wy,16,wh],[wx+ww/2-6,wy,12,wh],[wx,wy+wh*0.42,ww,10]])c.fillRect(fx,fy,fw,fh);
  c.fillStyle="rgba(60,40,30,0.25)";c.fillRect(wx-16,wy+wh+22,ww+32,8);
  ag_soft(c,cc=>{cc.moveTo(wx+ww-30,wy-30);cc.bezierCurveTo(wx+ww+40,wy+200,wx+ww+10,wy+420,wx+ww+70,wy+wh+40);cc.lineTo(wx+ww+170,wy+wh+40);cc.bezierCurveTo(wx+ww+150,wy+300,wx+ww+170,wy+120,wx+ww+150,wy-30);cc.closePath();},
    [196,170,150],[226,204,182],wx+ww+150,wy+200,260,"rgba(80,50,40,0.3)",12);
  // a shelf on the left wall, a few books and a small plant pot
  c.fillStyle="rgba(40,28,20,0.2)";c.fillRect(64,354,480,10);c.fillStyle="rgb(118,86,62)";c.fillRect(60,336,480,18);c.fillStyle="rgba(255,226,190,0.2)";c.fillRect(60,336,480,3);
  const books=[[86,150,[96,70,60]],[118,170,[70,66,84]],[150,140,[130,100,70]],[178,160,[86,60,52]],[208,128,[150,128,96]],[234,166,[60,58,62]]];
  for(const [bx,bh,col] of books){g=c.createLinearGradient(bx,0,bx+30,0);g.addColorStop(0,rgba(ag_dk(col,0.2),1));g.addColorStop(1,rgba(ag_lt(col,0.1),1));c.fillStyle=g;c.fillRect(bx,336-bh,28,bh);
    c.fillStyle="rgba(255,236,200,0.2)";c.fillRect(bx+4,336-bh+16,20,3);}
  c.save();c.translate(300,336);c.rotate(-0.28);c.fillStyle="rgb(124,98,74)";c.fillRect(0,-150,26,150);c.restore();
  g=c.createLinearGradient(420,0,480,0);g.addColorStop(0,"#8a5e44");g.addColorStop(1,"#b07c5a");c.fillStyle=g;c.beginPath();c.moveTo(416,336);c.lineTo(484,336);c.lineTo(476,276);c.lineTo(424,276);c.closePath();c.fill();
  rf_crown(c,[[450,240,50,40],[430,230,26,24],[470,226,28,22],[452,210,30,24]],[96,112,84],207,{spread:60,flecks:3});
  // the lamp on the table, at the right: its base, its stem and a cloth shade, lit, its warm pool on the wall
  dq_pool(c,1720,560,640,[255,214,160],0.32);
  c.fillStyle="rgb(70,58,50)";c.fillRect(1712,640,12,180);c.beginPath();c.ellipse(1718,826,60,12,0,0,TAU);c.fill();
  g=c.createLinearGradient(0,520,0,650);g.addColorStop(0,"rgb(250,232,200)");g.addColorStop(1,"rgb(255,244,222)");c.fillStyle=g;c.beginPath();c.moveTo(1650,530);c.lineTo(1786,530);c.lineTo(1824,648);c.lineTo(1612,648);c.closePath();c.fill();
  glow(c,1718,660,120,[255,226,170],0.4);
  // the table: its top seen a little from above, oak, and its front edge in shade
  g=c.createLinearGradient(0,T,0,T+90);g.addColorStop(0,"rgb(124,90,64)");g.addColorStop(1,"rgb(146,108,76)");c.fillStyle=g;c.fillRect(0,T,W,90);
  const r2=ag_rnd(209);c.save();for(let i=0;i<26;i++){const y=T+4+r2()*82;c.strokeStyle="rgba(70,46,30,"+(0.08+r2()*0.08)+")";c.lineWidth=1+r2()*2;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(W*0.3,y+(r2()-0.5)*6,W*0.6,y+(r2()-0.5)*6,W,y+(r2()-0.5)*4);c.stroke();}c.restore();
  dq_pool(c,1700,860,520,[255,206,150],0.16,0.3);
  c.fillStyle="rgb(84,60,44)";c.fillRect(0,T+90,W,H-T-90);c.fillStyle="rgba(255,226,190,0.2)";c.fillRect(0,T+90,W,2);
  g=c.createLinearGradient(0,T+92,0,H);g.addColorStop(0,"rgba(20,12,8,0)");g.addColorStop(1,"rgba(20,12,8,0.4)");c.fillStyle=g;c.fillRect(0,T+92,W,H-T-92);}
AG_PLACES.rfHome=c=>rf_paintHome(c);

// the laptop on the table, seen from the side: its base, the lid tilted back on its hinge, the screen facing him and lighting him (glow,
// 0 to 1); (x, y) the base's near end on the table
function rf_laptop(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  ag_floorShadow(c,x+150,y+6,190,12,0.4);
  const hx=x+290,hy=y-8,lx=hx+52,ly=hy-236;
  // the screen's light, a soft glow on its near side
  const gl=o.glow==null?1:o.glow;if(gl>0)dq_pool(c,(hx+lx)/2-40,(hy+ly)/2,200,[226,232,240],0.16*gl,1.4);
  // the base
  let g=c.createLinearGradient(0,y-18,0,y);g.addColorStop(0,"rgb(150,150,156)");g.addColorStop(1,"rgb(96,96,102)");c.fillStyle=g;rr(c,x,y-18,300,18,6);c.fill();
  c.fillStyle="rgba(255,255,255,0.3)";c.fillRect(x+6,y-18,288,2);
  // the lid, tilted back: its back in the room's light, the screen's edge pale on its near side
  c.fillStyle="rgb(120,120,128)";c.beginPath();c.moveTo(hx-6,hy);c.lineTo(lx-6,ly);c.lineTo(lx+10,ly+3);c.lineTo(hx+12,hy);c.closePath();c.fill();
  c.strokeStyle="rgba(236,240,246,"+(0.5+0.4*gl)+")";c.lineWidth=3;c.beginPath();c.moveTo(hx-6,hy-4);c.lineTo(lx-6,ly+4);c.stroke();
  c.fillStyle="rgb(70,70,76)";c.beginPath();c.arc(hx+2,hy-2,7,0,TAU);c.fill();c.restore();}

/* ---------------------------------------------------------------- the screen, close: the portal
   The laptop's dark bezel round the page. rf_portal(ctx, st) draws the page in the frame's coordinates; st (each 0 to 1 unless said):
     name      the name as the page shows it ("Andres Penaloza", or once answered "Andrés Peñaloza"), nameA its opacity
     ringE     the amber ring on the e of Andres; ringN on the n of Penaloza
     cursor    [x, y, a]: the pointer, and press (0 to 1): the button "This isn't my name" pressed
     field     the field opens; typed (0 to 1) types "Andrés Peñaloza" into it; caret (true while he types)
     promise   the line "The registrar's office will answer by Wednesday 14 October."
     outline   the brass outline round the button "This isn't my name", and its chip "Where he sees it"
     answer    the answer that replaces the field: "Your name will be printed as Andrés Peñaloza." then thanks, "Thank you for telling us."
     dim       the page dimmed a little, for a card laid over it */
const RF_PAGE={x:96,y:70,w:1728,h:960,lx:200,kick:300,nameY:430,btnY:500,btnH:84,fieldY:680,promY:836};
function rf_paintScreen(c){c.fillStyle="rgb(22,22,26)";c.fillRect(0,0,W,H);const P=RF_PAGE;
  let g=c.createLinearGradient(0,P.y,0,P.y+P.h);g.addColorStop(0,"rgb(250,248,244)");g.addColorStop(1,"rgb(242,239,232)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  // the page's bar: the portal's name (drawn live), and a rule under it
  c.fillStyle="rgb(232,228,220)";c.fillRect(P.x,P.y,P.w,104);c.fillStyle="rgba(60,50,40,0.18)";c.fillRect(P.x,P.y+104,P.w,2);
  // the university's mark: a plain shield, no maker's logo
  c.fillStyle=rgba(DQ.ink,0.85);c.beginPath();c.moveTo(P.x+64,P.y+26);c.lineTo(P.x+108,P.y+26);c.lineTo(P.x+108,P.y+58);c.quadraticCurveTo(P.x+108,P.y+76,P.x+86,P.y+84);c.quadraticCurveTo(P.x+64,P.y+76,P.x+64,P.y+58);c.closePath();c.fill();
  // on it, an open book, in two pages
  c.strokeStyle="rgb(232,228,220)";c.lineWidth=3;c.lineJoin="round";c.beginPath();c.moveTo(P.x+72,P.y+44);c.quadraticCurveTo(P.x+80,P.y+40,P.x+86,P.y+46);c.quadraticCurveTo(P.x+92,P.y+40,P.x+100,P.y+44);
  c.lineTo(P.x+100,P.y+64);c.quadraticCurveTo(P.x+92,P.y+60,P.x+86,P.y+66);c.quadraticCurveTo(P.x+80,P.y+60,P.x+72,P.y+64);c.closePath();c.stroke();c.beginPath();c.moveTo(P.x+86,P.y+46);c.lineTo(P.x+86,P.y+66);c.stroke();
  // the screen's faint sheen, from the room's lamp on the right
  g=c.createLinearGradient(P.x+P.w,P.y,P.x+P.w*0.5,P.y+P.h);g.addColorStop(0,"rgba(255,244,226,0.1)");g.addColorStop(1,"rgba(255,244,226,0)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);}
AG_PLACES.rfScreen=c=>rf_paintScreen(c);
const RF_NAME_SIZE=104,RF_BTN=[{t:"This is my name",x:200,w:430},{t:"This isn't my name",x:670,w:490}];
// where a letter of the name sits on the page: the centre of the k-th character of s, drawn at the name's size from x
function rf_letterAt(c,s,k,x,size){const F={w:800,size},a=dq_tw(c,s.slice(0,k),F),b=dq_tw(c,s.slice(0,k+1),F);return x+(a+b)/2;}
function rf_portal(c,st){const P=RF_PAGE,F={w:800,size:RF_NAME_SIZE},dim=st.dim||0;
  dq_T(c,"Graduation portal",P.x+136,P.y+66,{w:800,size:34});dq_T(c,"December's ceremonies",P.x+P.w-48,P.y+66,{w:600,size:28,col:DQ.soft,align:"right"});
  const ans=st.answer||0;
  // what the page asks
  dq_label(c,P.lx,P.kick,"Your name, as it will be printed");
  const nm=st.name||"Andres Penaloza",na=st.nameA==null?1:st.nameA;
  if(st.name2&&st.swap>0){c.save();c.globalAlpha*=na*(1-st.swap);dq_T(c,nm,P.lx,P.nameY,F);c.restore();c.save();c.globalAlpha*=st.swap;dq_T(c,st.name2,P.lx,P.nameY,F);c.restore();}
  else{c.save();c.globalAlpha*=na;dq_T(c,nm,P.lx,P.nameY,F);c.restore();}
  // the two marks: a small amber ring round each letter that lost its accent
  for(const [k,u] of [[4,st.ringE||0],[9,st.ringN||0]]){if(u<=0.01)continue;const cx=rf_letterAt(c,nm,k,P.lx,RF_NAME_SIZE),cy=P.nameY-RF_NAME_SIZE*0.27,r=RF_NAME_SIZE*0.38;
    c.save();c.strokeStyle=rgba(DQ_TONE.hold.col,0.95*clamp(u*1.4,0,1));c.lineWidth=6;c.lineCap="round";c.beginPath();c.arc(cx,cy,r*lerp(1.3,1,ag_eo(u)),-Math.PI/2,-Math.PI/2+TAU*clamp(u*1.2,0,1));c.stroke();c.restore();}
  // the two buttons; the second pressed
  const pr=st.press||0;RF_BTN.forEach((b,i)=>{const on=i===1?pr:0,y=P.btnY,h=P.btnH,k=i===1?1-0.03*Math.sin(Math.PI*clamp(pr*2,0,1)):1;c.save();c.translate(b.x+b.w/2,y+h/2);c.scale(k,k);c.translate(-b.x-b.w/2,-y-h/2);
    rr(c,b.x,y,b.w,h,14);c.fillStyle=rgba(mix([250,248,244],DQ.ink,0.92*on),1);c.fill();c.strokeStyle=rgba(DQ.ink,0.7);c.lineWidth=2.5;c.stroke();
    dq_T(c,b.t,b.x+b.w/2,y+h/2+11,{w:700,size:32,align:"center",color:rgba(mix(DQ.ink,[250,248,244],on),1)});c.restore();});
  // the brass outline round the button he can press: where he sees the data, he can say it's wrong
  const ol=st.outline||0;if(ol>0.01){const b=RF_BTN[1];c.save();c.globalAlpha*=ol;c.strokeStyle=rgba(DQ.brass,0.95);c.lineWidth=5;rr(c,b.x-14,P.btnY-14,b.w+28,P.btnH+28,22);c.stroke();c.restore();
    dq_chip(c,b.x+b.w+40,P.btnY+P.btnH/2+12,"Where he sees it",{col:"brass",a:ol});}
  // the field he types his name into, as he writes it
  const fo=(st.field||0)*(1-ans);if(fo>0.01){c.save();c.globalAlpha*=fo;const y=P.fieldY+(1-ag_eo(st.field))*16;dq_T(c,"Your name, as you write it",P.lx,y-24,{w:600,size:28,col:DQ.soft});
    rr(c,P.lx,y,780,86,12);c.fillStyle="rgb(255,255,255)";c.fill();c.strokeStyle=rgba(DQ.ink,0.5);c.lineWidth=2;c.stroke();
    const full="Andrés Peñaloza",n=Math.round(full.length*clamp(st.typed||0,0,1)),s=full.slice(0,n);dq_T(c,s,P.lx+28,y+58,{w:600,size:44});
    if(st.caret&&((st.t||0)*2%1<0.6)){const cx=P.lx+30+dq_tw(c,s,{w:600,size:44});c.fillStyle=rgba(DQ.ink,0.8);c.fillRect(cx,y+18,3,52);}c.restore();}
  // what happens next, and later the answer
  const pa=(st.promise||0)*(1-ans);if(pa>0.01)dq_T(c,"The registrar's office will answer by Wednesday 14 October.",P.lx,P.promY,{w:600,size:34,a:pa});
  if(ans>0.01){dq_T(c,"Your name will be printed as Andrés Peñaloza.",P.lx,P.fieldY+40,{w:700,size:44,a:ans});
    dq_T(c,"Thank you for telling us.",P.lx,P.fieldY+110,{w:600,size:36,col:DQ.soft,a:st.thanks||0});}
  // the pointer
  if(st.cursor&&st.cursor[2]>0.01){const [x,y,a]=st.cursor;c.save();c.globalAlpha*=a;c.translate(x,y);const k=1-0.12*Math.sin(Math.PI*clamp(pr*2,0,1));c.scale(k*1.3,k*1.3);
    c.beginPath();c.moveTo(0,0);c.lineTo(0,34);c.lineTo(9,26);c.lineTo(16,40);c.lineTo(22,37);c.lineTo(15,24);c.lineTo(26,24);c.closePath();c.fillStyle="#fff";c.fill();c.strokeStyle="#1c1c1f";c.lineWidth=2;c.lineJoin="round";c.stroke();c.restore();}
  if(dim>0){c.fillStyle="rgba(30,26,22,"+0.35*dim+")";c.fillRect(P.x,P.y,P.w,P.h);}}
