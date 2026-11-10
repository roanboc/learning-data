/* ===== No secret to lose: the two ladders =====
   The ways a job proves who it is, from worst to best, by who holds a secret and for how long (Who holds a secret?, Up the ladder), and
   the same for people (A ladder for people). Each ladder stands at the right of its room, rungs of frosted glass between two rails of
   light, worst at the bottom; what each rung means is drawn at the left, one picture at a time. A lower rung carries a sealed card at its
   right end, smaller as the ladder climbs; the top two of the job's ladder carry none. Rung k is 0 at the bottom. */

const NS_RAIL=[868,1832];
// the job's ladder: six rungs; the people's: five
const NS_WL={x:884,w:932,h:108,step:126,y0:764,rungs:[
  {name:"A person's token, or a shared password",pill:"A person · no end date",col:"coral",card:212},
  {name:"A token of the job's own",pill:"The job · often no end date",col:NS_ICE,card:178},
  {name:"A secret in a vault, changed by a machine",pill:"A vault · a month",col:NS_ICE,card:146},
  {name:"A certificate",pill:"The job · a year",col:NS_ICE,card:116},
  {name:"A note from where it runs",pill:"Nobody · one run",col:"green"},
  {name:"An identity the platform gives it",pill:"Nobody · one run",col:"green"}]};
const NS_PL={x:884,w:932,h:118,step:146,y0:752,rungs:[
  {name:"A shared account",col:"coral",card:212},
  {name:"A password alone",col:NS_ICE,card:178},
  {name:"A code by text",col:NS_ICE,card:146},
  {name:"An app on your phone",col:NS_ICE,card:116},
  {name:"A passkey or a security key",col:"green"}]};
const ns_rungY=(L,k)=>L.y0-k*L.step;
// the rails, drawn on from the floor up (u 0 to 1)
function ns_rails(ctx,L,u,a){if(!(u>0)||!(a>0))return;const top=ns_rungY(L,L.rungs.length-1)-28,bot=L.y0+L.h+24,y=lerp(bot,top,ag_sine(u));ctx.save();ctx.globalAlpha*=a;
  for(const x of NS_RAIL){const g=ctx.createLinearGradient(0,y,0,bot);g.addColorStop(0,rgba(DP.ice,0.9));g.addColorStop(1,rgba(DP.ice,0.35));ctx.save();ctx.shadowColor=rgba(DP.ice,0.7);ctx.shadowBlur=14;
    ctx.fillStyle=g;rr(ctx,x-5,y,10,bot-y,5);ctx.fill();ctx.restore();}ctx.restore();}
/* one rung: in (0 to 1, springs it in), its words (0 to 1), its sealed card (0 to 1), lit (0 to 1, a glow in its colour), dim (0 to 1) */
function ns_rung(ctx,L,k,o){o=o||{};const R=L.rungs[k],y=ns_rungY(L,k),a=(o.in==null?1:o.in)*(1-0.7*(o.dim||0));if(!(a>0))return;const col=R.col;
  ctx.save();ctx.globalAlpha*=a;const s=lerp(0.92,1,ag_eo(o.in==null?1:o.in));ag_about(ctx,L.x+L.w/2,y+L.h/2,s);
  if(o.lit>0)dp_halo(ctx,L.x+L.w/2,y+L.h/2,L.w*0.6,col,0.18*o.lit);
  dp_panel(ctx,L.x,y,L.w,L.h,{col,r:18,glowR:o.lit>0?50:28,glowA:1+(o.lit||0)});
  const wa=o.words==null?1:o.words;if(wa>0){const one=!R.pill;dp_T(ctx,R.name,L.x+30,y+(one?L.h/2+12:46),{w:700,size:one?34:32,a:wa});
    if(R.pill)dp_pill(ctx,L.x+30,y+92,R.pill,col===NS_ICE?"violet":col==="coral"?"violet":"green",{a:wa,glow:10});}
  const ca=o.card==null?1:o.card;if(R.card&&ca>0)ns_cardIcon(ctx,L.x+L.w-26-R.card,y+L.h/2-R.card*0.24,R.card,ca);
  ctx.restore();}
// a sealed card too small to read: a secret, shown by its frost and lock alone (no words, so the checks don't count it)
function ns_cardIcon(ctx,x,y,w,a){if(!(a>0))return;const h=w*0.48;ctx.save();ctx.globalAlpha*=a;dp_frost(ctx,x,y,w,h,null,{r:12});dp_lock(ctx,x+h*0.52,y+h*0.5,h*0.56,"violet",0);
  ctx.fillStyle="rgba(225,238,245,0.55)";rr(ctx,x+h*0.98,y+h*0.36,w-h*1.3,7,3.5);ctx.fill();rr(ctx,x+h*0.98,y+h*0.58,(w-h*1.3)*0.66,7,3.5);ctx.fill();ctx.restore();}
// the whole ladder: rails, then each rung as o.rung(k) says ({in, words, card, lit, dim}), bottom first
function ns_ladder(ctx,L,o){o=o||{};ns_rails(ctx,L,o.rails==null?1:o.rails,o.a==null?1:o.a);for(let k=0;k<L.rungs.length;k++){const r=o.rung?o.rung(k):{};if(r)ns_rung(ctx,L,k,Object.assign({},r,{in:(r.in==null?1:r.in)*(o.a==null?1:o.a)}));}}
// the green band beside the top two rungs: "Nobody holds a secret"
function ns_goal(ctx,L,a){if(!(a>0))return;const y1=ns_rungY(L,5),y0=ns_rungY(L,4)+L.h,cy=(y1+y0)/2;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.strokeStyle=rgba(DP.F.green,1);ctx.shadowColor=rgba(DP.F.green,0.8);ctx.shadowBlur=10;ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(L.x-26,y1+8);ctx.lineTo(L.x-46,y1+8);ctx.lineTo(L.x-46,y0-8);ctx.lineTo(L.x-26,y0-8);ctx.moveTo(L.x-46,cy);ctx.lineTo(L.x-70,cy);ctx.stroke();ctx.restore();
  const w=dp_tw(ctx,"Nobody holds a secret",{w:700,size:30})+36;ag_about(ctx,L.x-80-w/2,cy,lerp(0.7,1,ag_eo(a)));dp_pill(ctx,L.x-80,cy+12,"Nobody holds a secret","green",{size:30,align:"right"});ctx.restore();}

/* ---------------------------------------------------------------- what each rung means, drawn at the left (x 150 to 800) */
// a small platform: a block of clear glass with a lit door, at the right of the pictures (the door lights brighter by k)
const NS_MP={x:590,y:236,w:200,h:420};
function ns_miniPlatform(ctx,a,k,o){o=o||{};if(!(a>0))return;const P=NS_MP,D={x:P.x+60,y:P.y+P.h-150,w:80,h:150};ctx.save();ctx.globalAlpha*=a;
  dp_halo(ctx,P.x+P.w/2,P.y+P.h/2,P.w*1.1,"cyan",0.07);ctx.save();rr(ctx,P.x,P.y,P.w,P.h,8);ctx.fillStyle="rgba(10,34,40,0.72)";ctx.fill();ctx.clip();
  const R=ag_rnd(77);for(let f=0;f<6;f++)for(let j=0;j<3;j++){ctx.fillStyle=rgba(DP.F.cyan,0.10+0.14*R());rr(ctx,P.x+20+j*58,P.y+34+f*40,40,8,4);ctx.fill();}
  const g=ctx.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"rgba(150,232,242,0.28)");g.addColorStop(1,"rgba(200,250,250,0.5)");ctx.fillStyle=g;ctx.fillRect(D.x,D.y,D.w,D.h);ctx.restore();
  ctx.save();ctx.shadowColor=rgba(DP.ice,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(DP.ice,0.8);ctx.lineWidth=2;rr(ctx,P.x+1,P.y+1,P.w-2,P.h-2,8);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2;ctx.strokeRect(D.x,D.y,D.w,D.h);
  if(k>0){dp_halo(ctx,D.x+D.w/2,D.y+D.h/2,150,"cyan",0.25*k);ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(DP.F.cyan,0.25*k);ctx.fillRect(D.x,D.y,D.w,D.h);ctx.restore();}
  if(o.label!==false)dp_T(ctx,"The platform",P.x+P.w/2,P.y-22,{w:700,size:28,align:"center",col:"cyan"});ctx.restore();}
const NS_MPDOOR=[NS_MP.x+100,NS_MP.y+NS_MP.h-75];
// the job's badge, small (no words), where the pictures put it
function ns_jobSmall(ctx,x,y,s,a,t,o){ns_badgeMini(ctx,x,y,s,Object.assign({t,a},o||{}));}
// a person's outline, large, behind the job (the bottom rung: the job runs as someone else)
function ns_ghost(ctx,x,y,s,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a*0.85;ctx.translate(x,y);ctx.scale(s,s);dp_personPic(ctx,0,0,"coral");ctx.restore();}
