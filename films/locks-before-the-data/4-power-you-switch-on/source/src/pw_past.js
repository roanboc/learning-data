/* ===== Power you switch on: the 1870s =====
   The opening story's places, painted once each (AG_PLACES), in the module's night light: a town's main street with its bank and gas
   lamps (pwTown); a side street of wooden houses with warm windows (pwHouses), and Great Barrington's, its main street beyond
   (pwGB); inside a bank, its counter, a desk, a window and the round iron door of its vault (pwBank); and a lock maker's bench in
   Rochester under a hanging lamp (pwBench). Only the shapes of streets, houses, doors, dials and clocks: nothing is borrowed from a
   culture's arts or crafts. What moves is drawn live: the vault's door (its dial, the three slots that fill as it turns, its bolts and
   its handle, and a frosted cutaway onto the time lock inside), the time lock on the bench, lantern lights with coral rims (the
   robbers, never shown), and windows lit and put out. No real numbers are ever drawn on a dial or in its slots.
   Every top-level name starts with pw_ or PW_. */

/* ---------------------------------------------------------------- the past's colours, lit at night */
const PW_C={sky0:[6,17,22],sky1:[16,36,42],brick:[86,52,42],brickD:[46,30,26],stone:[74,78,74],stoneD:[44,48,46],wood:[38,46,52],woodD:[24,30,34],trim:[80,90,94],
  plank:[60,48,38],earth:[26,26,26],earthD:[12,15,17],warm:[255,206,140],win:[255,190,112],winD:[14,22,27],iron:[52,60,64],ironD:[26,31,34],ironHi:[132,146,148],
  brass:[214,170,86],brassD:[132,96,40],enamel:[232,226,208],wall:[30,40,40],wallD:[20,28,29],counter:[98,72,52],counterD:[58,42,32]};

// a warm glow, laid on in light
function pw_glow(c,x,y,r,col,a,sy){if(!(a>0))return;c.save();c.globalCompositeOperation="lighter";c.translate(x,y);if(sy)c.scale(1,sy);const g=c.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.45,rgba(col,a*0.38));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-r,-r,2*r,2*r);c.restore();}
function pw_sky(c,y1){const g=c.createLinearGradient(0,0,0,y1);g.addColorStop(0,rgba(PW_C.sky0,1));g.addColorStop(1,rgba(PW_C.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,y1);
  const R=ag_rnd(91);for(let i=0;i<60;i++){const x=R()*W,y=R()*y1*0.7,r=0.6+R()*1.4;c.fillStyle="rgba(200,236,236,"+(0.10+R()*0.25).toFixed(2)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
// a window: dark glass with a faint cool sheen, its frame and its cross
function pw_window(c,x,y,w,h,o){o=o||{};c.fillStyle=rgba(PW_C.winD,1);c.fillRect(x,y,w,h);const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(120,190,200,0.10)");g.addColorStop(1,"rgba(120,190,200,0)");
  c.fillStyle=g;c.fillRect(x,y,w,h);c.strokeStyle=rgba(o.frame||PW_C.trim,0.9);c.lineWidth=o.lw||4;c.strokeRect(x,y,w,h);c.lineWidth=(o.lw||4)*0.6;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h/2);c.lineTo(x+w,y+h/2);c.stroke();}
// a window lit from inside, laid over the painted one: warm glass and its glow on the wall around it; a from 0 to 1
function pw_lit(ctx,x,y,w,h,a,o){if(!(a>0))return;o=o||{};ctx.save();ctx.globalAlpha*=clamp(a,0,1);const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(PW_C.win,0.95));g.addColorStop(1,rgba(mix(PW_C.win,[200,110,60],0.35),0.95));
  ctx.fillStyle=g;ctx.fillRect(x+2,y+2,w-4,h-4);ctx.strokeStyle=rgba(mix(PW_C.trim,[40,30,20],0.5),1);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();ctx.restore();
  pw_glow(ctx,x+w/2,y+h/2,Math.max(w,h)*(o.r||1.6),PW_C.warm,0.22*clamp(a,0,1));}
// a gas lamp on a post, its foot at (x, y): the post, the lamp, its glow and its pool of light
function pw_gasLamp(c,x,y,o){o=o||{};const top=y-(o.h||250);c.fillStyle=rgba(PW_C.ironD,1);c.fillRect(x-5,top+30,10,y-top-30);c.fillRect(x-14,y-10,28,10);
  c.beginPath();c.moveTo(x-16,top+30);c.lineTo(x+16,top+30);c.lineTo(x+10,top+38);c.lineTo(x-10,top+38);c.closePath();c.fill();
  c.fillStyle=rgba(mix(PW_C.warm,[255,255,255],0.3),1);c.beginPath();c.moveTo(x-13,top);c.lineTo(x+13,top);c.lineTo(x+10,top+30);c.lineTo(x-10,top+30);c.closePath();c.fill();
  c.fillStyle=rgba(PW_C.ironD,1);c.beginPath();c.moveTo(x-18,top);c.lineTo(x,top-16);c.lineTo(x+18,top);c.closePath();c.fill();
  pw_glow(c,x,top+15,o.r||260,PW_C.warm,o.a||0.30);pw_glow(c,x,y+6,(o.r||260)*0.9,PW_C.warm,(o.a||0.30)*0.55,0.22);}
// clapboard: the lines of a wooden wall, inside its outline
function pw_boards(c,x,y,w,h,col){c.fillStyle=rgba(col,1);c.fillRect(x,y,w,h);c.strokeStyle=rgba(mix(col,[0,0,0],0.35),0.8);c.lineWidth=1.4;
  for(let yy=y+14;yy<y+h;yy+=14){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();}
  c.strokeStyle=rgba(mix(col,[255,255,255],0.12),0.35);for(let yy=y+15.5;yy<y+h;yy+=14){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();}}
// a brick front: its wall, its cornice and its windows (a few lit from inside, as chance has it)
function pw_front(c,x,w,top,base,R,o){o=o||{};const col=o.col||PW_C.brick,g=c.createLinearGradient(0,top,0,base);g.addColorStop(0,rgba(mix(col,[0,0,0],0.4),1));g.addColorStop(1,rgba(col,1));
  c.fillStyle=g;c.fillRect(x,top,w,base-top);c.fillStyle=rgba(mix(col,[255,240,220],0.18),1);c.fillRect(x-4,top,w+8,16);c.fillStyle=rgba(mix(col,[0,0,0],0.5),1);c.fillRect(x-4,top+16,w+8,6);
  c.strokeStyle="rgba(0,0,0,0.25)";c.lineWidth=1;for(let yy=top+30;yy<base;yy+=9){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();}
  const n=Math.max(2,Math.floor(w/90)),ww=34,wh=60,gap=w/n;for(let row=top+52;row+wh<base-110;row+=104)for(let i=0;i<n;i++){const wx=x+gap*(i+0.5)-ww/2;pw_window(c,wx,row,ww,wh,{lw:3});
    if(R()<(o.lit||0.16)){c.fillStyle=rgba(PW_C.win,0.8);c.fillRect(wx+3,row+3,ww-6,wh-6);pw_glow(c,wx+ww/2,row+wh/2,70,PW_C.warm,0.16);}}
  // the shop front: a wide dark window and a door
  pw_window(c,x+16,base-100,w*0.55,74,{lw:3});c.fillStyle=rgba(mix(col,[0,0,0],0.65),1);c.fillRect(x+w*0.7,base-110,w*0.18,110);}
// a bank's stone front: a pediment, pilasters, three tall arched windows and its door with a fanlight
function pw_bankFront(c,x,w,top,base,o){o=o||{};const k=o.k||1,g=c.createLinearGradient(0,top,0,base);g.addColorStop(0,rgba(PW_C.stoneD,1));g.addColorStop(1,rgba(PW_C.stone,1));
  c.fillStyle=g;c.fillRect(x,top+60*k,w,base-top-60*k);c.fillStyle=rgba(mix(PW_C.stone,[255,240,220],0.12),1);c.beginPath();c.moveTo(x-10,top+64*k);c.lineTo(x+w/2,top);c.lineTo(x+w+10,top+64*k);c.closePath();c.fill();
  c.fillStyle=rgba(PW_C.stoneD,1);c.beginPath();c.moveTo(x+30*k,top+56*k);c.lineTo(x+w/2,top+18*k);c.lineTo(x+w-30*k,top+56*k);c.closePath();c.fill();
  c.fillStyle=rgba(mix(PW_C.stone,[255,240,220],0.16),1);c.fillRect(x-8,top+60*k,w+16,12*k);
  for(const px of [x+10*k,x+w-34*k])c.fillRect(px,top+72*k,24*k,base-top-72*k);
  const aw=70*k,ah=200*k,ay=top+120*k;for(let i=0;i<3;i++){const ax=x+w*(0.24+0.26*i)-aw/2;c.fillStyle=rgba(PW_C.winD,1);c.beginPath();c.moveTo(ax,ay+ah);c.lineTo(ax,ay+aw/2);c.arc(ax+aw/2,ay+aw/2,aw/2,Math.PI,0);c.lineTo(ax+aw,ay+ah);c.closePath();c.fill();
    c.fillStyle=rgba(PW_C.warm,0.10);c.fill();c.strokeStyle=rgba(PW_C.trim,0.85);c.lineWidth=3*k;c.stroke();c.beginPath();c.moveTo(ax+aw/2,ay+6);c.lineTo(ax+aw/2,ay+ah);c.stroke();}
  const dx=x+w/2-34*k,dy=base-130*k;c.fillStyle=rgba(mix(PW_C.stoneD,[0,0,0],0.4),1);c.fillRect(dx,dy,68*k,130*k);c.beginPath();c.arc(dx+34*k,dy,34*k,Math.PI,0);c.fill();
  c.strokeStyle=rgba(PW_C.trim,0.7);c.lineWidth=2*k;c.beginPath();c.arc(dx+34*k,dy,26*k,Math.PI,0);c.stroke();}

/* ---------------------------------------------------------------- the places */
// a town's main street at night: brick fronts and the bank across the street, a boardwalk, gas lamps, the street
const PW_TOWN={bank:[1040,440,200,650],win:[1104,1218,1332]};
AG_PLACES.pwTown=c=>{const R=ag_rnd(1870);pw_sky(c,660);
  for(const [x,w,top] of [[-20,280,300],[262,226,342],[490,300,262],[792,236,322],[1500,232,296],[1734,220,334]])pw_front(c,x,w,top,650,R);
  pw_bankFront(c,...PW_TOWN.bank);
  // the boardwalk and the street
  c.fillStyle=rgba(PW_C.plank,1);c.fillRect(0,650,W,40);c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=1.2;for(let x=0;x<W;x+=46){c.beginPath();c.moveTo(x,650);c.lineTo(x,690);c.stroke();}
  c.fillStyle=rgba(mix(PW_C.plank,[255,230,200],0.2),1);c.fillRect(0,688,W,4);
  let g=c.createLinearGradient(0,692,0,H);g.addColorStop(0,rgba(PW_C.earth,1));g.addColorStop(1,rgba(PW_C.earthD,1));c.fillStyle=g;c.fillRect(0,692,W,H-692);
  c.strokeStyle="rgba(150,170,170,0.05)";c.lineWidth=3;for(const y of [790,812,900,930]){c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y-6,1300,y+6,W,y-2);c.stroke();}
  for(const x of [330,960,1640])pw_gasLamp(c,x,690,{h:250,r:270,a:0.30});};
// a side street of wooden houses: gabled, with a porch, two windows up and two down, a door, a picket fence along the street
const PW_HOUSES=[{x:50,w:400,top:390},{x:560,w:440,top:380,main:true},{x:1090,w:400,top:396},{x:1560,w:380,top:392}];
const PW_GB_HOUSES=[{x:40,w:410,top:392},{x:540,w:440,top:380,main:true}];
// where each house's windows are (painted dark; pw_lit lights them): [x, y, w, h] for the upper two, then the lower two
function pw_houseWins(h){const up=h.top+70,low=h.top+232,ww=64,wh=86;return[[h.x+h.w*0.27-ww/2,up,ww,wh],[h.x+h.w*0.73-ww/2,up,ww,wh],[h.x+h.w*0.2-ww/2,low,ww,wh],[h.x+h.w*0.8-ww/2,low,ww,wh]];}
function pw_houseDoor(h){return[h.x+h.w/2-34,h.top+250,68,150];}
function pw_house(c,h){const base=h.top+400,col=h.main?mix(PW_C.wood,[255,255,255],0.04):PW_C.wood;
  // the gable roof, its eaves over the walls
  c.fillStyle=rgba(mix(PW_C.woodD,[0,0,0],0.3),1);c.beginPath();c.moveTo(h.x-26,h.top+10);c.lineTo(h.x+h.w/2,h.top-150);c.lineTo(h.x+h.w+26,h.top+10);c.closePath();c.fill();
  pw_boards(c,h.x+30,h.top-118,h.w-60,128,col);c.save();c.beginPath();c.moveTo(h.x-26,h.top+10);c.lineTo(h.x+h.w/2,h.top-150);c.lineTo(h.x+h.w+26,h.top+10);c.lineTo(h.x+h.w+26,h.top+14);c.lineTo(h.x+h.w/2,h.top-138);c.lineTo(h.x-26,h.top+14);c.closePath();
  c.fillStyle=rgba(PW_C.trim,0.8);c.fill();c.restore();
  c.save();c.beginPath();c.moveTo(h.x+h.w/2,h.top-120);c.lineTo(h.x+h.w-16,h.top+4);c.lineTo(h.x+16,h.top+4);c.closePath();c.clip();pw_boards(c,h.x,h.top-130,h.w,140,col);c.restore();
  pw_boards(c,h.x,h.top,h.w,base-h.top,col);c.fillStyle=rgba(PW_C.trim,0.8);c.fillRect(h.x-4,h.top,8,base-h.top);c.fillRect(h.x+h.w-4,h.top,8,base-h.top);
  for(const [x,y,w,hh] of pw_houseWins(h))pw_window(c,x,y,w,hh);
  // the porch: its roof, two posts, its step
  c.fillStyle=rgba(mix(PW_C.woodD,[0,0,0],0.2),1);c.fillRect(h.x+h.w*0.32,h.top+214,h.w*0.36,14);c.fillStyle=rgba(PW_C.trim,0.75);c.fillRect(h.x+h.w*0.32,h.top+212,h.w*0.36,4);
  for(const px of [h.x+h.w*0.33,h.x+h.w*0.67-8])c.fillRect(px,h.top+228,8,base-h.top-228);
  const [dx,dy,dw,dh]=pw_houseDoor(h);c.fillStyle=rgba(mix(PW_C.woodD,[0,0,0],0.35),1);c.fillRect(dx,dy,dw,dh);c.strokeStyle=rgba(PW_C.trim,0.7);c.lineWidth=3;c.strokeRect(dx,dy,dw,dh);
  c.fillStyle=rgba(PW_C.woodD,1);c.fillRect(h.x+h.w*0.3,base-6,h.w*0.4,10);}
function pw_fence(c,y0,y1){c.fillStyle=rgba(mix(PW_C.trim,[0,0,0],0.35),1);c.fillRect(0,y0+16,W,8);c.fillRect(0,y1-26,W,8);
  for(let x=6;x<W;x+=28){c.beginPath();c.moveTo(x,y1);c.lineTo(x,y0+8);c.lineTo(x+6,y0);c.lineTo(x+12,y0+8);c.lineTo(x+12,y1);c.closePath();c.fill();}}
function pw_street(c,y){const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,rgba(PW_C.earth,1));g.addColorStop(1,rgba(PW_C.earthD,1));c.fillStyle=g;c.fillRect(0,y,W,H-y);
  c.strokeStyle="rgba(150,170,170,0.05)";c.lineWidth=3;for(const yy of [y+70,y+96,y+170]){c.beginPath();c.moveTo(0,yy);c.bezierCurveTo(600,yy-5,1300,yy+5,W,yy-2);c.stroke();}}
AG_PLACES.pwHouses=c=>{pw_sky(c,800);for(const h of PW_HOUSES)pw_house(c,h);
  c.fillStyle=rgba(mix(PW_C.earth,[40,50,40],0.3),1);c.fillRect(0,790,W,20);pw_street(c,850);pw_fence(c,782,856);
  for(const x of [500,1530])pw_gasLamp(c,x,880,{h:300,r:240,a:0.22});};
// Great Barrington: two houses on a side street, and the main street beyond, its brick block and its bank, up the street on the right
const PW_GB={bank:[1520,250,330,700]};
AG_PLACES.pwGB=c=>{const R=ag_rnd(1875);pw_sky(c,800);
  for(const [x,w,top] of [[1040,230,380],[1276,236,360],[1780,200,372]])pw_front(c,x,w,top,700,R,{lit:0.1});pw_bankFront(c,...PW_GB.bank,{k:0.8});
  c.fillStyle=rgba(PW_C.plank,1);c.fillRect(1020,700,W-1020,26);
  for(const h of PW_GB_HOUSES)pw_house(c,h);c.fillStyle=rgba(mix(PW_C.earth,[40,50,40],0.3),1);c.fillRect(0,790,1020,20);
  pw_street(c,850);c.fillStyle=rgba(PW_C.earth,1);c.beginPath();c.moveTo(1000,726);c.lineTo(W,726);c.lineTo(W,850);c.lineTo(980,850);c.closePath();c.fill();
  c.save();c.beginPath();c.rect(0,0,1010,H);c.clip();pw_fence(c,782,856);c.restore();
  pw_gasLamp(c,1460,724,{h:220,r:220,a:0.26});pw_gasLamp(c,500,880,{h:300,r:240,a:0.2});};
// inside a bank: its wall, a window onto the night, a gas lamp, a desk, the frame of its vault's round door, and the counter
const PW_VAULT={x:1240,y:440,r:270},PW_DESK=[150,688,470,24],PW_BANKWIN=[120,130,240,420];
AG_PLACES.pwBank=c=>{let g=c.createLinearGradient(0,0,0,800);g.addColorStop(0,rgba(PW_C.wallD,1));g.addColorStop(1,rgba(PW_C.wall,1));c.fillStyle=g;c.fillRect(0,0,W,800);
  c.fillStyle=rgba(mix(PW_C.counterD,[0,0,0],0.3),1);c.fillRect(0,600,W,200);c.fillStyle=rgba(PW_C.counter,0.6);c.fillRect(0,596,W,8);
  c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=2;for(let x=40;x<W;x+=220)c.strokeRect(x,626,170,150);
  // the window, arched, onto the night
  const [wx,wy,ww,wh]=PW_BANKWIN;c.fillStyle=rgba([10,22,30],1);c.beginPath();c.moveTo(wx,wy+wh);c.lineTo(wx,wy+ww/2);c.arc(wx+ww/2,wy+ww/2,ww/2,Math.PI,0);c.lineTo(wx+ww,wy+wh);c.closePath();c.fill();
  const R=ag_rnd(5);for(let i=0;i<14;i++){c.fillStyle="rgba(200,236,236,"+(0.15+R()*0.3).toFixed(2)+")";c.beginPath();c.arc(wx+R()*ww,wy+30+R()*200,0.6+R()*1.2,0,TAU);c.fill();}
  c.strokeStyle=rgba(PW_C.trim,0.9);c.lineWidth=6;c.stroke();c.lineWidth=3;c.beginPath();c.moveTo(wx+ww/2,wy+6);c.lineTo(wx+ww/2,wy+wh);c.moveTo(wx,wy+wh*0.55);c.lineTo(wx+ww,wy+wh*0.55);c.stroke();
  // the gas lamp on the wall, and its light
  c.fillStyle=rgba(PW_C.brassD,1);c.fillRect(600,262,40,8);c.fillRect(616,236,8,30);c.fillStyle=rgba(mix(PW_C.warm,[255,255,255],0.3),1);c.beginPath();c.ellipse(620,226,16,22,0,0,TAU);c.fill();
  pw_glow(c,620,240,420,PW_C.warm,0.24);
  // the vault's frame: a steel surround, and the dark round opening the door fits
  const V=PW_VAULT;c.fillStyle=rgba(mix(PW_C.iron,[0,0,0],0.25),1);rr(c,V.x-V.r-70,V.y-V.r-70,2*V.r+140,2*V.r+140,26);c.fill();
  c.strokeStyle=rgba(PW_C.ironHi,0.35);c.lineWidth=3;rr(c,V.x-V.r-62,V.y-V.r-62,2*V.r+124,2*V.r+124,22);c.stroke();
  c.fillStyle="rgb(6,9,10)";c.beginPath();c.arc(V.x,V.y,V.r+30,0,TAU);c.fill();
  for(let i=0;i<16;i++){const a=i/16*TAU;c.fillStyle=rgba(PW_C.ironHi,0.5);c.beginPath();c.arc(V.x+Math.cos(a)*(V.r+50),V.y+Math.sin(a)*(V.r+50),5,0,TAU);c.fill();}
  pw_glow(c,V.x-120,V.y-160,360,PW_C.warm,0.08);
  // the desk, by the window: its top seen from a little above, lit by the lamp; its front edge; a drawer each side with a brass pull
  const [dx,dy,dw,dh]=PW_DESK;g=c.createLinearGradient(0,dy-36,0,dy);g.addColorStop(0,rgba(mix(PW_C.counter,[0,0,0],0.25),1));g.addColorStop(1,rgba(mix(PW_C.counter,[255,226,190],0.12),1));
  c.fillStyle=g;c.beginPath();c.moveTo(dx+22,dy-36);c.lineTo(dx+dw-22,dy-36);c.lineTo(dx+dw+8,dy);c.lineTo(dx-8,dy);c.closePath();c.fill();
  c.strokeStyle="rgba(0,0,0,0.18)";c.lineWidth=1.2;for(const k of [0.3,0.62]){c.beginPath();c.moveTo(dx+22-30*k,dy-36+36*k);c.lineTo(dx+dw-22+30*k,dy-36+36*k);c.stroke();}
  g=c.createLinearGradient(0,dy,0,dy+dh);g.addColorStop(0,rgba(mix(PW_C.counter,[255,226,190],0.3),1));g.addColorStop(1,rgba(PW_C.counter,1));c.fillStyle=g;c.fillRect(dx-8,dy,dw+16,dh);
  c.fillStyle="rgba(0,0,0,0.4)";c.fillRect(dx-8,dy+dh,dw+16,4);
  const by=dy+dh+4,bh=792-by;c.fillStyle=rgba(PW_C.counterD,1);c.fillRect(dx,by,dw*0.34,bh);c.fillRect(dx+dw*0.66,by,dw*0.34,bh);
  c.fillStyle=rgba(mix(PW_C.counterD,[0,0,0],0.5),1);c.fillRect(dx+dw*0.34,by,dw*0.32,bh);
  for(const x0 of [dx,dx+dw*0.66]){c.strokeStyle="rgba(0,0,0,0.45)";c.lineWidth=2;c.strokeRect(x0+12,by+10,dw*0.34-24,bh-22);
    c.fillStyle=rgba(PW_C.brass,0.95);rr(c,x0+dw*0.17-18,by+bh/2-9,36,8,4);c.fill();c.fillStyle=rgba(mix(PW_C.brass,[255,255,255],0.4),0.8);c.fillRect(x0+dw*0.17-14,by+bh/2-9,28,2);}
  // the counter, across the front
  c.fillStyle=rgba(mix(PW_C.counter,[255,236,210],0.18),1);c.fillRect(0,792,W,24);c.fillStyle=rgba(PW_C.counterD,1);c.fillRect(0,816,W,H-816);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;for(let x=30;x<W;x+=260)c.strokeRect(x,846,200,200);
  c.strokeStyle=rgba(PW_C.counter,0.5);c.lineWidth=2;for(let x=30;x<W;x+=260)c.strokeRect(x+14,860,172,172);};
// a lock maker's bench in Rochester: a plank wall, a window onto the night, a shelf, a hanging lamp, the bench and a vice
AG_PLACES.pwBench=c=>{let g=c.createLinearGradient(0,0,0,700);g.addColorStop(0,rgba([26,24,22],1));g.addColorStop(1,rgba([44,36,30],1));c.fillStyle=g;c.fillRect(0,0,W,700);
  c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=2;for(let x=0;x<W;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,700);c.stroke();}
  c.fillStyle=rgba([10,22,30],1);c.fillRect(110,130,250,320);c.strokeStyle=rgba(PW_C.trim,0.8);c.lineWidth=6;c.strokeRect(110,130,250,320);c.lineWidth=3;
  for(const x of [193,277]){c.beginPath();c.moveTo(x,130);c.lineTo(x,450);c.stroke();}c.beginPath();c.moveTo(110,290);c.lineTo(360,290);c.stroke();
  c.fillStyle=rgba(PW_C.counterD,1);c.fillRect(1320,300,520,14);const R=ag_rnd(1873);for(let i=0;i<7;i++){const w=40+R()*40,h=40+R()*50;c.fillStyle=rgba(mix([90,70,54],[0,0,0],R()*0.4),1);c.fillRect(1340+i*70,300-h,w*0.9,h);}
  // the lamp hangs over the bench, and lights it
  c.strokeStyle=rgba(PW_C.ironD,1);c.lineWidth=3;c.beginPath();c.moveTo(1000,0);c.lineTo(1000,70);c.stroke();c.fillStyle=rgba([44,52,50],1);c.beginPath();c.moveTo(948,118);c.lineTo(1052,118);c.lineTo(1024,72);c.lineTo(976,72);c.closePath();c.fill();
  c.fillStyle=rgba(mix(PW_C.warm,[255,255,255],0.4),1);c.beginPath();c.ellipse(1000,120,30,8,0,0,TAU);c.fill();pw_glow(c,1000,140,300,PW_C.warm,0.30);pw_glow(c,1000,700,560,PW_C.warm,0.26,0.32);
  g=c.createLinearGradient(0,690,0,722);g.addColorStop(0,rgba(mix(PW_C.counter,[255,226,190],0.3),1));g.addColorStop(1,rgba(PW_C.counter,1));c.fillStyle=g;c.fillRect(0,690,W,32);
  g=c.createLinearGradient(0,722,0,H);g.addColorStop(0,rgba(PW_C.counterD,1));g.addColorStop(1,rgba(mix(PW_C.counterD,[0,0,0],0.5),1));c.fillStyle=g;c.fillRect(0,722,W,H-722);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;c.strokeRect(300,780,520,120);c.strokeRect(1180,780,520,120);
  // a vice at the left end of the bench
  c.fillStyle=rgba(PW_C.iron,1);c.fillRect(300,620,150,70);c.fillRect(340,580,70,44);c.fillStyle=rgba(PW_C.ironHi,0.5);c.fillRect(300,620,150,6);c.fillRect(250,640,60,10);
  pw_glow(c,1000,700,900,PW_C.warm,0.06,0.5);};

/* ---------------------------------------------------------------- the vault's door, live
   pw_door(ctx, x, y, r, o): the round iron door, its face painted once (kept); live, its bolts across the gap to the frame (o.bolts 1
   shut, 0 drawn back; o.held a coral glow on bolts that won't move), its dial (o.dial, radians; ticks and no numbers), the three
   slots above it that fill as it turns (o.slots, 0 to 3), its spoked handle (o.handle), and a frosted cutaway onto the time lock
   inside (o.cut 0 to 1; o.hours, the hour its clocks show, 0 to 12). */
function pw_doorFace(){return ag_kept("pw:door",600,600,c=>{const x=300,y=300,r=270;
  c.save();c.shadowColor="rgba(0,0,0,0.7)";c.shadowBlur=26;c.fillStyle=rgba(PW_C.ironD,1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();
  let g=c.createRadialGradient(x-80,y-100,20,x,y,r);g.addColorStop(0,rgba([92,104,108],1));g.addColorStop(0.6,rgba(PW_C.iron,1));g.addColorStop(1,rgba(PW_C.ironD,1));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  for(const [k,a] of [[0.93,0.35],[0.66,0.25]]){c.strokeStyle=rgba(PW_C.ironHi,a);c.lineWidth=3;c.beginPath();c.arc(x,y,r*k,0,TAU);c.stroke();c.strokeStyle="rgba(0,0,0,0.4)";c.lineWidth=2;c.beginPath();c.arc(x,y,r*k+3,0,TAU);c.stroke();}
  for(let i=0;i<28;i++){const a=i/28*TAU;c.fillStyle=rgba(PW_C.ironHi,0.55);c.beginPath();c.arc(x+Math.cos(a)*r*0.965,y+Math.sin(a)*r*0.965,4.5,0,TAU);c.fill();}
  // the hinge, on the left
  c.fillStyle=rgba(mix(PW_C.iron,[0,0,0],0.2),1);rr(c,x-r-14,y-70,54,140,10);c.fill();c.fillStyle=rgba(PW_C.ironHi,0.4);c.fillRect(x-r-6,y-58,38,6);c.fillRect(x-r-6,y+52,38,6);
  // the dial's plate, the slots' strip and the handle's boss
  c.fillStyle=rgba(mix(PW_C.iron,[0,0,0],0.45),1);c.beginPath();c.arc(x,y-r*0.1,r*0.25,0,TAU);c.fill();rr(c,x-r*0.27,y-r*0.56,r*0.54,r*0.2,10);c.fill();
  c.beginPath();c.arc(x,y+r*0.42,r*0.07,0,TAU);c.fill();});}
const PW_SLOTS=[-1,0,1];
function pw_door(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=r/270;ctx.save();ctx.globalAlpha*=a;
  // the bolts, across the gap between the door and its frame: eight, drawn back as it opens
  const b=clamp(o.bolts==null?1:o.bolts,0,1),held=clamp(o.held||0,0,1);
  for(let i=0;i<8;i++){const an=(i+0.5)/8*TAU,c0=Math.cos(an),s0=Math.sin(an),r0=r-26*k,r1=r+30*k*b;if(b<=0.02)continue;ctx.save();ctx.translate(x,y);ctx.rotate(an);
    if(held>0){ctx.shadowColor=rgba(DP.F.coral,0.9*held);ctx.shadowBlur=18*k;}ctx.fillStyle=rgba(mix(PW_C.ironHi,DP.F.coral,held*0.85),1);rr(ctx,r0,-11*k,r1-r0,22*k,6*k);ctx.fill();ctx.restore();}
  ctx.drawImage(pw_doorFace(),x-300*k,y-300*k,600*k,600*k);
  // the three slots: dark until the dial turns past each number, then lit; no number is ever drawn
  const sl=o.slots||0;PW_SLOTS.forEach((s,i)=>{const sx=x+s*r*0.16-r*0.055,sy=y-r*0.52,u=clamp(sl-i,0,1);ctx.fillStyle="rgb(8,12,14)";rr(ctx,sx,sy,r*0.11,r*0.12,4*k);ctx.fill();
    if(u>0){ctx.save();ctx.globalAlpha*=u;ctx.fillStyle=rgba(PW_C.warm,0.85);rr(ctx,sx+3*k,sy+3*k,r*0.11-6*k,r*0.12-6*k,3*k);ctx.fill();ctx.restore();pw_glow(ctx,sx+r*0.055,sy+r*0.06,r*0.12,PW_C.warm,0.35*u);}});
  // the dial: a knurled ring with its ticks, turning under a fixed brass mark
  ctx.save();ctx.translate(x,y-r*0.1);ctx.rotate(o.dial||0);const dr=r*0.2;let g=ctx.createRadialGradient(-dr*0.3,-dr*0.3,2,0,0,dr);g.addColorStop(0,rgba([150,160,160],1));g.addColorStop(1,rgba([60,68,70],1));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,dr,0,TAU);ctx.fill();ctx.strokeStyle="rgba(0,0,0,0.5)";ctx.lineWidth=2*k;for(let i=0;i<50;i++){const an=i/50*TAU,l=i%5?0.1:0.2;ctx.beginPath();ctx.moveTo(Math.cos(an)*dr*(0.93-l),Math.sin(an)*dr*(0.93-l));ctx.lineTo(Math.cos(an)*dr*0.93,Math.sin(an)*dr*0.93);ctx.stroke();}
  ctx.fillStyle=rgba([40,46,48],1);ctx.beginPath();ctx.arc(0,0,dr*0.45,0,TAU);ctx.fill();ctx.fillStyle=rgba([120,130,132],1);ctx.beginPath();ctx.arc(-dr*0.08,-dr*0.08,dr*0.3,0,TAU);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(PW_C.brass,1);ctx.beginPath();ctx.moveTo(x,y-r*0.1-r*0.205);ctx.lineTo(x-8*k,y-r*0.1-r*0.25);ctx.lineTo(x+8*k,y-r*0.1-r*0.25);ctx.closePath();ctx.fill();
  // the handle: three spokes on a boss
  ctx.save();ctx.translate(x,y+r*0.42);ctx.rotate(o.handle||0);ctx.strokeStyle=rgba([150,160,160],1);ctx.lineCap="round";ctx.lineWidth=12*k;for(let i=0;i<3;i++){const an=i/3*TAU-Math.PI/2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*r*0.2,Math.sin(an)*r*0.2);ctx.stroke();
    ctx.fillStyle=rgba([170,178,178],1);ctx.beginPath();ctx.arc(Math.cos(an)*r*0.2,Math.sin(an)*r*0.2,10*k,0,TAU);ctx.fill();}ctx.fillStyle=rgba([110,120,122],1);ctx.beginPath();ctx.arc(0,0,r*0.06,0,TAU);ctx.fill();ctx.restore();
  // the cutaway onto the time lock inside: frosted glass over the door's lower left, and through it the brass case and its two clocks
  const cu=clamp(o.cut||0,0,1);if(cu>0){const cx=x-r*0.78,cy=y+r*0.08,cw=r*0.62,ch=r*0.46;ctx.save();ctx.globalAlpha*=cu;
    ctx.fillStyle="rgba(6,14,18,0.9)";rr(ctx,cx,cy,cw,ch,12*k);ctx.fill();pw_timeLock(ctx,cx+cw*0.08,cy+ch*0.14,cw*0.84,ch*0.72,{hours:o.hours==null?9:o.hours,small:true});
    ctx.fillStyle="rgba(170,230,235,0.08)";rr(ctx,cx,cy,cw,ch,12*k);ctx.fill();ctx.strokeStyle=rgba(mix(DP.ice,[255,255,255],0.2),0.9);ctx.lineWidth=2.4;rr(ctx,cx,cy,cw,ch,12*k);ctx.stroke();ctx.restore();}
  ctx.restore();}
/* pw_timeLock(ctx, x, y, w, h, o): Sargent's lock with a clock in it: a brass case, two clock movements side by side behind round
   faces (ticks, no numerals), their hands set to o.hours (0 to 12), and o.lit (0 to 1) the warm light that wakes them */
function pw_timeLock(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(mix(PW_C.brass,[255,240,200],0.25),1));g.addColorStop(1,rgba(PW_C.brassD,1));ctx.fillStyle=g;rr(ctx,x,y,w,h,Math.min(w,h)*0.08);ctx.fill();
  ctx.strokeStyle=rgba(mix(PW_C.brassD,[0,0,0],0.4),1);ctx.lineWidth=Math.max(1.5,w*0.008);ctx.stroke();
  const fr=Math.min(w*0.2,h*0.36);for(let i=0;i<2;i++){const fx=x+w*(0.28+0.44*i),fy=y+h*0.48;ctx.fillStyle=rgba(mix(PW_C.brassD,[0,0,0],0.3),1);ctx.beginPath();ctx.arc(fx,fy,fr*1.12,0,TAU);ctx.fill();
    g=ctx.createRadialGradient(fx-fr*0.3,fy-fr*0.3,1,fx,fy,fr);g.addColorStop(0,rgba([246,242,228],1));g.addColorStop(1,rgba(PW_C.enamel,1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(fx,fy,fr,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(40,30,20,0.85)";ctx.lineWidth=Math.max(1,fr*0.04);for(let t=0;t<12;t++){const an=t/12*TAU;ctx.beginPath();ctx.moveTo(fx+Math.cos(an)*fr*0.78,fy+Math.sin(an)*fr*0.78);ctx.lineTo(fx+Math.cos(an)*fr*0.92,fy+Math.sin(an)*fr*0.92);ctx.stroke();}
    const hr=(o.hours==null?9:o.hours)/12*TAU-Math.PI/2;ctx.lineCap="round";ctx.lineWidth=Math.max(1.6,fr*0.09);ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+Math.cos(hr)*fr*0.55,fy+Math.sin(hr)*fr*0.55);ctx.stroke();
    const mn=(o.mins||0)/60*TAU-Math.PI/2;ctx.lineWidth=Math.max(1.2,fr*0.06);ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+Math.cos(mn)*fr*0.78,fy+Math.sin(mn)*fr*0.78);ctx.stroke();
    ctx.fillStyle="rgba(40,30,20,0.9)";ctx.beginPath();ctx.arc(fx,fy,fr*0.07,0,TAU);ctx.fill();}
  for(const [sx,sy] of [[0.06,0.1],[0.94,0.1],[0.06,0.9],[0.94,0.9]]){ctx.fillStyle=rgba(PW_C.brassD,1);ctx.beginPath();ctx.arc(x+w*sx,y+h*sy,Math.max(2,w*0.012),0,TAU);ctx.fill();}
  if(o.lit>0)pw_glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.8,PW_C.warm,0.22*o.lit);
  ctx.restore();}

/* ---------------------------------------------------------------- lanterns: the robbers' light, never the robbers
   pw_lantern(ctx, x, y, a, o): a lantern's warm light, its flame, and a coral rim round it (danger); o.r its glow's size */
function pw_lantern(ctx,x,y,a,o){if(!(a>0))return;o=o||{};const r=o.r||90;pw_glow(ctx,x,y,r,PW_C.warm,0.55*a);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(mix(PW_C.warm,[255,255,255],0.55),1);ctx.beginPath();ctx.ellipse(x,y,5,8,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.9);ctx.shadowBlur=10;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,o.ring||20,0,TAU);ctx.stroke();ctx.restore();}
// a point along a path of points, part u of the way
function pw_along(P,u){u=clamp(u,0,1);let L=0;const seg=[];for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);L+=d;}
  let s=u*L;for(let i=1;i<P.length;i++){if(s<=seg[i-1]||i===P.length-1){const k=seg[i-1]?clamp(s/seg[i-1],0,1):0;return[lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k)];}s-=seg[i-1];}return P[P.length-1];}

/* ---------------------------------------------------------------- the people of the story
   James Sargent, the lock maker, in his forties, in shirt sleeves under a work apron; Fred Deland, a young man in a dark coat, both
   lit by a lamp at night; arms down (people.js), Sargent behind his bench, Fred beside the vault's door. */
const PW_SARGENT={name:"James Sargent",key:"pwSargent",role:"Lock maker",skin:[214,172,140],hair:{style:"side",c:[78,58,44]},beard:[84,62,46],
  top:{kind:"apron",c:[206,200,186],apron:[96,80,62]},breath:0.26};
const PW_FRED={name:"Fred Deland",key:"pwFred",role:"",skin:[228,192,162],hair:{style:"side",c:[56,40,32]},top:{kind:"suit",c:[38,38,44],inner:[226,222,212],tie:[30,30,36]},breath:0.3};
DP_PEOPLE.push([PW_SARGENT,"lamp"],[PW_FRED,"lamp"]);
