/* ===== Listen first: Accra, the early 1930s =====
   The film's own place, people and things for its opening story, in the module's matte, sunlit language (prefix lf_). Nothing here is a
   likeness or a copy of a photograph: the clinic, the clothes and the things are drawn from what is known of the time and the place, in
   this film's own style, plain, with no woven or printed patterns and no symbols. The cloths are in colours that mean nothing in the
   module (umber, cream, maroon, charcoal); white is a doctor's coat and a nurse's uniform. No sick child is drawn.
     lfClinic        the clinic room on a morning: whitewashed walls, a window with its plain timber shutters folded back, the light
                     through it, a bench against the wall, a table with a closed book on it
     LF_BOOK         where the closed book lies on the table (for the tag that says what it lacked)
     lf_notebook     Williams' notebook, open in her hand: what lp_person's holdBack draws; o.write (0 to 1) writes the word in it, in
                     pen strokes, not letters (the card says the word)
     LF_PEOPLE       Cicely Williams, a Ga mother with her baby asleep on her back, a grandmother and a nurse: dressed for their time,
                     never likenesses; each looked at full size, facing both ways, on 10 November 2026 */

const LF_K={lime:[238,230,216],sky0:[206,222,230],sky1:[248,242,226],leaf:[150,160,124],leafHi:[194,198,160],leafDk:[110,122,94],
  tim:[148,110,78],timDk:[100,74,54],timHi:[188,152,112],umber:[120,86,62],cream:[228,214,190],maroon:[120,60,56],charcoal:[72,68,68],
  white:[240,238,232],book:[96,66,52],bookHi:[136,100,80]};

/* ---------------------------------------------------------------- the clinic room */
const LF_WIN={x:1488,y:150,w:262,h:470};   // the window in the back wall: its opening; the sill at y + h
const LF_BOOK=[968,768];                   // the closed book on the table: its middle
// the view through the window: a bright morning, a pale sky over the soft tops of trees, washed out by the light
function lf_outside(c,X,Y,Wd,Hd){let g=c.createLinearGradient(0,Y,0,Y+Hd);g.addColorStop(0,rgba(LF_K.sky0,1));g.addColorStop(0.62,rgba(LF_K.sky1,1));g.addColorStop(1,rgba([252,246,232],1));
  c.fillStyle=g;c.fillRect(X,Y,Wd,Hd);const R=ag_rnd(1933);
  // the trees, soft and pale in the glare: blobs of light green-grey along the bottom, nearer ones darker
  for(let k=0;k<26;k++){const x=X-30+R()*(Wd+60),y=Y+Hd*(0.56+R()*0.3),r=34+R()*60,near=R();
    const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(mix(LF_K.leaf,LF_K.leafDk,near*0.5),0.55));q.addColorStop(0.7,rgba(mix(LF_K.leaf,LF_K.leafHi,0.4),0.3));
    q.addColorStop(1,rgba(LF_K.leafHi,0));c.fillStyle=q;c.fillRect(x-r,y-r,2*r,2*r);}
  // the glare of the morning over all of it
  g=c.createLinearGradient(X+Wd,Y,X,Y+Hd);g.addColorStop(0,"rgba(255,250,236,0.55)");g.addColorStop(1,"rgba(255,250,236,0.15)");c.fillStyle=g;c.fillRect(X,Y,Wd,Hd);}
// one leaf of a plain board shutter, folded back flat against the wall: five boards, a little worn, an iron hook
function lf_shutter(c,x,y,w,h,hookLeft){const n=5,bw=w/n,R=ag_rnd(x|0);
  c.save();c.shadowColor="rgba(52,40,36,0.32)";c.shadowBlur=16;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=10;c.fillStyle=rgba(LF_K.tim,1);c.fillRect(x,y,w,h);c.restore();
  for(let i=0;i<n;i++){const bx=x+i*bw,tone=(R()-0.5)*14,g=c.createLinearGradient(bx,0,bx+bw,0);
    g.addColorStop(0,rgba(mix(LF_K.tim,LF_K.timDk,0.3).map(v=>v+tone),1));g.addColorStop(0.5,rgba(LF_K.tim.map(v=>v+tone),1));g.addColorStop(1,rgba(mix(LF_K.tim,LF_K.timHi,0.35).map(v=>v+tone),1));
    c.fillStyle=g;c.fillRect(bx,y,bw,h);
    // the grain: a few long soft lines down each board
    c.strokeStyle=rgba(LF_K.timDk,0.18);c.lineWidth=1.2;for(let k=0;k<3;k++){const gx=bx+bw*(0.2+0.3*k)+R()*4;c.beginPath();c.moveTo(gx,y+4);c.bezierCurveTo(gx+3,y+h*0.3,gx-3,y+h*0.6,gx+2,y+h-4);c.stroke();}
    c.fillStyle=rgba(LF_K.timDk,0.55);c.fillRect(bx+bw-1.5,y,1.5,h);}
  // its edges worn paler, the top lit by the window's light
  c.fillStyle=rgba(LF_K.timHi,0.6);c.fillRect(x,y,w,3);c.fillStyle=rgba(LF_K.timDk,0.35);c.fillRect(x,y+h-4,w,4);
  const hx=hookLeft?x+12:x+w-12;c.fillStyle="rgb(58,54,52)";c.beginPath();c.arc(hx,y+h*0.52,5,0,TAU);c.fill();c.strokeStyle="rgb(58,54,52)";c.lineWidth=3;
  c.beginPath();c.moveTo(hx,y+h*0.52);c.lineTo(hx+(hookLeft?-1:1)*2,y+h*0.52+26);c.stroke();}
function lf_paintClinic(c){const Wn=LF_WIN,X=Wn.x,Y=Wn.y,w=Wn.w,h=Wn.h;
  lp_paintRoom(c,{light:"morning",seed:11,base:LF_K.lime,sun:false});
  // the whitewash round the window, lit by the light that comes through it and bounces off the floor and the sill
  c.save();c.globalCompositeOperation="screen";let g=c.createRadialGradient(X+w/2,Y+h*0.55,40,X+w/2,Y+h*0.55,760);g.addColorStop(0,"rgba(255,236,204,0.42)");
  g.addColorStop(0.45,"rgba(255,232,196,0.16)");g.addColorStop(1,"rgba(255,232,196,0)");c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  // the opening: what's outside, the reveal of the thick wall on its right, the soffit over it, and a timber sill
  lf_outside(c,X,Y,w,h);
  g=c.createLinearGradient(X+w-30,0,X+w,0);g.addColorStop(0,rgba(mix(LF_K.lime,LP.shade,0.12),1));g.addColorStop(1,rgba(mix(LF_K.lime,LP.shade,0.26),1));c.fillStyle=g;
  c.beginPath();c.moveTo(X+w-30,Y+16);c.lineTo(X+w,Y);c.lineTo(X+w,Y+h);c.lineTo(X+w-30,Y+h-10);c.closePath();c.fill();
  g=c.createLinearGradient(0,Y,0,Y+16);g.addColorStop(0,rgba(mix(LF_K.lime,LP.shade,0.3),1));g.addColorStop(1,rgba(mix(LF_K.lime,LP.shade,0.16),1));c.fillStyle=g;
  c.beginPath();c.moveTo(X,Y);c.lineTo(X+w,Y);c.lineTo(X+w-30,Y+16);c.lineTo(X,Y+16);c.closePath();c.fill();
  c.save();c.shadowColor="rgba(52,40,36,0.3)";c.shadowBlur=10;c.shadowOffsetX=LP.sdx*0.5;c.shadowOffsetY=6;c.fillStyle=rgba(LF_K.tim,1);c.fillRect(X-16,Y+h-8,w+32,20);c.restore();
  c.fillStyle=rgba(LF_K.timHi,1);c.fillRect(X-16,Y+h-8,w+32,5);c.fillStyle=rgba(LF_K.timDk,0.6);c.fillRect(X-16,Y+h+9,w+32,3);
  // the shutters, folded back flat against the wall on each side
  lf_shutter(c,X-150,Y-6,134,h+6,false);lf_shutter(c,X+w+16,Y-6,134,h+6,true);
  // the light through the window: its warm pool on the floor below the sill
  c.save();c.globalCompositeOperation="screen";g=c.createRadialGradient(X-60,990,20,X-60,990,460);g.addColorStop(0,"rgba(255,226,180,0.42)");g.addColorStop(1,"rgba(255,226,180,0)");
  c.fillStyle=g;c.fillRect(X-560,900,1000,180);c.restore();
  // a plain timber bench against the wall, behind where the mothers stand
  const bx0=100,bx1=760,by=752;c.fillStyle=rgba(LP.shade,0.14);c.fillRect(bx0+LP.sdx,by+18,bx1-bx0,936-by-18);
  for(const lx of [bx0+40,bx1-60]){c.fillStyle=rgba(mix(LF_K.tim,LP.shade,0.35),1);c.fillRect(lx,by+16,20,936-by-12);}
  g=c.createLinearGradient(0,by,0,by+20);g.addColorStop(0,rgba(LF_K.timHi,1));g.addColorStop(1,rgba(mix(LF_K.tim,LP.shade,0.2),1));c.fillStyle=g;c.fillRect(bx0,by,bx1-bx0,20);
  c.fillStyle=rgba(LP.shade,0.16);c.beginPath();c.ellipse((bx0+bx1)/2+LP.sdx*3,944,(bx1-bx0)*0.5,12,0,0,TAU);c.fill();
  // the table, a closed book on it and an enamel cup
  lp_table(c,800,816,340,{depth:56});lf_book(c,LF_BOOK[0],LF_BOOK[1]);lf_cup(c,1088,782);}
AG_PLACES.lfClinic=c=>lf_paintClinic(c);
// a closed, thick book lying on the table, its cloth cover a plain dark brown, its pages' edge towards us
function lf_book(c,x,y){const w=150,d=26,th=30;c.save();
  c.fillStyle=rgba(LP.shade,0.22);c.beginPath();c.ellipse(x+LP.sdx,y+th*0.5+6,w*0.56,10,0,0,TAU);c.fill();
  // the pages' edge, then the cover's top, a little in perspective
  c.fillStyle=rgba([238,230,212],1);c.fillRect(x-w/2+4,y-th/2+6,w-8,th-10);c.strokeStyle="rgba(150,136,116,0.5)";c.lineWidth=1;for(let k=0;k<5;k++){c.beginPath();c.moveTo(x-w/2+6,y-th/2+9+k*4);c.lineTo(x+w/2-6,y-th/2+9+k*4);c.stroke();}
  c.fillStyle=rgba(LF_K.book,1);c.fillRect(x-w/2,y+th/2-6,w,6);
  let g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(LF_K.book,1));g.addColorStop(1,rgba(LF_K.bookHi,1));c.fillStyle=g;
  c.beginPath();c.moveTo(x-w/2+8,y-th/2-d+6);c.lineTo(x+w/2-8,y-th/2-d+6);c.lineTo(x+w/2,y-th/2+6);c.lineTo(x-w/2,y-th/2+6);c.closePath();c.fill();
  c.strokeStyle="rgba(214,190,140,0.55)";c.lineWidth=1.5;c.beginPath();c.moveTo(x-w/2+20,y-th/2-d+12);c.lineTo(x+w/2-20,y-th/2-d+12);c.stroke();c.restore();}
// a white enamel cup with a dark rim
function lf_cup(c,x,y){c.save();c.fillStyle=rgba(LP.shade,0.2);c.beginPath();c.ellipse(x+LP.sdx*0.6,y+30,30,7,0,0,TAU);c.fill();
  const g=c.createLinearGradient(x-24,0,x+24,0);g.addColorStop(0,"rgb(214,212,206)");g.addColorStop(1,"rgb(250,248,242)");c.fillStyle=g;c.beginPath();c.moveTo(x-24,y);c.lineTo(x-20,y+30);c.lineTo(x+20,y+30);c.lineTo(x+24,y);c.closePath();c.fill();
  c.strokeStyle="rgb(62,64,72)";c.lineWidth=3;c.beginPath();c.ellipse(x,y,24,5,0,0,TAU);c.stroke();c.lineWidth=4;c.beginPath();c.arc(x+26,y+14,9,-1.2,1.2);c.stroke();c.restore();}

/* ---------------------------------------------------------------- Williams' notebook, in her hand */
// figure space, at the near hand's grip; o.write 0 to 1: the word written on the right page in pen strokes; o.a its opacity
const lf_grip=h=>{const [x,y]=h.near,e=h.nearElbow,L=Math.hypot(x-e[0],y-e[1])||1;return[x+(x-e[0])/L*54,y+(y-e[1])/L*54];};
function lf_notebook(c,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||!h)return;const [x,y]=lf_grip(h);c.save();c.globalAlpha*=a;c.translate(x+34,y-14);c.rotate(-0.16);
  // the board covers, then the two pages, open towards us
  c.save();c.shadowColor="rgba(40,30,24,0.35)";c.shadowBlur=10;c.shadowOffsetX=-4;c.shadowOffsetY=6;c.fillStyle=rgba([70,60,54],1);
  c.beginPath();c.moveTo(-86,-62);c.lineTo(0,-54);c.lineTo(88,-64);c.lineTo(92,58);c.lineTo(0,66);c.lineTo(-90,56);c.closePath();c.fill();c.restore();
  for(const s of [-1,1]){const g=c.createLinearGradient(0,0,s*84,0);g.addColorStop(0,"rgb(222,212,192)");g.addColorStop(0.2,"rgb(244,238,224)");g.addColorStop(1,"rgb(248,244,234)");c.fillStyle=g;
    c.beginPath();c.moveTo(0,-50);c.quadraticCurveTo(s*40,-60,s*82,-58);c.lineTo(s*86,54);c.quadraticCurveTo(s*42,56,0,62);c.closePath();c.fill();}
  // the lines already written on the left page: soft grey strokes
  c.strokeStyle="rgba(70,64,60,0.45)";c.lineWidth=2;c.lineCap="round";for(let k=0;k<6;k++){const yy=-38+k*15,l=50+((k*37)%22);c.beginPath();c.moveTo(-76,yy+1);c.quadraticCurveTo(-76+l/2,yy-1,-76+l,yy+1.5);c.stroke();}
  // the word, written on the right page as the mothers say it: a pen's line drawing itself
  const u=clamp(o.write||0,0,1);if(u>0){c.strokeStyle="rgba(30,34,64,0.9)";c.lineWidth=2.6;c.beginPath();const n=Math.floor(60*u);
    for(let i=0;i<=n;i++){const v=i/60,px=10+v*66,py=-14+Math.sin(v*TAU*5.2)*5+Math.sin(v*TAU*1.3)*2;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
    if(u>0.95){c.lineWidth=2;c.beginPath();c.moveTo(12,2);c.lineTo(72,0);c.stroke();}}
  c.restore();}

/* ---------------------------------------------------------------- the people of Accra, for lp_person
   Cicely Williams, about forty, short waved hair, a white coat over a plain dress; a Ga mother, her baby asleep on her back in a cloth
   tied across her chest, and a grandmother with a cloth over her shoulder, each in a plain blouse and a head tie; a nurse in a white
   uniform and cap. The head ties and the cap stay inside the head's picture (figure x 160 to 440, y 250 to 560); the baby and the
   cloths are painted with the body. Their hands hold only Williams' notebook. */
// a head tie: cloth wrapped close over the hair from the brow to the nape, the ear left clear, its two ends tucked at the back of the head
// and flaring up a little, as a tie is knotted; low: its lower edge covers the temple and the hair by the ear
function lf_tie(col,low){return(c,P)=>{const hi=ag_lt(col,0.3),dk=ag_dk(col,0.45),ly=low?18:0;
  // the two ends first, behind the wrap: short tapered tails from the knot at the back of the head, one a little up, one down
  const ends=cc=>{cc.moveTo(226,296);cc.bezierCurveTo(206,290,186,288,170,296);cc.bezierCurveTo(186,302,206,310,224,316);cc.closePath();
    cc.moveTo(222,312);cc.bezierCurveTo(204,320,190,332,180,346);cc.bezierCurveTo(198,342,214,334,230,324);cc.closePath();};
  ag_soft(c,ends,ag_dk(col,0.08),hi,214,300,40,rgba(dk,0.5),6);
  const f=cc=>{cc.moveTo(390,352);cc.bezierCurveTo(394,316,370,280,326,268);cc.bezierCurveTo(284,258,240,268,218,296);cc.bezierCurveTo(200,320,198,362,204,402);
    cc.bezierCurveTo(208,428,216,446,228,456+ly*0.5);cc.bezierCurveTo(236,436+ly,244,414+ly,256,398+ly);cc.bezierCurveTo(272,380+ly*0.6,300,368,330,360);cc.bezierCurveTo(354,354,374,352,390,352);cc.closePath();};
  ag_soft(c,f,col,hi,350,282,140,rgba(dk,0.5),14);
  // the knot: a soft twist where the ends meet the wrap
  ag_soft(c,cc=>cc.ellipse(222,306,17,15,-0.4,0,TAU),ag_dk(col,0.1),hi,226,298,18,rgba(dk,0.5),6);
  c.save();ag_shape(c,f);c.clip();c.lineCap="round";
  // the folds where it wraps: soft lines sweeping from the brow back to the knot, a light edge along the front
  for(const [a,b,d2,w] of [[[384,320],[320,286],[250,296],3],[[386,340],[316,318],[236,316],2.6],[[350,356],[288,352],[232,380],2.4],[[300,274],[264,282],[236,300],2]]){
    c.strokeStyle=rgba(dk,0.42);c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(b[0],b[1],d2[0],d2[1]);c.stroke();
    c.strokeStyle=rgba(hi,0.35);c.lineWidth=w*0.6;c.beginPath();c.moveTo(a[0]+1,a[1]-4);c.quadraticCurveTo(b[0]+1,b[1]-4,d2[0]+1,d2[1]-4);c.stroke();}
  c.strokeStyle=rgba(hi,0.55);c.lineWidth=3;c.beginPath();c.moveTo(390,350);c.bezierCurveTo(360,352,320,358,290,370);c.stroke();c.restore();};}
// the years in a face: soft lines at the eye's outer corner and from the nose's wing to the mouth, drawn over the head's picture
function lf_years(c,P){const ln=rgba(mix(P.skin,[40,16,8],0.55),0.34);c.save();ag_shape(c,AG_F.head);c.clip();c.strokeStyle=ln;c.lineCap="round";c.lineWidth=2.2;
  c.beginPath();c.moveTo(352,466);c.quadraticCurveTo(344,482,346,498);c.stroke();
  c.lineWidth=1.8;c.beginPath();c.moveTo(322,432);c.quadraticCurveTo(334,438,348,432);c.stroke();
  c.beginPath();c.moveTo(306,414);c.lineTo(296,410);c.moveTo(307,421);c.lineTo(297,422);c.stroke();c.restore();}
// a nurse's cap: a starched white band across the head above the hairline, and the white cloth of the cap behind it, over the crown
// and down to the nape, falling straight, not tied
function lf_cap(c,P){const wh=[246,244,238],sh=[192,190,186];
  const veil=cc=>{cc.moveTo(372,300);cc.bezierCurveTo(360,272,320,258,282,262);cc.bezierCurveTo(240,268,212,296,204,336);cc.bezierCurveTo(196,380,198,430,210,470);
    cc.bezierCurveTo(222,462,234,452,242,440);cc.bezierCurveTo(246,410,250,380,262,356);cc.bezierCurveTo(290,330,330,318,372,318);cc.closePath();};
  ag_soft(c,veil,ag_dk(wh,0.04),[255,255,255],330,276,120,rgba(sh,0.85),12);
  c.save();ag_shape(c,veil);c.clip();c.strokeStyle=rgba(sh,0.7);c.lineWidth=2;c.lineCap="round";
  for(const [a,b,d2] of [[[260,300],[226,340],[218,440]],[[300,290],[250,330],[236,420]]]){c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(b[0],b[1],d2[0],d2[1]);c.stroke();}c.restore();
  const band=cc=>{cc.moveTo(240,334);cc.bezierCurveTo(268,310,320,298,376,302);cc.lineTo(374,322);cc.bezierCurveTo(322,318,272,328,246,350);cc.closePath();};
  ag_soft(c,band,wh,[255,255,255],340,300,80,rgba(sh,0.85),6);
  c.strokeStyle=rgba(sh,0.9);c.lineWidth=1.6;c.beginPath();c.moveTo(246,342);c.bezierCurveTo(272,320,322,310,374,312);c.stroke();}
// Williams' hair, waved as women wore it short in the early 1930s: soft waves across the crown, over the kit's bob
function lf_waves(c,P){const hi=ag_lt(P.hair.c,0.4),dk=ag_dk(P.hair.c,0.35);c.save();ag_shape(c,AG_HAIR.bob);c.clip();c.lineCap="round";
  for(const [y0,k] of [[300,1],[324,0.85],[350,0.7]]){c.strokeStyle=rgba(dk,0.45*k);c.lineWidth=4;c.beginPath();c.moveTo(250,y0+16);
    c.bezierCurveTo(280,y0-6,300,y0+22,330,y0+2);c.bezierCurveTo(350,y0-10,370,y0+10,388,y0+4);c.stroke();
    c.strokeStyle=rgba(hi,0.4*k);c.lineWidth=2.4;c.beginPath();c.moveTo(252,y0+10);c.bezierCurveTo(282,y0-12,302,y0+16,332,y0-4);c.bezierCurveTo(352,y0-16,372,y0+4,388,y0-2);c.stroke();}
  c.restore();}
// the mother's back-cloth: tied across her chest over the blouse, the baby asleep on her back, its head on her shoulder behind her neck,
// turned outwards, its eyes closed. Painted with the body: the baby and the cloth round it behind everything already painted
// (destination-over), the band across her chest in front
function lf_baby(col,skin){return(c,P)=>{const hi=ag_lt(col,0.28),dk=ag_dk(col,0.45),sk=skin,hair=[26,22,20],ln=rgba(mix(sk,[30,10,6],0.6),0.8);
  c.save();c.globalCompositeOperation="destination-over";c.translate(150,560);c.scale(1.12,1.12);c.translate(-150,-560);
  // nearest first, since each goes behind what's there: the face's lines, the hair, the head, then the cloth round the baby
  c.strokeStyle=ln;c.lineWidth=2.2;c.lineCap="round";
  c.beginPath();c.moveTo(104,538);c.quadraticCurveTo(112,543,121,539);c.stroke();                       // the closed eye
  c.lineWidth=1.6;c.beginPath();c.moveTo(106,541);c.lineTo(103,545);c.moveTo(111,543);c.lineTo(109,547);c.moveTo(116,543);c.lineTo(115,547);c.stroke();
  c.lineWidth=2;c.beginPath();c.moveTo(97,567);c.quadraticCurveTo(101,569,105,567);c.stroke();          // the mouth
  ag_soft(c,cc=>{cc.moveTo(150,556);cc.bezierCurveTo(144,546,152,538,160,544);cc.bezierCurveTo(166,550,164,564,156,566);cc.closePath();},ag_dk(sk,0.12),ag_lt(sk,0.2),154,548,12,null); // the ear
  // the hair: close curls over the crown and the back of the head, from the brow round to the nape
  const hairP=cc=>{cc.moveTo(100,512);cc.bezierCurveTo(112,490,150,482,178,496);cc.bezierCurveTo(198,508,204,540,196,566);cc.bezierCurveTo(190,582,178,590,166,590);
    cc.bezierCurveTo(170,570,168,544,150,532);cc.bezierCurveTo(134,522,114,520,100,512);cc.closePath();};
  c.save();ag_shape(c,hairP);c.clip();const R=ag_rnd(7);c.fillStyle=rgba(ag_lt(hair,0.25),0.22);for(let i=0;i<70;i++){c.beginPath();c.arc(100+R()*104,484+R()*108,1.2+R()*1.2,0,TAU);c.fill();}c.restore();
  c.fillStyle=rgba(hair,1);ag_shape(c,hairP);c.fill();
  // the head and face in profile, turned outwards: brow, a small nose, a full cheek resting on the cloth
  const head=cc=>{cc.moveTo(100,512);cc.bezierCurveTo(90,520,88,532,90,542);cc.bezierCurveTo(86,548,84,554,88,557);cc.bezierCurveTo(90,560,94,560,95,562);
    cc.bezierCurveTo(94,570,98,578,106,582);cc.bezierCurveTo(118,592,146,596,170,590);cc.bezierCurveTo(196,580,206,548,196,520);cc.bezierCurveTo(186,492,150,480,120,490);cc.bezierCurveTo(110,494,104,502,100,512);cc.closePath();};
  ag_soft(c,head,mix(sk,ag_dk(sk,0.35),0.25),mix(sk,[255,236,220],0.3),112,560,60,rgba(mix(sk,[40,14,6],0.6),0.4),12);
  c.translate(150,560);c.scale(1/1.12,1/1.12);c.translate(-150,-560);
  // the cloth round the baby: its edge at the baby's neck, its hump behind the mother's near shoulder and arm
  const hump=cc=>{cc.moveTo(226,600);cc.bezierCurveTo(200,584,150,580,104,590);cc.bezierCurveTo(60,604,34,650,34,720);cc.bezierCurveTo(34,790,60,850,110,886);cc.lineTo(210,880);cc.closePath();};
  ag_soft(c,hump,col,hi,130,600,170,rgba(dk,0.5),18);
  c.restore();
  // the cloth's edge over the baby's back, in front of its neck: a soft roll of cloth
  ag_soft(c,cc=>{cc.moveTo(84,600);cc.bezierCurveTo(110,584,160,584,200,594);cc.lineTo(196,612);cc.bezierCurveTo(156,604,112,606,80,620);cc.closePath();},col,hi,150,592,60,rgba(dk,0.45),8);
  // the band across her chest, over the blouse: its top edge rising a little to the far side, its end tucked in at the middle
  c.save();ag_shape(c,AG_F.torso);c.clip();
  const band=cc=>{cc.moveTo(60,694);cc.bezierCurveTo(160,684,300,678,440,666);cc.lineTo(440,738);cc.bezierCurveTo(300,750,160,758,60,768);cc.closePath();};
  ag_soft(c,band,col,hi,360,690,180,rgba(dk,0.5),14);
  c.strokeStyle=rgba(dk,0.38);c.lineWidth=2.4;c.lineCap="round";for(const dy of [24,46]){c.beginPath();c.moveTo(80,694+dy);c.bezierCurveTo(180,686+dy,300,680+dy,430,670+dy);c.stroke();}
  ag_soft(c,cc=>{cc.moveTo(300,684);cc.bezierCurveTo(318,690,330,712,326,744);cc.bezierCurveTo(314,724,300,706,286,698);cc.closePath();},ag_dk(col,0.12),hi,316,700,30,rgba(dk,0.5),6);
  c.restore();};}
// the grandmother's cloth, worn over her near shoulder and across her body to the far hip, over a dark blouse
function lf_shoulderCloth(col){return(c,P)=>{const hi=ag_lt(col,0.3),dk=ag_dk(col,0.45);c.save();ag_shape(c,AG_F.torso);c.clip();
  const f=cc=>{cc.moveTo(236,568);cc.bezierCurveTo(274,640,350,760,440,880);cc.lineTo(440,1010);cc.bezierCurveTo(330,880,220,760,110,640);cc.bezierCurveTo(150,610,196,586,236,568);cc.closePath();};
  ag_soft(c,f,col,hi,330,700,220,rgba(dk,0.45),18);
  c.strokeStyle=rgba(dk,0.35);c.lineWidth=2.6;c.lineCap="round";for(const [a,b,d2] of [[[200,600],[290,720],[410,880]],[[160,630],[260,760],[380,920]],[[140,660],[230,790],[330,930]]]){
    c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(b[0],b[1],d2[0],d2[1]);c.stroke();}
  c.restore();};}
const LF_PEOPLE={
  williams:{name:"Cicely Williams",role:"Doctor, from Jamaica",key:"lf-williams",skin:[234,198,172],hair:{style:"bob",c:[82,60,46]},
    top:{kind:"blazer",c:[236,233,226],inner:[112,86,72]},hat:{paint:lf_waves},breath:0.27},
  mother:{name:"A Ga mother",key:"lf-mother",skin:[98,64,46],hair:{style:"cropped",c:[24,20,18]},top:{kind:"tunic",c:LF_K.cream,paint:lf_baby(LF_K.umber,[104,68,50])},
    hat:{paint:lf_tie(LF_K.maroon)},breath:0.3},
  grandmother:{name:"A grandmother",key:"lf-grandmother",skin:[90,60,44],hair:{style:"shaved",c:[178,174,168]},top:{kind:"tunic",c:LF_K.charcoal,paint:lf_shoulderCloth(LF_K.cream)},
    hat:{paint:(c,P)=>{lf_years(c,P);lf_tie(LF_K.umber,true)(c,P);}},breath:0.25},
  nurse:{name:"A nurse",key:"lf-nurse",skin:[106,70,50],hair:{style:"side",c:[26,22,20]},top:{kind:"tunic",c:LF_K.white},hat:{paint:lf_cap},breath:0.29}
};
// in the clinic, people stand near the wall in the morning light
const LF_LIGHT={light:"morning",warm:0.14,shade:0.2,wall:0.14};
