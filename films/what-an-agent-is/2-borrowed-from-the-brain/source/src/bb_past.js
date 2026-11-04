/* ===== Borrowed from the brain: the past =====
   The places of the opening and of the story, painted once, full-frame, matte and soft-lit from the right (AG_PLACES):
     bbNavy      1958: a laboratory's plain room, where the perceptron stands
     bbSheet     a sheet of drawing paper on a walnut table, seen from above, with an ink pot and a pen
     bbSky       an open sky over low hills, where buzzards soar
     bbDunes     the dunes at Kitty Hawk, 1902, under a wide sky
     bbMaple     a maple's branch in autumn, against a soft park
     bbBrain     a brain, drawn as an anatomy book would, on a warm dark ground
     bbLens      looking down a microscope: a round field on the dark
     bbRoom      Barcelona, 1888: Cajal's room, his table, microscope, slides, ink and paper, light from the window on the right
     bbWard      1888: a ward's corner, a chair by the window
     bbBerlin    Berlin, 1889: a long table of microscopes
     bbHall      Stockholm, 1906: a hall with a stage
   What moves is drawn live: the people, the birds and the glider, the seeds, the stained cells, the ink. */

/* ---------------------------------------------------------------- the people of the story (ag_person specs) */
// a moustache over the upper lip, in figure space (painted with the head, over it, so it turns and nods with the face): under the
// nose's tip, its near side wider, as the face turns three-quarters, its ends drooping a little past the corners of the mouth
const bb_stache=(col)=>(c,P)=>{c.save();c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(333,491);c.bezierCurveTo(334,478,344,469,358,467);c.bezierCurveTo(368,465,378,466,385,469);
  c.bezierCurveTo(391,472,393,480,390,487);c.bezierCurveTo(386,482,380,479,372,479);c.bezierCurveTo(362,479,352,481,344,485);c.bezierCurveTo(340,487,336,489,333,491);c.closePath();c.fill();
  c.strokeStyle=rgba(mix(col,[0,0,0],0.3),0.4);c.lineWidth=1.4;c.lineCap="round";for(let k=0;k<6;k++){const x=346+k*7;c.beginPath();c.moveTo(x,470+Math.abs(k-2.5)*0.6);c.lineTo(x-3,479);c.stroke();}
  c.fillStyle="rgba(255,255,255,0.16)";c.beginPath();c.ellipse(366,470,12,2.6,-0.05,0,TAU);c.fill();c.restore();};
const BB_CAST={
  rosenblatt:{key:"bb_rosenblatt",name:"Frank Rosenblatt",skin:[232,198,170],hair:{style:"side",c:[42,34,30]},top:{kind:"suit",c:[78,82,92],inner:[240,240,234],tie:[58,62,86]},breath:0.27},
  cajal:{key:"bb_cajal",name:"Santiago Ramón y Cajal",skin:[222,184,150],hair:{style:"side",c:[34,28,26]},beard:[40,32,28],top:{kind:"suit",c:[48,44,46],inner:[238,232,218],tie:[30,28,32]},breath:0.26},
  cajal06:{key:"bb_cajal06",name:"Santiago Ramón y Cajal",skin:[220,182,150],hair:{style:"side",c:[110,104,100]},beard:[132,126,120],top:{kind:"suit",c:[40,40,46],inner:[240,238,232],tie:[28,28,34]},breath:0.25},
  golgi:{key:"bb_golgi",name:"Camillo Golgi",skin:[230,196,170],hair:{style:"cropped",c:[214,210,204]},top:{kind:"suit",c:[44,44,52],inner:[242,240,236],tie:[34,34,40]},hat:{paint:bb_stache([226,222,214])},breath:0.24},
  golgi88:{key:"bb_golgi88",name:"Camillo Golgi",skin:[230,196,170],hair:{style:"cropped",c:[58,46,40]},top:{kind:"suit",c:[52,50,56],inner:[240,236,228],tie:[38,36,42]},hat:{paint:bb_stache([62,48,40])},breath:0.24},
  kolliker:{key:"bb_kolliker",name:"Albert von Kölliker",skin:[232,200,178],hair:{style:"cropped",c:[222,220,216]},beard:[226,224,220],top:{kind:"suit",c:[38,40,48],inner:[240,240,236],tie:[30,30,36]},breath:0.22},
  anat:{key:"bb_anat",name:"An anatomist",skin:[226,190,160],hair:{style:"side",c:[96,74,56]},top:{kind:"suit",c:[70,66,62],inner:[238,234,226],tie:[52,46,44]},hat:{paint:bb_stache([92,70,54])},breath:0.27},
  patient:{key:"bb_patient",name:"A patient",skin:[218,180,150],hair:{style:"cropped",c:[150,146,140]},top:{kind:"overshirt",c:[132,120,104],inner:[230,224,210]},breath:0.3},
  hebb:{key:"bb_hebb",name:"Donald Hebb",skin:[232,198,172],hair:{style:"side",c:[92,80,70]},glasses:[50,46,44],top:{kind:"suit",c:[96,90,84],inner:[238,236,230],tie:[86,62,58]},breath:0.26},
  doctor:{key:"bb_doctor",name:"A doctor",skin:[230,196,168],hair:{style:"side",c:[122,72,44]},top:{kind:"suit",c:[60,66,80],inner:[238,234,226],tie:[46,52,70]},breath:0.27}
};

/* ---------------------------------------------------------------- shared painting: plaster, a window, floorboards */
function bb_wall(c,col,y0,y1,seed){const g=c.createLinearGradient(0,y0,W,y1);g.addColorStop(0,rgba(mix(col,[60,50,40],0.12),1));g.addColorStop(0.7,rgba(col,1));g.addColorStop(1,rgba(mix(col,[255,250,240],0.25),1));
  c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);ag_grain(c,0,y0,W,y1-y0,1.6,seed||3);
  // soft patches in the plaster
  const R=ag_rnd(seed||3);for(let i=0;i<14;i++){const x=R()*W,y=y0+R()*(y1-y0),r=60+R()*160;const h=c.createRadialGradient(x,y,0,x,y,r);h.addColorStop(0,rgba(mix(col,[120,100,80],0.25),0.12));h.addColorStop(1,rgba(col,0));c.fillStyle=h;c.fillRect(x-r,y-r,r*2,r*2);}}
// a tall window on the right: its light falls across the room from it
function bb_window(c,x,y,w,h,o){o=o||{};c.save();const fr=o.frame||[226,220,206];
  const sky=c.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,rgba(o.sky0||[214,228,236],1));sky.addColorStop(1,rgba(o.sky1||[244,240,226],1));c.fillStyle=sky;c.fillRect(x,y,w,h);
  if(o.view)o.view(c,x,y,w,h);
  c.strokeStyle=rgba(fr,1);c.lineWidth=18;c.strokeRect(x,y,w,h);c.lineWidth=9;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.38);c.lineTo(x+w,y+h*0.38);c.stroke();
  ag_inner(c,cc=>cc.rect(x-9,y-9,w+18,h+18),"rgba(60,40,20,0.35)",14,-6,4);
  // the light it throws: a soft pale fall to the left
  const g=c.createRadialGradient(x,y+h*0.6,40,x-200,y+h*0.6,900);g.addColorStop(0,"rgba(255,246,222,0.34)");g.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();}
function bb_boards(c,y0,col,seed){const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,rgba(mix(col,[30,20,10],0.15),1));g.addColorStop(1,rgba(mix(col,[30,20,10],0.4),1));c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.strokeStyle="rgba(40,26,16,0.18)";c.lineWidth=2;for(let i=0;i<14;i++){const y=y0+Math.pow(i/14,1.6)*(H-y0);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}ag_grain(c,0,y0,W,H-y0,2,seed||9);}
// a walnut table top seen from in front: its top surface from y0 to y1, then its front edge
function bb_table(c,y0,y1,o){o=o||{};const col=o.col||BB.walnut;const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(mix(col,[255,240,220],0.12),1));g.addColorStop(1,rgba(mix(col,[30,20,10],0.1),1));
  c.fillStyle=g;c.fillRect(o.x0||0,y0,(o.x1||W)-(o.x0||0),y1-y0);
  c.save();c.globalAlpha=0.16;c.strokeStyle=rgba(BB.walnutDk,1);c.lineWidth=2;const R=ag_rnd(41);for(let i=0;i<26;i++){const y=y0+R()*(y1-y0);c.beginPath();c.moveTo(o.x0||0,y);for(let x=(o.x0||0);x<=(o.x1||W);x+=60)c.lineTo(x,y+Math.sin(x*0.004+i)*4);c.stroke();}c.restore();
  const s=c.createLinearGradient(0,y1,0,y1+40);s.addColorStop(0,rgba(BB.walnutDk,1));s.addColorStop(1,rgba(mix(BB.walnutDk,[0,0,0],0.3),1));c.fillStyle=s;c.fillRect(o.x0||0,y1,(o.x1||W)-(o.x0||0),40);
  const lg=c.createRadialGradient(1700,y0,40,1500,y0,1100);lg.addColorStop(0,"rgba(255,240,214,0.26)");lg.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=lg;c.fillRect(0,y0,W,y1-y0);}

/* ---------------------------------------------------------------- a brass microscope of the 1880s
   base centre (x, y), s its size (1: about 330 px tall): a horseshoe foot, the pillar, the stage with its mirror below, the arm and the
   tube with its eyepiece at the top, all brass and black lacquer, lit from the right */
function bb_scope(c,x,y,s,o){o=o||{};c.save();c.translate(x,y);c.scale(s,s);const B=BB.brass,Bd=BB.brassDk,Bh=BB.brassHi,K=[36,34,36];
  ag_floorShadow(c,-14,2,120,16,0.3);
  // the horseshoe foot, black
  ag_soft(c,cc=>{cc.moveTo(-104,0);cc.bezierCurveTo(-110,-26,-60,-34,-30,-30);cc.lineTo(30,-30);cc.bezierCurveTo(60,-34,110,-26,104,0);cc.closePath();},K,[110,110,118],40,-30,110,"rgba(0,0,0,0.4)",8);
  // the pillar and the stage
  ag_soft(c,cc=>ag_rect(cc,-14,-150,28,124,6),B,Bh,10,-140,60,"rgba(60,40,10,0.45)",6);
  ag_soft(c,cc=>ag_rect(cc,-74,-168,148,22,5),K,[120,118,124],50,-168,90,"rgba(0,0,0,0.4)",5);
  // the mirror below the stage
  ag_soft(c,cc=>cc.ellipse(0,-92,26,12,0,0,TAU),[200,206,212],[255,255,255],10,-96,30,"rgba(40,40,50,0.4)",5);
  c.strokeStyle=rgba(Bd,1);c.lineWidth=4;c.beginPath();c.moveTo(-26,-92);c.lineTo(-14,-110);c.moveTo(26,-92);c.lineTo(14,-110);c.stroke();
  // the arm, curving up and over to hold the tube
  ag_soft(c,cc=>{cc.moveTo(-6,-168);cc.bezierCurveTo(-30,-210,-36,-250,-20,-282);cc.lineTo(-2,-276);cc.bezierCurveTo(-16,-246,-12,-212,12,-168);cc.closePath();},B,Bh,0,-240,70,"rgba(60,40,10,0.45)",5);
  // the tube, slightly tilted, with its knurled focus wheel and the eyepiece
  c.save();c.rotate(o.tilt==null?-0.12:o.tilt);
  ag_soft(c,cc=>ag_rect(cc,8,-330,34,160,8),B,Bh,36,-320,90,"rgba(60,40,10,0.5)",6);
  ag_soft(c,cc=>ag_rect(cc,4,-350,42,26,6),K,[130,128,132],40,-350,40,"rgba(0,0,0,0.45)",4);
  ag_soft(c,cc=>ag_rect(cc,14,-186,22,22,4),Bd,B,30,-186,24,"rgba(30,20,0,0.4)",3);
  c.fillStyle=rgba(Bh,0.9);c.fillRect(34,-318,4,130);c.restore();
  ag_soft(c,cc=>cc.arc(-24,-246,16,0,TAU),K,[150,146,150],-18,-252,22,"rgba(0,0,0,0.45)",4);
  c.restore();}

/* ---------------------------------------------------------------- 1958 */
AG_PLACES.bbNavy=c=>{bb_wall(c,[196,204,192],0,700,11);c.fillStyle=rgba([150,162,150],1);c.fillRect(0,560,W,140);c.fillStyle=rgba([126,138,126],1);c.fillRect(0,556,W,8);
  bb_window(c,1430,110,360,400,{frame:[214,218,210],sky0:[196,214,230],sky1:[232,236,236]});
  const g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba([176,170,150],1));g.addColorStop(1,rgba([132,126,108],1));c.fillStyle=g;c.fillRect(0,700,W,H-700);
  c.strokeStyle="rgba(60,56,44,0.14)";c.lineWidth=2;for(let i=0;i<9;i++){const y=700+Math.pow(i/9,1.5)*380;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let k=-8;k<=8;k++){c.beginPath();c.moveTo(960+k*90,700);c.lineTo(960+k*260,H);c.stroke();}ag_grain(c,0,0,W,H,1.4,13);};

/* ---------------------------------------------------------------- paper on the table, seen from above */
// its top edge sits below the film's title, which reads on the wood above it
const BB_SHEET={x:330,y:136,w:1260,h:750};
AG_PLACES.bbSheet=c=>{const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(mix(BB.walnut,[20,12,6],0.15),1));g.addColorStop(1,rgba(mix(BB.walnut,[255,230,200],0.08),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalAlpha=0.2;c.strokeStyle=rgba(BB.walnutDk,1);c.lineWidth=2.5;const R=ag_rnd(5);for(let i=0;i<40;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);for(let x=0;x<=W;x+=80)c.lineTo(x,y+Math.sin(x*0.003+i*1.7)*10);c.stroke();}c.restore();
  ag_grain(c,0,0,W,H,2,7);const S=BB_SHEET;bb_paper(c,S.x,S.y,S.w,S.h);
  // the ink pot and the pen, top right on the wood
  ag_floorShadow(c,1712,236,74,20,0.35);ag_soft(c,cc=>cc.arc(1720,200,56,0,TAU),[40,44,52],[130,140,160],1744,176,60,"rgba(0,0,0,0.5)",8,0.6);
  c.fillStyle="rgba(14,14,18,0.95)";c.beginPath();c.arc(1720,200,26,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.ellipse(1740,184,12,6,-0.6,0,TAU);c.fill();
  c.save();c.translate(1690,520);c.rotate(-1.15);ag_floorShadow(c,-8,10,150,10,0.3);ag_soft(c,cc=>ag_rect(cc,-150,-8,250,16,8),[64,48,36],[150,120,90],60,-8,140,"rgba(0,0,0,0.4)",4);
  ag_soft(c,cc=>{cc.moveTo(100,-7);cc.lineTo(150,0);cc.lineTo(100,7);cc.closePath();},BB.brass,BB.brassHi,120,-4,40,"rgba(40,30,0,0.4)",3);c.restore();
  const lg=c.createRadialGradient(1800,60,40,1500,200,1500);lg.addColorStop(0,"rgba(255,244,220,0.3)");lg.addColorStop(1,"rgba(255,244,220,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the sky, the birds, the dunes and the glider */
function bb_skyGrad(c,top,low,hz){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(low,1));c.fillStyle=g;c.fillRect(0,0,W,hz);}
function bb_clouds(c,seed,y0,y1,n,col){const R=ag_rnd(seed);for(let i=0;i<n;i++){const x=R()*W,y=y0+R()*(y1-y0),w=180+R()*360,h=w*0.18;for(let k=0;k<5;k++){const r=h*(0.6+R()*0.7);
  const g=c.createRadialGradient(x+(k-2)*w*0.16,y,0,x+(k-2)*w*0.16,y,r*1.6);g.addColorStop(0,rgba(col||[255,252,246],0.5));g.addColorStop(1,rgba(col||[255,252,246],0));c.fillStyle=g;c.fillRect(x+(k-2)*w*0.16-r*1.6,y-r*1.6,r*3.2,r*3.2);}}}
function bb_hills(c,y,amp,col,seed){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,y-amp*(AG_NZ.fbm(x*0.0016+seed,seed*0.3,3)-0.3));c.lineTo(W,H);c.closePath();c.fill();}
AG_PLACES.bbSky=c=>{bb_skyGrad(c,[150,180,206],[236,232,220],820);bb_clouds(c,4,120,520,9);
  const sun=c.createRadialGradient(1640,240,10,1640,240,640);sun.addColorStop(0,"rgba(255,246,220,0.7)");sun.addColorStop(1,"rgba(255,246,220,0)");c.fillStyle=sun;c.fillRect(0,0,W,H);
  bb_hills(c,820,160,[160,170,160],2.1);bb_hills(c,900,120,[128,140,120],5.3);bb_hills(c,980,80,[104,118,96],8.7);ag_grain(c,0,0,W,H,1.2,17);};
// a buzzard soaring, seen from below and a little to the side: broad wings held in a shallow V, a pale underwing with a dark patch at
// the wrist and a dark trailing edge, the tips spread like fingers, a short barred tail fanned. roll tips the bird; twist (-1..1)
// turns one wingtip up and the other down, as Wilbur Wright saw; flap (0..1) lifts both wings
function bb_buzzard(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(o.roll||0);ctx.scale(s,s);const col=o.col||[70,56,46],tw=o.twist||0,a=o.a==null?1:o.a;ctx.globalAlpha*=a;
  const fl=(o.flap||0)*44,dk=mix(col,[24,18,14],0.35),pale=mix(col,[232,222,204],0.62),mid=mix(col,pale,0.4);
  const wing=k=>{const lift=-tw*k*14-fl-8,ch=1+tw*k*0.22;ctx.save();ctx.scale(k,1);
    // the wing's outline: the leading edge bowing forward to the wrist, the hand narrowing to the fingers, the trailing edge curving back in
    const out=c=>{c.moveTo(8,-12);c.bezierCurveTo(50,-30,104,-34+lift*0.3,132,-30+lift*0.55);c.bezierCurveTo(156,-27+lift*0.75,176,-24+lift*0.9,190,-22*ch+lift);
      c.lineTo(194,10*ch+lift*0.9);c.bezierCurveTo(160,22*ch+lift*0.6,110,26+lift*0.35,64,24);c.bezierCurveTo(40,23,20,20,8,16);c.closePath();};
    // the fingers: five primaries, each a feather tapering to its tip, spread with gaps between
    ctx.fillStyle=rgba(dk,1);for(let f=0;f<5;f++){const by=(-20+f*7.4)*ch+lift,bx=188+f*1.6,len=(34-f*3)*(1+0.1*(2-Math.abs(f-2))),ang=-0.42+f*0.21,ex=bx+Math.cos(ang)*len,ey=by+Math.sin(ang)*len,w2=3.4;
      ctx.beginPath();ctx.moveTo(bx,by-w2);ctx.quadraticCurveTo(bx+len*0.55,by-w2+Math.sin(ang)*len*0.5,ex,ey);ctx.quadraticCurveTo(bx+len*0.5,by+w2+Math.sin(ang)*len*0.5,bx,by+w2);ctx.closePath();ctx.fill();}
    ctx.save();ag_shape(ctx,out);ctx.fillStyle=rgba(mid,1);ctx.fill();ctx.clip();
    // the pale coverts under the arm, the dark wrist patch, the dark trailing band, and a soft shadow towards the body
    ctx.fillStyle=rgba(pale,0.9);ctx.beginPath();ctx.moveTo(14,-8);ctx.bezierCurveTo(60,-22,110,-24+lift*0.3,150,-18+lift*0.7);ctx.bezierCurveTo(140,0+lift*0.6,90,6+lift*0.2,18,6);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(dk,0.85);ctx.beginPath();ctx.ellipse(134,-14+lift*0.6,13,8,0.2,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(dk,0.8);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(30,20);ctx.bezierCurveTo(90,25+lift*0.3,150,20*ch+lift*0.6,194,8*ch+lift*0.9);ctx.stroke();
    const sh=ctx.createLinearGradient(0,0,60,0);sh.addColorStop(0,rgba(dk,0.45));sh.addColorStop(1,rgba(dk,0));ctx.fillStyle=sh;ctx.fillRect(0,-40,60,80);ctx.restore();ctx.restore();};
  wing(1);wing(-1);
  // the tail, a short fan with fine bars and a darker band at its end
  const tail=c=>{c.moveTo(-12,24);c.bezierCurveTo(-24,44,-30,62,-26,74);c.quadraticCurveTo(0,84,26,74);c.bezierCurveTo(30,62,24,44,12,24);c.closePath();};
  ctx.save();ag_shape(ctx,tail);ctx.fillStyle=rgba(pale,1);ctx.fill();ctx.clip();ctx.strokeStyle=rgba(dk,0.35);ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-30,40+i*7);ctx.quadraticCurveTo(0,46+i*7,30,40+i*7);ctx.stroke();}
  ctx.fillStyle=rgba(dk,0.7);ctx.fillRect(-32,68,64,14);ctx.restore();
  // the body: a dark head and neck, a pale breast band, a dark belly
  ag_soft(ctx,c=>c.ellipse(0,2,17,32,0,0,TAU),dk,mid,-4,-10,30,null,0,0.5);
  ctx.fillStyle=rgba(pale,0.85);ctx.beginPath();ctx.ellipse(0,-2,13,6,0,0,TAU);ctx.fill();
  ag_soft(ctx,c=>c.arc(0,-28,11,0,TAU),dk,mid,-2,-32,12,null,0,0.5);
  ctx.fillStyle=rgba([210,170,60],0.9);ctx.beginPath();ctx.moveTo(-3,-38);ctx.lineTo(0,-44);ctx.lineTo(3,-38);ctx.closePath();ctx.fill();ctx.restore();}
AG_PLACES.bbDunes=c=>{bb_skyGrad(c,[164,190,210],[240,236,224],700);bb_clouds(c,9,90,420,7);
  const sea=c.createLinearGradient(0,640,0,700);sea.addColorStop(0,rgba([132,160,170],1));sea.addColorStop(1,rgba([170,186,182],1));c.fillStyle=sea;c.fillRect(0,640,W,60);
  const dune=(y,amp,col,seed)=>{c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,y-amp*Math.pow(Math.max(0,AG_NZ.fbm(x*0.0011+seed,1.3,3)),1.4));c.lineTo(W,H);c.closePath();c.fill();};
  dune(720,140,[222,206,170],1.7);dune(800,230,[232,216,180],4.2);dune(930,200,[240,226,192],7.9);
  const sh=c.createLinearGradient(0,700,W,H);sh.addColorStop(0,"rgba(120,96,60,0.18)");sh.addColorStop(1,"rgba(255,250,236,0.12)");c.fillStyle=sh;c.fillRect(0,700,W,H-700);
  // tufts of beach grass
  const R=ag_rnd(3);c.strokeStyle="rgba(120,120,80,0.6)";c.lineWidth=2.5;c.lineCap="round";for(let i=0;i<40;i++){const x=R()*W,y=860+R()*200;for(let k=0;k<6;k++){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(k-3)*5,y-20,x+(k-3)*12,y-30-R()*20);c.stroke();}}
  ag_grain(c,0,0,W,H,1.4,19);};
// the Wrights' 1902 glider, seen from in front and a little below: two long wings, the struts between them, the elevator in front,
// the tail behind; twist (-1..1) warps both wings' tips, one up and one down, and the glider rolls with it
function bb_glider(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(o.roll||0);ctx.scale(s,s);const tw=o.twist||0,cl=[236,228,208],fr=[120,98,72];
  const wing=(yy,th)=>{ctx.fillStyle=rgba(cl,1);ctx.strokeStyle=rgba(fr,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-480,yy+tw*26);ctx.quadraticCurveTo(0,yy-8,480,yy-tw*26);
    ctx.lineTo(480,yy-tw*26+th+tw*8);ctx.quadraticCurveTo(0,yy+th-4,-480,yy+tw*26+th-tw*8);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=rgba(fr,0.35);ctx.lineWidth=1.5;for(let k=-11;k<=11;k++){const xx=k*42;ctx.beginPath();ctx.moveTo(xx,yy+tw*26*(-xx/480)-1);ctx.lineTo(xx,yy+th+tw*20*(-xx/480)-2);ctx.stroke();}};
  wing(-60,22);wing(40,22);ctx.strokeStyle=rgba(fr,1);ctx.lineWidth=3;for(let k=-4;k<=4;k++){const xx=k*110;ctx.beginPath();ctx.moveTo(xx,-40+tw*26*(-xx/480));ctx.lineTo(xx,42+tw*26*(-xx/480));ctx.stroke();}
  // a pilot lying on the lower wing, seen from the front: a small dark shape
  ctx.fillStyle="rgba(50,44,40,0.9)";ctx.beginPath();ctx.ellipse(0,48,26,12,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(0,34,10,0,TAU);ctx.fill();
  // the elevator, out in front of the wings on its outriggers: a shorter surface, nearer to us, so a little lower and larger in the view
  ctx.strokeStyle=rgba(fr,0.8);ctx.lineWidth=2.4;for(const xx of [-70,70]){ctx.beginPath();ctx.moveTo(xx,-40);ctx.lineTo(xx*1.2,6);ctx.moveTo(xx,42);ctx.lineTo(xx*1.2,18);ctx.stroke();}
  ctx.fillStyle=rgba(cl,1);ctx.strokeStyle=rgba(fr,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-230,8);ctx.quadraticCurveTo(0,0,230,8);ctx.lineTo(230,20);ctx.quadraticCurveTo(0,14,-230,20);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=rgba(fr,0.35);ctx.lineWidth=1.4;for(let k=-5;k<=5;k++){ctx.beginPath();ctx.moveTo(k*40,4+Math.abs(k)*0.3);ctx.lineTo(k*40,17+Math.abs(k)*0.3);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the maple and its seeds */
AG_PLACES.bbMaple=c=>{bb_skyGrad(c,[178,196,206],[236,226,206],H);
  // a soft park far behind: blurred trees and a lawn
  for(const [x,y,r,col] of [[200,700,260,[150,140,96]],[620,760,220,[176,150,96]],[1500,720,300,[160,120,80]],[1850,760,240,[140,132,96]]]){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,0.6));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
  const lawn=c.createLinearGradient(0,800,0,H);lawn.addColorStop(0,"rgba(150,160,110,0.6)");lawn.addColorStop(1,"rgba(120,130,90,0.8)");c.fillStyle=lawn;c.fillRect(0,800,W,H-800);
  // the branch, from the top left, with its leaves
  c.lineCap="round";const br=[[-40,120],[200,150],[420,130],[640,190],[820,170]];const S=bb_smooth(br,6);bb_strand(c,S,30,10,rgba([86,64,50],1),1);
  bb_strand(c,bb_smooth([[420,132],[470,80],[540,50]],6),12,5,rgba([86,64,50],1),1);bb_strand(c,bb_smooth([[640,188],[700,250],[760,300]],6),10,4,rgba([86,64,50],1),1);
  const leaf=(x,y,s,ang,col)=>{c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,0);
    const pts=[[0,-8],[-30,-20],[-26,-46],[-52,-56],[-34,-74],[-14,-70],[0,-100],[14,-70],[34,-74],[52,-56],[26,-46],[30,-20],[0,-8]];for(const p of pts)c.lineTo(p[0],p[1]);c.closePath();c.fill();
    c.strokeStyle=rgba(mix(col,[90,40,20],0.4),0.6);c.lineWidth=1.5;c.beginPath();c.moveTo(0,0);c.lineTo(0,-90);c.moveTo(0,-30);c.lineTo(-36,-60);c.moveTo(0,-30);c.lineTo(36,-60);c.stroke();c.restore();};
  const R=ag_rnd(12);for(let i=0;i<22;i++){const q=bb_along(S,0.1+R()*0.85),col=[[206,120,60],[220,160,70],[190,90,50],[226,184,96]][i%4];leaf(q[0]+(R()-0.5)*40,q[1]+20+R()*40,1+R()*0.6,Math.PI+(R()-0.5)*1.4,col);}
  // two pairs of seeds still hanging
  for(const [x,y] of [[540,190],[700,240]]){c.save();c.translate(x,y);bb_seedShape(c,0.9,0.4);c.restore();}ag_grain(c,0,0,W,H,1.2,21);};
// a maple seed: the seed itself, and its wing, a thin veined blade; drawn at the origin, s its size, ang its turn
function bb_seedShape(c,s,ang){c.save();c.rotate(ang);c.scale(s,s);c.fillStyle="rgba(196,150,96,0.88)";c.beginPath();c.moveTo(0,0);c.bezierCurveTo(30,-14,90,-30,128,-18);c.bezierCurveTo(110,4,50,14,0,8);c.closePath();c.fill();
  c.strokeStyle="rgba(140,96,56,0.5)";c.lineWidth=1.4;for(let k=0;k<5;k++){c.beginPath();c.moveTo(8,4);c.quadraticCurveTo(50,-6-k*3,100+k*6,-16+k*3);c.stroke();}
  c.fillStyle="rgba(150,104,62,1)";c.beginPath();c.ellipse(4,4,14,10,0.3,0,TAU);c.fill();c.restore();}
// a seed spinning down: seen from the side, its wing turns round the seed; the blur of its turning is drawn as a soft disc
function bb_seedSpin(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  const sp=t*(o.rate||7.5);ctx.fillStyle="rgba(200,160,110,0.16)";ctx.beginPath();ctx.ellipse(0,-10*s,130*s,26*s,0,0,TAU);ctx.fill();
  ctx.save();ctx.scale(1,0.32);ctx.rotate(sp);bb_seedShape(ctx,s,0);ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- a brain, as an anatomy book draws it */
const BB_BRAIN={cx:960,cy:500,s:1.0};
// the outline of the brain from the side, facing left (the front at the left), at (cx, cy), size s
function bb_brainPath(c,cx,cy,s){c.moveTo(cx-330*s,cy+40*s);c.bezierCurveTo(cx-360*s,cy-120*s,cx-240*s,cy-260*s,cx-60*s,cy-270*s);c.bezierCurveTo(cx+120*s,cy-290*s,cx+300*s,cy-200*s,cx+330*s,cy-40*s);
  c.bezierCurveTo(cx+350*s,cy+60*s,cx+300*s,cy+120*s,cx+230*s,cy+120*s);c.bezierCurveTo(cx+150*s,cy+130*s,cx+60*s,cy+120*s,cx-20*s,cy+150*s);c.bezierCurveTo(cx-120*s,cy+180*s,cx-300*s,cy+170*s,cx-330*s,cy+40*s);c.closePath();}
function bb_brain(c,cx,cy,s,o){o=o||{};const pink=o.col||[226,180,170],hi=mix(pink,[255,246,240],0.5),dk=mix(pink,[90,40,50],0.4);
  // the cerebellum, at the back underneath, and the brainstem
  ag_soft(c,cc=>cc.ellipse(cx+200*s,cy+150*s,120*s,70*s,0.15,0,TAU),mix(pink,[120,60,70],0.15),hi,cx+260*s,cy+120*s,140*s,rgba(dk,0.5),14);
  c.save();c.strokeStyle=rgba(dk,0.35);c.lineWidth=3*s;for(let k=0;k<6;k++){c.beginPath();c.ellipse(cx+200*s,cy+150*s,(110-k*14)*s,(62-k*8)*s,0.15,Math.PI*1.05,Math.PI*1.95);c.stroke();}c.restore();
  ag_soft(c,cc=>{cc.moveTo(cx+90*s,cy+150*s);cc.bezierCurveTo(cx+100*s,cy+220*s,cx+120*s,cy+280*s,cx+110*s,cy+330*s);cc.lineTo(cx+170*s,cy+330*s);cc.bezierCurveTo(cx+170*s,cy+270*s,cx+160*s,cy+200*s,cx+150*s,cy+150*s);cc.closePath();},mix(pink,[150,90,90],0.2),hi,cx+160*s,cy+200*s,80*s,rgba(dk,0.45),10);
  ag_soft(c,cc=>bb_brainPath(cc,cx,cy,s),pink,hi,cx+180*s,cy-200*s,520*s,rgba(dk,0.55),26*s,0.75);
  // the folds: soft winding grooves, each a dark line with a lit edge
  c.save();ag_shape(c,cc=>bb_brainPath(cc,cx,cy,s));c.clip();const R=ag_rnd(o.seed||31);c.lineCap="round";
  for(let i=0;i<34;i++){let x=cx+(R()-0.5)*620*s,y=cy+(R()-0.6)*380*s;const P=[[x,y]];let a=R()*TAU;for(let k=0;k<7;k++){a+=(R()-0.5)*1.6;x+=Math.cos(a)*34*s;y+=Math.sin(a)*34*s;P.push([x,y]);}
    const Q=bb_smooth(P,4);bb_strand(c,Q,5*s,2*s,rgba(dk,0.42),1);c.save();c.translate(1.5*s,-1.5*s);bb_strand(c,Q,2.4*s,1*s,rgba(hi,0.5),1);c.restore();}
  // the deep groove along the side
  bb_strand(c,bb_smooth([[cx-210*s,cy+40*s],[cx-60*s,cy-10*s],[cx+80*s,cy-40*s],[cx+200*s,cy-90*s]],8),8*s,3*s,rgba(dk,0.55),1);c.restore();}
AG_PLACES.bbBrain=c=>{const g=c.createRadialGradient(1100,420,80,960,540,1200);g.addColorStop(0,rgba([108,82,70],1));g.addColorStop(1,rgba([46,34,32],1));c.fillStyle=g;c.fillRect(0,0,W,H);ag_grain(c,0,0,W,H,1.6,27);
  ag_floorShadow(c,960,820,420,40,0.4);bb_brain(c,BB_BRAIN.cx,BB_BRAIN.cy,BB_BRAIN.s);
  const v=c.createRadialGradient(960,540,500,960,540,1150);v.addColorStop(0,"rgba(20,12,10,0)");v.addColorStop(1,"rgba(20,12,10,0.45)");c.fillStyle=v;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- under the microscope: a stained slide's thicket of fibres
   The field is centred at BB_LENS (x, y, r). A Golgi slide is gold where nothing is stained, the few stained cells black. The
   thicket is painted once (bb_thicketTex), the cells drawn live over it, so it can fade as the stain picks a few. */
const BB_LENS={x:960,y:470,r:400};
function bb_thicketTex(){return ag_kept("bb:thicket",900,900,(c,w,h)=>{const g=c.createRadialGradient(w*0.6,h*0.4,40,w/2,h/2,w*0.7);g.addColorStop(0,rgba([236,206,140],1));g.addColorStop(1,rgba([206,168,98],1));
  c.fillStyle=g;c.fillRect(0,0,w,h);const R=ag_rnd(88);c.lineCap="round";
  for(let i=0;i<520;i++){let x=R()*w,y=R()*h,a=R()*TAU;const P=[[x,y]],n=6+((R()*8)|0),l=14+R()*30;for(let k=0;k<n;k++){a+=(R()-0.5)*0.9;x+=Math.cos(a)*l;y+=Math.sin(a)*l;P.push([x,y]);}
    const Q=bb_smooth(P,3);bb_strand(c,Q,1.2+R()*2.4,0.8,rgba(mix([120,80,40],[70,46,30],R()),0.25+R()*0.35),1);}
  for(let i=0;i<70;i++){const x=R()*w,y=R()*h,r=6+R()*9;c.fillStyle=rgba([140,96,52],0.2+R()*0.2);c.beginPath();c.ellipse(x,y,r,r*0.8,R()*3,0,TAU);c.fill();}
  ag_grain(c,0,0,w,h,2,31);});}
function bb_slideGold(){return ag_kept("bb:gold",900,900,(c,w,h)=>{const g=c.createRadialGradient(w*0.6,h*0.4,40,w/2,h/2,w*0.7);g.addColorStop(0,rgba([240,214,150],1));g.addColorStop(1,rgba([214,176,104],1));c.fillStyle=g;c.fillRect(0,0,w,h);
  const R=ag_rnd(91);c.lineCap="round";for(let i=0;i<140;i++){let x=R()*w,y=R()*h,a=R()*TAU;const P=[[x,y]];for(let k=0;k<6;k++){a+=(R()-0.5)*0.9;x+=Math.cos(a)*24;y+=Math.sin(a)*24;P.push([x,y]);}
    bb_strand(c,bb_smooth(P,3),1.4,0.6,rgba([150,110,60],0.12),1);}ag_grain(c,0,0,w,h,2,33);});}
AG_PLACES.bbLens=c=>{const g=c.createRadialGradient(960,470,300,960,540,1200);g.addColorStop(0,rgba([40,34,30],1));g.addColorStop(1,rgba([14,12,12],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  const L=BB_LENS;bb_lens(c,L.x,L.y,L.r,cc=>cc.drawImage(bb_slideGold(),L.x-L.r,L.y-L.r,L.r*2,L.r*2),{rim:22});};
// the thicket inside the lens, a: how much of it shows (it fades as the stain picks its few)
function bb_thicket(ctx,a){if(a<=0)return;const L=BB_LENS;ctx.save();ctx.beginPath();ctx.arc(L.x,L.y,L.r,0,TAU);ctx.clip();ctx.globalAlpha*=a;ctx.drawImage(bb_thicketTex(),L.x-L.r,L.y-L.r,L.r*2,L.r*2);
  const g=ctx.createRadialGradient(L.x,L.y,L.r*0.62,L.x,L.y,L.r);g.addColorStop(0,"rgba(30,20,10,0)");g.addColorStop(1,"rgba(30,20,10,0.55)");ctx.fillStyle=g;ctx.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2);ctx.restore();}
// the few cells the stain turns black, each grown once; they appear one by one, as if picked at random
const BB_STAINED=(()=>{const L=BB_LENS,R=ag_rnd(1888),out=[];const spots=[[-170,-120],[150,-170],[60,120],[-150,190],[230,90],[-40,-10]];
  spots.forEach((p,i)=>out.push(bb_cell(400+i*13,{x:L.x+p[0],y:L.y+p[1],r:13+R()*6,reach:90+R()*60,dirs:5+(i%3),depth:3,wig:0.45,spines:true,axon:{ang:R()*TAU,len:180+R()*140,bend:0.3,ends:3,endLen:40}})));
  return out;})();
// the one big cell, whole, like a tree in winter (the poster's cell): its body low, its branches rising, its fibre going down
const BB_TREE=bb_cell(1906,{x:960,y:560,r:26,reach:300,dirs:6,depth:4,wig:0.32,spines:true,axon:{ang:Math.PI*0.5,len:280,bend:0.15,ends:3,endLen:60}});
// Golgi's idea: the fibres fused into one net, every crossing joined
const BB_NET=(()=>{const L=BB_LENS,R=ag_rnd(1873),N=[];for(let i=0;i<26;i++){const a=R()*TAU,d=Math.sqrt(R())*L.r*0.85;N.push([L.x+Math.cos(a)*d,L.y+Math.sin(a)*d]);}
  const E=[];N.forEach((p,i)=>{const d=N.map((q,j)=>[Math.hypot(q[0]-p[0],q[1]-p[1]),j]).filter(x=>x[1]!==i).sort((a,b)=>a[0]-b[0]);for(let k=0;k<3;k++){const j=d[k][1];if(!E.some(e=>e[0]===j&&e[1]===i))E.push([i,j,(R()-0.5)*60]);}});
  return{N,E};})();
function bb_golgiNet(ctx,u,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=col||[40,30,26];BB_NET.E.forEach(([i,j,b],k)=>{const p=BB_NET.N[i],q=BB_NET.N[j],m=[(p[0]+q[0])/2+b*0.4,(p[1]+q[1])/2-b*0.4];
    const P=bb_smooth([p,m,q],6);bb_strand(ctx,P,4,4,rgba(c,0.85),clamp(u*1.6-k/BB_NET.E.length*0.6,0,1));});
  ctx.fillStyle=rgba(c,0.9);BB_NET.N.forEach((p,i)=>{const k=clamp(u*1.6-0.6,0,1);if(k>0){ctx.beginPath();ctx.arc(p[0],p[1],8*k,0,TAU);ctx.fill();}});ctx.restore();}

/* ---------------------------------------------------------------- Barcelona, 1888: Cajal's room */
const BB_ROOM={table:[650,820],scope:[1080,700,0.98],cajal:[760,480,1.06]};
AG_PLACES.bbRoom=c=>{bb_wall(c,BB.plaster,0,660,5);
  // a bookcase on the left, its books in muted cloth
  c.fillStyle=rgba(BB.walnutDk,1);c.fillRect(60,90,380,570);const R=ag_rnd(64);for(let r=0;r<4;r++){const y=120+r*132;c.fillStyle=rgba(mix(BB.walnutDk,[0,0,0],0.3),1);c.fillRect(80,y,340,110);
    let x=86;while(x<410){const bw=14+R()*18,bh=70+R()*36,col=[[120,52,44],[66,78,96],[110,98,70],[78,90,72],[140,110,80],[96,60,70]][(R()*6)|0];c.fillStyle=rgba(col,1);c.fillRect(x,y+110-bh,bw,bh);
      c.fillStyle="rgba(255,230,180,0.35)";c.fillRect(x+3,y+110-bh+10,bw-6,3);x+=bw+2;}}
  ag_inner(c,cc=>cc.rect(60,90,380,570),"rgba(0,0,0,0.4)",14,-6,4);
  // a framed print on the wall
  ag_picture(c,560,170,240,170,{draw:(cc,px,py,pw,ph)=>{const g=cc.createLinearGradient(0,py,0,py+ph);g.addColorStop(0,"rgb(240,230,208)");g.addColorStop(1,"rgb(226,212,184)");cc.fillStyle=g;cc.fillRect(px,py,pw,ph);
    // the serrated peaks of Montserrat, above Barcelona, in sepia washes
    for(const [base,amp,col,seed] of [[0.78,0.5,[170,140,104],2],[0.92,0.36,[132,104,76],5]]){cc.fillStyle=rgba(col,0.85);cc.beginPath();cc.moveTo(px,py+ph);
      for(let i=0;i<=24;i++){const u=i/24,bump=Math.pow(Math.abs(Math.sin(u*Math.PI*7+seed)),0.6),env=Math.sin(u*Math.PI);cc.lineTo(px+u*pw,py+ph*base-ph*amp*env*(0.55+0.45*bump));}
      cc.lineTo(px+pw,py+ph);cc.closePath();cc.fill();}}});
  bb_window(c,1440,70,380,560,{frame:[214,204,184],sky0:[196,212,226],sky1:[244,236,218],view:(cc,x,y,w,h)=>{
    // the houses across the street: one row of fronts touching, each with its cornice, its windows and shutters, one pitched roof
    const fronts=[[0,0.44,[214,196,168]],[0.27,0.36,[200,176,146]],[0.52,0.48,[222,206,178]],[0.78,0.4,[206,184,152]]];
    fronts.forEach(([u0,top,col],k)=>{const x0=x+u0*w,x1=x+(fronts[k+1]?fronts[k+1][0]:1)*w,y0=y+h*top;cc.fillStyle=rgba(col,0.92);cc.fillRect(x0,y0,x1-x0,y+h-y0);
      cc.fillStyle=rgba(mix(col,[90,70,50],0.35),0.8);cc.fillRect(x0,y0-6,x1-x0,8);
      if(k===2){cc.fillStyle=rgba([176,104,72],0.85);cc.beginPath();cc.moveTo(x0-4,y0-4);cc.lineTo((x0+x1)/2,y0-40);cc.lineTo(x1+4,y0-4);cc.closePath();cc.fill();}
      for(let r=0;r<4;r++)for(let i=0;i<2;i++){const wx=x0+(x1-x0)*(0.22+i*0.4),wy=y0+26+r*62;if(wy>y+h-20)continue;cc.fillStyle=rgba(mix(col,[60,56,60],0.55),0.85);cc.fillRect(wx,wy,(x1-x0)*0.16,34);
        cc.fillStyle=rgba([96,120,104],0.6);cc.fillRect(wx-6,wy,5,34);cc.fillRect(wx+(x1-x0)*0.16+1,wy,5,34);}});}});
  bb_table(c,BB_ROOM.table[0],BB_ROOM.table[1]);c.fillStyle=rgba(mix(BB.walnutDk,[0,0,0],0.4),1);c.fillRect(0,BB_ROOM.table[1]+40,W,H);
  // on the table: slides in a row, a jar, the ink pot and paper
  for(let k=0;k<5;k++){const x=1300+k*58,y=760;ag_floorShadow(c,x+20,y+12,34,6,0.3);c.fillStyle="rgba(230,236,240,0.85)";c.fillRect(x,y,46,16);c.fillStyle="rgba(176,128,58,0.8)";c.fillRect(x+16,y+3,14,10);}
  ag_floorShadow(c,560,800,90,10,0.3);c.save();c.translate(470,700);c.rotate(-0.03);bb_paper(c,0,0,200,100);c.restore();
  ag_floorShadow(c,1640,752,40,9,0.35);ag_soft(c,cc=>cc.arc(1640,726,30,0,TAU),[40,44,52],[130,140,160],1654,712,34,"rgba(0,0,0,0.5)",6,0.6);
  ag_soft(c,cc=>ag_rect(cc,1720,640,70,112,10),[200,214,210],[255,255,255],1780,650,80,"rgba(40,60,60,0.3)",8,0.5);c.fillStyle="rgba(206,170,110,0.5)";c.fillRect(1726,690,58,58);
  ag_grain(c,0,0,W,H,1.2,6);};
function bb_room(ctx,t,o){o=o||{};const R=BB_ROOM;ag_person(ctx,BB_CAST.cajal,R.cajal[0],R.cajal[1],R.cajal[2],{t,cut:R.table[0]+14,nod:o.nod==null?0.12:o.nod,gaze:[3,2]});
  bb_scope(ctx,R.scope[0],R.scope[1],R.scope[2]);}

/* ---------------------------------------------------------------- 1888: a ward's corner, a chair by the window */
AG_PLACES.bbWard=c=>{bb_wall(c,[214,210,196],0,700,8);c.fillStyle=rgba([186,178,160],1);c.fillRect(0,520,W,180);c.fillStyle=rgba([160,150,132],1);c.fillRect(0,516,W,8);
  bb_window(c,1440,80,380,500,{frame:[220,214,200],sky0:[206,220,232],sky1:[246,240,226]});bb_boards(c,700,[150,120,90],12);ag_grain(c,0,0,W,H,1.2,8);};
// the patient's bed, drawn in front of them: an iron head rail at the left, the mattress and a pillow, and the blanket over their legs
function bb_bed(ctx,o){o=o||{};ctx.save();ctx.strokeStyle="rgba(64,66,72,0.95)";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(70,1090);ctx.lineTo(70,560);ctx.moveTo(70,600);ctx.lineTo(150,600);ctx.stroke();
  ag_soft(ctx,c=>{c.moveTo(60,800);c.lineTo(860,800);c.bezierCurveTo(900,800,910,830,900,860);c.lineTo(900,1090);c.lineTo(60,1090);c.closePath();},[236,234,226],[255,255,255],600,820,500,"rgba(60,60,70,0.25)",14,0.6);
  ag_soft(ctx,c=>{c.moveTo(150,820);c.bezierCurveTo(260,760,520,770,860,790);c.bezierCurveTo(900,792,920,830,900,870);c.lineTo(900,1090);c.lineTo(150,1090);c.closePath();},[176,182,192],[226,230,236],620,800,420,"rgba(40,44,60,0.3)",16,0.6);
  ctx.strokeStyle="rgba(120,126,140,0.5)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(200,880);ctx.quadraticCurveTo(480,850,860,870);ctx.stroke();ctx.restore();}
function bb_pillow(ctx){ag_soft(ctx,c=>{c.moveTo(90,560);c.bezierCurveTo(140,520,300,520,340,560);c.bezierCurveTo(360,640,350,740,330,800);c.lineTo(100,800);c.bezierCurveTo(80,720,80,620,90,560);c.closePath();},[242,240,234],[255,255,255],260,580,200,"rgba(60,60,70,0.22)",12,0.6);}

/* ---------------------------------------------------------------- Berlin, 1889: a long table of microscopes */
AG_PLACES.bbBerlin=c=>{bb_wall(c,[204,196,178],0,640,15);
  for(let k=0;k<3;k++)bb_window(c,280+k*560,70,300,470,{frame:[220,212,196],sky0:[200,212,222],sky1:[238,234,222]});
  bb_table(c,640,800,{col:[110,82,58]});c.fillStyle=rgba(mix(BB.walnutDk,[0,0,0],0.4),1);c.fillRect(0,840,W,H);ag_grain(c,0,0,W,H,1.2,16);};

/* ---------------------------------------------------------------- Stockholm, 1906: a hall with a stage */
AG_PLACES.bbHall=c=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([92,74,70],1));g.addColorStop(1,rgba([140,110,92],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // tall curtains at the sides, folds lit from the right
  for(const [x0,x1] of [[0,360],[1560,1920]])for(let k=0;k<6;k++){const x=x0+k*(x1-x0)/6,w=(x1-x0)/6;const f=c.createLinearGradient(x,0,x+w,0);f.addColorStop(0,"rgba(110,36,40,1)");f.addColorStop(0.6,"rgba(150,56,56,1)");f.addColorStop(1,"rgba(96,30,34,1)");c.fillStyle=f;c.fillRect(x,0,w+1,900);}
  // the back wall with gilded panels, and a lamp's warm light
  for(let k=0;k<3;k++){const x=520+k*300;c.strokeStyle="rgba(214,182,110,0.5)";c.lineWidth=5;c.strokeRect(x,120,220,360);}
  const lg=c.createRadialGradient(960,260,40,960,400,900);lg.addColorStop(0,"rgba(255,226,170,0.45)");lg.addColorStop(1,"rgba(255,226,170,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);
  // the stage's front edge
  c.fillStyle=rgba([84,60,46],1);c.fillRect(0,860,W,220);c.fillStyle=rgba([150,116,84],1);c.fillRect(0,850,W,14);ag_grain(c,0,0,W,H,1.4,26);};
