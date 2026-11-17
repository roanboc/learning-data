// The colour of the five series on enterprise architecture (17 November 2026). They drew on a brown wall, a brown ground for scenes in the
// past and brown date pills, earthy beside their stories; now the wall is a slate blue under a cool light, a scene in the past a night blue,
// and the layers' and the series' colours are clearer. The dark ground behind the diagrams stays as the whole site draws it: no need to
// colour a picture whose ground is already dark (the author, 17 November 2026). Only these series' builds bundle this file, right after
// ea.js, so it sets their look over ea.js and over the helpers the whole site shares (From words to data's histBg and yearTag), which every
// other film keeps as they are. The master data films borrow ea.js for its glyphs and keep its first colours too.
const EA_WALL=["#162b52","#0a1428"];                        // the wall the notes go on: a slate blue
const EA_WALLGLOW=[[0.1,0.9,0.5,[60,180,210],0.06],[0.92,0.1,0.5,[160,110,240],0.06]];   // soft light on it: teal, bottom left; violet, top right
const EA_HIST=["#16204a","#06071a"];                        // a scene in the past
const EA_PILL="rgba(10,14,40,0.9)";                         // the glass of a date's pill
// soft pools of coloured light: [x, y, radius, colour, strength], with x, y and the radius as parts of the frame's width and height
function eaGlow(ctx,pools){pools.forEach(([x,y,r,c,a])=>{const g=ctx.createRadialGradient(W*x,H*y,0,W*x,H*y,W*r);g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);});}
// the six layers and the series' own colour, deeper and clearer than ea.js's first ones
[[188,162,255],[255,196,112],[255,228,96],[255,166,134],[108,200,255],[138,228,118]].forEach((c,i)=>{LAY6[i][1]=c;});
EAC.splice(0,3,104,230,192);
// the wall of canvases and sticky notes (ea.js's wallBg, in slate blue under a cool light)
wallBg=function(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,EA_WALL[0]);g.addColorStop(1,EA_WALL[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){const x=hash(i,31)*W,y=hash(i,32)*H,r=60+hash(i,33)*200,gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,"rgba(190,225,255,"+(0.012+0.02*hash(i,34))+")");gg.addColorStop(1,"rgba(190,225,255,0)");ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  const l=ctx.createRadialGradient(W*0.5,H*0.25,40,W*0.5,H*0.4,W*0.7);l.addColorStop(0,"rgba(150,210,255,"+(o.light==null?0.10:o.light)+")");l.addColorStop(1,"rgba(150,210,255,0)");ctx.fillStyle=l;ctx.fillRect(0,0,W,H);eaGlow(ctx,EA_WALLGLOW);};
// a scene in the past keeps its lamp's warm light and dust, on a night blue
{const histBg0=histBg;histBg=function(ctx,S,t,o){return histBg0(ctx,S,t,Object.assign({top:EA_HIST[0],bottom:EA_HIST[1]},o));};}
// the pills that date a moment (ea.js's eaYear and From words to data's yearTag), on blue glass
eaYear=function(ctx,x,y,s,col,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const c=col||CLAY,w=tw(ctx,s,28,500,"mono")+52;glass(ctx,x,y-30,w,60,30,c,{glow:14,ea:0.8,fill:EA_PILL});
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+24,y,6,0,TAU);ctx.fill();T(ctx,s,x+40,y+10,{f:"mono",w:500,size:28,color:rgba(c,1)});});};
yearTag=function(ctx,x,y,s,col,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const c=col||CLAY,w=tw(ctx,s,20,500,"mono")+40;glass(ctx,x,y-22,w,44,22,c,{glow:14,ea:0.8,fill:EA_PILL});ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+18,y,5,0,TAU);ctx.fill();T(ctx,s,x+30,y+7,{f:"mono",w:500,size:20,color:rgba(c,1)});});};
