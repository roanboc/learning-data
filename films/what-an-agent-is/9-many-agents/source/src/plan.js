/* ===== Many agents, and what emerges: the university's pieces =====
   Drawn in the marble-and-oak room with the series' shared pieces (ag_). Colours keep the series' meanings: blue the platform and its
   tools (the table of counts, its gear, the lock, the test), violet the agents' thinking, orange where a finding came from, green a
   check that passes or a person's approval, amber a check that fails. Words are drawn live with ag_T, at least 28 px.
     ma_facCard(ctx, x, y, i, o)     a faculty's card: its name, its census count, its change on last year (MA_FAC[i])
     ma_papers(ctx, x, y, n, t, o)   a pile of notes and emails, n of them, landing one by one
     ma_calendar(ctx, x, y, day, a)  a desk calendar showing day "day" of fourteen
     ma_agent(ctx, x, y, r, t, o)    an agent sphere with a slight delay and settle of its own (o.at, o.from); o.ring a green ring
                                     (the checking agent), o.lock a small blue lock (read only)
     ma_table(ctx, x, y, o)          the platform's table of counts, in blue, with its gear: the same way every time
     ma_board(ctx, x, y, w, h, a)    the shared board on the marble wall; ma_pin(ctx, x, y, w, words, o) a card pinned to it, with an
                                     orange source chip
     ma_status, ma_stamp, ma_strike, ma_test, ma_bars, ma_meter, ma_range, ma_switch, ma_clock, ma_tile: see each */

const MA_FAC=[["Arts and Education",4236,134],["Business",6018,157],["Engineering and IT",5247,181],["Health",2880,-49]];
const ma_n=n=>String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g,",");
const ma_sgn=n=>(n<0?"−":"+")+ma_n(n);

/* a card that springs in from its centre: k 0..1 (ag_spr), a */
function ma_sprung(ctx,x,y,k,a,draw){if(a<=0||k<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.6,1,k));draw();ctx.restore();}
/* a faculty's card: name, count, change; 330 wide by 166 tall from (x, y); o.a, o.k, o.edge, o.hi (a soft lift) */
function ma_facCard(ctx,x,y,i,o){o=o||{};const f=MA_FAC[i],w=o.w||330,h=166,a=o.a==null?1:o.a,k=o.k==null?1:o.k;if(a<=0)return;
  ma_sprung(ctx,x+w/2,y+h/2,k,a,()=>{ag_box(ctx,x,y,w,h,20,{edge:o.edge,edgeA:0.8});ag_T(ctx,f[0],x+24,y+46,{w:700,size:30});
    ag_T(ctx,ma_n(f[1]),x+24,y+102,{w:800,size:44});if(o.change!==false)ag_T(ctx,ma_sgn(f[2])+" on last year",x+24,y+144,{w:500,size:28,col:AG.mut});});}
/* a pile of notes and emails beside a card: n papers land one by one from t0, each tipped a little; o.a; o.take (0..1) carries the
   sheets one after another to o.to ([x, y]), shrinking, as an agent reads them */
function ma_papers(ctx,x,y,n,t,o){o=o||{};const a=o.a==null?1:o.a,t0=o.t0||0,take=o.take||0,to=o.to||[x,y];if(a<=0)return;const R=ag_rnd(o.seed||(x|0));ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const st=t0+i*(o.gap||0.18),u=ag_spr(t,st,0.45),rot=(R()-0.5)*0.5,dx=(R()-0.5)*40,dy=-i*7,email=i%3===1;if(u<=0)continue;
    const g=ag_sine(clamp(take*1.7-(n-1-i)*0.12,0,1));if(g>=1)continue;
    ctx.save();ctx.globalAlpha*=1-sstep(0.6,1,g);ctx.translate(lerp(x+dx,to[0],g),lerp(y+dy-(1-Math.min(1,u))*40,to[1],g)-Math.sin(Math.PI*g)*60);ctx.rotate(rot*(1-g));ctx.scale(1-0.75*g,1-0.75*g);
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.2)";ctx.shadowBlur=8;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=3;
    ctx.fillStyle=email?"#F4F3F0":"#F1EBDA";ctx.fillRect(-38,-48,76,96);ctx.restore();
    if(email){ctx.fillStyle="rgba(60,70,80,0.18)";ctx.fillRect(-38,-48,76,18);ctx.strokeStyle="rgba(60,70,80,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-30,-44);ctx.lineTo(0,-34);ctx.lineTo(30,-44);ctx.stroke();}
    ctx.strokeStyle="rgba(70,70,76,0.35)";ctx.lineWidth=2.4;for(let l=0;l<5;l++){const ly=-24+l*13,lw=40+((i*7+l*11)%22);ctx.beginPath();ctx.moveTo(-28,ly);ctx.lineTo(-28+lw,ly);ctx.stroke();}ctx.restore();}
  ctx.restore();}
/* a draft an agent wrote: a small card, "DRAFT" in violet over two grey lines of words, w wide and 120 tall; k springs it in */
function ma_draft(ctx,x,y,w,a,k){if(a<=0)return;ma_sprung(ctx,x+w/2,y+60,k==null?1:k,a,()=>{ag_box(ctx,x,y,w,120,16,{edge:AG.violet,edgeA:0.6});ag_T(ctx,"DRAFT",x+24,y+46,{w:700,size:28,ls:4,col:AG.violet});
  ctx.fillStyle=rgba(AG.mut,0.3);rr(ctx,x+24,y+68,w-64,10,5);ctx.fill();rr(ctx,x+24,y+90,w-120,10,5);ctx.fill();});}
/* a desk calendar: a card of 170 by 186 with rings, showing "day" of 14; as day rises, each page lifts over the rings and the next
   shows under it */
function ma_calendar(ctx,x,y,day,a){if(a<=0)return;const d=clamp(Math.floor(day),1,14),f=day-Math.floor(day),flip=d<14?sstep(0.55,1,f):0;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,170,186,16,{});ctx.fillStyle=rgba(AG.mut,0.18);rr(ctx,x,y,170,48,16);ctx.fill();ag_T(ctx,"DAY",x+85,y+36,{w:700,size:28,ls:4,align:"center",col:AG.mut});
  ag_T(ctx,String(flip>0?d+1:d),x+85,y+140,{w:800,size:64,align:"center"});
  if(flip>0){const k=1-flip;ctx.save();ctx.translate(x,y+50);ctx.scale(1,k);ctx.fillStyle="#F1EFEA";rr(ctx,2,0,166,134,14);ctx.fill();ctx.fillStyle="rgba(46,38,28,"+(0.12*flip)+")";rr(ctx,2,0,166,134,14);ctx.fill();
    ag_T(ctx,String(d),85,90,{w:800,size:64,align:"center"});ctx.restore();
    ctx.fillStyle="rgba(46,38,28,"+(0.18*(1-flip))+")";ctx.fillRect(x+6,y+50+134*k,158,4);}
  for(const rx of [x+44,x+126]){ctx.fillStyle="#7C7A76";ctx.beginPath();ctx.arc(rx,y+6,7,0,TAU);ctx.fill();}ctx.restore();}
/* a card with a word stamped across it in ink: the budget card, "Budgets" and the stamp "set" (k: how far the stamp has come down) */
function ma_stamp(ctx,x,y,text,k,o){o=o||{};if(k<=0)return;const col=o.col||[70,70,76],rot=o.rot==null?-0.12:o.rot,s=lerp(1.6,1,ag_eo(k)),a=sstep(0,0.3,k)*(o.a==null?1:o.a);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);const w=ag_tw(ctx,text.toUpperCase(),{w:800,size:o.size||34,ls:4})+40,h=(o.size||34)+26;
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,8);ctx.stroke();ag_T(ctx,text.toUpperCase(),0,(o.size||34)*0.36,{w:800,size:o.size||34,ls:4,align:"center",col:col});ctx.restore();}
/* an agent: the series' sphere, rolling in from o.from ([dx, dy]) at o.at with a settle of its own; o.ring (0..1) a thin green ring
   round it, the checking agent; o.lock (0..1) a small blue lock beside it; o.core, o.think; returns its centre */
function ma_agent(ctx,x,y,r,t,o){o=o||{};const at=o.at==null?-9:o.at,u=ag_spr(t,at,o.d||0.7),a=(o.a==null?1:o.a)*clamp((t-at)/0.25,0,1);if(a<=0)return [x,y];
  const fr=o.from||[0,0],px=x+fr[0]*(1-u),py=y+fr[1]*(1-u)-Math.abs(Math.sin(Math.min(1,(t-at)/0.7)*Math.PI))*(o.hop||0);
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,px+AG.sdx*r/40,py+r*0.98,r*1.1,r*0.22,0.3);
  ag_model(ctx,px,py,r,{t:t+(o.ph||0),core:o.core==null?0.6:o.core,think:o.think||0});
  if(o.ring>0){ctx.strokeStyle=rgba(AG.green,0.9*o.ring);ctx.lineWidth=Math.max(2.5,r*0.06);ctx.beginPath();ctx.arc(px,py,r*1.22,-Math.PI/2,-Math.PI/2+TAU*o.ring);ctx.stroke();}
  if(o.lock>0){ctx.save();ctx.globalAlpha*=o.lock;const lx=px+r*0.78,ly=py-r*0.72,s=Math.max(26,r*0.5);ctx.fillStyle="rgba(243,241,237,0.96)";ctx.beginPath();ctx.arc(lx,ly,s*0.62,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(AG.blue,0.5);ctx.lineWidth=1.5;ctx.stroke();ag_lock(ctx,lx,ly+s*0.06,s*0.82,rgba(AG.blue,1));ctx.restore();}
  ctx.restore();return [px,py];}
/* the platform's table of counts: a blue-edged card, one row per faculty with its count and change, the total under them, and a small
   blue gear turning: the same way every time. (x, y) its top left, 640 wide; o.a, o.k, o.spin, o.rows (0..1 how many rows show) */
function ma_table(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,k=o.k==null?1:o.k,w=640,h=440;if(a<=0)return;
  ma_sprung(ctx,x+w/2,y+h/2,k,a,()=>{ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.9});ag_T(ctx,"CENSUS COUNT",x+30,y+50,{w:700,size:28,ls:4,col:AG.blue});
    ma_gear(ctx,x+w-50,y+42,22,(o.t||0)*(o.spin==null?0.8:o.spin),AG.blue);const rows=o.rows==null?1:o.rows;
    MA_FAC.forEach((f,i)=>{const ra=clamp(rows*4-i,0,1);if(ra<=0)return;const yy=y+112+i*62;ctx.save();ctx.globalAlpha*=ra;ag_T(ctx,f[0],x+30,yy,{w:600,size:30});
      ag_T(ctx,ma_n(f[1]),x+440,yy,{w:700,size:30,align:"right"});ag_T(ctx,ma_sgn(f[2]),x+w-30,yy,{w:500,size:30,align:"right",col:AG.mut});ctx.restore();});
    ctx.strokeStyle=rgba(AG.blue,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y+352);ctx.lineTo(x+w-30,y+352);ctx.stroke();
    if(rows>=1){ag_T(ctx,"Total",x+30,y+404,{w:700,size:32});ag_T(ctx,"18,412",x+440,y+404,{w:800,size:32,align:"right"});ag_T(ctx,"+454",x+w-30,y+404,{w:500,size:30,align:"right",col:AG.mut});}});}
// a gear: teeth round a ring, turning
function ma_gear(ctx,x,y,r,ang,col){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=rgba(col,1);ctx.beginPath();for(let i=0;i<16;i++){const a=i/16*TAU,rr0=i%2?r*0.78:r;ctx.lineTo(Math.cos(a-0.12)*rr0,Math.sin(a-0.12)*rr0);ctx.lineTo(Math.cos(a+0.12)*rr0,Math.sin(a+0.12)*rr0);}
  ctx.closePath();ctx.fill();ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(0,0,r*0.36,0,TAU);ctx.fill();ctx.restore();}
/* the shared board on the marble wall: a pale linen pinboard in an oak frame, its name above it */
function ma_board(ctx,x,y,w,h,a){if(a<=0)return;ag_picture(ctx,x,y,w,h,{a,draw:(c,X,Y,Wd,Hd)=>{c.fillStyle="#ECE8E0";c.fillRect(X,Y,Wd,Hd);ag_grain(c,X,Y,Wd,Hd,2.2,909);
  c.strokeStyle="rgba(120,110,96,0.06)";c.lineWidth=1;for(let i=X;i<X+Wd;i+=6){c.beginPath();c.moveTo(i,Y);c.lineTo(i,Y+Hd);c.stroke();}}});}
/* a card pinned to the board: words {kick, title, sub}, w wide; o.src an orange chip naming where it came from ("notes", "email");
   o.edge (a colour), o.a, o.k; o.word {text, col, strike 0..1} an extra line in a colour (the copied word); returns its box */
function ma_pin(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a;const bb=ag_textCard(ctx,x,y,w,words,{measure:true}),extra=(o.src?50:0)+(o.word?44:0),h=bb.h+extra;if(a<=0)return{x,y,w,h};
  ma_sprung(ctx,x+w/2,y,o.k==null?1:o.k,a,()=>{ag_box(ctx,x,y,w,h,18,{edge:o.edge,edgeA:0.9});const inner=ag_textCard(ctx,x,y,w,words,{a:1,edge:null,kickCol:o.kickCol});
    let yy=y+bb.h-6;if(o.word){const W0=o.word;yy+=34;ag_T(ctx,W0.text,x+28,yy,{w:700,size:30,col:W0.col||AG.amber});if(W0.strike>0){const tw0=ag_tw(ctx,W0.text,{w:700,size:30});ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(x+24,yy-10);ctx.lineTo(x+28+tw0*W0.strike+4,yy-12);ctx.stroke();}yy+=10;}
    if(o.src){const sw=ag_tw(ctx,o.src,{w:600,size:28})+40;ctx.fillStyle=rgba(AG.orange,0.12);rr(ctx,x+24,yy+4,sw,40,20);ctx.fill();ctx.strokeStyle=rgba(AG.orange,0.8);ctx.lineWidth=2;rr(ctx,x+24,yy+4,sw,40,20);ctx.stroke();
      ag_T(ctx,o.src,x+44,yy+34,{w:600,size:28,col:AG.orange});}
    ctx.fillStyle="#8A847A";ctx.beginPath();ctx.arc(x+w/2,y+10,8,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.6)";ctx.beginPath();ctx.arc(x+w/2+2,y+8,3,0,TAU);ctx.fill();});
  return{x,y,w,h};}
/* the checking agent's flag: a card listing a student's statuses, "studying" ticked green beside the 31 */
function ma_status(ctx,x,y,a,k,hi){if(a<=0)return;ma_sprung(ctx,x+200,y+150,k==null?1:k,a,()=>{ag_box(ctx,x,y,400,300,20,{edge:AG.green,edgeA:0.9*(hi||0)});ag_T(ctx,"ALL 31",x+28,y+48,{w:700,size:28,ls:4,col:AG.green});
  ["studying","inactive","withdrawn","completed"].forEach((s,i)=>{const yy=y+104+i*52,on=i===0;ag_T(ctx,s,x+80,yy,{w:on?700:500,size:30,col:on?AG.ink:AG.mut});
    if(on){ag_tick(ctx,x+46,yy-10,26,rgba(AG.green,1),4.5);ag_T(ctx,"31",x+372,yy,{w:800,size:30,align:"right",col:AG.green});}else{ctx.fillStyle=rgba(AG.mut,0.4);ctx.beginPath();ctx.arc(x+46,yy-10,5,0,TAU);ctx.fill();ag_T(ctx,"0",x+372,yy,{w:500,size:30,align:"right",col:AG.mut});}});});}
/* a blue test card: "every degree has a faculty"; pass 0..1 turns its edge green and shows a pass pill */
function ma_test(ctx,x,y,a,pass,k){if(a<=0)return;const col=pass>0.5?AG.green:AG.blue;ma_sprung(ctx,x+230,y+80,k==null?1:k,a,()=>{const b=ag_textCard(ctx,x,y,460,{kick:"Test",title:"every degree has a faculty"},{edge:col,kickCol:AG.blue});
  if(pass>0)ag_pill(ctx,x+b.w-90,y+b.h+14,"passes",{icon:"tick",col:AG.green,a:sstep(0,0.5,pass)});});}
/* bars: values 0..1 over labels, w by h from (x, y) at their foot; o.col, o.a, o.u (0..1 how far they've grown), o.size of the labels */
function ma_bars(ctx,x,y,w,h,vals,labels,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,n=vals.length,bw=w/n;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(AG.ink,0.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+w+6,y);ctx.stroke();
  vals.forEach((v,i)=>{const bh=h*v*ag_eo(clamp(u*1.4-i*0.08,0,1)),bx=x+i*bw+bw*0.18;ctx.fillStyle=rgba(o.col||AG.violet,o.alpha||0.7);rr(ctx,bx,y-bh,bw*0.64,Math.max(0.1,bh),6);ctx.fill();
    if(labels)ag_T(ctx,labels[i],bx+bw*0.32,y+38,{w:700,size:o.size||28,align:"center",col:AG.mut});});ctx.restore();}
/* computing, one agent beside a team: two bars under the name "computing", w wide from (x, y); as u goes 0..1 the team's bar grows
   to many times the agent's */
function ma_meter(ctx,x,y,w,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_T(ctx,"computing",x,y-16,{w:700,size:28,col:AG.mut});
  const lw=170,bw=w-lw,one=bw/8;[["one agent",one],["a team",lerp(one,bw,ag_eo(clamp(u,0,1)))]].forEach(([s,l],i)=>{const yy=y+i*46;ag_T(ctx,s,x,yy+26,{w:600,size:28});
    ctx.fillStyle=rgba(AG.mut,0.12);rr(ctx,x+lw,yy+2,bw,28,14);ctx.fill();ctx.fillStyle=rgba(AG.blue,i?0.85:0.5);rr(ctx,x+lw,yy+2,Math.max(28,l),28,14);ctx.fill();});ctx.restore();}
/* a range from lo% to hi% on a 0 to 100 line, w wide from (x, y); u 0..1 how far it has spread */
function ma_range(ctx,x,y,w,lo,hi,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.ink,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  for(const p of [0,50,100]){ctx.beginPath();ctx.moveTo(x+w*p/100,y-10);ctx.lineTo(x+w*p/100,y+10);ctx.stroke();}const m=(lo+hi)/2,l=lerp(m,lo,ag_eo(u)),r=lerp(m,hi,ag_eo(u));
  ctx.fillStyle=rgba(AG.amber,0.5);rr(ctx,x+w*l/100,y-14,w*(r-l)/100,28,14);ctx.fill();if(u>0.8){ag_T(ctx,lo+"%",x+w*lo/100,y+52,{w:700,size:30,align:"center",col:AG.amber});ag_T(ctx,hi+"%",x+w*hi/100,y+52,{w:700,size:30,align:"center",col:AG.amber});}ctx.restore();}
/* a name tile, as the agents in the naming game hold: a small card with one letter */
function ma_tile(ctx,x,y,ch,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x-30,y-30,60,60,12,{edge:col||null,edgeA:0.9});ag_T(ctx,ch,x,y+14,{w:800,size:36,align:"center",col:col||AG.ink});ctx.restore();}
/* a plain wall switch: a pale plate with a rocker, on (1) or off (0) */
function ma_switch(ctx,x,y,on,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=6;ctx.fillStyle="#F3F1ED";rr(ctx,x-50,y-70,100,140,14);ctx.fill();ctx.restore();
  const k=clamp(on,0,1);ctx.fillStyle="#E2DED6";rr(ctx,x-26,y-46,52,92,8);ctx.fill();ctx.fillStyle="#F8F6F2";rr(ctx,x-24,y-44+lerp(46,0,k),48,44,7);ctx.fill();ctx.fillStyle="rgba(46,38,28,0.15)";rr(ctx,x-24,y-44+lerp(0,46,k),48,44,7);ctx.fill();ctx.restore();}
/* a wall clock: its hands at "hours" (any real number; it turns as hours rises) */
function ma_clock(ctx,x,y,r,hours,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(20,20,30,0.3)";ctx.shadowBlur=16;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=6;ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle="#57524C";ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();for(let i=0;i<12;i++){const an=i/12*TAU;ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.78,y+Math.sin(an)*r*0.78);ctx.lineTo(x+Math.cos(an)*r*0.9,y+Math.sin(an)*r*0.9);ctx.stroke();}
  const ha=(hours%12)/12*TAU-Math.PI/2,ma=(hours%1)*TAU-Math.PI/2;ctx.lineCap="round";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ha)*r*0.5,y+Math.sin(ha)*r*0.5);ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ma)*r*0.76,y+Math.sin(ma)*r*0.76);ctx.stroke();ctx.fillStyle="#57524C";ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();ctx.restore();}
/* a frame drawing itself round a group: a dashed rounded rectangle, p 0..1 of its length */
function ma_frame(ctx,x,y,w,h,p,col){if(p<=0)return;const L=2*(w+h);ctx.save();ctx.strokeStyle=rgba(col||AG.blue,0.85);ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.lineDashOffset=0;
  ctx.beginPath();const pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];let left=L*p;ctx.moveTo(x,y);for(let i=1;i<pts.length&&left>0;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]),k=Math.min(1,left/d);
    ctx.lineTo(lerp(pts[i-1][0],pts[i][0],k),lerp(pts[i-1][1],pts[i][1],k));left-=d;}ctx.stroke();ctx.restore();}
/* the place tag for the university's scenes */
const MA_UNI="The university · April 2026";

/* ---------------------------------------------------------------- many agents: a crowd, a team, a naming game */
// the crowd that gathers at the start: about ninety agents in seven uneven rows, smaller further back, the nearest cut by the frame's
// foot. k is the order each arrives in: the first near the front and the middle, then more and more from everywhere. Drawn back to front
const MA_MOB=(()=>{const R=ag_rnd(318),P=[];
  [680,708,744,790,846,912,990].forEach((g,row)=>{const r0=16.5+(g-676)*0.13,s=r0*4.6;let x=-40+R()*s*0.6;
    while(x<1960){if(R()>0.12){const gy=g+(R()-0.5)*(8+row*3),r=16.5+(gy-676)*0.13;P.push({x:x+(R()-0.5)*s*0.35,y:gy-r,r,ph:R()*6});}x+=s*(0.82+R()*0.36);}});
  P.map((p,i)=>[Math.hypot((p.x-960)/900,(p.y+p.r-930)/260)*0.6+R()*0.7,i]).sort((a,b)=>a[0]-b[0]).forEach(([_,i],k)=>{P[i].k=k;});
  return P.sort((a,b)=>a.y+a.r-(b.y+b.r));})();
// the 24 agents of the naming game in two staggered rows, each with its name tile above it
const MA_ROWS=Array.from({length:24},(_,i)=>{const back=i<12,k=back?i:i-12;return{x:(back?929:985)+(k-5.5)*112,y:back?718:852,r:back?32:38};});
/* the naming game, run once: each agent starts with a name from the pool; each round they meet in random pairs, the speaker says a
   name it knows, and if the listener knows it too both keep only that name; if not, the listener learns it. No agent prefers a name;
   in this run, one name has taken over after eight rounds. st[r][i]: the name agent i shows after round r; pairs[r]: who met */
const MA_NAMES=["K","M","Q","R","T"];
const MA_GAME=(()=>{const R=ag_rnd(472),N=24;let inv=Array.from({length:N},()=>[Math.floor(R()*5)]);const st=[inv.map(v=>v[v.length-1])],pairs=[];
  for(let r=0;r<9;r++){const o=[...Array(N).keys()];for(let i=N-1;i>0;i--){const j=Math.floor(R()*(i+1));[o[i],o[j]]=[o[j],o[i]];}const P=[];
    for(let k=0;k<N;k+=2){const a=o[k],b=o[k+1],w=inv[a][Math.floor(R()*inv[a].length)];P.push([a,b]);if(inv[b].includes(w)){inv[a]=[w];inv[b]=[w];}else inv[b]=inv[b].concat([w]);}
    pairs.push(P);st.push(inv.map(v=>v[v.length-1]));}return{st,pairs};})();
// a small bar chart of five names, w by h from (x, y) at its foot: vals 0..1; o.labels under the bars; o.col
function ma_nameChart(ctx,x,y,w,h,vals,a,o){o=o||{};if(a<=0)return;ma_bars(ctx,x,y,w,h,vals,o.labels?MA_NAMES:null,{a,col:o.col||AG.violet,alpha:o.alpha||0.75,u:o.u});}
