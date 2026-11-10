/* ===== Show the least: the past =====
   Victoria, 1856, and Britain, 1872, painted by lamplight at dusk, in the module's Night glass look: the rooms dark, warm light from
   the lamps, deep blue at the windows; what is shown on glass keeps its full colour. Places, painted once (AG_PLACES):
     slRoom     a polling room, 1856: timber walls, two tall windows at dusk, the official's tall desk with the roll, an inkstand and
                a lamp
     slBallot   the same room after the Act: a booth at the right, its curtain drawn, a lamp and a writing slope inside it
     slCount    the same room at the count: the papers in piles on the desk, a board of chalk tallies under "Totals"
     slTable    Britain, 1872: a table seen from above, a ballot paper turned over, the counterfoils' book, a packet tied and sealed
   Everyone in the room stands, so their eyes share one line, the camera's height (SL_R.eye): the official behind his tall desk at the
   left (the desk hides him below its top, o.cut), the voter at the desk's end, those who could learn his vote at the right. The box,
   on its stand in front of the voter, and the booth's posts and curtain are drawn over him (sl_box, sl_booth). The people of 1856
   (SL_CAST) are drawn with the agent films' geometry, lit by the lamp (dp_person, light SL_LAMP): men's clothes of the 1850s in the
   colony, no hats indoors. Those who could learn his vote stand further back, behind the rail that keeps the public from the desk,
   which hides them below the waist (o.cut); being further, they are smaller, and their eyes are on the same line. No real person is
   drawn: Henry Chapman is a name on a card. */

/* ---------------------------------------------------------------- the people of 1856 */
// a moustache over the upper lip, under the nose's tip, its near side wider as the face turns three-quarters
const sl_moustache=(col)=>(c,P)=>{c.save();c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(334,490);c.bezierCurveTo(335,478,345,469,358,467);c.bezierCurveTo(368,465,378,466,385,469);
  c.bezierCurveTo(391,472,393,480,390,487);c.bezierCurveTo(386,482,380,479,372,479);c.bezierCurveTo(362,479,352,481,344,485);c.bezierCurveTo(340,487,337,489,334,490);c.closePath();c.fill();
  c.strokeStyle=rgba(mix(col,[0,0,0],0.3),0.4);c.lineWidth=1.3;c.lineCap="round";for(let k=0;k<6;k++){const x=346+k*7;c.beginPath();c.moveTo(x,470+Math.abs(k-2.5)*0.6);c.lineTo(x-3,479);c.stroke();}c.restore();};
const SL_CAST={
  // the official at the desk, who keeps the roll: a dark frock coat, a white shirt and a black cravat, greying hair
  official:{key:"sl_official",name:"the official",skin:[228,194,166],hair:{style:"side",c:[92,84,78]},top:{kind:"suit",c:[40,42,50],inner:[238,234,222],tie:[24,24,28]},breath:0.24},
  // the voter, a working man: a blue serge work shirt, as the colony's diggers wore, over a cream one, a full beard
  voter:{key:"sl_voter",name:"the voter",skin:[212,168,134],hair:{style:"cropped",c:[84,60,42]},beard:[90,66,48],top:{kind:"overshirt",c:[66,80,100],inner:[226,216,194]},breath:0.28},
  // those who could learn his vote: his employer (older, grey-bearded, a brown frock coat), his landlord (a grey coat, a moustache),
  // a candidate (black)
  employer:{key:"sl_employer",name:"his employer",skin:[232,198,172],hair:{style:"side",c:[166,162,156]},beard:[178,174,168],top:{kind:"suit",c:[70,58,50],inner:[240,236,226],tie:[34,30,32]},breath:0.22},
  landlord:{key:"sl_landlord",name:"his landlord",skin:[224,186,158],hair:{style:"cropped",c:[72,64,60]},top:{kind:"blazer",c:[88,90,96],inner:[236,232,222],tie:[42,40,42]},hat:{paint:sl_moustache([78,66,60])},breath:0.24},
  candidate:{key:"sl_candidate",name:"a candidate",skin:[230,198,172],hair:{style:"side",c:[52,40,34]},top:{kind:"suit",c:[30,32,40],inner:[242,240,234],tie:[26,26,32]},breath:0.25}};
// the lamplight of 1856: the kit's lamp, warm from in front, with only a faint cool edge from the dusk at the windows behind them (the
// kit's rim, the glass's light, would read as an outline in a room with no glass)
const SL_LAMP=Object.assign({},DP_LIGHTS.lamp,{rim:[120,146,184],rimA:0.32,rimW:3});
DP_PEOPLE.push(...["official","voter","employer","landlord","candidate"].map(k=>[SL_CAST[k],SL_LAMP]));

/* ---------------------------------------------------------------- the polling room, 1856
   Where things are in the frame. eye: the line the standing people's eyes share (the camera's height), which the floor's lines run
   to; wall: where the back wall meets the floor; desk: [left, right, back edge, front edge] of the desk's top, at the official's
   chest (a tall clerk's desk); the official and the voter [x, y, size] as dp_person takes them, far enough apart for their faces to
   read as two; box [x, y, w, h] on its stand, under the voter's hand as he holds his paper; booth: the booth's left post; inBooth:
   where the voter stands behind its curtain; rail: [left end, top] of the rail at the far side, where the public stands; watchers
   [who, x, size], behind it, drawn furthest first; board: the count's board of tallies. */
const SL_R={eye:408,wall:700,desk:[230,900,812,838],roll:[470,832],ink:[800,836],lamp:[300,836],box:[921,798,148,106],booth:1460,inBooth:1700,
  board:[700,170,520,300],official:[580,579,0.96],voter:[1040,590,1.02],rail:[1180,880],
  watchers:[["candidate",1770,0.78],["landlord",1550,0.80],["employer",1320,0.84]]};
// the height to draw a person of size s at, for their eyes to be on the eye line (a face's eyes are 178 figure units above the anchor)
const sl_eyeY=s=>SL_R.eye+178*s;
const sl_planks=(c,x0,x1,y0,y1,R,base,var_)=>{for(let x=x0;x<x1;){const w=60+R()*36,v=(R()-0.5)*var_;c.fillStyle=rgba(base.map(k=>clamp(k+v,0,255)),1);c.fillRect(x,y0,w+1,y1-y0);
    c.fillStyle="rgba(0,0,0,0.32)";c.fillRect(x+w-2,y0,2,y1-y0);c.fillStyle="rgba(255,220,180,0.05)";c.fillRect(x,y0,2,y1-y0);x+=w;}};
// a sash window at dusk: deep blue, a little lighter low down, its frame and glazing bars
function sl_window(c,x,y,w,h){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgb(16,28,54)");g.addColorStop(0.7,"rgb(32,52,88)");g.addColorStop(1,"rgb(52,74,108)");
  c.fillStyle=g;c.fillRect(x,y,w,h);const R=ag_rnd(x|0);for(let i=0;i<14;i++){c.fillStyle="rgba(220,230,255,"+(0.25+R()*0.5).toFixed(2)+")";c.beginPath();c.arc(x+R()*w,y+R()*h*0.5,0.9+R()*1.1,0,TAU);c.fill();}
  c.fillStyle="rgb(40,30,24)";c.fillRect(x,y+h*0.5-6,w,12);c.fillRect(x+w/2-4,y,8,h);for(const u of [0.25,0.75])c.fillRect(x,y+h*u-3,w,6);
  c.strokeStyle="rgb(52,40,30)";c.lineWidth=18;c.strokeRect(x-9,y-9,w+18,h+18);c.fillStyle="rgb(58,44,34)";c.fillRect(x-24,y+h+9,w+48,16);
  const rg=c.createLinearGradient(x,y,x+w,y+h);rg.addColorStop(0,"rgba(150,190,240,0.10)");rg.addColorStop(0.5,"rgba(150,190,240,0)");c.fillStyle=rg;c.fillRect(x,y,w,h);}
// an oil lamp: a brass foot, a glass chimney, the flame and its glow; glow paints its light on what is behind
function sl_lamp(c,x,y,k,glow){k=k||1;if(glow){const g=c.createRadialGradient(x,y-40*k,0,x,y-40*k,glow);g.addColorStop(0,"rgba(255,196,120,0.30)");g.addColorStop(0.4,"rgba(255,170,90,0.10)");g.addColorStop(1,"rgba(255,170,90,0)");
    c.save();c.globalCompositeOperation="lighter";c.fillStyle=g;c.fillRect(x-glow,y-40*k-glow,glow*2,glow*2);c.restore();}
  c.fillStyle="rgb(96,74,44)";c.beginPath();c.ellipse(x,y,22*k,7*k,0,0,TAU);c.fill();c.fillRect(x-6*k,y-34*k,12*k,34*k);
  c.fillStyle="rgb(120,94,54)";c.beginPath();c.ellipse(x,y-40*k,18*k,14*k,0,0,TAU);c.fill();
  c.fillStyle="rgba(255,236,200,0.22)";c.beginPath();c.moveTo(x-9*k,y-50*k);c.bezierCurveTo(x-16*k,y-70*k,x-8*k,y-92*k,x-7*k,y-112*k);c.lineTo(x+7*k,y-112*k);c.bezierCurveTo(x+8*k,y-92*k,x+16*k,y-70*k,x+9*k,y-50*k);c.closePath();c.fill();
  const f=c.createRadialGradient(x,y-64*k,0,x,y-64*k,14*k);f.addColorStop(0,"rgba(255,250,224,1)");f.addColorStop(0.5,"rgba(255,206,120,0.9)");f.addColorStop(1,"rgba(255,170,80,0)");c.fillStyle=f;c.beginPath();c.ellipse(x,y-64*k,7*k,13*k,0,0,TAU);c.fill();}
// the roll: an open ledger on the desk, its pages ruled with names (decoration), seen from the front at an angle; tick (0 to 1) draws
// the official's mark by the voter's name
function sl_roll(c,x,y,o){o=o||{};c.save();c.translate(x,y);
  c.fillStyle="rgb(58,36,26)";c.beginPath();c.moveTo(-14,8);c.lineTo(214,8);c.lineTo(226,-40);c.lineTo(-26,-40);c.closePath();c.fill();
  for(const [a,b] of [[-20,96],[104,220]]){const g=c.createLinearGradient(0,-44,0,4);g.addColorStop(0,"rgb(206,190,156)");g.addColorStop(1,"rgb(232,220,190)");c.fillStyle=g;
    c.beginPath();c.moveTo(a+4,2);c.lineTo(b-4,2);c.lineTo(b+(b>100?2:-2),-38);c.lineTo(a+(a<0?-2:2),-38);c.closePath();c.fill();}
  c.strokeStyle="rgba(70,50,34,0.55)";c.lineWidth=1.2;for(let i=0;i<6;i++){const yy=-32+i*6;for(const [a,b] of [[-14,92],[108,214]]){c.beginPath();c.moveTo(a+4+i*0.4,yy);c.lineTo(b-8-i*0.4,yy);c.stroke();}}
  c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(98,-40,4,46);
  if(o.tick>0){const u=clamp(o.tick,0,1);c.strokeStyle="rgba(40,28,20,0.95)";c.lineWidth=2.6;c.lineCap="round";c.lineJoin="round";c.beginPath();c.moveTo(186,-20);
    if(u<0.4)c.lineTo(186+5*u/0.4,-20+5*u/0.4);else{c.lineTo(191,-15);c.lineTo(191+12*(u-0.4)/0.6,-15-14*(u-0.4)/0.6);}c.stroke();}
  c.restore();}
// the box: dark polished wood on a stand, a slot in its lid, a lock plate; open shows its lid raised and papers inside
function sl_box(c,x,y,w,h,o){o=o||{};c.save();
  // the stand: two legs and a rail, down out of the picture
  c.fillStyle="rgb(40,26,20)";c.fillRect(x+14,y+h,14,H-y-h);c.fillRect(x+w-28,y+h,14,H-y-h);c.fillRect(x+6,y+h,w-12,12);c.fillRect(x+14,y+h+120,w-28,8);
  c.fillStyle="rgba(255,210,150,0.07)";c.fillRect(x+14,y+h,3,H-y-h);
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgb(70,44,30)");g.addColorStop(0.5,"rgb(104,68,44)");g.addColorStop(1,"rgb(60,38,26)");c.fillStyle=g;c.fillRect(x,y+18,w,h-18);
  c.fillStyle="rgb(118,80,52)";c.beginPath();c.moveTo(x-4,y+18);c.lineTo(x+w+4,y+18);c.lineTo(x+w-8,y);c.lineTo(x+8,y);c.closePath();c.fill();
  if(o.open){c.fillStyle="rgb(232,222,196)";for(let i=0;i<5;i++){c.save();c.translate(x+26+i*24,y+10-i%2*4);c.rotate(-0.2+i*0.12);c.fillRect(-14,-8,30,14);c.restore();}
    c.fillStyle="rgb(96,62,40)";c.beginPath();c.moveTo(x+8,y);c.lineTo(x+w-8,y);c.lineTo(x+w-14,y-64);c.lineTo(x+14,y-64);c.closePath();c.fill();}
  else{c.fillStyle="rgb(26,16,12)";c.fillRect(x+w/2-42,y+2,84,5);}
  c.fillStyle="rgb(150,124,84)";c.fillRect(x+w/2-11,y+38,22,28);c.fillStyle="rgb(40,28,20)";c.beginPath();c.arc(x+w/2,y+50,3.4,0,TAU);c.fill();c.fillRect(x+w/2-1.4,y+50,2.8,9);
  c.fillStyle="rgba(255,210,150,0.10)";c.fillRect(x,y+18,w,4);c.restore();}
// the inkstand and a pen on the desk
function sl_inkstand(c,x,y){c.fillStyle="rgb(50,34,26)";c.fillRect(x-40,y-12,80,12);c.fillStyle="rgb(24,22,26)";c.beginPath();c.arc(x-16,y-18,10,0,TAU);c.fill();c.beginPath();c.arc(x+16,y-18,10,0,TAU);c.fill();
  c.strokeStyle="rgb(220,214,196)";c.lineWidth=2.4;c.beginPath();c.moveTo(x+16,y-24);c.lineTo(x+40,y-70);c.stroke();}
// the official's tall desk: a top of dark green cloth, a panelled front down out of the picture
function sl_desk(c){const [x0,x1,yb,yf]=SL_R.desk;
  c.fillStyle="rgb(38,52,44)";c.beginPath();c.moveTo(x0,yb);c.lineTo(x1,yb);c.lineTo(x1+18,yf);c.lineTo(x0-18,yf);c.closePath();c.fill();
  c.fillStyle="rgba(255,220,170,0.10)";c.fillRect(x0-18,yf-2,x1-x0+36,2);
  const g=c.createLinearGradient(0,yf,0,H);g.addColorStop(0,"rgb(62,42,30)");g.addColorStop(1,"rgb(34,22,16)");c.fillStyle=g;c.fillRect(x0-18,yf,x1-x0+36,H-yf);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;for(let i=0;i<3;i++){const px=x0+12+i*(x1-x0-24)/3;c.strokeRect(px,yf+28,(x1-x0-24)/3-24,H-yf);}
  c.fillStyle="rgba(255,210,150,0.06)";for(let i=0;i<3;i++){const px=x0+12+i*(x1-x0-24)/3;c.fillRect(px,yf+28,(x1-x0-24)/3-24,2);}}
// the rail at the far side, where the public stands: a polished top over a panelled front, like the desk's, down out of the picture
function sl_rail(c){const [x0,y]=SL_R.rail;
  const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgb(56,38,28)");g.addColorStop(1,"rgb(30,20,16)");c.fillStyle=g;c.fillRect(x0,y,W-x0,H-y);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;for(let x=x0+24;x<W;x+=150)c.strokeRect(x,y+40,126,H-y);
  c.fillStyle="rgba(255,210,150,0.06)";for(let x=x0+24;x<W;x+=150)c.fillRect(x,y+40,126,2);
  const tg=c.createLinearGradient(0,y-6,0,y+22);tg.addColorStop(0,"rgb(124,88,60)");tg.addColorStop(0.35,"rgb(90,62,42)");tg.addColorStop(1,"rgb(46,32,24)");
  c.fillStyle=tg;c.fillRect(x0-10,y-6,W-x0+10,28);c.fillStyle="rgba(255,214,160,0.2)";c.fillRect(x0-10,y-6,W-x0+10,2);
  c.fillStyle="rgb(40,28,20)";c.fillRect(x0-10,y-6,10,H-y+6);}
// the room itself: wall, windows, floor, the rail, the desk and what is always on it
function sl_paintRoom(c,o){o=o||{};const R=ag_rnd(o.seed||1856),wy=SL_R.wall;
  sl_planks(c,0,W,0,wy,R,[46,34,26],10);
  const wg=c.createLinearGradient(0,0,0,wy);wg.addColorStop(0,"rgba(0,0,0,0.45)");wg.addColorStop(0.45,"rgba(0,0,0,0.1)");wg.addColorStop(1,"rgba(0,0,0,0.3)");c.fillStyle=wg;c.fillRect(0,0,W,wy);
  c.fillStyle="rgb(38,26,20)";c.fillRect(0,96,W,14);c.fillStyle="rgb(30,22,18)";c.fillRect(0,wy-60,W,60);
  sl_window(c,130,150,210,380);if(!o.booth)sl_window(c,1560,150,230,380);
  // the floor: boards running back towards the eyes' line, dark, the lamplight's gloss on them
  const fg=c.createLinearGradient(0,wy,0,H);fg.addColorStop(0,"rgb(40,28,22)");fg.addColorStop(1,"rgb(22,16,14)");c.fillStyle=fg;c.fillRect(0,wy,W,H-wy);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=2;const k=(H-SL_R.eye)/(wy-SL_R.eye);for(let i=-16;i<=16;i++){c.beginPath();c.moveTo(960+i*70,wy);c.lineTo(960+i*70*k,H);c.stroke();}
  sl_rail(c);if(o.after0)o.after0(c);
  sl_desk(c);sl_roll(c,...SL_R.roll);sl_inkstand(c,...SL_R.ink);sl_lamp(c,SL_R.lamp[0],SL_R.lamp[1],1.1,520);
  if(o.after)o.after(c);
  // the lamps' warm light on the room, and the dark at its edges
  c.save();c.globalCompositeOperation="lighter";const lg=c.createRadialGradient(700,520,0,700,520,900);lg.addColorStop(0,"rgba(255,170,100,0.13)");lg.addColorStop(1,"rgba(255,170,100,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore();
  const vg=c.createRadialGradient(960,560,500,960,560,1250);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,0.55)");c.fillStyle=vg;c.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- the booth, after the Act
   A timber booth at the right: two posts, a lintel, and a curtain between them; inside, a lamp and a writing slope. slBallot paints it
   with its curtain drawn back to the right (open), slBallotDrawn with it drawn across; everything else in the two is the same, so
   sl_booth draws it live, over the voter, from them: the voter (inside(ctx)), then the curtain from its edge (open 0, drawn across,
   to 1, drawn back) and the frame, as slBallotDrawn paints them. The curtain's folds stay where they are as it moves: only its
   edge travels, so the two places agree wherever both show it. */
const SL_B={x0:SL_R.booth,x1:W,post:40,top:96,open:1790};
const sl_edge=open=>lerp(SL_B.x0+SL_B.post,SL_B.open,ag_sine(clamp(open,0,1)));
function sl_curtain(c,x0,x1,y0,y1){const w=x1-x0;if(w<1)return;const n=Math.max(3,Math.round(w/34)),g=c.createLinearGradient(x0,0,x1,0);
  for(let i=0;i<=n;i++){const u=i/n;g.addColorStop(u,i%2?"rgb(52,44,32)":"rgb(74,62,44)");}c.fillStyle=g;c.fillRect(x0,y0,w,y1-y0);
  const sg=c.createLinearGradient(0,y0,0,y1);sg.addColorStop(0,"rgba(255,210,150,0.10)");sg.addColorStop(0.5,"rgba(0,0,0,0)");sg.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=sg;c.fillRect(x0,y0,w,y1-y0);
  c.fillStyle="rgb(96,78,52)";c.fillRect(x0,y0,w,6);}
function sl_boothFrame(c){const {x0,x1,post,top}=SL_B;c.fillStyle="rgb(30,20,16)";c.fillRect(x0,0,post,H);c.fillRect(x1-post,0,post,H);c.fillRect(x0,top-56,x1-x0,56);
  c.fillStyle="rgb(64,46,34)";c.fillRect(x0+post-6,top,6,H-top);c.fillStyle="rgba(255,220,170,0.08)";c.fillRect(x0,top-56,x1-x0,3);c.fillRect(x0,0,3,H);}
// the inside of the booth: dark boards, a lamp's glow, a writing slope with ink and pen
function sl_paintInside(c){const {x0,x1,post,top}=SL_B,R=ag_rnd(72);c.fillStyle="rgb(34,24,20)";c.fillRect(x0,top,x1-x0,H-top);sl_planks(c,x0+post,x1-post,top,H,R,[56,42,32],8);
  const g=c.createRadialGradient(1700,560,0,1700,560,460);g.addColorStop(0,"rgba(255,180,110,0.24)");g.addColorStop(1,"rgba(255,180,110,0)");c.fillStyle=g;c.fillRect(x0,top,x1-x0,H-top);
  c.fillStyle="rgb(70,50,36)";c.beginPath();c.moveTo(x0+post,846);c.lineTo(x1-post,836);c.lineTo(x1-post,880);c.lineTo(x0+post,890);c.closePath();c.fill();
  c.fillStyle="rgb(232,222,198)";c.save();c.translate(1640,850);c.rotate(-0.04);c.fillRect(-46,-10,92,18);c.restore();sl_lamp(c,1810,840,0.9,0);sl_inkstand(c,1560,858);}
// the booth as a room paints it, its curtain open from 0 (drawn across) to 1 (drawn back)
function sl_paintBooth(c,open){const {x0,x1,post,top}=SL_B,cl=sl_edge(open);
  c.save();c.beginPath();c.rect(x0,0,cl-x0,H);c.clip();sl_paintInside(c);c.restore();
  c.save();c.beginPath();c.rect(cl,0,x1-cl,H);c.clip();sl_curtain(c,x0+post,x1-post,top,H);c.restore();
  sl_boothFrame(c);}
// the booth drawn over the voter: inside(ctx) draws him, then the curtain (from its edge) and the frame, from slBallotDrawn
function sl_booth(ctx,open,inside){const {x0,x1,post,top}=SL_B,cl=sl_edge(open),src=dp_place0("slBallotDrawn");
  if(inside)inside(ctx);
  ctx.save();ctx.beginPath();ctx.rect(cl,top,x1-post-cl,H-top);ctx.rect(x0,0,post,H);ctx.rect(x1-post,0,post,H);ctx.rect(x0,top-56,x1-x0,56);ctx.clip();
  ctx.drawImage(src,0,0);ctx.restore();}
AG_PLACES.slRoom=c=>sl_paintRoom(c,{});
AG_PLACES.slBallot=c=>sl_paintRoom(c,{booth:true,after0:cc=>sl_paintBooth(cc,1)});
AG_PLACES.slBallotDrawn=c=>sl_paintRoom(c,{booth:true,after0:cc=>sl_paintBooth(cc,0)});
// the board at the count: "Totals" in chalk, and rows of tallies (decoration: no number on it is read)
function sl_board(c,x,y,w,h){c.fillStyle="rgb(58,42,30)";c.fillRect(x-14,y-14,w+28,h+28);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgb(30,36,34)");g.addColorStop(1,"rgb(24,30,28)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle="rgba(230,232,222,0.10)";c.fillRect(x+8,y+8,w-16,h-16);
  c.font="700 40px Manrope";c.fillStyle="rgba(232,230,218,0.85)";c.fillText("Totals",x+30,y+58);
  c.strokeStyle="rgba(232,230,218,0.78)";c.lineWidth=3;c.lineCap="round";const R=ag_rnd(1856);const rows=[17,11,23,8];
  rows.forEach((n,r)=>{const yy=y+104+r*50;c.fillStyle="rgba(232,230,218,0.6)";c.fillRect(x+30,yy-14,110,3);
    for(let i=0;i<n;i++){const g5=Math.floor(i/5),k=i%5,xx=x+170+g5*58+k*10;if(k<4){c.beginPath();c.moveTo(xx+R()*2,yy-18);c.lineTo(xx+R()*2,yy+10);c.stroke();}
      else{c.beginPath();c.moveTo(xx-44,yy+6);c.lineTo(xx+2,yy-16);c.stroke();}}});}
AG_PLACES.slCount=c=>sl_paintRoom(c,{booth:true,after0:cc=>{sl_paintBooth(cc,1);sl_board(cc,...SL_R.board);},after:cc=>{
  // the papers in piles on the desk, counted
  for(const [px,n] of [[382,7],[880,6]]){for(let i=0;i<n;i++){cc.fillStyle=i%2?"rgb(226,216,190)":"rgb(236,228,204)";cc.fillRect(px-36+(i%3)*2,SL_R.desk[2]+14-i*4,76,12);}}}});
AG_ROOMS.slBallot="slRoom";AG_ROOMS.slBallotDrawn="slRoom";AG_ROOMS.slCount="slRoom";
// the bare room, as every shot of it draws it under its people: nothing more
AG_BARE.slRoom=null;

/* ---------------------------------------------------------------- the paper, close: names printed (decoration), struck, folded
   sl_paper(ctx, cx, cy, w, {struck: [0..1 per name], fold: 0..1, a}): a printed paper, its middle at cx, cy; four names as printed
   lines (decoration: no name is read), three of them struck through in ink as the voter crosses them out; fold turns its lower half up */
function sl_paper(ctx,cx,cy,w,o){o=o||{};const h=w*1.3,f=clamp(o.fold||0,0,1),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(cx,cy);
  const ink=[44,32,24],lines=(c0)=>{c0.fillStyle=rgba(ink,0.85);c0.fillRect(-w*0.3,-h*0.38,w*0.6,h*0.035);
    for(let i=0;i<4;i++){const y=-h*0.18+i*h*0.15;c0.fillStyle=rgba(ink,0.7);c0.fillRect(-w*0.34,y,w*(0.46+0.08*((i*7)%3)),h*0.03);c0.fillStyle=rgba(ink,0.35);c0.fillRect(-w*0.34,y+h*0.045,w*0.22,h*0.02);
      const s=o.struck?clamp(o.struck[i]||0,0,1):0;if(s>0){c0.strokeStyle=rgba([30,22,16],0.95);c0.lineWidth=Math.max(2,w*0.012);c0.lineCap="round";c0.beginPath();c0.moveTo(-w*0.38,y+h*0.02);c0.lineTo(-w*0.38+w*0.7*ag_sine(s),y+h*0.01);c0.stroke();}}};
  ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;
  // the upper half, then the lower half, which turns up about the middle as the paper folds (its back, a little darker, once past half)
  ctx.fillStyle="rgb(232,222,196)";ctx.fillRect(-w/2,-h/2,w,h/2);ctx.shadowColor="transparent";ctx.save();ctx.beginPath();ctx.rect(-w/2,-h/2,w,h/2);ctx.clip();lines(ctx);ctx.restore();
  const k=Math.cos(Math.PI*ag_sine(f));ctx.save();ctx.scale(1,k);
  if(k>0){ctx.fillStyle="rgb(232,222,196)";ctx.fillRect(-w/2,0,w,h/2);ctx.save();ctx.beginPath();ctx.rect(-w/2,0,w,h/2);ctx.clip();lines(ctx);ctx.restore();}
  else{ctx.fillStyle="rgb(214,202,174)";ctx.fillRect(-w/2,0,w,h/2);}
  ctx.restore();if(f>0&&f<1){ctx.fillStyle=rgba([0,0,0],0.18*Math.sin(Math.PI*f));ctx.fillRect(-w/2,-2,w,4);}
  ctx.restore();}
// the paper in the hand, small: as given (folded 0) or folded (1), its middle at x, y in the hand's space; square and the same both
// ways round, so it doesn't change as it passes from the official's hand to the voter's, which is drawn mirrored
function sl_held(c,x,y,fold){c.save();c.translate(x,y);c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=8;c.shadowOffsetY=3;const w=70,h=fold>0.5?48:96;
  c.fillStyle="rgb(234,224,198)";c.fillRect(-w/2,-h/2,w,h);c.shadowColor="transparent";c.fillStyle="rgba(44,32,24,0.55)";
  if(fold<=0.5){c.fillRect(-w*0.3,-h/2+12,w*0.6,4);for(let i=0;i<4;i++){const lw=w-22-(i%2)*14;c.fillRect(-lw/2,-h/2+28+i*15,lw,3);}}else{c.fillStyle="rgba(0,0,0,0.15)";c.fillRect(-w/2,h/2-3,w,3);}c.restore();}

/* ---------------------------------------------------------------- Britain, 1872: the table, seen from above */
const SL_T={paper:[360,250,560,400],stub:[1060,260,520,380],packet:[1240,560,420,300]};
function sl_paintTable(c){const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,"rgb(50,34,24)");g.addColorStop(1,"rgb(30,20,16)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(1872);c.strokeStyle="rgba(0,0,0,0.25)";c.lineWidth=1.4;for(let i=0;i<70;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(W*0.3,y+R()*30-15,W*0.7,y+R()*30-15,W,y+R()*20-10);c.stroke();}
  const lg=c.createRadialGradient(900,480,0,900,480,1100);lg.addColorStop(0,"rgba(255,180,110,0.20)");lg.addColorStop(1,"rgba(255,180,110,0)");c.save();c.globalCompositeOperation="lighter";c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore();
  const vg=c.createRadialGradient(960,540,520,960,540,1200);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,0.6)");c.fillStyle=vg;c.fillRect(0,0,W,H);}
AG_PLACES.slTable=sl_paintTable;
// paper, as it lies on the table: cream, a soft shadow
function sl_sheet(ctx,x,y,w,h,rot){ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=24;ctx.shadowOffsetY=8;
  ctx.fillStyle="rgb(226,214,186)";ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();}
// the paper turned over, its number printed on the back; the counterfoils' book with the same number; the packet, tied and sealed
function sl_1872(ctx,t,o){o=o||{};const [px,py,pw,ph]=SL_T.paper,[sx,sy,sw,sh]=SL_T.stub,[kx,ky,kw,kh]=SL_T.packet,ink=[44,32,24];
  withA(ctx,o.paper==null?1:o.paper,()=>{sl_sheet(ctx,px,py,pw,ph,-0.03);ctx.save();ctx.translate(px+pw/2,py+ph/2);ctx.rotate(-0.03);
    dp_T(ctx,"No. 1209",0,16,{w:800,size:64,align:"center",col:ink});dp_T(ctx,"the back of a ballot paper",0,96,{w:600,size:28,align:"center",col:[92,74,56]});ctx.restore();});
  withA(ctx,o.stub==null?1:o.stub,()=>{sl_sheet(ctx,sx,sy,sw,sh,0.02);ctx.save();ctx.translate(sx,sy);ctx.fillStyle="rgba(92,70,50,0.6)";ctx.fillRect(0,0,24,sh);
    dp_T(ctx,"Counterfoil",56,70,{w:700,size:34,col:ink});dp_T(ctx,"No. 1209",56,140,{w:800,size:48,col:ink});
    ctx.strokeStyle="rgba(70,52,38,0.6)";ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(56,206+i*44);ctx.lineTo(sw-60-i*60,206+i*44);ctx.stroke();}
    ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(sw-10,10);ctx.lineTo(sw-10,sh-10);ctx.stroke();ctx.setLineDash([]);ctx.restore();});
  withA(ctx,o.packet==null?0:o.packet,()=>{ctx.save();ctx.translate(kx,ky);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=26;ctx.shadowOffsetY=10;
    ctx.fillStyle="rgb(170,140,100)";ctx.fillRect(0,0,kw,kh);ctx.shadowColor="transparent";ctx.fillStyle="rgba(255,240,210,0.12)";ctx.fillRect(0,0,kw,10);
    ctx.strokeStyle="rgb(214,200,170)";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(kw/2,0);ctx.lineTo(kw/2,kh);ctx.moveTo(0,kh/2);ctx.lineTo(kw,kh/2);ctx.stroke();
    const sp=clamp(o.seal==null?1:o.seal,0,1);if(sp>0){ctx.save();ctx.translate(kw/2,kh/2);ctx.scale(lerp(1.3,1,ag_eo(sp)),lerp(1.3,1,ag_eo(sp)));ctx.globalAlpha*=ag_eo(Math.min(1,sp*2));
      ctx.fillStyle="rgb(104,40,36)";ctx.beginPath();for(let i=0;i<=28;i++){const a=i/28*TAU,r=44+4*Math.sin(i*2.9);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();
      ctx.strokeStyle="rgba(200,140,120,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,27,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(0,0,14,0,TAU);ctx.stroke();ctx.restore();}
    ctx.restore();});}
