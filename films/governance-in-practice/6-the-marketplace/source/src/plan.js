/* ===== The marketplace: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): the Faculty of Health, close at Anil's desk; the
   campus; Planning's office, close at Clara's desk; the registrar's office, close at Mei's desk; the platform team's room, close at
   Sam's desk; the university's directory, a card index on the platform team's wall; Noor's map, close; a shop window on a street, and a
   smaller one; the data team's desk from above, for the papers; a big screen on a desk, on the faculty's, Planning's, the registrar's,
   the platform team's or the data team's wall; and the data team's board. The pictures are the film's own things, drawn with the
   series' pieces (shared/src/tools.js): the certificate's units, the last a placement in a hospital; learners as plain shapes, each
   with a bar of credit; the copy that went round by email, its codes in pale plum; the six data products as tiles, in a shop window and
   in the catalogue's marketplace; the catalogue's pages, drawn as forms (a product's page, its contract, the request, the owner's
   approval, the reminder, the readers); a small key with a date on its tag; the platform's table page and its permissions; the impact
   check's report; the sharing page, a partner's window, and a private exchange. Every name starts with gk_ or GK_. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const gk_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// words drawn under something that covers them, which the legibility check (tools/legible.py) leaves out: it reads PH_OFF, the name
// From words to data's tools give the hook
let PH_OFF=0;
function gk_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// shots in a row in the same place share one camera, so a dissolve between them never lays the place over itself at another size or
// framing: if each holds still, one slow push over the whole run; if one moves, all follow the same keys. hold: no push on the last
// run, when the next chapter opens in the same place
function gk_run(shots,end,hold){const out=shots.map(s=>Object.assign({},s));
  for(let i=0;i<out.length;){let j=i;while(j+1<out.length&&out[j+1].place===out[i].place)j++;const R=out.slice(i,j+1),last=j===out.length-1;
    if(j>i||(hold&&last)){const t1=last?end:out[j+1].at,keys=[].concat(...R.map(s=>s.keys)).sort((a,b)=>a[0]-b[0]),k0=keys[0],
        still=keys.every(k=>k[1]===k0[1]&&k[2]===k0[2]&&k[3]===k0[3]),push=hold&&last?0:R[0].push==null?0.025:R[0].push;
      const cam=still?{keys:[k0,[k0[0]+0.01,k0[1],k0[2],k0[3]*(1+push)]],d:Math.max(1.4,t1-k0[0]),push:0}:{keys,d:Math.max(...R.map(s=>s.d||1.6)),push:0};
      R.forEach(s=>Object.assign(s,cam));}
    i=j+1;}
  return out;}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative; o.bx bows it sideways), drawn on as p goes 0 to 1
function gk_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// where a thing is, u (0 to 1) along gk_arrow's curve
function gk_along(a,b,bend,u,bx){const c=[(a[0]+b[0])/2+(bx||0),(a[1]+b[1])/2+bend],v=1-u;return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];}
// until now: the colours fade a little, warmer and paler (as Who may see it draws a memory)
function gk_memory(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="saturation";ctx.fillStyle=rgba([128,128,128],0.6*a);ctx.fillRect(-W,-H,3*W,3*H);
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([248,230,204],0.7*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(WC_PAPER,0.22*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a paper veil: the picture steps back (a, 0 to 1), as something had to change
function gk_veil(ctx,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.45*clamp(a,0,1));ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a thing coming in: it rises a little and settles (a, 0 to 1); fn draws it
function gk_rise(ctx,a,fn,dy){if(a<=0.01)return;ctx.save();ctx.translate(0,(dy==null?14:dy)*(1-easeCam(clamp(a,0,1))));withA(ctx,clamp(a*1.6,0,1),fn);ctx.restore();}
// a thread from a to b, drawn on as p goes 0 to 1, with a knot at each end: gold, unless o.col says
function gk_thread(ctx,a,b,p,o){o=o||{};if(p<=0)return;const col=o.col||GV.goldInk,al=o.a==null?1:o.a;
  gk_arrow(ctx,a,b,o.bend==null?-30:o.bend,p,{col,lw:o.lw||4.5,head:false,a:0.85*al,bx:o.bx,dash:o.dash});
  ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(a[0],a[1],6,0,TAU);ctx.fill();if(p>=1&&!o.open){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();}
// a pill: words on a rounded card, as wide as they are; x its left, y its middle; o.wash colours it. Returns its width
function gk_pill(ctx,x,y,s,o){o=o||{};const size=o.size||28,wt=o.w||700,w=Math.round(tw(ctx,s,size,wt,o.f)+44),h=size+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"pill",wash:o.wash,washA:o.washA==null?0.35:o.washA,seed:o.seed||s.length+7});wc_T(ctx,s,x+22,y+size*0.36,{w:wt,size,f:o.f,col:o.col||WC_DARK});return w;}
// a button on a page: its words on a pill in its colour, x its left, y its middle; pressed (o.press, 0 to 1), a soft halo comes and goes
function gk_button(ctx,x,y,s,o){o=o||{};const size=o.size||28,w=Math.round(tw(ctx,s,size,700)+56),h=size+26,pr=clamp(o.press||0,0,1),col=o.col||GU_CYAN;
  if(pr>0.01)gv_halo(ctx,x-18,y-h/2-18,w+36,h+36,col,0.9*Math.sin(Math.PI*pr));
  wc_panel(ctx,x,y-h/2,w,h,{kind:"pill",wash:col,washA:o.washA==null?0.4:o.washA,seed:o.seed||s.length+70});wc_T(ctx,s,x+28,y+size*0.36,{w:700,size,col:WC_DARK});return w;}
// a name plate, as Fixed where it starts sets one: springs in at t0, goes at t1
function gk_plate(ctx,t,t0,t1,x,y,lines){const a=t1==null?fin(t,t0,0.4):gv_io(t,t0,t1,0.4);if(a<=0.01)return;
  const w=Math.round(Math.max(tw(ctx,lines[0],30,800),tw(ctx,lines[1],28,600))+48),h=96,k=0.92+0.08*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:w});wc_T(ctx,lines[0],0,-6,{w:800,size:30,align:"center",col:WC_DARK});
    wc_T(ctx,lines[1],0,32,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a file sheet sliding up from below the frame to y as u goes 0 to 1; o passes on to gu_file
function gk_file(ctx,x,y,w,u,o){if(u<=0.01)return{rows:[],tx:x+GU_F.gut,h:0};u=clamp(u,0,1);
  return gu_file(ctx,x,y+36*(1-easeCam(u)),w,Object.assign({},o,{a:clamp(u*1.6,0,1)*(o.a==null?1:o.a)}));}
// a word marked in a line: a wash behind the part of s that is sub (the line's text from tx, its middle cy), in the typeface or, with
// size and wt, in the page's words
function gk_mark(ctx,tx,cy,s,sub,a,col,size,wt){if(a<=0.01)return;const i=s.indexOf(sub);if(i<0)return;const m=q=>size?tw(ctx,q,size,wt):gu_mw(ctx,q);
  gv_tint(ctx,tx+m(s.slice(0,i))-6,cy-21,m(sub)+12,42,col||GV.gold,0.85*clamp(a,0,1));}
// a screen's window drawn on the desk, as a plain form: its bar, and what fn draws in it
function gk_win(ctx,x,y,w,h,title,fn,bar){ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(x+8,y+14,w,h);ctx.restore();
  gv_screen(ctx,x,y,w,h,title,fn,{barH:46,titleSize:28,bar});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.restore();}
// an envelope, its flap drawn in pencil; o.clip: a sheet clipped to it, an attachment
function gk_env(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);withA(ctx,a,()=>{
  if(o.clip){ctx.save();ctx.rotate(-0.12);gv_sheet(ctx,10,-62,64,84);gv_lines(ctx,20,-46,44,4,14,0.9);ctx.restore();}
  wc_panel(ctx,-46,-30,92,60,{kind:"envelope",seed:481});
  ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-44,-28);ctx.lineTo(0,4);ctx.lineTo(44,-28);ctx.stroke();});ctx.restore();}
// a report in Markdown, as a page shows it (as Products in open formats draws one): items {h:1 or 2, s}, {li:s}, {cont:1, s}, {s},
// {fold:1}, each with p (0 to 1, shown), lit (a wash in litCol) and col (its ink); drawn from (x,y), w wide; returns each item's baseline
function gk_md(ctx,x,y,w,items){let by=y+54;const out=[];items.forEach(it=>{const p=it.p==null?1:clamp(it.p,0,1),sz=it.h===1?36:it.h===2?30:28,lh=it.h===1?56:it.h===2?50:it.fold?36:40;
    if(p>0.01){const tx=x+30+(it.li!=null||it.cont?32:0),s=it.li!=null?it.li:it.s;
      if(it.lit>0.01)gv_tint(ctx,x+16,by-32,w-32,lh-2,it.litCol||GV.gold,0.8*clamp(it.lit,0,1));
      withA(ctx,p,()=>{if(it.fold)wc_T(ctx,"…",x+30,by,{w:500,size:28,f:"mono",col:WC_PENCIL});
        else if(it.h)wc_T(ctx,s,x+30,by,{w:800,size:sz,col:WC_DARK});
        else{if(it.li!=null)wc_T(ctx,"•",x+34,by,{w:800,size:28,col:it.col||WC_INK});gu_md(ctx,s,tx,by,{size:28,col:it.col});}});}
    out.push(by);by+=lh;});return{rows:out,end:by};}
// a caret, blinking, at the end of words typed in (x its place, y the words' baseline)
function gk_caret(ctx,t,x,y,h){if(Math.sin(t*9)>-0.3){ctx.fillStyle=rgba(WC_DARK,0.85);ctx.fillRect(x+3,y-(h||28)+2,3,(h||28)+4);}}
// words typed in as p goes 0 to 1, with a caret while they're typed; returns the width typed
function gk_typed(ctx,t,s,x,y,p,o){o=o||{};p=clamp(p,0,1);if(p<=0)return 0;const size=o.size||28,wt=o.w||600,n=Math.ceil(s.length*p),sub=s.slice(0,n);
  wc_T(ctx,sub,x,y,{w:wt,size,f:o.f,col:o.col||WC_DARK});const w=tw(ctx,sub,size,wt,o.f);if(p<1)gk_caret(ctx,t,x+w,y,size);return w;}
// a catalogue's bar, in no product's colours: Ontos's, as Products in open formats drew it; the faculty's mail; a partner's tool
const GK_CAT=[84,112,96],GK_MAIL=[96,104,124],GK_OTHER=[110,104,96];
const GK_ONTOS="Ontos · Databricks Labs";

/* ---------- the six products, as tiles ---------- */
// each product, its owner team as the catalogue names it, its owner for short, the colour Products in open formats gives it, its domain
const GK_SIX=[["Learner records","Mei Tanaka, registrar's office","Mei Tanaka",[104,128,170],"student"],["Awards","Mei Tanaka, registrar's office","Mei Tanaka",[176,104,88],"course"],
  ["Learners near an award","Clara Jensen, Planning","Clara Jensen",[204,150,64],"planning"],["Learner wallet","Wallet app team","Wallet app team",[110,146,104],"wallet"],
  ["Tuition forgone","Finance","Finance",[138,112,150],"finance"],["Short-course follow-ups","Learning team","Learning team",[86,146,142],"learning"]];
// a product's tile (x,y its top left, w by h): its colour along its top, its name (as large as fits, 28 px or more), its domain on a
// pill (o.dom, 0 to 1, washes it), its owner (o.short: the short name), on a gold chip (o.own, 0 to 1); o.lit, a gold halo; o.lift (0 to
// 1), it lifts towards us; o.a
function gk_tile(ctx,i,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [name,team,short,col,dom]=GK_SIX[i],lf=easeCam(clamp(o.lift||0,0,1)),sc=1+0.06*lf;
  ctx.save();ctx.translate(x+w/2,y+h/2-14*lf);ctx.scale(sc,sc);ctx.translate(-w/2,-h/2);withA(ctx,a,()=>{
    if(lf>0.01){ctx.save();ctx.filter="blur(10px)";ctx.fillStyle=rgba([70,60,50],0.22*lf);ctx.fillRect(10,18,w,h);ctx.restore();}
    const lit=clamp(o.lit||0,0,1);if(lit>0.01)gv_halo(ctx,-30,-30,w+60,h+60,GV.gold,0.9*lit);
    wc_panel(ctx,0,0,w,h,{kind:"card",seed:760+i});ctx.save();ctx.fillStyle=rgba(col,0.9);ctx.fillRect(8,8,w-16,18);ctx.restore();
    const sz=o.size||34,ns=Math.max(28,Math.min(sz,sz*(w-48)/tw(ctx,name,sz,800)));wc_T(ctx,name,24,76,{w:800,size:ns,col:WC_DARK});
    let oy=h-36;if(o.short==null||!o.short){const d=clamp(o.dom==null?1:o.dom,0,1);gk_pill(ctx,24,128,dom,{size:28,w:600,wash:d>0.5?col:GV.grey,washA:0.18+0.22*d,seed:780+i});}
    else oy=h-40;
    const own=o.short?short:team,os=28,g=clamp(o.own||0,0,1),ow=tw(ctx,own,os,600);
    if(g>0.01)wc_panel(ctx,16,oy-os*0.95,Math.round((ow+16)*easeCam(g))+2,Math.round(os*1.4),{kind:"tag",wash:GV.gold,washA:0.42,seed:790+i});
    wc_T(ctx,own,24,oy,{w:600,size:os,col:WC_INK});});ctx.restore();}

/* ---------- the key ---------- */
// a small key on a ring, kept: gold while it's good, grey once its date has passed
const GK_GOLD=[214,176,92],GK_GREY=[170,170,178];
function gk_keyC(col){return wc_kept("gkKey"+col.join(","),210,100,q=>{q.translate(18,50);wc_wash(q,wc_ell(30,0,28,28,30),col,{kind:"thing",lw:1.3,seed:81});
  q.save();q.globalCompositeOperation="destination-out";q.beginPath();q.arc(25,0,10,0,TAU);q.fill();q.restore();
  wc_part(q,wc_rect(54,-7,112,14),col,1,{seed:82});wc_part(q,[[128,7],[142,7],[142,26],[135,21],[128,26]],col,1,{seed:83});wc_part(q,[[150,7],[164,7],[164,22],[150,22]],col,1,{seed:84});});}
// the key at (x,y), its ring's middle, turned by rot, and its paper tag on a string, the date in its owner's words (date); o.grey (0 to 1):
// past its date; o.flat: lying on a desk, the tag beside it, its middle at y; o.lit (0 to 1): a gold halo round the tag; o.a
function gk_key(ctx,x,y,rot,date,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const g=clamp(o.grey||0,0,1);
  ctx.save();ctx.translate(x,y);withA(ctx,a,()=>{ctx.save();ctx.rotate(rot);if(g<0.99)withA(ctx,1-g,()=>ctx.drawImage(gk_keyC(GK_GOLD),-48,-50));
    if(g>0.01)withA(ctx,g,()=>ctx.drawImage(gk_keyC(GK_GREY),-48,-50));ctx.restore();if(!date)return;
    const w=Math.round(tw(ctx,date,28,700)+44),h=52,tx=o.flat?150:-26,ty=o.flat?-h/2:84,lt=clamp(o.lit||0,0,1);
    ctx.save();ctx.strokeStyle=rgba([150,128,92],0.9);ctx.lineWidth=3;ctx.beginPath();if(o.flat){ctx.moveTo(-28,4);ctx.quadraticCurveTo(-60,60,60,30);ctx.quadraticCurveTo(110,12,tx+6,0);}
      else{ctx.moveTo(-6,14);ctx.quadraticCurveTo(-30,50,-4,ty+6);}ctx.stroke();ctx.restore();
    if(lt>0.01)gv_halo(ctx,tx-18,ty-18,w+36,h+36,GV.gold,0.85*lt);wc_panel(ctx,tx,ty,w,h,{kind:"tag",seed:85});gv_tint(ctx,tx+6,ty+6,w-12,h-12,GV.gold,0.55*(1-g));gv_tint(ctx,tx+6,ty+6,w-12,h-12,GV.grey,0.5*g);
    wc_T(ctx,date,tx+w/2,ty+h/2+10,{w:700,size:28,align:"center",col:g>0.5?WC_MUTED:WC_DARK});});ctx.restore();}

/* ---------- learners, as plain shapes ---------- */
// a learner, as a plain shape: head and shoulders, in one wash, standing at (x,y); never a face or a name
function gk_figure(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[172,182,198];ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(col,0.92);ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,-168,30,0,TAU);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-50,0);ctx.bezierCurveTo(-54,-72,-42,-126,0,-128);ctx.bezierCurveTo(42,-126,54,-72,50,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
// a bar of credit under a learner, one segment for each of the certificate's four units, n of them earned; centred on x, its top at y
function gk_bar(ctx,x,y,n,a){const sw=32,sh=22,g=6,x0=x-(4*sw+3*g)/2;ctx.save();ctx.globalAlpha*=a==null?1:a;
  for(let k=0;k<4;k++){const sx=x0+k*(sw+g);if(k<n){ctx.fillStyle=rgba([96,150,108],0.92);ctx.fillRect(sx,y,sw,sh);}
    ctx.strokeStyle=rgba(WC_PENCIL,k<n?0.6:0.85);ctx.lineWidth=2;if(k>=n)ctx.setLineDash([5,4]);ctx.strokeRect(sx,y,sw,sh);ctx.setLineDash([]);}ctx.restore();}
// the certificate's learners on a sheet: each with a bar of credit (o.u brings them in); the two a unit from finishing, lit (o.near), and
// the pencil's words for them (o.note)
const GK_LRN=[2,3,1,2,3,1,2],GK_LX=[300,520,740,960,1180,1400,1620];
function gk_learners(ctx,t,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1),nr=clamp(o.near||0,0,1);gv_sheet(ctx,110,110,1700,690);
  wc_T(ctx,"Health informatics · its learners",170,190,{w:800,size:36,col:WC_DARK});
  GK_LRN.forEach((n,i)=>{const v=clamp(u*7-i*0.8,0,1);if(v<=0.01)return;const x=GK_LX[i],near=n===3;gk_rise(ctx,v,()=>{
    if(near&&nr>0.01)gv_halo(ctx,x-110,360,220,330,GV.gold,0.85*nr);gk_figure(ctx,x,600,1.1);gk_bar(ctx,x,628,n);
    if(near&&nr>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*nr);ctx.lineWidth=4;rr(ctx,x-80,618,160,42,10);ctx.stroke();ctx.restore();}},16);});
  const nt=clamp(o.note||0,0,1);if(nt>0.01){wc_hand(ctx,"a unit from finishing",960,752,{size:40,w:700,col:GV.goldInk,align:"center",p:nt});
    gk_arrow(ctx,[780,722],[560,672],-10,clamp(nt*1.6-0.4,0,1),{col:GV.goldInk,lw:3.5});gk_arrow(ctx,[1140,722],[1180,672],-6,clamp(nt*1.6-0.4,0,1),{col:GV.goldInk,lw:3.5});}}

/* ---------- 1 · asking around ---------- */
// the Faculty of Health, close: Anil behind his desk; what o.draw puts on his screen, and on his desk
function gk_anil(x,tt,o){o=o||{};gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.anil||{}));
  x.drawImage(gv_place("facDesk"),0,0,W,H);if(o.draw)o.draw(x);}
// on his screen (GV_FX.screen), the faculty's plan for next semester: the certificate, and how many hospital places, still to work out
// (o.n: the number written in, or a caret)
function gk_placesForm(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;gv_screen(ctx,x,y,w,h,"Places next semester",q=>{
  wc_T(q,"Health informatics",x+32,y+112,{w:800,size:32,col:WC_DARK});wc_T(q,"hospital places:",x+32,y+190,{w:600,size:30,col:WC_INK});
  const bx=x+40+tw(q,"hospital places: ",30,600),by=y+148;q.save();q.strokeStyle=rgba(WC_MUTED,0.6);q.lineWidth=2;q.strokeRect(bx,by,96,58);q.restore();
  if(o.n)wc_T(q,o.n,bx+48,by+44,{w:800,size:36,col:WC_DARK,align:"center"});else gk_caret(q,t,bx+10,by+44,32);
  if(o.lit>0.01)gv_tint(q,bx-6,by-6,108,70,GV.gold,0.7*clamp(o.lit,0,1));},{barH:46,titleSize:28});}
// a small hospital: a block with rows of windows, a door, a cross over it; centred on x, standing on y
function gk_hospital(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);wc_part(ctx,wc_rect(-90,-120,180,120),[236,232,224],1,{seed:841});wc_part(ctx,wc_rect(-30,-160,60,40),[236,232,224],1,{seed:842});
  ctx.fillStyle=rgba([150,176,206],0.9);for(let r=0;r<2;r++)for(let c=0;c<4;c++)if(!(r===1&&(c===1||c===2)))ctx.fillRect(-74+c*40,-104+r*42,24,26);
  ctx.fillStyle=rgba([120,96,80],0.9);ctx.fillRect(-18,-44,36,44);ctx.fillStyle=rgba(GV.red,0.95);ctx.fillRect(-6,-154,12,28);ctx.fillRect(-14,-146,28,12);ctx.restore();}
// a wall calendar, its pages turning forward one after another (cv, 0 to 1), to next semester, written on the last
function gk_calPage(ctx,x,y,w,h,seed){wc_panel(ctx,x,y,w,h,{kind:"card",seed});ctx.save();ctx.fillStyle=rgba(GV.red,0.85);ctx.fillRect(x+12,y+12,w-24,56);
  ctx.strokeStyle=rgba(WC_MUTED,0.45);ctx.lineWidth=1.6;const cw=(w-52)/7;for(let r=0;r<5;r++)for(let c=0;c<7;c++)ctx.strokeRect(x+26+c*cw,y+92+r*46,cw-8,36);ctx.restore();}
function gk_calendar(ctx,x,y,cv){const w=400,h=340,n=4,f=clamp(cv,0,1)*n*1.3,k=Math.floor(f),ph=f-k;gk_calPage(ctx,x,y,w,h,820);
  if(k<n){const s=1-easeCam(clamp(ph*1.4,0,1));ctx.save();ctx.translate(x,y);ctx.scale(1,Math.max(0.02,s));withA(ctx,clamp(s*1.6,0,1),()=>gk_calPage(ctx,0,0,w,h,821+k));ctx.restore();}
  gv_pin(ctx,x+w/2,y+12,GV.red,1.1);const p=clamp((f-n)/(0.3*n),0,1);if(p>0.01)wc_hand(ctx,"next semester",x+w/2,y+h+70,{size:44,w:700,col:GV.redInk,align:"center",p});}
// on the desk: the certificate, its four units on cards, the last a placement in a hospital (o.u, 0 to 1, card by card); the calendar
// beside them (o.cal)
const GK_UNITS=[["unit 1","15 credit points"],["unit 2","15 credit points"],["unit 3","15 credit points"],["unit 4","placement"]];
function gk_cert(ctx,t,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1);
  gk_rise(ctx,clamp(u*3,0,1),()=>{wc_panel(ctx,120,110,1180,110,{kind:"card",seed:801});wc_T(ctx,"Graduate Certificate in Health Informatics",160,180,{w:800,size:38,col:WC_DARK});});
  GK_UNITS.forEach(([a,b],i)=>{const v=clamp(u*5-1-i*0.8,0,1);if(v<=0.01)return;const x=120+i*300,y=270,w=280,h=400,pl=i===3;
    gk_rise(ctx,v,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",wash:pl?GV.red:null,washA:0.1,seed:810+i});wc_T(ctx,a,x+28,y+64,{w:800,size:36,col:WC_DARK});
      wc_T(ctx,b,x+28,y+112,{w:pl?700:600,size:30,col:pl?GV.redInk:WC_MUTED});if(pl)gk_hospital(ctx,x+w/2,y+h-40,1.15);
      else{ctx.save();ctx.fillStyle=rgba([96,150,108],0.85);ctx.fillRect(x+28,y+h-70,w-56,24);ctx.restore();}},18);});
  const cv=clamp(o.cal||0,0,1);if(cv>0.01)gk_rise(ctx,clamp(cv*4,0,1),()=>gk_calendar(ctx,1400,240,cv));}
// the campus: the old building, where the Faculty of Health is, and the newer one; three emails go out across the lawn, one after
// another (o.out, 0 to 1); one comes back with a copy clipped to it (o.back), and its name (o.copy)
const GK_OLD=[330,520],GK_NEW=[[1180,400],[1440,500],[1700,400]];
function gk_mail(ctx,t,o){o=o||{};const out=clamp(o.out||0,0,1),bk=clamp(o.back||0,0,1);
  withA(ctx,clamp(o.fac==null?1:o.fac,0,1),()=>wc_tag(ctx,GK_OLD[0],GK_OLD[1]-110,"Faculty of Health",{align:"center",size:30,seed:851}));
  GK_NEW.forEach((b,k)=>{const v=clamp(out*3-k,0,1);if(v<=0.01||(k===1&&bk>0.01))return;const e=easeCam(v),[x,y]=gk_along(GK_OLD,b,-160,e);gk_env(ctx,x,y,0.9,v<1?1:1-0.4*clamp((out*3-k-1)*2,0,1));});
  if(bk>0.01){const e=easeCam(bk),[x,y]=gk_along(GK_NEW[1],GK_OLD,-180,e);gk_env(ctx,x,y,1,1,{clip:1});
    if(bk>0.9)gk_rise(ctx,clamp((bk-0.9)*10,0,1),()=>wc_tag(ctx,GK_OLD[0]+110,GK_OLD[1]+90,"near award (copy)",{size:30,wash:GV_CLASS.pseudonymous,washA:0.35,seed:852}),10);}}
// the copy and the census report, side by side on the desk: the copy's rows, its codes for learners in pale plum, the one it counts near
// the certificate lit, and its count in pencil (o.one); the census report, the university's official count, its row for the faculty
// (o.two); a pencil question mark between them (o.q). o.agree: today, the product's table in the copy's place, counting two, and a tick
// for the question mark
function gk_code(i,n){let s="";for(let k=0;k<n;k++)s+="0123456789abcdef"[Math.floor(hash(i*7+3,k*13+5)*16)];return s;}
const GK_CROWS=[[0,"GCHI","true"],[1,"GCHI","false"],[2,"GCHI","false"],[3,"GCHI","true"],[4,"GCHI","false"]];
function gk_copy(ctx,t,o){o=o||{};const ag=clamp(o.agree||0,0,1),rows=ag>0.5?GK_CROWS:GK_CROWS.map((r,i)=>i===3?[r[0],r[1],"false"]:r);
  gv_sheet(ctx,90,110,1000,620,{rot:-0.006});wc_T(ctx,ag>0.5?"Learners near an award":"near award (copy)",130,186,{w:800,size:36,col:WC_DARK});
  [["learner_key",130],["award_code",590],["is_near_award",810]].forEach(([s,x])=>wc_T(ctx,s,x,256,{w:500,size:28,f:"mono",col:WC_MUTED}));
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.35);ctx.fillRect(120,276,940,2);ctx.restore();
  const one=clamp(o.one||0,0,1);rows.forEach(([c,a,n],i)=>{const y=330+i*60,on=n==="true",L=on?(ag>0.5?ag:one):0;
    if(L>0.01)gv_tint(ctx,116,y-36,948,52,GV.gold,0.75*L);gv_tint(ctx,124,y-32,gu_mw(ctx,gk_code(c,20)+"…")+12,44,GV_CLASS.pseudonymous,0.8);
    wc_T(ctx,gk_code(c,20)+"…",130,y,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx,a,590,y,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx,n,810,y,{w:500,size:28,f:"mono",col:WC_DARK});});
  const cnt=ag>0.5?"2":"1",cv=ag>0.5?clamp(ag*2-1,0,1):one;if(cv>0.01){wc_ring(ctx,960,680,70,52,clamp(cv*1.4,0,1),{col:WC_PENCIL,lw:4});wc_hand(ctx,cnt,960,702,{size:64,w:700,col:WC_PENCIL,align:"center",p:clamp(cv*2-0.8,0,1)});}
  const two=clamp(o.two==null?1:o.two,0,1);gk_rise(ctx,two,()=>{gv_sheet(ctx,1180,170,660,420,{rot:0.01});wc_T(ctx,"Census report",1222,250,{w:800,size:36,col:WC_DARK});
    wc_T(ctx,"learners near a graduate certificate",1222,302,{w:600,size:28,col:WC_MUTED});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.35);ctx.fillRect(1212,330,596,2);ctx.restore();
    wc_T(ctx,"Faculty of Health",1222,420,{w:600,size:32,col:WC_INK});wc_T(ctx,"2",1790,424,{w:800,size:52,col:WC_DARK,align:"right"});
    ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.2);ctx.fillRect(1212,450,596,2);ctx.restore();wc_T(ctx,"…",1222,500,{w:600,size:30,col:WC_PENCIL});},16);
  const q=clamp(o.q||0,0,1);if(q>0.01&&ag<0.5)wc_hand(ctx,"?",1130,720,{size:110,w:700,col:WC_PENCIL,align:"center",p:q});
  if(ag>0.6)wc_tick(ctx,1130,690,90,GV.greenInk,clamp((ag*2-1.2)/0.8,0,1),8);}
// the placement, on the desk: the hospital card, and a card for each place offered under it (o.n, 0 to 2); the two learners a unit
// from finishing, each beside a place; the second steps back, a semester later (o.back, 0 to 1), and forward again as it goes back to 0
function gk_placeCard(ctx,x,y,a,seed){if(a<=0.01)return;gk_rise(ctx,a,()=>{wc_panel(ctx,x,y,240,140,{kind:"card",wash:GV.green,washA:0.18,seed});gv_pin(ctx,x+120,y+16,GV.red,1.1);
  wc_hand(ctx,"a place",x+120,y+96,{size:40,w:700,col:GV.greenInk,align:"center"});},20);}
function gk_placement(ctx,t,o){o=o||{};const n=clamp(o.n||0,0,2),bk=clamp(o.back||0,0,1),e=easeCam(bk);
  wc_panel(ctx,600,70,720,250,{kind:"card",wash:GV.red,washA:0.1,seed:861});gv_pin(ctx,960,86,GV.red,1.2);wc_T(ctx,"unit 4",640,150,{w:800,size:38,col:WC_DARK});
  wc_T(ctx,"hospital placement",640,204,{w:700,size:32,col:GV.redInk});wc_T(ctx,"next semester",640,268,{w:600,size:30,col:WC_MUTED});gk_hospital(ctx,1180,290,1.05);
  gk_placeCard(ctx,690,370,clamp(n,0,1),871);gk_placeCard(ctx,990,370,clamp(n-1,0,1),872);
  gk_figure(ctx,810,800,1.05);gk_bar(ctx,810,818,3);
  const bx=lerp(1110,1520,e),by=lerp(800,770,e),bs=lerp(1.05,0.9,e),ba=1-0.45*e;gk_figure(ctx,bx,by,bs,{a:ba});gk_bar(ctx,bx,by+18,3,ba);
  if(e>0.01)wc_hand(ctx,"a semester later",1520,560,{size:40,w:700,col:GV.redInk,align:"center",p:clamp(bk*1.6-0.4,0,1)*(o.fwd?0:1)});}
// the mail on a big screen: the copy that came back, its attachment open, a code for every learner, 64 characters each, cut short with
// "…", in pale plum (as Governed in Unity Catalog draws them); a pencil line from them down to a name, blank (o.lead); the yes it never had, and
// the end date (o.yes, o.end); the attachment deleted (o.del, 0 to 1)
function gk_inbox(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,dl=clamp(o.del||0,0,1);
  gu_page(ctx,x,y,w,h,{bar:"Mail",title:"near award (copy)",titleSize:40,sub:"from a colleague, with an attachment"});
  if(dl>0.01)withA(ctx,clamp(dl*2-0.6,0,1),()=>gk_pill(ctx,700,180,"deleted",{size:30,wash:GV.grey,washA:0.35,seed:881}));
  const s=1-easeCam(dl);if(s<=0.01)return;ctx.save();ctx.translate(0,-40*(1-s));withA(ctx,s,()=>{
    gu_box(ctx,150,290,1620,430,"attachment · near award (copy)",{seed:882});
    [["learner_key",190],["award_code",1010],["is_near_award",1230]].forEach(([c,cx])=>wc_T(ctx,c,cx,400,{w:500,size:28,f:"mono",col:WC_MUTED}));
    ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(170,418,1580,2);ctx.restore();
    for(let i=0;i<5;i++){const ry=470+i*52,cd=gk_code(i,44)+"…";gv_tint(ctx,182,ry-32,gu_mw(ctx,cd)+16,44,GV_CLASS.pseudonymous,0.85);
      wc_T(ctx,cd,190,ry,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx,"GCHI",1010,ry,{w:500,size:28,f:"mono",col:WC_INK});wc_T(ctx,i===0?"true":"false",1230,ry,{w:500,size:28,f:"mono",col:WC_INK});}
    const ld=clamp(o.lead||0,0,1);if(ld>0.01){gk_arrow(ctx,[330,690],[300,744],-8,clamp(ld*1.6,0,1),{col:WC_PENCIL,lw:3.5});
      gk_rise(ctx,clamp(ld*1.6-0.5,0,1),()=>{wc_panel(ctx,160,748,290,100,{kind:"card",seed:883});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.45);ctx.fillRect(190,784,190,4);ctx.fillRect(190,820,130,4);ctx.restore();
        wc_hand(ctx,"?",412,814,{size:48,w:700,col:WC_PENCIL,align:"center"});},10);}
    [["yes from:","nobody's yes",530,o.yes],["until:","no end date",1150,o.end]].forEach(([l,s_,lx,v])=>{v=clamp(v||0,0,1);if(v<=0.01)return;gk_rise(ctx,clamp(v*2,0,1),()=>{
      wc_panel(ctx,lx-30,748,590,100,{kind:"card",seed:884+lx});wc_T(ctx,l,lx,808,{w:600,size:30,col:WC_MUTED});const bx=lx+tw(ctx,l+" ",30,600);
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(bx,816);ctx.lineTo(lx+530,816);ctx.stroke();ctx.restore();
      wc_hand(ctx,s_,bx+10,806,{size:38,w:700,col:GV.redInk,p:clamp(v*2-0.6,0,1)});},10);});});ctx.restore();}
// the shop window: the six products as tiles behind the glass, each with its owner (o.u[i] brings tile i in; o.own washes the owners gold);
// one lifts (o.lift); the request that goes with it, a card with "why" and "until" (o.req); the glass's light over them
const GK_SHOP={glass:[250,250,1420,560]},GK_SX=[290,750,1210],GK_SY=[290,550];
function gk_glass(ctx,x,y,w,h,a){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.globalCompositeOperation="screen";ctx.globalAlpha=0.32*(a==null?1:a);
  const g=ctx.createLinearGradient(x,y,x+w*0.5,y+h);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.42,"rgba(255,255,255,0)");g.addColorStop(0.46,"rgba(255,255,255,0.9)");
  g.addColorStop(0.53,"rgba(255,255,255,0.15)");g.addColorStop(0.58,"rgba(255,255,255,0.7)");g.addColorStop(0.62,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();}
function gk_reqCard(ctx,t,x,y,o){o=o||{};const w=420;wc_panel(ctx,x,y,w,196,{kind:"card",seed:891});gv_pin(ctx,x+w/2,y+16,GV.red,1.1);wc_T(ctx,"a request",x+32,y+62,{w:800,size:34,col:WC_DARK});
  [["why:",o.why,o.pw],["until:",o.until,o.pu]].forEach(([l,v,p],i)=>{const yy=y+118+i*54;wc_T(ctx,l,x+32,yy,{w:700,size:32,col:GV.goldInk});const bx=x+36+tw(ctx,l+" ",32,700);
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(bx,yy+8);ctx.lineTo(x+w-34,yy+8);ctx.stroke();ctx.restore();
    if(v)gk_typed(ctx,t,v,bx+6,yy,p==null?1:p,{size:30});});}
function gk_shop(ctx,t,o){o=o||{};const [gx,gy,gw,gh]=GK_SHOP.glass,lf=clamp(o.lift||0,0,1);
  GK_SIX.forEach((_,i)=>{const v=clamp((o.u||[])[i]==null?1:o.u[i],0,1);if(v<=0.01)return;const x=GK_SX[i%3],y=GK_SY[Math.floor(i/3)];
    gk_rise(ctx,v,()=>gk_tile(ctx,i,x,y,420,220,{short:1,size:34,own:o.own||0,lift:i===2?lf:0,lit:i===2?lf:0,a:i===2?1:1-0.45*lf}),18);});
  gk_glass(ctx,gx,gy,gw,gh);const rq=clamp(o.req||0,0,1);if(rq>0.01)gk_rise(ctx,rq,()=>gk_reqCard(ctx,t,1440,680),30);}
// on Anil's screen, the catalogue: he types near award in its search (o.q, 0 to 1), the product comes up (o.res) and lifts (o.lift), and
// he presses Request access (o.ask)
function gk_search(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;gv_screen(ctx,x,y,w,h,GK_ONTOS,q=>{
  wc_panel(q,x+24,y+64,w-48,58,{kind:"pill",seed:901});q.save();q.strokeStyle=rgba(WC_MUTED,0.8);q.lineWidth=3;q.beginPath();q.arc(x+56,y+92,11,0,TAU);q.moveTo(x+64,y+100);q.lineTo(x+74,y+110);q.stroke();q.restore();
  gk_typed(q,t,"near award",x+88,y+103,clamp(o.q||0,0,1),{size:30,w:600});
  const r=clamp(o.res||0,0,1);if(r>0.01)gk_rise(q,r,()=>{const lf=easeCam(clamp(o.lift||0,0,1)),ty=y+140-6*lf;if(lf>0.01)gv_halo(q,x+10,ty-14,w-20,206,GV.gold,0.8*lf);
    wc_panel(q,x+24,ty,w-48,178,{kind:"card",seed:902});q.save();q.fillStyle=rgba(GK_SIX[2][3],0.9);q.fillRect(x+32,ty+8,w-64,12);q.restore();
    wc_T(q,"Learners near an award",x+46,ty+64,{w:800,size:30,col:WC_DARK});const ow="Clara Jensen, Planning";
    wc_panel(q,x+38,ty+82,Math.round(tw(q,ow,28,600)+16),40,{kind:"tag",wash:GV.gold,washA:0.42,seed:903});wc_T(q,ow,x+46,ty+111,{w:600,size:28,col:WC_INK});
    gk_button(q,x+46,ty+150,"Request access",{press:clamp(o.ask||0,0,1)});},10);},{barH:46,titleSize:28,bar:GK_CAT});}
// Planning's office, close, the camera at the height of someone sitting (as Products in open formats drew it): a pale green wall, a
// window, a chart pinned up; the desk (its front layer) with a screen, a keyboard and a mug
const GK_PX={top:800,seat:[1480,1.7],screen:[380,236,800,450],win:[60,56,250,420],chart:[1250,60,440,286]};
function gk_paintPlan(ctx){const X=GK_PX,wall=GV_ROOM.plan;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:131});
  gv_lightGlow(ctx,880,-60,760);const [wx,wy,ww,wh]=X.win;gv_window(ctx,wx,wy,ww,wh,{wall,seed:33,tx:0.35});
  const [cx,cy,cw,ch]=X.chart;wc_wash(ctx,wc_rect(cx,cy,cw,ch),[251,250,245],{kind:"paper",lw:1.4,seed:132});for(const gx of [cx+24,cx+cw-24])gv_pin(ctx,gx,cy+20,GV.red,1);
  gv_lines(ctx,cx+34,cy+58,cw*0.42,1,0,1);for(let i=0;i<7;i++){const bh=50+120*hash(i,17);wc_flat(ctx,wc_rect(cx+40+i*56,cy+ch-28-bh,38,bh),[104,150,112],0.75,"bar");}
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+30,cy+ch-26);ctx.lineTo(cx+cw-30,cy+ch-26);ctx.stroke();ctx.restore();}
function gk_paintPlanDesk(ctx){const X=GK_PX,top=X.top;gv_deskFront(ctx,top,[200,184,156],[[60,330],[1560,330]]);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+90,top,sw-180,sx+sw+40);gv_mug(ctx,1780,top+10,[226,160,70]);}
// Clara behind her desk, close; what o.draw puts on her screen
function gk_planDesk(x,tt,o){o=o||{};gv_behind(x,"clara",GK_PX.seat[0],GK_PX.top,GK_PX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.clara||{}));
  x.drawImage(gv_place("planDesk"),0,0,W,H);if(o.draw)o.draw(x);}
// on her screen, the catalogue: Anil's request (o.u), his reason (o.why), the days he asks for; her yes (o.yes, 0 to 1), the state turning
// from pending to approved
const GK_WHY="To plan next semester's places in the certificate's last unit.";
function gk_reqScreen(ctx,t,o){o=o||{};const [x,y,w,h]=GK_PX.screen,ys=clamp(o.yes||0,0,1);gv_screen(ctx,x,y,w,h,GK_ONTOS,q=>{
  wc_T(q,"Access request",x+40,y+108,{w:800,size:38,col:WC_DARK});const st=ys>0.5?["Approved",GV.green]:["Pending",GV.amber],sx=x+70+tw(q,"Access request",38,800),sw=Math.round(tw(q,st[0],28,700)+44);
  wc_panel(q,sx,y+72,sw,48,{kind:"pill",wash:st[1],washA:0.45,seed:911+(ys>0.5?1:0)});wc_T(q,st[0],sx+22,y+106,{w:700,size:28,col:WC_DARK});
  wc_T(q,"Learners near an award",x+40,y+168,{w:700,size:32,col:WC_DARK});wc_T(q,"Anil Kurian, Faculty of Health",x+40,y+218,{w:600,size:30,col:WC_INK});
  if(o.why>0.01){const r=clamp(o.why,0,1);gv_tint(q,x+30,y+240,w-60,96,GV.gold,0.6*r);}
  wc_T(q,"To plan next semester's places in the",x+40,y+272,{w:600,size:28,col:WC_INK});wc_T(q,"certificate's last unit.",x+40,y+312,{w:600,size:28,col:WC_INK});
  wc_T(q,"Requested: 90 days",x+40,y+372,{w:700,size:30,col:WC_DARK});
  const bw=gk_button(q,x+w-300,y+372,"Approve",{col:GV.green,washA:0.35+0.3*ys,press:ys});if(ys>0.01)wc_tick(q,x+w-300+bw+40,y+366,40,GV.greenInk,clamp(ys*1.6,0,1),6);},{barH:46,titleSize:28,bar:GK_CAT});}
// the product's table and the census report agree, today
function gk_agree(ctx,t,o){gk_copy(ctx,t,Object.assign({two:1},o));}

/* ---------- 2 · a shop window ---------- */
// the platform team's room, close: Sam behind his desk; on his screens Ontos's marketplace, its six products as tiles in their colours
// (o.u, tile by tile), beside Unity Catalog's tables
function gk_samDesk(x,tt,o){o=o||{};gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.sam||{}));
  x.drawImage(gv_place("platformDesk"),0,0,W,H);gk_samScreens(x,tt,o);}
function gk_samScreens(ctx,t,o){o=o||{};const [[lx,ly,lw,lh],[rx,ry,rw,rh]]=GV_PX.screens,u=clamp(o.u==null?1:o.u,0,1);
  gv_screen(ctx,lx,ly,lw,lh,GK_ONTOS,q=>{wc_T(q,"Marketplace",lx+30,ly+96,{w:800,size:32,col:WC_DARK});
    GK_SIX.forEach((p,i)=>{const a=clamp(u*6-i,0,1);if(a<=0.01)return;const tx=lx+30+(i%3)*150,ty=ly+124+Math.floor(i/3)*92;withA(q,a,()=>{
      wc_panel(q,tx,ty,136,80,{kind:"card",seed:1080+i});q.fillStyle=rgba(p[3],0.9);q.fillRect(tx+6,ty+6,124,10);gv_lines(q,tx+16,ty+38,96,2,18,0.8);});});},
    {barH:46,titleSize:28,bar:GK_CAT});
  gv_screen(ctx,rx,ry,rw,rh,"Unity Catalog",q=>{["core_learner_v1","core_award_v1","mart_planning__near_award"].forEach((s,i)=>wc_T(q,s,rx+36,ry+116+i*58,{w:500,size:28,f:"mono",col:WC_DARK}));},
    {barH:46,titleSize:28});}
// the catalogue's marketplace on a big screen, drawn as a form: its search, and the six products as tiles by domain, each with its owner
// (o.u, tile by tile; o.dom, o.own). A price tag hangs from one, blank (o.price), and is crossed out (o.cross); near award typed in the
// search (o.q); the idea it names, from Noor's map, on a violet chip (o.idea); its semantic link to the product (o.thr), which lifts while
// the others step back (o.find)
const GK_MX=[160,710,1260],GK_MY=[300,580];
function gk_market(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,fd=clamp(o.find||0,0,1),V=GV_MEAN.violet,VI=GV_MEANINK.violet;
  gu_page(ctx,x,y,w,h,{bar:GK_ONTOS,title:"Marketplace",titleSize:44});
  wc_panel(ctx,1040,128,700,64,{kind:"pill",seed:921});ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.arc(1080,160,12,0,TAU);ctx.moveTo(1089,169);ctx.lineTo(1100,180);ctx.stroke();ctx.restore();
  const qp=clamp(o.q||0,0,1);if(qp>0.01)gk_typed(ctx,t,"near award",1116,171,qp,{size:30,w:600});
  GK_SIX.forEach((_,i)=>{const v=clamp((o.u||[])[i]==null?1:o.u[i],0,1);if(v<=0.01)return;const tx=GK_MX[i%3],ty=GK_MY[Math.floor(i/3)];
    gk_rise(ctx,v,()=>gk_tile(ctx,i,tx,ty,500,240,{dom:o.dom||0,own:o.own||0,lift:i===2?fd:0,lit:i===2?fd:0,a:i===2?1:1-0.5*fd}),16);});
  const pr=clamp(o.price||0,0,1);if(pr>0.01){const px=GK_MX[1]+470,py=GK_MY[0]+10,sw=Math.sin(t*1.6)*0.06;ctx.save();ctx.translate(px,py);ctx.rotate(0.35+sw);withA(ctx,clamp(pr*1.6,0,1),()=>{
      ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,40);ctx.stroke();wc_panel(ctx,-46,40,92,120,{kind:"tag",seed:922});
      ctx.fillStyle=rgba(WC_PENCIL,0.6);ctx.beginPath();ctx.arc(0,58,7,0,TAU);ctx.fill();});
    if(o.cross>0.01)wc_cross(ctx,0,100,90,GV.redInk,clamp(o.cross,0,1));ctx.restore();}
  const id=clamp(o.idea||0,0,1);if(id>0.01){const s="learner near an award",cw=Math.round(tw(ctx,s,30,700)+44);
    gk_rise(ctx,id,()=>{wc_panel(ctx,1040,214,cw,52,{kind:"pill",wash:V,washA:0.42,seed:923});wc_T(ctx,s,1062,251,{w:700,size:30,col:VI});},8);
    const th=clamp(o.thr||0,0,1);if(th>0.01){gk_thread(ctx,[1040+cw-20,262],[GK_MX[2]+250,GK_MY[0]+6],th,{col:VI,bend:-10,lw:4});
      wc_hand(ctx,"semantic link",GK_MX[2]+260,GK_MY[0]-14,{size:32,w:700,col:VI,align:"left",p:clamp(th*1.6-0.6,0,1)});}}}
// on Noor's map, close: the idea, a card in the information layer's free part, violet, as the series draws meaning (o.a, o.lit)
function gk_mapIdea(ctx,t,o){o=o||{};const [bx,by,bw,bh]=gv_mapFree(GV_MC[0],GV_MC[1],GV_MC[2],GV_MC[3],3),a=clamp(o.a==null?1:o.a,0,1),V=GV_MEAN.violet,VI=GV_MEANINK.violet;
  const x=bx+16,y=by+10,w=bw-40,h=bh-20;gk_rise(ctx,a,()=>{const l=clamp(o.lit||0,0,1);if(l>0.01)gv_halo(ctx,x-30,y-30,w+60,h+60,V,0.9*l);
    wc_panel(ctx,x,y,w,h,{kind:"card",wash:V,washA:0.3,seed:931});gv_pin(ctx,x+w/2,y+12,wc_dim(V,0.3),1);wc_T(ctx,"learner near an award",x+28,y+50,{w:800,size:34,col:VI});
    wc_T(ctx,"owner: Planning",x+28,y+88,{w:600,size:28,col:WC_MUTED});},12);}

/* ---------- 3 · read before you ask ---------- */
// the product's page in the catalogue, on a big screen: what it promises, each part copied from its file in the project (o.lit[k], 0 to 1,
// lights part k as it's named: 0 what it's for, 1 how it counts, 2 when it's ready, 3 where to ask); "from the project" on each (o.from)
const GK_PP=[["Purpose",["How many learners are near a graduate certificate","… by faculty, as at census date. … for anyone who","plans support for those learners."],[2,"plans support for those learners."]],
  ["Usage",["Count learners with is_near_award. The numbers","are as at census date, and reconcile with the","census report."],[1,"are as at census date, and reconcile with the"]],
  ["Service levels",["Built every night.","Ready by 7 a.m. on census day."],[1,"Ready by 7 a.m. on census day."]],["Support",["planning@uni.example"],[0,"planning@uni.example"]]];
const GK_PB=[[150,300,800,270],[970,300,800,270],[150,592,800,250],[970,592,800,250]];
function gk_prodHead(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;const top=gu_page(ctx,x,y,w,h,{bar:GK_ONTOS,title:"Learners near an award",titleSize:40,state:["Active",GV.green],
    sub:"planning · owner: Clara Jensen, Planning",tabs:["Overview","Contract"],tab:o.tab||0});
  gk_button(ctx,1500,152,"Request access",{press:clamp(o.press||0,0,1),washA:0.3+0.3*clamp(o.press||0,0,1)});return top;}
function gk_prodPage(ctx,t,o){o=o||{};gk_prodHead(ctx,{press:o.press});const L=o.lit||[],fr=clamp(o.from==null?1:o.from,0,1);
  GK_PP.forEach(([hd,lines,[li,sub]],k)=>{const [bx,by,bw,bh]=GK_PB[k],l=clamp(L[k]||0,0,1);gu_box(ctx,bx,by,bw,bh,hd,{seed:941+k});
    if(fr>0.01)withA(ctx,fr,()=>wc_tag(ctx,bx+bw-24,by+40,"from the project",{align:"right",size:28,wash:GU_CYAN,washA:0.22,seed:945+k}));
    lines.forEach((s,i)=>{const yy=by+104+i*44;if(i===li)gk_mark(ctx,bx+30,yy-10,s,sub,l,GV.gold,28,600);wc_T(ctx,s,bx+30,yy,{w:600,size:28,col:WC_INK});});});
  if(o.tag>0.01)gu_filmTag(ctx,1760,872-20,"Products in open formats",clamp(o.tag,0,1),{align:"right"});}
// its Contract tab: the table's columns, each with its class (Who may see it's words); the two that hold codes that can lead back to a
// learner lit pale plum (o.two); then a card pinned over it: a purpose and an end date (o.card), and the film it comes from
const GK_CC=[["learner_award_key","pseudonymous"],["census_date","none"],["learner_key","pseudonymous"],["award_code","none"],["faculty_code","none"],["…",""],["credit_points_remaining","none"],["is_near_award","none"]];
function gk_contractTab(ctx,t,o){o=o||{};gk_prodHead(ctx,{tab:1,press:o.press});const tw_=clamp(o.two||0,0,1);
  wc_T(ctx,"mart_planning__near_award",170,368,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"17 columns",1750,368,{w:700,size:28,col:WC_MUTED,align:"right"});
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,390,1620,2);ctx.restore();
  GK_CC.forEach(([c,cls],i)=>{const y=442+i*56,pz=cls==="pseudonymous";if(pz&&tw_>0.01)gv_tint(ctx,156,y-34,1608,50,GV_CLASS.pseudonymous,0.85*tw_);
    wc_T(ctx,c,190,y,{w:500,size:28,f:"mono",col:c==="…"?WC_PENCIL:WC_DARK});if(cls)gv_classChip(ctx,900,y-10,cls,{});});
  const cd=clamp(o.card||0,0,1);if(cd>0.01){const k=0.9+0.1*spring(cd);ctx.save();ctx.translate(1430,650);ctx.scale(k,k);ctx.rotate(-0.02);withA(ctx,clamp(cd*1.6,0,1),()=>{
      wc_panel(ctx,-280,-110,560,200,{kind:"card",wash:GV.gold,washA:0.2,seed:951});gv_pin(ctx,0,-94,GV.red,1.2);wc_T(ctx,"for a purpose",0,-14,{w:800,size:38,col:WC_DARK,align:"center"});
      wc_T(ctx,"until a date",0,44,{w:800,size:38,col:WC_DARK,align:"center"});});ctx.restore();
    gu_filmTag(ctx,1430,800,"Who may see it",clamp(cd*1.6-0.6,0,1),{align:"center"});}}

/* ---------- 4 · ask, with a purpose ---------- */
// the request form, over the product's contract once Request access is pressed (o.press, o.open): why, and for how long (o.lit[0], o.lit[1]); his reason typed in (o.why, 0 to 1); ninety days
// chosen (o.days); Submit pressed (o.sub)
const GK_FM=[360,230,1200,600];
function gk_form(ctx,t,o){o=o||{};const op=clamp(o.open==null?1:o.open,0,1);gk_deco(op>0.01,()=>gk_contractTab(ctx,t,{two:1,press:o.press}));if(op<=0.01)return;
  ctx.save();ctx.fillStyle=rgba([40,44,56],0.32*op);ctx.fillRect(110,108,1700,760);ctx.restore();const [x,y,w,h]=GK_FM,L=o.lit||[];
  gk_rise(ctx,op,()=>{ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,40,50,0.25)";ctx.fillRect(x+10,y+18,w,h);ctx.restore();wc_panel(ctx,x,y,w,h,{kind:"card",seed:961});
    wc_T(ctx,"Request access",x+48,y+80,{w:800,size:40,col:WC_DARK});wc_T(ctx,"Learners near an award",x+48,y+128,{w:600,size:28,col:WC_MUTED});
    const l0=clamp(L[0]||0,0,1),l1=clamp(L[1]||0,0,1);
    wc_T(ctx,"Why do you need access?",x+48,y+204,{w:700,size:30,col:WC_DARK});if(l0>0.01)gv_tint(ctx,x+40,y+222,w-80,92,GV.gold,0.6*l0);
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=2;ctx.strokeRect(x+48,y+230,w-96,76);ctx.restore();
    const wp=clamp(o.why||0,0,1);if(wp>0.01)gk_typed(ctx,t,GK_WHY,x+68,y+280,wp,{size:30});
    wc_T(ctx,"Requested duration (days, …)",x+48,y+382,{w:700,size:30,col:WC_DARK});if(l1>0.01)gv_tint(ctx,x+40,y+400,560,84,GV.gold,0.6*l1);
    const dy=clamp(o.days||0,0,1);["30","60","90"].forEach((s,i)=>{const bx=x+48+i*180,on=i===2?dy:0;if(on>0.01)gv_halo(ctx,bx-10,y+404,170,76,GU_CYAN,0.8*on);
      wc_panel(ctx,bx,y+412,150,60,{kind:"pill",wash:on>0.5?GU_CYAN:null,washA:0.4,seed:965+i});wc_T(ctx,s,bx+75,y+454,{w:800,size:32,col:WC_DARK,align:"center"});});
    gk_button(ctx,x+w-260,y+h-70,"Submit",{press:clamp(o.sub||0,0,1),size:30});},24);}
// every request comes to one place: the platform's page for the table, small, its own Request access button, in preview, sending its
// people to the catalogue's form (o.plat; o.press, o.pv: in preview; o.redir); the catalogue's form; both arrive in one tray, and Anil's request drops in (o.tray)
function gk_onePlace(ctx,t,o){o=o||{};const pl=clamp(o.plat||0,0,1),rd=clamp(o.redir||0,0,1),tr=clamp(o.tray||0,0,1);
  gk_rise(ctx,clamp(o.cat==null?1:o.cat,0,1),()=>gk_win(ctx,1060,90,780,380,GK_ONTOS,q=>{wc_T(q,"Request access",1100,196,{w:800,size:34,col:WC_DARK});
    wc_T(q,"Learners near an award",1100,246,{w:600,size:28,col:WC_MUTED});wc_T(q,"Why do you need access?",1100,314,{w:700,size:28,col:WC_INK});
    wc_T(q,"Requested duration (days, …)",1100,368,{w:700,size:28,col:WC_INK});},GK_CAT),14);
  if(pl>0.01)gk_rise(ctx,pl,()=>gk_win(ctx,80,150,780,320,"Databricks · Unity Catalog",q=>{wc_T(q,"mart_planning__near_award",120,256,{w:500,size:28,f:"mono",col:WC_DARK});
    wc_T(q,"university · prod_marts · table",120,302,{w:600,size:28,col:WC_MUTED});const bw=gk_button(q,120,396,"Request access",{press:clamp(o.press||0,0,1)});
    wc_tag(q,120+bw+20,396,"preview",{size:28,wash:o.pv>0.5?GV.gold:GV.grey,washA:0.3+0.2*clamp(o.pv||0,0,1),seed:971});}),14);
  if(rd>0.01){gk_arrow(ctx,[560,396],[1050,286],-70,clamp(rd*1.4,0,1),{col:GU_CYAN,lw:5});wc_hand(ctx,"redirect",958,226,{size:38,w:700,col:GU_CYAN,align:"center",p:clamp(rd*1.6-0.6,0,1)});}
  if(tr<=0.01)return;const tx=1210,ty=640,tw2=480;gk_rise(ctx,clamp(tr*2,0,1),()=>{wc_part(ctx,[[tx,ty],[tx+tw2,ty],[tx+tw2-26,ty+120],[tx+26,ty+120]],[176,150,120],1,{seed:972});
    wc_flat(ctx,wc_rect(tx+40,ty+10,tw2-80,14),[236,226,206],1,"tray");wc_T(ctx,"Requests",tx+tw2/2,ty+84,{w:800,size:34,col:[255,255,255],align:"center"});},14);
  gk_arrow(ctx,[1450,478],[1450,ty-8],0,clamp(tr*2-0.3,0,1),{col:GU_CYAN,lw:4});
  const dp=clamp(tr*2-1,0,1);if(dp>0.01){const e=easeCam(dp);ctx.save();ctx.translate(tx+tw2/2,lerp(ty-200,ty-34,e));ctx.rotate(0.04);withA(ctx,clamp(dp*3,0,1),()=>{
    wc_panel(ctx,-170,-46,340,92,{kind:"card",seed:973});wc_T(ctx,"Anil Kurian",0,12,{w:800,size:30,col:WC_DARK,align:"center"});});ctx.restore();}}

/* ---------- 5 · the owner decides ---------- */
// over Planning's office: who builds the table and who owns it, each on a tag; the request passes the first and comes to the second
// (o.who, o.go, 0 to 1); the film that drew who does what (o.tag)
function gk_route(ctx,t,o){o=o||{};const wh=clamp(o.who||0,0,1),go=clamp(o.go||0,0,1),cx=GK_PX.seat[0],cw=tw(ctx,"Clara · the product's owner",30,700)+44;
  [["the data team · builds the table",360,150,GU_CYAN,"left"],["Clara · the product's owner",cx,396,GV.gold,"center"]].forEach(([s,x,y,col,al],i)=>{const v=clamp(wh*2-i*0.6,0,1);
    if(v<=0.01)return;gk_rise(ctx,v,()=>wc_tag(ctx,x,y,s,{align:al,size:30,wash:col,washA:i?0.45*(0.6+0.4*go):0.35*(1-0.5*go),seed:981+i}),10);});
  if(go>0.01){const a=[-60,100],m=[880,140],b=[cx-cw/2-24,396],u=easeCam(go),
      [x,y]=u<0.5?gk_along(a,m,-60,u*2):gk_along(m,b,-60,(u-0.5)*2);gk_env(ctx,x,y,0.8,clamp(go*4,0,1)*(1-clamp((go-0.92)*12,0,1)));
    if(go>0.92)gv_halo(ctx,cx-cw/2-20,360,cw+40,72,GV.gold,0.7*clamp((go-0.92)*12,0,1));}
  if(o.tag>0.01)gu_filmTag(ctx,80,744,"Who does what, end to end",clamp(o.tag,0,1));}
// a clock on Planning's wall at ten past three (o.a)
function gk_clock(ctx,x,y,r,a){if(a<=0.01)return;withA(ctx,a,()=>{wc_panel(ctx,x-r,y-r,2*r,2*r,{kind:"pill",seed:991});ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineCap="round";
  for(let i=0;i<12;i++){const an=i/12*TAU;ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(x+Math.sin(an)*r*0.78,y-Math.cos(an)*r*0.78);ctx.lineTo(x+Math.sin(an)*r*0.88,y-Math.cos(an)*r*0.88);ctx.stroke();}
  const hA=(3+10/60)/12*TAU,mA=10/60*TAU;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(hA)*r*0.48,y-Math.cos(hA)*r*0.48);ctx.stroke();
  ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(mA)*r*0.72,y-Math.cos(mA)*r*0.72);ctx.stroke();ctx.fillStyle=rgba(GV.red,1);ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();ctx.restore();});}
// what people can ask data governance for, each with its promise, as A capability, not a project laid it out; Let me see this data lit
// (o.lit); the film it comes from (o.tag)
const GK_ASK=[["What does this number mean?","an answer in 2 working days"],["Define or change a term","decided in 10 working days"],["Let me see this data","in 5 working days, until a date"],
  ["Can I trust this product?","on its page by 7 a.m."],["Fix it where it starts","to the source's owner by Monday"],["What will this change touch?","answered before it goes in"],["Help me do it right","office hours every Thursday"]];
function gk_service(ctx,t,o){o=o||{};const l=clamp(o.lit||0,0,1);gv_sheet(ctx,330,60,1260,640,{rot:-0.006});wc_T(ctx,"What you can ask data governance for",390,150,{w:800,size:40,col:WC_DARK});
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.5);ctx.fillRect(390,172,1140,3);ctx.restore();
  GK_ASK.forEach(([s,p],j)=>{const yy=240+j*62;if(j===2&&l>0.01)gv_tint(ctx,376,yy-40,1170,58,GV.gold,0.75*l);wc_T(ctx,s,390,yy,{w:700,size:30,col:WC_DARK,a:j===2?1:1-0.4*l});
    wc_T(ctx,p,1010,yy,{w:600,size:30,col:WC_INK,a:j===2?1:1-0.4*l});});
  if(o.tag>0.01)gu_filmTag(ctx,960,780,"A capability, not a project",clamp(o.tag,0,1),{align:"center"});}
// the owner's page on a big screen: his request (left) and the product's purpose (right), lit together (o.match); the days granted (o.grant);
// Approve, ticked (o.yes); Reject, with its reason, lit faintly and gone (o.alt); the message that reaches him (o.msg), and the date
const GK_RQ=[["Requester","Anil Kurian, Faculty of Health"],["Reason","To plan next semester's places in the","certificate's last unit."],["Requested","90 days"]];
function gk_approval(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,m=clamp(o.match||0,0,1),ys=clamp(o.yes||0,0,1),al=clamp(o.alt||0,0,1);
  gu_page(ctx,x,y,w,h,{bar:GK_ONTOS,title:"Access request",titleSize:40,state:ys>0.5?["Approved",GV.green]:["Pending",GV.amber],sub:"Learners near an award · to its owner, Clara Jensen"});
  gu_box(ctx,150,286,820,350,"Request",{seed:1001});
  let yy=376;GK_RQ.forEach(([l,...v],i)=>{wc_T(ctx,l,180,yy,{w:600,size:28,col:WC_MUTED});v.forEach((s,k)=>{if(i===1&&m>0.01)gv_tint(ctx,374,yy-32,580,44,GV.gold,0.7*m);
    wc_T(ctx,s,380,yy,{w:i===1?600:700,size:i===1?28:30,col:WC_DARK});yy+=44;});yy+=16;});
  gu_box(ctx,1000,286,770,350,"The product",{seed:1002});wc_T(ctx,"Learners near an award",1030,376,{w:700,size:30,col:WC_DARK});
  wc_T(ctx,"Purpose",1030,436,{w:600,size:28,col:WC_MUTED});["… Planning's answer for the census,","and for anyone who plans support","for those learners."].forEach((s,i)=>{const ly=486+i*44;
    if(i>0&&m>0.01)gk_mark(ctx,1030,ly-10,s,i===1?"and for anyone who plans support":"for those learners.",m,GV.gold,28,600);wc_T(ctx,s,1030,ly,{w:600,size:28,col:WC_INK});});
  const gr=clamp(o.grant||0,0,1),by=716;wc_T(ctx,"Granted:",180,by+10,{w:700,size:30,col:WC_DARK});const gx=180+tw(ctx,"Granted: ",30,700);
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=2;ctx.strokeRect(gx,by-30,170,56);ctx.restore();if(al>0.01)gv_tint(ctx,gx-6,by-36,182,68,GV.amber,0.45*al);
  if(gr>0.01)gk_typed(ctx,t,"90 days",gx+18,by+10,gr,{size:30,w:700});
  const aw=gk_button(ctx,640,by,"Approve",{col:GV.green,washA:0.3+0.4*ys,press:ys,size:30});if(ys>0.01)wc_tick(ctx,640+aw+36,by-4,44,GV.greenInk,clamp(ys*1.6,0,1),6);
  const rx=1000;withA(ctx,0.55+0.45*al,()=>gk_button(ctx,rx,by,"Reject",{col:GV.grey,washA:0.25+0.25*al,size:30}));
  if(al>0.01)withA(ctx,al,()=>{wc_T(ctx,"reason:",rx+170,by+10,{w:600,size:28,col:WC_MUTED});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.beginPath();
    ctx.moveTo(rx+280,by+16);ctx.lineTo(1740,by+16);ctx.stroke();ctx.restore();});
  const ms=clamp(o.msg||0,0,1);if(ms>0.01)gk_rise(ctx,ms,()=>{wc_panel(ctx,1000,560,770,124,{kind:"card",wash:GV.green,washA:0.16,seed:1003});
    wc_T(ctx,"Your access request has been approved.",1030,610,{w:700,size:28,col:WC_DARK});wc_T(ctx,"You now have access to the requested resource.",1030,654,{w:600,size:28,col:WC_INK});},12);
  if(o.date>0.01)gk_key(ctx,1520,140,-0.4,"until 31 Jan 2027",{a:clamp(o.date,0,1)});}
// the request kept as the record: who asked, why, who said yes, and until when (o.rows[k], 0 to 1)
const GK_REC=[["asked by","Anil Kurian, Faculty of Health"],["why","To plan next semester's places …"],["yes from","Clara Jensen, Planning"],["until","31 Jan 2027"]];
function gk_record(ctx,t,o){o=o||{};const x=360,y=150,w=1200,h=560;gv_sheet(ctx,x,y,w,h,{rot:0.004});gv_pin(ctx,x+w/2,y+18,GV.red,1.2);
  wc_T(ctx,"Access request · Learners near an award",x+56,y+96,{w:800,size:36,col:WC_DARK});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.45);ctx.fillRect(x+56,y+122,w-112,3);ctx.restore();
  GK_REC.forEach(([l,v],i)=>{const r=clamp((o.rows||[])[i]==null?1:o.rows[i],0,1),yy=y+210+i*92;if(r>0.01)gv_tint(ctx,x+40,yy-44,w-80,66,GV.gold,0.55*r);
    wc_T(ctx,l,x+70,yy,{w:600,size:30,col:WC_MUTED});wc_T(ctx,v,x+330,yy,{w:700,size:34,col:WC_DARK});});}

/* ---------- 6 · a key with a date ---------- */
// The university's directory, as Governed in Unity Catalog drew it: a card index on the platform team's wall, a drawer for each product's
// readers' group, its name on a brass holder; the data platform's rack beside it. Painted once; the cards, the names and the sync every frame
const GK_IX={x:150,y:250,w:1020,top:880,dr:[[175,290,970,150],[175,460,970,150],[175,630,970,150]],rack:[1520,170,260,710]};
const GK_DRN=["learners_near_an_award_readers","awards_readers","learner_wallet_readers"];
function gk_paintIndex(ctx){const I=GK_IX,wall=GV_ROOM.plat;gv_wallFloor(ctx,wall,I.top,{seed:65,vx:900});gv_lightGlow(ctx,700,0,620);
  wc_part(ctx,wc_rect(I.x,I.y,I.w,I.top-I.y),[150,106,70],1,{seed:501});wc_part(ctx,wc_rect(I.x-14,I.y-26,I.w+28,30),[170,122,82],1,{seed:502});
  I.dr.forEach(([x,y,w,h],i)=>{wc_part(ctx,wc_rect(x,y,w,h),[196,152,104],1,{seed:510+i});wc_part(ctx,wc_rect(x+w/2-310,y+18,620,62),[204,170,96],1,{seed:520+i});
    wc_flat(ctx,wc_rect(x+w/2-303,y+24,606,50),[246,240,226],1,"card");wc_part(ctx,wc_rrPts(x+w/2-46,y+100,92,30,12),[184,150,80],1,{seed:530+i});});
  wc_part(ctx,wc_rect(I.x+30,I.top-70,I.w-60,70),[132,92,60],1,{seed:541});const [rx,ry,rw,rh]=I.rack;gv_rack(ctx,rx,ry,rw,rh,13);}
// the drawers' names (o.lit[i] washes one gold); Anil's card going into the product's drawer from above as o.card goes 0 to 1, its date on
// a tag (and out again as o.out goes 0 to 1, the tag going grey); the sync to the platform (o.sync); one person's card, crossed (o.one,
// o.x); the key, its tag going grey (o.key, o.grey)
function gk_index(ctx,t,o){o=o||{};const I=GK_IX;
  GK_DRN.forEach((s,i)=>{const [x,y,w]=I.dr[i],L=clamp((o.lit||[])[i]||0,0,1);if(L>0.01)gv_tint(ctx,x+w/2-303,y+24,606,50,GV.gold,0.8*L);
    wc_T(ctx,s,x+w/2,y+60,{w:500,size:28,f:"mono",align:"center",col:WC_DARK});});
  wc_tag(ctx,I.x+I.w/2,I.top-35,"the university's directory",{size:30,align:"center",seed:571});const [rx,ry,rw]=I.rack;wc_tag(ctx,rx+rw/2,ry-36,"data platform",{size:30,align:"center",seed:572});
  const cu=clamp(o.card||0,0,1),ot=clamp(o.out||0,0,1),u=cu*(1-easeCam(ot));if(u>0.01){const [x,y,w]=I.dr[0],cx=x+w/2-120,e=easeCam(clamp(u,0,1)),top=y-62-120*(1-e),cw=300,ch=150;
    ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,y+2+H);ctx.clip();withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,cx-cw/2,top,cw,ch,{kind:"card",seed:581});
      wc_T(ctx,"Anil Kurian",cx,top+44,{w:700,size:30,align:"center",col:WC_DARK});});ctx.restore();
    if(u>0.6)withA(ctx,clamp((u-0.6)*2.5,0,1),()=>{ctx.save();ctx.strokeStyle=rgba([150,128,92],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+cw/2-14,top+22);ctx.quadraticCurveTo(cx+cw/2+10,top+8,cx+cw/2+34,top+30);ctx.stroke();ctx.restore();
      const dw=wc_tag(ctx,cx+cw/2+34,top+30,"until 31 Jan 2027",{size:28,seed:582});gv_tint(ctx,cx+cw/2+40,top+10,dw-12,40,GV.grey,0.6*ot);});}
  const sy=clamp(o.sync||0,0,1);if(sy>0.01){gk_arrow(ctx,[I.x+I.w+20,330],[rx-24,330],-60,sy,{col:GU_CYAN,lw:6});withA(ctx,clamp(sy*2-1,0,1),()=>wc_hand(ctx,"sync",1345,262,{size:36,w:700,align:"center",col:GU_CYAN}));}
  const on=clamp(o.one||0,0,1);if(on>0.01){gu_nameCard(ctx,1200,430,"one person","by name",on);wc_cross(ctx,1478,486,64,GV.redInk,clamp(o.x||0,0,1));}
  const ky=clamp(o.key||0,0,1);if(ky>0.01)gk_key(ctx,1290,620,0.2,"until 31 Jan 2027",{a:ky,grey:clamp(o.grey||0,0,1)});}
// the table's page on the platform, Permissions: its one grant, to the product's readers' group (o.lit), since the product went live (o.note)
const GK_TABS=["Overview","Columns","Sample data","Permissions","Lineage"];
function gk_perms(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,l=clamp(o.lit||0,0,1);gu_page(ctx,x,y,w,h,{bar:"Databricks · Unity Catalog",title:"mart_planning__near_award",titleSize:40,
    sub:"university · prod_marts · table",tabs:GK_TABS,tab:3});
  wc_T(ctx,"Principal",250,400,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"Privilege",1180,400,{w:700,size:28,col:WC_MUTED});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,420,1610,2);ctx.restore();
  const ry=484;if(l>0.01)gv_tint(ctx,150,ry-42,1610,64,GV.gold,0.6*l);ctx.save();ctx.strokeStyle=rgba([120,126,140],0.95);ctx.lineWidth=4;ctx.beginPath();ctx.arc(194,ry-10,20,0,TAU);ctx.stroke();ctx.restore();
  wc_T(ctx,"learners_near_an_award_readers",250,ry,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"SELECT",1180,ry,{w:500,size:30,f:"mono",col:WC_INK});
  if(o.note>0.01)wc_hand(ctx,"since the product went live",1180,ry+90,{size:38,w:700,col:WC_PENCIL,p:clamp(o.note,0,1)});
  if(o.tag>0.01)gu_filmTag(ctx,1760,800,"Governed in Unity Catalog",clamp(o.tag,0,1),{align:"right"});}
// on Anil's screen, a week before: the catalogue's reminder (o.u); on his desk, the key and its date
function gk_reminder(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen,u=clamp(o.u==null?1:o.u,0,1);gv_screen(ctx,x,y,w,h,GK_ONTOS,q=>{
  wc_T(q,"Learners near an award",x+32,y+104,{w:800,size:30,col:WC_DARK});
  ["Your access is expiring soon.","Contact the resource owner","if you need to extend","your access."].forEach((s,i)=>{const p=clamp(u*5-i,0,1);if(p>0.01)wc_T(q,s,x+32,y+164+i*42,{w:600,size:28,col:WC_INK,a:p});});},{barH:46,titleSize:28,bar:GK_CAT});}
// on Clara's screen: the product's readers, each with why, and until when; past its date, a reader's row greys (o.past); a row lit (o.lit)
function gk_readers(ctx,t,o){o=o||{};const [x,y,w,h]=GK_PX.screen,ps=clamp(o.past||0,0,1),l=clamp(o.lit||0,0,1);gv_screen(ctx,x,y,w,h,GK_ONTOS,q=>{
  wc_T(q,"Readers · Learners near an award",x+40,y+104,{w:800,size:32,col:WC_DARK});q.save();q.fillStyle=rgba(WC_PENCIL,0.3);q.fillRect(x+30,y+128,w-60,2);q.restore();
  if(l>0.01)gv_tint(q,x+24,y+142,w-48,170,GV.gold,0.55*l);
  withA(q,1-0.45*ps,()=>{wc_T(q,"Anil Kurian, Faculty of Health",x+40,y+186,{w:700,size:30,col:WC_DARK});wc_T(q,"To plan next semester's places …",x+40,y+232,{w:600,size:28,col:WC_INK});
    wc_T(q,"until 31 Jan 2027",x+40,y+282,{w:700,size:28,col:WC_DARK});});
  if(ps>0.01)withA(q,ps,()=>gk_pill(q,x+330,y+272,"ended",{size:28,wash:GV.grey,washA:0.35,seed:1011}));
  wc_T(q,"…",x+40,y+372,{w:600,size:30,col:WC_PENCIL});},{barH:46,titleSize:28,bar:GK_CAT});}

/* ---------- 7 · a known reader ---------- */
// the record of who uses what: the faculty's plan, a new file in the project, its lines typed in (o.p, 0 to 1); the film it comes from (o.tag)
const GK_EXP=[{n:1,s:"exposures:"},{fold:1},{n:3,s:"  - name: health_placements_plan"},{fold:1},{n:5,s:"    type: analysis"},{fold:1},{n:12,s:"    owner:"},
  {n:13,s:"      name: Faculty of Health"},{n:14,s:"      email: health.data@uni.example"},{n:15,s:"    depends_on:"},{n:16,s:"      - ref('mart_planning__near_award')"}];
function gk_exposure(ctx,t,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1),n=GK_EXP.length,L=o.lit||[];
  const F=gk_file(ctx,120,70,1500,o.u==null?1:o.u,{path:"exposures/health/_health__exposures.yml",lang:"yaml",lines:GK_EXP.map((r,i)=>r.fold?r:Object.assign({},r,{p:clamp(p*n-i,0,1),
    lit:i===7||i===8?clamp(L[0]||0,0,1):i===10?clamp(L[1]||0,0,1):0}))});
  if(F.rows.length&&o.hand>0.01)wc_hand(ctx,"a new reader, written in the project",1600,F.rows[0]-60,{size:36,w:700,col:WC_PENCIL,align:"right",p:clamp(o.hand,0,1)});
  if(o.tag>0.01)gu_filmTag(ctx,120,820,"Change without surprises",clamp(o.tag,0,1));}
// a change to Clara's table, on its pull request: the impact check's report, as its description shows it; who uses it, the faculty's plan
// lit (o.who), and who to ask (o.ask)
const GK_RNR=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`mart_planning__near_award`: **breaking**: removed faculty_code, added faculty. Needs a new",col:GV.redInk},
  {cont:1,s:"version, with a deprecation date for this one",col:GV.redInk},{h:2,s:"Who uses it"},{li:"`census_dashboard`, owned by Planning"},{li:"`health_placements_plan`, owned by Faculty of Health"},
  {fold:1},{h:2,s:"Who to ask"},{s:"Faculty of Health; Planning"}];
function gk_impact(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:"Rename faculty_code to faculty",titleSize:40,state:["Open",GV.green],
    sub:"Jun Park wants to merge into main"});gu_box(ctx,150,248,1620,596,null,{seed:1021});
  gk_md(ctx,150,248,1620,GK_RNR.map((it,i)=>Object.assign({},it,{lit:i===7?clamp(o.who||0,0,1):i===10?clamp(o.ask||0,0,1):0,p:i>=5?clamp(o.u==null?1:o.u,0,1):1})));}
// both readers are told before the change ships: two letters leave the newer building, one to Planning's window, one across the lawn to
// the old building (o.go, 0 to 1); each reader's name where it lands
const GK_FROM=[1460,620],GK_TO=[[1300,330,"Planning"],[330,520,"Faculty of Health"]];
function gk_tell(ctx,t,o){o=o||{};const go=clamp(o.go||0,0,1);
  GK_TO.forEach(([tx,ty,s],k)=>{const v=clamp(go*1.6-k*0.4,0,1);if(v<=0.01)return;const e=easeCam(v),[x,y]=gk_along(GK_FROM,[tx,ty],k?-220:-80,e);gk_env(ctx,x,y,0.9,1);
    if(v>0.85)gk_rise(ctx,clamp((v-0.85)*7,0,1),()=>wc_tag(ctx,tx,ty-90,s,{align:"center",size:30,wash:GV.gold,washA:0.35,seed:1031+k}),10);});}

/* ---------- 8 · outside the university ---------- */
// a partner university far off, small, with no crest or name: a low building with a pediment and a tower, pale in the distance; kept
function gk_partnerC(){return wc_kept("gkPartner",300,220,q=>{q.translate(20,30);const st=[196,202,218],rf=[156,166,192];wc_part(q,wc_rect(20,80,220,96),st,0.4,{seed:901});
  wc_part(q,[[8,82],[130,34],[252,82]],rf,0.4,{seed:902});wc_part(q,wc_rect(176,0,44,90),st,0.4,{seed:903});wc_part(q,[[170,2],[198,-26],[226,2]],rf,0.4,{seed:904});
  q.fillStyle=rgba([140,158,192],0.75);for(let i=0;i<5;i++)q.fillRect(42+i*40,106,20,44);});}
// the campus, and beyond it, far off, the partner (o.far); a thread from one to the other (o.thr)
function gk_far(ctx,t,o){o=o||{};const f=clamp(o.far||0,0,1);if(f<=0.01)return;withA(ctx,f,()=>ctx.drawImage(gk_partnerC(),760,488,150,110));
  gk_arrow(ctx,[520,470],[830,520],-70,clamp(o.thr||0,0,1),{col:WC_PENCIL,lw:3.5,dash:[10,9],head:false});
  gk_rise(ctx,clamp(f*1.6-0.4,0,1),()=>wc_tag(ctx,840,440,"a partner university",{align:"center",size:30,seed:1041}),8);}
// the registrar's office, close: Mei behind her desk; what o.draw puts on her screen
function gk_mei(x,tt,o){o=o||{};gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],Object.assign({pose:"listen",t:tt},o.mei||{}));
  x.drawImage(gv_place("regDesk"),0,0,W,H);if(o.draw)o.draw(x);}
// on her screen, the partner's request for Awards (o.u), and her yes (o.yes)
function gk_meiScreen(ctx,t,o){o=o||{};const [x,y,w,h]=GV_RX.screen,ys=clamp(o.yes||0,0,1);gv_screen(ctx,x,y,w,h,"Request · from a partner university",q=>{
  wc_T(q,"Awards",x+32,y+110,{w:800,size:36,col:WC_DARK});wc_T(q,"owner: Mei Tanaka",x+32,y+160,{w:600,size:28,col:WC_MUTED});
  wc_T(q,"to count the faculty's",x+32,y+220,{w:600,size:28,col:WC_INK});wc_T(q,"certificate towards its degrees",x+32,y+260,{w:600,size:28,col:WC_INK});
  if(ys>0.01){gk_button(q,x+32,y+314,"Approve",{col:GV.green,washA:0.35+0.3*ys,press:ys});wc_tick(q,x+250,y+308,40,GV.greenInk,clamp(ys*1.6,0,1),6);}},{barH:46,titleSize:28,bar:GK_MAIL});}
// Awards' contract in the catalogue, on a big screen: each award, its credit points and its faculty, every column's class none (o.lit[k]
// lights each part as it's named; o.none, the classes)
const GK_AW=[["award_code",0],["award_name",0],["credit_points_required",1],["faculty_name",2]];
function gk_awards(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,L=o.lit||[],nn=clamp(o.none||0,0,1);gu_page(ctx,x,y,w,h,{bar:GK_ONTOS,title:"Awards",titleSize:40,state:["Active",GV.green],
    sub:"course · owner: Mei Tanaka, registrar's office",tabs:["Overview","Contract"],tab:1});
  wc_T(ctx,"core_award_v1",170,368,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"11 columns",1750,368,{w:700,size:28,col:WC_MUTED,align:"right"});
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,390,1620,2);ctx.restore();
  [["…",-1]].concat(GK_AW).concat([["…",-1]]).forEach(([c,k],i)=>{const yy=446+i*64,l=k>=0?clamp(L[k]||0,0,1):0;if(l>0.01)gv_tint(ctx,156,yy-36,1608,54,GV.gold,0.6*l);
    wc_T(ctx,c,190,yy,{w:500,size:28,f:"mono",col:c==="…"?WC_PENCIL:WC_DARK});if(k>=0){if(nn>0.01)gv_halo(ctx,884,yy-40,200,60,GV.green,0.6*nn);gv_classChip(ctx,900,yy-10,"none",{});}});
  if(nn>0.01)wc_hand(ctx,"no one's personal data",1180,560,{size:40,w:700,col:GV.greenInk,p:nn});}
// the sharing page on the platform: a share of Awards' table, its recipient a partner university (o.u, o.rec); open to any platform (o.any)
function gk_share(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,rc=clamp(o.rec||0,0,1);gu_page(ctx,x,y,w,h,{bar:"Databricks · OpenSharing",title:"awards_for_partners",titleSize:40,sub:"share · read-only"});
  gu_box(ctx,150,280,1620,200,"Data",{seed:1051});wc_T(ctx,"core_award_v1",190,410,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"table",900,410,{w:600,size:28,col:WC_MUTED});
  gu_box(ctx,150,510,1620,220,"Recipients",{seed:1052});if(rc>0.01)gk_rise(ctx,rc,()=>{wc_T(ctx,"partner university",190,640,{w:700,size:32,col:WC_DARK});
    wc_T(ctx,"on any platform · token, at most a year",900,640,{w:600,size:28,col:WC_INK});},10);}
// the partner reads the table where it lives, not a copy: the university's table (left) and the partner's window, another tool's (right),
// a thread between them (o.read, the window; o.thr, the thread); a copy by email, crossed out (o.copy, o.x); the partner's key, that ends (o.key); the same contract (o.con)
function gk_reads(ctx,t,o){o=o||{};const rd=clamp(o.read||0,0,1),cp=clamp(o.copy||0,0,1);
  gk_win(ctx,80,100,760,300,"Databricks · Unity Catalog",q=>{wc_T(q,"core_award_v1",120,206,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(q,"award_code  award_name  …",120,262,{w:500,size:28,f:"mono",col:WC_INK});
    wc_T(q,"the university's platform",120,340,{w:600,size:28,col:WC_MUTED});});
  if(rd>0.01)gk_rise(ctx,clamp(rd*2,0,1),()=>gk_win(ctx,1080,100,760,300,"a partner university",q=>{wc_T(q,"core_award_v1",1120,206,{w:500,size:30,f:"mono",col:WC_DARK});
    wc_T(q,"award_code  award_name  …",1120,262,{w:500,size:28,f:"mono",col:WC_INK});wc_T(q,"another platform",1120,340,{w:600,size:28,col:WC_MUTED});},GK_OTHER),14);
  const th=o.thr==null?clamp(rd*2-0.6,0,1):clamp(o.thr,0,1);if(rd>0.01)gk_thread(ctx,[840,250],[1080,250],th,{col:GU_CYAN,bend:-40,lw:4.5});
  if(cp>0.01){const e=easeCam(clamp(cp*1.4,0,1)),[ex,ey]=gk_along([460,440],[960,560],40,e);gk_env(ctx,ex,ey,1,1,{clip:1});wc_cross(ctx,ex,ey,110,GV.redInk,clamp(o.x||0,0,1));
    if(o.x>0.3)wc_hand(ctx,"a copy",ex-120,ey+70,{size:36,w:700,col:GV.redInk,align:"center",p:clamp(o.x*1.6-0.5,0,1)});}
  const ky=clamp(o.key||0,0,1);if(ky>0.01)gk_key(ctx,1180,456,-0.3,"expires · at most a year",{a:ky});
  const cn=clamp(o.con||0,0,1);if(cn>0.01)gk_file(ctx,1000,640,860,cn,{path:"governance/5-data-contracts/core_award_v1.yaml",lang:"yaml",lines:[{n:6,s:"name: core_award_v1"}]});}
// a private exchange: a smaller shop window, locked, Awards in it (o.u), its sign (o.sign); two partners in front of it, and no one else (o.only)
const GK_XCH={glass:[660,330,600,400],small:1};
function gk_lock(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba([120,104,70],1);ctx.lineWidth=9;ctx.beginPath();ctx.arc(0,-20,24,Math.PI,0);ctx.lineTo(24,0);ctx.moveTo(-24,0);ctx.lineTo(-24,-20);ctx.stroke();
  wc_part(ctx,wc_rrPts(-36,-4,72,58,8),GK_GOLD,1,{seed:1061});ctx.fillStyle=rgba([90,70,40],0.9);ctx.beginPath();ctx.arc(0,20,7,0,TAU);ctx.fill();ctx.fillRect(-3,22,6,16);ctx.restore();}
function gk_partnerCard(ctx,x,y,a){if(a<=0.01)return;gk_rise(ctx,a,()=>{wc_panel(ctx,x,y,300,230,{kind:"card",seed:1062+x});ctx.drawImage(gk_partnerC(),x+30,y+20,240,176);
  wc_T(ctx,"a partner",x+150,y+212,{w:700,size:28,col:WC_DARK,align:"center"});},14);}
function gk_exchange(ctx,t,o){o=o||{};const [gx,gy,gw,gh]=GK_XCH.glass,u=clamp(o.u==null?1:o.u,0,1),on=clamp(o.only||0,0,1);
  if(u>0.01)gk_rise(ctx,u,()=>gk_tile(ctx,1,gx+80,gy+90,440,220,{own:1,dom:1}),16);gk_glass(ctx,gx,gy,gw,gh);gk_lock(ctx,960,gy+gh+10,1.1);
  withA(ctx,clamp(o.sign==null?1:o.sign,0,1),()=>wc_tag(ctx,960,96,"Databricks Marketplace · private exchange",{align:"center",size:32,seed:1063}));
  gk_partnerCard(ctx,200,420,clamp(on*2,0,1));gk_partnerCard(ctx,1420,420,clamp(on*2-0.5,0,1));
  if(on>0.3){gk_arrow(ctx,[500,520],[gx-40,gy+gh/2],-30,clamp(on*1.6-0.5,0,1),{col:WC_PENCIL,lw:3.5,dash:[10,9]});gk_arrow(ctx,[1420,520],[gx+gw+40,gy+gh/2],-30,clamp(on*1.6-0.7,0,1),{col:WC_PENCIL,lw:3.5,dash:[10,9]});}}

/* ---------- 9 · part of governance ---------- */
// on Anil's screen today: his request, approved, until its date (o.u); or his mail, the copy gone (o.mail)
function gk_today(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;if(o.mail){gv_screen(ctx,x,y,w,h,"Mail",q=>{wc_T(q,"Inbox",x+32,y+108,{w:800,size:32,col:WC_DARK});
    q.save();q.fillStyle=rgba(WC_PENCIL,0.3);q.fillRect(x+24,y+130,w-48,2);q.restore();wc_T(q,"no attachments left",x+32,y+190,{w:600,size:28,col:WC_MUTED});},{barH:46,titleSize:28,bar:GK_MAIL});return;}
  gv_screen(ctx,x,y,w,h,GK_ONTOS,q=>{wc_T(q,"Access request",x+32,y+108,{w:800,size:32,col:WC_DARK});gk_pill(q,x+32+tw(q,"Access request ",32,800),y+96,"Approved",{size:28,wash:GV.green,washA:0.45,seed:1071});
    wc_T(q,"Learners near an award",x+32,y+170,{w:700,size:30,col:WC_DARK});wc_T(q,"until 31 Jan 2027",x+32,y+222,{w:700,size:28,col:WC_INK});},{barH:46,titleSize:28,bar:GK_CAT});}

/* ---------- the places ---------- */
// the series' desk of files, as gu_paintFilesDesk paints it, with its mug at the bottom right: this film's papers run the frame's width
function gk_paintFilesDesk(c){const wood=[214,196,168];c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),wood,{kind:"plaster",line:false,seed:57});
  c.save();c.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<60;i++){const y=R()*H;c.strokeStyle=rgba(wc_dim(wood,0.18+R()*0.1),0.16+R()*0.12);c.lineWidth=1+R()*2;c.beginPath();c.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)c.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/70+i*2));c.stroke();}c.restore();
  wc_wash(c,wc_ell(1826,1000,80,80,40),[232,236,240],{kind:"thing",lw:1.6});wc_wash(c,wc_ell(1826,1000,60,60,40),[96,70,60],{kind:"thing",line:false});
  wc_part(c,wc_rect(-60,820,300,330),[96,84,120],1,{seed:3});wc_flat(c,wc_rect(170,820,18,330),[236,226,200],1,"band");}
// an awning w wide, kept: stripes of its colour and a paler one, the edge scalloped, a soft shadow under it
function gk_awningC(col,w){return wc_kept("gkAwn"+col.join(",")+"|"+w,w+40,90,q=>{q.translate(20,14);const sw=w/Math.round(w/34),n=Math.round(w/sw),pale=mix(col,[255,250,240],0.62);
  q.save();q.filter="blur(5px)";q.fillStyle="rgba(60,44,30,0.18)";q.fillRect(4,30,w-8,22);q.restore();
  for(let k=0;k<n;k++){const x0=k*sw,P=[[x0,0],[x0+sw,0],[x0+sw,34]];for(let j=1;j<12;j++){const a=j/12*Math.PI;P.push([x0+sw/2+sw/2*Math.cos(a),34+sw/2*Math.sin(a)*0.8]);}P.push([x0,34]);
    wc_flat(q,P,k%2?pale:col,1,"awning");}
  wc_ink(q,[[0,0],[w,0]],false,2,WC_PENCIL,0.7,61,0.6);});}
// a shop window on a street: a plastered wall, the window's frame round its pane, an awning in plain stripes over it, a sill and a riser
// under it, the pavement; painted once. S.glass: where the tiles go, drawn every frame, with the glass's light over them (gk_glass)
function gk_paintShop(c,S){const [x,y,w,h]=S.glass,f=S.small?30:40,wood=[64,92,88];c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);
  wc_wash(c,wc_rect(-40,-40,W+80,H+80),[234,226,212],{kind:"plaster",line:false,seed:141});wc_wash(c,wc_rect(-40,930,W+80,190),[198,192,182],{kind:"plaster",line:false,seed:142});
  wc_wash(c,wc_rect(-40,924,W+80,12),wc_dim([198,192,182],0.2),{kind:"trim",line:false,flat:true});
  wc_part(c,wc_rect(x-f,y-f,w+2*f,h+2*f),wood,1,{seed:143});wc_flat(c,wc_rect(x,y,w,h),[244,240,230],1,"glass");
  wc_part(c,wc_rect(x-f-18,y+h+f-8,w+2*f+36,26),wc_lit(wood,0.12),1,{seed:144});wc_part(c,wc_rect(x-f,y+h+f+18,w+2*f,926-(y+h+f+18)),wc_dim(wood,0.08),1,{seed:145});
  c.drawImage(gk_awningC([108,124,140],w+2*f+40),x-f-40,y-f-150,w+2*f+80,180);}
const WC_PLACES={faculty:gv_paintFaculty,platform:gv_paintPlatformClose,platformDesk:gv_paintPlatformDesk,facDesk:gv_paintFacultyDesk,facBig:c=>gu_paintScreenBig(c,GV_ROOM.fac),desk:gk_paintFilesDesk,campus:gv_paintCampus,
  shop:c=>gk_paintShop(c,GK_SHOP),exchange:c=>gk_paintShop(c,GK_XCH),planClose:gk_paintPlan,planDesk:gk_paintPlanDesk,bigPlan:c=>gu_paintScreenBig(c,GV_ROOM.plan),
  mapClose:gv_paintMapClose,index:gk_paintIndex,bigPlat:c=>gu_paintScreenBig(c,GV_ROOM.plat),big:c=>gu_paintScreenBig(c,GV_ROOM.data),
  registrar:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,bigReg:c=>gu_paintScreenBig(c,GV_ROOM.reg),board:c=>gv_paintBoardClose(c,GV_ROOM.data)};
