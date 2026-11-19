/* ===== The people kit: boards and pages drawn as a designer would =====
   The author found the boards and the notebooks too plain, "generally just writing" (18 November 2026). He asked for a designer's
   board and notebook, "with proper drawings and charts. Still looking written but very polished. It doesn't need to show they are
   writing and drawing everything, it could be almost done in design and the hand just adds some final words to complete the
   sketch." Of four looks he picked two: a graphic recording, a sheet of paper pinned over the board (board B), and a sketched page
   in the notebook (notebook D). This file holds what both are drawn with.

   A designed board or page is two kinds of rows of PK.ink (hand.js): what is drawn already when it first shows, a row of its own
   (PK.sk.drawn), and the last words, written by hand as the voice says them, as any other row: paced once with PK.pace and shown
   with PK.teach (a board) or PK.notes (a page). The hand may also tick or ring a part of the drawing as the voice comes to it (a
   mark of PK.ink's: tick, ring, star, under), and it writes nothing else.

     PK.sk.drawn(draw, box)     a row that is drawn already: draw(ctx) in the board's or the page's own px; box [x0, y0, x1, y1] is
                                where its ink lies: whoever explains steps clear of it, and the check (people.py) holds it 24 px or
                                more inside the board or the page. On a board far off (PK.teach's deco), its words are decoration
                                too: everything written here takes the surface's deco by itself (PK.inkDeco).
     PK.sk.paper(ctx, o)        the graphic recording's sheet, pinned over PK.place.board's board: cream paper, a pin at each
                                corner. o: x, y, w, h (in the board's px: 14, 16, 1222, 492), col, pins (false: none)
     PK.SK                      the sheet's box and the page's: SK.board {x, y, w, h} (inside the paper, 24 px from every edge of
                                the board), SK.page {x, y, w, h} (a page's room above the captions)

   Words. Each is PK.hand's handwriting (size, w, col, align, a), so a box made from words is made as they are drawn.
     PK.sk.text(ctx, s, x, y, o)          words, their baseline at (x, y) -> {w, x0, x1}
     PK.sk.caps(ctx, s, x, y, o)          a small heading in capitals, its letters spaced (o.size 30, o.ls 3, o.col) -> {w}
     PK.sk.wrap(ctx, s, maxW, o)          the words in lines no wider than maxW, at o.size and o.w -> [line, …]
     PK.sk.lines(ctx, rows, x, y, o)      lines one under another: rows are strings or [s, o]; o.lh (1.25 of the size) -> {w, h}
   Marks and shapes, each drawn once with an even dark line round a flat colour. A colour is a kit name ("ink", "mut", "blue",
   "green", "amber", "orange", "violet") or [r, g, b]; a fill named so is that colour's light tint (PK.TINT).
     PK.sk.line(ctx, pts, o)              a line drawn by hand through points: o.col, o.w (4), o.dash, o.close, o.fill, o.seed
     PK.sk.box(ctx, x, y, w, h, o)        a box drawn with a marker: o.fill (its tint, laid a little off the line, as a marker
                                          does), o.col (the line), o.w (3.5), o.r (12), o.dash
     PK.sk.disc(ctx, cx, cy, r, o)        a round one: o.fill, o.col, o.w
     PK.sk.band(ctx, x, y, w, h, col, a)  a highlighter's band
     PK.sk.arrow(ctx, [x0, y0], [x1, y1], o)   o.col, o.w (4), o.bow (px, to the left of the way it goes), o.head (16), o.dash
     PK.sk.pin(ctx, x, y, o), PK.sk.tape(ctx, x, y, w, o)   a pin; a strip of tape (o.rot, o.col)
     PK.sk.sticky(ctx, x, y, w, h, o)     a sticky note: o.col (yellow), o.rot; o.draw(ctx, x, y, w, h) writes on it, turned with it
     PK.sk.ribbon(ctx, s, x, y, o)        a heading on a ribbon, made from its words: (x, y) its top left (o.align "center": its
                                          top middle); o.size (44), o.col ("blue"), o.ink (its words' colour), o.width (a ribbon
                                          for words the hand writes on it later: s "") -> {x0, x1, y0, y1, base, cx (where words
                                          on it go: their baseline, its middle)}
     PK.sk.stamp(ctx, lines, cx, cy, o)   a reference stamped in a corner, turned a little: lines of [s, o] or strings (the first
                                          bold); o.col ("blue"), o.rot (0.06), o.size (32) -> {w, h}
     PK.sk.face(ctx, who, cx, cy, r, o)   a portrait, head and shoulders, in their own hair, skin and clothes: who a name in
                                          PK.CAST or a row like its rows; o.ring (a colour round it), o.disc (false: no disc)
     PK.sk.icon(ctx, kind, cx, cy, r, o)  a small drawing, r its size: o.fill. The kinds are in PK.sk.ICONS
   Pieces made of those, each sized from its words unless a width is given, each returning its box {x, y, w, h}:
     PK.sk.card(ctx, x, y, o)             a box with an icon at its left and a line or two: o.icon, o.ifill, o.lines ([s, o] or
                                          strings), o.fill, o.col, o.w (its width), o.size (36), o.pad (18), o.r
     PK.sk.list(ctx, x, y, items, o)      rows one under another, each {s, icon, num, dot, col, sub, ifill}: an icon, a number in a
                                          ring or a dot before it, its words, and a gloss in muted ink after them (sub); o.size (38),
                                          o.gap (the row's height: 1.6 of the size), o.subX (the gloss's column) -> [{x, y, w, h,
                                          base, mark: [x, y] (where a tick beside it goes)}, …]
     PK.sk.faces(ctx, x, y, who, o)       portraits in a row, a name or a word under each (o.names: [s, …], or true for their own
                                          first names): o.r (30), o.gap -> [{cx, cy}, …]
     PK.sk.flow(ctx, x, y, steps, o)      boxes joined by arrows, to the right (o.down: down): steps [{s, icon, fill, col, sub}, …];
                                          o.size (34), o.gap (the arrow's length: 60), o.h (each box's height) -> [{x, y, w, h}, …]
   Charts, sketched:
     PK.sk.bars(ctx, x, y, w, h, bars, o)        bars on a line: [{v, col, label, top}, …] (top: words over the bar); o.max, o.size
     PK.sk.trend(ctx, x, y, w, h, pts, o)        a line over time: pts [[0 to 1, 0 to 1], …]; o.col, o.labels ([[u, s], …] under
                                                 the line's foot), o.dots
     PK.sk.donut(ctx, cx, cy, r, parts, o)       a ring in parts: [{v, col}, …]; o.label (words in its middle), o.size
     PK.sk.cycle(ctx, cx, cy, r, steps, o)       steps round a circle, each [s, col] in a pill, arrows from each to the next
     PK.sk.stairs(ctx, x, y, w, h, steps, o)     steps that climb to the right, [s, …] on each; o.col, o.flag (a flag at the top)
     PK.sk.matrix(ctx, x, y, w, h, o)            two axes and four corners: o.xs, o.ys (each axis's words), o.q ([top left, top
                                                 right, bottom left, bottom right]: words or [s, o]), o.on (the corner shaded:
                                                 0 to 3), o.col
     PK.sk.pyramid(ctx, cx, y, w, h, layers, o)  layers from the top down: [s, col]
     PK.sk.timeline(ctx, x, y, w, marks, o)      a line with marks along it: [{u, s, sub, col, up}, …]
     PK.sk.scale(ctx, cx, cy, w, o)              a balance: o.l, o.r (the words in each pan), o.tilt (-1 to 1: the left pan down),
                                                 o.lcol, o.rcol
     PK.sk.venn(ctx, cx, cy, r, o)               two rounds that overlap: o.l, o.r, o.mid (their words), o.lcol, o.rcol
     PK.sk.dots(ctx, x, y, cols, rows, o)        a field of small rounds: o.gap, o.r, o.on (how many coloured), o.col
     PK.sk.big(ctx, s, cx, cy, o)                a figure, large, in a round burst: o.size (64), o.col, o.r

   Lay a designed board out as a graphic recording: a ribbon for its heading at the top left, the reference stamped at the top
   right, two or three parts below, each a drawing (a chart, a few portraits, cards with icons) with a few words, arrows between
   them, and room left for the last words, at the right or at the foot, so whoever writes them steps clear after. Lay a page out as
   a sketched page: its heading with a highlighter's band, boxes with icons and portraits, a sticky note, and a ribbon or a line at
   its foot for the last words. Words are 30 px or more on a board seen close, 34 or more on a page, and none below the board's or
   the page's room (PK.SK). Colour keeps its meaning (blue a plan or a rule, green something done or of value, amber a risk or a
   cost, orange data); people's portraits wear their own clothes. Nothing here is a box of words for the check: a board's or a
   page's drawing is the writing's, not a card over the scene. */
(K=>{
const {TAU,lerp,clamp,mix,dk,lt,css,hash,rrect}=K.u;
const INK=()=>K.C.ink;
K.TINT={ink:[248,244,236],mut:[238,232,224],blue:[214,228,244],green:[204,234,212],amber:[250,230,196],orange:[250,218,198],violet:[226,218,244],white:[255,255,255],sun:[252,226,140],paper:[250,247,240]};
K.FILL={ink:[226,220,212],mut:[226,220,212],blue:[176,204,236],green:[178,222,190],amber:[250,212,128],orange:[244,186,154],violet:[206,194,242],white:[255,255,255],sun:[252,226,140],paper:[250,247,240]};
const colOf=c=>K.inkCol(c),tintOf=c=>c==null?null:Array.isArray(c)?c:(K.TINT[c]||K.TINT.ink),fillOf=c=>c==null?null:Array.isArray(c)?c:(K.FILL[c]||K.FILL.ink);
// a ribbon's colours: strong enough to carry white words, or light with ink ones (amber)
const RIB={blue:[[104,146,196],[255,255,255]],green:[[88,146,106],[255,255,255]],amber:[[240,200,104],null],orange:[[214,128,86],[255,255,255]],violet:[[132,116,200],[255,255,255]],ink:[[96,86,98],[255,255,255]],mut:[[226,216,200],null]};
const nz=(i,k)=>hash(i*7+3,k*13+1)-0.5;
// the board's px and the page's: where a design's ink may lie
K.SK={board:{x:40,y:36,w:1170,h:450},page:{x:70,y:56,w:960,h:770},paper:{x:14,y:16,w:1222,h:492}};
K.sk={};const D=K.sk;

/* ---------------------------------------------------------------- words */
const deco=o=>o.deco||K.inkDeco;
D.text=(ctx,s,x,y,o)=>K.hand(ctx,s,x,y,o||{});
D.caps=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||30,ls=o.ls==null?3:o.ls,S=String(s).toUpperCase(),w=ag_tw(ctx,S,{w:700,size,f:"hand",ls});
  const x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;ag_T(ctx,S,x0,y,{w:700,size,f:"hand",ls,color:css(colOf(o.col||"mut")),deco:deco(o),a:o.a});return{w,x0,x1:x0+w};};
D.capsW=(ctx,s,o)=>{o=o||{};return ag_tw(ctx,String(s).toUpperCase(),{w:700,size:o.size||30,f:"hand",ls:o.ls==null?3:o.ls});};
D.wrap=(ctx,s,maxW,o)=>{o=o||{};const size=o.size||38,wt=o.w||400,out=[];let cur="";for(const wd of String(s).split(/\s+/)){const t=cur?cur+" "+wd:wd;if(cur&&K.handW(ctx,t,size,wt)>maxW){out.push(cur);cur=wd;}else cur=t;}if(cur)out.push(cur);return out;};
const rowOf=r=>Array.isArray(r)?[r[0],r[1]||{}]:[r,{}];
D.lines=(ctx,rows,x,y,o)=>{o=o||{};let yy=y,w=0;rows.forEach((r,i)=>{const [s,ro]=rowOf(r),q=Object.assign({size:o.size||38,w:o.w,col:o.col,align:o.align},ro),lh=(o.lh||1.25)*q.size;
    if(i)yy+=lh;const m=D.text(ctx,s,x,yy,q);w=Math.max(w,m.w);});return{w,h:yy-y};};
const widthOf=(ctx,rows,o)=>Math.max(0,...rows.map(r=>{const [s,ro]=rowOf(r);return K.handW(ctx,s,ro.size||o.size||38,ro.w||o.w||400);}));

/* ---------------------------------------------------------------- marks and shapes */
// a hand-drawn line through points: each stretch bowed a little, the same way every time
function wob(ctx,pts,o){const amp=o.amp==null?1.6:o.amp,seed=o.seed||1;ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,k=amp*Math.min(1,L/80)*(1+nz(seed,i));
    ctx.quadraticCurveTo((a[0]+b[0])/2+nx*k*2,(a[1]+b[1])/2+ny*k*2,b[0],b[1]);}
  if(o.close)ctx.closePath();}
const pen=(ctx,c,w)=>{ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=css(colOf(c));ctx.lineWidth=w;};
D.line=(ctx,pts,o)=>{o=o||{};ctx.save();ctx.beginPath();wob(ctx,pts,o);if(o.fill){ctx.fillStyle=css(tintOf(o.fill));ctx.fill();}
  if(o.col!==false){pen(ctx,o.col||"ink",o.w||4);if(o.dash)ctx.setLineDash(o.dash);ctx.stroke();}ctx.restore();};
D.box=(ctx,x,y,w,h,o)=>{o=o||{};const r=o.r==null?12:o.r;ctx.save();
  if(o.fill){ctx.fillStyle=css(tintOf(o.fill));ctx.beginPath();rrect(ctx,x+2,y+3,w,h,r);ctx.fill();}
  if(o.col!==false){pen(ctx,o.col||"ink",o.w||3.5);if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();rrect(ctx,x,y,w,h,r);ctx.stroke();}ctx.restore();return{x,y,w,h};};
D.disc=(ctx,cx,cy,r,o)=>{o=o||{};ctx.save();if(o.fill){ctx.fillStyle=css(tintOf(o.fill));ctx.beginPath();ctx.arc(cx+1.5,cy+2,r,0,TAU);ctx.fill();}
  if(o.col!==false){pen(ctx,o.col||"ink",o.w||3.5);if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();}ctx.restore();};
D.band=(ctx,x,y,w,h,c,a)=>{ctx.save();ctx.fillStyle=css(Array.isArray(c)?c:(K.HL[c]||K.HL.amber),a==null?0.5:a);ctx.beginPath();ctx.moveTo(x,y+h*0.12);ctx.quadraticCurveTo(x+w*0.5,y-h*0.06,x+w,y+h*0.04);
  ctx.lineTo(x+w-4,y+h);ctx.quadraticCurveTo(x+w*0.5,y+h*1.06,x+4,y+h*0.94);ctx.closePath();ctx.fill();ctx.restore();};
D.arrow=(ctx,a,b,o)=>{o=o||{};const bow=o.bow||0,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,cx=mx-dy/L*bow,cy=my+dx/L*bow;
  ctx.save();pen(ctx,o.col||"ink",o.w||4);if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(cx,cy,b[0],b[1]);ctx.stroke();ctx.setLineDash([]);
  const an=Math.atan2(b[1]-cy,b[0]-cx),hl=o.head||16;ctx.beginPath();ctx.moveTo(b[0]-Math.cos(an-0.45)*hl,b[1]-Math.sin(an-0.45)*hl);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[0]-Math.cos(an+0.45)*hl,b[1]-Math.sin(an+0.45)*hl);ctx.stroke();ctx.restore();};
D.pin=(ctx,x,y,o)=>{o=o||{};ctx.save();ctx.fillStyle="rgba(60,40,40,0.2)";ctx.beginPath();ctx.arc(x+3,y+4,8,0,TAU);ctx.fill();ctx.fillStyle=css(o.col||[196,70,64]);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();
  pen(ctx,"ink",2);ctx.stroke();ctx.fillStyle="rgba(255,255,255,0.55)";ctx.beginPath();ctx.arc(x-2.5,y-2.5,2.6,0,TAU);ctx.fill();ctx.restore();};
D.tape=(ctx,x,y,w,o)=>{o=o||{};const h=o.h||36,c=o.col||[150,196,186];ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.fillStyle=css(c,0.82);ctx.beginPath();ctx.moveTo(-w/2,-h/2);
  for(let i=0;i<=6;i++)ctx.lineTo(-w/2+i*w/6,-h/2+(i%2?3:0));ctx.lineTo(w/2,h/2);for(let i=6;i>=0;i--)ctx.lineTo(-w/2+i*w/6,h/2-(i%2?3:0));ctx.closePath();ctx.fill();
  ctx.strokeStyle=css(lt(c,0.5),0.7);ctx.lineWidth=2;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(-w/2+i*w/4-8,-h/2);ctx.lineTo(-w/2+i*w/4+8,h/2);ctx.stroke();}ctx.restore();};
D.sticky=(ctx,x,y,w,h,o)=>{o=o||{};const c=tintOf(o.col||"sun");ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.fillStyle="rgba(60,40,40,0.16)";ctx.fillRect(-w/2+5,-h/2+7,w,h);
  ctx.fillStyle=css(c);ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeStyle=css(dk(c,0.25));ctx.lineWidth=2;ctx.strokeRect(-w/2,-h/2,w,h);
  ctx.fillStyle=css(dk(c,0.06));ctx.fillRect(-w/2,-h/2,w,Math.min(26,h*0.18));if(o.draw)o.draw(ctx,-w/2,-h/2,w,h);ctx.restore();return{x,y,w,h};};
D.ribbon=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||44,wt=o.w||700,W=s?K.handW(ctx,s,size,wt):0,pad=o.pad||size*0.6,w=o.width||W+pad*2,h=Math.round(size*1.32),[f0,i0]=RIB[o.col||"blue"]||[colOf(o.col),[255,255,255]],
    fill=Array.isArray(o.fill)?o.fill:f0,ink=o.ink||i0||INK(),x0=o.align==="center"?x-w/2:x,d=h*0.45,fd=dk(fill,0.22);
  ctx.save();ctx.lineJoin="round";ctx.lineWidth=3;ctx.strokeStyle=css(INK());
  if(o.tails!==false)for(const sg of[-1,1]){const ex=sg<0?x0:x0+w;ctx.fillStyle=css(fd);ctx.beginPath();ctx.moveTo(ex,y+d*0.5);ctx.lineTo(ex+sg*h*0.9,y+d*0.5);ctx.lineTo(ex+sg*h*0.55,y+d*0.5+h*0.5);
    ctx.lineTo(ex+sg*h*0.9,y+h+d*0.5);ctx.lineTo(ex,y+h+d*0.5);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle=css(fill);ctx.beginPath();ctx.moveTo(x0,y);ctx.quadraticCurveTo(x0+w/2,y-6,x0+w,y);ctx.lineTo(x0+w,y+h);ctx.quadraticCurveTo(x0+w/2,y+h-6,x0,y+h);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  if(s)D.text(ctx,s,x0+w/2,y+h*0.72,{size,w:wt,col:ink,align:"center"});return{x0,x1:x0+w,y0:y,y1:y+h,w,h,base:y+h*0.72,cx:x0+w/2};};
D.stamp=(ctx,lines,cx,cy,o)=>{o=o||{};const size=o.size||32,rows=lines.map((r,i)=>{const [s,ro]=rowOf(r);return[s,Object.assign({size:i?size*0.88:size,w:i?400:700,col:o.col||"blue",align:"center"},ro)];}),
    W=Math.max(...rows.map(([s,q])=>K.handW(ctx,s,q.size,q.w))),lh=size*1.12,w=W+size*1.3,h=rows.length*lh+size*0.55;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot==null?0.06:o.rot);D.box(ctx,-w/2,-h/2,w,h,{col:o.col||"blue",w:3,r:14,fill:o.fill});
  if(o.double!==false)D.box(ctx,-w/2+6,-h/2+6,w-12,h-12,{col:o.col||"blue",w:1.6,r:10});
  rows.forEach(([s,q],i)=>D.text(ctx,s,0,-h/2+size*0.3+lh*(i+0.78),q));ctx.restore();return{w,h};};

/* ---------------------------------------------------------------- a portrait, as a designer sketches one */
D.face=(ctx,who,cx,cy,r,o)=>{o=o||{};const P=typeof who==="string"?K.CAST[who]:who;if(!P)throw new Error("PK.sk.face: nobody called "+who);
  const S=K.S,tone=c=>S.tone?S.tone(c):c,sk=tone(P.skin),hair=P.hair||{style:"short",c:[60,48,44]},hc=tone(hair.c||[60,48,44]),top=tone((P.top&&P.top.c)||[150,140,130]),lw=Math.max(2,r*0.085),st=hair.style;
  ctx.save();ctx.lineJoin="round";ctx.lineCap="round";ctx.lineWidth=lw;ctx.strokeStyle=css(INK());
  if(o.ring){ctx.fillStyle=css(tintOf(o.ring),0.95);ctx.beginPath();ctx.arc(cx,cy+r*0.15,r*1.42,0,TAU);ctx.fill();}
  if(o.disc!==false){ctx.fillStyle=css(o.bg?tintOf(o.bg):[248,244,236]);ctx.beginPath();ctx.arc(cx,cy+r*0.15,r*1.25,0,TAU);ctx.fill();ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(cx,cy+r*0.15,r*1.25-lw/2,0,TAU);ctx.clip();}
  // shoulders, and what shows at the neck
  ctx.fillStyle=css(top);ctx.beginPath();ctx.moveTo(cx-r*1.15,cy+r*1.6);ctx.quadraticCurveTo(cx-r*1.05,cy+r*0.78,cx-r*0.35,cy+r*0.7);ctx.lineTo(cx+r*0.35,cy+r*0.7);ctx.quadraticCurveTo(cx+r*1.05,cy+r*0.78,cx+r*1.15,cy+r*1.6);ctx.closePath();ctx.fill();ctx.stroke();
  if(P.top&&P.top.inner){ctx.fillStyle=css(tone(P.top.inner));ctx.beginPath();ctx.moveTo(cx-r*0.28,cy+r*0.7);ctx.lineTo(cx,cy+r*1.12);ctx.lineTo(cx+r*0.28,cy+r*0.7);ctx.closePath();ctx.fill();ctx.stroke();}
  // hair down the back, a bun, a knot, a scarf round the head
  ctx.fillStyle=css(hc);
  if(st==="long"){ctx.beginPath();ctx.moveTo(cx-r*0.78,cy-r*0.2);ctx.quadraticCurveTo(cx-r*0.95,cy+r*0.7,cx-r*0.62,cy+r*0.98);ctx.lineTo(cx+r*0.62,cy+r*0.98);ctx.quadraticCurveTo(cx+r*0.95,cy+r*0.7,cx+r*0.78,cy-r*0.2);ctx.closePath();ctx.fill();ctx.stroke();}
  if(st==="bun"||st==="knot"){ctx.beginPath();ctx.arc(cx+r*0.05,cy-r*0.98,r*(st==="knot"?0.26:0.32),0,TAU);ctx.fill();ctx.stroke();}
  const scarf=st==="scarf"||st==="covered";
  if(scarf){ctx.fillStyle=css(hc);ctx.beginPath();ctx.moveTo(cx-r*0.86,cy+r*0.72);ctx.quadraticCurveTo(cx-r*1.0,cy-r*0.95,cx,cy-r*0.98);ctx.quadraticCurveTo(cx+r*1.0,cy-r*0.95,cx+r*0.86,cy+r*0.72);ctx.closePath();ctx.fill();ctx.stroke();}
  // the neck and the head
  ctx.fillStyle=css(sk);ctx.beginPath();rrect(ctx,cx-r*0.2,cy+r*0.35,r*0.4,r*0.45,r*0.1);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,cy,r*0.66,r*0.76,0,0,TAU);ctx.fill();ctx.stroke();
  // hair on top, by its style
  ctx.fillStyle=css(hc);
  if(scarf){ctx.beginPath();ctx.moveTo(cx-r*0.66,cy-r*0.05);ctx.quadraticCurveTo(cx-r*0.62,cy-r*0.72,cx,cy-r*0.74);ctx.quadraticCurveTo(cx+r*0.62,cy-r*0.72,cx+r*0.66,cy-r*0.05);ctx.quadraticCurveTo(cx+r*0.7,cy-r*0.92,cx,cy-r*0.92);ctx.quadraticCurveTo(cx-r*0.7,cy-r*0.92,cx-r*0.66,cy-r*0.05);ctx.fill();ctx.stroke();}
  else if(st==="coily"||st==="curly"){const n=st==="coily"?7:6;ctx.beginPath();for(let i=0;i<n;i++){const a=Math.PI*(1.05+i*0.9/(n-1)),bx=cx+Math.cos(a)*r*0.62,by=cy+Math.sin(a)*r*0.7;ctx.moveTo(bx+r*0.2,by);ctx.arc(bx,by,r*0.2,0,TAU);}ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(cx,cy-r*0.45,r*0.62,r*0.36,0,Math.PI,TAU);ctx.fill();}
  else if(st!=="none"&&st!=="shaved"){const sh=st==="short"||st==="crop"||st==="cropped"||st==="normal"||st==="side"||st==="knot",y0=cy+(sh?-r*0.1:r*0.2);ctx.beginPath();ctx.moveTo(cx-r*0.7,y0);
    ctx.quadraticCurveTo(cx-r*0.78,cy-r*0.92,cx,cy-r*0.86);ctx.quadraticCurveTo(cx+r*0.8,cy-r*0.92,cx+r*0.7,y0-(sh?r*0.02:0));
    ctx.quadraticCurveTo(cx+r*0.42,cy-r*(st==="side"?0.62:0.5),cx-r*0.05,cy-r*0.46);ctx.quadraticCurveTo(cx-r*0.48,cy-r*0.42,cx-r*0.7,y0);ctx.closePath();ctx.fill();ctx.stroke();}
  if(P.beard){ctx.fillStyle=css(tone(P.beard));ctx.beginPath();ctx.moveTo(cx-r*0.6,cy+r*0.05);ctx.quadraticCurveTo(cx-r*0.5,cy+r*0.86,cx,cy+r*0.8);ctx.quadraticCurveTo(cx+r*0.5,cy+r*0.86,cx+r*0.6,cy+r*0.05);ctx.quadraticCurveTo(cx,cy+r*0.42,cx-r*0.6,cy+r*0.05);ctx.fill();ctx.stroke();}
  if(P.earrings&&!scarf){ctx.fillStyle=css(tone(P.earrings));for(const sg of[-1,1]){ctx.beginPath();ctx.arc(cx+sg*r*0.68,cy+r*0.22,Math.max(1.6,r*0.07),0,TAU);ctx.fill();}}
  // eyes, a smile, glasses
  ctx.fillStyle=css(INK());for(const sg of[-1,1]){ctx.beginPath();ctx.arc(cx+sg*r*0.24,cy+r*0.02,Math.max(1.6,r*0.07),0,TAU);ctx.fill();}
  ctx.lineWidth=lw*0.8;ctx.beginPath();ctx.arc(cx,cy+r*0.2,r*0.22,0.25*Math.PI,0.75*Math.PI);ctx.stroke();
  if(P.glasses){ctx.lineWidth=lw*0.7;for(const sg of[-1,1]){ctx.beginPath();ctx.arc(cx+sg*r*0.25,cy+r*0.02,r*0.17,0,TAU);ctx.stroke();}ctx.beginPath();ctx.moveTo(cx-r*0.08,cy);ctx.lineTo(cx+r*0.08,cy);ctx.stroke();}
  if(o.disc!==false)ctx.restore();ctx.restore();};

/* ---------------------------------------------------------------- small drawings */
const PAPER=[250,246,236];
const ICON={
  star:(c,x,y,r)=>{c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*0.45:r;i?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();},
  plus:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.5,y);c.lineTo(x+r*0.5,y);c.moveTo(x,y-r*0.5);c.lineTo(x,y+r*0.5);c.stroke();},
  minus:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.5,y);c.lineTo(x+r*0.5,y);c.stroke();},
  check:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.45,y);c.lineTo(x-r*0.1,y+r*0.38);c.lineTo(x+r*0.5,y-r*0.38);c.lineWidth*=1.3;c.stroke();},
  cross:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.4,y-r*0.4);c.lineTo(x+r*0.4,y+r*0.4);c.moveTo(x+r*0.4,y-r*0.4);c.lineTo(x-r*0.4,y+r*0.4);c.lineWidth*=1.2;c.stroke();},
  q:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.arc(x,y-r*0.22,r*0.3,-Math.PI*0.95,Math.PI*0.4);c.quadraticCurveTo(x,y,x,y+r*0.22);c.stroke();c.beginPath();c.arc(x,y+r*0.52,r*0.07,0,TAU);c.fillStyle=c.strokeStyle;c.fill();},
  warn:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*1.05,y+r*0.82);c.lineTo(x-r*1.05,y+r*0.82);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x,y-r*0.38);c.lineTo(x,y+r*0.25);c.stroke();c.beginPath();c.arc(x,y+r*0.52,r*0.07,0,TAU);c.fillStyle=c.strokeStyle;c.fill();},
  rock:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.7);c.lineTo(x-r*0.7,y-r*0.2);c.lineTo(x-r*0.1,y-r*0.7);c.lineTo(x+r*0.6,y-r*0.4);c.lineTo(x+r,y+r*0.7);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.1,y-r*0.7);c.lineTo(x+r*0.05,y+r*0.1);c.lineTo(x+r*0.6,y-r*0.4);c.stroke();},
  key:(c,x,y,r)=>{c.beginPath();c.arc(x-r*0.45,y,r*0.45,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x,y);c.lineTo(x+r,y);c.moveTo(x+r*0.7,y);c.lineTo(x+r*0.7,y+r*0.35);c.moveTo(x+r*0.95,y);c.lineTo(x+r*0.95,y+r*0.3);c.stroke();c.fillStyle=css(PAPER);c.beginPath();c.arc(x-r*0.45,y,r*0.16,0,TAU);c.fill();c.stroke();},
  lock:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.2,r*0.42,Math.PI,TAU);c.lineTo(x+r*0.42,y);c.moveTo(x-r*0.42,y);c.lineTo(x-r*0.42,y-r*0.2);c.stroke();c.beginPath();rrect(c,x-r*0.7,y-r*0.05,r*1.4,r*1.0,r*0.14);c.fill();c.stroke();c.beginPath();c.arc(x,y+r*0.38,r*0.12,0,TAU);c.stroke();},
  heart:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y+r*0.8);c.bezierCurveTo(x-r*1.3,y-r*0.1,x-r*0.55,y-r*1.0,x,y-r*0.35);c.bezierCurveTo(x+r*0.55,y-r*1.0,x+r*1.3,y-r*0.1,x,y+r*0.8);c.fill();c.stroke();},
  house:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.8,y+r*0.8);c.lineTo(x-r*0.8,y-r*0.1);c.lineTo(x,y-r*0.85);c.lineTo(x+r*0.8,y-r*0.1);c.lineTo(x+r*0.8,y+r*0.8);c.closePath();c.fill();c.stroke();c.beginPath();c.rect(x-r*0.2,y+r*0.25,r*0.4,r*0.55);c.stroke();},
  building:(c,x,y,r)=>{c.beginPath();c.rect(x-r*0.7,y-r*0.95,r*1.4,r*1.85);c.fill();c.stroke();c.beginPath();for(let i=0;i<3;i++)for(let j=0;j<2;j++)c.rect(x-r*0.42+j*r*0.52,y-r*0.7+i*r*0.46,r*0.32,r*0.26);c.stroke();c.beginPath();c.moveTo(x-r*1.0,y+r*0.9);c.lineTo(x+r*1.0,y+r*0.9);c.stroke();},
  door:(c,x,y,r)=>{c.beginPath();c.rect(x-r*0.55,y-r*0.95,r*1.1,r*1.85);c.fill();c.stroke();c.beginPath();c.arc(x+r*0.3,y,r*0.08,0,TAU);c.stroke();c.beginPath();c.moveTo(x-r*0.9,y+r*0.9);c.lineTo(x+r*0.9,y+r*0.9);c.stroke();},
  clock:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x,y);c.lineTo(x,y-r*0.65);c.moveTo(x,y);c.lineTo(x+r*0.45,y+r*0.2);c.stroke();},
  hourglass:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.6,y-r);c.lineTo(x+r*0.6,y-r);c.lineTo(x+r*0.08,y);c.lineTo(x+r*0.6,y+r);c.lineTo(x-r*0.6,y+r);c.lineTo(x-r*0.08,y);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.75,y-r);c.lineTo(x+r*0.75,y-r);c.moveTo(x-r*0.75,y+r);c.lineTo(x+r*0.75,y+r);c.stroke();},
  cal:(c,x,y,r)=>{c.beginPath();c.rect(x-r,y-r*0.75,r*2,r*1.6);c.fill();c.stroke();c.beginPath();c.moveTo(x-r,y-r*0.3);c.lineTo(x+r,y-r*0.3);c.moveTo(x-r*0.5,y-r);c.lineTo(x-r*0.5,y-r*0.55);c.moveTo(x+r*0.5,y-r);c.lineTo(x+r*0.5,y-r*0.55);c.stroke();
    c.fillStyle=c.strokeStyle;for(let i=0;i<3;i++)for(let j=0;j<2;j++){c.beginPath();c.arc(x-r*0.5+i*r*0.5,y+r*0.1+j*r*0.4,r*0.07,0,TAU);c.fill();}},
  chat:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y-r*0.7);c.lineTo(x+r,y-r*0.7);c.lineTo(x+r,y+r*0.4);c.lineTo(x-r*0.2,y+r*0.4);c.lineTo(x-r*0.6,y+r*0.9);c.lineTo(x-r*0.55,y+r*0.4);c.lineTo(x-r,y+r*0.4);c.closePath();c.fill();c.stroke();},
  people:(c,x,y,r)=>{for(const [dx,s] of[[-0.6,0.8],[0.6,0.8],[0,1]]){c.beginPath();c.arc(x+dx*r,y-r*0.25*s,r*0.28*s,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x+dx*r-r*0.45*s,y+r*0.75);c.quadraticCurveTo(x+dx*r,y-r*0.05,x+dx*r+r*0.45*s,y+r*0.75);c.closePath();c.fill();c.stroke();}},
  person:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.38,r*0.36,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.65,y+r*0.9);c.quadraticCurveTo(x,y-r*0.2,x+r*0.65,y+r*0.9);c.closePath();c.fill();c.stroke();},
  map:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y-r*0.6);c.lineTo(x-r*0.35,y-r*0.85);c.lineTo(x+r*0.3,y-r*0.6);c.lineTo(x+r,y-r*0.85);c.lineTo(x+r,y+r*0.6);c.lineTo(x+r*0.3,y+r*0.85);c.lineTo(x-r*0.35,y+r*0.6);c.lineTo(x-r,y+r*0.85);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.35,y-r*0.85);c.lineTo(x-r*0.35,y+r*0.6);c.moveTo(x+r*0.3,y-r*0.6);c.lineTo(x+r*0.3,y+r*0.85);c.stroke();},
  db:(c,x,y,r)=>{const e=r*0.32;c.beginPath();c.moveTo(x-r*0.75,y-r*0.6);c.lineTo(x-r*0.75,y+r*0.6);c.ellipse(x,y+r*0.6,r*0.75,e,0,Math.PI,0,true);c.lineTo(x+r*0.75,y-r*0.6);c.closePath();c.fill();c.stroke();c.beginPath();c.ellipse(x,y-r*0.6,r*0.75,e,0,0,TAU);c.fill();c.stroke();c.beginPath();c.ellipse(x,y,r*0.75,e,0,0,Math.PI);c.stroke();},
  gear:(c,x,y,r)=>{c.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,rr=i%2?r*0.72:r;i?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();c.fillStyle=css(PAPER);c.beginPath();c.arc(x,y,r*0.3,0,TAU);c.fill();c.stroke();},
  shield:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*0.5,y-r*0.72,x+r*0.85,y-r*0.75);c.quadraticCurveTo(x+r*0.9,y+r*0.5,x,y+r);c.quadraticCurveTo(x-r*0.9,y+r*0.5,x-r*0.85,y-r*0.75);c.quadraticCurveTo(x-r*0.5,y-r*0.72,x,y-r);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.35,y);c.lineTo(x-r*0.05,y+r*0.3);c.lineTo(x+r*0.4,y-r*0.3);c.stroke();},
  bars:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.85);c.lineTo(x+r,y+r*0.85);c.stroke();for(const [dx,hh] of[[-0.62,0.7],[0,1.3],[0.62,0.95]]){c.beginPath();c.rect(x+dx*r-r*0.22,y+r*0.85-hh*r,r*0.44,hh*r);c.fill();c.stroke();}},
  up:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.8);c.lineTo(x+r,y+r*0.8);c.moveTo(x-r,y+r*0.8);c.lineTo(x-r,y-r);c.stroke();c.beginPath();c.moveTo(x-r*0.8,y+r*0.4);c.lineTo(x-r*0.2,y-r*0.1);c.lineTo(x+r*0.15,y+r*0.15);c.lineTo(x+r*0.8,y-r*0.6);c.stroke();c.beginPath();c.moveTo(x+r*0.4,y-r*0.62);c.lineTo(x+r*0.82,y-r*0.62);c.lineTo(x+r*0.82,y-r*0.22);c.stroke();},
  down:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.8);c.lineTo(x+r,y+r*0.8);c.moveTo(x-r,y+r*0.8);c.lineTo(x-r,y-r);c.stroke();c.beginPath();c.moveTo(x-r*0.8,y-r*0.6);c.lineTo(x-r*0.2,y-r*0.05);c.lineTo(x+r*0.15,y-r*0.3);c.lineTo(x+r*0.8,y+r*0.4);c.stroke();c.beginPath();c.moveTo(x+r*0.4,y+r*0.42);c.lineTo(x+r*0.82,y+r*0.42);c.lineTo(x+r*0.82,y);c.stroke();},
  wrench:(c,x,y,r)=>{c.save();c.translate(x,y);c.rotate(-0.8);c.beginPath();c.moveTo(-r*0.16,-r*0.4);c.lineTo(-r*0.16,r*0.95);c.quadraticCurveTo(0,r*1.1,r*0.16,r*0.95);c.lineTo(r*0.16,-r*0.4);c.closePath();c.fill();c.stroke();
    c.beginPath();c.arc(0,-r*0.62,r*0.42,0,TAU);c.fill();c.stroke();c.fillStyle=css(PAPER);c.beginPath();c.moveTo(-r*0.13,-r*1.06);c.lineTo(-r*0.13,-r*0.68);c.lineTo(r*0.13,-r*0.68);c.lineTo(r*0.13,-r*1.06);c.fill();c.stroke();c.restore();},
  doc:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.7,y-r);c.lineTo(x+r*0.35,y-r);c.lineTo(x+r*0.7,y-r*0.65);c.lineTo(x+r*0.7,y+r);c.lineTo(x-r*0.7,y+r);c.closePath();c.fill();c.stroke();c.beginPath();for(let i=0;i<3;i++){c.moveTo(x-r*0.4,y-r*0.35+i*r*0.4);c.lineTo(x+r*0.4,y-r*0.35+i*r*0.4);}c.stroke();},
  cards:(c,x,y,r)=>{for(let i=2;i>=0;i--){c.beginPath();c.rect(x-r*0.8+i*r*0.18,y-r*0.7+i*r*0.18,r*1.3,r*1.1);c.fill();c.stroke();}c.beginPath();for(let i=0;i<3;i++){c.moveTo(x-r*0.25,y-r*0.05+i*r*0.25);c.lineTo(x+r*0.55,y-r*0.05+i*r*0.25);}c.stroke();},
  book:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r*0.6);c.quadraticCurveTo(x-r*0.5,y-r*0.85,x-r,y-r*0.7);c.lineTo(x-r,y+r*0.7);c.quadraticCurveTo(x-r*0.5,y+r*0.55,x,y+r*0.8);c.quadraticCurveTo(x+r*0.5,y+r*0.55,x+r,y+r*0.7);c.lineTo(x+r,y-r*0.7);c.quadraticCurveTo(x+r*0.5,y-r*0.85,x,y-r*0.6);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x,y-r*0.6);c.lineTo(x,y+r*0.8);c.stroke();},
  pen:(c,x,y,r)=>{c.save();c.translate(x,y);c.rotate(0.78);c.beginPath();c.rect(-r*0.22,-r,r*0.44,r*1.5);c.fill();c.stroke();c.beginPath();c.moveTo(-r*0.22,r*0.5);c.lineTo(0,r);c.lineTo(r*0.22,r*0.5);c.stroke();c.beginPath();c.moveTo(-r*0.22,-r*0.6);c.lineTo(r*0.22,-r*0.6);c.stroke();c.restore();},
  bulb:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.2,r*0.62,Math.PI*0.78,Math.PI*0.22);c.lineTo(x+r*0.28,y+r*0.62);c.lineTo(x-r*0.28,y+r*0.62);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.26,y+r*0.8);c.lineTo(x+r*0.26,y+r*0.8);c.moveTo(x-r*0.18,y+r*0.97);c.lineTo(x+r*0.18,y+r*0.97);c.stroke();
    c.beginPath();for(const a of[-2.4,-1.57,-0.74]){c.moveTo(x+Math.cos(a)*r*0.86,y-r*0.2+Math.sin(a)*r*0.86);c.lineTo(x+Math.cos(a)*r*1.08,y-r*0.2+Math.sin(a)*r*1.08);}c.stroke();},
  target:(c,x,y,r)=>{for(const k of[1,0.64,0.28]){c.beginPath();c.arc(x,y,r*k,0,TAU);if(k!==0.64)c.fill();c.stroke();}c.beginPath();c.moveTo(x,y);c.lineTo(x+r*0.95,y-r*0.95);c.moveTo(x+r*0.95,y-r*0.95);c.lineTo(x+r*0.62,y-r*0.95);c.moveTo(x+r*0.95,y-r*0.95);c.lineTo(x+r*0.95,y-r*0.62);c.stroke();},
  flag:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.6,y+r);c.lineTo(x-r*0.6,y-r);c.stroke();c.beginPath();c.moveTo(x-r*0.6,y-r);c.quadraticCurveTo(x,y-r*1.2,x+r*0.8,y-r*0.85);c.lineTo(x+r*0.8,y-r*0.05);c.quadraticCurveTo(x,y-r*0.3,x-r*0.6,y-r*0.15);c.closePath();c.fill();c.stroke();},
  sprout:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y+r);c.quadraticCurveTo(x+r*0.08,y,x,y-r*0.3);c.stroke();c.beginPath();c.moveTo(x,y-r*0.1);c.quadraticCurveTo(x-r*0.9,y-r*0.2,x-r*0.85,y-r*0.95);c.quadraticCurveTo(x-r*0.15,y-r*0.85,x,y-r*0.1);c.fill();c.stroke();
    c.beginPath();c.moveTo(x+r*0.02,y-r*0.3);c.quadraticCurveTo(x+r*0.85,y-r*0.45,x+r*0.9,y-r*1.0);c.quadraticCurveTo(x+r*0.2,y-r*1.0,x+r*0.02,y-r*0.3);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.7,y+r);c.lineTo(x+r*0.7,y+r);c.stroke();},
  tree:(c,x,y,r)=>{c.beginPath();c.rect(x-r*0.12,y+r*0.2,r*0.24,r*0.8);c.fill();c.stroke();c.beginPath();c.arc(x,y-r*0.25,r*0.62,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.8,y+r);c.lineTo(x+r*0.8,y+r);c.stroke();},
  eye:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y);c.quadraticCurveTo(x,y-r*0.95,x+r,y);c.quadraticCurveTo(x,y+r*0.95,x-r,y);c.closePath();c.fill();c.stroke();c.beginPath();c.arc(x,y,r*0.34,0,TAU);c.stroke();c.fillStyle=c.strokeStyle;c.beginPath();c.arc(x,y,r*0.14,0,TAU);c.fill();},
  phone:(c,x,y,r)=>{c.beginPath();rrect(c,x-r*0.52,y-r,r*1.04,r*2,r*0.16);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.16,y+r*0.75);c.lineTo(x+r*0.16,y+r*0.75);c.stroke();},
  laptop:(c,x,y,r)=>{c.beginPath();rrect(c,x-r*0.75,y-r*0.75,r*1.5,r*1.05,r*0.08);c.fill();c.stroke();c.beginPath();c.moveTo(x-r,y+r*0.45);c.lineTo(x+r,y+r*0.45);c.lineTo(x+r*0.85,y+r*0.62);c.lineTo(x-r*0.85,y+r*0.62);c.closePath();c.fill();c.stroke();},
  mail:(c,x,y,r)=>{c.beginPath();c.rect(x-r,y-r*0.65,r*2,r*1.3);c.fill();c.stroke();c.beginPath();c.moveTo(x-r,y-r*0.65);c.lineTo(x,y+r*0.1);c.lineTo(x+r,y-r*0.65);c.stroke();},
  sensor:(c,x,y,r)=>{c.beginPath();rrect(c,x-r*0.45,y-r*0.3,r*0.9,r*0.9,r*0.12);c.fill();c.stroke();c.beginPath();c.arc(x,y+r*0.15,r*0.16,0,TAU);c.stroke();c.beginPath();for(const k of[0.6,0.95]){c.moveTo(x-r*k*0.8,y-r*0.45-r*k*0.3);c.quadraticCurveTo(x,y-r*0.45-r*k*0.85,x+r*k*0.8,y-r*0.45-r*k*0.3);}c.stroke();},
  scale:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r*0.8);c.lineTo(x,y+r*0.85);c.moveTo(x-r*0.45,y+r*0.85);c.lineTo(x+r*0.45,y+r*0.85);c.moveTo(x-r*0.9,y-r*0.55);c.lineTo(x+r*0.9,y-r*0.55);c.stroke();
    for(const sg of[-1,1]){c.beginPath();c.moveTo(x+sg*r*0.9,y-r*0.55);c.lineTo(x+sg*r*0.9-r*0.32,y+r*0.12);c.moveTo(x+sg*r*0.9,y-r*0.55);c.lineTo(x+sg*r*0.9+r*0.32,y+r*0.12);c.stroke();c.beginPath();c.moveTo(x+sg*r*0.9-r*0.4,y+r*0.12);c.quadraticCurveTo(x+sg*r*0.9,y+r*0.45,x+sg*r*0.9+r*0.4,y+r*0.12);c.closePath();c.fill();c.stroke();}},
  loop:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r*0.75,-0.3,Math.PI*0.85);c.stroke();c.beginPath();c.arc(x,y,r*0.75,Math.PI-0.3,Math.PI*1.85);c.stroke();
    for(const a of[Math.PI*0.85,Math.PI*1.85]){const px=x+Math.cos(a)*r*0.75,py=y+Math.sin(a)*r*0.75,tg=a+Math.PI/2;c.beginPath();c.moveTo(px+Math.cos(tg-2.4)*r*0.32,py+Math.sin(tg-2.4)*r*0.32);c.lineTo(px,py);c.lineTo(px+Math.cos(tg+2.4)*r*0.32,py+Math.sin(tg+2.4)*r*0.32);c.stroke();}},
  bolt:(c,x,y,r)=>{c.beginPath();c.moveTo(x+r*0.15,y-r);c.lineTo(x-r*0.55,y+r*0.12);c.lineTo(x-r*0.02,y+r*0.12);c.lineTo(x-r*0.18,y+r);c.lineTo(x+r*0.55,y-r*0.15);c.lineTo(x+r*0.02,y-r*0.15);c.closePath();c.fill();c.stroke();},
  anchor:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.72,r*0.2,0,TAU);c.stroke();c.beginPath();c.moveTo(x,y-r*0.52);c.lineTo(x,y+r*0.85);c.moveTo(x-r*0.4,y-r*0.2);c.lineTo(x+r*0.4,y-r*0.2);c.moveTo(x-r*0.8,y+r*0.25);c.quadraticCurveTo(x-r*0.7,y+r*0.9,x,y+r*0.85);c.quadraticCurveTo(x+r*0.7,y+r*0.9,x+r*0.8,y+r*0.25);c.stroke();},
  hat:(c,x,y,r)=>{c.beginPath();c.ellipse(x,y+r*0.45,r,r*0.3,0,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.55,y+r*0.42);c.lineTo(x-r*0.48,y-r*0.55);c.quadraticCurveTo(x,y-r*0.75,x+r*0.48,y-r*0.55);c.lineTo(x+r*0.55,y+r*0.42);c.quadraticCurveTo(x,y+r*0.58,x-r*0.55,y+r*0.42);c.fill();c.stroke();
    c.beginPath();c.moveTo(x-r*0.52,y+r*0.05);c.quadraticCurveTo(x,y+r*0.2,x+r*0.52,y+r*0.05);c.stroke();},
  puzzle:(c,x,y,r)=>{const s=r*0.8;c.beginPath();c.moveTo(x-s,y-s);c.lineTo(x-s*0.25,y-s);c.arc(x,y-s,s*0.25,Math.PI,0);c.lineTo(x+s,y-s);c.lineTo(x+s,y-s*0.25);c.arc(x+s,y,s*0.25,-Math.PI/2,Math.PI/2);c.lineTo(x+s,y+s);c.lineTo(x-s,y+s);c.closePath();c.fill();c.stroke();},
  coin:(c,x,y,r)=>{for(const k of[0.5,0,-0.5]){c.beginPath();c.ellipse(x,y+k*r*0.62,r*0.82,r*0.36,0,0,TAU);c.fill();c.stroke();}},
  drop:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.bezierCurveTo(x+r*0.3,y-r*0.5,x+r*0.75,y,x+r*0.75,y+r*0.3);c.arc(x,y+r*0.3,r*0.75,0,Math.PI);c.bezierCurveTo(x-r*0.75,y,x-r*0.3,y-r*0.5,x,y-r);c.fill();c.stroke();},
  hand:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.5,y+r);c.lineTo(x-r*0.5,y+r*0.15);c.quadraticCurveTo(x-r*0.95,y-r*0.2,x-r*0.75,y-r*0.45);c.lineTo(x-r*0.38,y-r*0.1);c.lineTo(x-r*0.38,y-r*0.8);c.quadraticCurveTo(x-r*0.24,y-r*0.98,x-r*0.1,y-r*0.8);
    c.lineTo(x-r*0.1,y-r*0.95);c.quadraticCurveTo(x+r*0.04,y-r*1.12,x+r*0.18,y-r*0.95);c.lineTo(x+r*0.18,y-r*0.85);c.quadraticCurveTo(x+r*0.32,y-r*1.0,x+r*0.46,y-r*0.82);c.lineTo(x+r*0.46,y-r*0.6);c.quadraticCurveTo(x+r*0.6,y-r*0.72,x+r*0.72,y-r*0.55);c.lineTo(x+r*0.72,y+r*0.2);c.quadraticCurveTo(x+r*0.7,y+r*0.6,x+r*0.45,y+r*0.75);c.lineTo(x+r*0.45,y+r);c.closePath();c.fill();c.stroke();},
  road:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.35,y-r);c.lineTo(x-r,y+r);c.lineTo(x+r,y+r);c.lineTo(x+r*0.35,y-r);c.closePath();c.fill();c.stroke();c.beginPath();c.setLineDash([r*0.22,r*0.2]);c.moveTo(x,y-r*0.9);c.lineTo(x,y+r*0.9);c.stroke();c.setLineDash([]);},
  chair:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.45,y-r);c.lineTo(x-r*0.45,y+r);c.moveTo(x-r*0.45,y+r*0.05);c.lineTo(x+r*0.55,y+r*0.05);c.lineTo(x+r*0.55,y+r);c.stroke();c.beginPath();rrect(c,x-r*0.6,y-r*0.1,r*1.25,r*0.22,r*0.08);c.fill();c.stroke();},
  speech:(c,x,y,r)=>{c.beginPath();c.ellipse(x,y-r*0.12,r,r*0.7,0,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.45,y+r*0.45);c.lineTo(x-r*0.7,y+r*0.98);c.lineTo(x-r*0.05,y+r*0.56);c.fill();c.stroke();}
};
D.ICONS=Object.keys(ICON);
D.icon=(ctx,kind,cx,cy,r,o)=>{o=o||{};const f=ICON[kind];if(!f)throw new Error("PK.sk.icon: no icon called "+kind);ctx.save();pen(ctx,o.col||"ink",o.w||clamp(r*0.13,2.4,4.4));ctx.fillStyle=css(fillOf(o.fill||"white"));f(ctx,cx,cy,r);ctx.restore();};

/* ---------------------------------------------------------------- the graphic recording's sheet */
D.paper=(ctx,o)=>{o=Object.assign({},K.SK.paper,o||{});const {x,y,w,h}=o,c=o.col||[240,229,206];ctx.save();ctx.fillStyle="rgba(60,40,40,0.18)";ctx.fillRect(x+8,y+10,w,h);ctx.fillStyle=css(c);ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=css(dk(c,0.22));ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.restore();if(o.pins!==false)for(const [px,py] of[[x+24,y+18],[x+w-24,y+18],[x+24,y+h-18],[x+w-24,y+h-18]])D.pin(ctx,px,py);};
D.drawn=(draw,box)=>({draw:c=>draw(c),box:box||[K.SK.board.x,K.SK.board.y,K.SK.board.x+K.SK.board.w,K.SK.board.y+K.SK.board.h],d:0.1,drawn:true});

/* ---------------------------------------------------------------- pieces */
D.card=(ctx,x,y,o)=>{o=o||{};const size=o.size||36,pad=o.pad==null?18:o.pad,rows=(o.lines||[]).map(rowOf),ir=o.icon?(o.ir||size*0.62):0,
    lh=(o.lh||1.22),hs=rows.map(([,ro])=>(ro.size||size)*lh),th=hs.reduce((a,b)=>a+b,0)-(rows.length?((rows[rows.length-1][1].size||size)*(lh-1)):0),
    tw=widthOf(ctx,o.lines||[],{size}),ix=o.icon?ir*2+pad*0.7:0,w=o.w||Math.ceil(tw+ix+pad*2),h=o.h||Math.ceil(Math.max(th+pad*1.5,ir*2+pad*1.2));
  D.box(ctx,x,y,w,h,{fill:o.fill==null?"paper":o.fill,col:o.col||"ink",w:o.lw||3,r:o.r==null?14:o.r,dash:o.dash});
  if(o.icon)D.icon(ctx,o.icon,x+pad+ir,y+h/2,ir,{fill:o.ifill||o.fill||"white"});
  let yy=y+(h-th)/2;rows.forEach(([s,ro],i)=>{const sz=ro.size||size;yy+=sz*0.8;D.text(ctx,s,x+pad+ix,yy,Object.assign({size,col:o.ink},ro));yy+=sz*(lh-0.8);});return{x,y,w,h};};
D.list=(ctx,x,y,items,o)=>{o=o||{};const size=o.size||38,gap=o.gap||size*1.6,out=[];
  items.forEach((it,i)=>{const base=y+i*gap,mid=base-size*0.3,r=size*0.42,c=it.col||o.col||"blue";let tx=x;
    if(it.icon){D.icon(ctx,it.icon,x+r*1.2,mid,r*1.2,{fill:it.ifill||c});tx=x+r*2.4+size*0.45;}
    else if(it.num!=null){D.disc(ctx,x+r,mid,r,{fill:fillOf(c),col:"ink",w:3});D.text(ctx,String(it.num),x+r,mid+size*0.26,{size:size*0.72,w:700,align:"center"});tx=x+r*2+size*0.45;}
    else if(it.dot){D.disc(ctx,x+r*0.5,mid,r*0.42,{fill:c,col:c,w:2});tx=x+r+size*0.35;}
    const m=D.text(ctx,it.s,tx,base,Object.assign({size,col:it.ink},it.o||{}));let x1=m.x1;
    if(it.sub){const sx=o.subX!=null?x+o.subX:m.x1+size*0.45,ms=D.text(ctx,it.sub,sx,base,Object.assign({size:o.subSize||size*0.84,col:"mut"},it.subO||{}));x1=ms.x1;}
    out.push({x,y:base-size,w:x1-x,h:size*1.3,base,mark:[x1+size*0.7,mid]});});return out;};
D.faces=(ctx,x,y,who,o)=>{o=o||{};const r=o.r||30,gap=o.gap||r*3.1,out=[];who.forEach((k,i)=>{const cx=x+i*gap;D.face(ctx,k,cx,y,r,o.ring?{ring:o.ring}:{});
    const nm=o.names===true?(typeof k==="string"&&K.CAST[k]?K.CAST[k].name.split(" ")[0]:""):(o.names||[])[i];if(nm)D.text(ctx,nm,cx,y+r*1.55+(o.size||30)*0.9,{size:o.size||30,w:700,align:"center",col:o.ncol});out.push({cx,cy:y});});return out;};
D.flow=(ctx,x,y,steps,o)=>{o=o||{};const size=o.size||34,gap=o.gap||60,out=[];let cx=x,cy=y;
  steps.forEach((st,i)=>{const s=typeof st==="string"?{s:st}:st,b=D.card(ctx,cx,cy,{icon:s.icon,lines:[[s.s,Object.assign({w:s.w||700},s.o||{})]].concat(s.sub?[[s.sub,{size:size*0.86,col:"mut"}]]:[]),size,fill:s.fill||"paper",col:s.col||"ink",h:o.h,w:s.bw||o.bw,ifill:s.ifill});out.push(b);
    if(i<steps.length-1){if(o.down){D.arrow(ctx,[b.x+b.w/2,b.y+b.h+8],[b.x+b.w/2,b.y+b.h+gap-8],{col:o.acol||"ink",w:3.5,head:14});cy=b.y+b.h+gap;}
      else{D.arrow(ctx,[b.x+b.w+8,b.y+b.h/2],[b.x+b.w+gap-8,b.y+b.h/2],{col:o.acol||"ink",w:3.5,head:14});cx=b.x+b.w+gap;}}});return out;};

/* ---------------------------------------------------------------- charts */
D.bars=(ctx,x,y,w,h,bars,o)=>{o=o||{};const n=bars.length,max=o.max||Math.max(...bars.map(b=>b.v)),slot=w/n,bw=o.bw||slot*0.56,size=o.size||30,base=y+h;
  bars.forEach((b,i)=>{const bh=Math.max(4,h*b.v/max),bx=x+slot*(i+0.5)-bw/2;D.box(ctx,bx,base-bh,bw,bh,{fill:fillOf(b.fill||b.col||"blue"),col:"ink",w:3,r:4});
    if(b.top)D.text(ctx,b.top,bx+bw/2,base-bh-size*0.4,{size:b.topSize||size,w:700,align:"center",col:b.ink||b.col||"ink"});
    if(b.label)D.text(ctx,b.label,bx+bw/2,base+size*1.1,{size,align:"center",col:b.lcol||"mut"});});
  D.line(ctx,[[x-10,base],[x+w+10,base]],{col:"ink",w:3.5,seed:7});return{x,y,w,h};};
D.trend=(ctx,x,y,w,h,pts,o)=>{o=o||{};const P=pts.map(([u,v])=>[x+u*w,y+h-v*h]);D.line(ctx,[[x,y-6],[x,y+h],[x+w+12,y+h]],{col:"ink",w:3,seed:3});
  D.line(ctx,P,{col:o.col||"blue",w:o.w||5,seed:11});if(o.dots!==false)for(const q of[P[0],P[P.length-1]])D.disc(ctx,q[0],q[1],8,{fill:fillOf(o.col||"blue"),col:"ink",w:2.5});
  for(const [u,s] of o.labels||[])D.text(ctx,s,x+u*w,y+h+(o.size||30)*1.1,{size:o.size||30,align:"center",col:"mut"});return{x,y,w,h};};
D.donut=(ctx,cx,cy,r,parts,o)=>{o=o||{};const tot=parts.reduce((a,p)=>a+p.v,0);let a=-Math.PI/2;ctx.save();pen(ctx,"ink",3);
  for(const p of parts){const b=a+TAU*p.v/tot;ctx.beginPath();ctx.arc(cx,cy,r,a,b);ctx.arc(cx,cy,r*0.56,b,a,true);ctx.closePath();ctx.fillStyle=css(fillOf(p.col||"blue"));if(p.strong)ctx.fillStyle=css(colOf(p.col));ctx.fill();ctx.stroke();a=b;}ctx.restore();
  if(o.label)D.text(ctx,o.label,cx,cy+(o.size||40)*0.34,{size:o.size||40,w:700,align:"center",col:o.lcol});return{x:cx-r,y:cy-r,w:r*2,h:r*2};};
D.cycle=(ctx,cx,cy,r,steps,o)=>{o=o||{};const n=steps.length,size=o.size||32,a0=o.a0==null?-Math.PI/2:o.a0,pos=steps.map((s,i)=>{const a=a0+TAU*i/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r*(o.flat||1),a];}),
    ws=steps.map(st=>{const [s]=rowOf(st);return K.handW(ctx,s,size,700)+size*0.9;});
  // arrows along the circle, between each pill and the next
  for(let i=0;i<n;i++){const [x0,y0,a]=pos[i],[x1,y1,b0]=pos[(i+1)%n],b=b0<=a?b0+TAU:b0,m0=a+(b-a)*0.3,m1=a+(b-a)*0.7,rr=r*1.02;
    D.arrow(ctx,[cx+Math.cos(m0)*rr,cy+Math.sin(m0)*rr*(o.flat||1)],[cx+Math.cos(m1)*rr,cy+Math.sin(m1)*rr*(o.flat||1)],{col:o.acol||"ink",w:3.5,head:14,bow:-(rr*(o.flat||1))*0.12});}
  steps.forEach((st,i)=>{const [s,ro]=rowOf(st),[px,py]=pos[i],w=ws[i],h=size*1.5;D.box(ctx,px-w/2,py-h/2,w,h,{fill:fillOf(ro.col||o.col||"blue"),col:"ink",w:3,r:h/2});D.text(ctx,s,px,py+size*0.33,{size,w:700,align:"center"});});
  if(o.mid)D.text(ctx,o.mid,cx,cy+size*0.35,{size:o.midSize||size,w:700,align:"center",col:o.midCol||"mut"});return pos;};
D.stairs=(ctx,x,y,w,h,steps,o)=>{o=o||{};const n=steps.length,sw=w/n,size=o.size||30;ctx.save();
  steps.forEach((st,i)=>{const [s,ro]=rowOf(st),sh=h*(i+1)/n,bx=x+i*sw;D.box(ctx,bx,y+h-sh,sw,sh,{fill:fillOf(ro.col||o.col||"blue"),col:"ink",w:3,r:3});D.text(ctx,s,bx+sw/2,y+h-sh-size*0.45,{size,w:700,align:"center"});});
  if(o.flag)D.icon(ctx,"flag",x+w-sw*0.3,y-size*2.2,size*0.8,{fill:o.flag});ctx.restore();return{x,y,w,h};};
D.matrix=(ctx,x,y,w,h,o)=>{o=o||{};const size=o.size||30,q=o.q||[];
  if(o.on!=null){const i=o.on,qx=x+(i%2)*w/2,qy=y+(i>>1)*h/2;D.box(ctx,qx+6,qy+6,w/2-12,h/2-12,{fill:o.col||"green",col:false,r:10});}
  D.arrow(ctx,[x,y+h],[x,y-8],{col:"ink",w:3.5,head:14});D.arrow(ctx,[x,y+h],[x+w+8,y+h],{col:"ink",w:3.5,head:14});
  D.line(ctx,[[x+w/2,y+6],[x+w/2,y+h-6]],{col:"mut",w:2.5,dash:[8,8],seed:5});D.line(ctx,[[x+6,y+h/2],[x+w-6,y+h/2]],{col:"mut",w:2.5,dash:[8,8],seed:6});
  // each corner's words, wrapped to the corner with room on each side
  q.forEach((r,i)=>{const [s,ro]=rowOf(r),sz=ro.size||size,L=D.wrap(ctx,s,w/2-40,{size:sz,w:700}),lh=sz*1.12,cx=x+(i%2+0.5)*w/2,cy=y+((i>>1)+0.5)*h/2;
    L.forEach((l,j)=>D.text(ctx,l,cx,cy+(j-(L.length-1)/2)*lh+sz*0.3,Object.assign({size:sz,w:700,align:"center"},ro)));});
  if(o.xs)D.text(ctx,o.xs,x+w,y+h+size*1.15,{size,align:"right",col:"mut"});if(o.ys)D.text(ctx,o.ys,x+12,y-size*0.5,{size,col:"mut"});return{x,y,w,h};};
D.pyramid=(ctx,cx,y,w,h,layers,o)=>{o=o||{};const n=layers.length,size=o.size||32,lh=h/n,at=yy=>w*(yy-y)/h;
  layers.forEach((l,i)=>{const [s,ro]=rowOf(l),t0=i/n,t1=(i+1)/n,y0=y+i*lh,y1=y0+lh;ctx.save();ctx.beginPath();ctx.moveTo(cx-w/2*t0,y0);ctx.lineTo(cx+w/2*t0,y0);ctx.lineTo(cx+w/2*t1,y1);ctx.lineTo(cx-w/2*t1,y1);ctx.closePath();
    ctx.fillStyle=css(fillOf(ro.col||o.col||"blue"));ctx.fill();pen(ctx,"ink",3);ctx.stroke();ctx.restore();if(!s)return;
    // the words go in their layer where it is wide enough at their top; else beside it, with a line to it
    const W=K.handW(ctx,s,size,700),base=y0+lh*(i===0?0.78:0.5)+size*0.34;
    if(W+24<=at(base-size*0.72))D.text(ctx,s,cx,base,{size,w:700,align:"center"});
    else{const ym=y0+lh*0.62,ex=cx+at(ym)/2;D.line(ctx,[[ex+6,ym],[ex+48,ym]],{col:"ink",w:2.5,seed:i+3});D.text(ctx,s,ex+58,ym+size*0.32,{size,w:700});}});return{x:cx-w/2,y,w,h};};
D.timeline=(ctx,x,y,w,marks,o)=>{o=o||{};const size=o.size||30;D.arrow(ctx,[x,y],[x+w,y],{col:"ink",w:3.5,head:16});
  for(const m of marks){const px=x+m.u*w,up=m.up!=null?m.up:true;D.disc(ctx,px,y,9,{fill:fillOf(m.col||"blue"),col:"ink",w:2.5});
    if(m.s)D.text(ctx,m.s,px,up?y-size*0.75:y+size*1.35,{size,w:700,align:"center",col:m.ink});if(m.sub)D.text(ctx,m.sub,px,up?y-size*1.95:y+size*2.45,{size:size*0.9,align:"center",col:"mut"});}return{x,y,w};};
D.scale=(ctx,cx,cy,w,o)=>{o=o||{};const t=clamp(o.tilt||0,-1,1)*0.2,size=o.size||30,hw=w/2,lx=cx-Math.cos(t)*hw,ly=cy+Math.sin(t)*hw,rx=cx+Math.cos(t)*hw,ry=cy-Math.sin(t)*hw;
  D.line(ctx,[[cx,cy-14],[cx,cy+w*0.42]],{col:"ink",w:4,seed:2});D.line(ctx,[[cx-w*0.16,cy+w*0.42],[cx+w*0.16,cy+w*0.42]],{col:"ink",w:4,seed:3});D.line(ctx,[[lx,ly],[rx,ry]],{col:"ink",w:4.5,seed:4});D.disc(ctx,cx,cy,8,{fill:fillOf("amber"),col:"ink",w:2.5});
  for(const [px,py,s,c] of[[lx,ly,o.l,o.lcol||"amber"],[rx,ry,o.r,o.rcol||"green"]]){const pw=Math.max(w*0.36,(s?K.handW(ctx,s,size,700):0)+size*0.8),ph=size*1.45;
    D.line(ctx,[[px,py],[px-pw*0.4,py+w*0.18]],{col:"ink",w:2.5,seed:5});D.line(ctx,[[px,py],[px+pw*0.4,py+w*0.18]],{col:"ink",w:2.5,seed:6});
    D.box(ctx,px-pw/2,py+w*0.18,pw,ph,{fill:fillOf(c),col:"ink",w:3,r:ph/2});if(s)D.text(ctx,s,px,py+w*0.18+ph*0.5+size*0.33,{size,w:700,align:"center"});}return{x:cx-w/2,y:cy,w};};
D.venn=(ctx,cx,cy,r,o)=>{o=o||{};const size=o.size||32,d=r*0.62;ctx.save();ctx.globalAlpha*=0.85;for(const [x0,c] of[[cx-d,o.lcol||"blue"],[cx+d,o.rcol||"green"]]){ctx.fillStyle=css(tintOf(c));ctx.beginPath();ctx.arc(x0,cy,r,0,TAU);ctx.fill();}ctx.restore();
  for(const x0 of[cx-d,cx+d])D.disc(ctx,x0,cy,r,{col:"ink",w:3.5});
  // each side's words in the middle of what is only its own, the shared words where the two overlap: smaller to fit, never under
  // 28 px; words that don't fit even so go over their round (a side's) or under the overlap (the shared words)
  const fit=(s,room,sz)=>{const W=K.handW(ctx,s,sz,700),k=Math.min(1,room/Math.max(1,W));return sz*k>=28?sz*k:0;};
  for(const [s,sg] of[[o.l,-1],[o.r,1]])if(s){const f=fit(s,2*d-24,size);if(f)D.text(ctx,s,cx+sg*r,cy+f*0.3,{size:f,w:700,align:"center"});else D.text(ctx,s,cx+sg*d,cy-r-size*0.45,{size,w:700,align:"center"});}
  if(o.mid){const ms=o.midSize||size*0.9,f=fit(o.mid,2*(r-d)-14,ms),col=o.midCol||"ink";if(f)D.text(ctx,o.mid,cx,cy+f*0.3,{size:f,w:700,align:"center",col});
    else{D.line(ctx,[[cx,cy+r*0.55],[cx,cy+r+12]],{col:"ink",w:2.5,seed:9});D.text(ctx,o.mid,cx,cy+r+12+ms*1.0,{size:ms,w:700,align:"center",col});}}
  return{x:cx-d-r,y:cy-r,w:2*(d+r),h:2*r};};
D.dots=(ctx,x,y,cols,rows,o)=>{o=o||{};const g=o.gap||22,r=o.r||7,on=o.on||0;let k=0;ctx.save();pen(ctx,"ink",1.8);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++,k++){ctx.beginPath();ctx.arc(x+i*g,y+j*g,r,0,TAU);ctx.fillStyle=css(k<on?fillOf(o.col||"blue"):tintOf(o.off||"white"));ctx.fill();ctx.stroke();}ctx.restore();return{x,y,w:(cols-1)*g,h:(rows-1)*g};};
D.big=(ctx,s,cx,cy,o)=>{o=o||{};const size=o.size||64,W=K.handW(ctx,s,size,700),r=o.r||Math.max(size*0.95,W*0.62+size*0.3);ctx.save();ctx.beginPath();
  for(let i=0;i<=24;i++){const a=i*TAU/24,rr=r*(i%2?0.94:1.06);i?ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}ctx.closePath();
  ctx.fillStyle=css(fillOf(o.fill||o.col||"amber"));ctx.fill();pen(ctx,"ink",3);ctx.stroke();ctx.restore();D.text(ctx,s,cx,cy+size*0.34,{size,w:700,align:"center",col:o.col||"ink"});return{x:cx-r,y:cy-r,w:r*2,h:r*2};};
})(PK);
