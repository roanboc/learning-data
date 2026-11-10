/* ===== Grants by design: the film's own helpers =====
   Small things the chapters share, with the prefix gd_ (the module's kit is never changed for one film): a chapter's moments, made
   once; a value that fades in at a word and out at another; the kicker; a person drawn whole and then faded as one picture; a line of
   code on a dark strip; and a group, a table and a lock as this film draws them. Sizes are in the 1920 x 1080 frame; every word at
   least 28 px as seen, and nothing but the captions below y 890. */

// made once per chapter, the first time it draws: its cues are known by then
const gd_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// in at t0, out at t1 (or never), over d seconds
const gd_io=(t,t0,t1,d)=>t1==null?ag_in(t,t0,d||0.5):ag_io(t,t0,t1,d||0.5);
// a card's spring and fade: in at t0, out at t1 (or never)
const gd_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:gd_io(t,t0,t1,0.35)});
// the chapter's kicker, top left, over the shots in the frame's own space
function gd_kick(ctx,S,t,top,title,t0,t1){const a=gd_io(t,t0,t1,0.6);if(a<=0)return;setScreen(ctx,S);dp_kicker(ctx,top,title,{a});}
// a person drawn whole, then laid on the picture at a: a person fading in or out never shows through themselves
function gd_whole(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}
  const cv=ctx.canvas,[bc,bx]=ag_buf("gdwhole",cv.width,cv.height);bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,cv.width,cv.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}

// one line of code on a dark strip, in the code font: o.size (28), o.col (a meaning), o.rim (a meaning: a rim and a glow), o.w (width)
function gd_code(ctx,x,y,s,o){o=o||{};const size=o.size||28,a=o.a==null?1:o.a;if(a<=0)return 0;const w=o.w||dp_tw(ctx,s,{w:500,size,f:"mono"})+40,h=size+22;
  ctx.save();ctx.globalAlpha*=a;
  if(o.rim){const c=dp_f(o.rim);ctx.save();ctx.shadowColor=rgba(c,0.6);ctx.shadowBlur=16;rr(ctx,x-8,y-h+13,w+16,h,10);ctx.strokeStyle=rgba(c,o.rimA==null?1:o.rimA);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}
  if(o.strip!==false){rr(ctx,x-8,y-h+13,w+16,h,10);ctx.fillStyle="rgba(2,12,16,0.6)";ctx.fill();}
  dp_T(ctx,s,x+12,y,{w:500,size,f:"mono",col:o.col||"ink"});ctx.restore();return w;}

/* a group, as this film draws it: a pill of glass with a ring of three small heads (a group, never a person) and its name in the code
   font, as the directory and the platform write it. gd_group(ctx, x, y, name, {a, lit, col, size, w}) puts its left end at x and its
   middle at y; lit (0 to 1) brightens its rim and fills its heads in its colour; returns {x, y, w, h, r: [x of its right end, y]} */
function gd_group(ctx,x,y,name,o){o=o||{};const size=o.size||28,col=o.col||"cyan",c=dp_f(col),L=clamp(o.lit||0,0,1),a=o.a==null?1:o.a,
    tw=dp_tw(ctx,name,{w:500,size,f:"mono"}),w=o.w||tw+108,h=size+30,bb={x,y:y-h/2,w,h,r:[x+w,y],l:[x,y]};if(a<=0||o.measure)return bb;
  ctx.save();ctx.globalAlpha*=a;
  if(L>0)dp_halo(ctx,x+w/2,y,w*0.7,col,0.16*L);
  dp_panel(ctx,x,y-h/2,w,h,{col,r:h/2,glowR:20+20*L,glowA:0.5+0.5*L,behind:o.behind});
  // three small heads and shoulders in a row, the middle one in front: a group
  const hx=x+38,hy=y+2;for(const [dx,dy,k] of [[-12,-3,0.82],[12,-3,0.82],[0,1,1]]){const px=hx+dx,py=hy+dy;ctx.save();
    ctx.fillStyle=rgba(mix([30,60,66],c,0.25+0.6*L),1);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),0.55+0.45*L);ctx.lineWidth=1.6;
    ctx.beginPath();ctx.arc(px,py-7*k,6.2*k,0,TAU);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(px-11*k,py+12*k);ctx.quadraticCurveTo(px-10*k,py+1*k,px,py+1*k);ctx.quadraticCurveTo(px+10*k,py+1*k,px+11*k,py+12*k);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  dp_T(ctx,name,x+76,y+size*0.36,{w:500,size,f:"mono",col:L>0.5?"ink":"ink"});
  ctx.restore();return bb;}

/* a table, as this film draws it: a small slab of glass with rows of light inside, in the colour of what it holds (violet: personal
   data; grey: nothing that needs hiding); o.name writes its name over it in the code font; o.rows (0 to 1) lights its rows (read);
   o.dark dims it (no one can read it yet) */
function gd_table(ctx,x,y,w,h,o){o=o||{};const col=o.col||"violet",c=dp_f(col),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const lit=clamp(o.rows||0,0,1),dk=o.dark||0;
  ctx.save();ctx.shadowColor=rgba(c,0.35+0.35*lit);ctx.shadowBlur=10+12*lit;rr(ctx,x,y,w,h,8);ctx.fillStyle=rgba(mix([8,26,30],c,0.16*(1-dk)),0.92);ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,8);ctx.clip();const n=Math.max(2,Math.round((h-14)/11));
  for(let i=0;i<n;i++){const ry=y+8+i*((h-16)/Math.max(1,n-1)),rw=(w-24)*(0.55+0.4*((i*37+Math.round(x))%7)/7);
    ctx.fillStyle=rgba(mix(c,[255,255,255],0.2),(0.18+0.6*lit)*(1-0.8*dk));ctx.fillRect(x+12,ry-1.6,rw,3.2);}
  const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(220,250,250,0.12)");g.addColorStop(1,"rgba(220,250,250,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h*0.5);ctx.restore();
  rr(ctx,x+0.8,y+0.8,w-1.6,h-1.6,8);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),(0.55+0.45*lit)*(1-0.6*dk));ctx.lineWidth=1.8;ctx.stroke();
  if(o.name)dp_T(ctx,o.name,x+w/2,y-14,{w:500,size:o.size||28,f:"mono",align:"center",col:o.nameCol||"ink"});
  ctx.restore();}

/* a card as the kit draws one (dp_card's sizes and places), for a kicker, a title of one line and one line under it that can change:
   subs [[text, a], ...] are drawn in the same place, each at its own opacity, one leaving before the next comes in. o.mono writes the
   title in the code font, as the platform writes a name; o.col, o.a, o.k (springs it in). 180 tall; returns its box */
function gd_card(ctx,x,y,w,kick,title,subs,o){o=o||{};const a=o.a==null?1:o.a,h=180,bb={x,y,w,h},col=o.col||"cyan";if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,w,h,{col,r:20,glowR:36});
  dp_T(ctx,String(kick).toUpperCase(),x+30,y+50,{w:800,size:28,ls:4,col});
  dp_T(ctx,title,x+30,y+100,o.mono?{w:500,size:32,f:"mono"}:{w:700,size:36});
  for(const [s,sa] of subs||[])if(sa>0)dp_T(ctx,s,x+30,y+142,{w:500,size:28,col:"mut",a:sa});
  ctx.restore();return bb;}

// a name over the room's glass, on a small dark backing, so the shelves' edges never run through its letters: o.align, o.a, o.mono
// (true: the code font, as the platform writes a name), o.col, o.rim (the backing's fine edge)
function gd_label(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=o.mono===false?{w:700,size:28}:{w:500,size:28,f:"mono"},w=dp_tw(ctx,s,f),
    x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;ctx.save();ctx.globalAlpha*=a;rr(ctx,x0-12,y-30,w+24,40,10);ctx.fillStyle="rgba(4,15,19,0.9)";ctx.fill();
  ctx.strokeStyle=rgba(dp_f(o.rim||"cyan"),0.4);ctx.lineWidth=1.2;ctx.stroke();dp_T(ctx,s,x0,y,Object.assign({},f,{col:o.col||"ink"}));ctx.restore();}

/* a card of steps or facts, one to a row: a mark on the left (a tick drawn on by its p, over a faint ring where it will be; or a dot in
   its colour) and its words; its kicker over them. rows [[text, {p, col, a}], ...]; o.a, o.k (springs it in), o.col. Returns its box */
function gd_steps(ctx,x,y,w,kick,rows,o){o=o||{};const a=o.a==null?1:o.a,h=78+rows.length*58+18,bb={x,y,w,h},col=o.col||"cyan";if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,w,h,{col,r:20,glowR:36});
  dp_T(ctx,String(kick).toUpperCase(),x+30,y+50,{w:800,size:28,ls:4,col});
  rows.forEach(([s,r],i)=>{r=r||{};const ry=y+78+i*58+34,ra=r.a==null?1:r.a;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;
    if(r.p!=null){ctx.save();ctx.strokeStyle=rgba(dp_f("green"),0.4);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+52,ry-10,18,0,TAU);ctx.stroke();ctx.restore();dp_tick(ctx,x+52,ry-10,"green",r.p);}
    else{const c=dp_f(r.col||col);ctx.save();ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x+52,ry-10,8,0,TAU);ctx.fill();ctx.restore();}
    dp_T(ctx,s,x+88,ry,{w:600,size:30,col:"ink"});ctx.restore();});
  ctx.restore();return bb;}
