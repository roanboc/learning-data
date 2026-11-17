/* ===== One solution, end to end: scenes =====
   Twelve chapters, as in ../script.md. Japan, 1635: the shogunate makes the lords live in Edo every other year, so every year each lord
   travels there or home, with a hundred people, or two thousand and more, and all the lord will need. On the Tōkaidō each station keeps a
   hundred porters and a hundred horses for everyone on the road, and an inn for lords; a procession arriving unannounced would find too
   few. So the lord's officials plan the journey end to end: who goes, within the shogunate's limits, and a notice sent ahead to every
   station (how many porters and horses, which day, where the lord rests and sleeps); a day or two before, a board with his name goes up
   at the inn; each station calls on nearby villages in time. Then the utility: three teams start three pieces of the social tariff, and
   Sipho Dlamini, a solution architect, designs it end to end, beside Tomás and Ravi: its context, three qualities with a measure each,
   two options tested against them, the decision written down with why, most of its parts reused, every team told ahead; on the first of
   July the first bills carry the discount.
   Made to read on a phone (tools/legible.py, site-tools/fits.py): text is at least 28 px in the frame and inside its box, and what's
   drawn small is texture. Motion: every shot drifts slowly and things arrive with a spring; on the map the camera glides; the utility's
   chapters glide on from one to the next in one room, where what stays stays put and only what changes fades; between rooms the whole
   picture dissolves. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in
   step. */

/* ---------- the film's new person ---------- */
// Sipho Dlamini, a solution architect (technical, so cyan), joins the cast in this film's own source, drawn like the rest of it:
// close black coily hair, no glasses and no beard (Tomás has both, Ravi a beard), an indigo shirt with its sleeves rolled
PEOPLE.sipho={name:"Sipho Dlamini",role:"Solution architect",side:"Technical",does:"produces",edge:TECH,seed:25,
  skin:[104,68,50],hair:{style:"coily",c:[24,20,20]},
  top:{kind:"shirt",c:[64,78,132],rolled:true},bottom:{c:[48,46,52]},shoe:[40,32,28],build:{sh:76,hip:60,h:1.02}};

/* ---------- shared by the chapters ---------- */
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p6_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p6_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaWalker and psaHorse)
function p6_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}
// a light that travels along a path, with a fading trail: a procession on the map, a notice sent ahead
function p6_runner(ctx,pts,u,col,o){o=o||{};if(u<=0||u>=1.0001&&!o.hold)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0||uu>1)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// a tick or a cross, drawn in strokes as p goes from 0 to 1, s across
function p6_mark(ctx,kind,x,y,s,p){if(p<=0.01)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=Math.max(3,s*0.16);const a=clamp(p*2,0,1),b=clamp(p*2-1,0,1);
  if(kind==="ok"){ctx.strokeStyle=rgba(PS_OK,1);ctx.beginPath();ctx.moveTo(x-s*0.42,y);ctx.lineTo(x-s*0.42+s*0.3*a,y+s*0.3*a);if(b>0)ctx.lineTo(x-s*0.12+s*0.55*b,y+s*0.3-s*0.62*b);ctx.stroke();}
  else{const h=s*0.34;ctx.strokeStyle=rgba(PS_RED,1);ctx.beginPath();ctx.moveTo(x-h,y-h);ctx.lineTo(x-h+2*h*a,y-h+2*h*a);if(b>0){ctx.moveTo(x+h,y-h);ctx.lineTo(x+h-2*h*b,y-h+2*h*b);}ctx.stroke();}
  ctx.restore();}
// a small pill: a name, a team, a measure; o.dash draws an outline only; o.mark ("ok" or "no") a tick or a cross at its left, drawn
// as o.mp goes from 0 to 1; o.strike a line through it. Made from its words as drawn, at their size.
function p6_chipW(ctx,name,sz,o){o=o||{};return 30+tw(ctx,name,sz||28,700)+(o.mark?38:0);}
function p6_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p6_chipW(ctx,name,sz,o),h=sz+18,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    else glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,14,18,0.94)"});
    if(o.mark)p6_mark(ctx,o.mark,X+30,y,22,o.mp==null?1:o.mp);
    if(name)T(ctx,name,X+(o.mark?38:0)+(w-(o.mark?38:0))/2,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(o.dash?col:INK,0.96)});
    if(o.strike>0.01){ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+12,y);ctx.lineTo(X+12+(w-24)*clamp(o.strike,0,1),y);ctx.stroke();ctx.restore();}});return w;}
// chips in a row, centred on x, gap apart: [[text, col, a, o], ...]
function p6_row(ctx,x,y,items,gap){gap=gap||20;const ws=items.map(it=>p6_chipW(ctx,it[0],(it[3]||{}).size,it[3]||{})),tot=ws.reduce((s_,v)=>s_+v,0)+gap*(items.length-1);let xx=x-tot/2;
  items.forEach((it,i)=>{p6_chip(ctx,xx,y,it[0],Object.assign({col:it[1],a:it[2]},it[3]||{}));xx+=ws[i]+gap;});}
// a line through the points P, drawn up to p of its length, with a head at its end once it's whole; o.lw, o.glow, o.head, o.dash
function p6_len(S){const L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));return L;}
function p6_route(ctx,P,col,a,p,o){o=o||{};if(a<=0.01||p<=0)return;const L=p6_len(P),d=clamp(p,0,1)*L[L.length-1];withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  if(o.glow){ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=o.glow;}ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let end=P[0],an=0;
  for(let i=1;i<P.length;i++){if(L[i]<=d){ctx.lineTo(P[i][0],P[i][1]);end=P[i];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=lerp(P[i-1][0],P[i][0],f),y=lerp(P[i-1][1],P[i][1],f);ctx.lineTo(x,y);end=[x,y];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);break;}}
  ctx.stroke();ctx.shadowBlur=0;ctx.setLineDash([]);if(o.head!==false&&p>=0.98){const hs=o.head||9,[x,y]=end;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.5)*hs,y-Math.sin(an-0.5)*hs);ctx.lineTo(x-Math.cos(an+0.5)*hs,y-Math.sin(an+0.5)*hs);ctx.closePath();ctx.fill();}ctx.restore();});}
// a question mark, red, where nobody has drawn how two pieces join
function p6_q(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,40,PS_RED,0.35);T(ctx,"?",x,y+16,{w:800,size:44,align:"center",color:rgba(PS_RED,1)});});}

/* ---------- the story: a lord's journey on the Tōkaidō ---------- */
const P6_Y0=760,P6_G=784;
// the road at dusk, seen from its side, as in the series' other films: pines along it; o.noPine skips one where something stands
function p6_road(ctx,S,t,o){o=o||{};psaDusk(ctx,S,{d:o.d==null?1:o.d,y0:P6_Y0});
  [[90,0.95,1],[330,1.1,2],[1660,1.0,3],[1880,0.92,5]].forEach(([x,s,k])=>{if(o.noPine&&o.noPine(x))return;psaPine(ctx,x,P6_Y0+2,s,k,{rim:PSC});});}
// the board with a lord's name, set up at the inn a day or two before he sleeps there: a tall plank on a post, under a small roof, lit
// by the inn's lantern; its writing is texture, a column of short strokes, since the name isn't read; k (0..1) raises it into place
function p6_board(ctx,x,y0,s,k,o){o=o||{};if(k<=0.01)return;const q=spring(clamp(k,0,1)*1.1),lit=o.lit==null?1:o.lit;withA(ctx,clamp(k*2.5,0,1),()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);ctx.translate(0,(1-q)*36);
  if(lit>0.01)glow(ctx,0,-210,150,PSC,0.22*lit+0.25*(o.hi||0));
  ctx.fillStyle="rgba(16,12,12,1)";ctx.fillRect(-6,-130,12,130);
  const g=ctx.createLinearGradient(0,-330,0,-120);g.addColorStop(0,rgba(mix([58,46,38],[232,198,150],0.62*lit),1));g.addColorStop(1,rgba(mix([40,32,28],[168,128,88],0.55*lit),1));ctx.fillStyle=g;ctx.fillRect(-34,-326,68,206);
  ctx.strokeStyle="rgba(22,16,14,0.95)";ctx.lineWidth=3;ctx.strokeRect(-34,-326,68,206);
  ctx.fillStyle="rgba(14,10,12,1)";ctx.beginPath();ctx.moveTo(-50,-322);ctx.lineTo(0,-350);ctx.lineTo(50,-322);ctx.lineTo(46,-314);ctx.lineTo(-46,-314);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(34,24,22,0.85)";for(let i=0;i<8;i++){const yy=-300+i*21,ww=7+hash(i,91)*9,hh=9+hash(i,92)*6;rr(ctx,-ww/2+(hash(i,93)-0.5)*5,yy,ww,hh,3);ctx.fill();}
  ctx.restore();});}
// a load set down on the road: a bundle wrapped in matting, tied with a rope; o.red rims it in red (a load that waits)
function p6_load(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const red=o.red||0;
  if(red>0.01)glow(ctx,0,-22,70,PS_RED,0.3*red);ctx.fillStyle="rgba(26,20,20,1)";rr(ctx,-34,-46,68,46,8);ctx.fill();ctx.strokeStyle=rgba(mix(mix([90,70,56],PSC,0.4),PS_RED,red),0.9);ctx.lineWidth=2.4;rr(ctx,-34,-46,68,46,8);ctx.stroke();
  ctx.strokeStyle=rgba(mix([120,96,70],PS_RED,red*0.6),0.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-34,-24);ctx.lineTo(34,-24);ctx.moveTo(0,-46);ctx.lineTo(0,0);ctx.stroke();ctx.restore();});}
// a lord's procession, walking left, led by two retainers with their spears: an official riding, porters with their loads, the lord's
// palanquin on its bearers, more porters, a pack horse and the last walkers. Each at its place behind the first, its own step. dx at s=1
const P6_PROC=[["spear",0],["spear",120],["rider",300],["porter",500],["porter",620],["palanquin",880],["porter",1150],["pack",1330],["walker",1520],["porter",1640]];
function p6_proc(ctx,x,G,s,t,o){o=o||{};const amp=o.amp==null?1:o.amp,rate=o.rate||0.55,v=psaPace("walker",s,rate),hs=s*0.86,hr=v/(93*hs),a=o.a==null?1:o.a,col=o.col;
  P6_PROC.forEach(([k,dx],i)=>{const xx=x+dx*s;if(xx<-300||xx>2240)return;const ph=hash(i,57),q={dir:-1,ph,amp,still:amp<=0.001,a,col};
    if(k==="rider"||k==="pack")psaHorse(ctx,xx,G,hs,t,Object.assign({},q,{rate:hr,rider:k==="rider",pack:k==="pack"}));
    else if(k==="palanquin")psaPalanquin(ctx,xx,G,s,t,Object.assign({},q,{rate}));
    else psaWalker(ctx,xx,G,s,t,Object.assign({},q,{kind:k,rate}));});}
// the loads a stopped procession sets down on the road, behind its first: [dx at s=1, 1 if it sits on the two before it]; a heap by the
// station's door, the rest by the porters and the palanquin
const P6_LOADS=[[370,0],[445,0],[408,1],[700,0],[780,0],[1010,0]];

/* ---------- the story: Japan's map, the roads and the journeys on them ---------- */
// the roads that lead to Edo, as points in the frame: the Tōkaidō, then the other four
function p6_roads(v){return[PSA_TKD.map((s_,i)=>psaTkd(i,v))].concat(PSA_ROADS.map(r=>r[1].map(p=>psaJP(p[0],p[1],v))));}
// the processions of a year: lights on every road, some going to Edo and some going home, each its own pace
const P6_JOURNEYS=[[0,1,0.0],[0,-1,0.35],[0,1,0.7],[1,1,0.15],[1,-1,0.55],[2,-1,0.25],[3,1,0.45],[4,-1,0.6],[0,-1,0.9],[1,1,0.8]];
function p6_journeys(ctx,R,t,t0,a,z){if(a<=0.01)return;withA(ctx,a,()=>{P6_JOURNEYS.forEach(([k,d,o],i)=>{const P=d>0?R[k].slice().reverse():R[k],u=((t-t0)/8.5+o)%1;if(t<t0+o*2)return;
  p6_runner(ctx,P,u,PSC,{r:5.5/z,trail:0.06});});});}

/* ---------- 1. A notice sent ahead ---------- */
const P6_NOTICE=["The journey, planned before it starts","who goes: no more than his rank allows","a notice, ahead to every station:","porters and horses: how many","on which day","where the lord rests, and sleeps"];
scene("ahead",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tJo=c("journey"),tSi=c("size"),tSt=c("station"),tPr=c("problem"),tWa=c("wait"),tNe=c("need"),tPl=c("plan"),tLi=c("list"),tNo=c("notice"),tBo=c("board"),tRe=c("ready"),tRl=c("relay"),tSh=c("shared"),tOn=c("one"),tSp=c("sipho");
  // which room: the map; the road at dusk; the map again, as the journey is planned; the road again; then the utility. Under the title,
  // the last room leaves whole
  const outA=1-fin(t,B+0.9,0.7),r1=fin(t,tSi-1.0,0.9),m2=fin(t,tPl-1.0,0.9),r2=fin(t,tBo-1.0,0.9),uu=fin(t,tOn-0.8,0.9);
  const mA=Math.max(1-r1,m2*(1-r2))*outA,rA=Math.max(r1*(1-m2),r2*(1-uu))*outA,uA=uu*outA;if(outA<1)p6_base(ctx,S);
  const late=t>tPl-1.0;
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.2});ctx.save();
    const CK=late?[[tPl-1.0,980,620,1.0],[tPl-0.4,990,640,1.22]]:[[0,1000,560,0.92],[tJo-0.6,1000,580,1.0]],z=focusZ(t,CK,2.4);focus(ctx,t,CK,2.4);
    const lit=late?0.34:0.3,nA=late?fin(t,tNo+0.4,0.6):0,tN0=w("notice","ahead"),nu=clamp((t-tN0)/4.2,0,1);
    // the notice runs ahead from Kyoto to Edo, lighting each station as it passes; the lord's sleeps marked every few stations
    const TK=psaMap(ctx,PSA_VIEW,t,{lit,roads:late?0.55:clamp((t-0.8)/2.4,0,1),tkd:1,st:late?fin(t,tPl-0.6,0.8):fin(t,tJo-0.4,0.8)*0.6,ends:fin(t,0.6,0.8),namesA:fin(t,0.6,0.8),nameSize:34/z,
      lit_:i=>late?clamp((nu*(PSA_TKD.length-1)-(PSA_TKD.length-1-i))*1.5,0,1):0});
    const R=p6_roads(PSA_VIEW);R[0]=TK;
    // Edo, where the lords live every other year
    const[ex,ey]=TK[0];const hA=fin(t,w("year","Edo")-0.2,0.8)*(late?0.6:1);if(hA>0.01){glow(ctx,ex,ey,80/z,PSC,0.55*hA);withA(ctx,hA,()=>{ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=2.4/z;ctx.beginPath();ctx.arc(ex,ey,24/z,0,TAU);ctx.stroke();});}
    // a year's journeys, on every road: to Edo, or home
    if(!late)p6_journeys(ctx,R,t,tJo-0.6,fin(t,tJo-0.4,0.8),z);
    if(late){if(nu>0&&nu<1)p6_runner(ctx,TK.slice().reverse(),nu,[255,236,200],{r:6/z,trail:0.05});
      // the procession follows, far slower, from Kyoto
      const pu=clamp((t-tN0-1.6)/26,0,1);if(pu>0)p6_runner(ctx,TK.slice().reverse(),pu,PSC,{r:8/z,trail:0.02,hold:true});
      const sl=fin(t,w("notice","sleep")-0.3,0.6);if(sl>0.01)for(let i=PSA_TKD.length-5;i>0;i-=4){const[x,y]=TK[i];withA(ctx,sl,()=>{ctx.save();ctx.translate(x,y-20/z);ctx.scale(1/z,1/z);ctx.fillStyle=rgba([236,226,204],0.95);ctx.beginPath();ctx.arc(0,0,8,0,TAU);ctx.fill();ctx.fillStyle="rgba(14,18,34,1)";ctx.beginPath();ctx.arc(4,-3,7,0,TAU);ctx.fill();ctx.restore();});}}
    ctx.restore();
    if(!late){eaYear(ctx,80,80,"Japan · 1635",CLAY,fin(t,0.5,0.8));
      withA(ctx,fin(t,w("year","lords")-0.2,0.6)*(1-fin(t,tJo-0.4,0.4)),()=>tag(ctx,960,160,"the lords live in Edo every other year",PSC,{align:"center",size:32}));
      withA(ctx,fin(t,tJo-0.2,0.6),()=>tag(ctx,960,160,"so every year, each lord travels: to Edo, or home",PSC,{align:"center",size:32}));}
    else{eaYear(ctx,80,80,"the Tōkaidō",CLAY,fin(t,tPl-0.6,0.6));
      // the plan, on paper: who goes, then the notice sent ahead, line by line as each is said
      const L=P6_NOTICE,at=[tPl,w("list","who goes"),w("notice","notice"),w("notice","porters"),w("notice","which day"),w("notice","rest")],i=at.filter(x=>t>=x-0.15).length,tot=L.join(" ").length,n0=L.slice(0,Math.max(1,i)).join(" ").length;
      arrive(ctx,420,360,t,tPl-0.2,()=>psaPaper(ctx,90,150,700,420,L,{kicker:true,size:32,p:i>=L.length?1:Math.min(1,n0/tot+0.0001),rot:-0.012,a:1}),{dy:-12});}}],
  /* the road at dusk: the procession, the station that serves everyone, and what goes wrong unannounced; then, planned, the board at
     the inn, porters and horses called in from the villages in time, and the procession passing on, station to station */
  [rA,ctx=>{p6_road(ctx,S,t,{d:1});ctx.save();
    const two=t>tPl-1.0,u=two?t-tBo+1.0:t-tSi+1.0;drift(ctx,u,{dur:two?34:40},{z:0.025,y:660,x:1060});
    psaStation(ctx,1180,P6_Y0+2,1.0,{lit:1});
    // the station's own porters and horses, waiting by it for whoever comes: a few drawn, a hundred of each kept
    [["porter",470,0.8],["porter",555,0.3],["horse",680,0.6]].forEach(([k,x,ph])=>{if(k==="horse")psaHorse(ctx,x,P6_G-10,0.66,t,{dir:-1,still:true,pack:true,ph});else psaWalker(ctx,x,P6_G-10,0.86,t,{kind:k,dir:-1,still:true,ph});});
    if(!two){
      // the procession, in from the right; unannounced, it stops at the station, too many for what's there, and its loads wait
      const s=0.86,v=psaPace("walker",s,0.55),tIn=tSi-1.0,tStop=tPr+0.6,xs=930+v*(tStop-tIn),[d,amp]=p6_go(t,tIn,tStop,v),x=xs-d;
      p6_proc(ctx,x,P6_G+14,s,t,{amp,rate:0.55});
      const ld=fin(t,w("wait","loads")-0.3,0.6),red=fin(t,w("wait","wait")-0.1,0.6)*(1-0.6*fin(t,tNe+0.4,0.8));
      P6_LOADS.forEach(([dx,up],i)=>p6_load(ctx,x+dx*s,P6_G+30-up*40,0.9,{a:ld*fin(t,w("wait","loads")-0.3+i*0.12,0.4),red}));}
    else{
      // planned: the board goes up at the inn; porters and horses come in from the villages; the procession passes on, its loads carried
      p6_board(ctx,840,P6_G-6,1.0,clamp((t-w("board","board")+0.2)/1.0,0,1),{lit:1,hi:pulseAt(t,w("board","nobody")+0.2,1.6)});
      const vv=psaPace("walker",0.86,0.6);[["porter",400,0.2],["pack",270,0.6],["porter",150,0.9]].forEach(([k,xe,ph],i)=>{const t0=tRe+0.2+i*0.45,D=xe+260,[d,amp]=p6_go(t,t0,t0+D/vv+0.5,vv),x=-260+d;
        if(k==="pack")psaHorse(ctx,x,P6_G-6,0.66,t,{dir:1,pack:true,ph,amp,still:amp<=0,rate:vv/(93*0.66)});else psaWalker(ctx,x,P6_G-6,0.86,t,{kind:k,dir:1,ph,amp,still:amp<=0,rate:0.6});});
      const s=0.86,v=psaPace("walker",s,0.55),tIn=tRl-1.2;if(t>tIn){const x=2060-(t-tIn)*v;p6_proc(ctx,x,P6_G+14,s,t,{rate:0.55});}
      // everyone else on the road: a pilgrim and a walker, going the other way
      [["pilgrim",tSh-2.4,0.3],["walker",tSh-1.2,0.7]].forEach(([k,t0,ph])=>{if(t<t0)return;const x=-140+(t-t0)*psaPace("walker",1.02,0.55);psaWalker(ctx,x,P6_G+44,1.02,t,{kind:k,dir:1,ph,rate:0.55});});}
    ctx.restore();
    // the words over the road
    if(!two){const tags=[[tSi-0.2,tSt-0.4,"a small lord: about a hundred people",PSC],[w("size","greatest")-0.2,tSt-0.4,null],[tSt-0.2,tPr-0.4,"each station: a hundred porters, a hundred horses",PSC],
        [tPr-0.2,tWa-0.4,"three hundred, unannounced: too few",PS_RED],[tWa-0.2,tNe-0.4,"its loads wait",PS_RED],[tNe-0.2,tPl-0.9,"the stations need to know what's coming, and when",PS_OK]];
      tags.forEach(([a0,a1,s_,col])=>{if(s_)withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,120,s_,col,{align:"center",size:32}));});
      withA(ctx,fin(t,w("size","greatest")-0.2,0.5)*(1-fin(t,tSt-0.4,0.4)),()=>p6_chip(ctx,960,186,"the greatest: two thousand or more",{align:"center",col:PSC}));
      withA(ctx,fin(t,w("station","everyone")-0.2,0.5)*(1-fin(t,tPr-0.4,0.4)),()=>p6_chip(ctx,960,186,"for everyone on the road, and an inn for lords",{align:"center",col:PSC}));
      withA(ctx,fin(t,w("wait","inn")-0.2,0.5)*(1-fin(t,w("wait","Each day")-0.3,0.4)),()=>p6_chip(ctx,960,186,"and the inn might be taken",{align:"center",col:PS_RED}));
      withA(ctx,fin(t,w("wait","Each day")-0.2,0.5)*(1-fin(t,tNe-0.4,0.4)),()=>p6_chip(ctx,960,186,"each day on the road: paid by the domain",{align:"center",col:AMBER}));
      withA(ctx,fin(t,w("need","domain")-0.2,0.5)*(1-fin(t,tPl-0.9,0.4)),()=>p6_chip(ctx,960,186,"and the journey planned before it starts",{align:"center",col:PS_OK}));
      eaYear(ctx,80,80,"on the Tōkaidō",CLAY,fin(t,tSi-0.4,0.6));}
    else{const tags=[[tBo-0.2,tRe-0.4,"a board with his name, at the inn",PSC],[tRe-0.2,tRl-0.4,"each station knows days ahead",PS_OK],[tRl-0.2,tSh-0.4,"station to station",PSC],[tSh-0.2,tOn-0.9,"one road for everyone",PSC]];
      tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,120,s_,col,{align:"center",size:32})));
      withA(ctx,fin(t,w("board","before")-0.2,0.5)*(1-fin(t,w("board","nobody")-0.3,0.4)),()=>p6_chip(ctx,960,186,"a day or two before he arrives",{align:"center",col:PSC}));
      withA(ctx,fin(t,w("board","nobody")-0.2,0.5)*(1-fin(t,tRe-0.4,0.4)),()=>p6_chip(ctx,960,186,"nobody else may stay there",{align:"center",col:AMBER}));
      withA(ctx,fin(t,w("ready","villages")-0.2,0.5)*(1-fin(t,tRl-0.4,0.4)),()=>p6_chip(ctx,960,186,"more from nearby villages, in time",{align:"center",col:PS_OK}));
      withA(ctx,fin(t,w("relay","porters")-0.2,0.5)*(1-fin(t,tSh-0.4,0.4)),()=>p6_chip(ctx,960,186,"on the porters and horses that serve every traveller",{align:"center",col:PSC}));
      withA(ctx,fin(t,w("shared","each journey")-0.2,0.5)*(1-fin(t,tOn-0.9,0.4)),()=>p6_chip(ctx,960,186,"and each journey planned end to end",{align:"center",col:PS_OK}));
      eaYear(ctx,80,80,"on the Tōkaidō",CLAY,fin(t,tBo-0.4,0.6));}}],
  /* the utility: three pieces nobody has joined; then Sipho, and the one line from the agency's answer to the bill */
  [uA,ctx=>{p6_room(ctx,S,t);ctx.save();drift(ctx,t-tOn+0.8,{dur:20},{z:0.016,y:500,x:1100});
    // the three pieces leave as Sipho is named, before the one line comes in where they were, so no word shows twice
    withA(ctx,1-fin(t,w("sipho","solution")-0.2,0.7),()=>p6_pieces(ctx,t,{a:i=>fin(t,tOn+0.1+i*0.35,0.6),q:fin(t,w("one","nobody")-0.2,0.6)}));
    person(ctx,"sipho",230,1030,0.8,{t});psaWho(ctx,220,500,"Sipho Dlamini","solution architect",TECH,fin(t,tSp-0.2,0.6));
    p6_line(ctx,t,{a:fin(t,w("sipho","designs")-0.3,0.7),p:clamp((t-w("sipho","end to end")+0.4)/2.2,0,1),plat:fin(t,w("sipho","platform")-0.3,0.7)});
    ctx.restore();
    withA(ctx,fin(t,tOn+0.2,0.5)*(1-fin(t,w("sipho","solution")-0.3,0.4)),()=>tag(ctx,1180,120,"three pieces of the social tariff",PS_RED,{align:"center",size:32}));
    withA(ctx,fin(t,w("sipho","designs")-0.3,0.5),()=>tag(ctx,1180,120,"one design, end to end, on the platform",PS_OK,{align:"center",size:32}));}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"One solution, end to end","planned before it starts, on the shared platform","Film 6 of 8 · platform and solution architecture");});

/* ---------- the utility: the social tariff's pieces, and the one line that joins them ---------- */
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility checks' hook (legible.py,
// fits.py), as the agent films' pieces.js has it
let PH_OFF=0;
function p6_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// The utility's chapters share one room: Sipho at the left, the diagram on the right. People are drawn at the film's own time, so they
// stay put where one chapter glides on from the next (the engine lays the end of one over the start of the other).
const P6_ME=[230,0.8],P6_WHO=500;
function p6_me(ctx,t,sc,a){const T_=t+(sc.start||0);psaWhole(ctx,a==null?1:a,[P6_ME[0]-230,380,P6_ME[0]+230,1080],c=>person(c,"sipho",P6_ME[0],1030,P6_ME[1],{t:T_}));
  psaWho(ctx,P6_ME[0]-10,P6_WHO,"Sipho Dlamini","solution architect",TECH,a==null?1:a);}
// a small list, three short lines: who's eligible, as each team keeps it
function p6_list(ctx,x,y,col,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{if(hi>0.01)glow(ctx,x,y,46,col,0.4*hi);ctx.save();ctx.fillStyle="rgba(10,10,16,0.95)";rr(ctx,x-22,y-26,44,52,6);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;rr(ctx,x-22,y-26,44,52,6);ctx.stroke();
  ctx.lineCap="round";[-12,0,12].forEach(yy=>{ctx.beginPath();ctx.moveTo(x-12,y+yy);ctx.lineTo(x+12,y+yy);ctx.stroke();});ctx.restore();});}
// the three pieces, as each team started its own: billing's vendor, doing it all inside billing; the data team's own table on the
// platform; IT's server for the agency's files. o.a(i) brings each in; o.red lights the two lists of who's eligible; o.q the joins
// nobody has drawn; o.back sends them back, behind what comes next
const P6_PC={bill:[560,302,470,210],tab:[1110,588,330,84],srv:[1500,302,340,150],dp:[560,680,1300,52]};
// o.vend: the "billing's vendor" chip, which leaves as the ticket comes in over billing, so it isn't read as the ticket's label
function p6_pieces(ctx,t,o){o=o||{};const A=o.a||(()=>1),bk=1-0.75*(o.back||0),red=o.red||0,P=P6_PC;
  withA(ctx,bk,()=>{
    psaPlatform(ctx,P.dp[0],P.dp[1],P.dp[2],P.dp[3],{fh:44,label:"the data platform",lsize:30,a:A(1)});
    const[bx,by,bw,bh]=P.bill;withA(ctx,A(0),()=>{psaApp(ctx,bx,by,bw,bh,"billing",{rules:["exchange, match, discount","in its October release"],t});withA(ctx,o.vend==null?1:o.vend,()=>p6_chip(ctx,bx+bw/2,by-34,"billing's vendor",{align:"center",col:APPC}));
      p6_list(ctx,bx+bw-60,by+48,mix(APPC,PS_RED,red),1,red);});
    const[tx,ty,tW,tH]=P.tab;withA(ctx,A(1),()=>{psaBlock(ctx,tx,ty,tW,tH,"eligible households",{t,drop:o.drop==null?1:o.drop});p6_chip(ctx,tx+tW/2+8,ty-48,"the data team",{align:"center",col:APPC});
      p6_list(ctx,tx+tW+52,ty+30,mix(APPC,PS_RED,red),1,red);});
    const[sx,sy,sw,sh]=P.srv;withA(ctx,A(2),()=>{psaEl(ctx,sx,sy,sw,sh,"a server for the agency's files",TECC,"node",{size:28});p6_chip(ctx,sx+sw/2,sy-34,"IT",{align:"center",col:TECC});});
    // the joins nobody has drawn
    const q=o.q||0;if(q>0.01){const J=[[[bx+bw,by+bh*0.6],[tx+40,ty-16]],[[tx+tW+20,ty+20],[sx+sw*0.4,sy+sh]],[[bx+bw,by+60],[sx,sy+60]]];
      J.forEach(([a,b],i)=>{p6_route(ctx,[a,b],PS_RED,q*0.85,clamp(q*1.4-i*0.15,0,1),{lw:2.4,dash:[8,8],head:false});p6_q(ctx,(a[0]+b[0])/2,(a[1]+b[1])/2-6,clamp(q*1.4-i*0.15-0.3,0,1));});}});}
// the one line, end to end: the agency's answer, the exchange and the answers on the platform, billing, the bill. o.p lights it along
const P6_LN=[["the agency",SOFT,"actor"],["the exchange",APPC,"component"],["the answers",APPC,"object"],["billing",APPC,"component"],["the bill",WASHI,"artifact"]],P6_LY=330;
// "the exchange" is a little wider than the rest, so every name sits on one line; the row stays centred on x 1209
const P6_LW=[230,252,230,230,230],P6_LG=34;
function p6_line(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const X=i=>555+P6_LW.slice(0,i).reduce((s,v)=>s+v+P6_LG,0),pw=P6_LW[1]+P6_LG+P6_LW[2]+110;
  withA(ctx,o.plat==null?1:o.plat,()=>{psaPlatform(ctx,X(1)-40,P6_LY+118,pw,40,{fh:36,sk:20});T(ctx,"on the data platform",X(1)-40+pw/2,P6_LY+226,{w:700,size:28,align:"center",color:rgba(mix(TECC,INK,0.35),1)});});
  P6_LN.forEach(([nm,col,k],i)=>psaEl(ctx,X(i),P6_LY,P6_LW[i],96,nm,col,k,{size:28,hi:pulseAt(t,(o.t0||0)+i*0.45,1.2)*(o.p>0?1:0)}));
  for(let i=0;i<4;i++){const q=clamp((o.p||0)*4-i,0,1);if(q>0)p6_route(ctx,[[X(i)+P6_LW[i]+4,P6_LY+48],[X(i+1)-4,P6_LY+48]],PSC,1,q,{lw:3,glow:10,head:9});}});}

/* ---------- 2. Three pieces ---------- */
const P6_DIR=["from the first of July, a discount","for every eligible household,","with no forms"];
scene("pieces",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tAg=c("agency"),tVe=c("vendor"),tTa=c("table"),tSe=c("server"),tTw=c("two"),tCa=c("careless"),tTi=c("ticket");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  // the government's direction, then the agency that knows who is eligible
  const dA=fin(t,0.3,0.6)*(1-fin(t,tVe-0.6,0.5));if(dA>0.01)arrive(ctx,960,300,t,0.3,()=>psaCard(ctx,560,190,800,"FROM THE GOVERNMENT · NOVEMBER",P6_DIR,AMBER,{a:dA,p:clamp((t-0.4)/2.6,0,1)}),{dy:-10});
  const gA=fin(t,tAg-0.3,0.6),back=fin(t,tTi-0.5,0.8);
  withA(ctx,1-0.75*back,()=>{psaEl(ctx,90,302,380,120,"the social services agency",SOFT,"actor",{a:gA,size:28,hi:pulseAt(t,w("agency","knows"),1.4)});
    withA(ctx,fin(t,w("agency","knows")-0.2,0.5),()=>p6_chip(ctx,280,458,"knows who is eligible",{align:"center",col:SOFT}));});
  // each team's piece, as each is said
  p6_pieces(ctx,t,{a:i=>[fin(t,tVe-0.2,0.6),fin(t,tTa-0.3,0.6),fin(t,tSe-0.2,0.6)][i],drop:clamp((t-tTa+0.1)/0.9,0,1),red:fin(t,w("two","two lists")-0.2,0.5)*(1-0.7*fin(t,tCa,0.8)),q:fin(t,w("two","nobody")-0.2,0.8)*(1-0.6*fin(t,tCa,0.8)),back,vend:1-fin(t,tTi-0.5,0.5)});
  // the ticket: one design, asked for by the head of retail
  // over billing, all of it, so no part of billing's words shows at its edges
  const kA=fin(t,tTi-0.3,0.6);if(kA>0.01)arrive(ctx,890,407,t,tTi-0.3,()=>{psaCard(ctx,550,298,680,"TICKET · RET-412",["One design for the social tariff,","from the agency to the bill"],BIZ,{a:kA,h:218,foot:"asked by the head of retail",footA:fin(t,w("ticket","retail")-0.1,0.5),footCol:BIZ});},{dy:-12});
  ctx.restore();
  const tags=[[0.3,tAg-0.4,"the social tariff",AMBER],[tAg-0.2,tVe-0.4,"only the agency knows who is eligible",SOFT],[tVe-0.2,tTw-0.4,"three teams, three pieces",APPC],[tTw-0.2,tCa-0.4,"two lists of who's eligible",PS_RED],[tCa-0.2,tTi-0.4,"nobody was careless",AMBER],[tTi-0.2,sc.dur,"one design, asked for in a ticket",BIZ]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("two","nobody")-0.2,0.5)*(1-fin(t,tCa-0.4,0.4)),()=>p6_chip(ctx,960,186,"and nobody has drawn how they join",{align:"center",col:PS_RED}));
  withA(ctx,fin(t,w("careless","Each team")-0.2,0.5)*(1-fin(t,tTi-0.4,0.4)),()=>p6_chip(ctx,960,186,"each team did what it could see from where it stood",{align:"center",col:AMBER}));
  vign(ctx,S);});

/* ---------- 3. Three architects ---------- */
// three architects side by side, each with what they look after; then the rule between them, and the road it echoes
const P6_ARCH=[["tomas",640,"the map: what changes, and who must agree",LAY6[0][1]],["ravi",1050,"the platform: what every solution shares, once",TECC],["sipho",P6_ME[0],"one solution, end to end",APPC]];
scene("three",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tTo=c("tomas"),tRa=c("ravi"),tSi=c("sipho"),tRu=c("rule"),tSt=c("story"),T_=t+sc.start,out=fin(t,sc.dur-1.0,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  // the ticket, still where it was, goes to Sipho and is gone; the three pieces leave behind it
  withA(ctx,0.25*(1-fin(t,0,0.8)),()=>p6_pieces(ctx,t,{vend:0}));
  // on its way, too small to read for a moment, its words are decoration on purpose (read at full size the moment before)
  const kq=easeCam(clamp((t-0.5)/1.4,0,1)),kA=1-fin(t,1.6,0.5);if(kA>0.01)p6_deco(kq>0.02,()=>{ctx.save();ctx.translate(lerp(890,300,kq),lerp(407,620,kq));ctx.scale(1-0.6*kq,1-0.6*kq);ctx.translate(-890,-407);
    psaCard(ctx,550,298,680,"TICKET · RET-412",["One design for the social tariff,","from the agency to the bill"],BIZ,{a:kA,h:218,foot:"asked by the head of retail",footCol:BIZ});ctx.restore();});
  // Sipho, then the two architects beside him
  p6_me(ctx,t,sc,fin(t,0.2,0.7));
  [[0,tTo],[1,tRa]].forEach(([i,t0])=>{const[id,x]=P6_ARCH[i],a=fin(t,t0-0.6,0.7)*(1-out);psaWhole(ctx,a,[x-230,380,x+230,1080],cx=>person(cx,id,x,1030,0.8,{t:T_}));
    psaWho(ctx,x-10,P6_WHO,PEOPLE[id].name,i?"platform lead":"enterprise architect",TECH,a);});
  // what each looks after, over their heads
  P6_ARCH.forEach(([id,x,s_,col],i)=>{const t0=[tTo,tRa,tSi][i],a=fin(t,w(["tomas","ravi","sipho"][i],i===2?"designs":i?"builds":"keeps")-0.3,0.6)*(i===2?1:1-out);
    if(a>0.01)arrive(ctx,x,360,t,t0+0.4,()=>{withA(ctx,a,()=>{const L=wrapT(ctx,s_,0,0,340,{size:28,w:700,measure:true}),h=40+L.length*36;glass(ctx,x-190,330-h/2,380,h,16,col,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.94)"});
      L.forEach((l,j)=>T(ctx,l,x,330-h/2+48+j*36,{w:700,size:28,align:"center",color:rgba(INK,0.95)}));});},{dy:-10});});
  // the rule between them: what every team could use goes into the platform; what would change the map goes to Tomás first
  const rA=fin(t,tRu-0.2,0.6)*(1-out);if(rA>0.01)withA(ctx,rA,()=>{const R=[["every team could use it",w("rule","every team"),"Ravi builds it into the platform",TECC],["it would change the map",w("rule","change the map"),"Tomás is asked first",LAY6[0][1]]];
    R.forEach(([a_,t0,b_,col],i)=>{const y=580+i*150,q=fin(t,t0-0.2,0.5);withA(ctx,q,()=>{p6_chip(ctx,1290,y,a_,{col:SOFT});p6_route(ctx,[[1290+p6_chipW(ctx,a_)/2,y+27],[1290+p6_chipW(ctx,a_)/2,y+50]],col,1,clamp((t-t0)/0.5,0,1),{lw:2.4,head:8});
      p6_chip(ctx,1290,y+76,b_,{col});});});});
  // as on the road: the shogunate kept the road, and each domain planned its own journey on it
  p6_strip(ctx,t,1290,1850,470,tSt,fin(t,tSt-0.3,0.6)*(1-out),"the road: the shogunate's","each journey: the domain's");
  ctx.restore();
  const tags=[[0.3,tTo-0.4,"the ticket goes to Sipho",APPC],[tTo-0.2,tRu-0.4,"three architects, side by side",SOFT],[tRu-0.2,tSt-0.4,"between them",SOFT],[tSt-0.2,sc.dur,"as on the Tōkaidō",PSC]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  vign(ctx,S);});

/* ---------- the utility's later chapters: elements, the strip of road, notes ---------- */
// an element drawn dashed, no glyph: what's out of scope for now; its name centred, made from its words as drawn
function p6_dashEl(ctx,x,y,w,h,name,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.72)";rr(ctx,x,y,w,h,8);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([10,8]);rr(ctx,x,y,w,h,8);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  if(name){const sz=28,ww=w-40,ls=wrapT(ctx,name,0,0,ww,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,ww,{size:sz,w:700,align:"center",color:rgba(mix(col,INK,0.4),0.95),lh:sz*1.15});}});}
// an element of the map with a glyph of this film's own in its corner: a requirement (a small parallelogram), or an event (a tag with a
// notch at its back and a point at its front; ArchiMate 4 has one event for every layer, in place of 3.2's implementation event)
function p6_mel(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,6,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.16+0.1*(o.hi||0));rr(ctx,x,y,w,h,6);ctx.fill();
  const gx=x+w-26,gy=y+24;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.lineJoin="round";ctx.beginPath();
  if(kind==="requirement"){ctx.moveTo(gx-12,gy+7);ctx.lineTo(gx-6,gy-7);ctx.lineTo(gx+12,gy-7);ctx.lineTo(gx+6,gy+7);ctx.closePath();}
  else{ctx.moveTo(gx-13,gy-7);ctx.lineTo(gx+6,gy-7);ctx.lineTo(gx+13,gy);ctx.lineTo(gx+6,gy+7);ctx.lineTo(gx-13,gy+7);ctx.lineTo(gx-7,gy);ctx.closePath();}
  ctx.stroke();ctx.restore();
  const sz=28,ww=w-70,ls=wrapT(ctx,name,0,0,ww,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2-10,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,ww,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15});});}
// a work package, as ArchiMate draws it: a rounded box with a circular arrow
function p6_work(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(14,8,16,0.95)"});ctx.fillStyle=rgba(col,0.14);rr(ctx,x,y,w,h,22);ctx.fill();
  const gx=x+w-30,gy=y+26;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(gx,gy,10,-Math.PI*0.2,Math.PI*1.45);ctx.stroke();const ax=gx+10*Math.cos(-Math.PI*0.2),ay=gy+10*Math.sin(-Math.PI*0.2);ctx.beginPath();ctx.moveTo(ax+5,ay-1);ctx.lineTo(ax-4,ay-5);ctx.lineTo(ax-1,ay+5);ctx.closePath();ctx.fill();ctx.restore();
  const sz=28,ww=w-80,ls=wrapT(ctx,name,0,0,ww,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2-12,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,ww,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15});});}
// a strip of the road, its stations lit along it and a journey's light going along it from t0; two lines of words, above and below
function p6_strip(ctx,t,x0,x1,y,t0,a,top,bottom){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=4;ctx.shadowColor=rgba(PSC,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore();
  for(let i=0;i<6;i++)psaStop(ctx,x0+20+i*(x1-x0-40)/5,y,{lit:0.6,r:7});p6_runner(ctx,[[x0,y],[x1,y]],clamp((t-t0)/3.2,0,1),APPC,{r:7,trail:0.25,hold:true});
  T(ctx,top,x0,y-34,{w:700,size:28,color:rgba(PSC,1)});T(ctx,bottom,x0,y+58,{w:700,size:28,color:rgba(APPC,1)});});}
// a notice in flight: a folded sheet, turning a little as it goes
function p6_note(ctx,x,y,an,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);glow(ctx,0,0,40,[255,236,200],0.35);ctx.fillStyle=rgba(WASHI,1);rr(ctx,-17,-12,34,24,3);ctx.fill();ctx.strokeStyle="rgba(120,96,70,0.8)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-10,-4);ctx.lineTo(10,-4);ctx.moveTo(-10,3);ctx.lineTo(6,3);ctx.stroke();ctx.restore();});}
// a home, drawn small: lit by the discount (o.lit) or not
function p6_home(ctx,x,y,s,lit,a){if(a<=0.01)return;withA(ctx,a,()=>{const col=mix(SOFT,PS_OK,lit);if(lit>0.01)glow(ctx,x,y-s*0.4,s*1.4,PS_OK,0.35*lit);ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(mix([10,14,24],PS_OK,0.25*lit),0.95);ctx.lineWidth=2.4;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x-s*0.5,y);ctx.lineTo(x-s*0.5,y-s*0.55);ctx.lineTo(x,y-s);ctx.lineTo(x+s*0.5,y-s*0.55);ctx.lineTo(x+s*0.5,y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x-s*0.1,y-s*0.3,s*0.2,s*0.3);ctx.restore();});}
// the measures, as a table at the right of the frame: each option's tick or cross under its number
const P6_TM=["security","reliability","easy to change","by the first of July"],P6_TX=1340,P6_TC=[1752,1824];
function p6_table(ctx,t,a,marks){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,P6_TX,236,520,348,18,SOFT,{glow:6,ea:0.5,fill:"rgba(7,12,24,0.9)"});
  T(ctx,"tested against",P6_TX+24,284,{w:700,size:28,color:rgba(SOFT,1)});["1","2"].forEach((s_,i)=>{glass(ctx,P6_TC[i]-22,254,44,44,22,APPC,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,s_,P6_TC[i],287,{w:800,size:28,align:"center",color:rgba(INK,1)});});
  P6_TM.forEach((s_,r)=>{const y=346+r*60+(r===3?10:0);T(ctx,s_,P6_TX+24,y+10,{w:700,size:28,color:rgba(INK,0.92)});
    marks.forEach((col,i)=>{const m=col[r];if(!m)return;const[kind,t0,q]=m;if(kind==="?"){p6_q(ctx,P6_TC[i],y-14,clamp((t-t0)/0.4,0,1)*(q==null?1:q));return;}p6_mark(ctx,kind,P6_TC[i],y,30,clamp((t-t0)/0.5,0,1));});});
  ctx.save();ctx.strokeStyle=rgba(SOFT,0.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(P6_TX+20,512);ctx.lineTo(P6_TX+500,512);ctx.stroke();ctx.restore();});}

/* ---------- 4. Everything it touches ---------- */
// The context, on one page, as C4 draws a system's context: the solution in the middle, on the data platform, and everything it touches
// around it, each joined to it by a line (into the solution, or out of it); what's out of scope for now, dashed; what's fixed, above
const P6_CX=[["the social services agency",SOFT,"actor",530,320,380,"agency",[[910,368],[1006,494]]],["the customer system",APPC,"component",1500,320,340,"customer system",[[1500,368],[1374,494]]],
  ["billing",APPC,"component",1540,496,300,"billing",[[1374,520],[1536,544]]],["the call centre",SOFT,"actor",1500,672,340,"call centre",[[1374,546],[1520,668]]],["households",SOFT,"actor",530,672,380,"households",[[1006,546],[880,668]]]];
const P6_SOL=[1010,466,360,100];
scene("context",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tAr=c("around"),tMi=c("middle"),tOu=c("out"),tFi=c("fixed"),out=fin(t,sc.dur-1.1,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  withA(ctx,1-out,()=>{const pA=fin(t,0.3,0.7);
    // the page
    withA(ctx,pA,()=>{glass(ctx,510,236,1360,610,22,SOFT,{glow:6,ea:0.35,fill:"rgba(8,12,22,0.72)"});T(ctx,"THE CONTEXT, ON ONE PAGE",536,282,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});});
    // the solution's place, then the solution itself, on the data platform
    const[sx,sy,sw,sh]=P6_SOL,sA=fin(t,tMi-0.2,0.6);p6_dashEl(ctx,sx,sy,sw,sh,"",APPC,pA*(1-sA));
    psaPlatform(ctx,990,576,400,36,{fh:24,sk:16,a:fin(t,w("middle","platform")-0.3,0.6)});
    withA(ctx,fin(t,w("middle","platform")-0.2,0.6),()=>T(ctx,"on the data platform",1190,676,{w:700,size:28,align:"center",color:rgba(mix(TECC,INK,0.35),1)}));
    psaEl(ctx,sx,sy,sw,sh,"the social tariff",APPC,"component",{a:sA,size:28,hi:pulseAt(t,tMi+0.2,1.6)});
    // everything it touches, each as it's said, joined to the solution
    P6_CX.forEach(([nm,col,kind,x,y,w_,key,J],i)=>{const t0=w("around",key)-0.2,a=fin(t,t0,0.5);if(a<=0.01)return;psaEl(ctx,x,y,w_,96,nm,col,kind,{a,size:28,hi:pulseAt(t,t0+0.2,1.2)});
      p6_route(ctx,J,mix(col,INK,0.2),0.85*a,clamp((t-t0-0.2)/0.6,0,1),{lw:2.4,head:9});});
    p6_row(ctx,720,806,[["a letter",WASHI,fin(t,w("around","letter")-0.2,0.5)],["a bill",WASHI,fin(t,w("around","a bill")-0.2,0.5)]],20);
    // out of scope, for now
    p6_dashEl(ctx,1010,712,360,96,"tenants, account in a landlord's name",SOFT,fin(t,w("out","tenants")-0.2,0.6));
  });
  ctx.restore();
  const tags=[[0.3,tMi-0.4,"everything it touches, on one page",SOFT],[tMi-0.2,tOu-0.4,"in the middle: the solution, on the data platform",APPC],[tOu-0.2,tFi-0.4,"out of scope, for now",SOFT],[tFi-0.2,sc.dur-1.1,"fixed: ready by the first of July",SOFT]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("out","route")-0.2,0.5)*(1-fin(t,tFi-0.4,0.4)),()=>p6_chip(ctx,1180,186,"their route comes later in the year",{align:"center",col:SOFT}));
  const rA=fin(t,w("fixed","rules")-0.3,0.5)*(1-fin(t,sc.dur-1.1,0.4));if(rA>0.01)withA(ctx,rA,()=>p6_row(ctx,1180,186,[["three rules, already agreed:",SOFT,1,{dash:true}],["RUL-023",SOFT,1],["RUL-024",SOFT,1],["RUL-025",SOFT,1]],16));
  vign(ctx,S);});

/* ---------- 5. Three qualities, measured ---------- */
// The nine qualities a standard lists (ISO/IEC 25010), the three Sipho picks in the last row; each of those gets a measure a design can
// be tested against, on a card under it; the one that hardly matters lights last
const P6_ISO=["functional suitability","performance efficiency","compatibility","interaction capability","flexibility","safety","security","reliability","maintainability"];
const P6_QX=[760,1200,1640],P6_QY=[262,328,394];
const P6_MEAS=[[6,"SECURITY",["only billing's job","reads the answers,","and every read","is logged"]],[7,"RELIABILITY",["every bill run has","answers: the latest,","or the last ones","if new ones are late"]],[8,"EASY TO CHANGE",["the agency changes","its file: the","exchange changes","within a week"]]];
scene("quality",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tNi=c("nine"),tSe=c("sec"),tRe=c("rel"),tCh=c("change"),tSp=c("speed"),tPk=w("nine","picks"),out=fin(t,sc.dur-1.1,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  const at=[tSe,tRe,tCh],pick=k=>P6_MEAS.findIndex(m=>m[0]===k),sp=fin(t,tSp-0.2,0.5);
  withA(ctx,1-out,()=>{
    P6_ISO.forEach((s_,k)=>{const x=P6_QX[k%3],y=P6_QY[Math.floor(k/3)],j=pick(k),a=fin(t,tNi-0.3+k*0.12,0.5);
      const dim=fin(t,tPk-0.1,0.6)*(j<0?0.62:0)*(k===1?1-sp:1),hi=j>=0?0.4*fin(t,tPk,0.6)+pulseAt(t,at[j]+0.1,1.4):(k===1?pulseAt(t,tSp+0.2,1.6):0);
      withA(ctx,a*(1-dim),()=>p6_chip(ctx,x,y,s_,{align:"center",col:j>=0?APPC:SOFT,hi}));});
    P6_MEAS.forEach(([k,kick,L],j)=>{const t0=at[j]-0.2,a=fin(t,t0,0.6);if(a>0.01)arrive(ctx,P6_QX[j],580,t,t0,()=>psaCard(ctx,P6_QX[j]-205,470,410,kick,L,APPC,{a,size:28,p:clamp((t-t0-0.2)/2.6,0,1),hi:pulseAt(t,at[j]+0.1,1.4)}),{dy:-10});});
  });
  ctx.restore();
  const tags=[[0.3,tNi-0.4,"each quality, with a measure to test against",SOFT],[tNi-0.2,tPk-0.3,"a standard lists nine",SOFT],[tPk-0.1,tSp-0.4,"the three that matter here",APPC],[tSp-0.2,sc.dur-1.1,"speed hardly matters",SOFT]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,tNi-0.1,0.5)*(1-fin(t,tPk-0.3,0.4)),()=>p6_chip(ctx,1180,186,"ISO/IEC 25010",{align:"center",col:SOFT}));
  withA(ctx,fin(t,w("speed","once a month")-0.2,0.5)*(1-fin(t,sc.dur-1.1,0.4)),()=>p6_chip(ctx,1180,186,"the match runs once a month",{align:"center",col:SOFT}));
  vign(ctx,S);});

/* ---------- 6. Two options ---------- */
// Two options, drawn in turn in the same place (the first leaves before the second comes), each tested against the same measures in the
// table at the right. Option 1 does it all inside billing. Option 2 keeps the answers on the data platform, a data product of retail's,
// and billing asks through the gateway for only what a bill needs
scene("options",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tFr=c("first"),tFa=c("fails"),tSe=c("second"),tAs=c("asks"),tHo=c("holds"),tRi=c("risk"),tSo=w("risk","So"),out=fin(t,sc.dur-1.1,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  withA(ctx,1-out,()=>{
    // the marks: [kind, when] for each measure, under each option
    const M1=[["no",w("fails","reads it")],["ok",w("first","billing")+0.6],["no",w("fails","waits")],["no",w("fails","October")]];
    const tKe=w("risk","keeps"),M2=[["ok",w("holds","logs")],t<tKe?["?",w("risk","depends")]:["ok",tKe],["ok",w("holds","pull request")],["ok",w("holds","May")]];
    p6_table(ctx,t,fin(t,0.3,0.6),[t>tFr?M1:[],t>tSe+1?M2:[]]);
    // option 1: the agency's file straight into billing, which does it all
    const o1=fin(t,tFr-0.3,0.6)*(1-fin(t,tSe-0.9,0.5));if(o1>0.01)withA(ctx,o1,()=>{psaEl(ctx,530,330,240,96,"the agency",SOFT,"actor",{size:28});
      psaArrow(ctx,776,378,836,378,APPC,1,clamp((t-tFr)/0.5,0,1),{lw:3,head:12});
      psaApp(ctx,844,290,450,184,"billing",{rules:["exchange, match","and the discount"],t,hi:pulseAt(t,w("first","billing"),1.4)});
      const F=[["logs who changes, not who reads",w("fails","reads it")],["a change waits for a release",w("fails","waits")],["ready in October",w("fails","October")]];
      F.forEach(([s_,t0],i)=>withA(ctx,fin(t,t0-0.2,0.5),()=>p6_chip(ctx,1069,548+i*60,s_,{align:"center",col:PS_RED})));});
    // option 2: the agency's answers on the data platform; billing asks through the gateway, and the bill carries the discount
    const o2=fin(t,tSe-0.3,0.6);if(o2>0.01)withA(ctx,o2,()=>{const B=(x,y,nm,col,kind,a,hi)=>psaEl(ctx,x,y,230,96,nm,col,kind,{a,size:28,hi});
      const a2=fin(t,tAs-0.3,0.6),tRet=w("second","retail's");
      psaPlatform(ctx,786,412,540,40,{fh:24,sk:16,label:"the data platform",lsize:28,a:fin(t,w("second","platform")-0.3,0.6)});
      B(520,300,"the agency",SOFT,"actor",1,0);B(800,300,"the exchange",APPC,"component",fin(t,w("second","answers")-0.4,0.5),0);B(1080,300,"the answers",APPC,"object",fin(t,w("second","answers")-0.2,0.5),pulseAt(t,tRet,1.4));
      psaArrow(ctx,756,348,794,348,APPC,1,clamp((t-w("second","answers")+0.3)/0.4,0,1),{lw:3,head:11});psaArrow(ctx,1036,348,1074,348,APPC,1,clamp((t-w("second","answers"))/0.4,0,1),{lw:3,head:11});
      withA(ctx,fin(t,tRet-0.2,0.5),()=>psaOwner(ctx,1195,268,"retail",{align:"center",hi:pulseAt(t,tRet,1.4)}));
      // billing asks the gateway, the gateway the answers, and only what a bill needs comes back
      const dep=fin(t,w("risk","depends")-0.2,0.5)*(1-fin(t,tSo,0.6));
      B(1080,552,"the gateway",TECC,"interface",a2,pulseAt(t,w("asks","integration")+0.1,1.4));B(800,552,"billing",APPC,"component",a2,pulseAt(t,tAs+0.1,1.4)+dep);B(520,552,"the bill",WASHI,"artifact",fin(t,w("asks","a bill")-0.2,0.5),0);
      psaArrow(ctx,1195,474,1195,546,mix(TECC,PS_RED,dep),a2,clamp((t-tAs-0.2)/0.5,0,1),{lw:3,head:11});psaArrow(ctx,1074,600,1036,600,mix(TECC,PS_RED,dep),a2,clamp((t-tAs-0.5)/0.4,0,1),{lw:3,head:11});psaArrow(ctx,794,600,756,600,APPC,a2,clamp((t-w("asks","a bill"))/0.4,0,1),{lw:3,head:11});
      // the question, going up and the answer coming back
      const q=clamp((t-w("asks","asks")-0.2)/1.8,0,1);if(q>0&&q<1){const P=[[1036,588],[1080,588],[1195,560],[1195,470],[1195,396]];p6_runner(ctx,q<0.5?P:P.slice().reverse(),q<0.5?q*2:q*2-1,q<0.5?APPC:PS_OK,{r:6,trail:0.12});}
      withA(ctx,fin(t,w("asks","tariff")-0.3,0.5)*(1-fin(t,tHo-0.4,0.4)),()=>p6_row(ctx,920,706,[["on the tariff?",APPC,1],["from which date?",APPC,fin(t,w("asks","which date")-0.3,0.5)]],20));
      const H=[["every read checked and logged",TECC,w("holds","logs")],["a change: a pull request",APPC,w("holds","pull request")],["ready in May",PS_OK,w("holds","May")]];
      H.forEach(([s_,col,t0],i)=>withA(ctx,fin(t,t0-0.2,0.5)*(1-fin(t,tRi-0.4,0.4)),()=>p6_chip(ctx,920,706+i*56,s_,{align:"center",col})));
      const R=[["asks the day before each run",w("risk","day before")],["and keeps what it got",tKe]];
      R.forEach(([s_,t0],i)=>withA(ctx,fin(t,t0-0.2,0.5),()=>p6_chip(ctx,920,706+i*56,s_,{align:"center",col:PS_OK})));});
  });
  ctx.restore();
  const tags=[[0.3,tFr-0.4,"two options, the same measures",SOFT],[tFr-0.2,tSe-0.9,"option 1: all inside billing",APPC],[tSe-0.2,tRi-0.4,"option 2: the answers on the data platform",APPC],[tRi-0.2,tSo-0.3,"its risk: billing depends on the platform",PS_RED],[tSo-0.1,sc.dur-1.1,"its risk, handled",PS_OK]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("first","vendor")-0.2,0.5)*(1-fin(t,tSe-0.9,0.4)),()=>p6_chip(ctx,1180,186,"as the vendor offered",{align:"center",col:APPC}));
  withA(ctx,fin(t,w("second","retail's")-0.2,0.5)*(1-fin(t,tAs-0.4,0.4)),()=>p6_chip(ctx,1180,186,"a data product of retail's",{align:"center",col:BIZ}));
  withA(ctx,fin(t,tAs-0.1,0.5)*(1-fin(t,tRi-0.4,0.4)),()=>p6_chip(ctx,1180,186,"billing asks for only what a bill needs",{align:"center",col:APPC}));
  vign(ctx,S);});

/* ---------- 7. Why, written down ---------- */
// The decision record, kept with the solution's code, typed in row by row as each is said; Ama's check against two principles; who
// agreed, and its status. A year on, the why is still there
const P6_ADR=[["Decided","the answers on the platform, the discount in billing","decided","Decided"],["Considered","all of it in billing","decided","Considered"],
  ["Why","every read logged, a change in days, ready by May","why","Why"],["Consequence","billing asks the day before each run","why","consequence"]];
function p6_type(s,t,t0,d){const n=Math.round(clamp((t-t0)/(d||1.4),0,1)*s.length);return s.slice(0,n);}
scene("record",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tCk=c("check"),tAg=c("agreed"),tLa=c("later"),tBo=w("check","Both hold"),out=fin(t,sc.dur-1.1,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  withA(ctx,1-out,()=>{const cA=fin(t,0.3,0.6);if(cA<=0.01)return;
    arrive(ctx,1200,500,t,0.3,()=>withA(ctx,cA,()=>{glass(ctx,540,226,1320,566,18,APPC,{glow:12,ea:0.8,fill:"rgba(6,10,20,0.95)"});
      T(ctx,"SOCIAL TARIFF · DECISION 1",566,272,{f:"mono",w:500,size:28,color:rgba(APPC,1)});
      withA(ctx,fin(t,w("writes","code")-0.2,0.5),()=>p6_chip(ctx,1836,262,"kept with the solution's code",{align:"right",col:APPC,dash:true}));
      // a year on, the why: lit behind what was considered and why
      const yA=fin(t,tLa-0.2,0.7);if(yA>0.01)withA(ctx,yA,()=>{ctx.fillStyle=rgba(PSC,0.1);rr(ctx,556,362,1288,108,10);ctx.fill();ctx.strokeStyle=rgba(PSC,0.6);ctx.lineWidth=2;rr(ctx,556,362,1288,108,10);ctx.stroke();});
      P6_ADR.forEach(([lab,val,id,word],i)=>{const t0=w(id,word)-0.1,y=340+i*52;if(t<t0-0.2)return;withA(ctx,fin(t,t0-0.2,0.4),()=>{T(ctx,lab,566,y,{w:600,size:28,color:rgba(SOFT,1)});T(ctx,p6_type(val,t,t0+0.2,1.6),790,y,{w:700,size:28,color:rgba(INK,0.95)});});});
      // the principles Ama checks it against, each ticked once both hold
      const pA=fin(t,w("check","principles")-0.2,0.5);if(pA>0.01)withA(ctx,pA,()=>{T(ctx,"Principles",566,556,{w:600,size:28,color:rgba(SOFT,1)});
        [["use what we have before we build","use what"],["customer information stays with the business that collected it","customer information"]].forEach(([s_,word],i)=>{const t0=w("check",word)-0.1,y=556+i*52;if(t<t0-0.2)return;
          withA(ctx,fin(t,t0-0.2,0.4),()=>T(ctx,p6_type(s_,t,t0+0.1,1.6),830,y,{w:700,size:28,color:rgba(INK,0.95)}));p6_mark(ctx,"ok",806,y-10,28,clamp((t-tBo-i*0.25)/0.5,0,1));});
        withA(ctx,fin(t,w("check","Ama")-0.2,0.5),()=>psaOwner(ctx,1836,548,"Ama Owusu",{align:"right",hi:pulseAt(t,tBo,1.4)}));});
      // who agreed, and its status
      const gA=fin(t,tAg-0.2,0.5);if(gA>0.01)withA(ctx,gA,()=>{T(ctx,"Agreed",566,672,{w:600,size:28,color:rgba(SOFT,1)});let x=790;
        [["Sipho","Sipho",TECH],["Ravi","Ravi",TECH],["the head of retail","head of retail",BIZ]].forEach(([s_,word,col])=>{const t0=w("agreed",word)-0.1;x+=16+p6_chip(ctx,x,664,s_,{col,mark:"ok",mp:clamp((t-t0)/0.5,0,1),a:fin(t,t0-0.2,0.4)});});});
      const stA=fin(t,w("agreed","accepted")-0.2,0.5);if(stA>0.01)withA(ctx,stA,()=>{T(ctx,"Status",566,740,{w:600,size:28,color:rgba(SOFT,1)});p6_chip(ctx,790,732,"accepted",{col:PS_OK,hi:pulseAt(t,w("agreed","accepted")+0.1,1.4)});});
    }),{dy:-10});
  });
  ctx.restore();
  const tags=[[0.3,tCk-0.4,"the decision, written down with why",APPC],[tCk-0.2,tAg-0.4,"checked against the principles",BIZ],[tAg-0.2,tLa-0.4,"agreed, and accepted",PS_OK],[tLa-0.2,sc.dur-1.1,"a year on: why doesn't billing do it all?",SOFT]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("later","answer")-0.2,0.5)*(1-fin(t,sc.dur-1.1,0.4)),()=>p6_chip(ctx,1180,186,"the answer is here",{align:"center",col:PSC}));
  vign(ctx,S);});

/* ---------- 8. Most of it is already there ---------- */
// Ten parts: six already there, four new, each as it's said. The one every team will need, sending a file out, said last and listed
// last, so nothing is in its way, goes down into the platform, built once; the regulator's reports use it next. Then, as on the Tōkaidō: the stations were already there; only the journey was new
const P6_OLD=[["retail's customer accounts",APPC,"customer accounts"],["a job from the platform's template",TECC,"template"],["the platform's connectors",TECC,"connectors"],["the catalogue's masks and log",TECC,"masks"],["the gateway",TECC,"gateway"],["monitoring",TECC,"monitoring"]];
const P6_NEW=[["the match and its answers",APPC,"match"],["a discount step in billing",APPC,"discount"],["the letter",APPC,"letter"],["sending a file out",TECC,"sending"]];
scene("reuse",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tSi=c("six"),tFo=c("four"),tOu=c("out"),tSt=c("story"),tRa=w("out","Ravi"),out=fin(t,sc.dur-1.1,0.8),lv=fin(t,tSt-0.7,0.6);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  withA(ctx,(1-lv)*(1-out),()=>{
    // the ten parts, counted: an outline for each, one after the other, as Sipho counts them; the first six fill as the six already
    // there, the last four turn dashed
    {const n=fin(t,w("count","counts")-0.2,0.5)*(1-fin(t,w("out","Every team")-0.7,0.4)),six=fin(t,w("count","six")-0.2,0.5),X0=1180-(10*34+9*12)/2;
      if(n>0.01)for(let i=0;i<10;i++){const x=X0+i*46,a=n*fin(t,w("count","counts")-0.2+i*0.1,0.3);if(a<=0.01)continue;withA(ctx,a,()=>{
        ctx.save();ctx.strokeStyle=rgba(SOFT,0.7*(1-six));ctx.lineWidth=2.2;rr(ctx,x,169,34,34,7);ctx.stroke();
        if(i<6)withA(ctx,six,()=>glass(ctx,x,169,34,34,7,PSC,{glow:10,ea:0.8,fill:rgba(PSC,0.32)}));
        else{ctx.strokeStyle=rgba(APPC,0.9*six);ctx.setLineDash([6,5]);rr(ctx,x,169,34,34,7);ctx.stroke();ctx.setLineDash([]);}
        ctx.restore();});}}
    withA(ctx,fin(t,w("count","six")-0.3,0.5),()=>p6_chip(ctx,540,262,"six already there",{col:PSC,hi:pulseAt(t,w("count","six"),1.4)}));
    withA(ctx,fin(t,tFo-0.2,0.5),()=>p6_chip(ctx,1240,262,"four new",{col:APPC,dash:true,hi:pulseAt(t,tFo+0.1,1.4)}));
    P6_OLD.forEach(([s_,col,word],i)=>{const t0=w("six",word)-0.2;withA(ctx,fin(t,t0,0.5),()=>p6_chip(ctx,540,334+i*62,s_,{col,hi:pulseAt(t,t0+0.2,1.0)}));});
    // the new ones; sending a file out goes down into the platform as Ravi builds it, once
    const mv=easeCam(clamp((t-tRa+0.1)/1.4,0,1)),sA=fin(t,w("out","Every team")-0.2,0.6);
    psaPlatform(ctx,1220,762,620,40,{fh:24,sk:18,label:"the data platform",lsize:28,lalign:"right",a:sA,hi:pulseAt(t,w("out","platform")+0.2,1.4)});
    P6_NEW.forEach(([s_,col,word],i)=>{if(i===3)return;const t0=w("four",word)-0.2;p6_chip(ctx,1240,334+i*62,s_,{col,dash:true,a:fin(t,t0,0.5),hi:pulseAt(t,t0+0.2,1.0)});});
    {const[s_,col,word]=P6_NEW[3],t0=w("four",word)-0.2,a=fin(t,t0,0.5),x=lerp(1240,1250,mv),y=lerp(520,728,mv),hi=pulseAt(t,t0+0.2,1.0)+pulseAt(t,w("out","Every team"),1.6);
      if(a>0.01){p6_chip(ctx,x,y,s_,{col,dash:true,a:a*(1-mv),hi});p6_chip(ctx,x,y,s_,{col,a:a*mv,hi});}}
    // the regulator's reports, next to use it
    const rA=fin(t,w("out","regulator's")-0.2,0.5);if(rA>0.01){p6_chip(ctx,1460,640,"the regulator's reports",{col:APPC,dash:true,a:rA});p6_route(ctx,[[1640,664],[1640,690],[1520,690],[1520,702]],TECC,rA,clamp((t-w("out","use it")+0.2)/0.6,0,1),{lw:2.6,head:9});}
  });
  // as on the Tōkaidō
  p6_strip(ctx,t,700,1700,470,tSt+0.6,fin(t,tSt-0.2,0.6)*(1-out),"the stations: already there","the journey: new");
  ctx.restore();
  const tags=[[0.3,tFo-0.4,"of ten parts, six already exist",PSC],[tFo-0.2,tOu-0.4,"four are new",APPC],[tOu-0.2,tSt-0.4,"built once, into the platform",TECC],[tSt-0.2,sc.dur-1.1,"as on the Tōkaidō",PSC]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("out","Every team")-0.2,0.5)*(1-fin(t,w("out","regulator's")-0.4,0.4)),()=>p6_chip(ctx,1180,186,"every team will need to send files out",{align:"center",col:TECC}));
  withA(ctx,fin(t,w("out","regulator's")-0.2,0.5)*(1-fin(t,tSt-0.4,0.4)),()=>p6_chip(ctx,1180,186,"the regulator's reports use it next",{align:"center",col:APPC}));
  vign(ctx,S);});

/* ---------- 9. Told ahead ---------- */
// The design, and a notice from it to each team, months ahead, as each is said; the vendor's April release; then, as a notice went ahead
// to every station, the teams light one after the other
const P6_TEAMS=[["THE PLATFORM TEAM",["sending a file out"],TECC,"platform team"],["YASMIN'S INTEGRATION TEAM",["billing's route through the gateway"],TECC,"integration"],["RETAIL",["the letter, the call centre's answer"],BIZ,"retail"],["BILLING'S VENDOR",["a discount step in billing"],APPC,"vendor"]];
scene("told",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tAp=c("april"),tSt=c("story"),out=fin(t,sc.dur-1.1,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  withA(ctx,1-out,()=>{
    arrive(ctx,740,470,t,0.3,()=>psaCard(ctx,540,400,400,"THE DESIGN",["the social tariff,","end to end"],APPC,{a:fin(t,0.3,0.6),size:28}),{dy:-10});
    // the road the notices take, down the teams: lit as the story's notice runs down it
    const rA=fin(t,tSt-0.3,0.6);if(rA>0.01)withA(ctx,rA,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.8);ctx.lineWidth=3;ctx.shadowColor=rgba(PSC,0.6);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(1140,250);ctx.lineTo(1140,720);ctx.stroke();ctx.restore();
      p6_runner(ctx,[[1140,250],[1140,720]],clamp((t-tSt-0.2)/3.0,0,1),[255,236,200],{r:7,trail:0.12});});
    P6_TEAMS.forEach(([kick,L,col,word],i)=>{const t0=w("each",word)-0.6,y=232+i*130,a=fin(t,t0+0.5,0.5),cy=y+52;
      // the notice, from the design to the team
      const u=clamp((t-t0)/0.9,0,1);if(u>0&&u<1){const e=easeCam(u),x=lerp(944,1176,e),yy=lerp(470,cy,e)-Math.sin(e*Math.PI)*60;p6_note(ctx,x,yy,(1-e)*0.3-0.1,1);}
      const st=pulseAt(t,tSt+0.2+i*0.75,1.2);if(st>0.01)psaStop(ctx,1140,cy,{lit:st,r:8});
      if(a>0.01)arrive(ctx,1520,cy,t,t0+0.5,()=>psaCard(ctx,1180,y,680,kick,L,col,{a,size:28,hi:pulseAt(t,t0+0.9,1.2)+st,foot:i===3?"in its April release":null,footA:fin(t,tAp-0.2,0.5),footCol:PS_OK,footTick:i===3?clamp((t-w("april","April"))/0.5,0,1):0}),{dy:-10});});
  });
  ctx.restore();
  const tags=[[0.3,tSt-0.4,"each team hears its part, months ahead",SOFT],[tSt-0.2,sc.dur-1.1,"as a notice went ahead to every station",PSC]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("story","knows")-0.2,0.5)*(1-fin(t,sc.dur-1.1,0.4)),()=>p6_chip(ctx,1180,186,"each team knows what's coming, and when",{align:"center",col:PS_OK}));
  vign(ctx,S);});

/* ---------- 10. The first of July ---------- */
// A line of months, May to September, and a light that goes along it: built, tested; the first bills, with the discount, and the homes
// that get it; September's late answers; the log, with one reader; the ticket, checked and closed
const P6_MO=["May","June","July","August","September"],P6_MX=i=>620+i*260,P6_MY=286;
function p6_bill(ctx,x,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,420,250,14,WASHI,{glow:10,ea:0.7,fill:"rgba(12,12,14,0.95)"});T(ctx,"BILL · JULY",x+24,y+42,{f:"mono",w:500,size:28,color:rgba(WASHI,1)});
  [["energy used",INK],["standing charge",INK],["social tariff discount",PS_OK],["amount due",INK]].forEach(([s_,col],i)=>{const yy=y+90+i*42;if(i===2&&hi>0.01){ctx.fillStyle=rgba(PS_OK,0.14*hi);rr(ctx,x+14,yy-30,392,40,8);ctx.fill();}T(ctx,s_,x+24,yy,{w:700,size:28,color:rgba(col,0.95)});});});}
scene("july",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tBi=c("bills"),tLa=c("late"),tLo=c("log"),tCl=c("closed"),tAu=w("late","Billing"),out=fin(t,sc.dur-1.1,0.8);ctx.save();drift(ctx,t,sc,{z:0.01,y:480});
  p6_me(ctx,t,sc,1);
  withA(ctx,1-out,()=>{const lA=fin(t,0.3,0.6);
    // the months, and the light going along them
    withA(ctx,lA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(560,P6_MY);ctx.lineTo(1830,P6_MY);ctx.stroke();ctx.restore();
      P6_MO.forEach((m,i)=>{psaStop(ctx,P6_MX(i),P6_MY,{lit:0.3,r:6});T(ctx,m,P6_MX(i),P6_MY+46,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});});
    const K=[[0.6,P6_MX(0)],[w("built","June"),P6_MX(1)],[tBi,P6_MX(2)],[tLa-0.6,P6_MX(3)],[tLa+0.4,P6_MX(4)]];let rx=K[0][1];for(let i=1;i<K.length;i++){const u=easeCam(clamp((t-K[i][0]+0.8)/1.2,0,1));rx=lerp(rx,K[i][1],u);}
    if(lA>0.01)withA(ctx,lA,()=>{glow(ctx,rx,P6_MY,44,APPC,0.5);ctx.fillStyle=rgba(mix(APPC,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(rx,P6_MY,8,0,TAU);ctx.fill();});
    [["built",0,w("built","built"),PS_OK,"ok"],["tested with a sample",1,w("built","tested"),PS_OK,"ok"],["two days late",4,tLa+0.4,PS_RED,null]].forEach(([s_,i,t0,col,mark])=>
      withA(ctx,fin(t,t0-0.1,0.5),()=>p6_chip(ctx,P6_MX(i)+(i===1?20:0),226,s_,{align:"center",col,mark,mp:clamp((t-t0-0.1)/0.5,0,1)})));
    withA(ctx,fin(t,tAu-0.2,0.5),()=>p6_chip(ctx,P6_MX(4),376,"August's answers used",{align:"center",col:PSC}));
    // the first bills, with the discount, and the homes that get it: about nine in ten
    const bA=fin(t,tBi-0.2,0.6);if(bA>0.01)arrive(ctx,750,505,t,tBi-0.2,()=>p6_bill(ctx,540,380,bA,pulseAt(t,w("bills","discount")+0.1,1.6)+0.5),{dy:-10});
    const hA=fin(t,w("bills","nine")-0.4,0.5);if(hA>0.01)for(let i=0;i<10;i++)p6_home(ctx,566+i*41,706,34,i<9?clamp((t-w("bills","nine")-i*0.08)/0.4,0,1):0,hA);
    // the log: one reader of the answers
    const gA=fin(t,tLo-0.2,0.6);if(gA>0.01){arrive(ctx,1200,508,t,tLo-0.2,()=>psaCard(ctx,990,420,420,"WHO READ THE ANSWERS",["billing's discount job","billing's discount job","billing's discount job"],TECC,{a:gA,size:28,p:clamp((t-tLo)/1.6,0,1)}),{dy:-10});
      withA(ctx,fin(t,w("log","one reader")-0.2,0.5),()=>p6_chip(ctx,1200,640,"one reader",{align:"center",col:PS_OK,mark:"ok",mp:clamp((t-w("log","one reader"))/0.5,0,1)}));}
    // the ticket, checked and closed by the head of retail
    const kA=fin(t,tCl-0.2,0.6);if(kA>0.01)arrive(ctx,1650,616,t,tCl-0.2,()=>psaCard(ctx,1440,520,420,"TICKET · RET-412",["One design for","the social tariff"],BIZ,{a:kA,size:28,foot:"checked, and closed",footA:fin(t,w("closed","closes")-0.2,0.5),footCol:PS_OK,footTick:clamp((t-w("closed","closes"))/0.5,0,1)}),{dy:-10});
  });
  ctx.restore();
  const tags=[[0.3,tBi-0.4,"built by May, tested in June",PS_OK],[tBi-0.2,tLa-0.4,"the first of July: the first bills carry the discount",PS_OK],[tLa-0.2,tAu-0.3,"September: the answers come two days late",PS_RED],[tAu-0.1,tLo-0.4,"billing uses August's; the next bills catch up",PS_OK],[tLo-0.2,tCl-0.4,"the log: one reader of the answers",TECC],[tCl-0.2,sc.dur-1.1,"the head of retail checks the first bills",BIZ]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,1180,120,s_,col,{align:"center",size:32})));
  withA(ctx,fin(t,w("bills","nine")-0.2,0.5)*(1-fin(t,tLa-0.4,0.4)),()=>p6_chip(ctx,1180,186,"about nine in ten eligible households",{align:"center",col:PS_OK}));
  vign(ctx,S);});

/* ---------- 11. The data practice on the map ---------- */
// The solution on Tomás's map: its new parts in the application layer, beside billing; under them, the platform's services, reused, and
// one new one; a work package that builds the new parts, by the first of July; and each quality a requirement, realised by the parts that
// meet it
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p6_room(ctx,S,t);
  const tAp=c("app"),tTe=c("tech"),tWo=c("work"),tRq=c("req");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const MOT=LAY6[0][1],MIG=[248,184,226];
  psaBand(ctx,30,130,"motivation",MOT,fin(t,0.2,0.8));psaBand(ctx,176,224,"application layer",APPC,fin(t,0.3,0.8));psaBand(ctx,416,280,"technology layer",TECC,fin(t,0.5,0.8));psaBand(ctx,712,128,"implementation and migration",MIG,fin(t,0.7,0.8));
  // the application layer: billing, and the solution's new parts beside it
  const AX=[340,640,940,1240,1540],AP=[["the exchange",APPC,"component",1],["the answers",APPC,"object",1],["billing",APPC,"component",0],["discount step",APPC,"function",1],["the letter",APPC,"component",1]];
  AP.forEach(([nm,col,kind,nw],i)=>{const a=nw?fin(t,w("app","new parts")-0.3+i*0.12,0.5):fin(t,w("app","billing")-0.3,0.5);psaEl(ctx,AX[i],242,270,96,nm,nw?col:mix(col,SOFT,0.5),kind,{a:a*(nw?1:0.75),size:28,hi:nw?pulseAt(t,w("app","new parts")+0.2,1.4)+pulseAt(t,w("work","new parts")+0.2,1.4):0});});
  // the technology layer: the data platform's services, reused, and the new one; the integration platform's gateway
  const node=(x,w_,name,a)=>{psaEl(ctx,x,468,w_,214,"",TECC,"node",{a});withA(ctx,a,()=>T(ctx,name,x+w_-48,664,{w:800,size:30,align:"right",color:rgba(INK,0.95)}));};
  node(340,1080,"the data platform",fin(t,tTe-0.3,0.6));node(1460,380,"integration platform",fin(t,tTe-0.1,0.6));
  const SV=[["sending a file out",370,540,310],["a job template",700,540,250],["masks and log",970,540,250],["connectors",370,614,210],["monitoring",600,614,230]];
  SV.forEach(([nm,x,y,w_],i)=>{const nw=i===0,a=nw?fin(t,w("tech","sending")-0.2,0.5):fin(t,w("tech","reused")-0.4+i*0.1,0.5);if(nw&&a>0.01){glow(ctx,x+w_/2,y+28,140,PSC,0.25*a);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=2.4;ctx.setLineDash([8,6]);rr(ctx,x-8,y-8,w_+16,72,36);ctx.stroke();ctx.setLineDash([]);ctx.restore();});}psaEl(ctx,x,y,w_,56,nm,TECC,"service",{a,size:28,hi:nw?pulseAt(t,w("tech","sending")+0.1,1.6):0});});
  psaEl(ctx,1490,520,320,60,"the gateway",TECC,"service",{a:fin(t,w("tech","services")-0.2,0.5),size:28});
  // what serves what: sending a file out and the template serve the exchange; the masks and log, the answers; the gateway, billing
  const sv=t-w("tech","services")-0.6;[[525,532,475,338],[825,540,570,338],[1095,540,800,338],[1560,520,1190,338]].forEach(([x0,y0,x1,y1],i)=>psaRel(ctx,x0,y0,x1,y1,"serve",TECC,fin(t,w("tech","services")+0.2,0.4)*0.9,clamp((sv-i*0.15)/0.6,0,1)));
  // the work package that builds the new parts, ending on the first of July
  p6_work(ctx,560,736,560,84,"build the social tariff's new parts",MIG,{a:fin(t,tWo-0.2,0.6),hi:pulseAt(t,w("work","work package"),1.4)});
  withA(ctx,fin(t,w("work","July")-0.4,0.5),()=>{psaArrow(ctx,1124,778,1186,778,MIG,1,clamp((t-w("work","July")+0.2)/0.5,0,1),{lw:2.6,head:12});p6_mel(ctx,1192,736,470,84,"ready: the first of July",MIG,"event",{hi:pulseAt(t,w("work","July")+0.2,1.4)});});
  // each quality a requirement, realised by the parts that meet it
  const RQ=[["a change within a week",280,[475,242],[500,140]],["every read logged",820,[775,242],[1000,140]],["answers for every bill run",1360,[1375,242],[1520,140]]];
  RQ.forEach(([nm,x,A,Bq],i)=>{const t0=w("req","requirement")-0.3+i*0.2;p6_mel(ctx,x,44,500,96,nm,MOT,"requirement",{a:fin(t,t0,0.5),hi:pulseAt(t,t0+0.3,1.2)});
    const r0=w("req","realised")-0.2+i*0.2;psaRel(ctx,A[0],A[1],Bq[0],Bq[1],"realise",MOT,fin(t,r0,0.4),clamp((t-r0)/0.6,0,1));});
  ctx.restore();
  const tags=[[0.3,tAp-0.4,"the solution, on Tomás's map",SOFT],[tAp-0.2,tTe-0.4,"its new parts, beside billing",APPC],[tTe-0.2,tWo-0.4,"the platform's services, reused, and one new",TECC],[tWo-0.2,tRq-0.4,"a work package, by the first of July",MIG],[tRq-0.2,sc.dur,"each quality, a requirement",MOT]];
  tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,866,s_,col,{align:"center",size:28})));
  vign(ctx,S);});

/* ---------- 12. Each journey, planned ---------- */
// The road at dusk: the station that serves every traveller, the board up at its inn, a courier gone ahead and the lord's procession
// passing, its loads carried; then the utility: the one line from the agency's answer to the bill, lit end to end, and what made it
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("data"),tM=c("most"),tN=c("next"),outA=1-fin(t,B+0.6,0.8),rA=(1-fin(t,tD-0.6,0.9))*outA,uA=fin(t,tD-0.6,0.9)*outA;if(outA<1)p6_base(ctx,S);
  psaRooms(ctx,[[rA,ctx=>{p6_road(ctx,S,t,{d:1});ctx.save();drift(ctx,t,{dur:tD+1},{z:0.02,y:660,x:1000});
    psaStation(ctx,1180,P6_Y0+2,1.0,{lit:1});p6_board(ctx,840,P6_G-6,1.0,1,{lit:1,hi:pulseAt(t,w("road","journey")+0.2,1.6)});
    [["porter",470,0.8],["porter",555,0.3],["horse",680,0.6]].forEach(([k,x,ph])=>{if(k==="horse")psaHorse(ctx,x,P6_G-10,0.66,t,{dir:-1,still:true,pack:true,ph});else psaWalker(ctx,x,P6_G-10,0.86,t,{kind:k,dir:-1,still:true,ph});});
    // the courier, gone ahead, and the procession, from the right
    psaWalker(ctx,700-t*psaPace("walker",0.9,0.9),P6_G+30,0.9,t,{kind:"courier",dir:-1,ph:0.2,rate:0.9});
    const s=0.86,v=psaPace("walker",s,0.55);p6_proc(ctx,1500-t*v,P6_G+14,s,t,{rate:0.55});
    ctx.restore();
    withA(ctx,fin(t,0.6,0.6)*(1-fin(t,w("road","Each lord's")-0.3,0.4)),()=>tag(ctx,960,120,"the stations served every traveller",PSC,{align:"center",size:32}));
    withA(ctx,fin(t,w("road","Each lord's")-0.1,0.6),()=>tag(ctx,960,120,"each journey: the domain's own plan, sent ahead",PS_OK,{align:"center",size:32}));
    eaYear(ctx,80,80,"on the Tōkaidō",CLAY,fin(t,0.4,0.6));}],
  [uA,ctx=>{p6_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:24},{z:0.012,y:500,x:1100});
    person(ctx,"sipho",P6_ME[0],1030,P6_ME[1],{t:t+sc.start});psaWho(ctx,P6_ME[0]-10,P6_WHO,"Sipho Dlamini","solution architect",TECH,1);
    p6_line(ctx,t,{a:1,p:clamp((t-tD+0.2)/2.2,0,1),plat:1,t0:tD});
    p6_row(ctx,1210,650,[["its context",SOFT,fin(t,w("data","context")-0.2,0.5)],["its qualities",APPC,fin(t,w("data","qualities")-0.2,0.5)],["its options",APPC,fin(t,w("data","options")-0.2,0.5)],["and why, written down",APPC,fin(t,w("data","why")-0.2,0.5)]],18);
    withA(ctx,fin(t,tM-0.2,0.6)*(1-fin(t,tN-0.5,0.4)),()=>p6_row(ctx,1210,730,[["most of it already there",PSC,1],["what's new, every team hears ahead",PS_OK,fin(t,w("most","new")-0.3,0.5)]],20));
    ctx.restore();
    withA(ctx,fin(t,tD-0.3,0.6),()=>tag(ctx,1180,120,"each solution, planned end to end",APPC,{align:"center",size:32}));
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,1210,800,"Next: A road people choose",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"One solution, end to end","Each solution planned end to end, on the platform everyone shares.","film 6 of 8");});

/* where the chapters meet: the utility's chapters glide on from one to the next in one room (From words to data's joins.js); what
   stays stays put, and whoever comes or goes does so after the join */
const CHAPTER_JOINS={glide:["three","context","quality","options","record","reuse","told","july"]};
