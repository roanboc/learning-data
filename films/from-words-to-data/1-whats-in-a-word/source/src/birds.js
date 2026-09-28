/* ===== What's in a word: the birds =====
   The pigeons that sorted photos, a honeybee, the eagle the vervets fear, and the birds of the category "bird": a robin, a sparrow, a penguin and an ostrich.
   Each is drawn with icon() from whats.js; options.a fades it. */
const P_PIGEON=c=>{c.ellipse(0,6,34,22,-0.15,0,TAU);c.moveTo(38,-22);c.arc(28,-22,12,0,TAU);c.moveTo(-30,4);c.lineTo(-58,-2);c.lineTo(-54,16);c.lineTo(-28,14);};
const D_PIGEON=c=>{c.moveTo(38,-24);c.lineTo(48,-20);c.lineTo(38,-17);c.moveTo(-6,-4);c.quadraticCurveTo(10,10,-14,18);c.moveTo(0,26);c.lineTo(-2,42);c.moveTo(10,26);c.lineTo(12,42);};
const pigeon=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_PIGEON,col||[200,215,240],Object.assign({detail:D_PIGEON,eye:[31,-24,2.4]},o));
const P_BEE=c=>{c.ellipse(0,0,26,15,0,0,TAU);c.moveTo(38,0);c.arc(30,0,9,0,TAU);};
const D_BEE=c=>{[-10,0,10].forEach(x=>{c.moveTo(x,-14);c.lineTo(x,14);});c.moveTo(34,-7);c.quadraticCurveTo(40,-20,46,-22);c.moveTo(36,-6);c.quadraticCurveTo(46,-14,52,-12);};
function bee(ctx,x,y,s,t,o){o=o||{};const col=o.col||[255,214,90];withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.translate(x,y);const fl=Math.sin(t*60)*0.35;ctx.fillStyle="rgba(200,230,255,0.28)";ctx.strokeStyle="rgba(200,230,255,0.7)";ctx.lineWidth=1.4;
  [[-6,-18],[6,-20]].forEach(([wx,wy],i)=>{ctx.save();ctx.translate(wx*s,wy*s);ctx.rotate(-0.5+fl*(i?1:-1)*0.5);ctx.beginPath();ctx.ellipse(0,-6*s,9*s,16*s,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore();});ctx.restore();
  icon(ctx,x,y,s,P_BEE,col,{detail:D_BEE,eye:[33,-2,2]});});}
const P_EAGLE=c=>{c.moveTo(0,-8);c.bezierCurveTo(-20,-30,-60,-34,-86,-20);c.lineTo(-70,-12);c.lineTo(-80,-2);c.lineTo(-60,0);c.lineTo(-66,10);c.bezierCurveTo(-40,4,-14,6,-6,14);c.lineTo(-8,34);c.lineTo(0,28);c.lineTo(8,34);c.lineTo(6,14);c.bezierCurveTo(14,6,40,4,66,10);c.lineTo(60,0);c.lineTo(80,-2);c.lineTo(70,-12);c.lineTo(86,-20);c.bezierCurveTo(60,-34,20,-30,0,-8);};
const eagle=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_EAGLE,col||EAG,Object.assign({detail:c=>{c.moveTo(0,-8);c.arc(0,-14,6,0,TAU);}},o));
const P_ROBIN=c=>{c.ellipse(0,4,26,22,0,0,TAU);c.moveTo(30,-16);c.arc(22,-16,11,0,TAU);c.moveTo(-22,0);c.lineTo(-44,-8);c.lineTo(-40,8);};
function robin(ctx,x,y,s,o){o=o||{};icon(ctx,x,y,s,P_ROBIN,o.col||[255,160,110],Object.assign({eye:[25,-18,2],detail:c=>{c.moveTo(33,-17);c.lineTo(40,-15);c.lineTo(33,-13);}},o));
  if(o.breast!==false)withA(ctx,o.a==null?1:o.a,()=>{ctx.fillStyle="rgba(255,120,70,0.75)";ctx.beginPath();ctx.ellipse(x+14*s,y+2*s,11*s,13*s,0,0,TAU);ctx.fill();});}
const sparrow=(ctx,x,y,s,o)=>icon(ctx,x,y,s,P_ROBIN,[210,170,120],Object.assign({eye:[25,-18,2],detail:c=>{c.moveTo(33,-17);c.lineTo(40,-15);c.lineTo(33,-13);c.moveTo(-10,-6);c.lineTo(4,4);c.moveTo(-14,4);c.lineTo(0,12);}},o));
const P_PENGUIN=c=>{c.ellipse(0,6,22,36,0,0,TAU);c.moveTo(14,-36);c.arc(0,-36,14,0,TAU);c.moveTo(-20,0);c.lineTo(-30,18);c.lineTo(-20,14);c.moveTo(20,0);c.lineTo(30,18);c.lineTo(20,14);};
const penguin=(ctx,x,y,s,o)=>icon(ctx,x,y,s,P_PENGUIN,[200,220,245],Object.assign({eye:[5,-38,2],detail:c=>{c.ellipse(0,10,12,26,0,0,TAU);c.moveTo(12,-36);c.lineTo(20,-33);c.lineTo(12,-30);}},o));
const P_OSTRICH=c=>{c.ellipse(-6,0,30,20,0,0,TAU);c.moveTo(16,-8);c.bezierCurveTo(24,-30,20,-50,24,-62);c.arc(28,-64,6,Math.PI,TAU+1);c.lineTo(38,-62);c.moveTo(-10,18);c.lineTo(-14,54);c.moveTo(4,18);c.lineTo(8,54);};
const ostrich=(ctx,x,y,s,o)=>icon(ctx,x,y,s,P_OSTRICH,[220,200,180],Object.assign({eye:[28,-65,1.8]},o));
