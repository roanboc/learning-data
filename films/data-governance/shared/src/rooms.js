/* ===== The data governance series: the university's rooms, in watercolour =====
   The series paints with the master and reference data series' watercolour (its shared/src/wash.js and people.js, bundled as they
   are), so the two series look like one university. This file adds what the governance films need, all of it the university's own:
   the campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data
   governance, the data team, the platform team), the rooms where the numbers are made, and a desk seen from above for the papers; then
   the things on their walls and desks (binders, papers, screens, cards, pins, stamps, speech bubbles), a camera that cuts between
   shots, and the series' title and end cards. The places are painted once and kept (finish.js); only what moves is drawn every frame.
   Every name starts with gv_ or GV, because every file of the film shares one script. */

/* ---------- colours ---------- */
// what the colours mean: gold is governance's decisions (and, behind a person, the business side, as in the master data series); cyan
// the technical side; green what runs in the work; grey what can go; red what nobody owns yet
const GV={gold:[236,170,34],goldInk:[146,96,0],green:[40,160,96],greenInk:[22,120,68],grey:[148,156,170],greyInk:[88,94,108],red:[204,62,50],redInk:[176,40,34],
  cyanInk:[24,104,168],wood:[198,152,106],woodDark:[146,104,72],oak:[222,186,138],cork:[208,166,114],metal:[166,172,184],bezel:[60,64,78],glass:[198,222,238],
  floor:[214,196,170],corridor:[230,224,212],ceiling:[246,242,234],chair:[84,92,112],paper:[253,252,248],screen:[248,250,252]};
// each room's walls: governance warm cream, Planning sage, the registrar's office blue, the data team lilac, the platform team pale teal
const GV_ROOM={gov:[244,230,204],plan:[218,230,206],reg:[212,222,238],data:[226,218,238],plat:[206,230,226]};

/* ---------- timing ---------- */
// when a word of a line is said: the line's start, plus the word's share of the line (a whole word: shared/tools/cues.py checks)
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
// 0 to 1 from t0 over d seconds, and back to 0 from t1
const gv_io=(t,t0,t1,d)=>fin(t,t0,d||0.4)*(1-fin(t,t1,d||0.4));

/* ---------- the camera ---------- */
// keys are [time, x, y, zoom], each move eased over d seconds (1.4 at least); push closes in a little more, slowly; kept inside the frame
function gv_focus(ctx,t,keys,d,push){d=Math.max(1.4,d||1.6);let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+(push||0)));x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// one shot: its place under the camera, then what it draws on top, in the place's coordinates; the shot closes in slowly until the next
function gv_shot(ctx,S,t,sh,till){setScreen(ctx,S);ctx.save();const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((t-sh.at)/len,0,1));
  const cam=gv_focus(ctx,t,sh.keys,sh.d,push);if(sh.place)ctx.drawImage(gv_place(sh.place),0,0,W,H);if(sh.draw)sh.draw(ctx,t,cam);ctx.restore();setScreen(ctx,S);}
// a chapter cut into shots, [{at, place, keys, draw, push, d}]: each dissolves in from the one before over dis seconds; returns the shot
function gv_shots(ctx,S,t,end,shots,dis){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;const u=i>0?clamp((t-shots[i].at)/dis,0,1):1,
    till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){gv_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=wc_buf("cut",ctx.canvas.width,ctx.canvas.height);gv_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else gv_shot(ctx,S,t,shots[i],till(i));return i;}
// a place, painted once by the film's painter (WC_PLACES), and kept
function gv_place(key){return wc_kept("place:"+key,W,H,WC_PLACES[key]);}

/* ---------- rooms ---------- */
// a room's back wall to fy, its floor boards running away from us, and a skirting board
function gv_wallFloor(ctx,wall,fy,o){o=o||{};const fl=o.floor||GV.floor;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),wall,{kind:"plaster",line:false,seed:o.seed||3});
  wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),fl,{kind:"ground",line:false,seed:(o.seed||3)+5});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(fl,0.2),0.3);ctx.lineWidth=2;const vx=o.vx||960;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(vx+i*64,fy);ctx.lineTo(vx+i*210,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,fy-18,W+80,20),wc_dim(wall,0.16),{kind:"trim",line:false,flat:true});}
// a window onto the campus: the sky, the old building's clock tower among trees, the lawn; then its frame, a bar each way, and the sill
function gv_window(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const hz=y+h*0.72;
  wc_sky(ctx,hz,o.seed||4,{clouds:2,cx:x+10,cw:Math.max(40,w-120),cy:y+24,ch:h*0.22});
  wc_land(ctx,xx=>hz+6*Math.sin(xx/80+x),WCP.far,0.3,{line:false});
  if(o.tower!==false){const tx=x+w*(o.tx||0.64),th=h*0.46;wc_part(ctx,wc_rect(tx-24,hz-th,48,th+12),WCP.stone,0.42);wc_part(ctx,[[tx-30,hz-th],[tx+30,hz-th],[tx,hz-th-h*0.14]],WCP.slate,0.42);
    wc_wash(ctx,wc_ell(tx,hz-th+30,11,11,20),WCP.clock,{depth:0.42,kind:"clock",lw:1.2});wc_part(ctx,wc_rect(x+w*0.08,hz-h*0.16,w*0.4,h*0.16+12),WCP.stone,0.36);}
  wc_land(ctx,xx=>hz+34+6*Math.sin(xx/120),WCP.lawn,0.5,{line:false});
  wc_roundTree(ctx,x+w*0.16,hz+44,h*0.36,0.5);wc_roundTree(ctx,x+w*0.9,hz+56,h*0.3,0.5,WCP.leaf2);ctx.restore();
  const f=16;for(const r of [wc_rect(x-f,y-f,w+2*f,f),wc_rect(x-f,y-f,f,h+2*f),wc_rect(x+w,y-f,f,h+2*f),wc_rect(x+w/2-6,y,12,h),wc_rect(x,y+h*0.42-6,w,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(x-30,y+h,w+60,24),wc_dim(o.wall||GV_ROOM.gov,0.1),{kind:"trim",lw:1.5});}
// a door to the corridor: its frame, the door, a narrow pane of glass and a handle; fy is the floor
function gv_door(ctx,x,fy,w,h,col){wc_wash(ctx,wc_rect(x-16,fy-h-16,w+32,h+16),WC_PAPER,{kind:"trim",lw:1.5});wc_wash(ctx,wc_rect(x,fy-h,w,h),col,{kind:"door",lw:1.6});
  wc_flat(ctx,wc_rect(x+w*0.3,fy-h+h*0.1,w*0.4,h*0.36),GV.glass,1,"window");wc_wash(ctx,wc_rect(x+w-36,fy-h*0.5,22,10),GV.metal,{kind:"thing",lw:1.2});}
// a desk from the front: its top at y, on the floor at fy; legs, a panel, and a pedestal of drawers
function gv_desk(ctx,x,y,w,fy,o){o=o||{};const col=o.col||GV.oak;wc_contact(ctx,x-20,x+w+20,fy+2,0.9,0.3);
  wc_part(ctx,wc_rect(x+26,y+20,w-52,(fy-y)*0.62),wc_dim(col,0.14),1);for(const lx of [x+8,x+w-34])wc_part(ctx,wc_rect(lx,y+18,26,fy-y-18),wc_dim(col,0.22),1);
  if(o.drawers!==false){const dx=o.left?x+30:x+w-206;wc_part(ctx,wc_rect(dx,y+18,176,fy-y-18),col,1);for(let i=0;i<3;i++){const dy=y+40+i*(fy-y-40)/3;wc_flat(ctx,wc_rect(dx+60,dy+18,56,8),wc_dim(col,0.4),1,"handle");}}
  wc_part(ctx,wc_rect(x-8,y,w+16,24),wc_lit(col,0.12),1);}
// an office chair's back, seen over a desk
function gv_chair(ctx,cx,y,o){o=o||{};wc_part(ctx,wc_rrPts(cx-74,y,148,o.h||150,26),o.col||GV.chair,1);}
// a bookcase on the floor at fy: its back, shelves at the given heights, sides and plinth
function gv_bookcase(ctx,x,fy,w,h,shelves,o){o=o||{};const col=o.col||GV.wood,top=fy-h;wc_contact(ctx,x-10,x+w+10,fy+2,0.9,0.25);
  wc_part(ctx,wc_rect(x,top,w,h),wc_dim(col,0.3),1,{lw:1.2});for(const sy of shelves)wc_part(ctx,wc_rect(x+14,sy,w-28,16),wc_lit(col,0.06),1);
  wc_part(ctx,wc_rect(x-10,top-16,w+20,20),col,1);wc_part(ctx,wc_rect(x-6,top,22,h),col,1);wc_part(ctx,wc_rect(x+w-16,top,22,h),col,1);wc_part(ctx,wc_rect(x-6,fy-26,w+12,26),wc_dim(col,0.06),1);}
// a screen's frame and its stand; what it shows is drawn every frame (gv_screen)
function gv_monitor(ctx,x,y,w,h,o){o=o||{};if(o.stand!==false){wc_part(ctx,[[x+w/2-16,y+h+8],[x+w/2+16,y+h+8],[x+w/2+22,y+h+56],[x+w/2-22,y+h+56]],GV.metal,1);
    wc_part(ctx,wc_rect(x+w/2-78,y+h+52,156,14),GV.metal,1);}wc_part(ctx,wc_rect(x-12,y-12,w+24,h+24),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(x,y,w,h),[230,234,240],1,"screen");}
// a cork board in a wooden frame, speckled
function gv_cork(ctx,x,y,w,h,fw){fw=fw||14;const k=fw/14;wc_part(ctx,wc_rect(x-fw,y-fw,w+2*fw,h+2*fw),GV.woodDark,1);wc_wash(ctx,wc_rect(x,y,w,h),GV.cork,{kind:"build",lw:1.1,seed:x|0});
  const R=wc_rng(x|0);ctx.save();for(let i=0;i<w*h/(260*k*k);i++){ctx.fillStyle=rgba(wc_dim(GV.cork,0.25+R()*0.2),0.35);ctx.beginPath();ctx.arc(x+R()*w,y+R()*h,(0.8+R()*1.6)*k,0,TAU);ctx.fill();}ctx.restore();}
// a plant in a pot, on the floor at fy
function gv_plant(ctx,x,fy,s){s=s||1;wc_contact(ctx,x-50*s,x+50*s,fy+2,0.9,0.25);const R=wc_rng(Math.round(x)),parts=[];for(let i=0;i<9;i++){const a=-Math.PI*0.5+(R()-0.5)*2.2,r=60*s+R()*70*s;
    parts.push(wc_ell(x+Math.cos(a)*r*0.7,fy-150*s+Math.sin(a)*r*0.9,(18+R()*14)*s,(42+R()*20)*s,18));}
  wc_wash(ctx,parts,WCP.leaf,{kind:"tree",seed:Math.round(x)});wc_part(ctx,[[x-46*s,fy-110*s],[x+46*s,fy-110*s],[x+36*s,fy],[x-36*s,fy]],[200,126,96],1);}
// a frame on the wall, with a paper mount; what's in it is drawn every frame
function gv_frame(ctx,x,y,w,h){wc_part(ctx,wc_rect(x-14,y-14,w+28,h+28),GV.woodDark,1);wc_flat(ctx,wc_rect(x,y,w,h),WC_CARD,1,"mount");}
// a ceiling light's glow on the wall
function gv_lightGlow(ctx,x,y,r){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r,[255,246,222],0.5);ctx.restore();}

/* ---------- the university's places ---------- */
// The campus: the old sandstone building with its clock tower and glass wing, the newer building where the offices are, lawns, a
// path to its door. Nothing but the university's own.
const GV_CP={fy:742,door:[1462,742],path:[[700,1090],[900,980],[1160,880],[1380,800],[1462,750]]};
function gv_paintCampus(ctx){const P=WCP;wc_sky(ctx,700,8,{sun:[1640,160],cx:120,cw:1500});
  wc_forest(ctx,x=>620+12*Math.sin(x/230)+6*Math.sin(x/70),P.farForest,0.08,5,{h:34,w:22});wc_treeRow(ctx,()=>640,-40,1980,62,74,0.22,21,P.leaf2);
  wc_land(ctx,x=>660+5*Math.sin(x/300),P.lawn,0.42);
  wc_contact(ctx,30,640,668,0.46,0.22);wc_quad(ctx,40,668,0.46,0.6);wc_glassWing(ctx,628,668,140,160,0.48);
  // the newer building: a frame of pale concrete, bands of glass, a canopy over the door
  const bx=1040,bw=780,top=300,by=GV_CP.fy;wc_contact(ctx,bx-20,bx+bw+20,by+4,0.6,0.3);wc_part(ctx,wc_rect(bx,top,bw,by-top),P.concrete,0.6);
  for(let r=0;r<4;r++){const ry=top+40+r*100;wc_part(ctx,wc_rect(bx+30,ry,bw-60,64),P.glass,0.6,{kind:"glass"});
    ctx.save();ctx.strokeStyle=rgba(wc_dim(P.glass,0.35),0.6);ctx.lineWidth=3;for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(bx+30+i*(bw-60)/10,ry);ctx.lineTo(bx+30+i*(bw-60)/10,ry+64);ctx.stroke();}ctx.restore();}
  wc_part(ctx,wc_rect(bx-14,top-20,bw+28,24),wc_lit(P.concrete,0.1),0.6);
  const [dx]=GV_CP.door;wc_part(ctx,wc_rect(dx-70,by-150,140,150),P.glass,0.62,{kind:"glass"});wc_part(ctx,wc_rect(dx-110,by-176,220,22),P.slate,0.62);
  wc_roundTree(ctx,980,700,230,0.5);wc_roundTree(ctx,1870,712,210,0.5,P.leaf2);
  wc_wash(ctx,[[-60,766],[W+60,754],[W+60,H+60],[-60,H+60]],P.lawn,{depth:0.7,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth(GV_CP.path,8),260,46),P.paving,{depth:0.66,kind:"path",line:false});
  wc_lamp(ctx,860,960,320,0.8);wc_lamp(ctx,1690,820,240,0.66);wc_tufts(ctx,x=>760,0,620,40,0.9,6);}

// Yusuf's office: a door to the corridor, a window onto the campus, the chart pinned to a board, the framed score, his desk and chair,
// the shelf of binders. GV_OFF says where each is, for the scenes.
const GV_OFF={fy:850,door:[50,250,520],win:[318,150,330,430],board:[690,150,410,410],score:[1150,200,176,136],
  shelf:{x:1366,w:510,h:690,rows:[372,542,712]},desk:[700,664,600],chair:1000,plant:1318};
function gv_paintOffice(ctx){const O=GV_OFF,wall=GV_ROOM.gov;gv_wallFloor(ctx,wall,O.fy,{seed:11,vx:900});gv_lightGlow(ctx,960,0,520);
  gv_door(ctx,O.door[0],O.fy,O.door[1]-O.door[0],O.door[2],[176,140,108]);gv_window(ctx,O.win[0],O.win[1],O.win[2],O.win[3],{wall,seed:6});
  gv_cork(ctx,O.board[0],O.board[1],O.board[2],O.board[3]);gv_frame(ctx,O.score[0],O.score[1],O.score[2],O.score[3]);
  const S=O.shelf;gv_bookcase(ctx,S.x,O.fy,S.w,S.h,S.rows.concat([O.fy-40]),{});
  // the top shelf's books and boxes, which never move
  const R=wc_rng(9);let bx=S.x+30;while(bx<S.x+S.w-60){const bw=26+R()*22,bh=110+R()*40;wc_part(ctx,wc_rect(bx,S.rows[0]-bh,bw,bh),[[150,90,80],[96,118,150],[120,140,104],[196,170,120]][Math.floor(R()*4)],1,{lw:1.2});bx+=bw+4;
    if(R()<0.15){wc_part(ctx,wc_rect(bx+6,S.rows[0]-80,120,80),[214,196,160],1);bx+=130;}}
  // under the shelves, a cupboard: two doors and their knobs
  for(const j of [0,1]){const dx=S.x+22+j*(S.w/2-18);wc_part(ctx,wc_rect(dx,S.rows[2]+20,S.w/2-26,O.fy-62-S.rows[2]),wc_lit(GV.wood,0.05),1);
    wc_wash(ctx,wc_ell(dx+(j?22:S.w/2-48),S.rows[2]+62,6,6,12),GV.metal,{kind:"thing",lw:1});}
  gv_plant(ctx,O.plant,O.fy,0.9);gv_chair(ctx,O.chair,O.desk[1]-130);gv_desk(ctx,O.desk[0],O.desk[1],O.desk[2],O.fy+6,{left:true});
  // on the desk: a tray of papers and a pot of pens
  const dx=O.desk[0]+O.desk[2];wc_part(ctx,wc_rect(dx-210,O.desk[1]-30,120,30),[226,218,204],1);wc_flat(ctx,wc_rect(dx-200,O.desk[1]-38,100,10),WC_CARD,1,"papers");
  wc_part(ctx,[[dx-70,O.desk[1]],[dx-30,O.desk[1]],[dx-34,O.desk[1]-58],[dx-66,O.desk[1]-58]],[96,118,150],1);
  for(const [px,a,c] of [[-58,-0.2,[60,60,70]],[-48,0.1,[204,62,50]],[-40,0.25,[60,60,70]]]){ctx.save();ctx.translate(dx+px,O.desk[1]-56);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}}

// The floor where the work is done, from the corridor: five offices behind glass, each with its name on the glass. GV_FL gives each
// office's left edge and its person's spot; the people are drawn every frame, then the glass over them (gv_floorGlass), then the names.
const GV_FL={fy:830,top:140,inner:700,rooms:[["plan","Planning"],["reg","Registrar's office"],["gov","Data governance"],["data","Data team"],["plat","Platform team"]],
  x:i=>i*384+16,w:352,spot:i=>i*384+16+(i%2?120:236),walk:905};
function gv_paintFloor(ctx){const F=GV_FL;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,F.top+40),GV.ceiling,{kind:"plaster",line:false,seed:3});
  F.rooms.forEach(([k],i)=>{const x=F.x(i),w=F.w,wall=GV_ROOM[k],odd=i%2;
    // inside: the room's back wall and floor, a window, a desk and a screen, and what each office has of its own
    wc_wash(ctx,wc_rect(x,F.top,w,F.inner-F.top),wall,{kind:"plaster",line:false,seed:7+i*5});wc_wash(ctx,wc_rect(x,F.inner,w,F.fy-F.inner),wc_lit(GV.floor,0.12),{kind:"ground",line:false,seed:9+i});
    wc_flat(ctx,wc_rect(x,F.inner-10,w,12),wc_dim(wall,0.16),1,"skirting");
    const wx=odd?x+w-170:x+34;gv_window(ctx,wx,F.top+130,136,190,{wall,seed:20+i,tx:0.5,tower:i===2});
    const ox=odd?x+20:x+w-176,oy=F.top+140;
    // Planning: a chart of this year's numbers; the registrar's office: archive boxes on a shelf; data governance: two shelves of
    // binders; the data team: a whiteboard, written on; the platform team: a rack of servers under the window
    if(k==="plan"){wc_part(ctx,wc_rect(ox+6,oy,150,120),WC_CARD,0.9,{lw:1.2});[0.5,0.7,0.45,0.85,0.62].forEach((v,j)=>wc_flat(ctx,wc_rect(ox+26+j*24,oy+104-v*80,16,v*80),j===4?GV.gold:[140,176,210],0.9,"bar"));}
    if(k==="reg"){wc_part(ctx,wc_rect(ox,oy+96,160,10),GV.wood,0.9);for(let j=0;j<3;j++){wc_part(ctx,wc_rect(ox+8+j*50,oy+34,44,62),[214,200,170],0.9,{lw:1.1});wc_flat(ctx,wc_rect(ox+18+j*50,oy+48,24,12),WC_CARD,0.9,"label");}}
    if(k==="gov")for(const sy of [oy+60,oy+150]){wc_part(ctx,wc_rect(ox,sy,160,10),GV.wood,0.9);for(let j=0;j<9;j++)wc_part(ctx,wc_rect(ox+6+j*17,sy-64,14,64),[[96,118,150],[150,90,80],[120,140,104],[186,160,110]][j%4],0.9,{lw:1});}
    if(k==="data"){wc_part(ctx,wc_rect(ox,oy,160,116),[248,248,246],0.9,{lw:1.2});ctx.save();ctx.lineWidth=3;ctx.lineCap="round";
      [[[24,30],[70,30]],[[24,52],[110,52]],[[24,74],[90,74]],[[118,40],[140,60]],[[140,60],[118,88]]].forEach(([a,b],j)=>{ctx.strokeStyle=rgba(j>2?[204,62,50]:[60,110,170],0.7);ctx.beginPath();ctx.moveTo(ox+a[0],oy+a[1]);ctx.lineTo(ox+b[0],oy+b[1]);ctx.stroke();});ctx.restore();}
    if(k==="plat"){const rx=x+44,ry=F.inner-236;wc_part(ctx,wc_rect(rx,ry,74,236),[70,76,90],0.9);for(let j=0;j<6;j++){wc_flat(ctx,wc_rect(rx+8,ry+12+j*36,58,26),[96,104,120],0.9,"unit");
      [[120,220,160],[120,200,255]].forEach((c,l)=>{ctx.fillStyle=rgba(c,0.85);ctx.beginPath();ctx.arc(rx+18+l*12,ry+25+j*36,3,0,TAU);ctx.fill();});}}
    const dx=odd?x+20:x+w-190;wc_part(ctx,wc_rect(dx,F.inner-120,170,16),wc_lit(GV.oak,0.1),0.9);wc_part(ctx,wc_rect(dx+10,F.inner-104,14,104),wc_dim(GV.oak,0.2),0.9);wc_part(ctx,wc_rect(dx+146,F.inner-104,14,104),wc_dim(GV.oak,0.2),0.9);
    wc_part(ctx,wc_rect(dx+50,F.inner-212,92,62),GV.bezel,0.9,{kind:"thing"});wc_flat(ctx,wc_rect(dx+56,F.inner-206,80,50),[226,232,240],0.9,"screen");wc_part(ctx,wc_rect(dx+90,F.inner-150,12,30),GV.metal,0.9);});
  // the walls between the offices
  for(let i=0;i<=5;i++){const x=i*384-4;wc_part(ctx,wc_rect(x,F.top-6,24,F.fy-F.top+6),GV.ceiling,1,{lw:1.3});}
  // the corridor's floor, and a long rug where people walk
  wc_wash(ctx,wc_rect(-40,F.fy,W+80,H-F.fy+40),GV.corridor,{kind:"ground",line:false,seed:31});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV.corridor,0.18),0.32);ctx.lineWidth=2;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(960+i*64,F.fy);ctx.lineTo(960+i*190,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,[[-60,F.fy+28],[W+60,F.fy+28],[W+60,F.fy+100],[-60,F.fy+100]],[176,190,206],{kind:"ground",line:false,seed:33,a:0.75});
  for(let i=0;i<5;i++)gv_lightGlow(ctx,192+i*384,F.top-10,300);}
// the glass in front of the offices, over the people inside: a pale wash, light across it, the door's edge and handle, a bottom rail
function gv_floorGlass(ctx){const F=GV_FL;ctx.drawImage(wc_kept("floorGlass",W,H,c=>{F.rooms.forEach(([k],i)=>{const x=F.x(i),w=F.w,h=F.fy-F.top;
    c.save();c.globalAlpha=0.16;c.fillStyle=rgba(GV.glass,1);c.fillRect(x,F.top,w,h);c.restore();
    c.save();c.beginPath();c.rect(x,F.top,w,h);c.clip();c.globalCompositeOperation="screen";for(const [o,ww] of [[0.16,70],[0.34,24],[0.72,46]]){const g=c.createLinearGradient(x+w*o,0,x+w*o+ww,0);
      g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.16)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.moveTo(x+w*o,F.top);c.lineTo(x+w*o+ww,F.top);c.lineTo(x+w*o+ww-160,F.fy);c.lineTo(x+w*o-160,F.fy);c.closePath();c.fill();}c.restore();
    const dx=i%2?x+w-96:x+96;c.save();c.strokeStyle=rgba(GV.metal,0.9);c.lineWidth=3;c.beginPath();c.moveTo(dx,F.top);c.lineTo(dx,F.fy);c.stroke();c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(dx+(i%2?14:-14),F.top+330);c.lineTo(dx+(i%2?14:-14),F.top+420);c.stroke();c.restore();});
  wc_wash(c,wc_rect(-20,F.fy-14,W+40,16),GV.metal,{kind:"trim",lw:1.2});wc_wash(c,wc_rect(-20,F.top-8,W+40,14),GV.metal,{kind:"trim",lw:1.2});}),0,0);}
// an office's name on its glass, on a frosted band
function gv_floorName(ctx,i,a){if(a<=0.01)return;const F=GV_FL,x=F.x(i),name=F.rooms[i][1];withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(255,255,255,0.62)";ctx.fillRect(x+12,F.top+28,F.w-24,56);ctx.restore();
  wc_T(ctx,name,x+F.w/2,F.top+67,{w:800,size:30,align:"center",col:WC_DARK});});}

// The data team's room: a window, the cork board where the reports go, the poster of the loop they build in, Jun's desk and two
// screens.
const GV_DT={fy:856,win:[70,150,330,440],board:[450,150,430,380],poster:[920,130,560,360],desk:[1470,668,430],mon:[[1490,474,180,126],[1690,474,180,126]]};
function gv_paintData(ctx){const D=GV_DT,wall=GV_ROOM.data;gv_wallFloor(ctx,wall,D.fy,{seed:21,vx:1000});gv_lightGlow(ctx,980,0,560);
  gv_window(ctx,D.win[0],D.win[1],D.win[2],D.win[3],{wall,seed:12,tx:0.4});gv_cork(ctx,D.board[0],D.board[1],D.board[2],D.board[3]);
  gv_poster(ctx,D.poster[0],D.poster[1],D.poster[2],D.poster[3]);
  gv_chair(ctx,1690,D.desk[1]-128,{col:[96,84,120]});gv_desk(ctx,D.desk[0],D.desk[1],D.desk[2],D.fy+6,{});D.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));
  gv_plant(ctx,428,D.fy,0.6);}
// the data team's poster: how they build, in ten steps round a loop (In the weeds of data crafting's loop, as they'd pin it up), from
// a question to a new version. Drawn for a poster 1260 wide (the close-up) and scaled to any other size; gv_loopPos says where step i is.
const GV_LOOPC=[96,160,176];
function gv_loopPos(i,x,y,w,h){const k=w/1260,an=-Math.PI/2+i/10*TAU;return[x+w/2+Math.cos(an)*330*k,y+h*450/810+Math.sin(an)*270*k];}
function gv_loopArt(ctx,x,y,w,h){const k=w/1260,cx=x+w/2,cy=y+h*450/810;
  wc_T(ctx,"How we build",cx,y+86*k,{w:800,size:50*k,align:"center",col:WC_DARK});
  // the loop: a pencil line round it, a chevron between each two steps, going round clockwise
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.2),0.6);ctx.lineWidth=3.2*k;ctx.setLineDash([3*k,11*k]);ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,330*k,270*k,0,0,TAU);ctx.stroke();ctx.restore();
  for(let i=0;i<10;i++){const an=-Math.PI/2+(i+0.5)/10*TAU,px=cx+Math.cos(an)*330*k,py=cy+Math.sin(an)*270*k,d=Math.atan2(Math.cos(an)*270,-Math.sin(an)*330);
    ctx.save();ctx.translate(px,py);ctx.rotate(d);ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.3),0.8);ctx.lineWidth=3.4*k;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-7*k,-9*k);ctx.lineTo(4*k,0);ctx.lineTo(-7*k,9*k);ctx.stroke();ctx.restore();}
  // each step: a chip with its mark, and its name outside the loop
  STEPS10.forEach(([nm,sym],i)=>{const [sx,sy]=gv_loopPos(i,x,y,w,h),an=-Math.PI/2+i/10*TAU,c=Math.cos(an),s=Math.sin(an),r=30*k;
    wc_wash(ctx,wc_ell(sx,sy,r,r,28),wc_lit(GV_LOOPC,0.5),{kind:"thing",lw:1.4*Math.max(0.6,k),seed:40+i});
    wc_T(ctx,sym,sx,sy+(sym.length>1?8:10)*k,{w:800,size:(sym.length>2?21:sym.length>1?24:28)*k,align:"center",col:wc_dim(GV_LOOPC,0.55)});
    const top=i===0,bot=i===5,al=top||bot?"center":c>0?"left":"right",nx=top||bot?sx:sx+(c>0?1:-1)*(r+16*k),ny=top?sy-r-16*k:bot?sy+r+40*k:sy+10*k;
    wc_T(ctx,nm,nx,ny,{w:700,size:29*k,align:al,col:WC_INK});});}
// the poster on the wall: paper, a pin in each top corner, the loop
function gv_poster(ctx,x,y,w,h){const k=w/1260;ctx.save();ctx.filter="blur("+Math.max(2,8*k)+"px)";ctx.fillStyle="rgba(70,60,50,0.18)";ctx.fillRect(x+8*k,y+12*k,w,h);ctx.restore();
  wc_wash(ctx,wc_rect(x,y,w,h),[251,250,245],{kind:"paper",lw:Math.max(1,1.6*k),seed:5});gv_loopArt(ctx,x,y,w,h);for(const px of [x+30*k,x+w-30*k])gv_pin(ctx,px,y+28*k,GV.red,Math.max(0.5,1.5*k));}

// The platform team's room: two racks of servers, a whiteboard of what's connected to what, a desk and two screens, a window.
const GV_PF={fy:856,win:[1500,150,330,430],rack:[[80,250,170,606],[262,250,170,606]],board:[540,190,420,300],desk:[1000,668,520],mon:[[1060,470,190,130],[1290,470,190,130]]};
// a rack of servers: a dark cabinet, its units, a green and a blue light on each
function gv_rack(ctx,x,y,w,h,seed){wc_contact(ctx,x-10,x+w+10,y+h+2,0.9,0.3);wc_part(ctx,wc_rect(x,y,w,h),[70,76,90],1,{seed});const n=Math.floor((h-40)/52);
  for(let j=0;j<n;j++){const uy=y+22+j*52;wc_flat(ctx,wc_rect(x+14,uy,w-28,40),[96,104,120],1,"unit");ctx.save();ctx.strokeStyle="rgba(40,44,54,0.5)";ctx.lineWidth=2;for(let v=0;v<5;v++){ctx.beginPath();ctx.moveTo(x+70+v*12,uy+10);ctx.lineTo(x+70+v*12,uy+30);ctx.stroke();}ctx.restore();
    [[120,220,160],[120,200,255]].forEach((c,l)=>{ctx.fillStyle=rgba(c,0.9);ctx.beginPath();ctx.arc(x+30+l*18,uy+20,4.5,0,TAU);ctx.fill();});}}
// a whiteboard, written on in marker: boxes and the arrows between them
function gv_whiteboard(ctx,x,y,w,h){wc_part(ctx,wc_rect(x-10,y-10,w+20,h+20),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[250,251,250],1,"board");
  ctx.save();ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";const k=w/420,box=(bx,by,bw,bh,c)=>{ctx.strokeStyle=rgba(c,0.75);ctx.beginPath();ctx.rect(x+bx*k,y+by*k,bw*k,bh*k);ctx.stroke();};
  box(30,40,110,64,[60,110,170]);box(250,30,130,70,[60,110,170]);box(150,180,130,70,[40,140,90]);
  ctx.strokeStyle=rgba([204,62,50],0.75);[[[140,72],[250,64]],[[86,104],[180,180]],[[316,100],[250,180]]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(x+a[0]*k,y+a[1]*k);ctx.lineTo(x+b[0]*k,y+b[1]*k);ctx.stroke();});
  ctx.strokeStyle=rgba([60,60,70],0.5);ctx.lineWidth=3;for(const [bx,by,bw] of [[44,66,70],[264,58,90],[166,208,90]]){ctx.beginPath();ctx.moveTo(x+bx*k,y+by*k);ctx.lineTo(x+(bx+bw)*k,y+by*k);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(x+w*0.3,y+h+10,w*0.4,12),GV.metal,1);}
function gv_paintPlatform(ctx){const P=GV_PF,wall=GV_ROOM.plat;gv_wallFloor(ctx,wall,P.fy,{seed:61,vx:960});gv_lightGlow(ctx,960,0,540);
  gv_window(ctx,P.win[0],P.win[1],P.win[2],P.win[3],{wall,seed:18,tx:0.5});P.rack.forEach((r,i)=>gv_rack(ctx,r[0],r[1],r[2],r[3],7+i));
  gv_whiteboard(ctx,P.board[0],P.board[1],P.board[2],P.board[3]);
  gv_chair(ctx,1260,P.desk[1]-128,{col:[70,96,110]});gv_desk(ctx,P.desk[0],P.desk[1],P.desk[2],P.fy+6,{});P.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));
  gv_plant(ctx,1884,P.fy,0.7);}

// Close-ups: a cork board filling the frame, on its room's wall; a screen on a desk; the data team's poster
const GV_BC=[210,50,1500,820],GV_SC=[330,70,1260,690],GV_PC=[330,40,1260,810];
function gv_paintBoardClose(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:71});
  gv_lightGlow(ctx,960,-80,900);const [x,y,w,h]=GV_BC;gv_cork(ctx,x,y,w,h,34);}
function gv_paintScreenDesk(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,960),wall,{kind:"plaster",line:false,seed:73});
  wc_wash(ctx,wc_rect(-40,900,W+80,220),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(ctx,wc_rect(-40,894,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=GV_SC;wc_part(ctx,[[x+w/2-40,y+h+12],[x+w/2+40,y+h+12],[x+w/2+52,912],[x+w/2-52,912]],GV.metal,1);wc_wash(ctx,wc_ell(x+w/2,918,190,22,30),GV.metal,{kind:"thing",lw:1.4});
  gv_monitor(ctx,x,y,w,h,{stand:false});
  wc_part(ctx,wc_rect(1660,960,420,160),[226,228,234],1);wc_wash(ctx,wc_ell(160,990,70,40,30),[236,240,244],{kind:"thing",lw:1.4});}
function gv_paintPosterClose(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.data,{kind:"plaster",line:false,seed:75});
  gv_lightGlow(ctx,960,-60,900);const [x,y,w,h]=GV_PC;gv_poster(ctx,x,y,w,h);}

// Planning's office: a big screen on the wall, a desk, a window.
const GV_PL={fy:856,screen:[560,172,700,390],win:[1500,150,320,430],desk:[90,668,470]};
function gv_paintPlanning(ctx){const P=GV_PL,wall=GV_ROOM.plan;gv_wallFloor(ctx,wall,P.fy,{seed:31,vx:900});gv_lightGlow(ctx,900,0,520);
  gv_window(ctx,P.win[0],P.win[1],P.win[2],P.win[3],{wall,seed:14,tx:0.3});gv_monitor(ctx,P.screen[0],P.screen[1],P.screen[2],P.screen[3],{stand:false});
  gv_chair(ctx,330,P.desk[1]-128,{col:[90,110,96]});gv_desk(ctx,P.desk[0],P.desk[1],P.desk[2],P.fy+6,{});gv_monitor(ctx,250,476,180,124);gv_plant(ctx,1400,P.fy,0.9);}

// The registrar's office: shelves of archive boxes, a desk, a window.
const GV_RG={fy:856,shelf:[70,520],desk:[700,664,640],win:[1530,150,300,430]};
function gv_paintRegistrar(ctx){const G=GV_RG,wall=GV_ROOM.reg;gv_wallFloor(ctx,wall,G.fy,{seed:41,vx:1000});gv_lightGlow(ctx,1000,0,520);
  gv_window(ctx,G.win[0],G.win[1],G.win[2],G.win[3],{wall,seed:16,tx:0.55});
  gv_bookcase(ctx,G.shelf[0],G.fy,G.shelf[1],680,[350,520,690],{col:[176,150,120]});
  const R=wc_rng(4);for(const sy of [350,520,690])for(let i=0;i<4;i++){const bx=G.shelf[0]+34+i*118;wc_part(ctx,wc_rect(bx,sy-118,104,118),[[214,200,170],[196,186,160],[222,210,184]][i%3],1);
    wc_flat(ctx,wc_rect(bx+28,sy-90,48,28),WC_CARD,1,"label");if(R()<0.5)wc_flat(ctx,wc_rect(bx+40,sy-40,24,10),wc_dim([196,186,160],0.4),1,"hole");}
  gv_chair(ctx,1020,G.desk[1]-128,{col:[70,84,120]});gv_desk(ctx,G.desk[0],G.desk[1],G.desk[2],G.fy+6,{});gv_plant(ctx,1440,G.fy,0.85);}

// Yusuf's desk from above, for the papers on it: oak with its grain, a mug, a pencil, the edge of a keyboard
function gv_paintDesk(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.oak,{kind:"plaster",line:false,seed:51});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(3);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(GV.oak,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(1500,-40,460,120),[226,228,234],1);for(let i=0;i<9;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1516+i*48,-24+j*44,40,36),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(150,140,82,82,40),[236,240,244],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(150,140,62,62,40),[150,104,70],{kind:"thing",line:false});
  wc_part(ctx,[[1640,980],[1900,900],[1906,912],[1646,994]],[244,196,80],1);wc_flat(ctx,[[1900,900],[1930,892],[1906,912]],[60,54,58],1,"tip");}

/* ---------- things: paper painted once and kept, the words drawn every frame ---------- */
// a ring binder's spine, standing: its colour, a label near the top, a finger hole; kept per size and colour
function gv_binder(ctx,x,y,w,h,col,o){o=o||{};const c=wc_kept("binder|"+[w,h,col].join(","),w+24,h+24,q=>{q.translate(12,12);wc_wash(q,wc_rect(0,0,w,h),col,{kind:"cover",lw:1.4,seed:w+h});
    wc_flat(q,wc_rect(w*0.18,h*0.1,w*0.64,h*0.26),WC_CARD,1,"label");wc_wash(q,wc_ell(w/2,h*0.8,w*0.17,w*0.17,16),wc_dim(col,0.45),{kind:"thing",line:false,flat:true});});
  ctx.drawImage(c,x-12,y-12);}
// a sheet of paper, white, with a soft shadow; kept per size; o.rot turns it about its centre
function gv_sheetPaper(w,h,o){o=o||{};return wc_kept("sheet|"+w+"x"+h+"|"+(o.col||"w"),w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(70,60,50,0.22)";q.fillRect(6,10,w,h);q.restore();
  wc_wash(q,wc_rect(0,0,w,h),o.col||GV.paper,{kind:"page",lw:1.4,seed:w*3+h});});}
function gv_sheet(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);if(o.rot)ctx.rotate(o.rot);ctx.drawImage(gv_sheetPaper(w,h,o),-w/2-20,-h/2-20);ctx.restore();}
// a typed line on paper: a grey bar, for the lines no one needs to read
function gv_lines(ctx,x,y,w,n,gap,a){ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.32*(a==null?1:a));for(let i=0;i<n;i++)ctx.fillRect(x,y+i*gap,w*(i===n-1?0.6:0.92+0.08*Math.sin(i*7)),5);ctx.restore();}
// what a screen shows: a light panel with a title bar; fn draws the rest
function gv_screen(ctx,x,y,w,h,title,fn,o){o=o||{};ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.fillStyle=rgba(o.bar||[70,96,140],1);ctx.fillRect(x,y,w,o.barH||40);
  if(title)wc_T(ctx,title,x+18,y+(o.barH||40)*0.72,{w:700,size:o.titleSize||28,col:[255,255,255]});if(fn)fn(ctx);ctx.restore();}
// a speech bubble: a paper card with a pencil edge and a tail towards (tx,ty); k springs it in
function gv_say(ctx,x,y,lines,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||32,lh=Math.round(sz*1.3),w=Math.round(Math.max(...lines.map(l=>tw(ctx,l,sz,o.w||700)))+sz*1.5),
    h=Math.round(lines.length*lh+sz*0.9),k=o.k==null?1:o.k,bx=clamp(tx,x+40,x+w-40),by=ty<y?y:y+h;
  withA(ctx,a,()=>{ctx.save();ctx.translate(tx,ty);ctx.scale(k,k);ctx.translate(-tx,-ty);
    ctx.beginPath();ctx.moveTo(bx-20,by);ctx.lineTo(tx,ty);ctx.lineTo(bx+20,by);ctx.closePath();ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2;ctx.stroke();
    wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.22,seed:o.seed||(w+h)});ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(bx-17,by-(ty<y?-1:3),34,4);
    lines.forEach((l,i)=>wc_T(ctx,l,x+sz*0.75,y+sz*0.5+lh*(i+0.74),{w:o.w||700,size:sz,col:WC_DARK}));ctx.restore();});return w;}
// a push pin, seen from the front
function gv_pin(ctx,x,y,col,s){s=s||1;ctx.save();ctx.fillStyle="rgba(60,50,40,0.25)";ctx.beginPath();ctx.ellipse(x+3*s,y+5*s,9*s,5*s,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,9*s,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(wc_dim(col,0.35),0.8);ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle="rgba(255,255,255,0.65)";ctx.beginPath();ctx.arc(x-3*s,y-3*s,3*s,0,TAU);ctx.fill();ctx.restore();}
// a card pinned to a board: paper, a pin at the top, lines of text; o.wash tints it
function gv_card(ctx,x,y,w,h,lines,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.3,seed:o.seed||(x|0)});const sz=o.size||28;
  lines.forEach((l,i)=>{const big=i===0&&o.head!==false;wc_T(ctx,l,x+(o.align==="center"?w/2:22),y+(o.y0||46)+i*(sz+12),{w:big?800:600,size:big?(o.headSize||sz+2):sz,col:big?WC_DARK:WC_INK,align:o.align});});
  if(o.pin!==false)gv_pin(ctx,x+w/2,y+12,o.pinCol||GV.red);}
// a rubber stamp's impression: the word in ink inside a double rule, landing a little large and settling (p 0 to 1), uneven where it
// pressed less
function gv_stampRule(w,h,col){return wc_kept("stamp|"+[w,h,col].join(","),w*2+20,h*2+20,q=>{q.scale(2,2);q.translate(5,5);
  wc_ink(q,wc_rrPts(0,0,w,h,8),true,3.6,col,0.9,41,0.6);wc_ink(q,wc_rrPts(7,7,w-14,h-14,5),true,1.8,col,0.85,43,0.6);q.globalCompositeOperation="destination-out";q.globalAlpha=0.45;q.drawImage(WC.blotch,-40,-30,w+120,h+90);});}
function gv_stamp(ctx,x,y,s,p,o){o=o||{};if(p<=0)return;const size=o.size||40,col=o.col||GV.redInk,w=Math.round(tw(ctx,s,size,800)+56),h=Math.round(size+36),k=lerp(1.35,1,1-Math.pow(1-clamp(p,0,1),3));
  ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(k,k);withA(ctx,clamp(p*1.4,0,1)*(o.a==null?1:o.a),()=>{ctx.drawImage(gv_stampRule(w,h,col),-w/2-5,-h/2-5,w+10,h+10);
    wc_T(ctx,s,0,size*0.36,{w:800,size,align:"center",col,a:0.88});});ctx.restore();}
// a question mark in gold, settling with a spring
function gv_qmark(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>{wc_glowAt(ctx,0,-s*0.3,s*0.9,[255,226,140],0.5);
  wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.goldInk});});ctx.restore();}
// a glow round something that lights up: a soft halo in a colour
function gv_halo(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;const r=Math.max(w,h)*0.7,g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.2,x+w/2,y+h/2,r);
  g.addColorStop(0,rgba(wc_lit(col,0.35),0.9));g.addColorStop(1,rgba(wc_lit(col,0.35),0));ctx.fillStyle=g;ctx.fillRect(x+w/2-r,y+h/2-r,r*2,r*2);ctx.restore();}
// a soft wash of colour over a shape, as something lights up (multiplied, so what's under it still shows)
function gv_tint(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.fillStyle=rgba(wc_lit(col,0.45),1);ctx.fillRect(x,y,w,h);ctx.restore();}

/* ---------- people moving ---------- */
// someone walking from x0 to x1 from t0 at v px a second: where they are, the step's bob and swing, when they arrive, which way they face
function gv_walk(t,t0,x0,x1,v){const L=Math.abs(x1-x0),T_=Math.max(0.3,L/(v||300)),u=clamp((t-t0)/T_,0,1),e=u<0.5?2*u*u:1-2*(1-u)*(1-u),moving=u>0&&u<1,ph=(t-t0)*Math.PI*3.4;
  return{x:lerp(x0,x1,e),moving,bob:moving?Math.abs(Math.sin(ph))*7*Math.sin(u*Math.PI):0,swing:moving?Math.sin(ph)*Math.sin(u*Math.PI):0,end:t0+T_,flip:x1<x0};}
// a person walking: the arms swing and the body bobs while they move
function gv_walker(ctx,id,w,y,s,o){o=o||{};const sw=w.swing;person(ctx,id,w.x,y-w.bob,s,Object.assign({pose:o.pose||"stand",pose2:w.moving&&!o.pose?(sw>0?"walkA":"walkB"):o.pose2,mix:w.moving&&!o.pose?Math.abs(sw):o.mix,flip:w.moving?w.flip:o.flip},o));}

/* ---------- title and end cards ---------- */
// the series' mark: three strokes, the colours of where a line of the binder can end up: green, it runs in the work; gold, a decision
// someone owns; grey, it can go
const GV_MARK=[GV.green,GV.gold,GV.grey];
function gv_mark(ctx,cx,cy,w,p,a){if(a<=0.01)return;const n=GV_MARK.length,sw=w/n;withA(ctx,a,()=>{GV_MARK.forEach((col,i)=>{const q=clamp(p*n*0.8-i*0.6,0,1);if(q<=0)return;
  const x=cx-w/2+i*sw,c=wc_kept("gvmark"+i+"|"+Math.round(sw),Math.round(sw+24),40,x2=>{wc_prep();wc_wash(x2,wc_resample(wc_rect(6,6,sw+10,26),8),col,{kind:"swatch",line:false,a:0.85,seed:31+i*7});});
  ctx.save();ctx.beginPath();ctx.rect(x-4,cy-30,(sw+30)*ease(q),60);ctx.clip();ctx.drawImage(c,x-6,cy-20);ctx.restore();});});}
function gv_title(ctx,S,t,t0,title,sub,line){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{wc_T(ctx,title,960,500,{w:800,size:92,align:"center",col:WC_DARK});gv_mark(ctx,960,566,420,(t-t0-0.6)/1.2,1);
    if(sub)wc_T(ctx,sub,960,660,{w:600,size:36,align:"center",col:WC_MUTED});withA(ctx,fin(t,t0+1.2,0.8),()=>wc_tag(ctx,960,748,line,{align:"center",size:28,w:600}));});}
function gv_end(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wc_T(ctx,line,960,420,{w:700,size:48,align:"center",col:WC_DARK});gv_mark(ctx,960,520,360,(t-t0-0.7)/1.0,1);wc_T(ctx,title,960,622,{w:800,size:44,align:"center",col:WC_DARK});
    wc_T(ctx,(n?n+" · ":"")+"data governance · Learning Data",960,680,{w:600,size:28,align:"center",col:WC_MUTED});});}
