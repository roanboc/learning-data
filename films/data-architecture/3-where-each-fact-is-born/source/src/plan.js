/* ===== Where each fact is born: this film's pictures =====
   Chile in 1972, in lamp-light: the telex lines being extended to the state's factories, the free telex, the software that needs each
   factory's own number from that day, the figures from anywhere else that mislead it, the mill short of cotton that waits, each number
   sent from where it's made, the reminders, the number born at its factory and read in Santiago as a copy. Then the utility's wall:
   a new home at 14 Quarry Lane, created twice, by billing and by the network map, and copied twice; the cut nobody could match; the
   one system where a fact is born, the matrix of what each system creates or copies, a home and an owner for each fact, the line back
   from every copy; the three records of one cut, which are three facts; the customer who has to be born in two places; and the data
   practice on the map. Everything is drawn to read on a phone: text at least 28 px in the frame, unless it's marked as texture. */

/* ---------- from the series' other films: their helpers, copied, so the series' kit doesn't change ---------- */
// the story's room: Chile at night, in lamp-light, a dark blue-grey with a warm haze near the ground, and dust in the air (film 2's)
function d3_night(ctx,S,t){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10151f");g.addColorStop(0.62,"#181d29");g.addColorStop(1,"#26201b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  glow(ctx,960,1180,900,CY_LAMP,0.06);motes(ctx,t,{col:CY_LAMP,a:0.6,n:40});}
// a card in the story: a name and a line under it, on dark glass in lamp-light (film 2's)
function d3_card(ctx,x,y,w,title,sub,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=sub?124:76;if(!w)w=Math.max(tw(ctx,title,o.size||36,800),sub?tw(ctx,sub,28,600):0)+60;glass(ctx,x,y,w,h,18,o.col||CY_LAMP,{glow:14+12*(o.hi||0),ea:0.75,fill:"rgba(20,16,12,0.92)"});
  T(ctx,title,x+28,y+50,{w:800,size:o.size||36,color:rgba(o.col||CY_LAMP,1)});if(sub)T(ctx,sub,x+28,y+96,{w:600,size:28,color:rgba(INK,0.92)});});}
// one line torn from the telex's paper: what a factory sent that day, typed in capitals (film 2's); o.copy (0..1) draws it as a copy,
// its paper paler, and o.star (0..1) marks it born where it was typed
function d3_strip(ctx,x,y,w,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||96,cp=o.copy||0;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle=cp>0.01?"rgb("+mix([239,230,207],[200,198,190],cp).map(Math.round).join(",")+")":CY_PAPER;ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowColor="transparent";
  // the paper's torn edges, top and bottom
  ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<w;i+=14){ctx.fillRect(-w/2+i,-h/2,7,2+hash(i,7)*3);ctx.fillRect(-w/2+i+5,h/2-3,7,2+hash(i,9)*3);}
  T(ctx,s,-w/2+30,(o.size||34)*0.36,{f:"mono",w:500,size:o.size||34,color:rgba(CY_INK,0.95-0.2*cp)});
  if(o.sig>0.01){ctx.strokeStyle=rgba(o.scol||CY_SIG,o.sig);ctx.lineWidth=4;ctx.strokeRect(-w/2+3,-h/2+3,w-6,h-6);}
  ctx.restore();if(o.star>0.01)d3_star(ctx,x+w+4,y+4,22,o.star,{hi:o.starHi||0});});}
// a chart of one factory's number, day by day, as the software watched it (film 2's d2_ind): n slots, vals for the days drawn so far,
// the factory's normal as a band; o.p (0..1) the days shown; o.band (0..1) the normal
function d3_indXY(x,y,w,h,n,i,v){const ix=x+28,iw=w-56,iy=y+70,ih=h-96;return[ix+iw*(i+0.5)/n,iy+ih*(1-v)];}
function d3_ind(ctx,x,y,w,h,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const[b0,b1]=o.range||[0.36,0.66],n=o.n||vals.length,p=o.p==null?1:o.p,bA=o.band==null?1:o.band;
  glass(ctx,x,y,w,h,16,CY_ANDES,{glow:10,ea:0.7,fill:"rgba(10,12,18,0.92)"});const ix=x+28,iw=w-56,iy=y+70,ih=h-96;
  if(o.title)T(ctx,o.title,x+28,y+48,{w:700,size:30,color:rgba(INK,0.95)});
  if(bA>0.01)withA(ctx,bA,()=>{ctx.fillStyle=rgba(CY_ANDES,0.16);ctx.fillRect(ix,iy+ih*(1-b1),iw,ih*(b1-b0));ctx.strokeStyle=rgba(CY_ANDES,0.45);ctx.setLineDash([6,6]);ctx.lineWidth=1.6;
    [b0,b1].forEach(b=>{ctx.beginPath();ctx.moveTo(ix,iy+ih*(1-b));ctx.lineTo(ix+iw,iy+ih*(1-b));ctx.stroke();});ctx.setLineDash([]);
    T(ctx,"normal",ix+iw-8,iy+ih*(1-b1)-14,{w:700,size:28,align:"right",color:rgba(CY_ANDES,1)});});
  const P=vals.map((v,i)=>d3_indXY(x,y,w,h,n,i,v)),q=i=>clamp(p*vals.length-i,0,1);
  ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;for(let i=1;i<vals.length;i++){const k=q(i);if(k<=0)break;ctx.beginPath();ctx.moveTo(P[i-1][0],P[i-1][1]);ctx.lineTo(lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k));ctx.stroke();}
  P.forEach(([px,py],i)=>{const k=q(i);if(k<=0.01)return;withA(ctx,k,()=>{ctx.fillStyle=rgba(INK,0.85);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();});});});}
// a clock face, for time going by while someone waits; p (0..1) sweeps its hand round once (film 2's)
function d3_clock(ctx,x,y,r,p,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(20,16,12,0.92)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,CY_LAMP,0.9,3);
  for(let i=0;i<12;i++){const q=i/12*TAU;ctx.strokeStyle=rgba(CY_LAMP,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+Math.sin(q)*r*0.78,y-Math.cos(q)*r*0.78);ctx.lineTo(x+Math.sin(q)*r*0.9,y-Math.cos(q)*r*0.9);ctx.stroke();}
  if(p>0.001){ctx.fillStyle=rgba(CY_LAMP,0.22);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r*0.74,-Math.PI/2,-Math.PI/2+TAU*clamp(p,0,1));ctx.closePath();ctx.fill();}
  const q=TAU*clamp(p,0,1);ctx.strokeStyle=rgba(CY_LAMP,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(q)*r*0.7,y-Math.cos(q)*r*0.7);ctx.stroke();ctx.lineCap="butt";});}
// a measure, as The map before the data drew one: a card with a dial, its name and its value; v (0..1) moves the needle (film 2's)
function d3_dial(ctx,x,y,w,name,val,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||150;glass(ctx,x,y,w,h,18,o.col||BUSC,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(16,14,8,0.94)"});
  const cx=x+80,cy=y+h/2+22,r=46;ctx.strokeStyle=rgba(o.col||BUSC,0.5);ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,TAU);ctx.stroke();
  const q=Math.PI+Math.PI*clamp(o.v==null?0.45:o.v,0,1);ctx.strokeStyle=rgba(INK,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(q)*r*0.9,cy+Math.sin(q)*r*0.9);ctx.stroke();ctx.lineCap="butt";
  wrapT(ctx,name,x+150,y+52,w-180,{size:30,w:700,color:rgba(INK,0.95),lh:38});if(val)T(ctx,val,x+150,y+h-28,{f:"mono",w:500,size:34,color:rgba(mix(o.col||BUSC,INK,0.3),1)});});}
// a definition card, typed as it's said: its kicker, then its words; its size is the whole text's, so nothing moves as it types (film 2's)
function d3_def(ctx,x,y,w,kicker,text,p,a,o){o=o||{};const sz=o.size||30,ls=wrapT(ctx,text,0,0,w-48,{size:sz,w:700,measure:true}),h=84+ls.length*sz*1.25,col=o.col||INFC;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});T(ctx,kicker,x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});
    let n=Math.round(clamp(p,0,1)*text.length);ls.forEach((l,i)=>{if(n<=0)return;T(ctx,l.slice(0,n),x+24,y+88+i*sz*1.25,{w:700,size:sz});n-=l.length+1;});});return h;}

/* ---------- this film's own: born here, a copy, a line back ---------- */
// born here: a small gold star, as the film's legend says; o.pop (0..) a spring as it lands; o.hi lights it
function d3_star(ctx,x,y,r,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.4,TRUST,0.32+0.3*(o.hi||0));ctx.save();ctx.translate(x,y);const k=o.pop==null?1:o.pop;ctx.scale(k,k);ctx.beginPath();
  for(let i=0;i<10;i++){const q=-Math.PI/2+i*Math.PI/5,d=i%2?r*0.45:r;i?ctx.lineTo(Math.cos(q)*d,Math.sin(q)*d):ctx.moveTo(Math.cos(q)*d,Math.sin(q)*d);}ctx.closePath();
  ctx.fillStyle=rgba(mix(TRUST,[255,240,200],0.35*(o.hi||0)),1);ctx.fill();ctx.strokeStyle="rgba(70,52,12,0.7)";ctx.lineWidth=1.6;ctx.stroke();ctx.restore();});}
// the width of the utility's record cards
const D3_CW=520;
// a record in one system, on a card of glass: the system's name, the record's name and its fields, one under another. o.star (0..1):
// born here, with a gold star; o.copy (0..1): a copy, drawn fainter, with "copy" where the star would be. o.f: its fields, each a
// string or a list of [text, alpha, colour] drawn on the same line, for a field that changes (the old one leaves, then the new one
// comes); o.rows: how many fields its height has room for (a number that grows, so a new field opens its gap before it's written);
// o.name2: [name, m], the record's name changing to another as m goes to 1. Returns its height
function d3_recH(n){return 118+n*44;}
function d3_rec(ctx,x,y,sys,name,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||D3_CW,F=o.f||[],n=o.rows==null?F.length:o.rows,h=d3_recH(n),cp=o.copy||0,col=o.col||APPC;if(a<=0.01)return h;
  withA(ctx,a*(1-0.22*cp),()=>{glass(ctx,x,y,w,h,16,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(7,12,24,0.94)"});
    T(ctx,sys,x+26,y+44,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});
    const nm=o.name2?[[name,clamp(1-2*o.name2[1],0,1)],[o.name2[0],clamp(2*o.name2[1]-1,0,1)]]:[[name,1]];
    nm.forEach(([s,q])=>{if(q>0.01)withA(ctx,q,()=>T(ctx,s,x+26,y+92,{w:800,size:32,color:rgba(INK,0.97)}));});
    F.forEach((row,i)=>{const vs=typeof row==="string"?[[row,1]]:Array.isArray(row[0])?row:[row];vs.forEach(([s,fa,fc])=>{if(fa==null)fa=1;if(fa<=0.01)return;
      withA(ctx,fa,()=>T(ctx,s,x+26,y+140+i*44,{f:"mono",w:500,size:28,color:rgba(fc||INK,0.92)}));});});
    if(o.star>0.01)d3_star(ctx,x+w-44,y+42,19,o.star,{hi:o.starHi||0,pop:o.pop});
    if(cp>0.01)withA(ctx,cp,()=>{const cw=tw(ctx,"copy",28,700)+26;tag(ctx,x+w-22-cw,y+42,"copy",SOFT,{size:28});});});
  return h;}
// a field that changes: the old text leaves, then the new one comes, as m goes from 0 to 1, so the two never show at once
function d3_swap(s0,s1,m,c0,c1){return[[s0,clamp(1-2*m,0,1),c0],[s1,clamp(2*m-1,0,1),c1]];}
// a copy being made: a pale outline of the card it's copied from, moving to where the copy will be, as p goes from 0 to 1
function d3_ghost(ctx,x0,y0,x1,y1,w,h,p){if(p<=0||p>=1)return;const u=ease(p);withA(ctx,Math.sin(Math.PI*p)*0.8,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2.4;ctx.setLineDash([8,8]);
  rr(ctx,lerp(x0,x1,u),lerp(y0,y1,u),w,h,16);ctx.stroke();ctx.restore();});}
// a copy's line back to where it was born: dashed, in the information layer's colour, from the copy (x0, y0) to its home (x1, y1),
// with an arrowhead at the home; o.label: which record, and when it was copied, on a chip at its middle (o.la its alpha); o.run (0..1)
// sends a light along it, from home to the copy, as a correction reaches it
function d3_back(ctx,x0,y0,x1,y1,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||p<=0.01)return;withA(ctx,a,()=>{arrowTo(ctx,x0,y0,x1,y1,mix(INFC,INK,0.15),0.92,{p,dash:[9,8],lw:2.8,bend:o.bend||0});
  const r=o.run;if(r>0&&r<1){const bend=o.bend||0,mx=(x0+x1)/2-(y1-y0)*bend,my=(y0+y1)/2+(x1-x0)*bend,u=1-r,bx=(1-u)*(1-u)*x0+2*(1-u)*u*mx+u*u*x1,by=(1-u)*(1-u)*y0+2*(1-u)*u*my+u*u*y1;
    glow(ctx,bx,by,26,INFC,0.7*Math.sin(Math.PI*r));}
  if(o.label&&(o.la==null||o.la>0.01))withA(ctx,(o.la==null?1:o.la)*clamp(p*2-1,0,1),()=>tag(ctx,o.lx==null?(x0+x1)/2:o.lx,o.ly==null?(y0+y1)/2:o.ly,o.label,INFC,{align:"center",size:28}));});}
// a verdict on a chip: a gold tick and its words, or a red cross
function d3_verdict(ctx,x,y,s,ok,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+86,col=ok?TRUST:BAD;glass(ctx,x,y-30,w,60,30,col,{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(16,12,10,0.94)"});
  if(ok)kt_gtick(ctx,x+30,y,14,1);else kt_rcross(ctx,x+30,y,14,1);T(ctx,s,x+56,y+10,{w:700,size:28,color:rgba(mix(col,INK,0.35),1)});});}

/* ---------- 1. From the factory itself ---------- */
// Chile's long table of pictures, left to right, each 1920 px wide: the network and the free telex (A), the software and the figures
// that mislead it (B), the mill and the numbers it sends (C), born at the mill and copied in Santiago (D)
const D3_B=1920,D3_C=3840,D3_D=5760;
// the mill's cotton in stock, day by day, in days of work: then today's, well under its normal; and the figure from anywhere else,
// which sits inside it
const D3_DAYS=[0.55,0.5,0.58,0.52,0.47,0.56,0.6,0.5,0.54,0.46,0.57,0.51,0.53],D3_TODAY=0.1,D3_WRONG=0.52,D3_N=14;
// the people the reminders went to, and the days they went on: a strip a day, each a little lower than the last
const D3_REMIND=["PLEASE SEND TODAY'S FIGURES","PLEASE SEND TODAY'S FIGURES","PLEASE SEND TODAY'S FIGURES"];
// the factories whose numbers Santiago read, at the end: the mill and two more, each with its strip
const D3_FACT=[["the mill","COTTON IN STOCK   2 DAYS"],["the cement works","CEMENT MADE   310 T"],["the foundry","WORKERS ABSENT   12"]];

/* ---------- the utility's wall ---------- */
// the places on the wall: Q, Quarry Lane, at the origin; M, the matrix, to its right; T, the three records, under Q; P, the map, under M
const D3_X2=1920,D3_Y1=1110;
// at Q: the four systems' cards (billing and the network map above, the two that copy them below), the house between them, the
// calendar over it and Grace's measure under it
const D3_BL=[60,120],D3_NM=[1340,120],D3_CS=[60,560],D3_OU=[1340,560],D3_HOUSE=[960,560],D3_HS=1.2,D3_CAL=[840,20],D3_DIAL=[680,630];
// a new home, as the films draw a building: new render, a tiled roof, two windows up and one down by the door, and the meter in its
// box beside the door; o.lit (0..1) the windows lit, as when the power is on; o.meter (0..1) lights the meter's little window
function d3_house(ctx,cx,by,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(cx,by);ctx.scale(s,s);
  ctx.fillStyle="rgba(70,82,58,0.6)";rr(ctx,-176,-6,352,12,6);ctx.fill();
  const g=ctx.createLinearGradient(-130,-150,130,0);g.addColorStop(0,"#d6c9b0");g.addColorStop(1,"#9e8e74");ctx.fillStyle=g;ctx.fillRect(-128,-148,256,148);
  ctx.fillStyle="#3a3236";ctx.beginPath();ctx.moveTo(-150,-144);ctx.lineTo(0,-212);ctx.lineTo(150,-144);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=2;for(let i=1;i<4;i++){const yy=-144-i*17,hw=150*(1-i*17/68);ctx.beginPath();ctx.moveTo(-hw,yy);ctx.lineTo(hw,yy);ctx.stroke();}
  const win=(x,y)=>{ctx.fillStyle=rgba(mix([34,38,48],CY_LAMP,lit),1);ctx.fillRect(x,y,46,40);ctx.strokeStyle="rgba(70,58,46,0.95)";ctx.lineWidth=3;ctx.strokeRect(x,y,46,40);ctx.beginPath();ctx.moveTo(x+23,y);ctx.lineTo(x+23,y+40);ctx.stroke();};
  win(-100,-126);win(54,-126);win(-100,-62);
  ctx.fillStyle="#4a3428";ctx.fillRect(18,-68,44,68);ctx.fillStyle="rgba(230,200,140,0.85)";ctx.beginPath();ctx.arc(52,-34,3,0,TAU);ctx.fill();
  ctx.fillStyle="#2c3036";rr(ctx,80,-66,28,34,3);ctx.fill();ctx.fillStyle=rgba(mix([60,70,80],TECH,o.meter||0),1);ctx.fillRect(85,-59,18,9);
  ctx.restore();if(lit>0.01)glow(ctx,cx,by-80*s,170*s,CY_LAMP,0.12*lit*a);});}
// a calendar's page: the month, large, under a red strip; months: [[name, alpha], ...] drawn on the same page, for a month that turns
function d3_cal(ctx,x,y,months,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=240,h=170;sheet(ctx,x,y,w,h,{rot:-0.015,fill:CY_PAPER});ctx.fillStyle="rgba(150,52,40,0.9)";ctx.fillRect(x,y,w,48);
  for(let k=0;k<5;k++){ctx.fillStyle="#2a2624";ctx.beginPath();ctx.arc(x+40+k*40,y+9,5,0,TAU);ctx.fill();}
  T(ctx,"month",x+w/2,y+36,{f:"mono",w:500,size:28,align:"center",color:"rgba(250,240,225,0.95)"});
  months.forEach(([nm,q])=>{if(q>0.01)withA(ctx,q,()=>T(ctx,nm,x+w/2,y+124,{w:800,size:daFit(ctx,nm,46,800,w-36),align:"center",color:"rgba(46,42,40,0.95)"}));});});}
// the months a page shows as the story goes, each turning to the next at its moment: ts[i] is when month i comes
function d3_months(t,names,ts){return names.map((nm,i)=>{const on=i===0?1:fin(t,ts[i]-0.15,0.3),off=i<names.length-1?fin(t,ts[i+1]-0.45,0.3):0;return[nm,on*(1-off)];});}
// the family's sign-up form, on paper: who, and the address they gave; p1, p2 write them; hi rings the address
function d3_form(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=440,h=230;sheet(ctx,x,y,w,h,{rot:0.012,fill:"#f2ead6"});
  T(ctx,"sign-up form",x+28,y+52,{w:800,size:30,color:"rgba(46,42,40,0.95)"});ctx.fillStyle="rgba(46,42,40,0.25)";ctx.fillRect(x+28,y+68,w-56,2);
  T(ctx,"name",x+28,y+118,{w:600,size:28,color:"rgba(90,84,80,0.95)"});pencilText(ctx,"A. Mendoza",x+160,y+118,{size:30,w:700,p:o.p1==null?1:o.p1});
  T(ctx,"address",x+28,y+178,{w:600,size:28,color:"rgba(90,84,80,0.95)"});pencilText(ctx,"14 Quarry Lane",x+160,y+178,{size:30,w:700,p:o.p2==null?1:o.p2});
  if(o.hi>0.01){ctx.save();ctx.strokeStyle=rgba(CY_SIG,o.hi);ctx.lineWidth=3;rr(ctx,x+148,y+144,262,50,8);ctx.stroke();ctx.restore();}});}
// a phone call, as a bubble: what the family said
function d3_call(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+96;glass(ctx,x,y,w,64,32,[150,220,190],{glow:10,ea:0.8,fill:"rgba(10,22,20,0.94)"});
  ctx.save();ctx.translate(x+34,y+32);ctx.strokeStyle=rgba([150,220,190],1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.arc(0,0,11,Math.PI*0.75,Math.PI*1.75);ctx.stroke();ctx.restore();
  T(ctx,s,x+62,y+42,{w:700,size:28,color:rgba(INK,0.95)});});}
// how many new homes were created twice last year
function d3_twice(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=620,h=170;glass(ctx,x,y,w,h,18,BAD,{glow:12+12*(o.hi||0),ea:0.75,fill:"rgba(18,10,10,0.94)"});
  T(ctx,"last year",x+30,y+46,{f:"mono",w:500,size:28,color:rgba(mix(BAD,INK,0.3),1)});T(ctx,"214 of 1,160",x+30,y+104,{w:800,size:52,color:rgba(INK,0.97)});
  T(ctx,"new homes, created twice",x+30,y+148,{w:700,size:30,color:rgba(mix(BAD,INK,0.45),1)});});}

// The Quarry Lane wall, as one picture: the scenes give it its state. o.cal: [[month, alpha], ...]; o.house: {a, lit, plate, meter};
// o.form: {a, p1, p2, hi}; o.bl, o.nm, o.cs, o.ou: each card's options for d3_rec (a, star, copy, f, rows, hi, name2); o.toBl, o.toNm
// (0..1): the lines from the house to the two records it has; o.gh: copies being made [[from, to, p], ...]; o.back: lines back
// {cs, ou, bl: [p, run, labelAlpha]}; o.dial: {a, hi, tag, tagA, tagCol, tr: [p1, p2]}; o.tags: [[text, x, y, colour, alpha, align]];
// o.call: alpha of the family's call; o.twice: {a, hi}
const D3_BLsys=["billing","premise"],D3_NMsys=["network map","service point"],D3_CSsys=["customer service","supply address"],D3_OUsys=["outage system","service location"];
function d3_Q(ctx,t,o){o=o||{};
  if(o.cal)d3_cal(ctx,D3_CAL[0],D3_CAL[1],o.cal,o.calA==null?1:o.calA);
  const h=o.house||{};if(h.a>0.01){d3_house(ctx,D3_HOUSE[0],D3_HOUSE[1],D3_HS,h);withA(ctx,h.a*(h.plate||0),()=>tag(ctx,D3_HOUSE[0],D3_HOUSE[1]+36,"14 Quarry Lane",SOFT,{align:"center",size:30}));}
  // the lines from the house to the records it has, one in each system
  const hx=D3_HOUSE[0],hy=D3_HOUSE[1]-140,ty=o.toY==null?130:o.toY;
  if(o.toBl>0.01)arrowTo(ctx,hx-180,hy,D3_BL[0]+D3_CW+12,D3_BL[1]+ty,DAC,0.85,{p:o.toBl,lw:2.6,bend:-0.08});
  if(o.toNm>0.01)arrowTo(ctx,hx+180,hy,D3_NM[0]-12,D3_NM[1]+ty,DAC,0.85,{p:o.toNm,lw:2.6,bend:0.08});
  const f=o.form;if(f&&f.a>0.01)d3_form(ctx,D3_CS[0],D3_CS[1],f.a,f);
  // the lines back, under the cards: customer service's to billing, the outage system's and billing's to the network map
  const b=o.back||{};
  if(b.cs)d3_back(ctx,D3_CS[0]+260,D3_CS[1]-4,D3_BL[0]+260,D3_BL[1]+(o.blH||d3_recH(3))+6,b.cs[0],{run:b.cs[1],label:"CP-0061420 · 06:10",la:b.cs[2]});
  if(b.ou)d3_back(ctx,D3_OU[0]+260,D3_OU[1]-4,D3_NM[0]+260,D3_NM[1]+d3_recH(2)+6,b.ou[0],{run:b.ou[1],label:"CP-0061420 · 06:05",la:b.ou[2]});
  if(b.bl)d3_back(ctx,D3_BL[0]+D3_CW+6,276,D3_NM[0]-6,276,b.bl[0],{run:b.bl[1],label:"CP-0061420 · 06:00",la:b.bl[2]});
  const card=(pos,sy,c)=>{if(c&&(c.a==null||c.a>0.01))d3_rec(ctx,pos[0],pos[1],sy[0],sy[1],c);};
  card(D3_BL,D3_BLsys,o.bl);card(D3_NM,D3_NMsys,o.nm);card(D3_CS,D3_CSsys,o.cs);card(D3_OU,D3_OUsys,o.ou);
  (o.gh||[]).forEach(([A,B,p,hh])=>d3_ghost(ctx,A[0],A[1],B[0],B[1],D3_CW,hh||d3_recH(2),p));
  if(o.call>0.01)d3_call(ctx,640,650,"no power at 14 Quarry Lane",o.call);
  const d=o.dial;if(d&&d.a>0.01){d3_dial(ctx,D3_DIAL[0],D3_DIAL[1],560,"interruptions per customer, per year","1.4",d.a,{h:150,hi:d.hi||0});
    if(d.tag)withA(ctx,d.a*(d.tagA==null?1:d.tagA),()=>tag(ctx,D3_DIAL[0]+280,D3_DIAL[1]+190,d.tag,d.tagCol||BAD,{align:"center",size:28}));
    // the measure's own lines back: each interruption to the outage system's record, each customer to an account in billing
    if(d.tr){const[p1,p2]=d.tr;arrowTo(ctx,D3_DIAL[0]+566,D3_DIAL[1]+75,D3_OU[0]-8,D3_DIAL[1]+75,DAC,0.9,{p:p1,dash:[8,8],lw:2.6});
      arrowTo(ctx,D3_DIAL[0]+40,D3_DIAL[1]-6,D3_BL[0]+D3_CW-80,D3_BL[1]+d3_recH(3)+8,DAC,0.9,{p:p2,dash:[8,8],lw:2.6,bend:0.1});}}
  (o.tags||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});
  if(o.twice&&o.twice.a>0.01)d3_twice(ctx,650,640,o.twice.a,o.twice);}

/* ---------- 3. Where it's born ---------- */
// the matrix Inés draws, at M: what each system does with each thing. "c": creates it (a gold star), "k": keeps a copy, "": neither
const D3_SYS=["network map","billing","customer service","outage system"];
const D3_ROWS=[["connection point",["c","c","k","k"]],["account",["","c","k","k"]],["customer",["","c","c",""]],["interruption",["","","k","c"]]];
// its place: the row names' column from x 80, 330 wide; then a column a system, 300 wide; the systems' names over them; a row 120 high
const D3_MX=80,D3_ML=330,D3_MCW=300,D3_MHY=110,D3_MRY=196,D3_MRH=120;
const d3_cellX=j=>D3_MX+D3_ML+j*D3_MCW+D3_MCW/2,d3_rowY=i=>D3_MRY+i*D3_MRH;
// what a cell shows: "c" a star and "creates", "h" a star and "home", "k" "copy", "" a faint dot; kinds: [[kind, alpha], ...] on the
// same cell, for a cell that changes; o.own: [name, alpha], the owner's chip under it
function d3_cell(ctx,i,j,kinds,o){o=o||{};const cx=d3_cellX(j),cy=d3_rowY(i)+D3_MRH/2-(o.own&&o.own[1]>0.01?18*clamp(o.own[1]*2,0,1):0);
  kinds.forEach(([k,q])=>{if(q<=0.01)return;withA(ctx,q,()=>{
    if(k==="c"||k==="h"){const s=k==="c"?"creates":"home",w=tw(ctx,s,28,800)+44;d3_star(ctx,cx-w/2+14,cy-8,15,1,{hi:o.hi||0});T(ctx,s,cx-w/2+40,cy+2,{w:800,size:28,color:rgba(k==="h"?TRUST:mix(TRUST,INK,0.45),1)});}
    else if(k==="k")T(ctx,"copy",cx,cy+2,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});
    else{ctx.fillStyle=rgba(SOFT,0.35);ctx.beginPath();ctx.arc(cx,cy-8,4,0,TAU);ctx.fill();}});});
  if(o.own&&o.own[1]>0.01){const s=o.own[0],w=tw(ctx,s,28,700)+70;daOwner(ctx,cx-w/2,cy+50,s,{a:o.own[1],hi:o.ownHi||0});}
  if(o.ring>0.01)ring(ctx,cx,d3_rowY(i)+D3_MRH/2,o.rr||118,TRUST,o.ring,3);}
// the matrix: o.a; o.head (0..1) the systems' names; o.row(i) (0..1) row i's name; o.cells(i, j) (0..1) each cell, in turn;
// o.kind(i, j): the cell's kinds, when it changes; o.cellO(i, j): its other options; o.verdict(i): [text, ok, alpha] under the row's
// name; o.box(i): [colour, alpha] round the whole row; o.hiRow(i)
function d3_matrix(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(D3_X2,0);const x0=D3_MX,x1=D3_MX+D3_ML+4*D3_MCW,yb=d3_rowY(4);
  // the grid, faint: a line under the names, and between the columns
  withA(ctx,o.grid==null?1:o.grid,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.28);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0,D3_MRY-4);ctx.lineTo(x1,D3_MRY-4);
    for(let j=0;j<4;j++){const x=D3_MX+D3_ML+j*D3_MCW;ctx.moveTo(x,D3_MHY+20);ctx.lineTo(x,yb);}for(let i=1;i<4;i++){ctx.moveTo(x0,d3_rowY(i));ctx.lineTo(x1,d3_rowY(i));}ctx.stroke();ctx.restore();});
  D3_SYS.forEach((s,j)=>withA(ctx,o.head==null?1:typeof o.head==="function"?o.head(j):o.head,()=>{const hi=o.hiCol?o.hiCol(j):0;T(ctx,s,d3_cellX(j),D3_MHY+56,{w:700,size:30,align:"center",color:rgba(mix(mix(APPC,INK,0.4),TRUST,0.6*hi),1)});}));
  D3_ROWS.forEach(([name,cells],i)=>{const ra=o.row?o.row(i):1;if(ra<=0.01)return;const y=d3_rowY(i),bx=o.box?o.box(i):null;
    if(bx&&bx[1]>0.01){ctx.save();ctx.globalAlpha*=bx[1];ctx.strokeStyle=rgba(bx[0],0.95);ctx.lineWidth=3;rr(ctx,x0-12,y+6,x1-x0+24,D3_MRH-12,16);ctx.stroke();ctx.fillStyle=rgba(bx[0],0.06);ctx.fill();ctx.restore();}
    const vd=o.verdict?o.verdict(i):null,vq=vd?vd.reduce((m,v)=>Math.max(m,v[2]),0):0;
    withA(ctx,ra,()=>T(ctx,name,x0+20,y+D3_MRH/2+10-22*clamp(vq*2,0,1),{w:800,size:30,color:rgba(INK,0.97)}));
    if(vd)vd.forEach(([s,ok,q])=>{if(q>0.01)withA(ctx,q,()=>T(ctx,s,x0+20,y+D3_MRH/2+38,{w:700,size:28,color:rgba(ok?TRUST:BAD,1)}));});
    cells.forEach((k,j)=>{const q=o.cells?o.cells(i,j):1;if(q<=0.01)return;withA(ctx,q,()=>d3_cell(ctx,i,j,o.kind?o.kind(i,j)||[[k,1]]:[[k,1]],o.cellO?o.cellO(i,j)||{}:{}));});});ctx.restore();});}

/* ---------- 6. Three records, three facts ---------- */
// at T: the outage system's interruption above, the meter's event and the family's call below it, and Grace's measure to the right
const D3_T_OU=[700,140],D3_T_ME=[120,520],D3_T_CS=[1280,520],D3_T_DI=[1320,150];

/* ---------- 7. Two places, one person ---------- */
// the data practice on the map, at P: the business layer with the connection point and the account, each with its owner; the
// information layer with the data objects that record them, each naming its home (a star) or a copy, with its line back
const D3_DO=[["service point","network map",true],["premise","billing",false],["service location","outage system",false],["account","billing",true],["account","customer service",false]];
const D3_DOX=[60,427,794,1161,1528],D3_DOW=330;
function d3_map(ctx,o){o=o||{};const X=D3_X2,Y=D3_Y1,a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  withA(ctx,o.band==null?1:o.band,()=>{tag(ctx,X+960,Y+36,"the data practice on the map",DAC,{align:"center",size:30});
    ctx.save();ctx.fillStyle=rgba(BUSC,0.07);ctx.strokeStyle=rgba(BUSC,0.55);ctx.lineWidth=2;rr(ctx,X+40,Y+74,1840,250,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,X+64,Y+74,"business",BUSC,{size:28});
    ctx.save();ctx.fillStyle=rgba(INFC,0.07);ctx.strokeStyle=rgba(INFC,0.55);ctx.lineWidth=2;rr(ctx,X+40,Y+356,1840,470,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,X+64,Y+356,"information",INFC,{size:28});});
  // the business objects, and who owns each
  daBO(ctx,X+120,Y+112,440,128,"connection point",{a:o.bo==null?1:o.bo,size:32,hi:o.boHi||0});
  daOwner(ctx,X+590,Y+176,"Grace · network operations",{a:o.own==null?1:o.own,hi:o.ownHi||0});
  daBO(ctx,X+1180,Y+112,380,128,"account",{a:o.bo==null?1:o.bo,size:32,hi:o.boHi||0});
  daOwner(ctx,X+1590,Y+176,"head of retail",{a:o.own==null?1:o.own,hi:o.ownHi||0});
  // the data objects: the homes realise their business object (the service point's line rises right of the band's name); each copy keeps a line back to its home, under the band's middle
  const dy=Y+420,dh=118;D3_DO.forEach(([n,s,home],k)=>{const q=o.dos?o.dos(k):1;if(q<=0.01)return;const x=X+D3_DOX[k];
    withA(ctx,q*(home?1:0.78),()=>{daDO(ctx,x,dy,D3_DOW,dh,n,s,{size:30,hi:(o.doHi?o.doHi(k):0)});});
    withA(ctx,q*(o.mark==null?1:o.mark),()=>{if(home)d3_star(ctx,x+D3_DOW-26,dy-4,17,1,{hi:o.starHi||0});else{const cw=tw(ctx,"copy",28,700)+26;tag(ctx,x+D3_DOW-cw-4,dy-4,"copy",SOFT,{size:28});}});});
  const rl=o.real==null?1:o.real;daReal(ctx,X+D3_DOX[0]+240,dy,X+340,Y+240,rl,{a:o.dos?o.dos(0):1});daReal(ctx,X+D3_DOX[3]+170,dy,X+1340,Y+240,rl,{a:o.dos?o.dos(3):1});
  // the lines back: the premise and the service location to the service point; customer service's account to billing's
  const lb=o.lines==null?1:o.lines,run=o.run||0,under=dy+dh+8;
  [[1,0,-0.3],[2,0,-0.3],[4,3,-0.3]].forEach(([c,hm,bd],k)=>{const p=typeof lb==="function"?lb(k):lb;if(p<=0.01)return;
    d3_back(ctx,X+D3_DOX[c]+D3_DOW/2,under,X+D3_DOX[hm]+D3_DOW/2+30*(k===1?1:0),under,p,{bend:bd,run:typeof run==="function"?run(k):run});});
  withA(ctx,o.lineTag==null?1:o.lineTag,()=>tag(ctx,X+960,Y+770,"each copy, a line back to its home",INFC,{align:"center",size:28}));});}
