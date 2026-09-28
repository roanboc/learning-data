/* ===== What's in a word: the beasts =====
   The vervet monkeys and their hunters (a leopard, a snake), the animals with names (a dolphin, an elephant, a marmoset), and the gavagai rabbit.
   Each takes (ctx, x, y, size, colour, options), drawn with icon() from whats.js; options.a fades it. */
const P_MONKEY=c=>{c.ellipse(0,20,20,28,0,0,TAU);c.moveTo(16,-18);c.arc(0,-18,16,0,TAU);c.moveTo(-16,40);c.bezierCurveTo(-46,52,-58,20,-40,6);};
const D_MONKEY=c=>{c.ellipse(0,-15,9,8,0,0,TAU);c.moveTo(-16,-22);c.arc(-17,-22,4,0,TAU);c.moveTo(20,-22);c.arc(17,-22,4,0,TAU);};
const monkey=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_MONKEY,col||[220,200,170],Object.assign({detail:D_MONKEY,eye:[4,-18,2.2]},o));
const P_LEOPARD=c=>{c.moveTo(-50,-4);c.bezierCurveTo(-30,-20,20,-22,42,-12);c.lineTo(52,-22);c.bezierCurveTo(60,-30,76,-28,80,-18);c.bezierCurveTo(84,-10,76,-4,68,-4);c.lineTo(56,0);c.lineTo(50,10);c.lineTo(52,42);c.lineTo(44,42);c.lineTo(40,14);c.lineTo(36,14);c.lineTo(34,42);c.lineTo(27,42);c.lineTo(26,12);c.bezierCurveTo(0,16,-20,16,-34,12);c.lineTo(-36,42);c.lineTo(-44,42);c.lineTo(-46,10);c.bezierCurveTo(-60,6,-70,-10,-90,-20);c.bezierCurveTo(-72,-4,-60,-2,-50,-4);};
const D_SPOTS=c=>{for(let i=0;i<12;i++){const x=-40+(i%6)*14+(i>5?6:0),y=-10+(i>5?10:0);c.moveTo(x+3,y);c.arc(x,y,3,0,TAU);}};
const leopard=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_LEOPARD,col||LEO,Object.assign({detail:D_SPOTS,eye:[72,-18,2]},o));
const P_SNAKE=c=>{c.moveTo(-70,10);c.bezierCurveTo(-50,-20,-30,30,-10,0);c.bezierCurveTo(10,-30,30,20,50,-4);c.bezierCurveTo(58,-12,70,-12,74,-4);c.bezierCurveTo(70,4,60,6,52,4);c.bezierCurveTo(32,30,10,-18,-6,10);c.bezierCurveTo(-26,40,-48,-6,-66,16);c.closePath();};
const snake=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_SNAKE,col||SNK,Object.assign({eye:[64,-6,2]},o));
const P_DOLPHIN=c=>{c.moveTo(-70,8);c.bezierCurveTo(-40,-26,20,-30,54,-8);c.lineTo(80,-2);c.lineTo(56,4);c.bezierCurveTo(30,18,-10,16,-40,10);c.lineTo(-62,24);c.lineTo(-58,10);c.lineTo(-80,0);c.closePath();c.moveTo(-6,-22);c.lineTo(-18,-44);c.lineTo(8,-24);};
const dolphin=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_DOLPHIN,col||[120,210,255],Object.assign({eye:[46,-8,2.2]},o));
const P_ELEPHANT=c=>{c.moveTo(-60,-20);c.bezierCurveTo(-60,-50,20,-54,30,-28);c.bezierCurveTo(44,-44,70,-36,68,-10);c.bezierCurveTo(68,8,70,26,78,34);c.lineTo(70,36);c.bezierCurveTo(60,24,56,10,54,0);c.lineTo(40,4);c.lineTo(40,40);c.lineTo(26,40);c.lineTo(24,10);c.lineTo(-30,10);c.lineTo(-32,40);c.lineTo(-46,40);c.lineTo(-48,8);c.bezierCurveTo(-62,4,-64,-8,-60,-20);};
const elephant=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_ELEPHANT,col||[190,200,220],Object.assign({detail:c=>{c.moveTo(34,-28);c.bezierCurveTo(24,-10,34,6,46,0);},eye:[52,-20,2]},o));
const marmoset=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_MONKEY,col||[230,210,180],Object.assign({detail:c=>{D_MONKEY(c);c.moveTo(-14,-30);c.lineTo(-24,-42);c.moveTo(14,-30);c.lineTo(24,-42);},eye:[4,-18,2]},o));
const P_RABBIT=c=>{c.ellipse(0,8,34,20,-0.1,0,TAU);c.moveTo(44,-10);c.arc(34,-12,13,0,TAU);c.moveTo(30,-22);c.ellipse(24,-44,6,20,-0.45,0,TAU);c.moveTo(40,-22);c.ellipse(36,-46,6,20,-0.2,0,TAU);c.moveTo(-30,4);c.arc(-36,4,7,0,TAU);};
function rabbit(ctx,x,y,s,col,t,o){o=o||{};const h=Math.abs(Math.sin(t*6))*18*(o.run==null?1:o.run);icon(ctx,x,y-h*s,s,P_RABBIT,col||[230,220,200],Object.assign({eye:[38,-14,2.2],detail:c=>{c.moveTo(-14,22);c.lineTo(-30,34+(h>8?-6:4));c.moveTo(18,22);c.lineTo(30,34+(h>8?4:-6));}},o));}
