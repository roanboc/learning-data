/* ===== Rules with a home: the film's own pictures (prefixed d9_, from the film's place in The map before the data) =====
   Khorasan, in the ninth century: the plain from above, with a new qanat dug too close beside an old one, and the old village's fields
   gone dry; Nishapur, the governor's court, with the law books in a niche, the table where the book on qanats is written, and the
   book itself. At the utility, on the wall and on the films' dark glass: day one's data rule and the bill of $412.80; the household
   away in June and its meter's stored readings; the nightly script on the wall between the network and retail, writing to a queue
   nothing reads; the rule in five places; the rule split in two, one on each side, joined by what crosses; where each comes from;
   what it's about; the step it's attached to and what that step expects of the data; the rule in a set form, with the checks
   generated from it; and the concepts, relationships and rules, generally an ontology. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what fails; green, for a job that ran
const D9_NET=[132,176,255],D9_RET=[255,150,186],D9_RED=[232,96,84],D9_OK=[120,210,130];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d9_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a note should keep on one line
const d9_nb=s=>s.replace(/ /g," ");

/* ---------- Khorasan, in the ninth century ---------- */
// The plain from above, as the series draws a qanat (ba_aerial), with a second one beside the first: a new tunnel, its head dug close
// beside the old one's, running close beside it before it turns down to an outlet of its own and four new fields, below the old
// village's. Its shafts as the kit draws them, a ring of dug earth and a dark mouth, dug from the outlet up.
const D9_CH2=(()=>{const p=[[404,384],[640,480],[860,560],[930,800]],P=[];for(let i=0;i<=15;i++){const u=i/15,v=1-u;P.push([0,1].map(k=>v*v*v*p[0][k]+3*v*v*u*p[1][k]+3*v*u*u*p[2][k]+u*u*u*p[3][k]));}return P;})();
const D9_F2=[[958,826,108,78],[1078,826,108,78],[958,914,108,78],[1078,914,108,78]];
// the lamps' warm light, in the governor's court
const D9_LAMP=[255,204,140];
// one shaft: a ring of dug earth, its shadow to the lower right, and a dark mouth
function d9_shaft(ctx,x,y,r){if(r<=0.5)return;ctx.fillStyle="rgba(60,40,26,0.28)";ctx.beginPath();ctx.ellipse(x+4,y+5,r*1.15,r,0,0,TAU);ctx.fill();
  const rg=ctx.createRadialGradient(x-r*0.3,y-r*0.3,1,x,y,r*1.1);rg.addColorStop(0,"rgba(236,204,160,1)");rg.addColorStop(1,"rgba(184,140,98,1)");ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(34,22,16,0.92)";ctx.beginPath();ctx.arc(x,y,r*0.34,0,TAU);ctx.fill();}
// the water under the plain, running down a chain of shafts to its outlet: the tunnel's line in blue, with lights moving down it (a)
function d9_seep(ctx,t,P,a){if(a<=0.01)return;const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const D=L[L.length-1];
  const at=d=>{let i=1;while(i<L.length-1&&L[i]<d)i++;const f=clamp((d-L[i-1])/((L[i]-L[i-1])||1),0,1);return[lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f)];};
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(BA_WATER,0.45);ctx.lineWidth=4;ctx.beginPath();P.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
    const n=Math.round(D/64);for(let k=0;k<n;k++){const[x,y]=at((t*44+k*D/n)%D);glow(ctx,x,y,13,BA_WATER,0.6);}});}
// the new qanat: its fields and channel (o.dug brings them in, dry; o.flow waters them), then its shafts, dug from the outlet up to
// o.dug; o.hi lights its head and the old one's, side by side
function d9_chain2(ctx,t,o){o=o||{};const dug=o.dug||0,n=D9_CH2.length,fl=o.flow||0,fa=clamp(dug*3,0,1);if(dug<=0)return;
  withA(ctx,fa,()=>{const CH=[D9_CH2[n-1],[946,812],[1196,812]];ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(96,64,40,0.6)";ctx.lineWidth=12;ctx.beginPath();CH.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
    if(fl>0.01){const L=[0];for(let i=1;i<CH.length;i++)L.push(L[i-1]+Math.hypot(CH[i][0]-CH[i-1][0],CH[i][1]-CH[i-1][1]));let left=L[L.length-1]*fl;ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=7;ctx.shadowColor=rgba(BA_WATER,0.6);ctx.shadowBlur=10;
      ctx.beginPath();ctx.moveTo(CH[0][0],CH[0][1]);for(let i=1;i<CH.length&&left>0;i++){const d=L[i]-L[i-1],f=Math.min(1,left/d);ctx.lineTo(lerp(CH[i-1][0],CH[i][0],f),lerp(CH[i-1][1],CH[i][1],f));left-=d;}ctx.stroke();}
    ctx.restore();
    D9_F2.forEach(([x,y,w,h],i)=>{const wt=clamp(fl*1.6-0.15*i,0,1),c=mix(BA_DRY,BA_GREEN,0.9*wt);ctx.fillStyle="rgba(60,40,26,0.3)";ctx.fillRect(x+4,y+5,w,h);ctx.fillStyle=rgba(c,1);ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=rgba(mix(c,[40,30,20],0.4),0.7);ctx.lineWidth=2;for(let k=1;k<5;k++){ctx.beginPath();ctx.moveTo(x+6,y+k*h/5);ctx.lineTo(x+w-6,y+k*h/5);ctx.stroke();}
      ctx.strokeStyle="rgba(70,48,30,0.6)";ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);});});
  for(let i=n-1;i>=0;i--){const q=clamp(dug*n-(n-1-i),0,1);if(q<=0)break;const[x,y]=D9_CH2[i];d9_shaft(ctx,x,y,(i===0?16:12.5-4*i/n)*ease(Math.min(1,q*1.5)));}
  const hi=o.hi||0;if(hi>0.01){[[BA_CHAIN[0],17],[D9_CH2[0],16]].forEach(([[x,y],r])=>{glow(ctx,x,y,r*3.4,BA_RED,0.4*hi);ring(ctx,x,y,r+9,BA_RED,0.9*hi,3);});}}

/* ---------- Nishapur: the governor's court ---------- */
// The governor's court, seen from its courtyard as the afternoon goes: the sky, and the town's roofs and domes in the haze beyond the
// court's wall; the court's tall portal of brick, lit from the left, and in it a pointed arch over a hall in shade, lit by two lamps;
// the dais, a step up, where the governor stands; and in the portal's piers two niches, the left with the law books on its shelves,
// the right with a lamp. Drawn in the series' own style, not in the style of Persian art (PLAYBOOK §2): the city, the governor and
// the book are real; the people around them, the court's look and its furniture are illustrative.
const D9_FL=868,D9_DS=812,D9_DESK=[900,836];
// a pointed arch: from (xl, yb) up to where it springs (ys), over to its point (ya), and down to (xr, yb); closed unless open is set
function d9_arch(p,xl,xr,ys,ya,yb,open){const hw=(xr-xl)/2,ri=ys-ya,r=(hw*hw+ri*ri)/(2*hw),a=Math.acos(clamp((r-hw)/r,-1,1));
  p.moveTo(xl,yb);p.lineTo(xl,ys);p.arc(xl+r,ys,r,Math.PI,Math.PI+a);p.arc(xr-r,ys,r,2*Math.PI-a,2*Math.PI);p.lineTo(xr,yb);if(!open)p.closePath();}
// the law books on the shelves of the left niche (x0 to x1): spines of leather in a few colours, some lying flat; o.hi lights them
const D9_LEATHER=[[120,62,42],[92,58,40],[150,96,54],[108,44,40],[132,104,70],[84,66,52]];
function d9_lawBooks(ctx,x0,x1,hi){[668,730,792].forEach((sy,r)=>{ctx.fillStyle="rgba(70,46,32,1)";ctx.fillRect(x0+6,sy,x1-x0-12,7);let x=x0+12,k=0;
    while(x<x1-18){const h_=hash(r*31+k,931),flat=h_>0.86;const c=D9_LEATHER[Math.floor(hash(r*31+k,932)*D9_LEATHER.length)];
      if(flat){const w=34,h=8;ctx.fillStyle=rgba(c,1);ctx.fillRect(x,sy-h,w,h);ctx.fillRect(x+3,sy-2*h,w-4,h);x+=w+4;}
      else{const w=9+Math.round(hash(r*31+k,933)*7),h=38+Math.round(hash(r*31+k,934)*14);ctx.fillStyle=rgba(c,1);ctx.fillRect(x,sy-h,w,h);ctx.fillStyle="rgba(230,196,140,0.35)";ctx.fillRect(x+2,sy-h+8,w-4,2);ctx.fillRect(x+2,sy-12,w-4,2);x+=w+2;}k++;}});
  if(hi>0.01)glow(ctx,(x0+x1)/2,730,120,D9_LAMP,0.35*hi);}
function d9_court(ctx,t,o){o=o||{};const dk=o.dusk||0;
  let g=ctx.createLinearGradient(0,-400,0,720);g.addColorStop(0,rgba(mix([62,94,150],[44,48,96],dk),1));g.addColorStop(0.62,rgba(mix([158,168,198],[150,114,136],dk),1));g.addColorStop(1,rgba(mix([242,208,166],[238,164,120],dk),1));
  ctx.fillStyle=g;ctx.fillRect(-1000,-800,3920,1520);
  // the town beyond the wall, in the haze
  ctx.fillStyle=rgba(mix([176,146,130],[132,98,104],dk),0.85);for(let i=0;i<30;i++){const x=-560+i*112+hash(i,961)*50,w=70+hash(i,962)*80,h=24+hash(i,963)*40;ctx.fillRect(x,640-h,w,h+60);
    if(hash(i,964)>0.7){ctx.beginPath();ctx.arc(x+w/2,640-h,w*0.3,Math.PI,0);ctx.fill();}}
  // the court's wall, either side of the portal, and the courtyard's packed earth
  g=ctx.createLinearGradient(0,600,0,D9_FL);g.addColorStop(0,"#c79f78");g.addColorStop(1,"#a98060");ctx.fillStyle=g;ctx.fillRect(-1000,600,3920,D9_FL-600);ctx.fillStyle="rgba(244,220,184,0.6)";ctx.fillRect(-1000,598,3920,6);
  g=ctx.createLinearGradient(0,D9_FL-6,0,1300);g.addColorStop(0,"#d6af84");g.addColorStop(1,"#9c7656");ctx.fillStyle=g;ctx.fillRect(-1000,D9_FL-6,3920,900);
  // the portal: brick, lit from the left, its courses as texture, a band round its face
  const X0=470,X1=1450,Y0=110;g=ctx.createLinearGradient(X0,0,X1,0);g.addColorStop(0,"#e2bb8e");g.addColorStop(1,"#b98f67");ctx.fillStyle=g;ctx.fillRect(X0,Y0,X1-X0,D9_FL-Y0);
  ctx.save();ctx.strokeStyle="rgba(120,84,56,0.16)";ctx.lineWidth=1.5;ctx.beginPath();for(let y=Y0+24;y<D9_FL;y+=24){ctx.moveTo(X0,y);ctx.lineTo(X1,y);}
    for(let y=Y0,r=0;y<D9_FL-6;y+=24,r++)for(let x=X0+(r%2?24:48);x<X1;x+=48){ctx.moveTo(x,y);ctx.lineTo(x,y+24);}ctx.stroke();ctx.restore();
  ctx.strokeStyle="rgba(250,228,194,0.55)";ctx.lineWidth=6;ctx.strokeRect(X0+26,Y0+26,X1-X0-52,D9_FL-Y0-56);
  // the arch, and the hall inside it in shade, its back wall lit by the lamps
  const p=new Path2D();d9_arch(p,700,1220,470,150,D9_FL);ctx.save();ctx.clip(p);g=ctx.createLinearGradient(0,150,0,D9_FL);g.addColorStop(0,"#563a2c");g.addColorStop(1,"#7c5842");ctx.fillStyle=g;ctx.fillRect(700,150,520,D9_FL-150);
  glow(ctx,980,600,380,D9_LAMP,0.32+0.03*Math.sin(t*3.1));const q=new Path2D();d9_arch(q,840,1120,580,380,D9_DS);ctx.fillStyle="rgba(160,118,86,0.5)";ctx.fill(q);ctx.restore();
  const e=new Path2D();d9_arch(e,700,1220,470,150,D9_FL,1);ctx.strokeStyle="rgba(252,230,196,0.8)";ctx.lineWidth=5;ctx.stroke(e);
  // two lamps on chains
  [[846,350],[1074,350]].forEach(([x,y],i)=>{ctx.strokeStyle="rgba(60,44,32,0.9)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-150);ctx.lineTo(x,y-8);ctx.stroke();
    ctx.fillStyle="rgba(176,128,70,1)";ctx.beginPath();ctx.ellipse(x,y,16,7,0,0,TAU);ctx.fill();const fl=0.85+0.15*Math.sin(t*8+i*2);ctx.fillStyle="rgba(255,228,164,1)";ctx.beginPath();ctx.ellipse(x+10,y-9,3.6,8*fl,0.3,0,TAU);ctx.fill();
    glow(ctx,x+10,y-8,90,D9_LAMP,0.5);glow(ctx,x+10,y-8,22,[255,236,190],0.8);});
  // the dais, a step up from the courtyard, with a plain rug along its edge
  ctx.fillStyle="#8a6246";ctx.fillRect(760,D9_DS,400,D9_FL-D9_DS);ctx.fillStyle="rgba(244,214,174,0.4)";ctx.fillRect(760,D9_DS,400,4);ctx.fillStyle="rgba(146,54,46,0.92)";ctx.fillRect(800,D9_DS-5,320,7);
  // the niches in the piers: the law books on the left one's shelves, a lamp in the right one
  [[518,662],[1258,1402]].forEach(([xl,xr])=>{const n=new Path2D();d9_arch(n,xl,xr,600,520,808);ctx.fillStyle="rgba(98,68,50,0.94)";ctx.fill(n);ctx.strokeStyle="rgba(252,230,196,0.6)";ctx.lineWidth=3;ctx.stroke(n);});
  d9_lawBooks(ctx,518,662,o.books||0);
  const lx=1330,ly=780;ctx.fillStyle="rgba(176,128,70,1)";ctx.beginPath();ctx.ellipse(lx,ly,18,7,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,228,164,1)";ctx.beginPath();ctx.ellipse(lx+11,ly-9,3.6,8*(0.85+0.15*Math.sin(t*7.3)),0.3,0,TAU);ctx.fill();glow(ctx,lx+10,ly-8,80,D9_LAMP,0.55);}
// a low table in front of the dais, where the book lies
function d9_table(ctx,x,y){ctx.fillStyle="#5c3e2e";ctx.fillRect(x-70,y,140,9);ctx.fillRect(x-62,y+9,8,D9_FL-y-9);ctx.fillRect(x+54,y+9,8,D9_FL-y-9);ctx.fillStyle="rgba(244,214,174,0.35)";ctx.fillRect(x-70,y,140,2);}
// the book on qanats, open on its table: two pages over leather boards, their lines written in up to o.p (texture); o.old: years on it
function d9_codex(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=w*0.3,p=o.p==null?1:o.p,old=o.old||0;withA(ctx,a,()=>{
  ctx.fillStyle=rgba(mix([128,62,42],[88,50,38],old),1);ctx.beginPath();ctx.moveTo(x-w/2-5,y+3);ctx.lineTo(x-w/2+2,y-h-2);ctx.lineTo(x+w/2-2,y-h-2);ctx.lineTo(x+w/2+5,y+3);ctx.closePath();ctx.fill();
  const pg=mix([246,234,206],[226,204,164],old);[-1,1].forEach(sd=>{const g=ctx.createLinearGradient(x,0,x+sd*w/2,0);g.addColorStop(0,rgba(mix(pg,[150,120,90],0.35),1));g.addColorStop(0.25,rgba(pg,1));g.addColorStop(1,rgba(mix(pg,[255,255,255],0.15),1));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+sd*w*0.22,y+3,x+sd*(w/2-1),y-1);ctx.lineTo(x+sd*(w/2-4),y-h+2);ctx.quadraticCurveTo(x+sd*w*0.22,y-h-3,x,y-h+3);ctx.closePath();ctx.fill();});
  // its lines, written in turn: left page, then right
  const n=7;ctx.strokeStyle=rgba(mix([70,46,34],[96,70,52],old),0.8);ctx.lineWidth=Math.max(1,w/110);ctx.lineCap="round";
  for(let k=0;k<2*n;k++){const q=clamp(p*2*n-k,0,1);if(q<=0)break;const sd=k<n?-1:1,r=k%n,yy=y-h+h*0.18+r*h*0.72/(n-1),xa=x+sd*w*0.06,xb=x+sd*w*(0.44-0.03*hash(k,935)),xe=lerp(xa,xb,q);
    ctx.beginPath();for(let i=0;i<=10;i++){const xx=lerp(xa,xe,i/10);i?ctx.lineTo(xx,yy+Math.sin(i*1.9+k)*w/220):ctx.moveTo(xx,yy);}ctx.stroke();}
  if(o.hi>0.01)glow(ctx,x,y-h/2,w*0.9,D9_LAMP,0.45*o.hi);});}
// someone in the story, as the series draws them, standing at (x, y) with a soft shadow at their feet; o.f may pass between -1 and 1
// as they turn round, the silhouette narrowing through its edge
function d9_fig(ctx,x,y,s,o){const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createRadialGradient(x,y,2,x,y,110*s);g.addColorStop(0,"rgba(30,18,10,0.32)");g.addColorStop(1,"rgba(30,18,10,0)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,110*s,16*s,0,0,TAU);ctx.fill();});
  const f=o.f==null?1:o.f;ba_fig(ctx,x,y,s,Object.assign({t:0,rimA:0.6},o,{f:Math.abs(f)<0.1?(f<0?-0.1:0.1):f}));}
// someone walking from x0 to x1, setting off at t0 and taking d seconds: where they are, and the bob of their steps
function d9_go(t,x0,x1,t0,d){const u=clamp((t-t0)/d,0,1);return[lerp(x0,x1,sstep(0,1,u)),u>0&&u<1?-Math.abs(Math.sin((t-t0)*6))*2.4:0];}
// the book, small, with everyone who needs a rule coming to it: one home, written once
function d9_bookMini(ctx,cx,cy,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,cx-150,cy-74,300,148,18,D9_LAMP,{glow:14,ea:0.8,fill:"rgba(20,14,10,0.94)"});
  d9_codex(ctx,cx,cy+18,150,{p:1,hi:0.4+0.2*Math.sin(t*1.6)});[[-118,40],[118,40],[-92,-40],[92,-40]].forEach(([dx,dy],i)=>{const k=((t*0.35+i*0.25)%1);ctx.fillStyle=rgba(D9_LAMP,0.85);ctx.beginPath();ctx.arc(cx+dx*(1-0.55*k),cy+dy*(1-0.55*k),4,0,TAU);ctx.fill();});});}
// Khorasan, on a card: the book on qanats, open, and what it gave: the rules for qanats in one book, where everyone looked. The small
// drawing is texture; the words are full size
function d9_bookCard(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,D9_LAMP,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(20,14,10,0.95)"});
  d9_codex(ctx,x+86,y+h/2+20,132,{p:1,old:0.5,hi:0.3*(o.open||0)});const tx=x+172;T(ctx,"Khorasan",tx,y+52,{f:"mono",w:600,size:28,color:rgba(D9_LAMP,1)});
  withA(ctx,o.open||0,()=>{tick_(ctx,tx+14,y+98,24,D9_OK,1);T(ctx,"one book of rules",tx+40,y+108,{w:800,size:30,color:rgba(D9_OK,1)});});
  withA(ctx,o.once||0,()=>T(ctx,"everyone looked there",tx,y+156,{w:700,size:30,color:rgba(D9_LAMP,1)}));});}
// a line traced through points, drawn up to p, with a bright head while it's drawing
function d9_trace_(ctx,pts,p,col,o){o=o||{};if(p<=0)return;const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=L[L.length-1]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length;i++){if(L[i]<=d){ctx.lineTo(pts[i][0],pts[i][1]);hx=pts[i][0];hy=pts[i][1];}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1);hx=lerp(pts[i-1][0],pts[i][0],f);hy=lerp(pts[i-1][1],pts[i][1],f);ctx.lineTo(hx,hy);break;}}ctx.stroke();ctx.restore();
  if(p<1&&!o.nohead){glow(ctx,hx,hy,22,col,0.8);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(hx,hy,4.5,0,TAU);ctx.fill();}}
/* ---------- the utility: its two businesses, the wall between them, and the rules ---------- */
// the rules, in the business's words: day one's, the two it really is, and the validity rule
const D9_R0="an estimated reading stands only until the next actual reading";
const D9_R21="An estimate is replaced when the actual reading arrives, and the replacement is sent to the retailer.";
const D9_R22="A bill based on a replaced estimate is corrected on the next bill.";
const D9_R20="Every reading is marked actual or estimated.";
const D9_Q="Where does each rule belong?",D9_NEXT="What does the business expect of its data?";
const D9_A="In the map: written once, at the step where it applies, with an owner and a reason, and its checks generated from it.";
// the network's side tinted blue and retail's rose, with their names (as in Who does it); o.ly: where the names sit
function d9_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D9_NET,0.0));lg.addColorStop(1,rgba(D9_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D9_RET,0.08));rg.addColorStop(1,rgba(D9_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  const ly=o.ly||96;withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,ly,{w:800,size:40,align:"center",color:rgba(D9_NET,1)});T(ctx,"retail",1440,ly,{w:800,size:40,align:"center",color:rgba(D9_RET,1)});});});}
// the wall between them, drawn down from the top as p goes to 1; o.gate (0..1) opens a gate at o.gy, where what crosses is
// translated; o.hi lights it, o.red flashes it
function d9_wall(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,y0=o.y0||140,y1=y0+((o.y1||900)-y0)*ease(p),red=o.red||0,gate=o.gate||0,gy=o.gy||560;withA(ctx,a,()=>{
  const col=mix([226,232,246],D9_RED,red);ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*(red+(o.hi||0));ctx.fillStyle=rgba(col,0.12+0.1*red+0.08*(o.hi||0));
  const gh=gate*150;ctx.fillRect(948,y0,24,Math.max(0,Math.min(y1,gy-gh/2)-y0));if(y1>gy+gh/2)ctx.fillRect(948,gy+gh/2,24,y1-gy-gh/2);ctx.shadowBlur=0;
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,Math.min(y1,gy-gh/2));if(y1>gy+gh/2){ctx.moveTo(x,gy+gh/2);ctx.lineTo(x,y1);}});ctx.stroke();ctx.restore();
  if(gate>0.05)withA(ctx,gate,()=>d9_conv(ctx,960,gy,34,0.5+0.5*Math.sin(t*3),1));});}
// the gate's translator: a small box that takes the network's words in and gives retail's out
function d9_conv(ctx,x,y,s,g,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,s*2.2,[220,230,255],0.25+0.45*g);ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(10,14,26,0.95)";rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.fill();
  ctx.strokeStyle="rgba(230,236,255,0.95)";ctx.lineWidth=Math.max(1.5,s*0.12);rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.stroke();ctx.lineWidth=Math.max(1.2,s*0.1);
  [[-1,D9_NET,3],[1,D9_RET,2]].forEach(([sd,col,n])=>{ctx.strokeStyle=rgba(col,1);ctx.beginPath();for(let i=0;i<=16;i++){const u=i/16,xx=sd*s*(0.12+u*0.72);const yy=Math.sin(u*TAU*n/2*1.5)*s*0.28;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});
  ctx.restore();});}
// a list on paper, with a title and its rows (p writes them in); o.hi (0..1) marks the last row as new, in the network's blue
function d9_list(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=92+rows.length*52;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot,plain:true});
  T(ctx,title,x+28,y+52,{w:800,size:30,color:"rgba(52,48,46,0.95)"});rows.forEach((r,i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0)return;const nw=i===rows.length-1&&o.hi?o.hi:0;
    withA(ctx,q,()=>{if(nw>0.01)withA(ctx,nw,()=>{ctx.fillStyle="rgba(132,176,255,0.22)";ctx.fillRect(x+20,y+72+i*52,w-40,46);});
      T(ctx,r,x+52,y+104+i*52,{w:700,size:28,color:nw>0.5?"rgba(36,70,150,0.98)":"rgba(52,48,46,0.9)"});ctx.fillStyle="rgba(52,48,46,0.7)";ctx.beginPath();ctx.arc(x+34,y+94+i*52,4,0,TAU);ctx.fill();});});});return h;}
// an envelope: a reading crossing the wall
function d9_msg(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,40*s,col,0.5);ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#f1ead8";rr(ctx,-28,-19,56,38,4);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;rr(ctx,-28,-19,56,38,4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-28,-19);ctx.lineTo(0,4);ctx.lineTo(28,-19);ctx.stroke();ctx.restore();});}
// an owner, named on a gold tag with ArchiMate's actor glyph
function d9_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const s=(o.pre==null?"owner · ":o.pre)+name,ts=28,w=tw(ctx,s,ts,700)+70,h=48,X=o.align==="center"?x-w/2:x;glass(ctx,X,y-h/2,w,h,h/2,TRUST,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(20,16,6,0.92)"});
  archGlyph(ctx,"actor",X+26,y-2,13,TRUST);T(ctx,s,X+48,y+ts*0.36,{w:700,size:ts,color:rgba(TRUST,1)});});}
// ArchiMate's requirement: a parallelogram, leaning right
function d9_reqGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.11);ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.45,y-s*0.5);ctx.lineTo(x+s*0.9,y-s*0.5);ctx.lineTo(x+s*0.45,y+s*0.5);ctx.lineTo(x-s*0.9,y+s*0.5);ctx.closePath();ctx.stroke();ctx.restore();}
// an element of the model, with a requirement's glyph where archEl puts its own
function d9_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const own=kind==="requirement";archEl(ctx,x,y,w,h,name,col,own?"none":kind,o);
  if(own){const gs=o.gs||13;withA(ctx,a,()=>d9_reqGlyph(ctx,x+w-gs-13,y+gs+9,gs,col));}}
// what kind of rule an id is: RUL-020 is about the data itself; the network's and retail's are about what the business does
const d9_kind=id=>id&&id!=="RUL-020"?"business rule":"data rule";
// A data rule, as the series draws one from here on: dark glass with motivation's purple edge, ArchiMate's requirement glyph, a
// stripe in the colour of the side it belongs to, and its id in a monospaced kicker. o.p writes its words; o.hi lights it; o.ink: its
// words' colour; o.deco: drawn small on purpose. Returns its height.
function d9_rule(ctx,x,y,w,id,text,side,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,ls=wrapT(ctx,text,0,0,w-76,{size:sz,w:700,measure:true}),h=86+ls.length*sz*1.25;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.95)"});
    if(side){ctx.fillStyle=rgba(side,0.95);rr(ctx,x+9,y+14,7,h-28,3.5);ctx.fill();}
    d9_reqGlyph(ctx,x+w-36,y+36,16,MOT);T(ctx,d9_kind(id)+(id?" · "+id:""),x+34,y+46,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});
    let left=text.length*(o.p==null?1:o.p);ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,x+34,y+90+i*sz*1.25,{w:700,size:sz,color:o.ink||rgba(INK,0.97),deco:o.deco});});});return h;}
// The rule in a set form: its kicker, then a row for each part, a label in mono and its value. rows: [label, value, colour, kind];
// kind "owner" puts ArchiMate's actor before the value. o.r[i] (0..1) brings in row i; o.hiRow lights one; o.tick: the owner's
// gold tick. Returns its height.
function d9_ruleForm(ctx,x,y,w,id,rows,o){o=o||{};const a=o.a==null?1:o.a,side=o.side||D9_RET,rh=o.rh||100,h=104+rows.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.96)"});ctx.fillStyle=rgba(side,0.95);rr(ctx,x+9,y+16,7,h-32,3.5);ctx.fill();
    d9_reqGlyph(ctx,x+w-40,y+42,18,MOT);T(ctx,d9_kind(id)+" · "+id,x+36,y+60,{f:"mono",w:500,size:32,color:rgba(MOT,1)});
    rows.forEach(([lab,val,col,kind],i)=>{const q=o.r?clamp(o.r[i]||0,0,1):1;if(q<=0.01)return;const ry=y+92+i*rh;withA(ctx,q,()=>{
      if(o.hiRow===i){ctx.save();ctx.fillStyle=rgba(col,0.1);rr(ctx,x+22,ry+6,w-44,rh-10,10);ctx.fill();ctx.restore();}
      ctx.strokeStyle="rgba(200,186,255,0.16)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+30,ry);ctx.lineTo(x+w-24,ry);ctx.stroke();
      T(ctx,lab,x+36,ry+38,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});let vx=x+36;if(kind==="owner"){archGlyph(ctx,"actor",vx+12,ry+70,13,col);vx+=36;}
      T(ctx,val,vx,ry+80,{w:700,size:30,color:rgba(col,1)});});});
    if(o.tick>0.01)kt_gtick(ctx,x+w-46,y+h-46,22,o.tick);});return h;}
// a bill, as day one showed it: o.amount, o.note, o.bad (0..1) flags it wrong; o.stamp: a word stamped across it, o.st (0..1), in
// o.stampCol; o.was: the amount it replaces, struck through as o.wa goes to 1
function d9_bill(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,236,18,[200,210,230],{glow:12+14*(o.hi||0),ea:0.7,fill:"rgba(236,240,246,0.97)"});
  T(ctx,"Your bill",x+26,y+48,{w:800,size:30,color:"rgba(40,44,56,1)"});T(ctx,"$"+(o.amount||"412.80"),x+26,y+116,{w:800,size:52,color:rgba(o.good?[40,130,70]:o.bad?[200,50,50]:[40,44,56],1)});
  if(o.was&&o.wa>0.01)withA(ctx,o.wa,()=>{const ww=tw(ctx,"$"+o.was,34,700),wx=x+w-26-ww;T(ctx,"$"+o.was,wx,y+110,{w:700,size:34,color:"rgba(110,116,128,1)"});ctx.save();ctx.strokeStyle="rgba(200,50,50,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wx-4,y+98);ctx.lineTo(wx-4+(ww+8)*clamp(o.wa*1.5-0.5,0,1),y+98);ctx.stroke();ctx.restore();});
  T(ctx,o.note||"an estimated reading",x+26,y+162,{w:600,size:28,color:"rgba(90,96,110,1)"});if(o.bad)withA(ctx,o.bad,()=>tag(ctx,x+26,y+204,"wrong",BAD,{size:28}));
  if(o.stamp&&o.st>0.01)withA(ctx,clamp(o.st*1.4,0,1),()=>{const k=1+0.5*(1-ease(clamp(o.st,0,1)));ctx.save();ctx.translate(x+w-156,y+202);ctx.rotate(-0.1);ctx.scale(k,k);const sw=tw(ctx,o.stamp,30,800)+36;
    const sc_=o.stampCol||[200,50,50];ctx.strokeStyle=rgba(sc_,0.9);ctx.lineWidth=4;rr(ctx,-sw/2,-28,sw,56,8);ctx.stroke();T(ctx,o.stamp,0,11,{w:800,size:30,align:"center",color:rgba(sc_,0.95)});ctx.restore();});});}

/* ---------- the household behind the bill ---------- */
// June, day by day: what they used (units a day). Away from the 8th to the 28th, three weeks; last June's same days, from which the
// bill estimated them
const D9_USE=[21.4,23.1,20.2,24.6,22.3,21.0,23.8, 1.4,1.1,1.6,1.2,1.3,1.0,1.5,1.2,1.4,1.1,1.3,1.6,1.2,1.0,1.4,1.3,1.1,1.5,1.2,1.3,1.4, 22.6,21.7];
const D9_LAST=[0,0,0,0,0,0,0, 23.2,22.4,24.8,21.9,23.6,25.1,22.7,24.0,23.3,22.1,24.6,23.9,21.8,22.9,24.4,23.1,22.5,24.9,23.7,22.2,23.4, 0,0];
const D9_AWAY=[7,27];
// a house on paper, drawn in marker, with its smart meter on the outside wall: o.lit lights its windows (someone's home); o.sig (0..1)
// the meter's signal, sending readings; o.off (0..1) crosses it out
function d9_house(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,cx-180,cy-150,360,300,{rot:-0.008,plain:true});
  marker(ctx,[[cx-90,cy-30],[cx-90,cy+80],[cx+90,cy+80],[cx+90,cy-30]],1,{lw:3.4,seed:3});marker(ctx,[[cx-114,cy-24],[cx,cy-112],[cx+114,cy-24]],1,{lw:3.4,seed:4});
  const lit=o.lit==null?1:o.lit;[[cx-70,cy-6],[cx+2,cy-6]].forEach(([wx,wy])=>{ctx.fillStyle="rgba(40,40,48,0.88)";ctx.fillRect(wx,wy,40,32);if(lit>0.01){ctx.fillStyle=rgba([255,206,120],0.9*lit);ctx.fillRect(wx+3,wy+3,34,26);}});
  ctx.fillStyle="rgba(40,40,48,0.88)";ctx.fillRect(cx-14,cy+36,28,44);
  // the meter, and its signal
  const mx=cx+68,my=cy+52,sig=o.sig||0;ctx.save();if(sig>0)glow(ctx,mx,my,40,D9_NET,0.5*sig);ctx.fillStyle=rgba(mix([210,214,220],D9_NET,sig*0.5),1);rr(ctx,mx-10,my-14,20,28,4);ctx.fill();ctx.strokeStyle="rgba(40,40,48,0.9)";ctx.lineWidth=2;rr(ctx,mx-10,my-14,20,28,4);ctx.stroke();ctx.restore();
  [14,24,34].forEach((r,i)=>{const v=sig*(0.35+0.65*(0.5+0.5*Math.sin(t*5-i*1.1)));if(v<=0.02)return;ctx.save();ctx.strokeStyle=rgba(mix(D9_NET,[30,60,140],0.35),v);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(mx,my-24,r,-Math.PI*0.78,-Math.PI*0.22);ctx.stroke();ctx.restore();});
  if(o.off>0.01)cross_(ctx,mx+6,my-48,34,[200,56,48],o.off);
  T(ctx,"the household",cx,cy+128,{w:800,size:30,align:"center",color:rgba(INKD,0.92)});});}
// where a day's bar sits on the June chart: [x of its centre, the baseline]
function d9_juneAt(x,y,w,h,i){return[x+50+i*((w-80)/30),y+h-56];}
// June on paper, as a bar a day. o.p grows the days they were home; o.away (0..1) marks the three weeks away; o.gap (0..1) says no
// readings came; o.est (0..1) raises last June's days, dashed, as the estimate; o.act[i] (0..1) each away day's actual reading
function d9_june(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:0.006,plain:true});
  T(ctx,"June",x+30,y+52,{w:800,size:34,color:"rgba(52,48,46,0.95)"});const k=5.0,bw=13,[,by]=d9_juneAt(x,y,w,h,0),aw=o.away||0;
  ctx.strokeStyle="rgba(52,48,46,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,by);ctx.lineTo(x+w-24,by);ctx.stroke();
  [0,7,14,21,29].forEach(i=>T(ctx,String(i+1),d9_juneAt(x,y,w,h,i)[0],by+26,{w:600,size:20,align:"center",color:"rgba(52,48,46,0.7)",deco:1}));
  // the weeks away, bracketed
  if(aw>0.01)withA(ctx,aw,()=>{const xa=d9_juneAt(x,y,w,h,D9_AWAY[0])[0]-10,xb=d9_juneAt(x,y,w,h,D9_AWAY[1])[0]+10,yb=y+84;ctx.fillStyle="rgba(120,140,190,0.10)";ctx.fillRect(xa,yb,xb-xa,by-yb);
    marker(ctx,[[xa,yb+14],[xa,yb],[lerp(xa,xb,ease(aw)),yb]],1,{lw:2.6,col:"rgba(52,60,110,0.85)",seed:7});if(aw>0.9)marker(ctx,[[xb,yb],[xb,yb+14]],1,{lw:2.6,col:"rgba(52,60,110,0.85)",seed:8});
    d9_case(ctx,(xa+xb)/2-150,yb-26,0.9);T(ctx,"away, three weeks",(xa+xb)/2-118,yb-16,{w:800,size:28,color:"rgba(52,60,110,0.95)"});});
  for(let i=0;i<30;i++){const[bx]=d9_juneAt(x,y,w,h,i),away=i>=D9_AWAY[0]&&i<=D9_AWAY[1];
    if(!away){const q=clamp((o.p||0)*34-i,0,1);if(q>0){const bh=D9_USE[i]*k*ease(q);ctx.fillStyle="rgba(52,48,46,0.82)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);}continue;}
    const e=clamp((o.est||0)*26-(i-D9_AWAY[0]),0,1);if(e>0){const bh=D9_LAST[i]*k*ease(e);ctx.save();ctx.fillStyle="rgba(214,150,60,0.20)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);ctx.setLineDash([5,4]);ctx.strokeStyle="rgba(190,112,26,0.95)";ctx.lineWidth=2;ctx.strokeRect(bx-bw/2,by-bh,bw,bh);ctx.restore();}
    const g=(o.gap||0)*(1-e);if(g>0.01){ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle=rgba([180,60,50],0.8*g);ctx.lineWidth=2;ctx.strokeRect(bx-bw/2,by-10,bw,10);ctx.restore();}
    const q=o.act?clamp(o.act[i-D9_AWAY[0]]||0,0,1):0;if(q>0){const bh=D9_USE[i]*k*ease(q);glow(ctx,bx,by-bh,12,[60,150,90],0.5*q*(1-q));ctx.fillStyle="rgba(40,120,70,0.95)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);}}
  const mid=(d9_juneAt(x,y,w,h,D9_AWAY[0])[0]+d9_juneAt(x,y,w,h,D9_AWAY[1])[0])/2,lab=(s,c,yy,v)=>{if(v<=0.01)return;withA(ctx,v,()=>{const tw_=tw(ctx,s,28,800)+24;ctx.fillStyle="rgba(244,238,224,0.94)";ctx.fillRect(mid-tw_/2,yy-30,tw_,40);T(ctx,s,mid,yy,{w:800,size:28,align:"center",color:c});});};
  lab("no readings",rgba([180,60,50],1),by-24,(o.gap||0)*(1-(o.est||0)));lab("estimated from last year",rgba([160,92,18],1),by-142,o.estL||0);lab("actual: almost nothing",rgba([40,120,70],1),by-36,o.actL||0);});}
// a suitcase, drawn small: away from home
function d9_case(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(52,60,110,0.9)";ctx.lineWidth=2.6;rr(ctx,-18,-12,36,26,4);ctx.stroke();ctx.beginPath();ctx.moveTo(-7,-12);ctx.lineTo(-7,-18);ctx.lineTo(7,-18);ctx.lineTo(7,-12);ctx.stroke();ctx.restore();}

/* ---------- the script on the wall ---------- */
// the script's code, as texture
const D9_CODE=["-- re-bill estimates that have an actual","select e.reading_id, e.point, e.day","  from readings e","  join readings a on a.point = e.point","   and a.day = e.day","   and a.kind = 'actual'"," where e.kind = 'estimate'","insert into billing_queue_old"];
// A script in a dark window: its name, a moon (it runs at night), its code; o.scan (0..1) runs down its lines; o.hi lights it; o.stop
// (0..1) the yellow note that says it was a stopgap
function d9_script(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TECH,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  ctx.fillStyle="rgba(120,200,255,0.10)";rr(ctx,x+2,y+2,w-4,54,14);ctx.fill();T(ctx,o.name||"nightly script",x+24,y+38,{f:"mono",w:500,size:28,color:rgba(TECH,1)});d9_moon(ctx,x+w-34,y+29,13,TECH,1);
  const lh=Math.min(26,(h-76)/D9_CODE.length);D9_CODE.forEach((l,i)=>{const yy=y+84+i*lh,sc=o.scan==null?-1:o.scan*D9_CODE.length;if(sc>=0&&Math.abs(sc-i-0.5)<0.9){ctx.fillStyle="rgba(120,200,255,0.16)";ctx.fillRect(x+12,yy-lh+6,w-24,lh);}
    T(ctx,l,x+24,yy,{f:"mono",w:500,size:Math.min(18,lh*0.72),color:rgba(i===0?[150,170,150]:SOFT,0.85),deco:1});});
  if(o.stop>0.01){const q=clamp(o.stop,0,1),k=1+0.14*(1-ease(q));ctx.save();ctx.translate(x+w+14,y-4);ctx.scale(k,k);sticky(ctx,0,0,190,70,"stopgap",{col:NOTEC[0],size:30,rot:0.08,a:q});ctx.restore();}});}
// a moon, for every night
function d9_moon(ctx,x,y,r,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(x+r*0.5,y-r*0.3,r*0.86,0,TAU);ctx.fill();ctx.restore();});}
// meter readings, as rows: [point, day, kind]; o.hi[i] lights a row; o.pairs: [estimate row, actual row] linked by a bracket, o.pp (0..1)
const D9_ROWS=[["point 4417","12 Jun","estimate"],["point 4417","12 Jun","actual"],["point 2093","14 Jun","estimate"],["point 7731","14 Jun","estimate"],["point 7731","14 Jun","actual"]];
function d9_readings(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=56,h=86+D9_ROWS.length*rh;if(a<=0.01)return h;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,D9_NET,{glow:12,ea:0.8,fill:"rgba(6,10,22,0.95)"});
  dbGlyph(ctx,x+36,y+44,D9_NET,0.7);T(ctx,"meter readings",x+64,y+52,{w:800,size:30,color:rgba(D9_NET,1)});
  D9_ROWS.forEach(([pt,day,kind],i)=>{const yy=y+82+i*rh,hi=o.hi?o.hi[i]||0:0;if(hi>0.01){ctx.fillStyle=rgba(kind==="actual"?D9_OK:[255,196,110],0.16*hi);rr(ctx,x+12,yy,w-24,rh-8,8);ctx.fill();}
    T(ctx,pt,x+28,yy+34,{f:"mono",w:500,size:20,color:rgba(SOFT,0.8),deco:1});T(ctx,day,x+178,yy+34,{f:"mono",w:500,size:20,color:rgba(SOFT,0.8),deco:1});
    T(ctx,kind,x+w-28,yy+36,{f:"mono",w:500,size:28,align:"right",color:rgba(kind==="actual"?D9_OK:[255,196,110],1)});
    if(o.ok>0)tick_(ctx,x+w-196,yy+26,26,D9_OK,clamp(o.ok*D9_ROWS.length-i,0,1));});
  (o.pairs||[]).forEach(([e,b],k)=>{const q=o.pp?clamp(o.pp[k]||0,0,1):1;if(q<=0)return;const y0=y+82+e*rh+24,y1=y+82+b*rh+24,bx=x+w+14;ctx.save();ctx.strokeStyle=rgba([255,220,140],0.9);ctx.lineWidth=2.5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(bx-10,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ease(q)));if(q>0.95)ctx.lineTo(bx-10,y1);ctx.stroke();ctx.restore();});});return h;}
// a queue of bills to be corrected: a tray, its bills stacked, o.n of them; o.dead (0..1) greys it: nothing reads it
function d9_queue(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dead=o.dead||0,col=mix(D9_RET,[130,130,140],dead*0.7);withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:10+12*(o.hi||0),ea:0.8,fill:"rgba(14,8,14,0.95)"});
  T(ctx,name,x+28,y+50,{w:800,size:30,color:rgba(col,1)});const n=Math.min(14,o.n||0);for(let i=0;i<n;i++){const cx=x+62+(i%7)*24,cy=y+118-Math.floor(i/7)*16-(i%7)*2;ctx.save();ctx.translate(cx,cy);ctx.rotate((hash(i,930)-0.5)*0.2);
    ctx.fillStyle=rgba(mix([236,240,246],[150,150,156],dead*0.6),0.95);ctx.fillRect(-26,-17,52,34);ctx.fillStyle="rgba(200,50,50,0.7)";ctx.fillRect(-20,-9,22,4);ctx.restore();}
  if(o.count)withA(ctx,o.cA==null?1:o.cA,()=>{T(ctx,o.count,x+w-30,y+h-66,{w:800,size:64,align:"right",color:rgba(mix([255,120,110],INK,0.15),1)});T(ctx,o.what||"bills",x+w-30,y+h-20,{w:700,size:28,align:"right",color:rgba(SOFT,1)});});});}

/* ---------- five places, no home ---------- */
// The rule, found written five ways: [kind, title, how it's written there]. The regulator's code says why; the rest each say how.
const D9_DOCS=[["script","nightly script","re-bill when an actual arrives"],["code","the regulator's retail code","A bill must reflect actual readings."],
  ["settings","meter system settings","replace estimates after 2 days"],["notes","billing team's notes","correct it on the next bill"],["sheet","complaints spreadsheet","refund if the customer asks"]];
// one of them, drawn as what it is: a script, a code of practice, a settings screen, a page of notes, a spreadsheet; o.hi lights it
function d9_doc(ctx,kind,x,y,w,h,title,line,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  const hi=o.hi||0;if(hi>0.01){ctx.save();ctx.shadowColor=rgba(o.hiCol||TRUST,0.9*hi);ctx.shadowBlur=26*hi;ctx.strokeStyle=rgba(o.hiCol||TRUST,0.9*hi);ctx.lineWidth=4;rr(ctx,-7,-7,w+14,h+14,14);ctx.stroke();ctx.restore();}
  const dark=kind==="script"||kind==="settings",ink=dark?rgba(INK,0.96):"rgba(44,42,46,0.95)",tl=wrapT(ctx,title,0,0,w-(kind==="script"?84:kind==="notes"?60:44),{size:28,w:kind==="script"?500:800,f:kind==="script"?"mono":undefined,measure:true}),th=24+tl.length*32;
  if(dark){glass(ctx,0,0,w,h,14,kind==="script"?TECH:APL,{glow:10,ea:0.8,fill:"rgba(6,10,20,0.96)"});ctx.fillStyle="rgba(120,200,255,0.10)";rr(ctx,2,2,w-4,th+6,12);ctx.fill();}
  else{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle=kind==="notes"?"#f3ecd2":kind==="sheet"?"#f4f6f2":"#efe8da";ctx.fillRect(0,0,w,h);ctx.restore();}
  ctx.save();rr(ctx,0,0,w,h,14);ctx.clip();const TT=(col,x0,o2)=>tl.forEach((l,i)=>T(ctx,l,x0,36+i*32,Object.assign({w:800,size:28,color:col},o2||{})));
  if(kind==="script"){TT(rgba(TECH,1),22,{f:"mono",w:500});d9_moon(ctx,w-30,27,11,TECH,1);[0,1,2].forEach(i=>T(ctx,D9_CODE[i+1],22,th+30+i*22,{f:"mono",w:500,size:16,color:rgba(SOFT,0.7),deco:1}));}
  if(kind==="settings"){TT(rgba(APL,1),22);
}
  if(kind==="code"){TT("rgba(70,52,110,1)",22);ctx.strokeStyle="rgba(70,52,110,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(22,th+4);ctx.lineTo(w-22,th+4);ctx.stroke();
    T(ctx,"§ 21",w-22,th+36,{f:"mono",w:500,size:22,align:"right",color:"rgba(70,52,110,0.8)",deco:1});ctx.strokeStyle="rgba(120,96,180,0.75)";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(w-40,h-36,20,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(w-40,h-36,13,0,TAU);ctx.stroke();}
  if(kind==="notes"){ctx.strokeStyle="rgba(90,130,190,0.25)";ctx.lineWidth=1;for(let yy=70;yy<h-8;yy+=30){ctx.beginPath();ctx.moveTo(10,yy);ctx.lineTo(w-10,yy);ctx.stroke();}ctx.strokeStyle="rgba(200,70,70,0.4)";ctx.beginPath();ctx.moveTo(30,0);ctx.lineTo(30,h);ctx.stroke();
    TT("rgba(40,60,120,0.95)",42);}
  if(kind==="sheet"){ctx.fillStyle="rgba(60,150,90,0.85)";ctx.fillRect(0,0,w,th+6);TT("#fff",18);ctx.strokeStyle="rgba(60,90,70,0.25)";ctx.lineWidth=1;
    for(let c=1;c<4;c++){ctx.beginPath();ctx.moveTo(c*w/4,th+6);ctx.lineTo(c*w/4,h);ctx.stroke();}for(let yy=th+36;yy<h;yy+=30){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);ctx.stroke();}}
  // how the rule is written there, readable
  const ly=th+(kind==="code"?70:kind==="sheet"?62:kind==="notes"?58:kind==="settings"?48:96),ls=wrapT(ctx,line,0,0,w-(kind==="notes"?64:44),{size:28,w:700,measure:true});
  if(kind==="sheet"){ctx.fillStyle="rgba(255,236,150,0.8)";ctx.fillRect(4,ly-32,w-8,ls.length*32+12);}
  if(kind==="settings"){ctx.fillStyle="rgba(140,214,255,0.10)";rr(ctx,14,ly-36,w-28,ls.length*32+18,8);ctx.fill();const tx=w-62,ty=ly+ls.length*32+30;ctx.fillStyle=rgba(D9_OK,0.9);rr(ctx,tx,ty-14,44,26,13);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(tx+31,ty-1,10,0,TAU);ctx.fill();}
  ls.forEach((l,i)=>T(ctx,l,kind==="notes"?42:22,ly+i*32,{w:700,size:28,color:kind==="notes"?"rgba(30,50,120,0.95)":ink}));
  ctx.restore();ctx.restore();});}
// a dashed place where something should be, empty: with a question mark, or a few words
function d9_slot(ctx,x,y,w,h,col,a,label){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();
  if(label)T(ctx,label,x+w/2,y+h/2+11,{w:700,size:30,align:"center",color:rgba(col,0.95)});else T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(col,0.95)});});}
/* ---------- where a rule comes from, and what it's about ---------- */
// an influence, as ArchiMate draws it: a dashed line with an open arrowhead, drawn up to p
function d9_infl(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),xe=lerp(x0,x1,q),ye=lerp(y0,y1,q);ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.setLineDash([9,7]);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);if(q>0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.45)*16,y1-Math.sin(an-0.45)*16);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.45)*16,y1-Math.sin(an+0.45)*16);ctx.stroke();}ctx.restore();});}
// a realisation, as ArchiMate draws it: a dotted line with a hollow triangle at the end it realises, drawn up to p
function d9_real(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),an=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0),xe=x0+Math.cos(an)*Math.max(0,L*q-18),ye=y0+Math.sin(an)*Math.max(0,L*q-18);
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.setLineDash([3,6]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(q>0.98){ctx.fillStyle="rgba(9,8,22,1)";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.5)*20,y1-Math.sin(an-0.5)*20);ctx.lineTo(x1-Math.cos(an+0.5)*20,y1-Math.sin(an+0.5)*20);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();});}
// a clock, for a service level
function d9_clock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.12);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,s*0.7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-s*0.42);ctx.moveTo(x,y);ctx.lineTo(x+s*0.32,y+s*0.1);ctx.stroke();ctx.restore();}
// a kind of reason, as a chip: o.kind "driver", "principle" or "clock", in motivation's purple; or any motivation element's glyph,
// "requirement" among them
function d9_why(ctx,cx,cy,label,kind,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,label,30,700)+86,h=58;glass(ctx,cx-w/2,cy-h/2,w,h,h/2,MOT,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(12,10,26,0.94)"});
  if(kind==="clock")d9_clock(ctx,cx-w/2+34,cy,22,MOT);else if(kind==="requirement")d9_reqGlyph(ctx,cx-w/2+36,cy,18,MOT);else archGlyph(ctx,kind,cx-w/2+34,cy,15,MOT);T(ctx,label,cx-w/2+62,cy+11,{w:700,size:30,color:rgba(mix(MOT,INK,0.4),1)});});}
// a fact, as a statement about concepts: glass, with a mono kicker
function d9_fact(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ls=wrapT(ctx,text,0,0,w-48,{size:28,w:700,measure:true}),h=70+ls.length*34;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,[190,200,220],{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(8,12,24,0.94)"});
  T(ctx,"fact",x+24,y+36,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});ls.forEach((l,i)=>T(ctx,l,x+24,y+76+i*34,{w:700,size:28,color:rgba(INK,0.95)}));});return h;}
// a concept, as a term the business uses: a chip with a small book
function d9_term(ctx,cx,cy,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[214,226,240];withA(ctx,a,()=>{const w=tw(ctx,label,30,800)+82,h=60;glass(ctx,cx-w/2,cy-h/2,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(10,12,22,0.94)"});
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;const bx=cx-w/2+32,by=cy;ctx.beginPath();ctx.moveTo(bx,by-11);ctx.quadraticCurveTo(bx-8,by-14,bx-14,by-11);ctx.lineTo(bx-14,by+11);ctx.quadraticCurveTo(bx-8,by+8,bx,by+11);ctx.quadraticCurveTo(bx+8,by+8,bx+14,by+11);ctx.lineTo(bx+14,by-11);ctx.quadraticCurveTo(bx+8,by-14,bx,by-11);ctx.lineTo(bx,by+11);ctx.stroke();ctx.restore();
  T(ctx,label,cx-w/2+58,cy+11,{w:800,size:30,color:rgba(INK,0.97),deco:o.deco});});}
// a word from the industry's model, beside the utility's own: a mono kicker and the term
function d9_ind(ctx,cx,cy,term,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const k="industry model",kw=tw(ctx,k,28,500,"mono"),w=kw+tw(ctx,term,30,800)+64,h=56,col=[176,196,222];glass(ctx,cx-w/2,cy-h/2,w,h,12,col,{glow:8+12*(o.hi||0),ea:0.75,fill:"rgba(10,14,24,0.94)"});
  T(ctx,k,cx-w/2+20,cy+10,{f:"mono",w:500,size:28,color:rgba(col,0.9)});T(ctx,term,cx-w/2+kw+44,cy+11,{w:800,size:30,color:rgba(INK,0.97)});});}
// a data object, as ArchiMate draws it, in the information layer's peach: its name, and o.sub (0..1) a second line
function d9_obj(ctx,x,y,w,h,name,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,INF,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});ctx.fillStyle=rgba(INF,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,8);ctx.fill();
  archGlyph(ctx,"object",x+w-28,y+24,13,INF);const sv=sub?clamp(o.sv==null?1:o.sv,0,1):0;T(ctx,name,x+28,y+(sv>0.01?52:h/2+11),{w:800,size:32,color:rgba(INK,0.97)});
  if(sv>0.01)withA(ctx,sv,()=>T(ctx,sub,x+28,y+98,{w:700,size:28,color:rgba(mix(INF,INK,0.4),1)}));});}

/* ---------- the step, and what it expects ---------- */
// A stage of a value stream, as ArchiMate draws one: a chevron, in strategy's colour. o.first: flat at the back; o.lx, o.ly: where
// its name sits (default the middle); o.hi lights it.
function d9_chev(ctx,x,y,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=h*0.32,sz=o.size||34;
  const path=()=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-n,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w-n,y+h);ctx.lineTo(x,y+h);if(!o.first)ctx.lineTo(x+n,y+h/2);ctx.closePath();};
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(STR,0.6);ctx.shadowBlur=16+16*(o.hi||0);path();ctx.fillStyle="rgba(7,12,24,0.95)";ctx.fill();ctx.restore();
    path();ctx.fillStyle=rgba(STR,0.13+0.1*(o.hi||0));ctx.fill();ctx.strokeStyle=rgba(STR,0.9);ctx.lineWidth=2.4+1.5*(o.hi||0);path();ctx.stroke();
    archGlyph(ctx,"stream",x+(o.first?32:n+24),y+28,12,STR);
    T(ctx,label,o.lx==null?x+(o.first?w/2-n/4:w/2+n/4):o.lx,o.ly==null?y+h/2+sz*0.36:o.ly,{w:800,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco});});}
// a rule folded to its kind and id, for when it's there but isn't the subject (its kind names it a rule, so it needs no glyph);
// returns its width
function d9_rulePill(ctx,cx,cy,id,side,o){o=o||{};const a=o.a==null?1:o.a,s=d9_kind(id)+" · "+id,w=tw(ctx,s,28,500,"mono")+52,h=58;if(a<=0.01)return w;withA(ctx,a,()=>{
  glass(ctx,cx-w/2,cy-h/2,w,h,14,MOT,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.95)"});ctx.fillStyle=rgba(side,0.95);rr(ctx,cx-w/2+9,cy-h/2+12,6,h-24,3);ctx.fill();
  T(ctx,s,cx-w/2+30,cy+10,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});});return w;}
// the step's own steps, as business processes: an estimate, then replaced or explained; p brings them in, left to right
function d9_steps(ctx,x,cy,p,o){o=o||{};if(p<=0.01)return;let X=x;const q=i=>clamp(p*5-i,0,1),pill=(s,a)=>{const w=tw(ctx,s,28,700)+36;withA(ctx,a,()=>{glass(ctx,X,cy-23,w,46,23,BUS,{glow:8+12*(o.hi||0),ea:0.8,fill:"rgba(20,18,6,0.94)"});T(ctx,s,X+18,cy+10,{w:700,size:28,color:rgba(BUS,1)});});X+=w;};
  pill("estimate",q(0));withA(ctx,q(1),()=>{ctx.save();ctx.strokeStyle=rgba(BUS,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+10,cy);ctx.lineTo(X+40,cy);ctx.moveTo(X+31,cy-8);ctx.lineTo(X+40,cy);ctx.lineTo(X+31,cy+8);ctx.stroke();ctx.restore();});X+=50;
  pill("replace",q(2));X+=14;withA(ctx,q(3),()=>T(ctx,"or",X,cy+10,{w:600,size:28,color:rgba(SOFT,0.95)}));X+=tw(ctx,"or",28,600)+14;pill("explain",q(4));}
// what a step expects of its data: the dimension and where it comes from in a mono kicker, then what's expected (o.p writes it).
// g: the source's glyph, "clock" (a service level), "process" (its steps) or "requirement" (a rule)
function d9_expect(ctx,x,y,w,h,dim,src,text,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,INF,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(16,10,8,0.95)"});
  ctx.fillStyle=rgba(INF,0.08+0.08*(o.hi||0));rr(ctx,x,y,w,h,14);ctx.fill();d9_src(ctx,g,x+48,y+h/2,o.gl==null?1:o.gl);
  T(ctx,dim,x+96,y+44,{f:"mono",w:600,size:28,color:rgba(INF,1)});T(ctx,"· "+src,x+96+tw(ctx,dim+" ",28,600,"mono"),y+44,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
  const s=o.p==null?text:text.slice(0,Math.round(text.length*clamp(o.p,0,1)));T(ctx,s,x+96,y+88,{w:700,size:30,color:rgba(INK,0.97)});});}
// a source's glyph: a service level's clock, a process, or a requirement
function d9_src(ctx,g,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{if(g==="clock")d9_clock(ctx,x,y,30,MOT);else if(g==="requirement")d9_reqGlyph(ctx,x,y,22,MOT);else archGlyph(ctx,"process",x,y,26,BUS);});}

/* ---------- written once, checked everywhere ---------- */
// The tests generated from the data rule, RUL-020, as each tool writes its check that a reading's mark, its kind, is one of the two
// the readings hold: [title, lines]. Its id stands out in purple wherever it appears. (Each also requires the mark: the column can't
// be empty.)
const D9_GEN=[["dbt test",["data_tests:","  - accepted_values:","      arguments: {values: [actual, estimate]}","      config: {meta: {rule_id: RUL-020}}"]],
  ["data contract · quality rule",["- id: RUL-020","  metric: invalidValues","  arguments: {validValues: [actual, estimate]}","  mustBe: 0"]],
  ["shape for linked data",["ex:RUL-020 a sh:NodeShape ;","  sh:targetClass ex:Reading ;","  sh:property [ sh:path ex:kind ;",'    sh:in ( "actual" "estimate" ) ] .']]];
// and the tracking table generated from retail's rule, RUL-022, a model like any other: the bills the rule applies to that the next
// bill didn't correct, each with the rule's id and its owner's team, who work through it each morning
const D9_TRK=["select bill_id, next_bill_id,","       'RUL-022' as rule_id,","       'billing team' as owner","  from bills_on_replaced_estimates"," where not corrected_on_next_bill"];
// a padlock
function d9_lock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.15);ctx.beginPath();ctx.arc(x,y-s*0.18,s*0.36,Math.PI,0);ctx.stroke();rr(ctx,x-s*0.55,y-s*0.18,s*1.1,s*0.78,s*0.12);ctx.fill();ctx.restore();}
// a line of code, in mono, with a rule's id in purple
function d9_code(ctx,s,x,y,col){let X=x;s.split(/(RUL-0[0-9][0-9])/).forEach(p=>{if(!p)return;const id=/^RUL-0[0-9][0-9]$/.test(p);
  T(ctx,p,X,y,{f:"mono",w:id?700:500,size:28,color:id?rgba(MOT,1):col});X+=tw(ctx,p,28,id?700:500,"mono");});}
// a check generated from a rule, as a card of code: its title, a padlock with "generated", and its lines (o.p types them); o.lock
// (0..1) reddens the padlock, for a hand that tries to edit it; o.hiLine lights one line, by o.hl (0..1)
function d9_gen(ctx,x,y,w,h,title,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  if(o.hl>0.01){ctx.save();ctx.fillStyle=rgba(D9_RET,0.16*o.hl);rr(ctx,x+16,y+100+o.hiLine*34-27,w-32,36,8);ctx.fill();ctx.restore();}
  T(ctx,title,x+30,y+48,{w:800,size:30,color:rgba(mix(TECH,INK,0.45),1)});const lc=mix([150,166,190],D9_RED,o.lock||0),gw=tw(ctx,"generated",28,500,"mono");
  if(o.lock>0.01)glow(ctx,x+w-gw-60,y+40,40,D9_RED,0.6*o.lock);d9_lock(ctx,x+w-gw-60,y+40,24,lc);T(ctx,"generated",x+w-gw-28,y+50,{f:"mono",w:500,size:28,color:rgba(lc,1)});
  let left=lines.join(" ").length*(o.p==null?1:clamp(o.p,0,1));lines.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;if(s_)d9_code(ctx,s_,x+30,y+100+i*34,rgba(mix(TECH,INK,0.25),0.95));});});}
// a pencil, its tip at (x, y), lying down and to the right of it
function d9_pencil(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(0.72);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;
  ctx.fillStyle="#e9c46a";ctx.fillRect(30,-11,124,22);ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle="#d4a64a";ctx.fillRect(30,3,124,8);ctx.fillStyle="#f1dcb4";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(30,-11);ctx.lineTo(30,11);ctx.closePath();ctx.fill();
  ctx.fillStyle="#3a3f4a";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-3.7);ctx.lineTo(10,3.7);ctx.closePath();ctx.fill();ctx.fillStyle="#b8c0cc";ctx.fillRect(154,-11,16,22);ctx.fillStyle="#e79aa6";rr(ctx,170,-11,20,22,5);ctx.fill();ctx.restore();});}
// a result, round: a tick or a cross, in its colour
function d9_res(ctx,x,y,r,ok,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,col,0.3);ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.6);
  if(ok)tick_(ctx,x,y+1,r*1.2,col,1);else cross_(ctx,x,y,r*1.5,col,1);});}
// the sun, for a morning
function d9_sun(ctx,x,y,r,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r*0.42,0,TAU);ctx.fill();
  for(let i=0;i<8;i++){const an=i*TAU/8;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.66,y+Math.sin(an)*r*0.66);ctx.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r);ctx.stroke();}ctx.restore();}
// a pill with a glyph and a label: kind "mail" (an envelope), "team" (ArchiMate's actor), "ok" (a tick, for a test that passes) or
// "table" (a small table, for a tracking table); returns its width
function d9_pill(ctx,cx,cy,label,col,kind,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,label,30,700)+(kind?86:44),h=58;if(a<=0.01)return w;withA(ctx,a,()=>{glass(ctx,cx-w/2,cy-h/2,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(10,12,22,0.94)"});
  const gx=cx-w/2+36;if(kind==="mail"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineJoin="round";rr(ctx,gx-15,cy-11,30,22,3);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-15,cy-10);ctx.lineTo(gx,cy+2);ctx.lineTo(gx+15,cy-10);ctx.stroke();ctx.restore();}
  else if(kind==="team")archGlyph(ctx,"actor",gx,cy-2,14,col);
  else if(kind==="ok")tick_(ctx,gx,cy+1,26,D9_OK,1);
  else if(kind==="table"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;rr(ctx,gx-16,cy-13,32,26,3);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-16,cy-4);ctx.lineTo(gx+16,cy-4);
    ctx.moveTo(gx-16,cy+5);ctx.lineTo(gx+16,cy+5);ctx.moveTo(gx-4,cy-13);ctx.lineTo(gx-4,cy+13);ctx.stroke();ctx.restore();}
  T(ctx,label,cx-w/2+(kind?64:22),cy+11,{w:700,size:30,color:rgba(col,1)});});return w;}

/* ---------- generally, an ontology ---------- */
// The concepts, as the map holds them: [id, label, x, y]; how they relate: [from, to, label, where the label sits]; the rules about
// them: [id, concept, x, y]. Then one bill, as facts: what was said about it, and the correction nobody said.
const D9_ON=[["cp","connection point",260,330],["rd","reading",820,330],["bl","bill",1310,330],["ac","actual reading",580,590],["es","estimate",1060,590],["nb","next bill",1310,590]];
const D9_OE=[["rd","cp","taken at","above"],["bl","rd","based on","above"],["ac","rd","is a","left"],["es","rd","is a","right"],["es","ac","replaced by","below"],["bl","nb","corrected on","left"]];
const D9_OR=[["RUL-020","rd",820,196],["RUL-021","es",1060,740],["RUL-022","nb",1590,470]];
// a concept's chip: its width, for edges to stop at
function d9_termW(ctx,label){return tw(ctx,label,30,800)+82;}
// a relation between two chips, as an arrow with its name, drawn up to p; o.dash for one nobody said
function d9_rel(ctx,A,B,label,side,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,col=o.col||[176,190,220];withA(ctx,a,()=>{const[ax,ay,aw]=A,[bx,by,bw]=B,dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const ex=(w_,u,v)=>{const tx=u===0?1e9:(w_/2+6)/Math.abs(u),ty=v===0?1e9:36/Math.abs(v);return Math.min(tx,ty);},s0=ex(aw,ux,uy),s1=ex(bw,ux,uy),x0=ax+ux*s0,y0=ay+uy*s0,x1=bx-ux*s1,y1=by-uy*s1,q=ease(clamp(p,0,1)),xe=lerp(x0,x1,q),ye=lerp(y0,y1,q);
  ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";if(o.dash)ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(q>0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.42)*16,y1-Math.sin(an-0.42)*16);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.42)*16,y1-Math.sin(an+0.42)*16);ctx.stroke();}ctx.restore();
  const mx=(x0+x1)/2,my=(y0+y1)/2,la=clamp((p-0.5)*2,0,1);if(la>0)withA(ctx,la,()=>{const P={above:[mx,my-18,"center"],below:[mx,my+42,"center"],left:[mx-18,my+10,"right"],right:[mx+18,my+10,"left"]}[side];
    T(ctx,label,P[0],P[1],{w:700,size:28,align:P[2],color:rgba(mix(col,INK,0.35),1),deco:o.deco});});});}
// a fact about one thing: a chip in the information domain's peach, for an instance rather than a concept
function d9_inst(ctx,cx,cy,label,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,label,30,800)+56,h=60;if(a<=0.01)return w;withA(ctx,a,()=>{glass(ctx,cx-w/2,cy-h/2,w,h,12,INF,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});
  ctx.fillStyle=rgba(INF,0.1+0.1*(o.hi||0));rr(ctx,cx-w/2,cy-h/2,w,h,12);ctx.fill();T(ctx,label,cx,cy+11,{w:800,size:30,align:"center",color:rgba(INK,0.97)});});return w;}
// a verdict: who's asked, the question, and the answer, with its mark ("?" unknown, or a cross)
function d9_verdict(ctx,x,y,w,h,who,q,ans,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(8,10,20,0.95)"});
  T(ctx,who,x+30,y+46,{f:"mono",w:600,size:28,color:rgba(col,1)});T(ctx,q,x+30,y+96,{w:700,size:30,color:rgba(INK,0.9)});
  const v=o.v==null?1:o.v;if(v>0.01)withA(ctx,v,()=>{const mx=x+w-60,my=y+h/2;if(kind==="?"){ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(mx,my,30,0,TAU);ctx.fill();ring(ctx,mx,my,30,col,1,2.6);T(ctx,"?",mx,my+12,{w:800,size:34,align:"center",color:rgba(col,1)});}
    else d9_res(ctx,mx,my,30,false,col,1);T(ctx,ans,mx-50,y+96,{w:800,size:34,align:"right",color:rgba(col,1)});});});}
// one of the map's views, as a row: its glyph, its name and what it holds; on the right, a small picture of it (texture, drawn small on
// purpose), except the ontology's, which is the graph itself, shrunk into place; the checks' shows two passing tests and a tracking table
function d9_view(ctx,x,y,w,h,title,sub,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col={book:[214,226,240],object:INF,graph:[176,196,222],tick:TECH}[g];withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,16,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(8,11,20,0.95)"});const gx=x+52,gy=y+h/2;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.lineJoin="round";
  if(g==="book"){ctx.beginPath();ctx.moveTo(gx,gy-16);ctx.quadraticCurveTo(gx-11,gy-20,gx-20,gy-16);ctx.lineTo(gx-20,gy+16);ctx.quadraticCurveTo(gx-11,gy+12,gx,gy+16);ctx.quadraticCurveTo(gx+11,gy+12,gx+20,gy+16);ctx.lineTo(gx+20,gy-16);ctx.quadraticCurveTo(gx+11,gy-20,gx,gy-16);ctx.lineTo(gx,gy+16);ctx.stroke();}
  else if(g==="object")archGlyph(ctx,"object",gx,gy,22,col);
  else if(g==="graph"){[[-16,-12],[16,-14],[0,14]].forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(gx+dx,gy+dy,6,0,TAU);ctx.fill();});ctx.beginPath();ctx.moveTo(gx-16,gy-12);ctx.lineTo(gx+16,gy-14);ctx.lineTo(gx,gy+14);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.arc(gx,gy,18,0,TAU);ctx.stroke();ctx.restore();tick_(ctx,gx,gy+1,22,col,1);ctx.save();}
  ctx.restore();T(ctx,title,x+96,y+56,{w:800,size:34,color:rgba(INK,0.97)});T(ctx,sub,x+96,y+100,{w:600,size:28,color:rgba(mix(col,INK,0.3),0.95)});
  // the small picture
  const px=x+w-330,py=y+16,pw=300,ph=h-32;ctx.save();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.5;rr(ctx,px,py,pw,ph,10);ctx.stroke();ctx.restore();
  if(g==="book")[["reading",0],["estimate",1],["bill",2]].forEach(([s_,i])=>{const yy=py+28+i*32;T(ctx,s_,px+20,yy,{w:800,size:16,color:rgba(INK,0.85),deco:1});ctx.fillStyle=rgba(col,0.35);ctx.fillRect(px+120,yy-6,150-i*24,4);});
  else if(g==="object")[[px+24,py+18],[px+164,py+36]].forEach(([bx,by],i)=>{ctx.strokeStyle=rgba(INF,0.8);ctx.lineWidth=1.6;ctx.strokeRect(bx,by,112,58);ctx.beginPath();ctx.moveTo(bx,by+18);ctx.lineTo(bx+112,by+18);ctx.stroke();T(ctx,i?"bill":"meter reading",bx+8,by+14,{w:700,size:12,color:rgba(INK,0.85),deco:1});});
  else if(g==="tick")[0,1,2].forEach(i=>{const yy=py+24+i*32;if(i<2)tick_(ctx,px+28,yy,16,D9_OK,1);
    else{ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.5;ctx.strokeRect(px+17,yy-9,22,18);ctx.beginPath();ctx.moveTo(px+17,yy-3);ctx.lineTo(px+39,yy-3);ctx.moveTo(px+25,yy-9);ctx.lineTo(px+25,yy+9);ctx.stroke();}
    ctx.fillStyle=rgba(col,0.35);ctx.fillRect(px+50,yy-2,200-i*30,4);});});}

/* ---------- back in Khorasan ---------- */
// the 1,900 bills, found and corrected: the count as it rises (n), and a row of ticks
function d9_count(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,160,18,D9_OK,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,16,12,0.95)"});
  T(ctx,Math.round(n).toLocaleString("en-US"),x+30,y+82,{w:800,size:64,color:rgba(D9_OK,1)});T(ctx,"bills found and corrected",x+30,y+128,{w:700,size:28,color:rgba(mix(D9_OK,INK,0.4),1)});
  const tk=o.tk||0;for(let i=0;i<5;i++){const q=clamp(tk*5-i,0,1);if(q>0)tick_(ctx,x+w-150+i*28,y+52,22,D9_OK,q);}});}
/* ---------- a rule in ArchiMate 4 ---------- */
// The motivation elements ArchiMate 4 lists (Linked.Archi's comparison of 3.2 and 4.0, read 20 October 2026), as chips: [name,
// glyph]; the requirement in the middle. The film doesn't say whether the list is complete, and doesn't need to.
const D9_MOTS=[["stakeholder","stakeholder"],["driver","driver"],["requirement","requirement"],["goal","goal"],["principle","principle"]];
// a name ArchiMate has no element for: a dashed chip, struck through as st goes to 1
function d9_noEl(ctx,cx,cy,label,a,st){if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,label,30,700)+48,h=58;ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(SOFT,0.85);ctx.lineWidth=2.4;rr(ctx,cx-w/2,cy-h/2,w,h,h/2);ctx.stroke();ctx.restore();
  T(ctx,label,cx,cy+11,{w:700,size:30,align:"center",color:rgba(SOFT,0.95)});
  if(st>0){ctx.save();ctx.strokeStyle=rgba(D9_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-w/2+12,cy);ctx.lineTo(cx-w/2+12+(w-24)*ease(clamp(st,0,1)),cy);ctx.stroke();ctx.restore();}});}
// an element of the map around a rule: glass in its domain's colour, a mono kicker (its part of the rule, then its kind) and its
// glyph, then its name
function d9_hubEl(ctx,x,y,w,h,kicker,name,col,glyph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(9,9,22,0.95)"});
  ctx.fillStyle=rgba(col,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,8);ctx.fill();archGlyph(ctx,glyph,x+w-32,y+30,14,col);
  T(ctx,kicker,x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,name,x+24,y+h-24,{w:700,size:30,color:rgba(INK,0.97)});});}
// a relationship's name, as ArchiMate calls it: mono, on a dark plate, so it reads beside the lines
function d9_relName(ctx,x,y,label,a,o){o=o||{};if(a<=0.01)return;const w=tw(ctx,label,28,500,"mono"),al=o.align||"left",X=al==="center"?x-w/2:al==="right"?x-w:x;
  withA(ctx,a,()=>{ctx.fillStyle="rgba(7,8,20,0.9)";rr(ctx,X-10,y-29,w+20,40,8);ctx.fill();T(ctx,label,X,y,{f:"mono",w:500,size:28,color:rgba(o.col||MOT,1)});});}
// an association, as ArchiMate draws it: a plain line, drawn up to p
function d9_assoc(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1));ctx.save();ctx.strokeStyle=rgba(col,0.92);ctx.lineWidth=2.6;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,q),lerp(y0,y1,q));ctx.stroke();ctx.restore();});}
// a specialisation, as ArchiMate draws it: a solid line with a hollow triangle at the general end, (x1, y1), drawn up to p
function d9_spec(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),an=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0),xe=x0+Math.cos(an)*Math.max(0,L*q-20),ye=y0+Math.sin(an)*Math.max(0,L*q-20);
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();
  if(q>0.98){ctx.fillStyle="rgba(9,8,22,1)";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*22,y1-Math.sin(an-0.45)*22);ctx.lineTo(x1-Math.cos(an+0.45)*22,y1-Math.sin(an+0.45)*22);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();});}
// the place for a rule's checks, which the standard leaves open: dashed, with its question, until f (0..1) fills it with the checks
// that come from the rule
function d9_checks(ctx,x,y,w,h,f,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const q=clamp(f,0,1);
  if(q<1)withA(ctx,1-q,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();T(ctx,"how it's checked?",x+w/2,y+h/2+11,{w:700,size:30,align:"center",color:rgba(SOFT,0.95)});});
  if(q>0)withA(ctx,q,()=>{glass(ctx,x,y,w,h,14,TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});const tx=x+w/2-tw(ctx,"checks",30,700)/2+20;tick_(ctx,tx-34,y+h/2+1,26,D9_OK,1);T(ctx,"checks",tx,y+h/2+11,{w:700,size:30,color:rgba(TECH,1)});});});}

