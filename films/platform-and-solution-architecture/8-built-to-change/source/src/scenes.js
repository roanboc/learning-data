/* ===== Built to change: scenes =====
   Nine chapters, as in ../script.md. Japan, the 1860s: for over 250 years the Tōkaidō's stations have handed loads and travellers on,
   station to station. The road was kept by adjusting it: thirty-six horses at each station, then a hundred, and a hundred porters;
   then helper villages, made to send people and horses, called from further and further away, their duty grown to several hundred
   times what was set in 1694; in 1764 more than two hundred thousand farmers rose on the Nakasendō; in the 1860s armies took more
   than the stations could give. In 1872 the relay ended and Japan's first railway opened; the main line west, meant to cross the
   mountains, moved to the Tōkaidō's route; on the first of July 1889 the whole line opened, Tokyo to Kobe in about twenty hours.
   Then the utility: the storm tool's maker ends its support with twelve years of storms locked inside, and Ravi Menon builds so any
   part can change: build or buy, seams, a stage and a date for every part, a way out tried each year; the storm history kept; and the
   whole data practice on Tomás's map, from a data product's owner to its files.
   Made to read on a phone (tools/legible.py, site-tools/fits.py): text is at least 28 px in the frame and inside its box, and what's
   drawn small is texture. Motion: every shot drifts slowly and things arrive with a spring; on the map the camera glides; the utility's
   chapters glide on from one to the next in one room, where what stays stays put and only what changes fades; between rooms the whole
   picture dissolves. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in
   step. */

/* ---------- shared by the chapters ---------- */
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p8_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p8_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaWalker and psaHorse)
function p8_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}
// a light that travels along a path, with a fading trail: a load handed on along the road, a train on the line
function p8_runner(ctx,pts,u,col,o){o=o||{};if(u<=0||u>=1.0001&&!o.hold)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0||uu>1)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// lights going along a path one after the other, n of them, each taking per seconds, from t0: travellers on the road, armies on the march
function p8_flow(ctx,P,t,t0,n,per,r,a,col){if(a<=0.01||t<t0)return;withA(ctx,a,()=>{for(let i=0;i<n;i++){const s_=(t-t0)/per-i/n;if(s_<0)continue;p8_runner(ctx,P,s_%1,col||PSC,{r,trail:0.04});}});}
// a tick or a cross, drawn in strokes as p goes from 0 to 1, s across
function p8_mark(ctx,kind,x,y,s,p){if(p<=0.01)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=Math.max(3,s*0.16);const a=clamp(p*2,0,1),b=clamp(p*2-1,0,1);
  if(kind==="ok"){ctx.strokeStyle=rgba(PS_OK,1);ctx.beginPath();ctx.moveTo(x-s*0.42,y);ctx.lineTo(x-s*0.42+s*0.3*a,y+s*0.3*a);if(b>0)ctx.lineTo(x-s*0.12+s*0.55*b,y+s*0.3-s*0.62*b);ctx.stroke();}
  else{const h=s*0.34;ctx.strokeStyle=rgba(PS_RED,1);ctx.beginPath();ctx.moveTo(x-h,y-h);ctx.lineTo(x-h+2*h*a,y-h+2*h*a);if(b>0){ctx.moveTo(x+h,y-h);ctx.lineTo(x+h-2*h*b,y-h+2*h*b);}ctx.stroke();}
  ctx.restore();}
// a small pill: a name, a part, a step; o.dash draws an outline only; o.mark ("ok" or "no") a tick or a cross at its left, drawn as
// o.mp goes from 0 to 1; o.strike a line through it. Made from its words as drawn, at their size.
function p8_chipW(ctx,name,sz,o){o=o||{};return 30+tw(ctx,name,sz||28,700)+(o.mark?38:0);}
function p8_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p8_chipW(ctx,name,sz,o),h=sz+18,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    else glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,14,18,0.94)"});
    if(o.mark)p8_mark(ctx,o.mark,X+30,y,22,o.mp==null?1:o.mp);
    if(name)T(ctx,name,X+(o.mark?38:0)+(w-(o.mark?38:0))/2,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(o.dash?mix(col,INK,0.3):INK,0.96)});
    if(o.strike>0.01){ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+12,y);ctx.lineTo(X+12+(w-24)*clamp(o.strike,0,1),y);ctx.stroke();ctx.restore();}});return w;}
// chips in a row, centred on x, gap apart: [[text, col, a, o], ...]
function p8_row(ctx,x,y,items,gap){gap=gap||20;const ws=items.map(it=>p8_chipW(ctx,it[0],(it[3]||{}).size,it[3]||{})),tot=ws.reduce((s_,v)=>s_+v,0)+gap*(items.length-1);let xx=x-tot/2;
  items.forEach((it,i)=>{p8_chip(ctx,xx,y,it[0],Object.assign({col:it[1],a:it[2]},it[3]||{}));xx+=ws[i]+gap;});}
// a line through the points P, drawn up to p of its length, with a head at its end once it's whole; o.lw, o.glow, o.head, o.dash
function p8_len(S){const L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));return L;}
function p8_route(ctx,P,col,a,p,o){o=o||{};if(a<=0.01||p<=0)return;const L=p8_len(P),d=clamp(p,0,1)*L[L.length-1];withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  if(o.glow){ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=o.glow;}ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let end=P[0],an=0;
  for(let i=1;i<P.length;i++){if(L[i]<=d){ctx.lineTo(P[i][0],P[i][1]);end=P[i];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=lerp(P[i-1][0],P[i][0],f),y=lerp(P[i-1][1],P[i][1],f);ctx.lineTo(x,y);end=[x,y];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);break;}}
  ctx.stroke();ctx.shadowBlur=0;ctx.setLineDash([]);if(o.head!==false&&p>=0.98){const hs=o.head||9,[x,y]=end;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.5)*hs,y-Math.sin(an-0.5)*hs);ctx.lineTo(x-Math.cos(an+0.5)*hs,y-Math.sin(an+0.5)*hs);ctx.closePath();ctx.fill();}ctx.restore();});}
// a question mark, red: what nobody can see any more
function p8_q(ctx,x,y,a,s){if(a<=0.01)return;s=s||44;withA(ctx,a,()=>{glow(ctx,x,y,s,PS_RED,0.35);T(ctx,"?",x,y+s*0.36,{w:800,size:s,align:"center",color:rgba(PS_RED,1)});});}
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility checks' hook (legible.py,
// fits.py), as the agent films' pieces.js has it
let PH_OFF=0;
function p8_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// words over a chapter: [[from, to, text, colour], ...] as tags at the top, one at a time; and one chip under them
function p8_tags(ctx,t,x,y,L,size){L.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,x,y,s_,col,{align:"center",size:size||32})));}
function p8_under(ctx,t,x,y,L){L.forEach(([a0,a1,s_,col,o])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>p8_chip(ctx,x,y,s_,Object.assign({align:"center",col},o||{}))));}
// how much of a card's lines are typed by t, each line typed from its own time over d seconds (as psaCard's o.p wants it)
function p8_typed(t,L,at,d){d=d||0.6;const tot=L.join(" ").length;let n=0;L.forEach((l,i)=>{n+=(l.length+(i<L.length-1?1:0))*clamp((t-at[i])/d,0,1);});return clamp(n/tot,0,1);}
// a number with its thousands marked, typed as it grows
function p8_num(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
// a padlock, s across: closed, or its shackle lifted as open goes 0 to 1; red, or o.col
function p8_lock(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;const col=o.col||PS_RED,op=clamp(o.open||0,0,1);withA(ctx,a,()=>{ctx.save();glow(ctx,x,y,s*1.6,col,0.3+0.3*(o.hi||0));
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.13;ctx.lineCap="round";const sx=x,sy=y-s*0.18-op*s*0.3;ctx.beginPath();ctx.moveTo(sx-s*0.28,y-s*0.05);ctx.lineTo(sx-s*0.28,sy-s*0.12);ctx.arc(sx,sy-s*0.12,s*0.28,Math.PI,0);
  ctx.lineTo(sx+s*0.28,sy-s*0.12+op*s*0.22);ctx.stroke();ctx.fillStyle="rgba(20,8,10,0.96)";rr(ctx,x-s*0.42,y-s*0.08,s*0.84,s*0.62,s*0.1);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.1;rr(ctx,x-s*0.42,y-s*0.08,s*0.84,s*0.62,s*0.1);ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y+s*0.18,s*0.08,0,TAU);ctx.fill();ctx.fillRect(x-s*0.03,y+s*0.18,s*0.06,s*0.16);ctx.restore();});}
// a file, as the utility keeps it: a page with its corner folded, in the amber of what's the utility's own; s its height
function p8_file(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;const col=o.col||PSC,w=s*0.78;withA(ctx,a,()=>{ctx.save();if(o.hi)glow(ctx,x,y,s*1.3,col,0.45*o.hi);
  ctx.beginPath();ctx.moveTo(x-w/2,y-s/2);ctx.lineTo(x+w/2-s*0.24,y-s/2);ctx.lineTo(x+w/2,y-s/2+s*0.24);ctx.lineTo(x+w/2,y+s/2);ctx.lineTo(x-w/2,y+s/2);ctx.closePath();ctx.fillStyle="rgba(24,16,8,0.96)";ctx.fill();
  ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=Math.max(1.6,s*0.07);ctx.stroke();ctx.beginPath();ctx.moveTo(x+w/2-s*0.24,y-s/2);ctx.lineTo(x+w/2-s*0.24,y-s/2+s*0.24);ctx.lineTo(x+w/2,y-s/2+s*0.24);ctx.stroke();
  ctx.lineWidth=Math.max(1.2,s*0.05);ctx.strokeStyle=rgba(col,0.6);[0.1,0.26,0.42].forEach(k=>{ctx.beginPath();ctx.moveTo(x-w*0.3,y-s*0.08+k*s*0.7);ctx.lineTo(x+w*0.28,y-s*0.08+k*s*0.7);ctx.stroke();});ctx.restore();});}
// a small storm: a cloud with a bolt under it, the mark of a storm on the year it came in
function p8_storm(ctx,x,y,s,a,col){if(a<=0.01)return;col=col||AMBER;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(mix(col,[255,255,255],0.15),0.9);
  [[-0.28,0.02,0.26],[0.02,-0.12,0.32],[0.3,0.04,0.22]].forEach(([dx,dy,r])=>{ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();});ctx.fillRect(x-s*0.5,y,s*1.0,s*0.24);
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x+s*0.04,y+s*0.22);ctx.lineTo(x-s*0.16,y+s*0.62);ctx.lineTo(x,y+s*0.58);ctx.lineTo(x-s*0.08,y+s*0.92);ctx.lineTo(x+s*0.2,y+s*0.46);ctx.lineTo(x+s*0.04,y+s*0.5);ctx.lineTo(x+s*0.16,y+s*0.22);ctx.closePath();ctx.fill();ctx.restore();});}

/* ---------- the utility's room: Ravi, then Tomás beside him; the data platform on the utility's own storage ---------- */
// The utility's chapters share one room: Ravi at the left, Tomás beside him from build or buy on, a step behind; what they work on at
// the right. People are drawn at the film's own time, so they stay put where one chapter glides on from the next (the engine lays the
// end of one over the start of the other).
const P8_ME=[210,0.8],P8_TM=[500,0.74],P8_WHO=500;
function p8_people(ctx,t,sc,aR,aT){const T_=t+(sc.start||0);aR=aR==null?1:aR;aT=aT||0;
  psaWhole(ctx,aT,[P8_TM[0]-200,400,P8_TM[0]+200,1080],c=>person(c,"tomas",P8_TM[0],1010,P8_TM[1],{t:T_}),"tomas");
  psaWhole(ctx,aR,[P8_ME[0]-210,380,P8_ME[0]+210,1080],c=>person(c,"ravi",P8_ME[0],1030,P8_ME[1],{t:T_}));
  psaWho(ctx,P8_ME[0]-10,P8_WHO,"Ravi Menon","platform lead",TECH,aR);psaWho(ctx,P8_TM[0]+20,P8_WHO,"Tomás Herrera","enterprise architect",TECH,aT);}
// the data platform: a slab at the foot of the room, its name on its front face; under it, the utility's own storage, amber, where the
// tables are kept as files. Where the two meet is the seam (p8_seam). They stay from chapter to chapter.
const P8_PX=720,P8_PY=716,P8_PW=1120,P8_SY=794,P8_SH=54;
function p8_slab(ctx,a,o){o=o||{};if(a<=0.01)return;psaPlatform(ctx,P8_PX,P8_PY,P8_PW,40,{fh:38,sk:22,a,hi:o.hi||0});
  withA(ctx,a*(o.la==null?1:o.la),()=>T(ctx,o.name||"the data platform",P8_PX+30,P8_PY+40+29,{w:800,size:28,color:rgba(mix(TECC,INK,0.45),1)}));}
// the storage: the files it holds along its front: ten, and two more at its right end (o.nt, 0..1), the storm history's, which the new
// storm tool sends each night; o.hi lights them all, o.fh(i) one of them
const P8_FX=1150,P8_FD=58;
function p8_store(ctx,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const x=P8_PX,y=P8_SY,w=P8_PW-22,h=P8_SH;ctx.save();ctx.shadowColor=rgba(PSC,0.45+0.3*(o.hi||0));ctx.shadowBlur=16+16*(o.hi||0);
  ctx.fillStyle="rgba(22,15,8,0.96)";ctx.fillRect(x,y,w,h);ctx.shadowBlur=0;ctx.fillStyle=rgba(PSC,0.08+0.08*(o.hi||0));ctx.fillRect(x,y,w,h);ctx.strokeStyle=rgba(PSC,0.75+0.25*(o.hi||0));ctx.lineWidth=2.2;ctx.strokeRect(x,y,w,h);ctx.restore();
  withA(ctx,o.la==null?1:o.la,()=>T(ctx,"the utility's own storage",x+30,y+37,{w:800,size:28,color:rgba(mix(PSC,INK,0.3),1)}));
  for(let i=0;i<12;i++){const q=i<10?1:clamp(o.nt||0,0,1);if(q>0.01)p8_file(ctx,P8_FX+i*P8_FD,y+h/2,36,q,{hi:Math.max(o.hi||0,o.fh?o.fh(i):0)});}});}
// the seam: where the platform meets the files, a line of the utility's amber along it, drawn from the left as p goes 0 to 1
function p8_seam(ctx,a,p,hi){if(a<=0.01||p<=0)return;withA(ctx,a,()=>{const x0=P8_PX-14,x1=P8_PX+P8_PW-8,x=lerp(x0,x1,clamp(p,0,1));ctx.save();ctx.strokeStyle=rgba(PSC,1);ctx.lineWidth=4+2*(hi||0);ctx.lineCap="round";ctx.shadowColor=rgba(PSC,0.9);ctx.shadowBlur=14+14*(hi||0);
  ctx.setLineDash([16,10]);ctx.beginPath();ctx.moveTo(x0,P8_SY);ctx.lineTo(x,P8_SY);ctx.stroke();ctx.setLineDash([]);ctx.restore();});}
// a data product set down on the platform, in one of two places along it: hosting capacity's at the left, the storm history's at the
// right; o as psaBlock's (drop brings it down, owner its owner's gold tag)
const P8_SLOT=[780,1220],P8_BW=380,P8_BH=130,P8_BY=612;
function p8_prod(ctx,t,i,name,o){psaBlock(ctx,P8_SLOT[i],P8_BY,P8_BW,P8_BH,name,Object.assign({t,size:28},o||{}));}
// a dotted line from a data product down to its files: what it reads
function p8_reads(ctx,x0,y0,k,a,p){if(a<=0.01||p<=0)return;const x1=P8_FX+k*P8_FD,y1=P8_SY+8;p8_route(ctx,[[x0,y0],[x0,y0+(y1-y0)*0.45],[x1,y1-(y1-y0)*0.25],[x1,y1]],PSC,a*0.85,p,{lw:2.4,dash:[4,7],head:9});}

/* ---------- the storm tool, and what it holds ---------- */
// the control room's storm tool: an application, bought twelve years ago, with every storm inside it, a year to a box; o.yp (0..12)
// fills the years in, o.hide[i] (0..1) empties a year's box as it's brought out, o.lock (0..1) the lock on its side and o.open lifts its
// shackle; o.off (0..1) switches it off; o.rows (0..1 each) what it records, typed in
const P8_TX=780,P8_TY=250,P8_TW=470,P8_TH=330,P8_REC=["every storm","each fault","each line that failed"];
function p8_year(i){return[P8_TX+28+(i%6)*68,P8_TY+204+Math.floor(i/6)*58];}
function p8_tool(ctx,t,a,o){o=o||{};if(a<=0.01)return;const x=P8_TX,y=P8_TY,w=P8_TW,h=P8_TH,off=clamp(o.off||0,0,1);withA(ctx,a*(1-0.55*off),()=>{
  glass(ctx,x,y,w,h,14,mix(APPC,SOFT,0.6*off),{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});psaGlyph(ctx,"component",x+w-30,y+32,14,APPC);
  T(ctx,o.name||"the storm tool",x+24,y+48,{w:800,size:32,color:rgba(INK,0.97)});
  P8_REC.forEach((s_,i)=>{const q=o.rows?o.rows[i]:1;if(q<=0.01)return;const n=Math.round(s_.length*clamp(q,0,1));T(ctx,s_.slice(0,n),x+24,y+96+i*34,{w:700,size:28,color:rgba(SOFT,1)});});
  // the twelve years, a box each, a storm in each
  for(let i=0;i<12;i++){const q=clamp((o.yp==null?12:o.yp)-i,0,1)*(1-(o.hide?o.hide[i]:0));const[bx,by]=p8_year(i);ctx.save();ctx.strokeStyle=rgba(APPC,0.35);ctx.lineWidth=1.4;rr(ctx,bx,by,56,46,6);ctx.stroke();ctx.restore();
    if(q>0.01)p8_yearBox(ctx,bx,by,q,o.yhi?o.yhi[i]:0);}
  if(o.owner!==false)withA(ctx,o.ownerA==null?1:o.ownerA,()=>psaOwner(ctx,x,y+h+34,"control room"));});
  p8_lock(ctx,x+w,y+h/2+20,56,(o.lock||0)*a,{open:o.open||0,hi:o.lockHi||0});
  if(off>0.01)withA(ctx,a*off,()=>p8_chip(ctx,x+w/2,y+h/2+40,"switched off",{align:"center",col:SOFT}));}
// a year's box, as the tool holds it or as it's brought out: dark, edged in blue, a storm in it
function p8_yearBox(ctx,x,y,a,hi){withA(ctx,a,()=>{ctx.save();if(hi)glow(ctx,x+28,y+23,50,AMBER,0.4*hi);ctx.fillStyle="rgba(10,16,30,0.96)";rr(ctx,x,y,56,46,6);ctx.fill();ctx.strokeStyle=rgba(mix(APPC,AMBER,hi||0),0.9);ctx.lineWidth=1.8;rr(ctx,x,y,56,46,6);ctx.stroke();ctx.restore();
  p8_storm(ctx,x+28,y+14,26,1);});}
// Grace's engineers' work: the network's lines on a card, and the ones to strengthen, lit amber from the storms; o.pick (0..1) lights
// them, o.blind (0..1) takes the storms away, so the lines to strengthen can't be told and each pick is a question
const P8_NET=[[[40,160],[150,100],[260,130],[370,70]],[[40,160],[120,230],[250,250],[370,220]],[[150,100],[170,30]],[[260,130],[300,200],[370,220]],[[120,230],[110,290]]],P8_PICK=[0,3];
function p8_net(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,460,330,16,BUSC,{glow:12,ea:0.85,fill:"rgba(14,12,6,0.95)"});
  T(ctx,"WHICH LINES TO STRENGTHEN",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(BUSC,1)});const ox=x+40,oy=y+40,pk=clamp(o.pick||0,0,1),bl=clamp(o.blind||0,0,1);
  P8_NET.forEach((L,i)=>{const on=P8_PICK.indexOf(i)>=0?pk*(1-bl):0;ctx.save();ctx.strokeStyle=rgba(mix(SOFT,AMBER,on),0.55+0.45*on);ctx.lineWidth=3+3*on;ctx.lineCap="round";ctx.lineJoin="round";if(on>0.01){ctx.shadowColor=rgba(AMBER,0.8);ctx.shadowBlur=12*on;}
    ctx.beginPath();L.forEach(([px,py],k)=>k?ctx.lineTo(ox+px,oy+py):ctx.moveTo(ox+px,oy+py));ctx.stroke();ctx.restore();
    L.forEach(([px,py])=>{ctx.fillStyle=rgba(mix(SOFT,INK,0.3),0.9);ctx.beginPath();ctx.arc(ox+px,oy+py,5,0,TAU);ctx.fill();});});
  // the storms that mark where the lines failed; and, once they're gone, a question at each line that might need the work
  [[95,128],[205,104],[300,170]].forEach(([px,py],k)=>p8_storm(ctx,ox+px,oy+py-34,26,clamp(pk*1.5-k*0.25,0,1)*(1-bl)));
  [[95,128],[300,170],[200,240]].forEach(([px,py],k)=>p8_q(ctx,ox+px,oy+py-22,clamp(bl*1.6-k*0.3,0,1),36));
  withA(ctx,o.ownerA==null?1:o.ownerA,()=>psaOwner(ctx,x+440,y+302,"Grace",{align:"right"}));});}

/* ---------- the story: the road at dusk ---------- */
const P8_Y0=760,P8_G=784;
// a farmhouse of a helper village: low walls under a steep, thick thatch, its doorway lit from within; drawn in the series' silhouettes,
// light on dark, as its stations are
function p8_house(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  if(lit>0.01)glow(ctx,0,-50,150,PSC,0.14*lit);
  ctx.fillStyle="rgba(20,16,18,1)";ctx.fillRect(-92,-82,184,82);
  ctx.beginPath();ctx.moveTo(-116,-72);ctx.lineTo(-60,-180);ctx.lineTo(60,-180);ctx.lineTo(116,-72);ctx.quadraticCurveTo(0,-62,-116,-72);ctx.closePath();ctx.fillStyle="rgba(13,11,14,1)";ctx.fill();
  ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.35*lit),0.75);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-116,-72);ctx.lineTo(-60,-180);ctx.lineTo(60,-180);ctx.lineTo(116,-72);ctx.stroke();
  ctx.fillStyle="rgba(9,8,10,1)";ctx.fillRect(-66,-188,132,10);
  const g=ctx.createLinearGradient(0,-62,0,0);g.addColorStop(0,rgba(mix([40,30,28],[255,190,120],lit*0.85),0.95));g.addColorStop(1,rgba(mix([24,18,18],[140,90,60],lit*0.85),0.95));ctx.fillStyle=g;ctx.fillRect(-22,-62,44,62);
  ctx.restore();});}
// rice fields by the road, flooded, catching the last of the light: low banks between strips of water, x0 to x1
function p8_field(ctx,x0,x1,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();for(let i=0;i<4;i++){const yy=y+i*15,g=ctx.createLinearGradient(0,yy,0,yy+10);g.addColorStop(0,"rgba(226,160,112,0.32)");g.addColorStop(1,"rgba(110,80,72,0.06)");ctx.fillStyle=g;
  for(let k=0;k<3;k++){const xa=x0+k*(x1-x0)/3+6,xb=x0+(k+1)*(x1-x0)/3-6;ctx.fillRect(xa,yy,xb-xa,10);}ctx.fillStyle="rgba(24,19,18,1)";ctx.fillRect(x0,yy+10,x1-x0,5);}ctx.restore();});}
// what a station had to keep: a panel with a count and a grid of a hundred, shown lit up to shown (0..100)
function p8_count(ctx,x,y,label,shown,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,340,330,16,col,{glow:12,ea:0.85,fill:"rgba(16,12,8,0.94)"});
  T(ctx,label,x+24,y+44,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,String(Math.round(shown)),x+316,y+52,{w:800,size:44,align:"right",color:rgba(INK,0.97)});
  for(let i=0;i<100;i++){const cx=x+38+(i%10)*29,cy=y+92+Math.floor(i/10)*23,q=clamp(shown-i,0,1);ctx.fillStyle=q>0.01?rgba(mix(SOFT,col,q),0.35+0.6*q):rgba(SOFT,0.16);ctx.beginPath();ctx.arc(cx,cy,7,0,TAU);ctx.fill();}});}
// the helper villages' duty: the share set in 1694, a sliver, and what it grew to, several hundred times as long, drawn as p goes 0 to 1;
// over the dusk, dimmed
function p8_duty(ctx,a,p){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,180,236,1560,420,20,PSC,{glow:12,ea:0.85,fill:"rgba(12,10,12,0.95)"});
  const x=240,y1=380,y2=530;T(ctx,"THE HELPER VILLAGES' DUTY",x,300,{f:"mono",w:500,size:28,color:rgba(PSC,1)});
  ctx.save();ctx.shadowColor=rgba(PSC,0.7);ctx.shadowBlur=10;ctx.fillStyle=rgba(PSC,1);ctx.fillRect(x,y1-20,5,40);ctx.restore();T(ctx,"as set in 1694",x+30,y1+11,{w:700,size:30,color:rgba(INK,0.95)});
  const L=1440*easeCam(clamp(p,0,1));ctx.save();ctx.shadowColor=rgba(PS_RED,0.6);ctx.shadowBlur=16;ctx.fillStyle=rgba(PS_RED,0.9);ctx.fillRect(x,y2-20,Math.max(5,L),40);ctx.restore();
  withA(ctx,clamp(p*2-1,0,1),()=>T(ctx,"by the end: several hundred times as much",x,y2+76,{w:700,size:30,color:rgba(PS_RED,1)}));});}
// a coin with a square hole, as the coins of the time were, and a red cross over it: a horse taken, and not paid for
function p8_unpaid(ctx,x,y,r,a,xp){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();glow(ctx,x,y,r*2.6,PSC,0.28);ctx.fillStyle=rgba(mix(PSC,[255,236,200],0.25),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([120,84,50],0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,r*0.8,0,TAU);ctx.stroke();ctx.fillStyle="rgba(24,16,12,1)";ctx.fillRect(x-r*0.27,y-r*0.27,r*0.54,r*0.54);ctx.restore();p8_mark(ctx,"no",x,y,r*2.4,xp);});}

/* ---------- the story: Japan's map, the road's last years and the railway ---------- */
// the map's view for this film: Edo, the Nakasendō's northern stretch and Kobe all in the frame, above the captions
const P8_VIEW={lon:137.5,lat:35.55,k:330,cx:960,cy:500};
// the Nakasendō from Itabashi to Wada, whose 28 stations were to call on extra helper villages in 1764
const P8_ROSE=[[139.71,35.75],[139.62,35.91],[139.39,36.15],[139.00,36.32],[138.63,36.35],[138.30,36.25],[138.21,36.19]];
// the main line as first planned, along the Nakasendō through the mountains of the centre to Gifu; and where the mountains stopped it
const P8_PLAN=[[139.759,35.666],[139.71,35.75],[139.62,35.91],[139.39,36.15],[139.00,36.32],[138.63,36.35],[138.30,36.25],[138.08,36.07],[137.95,36.11],[137.69,35.84],[137.57,35.53],[137.50,35.49],[137.03,35.44],[136.757,35.41]],P8_X=[137.66,35.79];
// the Tōkaidō Main Line as it opened on the first of July 1889, by its stations: Shinbashi, Yokohama, Kōzu, Gotemba, Numazu, Shizuoka,
// Hamamatsu, Okazaki, Nagoya, Gifu, Ōgaki, Sekigahara, Maibara, along the lake to Ōtsu, Kyoto, Osaka and Kobe. Its first two points
// are the first railway, of 1872; P8_NGY is Nagoya
const P8_RAIL=[[139.759,35.666],[139.739,35.628],[139.631,35.451],[139.596,35.458],[139.531,35.354],[139.349,35.328],[139.214,35.276],[139.081,35.361],[138.935,35.301],[138.863,35.103],[138.68,35.143],[138.389,34.972],[138.176,34.835],[138.014,34.769],[137.735,34.703],[137.383,34.763],[137.164,34.926],[137.007,34.99],[136.911,35.129],[136.881,35.171],[136.799,35.299],[136.757,35.41],[136.612,35.367],[136.467,35.362],[136.291,35.315],[136.262,35.272],[135.961,35.023],[135.866,35.004],[135.759,34.985],[135.62,34.85],[135.497,34.703],[135.42,34.72],[135.18,34.68]],P8_NGY=19;
const RAILC=[206,220,240];
// a railway on the map: a steel line with its ties, drawn up to p (0..1); o.plan draws it as a plan only, dashed and faint
function p8_rail(ctx,P,p,a,z,o){o=o||{};if(a<=0.01||p<=0)return;withA(ctx,a,()=>{if(o.plan){psaPath(ctx,P,p,{col:RAILC,lw:3.2/z,glow:6,a:0.85,dash:[10/z,9/z]});return;}
  psaPath(ctx,P,p,{col:RAILC,lw:6.4/z,glow:12,a:0.95});psaPath(ctx,P,p,{col:[34,40,56],lw:2.6/z,glow:0,a:1,dash:[9/z,9/z]});});}
// the farmers of 1764: lights coming out of their villages and gathering on the Nakasendō, from t0
function p8_rise(ctx,v,t,t0,a,z){if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<110;i++){const d0=hash(i,305)*1.6,f=fin(t,t0+d0,0.5);if(f<=0.01)continue;
  const[hx,hy]=psaJP(138.7+hash(i,301)*1.0,35.92+hash(i,302)*0.56,v),u=hash(i,303),[gx,gy]=psaJP(lerp(139.05,139.5,u),lerp(36.3,36.1,u)+(hash(i,304)-0.5)*0.07,v),q=easeCam(clamp((t-t0-d0)/2.6,0,1)),x=lerp(hx,gx,q),y=lerp(hy,gy,q);
  glow(ctx,x,y,14/z,[255,200,140],0.45*f);ctx.fillStyle=rgba([255,226,190],f);ctx.beginPath();ctx.arc(x,y,2.8/z,0,TAU);ctx.fill();}});}
// a load handed on along the road, station to station: it hops from one station to the next and rests there a moment, every per seconds
// from t0; dir 1 from Edo, -1 from Kyoto. Returns where it is, and the station it last reached
function p8_hop(TK,t,t0,per,dir){const n=TK.length,s_=(t-t0)/per;if(s_<0)return null;const k=Math.floor(s_),m=easeCam(clamp((s_-k)/0.55,0,1)),i0=dir>0?k%(n-1):(n-1)-k%(n-1),i1=i0+dir;
  return{x:lerp(TK[i0][0],TK[i1][0],m),y:lerp(TK[i0][1],TK[i1][1],m),at:m>=1?i1:i0,since:(s_-k)*per-0.55*per};}
function p8_load(ctx,h,z,col){if(!h)return;glow(ctx,h.x,h.y,30/z,col||[255,226,170],0.6);ctx.fillStyle=rgba([255,240,214],1);ctx.beginPath();ctx.arc(h.x,h.y,5/z,0,TAU);ctx.fill();}

/* ---------- 1. Kept for 250 years ---------- */
scene("kept",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tKe=c("kept"),tHe=c("helpers"),tGr=c("grew"),tFa=c("far"),tTi=c("times"),tRo=c("rose"),tBr=c("broke"),tNe=c("need"),tEn=c("ended"),tRt=c("route"),tWh=c("whole"),tO1=c("one"),tRa=c("ravi");
  // which room: the map; the road at dusk, by a station; the map again; then the utility. Under the title, the last room leaves whole
  const outA=1-fin(t,B+0.9,0.7),r1=fin(t,tKe-1.0,0.9),m2=fin(t,tRo-1.0,0.9),u1=fin(t,tO1-0.8,0.9);
  const mA=Math.max(1-r1,m2*(1-u1))*outA,rA=r1*(1-m2)*outA,uA=u1*outA;if(outA<1)p8_base(ctx,S);
  const late=t>tRo-1.0,t86=w("route","eighteen eighty-six");
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.2});ctx.save();
    const CK=late?[[tRo-1.0,1360,360,1.55],[tBr-0.8,930,540,1.0],[w("ended","first railway")-1.0,1500,500,1.9],[tRt-0.4,975,520,1.0],[tWh-0.6,960,540,1.0]]:[[0,1040,520,0.96],[w("year","Tōkaidō's")-0.6,1000,540,1.0]],z=focusZ(t,CK,2.2);focus(ctx,t,CK,2.2);
    const v=P8_VIEW,J=p=>psaJP(p[0],p[1],v),TK=PSA_TKD.map((s_,i)=>psaTkd(i,v));
    // the relay: in the early room a load handed on from Edo, and one from Kyoto; later, after the armies, one that barely moves
    const h1=late?null:p8_hop(TK,t,w("year","Tōkaidō's")-0.2,0.34,1),h2=late?null:p8_hop(TK,t,w("year","Tōkaidō's")+0.4,0.34,-1),
      tOut=tBr+1.2,lit=i=>{if(!late)return[h1,h2].reduce((m,h)=>h&&h.at===i?Math.max(m,clamp(1-h.since/1.2,0,1)):m,0)*0.9;
        return 0.85*fin(t,tBr-0.6,0.6)*(1-fin(t,tOut+i*0.07,0.5));};
    // the land, then the five roads and the Tōkaidō's stations, drawn here so they can dim: the other roads as the railway comes, the
    // Tōkaidō once its relay has ended
    psaMap(ctx,v,t,{lit:0.3,roads:0,tkd:0,st:0,ends:0,names:false});
    const rp=late?1:clamp((t-0.6)/2.4,0,1),rdA=late?0.6*(1-0.6*fin(t,tRt-0.6,0.8)):1,tkA=late?1-0.62*fin(t,tEn-0.2,1.2):1,st=late?1:fin(t,w("year","Tōkaidō's")-0.4,0.8),ends=fin(t,0.6,0.8);
    PSA_ROADS.forEach(([nm,pts],k)=>psaPath(ctx,pts.map(J),clamp(rp*1.4-k*0.12,0,1),{col:mix(PSC,[255,226,180],0.2),lw:3.2,glow:10,a:0.8*rdA}));
    psaPath(ctx,TK,1,{lw:4.4,a:0.95*tkA});TK.forEach(([x,y],i)=>{if(i===0||i===TK.length-1)return;const q=clamp(st*1.2-i/TK.length*0.2,0,1);psaStop(ctx,x,y,{a:q*(0.4+0.6*tkA),lit:lit(i),r:4.2});});
    psaStop(ctx,TK[0][0],TK[0][1],{a:ends,lit:1,r:9});psaStop(ctx,TK[TK.length-1][0],TK[TK.length-1][1],{a:ends,lit:1,r:9});
    // 1764: the Nakasendō's stretch that was to send more helpers, in red, and the farmers who rose, gathering on it
    const rsA=late?1-fin(t,tBr-0.8,0.6):0;if(rsA>0.01){psaPath(ctx,P8_ROSE.map(J),clamp((t-w("rose","Nakasendō")+0.3)/1.2,0,1),{col:PS_RED,lw:5/z+1,glow:14,a:0.95*rsA});
      p8_rise(ctx,v,t,w("rose","two hundred thousand")-0.9,rsA,z);const[nx,ny]=J([138.95,36.47]);psaName(ctx,"the Nakasendō",nx,ny,{a:rsA*fin(t,w("rose","Nakasendō")-0.2,0.5),size:30/z,align:"center",color:rgba(PS_RED,1)});}
    // the 1860s: armies on the march along the Tōkaidō, westward; behind them, each station's lantern goes out
    const arA=late?fin(t,w("broke","armies")-0.4,0.5)*(1-fin(t,tNe-0.2,0.8)):0;p8_flow(ctx,TK,t,w("broke","armies")-0.3,9,5.5,4.6/z,arA,PS_RED);
    // the relay at its limit: the road strained red, a load crawling along it
    const nA=late?fin(t,tNe-0.3,0.6)*(1-fin(t,tEn-0.3,0.6)):0;if(nA>0.01){psaPath(ctx,TK,1,{col:PS_RED,lw:5.4/z,glow:18,a:nA*(0.55+0.3*Math.sin(t*3.2))});p8_load(ctx,p8_hop(TK,t,tNe-0.2,1.6,1),z,PS_RED);}
    // 1872: the first railway, Shinbashi to Yokohama, and a train on it
    const tR1=w("ended","first railway"),R1=P8_RAIL.slice(0,3).map(J);if(late&&t>tR1-0.4){p8_rail(ctx,R1,clamp((t-tR1+0.2)/1.0,0,1),1,z);
      const u=((t-tR1-0.8)/2.4)%2;if(t>tR1+0.8)p8_runner(ctx,R1,u<1?u:2-u,[230,240,255],{r:4.5/z,trail:0.2,hold:true});}
    // the main line west as planned, through the mountains, and where they stopped it; then, from 1886, along the Tōkaidō to Nagoya
    const pA=late?fin(t,w("route","main line")-0.3,0.5)*(1-fin(t,w("route","Nagoya")-0.2,0.9)):0;if(pA>0.01){p8_rail(ctx,P8_PLAN.map(J),clamp((t-w("route","main line")+0.1)/2.2,0,1),pA,z,{plan:true});
      const[xx,xy]=J(P8_X),xa=clamp((t-w("route","far harder"))/0.6,0,1);if(xa>0.01){glow(ctx,xx,xy,60/z,PS_RED,0.4*xa*pA);withA(ctx,pA,()=>p8_mark(ctx,"no",xx,xy,46/z,xa));}
      psaName(ctx,"the mountains",xx,xy-42/z,{a:pA*fin(t,w("route","mountains")-0.2,0.5),size:30/z,align:"center",color:rgba(PS_RED,1)});}
    const nyA=late?fin(t,w("route","Nagoya")-0.4,0.5)*(1-fin(t,w("whole","whole line")+1.2,0.6)):0;p8_rail(ctx,P8_RAIL.slice(0,P8_NGY+1).map(J),clamp((t-w("route","Nagoya")+0.3)/1.8,0,1),nyA,z,{plan:true});
    // the first of July 1889: the whole line, and a train from Tokyo to Kobe; a traveller's light on the old road, far behind
    const tWl=w("whole","whole line"),RL=P8_RAIL.map(J);if(late&&t>tWl-0.4){p8_rail(ctx,RL,clamp((t-tWl+0.3)/2.4,0,1),1,z);
      p8_runner(ctx,RL,clamp((t-w("whole","Tokyo to Kobe")+0.1)/3.4,0,1),[230,240,255],{r:6/z,trail:0.16,hold:true});
      const wf=fin(t,w("whole","two weeks")-0.5,0.5);if(wf>0.01)withA(ctx,wf,()=>p8_runner(ctx,TK,clamp((t-w("whole","two weeks")+0.5)/80,0,1)+0.004,PSC,{r:5/z,trail:0.01,hold:true}));}
    // the places: Edo, then Tokyo; Kyoto; Yokohama for the first railway; Nagoya, Osaka and Kobe for the whole line
    const[ex,ey]=TK[0],[kx,ky]=TK[TK.length-1],nm=(s_,x,y,a,al)=>psaName(ctx,s_,x,y,{a,size:34/z,align:al||"left"}),toT=late?fin(t,tEn-0.2,0.6):0,nA0=fin(t,0.6,0.8);
    nm("Edo",ex+22/z,ey-14/z,nA0*(1-toT)*(late?1-fin(t,tRo-1.0,0.1)*0:1));nm("Tokyo",ex+22/z,ey-14/z,toT);nm("Kyoto",kx,ky-30/z,nA0,"center");
    if(late){const yk=J(P8_RAIL[2]);psaName(ctx,"Yokohama",yk[0]-18/z,yk[1]+30/z,{a:fin(t,tR1-0.2,0.5)*(1-fin(t,tRt-0.6,0.5)),size:30/z,align:"right"});
      const wn=fin(t,tWl+0.6,0.6),ng=J(P8_RAIL[P8_NGY]),os=J(P8_RAIL[30]),kb=J(P8_RAIL[32]);nm("Nagoya",ng[0]-16/z,ng[1]+46/z,Math.max(wn,fin(t,w("route","Nagoya")-0.2,0.5)),"right");nm("Osaka",os[0]-16/z,os[1]-16/z,wn,"right");nm("Kobe",kb[0],kb[1]+44/z,wn,"center");}
    else{const lp=J([138.3,34.75]);psaName(ctx,"the Tōkaidō",lp[0],lp[1]+40,{a:fin(t,w("year","Tōkaidō's")-0.2,0.6)*(1-fin(t,tKe-1.4,0.4)),size:32,align:"center",color:rgba(PSC,1)});
      h1&&p8_load(ctx,h1,z);h2&&p8_load(ctx,h2,z);}
    ctx.restore();
    if(!late){eaYear(ctx,80,80,"Japan · the 1860s",CLAY,fin(t,0.5,0.8));
      p8_tags(ctx,t,960,120,[[w("year","two hundred and fifty")-0.3,tKe-0.9,"for over 250 years: station to station",PSC]]);
      p8_under(ctx,t,960,186,[[w("year","handed")-0.2,tKe-0.9,"loads and travellers, handed on",PSC]]);}
    else{eaYear(ctx,80,80,t<tBr-0.4?"1764":t<tEn-0.3?"the 1860s":t<tRt-0.3?"1872":t<t86-0.2?"the 1880s":t<tWh-0.3?"1886":"1889",CLAY,fin(t,tRo-0.6,0.6)*(1-fin(t,tO1-0.9,0.4)));
      p8_tags(ctx,t,960,120,[[tRo-0.6,tBr-0.4,"on the Nakasendō, the farmers rose",PS_RED],[tBr-0.2,tNe-0.4,"armies on the march",PS_RED],[tNe-0.2,tEn-0.4,"the relay couldn't be stretched any further",PS_RED],
        [tEn-0.2,tRt-0.4,"the relay ends",PSC],[tRt-0.2,t86-0.3,"the main line west: through the mountains",RAILC],[t86-0.1,tWh-0.4,"to Nagoya, along the Tōkaidō's route",RAILC],[tWh-0.2,tO1-0.9,"the whole line opens",RAILC]]);
      p8_under(ctx,t,960,186,[[w("rose","new demand")-0.2,tBr-0.4,"against a new demand to carry",PS_RED],[w("broke","took more")-0.2,w("broke","money ran out")-0.3,"more than the stations could give",PS_RED],
        [w("broke","money ran out")-0.1,tNe-0.4,"and their money ran out",PS_RED],[w("need","needed")-0.2,tEn-0.4,"the country needed more, faster, than horses",PS_OK],[w("ended","freed")-0.2,tR1-0.3,"the helper villages, freed",PS_OK],
        [tR1-0.1,tRt-0.4,"Japan's first railway: Tokyo to Yokohama",RAILC],[w("route","far harder")-0.2,t86-0.3,"far harder than expected",PS_RED]]);
      // the count of those who rose, as it's said
      const kA=fin(t,w("rose","two hundred thousand")-0.4,0.6)*(1-fin(t,tBr-0.5,0.5));if(kA>0.01)arrive(ctx,400,390,t,w("rose","two hundred thousand")-0.4,()=>{glass(ctx,140,300,520,190,18,PS_RED,{glow:12,ea:0.8,fill:"rgba(16,8,8,0.95)"});
        T(ctx,"MORE THAN",166,344,{f:"mono",w:500,size:28,color:rgba(PS_RED,1)});T(ctx,p8_num(200000*easeCam(clamp((t-w("rose","two hundred thousand")+0.2)/1.8,0,1))),166,422,{w:800,size:60,color:rgba(INK,0.98)});
        T(ctx,"farmers rose",166,468,{w:700,size:28,color:rgba(SOFT,1)});},{dy:-10});
      // twenty hours by the line, two weeks on foot
      const tTw=w("whole","twenty hours");withA(ctx,fin(t,tTw-0.4,0.5)*(1-fin(t,tO1-0.9,0.4)),()=>p8_row(ctx,960,186,[["Tokyo to Kobe: about 20 hours",PS_OK,1],["Kyoto, on foot: two weeks",PSC,fin(t,w("whole","two weeks")-0.3,0.5)]],22));}}],
  /* the road at dusk, by a station: its horses and porters, counted; the helper villages sending theirs; travel growing, a lord's
     procession, a horse taken without paying; further along, fields left behind; and the duty, grown */
  [rA,ctx=>{psaDusk(ctx,S,{d:1,y0:P8_Y0});ctx.save();drift(ctx,t-tKe+1.0,{dur:40},{z:0.016,y:640,x:900});
    const pan=420*easeCam(clamp((t-tFa+0.6)/2.6,0,1));ctx.translate(-pan,0);
    [[130,1.05,3],[1870,0.95,5],[2280,1.0,7]].forEach(([x,s,k])=>psaPine(ctx,x,P8_Y0+2,s,k,{rim:PSC}));
    // the helper villages, on the hill behind, lit as they're called on; and the one further away, beyond the fields
    const hvA=fin(t,w("helpers","nearby villages")-0.5,0.6);[[110,0.34],[220,0.32],[320,0.3]].forEach(([x,s],i)=>p8_house(ctx,x,696-i*4,s,{a:hvA,lit:0.4+0.6*pulseAt(t,w("helpers","nearby villages")+i*0.25,1.6)+0.3}));
    p8_house(ctx,2150,692,0.3,{a:fin(t,tFa+0.6,0.6),lit:1});p8_field(ctx,1940,2330,834,fin(t,tFa-0.2,0.8));
    // travel growing: travellers on the far side of the road, going both ways, passing behind the station
    const tTr=tGr-0.8;if(t>tTr)for(let i=0;i<9;i++){const dir=i%2?1:-1,s=0.5,v=psaPace("walker",s,0.55),x=(dir>0?140+i*150:1900-i*140)+dir*v*(t-tTr);psaWalker(ctx,x,P8_Y0+4,s,t,{kind:i%3?"walker":"pilgrim",dir,ph:hash(i,9),rate:0.55,a:fin(t,tTr+i*0.25,0.6)});}
    psaStation(ctx,760,P8_Y0+2,0.95,{lit:1});
    // the station's porters and horses, more of them once it keeps a hundred of each; two of its horses led away by a lord's man, unpaid
    const more=fin(t,w("kept","then a hundred")-0.1,0.6),mp=fin(t,w("kept","hundred porters")-0.1,0.6);
    [[1080,0.86,-1,0.1,1],[1150,0.84,1,0.5,mp],[1215,0.84,-1,0.8,mp]].forEach(([x,s,d,ph,a])=>psaWalker(ctx,x,P8_G-4,s,t,{kind:"porter",dir:d,still:true,ph,a}));
    psaHorse(ctx,1320,P8_G-8,0.6,t,{dir:-1,still:true,pack:true,ph:0.2});psaHorse(ctx,1440,P8_G-10,0.58,t,{dir:1,still:true,ph:0.7,a:more});
    const tTk=w("grew","lords")-0.3,vh=psaPace("horse",0.58,0.6),vs=psaPace("walker",0.86,0.55);
    {const[d,amp]=p8_go(t,tTk+0.4,tTk+30,vh);psaHorse(ctx,1560+d,P8_G-10,0.58,t,{dir:1,still:amp<=0.001,amp,pack:true,ph:0.4,a:more,rate:0.6});}
    {const[d,amp]=p8_go(t,tTk+0.7,tTk+30,vh);psaHorse(ctx,1680+d,P8_G-12,0.56,t,{dir:1,still:amp<=0.001,amp,ph:0.1,a:more,rate:0.6});}
    {const[d,amp]=p8_go(t,tTk,tTk+30,vs);if(t>tTk-0.6)psaWalker(ctx,1810+d,P8_G+6,0.86,t,{kind:"spear",dir:1,ph:0.3,amp,still:amp<=0.001,rate:0.55,a:fin(t,tTk-0.6,0.5)});}
    p8_unpaid(ctx,1640,560,22,fin(t,w("grew","without paying")-0.4,0.5)*(1-fin(t,tTi-0.6,0.5)),clamp((t-w("grew","without paying"))/0.5,0,1));
    // the helpers: people and a horse from the villages, walking in to the station
    const tH=w("helpers","people and horses")-1.2;[[-80,0.82,"walker",0.1],[-190,0.82,"porter",0.6],[-330,0.8,"walker",0.35]].forEach(([x0,s,k,ph],i)=>{const v=psaPace("walker",s,0.55),[d,amp]=p8_go(t,tH+i*0.3,tH+i*0.3+9.5,v);if(t>tH+i*0.3)psaWalker(ctx,x0+d,P8_G+8,s,t,{kind:k,dir:1,ph,amp,still:amp<=0.001,rate:0.55});});
    {const v=psaPace("horse",0.58,0.6),[d,amp]=p8_go(t,tH+0.5,tH+10,v);if(t>tH+0.5)psaHorse(ctx,-120+d,P8_G+4,0.58,t,{dir:1,amp,still:amp<=0.001,ph:0.3,rate:0.6});}
    // farmers from the fields, carrying other people's loads to the station
    const tFm=w("far","farmers")-0.6;[[2060,0.84,0.2],[2190,0.82,0.65]].forEach(([x0,s,ph],i)=>{const v=psaPace("walker",s,0.55),[d,amp]=p8_go(t,tFm+i*0.5,tFm+i*0.5+12,v);if(t>tFm-0.6)psaWalker(ctx,x0-d,P8_G+10,s,t,{kind:"porter",dir:-1,ph,amp,still:amp<=0.001,rate:0.55,a:fin(t,tFm-0.6,0.5)});});
    withA(ctx,fin(t,w("far","further away")-0.2,0.5)*(1-fin(t,tTi-0.6,0.5)),()=>p8_chip(ctx,2150,560,"40 km away, and more",{align:"center",col:AMBER}));
    ctx.restore();
    // the station's count: thirty-six horses, then a hundred, and a hundred porters
    const cA=fin(t,w("kept","thirty-six")-0.5,0.6)*(1-fin(t,tHe-0.5,0.6)),hN=36*fin(t,w("kept","thirty-six")-0.3,0.9)+64*easeCam(clamp((t-w("kept","then a hundred")+0.1)/1.2,0,1)),pN=100*easeCam(clamp((t-w("kept","hundred porters")+0.1)/1.2,0,1));
    if(cA>0.01){arrive(ctx,1280,390,t,w("kept","thirty-six")-0.5,()=>p8_count(ctx,1110,232,"HORSES",hN,PSC,cA),{dy:-10});withA(ctx,fin(t,w("kept","hundred porters")-0.4,0.5),()=>arrive(ctx,1660,390,t,w("kept","hundred porters")-0.4,()=>p8_count(ctx,1490,232,"PORTERS",pN,SOFT,cA),{dy:-10}));}
    // the duty: as set in 1694, and several hundred times that
    p8_duty(ctx,fin(t,tTi-0.4,0.6)*(1-fin(t,tRo-1.1,0.5)),clamp((t-w("times","several hundred")+0.4)/1.8,0,1));
    eaYear(ctx,80,80,"on the Tōkaidō",CLAY,fin(t,tKe-0.6,0.6)*(1-fin(t,tTi-0.5,0.4)));
    p8_tags(ctx,t,960,120,[[tKe-0.6,tHe-0.4,"the road, kept by adjusting it",PSC],[tHe-0.2,tGr-0.4,"nearby villages had to send people and horses",AMBER],[tGr-0.2,tFa-0.4,"travel kept growing",AMBER],[tFa-0.2,tTi-0.5,"helper villages, called from further away",PS_RED]]);
    p8_under(ctx,t,960,186,[[w("helpers","helper villages")-0.2,tGr-0.4,"the helper villages",PSC],[w("grew","lords")-0.2,tFa-0.4,"lords and nobles took horses without paying",PS_RED],[w("far","farmers")-0.2,tTi-0.5,"farmers left their fields to carry others' loads",PS_RED]]);}],
  /* the utility: a storm tool whose maker is ending its support, twelve years locked inside; then Ravi, and a platform where a part can
     change while what's the utility's own stays */
  [uA,ctx=>{p8_room(ctx,S,t);ctx.save();drift(ctx,t-tO1+0.8,{dur:24},{z:0.016,y:500,x:1100});
    const tRv=w("ravi","any part"),bA=fin(t,tRa-0.4,0.7),tlA=fin(t,tO1-0.4,0.7)*(1-fin(t,tRa-0.3,0.7));
    p8_tool(ctx,t,tlA,{yp:12*easeCam(clamp((t-w("one","twelve years")+0.3)/1.4,0,1)),lock:fin(t,w("one","locked inside")-0.3,0.5),lockHi:pulseAt(t,w("one","locked inside"),1.4)});
    withA(ctx,tlA*fin(t,w("one","ending its support")-0.3,0.5),()=>p8_chip(ctx,1330,330,"its maker: support ends",{col:PS_RED,mark:"no",mp:clamp((t-w("one","ending its support"))/0.5,0,1)}));
    // the platform on the utility's own storage; a part on it changes, and the utility's files stay where they are
    p8_store(ctx,bA,{hi:pulseAt(t,w("ravi","utility's own"),1.6)});p8_slab(ctx,bA);
    const sw=clamp((t-tRv-0.1)/1.0,0,1),nw=clamp((t-tRv-0.8)/0.9,0,1);
    if(sw<1)withA(ctx,1-sw,()=>{ctx.save();ctx.translate(sw*160,0);p8_prod(ctx,t,1,"a part",{a:bA});ctx.restore();});
    if(nw>0)p8_prod(ctx,t,1,"a new part",{drop:nw,hi:pulseAt(t,tRv+1.4,1.4)});
    p8_reads(ctx,P8_SLOT[1]+190,P8_BY+P8_BH,4,bA*(sw<1?1-sw:nw),1);
    psaWhole(ctx,fin(t,tRa-0.6,0.7),[0,380,420,1080],cx=>person(cx,"ravi",P8_ME[0],1030,P8_ME[1],{t}));psaWho(ctx,P8_ME[0]-10,P8_WHO,"Ravi Menon","platform lead",TECH,fin(t,w("ravi","Ravi")-0.2,0.6));
    ctx.restore();
    p8_tags(ctx,t,1260,120,[[tO1+0.2,tRa-0.4,"a tool's maker ends its support",PS_RED],[tRa-0.2,9999,"so any part can change",PSC]]);
    p8_under(ctx,t,1260,186,[[w("one","twelve years")-0.2,tRa-0.4,"twelve years of storms, locked inside",PS_RED],[w("ravi","utility's own")-0.2,9999,"and what's the utility's own goes with it",PSC]]);}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"Built to change","any part can change, and what's yours goes with it","Film 8 of 8 · platform and solution architecture");});
/* ---------- the utility's chapters: what they share ---------- */
// hosting capacity, on the platform from build or buy on: owned by network, reading the first of the utility's files
function p8_hosting(ctx,t,o){o=o||{};p8_prod(ctx,t,0,"hosting capacity",Object.assign({owner:"network"},o));if(o.reads!==false)p8_reads(ctx,P8_SLOT[0]+330,P8_BY+P8_BH,0,o.ra==null?(o.a==null?1:o.a):o.ra,o.rp==null?1:o.rp);}
// a part that isn't there for good, drawn dashed: another engine that reads the same files
function p8_ghost(ctx,x,y,w,h,name,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.78)";rr(ctx,x,y,w,h,10);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.setLineDash([10,8]);rr(ctx,x,y,w,h,10);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  T(ctx,name,x+w/2,y+h/2+10,{w:800,size:28,align:"center",color:rgba(mix(col,INK,0.4),0.96)});});}
// a part in the drawing of a seam: a box, its name in the middle
function p8_part(ctx,x,y,w,h,name,col,o){o=o||{};glass(ctx,x,y,w,h,14,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.save();ctx.fillStyle=rgba(col,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,14);ctx.fill();ctx.restore();
  T(ctx,name,x+w/2,y+h/2+10,{w:800,size:28,align:"center",color:rgba(INK,0.96)});}
// the new storm tool, the control room's: an application, its owner's tag inside it
function p8_newtool(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,350,140,12,APPC,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.save();ctx.fillStyle=rgba(APPC,0.1+0.08*(o.hi||0));rr(ctx,x,y,350,140,12);ctx.fill();ctx.restore();
  psaGlyph(ctx,"component",x+322,y+28,13,APPC);T(ctx,"the new storm tool",x+22,y+50,{w:800,size:28,color:rgba(INK,0.97)});
  withA(ctx,o.ownerA==null?1:o.ownerA,()=>psaOwner(ctx,x+175,y+102,"control room",{align:"center"}));});}
// a new moon's crescent: night
function p8_moon(ctx,x,y,r,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.6,[200,214,255],0.22);ctx.fillStyle="rgba(232,238,255,0.95)";ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,Math.PI/2,true);ctx.quadraticCurveTo(x-r*1.15,y,x,y-r);ctx.fill();});}
// each night the new tool's records go down to the storage, as files, to the storm history's place at its right end: a dotted line from
// y0, and the files sliding down it, by the film's own time T so they go on unbroken from chapter to chapter
function p8_night(ctx,T,a,y0){if(a<=0.01)return;const x=P8_FX+11*P8_FD,y1=P8_SY+8;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.75);ctx.lineWidth=2.4;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  for(let k=0;k<3;k++){const f=((T/2.4-k/3)%1+1)%1;p8_file(ctx,x,lerp(y0+22,y1-8,easeCam(f)),26,Math.min(1,f*6)*Math.min(1,(1-f)*6));}
  p8_moon(ctx,x-50,y0+48,15,1);});}

/* ---------- 2. Twelve years inside ---------- */
// January: the storm tool's maker writes that support ends in December. The control room bought it twelve years ago, to record every
// storm, each fault and each line that failed; all twelve years are inside it, in a format only it can read. Its one way out, an export
// made for the regulator's measure, carries little else. Grace's engineers choose which lines to strengthen from those storms; without
// them, blind. Only the maker can bring it all out, at its price. Nobody asked, when it was bought, how the data would come out: so Ravi
// asks what else holds the utility like this, the data platform's own product included.
const P8_LET=["FROM ITS MAKER","support for the storm tool","ends in December"],P8_MKR=["FROM ITS MAKER","to bring it all out:","a project of its own"];
const P8_EXL=["an export, made for","the regulator's measure"],P8_EXP=[["minutes without power","ok"],["each fault","no"],["each line that failed","no"]];
// the one way out: an export for the regulator's measure; what it carries ticked, what it leaves behind crossed and dashed (o.r, 0..1 each)
function p8_export(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,500,320,16,PS_RED,{glow:12,ea:0.85,fill:"rgba(14,8,10,0.95)"});
  T(ctx,"ITS ONE WAY OUT",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(PS_RED,1)});let left=(o.p==null?1:o.p)*P8_EXL.join(" ").length;
  P8_EXL.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,x+24,y+92+i*38,{w:700,size:30,color:rgba(INK,0.95)});});
  P8_EXP.forEach(([s_,k],i)=>{const q=o.r?o.r[i]:1;if(q>0.01)p8_chip(ctx,x+24,y+180+i*52,s_,{a:q,col:k==="ok"?PS_OK:PS_RED,dash:k!=="ok",mark:k,mp:clamp(q*1.6-0.4,0,1)});});});}
// what was asked when it was bought, ticked; and the question nobody asked, dashed, with a question mark (o.r, 0..1 each; o.qa the mark)
const P8_ASK0=[["does it record every storm?","ok"],["is its price right?","ok"],["how does our data come out?","q"]];
function p8_asked(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,520,262,16,AMBER,{glow:12,ea:0.85,fill:"rgba(14,12,8,0.95)"});
  T(ctx,"WHEN IT WAS BOUGHT",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(AMBER,1)});
  P8_ASK0.forEach(([s_,k],i)=>{const q=o.r?o.r[i]:1;if(q<=0.01)return;const yy=y+100+i*56;
    if(k==="q"){const cw=p8_chip(ctx,x+24,yy,s_,{a:q,col:PS_RED,dash:true});p8_q(ctx,x+24+cw+26,yy,q*(o.qa==null?1:o.qa),38);}
    else p8_chip(ctx,x+24,yy,s_,{a:q,col:PS_OK,mark:"ok",mp:clamp(q*1.6-0.4,0,1)});});});}
scene("locked",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tLe=c("letter"),tBo=c("bought"),tIn=c("inside"),tEx=c("export"),tGr=c("grace"),tBl=c("blind"),tMa=c("maker"),tWr=c("wrong"),tHa=c("harder");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p8_people(ctx,t,sc,fin(t,0.1,0.8),0);
  // the platform on the utility's own storage, as Ravi asks what else holds the utility like this: a lock and a question on it
  const bA=fin(t,tHa-0.3,0.8),qA=fin(t,w("harder","data platform's")-0.2,0.5);p8_store(ctx,bA);p8_slab(ctx,bA,{hi:pulseAt(t,w("harder","data platform's"),1.6)*0.8});
  p8_lock(ctx,1700,676,44,qA,{});p8_q(ctx,1760,676,qA,40);
  // the storm tool: bought twelve years ago by the control room, to record every storm, each fault and each line that failed; all twelve
  // years inside it, locked in a format only it can read
  const tA=fin(t,w("bought","bought")-0.4,0.6),yh=pulseAt(t,w("grace","those storms"),1.6);
  p8_tool(ctx,t,tA,{rows:P8_REC.map(s_=>clamp((t-w("bought",s_)+0.1)/0.5,0,1)),ownerA:fin(t,w("bought","control room")-0.2,0.5),yp:12*easeCam(clamp((t-w("inside","twelve years")+0.2)/1.4,0,1)),yhi:Array(12).fill(yh),
    lock:fin(t,w("inside","only it can read")-0.3,0.5),lockHi:pulseAt(t,w("inside","only it can read"),1.4)+pulseAt(t,w("maker","Only the maker"),1.6)+pulseAt(t,w("harder","holds"),1.4)});
  // the letter: support ends in December; it leaves before the years are counted in
  const lA=fin(t,tLe-0.2,0.6)*(1-fin(t,tIn-0.6,0.5));
  if(lA>0.01)arrive(ctx,1580,362,t,tLe-0.2,()=>psaPaper(ctx,1320,250,520,226,P8_LET,{kicker:true,size:32,rot:-0.012,a:lA,p:p8_typed(t,P8_LET,[tLe-0.2,w("letter","storm tool's")-0.2,w("letter","support ends")-0.1])}),{dy:-12});
  // its one way out: an export, made for the regulator's measure, carrying little else
  const tOw=w("export","one way out"),eA=fin(t,tOw-0.3,0.5)*(1-fin(t,tGr-0.6,0.5));
  if(eA>0.01){psaArrow(ctx,1262,320,1328,320,PS_RED,eA,clamp((t-tOw)/0.5,0,1),{lw:3,head:12});
    arrive(ctx,1590,410,t,tOw-0.3,()=>p8_export(ctx,1340,250,eA,{p:p8_typed(t,P8_EXL,[w("export","an export"),w("export","regulator's")]),r:[fin(t,w("export","regulator's measure")+0.4,0.5),fin(t,w("export","little else")-0.3,0.5),fin(t,w("export","little else"),0.5)]}),{dy:-10});}
  // Grace's engineers choose which lines to strengthen from those storms; without them, the line from the storms is cut, and it's blind
  const gA=fin(t,tGr-0.2,0.6)*(1-fin(t,tMa-0.6,0.5)),tSt=w("grace","those storms"),bl=clamp((t-w("blind","Without them")+0.1)/1.0,0,1);
  if(gA>0.01){p8_route(ctx,[[1206,535],[1306,535],[1306,420],[1356,420]],PSC,gA*(1-0.6*bl),clamp((t-tSt+0.3)/0.7,0,1),{lw:2.6,dash:[4,7],head:10});
    if(bl>0.01)withA(ctx,gA,()=>p8_mark(ctx,"no",1306,478,34,bl));
    arrive(ctx,1590,415,t,tGr-0.2,()=>p8_net(ctx,1360,250,gA,{pick:clamp((t-w("grace","strengthen")+0.2)/1.2,0,1),blind:bl,ownerA:fin(t,w("grace","Grace's")-0.2,0.5)}),{dy:-10});}
  // only the maker can bring it all out, as a project of its own, at its price
  const mA=fin(t,tMa-0.2,0.6)*(1-fin(t,tWr-0.6,0.5));
  if(mA>0.01)arrive(ctx,1580,375,t,tMa-0.2,()=>psaPaper(ctx,1320,250,520,250,P8_MKR,{kicker:true,size:32,rot:0.01,a:mA,p:p8_typed(t,P8_MKR,[tMa-0.2,w("maker","bring it all out")-0.2,w("maker","project of its own")-0.2]),
    foot:"at its price",footA:fin(t,w("maker","at its price")-0.2,0.5)}),{dy:-12});
  // nobody did anything wrong; but nobody asked, when it was bought, how the utility's data would come out
  const tWb=w("wrong","when it was bought"),kA=fin(t,tWb-0.4,0.6)*(1-fin(t,tHa-0.6,0.5));
  if(kA>0.01)arrive(ctx,1580,381,t,tWb-0.4,()=>p8_asked(ctx,1320,250,kA,{r:[fin(t,tWb,0.5),fin(t,tWb+0.3,0.5),fin(t,w("wrong","how the utility's data")-0.2,0.5)],qa:fin(t,w("wrong","would come out")-0.2,0.5)}),{dy:-10});
  ctx.restore();
  eaYear(ctx,80,80,"January",CLAY,fin(t,0.4,0.6)*(1-fin(t,tBo-0.6,0.3)));eaYear(ctx,80,80,"twelve years ago",CLAY,fin(t,w("bought","twelve years")-0.3,0.4)*(1-fin(t,tIn-0.6,0.4)));
  p8_tags(ctx,t,1260,120,[[0.4,tBo-0.4,"a letter from the storm tool's maker",PS_RED],[tBo-0.2,tIn-0.4,"bought by the control room",APPC],[tIn-0.2,tEx-0.4,"all twelve years inside it",PS_RED],
    [tEx-0.2,tGr-0.4,"its one way out: an export",PS_RED],[tGr-0.2,tBl-0.4,"Grace's engineers choose from those storms",AMBER],[tBl-0.2,tMa-0.4,"without them, next year's work is chosen blind",PS_RED],
    [tMa-0.2,tWr-0.4,"only the maker can bring it all out",PS_RED],[tWr-0.2,tHa-0.4,"nobody did anything wrong",AMBER],[tHa-0.2,sc.dur+1,"what else holds the utility like this?",PSC]]);
  p8_under(ctx,t,1260,186,[[w("inside","format")-0.2,tEx-0.4,"in a format only it can read",PS_RED],[w("maker","project")-0.2,tWr-0.4,"as a project of its own, at its price",PS_RED],
    [w("wrong","nobody asked")-0.2,tHa-0.4,"nobody asked how the data would come out",AMBER],[w("harder","data platform's")-0.2,sc.dur+1,"the data platform's own product included",PSC]]);
  vign(ctx,S);});

/* ---------- 3. Build or buy ---------- */
// Buy what every utility needs in much the same way, such as a tool to record storms; build what's the utility's own: its rules, its
// measures, its data products, such as hosting capacity, set down on the platform. Before buying, ask how the data comes out, in what
// format, and how long leaving would take. The new storm tool sends every record to the platform each night, in an open format, and its
// agreement lets the utility take all of its data, any day. The platform is the same: its product bought, what's built on it the
// utility's own.
const P8_BUY=["what every utility needs","in much the same way"],P8_ASK=["how does the data come out?","in what format?","how long would leaving take?"],P8_AGR=["ITS AGREEMENT","the utility may take","all of its data, any day"];
scene("buy",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tSt=c("start"),tBu=c("buy"),tBd=c("build"),tAs=c("ask"),tNe=c("new"),tAn=c("any"),tPl=c("platform");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p8_people(ctx,t,sc,1,fin(t,w("start","Tomás")-0.4,0.7));
  // what stays: the platform and the storage; the storm tool and the question on the platform leave, once the chapter has come in
  const T_=t+sc.start,lv=1-fin(t,0.8,0.5),nt=fin(t,w("new","each night")+0.6,0.8);
  p8_store(ctx,1,{nt,fh:i=>i>9?pulseAt(t,w("new","each night")+1.2,1.6):0});p8_slab(ctx,1,{hi:pulseAt(t,w("platform","its product bought"),1.6)*0.8});
  p8_tool(ctx,t,lv,{lock:1});p8_lock(ctx,1700,676,44,lv,{});p8_q(ctx,1760,676,lv,40);
  // build or buy: two columns, and what goes in each as it's named
  const bdA=fin(t,w("start","build or buy")-0.4,0.6)*(1-fin(t,tAs-0.6,0.5));
  if(bdA>0.01)withA(ctx,bdA,()=>{glass(ctx,780,250,520,300,16,APPC,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"BUY",804,294,{f:"mono",w:500,size:28,color:rgba(APPC,1)});
    glass(ctx,1330,250,510,300,16,PSC,{glow:10,ea:0.8,fill:"rgba(16,12,8,0.94)"});T(ctx,"BUILD",1354,294,{f:"mono",w:500,size:28,color:rgba(PSC,1)});
    let left=p8_typed(t,P8_BUY,[w("buy","what every"),w("buy","much the same")])*P8_BUY.join(" ").length;
    P8_BUY.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,804,350+i*38,{w:700,size:30,color:rgba(INK,0.95)});});
    p8_chip(ctx,804,476,"a tool to record storms",{col:APPC,a:fin(t,w("buy","a tool")-0.2,0.5)});
    const own="what's the utility's own";T(ctx,own.slice(0,Math.round(own.length*clamp((t-w("build","what's the utility's own"))/0.6,0,1))),1354,350,{w:700,size:30,color:rgba(INK,0.95)});
    p8_chip(ctx,1354,420,"its rules",{col:PSC,a:fin(t,w("build","its rules")-0.2,0.5)});p8_chip(ctx,1354+p8_chipW(ctx,"its rules")+18,420,"its measures",{col:PSC,a:fin(t,w("build","its measures")-0.2,0.5)});
    p8_chip(ctx,1354,476,"data products",{col:PSC,a:fin(t,w("build","data products")-0.2,0.5)});});
  // hosting capacity, built: set down on the platform, owned by network, reading its files
  const tHc=w("build","hosting capacity"),hp=clamp((t-tHc+0.2)/0.9,0,1);
  if(hp>0)p8_hosting(ctx,t,{drop:hp,ownerA:fin(t,tHc+0.6,0.5),hi:pulseAt(t,w("platform","utility's own"),1.6),ra:fin(t,tHc+0.8,0.5),rp:clamp((t-tHc-0.8)/0.6,0,1)});
  // before buying, ask: three questions, each ticked as it's asked
  const aA=fin(t,tAs-0.2,0.6)*(1-fin(t,tAn-0.6,0.5));
  if(aA>0.01)arrive(ctx,1060,385,t,tAs-0.2,()=>withA(ctx,aA,()=>{glass(ctx,780,250,560,270,16,APPC,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,"BEFORE BUYING, ASK",804,294,{f:"mono",w:500,size:28,color:rgba(APPC,1)});
    P8_ASK.forEach((s_,i)=>{const t0=w("ask",["how the data","what format","how long"][i])-0.2;p8_chip(ctx,804,352+i*56,s_,{a:fin(t,t0,0.5),col:PS_OK,mark:"ok",mp:clamp((t-t0-0.2)/0.5,0,1)});});}),{dy:-10});
  // the new storm tool: each night, every record to the platform, in an open format
  const nA=fin(t,tNe-0.2,0.6);if(nA>0.01)arrive(ctx,1665,320,t,tNe-0.2,()=>p8_newtool(ctx,1490,250,nA,{ownerA:fin(t,w("new","control room's")-0.2,0.5),hi:pulseAt(t,tNe+0.4,1.2)}),{dy:-10});
  p8_night(ctx,T_,fin(t,w("new","each night")-0.4,0.6),390);withA(ctx,fin(t,w("new","open format")-0.3,0.5),()=>p8_chip(ctx,1764,520,"each night, an open format",{align:"right",col:PSC}));
  // its agreement: the utility may take all of its data, any day
  const gA=fin(t,tAn-0.2,0.6)*(1-fin(t,tPl-0.6,0.5));
  if(gA>0.01)arrive(ctx,1060,366,t,tAn-0.2,()=>psaPaper(ctx,780,250,560,232,P8_AGR,{kicker:true,size:32,rot:-0.01,a:gA,p:p8_typed(t,P8_AGR,[tAn-0.2,w("any","utility may take")-0.2,w("any","all of its data")-0.2]),
    seal:clamp((t-w("any","any day"))/0.5,0,1),sx:456,sy:132}),{dy:-12});
  // and the platform is the same: its product bought, what's built on it the utility's own
  withA(ctx,fin(t,w("platform","its product bought")-0.3,0.5),()=>p8_chip(ctx,P8_SLOT[1]+200,680,"its product: bought",{align:"center",col:TECC,hi:pulseAt(t,w("platform","its product bought"),1.4)}));
  withA(ctx,fin(t,w("platform","utility's own")-0.3,0.5),()=>p8_chip(ctx,P8_SLOT[0]+200,550,"built on it: the utility's own",{align:"center",col:PSC}));
  ctx.restore();
  p8_tags(ctx,t,1260,120,[[0.3,tBu-0.4,"build or buy",PSC],[tBu-0.2,tBd-0.4,"buy what every utility needs the same way",APPC],[tBd-0.2,tAs-0.4,"build what's the utility's own",PSC],
    [tAs-0.2,tNe-0.4,"before buying, ask",APPC],[tNe-0.2,tAn-0.4,"the control room's new tool",APPC],[tAn-0.2,tPl-0.4,"all of its data, any day",PS_OK],[tPl-0.2,sc.dur+1,"the data platform is the same",TECC]]);
  p8_under(ctx,t,1260,186,[[tHc-0.2,tAs-0.4,"data products, such as hosting capacity",PSC],[w("new","each night")-0.2,tAn-0.4,"every record to the platform, each night",PSC]]);
  vign(ctx,S);});

/* ---------- 4. Seams ---------- */
// A seam: where two parts meet through something both sides agree on, such as a format; behind it a part can be replaced, and nothing in
// front of it has to change. On the data platform the tables are files in an open table format, in the utility's own storage, and any
// engine that knows the format can read them; the logic is code in the utility's own repository. The schedules, alerts and dashboards have
// no seam: they're the product's own. That's lock-in, the price of what a product does well; Ravi writes down what leaving would cost.
// As the railway took the road's route, between the same cities: what changed was what carried the loads.
const P8_CODE=["models/","  capacity.sql","  streets.sql","  tests.yml"],P8_COST=["WHAT LEAVING WOULD COST","the schedules: set up again","the alerts: set up again","the dashboards: made again"];
// the road's route and the railway along it, between the same two cities: a load handed on, station to station, on the road, and a
// train on the line
function p8_strip(ctx,t,x0,x1,t0,a){if(a<=0.01)return;withA(ctx,a,()=>{const y1=372,y2=440,xa=x0+70,xb=x1-70;
  T(ctx,"the road's route, between the same cities",x0,y1-40,{w:700,size:28,color:rgba(PSC,1)});
  ctx.save();ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=4;ctx.shadowColor=rgba(PSC,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(xa,y1);ctx.lineTo(xb,y1);ctx.stroke();ctx.restore();
  for(let i=0;i<6;i++)psaStop(ctx,xa+i*(xb-xa)/5,y1,{lit:0.5,r:7});
  ctx.save();ctx.strokeStyle=rgba(RAILC,0.95);ctx.lineWidth=6;ctx.shadowColor=rgba(RAILC,0.6);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(xa,y2);ctx.lineTo(xb,y2);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle="rgba(34,40,56,1)";ctx.lineWidth=2.6;ctx.setLineDash([9,9]);ctx.beginPath();ctx.moveTo(xa,y2);ctx.lineTo(xb,y2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  // the same two cities, at either end of both
  [xa,xb].forEach(x=>{ctx.save();ctx.strokeStyle=rgba(INK,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y1-16);ctx.lineTo(x,y2+16);ctx.stroke();ctx.restore();psaStop(ctx,x,y1,{lit:1,r:10});psaStop(ctx,x,y2,{lit:1,r:10});});
  const h=p8_hop([[xa,y1],[xa+(xb-xa)/5,y1],[xa+2*(xb-xa)/5,y1],[xa+3*(xb-xa)/5,y1],[xa+4*(xb-xa)/5,y1],[xb,y1]],t,t0,1.2,1);p8_load(ctx,h,1);
  p8_runner(ctx,[[xa,y2],[xb,y2]],((t-t0-0.4)/2.0)%1,[230,240,255],{r:7,trail:0.3});
  T(ctx,"what carried the loads: changed",x0,y2+62,{w:700,size:28,color:rgba(RAILC,1)});});}
scene("seams",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tWh=c("what"),tBe=c("behind"),tFi=c("files"),tRe=c("read"),tCo=c("code"),tNo=c("not"),tLo=c("lock"),tCh=c("chosen"),tSy=c("story");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p8_people(ctx,t,sc,1,1);const T_=t+sc.start;
  // the platform, the storage and hosting capacity stay; the tables are files in an open table format, in the utility's own storage, and
  // the seam runs along where the platform meets them; another engine reads the same files as hosting capacity
  const gA=fin(t,tRe-0.3,0.6)*(1-fin(t,tNo-0.6,0.5));
  p8_store(ctx,1,{nt:1,hi:pulseAt(t,w("files","files"),2.0),fh:i=>i<2?gA*0.7:0});p8_slab(ctx,1);
  p8_seam(ctx,fin(t,w("files","files")-0.3,0.5),clamp((t-w("files","files")+0.2)/1.6,0,1),pulseAt(t,w("files","own storage"),1.6));
  p8_hosting(ctx,t,{hi:pulseAt(t,w("code","logic"),1.4)});
  if(gA>0.01){p8_ghost(ctx,P8_SLOT[1],P8_BY,P8_BW,P8_BH,"another engine",TECC,gA);p8_reads(ctx,P8_SLOT[1]+40,P8_BY+P8_BH,1,gA,clamp((t-w("read","read them")+0.3)/0.6,0,1));}
  withA(ctx,fin(t,w("files","open table format")-0.3,0.5)*(1-fin(t,tRe-0.5,0.4)),()=>p8_chip(ctx,P8_SLOT[1]+200,540,"an open table format",{align:"center",col:PSC}));
  // what was there leaves: build or buy's two chips, once the chapter has come in; the new tool and its night, once the files are shown
  const lv=1-fin(t,0.9,0.6),ntA=1-fin(t,tFi-0.6,0.6);
  withA(ctx,lv,()=>{p8_chip(ctx,P8_SLOT[1]+200,680,"its product: bought",{align:"center",col:TECC});p8_chip(ctx,P8_SLOT[0]+200,550,"built on it: the utility's own",{align:"center",col:PSC});});
  p8_newtool(ctx,1490,250,ntA);p8_night(ctx,T_,ntA,390);withA(ctx,ntA,()=>p8_chip(ctx,1764,520,"each night, an open format",{align:"right",col:PSC}));
  // a seam, drawn: two parts, and what both sides agree on between them; behind it a part is replaced, and in front nothing changes
  const dA=fin(t,tWh+0.6,0.6)*(1-fin(t,tFi-0.6,0.5)),tRp=w("behind","replaced"),sw=clamp((t-tRp+0.2)/0.9,0,1),nw=clamp((t-tRp-0.5)/0.9,0,1);
  if(dA>0.01)withA(ctx,dA,()=>{const sx=1090;ctx.save();ctx.strokeStyle=rgba(PSC,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.shadowColor=rgba(PSC,0.9);ctx.shadowBlur=14+14*pulseAt(t,w("what","agree"),1.4);ctx.setLineDash([14,9]);ctx.beginPath();ctx.moveTo(sx,300);ctx.lineTo(sx,450);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    p8_chip(ctx,sx,500,"a format both sides agree on",{align:"center",col:PSC,a:fin(t,w("what","such as a format")-0.3,0.5)});
    withA(ctx,fin(t,tBe-0.2,0.5),()=>{T(ctx,"behind it",925,286,{w:700,size:28,align:"center",color:rgba(SOFT,1)});T(ctx,"in front of it",1255,286,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});
    if(sw<1)withA(ctx,1-sw,()=>p8_part(ctx,800-sw*110,316,250,120,"a part",APPC));
    if(nw>0)withA(ctx,clamp(nw*2,0,1),()=>p8_part(ctx,800,316-(1-spring(nw))*50,250,120,"a new part",APPC,{hi:pulseAt(t,tRp+1.3,1.4)}));
    p8_part(ctx,1130,316,250,120,"another part",TECC);p8_mark(ctx,"ok",1342,346,30,clamp((t-w("behind","nothing in front"))/0.6,0,1));});
  // the logic: code, in the utility's own repository, and what it's the logic of
  const kA=fin(t,tCo-0.3,0.6)*(1-fin(t,tNo-0.6,0.5));
  if(kA>0.01){arrive(ctx,1060,355,t,tCo-0.3,()=>psaCard(ctx,780,250,560,"REPOSITORY · THE UTILITY'S OWN",P8_CODE,PSC,{a:kA,size:28,mono:true,p:p8_typed(t,P8_CODE,[tCo,tCo+0.35,tCo+0.7,tCo+1.05])}),{dy:-10});
    p8_route(ctx,[[960,462],[960,576]],PSC,kA*0.85,clamp((t-w("code","logic")-0.6)/0.5,0,1),{lw:2.4,dash:[4,7],head:9});}
  // not everything has a seam: the schedules, alerts and dashboards are the product's own
  const nA=fin(t,tNo-0.2,0.6)*(1-fin(t,tCh-0.6,0.5));
  if(nA>0.01)withA(ctx,nA,()=>{p8_row(ctx,1100,330,[["schedules",TECC,fin(t,w("not","schedules")-0.2,0.5)],["alerts",TECC,fin(t,w("not","alerts")-0.2,0.5)],["dashboards",TECC,fin(t,w("not","dashboards")-0.2,0.5)]],18);
    p8_lock(ctx,1100,396,40,fin(t,w("not","product's own")-0.3,0.5),{col:TECC,hi:pulseAt(t,w("not","product's own"),1.4)});
    // that's lock-in, and it isn't wrong: the price of what a product does well
    p8_chip(ctx,1100,476,"lock-in",{align:"center",col:AMBER,a:fin(t,w("lock","lock-in")-0.3,0.5)});
    p8_chip(ctx,1100,532,"the price of what it does well",{align:"center",col:PS_OK,mark:"ok",a:fin(t,w("lock","price")-0.3,0.5),mp:clamp((t-w("lock","price"))/0.5,0,1)});});
  // what leaving would cost, written down: chosen, not found
  const cA=fin(t,tCh-0.2,0.6)*(1-fin(t,tSy-0.6,0.5));
  if(cA>0.01)arrive(ctx,1080,395,t,tCh-0.2,()=>psaPaper(ctx,780,240,600,300,P8_COST,{kicker:true,size:30,rot:-0.01,a:cA,p:p8_typed(t,P8_COST,[tCh-0.2,tCh+0.5,tCh+1.0,tCh+1.5]),
    foot:"chosen, not found",footA:fin(t,w("chosen","chosen")-0.2,0.5),seal:clamp((t-w("chosen","not found"))/0.5,0,1),sx:496,sy:196}),{dy:-12});
  // as the railway took the road's route, between the same cities: what changed was what carried the loads
  p8_strip(ctx,t,790,1440,tSy+0.4,fin(t,tSy-0.2,0.6));
  ctx.restore();
  p8_tags(ctx,t,1260,120,[[0.3,tBe-0.4,"seams: where two parts meet",PSC],[tBe-0.2,tFi-0.4,"behind a seam, a part can be replaced",PSC],[tFi-0.2,tRe-0.4,"the tables: files in an open table format",PSC],
    [tRe-0.2,tCo-0.4,"any engine that knows the format can read them",TECC],[tCo-0.2,tNo-0.4,"the logic: code, the utility's own",PSC],[tNo-0.2,tLo-0.4,"not everything has a seam",TECC],
    [tLo-0.2,tCh-0.4,"that's lock-in, and it isn't wrong",AMBER],[tCh-0.2,tSy-0.4,"what leaving would cost, written down",PS_OK],[tSy-0.2,sc.dur+1,"the railway took the road's route",RAILC]]);
  p8_under(ctx,t,1260,186,[[w("files","own storage")-0.2,tRe-0.4,"in the utility's own storage",PSC],[w("not","product's own")-0.2,tLo-0.4,"they're the product's own",TECC],[w("story","What changed")-0.2,sc.dur+1,"the files stay; what reads them can change",PSC]]);
  vign(ctx,S);});

/* ---------- 5. A date on every part ---------- */
// Every technology on Tomás's map gets a stage, tried, in use, on its way out or retired, and a date to look at it again beside its
// maker's end of support. The storm tool would have shown on its way out four years ago, when its maker stopped improving it; a file
// transfer server and a reporting tool turn out to be near their end too, and each gets its plan now, years ahead.
const P8_STG=[["tried",SOFT],["in use",PS_OK],["on its way out",AMBER],["retired",[150,156,170]]];
const P8_PARTS=[["the data platform","June","—"],["the storm tool","now","December"],["a file transfer server","May","in 2 years"],["a reporting tool","May","in 3 years"]],P8_RY=[386,434,482,530];
// a part's stage, as a pill: the old one fades out, then the new one in, at ts (each over a moment, so the two never show at once)
function p8_stage(ctx,x,y,t,from,to,ts,hi){const k=ts==null?0:t<ts?0:1,q=ts==null?1:k?clamp((t-ts)/0.35,0,1):1-clamp((t-ts+0.25)/0.25,0,1),[nm,col]=P8_STG[k?to:from];if(q>0.01)p8_chip(ctx,x,y,nm,{col,a:q,hi:hi||0});}
scene("dates",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tSg=c("stage"),tDa=c("date"),tSm=c("storm"),tTw=c("two"),tPn=c("plan");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p8_people(ctx,t,sc,1,1);
  p8_store(ctx,1,{nt:1});p8_slab(ctx,1,{hi:pulseAt(t,w("stage","in use"),1.4)*0.6});p8_seam(ctx,1,1);p8_hosting(ctx,t);
  // the railway's strip leaves, once the chapter has come in (its train going on as the last chapter left it)
  const ps=SCENES[SCENES.indexOf(sc)-1];p8_strip(ctx,t,790,1440,cue(ps,"story")+0.4-ps.dur,1-fin(t,0.9,0.6));
  // the four stages, as they're named; then the parts on Tomás's map, each with its stage and its two dates
  const lg=["tried","in use","on its way out","retired"].map(s_=>fin(t,w("stage",s_)-0.2,0.5));
  p8_row(ctx,1310,262,P8_STG.map(([nm,col],i)=>[nm,col,lg[i]]),18);
  const tbA=fin(t,Math.max(1.5,w("stage","every technology")-0.3),0.6);
  if(tbA>0.01)withA(ctx,tbA,()=>{glass(ctx,780,300,1060,262,16,SOFT,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.94)"});
    const hd=fin(t,tDa-0.3,0.5);T(ctx,"PART",836,342,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});T(ctx,"STAGE",1176,342,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});
    withA(ctx,hd,()=>{T(ctx,"LOOK AGAIN",1430,342,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});T(ctx,"SUPPORT ENDS",1620,342,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});});
    const tS1=w("storm","on its way out"),tS2=w("two","near their end"),pl=i=>i>0?clamp((t-w("plan","its plan")-(i-1)*0.25)/0.5,0,1):0;
    P8_PARTS.forEach(([nm,look,end],i)=>{const y=P8_RY[i],ra=fin(t,Math.max(1.7,w("stage","every technology")+0.1)+i*0.15,0.5);withA(ctx,ra,()=>{
      T(ctx,nm,836,y+10,{w:700,size:28,color:rgba(INK,0.95)});
      p8_stage(ctx,1176,y,t,1,2,i===1?tS1:i>1?tS2+(i-2)*0.3:null,i===1?pulseAt(t,tS1+0.3,1.4):i>1?pulseAt(t,tS2+0.3,1.4):0);
      withA(ctx,fin(t,w("date","look at it again")-0.2+i*0.12,0.5),()=>T(ctx,look,1430,y+10,{w:700,size:28,color:rgba(INK,0.9)}));
      withA(ctx,fin(t,w("date","end of support")-0.2+i*0.12,0.5),()=>T(ctx,end,1620,y+10,{w:700,size:28,color:rgba(i>1?mix(INK,AMBER,clamp((t-tS2)/0.6,0,1)):i===1?AMBER:INK,0.95)}));
      // its plan, now, years ahead: a tick at the row's start
      if(pl(i)>0.01)p8_mark(ctx,"ok",806,y,24,pl(i));});});});
  ctx.restore();
  p8_tags(ctx,t,1260,120,[[0.3,tDa-0.4,"every technology on Tomás's map gets a stage",SOFT],[tDa-0.2,tSm-0.4,"and a date to look at it again",SOFT],[tSm-0.2,tTw-0.4,"the storm tool: on its way out, four years ago",AMBER],
    [tTw-0.2,tPn-0.4,"two more parts near their end",AMBER],[tPn-0.2,sc.dur+1,"each gets its plan now",PS_OK]]);
  p8_under(ctx,t,1260,186,[[w("date","end of support")-0.2,tSm-0.4,"beside its maker's end of support",SOFT],[w("storm","stopped improving")-0.2,tTw-0.4,"when its maker stopped improving it",AMBER],[w("plan","years ahead")-0.2,sc.dur+1,"years ahead, not months",PS_OK]]);
  vign(ctx,S);});

/* ---------- 6. A way out, tested ---------- */
// An exit plan for every part, the platform's own product included: how it would leave, how long, and at what cost. Untried, a plan is a
// guess, so the platform team tries one each year: this year Grace's hosting capacity, how much solar each street can take. For a week, in
// test, it runs on another engine that reads the same files; eleven lines of its models change, of fourteen hundred; its contract, owner
// and glossary don't, and every number matches. Its schedule, its alerts and who may read it are set up again. From that, the whole
// platform: about eight months to leave, a migration, not a rewrite.
const P8_EXIT=["how it would leave","how long","at what cost"],P8_SAME=["the contract","the owner","the glossary"],P8_AGAIN=["its schedule","its alerts","who may read it"];
// hosting capacity, as Grace's engineers know it: how much solar each street can take, a bar for each street (drawn small: texture)
function p8_solar(ctx,t,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,460,300,16,APPC,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});
  T(ctx,"HOSTING CAPACITY",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(APPC,1)});T(ctx,"how much solar",x+24,y+92,{w:700,size:30,color:rgba(INK,0.95)});T(ctx,"each street can take",x+24,y+130,{w:700,size:30,color:rgba(INK,0.95)});
  [0.82,0.46,0.64,0.28,0.72].forEach((v,i)=>{const yy=y+166+i*20,L=v*clamp((o.p==null?1:o.p)*1.6-i*0.15,0,1)*250;ctx.save();ctx.fillStyle=rgba(SOFT,0.18);ctx.fillRect(x+24,yy,250,10);ctx.fillStyle=rgba(mix(PS_OK,AMBER,1-v),0.9);ctx.fillRect(x+24,yy,L,10);ctx.restore();
    ctx.save();ctx.fillStyle=rgba(AMBER,0.85);ctx.beginPath();ctx.arc(x+292,yy+5,5,0,TAU);ctx.fill();ctx.restore();});
  withA(ctx,o.ownerA==null?1:o.ownerA,()=>psaOwner(ctx,x+440,y+268,"Grace",{align:"right"}));});}
// its models: fourteen hundred lines, drawn as texture, and the eleven that changed, lit
function p8_lines(ctx,t,x,y,a,p){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,560,230,16,APPC,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});
  T(ctx,"ITS MODELS",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(APPC,1)});T(ctx,String(Math.round(11*clamp(p,0,1))),x+24,y+124,{w:800,size:64,color:rgba(AMBER,1)});
  T(ctx,"lines changed",x+24+tw(ctx,"11",64,800)+14,y+124,{w:700,size:30,color:rgba(INK,0.95)});T(ctx,"of 1,400",x+24,y+176,{w:700,size:28,color:rgba(SOFT,1)});
  const LIT=[37,212,213,415,640,641,642,903,1104,1260,1388];p8_deco(true,()=>{for(let i=0;i<1400;i++){const cx=x+330+(i%40)*5.4,cy=y+24+Math.floor(i/40)*5.6,on=LIT.indexOf(i)>=0&&p>i/1400*0.8;ctx.fillStyle=on?rgba(AMBER,1):rgba(SOFT,0.32);ctx.fillRect(cx,cy,on?4.4:3.4,on?3.6:2);}});});}
scene("exit",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tPl=c("plan"),tGu=c("guess"),tGr=c("grace"),tWe=c("week"),tLi=c("lines"),tSa=c("same"),tAg=c("again"),tWh=c("whole"),tKn=c("known");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p8_people(ctx,t,sc,1,1);
  // another engine, in test, for a week: hosting capacity runs on it, reading the same files
  const gA=fin(t,w("week","another engine")-0.4,0.6)*(1-fin(t,tWh-0.6,0.5)),tRn=w("week","runs on");
  p8_store(ctx,1,{nt:1,fh:i=>i<2?gA*0.7:0});p8_slab(ctx,1,{hi:pulseAt(t,w("plan","platform's own product"),1.6)*0.8});p8_seam(ctx,1,1);
  p8_hosting(ctx,t,{hi:pulseAt(t,w("grace","hosting capacity"),1.6)});
  if(gA>0.01){p8_ghost(ctx,P8_SLOT[1],P8_BY,P8_BW,P8_BH,"another engine, in test",TECC,gA);p8_reads(ctx,P8_SLOT[1]+40,P8_BY+P8_BH,1,gA,clamp((t-w("week","same files")+0.3)/0.6,0,1));
    const u=easeCam(clamp((t-tRn)/1.2,0,1));if(u>0&&u<1)withA(ctx,gA,()=>{const x=lerp(P8_SLOT[0]+190,P8_SLOT[1]+190,u),y=P8_BY+40-Math.sin(u*Math.PI)*60;glow(ctx,x,y,40,APPC,0.6);ctx.fillStyle=rgba(mix(APPC,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();});
    // a week: seven days, filling
    withA(ctx,gA,()=>{p8_chip(ctx,800,540,"a week, in test",{col:TECC});for(let i=0;i<7;i++){const q=clamp((t-tRn-0.4-i*0.5)/0.4,0,1),x=1078+i*38;ctx.save();ctx.strokeStyle=rgba(TECC,0.6);ctx.lineWidth=1.6;rr(ctx,x,526,28,28,5);ctx.stroke();if(q>0.01){ctx.fillStyle=rgba(TECC,0.75*q);rr(ctx,x,526,28,28,5);ctx.fill();}ctx.restore();}});}
  // what was there leaves: the table of parts, once the chapter has come in
  const lv=1-fin(t,0.9,0.6);if(lv>0.01)withA(ctx,lv,()=>{p8_row(ctx,1310,262,P8_STG.map(([nm,col])=>[nm,col,1]),18);glass(ctx,780,300,1060,262,16,SOFT,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.94)"});
    [["PART",836],["STAGE",1176],["LOOK AGAIN",1430],["SUPPORT ENDS",1620]].forEach(([s_,x])=>T(ctx,s_,x,342,{f:"mono",w:500,size:28,color:rgba(SOFT,1)}));
    P8_PARTS.forEach(([nm,look,end],i)=>{const y=P8_RY[i];T(ctx,nm,836,y+10,{w:700,size:28,color:rgba(INK,0.95)});p8_stage(ctx,1176,y,t,i?2:1,i?2:1,null,0);T(ctx,look,1430,y+10,{w:700,size:28,color:rgba(INK,0.9)});
      T(ctx,end,1620,y+10,{w:700,size:28,color:rgba(i?AMBER:INK,0.95)});if(i)p8_mark(ctx,"ok",806,y,24,1);});});
  // an exit plan for every part, the platform's own product included; untried, a guess; so tried each year
  const eA=fin(t,Math.max(1.5,tPl-0.2),0.6)*(1-fin(t,tWe-0.6,0.5)),tTr=w("guess","tries it");
  if(eA>0.01)arrive(ctx,1060,390,t,Math.max(1.5,tPl-0.2),()=>{withA(ctx,eA*0.55,()=>{glass(ctx,836,234,520,280,16,PSC,{glow:6,ea:0.6,fill:"rgba(16,12,8,0.9)"});glass(ctx,808,242,520,280,16,PSC,{glow:6,ea:0.6,fill:"rgba(16,12,8,0.92)"});});
    psaCard(ctx,780,250,520,"EXIT PLAN · EVERY PART",P8_EXIT,PSC,{a:eA,size:30,h:280,p:p8_typed(t,P8_EXIT,[w("plan","how it would leave")-0.1,w("plan","how long")-0.1,w("plan","what cost")-0.1])});
    withA(ctx,eA*fin(t,w("guess","guess")-0.3,0.4)*(1-fin(t,tTr-0.4,0.3)),()=>T(ctx,"untried, it's a guess",804,500,{w:700,size:28,color:rgba(PS_RED,1)}));
    withA(ctx,eA*fin(t,tTr,0.4),()=>{p8_mark(ctx,"ok",820,490,24,clamp((t-tTr)/0.5,0,1));T(ctx,"tried, each year",848,500,{w:700,size:28,color:rgba(PS_OK,1)});});},{dy:-10});
  withA(ctx,fin(t,w("plan","platform's own product")-0.3,0.5)*(1-fin(t,tGu-0.5,0.4)),()=>p8_chip(ctx,P8_SLOT[1]+200,680,"the platform's product, too",{align:"center",col:TECC}));
  // this year, Grace's hosting capacity: how much solar each street can take
  const sA=fin(t,tGr-0.2,0.6)*(1-fin(t,tSa-0.6,0.5));if(sA>0.01)arrive(ctx,1610,400,t,tGr-0.2,()=>p8_solar(ctx,t,1380,250,sA,{p:clamp((t-w("grace","how much solar"))/1.4,0,1),ownerA:fin(t,w("grace","Grace's")-0.2,0.5)}),{dy:-10});
  // eleven lines changed, of fourteen hundred
  const lA=fin(t,tLi-0.2,0.6)*(1-fin(t,tAg-0.6,0.5));if(lA>0.01)arrive(ctx,1060,365,t,tLi-0.2,()=>p8_lines(ctx,t,780,250,lA,clamp((t-w("lines","eleven"))/1.0,0,1)),{dy:-10});
  // the contract, the owner and the glossary don't change, and every number matches
  const mA=fin(t,tSa-0.2,0.6)*(1-fin(t,tWh-0.6,0.5));if(mA>0.01)arrive(ctx,1610,395,t,tSa-0.2,()=>withA(ctx,mA,()=>{glass(ctx,1380,250,460,290,16,PS_OK,{glow:12,ea:0.85,fill:"rgba(6,14,10,0.95)"});
    T(ctx,"UNCHANGED",1404,294,{f:"mono",w:500,size:28,color:rgba(PS_OK,1)});
    P8_SAME.forEach((s_,i)=>{const t0=w("same",s_)-0.2;p8_chip(ctx,1404,348+i*54,s_,{a:fin(t,t0,0.5),col:PS_OK,mark:"ok",mp:clamp((t-t0-0.2)/0.5,0,1)});});
    const tN=w("same","every number matches");withA(ctx,fin(t,tN-0.2,0.5),()=>{p8_mark(ctx,"ok",1420,508,24,clamp((t-tN)/0.5,0,1));T(ctx,"every number matches",1448,518,{w:800,size:28,color:rgba(PS_OK,1)});});}),{dy:-10});
  // three things set up again
  const aA=fin(t,tAg-0.2,0.6);if(aA>0.01)arrive(ctx,1060,370,t,tAg-0.2,()=>withA(ctx,aA,()=>{glass(ctx,780,250,560,240,16,AMBER,{glow:12,ea:0.85,fill:"rgba(14,12,8,0.95)"});
    T(ctx,"SET UP AGAIN",804,294,{f:"mono",w:500,size:28,color:rgba(AMBER,1)});
    P8_AGAIN.forEach((s_,i)=>p8_chip(ctx,804,350+i*54,s_,{a:fin(t,w("again",s_)-0.2,0.5),col:AMBER}));}),{dy:-10});
  // the whole platform: about eight months to leave, a migration, not a rewrite
  const rA=fin(t,tWh-0.2,0.6);if(rA>0.01)arrive(ctx,1610,400,t,tWh-0.2,()=>withA(ctx,rA,()=>{glass(ctx,1380,250,460,300,16,TECC,{glow:12+10*pulseAt(t,w("whole","eight months"),1.6),ea:0.85,fill:"rgba(6,14,10,0.95)"});
    T(ctx,"THE WHOLE PLATFORM",1404,294,{f:"mono",w:500,size:28,color:rgba(TECC,1)});withA(ctx,fin(t,w("whole","eight months")-0.3,0.5),()=>{T(ctx,"about 8 months",1404,358,{w:800,size:44,color:rgba(INK,0.97)});T(ctx,"to leave",1404,398,{w:700,size:30,color:rgba(SOFT,1)});});
    p8_chip(ctx,1404,456,"a migration",{a:fin(t,w("whole","a migration")-0.2,0.5),col:PS_OK,mark:"ok",mp:clamp((t-w("whole","a migration"))/0.5,0,1)});
    p8_chip(ctx,1404,512,"a rewrite",{a:fin(t,w("whole","not a rewrite")-0.2,0.5),col:PS_RED,dash:true,mark:"no",mp:clamp((t-w("whole","not a rewrite"))/0.5,0,1)});}),{dy:-10});
  ctx.restore();
  p8_tags(ctx,t,1260,120,[[0.3,tGu-0.4,"an exit plan for every part",PSC],[tGu-0.2,tGr-0.4,"a plan nobody has tried is a guess",PS_RED],[tGr-0.2,tWe-0.4,"this year: Grace's hosting capacity",APPC],
    [tWe-0.2,tLi-0.4,"for a week, in test, on another engine",TECC],[tLi-0.2,tSa-0.4,"eleven lines changed, of fourteen hundred",AMBER],[tSa-0.2,tAg-0.4,"every number matches",PS_OK],
    [tAg-0.2,tWh-0.4,"three things set up again",AMBER],[tWh-0.2,tKn-0.4,"a migration, not a rewrite",TECC],[tKn-0.2,sc.dur+1,"nobody plans to leave",PSC]]);
  p8_under(ctx,t,1260,186,[[w("plan","platform's own product")-0.2,tGu-0.4,"the platform's own product included",TECC],[w("guess","tries it")-0.2,tGr-0.4,"so the platform team tries it each year",PS_OK],
    [w("week","same files")-0.2,tLi-0.4,"it reads the same files",PSC],[w("whole","whole platform")-0.2,tKn-0.4,"the whole platform: about eight months to leave",TECC],[w("known","knows")-0.2,sc.dur+1,"but now the utility knows what it would take",PS_OK]]);
  vign(ctx,S);});

/* ---------- 7. Twelve winters, kept ---------- */
// Grace asks, in a ticket, for the storm history to be kept. The maker brings all twelve years out; the data team checks each against the
// old tool's reports; they land on the data platform as files in an open format: storm history, owned by network. From March the new tool
// sends each night's records the same way; Grace's engineers check them in test, and her ticket closes. In November, a month early, the
// old tool is switched off, and next year's work is chosen from all twelve winters.
// where each year waits while it's checked, at the right, under the ticket
function p8_chk(i){return[1404+(i%6)*68,438+Math.floor(i/6)*58];}
scene("storm",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tTk=c("ticket"),tOu=c("out"),tLa=c("land"),tNi=c("night"),tCk=c("check"),tOf=c("off"),tWi=c("winters");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p8_people(ctx,t,sc,1,1);const T_=t+sc.start;
  // they land in the storage at its right end, the storm history's place, and the storm history is set down on the platform
  const tL0=w("land","land")-0.2,tSh=w("land","storm history"),dp=clamp((t-tSh+0.3)/0.9,0,1);
  p8_store(ctx,1,{nt:1,fh:i=>i>9?pulseAt(t,tL0+1.2,1.8)+pulseAt(t,w("night","each night's")+0.8,1.4)*0.7:0});p8_slab(ctx,1);p8_seam(ctx,1,1);p8_hosting(ctx,t);
  if(dp>0){p8_prod(ctx,t,1,"storm history",{drop:dp,owner:"network",ownerA:fin(t,w("land","owned by network")-0.2,0.5),hi:pulseAt(t,w("winters","twelve winters"),1.6)});
    p8_reads(ctx,P8_SLOT[1]+360,P8_BY+P8_BH,10,fin(t,tSh+0.6,0.5),clamp((t-tSh-0.6)/0.6,0,1));}
  // what was there leaves, once the chapter has come in: the last chapter's two cards
  const lv=1-fin(t,0.9,0.6);if(lv>0.01)withA(ctx,lv,()=>{glass(ctx,780,250,560,240,16,AMBER,{glow:12,ea:0.85,fill:"rgba(14,12,8,0.95)"});T(ctx,"SET UP AGAIN",804,294,{f:"mono",w:500,size:28,color:rgba(AMBER,1)});P8_AGAIN.forEach((s_,i)=>p8_chip(ctx,804,350+i*54,s_,{col:AMBER}));
    glass(ctx,1380,250,460,300,16,TECC,{glow:12,ea:0.85,fill:"rgba(6,14,10,0.95)"});T(ctx,"THE WHOLE PLATFORM",1404,294,{f:"mono",w:500,size:28,color:rgba(TECC,1)});T(ctx,"about 8 months",1404,358,{w:800,size:44,color:rgba(INK,0.97)});T(ctx,"to leave",1404,398,{w:700,size:30,color:rgba(SOFT,1)});
    p8_chip(ctx,1404,456,"a migration",{col:PS_OK,mark:"ok"});p8_chip(ctx,1404,512,"a rewrite",{col:PS_RED,dash:true,mark:"no"});});
  // Grace's ticket: keep the storm history; checked in test, it closes
  const kA=fin(t,Math.max(1.5,tTk-0.2),0.6),tCl=w("check","ticket closes");
  if(kA>0.01)arrive(ctx,1610,330,t,Math.max(1.5,tTk-0.2),()=>{psaCard(ctx,1380,250,460,"TICKET · FROM GRACE",["keep the storm history"],BIZ,{a:kA,size:30,p:clamp((t-w("ticket","storm history")+0.4)/0.6,0,1),foot:"checked in test: closed",footA:fin(t,tCl-0.3,0.5),footTick:clamp((t-tCl)/0.5,0,1),footCol:PS_OK,hi:pulseAt(t,tCl,1.4)});},{dy:-10});
  // the old storm tool, its twelve years inside; the maker brings them out: each goes to be checked, then down to the storage
  const oA=fin(t,w("ticket","storm history")-0.4,0.6)*(1-fin(t,tWi-0.7,0.5)),tO1=w("out","all twelve years")-0.3,tCh=w("out","checks each"),off=fin(t,w("off","switched off")-0.3,0.6);
  const fly=i=>clamp((t-tO1-i*0.1)/0.8,0,1),dn=i=>clamp((t-tL0-i*0.07)/0.8,0,1);
  p8_tool(ctx,t,oA,{owner:false,lock:1,open:clamp((t-tO1+0.5)/0.6,0,1),hide:Array(12).fill(0).map((_,i)=>t>tO1+i*0.1?1:0),off});
  for(let i=0;i<12;i++){const f=fly(i),d=dn(i);if(f<=0||d>=1)continue;const[ax,ay]=p8_year(i),[bx,by]=p8_chk(i),cx=P8_FX+(10+(i%2))*P8_FD-28,cy=P8_SY+4,u=easeCam(f),v=easeCam(d);
    let x=lerp(ax,bx,u),y=lerp(ay,by,u)-Math.sin(u*Math.PI)*40;if(d>0){x=lerp(bx,cx,v);y=lerp(by,cy,v);}const s=1-0.55*v;
    ctx.save();ctx.translate(x+28,y+23);ctx.scale(s,s);ctx.translate(-28,-23);p8_yearBox(ctx,0,0,1-v*0.8,0);const k=clamp((t-tCh-0.1-i*0.15)/0.4,0,1);if(k>0.01)p8_mark(ctx,"ok",46,4,20,k);ctx.restore();}
  // from March, the new tool sends each night's records the same way
  const nA=fin(t,tNi-0.3,0.6);if(nA>0.01)arrive(ctx,1665,494,t,tNi-0.3,()=>p8_newtool(ctx,1490,424,nA),{dy:-10});p8_night(ctx,T_,fin(t,w("night","each night's")-0.4,0.6),564);
  // next year's work, chosen from all twelve winters
  const yA=fin(t,tWi-0.3,0.6);if(yA>0.01)arrive(ctx,1010,415,t,tWi-0.3,()=>p8_net(ctx,780,250,yA,{pick:clamp((t-w("winters","chosen")+0.2)/1.2,0,1)}),{dy:-10});
  ctx.restore();
  eaYear(ctx,80,80,"March",CLAY,fin(t,tNi-0.3,0.5)*(1-fin(t,tOf-0.6,0.3)));eaYear(ctx,80,80,"November",CLAY,fin(t,tOf-0.2,0.5));
  p8_tags(ctx,t,1260,120,[[0.3,tOu-0.4,"Grace asks, in a ticket",BIZ],[tOu-0.2,tLa-0.4,"all twelve years, brought out",PS_OK],[tLa-0.2,tNi-0.4,"storm history, owned by network",APPC],
    [tNi-0.2,tCk-0.4,"each night's records, the same way",PSC],[tCk-0.2,tOf-0.4,"checked in test: the ticket closes",PS_OK],[tOf-0.2,tWi-0.4,"the old tool, switched off",SOFT],[tWi-0.2,sc.dur+1,"next year's work: from all twelve winters",AMBER]]);
  p8_under(ctx,t,1260,186,[[tCh-0.2,tLa-0.4,"each checked against the old tool's reports",PS_OK],[w("land","open format")-0.2,tNi-0.4,"as files in an open format",PSC],[w("off","month early")-0.2,tWi-0.4,"a month early",PS_OK]]);
  vign(ctx,S);});

/* ---------- 8. The whole practice, on the map ---------- */
// The whole data practice on Tomás's map, one data product from its owner to its files. Business: Grace, assigned the data owner's role;
// hosting capacity, a product, aggregating its service and its contract; what it means, a business object, in the glossary. Information:
// the data object that realises it. Application: its pipeline and models, one component, owned by network, composed with its output port,
// which serves the website. Technology: the platform's services, realised by Databricks, system software; and the artifacts, the tables as
// open-format files and the models as code, the utility's own. The seam runs between those files and the product that reads them; another
// product could read the same files. Ask what breaks if a table changes, and the lines lead up to Grace. The three series, top to bottom.
// a product, ArchiMate's way: a box with its glyph, a box with a tab
function p8_prodEl(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,6,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});
  ctx.save();ctx.fillStyle=rgba(col,0.16+0.1*(o.hi||0));rr(ctx,x,y,w,h,6);ctx.fill();const gx=x+w-28,gy=y+24,s=15;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;ctx.strokeRect(gx-s*0.8,gy-s*0.55,s*1.6,s*1.1);ctx.strokeRect(gx-s*0.8,gy-s*0.55,s*0.7,s*0.32);ctx.restore();
  T(ctx,name,x+w/2-12,y+h/2+10,{w:700,size:28,align:"center",color:rgba(INK,0.96)});});}
// aggregation: a line from the whole, with a hollow diamond at the whole's end, drawn as p goes 0 to 1
function p8_agg(ctx,x0,y0,x1,y1,col,a,p){if(a<=0.01||p<=0)return;const u=clamp(p,0,1),x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0),d=(dx,dy)=>[x0+dx*Math.cos(an)-dy*Math.sin(an),y0+dx*Math.sin(an)+dy*Math.cos(an)];
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineCap="round";const P1=d(11,-7),P2=d(22,0),P3=d(11,7);ctx.beginPath();ctx.moveTo(P2[0],P2[1]);ctx.lineTo(x,y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(P1[0],P1[1]);ctx.lineTo(P2[0],P2[1]);ctx.lineTo(P3[0],P3[1]);ctx.closePath();ctx.fillStyle="rgba(7,12,24,1)";ctx.fill();ctx.stroke();ctx.restore();});}
// access: a dotted line with a small open head where the data goes (to the object written, to whoever reads)
function p8_access(ctx,x0,y0,x1,y1,col,a,p){if(a<=0.01||p<=0)return;const u=clamp(p,0,1),x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";
  ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);if(u>0.95){ctx.beginPath();ctx.moveTo(x-Math.cos(an-0.5)*11,y-Math.sin(an-0.5)*11);ctx.lineTo(x,y);ctx.lineTo(x-Math.cos(an+0.5)*11,y-Math.sin(an+0.5)*11);ctx.stroke();}ctx.restore();});}
// an association: a plain line
function p8_assoc(ctx,x0,y0,x1,y1,col,a,p){p8_route(ctx,[[x0,y0],[x1,y1]],col,a,p,{lw:2.4,head:false});}
// the application component, its name at its top and its owner's tag inside it
function p8_comp(ctx,x,y,w,h,name,owner,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;psaEl(ctx,x,y,w,h,"",APPC,"component",{a,hi:o.hi});
  withA(ctx,a,()=>{T(ctx,name,x+w/2-10,y+42,{w:700,size:28,align:"center",color:rgba(INK,0.96)});withA(ctx,o.ownerA==null?1:o.ownerA,()=>psaOwner(ctx,x+w/2,y+h-28,owner,{align:"center"}));});}
// composition, ArchiMate's way: a line from the whole, with a filled diamond at the whole's end and no head at the part's
function p8_compose(ctx,x0,y0,x1,y1,col,a,p){if(a<=0.01||p<=0)return;const u=clamp(p,0,1),x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0),d=(dx,dy)=>[x0+dx*Math.cos(an)-dy*Math.sin(an),y0+dx*Math.sin(an)+dy*Math.cos(an)];
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineCap="round";const P1=d(9,-6),P2=d(18,0),P3=d(9,6);if(u*Math.hypot(x1-x0,y1-y0)>18){ctx.beginPath();ctx.moveTo(P2[0],P2[1]);ctx.lineTo(x,y);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(P1[0],P1[1]);ctx.lineTo(P2[0],P2[1]);ctx.lineTo(P3[0],P3[1]);ctx.closePath();ctx.fill();ctx.restore();});}
// the way up from a table to its owner, for "what breaks if it changes": the tables, the data object, the business object, the product,
// the role, Grace
const P8_UP=[[1638,660],[1638,347],[1800,347],[1800,174],[1420,174],[1020,175],[720,200],[650,238],[510,238],[510,100]];
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p8_room(ctx,S,t);
  const tIn=c("intro"),tOw=c("owner"),tPr=c("product"),tTe=c("term"),tIf=c("info"),tAp=c("app"),tPo=c("port"),tTc=c("tech"),tFi=c("files"),tSe=c("seam"),tUp=c("up"),tTh=c("three");
  ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  // the layers; and as the three series are named, the part of the map each drew
  const tB=w("three","Business architecture"),tD=w("three","Data architecture"),tS=w("three","this series");
  [[48,246,"business layer",BUSC,0.2,[pulseAt(t,tB+0.2,2.0)]],[304,86,"information layer",INFC,0.35,[pulseAt(t,tD+0.2,2.0)]],[402,124,"application layer",APPC,0.5,[pulseAt(t,tS+0.2,2.4)]],[538,294,"technology layer",TECC,0.65,[pulseAt(t,tS+0.2,2.4)]]].forEach(([y,h,nm,col,t0,[hi]])=>{
    psaBand(ctx,y,h,nm,col,fin(t,t0,0.8));if(hi>0.01)withA(ctx,hi,()=>{ctx.fillStyle=rgba(col,0.12);ctx.fillRect(60,y,1800,h);ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2.4;ctx.strokeRect(60,y,1800,h);});});
  const up=clamp((t-w("up","what breaks")+0.2)/2.8,0,1),reach=k=>{const L=p8_len(P8_UP),f=L[k]/L[L.length-1];return up>=f?pulseAt(t,w("up","what breaks")-0.2+2.8*f,1.4)+0.25:0;};
  // what breaks if a table changes: the lines lead up to Grace, a light along each line, under the boxes it passes, which glow as it does
  if(up>0&&up<1.0001)withA(ctx,1-fin(t,tTh-0.4,0.5),()=>p8_runner(ctx,P8_UP,up,PS_RED,{r:7,trail:0.14,hold:true}));
  // the map's two ends first, as the line names them: its owner at the top, its files at the bottom
  // business: Grace, assigned the data owner's role
  psaEl(ctx,370,68,280,64,"Grace",BIZ,"actor",{a:fin(t,w("intro","owner")-0.3,0.5),hi:reach(9)+pulseAt(t,w("owner","Grace"),1.4)+pulseAt(t,w("up","Grace"),1.6)});
  psaEl(ctx,370,206,280,64,"data owner",BUSC,"role",{a:fin(t,w("owner","data owner's")-0.3,0.5),hi:reach(7)});
  psaRel(ctx,510,132,510,206,"assign",BUSC,fin(t,w("owner","role")-0.2,0.4),clamp((t-w("owner","role"))/0.5,0,1));
  // hosting capacity, a product: it bundles its service and its contract
  const tHp=w("product","Hosting capacity");p8_prodEl(ctx,720,130,300,90,"hosting capacity",BUSC,{a:fin(t,tHp-0.3,0.5),hi:reach(5)});
  p8_assoc(ctx,650,238,720,200,BUSC,fin(t,tHp+0.4,0.4),clamp((t-tHp-0.4)/0.5,0,1));
  psaEl(ctx,1080,64,330,62,"look up capacity",BUSC,"service",{a:fin(t,w("product","its service")-0.3,0.5)});psaEl(ctx,1080,218,330,62,"its contract",BUSC,"contract",{a:fin(t,w("product","its contract")-0.3,0.5)});
  p8_agg(ctx,1020,152,1080,95,BUSC,fin(t,w("product","bundles")-0.2,0.4),clamp((t-w("product","its service")+0.1)/0.5,0,1));p8_agg(ctx,1020,198,1080,249,BUSC,fin(t,w("product","bundles")-0.2,0.4),clamp((t-w("product","its contract")+0.1)/0.5,0,1));
  // what it means: a business object, defined in the glossary
  psaEl(ctx,1420,134,430,80,"solar a street can take",BUSC,"object",{a:fin(t,w("term","business object")-0.3,0.5),hi:reach(3)});
  p8_assoc(ctx,1020,175,1420,174,BUSC,fin(t,w("term","What it means")-0.2,0.4),clamp((t-w("term","What it means"))/0.8,0,1));
  withA(ctx,fin(t,w("term","glossary")-0.3,0.5),()=>p8_chip(ctx,1560,256,"in the glossary",{align:"center",col:BUSC}));
  // information: the data object that realises it
  psaEl(ctx,1420,314,430,66,"capacity, street by street",INFC,"object",{a:fin(t,w("info","data object")-0.3,0.5),hi:reach(1)});
  psaRel(ctx,1800,314,1800,214,"realise",INFC,fin(t,w("info","realises")-0.2,0.4),clamp((t-w("info","realises"))/0.5,0,1));
  // application: its pipeline and models, one component, owned by network, writing the data object; its output port; the website
  const tCp=w("app","pipeline and models");p8_comp(ctx,960,412,460,104,"pipeline and models","network",{a:fin(t,tCp-0.3,0.5),ownerA:fin(t,w("app","owned by network")-0.2,0.5)});
  p8_access(ctx,1420,440,1466,380,APPC,fin(t,tCp+0.6,0.4),clamp((t-tCp-0.6)/0.5,0,1));
  psaEl(ctx,660,426,230,76,"output port",APPC,"interface",{a:fin(t,w("port","output port")-0.3,0.5),hi:pulseAt(t,w("port","website reads"),1.4)});
  p8_compose(ctx,960,464,890,464,APPC,fin(t,w("port","application interface")-0.2,0.4),clamp((t-w("port","application interface"))/0.5,0,1));
  psaEl(ctx,370,426,230,76,"the website",APPC,"component",{a:fin(t,w("port","website")-0.3,0.5)});psaRel(ctx,660,464,600,464,"serve",APPC,fin(t,w("port","website reads")-0.2,0.4),clamp((t-w("port","website reads"))/0.5,0,1));
  // technology: the platform's services, which Databricks realises, as system software; and they serve the pipeline
  const tSv=w("tech","platform's services"),tDb=w("tech","Databricks");
  [["compute",370,170],["the catalogue",560,240],["schedules",820,190]].forEach(([nm,x,w_],i)=>{psaEl(ctx,x,556,w_,58,nm,TECC,"service",{a:fin(t,tSv-0.2+i*0.15,0.5)});
    psaRel(ctx,x+w_/2,648,x+w_/2,614,"realise",TECC,fin(t,w("tech","realises")-0.2+i*0.1,0.4),clamp((t-w("tech","realises")-i*0.1)/0.4,0,1));});
  psaRel(ctx,985,556,985,516,"serve",TECC,fin(t,tSv+0.6,0.4),clamp((t-tSv-0.6)/0.4,0,1));
  psaEl(ctx,370,648,640,70,"Databricks",TECC,"software",{a:fin(t,tDb-0.3,0.5),hi:pulseAt(t,w("tech","system software"),1.4)});
  // its artifacts, the utility's own, each under what it realises: the models as code in its repository, under the pipeline; the tables
  // as files in an open format, under the data object (the tables came in with the line's "its files")
  const tTb=w("files","the tables"),tMo=w("files","the models"),gA=fin(t,w("files","utility's repository")-0.3,0.6);
  if(gA>0.01)withA(ctx,gA,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.85);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,1100,548,752,278,14);ctx.stroke();ctx.setLineDash([]);ctx.restore();T(ctx,"the utility's own",1124,806,{w:700,size:28,color:rgba(PSC,1)});});
  psaEl(ctx,1436,620,404,80,"tables: open-format files",PSC,"artifact",{a:fin(t,w("intro","files")-0.3,0.5),hi:reach(0)+pulseAt(t,tTb,1.4)+pulseAt(t,w("seam","those files"),1.6)});
  psaEl(ctx,1130,620,270,80,"models: code",PSC,"artifact",{a:fin(t,tMo-0.3,0.5),hi:pulseAt(t,w("seam","same code"),1.4)});
  psaRel(ctx,1638,620,1638,380,"realise",PSC,fin(t,w("files","open format")-0.2,0.4),clamp((t-w("files","open format"))/0.6,0,1));
  psaRel(ctx,1265,620,1265,516,"realise",PSC,fin(t,w("files","as code")-0.2,0.4),clamp((t-w("files","as code"))/0.5,0,1));
  // the seam, between those files and the product that reads them; and another product that could read the same files and run the same code
  const tSr=w("seam","seam runs"),sp=clamp((t-tSr+0.2)/1.4,0,1),shi=pulseAt(t,tSr+0.6,1.8);
  if(sp>0)withA(ctx,fin(t,tSr-0.3,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(PSC,1);ctx.lineWidth=4+2*shi;ctx.lineCap="round";ctx.shadowColor=rgba(PSC,0.9);ctx.shadowBlur=14+14*shi;ctx.setLineDash([16,10]);ctx.beginPath();ctx.moveTo(1055,548);ctx.lineTo(1055,548+278*sp);ctx.stroke();ctx.setLineDash([]);ctx.restore();});
  const rd=w("seam","product that reads");p8_access(ctx,1100,683,1010,683,TECC,fin(t,rd-0.3,0.4),clamp((t-rd)/0.5,0,1));
  const tAn=w("seam","Another product"),oA=fin(t,tAn-0.3,0.5);p8_ghost(ctx,370,746,640,62,"another product",TECC,oA);
  p8_access(ctx,1100,777,1010,777,TECC,oA*0.9,clamp((t-w("seam","same files"))/0.5,0,1));
  // and each box the light reaches keeps a red ring, the tables to Grace, until the three series are named
  {const L=p8_len(P8_UP),t0=w("up","what breaks")-0.2,out=1-fin(t,tTh-0.4,0.5);[[0,1436,620,404,80],[1,1420,314,430,66],[3,1420,134,430,80],[5,720,130,300,90],[7,370,206,280,64],[9,370,68,280,64]].forEach(([k,x,y,w_,h])=>{
    const a=fin(t,t0+2.8*L[k]/L[L.length-1]-0.1,0.3)*out;if(a>0.01)withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=3;ctx.shadowColor=rgba(PS_RED,0.8);ctx.shadowBlur=14;rr(ctx,x-5,y-5,w_+10,h+10,10);ctx.stroke();ctx.restore();});});}
  ctx.restore();
  const tags=[[0.4,tOw-0.4,"the whole data practice, on Tomás's map",SOFT],[tOw-0.2,tPr-0.4,"business: Grace holds the data owner's role",BUSC],[tPr-0.2,tTe-0.4,"a product: its service and its contract",BUSC],
    [tTe-0.2,tIf-0.4,"what it means: a business object, in the glossary",BUSC],[tIf-0.2,tAp-0.4,"information: the data object that realises it",INFC],[tAp-0.2,tPo-0.4,"application: its pipeline and models, owned by network",APPC],
    [tPo-0.2,tTc-0.4,"its output port, where the website reads it",APPC],[tTc-0.2,tFi-0.4,"technology: the platform's services, realised by Databricks",TECC],[tFi-0.2,tSe-0.4,"its artifacts: open-format files and code, the utility's own",PSC],
    [tSe-0.2,tUp-0.4,"the seam: between the files and the product that reads them",PSC],[tUp-0.2,tB-0.4,"what breaks if a table changes? the lines lead up to Grace",PS_RED],
    [tB-0.2,tD-0.4,"Business architecture for data: the top",BUSC],[tD-0.2,tS-0.4,"Data architecture: the middle",INFC],[tS-0.2,sc.dur,"this series: the foundations",TECC]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,866,s_,col,{align:"center",size:28})));
  vign(ctx,S);});

/* ---------- 9. Kept, never finished ---------- */
// The road at dusk: the Gokaidō, kept for more than 250 years, horses added, villages called on, rules rewritten; but who carried the
// cost never changed, and when the railway came, a train passing beyond the station, many station towns declined. Then the utility: a
// data practice isn't built once either; so it's kept, each part with a stage and a date, a way out tested each year, the map changed
// with every change; the next end planned, not forced, and what's the utility's own goes with it. Then the next series.
// the railway's bank, along the hills' foot beyond the station: the rail's height
const P8_RB=702;
// a train of the 1880s, in silhouette, going left: its engine, its tender, three carriages with their windows lit, smoke drifting back
function p8_train(ctx,x,y0,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);const D="rgba(15,13,18,1)";
  for(let i=0;i<7;i++){const u=((t*0.8+i/7)%1);ctx.fillStyle="rgba(120,112,124,"+(0.2*(1-u)).toFixed(3)+")";ctx.beginPath();ctx.arc(32+u*300,-128-u*46,14+u*30,0,TAU);ctx.fill();}
  glow(ctx,-6,-48,60,[255,214,150],0.35);ctx.fillStyle=D;rr(ctx,0,-72,150,48,10);ctx.fill();ctx.fillRect(22,-114,18,44);ctx.fillRect(14,-120,34,10);ctx.fillRect(120,-112,62,88);ctx.fillRect(114,-118,74,10);
  ctx.beginPath();ctx.moveTo(4,-28);ctx.lineTo(-24,0);ctx.lineTo(12,0);ctx.closePath();ctx.fill();ctx.fillRect(0,-32,192,12);[30,80,140].forEach(wx=>{ctx.beginPath();ctx.arc(wx,-14,15,0,TAU);ctx.fill();});
  ctx.fillStyle=rgba([255,214,150],0.8);ctx.fillRect(134,-98,32,22);ctx.fillStyle=D;ctx.fillRect(198,-70,74,50);[218,252].forEach(wx=>{ctx.beginPath();ctx.arc(wx,-12,11,0,TAU);ctx.fill();});
  for(let k=0;k<3;k++){const cx=282+k*152;rr(ctx,cx,-86,142,68,6);ctx.fill();ctx.fillRect(cx-4,-92,150,8);ctx.fillStyle=rgba([255,214,150],0.85);for(let j=0;j<4;j++)ctx.fillRect(cx+14+j*32,-72,20,18);ctx.fillStyle=D;
    [cx+26,cx+116].forEach(wx=>{ctx.beginPath();ctx.arc(wx,-12,11,0,TAU);ctx.fill();});}
  ctx.strokeStyle=rgba(mix([90,80,90],PSC,0.5),0.75);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-72);ctx.lineTo(150,-72);ctx.moveTo(114,-118);ctx.lineTo(188,-118);for(let k=0;k<3;k++){ctx.moveTo(278+k*152,-92);ctx.lineTo(428+k*152,-92);}ctx.stroke();ctx.restore();});}
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tRd=c("road"),tNv=c("never"),tTo=c("towns"),tK=c("kept"),tEa=c("each"),tDa=c("data"),tNx=c("next");
  const outA=1-fin(t,B+0.6,0.8),rA=(1-fin(t,tK-0.6,0.9))*outA,uA=fin(t,tK-0.6,0.9)*outA;if(outA<1)p8_base(ctx,S);
  psaRooms(ctx,[[rA,ctx=>{psaDusk(ctx,S,{d:1,y0:P8_Y0});ctx.save();drift(ctx,t,{dur:tK+1},{z:0.02,y:640,x:960});
    // the helper villages on the hill behind; the station's lantern and the villages' lights go down as the towns decline
    const tTr=w("towns","railway came"),dim=fin(t,w("towns","declined")-0.4,1.6);
    [[110,0.34],[220,0.32],[320,0.3]].forEach(([x,s],i)=>p8_house(ctx,x,696-i*4,s,{lit:(0.8-0.15*i)*(1-0.85*dim)}));
    // the railway, on its bank along the hills' foot beyond the station, laid in from the right; then a train going by, not stopping
    const bp=easeCam(clamp((t-tTr+1.2)/1.2,0,1)),rl=fin(t,tTr-1.2,0.6);
    if(rl>0.01)withA(ctx,rl,()=>{const xl=lerp(1960,-40,bp);ctx.save();ctx.fillStyle="rgba(22,19,27,1)";ctx.beginPath();ctx.moveTo(xl,P8_RB);ctx.lineTo(1960,P8_RB);ctx.lineTo(1960,P8_Y0);ctx.lineTo(xl-30,P8_Y0);ctx.closePath();ctx.fill();
      ctx.strokeStyle=rgba(RAILC,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(xl,P8_RB);ctx.lineTo(1960,P8_RB);ctx.stroke();ctx.restore();});
    p8_train(ctx,2000-(t-tTr)*480,P8_RB,0.5,t,rl);
    [[130,1.05,3],[1870,0.95,5]].forEach(([x,s,k])=>psaPine(ctx,x,P8_Y0+2,s,k,{rim:PSC}));
    psaStation(ctx,900,P8_Y0+2,0.95,{lit:1-0.75*dim});
    // the station's porters and horses; a porter carrying a load in from the villages
    [[1210,0.86,-1,0.1],[1280,0.84,1,0.6]].forEach(([x,s,d,ph])=>psaWalker(ctx,x,P8_G-4,s,t,{kind:"porter",dir:d,still:true,ph}));
    psaHorse(ctx,1400,P8_G-8,0.6,t,{dir:-1,still:true,pack:true,ph:0.2});psaHorse(ctx,1520,P8_G-10,0.58,t,{dir:1,still:true,ph:0.7});
    {const v=psaPace("walker",0.86,0.45),[d,amp]=p8_go(t,tNv-1.0,tNv+6,v);psaWalker(ctx,330+d,P8_G+10,0.86,t,{kind:"porter",dir:1,ph:0.3,amp,still:amp<=0.001,rate:0.45,a:fin(t,tNv-1.2,0.5)});}
    ctx.restore();
    eaYear(ctx,80,80,"1601 to 1872",CLAY,fin(t,0.4,0.6));
    p8_tags(ctx,t,960,120,[[0.4,tNv-0.4,"the Gokaidō: kept for more than 250 years",PSC],[tNv-0.2,tTo-0.4,"it never changed who carried the cost",PS_RED],[tTo-0.2,sc.dur+1,"when the railway came, many station towns declined",SOFT]]);
    withA(ctx,fin(t,w("road","horses added")-0.2,0.5)*(1-fin(t,tNv-0.4,0.4)),()=>p8_row(ctx,960,186,[["horses added",PSC,1],["villages called on",PSC,fin(t,w("road","villages called")-0.2,0.5)],["rules rewritten",PSC,fin(t,w("road","rules rewritten")-0.2,0.5)]],18));
    p8_under(ctx,t,960,186,[[w("never","stations and helper villages")-0.2,tTo-0.4,"the stations and helper villages bore it, until it broke them",PS_RED]]);}],
  [uA,ctx=>{p8_room(ctx,S,t);ctx.save();drift(ctx,t-tK,{dur:24},{z:0.012,y:500,x:1100});
    p8_people(ctx,t,sc,1,1);p8_store(ctx,1,{nt:1,hi:pulseAt(t,w("data","utility's own"),1.8)});p8_slab(ctx,1);p8_seam(ctx,1,1,pulseAt(t,w("data","utility's own"),1.8));p8_hosting(ctx,t);
    p8_prod(ctx,t,1,"storm history",{owner:"network"});p8_reads(ctx,P8_SLOT[1]+360,P8_BY+P8_BH,10,1,1);
    // a data practice isn't built once: products end, needs grow, people move on; so it's kept
    p8_row(ctx,1260,290,[["products end",PS_RED,fin(t,w("kept","products end")-0.2,0.5)],["needs grow",AMBER,fin(t,w("kept","needs grow")-0.2,0.5)],["people move on",SOFT,fin(t,w("kept","people move on")-0.2,0.5)]],18);
    [["every part: a stage and a date","a stage"],["a way out, tested each year","a way out"],["the map, changed with every change","the map"]].forEach(([s_,k],i)=>p8_chip(ctx,1260,366+i*58,s_,{align:"center",col:i===2?TECC:PSC,mark:"ok",a:fin(t,w("each",k)-0.2,0.5),mp:clamp((t-w("each",k))/0.5,0,1)}));
    ctx.restore();
    p8_tags(ctx,t,1260,120,[[tK-0.2,tEa-0.4,"a data practice isn't built once either",SOFT],[tEa-0.2,tDa-0.4,"so it's kept",PSC],[tDa-0.2,sc.dur+1,"the next end: planned, not forced",PS_OK]]);
    p8_under(ctx,t,1260,186,[[w("data","utility's own")-0.2,sc.dur+1,"and what's the utility's own goes with it",PSC]]);
    withA(ctx,fin(t,tNx-0.1,0.6),()=>tag(ctx,1260,552,"Next: AI and continuous architecture",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"Built to change","Every part with a date and a way out, and what's yours goes with you.","film 8 of 8");});

/* where the chapters meet: the utility's chapters glide on from one to the next in one room (From words to data's joins.js); what
   stays stays put, and whatever leaves does so after the join */
const CHAPTER_JOINS={glide:["buy","seams","dates","exit","storm"]};
