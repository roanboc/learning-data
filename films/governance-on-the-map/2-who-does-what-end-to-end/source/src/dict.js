/* ===== Who does what, end to end: the dictionary's pieces =====
   What moves in the opening, drawn every frame: Palma's slips passed up the academy's table and coming back to a pile at his elbow;
   the ring of the twenty-three academies, a change sent from the Spanish Academy to every other one and coming back ticked; the entry on a
   phone at a bus stop; the yearly list of what's new, its entry for "to budget". Words in Spanish are never drawn: an entry is lines too
   small to read, with an English tag where the story needs one. Every name starts with ee_ or EE. */

/* ---------- slips on the academy's table ---------- */
// the slips Palma passes up the table: each slides from his place to the head of the table, one after another (up(i), 0 to 1); then most
// come back down to a pile at his elbow (back(i)), and two stay at the head; the last to come back, he picks up (o.picked) and holds up
// (it's drawn in his hand). y: the line on the table they slide along
const EE_SL={n:9,from:1540,to:420,y:712,pile:[1490,736],stay:[2,6]};
function ee_slips(ctx,up,back,picked){const S_=EE_SL;for(let i=0;i<S_.n;i++){const u=easeCam(clamp(up(i),0,1)),b=S_.stay.includes(i)?0:easeCam(clamp(back?back(i):0,0,1));if(u<=0.001)continue;
    if(picked&&i===S_.n-1&&b>0.999)continue;const lane=(i%3-1)*16,x0=lerp(S_.from,S_.to+i*22,u),y0=S_.y+lane+Math.sin(u*Math.PI)*-6;
    const x=lerp(x0,S_.pile[0]+(i%2?8:-6),b),y=lerp(y0,S_.pile[1]-i*2.4,b)-Math.sin(b*Math.PI)*18,rot=lerp((i%4-1.5)*0.08,(i%2?0.05:-0.04),b);
    ee_slipAt(ctx,x,y,58,rot);}}
// the pile at his elbow, already there (n slips)
function ee_pile(ctx,n){for(let i=0;i<n;i++)ee_slipAt(ctx,EE_SL.pile[0]+(i%2?8:-6)+((i*13)%5-2),EE_SL.pile[1]-i*2.4,58,(i%2?0.05:-0.04));}

/* ---------- the ring of the academies ---------- */
// Twenty-three cards round an ellipse, the Spanish Academy's at the top; a change (a card with lines) goes out from it to each of the
// others (out, 0 to 1), each sends back a small ticked card (back, 0 to 1); then all twenty-three light at once (all), and one dictionary
// appears in the middle (book). The cards' names are lines too small to read: the corner of the frame names nothing
const EE_RG={cx:960,cy:520,rx:640,ry:330,n:23};
const ee_ringXY=i=>{const a=-Math.PI/2+i*TAU/EE_RG.n;return[EE_RG.cx+Math.cos(a)*EE_RG.rx,EE_RG.cy+Math.sin(a)*EE_RG.ry];};
function ee_ring(ctx,st){const R_=EE_RG,f=(fn,j)=>fn?fn(j):0;
  for(let i=0;i<R_.n;i++){const u=f(st.card,i);if(u<=0.01)continue;const [x,y]=ee_ringXY(i),k=0.8+0.2*spring(clamp(u,0,1)),lit=st.all||0,top=i===0;
    ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*2.5,0,1),()=>{if(lit>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,0,90,[255,214,120],0.5*lit);ctx.restore();}
      wc_panel(ctx,-56,-34,112,68,{kind:"card",seed:601+i,wash:top||lit>0.5?GV.gold:null,washA:top?0.5:0.3*lit});
      ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-34,-6);ctx.lineTo(30-((i*17)%20),-6);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-34,10);ctx.lineTo(22,10);ctx.stroke();});ctx.restore();}
  // the change, going out from the top card to each other card, and the ticked answers coming back; a faint pencil line from the top card to
  // each card the change has reached, gone once they all light
  const [tx,ty]=ee_ringXY(0);ctx.save();ctx.globalCompositeOperation="multiply";ctx.strokeStyle=rgba(WC_PENCIL,1);ctx.lineWidth=2;ctx.setLineDash([6,8]);
  for(let i=1;i<R_.n;i++){const a=0.3*clamp(f(st.out,i)*3,0,1)*(1-(st.all||0));if(a<=0.01)continue;const [x,y]=ee_ringXY(i);ctx.globalAlpha=a;ctx.beginPath();ctx.moveTo(tx,ty+20);ctx.lineTo(x,y);ctx.stroke();}
  ctx.restore();
  for(let i=1;i<R_.n;i++){const [x,y]=ee_ringXY(i),o=easeCam(clamp(f(st.out,i),0,1)),b=easeCam(clamp(f(st.back,i),0,1));
    if(o>0.01&&o<0.995){ee_miniCard(ctx,lerp(tx,x,o),lerp(ty+20,y,o)-Math.sin(o*Math.PI)*30,0.5,false);}
    if(b>0.01&&b<0.995){ee_miniCard(ctx,lerp(x,tx,b),lerp(y,ty+20,b)-Math.sin(b*Math.PI)*30,0.5,true);}
    if(f(st.tick,i)>0.01)wc_tick(ctx,x+40,y-26,30,GV.greenInk,clamp(f(st.tick,i),0,1),4);}
  const bk=st.book||0;if(bk>0.01){const k=0.8+0.2*spring(clamp(bk,0,1));ctx.save();ctx.translate(R_.cx,R_.cy+10);ctx.scale(k*1.8,k*1.8);withA(ctx,clamp(bk*2,0,1),()=>ee_bigDict(ctx,0,0,1));ctx.restore();}}
// a small card in flight: lines, and a tick on the way back
function ee_miniCard(ctx,x,y,s,ticked){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="rgba(40,30,20,0.2)";ctx.fillRect(-46,-26,96,56);ctx.fillStyle=rgba([255,253,246],1);ctx.fillRect(-50,-30,96,56);
  ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.strokeRect(-50,-30,96,56);ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-34,-10);ctx.lineTo(24,-10);ctx.moveTo(-34,8);ctx.lineTo(10,8);ctx.stroke();
  if(ticked)wc_tick(ctx,24,6,34,GV.greenInk,1,5);ctx.restore();}

/* ---------- an entry, on a phone and on the yearly list ---------- */
// the phone's screen, drawn large beside the person reading it: a word's entry as lines of writing (its headword a thicker line), n its
// senses; u its spring in
function ee_phoneCard(ctx,cx,cy,u){if(u<=0.01)return;const k=0.85+0.15*spring(clamp(u,0,1)),w=300,h=520;ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{
  ctx.fillStyle="rgba(30,30,40,0.25)";rr(ctx,-w/2+10,-h/2+12,w,h,36);ctx.fill();ctx.fillStyle=rgba([40,42,50],1);rr(ctx,-w/2,-h/2,w,h,36);ctx.fill();ctx.fillStyle=rgba([252,252,248],1);rr(ctx,-w/2+14,-h/2+40,w-28,h-80,10);ctx.fill();
  ctx.lineCap="round";ctx.strokeStyle=rgba([30,40,80],0.85);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-w/2+40,-h/2+92);ctx.lineTo(-w/2+170,-h/2+92);ctx.stroke();
  ctx.strokeStyle=rgba(WC_MUTED,0.55);ctx.lineWidth=5;for(let i=0;i<9;i++){const y=-h/2+140+i*34,l=(i%3===0?160:210)-((i*29)%60);ctx.beginPath();ctx.moveTo(-w/2+(i%3===0?40:60),y);ctx.lineTo(-w/2+(i%3===0?40:60)+l,y);ctx.stroke();}});ctx.restore();}
// the list of what's new in this year's update, on a page: its title, then entries in groups, each a headword's line and a short line
// after it (lines too small to read). o.hi: the entry for "to budget", lit gold (0 to 1); o.title (0 to 1) its title's words
const EE_WN={x:520,y:70,w:880,h:880,rows:13,hi:7};
function ee_whatsNew(ctx,o){o=o||{};const P=EE_WN;ctx.save();ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(P.x+12,P.y+14,P.w,P.h);wc_panel(ctx,P.x,P.y,P.w,P.h,{kind:"card",seed:621});
  if((o.title==null?1:o.title)>0.01)withA(ctx,o.title==null?1:o.title,()=>wc_T(ctx,"what's new",P.x+60,P.y+96,{w:800,size:48,col:WC_DARK}));
  ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(P.x+60,P.y+128);ctx.lineTo(P.x+P.w-60,P.y+128);ctx.stroke();
  const hi=clamp(o.hi||0,0,1);for(let i=0;i<P.rows;i++){const y=P.y+180+i*52,h=i===P.hi;
    if(h&&hi>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.4),0.8*hi);ctx.fillRect(P.x+44,y-26,P.w-88,44);ctx.restore();}
    ctx.lineCap="round";ctx.strokeStyle=rgba(h&&hi>0.5?GV.goldInk:[40,46,80],0.8);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(P.x+64,y);ctx.lineTo(P.x+64+110+((i*37)%80),y);ctx.stroke();
    ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(P.x+64+140+((i*37)%80),y);ctx.lineTo(P.x+P.w-80-((i*53)%200),y);ctx.stroke();}
  ctx.restore();}
const ee_wnRow=i=>[EE_WN.x+64,EE_WN.y+180+i*52];
