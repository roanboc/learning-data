/* ===== A mandate, written and enforced: the world =====
   The film's places and the small pieces every chapter uses. Every name here starts with wm_ or WM_.
     places       wmLab (the lab by day: Jun's desk at the left, test as an oak tray in the middle, production behind glass at the right),
                  wmNight (the same lab at night, its lamp in the far left corner: one room with wmLab, so the camera glides on and only
                  the light changes), wmBoard (the quiet wall, for the page and the diagrams)
     wm_night     the night's light over what stands in the lab, drawn before it; the words and cards come after it, at full contrast
     wm_scr       draw in screen space, whatever the camera is doing
     wm_tag       a tag at the top left: where and when
     wm_pillAt    a pill that springs in at t0 and fades at t1
     wm_cardAt    a card (ag_textCard) that springs in at t0 and fades at t1
     wm_dash      a dashed rounded edge, for what is only proposed or a draft
     wm_wrap      words wrapped in as few lines as the width allows, even, and in two lines after a comma or a full stop where one is near
     wm_pop       a soft spring in, for anything drawn by fn
     wm_fade      something made of parts, faded as one (the agent, a person): drawn whole on a scratch canvas, then laid on
     wm_agent     the census agent: its sphere, its light, and its badge on a lanyard ("census agent"), faded as one; wm_band, its band's
                  light again over the night
     wm_clock     the lab's wall clock: its hands at a time of day, in minutes after midnight
     wm_lab       the lab's things: Jun's desk and screen (and Jun, by day), the clock, test (the oak tray, with the build's tables and its
                  count) and production (behind the glass), and their labels; the agent and the cards are the scenes' own */

const WM_LAMP=[96,772];
// the marble quieter where the film puts its cards: over Jun's desk (the report), above the tray (the code and the checks), at the top right
const WM_QUIET=[[400,320,360,220,0.75],[1080,220,380,150,0.6],[1660,140,300,90,0.4]];
AG_PLACES.wmLab=c=>ag_paintLab(c,{quiet:WM_QUIET});
AG_PLACES.wmNight=c=>ag_paintLab(c,{night:true,lamp:WM_LAMP,quiet:WM_QUIET});
AG_ROOMS.wmNight="wmLab";                                   // the lab by night is the lab: its camera glides on, never jumps
AG_PLACES.wmBoard=c=>ag_paintLab(c,{seed:3,quiet:[[960,330,980,300,0.8],[960,620,900,160,0.4]]});
const wm_night=x=>ag_roomLight(x,1,{night:true,lamp:WM_LAMP});
// the bare room keeps the light every shot of it draws over its things
AG_BARE.wmLab=c=>ag_roomLight(c,1);
AG_BARE.wmNight=c=>wm_night(c);

const WM_UNI="The university · today";

function wm_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place's tag, top left, in screen space (as the module's films tag a place); o.x, o.y, o.dark (on the night lab)
function wm_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
// two tags in turn at the same place: the first until t1, the second from it, crossed over 0.4 s
function wm_tags(ctx,S,tt,list){wm_scr(ctx,S,()=>{list.forEach((g,i)=>{const nx=list[i+1],a=ag_in(tt,g[1],0.4)*(nx?1-ag_in(tt,nx[1],0.4):1)*(g[2]==null?1:g[2]);wm_tag(ctx,g[0],a);});});}
function wm_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));const b=ag_pill(ctx,x,y,text,o||{});ctx.restore();return b;}
function wm_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return ag_textCard(ctx,x,y,w,words,{measure:true});
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// the shared wrap (ag_wrap) fills each line in turn, which can leave one short word on the last. This keeps its number of lines; in
// two lines it breaks where the lines are most even, after a comma or a full stop unless that leaves them much less even
function wm_wrap(ctx,s,maxW,o){const g=ag_wrap(ctx,s,maxW,o),n=g.length;if(n<2)return g;
  if(n===2){const ws=String(s).split(" ");let best=null,bs=1e9;for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(" "),b=ws.slice(i).join(" "),
      wa=ag_tw(ctx,a,o),wb=ag_tw(ctx,b,o);if(wa>maxW||wb>maxW)continue;const sc=Math.abs(wa-wb)+(/[,.;:]$/.test(a)?0:0.35*maxW);
      if(sc<bs){bs=sc;best=[a,b];}}return best||g;}
  let lo=maxW*0.4,hi=maxW;for(let i=0;i<14;i++){const m=(lo+hi)/2;if(ag_wrap(ctx,s,m,o).length>n)lo=m;else hi=m;}return ag_wrap(ctx,s,hi,o);}
// a dashed edge inside a card's own: what is proposed, or only a draft, has no solid edge yet
function wm_dash(ctx,x,y,w,h,r,col,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col||AG.mut,0.8);ctx.lineWidth=2.4;
  rr(ctx,x+5,y+5,w-10,h-10,Math.max(4,r-4));ctx.stroke();ctx.restore();}
// a soft spring in, at (x, y): fn(a) draws it; o.t1 fades it out, o.from its first scale
function wm_pop(ctx,x,y,t,t0,fn,o){o=o||{};const a=ag_in(t,t0,o.d||0.4)*(o.t1==null?1:1-ag_in(t,o.t1,0.5));if(a<=0)return;const k=Math.min(1.04,ag_spr(t,t0,o.s||0.5));
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(o.from||0.85,1,k));fn(a);ctx.restore();}
// something made of parts, faded as one: drawn whole on a scratch canvas, then laid on at opacity a. Drawn straight at a part opacity,
// each part fades on its own, and the agent's dark band shows through its sphere like a ghost (Skills and workflows' sw_fade)
function wm_fade(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}const [bc,bx]=ag_buf("wmFade",ctx.canvas.width,ctx.canvas.height);
  bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,bc.width,bc.height);bx.setTransform(ctx.getTransform());fn(bx);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}

/* ---------------------------------------------------------------- the census agent
   The sphere with its violet band, its light on the wall and its shadow on the floor, and its badge on a blue lanyard hanging from the
   sphere's foot: "census agent", its own name in every tool. o.a (faded as one), o.think, o.core, o.badge (0..1, how far its badge is
   down; 1 by default), o.ph (its band's phase), o.floor (where its shadow falls), o.loop (0..1: its ring of Plan, Act and Check drawn
   round it, amber while it goes round again), o.ringP (how much of the ring is drawn), o.pulse (the light going round it) */
const WM_BADGE="census agent";
function wm_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;wm_fade(ctx,a,c=>{
  if(o.loop>0){c.save();c.globalAlpha*=o.loop;ag_ring(c,x,y,r*2.7,{p:o.ringP==null?1:o.ringP,from:-120,pulse:o.pulse});c.restore();}
  if(o.light!==false)ag_modelLight(c,x,y,r,0.8,o.floor||y+250);
  ag_model(c,x,y,r,{t:t+(o.ph||0),core:o.core==null?0.75:o.core,think:o.think||0,label:null});
  const b=o.badge==null?1:o.badge;if(b>0)ag_badge(c,x,y+r+2,WM_BADGE,{t,drop:lerp(26,58,ag_sine(b)),a:clamp(b*3,0,1)});});}
// the band's light again, over the night's light (the module's night pass dims everything drawn before it)
function wm_band(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ag_model(ctx,x,y,r,{only:"light",t:t+(o.ph||0),core:o.core==null?0.75:o.core,think:o.think||0,a});}

/* ---------------------------------------------------------------- the lab's wall clock: a white face, twelve ticks, two hands */
function wm_clock(ctx,x,y,r,mins,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.28)";ctx.shadowBlur=16;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;ctx.fillStyle="#F4F2EE";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle="#3A3B40";ctx.lineWidth=r*0.09;ctx.beginPath();ctx.arc(x,y,r-r*0.045,0,TAU);ctx.stroke();
  ctx.lineCap="round";for(let i=0;i<12;i++){const d=i*TAU/12,l=i%3?r*0.1:r*0.17;ctx.strokeStyle=i%3?"rgba(58,59,64,0.55)":"#3A3B40";ctx.lineWidth=i%3?2:3.2;
    ctx.beginPath();ctx.moveTo(x+Math.sin(d)*(r*0.8-l),y-Math.cos(d)*(r*0.8-l));ctx.lineTo(x+Math.sin(d)*r*0.8,y-Math.cos(d)*r*0.8);ctx.stroke();}
  const m=((mins%720)+720)%720,ah=m/720*TAU,am=(m%60)/60*TAU;
  ctx.strokeStyle="#2E2F34";ctx.lineWidth=r*0.085;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ah)*r*0.46,y-Math.cos(ah)*r*0.46);ctx.stroke();
  ctx.lineWidth=r*0.055;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(am)*r*0.68,y-Math.cos(am)*r*0.68);ctx.stroke();
  ctx.fillStyle="#2E2F34";ctx.beginPath();ctx.arc(x,y,r*0.07,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the lab
   Jun's desk across the left, his screen at its right end; the wall clock at the top right; test, an oak tray on the floor in the
   middle, where the night build runs on a copy of the data; production behind a pane of glass at the right, which the agent only reads.
   The agent hangs over the tray's left end (WM_L.agent). Positions are the lab's, in the 1920 x 1080 frame. */
const WM_L={desk:[60,868,760],jun:[370,590,0.84],screen:[598,616,222,138],clock:[1666,132,50],tray:[1120,790,560],glass:[1460,236,420,612],agent:[980,500,60],
  report:[1262,642],count:[1186,752],prodCount:[1670,716]};
// the build's tables, as small slabs: in the tray (test) and behind the glass (production); k, how lit
function wm_slabs(ctx,x,y,n,col,k){for(let i=0;i<n;i++){const sx=x+i*112,g=ctx.createLinearGradient(0,y-26,0,y);g.addColorStop(0,"#F1EFEA");g.addColorStop(1,"#D9D5CD");
    ctx.save();ctx.shadowColor="rgba(40,32,24,0.22)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle=g;rr(ctx,sx,y-26,92,26,6);ctx.fill();ctx.restore();
    ctx.fillStyle=rgba(col||AG.blue,0.35+0.4*(k||0));ctx.fillRect(sx+8,y-21,76,4);ctx.fillStyle="rgba(86,92,100,0.25)";for(let j=0;j<2;j++)ctx.fillRect(sx+8,y-13+j*6,60-j*18,2.5);}}
// three students who fall out of the count and come back: out 0..1 drops them off the tray's front edge, back 0..1 puts them in again
function wm_three(ctx,x,y,out,back,a){a=a==null?1:a;if(a<=0||out<=0)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<3;i++){const u=ag_sine(clamp(out*1.4-i*0.18,0,1)),v=ag_sine(clamp(back*1.4-i*0.18,0,1)),fx=x+i*30,fy=y,tx=x-96+i*30,ty=y+52,
      px=lerp(lerp(fx,tx,u),fx,v),py=lerp(lerp(fy,ty,u),fy,v)-Math.sin(Math.PI*(u<1?u:v))*26,col=mix(AG.amber,AG.green,v);
    ctx.fillStyle=rgba(col,0.92);ctx.beginPath();ctx.arc(px,py,9,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=1.5;ctx.stroke();}
  ctx.restore();}
/* the lab's things, by day or by night (o.night): Jun's desk and screen (o.screen: "dark", "report" or "pr" rows), Jun himself
   (o.jun 0..1, faded as one; o.junT his own time for breathing), the clock (o.time, minutes after midnight; o.clockA), the tray with the
   build's tables (o.testLit 0..1), production's tables behind the glass (o.prodLit 0..1). Then o.things(ctx), drawn in the room's light
   (the agent), then the light, then o.after(ctx) at full contrast (the band's light again, the cards) */
function wm_lab(ctx,S,t,o){o=o||{};const L=WM_L,[dx,dy,dw]=L.desk,[sx,sy,sw,sh]=L.screen,[tx,ty,tw]=L.tray,[gx,gy,gw,gh]=L.glass;
  // production, behind its glass: three slabs on a low plinth
  ctx.save();ag_floorShadow(ctx,gx+gw/2+AG.sdx*2,gy+gh-60,gw*0.42,16,0.18);ctx.fillStyle="#E4E0D8";rr(ctx,gx+40,gy+gh-150,gw-80,92,10);ctx.fill();
  ctx.fillStyle="rgba(46,38,28,0.12)";ctx.fillRect(gx+40,gy+gh-66,gw-80,8);ctx.restore();
  wm_slabs(ctx,gx+52,gy+gh-160,3,AG.blue,o.prodLit||0);
  ag_glass(ctx,gx,gy,gw,gh,{label:null});
  // Jun's desk and his screen
  ag_desk(ctx,dx,dy,dw,{});
  ag_screen(ctx,sx,sy,sw,sh,{stand:dy-70-sy-sh+6,bg:o.night&&o.screen==="dark"?"#2A2C33":"#EEF0EE",draw:(c,x0,y0,w0,h0)=>wm_screen(c,x0,y0,w0,h0,o.screen||"dark")});
  if(o.jun>0)wm_fade(ctx,o.jun,c=>ag_person(c,"jun",L.jun[0],L.jun[1],L.jun[2],{t:o.junT==null?t:o.junT,cut:dy-70,gaze:o.junGaze||[5,1],smile:o.junSmile==null?0.25:o.junSmile,nod:o.junNod||0}));
  // the tray, test, with the night build's tables in it
  const ins=ag_sandbox(ctx,tx,ty,tw,{label:null});if(ins)wm_slabs(ctx,ins.x+20,ins.y+ins.h-4,3,o.testCol||AG.blue,o.testLit||0);
  wm_clock(ctx,L.clock[0],L.clock[1],L.clock[2],o.time==null?8*60+30:o.time,o.clockA==null?1:o.clockA);
  if(o.things)o.things(ctx);
  if(o.night)wm_night(ctx);else ag_roomLight(ctx,1);
  // the labels, at full contrast: the tray's and the glass's
  const la=o.labels==null?1:o.labels;if(la>0){ag_pill(ctx,tx,ty+60,"Test · a copy of the data",{icon:"draft",col:AG.blue,a:la,size:28});
    const pl="Production · read only",pw=ag_tw(ctx,pl,{w:700,size:28})+96;ag_pill(ctx,gx+gw-pw/2-18,gy+44,pl,{icon:"lock",col:AG.blue,a:la,size:28});}
  if(o.after)o.after(ctx);}
// what Jun's screen shows: dark at night with nothing on it; a report or a pull request as quiet rows, the top row in its colour
function wm_screen(c,x,y,w,h,what){if(what==="dark"){c.fillStyle="rgba(120,130,150,0.18)";c.fillRect(x,y,w,6);return;}
  const col=what==="pr"?AG.green:AG.violet;c.fillStyle=rgba(col,0.18);c.fillRect(x,y,w,22);c.fillStyle="rgba(86,92,100,0.3)";
  for(let k=0;k<5;k++){c.fillRect(x+14,y+36+k*19,(w-28)*(k%2?0.62:0.84),6);}}

/* ---------------------------------------------------------------- small pieces */
function wm_gear(ctx,x,y,r,col,turn){ctx.save();ctx.translate(x,y);ctx.rotate(turn*TAU);ctx.fillStyle=col;ctx.beginPath();const n=8;
  for(let i=0;i<n*2;i++){const ang=i*Math.PI/n,rr_=i%2?r*0.78:r;ctx.lineTo(Math.cos(ang-0.18)*rr_,Math.sin(ang-0.18)*rr_);ctx.lineTo(Math.cos(ang+0.18)*rr_,Math.sin(ang+0.18)*rr_);}
  ctx.closePath();ctx.fill();ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(0,0,r*0.36,0,TAU);ctx.fill();ctx.restore();}
// a plain script: no model, the same steps every time (blue, a gear); o.w, o.turn, o.glow, o.a, o.k, o.tick (0..1, a green tick and
// o.result under the title, in green)
function wm_script(ctx,x,y,title,sub,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||Math.max(ag_tw(ctx,title,{w:700,size:32}),sub?ag_tw(ctx,sub,{w:500,size:28}):0)+140,h=sub?124:84;
  if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.75,glow:o.glow?AG.blue:null,glowA:o.glow});
  wm_gear(ctx,x+52,y+h/2,22,rgba(AG.blue,1),o.turn||0);ag_T(ctx,title,x+96,y+(sub?56:h/2+11),{w:700,size:32});if(sub)ag_T(ctx,sub,x+96,y+96,{w:500,size:28,col:o.subCol||AG.mut});
  ctx.restore();return{x,y,w,h};}
// a stamp that lands at t0: big and faint, then pressed down; a double edge, the word in its colour; it stays until o.t1
function wm_stamp(ctx,x,y,text,t,t0,o){o=o||{};if(t<t0)return;const p=clamp((t-t0)/0.32,0,1),a=Math.min(1,p*1.6)*(o.a==null?1:o.a)*(o.t1==null?1:1-ag_in(t,o.t1,0.5));if(a<=0)return;
  const col=o.col||AG.green,sz=o.size||34,s=lerp(1.5,1,ag_eo(p)),w=ag_tw(ctx,text,{w:800,size:sz})+56,h=sz+36;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(s,s);
  ctx.fillStyle="rgba(246,244,239,0.82)";rr(ctx,-w/2,-h/2,w,h,12);ctx.fill();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,12);ctx.stroke();ctx.lineWidth=1.5;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,8);ctx.stroke();
  ag_T(ctx,text,0,sz*0.36,{w:800,size:sz,align:"center",col});ctx.restore();}
// an arrow along a curve ([x0,y0, x1,y1, x2,y2, x3,y3]), drawn on to u, its head at the end; o.col, o.lw, o.head, o.dash, o.a
function wm_arrow(ctx,p,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a;if(a<=0)return;const col=o.col||AG.blue;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash(o.dash);ctx.strokeStyle=rgba(col,o.alpha||0.85);ctx.lineWidth=o.lw||4;ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.setLineDash([]);
  if(u>0.1){const q=ag_bz(p,u),q0=ag_bz(p,Math.max(0,u-0.03));ag_arrowHead(ctx,q[0],q[1],Math.atan2(q[1]-q0[1],q[0]-q0[0]),o.head||14,rgba(col,o.alpha||0.85));}ctx.restore();}
// a straight dashed link from one card to another, its arrowhead at the end
function wm_link(ctx,x0,y0,x1,y1,u,o){o=o||{};const mx=(x0+x1)/2;wm_arrow(ctx,[x0,y0,mx,y0,mx,y1,x1,y1],u,Object.assign({dash:[9,9],lw:3,head:12},o));}
function wm_branchIcon(ctx,x,y,col){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-8,y-14);ctx.lineTo(x-8,y+14);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+8,y-8);ctx.bezierCurveTo(x+8,y+4,x-8,y+2,x-8,y+10);ctx.stroke();for(const [px,py] of [[x-8,y-14],[x-8,y+14],[x+8,y-10]]){ctx.beginPath();ctx.arc(px,py,4.5,0,TAU);ctx.fill();}ctx.restore();}
function wm_fileIcon(ctx,x,y,col,folder){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(folder){ctx.beginPath();ctx.moveTo(x-14,y-8);ctx.lineTo(x-14,y+12);ctx.lineTo(x+16,y+12);ctx.lineTo(x+16,y-6);ctx.lineTo(x+1,y-6);ctx.lineTo(x-3,y-11);ctx.lineTo(x-14,y-11);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(x-11,y-14);ctx.lineTo(x+5,y-14);ctx.lineTo(x+12,y-7);ctx.lineTo(x+12,y+14);ctx.lineTo(x-11,y+14);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+5,y-14);ctx.lineTo(x+5,y-7);ctx.lineTo(x+12,y-7);ctx.stroke();}
  ctx.restore();}
// an undo arrow, curling back to the left
function wm_undoIcon(ctx,x,y,s,col,lw){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw||3.5;ctx.lineCap="round";ctx.beginPath();ctx.arc(x+s*0.08,y+s*0.06,s*0.36,-Math.PI*0.95,Math.PI*0.45);ctx.stroke();
  const px=x+s*0.08+Math.cos(-Math.PI*0.95)*s*0.36,py=y+s*0.06+Math.sin(-Math.PI*0.95)*s*0.36;ctx.beginPath();ctx.moveTo(px-s*0.2,py+s*0.04);ctx.lineTo(px+s*0.12,py-s*0.18);ctx.lineTo(px+s*0.1,py+s*0.18);ctx.closePath();ctx.fill();ctx.restore();}
