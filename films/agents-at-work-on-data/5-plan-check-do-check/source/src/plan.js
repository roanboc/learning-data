/* ===== Plan, define the check, do, check: the room's own pieces =====
   Everything this film puts in the series' room (the lab, the agent, the cards) that the shared code doesn't have (prefix pc_):
     PC_ROOM      where things stand: Jun at his desk on the left, the agent's three tools down the right, the steps across the top
     pc_jun       Jun at his desk on the left, cut at its back edge, his arms down out of sight
     pc_steps     the four steps across the top, "Plan", "Define the check", "Do", "Check": the current one dark
     pc_plan      the one-page plan: its title, then a row for each thing it sets, each written in as its line is said; a tick, a
                  warning or a lock by a row; o.empty takes the rows' words away, leaving the plan ready for the next job
     pc_test      a test card, set (blue), failing (amber) or passing (green), with a person's approval and a lock
     pc_count     the count by level the agent builds: its rows, a row that grows in, its total
     pc_tool      a tool on the wall, read only; pc_arm(i) the arm from the agent's ring to tool i
     pc_globe     a pale globe, "the web"; pc_webPage a small page coming back from it
     pc_num       a card with a number that counts up; pc_clock a clock on a card, its hand turning
     pc_shelf     the bench "In the project", where what the loop leaves is kept
     pc_cycle     the four steps on an oak ring, a light going round them
     pc_outbox    the card the count goes into, "To the government"
     pc_whole     draws a person (or anything) into a layer and lays it on the frame at one opacity, so a person comes and goes whole
   Words are drawn live with ag_T, at least 28 px, above y 890. */

const PC_ROOM={jun:[290,612,0.95],desk:{x:-90,y:1004,w:770,depth:150},tx:1540,tw:290,th:134,ty:[300,456,612],tools:["Catalog","Query","Docs"],
  steps:[1250,82]};
const PC_TOOLDO=["tables and columns","counts and samples","the university's words"];

/* ---------------------------------------------------------------- Jun at his desk */
function pc_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=PC_ROOM.jun,D=PC_ROOM.desk;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0,cut:D.y-D.depth});
  ctx.restore();}

/* ---------------------------------------------------------------- the four steps across the top
   pc_steps(ctx, cur, o): the pills in a row, centred at PC_ROOM.steps; cur the current step (0 to 3), dark with light words, or a
   number between two steps while it moves on; o.a. Returns the pills' boxes. */
const PC_STEPS=["Plan","Define the check","Do","Check"];
function pc_steps(ctx,cur,o){o=o||{};const a=o.a==null?1:o.a,[cx,cy]=o.at||PC_ROOM.steps,h=50,gap=46,f={w:700,size:28};
  const ws=PC_STEPS.map(s=>ag_tw(ctx,s,f)+48),tot=ws.reduce((s,w)=>s+w,0)+gap*3;let x=cx-tot/2;const out=[];
  PC_STEPS.forEach((s,i)=>{const b={x,y:cy-h/2,w:ws[i],h,cx:x+ws[i]/2,cy};out.push(b);x+=ws[i]+gap;});if(a<=0.01)return out;ctx.save();ctx.globalAlpha*=a;
  out.forEach((b,i)=>{const on=clamp(1-Math.abs(i-cur),0,1);
    ag_box(ctx,b.x,b.y,b.w,b.h,h/2,{});if(on>0.01){ctx.save();ctx.globalAlpha*=on;ctx.fillStyle="rgba(52,56,64,0.94)";ctx.beginPath();ag_rect(ctx,b.x,b.y,b.w,b.h,h/2);ctx.fill();ctx.restore();}
    ag_T(ctx,PC_STEPS[i],b.cx,cy+10,{w:700,size:28,align:"center",col:mix(AG.mut,[250,250,248],on)});
    if(i<3){const ax=b.x+b.w+gap/2;ctx.strokeStyle="rgba(87,82,76,0.7)";ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(ax-6,cy-9);ctx.lineTo(ax+4,cy);ctx.lineTo(ax-6,cy+9);ctx.stroke();}});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the one-page plan
   pc_plan(ctx, x, y, w, rows, o): "PLAN" and its title, then rows [{k: "Goal", v: "words", icon: "lock"}], each row's words typed in
   as o.k[i] goes 0 to 1 (its label comes first); o.title; o.grow[i] (0 to 1) opens a row's room, so a row can be put in between
   two others, the rows under it sliding down (its words come once it's open); o.tick[i] (0 to 1) a green tick at the row's end;
   o.amber[i] the row's words in amber, with a warning; o.hi[i] (0 to 1) a soft light on the row, in o.hiCol (green); o.lab[i] (0 to
   1) the label alone, before its words (o.k[i] then types them from 0.15); o.empty (0 to 1) takes every row's words and the title
   away; o.blank (0 to 1) a faint line where a row with no words would have them, as on a page still to fill in; o.ka springs it in; o.a. Returns its
   box and each row's top (ys). */
const PC_LW=150;
function pc_plan(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=40,inner=w-56-PC_LW-44,f={w:600,size:30},G=i=>ag_sine(clamp((o.grow||[])[i]==null?1:o.grow[i],0,1));
  const L=rows.map(r=>ag_wrap(ctx,r.v||"",inner-(r.icon?40:0),f));let yy=y+(o.title?128:84);
  const ys=L.map((ls,i)=>{const r=yy;yy+=(Math.max(1,ls.length)*lh+16)*G(i);return r;}),h=yy-y+14,out={x,y,w,h,ys};if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;
  if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"PLAN",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});const em=ag_sine(clamp(o.empty||0,0,1));if(o.title)ag_T(ctx,o.title,x+28,y+96,{w:800,size:36,a:1-em});
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,ys[0]-14);ctx.lineTo(x+w-28,ys[0]-14);ctx.stroke();
  const bl=clamp(o.blank||0,0,1);
  rows.forEach((r,i)=>{const open=G(i)>0.995?1:0,k=clamp((o.k||[])[i]==null?1:o.k[i],0,1)*open,ka=((o.lab||[])[i]==null?clamp(k*4,0,1):clamp(o.lab[i],0,1))*open;
    if(k<=0&&ka<=0)return;const ry=ys[i],am=o.amber&&o.amber[i],col=am?AG.amber:AG.ink;
    if(bl>0.01&&!L[i].length){ctx.strokeStyle="rgba(60,50,40,"+0.16*bl*ka+")";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28+PC_LW,ry+30);ctx.lineTo(x+w-28,ry+30);ctx.stroke();}
    const hi=(o.hi||[])[i]||0;if(hi>0.01){ctx.save();ctx.globalAlpha*=hi;ctx.fillStyle=rgba(o.hiCol||AG.green,0.09);ctx.beginPath();ag_rect(ctx,x+12,ry-12,w-24,Math.max(1,L[i].length)*lh+12,12);ctx.fill();ctx.restore();}
    ag_T(ctx,String(r.k).toUpperCase(),x+28,ry+22,{w:700,size:28,ls:3,col:am?AG.amber:AG.mut,a:ka});
    const tx=x+28+PC_LW+(r.icon?40:0),full=L[i].join(" "),n=Math.round(clamp((k-0.15)/0.85,0,1)*full.length);let used=0;
    if(r.icon==="lock")ag_lock(ctx,x+28+PC_LW+14,ry+18,28,rgba(AG.blue,ka*(1-em)));
    L[i].forEach((ln,j)=>{const take=clamp(n-used,0,ln.length);used+=ln.length+1;if(take<=0)return;ag_T(ctx,ln.slice(0,take),tx,ry+22+j*lh,{w:600,size:30,col,a:1-em});});
    const tk=(o.tick||[])[i]||0;if(tk>0.01)ag_tick(ctx,x+w-40,ry+12,26,rgba(AG.green,tk),4);
    if(am)ag_warn(ctx,x+w-40,ry+12,28,rgba(AG.amber,ka));});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- a test card
   pc_test(ctx, x, y, w, text, o): "TEST" and its line; o.state "set" (a blue edge: written, not yet run), "fail" (amber) or "pass"
   (green); o.note a line under it in the state's colour (o.noteA); o.ok (0 to 1) a green pill under it, "approved · Jun" (under its
   right end, or its left with o.okLeft); o.lock (0 to
   1) a small blue lock at its top right; o.k springs it in; o.a. Returns its box. */
function pc_test(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,st=o.state||"set",col=st==="pass"?AG.green:st==="fail"?AG.amber:AG.blue,
    ls=ag_wrap(ctx,text,w-56-(o.lock!=null?40:0),{w:700,size:32}),h=82+ls.length*42+(o.note?44:0),b={x,y,w,h};if(a<=0.01)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,20,{edge:col,edgeA:0.85});
  ag_T(ctx,"TEST",x+28,y+48,{w:700,size:28,ls:4,col});if(st==="pass")ag_tick(ctx,x+142,y+40,22,rgba(AG.green,1),4);else if(st==="fail")ag_warn(ctx,x+144,y+38,28,rgba(AG.amber,1));
  ls.forEach((l,i)=>ag_T(ctx,l,x+28,y+92+i*42,{w:700,size:32}));
  if(o.note)ag_T(ctx,o.note,x+28,y+h-26,{w:700,size:30,col,a:o.noteA==null?1:o.noteA});
  const lk=o.lock||0;if(lk>0.01){ctx.save();ctx.globalAlpha*=clamp(lk,0,1);ag_about(ctx,x+w-40,y+36,lerp(1.6,1,ag_eo(lk)));ag_lock(ctx,x+w-40,y+44,30,rgba(AG.blue,1));ctx.restore();}
  ctx.restore();
  const ok=o.ok||0;if(ok>0.01){const k=clamp(ag_spr(ok,0,0.4),0,1.2),px=o.okLeft?x+150:x+w-130;ctx.save();ctx.globalAlpha*=a*clamp(ok*3,0,1);ag_about(ctx,px,y+h+34,lerp(0.6,1,k));ag_pill(ctx,px,y+h+34,"approved · Jun",{col:AG.green,icon:"tick",size:28});ctx.restore();}
  return b;}

/* ---------------------------------------------------------------- the count by level
   pc_count(ctx, x, y, w, o): "COUNT BY LEVEL", its rows (PC_LEVELS) as o.k[i] (0 to 1) brings each in, the third (non-award) only
   once it's added; a rule, then "Total" and o.total in o.totalCol; o.ka, o.a. The numbers are orange: data the agent brought back. */
const PC_LEVELS=[["Undergraduate","13,906"],["Postgraduate","4,478"],["Non-award","28"]];
function pc_count(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,k=o.k||[1,1,0],grow=ag_sine(clamp(k[2]||0,0,1)),rh=50,h=118+rh*(2+grow)+70,b={x,y,w,h};if(a<=0.01)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.8});ag_T(ctx,"COUNT BY LEVEL",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});
  ag_T(ctx,"census day",x+28,y+90,{w:500,size:28,col:AG.mut});
  PC_LEVELS.forEach(([s,n],i)=>{const kk=i<2?clamp(k[i],0,1):clamp((k[2]-0.4)/0.6,0,1);if(kk<=0)return;const yy=y+148+i*rh;
    if(i===2&&o.newA){ctx.save();ctx.globalAlpha*=o.newA;ctx.fillStyle=rgba(AG.green,0.1);ctx.beginPath();ag_rect(ctx,x+14,yy-36,w-28,rh,12);ctx.fill();ctx.restore();}
    ag_T(ctx,s,x+28,yy,{w:600,size:30,a:kk});ag_T(ctx,n,x+w-28,yy,{w:800,size:32,col:AG.orange,align:"right",a:kk});});
  const ty=y+148+rh*(2+grow)-10;ctx.strokeStyle="rgba(60,50,40,0.2)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,ty-6);ctx.lineTo(x+w-28,ty-6);ctx.stroke();
  const ta=o.totalA==null?1:o.totalA;if(ta>0.01){ag_T(ctx,"Total",x+28,ty+40,{w:700,size:30,a:ta});ag_T(ctx,o.total||"",x+w-28,ty+42,{w:800,size:40,col:o.totalCol||AG.orange,align:"right",a:ta});}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the tools, and the arms that reach them
   pc_tool(ctx, i, o): tool i of PC_ROOM.tools on the wall, with what it gives and "read only" by a lock; o.touch (0 to 1) its blue
   edge while an arm holds it, o.glow (0 to 1) a soft light (Docs, where the answer was), o.a. pc_arm(i, rx, ry, R): the curve from
   the ring's right side (Act) to the tool's left edge. */
function pc_tool(ctx,i,o){o=o||{};const a=o.a==null?1:o.a,x=PC_ROOM.tx+(o.dx||0),y=PC_ROOM.ty[i],w=PC_ROOM.tw,h=PC_ROOM.th,b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;const on=Math.max(o.touch||0,o.glow||0);
  ag_box(ctx,x,y,w,h,20,{edge:on>0.1?AG.blue:null,edgeA:0.9*on,glow:on>0.1?AG.blue:null,glowA:on});
  ag_T(ctx,PC_ROOM.tools[i],x+28,y+48,{w:700,size:32});ag_T(ctx,PC_TOOLDO[i],x+28,y+84,{w:500,size:28,col:AG.mut});
  ag_lock(ctx,x+42,y+h-26,26,rgba(AG.blue,1));ag_T(ctx,"read only",x+66,y+h-18,{w:600,size:28,col:AG.blue});
  ctx.restore();return b;}
const pc_arm=(i,rx,ry,R)=>{const y=PC_ROOM.ty[i]+PC_ROOM.th/2,x0=rx+R+30;return[x0,ry,x0+90,ry,PC_ROOM.tx-120,y,PC_ROOM.tx-4,y];};

/* ---------------------------------------------------------------- the web, and what comes back from it */
function pc_globe(ctx,x,y,r,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),[214,222,228],[250,252,254],x+r*0.35,y-r*0.4,r*1.2,"rgba(46,38,28,0.25)",14,0.9);
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(90,110,128,0.45)";ctx.lineWidth=2;
  for(const k of [-0.6,-0.2,0.2,0.6]){ctx.beginPath();ctx.ellipse(x,y+k*r,r*Math.sqrt(1-k*k),r*0.12*Math.sqrt(1-k*k),0,0,TAU);ctx.stroke();}
  for(const k of [0.25,0.6,0.92]){ctx.beginPath();ctx.ellipse(x,y,r*k,r,0,0,TAU);ctx.stroke();}ctx.restore();
  ag_T(ctx,"the web",o.side==="left"?x-r-22:x,o.side==="left"?y+11:y+r+46,{w:700,size:30,align:o.side==="left"?"right":"center",col:AG.mut});ctx.restore();}
// a small page of the web, its lines of words too small to read (decoration), s 1 about 64 px tall
function pc_webPage(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_box(ctx,-24,-32,48,64,6,{});ctx.fillStyle="rgba(90,110,128,0.5)";ctx.fillRect(-16,-24,32,6);ctx.fillStyle="rgba(60,64,70,0.25)";for(let i=0;i<5;i++)ctx.fillRect(-16,-12+i*8,i===4?18:32,3);ctx.restore();}
// a card with a number that counts up: kick, then num (a string), o.col, o.k springs it in, o.a; returns its box
function pc_num(ctx,x,y,w,kick,num,o){o=o||{};const a=o.a==null?1:o.a,h=128,b={x,y,w,h};if(a<=0.01)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,20,{edge:o.edge||null,edgeA:0.8});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+46,{w:700,size:28,ls:4,col:o.kickCol||AG.mut});ag_T(ctx,num,x+28,y+104,{w:800,size:44,col:o.col||AG.ink});ctx.restore();return b;}
// a clock on a card: its minute hand at min minutes, and label beside the face; o.k, o.a
function pc_clock(ctx,x,y,w,min,label,o){o=o||{};const a=o.a==null?1:o.a,h=128;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,20,{});
  const cx=x+70,cy=y+h/2,r=40;ctx.fillStyle="#F6F4F0";ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(60,64,70,0.55)";ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<12;i++){const q=i/12*TAU;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(q)*r*0.8,cy+Math.sin(q)*r*0.8);ctx.lineTo(cx+Math.cos(q)*r*0.92,cy+Math.sin(q)*r*0.92);ctx.stroke();}
  const q=-Math.PI/2+min/60*TAU;ctx.strokeStyle="rgba(40,44,50,0.9)";ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(q)*r*0.78,cy+Math.sin(q)*r*0.78);ctx.stroke();
  ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-r*0.48);ctx.stroke();
  ag_T(ctx,label,x+130,cy+15,{w:800,size:40});ctx.restore();}

/* ---------------------------------------------------------------- the shelf, the cycle, and the card the count goes into */
// a long low oak bench standing against the wall, the front edge of its top at y: what the loop leaves stands on it; its label,
// "In the project", on its front
function pc_shelf(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,fh=70;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+fh+8,w*0.54,18,0.2);
  let g=ctx.createLinearGradient(0,y-16,0,y);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.25),1));g.addColorStop(1,rgba(AG_OAK.base,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+10,y-16);ctx.lineTo(x+w-10,y-16);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(0,y,0,y+fh);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(mix(AG_OAK.base,AG_OAK.dark,0.8),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,fh);
  ctx.fillStyle=rgba(AG_OAK.hi,0.8);ctx.fillRect(x,y,w,2);
  ag_T(ctx,"IN THE PROJECT",x+w/2,y+46,{w:700,size:28,ls:4,align:"center",col:[74,60,44]});ctx.restore();}
// the four steps on an oak ring centred at (cx, cy): Plan at the top, then round clockwise; o.p (0 to 1) how much of the ring is
// drawn, o.pulse {deg, a} a light on it, o.lit (0 to 1 each, the steps the light has reached), o.a. Returns the pills' boxes.
const PC_CYC=[-90,0,90,180];
function pc_cycle(ctx,cx,cy,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return[];ctx.save();ctx.globalAlpha*=a;
  ag_ring(ctx,cx,cy,R,{p:o.p==null?1:o.p,from:-90,arrows:[-45,45,135,225],pulse:o.pulse});
  const out=PC_STEPS.map((s,i)=>{const d=PC_CYC[i]*Math.PI/180,x=cx+Math.cos(d)*R,y=cy+Math.sin(d)*R,w=ag_tw(ctx,s,{w:700,size:30})+54,h=52,l=(o.lit||[])[i]||0,b={x:x-w/2,y:y-h/2,w,h};
    ag_box(ctx,b.x,b.y,w,h,h/2,{edge:l>0.05?AG_OAK.dark:null,edgeA:0.9*l});ag_T(ctx,s,x,y+10,{w:700,size:30,align:"center"});return b;});
  ctx.restore();return out;}
// the card the count goes into: "TO THE GOVERNMENT", a slot for the count; o.k, o.a
function pc_outbox(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||300;if(a<=0.01)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"TO THE GOVERNMENT",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"the census report",x+28,y+92,{w:500,size:28,col:AG.mut});
  ctx.fillStyle="rgba(60,50,40,0.08)";ctx.beginPath();ag_rect(ctx,x+24,y+118,w-48,h-142,16);ctx.fill();ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a person laid on the frame whole
   pc_whole(ctx, a, fn): fn(c) draws into a layer under the same camera; the layer goes on at opacity a, so a person fades as one
   picture, never showing their body through their arm. */
function pc_whole(ctx,a,fn){if(a<=0.01)return;if(a>=0.99){fn(ctx);return;}const cv=ctx.canvas,[bc,bx]=ag_buf("pcWhole",cv.width,cv.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(bc,0,0);ctx.restore();}
