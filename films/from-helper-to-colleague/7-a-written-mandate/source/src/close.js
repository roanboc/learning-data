/* ===== A mandate, written and enforced: the series' close =====
     WM_LESSONS          the seven films of From helper to colleague and their lessons, as the series' briefs give them (plan v2, 5 November
                         2026): each film's end card says its lesson the same way
     wm_lessons(ctx, o)  the seven cards, four over three: o.show(i) 0..1 for each; o.slots, their empty places, dashed; o.deco when the
                         camera makes them small (decoration: the voice says each lesson as it comes in)
     wm_gridBox(ctx)     the grid's bounds, for moving it into its place on the road
     WM_ROAD, wm_shelf(i), wm_shelves(ctx, o)  the module's road, seen from further off: an oak rail, and on it the four series of AI agents in
                         data work, the three that are made with their films as small cards, the fourth still to come in a dashed outline;
                         o.lit (the next one, lit blue), o.skip (the shelf the grid goes into, drawn without its small cards), o.shelfA(i) */

const WM_LESSONS=[["Five stages, not a switch","Autonomy is earned one kind of task at a time."],
  ["Borrowed rights","Borrowed rights are for learning, in a sandbox."],
  ["A place on the map","Before an agent works alone, it's architected like a colleague."],
  ["Rights follow the role","An agent's rights come from its work, not from a person's."],
  ["The map, enforced","The map says what it may do; every tool holds it to that."],
  ["Every change through review","An agent proposes; a person releases."],
  ["A mandate, written and enforced","Autonomy is a written, narrow, revocable mandate."]];
const WM_GRID={y:150,w:420,gx:26,gy:26,rows:[[0,1,2,3],[4,5,6]]};
// the cards' sizes: four in the first row, three in the second, each row centred and as tall as its tallest card
function wm_gridLayout(ctx){const G=WM_GRID,cells=[],meas=WM_LESSONS.map(l=>({tl:wm_wrap(ctx,l[0],G.w-56,{w:600,size:28}),ll:wm_wrap(ctx,l[1],G.w-56,{w:700,size:30})}));
  let y=G.y;G.rows.forEach(row=>{let h=0;row.forEach(i=>{const m=meas[i];h=Math.max(h,26+m.tl.length*36+14+m.ll.length*40+20);});
    const rw=row.length*G.w+(row.length-1)*G.gx,x0=(1920-rw)/2;row.forEach((i,c)=>{cells[i]={x:x0+c*(G.w+G.gx),y,w:G.w,h,tl:meas[i].tl,ll:meas[i].ll};});y+=h+G.gy;});
  return cells;}
function wm_lessons(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const cells=wm_gridLayout(ctx),deco=o.deco?1:0;ctx.save();ctx.globalAlpha*=a;
  // o.slots: the seven places, dashed, each going as its lesson comes in
  if(o.slots>0)cells.forEach((c,i)=>{const s=o.show?o.show(i):1;wm_dash(ctx,c.x,c.y,c.w,c.h,20,AG.mut,o.slots*0.7*(1-clamp(s*2,0,1)));});
  cells.forEach((c,i)=>{const s=o.show?o.show(i):1;if(s<=0)return;const k=Math.min(1.03,ag_spr(s,0,0.55));ctx.save();ctx.globalAlpha*=clamp(s*2,0,1);
    ag_about(ctx,c.x+c.w/2,c.y+c.h/2,lerp(0.85,1,clamp(k,0,1.1)));
    const last=i===WM_LESSONS.length-1;ag_box(ctx,c.x,c.y,c.w,c.h,20,{edge:last?AG.blue:null,edgeA:0.7});
    let yy=c.y+26;c.tl.forEach((l,j)=>{yy+=(j?36:26);ag_T(ctx,l,c.x+28,yy,{w:600,size:28,col:AG.mut,deco});});yy+=14;
    c.ll.forEach((l,j)=>{yy+=(j?40:38);ag_T(ctx,l,c.x+28,yy,{w:700,size:30,col:AG.ink,deco});});ctx.restore();});
  ctx.restore();return cells;}
function wm_gridBox(ctx){const c=wm_gridLayout(ctx);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;c.forEach(b=>{x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.w);y1=Math.max(y1,b.y+b.h);});
  return{x:x0,y:y0,w:x1-x0,h:y1-y0};}

/* the module's road: What an agent is (ten films), Agents at work on data (nine), From helper to colleague (seven), and A colleague that
   isn't a person, still to come */
const WM_ROAD={y:676,shelves:[["What an agent is",10],["Agents at work on data",9],["From helper to colleague",7],["A colleague that isn't a person",0]],x:84,w:408,gap:32,top:300,h:320};
function wm_shelf(i){const R=WM_ROAD;return{x:R.x+i*(R.w+R.gap),y:R.top,w:R.w,h:R.h};}
function wm_shelves(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const R=WM_ROAD;ctx.save();ctx.globalAlpha*=a;
  // the rail, and its arrow onward
  const x0=40,x1=1880,y=R.y;ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;
  const g=ctx.createLinearGradient(0,y,0,y+22);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.2),1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;rr(ctx,x0,y,x1-x0-30,22,6);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0+6,y+1.5);ctx.lineTo(x1-36,y+1.5);ctx.stroke();ag_arrowHead(ctx,x1-16,y+11,0,22,rgba(AG_OAK.dark,1));
  R.shelves.forEach((s,i)=>{const b=wm_shelf(i),n=s[1],sa=o.shelfA?o.shelfA(i):1;if(sa<=0)return;ctx.save();ctx.globalAlpha*=sa;
    const lit=o.lit===i?(o.litA==null?1:o.litA):0;
    if(n){ag_box(ctx,b.x,b.y,b.w,b.h,22,{});}
    else{ctx.fillStyle="rgba(250,249,246,0.5)";rr(ctx,b.x,b.y,b.w,b.h,22);ctx.fill();wm_dash(ctx,b.x-5,b.y-5,b.w+10,b.h+10,26,lit>0?mix(AG.mut,AG.blue,lit):AG.mut,1);}
    if(lit>0){ctx.save();ctx.shadowColor=rgba(AG.blue,0.6*lit);ctx.shadowBlur=26;ctx.strokeStyle=rgba(AG.blue,0.8*lit);ctx.lineWidth=3;rr(ctx,b.x,b.y,b.w,b.h,22);ctx.stroke();ctx.restore();}
    const tl=wm_wrap(ctx,s[0],b.w-48,{w:700,size:30});tl.forEach((l,j)=>ag_T(ctx,l,b.x+24,b.y+50+j*38,{w:700,size:30,col:n?AG.ink:AG.mut}));
    // a made series: its films, as small cards, four to a row (decoration: the voice and the shelves' titles say what they are)
    if(n&&o.skip!==i){for(let k=0;k<n;k++){const cx=b.x+28+(k%4)*90,cy=b.y+138+(k/4|0)*54;ctx.save();ctx.shadowColor="rgba(46,38,28,0.14)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;
        ctx.fillStyle="#EEEBE5";rr(ctx,cx,cy,80,44,8);ctx.fill();ctx.restore();ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1;rr(ctx,cx,cy,80,44,8);ctx.stroke();
        ctx.fillStyle="rgba(86,92,100,0.22)";rr(ctx,cx+10,cy+12,52,7,3.5);ctx.fill();rr(ctx,cx+10,cy+25,38,7,3.5);ctx.fill();}}
    // the oak post from the shelf down to the rail
    ctx.fillStyle=rgba(AG_OAK.dark,0.8);ctx.fillRect(b.x+b.w/2-5,b.y+b.h,10,R.y-b.y-b.h);ctx.restore();});
  ctx.restore();}
