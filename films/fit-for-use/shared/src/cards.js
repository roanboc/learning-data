/* ===== Data quality: paper cards, records, tags, gauges, the kicker, the mark, and the title and end cards =====
   Everything on the bench is paper or an instrument. Cards are cream card stock with a soft shadow (falling a little to the left and
   down: the window is on the right), opaque, so words on them read at 6:1 or more; an edge in a colour only when the colour means
   something (look.js: a verdict, brass for the requirement, steel for a measure). o.on says what they lie on or stand before: "wall"
   (the default, a soft warm shadow) or "granite" (a deeper one). Words on cards: a kicker in capitals, 28 px, letter-spaced; a title,
   36 px; a line under it, 28 px, soft; what is typed (a record's values, code) in the mono face.
     dq_card(ctx, x, y, w, h, o)        a card: o.edge (a meaning's name or a colour), o.r (corner, 8), o.a, o.on, o.ruled (an index card's
                                        faint rules, every o.ruled px), o.dash (an outline only: a card that isn't there yet, or is missing)
     dq_textCard(ctx, x, y, w, words, o) words {kick, title, sub}: a card that fits them; o.edge, o.kickCol, o.icon (a dq_icon kind, at the
                                        top right), o.mono (the title typed), o.a, o.k (springs from its centre, 0 to 1), o.measure; returns
                                        {x, y, w, h}
     dq_record(ctx, x, y, w, rec, o)    a record, typed on an index card: rec {head, id, rows: [{k, v, mark, was, note}]}: each row a field's
                                        name and its value (typed), mark a verdict ("pass", "hold", "stop", "none") in a small round stamp at
                                        its right, was an old value struck through before the new one; o.lit (a row's index, or several: a
                                        pale band behind it, and o.litCol a bar in a colour that means something), o.rowA(row, i) (rows coming
                                        in one by one), o.labW, o.k, o.a, o.on; it grows to fit its
                                        longest value unless o.fixed; returns {x, y, w, h, rows: [{y, cy}]} (w as drawn), for a tag's string
     dq_tag(ctx, x, y, verdict, o)      a result: a tag in the verdict's colour, hanging from its eyelet at (x, y), tied on with string to
                                        o.to ([x, y]); verdict may also be "brass" (a requirement, such as a due date) or "steel" (a
                                        measure), with o.text, its words in ink or white, whichever reads; o.text (its words, the
                                        verdict's by default), o.icon (false for none), o.size (30), o.angle (its tilt, radians), o.flip
                                        (hangs to the left), o.k (springs from the eyelet), o.a; returns {x, y, w, h}
     dq_chip(ctx, x, y, text, o)        a small outlined label: a use, a dimension, a column, an owner; o.col (a meaning, for the words and
                                        the edge), o.icon, o.align ("left" or "center"), o.size (28), o.fill, o.a; returns {x, y, w, h}
     dq_band(ctx, x, y, w, o)           the tolerance band, the inspector's scale, on a card of its own from (x, y), w wide: o.min, o.max
                                        (the scale), o.lo, o.hi (the allowed range, brass: what good means for this use), o.v (the measure,
                                        a steel pointer), o.u (0 to 1, the brass draws on), o.vu (0 to 1, the pointer travels from o.min to
                                        o.v), o.ticks (the scale's steps), o.numEvery, o.nums (false: none), o.fmt (a value as words),
                                        o.label (the card's heading), o.vText (over the pointer), o.loText, o.hiText (under the band's
                                        ends), o.edge, o.on, o.k, o.a; returns {x, y, w, h, px} (px: the pointer's x)
     dq_dial(ctx, cx, cy, r, o)         a dial gauge: o.min, o.max, o.lo, o.hi (the brass arc), o.v and o.vu (the steel needle), o.ticks,
                                        o.nums (the numbers round the face, at r 170 or more), o.read (the reading, under the hub), o.label
                                        (under the gauge), o.sweep (its arc, 240 degrees), o.a, o.k
     dq_figure(ctx, x, y, value, label, o) a big number and its line: o.col (a meaning), o.size (120), o.align, o.dark, o.a
     dq_kicker(ctx, num, title, o)      the film's chapter number and title at the top left (o.dark on the granite or in the hall)
     dq_mark(ctx, cx, cy, r, p, a)      the module's mark: a small dial whose brass range draws itself, then its steel needle swings and
                                        settles inside it: a measure that meets what good means for its use
     dq_veil(ctx, S, a)                 the granite's dark laid over the frame, for the title and end cards
     dq_title(ctx, S, t, t0, title, sub, line)          the title card from t0
     dq_end(ctx, S, t, t0, title, line, n, series)     the end card from t0: the film's line, the mark, the title,
                                        "Film 1 of 4 · Fit for use · Learning Data" */

const DQ_PAD=28;
function dq_shadow(ctx,on,k){k=k==null?1:k;if(on==="granite"){ctx.shadowColor="rgba(0,0,0,"+(0.55*k)+")";ctx.shadowBlur=26;ctx.shadowOffsetX=-7;ctx.shadowOffsetY=10;}
  else{ctx.shadowColor="rgba(64,46,28,"+(0.3*k)+")";ctx.shadowBlur=24;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;}}
function dq_card(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r==null?8:o.r,e=o.edge?dq_tone(o.edge).col:null;ctx.save();ctx.globalAlpha*=a;
  if(o.dash){ctx.lineWidth=o.lw||2.6;ctx.setLineDash(o.dash===true?[12,10]:o.dash);ctx.strokeStyle=e?rgba(e,0.95):o.on==="granite"?rgba(DQ.chalkSoft,0.8):rgba(DQ.soft,0.7);rr(ctx,x,y,w,h,r);ctx.stroke();ctx.restore();return;}
  dq_shadow(ctx,o.on);rr(ctx,x,y,w,h,r);ctx.fillStyle=o.fill||rgba(DQ.paper,1);ctx.fill();ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  // card stock: a touch lighter at the top, where the window's light falls, and a fine darker edge
  const g=ctx.createLinearGradient(x,y,x+w*0.3,y+h);g.addColorStop(0,"rgba(255,255,255,0.32)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(120,96,64,0.06)");ctx.fillStyle=g;rr(ctx,x,y,w,h,r);ctx.fill();
  if(o.ruled){ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();ctx.fillStyle="rgba(120,104,84,0.16)";for(let yy=y+(o.ruleTop||o.ruled);yy<y+h-6;yy+=o.ruled)ctx.fillRect(x+16,yy,w-32,1.5);ctx.restore();}
  ctx.lineWidth=e?3:1.2;ctx.strokeStyle=e?rgba(e,0.95):"rgba(110,90,66,0.28)";rr(ctx,x+(e?1.5:0.5),y+(e?1.5:0.5),w-(e?3:1),h-(e?3:1),r);ctx.stroke();ctx.restore();}
function dq_textCard(ctx,x,y,w,words,o){o=o||{};const inner=w-DQ_PAD*2-(o.icon?56:0),tf={w:700,size:36,f:o.mono?"mono":undefined},tl=words.title?dq_wrap(ctx,words.title,inner,tf):[],sl=words.sub?dq_wrap(ctx,words.sub,w-DQ_PAD*2,{w:500,size:28}):[];
  const h=DQ_PAD+(words.kick?40:0)+tl.length*46+sl.length*38+DQ_PAD-(words.kick?0:6)+(tl.length||sl.length?0:-10),bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on,dash:o.dash});const kc=o.kickCol||(o.edge?dq_tone(o.edge).word:DQ.soft);let yy=y+DQ_PAD+24;
  if(words.kick){dq_T(ctx,String(words.kick).toUpperCase(),x+DQ_PAD,yy,{w:800,size:28,ls:4,col:kc});yy+=18;}else yy-=24;
  for(const l of tl){yy+=46;dq_T(ctx,l,x+DQ_PAD,yy,Object.assign({col:DQ.ink},tf));}
  for(const l of sl){yy+=38;dq_T(ctx,l,x+DQ_PAD,yy,{w:500,size:28,col:DQ.soft});}
  if(o.icon)dq_icon(ctx,o.icon,x+w-DQ_PAD-20,y+DQ_PAD+20,42,o.edge?dq_tone(o.edge).word:DQ.ink);
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a record, typed on an index card */
function dq_stampMark(ctx,cx,cy,m,r){const V=DQ_VERDICT[m];if(!V)return;ctx.save();if(m==="none"){ctx.strokeStyle=rgba(DQ_TONE.none.word,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,cy,r-1.2,0,TAU);ctx.stroke();dq_icon(ctx,"dash",cx,cy,r*1.1,DQ_TONE.none.word,{lw:4.4});ctx.restore();return;}
  ctx.fillStyle=rgba(V.col,1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();dq_icon(ctx,V.icon,cx,cy,r*1.15,V.ink,{lw:5.6});ctx.restore();}
function dq_record(ctx,x,y,w,rec,o){o=o||{};const rows=rec.rows||[],rh=o.rh||58,head=rec.head||rec.id?70:20,h=head+rows.length*rh+22,
    labW=o.labW||Math.max(0,...rows.map(r=>dq_tw(ctx,r.k||"",{w:600,size:28})))+30,vf={w:500,size:30,f:"mono"},
    // the card grows to fit its longest value (a long value never runs out of its card), unless o.fixed
    need=DQ_PAD*2+labW+Math.max(0,...rows.map(r=>dq_tw(ctx,r.v==null?"":String(r.v),vf)+(r.was!=null?dq_tw(ctx,r.was,vf)+60:0)+(r.mark?56:0))),
    hd=rec.head||rec.id?dq_tw(ctx,String(rec.head||"").toUpperCase(),{w:800,size:28,ls:3.5})+dq_tw(ctx,rec.id||"",{w:500,size:28,f:"mono"})+DQ_PAD*2+40:0;
  if(!o.fixed)w=Math.max(w,need,hd);const bb={x,y,w,h,rows:[]};
  rows.forEach((r,i)=>bb.rows.push({y:y+head+i*rh,cy:y+head+i*rh+rh/2}));const a=o.a==null?1:o.a;if(a<=0.004)return bb;
  const lits=o.lit==null?[]:[].concat(o.lit);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on});
  if(rec.head)dq_T(ctx,String(rec.head).toUpperCase(),x+DQ_PAD,y+46,{w:800,size:28,ls:3.5,col:DQ.soft});
  if(rec.id)dq_T(ctx,rec.id,x+w-DQ_PAD,y+46,{w:500,size:28,f:"mono",col:DQ.soft,align:"right"});
  if(head>20){ctx.fillStyle="rgba(120,96,70,0.5)";ctx.fillRect(x+16,y+head-4,w-32,2.2);}
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(r,i):1;if(ra<=0.004)return;const ry=y+head+i*rh,cy=ry+rh/2;ctx.save();ctx.globalAlpha*=ra;
    if(lits.includes(i)){ctx.fillStyle="rgba(196,172,128,0.22)";ctx.fillRect(x+10,ry+4,w-20,rh-8);if(o.litCol){ctx.fillStyle=rgba(dq_tone(o.litCol).col,1);ctx.fillRect(x+10,ry+4,6,rh-8);}}
    ctx.fillStyle="rgba(120,104,84,0.2)";ctx.fillRect(x+16,ry+rh-1,w-32,1.4);
    dq_T(ctx,r.k||"",x+DQ_PAD,cy+10,{w:600,size:28,col:DQ.soft});let vx=x+DQ_PAD+labW;
    if(r.was!=null){const ww=dq_tw(ctx,r.was,{w:500,size:30,f:"mono"});dq_T(ctx,r.was,vx,cy+10,{w:500,size:30,f:"mono",col:DQ.soft});ctx.fillStyle=rgba(DQ.stop,0.9);ctx.fillRect(vx-4,cy-1,ww+8,3);vx+=ww+22;
      ctx.strokeStyle=rgba(DQ.soft,1);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(vx,cy);ctx.lineTo(vx+22,cy);ctx.moveTo(vx+14,cy-7);ctx.lineTo(vx+22,cy);ctx.lineTo(vx+14,cy+7);ctx.stroke();vx+=38;}
    dq_T(ctx,r.v==null?"":String(r.v),vx,cy+10,{w:500,size:30,f:"mono",col:r.col?dq_col(r.col):DQ.ink});
    if(r.mark)dq_stampMark(ctx,x+w-DQ_PAD-14,cy,r.mark,17);
    ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a result: a tag tied on with string */
function dq_tagShape(ctx,L,T0,w,h){const c=h*0.3;ctx.beginPath();ctx.moveTo(L,T0+c);ctx.lineTo(L+c,T0);ctx.lineTo(L+w,T0);ctx.lineTo(L+w,T0+h);ctx.lineTo(L+c,T0+h);ctx.lineTo(L,T0+h-c);ctx.closePath();}
// the words on a tag of another colour (brass, a requirement such as a due date; steel, a measure): ink on a light colour, white on a dark one
const dq_inkOn=c=>{const L=v=>Math.pow(v/255,2.2);return 0.2126*L(c[0])+0.7152*L(c[1])+0.0722*L(c[2])>0.2?DQ.ink:[255,255,255];};
function dq_tag(ctx,x,y,verdict,o){o=o||{};const V=DQ_VERDICT[verdict]||{col:dq_tone(verdict).col,text:"",ink:dq_inkOn(dq_tone(verdict).col),icon:null},size=o.size||30,h=Math.round(size*1.9),text=o.text!=null?o.text:V.text,
    icon=o.icon===false?null:(o.icon||V.icon),tx0=h*0.84+(icon?size*1.3:0),w=Math.round(tx0+dq_tw(ctx,text,{w:800,size,ls:3})+h*0.42),e=h*0.42,a=o.a==null?1:o.a,bb={x:o.flip?x-w+e:x-e,y:y-h/2,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  // the string, from where it's tied to the eyelet, sagging a little
  if(o.to){const [tx,ty]=o.to,d=Math.hypot(tx-x,ty-y),mx=(tx+x)/2,my=(ty+y)/2+Math.min(60,d*0.14+8),su=o.k==null?1:sstep(0,0.5,o.k);
    ctx.lineCap="round";for(const [lw,col] of [[4.6,"rgba(96,74,44,0.5)"],[2.6,rgba(DQ.string,1)]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(tx,ty);ctx.quadraticCurveTo(lerp(tx,mx,su),lerp(ty,my,su),lerp(tx,x,su),lerp(ty,y,su));ctx.stroke();}
    if(su<1){ctx.restore();return bb;}}
  ctx.translate(x,y);if(o.k!=null){const k=lerp(0.4,1,ag_spr(o.k,0.25,0.7));ctx.scale(k,k);}ctx.rotate((o.angle==null?0.06:o.angle)*(o.flip?-1:1));if(o.flip)ctx.scale(-1,1);
  const L=-e,T0=-h/2;ctx.save();dq_shadow(ctx,o.on,0.8);ctx.shadowBlur=12;dq_tagShape(ctx,L,T0,w,h);ctx.fillStyle=rgba(V.col,1);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(0,T0,0,T0+h);g.addColorStop(0,"rgba(255,255,255,0.16)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,0.08)");dq_tagShape(ctx,L,T0,w,h);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(V.col,0.35),0.7);ctx.lineWidth=1.4;dq_tagShape(ctx,L,T0,w,h);ctx.stroke();
  // the eyelet: a ring of cream card, and its hole
  ctx.fillStyle=rgba(DQ.paper,1);ctx.beginPath();ctx.arc(0,0,h*0.2,0,TAU);ctx.fill();ctx.strokeStyle="rgba(110,90,66,0.4)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle="rgba(34,26,20,0.85)";ctx.beginPath();ctx.arc(0,0,h*0.095,0,TAU);ctx.fill();
  if(o.to){ctx.strokeStyle=rgba(DQ.string,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-h*0.36,-h*0.1,L+h*0.06,-h*0.02);ctx.stroke();}
  if(o.flip)ctx.scale(-1,1);const tx=o.flip?-(L+w)+h*0.42:L+tx0;
  if(icon)dq_icon(ctx,icon,(o.flip?tx:L+h*0.84)+size*0.5,0,size*1.05,V.ink,{lw:icon==="tick"||icon==="cross"||icon==="dash"||icon==="pause"?5.6:4.2});
  dq_T(ctx,text,o.flip?tx+(icon?size*1.3:0):tx,size*0.36,{w:800,size,ls:3,col:V.ink});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a small label */
function dq_chip(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||28,col=o.col?dq_tone(o.col):null,icon=o.icon,w=dq_tw(ctx,text,{w:700,size})+(icon?84:44),h=size+26,bx=o.align==="center"?x-w/2:x,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;
  ctx.save();dq_shadow(ctx,o.on,0.45);ctx.shadowBlur=10;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=o.fill||rgba(DQ.paper,1);ctx.fill();ctx.restore();
  ctx.lineWidth=col?2.4:1.4;ctx.strokeStyle=col?rgba(col.col,1):"rgba(110,90,66,0.45)";rr(ctx,bx+1,by+1,w-2,h-2,h/2);ctx.stroke();
  if(icon)dq_icon(ctx,icon,bx+36,y,30,col?col.word:DQ.ink);dq_T(ctx,text,bx+(icon?62:22),y+size*0.36,{w:700,size,col:col?col.word:DQ.ink});ctx.restore();return{x:bx,y:by,w,h};}

/* ---------------------------------------------------------------- the tolerance band
   A card of its own, so it reads on the wall and on the granite: its label, then the measure's value over a steel pointer, the scale
   (a strip inlaid in the card, its ticks along the bottom), its numbers, and the allowed range in brass across the scale, with its
   limits' words under it. */
function dq_band(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,mn=o.min==null?0:o.min,mx=o.max==null?100:o.max,x0s=x+DQ_PAD+18,ws=w-2*DQ_PAD-36,X=v=>x0s+clamp((v-mn)/(mx-mn),0,1)*ws,
    fmt=o.fmt||(v=>String(v)),sy=y+(o.vText?132:96),sh=52,ny=sy+sh+40,ly=ny+44,h=(o.loText||o.hiText?ly:ny)+30-y,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on,edge:o.edge});if(o.label)dq_label(ctx,x+DQ_PAD,y+50,o.label,{size:28});
  // the scale: a strip inlaid in the card, its ticks, its numbers
  ctx.fillStyle="rgba(120,96,64,0.1)";rr(ctx,x0s-18,sy,ws+36,sh,8);ctx.fill();ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.2;rr(ctx,x0s-18,sy,ws+36,sh,8);ctx.stroke();
  const steps=o.ticks||10;ctx.fillStyle=rgba(DQ.ink,0.85);for(let i=0;i<=steps*5;i++){const tx=x0s+ws*i/(steps*5),big=i%5===0;ctx.fillRect(tx-(big?1.3:0.7),sy+sh-(big?22:11),big?2.6:1.4,big?22:11);}
  if(o.nums!==false)for(let i=0;i<=steps;i+=o.numEvery||Math.max(1,Math.round(steps/5)))dq_T(ctx,fmt(lerp(mn,mx,i/steps)),x0s+ws*i/steps,ny,{w:600,size:28,align:"center",col:DQ.soft});
  // the allowed range, in brass: what good means for this use
  if(o.lo!=null&&o.hi!=null){const u=o.u==null?1:clamp(o.u,0,1),b0=X(o.lo),b1=X(o.hi),bm=(b0+b1)/2,l0=lerp(bm,b0,ag_sine(u)),l1=lerp(bm,b1,ag_sine(u));if(u>0){
    ctx.fillStyle=rgba(DQ.brass,0.32);ctx.fillRect(l0,sy+3,l1-l0,sh-6);ctx.fillStyle=rgba(DQ.brass,1);for(const lx of [l0,l1])ctx.fillRect(lx-2.5,sy-8,5,sh+16);ctx.fillRect(l0,sy+3,l1-l0,4);
    // the limits' words under the band's ends, or, where the band is narrow, once under its middle ("95 to 100"); always inside the card
    const ta=sstep(0.6,1,u),tf={w:700,size:28},inside=(s_,cx)=>{const tw_=dq_tw(ctx,s_,tf);dq_T(ctx,s_,clamp(cx,x+DQ_PAD+tw_/2,x+w-DQ_PAD-tw_/2),ly,Object.assign({align:"center",col:"brass",a:ta},tf));};
    if(o.loText&&o.hiText&&b1-b0<dq_tw(ctx,o.loText+o.hiText,tf)+80)inside(o.loText+" to "+o.hiText,bm);else{if(o.loText)inside(o.loText,b0);if(o.hiText)inside(o.hiText,b1);}}}
  // the measure: a steel pointer from above, its point on the value, and the value over it
  let px=null;if(o.v!=null){const vu=o.vu==null?1:clamp(o.vu,0,1),v=lerp(mn,o.v,ag_sine(vu));px=X(v);ctx.fillStyle=rgba(DQ.steel,1);
    ctx.beginPath();ctx.moveTo(px,sy+sh*0.55);ctx.lineTo(px-14,sy-6);ctx.lineTo(px+14,sy-6);ctx.closePath();ctx.fill();ctx.fillRect(px-2,sy-26,4,22);ctx.beginPath();ctx.arc(px,sy-28,6.5,0,TAU);ctx.fill();
    if(o.vText){const tw_=dq_tw(ctx,o.vText,{w:800,size:30}),tx=clamp(px,x+DQ_PAD+tw_/2,x+w-DQ_PAD-tw_/2);dq_T(ctx,o.vText,tx,sy-48,{w:800,size:30,align:"center",col:"steel",a:sstep(0.85,1,vu)});}}
  ctx.restore();return Object.assign(bb,{px});}

/* ---------------------------------------------------------------- the dial gauge */
function dq_dial(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const mn=o.min==null?0:o.min,mx=o.max==null?100:o.max,sw=(o.sweep||240)*Math.PI/180,a0=-Math.PI/2-sw/2,
    A=v=>a0+clamp((v-mn)/(mx-mn),0,1)*sw,steps=o.ticks||10;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  // the bezel, graphite and steel; the face, cream
  ctx.save();dq_shadow(ctx,o.on);ctx.fillStyle=rgba(DQ.graphite,1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);g.addColorStop(0,"#6c6c72");g.addColorStop(0.45,"#3a3a3f");g.addColorStop(0.8,"#8e8e94");g.addColorStop(1,"#4a4a50");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
  g=ctx.createRadialGradient(cx+r*0.25,cy-r*0.35,0,cx,cy,r*0.9);g.addColorStop(0,"#fdf9f0");g.addColorStop(1,"#ece4d2");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*0.88,0,TAU);ctx.fill();
  // the allowed range, a brass arc inside the ticks
  if(o.lo!=null&&o.hi!=null){const u=o.u==null?1:clamp(o.u,0,1),b0=A(o.lo),b1=A(o.hi),bm=(b0+b1)/2;if(u>0){ctx.strokeStyle=rgba(DQ.brass,1);ctx.lineWidth=r*0.085;ctx.lineCap="butt";ctx.beginPath();ctx.arc(cx,cy,r*0.64,lerp(bm,b0,ag_sine(u)),lerp(bm,b1,ag_sine(u)));ctx.stroke();}}
  ctx.strokeStyle=rgba(DQ.ink,0.88);ctx.lineCap="round";for(let i=0;i<=steps*5;i++){const an=a0+sw*i/(steps*5),big=i%5===0,r0=r*(big?0.71:0.77);ctx.lineWidth=big?Math.max(2,r*0.022):Math.max(1,r*0.01);
    ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.lineTo(cx+Math.cos(an)*r*0.82,cy+Math.sin(an)*r*0.82);ctx.stroke();}
  if(o.nums&&r>=170){const fmt=o.fmt||(v=>String(v));for(let i=0;i<=steps;i+=o.numEvery||2){const an=a0+sw*i/steps;dq_T(ctx,fmt(lerp(mn,mx,i/steps)),cx+Math.cos(an)*r*0.5,cy+Math.sin(an)*r*0.5+10,{w:600,size:28,align:"center",col:DQ.soft});}}
  if(o.read!=null)dq_T(ctx,String(o.read),cx,cy+r*0.5,{w:800,size:Math.max(30,r*0.2),align:"center",col:o.readCol||"steel"});
  // the needle, steel, with its counterweight, and the hub
  if(o.v!=null){const vu=o.vu==null?1:o.vu,an=lerp(a0,A(o.v),vu),L=r*0.8;ctx.save();ctx.translate(cx,cy);ctx.rotate(an);ctx.shadowColor="rgba(40,30,20,0.3)";ctx.shadowBlur=6;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;
    ctx.fillStyle=rgba(DQ.steel,1);ctx.beginPath();ctx.moveTo(L,0);ctx.lineTo(-r*0.06,-r*0.035);ctx.lineTo(-r*0.2,-r*0.05);ctx.lineTo(-r*0.2,r*0.05);ctx.lineTo(-r*0.06,r*0.035);ctx.closePath();ctx.fill();ctx.restore();}
  g=ctx.createRadialGradient(cx-r*0.02,cy-r*0.03,0,cx,cy,r*0.08);g.addColorStop(0,"#9a9aa0");g.addColorStop(1,"#2e2e33");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*0.075,0,TAU);ctx.fill();
  // the glass: a faint reflection of the window
  g=ctx.createLinearGradient(cx+r*0.2,cy-r*0.9,cx-r*0.3,cy+r*0.2);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(0.4,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*0.88,0,TAU);ctx.fill();
  if(o.label)dq_T(ctx,o.label,cx,cy+r+48,{w:700,size:28,align:"center",col:o.dark?DQ.chalk:DQ.ink});
  ctx.restore();}

/* ---------------------------------------------------------------- a big number */
function dq_figure(ctx,x,y,value,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const size=o.size||120,al=o.align||"left",dk=!!o.dark,col=o.col?dq_col(o.col,dk):(dk?DQ.chalk:DQ.ink);
  ctx.save();ctx.globalAlpha*=a;dq_T(ctx,String(value),x,y,{w:800,size,align:al,col});if(label)dq_T(ctx,label,x,y+Math.round(size*0.42)+10,{w:600,size:o.labelSize||30,align:al,col:dk?DQ.chalkSoft:DQ.soft});ctx.restore();}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
function dq_kicker(ctx,num,title,o){o=o||{};const x=o.x||96,y=o.y||100,a=o.a==null?1:o.a,dk=!!o.dark;if(a<=0.004)return;
  dq_T(ctx,num,x,y,{w:500,size:28,f:"mono",col:dk?DQ.chalk:DQ.ink,a});dq_T(ctx,String(title).toUpperCase(),x+dq_tw(ctx,num,{w:500,size:28,f:"mono"})+24,y,{w:800,size:28,ls:3.5,col:dk?DQ.chalkSoft:DQ.soft,a});}
// the module's mark: a dial; its brass range draws itself, then its steel needle swings up from rest and settles inside it
function dq_mark(ctx,cx,cy,r,p,a){if(a<=0.01)return;p=clamp(p,0,1);const u=ag_sine(p/0.45),n=p<0.35?0:1-Math.exp(-6*(p-0.35)/0.65)*Math.cos(9*(p-0.35)/0.65);
  dq_dial(ctx,cx,cy,r,{min:0,max:10,lo:6,hi:8.6,v:7.3,vu:clamp(n,0,1.08),u,ticks:10,a,on:"granite"});}
function dq_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(26,23,21,"+clamp(a,0,1)+")";ctx.fillRect(0,0,W,H);}
function dq_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;dq_veil(ctx,S,oA*0.92);setScreen(ctx,S);
  withA(ctx,tA,()=>{dq_mark(ctx,960,318,70,(t-t0-0.4)/2.0,1);dq_T(ctx,title,960,528,{w:800,size:84,align:"center",dark:true});
    if(sub)dq_T(ctx,sub,960,606,{w:600,size:36,align:"center",col:DQ.chalkSoft});withA(ctx,ag_in(t,t0+1.2,0.8),()=>{if(line)dq_T(ctx,String(line).toUpperCase(),960,704,{w:800,size:28,ls:3.5,align:"center",col:DQ.chalkSoft});});});}
// n: "Film 1 of 4"; series: the series' name
function dq_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;dq_veil(ctx,S,oA*0.93);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)dq_T(ctx,line,960,340,{w:700,size:48,align:"center",dark:true});dq_mark(ctx,960,500,62,(t-t0-0.7)/1.8,1);dq_T(ctx,title,960,660,{w:800,size:44,align:"center",dark:true});
    dq_T(ctx,(n?n+" · ":"")+(series||"Data quality")+" · Learning Data",960,718,{w:600,size:28,align:"center",col:DQ.chalkSoft});});}
