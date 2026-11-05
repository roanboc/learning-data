/* ===== A model, reasoning, hands and a loop: the room's own pieces =====
   Everything this film puts in the series' room (the lab, the agent, the cards) that the shared code doesn't have (prefix ml_):
     ML_ROOM      where things stand: Jun, his goal card, the agent's ring, its three tools (the style prototype's layout, the tools
                  a little to the left so their servers fit behind them)
     ml_jun       Jun at his desk on the left
     ml_tool      a tool's card: its name, what it does, read only by a lock, and its tool server behind it
     ml_parts     the four parts in a row under the kicker, model, reasoning, hands, loop, each lighting in its colour
     ml_cal       a calendar card: a day, or a year; o.from rolls its big words up from the ones before
     ml_byHand    the five small cards of the afternoon by hand, find the tables to fix, with an amber arrow from fix back to query
     ml_clock     a clock on a card, its hands moving through the afternoon
     ml_pages     pale pages without words, streaming into the model
     ml_written   a card the model writes on, letter by letter, with the words that could come next
     ml_cabinet   a cabinet of drawers, "Student records", behind glass
     ml_plan      the model's plan, written line by line, a tick by each line that meets the team's rules
     ml_rules     the team's rules, on a card from Jun's side
     ml_query     a query on its card, and the number it brings back
     ml_recipe    the recipe the steps become, with its test; o.fold folds its steps away
     ML_ANS       the agent's answer by Jun, with its five pieces of evidence (ML_EV) and where each rests once fanned out (ml_evPlaces)
     ml_evItem    one piece of evidence, drawn as the shared answer card draws it, for when it stays behind without the answer
     ml_approve   the line at an answer's foot, "Approved by:", and the name a person signs after it
     ml_small     the agent at any place and size, its steps only at full size
     ml_server    a tool server: a small matte box behind a tool, its cable, and the same plug as every arm (the open standard)
     ml_thought   a violet thought from the model
     ml_globe     a pale globe, "the web"
     ml_columns   two columns on the wall: steps known (a plain script) and steps nobody can write in advance (an agent)
   Words are drawn live with ag_T, at least 28 px, above y 890. */

const ML_ROOM={jun:[300,600,1],ring:[1124,476],tools:[["Catalog",236],["Query",404],["Docs",572]],tx:1520,tw:280,th:[148,148,184],
  goal:[452,212,384],parts:[96,148]};
const ML_COL={model:AG.violet,reasoning:AG.violet,hands:AG.blue,loop:AG.amber};
// the arm from Act to a tool's card (the prototype's three curves)
const ml_arm=i=>{const y=ML_ROOM.tools[i][1]+ML_ROOM.th[i]/2;return[1360,476,1430,476,1470,y,ML_ROOM.tx-4,y];};

/* ---------------------------------------------------------------- Jun at his desk
   ml_jun(ctx, t, o): the oak desk across the bottom left, Jun behind it, cut at its back edge, his arms down out of sight; o.gaze, nod,
   talk, smile; o.a. */
const ML_DESK={x:-80,y:1000,w:800,depth:150};
function ml_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=ML_ROOM.jun,D=ML_DESK;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,talk:o.talk||0,smile:o.smile||0,cut:D.y-D.depth});
  ctx.restore();}

/* ---------------------------------------------------------------- a tool's card, and its server behind it
   ml_tool(ctx, i, o): tool i of ML_ROOM.tools: its name, what it does (ML_TOOLDO), and at its foot a lock and "read only"; o.touch
   (0 to 1) its blue edge while an arm holds it, o.lock (0 to 1) the lock glows, o.server (0 to 1) its tool server, a small matte box
   behind its top right corner with a cable out of the frame, o.plug (0 to 1) the server's top socket shows the open standard's plug,
   o.dx (slides it in from the right), o.a. Returns the card. */
const ML_TOOLDO=["lists the tables","reads the data","the university's definitions"];
function ml_tool(ctx,i,o){o=o||{};const a=o.a==null?1:o.a,x=ML_ROOM.tx+(o.dx||0),y=ML_ROOM.tools[i][1],w=ML_ROOM.tw,h=ML_ROOM.th[i],b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;const sv=o.server||0;
  if(sv>0.01){ctx.save();ctx.globalAlpha*=sv;ml_server(ctx,x+w-60,y-40,{});if((o.plug||0)>0.01)ml_plug(ctx,x+w-5,y-52,Math.PI/2,1,"#3E3F45",o.plug);ctx.restore();}
  const on=o.touch||0;ag_box(ctx,x,y,w,h,20,{edge:on>0.1?AG.blue:null,edgeA:0.9*on,glow:on>0.1?AG.blue:null,glowA:on});
  ag_T(ctx,ML_ROOM.tools[i][0],x+28,y+48,{w:700,size:32});
  const ls=ag_wrap(ctx,ML_TOOLDO[i],w-56,{w:500,size:28});ls.forEach((l,j)=>ag_T(ctx,l,x+28,y+86+j*36,{w:500,size:28,col:AG.mut}));
  const lk=o.lock||0,ly=y+h-34;if(lk>0.01){ctx.save();ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=18*lk;ag_lock(ctx,x+42,ly,28,rgba(AG.blue,1));ctx.restore();}else ag_lock(ctx,x+42,ly,28,rgba(AG.blue,1));
  ag_T(ctx,"read only",x+66,ly+8,{w:600,size:28,col:AG.blue});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the four parts, under the kicker
   ml_parts(ctx, on, o): on[i] (0 to 1) lights part i in its colour; o.a; o.gather (0 to 1) carries them into the ring at o.to
   ([x, y]), each to its place: the model to the middle, reasoning to the band, hands to Act, the loop to the ring; their words go as
   they leave, already read, so nothing small is left to read. Returns the chips. */
const ML_PARTS=[["model",AG.violet],["reasoning",AG.violet],["hands",AG.blue],["loop",AG.amber]];
function ml_parts(ctx,on,o){o=o||{};const a=o.a==null?1:o.a,[x0,y0]=ML_ROOM.parts,h=48,out=[];let x=x0;
  const to=o.to||ML_ROOM.ring,dest=[[to[0],to[1]+40],[to[0],to[1]-12],[to[0]+180,to[1]],[to[0]-180,to[1]]],g=ag_sine(o.gather||0);
  ML_PARTS.forEach(([s,col],i)=>{const w=ag_tw(ctx,s,{w:700,size:28})+44,b={x,y:y0,w,h};out.push(b);x+=w+14;if(a<=0)return;
    const cx=lerp(b.x+w/2,dest[i][0],g),cy=lerp(b.y+h/2,dest[i][1],g),k=lerp(1,0.6,g),l=clamp(on[i]||0,0,1),fa=a*(1-sstep(0.75,1,g));if(fa<=0.01)return;
    ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);
    ag_box(ctx,-w/2,-h/2,w,h,h/2,{a:fa,edge:l>0.05?col:null,edgeA:0.9*l,glow:l>0.05?col:null,glowA:l});
    ctx.save();ctx.globalAlpha*=fa;if(l>0.01){ctx.fillStyle=rgba(col,0.12*l);ctx.beginPath();ag_rect(ctx,-w/2,-h/2,w,h,h/2);ctx.fill();}
    ag_T(ctx,s,0,10,{w:700,size:28,align:"center",col:mix(AG.mut,col,l),a:1-sstep(0.02,0.11,g)});ctx.restore();ctx.restore();});
  return out;}

/* ---------------------------------------------------------------- a calendar card
   ml_cal(ctx, x, y, w, head, big, o): two rings on top, a strip with head (the month, or the day), big words under it; o.sub a
   quieter line, o.col the strip's colour (oak), o.tick a green tick, o.a, o.k (springs in); o.from (the big words before) rolls up
   and out as o.roll goes 0 to 1, and big rolls in under it. Returns its box. */
function ml_cal(ctx,x,y,w,head,big,o){o=o||{};const a=o.a==null?1:o.a,h=o.sub?196:156,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});const col=o.col||AG_OAK.dark;
  ctx.save();ctx.beginPath();ag_rect(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x,y,w,54);ctx.restore();
  for(const rx of [x+w*0.28,x+w*0.72]){ctx.fillStyle="#5A564F";ctx.beginPath();ag_rect(ctx,rx-5,y-14,10,30,5);ctx.fill();}
  ag_T(ctx,head,x+w/2,y+38,{w:700,size:28,align:"center",col:[255,255,255]});
  const ru=o.from==null?1:ag_sine(clamp(o.roll||0,0,1));
  if(ru<1){ctx.save();ctx.beginPath();ctx.rect(x,y+56,w,h-56);ctx.clip();ag_T(ctx,o.from,x+w/2,y+112-72*ru,{w:800,size:44,align:"center",a:1-ru});
    ag_T(ctx,big,x+w/2,y+112+72*(1-ru),{w:800,size:44,align:"center",a:ru});ctx.restore();}
  else ag_T(ctx,big,x+w/2,y+112,{w:800,size:44,align:"center"});
  if(o.sub)ag_T(ctx,o.sub,x+w/2,y+160,{w:600,size:28,align:"center",col:AG.mut});
  if(o.tick)ag_tick(ctx,x+w-34,y+h-34,26,rgba(AG.green,clamp(o.tick,0,1)),4);
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the afternoon by hand
   ml_byHand(ctx, t, k, o): five small cards along the wall from (o.x, o.y), each in as k[i] (0 to 1) says; o.loop (0 to 1) draws
   the amber arrow under them from "fix" back to "query" and sends a light round it; o.into (0 to 1) carries them into the ring at o.to. */
const ML_HAND=["find the tables","read the rules","query","check","fix"];
function ml_byHand(ctx,t,k,o){o=o||{};const a=o.a==null?1:o.a,x0=o.x||560,y0=o.y||600,h=56,gap=26,out=[];let x=x0;
  for(const s of ML_HAND){const w=ag_tw(ctx,s,{w:700,size:28})+44;out.push({x,y:y0,w,h,s});x+=w+gap;}
  if(a<=0)return out;const into=ag_sine(o.into||0),to=o.to||ML_ROOM.ring;ctx.save();ctx.globalAlpha*=a;
  // the arrow: from fix's foot, under check, back up to query
  const L=clamp(o.loop||0,0,1);if(L>0&&into<0.3){const f=out[4],q=out[2],p=[f.x+f.w/2,f.y+h+6,f.x+f.w/2,f.y+h+110,q.x+q.w/2,q.y+h+110,q.x+q.w/2,q.y+h+10];
    ctx.save();ctx.globalAlpha*=1-into/0.3;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=5;ctx.lineCap="round";ag_bzPath(ctx,p,0,ag_sine(L));ctx.stroke();
    if(L>0.98){const e=ag_bz(p,1),e0=ag_bz(p,0.96);ag_arrowHead(ctx,e[0],e[1],Math.atan2(e[1]-e0[1],e[0]-e0[0]),14,rgba(AG.amber,0.95));
      const u=(t*0.6)%1,q2=ag_bz(p,u);ctx.shadowColor=rgba(AG.amber,0.7);ctx.shadowBlur=14;ctx.fillStyle=rgba(AG.amber,1);ctx.beginPath();ctx.arc(q2[0],q2[1],8,0,TAU);ctx.fill();}
    ctx.restore();}
  out.forEach((b,i)=>{const ki=clamp(k[i]||0,0,1);if(ki<=0)return;const sp=ag_spr(ki,0,1),cx=lerp(b.x+b.w/2,to[0]+(i-2)*14,into),cy=lerp(b.y+h/2,to[1],into),
      s=lerp(1,0.3,into)*lerp(0.6,1,clamp(sp,0,1.2)),fa=ki*(1-sstep(0.7,1,into));if(fa<=0.01)return;
    ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);ag_box(ctx,-b.w/2,-h/2,b.w,h,16,{a:fa,edge:i===4&&L>0?AG.amber:null,edgeA:0.6});
    ag_T(ctx,b.s,0,10,{w:700,size:28,align:"center",a:fa});ctx.restore();});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- a clock on a card: hour (1 to 5 through the afternoon), a label under the face */
function ml_clock(ctx,x,y,hour,label,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||260,h=270;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,22,{});const cx=x+w/2,cy=y+104,r=74;
  ctx.fillStyle="#F8F6F2";ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(60,56,50,0.5)";ctx.lineWidth=3;ctx.stroke();
  for(let i=0;i<12;i++){const an=i/12*TAU;ctx.strokeStyle="rgba(60,56,50,0.55)";ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(cx+Math.sin(an)*(r-12),cy-Math.cos(an)*(r-12));ctx.lineTo(cx+Math.sin(an)*(r-4),cy-Math.cos(an)*(r-4));ctx.stroke();}
  const hA=hour/12*TAU,mA=(hour%1)*TAU;ctx.lineCap="round";
  ctx.strokeStyle="#3A3733";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(hA)*r*0.5,cy-Math.cos(hA)*r*0.5);ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(mA)*r*0.78,cy-Math.cos(mA)*r*0.78);ctx.stroke();
  ctx.fillStyle=rgba(AG.amber,1);ctx.beginPath();ctx.arc(cx,cy,6,0,TAU);ctx.fill();
  ag_T(ctx,label,cx,y+h-34,{w:700,size:30,align:"center"});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- pages without words, streaming into the model at (x, y), r its size; a (0 to 1) */
function ml_pages(ctx,t,x,y,r,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<14;i++){const u=((t*0.32+i/14)%1),sy=170+((i*137)%560),p=[-80,sy,420,sy,x-420,y+(sy-y)*0.25,x-r*0.4,y],q=ag_bz(p,ag_sine(u)),q0=ag_bz(p,ag_sine(Math.max(0,u-0.01)));
    const s=lerp(1,0.25,sstep(0.6,1,u)),fa=sstep(0,0.12,u)*(1-sstep(0.88,1,u));if(fa<=0.01)continue;
    ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(Math.atan2(q[1]-q0[1],q[0]-q0[0])*0.3+Math.sin(i*1.7)*0.12);ctx.scale(s,s);
    ag_box(ctx,-34,-44,68,88,6,{a:fa*0.92});ctx.strokeStyle="rgba(140,132,120,"+(0.25*fa)+")";ctx.lineWidth=3;
    for(let l=0;l<5;l++){ctx.beginPath();ctx.moveTo(-22,-28+l*13);ctx.lineTo(l===4?4:22,-28+l*13);ctx.stroke();}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- a card the model writes on
   ml_written(ctx, x, y, w, text, k, o): the text in violet, letter by letter as k goes 0 to 1, a caret while it writes; o.cands,
   the words that could come next, wait one under another after the text, faint (o.candA[i], 0 to 1, as each comes), and as o.pick
   goes 0 to 1 the first darkens in its place and the others go; o.kick; o.h; o.ka springs it in; o.a. */
function ml_written(ctx,x,y,w,text,k,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||((o.kick?150:112)+(o.cands?(o.cands.length-1)*48:0));if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));ag_box(ctx,x,y,w,h,20,{edge:AG.violet,edgeA:0.45});let yy=y+68;
  if(o.kick){ag_T(ctx,String(o.kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});yy=y+108;}
  const n=Math.round(clamp(k,0,1)*text.length),s=text.slice(0,n),sz=o.size||34;ag_T(ctx,s,x+28,yy,{w:700,size:sz,col:AG.violet});
  const ex=x+28+ag_tw(ctx,s,{w:700,size:sz});if(k>0&&k<1){ctx.fillStyle=rgba(AG.violet,0.8);ctx.fillRect(ex+4,yy-sz*0.78,3,sz*0.9);}
  // the words that could come next, faint, one under another; the picked one moves up into its place and darkens, the others go
  if(o.cands){const pk=clamp(o.pick||0,0,1),sp=ag_tw(ctx," ",{w:700,size:sz});o.cands.forEach((wd,i)=>{const ca=clamp((o.candA||[])[i]==null?1:o.candA[i],0,1)*(i===0?1:1-pk);if(ca<=0.01)return;
    const ty=i===0?lerp(yy,yy,pk):yy+i*48;ag_T(ctx,wd,ex+sp,ty,{w:700,size:sz,col:AG.violet,a:ca*(i===0?lerp(0.32,1,pk):0.32)});});}
  ctx.restore();return{x,y,w,h,ex};}

/* ---------------------------------------------------------------- a cabinet of drawers, behind glass: "Student records"; o.lit (0 to 1) */
function ml_cabinet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+h+10,w*0.6,18,0.22);
  ag_soft(ctx,c=>ag_rect(c,x,y,w,h,10),[176,172,164],[226,224,218],x+w*0.75,y+40,w*1.1,"rgba(46,38,28,0.35)",18,0.6);
  const n=4,dh=(h-40)/n;for(let i=0;i<n;i++){const dy=y+20+i*dh;ag_soft(ctx,c=>ag_rect(c,x+16,dy+6,w-32,dh-12,6),[196,192,184],[236,234,230],x+w*0.7,dy+10,w,"rgba(46,38,28,0.3)",8,0.6);
    ctx.fillStyle="#6A665F";ctx.beginPath();ag_rect(ctx,x+w/2-30,dy+dh/2-6,60,12,6);ctx.fill();}
  ag_glass(ctx,x-40,y-40,w+80,h+40,{label:""});
  ag_T(ctx,o.label||"Student records",x+w/2,y+h+56,{w:700,size:30,align:"center",col:AG.ink});
  ctx.restore();}

/* ---------------------------------------------------------------- the model's plan
   ml_plan(ctx, x, y, w, lines, o): a card with a violet edge, "Plan", and lines, each written in as o.k[i] (0 to 1) says, in ink,
   or in violet when o.fresh[i]; o.tick[i] (0 to 1) a green tick by line i; o.amber[i] marks a line amber (with a warning). Returns
   the card and each line's y. */
function ml_plan(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=44,gap=10,inner=w-56-50;
  // each line wrapped to the card, its second part indented under the words after its number
  const L=lines.map(l=>{const m=l.match(/^(\d+) /),pre=m?m[0]:"",ind=m?ag_tw(ctx,pre,{w:600,size:30}):0,ws=ag_wrap(ctx,l.slice(pre.length),inner-ind,{w:600,size:30});return{pre,ind,ws};});
  let yy=y+96;const ys=L.map(e=>{const r=yy;yy+=e.ws.length*lh+gap;return r;}),h=yy-y+12,out={x,y,w,h,ys};if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;
  if(o.ka!=null)ag_about(ctx,x+w/2,y,lerp(0.4,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:AG.violet,edgeA:0.8});ag_T(ctx,o.title||"Plan",x+28,y+52,{w:800,size:34,col:AG.violet});
  L.forEach((e,i)=>{const k=clamp((o.k||[])[i]==null?1:o.k[i],0,1);if(k<=0)return;const fresh=o.fresh&&o.fresh[i],am=o.amber&&o.amber[i],col=am?AG.amber:fresh?AG.violet:AG.ink;
    const full=e.pre+e.ws.join(" "),n=Math.round(k*full.length);let used=0;
    const parts=[e.pre+e.ws[0]].concat(e.ws.slice(1));parts.forEach((pt,j)=>{const take=clamp(n-used,0,pt.length);used+=pt.length+(j?1:0);if(take<=0)return;
      ag_T(ctx,pt.slice(0,take),x+28+(j?e.ind:0),ys[i]+10+j*lh,{w:600,size:30,col});});
    const tk=(o.tick||[])[i]||0;if(tk>0)ag_tick(ctx,x+w-40,ys[i],26,rgba(AG.green,tk),4);if(am)ag_warn(ctx,x+w-40,ys[i],28,rgba(AG.amber,1));});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the team's rules, and a query with its number
   ml_rules(ctx, x, y, w, o): "Team rules" and its three lines, each in as o.k[i] (0 to 1) says; o.tail (as ag_textCard's), o.ka, o.a.
   ml_query(ctx, x, y, w, kick, text, num, o): a card with a kick (o.kickCol), the words, and a number under them in o.col (orange:
   data come back), o.numA; o.note (amber, at the right of the number), o.noteA; o.edge; o.ka; o.a. Both return their box. */
const ML_RULES=["only the university's tools","only reading","evidence for every answer"];
function ml_rules(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=88+ML_RULES.length*44,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  let tail=null;if(o.tail){const T_=o.tail,m=x+28+(w-56)*(T_.at==null?0.2:T_.at);tail={side:T_.side||"bottom",a:m-24,b:m+24,px:T_.px,py:T_.py};}
  if(o.ka!=null)ag_about(ctx,tail?tail.px:x+w/2,tail?tail.py:y+h/2,lerp(0.5,1,o.ka));
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,22,tail),b,{});ag_T(ctx,"TEAM RULES",x+28,y+50,{w:700,size:28,ls:4,col:AG.mut});
  ML_RULES.forEach((r,i)=>{const k=clamp((o.k||[])[i]==null?1:o.k[i],0,1);if(k>0)ag_T(ctx,"· "+r,x+28,y+96+i*44,{w:600,size:30,a:k});});
  ctx.restore();return b;}
function ml_query(ctx,x,y,w,kick,text,num,o){o=o||{};const a=o.a==null?1:o.a,ls=ag_wrap(ctx,text,w-56,{w:600,size:30}),h=92+ls.length*40+(num?64:0),b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.8});ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:o.kickCol||AG.blue});
  ls.forEach((l,i)=>ag_T(ctx,l,x+28,y+92+i*40,{w:600,size:30}));
  if(num){ag_T(ctx,num,x+28,y+h-30,{w:800,size:44,col:o.col||AG.orange,a:o.numA==null?1:o.numA});
    if(o.note)ag_T(ctx,o.note,x+w-28,y+h-36,{w:700,size:30,col:AG.amber,align:"right",a:o.noteA==null?1:o.noteA});}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the recipe: the steps, once they're known
   ml_recipe(ctx, x, y, w, o): a card with a blue edge, "Recipe" and "Census-day count", then its steps, each in as o.k[i] (0 to 1)
   says, the test in green with a tick by it as o.tick (0 to 1) says; o.fold (0 to 1) folds the steps away and the card closes up to
   its title; o.foot a line at its foot (o.footA); o.ka springs it in; o.a. Returns its box, and ly(i), the baseline of step i. */
const ML_RECIPE=["1 Students' table","2 Rule: as on census day","3 Count","Test: total = census report"];
function ml_recipe(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,fold=ag_sine(clamp(o.fold||0,0,1)),n=ML_RECIPE.length,fh=o.foot?44:0,
    h=136+(n*42+10)*(1-fold)+fh,b={x,y,w,h,ly:i=>y+150+i*42};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.ka!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.ka));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.85});ag_T(ctx,"RECIPE",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"Census-day count",x+28,y+100,{w:700,size:36});
  const la=1-clamp(fold*2.5,0,1);if(la>0.01){ctx.save();ctx.beginPath();ctx.rect(x,y+110,w,h-110-fh);ctx.clip();
    for(let i=0;i<n;i++){const k=clamp((o.k||[])[i]==null?1:o.k[i],0,1)*la;if(k>0.01)ag_T(ctx,ML_RECIPE[i],x+28,y+150+i*42,{w:600,size:30,a:k,col:i===3?AG.green:AG.ink});}
    const tk=(o.tick||0)*la;if(tk>0.01)ag_tick(ctx,x+w-46,y+150+3*42-10,26,rgba(AG.green,tk),4);ctx.restore();}
  if(o.foot)ag_T(ctx,o.foot,x+28,y+h-28,{w:600,size:28,col:AG.mut,a:o.footA==null?1:o.footA});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the answer by Jun, and its evidence
   The agent's answer rests by Jun (ML_ANS), its five pieces of evidence (ML_EV) clipped behind it until they fan out to its right,
   one under another: the tables it read and the rule (blue, its tools), both queries (the first amber: its round fell short), and the
   check (green). ml_evPlaces(ctx) gives where each rests once out, {x, y, w, h, r}; ml_evItem(ctx, e, o) draws one there as the shared
   card draws it (o.dx, o.dy move it; o.a), for once the answer has gone and its evidence stays. */
const ML_ANS={x:452,y:232,w:560,ew:460,gap:12};
const ML_ANSW={kick:"Answer",title:"18,412 students",sub:"454 more than last year's 17,958"};
const ML_EV=[{kick:"Tables read",title:"Students",col:AG.blue},{kick:"Rule",title:"Docs · census day",col:AG.blue},
  {kick:"Query 1",title:"as they are today · 17,936",col:AG.amber},{kick:"Query 2",title:"on 31 March · 18,412",col:AG.green},
  {kick:"Check",title:"failed, then passed",col:AG.green}];
function ml_evPlaces(ctx){const A=ML_ANS,r=ag_evidence(ctx,A.x,A.y,A.w,ML_ANSW,ML_EV,{side:"right",ew:A.ew,gap:A.gap,open:1,a:0});
  return{card:r.card,items:r.items.map((e,i)=>({x:e.to.x,y:e.to.y,w:e.to.w,h:e.to.h,r:(i%2?1:-1)*0.02}))};}
function ml_evItem(ctx,e,it,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const c=it.col||AG.mut,lines=ag_wrap(ctx,it.title||"",e.w-48,{w:600,size:28}).slice(0,3);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(e.x+(o.dx||0)+e.w/2,e.y+(o.dy||0)+e.h/2);ctx.rotate(e.r);ctx.translate(-e.w/2,-e.h/2);
  ag_box(ctx,0,0,e.w,e.h,16,{edge:c,edgeA:0.55,lw:2});let yy=24;
  if(it.kick){ag_T(ctx,String(it.kick).toUpperCase(),24,yy+22,{w:700,size:28,ls:3,col:c});yy+=36;}
  for(const l of lines){ag_T(ctx,l,24,yy+26,{w:600,size:28});yy+=36;}ctx.restore();}
// piecewise straight: the value at t of [[t0, v0], [t1, v1], ...]
function ml_pw(t,pts){if(t<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++)if(t<pts[i][0]){const [a0,v0]=pts[i-1],[a1,v1]=pts[i];return lerp(v0,v1,(t-a0)/(a1-a0));}return pts[pts.length-1][1];}

/* ---------------------------------------------------------------- "Approved by:", and a name signed after it
   ml_approve(ctx, x, y, w, name, k, o): a slim card, "Approved by:" and a dotted line; as k goes 0 to 1 the name is signed on the
   line, letter by letter, a pen at its end while it writes; o.k springs it in, o.a. */
function ml_approve(ctx,x,y,w,name,k,o){o=o||{};const a=o.a==null?1:o.a,h=78,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));ag_box(ctx,x,y,w,h,20,{});
  const lx=x+28+ag_tw(ctx,"Approved by:",{w:700,size:30})+18;ag_T(ctx,"Approved by:",x+28,y+50,{w:700,size:30,col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.28)";ctx.lineWidth=2;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(lx,y+58);ctx.lineTo(x+w-28,y+58);ctx.stroke();ctx.setLineDash([]);
  const n=Math.round(clamp(k,0,1)*name.length),s=name.slice(0,n);if(n>0)ag_T(ctx,s,lx+8,y+50,{w:800,size:34});
  if(k>0&&k<1)ag_pen(ctx,lx+8+ag_tw(ctx,s,{w:800,size:34})+14,y+34,30,rgba(AG.ink,0.85));
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the agent at any place and size
   ml_small(ctx, t, cx, cy, R, r, o): its ring (R) round the sphere (r), as ag_loop draws them; its steps (o.stepA) and "Model" on the
   band (o.label, 0 to 1) only at full size; o.core, o.think, o.lit, o.col, o.pulse, o.a. ML_REST: where it rests, small, at the top
   right, once it has brought its answer. */
const ML_REST=[1720,300,100,48];
function ml_small(ctx,t,cx,cy,R,r,o){o=o||{};const a=o.a==null?1:o.a,sa=o.stepA==null?1:o.stepA;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_loop(ctx,cx,cy,{t,R,r,core:o.core,think:o.think,label:null,stepA:[sa,sa,sa],lit:o.lit,col:o.col,pulse:o.pulse});
  const la=o.label||0;if(la>0.01)ag_T(ctx,"Model",cx,cy+r*0.6,{w:700,size:28,align:"center",col:AG.label,a:la});
  ctx.restore();}

/* ---------------------------------------------------------------- a tool server and the open standard's plug
   ml_server(ctx, x, y, o): a small matte box whose left side meets a tool's card at (x, y): a cable running right out of the frame;
   o.label ("tool server"), o.a. ml_plug(ctx, x, y, ang, s, col, a): the plug every arm ends in and every server takes. */
function ml_server(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=110,h=86;
  ctx.strokeStyle="#4C4C52";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+w-8,y+h*0.6);ctx.bezierCurveTo(x+w+40,y+h*0.6,x+w+20,y+h+40,x+w+80,y+h+60);ctx.stroke();
  ag_soft(ctx,c=>ag_rect(c,x,y,w,h,12),[200,200,204],[240,240,244],x+w*0.7,y+16,120,"rgba(46,38,28,0.35)",12,0.7);
  ctx.fillStyle=rgba(AG.blue,0.85);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+w-22,y+20+i*16,4,0,TAU);ctx.fill();}
  ctx.restore();}
function ml_plug(ctx,x,y,ang,s,col,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  ctx.fillStyle=col||"#3E3F45";ctx.beginPath();ag_rect(ctx,-14,-13,22,26,6);ctx.fill();ctx.fillStyle="#B8B2A6";ctx.fillRect(8,-8,10,4);ctx.fillRect(8,4,10,4);ctx.restore();}

/* ---------------------------------------------------------------- a violet thought from the model: a cloud of a card with small dots down to (px, py) */
function ml_thought(ctx,x,y,text,a,o){o=o||{};if(a<=0.01)return null;const w=ag_tw(ctx,text,{w:700,size:32})+64,h=80;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.5,1,o.k));
  if(o.px!=null){for(let i=0;i<3;i++){const u=(i+1)/4,cx=lerp(x+w*0.25,o.px,u),cy=lerp(y+h,o.py,u),r=lerp(12,6,u);ag_box(ctx,cx-r,cy-r,2*r,2*r,r,{edge:AG.violet,edgeA:0.5});}}
  ag_box(ctx,x,y,w,h,40,{edge:AG.violet,edgeA:0.8});ag_T(ctx,text,x+w/2,y+h/2+11,{w:700,size:32,align:"center",col:AG.violet});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a pale globe, "the web" (meridians and parallels on a matte sphere): its
   words under it, or at its left (o.side "left") */
function ml_globe(ctx,x,y,r,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),[214,222,228],[250,252,254],x+r*0.35,y-r*0.4,r*1.2,"rgba(46,38,28,0.25)",14,0.9);
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(90,110,128,0.45)";ctx.lineWidth=2;
  for(const k of [-0.6,-0.2,0.2,0.6]){ctx.beginPath();ctx.ellipse(x,y+k*r,r*Math.sqrt(1-k*k),r*0.12*Math.sqrt(1-k*k),0,0,TAU);ctx.stroke();}
  for(const k of [0.25,0.6,0.92]){ctx.beginPath();ctx.ellipse(x,y,r*k,r,0,0,TAU);ctx.stroke();}ctx.restore();
  if(o.side==="left")ag_T(ctx,"the web",x-r-22,y+11,{w:700,size:30,align:"right",col:AG.mut});else ag_T(ctx,"the web",x,y+r+46,{w:700,size:30,align:"center",col:AG.mut});ctx.restore();}

/* ---------------------------------------------------------------- two columns on the wall
   ml_columns(ctx, a, o): "Steps known" (blue) on the left, "Steps nobody can write in advance" (violet) on the right; o.x0, o.x1 their
   middles, o.y their heads' top, o.h their height, o.aL and o.aR each one's own fade. Returns where each column's contents go. */
function ml_columns(ctx,a,o){o=o||{};const x0=o.x0||620,x1=o.x1||1300,y=o.y||170,w0=440,w1=560,h=o.h||640,out={left:[x0,y+260],right:[x1,y+260]};if(a<=0.01)return out;
  ctx.save();ctx.globalAlpha*=a;const aL=o.aL==null?1:o.aL,aR=o.aR==null?1:o.aR;
  for(const [cx,w,col,s,ca] of [[x0,w0,AG.blue,"Steps known",aL],[x1,w1,AG.violet,"Steps nobody can write in advance",aR]]){if(ca<=0.01)continue;ctx.save();ctx.globalAlpha*=ca;
    ctx.fillStyle=rgba(col,0.06);ctx.beginPath();ag_rect(ctx,cx-w/2,y,w,h,26);ctx.fill();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=2;ctx.setLineDash([10,10]);ctx.stroke();ctx.setLineDash([]);
    const lines=ag_wrap(ctx,s,w-60,{w:800,size:34});lines.forEach((l,i)=>ag_T(ctx,l,cx,y+62+i*44,{w:800,size:34,align:"center",col}));ctx.restore();}
  ctx.restore();return out;}
