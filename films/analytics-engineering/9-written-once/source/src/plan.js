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
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;ctx.shadowOffsetX=8;ctx.shadowOffsetY=12;body(1);const g=ctx.createLinearGradient(-110,-180,110,190);g.addColorStop(0,"#d27a32");g.addColorStop(0.45,"#9a4a1a");g.addColorStop(1,"#4a1e0a");ctx.fillStyle=g;ctx.fill();ctx.restore();
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
// an orchestra player seen from the side, seated, drawn in outline with a soft fill: k is the instrument (violin, cello, oboe, viola)
function wr_player(ctx,x,y,s,k,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||WR_LINE,br=Math.sin(t*1.6+x*0.01)*1.6;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*(o.flip?-1:1),s);
  ctx.lineCap="round";ctx.lineJoin="round";const fill="rgba(40,26,16,0.92)",line=rgba(col,0.85);
  // chair
  ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(-30,-62);ctx.lineTo(18,-62);ctx.lineTo(22,0);ctx.moveTo(-30,-62);ctx.lineTo(-38,-130);ctx.stroke();
  // legs, torso, head: tapering curves
  ctx.fillStyle=fill;ctx.strokeStyle=line;ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(-24,-66);ctx.bezierCurveTo(10,-74,34,-70,40,-62);ctx.lineTo(42,-6);ctx.quadraticCurveTo(46,0,56,0);ctx.lineTo(56,6);ctx.lineTo(30,6);ctx.lineTo(28,-50);ctx.quadraticCurveTo(0,-48,-22,-50);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-26,-64);ctx.bezierCurveTo(-34,-110,-26,-150+br,-6,-160+br);ctx.bezierCurveTo(10,-162+br,18,-150+br,18,-128+br);ctx.bezierCurveTo(16,-100,14,-80,12,-66);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(4,-184+br,17,20,0.15,0,TAU);ctx.fill();ctx.stroke();
  // the arm and instrument
  ctx.strokeStyle=line;ctx.lineWidth=2.4;
  if(k===0||k===3){ctx.beginPath();ctx.ellipse(28,-162+br,30,12,-0.35,0,TAU);ctx.fillStyle="rgba(150,70,28,0.9)";ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(52,-176+br);ctx.lineTo(92,-196+br);ctx.stroke();
    ctx.beginPath();ctx.moveTo(10,-140+br);ctx.quadraticCurveTo(40,-130,70,-150+br);ctx.stroke();ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-10,-120+br+Math.sin(t*1.3+x)*6);ctx.lineTo(70,-180+br);ctx.stroke();}
  else if(k===1){ctx.beginPath();ctx.moveTo(30,-120);ctx.bezierCurveTo(70,-118,72,-60,62,-30);ctx.bezierCurveTo(56,-6,20,-4,14,-30);ctx.bezierCurveTo(6,-60,4,-118,30,-120);ctx.fillStyle="rgba(150,70,28,0.9)";ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(36,-120);ctx.lineTo(30,-200);ctx.moveTo(38,-28);ctx.lineTo(40,4);ctx.stroke();ctx.beginPath();ctx.moveTo(10,-120+br);ctx.quadraticCurveTo(-10,-90,20,-70);ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(18,-182+br);ctx.lineTo(66,-110+br);ctx.lineWidth=4;ctx.stroke();ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(10,-140+br);ctx.quadraticCurveTo(36,-140,46,-140+br);ctx.stroke();}
  ctx.restore();});}

/* ---------- the present: files ---------- */
// a file from the project: its name, a small label saying where it runs, and its lines, typed as p goes from 0 to 1.
// o.lit {line: 0..1} lights whole lines; o.seg [[line, text, a, colour]] lights a phrase; o.wrap wraps long lines (at that many characters);
// o.ins [line, column, text, a, colour] types text into a line; o.cog draws a small cog on its corner (a generated file); o.amb turns its edge amber
function wr_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||31,col=mix(o.edge||[170,205,255],WR_AMB,o.amb||0),cw=tw(ctx,"M",sz,500,"mono");
  const V=[];lines.forEach((l,i)=>{if(!o.wrap||l.length<=o.wrap){V.push({i,s:l});return;}const ind=" ".repeat(l.match(/^\s*/)[0].length+2);let rest=l,first=true;
    while(rest.length){const lim=first?o.wrap:o.wrap-ind.length;if(rest.length<=lim){V.push({i,s:(first?"":ind)+rest});break;}let cut=rest.lastIndexOf(" ",lim);if(cut<=0)cut=lim;V.push({i,s:(first?"":ind)+rest.slice(0,cut)});rest=rest.slice(cut).replace(/^ /,"");first=false;}});
  const h=o.h||(76+V.length*lh);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+17,10,10,3);ctx.fill();T(ctx,name,x+36,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});
    const lab=o.label===undefined?WR_RUN:o.label;if(lab){const lg=o.labelGlow||0;T(ctx,lab,x+w-20-(o.cog?34:0),y+29,{w:700,size:18,align:"right",color:rgba(mix(SOFT,WEED,lg),1)});}
    if(o.cog)wr_cog(ctx,x+w-26,y+24,11,o.t||0,mix(SOFT,WR_AMB,o.amb||0),1,o.spin||0);
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+46,w-28,1.2);
    const n=o.p==null?V.length:V.length*o.p;V.forEach((v,j)=>{if(j>=n)return;const yy=y+80+j*lh,q=clamp(n-j,0,1),src=lines[v.i],cm=/^\s*(--|#|<!--|\*Generated)/.test(src)&&!/^\s*#\s*[A-Z][a-z]+ ?[a-z]*$/.test(src)&&!/^#{1,2} /.test(src),on=o.lit?o.lit[v.i]||0:0;
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.95,6);ctx.fill();});
      const c0=cm?rgba(SOFT,0.85):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95);T(ctx,typeOn(v.s,q),x+22,yy,{f:"mono",w:500,size:sz,color:c0});
      if(o.ins&&o.ins[0]===j&&o.ins[3]>0){const[,c,s,ia,ic]=o.ins,sx=x+22+cw*c,shown=typeOn(s,ia);ctx.fillStyle="rgba(6,10,20,0.98)";ctx.fillRect(sx,yy-sz,cw*(v.s.length-c)+cw*s.length+4,lh*0.9);
        T(ctx,shown,sx,yy,{f:"mono",w:500,size:sz,color:rgba(ic||EDGE_,1)});T(ctx,v.s.slice(c),sx+cw*shown.length,yy,{f:"mono",w:500,size:sz,color:c0});
        if(ia<1&&Math.sin((o.t||0)*8)>0){ctx.fillStyle=rgba(ic||EDGE_,1);ctx.fillRect(sx+cw*shown.length,yy-sz*0.85,2,sz);}}
      (o.seg||[]).forEach(([li,s,sa,sc])=>{if(li!==j||sa<=0)return;const k=v.s.indexOf(s);if(k<0)return;const sx=x+22+cw*k,sw=cw*s.length;
        withA(ctx,sa,()=>{glow(ctx,sx+sw/2,yy-6,sw*0.6,sc,0.22);ctx.fillStyle=rgba(sc,0.16);rr(ctx,sx-4,yy-lh*0.68,sw+8,lh*0.9,6);ctx.fill();T(ctx,s,sx,yy,{f:"mono",w:500,size:sz,color:rgba(sc,1)});});});});});return h;}
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
// o.amb (0..1) turns it amber; o.hl underlines phrases; o.ghost (0..1) shows the small edits behind it; o.pin the agent's flag; o.strike and o.link (the wiki, fixed)
function wr_copy(ctx,x,y,w,h,kind,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const amb=o.amb||0,col=mix([190,205,230],WR_AMB,amb);
  withA(ctx,a,()=>{if(o.ghost>0)for(let k=3;k>=1;k--)withA(ctx,o.ghost*(0.5-k*0.1),()=>{ctx.save();ctx.strokeStyle=rgba(WR_AMB,0.6);ctx.lineWidth=1.5;ctx.setLineDash([5,6]);rr(ctx,x-k*12,y-k*12,w,h,16);ctx.stroke();ctx.restore();
      T(ctx,"edit "+(4-k),x-k*12+14,y-k*12+20,{f:"mono",w:500,size:14,color:rgba(WR_AMB,0.9)});});
    glass(ctx,x,y,w,h,16,col,{glow:10+14*amb,ea:0.75,fill:"rgba(8,12,22,0.95)"});
    tag(ctx,x+16,y+30,kind,col,{size:19});const at="as it drifts",aw=tw(ctx,at,16,700)+26;withA(ctx,0.85,()=>tag(ctx,x+w-16-aw,y+30,at,SOFT,{size:16}));
    if(o.link>0){withA(ctx,o.link,()=>{T(ctx,"award",x+24,y+104,{w:800,size:26});T(ctx,"→ the docs site",x+24,y+144,{w:700,size:24,color:rgba(KIND,1)});ctx.strokeStyle=rgba(KIND,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+152);ctx.lineTo(x+24+tw(ctx,"→ the docs site",24,700),y+152);ctx.stroke();});}
    withA(ctx,1-(o.link||0),()=>wr_para(ctx,text,x+22,y+92,w-44,{size:o.size||21,hl:o.hl,gapA:o.gapA,strike:o.strike||0}));
    if(o.pin>0)kt_flag(ctx,x+w-22,y-8,0.9,o.pin);});}
// Planning's census dashboard, small: its badge, a bar per faculty, and the column the tooltip explains
function wr_dash(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,WR_CON,{glow:10,ea:0.7,fill:"rgba(7,14,18,0.95)"});
  wr_badge(ctx,x+36,y+36,20,"planning",null,{});T(ctx,"census dashboard",x+66,y+44,{w:800,size:20});
  const F=[5,3,2,2];F.forEach((v,i)=>{const bx=x+30+i*((w-60)/4),bw=(w-60)/4-18,bh=v*16;ctx.fillStyle=rgba(WR_CON,0.55);rr(ctx,bx,y+h-30-bh,bw,bh,4);ctx.fill();});
  T(ctx,"award",x+w-24,y+44,{w:700,size:19,align:"right",color:rgba(INK,0.95)});ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle=rgba(INK,0.7);ctx.beginPath();ctx.moveTo(x+w-24-tw(ctx,"award",19,700),y+50);ctx.lineTo(x+w-24,y+50);ctx.stroke();ctx.restore();});}
// a tooltip bubble with a pointer down to (px,py), holding a copy of the definition
function wr_tip(ctx,x,y,w,h,px,py,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=18;ctx.fillStyle="rgba(236,242,250,0.97)";rr(ctx,x,y,w,h,12);ctx.fill();
  ctx.beginPath();ctx.moveTo(px-12,y+h-1);ctx.lineTo(px,py);ctx.lineTo(px+12,y+h-1);ctx.closePath();ctx.fill();ctx.restore();
  tag(ctx,x+16,y+28,"tooltip",[40,90,140],{size:17});const at=o.note||"as it drifts",aw=tw(ctx,at,15,700)+26;withA(ctx,0.85,()=>tag(ctx,x+w-16-aw,y+28,at,[70,90,120],{size:15}));
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
function wr_ci(ctx,x,y,w,name,st,msg,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=st>=1.5?GOOD:st>=0.5?BAD:SOFT,h=msg?92:60;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:8+10*(st>0?1:0),ea:0.7,fill:"rgba(7,12,24,0.95)"});
  const cx=x+32,cy=y+30;if(st>=1.5){ctx.fillStyle="rgba(8,24,16,0.95)";ctx.beginPath();ctx.arc(cx,cy,15,0,TAU);ctx.fill();ring(ctx,cx,cy,15,GOOD,1,2.2);tick_(ctx,cx,cy+1,20,GOOD,1);}
  else if(st>=0.5)kt_rcross(ctx,cx,cy,15,1);else ring(ctx,cx,cy,15,SOFT,0.7,2,[4,4]);
  T(ctx,name,x+62,y+37,{w:700,size:20});if(msg)T(ctx,msg,x+24,y+76,{f:"mono",w:500,size:18,color:rgba(col,1)});});return h;}
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
    if(q>=1){const mx=(x0+x1)/2,my=(y0+y1)/2,dy=k===4?-14:(k===2?-12:-10);T(ctx,lab,mx+(k===1||k===3?12:0),my+dy,{w:600,size:18,align:k===1?"left":k===3?"left":"center",color:rgba(BPL,0.95)});}});
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
// Unity Catalog's page for a table: a search, the table, its description and its columns' comments.
// o.desc (0..1) flows the description in; o.cols (0..1) the columns'; o.edit (0..1) a hand's edit typed over it; o.reset (0..1) the build writing it back
const WR_CCOL=[["award_key","Hash of the award's business key."],["award_name","The award's name."],["credit_points_required","Credit points to complete it."]];
function wr_catalog(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,[170,180,200],{glow:10,ea:0.6,fill:"rgba(12,14,20,0.96)"});
  T(ctx,"Databricks · Unity Catalog",x+24,y+36,{w:700,size:19,color:rgba([170,180,200],1)});
  ctx.fillStyle="rgba(255,255,255,0.06)";rr(ctx,x+24,y+56,w-48,40,10);ctx.fill();T(ctx,"⌕  "+typeOn("award",o.search==null?1:o.search),x+40,y+83,{w:600,size:19,color:rgba(INK,0.9)});
  T(ctx,"credentials.core.core_award",x+24,y+136,{f:"mono",w:500,size:19,color:rgba(INK,1)});T(ctx,"Description",x+24,y+176,{w:700,size:18,color:rgba(SOFT,1)});
  const dy=y+208,full="An award the university offers, as it stood from valid_from until valid_to. Award. A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points.";
  const d=o.desc==null?1:o.desc,ed=o.edit||0,rs=o.reset||0;
  if(d>0){const shown=typeOn(full,d);withA(ctx,1-ed*(1-rs),()=>wr_para(ctx,shown,x+24,dy,w-48,{size:18,color:rgba(mix(INK,KIND,0.25),1)}));
    if(ed*(1-rs)>0)withA(ctx,ed*(1-rs),()=>{const e=typeOn("A degree the university gives on paper.",clamp(ed*1.4,0,1));wr_para(ctx,e,x+24,dy,w-48,{size:18,color:rgba(EDGE_,1)});T(ctx,"edited here, by hand",x+w-24,dy-32,{w:700,size:18,align:"right",color:rgba(EDGE_,1)});});
    if(rs>0&&rs<1){const sx=x+24+(w-48)*rs;glow(ctx,sx,dy+50,90,KIND,0.35);ctx.fillStyle=rgba(KIND,0.6);ctx.fillRect(sx-1,dy-24,2,120);}}
  const cy=y+h-196;T(ctx,"Columns",x+24,cy,{w:700,size:18,color:rgba(SOFT,1)});WR_CCOL.forEach(([c,cm],i)=>{const yy=cy+40+i*44;ctx.fillStyle="rgba(255,255,255,0.04)";rr(ctx,x+20,yy-28,w-40,38,6);ctx.fill();
    T(ctx,c,x+32,yy,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});withA(ctx,clamp((o.cols==null?1:o.cols)*3-i,0,1),()=>T(ctx,cm,x+w-32,yy,{w:600,size:18,align:"right",color:rgba(mix(INK,KIND,0.3),1)}));});});}

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
