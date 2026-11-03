/* ===== A model, reasoning, hands and a loop: 1914, and the flight deck today =====
   The film's own places and pictures outside the lab, in the module's matte language, lit from the right as the room is (prefix ml_):
     mlSeine     the Seine at Bezons, just outside Paris, on 18 June 1914: a wide, slow river between low stone bridges, poplars on the far
                 bank, a grandstand under a striped awning across the water, and a judges' tent on the near bank (a place, painted once)
     mlSky       the same June sky over the water, closer, for the flying boat in flight (a place)
     mlDeck      today: an airliner's flight deck, seen from the side, daylight in its windows (a place)
     ml_boat     the flying boat side on (a biplane on a boat's hull, its engine between the wings driving a propeller behind it), from
                 photographs of the Curtiss flying boats of 1914; ml_boatBack the same from behind, for a wing that tips and comes back
     ml_crowd    spectators of 1914 seen from behind, along the near bank: boaters, dark suits, pale blouses, wide hats, two parasols
     ml_box      Sperry's stabiliser cut open: four gyroscopes, a valve, a piston, a lever to the wing's hinged edge; ml_level a spirit level
     ML_PEOPLE   the people of 1914 and today, for ag_person: Sperry, Cachin, a judge, two airline pilots
   Nobody's face is a likeness: the people of 1914 are dressed from photographs of the day, with the module's proportions. */

const ML_P={sky0:[192,208,220],sky1:[236,233,224],haze:[222,226,222],tree:[118,136,120],poplar:[104,124,108],stone:[204,196,180],stoneDk:[150,142,128],
  water0:[188,200,193],water1:[150,169,162],rip:[240,242,236],ripDk:[118,138,130],grass0:[164,170,128],grass1:[132,142,100],path:[214,204,182],
  timber:[216,198,168],timberDk:[150,128,100],cream:[242,234,216],rose:[186,134,130],linen:[236,228,206],linenDk:[196,186,160],hull:[126,88,58],hullHi:[176,132,92],
  strut:[150,118,86],engine:[62,62,66],brass:[192,158,94],brassDk:[132,104,56],suit:[52,52,58],skirt:[226,220,206]};

/* ---------------------------------------------------------------- the Seine at Bezons, 18 June 1914 (painted once) */
const ML_SEINE={hz:455,bank:782};
function ml_skyPaint(c,hz,o){o=o||{};let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(ML_P.sky0,1));g.addColorStop(0.7,rgba(mix(ML_P.sky0,ML_P.sky1,0.7),1));g.addColorStop(1,rgba(ML_P.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  // soft summer clouds: wide, low, out of focus, lit from the right; drawn small and blurred, then scaled up
  const k=0.25,cw=Math.ceil(W*k),ch=Math.ceil(hz*k)+2,b=mkCanvas(cw,ch),x=b.getContext("2d"),R=ag_rnd(o.seed||5);x.filter="blur(4px)";
  for(let i=0;i<(o.clouds||9);i++){const cx=R()*cw,cy=(60+R()*(hz*0.5))*k,w=(180+R()*360)*k,h=(26+R()*40)*k;
    const cg=x.createRadialGradient(cx+w*0.15,cy-h*0.2,1,cx,cy,w*0.6);cg.addColorStop(0,"rgba(255,255,252,0.75)");cg.addColorStop(1,"rgba(255,255,252,0)");
    x.fillStyle=cg;x.beginPath();x.ellipse(cx,cy,w*0.6,h,0,0,TAU);x.fill();}
  c.save();c.imageSmoothingQuality="high";c.drawImage(b,0,0,cw,ch,0,0,cw/k,ch/k);c.restore();
  // the sun is up and to the right: a warm glow there
  g=c.createRadialGradient(1700,-80,20,1700,-80,900);g.addColorStop(0,"rgba(255,250,236,0.55)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);}
// a tree line along the far bank: round crowns and tall poplars, hazy, lit from the right
function ml_treeLine(c,y0,hz,seed,o){o=o||{};const R=ag_rnd(seed),haze=o.haze==null?0.42:o.haze;
  const col=k=>rgba(mix(mix(ML_P.tree,ML_P.poplar,k),ML_P.haze,haze),1),hi=rgba(mix(mix(ML_P.tree,[200,214,180],0.4),ML_P.haze,haze),1);
  c.save();
  // a low band of round crowns
  for(let x=-40;x<W+40;){const w=50+R()*90,h=36+R()*46,cx=x+w/2,cy=hz-h*0.55;c.fillStyle=col(0.3);c.beginPath();c.ellipse(cx,cy,w*0.6,h*0.62,0,0,TAU);c.fill();
    c.fillStyle=hi;c.globalAlpha=0.45;c.beginPath();c.ellipse(cx+w*0.16,cy-h*0.16,w*0.32,h*0.34,0,0,TAU);c.fill();c.globalAlpha=1;x+=w*0.7;}
  // poplars: tall and narrow, in loose groups
  for(let x=20;x<W;){if(R()<0.62){const n=1+(R()*3|0);for(let k=0;k<n;k++){const px=x+k*(16+R()*10),h=(o.tall||110)+R()*70,w=14+R()*9,top=hz-h-(y0||0);
        c.fillStyle=col(1);c.beginPath();c.moveTo(px,top);c.bezierCurveTo(px+w*0.9,top+h*0.25,px+w*0.8,top+h*0.85,px+w*0.25,hz-4);c.lineTo(px-w*0.25,hz-4);
        c.bezierCurveTo(px-w*0.8,top+h*0.85,px-w*0.9,top+h*0.25,px,top);c.fill();
        c.fillStyle=hi;c.globalAlpha=0.4;c.beginPath();c.ellipse(px+w*0.22,top+h*0.45,w*0.25,h*0.35,0,0,TAU);c.fill();c.globalAlpha=1;}}
    x+=60+R()*130;}
  c.restore();}
// a low stone bridge far off: a level deck on arches, the arches' dark undersides reflected in the water
function ml_bridge(c,x0,x1,y,h,n){const span=(x1-x0)/n;c.save();
  c.fillStyle=rgba(mix(ML_P.stone,ML_P.haze,0.35),1);c.fillRect(x0,y-h*0.36,x1-x0,h*1.36);
  for(let i=0;i<n;i++){const ax=x0+span*(i+0.5),aw=span*0.38,ah=h*0.78;c.fillStyle=rgba(mix(ML_P.stoneDk,ML_P.haze,0.25),1);
    c.beginPath();c.moveTo(ax-aw,y+h);c.lineTo(ax-aw,y+h*0.62);c.quadraticCurveTo(ax-aw,y+h-ah,ax,y+h-ah);c.quadraticCurveTo(ax+aw,y+h-ah,ax+aw,y+h*0.62);c.lineTo(ax+aw,y+h);c.closePath();c.fill();}
  c.fillStyle=rgba(mix(ML_P.stone,[255,255,255],0.3),1);c.fillRect(x0,y-h*0.36,x1-x0,3);   // the parapet's lit edge
  c.fillStyle=rgba(mix(ML_P.stoneDk,ML_P.haze,0.3),0.5);c.fillRect(x0,y-h*0.36+3,x1-x0,2);
  c.restore();}
// the grandstand across the water: pale timber tiers under a striped awning, the crowd a soft speckle of hats and faces
function ml_grandstand(c,x0,x1,top,base,seed){const R=ag_rnd(seed),w=x1-x0,h=base-top;c.save();
  const aw=h*0.24;
  // the shade under the awning, the stand's back wall
  c.fillStyle=rgba(mix(ML_P.timberDk,ML_P.haze,0.42),1);c.fillRect(x0+4,top+aw,w-8,h-aw);
  // four rows of spectators, each row lower and nearer: hats and faces as soft dots, coats as a darker band
  for(let k=0;k<4;k++){const ry=top+aw+(h-aw)*(0.26+k*0.2);c.fillStyle=rgba(mix(ML_P.timber,ML_P.haze,0.3),1);c.fillRect(x0+4,ry+2,w-8,2.5);
    for(let x=x0+8;x<x1-6;x+=5.5+R()*3.5){const sk=R(),dy=(R()-0.5)*1.6;c.fillStyle=rgba(mix(sk<0.55?ML_P.suit:ML_P.skirt,ML_P.haze,0.35),1);c.fillRect(x-2,ry-5+dy,4.6,7);
      c.fillStyle=rgba(mix([216,184,156],ML_P.haze,0.3),1);c.beginPath();c.arc(x+0.3,ry-7.5+dy,1.9,0,TAU);c.fill();
      const ht=R();if(ht<0.75){c.fillStyle=rgba(mix(ht<0.4?[232,214,170]:ht<0.6?[60,60,66]:[238,234,226],ML_P.haze,0.3),1);c.fillRect(x-2.2,ry-10.5+dy,5,2.2);}}}
  // posts and the white rail at the front
  for(let i=0;i<=6;i++){const px=x0+4+(w-8)*i/6;c.fillStyle=rgba(mix(ML_P.timber,ML_P.haze,0.2),1);c.fillRect(px-2,top+aw,4,h-aw);}
  c.fillStyle=rgba(mix([244,242,236],ML_P.haze,0.2),1);c.fillRect(x0,base-9,w,3);c.fillRect(x0,base-3,w,3);
  // the awning's stripes, a little scalloped at the front, its shadow under it
  for(let i=0,n=Math.round(w/22);i<n;i++){const sx=x0+i*w/n;c.fillStyle=rgba(i%2?mix(ML_P.rose,ML_P.haze,0.25):mix(ML_P.cream,ML_P.haze,0.15),1);
    c.beginPath();c.moveTo(sx,top);c.lineTo(sx+w/n,top);c.lineTo(sx+w/n,top+aw);c.quadraticCurveTo(sx+w/n/2,top+aw+6,sx,top+aw);c.closePath();c.fill();}
  c.fillStyle="rgba(40,34,28,0.18)";c.fillRect(x0+4,top+aw+3,w-8,5);
  c.restore();}
// the river: pale and slow, the far bank's reflection, ripples that widen towards us, glints where the sun catches them
function ml_river(c,hz,bank,seed){const R=ag_rnd(seed);let g=c.createLinearGradient(0,hz,0,bank);g.addColorStop(0,rgba(ML_P.water0,1));g.addColorStop(1,rgba(ML_P.water1,1));
  c.fillStyle=g;c.fillRect(0,hz,W,bank-hz);
  // the far bank and its trees, mirrored and softened
  g=c.createLinearGradient(0,hz,0,hz+120);g.addColorStop(0,rgba(mix(ML_P.tree,ML_P.water0,0.45),0.7));g.addColorStop(1,rgba(ML_P.tree,0));
  c.fillStyle=g;c.fillRect(0,hz,W,120);
  // the sky's light on the water, brightest towards the sun on the right
  g=c.createRadialGradient(1500,hz+60,20,1500,hz+60,900);g.addColorStop(0,"rgba(255,252,242,0.32)");g.addColorStop(1,"rgba(255,252,242,0)");c.fillStyle=g;c.fillRect(0,hz,W,bank-hz);
  // ripples: thin lines, longer and further apart towards us
  c.save();c.lineCap="round";for(let i=0;i<520;i++){const u=Math.pow(R(),1.6),y=hz+6+u*(bank-hz-10),len=(10+R()*40)*(0.4+u*2.2),x=R()*W,lw=0.8+u*1.8;
    c.strokeStyle=R()<0.55?rgba(ML_P.rip,0.18+0.3*u):rgba(ML_P.ripDk,0.1+0.18*u);c.lineWidth=lw;c.beginPath();c.moveTo(x,y);c.lineTo(x+len,y);c.stroke();}
  for(let i=0;i<90;i++){const x=1000+R()*900,y=hz+20+R()*(bank-hz-60);c.fillStyle="rgba(255,253,244,"+(0.25+R()*0.4)+")";c.fillRect(x,y,2+R()*8,1.4);}
  c.restore();}
// the near bank: grass and a gravel path, the water's edge in soft shadow
function ml_nearBank(c,bank,seed){const R=ag_rnd(seed);let g=c.createLinearGradient(0,bank,0,H);g.addColorStop(0,rgba(ML_P.grass0,1));g.addColorStop(1,rgba(ML_P.grass1,1));
  c.fillStyle=g;c.beginPath();c.moveTo(0,bank+10);c.bezierCurveTo(500,bank-6,1200,bank+12,W,bank-4);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  c.strokeStyle="rgba(70,80,60,0.25)";c.lineWidth=3;c.beginPath();c.moveTo(0,bank+10);c.bezierCurveTo(500,bank-6,1200,bank+12,W,bank-4);c.stroke();
  // the path along the bank
  c.fillStyle=rgba(ML_P.path,0.85);c.beginPath();c.moveTo(0,bank+70);c.bezierCurveTo(600,bank+40,1300,bank+64,W,bank+44);c.lineTo(W,bank+96);c.bezierCurveTo(1300,bank+120,600,bank+100,0,bank+136);c.closePath();c.fill();
  // tufts of grass
  c.save();c.lineCap="round";for(let i=0;i<700;i++){const x=R()*W,y=bank+10+Math.pow(R(),0.8)*(H-bank-10),l=4+R()*10;c.strokeStyle=rgba(R()<0.5?mix(ML_P.grass1,[60,70,40],0.3):mix(ML_P.grass0,[230,226,180],0.3),0.35);
    c.lineWidth=1.2+R();c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-0.5)*4,y-l);c.stroke();}c.restore();}
// the judges' tent on the near bank: a white canopy on poles, a table with a cloth, three judges in dark coats seen from behind
function ml_tent(c,x,y,w,seed){const h=w*0.42,top=y-h;c.save();
  ag_floorShadow(c,x+w/2-10,y+6,w*0.62,16,0.3);
  // poles, the table and its cloth
  c.fillStyle=rgba(ML_P.timberDk,1);for(const px of [x+8,x+w-12])c.fillRect(px,top+20,5,h-20);
  c.fillStyle=rgba([238,236,228],1);c.fillRect(x+w*0.12,y-h*0.32,w*0.76,h*0.32);c.fillStyle="rgba(0,0,0,0.08)";c.fillRect(x+w*0.12,y-h*0.32,w*0.76,5);
  // three judges, from behind, a little in shade under the canopy
  for(let i=0;i<3;i++){const jx=x+w*(0.28+i*0.22),jy=y-h*0.3;ml_backFig(c,jx,jy,w*0.15,{coat:mix(ML_P.suit,[90,90,96],i*0.25),hat:i===1?"top":"bowler",len:0.75});}
  // the canopy: white canvas, scalloped, lit from the right
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"#E3E1DA");g.addColorStop(1,"#F8F6F0");c.fillStyle=g;
  c.beginPath();c.moveTo(x-10,top+30);c.lineTo(x+w*0.5,top-8);c.lineTo(x+w+10,top+30);c.lineTo(x+w+10,top+44);
  for(let k=0;k<8;k++){const sx=x+w+10-(w+20)*(k+1)/8;c.quadraticCurveTo(sx+(w+20)/16,top+58,sx,top+44);}c.closePath();c.fill();
  c.strokeStyle="rgba(120,110,96,0.35)";c.lineWidth=2;c.stroke();c.restore();}
/* a person seen from behind (u: the shoulders' width; (x, y) where the neck meets the shoulders), down to the frame's edge or o.len:
   a hat, the back of the head, the shoulders and arms in a coat or a blouse. o: coat (a colour), hat "boater", "bowler", "top", "wide"
   (a lady's wide hat, with o.ribbon), "cap" or "none"; lady (narrower shoulders, a high collar, hair up); turn (-1 to 1, the head turns
   a little to the right or left); up (0 to 1, rising, as someone who stands); wave (0 to 1, the right arm raised with the hat in hand);
   parasol (a colour); len (how far the body goes down, in u; 3 by default) */
function ml_backFig(c,x,y,u,o){o=o||{};const coat=o.coat||ML_P.suit,turn=o.turn||0,lady=!!o.lady,len=(o.len||3)*u;y-=(o.up||0)*u*0.45;c.save();
  const sw=lady?0.43:0.5,dk=rgba(ag_dk(coat,0.3),1),lt=rgba(ag_lt(coat,0.2),1);
  const body=cc=>{cc.moveTo(x-u*0.11,y-u*0.04);cc.bezierCurveTo(x-u*0.3,y-u*0.01,x-u*sw,y+u*0.02,x-u*(sw+0.02),y+u*0.2);
    cc.bezierCurveTo(x-u*(sw+0.05),y+u*0.6,x-u*(sw+0.04),y+len*0.5,x-u*(sw-0.02),y+len);cc.lineTo(x+u*(sw-0.02),y+len);
    cc.bezierCurveTo(x+u*(sw+0.04),y+len*0.5,x+u*(sw+0.05),y+u*0.6,x+u*(sw+0.02),y+u*0.2);cc.bezierCurveTo(x+u*sw,y+u*0.02,x+u*0.3,y-u*0.01,x+u*0.11,y-u*0.04);cc.closePath();};
  let g=c.createLinearGradient(x-u*0.55,0,x+u*0.55,0);g.addColorStop(0,dk);g.addColorStop(0.62,rgba(coat,1));g.addColorStop(1,lt);
  c.fillStyle=g;c.beginPath();body(c);c.fill();
  // the arms against the body: a soft fold on each side, and the jacket's centre seam
  c.save();c.beginPath();body(c);c.clip();c.strokeStyle=rgba(ag_dk(coat,0.45),0.45);c.lineWidth=Math.max(1.2,u*0.02);c.lineCap="round";
  for(const s of [-1,1]){c.beginPath();c.moveTo(x+s*u*0.33,y+u*0.3);c.quadraticCurveTo(x+s*u*0.37,y+u*0.9,x+s*u*0.35,y+len);c.stroke();}
  if(!lady){c.strokeStyle=rgba(ag_dk(coat,0.4),0.3);c.beginPath();c.moveTo(x,y+u*0.08);c.lineTo(x,y+len);c.stroke();}
  c.fillStyle="rgba(255,250,236,0.1)";c.beginPath();c.ellipse(x+u*0.36,y+u*0.3,u*0.16,u*0.5,0,0,TAU);c.fill();c.restore();
  // the collar: a white shirt collar under a jacket's, or a lady's high collar
  c.fillStyle=lady?rgba(ag_lt(coat,0.35),1):"rgba(244,242,236,1)";c.beginPath();c.ellipse(x,y-u*0.02,u*0.13,u*0.05,0,0,TAU);c.fill();
  // the neck and the back of the head
  const hx=x+turn*u*0.05,hy=y-u*0.27,hr=u*0.17,sk=o.skin||[214,176,146],hair=o.hair||[70,52,40];
  c.fillStyle=rgba(ag_dk(sk,0.2),1);c.fillRect(x-u*0.065,y-u*0.15,u*0.13,u*0.14);
  c.fillStyle=rgba(sk,1);c.beginPath();c.ellipse(hx,hy,hr,hr*1.18,0,0,TAU);c.fill();
  for(const s of [-1,1]){const ex=hx+s*hr*0.98,show=s===Math.sign(turn)?1:0.6;c.fillStyle=rgba(ag_dk(sk,0.1),show);c.beginPath();c.ellipse(ex,hy+hr*0.08,hr*0.16,hr*0.3,0,0,TAU);c.fill();}
  if(turn){c.fillStyle=rgba(ag_lt(sk,0.08),1);c.beginPath();c.ellipse(hx+Math.sign(turn)*hr*0.62,hy+hr*0.3,hr*0.36*Math.abs(turn),hr*0.6,0,0,TAU);c.fill();}
  // hair: the whole back of the head, cut short and level at the nape, or up in a bun under a lady's hat
  c.fillStyle=rgba(hair,1);c.beginPath();c.moveTo(hx-hr*1.01,hy+hr*0.1);c.bezierCurveTo(hx-hr*1.08,hy-hr*1.1,hx+hr*1.08,hy-hr*1.1,hx+hr*1.01,hy+hr*0.1);
  c.bezierCurveTo(hx+hr*0.98,hy+hr*0.55,hx+hr*0.7,hy+(lady?0.98:0.86)*hr,hx+hr*0.36,hy+(lady?1.02:0.9)*hr);c.lineTo(hx-hr*0.36,hy+(lady?1.02:0.9)*hr);
  c.bezierCurveTo(hx-hr*0.7,hy+(lady?0.98:0.86)*hr,hx-hr*0.98,hy+hr*0.55,hx-hr*1.01,hy+hr*0.1);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_lt(hair,0.25),0.25);c.lineWidth=Math.max(1,hr*0.05);c.beginPath();c.moveTo(hx-hr*0.4,hy-hr*0.6);c.quadraticCurveTo(hx-hr*0.2,hy+hr*0.2,hx-hr*0.3,hy+hr*0.8);c.stroke();
  if(lady){c.fillStyle=rgba(ag_dk(hair,0.15),1);c.beginPath();c.ellipse(hx,hy+hr*0.42,hr*0.5,hr*0.38,0,0,TAU);c.fill();}
  c.fillStyle="rgba(255,252,240,0.14)";c.beginPath();c.ellipse(hx+hr*0.45,hy-hr*0.3,hr*0.35,hr*0.5,0,0,TAU);c.fill();
  // the hat, a soft light on its right side
  const hat=o.hat||"boater",hc=o.hatC||(hat==="boater"?[224,204,158]:hat==="wide"?[234,228,214]:[40,40,46]);
  if(hat!=="none"&&!(o.wave>0.5&&hat==="boater"))ml_hat(c,hat,hx,hy-hr*0.58,hr,hc,o.ribbon);
  if(o.wave>0){const k=o.wave,sx=x+u*0.46,sy=y+u*0.18,ex=sx+u*lerp(0.08,0.28,k),ey=sy-u*lerp(0.1,0.62,k),wx=ex+u*lerp(0.02,0.1,k),wy=ey-u*lerp(0.2,0.6,k);
    c.strokeStyle=rgba(ag_lt(coat,0.05),1);c.lineCap="round";c.lineWidth=u*0.2;c.beginPath();c.moveTo(sx,sy);c.lineTo(ex,ey);c.lineTo(wx,wy);c.stroke();
    c.fillStyle=rgba(sk,1);c.beginPath();c.arc(wx,wy,u*0.075,0,TAU);c.fill();if(hat==="boater")ml_hat(c,"boater",wx,wy-u*0.08,hr*0.9,hc,o.ribbon);}
  if(o.parasol){const pc=o.parasol,px=hx+u*0.34,py=hy-u*0.78,pr=u*0.56;c.strokeStyle=rgba([90,80,70],1);c.lineWidth=Math.max(1.5,u*0.025);c.beginPath();c.moveTo(px,py);c.lineTo(px-u*0.1,y+u*0.4);c.stroke();
    g=c.createLinearGradient(px-pr,0,px+pr,0);g.addColorStop(0,rgba(ag_dk(pc,0.14),1));g.addColorStop(1,rgba(ag_lt(pc,0.3),1));c.fillStyle=g;
    c.beginPath();c.moveTo(px-pr,py+pr*0.3);c.quadraticCurveTo(px-pr*0.82,py-pr*0.5,px,py-pr*0.56);c.quadraticCurveTo(px+pr*0.82,py-pr*0.5,px+pr,py+pr*0.3);
    for(let k=0;k<6;k++){const sx2=px+pr-(2*pr)*(k+1)/6;c.quadraticCurveTo(sx2+pr/6,py+pr*0.14,sx2,py+pr*0.3);}c.closePath();c.fill();
    c.strokeStyle="rgba(120,110,96,0.3)";c.lineWidth=1.2;for(let k=1;k<6;k++){const sx2=px+pr-(2*pr)*k/6;c.beginPath();c.moveTo(px,py-pr*0.54);c.lineTo(sx2,py+pr*0.3);c.stroke();}}
  c.restore();}
function ml_hat(c,hat,x,y,r,hc,ribbon){c.save();c.fillStyle=rgba(hc,1);
  if(hat==="boater"){c.beginPath();c.ellipse(x,y+r*0.12,r*1.55,r*0.26,0,0,TAU);c.fill();c.fillStyle=rgba(ag_dk(hc,0.06),1);c.fillRect(x-r*0.88,y-r*0.6,r*1.76,r*0.72);
    c.fillStyle=rgba(ag_lt(hc,0.2),1);c.beginPath();c.ellipse(x,y-r*0.6,r*0.88,r*0.14,0,0,TAU);c.fill();c.fillStyle=rgba(ribbon||[46,46,58],1);c.fillRect(x-r*0.88,y-r*0.12,r*1.76,r*0.22);}
  else if(hat==="bowler"){c.beginPath();c.ellipse(x,y+r*0.12,r*1.3,r*0.2,0,0,TAU);c.fill();c.beginPath();c.ellipse(x,y-r*0.05,r*0.92,r*0.95,0,Math.PI,TAU);c.fill();}
  else if(hat==="top"){c.beginPath();c.ellipse(x,y+r*0.12,r*1.3,r*0.2,0,0,TAU);c.fill();c.fillRect(x-r*0.8,y-r*1.35,r*1.6,r*1.45);}
  else if(hat==="wide"){c.beginPath();c.ellipse(x,y+r*0.2,r*2.3,r*0.5,0,0,TAU);c.fill();c.beginPath();c.ellipse(x,y-r*0.2,r*1.05,r*0.62,0,0,TAU);c.fill();
    c.fillStyle=rgba(ribbon||[150,110,120],1);c.fillRect(x-r*1.05,y-r*0.08,r*2.1,r*0.22);c.beginPath();c.ellipse(x+r*0.7,y-r*0.3,r*0.5,r*0.2,-0.5,0,TAU);c.fill();}
  else if(hat==="cap"){c.beginPath();c.ellipse(x,y+r*0.1,r*1.08,r*0.7,0,Math.PI,TAU);c.fill();}
  c.fillStyle="rgba(255,252,240,0.16)";c.beginPath();c.ellipse(x+r*0.5,y-r*0.2,r*0.5,r*0.25,0,0,TAU);c.fill();c.restore();}
AG_PLACES.mlSeine=c=>{const hz=ML_SEINE.hz,bank=ML_SEINE.bank;ml_skyPaint(c,hz,{seed:5,clouds:10});
  ml_treeLine(c,0,hz,11,{haze:0.5,tall:96});
  ml_bridge(c,-20,470,hz-34,30,5);ml_bridge(c,1580,1960,hz-30,26,4);
  ml_grandstand(c,1020,1420,hz-84,hz-2,23);
  ml_river(c,hz,bank,31);ml_nearBank(c,bank,41);
  ml_tent(c,150,bank+8,420,7);
  // the far bank's edge, a thin line of shade where the water meets it
  c.fillStyle="rgba(80,96,84,0.28)";c.fillRect(0,hz-1,W,3);};
AG_PLACES.mlSky=c=>{const hz=700;ml_skyPaint(c,hz,{seed:9,clouds:12});ml_treeLine(c,0,hz,13,{haze:0.62,tall:70});ml_river(c,hz,H,37);};

/* ---------------------------------------------------------------- the crowd along the near bank, from behind (drawn live: heads turn, people stand) */
const ML_CROWD=(()=>{const R=ag_rnd(19),out=[];const spec=[["boater",0],["wide",1],["bowler",0],["boater",0],["wide",1],["boater",0],["bowler",0],["wide",1],["boater",0],["cap",0]],
    coats=[ML_P.suit,[72,68,62],[86,82,94],[64,66,72]],blouses=[[234,230,220],[224,218,204],[236,232,236]];
  spec.forEach((sp,i)=>{const lady=!!sp[1],x=640+i*142+(R()-0.5)*40,u=(lady?190:220)+R()*30;
    out.push({x,y:910+R()*40-(lady?0:12),u,hat:sp[0],lady,coat:lady?blouses[(R()*3)|0]:coats[(R()*4)|0],ribbon:lady?(R()<0.5?[150,112,122]:[118,128,150]):[44,44,56],
      hair:R()<0.5?[58,42,32]:[104,76,50],skin:mix([228,190,160],[180,132,100],R()*0.8),parasol:i===1?[242,236,222]:i===7?[228,222,234]:null,ph:R()*TAU,w:i===3||i===6});});
  return out.sort((a,b)=>a.u-b.u);})();
function ml_crowd(ctx,t,o){o=o||{};for(const p of ML_CROWD){const turn=(o.turn||0)*Math.sin(p.ph+1)*0.9,up=(o.up||0)*(0.6+0.4*Math.sin(p.ph*3));
  ml_backFig(ctx,p.x+Math.sin(t*0.7+p.ph)*1.5,p.y,p.u,{coat:p.coat,hat:p.hat,lady:p.lady,ribbon:p.ribbon,hair:p.hair,skin:p.skin,parasol:p.parasol,turn,up,wave:p.w?(o.wave||0):0});}}

/* ---------------------------------------------------------------- the flying boat, side on
   ml_boat(ctx, x, y, s, o): the hull's top at the wings is (x, y), s = 1 a hull 380 px long, flying to the right (o.flip: to the left).
   o.t (the propeller turns), o.pitch (radians, nose up), o.who: who sits in the cockpit, [{who, hands}] near first (hands 0 to 1 raises
   both arms, open), o.shadow (the water's y, for its shadow and reflection), o.a. Drawn from photographs of the Curtiss flying boats of
   1914: a varnished wooden hull with a step under it, linen wings on wooden struts, the engine between them driving a propeller behind,
   a fin and a tailplane at the end of the hull, a float under each wing's tip. */
function ml_boat(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=ML_P,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  if(o.shadow!=null){const sy=o.shadow;ag_floorShadow(ctx,x-10*s,sy,150*s,7*s,0.1*a);
    // its reflection: a soft, darker smear on the water under it
    ctx.save();ctx.globalAlpha*=0.18;ctx.fillStyle=rgba(ag_dk(P.hull,0.3),1);ctx.beginPath();ctx.ellipse(x,sy+8*s,170*s,6*s,0,0,TAU);ctx.fill();ctx.restore();}
  ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.rotate(-(o.pitch||0));
  const lw=1.4/s;ctx.lineJoin="round";ctx.lineCap="round";
  // the far float and the far struts, behind everything
  const wood=rgba(P.strut,1),linen=rgba(P.linen,1),linenDk=rgba(P.linenDk,1);
  // the tailplane's far half and the fin's shadow side come first
  // the upper and lower wings, edge on: a thin cambered slab each
  const wing=(y0,x0,x1,th)=>{ctx.beginPath();ctx.moveTo(x1,y0);ctx.quadraticCurveTo((x0+x1)/2,y0-th*1.4,x0,y0+th*0.2);ctx.lineTo(x0,y0+th*0.8);ctx.quadraticCurveTo((x0+x1)/2,y0+th*0.2,x1,y0+th*0.7);ctx.closePath();
    const g=ctx.createLinearGradient(0,y0-th,0,y0+th);g.addColorStop(0,rgba(ag_lt(P.linen,0.3),1));g.addColorStop(1,linenDk);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(ag_dk(P.linenDk,0.2),0.6);ctx.lineWidth=lw;ctx.stroke();};
  // struts between the wings (two pairs seen side on), with bracing wires
  ctx.strokeStyle=wood;ctx.lineWidth=2.6;for(const sx of [-38,46]){ctx.beginPath();ctx.moveTo(sx,-6);ctx.lineTo(sx-2,-76);ctx.stroke();}
  ctx.strokeStyle="rgba(70,64,58,0.5)";ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(-38,-8);ctx.lineTo(44,-74);ctx.moveTo(46,-8);ctx.lineTo(-40,-74);ctx.stroke();
  // the engine, high between the wings on its bearers: a long block of cylinders, its radiator at the front; the propeller turns behind it
  ctx.strokeStyle="rgba(58,56,56,0.9)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-46);ctx.lineTo(-20,-6);ctx.moveTo(10,-46);ctx.lineTo(18,-6);ctx.moveTo(-12,-46);ctx.lineTo(18,-6);ctx.stroke();
  ag_soft(ctx,c=>ag_rect(c,-22,-66,40,20,4),P.engine,[150,150,156],8,-64,30,"rgba(0,0,0,0.4)",5);
  ctx.fillStyle="rgba(150,150,156,0.55)";for(let k=0;k<4;k++)ctx.fillRect(-18+k*9,-70,6,4);
  ag_soft(ctx,c=>ag_rect(c,18,-72,9,30,2),[170,170,164],[226,226,220],24,-68,18,null);
  ctx.strokeStyle="rgba(110,110,104,0.5)";ctx.lineWidth=0.8;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(19,-70+k*5);ctx.lineTo(26,-70+k*5);ctx.stroke();}
  const pr=36,ph=t*28;ctx.save();ctx.translate(-30,-56);ctx.fillStyle="rgba(140,104,66,0.16)";ctx.beginPath();ctx.ellipse(0,0,4,pr,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(120,88,56,0.45)";const bl=Math.sin(ph)*pr;ctx.beginPath();ctx.ellipse(0,bl*0.5,2.4,Math.abs(bl)*0.5+2,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([70,70,74],1);ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();ctx.restore();
  wing(-80,-58,66,6);
  // the hull: a deep curved bow, a flat keel to the step, then tapering up to the tail; varnished wood, lit from above and the right
  const hull=c=>{c.moveTo(186,8);c.bezierCurveTo(194,2,196,-3,190,-6);c.lineTo(110,-7);c.lineTo(-40,-5);c.bezierCurveTo(-100,-6,-150,-10,-196,-14);c.lineTo(-200,-6);
    c.bezierCurveTo(-160,-1,-80,10,6,20);c.lineTo(8,28);c.lineTo(128,32);c.bezierCurveTo(160,31,182,22,186,8);c.closePath();};
  ag_soft(ctx,hull,P.hull,P.hullHi,120,-6,120,"rgba(30,16,6,0.45)",10,0.6);
  ctx.strokeStyle=rgba(ag_lt(P.hullHi,0.3),0.8);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(188,-5);ctx.lineTo(110,-6);ctx.lineTo(-40,-4);ctx.bezierCurveTo(-100,-5,-150,-9,-194,-13);ctx.stroke();
  ctx.strokeStyle="rgba(40,24,12,0.35)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(178,14);ctx.lineTo(8,12);ctx.bezierCurveTo(-60,6,-130,-2,-196,-8);ctx.stroke();   // the chine
  // the fin and rudder, the tailplane edge on, and its struts
  ag_soft(ctx,c=>{c.moveTo(-162,-11);c.bezierCurveTo(-168,-32,-176,-48,-188,-54);c.lineTo(-204,-52);c.lineTo(-202,-12);c.closePath();},P.linen,[255,255,250],-186,-40,34,"rgba(80,70,50,0.35)",5);
  ctx.strokeStyle=rgba(P.linenDk,0.9);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-193,-52);ctx.lineTo(-192,-12);ctx.stroke();
  wing(-32,-222,-150,4.5);
  ctx.strokeStyle=wood;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-158,-30);ctx.lineTo(-150,-10);ctx.moveTo(-214,-30);ctx.lineTo(-200,-11);ctx.stroke();
  // the lower wing, resting on the hull, and the near float under its tip
  wing(-6,-50,60,5);
  ctx.strokeStyle=wood;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-2);ctx.lineTo(14,12);ctx.moveTo(30,-2);ctx.lineTo(28,12);ctx.stroke();
  ag_soft(ctx,c=>{c.moveTo(-2,12);c.lineTo(40,12);c.bezierCurveTo(48,12,50,18,44,22);c.lineTo(4,22);c.bezierCurveTo(-2,20,-4,14,-2,12);c.closePath();},P.linen,[255,255,250],30,12,30,"rgba(80,70,50,0.35)",5);
  // the cockpit, ahead of the wings: who sits in it, the near one in front
  const who=o.who||[];for(let i=who.length-1;i>=0;i--){const w=who[i],hx=128-i*14,hy=-14-i*2;ml_seated(ctx,hx,hy,w,t,i);}
  // the cockpit's coaming over their waists
  ag_soft(ctx,c=>{c.moveTo(96,-7);c.bezierCurveTo(110,-12,146,-12,156,-6);c.lineTo(156,-3);c.lineTo(96,-3);c.closePath();},ag_dk(P.hull,0.25),P.hullHi,140,-8,30,null);
  ctx.restore();}
// a person in the cockpit, side on and small: head and shoulders, a cap, and arms that rise (hands 0 to 1)
function ml_seated(ctx,x,y,w,t,i){const sp=w.who||{},k=w.hands||0,sk=sp.skin||[218,180,148],top=sp.top&&sp.top.c||ML_P.suit,cap=sp.cap||[70,50,36];ctx.save();
  // the arms raised, open hands, elbows soft
  if(k>0){ctx.lineCap="round";ctx.lineJoin="round";for(const sd of [-1,1]){const sx=x+sd*4,sy=y+5,ex=x+sd*lerp(6,9,k)+3,ey=y+lerp(4,-12,k),hx=x+sd*lerp(5,5,k)+5,hy=y+lerp(2,-27,k);
      ctx.strokeStyle=rgba(ag_dk(top,sd<0?0.25:0),1);ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy+3);ctx.stroke();
      ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.ellipse(hx+0.5,hy,2.1,3.2,0.15*sd,0,TAU);ctx.fill();}}
  // shoulders and the head
  ctx.fillStyle=rgba(top,1);ctx.beginPath();ctx.ellipse(x,y+8,9,7,0,Math.PI,TAU);ctx.fill();ctx.fillRect(x-9,y+8,18,6);
  ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.ellipse(x+1,y-4,6,7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(cap,1);ctx.beginPath();ctx.ellipse(x,y-7,6.6,5.2,0,Math.PI,TAU);ctx.fill();
  if(sp.goggles){ctx.fillStyle="rgba(200,210,214,0.9)";ctx.beginPath();ctx.ellipse(x+3,y-10,2.4,1.6,0,0,TAU);ctx.fill();}
  else{ctx.fillRect(x-1,y-8,9,2);}
  ctx.restore();}

/* ---------------------------------------------------------------- the flying boat from behind
   ml_boatBack(ctx, x, y, s, o): the middle of the lower wing at (x, y), s = 1 a lower wing 800 px across; o.roll (radians, the right
   wing down), o.t (the propeller turns), o.out: a person standing out on the right lower wing (o.out.u, the way out from 0 to 1 along
   the wing, o.out.spec), o.heads (two heads in the cockpit, seen over the hull), o.a */
function ml_boatBack(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=ML_P,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(o.roll||0);ctx.lineCap="round";ctx.lineJoin="round";
  const slab=(x0,x1,y0,th,col)=>{const g=ctx.createLinearGradient(0,y0,0,y0+th);g.addColorStop(0,rgba(ag_lt(col,0.3),1));g.addColorStop(1,rgba(ag_dk(col,0.12),1));
    ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x0,y0,x1-x0,th,th/2);ctx.fill();ctx.strokeStyle=rgba(ag_dk(col,0.3),0.5);ctx.lineWidth=1.2;ctx.stroke();};
  // the wings' struts and bracing wires, then the wings
  const wood=rgba(P.strut,1);ctx.strokeStyle="rgba(70,64,58,0.45)";ctx.lineWidth=1;
  for(const sd of [-1,1]){for(const [x0,x1] of [[36,130],[130,280],[280,400]]){ctx.beginPath();ctx.moveTo(sd*x0,0);ctx.lineTo(sd*x1,-112);ctx.moveTo(sd*x1,0);ctx.lineTo(sd*x0,-112);ctx.stroke();}}
  ctx.strokeStyle=wood;ctx.lineWidth=5;for(const sd of [-1,1])for(const sx of [130,280,400]){ctx.beginPath();ctx.moveTo(sd*sx,2);ctx.lineTo(sd*sx,-110);ctx.stroke();}
  ctx.lineWidth=3;for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*400,-4);ctx.lineTo(sd*470,-108);ctx.stroke();}
  slab(-480,480,-120,11,P.linen);
  // the engine high between the wings, and the propeller's disc in front of it (it pushes, so it's at the back, towards us)
  ag_soft(ctx,c=>ag_rect(c,-30,-104,60,40,6),P.engine,[150,150,156],14,-100,40,"rgba(0,0,0,0.45)",6);
  ctx.strokeStyle="rgba(58,56,56,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,-66);ctx.lineTo(-34,0);ctx.moveTo(22,-66);ctx.lineTo(34,0);ctx.stroke();
  // two heads in the cockpit, far off beyond the engine, over the hull's deck
  const side=o.out&&o.out.side||1;if(o.heads){for(const hx of [-16,16]){if(o.out&&hx*side>0)continue;ctx.fillStyle=rgba([84,60,42],1);ctx.beginPath();ctx.ellipse(hx,-14,8,9,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(ML_P.suit,1);ctx.beginPath();ctx.ellipse(hx,-2,12,7,0,Math.PI,TAU);ctx.fill();}}
  slab(-400,400,-4,10,P.linen);
  // the floats under the wings' tips
  for(const sd of [-1,1]){ctx.strokeStyle=wood;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sd*372,6);ctx.lineTo(sd*380,22);ctx.moveTo(sd*392,6);ctx.lineTo(sd*384,22);ctx.stroke();
    ag_soft(ctx,c=>ag_rect(c,sd*382-16,20,32,18,8),P.linen,[255,255,250],sd*382+6,22,20,"rgba(80,70,50,0.35)",5);}
  // the hull under the wing, seen from behind: a rounded V, varnished wood
  ag_soft(ctx,c=>{c.moveTo(-44,6);c.lineTo(44,6);c.bezierCurveTo(46,30,30,58,0,70);c.bezierCurveTo(-30,58,-46,30,-44,6);c.closePath();},P.hull,P.hullHi,24,14,60,"rgba(30,16,6,0.45)",10,0.5);
  // the propeller's disc, a soft blur with one blade caught, then the tail: the fin and the tailplane, nearest to us
  ctx.save();ctx.translate(0,-84);ctx.fillStyle="rgba(150,116,76,0.13)";ctx.beginPath();ctx.arc(0,0,86,0,TAU);ctx.fill();
  const ang=t*26;ctx.rotate(ang);ctx.fillStyle="rgba(120,88,56,0.35)";ctx.beginPath();ctx.ellipse(0,0,84,6,0,0,TAU);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba([70,70,74],1);ctx.beginPath();ctx.arc(0,-84,6,0,TAU);ctx.fill();
  ag_soft(ctx,c=>{c.moveTo(-6,40);c.lineTo(-4,-54);c.quadraticCurveTo(0,-60,4,-54);c.lineTo(6,40);c.closePath();},P.linen,[255,255,250],4,-30,40,"rgba(80,70,50,0.35)",4);
  slab(-118,118,-22,8,P.linen);
  ctx.strokeStyle=wood;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-70,-14);ctx.lineTo(-10,34);ctx.moveTo(70,-14);ctx.lineTo(10,34);ctx.stroke();
  // someone out on a lower wing (the right; o.out.side -1 the left), from behind, a hand on the strut
  if(o.out){ctx.save();ctx.scale(side,1);const u=34,px=lerp(54,168,o.out.u||0),py=-104,sp=o.out.spec||{},tr=rgba(ag_dk(sp.coat||P.suit,0.2),1),step=Math.sin((o.out.u||0)*TAU*3)*4;
    ctx.strokeStyle=tr;ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(px-7,py+u*1.5);ctx.lineTo(px-9-step,-4);ctx.moveTo(px+7,py+u*1.5);ctx.lineTo(px+9+step,-4);ctx.stroke();
    ctx.fillStyle=rgba([40,34,30],1);for(const fx of [px-10-step,px+10+step]){ctx.beginPath();ctx.ellipse(fx,-4,8,4,0,0,TAU);ctx.fill();}
    ml_backFig(ctx,px,py,u,Object.assign({len:1.62},sp));
    ctx.strokeStyle=rgba(ag_dk((o.out.spec&&o.out.spec.coat)||P.suit,0.1),1);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(px-u*0.42,py+u*0.25);ctx.lineTo(130+2,py+u*0.1);ctx.stroke();
    ctx.fillStyle=rgba((o.out.spec&&o.out.spec.skin)||[214,176,146],1);ctx.beginPath();ctx.arc(132,py+u*0.1,5,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the people, for ag_person (dressed from photographs of the day, never likenesses) */
// a leather flying cap over the skull and ears, with a chin strap; goggles pushed up on the forehead
function ml_flyingCap(col,gog){return (c,P)=>{const g=c.createLinearGradient(220,300,390,420);g.addColorStop(0,rgba(ag_dk(col,0.25),1));g.addColorStop(1,rgba(ag_lt(col,0.2),1));
  const cap=cc=>{cc.moveTo(386,392);cc.bezierCurveTo(392,330,350,292,292,290);cc.bezierCurveTo(240,290,206,330,204,384);cc.bezierCurveTo(204,420,214,446,232,462);
    cc.bezierCurveTo(246,476,268,480,290,478);cc.bezierCurveTo(300,462,302,440,300,420);cc.bezierCurveTo(318,404,350,394,386,392);cc.closePath();};
  ag_soft(c,cap,col,ag_lt(col,0.35),340,320,120,"rgba(0,0,0,0.45)",14);c.save();ag_shape(c,cap);c.clip();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.55);c.lineWidth=2.4;c.beginPath();c.moveTo(300,292);c.quadraticCurveTo(270,370,262,470);c.stroke();
  c.beginPath();c.moveTo(384,394);c.quadraticCurveTo(330,398,300,422);c.stroke();c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.35),1);c.lineWidth=5;c.beginPath();c.moveTo(286,478);c.quadraticCurveTo(320,520,352,524);c.stroke();   // the chin strap
  if(gog){c.strokeStyle="rgba(40,36,34,0.9)";c.lineWidth=9;c.beginPath();c.moveTo(206,356);c.quadraticCurveTo(300,334,388,352);c.stroke();
    for(const [gx,gy,rx] of [[336,346,20],[376,350,12]]){c.fillStyle="rgba(60,56,52,1)";c.beginPath();c.ellipse(gx,gy,rx+4,17,0,0,TAU);c.fill();
      const lg=c.createLinearGradient(gx-rx,gy-14,gx+rx,gy+14);lg.addColorStop(0,"rgba(214,226,230,1)");lg.addColorStop(1,"rgba(150,170,178,1)");c.fillStyle=lg;c.beginPath();c.ellipse(gx,gy,rx,13,0,0,TAU);c.fill();
      c.fillStyle="rgba(255,255,255,0.7)";c.beginPath();c.ellipse(gx+rx*0.3,gy-5,rx*0.3,3,0,0,TAU);c.fill();}}};}
// a flat cloth cap, its peak over the brow
function ml_flatCap(col){return (c,P)=>{const cap=cc=>{cc.moveTo(392,384);cc.bezierCurveTo(400,368,390,350,370,338);cc.bezierCurveTo(340,300,250,292,214,330);cc.bezierCurveTo(200,346,200,368,208,386);
    cc.bezierCurveTo(260,378,320,376,392,384);cc.closePath();};ag_soft(c,cap,col,ag_lt(col,0.3),340,320,120,"rgba(0,0,0,0.4)",12);
  ag_soft(c,cc=>{cc.moveTo(330,380);cc.bezierCurveTo(360,372,400,372,420,386);cc.bezierCurveTo(400,394,360,394,330,390);cc.closePath();},ag_dk(col,0.15),ag_lt(col,0.2),380,380,40,null);};}
// a bowler hat
function ml_bowler(col){return (c,P)=>{ag_soft(c,cc=>{cc.ellipse(296,330,124,20,-0.06,0,TAU);},col,ag_lt(col,0.3),340,324,90,null);
  ag_soft(c,cc=>{cc.moveTo(212,330);cc.bezierCurveTo(212,236,380,236,382,326);cc.closePath();},col,ag_lt(col,0.35),330,270,90,"rgba(0,0,0,0.4)",10);};}
// a pilot's epaulettes today: dark, with gold bars
function ml_epaulettes(c,P){for(const [x,y,w,r] of [[150,604,74,-0.42],[396,622,56,0.36]]){c.save();c.translate(x,y);c.rotate(r);ag_soft(c,cc=>ag_rect(cc,-w/2,-11,w,22,5),[38,42,54],[90,96,110],0,-8,30,null);
  c.fillStyle="rgba(214,182,110,0.95)";for(let k=0;k<3;k++)c.fillRect(-w/2+10+k*(w-20)/3,-7,5,14);c.restore();}}
const ML_PEOPLE={
  sperry:{name:"Lawrence Sperry",key:"ml-sperry",skin:[232,198,170],hair:{style:"side",c:[74,52,36]},top:{kind:"suit",c:[70,62,56],inner:[236,232,222],tie:[60,54,62]},hat:{paint:ml_flyingCap([104,72,48],true)},breath:0.3},
  cachin:{name:"Emil Cachin",key:"ml-cachin",skin:[220,182,150],hair:{style:"cropped",c:[60,46,38]},top:{kind:"overshirt",c:[104,100,96],inner:[220,214,200]},hat:{paint:ml_flatCap([84,82,80])},breath:0.27},
  judge:{name:"A judge",key:"ml-judge",skin:[230,196,170],hair:{style:"cropped",c:[150,146,140]},beard:[156,150,146],top:{kind:"suit",c:[46,46,52],inner:[240,240,236],tie:[40,40,46]},hat:{paint:ml_bowler([36,36,40])},breath:0.24},
  captain:{name:"Captain",key:"ml-captain",skin:[176,124,92],hair:{style:"bun",c:[30,24,24]},top:{kind:"shirt",c:[240,242,244],paint:ml_epaulettes},breath:0.28},
  officer:{name:"First officer",key:"ml-officer",skin:[232,198,170],hair:{style:"cropped",c:[120,112,108]},top:{kind:"shirt",c:[238,240,242],paint:ml_epaulettes},breath:0.3}
};

/* ---------------------------------------------------------------- Sperry's box, cut open
   ml_box(ctx, x, y, s, o): the case's middle at (x, y); s = 1 a case 560 px wide. In it, two pairs of gyroscopes, brass wheels spinning
   in their rings, their axes (graphite, with an arrow) always upright, however the case tips (o.tilt, radians, clockwise); between the
   pairs, room for something more (o.empty 0 to 1: a dashed violet circle, empty, where a model would go). On the lid, a spirit level
   (o.level 0 to 1), its bubble running to the high end as the case tips. A lever from the gyroscopes opens a valve on the case's side
   (o.air 0 to 1: a puff, and air running down the hose) and drives a piston (o.push 0 to 1), whose rod turns a wing's hinged edge; the
   wing is drawn side on, right of the box, and doesn't tip (o.chain 0 to 1 shows the hose, the piston and the wing). o.t spins the
   wheels; o.hands (0 to 1) lights the piston and its rod blue; o.check (0 to 1) lights the gyroscopes' rings in o.checkCol; o.plane
   (0 to 1) a small aeroplane from behind above the lid, tipping with the case. Returns where its parts are in the frame, for labels. */
function ml_box(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a,P=ML_P,t=o.t||0,tilt=o.tilt||0,c0=Math.cos(tilt),s0=Math.sin(tilt);
  const Wp=(lx,ly)=>[x+s*(lx*c0-ly*s0),y+s*(lx*s0+ly*c0)],Fp=(lx,ly)=>[x+s*lx,y+s*ly],GY=[[-176,-66],[-176,66],[176,-66],[176,66]];
  const push=clamp(o.push||0,0,1),flap=o.flap==null?-0.34*push:o.flap,chain=o.chain==null?1:o.chain,hk=o.hands||0;
  const out={gyros:GY.map(p=>Wp(p[0],p[1])),mid:Wp(0,0),r:s*92,level:Wp(0,-190),top:Wp(0,-160),plane:Wp(0,-268),valve:Wp(308,96),
    piston:Fp(630,172),edge:Fp(868,96),wing:Fp(720,86),left:Wp(-280,0),right:Wp(280,0),bottom:Wp(0,160)};
  if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const ink="#4A4744",metal=[118,118,122],blueM=mix(metal,AG.blue,hk);
  // the wing, side on, its hinged edge, the piston and the hose (they don't tip: they're drawn as a diagram beside the box)
  if(chain>0){ctx.save();ctx.globalAlpha*=chain;ctx.translate(x,y);ctx.scale(s,s);
    // the hose, from the valve on the case's side, sagging, to the piston
    const v=[(308+22)*c0-(104)*s0,(308+22)*s0+(104)*c0],hose=[v[0],v[1],v[0]+70,v[1]+120,470,196,560,172];
    ctx.strokeStyle="rgba(70,68,66,1)";ctx.lineWidth=9;ag_bzPath(ctx,hose,0,1);ctx.stroke();
    ctx.strokeStyle="rgba(150,148,146,0.6)";ctx.lineWidth=3;ag_bzPath(ctx,hose,0.02,0.98);ctx.stroke();
    if((o.air||0)>0){for(let k=0;k<5;k++){const u=clamp(o.air*1.3-k*0.12,0,1);if(u<=0||u>=1)continue;const q=ag_bz(hose,u);
      ctx.fillStyle="rgba(248,250,252,"+(0.95*Math.sin(u*Math.PI))+")";ctx.beginPath();ctx.arc(q[0],q[1],5,0,TAU);ctx.fill();}}
    // the wing's section: rounded at the front, thin at the back, its last part on a hinge
    const wing=c=>{c.moveTo(600,98);c.bezierCurveTo(600,74,626,68,664,68);c.bezierCurveTo(730,68,790,82,824,90);c.lineTo(824,104);
      c.bezierCurveTo(780,106,700,112,650,112);c.bezierCurveTo(618,112,600,108,600,98);c.closePath();};
    ag_soft(ctx,wing,P.linenDk,[255,252,240],700,72,140,"rgba(80,70,50,0.35)",8,0.8);ctx.strokeStyle="rgba(110,98,76,0.6)";ctx.lineWidth=2;ag_shape(ctx,wing);ctx.stroke();
    ctx.save();ctx.translate(826,97);ctx.rotate(flap);
    const edge=c=>{c.moveTo(0,-7);c.lineTo(92,-1.5);c.quadraticCurveTo(95,0,92,1.5);c.lineTo(0,7);c.closePath();};
    ag_soft(ctx,edge,mix(P.linenDk,blueM,hk*0.35),[255,252,240],40,-4,60,"rgba(80,70,50,0.35)",4,0.8);ctx.strokeStyle="rgba(110,98,76,0.6)";ctx.lineWidth=2;ag_shape(ctx,edge);ctx.stroke();
    ctx.strokeStyle=rgba(blueM,1);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,75);ctx.stroke();   // the horn under the hinge
    ctx.restore();ctx.fillStyle=ink;ctx.beginPath();ctx.arc(826,97,6,0,TAU);ctx.fill();
    const hx=826-75*Math.sin(flap),hy=97+75*Math.cos(flap);
    // the piston: a cylinder on its bracket, its rod out to the horn
    ctx.fillStyle="rgba(90,88,86,1)";ctx.beginPath();ag_rect(ctx,590,194,80,14,4);ctx.fill();
    ag_soft(ctx,c=>ag_rect(c,560,150,140,44,12),blueM,[236,242,246],660,154,90,"rgba(0,0,0,0.3)",8,0.55);
    ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=2;for(const dx of [586,674]){ctx.beginPath();ctx.moveTo(dx,154);ctx.lineTo(dx,190);ctx.stroke();}
    ctx.strokeStyle=rgba(mix([150,150,154],AG.blue,hk),1);ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(700,172);ctx.lineTo(hx,hy);ctx.stroke();
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(hx,hy,6,0,TAU);ctx.fill();
    if(hk>0){ctx.save();ctx.shadowColor=rgba(AG.blue,0.6*hk);ctx.shadowBlur=18;ctx.strokeStyle=rgba(AG.blue,0.9*hk);ctx.lineWidth=3;ctx.beginPath();ag_rect(ctx,560,150,140,44,12);ctx.stroke();ctx.restore();}
    ctx.restore();}
  // the case, tipping: the small aeroplane above it, the level on its lid, the box with its front cut away, its brass corners, the valve
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(tilt);
  if((o.plane||0)>0){ctx.save();ctx.globalAlpha*=o.plane;ml_boatBack(ctx,0,-268,0.3,{t});ctx.restore();}
  if((o.level||0)>0){ctx.save();ctx.globalAlpha*=o.level;ctx.fillStyle="rgba(120,90,50,1)";for(const lx of [-84,84]){ctx.beginPath();ag_rect(ctx,lx-10,-170,20,14,3);ctx.fill();}
    ml_level(ctx,0,-192,236,clamp(-tilt*7,-1,1),1);ctx.restore();}
  const caseP=c=>ag_rect(c,-280,-160,560,320,20),inner=c=>ag_rect(c,-254,-134,508,268,10);
  ag_soft(ctx,caseP,[136,92,60],[206,160,116],170,-150,330,"rgba(30,14,4,0.5)",18,0.5);
  ctx.strokeStyle="rgba(255,230,200,0.16)";ctx.lineWidth=2;for(const yy of [-148,-142,146,150]){ctx.beginPath();ctx.moveTo(-262,yy);ctx.quadraticCurveTo(0,yy+(yy<0?3:-3),262,yy);ctx.stroke();}
  ag_soft(ctx,inner,[234,226,210],[252,249,242],150,-100,330,null);ag_inner(ctx,inner,"rgba(60,40,20,0.42)",26,-8,10);
  for(const [cx,cy] of [[-280,-160],[280,-160],[-280,160],[280,160]]){ag_soft(ctx,c=>c.arc(cx,cy,15,0,TAU),P.brass,[255,240,200],cx+5,cy-6,14,"rgba(60,40,10,0.4)",4,0.8);}
  // the gyroscopes' rings, fixed in the case
  for(const [gx,gy] of GY){ctx.strokeStyle=rgba(P.brassDk,1);ctx.lineWidth=7;ctx.beginPath();ctx.arc(gx,gy,54,0,TAU);ctx.stroke();
    ctx.strokeStyle="rgba(255,236,190,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,gy,54,-1.4,0.2);ctx.stroke();
    ctx.fillStyle=rgba(P.brassDk,1);for(const sd of [-1,1]){ctx.beginPath();ag_rect(ctx,gx+sd*54-(sd>0?0:16),gy-6,16,12,3);ctx.fill();}}
  if((o.check||0)>0){const cc=o.checkCol||AG.green;ctx.save();ctx.shadowColor=rgba(cc,0.6*o.check);ctx.shadowBlur=16;ctx.strokeStyle=rgba(cc,0.95*o.check);ctx.lineWidth=5;
    for(const [gx,gy] of GY){ctx.beginPath();ctx.arc(gx,gy,62,0,TAU);ctx.stroke();}ctx.restore();}
  // where a model would go: room between the pairs, a dashed violet circle, empty
  if((o.empty||0)>0){ctx.save();ctx.globalAlpha*=o.empty;ctx.fillStyle="rgba(250,248,252,0.75)";ctx.beginPath();ctx.arc(0,0,92,0,TAU);ctx.fill();
    ctx.setLineDash([14,12]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(AG.violet,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,92,0,TAU);ctx.stroke();ctx.restore();}
  // the valve on the case's right side, its stem moved by the lever
  ag_soft(ctx,c=>ag_rect(c,284,78,48,44,8),P.brass,[255,240,200],320,84,40,"rgba(60,40,10,0.4)",6,0.8);
  ctx.fillStyle=rgba(P.brassDk,1);ctx.beginPath();ag_rect(ctx,322,94,18,16,4);ctx.fill();
  if((o.air||0)>0){const k=Math.sin(clamp(o.air,0,1)*Math.PI);ctx.fillStyle="rgba(250,252,254,"+(0.8*k)+")";for(let j=0;j<4;j++){ctx.beginPath();ctx.arc(318+j*10+o.air*30,70-j*14-o.air*16,6+j*3,0,TAU);ctx.fill();}}
  ctx.restore();
  // the wheels and their axes, which stay upright: spinning brass, a little from above, with their blur
  for(const [gx,gy] of out.gyros){ctx.save();ctx.translate(gx,gy);ctx.scale(s,s);
    const g=ctx.createLinearGradient(-44,0,44,0);g.addColorStop(0,rgba(P.brassDk,1));g.addColorStop(0.62,rgba(P.brass,1));g.addColorStop(1,rgba(ag_lt(P.brass,0.45),1));
    ctx.fillStyle=rgba(ag_dk(P.brassDk,0.25),1);ctx.beginPath();ctx.ellipse(0,5,44,12,0,0,TAU);ctx.fill();
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,44,12,0,0,TAU);ctx.fill();
    for(let k=0;k<4;k++){const ph=t*17+k*1.57;ctx.strokeStyle="rgba(255,246,222,0.5)";ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,0,34,8.5,0,ph,ph+0.9);ctx.stroke();}
    ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-56);ctx.lineTo(0,60);ctx.stroke();ag_arrowHead(ctx,0,-62,-Math.PI/2,10,ink);
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();ctx.restore();}
  // the lever: from the lowest right axis's foot, which stays put, to the valve's stem on the case, which tips: it moves as the case tips
  {const g=out.gyros[3],foot=[g[0],g[1]+60*s],stem=Wp(286,100),piv=Wp(240,128);ctx.strokeStyle=ink;ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(foot[0],foot[1]);ctx.lineTo(piv[0],piv[1]);ctx.lineTo(stem[0],stem[1]);ctx.stroke();
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(piv[0],piv[1],6*s,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(foot[0],foot[1],5*s,0,TAU);ctx.fill();}
  ctx.restore();return out;}
// a spirit level: a glass tube in a brass case, its bubble sliding (b, -1 to 1; 0 is level), centred at (x, y), w wide
function ml_level(ctx,x,y,w,b,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>ag_rect(c,x-w/2,y-26,w,52,14),ML_P.brass,[255,236,190],x+w*0.2,y-20,w*0.6,"rgba(60,40,10,0.35)",8);
  const g=ctx.createLinearGradient(0,y-14,0,y+14);g.addColorStop(0,"rgba(214,234,214,1)");g.addColorStop(1,"rgba(168,198,170,1)");ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x-w/2+16,y-14,w-32,28,14);ctx.fill();
  ctx.strokeStyle="rgba(50,60,50,0.7)";ctx.lineWidth=2;for(const d of [-22,22]){ctx.beginPath();ctx.moveTo(x+d,y-14);ctx.lineTo(x+d,y+14);ctx.stroke();}
  const bx=x+clamp(b,-1,1)*(w/2-50);ctx.fillStyle="rgba(250,255,250,0.95)";ctx.beginPath();ctx.ellipse(bx,y-1,18,9,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.9)";ctx.beginPath();ctx.ellipse(bx+5,y-4,6,3,0,0,TAU);ctx.fill();
  ctx.restore();}

/* ---------------------------------------------------------------- today: an airliner's flight deck, seen from the side and a little behind
   The captain's seat near us, the first officer's beyond it, both facing the windscreen on the right; daylight in the windscreen, a
   plain panel of screens under its shade, no airline's name or colours. ml_deckFront draws the side console over the pilots' waists. */
const ML_DECK={cut:842,cap:[640,630,0.88],fo:[1010,590,0.74]};   // where the captain and the first officer sit: (x, y, s) for ag_person
AG_PLACES.mlDeck=c=>{
  // the cabin's wall and ceiling: pale warm greys, lighter towards the windscreen
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgb(150,150,152)");g.addColorStop(0.55,"rgb(196,196,196)");g.addColorStop(1,"rgb(220,220,218)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(60,60,66,0.35)");g.addColorStop(0.3,"rgba(60,60,66,0)");g.addColorStop(1,"rgba(40,40,46,0.25)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // a side window behind the captain's seat, the same sky in it
  const side=cc=>{cc.moveTo(60,352);cc.bezierCurveTo(150,330,300,318,400,322);cc.lineTo(404,560);cc.bezierCurveTo(300,566,170,580,74,600);cc.closePath();};
  c.save();ag_shape(c,side);c.clip();g=c.createLinearGradient(0,320,0,600);g.addColorStop(0,"rgb(160,190,216)");g.addColorStop(0.8,"rgb(214,226,234)");g.addColorStop(1,"rgb(240,242,242)");
  c.fillStyle=g;c.fillRect(40,300,380,320);c.fillStyle="rgba(255,255,255,0.7)";for(const [x,y,r] of [[110,560,40],[180,552,52],[260,560,44],[330,548,56],[400,556,40]]){c.beginPath();c.ellipse(x,y,r*1.6,r*0.7,0,0,TAU);c.fill();}
  c.restore();c.strokeStyle="rgb(70,72,78)";c.lineWidth=16;c.lineJoin="round";ag_shape(c,side);c.stroke();
  // the windscreen: two panes leaning back, the sky in them, soft cloud tops below
  const pane=cc=>{cc.moveTo(1150,250);cc.lineTo(1960,96);cc.lineTo(1960,560);cc.lineTo(1200,560);cc.closePath();};
  c.save();ag_shape(c,pane);c.clip();g=c.createLinearGradient(0,96,0,560);g.addColorStop(0,"rgb(150,184,214)");g.addColorStop(0.75,"rgb(204,220,232)");g.addColorStop(1,"rgb(236,240,242)");
  c.fillStyle=g;c.fillRect(1100,60,900,520);
  const [b,bx]=ag_buf("mlDeckCloud",240,130);const R=ag_rnd(41);bx.fillStyle="rgba(255,255,255,0.9)";
  for(let k=0;k<26;k++){const x=R()*260-10,y=96+R()*30,r=8+R()*16;bx.beginPath();bx.ellipse(x,y,r*1.8,r,0,0,TAU);bx.fill();}
  for(let k=0;k<8;k++){const x=R()*240,y=30+R()*40,r=6+R()*8;bx.fillStyle="rgba(255,255,255,0.45)";bx.beginPath();bx.ellipse(x,y,r*3,r*0.8,0,0,TAU);bx.fill();}
  c.filter="blur(3px)";c.drawImage(b,1100,40,960,520);c.filter="none";
  c.restore();
  c.strokeStyle="rgb(58,60,66)";c.lineWidth=20;c.lineJoin="round";ag_shape(c,pane);c.stroke();
  c.lineWidth=16;c.beginPath();c.moveTo(1560,172);c.lineTo(1590,560);c.stroke();   // the post between the panes
  // the ceiling's panel, sloping down to the windscreen, rows of small switches
  const roof=cc=>{cc.moveTo(560,0);cc.lineTo(1960,0);cc.lineTo(1960,92);cc.lineTo(1150,246);cc.bezierCurveTo(980,230,760,120,560,0);cc.closePath();};
  ag_soft(c,roof,[92,94,100],[150,152,160],1500,40,500,"rgba(0,0,0,0.4)",20,0.5);
  c.fillStyle="rgba(210,214,220,0.55)";for(let r=0;r<3;r++)for(let k=0;k<26;k++){const x=1000+k*34+r*12,y=40+r*30-(k*34)*0.08;if(x>1900)continue;c.beginPath();c.arc(x,y+((x-1000)*-0.02),3,0,TAU);c.fill();}
  // the shade over the panel, and the panel of plain screens under it, seen at a slant
  const shade=cc=>{cc.moveTo(1130,560);cc.bezierCurveTo(1300,540,1700,536,1960,540);cc.lineTo(1960,604);cc.bezierCurveTo(1700,600,1320,606,1150,618);cc.closePath();};
  const panel=cc=>{cc.moveTo(1150,612);cc.lineTo(1960,598);cc.lineTo(1960,860);cc.lineTo(1190,860);cc.closePath();};
  ag_soft(c,panel,[78,80,86],[130,132,140],1700,640,400,"rgba(0,0,0,0.45)",18,0.5);
  for(const [x0,w] of [[1240,190],[1470,190],[1700,190]]){const sx=x0,sy=640+(x0-1240)*-0.012;
    const scr=cc=>{cc.moveTo(sx,sy);cc.lineTo(sx+w,sy-3);cc.lineTo(sx+w+8,sy+150);cc.lineTo(sx+6,sy+154);cc.closePath();};
    ag_soft(c,scr,[30,34,42],[70,84,104],sx+w*0.7,sy+20,160,null);c.save();ag_shape(c,scr);c.clip();
    if(x0===1240){c.fillStyle="rgba(92,140,190,0.55)";c.fillRect(sx,sy,w+10,74);c.fillStyle="rgba(150,110,80,0.5)";c.fillRect(sx,sy+74,w+10,90);
      c.strokeStyle="rgba(255,255,255,0.7)";c.lineWidth=3;c.beginPath();c.moveTo(sx+50,sy+76);c.lineTo(sx+w-44,sy+74);c.stroke();}
    else{c.strokeStyle="rgba(150,190,220,0.45)";c.lineWidth=2;for(let k=0;k<4;k++){c.beginPath();c.moveTo(sx+20,sy+30+k*30);c.lineTo(sx+w-30,sy+28+k*30);c.stroke();}}
    c.restore();c.strokeStyle="rgba(20,20,24,0.8)";c.lineWidth=4;ag_shape(c,scr);c.stroke();}
  ag_soft(c,shade,[46,48,54],[96,98,106],1600,556,400,null);
  // the seats' backs: the captain's near us, the first officer's beyond (the pilots are drawn over them)
  for(const [x,y,s] of [ML_DECK.fo,ML_DECK.cap]){const seat=cc=>{cc.moveTo(x-190*s,y-330*s);cc.bezierCurveTo(x-70*s,y-350*s,x-40*s,y-260*s,x-40*s,y-120*s);
      cc.lineTo(x-30*s,y+400*s);cc.lineTo(x-250*s,y+400*s);cc.bezierCurveTo(x-270*s,y+60*s,x-260*s,y-300*s,x-190*s,y-330*s);cc.closePath();};
    ag_soft(c,seat,[64,64,70],[120,120,128],x-80*s,y-260*s,260*s,"rgba(0,0,0,0.45)",16,0.5);
    c.strokeStyle="rgba(150,150,160,0.25)";c.lineWidth=3;c.beginPath();c.moveTo(x-210*s,y-150*s);c.quadraticCurveTo(x-130*s,y-166*s,x-52*s,y-150*s);c.stroke();}
};
function ml_deckFront(ctx){const cy=ML_DECK.cut;const con=cc=>{cc.moveTo(0,cy);cc.bezierCurveTo(500,cy-14,1300,cy-10,1960,cy-4);cc.lineTo(1960,H);cc.lineTo(0,H);cc.closePath();};
  ag_soft(ctx,con,[70,72,78],[134,136,144],1300,cy+10,700,"rgba(0,0,0,0.4)",18,0.5);
  ctx.strokeStyle="rgba(200,204,212,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,cy+6);ctx.bezierCurveTo(500,cy-8,1300,cy-4,1960,cy+2);ctx.stroke();
}

/* ---------------------------------------------------------------- a typical flight, on a card: by hand at take-off and landing, the autopilot between
   ml_timeline(ctx, x, y, w, k, o): the bar's left end at (x, y), w long; k (0 to 1) draws it on from the left; o.labels (0 to 1). */
function ml_timeline(ctx,x,y,w,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||k<=0)return;ctx.save();ctx.globalAlpha*=a;
  const sl=Math.max(30,w*0.026),h=30,dk=AG.ink,blue=AG.blue,lab=o.labels==null?1:o.labels;
  ctx.save();ctx.beginPath();ctx.rect(x-20,y-200,(w+40)*clamp(k,0,1),400);ctx.clip();
  ctx.fillStyle=rgba(blue,0.88);ctx.beginPath();ag_rect(ctx,x+sl+4,y-h/2,w-2*sl-8,h,h/2);ctx.fill();
  ctx.fillStyle=rgba(dk,0.9);for(const sx of [x,x+w-sl]){ctx.beginPath();ag_rect(ctx,sx,y-h/2,sl,h,6);ctx.fill();}
  ctx.restore();
  if(lab>0){const la=clamp(lab,0,1);
    ag_T(ctx,"take-off",x,y+58,{w:600,size:30,col:AG.mut,a:la});ag_T(ctx,"landing",x+w,y+58,{w:600,size:30,col:AG.mut,a:la,align:"right"});
    ag_T(ctx,"autopilot",x+w/2,y+58,{w:700,size:32,col:blue,a:la,align:"center"});
    for(const [sx,al] of [[x+sl/2,"left"],[x+w-sl/2,"right"]]){ctx.strokeStyle=rgba(dk,0.8*la);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx,y-h/2-8);ctx.lineTo(sx,y-h/2-34);ctx.stroke();
      ag_T(ctx,"by hand",sx+(al==="left"?-10:10),y-h/2-50,{w:700,size:30,col:dk,a:la,align:al});}}
  ctx.restore();}

/* ---------------------------------------------------------------- Sperry at the controls, close up
   ml_cockpit(ctx, t, o): the sky and the river beyond, tipping by o.roll (radians: when the aeroplane tips, the world does), the
   upper wing's edge and two struts, the pilot with both hands on the wheel (o.turn, radians, turns it, and his hands go with it; o.lift
   straightens his back, 0 to 1; o.nod), the hull's edge in front; o.gust (0 to 1) blows wind lines in from the left. o.who (a spec
   from ML_PEOPLE, Sperry by default), o.rest (0 to 1: the hands leave the wheel and rest on the hull's edge), o.raise (0 to 1: they
   let go and rise, open), o.mate (his mechanic beside him, o.mateGaze). */
const ML_PIT={x:840,y:612,s:1.15,wheel:[566,730,118],edge:900,mate:[1460,596,0.92]};
// the two-jointed arm's angles (degrees, from straight down, forwards positive) that put a wrist at T, the elbow below (up: the elbow
// on the other side, out behind a raised hand): figure space;
// ml_grip puts the fist there instead (the wrist a little short of it, along the forearm)
function ml_grip(J,T){const a=ml_ik(J,T),r=a[1]*Math.PI/180,f=AG_FIG.fore;return ml_ik(J,[T[0]-Math.sin(r)*58*f,T[1]-Math.cos(r)*58]);}
function ml_ik(J,T,up){const f=AG_FIG.fore,L1=AG_FIG.L1,L2=AG_FIG.L2,jx=J[0]/f,tx=T[0]/f,dx=tx-jx,dy=T[1]-J[1],d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1);
  const ph=Math.atan2(dx,dy),al=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),a1=up?ph+al:ph-al,ex=jx+Math.sin(a1)*L1,ey=J[1]+Math.cos(a1)*L1;
  return[a1*180/Math.PI,Math.atan2(tx-ex,T[1]-ey)*180/Math.PI];}
function ml_cockpit(ctx,t,o){o=o||{};const P=ML_P,roll=o.roll||0,turn=o.turn||0,[wx,wy,wr]=ML_PIT.wheel;
  // the world beyond, tipping about the frame's middle
  ctx.save();ctx.translate(960,560);ctx.rotate(-roll);ctx.scale(1.16,1.16);ctx.translate(-960,-560);ctx.drawImage(ag_place("mlSky"),0,0);ctx.restore();
  // the wind: soft lines streaming in from the left
  if((o.gust||0)>0){const g=o.gust;ctx.save();ctx.lineCap="round";for(let k=0;k<7;k++){const y=230+k*86+Math.sin(k*2.3)*30,u=(t*0.9+k*0.37)%1,x0=-300+u*2400;
      ctx.strokeStyle="rgba(255,255,255,"+(0.55*g*Math.sin(u*Math.PI))+")";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y);ctx.bezierCurveTo(x0+120,y-14,x0+240,y+10,x0+380,y-6);ctx.stroke();}ctx.restore();}
  // the upper wing overhead, its linen underside and ribs, and a strut on each side
  const wing=c=>{c.moveTo(-20,0);c.lineTo(1940,0);c.lineTo(1940,56);c.bezierCurveTo(1300,72,620,72,-20,62);c.closePath();};
  ag_soft(ctx,wing,P.linenDk,[255,250,236],1500,40,700,"rgba(80,70,50,0.35)",14,0.6);
  ctx.strokeStyle="rgba(140,128,100,0.4)";ctx.lineWidth=2;for(let k=0;k<12;k++){const x=40+k*170;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+(x-960)*0.04,64);ctx.stroke();}
  for(const [x0,x1] of [[64,30],[1760,1810]]){const st=c=>{c.moveTo(x0-12,60);c.lineTo(x0+12,60);c.lineTo(x1+16,1080);c.lineTo(x1-16,1080);c.closePath();};
    ag_soft(ctx,st,P.strut,ag_lt(P.strut,0.4),x0+20,300,400,"rgba(40,24,10,0.4)",8,0.5);}
  ctx.strokeStyle="rgba(70,64,58,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(64,110);ctx.lineTo(-60,640);ctx.moveTo(1760,110);ctx.lineTo(1960,640);ctx.stroke();
  // the pilot, his hands on the wheel's rim, wherever it has turned
  const J=AG_FIG.shoulder,rim=a=>[wx+Math.cos(a)*wr*0.7,wy+Math.sin(a)*wr],lift=o.lift||0,rest=ag_sine(clamp(o.rest||0,0,1)),edgeF=596+(ML_PIT.edge-6-ML_PIT.y)/ML_PIT.s;
  const nT=rim(Math.PI-0.12+turn),fT=rim(0.22+turn),nG=ml_grip(J.near,nT),fG=ml_grip(J.far,fT),nR=ml_ik(J.near,[372,edgeF]),fR=ml_ik(J.far,[640,edgeF+4]);
  // beside him and a little further off, his mechanic, his hands on the cockpit's edge (drawn first: he's further away)
  if(o.mate){const [mx,my,ms]=ML_PIT.mate,eM=596+(ML_PIT.edge-6-my)/ms,mn=ml_ik(J.near,[372,eM]),mf=ml_ik(J.far,[640,eM+4]);
    ag_person(ctx,o.mate,mx,my,ms,{t,pose:{near:[mn[0],mn[1],"rest"],far:[mf[0],mf[1],"rest"]},covered:true,gaze:o.mateGaze||[2,-0.6],smile:0.12});}
  // his hands: on the wheel, resting on the edge, or (o.raise 0 to 1) let go, open in front of him (to 0.3), then raised beside his
  // head, the near elbow out behind him
  const rr=clamp(o.raise||0,0,1),r1=ag_sine(clamp(rr/0.3,0,1)),r2=ag_sine(clamp((rr-0.3)/0.7,0,1)),wrap=(a,b)=>b-a>180?b-360:b-a<-180?b+360:b;
  const go=(S,F,U)=>{const m=[lerp(S[0],wrap(S[0],F[0]),r1),lerp(S[1],wrap(S[1],F[1]),r1)];return[lerp(m[0],wrap(m[0],U[0]),r2),lerp(m[1],wrap(m[1],U[1]),r2)];};
  const nH=go([lerp(nG[0],nR[0],rest),lerp(nG[1],nR[1],rest)],[30,150],ml_ik(J.near,[80,360],true)),fH=go([lerp(fG[0],fR[0],rest),lerp(fG[1],fR[1],rest)],[40,150],ml_ik(J.far,[520,330]));
  const kind=r1>0.5?"open":rest>0.5?"rest":"hold",pose={near:[nH[0],nH[1],kind],far:[fH[0],fH[1],kind]};
  ag_person(ctx,o.who||ML_PEOPLE.sperry,ML_PIT.x,ML_PIT.y-lift*10,ML_PIT.s,{t,pose,covered:true,nod:(o.nod||0)-lift*0.04,gaze:[2,-1],smile:0.05,
    holdBack:(c,h)=>{c.save();c.translate(0,lift*10/ML_PIT.s);
      // the wheel's column, then the wheel seen at a slant: a wooden rim, three spokes, a brass hub
      c.strokeStyle="rgba(60,52,46,1)";c.lineWidth=22;c.lineCap="round";c.beginPath();c.moveTo(wx+10,wy+20);c.lineTo(wx+40,wy+420);c.stroke();
      c.lineWidth=20;c.strokeStyle=rgba(P.hull,1);c.beginPath();c.ellipse(wx,wy,wr*0.7,wr,0,0,TAU);c.stroke();
      c.lineWidth=5;c.strokeStyle=rgba(P.hullHi,0.8);c.beginPath();c.ellipse(wx,wy,wr*0.7,wr,0,-1.2,0.4);c.stroke();
      c.strokeStyle="rgba(70,62,56,1)";c.lineWidth=9;for(let k=0;k<3;k++){const a=turn+k*TAU/3-Math.PI/2;c.beginPath();c.moveTo(wx,wy);c.lineTo(wx+Math.cos(a)*wr*0.66,wy+Math.sin(a)*wr*0.94);c.stroke();}
      c.fillStyle=rgba(P.brass,1);c.beginPath();c.ellipse(wx,wy,16,20,0,0,TAU);c.fill();c.restore();}});
  // the hull's edge in front of him: varnished wood under a padded leather rim
  const e=ML_PIT.edge,hull=c=>{c.moveTo(-20,e+14);c.bezierCurveTo(600,e-6,1300,e-8,1940,e+20);c.lineTo(1940,H);c.lineTo(-20,H);c.closePath();};
  ag_soft(ctx,hull,P.hull,P.hullHi,1400,e+40,700,"rgba(30,16,6,0.45)",18,0.5);
  ctx.strokeStyle="rgba(255,226,190,0.16)";ctx.lineWidth=2;for(let k=1;k<5;k++){const y=e+30+k*44;ctx.beginPath();ctx.moveTo(-20,y+10);ctx.bezierCurveTo(600,y-6,1300,y-6,1940,y+20);ctx.stroke();}
  ctx.strokeStyle="rgba(58,40,30,1)";ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(-20,e+12);ctx.bezierCurveTo(600,e-8,1300,e-10,1940,e+18);ctx.stroke();
  ctx.strokeStyle="rgba(140,100,76,0.5)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-20,e+4);ctx.bezierCurveTo(600,e-16,1300,e-18,1940,e+10);ctx.stroke();}

/* ---------------------------------------------------------------- the judges' table, close up, under the tent
   mlTable: the tent's canvas behind, its scalloped edge above, the river through the open side on the right (a place); the judges sit
   at ML_TABLE.judges (x, y, s for ag_person) and ml_tableFront draws the table's white cloth over their waists. */
const ML_TABLE={top:838,judges:[[600,650,0.86],[1010,638,0.82]]};
AG_PLACES.mlTable=c=>{const P=ML_P;
  // through the open side: the river's light and the far bank, soft
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(224,228,226)");g.addColorStop(0.55,"rgb(206,214,210)");g.addColorStop(1,"rgb(176,188,182)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(150,166,152,0.6)";c.beginPath();c.moveTo(1380,520);for(let x=1380;x<=1940;x+=40)c.lineTo(x,500-14*Math.sin(x*0.03)-10*Math.sin(x*0.071));c.lineTo(1940,560);c.lineTo(1380,560);c.closePath();c.fill();
  c.fillStyle="rgba(170,190,182,0.9)";c.fillRect(1380,560,560,520);
  // the tent's back wall: cream canvas, its seams, soft folds, darker away from the open side
  const wall=cc=>{cc.moveTo(0,0);cc.lineTo(1420,0);cc.bezierCurveTo(1400,300,1440,700,1400,H);cc.lineTo(0,H);cc.closePath();};
  ag_soft(c,wall,[226,220,204],[250,246,236],1200,300,900,null);
  c.save();ag_shape(c,wall);c.clip();g=c.createLinearGradient(0,0,1420,0);g.addColorStop(0,"rgba(90,80,60,0.28)");g.addColorStop(1,"rgba(90,80,60,0)");c.fillStyle=g;c.fillRect(0,0,1420,H);
  for(let k=0;k<7;k++){const x=120+k*200;c.strokeStyle="rgba(150,136,110,0.35)";c.lineWidth=3;c.beginPath();c.moveTo(x,90);c.bezierCurveTo(x+10,400,x-8,700,x+6,H);c.stroke();
    c.strokeStyle="rgba(255,252,244,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(x+5,90);c.bezierCurveTo(x+15,400,x-3,700,x+11,H);c.stroke();}
  c.restore();
  // the scalloped edge of the roof, and a pole on each side of the opening
  const val=cc=>{cc.moveTo(-20,0);cc.lineTo(1940,0);cc.lineTo(1940,70);for(let x=1940;x>-20;x-=120){cc.quadraticCurveTo(x-60,120,x-120,70);}cc.closePath();};
  ag_soft(c,val,[240,236,226],[255,255,250],1500,30,800,"rgba(80,70,50,0.3)",14,0.6);
  for(const x of [60,1420]){ag_soft(c,cc=>ag_rect(cc,x-11,70,22,H,8),P.timberDk,P.timber,x+6,300,300,"rgba(40,24,10,0.4)",6,0.6);}
};
function ml_tableFront(ctx){const y=ML_TABLE.top,cloth=c=>{c.moveTo(-20,y);c.lineTo(1940,y-6);c.lineTo(1940,H);c.lineTo(-20,H);c.closePath();};
  ag_soft(ctx,cloth,[222,218,206],[246,244,236],1300,y+20,900,"rgba(80,70,50,0.3)",16,0.6);
  ctx.strokeStyle="rgba(170,160,140,0.35)";ctx.lineWidth=3;for(const x of [240,700,1180,1640]){ctx.beginPath();ctx.moveTo(x,y+40);ctx.bezierCurveTo(x+8,y+120,x-6,y+200,x+4,H);ctx.stroke();}
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(-20,y-4,1960,8);}

/* ---------------------------------------------------------------- the danger, without a crash: an aeroplane from behind, tipped, slipping away
   ml_slip(ctx, x, y, w, h, k, o): a diagram inside the box (x, y, w, h): the water along its foot, and the aeroplane from behind (o.s,
   0.6 by default), tipped by o.roll, sliding sideways and down as k goes 0 to 1, tipping further, a dotted path behind it; it fades out
   well before the water, and so does the path. */
function ml_slip(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const wy=y+h-56;let g=ctx.createLinearGradient(0,wy,0,y+h);g.addColorStop(0,rgba(ML_P.water0,1));g.addColorStop(1,rgba(ML_P.water1,1));
  ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x+30,wy,w-60,40,20);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.lineWidth=2;for(let i=0;i<5;i++){const xx=x+80+i*(w-160)/4;ctx.beginPath();ctx.moveTo(xx,wy+14);ctx.lineTo(xx+40,wy+14);ctx.stroke();}
  const px=x+w*0.3,py=y+h*0.3,path=[px,py,px+w*0.16,py+30,px+w*0.34,py+h*0.2,px+w*0.44,wy-40],e=0.8*clamp(k,0,1);
  const n=30;for(let i=0;i<n;i++){const u=i/(n-1)*0.8;if(u>e-0.04)break;const q=ag_bz(path,u),fade=1-sstep(0.45,0.78,u);if(fade<=0.02)continue;
    ctx.fillStyle=rgba(AG.ink,0.7*fade);ctx.beginPath();ctx.arc(q[0],q[1]+40,6,0,TAU);ctx.fill();}
  const q=ag_bz(path,e);ml_boatBack(ctx,q[0],q[1],o.s||0.6,{roll:(o.roll==null?0.36:o.roll)+0.5*e,t:o.t||0,heads:true,a:1-sstep(0.52,0.76,e)});
  ctx.restore();}
