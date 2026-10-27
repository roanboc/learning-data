/* ===== A hub at work: the places and the pictures =====
   The places are painted once and kept (post.js): Mei's office on a Monday morning, seen over her shoulder, with the hub on her
   monitor, and the same office on Friday evening; Leila's office in admissions on Friday afternoon, where she checks the week; the
   hub's screen, full frame; a street on Saturday, where Rafael applies; and paper, with a little sky and land, for the chapters that
   explain. The pictures are the film's own: the rules the series wrote, the weekend's changes and how the rules sorted them, Mei's
   inbox, the application that waits instead of making a new number, the waterfall of weights, the AI helper's draft, Mei's decision
   and its versions, the published change and the systems that read it, Rafael's record with a source on every value, the Friday check
   and the office's rule, and the five questions. The hub's screens are drawn for this film, in its own style: they're no product's.
   Every name starts with m8_ (this film) or M8_. */

/* ---------- the people ---------- */
// Rafael Souza graduated in 2019, and applies to come back: the person the data is about, so, like Linh, he has no side's colour
PEOPLE.rafael={name:"Rafael Souza",role:"Applicant",side:"Person",does:"uses",edge:[236,232,226],seed:31,
  skin:[196,148,112],hair:{style:"curly",c:[40,30,26]},
  top:{kind:"overshirt",c:[92,122,96],inner:[240,236,226]},bottom:{c:[60,72,98]},shoe:[236,236,240],build:{sh:72,hip:60,h:1.0}};
// a person from behind, from the waist up, as the character sheet's personBack draws one, with their own hair, smooth, not coiled:
// Mei's pulled up into a bun, Leila's long, down her back. The head is drawn a little smaller than the sheet's, as it's seen close
function m8_personBack(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],k=s*P.build.h,sw=P.build.sh,t=o.t||0,br=Math.sin(t*1.7+P.seed)*1.4;
  outlined(ctx,cx=>{
    limb(cx,[[-sw+6,-410],[-sw-6,-300]],32,30,darken(P.top.c,0.2),[-sw,-420,0,-300]);limb(cx,[[sw-6,-410],[sw+4,-300]],32,30,darken(P.top.c,0.2),[0,-420,sw,-300]);
    torsoPath(cx,P,br,0);litFill(cx,darken(P.top.c,0.15),-sw,-450,sw,-250);seam(cx,P.top.c,0.5);
    cx.strokeStyle=rgba(darken(P.top.c,0.45),0.6);cx.lineWidth=2;cx.beginPath();cx.moveTo(-24,-446+br);cx.quadraticCurveTo(0,-432+br,24,-446+br);cx.stroke();
    cx.strokeStyle=rgba(darken(P.top.c,0.4),0.35);cx.beginPath();cx.moveTo(0,-436+br);cx.lineTo(0,-260);cx.stroke();
    limb(cx,[[0,-472+br],[0,-446+br]],26,28,darken(P.skin,0.2),[-20,-470,20,-440]);
    const long=P.hair.style==="long";cx.save();cx.translate(0,-500+br);cx.scale(0.88,0.88);
    if(!long)for(const s of [-1,1]){ell(cx,s*42,4,7,12);litFill(cx,darken(P.skin,0.1),-50,-12,50,16);}
    headPath(cx);litFill(cx,darken(P.skin,0.1),-42,-56,42,51);cx.restore();
    // long hair falls over the neck and the ears; the crown goes on top
    if(long){cx.save();cx.translate(0,-500+br);cx.scale(0.9,0.9);m8_hairLong(cx,P);cx.restore();}
    cx.save();cx.translate(0,-500+br);cx.scale(0.88,0.88);m8_hairBack(cx,P);cx.restore();
  },x,y,k,o.edge||P.edge,[-140,-600,140,-240],o.glow);}
// the back of the head, crown to nape, and its strands; a bun high at the back, standing out of the outline so it reads. Long hair's
// crown runs on down into the hair that falls, so there's no nape to see
function m8_hairBack(cx,P){const c=P.hair.c,hl=lighten(c,0.3),bun=P.hair.style==="bun";
  cx.beginPath();cx.moveTo(0,-61);cx.bezierCurveTo(31,-61,47,-42,47,-12);
  if(P.hair.style==="long"){cx.lineTo(50,64);cx.lineTo(-50,64);cx.lineTo(-47,-12);}else{cx.bezierCurveTo(47,14,41,30,30,40);cx.quadraticCurveTo(0,50,-30,40);cx.bezierCurveTo(-41,30,-47,14,-47,-12);}
  cx.bezierCurveTo(-47,-42,-31,-61,0,-61);cx.closePath();
  litFill(cx,c,-47,-61,47,50);cx.strokeStyle=rgba(hl,0.3);cx.lineWidth=1.8;cx.lineCap="round";
  for(const s of [-1,1])for(const q of [0.3,0.62,0.92]){cx.beginPath();cx.moveTo(s*44*q,36-6*q);if(bun)cx.quadraticCurveTo(s*34*q,-6,s*7,-44);else cx.quadraticCurveTo(s*40*q,-20,s*10*q,-56);cx.stroke();}
  if(bun){ell(cx,0,-58,24,19);litFill(cx,darken(c,0.04),-24,-77,24,-39);cx.strokeStyle=rgba(hl,0.42);cx.lineWidth=2;cx.beginPath();cx.arc(0,-58,14,-2.7,-0.5);cx.stroke();cx.beginPath();cx.arc(1,-60,7,-2.5,-0.2);cx.stroke();}}
// long hair, behind the head, falling over the shoulders and down the back
function m8_hairLong(cx,P){const c=P.hair.c;cx.beginPath();cx.moveTo(-46,-14);cx.bezierCurveTo(-56,40,-62,96,-52,140);
  [[-38,150,-26,145],[-14,153,-2,147],[10,154,22,146],[36,151,52,140]].forEach(([a,b,x,y])=>cx.quadraticCurveTo(a,b,x,y));cx.bezierCurveTo(62,96,56,40,46,-14);cx.closePath();
  litFill(cx,c,-62,-14,62,152);cx.strokeStyle=rgba(lighten(c,0.26),0.28);cx.lineWidth=2;cx.lineCap="round";for(const dx of [-34,-16,4,22,38]){cx.beginPath();cx.moveTo(dx*0.8,40);cx.quadraticCurveTo(dx*1.05+4,92,dx*1.12,136);cx.stroke();}}

/* ---------- colours ---------- */
// the AI helper's draft: a cyan wash, the technical side's, with text dark enough to read on paper; a person's decision: gold
const M8_AI=WC_SIDE.tech,M8_AIINK=[26,100,156],M8_GOLD=WC_BADGE,M8_GOLDINK=[128,90,0],M8_GOLDLINE=[176,124,10];
// the systems wear their role's colour: the student system teal, HR violet, the research office coral, the alumni office green;
// an application, amber
const M8_SYS={student:["Student system","student"],hr:["HR","tutor"],research:["Research office","researcher"],alumni:["Alumni office","alumna"]};

/* ---------- the places ---------- */
// the monitor on the desk: its screen is 16:9, so when the camera moves in until it fills the frame, the hub's screen takes over
const M8_MON={x:752,y:124,w:928,h:522},M8_MCX=752+464,M8_MCY=124+261,M8_MZ=W/928,M8_MK=928/W;
// a clock on the wall: its face is painted with the room; its hands are drawn every frame, at h:m
const M8_CLK=[1836,156,60];
function m8_clockFace(ctx){const [x,y,r]=M8_CLK;wc_wash(ctx,wc_ell(x,y,r,r,40),WC_PAPER,{kind:"clock",lw:2.2});
  ctx.save();ctx.strokeStyle=rgba(WC_INK,0.85);ctx.lineCap="round";
  for(let i=0;i<12;i++){const a=i/12*TAU;ctx.lineWidth=i%3?2:3.4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*0.76,y+Math.sin(a)*r*0.76);ctx.lineTo(x+Math.cos(a)*r*0.9,y+Math.sin(a)*r*0.9);ctx.stroke();}ctx.restore();}
function m8_hands(ctx,h,m){const [x,y,r]=M8_CLK,ah=((h%12)+m/60)/12*TAU-Math.PI/2,am=m/60*TAU-Math.PI/2;ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineCap="round";
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ah)*r*0.48,y+Math.sin(ah)*r*0.48);ctx.stroke();
  ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(am)*r*0.72,y+Math.sin(am)*r*0.72);ctx.stroke();ctx.fillStyle=rgba(WC_INK,0.9);ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();ctx.restore();}
// the office: a wall, a window onto the campus on the left, a clock, and the standing desk with its monitor, the screen left dark for the
// hub to light. k: "mon", Mei's office on Monday morning, the sun soft on the wall; "eve", the same office on Friday evening, the light
// low and orange; "fri", Leila's office in admissions on Friday afternoon: a sage wall, her folders where Mei's plant is
function m8_officeAt(ctx,k){const P=WCP,fri=k==="fri",eve=k==="eve",late=fri||eve;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const wall=fri?mix(P.wallIn,[190,208,182],0.42):eve?mix(P.wallIn,[248,204,160],0.3):P.wallIn,warm=eve?[255,190,130]:[255,214,150];
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:fri?7:1});
  ctx.save();ctx.beginPath();ctx.rect(64,74,512,612);ctx.clip();
  wc_sky(ctx,560,fri?9:eve?5:4,{clouds:3,cx:80,cw:460,cy:110,ch:150,sun:fri?[520,250]:eve?[470,430]:[150,150]});
  if(late){ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,74,0,686);g.addColorStop(0,eve?"rgba(255,214,186,1)":"rgba(255,236,206,1)");g.addColorStop(1,eve?"rgba(255,170,120,1)":"rgba(255,214,170,1)");
    ctx.fillStyle=g;ctx.fillRect(64,74,512,612);ctx.restore();}
  wc_land(ctx,x=>596+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_quad(ctx,190,600,0.42,0.3);
  wc_roundTree(ctx,120,640,210,0.46);wc_roundTree(ctx,520,646,180,0.46,P.leaf2);ctx.restore();
  for(const r of [wc_rect(52,62,536,16),wc_rect(52,62,16,636),wc_rect(572,62,16,636),wc_rect(312,62,16,636),wc_rect(52,370,536,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(34,686,572,24),wc_dim(wall,0.1),{kind:"trim",lw:1.5});
  // the window's light on the wall: Monday's from the morning sun, soft; late in the day, low and warm, a long slant
  if(late){ctx.save();ctx.globalCompositeOperation="multiply";wc_wash(ctx,[[600,160],[700,150],[eve?760:730,720],[612,700]],warm,{kind:"chipwash",line:false,a:eve?0.5:0.42,seed:9});ctx.restore();}
  else wc_glowAt(ctx,320,300,420,[255,246,220],0.35);
  m8_clockFace(ctx);
  // the desk: its top, and its front edge
  wc_wash(ctx,[[-40,780],[W+40,772],[W+40,H+40],[-40,H+40]],P.wood,{kind:"build",lw:1.6,seed:21});
  wc_wash(ctx,[[-40,770],[W+40,762],[W+40,786],[-40,794]],wc_lit(P.wood,0.14),{kind:"trim",lw:1.2});
  // the keyboard, a mug, and Mei's plant or Leila's folders
  wc_wash(ctx,[[930,842],[1506,842],[1530,880],[906,880]],[220,220,226],{kind:"build",lw:1.3});
  const mx=fri?1640:1764;wc_wash(ctx,wc_rrPts(mx,700,70,84,10),fri?[176,204,226]:[246,242,234],{kind:"build",lw:1.5});wc_wash(ctx,wc_rect(mx+8,708,54,12),[150,104,70],{kind:"trim",line:false,flat:true});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=7;ctx.beginPath();ctx.arc(mx+74,742,17,-1.2,1.2);ctx.stroke();ctx.restore();
  if(fri){[[1746,738,[204,120,96]],[1752,718,[120,150,196]],[1742,698,[214,184,96]]].forEach(([x,y,c],i)=>wc_wash(ctx,wc_rrPts(x,y,164,22,4),c,{kind:"build",lw:1.3,seed:60+i}));}
  else{wc_wash(ctx,[[1862,700],[1910,700],[1900,780],[1872,780]],[196,118,88],{kind:"build",lw:1.4});
    const R=wc_rng(11),parts=[];for(let i=0;i<8;i++){const a=-Math.PI/2+(R()-0.5)*2.4,r=40+R()*40;parts.push(wc_ell(1886+Math.cos(a)*r*0.6,690+Math.sin(a)*r,12+R()*6,30+R()*10,16));}
    wc_wash(ctx,parts,P.leaf,{kind:"tree",lw:1.2});}
  // the monitor: its stand, its frame, and the screen, dark until the hub lights it
  wc_wash(ctx,wc_rect(1196,646,44,140),[78,82,96],{kind:"iron",lw:1.4});wc_wash(ctx,wc_ell(1218,786,110,16,30),[78,82,96],{kind:"iron",lw:1.4});
  wc_wash(ctx,wc_rrPts(736,108,960,554,14),[62,66,80],{kind:"build",lw:1.8,seed:5});
  wc_flat(ctx,wc_rect(752,124,928,522),[44,48,60],1,"screen");}
const m8_office=ctx=>m8_officeAt(ctx,"mon"),m8_eve=ctx=>m8_officeAt(ctx,"eve"),m8_friday=ctx=>m8_officeAt(ctx,"fri");
// the hub's screen, full frame: paper in a screen's cool light, and a header with the hub's name; drawn for this film, not a product's
function m8_hubGlyph(ctx,x,y,r,col){ctx.save();ctx.strokeStyle=rgba(col||WC_INK,0.9);ctx.fillStyle=rgba(col||WC_INK,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r*0.42,0,TAU);ctx.stroke();
  for(let i=0;i<4;i++){const a=i/4*TAU+Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*0.42,y+Math.sin(a)*r*0.42);ctx.lineTo(x+Math.cos(a)*r*0.82,y+Math.sin(a)*r*0.82);ctx.stroke();
    ctx.beginPath();ctx.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,r*0.2,0,TAU);ctx.fill();}ctx.restore();}
function m8_screen(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[236,242,250],{kind:"chipwash",line:false,a:0.3,seed:3});
  wc_wash(ctx,wc_rect(-40,-40,W+80,138),[192,206,228],{kind:"chipwash",line:false,a:0.5,seed:5});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,98);ctx.lineTo(W,98);ctx.stroke();ctx.restore();
  m8_hubGlyph(ctx,70,50,24);wc_T(ctx,"the hub",112,62,{w:800,size:36,col:WC_DARK});}
// the day and time, at the top right of the hub's screen
function m8_when(ctx,s){wc_T(ctx,s,1860,60,{w:500,size:28,f:"mono",align:"right",col:WC_INK});}
// Saturday: a street of terraced houses, a lamp and a tree, where Rafael applies on his phone
const M8_PAVE=772;
function m8_street(ctx){const P=WCP;wc_sky(ctx,700,6,{sun:[1560,150],clouds:4});
  wc_skyline(ctx,606,P.city,0.1,8);wc_treeRow(ctx,()=>622,-40,1980,60,64,0.24,13,P.leaf2);wc_land(ctx,x=>640+4*Math.sin(x/300),P.lawn,0.4);
  [[560,P.plaster],[780,P.brickHouse,P.blueDoor],[1000,P.blueHouse],[1220,P.plaster,P.blueDoor],[1440,P.brickHouse],[1660,P.blueHouse,P.blueDoor]].forEach(([x,c,d])=>wc_terrace(ctx,x,744,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[540,744],[W+60,744],[W+60,768],[530,768]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_wash(ctx,[[-60,M8_PAVE+6],[W+60,M8_PAVE-4],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.5);ctx.lineWidth=2;for(let i=0;i<7;i++){const y=812+i*i*6;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-8);ctx.stroke();}
  for(let i=-8;i<22;i++){ctx.beginPath();ctx.moveTo(960+i*60,M8_PAVE+2);ctx.lineTo(960+i*170,1080);ctx.stroke();}ctx.restore();
  wc_roundTree(ctx,150,770,330,0.5);wc_roundTree(ctx,420,752,220,0.48,P.leaf2);wc_lamp(ctx,1880,840,330,0.7);}
// paper, with a little sky and a strip of land, for the chapters that explain
function m8_plain(ctx){wc_sky(ctx,836,12,{clouds:3,cx:160,cw:1600});wc_land(ctx,x=>828+16*Math.sin(x/340+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>884+10*Math.sin(x/250+1),WCP.near,0.75,{line:false});}
const WC_PLACES={office:m8_office,eve:m8_eve,friday:m8_friday,screen:m8_screen,street:m8_street,plain:m8_plain};
function m8_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}

/* ---------- small things, used everywhere ---------- */
// a veil of paper over the whole frame, so what's drawn after it stands out
function m8_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// a name card: the name, and what they do
function m8_name(ctx,x,y,w,name,sub){wc_panel(ctx,x,y,w,112,{kind:"card"});wc_T(ctx,name,x+28,y+48,{w:800,size:32,col:WC_DARK});wc_T(ctx,sub,x+28,y+88,{w:600,size:28,col:WC_MUTED});}
// a score, in a pill centred on (x,y): ink for the rules', gold once it sits where a person decides (o.gold), dashed for one that might
// have been (o.dashed); returns its width
function m8_score(ctx,x,y,s,o){o=o||{};const w=Math.round(tw(ctx,s,30,500,"mono")+40);wc_panel(ctx,x-w/2,y-24,w,48,{kind:"pill",wash:o.gold?M8_GOLD:null,washA:0.6,dashed:o.dashed,role:o.dashed?WC_PENCIL:null,seed:s.length+3});
  wc_T(ctx,s,x,y+10,{w:500,size:30,f:"mono",align:"center",col:WC_DARK});return w;}
// a dot in a system's colour
function m8_dot(ctx,x,y,role,r){ctx.save();ctx.fillStyle=rgba(WC_ROLE[role],1);ctx.beginPath();ctx.arc(x,y,r||8,0,TAU);ctx.fill();ctx.restore();}
// a mouse pointer, its tip at (x,y); pressing (0..1) nudges it down, as a click does
function m8_cursor(ctx,x,y,a,press){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);const k=1-0.12*(press||0);ctx.scale(k,k);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,34);ctx.lineTo(9,26);ctx.lineTo(16,41);ctx.lineTo(22,38);ctx.lineTo(15,24);ctx.lineTo(27,24);ctx.closePath();
  ctx.fillStyle="#ffffff";ctx.fill();ctx.strokeStyle=rgba(WC_DARK,0.95);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.stroke();ctx.restore();});}
// pencil icons for the five questions, and for undo: explain (a waterfall), undo (a curved arrow), review (an eye), mask (a hatched
// field), publish (a pile of changes, one taken)
function m8_icon(ctx,k,x,y,s,col){s=s||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col||WC_PENCIL,0.95);ctx.fillStyle=rgba(col||WC_PENCIL,0.95);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";
  if(k==="explain"){[[-22,8,14],[-6,-4,12],[10,-12,8]].forEach(([bx,by,bw])=>{ctx.beginPath();ctx.rect(bx,by-6,bw,12);ctx.stroke();});ctx.beginPath();ctx.moveTo(-24,20);ctx.lineTo(24,20);ctx.stroke();}
  else if(k==="undo"){ctx.beginPath();ctx.arc(2,4,16,-Math.PI*0.95,Math.PI*0.55);ctx.stroke();ctx.beginPath();ctx.moveTo(-22,-6);ctx.lineTo(-14,6);ctx.lineTo(-4,-4);ctx.stroke();}
  else if(k==="review"){ctx.beginPath();ctx.moveTo(-24,0);ctx.quadraticCurveTo(0,-22,24,0);ctx.quadraticCurveTo(0,22,-24,0);ctx.stroke();ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();}
  else if(k==="mask"){ctx.beginPath();ctx.rect(-22,-14,44,28);ctx.stroke();ctx.save();ctx.beginPath();ctx.rect(-22,-14,44,28);ctx.clip();ctx.lineWidth=2;for(let i=-4;i<5;i++){ctx.beginPath();ctx.moveTo(i*10-14,16);ctx.lineTo(i*10+14,-16);ctx.stroke();}ctx.restore();}
  else if(k==="publish"){for(let i=0;i<3;i++){ctx.beginPath();ctx.rect(-22,-16+i*11,30,8);ctx.stroke();}ctx.beginPath();ctx.moveTo(12,-12);ctx.lineTo(26,-12);ctx.moveTo(20,-18);ctx.lineTo(26,-12);ctx.lineTo(20,-6);ctx.stroke();}
  ctx.restore();}

/* ---------- 1. Monday morning: the office, over Mei's shoulder ---------- */
// Mei, or Leila on Friday, from behind, from the waist up: drawn once and kept; it breathes a little as it's drawn each frame
const M8_BACK={x:470,top:300};
function m8_backFig(id){return wc_kept("back:"+id,840,960,q=>{const k=2.5*PEOPLE[id].build.h;m8_personBack(q,id,420,80+580*k,2.5,{t:0});});}
function m8_back(ctx,id,t,a){if(a!=null&&a<=0.01)return;const c=m8_backFig(id),br=Math.sin(t*1.7)*2.2;withA(ctx,a==null?1:a,()=>ctx.drawImage(c,M8_BACK.x-420,M8_BACK.top-80+br));}
// a screen of the hub, kept as a picture at full size, to show on the monitor: drawn by the same hand as the screens themselves
function m8_shot(key,paint){return wc_kept("shot:"+key,W,H,q=>{q.drawImage(wc_place("screen"),0,0);paint(q);});}
// the monitor showing a kept screen, lit as a goes 0 to 1
function m8_monitor(ctx,shot,a){if(a<=0.01)return;const M=M8_MON;withA(ctx,a,()=>ctx.drawImage(shot,M.x,M.y,M.w,M.h));}
// draws fn in the screen's own frame, onto the monitor: when the camera fills the frame with the monitor, it's at its full size
function m8_onMon(ctx,fn){ctx.save();ctx.translate(M8_MON.x,M8_MON.y);ctx.scale(M8_MK,M8_MK);fn();ctx.restore();}
// the rules the series wrote: two cards, as the films that wrote them
const M8_RULES=[["Film 2 of 9 · Who is it?","when two records are one person"],["Film 3 of 9 · Which value wins","which value each piece takes"]];
function m8_ruleCard(ctx,x,y,i){const [k,s]=M8_RULES[i],w=560,h=124;wc_panel(ctx,x,y,w,h,{kind:"card",seed:30+i});wc_T(ctx,k,x+28,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,s,x+28,y+92,{w:600,size:28,col:WC_INK});}

/* ---------- 1 and 2. this weekend, and how the rules sorted it ---------- */
// the four systems the changes came from, and how many from each: 1,240 in all
const M8_SRC=[["student",820],["hr",190],["research",60],["alumni",170]],M8_SX=96,M8_SW=470,M8_SY=[262,374,486,598],M8_SH=92;
function m8_source(ctx,i){const [k,n]=M8_SRC[i],[name,role]=M8_SYS[k],y=M8_SY[i];wc_panel(ctx,M8_SX,y,M8_SW,M8_SH,{kind:"card",role:WC_ROLE[role],sw:tw(ctx,name,30,800)+36,sy:22,sh:48,seed:40+i});
  wc_T(ctx,name,M8_SX+32,y+57,{w:800,size:30,col:WC_DARK});wc_T(ctx,String(n),M8_SX+M8_SW-28,y+57,{w:500,size:30,f:"mono",align:"right",col:WC_INK});}
// the weekend's title, and the total, counted up as n goes 0 to 1 (none drawn below 0)
function m8_weekendHead(ctx){wc_T(ctx,"This weekend",M8_SX,172,{w:800,size:40,col:WC_DARK});wc_T(ctx,"since Friday 18:00",M8_SX+tw(ctx,"This weekend",40,800)+24,172,{w:600,size:28,col:WC_MUTED});}
function m8_count(ctx,n){if(n<=0.001)return;const v=Math.round(1240*clamp(n,0,1));wc_T(ctx,v.toLocaleString("en")+" changes",M8_SX,226,{w:700,size:32,f:"mono",col:WC_INK});}
// the rules, as the hub runs them
const M8_RB={x:700,y:310,w:460,h:240};
function m8_rulesBox(ctx){const B=M8_RB;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"card",seed:12});m8_hubGlyph(ctx,B.x+52,B.y+56,22);wc_T(ctx,"the rules",B.x+90,B.y+68,{w:800,size:34,col:WC_DARK});
  wc_T(ctx,"same person?",B.x+40,B.y+136,{w:600,size:30,col:WC_INK});wc_T(ctx,"which value wins?",B.x+40,B.y+186,{w:600,size:30,col:WC_INK});}
// what came out: matched someone known, new people, too close to call; a bar for each, so "nearly all" can be seen
const M8_OUT=[["matched someone known",1180],["new people",52],["too close to call",8]],M8_OX=1300,M8_OW=540,M8_OY=[230,420,610],M8_OH=150;
function m8_outlet(ctx,i,p){const [label,n]=M8_OUT[i],y=M8_OY[i],gold=i===2;wc_panel(ctx,M8_OX,y,M8_OW,M8_OH,{kind:"card",wash:gold?M8_GOLD:null,washA:0.42,seed:50+i});
  wc_T(ctx,label,M8_OX+30,y+50,{w:700,size:30,col:WC_DARK});const v=Math.round(n*clamp(p,0,1));wc_T(ctx,v.toLocaleString("en"),M8_OX+M8_OW-30,y+116,{w:500,size:36,f:"mono",align:"right",col:WC_DARK});
  // the bar: its share of the 1,240, so "nearly all" can be seen; the count beside it
  const BW=M8_OW-190,bw=BW*Math.max(n/1240,0.012)*clamp(p,0,1);if(bw>1){ctx.save();ctx.fillStyle=rgba(gold?M8_GOLDLINE:WC_PENCIL,0.75);ctx.beginPath();rr(ctx,M8_OX+30,y+92,bw,24,6);ctx.fill();ctx.restore();}
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();rr(ctx,M8_OX+30,y+92,BW,24,6);ctx.stroke();ctx.restore();}
// the changes, as dabs of their system's colour, carried from each system into the rules and out to where they belong: about 120 of
// them stand for the 1,240. Each dab's system is drawn by lot, in proportion; where it goes is fixed, and it leaves in its turn within
// its group's window (win[out]: the seconds the narration gives that group)
const M8_DABS=(()=>{const o=[],n=[114,5,4];let id=0;n.forEach((k,j)=>{for(let i=0;i<k;i++){const h=hash(id,7),src=h<0.66?0:h<0.81?1:h<0.86?2:3;
  o.push({src,out:j,f:k>1?i/(k-1):0,dy:(hash(id,9)-0.5)*90,dy2:(hash(id,11)-0.5)*70});id++;}});return o;})();
const M8_TRAVEL=1.5,m8_leave=(d,win)=>win[d.out][0]+(win[d.out][1]-win[d.out][0])*d.f;
function m8_dabPos(d,u){const ys=M8_SY[d.src]+M8_SH/2,yo=M8_OY[d.out]+M8_OH/2,B=M8_RB,yb=B.y+B.h/2+d.dy;
  if(u<0.42){const v=u/0.42,p=[M8_SX+M8_SW+6,ys],q=[B.x-4,yb];return[lerp(p[0],q[0],v),lerp(p[1],q[1],ease(v))];}
  if(u<0.58)return null;const v=(u-0.58)/0.42,p=[B.x+B.w+4,B.y+B.h/2+d.dy2],q=[M8_OX-6,yo+d.dy2*0.4];return[lerp(p[0],q[0],v),lerp(p[1],q[1],ease(v))];}
function m8_dabs(ctx,t,win){for(const d of M8_DABS){const u=(t-m8_leave(d,win))/M8_TRAVEL;if(u<=0||u>=1)continue;const p=m8_dabPos(d,u);if(!p)continue;
  const col=WC_ROLE[M8_SYS[["student","hr","research","alumni"][d.src]][1]];ctx.save();ctx.fillStyle=rgba(col,0.85*clamp(u*8,0,1)*clamp((1-u)*8,0,1));ctx.beginPath();ctx.ellipse(p[0],p[1],8,7,0,0,TAU);ctx.fill();ctx.restore();}}
// how many of an outlet's dabs have arrived, 0 to 1
function m8_arrived(t,j,win){const ds=M8_DABS.filter(d=>d.out===j);return ds.filter(d=>t>=m8_leave(d,win)+M8_TRAVEL).length/ds.length;}
// Mei's inbox: the eight too close to call, the first four shown; the first holds up an application
const M8_INBOX=[["74","an application and a graduate","waiting: his application"],["81","an HR record and a student",""],["66","two applications",""],["88","two research records",""]];
const M8_IB={x:1150,y:136,w:700,h:640};
function m8_inbox(ctx,t,o){const B=M8_IB;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"card",seed:61});wc_panel(ctx,B.x+12,B.y+12,B.w-24,68,{kind:"card",wash:M8_GOLD,washA:0.55,seed:62});
  wc_T(ctx,"for Mei",B.x+36,B.y+58,{w:800,size:32,col:WC_DARK});wc_T(ctx,o.done?"nothing waiting":"8 too close to call",B.x+B.w-36,B.y+58,{w:600,size:28,align:"right",col:WC_INK});if(o.done)return;
  M8_INBOX.forEach(([s,what,wait],i)=>{const y=B.y+130+i*112;arrive(ctx,B.x+B.w/2,y+30,t,o.rows+i*0.12,()=>{m8_score(ctx,B.x+78,y+16,s,{gold:true});
    wc_T(ctx,what,B.x+140,y+26,{w:700,size:30,col:WC_DARK});if(wait)wc_T(ctx,wait,B.x+140,y+68,{w:600,size:28,col:M8_GOLDINK});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.25);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(B.x+30,y+94);ctx.lineTo(B.x+B.w-30,y+94);ctx.stroke();ctx.restore();},{dy:10});});
  withA(ctx,fin(t,o.rows+0.6,0.4),()=>wc_T(ctx,"and 4 more",B.x+140,B.y+B.h-30,{w:600,size:28,col:WC_MUTED}));
  if(o.ring!=null)wc_ring(ctx,B.x+B.w/2,B.y+178,B.w/2-14,62,clamp((t-o.ring)/0.8,0,1),{col:M8_GOLDLINE,seed:23});}

/* ---------- 3. Saturday: the application that waits ---------- */
const M8_RX=380,M8_RY=1010;
// his application: what he applied for, then the search it runs first (o.search), what it found (o.found), and, instead of a new number,
// that it waits for Mei (o.wait)
const M8_AP={x:760,y:132,w:720};
function m8_app(ctx,t,o){const A=M8_AP,h=300,tW=tw(ctx,"Application",30,800);wc_panel(ctx,A.x,A.y,A.w,h,{kind:"card",role:WC_ROLE.applicant,sw:tW+36,seed:6});
  wc_T(ctx,"Application",A.x+32,A.y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"Sat 14:20",A.x+A.w-28,A.y+48,{w:500,size:28,f:"mono",align:"right",col:WC_INK});
  wc_T(ctx,"Rafael Souza · master's, data science",A.x+32,A.y+98,{w:600,size:28,col:WC_MUTED});
  if(o.search>0){const s="looking for him first…";withA(ctx,clamp(o.search*3,0,1)*(1-o.found),()=>{m8_lens(ctx,A.x+50,A.y+156,o.search,t);wc_T(ctx,typeOn(s,o.search),A.x+84,A.y+166,{w:600,size:28,col:WC_INK});});}
  if(o.found>0.01)withA(ctx,o.found,()=>{wc_T(ctx,"likely: Rafael Souza, S-16352",A.x+32,A.y+166,{w:700,size:28,col:WC_DARK});
    wc_T(ctx,"not sure enough to link",A.x+32,A.y+210,{w:600,size:28,col:WC_MUTED});});
  if(o.wait>0.01)withA(ctx,o.wait,()=>{const bw=wc_badge(ctx,A.x+32,A.y+260,"waits for Mei");wc_T(ctx,"no new number",A.x+32+bw+16,A.y+270,{w:600,size:28,col:WC_INK});});}
// a pencil lens, looking, as the search runs
function m8_lens(ctx,x,y,p,t){ctx.save();ctx.translate(x+Math.sin(t*5)*3,y+Math.cos(t*4)*2);ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-6,11,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(8,3);ctx.lineTo(17,12);ctx.stroke();ctx.restore();}
// what the university already holds: his student record and his alumni record, both under the number he graduated with
const M8_OLD={student:[1240,520,600,120,"student","Student","S-16352","bachelor's · 2016–19"],alumni:[1240,668,600,120,"alumna","Alumnus","S-16352","graduated 2019"]};
function m8_old(ctx,k){const [x,y,w,h,r,title,id,note]=M8_OLD[k];wc_roleCard(ctx,x,y,w,h,r,title,id,null,{note,seed:k.length});}
// the new number that isn't made: a stamp's outline, dropping towards the application, crossed out
function m8_noStamp(ctx,t,x,y,t0){const a=fin(t,t0,0.4)*(1-fin(t,t0+2.6,0.6));if(a<=0.01)return;const dy=-26*(1-ease(clamp((t-t0)/0.6,0,1)));
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y+dy);ctx.rotate(-0.035);ctx.setLineDash([9,8]);ctx.strokeStyle=rgba([58,52,120],0.75);ctx.lineWidth=3;ctx.beginPath();rr(ctx,-120,-36,240,72,10);ctx.stroke();ctx.setLineDash([]);
    wc_T(ctx,"S-2····",0,12,{w:500,size:34,f:"mono",align:"center",col:[58,52,120]});wc_T(ctx,"a new number",0,-56,{w:600,size:28,align:"center",col:WC_MUTED});ctx.restore();
    wc_cross(ctx,x,y+dy,150,WC_NO,clamp((t-t0-0.7)/0.5,0,1));});}

/* ---------- 4. the waterfall ---------- */
// the rules' weights, from Who is it?: each comparison adds weight, or takes it away. The score is the chance that two records are one
// person: 100 / (1 + 2^-(w - 5.7)), so the bands' edges, 60 and 90, sit at weights 6.29 and 8.87
const M8_WROWS=[["given name","Rafael","Rafael",3.4],["family name","Souza","Souza",3.3],["birth date","16 Jun 1997","19 Jun 1997",0.9],["email","a new one","closed 2019",-0.4]];
const M8_WX=w=>760+w*92,M8_WY=[350,450,550,650],M8_WT=300,M8_WB=700,m8_pct=w=>Math.round(100/(1+Math.pow(2,-(w-5.7))));
const M8_Z60=6.29,M8_Z90=8.87,M8_WR=1846,M8_PY=M8_WB+96;
// the table on the left: each field as the application has it, and as the old record has it
const M8_WC=[96,330,560];
function m8_wtable(ctx,t,o){const cx=M8_WC;withA(ctx,o.head,()=>{wc_T(ctx,"Case 1 of 8",96,160,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"an application and a graduate",96,210,{w:800,size:36,col:WC_DARK});
    m8_dot(ctx,cx[1]+8,272,"applicant");wc_T(ctx,"application",cx[1]+24,282,{w:600,size:28,col:WC_INK});m8_dot(ctx,cx[2]+8,272,"student");wc_T(ctx,"old record",cx[2]+24,282,{w:600,size:28,col:WC_INK});});
  M8_WROWS.forEach(([f,a,b],i)=>{const y=M8_WY[i];arrive(ctx,400,y,t,o.rows[i],()=>{wc_T(ctx,f,cx[0],y+10,{w:800,size:30,col:WC_DARK});wc_T(ctx,a,cx[1],y+10,{w:600,size:28,col:WC_INK});wc_T(ctx,b,cx[2],y+10,{w:600,size:28,col:WC_INK});},{dy:8});});}
// the chart: its three bands (o.frame), the bars as each comparison is named (o.bars), the 74 (o.pill), the line where the bars end
// (o.score), and what it would be if the dates agreed (o.flip)
function m8_wchart(ctx,t,o){const x60=M8_WX(M8_Z60),x90=M8_WX(M8_Z90),x0=M8_WX(0),hl=o.score>0?fin(t,o.score,0.5):0,fl=o.flip>0?fin(t,o.flip,0.5):0,xs=M8_WX(7.2);
  // the bands, each named over it, on two lines where it's narrow
  withA(ctx,o.frame,()=>{const bands=[[x0,x60,[196,196,208],["kept apart"]],[x60,x90,M8_GOLD,["a person","decides"]],[x90,M8_WR,[176,186,214],["linked by","the rules"]]];
    bands.forEach(([a,b,c,L],i)=>{ctx.drawImage(m8_band(i,a,b,c),0,0);if(i===1&&hl>0.01)withA(ctx,hl*0.6,()=>ctx.drawImage(m8_band(9,a,b,c),0,0));
      L.forEach((s,k)=>wc_T(ctx,s,(a+b)/2,M8_WT-16-(L.length-1-k)*34,{w:700,size:28,align:"center",col:i===1?M8_GOLDINK:WC_INK}));});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,M8_WT);ctx.lineTo(x0,M8_WB);ctx.stroke();ctx.restore();
    [[x60,"60"],[x90,"90"]].forEach(([x,s])=>wc_T(ctx,s,x,M8_WB+40,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED}));});
  // the score's line, behind the bars: gold, down from the top, through where the bars end, to the 74
  if(o.score>0){const p=clamp((t-o.score)/0.6,0,1);if(p>0){ctx.save();ctx.strokeStyle=rgba(M8_GOLDLINE,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xs,M8_WT);ctx.lineTo(xs,lerp(M8_WT,M8_PY-26,ease(p)));ctx.stroke();ctx.restore();}}
  // the bars: each starts where the last ended, ink for weight added, red for weight taken away; each weight on a little paper, so a
  // line behind it doesn't cross it. While the dates are imagined to agree, the birth date's real weight steps back
  let w=0;M8_WROWS.forEach(([f,a,b,d],i)=>{const p=clamp((t-o.bars[i])/0.7,0,1),y=M8_WY[i];if(p<=0){w+=d;return;}const w1=w+d*ease(p),xa=M8_WX(w),xb=M8_WX(w1),neg=d<0;
    ctx.save();ctx.fillStyle=rgba(neg?WC_NO:[92,96,128],0.82);ctx.beginPath();rr(ctx,Math.min(xa,xb),y-26,Math.max(2,Math.abs(xb-xa)),52,6);ctx.fill();ctx.restore();
    if(i>0){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.setLineDash([3,7]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xa,y-100+26);ctx.lineTo(xa,y-26);ctx.stroke();ctx.restore();}
    const s=(neg?"−":"+")+Math.abs(d).toFixed(1),lx=neg?Math.min(xa,xb)-12:Math.max(xa,xb)+12,lw=tw(ctx,s,28,500,"mono"),l0=neg?lx-lw:lx;
    withA(ctx,clamp(p*2-1,0,1)*(i===2?1-0.7*fl:1),()=>{ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.88);ctx.beginPath();rr(ctx,l0-6,y-16,lw+12,34,8);ctx.fill();ctx.restore();
      wc_T(ctx,s,lx,y+10,{w:500,size:28,f:"mono",align:neg?"right":"left",col:neg?WC_NO:WC_DARK});});
    w+=d;});
  // the score: 74, where the bars will end
  if(o.pill!=null)arrive(ctx,xs,M8_PY,t,o.pill,()=>m8_score(ctx,xs,M8_PY,"74",{gold:true}),{dy:10});
  // if the dates agreed: the birth date's bar grows to +3.1, and the score would be 93, in the band the rules link on their own
  if(fl>0.01)withA(ctx,fl,()=>{const g=clamp((t-o.flip)/0.9,0,1),wb=6.7+3.1*ease(g),wc=wb-0.4*clamp((t-o.flip-0.9)/0.4,0,1);
    ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba([92,96,128],0.9);ctx.lineWidth=3;ctx.beginPath();rr(ctx,M8_WX(6.7),M8_WY[2]-26,M8_WX(wb)-M8_WX(6.7),52,6);ctx.stroke();
    if(t>o.flip+0.9){ctx.strokeStyle=rgba(WC_NO,0.85);ctx.beginPath();rr(ctx,M8_WX(wc),M8_WY[3]-26,M8_WX(wb)-M8_WX(wc),52,6);ctx.stroke();}ctx.restore();
    withA(ctx,clamp((g-0.5)*2,0,1),()=>wc_T(ctx,"+3.1",M8_WX(wb)+12,M8_WY[2]+10,{w:500,size:28,f:"mono",col:WC_DARK}));
    const q=clamp((t-o.flip-1.3)/0.5,0,1);if(q>0){const x9=M8_WX(9.4);ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x9,M8_WT);ctx.lineTo(x9,lerp(M8_WT,M8_PY-26,ease(q)));ctx.stroke();ctx.restore();
      withA(ctx,q,()=>m8_score(ctx,x9,M8_PY,"93",{dashed:true}));}});}
// a band of the chart, painted once
function m8_band(i,a,b,c){return wc_kept("band"+i,W,H,q=>{wc_prep();wc_wash(q,wc_resample(wc_rect(a,M8_WT,b-a,M8_WB-M8_WT),10),c,{kind:"chipwash",line:false,a:i===9?0.5:0.26,seed:70+i});});}

/* ---------- 5. the AI helper's draft ---------- */
// the draft: what it noticed, in comparisons, not values; what the form says; and what it suggests. It has no hand on the buttons
const M8_NOTE=["Same given and family names.","Birth dates one digit apart: likely a typo.","A new personal email.","He says he studied here before;","the degree and the year match.","Suggests: the same person."];
const M8_NB={x:900,y:148,w:944,h:532};
function m8_note(ctx,t,o){const B=M8_NB;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"card",dashed:true,role:M8_AI,seed:80});
  wc_panel(ctx,B.x+14,B.y+14,B.w-28,70,{kind:"card",wash:M8_AI,washA:0.4,seed:81});m8_spark(ctx,B.x+52,B.y+49,t);
  wc_T(ctx,"AI helper",B.x+84,B.y+60,{w:800,size:32,col:WC_DARK});wc_T(ctx,"a draft, for Mei",B.x+B.w-36,B.y+60,{w:600,size:28,align:"right",col:WC_INK});
  M8_NOTE.forEach((s,i)=>{const p=clamp((t-o.lines[i])/(0.25+s.length*0.022),0,1);if(p<=0)return;const last=i===5,y=B.y+140+i*58+(i>=3?14:0)+(last?20:0);
    wc_T(ctx,typeOn(s,p),B.x+40,y,{w:last?800:600,size:last?32:28,col:last?M8_AIINK:WC_INK});});}
// the helper's mark: a small four-pointed star, turning slowly
function m8_spark(ctx,x,y,t,s){ctx.save();ctx.translate(x,y);ctx.scale(s||1,s||1);ctx.rotate(Math.sin(t*0.8)*0.15);ctx.fillStyle=rgba(M8_AIINK,0.9);ctx.beginPath();
  for(let i=0;i<8;i++){const r=i%2?6:18,a=i/8*TAU-Math.PI/2;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.restore();}
// the two buttons only a person presses; o.press lights "Link" as it's pressed. Link's middle is at (x+100, y+32)
function m8_buttons(ctx,x,y,o){o=o||{};const bs=[["Link",200],["Keep apart",260]];let xx=x;bs.forEach(([s,w],i)=>{const on=i===0?(o.press||0):0;
  wc_panel(ctx,xx,y,w,64,{kind:"pill",dashed:on<0.5,role:M8_GOLDLINE,wash:on>0.5?M8_GOLD:null,washA:0.75,seed:90+i});
  wc_T(ctx,s,xx+w/2,y+43,{w:800,size:30,align:"center",col:WC_DARK});xx+=w+24;});return xx;}
// what the form says, and what the old record says: the same thing, in other words
function m8_form(ctx,x,y,p){wc_panel(ctx,x,y,700,150,{kind:"card",role:WC_ROLE.applicant,sw:tw(ctx,"On the form",30,800)+36,seed:84});wc_T(ctx,"On the form",x+30,y+48,{w:800,size:30,col:WC_DARK});
  wc_hand(ctx,"“BSc here, 2016–19”",x+40,y+112,{p,size:36,w:600,col:WC_INK});}
function m8_record(ctx,x,y){wc_panel(ctx,x,y,700,150,{kind:"card",role:WC_ROLE.student,sw:tw(ctx,"The old record",30,800)+36,seed:85});wc_T(ctx,"The old record",x+30,y+48,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,"Bachelor of Science · completed 2019",x+30,y+110,{w:600,size:28,col:WC_INK});}
// the case as Mei sees it, the helper's draft and all: the chapter draws it as it's said; kept whole, it's the screen on her monitor
const M8_FM=[96,280],M8_RC=[96,524],M8_BT=[900,712];
function m8_case(ctx,t,o){withA(ctx,o.head,()=>{wc_T(ctx,"Case 1 of 8",96,160,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"an application and a graduate",96,210,{w:800,size:36,col:WC_DARK});
    m8_score(ctx,96+tw(ctx,"an application and a graduate",36,800)+60,198,"74",{gold:true});});
  arrive(ctx,M8_NB.x+M8_NB.w/2,M8_NB.y+M8_NB.h/2,t,o.note,()=>m8_note(ctx,t,o),{dy:16});
  arrive(ctx,M8_FM[0]+350,M8_FM[1]+75,t,o.form,()=>m8_form(ctx,M8_FM[0],M8_FM[1],clamp((t-o.write)/o.writeD,0,1)),{dy:16});
  arrive(ctx,M8_RC[0]+350,M8_RC[1]+75,t,o.record,()=>m8_record(ctx,M8_RC[0],M8_RC[1]),{dy:16});
  // different words, the same meaning: a cyan bracket between the two, as the helper reads them
  const m=clamp((t-o.meaning)/0.7,0,1);if(m>0){const x=M8_FM[0]+720,y0=M8_FM[1]+90,y1=M8_RC[1]+60;ctx.save();ctx.strokeStyle=rgba(M8_AIINK,0.85);ctx.lineWidth=3.2;ctx.setLineDash([10,8]);ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x-16,y0);ctx.lineTo(x,y0);ctx.lineTo(x,lerp(y0,y1,ease(m)));if(m>=1)ctx.lineTo(x-16,y1);ctx.stroke();ctx.restore();
    withA(ctx,fin(t,o.meaning+0.4,0.5),()=>{wc_T(ctx,"different words,",M8_FM[0]+30,M8_FM[1]+196,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"the same meaning",M8_FM[0]+30+tw(ctx,"different words,",28,600)+12,M8_FM[1]+196,{w:700,size:28,col:M8_AIINK});});}
  // the buttons are a person's, not the helper's
  arrive(ctx,M8_BT[0]+242,M8_BT[1]+32,t,o.buttons,()=>{const xe=m8_buttons(ctx,M8_BT[0],M8_BT[1],{press:o.press});wc_hand(ctx,"for Mei to press",xe+10,M8_BT[1]+44,{size:32,w:600,col:M8_GOLDINK});},{dy:10});}

/* ---------- 6. Mei's decision ---------- */
// the decision: linked, the two it joins, her reason typed in (o.why), who and when (o.who), unlink and the versions kept (o.undo)
const M8_DC={x:780,y:126,w:960,h:470};
const M8_WHY=["Same person: he says he studied here, and","the degree and the year match. The birth date","on the application is a typo."];
function m8_decision(ctx,t,o){const B=M8_DC;ctx.save();ctx.fillStyle=rgba(WC_CARD,1);ctx.beginPath();rr(ctx,B.x+3,B.y+3,B.w-6,B.h-6,12);ctx.fill();ctx.restore();wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"card",seed:95});const bw=wc_badge(ctx,B.x+30,B.y+52,"decision");
  wc_T(ctx,"linked",B.x+30+bw+18,B.y+64,{w:800,size:36,col:WC_DARK});
  wc_T(ctx,"his application  →  Rafael Souza, S-16352",B.x+30,B.y+120,{w:600,size:28,col:WC_INK});
  wc_T(ctx,"why",B.x+30,B.y+176,{w:800,size:28,col:WC_MUTED});let n=Math.round(M8_WHY.join("").length*clamp(o.why,0,1));
  M8_WHY.forEach((s,i)=>{if(n<=0)return;wc_T(ctx,s.slice(0,n),B.x+100,B.y+176+i*42,{w:600,size:28,col:WC_DARK});n-=s.length;});
  const wa=fin(t,o.who,0.5);if(wa>0.01)withA(ctx,wa,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(B.x+30,B.y+316);ctx.lineTo(B.x+B.w-30,B.y+316);ctx.stroke();ctx.restore();
    wc_T(ctx,"Mei Tanaka · Monday 9:14",B.x+30,B.y+362,{w:700,size:28,col:WC_DARK});wc_tick(ctx,B.x+B.w-60,B.y+352,40,M8_GOLDLINE,clamp((t-o.who-0.2)/0.4,0,1),5.5);});
  const ua=fin(t,o.undo,0.5);if(ua>0.01)withA(ctx,ua,()=>{const y=B.y+404;wc_panel(ctx,B.x+30,y,180,52,{kind:"pill",seed:96});m8_icon(ctx,"undo",B.x+66,y+26,0.8,WC_INK);
    wc_T(ctx,"unlink",B.x+96,y+36,{w:700,size:28,col:WC_DARK});
    withA(ctx,fin(t,o.vers,0.4),()=>wc_T(ctx,"versions",B.x+246,y+36,{w:600,size:28,col:WC_MUTED}));
    // every version kept: the first, as it came in on Saturday, waiting; the second, hers
    let x=B.x+246+tw(ctx,"versions",28,600)+20;[["v1 · Sat 14:20",0],["v2 · Mon 9:14",1]].forEach(([s,i])=>{const w=Math.round(tw(ctx,s,28,500,"mono")+36),x0=x;
      arrive(ctx,x0+w/2,y+26,t,o.vers+0.2+i*0.35,()=>{wc_panel(ctx,x0,y,w,52,{kind:"tag",wash:i?M8_GOLD:null,washA:0.5,seed:97+i});wc_T(ctx,s,x0+18,y+36,{w:500,size:28,f:"mono",col:i?WC_DARK:WC_MUTED});},{dy:8});x+=w+16;});});}
// what the helper learns from: her decision, as a dashed cyan card
const M8_LRN={x:96,y:150,w:640,h:80};
function m8_learns(ctx,t){const L=M8_LRN;wc_panel(ctx,L.x,L.y,L.w,L.h,{kind:"card",dashed:true,role:M8_AI,wash:M8_AI,washA:0.18,seed:98});m8_spark(ctx,L.x+44,L.y+40,t,0.9);
  wc_T(ctx,"AI helper",L.x+78,L.y+50,{w:800,size:30,col:WC_DARK});wc_T(ctx,"learns from her decision",L.x+78+tw(ctx,"AI helper",30,800)+16,L.y+50,{w:600,size:28,col:M8_AIINK});}

/* ---------- 7. published, not pushed ---------- */
// the changes the hub publishes, in order: his at the top. Each system reads the feed for what concerns it
const M8_FD={x:740,y:256,w:440};
const M8_FEED=[["S-16352 · application linked",1],["an enrolment · student",0],["a new email · alumni",0],["a new address · HR",0]];
function m8_feed(ctx,t,o){const F=M8_FD,ha=fin(t,o.head,0.5);withA(ctx,ha,()=>{wc_T(ctx,"published",F.x+F.w/2,F.y-56,{w:800,size:36,align:"center",col:WC_DARK});
    wc_T(ctx,"a feed of changes, in order",F.x+F.w/2,F.y-16,{w:600,size:28,align:"center",col:WC_MUTED});});
  M8_FEED.forEach(([s,top],i)=>{const y=F.y+16+i*80,dy=top?-40*(1-ease(clamp((t-o.top)/0.7,0,1))):0,a=top?fin(t,o.top,0.4):fin(t,o.head+0.2+i*0.1,0.5)*0.8;if(a<=0.01)return;
    withA(ctx,a,()=>{wc_panel(ctx,F.x,y+dy,F.w,64,{kind:"tag",wash:top?M8_GOLD:null,washA:0.45,seed:100+i});wc_T(ctx,s,F.x+22,y+dy+42,{w:top?800:600,size:28,col:top?WC_DARK:WC_INK});});});}
// a system, as a card in its role's colour: its name, and what it reads, each line ticked as it's read
const M8_SYSB={student:[60,136,620,300],alumni:[1240,136,620,330],hr:[60,560,620,150],research:[1240,560,620,150]};
function m8_sys(ctx,k){const [x,y,w,h]=M8_SYSB[k],[name,role]=M8_SYS[k];wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE[role],sw:tw(ctx,name,30,800)+36,seed:110+name.length});
  wc_T(ctx,name,x+32,y+48,{w:800,size:30,col:WC_DARK});}
// a line read: a tick, then the words
function m8_read(ctx,x,y,s,p,col){if(p<=0)return;wc_tick(ctx,x+16,y-10,30,col||WC_ROLEINK.alumna,clamp(p/0.3,0,1),4);wc_T(ctx,typeOn(s,clamp((p-0.25)/0.75,0,1)),x+46,y,{w:600,size:28,col:WC_DARK});}
// a value masked for whoever reads it: a hatched field where the birth date would be; (x,y) is its left and middle
function m8_masked(ctx,x,y,w,a){withA(ctx,a==null?1:a,()=>{ctx.drawImage(wc_kept("hatch"+w,w+20,60,q=>{q.translate(10,10);wc_wash(q,wc_resample(wc_rect(0,0,w,40),8),[150,150,164],{kind:"swatch",line:false,a:0.5,seed:7});
  q.save();q.beginPath();q.rect(0,0,w,40);q.clip();q.strokeStyle=rgba(WC_PENCIL,0.55);q.lineWidth=2;for(let i=-4;i<w/12+4;i++){q.beginPath();q.moveTo(i*12,44);q.lineTo(i*12+40,-4);q.stroke();}q.restore();}),x-10,y-30);});}

/* ---------- 8. where it came from ---------- */
// his record, as the person: each value, and a label for the system it came from and when; the runners-up, kept but not chosen
const M8_PR={x:640,y:118,w:1200,h:630},M8_FIG=[330,860,0.86];
const M8_VAL=[["given name","Rafael","student","student system · 2016"],["family name","Souza","student","student system · 2016"],["birth date","19 Jun 1997","student","student system · checked 2016"],
  ["","16 Jun 1997","applicant","application · Saturday"],["email","rafa.souza@mail.example","applicant","application · confirmed Sat"],["","s16352@student.example","student","student system · closed 2019"]];
const M8_VY=[252,336,420,494,598,672];
function m8_src(ctx,x,y,role,s,o){o=o||{};const w=Math.round(tw(ctx,s,28,700)+44);wc_panel(ctx,x,y-25,w,50,{kind:"chip",role:WC_ROLE[role],dashed:o.dashed,seed:s.length});
  wc_T(ctx,s,x+22,y+10,{w:700,size:28,col:WC_DARK});return w;}
// a row: its field and value (o.v, 0..1), then where the value came from (o.s); a runner-up says it wasn't chosen (o.l)
function m8_val(ctx,i,o){const [f,v,role,src]=M8_VAL[i],y=M8_VY[i],P=M8_PR,dim=!f,mono=i>=4;
  withA(ctx,(o.v==null?1:o.v)*(dim?0.8:1),()=>{if(f)wc_T(ctx,f,P.x+36,y+10,{w:700,size:28,col:WC_MUTED});
    wc_T(ctx,v,P.x+250,y+10,{w:dim?500:700,size:dim?28:30,f:mono?"mono":"sans",col:dim?WC_MUTED:WC_DARK});});
  if(dim&&o.l>0.01)withA(ctx,o.l,()=>wc_T(ctx,"not chosen",P.x+36,y+10,{w:500,size:28,col:WC_MUTED}));
  if(o.s>0.01)withA(ctx,o.s,()=>m8_src(ctx,P.x+(mono?690:600),y,role,src,{dashed:dim}));}

/* ---------- 9. Friday: checking the checkers ---------- */
// fifty of the week's automatic links, a cell each, ticked as Leila agrees, crossed where she doesn't
const M8_GC={x:780,y:118,w:960,h:600},M8_GX=826,M8_GY=356,M8_GW=88,M8_GH=50,M8_BAD=23;
function m8_check(ctx,t,o){const B=M8_GC;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"card",seed:120});wc_T(ctx,"Friday check",B.x+30,B.y+54,{w:800,size:36,col:WC_DARK});
  withA(ctx,fin(t,o.sub,0.5),()=>wc_T(ctx,"50 automatic links, most scored 90 to 93",B.x+30,B.y+100,{w:600,size:28,col:WC_INK}));
  // what she sees: the two records; what she doesn't: the rules' decision, hidden
  withA(ctx,fin(t,o.pair,0.5),()=>{const y=B.y+132;[["record A","student"],["record B","tutor"]].forEach(([s,r],i)=>{wc_panel(ctx,B.x+30+i*196,y,180,64,{kind:"tag",seed:121+i});m8_dot(ctx,B.x+54+i*196,y+32,r);
      wc_T(ctx,s,B.x+70+i*196,y+42,{w:700,size:28,col:WC_DARK});});});
  withA(ctx,fin(t,o.hide,0.5),()=>{const y=B.y+132;wc_panel(ctx,B.x+422,y,508,64,{kind:"tag",seed:123});m8_masked(ctx,B.x+440,y+32,96,1);wc_T(ctx,"the rules' decision: hidden",B.x+556,y+42,{w:600,size:28,col:WC_INK});});
  for(let i=0;i<50;i++){const c=i%10,r=Math.floor(i/10),x=M8_GX+c*M8_GW,y=M8_GY+r*M8_GH,p=clamp((t-o.fill-i*o.step)/0.3,0,1),bad=i===M8_BAD;
    withA(ctx,fin(t,o.grid+i*0.012,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();rr(ctx,x,y,M8_GW-12,M8_GH-10,6);ctx.stroke();ctx.restore();});
    if(bad){wc_cross(ctx,x+(M8_GW-12)/2,y+(M8_GH-10)/2,30,WC_NO,clamp((t-o.bad)/0.5,0,1));}else if(p>0)wc_tick(ctx,x+(M8_GW-12)/2,y+(M8_GH-10)/2,26,WC_ROLEINK.alumna,p,3.6);}
  // Mei unlinks the one that was wrong
  const ua=fin(t,o.unlink,0.5);if(ua>0.01)withA(ctx,ua,()=>{const c=M8_BAD%10,r=Math.floor(M8_BAD/10),x=M8_GX+c*M8_GW+(M8_GW-12)/2,y=M8_GY+r*M8_GH+(M8_GH-10)/2;
    wc_ring(ctx,x,y,46,32,clamp((t-o.unlink)/0.7,0,1),{col:M8_GOLDLINE,seed:31});
    const tx=B.x+30,ty=B.y+B.h-56;wc_panel(ctx,tx,ty-30,330,60,{kind:"pill",wash:M8_GOLD,washA:0.55,seed:124});m8_icon(ctx,"undo",tx+40,ty,0.8,WC_INK);wc_T(ctx,"unlinked by Mei",tx+76,ty+10,{w:700,size:28,col:WC_DARK});});}
// the office's own Friday rule, written down: not a product's switch, a promise the office keeps
function m8_rule(ctx,t,o){const B=M8_GC;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"card",seed:130});
  wc_T(ctx,"Our Friday rule",B.x+30,B.y+64,{w:800,size:36,col:WC_DARK});wc_T(ctx,"agreed by the stewards",B.x+30,B.y+108,{w:600,size:28,col:WC_MUTED});
  const L=[["If more than 3 in 50 are wrong,",o.l1],["automatic linking stops.",o.l2],["Every match waits for a person,",o.l3],["until new rules are agreed.",o.l4]];
  L.forEach(([s,t0],i)=>{const p=clamp((t-t0)/(0.3+s.length*0.02),0,1);if(p>0)wc_T(ctx,typeOn(s,p),B.x+40,B.y+190+i*66,{w:i%2?800:600,size:38,col:WC_DARK});});
  const sa=fin(t,o.week,0.5);if(sa>0.01)withA(ctx,sa,()=>{const y=B.y+B.h-84;wc_panel(ctx,B.x+30,y-34,B.w-60,68,{kind:"card",wash:WC_ROLE.alumna,washA:0.22,seed:131});
    wc_tick(ctx,B.x+70,y-6,34,WC_ROLEINK.alumna,clamp((t-o.week-0.2)/0.4,0,1),5);wc_T(ctx,"This week: 1 in 50. Automatic linking stays on.",B.x+104,y+10,{w:700,size:30,col:WC_DARK});});}

/* ---------- 10. five questions ---------- */
const M8_Q=[["explain","Can it explain every match, and every value?"],["undo","Can every decision be undone?"],["review","Do people decide what's unsure, and check what isn't?"],
  ["mask","Does each office see only what it needs?"],["publish","Do systems read the changes, instead of being overwritten?"]];
const M8_QS={x:200,y:96,w:1520,h:740},M8_QY=[352,450,548,646,744];
// a kind of organisation, as a chip in its colour
function m8_ind(ctx,x,y,ind,s){const w=Math.round(tw(ctx,s,28,700)+48);wc_panel(ctx,x,y-27,w,54,{kind:"chip",role:WC_IND[ind],seed:s.length+40});wc_T(ctx,s,x+24,y+10,{w:700,size:28,col:WC_DARK});return w;}

/* ---------- 11. the end ---------- */
// the three parts of the hub, as tags in their colours: the rules in pencil, the helper's suggestion dashed in cyan, a person's decision gold
const M8_PARTS=[["Rules act.",null,false],["AI suggests.",M8_AI,true],["People decide.",M8_GOLD,false]];
function m8_partW(ctx,i){return Math.round(tw(ctx,M8_PARTS[i][0],40,800)+64);}
function m8_part(ctx,x,y,i){const L=M8_PARTS[i],s=L[0],w=m8_partW(ctx,i);
  wc_panel(ctx,x-w/2,y-38,w,76,{kind:"card",wash:L[1],washA:0.5,dashed:L[2],role:L[2]?M8_AIINK:null,seed:140+i});wc_T(ctx,s,x,y+14,{w:800,size:40,align:"center",col:WC_DARK});return w;}
// the week, as the hub sums it up on Friday evening
function m8_week(ctx){wc_T(ctx,"This week",M8_SX,172,{w:800,size:40,col:WC_DARK});
  [["1,240 changes, from four systems",WC_INK],["1,180 matched · 52 new people",WC_INK],["8 decided by Mei",M8_GOLDINK],["Friday check: 1 in 50, unlinked",WC_INK]].forEach(([s,c],i)=>{const y=232+i*112;
    wc_panel(ctx,M8_SX,y,900,88,{kind:"card",seed:150+i});wc_T(ctx,s,M8_SX+32,y+56,{w:600,size:30,col:WC_DARK});});
  m8_inbox(ctx,99,{done:true});}
