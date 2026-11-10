/* ===== One map, in the repo: the opening's pictures, Great Britain from the late 1990s =====
   The film's own pictures for its story from outside data (prefix om_), drawn in the module's matte language, lit from the right like
   the rooms; never a copy of an Ordnance Survey map, its symbols or its styles: a small invented town, drawn plainly.
     omDesk                                   a large sheet of map paper on a timber desk, seen from above, in the afternoon light
     om_map(ctx, o)                           the town: its streets, its river and its buildings, on the paper; cut into tiles that
                                              drift apart, or one seamless map; its buildings only lines, or things with an outline
                                              and a fill; a new road drawn in; the school picked out
     om_mp(o, x, y)                           where a point of the town (in its own 1000 x 560 units) lands in the frame
     om_chip(ctx, x, y, text, o)              an identifier on a small slip, in the typewriter face, pinned to a building
     om_record(ctx, x, y, w, kick, name, o)   one organisation's record of a building, on a sheet
     om_tripod, om_plane                      a surveyor's instrument on its tripod; a small survey plane
   Colour keeps the module's meaning: amber where records disagree or must be changed by hand, green where they agree, blue the one
   database (a design); the town itself is in the paper's own quiet colours. */

AG_PLACES.omDesk=c=>{lp_paintRoom(c,{light:"day",seed:8,sun:false});
  // the desk's timber, under the whole frame, and the sheet of map paper on it, a little askew, its soft shadow down and to the left
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(mix(LP.timber,LP.shade,0.18),1));g.addColorStop(1,rgba(mix(LP.timber,LP.shade,0.34),1));
  c.fillStyle=g;c.fillRect(0,0,W,H);const R=ag_rnd(1791);c.globalAlpha=0.07;c.strokeStyle=rgba(LP.shade,1);c.lineWidth=2;
  for(let i=0;i<70;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+R()*14-7,1300,y+R()*14-7,W,y+R()*10-5);c.stroke();}
  c.globalAlpha=1;c.save();c.shadowColor="rgba(40,30,24,0.35)";c.shadowBlur=36;c.shadowOffsetX=-14;c.shadowOffsetY=16;c.fillStyle=rgba(mix(LP.paper,LP.wall,0.18),1);
  c.fillRect(90,40,1740,890);c.restore();
  // the window's light across the paper, from the right
  const s=c.createLinearGradient(90,0,1830,0);s.addColorStop(0,"rgba(52,44,52,0.06)");s.addColorStop(1,"rgba(255,214,150,0.12)");c.fillStyle=s;c.fillRect(90,40,1740,890);};

/* ---------------------------------------------------------------- the town, in its own units (1000 x 560) */
const OM_TOWN={
  river:[[0,430],[180,404],[380,446],[560,418],[760,382],[1000,350]],
  streets:[[[0,214],[300,200],[620,186],[1000,164]],[[392,0],[404,200],[420,400],[430,560]],[[712,0],[706,186],[690,380],[668,560]],[[0,312],[404,300]],[[706,286],[1000,272]]],
  // buildings [x, y, w, h]; the school is an L, with its own id
  houses:[[40,60,90,70],[150,50,80,90],[250,70,110,60],[40,240,70,50],[130,236,90,46],[240,236,120,48],[460,40,90,110],[570,60,100,80],
    [760,40,90,90],[870,30,100,100],[760,210,110,56],[890,200,90,50],[480,320,80,60],[580,300,80,70],[770,300,80,60],[880,300,96,40],
    [60,476,110,50],[220,480,120,60],[480,470,120,60],[740,446,120,70],[880,430,100,80]],
  school:[[452,232],[612,232],[612,272],[548,272],[548,286],[452,286]],
  road:[[560,560],[620,500],[760,470],[1000,452]],
  tiles:{c:4,r:2}
};
const om_mp=(o,x,y)=>[o.x+x*o.s,o.y+y*o.s];
function om_line(ctx,P){ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));}
function om_smooth(ctx,P){ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];
  ctx.quadraticCurveTo(P[i][0],P[i][1],m[0],m[1]);}const L=P[P.length-1];ctx.lineTo(L[0],L[1]);}
function om_part(P,u){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);let d=clamp(u,0,1)*L;const out=[P[0]];
  for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(d>=s){out.push(P[i]);d-=s;}else{const k=d/s;out.push([lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k)]);break;}}return out;}

/* the town on the paper. o: x, y, s (where its top left lands, and its scale); a; split (0 to 1: the tiles drift apart, their edges
   showing); grid (0 to 1: the tiles' edges); fill (0 to 1: the buildings become things, filled, with an outline, not only lines);
   road (0 to 1: the new road drawn in); hl (0 to 1: the school picked out, in hlCol); dim (0 to 1: everything but the school quieter) */
function om_map(ctx,o){o=Object.assign({x:310,y:150,s:1.3,a:1},o||{});if(o.a<=0.004)return;const T=OM_TOWN,sp=ag_sine(o.split||0),fl=ag_sine(o.fill||0),
  tw=1000/T.tiles.c,th=560/T.tiles.r,gap=44*sp,ink=LP.ink,dm=1-0.5*ag_sine(o.dim||0);
  ctx.save();ctx.globalAlpha*=o.a;
  for(let r=0;r<T.tiles.r;r++)for(let c=0;c<T.tiles.c;c++){const dx=(c-(T.tiles.c-1)/2)*gap,dy=(r-(T.tiles.r-1)/2)*gap;
    ctx.save();ctx.translate(o.x+dx,o.y+dy);ctx.scale(o.s,o.s);ctx.beginPath();ctx.rect(c*tw,r*th,tw,th);ctx.clip();
    // the paper of this tile, and its own soft shadow once the tiles are apart
    if(sp>0.02){ctx.save();ctx.shadowColor="rgba(40,30,24,"+(0.25*sp)+")";ctx.shadowBlur=18/o.s;ctx.shadowOffsetX=-6/o.s;ctx.shadowOffsetY=6/o.s;}
    ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(c*tw,r*th,tw,th);if(sp>0.02)ctx.restore();
    ctx.save();ctx.globalAlpha*=dm;
    // the river, in a quiet grey-green that means nothing
    ctx.strokeStyle=rgba([170,190,186],1);ctx.lineWidth=34;ctx.lineCap="round";om_smooth(ctx,T.river);ctx.stroke();
    ctx.strokeStyle=rgba([138,160,158],1);ctx.lineWidth=2;ctx.save();ctx.translate(0,-17);om_smooth(ctx,T.river);ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(0,17);om_smooth(ctx,T.river);ctx.stroke();ctx.restore();
    // the streets: two cased lines each
    for(const S of T.streets){ctx.strokeStyle=rgba(mix(LP.mut,LP.paper,0.35),1);ctx.lineWidth=22;ctx.lineJoin="round";om_line(ctx,S);ctx.stroke();
      ctx.strokeStyle=rgba(mix(LP.wall,LP.paper,0.55),1);ctx.lineWidth=18;om_line(ctx,S);ctx.stroke();}
    // the new road, drawn in from its start
    const ru=o.road||0;if(ru>0){const P=om_part(T.road,ag_sine(ru));ctx.strokeStyle=rgba(mix(LP.mut,LP.paper,0.35),1);ctx.lineWidth=22;om_line(ctx,P);ctx.stroke();
      ctx.strokeStyle=rgba(mix(LP.wall,LP.paper,0.55),1);ctx.lineWidth=18;om_line(ctx,P);ctx.stroke();}
    // the buildings: lines only, or things with a fill
    ctx.lineWidth=2.4/o.s*1.3;ctx.strokeStyle=rgba(ink,0.85);
    for(const [bx,by,bw,bh] of T.houses){if(fl>0){ctx.fillStyle=rgba(mix(LP.wall,LP.timber,0.35),fl);ctx.fillRect(bx,by,bw,bh);}ctx.strokeRect(bx,by,bw,bh);}
    ctx.restore();
    if(fl>0){ctx.fillStyle=rgba(mix(LP.wall,LP.timber,0.35),fl);om_line(ctx,T.school);ctx.closePath();ctx.fill();}
    ctx.strokeStyle=rgba(ink,0.85);ctx.lineWidth=2.4/o.s*1.3;om_line(ctx,T.school);ctx.closePath();ctx.stroke();
    const hl=ag_sine(o.hl||0);if(hl>0){ctx.fillStyle=rgba(o.hlCol||LP.blue,0.22*hl);om_line(ctx,T.school);ctx.closePath();ctx.fill();
      ctx.strokeStyle=rgba(o.hlCol||LP.blue,hl);ctx.lineWidth=5/o.s*1.3;om_line(ctx,T.school);ctx.closePath();ctx.stroke();}
    ctx.restore();
    // the tile's edge
    const ga=Math.max(o.grid||0,sp);if(ga>0.004){ctx.save();ctx.translate(o.x+dx,o.y+dy);ctx.strokeStyle=rgba(LP.mut,0.55*ga);ctx.lineWidth=2;ctx.setLineDash([10,8]);
      ctx.strokeRect(c*tw*o.s,r*th*o.s,tw*o.s,th*o.s);ctx.setLineDash([]);ctx.restore();}}
  // the frame round the whole town once it is one
  ctx.strokeStyle=rgba(LP.ink,0.6*(1-sp));ctx.lineWidth=3;ctx.strokeRect(o.x,o.y,1000*o.s,560*o.s);
  ctx.restore();}

/* an identifier on a small slip, pinned to (x, y) by a short line from (px, py) if given. o: a, k (springs in), col (the slip's edge) */
function om_chip(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=lp_tw(ctx,text,{w:500,size:28,f:"mono"})+36,h=50;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  if(o.px!=null){ctx.strokeStyle=rgba(o.col||LP.blue,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.px,o.py);ctx.lineTo(x,y);ctx.stroke();
    ctx.fillStyle=rgba(o.col||LP.blue,1);ctx.beginPath();ctx.arc(o.px,o.py,7,0,TAU);ctx.fill();}
  ctx.save();ctx.shadowColor="rgba(40,30,24,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(LP.paper,1);rr(ctx,x-w/2,y-h/2,w,h,10);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(o.col||LP.blue,1);ctx.lineWidth=3;rr(ctx,x-w/2,y-h/2,w,h,10);ctx.stroke();
  lp_T(ctx,text,x,y+10,{w:500,size:28,f:"mono",align:"center",col:o.tcol||LP.ink});ctx.restore();}

/* one organisation's record of a building, on a sheet: its kind (kick), its own name for the building, and a line under it.
   o: col (the band), light, a, k, line (a third line), tag ({text, col}: a tag on the sheet's foot); returns the sheet's box */
function om_record(ctx,x,y,w,kick,name,o){o=o||{};return lp_textSheet(ctx,x,y,w,{kick,title:name,lines:o.line?[o.line]:undefined},{col:o.col||null,light:o.light||null,pin:false,a:o.a,k:o.k});}

/* a surveyor's instrument on its tripod, and a small survey plane: plain graphite shapes, a size s (1: about 160 px tall) */
function om_tripod(ctx,x,y,s,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(LP.graphite,1);ctx.fillStyle=rgba(LP.graphite,1);
  ctx.lineWidth=6;ctx.lineCap="round";for(const dx of [-46,0,46]){ctx.beginPath();ctx.moveTo(0,-70);ctx.lineTo(dx,80);ctx.stroke();}
  rr(ctx,-30,-104,60,34,8);ctx.fill();ctx.beginPath();ctx.arc(34,-87,12,0,TAU);ctx.fill();ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(34,-87,5,0,TAU);ctx.fill();ctx.restore();}
function om_plane(ctx,x,y,s,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba(LP.graphite,1);
  ctx.beginPath();ctx.ellipse(0,0,90,13,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-14,-6);ctx.lineTo(-40,-86);ctx.lineTo(-20,-86);ctx.lineTo(26,-6);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-14,6);ctx.lineTo(-40,86);ctx.lineTo(-20,86);ctx.lineTo(26,6);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-70,-4);ctx.lineTo(-96,-40);ctx.lineTo(-84,-40);ctx.lineTo(-56,-4);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-70,4);ctx.lineTo(-96,40);ctx.lineTo(-84,40);ctx.lineTo(-56,4);ctx.closePath();ctx.fill();
  // the camera under it, looking down: three soft lines
  ctx.strokeStyle=rgba(LP.mut,0.6);ctx.lineWidth=3;ctx.setLineDash([8,8]);for(const dx of [-40,0,40]){ctx.beginPath();ctx.moveTo(10,16);ctx.lineTo(10+dx*1.6,150);ctx.stroke();}ctx.setLineDash([]);ctx.restore();}
