/* ===== Written once: the film's own pictures (prefixed wr_) =====
   The past: Paris, 1859. Tuning forks of polished steel on a wooden table, each one's note drawn as a line of light; the
   decree on paper with its wax seal; the standard fork laid in a lined case; a violin, its string settling; an orchestra
   tuning to the oboe. Drawn with tapering curves, a light side and a shadow side, and a little life from time.
   The present: project files (wr_code), the four drifting copies of a definition (wr_copy), Planning's dashboard and its
   tooltip, the chain from the conceptual model to the docs site, CI checks, the two diagrams, the catalog, the credential's
   two versions, its lineage, and faces and badges for the people who approve. */

const WR_RUN="runs on dbt Core · DuckDB",WR_AMB=[255,190,90],WR_CON=[120,215,155],WR_INK=[44,32,22],WR_STEEL=[214,220,228],WR_LINE=[255,226,170];

/* ---------- the past ---------- */
// a wooden table top seen a little from above: a lit top with grain, a darker front edge, and shadow below
function wr_table(ctx,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(0,y,0,y+120);g.addColorStop(0,"#7a5232");g.addColorStop(0.55,"#5a3a22");g.addColorStop(1,"#3a2414");ctx.fillStyle=g;ctx.fillRect(0,y,W,120);
  ctx.save();ctx.beginPath();ctx.rect(0,y,W,120);ctx.clip();for(let i=0;i<22;i++){const yy=y+6+hash(i,61)*108,ph=hash(i,62)*6;ctx.strokeStyle="rgba(40,22,10,"+(0.12+0.14*hash(i,63))+")";ctx.lineWidth=1+hash(i,64)*1.4;ctx.beginPath();ctx.moveTo(0,yy);
    for(let x=0;x<=W;x+=60)ctx.quadraticCurveTo(x+30,yy+Math.sin(x*0.004+ph)*5,x+60,yy+Math.sin((x+60)*0.004+ph)*3);ctx.stroke();}
  const sh=ctx.createRadialGradient(W*0.45,y-80,40,W*0.45,y,W*0.6);sh.addColorStop(0,"rgba(255,220,160,0.16)");sh.addColorStop(1,"rgba(255,220,160,0)");ctx.fillStyle=sh;ctx.fillRect(0,y,W,120);ctx.restore();
  ctx.fillStyle="#2a190c";ctx.fillRect(0,y+120,W,26);const d=ctx.createLinearGradient(0,y+146,0,H);d.addColorStop(0,"rgba(12,7,4,1)");d.addColorStop(1,"rgba(6,4,3,1)");ctx.fillStyle=d;ctx.fillRect(0,y+146,W,H-y-146);
  ctx.strokeStyle="rgba(255,214,160,0.28)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,y+0.5);ctx.lineTo(W,y+0.5);ctx.stroke();});}
// a tuning fork of polished steel, standing on its stem at (x,y), s its scale; ring (0..1) sets the tines quivering, with a blur at their tips
function wr_fork(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ring=o.ring||0,dx=ring*2.6*Math.sin(t*47+(o.ph||0));
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
    if(!o.noShadow){const sg=ctx.createRadialGradient(10,4,2,10,4,60);sg.addColorStop(0,"rgba(0,0,0,0.5)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(10,4,60,10,0,0,TAU);ctx.fill();}
    const steel=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"#f4f7fb");g.addColorStop(0.3,"#c4ccd6");g.addColorStop(0.62,"#7d8794");g.addColorStop(1,"#3c434d");return g;};
    // the two tines and the bend between them, drawn as one thick stroke, then a highlight along the lit side
    const tine=(sx,d,ox)=>{ctx.beginPath();ctx.moveTo(sx*16+d+ox,-260);ctx.quadraticCurveTo(sx*16+d*0.3+ox,-190,sx*16+ox,-122);ctx.stroke();};
    ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(-16-dx,-262);ctx.quadraticCurveTo(-16-dx*0.3,-190,-16,-118);ctx.arc(0,-118,16,Math.PI,0,true);ctx.quadraticCurveTo(16+dx*0.3,-190,16+dx,-262);
    ctx.strokeStyle=steel(-24,24);ctx.lineWidth=12;ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.55)";ctx.lineWidth=2.2;tine(-1,-dx,-3.2);tine(1,dx,-3.2);ctx.strokeStyle="rgba(20,24,30,0.35)";ctx.lineWidth=1.6;tine(-1,-dx,3.6);tine(1,dx,3.6);
    if(ring>0.05){[-1,1].forEach(sx=>{ctx.strokeStyle="rgba(220,228,240,"+(0.18*ring)+")";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(sx*16-sx*ring*3,-262);ctx.lineTo(sx*16+sx*ring*3,-262);ctx.stroke();});}
    // the stem and its ball
    const sg2=ctx.createLinearGradient(-6,0,6,0);sg2.addColorStop(0,"#eef2f7");sg2.addColorStop(0.45,"#9aa4b0");sg2.addColorStop(1,"#3a414a");ctx.fillStyle=sg2;
    ctx.beginPath();ctx.moveTo(-4.5,-104);ctx.quadraticCurveTo(-6,-60,-5.5,-12);ctx.lineTo(5.5,-12);ctx.quadraticCurveTo(6,-60,4.5,-104);ctx.closePath();ctx.fill();
    const bg=ctx.createRadialGradient(-4,-12,1,0,-8,13);bg.addColorStop(0,"#ffffff");bg.addColorStop(0.4,"#a8b1bc");bg.addColorStop(1,"#353b44");ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,-8,11,9,0,0,TAU);ctx.fill();
    if(o.mark)withA(ctx,o.mark,()=>{ctx.fillStyle="rgba(60,40,20,0.75)";ctx.beginPath();ctx.ellipse(0,-72,4.2,7,0,0,TAU);ctx.fill();});
    ctx.restore();});}
// a turned wooden block a standing fork sits in
function wr_block(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(x-44,0,x+44,0);g.addColorStop(0,"#a4734a");g.addColorStop(0.5,"#7a4e2c");g.addColorStop(1,"#3e2614");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x-40,y);ctx.quadraticCurveTo(x-44,y+16,x-38,y+30);ctx.lineTo(x+38,y+30);ctx.quadraticCurveTo(x+44,y+16,x+40,y);ctx.closePath();ctx.fill();
  ctx.fillStyle="#5a381e";ctx.beginPath();ctx.ellipse(x,y,40,8,0,0,TAU);ctx.fill();ctx.fillStyle="#2a180a";ctx.beginPath();ctx.ellipse(x,y,9,3.5,0,0,TAU);ctx.fill();});}
// a fork's note, drawn as a line of light: a soft wave whose length (wl) is its pitch; a (0..1)
function wr_wave(ctx,x0,x1,y,col,a,t,o){o=o||{};if(a<=0.01||x1<=x0)return;const wl=o.wl||46,amp=o.amp==null?7:o.amp,sp=o.sp==null?3:o.sp;
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=o.lw||2.6;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=14;ctx.lineCap="round";ctx.beginPath();
  for(let x=x0;x<=x1;x+=4){const e=Math.min(1,(x-x0)/60,(x1-x)/60),yy=y+Math.sin((x/wl)*TAU-t*sp*TAU/2)*amp*e;x===x0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();ctx.restore();}
// the decree, printed on paper, with its seal: p (0..1) brings the print up
function wr_decree(ctx,x,y,w,h,t,a,p){if(a<=0.01)return;withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{col:[236,226,202],seed:4,curl:0.6,age:0.2});const q=k=>clamp(p*4-k,0,1),ink=rgba(WR_INK,0.9);
  withA(ctx,q(0),()=>{T(ctx,"MINISTÈRE D'ÉTAT",x+w/2,y+58,{w:700,size:18,align:"center",color:rgba(WR_INK,0.75)});T(ctx,"ARRÊTÉ",x+w/2,y+104,{w:800,size:30,align:"center",color:ink});});
  withA(ctx,q(1),()=>{ctx.strokeStyle=rgba(WR_INK,0.5);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+60,y+128);ctx.lineTo(x+w-60,y+128);ctx.stroke();T(ctx,"DIAPASON NORMAL",x+w/2,y+184,{w:800,size:40,align:"center",color:ink});});
  withA(ctx,q(2),()=>{for(let i=0;i<7;i++){const lw=(w-120)*(i===6?0.55:0.9+0.1*hash(i,71));ctx.fillStyle=rgba(WR_INK,0.22);rr(ctx,x+60,y+226+i*24,lw,7,3);ctx.fill();}});
  withA(ctx,q(3),()=>{T(ctx,"Paris, 16 février 1859",x+60,y+h-46,{w:600,size:20,color:rgba(WR_INK,0.85)});waxSeal(ctx,x+w-90,y+h-70,34,WAX,1,1);});});}
// the standard fork's case: wood outside, velvet inside, the lid open behind, a brass plate; the fork lies in it
function wr_case(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  // the lid, open and leaning back
  ctx.save();const lg=ctx.createLinearGradient(x,y-h*0.7,x,y);lg.addColorStop(0,"#5c3820");lg.addColorStop(1,"#3a2212");ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(x+10,y);ctx.lineTo(x+30,y-h*0.62);ctx.lineTo(x+w-30,y-h*0.62);ctx.lineTo(x+w-10,y);ctx.closePath();ctx.fill();
  const lv=ctx.createLinearGradient(x,y-h*0.6,x,y);lv.addColorStop(0,"#3c1220");lv.addColorStop(1,"#6a2032");ctx.fillStyle=lv;ctx.beginPath();ctx.moveTo(x+26,y-6);ctx.lineTo(x+42,y-h*0.55);ctx.lineTo(x+w-42,y-h*0.55);ctx.lineTo(x+w-26,y-6);ctx.closePath();ctx.fill();
  // the brass plate on the lid
  const bp=ctx.createLinearGradient(0,y-h*0.42,0,y-h*0.42+38);bp.addColorStop(0,"#f0d590");bp.addColorStop(0.5,"#b8903c");bp.addColorStop(1,"#6c5020");ctx.fillStyle=bp;rr(ctx,x+w/2-150,y-h*0.42,300,40,6);ctx.fill();
  T(ctx,"DIAPASON NORMAL",x+w/2,y-h*0.42+27,{w:800,size:19,align:"center",color:"rgba(60,40,12,0.95)"});ctx.restore();
  // the box, then its velvet bed with a recess shaped like the fork
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=26;ctx.shadowOffsetY=10;const bg=ctx.createLinearGradient(x,y,x,y+h);bg.addColorStop(0,"#8a5a34");bg.addColorStop(1,"#4a2c16");ctx.fillStyle=bg;rr(ctx,x,y,w,h,12);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(255,220,170,0.25)";ctx.lineWidth=1.5;rr(ctx,x+1,y+1,w-2,h-2,12);ctx.stroke();
  const vg=ctx.createRadialGradient(x+w*0.4,y+h*0.35,10,x+w/2,y+h/2,w*0.6);vg.addColorStop(0,"#8a2a3e");vg.addColorStop(1,"#3a0e1a");ctx.fillStyle=vg;rr(ctx,x+16,y+14,w-32,h-28,8);ctx.fill();
  for(let i=0;i<40;i++){ctx.fillStyle="rgba(255,190,200,"+(0.03+0.04*hash(i,81))+")";ctx.beginPath();ctx.arc(x+20+hash(i,82)*(w-40),y+18+hash(i,83)*(h-36),1+hash(i,84)*1.5,0,TAU);ctx.fill();}
  wr_fork(ctx,x+w/2+132,y+h/2+2,0.86*(w/420),t,{rot:-Math.PI/2,ring:o.ring||0,noShadow:true});});}
// a stamp pressed onto a fork's stem: a small ring with a mark, lit when it lands
function wr_proof(ctx,x,y,a,press){if(a<=0.01)return;const pr=ease(clamp(press,0,1));withA(ctx,a*pr,()=>{ctx.save();ctx.translate(x,y);ctx.scale(1.6-0.6*pr,1.6-0.6*pr);
  ctx.strokeStyle=rgba([150,40,30],0.95);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(0,0,16,0,TAU);ctx.stroke();T(ctx,"DN",0,6,{w:800,size:15,align:"center",color:rgba([150,40,30],1)});ctx.restore();});}
// a violin, lying at an angle, its body varnished and lit from the upper left; vib (0..1) sets its string quivering
function wr_violin(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.5:o.rot);ctx.scale(s,s);
  const R=[[0,-180],[60,-178],[88,-140],[86,-100],[84,-62],[56,-44],[56,-10],[56,24],[86,40],[104,90],[110,150],[70,186],[0,188]];
  const body=k=>{ctx.beginPath();ctx.moveTo(0,-180*k);ctx.bezierCurveTo(60*k,-178*k,88*k,-150*k,86*k,-104*k);ctx.bezierCurveTo(84*k,-64*k,52*k,-58*k,54*k,-30*k);ctx.bezierCurveTo(56*k,-4*k,54*k,14*k,62*k,30*k);
    ctx.bezierCurveTo(98*k,48*k,110*k,96*k,106*k,134*k);ctx.bezierCurveTo(100*k,176*k,56*k,190*k,0,190*k);ctx.bezierCurveTo(-56*k,190*k,-100*k,176*k,-106*k,134*k);ctx.bezierCurveTo(-110*k,96*k,-98*k,48*k,-62*k,30*k);
    ctx.bezierCurveTo(-54*k,14*k,-56*k,-4*k,-54*k,-30*k);ctx.bezierCurveTo(-52*k,-58*k,-84*k,-64*k,-86*k,-104*k);ctx.bezierCurveTo(-88*k,-150*k,-60*k,-178*k,0,-180*k);ctx.closePath();};
  ctx.save();if(!o.noShadow){ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;ctx.shadowOffsetX=8;ctx.shadowOffsetY=12;}body(1);const g=ctx.createLinearGradient(-110,-180,110,190);g.addColorStop(0,"#d27a32");g.addColorStop(0.45,"#9a4a1a");g.addColorStop(1,"#4a1e0a");ctx.fillStyle=g;ctx.fill();ctx.restore();
  const hl=ctx.createRadialGradient(-40,-90,4,-30,-60,120);hl.addColorStop(0,"rgba(255,220,160,0.45)");hl.addColorStop(1,"rgba(255,220,160,0)");body(1);ctx.fillStyle=hl;ctx.fill();
  const hl2=ctx.createRadialGradient(-50,110,4,-40,120,110);hl2.addColorStop(0,"rgba(255,210,150,0.3)");hl2.addColorStop(1,"rgba(255,210,150,0)");body(1);ctx.fillStyle=hl2;ctx.fill();
  ctx.strokeStyle="rgba(30,12,4,0.7)";ctx.lineWidth=1.6;body(0.94);ctx.stroke();
  // f-holes
  [-1,1].forEach(sx=>{ctx.save();ctx.translate(sx*40,30);ctx.scale(sx,1);ctx.strokeStyle="rgba(20,8,2,0.95)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(6,-46);ctx.bezierCurveTo(-8,-30,10,30,-4,48);ctx.stroke();
    ctx.fillStyle="rgba(20,8,2,0.95)";ctx.beginPath();ctx.arc(7,-48,4,0,TAU);ctx.arc(-5,50,4,0,TAU);ctx.fill();ctx.restore();});
  // the neck, fingerboard and scroll
  const nk=ctx.createLinearGradient(-14,0,14,0);nk.addColorStop(0,"#c47a3a");nk.addColorStop(1,"#5a2a10");ctx.fillStyle=nk;rr(ctx,-13,-330,26,160,6);ctx.fill();
  ctx.fillStyle="#141010";ctx.beginPath();ctx.moveTo(-15,-330);ctx.lineTo(15,-330);ctx.lineTo(20,20);ctx.lineTo(-20,20);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.12)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-12,-326);ctx.lineTo(-17,16);ctx.stroke();
  ctx.fillStyle=nk;ctx.beginPath();ctx.ellipse(0,-352,17,26,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(40,16,4,0.8)";ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<=30;k++){const an=k/30*TAU*1.6,r=14-k*0.35;ctx.lineTo(Math.cos(an)*r*0.8,-356+Math.sin(an)*r);}ctx.stroke();
  [[-1,-318],[1,-306],[-1,-294],[1,-282]].forEach(([sx,py])=>{ctx.fillStyle="#1a1210";ctx.beginPath();ctx.ellipse(sx*26,py,10,5,0,0,TAU);ctx.fill();});
  // the tailpiece, the bridge and the strings
  ctx.fillStyle="#141010";ctx.beginPath();ctx.moveTo(-22,100);ctx.lineTo(22,100);ctx.lineTo(12,176);ctx.lineTo(-12,176);ctx.closePath();ctx.fill();
  ctx.fillStyle="#e8c890";ctx.beginPath();ctx.moveTo(-34,46);ctx.quadraticCurveTo(0,36,34,46);ctx.lineTo(30,54);ctx.lineTo(-30,54);ctx.closePath();ctx.fill();
  const vib=o.vib||0;[-15,-5,5,15].forEach((sx,i)=>{ctx.strokeStyle="rgba(240,230,210,0.85)";ctx.lineWidth=i===0?1.6:1.1;ctx.beginPath();const x0=sx*0.9,y0=104,x1=sx*0.35,y1=-322;ctx.moveTo(x0,y0);
    for(let k=1;k<=24;k++){const u=k/24,w_=i===0?Math.sin(u*Math.PI)*vib*4*Math.sin(t*60):0;ctx.lineTo(lerp(x0,x1,u)+w_,lerp(y0,y1,u));}ctx.stroke();});
  ctx.restore();});}
// an orchestra player seen from the side, seated on a wooden chair, in concert black with a warm rim of stage light: tapering limbs,
// a lit side and a shadow side, a profile with an eye, breath in the shoulders, and the bow moving a little as they tune.
// k is the instrument: 0 violin, 1 cello, 2 oboe, 3 viola. Faces right; o.flip faces left.
const WR_SKIN=[[226,184,150],[168,116,82],[118,78,54],[236,196,166],[146,98,68],[204,150,112],[190,136,100]],WR_HAIR=[[40,30,24],[96,62,36],[22,20,22],[156,146,136],[116,72,40],[30,24,22],[70,46,30]];
function wr_player(ctx,x,y,s,k,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=Math.round(x/10),sk=WR_SKIN[n%7],hr=WR_HAIR[(n*3+1)%7],longH=hash(n,7)>0.5,
  suit=[34,31,38],suitF=[24,22,28],br=Math.sin(t*1.6+x*0.01)*1.6,bw=Math.sin(t*1.1+x*0.03)*9,fl=o.flip?-1:1;
  withA(ctx,a,()=>outlined(ctx,cx=>{if(fl<0)cx.scale(-1,1);cx.lineCap="round";cx.lineJoin="round";
    // the chair: tapered legs, a seat, a curved back
    limb(cx,[[-36,-64],[-42,0]],6,5,[92,58,34],[-44,-66,-30,0]);limb(cx,[[24,-64],[28,0]],6,5,[92,58,34],[20,-66,30,0]);limb(cx,[[-34,-66],[-46,-156]],7,6,[92,58,34],[-48,-160,-30,-60]);
    cx.beginPath();cx.moveTo(-42,-72);cx.lineTo(30,-72);cx.quadraticCurveTo(34,-66,30,-61);cx.lineTo(-40,-61);cx.closePath();litFill(cx,[110,70,40],-42,-72,30,-60);
    // the far leg and far arm, a shade darker
    limb(cx,[[-2,-78],[50,-82],[58,-10]],27,19,suitF,[-2,-90,60,0]);cx.fillStyle="#0e0c10";ell(cx,68,-6,15,6);cx.fill();
    const farArm=(e,h)=>{limb(cx,[[4,-164+br],e,h],17,12,suitF,[0,-170,h[0],h[1]]);cx.fillStyle=rgba(darken(sk,0.25),1);ell(cx,h[0]+2,h[1],7,5.5,-0.4);cx.fill();};
    // the instrument behind the body: the cello stands between the knees
    const C=[66,-98];
    if(k===1){cx.strokeStyle="#2a2420";cx.lineWidth=2.5;cx.beginPath();cx.moveTo(76,-34);cx.lineTo(82,0);cx.stroke();
      cx.save();cx.translate(C[0],C[1]);cx.scale(0.78,1);wr_violin(cx,0,0,0.34,t,{noShadow:true,rot:-0.18,vib:0.25+0.25*Math.sin(t*0.7+x)});cx.restore();farArm([40,-150+br],[50,-182]);}
    else if(k===2)farArm([28,-130+br],[46,-176+br]);
    else farArm([58,-150+br],[110,-203+br]);
    // the torso: the jacket's back curving up to the shoulder, the chest, the lap; a white collar
    cx.beginPath();cx.moveTo(-28,-66);cx.bezierCurveTo(-36,-100,-32,-150,-18,-170+br);cx.quadraticCurveTo(-4,-182+br,12,-176+br);cx.bezierCurveTo(26,-168+br,28,-140,24,-112);cx.bezierCurveTo(22,-92,24,-78,20,-64);cx.closePath();
    litFill(cx,suit,-34,-180,26,-64,1.6);seam(cx,suit,0.6);
    cx.strokeStyle=rgba(darken(suit,0.6),0.7);cx.lineWidth=1.4;cx.beginPath();cx.moveTo(14,-170+br);cx.quadraticCurveTo(10,-140,18,-110);cx.stroke();
    // the near leg, over the seat
    limb(cx,[[-12,-76],[42,-80],[46,-10]],30,21,suit,[-14,-92,48,0]);const sg=cx.createLinearGradient(40,-12,70,0);sg.addColorStop(0,"#4a4450");sg.addColorStop(1,"#0c0a0e");cx.fillStyle=sg;ell(cx,56,-6,16,6.5);cx.fill();
    // neck and head in profile, tilted onto the chin rest for a violin or viola
    limb(cx,[[4,-172+br],[8,-190+br]],15,14,darken(sk,0.12),[0,-195,12,-170]);
    cx.fillStyle="#f2efe8";cx.beginPath();cx.moveTo(2,-178+br);cx.lineTo(16,-176+br);cx.lineTo(12,-166+br);cx.closePath();cx.fill();
    cx.save();cx.translate(8,-212+br);cx.rotate(k===0||k===3?0.2:k===2?0.06:-0.04);
    if(longH){cx.beginPath();cx.moveTo(-14,-14);cx.bezierCurveTo(-28,0,-26,22,-16,34);cx.quadraticCurveTo(-8,30,-4,16);cx.closePath();litFill(cx,hr,-28,-14,-4,34);}
    cx.beginPath();cx.moveTo(-18,4);cx.bezierCurveTo(-22,-14,-10,-26,4,-25);cx.bezierCurveTo(16,-24,21,-14,20,-4);cx.lineTo(25,4);cx.lineTo(20,7);cx.quadraticCurveTo(21,12,19,15);cx.quadraticCurveTo(18,22,10,24);cx.quadraticCurveTo(0,24,-6,18);cx.quadraticCurveTo(-14,14,-18,4);cx.closePath();
    litFill(cx,sk,-6,-24,22,24,1.2);seam(cx,sk,0.35,1.2);
    cx.beginPath();cx.moveTo(-21,8);cx.bezierCurveTo(-25,-16,-10,-30,6,-28);cx.bezierCurveTo(16,-27,22,-20,20,-11);cx.quadraticCurveTo(8,-17,-2,-12);cx.quadraticCurveTo(-8,-4,-12,8);cx.closePath();litFill(cx,hr,-24,-30,20,8);
    cx.fillStyle=rgba(darken(sk,0.2),1);ell(cx,-3,2,3.5,5.5);cx.fill();
    cx.strokeStyle="rgba(28,20,18,0.9)";cx.lineWidth=1.6;cx.beginPath();cx.moveTo(11,-3);cx.quadraticCurveTo(14,-1,17,-3);cx.stroke();cx.beginPath();cx.moveTo(10,-8);cx.lineTo(18,-9);cx.stroke();
    cx.restore();
    // the instrument in front, then the near arm
    const nearArm=(e,h)=>{limb(cx,[[0,-166+br],e,h],19,13,suit,[-4,-170,h[0],h[1]]);cx.fillStyle=rgba(sk,1);ell(cx,h[0],h[1],7.5,6,-0.4);litFill(cx,sk,h[0]-7,h[1]-6,h[0]+7,h[1]+6);};
    const bow=(b0,b1)=>{cx.strokeStyle="#3a2414";cx.lineWidth=2.6;cx.beginPath();cx.moveTo(b0[0],b0[1]);cx.lineTo(b1[0],b1[1]);cx.stroke();
      const dx=b1[0]-b0[0],dy=b1[1]-b0[1],L=Math.hypot(dx,dy),nx=-dy/L*3,ny=dx/L*3;cx.strokeStyle="rgba(236,226,206,0.8)";cx.lineWidth=1.2;cx.beginPath();cx.moveTo(b0[0]+nx,b0[1]+ny);cx.lineTo(b1[0]+nx,b1[1]+ny);cx.stroke();
      cx.fillStyle="#1a1210";cx.save();cx.translate(b0[0],b0[1]);cx.rotate(Math.atan2(dy,dx));rr(cx,-2,-3,14,9,2);cx.fill();cx.restore();};
    if(k===0||k===3){const sv=k===3?0.23:0.2,an=-0.2,Cv=[53,-191+br],d=[Math.cos(an),Math.sin(an)],B=[Cv[0]-9*d[0],Cv[1]-9*d[1]];
      cx.save();cx.translate(Cv[0],Cv[1]);cx.rotate(an);cx.scale(1,0.55);wr_violin(cx,0,0,sv,t,{noShadow:true,rot:Math.PI/2,vib:0.3+0.3*Math.sin(t*0.9+x)});cx.restore();
      const u=[0.27,-0.96],m=bw,F=[B[0]-(52+m)*u[0],B[1]-(52+m)*u[1]],Tp=[B[0]+(98-m)*u[0],B[1]+(98-m)*u[1]];bow(F,Tp);nearArm([16,-118+br],F);}
    else if(k===1){const F=[8+bw,-80],Tp=[132+bw,-90];bow(F,Tp);nearArm([-6,-114+br],F);}
    else{cx.save();cx.translate(30,-202+br);cx.rotate(Math.atan2(84,58));const og=cx.createLinearGradient(0,-5,0,5);og.addColorStop(0,"#4a3a34");og.addColorStop(0.5,"#1c1412");og.addColorStop(1,"#080606");cx.fillStyle=og;
      cx.beginPath();cx.moveTo(0,-2.5);cx.lineTo(92,-4.5);cx.quadraticCurveTo(102,-9,106,-10);cx.lineTo(106,10);cx.quadraticCurveTo(102,9,92,4.5);cx.lineTo(0,2.5);cx.closePath();cx.fill();
      [22,34,46,58,70,80].forEach(q=>{cx.fillStyle="rgba(220,226,232,0.85)";ell(cx,q,-3.5,2.4,1.6);cx.fill();});cx.restore();
      nearArm([40,-118+br],[66,-150+br]);}
  },x,y,s,WR_LINE,fl>0?[-60,-270,150,10]:[-150,-270,60,10],0.32));}

/* ---------- the present: files ---------- */
// a file from the project: its name, a small label saying where it runs, and its lines, typed as p goes from 0 to 1.
// o.lit {line: 0..1} lights whole lines; o.seg [[line, text, a, colour]] lights a phrase; o.wrap wraps long lines (at that many characters);
// o.ins [line, column, text, a, colour] types text into a line; o.cog draws a small cog on its corner (a generated file); o.amb turns its edge amber
function wr_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||31,col=mix(o.edge||[170,205,255],WR_AMB,o.amb||0),cw=tw(ctx,"M",sz,500,"mono");
  const V=[];lines.forEach((l,i)=>{if(!o.wrap||l.length<=o.wrap){V.push({i,s:l});return;}const i0=l.match(/^\s*/)[0].length,ind=" ".repeat(o.wrapMark?i0+(/^\s*#/.test(l)?2:0):i0+2);let rest=l,first=true;
    while(rest.length){const lim=first?o.wrap:o.wrap-ind.length;if(rest.length<=lim){V.push({i,s:(first?"":ind)+rest,wr:!first&&o.wrapMark?ind.length:0});break;}let cut=rest.lastIndexOf(" ",lim);if(cut<=0)cut=lim;V.push({i,s:(first?"":ind)+rest.slice(0,cut),wr:!first&&o.wrapMark?ind.length:0});rest=rest.slice(cut).replace(/^ /,"");first=false;}});
  const h=o.h||(76+V.length*lh);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+17,10,10,3);ctx.fill();T(ctx,name,x+36,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});
    const lab=o.label===undefined?WR_RUN:o.label;if(lab){const lg=o.labelGlow||0;T(ctx,lab,x+w-20-(o.cog?34:0),y+29,{w:700,size:18,align:"right",color:rgba(mix(SOFT,WEED,lg),1)});}
    if(o.cog)wr_cog(ctx,x+w-26,y+24,11,o.t||0,mix(SOFT,WR_AMB,o.amb||0),1,o.spin||0);
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+46,w-28,1.2);
    const n=o.p==null?V.length:V.length*o.p;V.forEach((v,j)=>{if(j>=n)return;const yy=y+80+j*lh,q=clamp(n-j,0,1),src=lines[v.i],cm=/^\s*(--|#|<!--|\*Generated)/.test(src)&&!/^\s*#\s*[A-Z][a-z]+ ?[a-z]*$/.test(src)&&!/^#{1,2} /.test(src),on=o.lit?o.lit[v.i]||0:0;
      if(v.wr&&q>0)wr_wrapHook(ctx,x+22+cw*(v.wr-2),yy,cw,sz,q);
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.95,6);ctx.fill();});
      const c0=cm?rgba(SOFT,0.85):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95);const insOn=o.ins&&o.ins[0]===j&&o.ins[3]>0;if(!insOn)T(ctx,typeOn(v.s,q),x+22,yy,{f:"mono",w:500,size:sz,color:c0});
      if(insOn){const[,c,s,ia,ic]=o.ins,sx=x+22+cw*c,shown=typeOn(s,ia);T(ctx,v.s.slice(0,c),x+22,yy,{f:"mono",w:500,size:sz,color:c0});
        T(ctx,shown,sx,yy,{f:"mono",w:500,size:sz,color:rgba(ic||EDGE_,1)});T(ctx,v.s.slice(c),sx+cw*shown.length,yy,{f:"mono",w:500,size:sz,color:c0});
        if(ia<1&&Math.sin((o.t||0)*8)>0){ctx.fillStyle=rgba(ic||EDGE_,1);ctx.fillRect(sx+cw*shown.length,yy-sz*0.85,2,sz);}}
      (o.seg||[]).forEach(([li,s,sa,sc])=>{if((li!==j&&li!==-1)||sa<=0)return;const k=v.s.indexOf(s);if(k<0)return;const sx=x+22+cw*k,sw=cw*s.length;
        withA(ctx,sa,()=>{glow(ctx,sx+sw/2,yy-6,sw*0.6,sc,0.22);ctx.fillStyle=rgba(sc,0.16);rr(ctx,sx-4,yy-lh*0.68,sw+8,lh*0.9,6);ctx.fill();T(ctx,s,sx,yy,{f:"mono",w:500,size:sz,color:rgba(sc,1)});});});});});return h;}
// the mark of a soft wrap, in the two columns before a continued line: a small hook arrow, as editors draw it
function wr_wrapHook(ctx,x,y,cw,sz,a){withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.75);ctx.fillStyle=rgba(SOFT,0.75);ctx.lineWidth=1.6;ctx.lineCap="round";const x0=x+cw*0.35,y0=y-sz*0.75,x1=x+cw*1.55,y1=y-sz*0.32;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,y1-3);ctx.quadraticCurveTo(x0,y1,x0+3,y1);ctx.lineTo(x1-4,y1);ctx.stroke();ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-6,y1-4);ctx.lineTo(x1-6,y1+4);ctx.closePath();ctx.fill();ctx.restore();});}
// a small cog: a generated file, or a script turning
function wr_cog(ctx,x,y,r,t,col,a,spin){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate((spin||0)*t*2.2);ctx.fillStyle=rgba(col,0.95);ctx.beginPath();
  for(let i=0;i<8;i++){const a0=i/8*TAU;ctx.lineTo(Math.cos(a0-0.2)*r,Math.sin(a0-0.2)*r);ctx.lineTo(Math.cos(a0-0.12)*r*1.32,Math.sin(a0-0.12)*r*1.32);ctx.lineTo(Math.cos(a0+0.12)*r*1.32,Math.sin(a0+0.12)*r*1.32);ctx.lineTo(Math.cos(a0+0.2)*r,Math.sin(a0+0.2)*r);}
  ctx.closePath();ctx.fill();ctx.fillStyle="rgba(6,10,20,1)";ctx.beginPath();ctx.arc(0,0,r*0.42,0,TAU);ctx.fill();ctx.restore();});}
// a paragraph whose words can be underlined, struck or left as a gap: o.hl [[phrase, a, colour]]; the word "[gap]" is an empty, dashed slot
function wr_para(ctx,s,x,y,w,o){o=o||{};const sz=o.size||21,lh=o.lh||sz*1.4,wt=o.w||600,words=s.split(" "),sp=tw(ctx," ",sz,wt),gapW=150;let cx=0,cy=0;const P=[];
  words.forEach(wd=>{const ww=wd==="[gap]"?gapW:tw(ctx,wd,sz,wt);if(cx>0&&cx+ww>w){cx=0;cy+=lh;}P.push({wd,x:cx,y:cy,w:ww});cx+=ww+sp;});
  if(o.measure)return cy+lh;const col=o.color||rgba(INK,0.95);
  P.forEach(p=>{if(p.wd==="[gap]"){const g=o.gapA||0;ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(WR_AMB,0.35+0.6*g);ctx.lineWidth=2;rr(ctx,x+p.x,y+p.y-sz*0.9,gapW,sz*1.25,6);ctx.stroke();ctx.restore();return;}T(ctx,p.wd,x+p.x,y+p.y,{w:wt,size:sz,color:col});});
  (o.hl||[]).forEach(([ph,a,c])=>{if(a<=0)return;const pw=ph.split(" ");for(let i=0;i+pw.length<=P.length;i++){if(pw.every((q,j)=>P[i+j].wd.replace(/[.,]$/,"")===q.replace(/[.,]$/,""))){
    for(let j=0;j<pw.length;j++){const p=P[i+j];ctx.save();ctx.strokeStyle=rgba(c||WR_AMB,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+p.x-2,y+p.y+7);ctx.lineTo(x+p.x+(p.w+4)*ease(clamp(a*1.4-j*0.15,0,1)),y+p.y+7);ctx.stroke();ctx.restore();}break;}}});
  if(o.strike>0)P.forEach(p=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+p.x-2,y+p.y-sz*0.3);ctx.lineTo(x+p.x+(p.w+4)*o.strike,y+p.y-sz*0.3);ctx.stroke();ctx.restore();});
  return cy+lh;}

/* ---------- the present: the four copies ---------- */
// a copy of a definition, drawn (not a project file): what it is, the tag "as it drifts", and its words.
// o.amb (0..1) turns it amber; o.hl underlines phrases; o.ghost (0..1) shows the small edits behind it; o.pin the agent's flag; o.strike and o.link (the wiki, fixed),
// with o.out fading the struck words before the link arrives, so the two never share the same pixels
function wr_copy(ctx,x,y,w,h,kind,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const amb=o.amb||0,col=mix([190,205,230],WR_AMB,amb);
  withA(ctx,a,()=>{if(o.ghost>0&&amb>0.3)for(let k=3;k>=1;k--)withA(ctx,o.ghost*(0.62-k*0.12),()=>{const gx=x+k*14*o.ghost,gy=y-k*7*o.ghost;ctx.save();ctx.strokeStyle=rgba(WR_AMB,0.7);ctx.lineWidth=1.5;ctx.setLineDash([5,6]);rr(ctx,gx,gy,w,h,16);ctx.stroke();ctx.restore();});
    glass(ctx,x,y,w,h,16,col,{glow:10+14*amb,ea:0.75,fill:"rgba(8,12,22,0.95)"});
    tag(ctx,x+16,y+30,kind,col,{size:19});const at="as it drifts",aw=tw(ctx,at,16,700)+26;withA(ctx,0.85*(1-(o.link||0)),()=>tag(ctx,x+w-16-aw,y+30,at,SOFT,{size:16}));
    if(o.link>0){withA(ctx,o.link,()=>{T(ctx,"award",x+24,y+104,{w:800,size:26});T(ctx,"→ the docs site",x+24,y+144,{w:700,size:24,color:rgba(KIND,1)});ctx.strokeStyle=rgba(KIND,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+152);ctx.lineTo(x+24+tw(ctx,"→ the docs site",24,700),y+152);ctx.stroke();});}
    withA(ctx,1-(o.out==null?(o.link||0):o.out),()=>wr_para(ctx,text,x+22,y+92,w-44,{size:o.size||21,hl:o.hl,gapA:o.gapA,strike:o.strike||0}));
    if(o.pin>0)kt_flag(ctx,x+w-22,y-8,0.9,o.pin);});}
// Planning's census dashboard, small: its badge, a bar per faculty, and the column the tooltip explains
function wr_dash(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,WR_CON,{glow:10,ea:0.7,fill:"rgba(7,14,18,0.95)"});
  wr_badge(ctx,x+36,y+36,20,"planning",null,{});T(ctx,"census dashboard",x+66,y+44,{w:800,size:20});
  const F=[5,3,2,2],bu=Math.min(16,(h-94)/5);F.forEach((v,i)=>{const bx=x+30+i*((w-60)/4),bw=(w-60)/4-18,bh=v*bu;ctx.fillStyle=rgba(WR_CON,0.55);rr(ctx,bx,y+h-30-bh,bw,bh,4);ctx.fill();});
  T(ctx,"award",x+w-24,y+44,{w:700,size:19,align:"right",color:rgba(INK,0.95)});ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle=rgba(INK,0.7);ctx.beginPath();ctx.moveTo(x+w-24-tw(ctx,"award",19,700),y+50);ctx.lineTo(x+w-24,y+50);ctx.stroke();ctx.restore();});}
// a tooltip bubble with a pointer down to (px,py), holding a copy of the definition
function wr_tip(ctx,x,y,w,h,px,py,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=18;ctx.fillStyle="rgba(236,242,250,0.97)";rr(ctx,x,y,w,h,12);ctx.fill();
  ctx.beginPath();ctx.moveTo(px-12,y+h-1);ctx.lineTo(px,py);ctx.lineTo(px+12,y+h-1);ctx.closePath();ctx.fill();ctx.restore();
  T(ctx,"tooltip",x+20,y+36,{w:800,size:19,color:"rgba(30,70,120,1)"});T(ctx,o.note||"as it drifts",x+w-20,y+36,{w:700,size:18,align:"right",color:"rgba(80,96,124,1)"});ctx.fillStyle="rgba(30,70,120,0.18)";ctx.fillRect(x+16,y+50,w-32,1.5);
  wr_para(ctx,text,x+20,y+80,w-40,{size:19,color:"rgba(16,24,40,0.95)",w:600});});}

/* ---------- the present: people and badges ---------- */
// a consumer's badge: a round seal in the consumers' green, with its icon (Planning's bars, or the wallet)
function wr_badge(ctx,x,y,r,kind,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.dark?mix(WR_CON,[60,70,80],o.dark):WR_CON;withA(ctx,a*(1-0.5*(o.dark||0)),()=>{glow(ctx,x,y,r*2,col,0.16+0.2*(o.hi||0));
  ctx.fillStyle="rgba(7,14,18,0.96)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.4);
  ctx.save();ctx.translate(x,y);const s=r/40;ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(kind==="planning"){[[-14,6,8],[-2,-2,16],[10,-10,24]].forEach(([bx,by,bh])=>{rr(ctx,bx-4,by-bh/2+8,9,bh,2);ctx.fill();});ctx.beginPath();ctx.moveTo(-20,20);ctx.lineTo(22,20);ctx.stroke();}
  else{rr(ctx,-20,-13,40,28,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-5);ctx.lineTo(20,-5);ctx.stroke();rr(ctx,6,1,16,10,3);ctx.fill();}
  ctx.restore();if(name)T(ctx,name,x,y+r+28,{w:800,size:o.size||20,align:"center",color:rgba(o.dark?SOFT:INK,1)});});}
// a person's face in a round frame, outlined in their side's colour
function wr_face(ctx,id,x,y,r,a,o){o=o||{};if(a<=0.01)return;const P=PEOPLE[id],k=r/100;withA(ctx,a,()=>{glow(ctx,x,y,r*1.8,P.edge,0.18+0.25*(o.hi||0));
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle="rgba(12,18,30,0.97)";ctx.fill();ctx.clip();person(ctx,id,x,y-0.1*r+505*k,k/P.build.h,{t:o.t||0,expr:o.expr||"calm",glow:0.2});ctx.restore();
  ring(ctx,x,y,r,P.edge,1,2.4);if(o.name)T(ctx,o.name,x,y+r+26,{w:800,size:19,align:"center"});});}

/* ---------- the present: the chain, the checks and the docs site ---------- */
// one link of the chain: a pill with a file's name; on (0..1) lights it; o.cog for a generated file or a script
function wr_link(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const on=o.on||0,col=mix(SOFT,o.col||KIND,0.4+0.6*on);withA(ctx,a,()=>{if(on>0)glow(ctx,x+w/2,y,w*0.55,o.col||KIND,0.22*on);
  glass(ctx,x,y-26,w,52,26,col,{glow:6+12*on,ea:0.7,fill:"rgba(7,12,24,0.95)"});T(ctx,name,x+(o.cog?44:w/2),y+7,{f:"mono",w:500,size:18,align:o.cog?"left":"center",color:rgba(mix(SOFT,INK,0.4+0.6*on),1)});
  if(o.cog)wr_cog(ctx,x+24,y,10,o.t||0,col,1,o.spin||0);});}
// a CI check: a status (0 waiting, 1 failed, 2 passed), its name and its message
function wr_ci(ctx,x,y,w,name,st,msg,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=st>=1.5?GOOD:st>=0.5?BAD:SOFT,h=msg?68+24*msg.split("\n").length:60;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:8+10*(st>0?1:0),ea:0.7,fill:"rgba(7,12,24,0.95)"});
  const cx=x+32,cy=y+30;if(st>=1.5){ctx.fillStyle="rgba(8,24,16,0.95)";ctx.beginPath();ctx.arc(cx,cy,15,0,TAU);ctx.fill();ring(ctx,cx,cy,15,GOOD,1,2.2);tick_(ctx,cx,cy+1,20,GOOD,1);}
  else if(st>=0.5)kt_rcross(ctx,cx,cy,15,1);else ring(ctx,cx,cy,15,SOFT,0.7,2,[4,4]);
  T(ctx,name,x+62,y+37,{w:700,size:20});if(msg)msg.split("\n").forEach((m,i)=>T(ctx,m,x+24,y+76+i*24,{f:"mono",w:500,size:o.msize||18,color:rgba(col,1)}));});return h;}
// the docs site's page for a model: the description dbt shows, with the definition it names in full
function wr_docs(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,KIND,{glow:10,ea:0.7,fill:"rgba(10,16,30,0.96)"});
  ctx.fillStyle="rgba(140,200,255,0.12)";rr(ctx,x+2,y+2,w-4,44,12);ctx.fill();[0,1,2].forEach(i=>{ctx.fillStyle=rgba(SOFT,0.6);ctx.beginPath();ctx.arc(x+24+i*18,y+24,5,0,TAU);ctx.fill();});
  T(ctx,"the docs site · core_award",x+90,y+31,{f:"mono",w:500,size:18,color:rgba(KIND,1)});T(ctx,"core_award",x+28,y+94,{w:800,size:30});T(ctx,"Description",x+28,y+134,{w:700,size:19,color:rgba(SOFT,1)});
  const yy=y+170,d1="An award the university offers, as it stood from valid_from until valid_to.";wr_para(ctx,d1,x+28,yy,w-56,{size:19});
  withA(ctx,o.def==null?1:o.def,()=>{const top=yy+(wr_para(ctx,d1,0,0,w-56,{size:19,measure:true}))+6;glow(ctx,x+w/2,top+40,w*0.4,KIND,0.08);
    wr_para(ctx,"Award. A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points. When it's conferred on a learner, it's a credential too.",x+28,top,w-56,{size:19,color:rgba(mix(INK,KIND,0.3),1)});});});}

/* ---------- the present: two diagrams ---------- */
// the conceptual diagram, drawn by hand: four entities and five relationships, white on blue; p (0..1) draws it
const WR_ENT=[["LEARNER",0.18,0.3],["CREDENTIAL",0.78,0.3],["AWARD",0.78,0.78],["CREDIT_TOWARDS_AWARD",0.24,0.78]];
const WR_REL=[[0,1,"holds"],[0,3,"holds credit"],[2,3,"is earned by"],[1,2,"counts towards"],[0,2,"is enrolled in"]];
function wr_erdHand(ctx,x,y,w,h,p,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{bpPaper(ctx,x,y,w,h,1,{});const P=WR_ENT.map(([,u,v])=>[x+u*w,y+v*h]);
  WR_REL.forEach(([i,j,lab],k)=>{const q=clamp(p*6-1.5-k*0.6,0,1);if(q<=0)return;const[x0,y0]=P[i],[x1,y1]=P[j];ctx.strokeStyle=rgba(BPL,0.9);ctx.lineWidth=2;ctx.beginPath();
    const bend=k===4?0.0:0;ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,q),lerp(y0,y1,q)+bend);ctx.stroke();
    if(q>=1){const mx=(x0+x1)/2,my=(y0+y1)/2,dy=k===2?-12:-10;if(k===4){ctx.save();ctx.translate(mx,my);ctx.rotate(Math.atan2(y1-y0,x1-x0));T(ctx,lab,0,-12,{w:600,size:18,align:"center",color:rgba(BPL,0.95)});ctx.restore();}
      else T(ctx,lab,mx+(k===1||k===3?12:0),my+dy,{w:600,size:18,align:k===1?"left":k===3?"left":"center",color:rgba(BPL,0.95)});}});
  WR_ENT.forEach(([nm],i)=>{const q=clamp(p*6-i*0.35,0,1);if(q<=0)return;const bw=tw(ctx,nm,18,800)+34,[cx,cy]=P[i];withA(ctx,q,()=>{ctx.fillStyle="rgba(24,64,136,0.98)";ctx.fillRect(cx-bw/2,cy-24,bw,48);
    ctx.strokeStyle=rgba(BPL,0.95);ctx.lineWidth=2.2;ctx.strokeRect(cx-bw/2,cy-24,bw,48);T(ctx,nm,cx,cy+7,{f:"mono",w:500,size:18,align:"center",color:rgba(BPL,1)});});});});}
// the physical diagram, generated: tables with their columns and types, on glass, with a cog; o.amb turns it amber (stale); o.upd shows the changed type
const WR_TAB=[["core_award_v1",[["award_key","string","PK"],["award_bk","string",""],["valid_from","date","PK"],["credit_points_required","int",""]]],
  ["core_credential_v2",[["credential_key","string","PK"],["learner_key","string","FK"],["status","string",""],["issued_on","date",""]]],
  ["core_learner_v1",[["learner_key","string","PK"],["learner_bk","string",""],["valid_from","date","PK"]]]];
function wr_erdGen(ctx,x,y,w,h,p,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const amb=o.amb||0,col=mix([170,205,255],WR_AMB,amb);withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:10+12*amb,ea:0.7,fill:"rgba(6,10,20,0.95)"});
  wr_cog(ctx,x+w-28,y+28,12,t,col,1,o.spin||0);T(ctx,"generated",x+w-52,y+35,{w:700,size:18,align:"right",color:rgba(col,1)});
  const tw_=(w-80)/3;WR_TAB.forEach(([nm,cols],i)=>{const q=clamp(p*3-i*0.6,0,1);if(q<=0)return;const tx=x+24+i*(tw_+16),ty=y+64,th=48+cols.length*34;withA(ctx,q,()=>{ctx.fillStyle="rgba(14,22,40,0.98)";rr(ctx,tx,ty,tw_,th,8);ctx.fill();
    ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=1.6;rr(ctx,tx,ty,tw_,th,8);ctx.stroke();ctx.fillStyle=rgba(col,0.16);rr(ctx,tx,ty,tw_,38,8);ctx.fill();T(ctx,nm,tx+12,ty+26,{f:"mono",w:500,size:18,color:rgba(col,1)});
    cols.forEach(([c,ty_,k],j)=>{const yy=ty+68+j*34,isUpd=o.upd!=null&&i===0&&j===3;let type=ty_;if(isUpd&&o.upd>0.5)type="bigint";
      T(ctx,type,tx+12,yy,{f:"mono",w:500,size:16,color:rgba(isUpd?mix(SOFT,WR_AMB,amb>0.3?1:o.upd):SOFT,1)});T(ctx,c.length>15?c.slice(0,14)+"…":c,tx+12+tw(ctx,"string ",16,500,"mono"),yy,{f:"mono",w:500,size:16,color:rgba(INK,0.9)});
      if(k)T(ctx,k,tx+tw_-10,yy,{f:"mono",w:500,size:15,align:"right",color:rgba(TRUST,0.95)});});});});});}

/* ---------- the present: the catalog ---------- */
// Unity Catalog's page for a table: a search, the table, its description and its columns' comments (the descriptions the YAML gives them).
// o.desc (0..1) flows the description in; o.cols (0..1) the columns'; o.edit (0..1) a hand's edit typed over it; o.reset (0..1) the build writing it back
const WR_CCOL=[["award_key","The award's hash key: the sha-256 of award_bk."],["award_name","The award's name, as it stood in this version."],["credit_points_required","The credit points the award requires, as the student system holds it."]];
const WR_CDESC="An award the university offers, as it stood from valid_from until valid_to. Award. A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points. …";
function wr_catalog(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const UC=[176,186,206];withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,UC,{glow:10+12*(o.hi||0),ea:0.6,fill:"rgba(12,14,20,0.96)"});
  T(ctx,"Databricks · Unity Catalog",x+24,y+38,{w:700,size:20,color:rgba(UC,1)});
  ctx.fillStyle="rgba(255,255,255,0.06)";rr(ctx,x+24,y+58,w-48,42,10);ctx.fill();ring(ctx,x+46,y+77,8,SOFT,0.9,2);ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+52,y+83);ctx.lineTo(x+58,y+89);ctx.stroke();
  T(ctx,typeOn("award",o.search==null?1:o.search),x+70,y+86,{w:600,size:19,color:rgba(INK,0.9)});
  T(ctx,"credentials.dev_core.core_award_v1",x+24,y+142,{f:"mono",w:500,size:19,color:rgba(INK,1)});T(ctx,"Description",x+24,y+182,{w:700,size:18,color:rgba(SOFT,1)});
  const dy=y+214,d=o.desc==null?1:o.desc,ed=o.edit||0,rs=o.reset||0,ev=ed*(1-rs);
  if(d>0){withA(ctx,clamp(1-ev*3,0,1),()=>wr_para(ctx,typeOn(WR_CDESC,d),x+24,dy,w-48,{size:18,color:rgba(mix(INK,KIND,0.25),1)}));
    if(ev>0)withA(ctx,ev,()=>{wr_para(ctx,typeOn("A degree the university gives on paper.",clamp(ed*1.4,0,1)),x+24,dy,w-48,{size:18,color:rgba(EDGE_,1)});tag(ctx,x+w-24-tw(ctx,"edited here, by hand",17,700)-26,y+182-6,"edited here, by hand",EDGE_,{size:17});});
    if(rs>0&&rs<1){const sx=x+24+(w-48)*rs;glow(ctx,sx,dy+40,90,KIND,0.35);ctx.fillStyle=rgba(KIND,0.7);ctx.fillRect(sx-1,dy-22,2,110);}}
  if(o.flow>0)withA(ctx,o.flow,()=>{glow(ctx,x+w/2,dy+40,w*0.45,KIND,0.12);});
  const cy=y+h-218;T(ctx,"Columns",x+24,cy,{w:700,size:18,color:rgba(SOFT,1)});WR_CCOL.forEach(([c,cm],i)=>{const yy=cy+40+i*62;ctx.fillStyle="rgba(255,255,255,0.04)";rr(ctx,x+16,yy-26,w-32,58,8);ctx.fill();
    T(ctx,c,x+30,yy,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});withA(ctx,clamp((o.cols==null?1:o.cols)*3-i,0,1),()=>T(ctx,cm,x+30,yy+24,{w:600,size:17,color:rgba(mix(INK,KIND,0.3),1)}));});});}

/* ---------- the present: the credential and its versions ---------- */
// core_credential's product card: its name, its version, and a few columns; o.ver ("v2"), o.dim, o.rows, o.lit {row: a}, o.strain (0..1) on the old column
function wr_prod(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],h=118+rows.length*40;if(a<=0.01)return h;const dim=o.dim||0;withA(ctx,a*(1-0.45*dim),()=>{glass(ctx,x,y,w,h,18,TRUST,{glow:12+8*(o.hi||0),ea:0.8,fill:"rgba(10,12,20,0.97)"});
  T(ctx,"core_credential",x+24,y+44,{f:"mono",w:500,size:24,color:rgba(TRUST,1)});if(o.ver)tag(ctx,x+w-24-tw(ctx,o.ver,20,700)-26,y+38,o.ver,TRUST,{size:20});
  T(ctx,"public · contract enforced · Noor",x+24,y+80,{w:600,size:18,color:rgba(SOFT,1)});
  rows.forEach(([c,ty,col],i)=>{const yy=y+128+i*40,on=o.lit?o.lit[i]||0:0;if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(col||TRUST,0.14);rr(ctx,x+14,yy-27,w-28,36,6);ctx.fill();});
    T(ctx,c,x+28,yy,{f:"mono",w:500,size:19,color:rgba(mix(INK,col||INK,on*0.5),0.95)});T(ctx,ty,x+w-28,yy,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,0.95)});});});return h;}
// a model or an exposure in the lineage: a pill in its layer's colour; o.dark for what a change doesn't reach
function wr_node(ctx,x,y,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const w=tw(ctx,name,18,500,"mono")+40,dk=o.dark||0,c=mix(col,[70,80,95],dk);withA(ctx,a*(1-0.4*dk),()=>{if(o.on>0)glow(ctx,x+w/2,y,w*0.6,col,0.25*o.on);
  glass(ctx,x,y-24,w,48,12,c,{glow:6+12*(o.on||0),ea:0.7,fill:"rgba(7,12,24,0.96)"});T(ctx,name,x+20,y+7,{f:"mono",w:500,size:18,color:rgba(mix(INK,SOFT,dk),1)});});return w;}

/* ---------- the present: more pieces ---------- */
// a project file drawn as the blueprint (white on blue): the conceptual model, where meaning lives. o.lit {line: a} lights lines; o.tags [[line, text, a]] names them at the right
function wr_bpCode(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||18,lh=o.lh||27,h=o.h||(96+lines.length*lh);if(a<=0.01)return h;withA(ctx,a,()=>{bpPaper(ctx,x,y,w,h,1,{});
  if(o.hi>0)glow(ctx,x+w/2,y+h/2,w*0.5,BPL,0.1*o.hi);
  T(ctx,name,x+30,y+44,{f:"mono",w:500,size:18,color:rgba(BPL,1)});T(ctx,o.label===undefined?WR_RUN:o.label,x+w-30,y+44,{w:700,size:18,align:"right",color:rgba(BPL,0.8)});
  const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+82+i*lh,on=o.lit?o.lit[i]||0:0;
    if(on>0)withA(ctx,on,()=>{ctx.fillStyle="rgba(255,255,255,0.13)";ctx.fillRect(x+22,yy-lh*0.72,w-44,lh*0.98);ctx.fillStyle=rgba(BPL,0.9);ctx.fillRect(x+22,yy-lh*0.72,4,lh*0.98);});
    T(ctx,typeOn(l,clamp(n-i,0,1)),x+34,yy,{f:"mono",w:500,size:sz,color:rgba(BPL,on>0?1:0.86)});});
  (o.tags||[]).forEach(([li,s,ta])=>{if(ta<=0)return;const yy=y+82+li*lh-6;withA(ctx,ta,()=>{tag(ctx,x+w+18,yy,s,TRUST,{size:18});ctx.strokeStyle=rgba(TRUST,0.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+w-16,yy);ctx.lineTo(x+w+16,yy);ctx.stroke();});});});return h;}
// the old physical diagram on a wiki page, dated last year: a few boxes and lines, going amber (stale)
function wr_oldWiki(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const amb=o.amb||0,col=mix([190,205,230],WR_AMB,amb);withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:10+14*amb,ea:0.75,fill:"rgba(8,12,22,0.95)"});
  tag(ctx,x+16,y+30,"wiki · physical diagram",col,{size:18});T(ctx,"updated last year",x+w-20,y+36,{w:700,size:18,align:"right",color:rgba(col,0.9)});
  const B=[[0.08,0.3,0.36],[0.56,0.3,0.36],[0.32,0.66,0.36]];ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+w*0.26,y+h*0.42);ctx.lineTo(x+w*0.74,y+h*0.42);ctx.moveTo(x+w*0.5,y+h*0.62);ctx.lineTo(x+w*0.5,y+h*0.48);ctx.stroke();
  B.forEach(([u,v,bw],i)=>{const bx=x+u*w,by=y+v*h,ww=bw*w,hh=h*0.22;ctx.fillStyle="rgba(14,22,40,0.98)";rr(ctx,bx,by,ww,hh,6);ctx.fill();ctx.strokeStyle=rgba(col,0.8);rr(ctx,bx,by,ww,hh,6);ctx.stroke();
    for(let r=0;r<3;r++){ctx.fillStyle=rgba(col,0.3);rr(ctx,bx+12,by+14+r*14,ww*(0.5+0.3*hash(i,r+5)),6,3);ctx.fill();}});});}
// the dashed slot for a copy that shouldn't exist: a fifth copy, crossed out
function wr_fifth(ctx,x,y,w,h,a,cr){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(WR_AMB,0.8);ctx.lineWidth=2;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();
  T(ctx,"a fifth copy?",x+w/2,y+h/2+10,{w:800,size:26,align:"center",color:rgba(WR_AMB,0.95)});
  if(cr>0){const q=ease(clamp(cr,0,1));ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+30,y+30);ctx.lineTo(x+30+(w-60)*q,y+30+(h-60)*q);ctx.stroke();}});}
// a value's possible states, as chips: [[text, colour, lit]]
function wr_chips(ctx,x,y,items,a){if(a<=0.01)return 0;let cx=x;withA(ctx,a,()=>{items.forEach(([s,col,on])=>{const w=tw(ctx,s,19,500,"mono")+34;if(on>0)glow(ctx,cx+w/2,y,w*0.7,col,0.3*on);
  ctx.fillStyle=rgba(mix([10,14,24],col,0.12+0.2*on),0.97);rr(ctx,cx,y-22,w,44,22);ctx.fill();ctx.strokeStyle=rgba(col,0.5+0.5*on);ctx.lineWidth=2;rr(ctx,cx,y-22,w,44,22);ctx.stroke();
  T(ctx,s,cx+17,y+7,{f:"mono",w:500,size:19,color:rgba(mix(INK,col,0.5*on),1)});cx+=w+14;});});return cx-x;}
// glowing dots travelling along a path of points, for something that flows one way (p: 0..1 how far the flow has got; it keeps moving with t)
function wr_flow(ctx,pts,t,a,col,o){o=o||{};if(a<=0.01)return;const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  const at=u=>{let d=u*tot;for(let i=0;i<L.length;i++){if(d<=L[i]){const k=d/L[i];return[lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)];}d-=L[i];}return pts[pts.length-1];};
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.55);ctx.lineWidth=2.4;ctx.beginPath();const reach=o.p==null?1:o.p;for(let k=0;k<=40;k++){const[px,py]=at(k/40*reach);k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.restore();
    if(reach>=0.98){const[ex,ey]=at(1),[qx,qy]=at(0.97),an=Math.atan2(ey-qy,ex-qx);ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-16*Math.cos(an-0.4),ey-16*Math.sin(an-0.4));ctx.lineTo(ex-16*Math.cos(an+0.4),ey-16*Math.sin(an+0.4));ctx.closePath();ctx.fill();}
    const n=o.n||5;for(let i=0;i<n;i++){const u=((t*(o.sp||0.35)+i/n)%1)*reach;const[px,py]=at(u);glow(ctx,px,py,18,col,0.6);ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),0.95);ctx.beginPath();ctx.arc(px,py,4,0,TAU);ctx.fill();}});}
// a new question, as a card with the asking team's badge
function wr_qcard(ctx,x,y,w,a,t){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,96,18,WEED,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.96)"});wr_badge(ctx,x+46,y+48,26,"wallet",null,{});
  T(ctx,"a new question",x+86,y+42,{w:800,size:24,color:rgba(WEED,1)});T(ctx,"from the wallet team",x+86,y+74,{w:600,size:19,color:rgba(SOFT,1)});});}
// an arrow that doesn't exist: dashed, faint, crossed out (the way back, from a copy to its source)
function wr_noBack(ctx,x0,y0,x1,y1,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();
  const mx=(x0+x1)/2,my=(y0+y1)/2;cross_(ctx,mx,my,26,BAD,0.9);});}

// the series' loop of ten steps (stepLoop in shared/src/weeds.js), drawn without the small step numbers, which crowd the rings;
// the agent's orb goes round the inner orbit and, from o.settle (0..1), moves to rest beside the first station, clear of the people's ring
function wr_stepLoop(ctx,cx,cy,rx,ry,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  ctx.save();ctx.strokeStyle=rgba(WEED,0.25);ctx.lineWidth=2;ctx.setLineDash([4,10]);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  STEPS10.forEach(([nm,gl],i)=>{const on=o.on?o.on[i]||0:1,[px,py]=stepPos(i,cx,cy,rx,ry),r=40;withA(ctx,0.25+0.75*on,()=>{if(on>0)glow(ctx,px,py,r*2,WEED,0.2*on);
      ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();ring(ctx,px,py,r,mix(SOFT,WEED,on),1,2.4);
      T(ctx,gl,px,py+8,{w:800,size:gl.length>2?19:24,align:"center",color:rgba(mix(SOFT,WEED,on),1)});
      const below=py>cy+ry*0.3,side=Math.abs(px-cx)>rx*0.5,lx=side?(px>cx?px+r+14:px-r-14):px,ly=side?py+7:(below?py+r+30:py-r-16);
      T(ctx,nm,lx,ly,{w:700,size:20,align:side?(px>cx?"left":"right"):"center",color:rgba(INK,0.95)});});
    if(o.teal&&o.teal[i]>0)withA(ctx,o.teal[i],()=>{ctx.fillStyle=rgba(KT_AI,1);ctx.beginPath();ctx.arc(px+r*0.72,py-r*0.72,8,0,TAU);ctx.fill();});
    if(o.ticks&&o.ticks[i]>0)kt_gtick(ctx,px+r*0.78,py+r*0.7,13,o.ticks[i]);});
  if(o.agent!=null&&o.agentA>0){const k=o.agent,an=-Math.PI/2+k/10*TAU,st=ease(clamp(o.settle||0,0,1)),[sx,sy]=stepPos(0,cx,cy,rx,ry);
    const ix=lerp(cx+Math.cos(an)*(rx-92),sx-78,st),iy=lerp(cy+Math.sin(an)*(ry-82),sy+6,st);kt_agent(ctx,ix,iy,18,t,{a:o.agentA});}});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed wr_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (pick: {pick}; sort: {pick, checked};
   steps: {step}; count: {on, total}), a scenario passes {q}. Any words come from L.vis (the page's learn.en.js or learn.es.js).
   Sized for the real width: the labs draw on a 960 x 420 board with text from 22 to 30 px, the scenarios on 600 x 320 with text
   from 16 to 22 px, so at a phone's 356 px the smallest word is about 9 px and on a desktop 12 to 19 px. Few things, large. */
function wr_fit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
function wr_count(pick,b){return Object.values(pick||{}).filter(x=>x===b).length;}
// the largest size, from size down to min, at which s fits maxW
function wr_fs(c,s,maxW,size,wt,f,min){let z=size;const m=min||Math.round(size*0.78);while(z>m&&tw(c,s,z,wt||700,f)>maxW)z-=1;return z;}
// a model in the labs' lineage: a glass pill with its name in one or two mono lines; o.on lights it, o.dark dims what a change doesn't reach
function wr_lnode(c,x,y,w,lines,col,o){o=o||{};const sz=o.size||24,lh=sz*1.2,h=20+lines.length*lh,on=o.on||0,dk=o.dark||0,cc=mix(col,[70,80,95],dk);
  withA(c,1-0.45*dk,()=>{if(on>0)glow(c,x+w/2,y,w*0.55,col,0.22*on);glass(c,x,y-h/2,w,h,12,cc,{glow:6+12*on,ea:0.7,fill:"rgba(7,12,24,0.96)"});
    lines.forEach((s,i)=>T(c,s,x+16,y-h/2+8+sz*0.92+i*lh,{f:"mono",w:500,size:sz,color:rgba(mix(INK,SOFT,dk),1)}));});return h;}
// a file's name as a pill (the scenarios)
function wr_pill(c,x,y,s,col,o){o=o||{};const sz=o.size||18,w=tw(c,s,sz,500,"mono")+32;if(o.on)glow(c,x+w/2,y,w*0.6,col,0.25*o.on);
  glass(c,x,y-sz-2,w,sz*2+4,sz,col,{glow:8+10*(o.on||0),ea:0.75,fill:"rgba(7,12,24,0.96)"});T(c,s,x+16,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(mix(INK,col,0.3),1)});return w;}
// a tag fitted to a width
function wr_ftag(c,x,y,s,col,maxW,size,o){o=o||{};const z=wr_fs(c,s,maxW-26,size,700,undefined,o.min);if(o.align==="right")x-=tw(c,s,z,700)+26;tag(c,x,y,s,col,{size:z,align:o.align==="center"?"center":undefined});}
const WR_LSTATE={ // [kind of state for each copy (fixed, drift, over, linked), and where the source is; ci: 2 passes, 1 fails]
  tooltip:{src:"tooltip",st:["fixed","fixed","fixed","source"],ci:2},catalog:{src:"catalog",st:["drift","drift","over","drift"],ci:2},
  generated:{src:"generated",st:["drift","drift","drift","drift"],ci:1},home:{src:"home",st:["linked","linked","linked","linked"],ci:2}};
Object.assign(LV,{
  // find the home: the conceptual model, the generated page and CI's check on the left; the four copies on the right
  wr_l_home:(c,w,h,st,L)=>{const V=L.vis,k=st.pick||"tooltip",S=WR_LSTATE[k]||WR_LSTATE.tooltip;c.save();wr_fit(c,w,h,960,420);
    const src=["wiki","yaml","catalog","tooltip"].indexOf(S.src),RX=372,RW=588,Y=i=>i*106,mid=i=>Y(i)+49;
    if(k==="home")glow(c,165,75,190,BPL,0.16);bpPaper(c,0,0,330,150,1,{});
    T(c,"_course__conceptual.yml",20,42,{f:"mono",w:500,size:wr_fs(c,"_course__conceptual.yml",292,24,500,"mono"),color:rgba(BPL,1)});
    T(c,V.fixed,20,86,{w:700,size:wr_fs(c,V.fixed,292,28,700),color:rgba(BPL,1)});if(k==="home")wr_ftag(c,20,124,V.source,TRUST,292,24);
    const gen=k==="generated",gcol=gen?WR_AMB:[170,205,255];glass(c,0,168,330,112,14,gcol,{glow:6+14*(gen?1:0),ea:0.7,fill:"rgba(6,10,20,0.95)"});
    T(c,"_course__definitions.md",18,206,{f:"mono",w:500,size:wr_fs(c,"_course__definitions.md",270,24,500,"mono"),color:rgba(gcol,1)});wr_cog(c,300,250,14,0,mix(SOFT,WR_AMB,gen?1:0),1,0);
    if(gen)T(c,V.edited,18,258,{w:700,size:wr_fs(c,V.edited,250,26,700),color:rgba(WR_AMB,1)});
    const ok=S.ci===2,cc=ok?GOOD:BAD;glass(c,0,298,330,72,14,cc,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.95)"});
    if(ok){ring(c,34,334,16,GOOD,1,2.4);tick_(c,34,335,20,GOOD,1);}else kt_rcross(c,34,334,16,1);
    T(c,"CI",64,344,{w:800,size:28,color:rgba(INK,1)});T(c,ok?"exit 0":"exit 1",312,344,{f:"mono",w:500,size:26,align:"right",color:rgba(cc,1)});
    V.copies.forEach((nm,i)=>{const s=S.st[i];let col=[190,205,230],status=V.drifts,phrase=V.drift[i],scol=SOFT;
      if(s==="fixed"){phrase=V.fixed;status=V.byHand;}else if(s==="source"){phrase=V.fixed;status=V.source;scol=TRUST;}
      else if(s==="over"){phrase=V.drift[1];status=V.overwritten;col=WR_AMB;scol=WR_AMB;}else if(s==="linked"){phrase=V.linked[i];status="";col=KIND;}else if(i<3)col=WR_AMB;
      glass(c,RX,Y(i),RW,98,14,col,{glow:6+14*(src===i?1:0),ea:0.75,fill:"rgba(8,12,22,0.95)"});
      let z=26;while(z>20&&tw(c,nm,z,800)+(status?tw(c,status,z,700)+28:0)>RW-40)z--;
      T(c,nm,RX+20,Y(i)+38,{w:800,size:z,color:rgba(col,1)});if(status)T(c,status,RX+RW-20,Y(i)+38,{w:700,size:z,align:"right",color:rgba(scol,1)});
      const mono=s==="linked"&&i===1;T(c,phrase,RX+20,Y(i)+80,{f:mono?"mono":undefined,w:mono?500:700,size:wr_fs(c,phrase,RW-40,28,mono?500:700,mono?"mono":undefined),color:rgba(mix(INK,col,0.3),1)});});
    if(k==="home")[0,1,2,3].forEach(i=>arrowTo(c,334,75,RX-4,mid(i),KIND,0.9,{head:11}));
    else if(src>=0)[0,1,2,3].forEach(i=>{if(i!==src)arrowTo(c,RX-4,mid(src),RX-4,mid(i),k==="catalog"?WR_AMB:SOFT,0.8,{head:11,bend:0.09*Math.sign(mid(i)-mid(src))});});
    c.restore();},
  // where does it live: the four homes, each counting what has been placed in it; once checked, the 15 put on a page shows its drift
  wr_l_where:(c,w,h,st,L)=>{const V=L.vis,P=st.pick||{},drift=st.checked&&P[9]==="md",lab=L.labs.find(x=>x.vis==="wr_l_where"),B={};(lab?lab.w.buckets:[]).forEach(([k,t])=>B[k]=t);c.save();wr_fit(c,w,h,960,420);
    [["concept","_<domain>__conceptual.yml",BPL,0,0],["md","_<scope>__decisions.yml",KIND,485,0],["var","dbt_project.yml",WEED,0,215],["yaml","_core_<domain>__models.yml",TRUST,485,215]].forEach(([k,file,col,x,y])=>{
      if(k==="concept")bpPaper(c,x,y,475,205,1,{});else glass(c,x,y,475,205,14,col,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.95)"});
      const ttl=B[k]||k;T(c,ttl,x+22,y+42,{w:800,size:wr_fs(c,ttl,431,28,800),color:rgba(k==="concept"?BPL:col,1)});
      T(c,file,x+22,y+82,{f:"mono",w:500,size:wr_fs(c,file,431,24,500,"mono"),color:rgba(k==="concept"?BPL:mix(SOFT,col,0.3),0.95)});
      const n=String(wr_count(P,k));T(c,n,x+22,y+150,{w:800,size:48,color:rgba(k==="concept"?BPL:INK,1)});T(c,V.placed,x+30+tw(c,n,48,800),y+148,{w:700,size:26,color:rgba(k==="concept"?BPL:SOFT,1)});
      if(drift&&(k==="md"||k==="var")){const s=k==="md"?V.pageSays:V.varSays;wr_ftag(c,x+453,y+178,s,WR_AMB,300,24,{align:"right"});}});
    c.restore();},
  // plan a new version: version 2 beside version 1, then the date, the lineage, the owner told, the pin, and version 1 gone
  wr_l_version:(c,w,h,st,L)=>{const V=L.vis,k=st.step||0,gone=k>=7;c.save();wr_fit(c,w,h,960,420);
    const card=(y,hh,ver,col,lit,a,dash)=>{withA(c,a,()=>{glass(c,0,y,400,hh,16,TRUST,{glow:lit?14:6,ea:0.8,fill:"rgba(10,12,20,0.97)"});
      T(c,"core_credential",20,y+44,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});tag(c,380-tw(c,ver,24,700)-26,y+36,ver,TRUST,{size:24});
      T(c,col,20,y+94,{f:"mono",w:500,size:28,color:rgba(lit?TRUST:INK,0.95)});});
      if(dash){c.save();c.setLineDash([10,9]);c.strokeStyle=rgba(SOFT,0.7);c.lineWidth=2;rr(c,0,y,400,hh,16);c.stroke();c.restore();}};
    card(0,166,"v2","status",1,1,0);if(k>=2)wr_ftag(c,20,134,V.latest,TRUST,360,24);
    card(194,226,"v1","is_revoked",0,gone?0.3:0.85,gone);
    if(gone)wr_ftag(c,200,330,V.removed,SOFT,360,26,{align:"center"});
    else{if(k>=1)wr_ftag(c,20,330,V.builtFrom,TRUST,360,24);if(k>=3)wr_ftag(c,20,384,V.date,WR_AMB,360,24);}
    if(k>=1&&!gone)arrowTo(c,404,120,404,290,TRUST,0.85,{head:13,bend:-0.16});
    if(k>=4){const on=k>=6?1:0.5;arrowTo(c,402,44,466,44,KIND,0.9,{head:11});arrowTo(c,402,72,466,112,KIND,0.9,{head:11});
      wr_lnode(c,470,44,378,["mart_wallet__credentials"],WR_CON,{on});wr_lnode(c,470,112,334,["mart_wallet__learners"],WR_CON,{on});
      arrowTo(c,850,44,866,80,WR_CON,0.8,{head:10});arrowTo(c,806,112,846,112,WR_CON,0.8,{head:10});
      wr_badge(c,884,112,30,"wallet",null,{hi:k>=5?1:0});T(c,"wallet_app",884,176,{w:800,size:24,align:"center",color:rgba(INK,1)});
      if(k>=6){tag(c,856,22,V.pins,KIND,{size:22});tag(c,470,166,V.pins,KIND,{size:22});}
      wr_lnode(c,470,320,392,["mart_planning__near_award"],SOFT,{dark:1});T(c,V.notReached,486,386,{w:700,size:wr_fs(c,V.notReached,460,26,700),color:rgba(SOFT,1)});}
    if(k>=5){kt_gtick(c,908,88,13,1);const s=V.wallet+" · "+V.told;T(c,s,956,222,{w:700,size:wr_fs(c,s,470,24,700,undefined,19),align:"right",color:rgba(TRUST,1)});}
    c.restore();},
  // who's affected: two core models, what reads them, and the exposures with their owners; what's ticked lights up
  wr_l_affected:(c,w,h,st,L)=>{const V=L.vis,on=st.on||new Set(),has=k=>on.has(k);c.save();wr_fit(c,w,h,960,420);
    const N={v1:[34,["core_credential_v1"]],wc:[124,["mart_wallet__","credentials"]],wl:[224,["mart_wallet__","learners"]],pl:[340,["mart_planning__","near_award"]]},BX=340,BW=300;
    const cc=120,ct=300,X={xw:150,xc:300},aC=has("v1")||!has("pl"),aT=has("pl")||!has("v1");
    [[cc,"v1",aC],[cc,"wc",aC],[cc,"wl",aC],[ct,"wl",aT],[ct,"pl",aT]].forEach(([sy,k,a],i)=>{const lit=has(k)&&a;arrowTo(c,272,sy+(i===3?8:0),BX-4,N[k][0]+(i===2?-8:i===3?8:0),lit?WR_CON:SOFT,lit?0.9:0.3,{head:11});});
    const fk=has("wc")&&has("wl");arrowTo(c,BX+BW+2,N.wl[0]-14,BX+BW+2,N.wc[0]+14,fk?WR_CON:SOFT,fk?0.85:0.3,{head:10,bend:0.45});
    [["wc","xw"],["wl","xw"],["pl","xc"]].forEach(([a,b])=>arrowTo(c,BX+BW+4,N[a][0],792,X[b]+(a==="wc"?-10:a==="wl"?10:0),has(b)?WR_CON:SOFT,has(b)?0.85:0.3,{head:11}));
    wr_lnode(c,0,cc,272,["core_credential"],TRUST,{on:aC?1:0,dark:aC?0:0.5,size:24});wr_lnode(c,0,ct,272,["core_credit_","towards_award"],TRUST,{on:aT?1:0,dark:aT?0:0.5,size:24});
    Object.keys(N).forEach(k=>wr_lnode(c,BX,N[k][0],BW,N[k][1],WR_CON,{on:has(k)?1:0,dark:has(k)?0:0.6,size:24}));
    [["xw","wallet_app",V.wallet],["xc","census_dashboard",V.planning]].forEach(([k,nm,own])=>{const y=X[k];wr_badge(c,840,y,30,k==="xw"?"wallet":"planning",null,{hi:has(k)?1:0,dark:has(k)?0:0.6});
      T(c,nm,840,y+62,{w:800,size:wr_fs(c,nm,236,24,800),align:"center",color:rgba(has(k)?INK:SOFT,1)});if(has(k))T(c,own,840,y+96,{w:700,size:wr_fs(c,own,236,24,700,undefined,19),align:"center",color:rgba(TRUST,1)});});
    c.restore();},
  // the scenarios
  wr_q_catalog:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    wr_pill(c,6,80,"_course__conceptual.yml",BPL,{on:0.6});wr_ftag(c,8,138,V.home,BPL,250,18);wrapT(c,V.typo,10,186,240,{w:600,size:18,lh:24,color:rgba(SOFT,1)});
    T(c,"persist_docs",290,44,{f:"mono",w:500,size:18,align:"center",color:rgba(KIND,1)});arrowTo(c,262,80,316,80,KIND,0.9,{head:12});
    wr_noBack(c,316,262,262,262,1);
    const UC=[176,186,206];glass(c,322,60,274,250,16,UC,{glow:10,ea:0.6,fill:"rgba(12,14,20,0.96)"});const ttl="Databricks · Unity Catalog";T(c,ttl,338,92,{w:700,size:wr_fs(c,ttl,242,18,700,undefined,15),color:rgba(UC,1)});
    T(c,"core_award_v1",338,124,{f:"mono",w:500,size:18});wrapT(c,V.fixedText,338,164,240,{w:700,size:20,lh:26,color:rgba(EDGE_,1)});
    wr_ftag(c,338,280,V.edited,EDGE_,244,18);c.restore();},
  wr_q_diagram:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    glass(c,4,14,276,292,16,WR_AMB,{glow:14,ea:0.75,fill:"rgba(8,12,22,0.95)"});T(c,"wiki",22,48,{w:800,size:22,color:rgba(WR_AMB,1)});T(c,V.stale,22,78,{w:700,size:wr_fs(c,V.stale,240,18,700,undefined,15),color:rgba(WR_AMB,0.9)});
    const box=(x,y,ww,hh)=>{c.fillStyle="rgba(14,22,40,0.98)";rr(c,x,y,ww,hh,8);c.fill();c.strokeStyle=rgba(WR_AMB,0.8);c.lineWidth=2;rr(c,x,y,ww,hh,8);c.stroke();};
    box(22,100,160,82);T(c,"credential",36,132,{f:"mono",w:500,size:18,color:rgba(WR_AMB,1)});T(c,"is_revoked",36,164,{f:"mono",w:500,size:18,color:rgba(INK,0.9)});
    box(110,206,150,80);for(let r=0;r<3;r++){c.fillStyle=rgba(WR_AMB,0.3);rr(c,124,224+r*20,70+30*hash(2,r),7,3);c.fill();}
    arrowTo(c,284,160,308,160,KIND,0.9,{head:10});
    const PC=[170,205,255];glass(c,312,14,284,292,16,PC,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.95)"});wr_cog(c,574,40,11,0,PC,1,0);T(c,"_student__physical.md",328,48,{f:"mono",w:500,size:18,color:rgba(PC,1)});
    c.fillStyle="rgba(14,22,40,0.98)";rr(c,326,64,256,184,8);c.fill();c.strokeStyle=rgba(PC,0.8);c.lineWidth=1.5;rr(c,326,64,256,184,8);c.stroke();
    T(c,"core_credential_v2",340,92,{f:"mono",w:500,size:18,color:rgba(PC,1)});
    [["credential_key","PK"],["learner_key","FK"],["status",""],["issued_on",""]].forEach(([cn,pk],i)=>{T(c,cn,340,128+i*32,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});if(pk)T(c,pk,568,128+i*32,{f:"mono",w:500,size:18,align:"right",color:rgba(TRUST,1)});});
    wr_ftag(c,326,280,V.generated,GOOD,256,18,{min:14});c.restore();},
  wr_q_rename:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    const pw=wr_pill(c,6,40,"core_credit_towards_award",TRUST,{on:1});const cx=pw+22,cn="credit_points_earned";
    T(c,cn,cx,46,{f:"mono",w:500,size:wr_fs(c,cn,590-cx,18,500,"mono",14),color:rgba(EDGE_,1)});c.strokeStyle=rgba(EDGE_,0.9);c.lineWidth=2.5;c.beginPath();c.moveTo(cx-2,40);c.lineTo(Math.min(596,cx+2+tw(c,cn,wr_fs(c,cn,590-cx,18,500,"mono",14),500,"mono")),40);c.stroke();
    wr_ftag(c,cx,84,V.renamed,EDGE_,590-cx,18);
    T(c,V.readers,46,124,{w:700,size:18,color:rgba(SOFT,1)});
    c.strokeStyle=rgba(WR_CON,0.7);c.lineWidth=2;c.beginPath();c.moveTo(24,62);c.lineTo(24,284);c.stroke();
    [["mart_planning__near_award","planning","census_dashboard",164],["mart_wallet__learners","wallet","wallet_app",224],["mart_wallet__credentials","wallet","wallet_app",284]].forEach(([m,kd,x,y])=>{
      c.beginPath();c.moveTo(24,y-6);c.lineTo(40,y-6);c.stroke();T(c,m,46,y,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});
      arrowTo(c,320,y-6,350,y-6,WR_CON,0.85,{head:9});wr_badge(c,370,y-6,16,kd,null,{});T(c,x,392,y,{w:800,size:18,color:rgba(INK,1)});});
    c.restore();},
  wr_q_fifteen:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    glass(c,4,14,268,292,16,WR_AMB,{glow:14,ea:0.75,fill:"rgba(8,12,22,0.95)"});wr_ftag(c,18,46,V.page,WR_AMB,240,18);
    wrapT(c,"… "+V.within+" …",22,124,232,{w:700,size:22,lh:30,color:rgba(INK,0.95)});wr_ftag(c,18,272,V.pageSays,WR_AMB,240,18);
    T(c,"dbt_project.yml",300,48,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});glass(c,296,66,300,128,14,WEED,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.96)"});
    T(c,"vars:",310,98,{f:"mono",w:500,size:18,color:rgba(INK,0.9)});T(c,"near_award_credit_points:",310,132,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});
    T(c,"20",310,174,{f:"mono",w:700,size:30,color:rgba(WEED,1)});wr_ftag(c,298,232,V.varSays,WEED,298,18);c.restore();},
  wr_q_near:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    const D=w_=>"Credit points the learner has "+w_+" towards the award, from units and microcredentials.";
    [["core_credit_towards_award","held"],["mart_planning__near_award","earned"]].forEach(([m,en],i)=>{const y=6+i*114;glass(c,4,y,592,104,14,KIND,{glow:8,ea:0.7,fill:"rgba(8,12,22,0.95)"});
      const s=m+" · credit_points_earned";T(c,s,18,y+30,{f:"mono",w:500,size:wr_fs(c,s,564,17,500,"mono",14),color:rgba(KIND,1)});wr_para(c,D(en),18,y+62,566,{size:18,lh:24,hl:[[en,1,WR_AMB]]});});
    const cmd="$ python skills/review-metadata/find_repeats.py";T(c,cmd,6,262,{f:"mono",w:500,size:wr_fs(c,cmd,588,17,500,"mono",14),color:rgba(SOFT,1)});
    T(c,V.repeats,6,296,{f:"mono",w:500,size:wr_fs(c,V.repeats,588,18,500,"mono",14),color:rgba(INK,0.95)});c.restore();},
  wr_q_deadline:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    wr_pill(c,8,52,"core_credential v1",SOFT);wr_pill(c,316,52,"core_credential v2",TRUST,{on:1});
    tag(c,300,128,V.warn,WR_AMB,{size:20,align:"center"});arrowTo(c,320,150,374,212,WR_AMB,0.75,{head:11});
    c.strokeStyle=rgba(SOFT,0.6);c.lineWidth=3;c.beginPath();c.moveTo(16,226);c.lineTo(584,226);c.stroke();
    [[80,"13 Oct 2026",SOFT],[380,"31 Mar 2027",WR_AMB],[530,V.after,EDGE_]].forEach(([x,s,col])=>{c.fillStyle=rgba(col,1);c.beginPath();c.arc(x,226,8,0,TAU);c.fill();T(c,s,Math.min(x,592-tw(c,s,18,700)/2),258,{w:700,size:18,align:"center",color:rgba(col,1)});});
    tag(c,530,296,V.removed,EDGE_,{size:18,align:"center"});c.restore();},
  wr_q_log:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    glass(c,6,10,588,236,16,KIND,{glow:10,ea:0.7,fill:"rgba(8,12,22,0.95)"});T(c,"_shared__decisions.yml",26,44,{f:"mono",w:500,size:18,color:rgba(KIND,1)});
    c.fillStyle="rgba(170,200,245,0.2)";c.fillRect(22,60,556,1.5);
    // one decision, as the log keeps it: what was decided, why, and who
    [["- id:",SOFT,110],["  title:",INK,300],["  why:",TRUST,340],["  decided_by:",TRUST,170]].forEach(([k,col,ww],r)=>{const y=98+r*36,kx=26+tw(c,k,18,500,"mono")+12;
      T(c,k,26,y,{f:"mono",w:500,size:18,color:rgba(col===INK?SOFT:col,1)});c.fillStyle=rgba(col,col===TRUST?0.45:0.25);rr(c,kx,y-12,ww,14,5);c.fill();});
    c.strokeStyle=rgba(BAD,0.85);c.lineWidth=4;c.lineCap="round";c.beginPath();c.moveTo(24,112);c.lineTo(576,220);c.stroke();
    tag(c,300,286,V.deleted,BAD,{size:20,align:"center"});c.restore();},
  wr_q_loop:(c,w,h,st,L)=>{const V=L.vis;c.save();wr_fit(c,w,h,600,320);
    glass(c,6,8,588,96,16,WEED,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});wr_badge(c,46,56,22,"wallet",null,{});wrapT(c,V.question,84,48,494,{w:700,size:20,lh:26});
    arrowTo(c,46,110,46,168,WEED,0.8,{head:11});
    [0,1,2,3,4,5].forEach(i=>{const x=46+i*101,y=206,on=i===0;if(on)glow(c,x,y,64,WEED,0.3);c.fillStyle="rgba(7,12,24,0.96)";c.beginPath();c.arc(x,y,28,0,TAU);c.fill();ring(c,x,y,28,on?WEED:SOFT,1,2.5);
      T(c,on?"1":"?",x,y+9,{w:800,size:24,align:"center",color:rgba(on?WEED:SOFT,1)});if(i<5)arrowTo(c,x+32,y,x+68,y,SOFT,0.5,{head:8});});
    T(c,V.order,300,290,{w:700,size:20,align:"center",color:rgba(SOFT,1)});c.restore();}
});
