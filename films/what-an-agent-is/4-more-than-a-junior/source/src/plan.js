/* ===== More than a junior: the room's own pieces =====
   What this film adds to the module's room: the agent where the series puts it, with its "Junior" badge; the paper junior, a pale
   cut-out of a person that stands for the picture we put on the agent; the two-column card that fills chapter by chapter; the
   project's 33 table cards and the lit path; the shelves; the session cards; the team's notes for agents; the clock and the nightly
   run; the calendar; the ladder; the stamps. Every top-level name starts with mj_ or MJ_, the film's own prefix. Sizes are in the
   1920 x 1080 frame; every word at least 28 px as drawn, and nothing below y 890 but the captions. */

/* ---------------------------------------------------------------- where things are in the room */
const MJ_ROOM={agent:{x:1124,y:476,r:88,R:180},jun:{x:296,y:596,s:1.0}};
// the agent in its ring, where the series has it: o.t, o.core, o.think, o.pulse (the light travelling round the ring while it works),
// o.badge (0 to 1: the "Junior" badge hangs from the ring's foot), o.a; and its light on the wall and its shadow on the floor
function mj_agent(ctx,o){o=o||{};const A=MJ_ROOM.agent,x=o.x||A.x,y=o.y||A.y,t=o.t||0,a=o.a==null?1:o.a;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;
  const pulse=o.pulse==null?{deg:(t*36)%360-120,a:0.7}:o.pulse;
  ag_loop(ctx,x,y,{t,core:o.core==null?0.8:o.core,think:o.think||0,pulse,lit:o.lit,col:o.col,steps:o.steps,R:o.R,r:o.r,floor:o.floor===undefined?y+330:o.floor,label:o.label});
  if(o.badge>0){const hy=y+(o.R||A.R)+4;ctx.save();if(o.swing){ctx.translate(x,hy);ctx.rotate(o.swing);ctx.translate(-x,-hy);}
    ag_badge(ctx,x,hy,"Junior",{t,drop:lerp(30,86,ag_spr(o.badge,0,0.5)),a:clamp(o.badge*3,0,1)});ctx.restore();}
  ctx.restore();}
// where the agent's badge hangs from
const mj_hook=()=>[MJ_ROOM.agent.x,MJ_ROOM.agent.y+MJ_ROOM.agent.R+4];
// an arm from the sphere out to (tx, ty), u 0 to 1; o.from "left" leaves the sphere on its left; o.data, o.grip, o.a
function mj_arm(ctx,tx,ty,u,o){o=o||{};if(u<=0.002)return;const A=MJ_ROOM.agent,sd=o.from==="left"?-1:1,x0=A.x+sd*58,y0=A.y+44,
    p=[x0,y0,x0+sd*150,y0+70,tx-sd*130,ty+60,tx,ty];ag_reach(ctx,p,u,{data:o.data,grip:o.grip,a:o.a});}

/* ---------------------------------------------------------------- the paper junior and the ladder
   mj_junior(ctx, x, y, h, o): a pale paper cut-out of a person, head and shoulders, on a small oak foot; (x, y) where the foot meets the
   floor, h its height. It stands for the junior picture, an idea rather than a colleague. o: t; badge (0 to 1, the "Junior" badge on a
   lanyard at its neck); nod (radians, about the neck); tip (the whole cut-out tilts, radians, about its foot); cards (how many small
   task cards it holds in front, 0 to 3), ticks (how many of those have a reviewer's green tick), amber (0 to 1: its one card turns
   amber), name (its name signed on its first card); a. Returns where its neck is. */
function mj_juniorPath(c,h){const hr=h*0.12,ny=-h+hr*2.15,sw=h*0.34;
  c.moveTo(-sw,-h*0.06);c.bezierCurveTo(-sw,-h*0.3,-sw*0.96,-h*0.44,-sw*0.74,-h*0.5);c.bezierCurveTo(-sw*0.5,-h*0.56,-h*0.08,-h*0.56,-h*0.07,ny+hr*0.25);
  c.bezierCurveTo(-hr*1.05,ny-hr*0.2,-hr*1.05,-h,0,-h);c.bezierCurveTo(hr*1.05,-h,hr*1.05,ny-hr*0.2,h*0.07,ny+hr*0.25);
  c.bezierCurveTo(h*0.08,-h*0.56,sw*0.5,-h*0.56,sw*0.74,-h*0.5);c.bezierCurveTo(sw*0.96,-h*0.44,sw,-h*0.3,sw,-h*0.06);c.closePath();}
function mj_junior(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const t=o.t||0,sway=Math.sin(t*0.8)*0.006;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*2,y+4,h*0.34,h*0.035,0.28);
  ctx.translate(x,y);ctx.rotate((o.tip||0)+sway);
  // the oak foot, and a slot the paper stands in
  ag_soft(ctx,c=>ag_rect(c,-h*0.2,-h*0.05,h*0.4,h*0.05,4),AG_OAK.base,AG_OAK.hi,h*0.1,-h*0.05,h*0.3,rgba(AG_OAK.dark,0.4),6,0.6);
  // its shadow on the wall behind, falling left; then the paper, a little curved (lighter to the right), with a soft fold down the middle
  ctx.save();ctx.translate(-h*0.05,-h*0.02);ctx.filter="blur(10px)";ctx.fillStyle="rgba(46,38,28,0.16)";ag_shape(ctx,c=>{ctx.save();ctx.translate(0,-h*0.05);mj_juniorPath(c,h*0.95);ctx.restore();});ctx.fill();ctx.filter="none";ctx.restore();
  ctx.save();ctx.translate(0,-h*0.05);if(o.nod){ctx.translate(0,-h*0.62);ctx.rotate(o.nod*0.4);ctx.translate(0,h*0.62);}
  const P=c=>mj_juniorPath(c,h*0.95);ag_shape(ctx,P);const g=ctx.createLinearGradient(-h*0.34,0,h*0.34,0);g.addColorStop(0,"#E4DFD6");g.addColorStop(0.55,"#F3F0EA");g.addColorStop(1,"#FBFAF7");
  ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(120,110,96,0.35)";ctx.lineWidth=1.5;ctx.stroke();
  ctx.save();ag_shape(ctx,P);ctx.clip();ctx.strokeStyle="rgba(120,110,96,0.16)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-h*0.95);ctx.lineTo(0,0);ctx.stroke();
  // a hint of a face and a collar, pencilled, so it reads as a person and not as anyone in particular
  ctx.strokeStyle="rgba(120,110,96,0.28)";ctx.lineWidth=2.2;ctx.lineCap="round";const hy=-h*0.95+h*0.95*0.12;
  ctx.beginPath();ctx.arc(h*0.02,hy+h*0.02,h*0.05,0.3,Math.PI-0.3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-h*0.08,-h*0.5);ctx.lineTo(0,-h*0.42);ctx.lineTo(h*0.08,-h*0.5);ctx.stroke();ctx.restore();
  const neck=[0,-h*0.95*0.73];
  // the task cards it holds, each a reviewer's tick
  const n=o.cards||0;for(let i=0;i<n;i++){const cx=-h*0.15+i*h*0.1,cy=-h*0.3+i*h*0.02,cw=h*0.2,ch=h*0.14;ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.08+i*0.06);
    const amb=i===n-1?clamp(o.amber||0,0,1):0;ag_box(ctx,-cw/2,-ch/2,cw,ch,8,{edge:amb>0?AG.amber:null,edgeA:amb});
    ctx.fillStyle="rgba(86,92,100,0.3)";ctx.fillRect(-cw*0.34,-ch*0.18,cw*0.5,ch*0.1);ctx.fillRect(-cw*0.34,ch*0.04,cw*0.36,ch*0.1);
    if(o.name&&i===0){ctx.strokeStyle=rgba(AG.ink,0.7);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-cw*0.36,ch*0.34);
      for(let k=0;k<=12;k++)ctx.lineTo(-cw*0.36+k*cw*0.045,ch*0.34-Math.sin(k*1.7)*ch*0.07-(k===3?ch*0.1:0));ctx.stroke();}
    if(i<(o.ticks||0))ag_tick(ctx,cw*0.26,0,ch*0.42,rgba(AG.green,1),4);if(amb>0)withA(ctx,amb,()=>ag_warn(ctx,cw*0.26,0,ch*0.5,rgba(AG.amber,1)));ctx.restore();}
  if(o.badge>0)ag_badge(ctx,neck[0],neck[1],"Junior",{t,drop:lerp(30,86,ag_spr(o.badge,0,0.5)),a:clamp(o.badge*3,0,1)});
  ctx.restore();ctx.restore();return{x,y:y-h*0.05+neck[1]};}
// a small oak ladder standing against the wall: its foot's middle at (x, y), h tall, n rungs; o.tip (radians, about its foot), o.a.
// Returns the height of each rung above the foot.
function mj_ladder(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a,n=o.n||5,w=h*0.26;if(a<=0)return[];ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*2,y+3,w*0.9,8,0.25);ctx.translate(x,y);ctx.rotate(o.tip||0);
  const rail=s=>ag_soft(ctx,c=>{c.moveTo(s*w/2-5,0);c.lineTo(s*w*0.42-4,-h);c.lineTo(s*w*0.42+4,-h);c.lineTo(s*w/2+5,0);c.closePath();},AG_OAK.base,AG_OAK.hi,s*w/2,-h*0.6,h*0.6,rgba(AG_OAK.dark,0.4),6,0.6);
  const rungs=[];for(let i=1;i<=n;i++){const ry=-h*i/(n+1),hw=lerp(w/2,w*0.42,i/(n+1));rungs.push(-ry);ag_soft(ctx,c=>ag_rect(c,-hw,ry-5,hw*2,10,4),AG_OAK.base,AG_OAK.hi,hw*0.5,ry,hw,rgba(AG_OAK.dark,0.35),4,0.5);}
  rail(-1);rail(1);ctx.restore();return rungs;}

/* ---------------------------------------------------------------- the two-column card
   Where the junior picture holds and where it breaks, filled chapter by chapter. (x, y) its top left; o.fill[i] for each row: 0 empty,
   1 the junior's side shown, 2 both; o.lit[i] 0 to 1: the agent's side lit violet (the "more" rows); o.mark[i] 0 to 1: a soft grey band
   while a row is named; o.more, o.less: the brackets beside it; o.k, o.a. 960 wide. */
const MJ_ROWS=[["Knows","a little","more than any of us"],["Pace","a week","a minute"],["Memory","remembers","starts each session fresh"],["Career","ahead","none"],["A mistake costs","them","it nothing"]];
const MJ_TWO={w:960,head:84,row:68,c1:36,c2:300,c3:540};
function mj_two(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const T=MJ_TWO,h=T.head+T.row*5+24,fill=o.fill||[],lit=o.lit||[];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+T.w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,T.w,h,22,{});
  ag_T(ctx,"A junior",x+T.c2,y+52,{w:700,size:30,col:AG.mut});ag_T(ctx,"The agent",x+T.c3,y+52,{w:700,size:30,col:AG.ink});
  ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+T.head-6);ctx.lineTo(x+T.w-24,y+T.head-6);ctx.stroke();
  MJ_ROWS.forEach((r,i)=>{const ry=y+T.head+i*T.row,f=fill[i]||0,l=clamp(lit[i]||0,0,1);
    if(l>0){ctx.fillStyle=rgba(AG.violet,0.09*l);rr(ctx,x+T.c3-18,ry+6,T.w-T.c3-6,T.row-12,14);ctx.fill();}
    const mk=clamp((o.mark||[])[i]||0,0,1);if(mk>0){ctx.fillStyle=rgba(AG.mut,0.1*mk);rr(ctx,x+12,ry+6,T.w-24,T.row-12,14);ctx.fill();}
    ag_T(ctx,r[0],x+T.c1,ry+44,{w:700,size:30});
    const fa=clamp(f,0,1),fb=clamp(f-1,0,1);
    if(fa>0)ag_T(ctx,r[1],x+T.c2,ry+44,{w:500,size:30,col:AG.mut,a:fa});
    if(fb>0)ag_T(ctx,r[2],x+T.c3,ry+44,{w:700,size:30,col:l>0?mix(AG.ink,AG.violet,l):AG.ink,a:fb});
    if(i<4){ctx.strokeStyle="rgba(60,50,40,0.07)";ctx.beginPath();ctx.moveTo(x+24,ry+T.row);ctx.lineTo(x+T.w-24,ry+T.row);ctx.stroke();}});
  // beside it, two brackets: the agent is more in the first two rows, less in the last three (o.more, o.less 0 to 1)
  const br=(r0,r1,u,col,word)=>{if(u<=0)return;const y0=y+T.head+r0*T.row+10,y1=y+T.head+(r1+1)*T.row-10,bx=x+T.w+22;ctx.save();ctx.globalAlpha*=u;
    ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx,y0);ctx.quadraticCurveTo(bx+14,y0,bx+14,y0+16);ctx.lineTo(bx+14,y1-16);ctx.quadraticCurveTo(bx+14,y1,bx,y1);ctx.stroke();
    ag_T(ctx,word,bx+32,(y0+y1)/2+11,{w:700,size:30,col});ctx.restore();};
  br(0,1,o.more||0,AG.violet,"more");br(2,4,o.less||0,AG.mut,"less");
  ctx.restore();return{x,y,w:T.w,h};}

/* ---------------------------------------------------------------- the project's 33 tables
   Small blue cards on the wall to the right of the agent, rows of five, (x0, y0) the first's top left. o.read 0 to 1: the agent reads
   them in order, row by row,
   each lifting a little as it's read; o.path 0 to 1: six light in a path, with orange data flowing back along it; o.amber 0 to 1: one
   quick ripple of amber across them all (and back as it ends); o.out {index: 0 to 1}: a card lifted out of its place (moved by o.at);
   o.gone {index: 0 to 1}: fades a card; o.dim 0 to 1 dims all but o.keep (indexes); o.a. Returns each card's box. */
const MJ_T={x0:1340,y0:262,cols:5,rows:7,w:86,h:50,gx:18,gy:20,path:[0,6,13,17,23,32]};
function mj_tableBox(i,o){const T=MJ_T,cx=i%T.cols,cy=Math.floor(i/T.cols);return{x:(o&&o.x0||T.x0)+cx*(T.w+T.gx),y:(o&&o.y0||T.y0)+cy*(T.h+T.gy),w:T.w,h:T.h};}
function mj_tables(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const T=MJ_T,n=33,boxes=[];ctx.save();ctx.globalAlpha*=a;
  const pathSet=new Set(T.path),pp=clamp(o.path||0,0,1);
  for(let i=0;i<n;i++){const b=mj_tableBox(i,o),order=i/n,rd=o.read==null?1:o.read,dim=o.dim&&!(o.keep&&o.keep.includes(i))?1-0.6*o.dim:1;
    const lift=Math.sin(clamp((rd*1.15-order)/0.15,0,1)*Math.PI)*6,am=o.amber?Math.sin(clamp((o.amber*1.4-order)/0.4,0,1)*Math.PI):0,
      onPath=pathSet.has(i)&&pp>0,gone=o.gone&&o.gone[i]!=null?1-o.gone[i]:1,out=o.out&&o.out[i]!=null?o.out[i]:0;
    if(gone<=0)continue;let bx=b.x,by=b.y-lift;if(out>0&&o.at&&o.at[i]){bx=lerp(b.x,o.at[i][0],ag_sine(out));by=lerp(b.y,o.at[i][1],ag_sine(out));}
    const edge=am>0.02?AG.amber:onPath?AG.orange:AG.blue,ea=am>0.02?0.5+0.5*am:onPath?0.9:0.55;
    withA(ctx,dim*gone*(rd*1.15>=order?1:0.55),()=>{ag_box(ctx,bx,by,T.w,T.h,12,{edge,edgeA:ea,lw:onPath?3:2});
      ctx.fillStyle=rgba(am>0.02?AG.amber:AG.blue,0.32);ctx.fillRect(bx+16,by+20,T.w*0.5,7);ctx.fillRect(bx+16,by+34,T.w*0.32,7);});
    boxes.push({x:bx,y:by,w:T.w,h:T.h,i});}
  // the path: a line through the six, orange pellets running back along it
  if(pp>0){const pts=T.path.map(i=>{const b=mj_tableBox(i,o);return[b.x+T.w/2,b.y+T.h/2];});ctx.strokeStyle=rgba(AG.orange,0.75);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
    const L=pts.length-1,u=pp*L;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<=L;k++){const f=clamp(u-(k-1),0,1);if(f<=0)break;ctx.lineTo(lerp(pts[k-1][0],pts[k][0],f),lerp(pts[k-1][1],pts[k][1],f));}ctx.stroke();
    if(pp>=1&&o.flow!=null)for(let j=0;j<6;j++){const v=((o.flow*0.5+j/6)%1)*L,k=Math.floor(v),f=v-k,q=[lerp(pts[L-k][0],pts[Math.max(0,L-k-1)][0],f),lerp(pts[L-k][1],pts[Math.max(0,L-k-1)][1],f)];ag_pellet(ctx,q[0],q[1],0.9);}}
  ctx.restore();return boxes;}

/* ---------------------------------------------------------------- a clock, a calendar, shelves */
// a small clock on the wall at (x, y), r its radius, showing hh:mm; o.label under it (a pill), o.sweep 0 to 1 (a violet arc round
// the face: the agent's minute), o.a, o.k
function mj_clock(ctx,x,y,r,hh,mm,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_card(ctx,c=>c.arc(x,y,r,0,TAU),{x:x-r,y:y-r,w:2*r,h:2*r},{});
  ctx.strokeStyle="rgba(60,50,40,0.35)";ctx.lineWidth=2;for(let i=0;i<12;i++){const an=i/12*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.78,y+Math.sin(an)*r*0.78);ctx.lineTo(x+Math.cos(an)*r*0.88,y+Math.sin(an)*r*0.88);ctx.stroke();}
  const ha=((hh%12)+mm/60)/12*TAU-Math.PI/2,ma=mm/60*TAU-Math.PI/2;ctx.strokeStyle=rgba(AG.ink,0.9);ctx.lineCap="round";
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ha)*r*0.48,y+Math.sin(ha)*r*0.48);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ma)*r*0.72,y+Math.sin(ma)*r*0.72);ctx.stroke();ctx.fillStyle=rgba(AG.ink,1);ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();
  if(o.sweep>0){ctx.strokeStyle=rgba(AG.violet,0.8);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r+10,-Math.PI/2,-Math.PI/2+TAU*clamp(o.sweep,0,1));ctx.stroke();}
  if(o.label)ag_pill(ctx,x,y+r+46,o.label,{col:o.col||null});ctx.restore();}
// a card with a week's days, Monday to Friday filled in turn (o.p 0 to 1); o.label; (x, y) its top left
function mj_week(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=360,h=170;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});ag_T(ctx,o.label||"a week",x+28,y+48,{w:700,size:30});
  const p=clamp(o.p==null?1:o.p,0,1);for(let i=0;i<5;i++){const bx=x+28+i*62,on=clamp(p*5-i,0,1);ctx.fillStyle=on>0?rgba(AG.mut,0.18+0.3*on):"rgba(86,92,100,0.1)";rr(ctx,bx,y+78,52,64,10);ctx.fill();
    ag_T(ctx,"MTWTF"[i],bx+26,y+122,{w:700,size:28,align:"center",col:AG.mut,deco:1});}
  ctx.restore();}
// an oak shelf of books on the wall from (x, y) (the shelf's top left), w long; the books' spines muted, seeded; o.label (a pill
// over it), o.a
function mj_shelf(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const R=ag_rnd(o.seed||5);
  const cols=[[170,150,128],[120,132,140],[150,120,110],[196,184,160],[110,120,104],[176,160,140],[136,128,150]];
  const end=x+w*clamp(o.p==null?1:o.p,0,1);let bx=x+8;while(bx<end-12){const bw=16+R()*20,bh=90+R()*50,c=cols[Math.floor(R()*cols.length)];
    ag_soft(ctx,cc=>ag_rect(cc,bx,y-bh,bw,bh,3),c,mix(c,[255,255,255],0.4),bx+bw*0.7,y-bh*0.6,bh*0.6,rgba(mix(c,[0,0,0],0.6),0.35),4,0.4);
    ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),0.7);ctx.fillRect(bx+3,y-bh+14,bw-6,4);ctx.fillRect(bx+3,y-24,bw-6,3);bx+=bw+2+(R()<0.08?14:0);}
  ag_floorShadow(ctx,x+w/2,y+18,w*0.5,10,0.18);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,20,4),AG_OAK.base,AG_OAK.hi,x+w*0.8,y,w*0.6,rgba(AG_OAK.dark,0.4),6,0.6);
  if(o.label)ag_pill(ctx,o.lx==null?x+w/2:o.lx,y+64,o.label,{});ctx.restore();}

/* ---------------------------------------------------------------- sessions, the glossary, the notes */
// a session: a large pale card with its name at the top ("Session", o.sub such as "next morning"), its contents drawn by o.draw(ctx)
// inside; (x, y) its top left; o.k, o.a; o.blank: nothing inside yet
function mj_session(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,26,{edge:AG.violet,edgeA:0.35});
  ag_label(ctx,x+30,y+50,"Session",{col:AG.violet});if(o.sub)ag_T(ctx,o.sub,x+w-30,y+50,{w:600,size:28,align:"right",col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+72);ctx.lineTo(x+w-24,y+72);ctx.stroke();
  if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x+4,y+74,w-8,h-78);ctx.clip();o.draw(ctx);ctx.restore();}ctx.restore();}
// the team's notes for agents: a pinned paper, (x, y) its top left, w wide; two older notes, and the new one written in (o.write 0 to 1)
const MJ_LESSON="Before you count a word, read its meaning in the glossary.";
function mj_notes(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const lines=ag_wrap(ctx,MJ_LESSON,w-80,{w:600,size:30}),h=150+lines.length*42+(o.short?0:60);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));ctx.translate(x+w/2,y);ctx.rotate(o.rot==null?-0.015:o.rot);ctx.translate(-x-w/2,-y);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=28;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#F6F3EA";ctx.fillRect(x,y,w,h);ctx.restore();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.5)");g.addColorStop(1,"rgba(220,210,190,0.25)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ag_soft(ctx,c=>c.arc(x+w/2,y+14,11,0,TAU),[70,74,82],[200,206,214],x+w/2+3,y+10,10,null);
  ag_T(ctx,"Team notes for agents",x+40,y+66,{w:700,size:32});
  let yy=y+96;if(!o.short){ctx.fillStyle="rgba(86,92,100,0.22)";ctx.fillRect(x+40,yy,w*0.62,9);ctx.fillRect(x+40,yy+24,w*0.46,9);yy+=60;}
  const wr=clamp(o.write==null?1:o.write,0,1);if(wr>0){ctx.save();const tot=lines.reduce((s,l)=>s+ag_tw(ctx,l,{w:600,size:30}),0);let done=wr*tot;
    lines.forEach((l,i)=>{const lw=ag_tw(ctx,l,{w:600,size:30}),show=clamp(done/lw,0,1);done-=lw;if(show<=0)return;ctx.save();ctx.beginPath();ctx.rect(x+36,yy+i*42-34,lw*show+6,48);ctx.clip();
      ag_T(ctx,l,x+40,yy+i*42+6,{w:600,size:30,col:AG.ink});ctx.restore();});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// a rubber stamp's mark, landing: centred on (x, y), its words in a colour, o.p 0 to 1 (it comes down from above, a little larger)
function mj_stamp(ctx,x,y,text,col,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1);if(p<=0)return;const s=lerp(1.5,1,ag_eo(p)),w=ag_tw(ctx,text,{w:800,size:34})+56,h=70;
  ctx.save();ctx.globalAlpha*=Math.min(1,p*1.6)*(o.a==null?1:o.a);ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(s,s);
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,12);ctx.stroke();ctx.lineWidth=1.5;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,8);ctx.stroke();
  ag_T(ctx,text,0,12,{w:800,size:34,align:"center",col});ctx.restore();}
// a calendar's month, one day ringed: (x, y) its top left; o.ring 0 to 1 (the ring drawn on), o.label under it
function mj_ringCal(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=300,h=250;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});ctx.fillStyle=rgba(AG.mut,0.16);rr(ctx,x+8,y+8,w-16,44,12);ctx.fill();
  for(let i=0;i<28;i++){const cx=x+34+(i%7)*39,cy=y+86+Math.floor(i/7)*40;ctx.fillStyle="rgba(86,92,100,0.28)";ctx.beginPath();ctx.arc(cx,cy,5,0,TAU);ctx.fill();}
  const r=clamp(o.ring||0,0,1);if(r>0){const cx=x+34+4*39,cy=y+86+2*40;ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,24,20,-0.2,-1.6,-1.6+r*TAU*1.05);ctx.stroke();}
  ctx.restore();if(o.label)ag_pill(ctx,x+w/2,y+h+44,o.label,{a});}

/* ---------------------------------------------------------------- cards of the room's stories */
// a pin, holding a card to the marble
function mj_pin(ctx,x,y){ag_soft(ctx,c=>c.arc(x,y,11,0,TAU),[70,74,82],[200,206,214],x+3,y-4,10,null);}
// Jun's question, a card with a tail towards him; (x, y) its top left, w wide; o.kick ("Jun"), o.k, o.a, o.edge
function mj_q(ctx,x,y,w,text,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick:o.kick||"Jun",title:text,sub:o.sub},{kickCol:AG.kick,k:o.k,a:o.a,edge:o.edge,edgeA:o.edgeA,
  tail:o.tail===false?null:{side:"left",at:0.2,px:x-34,py:y+(o.py||70)}});}
// a line struck through a card's words, drawn on (p 0 to 1)
function mj_strike(ctx,bb,p){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(AG.ink,0.75);ctx.lineWidth=5;ctx.lineCap="round";const x0=bb.x+20,x1=bb.x+bb.w-20,y0=bb.y+bb.h*0.62,y1=bb.y+bb.h*0.5;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,ag_sine(p)),lerp(y0,y1,ag_sine(p)));ctx.stroke();ctx.restore();}
// a month's page: (x, y) its top left, n the month; o.turn 0 to 1 flips it over to n + 1
function mj_month(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=230,h=112,u=clamp(o.turn||0,0,1),m=u<0.5?n:n+1,sy=Math.abs(Math.cos(u*Math.PI));
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ctx.translate(0,y);ctx.scale(1,Math.max(0.05,sy));ctx.translate(0,-y);
  ag_box(ctx,x,y,w,h,16,{});ctx.fillStyle=rgba(AG.mut,0.18);rr(ctx,x+8,y+8,w-16,26,10);ctx.fill();
  ag_T(ctx,"Month "+m,x+w/2,y+86,{w:700,size:32,align:"center"});ctx.restore();}
// a small round bubble with a question mark, its tail towards (px, py)
function mj_ask(ctx,x,y,px,py,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.5,1,o.k==null?1:o.k));
  const r=38,an=Math.atan2(py-y,px-x);
  ag_card(ctx,c=>{c.arc(x,y,r,an+0.35,an-0.35+TAU);c.lineTo(x+Math.cos(an)*(r+22),y+Math.sin(an)*(r+22));c.closePath();},{x:x-r,y:y-r,w:2*r,h:2*r},{});
  ag_T(ctx,"?",x,y+15,{w:800,size:44,align:"center"});ctx.restore();}

// the faculties' awards, as bars; (x, y) the top left, w wide; o.p 0 to 1 (the bars grow), o.total 0 to 1 (the sum, in an amber pill),
// o.a. The film's own numbers: they add up to 4,812, the count without the microcredentials.
const MJ_FAC=[["Arts and Education",1108],["Business",1574],["Engineering and IT",1372],["Health",758]];
function mj_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=clamp(o.p==null?1:o.p,0,1),max=1574,bw=w-120;ctx.save();ctx.globalAlpha*=a;
  MJ_FAC.forEach(([name,v],i)=>{const yy=y+i*82,u=ag_sine(clamp(p*1.6-i*0.2,0,1));
    ag_T(ctx,name,x,yy+28,{w:600,size:28,col:AG.ink,a:clamp(u*4,0,1)});
    ctx.fillStyle=rgba(AG.orange,0.82);rr(ctx,x,yy+42,Math.max(10,bw*v/max*u),20,10);ctx.fill();
    if(u>0.6)ag_T(ctx,v.toLocaleString("en-GB"),x+bw*v/max+14,yy+62,{w:700,size:28,col:AG.ink,a:clamp((u-0.6)*3,0,1)});});
  const tA=clamp(o.total||0,0,1);if(tA>0)ag_pill(ctx,x+w/2-30,y+4*82+44,"By faculty: 4,812",{icon:o.warn?"warn":null,col:o.warn?AG.amber:null,a:tA});
  ctx.restore();}
// the model's reasoning: a card with a violet edge, its steps appearing in turn (o.p 0 to 1); (x, y) its top left
function mj_reason(ctx,x,y,w,steps,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=AG_PAD*2+38+steps.length*44;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.violet,edgeA:0.6});
  ag_label(ctx,x+AG_PAD,y+AG_PAD+22,"Reasoning",{col:AG.violet});const p=clamp(o.p==null?1:o.p,0,1);
  steps.forEach((s,i)=>{const u=clamp(p*steps.length-i,0,1);if(u>0)ag_T(ctx,s,x+AG_PAD,y+AG_PAD+38+(i+1)*44-6,{w:600,size:30,a:u});});ctx.restore();return{x,y,w,h};}
// a table card with its name, as a larger card lifted from the wall; (x, y) its top left, w wide; o.sub, o.next (the sub it turns to,
// with o.turn 0 to 1), o.edge; o.k, o.a
function mj_tableCard(ctx,x,y,w,name,o){o=o||{};const u=clamp(o.turn||0,0,1),sub=u<0.5?o.sub:o.next||o.sub;
  return ag_textCard(ctx,x,y,w,{kick:"Table",title:name,sub},{kickCol:AG.blue,edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.45:o.edgeA,k:o.k,a:o.a});}
// the agent's draft: a card with a pen, "Draft", and what it would do; (x, y) its top left
function mj_draft(ctx,x,y,w,title,o){o=o||{};const bb=ag_textCard(ctx,x,y,w,{kick:"Draft",title},{kickCol:AG.blue,edge:AG.blue,edgeA:0.5,k:o.k,a:o.a,measure:o.measure});
  if(!o.measure&&(o.a==null||o.a>0))withA(ctx,o.a==null?1:o.a,()=>ag_pen(ctx,x+w-44,y+44,30,rgba(AG.blue,1)));return bb;}
// the agent's own review: a grey card that never approves; (x, y) its top left
function mj_review(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=138;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ctx.fillStyle="rgba(120,124,130,0.12)";rr(ctx,x,y,w,h,22);ctx.fill();
  ag_label(ctx,x+AG_PAD,y+AG_PAD+22,"Agent's review",{col:AG.mut});ag_T(ctx,"For reference",x+AG_PAD,y+AG_PAD+82,{w:700,size:36,col:AG.mut});ctx.restore();}
// a hand mirror standing on a table: (x, y) the middle of its glass, r its radius; o.draw(ctx) paints what it shows, clipped to it
function mj_mirror(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*1.5,y+r*1.9,r*0.8,8,0.3);
  ag_soft(ctx,c=>ag_rect(c,x-6,y+r*0.9,12,r*0.9,4),[120,92,60],[186,150,110],x+4,y+r,r,null);
  ag_soft(ctx,c=>c.ellipse(x,y+r*1.84,r*0.5,8,0,0,TAU),[120,92,60],[186,150,110],x+10,y+r*1.8,r,null);
  ag_soft(ctx,c=>c.ellipse(x,y,r*0.8+10,r+10,0,0,TAU),[150,116,78],[220,190,150],x+r*0.4,y-r*0.6,r*1.4,"rgba(40,24,10,0.4)",6,0.5);
  ctx.save();ctx.beginPath();ctx.ellipse(x,y,r*0.8,r,0,0,TAU);ctx.clip();const g=ctx.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,"#E4E8E6");g.addColorStop(1,"#B8C0C0");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
  if(o.draw)o.draw(ctx);ctx.fillStyle="rgba(255,255,255,0.22)";ctx.beginPath();ctx.moveTo(x-r*0.6,y-r);ctx.lineTo(x-r*0.2,y-r);ctx.lineTo(x-r*0.7,y+r);ctx.lineTo(x-r*1.1,y+r);ctx.closePath();ctx.fill();ctx.restore();
  ctx.restore();}
// the nightly run: a bar of 33 small blocks, built one by one (o.p 0 to 1), at (x, y), w wide
function mj_run(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=clamp(o.p||0,0,1),bw=(w-32*4)/33;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x-14,y-14,w+28,bw+40,14,{});
  for(let i=0;i<33;i++){const on=clamp(p*33-i,0,1);ctx.fillStyle=on>0?rgba(AG.blue,0.25+0.55*on):"rgba(86,92,100,0.12)";rr(ctx,x+i*(bw+4),y,bw,bw+12,4);ctx.fill();}ctx.restore();}
// one of the close's four cards: a small picture (o.draw(ctx, x, y, w, h) inside the top) over a caption; (x, y) its top left
function mj_win(ctx,x,y,w,h,caption,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,24,{});if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x+8,y+8,w-16,h-120);ctx.clip();o.draw(ctx,x,y+8,w,h-120);ctx.restore();}
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+h-112);ctx.lineTo(x+w-24,y+h-112);ctx.stroke();
  const ls=ag_wrap(ctx,caption,w-56,{w:700,size:32});ls.forEach((l,i)=>ag_T(ctx,l,x+28,y+h-64+i*40-(ls.length-1)*20,{w:700,size:32}));ctx.restore();}
