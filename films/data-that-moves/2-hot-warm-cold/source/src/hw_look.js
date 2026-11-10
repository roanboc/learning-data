/* ===== Hot, warm, cold: the film's own pictures =====
   Drawn with the module's look (films/data-that-moves/shared/src/: MD's colours, glass cards, lanes of light, the map's parts and
   its people), over the module's places and this film's own (hw_places.js). Every top-level name starts with hw_ or HW_.

   Temperature isn't one of the module's colours, so it never takes one: where data is hot, warm or cold is shown by where it
   lives and how it moves, and always said in words. Hot data sits at the top, close to the app that reads it, bright, its changes
   running all the time; warm data in the middle, worked out on a schedule (a clock); cold data deep below, still, under frost.
   The light on each band is only a tint of white: warm white for hot, cool white for cold, never the red of an error, the amber
   of a person's turn or the blue of data moving.
     hw_scr(ctx, S, fn)                  draw in the frame, whatever the camera does
     hw_thermo(ctx, x, y, h, level, o)   a thermometer: its glass, and its column of light up to level (0 cold, 1 hot)
     hw_bands(ctx, x, y, w, o)           the three temperatures, one band each, hot at the top: o.on [hot, warm, cold] (0 to 1, each
                                         springs in), o.hl a band's index (the others dim), o.h, o.lines (false: names only), o.t;
                                         returns each band's box
     hw_frost(ctx, x, y, w, h, a, r)     frost on glass, over a box
     hw_tempTag(ctx, x, y, key, o)       a small tag: a thermometer and the word (HOT, WARM, COLD)
     hw_vaultLive(ctx, t, o)             the vault's tunnel, halls and boxes, over the place hwVault
     hw_pin(ctx, x, y, o)                a place on the opening's map, and its label
     hw_arc(a, b, lift)                  a lane's points from a to b, bowed up by lift
     hw_timeline(ctx, x, y, w, o)        the moments of a pay week, in order: a change in HR, claims close, the night's load, pay day
     hw_app(ctx, x, y, w, h, o)          the claims app's page: claims, by unit and duty, and where each stands (never an amount)
     hw_bars(ctx, x, y, w, o)            each faculty's spending this year against its budget, as bars without figures
     hw_code(ctx, x, y, lines, o)        lines of code, in IBM Plex Mono
     hw_years(ctx, x, y, o)              the pay records, a block of files for each year, on hot storage or the archive tier
     hw_claim(ctx, x, y, o)              Linh's claim, as a card that cools as it goes
     hw_rows(ctx, t, o)                  three kinds of data on their way across the map: the contracts, each faculty's spending, the pay
                                         records, each from where it's born, through the platform, to who reads it */

const HW={heat:[255,224,196],frost:[206,226,252],snow:[236,243,255],seed:[226,206,160]};
const HW_BAND=[{key:"hot",n:"Hot",tint:[255,224,196],lvl:0.92},{key:"warm",n:"Warm",tint:[238,232,222],lvl:0.55},{key:"cold",n:"Cold",tint:[206,226,252],lvl:0.12}];
const hw_band=k=>HW_BAND.find(b=>b.key===k)||HW_BAND[0];

function hw_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a phase for what is shown and then put away: 0 before tIn, 1 from tIn+din, back to 0 from tOut over dout
const hw_io=(t,tIn,tOut,din,dout)=>ag_in(t,tIn,din||0.5)*(1-ag_in(t,tOut,dout||0.5));

/* ---------------------------------------------------------------- the thermometer */
function hw_thermo(ctx,x,y,h,level,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||26,r=w*0.95,top=y,bot=y+h,lv=clamp(level,0,1),col=mix(HW.frost,HW.heat,lv);
  ctx.save();ctx.globalAlpha*=a;
  // the glass: a tube and its bulb
  ctx.beginPath();ctx.moveTo(x-w/2,top+w/2);ctx.arc(x,top+w/2,w/2,Math.PI,0);ctx.lineTo(x+w/2,bot-r*0.7);ctx.arc(x,bot,r,-Math.PI/2+0.55,Math.PI*1.5-0.55);ctx.closePath();
  ctx.fillStyle="rgba(10,17,35,0.92)";ctx.fill();ctx.strokeStyle=rgba(MD.soft,0.85);ctx.lineWidth=2.4;ctx.stroke();
  // the column of light, up to the level
  const ch=(h-w)*lv,cw=w*0.46;glow(ctx,x,bot,r*2.2,col,0.35);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,bot,r*0.68,0,TAU);ctx.fill();
  if(ch>0){rr(ctx,x-cw/2,bot-r*0.5-ch,cw,ch+r*0.5,cw/2);ctx.fill();}
  // its marks: hot at the top, cold at the foot
  if(o.marks!==false)for(const b of HW_BAND){const yy=bot-r*0.5-(h-w)*b.lvl;ctx.strokeStyle=rgba(MD.soft,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/2+4,yy);ctx.lineTo(x+w/2+16,yy);ctx.stroke();
    if(o.labels)md_T(ctx,b.n.toUpperCase(),x+w/2+26,yy+10,{w:800,size:28,ls:3,col:b.tint});}
  ctx.restore();}

/* ---------------------------------------------------------------- frost on glass, painted once and laid over a box */
function hw_frostTex(){return ag_kept("hwFrost",1024,512,(c,w,h)=>{const rnd=ag_rnd(1802);
  // soft white at the edges, as frost gathers there first
  for(const [x,y,r] of [[0,0,420],[w,0,380],[0,h,360],[w,h,420],[w*0.5,h,300]]){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(236,244,255,0.5)");g.addColorStop(1,"rgba(236,244,255,0)");c.fillStyle=g;c.fillRect(0,0,w,h);}
  // its crystals: short branching strokes, densest near the edges
  c.lineCap="round";for(let i=0;i<520;i++){const ex=rnd(),x=ex<0.5?Math.pow(rnd(),2)*w*0.6:w-Math.pow(rnd(),2)*w*0.6,y=rnd()<0.5?Math.pow(rnd(),1.6)*h:h-Math.pow(rnd(),1.6)*h,l=4+rnd()*16,an=rnd()*TAU;
    c.strokeStyle="rgba(236,244,255,"+(0.12+rnd()*0.3).toFixed(3)+")";c.lineWidth=0.8+rnd()*1.2;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);
    for(const s of[-1,1]){const k=0.5,bx=x+Math.cos(an)*l*k,by=y+Math.sin(an)*l*k;c.moveTo(bx,by);c.lineTo(bx+Math.cos(an+s*0.9)*l*0.4,by+Math.sin(an+s*0.9)*l*0.4);}c.stroke();}
  for(let i=0;i<1600;i++){c.fillStyle="rgba(236,244,255,"+(0.05+rnd()*0.18).toFixed(3)+")";const z=0.8+rnd()*1.8;c.fillRect(rnd()*w,rnd()*h,z,z);}});}
function hw_frost(ctx,x,y,w,h,a,r){if(!(a>0.004))return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);rr(ctx,x,y,w,h,r==null?16:r);ctx.clip();ctx.drawImage(hw_frostTex(),x,y,w,h);ctx.restore();}

/* ---------------------------------------------------------------- the three temperatures */
const HW_LINES=[["within seconds or minutes · read all the time","small, and close to where it's used"],
  ["fresh to the hour or the day · read often","worked out on a schedule"],
  ["rarely read, but kept","cheap, until it may be deleted"]];
function hw_bands(ctx,x,y,w,o){o=o||{};const on=o.on||[1,1,1],h=o.h||150,gap=o.gap||20,boxes=[];
  HW_BAND.forEach((b,i)=>{const yy=y+i*(h+gap),box={x,y:yy,w,h};boxes.push(box);const k=on[i]||0;if(k<=0.004)return;const dim=o.hl==null?1:o.hl===i?1:0.42;
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.35)*dim;ag_about(ctx,x+w/2,yy+h/2,lerp(0.94,1,Math.min(1,ag_spr(k,0,0.5))));
    md_card(ctx,x,yy,w,h,{edge:b.tint,glow:i===0?0.9:0.5,edgeA:0.7,fill:"rgba(11,19,38,0.94)"});
    // the band's light: warm white low along a hot band, frost over a cold one
    if(i===0){const g=ctx.createLinearGradient(0,yy,0,yy+h);g.addColorStop(0,rgba(b.tint,0.02));g.addColorStop(1,rgba(b.tint,0.12));ctx.fillStyle=g;rr(ctx,x,yy,w,h,18);ctx.fill();}
    if(i===2)hw_frost(ctx,x,yy,w,h,0.55,18);
    hw_thermo(ctx,x+52,yy+22,h-62,b.lvl,{w:20,marks:false});
    md_T(ctx,b.n.toUpperCase(),x+96,yy+(o.lines===false?h/2+12:54),{w:800,size:o.lines===false?36:32,ls:5,col:b.tint});
    if(o.lines!==false){const L=(o.text&&o.text[i])||HW_LINES[i];md_T(ctx,L[0],x+96,yy+96,{w:600,size:28,col:MD.ink});if(L[1])md_T(ctx,L[1],x+96,yy+134,{w:600,size:28,col:MD.soft});}
    // a hot band's changes run along it all the time; a warm band's clock; a cold band is still
    if(i===0&&o.t!=null&&o.flow!==false){const pts=[[x+w-330,yy+h-26],[x+w-30,yy+h-26]];md_flow(ctx,pts,o.t,{kind:"events",col:b.tint,every:0.5,dur:1.2,size:0.6});}
    if(i===1&&o.clock!==false)md_icon(ctx,"clock",x+w-58,yy+52,40,b.tint);
    if(i===2&&o.lock)md_icon(ctx,"lock",x+w-58,yy+52,36,MD.personal);
    ctx.restore();});
  return boxes;}
// a small tag: a thermometer and the temperature's name
function hw_tempTag(ctx,x,y,key,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const b=hw_band(key),txt=(o.text||b.n).toUpperCase(),tw=md_tw(ctx,txt,{w:800,size:28,ls:4}),w=tw+82,h=56,bx=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,bx+w/2,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,bx,y-h/2,w,h,{edge:b.tint,r:h/2,glow:0.6,fill:"rgba(7,12,26,0.94)"});
  if(key==="cold")hw_frost(ctx,bx,y-h/2,w,h,0.45,h/2);hw_thermo(ctx,bx+30,y-18,30,b.lvl,{w:10,marks:false});md_T(ctx,txt,bx+52,y+10,{w:800,size:28,ls:4,col:b.tint});ctx.restore();return{x:bx,y:y-h/2,w,h};}

/* ---------------------------------------------------------------- the vault, live: its tunnel, its halls, the boxes in them
   o.tunnel (0 to 1) the tunnel's light runs in from the door; o.halls (0 to 1) the halls light; o.boxes (0 to 1) the shelves fill;
   o.cold (0 to 1) frost on the halls; o.out (0 to 1) boxes carried out along the tunnel to the door (2015); o.a */
function hw_vaultLive(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const V=HW_VAULT;ctx.save();ctx.globalAlpha*=a;
  const tu=clamp(o.tunnel==null?1:o.tunnel,0,1),[p0,p1]=V.tunnel;
  if(tu>0){const pts=[[p0[0],p0[1]],[lerp(p0[0],p1[0],tu),lerp(p0[1],p1[1],tu)]];ctx.save();ctx.lineCap="round";ctx.strokeStyle="rgba(6,10,20,0.95)";ctx.lineWidth=30;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);ctx.lineTo(pts[1][0],pts[1][1]);ctx.stroke();ctx.restore();
    md_lane(ctx,pts,HW.frost,0.9);}
  const hl=clamp(o.halls||0,0,1);
  V.halls.forEach(([x,y,w,h],i)=>{const k=clamp(hl*1.5-i*0.25,0,1);if(k<=0)return;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.6);
    md_card(ctx,x,y,w,h,{edge:HW.frost,glow:0.7,r:12,fill:"rgba(8,14,28,0.96)"});
    // the shelves, and the sealed boxes on them, filling from the bottom
    const bx=clamp((o.boxes||0)*1.3-i*0.15,0,1);for(let s=0;s<4;s++){const sy=y+h-28-s*42;ctx.strokeStyle=rgba(HW.frost,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+14,sy);ctx.lineTo(x+w-14,sy);ctx.stroke();
      for(let b=0;b<5;b++){const f=clamp(bx*20-(s*5+b),0,1);if(f<=0)continue;const out=clamp((o.out||0)*24-(i*20+s*5+b)*0.6,0,1);if(i!==1&&out>0)continue;
        ctx.save();ctx.globalAlpha*=f*(1-(i===1?out:0));rr(ctx,x+22+b*33,sy-34,28,32,3);ctx.fillStyle="rgba(46,58,84,1)";ctx.fill();ctx.strokeStyle=rgba(HW.frost,0.7);ctx.lineWidth=1.4;ctx.stroke();
        ctx.fillStyle=rgba(HW.snow,0.75);ctx.fillRect(x+28+b*33,sy-26,16,4);ctx.restore();}}
    hw_frost(ctx,x,y,w,h,(o.cold==null?1:o.cold)*0.6,12);ctx.restore();});
  // boxes going out, along the tunnel to the door
  if(o.out>0&&o.out<1){const p=mk([P(p1[0],p1[1]),P(p0[0],p0[1])]);spawn(t,0.6,2.2,0,(u)=>{if(u<0||u>1)return;const q=at(p,ease(u)),f=sstep(0,0.1,u)*(1-sstep(0.85,1,u))*sstep(0,0.08,o.out)*(1-sstep(0.85,1,o.out));
      ctx.save();ctx.globalAlpha*=f;glow(ctx,q.x,q.y,26,HW.seed,0.6);rr(ctx,q.x-14,q.y-24,28,32,3);ctx.fillStyle="rgba(60,72,98,1)";ctx.fill();ctx.strokeStyle=rgba(HW.seed,0.9);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();});}
  ctx.restore();}

/* ---------------------------------------------------------------- the opening's map: places and the lanes between them */
// a place: a point of light (o.col: warm for seeds in use, frost for the vault), o.lit (0 to 1), o.out (0 to 1: its light gone, a ring
// left), o.label {title, sub} on o.side ("right", "left", "above" or "below"), o.k springs it in
function hw_pin(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||HW.heat,lit=o.lit==null?1:o.lit,out=o.out||0;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x,y,lerp(0.4,1,Math.min(1.2,ag_spr(o.k,0,0.5))));
  glow(ctx,x,y,46,col,0.55*lit*(1-out));ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.stroke();
  ctx.fillStyle=rgba(col,(1-out)*(0.4+0.6*lit));ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();
  if(o.label){const L=o.label,side=o.side||"right",la=o.labelA==null?1:o.labelA,tw=Math.max(md_tw(ctx,L.title,{w:800,size:30}),L.sub?md_tw(ctx,L.sub,{w:600,size:28}):0);
    let lx=side==="left"?x-28-tw:side==="right"?x+28:x-tw/2,ly=side==="above"?y-(L.sub?78:40):side==="below"?y+52:y+(L.sub?-6:10);
    ctx.save();ctx.globalAlpha*=la;md_T(ctx,L.title,lx,ly,{w:800,size:30,col:MD.ink});if(L.sub)md_T(ctx,L.sub,lx,ly+36,{w:600,size:28,col:MD.soft});ctx.restore();}
  ctx.restore();}
// a lane's points from a to b, bowed up by lift (px)
function hw_arc(a,b,lift){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2-(lift||0);return bez(P(a[0],a[1]),P(lerp(a[0],mx,0.7),lerp(a[1],my,0.7)),P(lerp(b[0],mx,0.7),lerp(b[1],my,0.7)),P(b[0],b[1]),40).map(p=>[p.x,p.y]);}
// seed boxes carried along a lane: o.col, o.every, o.dur, o.a, o.back
function hw_seeds(ctx,pts,t,o){o=o||{};md_flow(ctx,pts,t,{kind:"batch",col:o.col||HW.seed,every:o.every||1.6,dur:o.dur||2.4,a:o.a,back:o.back,size:o.size||0.62,off:o.off});}

/* ---------------------------------------------------------------- the hot chapter's week
   The moments that decide when a tutor is paid, in order and equally spaced (not to scale): o.stops [{t: "Monday 09:00", s: "a change
   in HR", col, a}], each a point on the line with its time and what happens under it; o.span [{from, to, col, a, dash}] a lane
   along the line between two stops (fractions allowed: the change, on its way to the app); o.t for a dashed lane's motion; o.a. */
function hw_timeline(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const st=o.stops||[],n=st.length,dx=w/Math.max(1,n-1),X=i=>x+i*dx;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x-150,y-60,w+300,200,{fill:"rgba(9,15,31,0.92)"});
  ctx.strokeStyle=rgba(MD.dim,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-110,y);ctx.lineTo(x+w+110,y);ctx.stroke();
  for(const sp of o.span||[]){const sa=sp.a==null?1:sp.a;if(sa<=0.004)continue;md_lane(ctx,[[X(sp.from),y],[X(sp.to),y]],sp.col||MD.flow,sa,{dash:sp.dash,t:o.t});}
  st.forEach((m,i)=>{const ma=m.a==null?1:m.a;if(ma<=0.004)return;ctx.save();ctx.globalAlpha*=ma;const mx=X(i),col=m.col||MD.ink;
    glow(ctx,mx,y,24,col,0.6);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(mx,y,9,0,TAU);ctx.fill();
    md_T(ctx,m.t,mx,y+54,{w:800,size:28,align:"center",col});if(m.s)md_T(ctx,m.s,mx,y+94,{w:600,size:28,align:"center",col:MD.soft});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the claims app
   Its page, as the app's own: claims, each with its unit and duty, and where it stands (waiting for its coordinator, approved).
   Never an amount: a claim's amount is a person's pay. o.rows [[unit, duty, state], ...], state "waiting" or "approved";
   o.rowA (row, i) => opacity; o.lit; o.title. */
function hw_app(ctx,x,y,w,h,o){o=o||{};const st={waiting:{s:"waiting",col:MD.wait,icon:"clock"},approved:{s:"approved",col:MD.pass,icon:"tick"},check:{s:"checking",col:MD.soft,icon:"refresh"}};
  return md_window(ctx,x,y,w,h,{product:"Claims app",title:o.title||"Claims",a:o.a,k:o.k,edge:o.edge,draw:(c,b)=>{
    md_rows(c,b.x+6,b.y,[{h:"Unit",w:150,f:"mono"},{h:"Duty",w:160},{h:"",w:Math.max(160,b.w-322)}],
      (o.rows||[]).map(r=>{const s=st[r[2]]||{s:r[2],col:MD.soft};return[r[0],r[1],{s:s.s,col:s.col,icon:s.icon}];}),{rh:56,rowA:o.rowA,lit:o.lit,litCol:o.litCol});}});}

/* ---------------------------------------------------------------- spending against budget, by faculty
   Four faculties, each a bar for what it has spent this year against its budget (the budget a dashed mark), with no figures: the
   film shows how the answer is kept, not what it says. o.spent [0 to 1, ...] how far each bar has run; o.a; returns its box. */
const HW_FACULTIES=["Arts","Business","Engineering","Health"],HW_SPENT=[0.71,0.64,0.69,0.74];
function hw_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=330;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:o.edge,glow:0.5});md_T(ctx,o.title||"Spent this year, against budget",x+28,y+52,{w:700,size:30});
  const bx=x+230,bw=w-262;HW_FACULTIES.forEach((f,i)=>{const yy=y+102+i*58,s=(o.spent?o.spent[i]:1)*HW_SPENT[i];md_T(ctx,f,x+28,yy+10,{w:600,size:28,col:MD.soft});
    rr(ctx,bx,yy-12,bw,24,12);ctx.fillStyle="rgba(150,175,215,0.12)";ctx.fill();if(s>0){rr(ctx,bx,yy-12,bw*s,24,12);ctx.fillStyle=rgba(o.col||MD.dom.finance,0.85);ctx.fill();}
    ctx.strokeStyle=rgba(MD.ink,0.7);ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(bx+bw*0.86,yy-22);ctx.lineTo(bx+bw*0.86,yy+22);ctx.stroke();ctx.setLineDash([]);});
  md_T(ctx,"budget",bx+bw*0.86,y+h-16,{w:600,size:28,align:"center",col:MD.soft});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- code
   lines [{s, col, hl}], in IBM Plex Mono, 28 px, 44 apart; o.hl a line's index (or several) on a band of light; o.n how many lines
   are shown (they come in one by one); o.a */
function hw_code(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||44,hls=o.hl==null?[]:[].concat(o.hl);if(a<=0.004)return lines.length*lh;ctx.save();ctx.globalAlpha*=a;
  lines.forEach((l,i)=>{const L=typeof l==="string"?{s:l}:l,k=o.n==null?1:clamp(o.n-i,0,1);if(k<=0.004)return;const yy=y+i*lh;ctx.save();ctx.globalAlpha*=k;
    if(hls.includes(i)){ctx.fillStyle=rgba(o.hlCol||MD.flow,0.13);rr(ctx,x-12,yy-32,(o.w||900),lh,8);ctx.fill();}
    md_T(ctx,L.s,x,yy,{w:500,size:28,f:"mono",col:L.col||MD.ink});ctx.restore();});ctx.restore();return lines.length*lh;}

/* ---------------------------------------------------------------- the pay records, year by year
   Each year a block of files, on the shelf of hot storage (the costliest) or sunk to the archive tier (the cheapest), under frost.
   o.years ["2016", ...]; o.sink [0 to 1 per year] how far each has sunk; o.gone [0 to 1 per year] deleted, its files gone; o.read
   [0 to 1 per year] read often (it glows); o.cols (spacing, 136); o.top (hot storage's shelf, y), o.low (the archive's shelf, y);
   o.a. Returns each block's centre. */
function hw_years(ctx,x,o){o=o||{};const a=o.a==null?1:o.a,ys=o.years||[],sp=o.cols||136,top=o.top||470,low=o.low||742,at=[];
  ys.forEach((yr,i)=>{const cx=x+i*sp,s=ag_sine(o.sink?o.sink[i]||0:0),cy=lerp(top,low,s),g=o.gone?o.gone[i]||0:0,rd=o.read?o.read[i]||0:0;at.push([cx,cy]);if(a<=0.004||g>=1)return;
    ctx.save();ctx.globalAlpha*=a*(1-ag_sine(g));
    // the files: a small stack, personal data (lilac), cooled to frost as they sink
    const col=mix(MD.personal,HW.frost,s*0.6);if(rd>0)glow(ctx,cx,cy-40,80,col,0.35*rd);
    for(let k=2;k>=0;k--){rr(ctx,cx-42+k*7,cy-92-k*8,84,96,8);ctx.fillStyle=rgba(mix(col,MD.navy,0.78),1);ctx.fill();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.8;ctx.stroke();}
    ctx.fillStyle=rgba(col,0.55);for(let r=0;r<3;r++)ctx.fillRect(cx-28,cy-70+r*18,46,4);
    if(s>0.02)hw_frost(ctx,cx-44,cy-108,104,112,s*0.8,8);
    md_T(ctx,yr,cx,cy+80,{w:700,size:28,align:"center",col:rd>0.5?MD.ink:MD.soft});ctx.restore();});
  return at;}
// a storage shelf: a long glass ledge with its name; o.cold for the archive tier (frost), o.a
function hw_shelf(ctx,x,y,w,title,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,26,{edge:o.cold?HW.frost:[170,190,225],r:13,glow:0.5,fill:"rgba(12,20,40,0.95)"});if(o.cold)hw_frost(ctx,x,y,w,26,0.8,13);
  md_T(ctx,title,x+w+30,y+4,{w:800,size:30,col:o.cold?HW.frost:MD.ink});if(sub)md_T(ctx,sub,x+w+30,y+42,{w:600,size:28,col:MD.soft});ctx.restore();}

/* ---------------------------------------------------------------- Linh's claim, as a card that cools
   o.temp 0 (cold) to 1 (hot): its edge and light follow; o.state its last line; o.a, o.k */
function hw_claim(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||420,h=150;if(a<=0.004)return{x,y,w,h};const tp=clamp(o.temp==null?1:o.temp,0,1),col=mix(HW.frost,HW.heat,tp);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));glow(ctx,x+w/2,y+h/2,w*0.6,col,0.32*tp);
  md_card(ctx,x,y,w,h,{edge:col,glow:0.4+0.8*tp});if(tp<0.5)hw_frost(ctx,x,y,w,h,(0.5-tp)*1.6,18);
  md_T(ctx,"LINH'S CLAIM",x+28,y+50,{w:800,size:28,ls:4,col});md_T(ctx,"Tutorials, last week",x+28,y+96,{w:700,size:32});
  if(o.state)md_T(ctx,o.state,x+28,y+132,{w:600,size:28,col:MD.soft});md_icon(ctx,"doc",x+w-48,y+44,36,col);ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- three kinds of data, each on its way across the map
   The film's own close-up of the platform map: three rows, each a kind of data from where it's born (left), through the platform
   (the middle, on Databricks' pane), to who reads it (right): the contracts, from the HR system to the claims app; each faculty's
   spending, from the finance system's ledger to Finance's and the faculties' morning look; the pay records (personal: lilac, with a
   lock), from the payroll system to an audit now and then. o.on [0 to 1, ...] each row comes in; o.hl a row's index (the others dim);
   o.therm (0 to 1) a thermometer on each table, its level unknown; o.temp [0 to 1, ...] each row's temperature found: the column
   settles at its level, and its tag comes in; o.say [words, ...] a line under each row's table, o.sayA [0 to 1, ...]; o.t; o.a. */
const HW_PAYROLL=[176,190,222];
const HW_ROWS=[{sys:"hr",name:"contracts",reader:"Claims app",rsub:"checks each claim",icon:"doc"},
  {sys:"fin",name:"spending_by_faculty",reader:"Each morning",rsub:"Finance, the faculties",icon:"person"},
  {sys:{n:"Payroll system",s:"Each pay, each pay day",c:HW_PAYROLL},name:"pay_records",reader:"An audit",rsub:"now and then",icon:"eye",personal:true}];
const HW_ROW={y:[222,442,662],sx:96,sw:404,px:600,pw:700,tx:650,tw:600,rx:1420,rw:420};
function hw_rows(ctx,t,o){o=o||{};const a=o.a==null?1:o.a,R=HW_ROW,on=o.on||[1,1,1],tp=o.temp||[0,0,0];if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const pa=Math.max(on[0],on[1],on[2]);md_platform(ctx,R.px,150,R.pw,670,{a:ag_in(pa,0,0.4),logos:true});
  HW_ROWS.forEach((r,i)=>{const k=on[i]||0;if(k<=0.004)return;const y=R.y[i],dim=o.hl==null?1:o.hl===i?1:0.38,b=HW_BAND[i];
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4)*dim;
    const sb=md_system(ctx,R.sx,y,R.sw,r.sys,{}),ty=y+19,tb={x:R.tx,y:ty,w:R.tw,h:72},col=r.personal?MD.personal:MD.flow;
    md_table(ctx,tb.x,tb.y,tb.w,{name:r.name,col,icon:r.personal?"lock":"table"});
    const rb=md_reader(ctx,R.rx,y,R.rw,{title:r.reader,sub:r.rsub,icon:r.icon,col:MD.ink});
    const l1=md_curve(sb.port,[tb.x,tb.y+36],{bend:0.5}),l2=md_curve([tb.x+tb.w,tb.y+36],rb.port,{bend:0.5}),u=ag_sine(clamp(k*1.6-0.3,0,1));
    md_lane(ctx,l1,r.personal?MD.personal:MD.flow,0.8,{u});md_lane(ctx,l2,r.personal?MD.personal:MD.flow,0.8,{u});
    if(o.t!=null&&u>=1){md_flow(ctx,l1,o.t,{col:r.personal?MD.personal:MD.flow,off:i*0.7,every:1.4});md_flow(ctx,l2,o.t,{col:r.personal?MD.personal:MD.flow,off:i*0.5+0.3,every:1.6});}
    // the thermometer on the table: its level unknown (a slow drift) until its temperature is found
    const th=o.therm||0,f=ag_sine(tp[i]||0);
    if(th>0.004){const drift=0.5+0.18*Math.sin((o.t||0)*1.3+i*2.1),lv=lerp(drift,b.lvl,f);ctx.save();ctx.globalAlpha*=ag_in(th,0,0.5)*(1-ag_in(tp[i]||0,0.2,0.4));
      hw_thermo(ctx,tb.x+tb.w-36,tb.y+12,48,lv,{w:14,marks:false});ctx.restore();}
    if(f>0.004)hw_tempTag(ctx,tb.x+tb.w-14,tb.y+36,b.key,{align:"right",a:ag_in(tp[i],0,0.4),k:tp[i]*2});
    if(o.say&&o.say[i]){const sa=o.sayA?o.sayA[i]:1;if(sa>0.004)md_T(ctx,o.say[i],tb.x+tb.w/2,tb.y+tb.h+44,{w:700,size:28,align:"center",col:b.tint,a:sa});}
    ctx.restore();});
  ctx.restore();}
