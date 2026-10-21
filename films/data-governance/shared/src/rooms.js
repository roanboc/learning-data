/* ===== The data governance series: the university's rooms, in watercolour =====
   The series paints with the master and reference data series' watercolour (its shared/src/wash.js and people.js, bundled as they
   are), so the two series look like one university. This file adds what the governance films need, all of it the university's own:
   the campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data
   governance, the data team, the platform team), the rooms where the numbers are made, and a desk seen from above for the papers;
   the places the later films share (the stewards' meeting room, the registrar's, the platform team's and a faculty analyst's desks
   close up, and Noor's room with her architecture map); then the things on their walls and desks (binders, papers, screens, cards,
   pins, stamps, speech bubbles), a camera that cuts between shots, and the series' title and end cards. The places are painted
   once and kept (finish.js); only what moves is drawn every frame.
   Every name starts with gv_ or GV, because every file of the film shares one script. */

/* ---------- colours ---------- */
// what the colours mean: gold is governance's decisions (and, behind a person, the business side, as in the master data series); cyan
// the technical side; green what runs in the work; grey what can go; red what nobody owns yet
const GV={gold:[236,170,34],goldInk:[146,96,0],green:[40,160,96],greenInk:[22,120,68],grey:[148,156,170],greyInk:[88,94,108],red:[204,62,50],redInk:[176,40,34],
  cyanInk:[24,104,168],wood:[198,152,106],woodDark:[146,104,72],oak:[222,186,138],cork:[208,166,114],metal:[166,172,184],bezel:[60,64,78],glass:[198,222,238],
  floor:[214,196,170],corridor:[230,224,212],ceiling:[246,242,234],chair:[84,92,112],paper:[253,252,248],screen:[248,250,252]};
// each room's walls: governance warm cream, Planning sage, the registrar's office blue, the data team lilac, the platform team pale teal;
// the meeting room a quiet stone, Noor's room a pale rose, a faculty's office in the old building warm plaster over dark panelling,
// and the learning team's office (Tom's) a soft apricot
const GV_ROOM={gov:[244,230,204],plan:[218,230,206],reg:[212,222,238],data:[226,218,238],plat:[206,230,226],meet:[228,224,214],noor:[238,222,224],fac:[242,228,204],learn:[248,218,192]};
// colours several films share, each with an ink for words on it: the three meanings of award (Who decides, One word, one home):
// violet the glossary's words, rose the words before Monday, olive degrees only; and the classes of personal data (Who may see it):
// plum for direct, a paler plum for pseudonymous (still personal, so the same family), plain paper for none
const GV_MEAN={violet:[110,92,190],rose:[214,96,140],olive:[150,156,56]},GV_MEANINK={violet:[78,58,160],rose:[168,50,98],olive:[94,100,22]};
const GV_CLASS={direct:[146,52,112],pseudonymous:[214,160,198],none:[250,248,242]},GV_CLASSINK={direct:[112,30,84],pseudonymous:[150,84,130]};

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

/* ---------- people at a table or a desk ---------- */
// a person behind a table or a desk, cut off at its top (cutY), which the place's front layer then draws over them: sitting, the
// top 230·s px of them shows above it (head, shoulders, chest); standing (o.standing), the top 330·s px, from the hips up
const GV_SIT=335,GV_STAND=235;
function gv_behind(ctx,id,x,cutY,s,o){o=o||{};ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,cutY+(o.standing?GV_STAND:GV_SIT)*s,s,o);ctx.restore();}

/* ---------- the places the later films share ---------- */
// painted once for every film after the first, so no film changes them for itself
// sticky notes, in four colours
const GV_NOTE=[[252,224,118],[246,178,190],[170,208,240],[184,224,168]];
// a sticky note, square, with two scribbled lines on it (nobody needs to read them)
function gv_note(ctx,x,y,s,col,rot,seed){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.fillStyle="rgba(70,60,50,0.16)";ctx.fillRect(-s/2+3,-s/2+5,s,s);
  wc_wash(ctx,wc_rect(-s/2,-s/2,s,s),col,{kind:"swatch",seed:seed||(x|0)});ctx.strokeStyle=rgba(wc_dim(col,0.55),0.55);ctx.lineWidth=Math.max(1.4,s/26);ctx.lineCap="round";
  const R=wc_rng(seed||(x|0));for(let i=0;i<2;i++){const ly=-s*0.16+i*s*0.24;ctx.beginPath();ctx.moveTo(-s*0.32,ly);for(let k=1;k<=6;k++)ctx.lineTo(-s*0.32+k*s*(0.1+R()*0.012)*(i?0.8:1),ly+(R()-0.5)*s*0.05);ctx.stroke();}ctx.restore();}
// a pendant lamp hanging from the ceiling: its cord, a shade, and the light under it
function gv_pendant(ctx,x,y,s){s=s||1;ctx.save();ctx.strokeStyle=rgba([70,66,64],0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
  wc_part(ctx,[[x-12*s,y],[x+12*s,y],[x+60*s,y+46*s],[x-60*s,y+46*s]],[60,82,74],1,{lw:1.4});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y+56*s,150*s,[255,240,200],0.42);ctx.restore();}
// a mug on a desk or table, its handle to one side
function gv_mug(ctx,x,y,col,flip){const k=flip?-1:1;wc_wash(ctx,[[x+k*22,y-44],[x+k*38,y-40],[x+k*38,y-18],[x+k*22,y-14]],col,{kind:"thing",lw:1.2,bare:true});
  wc_part(ctx,wc_rect(x-24,y-54,48,54),col,1,{lw:1.3});wc_flat(ctx,wc_ell(x,y-54,24,6,16),wc_dim(col,0.3),1,"rim");}
// a closed notebook lying on a table, seen from the front: a thin block, its cover, an elastic band
function gv_book(ctx,x,y,w,col){wc_part(ctx,wc_rect(x,y-14,w,14),col,1,{lw:1.2});wc_flat(ctx,wc_rect(x+w*0.8,y-14,6,14),wc_dim(col,0.4),1,"band");}

// The meeting room where the stewards meet: a whiteboard of sticky notes, a screen for those who join from elsewhere, two lamps over
// a long table, a window. People sit behind the table (gv_behind at GV_MT.top), and the table is the place's front layer
// (gv_paintMeetingTable, kept like a place: list both in the film's WC_PLACES and draw the table after the people). GV_MT says where
// everything is: the five seats along the table, and a spot to stand at the board, for people at scale s.
const GV_MT={fy:856,board:[110,148,660,388],screen:[934,170,540,304],win:[1610,150,260,420],top:752,table:[290,1340],seats:[480,720,960,1200,1440],stand:[190,905],s:0.8};
function gv_paintMeeting(ctx){const M=GV_MT,wall=GV_ROOM.meet;gv_wallFloor(ctx,wall,M.fy,{seed:81,vx:960});gv_lightGlow(ctx,660,0,560);gv_lightGlow(ctx,1260,0,560);
  gv_window(ctx,M.win[0],M.win[1],M.win[2],M.win[3],{wall,seed:24,tx:0.42});
  // the whiteboard: three groups of notes, and room on its left for what a film adds
  const [bx,by,bw,bh]=M.board;wc_part(ctx,wc_rect(bx-10,by-10,bw+20,bh+20),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  const R=wc_rng(14);[[bx+300,by+40],[bx+420,by+40],[bx+540,by+40]].forEach(([gx,gy],g)=>{for(let i=0;i<5-(g%2);i++){const nx=gx+(i%2)*56+(R()-0.5)*8,ny=gy+30+Math.floor(i/2)*64+(R()-0.5)*6;
    gv_note(ctx,nx,ny,50,GV_NOTE[(g+i)%4],(R()-0.5)*0.12,30+g*7+i);}});
  ctx.save();ctx.strokeStyle=rgba([60,110,170],0.6);ctx.lineWidth=3.4;ctx.lineCap="round";for(const [lx,ly,lw] of [[bx+290,by+22,84],[bx+410,by+22,70],[bx+530,by+22,90]]){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly+2);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(bx+bw*0.3,by+bh+10,bw*0.4,12),GV.metal,1);for(const [mx,c] of [[bx+bw*0.36,[204,62,50]],[bx+bw*0.42,[60,110,170]],[bx+bw*0.48,[40,140,90]]])wc_flat(ctx,wc_rect(mx,by+bh+2,34,10),c,1,"marker");
  // the screen on the wall, and the lamps over the table
  const [sx,sy,sw,sh]=M.screen;wc_part(ctx,wc_rect(sx-12,sy-12,sw+24,sh+24),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(sx,sy,sw,sh),[230,234,240],1,"screen");
  gv_pendant(ctx,720,96,1);gv_pendant(ctx,1200,96,1);
  // the chairs' backs along the far side of the table
  M.seats.forEach((x,i)=>{wc_part(ctx,wc_rrPts(x-70,M.top-150,140,170,30),[74,84,104],1,{seed:90+i});wc_flat(ctx,wc_rect(x-50,M.top-128,100,8),wc_lit([74,84,104],0.18),1,"seam");});
  gv_plant(ctx,1896,M.fy,0.95);}
// the table, over the people sitting at it: its top, its edge, the panel under it to the floor, and what's on it (a jug of water and
// glasses, notebooks, a plate of biscuits, a box of markers), each between two seats
function gv_paintMeetingTable(ctx){const M=GV_MT,[x0,w]=M.table,top=M.top,col=GV.oak;
  wc_contact(ctx,x0-30,x0+w+30,976,0.9,0.34);
  wc_part(ctx,wc_rect(x0+44,top+56,w-88,920-top-56),wc_dim(col,0.26),1);for(const lx of [x0+16,x0+w-58])wc_part(ctx,wc_rect(lx,top+56,42,976-top-56),wc_dim(col,0.32),1);
  wc_part(ctx,wc_rect(x0,top,w,40),wc_lit(col,0.12),1);wc_part(ctx,wc_rect(x0-6,top+38,w+12,20),wc_dim(col,0.06),1);
  // between the seats: the jug and two glasses, notebooks, biscuits, markers
  const S=M.seats,mid=i=>(S[i]+S[i+1])/2,ty=top+26;
  wc_part(ctx,[[mid(0)-30,ty],[mid(0)+30,ty],[mid(0)+34,ty-96],[mid(0)+20,ty-110],[mid(0)-26,ty-110],[mid(0)-34,ty-96]],[214,230,236],1,{kind:"thing",lw:1.3});
  wc_flat(ctx,[[mid(0)-30,ty-4],[mid(0)+30,ty-4],[mid(0)+32,ty-62],[mid(0)-32,ty-62]],[176,208,222],1,"water");
  for(const gx of [mid(0)+60,mid(1)-60]){wc_part(ctx,wc_rect(gx-16,ty-52,32,52),[226,236,240],1,{kind:"thing",lw:1.1});wc_flat(ctx,wc_rect(gx-14,ty-28,28,24),[186,214,226],1,"water");}
  gv_book(ctx,mid(1)-10,ty+6,96,[96,118,150]);gv_book(ctx,mid(1)-2,ty-8,84,[176,96,80]);
  wc_flat(ctx,wc_ell(mid(2),ty+2,74,12,24),[236,236,232],1,"plate");for(const [dx,dy] of [[-34,-8],[0,-12],[30,-8],[-14,-20],[16,-22]])wc_wash(ctx,wc_ell(mid(2)+dx,ty+dy,22,9,16),[212,164,104],{kind:"thing",lw:1});
  wc_part(ctx,wc_rect(mid(3)-46,ty-24,92,30),[226,218,204],1,{lw:1.2});[[204,62,50],[60,110,170],[40,140,90],[40,40,48]].forEach((c,i)=>wc_flat(ctx,wc_rect(mid(3)-38+i*20,ty-46,14,24),c,1,"marker"));}

// A desk close up, the camera at the height of someone sitting: the room's wall behind, the desk's top across the frame, and its
// front below. Shared by the registrar's office, the platform team's room and the faculty office: each paints its own wall and
// what's on it, then the desk (its front layer, drawn over whoever sits there with gv_behind at the place's top).
function gv_deskFront(ctx,top,col,drawers){wc_part(ctx,wc_rect(-40,top+44,W+80,H-top),wc_dim(col,0.2),1,{seed:top});
  wc_part(ctx,wc_rect(-40,top,W+80,52),wc_lit(col,0.1),1,{seed:top+3});wc_flat(ctx,wc_rect(-40,top+46,W+80,10),wc_dim(col,0.3),1,"edge");
  for(const [dx,dw] of drawers||[]){wc_part(ctx,wc_rect(dx,top+76,dw,H-top-60),wc_dim(col,0.12),1,{seed:dx|0});for(const hy of [top+150,top+250])wc_flat(ctx,wc_rect(dx+dw/2-40,hy,80,12),wc_dim(col,0.45),1,"handle");}}
// a screen standing on a desk whose top is at y: bezel, the screen itself, a neck and a foot
function gv_deskScreen(ctx,x,y,w,h,top){wc_part(ctx,[[x+w/2-26,y+h+10],[x+w/2+26,y+h+10],[x+w/2+34,top+12],[x+w/2-34,top+12]],GV.metal,1);
  wc_wash(ctx,wc_ell(x+w/2,top+16,130,14,30),wc_dim(GV.metal,0.06),{kind:"thing",lw:1.3});gv_monitor(ctx,x,y,w,h,{stand:false});}
// a keyboard and a mouse, flat on a desk whose top is at y
function gv_keys(ctx,x,top,w,mx){wc_part(ctx,[[x,top+40],[x+w,top+40],[x+w-10,top+18],[x+10,top+18]],[226,228,234],1,{lw:1.2});
  ctx.save();ctx.fillStyle=rgba([180,184,192],0.6);for(let i=0;i<14;i++)for(let j=0;j<2;j++)ctx.fillRect(x+18+i*(w-36)/14,top+22+j*8,(w-36)/14-4,5);ctx.restore();
  if(mx!=null)wc_wash(ctx,wc_ell(mx,top+30,22,13,20),[232,234,238],{kind:"thing",lw:1.2});}

// The registrar's office, close: Mei's desk. Behind it, the shelves of archive boxes, a framed degree with the university's seal, and
// the year's calendar with its dates marked; on the desk, a tray of certificates, the office's stamp, a screen and a mug. GV_RX: the
// desk's top, a seat for scale s, the screen (what it shows is drawn every frame), the frame and the calendar.
const GV_RX={top:792,seat:[560,1.7],screen:[1140,330,560,350],cert:[420,96,280,200],cal:[820,92,224,240]};
function gv_paintRegistrarClose(ctx){const X=GV_RX,wall=GV_ROOM.reg;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:43});gv_lightGlow(ctx,700,-60,760);
  // the shelves, at the left edge
  gv_bookcase(ctx,-60,X.top+40,400,X.top+120,[250,520,X.top-10],{col:[176,150,120]});
  for(const sy of [250,520,782])for(let i=0;i<3;i++){const bx=-22+i*112;wc_part(ctx,wc_rect(bx,sy-150,100,150),[[214,200,170],[196,186,160],[222,210,184]][(i+sy)%3],1);
    wc_flat(ctx,wc_rect(bx+26,sy-118,48,32),WC_CARD,1,"label");wc_flat(ctx,wc_rect(bx+38,sy-52,24,10),wc_dim([196,186,160],0.4),1,"hole");}
  // a degree in its frame: cream paper, a heading, lines of copperplate, the seal in red wax with its ribbon
  const [cx,cy,cw,ch]=X.cert;gv_frame(ctx,cx,cy,cw,ch);wc_flat(ctx,wc_rect(cx+18,cy+16,cw-36,ch-32),[248,240,220],1,"parchment");
  ctx.save();ctx.strokeStyle=rgba([90,70,50],0.55);ctx.lineCap="round";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+cw*0.3,cy+50);ctx.lineTo(cx+cw*0.7,cy+50);ctx.stroke();ctx.lineWidth=1.8;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(cx+48,cy+84+i*22);for(let k=0;k<=10;k++)ctx.lineTo(cx+48+k*(cw-96)/10*(i===3?0.6:1),cy+84+i*22+Math.sin(k*1.7+i)*2.2);ctx.stroke();}ctx.restore();
  wc_wash(ctx,[[cx+cw-82,cy+ch-40],[cx+cw-70,cy+ch+6],[cx+cw-62,cy+ch-28],[cx+cw-54,cy+ch+6],[cx+cw-42,cy+ch-40]],[176,40,34],{kind:"ribbon"});
  wc_wash(ctx,wc_ell(cx+cw-62,cy+ch-52,22,22,22),[186,52,44],{kind:"thing",lw:1.2});
  // the calendar: the month's grid, a few days ringed in red
  const [kx,ky,kw,kh]=X.cal;gv_pin(ctx,kx+kw/2,ky-4,GV.red,1.1);wc_flat(ctx,wc_rect(kx,ky,kw,kh),GV.paper,1,"page");wc_flat(ctx,wc_rect(kx,ky,kw,54),[96,118,150],1,"band");
  ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.35);for(let r=0;r<5;r++)for(let c=0;c<7;c++)ctx.fillRect(kx+16+c*30,ky+76+r*32,16,8);ctx.restore();
  for(const [c,r] of [[2,1],[4,3]]){ctx.save();ctx.strokeStyle=rgba([204,62,50],0.8);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(kx+24+c*30,ky+80+r*32,19,15,0.1,0,TAU);ctx.stroke();ctx.restore();}
  // a cabinet of drawers at the right, under the calendar
  wc_part(ctx,wc_rect(1740,560,260,X.top-560+20),[150,160,176],1);for(const dy of [588,668])wc_flat(ctx,wc_rect(1800,dy,80,12),[110,118,134],1,"handle");}
function gv_paintRegistrarDesk(ctx){const X=GV_RX,top=X.top;gv_deskFront(ctx,top,GV.oak,[[110,360],[1520,360]]);
  // the tray of certificates, each in its folder
  wc_part(ctx,wc_rect(120,top-34,260,44),[150,156,168],1,{lw:1.3});for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(132+i*6,top-58+i*6,236,12),[[248,240,220],[176,40,34],[248,240,220],[96,118,150]][i],1,"folder");
  // the office's stamp, on its pad of red ink
  wc_part(ctx,wc_rect(850,top-14,150,26),[70,72,80],1);wc_flat(ctx,wc_rect(862,top-16,126,10),[176,40,34],1,"ink");
  wc_part(ctx,wc_rect(1020,top-20,90,22),[60,52,48],1);wc_part(ctx,[[1046,top-20],[1084,top-20],[1078,top-64],[1052,top-64]],[150,104,70],1);wc_wash(ctx,wc_ell(1065,top-78,24,20,20),[150,104,70],{kind:"thing",lw:1.2});
  // the screen, its keyboard, a pot of pens, a mug
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+70,top,sw-140,sx+sw+30);
  wc_part(ctx,[[1744,top+8],[1784,top+8],[1780,top-50],[1748,top-50]],[96,118,150],1);for(const [px,a,c] of [[-14,-0.2,[60,60,70]],[-4,0.1,[204,62,50]],[6,0.25,[60,60,70]]]){ctx.save();ctx.translate(1764+px,top-48);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}
  gv_mug(ctx,1880,top+10,[226,214,190]);}

// The platform team's room, close: Sam's desk. The racks' edge at the left, the whiteboard behind him, two screens side by side
// (what each shows is drawn every frame), a mug, headphones. GV_PX: the desk's top, a seat for scale s, the two screens.
const GV_PX={top:792,seat:[1570,1.7],screens:[[250,344,500,320],[800,344,500,320]],board:[1330,66,546,390]};
function gv_paintPlatformClose(ctx){const X=GV_PX,wall=GV_ROOM.plat;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:63});gv_lightGlow(ctx,1100,-60,760);
  gv_rack(ctx,-50,60,230,X.top+20,9);gv_whiteboard(ctx,X.board[0],X.board[1],X.board[2],X.board[3]);
  // a printed sheet taped to the wall: the on-call rota (nobody needs to read it)
  gv_sheet(ctx,1080,110,150,196,{rot:0.03});gv_lines(ctx,1100,150,110,6,24,0.9);}
function gv_paintPlatformDesk(ctx){const X=GV_PX,top=X.top;gv_deskFront(ctx,top,[206,190,166],[[60,340],[1500,340]]);
  X.screens.forEach(([sx,sy,sw,sh])=>gv_deskScreen(ctx,sx,sy,sw,sh,top));gv_keys(ctx,600,top,440,1110);
  // headphones lying on the desk, and a mug
  ctx.save();ctx.strokeStyle=rgba([50,54,64],0.9);ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(1270,top+14,64,40,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();ctx.restore();
  for(const hx of [1210,1330])wc_wash(ctx,wc_ell(hx,top+16,24,18,18),[60,64,74],{kind:"thing",lw:1.2});
  gv_mug(ctx,160,top+10,[64,150,146],true);}

// A faculty's office in the old building, close: an analyst's desk beside a tall window. Warm plaster over dark panelling, journals on
// the shelves, a lamp for the early hours; on the desk, a screen (what it shows is drawn every frame), printouts under a closed
// laptop, a mug. GV_FX: the desk's top, a seat for scale s, the screen, the window, the lamp.
const GV_FX={top:800,seat:[1330,1.7],screen:[560,300,540,330],win:[60,40,420,600],lamp:[1690,800]};
function gv_paintFaculty(ctx){const X=GV_FX,wall=GV_ROOM.fac;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:91});
  // the panelling, from the dado rail down
  wc_part(ctx,wc_rect(-40,560,W+80,H-520),[128,94,66],1,{seed:92});wc_part(ctx,wc_rect(-40,548,W+80,22),[150,112,80],1);
  for(let i=0;i<7;i++)wc_flat(ctx,wc_rect(-20+i*290+30,600,230,180),[116,84,58],1,"panel");
  // the tall window, arched, onto the lawn and the newer building
  const [wx,wy,ww,wh]=X.win;ctx.save();wc_tr(ctx,wc_arched(wx,wy,ww,wh));ctx.clip();const hz=wy+wh*0.66;wc_sky(ctx,hz,9,{clouds:2,cx:wx+10,cw:ww-60,cy:wy+60,ch:wh*0.2});
  wc_land(ctx,xx=>hz+4*Math.sin(xx/90),WCP.far,0.3,{line:false});wc_part(ctx,wc_rect(wx+ww*0.46,hz-wh*0.24,ww*0.5,wh*0.24+8),WCP.concrete,0.4);
  for(let r=0;r<2;r++)wc_part(ctx,wc_rect(wx+ww*0.5,hz-wh*0.2+r*wh*0.1,ww*0.42,wh*0.05),WCP.glass,0.4,{kind:"glass"});
  wc_land(ctx,xx=>hz+30+5*Math.sin(xx/110),WCP.lawn,0.5,{line:false});wc_roundTree(ctx,wx+ww*0.22,hz+40,wh*0.4,0.5);ctx.restore();
  const A=wc_arched(wx,wy,ww,wh);wc_ink(ctx,A,true,3,WC_INK,0.6,93,1.2);for(const r of [wc_rect(wx+ww/2-7,wy,14,wh),wc_rect(wx,wy+wh*0.5-7,ww,14),wc_rect(wx,wy+wh*0.26-6,ww,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.3});
  wc_wash(ctx,wc_rect(wx-30,wy+wh,ww+60,26),[226,212,190],{kind:"trim",lw:1.5});
  // shelves of journals at the right
  gv_bookcase(ctx,1500,X.top+40,480,X.top+80,[270,540],{col:GV.woodDark});const R=wc_rng(17);for(const sy of [270,540]){let bx=1530;while(bx<1960){const bw=24+R()*20,bh=120+R()*60;
    wc_part(ctx,wc_rect(bx,sy-bh,bw,bh),[[150,90,80],[96,118,150],[120,140,104],[196,170,120],[118,96,140]][Math.floor(R()*5)],1,{lw:1.1});bx+=bw+3;}}
  // a pinboard: the faculty's timetable and two notices
  gv_cork(ctx,640,110,420,150,12);gv_sheet(ctx,660,124,180,120,{rot:-0.02});gv_lines(ctx,676,148,148,4,22,0.9);gv_note(ctx,900,170,64,GV_NOTE[0],0.05,71);gv_note(ctx,990,180,64,GV_NOTE[2],-0.06,72);}
function gv_paintFacultyDesk(ctx){const X=GV_FX,top=X.top;gv_deskFront(ctx,top,[176,128,88],[[1460,380]]);
  // a stack of printouts, a closed laptop on them, a plant on the sill
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(150+i*3,top-8-i*7,250,9),i%2?[244,242,236]:[250,250,246],1,"paper");wc_part(ctx,wc_rect(170,top-60,220,16),GV.metal,1,{lw:1.2});
  gv_plant(ctx,420,X.win[1]+X.win[3]+2,0.45);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+60,top,sw-120,sx+sw+30);
  gv_mug(ctx,470,top+10,[204,86,70]);
  // the lamp: a weighted base, two arms, the shade turned down onto the desk, and its pool of light
  const [ax,ay]=X.lamp;ctx.save();ctx.beginPath();ctx.rect(ax-420,top,640,46);ctx.clip();ctx.globalCompositeOperation="screen";ctx.translate(ax-170,top+22);ctx.scale(1,0.22);wc_glowAt(ctx,0,0,260,[255,236,190],0.55);ctx.restore();
  wc_part(ctx,wc_ell(ax,ay+4,56,14,24),[60,64,72],1);ctx.save();ctx.strokeStyle=rgba([60,64,72],0.95);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+30,ay-200);ctx.lineTo(ax-90,ay-300);ctx.stroke();ctx.restore();
  wc_part(ctx,[[ax-90,ay-320],[ax-60,ay-300],[ax-130,ay-220],[ax-200,ay-250]],[60,64,72],1,{lw:1.3});}

// Noor's room: the architecture map that fills its wall, her desk and screens, a shelf. GV_NR says where each is. gv_map paints the
// map at any size: one band for each of its layers, in the colours The map before the data gives them, and in each a few of the
// cards already on it. A film pins its own cards in a band's free part (gv_mapFree), here or on the map close up (GV_MC).
const GV_LAYERS=[["Motivation",[200,186,255]],["Strategy",[245,206,140]],["Business",[255,234,130]],["Information",[255,186,150]],["Application",[140,214,255]],["Technology",[160,224,140]]];
const GV_NR={fy:856,board:[100,104,1220,640],desk:[1430,668,440],mon:[[1460,476,180,124],[1666,476,180,124]],shelf:[1440,150,420]};
// band i of a map drawn at [x, y, w, h], and the part of it that's still free, right of the cards already there
function gv_mapBand(x,y,w,h,i){const g=h*0.016,bh=(h-g*7)/6;return[x+g,y+g+i*(bh+g),w-2*g,bh];}
function gv_mapFree(x,y,w,h,i){const [bx,by,bw,bh]=gv_mapBand(x,y,w,h,i);return[bx+bw*0.58,by,bw*0.42,bh];}
function gv_map(ctx,x,y,w,h,o){o=o||{};const k=w/1600;wc_part(ctx,wc_rect(x-12*k,y-12*k,w+24*k,h+24*k),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[250,250,247],1,"board");
  const R=wc_rng(23);GV_LAYERS.forEach(([nm,col],i)=>{const [bx,by,bw,bh]=gv_mapBand(x,y,w,h,i);wc_wash(ctx,wc_rect(bx,by,bw,bh),wc_lit(col,0.66),{kind:"swatch",seed:40+i,a:0.8});
    if(o.labels!==false)wc_hand(ctx,nm,bx+18*k,by+bh*0.5+12*k,{size:34*k,w:700,col:wc_dim(col,0.66)});
    const n=2+(i%2),cw=bw*0.1,ch=bh*0.58;for(let j=0;j<n;j++){const cx=bx+bw*0.17+j*(cw+bw*0.035),cy=by+(bh-ch)/2+(R()-0.5)*bh*0.08;
      wc_panel(ctx,cx,cy,cw,ch,{kind:"card",wash:col,washA:0.4,seed:60+i*5+j});
      ctx.save();ctx.strokeStyle=rgba(wc_dim(col,0.62),0.55);ctx.lineWidth=Math.max(1.2,2.4*k);ctx.lineCap="round";for(let l=0;l<2;l++){ctx.beginPath();ctx.moveTo(cx+cw*0.16,cy+ch*(0.42+l*0.24));ctx.lineTo(cx+cw*(l?0.62:0.84),cy+ch*(0.42+l*0.24));ctx.stroke();}ctx.restore();
      gv_pin(ctx,cx+cw/2,cy+6*k,wc_dim(col,0.3),Math.max(0.45,0.9*k));}});}
function gv_paintNoor(ctx){const N=GV_NR,wall=GV_ROOM.noor;gv_wallFloor(ctx,wall,N.fy,{seed:101,vx:900});gv_lightGlow(ctx,700,0,620);
  gv_map(ctx,N.board[0],N.board[1],N.board[2],N.board[3],{labels:false});
  // her shelf: books and two box files
  const [hx,hy,hw]=N.shelf;wc_part(ctx,wc_rect(hx,hy,hw,14),GV.wood,1);const R=wc_rng(31);let bx=hx+12;while(bx<hx+hw-120){const bw=22+R()*18,bh=90+R()*44;wc_part(ctx,wc_rect(bx,hy-bh,bw,bh),[[118,96,140],[96,118,150],[150,90,80],[120,140,104]][Math.floor(R()*4)],1,{lw:1.1});bx+=bw+3;}
  wc_part(ctx,wc_rect(hx+hw-110,hy-110,46,110),[176,150,120],1);wc_part(ctx,wc_rect(hx+hw-60,hy-110,46,110),[176,150,120],1);
  gv_chair(ctx,1670,N.desk[1]-128,{col:[110,84,100]});gv_desk(ctx,N.desk[0],N.desk[1],N.desk[2],N.fy+6,{});N.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));gv_plant(ctx,1386,N.fy,0.8);}
// the map close: the board filling the frame, each band with its name
const GV_MC=[150,56,1620,830];
function gv_paintMapClose(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.noor,{kind:"plaster",line:false,seed:105});
  gv_lightGlow(ctx,960,-80,900);const [x,y,w,h]=GV_MC;gv_map(ctx,x,y,w,h);}

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
// a column's class of personal data, as a chip with its word, beside the column (as Who may see it draws it): GV_CLASS's plum, paler
// plum or plain paper; returns its width. gv_classChipAt brings one in at t0, landing a little large and settling
function gv_classChip(ctx,x,y,cls,o){o=o||{};const s=o.size||28,w=Math.round(tw(ctx,cls,s,700)+44),h=s+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"chip",fill:GV_CLASS[cls],seed:cls.length+3});wc_T(ctx,cls,x+22,y+s*0.36,{w:700,size:s,col:cls==="direct"?[255,255,255]:WC_DARK});return w;}
function gv_classChipAt(ctx,t,t0,x,y,cls,o){const u=fin(t,t0,0.4);if(u<=0)return;const k=lerp(1.25,1,spring(fin(t,t0,0.55)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(u*2,0,1),()=>gv_classChip(ctx,0,0,cls,o));ctx.restore();}
// a mask over a value: a plum band with *** in white, sliding in from the left as u goes 0 to 1. The band is laid on solid plum first,
// so nothing of the value shows through it
function gv_mask(ctx,x,y,w,h,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1)),s=o.size||28;ctx.save();ctx.beginPath();ctx.rect(x-10,y-10,(w+20)*e,h+20);ctx.clip();
  ctx.fillStyle=rgba(GV_CLASS.direct,1);wc_tr(ctx,wc_rrPts(x+2,y+2,w-4,h-4,10));ctx.fill();wc_panel(ctx,x,y,w,h,{kind:"card",fill:GV_CLASS.direct,seed:(w+h)|0});wc_T(ctx,"***",x+18,y+h/2+s*0.5,{w:800,size:s+4,f:"mono",col:[255,255,255]});ctx.restore();}

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
