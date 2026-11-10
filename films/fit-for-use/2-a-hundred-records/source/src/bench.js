/* ===== A hundred records: the data team's bench, 2026 =====
   What the team looks at, drawn live on the module's places (the bench, and the bench seen from above): the list as a tray of
   index cards; the hundred most recent records, each a small card; one record close, as dq_record types it; the measure (79 of
   100) and how far it can be trusted, a steel margin, since the margin is a measure too, not a requirement (brass); the errors by
   kind; the certificates printed again. The hundred's errors are fixed here once (HR_HUNDRED), so every shot that shows them shows
   the same cards marked the same way.
     hr_mini(ctx, x, y, w, h, o)     a small index card standing before the wall or lying on the granite (o.on), its typed lines drawn
                                     small as decoration; o.mark ("pass", "stop", "none") a small round stamp at its top right; o.caps
                                     (its first line in capitals); o.lit (a pale band); o.a, o.k
     hr_hundred(ctx, x, y, o)        the hundred, ten by ten: o.cw, o.ch, o.gap (sizes), o.appear(i) (0 to 1), o.mark(i), o.lit(i), o.caps(i),
                                     o.on; returns the cards' boxes
     hr_tray(ctx, x, y, w, o)        the list as a tray of cards on the bench, seen from the front: o.label (on its front), o.n (cards
                                     standing in it), o.pull (0 to 1: the hundred most recent lifted at its back end), o.grey (older
                                     cards greyed from this fraction on)
     hr_margin(ctx, x, y, w, o)      the measure on its scale: a steel pointer at o.v, and the margin either side of it (o.lo to o.hi) in
                                     a paler steel; o.u draws the margin open, o.vu moves the pointer
     hr_bars(ctx, x, y, w, rows, o)  errors by kind: rows [{k, v, sub}] as steel bars on a card; o.u (0 to 1) grows them in turn; o.max;
                                     o.grow: the card grows a row at a time as they come in
     hr_certs(ctx, x, y, o)          a small pile of degree certificates, o.n of them fanned */
// the hundred's 21 imperfect records and what was wrong in each: 26 errors (numbers.md, The hundred-record measure): in names, 8
// accents lost, 3 cut short, 4 given and family names swapped; 6 awards, 3 ceremonies, 2 conferral dates. Five records have two.
const HR_HUNDRED=(()=>{const bad={7:["accent"],12:["swap"],18:["accent","award"],23:["award"],27:["cut"],31:["accent"],38:["ceremony"],44:["swap","date"],
  49:["accent"],53:["award"],58:["cut","ceremony"],61:["accent"],66:["award"],72:["swap"],75:["accent","award"],81:["date"],84:["accent"],88:["cut"],
  91:["swap","ceremony"],95:["award"],98:["accent"]};return{bad,isBad:i=>!!bad[i],kinds:i=>bad[i]||[],
  // errors no check of the list can see: allowed values, wrong (swapped names, awards, ceremonies, dates)
  unseen:i=>(bad[i]||[]).some(k=>k==="swap"||k==="award"||k==="ceremony"||k==="date")};})();
function hr_mini(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,ag_spr(o.k,0,0.5)));
  ctx.save();dq_shadow(ctx,o.on,0.55);ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;rr(ctx,x,y,w,h,4);ctx.fillStyle=o.grey?"rgb(226,220,206)":rgba(DQ.paper,1);ctx.fill();ctx.restore();
  if(o.lit>0){ctx.fillStyle=rgba([196,172,128],0.35*o.lit);rr(ctx,x,y,w,h,4);ctx.fill();}
  ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1;rr(ctx,x+0.5,y+0.5,w-1,h-1,4);ctx.stroke();
  // its typed lines, small: decoration, as a card seen at a distance
  const lh=h/6.2;ctx.fillStyle=o.grey?"rgba(92,82,72,0.3)":"rgba(64,56,48,0.42)";ctx.fillRect(x+w*0.1,y+lh*1.1,w*(o.caps?0.62:0.52),Math.max(1.6,lh*(o.caps?0.62:0.42)));
  for(let k=2;k<6;k++)ctx.fillRect(x+w*0.1,y+lh*k+lh*0.3,w*(k%2?0.66:0.48),Math.max(1.2,lh*0.32));
  if(o.mark){const r=Math.max(6,Math.min(w,h)*0.16);dq_stampMark(ctx,x+w-r-4,y+r+4,o.mark,r);}
  ctx.restore();}
function hr_hundred(ctx,x,y,o){o=o||{};const cw=o.cw||64,ch=o.ch||40,g=o.gap||10,out=[];
  for(let i=0;i<100;i++){const c=i%10,r=Math.floor(i/10),bx=x+c*(cw+g),by=y+r*(ch+g);out.push({x:bx,y:by,w:cw,h:ch});
    const ap=o.appear?o.appear(i):1;if(ap<=0.004)continue;
    hr_mini(ctx,bx,by,cw,ch,{a:ap*(o.a==null?1:o.a),mark:o.mark?o.mark(i):null,lit:o.lit?o.lit(i):0,caps:o.caps?o.caps(i):false,grey:o.grey?o.grey(i):false,on:o.on});}
  return out;}
function hr_tray(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const h=86,n=o.n||60,pull=o.pull||0;
  // the cards standing in it, their tops showing over its back edge; the hundred most recent, at its back end, lifted a little
  ctx.fillStyle="rgba(30,20,12,0.4)";ctx.beginPath();ctx.ellipse(x+w/2,y+h+6,w*0.52,14,0,0,TAU);ctx.fill();
  for(let k=0;k<n;k++){const u=k/(n-1),cx=x+18+u*(w-36),late=u>0.86,lift=late?pull*26:0,grey=o.grey!=null&&u<o.grey;
    ctx.fillStyle=grey?"rgb(214,206,190)":k%2?"rgb(246,240,226)":"rgb(238,231,216)";ctx.fillRect(cx-2,y-38-lift,(w-36)/(n-1)+1.2,48);
    ctx.fillStyle="rgba(110,90,66,0.35)";ctx.fillRect(cx-2,y-38-lift,1,48);}
  if(pull>0){ctx.fillStyle=rgba([196,172,128],0.3*pull);ctx.fillRect(x+18+0.86*(w-36),y-66,0.14*(w-36)+4,30);}
  // o.lit: every card at once, as when the whole list is read
  if(o.lit>0){ctx.fillStyle=rgba([196,172,128],0.3*o.lit);ctx.fillRect(x+14,y-42,w-28,52);}
  // the tray: oiled oak, its front panel and a label holder
  let g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#8a5e3a");g.addColorStop(1,"#5a3a22");ctx.fillStyle=g;rr(ctx,x,y,w,h,6);ctx.fill();
  ctx.fillStyle="rgba(255,228,190,0.3)";ctx.fillRect(x+4,y+2,w-8,2);
  if(o.label){const lw=Math.min(w-60,dq_tw(ctx,o.label,{w:700,size:28})+44);ctx.fillStyle=rgba(DQ.paper,1);rr(ctx,x+w/2-lw/2,y+20,lw,48,4);ctx.fill();
    ctx.strokeStyle="rgba(60,40,24,0.6)";ctx.lineWidth=2;rr(ctx,x+w/2-lw/2,y+20,lw,48,4);ctx.stroke();dq_T(ctx,o.label,x+w/2,y+54,{w:700,size:28,align:"center"});}
  ctx.restore();}
function hr_margin(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const mn=o.min==null?50:o.min,mx=o.max==null?100:o.max,x0=x+DQ_PAD+18,ws=w-2*DQ_PAD-36,
    X=v=>x0+clamp((v-mn)/(mx-mn),0,1)*ws,sy=y+160,sh=52,ny=sy+sh+40,h=ny+64-y;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on,edge:"steel"});if(o.label)dq_label(ctx,x+DQ_PAD,y+50,o.label,{col:"steel"});
  ctx.fillStyle="rgba(120,96,64,0.1)";rr(ctx,x0-18,sy,ws+36,sh,8);ctx.fill();ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.2;rr(ctx,x0-18,sy,ws+36,sh,8);ctx.stroke();
  const steps=(mx-mn)/5;ctx.fillStyle=rgba(DQ.ink,0.85);for(let i=0;i<=steps*5;i++){const tx=x0+ws*i/(steps*5),big=i%5===0;ctx.fillRect(tx-(big?1.3:0.7),sy+sh-(big?22:11),big?2.6:1.4,big?22:11);}
  // the margin: how far a measure of a hundred can be trusted, a paler steel either side of the pointer
  const u=o.u==null?0:clamp(o.u,0,1);if(u>0&&o.lo!=null){const m=X(o.v),l0=lerp(m,X(o.lo),ag_sine(u)),l1=lerp(m,X(o.hi),ag_sine(u));ctx.fillStyle=rgba(DQ.steel,0.22);ctx.fillRect(l0,sy+3,l1-l0,sh-6);
    ctx.fillStyle=rgba(DQ.steel,0.9);for(const lx of [l0,l1])ctx.fillRect(lx-2,sy-6,4,sh+12);const ta=sstep(0.6,1,u);
    dq_T(ctx,String(o.lo),X(o.lo),ny,{w:700,size:28,align:"center",col:"steel",a:ta});dq_T(ctx,String(o.hi),X(o.hi),ny,{w:700,size:28,align:"center",col:"steel",a:ta});}
  for(const v of [mn,mx])dq_T(ctx,String(v),X(v),ny,{w:600,size:28,align:"center",col:DQ.soft});
  const vu=o.vu==null?1:clamp(o.vu,0,1),px=X(lerp(mn,o.v,ag_sine(vu)));ctx.fillStyle=rgba(DQ.steel,1);
  ctx.beginPath();ctx.moveTo(px,sy+sh*0.55);ctx.lineTo(px-14,sy-6);ctx.lineTo(px+14,sy-6);ctx.closePath();ctx.fill();ctx.fillRect(px-2,sy-26,4,22);ctx.beginPath();ctx.arc(px,sy-28,6.5,0,TAU);ctx.fill();
  if(o.vText)dq_T(ctx,o.vText,px,sy-48,{w:800,size:32,align:"center",col:"steel",a:sstep(0.85,1,vu)});
  ctx.restore();return{x,y,w,h};}
function hr_bars(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=58,top=o.label?84:30,
    nv=o.grow&&o.u?Math.max(1,rows.reduce((s_,_,i)=>s_+ag_sine(clamp(o.u(i)*4,0,1)),0)):rows.length,h=top+nv*rh+18,mx=o.max||Math.max(...rows.map(r=>r.v)),
    lw=o.labW||Math.max(...rows.map(r=>dq_tw(ctx,r.k,{w:600,size:28})))+34,bw=w-DQ_PAD*2-lw-70;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});if(o.label)dq_label(ctx,x+DQ_PAD,y+52,o.label);
  rows.forEach((r,i)=>{const u=o.u?o.u(i):1;if(u<=0.004)return;const ry=y+top+i*rh,cy=ry+rh/2;ctx.save();ctx.globalAlpha*=o.grow?clamp((u-0.15)*2.4,0,1):clamp(u*2,0,1);
    dq_T(ctx,r.k,x+DQ_PAD,cy+10,{w:600,size:28,col:r.sub?DQ.soft:DQ.ink});const bl=bw*r.v/mx*ag_eo(u);
    ctx.fillStyle=rgba(DQ.steel,r.sub?0.55:0.9);rr(ctx,x+DQ_PAD+lw,cy-13,Math.max(4,bl),26,4);ctx.fill();
    dq_T(ctx,String(r.v),x+DQ_PAD+lw+bl+14,cy+10,{w:800,size:30,col:"steel"});ctx.restore();});
  ctx.restore();return{x,y,w,h};}
function hr_certs(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||5,w=300,h=212;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  for(let i=n-1;i>=0;i--){const dx=i*12,dy=-i*8;dq_card(ctx,x+dx,y+dy,w,h,{r:3});if(i===0){
    // the front certificate: its border, the university's crest in ink, lines of its wording drawn small
    ctx.strokeStyle="rgba(92,82,72,0.5)";ctx.lineWidth=2;ctx.strokeRect(x+12,y+12,w-24,h-24);ctx.strokeRect(x+18,y+18,w-36,h-36);
    ctx.fillStyle="rgba(64,56,48,0.5)";ctx.beginPath();ctx.moveTo(x+w/2-16,y+36);ctx.lineTo(x+w/2+16,y+36);ctx.lineTo(x+w/2+16,y+58);ctx.quadraticCurveTo(x+w/2,y+76,x+w/2-16,y+58);ctx.closePath();ctx.fill();
    for(const [yy,ww] of [[100,0.62],[124,0.44],[150,0.7],[172,0.36]]){ctx.fillRect(x+w/2-w*ww/2,y+yy,w*ww,yy===124?7:4);}}}
  ctx.restore();return{x,y,w,h};}
