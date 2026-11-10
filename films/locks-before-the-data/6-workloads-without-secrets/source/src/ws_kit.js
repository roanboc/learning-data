/* ===== Workloads without secrets: the film's own helpers =====
   Small things the chapters share, with the prefix ws_ (the module's kit is never changed for one film): a chapter's moments made once,
   a value that fades in at a word and out at another, the chapter's kicker; the university's hall, with the data platform painted in it
   as a tall block of clear glass with one door; the door's light; the job's badge and its card; Jun's token as a sealed card, and its
   copies; the sign-in ladder of No secret to lose; GitHub's signed note and the platform's pass; lines of code on glass. Sizes are in
   the 1920 x 1080 frame; every word at least 28 px as seen. */

// made once per chapter, the first time it draws: its cues are known by then
const ws_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// in at t0, out at t1 (or never), over d seconds
const ws_io=(t,t0,t1,d)=>t1==null?ag_in(t,t0,d||0.5):ag_io(t,t0,t1,d||0.5);
// the chapter's kicker, top left, drawn over the shots in the frame's own space: in from t0, out at t1
function ws_kick(ctx,S,t,top,title,t0,t1){const a=ws_io(t,t0,t1,0.6);if(a<=0)return;setScreen(ctx,S);dp_kicker(ctx,top,title,{a});}
// a spring in, from half size, about a point, for something that appears: returns the scale
const ws_k=(t,t0)=>Math.min(1,ag_spr(t,t0,0.5));

/* ---------------------------------------------------------------- the hall, and the platform in it
   The platform: a tall block of clear glass at the right (x 1420 to 1760, from y 150 to its foot at 860), its one door in the middle
   of its foot (x 1532 to 1648, from y 622). Painted into the place, so it stays put in every shot of the hall. */
const WS_PF={x:1420,y:150,w:340,h:710,door:{x:1532,y:622,w:116,h:238}};
function ws_platformPaint(c){const P=WS_PF,ice=DP.ice,cy=DP.F.cyan;
  // its gloss on the floor first, then the glass: a faint sheen, mullions, the edges catching the light
  let g=c.createLinearGradient(0,P.y+P.h,0,P.y+P.h+170);g.addColorStop(0,"rgba(150,225,230,0.10)");g.addColorStop(1,"rgba(150,225,230,0)");c.fillStyle=g;c.fillRect(P.x,P.y+P.h,P.w,170);
  c.save();c.beginPath();c.rect(P.x,P.y,P.w,P.h);c.clip();
  g=c.createLinearGradient(P.x,P.y,P.x+P.w,P.y+P.h);g.addColorStop(0,"rgba(200,245,245,0.10)");g.addColorStop(0.4,"rgba(200,245,245,0.03)");g.addColorStop(0.55,"rgba(200,245,245,0.08)");g.addColorStop(1,"rgba(200,245,245,0.02)");
  c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  // floors inside the block, faint, and the rows of the records on them, as lights far in
  for(let k=1;k<6;k++){const y=P.y+k*P.h/6;c.fillStyle="rgba(170,235,235,0.07)";c.fillRect(P.x+8,y,P.w-16,1.4);
    for(let j=0;j<7;j++){const rx=P.x+30+j*42,rg=c.createRadialGradient(rx,y-14,0,rx,y-14,16);rg.addColorStop(0,"rgba(176,150,255,0.16)");rg.addColorStop(1,"rgba(176,150,255,0)");c.fillStyle=rg;c.fillRect(rx-16,y-30,32,32);}}
  c.restore();
  c.save();c.shadowColor=rgba(cy,0.8);c.shadowBlur=14;c.fillStyle=rgba(mix(cy,[255,255,255],0.45),0.9);
  c.fillRect(P.x,P.y,P.w,2.4);c.fillRect(P.x,P.y,2.4,P.h);c.fillRect(P.x+P.w-2.4,P.y,2.4,P.h);c.restore();
  c.fillStyle=rgba(ice,0.22);for(const f of [0.33,0.66])c.fillRect(P.x+P.w*f,P.y+4,1.2,P.h-4);
  // the door: a frame of light, dark inside until someone may pass
  const D=P.door;c.fillStyle="rgba(4,14,18,0.82)";c.fillRect(D.x,D.y,D.w,D.h);
  c.save();c.shadowColor=rgba(cy,0.7);c.shadowBlur=10;c.strokeStyle=rgba(mix(cy,[255,255,255],0.3),0.85);c.lineWidth=2.4;c.strokeRect(D.x,D.y,D.w,D.h);c.restore();}
AG_PLACES.wsHall=c=>dp_paintHall(c,{seed:61,horizon:700,vx:980,lights:16,panes:7,pools:[[330,940,520,0.11],[1590,880,380,0.08]],after:ws_platformPaint});
// the door's light: lit (0 to 1) in a meaning's colour, a glow on the floor in front of it
function ws_door(ctx,lit,col){if(!(lit>0))return;const D=WS_PF.door,c=dp_f(col||"cyan");ctx.save();ctx.globalAlpha*=clamp(lit,0,1);
  const g=ctx.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,rgba(c,0.5));g.addColorStop(1,rgba(mix(c,[255,255,255],0.4),0.75));ctx.fillStyle=g;ctx.fillRect(D.x+3,D.y+3,D.w-6,D.h-6);
  dp_halo(ctx,D.x+D.w/2,D.y+D.h,260,col||"cyan",0.22);ctx.restore();}
// the label over the platform, and the time on a slip by it
function ws_platformLabel(ctx,a){if(a<=0)return;dp_T(ctx,"The data platform",WS_PF.x+WS_PF.w/2,WS_PF.y-26,{w:700,size:30,align:"center",col:"mut",a});}

/* ---------------------------------------------------------------- the job
   Its badge, as the series draws it (cyan band, gear, the gold chip): "registrar-loader", owned by Sam Okafor; 600 x 372 at (x, y). */
function ws_badge(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+300,y+186,lerp(0.6,1,o.k));
  dp_badge(ctx,x,y,600,372,{kind:"Workload",col:"cyan",title:"registrar-loader",lines:o.lines||[["Owned by Sam Okafor"],["The nightly load · 02:00"]],pic:dp_gearPic,t:o.t,scan:o.scan,behind:o.behind});
  ctx.restore();}
/* Jun's token, a sealed card (what it is and whose, never a character of it): "Jun Park's token", made 14 March 2024, no end date;
   o.revoked strikes it through */
function ws_token(ctx,x,y,o){o=o||{};return dp_sealed(ctx,x,y,o.w||560,o.label||"Jun Park's token",{sub:o.sub===undefined?"Made 14 March 2024 · no end date":o.sub,a:o.a,revoked:o.revoked,col:o.col,behind:o.behind});}
// a small pane of glass with a name over it, and what it holds drawn in it (paint(ctx, cx, cy)): where a copy of the token is
function ws_pane(ctx,x,y,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:o.col||"grey",r:18,glowR:28,behind:o.behind});dp_T(ctx,label,x+w/2,y+48,{w:700,size:28,align:"center",col:o.labelCol||"ink"});
  if(o.paint)o.paint(ctx,x+w/2,y+h/2+22);ctx.restore();}
// a small sealed card, as in a pane: a lock and one line (each copy of the token)
function ws_sealedMini(ctx,cx,cy,o){o=o||{};const w=o.w||250,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_frost(ctx,cx-w/2,cy-40,w,80,null,{col:"violet",r:14,behind:o.behind});dp_lock(ctx,cx-w/2+40,cy-4,40,"violet",0);
  dp_T(ctx,o.label||"Jun's token",cx-w/2+74,cy+10,{w:700,size:28});
  const rv=clamp(o.revoked||0,0,1);if(rv>0){const c=dp_f("coral");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(cx-w/2+14,cy+28);ctx.lineTo(cx-w/2+14+(w-28)*ag_sine(rv),cy+28-56*ag_sine(rv));ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the ladder of No secret to lose
   Six rungs of glass, worst at the foot: a person's token or a shared password; a token of the job's own; a secret in a vault, changed
   by a machine; a certificate; a note from where the job runs, signed for each run; an identity the platform gives the job. Drawn at
   (x, y) its top, w wide; o.lit [six values, 0 to 1] lights each rung in o.cols; o.labels which rungs show their words. */
const WS_RUNGS=["An identity the platform gives it","A note signed for each run","A certificate","A secret in a vault","A token of its own","A person's token"];
function ws_ladder(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=6,gap=88,lit=o.lit||[],cols=o.cols||[],labels=o.labels||[0,1,2,3,4,5];
  ctx.save();ctx.globalAlpha*=a;const ice=DP.ice;
  // the rails
  ctx.save();ctx.strokeStyle=rgba(ice,0.5);ctx.lineWidth=3;ctx.shadowColor=rgba(DP.F.cyan,0.5);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(x,y-30);ctx.lineTo(x,y+gap*(n-1)+40);ctx.moveTo(x+w,y-30);ctx.lineTo(x+w,y+gap*(n-1)+40);ctx.stroke();ctx.restore();
  for(let i=0;i<n;i++){const ry=y+i*gap,L=clamp(lit[i]||0,0,1),col=cols[i]||"cyan";
    ctx.save();ctx.globalAlpha*=0.45+0.55*L;dp_panel(ctx,x+10,ry-26,w-20,52,{col:L>0.05?col:"grey",r:12,glowA:L,glowR:22,behind:o.behind});ctx.restore();
    if(labels.indexOf(i)>=0)dp_T(ctx,WS_RUNGS[i],x+w/2,ry+10,{w:700,size:28,align:"center",col:L>0.5?dp_t(col):"mut"});}
  ctx.restore();}

/* ---------------------------------------------------------------- GitHub's note, and the platform's pass
   The note GitHub signs for each run (its OpenID Connect token, drawn as a short card, never its characters): three lines, the
   repository, the environment and the time; GitHub's seal in its corner once signed (o.seal 0 to 1); o.col the rim (cyan, or coral for
   a note from elsewhere); o.used greys it once it's done. 520 wide, 196 tall; returns its box. */
function ws_note(ctx,x,y,lines,o){o=o||{};const w=o.w||560,h=lines.length*46+76,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;const used=clamp(o.used||0,0,1),col=o.col||"cyan";
  ctx.save();ctx.globalAlpha*=a*(1-0.55*used);if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:used>0.5?"grey":col,r:16,glowR:30,behind:o.behind});
  dp_T(ctx,o.kick||"A NOTE FROM GITHUB",x+28,y+48,{w:800,size:28,ls:3,col:used>0.5?"grey":col});
  lines.forEach((l,i)=>{const s=typeof l==="string"?l:l[0],c2=typeof l==="string"?"ink":l[1];dp_T(ctx,s,x+28,y+100+i*46,{w:600,size:28,col:c2});});
  if(o.seal>0)dp_seal(ctx,x+w-60,y+h-58,40,o.t||0,o.seal);
  ctx.restore();return bb;}
// the platform's pass: a sealed card in the identity's cyan, "A pass · registrar-loader", "Good for an hour · nobody keeps it"
function ws_pass(ctx,x,y,o){o=o||{};return dp_sealed(ctx,x,y,o.w||560,o.label||"A pass · registrar-loader",{sub:o.sub||"Good for an hour · nobody keeps it",col:"cyan",a:o.a,revoked:o.revoked,behind:o.behind});}

/* ---------------------------------------------------------------- lines of code on glass
   ws_code(ctx, x, y, lines, o): a dark strip of glass with lines in the code font, 30 px, 46 apart (each a string, or [string, colour]),
   o.w its width, o.hi (index, 0 to 1) lights a line in o.hiCol; returns its box */
function ws_code(ctx,x,y,lines,o){o=o||{};const lh=46,w=o.w||760,h=lines.length*lh+40,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  rr(ctx,x,y,w,h,14);ctx.fillStyle="rgba(2,12,16,0.78)";ctx.fill();ctx.strokeStyle=rgba(DP.T.mut,0.35);ctx.lineWidth=1.4;ctx.stroke();
  lines.forEach((l,i)=>{const s=typeof l==="string"?l:l[0],col=typeof l==="string"?"ink":l[1],ly=y+46+i*lh;
    const hi=o.hi&&o.hi[0]===i?clamp(o.hi[1],0,1):0;if(hi>0){ctx.save();ctx.globalAlpha*=hi;rr(ctx,x+8,ly-32,w-16,44,8);ctx.fillStyle=rgba(dp_f(o.hiCol||"cyan"),0.16);ctx.fill();ctx.restore();}
    dp_T(ctx,s,x+24,ly,{w:500,size:30,f:"mono",col});});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- records on their way
   ws_flow(ctx, pts, t, a, col): small lights moving along the line through pts, one every 70 px or so, in a meaning's colour (the
   registrar's records in the violet of personal data); a its strength, 0 to 1 */
function ws_flow(ctx,pts,t,a,col){if(!(a>0))return;const c=dp_f(col||"violet"),seg=[];let L=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push([L,d,pts[i-1],pts[i]]);L+=d;}
  const n=Math.max(2,Math.round(L/70)),at=u=>{const s=u*L;for(const [l0,d,p,q] of seg)if(s<=l0+d){const v=(s-l0)/d;return[lerp(p[0],q[0],v),lerp(p[1],q[1],v)];}return pts[pts.length-1];};
  ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.globalCompositeOperation="lighter";
  for(let k=0;k<n;k++){const u=((t*0.16+k/n)%1),[px,py]=at(u),f=Math.sin(Math.PI*u);dp_halo(ctx,px,py,18,col||"violet",0.35*f);ctx.fillStyle=rgba(mix(c,[255,255,255],0.4),0.9*f);ctx.beginPath();ctx.arc(px,py,4.5,0,TAU);ctx.fill();}
  ctx.restore();}
// a person of the cast in the hall, faded as one picture: who, at (x, y), scale s, o.flip to face left, o.gaze
function ws_who(ctx,who,t,a,x,y,s,o){if(!(a>0))return;o=o||{};ctx.save();ctx.globalAlpha*=clamp(a,0,1);dp_person(ctx,who,x,y,s,{t,flip:!!o.flip,gaze:o.gaze});ctx.restore();}
