/* ===== Explaining so people can decide: the opening, 1950 to 1952 =====
   The United States Air Force's survey of 1950, the designers' average man, Gilbert Daniels's count of 1952 and his note, and the
   cockpits designed for a range. Drawn in the module's matte language, lit from the right like the team's rooms, so the dissolve into the
   room at the end carries the light across. Nothing is a likeness: the people are of their time, drawn in this film's own style, and
   the note is typed again, in its own words, not copied as a picture. No jet and no radio, in the picture or the sound.
   Every top-level name starts with ed_ or ED_ (this film's own); the module's kit is never changed for it. */

/* ---------------------------------------------------------------- the places */
// the measuring room of 1950: a buff wall, its lower part painted a little darker, a slim rail between
AG_PLACES.edLab=c=>{lp_paintRoom(c,{light:"day",seed:7,base:[220,210,186]});
  c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(226,218,204)";c.fillRect(0,560,W,354);c.restore();
  c.fillStyle="rgba(255,250,240,0.4)";c.fillRect(0,556,W,2);c.fillStyle=rgba(LP.shade,0.22);c.fillRect(0,558,W,6);};
// Daniels's office, 1952, on a morning
AG_PLACES.edOffice=c=>lp_paintRoom(c,{light:"morning",seed:9,base:[222,212,192]});
// the designers' drawing office, in the late light
AG_PLACES.edDraw=c=>lp_paintRoom(c,{light:"late",seed:11,base:[224,214,196]});

/* ---------------------------------------------------------------- the people of 1950 to 1952
   Of their time: a flyer in a plain white undershirt, his hair cut short; the measurer and Daniels in shirts and ties (Daniels's the
   Air Force's summer khaki, which reads as beige, never as the module's amber). Each with a key of its own; each looked at full size,
   facing both ways. */
function ed_tie(col){return (c,P)=>{ag_soft(c,cc=>{cc.moveTo(305,618);cc.lineTo(320,616);cc.lineTo(327,640);cc.lineTo(336,800);cc.lineTo(318,832);cc.lineTo(303,800);cc.lineTo(308,642);cc.closePath();},
  col,ag_lt(col,0.28),324,680,90,rgba(ag_dk(col,0.7),0.4),8);
  // the knot, a little darker, under the collar's points
  ag_soft(c,cc=>{cc.moveTo(304,616);cc.lineTo(321,614);cc.lineTo(325,636);cc.lineTo(309,640);cc.closePath();},ag_dk(col,0.1),ag_lt(col,0.2),314,624,20,null);};}
const ED_PEOPLE={
  flyer:{key:"edFlyer",name:"",skin:[228,192,162],hair:{style:"cropped",c:[96,72,50]},top:{kind:"sweater",c:[238,236,230]},breath:0.28},
  measurer:{key:"edMeasurer",name:"",skin:[212,174,144],hair:{style:"side",c:[58,46,40]},glasses:[50,44,40],top:{kind:"shirt",c:[196,192,184],paint:ed_tie([84,70,64])},breath:0.25},
  daniels:{key:"edDaniels",name:"Gilbert Daniels",skin:[230,194,166],hair:{style:"side",c:[72,54,42]},glasses:[44,40,38],top:{kind:"shirt",c:[200,188,156],paint:ed_tie([110,96,70])},breath:0.27}
};
// a record card in the hand: the survey's form, its band orange (data)
function ed_card(c,h){c.save();c.translate(h.near[0]+30,h.near[1]-120);c.rotate(-0.06);
  c.shadowColor="rgba(52,36,30,0.25)";c.shadowBlur=10;c.shadowOffsetX=-5;c.shadowOffsetY=4;c.fillStyle=rgba(LP.paper,1);rr(c,-10,0,150,104,4);c.fill();c.shadowColor="rgba(0,0,0,0)";
  c.fillStyle=rgba(LP.orange,1);c.fillRect(-10,0,150,12);c.strokeStyle=rgba(LP.mut,0.45);c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(4,30+i*15);c.lineTo(i%2?92:122,30+i*15);c.stroke();}c.restore();}

/* ---------------------------------------------------------------- the measuring board on the wall
   A timber board with an inch scale, and the head piece that slides down to rest on the flyer's head. */
function ed_board(ctx,x,top,bot,head,a){a=a==null?1:a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const w=46;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=16;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=8;
  let g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(mix(LP.timber,LP.shade,0.18),1));g.addColorStop(1,rgba(mix(LP.timber,[255,250,240],0.12),1));ctx.fillStyle=g;ctx.fillRect(x,top,w,bot-top);ctx.restore();
  ctx.strokeStyle=rgba(mix(LP.timber,LP.shade,0.6),0.8);ctx.lineCap="butt";for(let y=bot-12,i=0;y>top+8;y-=11,i++){ctx.lineWidth=i%12===0?2.4:1.2;ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w-(i%12===0?26:i%6===0?18:10),y);ctx.stroke();}
  // the head piece: a block on the board and a square arm resting on the head
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.6;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(LP.graphite,1);ctx.fillRect(x-6,head-34,w+12,40);
  g=ctx.createLinearGradient(0,head-12,0,head);g.addColorStop(0,rgba(mix(LP.timber,[255,250,240],0.2),1));g.addColorStop(1,rgba(LP.timber,1));ctx.fillStyle=g;ctx.fillRect(x+w,head-12,190,12);ctx.restore();
  ctx.restore();}

/* ---------------------------------------------------------------- drawings, in the designers' blue
   A drawing is blue lines on a sheet of paper (blue: design), its parts outlined like a draughtsman's jointed template. */
let ED_LW=4;
// a limb or a body part: a capsule outlined in blue, filled pale
function ed_limb(c,x0,y0,x1,y1,r,o){o=o||{};const col=o.col||LP.blue;c.save();c.lineCap="round";c.strokeStyle=rgba(col,o.a==null?1:o.a);c.lineWidth=r*2+ED_LW;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
  c.strokeStyle=o.fill||rgba(mix(LP.paper,col,0.07),1);c.lineWidth=r*2-ED_LW;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();c.restore();}
function ed_disc(c,x,y,r,o){o=o||{};const col=o.col||LP.blue;c.save();c.fillStyle=o.fill||rgba(mix(LP.paper,col,0.07),1);c.strokeStyle=rgba(col,o.a==null?1:o.a);c.lineWidth=ED_LW;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.restore();}
// the designers' average man, from the front: a jointed template h px tall, his feet at y
function ed_manikin(c,cx,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const k=h/7.5,top=y-h;c.save();c.globalAlpha*=a;
  const leg=(s)=>{ed_limb(c,cx+s*0.36*k,top+3.95*k,cx+s*0.42*k,top+5.7*k,0.3*k);ed_limb(c,cx+s*0.42*k,top+5.7*k,cx+s*0.44*k,top+7.25*k,0.24*k);
    ed_limb(c,cx+s*0.44*k,top+7.32*k,cx+s*0.7*k,top+7.38*k,0.12*k);};
  const arm=(s)=>{ed_limb(c,cx+s*0.98*k,top+1.62*k,cx+s*1.12*k,top+3.0*k,0.2*k);ed_limb(c,cx+s*1.12*k,top+3.0*k,cx+s*1.2*k,top+4.1*k,0.17*k);
    ed_disc(c,cx+s*1.22*k,top+4.35*k,0.19*k);};
  leg(-1);leg(1);
  // the torso: shoulders, waist and hips in one outline
  c.save();c.fillStyle=rgba(mix(LP.paper,LP.blue,0.07),1);c.strokeStyle=rgba(LP.blue,1);c.lineWidth=ED_LW;c.lineJoin="round";c.beginPath();
  c.moveTo(cx-1.02*k,top+1.5*k);c.quadraticCurveTo(cx,top+1.32*k,cx+1.02*k,top+1.5*k);c.quadraticCurveTo(cx+0.82*k,top+2.6*k,cx+0.64*k,top+3.1*k);
  c.quadraticCurveTo(cx+0.82*k,top+3.6*k,cx+0.76*k,top+4.1*k);c.quadraticCurveTo(cx,top+4.3*k,cx-0.76*k,top+4.1*k);c.quadraticCurveTo(cx-0.82*k,top+3.6*k,cx-0.64*k,top+3.1*k);
  c.quadraticCurveTo(cx-0.82*k,top+2.6*k,cx-1.02*k,top+1.5*k);c.closePath();c.fill();c.stroke();c.restore();
  arm(-1);arm(1);ed_limb(c,cx,top+0.95*k,cx,top+1.38*k,0.2*k);
  c.save();c.fillStyle=rgba(mix(LP.paper,LP.blue,0.07),1);c.strokeStyle=rgba(LP.blue,1);c.lineWidth=ED_LW;c.beginPath();c.ellipse(cx,top+0.5*k,0.38*k,0.5*k,0,0,TAU);c.fill();c.stroke();c.restore();
  c.restore();}
// a dimension line: arrows at both ends, its label beside it
function ed_dim(c,x,y0,y1,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||LP.blue;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(col,1);c.fillStyle=rgba(col,1);c.lineWidth=3;
  c.beginPath();c.moveTo(x,y0);c.lineTo(x,y1);c.stroke();for(const [yy,d] of [[y0,1],[y1,-1]]){c.beginPath();c.moveTo(x,yy);c.lineTo(x-9,yy+d*18);c.lineTo(x+9,yy+d*18);c.closePath();c.fill();
    c.beginPath();c.moveTo(x-22,yy);c.lineTo(x+22,yy);c.stroke();}
  if(label)lp_T(c,label,x+(o.side==="left"?-24:24),(y0+y1)/2+10,{w:700,size:o.size||30,col,align:o.side==="left"?"right":"left"});c.restore();}

/* ---------------------------------------------------------------- people in a row, under a lintel
   Flyers as plain silhouettes, seen from the front, their heights from the survey's spread: a door built to the average man's height
   makes those taller than him stoop (amber: the risk); a door built for the range lets nine in ten through. hs: heights in inches;
   ppi: px per inch; lintel: the door's height in inches; stoop 0 to 1. */
function ed_glyph(c,x,y,h,o){o=o||{};const col=o.col||[118,104,96],d=(o.duck||0),al=o.a==null?1:o.a;
  // standing, the head's top is at y - h; ducking d px, the head sinks d, the shoulders hunch 0.7 d and the hips 0.3 d (the knees bend)
  const top=y-h+d,sh=y-h+0.17*h+0.7*d,hip=y-h+0.52*h+0.3*d;c.save();c.fillStyle=rgba(col,al);c.strokeStyle=rgba(col,al);c.lineCap="round";c.lineJoin="round";
  c.lineWidth=0.068*h;c.beginPath();for(const sd of [-1,1]){c.moveTo(x+sd*0.042*h,hip);c.lineTo(x+sd*0.048*h,y-0.035*h);}c.stroke();
  // the body, shoulders to hips, and the arms hanging
  c.beginPath();c.moveTo(x-0.11*h,sh+0.01*h);c.quadraticCurveTo(x,sh-0.02*h,x+0.11*h,sh+0.01*h);c.quadraticCurveTo(x+0.1*h,(sh+hip)/2,x+0.088*h,hip);
  c.lineTo(x-0.088*h,hip);c.quadraticCurveTo(x-0.1*h,(sh+hip)/2,x-0.11*h,sh+0.01*h);c.closePath();c.fill();
  c.lineWidth=0.045*h;c.beginPath();for(const sd of [-1,1]){c.moveTo(x+sd*0.112*h,sh+0.03*h);c.lineTo(x+sd*0.128*h,sh+0.32*h);}c.stroke();
  // the neck and the head
  const hy=top+0.068*h;c.lineWidth=0.055*h;c.beginPath();c.moveTo(x,hy+0.05*h);c.lineTo(x,sh+0.005*h);c.stroke();
  if(o.head)c.fillStyle=rgba(o.head,al);c.beginPath();c.ellipse(x,hy,0.052*h,0.066*h,0,0,TAU);c.fill();c.restore();}
// heights in inches at the quantiles of the survey's spread: mean 69 (5 ft 9 in), standard deviation 2.4 (the survey's stature, about 6.1 cm)
function ed_heights(n){const z=p=>{const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.3577518672690,-30.66479806614716,2.506628277459239],
    b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],q=p-0.5,r=q*q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);};
  const out=[];for(let i=0;i<n;i++)out.push(69+2.4*z((i+0.5)/n));return out;}
// a row of flyers under a lintel: o.lintel (inches), o.stoop (0 to 1), o.range [lo, hi] (inches: those inside drawn blue), o.order (a shuffle)
function ed_row(c,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||8,hs=o.hs||ed_heights(n),ppi=o.ppi||4.35,order=o.order||hs.map((_,i)=>i),
    dx=(x1-x0)/n,ly=y-o.lintel*ppi;c.save();c.globalAlpha*=a;
  order.forEach((hi,j)=>{const h=hs[hi]*ppi,px=x0+dx*(j+0.5),tall=hs[hi]>o.lintel+0.05,inR=o.range&&hs[hi]>=o.range[0]&&hs[hi]<=o.range[1];
    const head=tall&&o.risk?mix([118,104,96],LP.amber,clamp(o.risk,0,1)):null,col=o.range?(inR?mix([118,104,96],LP.blue,0.85):[176,166,158]):[118,104,96];
    ed_glyph(c,px,y,h,{duck:tall?(o.stoop||0)*((hs[hi]-o.lintel)*ppi+8):0,head,col});});
  // the door's posts and its lintel
  if(o.lintel){const lu=o.lintelU==null?1:o.lintelU;c.strokeStyle=rgba(LP.blue,1);c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(x0-10,y);c.lineTo(x0-10,ly);c.lineTo(lerp(x0-10,x1+10,lu),ly);if(lu>=1)c.lineTo(x1+10,y);c.stroke();}
  c.strokeStyle=rgba(LP.mut,0.5);c.lineWidth=3;c.beginPath();c.moveTo(x0-40,y+2);c.lineTo(x1+40,y+2);c.stroke();c.restore();}

/* ---------------------------------------------------------------- a cockpit, cut open like an architect's section
   Seen from the side, facing right: the seat, the stick, the rudder pedals, the panel and the canopy. A pilot is a jointed template that
   reaches with two-bone arms and legs: where a hand or a foot can't reach, the limb stretches as far as it goes and the gap is marked
   in amber. Units are px at s = 1; (x, y) is the seat's reference point. o.pilots: [{k (size), dy (the seat raised, px), pedal (moved
   forward, px), col, a}]; o.reach: the control the hand reaches for ("stick" or "switch"); o.gaps: show the gaps (0 to 1);
   o.arrows: the seat's and the pedals' adjustment (0 to 1). */
const ED_CP={stick:[200,-90],switch:[366,-240],pedal:[540,22],panel:[[356,-336],[388,-84]],eye:-473.4};
function ed_ik(a,b,l1,l2,bendUp){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),reach=l1+l2-0.5,dd=Math.min(d,reach),an=Math.atan2(dy,dx);
  const c1=clamp((l1*l1+dd*dd-l2*l2)/(2*l1*dd),-1,1),A=Math.acos(c1)*(bendUp?-1:1),j=[a[0]+Math.cos(an+A)*l1,a[1]+Math.sin(an+A)*l1],
    e=[a[0]+Math.cos(an)*dd,a[1]+Math.sin(an)*dd];return{j,e,gap:d-dd,reached:d<=reach};}
function ed_pilot(c,P,o){const k=P.k,col=P.col||LP.blue,a=P.a==null?1:P.a;if(a<=0.004)return null;c.save();c.globalAlpha*=a;const dy=P.dy||0,lean=0.2;
  const H=[8,-44*k+dy-4],S=[H[0]-Math.sin(lean)*330*k,H[1]-Math.cos(lean)*330*k],hc=[S[0]+16*k,S[1]-96*k],stick=[ED_CP.stick[0],ED_CP.stick[1]],
    tgt=o.reach==="switch"?ED_CP.switch:stick,ped=[ED_CP.pedal[0]+(P.pedal||0),ED_CP.pedal[1]];
  const leg=ed_ik(H,[ped[0]-30,ped[1]-14],255*k,262*k,true),arm=ed_ik([S[0]+10*k,S[1]+18*k],tgt,210*k,230*k,false);
  const fill=rgba(mix(LP.paper,col,0.07),1),q={col,fill};
  ed_limb(c,H[0],H[1],leg.j[0],leg.j[1],34*k,q);ed_limb(c,leg.j[0],leg.j[1],leg.e[0],leg.e[1],26*k,q);ed_limb(c,leg.e[0],leg.e[1],leg.e[0]+50*k,leg.e[1]-6*k,12*k,q);
  ed_limb(c,H[0],H[1],S[0],S[1],50*k,q);ed_limb(c,S[0]+4*k,S[1]-20*k,hc[0]-4*k,hc[1]+40*k,16*k,q);ed_disc(c,hc[0],hc[1],58*k,q);
  ed_limb(c,S[0]+10*k,S[1]+18*k,arm.j[0],arm.j[1],22*k,q);ed_limb(c,arm.j[0],arm.j[1],arm.e[0],arm.e[1],19*k,q);ed_disc(c,arm.e[0],arm.e[1],17*k,q);
  c.restore();return{arm,leg,tgt,ped:[ped[0]-30,ped[1]-14],eye:[hc[0]+26*k,hc[1]-6*k]};}
function ed_cockpit(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);
  // o.lw: every line a little heavier, for a cockpit drawn small (the outlines of the pilot too)
  const lw=o.lw||1,was=ED_LW;ED_LW=4*lw;
  const B=LP.blue,line=(w,al)=>{c.strokeStyle=rgba(B,al==null?1:al);c.lineWidth=w*lw;c.lineCap="round";c.lineJoin="round";};
  // the fuselage and the canopy, cut through: the nose to the right, the canopy over the pilot's head
  const body=()=>{c.beginPath();c.moveTo(-320,150);c.lineTo(640,150);c.quadraticCurveTo(820,140,840,-40);c.quadraticCurveTo(760,-220,430,-330);c.lineTo(250,-560);
    c.quadraticCurveTo(-20,-720,-250,-480);c.quadraticCurveTo(-320,-420,-320,-300);c.closePath();};
  c.save();c.fillStyle=rgba(mix(LP.paper,B,0.05),1);body();c.fill();c.restore();
  line(5);c.beginPath();c.moveTo(-320,150);c.lineTo(640,150);c.quadraticCurveTo(820,140,840,-40);c.quadraticCurveTo(760,-220,430,-330);c.stroke();
  line(4,0.7);c.beginPath();c.moveTo(430,-330);c.lineTo(250,-560);c.quadraticCurveTo(-20,-720,-250,-480);c.quadraticCurveTo(-320,-420,-320,-300);c.stroke();
  // the eye line, where every pilot's eyes should be
  if(o.eye){line(3,0.6*o.eye);c.setLineDash([10,12]);c.beginPath();c.moveTo(-40,ED_CP.eye);c.lineTo(430,ED_CP.eye);c.stroke();c.setLineDash([]);}
  // the floor, the panel, the stick and its pivot
  line(4);c.beginPath();c.moveTo(-180,96);c.lineTo(640,96);c.stroke();
  c.save();c.fillStyle=rgba(mix(LP.paper,B,0.14),1);c.beginPath();c.moveTo(ED_CP.panel[0][0],ED_CP.panel[0][1]);c.lineTo(ED_CP.panel[0][0]+32,ED_CP.panel[0][1]-6);c.lineTo(ED_CP.panel[1][0],ED_CP.panel[1][1]);c.lineTo(ED_CP.panel[1][0]-30,ED_CP.panel[1][1]+6);c.closePath();c.fill();line(4);c.stroke();c.restore();
  c.save();c.fillStyle=rgba(B,1);c.beginPath();c.arc(ED_CP.switch[0]+4,ED_CP.switch[1],9,0,TAU);c.fill();c.restore();
  line(9);c.beginPath();c.moveTo(214,96);c.lineTo(ED_CP.stick[0],ED_CP.stick[1]);c.stroke();ed_disc(c,ED_CP.stick[0],ED_CP.stick[1]-6,14);
  // the seat on its rail: the rail stays, the seat rises and falls with each pilot (o.seats: the raised heights to draw)
  line(3,0.55);c.setLineDash([12,10]);c.beginPath();c.moveTo(-104,-60);c.lineTo(-190,-420);c.stroke();c.setLineDash([]);
  for(const sd of (o.seats||[0])){const al=o.seats&&o.seats.length>1?0.45:1;line(7,al);c.beginPath();c.moveTo(-70,-30+sd);c.lineTo(126,-46+sd);c.moveTo(-70,-30+sd);c.lineTo(-136,-352+sd);c.stroke();}
  line(5,0.8);c.beginPath();c.moveTo(-40,96);c.lineTo(-40,-24+(o.seats?Math.max(...o.seats):0));c.stroke();
  // the pedals, where each pilot has them
  for(const pf of (o.pedals||[0])){const al=o.pedals&&o.pedals.length>1?0.45:1;line(8,al);c.beginPath();c.moveTo(ED_CP.pedal[0]+pf,ED_CP.pedal[1]+52);c.lineTo(ED_CP.pedal[0]+pf+20,ED_CP.pedal[1]-30);c.stroke();}
  // the pilots, then any gap: a hand short of the control, a foot short of the pedal
  const res=(o.pilots||[]).map(P=>({P,r:ed_pilot(c,P,o)}));
  if(o.gaps>0)for(const {r} of res){if(!r)continue;c.save();c.globalAlpha*=o.gaps;c.strokeStyle=rgba(LP.amber,1);c.fillStyle=rgba(LP.amber,1);c.lineWidth=6*lw;c.setLineDash([10*lw,10*lw]);c.lineCap="round";
    for(const [p,q,g] of [[r.arm.e,r.tgt,r.arm.gap],[r.leg.e,r.ped,r.leg.gap]])if(g>6){c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();c.beginPath();c.arc(q[0],q[1],12*lw,0,TAU);c.fill();}c.restore();}
  // the adjustments: the seat up and down along its rail, the pedals fore and aft
  if(o.arrows>0){c.save();c.globalAlpha*=clamp(o.arrows,0,1);ed_arrow2(c,-230,-150,-230,-330,B);ed_arrow2(c,500,150-30,660,150-30,B);c.restore();}
  ED_LW=was;c.restore();return res;}
// a pilot of size k in a cockpit that adjusts: the seat moved so the eyes meet the eye line, the pedals moved to the feet
const ed_fit=k=>({k,dy:469.4*(k-1),pedal:560*(k-1)});
function ed_arrow2(c,x0,y0,x1,y1,col){const an=Math.atan2(y1-y0,x1-x0);c.save();c.strokeStyle=rgba(col,1);c.fillStyle=rgba(col,1);c.lineWidth=7;c.lineCap="round";c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
  for(const [x,y,d] of [[x0,y0,an+Math.PI],[x1,y1,an]]){c.beginPath();c.moveTo(x+Math.cos(d)*14,y+Math.sin(d)*14);c.lineTo(x+Math.cos(d+2.5)*24,y+Math.sin(d+2.5)*24);c.lineTo(x+Math.cos(d-2.5)*24,y+Math.sin(d-2.5)*24);c.closePath();c.fill();}c.restore();}

/* ---------------------------------------------------------------- one measurement's spread, and its middle 30%
   The curve in orange (data) on a sheet; the band Daniels called average shaded under it (the middle 30%, about 0.39 standard deviations
   either side of the mean). u draws the curve; b shades the band. */
function ed_curve(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,b=o.b==null?1:o.b,base=y+h,f=z=>Math.exp(-z*z/2),X=z=>x+w/2+z*w/6.6;c.save();c.globalAlpha*=a;
  if(b>0){c.save();c.globalAlpha*=b;c.fillStyle=rgba(LP.orange,0.3);c.beginPath();c.moveTo(X(-0.385),base);for(let z=-0.385;z<=0.386;z+=0.02)c.lineTo(X(z),base-f(z)*h*0.86);c.lineTo(X(0.385),base);c.closePath();c.fill();
    c.strokeStyle=rgba(LP.orange,1);c.lineWidth=3;for(const z of [-0.385,0.385]){c.beginPath();c.moveTo(X(z),base);c.lineTo(X(z),base-f(z)*h*0.86);c.stroke();}c.restore();}
  c.strokeStyle=rgba(LP.mut,0.6);c.lineWidth=3;c.beginPath();c.moveTo(x,base);c.lineTo(x+w,base);c.stroke();
  if(u>0){c.strokeStyle=rgba(LP.orange,1);c.lineWidth=6;c.lineCap="round";c.beginPath();const z1=lerp(-3.2,3.2,ag_sine(u));for(let z=-3.2;z<=z1;z+=0.04){const px=X(z),py=base-f(z)*h*0.86;if(z===-3.2)c.moveTo(px,py);else c.lineTo(px,py);}c.stroke();}
  c.restore();}

// the flyers' heights, in orange, and the range a design should fit shaded blue: 5 ft 5 in to 6 ft 1 in, nine flyers in ten (b, 0 to 1)
function ed_range(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const b=o.b==null?1:o.b,base=y+h,f=z=>Math.exp(-z*z/2),X=z=>x+w/2+z*w/6.6,lo=-1.645,hi=1.645;c.save();c.globalAlpha*=a;
  if(b>0){c.save();c.globalAlpha*=b;c.fillStyle=rgba(LP.blue,0.22);c.beginPath();c.moveTo(X(lo),base);for(let z=lo;z<=hi+0.001;z+=0.03)c.lineTo(X(z),base-f(z)*h*0.86);c.lineTo(X(hi),base);c.closePath();c.fill();
    c.strokeStyle=rgba(LP.blue,1);c.lineWidth=4;for(const z of [lo,hi]){c.beginPath();c.moveTo(X(z),base+14);c.lineTo(X(z),base-f(z)*h*0.86-30);c.stroke();}
    lp_T(c,"5 ft 5 in",X(lo),base+50,{w:700,size:30,align:"center",col:LP.blue});lp_T(c,"6 ft 1 in",X(hi),base+50,{w:700,size:30,align:"center",col:LP.blue});c.restore();}
  c.strokeStyle=rgba(LP.mut,0.6);c.lineWidth=3;c.beginPath();c.moveTo(x,base);c.lineTo(x+w,base);c.stroke();
  c.strokeStyle=rgba(LP.orange,1);c.lineWidth=6;c.lineCap="round";c.beginPath();for(let z=-3.2;z<=3.2;z+=0.04){const px=X(z),py=base-f(z)*h*0.86;if(z===-3.2)c.moveTo(px,py);else c.lineTo(px,py);}c.stroke();
  c.restore();}

/* ---------------------------------------------------------------- Daniels's count
   4,063 dots, one for each flyer, in orange (data). At each of the ten measurements, those not average on it fade: 1,055 are left,
   then 302, 143, 73, 28, 12, 6, 3, 2, and none. o.steps: ten values 0 to 1, each measurement applied. Beside them, the table: each
   measurement and the men still average on everything so far, row by row. */
const ED_COUNT=[["Height",1055],["Chest",302],["Sleeve",143],["Inside leg",73],["Torso",28],["Hips",12],["Neck",6],["Waist",3],["Thigh",2],["Crotch length",0]];
const ED_N=4063,ED_RANK=(()=>{const R=ag_rnd(1952),r=[];for(let i=0;i<ED_N;i++)r.push(i);for(let i=ED_N-1;i>0;i--){const j=(R()*(i+1))|0;const t=r[i];r[i]=r[j];r[j]=t;}return r;})();
function ed_dots(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const st=o.steps||[],cols=o.cols||79,p=o.pitch||9,r=o.r||3.3;c.save();c.globalAlpha*=a;
  // each dot's last measurement passed: the dot with rank q is average on step k if q < ED_COUNT[k][1]
  const lastK=q=>{let k=0;while(k<10&&q<ED_COUNT[k][1])k++;return k;};
  const groups=[];for(let k=0;k<=10;k++)groups.push(new Path2D());
  for(let i=0;i<ED_N;i++){const q=ED_RANK[i],k=lastK(q),px=x+(i%cols)*p,py=y+Math.floor(i/cols)*p;groups[k].moveTo(px+r,py);groups[k].arc(px,py,r,0,TAU);}
  // a dot fades as the measurement it fails is applied: group k fails at step k (0-based), and stays faint
  for(let k=0;k<=10;k++){const gone=k<10?clamp(st[k]||0,0,1):0,al=lerp(1,0.13,gone);c.fillStyle=rgba(k<10?mix(LP.orange,[150,140,132],gone):LP.orange,al);c.fill(groups[k]);}
  // once only a few are left, a ring round each, so the eye finds them
  const ring=clamp((st[4]||0)*2,0,1);if(ring>0){c.strokeStyle=rgba(LP.orange,1);c.lineWidth=3;for(let i=0;i<ED_N;i++){const q=ED_RANK[i],k=lastK(q);if(k<5)continue;const gone=k<10?clamp(st[k]||0,0,1):0,al=ring*(1-gone);
      if(al<=0.01)continue;c.globalAlpha=a*al;c.beginPath();c.arc(x+(i%cols)*p,y+Math.floor(i/cols)*p,r+8,0,TAU);c.stroke();}c.globalAlpha=a;}
  c.restore();}
function ed_countTable(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const st=o.steps||[],dz=o.deco?1:0;c.save();c.globalAlpha*=a;
  lp_T(c,"Average on",x,y,{w:700,size:28,col:LP.mut,deco:dz});lp_T(c,"Men left",x+380,y,{w:700,size:28,col:LP.mut,align:"right",deco:dz});
  ED_COUNT.forEach(([m,n],i)=>{const u=clamp((st[i]||0)*3,0,1);if(u<=0.004)return;const yy=y+48+i*42;c.save();c.globalAlpha*=u;
    lp_T(c,m,x,yy,{w:600,size:30,deco:dz});lp_T(c,n.toLocaleString("en-US"),x+380,yy,{w:800,size:30,align:"right",col:n===0?LP.amber:LP.orange,deco:dz});c.restore();});
  c.restore();}

/* ---------------------------------------------------------------- the note, typed again
   Technical Note WCRD 53-7, December 1952: its title and the first lines of its introduction, in its own words, typed in mono on a
   sheet; the second sentence underlined as the voice says it (u, 0 to 1). */
const ED_NOTE=["The tendency to think in terms of the","“average man” is a pitfall into which","many persons blunder when attempting","to apply human body size data to design","problems. Actually it is virtually","impossible to find an “average man”","in the Air Force population."];
function ed_note(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const h=o.h||640,bb=lp_sheet(c,x,y,w,h,{a,k:o.k,light:o.light,pin:o.pin,tilt:o.tilt});
  c.save();c.globalAlpha*=a;const cx=x+w/2;
  const dz=o.deco?1:0;lp_T(c,"TECHNICAL NOTE WCRD 53-7",cx,y+76,{w:500,size:28,f:"mono",align:"center",col:LP.mut,deco:dz});
  lp_T(c,"THE “AVERAGE MAN”?",cx,y+146,{w:600,size:40,f:"mono",align:"center",deco:dz});
  lp_T(c,"Gilbert S. Daniels · December 1952",cx,y+200,{w:500,size:28,f:"mono",align:"center",col:LP.mut,deco:dz});
  lp_T(c,"INTRODUCTION",cx,y+270,{w:500,size:28,f:"mono",align:"center",deco:dz});
  ED_NOTE.forEach((l,i)=>lp_T(c,l,x+60,y+330+i*44,{w:500,size:30,f:"mono",deco:dz}));
  // the underline under "Actually it is virtually impossible to find an average man in the Air Force population."
  const u=clamp(o.u||0,0,1);if(u>0){c.strokeStyle=rgba(LP.ink,0.85);c.lineWidth=3.5;c.lineCap="round";const mw=q=>lp_tw(c,q,{w:500,size:30,f:"mono"});
    const segs=[[4,mw("problems. "),mw(ED_NOTE[4])],[5,0,mw(ED_NOTE[5])],[6,0,mw(ED_NOTE[6])]],tot=segs.reduce((s,q)=>s+(q[2]-q[1]),0);let left=u*tot;
    for(const [li,f0,f1] of segs){if(left<=0)break;const d=Math.min(f1-f0,left);left-=d;const ly=y+330+li*44+9;c.beginPath();c.moveTo(x+60+f0,ly);c.lineTo(x+60+f0+d,ly);c.stroke();}}
  c.restore();return bb;}

/* ---------------------------------------------------------------- a car's seat, sliding on its rails (blue: design) */
function ed_carSeat(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const sl=(o.slide||0)*60;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);
  c.strokeStyle=rgba(LP.blue,1);c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(-150,40);c.lineTo(170,40);c.stroke();
  c.save();c.translate(sl,0);c.fillStyle=rgba(mix(LP.paper,LP.blue,0.08),1);c.lineJoin="round";c.lineWidth=6;
  c.beginPath();c.moveTo(-90,10);c.quadraticCurveTo(-96,-14,-70,-18);c.lineTo(70,-26);c.quadraticCurveTo(96,-24,92,4);c.lineTo(84,14);c.closePath();c.fill();c.stroke();
  c.beginPath();c.moveTo(-86,-14);c.lineTo(-130,-196);c.quadraticCurveTo(-130,-222,-104,-222);c.lineTo(-84,-218);c.quadraticCurveTo(-62,-212,-64,-188);c.lineTo(-46,-22);c.closePath();c.fill();c.stroke();
  c.beginPath();c.moveTo(-60,14);c.lineTo(-60,40);c.moveTo(60,10);c.lineTo(60,40);c.stroke();c.restore();
  ed_arrow2(c,-40,82,120,82,LP.blue);c.restore();}
