/* ===== Working with agents on Databricks: the Faculty of Health =====
   The opening's and the close's place: the faculty's office, painted once in the module's matte language (the marble wall over the
   oak floor, a tall window on the right, a pinboard of plain cards on the left, three oak desks in a row), and what stands on it,
   drawn live: Anil and his two colleagues at their desks, each person's own agent (the module's sphere) on their desk, each wired
   by a short grey cable to that person's own copy of the data: a spreadsheet on Anil's screen, a laptop with a copy of the student
   table, a folder of reports. Then the cards of the story: the question, the three answers (each with an empty slot where its
   evidence should be, or, a week later, its evidence clipped in), Anil's plan, the spreadsheet of student load, the copy of the
   student table and the folder, close.
   Every name here starts with od_ or OD_. Sizes are in the 1920 x 1080 frame; a close shot (OD_Z1, OD_Z2, OD_Z3) is 1.35 to 1.45
   times the frame, and its cards are drawn in the frame (od_scr in scenes.js), at 28 px or more, so they keep their size whatever
   the camera does. The cables to each person's own copy are grey: nothing of the
   platform's. Clothes keep clear of the colours that mean something. */

/* ---------------------------------------------------------------- where everything stands */
const OD={deskY:800,depth:84,back:716,
  desks:[{x:80,w:560},{x:680,w:560},{x:1280,w:560}],
  // each person: where their neck meets their shoulders, their size; the agent on their desk; their copy
  seat:[{x:240,y:576,s:0.62},{x:840,y:576,s:0.62},{x:1440,y:576,s:0.62}],
  agent:[[400,738],[1000,738],[1600,738]],ar:30,
  answer:[400,1000,1600],ansY:128,                 // the answers over the desks, in the wide shot: their centres, their top
  copy:[[540,724],[1140,758],[1720,770]],          // where each grey cable plugs into its copy
  wall:[[416,650],[1036,650],[1640,650]]           // the platform's socket on the wall behind each desk, where the blue cable goes
};
// the camera: the whole office, and a close shot of each desk, the desk and its agent kept above the captions. In a close shot only
// that desk's person and things are drawn (o.only in od_room): the cards of the story stand where the next desk would be
const OD_WIDE=[0,960,540,1],OD_Z1=[0,712,600,1.35],OD_Z2=[0,1209,600,1.35],OD_Z3=[0,1240,590,1.45];
// a point of the office as a camera sees it, in the frame
const od_see=(cam,p)=>[(p[0]-cam[1])*cam[3]+960,(p[1]-cam[2])*cam[3]+540];
// the two colleagues, drawn for the film in the cast's style, not named; clothes clear of the meaning colours. Each keeps its own
// picture (key): people are kept by key, then by name
const OD_COLA={key:"odColleagueA",name:"A colleague",role:"Faculty of Health",skin:[214,170,138],hair:{style:"bob",c:[58,40,32]},earrings:[208,214,226],top:{kind:"sweater",c:[150,138,146]},breath:0.27};
const OD_COLB={key:"odColleagueB",name:"A colleague",role:"Faculty of Health",skin:[120,84,62],hair:{style:"cropped",c:[22,20,20]},beard:[30,26,24],top:{kind:"overshirt",c:[124,116,104],inner:[230,228,222]},breath:0.25};
const OD_WHO=["anil",OD_COLA,OD_COLB];

/* ---------------------------------------------------------------- the office, painted once */
// a tall window in the wall on the right: a pale sky with the soft shapes of trees far off, white frames, a sill
function od_window(c,x,y,w,h){c.save();
  c.save();c.shadowColor="rgba(46,38,28,0.22)";c.shadowBlur=26;c.shadowOffsetX=AG.sdx;c.shadowOffsetY=10;c.fillStyle="#F1EFEA";c.fillRect(x-16,y-16,w+32,h+32);c.restore();
  let g=c.createLinearGradient(x+w,y,x,y+h);g.addColorStop(0,"#F6F8F7");g.addColorStop(0.55,"#E6EDF0");g.addColorStop(1,"#DCE5E8");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();const R=ag_rnd(41);
  for(let i=0;i<9;i++){const bx=x+R()*w,by=y+h*(0.62+R()*0.2),br=40+R()*60;const tg=c.createRadialGradient(bx,by,0,bx,by,br);
    tg.addColorStop(0,"rgba(150,166,150,0.32)");tg.addColorStop(1,"rgba(150,166,150,0)");c.fillStyle=tg;c.fillRect(bx-br,by-br,2*br,2*br);}
  g=c.createLinearGradient(x,y+h*0.8,x,y+h);g.addColorStop(0,"rgba(200,206,196,0)");g.addColorStop(1,"rgba(196,202,190,0.5)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.restore();
  // the frames: a mullion and a transom, and the frame's inner shade on its left and top
  c.fillStyle="#EDEBE6";c.fillRect(x+w/2-6,y,12,h);c.fillRect(x,y+h*0.36-6,w,12);
  c.fillStyle="rgba(46,38,28,0.10)";c.fillRect(x,y,w,6);c.fillRect(x,y,6,h);c.fillRect(x+w/2+6,y,3,h);c.fillRect(x,y+h*0.36+6,w,3);
  c.strokeStyle="rgba(60,50,40,0.18)";c.lineWidth=1.5;c.strokeRect(x,y,w,h);
  // the sill
  c.save();c.shadowColor="rgba(46,38,28,0.25)";c.shadowBlur=10;c.shadowOffsetY=6;c.fillStyle="#EFEDE8";c.fillRect(x-30,y+h+14,w+60,16);c.restore();
  c.fillStyle="rgba(255,255,255,0.6)";c.fillRect(x-30,y+h+14,w+60,2);
  c.restore();}
// the window's light, falling in a long soft patch across the wall to its left
function od_windowLight(c,x,y,w,h){c.save();c.globalCompositeOperation="screen";const g=c.createLinearGradient(x,y,x-700,y+520);
  g.addColorStop(0,"rgba(255,248,232,0.18)");g.addColorStop(1,"rgba(255,248,232,0)");c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h);c.lineTo(x-640,y+h+120);c.lineTo(x-760,y+60);c.closePath();c.fill();c.restore();}
// a pinboard of plain cards: pale oak, a soft grey felt, the cards with faint lines and no words
function od_pinboard(c,x,y,w,h){c.save();
  c.save();c.shadowColor="rgba(46,38,28,0.24)";c.shadowBlur=22;c.shadowOffsetX=AG.sdx;c.shadowOffsetY=10;c.fillStyle=rgba(AG_OAK.base,1);c.fillRect(x-10,y-10,w+20,h+20);c.restore();
  let g=c.createLinearGradient(x-10,y-10,x+w,y+h);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.dark,1));c.fillStyle=g;c.fillRect(x-10,y-10,w+20,h+20);
  c.fillStyle="#CFCBC3";c.fillRect(x,y,w,h);ag_grain(c,x,y,w,h,3,12);
  const cards=[[18,18,86,62,-0.04],[124,26,98,70,0.03],[30,104,104,76,0.02],[150,116,78,58,-0.05]];
  for(const [cx,cy,cw,ch,r] of cards){c.save();c.translate(x+cx+cw/2,y+cy+ch/2);c.rotate(r);c.shadowColor="rgba(46,38,28,0.22)";c.shadowBlur=6;c.shadowOffsetX=-2;c.shadowOffsetY=3;
    c.fillStyle="#F4F2EE";c.fillRect(-cw/2,-ch/2,cw,ch);c.shadowColor="transparent";c.fillStyle="rgba(86,92,100,0.22)";
    for(let k=0;k<3;k++)c.fillRect(-cw/2+10,-ch/2+16+k*14,cw*(k===2?0.4:0.7),3);c.fillStyle="#8C8780";c.beginPath();c.arc(0,-ch/2+6,3.5,0,TAU);c.fill();c.restore();}
  c.restore();}
AG_PLACES.odOffice=c=>{ag_paintLab(c,{seed:3,quiet:[[960,250,760,170,0.45],[480,90,420,46,0.3]]});
  od_windowLight(c,1660,70,220,470);od_window(c,1660,70,220,470);od_pinboard(c,90,120,250,200);
  for(const d of OD.desks)ag_desk(c,d.x,OD.deskY,d.w,{depth:OD.depth});};

/* ---------------------------------------------------------------- on the desks */
// an agent on a desk: the module's sphere, with its soft shadow on the oak
function od_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx*r/40,y+r*0.96,r*1.05,r*0.2,0.32);ag_model(ctx,x,y,r,{t,core:o.core==null?0.5:o.core,think:o.think||0});
  if(o.lock>0){const lx=x+r*0.85,ly=y-r*0.8,s=Math.max(26,r*0.55);ctx.save();ctx.globalAlpha*=o.lock;ctx.fillStyle="rgba(243,241,237,0.96)";ctx.beginPath();ctx.arc(lx,ly,s*0.62,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(AG.blue,0.5);ctx.lineWidth=1.5;ctx.stroke();ag_lock(ctx,lx,ly+s*0.06,s*0.82,rgba(AG.blue,1));ctx.restore();}
  ctx.restore();}
// a short cable from an agent to what it reads: p0 to p1, sagging onto the desk; u how much has run (0 to 1); col its colour (grey:
// the person's own copy; blue: the platform's tools); a small plug at each end
function od_cable(ctx,p0,p1,u,o){o=o||{};if(u<=0.01)return;const col=o.col||[128,126,122],a=o.a==null?1:o.a,sag=o.sag==null?26:o.sag;
  const p=[p0[0],p0[1],lerp(p0[0],p1[0],0.3),Math.max(p0[1],p1[1])+sag,lerp(p0[0],p1[0],0.7),Math.max(p0[1],p1[1])+sag,p1[0],p1[1]];
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.strokeStyle=rgba(AG.shadow,0.16);ctx.lineWidth=(o.lw||6)+2;ctx.save();ctx.translate(-2,4);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||6;ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=1.6;ctx.save();ctx.translate(0,-1.5);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  const plug=(x,y)=>{ctx.fillStyle=rgba(mix(col,[0,0,0],0.25),1);rr(ctx,x-8,y-7,16,14,4);ctx.fill();};plug(p0[0],p0[1]);const e=ag_bz(p,u);if(u>0.97)plug(e[0],e[1]);
  ctx.restore();return p;}
// a laptop on a desk, its base's front edge's middle at (x, y): o.draw(ctx, gx, gy, gw, gh) draws what its screen shows
function od_laptop(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const sh=w*0.62,bx0=x-w/2,by=y;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+AG.sdx,by+4,w*0.6,10,0.24);
  // the base: a thin slab seen from above
  ctx.fillStyle="#C9C7C2";ctx.beginPath();ctx.moveTo(bx0+w*0.06,by-26);ctx.lineTo(bx0+w*0.94,by-26);ctx.lineTo(bx0+w,by);ctx.lineTo(bx0,by);ctx.closePath();ctx.fill();
  ctx.fillStyle="#B4B2AD";ctx.fillRect(bx0,by,w,5);ctx.fillStyle="rgba(60,60,64,0.18)";for(let k=0;k<3;k++)ctx.fillRect(bx0+w*0.12,by-21+k*6,w*0.76,2.5);
  // the lid, tilted back, its screen
  const gx=bx0+w*0.07,gy=by-26-sh,gw=w*0.86,gh=sh-10;ctx.fillStyle="#3A3B40";rr(ctx,gx-8,gy-8,gw+16,gh+16,8);ctx.fill();
  ctx.save();rr(ctx,gx,gy,gw,gh,3);ctx.clip();ctx.fillStyle="#EEF0EE";ctx.fillRect(gx,gy,gw,gh);if(o.draw)o.draw(ctx,gx,gy,gw,gh);ctx.restore();
  ctx.restore();}
// a folder of reports standing on a desk, its foot's left at (x, y): a box file and a thinner one beside it, pale stone grey;
// o.open 0 to 1 tips the front one forward a little
function od_folder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+70,y+4,90,10,0.25);
  const box=(bx,bw,bh,col,tilt)=>{ctx.save();ctx.translate(bx,y);ctx.rotate(tilt);
    ag_soft(ctx,c=>ag_rect(c,0,-bh,bw,bh,5),col,mix(col,[255,255,255],0.4),bw*0.7,-bh+12,bh*0.9,"rgba(46,38,28,0.3)",10,0.5);
    ctx.fillStyle="rgba(250,248,244,0.92)";rr(ctx,bw*0.2,-bh*0.82,bw*0.6,bh*0.24,4);ctx.fill();ctx.fillStyle="#57524C";ctx.beginPath();ctx.arc(bw/2,-bh*0.3,bw*0.12,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(250,248,244,0.92)";ctx.beginPath();ctx.arc(bw/2,-bh*0.3,bw*0.06,0,TAU);ctx.fill();ctx.restore();};
  box(x+66,40,140,[176,172,164],0);box(x,62,150,[160,158,152],-0.1*(o.open||0));ctx.restore();}
// what a screen shows: a spreadsheet (a grey grid, one row picked out), a table (rows), or nothing
function od_gridShows(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F7F7F4";ctx.fillRect(x,y,w,h);ctx.strokeStyle="rgba(86,92,100,0.28)";ctx.lineWidth=1;
  const rows=6,rh=h/rows;for(let i=1;i<rows;i++){ctx.beginPath();ctx.moveTo(x,y+i*rh);ctx.lineTo(x+w,y+i*rh);ctx.stroke();}
  for(const f of [0.42,0.72]){ctx.beginPath();ctx.moveTo(x+w*f,y);ctx.lineTo(x+w*f,y+h);ctx.stroke();}
  ctx.fillStyle="rgba(86,92,100,0.16)";ctx.fillRect(x,y,w,rh);if(o.pick>0){ctx.fillStyle=rgba(AG.orange,0.22*o.pick);ctx.fillRect(x,y+4*rh,w,rh);}}
function od_rowsShows(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F7F7F4";ctx.fillRect(x,y,w,h);const n=7,rh=h/n;
  for(let i=0;i<n;i++){ctx.fillStyle=i===0?"rgba(86,92,100,0.26)":"rgba(86,92,100,0.13)";ctx.fillRect(x+6,y+i*rh+rh*0.3,(i===0?0.8:0.4+0.45*((i*37)%10)/10)*(w-12),rh*0.4);}}

/* ---------------------------------------------------------------- the office's live layer
   The three at their desks and what stands on them, in the office's light. o: lit [3] each agent's band (0 to 1), cable [3] how
   far each grey cable has run, blue 0 to 1 each agent's blue cable to the platform's socket on the wall behind its desk, gone 0 to 1
   the copies fade, smile [3], gaze; sheet 0 to 1 Anil's screen picks out Health's row; only: draw that desk alone (a close shot) */
function od_socket(c,x,y,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.save();c.shadowColor="rgba(46,38,28,0.22)";c.shadowBlur=8;c.shadowOffsetX=AG.sdx*0.3;c.shadowOffsetY=3;
  c.fillStyle="#F1EFEA";rr(c,x-22,y-26,44,40,7);c.fill();c.restore();c.strokeStyle=rgba(AG.blue,0.6);c.lineWidth=2;rr(c,x-22,y-26,44,40,7);c.stroke();
  c.fillStyle="#2E2F34";rr(c,x-10,y-14,20,16,4);c.fill();c.restore();}
function od_room(c,tt,o){o=o||{};const lit=o.lit||[0,0,0],cab=o.cable||[0,0,0],gone=o.gone||0,blue=o.blue||0,sm=o.smile||[0,0,0],on=i=>o.only==null||o.only===i;
  const keep=1-gone;
  for(let i=0;i<3;i++)if(blue>0&&on(i))od_socket(c,OD.wall[i][0],OD.wall[i][1],ag_in(blue,0,0.3));
  OD.seat.forEach((p,i)=>{if(on(i))ag_person(c,OD_WHO[i],p.x,p.y,p.s,{t:tt+i*1.3,cut:OD.back,gaze:(o.gaze&&o.gaze[i])||[4,1],smile:sm[i]});});
  // Anil's screen with his spreadsheet; the laptop with its copy; the folder of reports
  if(on(0))ag_screen(c,455,572,170,108,{stand:30,draw:(x,gx,gy,gw,gh)=>{if(keep>0.01){x.save();x.globalAlpha*=keep;od_gridShows(x,gx,gy,gw,gh,{pick:o.sheet||0});x.restore();}}});
  if(on(1))od_laptop(c,1150,782,170,{draw:(x,gx,gy,gw,gh)=>{if(keep>0.01){x.save();x.globalAlpha*=keep;od_rowsShows(x,gx,gy,gw,gh);x.restore();}}});
  if(on(2))od_folder(c,1680,792,{a:keep});
  for(let i=0;i<3;i++){if(!on(i))continue;const [ax,ay]=OD.agent[i],from=[ax+OD.ar*0.55,ay+OD.ar*0.8];
    if(cab[i]>0)od_cable(c,from,OD.copy[i],cab[i],{a:keep,sag:i===2?14:22});
    if(blue>0){const u=clamp(blue*1.25-i*0.12,0,1),w=OD.wall[i];od_cable(c,[ax+OD.ar*0.7,ay+OD.ar*0.45],[w[0],w[1]-6],u,{col:AG.blue,sag:18,lw:5});}
    od_agent(c,ax,ay,OD.ar,tt+i*0.9,{core:lerp(0.35,1,lit[i]),think:0.5*lit[i]});}
  ag_roomLight(c,1);}

/* ---------------------------------------------------------------- the story's cards */
// a place's tag, in a corner, in the films' mono type: where and when
function od_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const w=ag_tw(ctx,s,{w:500,size:28,f:"mono"})+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
// a card that springs in at t0 and fades at t1 (ag_textCard)
function od_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a pill that springs in at t0 and fades at t1
function od_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
// a small grey word that settles beside what it names ("deleted")
function od_note(ctx,x,y,text,a,o){o=o||{};if(a<=0)return;ag_T(ctx,text,x,y,{w:700,size:o.size||28,col:o.col||AG.mut,a,align:o.align||"center"});}

// an answer, as an agent gives it: its number in orange, what it counts, and under them a slot for what it read. o.none (0 to 1):
// an empty dashed slot, "evidence: none"; o.ev (0 to 1): its evidence clipped in, three chips one after another ("query", "table",
// "definition"); o.tick (0 to 1) a green tick, checked; o.from [x, y] and o.u (0 to 1): it rises from there (the agent) to its
// place; (cx, y): its top's middle. Drawn at the frame's size. Returns its box
const OD_EV=["query","table","definition"],OD_ANS_H=206;
function od_ansW(ctx){return Math.max(420,OD_EV.reduce((s,e)=>s+ag_tw(ctx,e,{w:600,size:28})+28,0)+20+56+52);}
function od_answer(ctx,cx,y,num,o){o=o||{};const w=o.w||od_ansW(ctx),h=OD_ANS_H,x=cx-w/2,a=(o.a==null?1:o.a),u=o.u==null?1:o.u;if(a<=0||u<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a*clamp(u*3,0,1);
  if(o.from&&u<1){const e=ag_eo(u),k=lerp(0.2,1,Math.min(1,ag_spr(u,0,0.42))),px=lerp(o.from[0],cx,e),py=lerp(o.from[1],y+h/2,e);ctx.translate(px,py);ctx.scale(k,k);ctx.translate(-cx,-(y+h/2));}
  ag_box(ctx,x,y,w,h,22,{edge:o.tick>0.5?AG.green:null});
  ag_T(ctx,num,x+28,y+70,{w:800,size:54,col:AG.orange,a:o.numA==null?1:o.numA});
  ag_T(ctx,o.sub||"Health's students",x+28,y+108,{w:600,size:28,col:AG.mut});
  if(o.tick>0)ag_tick(ctx,x+w-50,y+48,30,rgba(AG.green,o.tick),5);
  const sy=y+128,sh=56;
  if(o.none>0){ctx.save();ctx.globalAlpha*=o.none;ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2.2;rr(ctx,x+24,sy,w-48,sh,12);ctx.stroke();ctx.setLineDash([]);
    ag_T(ctx,"evidence: none",cx,sy+sh/2+10,{w:600,size:28,col:AG.mut,align:"center"});ctx.restore();}
  if(o.ev>0){ag_clip(ctx,x+38,sy+6,44,"#5E5A55");let ex=x+70;OD_EV.forEach((e,i)=>{const k=clamp(o.ev*OD_EV.length-i,0,1);const ew=ag_tw(ctx,e,{w:600,size:28})+28;
      if(k>0){ctx.save();ctx.globalAlpha*=ag_in(k,0,0.5);const yy=sy+(1-Math.min(1,ag_spr(k,0,0.5)))*14;ag_box(ctx,ex,yy,ew,sh,14,{edge:AG.orange,edgeA:0.7,lw:2});
        ag_T(ctx,e,ex+ew/2,yy+sh/2+10,{w:600,size:28,align:"center"});ctx.restore();}ex+=ew+10;});}
  ctx.restore();return{x,y,w,h};}
// a card of the story, springing up from its foot's middle: k (0 to 1)
function od_spring(ctx,x,y,w,h,k){if(k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.6,1,Math.min(1,ag_spr(k,0,0.5))));}

// the spreadsheet on Anil's screen, shown large: student load, made for the funding bid, by faculty, in full-time equivalents.
// rows 0 to 1 the rows come in; pick 0 to 1 Health's row is picked out; half (0 to 1) two half-time students close into one. 760 wide
function od_sheet(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=o.half!=null?452:372;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Student load · for the funding bid",x+32,y+54,{w:700,size:32});
  ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+26,y+80,w-52,1.5);
  ag_T(ctx,"faculty",x+32,y+124,{w:600,size:28,col:AG.mut});ag_T(ctx,"full-time equivalents",x+w-32,y+124,{w:600,size:28,col:AG.mut,align:"right"});
  const fac=["Arts and Education","Business","Engineering and IT","Health"];
  fac.forEach((f,i)=>{const k=clamp((o.rows==null?1:o.rows)*4-i,0,1);if(k<=0)return;const yy=y+182+i*50;ctx.save();ctx.globalAlpha*=k;
    if(i===3&&o.pick>0){ctx.fillStyle=rgba(AG.orange,0.14*o.pick);rr(ctx,x+18,yy-34,w-36,48,10);ctx.fill();}
    ag_T(ctx,f,x+32,yy,{w:i===3?700:500,size:28,col:i===3?AG.ink:AG.mut});
    if(i<3){ctx.fillStyle="rgba(86,92,100,0.22)";rr(ctx,x+w-32-90,yy-16,90,14,7);ctx.fill();}
    else ag_T(ctx,"2,160",x+w-32,yy,{w:800,size:32,col:AG.orange,align:"right"});ctx.restore();});
  if(o.half!=null&&o.half>-1){const hy=y+h-46,ha=ag_in(o.half,-0.4,0.4),k=ag_sine(clamp(o.half,0,1)),gap=lerp(52,0,k),r=22,hx=x+86;
    ctx.save();ctx.globalAlpha*=ha;ctx.fillStyle="rgba(60,50,40,0.1)";ctx.fillRect(x+26,y+h-96,w-52,1.5);ctx.fillStyle=rgba(AG.mut,0.55);
    for(const sd of [-1,1]){ctx.beginPath();ctx.arc(hx+sd*gap/2,hy,r,sd<0?Math.PI/2:-Math.PI/2,sd<0?Math.PI*1.5:Math.PI/2);ctx.closePath();ctx.fill();}
    if(k>0.98){ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,r,0,TAU);ctx.stroke();}
    ag_T(ctx,"two half-time students = 1 in load",x+152,hy+10,{w:600,size:28,col:AG.ink});ctx.restore();}
  ctx.restore();}

// the copy of the student table on the laptop, shown large: Health's degrees, each with Health in its name, as the student system
// names them (the example project's awards), and the joint degree in no faculty. o.hl (0 to 3): the word Health lit in each row in
// turn; o.joint 0 to 1: the last row widens, amber; o.names 0 to 1: the rows become a list of names, blurred on purpose. 820 wide
const OD_DEG=[["Master of Public ","Health",""],["Graduate Certificate in ","Health"," Informatics"],["","Health"," data"]];
function od_tableCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=820,h=312;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Copy of the student table",x+32,y+54,{w:700,size:32});ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+26,y+80,w-52,1.5);
  const nm=o.names||0;
  if(nm<1){ctx.save();ctx.globalAlpha*=1-nm;OD_DEG.forEach((d,i)=>{const yy=y+142+i*62,k=clamp((o.rows==null?1:o.rows)*3-i,0,1);if(k<=0)return;ctx.save();ctx.globalAlpha*=k;
      const jo=i===2?(o.joint||0):0,f={w:500,size:30},x0=x+32,w0=ag_tw(ctx,d[0],f),w1=ag_tw(ctx,d[1],Object.assign({},f,{w:700}));
      if(jo>0){ctx.fillStyle=rgba(AG.amber,0.12*jo);rr(ctx,x+16,yy-38,w-32,54,10);ctx.fill();ctx.strokeStyle=rgba(AG.amber,0.7*jo);ctx.lineWidth=2;rr(ctx,x+16,yy-38,w-32,54,10);ctx.stroke();}
      const hl=clamp((o.hl||0)-i,0,1);if(hl>0){ctx.fillStyle=rgba(i===2&&jo>0?AG.amber:AG.orange,0.2*hl);rr(ctx,x0+w0-6,yy-28,w1+12,38,8);ctx.fill();}
      ag_T(ctx,d[0],x0,yy,f);ag_T(ctx,d[1],x0+w0,yy,Object.assign({},f,{w:700,col:hl>0.5?(i===2&&jo>0?AG.amber:AG.orange):AG.ink}));ag_T(ctx,d[2],x0+w0+w1,yy,f);
      if(jo>0)ag_T(ctx," · joint degree · no faculty · 31",x0+w0+w1+ag_tw(ctx,d[2],f),yy,{w:500,size:30,col:AG.amber,a:jo});
      ctx.restore();});ctx.restore();}
  if(nm>0){ctx.save();ctx.globalAlpha*=nm;ctx.filter="blur(5px)";const R=ag_rnd(7);for(let i=0;i<5;i++){const yy=y+112+i*38;ctx.fillStyle="rgba(60,64,72,0.42)";
      rr(ctx,x+34,yy,140+R()*110,18,9);ctx.fill();rr(ctx,x+250+R()*40,yy,180+R()*150,18,9);ctx.fill();ctx.fillStyle="rgba(60,64,72,0.24)";rr(ctx,x+w-170,yy,120,18,9);ctx.fill();}
    ctx.filter="none";ctx.restore();}
  ctx.restore();}

// the folder of reports, opened: its tab "Reports", and pages fanning out of it, their grey lines decoration. 760 wide
function od_reports(ctx,x,y,open,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=300;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Reports",x+32,y+54,{w:700,size:32});ag_T(ctx,"Health's student numbers, by term",x+w-32,y+54,{w:500,size:28,col:AG.mut,align:"right"});
  for(let i=0;i<6;i++){const k=clamp(open*6-i*0.8,0,1),e=Math.min(1,ag_spr(k,0,0.5));if(k<=0)continue;const px=x+40+i*118,py=y+96+(1-e)*30;ctx.save();ctx.translate(px+50,py+86);ctx.rotate((i-2.5)*0.045*e);
    ctx.shadowColor="rgba(46,38,28,0.2)";ctx.shadowBlur=8;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=4;ctx.fillStyle="#FAF9F6";ctx.fillRect(-50,-82,100,164);ctx.shadowColor="transparent";
    ctx.fillStyle="rgba(86,92,100,0.28)";ctx.fillRect(-36,-64,58,7);for(let l=0;l<7;l++)ctx.fillRect(-36,-42+l*16,(l%2?52:70),4);ctx.restore();}
  ctx.restore();}

// Anil's plan for next year's places: the students, the places, and the gap. lo 0 to 1: planned for the lowest answer, the places
// stop short and a dashed amber gap shows, "720 students with no place"; ok 0 to 1: the places reach every student, green. 760 wide
function od_plan(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=332,bw=w-64,ok=o.ok||0,lo=o.lo||0;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{edge:ok>0.5?AG.green:null});ag_T(ctx,"Next year's places",x+32,y+54,{w:700,size:32});if(ok>0)ag_tick(ctx,x+w-52,y+42,30,rgba(AG.green,ok),5);
  ag_T(ctx,"students on census day",x+32,y+112,{w:500,size:28,col:AG.mut});ctx.fillStyle=rgba(AG.mut,0.18);rr(ctx,x+32,y+128,bw,32,9);ctx.fill();
  ctx.strokeStyle=rgba(AG.mut,0.55);ctx.lineWidth=2;rr(ctx,x+32,y+128,bw,32,9);ctx.stroke();
  const fr=lerp(0.75,1,ok),fw=bw*fr,col=ok>0.5?AG.green:[120,124,132];
  ag_T(ctx,ok>0.5?"a place for every student":"places for 2,160",x+32,y+212,{w:700,size:28,col:ok>0.5?AG.green:AG.ink});
  ctx.fillStyle=rgba(col,0.85);rr(ctx,x+32,y+228,fw,32,9);ctx.fill();
  if(lo>0&&ok<1){ctx.save();ctx.globalAlpha*=lo*(1-ok);const gx=x+32+bw*0.75+5,gw=bw*0.25-5;ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=2.5;rr(ctx,gx,y+228,gw,32,9);ctx.stroke();ctx.setLineDash([]);
    ag_T(ctx,"720 students with no place",x+w-32,y+300,{w:700,size:28,col:AG.amber,align:"right"});ctx.restore();}
  ctx.restore();}
