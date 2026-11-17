/* ===== A road people choose: scenes =====
   Ten chapters, as in ../script.md. Japan, the 1700s: ordinary people may not travel as they please, but a pilgrimage is hard to
   refuse, and people say "once in a lifetime, to Ise". A farmer who has never left his village doesn't know the road, and the journey
   costs more than one household can spare. So villages form pilgrimage groups, each household paying in, two or three chosen by lot
   to go for everyone; priests from Ise, the oshi, visit the villages every year, lodge the pilgrims at Ise and guide them to the
   shrines; guidebooks list every station. Nobody is made to go: in 1771 more than two million cross the river into Ise, counted at the
   ferry. Then the utility: a first data product took six weeks of tickets, and two teams gave up; Ravi Menon makes the platform a road
   teams choose: a path already laid from a template, the rules built in, a guide and someone to ask; metering's team goes live in two
   days; Ravi counts who chooses it.
   Made to read on a phone (tools/legible.py, site-tools/fits.py): text is at least 28 px in the frame and inside its box, and what's
   drawn small is texture. Motion: every shot drifts slowly and things arrive with a spring; on the map the camera glides; the utility's
   chapters glide on from one to the next in one room, where what stays stays put and only what changes fades; between rooms the whole
   picture dissolves. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in
   step. */

/* ---------- shared by the chapters ---------- */
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p7_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p7_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaWalker)
function p7_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}
// a light that travels along a path, with a fading trail: a pilgrim on the map, a team on the platform's path
function p7_runner(ctx,pts,u,col,o){o=o||{};if(u<=0||u>=1.0001&&!o.hold)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0||uu>1)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// lights going along a path one after the other, n of them, each taking per seconds, from t0: pilgrims on the road, teams on the path
function p7_flow(ctx,P,t,t0,n,per,r,a,col){if(a<=0.01||t<t0)return;withA(ctx,a,()=>{for(let i=0;i<n;i++){const s_=(t-t0)/per-i/n;if(s_<0)continue;p7_runner(ctx,P,s_%1,col||PSC,{r,trail:0.04});}});}
// a tick or a cross, drawn in strokes as p goes from 0 to 1, s across
function p7_mark(ctx,kind,x,y,s,p){if(p<=0.01)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=Math.max(3,s*0.16);const a=clamp(p*2,0,1),b=clamp(p*2-1,0,1);
  if(kind==="ok"){ctx.strokeStyle=rgba(PS_OK,1);ctx.beginPath();ctx.moveTo(x-s*0.42,y);ctx.lineTo(x-s*0.42+s*0.3*a,y+s*0.3*a);if(b>0)ctx.lineTo(x-s*0.12+s*0.55*b,y+s*0.3-s*0.62*b);ctx.stroke();}
  else{const h=s*0.34;ctx.strokeStyle=rgba(PS_RED,1);ctx.beginPath();ctx.moveTo(x-h,y-h);ctx.lineTo(x-h+2*h*a,y-h+2*h*a);if(b>0){ctx.moveTo(x+h,y-h);ctx.lineTo(x+h-2*h*b,y-h+2*h*b);}ctx.stroke();}
  ctx.restore();}
// a small pill: a name, a team, a step; o.dash draws an outline only; o.mark ("ok" or "no") a tick or a cross at its left, drawn as
// o.mp goes from 0 to 1; o.strike a line through it. Made from its words as drawn, at their size.
function p7_chipW(ctx,name,sz,o){o=o||{};return 30+tw(ctx,name,sz||28,700)+(o.mark?38:0);}
function p7_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p7_chipW(ctx,name,sz,o),h=sz+18,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    else glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,14,18,0.94)"});
    if(o.mark)p7_mark(ctx,o.mark,X+30,y,22,o.mp==null?1:o.mp);
    if(name)T(ctx,name,X+(o.mark?38:0)+(w-(o.mark?38:0))/2,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(o.dash?mix(col,INK,0.3):INK,0.96)});
    if(o.strike>0.01){ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+12,y);ctx.lineTo(X+12+(w-24)*clamp(o.strike,0,1),y);ctx.stroke();ctx.restore();}});return w;}
// chips in a row, centred on x, gap apart: [[text, col, a, o], ...]
function p7_row(ctx,x,y,items,gap){gap=gap||20;const ws=items.map(it=>p7_chipW(ctx,it[0],(it[3]||{}).size,it[3]||{})),tot=ws.reduce((s_,v)=>s_+v,0)+gap*(items.length-1);let xx=x-tot/2;
  items.forEach((it,i)=>{p7_chip(ctx,xx,y,it[0],Object.assign({col:it[1],a:it[2]},it[3]||{}));xx+=ws[i]+gap;});}
// a line through the points P, drawn up to p of its length, with a head at its end once it's whole; o.lw, o.glow, o.head, o.dash
function p7_len(S){const L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));return L;}
function p7_route(ctx,P,col,a,p,o){o=o||{};if(a<=0.01||p<=0)return;const L=p7_len(P),d=clamp(p,0,1)*L[L.length-1];withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  if(o.glow){ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=o.glow;}ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let end=P[0],an=0;
  for(let i=1;i<P.length;i++){if(L[i]<=d){ctx.lineTo(P[i][0],P[i][1]);end=P[i];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=lerp(P[i-1][0],P[i][0],f),y=lerp(P[i-1][1],P[i][1],f);ctx.lineTo(x,y);end=[x,y];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);break;}}
  ctx.stroke();ctx.shadowBlur=0;ctx.setLineDash([]);if(o.head!==false&&p>=0.98){const hs=o.head||9,[x,y]=end;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.5)*hs,y-Math.sin(an-0.5)*hs);ctx.lineTo(x-Math.cos(an+0.5)*hs,y-Math.sin(an+0.5)*hs);ctx.closePath();ctx.fill();}ctx.restore();});}
// a question mark, red: what a farmer doesn't know about the road
function p7_q(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,40,PS_RED,0.35);T(ctx,"?",x,y+16,{w:800,size:44,align:"center",color:rgba(PS_RED,1)});});}
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility checks' hook (legible.py,
// fits.py), as the agent films' pieces.js has it
let PH_OFF=0;
function p7_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// a strip of the road, its stations lit along it and a traveller's light going along it from t0; two lines of words, above and below
function p7_strip(ctx,t,x0,x1,y,t0,a,top,bottom){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=4;ctx.shadowColor=rgba(PSC,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore();
  for(let i=0;i<6;i++)psaStop(ctx,x0+20+i*(x1-x0-40)/5,y,{lit:0.6,r:7});p7_runner(ctx,[[x0,y],[x1,y]],clamp((t-t0)/3.2,0,1),APPC,{r:7,trail:0.25,hold:true});
  T(ctx,top,x0,y-34,{w:700,size:28,color:rgba(PSC,1)});T(ctx,bottom,x0,y+58,{w:700,size:28,color:rgba(APPC,1)});});}
// an element drawn dashed, no glyph: a data product not there yet; its name centred, made from its words as drawn
function p7_dashEl(ctx,x,y,w,h,name,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.72)";rr(ctx,x,y,w,h,8);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([10,8]);rr(ctx,x,y,w,h,8);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  if(name){const sz=28,ww=w-40,ls=wrapT(ctx,name,0,0,ww,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,ww,{size:sz,w:700,align:"center",color:rgba(mix(col,INK,0.4),0.95),lh:sz*1.15});}});}
// the utility's chapters share one room: Ravi at the left, what he works on at the right. People are drawn at the film's own time, so
// they stay put where one chapter glides on from the next (the engine lays the end of one over the start of the other).
const P7_ME=[230,0.8],P7_WHO=500;
function p7_me(ctx,t,sc,a){const T_=t+(sc.start||0);psaWhole(ctx,a==null?1:a,[P7_ME[0]-230,380,P7_ME[0]+230,1080],c=>person(c,"ravi",P7_ME[0],1030,P7_ME[1],{t:T_}));
  psaWho(ctx,P7_ME[0]-10,P7_WHO,"Ravi Menon","platform lead",TECH,a==null?1:a);}
// words over a chapter: [[from, to, text, colour], ...] as tags at the top, one at a time; and one chip under them
function p7_tags(ctx,t,x,y,L,size){L.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,x,y,s_,col,{align:"center",size:size||32})));}
function p7_under(ctx,t,x,y,L){L.forEach(([a0,a1,s_,col,o])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>p7_chip(ctx,x,y,s_,Object.assign({align:"center",col},o||{}))));}

/* ---------- the story: on the road to Ise ---------- */
const P7_Y0=760,P7_G=784;
// a farmhouse: low walls under a steep, thick thatch, its doorway lit from within; o.charm (0..1) a slip of paper by its door, given by
// the oshi; drawn in the series' silhouettes, light on dark, as its stations are
function p7_house(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  if(lit>0.01)glow(ctx,0,-50,150,PSC,0.14*lit);
  ctx.fillStyle="rgba(20,16,18,1)";ctx.fillRect(-92,-82,184,82);
  ctx.beginPath();ctx.moveTo(-116,-72);ctx.lineTo(-60,-180);ctx.lineTo(60,-180);ctx.lineTo(116,-72);ctx.quadraticCurveTo(0,-62,-116,-72);ctx.closePath();ctx.fillStyle="rgba(13,11,14,1)";ctx.fill();
  ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.35*lit),0.75);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-116,-72);ctx.lineTo(-60,-180);ctx.lineTo(60,-180);ctx.lineTo(116,-72);ctx.stroke();
  ctx.fillStyle="rgba(9,8,10,1)";ctx.fillRect(-66,-188,132,10);
  const g=ctx.createLinearGradient(0,-62,0,0);g.addColorStop(0,rgba(mix([40,30,28],[255,190,120],lit*0.85),0.95));g.addColorStop(1,rgba(mix([24,18,18],[140,90,60],lit*0.85),0.95));ctx.fillStyle=g;ctx.fillRect(-22,-62,44,62);
  const ch=o.charm||0;if(ch>0.01){glow(ctx,46,-50,40,[255,236,200],0.55*ch);withA(ctx,ch,()=>{ctx.fillStyle=rgba(WASHI,1);rr(ctx,38,-76,14,36,2);ctx.fill();ctx.fillStyle=rgba(SEALC,0.9);ctx.fillRect(41,-70,8,6);});}
  ctx.restore();});}
// a coin with a square hole, as the coins of the time were; o.dash draws only its place, a coin still to find
function p7_coin(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();
  if(o.dash){ctx.strokeStyle=rgba(o.col||SOFT,0.75);ctx.lineWidth=2.2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  else{glow(ctx,x,y,r*2.6,PSC,0.28+0.3*(o.hi||0));ctx.fillStyle=rgba(mix(PSC,[255,236,200],0.25),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba([120,84,50],0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,r*0.8,0,TAU);ctx.stroke();ctx.fillStyle="rgba(24,16,12,1)";ctx.fillRect(x-r*0.27,y-r*0.27,r*0.54,r*0.54);}
  ctx.restore();});}
// the group's lots: a box, and two lots rising out of it as k goes from 0 to 1, lit
function p7_lots(ctx,x,y,k,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);
  [[-9,0],[9,0.3]].forEach(([dx,d])=>{const q=spring(clamp(k*1.4-d,0,1)),h=24+q*50;if(q>0.01)glow(ctx,dx,-h,34,PSC,0.45*q);ctx.fillStyle=rgba(mix([120,96,70],[255,226,170],q),1);rr(ctx,dx-3.5,-h,7,h,2);ctx.fill();});
  ctx.fillStyle="rgba(26,20,20,1)";rr(ctx,-26,-30,52,62,8);ctx.fill();ctx.strokeStyle=rgba(mix([90,70,56],PSC,0.45),0.9);ctx.lineWidth=2.4;rr(ctx,-26,-30,52,62,8);ctx.stroke();
  ctx.restore();});}
// an oshi on the road: a traveller with a wooden box of charms and calendars on his back, its straps over his shoulders; drawn whole,
// then laid on the frame at its alpha (psaWhole), so it never shows through itself
function p7_oshi(ctx,x,G,s,t,o){o=o||{};const dir=o.dir||-1,amp=o.amp==null?1:o.amp,ph=o.ph==null?0.4:o.ph,rate=o.rate||0.55,a=o.a==null?1:o.a;if(a<=0.01)return;
  psaWhole(ctx,a,[x-170*s,G-270*s,x+170*s,G+12*s],c=>{const bob=(1-Math.abs(Math.cos((ph+t*rate)*TAU)))*2.2*amp*s;
    c.save();c.translate(x-dir*34*s,G-148*s+bob);c.fillStyle="rgba(20,16,16,1)";rr(c,-26*s,-46*s,52*s,78*s,6*s);c.fill();c.strokeStyle=rgba(mix([90,70,56],PSC,0.55),0.9);c.lineWidth=2;rr(c,-26*s,-46*s,52*s,78*s,6*s);c.stroke();
    c.strokeStyle=rgba(mix([90,70,56],PSC,0.4),0.7);c.beginPath();c.moveTo(-26*s,-8*s);c.lineTo(26*s,-8*s);c.stroke();c.restore();
    psaWalker(c,x,G,s,t,{kind:"walker",dir,ph,amp,still:amp<=0.001,rate});},"oshi");}
// the shrines' grove: tall cedars, dark against the dusk, with a warm light among them
function p7_grove(ctx,x,y0,s,lit,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  if(lit>0.01)glow(ctx,10,-170,320,[255,214,150],0.22*lit);
  [[-250,250,0.8],[-160,320,0.92],[-60,400,1.0],[50,440,1.06],[160,370,0.96],[260,300,0.86]].forEach(([dx,h,k])=>{ctx.fillStyle="rgba(15,16,19,1)";ctx.beginPath();ctx.moveTo(dx-30*k,0);ctx.lineTo(dx-5*k,-h);ctx.lineTo(dx+5*k,-h);ctx.lineTo(dx+30*k,0);ctx.closePath();ctx.fill();
    for(let j=0;j<6;j++){const yy=-h*(0.22+j*0.13),ww=(52-j*7)*k;ctx.beginPath();ctx.moveTo(dx-ww,yy+12);ctx.quadraticCurveTo(dx,yy-26,dx+ww,yy+12);ctx.closePath();ctx.fill();}
    if(lit>0.01){ctx.strokeStyle=rgba([255,214,150],0.12*lit);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(dx-30*k,0);ctx.lineTo(dx-5*k,-h);ctx.stroke();}});
  ctx.restore();});}
// a sheet that came after the pilgrims: a comic tale's page, with two travellers on the road, or a print of a station by its pines;
// the series' own silhouettes, drawn in ink on the paper, never in the style of the prints themselves
function p7_sheet(ctx,x,y,w,h,kind,a,t,rot){if(a<=0.01)return;withA(ctx,a,()=>{psaPaper(ctx,x,y,w,h,[],{a:1,rot:rot||0});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.translate(-w/2,-h/2);ctx.beginPath();ctx.rect(18,18,w-36,h-36);ctx.clip();
  const ink=[58,48,42],gy=h-54;ctx.strokeStyle=rgba(ink,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(26,gy);ctx.lineTo(w-26,gy);ctx.stroke();
  if(kind==="tale"){psaWalker(ctx,w*0.36,gy,0.66,t,{kind:"walker",dir:1,ph:0.1,rate:0.55,col:ink,rim:ink});psaWalker(ctx,w*0.62,gy,0.66,t,{kind:"pilgrim",dir:1,ph:0.6,rate:0.55,col:ink,rim:ink});}
  else{psaPine(ctx,w*0.16,gy,0.5,4,{col:ink});psaStation(ctx,w*0.6,gy,0.5,{lit:0.15});}
  ctx.restore();});}

/* ---------- the story: Japan's map, and the roads to Ise ---------- */
// the map's view for this film: Edo, Kyoto and Ise all in the frame, above the captions
const P7_VIEW={lon:137.35,lat:35.0,k:330,cx:960,cy:520};
// the road to Ise from the Tōkaidō at Yokkaichi, through Hinaga, Tsu and Matsusaka to Yamada, by the shrines (as film 3 drew it); the
// Miyagawa, the river crossed by ferry into Ise; and where the road crosses it
const P7_TOISE=[[136.598,34.937],[136.567,34.85],[136.522,34.745],[136.52,34.63],[136.6,34.545],[136.705,34.49]];
const P7_MIYA=[[136.652,34.425],[136.67,34.462],[136.689,34.499],[136.706,34.53],[136.732,34.562]],P7_FERRY=[136.689,34.499];
// the ways to Ise on the map: from Edo, the Tōkaidō to Yokkaichi and the road south; from Kyoto, the Tōkaidō to Seki, then down to Tsu
function p7_ways(v){const TK=PSA_TKD.map((s_,i)=>psaTkd(i,v)),J=p=>psaJP(p[0],p[1],v);
  return{TK,east:TK.slice(0,44).concat(P7_TOISE.map(J)),west:TK.slice(47).reverse().concat([[136.522,34.745],[136.52,34.63],[136.6,34.545],[136.705,34.49]].map(J))};}
// the guidebook's page: what it lists, line by line
const P7_GUIDE=["A GUIDE FOR THE ROAD","every station on the way","how far apart they are","the inns","the sights"];
// a count, typed as it grows: the pilgrims who crossed the Miyagawa by ferry in 1771
function p7_num(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}

/* ---------- 1. Once in a lifetime ---------- */
scene("ise",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tOn=c("once"),tFa=c("far"),tFm=c("farmer"),tCo=c("cost"),tNe=c("need"),tGr=c("group"),tOs=c("oshi"),tLo=c("lodge"),tBk=c("book"),tCh=c("choose"),tMa=c("many"),tFe=c("ferry"),tTa=c("tale"),tO1=c("one"),tRa=c("ravi");
  // which room: the map; a village on the road at dusk; Ise, the oshi's house and the shrines' grove; the map again; then the utility.
  // Under the title, the last room leaves whole
  const outA=1-fin(t,B+0.9,0.7),v1=fin(t,tFm-1.0,0.9),i1=fin(t,tLo-1.0,0.9),m2=fin(t,tBk-1.0,0.9),u1=fin(t,tO1-0.8,0.9);
  const mA=Math.max(1-v1,m2*(1-u1))*outA,vA=v1*(1-i1)*outA,iA=i1*(1-m2)*outA,uA=u1*outA;if(outA<1)p7_base(ctx,S);
  const late=t>tBk-1.0;
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.2});ctx.save();
    const CK=late?[[tBk-1.0,1150,500,1.0],[tFe-0.4,820,650,2.5],[tTa-0.6,1150,500,1.0]]:[[0,1060,500,0.94],[tOn-0.6,1000,540,1.0],[tFa-0.4,1080,500,1.0]],z=focusZ(t,CK,2.2);focus(ctx,t,CK,2.2);
    const v=P7_VIEW,R=p7_ways(v),J=p=>psaJP(p[0],p[1],v);
    psaMap(ctx,v,t,{lit:0.3,roads:late?0.5:clamp((t-0.6)/2.4,0,1),tkd:1,st:late?fin(t,w("book","every station")-0.3,0.8):0,ends:fin(t,0.6,0.8),namesA:fin(t,0.6,0.8)*(late?1-fin(t,tFe-0.6,0.4)*(1-fin(t,tTa-0.4,0.6)):1),nameSize:34/z,
      lit_:i=>late&&i<=43?clamp((t-w("book","every station")-i*0.03)/0.4,0,1):0});
    // the road south to Ise, from the Tōkaidō at Yokkaichi
    psaPath(ctx,P7_TOISE.map(J),clamp((t-tOn+0.2)/1.4,0,1),{lw:3.4/z+1,glow:10,col:mix(PSC,[255,226,180],0.2),a:0.9});
    // Ise, and its great shrine: a light where the road ends
    const[ix,iy]=J(P7_ISE_PT),hA=fin(t,w("once","Ise")-0.3,0.8);if(hA>0.01){glow(ctx,ix,iy,90/z,[255,214,150],0.6*hA);withA(ctx,hA,()=>{ctx.strokeStyle=rgba(PSC,0.95);ctx.lineWidth=2.6/z;ctx.beginPath();ctx.arc(ix,iy,22/z,0,TAU);ctx.stroke();});
      psaName(ctx,"Ise",ix+30/z,iy+12/z,{a:hA*(1-fin(t,w("tale","prints")-0.6,0.4)),size:34/z});}
    if(!late){
      // from Edo: the Tōkaidō most of the way, then the road south, lit along and walked by one pilgrim's light
      const eA=fin(t,tFa-0.2,0.6);if(eA>0.01){psaPath(ctx,R.east,clamp((t-tFa)/2.6,0,1),{lw:5.2/z+1,glow:16,col:[255,226,170],a:0.95*eA});p7_runner(ctx,R.east,clamp((t-tFa-0.6)/5.2,0,1),[255,236,200],{r:6/z,trail:0.05,hold:true});}}
    else{
      // the guidebook's road: every station from Edo lit, and the road south; then pilgrims from east and west, more of them; the river
      // and its ferry; the count
      const fA=fin(t,tCh+0.2,0.8)*(1-0.4*fin(t,tTa-0.4,0.6)),nn=t>tMa-0.2?14:6;
      p7_flow(ctx,R.east,t,tCh+0.2,nn,9.0,4.6/z,fA,PSC);p7_flow(ctx,R.west,t,tCh+0.6,Math.round(nn*0.7),5.5,4.6/z,fA,PSC);
      const rA=fin(t,tFe-0.4,0.8);if(rA>0.01){psaPath(ctx,P7_MIYA.map(J),1,{col:[120,170,230],lw:3.6/z,glow:8,a:0.8*rA});const[fx,fy]=J(P7_FERRY);
        withA(ctx,rA,()=>{glow(ctx,fx,fy,40/z,PSC,0.6);ctx.fillStyle=rgba([255,236,200],1);ctx.beginPath();ctx.arc(fx,fy,6/z,0,TAU);ctx.fill();});
        psaName(ctx,"the Miyagawa",J([136.64,34.43])[0],J([136.64,34.43])[1],{a:rA*(1-fin(t,tTa-0.8,0.5)),size:30/z,align:"right",color:rgba([170,200,240],1)});
        psaName(ctx,"the ferry",fx-26/z,fy-24/z,{a:fin(t,w("ferry","counted")-0.3,0.5)*(1-fin(t,tTa-0.8,0.5)),size:30/z,align:"right"});}}
    ctx.restore();
    if(!late){eaYear(ctx,80,80,"Japan · the 1700s",CLAY,fin(t,0.5,0.8));
      p7_tags(ctx,t,960,160,[[w("year","Ordinary")-0.2,w("year","pilgrimage")-0.3,"ordinary people may not travel as they please",AMBER],[w("year","pilgrimage")-0.2,tOn-0.3,"but a pilgrimage is hard to refuse",PSC],
        [tOn-0.1,tFa-0.3,"once in a lifetime, to Ise",PSC],[tFa-0.1,tFm-0.9,"from Edo: the Tōkaidō, then the road south",PSC]]);
      p7_under(ctx,t,960,226,[[w("once","great shrine")-0.2,tFa-0.3,"to the great shrine",PSC]]);}
    else{eaYear(ctx,80,80,"the road to Ise",CLAY,fin(t,tBk-0.6,0.6)*(1-fin(t,tTa-0.4,0.5)));
      // the guidebook, at the left of the map, its lines typed as each is said; it leaves as the pilgrims set out
      const gA=fin(t,tBk-0.4,0.6)*(1-fin(t,tCh-0.6,0.6));if(gA>0.01){const L=P7_GUIDE,at=[tBk,w("book","every station"),w("book","how far apart"),w("book","the inns"),w("book","the sights")],i=at.filter(x=>t>=x-0.15).length,tot=L.join(" ").length,n0=L.slice(0,Math.max(1,i)).join(" ").length;
        arrive(ctx,380,370,t,tBk-0.4,()=>psaPaper(ctx,90,190,580,400,L,{kicker:true,size:32,p:i>=L.length?1:Math.min(1,n0/tot+0.0001),rot:-0.012,a:gA}),{dy:-12});}
      p7_tags(ctx,t,960,160,[[tBk-0.2,tCh-0.4,"a guidebook lists every station on the way",PSC],[tCh-0.2,tMa-0.4,"nobody is made to go",PSC],[tMa-0.2,tFe-0.4,"so ordinary people go",PS_OK],[tFe-0.2,tTa-0.4,"1771: counted at the ferry",PS_OK],[tTa-0.2,tO1-0.9,"later: a craze like none before",PSC]]);
      const chA=fin(t,tCh,0.5)*(1-fin(t,tMa-0.4,0.4));if(chA>0.01)withA(ctx,chA,()=>p7_row(ctx,960,226,[["the way laid out",PSC,fin(t,w("choose","laid out")-0.2,0.5)],["paid for together",PSC,fin(t,w("choose","paid for together")-0.2,0.5)],["someone expecting them",PS_OK,fin(t,w("choose","someone")-0.2,0.5)]],18));
      p7_under(ctx,t,960,226,[[w("many","hundreds of thousands")-0.2,tFe-0.4,"hundreds of thousands, in an ordinary year",PS_OK]]);
      // the count at the ferry, typed as it grows
      const kA=fin(t,w("ferry","two million")-0.4,0.6)*(1-fin(t,tTa-0.5,0.5));if(kA>0.01)arrive(ctx,1530,470,t,w("ferry","two million")-0.4,()=>{glass(ctx,1240,360,580,220,18,PS_OK,{glow:12,ea:0.8,fill:"rgba(6,12,10,0.95)"});
        T(ctx,"CROSSED BY FERRY, 1771",1266,404,{f:"mono",w:500,size:28,color:rgba(PS_OK,1)});T(ctx,p7_num(2077450*easeCam(clamp((t-w("ferry","two million")+0.2)/2.4,0,1))),1266,486,{w:800,size:64,color:rgba(INK,0.98)});
        T(ctx,"in a few months",1266,546,{w:700,size:28,color:rgba(SOFT,1)});},{dy:-10});
      // the sheets that followed: a comic tale of two travellers, and prints of the road's stations
      const sA=fin(t,tTa-0.2,0.6);if(sA>0.01){arrive(ctx,330,420,t,w("tale","comic tale")-0.3,()=>p7_sheet(ctx,140,270,380,300,"tale",1,t,-0.03),{dy:-12});
        arrive(ctx,770,440,t,w("tale","prints")-0.3,()=>p7_sheet(ctx,580,290,380,300,"print",1,t,0.025),{dy:-12});
        withA(ctx,fin(t,w("tale","comic tale")-0.1,0.5),()=>p7_chip(ctx,330,640,"a comic tale of two travellers",{align:"center",col:PSC}));
        withA(ctx,fin(t,w("tale","prints")-0.1,0.5),()=>p7_chip(ctx,770,716,"prints of the road's stations",{align:"center",col:PSC}));}}}],
  /* a village at dusk: a farmer who doesn't know the road, the cost laid out in coins; then the group: every household pays in, lots
     are drawn, two set off; and an oshi comes with charms and calendars */
  [vA,ctx=>{psaDusk(ctx,S,{d:1,y0:P7_Y0});ctx.save();drift(ctx,t-tFm+1.0,{dur:40},{z:0.02,y:640,x:900});
    [[1690,1.0,3],[1880,0.9,5]].forEach(([x,s,k])=>psaPine(ctx,x,P7_Y0+2,s,k,{rim:PSC}));
    // the road ahead, unknown: dark further on
    {const g=ctx.createLinearGradient(1000,0,1920,0);g.addColorStop(0,"rgba(8,8,14,0)");g.addColorStop(1,"rgba(8,8,14,0.55)");ctx.fillStyle=g;ctx.fillRect(1000,P7_Y0-260,920,330);}
    // the village: houses behind, and in front
    [[220,0.62],[420,0.6],[600,0.58]].forEach(([x,s])=>p7_house(ctx,x,P7_Y0-14,s,{lit:0.5}));
    const HX=[120,290,460,630],gv=fin(t,w("oshi","charms")-0.4,0.1);
    HX.forEach((x,i)=>p7_house(ctx,x,P7_Y0+4,0.92,{lit:1,charm:fin(t,w("oshi","charms")-0.2+(3-i)*0.3,0.5)}));
    // the coins the journey needs, laid out above the road: one household's two, then every household's
    const cY=330,CX=i=>930+i*76,cA=fin(t,w("cost","costs")-0.3,0.6)*(1-fin(t,tOs-0.6,0.6));
    if(cA>0.01)withA(ctx,cA,()=>{for(let i=0;i<12;i++){const own=i<2,tf=w("group","pays in")+(i-2)*0.22,f=own?fin(t,w("cost","more than")-0.1+i*0.25,0.4):clamp((t-tf)/0.7,0,1);
      p7_coin(ctx,CX(i),cY,17,{dash:true,col:own?PSC:PS_RED,a:1-(f>=1?1:0)});
      if(own){if(f>0.01)p7_coin(ctx,CX(i),cY,17,{a:f});}
      else if(f>0){const[hx,hy]=[HX[(i-2)%4],P7_Y0-80],e=easeCam(f),x=lerp(hx,CX(i),e),y=lerp(hy,cY,e)-Math.sin(e*Math.PI)*120;p7_coin(ctx,x,y,17,{hi:1-f});}}});
    // the lots, and the two they choose
    p7_lots(ctx,745,730,clamp((t-w("group","chosen by lot")+0.1)/0.8,0,1),fin(t,w("group","chosen by lot")-0.5,0.4)*(1-fin(t,tOs+1.0,0.6)));
    // the farmer: standing at the village's edge, looking down the road; then he and a neighbour set off, chosen by lot
    {const tGo=w("group","go for everyone")-0.2,v=psaPace("walker",1.0,0.55),[d,amp]=p7_go(t,tGo,tGo+60,v);psaWalker(ctx,840+d,P7_G+10,1.0,t,{kind:"pilgrim",dir:1,ph:0.2,amp,still:amp<=0.001,rate:0.55});
      const[d2,amp2]=p7_go(t,tGo-0.6,tGo+60,v);if(t>tGo-0.7)psaWalker(ctx,672+d2,P7_G+4,0.96,t,{kind:"pilgrim",dir:1,ph:0.65,amp:amp2,still:amp2<=0.001,rate:0.55,a:fin(t,tGo-0.7,0.4)});}
    // an oshi, in from Ise with his box of charms and calendars
    {const tIn=tOs-0.8;if(t>tIn){const v=psaPace("walker",1.06,0.55);p7_oshi(ctx,2010-(t-tIn)*v,P7_G+40,1.06,t,{dir:-1,ph:0.4});}}
    ctx.restore();
    // what the farmer doesn't know, each with its question
    const qA=1-fin(t,tNe-0.4,0.5);[[1010,470,"where to sleep?","where to sleep"],[1380,400,"how far to the next station?","how far"],[1720,470,"what will it all cost?","what it all costs"]].forEach(([x,y,s_,word])=>{const a=fin(t,w("farmer",word)-0.2,0.5)*qA;p7_q(ctx,x,y-40,a);withA(ctx,a,()=>p7_chip(ctx,x,y+20,s_,{align:"center",col:PS_RED}));});
    eaYear(ctx,80,80,"in a village",CLAY,fin(t,tFm-0.6,0.6));
    p7_tags(ctx,t,960,120,[[tFm-0.2,tCo-0.4,"a farmer who has never left his village",AMBER],[tCo-0.2,tNe-0.4,"the journey costs more than one household can spare",PS_RED],[tNe-0.2,tGr-0.4,"a way they can follow, without knowing the road",PS_OK],
      [tGr-0.2,tOs-0.4,"a pilgrimage group: every household pays in",PSC],[tOs-0.2,tLo-0.9,"priests from Ise, the oshi, every year",PSC]]);
    p7_under(ctx,t,960,186,[[w("need","pay")-0.2,tGr-0.4,"and a way to pay for it",PS_OK],[w("group","chosen by lot")-0.2,tOs-0.4,"two or three, chosen by lot, go for everyone",PSC],[w("oshi","charms")-0.2,tLo-0.9,"bringing charms and calendars",PSC]]);}],
  /* Ise: the oshi's house at dusk, where the pilgrims lodge, and the grove of the shrines beyond it, where he guides them */
  [iA,ctx=>{psaDusk(ctx,S,{d:1,y0:P7_Y0});ctx.save();drift(ctx,t-tLo+1.0,{dur:24},{z:0.02,y:640,x:1100});
    [[90,0.95,1],[330,1.1,2]].forEach(([x,s,k])=>psaPine(ctx,x,P7_Y0+2,s,k,{rim:PSC}));
    p7_grove(ctx,1640,P7_Y0+4,1.0,1,1);psaStation(ctx,1010,P7_Y0+2,0.92,{lit:1});
    // the two pilgrims arrive; the oshi waits by his door, then leads them on to the shrines
    const v=psaPace("walker",0.96,0.55),tG=w("lodge","guide")-0.3,[d,amp]=p7_go(t,tLo-1.2,tLo+3.4,v),[dg,ampg]=p7_go(t,tG+0.5,tG+40,v);
    [[0,0.2],[-110,0.65]].forEach(([dx,ph])=>psaWalker(ctx,560+dx+d+dg,P7_G+10,0.96,t,{kind:"pilgrim",dir:1,ph,amp:Math.max(amp,ampg),still:Math.max(amp,ampg)<=0.001,rate:0.55}));
    {const vo=psaPace("walker",1.0,0.55),[d3,a3]=p7_go(t,tG,tG+40,vo);p7_oshi(ctx,780+d3,P7_G+22,1.0,t,{dir:t>tG?1:-1,ph:0.4,amp:a3});}
    ctx.restore();eaYear(ctx,80,80,"at Ise",CLAY,fin(t,tLo-0.6,0.6));
    p7_tags(ctx,t,960,120,[[tLo-0.2,tBk-0.9,"at Ise: lodged in the oshi's own house",PSC]]);
    p7_under(ctx,t,960,186,[[w("lodge","guide")-0.2,tBk-0.9,"and guided to the shrines",PS_OK]]);}],
  /* the utility: six weeks for a first data product, and two teams that gave up; then Ravi, and the road teams choose */
  [uA,ctx=>{p7_room(ctx,S,t);ctx.save();drift(ctx,t-tO1+0.8,{dur:24},{z:0.016,y:500,x:1100});
    p7_slab(ctx,1);
    const tRd=w("ravi","road teams choose"),lv=fin(t,tRd-0.6,0.7),t2=w("one","two teams");
    // six weeks: a first data product, still dashed, and a week's box filling red for each week it waits; two teams that gave up, and
    // what they built instead, off the platform
    withA(ctx,1-lv,()=>{p7_dashEl(ctx,P7_SLOT[2],P7_BY,P7_BW,P7_BH,"a first data product",APPC,fin(t,tO1+0.1,0.6));
      p7_weeks(ctx,1250,300,fin(t,tO1+0.2,0.5),[0,1,2,3,4,5].map(i=>fin(t,w("one","six weeks")-0.4+i*0.18,0.4)));
      p7_gave(ctx,t,{a:[fin(t,t2-0.2,0.5),fin(t,t2+0.2,0.5)],xp:[clamp((t-t2)/0.5,0,1),clamp((t-t2-0.4)/0.5,0,1)]});});
    // the road teams choose: a path along the platform, lit end to end, the teams' lights going along it, and a data product set down
    const pA=fin(t,tRd-0.3,0.7);if(pA>0.01){p7_road(ctx,t,pA,{p:clamp((t-tRd+0.1)/1.6,0,1),names:false});p7_flow(ctx,[[P7_R0,P7_RY],[P7_R1,P7_RY]],t,tRd+0.8,5,6.0,8,pA,APPC);
      p7_prod(ctx,t,2,"a data product",{a:pA,drop:clamp((t-w("ravi","easiest")+0.2)/0.9,0,1)});}
    psaWhole(ctx,fin(t,tRa-0.6,0.7),[0,380,460,1080],cx=>person(cx,"ravi",P7_ME[0],1030,P7_ME[1],{t}));psaWho(ctx,P7_ME[0]-10,P7_WHO,"Ravi Menon","platform lead",TECH,fin(t,w("ravi","Ravi Menon")-0.2,0.6));
    ctx.restore();
    p7_tags(ctx,t,1180,120,[[tO1+0.2,t2-0.3,"six weeks for a first data product",PS_RED],[t2-0.1,tRa-0.4,"two teams gave up, and built their own",PS_RED],[tRa-0.2,9999,"a road teams choose",PSC]]);
    p7_under(ctx,t,1180,186,[[w("ravi","easiest")-0.2,9999,"the easiest way to do it right",PS_OK]]);}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"A road people choose","the easiest way, and the right one","Film 7 of 8 · platform and solution architecture");});
const P7_ISE_PT=[136.705,34.49];

/* ---------- the utility's chapters: the platform, the path laid on it, and what teams build on it ---------- */
// the platform's slab, at the foot of the room, where it stays from chapter to chapter; its name on its front face, so the whole of
// its top is free for the data products set down on it
const P7_PX=600,P7_PY=770,P7_PW=1240;
function p7_slab(ctx,a,hi){if(a<=0.01)return;psaPlatform(ctx,P7_PX,P7_PY,P7_PW,44,{fh:38,sk:22,a,hi:hi||0});
  withA(ctx,a,()=>T(ctx,"the data platform",P7_PX+30,P7_PY+44+29,{w:800,size:28,color:rgba(mix(TECC,INK,0.45),1)}));}
// a data product set down on the platform, in one of three places along it: field services' at the left, metering's in the middle,
// network's at the right; o as psaBlock's (drop brings it down, owner its owner's gold tag)
const P7_SLOT=[640,1040,1440],P7_BW=380,P7_BH=130,P7_BY=666;
function p7_prod(ctx,t,i,name,o){psaBlock(ctx,P7_SLOT[i],P7_BY,P7_BW,P7_BH,name,Object.assign({t,size:28},o||{}));}
// the path already laid on the platform: a lit road from the form to a data product, live, each of its stations a step. o.p draws it
// from the left; o.names (default true) names the stations; o.ring [[station, amount, colour], ...] rings a station
const P7_RY=560,P7_R0=600,P7_R1=1720,P7_RX=[640,900,1160,1420,1680],P7_RN=["the form","a repository","the logic","a review","live"];
function p7_road(ctx,t,a,o){o=o||{};if(a<=0.01)return;const p=o.p==null?1:o.p;withA(ctx,a,()=>{
  p7_route(ctx,[[P7_R0,P7_RY],[P7_R1,P7_RY]],PSC,1,p,{lw:6,glow:18+12*(o.hi||0),head:false});
  P7_RX.forEach((x,i)=>{const q=clamp((P7_R0+p*(P7_R1-P7_R0)-x)/40+1,0,1);if(q<=0.01)return;withA(ctx,q,()=>{psaStop(ctx,x,P7_RY,{lit:0.8,r:10});
    (o.ring||[]).forEach(([k,v,col])=>{if(k===i&&v>0.01){glow(ctx,x,P7_RY,60,col,0.4*v);withA(ctx,v,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,P7_RY,20,0,TAU);ctx.stroke();ctx.restore();});}});
    if(o.names!==false)T(ctx,P7_RN[i],x,P7_RY+48,{w:700,size:28,align:"center",color:rgba(mix(PSC,INK,0.3),0.95)});});});});}
// where a team's light is on the road: at each station from its time on, sliding to the next over d seconds; [[time, station], ...]
// (station -1 is the road's start)
function p7_at(t,K,d){d=d||0.8;const X=k=>k<0?P7_R0:P7_RX[k];let x=X(K[0][1]);for(let i=1;i<K.length;i++){const u=easeCam(clamp((t-K[i][0])/d,0,1));if(u<=0)break;x=lerp(x,X(K[i][1]),u);}return x;}
// a team's light, standing on the road at x
function p7_light(ctx,x,a,col){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,P7_RY,52,col||APPC,0.6);ctx.fillStyle=rgba(mix(col||APPC,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,P7_RY,9,0,TAU);ctx.fill();});}
// guardrails along the road, above it and below its stations' names: a rail on round posts, seen from above, drawn from the left as
// p goes 0 to 1
const P7_RAIL=[P7_RY-46,P7_RY+76];
function p7_rails(ctx,a,p,hi){if(a<=0.01||p<=0)return;withA(ctx,a,()=>{P7_RAIL.forEach(y=>{const x1=P7_R0+(P7_R1-P7_R0)*clamp(p,0,1);ctx.save();ctx.strokeStyle=rgba(PSC,0.55+0.4*(hi||0));ctx.lineWidth=3;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(P7_R0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.fillStyle=rgba(mix(PSC,INK,0.25),0.8+0.2*(hi||0));
  for(let x=P7_R0+28;x<=x1;x+=80){ctx.beginPath();ctx.arc(x,y,5.5,0,TAU);ctx.fill();}ctx.restore();});});}
// the two teams that gave up, and what each runs off the platform: field services, a database on its own server; metering, its
// spreadsheets. o.a their alphas, o.xp (0..1) draws each one's cross, o.own (0..1) shows what it built; o.off switches the server
// off, o.retire strikes the spreadsheets out; o.hi lights a team
const P7_GV=[["field services","its own server","node",TECC],["metering","spreadsheets","artifact",WASHI]],P7_GY=[290,440],P7_GX=870;
function p7_gave(ctx,t,o){o=o||{};P7_GV.forEach(([tm,own,kind,col],i)=>{const a=o.a?o.a[i]:1;if(a<=0.01)return;const y=P7_GY[i],ch=o.chip?o.chip[i]:1;
  if(ch>0.01)p7_chip(ctx,560,y,tm,{col:APPC,a:a*ch,hi:o.hi?o.hi[i]:0});
  const xp=o.xp?o.xp[i]:1;if(xp>0.01)withA(ctx,a*(o.xa?o.xa[i]:1),()=>p7_mark(ctx,"no",560+p7_chipW(ctx,tm)+30,y,26,xp));
  const oa=a*(o.own?o.own[i]:1);if(oa<=0.01)return;const off=i===0?(o.off||0):0,ret=i===1?(o.retire||0):0;
  withA(ctx,oa*(1-0.6*off)*(1-0.55*clamp(ret*1.4-0.4,0,1)),()=>psaEl(ctx,P7_GX,y-48,300,96,own,col,kind,{size:28}));
  if(ret>0.01)withA(ctx,oa,()=>{ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P7_GX+10,y);ctx.lineTo(P7_GX+10+280*clamp(ret*1.6,0,1),y);ctx.stroke();ctx.restore();});});}
// six weeks, a box for each, filling red as each week passes (f[i], 0..1), its number in it
function p7_weeks(ctx,x,y,a,f){if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<6;i++){const X=x+i*64,q=f[i];ctx.save();
  if(q>0.01){glow(ctx,X+26,y+26,46,PS_RED,0.25*q);ctx.fillStyle=rgba(PS_RED,0.42*q);rr(ctx,X,y,52,52,8);ctx.fill();}ctx.strokeStyle=rgba(PS_RED,0.6+0.4*q);ctx.lineWidth=2;rr(ctx,X,y,52,52,8);ctx.stroke();ctx.restore();
  T(ctx,String(i+1),X+26,y+37,{w:800,size:28,align:"center",color:rgba(mix(SOFT,INK,q),0.95)});}});}
// a ticket in the queue: a slip, red while it waits, green once done
function p7_slip(ctx,x,y,a,ok){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();const col=mix(PS_RED,PS_OK,ok||0);ctx.fillStyle="rgba(14,10,16,0.95)";rr(ctx,x-22,y-15,44,30,4);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.2;rr(ctx,x-22,y-15,44,30,4);ctx.stroke();
  ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-13,y-5);ctx.lineTo(x+13,y-5);ctx.moveTo(x-13,y+5);ctx.lineTo(x+6,y+5);ctx.stroke();ctx.restore();});}
// how much of a card's lines are typed by t, each line typed from its own time over d seconds (as psaCard's o.p wants it)
function p7_typed(t,L,at,d){d=d||0.6;const tot=L.join(" ").length;let n=0;L.forEach((l,i)=>{n+=(l.length+(i<L.length-1?1:0))*clamp((t-at[i])/d,0,1);});return clamp(n/tot,0,1);}
// the one form a team fills in: a new data product's name, its owner and what it holds. o.fp[i] (0..1) shows each field; o.v the
// values written in (metering's, in March), each typed as o.vp[i] goes 0 to 1
const P7_FF=["name","owner","what it holds"],P7_FW=620,P7_FH=246;
function p7_form(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,P7_FW,P7_FH,16,PSC,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(16,12,8,0.95)"});
  T(ctx,"NEW DATA PRODUCT",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(PSC,1)});
  P7_FF.forEach((f,i)=>{const q=o.fp?o.fp[i]:1;if(q<=0.01)return;const yy=y+102+i*52;withA(ctx,q,()=>{T(ctx,f,x+24,yy,{w:700,size:28,color:rgba(SOFT,1)});
    ctx.save();ctx.strokeStyle=rgba(PSC,0.45);ctx.lineWidth=1.6;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(x+232,yy+10);ctx.lineTo(x+P7_FW-24,yy+10);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    if(o.v){const s_=o.v[i],n=Math.round(s_.length*clamp(o.vp?o.vp[i]:1,0,1));if(n>0)T(ctx,s_.slice(0,n),x+236,yy,{w:700,size:28,color:rgba(INK,0.96)});}});});});}
// the repository the template makes in minutes: what every data product needs, each row ticked as it's named (o.tk[i], 0..1); and
// the logic, the team's own, the last row, as o.own goes 0 to 1
const P7_REPO=["a pipeline that runs","its tests","a contract for its readers","its entry in the catalogue","rights by role","its log"],P7_KW=590;
function p7_repo(ctx,t,x,y,a,o){o=o||{};if(a<=0.01)return;const own=o.own||0,h=86+(5+own)*33+24;withA(ctx,a,()=>{glass(ctx,x,y,P7_KW,h,16,TECC,{glow:12,ea:0.85,fill:"rgba(6,14,12,0.95)"});
  T(ctx,"REPOSITORY · IN MINUTES",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(TECC,1)});
  P7_REPO.forEach((s_,i)=>{const yy=y+86+i*33,q=o.tk?o.tk[i]:1;T(ctx,s_,x+66,yy,{w:700,size:28,color:rgba(INK,0.55+0.4*clamp(q*3,0,1))});
    if(q>0.01)p7_mark(ctx,"ok",x+38,yy-9,22,q);else{ctx.save();ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+38,yy-9,7,0,TAU);ctx.stroke();ctx.restore();}});
  if(own>0.01)withA(ctx,own,()=>{const yy=y+86+6*33;psaCog(ctx,x+38,yy-9,10,APPC,t);T(ctx,"the logic: the team's own",x+66,yy,{w:700,size:28,color:rgba(mix(APPC,INK,0.4),1)});});});}

/* ---------- 2. Six weeks ---------- */
// A year ago, network's first data product, planned outages for the call centre: eleven tickets, each waiting its turn in the platform
// team's queue, then a pipeline written from nothing and a first pull request sent back for the catalogue's rules; six weeks, a box for
// each. Two other teams gave up. Nobody did anything wrong; and an order would make teams use the platform, not want it.
const P7_TK=["a workspace","storage","an account for its job","each right it needed"],P7_PL=["read the outages","check them","write them out"];
scene("weeks",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tLa=c("last"),tTi=c("tickets"),tQu=c("queue"),tSc=c("scratch"),tSi=c("six"),tGa=c("gave"),tWr=c("wrong"),tOr=c("order");
  ctx.save();drift(ctx,t,sc,{z:0.01,y:480});p7_slab(ctx,fin(t,0.2,0.8));p7_me(ctx,t,sc,fin(t,0.2,0.8));
  // network's first data product, not there yet, where it will stand on the platform; set down once the six weeks are over
  const tUp=w("six","call centre")-0.2,dp=clamp((t-tUp)/0.9,0,1);
  p7_dashEl(ctx,P7_SLOT[2],P7_BY,P7_BW,P7_BH,"planned outages",APPC,fin(t,w("last","planned outages")-0.3,0.6)*(1-clamp(dp*2.5,0,1)));
  if(dp>0)p7_prod(ctx,t,2,"planned outages",{drop:dp,owner:"network",ownerA:fin(t,tUp+0.7,0.5)});
  // network's part of the room leaves as the two teams that gave up come in
  const nA=1-fin(t,tGa-0.6,0.6);if(nA>0.01)withA(ctx,nA,()=>{
    p7_chip(ctx,560,300,"network",{col:APPC,a:fin(t,w("last","network's")-0.2,0.5)});
    // the eleven tickets, each kind typed as it's named; the card goes once its slips are in the queue
    const kA=fin(t,tTi-0.2,0.5)*(1-fin(t,tSc-0.7,0.5));
    if(kA>0.01)arrive(ctx,800,470,t,tTi-0.2,()=>psaCard(ctx,560,360,480,"ELEVEN TICKETS",P7_TK,PS_RED,{a:kA,size:30,p:p7_typed(t,P7_TK,[w("tickets","a workspace"),w("tickets","storage"),w("tickets","an account"),w("tickets","each right")])}),{dy:-10});
    // the queue: each slip flies from the card to its place, waits its turn, and is done one at a time, at the head of the queue
    const q0=tQu+1.4,q1=tSi+0.5,dt=(q1-q0)/11;let D=0;for(let i=0;i<11;i++)D+=easeCam(clamp((t-q0-i*dt)/0.45,0,1));
    for(let k=0;k<11;k++){const sp=w("queue","Each one")-0.2+k*0.12;if(t<sp)continue;const f=easeCam(clamp((t-sp)/0.6,0,1)),pos=k-D;
      let x,y=440,a=1,ok=0;if(pos>=0)x=1750-pos*58;else{const e=clamp(-pos,0,1);x=1750+e*30;y=440-e*36;a=1-e;ok=1;}
      if(f<1){x=lerp(1046,x,f);y=lerp(480,y,f)-Math.sin(f*Math.PI)*50;}p7_slip(ctx,x,y,a*fin(t,sp,0.2),ok);}
    // six weeks, a box for each, filling as the tickets wait their turn
    const wk0=tQu-0.2,wk1=tSi+0.3;p7_weeks(ctx,1250,300,fin(t,tQu-0.6,0.5),[0,1,2,3,4,5].map(i=>fin(t,wk0+(wk1-wk0)*i/6,0.5)));
    // the pipeline, written from nothing, where the tickets' card was; and its first pull request, sent back
    const lA=fin(t,w("scratch","pipeline")-0.3,0.5);if(lA>0.01)arrive(ctx,800,450,t,w("scratch","pipeline")-0.3,()=>psaCard(ctx,560,360,480,"PIPELINE · FROM NOTHING",P7_PL,APPC,{a:lA,size:30,p:p7_typed(t,P7_PL,[w("scratch","pipeline"),w("scratch","from nothing")-0.4,w("scratch","from nothing")+0.2])}),{dy:-10});
    const tPr=w("scratch","first pull request")-0.3,rA=fin(t,tPr,0.5);if(rA>0.01){arrive(ctx,1320,560,t,tPr,()=>psaCard(ctx,1080,480,480,"PULL REQUEST · THE FIRST",["planned outages"],APPC,{a:rA,size:30,foot:"sent back: the catalogue's rules",footA:fin(t,w("scratch","came back")-0.2,0.5),footCol:PS_RED}),{dy:-10});
      p7_route(ctx,[[1572,520],[1620,520],[1620,612],[1574,612]],PS_RED,fin(t,w("scratch","came back")-0.2,0.4),clamp((t-w("scratch","came back")+0.1)/0.6,0,1),{lw:3,head:11});}});
  // two other teams gave up: field services, a database on its own server; metering, spreadsheets
  const gA=fin(t,tGa-0.1,0.5),tF=w("gave","Field services"),tM=w("gave","metering works");
  p7_gave(ctx,t,{a:[gA,fin(t,tGa+0.3,0.5)],xp:[clamp((t-w("gave","gave up"))/0.5,0,1),clamp((t-w("gave","gave up")-0.3)/0.5,0,1)],own:[fin(t,tF+0.4,0.6),fin(t,tM+0.3,0.6)],hi:[pulseAt(t,tF,1.4),pulseAt(t,tM,1.4)]});
  // nobody did anything wrong: the platform was the safe way, but not yet the easy one
  const yA=fin(t,w("wrong","safe way")-0.3,0.5)*(1-fin(t,tOr-0.5,0.5));if(yA>0.01)withA(ctx,yA,()=>p7_row(ctx,1000,640,[["the safe way",PS_OK,1,{mark:"ok",mp:clamp((t-w("wrong","safe way"))/0.5,0,1)}],["not yet the easy one",PS_RED,fin(t,w("wrong","not yet")-0.3,0.5),{mark:"no",mp:clamp((t-w("wrong","not yet"))/0.5,0,1)}]],20));
  // an order: it makes teams use the platform, not want it; and the quick way finds a way around it
  const oA=fin(t,w("order","order every team")-0.3,0.6);if(oA>0.01)arrive(ctx,1500,330,t,w("order","order every team")-0.3,()=>psaPaper(ctx,1220,236,560,160,["AN ORDER","every team onto the platform"],{kicker:true,size:32,rot:-0.012,a:oA}),{dy:-12});
  withA(ctx,fin(t,w("order","use it")-0.3,0.5),()=>p7_row(ctx,1500,470,[["teams use it",SOFT,1],["not want it",PS_RED,fin(t,w("order","not want")-0.3,0.5)]],20));
  const tQw=w("order","quick way");p7_route(ctx,[[1176,520],[1250,600],[1700,600],[1840,560],[1860,300]],PS_RED,fin(t,tQw-0.2,0.4),clamp((t-tQw)/1.6,0,1),{lw:3.4,dash:[12,9],head:13});
  ctx.restore();
  eaYear(ctx,80,80,"a year ago",CLAY,fin(t,0.5,0.6)*(1-fin(t,tGa-0.6,0.5)));
  p7_tags(ctx,t,1180,120,[[0.5,tTi-0.4,"network's first data product",APPC],[tTi-0.2,tQu-0.4,"eleven tickets",PS_RED],[tQu-0.2,tSc-0.4,"each one waited its turn",PS_RED],[tSc-0.2,tSi-0.4,"a pipeline from nothing",APPC],
    [tSi-0.2,tGa-0.4,"six weeks, for one planned outage",PS_RED],[tGa-0.2,tWr-0.4,"two other teams gave up",PS_RED],[tWr-0.2,tOr-0.4,"nobody did anything wrong",AMBER],[tOr-0.2,tQw-0.4,"an order makes teams use it, not want it",AMBER],[tQw-0.2,sc.dur+1,"and the quick way finds a way around",PS_RED]]);
  p7_under(ctx,t,1180,186,[[w("last","planned outages")-0.2,tTi-0.4,"planned outages, for the call centre",APPC],[w("queue","platform team's")-0.2,tSc-0.4,"in the platform team's queue",SOFT],[w("scratch","catalogue's rules")-0.2,tSi-0.4,"the catalogue's rules, learned when it came back",PS_RED]]);
  vign(ctx,S);});

/* ---------- 3. Teams, as customers ---------- */
// The platform as a product, and the teams that build on it as its customers: the two teams that gave up take their places among the
// others; the platform team goes to each, and three things come up again and again; as the oshi went to the villages; and the series
// that shows how to write down who a service is for.
const P7_TEAMS=[["network",0],["metering",0],["field services",0],["retail",1],["generation",1],["finance",1]],P7_TY=[566,640];
function p7_teamAt(ctx,i){const r=P7_TEAMS[i][1],row=P7_TEAMS.map((x,j)=>[x,j]).filter(([x])=>x[1]===r),ws=row.map(([x])=>p7_chipW(ctx,x[0])),tot=ws.reduce((s_,v)=>s_+v,0)+20*(row.length-1);
  let xx=1020-tot/2;for(let k=0;k<row.length;k++){if(row[k][1]===i)return[xx,P7_TY[r],ws[k]];xx+=ws[k]+20;}return[0,0,0];}
const P7_IN=["waiting on tickets","not knowing where to start","learning the rules by being refused"],P7_INN=[6,4,5];
scene("users",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tPr=c("product"),tSi=c("sits"),tTh=c("three"),tSt=c("story"),tMo=c("more");ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p7_slab(ctx,1,pulseAt(t,w("product","as a product"),1.6)*0.8);p7_me(ctx,t,sc,1);p7_prod(ctx,t,2,"planned outages",{owner:"network"});
  // the two teams that gave up, as the last chapter left them: what they built goes, and each team slides to its place among the others
  p7_gave(ctx,t,{a:[1,1],chip:[0,0],xa:[1-fin(t,0,0.6),1-fin(t,0,0.6)],own:[1-fin(t,0.1,0.7),1-fin(t,0.1,0.7)]});
  const tIn=w("product","teams"),vis=w("sits","sits with")-0.4,per=1.9;
  P7_TEAMS.forEach(([nm],i)=>{const[x,y]=p7_teamAt(ctx,i);let X=x,Y=y,a;
    if(i===1||i===2){const g=i===2?0:1,u=easeCam(clamp((t-0.7)/1.6,0,1));X=lerp(560,x,u);Y=lerp(P7_GY[g],y,u);a=1;}else a=fin(t,tIn-0.3+i*0.12,0.5);
    const k=Math.floor((t-vis)/per),hi=k>=0&&k<6&&[0,1,2,3,4,5][k]===i?pulseAt(t,vis+k*per+0.6,1.2):0;p7_chip(ctx,X,Y,nm,{col:APPC,a,hi});});
  // the platform team goes to each team in turn: a light from the platform to each, resting there a while
  if(t>vis-0.6&&t<vis+6*per+0.8){const k=clamp(Math.floor((t-vis)/per),-1,5),f=easeCam(clamp(((t-vis)-k*per)/0.6,0,1)),at=i=>{const[x,y,ww]=p7_teamAt(ctx,i);return[x+ww/2,y+(P7_TEAMS[i][1]?36:-36)];},
      A=k<0?[1020,770]:at(k),B=k>=5?[1020,770]:at(k+1),p=k<0?easeCam(clamp((t-vis+0.6)/0.6,0,1)):f,X=lerp(A[0],B[0],k<0?p:f),Y=lerp(A[1],B[1],k<0?p:f)-Math.sin((k<0?p:f)*Math.PI)*40,
      la=fin(t,vis-0.6,0.4)*(1-fin(t,vis+6*per+0.2,0.5));
    withA(ctx,la,()=>{glow(ctx,X,Y,46,TECC,0.6);ctx.fillStyle=rgba(mix(TECC,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(X,Y,8,0,TAU);ctx.fill();});}
  // what each team needs to do, and what gets in its way
  const nA=fin(t,w("sits","needs")-0.3,0.5)*(1-fin(t,tTh-0.5,0.5));if(nA>0.01)withA(ctx,nA,()=>p7_row(ctx,1020,440,[["what it needs to do",PS_OK,1],["what gets in its way",PS_RED,fin(t,w("sits","gets in")-0.3,0.5)]],20));
  // three things, again and again: a dot for each team that said it
  const iA=1-fin(t,tSt-0.6,0.5);if(iA>0.01)withA(ctx,iA,()=>{P7_IN.forEach((s_,r)=>{const t0=w("three",["waiting","not knowing","learning"][r])-0.3,a=fin(t,t0,0.5);if(a<=0.01)return;const y=290+r*72;
    p7_chip(ctx,700,y,s_,{col:PS_RED,a});for(let j=0;j<6;j++){const q=fin(t,t0+0.4+j*0.22,0.25);withA(ctx,a,()=>{ctx.save();if(j<P7_INN[r]&&q>0.01){glow(ctx,1310+j*30,y,18,PS_RED,0.4*q);ctx.fillStyle=rgba(PS_RED,0.35+0.6*q);}else ctx.fillStyle=rgba(SOFT,0.25);ctx.beginPath();ctx.arc(1310+j*30,y,8,0,TAU);ctx.fill();ctx.restore();});}});});
  // as the oshi went to the villages every year, the platform team goes to the teams
  p7_strip(ctx,t,700,1500,380,tSt,fin(t,tSt-0.3,0.6)*(1-fin(t,tMo-0.6,0.5)),"the oshi: to the villages, every year","the platform team: to the teams");
  // the series that shows how to write it down
  const mA=fin(t,tMo-0.3,0.6),ML=["Services with customers:","who each service is for,","and what they need"];
  if(mA>0.01)arrive(ctx,1020,340,t,tMo-0.3,()=>psaCard(ctx,700,250,640,"ANOTHER SERIES",ML,SOFT,{a:mA,size:30,p:p7_typed(t,ML,[tMo,w("more","who each"),w("more","what they need")])}),{dy:-10});
  ctx.restore();
  p7_tags(ctx,t,1180,120,[[0.3,tSi-0.4,"the platform, as a product",PSC],[tSi-0.2,tTh-0.4,"the platform team sits with each team",TECC],[tTh-0.2,tSt-0.4,"three things, again and again",PS_RED],[tSt-0.2,tMo-0.4,"as the oshi did",PSC],[tMo-0.2,sc.dur+1,"another series shows how to write it down",SOFT]]);
  p7_under(ctx,t,1180,186,[[w("product","customers")-0.2,tSi-0.4,"and the teams that build on it, its customers",APPC]]);
  vign(ctx,S);});

/* ---------- 4. A path already laid ---------- */
// The template every new job starts from grows into one for a whole data product, and the road is laid along the platform: a team fills
// in one form, with no tickets; minutes later its repository has all a data product needs, each ticked as it's named; the team writes
// only its own logic, in a pull request the data team reviews; it may leave the path, and that part is then its own to run; so the
// quickest way to a data product is also the right one.
scene("path",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tGr=c("grow"),tFo=c("form"),tGe=c("gets"),tLi=c("list"),tOw=c("own"),tLe=c("leave"),tRi=c("right");ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p7_slab(ctx,1);p7_me(ctx,t,sc,1);p7_prod(ctx,t,2,"planned outages",{owner:"network"});
  // the road, laid from the form to a data product, live
  const tLd=w("grow","path already laid"),tQk=w("right","quickest");
  p7_road(ctx,t,fin(t,tLd-0.4,0.4),{p:clamp((t-tLd+0.1)/1.8,0,1),hi:pulseAt(t,tQk+0.4,1.8),ring:[[4,fin(t,tQk+1.6,0.4),PS_OK]]});
  // the template every new job starts from, growing into one for a whole data product; it goes before the form comes in its place
  const tGw=w("grow","grows"),gq=easeCam(clamp((t-tGw)/0.9,0,1)),eA=fin(t,w("grow","template")-0.3,0.5)*(1-fin(t,tFo-0.9,0.5));
  if(eA>0.01)withA(ctx,eA,()=>{glass(ctx,600,224,lerp(420,560,gq),140,16,PSC,{glow:12+10*pulseAt(t,tGw+0.4,1.4),ea:0.85,fill:"rgba(16,12,8,0.95)"});
    T(ctx,"TEMPLATE",624,268,{f:"mono",w:500,size:28,color:rgba(PSC,1)});
    withA(ctx,1-fin(t,tGw-0.3,0.3),()=>T(ctx,"for every new job",624,328,{w:700,size:30,color:rgba(INK,0.95)}));
    const s2="for a whole data product",n=Math.round(s2.length*clamp((t-tGw)/0.9,0,1));if(n>0)T(ctx,s2.slice(0,n),624,328,{w:700,size:30,color:rgba(INK,0.95)});});
  // the one form: its name, its owner and what it holds; and no tickets
  const fA=fin(t,tFo-0.3,0.5)*(1-fin(t,tRi-0.8,0.5));p7_form(ctx,600,224,fA,{fp:[fin(t,w("form","name")-0.2,0.4),fin(t,w("form","owner")-0.2,0.4),fin(t,w("form","what it holds")-0.2,0.4)]});
  const tNo=w("form","No tickets"),kA=fin(t,tNo-0.3,0.4)*(1-fin(t,tRi-0.8,0.5));if(kA>0.01)withA(ctx,kA,()=>{p7_slip(ctx,628,508,1,0);ctx.save();ctx.strokeStyle=rgba(PS_RED,1);ctx.lineWidth=3.4;ctx.lineCap="round";const q=clamp((t-tNo)/0.4,0,1);ctx.beginPath();ctx.moveTo(604,526);ctx.lineTo(604+48*q,526-36*q);ctx.stroke();ctx.restore();
    p7_chip(ctx,668,508,"no tickets",{col:PS_OK});});
  // a team's light: at the form, then its repository, its logic and the review, and on to a data product, live
  const K=[[0,-1],[w("form","fills in")-0.4,0],[w("gets","Minutes")-0.1,1],[w("own","the logic")-0.3,2],[w("own","reviews")-0.3,3],[tQk-0.2,4]];
  p7_light(ctx,p7_at(t,K,0.8),fin(t,w("form","fills in")-0.6,0.4)*(1-fin(t,tQk+2.4,0.6)),APPC);
  // the repository, in minutes, with all a data product needs; and the logic, the team's own
  const rA=fin(t,w("gets","repository")-0.3,0.5)*(1-fin(t,tRi-0.8,0.5)),LW=[w("list","pipeline"),w("list","tests"),w("list","contract"),w("list","catalogue"),w("list","rights"),w("list","its log")];
  if(rA>0.01)arrive(ctx,1530,360,t,w("gets","repository")-0.3,()=>p7_repo(ctx,t,1236,224,rA,{tk:LW.map(x=>clamp((t-x+0.1)/0.5,0,1)),own:fin(t,w("own","the logic")-0.3,0.6)}),{dy:-10});
  // a team may leave the path where it needs something else: that part is then its own to run
  const tLv=w("leave","leave the path"),bA=fin(t,tLv-0.3,0.4)*(1-fin(t,tRi-0.6,0.5)),BR=[[1290,P7_RY],[1240,640],[1150,700]];
  p7_route(ctx,BR,AMBER,bA,clamp((t-tLv)/1.0,0,1),{lw:4,dash:[10,8],head:12});if(bA>0.01){withA(ctx,bA,()=>p7_runner(ctx,BR,clamp((t-tLv-0.4)/1.4,0,1),AMBER,{r:7,trail:0.2,hold:true}));
    withA(ctx,bA*fin(t,w("leave","its own to run")-0.3,0.5),()=>p7_chip(ctx,1130,700,"that part: its own to run",{align:"right",col:AMBER,dash:true}));}
  // the quickest way is also the right one
  withA(ctx,fin(t,tQk-0.3,0.5),()=>p7_row(ctx,1160,400,[["the quickest way",PS_OK,1,{mark:"ok",mp:clamp((t-tQk)/0.5,0,1)}],["is also the right one",PS_OK,fin(t,w("right","right one")-0.3,0.5),{mark:"ok",mp:clamp((t-w("right","right one"))/0.5,0,1)}]],24));
  ctx.restore();
  p7_tags(ctx,t,1180,120,[[0.3,tFo-0.4,"a path already laid",PSC],[tFo-0.2,tGe-0.4,"one form, and no tickets",PS_OK],[tGe-0.2,tLi-0.4,"minutes later, a repository",TECC],[tLi-0.2,tOw-0.4,"all a data product needs",TECC],[tOw-0.2,tLe-0.4,"the team writes only what's its own",APPC],[tLe-0.2,tRi-0.4,"a team may leave the path",AMBER],[tRi-0.2,sc.dur+1,"the quickest way, and the right one",PS_OK]]);
  p7_under(ctx,t,1180,186,[[w("own","pull request")-0.2,tLe-0.4,"in a pull request the data team reviews",APPC]]);
  vign(ctx,S);});

/* ---------- 5. Rules built in ---------- */
// Guardrails along the road, and three rules, each where the path meets it: personal data classed, the tests on every pull request, an
// owner before it goes live. A team's light passes each, and nothing is sent back; guardrails, not gates: the light touches a rail and
// goes on.
// (each rule's words, its station, the chip's y, x and alignment, and the word that brings it in; a staircase rising to the right, so
// no rule's line to its station runs behind another rule)
const P7_RULES=[["personal data, classed first",1,460,900,"center","Personal data"],["the tests, on every pull request",3,380,1400,"center","tests run"],["an owner, before it goes live",4,300,1800,"right","owner"]];
scene("rules",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tBu=c("built"),tWh=c("which"),tBa=c("back"),tRa=c("rails");ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p7_slab(ctx,1);p7_me(ctx,t,sc,1);p7_prod(ctx,t,2,"planned outages",{owner:"network"});
  // a team's light goes along the road, and each rule's station rings green as it passes
  const tGo=w("back","no first")-0.6,lx=P7_R0+easeCam(clamp((t-tGo)/4.4,0,1))*(P7_R1-P7_R0),out=fin(t,tRa-0.6,0.6);
  p7_road(ctx,t,1,{p:1,ring:P7_RULES.map(([,k])=>[k,clamp((lx-P7_RX[k]+10)/30,0,1)*(1-out),PS_OK])});
  p7_rails(ctx,1,clamp((t-w("built","built into")+0.2)/1.6,0,1),pulseAt(t,w("rails","Guardrails"),1.6));
  // the three rules, each over the station where the path meets it
  P7_RULES.forEach(([s_,k,y,x,al,word])=>{const a=fin(t,w("which",word)-0.3,0.5);if(a<=0.01)return;
    withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.6);ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(P7_RX[k],y+24);ctx.lineTo(P7_RX[k],P7_RY-18);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      p7_chip(ctx,x,y,s_,{align:al,col:PSC,mark:"ok",mp:clamp((lx-P7_RX[k])/40,0,1)});});});
  p7_light(ctx,lx,fin(t,tGo,0.3)*(1-fin(t,tGo+4.6,0.4)),APPC);
  // guardrails, not gates: a light goes along, drifts to a rail, is kept on the road, and goes on without stopping
  const u2=clamp((t-w("rails","keep a team")+0.6)/4.2,0,1);if(u2>0&&u2<1){const x=P7_R0+u2*(P7_R1-P7_R0),b=Math.max(0,Math.sin(clamp((u2-0.18)/0.36,0,1)*Math.PI)),y=P7_RY-34*b;
    if(b>0.85)glow(ctx,x,P7_RAIL[0],40,PSC,0.6*(b-0.85)/0.15);withA(ctx,fin(t,w("rails","keep a team")-0.6,0.3),()=>{glow(ctx,x,y,52,APPC,0.6);ctx.fillStyle=rgba(mix(APPC,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();});}
  withA(ctx,fin(t,w("rails","Guardrails")-0.3,0.5),()=>p7_row(ctx,1000,700,[["guardrails",PSC,1,{mark:"ok",mp:clamp((t-w("rails","Guardrails"))/0.5,0,1)}],["not gates",PS_RED,fin(t,w("rails","not gates")-0.3,0.5),{strike:clamp((t-w("rails","not gates"))/0.5,0,1)}]],24));
  ctx.restore();
  p7_tags(ctx,t,1180,120,[[0.3,tWh-0.4,"the rules, built into the path",PSC],[tWh-0.2,tBa-0.4,"met as a team works, not at the end",PS_OK],[tBa-0.2,tRa-0.4,"no pull request sent back for a rule",PS_OK],[tRa-0.2,sc.dur+1,"they keep a team on the road",PSC]]);
  vign(ctx,S);});

/* ---------- 6. A guide, and someone to ask ---------- */
// The guide: every step from the form to a first data product, how long each takes, and whom to ask; written from the questions teams
// asked, a row for each new one; a question in the platform's channel, answered the same day; as the guidebooks listed every station.
const P7_GD=[["the form","ten minutes"],["a repository","minutes later"],["the logic","a day or so"],["a review","within a day"],["live","the same day"]],P7_HOW=["how to mark estimates","where the tests go","how to add a reader"];
// a speech bubble in the platform's channel, its tail at its foot; o.align "right", o.mark a tick drawn as o.mp goes 0 to 1
function p7_bubble(ctx,x,y,s_,col,a,o){o=o||{};if(a<=0.01)return;const sz=28,w=tw(ctx,s_,sz,700)+44+(o.mark?38:0),h=sz+26,X=o.align==="right"?x-w:x;withA(ctx,a,()=>{
  ctx.save();const tx=o.align==="right"?X+w-34:X+34,d=o.align==="right"?16:-16;ctx.fillStyle="rgba(8,12,22,0.95)";ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx-11,y+h/2-2);ctx.lineTo(tx+d,y+h/2+15);ctx.lineTo(tx+11,y+h/2-2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  glass(ctx,X,y-h/2,w,h,14,col,{glow:8,ea:0.75,fill:"rgba(8,12,22,0.97)"});
  if(o.mark)p7_mark(ctx,"ok",X+34,y,22,o.mp==null?1:o.mp);T(ctx,s_,X+22+(o.mark?38:0),y+sz*0.36,{w:700,size:sz,color:rgba(INK,0.95)});});return w;}
scene("guide",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tGu=c("guide"),tGw=c("grows"),tCh=c("channel"),tSt=c("story");ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p7_slab(ctx,1);p7_me(ctx,t,sc,1);p7_prod(ctx,t,2,"planned outages",{owner:"network"});p7_road(ctx,t,1,{p:1});
  // the guardrails stay a moment, as the last chapter left them, then go
  p7_rails(ctx,1-fin(t,0.4,1.0),1);
  // the guide: every step, how long each takes, and whom to ask
  const gA=fin(t,tGu-0.3,0.6);if(gA>0.01)arrive(ctx,900,370,t,tGu-0.3,()=>withA(ctx,gA,()=>{const x=600,y=224,ww=600,h=310;glass(ctx,x,y,ww,h,16,PSC,{glow:12,ea:0.85,fill:"rgba(16,12,8,0.95)"});
      T(ctx,"THE GUIDE · EVERY STEP",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(PSC,1)});
      P7_GD.forEach(([s_,d],i)=>{const yy=y+90+i*36;withA(ctx,fin(t,w("guide","every step")-0.2+i*0.22,0.4),()=>T(ctx,s_,x+24,yy,{w:700,size:28,color:rgba(INK,0.95)}));
        withA(ctx,fin(t,w("guide","how long")-0.2+i*0.18,0.4),()=>T(ctx,d,x+ww-24,yy,{w:700,size:28,align:"right",color:rgba(PSC,1)}));});
      withA(ctx,fin(t,w("guide","whom to ask")-0.2,0.5),()=>{const fy=y+288;ctx.save();ctx.fillStyle=rgba(PS_OK,1);ctx.beginPath();ctx.arc(x+36,fy-17,7,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(x+36,fy+1,11,8,0,Math.PI,TAU);ctx.fill();ctx.restore();
        T(ctx,"and whom to ask, at each step",x+60,fy,{w:700,size:28,color:rgba(PS_OK,1)});});}),{dy:-10});
  // written from the questions teams asked: each question comes in, and the guide gains a row for it
  const tQ=w("grows","questions"),hA=fin(t,tQ-0.5,0.5)*(1-fin(t,tCh-0.5,0.5));if(hA>0.01)withA(ctx,hA,()=>{const x=1250,y=224,ww=570,n=P7_HOW.reduce((s_,_,i)=>s_+easeCam(clamp((t-tQ-i*1.1)/0.5,0,1)),0);
    glass(ctx,x,y,ww,74+n*38+14,16,APPC,{glow:10,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,"FROM TEAMS' QUESTIONS",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(APPC,1)});
    P7_HOW.forEach((s_,i)=>{const t0=tQ+i*1.1,yy=y+92+i*38,f=clamp((t-t0+0.7)/0.7,0,1);if(f>0&&f<1)p7_q(ctx,lerp(1880,x+38,easeCam(f)),yy-12,Math.sin(f*Math.PI)*1.2);
      const q=clamp((t-t0)/0.5,0,1);if(q<=0.01)return;withA(ctx,q,()=>{p7_mark(ctx,"ok",x+38,yy-9,22,clamp((t-t0-0.2)/0.4,0,1));const k=Math.round(s_.length*clamp((t-t0)/0.7,0,1));T(ctx,s_.slice(0,k),x+66,yy,{w:700,size:28,color:rgba(INK,0.95)});});});});
  // a question in the platform's channel, answered the same day
  const bA=1-fin(t,tSt-0.6,0.5);p7_bubble(ctx,1260,300,"how do I share it with retail?",SOFT,fin(t,w("channel","a question")-0.3,0.5)*bA);
  p7_bubble(ctx,1820,388,"answered the same day",PS_OK,fin(t,w("channel","answer")-0.3,0.5)*bA,{align:"right",mark:"ok",mp:clamp((t-w("channel","same day"))/0.5,0,1)});
  // as the guidebooks listed every station, the guide lists every step
  p7_strip(ctx,t,1260,1800,400,tSt,fin(t,tSt,0.6),"the guidebooks: every station","the guide: every step");
  ctx.restore();
  p7_tags(ctx,t,1180,120,[[0.3,tGw-0.4,"a guide, from the form to a first data product",PSC],[tGw-0.2,tCh-0.4,"written from the questions teams asked",APPC],[tCh-0.2,tSt-0.4,"and someone to ask: an answer the same day",PS_OK],[tSt-0.2,sc.dur+1,"as the guidebooks did",PSC]]);
  vign(ctx,S);});

/* ---------- 7. Two days ---------- */
// March: metering's team tries again, on the path. Monday morning, the form, filled in; by lunch, its repository and its logic; on
// Tuesday the data team reviews the pull request and the tests pass; by Tuesday evening, checked meter reads are in the catalogue, with
// their owner, ready for network and retail. Two days, not six weeks; and metering's spreadsheets are retired.
const P7_MV=["checked meter reads","metering","meter reads, checked"],P7_ML=["which reads count","how estimates are marked"];
scene("days",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tMo=c("monday"),tLu=c("lunch"),tTu=c("tuesday"),tLv=c("live"),tTw=c("two");ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p7_slab(ctx,1);p7_me(ctx,t,sc,1);p7_prod(ctx,t,2,"planned outages",{owner:"network"});
  // metering's light along the road, a station at a time, each ringing green as its step is done
  const tF=w("monday","fills in"),tCa=w("live","catalogue"),K=[[0,-1],[tF-0.4,0],[w("lunch","repository")-0.3,1],[w("lunch","writes its logic")-0.3,2],[w("tuesday","reviews")-0.3,3],[tCa-0.5,4]];
  const ring=[[0,tF+0.2],[1,w("lunch","repository")],[2,w("lunch","how estimates")+0.6],[3,w("tuesday","tests pass")-0.1],[4,tCa+0.3]].map(([k,t0])=>[k,fin(t,t0,0.4)*(1-fin(t,tTw+1.4,0.8)),PS_OK]);
  p7_road(ctx,t,1,{p:1,ring});p7_light(ctx,p7_at(t,K,0.8),fin(t,w("monday","on the path")-0.4,0.5)*(1-fin(t,tCa+0.6,0.5)),APPC);
  // the form, filled in on Monday morning
  p7_form(ctx,600,224,fin(t,tF-0.3,0.5)*(1-fin(t,tTu-0.6,0.5)),{v:P7_MV,vp:P7_MV.map((s_,i)=>clamp((t-w("monday","the form")-0.1-i*0.7)/0.6,0,1)),hi:pulseAt(t,tF,1.2)});
  // its own logic, by lunch: which reads count, and how estimates are marked
  const tLg=w("lunch","writes its logic"),lA=fin(t,tLg-0.3,0.5)*(1-fin(t,tLv-0.6,0.5));if(lA>0.01)arrive(ctx,1530,290,t,tLg-0.3,()=>psaCard(ctx,1236,224,590,"THE LOGIC · METERING'S OWN",P7_ML,APPC,{a:lA,size:30,p:p7_typed(t,P7_ML,[w("lunch","which reads"),w("lunch","how estimates")])}),{dy:-10});
  // Tuesday: the data team reviews the pull request, and its tests pass
  const vA=fin(t,w("tuesday","reviews")-0.2,0.5)*(1-fin(t,tLv-0.4,0.5));if(vA>0.01)withA(ctx,vA,()=>p7_chip(ctx,1460,496,"the pull request: tests pass",{align:"center",col:PS_OK,mark:"ok",mp:clamp((t-w("tuesday","tests pass"))/0.5,0,1)}));
  // by Tuesday evening: checked meter reads, on the platform, in the catalogue, with their owner
  p7_prod(ctx,t,1,"checked meter reads",{drop:clamp((t-tCa+0.3)/0.9,0,1),owner:"metering",ownerA:fin(t,w("live","owner")-0.2,0.5),hi:pulseAt(t,w("live","ready"),1.4)});
  // two days, not six weeks; and metering's spreadsheets, retired
  withA(ctx,fin(t,tTw-0.3,0.5),()=>p7_row(ctx,1180,300,[["two days",PS_OK,1,{mark:"ok",mp:clamp((t-tTw)/0.5,0,1)}],["not six weeks",PS_RED,fin(t,w("two","six weeks")-0.3,0.5),{strike:clamp((t-w("two","six weeks"))/0.5,0,1)}]],24));
  const tSp=w("two","spreadsheets");p7_gave(ctx,t,{a:[0,fin(t,tSp-0.5,0.5)],chip:[0,1],xp:[0,0],retire:clamp((t-w("two","retired")+0.1)/0.8,0,1)});
  ctx.restore();
  eaYear(ctx,80,80,"March",CLAY,fin(t,0.4,0.6));
  p7_tags(ctx,t,1180,120,[[0.3,tLu-0.4,"metering tries again, on the path",APPC],[tLu-0.2,tTu-0.4,"its repository, and its own logic",APPC],[tTu-0.2,tLv-0.4,"reviewed by the data team",PS_OK],[tLv-0.2,tTw-0.4,"in the catalogue, with its owner",PS_OK],[tTw-0.2,sc.dur+1,"two days, not six weeks",PS_OK]]);
  p7_under(ctx,t,1180,186,[[w("monday","Monday")-0.2,w("lunch","lunch")-0.4,"Monday morning",SOFT],[w("lunch","lunch")-0.2,tTu-0.4,"Monday, by lunch",SOFT],[tTu-0.2,w("live","evening")-0.4,"Tuesday",SOFT],[w("live","evening")-0.2,w("live","ready")-0.4,"Tuesday evening",SOFT],[w("live","ready")-0.2,tTw-0.4,"ready for network and retail",APPC]]);
  vign(ctx,S);});

/* ---------- 8. Counted at the ferry ---------- */
// What Ravi counts: how many teams choose the path, how long a first data product takes, what teams say each quarter. By December, eight
// of the eleven domain teams, none told to; two to four days; nine in ten. Field services' jobs move onto the platform and its server is
// switched off; metering's check goes into the template, for every team; as the pilgrims were counted at the ferry.
const P7_RC=[["teams that choose it","8 of 11","dec","eight"],["a first data product","2 to 4 days","days","two to four"],["would tell another team","9 in 10","days","nine in ten"]],P7_ON=[0,1,2,3,5,6,8,9];
scene("count",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tCo=c("counts"),tTh=c("three"),tDe=c("dec"),tDa=c("days"),tSe=c("server"),tBa=c("back"),tSt=c("story");ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  const tEv=w("back","every team");p7_slab(ctx,1);p7_me(ctx,t,sc,1);p7_prod(ctx,t,2,"planned outages",{owner:"network"});p7_prod(ctx,t,1,"checked meter reads",{owner:"metering",hi:pulseAt(t,w("back","adds a check"),1.4)});
  // the teams that chose the path, their lights going along it, green once metering's check is in the template
  const tEi=w("dec","eight");p7_road(ctx,t,1,{p:1,hi:pulseAt(t,tEv,1.6),ring:[[0,pulseAt(t,tEv-0.3,1.4),PS_OK]]});
  p7_flow(ctx,[[P7_R0,P7_RY],[P7_R1,P7_RY]],t,tEi+0.6,8,7.0,7,fin(t,tEi+0.4,0.6),mix(APPC,PS_OK,fin(t,tEv,0.8)));
  // what Ravi counts, each row typed as it's named, each number as it's said
  const kA=fin(t,tCo-0.3,0.6);if(kA>0.01)arrive(ctx,1510,320,t,tCo-0.3,()=>withA(ctx,kA,()=>{const x=1196,y=224,ww=630;glass(ctx,x,y,ww,222,16,PS_OK,{glow:12,ea:0.85,fill:"rgba(6,12,10,0.95)"});
      T(ctx,"WHAT RAVI COUNTS",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(PS_OK,1)});
      P7_RC.forEach(([s_,v,id,word],i)=>{const yy=y+96+i*44,t0=w("three",["How many","how long","what teams say"][i]),n=Math.round(s_.length*clamp((t-t0+0.1)/0.7,0,1));if(n>0)T(ctx,s_.slice(0,n),x+24,yy,{w:700,size:28,color:rgba(INK,0.95)});
        withA(ctx,fin(t,w(id,word)-0.2,0.5),()=>T(ctx,v,x+ww-24,yy,{w:800,size:30,align:"right",color:rgba(PS_OK,1)}));});}),{dy:-10});
  // the eleven domain teams, a light for each: the eight that chose the path, lit
  const dA=fin(t,tDe-0.3,0.5);if(dA>0.01)withA(ctx,dA,()=>{for(let i=0;i<11;i++){const x=1220+i*54,y=486,on=P7_ON.indexOf(i),q=on<0?0:fin(t,tEi-0.1+on*0.16,0.3),col=mix(SOFT,mix(APPC,PS_OK,fin(t,tEv,0.8)),q);
    if(q>0.01)glow(ctx,x,y,30,col,0.5*q);ctx.fillStyle=rgba(col,0.3+0.65*q);ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.fill();}});
  // field services moves its jobs onto the platform, and its own server is switched off
  const tFs=w("server","Field services"),sA=fin(t,tFs-0.4,0.5),off=fin(t,w("server","switched off")-0.1,0.6);
  p7_gave(ctx,t,{a:[sA,0],xp:[0,0],off});
  const tJb=w("server","onto the platform");if(t>tJb-0.4)withA(ctx,sA*(1-fin(t,tJb+0.9,0.4)),()=>p7_runner(ctx,[[P7_GX+150,P7_GY[0]+48],[P7_GX+150,380],[760,520],[760,650]],clamp((t-tJb+0.4)/1.2,0,1),TECC,{r:7,trail:0.25}));
  p7_prod(ctx,t,0,"field jobs",{drop:clamp((t-tJb-0.6)/0.9,0,1),owner:"field services",ownerA:fin(t,tJb+0.6,0.5)});
  // metering's team adds a check to the template, at the start of the path, so every team gets it: a tick comes out of its data
  // product, goes to the start of the path, and is named there (no words in flight, so none cross the stations' names)
  const tCk=w("back","adds a check"),u=easeCam(clamp((t-tCk)/1.3,0,1)),cA=fin(t,tCk-0.3,0.4)*(1-fin(t,tSt-0.9,0.5));
  if(cA>0.01){const x=lerp(1230,P7_RX[0],u),y=lerp(660,500,u)-Math.sin(u*Math.PI)*90,ga=cA*(1-fin(t,tCk+1.2,0.3));
    if(ga>0.01)withA(ctx,ga,()=>{glow(ctx,x,y,40,PS_OK,0.5);ctx.save();ctx.fillStyle="rgba(8,14,18,0.94)";ctx.strokeStyle=rgba(PS_OK,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,17,0,TAU);ctx.fill();ctx.stroke();ctx.restore();p7_mark(ctx,"ok",x+1,y,22,1);});
    withA(ctx,cA*fin(t,tCk+1.1,0.4),()=>p7_chip(ctx,P7_RX[0],500,"metering's check",{align:"center",col:PS_OK,mark:"ok"}));}
  // as the pilgrims were counted at the ferry, Ravi counts who chooses the road
  p7_strip(ctx,t,640,1160,440,tSt,fin(t,tSt-0.2,0.6),"at Ise: counted at the ferry","here: who chooses the road");
  ctx.restore();
  eaYear(ctx,80,80,"December",CLAY,fin(t,tDe-0.4,0.6));
  p7_tags(ctx,t,1180,120,[[0.3,tTh-0.4,"what tells Ravi the platform works",PS_OK],[tTh-0.2,tDe-0.4,"teams that choose it, days, and what teams say",PS_OK],[tDe-0.2,tSe-0.4,"eight of eleven teams, and none was told to",PS_OK],[tSe-0.2,tBa-0.4,"field services' own server, switched off",TECC],[tBa-0.2,tSt-0.4,"metering's check, in the template for every team",PS_OK],[tSt-0.2,sc.dur+1,"as at the ferry",PSC]]);
  vign(ctx,S);});

/* ---------- 9. The data practice on the map ---------- */
// The platform as a product, on Tomás's map: the path is one of the data platform's technology services, a new data product from the
// template, beside the others; it serves each data product made from it, each owned by its domain; and the goal, teams choose the
// platform, realised by two outcomes.
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p7_room(ctx,S,t);
  const tIn=c("intro"),tPa=c("path"),tSe=c("serves"),tGo=c("goal");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const MOT=LAY6[0][1];
  psaBand(ctx,30,170,"motivation",MOT,fin(t,0.2,0.8));psaBand(ctx,216,226,"application layer",APPC,fin(t,0.3,0.8));psaBand(ctx,458,300,"technology layer",TECC,fin(t,0.5,0.8));
  // the technology layer: the data platform, its services, and among them the path
  const nA=fin(t,tIn-0.2,0.6);psaEl(ctx,360,494,1300,240,"",TECC,"node",{a:nA});withA(ctx,nA,()=>T(ctx,"the data platform",1612,712,{w:800,size:30,align:"right",color:rgba(INK,0.95)}));
  const SV=[["connectors",400,630,250],["monitoring",670,630,250],["masks and log",940,630,280],["the catalogue",1100,534,290]];
  SV.forEach(([nm,x,y,w_],i)=>psaEl(ctx,x,y,w_,60,nm,TECC,"service",{a:fin(t,tIn+0.2+i*0.12,0.5)*0.85,size:28}));
  const tPt=w("path","a new data product"),pA=fin(t,tPt-0.4,0.5);if(pA>0.01){glow(ctx,735,566,220,PSC,0.22*pA);withA(ctx,pA,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=2.4;ctx.setLineDash([8,6]);rr(ctx,390,524,690,82,41);ctx.stroke();ctx.setLineDash([]);ctx.restore();});}
  psaEl(ctx,400,534,670,62,"a new data product, from the template",TECC,"service",{a:fin(t,w("path","path")-0.3,0.5),size:28,hi:pulseAt(t,tPt,1.6)});
  // the data products made from it, each owned by its domain, and the path serving each
  // (each owner's tag at its product's right end, and each serve line to its left end, so the lines pass clear of the tags)
  const AP=[["planned outages","network",370,560],["checked meter reads","metering",830,735],["field jobs","field services",1290,1000]];
  AP.forEach(([nm,own,x,x0],i)=>{const a=fin(t,w("serves","each data product")-0.3+i*0.2,0.5);psaEl(ctx,x,252,400,84,nm,APPC,"component",{a,size:28});
    withA(ctx,a*fin(t,w("serves","owned")-0.2+i*0.15,0.5),()=>psaOwner(ctx,x+390,384,own,{align:"right"}));
    const r0=w("serves","serves")-0.1+i*0.15;psaRel(ctx,x0,534,x+70+20*i,338,"serve",TECC,fin(t,r0,0.4)*0.9,clamp((t-r0)/0.6,0,1));});
  // the goal, realised by two outcomes
  // (an outcome either side of the goal, each realising it)
  const MO=[["eight teams of eleven",360,"eight teams",400,760,830],["a first data product in days",1350,"first data product",480,1350,1270]];
  const gA=fin(t,w("goal","teams choose")-0.3,0.5);psaEl(ctx,830,64,440,96,"teams choose the platform",MOT,"goal",{a:gA,size:28,hi:pulseAt(t,w("goal","teams choose"),1.4)});
  MO.forEach(([nm,x,word,ow,rx0,rx1],i)=>{const t0=w("goal",word)-0.3;psaEl(ctx,x,64,ow,96,nm,MOT,"outcome",{a:fin(t,t0,0.5),size:28,hi:pulseAt(t,t0+0.3,1.2)});
    const r0=w("goal","realised")-0.1+i*0.25;psaRel(ctx,rx0,112,rx1,112,"realise",MOT,fin(t,r0,0.4),clamp((t-r0)/0.6,0,1));});
  ctx.restore();
  const tags=[[0.3,tPa-0.4,"the platform as a product, on Tomás's map",SOFT],[tPa-0.2,tSe-0.4,"the path: one of the platform's technology services",TECC],[tSe-0.2,tGo-0.4,"it serves each data product made from it",APPC],[tGo-0.2,sc.dur,"a goal, realised by two outcomes",MOT]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,866,s_,col,{align:"center",size:28})));
  vign(ctx,S);});

/* ---------- 10. The road, chosen ---------- */
// The road at dusk: pilgrims going on to Ise, and the oshi at his door, expecting them; then the utility: the path lit end to end, the
// teams' lights going along it, what made it a road teams choose, and the next film
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("data"),tW=c("what"),tN=c("next"),outA=1-fin(t,B+0.6,0.8),rA=(1-fin(t,tD-0.6,0.9))*outA,uA=fin(t,tD-0.6,0.9)*outA;if(outA<1)p7_base(ctx,S);
  psaRooms(ctx,[[rA,ctx=>{psaDusk(ctx,S,{d:1,y0:P7_Y0});ctx.save();drift(ctx,t,{dur:tD+1},{z:0.02,y:640,x:1000});
    [[90,0.95,1],[330,1.1,2]].forEach(([x,s,k])=>psaPine(ctx,x,P7_Y0+2,s,k,{rim:PSC}));
    p7_grove(ctx,1680,P7_Y0+4,1.0,1,1);psaStation(ctx,1180,P7_Y0+2,0.92,{lit:1});
    // pilgrims, walking on to Ise; the oshi at his door, waiting for them
    const v=psaPace("walker",0.94,0.55);[[0,0.2,"pilgrim"],[-120,0.65,"pilgrim"],[-250,0.4,"walker"]].forEach(([dx,ph,k])=>psaWalker(ctx,330+dx+t*v,P7_G+10,0.94,t,{kind:k,dir:1,ph,rate:0.55}));
    p7_oshi(ctx,1000,P7_G+22,1.0,t,{dir:-1,ph:0.4,amp:0});
    ctx.restore();
    withA(ctx,fin(t,0.6,0.6)*(1-fin(t,w("road","The way")-0.4,0.4)),()=>tag(ctx,960,120,"nobody was made to go",PSC,{align:"center",size:32}));
    withA(ctx,fin(t,w("road","The way")-0.2,0.5),()=>p7_row(ctx,960,120,[["the way laid out",PSC,1],["paid for together",PSC,fin(t,w("road","paid for")-0.2,0.5)],["someone expecting them",PS_OK,fin(t,w("road","someone")-0.2,0.5)]],18));
    eaYear(ctx,80,80,"on the road to Ise",CLAY,fin(t,0.4,0.6));}],
  [uA,ctx=>{p7_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:24},{z:0.012,y:500,x:1100});
    p7_slab(ctx,1);psaWhole(ctx,1,[0,380,460,1080],cx=>person(cx,"ravi",P7_ME[0],1030,P7_ME[1],{t:t+sc.start}));psaWho(ctx,P7_ME[0]-10,P7_WHO,"Ravi Menon","platform lead",TECH,1);
    p7_prod(ctx,t,0,"field jobs",{owner:"field services"});p7_prod(ctx,t,1,"checked meter reads",{owner:"metering"});p7_prod(ctx,t,2,"planned outages",{owner:"network"});
    p7_road(ctx,t,1,{p:clamp((t-tD+0.4)/1.8,0,1),names:false});p7_flow(ctx,[[P7_R0,P7_RY],[P7_R1,P7_RY]],t,tD+0.6,8,7.0,7,1,APPC);
    // what made it a road teams choose, as each is named; and someone counts who chooses it
    p7_row(ctx,1180,250,[["a path already laid",PSC,fin(t,w("what","path")-0.2,0.5)],["the rules built in",PSC,fin(t,w("what","rules")-0.2,0.5)]],20);
    p7_row(ctx,1180,320,[["a guide",PSC,fin(t,w("what","a guide")-0.2,0.5)],["someone to ask",PS_OK,fin(t,w("what","someone to ask")-0.2,0.5)]],20);
    withA(ctx,fin(t,w("what","counts")-0.2,0.5),()=>p7_chip(ctx,1180,390,"and someone counts who chooses it",{align:"center",col:PS_OK}));
    ctx.restore();
    withA(ctx,fin(t,tD-0.3,0.6),()=>tag(ctx,1180,120,"the easiest way to do it right",PS_OK,{align:"center",size:32}));
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,1180,476,"Next: Built to change",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"A road people choose","The easiest way to do it right, laid out for every team.","film 7 of 8");});

/* where the chapters meet: the utility's chapters glide on from one to the next in one room (From words to data's joins.js); what
   stays stays put, and whoever comes or goes does so after the join */
const CHAPTER_JOINS={glide:["users","path","rules","guide","days","count"]};
