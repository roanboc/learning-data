/* ===== One list, not twenty: the Rhine from 1792, and Aboukir, 1799 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix ol_). Nothing here is a likeness of a real person or a copy of an engraving: the valley, the field and the carriage are drawn
   plainly, from what Larrey's memoirs say of them (Hall's translation, 1814), in this film's own style. The wounded are marks on a plan,
   never bodies, and there is no blood.
     olRhine       the Rhine's valley in autumn, low hills and a far village, a rise in front where Larrey stands
     olPlan        the field from above, drawn on paper like a plan, its river at the top: the fighting, the ambulance and what moves are
                   drawn live on it (ol_plan)
     olBay         the same kind of plan of the coast at Aboukir, the sea on two sides
     olWall        a limewashed wall in grey light, where Larrey's design is pinned (ol_plate)
     ol_plan       on a plan: the fighting, the army's line, the field hospital a league behind, the wounded, the wagons, the flying
                   ambulances and their carriages, the surgeons' tent and who reaches it first
     ol_plate      the flying ambulance drawn as a plate: a light carriage on springs, side on, as Larrey describes it
     ol_larrey     Larrey: a young surgeon in a dark coat with a high collar, a white neckcloth wound round his neck
   Colour keeps the module's meaning: the flying ambulance, Larrey's design, in blue; the wounded waiting, and what waiting costs, in
   amber; help that came in time in green. The places wear none of the five. */

const OL_K={sky0:[200,210,214],sky1:[240,230,210],hillFar:[178,184,180],hill:[148,152,138],river:[192,202,200],riverHi:[222,228,224],
  field:[178,166,124],fieldDk:[148,138,100],grass:[132,128,96],grassDk:[104,100,74],tree:[124,112,80],treeDk:[90,84,62],roof:[146,108,88],
  lime:[228,218,200],paper:[242,236,222],paperDk:[222,212,192],grid:[214,204,184],pen:[96,86,78],road:[222,208,178],
  sea:[190,202,200],seaDk:[164,180,180],sand:[228,212,178],sandDk:[206,188,150]};

/* ---------------------------------------------------------------- the Rhine's valley, autumn 1792 */
function ol_tree(c,x,base,h,R,col){const r=h*0.3;c.fillStyle=rgba(OL_K.treeDk,1);c.fillRect(x-3,base-h*0.5,6,h*0.5);
  for(let k=0;k<6;k++){const an=k/6*TAU,dx=Math.cos(an)*r*0.5,dy=Math.sin(an)*r*0.32,rr2=r*(0.5+R()*0.22);
    const g=c.createRadialGradient(x+dx+rr2*0.35,base-h*0.68+dy-rr2*0.3,2,x+dx,base-h*0.68+dy,rr2);g.addColorStop(0,rgba(ag_lt(col||OL_K.tree,0.2),1));g.addColorStop(1,rgba(OL_K.treeDk,1));
    c.fillStyle=g;c.beginPath();c.arc(x+dx,base-h*0.68+dy,rr2,0,TAU);c.fill();}}
AG_PLACES.olRhine=c=>{const R=ag_rnd(1792),hz=560;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(OL_K.sky0,1));g.addColorStop(1,rgba(OL_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(1640,140,20,1640,140,900);g.addColorStop(0,"rgba(255,238,206,0.55)");g.addColorStop(1,"rgba(255,238,206,0)");c.fillStyle=g;c.fillRect(0,0,W,hz+200);
  // the far hills across the river, then the nearer ones
  const ridge=(y0,amp,col,seed)=>{const r=ag_rnd(seed);c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);c.lineTo(0,y0);
    for(let x=0;x<=W;x+=60)c.lineTo(x,y0-amp*(0.5+0.5*Math.sin(x/260+seed))-r()*14);c.lineTo(W,H);c.closePath();c.fill();};
  ridge(470,70,OL_K.hillFar,3);ridge(520,46,mix(OL_K.hill,OL_K.hillFar,0.4),7);
  // the valley floor: fields in long strips, the river winding across it
  g=c.createLinearGradient(0,540,0,H);g.addColorStop(0,rgba(OL_K.field,1));g.addColorStop(1,rgba(OL_K.fieldDk,1));c.fillStyle=g;c.fillRect(0,548,W,H-548);
  for(let k=0;k<26;k++){const y=560+R()*170,x=R()*W,w=160+R()*260;c.fillStyle=rgba(mix(OL_K.field,k%2?OL_K.grass:OL_K.fieldDk,0.35+R()*0.3),0.55);c.fillRect(x,y,w,8+R()*16);}
  c.strokeStyle=rgba(OL_K.river,1);c.lineWidth=46;c.lineCap="round";c.beginPath();c.moveTo(-40,600);c.bezierCurveTo(420,560,640,660,1000,620);c.bezierCurveTo(1300,588,1560,640,1980,600);c.stroke();
  c.strokeStyle=rgba(OL_K.riverHi,0.7);c.lineWidth=6;c.beginPath();c.moveTo(-40,592);c.bezierCurveTo(420,552,640,652,1000,612);c.bezierCurveTo(1300,580,1560,632,1980,592);c.stroke();
  // a village on the far bank: low roofs and a church's spire, all pale with distance
  for(let k=0;k<9;k++){const x=1240+k*42+R()*12,h=22+R()*14;c.fillStyle=rgba(mix(OL_K.lime,OL_K.hillFar,0.35),1);c.fillRect(x,560-h,34,h);
    c.fillStyle=rgba(mix(OL_K.roof,OL_K.hillFar,0.45),1);c.beginPath();c.moveTo(x-4,560-h);c.lineTo(x+17,560-h-14);c.lineTo(x+38,560-h);c.closePath();c.fill();}
  c.fillStyle=rgba(mix(OL_K.lime,OL_K.hillFar,0.3),1);c.fillRect(1428,486,22,74);c.fillStyle=rgba(mix(OL_K.roof,OL_K.hillFar,0.4),1);c.beginPath();c.moveTo(1424,486);c.lineTo(1439,438);c.lineTo(1454,486);c.closePath();c.fill();
  // autumn trees along the banks
  for(const [x,h] of [[160,150],[290,120],[620,110],[860,130],[1120,100],[1700,140],[1820,120]])ol_tree(c,x,600+R()*40,h,R,mix(OL_K.tree,[150,120,70],R()*0.5));
  // the rise in front, where Larrey stands
  g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba(OL_K.grass,1));g.addColorStop(1,rgba(OL_K.grassDk,1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,H);c.lineTo(0,760);c.bezierCurveTo(500,700,1100,730,1400,780);c.bezierCurveTo(1640,820,1820,800,W,790);c.lineTo(W,H);c.closePath();c.fill();
  c.fillStyle=rgba(LP.shade,0.08);c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the field from above, as a plan */
function ol_paper(c,seed){const R=ag_rnd(seed);let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(ag_lt(OL_K.paper,0.2),1));g.addColorStop(1,rgba(OL_K.paperDk,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.strokeStyle=rgba(OL_K.grid,0.55);c.lineWidth=1.5;for(let x=0;x<=W;x+=120){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<=H;y+=120){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let k=0;k<60;k++){c.fillStyle=rgba(mix(OL_K.field,OL_K.paper,0.55+R()*0.3),0.35);c.fillRect(R()*W,R()*H,90+R()*180,50+R()*90);}
  g=c.createRadialGradient(1700,120,40,1700,120,1300);g.addColorStop(0,"rgba(255,238,206,0.28)");g.addColorStop(1,"rgba(255,238,206,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the plan's fixed lines: where the road runs from the field hospital up to the fighting
const OL_P={road:[[960,850],[950,640],[968,430],[960,330]],amb:[960,780],line:[300,250,1620,340],post:[960,420],tent:[960,560]};
AG_PLACES.olPlan=c=>{ol_paper(c,1793);
  c.strokeStyle=rgba(OL_K.river,1);c.lineWidth=40;c.lineCap="round";c.beginPath();c.moveTo(-40,46);c.bezierCurveTo(500,22,1200,70,1980,34);c.stroke();
  c.strokeStyle=rgba(OL_K.riverHi,0.8);c.lineWidth=4;c.beginPath();c.moveTo(-40,40);c.bezierCurveTo(500,16,1200,64,1980,28);c.stroke();
  c.strokeStyle=rgba(OL_K.road,1);c.lineWidth=22;c.beginPath();const r=OL_P.road;c.moveTo(r[0][0],r[0][1]);c.bezierCurveTo(r[1][0],r[1][1],r[2][0],r[2][1],r[3][0],r[3][1]);c.stroke();
  c.strokeStyle=rgba(OL_K.pen,0.25);c.lineWidth=2;c.stroke();};
AG_PLACES.olBay=c=>{ol_paper(c,1799);const R=ag_rnd(17);
  // the sea along the top and down the right, the shore curving between
  c.fillStyle=rgba(OL_K.sea,1);c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,H);c.lineTo(1700,H);c.bezierCurveTo(1660,700,1720,420,1500,300);c.bezierCurveTo(1200,150,600,230,0,190);c.closePath();c.fill();
  c.strokeStyle=rgba(OL_K.seaDk,0.6);c.lineWidth=3;for(let k=1;k<4;k++){c.beginPath();c.moveTo(0,190-k*30);c.bezierCurveTo(600,230-k*34,1200,150-k*30,1500+k*24,300-k*10);c.bezierCurveTo(1720+k*20,420,1660+k*24,700,1700+k*26,H);c.stroke();}
  c.fillStyle=rgba(OL_K.sand,0.7);for(let k=0;k<40;k++){c.fillRect(R()*1500,260+R()*620,60+R()*120,20+R()*40);}};

// a small tent, seen from above and a little from the side: the field hospital, or the surgeons' tent
function ol_tent(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="rgba(52,44,52,0.18)";ctx.beginPath();ctx.moveTo(-40,26);ctx.lineTo(-6,-28);ctx.lineTo(48,26);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(col||[236,228,212],1);ctx.strokeStyle=rgba(OL_K.pen,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-44,22);ctx.lineTo(0,-30);ctx.lineTo(44,22);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba(OL_K.pen,0.75);ctx.beginPath();ctx.moveTo(-10,22);ctx.lineTo(0,2);ctx.lineTo(10,22);ctx.closePath();ctx.fill();ctx.restore();}
// a carriage from above: a rounded body on two wheels; a flying ambulance in blue (Larrey's design), or, in col, the old field hospital's
function ol_cart(ctx,x,y,an,s,col){col=col||LP.blue;ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.scale(s||1,s||1);ctx.fillStyle="rgba(52,44,52,0.22)";rr(ctx,-20,-9,44,24,8);ctx.fill();
  ctx.fillStyle=rgba(OL_K.pen,1);ctx.fillRect(-10,-16,8,32);ctx.fillStyle=rgba(col,1);rr(ctx,-22,-12,40,24,9);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(18,-6);ctx.lineTo(34,-6);ctx.moveTo(18,6);ctx.lineTo(34,6);ctx.stroke();ctx.restore();}
// the wounded where they fell, the same in every battle drawn: seeded, inside the fighting
function ol_fallen(seed,n,box){const R=ag_rnd(seed),out=[];for(let i=0;i<n;i++)out.push([box[0]+R()*(box[2]-box[0]),box[1]+R()*(box[3]-box[1]),R()]);return out;}
const OL_FALLEN=ol_fallen(30,26,[360,238,1560,352]);
// one of the wounded: an amber mark while they wait (o.dim fades it to a hollow grey ring: help never came), green once helped (o.ok)
function ol_wound(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const r=o.r||11,ok=clamp(o.ok||0,0,1),dim=clamp(o.dim||0,0,1);
  const col=mix(LP.amber,LP.green,ok);ctx.fillStyle=rgba(col,1-dim*0.85);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  if(dim>0){ctx.strokeStyle=rgba(mix(col,[120,112,104],dim),0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();}
  ctx.restore();}
// the fighting: a band of short pen strokes across the field, between the two lines (o.a fades it, o.t stirs it a little)
function ol_fight(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const [x0,y0,x1,y1]=OL_P.line,R=ag_rnd(9);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(OL_K.pen,0.08);rr(ctx,x0,y0,x1-x0,y1-y0,24);ctx.fill();
  ctx.strokeStyle=rgba(OL_K.pen,0.45);ctx.lineWidth=3;ctx.lineCap="round";for(let k=0;k<70;k++){const x=x0+30+R()*(x1-x0-60),y=y0+16+R()*(y1-y0-32),an=R()*TAU;
    ctx.beginPath();ctx.moveTo(x-Math.cos(an)*9,y-Math.sin(an)*9);ctx.lineTo(x+Math.cos(an)*9,y+Math.sin(an)*9);ctx.stroke();}
  // the army's line just behind it: a row of small blocks
  ctx.fillStyle=rgba(OL_K.pen,0.7);for(let x=x0+40;x<x1-40;x+=64)ctx.fillRect(x,y1+14,40,12);
  ctx.restore();}
// the road's point at u (0 at the field hospital, 1 at the fighting)
function ol_roadAt(u){const r=OL_P.road,k=1-u;const f=(i)=>k*k*k*r[0][i]+3*k*k*u*r[1][i]+3*k*u*u*r[2][i]+u*u*u*r[3][i];return[f(0),f(1)];}
// the army's wagons on the road, between the field hospital and the fighting
function ol_wagons(ctx,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;for(const u of [0.2,0.29,0.38,0.47,0.56,0.65,0.74]){const p=ol_roadAt(u);
  ctx.fillStyle="rgba(52,44,52,0.2)";rr(ctx,p[0]-13,p[1]-14,24,36,7);ctx.fill();ctx.fillStyle=rgba(OL_K.pen,1);for(const [dx,dy] of [[-15,-12],[11,-12],[-15,6],[11,6]])ctx.fillRect(p[0]+dx,p[1]+dy,4,9);
  ctx.fillStyle=rgba(mix(OL_K.road,OL_K.roof,0.45),1);ctx.strokeStyle=rgba(OL_K.pen,0.8);ctx.lineWidth=2;rr(ctx,p[0]-11,p[1]-17,22,34,7);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(p[0],p[1]-17);ctx.lineTo(p[0],p[1]-26);ctx.stroke();}ctx.restore();}
// a dimension line, as on a plan: from (x, y0) to (x, y1), with its words beside it
function ol_dim(ctx,x,y0,y1,a,top,sub){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(OL_K.pen,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();
  for(const [y,d] of [[y0,1],[y1,-1]]){ctx.beginPath();ctx.moveTo(x-14,y);ctx.lineTo(x+14,y);ctx.moveTo(x-9,y+d*16);ctx.lineTo(x,y);ctx.lineTo(x+9,y+d*16);ctx.stroke();}
  const m=(y0+y1)/2;lp_T(ctx,top,x+30,m-8,{w:800,size:40});lp_T(ctx,sub,x+30,m+34,{w:600,size:28,col:LP.mut});ctx.restore();}

/* ---------------------------------------------------------------- the flying ambulance, drawn as a plate */
// side on, on a sheet: an elongated body curved on top, with two small windows and a door at the back, hung on springs over two
// wheels, the shafts out in front for two horses; inside it, dashed, the sliding floor with its mattress where two lie at full length.
// o.u (0 to 1: the drawing draws itself), o.notes (0 to 1 each: [springs, two lie, horses]), o.bare (only the drawing: no words, for a
// small framed copy), o.a, o.k, o.light
function ol_plate(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.6;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light,pin:!o.bare});
  if(!o.bare){lp_label(ctx,x+44,y+80,"Larrey's design",{col:LP.blue});lp_T(ctx,"A flying ambulance",x+44,y+136,{w:800,size:40});}
  const u=clamp(o.u==null?1:o.u,0,1),s=w/1240,ox=x+150*s,oy=y+170*s;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);
  const stroke=(k)=>{ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";ctx.globalAlpha*=1;ctx.setLineDash([]);return clamp(u*5-k,0,1);};
  // the body: an elongated box, curved on top
  let p=stroke(0);if(p>0){ctx.save();ctx.globalAlpha*=p;ctx.fillStyle=rgba(LP.blue,0.08);ctx.beginPath();ctx.moveTo(120,330);ctx.lineTo(120,190);ctx.bezierCurveTo(120,120,200,100,380,100);ctx.bezierCurveTo(560,100,640,120,640,190);ctx.lineTo(640,330);ctx.closePath();ctx.fill();ctx.stroke();
    for(const wx of [230,450]){rr(ctx,wx,160,80,56,10);ctx.stroke();}ctx.beginPath();ctx.moveTo(150,170);ctx.lineTo(150,320);ctx.stroke();ctx.restore();}
  // inside, dashed: the sliding floor and its mattress, two lying at full length
  p=stroke(1);if(p>0){ctx.save();ctx.globalAlpha*=p;ctx.setLineDash([12,10]);ctx.lineWidth=3;rr(ctx,150,290,470,30,8);ctx.stroke();for(const yy of [266,236]){ctx.beginPath();ctx.moveTo(176,yy);ctx.lineTo(590,yy);ctx.stroke();}ctx.restore();}
  // the springs: two curved leaves under the body, over the axle
  p=stroke(2);if(p>0){ctx.save();ctx.globalAlpha*=p;for(const sx of [250,520]){ctx.beginPath();ctx.ellipse(sx,352,70,16,0,0,TAU);ctx.stroke();}ctx.beginPath();ctx.moveTo(250,368);ctx.lineTo(520,368);ctx.stroke();ctx.restore();}
  // the wheel, large and light, with its spokes
  p=stroke(3);if(p>0){ctx.save();ctx.globalAlpha*=p;ctx.beginPath();ctx.arc(385,420,120,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(385,420,16,0,TAU);ctx.stroke();
    for(let k=0;k<12;k++){const an=k/12*TAU;ctx.beginPath();ctx.moveTo(385+Math.cos(an)*16,420+Math.sin(an)*16);ctx.lineTo(385+Math.cos(an)*116,420+Math.sin(an)*116);ctx.stroke();}ctx.restore();}
  // the shafts, out in front, for two horses
  p=stroke(4);if(p>0){ctx.save();ctx.globalAlpha*=p;ctx.beginPath();ctx.moveTo(640,300);ctx.bezierCurveTo(760,300,860,320,1010,352);ctx.moveTo(640,322);ctx.bezierCurveTo(760,330,860,350,1010,378);ctx.stroke();
    ctx.beginPath();ctx.moveTo(1010,342);ctx.lineTo(1010,390);ctx.stroke();ctx.restore();}
  ctx.restore();
  // its notes, each joined to what it names
  const notes=o.bare?[0,0,0]:(o.notes||[0,0,0]),note=(k,tx,ty,px,py,text)=>{const q=clamp(notes[k],0,1);if(q<=0.004)return;ctx.save();ctx.globalAlpha*=q;
    ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle=rgba(LP.mut,1);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();
    lp_T(ctx,text,tx+(tx<px?-10:10),ty+10,{w:700,size:28,align:tx<px?"right":"left"});ctx.restore();};
  note(0,ox+760*s,oy+470*s,ox+540*s,oy+356*s,"Light, on springs");
  note(1,ox+720*s,oy+58*s,ox+520*s,oy+250*s,"Two lie at full length");
  note(2,ox+880*s,oy+232*s,ox+940*s,oy+362*s,"Two horses");
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the surgeons' tent at Jena, and who reaches it first */
// the walking wounded (small ink marks) arrive along the paths and fill the tent first; the worst wounded (amber, on stretchers) wait
// outside. o.walk (0 to 1: the walking come in), o.order (0 to 1: Larrey's order, the worst carried in first and the others stepping
// back to wait), o.a
const OL_WALK=(()=>{const R=ag_rnd(1806),out=[];for(let i=0;i<14;i++){const an=-Math.PI*0.15-R()*Math.PI*0.7;out.push({from:[OL_P.tent[0]+Math.cos(an)*520,OL_P.tent[1]-260+Math.sin(an)*120],
  seat:[OL_P.tent[0]-90+(i%5)*45,OL_P.tent[1]-20+Math.floor(i/5)*36],wait:[OL_P.tent[0]+260+(i%4)*44,OL_P.tent[1]+190+Math.floor(i/4)*40],d:R()*0.4});}return out;})();
const OL_WORST=[[-300,200],[-240,236],[-180,206],[-330,262],[-250,292],[-170,262]].map(([dx,dy],i)=>({wait:[OL_P.tent[0]+dx,OL_P.tent[1]+dy],seat:[OL_P.tent[0]-70+(i%3)*70,OL_P.tent[1]-24+Math.floor(i/3)*48]}));
function ol_jena(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const [tx,ty]=OL_P.tent,wk=clamp(o.walk||0,0,1),od=clamp(o.order||0,0,1);
  // the tent, large: its floor where the surgeons work
  ctx.fillStyle="rgba(52,44,52,0.16)";rr(ctx,tx-168,ty-96,356,214,18);ctx.fill();
  ctx.save();rr(ctx,tx-180,ty-108,360,210,18);ctx.clip();ctx.fillStyle=rgba([242,236,222],1);ctx.fillRect(tx-180,ty-108,360,105);
  ctx.fillStyle=rgba([226,216,196],1);ctx.fillRect(tx-180,ty-3,360,105);ctx.restore();
  ctx.strokeStyle=rgba(OL_K.pen,1);ctx.lineWidth=3;rr(ctx,tx-180,ty-108,360,210,18);ctx.stroke();ctx.beginPath();ctx.moveTo(tx-180,ty-3);ctx.lineTo(tx+180,ty-3);ctx.stroke();
  ctx.fillStyle=rgba(OL_K.pen,1);for(const px of [tx-180,tx+180]){ctx.beginPath();ctx.arc(px,ty-3,6,0,TAU);ctx.fill();}
  ctx.strokeStyle=rgba(OL_K.pen,0.45);ctx.lineWidth=2;for(const [px,py,qx,qy] of [[tx-180,ty-3,tx-226,ty-3],[tx+180,ty-3,tx+226,ty-3]]){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(qx,qy);ctx.stroke();}
  ctx.fillStyle=rgba(OL_K.paper,1);ctx.fillRect(tx-40,ty+96,80,14);
  // the worst wounded: waiting outside on stretchers, then carried in first
  OL_WORST.forEach((p,i)=>{const k=ag_sine(clamp(od*1.6-i*0.1,0,1)),x=lerp(p.wait[0],p.seat[0],k),y=lerp(p.wait[1],p.seat[1],k);
    ctx.fillStyle=rgba(OL_K.pen,0.55);ctx.fillRect(x-20,y+12,40,6);ol_wound(ctx,x,y,{r:13,ok:k>0.98?1:0});});
  // the walking wounded: in first, then out again to wait their turn
  OL_WALK.forEach((p,i)=>{const k=ag_sine(clamp((wk-p.d*0.5)*1.6,0,1)),back=ag_sine(clamp(od*1.6-0.3-i*0.03,0,1));
    let x=lerp(p.from[0],p.seat[0],k),y=lerp(p.from[1],p.seat[1],k);x=lerp(x,p.wait[0],back);y=lerp(y,p.wait[1],back);
    if(k<=0.001)return;ctx.fillStyle=rgba(OL_K.pen,1);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- Larrey */
// a young surgeon in a dark coat with a high collar (the kit's tunic); over it, drawn as its own picture in the same figure space, the
// coat's collar standing up behind the neck and a white neckcloth wound round it, its knot at the throat and its two short ends over the
// coat. He never fades within a shot (he comes and goes with the shot), so the cloth drawn over him can't show him through it.
const OL_LARREY={key:"olLarrey",name:"Dominique-Jean Larrey",skin:[232,198,172],hair:{style:"side",c:[56,40,34]},top:{kind:"tunic",c:[82,60,50]},breath:0.27};
function ol_larrey(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;lp_person(ctx,OL_LARREY,x,y,s,o);
  const A=AG_FIG.anchor,br=Math.sin((o.t||0)*TAU*OL_LARREY.breath)*2.2*0.85,w=[242,238,230],sh=o.flip?[236,230,222]:[248,246,240],cc0=OL_LARREY.top.c;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-A[0],-A[1]+br);
  ag_soft(ctx,cc=>{cc.moveTo(214,604);cc.bezierCurveTo(208,572,214,540,232,520);cc.bezierCurveTo(240,548,246,580,262,606);cc.bezierCurveTo(300,626,340,628,370,612);cc.lineTo(372,628);cc.bezierCurveTo(330,646,270,640,214,604);cc.closePath();},ag_lt(cc0,0.04),ag_lt(cc0,0.3),300,600,120,rgba(ag_dk(cc0,0.7),0.4),6);
  ag_soft(ctx,cc=>{cc.moveTo(234,500);cc.bezierCurveTo(262,522,316,532,356,518);cc.bezierCurveTo(362,546,364,580,360,604);cc.bezierCurveTo(318,618,262,608,236,582);cc.bezierCurveTo(232,556,232,526,234,500);cc.closePath();},w,sh,330,540,100,rgba(ag_dk(w,0.6),0.3),6);
  ctx.strokeStyle=rgba(ag_dk(w,0.24),0.5);ctx.lineWidth=2;ctx.lineCap="round";for(const dy of [24,50]){ctx.beginPath();ctx.moveTo(238,506+dy);ctx.bezierCurveTo(268,528+dy,316,538+dy,358,524+dy);ctx.stroke();}
  ag_soft(ctx,cc=>{cc.moveTo(330,588);cc.bezierCurveTo(352,586,360,604,354,624);cc.bezierCurveTo(348,652,340,676,328,696);cc.bezierCurveTo(318,674,312,648,314,622);cc.bezierCurveTo(314,604,320,590,330,588);cc.closePath();},w,sh,342,620,80,rgba(ag_dk(w,0.6),0.32),5);
  ctx.strokeStyle=rgba(ag_dk(w,0.3),0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(334,606);ctx.quadraticCurveTo(338,650,328,688);ctx.stroke();
  ctx.restore();}
AG_PLACES.olWall=c=>lp_paintRoom(c,{light:"grey",seed:17,base:[232,224,208]});
