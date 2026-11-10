/* ===== No secret to lose: the film's own pictures, on the module's kit =====
   The places of 1990 are in ns_city.js (the City's streets, the City from above, the bearer papers) and ns_bank.js (the Bank's wall, its
   vault, a back office's screen); the ladders are in ns_ladder.js. Here: the places, as the kit paints them once (AG_PLACES); the hall
   with the university's data platform, a tall block of clear glass with one lit door; the nightly job's badge and the sealed card
   clipped to it; and the small things the chapters show (a clock, a note with a seal, a pass, a vault, a key, a phone, a fake page).
   Colours mean what the module says they mean: cyan an identity, green allowed, coral denied or closed, violet a secret; gold is only a
   badge's chip. A secret is only ever a sealed card (dp_sealed), never a character of it. Every word is drawn with dp_T, at least
   28 px as seen. */

const NS_TITLE="No secret to lose",NS_LINE="FILM 2 OF 9 · LOCKS BEFORE THE DATA";
const NS_ICE=[214,232,234];   // a label with no meaning of its own ("Pay the bearer"): ice, not a meaning's colour
DP_PEOPLE.push("sam","jun","mei");

/* ---------------------------------------------------------------- the places, painted once */
AG_PLACES.nsStreet=c=>ns_paintStreet(c,W,H,{});
AG_PLACES.nsQuiet=c=>ns_paintStreet(c,W,H,{quiet:true});
AG_PLACES.nsMap=c=>ns_paintMap(c,W,H);
AG_PLACES.nsFront=c=>ns_paintBankFront(c,W,H);
AG_PLACES.nsVault=c=>ns_paintVault(c,W,H);
AG_PLACES.nsOffice=c=>ns_paintOffice(c,W,H);
// the hall with the platform: Sam's pool of light at the left, Jun's at the right, the platform's door lighting the floor
AG_PLACES.nsHall=c=>dp_paintHall(c,{seed:23,horizon:690,vx:1040,panes:8,pools:[[300,980,520,0.12],[1700,960,480,0.08],[NS_DOOR.x+NS_DOOR.w/2,NS_DOOR.y+NS_DOOR.h+30,330,0.10]],after:ns_paintPlatform});
// the ladders' rooms: the workload ladder's, and the people's, in the same hall seen from elsewhere
AG_PLACES.nsLadder=c=>dp_paintHall(c,{seed:41,horizon:720,vx:760,panes:7,lights:16,pools:[[440,960,560,0.09],[1340,900,700,0.06]]});
AG_PLACES.nsPeople=c=>dp_paintHall(c,{seed:59,horizon:700,vx:1240,panes:7,lights:16,pools:[[420,960,560,0.10],[1360,900,700,0.06]]});

/* ---------------------------------------------------------------- the university's data platform
   A tall block of clear glass (what is inside may be seen), lit from within by rows of soft light, with one lit door at its foot.
   Painted into the hall once; its door's light and what passes through it are drawn live (ns_door). */
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the phone check's hook, as From words
// to data's legible.py names it (a card turned edge-on)
let PH_OFF=0;
const NS_PLAT={x:1290,y:96,w:430,h:766},NS_DOOR={x:1435,y:654,w:140,h:208};
function ns_paintPlatform(c){const P=NS_PLAT,D=NS_DOOR,ice=DP.ice,cy=DP.F.cyan,yb=P.y+P.h;
  // its glow on the hall, and the floor's gloss under it
  let g=c.createRadialGradient(P.x+P.w/2,P.y+P.h*0.55,40,P.x+P.w/2,P.y+P.h*0.55,P.w*1.25);g.addColorStop(0,rgba(cy,0.09));g.addColorStop(1,rgba(cy,0));c.fillStyle=g;c.fillRect(P.x-P.w,P.y-80,P.w*3,P.h+200);
  // the glass: dark, clear, the hall's lights seen softly through it
  c.save();rr(c,P.x,P.y,P.w,P.h,10);c.clip();
  g=c.createLinearGradient(P.x,0,P.x+P.w,0);g.addColorStop(0,"rgba(16,46,52,0.62)");g.addColorStop(0.5,"rgba(10,32,38,0.5)");g.addColorStop(1,"rgba(18,50,56,0.66)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  // rows of soft light inside, floor by floor: what the platform holds, seen through clear glass
  const R=ag_rnd(311);for(let f=0;f<11;f++){const yy=P.y+44+f*58;if(yy>D.y-30)break;for(let k=0;k<6;k++){const x0=P.x+26+k*66+R()*8,on=R();
    c.fillStyle=rgba(on<0.18?[150,200,255]:cy,0.10+0.16*R());rr(c,x0,yy,48,10,5);c.fill();}}
  // mullions: the block's panes, and a sheen across them
  c.strokeStyle="rgba(190,245,245,0.10)";c.lineWidth=1.4;for(let k=1;k<4;k++){c.beginPath();c.moveTo(P.x+k*P.w/4,P.y);c.lineTo(P.x+k*P.w/4,yb);c.stroke();}
  for(let f=1;f<4;f++){c.beginPath();c.moveTo(P.x,P.y+f*P.h/4);c.lineTo(P.x+P.w,P.y+f*P.h/4);c.stroke();}
  g=c.createLinearGradient(P.x,P.y,P.x+P.w,P.y+P.h);g.addColorStop(0,"rgba(220,250,250,0.10)");g.addColorStop(0.3,"rgba(220,250,250,0.02)");g.addColorStop(0.42,"rgba(220,250,250,0.08)");g.addColorStop(0.55,"rgba(220,250,250,0)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  c.restore();
  // its edges catch the light
  c.save();c.shadowColor=rgba(ice,0.8);c.shadowBlur=12;c.strokeStyle=rgba(ice,0.75);c.lineWidth=2.2;rr(c,P.x+1,P.y+1,P.w-2,P.h-2,10);c.stroke();c.restore();
  c.fillStyle=rgba(ice,0.5);c.fillRect(P.x+12,P.y+1,P.w-24,2);
  // the door: a recess of light
  c.save();rr(c,D.x,D.y,D.w,D.h,8);c.clip();g=c.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"rgba(150,232,242,0.30)");g.addColorStop(1,"rgba(200,250,250,0.55)");c.fillStyle=g;c.fillRect(D.x,D.y,D.w,D.h);c.restore();
  c.strokeStyle=rgba(cy,0.9);c.lineWidth=2.4;rr(c,D.x,D.y,D.w,D.h,8);c.stroke();
  // the light it throws on the floor, and the block's reflection
  g=c.createRadialGradient(D.x+D.w/2,yb+10,4,D.x+D.w/2,yb+10,260);g.addColorStop(0,"rgba(150,232,242,0.22)");g.addColorStop(1,"rgba(150,232,242,0)");c.save();c.translate(D.x+D.w/2,yb+10);c.scale(1,0.3);c.translate(-D.x-D.w/2,-yb-10);c.fillStyle=g;c.fillRect(D.x-300,yb-290,D.w+600,600);c.restore();
  g=c.createLinearGradient(0,yb,0,yb+170);g.addColorStop(0,"rgba(120,210,220,0.10)");g.addColorStop(1,"rgba(120,210,220,0)");c.fillStyle=g;c.fillRect(P.x,yb,P.w,170);}
// the platform's name over it, and its door lit brighter (k 0 to 1) as something it vouches for passes
function ns_platformLabel(ctx,a){if(a>0)dp_T(ctx,"The data platform",NS_PLAT.x+NS_PLAT.w/2,NS_PLAT.y-24,{w:700,size:30,align:"center",col:"cyan",a});}
function ns_door(ctx,k,col){if(!(k>0))return;const D=NS_DOOR,c=dp_f(col||"cyan");dp_halo(ctx,D.x+D.w/2,D.y+D.h*0.55,220,c,0.22*k);
  ctx.save();ctx.globalCompositeOperation="lighter";rr(ctx,D.x,D.y,D.w,D.h,8);ctx.fillStyle=rgba(c,0.22*k);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the nightly job, and what it carries
   ns_badge: the job's badge from Who is it, really? (600 x 372 at s 1): a workload, cyan, owned by Sam, with the loader role.
   ns_badgeMini: the same badge far off, too small to read, so it has no words at all. ns_clip: the clip that holds a sealed card to the
   badge. ns_secret: the sealed card itself (dp_sealed), with o.bearer laying "Pay the bearer" across it. */
const NS_BW=600,NS_BH=372;
function ns_badge(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0))return;dp_badge(ctx,x,y,NS_BW,NS_BH,{kind:"Workload",col:"cyan",title:"registrar-loader",
  lines:[["Owned by Sam Okafor"],["Loader role","cyan"]],pic:dp_gearPic,mrz:"WKL<REGISTRAR<LOADER<<<<<<<<<<<<<<<",t:o.t,scan:o.scan,a,behind:o.behind});
  if(o.glow>0)ns_glow(ctx,x,y,NS_BW,NS_BH,o.glow*a);}
function ns_badgeMini(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  dp_badge(ctx,0,0,NS_BW,NS_BH,{kind:"",col:"cyan",pic:dp_gearPic,t:o.t,behind:o.behind});if(o.glow>0)ns_glow(ctx,0,0,NS_BW,NS_BH,o.glow);
  if(o.card>0){ns_clipLine(ctx,NS_BW/2,NS_BH,o.card);ctx.save();ctx.globalAlpha*=o.card;dp_frost(ctx,40,NS_BH+44,NS_BW-80,110,null,{r:18,behind:o.behind});dp_lock(ctx,100,NS_BH+96,60,"violet",0);ctx.restore();}
  ctx.restore();}
// the cyan glow round a badge where the platform vouches for it (k 0 to 1)
function ns_glow(ctx,x,y,w,h,k){if(!(k>0))return;const c=DP.F.cyan;dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.85,"cyan",0.16*k);
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.shadowColor=rgba(c,1);ctx.shadowBlur=34*k;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.4),0.9*k);ctx.lineWidth=4;rr(ctx,x-8,y-8,w+16,h+16,30);ctx.stroke();ctx.restore();}
// a clip from a badge's foot (x, y) down to the card under it
function ns_clipLine(ctx,x,y,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(200,236,240,0.85)";ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x-16,y-6);ctx.lineTo(x-16,y+40);ctx.moveTo(x+16,y-6);ctx.lineTo(x+16,y+40);ctx.stroke();rr(ctx,x-30,y+30,60,16,6);ctx.fillStyle="rgba(170,215,222,0.95)";ctx.fill();ctx.restore();}
// a sealed card (the secret), with "Pay the bearer" across it when o.bearer > 0; returns its box
function ns_secret(ctx,x,y,w,label,o){o=o||{};const bb=dp_sealed(ctx,x,y,w,label,o);if(o.bearer>0)ns_bearer(ctx,x+w-18,y-26,o.bearer*(o.a==null?1:o.a),{align:"right"});return bb;}
// "Pay the bearer": a slip of ice with dark-ink words, laid across bearer paper and, later, across a secret
function ns_bearer(ctx,x,y,a,o){o=o||{};if(!(a>0))return;const w=dp_tw(ctx,"Pay the bearer",{w:800,size:30})+56,h=62,x0=o.align==="right"?x-w:o.align==="center"?x-w/2:x;
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x0+w/2,y+h/2,lerp(0.8,1,ag_eo(a)));ctx.translate(x0+w/2,y+h/2);ctx.rotate(-0.035);ctx.translate(-x0-w/2,-y-h/2);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=14;ctx.shadowOffsetY=4;rr(ctx,x0,y,w,h,10);ctx.fillStyle=rgba(NS_ICE,1);ctx.fill();ctx.restore();
  rr(ctx,x0+5,y+5,w-10,h-10,7);ctx.strokeStyle=rgba(mix(NS_ICE,[20,40,46],0.45),1);ctx.lineWidth=1.6;ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);
  dp_T(ctx,"Pay the bearer",x0+28,y+42,{w:800,size:30,col:DP.on});ctx.restore();}

/* ---------------------------------------------------------------- words on the frame */
// a chapter's kicker, top left, for its first seconds (from 1 s, once the chapter before has gone: its title card names the film too)
function ns_kick(ctx,S,t,name,t0,t1){const a=ag_in(t,t0==null?1.0:t0,0.6)*(1-ag_in(t,t1==null?6:t1,0.7));if(a>0)ns_scr(ctx,S,()=>dp_kicker(ctx,NS_TITLE,name,{a}));}
// a place and its year, top left, held in screen space while the camera moves
function ns_where(ctx,S,s,a){if(a>0)ns_scr(ctx,S,()=>dp_tag(ctx,64,52,s,NS_ICE,{a,size:30}));}
// draws fn in screen space from inside a shot (so it stays put while the camera moves, and dissolves with its shot)
function ns_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a card that springs in at t0 and leaves at t1 (null: stays)
function ns_card(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.45)*(t1==null?1:1-ag_in(t,t1,0.45));if(a<=0)return null;
  return dp_card(ctx,x,y,w,words,Object.assign({},o,{a,k:ag_spr(t,t0,0.7)}));}
function ns_pillAt(ctx,x,y,text,col,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a<=0)return;
  ctx.save();const k=lerp(0.6,1,ag_spr(t,t0,0.6)),w=dp_tw(ctx,text,{w:700,size:o.size||28})+36;const cx=o.align==="center"?x:o.align==="right"?x-w/2:x+w/2;
  ag_about(ctx,cx,y-12,k);dp_pill(ctx,x,y,text,col,Object.assign({},o,{a}));ctx.restore();}

/* ---------------------------------------------------------------- small things the chapters show */
// the clock on a pane: "02:00"
function ns_clock(ctx,x,y,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,250,112,{col:NS_ICE,r:18,glowR:30});
  dp_T(ctx,"02:00",x+125,y+78,{w:500,size:58,f:"mono",align:"center",ls:2});ctx.restore();}
// a short note with a seal, from where the job runs: whose it is (o.title), where from (o.from), and now (the federation rung); 470 x 176
function ns_note(ctx,x,y,a,t,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,470,176,{col:"green",r:16,glowR:30,behind:o.behind});
  dp_T(ctx,o.title||"registrar-loader",x+26,y+50,{w:700,size:30});dp_T(ctx,o.from||"from the build service",x+26,y+94,{w:600,size:28,col:"mut"});dp_T(ctx,"now",x+26,y+138,{w:700,size:28,col:"green"});
  dp_seal(ctx,x+408,y+112,46,t||1,1);dp_lock(ctx,x+408,y+116,34,"green",0);ctx.restore();}
// a pass the platform makes for one run: small, with no secret anyone keeps; its two facts tick on
function ns_pass(ctx,x,y,a,p1,p2){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,330,160,{col:"cyan",r:16,glowR:30});
  dp_T(ctx,"A pass",x+24,y+46,{w:800,size:30,col:"cyan"});dp_tick(ctx,x+44,y+90,"green",p1);dp_T(ctx,"One run",x+76,y+100,{w:700,size:28,a:ag_in(p1,0.3,0.4)});
  dp_tick(ctx,x+44,y+132,"green",p2);dp_T(ctx,"Under an hour",x+76,y+142,{w:700,size:28,a:ag_in(p2,0.3,0.4)});ctx.restore();}
// a vault for one secret: a pane with a lock, the sealed card inside it (o.label), turned over once as a machine changes it (turn 0 to 1)
// into a new one (o.label2)
function ns_vault(ctx,x,y,w,h,a,turn,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:"violet",r:20,glowR:36,behind:o.behind});
  dp_T(ctx,o.title||"A vault",x+30,y+56,{w:800,size:30});dp_lock(ctx,x+w-56,y+50,46,"violet",o.open||0);
  const cx=x+w/2,cy=y+h*0.62,k=Math.cos(Math.PI*clamp(turn||0,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(Math.max(0.04,Math.abs(k)),1);ctx.translate(-cx,-cy);
  // turned edge-on, the card's words can't be read, and aren't meant to be: decoration for that moment (PH_OFF, the phone check's hook)
  const edge=Math.abs(k)<0.8;if(edge)PH_OFF++;try{dp_sealed(ctx,cx-(w-80)/2,cy-48,w-80,(turn||0)>0.5?(o.label2||"A new secret"):(o.label||"The job's secret"),{behind:o.behind});}finally{if(edge)PH_OFF--;}
  ctx.restore();ctx.restore();}
// a key that stays with the job (the certificate rung), and the signature it sends instead (sig 0 to 1, along the line to (bx, by))
function ns_key(ctx,x,y,s,col,a){if(!(a>0))return;const c=dp_f(col||"violet");ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=12;
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.arc(-34,0,20,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(44,0);ctx.moveTo(30,0);ctx.lineTo(30,14);ctx.moveTo(42,0);ctx.lineTo(42,10);ctx.stroke();ctx.restore();}
function ns_signature(ctx,a,b,u,a0){if(!(u>0)||!(a0>0))return;ctx.save();ctx.globalAlpha*=a0;dp_link(ctx,a,b,"cyan",u,{dash:[10,8],dot:true});
  const p=[lerp(a[0],b[0],Math.min(1,u)),lerp(a[1],b[1],Math.min(1,u))];if(u<1){ctx.save();ctx.shadowColor=rgba(DP.F.cyan,1);ctx.shadowBlur=16;ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),1);ctx.lineWidth=3.4;ctx.lineCap="round";
    ctx.beginPath();for(let i=0;i<=16;i++){const q=i/16,X=p[0]-34+q*44,Y=p[1]-6+Math.sin(q*TAU*1.5)*8*(1-q*0.4);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();ctx.restore();}ctx.restore();}
// a stamp that ends a secret: coral, "Ended", landing at k (0 to 1)
function ns_ended(ctx,x,y,k,a){if(!(k>0)||!(a>0))return;const s=lerp(1.7,1,ag_eo(Math.min(1,k*1.6))),al=Math.min(1,k*2.5)*a;ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);ctx.rotate(-0.12);ctx.scale(s,s);
  const w=dp_tw(ctx,"Ended",{w:800,size:36})+48;ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=14;rr(ctx,-w/2,-32,w,64,10);ctx.fillStyle=rgba(DP.F.coral,1);ctx.fill();ctx.shadowBlur=0;
  rr(ctx,-w/2+5,-27,w-10,54,7);ctx.strokeStyle=rgba(DP.on,0.55);ctx.lineWidth=2;ctx.stroke();dp_T(ctx,"Ended",0,13,{w:800,size:36,align:"center",col:DP.on});ctx.restore();}
// paper that's worth nothing now: a sealed card greyed, as old paper is
// an ended secret loses its colour: the card goes grey where it is (its light kept, so its words still stand out), and a little darker
function ns_grey(ctx,x,y,w,h,k){if(!(k>0))return;ctx.save();rr(ctx,x,y,w,h,18);ctx.globalCompositeOperation="saturation";ctx.fillStyle=`rgba(128,128,128,${clamp(k,0,1).toFixed(3)})`;ctx.fill();
  ctx.globalCompositeOperation="source-over";ctx.fillStyle=`rgba(4,10,14,${(0.22*clamp(k,0,1)).toFixed(3)})`;ctx.fill();ctx.restore();}
// a small pane holding a copy of the secret: where it was found, and the sealed card in it; 470 x 190
const NS_CPW=470,NS_CPH=190;
function ns_copyPane(ctx,x,y,title,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,NS_CPW,NS_CPH,{col:NS_ICE,r:18,glowR:28,behind:o.behind});
  dp_T(ctx,title,x+26,y+46,{w:700,size:30});const k=o.card==null?1:o.card;if(k>0){ctx.save();ctx.globalAlpha*=k;dp_sealed(ctx,x+20,y+70,NS_CPW-40,"Jun Park's token",{behind:o.behind});ctx.restore();}
  if(o.ended>0){ns_grey(ctx,x+20,y+70,NS_CPW-40,96,o.ended);ns_ended(ctx,x+NS_CPW-92,y+38,o.ended,1);}ctx.restore();}
