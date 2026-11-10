/* ===== From a branch to production: the film's own helpers =====
   Small things the chapters share, with the prefix bp_ (the module's kit is never changed for one film): a chapter's kicker, made
   once per chapter; a value that fades in at a word and out at another; the opening's three cards, which the film carries into the
   hall and comes back to; a line of code on glass; a small person drawn in light for a team (not one of the film's people); and the
   registrar's records as rows of glass. Sizes are in the 1920 x 1080 frame; every word at least 28 px as seen. */

// made once per chapter, the first time it draws: its cues are known by then
const bp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// in at t0, out at t1 (or never), over d seconds
const bp_io=(t,t0,t1,d)=>t1==null?ag_in(t,t0,d||0.5):ag_io(t,t0,t1,d||0.5);

// the chapter's kicker, top left, drawn over the shots in the frame's own space: in from t0, out at t1
function bp_kick(ctx,S,t,top,title,t0,t1){const a=bp_io(t,t0,t1,0.6);if(a<=0)return;setScreen(ctx,S);dp_kicker(ctx,top,title,{a});}

/* the opening's three lessons, carried into the hall: "Rules set before the change", "Checked by someone who didn't write it",
   "In force only once both are done". bp_lessons(ctx, {a, lit: [a0, a1, a2], each, by}) draws them "big" (u 0: three cards across
   the frame, their tops at by, 640 by default) or "small" (u 1: a column of slips at the top right, a tick beside each one lit). */
const BP_LESSONS=["Rules set before the change","Checked by someone who didn't write it","In force only once both are done"];
function bp_lessons(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const u=o.u||0,lit=o.lit||[1,1,1],each=o.each||[1,1,1],by=o.by==null?640:o.by;
  BP_LESSONS.forEach((s,i)=>{const ea=a*each[i];if(ea<=0)return;const L=lit[i];
    // (a dark layer under each big card, so its number reads over the lit seats and benches seen through it)
    if(u<0.5){ctx.save();ctx.globalAlpha*=ea;const cx=130+i*570,wd={kick:"0"+(i+1),title:s},co={col:L>0.5?"cyan":"grey",behind:o.behind},bb=dp_card(ctx,cx,by,520,wd,Object.assign({measure:true},co));
      rr(ctx,bb.x,bb.y,bb.w,bb.h,20);ctx.fillStyle="rgba(3,12,16,0.6)";ctx.fill();dp_card(ctx,cx,by,520,wd,co);ctx.restore();return;}
    const size=28,w=dp_tw(ctx,s,{w:700,size})+48,sx=1880-w,sy=60+i*74;ctx.save();ctx.globalAlpha*=ea;
    dp_slip(ctx,sx,sy,s,L>0.5?"cyan":"grey",{size,ink:L>0.5,behind:o.behind});if(L>0.02)dp_tick(ctx,sx-30,sy+34,"green",L);ctx.restore();});}

// one line of code on a dark strip, in the code font: o.size (28), o.col, o.rim (a meaning: the strip's rim and a glow), o.strike (0 to 1);
// o.stripA (0 to 1) how much of the strip shows, so a line can come out of the page's plain lines and go back into them; o.h the
// strip's height, centred on the words (a file's lines are closer than a strip's own height)
function bp_code(ctx,x,y,s,o){o=o||{};const size=o.size||28,a=o.a==null?1:o.a;if(a<=0)return 0;const w=dp_tw(ctx,s,{w:500,size,f:"mono"})+40,h=o.h||size+26,
    top=o.h?y-8-h/2:y-h+14;
  ctx.save();ctx.globalAlpha*=a;
  if(o.rim){const c=dp_f(o.rim),ra=o.rimA==null?1:o.rimA;if(ra>0){ctx.save();ctx.shadowColor=rgba(c,0.6*ra);ctx.shadowBlur=18;rr(ctx,x-6,top,w+12,h,10);ctx.strokeStyle=rgba(c,ra);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}}
  const sa=o.stripA==null?1:o.stripA;if(sa>0){ctx.save();ctx.globalAlpha*=sa;rr(ctx,x-6,top,w+12,h,10);ctx.fillStyle="rgba(2,12,16,0.62)";ctx.fill();ctx.restore();}
  dp_T(ctx,s,x+14,y,{w:500,size,f:"mono",col:o.col||"ink"});
  if(o.strike>0){const c=dp_f("coral");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3.2;ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(x+8,y-size*0.32);ctx.lineTo(x+8+(w-16)*ag_sine(o.strike),y-size*0.32);ctx.stroke();ctx.restore();}
  ctx.restore();return w;}

// a small person drawn in light (a team, not one of the film's people): dp_personPic at a size, in a meaning's colour
function bp_mini(ctx,x,y,k,col,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(k,k);dp_personPic(ctx,0,0,col);ctx.restore();}

/* the registrar's records: rows of violet glass (each a learner's record: personal data), n of them in a column from (x, y), each
   w x h, gap apart; o.lit (0 to 1) how bright; o.aside: [index, u] slides that row out to the tray at o.tray [x, y] (u 0 to 1);
   o.flow (0 to 1): how many have come in, from the door below (o.from [x, y]); o.bad [index, u] rims that row in coral, as a row
   that can't be read. */
function bp_rows(ctx,x,y,o){o=o||{};const n=o.n||8,w=o.w||150,h=o.h||16,gap=o.gap||10,a=o.a==null?1:o.a;if(a<=0)return;const col=DP.F.violet;
  ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){let rx=x,ry=y+i*(h+gap),ra=1;
    if(o.flow!=null){const u=clamp(o.flow*n*1.25-(n-1-i)*1.0,0,1),e=ag_eo(u),[fx,fy]=o.from||[x+w/2,y+n*(h+gap)+60];
      if(u<=0)continue;rx=lerp(fx-w/2,x,e);ry=lerp(fy,ry,e);ra=Math.min(1,u*2.5);}
    if(o.aside&&o.aside[0]===i){const u=ag_sine(o.aside[1]),[tx,ty]=o.tray;rx=lerp(rx,tx,u);ry=lerp(ry,ty,u)-Math.sin(Math.PI*u)*24;}
    ctx.save();ctx.globalAlpha*=ra;if(o.bad&&o.bad[0]===i&&o.bad[1]>0){const c=DP.F.coral;ctx.save();ctx.globalAlpha*=o.bad[1];ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=12;
      rr(ctx,rx-4,ry-4,w+8,h+8,(h+8)/2);ctx.strokeStyle=rgba(c,1);ctx.lineWidth=2.6;ctx.stroke();ctx.restore();}rr(ctx,rx,ry,w,h,h/2);const g=ctx.createLinearGradient(rx,0,rx+w,0);g.addColorStop(0,rgba(col,0.85*(0.5+0.5*(o.lit==null?1:o.lit))));g.addColorStop(1,rgba(mix(col,[255,255,255],0.3),0.55));
    ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;ctx.fillStyle=g;ctx.fill();ctx.restore();}
  ctx.restore();}
// a tray of glass beside the platform, where a row that can't be read is set aside, with its label
function bp_tray(ctx,x,y,w,label,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,48,{col:"violet",r:14,glowR:24});
  if(label)dp_T(ctx,label,x+w/2,y-18,{w:700,size:28,align:"center",col:"violet"});ctx.restore();}
